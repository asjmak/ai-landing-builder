# CONTINUATION.md — AI Landing Page Builder

Dokumen serah-terima agar sesi chat berikutnya bisa melanjutkan tanpa menjelaskan dari nol.
Selalu baca file ini dulu saat melanjutkan.

## Apa ini?
Proyek Next.js 14 (App Router + Tailwind) di `C:\Users\cox\ZCodeProject\ai-landing-builder`.
Fungsi: dari brief singkat (produk, audience, traffic source, lead magnet, pain point, brand color, model AI)
menghasilkan landing page modular berkonversi tinggi lewat pipeline AI:
**Strategist → Copywriter → Developer (render HTML)**.
Fitur: A/B test, analisis audience (RankedPicker), Template Library, simpan/muat riwayat kampanye
(`data/campaigns.json`), dan pemilih tema (9 tema).

## Cara menjalankan (setiap sesi baru — server TIDAK persist)
```
cd C:\Users\cox\ZCodeProject\ai-landing-builder
npm run dev        # jalan di port 3100 (lihat package.json: "dev": "next dev -p 3100")
```
Buka http://localhost:3100/ .
CATATAN: port 3000 dipakai proyek LAIN (`dynamic-content-template-engine`) — jangan tertukar.

Butuh API key AI untuk benar-benar generate:
- Set `AI_API_KEY` di `.env.local` (contoh di `.env.local.example`), atau
- Tempel langsung di field "OpenRouter API Key" di form (dikirim ke API).
Gateway default OpenRouter; bisa diganti 9Router via env `AI_BASE_URL`.

## Yang SUDAH dikerjakan (sesi sebelumnya)
1. Restart web server (matikan tree npm di 3100, nyalakan ulang).
2. `app/page.tsx` asli TERBENTUK TERPUTUS (blok `return`/UI hilang, tidak ada backup di disk).
   Dibangun ulang LENGKAP: semua handler + UI (Brief form, Analisis AI, Generate, tab
   Preview/Modules/JSON, A/B, modal Template & Riwayat). Diperbaiki `handleLoad`/`handleDelete`
   yang tadinya punya fetch URL kosong (`fetch()` / `fetch(, …)`).
3. Perbaiki UI (keterbacaan: label di atas input, kontras; estetika: header gradien, kartu, dll).
4. Tambah pemilih tema (tombol 🎨 di header) dengan 9 tema via CSS variable:
   dark, light, sepia, ocean, midnight, forest, rose, sunset, cyber.
   Token di `app/globals.css` (`--bg`, `--surface`, `--border`, `--text*`, `--accent`, `--glow`, dll).
   Aksen (tombol utama, ikon ◆/✸, focus ring, tab aktif, switch, ring pilihan) ikut tema
   via `--accent`. Pilihan tersimpan di `localStorage` key `alb-theme`.
5. `lib/prompts.ts`: `DEVELOPER_SYSTEM` dibuat LEBIH RINGKAS (hemat token) + WAJIB menyertakan
   section Footer (copyright + links) sebagai section TERAKHIR + SELALU tutup dengan `</html>`.
6. `lib/pipeline.ts`: `runDeveloper` dapat GUARD TRUNCATI — bila HTML hasil tidak diakhiri
   `</html>`, otomatis RETRY sekali dengan instruksi "lebih ringkas + sertakan footer + tutup
   </html>". (Akar masalah footer hilang = model Developer gratis kehabisan kuota token.)
7. `components/ModelSelector.tsx`: tambah 3 model gratis
   (`google/gemma-4-26b-a4b-it:free`, `google/gemma-4-31b-it:free`,
   `nvidia/nemotron-3-super-120b-a12b:free`) → total 7. `DEVELOPER_DEFAULT` diubah ke
   `nvidia/nemotron-3-super-120b-a12b:free` (paling besar, kurangi truncasi).
8. `components/ModuleToggles.tsx` & `components/RankedPicker.tsx` disesuaikan ke tema aksen.

## Status sekarang
- Server jalan (HTTP 200), `tsc --noEmit` bersih (exit 0), dan `next build` lolos type-check.
- 10 tema (dark, light, sepia, ocean, midnight, forest, rose, sunset, cyber, **auto**) + 7 model gratis aktif.
- Perbaikan footer/truncasi SUDAH di kode (dari sesi lalu), BELUM divalidasi end-to-end.
- **Security**: `apiKey` sudah TIDAK lagi lewat URL query. Route `generate`/`ab` diubah GET→POST
  (baca `req.json()`), dan `handleGenerate` di `app/page.tsx` diganti dari `EventSource` (GET) ke
  `fetch` POST + baca `ReadableStream` (parsing SSE manual). `apiKey` kini di POST body.
- Artefak sisa `write_page.py` & `UserscoxZCodeProjectai-landing-builderapppage.tsx` SUDAH dihapus.
- `.env.local` SUDAH dibuat dari `.env.local.example` (isi placeholder `sk-or-xxx` — wajib diganti
  key nyata agar generate jalan tanpa isi key di form).
- Fix tipe: `lib/pipeline.ts` variabel `messages` dianotasi `ChatMessage[]` agar `next build` lolos.

## Open items / saran lanjutan
- [ ] Generate ulang "madu hutan" (atau buat baru) untuk memvalidasi footer & section lengkap muncul
      end-to-end. Butuh `AI_API_KEY` nyata di `.env.local` (atau tempel di form).
- [x] (Security) `apiKey` dipindah ke POST body — SELESAI (route generate/ab POST + handler fetch streaming).
- [x] Hapus artefak sisa `write_page.py` & `Userscox...page.tsx` — SELESAI.
- [x] Buat `.env.local` dari contoh — SELESAI.
- [x] Tema "Auto" (ikuti preferensi OS via `prefers-color-scheme`) — SELESAI.

## File kunci
- app/page.tsx            — UI utama, state, handlers, logika tema
- app/globals.css         — token tema (--bg, --surface, --accent, --glow, dll)
- components/ModelSelector.tsx — daftar FREE_MODELS + DEFAULT_PAID_MODEL + *DEFAULT
- components/ModuleToggles.tsx, components/RankedPicker.tsx, components/LandingPreview.tsx, components/JsonBlock.tsx
- lib/prompts.ts          — prompt Strategist/Copywriter/Developer/Analyzer + MODULE_CATALOG
- lib/pipeline.ts         — orchestrasi generate/ab/render + guard truncasi
- lib/types.ts, lib/store.ts (simpan kampanye ke data/campaigns.json), lib/templates.ts (TemplatePreset), lib/openrouter.ts (gateway client)
- data/campaigns.json     — riwayat kampanye tersimpan

## Log sesi 2026-07-12 (lanjutan ke-2)
Fokus: tingkatkan kualitas visual + efektivitas tanpa tambah model baru.
- [x] **Upgrade design system** `DEVELOPER_SYSTEM` (`lib/prompts.ts`):
  - CSS sekarang 100% self-contained (TIDAK ADA CDN/font/gambar eksternal; system font stack).
  - Pakai SATU blok `<style>` + CSS variables + kelas utilitas (bukan inline style) → markup
    lebih pendek & konsisten (juga membantu guard truncasi model gratis).
  - Token: `--brand` dari BRAND COLOR + `color-mix` untuk --brand-ink/--brand-soft; radii, shadow,
    container terpusat.
  - Tipografi fluid (`clamp`), ritme section gelap/terang, komponen .btn/.card/.grid/.wrap/.section,
    reveal-on-scroll via IntersectionObserver.
  - Aksesibilitas: `lang="id"`, :focus-visible, `@media (prefers-reduced-motion:reduce)`,
    SVG `aria-hidden`, kontras AA.
  - Konversi: 1 CTA utama/section, trust badges dekat form, testimoni avatar inisial, FAQ accordion
    custom (bukan `<details>`), finalCta band gelap, stickyBar/floatingCta aksesibel.
  - Aturan wajib footer TERAKHIR + tutup `</body></html>` & efisiensi (tanpa komentar/whitespace berlebih)
    dipertahankan. `tsc` bersih, server 200.
- Belum divalidasi end-to-end (butuh API key nyata untuk benar-benar Generate).
- Ide ditolak/ ditunda: Tambah model image/video/suara/embedding BELUM dilakukan — disepakati tidak
  perlu untuk core goal; image gen jadi kandidat Fase 2 bila diinginkan.

## Log sesi 2026-07-12 (lanjutan ke-3)
Fokus: fitur EDIT landing page yang sudah di-generate (request user).
- [x] **Editor konten terstruktur** — `components/CopyEditor.tsx` (baru) + tab ke-4 "Edit" di `app/page.tsx`.
  - Mengedit `content` tiap module via field ramah (teks/textarea/angka + list string & list objek dgn
    tambah/hapus), terikat ke state `copy`. Skema per-module ada di `COPY_SCHEMA` dalam komponen.
  - Hanya menampilkan module yang statusnya "on" (filter `statuses`) agar tidak mengedit section tersembunyi.
  - Setelah edit, user menekan tombol **"Render HTML"** (sudah ada, panggil `/api/render`) → HTML dibangun
    ulang dari `copy` yang disunting. Single source of truth tetap di data terstruktur (bukan HTML mentah),
    sehingga pipeline AI bisa di-regenerate tanpa kehilangan suntingan.
  - `handleSave` sudah menyimpan `copy`+`html` → editan ter-persist ke `data/campaigns.json`.
- Catatan: di mode A/B, editor menyunting copy varian yang sedang aktif (A/B). Validasi end-to-end butuh
  API key nyata (Generate dulu, lalu Edit → Render).
- Belum ditambah: mode "HTML Mentah" (textarea escape hatch) & WYSIWYG drag-drop — ditunda per keputusan
  sesi sebelumnya.

## Log sesi 2026-07-12 (lanjutan ke-4)
Fokus: generate bertahap (modular) agar context/output tidak terpotong pada model kecil/gratis.
- [x] **Mode Modular** (anti-truncasi): HTML di-generate PER-SECTION bukan sekali jadi.
  - `lib/prompts.ts`: `buildShell(brand)` → shell HTML statis (<head> + `<style>` token & kelas
    utilitas + `<script>` FAQ/reveal + marker `<!--SECTIONS-->`). `DEVELOPER_SECTION_SYSTEM` → instruksi
    keluarkan HANYA fragment `<section>` pakai kelas bersama (token `--brand`), tanpa head/style.
  - `lib/pipeline.ts`: `runDeveloper` bercabang `if (params.modular) return runDeveloperModular(...)`.
    `runDeveloperModular` menyusun urutan module (katalog, filter "on", **footer terakhir**) lalu per
    module memanggil `generateSection` (1 call kecil, guard retry bila fragment <30 char). Hasil
    di-`replace` ke marker shell → `</body></html>`. Tiap section log "   • <nama>…".
  - `generateLandingPage`/`generateAB`/`renderLandingPage` meneruskan `modular` + `onLog`.
  - `CampaignBrief` (`lib/types.ts`) + route `generate`/`ab`/`render` teruskan `body.modular`.
- [x] **UI toggle**: checkbox "Generate Modular (per-section)" di `app/page.tsx`. Default nyala bila
  `modelDeveloper` gratis (`isFreeModel` di `components/ModelSelector.tsx`); ganti model Dev → auto-set
  `modular`. Single-shot tetap ada untuk model besar (matikan toggle).
- Verifikasi: `tsc` bersih (exit 0), server HTTP 200, route generate/render respons tanpa crash
  (dengan/tanpa field `modular`). Validasi hasil riil (fragment konsisten & footer lengkap) butuh API key.
- Catatan: shell CSS adalah realisasi design system (sama dgn DEVELOPER_SYSTEM) → fragment otomatis
  seragam walau dari call berbeda. Latensi naik (banyak call) tapi truncasi turun drastis; log per-section
  sudah di-stream.
- [x] **VERIFIKASI END-TO-END (2026-07-12)**: Generate nyata mode Modular via `/api/generate` (key dari
  `.env.local`, brief "Madu Hutan", dev model `nvidia/nemotron-3-super-120b-a12b:free`). Hasil: 1 event
  `done` + 16 `log` per-section (Hero→…→Footer), HTML ~11.5KB, diakhiri `</html>`, marker terganti,
  `<html>`/`<style>` tepat 1, footer di posisi terakhir, brand `#16a34a` diterapkan, fragment pakai kelas
  bersama (.btn/.card/.grid/.faq-q/.stickybar) → konsisten & tidak ter-truncate. Fitur modular TERBUKTI
  jalan.

## Log sesi 2026-07-12 (lanjutan ke-5)
Fokus: kombinasi warna harmonis OTOMATIS dari "Warna Brand" (request user — halaman "Atasan Batik Wanita"
terlihat jelek karena token warna di-hardcode).
- [x] **Turunan palet adaptif** — `lib/palette.ts` baru: `paletteToCssVars(brand)` & `palettePreview(brand)`.
  - Hitung luminansitas brand → pilih base **terang** (brand gelap: merah/ungu/biru) atau **gelap**
    (brand terang: kuning/pastel) agar kontras nyaman & brand tetap "pop".
  - Derivasi `--brand-ink` (hover/gradien lebih dalam), `--brand-soft` (chip/badge), `--on-brand`
    (warna teks DI ATAS tombol brand — putih/hitam menyesuaikan kontras), `--brand-tint-bg` /
    `--brand-tint-surface` (section background bernuansa brand untuk ritme visual).
- [x] Terapkan ke **mode Modular**: `buildShell(brand)` pakai `paletteToCssVars` untuk `:root`; ganti
  `.section.light`/`.section.dark` → **`.section.tint`** (background bernuansa brand); `.btn` & `.section.cta`
  pakai `var(--on-brand)`.
- [x] Terapkan ke **mode single-shot**: `DEVELOPER_SYSTEM` disuruh salin blok `:root` (PALET WARNA) yang
  diinjeksikan ke `userMsg` `runDeveloper` (`paletteToCssVars`), pakai `.section.tint` + token `--on-brand`.
  `DEVELOPER_SECTION_SYSTEM` & `generateSection` (list kelas) diupdate ke `.section.tint` + `--on-brand`.
- [x] **UI preview palet**: di samping input Warna Brand, tampil swatch Bg/Surface/Text/Brand/On-Brand
  (pakai `palettePreview`) agar user lihat kombinasi sebelum generate.
- Verifikasi: `tsc` bersih. Logic palet diuji langsung (compile + run): merah→bg terang & on-brand putih;
  kuning→bg gelap & on-brand hitam; buildShell pakai `.section.tint` & `var(--on-brand)`. Generate nyata
  merah sempat jalan (3 section pertama sukses pakai shell baru) lalu stall karena model gratis melambat
  (bukan bug kode).

## Log sesi 2026-07-12 (lanjutan ke-6) — Sistem warna "color roles" + AI pilih hue
Fokus: realisasi ide user — warna landing page dihasilkan dari sistem peran warna
(color roles), bukan acak; AI hanya memilih HUE bila user tak memberi brand color.

- [x] **`lib/palette.ts` ditulis ulang** → sistem token peran berbasis OKLCH (deterministik):
  - Skala **Primary 50–900** dari hue brand (L/C bervariasi, hue tetap); `--brand` =
    `--primary-600` (warna brand dihormati persis sebagai aksen).
  - Skala **Neutral 50–950** achromatic (C=0) → warna DOMINAN halaman (~80%):
    `--background/--surface/--surface-variant/--border/--text-*`.
  - **Color roles**: `--link`, `--focus-ring`, `--on-primary`, `--brand-tint-bg/surface`.
  - **Warna semantik** konvensional & TAK ikut brand: `--success/--warning/--error/--info`
    (+ `*-soft` & `on-*`).
  - `--on-primary` otomatis (kontras WCAG): teks terang di brand gelap, sebaliknya.
  - Dukungan **light + dark** via `@media (prefers-color-scheme: dark)`.
  - `paletteToCssVars()` (untuk shell & injeksi prompt) + `palettePreview()` (swatch UI)
    dibangun dari `computePalette()` yang sama → konsisten.
- [x] **`lib/prompts.ts`**:
  - `buildShell` (mode Modular) pakai token baru: netral dominant, brand hanya aksen
    (CTA/link/highlight), semantic classes (`.badge.success/.info/.warning/.error`,
    `.text-*`, `.note`), `:focus-visible` → `var(--focus-ring)`.
  - `DEVELOPER_SYSTEM` & `DEVELOPER_SECTION_SYSTEM` diperbarui: filosofi color-roles,
    daftar kelas & token baru, ritme "netral dominan, brand aksen".
  - **STRATEGIST_SYSTEM** kini mengembalikan `brandColor` (hex): bila user TIDAK memberi
    warna, AI memilih hue terbaik; bila user memberi, dipertahankan.
  - `buildBriefText` instruksikan Strategist memilih bila kosong.
- [x] **`lib/pipeline.ts`**: `resolveBrand(brief, strategy)` — prioritas user → saran AI →
  default. Dipakai di `generateLandingPage` & `generateAB` (single-shot & modular).
- [x] **`lib/types.ts`**: `StrategyOutput.brandColor?` ditambahkan.
- [x] **`app/page.tsx`**: setelah generate, `form.brandColor` diset dari saran AI
  (termasuk A/B) → swatch & render berikutnya konsisten.
- Verifikasi: `tsc --noEmit` bersih; `next build` lolos (9 halaman); runtime test
  `computePalette`/`paletteToCssVars`/`buildShell` untuk 6 brand (biru/merah/kuning/
  hijau/ungu/navy) → semua hex valid, `--primary-600`==brand, neutral achromatic,
  `on-primary` kontras benar, CSS berisi `:root`+ dark media + semantic + focus-ring.
- Catatan: file `lib/prompts.ts` sempat gagal parse (TS1128) gara-gara ternary bersarang
  ber-emoji `—`/`&` di `buildBriefText`; diperbaiki dengan memindahkan fallback ke variabel
  `brandNote` (tanpa karakter khusus).
