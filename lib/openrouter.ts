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
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    /* lanjut ke ekstraksi substring */
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }
  throw new GatewayError("Model tidak mengembalikan JSON yang valid.");
}

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
      ...(useJson ? { response_format: { type: "json_object" } } : {}),
    });

  const url = `${baseUrl}/chat/completions`;

  let res = await fetch(url, { method: "POST", headers, body: buildBody(!!opts.jsonMode) });

  // Beberapa model/gateway tidak mendukung response_format -> fallback tanpa json mode
  if (!res.ok && opts.jsonMode) {
    res = await fetch(url, { method: "POST", headers, body: buildBody(false) });
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new GatewayError(`Gateway error ${res.status}: ${bodyText.slice(0, 500)}`, res.status);
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  return opts.jsonMode ? extractJson(content) : content;
}
