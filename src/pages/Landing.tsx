import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Calculator, Hospital, Sparkles, ShieldCheck, Activity, Pill, Eye, MapPin } from "lucide-react";
import { BALDNESS_STAGES } from "@/data/baldnessStages";

const steps = [
  { n: "1", title: "Upload scalp photos", body: "Front, temples, top, crown, donor.", icon: Camera },
  { n: "2", title: "Get AI-assisted estimate", body: "Norwood/Ludwig stage + graft range.", icon: Sparkles },
  { n: "3", title: "Compare clinics", body: "India + global. Filter, shortlist, compare.", icon: Hospital },
  { n: "4", title: "Plan & recover", body: "Pre-op, post-op, meds, photo progress.", icon: Activity },
];

const features = [
  { icon: Sparkles, title: "AI Photo Assessment", body: "Multi-angle scalp photos analysed for stage, donor and graft estimate.", to: "/photo-assessment", grad: "bg-gradient-gold" },
  { icon: Eye, title: "360° Baldness Map", body: "Rotating view of affected zones and planned transplant areas.", to: "/view-360", grad: "bg-gradient-teal" },
  { icon: Calculator, title: "Graft Calculator", body: "Area-wise graft split with low/medium/high density plans.", to: "/calculator", grad: "bg-gradient-emerald" },
  { icon: Hospital, title: "Clinic Discovery", body: "India + worldwide directory with verification and pricing labels.", to: "/clinics", grad: "bg-gradient-gold" },
  { icon: MapPin, title: "Doctor Finder", body: "Surgeon profiles with technique focus and verification badge.", to: "/doctors", grad: "bg-gradient-teal" },
  { icon: Pill, title: "Recovery & Meds", body: "Day-by-day timeline, daily logs and medication reminders.", to: "/recovery", grad: "bg-gradient-emerald" },
];

const stageCards = BALDNESS_STAGES.slice(0, 6);

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aurora pointer-events-none" />
        <div className="container relative pt-16 pb-24 md:pt-24 md:pb-32 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-7 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary">AI-assisted preliminary estimate</span>
              <span className="text-muted-foreground">· Educational only</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Plan your <span className="text-gradient-gold">hair transplant</span><br />
              with <span className="text-gradient-teal">clarity</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Upload photos, get a preliminary stage and graft estimate, compare clinics worldwide,
              and follow a calm pre-op and recovery plan — all in one premium space.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild className="bg-gradient-gold text-primary-foreground hover:opacity-90 rounded-xl h-12 px-6 shadow-glow">
                <Link to="/photo-assessment">Try free assessment <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-xl h-12 px-6 border-border/60">
                <Link to="/clinics">Explore clinics</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 pt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald" /> No diagnosis claims</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald" /> Use without signup</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald" /> Photos stay private</span>
            </div>
          </div>

          {/* Premium assessment-score preview card */}
          <div className="lg:col-span-5 relative animate-fade-in">
            <div className="absolute -inset-8 bg-gradient-gold opacity-20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative glass-strong rounded-3xl p-6 shadow-elegant border border-border/40 animate-float">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Sample assessment</div>
                  <div className="font-display text-lg font-semibold mt-1">Your HT readiness</div>
                </div>
                <div className="relative h-20 w-20">
                  <svg viewBox="0 0 100 100" className="absolute inset-0">
                    <circle cx="50" cy="50" r="42" strokeWidth="8" stroke="hsl(var(--secondary))" fill="none" />
                    <circle cx="50" cy="50" r="42" strokeWidth="8" stroke="url(#gold)" fill="none"
                      strokeDasharray="264" strokeDashoffset="66" strokeLinecap="round" transform="rotate(-90 50 50)" />
                    <defs>
                      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="hsl(42 75% 60%)" />
                        <stop offset="1" stopColor="hsl(35 80% 60%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-display font-bold text-xl text-gradient-gold leading-none">75</div>
                      <div className="text-[9px] text-muted-foreground">/100</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Estimated stage", value: "Norwood 3V", color: "bg-gradient-gold" },
                  { label: "Graft range", value: "3,200 – 4,500", color: "bg-gradient-teal" },
                  { label: "Donor quality", value: "Good", color: "bg-gradient-emerald" },
                  { label: "Sessions", value: "1 (mega)", color: "bg-gradient-gold" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/30">
                    <span className="text-xs text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[10px] text-muted-foreground/80 leading-relaxed">
                Approximate educational estimate only — not a diagnosis or treatment plan.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="container pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold/20 text-primary font-display font-bold">{s.n}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container pb-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-wider text-primary mb-2">What's inside</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold">A complete HT planning toolkit</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Link key={f.title} to={f.to} className="group">
              <div className="glass rounded-2xl p-6 h-full hover:border-primary/40 transition-all hover:-translate-y-1">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.grad} text-primary-foreground mb-4 shadow-soft`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="font-display font-semibold text-lg">{f.title}</div>
                <div className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.body}</div>
                <div className="mt-4 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BALDNESS LIBRARY PREVIEW */}
      <section className="container pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-accent mb-2">Baldness library</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Know your stage</h2>
          </div>
          <Button variant="ghost" size="sm" asChild><Link to="/baldness-library">View all <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stageCards.map((s) => (
            <Link to="/baldness-library" key={s.key} className="glass rounded-xl p-4 hover:border-primary/40 transition-colors group">
              <div className="aspect-square rounded-lg bg-gradient-aurora flex items-center justify-center mb-3 border border-border/30">
                <span className="font-display font-bold text-2xl text-gradient-gold">{s.shortLabel}</span>
              </div>
              <div className="text-xs font-medium truncate">{s.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.graftRange[0] || "—"}–{s.graftRange[1] || "—"} grafts</div>
            </Link>
          ))}
        </div>
      </section>

      {/* DISCLAIMER STRIP */}
      <section className="container pb-16">
        <div className="glass-gold rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
          <div className="text-sm leading-relaxed">
            <strong className="text-foreground">Important:</strong>{" "}
            <span className="text-muted-foreground">
              Every estimate, stage suggestion, graft range, cost projection, clinic listing and medication note in HT Compass
              is an approximate educational reference. It is <strong>not medical advice, not a diagnosis</strong>, and not a
              substitute for in-person consultation with a qualified dermatologist or hair-transplant surgeon. Final graft
              count, technique, medication and pricing depend on donor quality, hair caliber, scalp condition, doctor
              evaluation and clinic package.
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="relative rounded-3xl bg-gradient-hero glass border border-border/40 p-8 md:p-12 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-gold opacity-30 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold">Start your free assessment</h3>
              <p className="text-muted-foreground mt-3">No signup needed. Save your plan, photos and clinic shortlist by creating a free profile after.</p>
            </div>
            <div className="md:text-right flex md:justify-end gap-3 flex-wrap">
              <Button size="lg" asChild className="bg-gradient-gold text-primary-foreground rounded-xl h-12 px-6">
                <Link to="/photo-assessment">Upload photos <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-xl h-12 px-6 border-border/60">
                <Link to="/calculator">Just estimate grafts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
