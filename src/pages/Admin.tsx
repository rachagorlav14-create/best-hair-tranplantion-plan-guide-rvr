import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Disclaimer } from "@/components/Disclaimer";
import { COUNTRIES, INDIA_CITIES, TECHNIQUES } from "@/data/options";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const EMPTY: any = {
  name: "", city: "", state: "", country: "India",
  doctors_text: "", techniques: [] as string[],
  price_per_graft_low: 30, price_per_graft_high: 60, currency: "INR",
  min_package_price: null, consultation_fee: null,
  google_rating: null, review_count: null,
  surgeon_led: true, supports_female: true, supports_beard: true, supports_crown: true,
  supports_mega_session: false, emi_available: true, before_after: true,
  status: "sample", pros_text: "", cons_text: "", red_flags_text: "",
  address: "", contact: "", website: "", notes: "",
};

export default function Admin() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("clinics").select("*").order("updated_at", { ascending: false });
    setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => setEditing({ ...EMPTY });
  const startEdit = (c: any) => setEditing({
    ...c,
    doctors_text: (c.doctors || []).join(", "),
    pros_text: (c.pros || []).join("\n"),
    cons_text: (c.cons || []).join("\n"),
    red_flags_text: (c.red_flags || []).join("\n"),
  });

  const save = async () => {
    const payload: any = { ...editing };
    payload.doctors = (payload.doctors_text || "").split(",").map((s: string) => s.trim()).filter(Boolean);
    payload.pros = (payload.pros_text || "").split("\n").map((s: string) => s.trim()).filter(Boolean);
    payload.cons = (payload.cons_text || "").split("\n").map((s: string) => s.trim()).filter(Boolean);
    payload.red_flags = (payload.red_flags_text || "").split("\n").map((s: string) => s.trim()).filter(Boolean);
    delete payload.doctors_text; delete payload.pros_text; delete payload.cons_text; delete payload.red_flags_text;
    delete payload.created_at; delete payload.updated_at; delete payload.created_by;

    let resp;
    if (payload.id) resp = await supabase.from("clinics").update(payload).eq("id", payload.id);
    else resp = await supabase.from("clinics").insert(payload);
    if (resp.error) { toast.error(resp.error.message); return; }
    toast.success("Clinic saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this clinic?")) return;
    const { error } = await supabase.from("clinics").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); load(); }
  };

  const toggleTech = (t: string) => setEditing((s: any) => {
    const set = new Set(s.techniques || []);
    set.has(t) ? set.delete(t) : set.add(t);
    return { ...s, techniques: Array.from(set) };
  });

  return (
    <div className="container py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary" /> Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Manage clinic directory entries, verification status and sample data.</p>
        </div>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-1" /> Add clinic</Button>
      </header>

      <Disclaimer tone="info" className="mb-6">
        Mark entries accurately: <em>Verified</em> only after confirming the clinic, doctor, address and pricing personally.
      </Disclaimer>

      {editing && (
        <Card className="mb-6 border-primary/40">
          <CardHeader><CardTitle>{editing.id ? "Edit clinic" : "New clinic"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Status">
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["sample", "user_added", "needs_verification", "verified"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Country">
                <Select value={editing.country} onValueChange={(v) => setEditing({ ...editing, country: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="State"><Input value={editing.state || ""} onChange={(e) => setEditing({ ...editing, state: e.target.value })} /></Field>
              <Field label="City">
                {editing.country === "India" ? (
                  <Select value={editing.city} onValueChange={(v) => setEditing({ ...editing, city: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{INDIA_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (<Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} />)}
              </Field>
              <Field label="Doctors (comma separated)"><Input value={editing.doctors_text} onChange={(e) => setEditing({ ...editing, doctors_text: e.target.value })} /></Field>
              <Field label="Currency">
                <Select value={editing.currency || "INR"} onValueChange={(v) => setEditing({ ...editing, currency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["INR", "USD", "EUR", "GBP", "AED", "THB", "AUD"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Price / graft low"><Input type="number" value={editing.price_per_graft_low ?? ""} onChange={(e) => setEditing({ ...editing, price_per_graft_low: e.target.value ? Number(e.target.value) : null })} /></Field>
              <Field label="Price / graft high"><Input type="number" value={editing.price_per_graft_high ?? ""} onChange={(e) => setEditing({ ...editing, price_per_graft_high: e.target.value ? Number(e.target.value) : null })} /></Field>
              <Field label="Min package price"><Input type="number" value={editing.min_package_price ?? ""} onChange={(e) => setEditing({ ...editing, min_package_price: e.target.value ? Number(e.target.value) : null })} /></Field>
              <Field label="Consultation fee"><Input type="number" value={editing.consultation_fee ?? ""} onChange={(e) => setEditing({ ...editing, consultation_fee: e.target.value ? Number(e.target.value) : null })} /></Field>
              <Field label="Google rating"><Input type="number" step="0.1" value={editing.google_rating ?? ""} onChange={(e) => setEditing({ ...editing, google_rating: e.target.value ? Number(e.target.value) : null })} /></Field>
              <Field label="Review count"><Input type="number" value={editing.review_count ?? ""} onChange={(e) => setEditing({ ...editing, review_count: e.target.value ? Number(e.target.value) : null })} /></Field>
            </div>

            <div>
              <Label className="mb-2 block">Techniques</Label>
              <div className="flex flex-wrap gap-2">
                {TECHNIQUES.map((t) => {
                  const sel = (editing.techniques || []).includes(t);
                  return (
                    <button key={t} type="button" onClick={() => toggleTech(t)}
                      className={`px-3 py-1 rounded-full text-sm border ${sel ? "bg-primary text-primary-foreground border-primary" : "bg-secondary"}`}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t">
              {([
                ["surgeon_led", "Surgeon-led"],
                ["supports_female", "Female HT"],
                ["supports_beard", "Beard / BHT"],
                ["supports_crown", "Crown"],
                ["supports_mega_session", "Mega session"],
                ["emi_available", "EMI / finance"],
                ["before_after", "Before/After"],
              ] as const).map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <Switch checked={!!editing[k]} onCheckedChange={(v) => setEditing({ ...editing, [k]: v })} />
                  {label}
                </label>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <Field label="Pros (one per line)"><Textarea rows={4} value={editing.pros_text} onChange={(e) => setEditing({ ...editing, pros_text: e.target.value })} /></Field>
              <Field label="Cons (one per line)"><Textarea rows={4} value={editing.cons_text} onChange={(e) => setEditing({ ...editing, cons_text: e.target.value })} /></Field>
              <Field label="Red flags (one per line)"><Textarea rows={4} value={editing.red_flags_text} onChange={(e) => setEditing({ ...editing, red_flags_text: e.target.value })} /></Field>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Address"><Textarea rows={2} value={editing.address || ""} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></Field>
              <Field label="Notes"><Textarea rows={2} value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></Field>
              <Field label="Contact"><Input value={editing.contact || ""} onChange={(e) => setEditing({ ...editing, contact: e.target.value })} /></Field>
              <Field label="Website"><Input value={editing.website || ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} /></Field>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save}>Save clinic</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Clinics ({list.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">Name</th><th className="p-2">Location</th>
                    <th className="p-2">Status</th><th className="p-2">Price</th>
                    <th className="p-2">Rating</th><th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((c) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/40">
                      <td className="p-2 font-medium">{c.name}</td>
                      <td className="p-2 text-muted-foreground">{c.city}, {c.country}</td>
                      <td className="p-2"><Badge variant="secondary">{c.status}</Badge></td>
                      <td className="p-2">{c.currency || "INR"} {c.price_per_graft_low}–{c.price_per_graft_high}</td>
                      <td className="p-2">{c.google_rating ?? "—"}</td>
                      <td className="p-2 text-right">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(c)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(c.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><Label>{label}</Label>{children}</div>
);
