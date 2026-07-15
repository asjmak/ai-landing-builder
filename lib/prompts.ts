import type { ModuleDef } from "./types";

/**
 * Katalog module tunggal yang dipakai bersama oleh Strategist,
 * Copywriter, dan Developer agar ID konsisten. Core = wajib,
 * Booster = bisa di-On/Off sesuai strategi & traffic.
 */
export const MODULE_CATALOG: ModuleDef[] = [
  { id: "hero", name: "Hero Section", category: "core" },
  { id: "leadForm", name: "Formulir Lead", category: "core" },
  { id: "trustBadges", name: "Trust Badges", category: "core" },
  { id: "benefits", name: "Benefit Bullets", category: "core" },
  { id: "socialProof", name: "Testimoni & Social Proof", category: "core" },
  { id: "faq", name: "FAQ Accordion", category: "core" },
  { id: "finalCta", name: "Final CTA + Penutup", category: "core" },
  { id: "footer", name: "Footer & Privacy", category: "core" },
  { id: "stickyBar", name: "Sticky Bar CTA", category: "booster" },
  { id: "countdownTimer", name: "Countdown Timer", category: "booster" },
  { id: "exitIntentPopup", name: "Exit-Intent Popup", category: "booster" },
  { id: "floatingCta", name: "Floating Mobile CTA", category: "booster" },
  { id: "liveActivity", name: "Live Activity Notification", category: "booster" },
];

export const STRATEGIST_SYSTEM = `Anda adalah Senior Conversion Rate Optimization (CRO) Expert dan Direct Response Strategist.
Tugas Anda: analisis brief kampanye, lalu rancang strategi landing page "single-page funnel" untuk Lead Generation.

OUTPUT WAJIB berupa JSON murni (TIDAK ADA teks di luar kurung kurawal JSON), dengan skema persis:
{
  "positioningAngle": string,   // sudut pandang / angle utama (Bahasa Indonesia)
  "primaryMessage": string,     // pesan inti yang menjual HASIL, bukan fitur
  "toneOfVoice": string,        // misal: "Conversational namun otoritatif"
  "trafficNote": string,       // saran penyesuaian berdasar sumber traffic (organik vs berbayar)
  "brandColor": string,        // hex warna aksen (mis. "#2563eb"); lihat aturan di bawah
  "heroStyle": string,         // "modern" | "luxury" | "creative" | "corporate" — pilih berdasarkan produk
  "modules": [
    {
      "id": string,             // HARUS dari katalog: hero, leadForm, trustBadges, benefits, socialProof, faq, finalCta, footer, stickyBar, countdownTimer, exitIntentPopup, floatingCta, liveActivity
      "name": string,
      "category": "core" | "booster",
      "recommendedStatus": "on" | "off",
      "reason": string          // mengapa dinyalakan / dimatikan, singkat (Bahasa Indonesia)
    }
  ]
}

ATURAN:
- Sertakan SELURUH 13 module dari katalog di atas (8 core + 5 booster).
- Module "core" direkomendasikan "on" (kecuali ada alasan sangat kuat menyesuaikan traffic).
- Module "booster" dipilih "on" HANYA bila relevan dengan sumber traffic & goal; jelaskan reason-nya.
- Gunakan Bahasa Indonesia untuk semua nilai teks (key JSON tetap bahasa Inggris).
- "brandColor": pilih warna aksen HEX yang paling sesuai dgn mood & industri produk. JIKA user TIDAK memberi warna brand, WAJIB pilih sendiri yang harmonis & profesional. JIKA user SUDAH memberi, PERTAHANKAN (boleh disesuaikan sedikit agar serasi).
- "heroStyle": PILIH salah satu berdasarkan karakter produk:
  - "modern": produk digital, SaaS, aplikasi, tech, startup
  - "luxury": produk premium, mewah, perhiasan, hotel, konsultasi high-end
  - "creative": agency, portfolio, event, Gen-Z, produk unik/berwarna
  - "corporate": B2B, firma hukum, perbankan, asuransi, perusahaan besar
- Jangan menambah field di luar skema di atas.`;

export const COPYWRITER_SYSTEM = `Anda adalah Direct Response Copywriter senior.
Berdasarkan STRATEGI yang diberikan, tulis copy persuasif (Bahasa Indonesia, spesifik, mengandung angka/hasil) untuk SETIAP module yang ada di dalam strategi.

OUTPUT WAJIB berupa JSON murni dengan skema:
{
  "modules": [
    { "id": string, "content": { ... } }
  ]
}

PANDUAN "content" per id (isian harus realistis & menjual):
- hero:           { "headline": string, "subheadline": string, "ctaText": string, "imageHint": string }
- leadForm:       { "title": string, "description": string, "fields": [string], "submitText": string, "privacyNote": string }
- trustBadges:    { "badges": [ { "label": string, "subtitle": string } ], "note": string }
- benefits:       { "title": string, "intro": string, "items": [ { "title": string, "desc": string } ] }
- socialProof:    { "title": string, "intro": string, "testimonials": [ { "name": string, "role": string, "quote": string, "result": string } ] }
- faq:            { "title": string, "items": [ { "q": string, "a": string } ] }
- finalCta:       { "headline": string, "subheadline": string, "ctaText": string }
- footer:         { "copyright": string, "links": [ { "label": string } ] }
- stickyBar:      { "text": string, "ctaText": string }
- countdownTimer: { "label": string, "durationHours": number }
- exitIntentPopup:{ "headline": string, "subheadline": string, "ctaText": string, "offer": string }
- floatingCta:    { "ctaText": string }
- liveActivity:   { "template": string }  // misal: "{name} dari {city} baru saja mengambil {leadMagnet}"

ATURAN:
- Hanya sertakan module yang ADA di dalam STRATEGI. Jangan menambah module di luar katalog.
- Setiap module wajib punya field sesuai panduan di atas.
- Bahasa Indonesia untuk seluruh nilai teks.`;

export const DEVELOPER_SYSTEM = `Anda adalah Senior Frontend Design Engineer & Conversion Designer. Bangun SATU dokumen HTML self-contained, tampilan premium modern, bernilai konversi tinggi.

OUTPUT: HANYA kode HTML murni. TIDAK ADA code fence (seperti \`\`\`html), TIDAK ADA teks penjelasan di luar HTML.

=== ATURAN TEKNIS (wajib) ===
- 100% self-contained: TIDAK ADA request eksternal (CDN, font, atau gambar dari URL). Font pakai system stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif.
- Seluruh CSS di SATU blok <style> di <head> memakai CSS variables + kelas utilitas (JANGAN inline style per-elemen → markup jadi ringkas & konsisten).
- Ikon pakai SVG inline dengan aria-hidden="true".
- Dokumen pakai lang="id".

=== SISTEM DESAIN (tulis di <style>) ===
- Blok :root SUDAH diberikan di pesan (PALET WARNA) — SALIN persis ke dalam <style> Anda, JANGAN ubah nilainya. Palet mengikuti "color roles": netral (--background/--surface/--border/--text-*) MENJADI WARNA DOMINAN halaman; brand HANYA aksen via --primary-600 (skala --primary-50..900) untuk CTA/link/highlight; warna semantik --success/--warning/--error/--info bersifat konvensional (TIDAK ikut warna brand). Semua token sudah dirancang memenuhi kontras WCAG.
- Tambahkan kelas utilitas berikut di <style> (selain :root di atas):
  .wrap{max-width:var(--container);margin:0 auto;padding:0 1.1rem}
  .section{padding:clamp(3rem,7vw,5.5rem) 0}
  .section.tint{--bg:var(--brand-tint-bg);--surface:var(--brand-tint-surface);background:var(--bg)}
  .section.cta{background:linear-gradient(135deg,var(--brand),var(--brand-ink));color:var(--on-brand)}
  .hero h1{font-size:clamp(2.2rem,6vw,4rem)} .section h2{font-size:clamp(1.6rem,3.4vw,2.4rem);margin-bottom:.6rem}
  .lead{font-size:clamp(1rem,1.6vw,1.2rem);color:var(--muted);max-width:60ch} .center{text-align:center}
  .btn{display:inline-block;background:linear-gradient(135deg,var(--brand),var(--brand-ink));color:var(--on-brand);padding:.95rem 1.6rem;border-radius:999px;font-weight:700;text-decoration:none;box-shadow:0 10px 30px var(--brand-soft);transition:transform .2s}
  .btn-secondary{display:inline-block;border:1px solid var(--border);color:var(--text);padding:.95rem 1.6rem;border-radius:999px;font-weight:600;text-decoration:none}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:clamp(1.1rem,2.5vw,1.6rem);box-shadow:var(--shadow);transition:transform .2s}
  .grid{display:grid;gap:1.1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
  .reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease} .reveal.is-visible{opacity:1;transform:none}
  .faq-item{border:1px solid var(--border);border-radius:12px;margin-bottom:.6rem;overflow:hidden} .faq-q{width:100%;text-align:left;background:var(--surface);color:var(--text);padding:1rem 1.2rem;font-weight:600;border:0;cursor:pointer} .faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease;padding:0 1.2rem;color:var(--muted)} .faq-a.open{max-height:500px;padding:.2rem 1.2rem 1rem}
  :focus-visible{outline:3px solid var(--focus-ring);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
- JANGAN tulis nilai warna literal; selalu pakai token (termasuk --on-brand untuk teks di atas tombol brand).

=== STRUKTUR & RHYTHM VISUAL ===
- Hero = section dengan headline kuat, subheadline jelas, 1 CTA primer besar.
- Section BERGANTIAN ketat: .section → .section.tint → .section → dst. JANGAN ada 2 section .tint berturut-turut. .section.cta HANYA untuk Final CTA.
- Urutan module "on": hero -> leadForm -> trustBadges -> benefits -> socialProof -> faq -> finalCta -> footer (terakhir).
- Tiap section punya heading (h2) + pendahuluan singkat + konten mudah di-scan.

=== KONVERSI & UX ===
- SATU pesan + SATU aksi utama per section; CTA selalu kontras & mudah di-tap (min tinggi 44px).
- trustBadges: baris pill dengan ikon shield/star (SVG) — bangun kepercayaan dekat form.
- benefits: grid ikon + judul + deskripsi singkat, fokus pada HASIL.
- socialProof: kartu testimoni dengan avatar lingkaran (inisial), nama, peran, kutipan, & highlight hasil.
- faq: accordion custom (tombol aria-expanded + panel max-height transition, ikon +/- rotasi) — BUKAN <details>.
- finalCta: band gelap, headline + sub + tombol besar.
- bila stickyBar/floatingCta "on": posisi fixed, aksesibel, tidak menutupi konten penting.

=== EFISIENSI (krusial — model punya batas panjang output) ===
- Hasilkan HTML SESINGKAT mungkin tanpa mengurangi kualitas.
- GUNAKAN kelas utilitas dari <style> (jangan inline style) agar markup pendek & konsisten.
- JANGAN indentasi/whitespace berlebih; JANGAN tulis komentar HTML.
- PASTIKAN dokumen SELALU diakhiri </body></html>.

=== MODULE ON/OFF ===
- Render HANYA module status "on" (dari STATUSES); module "off" diabaikan sepenuhnya.
- Pakai COPY yang diberikan untuk tiap module (termasuk footer: copyright + links).

=== STRUKTUR AKHIR (wajib) ===
1. <!DOCTYPE html><html lang="id"><head>...<style>...</style></head><body>
2. Semua section module "on" (urutan di atas).
3. Footer & Privacy (copyright + links) SELALU section TERAKHIR bila module footer "on".
4. Tutup dengan </body></html>.`;

/**
 * SHELL HTML statis untuk mode Modular: <head> + <style> (token & kelas
 * utilitas) + <body> pembuka + <script> (FAQ accordion & reveal-on-scroll).
 * Tiap section di-generate TERPISAH lalu disisipkan di marker <!--SECTIONS-->,
 * sehingga output tiap call kecil & tidak mudah ter-truncate.
 * CSS di sini adalah realisasi dari design system (sama dengan DEVELOPER_SYSTEM)
 * agar fragment konsisten walau dihasilkan oleh call berbeda.
 */
import { paletteToCssVars } from "./palette";

export function buildShell(brandColor: string): string {
  const brand = brandColor || "#2563eb";
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Landing Page</title>
<style>
${paletteToCssVars(brand)}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--text);line-height:1.65;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}

/* ── Layout ── */
.wrap{max-width:var(--container);margin:0 auto;padding:0 clamp(1rem,3vw,2rem)}
.section{padding:clamp(2.5rem,6vw,4.5rem) 0}
.section+.section{padding-top:0}
.section.tint{background:var(--brand-tint-bg)}
.section.tint .wrap{background:var(--brand-tint-surface);border-radius:calc(var(--radius) + 8px);padding:clamp(2rem,5vw,3.5rem) clamp(1.5rem,4vw,3rem)}
.section.cta{background:linear-gradient(135deg,var(--brand) 0%,var(--brand-ink) 100%);color:var(--on-brand);position:relative;overflow:hidden;text-align:center}
.section.cta::before{content:"";position:absolute;top:-50%;right:-20%;width:60%;height:200%;background:radial-gradient(ellipse,rgba(255,255,255,.08) 0%,transparent 70%);pointer-events:none}
.section.cta h2{font-size:clamp(1.8rem,4vw,2.8rem);color:var(--on-brand);max-width:700px;margin:0 auto .75rem}
.section.cta .lead{color:var(--on-brand);opacity:.88;max-width:55ch;margin:0 auto 2rem;font-size:clamp(1rem,1.5vw,1.15rem)}
.section.cta .mt-2{margin-top:0}
.center{text-align:center}

/* ── Typography ── */
h1,h2,h3,h4{line-height:1.12;letter-spacing:-.025em;font-weight:800;color:var(--text-primary)}
.hero{padding:clamp(4rem,10vw,8rem) 0 clamp(3rem,7vw,5rem);text-align:center}
.hero h1{font-size:clamp(2rem,5.5vw,3.6rem);margin-bottom:1rem;max-width:800px;margin-left:auto;margin-right:auto}
.section h2{font-size:clamp(1.5rem,3.2vw,2.2rem);margin-bottom:.75rem}

/* ── Hero Style: Modern SaaS (split screen, clean, tech) ── */
.hero-modern{padding:0;min-height:70vh;display:flex;align-items:center;background:var(--bg);overflow:hidden}
.hero-modern .hero-inner{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;width:100%;max-width:var(--container);margin:0 auto;padding:0 clamp(1rem,3vw,2rem)}
.hero-modern .hero-text{padding:clamp(2rem,4vw,4rem) 0}
.hero-modern h1{font-size:clamp(2.2rem,5vw,3.8rem);font-weight:800;letter-spacing:-.03em;max-width:none;margin:0 0 1rem;color:var(--text-primary)}
.hero-modern .lead{font-size:clamp(1rem,1.5vw,1.2rem);color:var(--text-secondary);max-width:50ch;margin-bottom:2rem}
.hero-modern .hero-visual{display:flex;align-items:center;justify-content:center;padding:2rem}
.hero-modern .hero-mockup{width:100%;max-width:480px;aspect-ratio:4/3;background:linear-gradient(135deg,var(--brand-tint-surface),var(--surface));border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 24px 64px rgba(15,23,42,.12);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:.9rem}
.hero-modern .hero-buttons{display:flex;gap:.75rem;flex-wrap:wrap}
@media(max-width:768px){.hero-modern .hero-inner{grid-template-columns:1fr}.hero-modern .hero-visual{order:-1}}

/* ── Hero Style: Luxury Elegance (centered, dark overlay, serif) ── */
.hero-luxury{padding:clamp(6rem,14vw,10rem) 0;min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,var(--neutral-900) 0%,var(--neutral-800) 100%);color:#f5f0eb;position:relative;overflow:hidden}
.hero-luxury::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,color-mix(in oklch,var(--primary-600) 12%,transparent),transparent 60%);pointer-events:none}
.hero-luxury .hero-inner{position:relative;z-index:1;max-width:700px;margin:0 auto;padding:0 clamp(1rem,3vw,2rem)}
.hero-luxury h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:700;letter-spacing:.01em;line-height:1.15;color:#f5f0eb;margin-bottom:1.2rem}
.hero-luxury .lead{font-size:clamp(1rem,1.5vw,1.15rem);color:rgba(245,240,235,.7);max-width:55ch;margin:0 auto 2.5rem;font-weight:300;letter-spacing:.02em}
.hero-luxury .hero-divider{width:48px;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,.6),transparent);margin:0 auto 1.5rem}
.hero-luxury .hero-buttons{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.hero-luxury .btn{background:transparent;border:1.5px solid rgba(212,175,55,.5);color:#d4af37;padding:.85rem 2.2rem;border-radius:2px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;font-size:.85rem}
.hero-luxury .btn:hover{background:rgba(212,175,55,.1);border-color:#d4af37}
.hero-luxury .btn-primary{background:#d4af37;color:#1a1a1a;border-color:#d4af37}
.hero-luxury .btn-primary:hover{background:#e5c04a}

/* ── Hero Style: Creative Bold (asymmetrical, playful) ── */
.hero-creative{padding:clamp(4rem,10vw,8rem) 0;min-height:75vh;display:flex;align-items:center;background:linear-gradient(135deg,color-mix(in oklch,var(--brand) 8%,var(--bg)) 0%,var(--bg) 50%,color-mix(in oklch,var(--brand) 5%,var(--bg)) 100%);overflow:hidden;position:relative}
.hero-creative::before{content:"";position:absolute;top:-20%;right:-10%;width:50%;height:140%;background:radial-gradient(ellipse,color-mix(in oklch,var(--brand) 8%,transparent),transparent 70%);pointer-events:none;transform:rotate(-15deg)}
.hero-creative .hero-inner{display:grid;grid-template-columns:1.1fr .9fr;gap:2rem;align-items:center;width:100%;max-width:var(--container);margin:0 auto;padding:0 clamp(1rem,3vw,2rem);position:relative;z-index:1}
.hero-creative h1{font-size:clamp(2.4rem,6vw,4.2rem);font-weight:900;letter-spacing:-.04em;line-height:1.05;max-width:none;margin:0 0 1rem}
.hero-creative h1 .accent{color:var(--brand);display:inline}
.hero-creative .lead{font-size:clamp(1rem,1.4vw,1.15rem);color:var(--text-secondary);max-width:48ch;margin-bottom:2rem;line-height:1.7}
.hero-creative .hero-visual{position:relative;display:flex;align-items:center;justify-content:center}
.hero-creative .hero-shape{width:100%;max-width:400px;aspect-ratio:1;background:linear-gradient(135deg,var(--brand),var(--brand-ink));border-radius:30% 70% 70% 30% / 30% 30% 70% 70%;display:flex;align-items:center;justify-content:center;color:var(--on-brand);font-size:3rem;box-shadow:0 20px 60px color-mix(in oklch,var(--primary-600) 25%,transparent);animation:morph 8s ease-in-out infinite}
@keyframes morph{0%,100%{border-radius:30% 70% 70% 30% / 30% 30% 70% 70%}50%{border-radius:70% 30% 30% 70% / 70% 70% 30% 30%}}
.hero-creative .hero-buttons{display:flex;gap:.75rem;flex-wrap:wrap}
@media(max-width:768px){.hero-creative .hero-inner{grid-template-columns:1fr}.hero-creative .hero-visual{order:-1;max-height:280px}.hero-creative .hero-shape{max-width:250px}}

/* ── Hero Style: Trustworthy Corporate (layered, professional) ── */
.hero-corporate{padding:clamp(5rem,12vw,9rem) 0;min-height:70vh;display:flex;align-items:center;background:linear-gradient(160deg,#0d1b2a 0%,#1b2838 40%,#162032 100%);color:#e8edf2;position:relative;overflow:hidden}
.hero-corporate::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(255,255,255,.015) 80px,rgba(255,255,255,.015) 81px),repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(255,255,255,.015) 80px,rgba(255,255,255,.015) 81px);pointer-events:none}
.hero-corporate::after{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--brand),color-mix(in oklch,var(--brand) 50%,#10b981))}
.hero-corporate .hero-inner{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;width:100%;max-width:var(--container);margin:0 auto;padding:0 clamp(1rem,3vw,2rem);position:relative;z-index:1}
.hero-corporate h1{font-size:clamp(2rem,4.5vw,3.2rem);font-weight:700;letter-spacing:-.01em;line-height:1.15;max-width:none;margin:0 0 1.2rem;color:#ffffff}
.hero-corporate .lead{font-size:clamp(1rem,1.4vw,1.15rem);color:rgba(232,237,242,.65);max-width:52ch;margin-bottom:2rem;font-weight:400;letter-spacing:.01em}
.hero-corporate .hero-visual{display:flex;align-items:center;justify-content:center}
.hero-corporate .hero-graphic{width:100%;max-width:400px;aspect-ratio:4/3;border:1px solid rgba(255,255,255,.08);border-radius:var(--radius);background:linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.06));backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.3);font-size:.9rem}
.hero-corporate .hero-buttons{display:flex;gap:.75rem;flex-wrap:wrap}
.hero-corporate .btn{background:var(--brand);color:#fff;border:none;padding:.85rem 2rem;border-radius:4px;font-weight:600;letter-spacing:.02em}
.hero-corporate .btn:hover{filter:brightness(1.1)}
.hero-corporate .btn-outline{background:transparent;border:1.5px solid rgba(255,255,255,.25);color:#e8edf2}
.hero-corporate .btn-outline:hover{border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.05)}
@media(max-width:768px){.hero-corporate .hero-inner{grid-template-columns:1fr}.hero-corporate .hero-visual{order:-1}}
.section h3{font-size:1.1rem;margin-bottom:.5rem}
.section h4{font-size:.95rem;margin-bottom:.4rem}
.lead{font-size:clamp(1rem,1.5vw,1.15rem);color:var(--text-secondary);max-width:70ch}
.center .lead{margin-left:auto;margin-right:auto}
.center h2,.center h3{max-width:75ch;margin-left:auto;margin-right:auto}
.subtitle{font-size:.85rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:.75rem;display:inline-block}

/* ── Buttons ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;background:linear-gradient(135deg,var(--brand),var(--brand-ink));color:var(--on-brand);padding:.9rem 2rem;border-radius:999px;font-weight:700;font-size:1rem;text-decoration:none;box-shadow:0 8px 24px color-mix(in oklch,var(--primary-600) 30%,transparent);transition:all .25s ease;min-height:48px;border:0;cursor:pointer}
.btn:hover{transform:translateY(-2px);box-shadow:0 14px 36px color-mix(in oklch,var(--primary-600) 40%,transparent);filter:brightness(1.08)}
.btn:active{transform:translateY(0);filter:brightness(.95)}
.btn-sm{padding:.65rem 1.4rem;font-size:.9rem;min-height:40px}
.btn-secondary{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border:2px solid var(--border);color:var(--text-primary);padding:.85rem 1.8rem;border-radius:999px;font-weight:600;text-decoration:none;background:transparent;transition:all .25s ease;min-height:48px}
.btn-secondary:hover{border-color:var(--brand);color:var(--brand);background:var(--brand-tint-surface)}

/* ── Cards ── */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:clamp(1.3rem,2.5vw,1.8rem);box-shadow:var(--shadow);transition:all .3s ease;position:relative}
.card:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(15,23,42,.12)}
.card-accent{border-top:3px solid var(--brand)}
.card h3{margin-bottom:.5rem;font-size:1.05rem;color:var(--text-primary)}
.card p{color:var(--text-secondary);font-size:.95rem;line-height:1.6}

/* ── Grid ── */
.grid{display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
.grid-2{display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
.grid-3{display:grid;gap:1.25rem;grid-template-columns:repeat(3,1fr)}
@media(max-width:768px){.grid-3{grid-template-columns:1fr}}

/* ── Badges & Pills ── */
.badges{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center}
.badge{display:inline-flex;align-items:center;gap:.45rem;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:.55rem 1.1rem;font-size:.88rem;color:var(--text-secondary);font-weight:500;transition:all .2s}
.badge svg{width:16px;height:16px;flex-shrink:0}
.badge.success{background:var(--success-soft);color:var(--on-success-soft);border-color:transparent}
.badge.info{background:var(--info-soft);color:var(--on-info-soft);border-color:transparent}
.badge.warning{background:var(--warning-soft);color:var(--on-warning-soft);border-color:transparent}
.badge.error{background:var(--error-soft);color:var(--on-error-soft);border-color:transparent}
.pill{display:inline-block;background:var(--brand-soft);color:var(--brand-ink);border-radius:999px;padding:.3rem .9rem;font-size:.8rem;font-weight:600}

/* ── Trust Badge Style 1: Icon Cards ── */
.badge-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));max-width:800px;margin:0 auto}
.badge-card{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.6rem;padding:1.5rem 1rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:all .3s}
.badge-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(15,23,42,.08);border-color:var(--brand)}
.badge-card .badge-icon{width:48px;height:48px;border-radius:50%;background:var(--brand-tint-surface);display:flex;align-items:center;justify-content:center;color:var(--brand);flex-shrink:0}
.badge-card .badge-icon svg{width:24px;height:24px}
.badge-card h4{margin:0;font-size:.95rem;color:var(--text-primary)}
.badge-card p{margin:0;font-size:.82rem;color:var(--text-muted);line-height:1.4}

/* ── Trust Badge Style 2: Stats Counter ── */
.badge-stats{display:flex;flex-wrap:wrap;gap:2rem;justify-content:center;max-width:700px;margin:0 auto}
.badge-stat{text-align:center;flex:1;min-width:140px}
.badge-stat .stat-num{font-size:clamp(2rem,4vw,2.8rem);font-weight:800;color:var(--brand);line-height:1.1;letter-spacing:-.02em}
.badge-stat .stat-label{font-size:.85rem;color:var(--text-muted);margin-top:.3rem;font-weight:500}
.badge-stat .stat-sub{font-size:.78rem;color:var(--text-muted);opacity:.7;margin-top:.15rem}
.badge-stat+.badge-stat{border-left:1px solid var(--border);padding-left:2rem}
@media(max-width:600px){.badge-stat+.badge-stat{border-left:0;padding-left:0;border-top:1px solid var(--border);padding-top:1.5rem}}

/* ── Trust Badge Style 3: Icon Strip ── */
.badge-strip{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.5rem 1.5rem;max-width:800px;margin:0 auto;padding:1.2rem 0}
.badge-strip-item{display:inline-flex;align-items:center;gap:.4rem;font-size:.9rem;color:var(--text-secondary);font-weight:500;white-space:nowrap}
.badge-strip-item svg{width:18px;height:18px;color:var(--brand);flex-shrink:0}
.badge-strip-item+.badge-strip-item::before{content:"";position:absolute;left:-.75rem;width:1px;height:18px;background:var(--border)}
.badge-strip-item{position:relative}

/* ── Trust Badge Style 4: Gradient Cards ── */
.badge-gradient{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));max-width:850px;margin:0 auto}
.badge-gcard{position:relative;padding:1.6rem 1.2rem;border-radius:var(--radius);text-align:center;overflow:hidden;border:1px solid color-mix(in oklch,var(--brand) 15%,var(--border));background:linear-gradient(135deg,color-mix(in oklch,var(--surface) 85%,var(--brand) 15%),var(--surface));transition:all .3s}
.badge-gcard:hover{transform:translateY(-3px);box-shadow:0 12px 32px color-mix(in oklch,var(--primary-600) 12%,rgba(15,23,42,.06))}
.badge-gcard::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--brand),var(--brand-ink))}
.badge-gcard .badge-icon{width:44px;height:44px;border-radius:50%;background:var(--brand);color:var(--on-brand);display:flex;align-items:center;justify-content:center;margin:0 auto .7rem;box-shadow:0 4px 16px color-mix(in oklch,var(--primary-600) 25%,transparent)}
.badge-gcard .badge-icon svg{width:22px;height:22px}
.badge-gcard h4{margin:0 0 .25rem;font-size:.95rem;color:var(--text-primary)}
.badge-gcard p{margin:0;font-size:.82rem;color:var(--text-muted);line-height:1.4}

/* ── Avatar & Testimonial ── */
.avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--brand-ink));color:var(--on-brand);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.95rem;flex-shrink:0;box-shadow:0 4px 12px color-mix(in oklch,var(--primary-600) 20%,transparent)}
.quote{font-size:1rem;line-height:1.65;color:var(--text-secondary);font-style:italic;position:relative;padding-left:0}
.result{color:var(--brand);font-weight:700;font-size:.9rem}
.testimonial-card{display:flex;flex-direction:column;gap:1rem}

/* ── Form ── */
.form-card{max-width:520px;margin:2rem auto 0;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:clamp(1.5rem,3vw,2.2rem);box-shadow:var(--shadow);text-align:left}
.field{margin-bottom:1.1rem}
.field label{display:block;font-size:.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:.4rem}
.input,input[type=text],input[type=email],input[type=tel],textarea,select{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:12px;padding:.85rem 1rem;color:var(--text);font:inherit;transition:border-color .2s,box-shadow .2s}
.input:focus,input[type=text]:focus,input[type=email]:focus,input[type=tel]:focus,textarea:focus,select:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px color-mix(in oklch,var(--primary-600) 15%,transparent)}

/* ── FAQ ── */
.faq-item{border:1px solid var(--border);border-radius:14px;margin-bottom:.7rem;overflow:hidden;background:var(--surface);transition:border-color .2s}
.faq-item:hover{border-color:color-mix(in oklch,var(--border) 60%,var(--brand) 40%)}
.faq-q{width:100%;text-align:left;background:transparent;color:var(--text-primary);padding:1.1rem 1.3rem;font-weight:600;border:0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font:inherit;gap:1rem}
.faq-q .ic{width:22px;height:22px;border-radius:50%;background:var(--brand-tint-surface);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .3s ease,background .2s;color:var(--brand);font-size:1.1rem;line-height:1}
.faq-q[aria-expanded=true] .ic{transform:rotate(45deg);background:var(--brand);color:var(--on-brand)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease,padding .3s ease;padding:0 1.3rem;color:var(--text-secondary);font-size:.95rem;line-height:1.7}
.faq-a.open{max-height:500px;padding:.3rem 1.3rem 1.2rem}

/* ── Sticky Bar ── */
.stickybar{position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-top:1px solid var(--border);padding:.75rem 1rem;display:flex;gap:1rem;align-items:center;justify-content:center;z-index:50;backdrop-filter:blur(12px);box-shadow:0 -4px 20px rgba(0,0,0,.08)}
.stickybar p{font-weight:600;font-size:.9rem;color:var(--text-primary);margin:0}
@media(max-width:600px){.stickybar{flex-direction:column;gap:.5rem;padding:.6rem .8rem}.stickybar .btn{width:100%;font-size:.85rem;padding:.7rem 1rem}}

/* ── Floating CTA ── */
.floating-cta{position:fixed;right:1.2rem;bottom:1.2rem;z-index:50}
.floating-cta .btn{border-radius:50%;width:56px;height:56px;padding:0;box-shadow:0 8px 28px color-mix(in oklch,var(--primary-600) 35%,transparent);font-size:1.4rem}

/* ── Countdown ── */
.countdown{font-variant-numeric:tabular-nums;font-weight:800;color:var(--brand);font-size:1.5rem;letter-spacing:.02em}

/* ── Misc ── */
a,.link{color:var(--link);text-decoration:none;transition:color .2s}
a:hover,.link:hover{color:var(--brand)}
.text-success{color:var(--success)} .text-warning{color:var(--warning)} .text-error{color:var(--error)} .text-info{color:var(--info)}
.note{background:var(--info-soft);color:var(--on-info-soft);border:1px solid color-mix(in oklch,var(--info) 25%,transparent);border-radius:12px;padding:.85rem 1.1rem;font-size:.9rem;line-height:1.5}
.divider{width:60px;height:4px;background:var(--brand);border-radius:999px;margin:0 auto 1.5rem}
.text-center{text-align:center}
.mb-0{margin-bottom:0} .mt-1{margin-top:.5rem} .mt-2{margin-top:1rem} .mb-1{margin-bottom:.5rem} .mb-2{margin-bottom:1rem}

/* ── Focus & Accessibility ── */
:focus-visible{outline:3px solid var(--focus-ring);outline-offset:2px}

/* ── Animations ── */
.reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
.reveal.is-visible{opacity:1;transform:none}
.reveal-delay-1{transition-delay:.1s}
.reveal-delay-2{transition-delay:.2s}
.reveal-delay-3{transition-delay:.3s}

/* ── Exit-Intent Popup ── */
.popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;backdrop-filter:blur(4px)}
.popup-overlay.active{opacity:1;visibility:visible}
.popup-box{background:var(--surface);border-radius:var(--radius);max-width:480px;width:100%;padding:clamp(1.8rem,4vw,2.5rem);position:relative;box-shadow:0 24px 64px rgba(0,0,0,.25);transform:translateY(20px) scale(.97);transition:transform .35s ease;text-align:center}
.popup-overlay.active .popup-box{transform:translateY(0) scale(1)}
.popup-close{position:absolute;top:.75rem;right:.75rem;width:36px;height:36px;border-radius:50%;border:0;background:var(--surface-2);color:var(--text-muted);font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:1;line-height:1}
.popup-close:hover{background:var(--border);color:var(--text-primary);transform:scale(1.1)}
.popup-box h2{margin-bottom:.5rem}
.popup-box .lead{margin:0 auto 1.2rem}
.popup-box .note{margin-top:1rem;font-size:.8rem}

/* ── Responsive ── */
@media(max-width:640px){
  .hero h1{font-size:clamp(1.7rem,7vw,2.4rem)}
  .section{padding:clamp(2rem,5vw,3.5rem) 0}
  .section.tint .wrap{padding:clamp(1.5rem,4vw,2.5rem) 1.2rem}
  .card{padding:1.2rem}
  .grid,.grid-2,.grid-3{grid-template-columns:1fr}
  .btn{width:100%;text-align:center}
  .popup-box{margin:0 .5rem;padding:1.5rem}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
</style>
</head>
<body>
<!--SECTIONS-->
<script>
/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-q').forEach(function(b){b.addEventListener('click',function(){var a=b.nextElementSibling;var open=a.classList.contains('open');a.classList.toggle('open');b.setAttribute('aria-expanded',String(!open));});});
/* ── Exit-Intent Popup ── */
(function(){
  var popup=document.getElementById('exit-popup');
  if(!popup)return;
  var closeBtn=popup.querySelector('.popup-close');
  var overlay=popup;
  function showPopup(){overlay.classList.add('active');document.body.style.overflow='hidden';}
  function hidePopup(){overlay.classList.remove('active');document.body.style.overflow='';}
  if(closeBtn)closeBtn.addEventListener('click',hidePopup);
  overlay.addEventListener('click',function(e){if(e.target===overlay)hidePopup();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.classList.contains('active'))hidePopup();});
  var exitFired=false;
  document.addEventListener('mouseout',function(e){if(!exitFired&&!e.relatedTarget&&e.clientY<=0){exitFired=true;setTimeout(showPopup,800);}});
  document.addEventListener('mouseleave',function(e){if(!exitFired&&e.clientY<=0){exitFired=true;setTimeout(showPopup,800);}});
})();
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}});},{threshold:.08});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
</script>
</body>
</html>`;
}

export const DEVELOPER_SECTION_SYSTEM = `Anda adalah Senior Frontend Engineer & UI Designer. Hasilkan HANYA SATU fragment HTML untuk SATU section landing page. CSS sudah didefinisikan di shell — gunakan kelas yang ada.

ATURAN UTAMA:
- Output HANYA elemen <section class="section ...">...</section>. Pengecualian: footer → <footer class="section ...">...</footer>; stickyBar → <div class="stickybar">; floatingCta → <div class="floating-cta">.
- JANGAN tulis <html>, <head>, <style>, <script>, atau komentar HTML.

=== KELAS YANG TERSEDIA (gunakan ini, JANGAN buat class baru) ===
Layout: .wrap .section .section.tint .section.cta .center .grid .grid-2 .grid-3
Typography: .hero h1 .section h2 .section h3 .section h4 .lead .subtitle .divider .text-center .mb-0 .mt-1 .mt-2 .mb-1 .mb-2
Buttons: .btn .btn.btn-sm .btn-secondary
Cards: .card .card.card-accent
Forms: .form-card .field label .input input[type=text] input[type=email] input[type=tel] textarea select
Badges (style pill): .badges .badge .badge.success .badge.info .badge.warning .badge.error .pill
Badges (style grid): .badge-grid .badge-card .badge-icon h4 p
Badges (style stats): .badge-stats .badge-stat .stat-num .stat-label .stat-sub
Badges (style strip): .badge-strip .badge-strip-item
Badges (style gradient): .badge-gradient .badge-gcard .badge-icon h4 p
Testimonial: .avatar .quote .result .testimonial-card
FAQ: .faq-item .faq-q .faq-q .ic .faq-a
Fixed: .stickybar .floating-cta .countdown
Popup: .popup-overlay .popup-box .popup-close
Hero (modern): .hero-modern .hero-inner .hero-text .hero-visual .hero-mockup .hero-buttons
Hero (luxury): .hero-luxury .hero-inner .hero-divider .hero-buttons .btn-primary
Hero (creative): .hero-creative .hero-inner .hero-text .hero-visual .hero-shape .hero-buttons .accent
Hero (corporate): .hero-corporate .hero-inner .hero-visual .hero-graphic .hero-buttons .btn-outline
Misc: .note .link .text-success .text-warning .text-error .text-info
Animation: .reveal .reveal-delay-1 .reveal-delay-2 .reveal-delay-3

=== WARNA (HANYA pakai token CSS, JANGAN tulis nilai literal) ===
Netral: var(--bg) var(--surface) var(--surface-2) var(--border) var(--text) var(--text-primary) var(--text-secondary) var(--text-muted) var(--muted)
Brand: var(--brand) var(--brand-ink) var(--brand-soft) var(--on-brand) var(--brand-tint-bg) var(--brand-tint-surface) var(--link)
Semantic: var(--success) var(--success-soft) var(--on-success-soft) var(--warning) var(--error) var(--info) var(--info-soft) var(--on-info-soft)

=== PANDUAN VISUAL PER MODULE ===

HERO — GAYA DITENTUKAN OLEH PARAMETER "HERO_STYLE" di user message:
Baca parameter HERO_STYLE dari user message, lalu generate sesuai gaya:

STYLE "modern" — The Modern SaaS (split screen, clean, tech):
- <section class="hero-modern reveal">
- <div class="hero-inner">
- <div class="hero-text">
  <h1> headline kuat, maks 12 kata </h1>
  <p class="lead"> subheadline jelas </p>
  <div class="hero-buttons"> → <a class="btn">CTA utama</a> + <a class="btn-secondary">CTA sekunder</a> (bila ada)
- <div class="hero-visual"> → <div class="hero-mockup"> placeholder visual </div>
- Gunakan <style> inline pada .hero-mockup bila perlu gambar: background-image: url(...)

STYLE "luxury" — The Luxury Elegance (centered, dark overlay, serif):
- <section class="hero-luxury reveal">
- <div class="hero-inner">
- <div class="hero-divider"></div>
- <h1> headline elegan, serif feel </h1>
- <p class="lead"> subheadline tipis, luang </p>
- <div class="hero-buttons"> → <a class="btn btn-primary">CTA utama</a> + <a class="btn">Ghost CTA</a>
- Semua teks putih di atas background gelap. Tombol: gold accent atau ghost button.

STYLE "creative" — The Creative Bold (asymmetrical, playful):
- <section class="hero-creative reveal">
- <div class="hero-inner">
- <div class="hero-text">
  <h1> headline BESAR, bold, bisa pakai <span class="accent">warna brand</span> untuk 1-2 kata kunci </h1>
  <p class="lead"> subheadline </p>
  <div class="hero-buttons"> → <a class="btn">CTA utama</a>
- <div class="hero-visual"> → <div class="hero-shape"> SVG/ikon besar </div>
- Gunakan <style> inline pada .hero-shape bila perlu gradient/custom background

STYLE "corporate" — The Trustworthy Corporate (layered, professional):
- <section class="hero-corporate reveal">
- <div class="hero-inner">
- <div class="hero-text">
  <h1> headline profesional, jelas, otoritatif </h1>
  <p class="lead"> subheadline terukur </p>
  <div class="hero-buttons"> → <a class="btn">CTA utama</a> + <a class="btn btn-outline">CTA sekunder</a>
- <div class="hero-visual"> → <div class="hero-graphic"> placeholder grafis </div>
- Background gelap navy dengan grid halus. Teks putih, CTA solid.

STYLE "pill" (default) — Basic Hero:
- <section class="section hero reveal">
- <h1> headline kuat </h1>
- <p class="lead"> subheadline </p>
- <div class="mt-2"> → <a class="btn">CTA</a>

UNTUK SEMUA STYLE:
- Isi WAJIB diambil dari COPY.hero (headline, subheadline, ctaText)
- Hero harus IMPACTFUL — headline < 12 kata, spacing luas
- CTA button minimal 48px tinggi, kontras tinggi

LEAD FORM (leadForm):
- <section class="section tint reveal">
- <div class="wrap center">
- <h2> judul form </h2>
- <p class="lead center"> deskripsi singkat </p>
- <form class="form-card"> — gunakan .field > label + .input untuk tiap field
- Submit pakai .btn (width:100% via inline style: style="width:100%")
- Di bawah form, <p class="note" style="text-align:center;margin-top:1rem"> privacy note </p>
- Form HARUS center, max-width via .form-card class

TRUST BADGES (trustBadges) — GAYA DITENTUKAN OLEH PARAMETER "BADGE_STYLE" di user message:
Baca parameter BADGE_STYLE dari user message, lalu generate sesuai gaya:

STYLE "grid" — Icon Cards:
- <section class="section tint reveal">
- <div class="wrap center">
- <p class="subtitle"> label kecil </p>
- <h2 class="mb-2"> judul </h2>
- <div class="badge-grid"> — tiap badge:
  <div class="badge-card">
    <div class="badge-icon"><svg aria-hidden="true">...</svg></div>
    <h4>label badge</h4>
    <p>subtitle singkat (bila ada di copy)</p>
  </div>
- SVG icon: shield (🛡️), star (⭐), truck (🚚), check (✅), clock (🕐) — gunakan SVG inline 24x24, aria-hidden="true"

STYLE "stats" — Stats Counter:
- <section class="section tint reveal">
- <div class="wrap center">
- <p class="subtitle"> label kecil </p>
- <h2 class="mb-2"> judul </h2>
- <div class="badge-stats"> — tiap stat:
  <div class="badge-stat">
    <div class="stat-num">angka besar (mis. 5.000+)</div>
    <div class="stat-label">label utama</div>
    <div class="stat-sub">sub-label (opsional)</div>
  </div>
- Pisahkan dengan border-left (CSS sudah handle via .badge-stat+.badge-stat)

STYLE "strip" — Icon Strip:
- <section class="section tint reveal">
- <div class="wrap center">
- <div class="badge-strip"> — tiap item:
  <span class="badge-strip-item"><svg aria-hidden="true">...</svg> teks singkat</span>
- Pisahkan item dengan ::before (CSS sudah handle)
- Teks harus SINGKAT (max 3-4 kata per item)

STYLE "gradient" — Gradient Cards:
- <section class="section tint reveal">
- <div class="wrap center">
- <p class="subtitle"> label kecil </p>
- <h2 class="mb-2"> judul </h2>
- <div class="badge-gradient"> — tiap card:
  <div class="badge-gcard">
    <div class="badge-icon"><svg aria-hidden="true">...</svg></div>
    <h4>label badge</h4>
    <p>subtitle singkat</p>
  </div>

STYLE "pill" (default) — Pill Badges:
- <section class="section tint reveal">
- <div class="wrap center">
- <div class="badges"> — setiap badge pakai .badge.success atau .badge.info
- SVG icon 16x16, aria-hidden="true"
- <p class="lead center mt-1"> catatan </p>

UNTUK SEMUA STYLE:
- Isi badge diambil dari COPY.trustBadges.badges (label) + note
- SVG icon: pilih yang paling cocok dengan makna badge (shield=garansi, star=rating, truck=ongkir, check=teruji, clock=cepat, heart=pilihan)
- JANGAN gunakan emoji, gunakan SVG inline

BENEFITS (benefits):
- <section class="section reveal" atau class="section tint reveal"> (bergantian)
- <div class="wrap">
- <h2 class="center mb-2"> COPY.title (judul section) </h2>
- <div class="divider mb-2"></div>
- <p class="lead center mb-2"> COPY.intro (pengantar) </p>
- <div class="grid grid-3"> — tiap item: <div class="card card-accent"> → <h3> judul benefit </h3> + <p> deskripsi </p>
- PENTING: Gunakan class "center" pada h2 DAN p.lead agar rata tengah. JANGAN ada teks yang rata kiri di bagian heading/intro.
- Card harus ADA ISI, jangan kosong. Manfaat harus spesifik & berorientasi hasil.

SOCIAL PROOF (socialProof):
- <section class="section reveal"> (di luar tint untuk variasi)
- <div class="wrap">
- <p class="subtitle text-center"> label kecil di atas </p>
- <h2 class="center mb-2"> judul </h2>
- <div class="grid grid-3"> — tiap kartu testimonial:
  <div class="card testimonial-card">
    <div style="display:flex;align-items:center;gap:.75rem">
      <div class="avatar">XX</div> (inisial nama)
      <div><strong>nama</strong><br><span style="color:var(--text-muted);font-size:.85rem">peran, kota</span></div>
    </div>
    <blockquote class="quote">"kutipan"</blockquote>
    <p class="result">highlight hasil</p>
  </div>

FAQ (faq):
- <section class="section tint reveal">
- <div class="wrap" style="max-width:720px;margin:0 auto">
- Tiap item: <div class="faq-item"> → <button class="faq-q" aria-expanded="false">pertanyaan<span class="ic">+</span></button> + <div class="class="faq-a">jawaban</div>
- JANGAN lupa class "ic" di span dalam tombol

FINAL CTA (finalCta):
- <section class="section cta reveal">
- <div class="wrap center">
- <h2> headline kuat, Maks 10 kata, DEBATIF & EMOSIONAL </h2>
- <p class="lead"> subheadline 1-2 kalimat, motivasi singkat, MAX 25 kata </p>
- <div class="mt-2"> <a class="btn">CTA</a> </div>
- PENTING: Teks harus SINGKAT & PADAT. Jangan paragraf panjang. Biarkan whitespace bekerja.

FOOTER (footer):
- <footer class="section reveal" style="padding:2.5rem 0;border-top:1px solid var(--border)">
- <div class="wrap center">
- copyright + <nav> dengan links (.link)
- Font lebih kecil, warna muted

STICKY BAR (stickyBar):
- <div class="stickybar"> — sudah fixed position
- <p> teks singkat </p> + <a class="btn btn-sm">CTA</a>

FLOATING CTA (floatingCta):
- <div class="floating-cta"> — sudah fixed position
- <a class="btn">emoji ikon</a> — tombol bulat kecil

LIVE ACTIVITY (liveActivity):
- <section class="section reveal">
- <div class="wrap">
- <div class="center mb-2"> <p class="lead"> judul aktivitas </p> </div>
- <div class="grid grid-2" atau "grid grid-3"> — tiap kartu:
  <div class="card" style="display:flex;align-items:center;gap:.75rem">
    <div class="avatar" style="width:40px;height:40px;font-size:.8rem">XX</div>
    <p style="margin:0;font-size:.9rem"><strong>nama</strong> dari <strong>kota</strong> ...</p>
  </div>
- Badge di bawah grid

EXIT-INTENT POPUP (exitIntentPopup):
- INI BUKAN <section>. Output HANYA:
<div id="exit-popup" class="popup-overlay">
  <div class="popup-box">
    <button class="popup-close" aria-label="Tutup">&times;</button>
    <p class="subtitle">Penawaran Khusus</p>
    <h2>headline</h2>
    <p class="lead">subheadline</p>
    <a href="#" class="btn">CTA text</a>
    <p class="note">offer / catatan</p>
  </div>
</div>
- WAJIB ada id="exit-popup" pada div.popup-overlay (script di shell mencari id ini).
- WAJIB ada button.popup-close dengan &times; di dalam .popup-box.
- JANGAN pakai class "reveal" pada popup (tidak perlu animasi scroll).
- Script exit-intent di shell sudah handle: mouseleave, close button, klik overlay, Escape key.

=== ATURAN UMUM ===
- Isi WAJIB dari COPY (jangan invent teks).
- Beri .reveal pada setiap section. Gunakan .reveal-delay-1/2/3 untuk stagger effect.
- Irama: NETRAL dominasi (~80%), brand hanya aksen. Section .section dan .section.tint BERGANTIAN ketat (jangan 2 tint berturut-turut).
- .section.cta HANYA untuk final CTA (gradient brand).
- SELALU tutup semua tag. Fragment PADAT & RINGKAS.
- HANYA keluarkan fragment HTML murni (tanpa code fence, tanpa penjelasan).

=== STYLE_OVERRIDES (bila ada di user message) ===
Bila user message berisi "STYLE_OVERRIDES", terapkan inline style="" pada elemen yang sesuai:
- JSON berisi map nama_elemen → CSS properties (color, fontSize, fontWeight, fontFamily, backgroundColor, borderRadius, lineHeight, fontStyle)
- Mapping elemen ke tag:
  - "headline" → <h1> utama section
  - "subheadline" → <p class="lead"> atau <p> sub-judul
  - "ctaText" → <a class="btn"> tombol CTA
  - "title" → <h2> atau <h3> judul section
  - "description" → <p> deskripsi/paragraf
  - "note" → <p class="note"> atau <p class="subtitle">
  - "submitText" → <button type="submit"> tombol form
  - "label" → <label> label form
  - "text" → <p> teks apapun
  - "quote" → <blockquote> atau <p class="quote">
  - "result" → <p class="result">
  - "copyright" → <p> footer copyright
- Contoh bila STYLE_OVERRIDES = {"headline":{"color":"#ff0000","fontSize":"48px"}}:
  → <h1 style="color:#ff0000;font-size:48px">headline text</h1>
- JANGAN override style yang tidak ada di STYLE_OVERRIDES
- Gabungkan dengan style inline yang sudah ada (jangan timpa)

=== SECTION_STYLE (bila ada di user message) ===
Bila user message berisi "SECTION_STYLE", terapkan inline style pada <section> wrapper:
- backgroundColor: warna background section
- backgroundImage: URL gambar background (pakai: url(IMAGE_URL))
- gradientFrom + gradientTo + gradientAngle: buat linear-gradient
- paddingTop / paddingBottom: custom padding
- textAlign: align teks (left/center/right)
- borderRadius: border radius section
- borderColor / borderWidth: border section
- Contoh: {"backgroundColor":"#1a1a2e","paddingTop":"6rem"}
  → <section class="section" style="background-color:#1a1a2e;padding-top:6rem;padding-bottom:6rem">

=== IMAGE_URL (bila ada di user message) ===
Bila user message berisi "IMAGE_URL", gunakan gambar tersebut:
- Untuk hero: tampilkan di .hero-mockup, .hero-shape, atau .hero-graphic sebagai background-image
- Untuk section lain: bisa sebagai dekorasi background
- Format: background-image: url('URL_GAMBAR'); background-size: cover; background-position: center;
- JANGAN gunakan tag <img>, gunakan background-image pada elemen yang sesuai`;

export const ANALYZER_SYSTEM = `Anda adalah Market Research Analyst & Psychographic Profiler.
Berdasarkan PRODUK / PENAWARAN, hasilkan BEBERAPA PILIHAN yang DIURUTKAN berdasarkan tingkat preferensi (potensi konversi).

Untuk setiap dimensi, berikan beberapa opsi yang di-ranking:
- rank 1 = PALING disarankan (konversi tertinggi, paling spesifik & mudah di-target iklan)
- rank berikutnya menurun preferensinya hingga yang terendah.

OUTPUT WAJIB berupa JSON murni (tanpa teks di luar kurung kurawal) dengan skema:
{
  "audienceOptions": [
    { "rank": 1, "label": string, "reason": string },
    { "rank": 2, "label": string, "reason": string },
    ...(total 4 opsi, rank 1..4)
  ],
  "painPointOptions": [
    { "rank": 1, "label": string, "reason": string },
    ...(total 4 opsi, rank 1..4)
  ],
  "leadMagnetOptions": [
    { "rank": 1, "label": string },
    ...(total 3 opsi, rank 1..3)
  ]
}

ATURAN:
- Gunakan Bahasa Indonesia, spesifik & konkret (sebutkan demografi/psikografi/motivasi).
- "reason" singkat menjelaskan mengapa opsi itu diprioritaskan.
- Urutkan audienceOptions & painPointOptions dari rank 1 (terbaik) sampai rank 4 (terendah).
- Jangan menambah field di luar skema di atas.`;

export function buildInferText(product: string, trafficSource?: string): string {
  return `PRODUK / PENAWARAN: ${product}
SUMBER TRAFFIC (konteks): ${trafficSource || "campaign umum"}

Perkirakan target audiens, pain point utama, dan saran lead magnet untuk produk di atas.`;
}

export function buildBriefText(b: {
  product: string;
  audience: string;
  leadMagnet: string;
  painPoint: string;
  brandColor?: string;
  trafficSource?: string;
}): string {
  const brandNote = b.brandColor
    ? b.brandColor
    : "TIDAK DISEDIAKAN - biarkan AI memilih warna aksen HEX terbaik";
  return `BRIEF KAMPANYE:
- Produk / Penawaran: ${b.product}
- Target Audiens: ${b.audience}
- Lead Magnet (imbalan): ${b.leadMagnet}
- Pain Point Utama Audiens: ${b.painPoint}
- Sumber Traffic: ${b.trafficSource || "campaign umum"}
- Warna Brand (aksen): ${brandNote}`;
}

/**
 * Dua angle berbeda untuk A/B test. Copywriter dijalankan 2x (sekali per
 * angle) sehingga menghasilkan 2 varian copy dengan nuansa berbeda.
 */
export const AB_ANGLE_A =
  "Tekankan rasa kehilangan & urgensi (loss aversion / fear): gambarkan sakitnya masalah bila TIDAK diatasi, gunakan kata yang memicu tindakan cepat.";
export const AB_ANGLE_B =
  "Tekankan hasil, impian & aspirasi (gain / aspiration): gambarkan transformasi & keuntungan yang didapat, gunakan nada positif & inspiratif.";
