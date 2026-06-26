import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Disclaimer } from "@/components/Disclaimer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { COMMON_MEDS } from "@/data/options";
import { Trash2, Plus, Pill } from "lucide-react";
import { toast } from "sonner";

type Med = {
  id: string;
  name: string;
  dose: string | null;
  frequency: string | null;
  start_date: string | null;
  stop_date: string | null;
  doctor_instruction: string | null;
  reminder_time: string | null;
  side_effects: string | null;
  active: boolean | null;
};

const EMPTY = {
  name: "", dose: "", frequency: "Once daily",
  start_date: new Date().toISOString().slice(0, 10),
  stop_date: "", doctor_instruction: "",
  reminder_time: "", side_effects: "", active: true,
};

export default function Medications() {
  const { user } = useAuth();
  const [list, setList] = useState<Med[]>([]);
  const [draft, setDraft] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("medications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setList((data as any) || []); setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const add = async () => {
    if (!user || !draft.name) { toast.error("Name is required"); return; }
    const payload = { ...draft, user_id: user.id };
    if (!payload.stop_date) payload.stop_date = null;
    if (!payload.reminder_time) payload.reminder_time = null;
    const { error } = await supabase.from("medications").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Medication added"); setDraft(EMPTY); load(); }
  };

  const toggleActive = async (m: Med) => {
    await supabase.from("medications").update({ active: !m.active }).eq("id", m.id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("medications").delete().eq("id", id);
    load();
  };

  return (
    <div className="container py-10 max-w-5xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-2">
          <Pill className="h-7 w-7 text-primary" /> Medication Tracker
        </h1>
        <p className="text-muted-foreground mt-2">Track all pre-op and post-op medications, doses, and reminders.</p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        Take only medications prescribed by your doctor. Reminders here are personal notes — they do not
        replace medical instructions.
      </Disclaimer>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Add medication</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <Label>Name</Label>
              <Select value={draft.name} onValueChange={(v) => setDraft({ ...draft, name: v })}>
                <SelectTrigger><SelectValue placeholder="Select or type below" /></SelectTrigger>
                <SelectContent>{COMMON_MEDS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
              <Input className="mt-2" placeholder="Or custom name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div><Label>Dose</Label><Input value={draft.dose} onChange={(e) => setDraft({ ...draft, dose: e.target.value })} placeholder="e.g. 1mg" /></div>
            <div><Label>Frequency</Label><Input value={draft.frequency} onChange={(e) => setDraft({ ...draft, frequency: e.target.value })} /></div>
            <div><Label>Start date</Label><Input type="date" value={draft.start_date} onChange={(e) => setDraft({ ...draft, start_date: e.target.value })} /></div>
            <div><Label>Stop date</Label><Input type="date" value={draft.stop_date} onChange={(e) => setDraft({ ...draft, stop_date: e.target.value })} /></div>
            <div><Label>Reminder time</Label><Input type="time" value={draft.reminder_time} onChange={(e) => setDraft({ ...draft, reminder_time: e.target.value })} /></div>
          </div>
          <Textarea rows={2} placeholder="Doctor instructions" value={draft.doctor_instruction} onChange={(e) => setDraft({ ...draft, doctor_instruction: e.target.value })} />
          <Textarea rows={2} placeholder="Side effects noted" value={draft.side_effects} onChange={(e) => setDraft({ ...draft, side_effects: e.target.value })} />
          <Button onClick={add}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Current list</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading…</p> :
            list.length === 0 ? <p className="text-muted-foreground text-sm">No medications yet.</p> :
            <div className="space-y-3">
              {list.map((m) => (
                <div key={m.id} className="border rounded-lg p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{m.name} {m.dose && <span className="text-muted-foreground font-normal">· {m.dose}</span>}</div>
                      <div className="text-xs text-muted-foreground">{m.frequency} · {m.start_date}{m.stop_date ? ` → ${m.stop_date}` : ""}{m.reminder_time ? ` · reminder ${m.reminder_time}` : ""}</div>
                      {m.doctor_instruction && <div className="text-sm mt-1">{m.doctor_instruction}</div>}
                      {m.side_effects && <div className="text-xs text-amber-700 mt-1">Side effects: {m.side_effects}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-xs"><Switch checked={!!m.active} onCheckedChange={() => toggleActive(m)} /> Active</label>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>}
        </CardContent>
      </Card>
    </div>
  );
}
