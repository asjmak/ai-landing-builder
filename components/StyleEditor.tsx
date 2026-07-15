"use client";

import { useState } from "react";

export type StyleProps = Record<string, string>;

interface StyleField {
  key: string;
  label: string;
}

/** Style properties yang relevan per tipe elemen */
const STYLE_FIELDS: Record<string, StyleField[]> = {
  headline: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
    { key: "fontWeight", label: "Tebal Font" },
    { key: "fontFamily", label: "Font Family" },
  ],
  subheadline: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
    { key: "fontWeight", label: "Tebal Font" },
  ],
  ctaText: [
    { key: "color", label: "Warna Teks" },
    { key: "backgroundColor", label: "Warna Background" },
    { key: "fontSize", label: "Ukuran Font" },
    { key: "borderRadius", label: "Border Radius" },
  ],
  title: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
    { key: "fontWeight", label: "Tebal Font" },
  ],
  description: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
    { key: "lineHeight", label: "Line Height" },
  ],
  note: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
    { key: "fontStyle", label: "Font Style" },
  ],
  submitText: [
    { key: "color", label: "Warna Teks" },
    { key: "backgroundColor", label: "Warna Background" },
    { key: "fontSize", label: "Ukuran Font" },
  ],
  label: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
    { key: "fontWeight", label: "Tebal Font" },
  ],
  text: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
    { key: "fontWeight", label: "Tebal Font" },
  ],
  quote: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
    { key: "fontStyle", label: "Font Style" },
  ],
  result: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
  ],
  copyright: [
    { key: "color", label: "Warna Teks" },
    { key: "fontSize", label: "Ukuran Font" },
  ],
};

/** Default style fields untuk elemen yang tidak ada di mapping */
const DEFAULT_FIELDS: StyleField[] = [
  { key: "color", label: "Warna Teks" },
  { key: "fontSize", label: "Ukuran Font" },
];

const WEIGHT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "300", label: "Light (300)" },
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "SemiBold (600)" },
  { value: "700", label: "Bold (700)" },
  { value: "800", label: "ExtraBold (800)" },
  { value: "900", label: "Black (900)" },
];

const FONT_OPTIONS = [
  { value: "", label: "Default (system)" },
  { value: "Georgia, 'Times New Roman', serif", label: "Serif (Georgia)" },
  { value: "'Courier New', monospace", label: "Monospace" },
];

const STYLE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  fontStyle: [
    { value: "", label: "Normal" },
    { value: "italic", label: "Italic" },
    { value: "oblique", label: "Oblique" },
  ],
};

const inputCls =
  "w-full rounded-md border border-[var(--border)] bg-[var(--field)] px-2 py-1.5 text-xs text-[var(--text)] outline-none transition focus:border-[var(--accent)]";

export default function StyleEditor({
  elementKey,
  styles,
  onChange,
}: {
  elementKey: string;
  styles: StyleProps;
  onChange: (next: StyleProps) => void;
}) {
  const [open, setOpen] = useState(false);
  const fields = STYLE_FIELDS[elementKey] || DEFAULT_FIELDS;
  const hasValues = Object.values(styles).some((v) => v);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)]"
      >
        <span className="flex items-center gap-1.5">
          <span>🎨</span>
          <span>Style: {elementKey}</span>
          {hasValues && (
            <span className="rounded-full bg-[var(--accent)]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[var(--accent)]">
              custom
            </span>
          )}
        </span>
        <span className="text-[10px]">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-2.5 border-t border-[var(--border)] px-3 py-3">
          {fields.map((field) => {
            const value = styles[field.key] || "";

            if (field.key === "fontWeight") {
              return (
                <div key={field.key}>
                  <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">{field.label}</label>
                  <select
                    className={inputCls}
                    value={value}
                    onChange={(e) => onChange({ ...styles, [field.key]: e.target.value })}
                  >
                    {WEIGHT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.key === "fontFamily") {
              return (
                <div key={field.key}>
                  <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">{field.label}</label>
                  <select
                    className={inputCls}
                    value={value}
                    onChange={(e) => onChange({ ...styles, [field.key]: e.target.value })}
                  >
                    {FONT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.key === "fontStyle") {
              return (
                <div key={field.key}>
                  <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">{field.label}</label>
                  <select
                    className={inputCls}
                    value={value}
                    onChange={(e) => onChange({ ...styles, [field.key]: e.target.value })}
                  >
                    {(STYLE_OPTIONS.fontStyle || []).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.key === "color" || field.key === "backgroundColor") {
              return (
                <div key={field.key} className="flex items-center gap-2">
                  <input
                    type="color"
                    className="h-7 w-8 cursor-pointer rounded border border-[var(--border)] bg-transparent"
                    value={value || "#000000"}
                    onChange={(e) => onChange({ ...styles, [field.key]: e.target.value })}
                  />
                  <input
                    className={inputCls + " flex-1"}
                    placeholder="#hex atau nama warna"
                    value={value}
                    onChange={(e) => onChange({ ...styles, [field.key]: e.target.value })}
                  />
                  {value && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...styles };
                        delete next[field.key];
                        onChange(next);
                      }}
                      className="rounded px-1.5 py-1 text-[10px] text-red-400 transition hover:bg-red-500/10"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            }

            // Default: text input (fontSize, borderRadius, lineHeight, dll)
            return (
              <div key={field.key}>
                <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">{field.label}</label>
                <div className="flex gap-1.5">
                  <input
                    className={inputCls + " flex-1"}
                    placeholder="contoh: 24px, 1.5, 12px"
                    value={value}
                    onChange={(e) => onChange({ ...styles, [field.key]: e.target.value })}
                  />
                  {value && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...styles };
                        delete next[field.key];
                        onChange(next);
                      }}
                      className="rounded px-1.5 py-1 text-[10px] text-red-400 transition hover:bg-red-500/10"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {hasValues && (
            <button
              type="button"
              onClick={() => onChange({})}
              className="mt-1 w-full rounded-md border border-red-200 py-1 text-[10px] text-red-400 transition hover:bg-red-500/10"
            >
              Reset semua style
            </button>
          )}
        </div>
      )}
    </div>
  );
}
