/**
 * Tipe data untuk pipeline landing page modular.
 * Status "on"/"off" pada tiap module adalah inti dari fitur On/Off.
 */

export type ModuleCategory = "core" | "booster";
export type OnOff = "on" | "off";

/** Katalog module yang dikenali oleh seluruh pipeline (AI & renderer). */
export interface ModuleDef {
  id: string;
  name: string;
  category: ModuleCategory;
}

/** Rekomendasi dari tahap Strategist. */
export interface StrategyModule {
  id: string;
  name: string;
  category: ModuleCategory;
  recommendedStatus: OnOff;
  reason: string;
}

export interface StrategyOutput {
  positioningAngle: string;
  primaryMessage: string;
  toneOfVoice: string;
  trafficNote: string;
  modules: StrategyModule[];
}

/** Konten copy per module (dihasilkan tahap Copywriter). */
export interface ModuleContent {
  id: string;
  content: Record<string, any>;
}

export interface CopyOutput {
  modules: ModuleContent[];
}

export type StatusMap = Record<string, OnOff>;

/** Satu opsi yang di-rank oleh AI (rank 1 = paling disarankan). */
export interface RankedOption {
  rank: number;
  label: string;
  reason?: string;
}

/** Hasil Analyzer: beberapa opsi ter-ranking per dimensi. */
export interface AnalysisResult {
  audienceOptions: RankedOption[];
  painPointOptions: RankedOption[];
  leadMagnetOptions: RankedOption[];
}

/** Hasil akhir dari /api/generate. */
export interface GenerateResult {
  strategy: StrategyOutput;
  copy: CopyOutput;
  statuses: StatusMap;
  html: string;
}

/** Satu varian dalam A/B test. */
export interface AbVariant {
  copy: CopyOutput;
  statuses: StatusMap;
  html: string;
}

/** Hasil A/B test: 1 strategi bersama + 2 varian copy (angle berbeda). */
export interface AbResult {
  strategy: StrategyOutput;
  a: AbVariant;
  b: AbVariant;
}

/** Brief kampanye dari user. */
export interface CampaignBrief {
  product: string;
  audience: string;
  leadMagnet: string;
  painPoint: string;
  brandColor?: string;
  trafficSource?: string;
  /** Model pintar untuk Strategist & Copywriter. */
  modelStrategist: string;
  /** Model hemat/cepat untuk Developer (render HTML). */
  modelDeveloper: string;
  apiKey?: string;
  baseUrl?: string;
  /** Generate HTML bertahap per-section (anti-truncasi untuk model kecil). */
  modular?: boolean;
}
