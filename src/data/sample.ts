// Sample / seed data for HT Compass. Clearly marked as demonstration data.

export type Clinic = {
  id: string;
  name: string;
  city: string;
  country: string;
  region: "India" | "Turkey" | "Thailand" | "UAE" | "UK" | "USA" | "Europe" | "Australia";
  techniques: string[];
  pricePerGraft: { low: number; high: number; currency: string };
  doctorLed: boolean;
  yearsExperience: number;
  rating: number;
  reviews: number;
  verified: boolean;
  beforeAfter: boolean;
  languages: string[];
  consultation: "Free" | "Paid" | "Virtual";
  pros: string[];
  cons: string[];
  redFlags?: string[];
  doctors: { name: string; qualification: string; experienceYears: number }[];
  packages: { name: string; grafts: number; price: { low: number; high: number }; currency: string }[];
};

export const SAMPLE_CLINICS: Clinic[] = [
  {
    id: "c-bangalore-1",
    name: "Sample Trichology Center",
    city: "Bangalore",
    country: "India",
    region: "India",
    techniques: ["FUE", "DHI", "Sapphire FUE"],
    pricePerGraft: { low: 35, high: 70, currency: "INR" },
    doctorLed: true,
    yearsExperience: 12,
    rating: 4.6,
    reviews: 184,
    verified: true,
    beforeAfter: true,
    languages: ["English", "Hindi", "Kannada"],
    consultation: "Free",
    pros: ["Doctor performs hairline design", "Detailed donor mapping", "Transparent written quote"],
    cons: ["Waiting list 3–4 weeks", "No same-day procedures"],
    doctors: [{ name: "Dr. A. Sample", qualification: "MBBS, MD Dermatology", experienceYears: 12 }],
    packages: [
      { name: "Frontal restoration", grafts: 2200, price: { low: 90000, high: 140000 }, currency: "INR" },
      { name: "Frontal + Mid", grafts: 3200, price: { low: 130000, high: 200000 }, currency: "INR" },
    ],
  },
  {
    id: "c-istanbul-1",
    name: "Sample Istanbul Hair Clinic",
    city: "Istanbul",
    country: "Turkey",
    region: "Turkey",
    techniques: ["FUE", "DHI", "Sapphire FUE"],
    pricePerGraft: { low: 1.2, high: 3, currency: "USD" },
    doctorLed: false,
    yearsExperience: 8,
    rating: 4.3,
    reviews: 920,
    verified: false,
    beforeAfter: true,
    languages: ["English", "Turkish", "Arabic"],
    consultation: "Free",
    pros: ["All-inclusive package with hotel & transfer", "High volume experience"],
    cons: ["Technician-led extraction common", "Limited long-term follow-up"],
    redFlags: ["Verify which steps the surgeon personally performs"],
    doctors: [{ name: "Dr. B. Sample", qualification: "MD", experienceYears: 8 }],
    packages: [
      { name: "Mega session up to 4000", grafts: 4000, price: { low: 1800, high: 3200 }, currency: "USD" },
    ],
  },
  {
    id: "c-mumbai-1",
    name: "Sample Mumbai Restore",
    city: "Mumbai",
    country: "India",
    region: "India",
    techniques: ["FUE", "FUT", "PRP", "GFC"],
    pricePerGraft: { low: 45, high: 90, currency: "INR" },
    doctorLed: true,
    yearsExperience: 18,
    rating: 4.7,
    reviews: 312,
    verified: true,
    beforeAfter: true,
    languages: ["English", "Hindi", "Marathi"],
    consultation: "Paid",
    pros: ["Surgeon-led entire procedure", "Mature long-term results"],
    cons: ["Higher per-graft cost"],
    doctors: [{ name: "Dr. C. Sample", qualification: "MBBS, MS, MCh", experienceYears: 18 }],
    packages: [
      { name: "Crown coverage", grafts: 1800, price: { low: 110000, high: 160000 }, currency: "INR" },
    ],
  },
  {
    id: "c-dubai-1",
    name: "Sample Dubai Hair Studio",
    city: "Dubai",
    country: "UAE",
    region: "UAE",
    techniques: ["FUE", "DHI"],
    pricePerGraft: { low: 6, high: 12, currency: "USD" },
    doctorLed: true,
    yearsExperience: 10,
    rating: 4.5,
    reviews: 145,
    verified: true,
    beforeAfter: true,
    languages: ["English", "Arabic"],
    consultation: "Virtual",
    pros: ["Premium aftercare", "Multilingual support"],
    cons: ["Higher overall cost"],
    doctors: [{ name: "Dr. D. Sample", qualification: "MD Dermatology", experienceYears: 10 }],
    packages: [
      { name: "Frontal + temples", grafts: 2500, price: { low: 15000, high: 28000 }, currency: "USD" },
    ],
  },
  {
    id: "c-bangkok-1",
    name: "Sample Bangkok Trichology",
    city: "Bangkok",
    country: "Thailand",
    region: "Thailand",
    techniques: ["FUE", "DHI", "Long Hair FUE"],
    pricePerGraft: { low: 2, high: 4.5, currency: "USD" },
    doctorLed: true,
    yearsExperience: 9,
    rating: 4.4,
    reviews: 88,
    verified: false,
    beforeAfter: true,
    languages: ["English", "Thai"],
    consultation: "Free",
    pros: ["Long-hair FUE preview", "Tourism-friendly recovery"],
    cons: ["Limited published outcome data"],
    doctors: [{ name: "Dr. E. Sample", qualification: "MD", experienceYears: 9 }],
    packages: [
      { name: "Standard FUE 2500", grafts: 2500, price: { low: 5500, high: 9500 }, currency: "USD" },
    ],
  },
  {
    id: "c-london-1",
    name: "Sample London Restore",
    city: "London",
    country: "UK",
    region: "UK",
    techniques: ["FUE", "Sapphire FUE", "DHI"],
    pricePerGraft: { low: 4, high: 8, currency: "GBP" },
    doctorLed: true,
    yearsExperience: 15,
    rating: 4.5,
    reviews: 210,
    verified: true,
    beforeAfter: true,
    languages: ["English"],
    consultation: "Paid",
    pros: ["Strict surgeon involvement", "Detailed consent process"],
    cons: ["Premium pricing"],
    doctors: [{ name: "Dr. F. Sample", qualification: "MBBS, MRCS", experienceYears: 15 }],
    packages: [
      { name: "Hairline restoration", grafts: 2000, price: { low: 8000, high: 14000 }, currency: "GBP" },
    ],
  },
];

export const COUNTRY_PRICE_PER_GRAFT: Record<string, { low: number; high: number; currency: string }> = {
  India: { low: 30, high: 100, currency: "INR" },
  Turkey: { low: 1, high: 3, currency: "USD" },
  Thailand: { low: 2, high: 5, currency: "USD" },
  UAE: { low: 5, high: 12, currency: "USD" },
  UK: { low: 3, high: 8, currency: "GBP" },
  USA: { low: 5, high: 12, currency: "USD" },
  Europe: { low: 2, high: 6, currency: "EUR" },
  Australia: { low: 5, high: 10, currency: "AUD" },
};

export const FAQS = [
  {
    q: "Is HT Compass a substitute for a dermatologist or surgeon?",
    a: "No. HT Compass provides general education and rule-based planning support only. A qualified dermatologist or hair-transplant surgeon must perform the actual diagnosis and treatment.",
  },
  {
    q: "How accurate is the graft estimate?",
    a: "It is a rough range based on the inputs you provide and published averages. Actual graft count depends on in-person donor evaluation, density measurement, and surgeon judgment.",
  },
  {
    q: "Are the clinic listings reviewed?",
    a: "All current clinic listings are sample data shown for demonstration. Verified listings will be added with proof of credentials.",
  },
  {
    q: "How are my photos handled?",
    a: "When photo storage is enabled, photos will be stored securely with access controls and deletion tools. You always control your own data.",
  },
  {
    q: "Can I take medication based on the suggestions here?",
    a: "No. Prescription medicines like finasteride, dutasteride or post-op antibiotics must only be taken under a qualified doctor's prescription and supervision.",
  },
];

export const EVOLUTION_TIMELINE = [
  { year: "1950s–80s", title: "Plugs & strip grafts", body: "Large grafts gave unnatural 'doll-hair' appearance." },
  { year: "1990s", title: "FUT / strip method", body: "Strip of donor scalp removed; leaves linear scar but allows large sessions." },
  { year: "2000s", title: "FUE (Follicular Unit Extraction)", body: "Individual follicles extracted by punch — no linear scar." },
  { year: "2010s", title: "DHI with implanters", body: "Choi-style implanters allow direct placement without pre-made incisions." },
  { year: "Late 2010s", title: "Sapphire FUE", body: "Sapphire blades create finer slits, denser placement, faster healing." },
  { year: "2020s", title: "Robotic / AI-assisted planning", body: "Image-guided extraction and digital hairline planning aid surgeon precision." },
  { year: "Adjuncts", title: "PRP, GFC, exosomes", body: "Used to support graft survival and existing hair — evidence varies." },
];
