/**
 * Template Library — preset brief siap pakai untuk berbagai niche.
 * Satu klik mengisi form brief agar user tidak mulai dari nol.
 * trafficSource harus persis sama dengan opsi di TRAFFIC (app/page.tsx).
 */

export interface TemplatePreset {
  id: string;
  name: string;
  emoji: string;
  niche: string;
  product: string;
  audience: string;
  leadMagnet: string;
  painPoint: string;
  trafficSource: string;
  brandColor: string;
}

export const TEMPLATES: TemplatePreset[] = [
  {
    id: "kursus-online",
    name: "Kursus Online",
    emoji: "🎓",
    niche: "Edukasi & info produk",
    product: "Kursus Online cara bookingan dari nol",
    audience: "Pemilik UMKM pemula yang ingin punya pemasukan sampingan",
    leadMagnet: "E-book '7 Langkah Memulai Kursus Pertama'",
    painPoint: "Bingung memulai & tidak konsisten mempromosikan",
    trafficSource: "Iklan Berbayar (FB/IG/Google)",
    brandColor: "#2563eb",
  },
  {
    id: "konsultasi-jasa",
    name: "Jasa Konsultasi",
    emoji: "💼",
    niche: "Layanan & konsultasi",
    product: "Jasa konsultasi bisnis & strategi marketing",
    audience: "Pengusaha mikro yang omzetnya mentok di angka tertentu",
    leadMagnet: "Audit gratis 15 menit + checklist pertumbuhan",
    painPoint: "Sudah capek kerja keras tapi omzet stagnant",
    trafficSource: "Konten Organik (TikTok/YouTube/SEO)",
    brandColor: "#059669",
  },
  {
    id: "ecommerce-fisik",
    name: "Produk Fisik / Skincare",
    emoji: "🛍️",
    niche: "E-commerce & DTC",
    product: "Skincare lokal untuk kulit berjerawat",
    audience: "Wanita 20-35 tahun yang peduli perawatan kulit",
    leadMagnet: "Voucher diskon 20% untuk pembelian pertama",
    painPoint: "Sering breakout & tidak percaya produk murah",
    trafficSource: "Iklan Berbayar (FB/IG/Google)",
    brandColor: "#db2777",
  },
  {
    id: "affiliate-review",
    name: "Affiliate / Review",
    emoji: "🔗",
    niche: "Affiliate marketing",
    product: "Program affiliate tools produktivitas",
    audience: "Reviewer & creator pemula yang ingin monetisasi",
    leadMagnet: "Checklist memilih produk affiliate yang laku",
    painPoint: "Tidak tahu cara menjual tanpa terlihat menjual",
    trafficSource: "Konten Organik (TikTok/YouTube/SEO)",
    brandColor: "#7c3aed",
  },
  {
    id: "webinar-event",
    name: "Webinar / Event",
    emoji: "📅",
    niche: "Acara & lead gen",
    product: "Webinar gratis cara scaling bisnis",
    audience: "Profesional yang ingin naik level karier/usaha",
    leadMagnet: "Rekaman + slide presentasi eksklusif",
    painPoint: "Tidak punya waktu ikut kursus panjang",
    trafficSource: "Iklan Berbayar (FB/IG/Google)",
    brandColor: "#d97706",
  },
  {
    id: "real-estate",
    name: "Properti / Investasi",
    emoji: "🏠",
    niche: "Real estate & investasi",
    product: "Konsultasi investasi properti untuk pemula",
    audience: "Karyawan dengan tabungan yang ingin investasi aman",
    leadMagnet: "Kalkulator ROI properti + panduan aman",
    painPoint: "Takut salah beli & kehilangan uang",
    trafficSource: "Konten Organik (TikTok/YouTube/SEO)",
    brandColor: "#0d9488",
  },
  {
    id: "fitness-kesehatan",
    name: "Fitness / Kesehatan",
    emoji: "💪",
    niche: "Kesehatan & gaya hidup",
    product: "Program latihan rumah 15 menit/hari",
    audience: "Orang sibuk yang ingin tubuh lebih sehat",
    leadMagnet: "Meal plan gratis 7 hari",
    painPoint: "Tidak punya waktu ke gym & sering gagal diet",
    trafficSource: "Iklan Berbayar (FB/IG/Google)",
    brandColor: "#dc2626",
  },
  {
    id: "saas-software",
    name: "SaaS / Software",
    emoji: "⚙️",
    niche: "Software & otomasi",
    product: "Tool otomasi social media untuk tim kecil",
    audience: "Founder & marketer startup yang kewalahan",
    leadMagnet: "Trial gratis 14 hari tanpa kartu",
    painPoint: "Kerja manual & lambat sehingga kampanye telat",
    trafficSource: "Iklan Berbayar (FB/IG/Google)",
    brandColor: "#4f46e5",
  },
];
