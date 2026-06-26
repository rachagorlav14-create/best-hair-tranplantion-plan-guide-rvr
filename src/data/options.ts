// Reference lists for selectors. Keep flat and easy to extend.

export const COUNTRIES = [
  "India", "Turkey", "Thailand", "UAE", "UK", "USA", "Australia", "Germany",
  "Spain", "Mexico", "Singapore", "Other",
];

export const INDIA_CITIES = [
  "Hyderabad", "Bangalore", "Chennai", "Mumbai", "Pune", "New Delhi",
  "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh", "Kochi", "Coimbatore",
  "Vijayawada", "Visakhapatnam", "Guntur", "Lucknow", "Indore", "Bhopal",
  "Nagpur", "Surat", "Goa",
];

export const CONCERN_AREAS = [
  "Hairline", "Temples", "Crown", "Mid-scalp", "Diffuse thinning", "Full baldness",
];

export const CURRENT_MEDICATIONS = [
  "Minoxidil", "Finasteride", "Dutasteride", "PRP", "GFC", "Supplements", "None",
];

export const TECHNIQUES = [
  "FUE", "FUT", "DHI", "Sapphire FUE", "BHT (Beard/Body)", "PRP", "GFC",
];

export const BUDGET_RANGES = [
  "Under ₹50,000", "₹50,000 – ₹1L", "₹1L – ₹2L", "₹2L – ₹4L",
  "₹4L – ₹8L", "Above ₹8L", "Flexible",
];

export const TIMELINES = [
  "Within 1 month", "1–3 months", "3–6 months", "6–12 months", "Just exploring",
];

export const PHOTO_AREAS = [
  { key: "front_hairline", label: "Front hairline" },
  { key: "left_temple", label: "Left temple" },
  { key: "right_temple", label: "Right temple" },
  { key: "top", label: "Top / mid-scalp" },
  { key: "crown", label: "Crown" },
  { key: "donor", label: "Donor / back side" },
  { key: "beard", label: "Beard donor (optional)" },
] as const;

export const PHOTO_INSTRUCTIONS = [
  "Use natural daylight; no harsh lamps",
  "No filters, no flash beautification",
  "Dry, clean hair (no gel/oil)",
  "Comb hair back to expose hairline",
  "Same angle and distance every time",
  "Hold phone steady, close-up but in focus",
];

export const COMMON_MEDS = [
  "Minoxidil 5%", "Finasteride 1mg", "Dutasteride 0.5mg",
  "Antibiotic (post-op)", "Painkiller (post-op)", "Anti-swelling (post-op)",
  "Ketoconazole shampoo", "Biotin supplement", "PRP/GFC session",
];

export const PRE_OP_CHECKLIST = [
  { when: "30 days before", items: ["Discuss medication adjustments with doctor", "Start scalp-friendly shampoo if advised", "Plan time off work and travel"] },
  { when: "15 days before", items: ["Avoid new supplements without doctor approval", "Reduce alcohol intake", "Sleep at least 7 hours nightly"] },
  { when: "7 days before", items: ["Stop minoxidil if surgeon advises", "Get blood tests / ECG if requested", "Confirm clinic appointment and payment plan"] },
  { when: "3 days before", items: ["No alcohol", "No blood thinners unless prescribed", "Hydrate well, eat balanced meals"] },
  { when: "1 day before", items: ["Wash hair gently", "Pack loose button-up shirt", "Light dinner, full night's sleep"] },
  { when: "Surgery day", items: ["Light breakfast (unless told otherwise)", "Arrive 30 min early", "Carry ID, payment, prescription list"] },
];

export const POSTOP_TIMELINE = [
  { period: "Day 0", body: "Surgery completed; grafts placed. Mild bleeding/oozing normal." },
  { period: "Day 1", body: "First post-op review at clinic. Crusting begins. Sleep semi-upright." },
  { period: "Day 2–3", body: "Swelling may move down to forehead. Continue prescribed medicines." },
  { period: "Day 4–7", body: "Daily gentle washes begin. Scabs start loosening." },
  { period: "Day 8–14", body: "Most scabs come off. Recipient area looks pink/red." },
  { period: "Week 3–8", body: "Shock-loss / shedding phase. Transplanted hair falls — this is normal." },
  { period: "Month 3", body: "Early regrowth begins. Hairs may look thin and wiry." },
  { period: "Month 4–6", body: "Visible regrowth and thickening." },
  { period: "Month 6–9", body: "Density steadily improves." },
  { period: "Month 9–12", body: "Most of the final result becomes visible." },
  { period: "Month 12–18", body: "Crown matures last; final density assessment." },
];

export const CLINIC_SELECTION_CHECKLIST = [
  "Surgeon personally designs the hairline",
  "Donor area is evaluated with density measurement",
  "You receive a clear written graft estimate",
  "No over-harvesting promises (e.g. \"unlimited grafts\")",
  "Realistic density expectations (40–60 FU/cm²)",
  "Hygiene and operating-theatre setup look clean",
  "Genuine before/after photos with timeline",
  "Transparent pricing — no surprise add-ons",
  "Defined post-op support window",
  "Negative reviews do not show a repeating pattern",
  "Emergency contact is available",
  "Written invoice is issued",
  "Clear refund and cancellation policy",
];
