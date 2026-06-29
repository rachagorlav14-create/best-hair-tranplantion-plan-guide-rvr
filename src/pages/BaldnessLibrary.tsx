import { BALDNESS_STAGES } from "@/data/baldnessStages";
import { Disclaimer } from "@/components/Disclaimer";
import { Badge } from "@/components/ui/badge";

export default function BaldnessLibrary() {
  return (
    <div className="container py-10 max-w-6xl">
      <header className="mb-6">
        <div className="text-xs uppercase tracking-wider text-primary mb-2">Reference</div>
        <h1 className="font-display text-3xl md:text-5xl font-bold">Baldness Stage Library</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Visual references for the Norwood scale (men), Ludwig scale (women), and common patterns.
          Use this to recognise your likely range — final assessment must be done by a surgeon.
        </p>
      </header>

      <Disclaimer tone="warning" className="mb-8">
        Illustrations are simplified educational visuals. Real scalp anatomy varies. Graft ranges and
        suitability are typical estimates, not commitments.
      </Disclaimer>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {BALDNESS_STAGES.map((s) => (
          <div key={s.key} className="glass rounded-2xl p-5 hover:border-primary/40 transition-colors">
            <div className="aspect-[4/3] rounded-xl bg-gradient-aurora border border-border/30 flex items-center justify-center mb-4 relative overflow-hidden">
              <StageIllustration stageKey={s.key} />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="text-[10px]">{s.scale}</Badge>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="font-display text-3xl font-bold text-gradient-gold">{s.shortLabel}</span>
              </div>
            </div>
            <div className="font-display font-semibold text-lg">{s.label}</div>
            <p className="text-sm text-muted-foreground mt-1.5">{s.description}</p>
            <div className="mt-4 space-y-2 text-xs">
              <Row label="Graft range" value={s.graftRange[1] === 0 ? "Typically none" : `${s.graftRange[0].toLocaleString()}–${s.graftRange[1].toLocaleString()}`} />
              <Row label="HT suitability" value={s.htSuitability} />
              <Row label="Medication first?" value={s.medicationFirst ? "Yes" : "Optional"} />
            </div>
            <div className="mt-4 pt-4 border-t border-border/40 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Typical plan</div>
              <p className="text-xs leading-relaxed">{s.typicalPlan}</p>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">Realistic expectations</div>
              <p className="text-xs leading-relaxed text-muted-foreground">{s.expectations}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

/** Simplified SVG scalp illustration tinted by severity. */
function StageIllustration({ stageKey }: { stageKey: string }) {
  // Map stage → fill regions
  const intensity: Record<string, { front: number; mid: number; crown: number }> = {
    n1: { front: 0, mid: 0, crown: 0 },
    n2: { front: 1, mid: 0, crown: 0 },
    n3: { front: 2, mid: 0, crown: 0 },
    n3v: { front: 2, mid: 0, crown: 1 },
    n4: { front: 3, mid: 1, crown: 2 },
    n5: { front: 3, mid: 2, crown: 3 },
    n6: { front: 4, mid: 3, crown: 4 },
    n7: { front: 4, mid: 4, crown: 4 },
    diffuse: { front: 2, mid: 2, crown: 2 },
    crown: { front: 0, mid: 0, crown: 3 },
    l1: { front: 1, mid: 1, crown: 0 },
    l2: { front: 2, mid: 2, crown: 1 },
    l3: { front: 3, mid: 3, crown: 2 },
  };
  const it = intensity[stageKey] || { front: 0, mid: 0, crown: 0 };
  const color = (n: number) => {
    const colors = ["hsl(158 65% 45% / 0.7)", "hsl(50 80% 55% / 0.7)", "hsl(35 80% 55% / 0.7)", "hsl(15 75% 55% / 0.75)", "hsl(0 75% 55% / 0.8)"];
    return colors[Math.min(n, 4)];
  };
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full">
      {/* head */}
      <ellipse cx="100" cy="80" rx="65" ry="55" fill="hsl(var(--secondary))" />
      {/* front */}
      <path d="M 45 65 Q 100 30 155 65 Q 140 50 100 48 Q 60 50 45 65 Z" fill={color(it.front)} />
      {/* mid */}
      <ellipse cx="100" cy="75" rx="40" ry="18" fill={color(it.mid)} opacity="0.85" />
      {/* crown */}
      <ellipse cx="100" cy="95" rx="28" ry="20" fill={color(it.crown)} opacity="0.9" />
    </svg>
  );
}
