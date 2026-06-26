// Rule-based hair-stage and graft estimate logic. Educational only.

export type CalcInputs = {
  hairlineRecession: number; // 0..4
  templeLoss: number;        // 0..4
  midScalpThinning: number;  // 0..4
  crownSize: number;         // 0..4  (0=none, 4=large bald spot)
  diffuseThinning: number;   // 0..3  (esp. for women)
  donorQuality: "poor" | "average" | "good" | "excellent";
  hairCaliber: "fine" | "medium" | "coarse";
  scalpContrast: "low" | "medium" | "high";
  targetDensityPct: number;  // 30..100  (% of native density to attempt)
  ageGroup: "<25" | "25-34" | "35-44" | "45-54" | "55+";
  sex: "male" | "female" | "other";
};

export type CalcResult = {
  stage: string;            // e.g. "Norwood 3V–4"
  graftLow: number;
  graftHigh: number;
  sessions: string;         // e.g. "1 session likely"
  donorCaution: string;
  confidence: "low" | "medium" | "high";
  notes: string[];
};

// Approximate graft contribution per area at full coverage at average density.
const AREA_BASE: Record<string, number> = {
  hairline: 600,
  temples: 500,
  frontal: 1200,
  midScalp: 1500,
  crown: 2000,
};

const DONOR_FACTOR = { poor: 0.6, average: 0.85, good: 1.0, excellent: 1.1 };
const CALIBER_FACTOR = { fine: 1.15, medium: 1.0, coarse: 0.85 }; // fine hair needs more grafts
const CONTRAST_FACTOR = { low: 0.95, medium: 1.0, high: 1.05 };

export function classifyStage(i: CalcInputs): string {
  if (i.sex === "female") {
    if (i.diffuseThinning >= 3) return "Ludwig III (advanced diffuse thinning)";
    if (i.diffuseThinning === 2) return "Ludwig II (moderate diffuse thinning)";
    if (i.diffuseThinning === 1) return "Ludwig I (early diffuse thinning)";
    return "Likely no significant pattern thinning";
  }
  // Male Norwood approximation
  const front = Math.max(i.hairlineRecession, i.templeLoss);
  const crown = i.crownSize;
  const mid = i.midScalpThinning;
  if (front <= 1 && crown === 0 && mid <= 1) return "Norwood 1–2 (mild)";
  if (front === 2 && crown <= 1) return "Norwood 2–3";
  if (front >= 3 && crown === 0) return "Norwood 3 (frontal)";
  if (front >= 2 && crown >= 1 && crown <= 2) return "Norwood 3V–4";
  if (front >= 3 && crown >= 2 && mid >= 1) return "Norwood 4–5";
  if (front >= 3 && crown >= 3) return "Norwood 5–6";
  if (front >= 4 && crown >= 3 && mid >= 3) return "Norwood 6–7 (advanced)";
  return "Norwood 3–4 (estimated)";
}

export function estimate(i: CalcInputs): CalcResult {
  const notes: string[] = [];
  const stage = classifyStage(i);

  // Area-weighted base grafts
  let base = 0;
  base += (i.hairlineRecession / 4) * AREA_BASE.hairline;
  base += (i.templeLoss / 4) * AREA_BASE.temples;
  base += ((i.hairlineRecession + i.templeLoss) / 8) * AREA_BASE.frontal * 0.5;
  base += (i.midScalpThinning / 4) * AREA_BASE.midScalp;
  base += (i.crownSize / 4) * AREA_BASE.crown;
  if (i.sex === "female") {
    base += (i.diffuseThinning / 3) * 1800;
  }

  const density = Math.max(0.3, Math.min(1, i.targetDensityPct / 100));
  const caliber = CALIBER_FACTOR[i.hairCaliber];
  const contrast = CONTRAST_FACTOR[i.scalpContrast];
  const donor = DONOR_FACTOR[i.donorQuality];

  const adjusted = base * density * caliber * contrast;

  // Donor caps the high end
  const donorCap = donor * 6500; // approx safe lifetime donor
  const high = Math.min(adjusted * 1.25, donorCap);
  const low = Math.max(300, adjusted * 0.85);

  const graftLow = Math.round(low / 100) * 100;
  const graftHigh = Math.round(high / 100) * 100;

  let sessions = "1 session typically sufficient";
  if (graftHigh > 3500) sessions = "1 large session or 2 sittings";
  if (graftHigh > 5000) sessions = "Likely 2 sittings spaced 8–12 months apart";
  if (graftHigh > 6500) sessions = "May require 2–3 sittings; donor management critical";

  let donorCaution = "Donor area appears sufficient based on inputs.";
  if (i.donorQuality === "poor") donorCaution = "Limited donor — realistic coverage will be reduced; surgeon evaluation essential.";
  else if (i.donorQuality === "average" && graftHigh > 4000) donorCaution = "Donor may be tight for desired coverage — surgeon must measure density in person.";

  // Confidence heuristic
  let confidence: CalcResult["confidence"] = "medium";
  if (i.ageGroup === "<25") { confidence = "low"; notes.push("Young age — pattern may still progress; long-term planning is critical."); }
  if (i.donorQuality === "poor") confidence = "low";
  if (i.sex === "female" && i.diffuseThinning >= 2) {
    confidence = "low";
    notes.push("Female diffuse thinning often responds better to medical therapy than transplantation; consult a dermatologist first.");
  }
  if (i.crownSize >= 3 && i.donorQuality !== "excellent") {
    notes.push("Large crown coverage consumes many grafts — prioritize frontal restoration first.");
  }
  if (i.hairCaliber === "fine" && i.scalpContrast === "low") {
    notes.push("Fine hair with low scalp contrast — visual density will appear lower per graft.");
  }
  if (i.targetDensityPct > 80) notes.push("Goals above 80% native density are rarely achievable in a single session.");

  return { stage, graftLow, graftHigh, sessions, donorCaution, confidence, notes };
}
