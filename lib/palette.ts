/**
 * Turunan palet harmonis dari satu "Warna Brand".
 *
 * Alih-alih token warna di-hardcode, kita hitung kombinasi yang serasi:
 *  - Base halaman (terang/gelap) dipilih dari luminansitas warna brand agar
 *    kontras nyaman & warna brand tetap "pop".
 *  - --brand-ink / --brand-soft / --on-brand / --brand-tint-bg derivasi dari
 *    brand supaya seluruh section terasa satu kesatuan, bukan clash.
 *
 * Fungsi ini murni (tanpa dependency) sehingga bisa dipakai baik di server
 * (pipeline/shell) maupun di browser (preview UI).
 */

function parseHex(input: string): { r: number; g: number; b: number } | null {
  let h = (input || "").trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** Relative luminance (WCAG) dalam rentang 0..1. */
function relLuminance(r: number, g: number, b: number): number {
  const f = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export interface PaletteInfo {
  /** Warna teks yang diletakkan DI ATAS background brand (tombol CTA). */
  onBrand: string;
  /** true bila base halaman adalah terang. */
  lightPage: boolean;
}

export function paletteInfo(brand: string): PaletteInfo {
  const rgb = parseHex(brand);
  const hex = rgb ? brand.trim() : "#2563eb";
  const safe = parseHex(hex)!;
  const L = relLuminance(safe.r, safe.g, safe.b);
  return {
    onBrand: L > 0.55 ? "#0b0f1a" : "#ffffff",
    lightPage: L < 0.45,
  };
}

/**
 * Hasilkan blok CSS `:root{...}` berisi seluruh token terderivasi.
 * Dipakai di dalam <style> shell (mode Modular) maupun diinjeksi ke prompt
 * Developer (mode single-shot) agar AI menggunakan variabel yang sama.
 */
export function paletteToCssVars(brand: string): string {
  const rgb = parseHex(brand);
  const hex = rgb ? brand.trim() : "#2563eb";
  const safe = parseHex(hex)!;
  const L = relLuminance(safe.r, safe.g, safe.b);
  const onBrand = L > 0.55 ? "#0b0f1a" : "#ffffff";
  const light = L < 0.45;

  const base = light
    ? {
        bg: "#f6f8fb",
        bg2: "#eef2f7",
        surface: "#ffffff",
        surface2: "#eef2f7",
        border: "rgba(15,23,42,0.10)",
        text: "#0f172a",
        textStrong: "#0b0f1a",
        textMuted: "#475569",
        textFaint: "#94a3b8",
        shadow: "0 12px 32px rgba(15,23,42,0.10)",
        tintBg: `color-mix(in srgb, #ffffff 86%, ${hex})`,
        tintSurface: "#ffffff",
      }
    : {
        bg: "#0b0f1a",
        bg2: "#0f1525",
        surface: "rgba(255,255,255,0.04)",
        surface2: "rgba(255,255,255,0.07)",
        border: "rgba(255,255,255,0.10)",
        text: "#e2e8f0",
        textStrong: "#ffffff",
        textMuted: "#94a3b8",
        textFaint: "#64748b",
        shadow: "0 20px 50px rgba(0,0,0,0.45)",
        tintBg: `color-mix(in srgb, #0b0f1a 80%, ${hex})`,
        tintSurface: "rgba(255,255,255,0.05)",
      };

  return `:root{
  --brand:${hex};
  --brand-ink:color-mix(in srgb, ${hex}, #000 18%);
  --brand-soft:color-mix(in srgb, ${hex}, #fff 86%);
  --on-brand:${onBrand};
  --brand-tint-bg:${base.tintBg};
  --brand-tint-surface:${base.tintSurface};
  --bg:${base.bg}; --bg-2:${base.bg2};
  --surface:${base.surface}; --surface-2:${base.surface2};
  --border:${base.border};
  --text:${base.text}; --text-strong:${base.textStrong}; --text-muted:${base.textMuted}; --text-faint:${base.textFaint};
  --shadow:${base.shadow};
  --radius:18px; --container:1120px;
}`;
}

/** Preview sederhana (warna konkret, bukan color-mix) untuk UI. */
export function palettePreview(brand: string): {
  bg: string;
  surface: string;
  text: string;
  brand: string;
  onBrand: string;
} {
  const info = paletteInfo(brand);
  const rgb = parseHex(brand);
  const hex = rgb ? brand.trim() : "#2563eb";
  return {
    bg: info.lightPage ? "#f6f8fb" : "#0b0f1a",
    surface: info.lightPage ? "#ffffff" : "rgba(255,255,255,0.04)",
    text: info.lightPage ? "#0f172a" : "#e2e8f0",
    brand: hex,
    onBrand: info.onBrand,
  };
}
