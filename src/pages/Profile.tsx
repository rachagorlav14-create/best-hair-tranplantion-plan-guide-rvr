import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Calculator, Camera, Hospital, HeartPulse, Pill, User } from "lucide-react";

const cards = [
  { icon: Calculator, title: "My Hair Stage", body: "Re-run the stage calculator.", to: "/calculator" },
  { icon: Camera, title: "Uploaded Photos", body: "Manage progress photos.", to: "/photo-planner" },
  { icon: Hospital, title: "Clinic Shortlist", body: "Compare and shortlist clinics.", to: "/clinics" },
  { icon: HeartPulse, title: "Recovery Timeline", body: "Track post-op progress.", to: "/recovery" },
  { icon: Pill, title: "Medication Tracker", body: "Add and log medicines.", to: "/medications" },
  { icon: User, title: "Profile", body: "Update your details.", to: "/profile" },
];

export default function Profile() {
  return (
    <div className="container py-10 md:py-14 space-y-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Your dashboard</h1>
        <p className="text-muted-foreground mt-2">A single hub for your assessment, photos, plan, recovery and medications.</p>
      </header>

      <Disclaimer tone="info" title="Sign-in coming with Lovable Cloud">
        Profiles, persistent data, secure photo storage and reminders activate when Lovable Cloud is enabled on this project.
      </Disclaimer>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ icon: Icon, title, body, to }) => (
          <Link key={title} to={to} className="group">
            <Card className="h-full hover:shadow-card transition-shadow bg-gradient-card">
              <CardHeader>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base mt-2">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{body}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Get started</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild><Link to="/calculator">Run stage calculator</Link></Button>
          <Button variant="outline" asChild><Link to="/learn">Read the basics</Link></Button>
          <Button variant="outline" asChild><Link to="/clinics">Browse clinics</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
