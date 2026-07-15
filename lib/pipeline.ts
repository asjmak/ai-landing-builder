import { chatCompletion } from "./openrouter";
import {
  STRATEGIST_SYSTEM,
  COPYWRITER_SYSTEM,
  DEVELOPER_SYSTEM,
  DEVELOPER_SECTION_SYSTEM,
  ANALYZER_SYSTEM,
  AB_ANGLE_A,
  AB_ANGLE_B,
  buildBriefText,
  buildInferText,
  buildShell,
  MODULE_CATALOG,
} from "./prompts";
import { paletteToCssVars } from "./palette";
import type { AnalysisResult, AbResult } from "./types";
import type {
  StrategyOutput,
  CopyOutput,
  StatusMap,
  CampaignBrief,
  GenerateResult,
} from "./types";

/** Hilangkan code fence ```html ... ``` bila model membungkusnya. */
function stripCodeFence(s: string): string {
  const m = s.match(/```(?:html)?\s*([\s\S]*?)```/i);
  return (m ? m[1] : s).trim();
}

/**
 * Analyzer — menghasilkan BEBERAPA opsi TER-RANKING untuk target audiens,
 * pain point, dan saran lead magnet HANYA dari produk. User memilih satu
 * per dimensi (kartu ber-gradasi) sebelum generate landing page.
 */
export async function analyzeAudience(params: {
  product: string;
  trafficSource?: string;
  leadMagnet?: string;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}): Promise<AnalysisResult> {
  return chatCompletion({
    model: params.model,
    apiKey: params.apiKey,
    baseUrl: params.baseUrl,
    jsonMode: true,
    temperature: 0.7,
    messages: [
      { role: "system", content: ANALYZER_SYSTEM },
      { role: "user", content: buildInferText(params.product, params.trafficSource) },
    ],
  });
}

/** Tahap 1: Strategist — menghasilkan strategi + rekomendasi module on/off. */
export async function runStrategist(brief: CampaignBrief): Promise<StrategyOutput> {
  return chatCompletion({
    model: brief.modelStrategist,
    apiKey: brief.apiKey,
    baseUrl: brief.baseUrl,
    jsonMode: true,
    temperature: 0.6,
    messages: [
      { role: "system", content: STRATEGIST_SYSTEM },
      { role: "user", content: buildBriefText(brief) },
    ],
  });
}

/** Tahap 2: Copywriter — menulis copy per module dari strategi. */
export async function runCopywriter(
  brief: CampaignBrief,
  strategy: StrategyOutput,
  angle?: string,
): Promise<CopyOutput> {
  const base = `${buildBriefText(brief)}\n\nSTRATEGI:\n${JSON.stringify(strategy)}`;
  const userContent = angle
    ? `${base}\n\nINSTRUKSI ANGLE VARIAN:\n${angle}\nBuat SELURUH copy mengikuti angle ini secara konsisten (headline, sub-headline, CTA, framing testimoni, dll).`
    : base;
  return chatCompletion({
    model: brief.modelStrategist,
    apiKey: brief.apiKey,
    baseUrl: brief.baseUrl,
    jsonMode: true,
    temperature: 0.85,
    messages: [
      { role: "system", content: COPYWRITER_SYSTEM },
      { role: "user", content: userContent },
    ],
  });
}

/** Tahap 3: Developer — merakit HTML final hanya dari module yang "on". */
export async function runDeveloper(params: {
  strategy: StrategyOutput;
  copy: CopyOutput;
  statuses: StatusMap;
  brandColor?: string;
  modelDeveloper: string;
  apiKey?: string;
  baseUrl?: string;
  modular?: boolean;
  badgeStyle?: string;
  heroStyle?: string;
  onLog?: (m: string) => void;
}): Promise<string> {
  if (params.modular) return runDeveloperModular(params);

  const userMsg = [
    `STRATEGY:\n${JSON.stringify(params.strategy)}`,
    `COPY:\n${JSON.stringify(params.copy)}`,
    `STATUSES (override user):\n${JSON.stringify(params.statuses)}`,
    `BRAND COLOR: ${params.brandColor || "#2563eb"}`,
    params.badgeStyle ? `BADGE_STYLE: ${params.badgeStyle}` : "",
    params.heroStyle ? `HERO_STYLE: ${params.heroStyle}` : "",
    `PALET WARNA (salin ke :root di <style> Anda, JANGAN ubah):\n${paletteToCssVars(params.brandColor || "#2563eb")}`,
  ].filter(Boolean).join("\n\n");

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: DEVELOPER_SYSTEM },
    { role: "user", content: userMsg },
  ];

  let html = stripCodeFence(
    await chatCompletion({
      model: params.modelDeveloper,
      apiKey: params.apiKey,
      baseUrl: params.baseUrl,
      jsonMode: false,
      temperature: 0.4,
      messages,
    }),
  );

  // Guard truncasi: model gratis sering kehabisan kuota token & memotong
  // HTML di tengah jalan (footer/FAQ/Final CTA hilang). Bila output tidak
  // diakhiri </html>, coba sekali lagi dengan instruksi lebih ringkas &
  // perintah eksplisit menyertakan footer lalu menutup dokumen.
  if (!html.toLowerCase().includes("</html>")) {
    const retryMsg = `${userMsg}

PERHATIAN: output sebelumnya TERpotong. Hasilkan ULANG SELURUH dokumen HTML secara LEBIH RINGKAS (whitespace & komentar minimal, section padat) NAMUN LENGKAP: SELALU sertakan section Footer (copyright + links) sebagai section TERAKHIR dan TUTUP dengan </body></html>.`;
    const html2 = stripCodeFence(
      await chatCompletion({
        model: params.modelDeveloper,
        apiKey: params.apiKey,
        baseUrl: params.baseUrl,
        jsonMode: false,
        temperature: 0.4,
        messages: [{ role: "system", content: DEVELOPER_SYSTEM }, { role: "user", content: retryMsg }],
      }),
    );
    if (html2.toLowerCase().includes("</html>")) html = html2;
  }

  return html;
}

/**
 * runDeveloperModular — generate HTML secara bertahap (per-section) untuk
 * menghindari pemotongan output pada model dengan context/output terbatas.
 * Tiap section dihasilkan oleh 1 call kecil yang hanya mengembalikan fragment
 * <section>, lalu disisipkan ke shell HTML statis (buildShell).
 */
async function runDeveloperModular(
  params: {
    strategy: StrategyOutput;
    copy: CopyOutput;
    statuses: StatusMap;
    brandColor?: string;
    modelDeveloper: string;
    apiKey?: string;
    baseUrl?: string;
    badgeStyle?: string;
    heroStyle?: string;
    onLog?: (m: string) => void;
  },
): Promise<string> {
  const brand = params.brandColor || "#2563eb";
  const shell = buildShell(brand);

  // Urutan module: ikuti urutan katalog, filter yang "on" & ada di copy,
  // pastikan footer menjadi section terakhir.
  const onIds = new Set(
    params.strategy.modules
      .filter((m) => params.statuses[m.id] !== "off")
      .map((m) => m.id),
  );
  let orderedIds = MODULE_CATALOG.map((m) => m.id).filter(
    (id) => onIds.has(id) && params.copy.modules.some((c) => c.id === id),
  );
  if (orderedIds.includes("footer")) {
    orderedIds = [...orderedIds.filter((i) => i !== "footer"), "footer"];
  }

  const nameOf = (id: string) => MODULE_CATALOG.find((m) => m.id === id)?.name ?? id;
  let body = "";
  for (const id of orderedIds) {
    const content = params.copy.modules.find((c) => c.id === id)?.content ?? {};
    params.onLog?.(`   • ${nameOf(id)}…`);
    body += await generateSection(id, content, brand, params);
  }

  return shell.replace("<!--SECTIONS-->", body);
}

/** Hasilkan SATU fragment section untuk module tertentu (dengan guard retry). */
async function generateSection(
  moduleId: string,
  content: Record<string, any>,
  brand: string,
  params: { modelDeveloper: string; apiKey?: string; baseUrl?: string; badgeStyle?: string; heroStyle?: string },
): Promise<string> {
  const lines = [
    `MODULE: ${moduleId}`,
    `BRAND COLOR: ${brand}`,
    `COPY (isi untuk module ini):\n${JSON.stringify(content)}`,
  ];
  if (moduleId === "trustBadges" && params.badgeStyle) {
    lines.push(`BADGE_STYLE: ${params.badgeStyle}`);
  }
  if (moduleId === "hero" && params.heroStyle) {
    lines.push(`HERO_STYLE: ${params.heroStyle}`);
  }
  // Pass style overrides from _styles in content
  if (content._styles && Object.keys(content._styles).length > 0) {
    lines.push(`STYLE_OVERRIDES:\n${JSON.stringify(content._styles, null, 2)}`);
  }
  // Pass section style overrides
  if (content._sectionStyle && Object.keys(content._sectionStyle).length > 0) {
    lines.push(`SECTION_STYLE:\n${JSON.stringify(content._sectionStyle, null, 2)}`);
  }
  // Pass image URL if present
  if (content.imageUrl) {
    lines.push(`IMAGE_URL: ${content.imageUrl}`);
  }
  lines.push(`KELAS TERSEDIA: .wrap .section .section.tint .section.cta .hero .center .lead .btn .btn-secondary .card .grid .badges .badge .avatar .quote .result .pill .field .input .faq-item .faq-q .faq-a .stickybar .floating-cta .countdown .reveal .badge-grid .badge-card .badge-icon .badge-stats .badge-stat .stat-num .stat-label .stat-sub .badge-strip .badge-strip-item .badge-gradient .badge-gcard`);
  const userMsg = lines.join("\n\n");

  const call = (extra?: string) =>
    chatCompletion({
      model: params.modelDeveloper,
      apiKey: params.apiKey,
      baseUrl: params.baseUrl,
      jsonMode: false,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: DEVELOPER_SECTION_SYSTEM + (extra ? `\n\n${extra}` : ""),
        },
        { role: "user", content: userMsg },
      ],
    });

  let frag = stripCodeFence(await call());
  if (!frag || frag.trim().length < 30) {
    frag = stripCodeFence(
      await call(
        "PERHATIAN: output sebelumnya terlalu pendek/tidak valid. Hasilkan ULANG section yang LENGKAP & VALID untuk module ini, tetap hanya fragment HTML.",
      ),
    );
  }
  return frag.trim();
}

/**
 * Resolusi warna brand akhir: prioritas (1) input user, (2) saran AI dari
 * Strategist (bila user tak memberi), (3) default. AI hanya memilih HUE bila
 * kosong; seluruh skala warnanya tetap dihitung deterministik di palette.ts.
 */
function resolveBrand(b: CampaignBrief, s?: StrategyOutput): string {
  const fromBrief = (b.brandColor || "").trim();
  if (fromBrief) return fromBrief;
  const fromStrategy = (s?.brandColor || "").trim();
  if (fromStrategy) return fromStrategy;
  return "#2563eb";
}

/**
 * generateLandingPage — menjalankan ketiga tahap berurutan.
 * Mengembalikan strategy, copy, status default, dan HTML final.
 */
export async function generateLandingPage(
  brief: CampaignBrief,
  onLog?: (message: string) => void,
): Promise<GenerateResult> {
  onLog?.("① Strategist — menyusun strategi & rekomendasi module…");
  const strategy = await runStrategist(brief);
  onLog?.("✓ Strategi & module selesai");

  onLog?.("② Copywriter — menulis copy tiap module…");
  const copy = await runCopywriter(brief, strategy);
  onLog?.("✓ Copy selesai");

  const statuses: StatusMap = {};
  for (const m of strategy.modules) {
    statuses[m.id] = m.recommendedStatus;
  }

  onLog?.("③ Developer — merakit HTML final…");
  // Resolve heroStyle: user override > strategy recommendation > "modern" default
  const resolvedHeroStyle = brief.heroStyle && brief.heroStyle !== "auto"
    ? brief.heroStyle
    : (strategy.heroStyle || "modern");
  const html = await runDeveloper({
    strategy,
    copy,
    statuses,
    brandColor: resolveBrand(brief, strategy),
    modelDeveloper: brief.modelDeveloper,
    apiKey: brief.apiKey,
    baseUrl: brief.baseUrl,
    modular: brief.modular,
    badgeStyle: brief.badgeStyle,
    heroStyle: resolvedHeroStyle,
    onLog,
  });
  onLog?.("✓ HTML landing page siap");

  return { strategy, copy, statuses, html };
}

/**
 * generateAB — A/B test: 1 Strategist (strategi & module bersama), lalu
 * 2x Copywriter dengan angle berbeda (A = loss aversion, B = aspiration),
 * lalu 2x Developer. Menghasilkan 2 varian landing page untuk dibandingkan.
 */
export async function generateAB(
  brief: CampaignBrief,
  onLog?: (message: string) => void,
): Promise<AbResult> {
  onLog?.("① Strategist — menyusun strategi & module bersama…");
  const strategy = await runStrategist(brief);
  onLog?.("✓ Strategi selesai");

  const statuses: StatusMap = {};
  for (const m of strategy.modules) {
    statuses[m.id] = m.recommendedStatus;
  }

  onLog?.("② Copywriter ×2 — angle A (fear) & B (gain) paralel…");
  const [copyA, copyB] = await Promise.all([
    runCopywriter(brief, strategy, AB_ANGLE_A),
    runCopywriter(brief, strategy, AB_ANGLE_B),
  ]);
  onLog?.("✓ 2 copy selesai");

  const developerArgs = (copy: CopyOutput) => ({
    strategy,
    copy,
    statuses,
    brandColor: resolveBrand(brief, strategy),
    modelDeveloper: brief.modelDeveloper,
    apiKey: brief.apiKey,
    baseUrl: brief.baseUrl,
    modular: brief.modular,
    onLog,
  });

  onLog?.("③ Developer ×2 — merakit 2 HTML paralel…");
  const [htmlA, htmlB] = await Promise.all([
    runDeveloper(developerArgs(copyA)),
    runDeveloper(developerArgs(copyB)),
  ]);
  onLog?.("✓ 2 HTML landing page siap");

  return {
    strategy,
    a: { copy: copyA, statuses, html: htmlA },
    b: { copy: copyB, statuses, html: htmlB },
  };
}

/**
 * renderLandingPage — hanya menjalankan tahap Developer (cepat).
 * Dipakai ketika user mengubah toggle on/off tanpa regenerate copy.
 */
export async function renderLandingPage(params: {
  strategy: StrategyOutput;
  copy: CopyOutput;
  statuses: StatusMap;
  brandColor?: string;
  modelDeveloper: string;
  apiKey?: string;
  baseUrl?: string;
  modular?: boolean;
  badgeStyle?: string;
  heroStyle?: string;
}): Promise<string> {
  return runDeveloper(params);
}
