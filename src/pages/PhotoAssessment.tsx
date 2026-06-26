import { useEffect, useState } from "react";
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
import { Trash2, Upload, Camera } from "lucide-react";

type PhotoRow = {
  id: string;
  area: string;
  storage_path: string;
  severity: number | null;
  notes: string | null;
  url?: string;
};

export default function PhotoAssessment() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("scalp_photos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    const withUrls: PhotoRow[] = [];
    for (const row of data || []) {
      const { data: signed } = await supabase.storage
        .from("scalp-photos")
        .createSignedUrl(row.storage_path, 3600);
      withUrls.push({ ...row, url: signed?.signedUrl });
    }
    setPhotos(withUrls);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const upload = async (areaKey: string, file: File) => {
    if (!user) return;
    setUploading(areaKey);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${areaKey}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("scalp-photos")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      const { error: insErr } = await supabase.from("scalp_photos").insert({
        user_id: user.id,
        area: areaKey,
        storage_path: path,
        severity: 0,
      });
      if (insErr) throw insErr;
      toast.success("Photo uploaded");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const updateRow = async (id: string, patch: { severity?: number; notes?: string }) => {
    setPhotos((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    await supabase.from("scalp_photos").update(patch).eq("id", id);
  };

  const remove = async (row: PhotoRow) => {
    if (!confirm("Delete this photo?")) return;
    await supabase.storage.from("scalp-photos").remove([row.storage_path]);
    await supabase.from("scalp_photos").delete().eq("id", row.id);
    setPhotos((p) => p.filter((r) => r.id !== row.id));
  };

  return (
    <div className="container py-10 max-w-5xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Photo Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Upload reference photos of your scalp and rate the thinning severity in each area.
        </p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        These photos and severity scores are a self-assessment aid only. They do not produce a medical
        diagnosis. A qualified hair-transplant surgeon must examine you in person.
      </Disclaimer>

      <Card className="mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" /> Photo tips</CardTitle></CardHeader>
        <CardContent>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground list-disc pl-5">
            {PHOTO_INSTRUCTIONS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {PHOTO_AREAS.map((area) => {
            const rows = photos.filter((p) => p.area === area.key);
            return (
              <Card key={area.key}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{area.label}</CardTitle>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm cursor-pointer hover:opacity-90">
                    <Upload className="h-4 w-4" />
                    {uploading === area.key ? "Uploading…" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && upload(area.key, e.target.files[0])}
                    />
                  </label>
                </CardHeader>
                <CardContent className="space-y-3">
                  {rows.length === 0 && (
                    <p className="text-sm text-muted-foreground">No photo uploaded yet.</p>
                  )}
                  {rows.map((row) => (
                    <div key={row.id} className="border rounded-lg p-3 space-y-2">
                      {row.url && (
                        <img src={row.url} alt={area.label} className="w-full max-h-56 object-cover rounded" />
                      )}
                      <div>
                        <Label className="text-xs">Thinning severity: <span className="text-primary font-semibold">{row.severity ?? 0}/5</span></Label>
                        <Slider
                          value={[row.severity ?? 0]}
                          min={0} max={5} step={1}
                          onValueChange={([v]) => updateRow(row.id, { severity: v })}
                        />
                      </div>
                      <Textarea
                        rows={2}
                        placeholder="Notes (e.g. itching, recent shedding)"
                        value={row.notes || ""}
                        onChange={(e) => updateRow(row.id, { notes: e.target.value })}
                      />
                      <Button size="sm" variant="ghost" onClick={() => remove(row)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
