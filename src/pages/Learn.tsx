import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/Disclaimer";
import { EVOLUTION_TIMELINE } from "@/data/sample";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const techniques = [
  { name: "FUT (Strip)", body: "A strip of donor scalp is removed and dissected. Allows very large sessions but leaves a linear scar.", pros: "Large session, lower cost per graft", cons: "Linear scar, longer recovery" },
  { name: "FUE", body: "Individual follicular units extracted with a punch. No linear scar, slower extraction.", pros: "No linear scar, shorter visible recovery", cons: "Time-intensive, requires shaving" },
  { name: "DHI", body: "Direct implantation using a Choi implanter pen — no pre-made incisions.", pros: "Dense packing, control of angle", cons: "Slower, often more expensive" },
  { name: "Sapphire FUE", body: "Sapphire blades create finer recipient slits for denser placement and faster healing.", pros: "Finer slits, dense packing", cons: "Doesn't change extraction quality" },
  { name: "Beard/Body Hair", body: "Used to supplement scalp donor when scalp donor is limited. Texture differs.", pros: "Adds donor capacity", cons: "Different texture, growth cycle" },
];

const suitability = {
  yes: [
    "Stable pattern hair loss with adequate donor density",
    "Realistic expectations on density and timeline",
    "No active scalp infections",
    "Well-managed health conditions (BP, diabetes, thyroid)",
  ],
  wait: [
    "Very young (under 25) with rapidly progressing pattern",
    "Active diffuse shedding without diagnosis",
    "Unrealistic expectations of teenage hairline",
    "Untreated scalp conditions (severe seborrhea, lichen planopilaris)",
    "Female pattern where medical therapy hasn't been tried",
  ],
};

const stages = {
  men: [
    { stage: "Norwood 1", desc: "No significant recession." },
    { stage: "Norwood 2", desc: "Slight temple recession, adult mature hairline." },
    { stage: "Norwood 3", desc: "First real cosmetic stage — deeper temple recession." },
    { stage: "Norwood 3V", desc: "Crown thinning begins along with frontal recession." },
    { stage: "Norwood 4", desc: "Significant frontal & crown loss with band of hair separating." },
    { stage: "Norwood 5", desc: "Band narrows; frontal & crown areas larger." },
    { stage: "Norwood 6", desc: "Band gone; large bald front and crown merging." },
    { stage: "Norwood 7", desc: "Only horseshoe rim of donor hair remains." },
  ],
  women: [
    { stage: "Ludwig I", desc: "Mild thinning along the midline part." },
    { stage: "Ludwig II", desc: "Moderate central thinning, wider part." },
    { stage: "Ludwig III", desc: "Severe diffuse thinning, scalp clearly visible." },
  ],
};

const myths = [
  { myth: "Transplanted hair never falls again.", reality: "Transplanted follicles shed in the first weeks (shock loss) and regrow from month 3–4." },
  { myth: "More grafts always means better density.", reality: "Donor supply is finite — over-harvesting can permanently damage the donor area." },
  { myth: "A teenage hairline can be recreated.", reality: "Hairline should be age-appropriate; aggressive low hairlines look unnatural over time." },
  { myth: "PRP alone regrows lost hair fully.", reality: "PRP/GFC may support existing hair and graft survival; evidence is mixed." },
];

export default function Learn() {
  return (
    <div className="container py-10 md:py-14 space-y-12">
      <header className="max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Learn</h1>
        <p className="text-muted-foreground mt-3">Plain-language education about hair-loss patterns, techniques, donor biology, and realistic expectations.</p>
      </header>

      <Disclaimer tone="info">
        Content is for general education. It does not replace examination by a dermatologist or hair-transplant surgeon.
      </Disclaimer>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">What is hair transplantation?</h2>
        <Card className="bg-gradient-card">
          <CardContent className="pt-6 text-muted-foreground leading-relaxed">
            A hair transplant moves DHT-resistant follicles from the donor area (typically the back and sides of the scalp)
            into thinning or bald regions. The transplanted hairs go through a shedding phase, then regrow over 6–12 months.
            It is a cosmetic redistribution of existing donor hair — it does not create new follicles.
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Evolution of hair-transplant treatments</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVOLUTION_TIMELINE.map((e) => (
            <Card key={e.title}>
              <CardHeader className="pb-2">
                <div className="text-xs font-mono text-primary">{e.year}</div>
                <CardTitle className="text-base">{e.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{e.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Techniques compared</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techniques.map((t) => (
            <Card key={t.name}>
              <CardHeader><CardTitle className="text-base">{t.name}</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>{t.body}</p>
                <p><strong className="text-success">Pros:</strong> {t.pros}</p>
                <p><strong className="text-warning">Cons:</strong> {t.cons}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Who is a candidate?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-success/30">
            <CardHeader><CardTitle className="text-base text-success">Generally suitable</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                {suitability.yes.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-warning/40">
            <CardHeader><CardTitle className="text-base text-warning">Better to wait or consult first</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                {suitability.wait.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Baldness stages</h2>
        <Tabs defaultValue="men">
          <TabsList>
            <TabsTrigger value="men">Men — Norwood</TabsTrigger>
            <TabsTrigger value="women">Women — Ludwig</TabsTrigger>
          </TabsList>
          <TabsContent value="men" className="mt-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {stages.men.map((s) => (
                <Card key={s.stage}><CardContent className="pt-5">
                  <div className="font-semibold">{s.stage}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="women" className="mt-4">
            <div className="grid sm:grid-cols-3 gap-3">
              {stages.women.map((s) => (
                <Card key={s.stage}><CardContent className="pt-5">
                  <div className="font-semibold">{s.stage}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Realistic expectations</h2>
        <Card><CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
          <p>• Density typically reaches 40–55% of native density in one session; second sittings may add coverage.</p>
          <p>• Visible growth begins around month 3–4; meaningful results at month 6; maturity at month 12–18.</p>
          <p>• Hairline design must respect age, facial proportions and long-term donor sustainability.</p>
          <p>• Crown is a low-priority area in advanced loss — it consumes many grafts and can keep expanding.</p>
        </CardContent></Card>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Common myths & red flags</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {myths.map((m) => (
            <Card key={m.myth}>
              <CardContent className="pt-6">
                <p className="text-sm"><strong className="text-destructive">Myth:</strong> {m.myth}</p>
                <p className="text-sm text-muted-foreground mt-2"><strong className="text-success">Reality:</strong> {m.reality}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
