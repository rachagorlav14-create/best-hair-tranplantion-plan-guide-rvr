import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Disclaimer } from "@/components/Disclaimer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Doctor = {
  id: string;
  full_name: string;
  qualification: string | null;
  years_experience: number | null;
  city: string | null;
  country: string | null;
  techniques: string[] | null;
  bio: string | null;
  verification_status: string | null;
  clinic_id: string | null;
};

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("doctors").select("*").order("full_name");
      setDoctors(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = doctors.filter((d) =>
    !q || `${d.full_name} ${d.city} ${d.country} ${(d.techniques || []).join(" ")}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container py-10 max-w-6xl">
      <header className="mb-6">
        <div className="text-xs uppercase tracking-wider text-primary mb-2">Directory</div>
        <h1 className="font-display text-3xl md:text-5xl font-bold">Doctor Finder</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Surgeon profiles with technique focus, experience and verification status. Reputation
          indicators reflect available verified data — not a ranking.
        </p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        Doctor information is sourced from clinic listings and admin verification. We do not rank
        doctors by quality. Always meet the surgeon in person and confirm credentials before booking.
      </Disclaimer>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctors, city, technique" className="pl-10 rounded-xl glass" />
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          No doctor profiles yet. Admins can add doctors from the admin dashboard.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-gold flex items-center justify-center font-display font-bold text-primary-foreground">
                  {d.full_name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <Badge variant={d.verification_status === "admin_verified" ? "default" : "secondary"} className="text-[10px]">
                  {d.verification_status === "admin_verified" ? "Verified" : d.verification_status === "sample" ? "Sample" : "Unverified"}
                </Badge>
              </div>
              <div className="mt-3 font-display font-semibold">{d.full_name}</div>
              <div className="text-xs text-muted-foreground">{d.qualification || "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">{[d.city, d.country].filter(Boolean).join(", ")}</div>
              {d.years_experience != null && <div className="text-xs mt-1">{d.years_experience} yrs experience</div>}
              {d.techniques && d.techniques.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {d.techniques.slice(0, 4).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 border border-border/40">{t}</span>
                  ))}
                </div>
              )}
              {d.bio && <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{d.bio}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
