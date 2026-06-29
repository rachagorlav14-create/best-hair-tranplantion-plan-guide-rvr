import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Disclaimer } from "@/components/Disclaimer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PHOTO_AREAS, PHOTO_INSTRUCTIONS } from "@/data/options";
import { toast } from "sonner";
import { Trash2, Upload, Camera, Sparkles, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { guestPhotos, guestAssessment, fileToDataUrl, type GuestPhoto } from "@/lib/guest";

type PhotoRow = {
  id: string;
  area: string;
  storage_path?: string;
  severity: number | null;
  notes: string | null;
  url?: string;
  dataUrl?: string;
};

export default function PhotoAssessment() {
  const { user } = useAuth();
  const isGuest = !user;
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const load = async () => {
    setLoading(true);
    if (isGuest) {
      const guest = guestPhotos.list();
      setPhotos(guest.map((g) => ({ id: g.id, area: g.area, severity: g.severity, notes: g.notes || null, dataUrl: g.dataUrl })));
    } else {
      const { data } = await supabase
        .from("scalp_photos").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
      const withUrls: PhotoRow[] = [];
      for (const row of data || []) {
        const { data: signed } = await supabase.storage.from("scalp-photos").createSignedUrl(row.storage_path, 3600);
        withUrls.push({ ...row, url: signed?.signedUrl });
      }
      setPhotos(withUrls);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const upload = async (areaKey: string, file: File) => {
    setUploading(areaKey);
    try {
      if (isGuest) {
        const dataUrl = await fileToDataUrl(file);
        const p: GuestPhoto = { id: crypto.randomUUID(), area: areaKey, dataUrl, severity: 0, createdAt: Date.now() };
        guestPhotos.upsert(p);
      } else {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user!.id}/${areaKey}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("scalp-photos").upload(path, file, { upsert: false, contentType: file.type });
        if (upErr) throw upErr;
        const { error: insErr } = await supabase.from("scalp_photos").insert({ user_id: user!.id, area: areaKey, storage_path: path, severity: 0 });
        if (insErr) throw insErr;
      }
      toast.success("Photo added");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally { setUploading(null); }
  };

  const updateRow = async (id: string, patch: { severity?: number; notes?: string }) => {
    setPhotos((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    if (isGuest) {
      const row = guestPhotos.list().find((g) => g.id === id);
      if (row) guestPhotos.upsert({ ...row, ...patch });
    } else {
      await supabase.from("scalp_photos").update(patch).eq("id", id);
    }
  };

  const remove = async (row: PhotoRow) => {
    if (!confirm("Delete this photo?")) return;
    if (isGuest) guestPhotos.remove(row.id);
    else {
      if (row.storage_path) await supabase.storage.from("scalp-photos").remove([row.storage_path]);
      await supabase.from("scalp_photos").delete().eq("id", row.id);
    }
    setPhotos((p) => p.filter((r) => r.id !== row.id));
  };

  const analyze = async () => {
    if (photos.length < 2) {
      toast.error("Upload at least 2 photos for a meaningful estimate (front + crown ideally)");
      return;
    }
    setAnalyzing(true);
    try {
      // Build payload — for guest use dataUrl directly; for signed-in fetch dataUrl from signed URL
      const photoPayload: { area: string; dataUrl: string }[] = [];
      for (const p of photos.slice(0, 7)) {
        if (p.dataUrl) {
          photoPayload.push({ area: p.area, dataUrl: p.dataUrl });
        } else if (p.url) {
          const blob = await fetch(p.url).then((r) => r.blob());
          const reader = new FileReader();
          const dataUrl: string = await new Promise((res, rej) => {
            reader.onload = () => res(String(reader.result));
            reader.onerror = rej;
            reader.readAsDataURL(blob);
          });
          photoPayload.push({ area: p.area, dataUrl });
        }
      }

      const meta = { severities: Object.fromEntries(photos.map((p) => [p.area, p.severity || 0])) };

      const { data, error } = await supabase.functions.invoke("analyze-photos", {
        body: { photos: photoPayload, meta },
      });
      if (error) throw error;
      const r = data?.result || {};
      const assessment = {
        norwoodStage: r.norwood_stage || undefined,
        ludwigStage: r.ludwig_stage || undefined,
        pattern: r.pattern || undefined,
        affectedZones: r.affected_zones || [],
        graftLow: r.graft_estimate_low || undefined,
        graftHigh: r.graft_estimate_high || undefined,
        zoneSplit: r.zone_split || undefined,
        donorQuality: r.donor_quality || undefined,
        sessions: r.sessions_required || undefined,
        confidence: r.confidence_score || undefined,
        riskFlags: r.risk_flags || [],
        notes: r.notes || "",
        isDemo: false,
        updatedAt: Date.now(),
      };
      guestAssessment.set(assessment);
      // Save to DB for signed-in users
      if (!isGuest) {
        const { data: job } = await supabase.from("photo_analysis_jobs").insert({
          user_id: user!.id, status: "completed", source: "user", inputs: meta,
        }).select().single();
        if (job) {
          await supabase.from("photo_analysis_results").insert({
            job_id: job.id, user_id: user!.id,
            norwood_stage: r.norwood_stage, ludwig_stage: r.ludwig_stage, pattern: r.pattern,
            affected_zones: r.affected_zones, graft_estimate_low: r.graft_estimate_low,
            graft_estimate_high: r.graft_estimate_high, zone_split: r.zone_split,
            donor_quality: r.donor_quality, sessions_required: r.sessions_required,
            risk_flags: r.risk_flags, confidence_score: r.confidence_score, notes: r.notes,
            raw_response: r, is_demo: false,
          });
        }
      }
      toast.success("Assessment ready!");
      window.location.href = "/planning";
    } catch (e: any) {
      toast.error(e?.message || "Analysis failed. Please try again.");
    } finally { setAnalyzing(false); }
  };

  return (
    <div className="container py-10 max-w-6xl">
      <header className="mb-6">
        <div className="text-xs uppercase tracking-wider text-primary mb-2">Step 1</div>
        <h1 className="font-display text-3xl md:text-5xl font-bold">Photo Assessment</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Upload scalp photos from multiple angles. AI gives a preliminary stage and graft estimate —
          always confirmed later by a surgeon.
        </p>
      </header>

      {isGuest && (
        <div className="glass-gold rounded-2xl p-5 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-sm">Guest mode — photos stay on this device.</div>
            <div className="text-xs text-muted-foreground mt-1">
              Create a free profile to save your assessment, sync across devices and unlock the recovery tracker.
            </div>
          </div>
          <Button asChild size="sm" className="bg-gradient-gold text-primary-foreground rounded-xl">
            <Link to="/auth">Create profile <ArrowRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
      )}

      <Disclaimer tone="warning" className="mb-6">
        AI-assisted preliminary estimate based on photo visibility and your inputs. <strong>Not a diagnosis.</strong>
        A qualified hair-transplant surgeon must examine you in person before any treatment.
      </Disclaimer>

      <Card className="mb-6 glass border-border/40">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Camera className="h-5 w-5" /> Photo tips</CardTitle></CardHeader>
        <CardContent>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground list-disc pl-5">
            {PHOTO_INSTRUCTIONS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {PHOTO_AREAS.map((area) => {
              const rows = photos.filter((p) => p.area === area.key);
              return (
                <div key={area.key} className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-display font-semibold">{area.label}</div>
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-gold text-primary-foreground text-xs font-medium cursor-pointer hover:opacity-90">
                      <Upload className="h-3.5 w-3.5" />
                      {uploading === area.key ? "Uploading…" : "Upload"}
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => e.target.files?.[0] && upload(area.key, e.target.files[0])} />
                    </label>
                  </div>
                  {rows.length === 0 && (
                    <div className="aspect-video rounded-lg border border-dashed border-border/40 flex items-center justify-center text-xs text-muted-foreground">
                      No photo yet
                    </div>
                  )}
                  {rows.map((row) => (
                    <div key={row.id} className="space-y-2 mt-2">
                      <img src={row.dataUrl || row.url} alt={area.label} className="w-full max-h-56 object-cover rounded-lg border border-border/30" />
                      <div>
                        <Label className="text-xs">Severity: <span className="text-primary font-semibold">{row.severity ?? 0}/5</span></Label>
                        <Slider value={[row.severity ?? 0]} min={0} max={5} step={1}
                          onValueChange={([v]) => updateRow(row.id, { severity: v })} />
                      </div>
                      <Textarea rows={2} placeholder="Notes (optional)" value={row.notes || ""}
                        onChange={(e) => updateRow(row.id, { notes: e.target.value })} className="text-sm" />
                      <Button size="sm" variant="ghost" onClick={() => remove(row)} className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Analyze CTA */}
          <div className="mt-8 glass-strong rounded-2xl p-6 border-gradient-gold flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow shrink-0">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-display font-semibold text-lg">Run AI photo analysis</div>
              <div className="text-sm text-muted-foreground">
                Uses an AI vision model to give a preliminary Norwood/Ludwig estimate and graft range.
              </div>
            </div>
            <Button onClick={analyze} disabled={analyzing || photos.length < 2}
              className="bg-gradient-gold text-primary-foreground rounded-xl h-11 px-5">
              {analyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing…</> : <>Analyze <ArrowRight className="h-4 w-4 ml-2" /></>}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
