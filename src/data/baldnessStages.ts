// Norwood / Ludwig baldness stage library — illustrative reference data.
// NOT a diagnosis. Suitability ranges are typical, real plans vary.

export type StageInfo = {
  key: string;
  scale: "Norwood" | "Ludwig" | "Pattern";
  label: string;
  shortLabel: string;
  description: string;
  graftRange: [number, number];
  htSuitability: "Excellent" | "Good" | "Moderate" | "Limited" | "Medication-first";
  medicationFirst: boolean;
  typicalPlan: string;
  expectations: string;
};

export const BALDNESS_STAGES: StageInfo[] = [
  { key: "n1", scale: "Norwood", label: "Norwood 1", shortLabel: "N1", description: "No visible recession. Juvenile hairline intact.", graftRange: [0, 0], htSuitability: "Medication-first", medicationFirst: true, typicalPlan: "Monitor only. Consider minoxidil if early thinning concerns.", expectations: "No transplant typically warranted." },
  { key: "n2", scale: "Norwood", label: "Norwood 2", shortLabel: "N2", description: "Mild temple recession forming an adult hairline.", graftRange: [800, 1500], htSuitability: "Good", medicationFirst: true, typicalPlan: "Often medication + small temple/hairline refinement if cosmetically desired.", expectations: "Subtle hairline restoration; preserve native hair." },
  { key: "n3", scale: "Norwood", label: "Norwood 3", shortLabel: "N3", description: "Deeper temple recession; an 'M' shape becomes visible.", graftRange: [1500, 2500], htSuitability: "Good", medicationFirst: false, typicalPlan: "FUE/DHI on hairline + temples. Finasteride to protect native hair.", expectations: "Strong frontal restoration in one session." },
  { key: "n3v", scale: "Norwood", label: "Norwood 3 Vertex", shortLabel: "N3V", description: "Norwood 3 plus early thinning at the crown/vertex.", graftRange: [2200, 3500], htSuitability: "Good", medicationFirst: false, typicalPlan: "Hairline + crown spot. Often combined with PRP/medication.", expectations: "Good coverage; crown density slightly lower than frontal." },
  { key: "n4", scale: "Norwood", label: "Norwood 4", shortLabel: "N4", description: "Frontal recession + clear crown thinning with a bridge of hair between.", graftRange: [3000, 4500], htSuitability: "Good", medicationFirst: false, typicalPlan: "Single mega-session or two stages. Donor management critical.", expectations: "Visible density restoration; lifelong maintenance recommended." },
  { key: "n5", scale: "Norwood", label: "Norwood 5", shortLabel: "N5", description: "Bridge between front and crown is narrower and thinner.", graftRange: [4000, 5500], htSuitability: "Moderate", medicationFirst: false, typicalPlan: "Often two sessions. Hairline + mid-scalp prioritised; crown may need stage 2.", expectations: "Realistic but lower density than younger stages." },
  { key: "n6", scale: "Norwood", label: "Norwood 6", shortLabel: "N6", description: "Bridge is gone; large bald area front-to-crown.", graftRange: [5000, 7000], htSuitability: "Limited", medicationFirst: false, typicalPlan: "Two sessions usually. Beard/body hair may supplement donor.", expectations: "Coverage rather than full density; managed expectations." },
  { key: "n7", scale: "Norwood", label: "Norwood 7", shortLabel: "N7", description: "Horseshoe pattern with limited donor.", graftRange: [6000, 8000], htSuitability: "Limited", medicationFirst: false, typicalPlan: "Body/beard hair often required. Cosmetic illusion of density.", expectations: "Donor scarcity is the main limit; honest expectations vital." },
  { key: "diffuse", scale: "Pattern", label: "Diffuse thinning", shortLabel: "DUPA?", description: "Generalised thinning including donor region.", graftRange: [0, 0], htSuitability: "Medication-first", medicationFirst: true, typicalPlan: "Rule out DUPA. Medical therapy first; HT only if donor is stable.", expectations: "Transplant may be unsuitable if donor is affected." },
  { key: "crown", scale: "Pattern", label: "Crown-only thinning", shortLabel: "Crown", description: "Isolated vertex/crown thinning.", graftRange: [1500, 3000], htSuitability: "Moderate", medicationFirst: true, typicalPlan: "Medication first to stabilise; HT to crown if budget/donor allow.", expectations: "Crown is a 'density sink' — needs more grafts per visible result." },
  { key: "l1", scale: "Ludwig", label: "Ludwig I", shortLabel: "L1", description: "Mild diffuse thinning along the central parting in women.", graftRange: [800, 2000], htSuitability: "Good", medicationFirst: true, typicalPlan: "Minoxidil + PRP first line. HT possible for parting density.", expectations: "Women retain frontal hairline; goal is density, not coverage." },
  { key: "l2", scale: "Ludwig", label: "Ludwig II", shortLabel: "L2", description: "Pronounced central thinning, scalp visible through hair.", graftRange: [1800, 3500], htSuitability: "Moderate", medicationFirst: true, typicalPlan: "Combination therapy; HT for parting and mid-scalp.", expectations: "Improvement is real but typically gradual." },
  { key: "l3", scale: "Ludwig", label: "Ludwig III", shortLabel: "L3", description: "Severe diffuse thinning with very sparse coverage.", graftRange: [2500, 5000], htSuitability: "Limited", medicationFirst: true, typicalPlan: "Often medication only. HT considered cautiously with stable donor.", expectations: "Donor stability is the deciding factor." },
];
