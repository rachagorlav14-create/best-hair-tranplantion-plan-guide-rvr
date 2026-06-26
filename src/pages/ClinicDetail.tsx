import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Disclaimer } from "@/components/Disclaimer";
import { CLINIC_SELECTION_CHECKLIST } from "@/data/options";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, ExternalLink, MapPin, Stethoscope, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ClinicDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userGrafts, setUserGrafts] = useState(3000);
  const [addons, setAddons] = useState({ prp: false, meds: true, travel: false });
  const [check, setCheck] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("clinics").select("*").eq("id", id).maybeSingle();
      setClinic(data);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    try {
      const last = JSON.parse(localStorage.getItem("ht_calc_last") || "null");
      if (last?.graftHigh) setUserGrafts(Math.round(((last.graftLow || 0) + last.graftHigh) / 2));
    } catch {}
  }, []);

  if (loading) return <div className="container py-10">Loading…</div>;
  if (!clinic) return <div className="container py-10">Clinic not found. <Link to="/clinics" className="text-primary underline">Back to list</Link></div>;

  const lowPrice = clinic.price_per_graft_low || 0;
  const highPrice = clinic.price_per_graft_high || 0;
  const cur = clinic.currency || "INR";

  const baseLow = lowPrice * userGrafts;
  const baseHigh = highPrice * userGrafts;
  const addonLow = (addons.prp ? 5000 : 0) + (addons.meds ? 2000 : 0) + (addons.travel ? 10000 : 0);
  const addonHigh = (addons.prp ? 15000 : 0) + (addons.meds ? 5000 : 0) + (addons.travel ? 40000 : 0);
  const totalLow = baseLow + addonLow;
  const totalHigh = baseHigh + addonHigh;
  const totalMid = Math.round((totalLow + totalHigh) / 2);

  const fmt = (n: number) => `${cur} ${n.toLocaleString()}`;

  const checkedCount = Object.values(check).filter(Boolean).length;

  return (
    <div className="container py-10 max-w-6xl">
      <Link to="/clinics" className="text-sm text-muted-foreground hover:text-foreground">← Back to clinics</Link>

      <header className="mt-3 mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">{clinic.name}</h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-4 w-4" /> {clinic.city}{clinic.state ? `, ${clinic.state}` : ""} · {clinic.country}</div>
        </div>
        <Badge variant={clinic.status === "verified" ? "default" : "secondary"}>{clinic.status.replace("_", " ")}</Badge>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        Estimated costs and graft numbers shown here are educational approximations. Real billing depends on
        donor quality, hair thickness, surgeon evaluation, package and city. Always get a written quote.
      </Disclaimer>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Stethoscope className="h-4 w-4" /> About</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Doctors:</span> {(clinic.doctors || []).join(", ") || "—"}</div>
              <div><span className="text-muted-foreground">Workflow:</span> {clinic.surgeon_led ? "Surgeon-led" : "Technician-supported"}</div>
              <div className="flex flex-wrap gap-1.5">
                {(clinic.techniques || []).map((t: string) => <Badge key={t} variant="outline">{t}</Badge>)}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t">
                <Stat label="Price / graft" value={lowPrice ? `${cur} ${lowPrice}–${highPrice}` : "—"} />
                <Stat label="Min package" value={clinic.min_package_price ? fmt(clinic.min_package_price) : "—"} />
                <Stat label="Consultation" value={clinic.consultation_fee != null ? fmt(clinic.consultation_fee) : "—"} />
                <Stat label="Rating" value={clinic.google_rating ? `${clinic.google_rating} (${clinic.review_count || 0})` : "—"} />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {clinic.supports_female && <Badge variant="secondary">Female HT</Badge>}
                {clinic.supports_beard && <Badge variant="secondary">Beard / BHT</Badge>}
                {clinic.supports_crown && <Badge variant="secondary">Crown</Badge>}
                {clinic.supports_mega_session && <Badge variant="secondary">Mega session</Badge>}
                {clinic.emi_available && <Badge variant="secondary">EMI</Badge>}
                {clinic.before_after && <Badge variant="secondary">Before/After available</Badge>}
              </div>
            </CardContent>
          </Card>

          {(clinic.pros?.length || clinic.cons?.length || clinic.red_flags?.length) && (
            <div className="grid md:grid-cols-3 gap-4">
              {clinic.pros?.length > 0 && (
                <Card><CardHeader><CardTitle className="text-base text-emerald-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Pros</CardTitle></CardHeader>
                  <CardContent><ul className="text-sm space-y-1 list-disc pl-5">{clinic.pros.map((x: string) => <li key={x}>{x}</li>)}</ul></CardContent></Card>
              )}
              {clinic.cons?.length > 0 && (
                <Card><CardHeader><CardTitle className="text-base">Cons</CardTitle></CardHeader>
                  <CardContent><ul className="text-sm space-y-1 list-disc pl-5">{clinic.cons.map((x: string) => <li key={x}>{x}</li>)}</ul></CardContent></Card>
              )}
              {clinic.red_flags?.length > 0 && (
                <Card><CardHeader><CardTitle className="text-base text-destructive flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Red flags</CardTitle></CardHeader>
                  <CardContent><ul className="text-sm space-y-1 list-disc pl-5">{clinic.red_flags.map((x: string) => <li key={x}>{x}</li>)}</ul></CardContent></Card>
              )}
            </div>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">How to evaluate this clinic</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Checked {checkedCount}/{CLINIC_SELECTION_CHECKLIST.length}</p>
              <div className="space-y-1.5">
                {CLINIC_SELECTION_CHECKLIST.map((item) => (
                  <label key={item} className="flex items-start gap-2 text-sm p-1.5 rounded hover:bg-muted cursor-pointer">
                    <Checkbox checked={!!check[item]} onCheckedChange={(v) => setCheck((s) => ({ ...s, [item]: !!v }))} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="bg-gradient-card border-primary/30">
            <CardHeader><CardTitle className="text-base">Cost estimate for you</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Your graft estimate: <span className="text-primary font-semibold">{userGrafts.toLocaleString()}</span></Label>
                <Slider value={[userGrafts]} min={500} max={6000} step={100} onValueChange={([v]) => setUserGrafts(v)} className="mt-2" />
                {!user && <p className="text-xs text-muted-foreground mt-1">Run the calculator first to auto-fill.</p>}
              </div>
              <div className="space-y-1.5 text-sm">
                {(["prp", "meds", "travel"] as const).map((k) => (
                  <label key={k} className="flex items-center gap-2">
                    <Checkbox checked={addons[k]} onCheckedChange={(v) => setAddons((s) => ({ ...s, [k]: !!v }))} />
                    {{ prp: "PRP / GFC", meds: "Medications", travel: "Travel & stay" }[k]}
                  </label>
                ))}
              </div>
              <div className="space-y-2 pt-2 border-t">
                <Row label="Low" value={fmt(totalLow)} />
                <Row label="Most likely" value={fmt(totalMid)} highlight />
                <Row label="High" value={fmt(totalHigh)} />
              </div>
              <p className="text-xs text-muted-foreground">Not a billing quote. Final pricing depends on in-person evaluation.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {clinic.address && <div><div className="text-muted-foreground text-xs">Address</div>{clinic.address}</div>}
              {clinic.contact && <div><div className="text-muted-foreground text-xs">Contact</div>{clinic.contact}</div>}
              {clinic.website && (
                <a href={clinic.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary">
                  Website <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {clinic.notes && <p className="text-xs text-muted-foreground pt-2 border-t">{clinic.notes}</p>}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>
);
const Row = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className={`flex items-center justify-between rounded-md px-3 py-2 ${highlight ? "bg-primary/10 text-primary font-semibold" : "bg-secondary/60"}`}>
    <span className="text-xs uppercase">{label}</span>
    <span className="font-display">{value}</span>
  </div>
);
