import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Disclaimer } from "@/components/Disclaimer";
import { ArrowRight, Calculator, Camera, ClipboardList, Hospital, HeartPulse, Pill, ShieldCheck, Sparkles } from "lucide-react";
import { FAQS } from "@/data/sample";
import hero from "@/assets/hero.jpg";

const features = [
  { icon: Calculator, title: "Stage & Graft Calculator", body: "Guided wizard estimates Norwood/Ludwig stage and a graft range with confidence level.", to: "/calculator" },
  { icon: Camera, title: "Photo Planner", body: "Photo checklist and visual planner to mark thinning areas. Privacy-first.", to: "/photo-planner" },
  { icon: Hospital, title: "Clinic Directory", body: "Compare clinics across India, Turkey, Thailand, UAE, UK, USA & Europe.", to: "/clinics" },
  { icon: ClipboardList, title: "Cost Estimator", body: "Low/medium/high cost ranges by country, technique and add-ons.", to: "/cost" },
  { icon: HeartPulse, title: "Recovery Tracker", body: "Day-by-day timeline from Day 0 through 12-month maturity with daily checklist.", to: "/recovery" },
  { icon: Pill, title: "Medication Tracker", body: "Educational pages and a reminder log for minoxidil, finasteride, post-op meds & more.", to: "/medications" },
];

const steps = [
  { n: "01", title: "Learn the basics", body: "Browse techniques, baldness stages and realistic expectations." },
  { n: "02", title: "Run the calculator", body: "Get a stage estimate and graft range based on guided inputs." },
  { n: "03", title: "Compare clinics", body: "Shortlist by technique, doctor involvement, price and verification." },
  { n: "04", title: "Plan & recover", body: "Track meds, daily care, and photo progress through 12+ months." },
];

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="container relative grid lg:grid-cols-2 gap-12 py-16 md:py-24 items-center">
          <div className="space-y-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Education-first hair transplant planning
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              Make your hair restoration decision <span className="text-gradient">with clarity</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              HT Compass helps you understand baldness stages, estimate graft ranges, discover clinics,
              plan costs, and track recovery — all in one calm, evidence-aware space.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/calculator">Start free assessment <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/learn">Learn the basics</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" /> No diagnosis claims</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" /> Privacy-first photos</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" /> Sample-data clarity</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
            <img
              src={hero}
              alt="Calm topographic illustration of a scalp with follicle markers, representing hair-transplant planning"
              width={1600}
              height={1200}
              className="relative rounded-2xl shadow-elegant border border-border/50 w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* SAFETY DISCLAIMER */}
      <section className="container -mt-6 mb-12 relative">
        <Disclaimer tone="warning" title="Educational tool — not medical advice">
          HT Compass does not diagnose conditions, prescribe medication or replace consultation with a
          qualified <strong>dermatologist or hair-transplant surgeon</strong>. All estimates are rule-based
          ranges and demonstration data. Always verify with a licensed doctor before any treatment.
        </Disclaimer>
      </section>

      {/* FEATURES */}
      <section className="container py-12 md:py-16">
        <div className="max-w-2xl mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Everything to plan your journey</h2>
          <p className="text-muted-foreground mt-3">From first question to twelve-month maturity photo.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, body, to }) => (
            <Link key={title} to={to} className="group">
              <Card className="h-full bg-gradient-card hover:shadow-card transition-shadow border-border/60">
                <CardHeader>
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{body}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-soft py-16">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">How it works</h2>
          <div className="grid md:grid-cols-4 gap-5">
            {steps.map((s) => (
              <Card key={s.n} className="border-border/60">
                <CardContent className="pt-6">
                  <div className="text-3xl font-display font-bold text-primary/40">{s.n}</div>
                  <h3 className="font-semibold mt-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="container py-16">
        <div className="rounded-2xl bg-gradient-hero text-primary-foreground p-8 md:p-12 shadow-elegant relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold">Try the Stage & Graft Calculator</h3>
              <p className="opacity-90 mt-2">A 2-minute guided wizard returns a Norwood/Ludwig estimate, graft range, and a confidence level.</p>
            </div>
            <div className="md:text-right">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/calculator">Launch calculator <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Frequently asked</h2>
        <Accordion type="single" collapsible className="max-w-3xl">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
