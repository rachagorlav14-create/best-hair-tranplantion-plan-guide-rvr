import { NavLink, Link } from "react-router-dom";
import { Home, Camera, Hospital, ClipboardList, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/photo-assessment", label: "Photos", icon: Camera },
  { to: "/planning", label: "Plan", icon: Sparkles, primary: true },
  { to: "/clinics", label: "Clinics", icon: Hospital },
  { to: "/recovery", label: "Track", icon: ClipboardList },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 pb-safe">
      <div className="mx-3 mb-3 glass-strong rounded-2xl border border-border/50 shadow-elegant">
        <ul className="grid grid-cols-5 px-2 py-2">
          {items.map((it) => (
            <li key={it.to} className="flex">
              <NavLink
                to={it.to}
                end={it.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl text-[10px] font-medium transition-all",
                    it.primary && "scale-110 -mt-4",
                    isActive
                      ? it.primary
                        ? "bg-gradient-gold text-primary-foreground shadow-glow"
                        : "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                <it.icon className={cn("h-5 w-5", it.primary && "h-6 w-6")} />
                <span>{it.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
