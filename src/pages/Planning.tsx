import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/Disclaimer";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PHOTO_AREAS } from "@/data/options";
import { Camera, Calculator, MapPin, Pill, ClipboardList, Download, Sparkles } from "lucide-react";

export default function Planning() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [calc, setCalc] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: ph }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("scalp_photos").select("area,severity").eq("user_id", user.id),
      ]);
      setProfile(p);
      setPhotos(ph || []);
      try { setCalc(JSON.parse(localStorage.getItem("ht_calc_last") || "null")); } catch {}

      // recommend by preferred city/country
      const prefCountry = p?.country || "India";
      const prefCity = p?.city || null;
      let q = supabase.from("clinics").select("*").eq("country", prefCountry).limit(4);
      if (prefCity) q = q.eq("city", prefCity);
      const { data: cl } = await q;
      if (cl && cl.length === 0) {
        const { data: cl2 } = await supabase.from("clinics").select("*").eq("country", prefCountry).limit(4);
        setRecommended(cl2 || []);
      } else setRecommended(cl || []);
    })();
  }, [user]);

  const profileFilled = profile && (profile.full_name || profile.age || (profile.concern_areas || []).length);
  const photosCount = new Set(photos.map((p) => p.area)).size;
  const photosPct = Math.round((photosCount / PHOTO_AREAS.length) * 100);

  const printReport = () => window.print();

  return (
    <div className="container py-10 max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" /> Your HT Planning Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Everything you've assessed in one place. Update each section as your plan evolves.</p>
        </div>
        <Button variant="outline" onClick={printReport}><Download className="h-4 w-4 mr-1" /> Print / share plan</Button>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        These graft numbers, baldness stage, clinic prices, and treatment plans are only approximate
        educational estimates. They are not medical advice and may vary based on donor quality, hair
        thickness, scalp condition, surgeon evaluation, clinic package, city, and technique. Please
        consult a qualified dermatologist or hair-transplant surgeon.
      </Disclaimer>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Profile summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {profileFilled ? (
              <div className="grid sm:grid-cols-2 gap-3">
                <Item label="Name" value={profile.full_name} />
                <Item label="Age" value={profile.age} />
                <Item label="Gender" value={profile.gender} />
                <Item label="Location" value={[profile.city, profile.state, profile.country].filter(Boolean).join(", ")} />
                <Item label="Hair loss duration" value={profile.hair_loss_duration} />
                <Item label="Family history" value={profile.family_history} />
                <Item label="Budget" value={profile.budget_range} />
                <Item label="Timeline" value={profile.treatment_timeline} />
                <div className="sm:col-span-2">
                  <div className="text-xs text-muted-foreground">Concern areas</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(profile.concern_areas || []).map((a: string) => <Badge key={a} variant="secondary">{a}</Badge>)}
                  </div>
                </div>
              </div>
            ) : (
              <Empty link="/profile" cta="Complete profile" text="Fill in your profile to personalise your plan." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Camera className="h-4 w-4" /> Photo checklist</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm mb-1">{photosCount} of {PHOTO_AREAS.length} areas uploaded</div>
              <Progress value={photosPct} />
            </div>
            <ul className="text-sm space-y-1">
              {PHOTO_AREAS.map((a) => {
                const done = photos.some((p) => p.area === a.key);
                return (
                  <li key={a.key} className={`flex items-center gap-2 ${done ? "text-foreground" : "text-muted-foreground"}`}>
                    <span className={`inline-block h-2 w-2 rounded-full ${done ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                    {a.label}
                  </li>
                );
              })}
            </ul>
            <Button asChild size="sm" variant="outline" className="w-full"><Link to="/photo-assessment">Upload photos</Link></Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calculator className="h-4 w-4" /> Baldness stage & graft estimate</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {calc ? (
              <>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Item label="Likely stage" value={calc.stage} />
                  <Item label="Graft range" value={`${calc.graftLow?.toLocaleString()} – ${calc.graftHigh?.toLocaleString()}`} />
                  <Item label="Sessions" value={calc.sessions} />
                  <Item label="Donor caution" value={calc.donorCaution} />
                  <Item label="Confidence" value={calc.confidence} />
                </div>
                {calc.notes?.length > 0 && (
                  <div className="border-t pt-2">
                    <div className="text-xs text-muted-foreground mb-1">Notes</div>
                    <ul className="list-disc pl-5 space-y-1">{calc.notes.map((n: string, i: number) => <li key={i}>{n}</li>)}</ul>
                  </div>
                )}
                <Button asChild size="sm" variant="outline"><Link to="/calculator">Re-run calculator</Link></Button>
              </>
            ) : (
              <Empty link="/calculator" cta="Run calculator" text="Estimate your likely Norwood/Ludwig stage and graft range." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Suggested questions for the clinic</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
              <li>Who personally designs the hairline?</li>
              <li>What is my donor capacity in graft count?</li>
              <li>Will density be 35, 45 or 55 FU/cm²?</li>
              <li>How many sittings are realistically needed?</li>
              <li>What is included vs extra in the package?</li>
              <li>What is the policy if growth is poor?</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Suggested clinics to explore</CardTitle>
          </CardHeader>
          <CardContent>
            {recommended.length === 0 ? (
              <Empty link="/clinics" cta="Browse clinics" text="No clinics found for your preferred location yet." />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {recommended.map((c) => (
                  <Link key={c.id} to={`/clinics/${c.id}`} className="rounded-lg border p-3 hover:bg-muted transition">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.city}, {c.country}</div>
                    <div className="text-xs mt-2">{c.currency || "INR"} {c.price_per_graft_low}–{c.price_per_graft_high}/graft</div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Pre-op</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Use the day-wise checklist to prepare safely.</p>
            <Button asChild size="sm" variant="outline" className="mt-3"><Link to="/pre-op">Open pre-op guide</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Post-op recovery</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Log pain, swelling and shedding from Day 0 to month 18.</p>
            <Button asChild size="sm" variant="outline" className="mt-3"><Link to="/recovery">Open recovery tracker</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Pill className="h-4 w-4" /> Medications</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Track minoxidil, finasteride, antibiotics and reminders.</p>
            <Button asChild size="sm" variant="outline" className="mt-3"><Link to="/medications">Open meds tracker</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const Item = ({ label, value }: { label: string; value: any }) => (
  <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-medium">{value || "—"}</div></div>
);
const Empty = ({ text, cta, link }: { text: string; cta: string; link: string }) => (
  <div className="text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-3">
    <span>{text}</span>
    <Button asChild size="sm"><Link to={link}>{cta}</Link></Button>
  </div>
);
