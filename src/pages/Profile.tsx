import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Disclaimer } from "@/components/Disclaimer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  COUNTRIES, INDIA_CITIES, CONCERN_AREAS, CURRENT_MEDICATIONS,
  BUDGET_RANGES, TIMELINES,
} from "@/data/options";

type Profile = {
  full_name?: string | null;
  age?: number | null;
  gender?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  hair_loss_duration?: string | null;
  family_history?: string | null;
  concern_areas?: string[] | null;
  current_medications?: string[] | null;
  previous_transplant?: boolean | null;
  previous_transplant_notes?: string | null;
  budget_range?: string | null;
  preferred_treatment_location?: string | null;
  treatment_timeline?: string | null;
  smoking_status?: string | null;
  alcohol_status?: string | null;
  medical_conditions?: string | null;
  allergies?: string | null;
  doctor_notes?: string | null;
};

const EMPTY: Profile = {
  concern_areas: [],
  current_medications: [],
  previous_transplant: false,
};

export default function Profile() {
  const { user } = useAuth();
  const [p, setP] = useState<Profile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setP({ ...EMPTY, ...data });
      setLoading(false);
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, ...p }, { onConflict: "user_id" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  const toggleArray = (key: "concern_areas" | "current_medications", val: string) => {
    setP((s) => {
      const list = new Set(s[key] || []);
      list.has(val) ? list.delete(val) : list.add(val);
      return { ...s, [key]: Array.from(list) };
    });
  };

  if (loading) return <div className="container py-10">Loading…</div>;

  return (
    <div className="container py-10 max-w-4xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Your profile powers the calculator, planning dashboard and clinic recommendations.
        </p>
      </header>

      <Disclaimer tone="info" className="mb-6">
        Information here is for personal planning only. It is not shared with any clinic automatically.
      </Disclaimer>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div><Label>Full name</Label><Input value={p.full_name || ""} onChange={(e) => setP({ ...p, full_name: e.target.value })} /></div>
            <div><Label>Age</Label><Input type="number" value={p.age ?? ""} onChange={(e) => setP({ ...p, age: e.target.value ? Number(e.target.value) : null })} /></div>
            <div>
              <Label>Gender</Label>
              <Select value={p.gender || ""} onValueChange={(v) => setP({ ...p, gender: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["male", "female", "non-binary", "prefer not to say"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Country</Label>
              <Select value={p.country || ""} onValueChange={(v) => setP({ ...p, country: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>State</Label><Input value={p.state || ""} onChange={(e) => setP({ ...p, state: e.target.value })} /></div>
            <div>
              <Label>City</Label>
              {p.country === "India" ? (
                <Select value={p.city || ""} onValueChange={(v) => setP({ ...p, city: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{INDIA_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              ) : (
                <Input value={p.city || ""} onChange={(e) => setP({ ...p, city: e.target.value })} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hair loss history</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Hair loss duration</Label>
                <Select value={p.hair_loss_duration || ""} onValueChange={(v) => setP({ ...p, hair_loss_duration: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["< 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Family history</Label>
                <Select value={p.family_history || ""} onValueChange={(v) => setP({ ...p, family_history: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["None known", "Father side", "Mother side", "Both sides"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Current baldness concern (select all)</Label>
              <div className="flex flex-wrap gap-2">
                {CONCERN_AREAS.map((a) => {
                  const sel = (p.concern_areas || []).includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleArray("concern_areas", a)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${sel ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:bg-muted"}`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Current medication / treatment</Label>
              <div className="flex flex-wrap gap-2">
                {CURRENT_MEDICATIONS.map((m) => {
                  const sel = (p.current_medications || []).includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleArray("current_medications", m)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${sel ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:bg-muted"}`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={!!p.previous_transplant} onCheckedChange={(v) => setP({ ...p, previous_transplant: v })} />
              <Label>I have had a previous hair transplant</Label>
            </div>
            {p.previous_transplant && (
              <div>
                <Label>Previous transplant notes</Label>
                <Textarea value={p.previous_transplant_notes || ""} onChange={(e) => setP({ ...p, previous_transplant_notes: e.target.value })} placeholder="Year, technique, grafts, clinic, outcome…" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Treatment planning</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Budget range</Label>
              <Select value={p.budget_range || ""} onValueChange={(v) => setP({ ...p, budget_range: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{BUDGET_RANGES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferred treatment city / country</Label>
              <Input value={p.preferred_treatment_location || ""} onChange={(e) => setP({ ...p, preferred_treatment_location: e.target.value })} placeholder="e.g. Hyderabad, India" />
            </div>
            <div>
              <Label>Planned timeline</Label>
              <Select value={p.treatment_timeline || ""} onValueChange={(v) => setP({ ...p, treatment_timeline: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{TIMELINES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Smoking status</Label>
              <Select value={p.smoking_status || ""} onValueChange={(v) => setP({ ...p, smoking_status: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Never", "Occasional", "Regular", "Trying to quit"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Alcohol status</Label>
              <Select value={p.alcohol_status || ""} onValueChange={(v) => setP({ ...p, alcohol_status: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Never", "Occasional", "Regular"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Medical context</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Medical conditions</Label>
              <Textarea value={p.medical_conditions || ""} onChange={(e) => setP({ ...p, medical_conditions: e.target.value })} placeholder="Diabetes, hypertension, thyroid, autoimmune, etc." />
            </div>
            <div>
              <Label>Allergies</Label>
              <Textarea value={p.allergies || ""} onChange={(e) => setP({ ...p, allergies: e.target.value })} placeholder="Drugs, anaesthesia reactions, topical reactions…" />
            </div>
            <div>
              <Label>Notes for doctor consultation</Label>
              <Textarea rows={4} value={p.doctor_notes || ""} onChange={(e) => setP({ ...p, doctor_notes: e.target.value })} placeholder="Questions, goals, expectations, lifestyle constraints…" />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-4 z-10">
          <Button onClick={save} disabled={saving} size="lg" className="w-full shadow-elevated">
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}
