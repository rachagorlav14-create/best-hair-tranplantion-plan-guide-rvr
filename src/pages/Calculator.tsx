import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Disclaimer, ConfidenceBadge } from "@/components/Disclaimer";
import { CalcInputs, estimate } from "@/lib/calculator";
import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";

const TOTAL_STEPS = 5;

const initial: CalcInputs = {
  hairlineRecession: 1,
  templeLoss: 1,
  midScalpThinning: 0,
  crownSize: 0,
  diffuseThinning: 0,
  donorQuality: "good",
  hairCaliber: "medium",
  scalpContrast: "medium",
  targetDensityPct: 55,
  ageGroup: "25-34",
  sex: "male",
};

function ScaleField({ label, value, onChange, max = 4, hint }: { label: string; value: number; onChange: (n: number) => void; max?: number; hint?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-xs text-muted-foreground">{value} / {max}</span>
      </div>
      <Slider value={[value]} max={max} step={1} onValueChange={([v]) => onChange(v)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function Calculator() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<CalcInputs>(initial);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<ReturnType<typeof estimate> | null>(null);

  const set = <K extends keyof CalcInputs>(k: K, v: CalcInputs[K]) => setInputs((s) => ({ ...s, [k]: v }));

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else setResult(estimate(inputs));
  };
  const back = () => setStep(Math.max(0, step - 1));
  const reset = () => { setInputs(initial); setStep(0); setResult(null); setNotes(""); };

  return (
    <div className="container py-10 md:py-14 max-w-4xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Stage & Graft Calculator</h1>
        <p className="text-muted-foreground mt-2">A rule-based estimate based on your inputs. Always confirm with a qualified surgeon.</p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        Estimates are educational ranges only — not a diagnosis. Actual graft count requires in-person donor and density evaluation.
      </Disclaimer>

      {!result ? (
        <Card className="bg-gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">Step {step + 1} of {TOTAL_STEPS}</CardTitle>
              <span className="text-xs text-muted-foreground">{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
            </div>
            <Progress value={((step + 1) / TOTAL_STEPS) * 100} />
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <Select value={inputs.sex} onValueChange={(v) => set("sex", v as CalcInputs["sex"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other / prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Age group</Label>
                  <Select value={inputs.ageGroup} onValueChange={(v) => set("ageGroup", v as CalcInputs["ageGroup"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<25">Under 25</SelectItem>
                      <SelectItem value="25-34">25–34</SelectItem>
                      <SelectItem value="35-44">35–44</SelectItem>
                      <SelectItem value="45-54">45–54</SelectItem>
                      <SelectItem value="55+">55 and above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <ScaleField label="Hairline recession" value={inputs.hairlineRecession} onChange={(v) => set("hairlineRecession", v)} hint="0 = no recession, 4 = severe" />
                <ScaleField label="Temple loss" value={inputs.templeLoss} onChange={(v) => set("templeLoss", v)} />
                <ScaleField label="Mid-scalp thinning" value={inputs.midScalpThinning} onChange={(v) => set("midScalpThinning", v)} />
                <ScaleField label="Crown / vertex loss" value={inputs.crownSize} onChange={(v) => set("crownSize", v)} hint="0 = none, 4 = large bald spot" />
                {inputs.sex === "female" && (
                  <ScaleField label="Diffuse thinning (Ludwig)" value={inputs.diffuseThinning} onChange={(v) => set("diffuseThinning", v)} max={3} />
                )}
              </div>
            )}

            {step === 2 && (
              <div className="grid md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label>Donor area quality</Label>
                  <Select value={inputs.donorQuality} onValueChange={(v) => set("donorQuality", v as CalcInputs["donorQuality"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poor">Poor / thin</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hair caliber</Label>
                  <Select value={inputs.hairCaliber} onValueChange={(v) => set("hairCaliber", v as CalcInputs["hairCaliber"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fine">Fine</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="coarse">Coarse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scalp ↔ hair contrast</Label>
                  <Select value={inputs.scalpContrast} onValueChange={(v) => set("scalpContrast", v as CalcInputs["scalpContrast"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (similar tone)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (dark hair / light scalp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Target density (% of native density)</Label>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-3xl font-display font-bold text-primary">{inputs.targetDensityPct}%</span>
                    <span className="text-xs text-muted-foreground">Typical session reaches 40–55%</span>
                  </div>
                  <Slider className="mt-3" value={[inputs.targetDensityPct]} min={30} max={100} step={5} onValueChange={([v]) => set("targetDensityPct", v)} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-2">
                <Label>Consultation notes (optional)</Label>
                <Textarea rows={5} placeholder="Symptoms, history, questions for the surgeon…" value={notes} onChange={(e) => setNotes(e.target.value)} />
                <p className="text-xs text-muted-foreground">Saved to your plan summary on the result screen.</p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={back} disabled={step === 0}><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
              <Button onClick={next}>
                {step === TOTAL_STEPS - 1 ? "Generate estimate" : "Next"} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5 animate-fade-in">
          <Card className="bg-gradient-card border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-xl">Your preliminary estimate</CardTitle>
                <ConfidenceBadge level={result.confidence} />
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-lg bg-secondary/60 p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Likely stage</div>
                  <div className="font-display text-xl font-bold mt-1">{result.stage}</div>
                </div>
                <div className="rounded-lg bg-secondary/60 p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Graft range</div>
                  <div className="font-display text-xl font-bold mt-1">
                    {result.graftLow.toLocaleString()}–{result.graftHigh.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/60 p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Sessions</div>
                  <div className="font-display text-base font-semibold mt-1">{result.sessions}</div>
                </div>
              </div>

              <Disclaimer tone="info" title="Donor caution">{result.donorCaution}</Disclaimer>

              {result.notes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Important notes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    {result.notes.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </div>
              )}

              {notes && (
                <div>
                  <h4 className="font-semibold mb-2">Your consultation notes</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap rounded-md border bg-background p-3">{notes}</p>
                </div>
              )}

              <Disclaimer tone="warning">
                This is an educational estimate. A qualified hair-transplant surgeon must perform in-person donor evaluation and density measurement before any procedure.
              </Disclaimer>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => window.print()}>Download / print plan</Button>
                <Button variant="outline" onClick={reset}><RefreshCcw className="h-4 w-4 mr-1" /> Start over</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Questions to ask your surgeon</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>How many grafts do you measure for my donor area, and what density per cm²?</li>
                <li>Which steps will <strong>you</strong> personally perform vs technicians?</li>
                <li>What hairline design do you propose given my age and pattern?</li>
                <li>What is the realistic density you expect post-op?</li>
                <li>What follow-up and emergency protocol do you provide?</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
