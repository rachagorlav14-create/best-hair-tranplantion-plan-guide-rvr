import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/Disclaimer";
import { Checkbox } from "@/components/ui/checkbox";
import { differenceInDays, format } from "date-fns";

const milestones = [
  { day: 0, title: "Day 0 — Surgery", phase: "Procedure", tasks: ["Follow doctor instructions exactly", "Rest with head elevated", "Avoid touching grafts"] },
  { day: 1, title: "Day 1 — First wash & check", phase: "Healing", tasks: ["Clinic wash / inspection", "Saline spray every 1–2 hours", "Sleep semi-upright"] },
  { day: 4, title: "Days 2–7 — Swelling & scabs", phase: "Healing", tasks: ["Gentle washes", "Cold compress on forehead (not on grafts)", "No exercise, no alcohol, no smoking"] },
  { day: 10, title: "Days 8–14 — Scab removal", phase: "Healing", tasks: ["Gentle massage during wash to remove scabs", "Avoid direct sun", "Continue meds as prescribed"] },
  { day: 30, title: "Weeks 2–8 — Shedding phase", phase: "Shedding", tasks: ["Transplanted hairs shed — this is normal", "No panic; follicles remain in place", "Resume light exercise after surgeon approval"] },
  { day: 100, title: "Months 3–4 — Early growth", phase: "Early growth", tasks: ["Fine new hairs begin emerging", "Stay consistent with minoxidil if prescribed", "Photo at fixed angle & lighting"] },
  { day: 180, title: "Month 6 — Visible improvement", phase: "Growth", tasks: ["About 50–60% of final density", "Compare photos vs Day 0", "Discuss progress with surgeon"] },
  { day: 365, title: "Months 9–12 — Maturity", phase: "Maturity", tasks: ["Final hairline texture matures", "Crown may need longer (12–18 months)", "Document final result"] },
  { day: 540, title: "Month 18 — Crown maturity", phase: "Maturity", tasks: ["Crown reaches its final density", "Discuss any second sitting if planned"] },
];

const dailyChecklistTemplate = [
  "Saline spray as instructed",
  "Sleep semi-upright (first 5 nights)",
  "No cap / helmet (first 7 days)",
  "No exercise (first 10–14 days)",
  "No sun / direct heat",
  "Take prescribed medicines",
  "Note pain / redness / swelling level",
];

const warningSymptoms = [
  "Severe or worsening pain",
  "Pus / foul smell from grafts",
  "Fever > 101°F (38.3°C)",
  "Spreading redness or red streaks",
  "Heavy bleeding that won't stop",
  "Allergic reaction (hives, swelling, breathing trouble)",
  "Chest pain / shortness of breath",
];

export default function Recovery() {
  const [procedureDate, setProcedureDate] = useState<string>(() => format(new Date(), "yyyy-MM-dd"));
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const today = new Date();
  const daysSince = procedureDate ? differenceInDays(today, new Date(procedureDate)) : 0;

  const phaseInfo = useMemo(() => {
    if (daysSince < 0) return { label: "Pre-op", pct: 0 };
    if (daysSince <= 7) return { label: "Healing", pct: 10 };
    if (daysSince <= 30) return { label: "Shedding", pct: 25 };
    if (daysSince <= 120) return { label: "Early growth", pct: 45 };
    if (daysSince <= 240) return { label: "Density improvement", pct: 70 };
    if (daysSince <= 540) return { label: "Maturity", pct: 95 };
    return { label: "Final", pct: 100 };
  }, [daysSince]);

  return (
    <div className="container py-10 md:py-14 space-y-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Recovery Tracker</h1>
        <p className="text-muted-foreground mt-2">Calendar-based timeline from your procedure date through 12–18 month maturity.</p>
      </header>

      <Disclaimer tone="info">
        General educational schedule — always follow <strong>your own surgeon's</strong> specific written post-op instructions.
      </Disclaimer>

      <Card className="bg-gradient-card">
        <CardContent className="pt-6 grid md:grid-cols-3 gap-4 items-end">
          <div>
            <Label>Procedure date</Label>
            <Input type="date" value={procedureDate} onChange={(e) => setProcedureDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <div className="text-xs text-muted-foreground">Days since procedure</div>
                <div className="font-display text-2xl font-bold">{daysSince}</div>
              </div>
              <Badge variant="secondary">{phaseInfo.label}</Badge>
            </div>
            <Progress value={phaseInfo.pct} />
            <div className="text-xs text-muted-foreground mt-1">{phaseInfo.pct}% through typical recovery journey</div>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Timeline</h2>
        <div className="relative pl-6 border-l-2 border-border space-y-5">
          {milestones.map((m) => {
            const reached = daysSince >= m.day;
            return (
              <div key={m.day} className="relative">
                <span className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-2 ${reached ? "bg-primary border-primary" : "bg-background border-muted-foreground/40"}`} />
                <Card className={reached ? "border-primary/30" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-base">{m.title}</CardTitle>
                      <Badge variant={reached ? "default" : "outline"}>{m.phase}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                      {m.tasks.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Today's checklist</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {dailyChecklistTemplate.map((task) => (
              <label key={task} className="flex items-start gap-2 text-sm">
                <Checkbox checked={!!checked[task]} onCheckedChange={(v) => setChecked((s) => ({ ...s, [task]: !!v }))} />
                <span className={checked[task] ? "line-through text-muted-foreground" : ""}>{task}</span>
              </label>
            ))}
            <p className="text-xs text-muted-foreground pt-2">Checklist resets when the page reloads — full persistence will be added with Lovable Cloud.</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/40">
          <CardHeader><CardTitle className="text-destructive">When to seek urgent medical care</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              {warningSymptoms.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="text-xs text-destructive font-medium mt-3">Contact your surgeon or visit emergency care immediately for any of these symptoms.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
