import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Compass, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const primaryNav = [
  { to: "/planning", label: "Planning" },
  { to: "/profile", label: "Profile" },
  { to: "/photo-assessment", label: "Photos" },
  { to: "/calculator", label: "Calculator" },
  { to: "/clinics", label: "Clinics" },
  { to: "/compare", label: "Compare" },
  { to: "/cost", label: "Cost" },
  { to: "/pre-op", label: "Pre-Op" },
  { to: "/recovery", label: "Post-Op" },
  { to: "/medications", label: "Meds" },
  { to: "/learn", label: "Learn" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const nav = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    nav("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg shrink-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground shadow-soft">
            <Compass className="h-5 w-5" />
          </span>
          <span>HT Compass</span>
        </Link>
        <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
          {primaryNav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "px-2.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "px-2.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1",
                  isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </NavLink>
          )}
        </nav>
        <div className="hidden xl:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <span className="text-xs text-muted-foreground max-w-[140px] truncate">{user.email}</span>
              <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </div>
        <button className="xl:hidden p-2" onClick={() => setOpen((s) => !s)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="xl:hidden border-t bg-background max-h-[80vh] overflow-y-auto">
          <div className="container py-3 flex flex-col gap-1">
            {primaryNav.map((n) => (
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
            {isAdmin && (
              <NavLink to="/admin" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground">
                Admin
              </NavLink>
            )}
            <div className="border-t mt-2 pt-2">
              {user ? (
                <>
                  <div className="px-3 text-xs text-muted-foreground truncate">{user.email}</div>
                  <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => { setOpen(false); handleSignOut(); }}>
                    Sign out
                  </Button>
                </>
              ) : (
                <Button size="sm" className="w-full" asChild>
                  <Link to="/auth" onClick={() => setOpen(false)}>Sign in / Sign up</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
