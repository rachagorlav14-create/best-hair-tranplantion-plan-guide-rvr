import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Compass, LogOut, ShieldCheck, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const primaryNav = [
  { to: "/planning", label: "HT Plan" },
  { to: "/photo-assessment", label: "Photos" },
  { to: "/view-360", label: "360°" },
  { to: "/calculator", label: "Grafts" },
  { to: "/clinics", label: "Clinics" },
  { to: "/doctors", label: "Doctors" },
  { to: "/baldness-library", label: "Library" },
  { to: "/cost", label: "Cost" },
  { to: "/recovery", label: "Recovery" },
  { to: "/learn", label: "Learn" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const nav = useNavigate();

  const handleSignOut = async () => { await signOut(); nav("/"); };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
    localStorage.setItem("htc.theme", document.documentElement.classList.contains("light") ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg shrink-0 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
            <Compass className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline tracking-tight">HT <span className="text-gradient-gold">Compass</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {primaryNav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )
              }
            >{n.label}</NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) =>
              cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1",
                 isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60")}>
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="h-9 w-9">
            <Sun className="h-4 w-4 hidden [.light_&]:block" />
            <Moon className="h-4 w-4 block [.light_&]:hidden" />
          </Button>
          {user ? (
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out" className="h-9 w-9">
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" asChild className="bg-gradient-gold text-primary-foreground hover:opacity-90 h-9 rounded-lg">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <button className="lg:hidden p-2" onClick={() => setOpen((s) => !s)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/40 glass-strong max-h-[80vh] overflow-y-auto">
          <div className="container py-3 grid grid-cols-2 gap-1">
            {primaryNav.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn("px-3 py-2.5 rounded-lg text-sm font-medium",
                     isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary/60")}>
                {n.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-primary col-span-2 bg-primary/10">
                <ShieldCheck className="h-3.5 w-3.5 inline mr-1" /> Admin Dashboard
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
