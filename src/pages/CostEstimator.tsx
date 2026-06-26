import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Disclaimer } from "@/components/Disclaimer";
import { COUNTRY_PRICE_PER_GRAFT } from "@/data/sample";

const countries = Object.keys(COUNTRY_PRICE_PER_GRAFT);

const techniqueMultiplier: Record<string, number> = {
  FUE: 1, "Sapphire FUE": 1.15, DHI: 1.25, FUT: 0.85, "Robotic-assisted": 1.4,
};

const packageMultiplier: Record<string, number> = {
  Basic: 1, Standard: 1.15, Premium: 1.4, "All-inclusive (travel)": 1.55,
};

export default function CostEstimator() {
  const [country, setCountry] = useState("India");
  const [grafts, setGrafts] = useState(2500);
  const [technique, setTechnique] = useState<keyof typeof techniqueMultiplier>("FUE");
  const [pkg, setPkg] = useState<keyof typeof packageMultiplier>("Standard");
  const [doctorLed, setDoctorLed] = useState(true);
  const [addons, setAddons] = useState({ prp: false, gfc: false, meds: true, tests: true, travel: false });

  const result = useMemo(() => {
    const range = COUNTRY_PRICE_PER_GRAFT[country];
    const techMul = techniqueMultiplier[technique];
    const pkgMul = packageMultiplier[pkg];
    const docMul = doctorLed ? 1.15 : 1;
    const base = (low: number) => low * grafts * techMul * pkgMul * docMul;
    let low = base(range.low);
    let high = base(range.high);
    const addonAmt = (factor: number) => ({ low: factor * grafts * range.low, high: factor * grafts * range.high });
    if (addons.prp) { const a = addonAmt(0.15); low += a.low; high += a.high; }
    if (addons.gfc) { const a = addonAmt(0.2); low += a.low; high += a.high; }
    if (addons.meds) { low += 50 * 1; high += 200 * 1; }
    if (addons.tests) { low += 50; high += 250; }
    if (addons.travel) { low += 800; high += 2500; }
    const mid = (low + high) / 2;
    return { low: Math.round(low), mid: Math.round(mid), high: Math.round(high), currency: range.currency };
  }, [country, grafts, technique, pkg, doctorLed, addons]);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="container py-10 md:py-14 max-w-5xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Cost Estimator</h1>
        <p className="text-muted-foreground mt-2">Rough cost range by country, technique and add-ons. Always confirm with a written clinic quote.</p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        These are demonstration ranges from publicly known averages — not clinic-specific quotes. Real prices vary widely.
      </Disclaimer>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Your inputs</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Technique</Label>
                <Select value={technique} onValueChange={(v) => setTechnique(v as never)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(techniqueMultiplier).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Package type</Label>
                <Select value={pkg} onValueChange={(v) => setPkg(v as never)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(packageMultiplier).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-end gap-2 pb-2">
                <Checkbox checked={doctorLed} onCheckedChange={(v) => setDoctorLed(!!v)} />
                <span className="text-sm">Surgeon-led (not technician-only)</span>
              </label>
            </div>
            <div>
              <Label>Graft count: <span className="text-primary font-semibold">{grafts.toLocaleString()}</span></Label>
              <Slider value={[grafts]} min={500} max={6000} step={100} onValueChange={([v]) => setGrafts(v)} className="mt-3" />
            </div>
            <div className="grid sm:grid-cols-2 gap-2 pt-2">
              {([
                ["prp", "PRP add-on"],
                ["gfc", "GFC add-on"],
                ["meds", "Medications"],
                ["tests", "Blood tests / ECG"],
                ["travel", "Travel & stay"],
              ] as const).map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={addons[k]} onCheckedChange={(v) => setAddons((s) => ({ ...s, [k]: !!v }))} />
                  {label}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/30 self-start">
          <CardHeader><CardTitle>Estimated cost</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-secondary/60 p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Low</div>
              <div className="font-display text-2xl font-bold">{result.currency} {fmt(result.low)}</div>
            </div>
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/30">
              <div className="text-xs uppercase tracking-wide text-primary">Most likely</div>
              <div className="font-display text-3xl font-bold text-primary">{result.currency} {fmt(result.mid)}</div>
            </div>
            <div className="rounded-lg bg-secondary/60 p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">High</div>
              <div className="font-display text-2xl font-bold">{result.currency} {fmt(result.high)}</div>
            </div>
            <p className="text-xs text-muted-foreground">Excludes post-op complications, repeat sessions and unforeseen costs. Get a written quote.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
