// Helpers for guest-mode (localStorage / IndexedDB-lite) photo + assessment state.
// Photos never leave the browser unless the user signs up.

const KEY_PHOTOS = "htc.guest.photos.v1";
const KEY_ASSESSMENT = "htc.guest.assessment.v1";
const KEY_SHORTLIST = "htc.guest.shortlist.v1";

export type GuestPhoto = {
  id: string;
  area: string;
  dataUrl: string; // base64
  severity: number; // 0-5
  notes?: string;
  createdAt: number;
};

export type GuestAssessment = {
  norwoodStage?: string;
  ludwigStage?: string;
  pattern?: string;
  affectedZones?: string[];
  graftLow?: number;
  graftHigh?: number;
  zoneSplit?: Record<string, [number, number]>;
  donorQuality?: string;
  sessions?: number;
  confidence?: number;
  riskFlags?: string[];
  notes?: string;
  isDemo?: boolean;
  updatedAt: number;
};

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
};

export const guestPhotos = {
  list(): GuestPhoto[] {
    if (typeof window === "undefined") return [];
    return safeParse<GuestPhoto[]>(localStorage.getItem(KEY_PHOTOS), []);
  },
  upsert(p: GuestPhoto) {
    const all = guestPhotos.list().filter(x => x.id !== p.id);
    all.unshift(p);
    localStorage.setItem(KEY_PHOTOS, JSON.stringify(all));
  },
  remove(id: string) {
    localStorage.setItem(KEY_PHOTOS, JSON.stringify(guestPhotos.list().filter(p => p.id !== id)));
  },
  clear() { localStorage.removeItem(KEY_PHOTOS); },
};

export const guestAssessment = {
  get(): GuestAssessment | null {
    if (typeof window === "undefined") return null;
    return safeParse<GuestAssessment | null>(localStorage.getItem(KEY_ASSESSMENT), null);
  },
  set(a: GuestAssessment) {
    localStorage.setItem(KEY_ASSESSMENT, JSON.stringify({ ...a, updatedAt: Date.now() }));
  },
  clear() { localStorage.removeItem(KEY_ASSESSMENT); },
};

export const guestShortlist = {
  list(): string[] {
    if (typeof window === "undefined") return [];
    return safeParse<string[]>(localStorage.getItem(KEY_SHORTLIST), []);
  },
  toggle(id: string) {
    const cur = guestShortlist.list();
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id].slice(0, 5);
    localStorage.setItem(KEY_SHORTLIST, JSON.stringify(next));
    return next;
  },
  clear() { localStorage.removeItem(KEY_SHORTLIST); },
};

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
