import { Disclaimer } from "@/components/Disclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { PRE_OP_CHECKLIST } from "@/data/options";
import { ListChecks } from "lucide-react";

const STORAGE_KEY = "ht_preop_checked";

export default function PreOp() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")); } catch {}
  }, []);

  const toggle = (k: string) => {
    setChecked((s) => {
      const next = { ...s, [k]: !s[k] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="container py-10 max-w-4xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-2">
          <ListChecks className="h-7 w-7 text-primary" />
          Pre-Op Guide
        </h1>
        <p className="text-muted-foreground mt-2">
          Day-wise checklist for preparing safely. Tick items off as you go — progress is saved on this device.
        </p>
      </header>

      <Disclaimer tone="warning" className="mb-6">
        Follow your surgeon's specific instructions over any general guidance here. Never start or stop
        medication without doctor approval.
      </Disclaimer>

      <div className="space-y-4">
        {PRE_OP_CHECKLIST.map((block) => (
          <Card key={block.when}>
            <CardHeader><CardTitle className="text-lg">{block.when}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {block.items.map((item) => {
                const k = `${block.when}::${item}`;
                return (
                  <label key={k} className="flex items-start gap-3 p-2 rounded hover:bg-muted cursor-pointer">
                    <Checkbox checked={!!checked[k]} onCheckedChange={() => toggle(k)} />
                    <span className={`text-sm ${checked[k] ? "line-through text-muted-foreground" : ""}`}>{item}</span>
                  </label>
                );
              })}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader><CardTitle>Questions to ask your surgeon</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• Who personally performs incisions and graft extraction?</p>
            <p>• How many grafts are planned, and how is density measured?</p>
            <p>• What is the donor capacity assessment?</p>
            <p>• What is included in the package and what is extra?</p>
            <p>• What is the post-op support window and emergency contact?</p>
            <p>• What is the refund / revision policy?</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
