import { AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "warning" | "safety";

export function Disclaimer({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const map = {
    info: { Icon: Info, cls: "bg-secondary/60 border-primary/20 text-foreground", iconCls: "text-primary" },
    warning: { Icon: AlertTriangle, cls: "bg-warning/10 border-warning/40 text-warning-foreground", iconCls: "text-warning" },
    safety: { Icon: ShieldCheck, cls: "bg-success/10 border-success/30 text-foreground", iconCls: "text-success" },
  }[tone];
  const Icon = map.Icon;
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4 text-sm", map.cls, className)}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", map.iconCls)} />
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-muted-foreground [&_strong]:text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function ConfidenceBadge({ level }: { level: "low" | "medium" | "high" }) {
  const map = {
    low: "bg-destructive/10 text-destructive border-destructive/30",
    medium: "bg-warning/15 text-warning-foreground border-warning/40",
    high: "bg-success/15 text-success border-success/30",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", map[level])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      Confidence: {level}
    </span>
  );
}
