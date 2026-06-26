import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/Disclaimer";
import { Plus, Trash2, Pill } from "lucide-react";

type Med = {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  startDate: string;
  stopDate?: string;
  instruction: string;
  notes: string;
};

const educational = [
  { name: "Minoxidil 5%", use: "Topical — supports existing hair & graft survival", caution: "May cause initial shedding; needs continued use." },
  { name: "Finasteride 1mg", use: "Oral — reduces DHT to slow male pattern loss", caution: "Prescription only. Side effects possible (libido, mood). Doctor supervision required." },
  { name: "Dutasteride", use: "Stronger DHT inhibitor — off-label for hair in many regions", caution: "Prescription only. Long half-life, stronger side-effect profile." },
  { name: "Ketoconazole shampoo", use: "Anti-fungal that may also reduce scalp DHT", caution: "Use 2–3x weekly; follow doctor's advice." },
  { name: "PRP / GFC", use: "In-clinic injections — may support follicle health", caution: "Evidence varies; multiple sessions usually needed." },
  { name: "Antibiotics / painkillers (post-op)", use: "Short course after surgery", caution: "Take exactly as prescribed; report side effects." },
];

export default function Medications() {
  const [meds, setMeds] = useState<Med[]>([]);
  const [draft, setDraft] = useState<Med>({
    id: "", name: "", dose: "", frequency: "Once daily", startDate: new Date().toISOString().slice(0, 10), instruction: "", notes: "",
  });

  const add = () => {
    if (!draft.name) return;
    setMeds([{ ...draft, id: crypto.randomUUID() }, ...meds]);
    setDraft({ ...draft, name: "", dose: "", instruction: "", notes: "" });
  };

  return (
    <div className="container py-10 md:py-14 space-y-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Medication & Treatment</h1>
        <p className="text-muted-foreground mt-2">Educational pages and a personal tracker. Not a substitute for prescription advice.</p>
      </header>

      <Disclaimer tone="warning">
        Prescription medicines like <strong>finasteride, dutasteride, or post-op antibiotics</strong> must only be used under a qualified doctor's prescription and monitoring.
      </Disclaimer>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Common medications & treatments</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {educational.map((m) => (
            <Card key={m.name}>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Pill className="h-4 w-4 text-primary" /> {m.name}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Use:</strong> {m.use}</p>
                <p><strong className="text-warning">Caution:</strong> {m.caution}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">My medication tracker</h2>
        <Card className="bg-gradient-card">
          <CardHeader><CardTitle className="text-base">Add a medication</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-3">
            <div><Label>Name</Label><Input placeholder="e.g. Minoxidil 5%" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
            <div><Label>Dose</Label><Input placeholder="1 ml" value={draft.dose} onChange={(e) => setDraft({ ...draft, dose: e.target.value })} /></div>
            <div>
              <Label>Frequency</Label>
              <Select value={draft.frequency} onValueChange={(v) => setDraft({ ...draft, frequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Once daily", "Twice daily", "Three times daily", "Weekly", "As needed"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Start date</Label><Input type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} /></div>
            <div><Label>Stop date (optional)</Label><Input type="date" value={draft.stopDate || ""} onChange={(e) => setDraft({ ...draft, stopDate: e.target.value })} /></div>
            <div className="md:col-span-1"><Label>Doctor instruction</Label><Input placeholder="e.g. apply at night" value={draft.instruction} onChange={(e) => setDraft({ ...draft, instruction: e.target.value })} /></div>
            <div className="md:col-span-3"><Label>Notes / side effects</Label><Textarea rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></div>
            <div className="md:col-span-3"><Button onClick={add}><Plus className="h-4 w-4 mr-1" /> Add medication</Button></div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {meds.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3"><CardContent className="py-10 text-center text-sm text-muted-foreground">No medications tracked yet. Add one above.</CardContent></Card>
          ) : meds.map((m) => (
            <Card key={m.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{m.name}</CardTitle>
                  <Button size="icon" variant="ghost" onClick={() => setMeds((s) => s.filter((x) => x.id !== m.id))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  {m.dose && <Badge variant="secondary">{m.dose}</Badge>}
                  <Badge variant="secondary">{m.frequency}</Badge>
                </div>
                <p>Start: {m.startDate}{m.stopDate ? ` → Stop: ${m.stopDate}` : ""}</p>
                {m.instruction && <p><strong className="text-foreground">Instruction:</strong> {m.instruction}</p>}
                {m.notes && <p className="text-xs">{m.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Tracker is local to this session — connect Lovable Cloud to persist and add reminders.</p>
      </section>
    </div>
  );
}
