"use client";

import { useState } from "react";

export const FREE_MODELS = [
  "mimo/mimo-v2.5-pro",
  "mimo/mimo-v2.5",
  "mimo/mimo-v2-omni",
];

export const DEFAULT_PAID_MODEL = "mimo/mimo-v2.5-pro";

/** True bila model termasuk daftar gratis (biasanya punya batas context/output kecil). */
export function isFreeModel(model: string): boolean {
  return FREE_MODELS.includes(model);
}

/** Default model "pintar" untuk Strategist & Copywriter. */
export const STRATEGIST_DEFAULT = "mimo/mimo-v2.5-pro";
/** Default model "hemat" untuk Developer (render HTML). */
export const DEVELOPER_DEFAULT = "mimo/mimo-v2.5";

const selCls =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition focus:border-[var(--accent)]/60 focus:ring-2 focus:ring-[var(--accent)]/20";

/**
 * Pemilih model yang bisa dipakai berulang: mode Gratis (pilih dari daftar
 * model :free) atau Berbayar (input nama model sendiri, default gpt-4o-mini).
 */
export default function ModelSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [mode, setMode] = useState<"free" | "custom">(
    FREE_MODELS.includes(value) ? "free" : "custom",
  );

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{label}</span>
      <div className="mb-2 flex gap-1 rounded-lg bg-[var(--surface-2)] p-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => {
            setMode("free");
            onChange(FREE_MODELS[0]);
          }}
          className={`flex-1 rounded-md px-3 py-1.5 transition ${
            mode === "free" ? "bg-[var(--surface-hover)] text-[var(--text-strong)] shadow-sm" : "text-[var(--text-faint)]"
          }`}
        >
          Pilih Model
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("custom");
            onChange(DEFAULT_PAID_MODEL);
          }}
          className={`flex-1 rounded-md px-3 py-1.5 transition ${
            mode === "custom" ? "bg-[var(--surface-hover)] text-[var(--text-strong)] shadow-sm" : "text-[var(--text-faint)]"
          }`}
        >
          Custom
        </button>
      </div>

      {mode === "free" ? (
        <select className={selCls} value={value} onChange={(e) => onChange(e.target.value)}>
          {FREE_MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={selCls}
          value={value}
          placeholder={DEFAULT_PAID_MODEL}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
