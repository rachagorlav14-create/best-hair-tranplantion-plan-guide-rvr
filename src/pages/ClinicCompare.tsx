import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/Disclaimer";
import { X, Scale } from "lucide-react";
import { toast } from "sonner";

const KEY = "ht_shortlist";

export default function ClinicCompare() {
  const [ids, setIds] = useState<string[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [grafts, setGrafts] = useState(3000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
      setIds(arr);
    } catch {}
    try {
      const last = JSON.parse(localStorage.getItem("ht_calc_last") || "null");
      if (last?.graftHigh) setGrafts(Math.round((last.graftLow + last.graftHigh) / 2));
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      if (ids.length === 0) { setClinics([]); setLoading(false); return; }
      setLoading(true);
      const { data } = await supabase.from("clinics").select("*").in("id", ids);
      setClinics(data || []);
      setLoading(false);
    })();
  }, [ids]);

  const remove = (id: string) => {
    const next = ids.filter((x) => x !== id);
    setIds(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    toast.success("Removed from compare");
  };

  const score = (c: any) => {
    let s = 50;
    if (c.surgeon_led) s += 15;
    if (c.status === "verified") s += 15;
    if ((c.google_rating || 0) >= 4.5) s += 10;
    else if ((c.google_rating || 0) >= 4) s += 5;
    if ((c.red_flags || []).length === 0) s += 10;
    if (c.before_after) s += 5;
    return Math.min(100, s);
  };

  const rows: { label: string; render: (c: any) => React.ReactNode }[] = [
    { label: "City", render: (c) => `${c.city}, ${c.country}` },
    { label: "Status", render: (c) => <Badge variant="secondary">{c.status.replace("_", " ")}</Badge> },
    { label: "Doctors", render: (c) => (c.doctors || []).join(", ") || "—" },
    { label: "Workflow", render: (c) => c.surgeon_led ? "Surgeon-led" : "Technician-supported" },
    { label: "Techniques", render: (c) => (c.techniques || []).join(", ") },
    { label: "Price / graft", render: (c) => c.price_per_graft_low ? `${c.currency || "INR"} ${c.price_per_graft_low}–${c.price_per_graft_high}` : "—" },
    { label: `Est. cost for ${grafts.toLocaleString()} grafts`, render: (c) => c.price_per_graft_low ? `${c.currency || "INR"} ${(c.price_per_graft_low * grafts).toLocaleString()} – ${(c.price_per_graft_high * grafts).toLocaleString()}` : "—" },
    { label: "Rating", render: (c) => c.google_rating ? `${c.google_rating} (${c.review_count || 0})` : "—" },
    { label: "Pros", render: (c) => (c.pros || []).slice(0, 3).join(" • ") || "—" },
    { label: "Cons", render: (c) => (c.cons || []).slice(0, 3).join(" • ") || "—" },
    { label: "Red flags", render: (c) => (c.red_flags || []).length ? <span className="text-destructive">{c.red_flags.join(" • ")}</span> : "None noted" },
    { label: "Suitability score", render: (c) => <span className="font-semibold text-primary">{score(c)}/100</span> },
  ];

  return (
    <div className="container py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-2">
          <Scale className="h-7 w-7 text-primary" /> Compare Clinics
        </h1>
        <p className="text-muted-foreground mt-2">Side-by-side view of clinics you shortlisted.</p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        Suitability score is a heuristic for educational guidance only. Always confirm details directly with the clinic.
      </Disclaimer>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : clinics.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">
          No clinics shortlisted yet. <Link to="/clinics" className="text-primary underline">Browse clinics</Link> and tap "Compare".
        </CardContent></Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 bg-muted/50 sticky left-0 z-10">Attribute</th>
                {clinics.map((c) => (
                  <th key={c.id} className="text-left p-3 min-w-[220px]">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/clinics/${c.id}`} className="font-semibold hover:text-primary">{c.name}</Link>
                      <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b last:border-0">
                  <td className="p-3 font-medium text-muted-foreground bg-muted/30 sticky left-0">{r.label}</td>
                  {clinics.map((c) => <td key={c.id} className="p-3 align-top">{r.render(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button asChild variant="outline"><Link to="/clinics">Add more clinics</Link></Button>
      </div>
    </div>
  );
}
