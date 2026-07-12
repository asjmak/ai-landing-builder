"use client";
import { useState, useEffect, useCallback } from "react";
import LandingPreview from "@/components/LandingPreview";
import ModuleToggles from "@/components/ModuleToggles";
import JsonBlock from "@/components/JsonBlock";
import CopyEditor from "@/components/CopyEditor";
import RankedPicker from "@/components/RankedPicker";
import ModelSelector, { STRATEGIST_DEFAULT, DEVELOPER_DEFAULT, isFreeModel } from "@/components/ModelSelector";
import { palettePreview } from "@/lib/palette";
import type { StrategyOutput, CopyOutput, StatusMap, AnalysisResult, AbResult } from "@/lib/types";
import type { CampaignListItem } from "@/lib/store";
import { TEMPLATES, type TemplatePreset } from "@/lib/templates";

const TRAFFIC = ["Iklan Berbayar (FB/IG/Google)", "Konten Organik (TikTok/YouTube/SEO)", "Email / Database Existing", "Campaign Umum"];

type Tab = "preview" | "modules" | "json" | "edit";

const THEMES = [
  { id: "dark", label: "Gelap", swatch: "linear-gradient(135deg,#0f172a,#475569)" },
  { id: "light", label: "Terang", swatch: "linear-gradient(135deg,#e2e8f0,#ffffff)" },
  { id: "sepia", label: "Sepia", swatch: "linear-gradient(135deg,#f3ece1,#caa472)" },
  { id: "ocean", label: "Laut", swatch: "linear-gradient(135deg,#e0f2fe,#0ea5e9)" },
  { id: "midnight", label: "Midnight", swatch: "linear-gradient(135deg,#1b1733,#8b5cf6)" },
  { id: "forest", label: "Forest", swatch: "linear-gradient(135deg,#0f1f17,#22c55e)" },
  { id: "rose", label: "Rose", swatch: "linear-gradient(135deg,#fdeef4,#ec4899)" },
  { id: "sunset", label: "Sunset", swatch: "linear-gradient(135deg,#fbeee0,#f97316)" },
  { id: "cyber", label: "Cyber", swatch: "linear-gradient(135deg,#04141a,#22d3ee)" },
  { id: "auto", label: "Auto (OS)", swatch: "linear-gradient(135deg,#020617 50%,#e2e8f0 50%)" },
] as const;
type ThemeId = (typeof THEMES)[number]["id"];

export default function Home() {
  const [form, setForm] = useState({ product: "", audience: "", leadMagnet: "", painPoint: "", brandColor: "#2563eb", trafficSource: TRAFFIC[0], modelStrategist: STRATEGIST_DEFAULT, modelDeveloper: DEVELOPER_DEFAULT, apiKey: "", modular: isFreeModel(DEVELOPER_DEFAULT) });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [strategy, setStrategy] = useState<StrategyOutput | null>(null);
  const [copy, setCopy] = useState<CopyOutput | null>(null);
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [html, setHtml] = useState("");
  const [abMode, setAbMode] = useState(false);
  const [abData, setAbData] = useState<AbResult | null>(null);
  const [view, setView] = useState<"compare" | "single">("single");
  const [selectedVariant, setSelectedVariant] = useState<"A" | "B" | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRender, setLoadingRender] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("preview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("dark");
  const [themeMenu, setThemeMenu] = useState(false);
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => { loadCampaigns(); }, []);

  useEffect(() => {
    const saved = localStorage.getItem("alb-theme");
    if (saved && THEMES.some((t) => t.id === saved)) setTheme(saved as ThemeId);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setPrefersDark(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const appliedTheme: ThemeId = theme === "auto" ? (prefersDark ? "dark" : "light") : theme;

  const chooseTheme = (id: ThemeId) => { setTheme(id); localStorage.setItem("alb-theme", id); setThemeMenu(false); };

  const update = useCallback(<K extends keyof typeof form>(key: K, value: string) => { setForm((f) => ({ ...f, [key]: value })); }, []);

  // Ganti model Developer → auto-aktifkan mode Modular bila model gratis (batas context kecil).
  function handleDevModel(v: string) { setForm((f) => ({ ...f, modelDeveloper: v, modular: isFreeModel(v) })); }

  async function loadCampaigns() { try { const res = await fetch("/api/campaigns"); if (res.ok) setCampaigns(await res.json()); } catch {} }
  function appendLog(message: string) { setLogs((l) => [...l, message].slice(-5)); }

  async function handleAnalyze() {
    if (!form.product) return; setAnalyzing(true); setError("");
    try { const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: form.product, trafficSource: form.trafficSource, leadMagnet: form.leadMagnet, modelStrategist: form.modelStrategist, apiKey: form.apiKey }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Gagal"); setAnalysis(data); const pick = (arr?: { rank: number; label: string }[]) => { if (!arr?.length) return ""; return (arr.find((o) => o.rank === 1) ?? arr[0]).label; }; setForm((f) => ({ ...f, audience: pick(data.audienceOptions), painPoint: pick(data.painPointOptions), leadMagnet: pick(data.leadMagnetOptions) })); } catch (e: any) { setError(e.message); } finally { setAnalyzing(false); }
  }
  function clearAnalysis() { setAnalysis(null); setForm((f) => ({ ...f, audience: "", painPoint: "", leadMagnet: "" })); }

  async function handleGenerate() {
    setLoading(true); setError(""); setAbData(null); setLogs([]);
    try {
      const endpoint = abMode ? "/api/ab" : "/api/generate";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok || !res.body) throw new Error("Gagal memulai generate.");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalResult: any = null;
      let streamError: string | null = null;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";
        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith("data:")) continue;
          const json = line.slice(5).trim();
          if (!json) continue;
          try {
            const data = JSON.parse(json);
            if (data.type === "log") appendLog(data.message);
            else if (data.type === "done") finalResult = data.result;
            else if (data.type === "error") streamError = data.message;
          } catch {}
        }
      }
      if (streamError) throw new Error(streamError);
      if (finalResult === null) throw new Error("Tidak ada hasil.");
      const aiBrand = finalResult?.strategy?.brandColor;
      if (aiBrand) setForm((f) => ({ ...f, brandColor: aiBrand }));
      if (abMode) { setAbData(finalResult); setStrategy(finalResult.strategy); setCopy(finalResult.a.copy); setStatuses(finalResult.a.statuses); setHtml(finalResult.a.html); setSelectedVariant("A"); setView("compare"); }
      else { setStrategy(finalResult.strategy); setCopy(finalResult.copy); setStatuses(finalResult.statuses); setHtml(finalResult.html); setView("single"); }
      setTab("preview");
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  function selectVariant(v: "A" | "B") { if (!abData) return; const variant = v === "A" ? abData.a : abData.b; setStrategy(abData.strategy); setCopy(variant.copy); setStatuses(variant.statuses); setHtml(variant.html); setSelectedVariant(v); setView("single"); }

  async function handleRender() {
    if (!strategy || !copy) return; setLoadingRender(true); setError("");
    try { const res = await fetch("/api/render", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ strategy, copy, statuses, brandColor: form.brandColor, modelDeveloper: form.modelDeveloper, apiKey: form.apiKey, modular: form.modular })}); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Gagal render."); setHtml(data.html); setTab("preview"); } catch (e: any) { setError(e.message); } finally { setLoadingRender(false); }
  }
  function toggleModule(id: string, val: "on" | "off") { setStatuses((s) => ({ ...s, [id]: val })); }
  function handleDownload() { if (!html) return; const blob = new Blob([html], { type: "text/html" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "landing-page.html"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
  async function handleSave() { if (!strategy) return; try { const brief = { product: form.product, audience: form.audience, leadMagnet: form.leadMagnet, painPoint: form.painPoint, brandColor: form.brandColor, trafficSource: form.trafficSource, modelStrategist: form.modelStrategist, modelDeveloper: form.modelDeveloper }; const res = await fetch("/api/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: form.product, mode: abData ? "ab" : "single", brief, result: { strategy, copy, statuses, html, abData: abData ?? undefined } })}); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Gagal"); setSaveMsg("Tersimpan"); setTimeout(() => setSaveMsg(""), 2000); await loadCampaigns(); } catch (e: any) { setError(e.message); } }
  async function handleLoad(id: string) { try { const res = await fetch(`/api/campaigns/${id}`); if (!res.ok) throw new Error("Gagal memuat."); const c = await res.json(); const b = c.brief; setForm((f) => ({ ...f, product: b.product, audience: b.audience, leadMagnet: b.leadMagnet, painPoint: b.painPoint, brandColor: b.brandColor, trafficSource: b.trafficSource, modelStrategist: b.modelStrategist, modelDeveloper: b.modelDeveloper })); const r = c.result; setStrategy(r.strategy); setCopy(r.copy); setStatuses(r.statuses); setHtml(r.html || ""); if (r.abData) { setAbData(r.abData); setView("compare"); setSelectedVariant("A"); } else { setAbData(null); setView("single"); } setAbMode(!!r.abData); setTab("preview"); setError(""); } catch (e: any) { setError(e.message); } }
  async function handleDelete(id: string) { try { const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" }); if (!res.ok) throw new Error("Gagal"); await loadCampaigns(); } catch (e: any) { setError(e.message); } }
  function applyTemplate(t: TemplatePreset) { setForm((f) => ({ ...f, product: t.product, audience: t.audience, leadMagnet: t.leadMagnet, painPoint: t.painPoint, brandColor: t.brandColor, trafficSource: t.trafficSource })); setAnalysis(null); setError(""); }

  const onCount = Object.values(statuses).filter((v) => v === "on").length;
  const canGenerate = !!form.product && !!form.modelStrategist && !!form.modelDeveloper && (analysis ? true : !!(form.audience && form.painPoint && form.leadMagnet));

  const cardCls = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur";
  const labelCls = "mb-1.5 block text-sm font-medium text-[var(--text)]";
  const fieldCls = "w-full rounded-xl border border-[var(--border)] bg-[var(--field)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition focus:border-[var(--accent)]/60 focus:ring-2 focus:ring-[var(--accent)]/20";
  const ghostCls = "rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-sm text-[var(--text)] transition hover:bg-[var(--surface-hover)]";
  const primaryCls = "rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none";

  return (
    <div className={`min-h-screen bg-[var(--bg)] text-[var(--text)] theme-${appliedTheme}`}>
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundImage: "var(--glow)", backgroundRepeat: "no-repeat" }} />

      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg shadow-lg shadow-emerald-500/40">🚀</div>
            <div>
              <h1 className="text-base font-semibold leading-tight text-[var(--text-strong)]">AI Landing Page Builder</h1>
              <p className="text-[11px] text-[var(--text-faint)]">Landing page modular berkonversi tinggi, dibuat dengan AI</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowTemplates(true)} className={ghostCls}>📚 <span className="hidden sm:inline">Template</span></button>
            <button onClick={() => setShowHistory(true)} className={ghostCls}>🕘 <span className="hidden sm:inline">Riwayat</span></button>
            <div className="relative">
              <button onClick={() => setThemeMenu((v) => !v)} className={ghostCls + " flex items-center gap-1"}>🎨 <span className="hidden sm:inline">Tema</span></button>
              {themeMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setThemeMenu(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow)]">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => chooseTheme(t.id)}
                        className={"flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--surface-hover)] " + (theme === t.id ? "ring-1 ring-[var(--accent)]" : "")}
                      >
                        <span className="h-4 w-4 rounded-full border border-[var(--border)]" style={{ background: t.swatch }} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[390px_1fr]">
        {/* Kolom form brief */}
        <section className="space-y-5">
          <div className={cardCls}>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              <span className="text-[var(--accent)]">◆</span> Brief Kampanye
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Produk / Jasa <span className="text-[var(--accent)]">*</span></label>
                <textarea className={fieldCls + " min-h-[84px] resize-y"} placeholder="Contoh: Kursus online memasak untuk pemula" value={form.product} onChange={(e) => update("product", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Audience / Target</label>
                <input className={fieldCls} placeholder="Siapa pembeli idealnya?" value={form.audience} onChange={(e) => update("audience", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Lead Magnet</label>
                <input className={fieldCls} placeholder="Hadiah untuk dapat email (ebook, diskon, dll)" value={form.leadMagnet} onChange={(e) => update("leadMagnet", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Pain Point</label>
                <input className={fieldCls} placeholder="Masalah utama yang ingin diselesaikan" value={form.painPoint} onChange={(e) => update("painPoint", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Warna Brand</label>
                <div className="flex items-center gap-2">
                  <input type="color" className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--border)] bg-transparent" value={form.brandColor} onChange={(e) => update("brandColor", e.target.value)} />
                  <input className={fieldCls} value={form.brandColor} onChange={(e) => update("brandColor", e.target.value)} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {(() => {
                    const p = palettePreview(form.brandColor);
                    const sw = (c: string, t: string) => (
                      <div key={t} className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2 py-1" title={t}>
                        <span className="h-4 w-4 rounded" style={{ background: c }} />
                        <span className="text-[10px] text-[var(--text-faint)]">{t}</span>
                      </div>
                    );
                    return (
                      <>
                        {sw(p.bg, "Bg")}
                        {sw(p.surface, "Surface")}
                        {sw(p.text, "Text")}
                        {sw(p.brand, "Brand")}
                        {sw(p.onBrand, "On Brand")}
                      </>
                    );
                  })()}
                </div>
                <p className="mt-1 text-[10px] text-[var(--text-faint)]">Kombinasi warna otomatis menyesuaikan Warna Brand (termasuk section background & teks tombol).</p>
              </div>
              <div>
                <label className={labelCls}>Sumber Traffic</label>
                <select className={fieldCls} value={form.trafficSource} onChange={(e) => update("trafficSource", e.target.value)}>
                  {TRAFFIC.map((t) => (
                    <option key={t} value={t} className="bg-[var(--surface)] text-[var(--text)]">{t}</option>
                  ))}
                </select>
              </div>
              <ModelSelector label="Model Strategist (otak copy & strategi)" value={form.modelStrategist} onChange={(v) => update("modelStrategist", v)} />
              <ModelSelector label="Model Developer (render HTML)" value={form.modelDeveloper} onChange={handleDevModel} />
              <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                <input
                  id="modular"
                  type="checkbox"
                  checked={form.modular}
                  onChange={(e) => setForm((f) => ({ ...f, modular: e.target.checked }))}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                <label htmlFor="modular" className="text-xs text-[var(--text-muted)] leading-tight">
                  Generate <span className="font-semibold text-[var(--text)]">Modular</span> (per-section) — anti-truncasi untuk model gratis/kecil. Otomatis aktif bila model Developer gratis.
                </label>
              </div>
              <div>
                <label className={labelCls}>OpenRouter API Key <span className="text-[var(--text-faint)]">(opsional)</span></label>
                <input type="password" className={fieldCls} placeholder="sk-or-…  (atau set di .env.local)" value={form.apiKey} onChange={(e) => update("apiKey", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Analisis AI */}
          <div className={cardCls}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]"><span className="text-[var(--accent)]">✸</span> Analisis AI</h2>
                <p className="mt-1 text-[11px] text-[var(--text-faint)]">Rekomendasi audience, pain point & lead magnet.</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={handleAnalyze} disabled={analyzing || !form.product} className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-40">Analisis</button>
                {analysis && <button onClick={clearAnalysis} className={ghostCls}>Reset</button>}
              </div>
            </div>
            {analysis ? (
              <div className="space-y-4">
                <RankedPicker title="Audience" options={analysis.audienceOptions} selectedLabel={form.audience} onSelect={(l) => update("audience", l)} />
                <RankedPicker title="Pain Point" options={analysis.painPointOptions} selectedLabel={form.painPoint} onSelect={(l) => update("painPoint", l)} />
                <RankedPicker title="Lead Magnet" options={analysis.leadMagnetOptions} selectedLabel={form.leadMagnet} onSelect={(l) => update("leadMagnet", l)} />
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text-faint)]">Isi Produk lalu klik <span className="text-[var(--accent)]">Analisis</span> untuk mendapatkan rekomendasi AI.</p>
            )}
          </div>

          {/* Generate */}
          <div className={cardCls}>
            <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm text-[var(--text)]">
                <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={abMode} onChange={(e) => setAbMode(e.target.checked)} />
              Mode A/B Test <span className="text-[var(--text-faint)]">(2 varian copy berbeda)</span>
            </label>
            <button onClick={handleGenerate} disabled={!canGenerate || loading} className={primaryCls}>
              {loading ? "Membuat…" : abMode ? "Generate A/B Landing Page" : "Generate Landing Page"}
            </button>
            <p className="mt-2 text-[11px] text-[var(--text-faint)]">Butuh: produk + model + (analisis AI <span className="text-[var(--text-muted)]">atau</span> isi audience/pain point/lead magnet).</p>
          </div>
        </section>

        {/* Kolom output */}
        <section className="space-y-5">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}
          {logs.length > 0 && (
            <div className="space-y-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-xs text-[var(--accent)]">
              {logs.map((l, i) => (<div key={i}>› {l}</div>))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
            {(["preview", "modules", "json", "edit"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                  tab === t ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white shadow-lg shadow-[var(--accent-soft)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                {t === "preview" ? "Preview" : t === "modules" ? `Modules (${onCount})` : t === "edit" ? "Edit" : "JSON"}
              </button>
            ))}
          </div>

          {/* A/B switcher */}
          {abData && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--text-faint)]">Varian:</span>
              <button onClick={() => selectVariant("A")} className={selectedVariant === "A" && view === "single" ? primaryCls : ghostCls}>A</button>
              <button onClick={() => selectVariant("B")} className={selectedVariant === "B" && view === "single" ? primaryCls : ghostCls}>B</button>
              <button onClick={() => setView("compare")} className={view === "compare" ? primaryCls : ghostCls}>Bandingkan</button>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
            {tab === "preview" && (
              view === "compare" && abData ? (
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <LandingPreview html={abData.a.html} />
                  <LandingPreview html={abData.b.html} />
                </div>
              ) : html ? (
                <LandingPreview html={html} />
              ) : (
                <div className="flex h-[640px] items-center justify-center p-8 text-center text-sm text-[var(--text-faint)]">
                  <div>
                    <div className="mb-2 text-3xl">🖥️</div>
                    Hasil preview akan muncul di sini setelah Anda men-generate landing page.
                  </div>
                </div>
              )
            )}
            {tab === "modules" && strategy && (
              <div className="p-4">
                <ModuleToggles strategy={strategy} statuses={statuses} onChange={toggleModule} />
              </div>
            )}
            {tab === "modules" && !strategy && (
              <div className="flex h-[640px] items-center justify-center p-8 text-center text-sm text-[var(--text-faint)]">
                Belum ada strategi. Generate dulu untuk melihat modul yang disarankan.
              </div>
            )}
            {tab === "json" && (
              <div className="space-y-3 p-4">
                <JsonBlock data={strategy} />
                <JsonBlock data={copy} />
              </div>
            )}
            {tab === "edit" && copy && (
              <div className="p-4">
                <CopyEditor copy={copy} statuses={statuses} onChange={setCopy} />
              </div>
            )}
            {tab === "edit" && !copy && (
              <div className="flex h-[640px] items-center justify-center p-8 text-center text-sm text-[var(--text-faint)]">
                <div>
                  <div className="mb-2 text-3xl">✏️</div>
                  Belum ada konten. Generate dulu untuk menyunting copy per section.
                </div>
              </div>
            )}
          </div>

          {/* Aksi hasil */}
          {strategy && (
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={handleRender} disabled={loadingRender} className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-40">
                {loadingRender ? "Rendering…" : "Render HTML"}
              </button>
              <button onClick={handleDownload} disabled={!html} className={ghostCls + " disabled:opacity-40"}>⬇ Unduh HTML</button>
              <button onClick={handleSave} className={ghostCls}>💾 Simpan</button>
              {saveMsg && <span className="text-sm font-medium text-[var(--accent)]">{saveMsg}</span>}
            </div>
          )}
        </section>
      </main>

      {/* Modal Template */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setShowTemplates(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[var(--text-strong)]">Template Library</h3>
                <p className="text-[11px] text-[var(--text-faint)]">Satu klik mengisi brief sesuai niche.</p>
              </div>
              <button onClick={() => setShowTemplates(false)} className="rounded-lg px-2 py-1 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">✕</button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { applyTemplate(t); setShowTemplates(false); }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-left transition hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]"
                >
                  <div className="font-semibold text-[var(--text-strong)]">{t.emoji} {t.name}</div>
                  <div className="text-xs text-[var(--text-faint)]">{t.niche}</div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">{t.product}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Riwayat */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setShowHistory(false)}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[var(--text-strong)]">Riwayat Kampanye</h3>
                <p className="text-[11px] text-[var(--text-faint)]">Muat atau hapus kampanye tersimpan.</p>
              </div>
              <button onClick={() => setShowHistory(false)} className="rounded-lg px-2 py-1 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">✕</button>
            </div>
            <div className="max-h-80 space-y-2 overflow-auto">
              {campaigns.length === 0 && <p className="text-sm text-[var(--text-faint)]">Belum ada kampanye tersimpan.</p>}
              {campaigns.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
                  <button onClick={() => { handleLoad(c.id); setShowHistory(false); }} className="text-left">
                    <div className="text-sm font-medium text-[var(--text-strong)]">{c.product}</div>
                    <div className="text-[11px] text-[var(--text-faint)]">{c.mode.toUpperCase()} · {new Date(c.createdAt).toLocaleString()}</div>
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="rounded-lg px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10">
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
