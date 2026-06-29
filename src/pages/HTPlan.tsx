import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/Disclaimer";
import { guestAssessment } from "@/lib/guest";
import { ArrowRight, Camera, Eye, Calculator, Hospital, Pill, Activity, Download, FileText } from "lucide-react";

export default function HTPlan() {
  const a = guestAssessment.get();
  const hasPlan = !!a;

  return (
    <div className="container py-10 max-w-6xl">
      <header className="mb-6">
        <div className="text-xs uppercase tracking-wider text-primary mb-2">Your plan</div>
        <h1 className="font-display text-3xl md:text-5xl font-bold">HT Planning Dashboard</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Everything we know about your situation, in one place. Update photos any time to refresh.
        </p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        This plan is an approximate educational estimate compiled from your inputs and AI-assisted photo
        review. Final stage, graft count, technique, medication and pricing must be confirmed by a
        qualified surgeon.
      </Disclaimer>

      {!hasPlan ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Camera className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <div className="font-display font-semibold text-lg">No assessment yet</div>
          <p className="text-sm text-muted-foreground mt-1 mb-5 max-w-md mx-auto">
            Upload scalp photos to generate your preliminary HT plan, graft estimate and clinic shortlist.
          </p>
          <Button asChild className="bg-gradient-gold text-primary-foreground rounded-xl">
            <Link to="/photo-assessment">Start free assessment <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Stage card */}
          <div className="glass-strong rounded-2xl p-6 lg:col-span-2 border-gradient-gold">
            <div className="text-xs uppercase tracking-wider text-primary">Likely stage</div>
            <div className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mt-2">
              {a.norwoodStage || a.ludwigStage || "—"}
            </div>
            <div className="text-sm text-muted-foreground mt-2">{a.pattern}</div>
            <div className="mt-5 grid sm:grid-cols-3 gap-3">
              <Metric label="Graft estimate" value={a.graftLow && a.graftHigh ? `${a.graftLow.toLocaleString()}–${a.graftHigh.toLocaleString()}` : "—"} />
              <Metric label="Sessions" value={String(a.sessions || "—")} />
              <Metric label="Donor" value={a.donorQuality || "—"} />
            </div>
          </div>

          {/* Confidence */}
          <div className="glass rounded-2xl p-6 flex flex-col">
            <div className="text-xs uppercase tracking-wider text-accent">AI confidence</div>
            <div className="flex-1 flex items-center justify-center my-4">
              <ConfidenceRing value={Math.round((a.confidence || 0.5) * 100)} />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {a.isDemo ? "Demo / preliminary." : "AI-assisted visual estimate."} Always confirm with a surgeon.
            </p>
          </div>

          {/* Affected zones */}
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="text-xs uppercase tracking-wider text-emerald">Affected zones</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(a.affectedZones || []).map((z) => (
                <span key={z} className="px-3 py-1.5 rounded-full bg-secondary/60 text-sm border border-border/40">{z.split("_").join(" ")}</span>
              ))}
              {(!a.affectedZones || a.affectedZones.length === 0) && <span className="text-muted-foreground text-sm">None recorded.</span>}
            </div>
            {a.zoneSplit && (
              <div className="mt-5 space-y-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Area-wise graft split</div>
                {Object.entries(a.zoneSplit).map(([zone, [lo, hi]]) => (
                  <div key={zone} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{zone.split("_").join(" ")}</span>
                    <span className="font-medium">{lo.toLocaleString()}–{hi.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk flags */}
          <div className="glass rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider text-warning">Risk flags</div>
            {(a.riskFlags || []).length === 0 ? (
              <p className="text-sm text-muted-foreground mt-3">None flagged. Surgeon evaluation still required.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {a.riskFlags!.map((r, i) => <li key={i} className="flex gap-2"><span className="text-warning">⚠</span>{r}</li>)}
              </ul>
            )}
          </div>

          {/* Next steps */}
          <div className="lg:col-span-3 glass rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider text-primary mb-4">Next steps</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { to: "/view-360", icon: Eye, label: "View 360° map", desc: "See affected areas in 6 angles" },
                { to: "/clinics", icon: Hospital, label: "Match clinics", desc: "Filter by city, budget, technique" },
                { to: "/cost", icon: Calculator, label: "Estimate cost", desc: "Hospital-wise cost based on your grafts" },
                { to: "/pre-op", icon: Activity, label: "Pre-op plan", desc: "Day-by-day preparation checklist" },
              ].map((n) => (
                <Link key={n.to} to={n.to} className="p-4 rounded-xl bg-secondary/40 border border-border/30 hover:border-primary/40 transition-colors block">
                  <n.icon className="h-5 w-5 text-primary mb-2" />
                  <div className="font-semibold text-sm">{n.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
                </Link>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-border/40 flex flex-wrap gap-3 items-center">
              <Button variant="outline" onClick={() => window.print()} className="rounded-xl">
                <Download className="h-4 w-4 mr-2" /> Download plan (PDF / print)
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/photo-assessment"><Camera className="h-4 w-4 mr-2" /> Re-upload photos</Link>
              </Button>
              <span className="text-xs text-muted-foreground ml-auto"><FileText className="inline h-3 w-3" /> Plan is editable any time.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-secondary/40 border border-border/30">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display font-semibold text-lg mt-0.5">{value}</div>
    </div>
  );
}

function ConfidenceRing({ value }: { value: number }) {
  const off = 264 - (264 * value) / 100;
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 100 100" className="absolute inset-0">
        <circle cx="50" cy="50" r="42" strokeWidth="8" stroke="hsl(var(--secondary))" fill="none" />
        <circle cx="50" cy="50" r="42" strokeWidth="8" stroke="url(#tealGrad)" fill="none"
          strokeDasharray="264" strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 50 50)" />
        <defs>
          <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(175 70% 50%)" />
            <stop offset="1" stopColor="hsl(158 65% 50%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-display font-bold text-3xl text-gradient-teal">{value}%</div>
          <div className="text-[10px] text-muted-foreground">confidence</div>
        </div>
      </div>
    </div>
  );
}
