import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-gradient-soft mt-20">
      <div className="container py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display font-bold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground">
              <Compass className="h-4 w-4" />
            </span>
            HT Compass
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Education-first planning support for hair transplant decisions. Not a medical diagnosis.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/learn" className="hover:text-primary">Learn</Link></li>
            <li><Link to="/calculator" className="hover:text-primary">Stage & Graft Calculator</Link></li>
            <li><Link to="/clinics" className="hover:text-primary">Clinic Directory</Link></li>
            <li><Link to="/cost" className="hover:text-primary">Cost Estimator</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Recovery</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/recovery" className="hover:text-primary">Recovery Timeline</Link></li>
            <li><Link to="/medications" className="hover:text-primary">Medication Tracker</Link></li>
            <li><Link to="/photo-planner" className="hover:text-primary">Photo Planner</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Safety</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            HT Compass provides general education and planning tools only. It does not diagnose,
            prescribe, or replace consultation with a qualified dermatologist or hair-transplant
            surgeon. Always consult a licensed doctor before any treatment decision.
          </p>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} HT Compass. Sample data shown for demonstration.</span>
          <span>Educational use only — not medical advice.</span>
        </div>
      </div>
    </footer>
  );
}
