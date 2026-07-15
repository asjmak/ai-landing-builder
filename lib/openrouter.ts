/**
 * AI Gateway client — kompatibel dengan OpenRouter, 9Router, dan
 * gateway lain yang mengikuti spesifikasi OpenAI Chat Completions.
 *
 * Semua model diakses lewat satu antarmuka sehingga kita bisa
 * mengganti "otak" AI (Claude / GPT / DeepSeek / Llama) tanpa
 * mengubah logika pipeline.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  model: string;
  messages: ChatMessage[];
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  /** Bila true, minta model mengembalikan JSON murni. */
  jsonMode?: boolean;
}

export class GatewayError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "GatewayError";
  }
}

function resolveBaseUrl(baseUrl?: string): string {
  // Prioritas: argumen -> env AI_BASE_URL -> default OpenRouter
  const url = (baseUrl || process.env.AI_BASE_URL || "https://openrouter.ai/api/v1").replace(/\/$/, "");
  return url;
}

function resolveApiKey(apiKey?: string): string {
  const key = apiKey || process.env.AI_API_KEY;
  if (!key) {
    throw new GatewayError(
      "API key tidak ditemukan. Set AI_API_KEY di .env.local, atau isi field API Key di form.",
    );
  }
  return key;
}

/** Ekstrak JSON dari teks model secara defensif (termasuk bila ada teks di luar {}). */
function extractJson(text: string): any {
  let trimmed = text.trim();

  // Strip markdown code fences (```json ... ``` atau ``` ... ```)
  trimmed = trimmed.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  // Coba parse langsung
  try {
    return JSON.parse(trimmed);
  } catch {
    /* lanjut ke ekstraksi substring */
  }

  // Cari pasangan { ... } terbesar
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    let candidate = trimmed.slice(start, end + 1);

    // Fix trailing commas sebelum } atau ]
    candidate = candidate.replace(/,\s*([}\]])/g, "$1");
    // Fix komentar JS-style (// ... atau /* ... */)
    candidate = candidate.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
    // Fix newlines di dalam string values
    candidate = candidate.replace(/"([^"]*?)[\r\n]+([^"]*?)"/g, (_, a, b) => `"${a}${b}"`);

    try {
      return JSON.parse(candidate);
    } catch {
      /* coba ekstrak lebih agresif */
    }

    // Brute-force: cari { pertama, lalu hitung balance bracket
    let depth = 0;
    let inString = false;
    let escape = false;
    let lastClose = -1;
    for (let i = start; i < trimmed.length; i++) {
      const ch = trimmed[i];
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === "{") depth++;
      if (ch === "}") { depth--; if (depth === 0) { lastClose = i; break; } }
    }

    if (lastClose > start) {
      let candidate2 = trimmed.slice(start, lastClose + 1);
      candidate2 = candidate2.replace(/,\s*([}\]])/g, "$1");
      try {
        return JSON.parse(candidate2);
      } catch {
        /* last resort */
      }
    }
  }

  throw new GatewayError("Model tidak mengembalikan JSON yang valid. Response: " + trimmed.slice(0, 300));
}

/** Default timeout untuk fetch ke gateway (ms). Developer stage butuh lebih lama. */
const FETCH_TIMEOUT_MS = 600_000; // 10 menit per call

export async function chatCompletion(opts: ChatOptions): Promise<any> {
  const baseUrl = resolveBaseUrl(opts.baseUrl);
  const apiKey = resolveApiKey(opts.apiKey);
  const temperature = opts.temperature ?? 0.7;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "HTTP-Referer": process.env.AI_SITE_URL || "http://localhost:3000",
    "X-Title": process.env.AI_APP_NAME || "AI Landing Page Builder",
  };

  const buildBody = (useJson: boolean) =>
    JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      temperature,
      stream: false,
      ...(useJson ? { response_format: { type: "json_object" } } : {}),
    });

  const url = `${baseUrl}/chat/completions`;

  const fetchWithTimeout = (body: string, signal?: AbortSignal) =>
    fetch(url, { method: "POST", headers, body, signal });

  let controller = new AbortController();
  let timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetchWithTimeout(buildBody(!!opts.jsonMode), controller.signal);
  } catch (e: any) {
    clearTimeout(timer);
    if (e?.name === "AbortError") {
      throw new GatewayError(`Gateway timeout setelah ${FETCH_TIMEOUT_MS / 1000} detik. Coba pakai model yang lebih ringan.`);
    }
    throw new GatewayError(`fetch failed — pastikan gateway AI berjalan di ${baseUrl}. Detail: ${e?.message || e}`);
  }
  clearTimeout(timer);

  // Beberapa model/gateway tidak mendukung response_format -> fallback tanpa json mode
  if (!res.ok && opts.jsonMode) {
    controller = new AbortController();
    timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      res = await fetchWithTimeout(buildBody(false), controller.signal);
    } catch (e: any) {
      clearTimeout(timer);
      throw new GatewayError(`fetch failed (fallback): ${e?.message || e}`);
    }
    clearTimeout(timer);
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new GatewayError(`Gateway error ${res.status}: ${bodyText.slice(0, 500)}`, res.status);
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  return opts.jsonMode ? extractJson(content) : content;
}
