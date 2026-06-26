import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Disclaimer } from "@/components/Disclaimer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { POSTOP_TIMELINE } from "@/data/options";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Log = {
  id: string;
  log_date: string;
  day_number: number | null;
  pain: number | null;
  swelling: number | null;
  redness: number | null;
  itching: number | null;
  scab_status: string | null;
  shedding_status: string | null;
  medicines_taken: boolean | null;
  wash_done: boolean | null;
  photo_uploaded: boolean | null;
  notes: string | null;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Recovery() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Partial<Log>>({
    log_date: todayStr(), day_number: 1, pain: 2, swelling: 1, redness: 2, itching: 1,
    scab_status: "forming", shedding_status: "none",
    medicines_taken: false, wash_done: false, photo_uploaded: false, notes: "",
  });

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("recovery_logs").select("*").eq("user_id", user.id).order("log_date", { ascending: false });
    setLogs((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const addLog = async () => {
    if (!user) return;
    const { error } = await supabase.from("recovery_logs").insert({
      user_id: user.id, ...draft, log_date: draft.log_date || todayStr(),
    } as any);
    if (error) toast.error(error.message);
    else { toast.success("Day logged"); load(); }
  };

  const remove = async (id: string) => {
    await supabase.from("recovery_logs").delete().eq("id", id);
    load();
  };

  return (
    <div className="container py-10 max-w-5xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Post-Op Recovery Tracker</h1>
        <p className="text-muted-foreground mt-2">Log daily pain, swelling, scabbing and care. Compare against the typical timeline.</p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        Contact your surgeon immediately for severe pain, heavy bleeding, fever, pus, or sudden swelling.
        This tracker is not a substitute for medical care.
      </Disclaimer>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Typical timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative border-l ml-2 space-y-4">
              {POSTOP_TIMELINE.map((t) => (
                <li key={t.period} className="ml-4">
                  <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-primary" />
                  <div className="font-semibold">{t.period}</div>
                  <div className="text-sm text-muted-foreground">{t.body}</div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Log today</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date</Label><Input type="date" value={draft.log_date || ""} onChange={(e) => setDraft({ ...draft, log_date: e.target.value })} /></div>
              <div><Label>Day #</Label><Input type="number" value={draft.day_number ?? ""} onChange={(e) => setDraft({ ...draft, day_number: e.target.value ? Number(e.target.value) : null })} /></div>
            </div>
            {(["pain", "swelling", "redness", "itching"] as const).map((k) => (
              <div key={k}>
                <Label className="capitalize">{k}: <span className="text-primary font-semibold">{draft[k] ?? 0}/5</span></Label>
                <Slider value={[draft[k] ?? 0]} min={0} max={5} step={1} onValueChange={([v]) => setDraft({ ...draft, [k]: v } as any)} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Scab status</Label><Input value={draft.scab_status || ""} onChange={(e) => setDraft({ ...draft, scab_status: e.target.value })} /></div>
              <div><Label>Shedding</Label><Input value={draft.shedding_status || ""} onChange={(e) => setDraft({ ...draft, shedding_status: e.target.value })} /></div>
            </div>
            <div className="space-y-1">
              {([["medicines_taken", "Medicines taken"], ["wash_done", "Wash done"], ["photo_uploaded", "Photo uploaded"]] as const).map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={!!draft[k]} onCheckedChange={(v) => setDraft({ ...draft, [k]: !!v } as any)} /> {label}
                </label>
              ))}
            </div>
            <Textarea rows={2} placeholder="Notes" value={draft.notes || ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
            <Button className="w-full" onClick={addLog}>Save log</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base">Your logs</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading…</p> :
            logs.length === 0 ? <p className="text-muted-foreground text-sm">No logs yet.</p> :
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left">
                  <th className="p-2">Date</th><th className="p-2">Day</th><th className="p-2">Pain</th>
                  <th className="p-2">Swell</th><th className="p-2">Red</th><th className="p-2">Itch</th>
                  <th className="p-2">Scab</th><th className="p-2">Notes</th><th className="p-2"></th>
                </tr></thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l.id} className="border-b last:border-0">
                      <td className="p-2">{l.log_date}</td>
                      <td className="p-2">{l.day_number ?? "—"}</td>
                      <td className="p-2">{l.pain ?? "—"}</td>
                      <td className="p-2">{l.swelling ?? "—"}</td>
                      <td className="p-2">{l.redness ?? "—"}</td>
                      <td className="p-2">{l.itching ?? "—"}</td>
                      <td className="p-2">{l.scab_status || "—"}</td>
                      <td className="p-2 text-muted-foreground max-w-[240px] truncate">{l.notes}</td>
                      <td className="p-2"><Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
        </CardContent>
      </Card>
    </div>
  );
}
