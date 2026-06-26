import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/learn", label: "Learn" },
  { to: "/calculator", label: "Stage & Grafts" },
  { to: "/photo-planner", label: "Photo Planner" },
  { to: "/clinics", label: "Clinics" },
  { to: "/cost", label: "Cost" },
  { to: "/recovery", label: "Recovery" },
  { to: "/medications", label: "Medications" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground shadow-soft">
            <Compass className="h-5 w-5" />
          </span>
          <span>HT Compass</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/profile">Profile</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/calculator">Start assessment</Link>
          </Button>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen((s) => !s)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t bg-background">
          <div className="container py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Button size="sm" className="mt-2" asChild>
              <Link to="/calculator" onClick={() => setOpen(false)}>Start assessment</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
