# AI Landing Page Builder (Tahap 1)

Generator landing page modular berbasis AI untuk *lead generation*.
Pipeline 3 tahap (Strategist → Copywriter → Developer) dijalankan lewat
gateway yang kompatibel dengan **OpenRouter** maupun **9Router**.

## Fitur Tahap 1
- Input brief kampanye (produk, audiens, lead magnet, pain point, traffic, warna).
- Pemilihan model AI bebas (Claude 3.5 Sonnet, GPT-4o, DeepSeek, Llama, dll).
- Strategi otomatis + rekomendasi module **On/Off** per komponen.
- Komponen modular: core (hero, form, trust, benefits, social proof, FAQ, final CTA, footer)
  dan booster (sticky bar, countdown, exit-intent popup, floating CTA, live activity).
- Preview HTML *real-time* dalam `iframe`.
- Toggle On/Off per module + tombol “Render ulang” tanpa regenerate copy.

## Setup
```bash
cp .env.local.example .env.local   # isi AI_API_KEY (OpenRouter/9Router)
npm install
npm run dev                        # http://localhost:3000
```

### Ganti gateway ke 9Router
Edit `.env.local`:
```
AI_BASE_URL=https://api.9router.com/v1
AI_API_KEY=9r-xxxxxxxx
```

## Cara kerja
1. `app/api/generate` → `lib/pipeline.ts`
   - `runStrategist`  : JSON strategi + status modul.
   - `runCopywriter`  : JSON copy per modul.
   - `runDeveloper`   : HTML final (Tailwind CDN) hanya dari modul “on”.
2. `app/api/render`  → hanya menjalankan `runDeveloper` untuk toggle cepat.

## Roadmap (Tahap 2+)
- A/B test generator (2 variasi headline).
- Export ke HTML mandiri / WordPress Elementor / host subdomain.
- Database penyimpanan template & hasil.
- Model routing per tahap (Strategist=smart, Regenerate=cheap).
