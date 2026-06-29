import { useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { guestAssessment } from "@/lib/guest";

const VIEWS = [
  { key: "front", label: "Front hairline" },
  { key: "left", label: "Left temple" },
  { key: "top", label: "Top / mid-scalp" },
  { key: "crown", label: "Crown" },
  { key: "right", label: "Right temple" },
  { key: "back", label: "Donor / back" },
];

type Severity = 0 | 1 | 2 | 3 | 4;
const SEV_COLOR: Record<Severity, string> = {
  0: "hsl(158 65% 45% / 0.75)", // healthy
  1: "hsl(50 80% 55% / 0.75)",  // mild
  2: "hsl(35 80% 55% / 0.75)",  // moderate
  3: "hsl(15 75% 55% / 0.8)",   // severe
  4: "hsl(0 75% 55% / 0.85)",   // bald
};
const SEV_LABEL = ["Healthy / donor", "Mild thinning", "Moderate thinning", "Severe thinning", "Bald area"];

export default function View360() {
  const assess = guestAssessment.get();

  // Derive severity from assessment.affected_zones, or default
  const initial = useMemo<Record<string, Severity>>(() => {
    const z = new Set(assess?.affectedZones || []);
    return {
      front: z.has("hairline") || z.has("temples") ? 3 : 1,
      left: z.has("temples") ? 3 : 1,
      right: z.has("temples") ? 3 : 1,
      top: z.has("mid_scalp") || z.has("diffuse") ? 3 : 1,
      crown: z.has("crown") ? 4 : 1,
      back: 0,
    };
  }, [assess]);

  const [sev, setSev] = useState(initial);
  const [idx, setIdx] = useState(0);
  const view = VIEWS[idx];
  const cycle = (delta: number) => setIdx((i) => (i + delta + VIEWS.length) % VIEWS.length);

  return (
    <div className="container py-10 max-w-5xl">
      <header className="mb-6">
        <div className="text-xs uppercase tracking-wider text-accent mb-2">Visualisation</div>
        <h1 className="font-display text-3xl md:text-5xl font-bold">360° Baldness Map</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Rotate through six scalp views to visualise affected areas and planned transplant zones.
          Adjust severity per area to refine the map.
        </p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        Approximate 360° planning visualisation — not medical imaging. Surgeon evaluation is required.
      </Disclaimer>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Rotating viewer */}
        <div className="lg:col-span-3 glass-strong rounded-3xl p-6 shadow-elegant">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Current view</div>
              <div className="font-display text-2xl font-semibold mt-1">{view.label}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => cycle(-1)} className="rounded-xl"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => cycle(1)} className="rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="aspect-square w-full rounded-2xl bg-gradient-aurora border border-border/40 flex items-center justify-center relative overflow-hidden">
            <ScalpView view={view.key} severity={sev} />
            <div className="absolute bottom-3 left-3 text-[10px] text-muted-foreground glass rounded-md px-2 py-1">
              View {idx + 1} / {VIEWS.length}
            </div>
            <div className="absolute top-3 right-3">
              <Button variant="ghost" size="icon" onClick={() => cycle(1)} className="rounded-full bg-secondary/60 backdrop-blur"><RotateCw className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1.5 mt-4">
            {VIEWS.map((v, i) => (
              <button key={v.key} onClick={() => setIdx(i)}
                className={`p-2 rounded-lg text-[10px] font-medium transition-colors ${i === idx ? "bg-primary/20 text-primary border border-primary/40" : "bg-secondary/40 text-muted-foreground hover:bg-secondary"}`}>
                {v.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Severity controls */}
        <div className="lg:col-span-2 space-y-3">
          <div className="glass rounded-2xl p-5">
            <div className="font-display font-semibold mb-3">Adjust severity</div>
            {VIEWS.map((v) => (
              <div key={v.key} className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm">{v.label}</span>
                  <span className="text-xs text-muted-foreground">{SEV_LABEL[sev[v.key]]}</span>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button key={n} onClick={() => setSev((s) => ({ ...s, [v.key]: n as Severity }))}
                      className="flex-1 h-2 rounded-full transition-all"
                      style={{ background: sev[v.key] >= n ? SEV_COLOR[n as Severity] : "hsl(var(--secondary))" }}
                      aria-label={`${v.label} severity ${n}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="font-display font-semibold mb-3 text-sm">Legend</div>
            <div className="space-y-1.5">
              {SEV_LABEL.map((label, n) => (
                <div key={n} className="flex items-center gap-2 text-xs">
                  <span className="h-3 w-3 rounded-full" style={{ background: SEV_COLOR[n as Severity] }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScalpView({ view, severity }: { view: string; severity: Record<string, number> }) {
  const c = (n: number) => SEV_COLOR[Math.min(n, 4) as Severity];
  // Different rendering per view
  if (view === "top") {
    return (
      <svg viewBox="0 0 200 200" className="h-[70%] w-[70%]">
        <ellipse cx="100" cy="100" rx="80" ry="90" fill="hsl(var(--secondary))" />
        <path d="M 35 80 Q 100 30 165 80 Q 145 60 100 55 Q 55 60 35 80 Z" fill={c(severity.front)} />
        <ellipse cx="100" cy="105" rx="55" ry="25" fill={c(severity.top)} opacity="0.9" />
        <ellipse cx="100" cy="145" rx="38" ry="28" fill={c(severity.crown)} opacity="0.95" />
      </svg>
    );
  }
  if (view === "front") {
    return (
      <svg viewBox="0 0 200 200" className="h-[70%] w-[70%]">
        <ellipse cx="100" cy="115" rx="65" ry="80" fill="hsl(var(--secondary))" />
        <path d="M 40 70 Q 100 30 160 70 Q 140 55 100 53 Q 60 55 40 70 Z" fill={c(severity.front)} />
        <ellipse cx="55" cy="80" rx="18" ry="12" fill={c(severity.left)} opacity="0.85" />
        <ellipse cx="145" cy="80" rx="18" ry="12" fill={c(severity.right)} opacity="0.85" />
      </svg>
    );
  }
  if (view === "left" || view === "right") {
    const mirror = view === "right";
    return (
      <svg viewBox="0 0 200 200" className="h-[70%] w-[70%]" style={{ transform: mirror ? "scaleX(-1)" : undefined }}>
        <ellipse cx="100" cy="115" rx="75" ry="80" fill="hsl(var(--secondary))" />
        <path d="M 30 80 Q 90 40 165 60 Q 130 55 90 60 Q 50 70 30 80 Z" fill={c(severity.front)} />
        <ellipse cx="60" cy="85" rx="22" ry="14" fill={c(mirror ? severity.right : severity.left)} opacity="0.9" />
        <ellipse cx="110" cy="70" rx="35" ry="15" fill={c(severity.top)} opacity="0.85" />
        <ellipse cx="155" cy="110" rx="22" ry="20" fill={c(severity.crown)} opacity="0.85" />
      </svg>
    );
  }
  if (view === "crown") {
    return (
      <svg viewBox="0 0 200 200" className="h-[70%] w-[70%]">
        <ellipse cx="100" cy="100" rx="80" ry="88" fill="hsl(var(--secondary))" />
        <ellipse cx="100" cy="100" rx="48" ry="42" fill={c(severity.crown)} />
        <ellipse cx="100" cy="60" rx="35" ry="14" fill={c(severity.top)} opacity="0.85" />
      </svg>
    );
  }
  // back / donor
  return (
    <svg viewBox="0 0 200 200" className="h-[70%] w-[70%]">
      <ellipse cx="100" cy="100" rx="75" ry="88" fill="hsl(var(--secondary))" />
      <path d="M 30 110 Q 100 160 170 110 Q 100 130 30 110 Z" fill={c(severity.back)} />
      <ellipse cx="100" cy="70" rx="55" ry="18" fill={c(severity.crown)} opacity="0.6" />
    </svg>
  );
}
