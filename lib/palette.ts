/**
 * Turunan palet profesional berbasis "color roles" dari SATU Warna Brand.
 *
 * Filosofi (sesuai brief desain):
 *  - Warna Brand dipakai HANYA sebagai Primary (aksen): CTA, link, elemen
 *    aktif, highlight. Hue-nya dipertahankan; variasi dihasilkan murni dari
 *    perubahan Lightness & Chroma (skala Primary 50–900).
 *  - Netral (achromatic) MENJADI WARNA DOMINAN halaman (~80%): background,
 *    surface, border, teks. Brand tidak pernah jadi background utama.
 *  - Warna semantik (success/warning/error/info) konvensional & TIDAK
 *    mengikuti warna brand, agar makna tetap instan dikenali.
 *  - Seluruh token dihitung deterministik (OKLCH) sehingga konsisten antar
 *    generate & menjamin kontras, BUKAN diserahkan ke tebakan AI bebas.
 *
 * AI (Strategist) hanya memilih HUE/Primary bila user tak memberi warna —
 * sisanya selalu dihitung di sini.
 *
 * Murni (tanpa dependency) → bisa dipakai di server (pipeline/shell) maupun
 * browser (preview UI). Mendukung light + dark via prefers-color-scheme.
 */

type RGB = { r: number; g: number; b: number };

function parseHex(input: string): RGB | null {
  let h = (input || "").trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));

function srgbToLinear(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** RGB (sRGB) → OKLCH. */
function rgbToOklch({ r, g, b }: RGB): { L: number; C: number; H: number } {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { L, C: Math.sqrt(A * A + B * B), H: Math.atan2(B, A) };
}

/** OKLCH → RGB (dengan gamut clamp). */
function oklchToRgb(L: number, C: number, H: number): RGB {
  const A = C * Math.cos(H), B = C * Math.sin(H);
  const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
  const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
  const s_ = L - 0.0894841775 * A - 1.291485548 * B;
  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return {
    r: Math.round(clamp(linearToSrgb(r)) * 255),
    g: Math.round(clamp(linearToSrgb(g)) * 255),
    b: Math.round(clamp(linearToSrgb(b)) * 255),
  };
}

function toHex({ r, g, b }: RGB): string {
  return "#" + [r, g, b].map((x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0")).join("");
}

/** Hex dari OKLCH (L,C dalam 0..1, H dalam radian). */
export function oklchHex(L: number, C: number, H: number): string {
  return toHex(oklchToRgb(clamp(L, 0, 1), clamp(C, 0, 0.4), H));
}

/** Relative luminance (WCAG) 0..1. */
export function relLuminance(r: number, g: number, b: number): number {
  const f = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

// ── Skala Primary: hue tetap (brand), hanya L & C yang bervariasi ──────────
const PRIMARY_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
// Offset Lightness dari brand (step 600 = warna brand persis).
const L_OFFSET: Record<number, number> = {
  50: 0.4, 100: 0.34, 200: 0.27, 300: 0.19, 400: 0.11, 500: 0.05,
  600: 0, 700: -0.06, 800: -0.12, 900: -0.18,
};
// Faktor Chroma relatif terhadap chroma brand (puncak di sekitar brand).
const C_FACTOR: Record<number, number> = {
  50: 0.28, 100: 0.45, 200: 0.62, 300: 0.8, 400: 0.92, 500: 0.99,
  600: 1, 700: 0.92, 800: 0.78, 900: 0.6,
};

// ── Skala Neutral: achromatic (C=0) ───────────────────────────────────────
const NEUTRAL_L: Record<number, number> = {
  50: 0.985, 100: 0.965, 200: 0.93, 300: 0.885, 400: 0.83, 500: 0.745,
  600: 0.64, 700: 0.525, 800: 0.42, 900: 0.3, 950: 0.21,
};

export interface Palette {
  primary: Record<number, string>;
  neutral: Record<number, string>;
  background: string;
  surface: string;
  surfaceVariant: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  link: string;
  focusRing: string;
  onPrimary: string;
  brand: string;
  brandInk: string;
  brandSoft: string;
  onBrand: string;
  brandTintBg: string;
  brandTintSurface: string;
  shadow: string;
  success: string; onSuccess: string; successSoft: string; onSuccessSoft: string;
  warning: string; onWarning: string; warningSoft: string; onWarningSoft: string;
  error: string; onError: string; errorSoft: string; onErrorSoft: string;
  info: string; onInfo: string; infoSoft: string; onInfoSoft: string;
}

/**
 * Hitung seluruh token palet dari satu warna brand (hex). Deterministik &
 * mendukung light + dark (dark di-override via @media di paletteToCssVars).
 */
export function computePalette(brandInput: string): Palette {
  const rgb = parseHex(brandInput) ?? parseHex("#2563eb")!;
  const { L: Lb, C: Cb, H: Hb } = rgbToOklch(rgb);

  const primary: Record<number, string> = {};
  for (const step of PRIMARY_STEPS) {
    const L = clamp(Lb + L_OFFSET[step], 0.04, 0.985);
    const C = clamp(Cb * C_FACTOR[step], 0, 0.37);
    primary[step] = oklchHex(L, C, Hb);
  }

  const neutral: Record<number, string> = {};
  for (const key of Object.keys(NEUTRAL_L)) {
    const n = Number(key);
    neutral[n] = oklchHex(NEUTRAL_L[n], 0, 0);
  }

  // on-primary: teks di atas warna brand (kontras WCAG).
  const onPrimary = Lb > 0.55 ? "#0b1220" : "#ffffff";

  const background = neutral[50];
  const surface = "#ffffff";
  const surfaceVariant = neutral[100];
  const border = neutral[200];
  const textPrimary = neutral[900];
  const textSecondary = neutral[700];
  const textMuted = neutral[500];

  const success = oklchHex(0.55, 0.15, 0.42); const onSuccess = "#ffffff";
  const successSoft = oklchHex(0.95, 0.05, 0.42); const onSuccessSoft = oklchHex(0.35, 0.12, 0.42);
  const warning = oklchHex(0.78, 0.15, 0.1); const onWarning = "#231600";
  const warningSoft = oklchHex(0.96, 0.06, 0.1); const onWarningSoft = oklchHex(0.45, 0.13, 0.1);
  const error = oklchHex(0.58, 0.21, 0.03); const onError = "#ffffff";
  const errorSoft = oklchHex(0.95, 0.05, 0.03); const onErrorSoft = oklchHex(0.4, 0.14, 0.03);
  const info = oklchHex(0.58, 0.13, 0.62); const onInfo = "#ffffff";
  const infoSoft = oklchHex(0.96, 0.05, 0.62); const onInfoSoft = oklchHex(0.42, 0.12, 0.62);

  return {
    primary, neutral,
    background, surface, surfaceVariant, border,
    textPrimary, textSecondary, textMuted,
    link: primary[600], focusRing: primary[500], onPrimary,
    brand: primary[600], brandInk: primary[700], brandSoft: primary[100], onBrand: onPrimary,
    brandTintBg: `color-mix(in oklch, ${background} 92%, ${primary[500]} 8%)`,
    brandTintSurface: `color-mix(in oklch, ${surface} 90%, ${primary[500]} 10%)`,
    shadow: "0 16px 40px rgba(15,23,42,0.10)",
    success, onSuccess, successSoft, onSuccessSoft,
    warning, onWarning, warningSoft, onWarningSoft,
    error, onError, errorSoft, onErrorSoft,
    info, onInfo, infoSoft, onInfoSoft,
  };
}

/**
 * Hasilkan blok CSS `:root{...}` + override `@media (prefers-color-scheme:
 * dark)` berisi seluruh token terderivasi. Dipakai di <style> shell (mode
 * Modular) maupun diinjeksi ke prompt Developer (mode single-shot).
 */
export function paletteToCssVars(brand: string): string {
  const p = computePalette(brand);
  const primaryVars = PRIMARY_STEPS.map((s) => `--primary-${s}:${p.primary[s]}`).join(";");
  const neutralVars = Object.keys(NEUTRAL_L)
    .map((k) => `--neutral-${k}:${p.neutral[Number(k)]}`)
    .join(";");

  const light = `:root{
  ${primaryVars};
  ${neutralVars};
  --background:${p.background};
  --surface:${p.surface};
  --surface-variant:${p.surfaceVariant};
  --border:${p.border};
  --text-primary:${p.textPrimary};
  --text-secondary:${p.textSecondary};
  --text-muted:${p.textMuted};
  --link:${p.link};
  --focus-ring:${p.focusRing};
  --on-primary:${p.onPrimary};
  --brand:${p.brand};
  --brand-ink:${p.brandInk};
  --brand-soft:${p.brandSoft};
  --on-brand:${p.onBrand};
  --bg:${p.background};
  --surface-2:${p.surfaceVariant};
  --text:${p.textPrimary};
  --muted:${p.textMuted};
  --brand-tint-bg:${p.brandTintBg};
  --brand-tint-surface:${p.brandTintSurface};
  --success:${p.success};--on-success:${p.onSuccess};--success-soft:${p.successSoft};--on-success-soft:${p.onSuccessSoft};
  --warning:${p.warning};--on-warning:${p.onWarning};--warning-soft:${p.warningSoft};--on-warning-soft:${p.onWarningSoft};
  --error:${p.error};--on-error:${p.onError};--error-soft:${p.errorSoft};--on-error-soft:${p.onErrorSoft};
  --info:${p.info};--on-info:${p.onInfo};--info-soft:${p.infoSoft};--on-info-soft:${p.onInfoSoft};
  --shadow:${p.shadow};
  --radius:18px;
  --container:1120px;
}`;

  const dark = `@media (prefers-color-scheme: dark){
  :root{
    --background:${p.neutral[950]};
    --surface:${p.neutral[900]};
    --surface-variant:${p.neutral[800]};
    --border:${p.neutral[800]};
    --text-primary:${p.neutral[50]};
    --text-secondary:${p.neutral[200]};
    --text-muted:${p.neutral[400]};
    --link:${p.primary[400]};
    --focus-ring:${p.primary[400]};
    --bg:${p.neutral[950]};
    --surface-2:${p.neutral[800]};
    --text:${p.neutral[50]};
    --muted:${p.neutral[400]};
    --brand-tint-bg:color-mix(in oklch, ${p.neutral[950]} 88%, ${p.primary[400]} 12%);
    --brand-tint-surface:color-mix(in oklch, ${p.neutral[900]} 86%, ${p.primary[400]} 14%);
    --success-soft:${oklchHex(0.2, 0.08, 0.42)};--on-success-soft:${oklchHex(0.85, 0.1, 0.42)};
    --warning-soft:${oklchHex(0.2, 0.08, 0.1)};--on-warning-soft:${oklchHex(0.85, 0.1, 0.1)};
    --error-soft:${oklchHex(0.2, 0.1, 0.03)};--on-error-soft:${oklchHex(0.85, 0.12, 0.03)};
    --info-soft:${oklchHex(0.2, 0.08, 0.62)};--on-info-soft:${oklchHex(0.85, 0.1, 0.62)};
    --shadow:0 18px 50px rgba(0,0,0,0.55);
  }
}`;

  return light + dark;
}

export interface PaletteInfo {
  onBrand: string;
  lightPage: boolean;
}
export function paletteInfo(brand: string): PaletteInfo {
  const rgb = parseHex(brand) ?? parseHex("#2563eb")!;
  const { L } = rgbToOklch(rgb);
  return { onBrand: L > 0.55 ? "#0b1220" : "#ffffff", lightPage: L < 0.5 };
}

/** Preview sederhana (warna konkret) untuk UI swatch di samping input brand. */
export function palettePreview(brand: string): {
  bg: string;
  surface: string;
  text: string;
  brand: string;
  onBrand: string;
} {
  const p = computePalette(brand);
  return {
    bg: p.background,
    surface: p.surface,
    text: p.textPrimary,
    brand: p.brand,
    onBrand: p.onPrimary,
  };
}
