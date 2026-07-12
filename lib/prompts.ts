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
  "trafficNote": string,        // saran penyesuaian berdasar sumber traffic (organik vs berbayar)
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
- trustBadges:    { "badges": [ { "label": string } ], "note": string }
- benefits:       { "intro": string, "items": [ { "title": string, "desc": string } ] }
- socialProof:    { "intro": string, "testimonials": [ { "name": string, "role": string, "quote": string, "result": string } ] }
- faq:            { "items": [ { "q": string, "a": string } ] }
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
- Blok :root SUDAH diberikan di pesan (PALET WARNA) — SALIN persis ke dalam <style> Anda, JANGAN ubah nilainya. Semua warna (--bg, --surface, --text, --brand, --on-brand, --brand-tint-bg, dll.) sudah harmonis terhadap Warna Brand.
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
  :focus-visible{outline:3px solid var(--brand);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
- JANGAN tulis nilai warna literal; selalu pakai token (termasuk --on-brand untuk teks di atas tombol brand).

=== STRUKTUR & RHYTHM VISUAL ===
- Hero = section dengan headline kuat, subheadline jelas, 1 CTA primer besar.
- Section BERGANTIAN antara .section dan .section.tint untuk irama visual; .section.cta untuk Final CTA.
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
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:var(--container);margin:0 auto;padding:0 1.1rem}
.section{padding:clamp(3rem,7vw,5.5rem) 0}
.section.tint{--bg:var(--brand-tint-bg);--surface:var(--brand-tint-surface);background:var(--bg)}
.section.cta{background:linear-gradient(135deg,var(--brand),var(--brand-ink));color:var(--on-brand)}
.section.cta .lead{color:var(--on-brand);opacity:.88}
h1,h2,h3{line-height:1.1;letter-spacing:-.02em;font-weight:800}
.hero h1{font-size:clamp(2.2rem,6vw,4rem)}
.section h2{font-size:clamp(1.6rem,3.4vw,2.4rem);margin-bottom:.6rem}
.lead{font-size:clamp(1rem,1.6vw,1.2rem);color:var(--muted);max-width:60ch}
.center{text-align:center}
.btn{display:inline-block;background:linear-gradient(135deg,var(--brand),var(--brand-ink));color:var(--on-brand);padding:.95rem 1.6rem;border-radius:999px;font-weight:700;text-decoration:none;box-shadow:0 10px 30px var(--brand-soft);transition:transform .2s,box-shadow .2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 16px 40px var(--brand-soft)}
.btn-secondary{display:inline-block;border:1px solid var(--border);color:var(--text);padding:.95rem 1.6rem;border-radius:999px;font-weight:600;text-decoration:none;transition:background .2s}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:clamp(1.1rem,2.5vw,1.6rem);box-shadow:var(--shadow);transition:transform .2s}
.card:hover{transform:translateY(-4px)}
.card h3{margin-bottom:.4rem;font-size:1.15rem}
.grid{display:grid;gap:1.1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.badges{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center}
.badge{display:inline-flex;align-items:center;gap:.4rem;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:.5rem 1rem;font-size:.9rem;color:var(--muted)}
.avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--brand-ink));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
.quote{font-size:1.05rem}
.result{color:var(--brand);font-weight:700}
.pill{display:inline-block;background:var(--brand-soft);color:var(--brand-ink);border-radius:999px;padding:.25rem .8rem;font-size:.8rem;font-weight:600}
.field{margin-bottom:1rem}
.field label{display:block;font-size:.85rem;color:var(--muted);margin-bottom:.35rem}
.input,input[type=text],input[type=email],textarea,select{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:.8rem 1rem;color:var(--text);font:inherit}
.faq-item{border:1px solid var(--border);border-radius:12px;margin-bottom:.6rem;overflow:hidden}
.faq-q{width:100%;text-align:left;background:var(--surface);color:var(--text);padding:1rem 1.2rem;font-weight:600;border:0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font:inherit}
.faq-q .ic{transition:transform .3s}
.faq-q[aria-expanded=true] .ic{transform:rotate(45deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease;padding:0 1.2rem;color:var(--muted)}
.faq-a.open{max-height:500px;padding:.2rem 1.2rem 1rem}
.stickybar{position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-top:1px solid var(--border);padding:.8rem 1rem;display:flex;gap:.8rem;align-items:center;justify-content:center;z-index:50;backdrop-filter:blur(8px)}
.floating-cta{position:fixed;right:1rem;bottom:1rem;z-index:50}
.countdown{font-variant-numeric:tabular-nums;font-weight:700;color:var(--brand)}
:focus-visible{outline:3px solid var(--brand);outline-offset:2px}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.reveal.is-visible{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
</style>
</head>
<body>
<!--SECTIONS-->
<script>
document.querySelectorAll('.faq-q').forEach(function(b){b.addEventListener('click',function(){var a=b.nextElementSibling;var open=a.classList.contains('open');a.classList.toggle('open');b.setAttribute('aria-expanded',String(!open));});});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
</script>
</body>
</html>`;
}

export const DEVELOPER_SECTION_SYSTEM = `Anda adalah Senior Frontend Engineer. Hasilkan HANYA SATU fragment HTML untuk SATU section landing page yang style-nya SUDAH didefinisikan di <style> halaman (token & kelas utilitas sudah ada). JANGAN tulis <html>, <head>, <style>, <script>, atau komentar HTML.

ATURAN KETAT:
- Output HANYA elemen <section class="section ...">...</section>. Pengecualian: footer → <footer class="section ...">...</footer>; stickyBar/floatingCta → <div class="stickybar"> / <div class="floating-cta">.
- GUNAKAN HANYA kelas berikut (JANGAN buat class/style baru, JANGAN inline style):
  .wrap .section .section.tint .section.cta .hero .center .lead .btn .btn-secondary .card .grid .badges .badge .avatar .quote .result .pill .field .input .faq-item .faq-q .faq-a .stickybar .floating-cta .countdown .reveal
- Warna & permukaan HANYA lewat token: var(--brand), var(--brand-ink), var(--brand-soft), var(--on-brand), var(--brand-tint-bg), var(--brand-tint-surface), var(--surface), var(--border), var(--text), var(--muted). JANGAN tulis nilai warna literal.
- Isi WAJIB diambil PERSIS dari COPY yang diberikan (jangan invent teks). Footer: sertakan copyright + links.
- Tambahkan class "reveal" pada section agar animasi halus. FAQ: struktur .faq-item > button.faq-q[aria-expanded] + div.faq-a.
- Beri irama visual: gunakan .section dan .section.tint secara BERGANTIAN antar section (mis. hero=.section, lalu benefits=.section.tint, socialProof=.section, dst). .section.cta untuk Final CTA.
- Fragment PADAT & RINGKAS; SELALU tutup semua tag yang dibuka.
- HANYA keluarkan fragment HTML murni (tanpa code fence, tanpa penjelasan).`;

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
  return `BRIEF KAMPANYE:
- Produk / Penawaran: ${b.product}
- Target Audiens: ${b.audience}
- Lead Magnet (imbalan): ${b.leadMagnet}
- Pain Point Utama Audiens: ${b.painPoint}
- Sumber Traffic: ${b.trafficSource || "campaign umum"}
- Warna Brand (aksen): ${b.brandColor || "#2563eb"}`;
}

/**
 * Dua angle berbeda untuk A/B test. Copywriter dijalankan 2x (sekali per
 * angle) sehingga menghasilkan 2 varian copy dengan nuansa berbeda.
 */
export const AB_ANGLE_A =
  "Tekankan rasa kehilangan & urgensi (loss aversion / fear): gambarkan sakitnya masalah bila TIDAK diatasi, gunakan kata yang memicu tindakan cepat.";
export const AB_ANGLE_B =
  "Tekankan hasil, impian & aspirasi (gain / aspiration): gambarkan transformasi & keuntungan yang didapat, gunakan nada positif & inspiratif.";
