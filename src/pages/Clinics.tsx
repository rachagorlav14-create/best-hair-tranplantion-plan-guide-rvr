import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Disclaimer } from "@/components/Disclaimer";
import { SAMPLE_CLINICS, Clinic } from "@/data/sample";
import { Link } from "react-router-dom";
import { CheckCircle2, MapPin, Star, ShieldAlert, Filter, XCircle } from "lucide-react";

const REGIONS = ["All", "India", "Turkey", "Thailand", "UAE", "UK", "USA", "Europe", "Australia"] as const;

export default function Clinics() {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");
  const [q, setQ] = useState("");
  const [technique, setTechnique] = useState("any");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return SAMPLE_CLINICS.filter((c) => {
      if (region !== "All" && c.region !== region) return false;
      if (verifiedOnly && !c.verified) return false;
      if (technique !== "any" && !c.techniques.includes(technique)) return false;
      if (q && !`${c.name} ${c.city} ${c.country}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [region, q, technique, verifiedOnly]);

  const toggleShortlist = (id: string) =>
    setShortlist((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const shortlistedClinics = SAMPLE_CLINICS.filter((c) => shortlist.includes(c.id));

  return (
    <div className="container py-10 md:py-14 space-y-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Clinic Directory</h1>
        <p className="text-muted-foreground mt-2">Compare clinics by region, technique, doctor involvement and verification.</p>
      </header>

      <Disclaimer tone="warning">
        All listings shown are <strong>sample data</strong> for demonstration. Reviews and outcomes are not real and must not be used for decision-making. Verified listings will be added once admin moderation is enabled.
      </Disclaimer>

      <Tabs value={region} onValueChange={(v) => setRegion(v as typeof region)}>
        <TabsList className="flex-wrap h-auto">
          {REGIONS.map((r) => <TabsTrigger key={r} value={r}>{r}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="pt-6 grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Input placeholder="Search by name or city" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={technique} onValueChange={setTechnique}>
            <SelectTrigger><SelectValue placeholder="Technique" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any technique</SelectItem>
              <SelectItem value="FUE">FUE</SelectItem>
              <SelectItem value="FUT">FUT</SelectItem>
              <SelectItem value="DHI">DHI</SelectItem>
              <SelectItem value="Sapphire FUE">Sapphire FUE</SelectItem>
              <SelectItem value="PRP">PRP</SelectItem>
              <SelectItem value="GFC">GFC</SelectItem>
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={verifiedOnly} onCheckedChange={(v) => setVerifiedOnly(!!v)} />
            Verified only
          </label>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <ClinicCard key={c.id} clinic={c} shortlisted={shortlist.includes(c.id)} onToggle={() => toggleShortlist(c.id)} />
        ))}
        {filtered.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3"><CardContent className="py-10 text-center text-muted-foreground">No clinics match your filters.</CardContent></Card>
        )}
      </div>

      {shortlistedClinics.length > 0 && (
        <Card className="bg-gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Comparison ({shortlistedClinics.length})</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setShortlist([])}><XCircle className="h-4 w-4 mr-1" /> Clear</Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground border-b">
                <tr><th className="py-2 pr-3">Clinic</th><th className="pr-3">Region</th><th className="pr-3">Techniques</th><th className="pr-3">Doctor-led</th><th className="pr-3">Rating</th><th className="pr-3">Price/graft</th><th className="pr-3">Verified</th></tr>
              </thead>
              <tbody>
                {shortlistedClinics.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-3 pr-3 font-medium">{c.name}<div className="text-xs text-muted-foreground">{c.city}, {c.country}</div></td>
                    <td className="pr-3">{c.region}</td>
                    <td className="pr-3">{c.techniques.join(", ")}</td>
                    <td className="pr-3">{c.doctorLed ? "Yes" : "No"}</td>
                    <td className="pr-3">{c.rating} ({c.reviews})</td>
                    <td className="pr-3">{c.pricePerGraft.currency} {c.pricePerGraft.low}–{c.pricePerGraft.high}</td>
                    <td className="pr-3">{c.verified ? <Badge className="bg-success text-success-foreground">Verified</Badge> : <Badge variant="outline">Unverified</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <ChecklistCard />
    </div>
  );
}

function ClinicCard({ clinic: c, shortlisted, onToggle }: { clinic: Clinic; shortlisted: boolean; onToggle: () => void }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{c.name}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5" /> {c.city}, {c.country}
            </div>
          </div>
          {c.verified ? (
            <Badge className="bg-success text-success-foreground gap-1"><CheckCircle2 className="h-3 w-3" />Verified</Badge>
          ) : (
            <Badge variant="outline">Unverified</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        <div className="flex flex-wrap gap-1">
          {c.techniques.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-warning" /> {c.rating} ({c.reviews})</span>
          <span>{c.yearsExperience}+ yrs</span>
          <span>{c.doctorLed ? "Doctor-led" : "Technician-assisted"}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Price/graft: <span className="text-foreground font-medium">{c.pricePerGraft.currency} {c.pricePerGraft.low}–{c.pricePerGraft.high}</span>
        </div>
        {c.redFlags && c.redFlags.length > 0 && (
          <div className="flex gap-2 text-xs text-warning"><ShieldAlert className="h-4 w-4 shrink-0" /> {c.redFlags[0]}</div>
        )}
        <p className="text-xs text-muted-foreground italic">Sample data — for demonstration only.</p>
      </CardContent>
      <div className="p-4 pt-0 flex gap-2">
        <Button size="sm" variant={shortlisted ? "default" : "outline"} onClick={onToggle}>
          {shortlisted ? "In shortlist" : "Add to shortlist"}
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link to="/clinics">View details</Link>
        </Button>
      </div>
    </Card>
  );
}

const checklist = [
  "Surgeon personally performs hairline design & key extraction",
  "Detailed donor mapping & density measurement provided",
  "Realistic counseling on density and limits",
  "Written quote with graft count and inclusions",
  "Hygiene & sterilization protocols visible",
  "Clear follow-up & emergency contact plan",
  "Refund / cancellation policy in writing",
  "Negative reviews are not all generic 5-star or 1-star",
];

function ChecklistCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5 text-primary" /> How to select a clinic</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          {checklist.map((c) => (
            <li key={c} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /> {c}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
