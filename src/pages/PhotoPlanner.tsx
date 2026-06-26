import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Disclaimer } from "@/components/Disclaimer";
import { Camera, Trash2, Upload, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const REQUIRED_ANGLES = ["Front", "Left temple", "Right temple", "Top down", "Crown", "Donor / back"] as const;

const checklist = [
  "Take photos in daylight near a window",
  "No filters, no flash",
  "Hair must be dry and combed back",
  "Use the same angle each time",
  "Keep distance consistent (~50 cm)",
  "Remove glasses, caps, accessories",
];

type Photo = { id: string; angle: string; url: string; date: string; severity?: number; notes?: string };

export default function PhotoPlanner() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleFile = (angle: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotos((s) => [{ id: crypto.randomUUID(), angle, url, date: new Date().toISOString().slice(0, 10) }, ...s]);
  };

  const remove = (id: string) => setPhotos((s) => s.filter((p) => p.id !== id));

  return (
    <div className="container py-10 md:py-14 space-y-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Photo Planner</h1>
        <p className="text-muted-foreground mt-2">A guided visual planner — you mark thinning areas, save notes, and compare progress photos over time.</p>
      </header>

      <Disclaimer tone="safety" title="Your photos, your control">
        Photos are sensitive. In this preview, images stay in your browser memory and are not uploaded. When secure cloud storage is enabled, you'll get encrypted storage, access controls, and a one-click delete-all option.
      </Disclaimer>

      <Disclaimer tone="warning">
        This is <strong>guided visual planning</strong>, not medical AI diagnosis. A surgeon must examine you in person.
      </Disclaimer>

      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5 text-primary" /> Photo quality checklist</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              {checklist.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-success" /> Privacy notes</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Photos shown on this page are stored only in your browser tab.</p>
            <p>• When cloud storage is enabled, photos are stored in private buckets with row-level access.</p>
            <p>• You can delete any photo or your entire history at any time.</p>
            <p>• Photos are never used for AI training or sold.</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Upload by angle</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REQUIRED_ANGLES.map((angle) => {
            const photo = photos.find((p) => p.angle === angle);
            return (
              <Card key={angle}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{angle}</CardTitle>
                    {photo ? <Badge className="bg-success text-success-foreground">Uploaded</Badge> : <Badge variant="outline">Pending</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  {photo ? (
                    <div className="space-y-2">
                      <img src={photo.url} alt={`${angle} reference`} className="rounded-md border w-full h-44 object-cover" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{photo.date}</span>
                        <button onClick={() => remove(photo.id)} className="text-destructive flex items-center gap-1"><Trash2 className="h-3 w-3" />Remove</button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Click to upload</span>
                      <Input type="file" accept="image/*" className="hidden" onChange={handleFile(angle)} />
                    </label>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Progress gallery</h2>
        {photos.length === 0 ? (
          <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Upload your first set of photos above to start tracking progress.</CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((p) => (
              <div key={p.id} className="relative group rounded-md overflow-hidden border">
                <img src={p.url} alt={`${p.angle} on ${p.date}`} className="w-full h-40 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-2 flex justify-between">
                  <span>{p.angle}</span><span>{p.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Card className="bg-gradient-card border-primary/30">
        <CardHeader><CardTitle>Generate preliminary plan</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">After completing the photo set and the stage calculator, you can export a one-page plan with: likely stage, affected areas, graft estimate range, questions to ask your surgeon, clinic shortlist, budget range, and a pre-op checklist.</p>
          <Button onClick={() => window.print()}>Download / print preliminary plan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
