import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/Disclaimer";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES, INDIA_CITIES, TECHNIQUES } from "@/data/options";
import { Star, Scale, Plus, Check } from "lucide-react";
import { toast } from "sonner";

type Clinic = {
  id: string;
  name: string; city: string; state: string | null; country: string;
  doctors: string[] | null; surgeon_led: boolean | null;
  techniques: string[] | null;
  price_per_graft_low: number | null; price_per_graft_high: number | null;
  currency: string | null;
  min_package_price: number | null;
  google_rating: number | null; review_count: number | null;
  verified_reviews: number | null;
  status: string;
  supports_female: boolean | null; supports_beard: boolean | null;
  supports_crown: boolean | null; supports_mega_session: boolean | null;
  emi_available: boolean | null;
};

const SHORTLIST_KEY = "ht_shortlist";

const statusVariant = (s: string) => {
  if (s === "verified") return "default";
  if (s === "sample") return "secondary";
  if (s === "needs_verification") return "destructive";
  return "outline";
};

const statusLabel = (s: string) =>
  ({ verified: "Verified", sample: "Sample", user_added: "User-added", needs_verification: "Needs verification" } as any)[s] || s;

export default function Clinics() {
  const [params, setParams] = useSearchParams();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlist, setShortlist] = useState<string[]>([]);

  const country = params.get("country") || "";
  const city = params.get("city") || "";
  const technique = params.get("technique") || "";
  const q = params.get("q") || "";
  const minRating = Number(params.get("minRating") || 0);
  const maxPrice = Number(params.get("maxPrice") || 0);
  const surgeonOnly = params.get("surgeon") === "1";
  const verifiedOnly = params.get("verified") === "1";
  const female = params.get("female") === "1";
  const beard = params.get("beard") === "1";
  const crown = params.get("crown") === "1";
  const mega = params.get("mega") === "1";
  const emi = params.get("emi") === "1";

  const updateParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v) next.delete(k); else next.set(k, v);
    if (k === "country") next.delete("city");
    setParams(next, { replace: true });
  };
  const toggleParam = (k: string) => {
    const next = new URLSearchParams(params);
    if (next.get(k) === "1") next.delete(k); else next.set(k, "1");
    setParams(next, { replace: true });
  };

  useEffect(() => {
    try { setShortlist(JSON.parse(localStorage.getItem(SHORTLIST_KEY) || "[]")); } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("clinics")
        .select("*")
        .order("google_rating", { ascending: false, nullsFirst: false });
      setClinics((data as any) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return clinics.filter((c) => {
      if (country && c.country !== country) return false;
      if (city && c.city !== city) return false;
      if (technique && !(c.techniques || []).includes(technique)) return false;
      if (q && !`${c.name} ${c.city} ${(c.doctors || []).join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (minRating && (c.google_rating || 0) < minRating) return false;
      if (maxPrice && (c.price_per_graft_high || 0) > maxPrice) return false;
      if (surgeonOnly && !c.surgeon_led) return false;
      if (verifiedOnly && c.status !== "verified") return false;
      if (female && !c.supports_female) return false;
      if (beard && !c.supports_beard) return false;
      if (crown && !c.supports_crown) return false;
      if (mega && !c.supports_mega_session) return false;
      if (emi && !c.emi_available) return false;
      return true;
    });
  }, [clinics, country, city, technique, q, minRating, maxPrice, surgeonOnly, verifiedOnly, female, beard, crown, mega, emi]);

  const toggleShortlist = (id: string) => {
    setShortlist((s) => {
      const next = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
      toast.success(s.includes(id) ? "Removed from compare list" : "Added to compare list");
      return next;
    });
  };

  return (
    <div className="container py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Explore Clinics</h1>
          <p className="text-muted-foreground mt-2">Filter by country, city, technique, budget and more. Add up to several clinics to compare.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/compare"><Scale className="h-4 w-4 mr-1" /> Compare ({shortlist.length})</Link>
        </Button>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        Listings marked <em>Sample</em>, <em>User-added</em> or <em>Needs verification</em> are not endorsed.
        Always verify the doctor, address and pricing directly with the clinic.
      </Disclaimer>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Filters</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Search</Label>
                <Input value={q} onChange={(e) => updateParam("q", e.target.value)} placeholder="Clinic or doctor name" />
              </div>
              <div>
                <Label>Country</Label>
                <Select value={country} onValueChange={(v) => updateParam("country", v === "__all" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">All</SelectItem>
                    {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {country === "India" && (
                <div>
                  <Label>City</Label>
                  <Select value={city} onValueChange={(v) => updateParam("city", v === "__all" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all">All</SelectItem>
                      {INDIA_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label>Technique</Label>
                <Select value={technique} onValueChange={(v) => updateParam("technique", v === "__all" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">Any</SelectItem>
                    {TECHNIQUES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Min rating</Label>
                <Select value={String(minRating || "")} onValueChange={(v) => updateParam("minRating", v === "__any" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__any">Any</SelectItem>
                    <SelectItem value="4">4.0+</SelectItem>
                    <SelectItem value="4.5">4.5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Max price / graft</Label>
                <Input
                  type="number"
                  value={maxPrice || ""}
                  onChange={(e) => updateParam("maxPrice", e.target.value)}
                  placeholder="e.g. 60"
                />
              </div>

              <div className="space-y-2 pt-2 border-t">
                {([
                  ["surgeon", "Surgeon-led only"],
                  ["verified", "Verified only"],
                  ["female", "Female HT support"],
                  ["beard", "Beard / BHT"],
                  ["crown", "Crown coverage"],
                  ["mega", "Mega-session support"],
                  ["emi", "EMI / finance available"],
                ] as const).map(([k, label]) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={params.get(k) === "1"} onCheckedChange={() => toggleParam(k)} />
                    {label}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        <section>
          {loading ? (
            <p className="text-muted-foreground">Loading clinics…</p>
          ) : filtered.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No clinics match these filters.</CardContent></Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((c) => {
                const inList = shortlist.includes(c.id);
                return (
                  <Card key={c.id} className="hover:shadow-elevated transition">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/clinics/${c.id}`} className="font-semibold hover:text-primary leading-tight">
                            {c.name}
                          </Link>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {c.city}{c.state ? `, ${c.state}` : ""} · {c.country}
                          </div>
                        </div>
                        <Badge variant={statusVariant(c.status) as any}>{statusLabel(c.status)}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(c.techniques || []).slice(0, 4).map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                      <div className="text-sm grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Price / graft</div>
                          <div className="font-medium">
                            {c.price_per_graft_low ? `${c.currency || "INR"} ${c.price_per_graft_low}–${c.price_per_graft_high}` : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                          <div className="font-medium flex items-center gap-1">
                            {c.google_rating ? (<><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {c.google_rating} <span className="text-xs text-muted-foreground">({c.review_count || 0})</span></>) : "—"}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button asChild size="sm" variant="outline" className="flex-1">
                          <Link to={`/clinics/${c.id}`}>Details</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant={inList ? "secondary" : "default"}
                          onClick={() => toggleShortlist(c.id)}
                        >
                          {inList ? <><Check className="h-3.5 w-3.5 mr-1" /> Added</> : <><Plus className="h-3.5 w-3.5 mr-1" /> Compare</>}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
