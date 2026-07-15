"use client";

import { useState } from "react";

export type SectionStyleProps = {
  backgroundColor?: string;
  backgroundImage?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textAlign?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
};

const inputCls =
  "w-full rounded-md border border-[var(--border)] bg-[var(--field)] px-2 py-1.5 text-xs text-[var(--text)] outline-none transition focus:border-[var(--accent)]";

export default function SectionStyleEditor({
  styles,
  onChange,
}: {
  styles: SectionStyleProps;
  onChange: (next: SectionStyleProps) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasValues = Object.values(styles).some((v) => v);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)]"
      >
        <span className="flex items-center gap-1.5">
          <span>🎭</span>
          <span>Section Style</span>
          {hasValues && (
            <span className="rounded-full bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-purple-500">
              custom
            </span>
          )}
        </span>
        <span className="text-[10px]">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-[var(--border)] px-3 py-3">
          {/* Background Color */}
          <div>
            <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-7 w-8 cursor-pointer rounded border border-[var(--border)] bg-transparent"
                value={styles.backgroundColor || "#ffffff"}
                onChange={(e) => onChange({ ...styles, backgroundColor: e.target.value })}
              />
              <input
                className={inputCls + " flex-1"}
                placeholder="#hex"
                value={styles.backgroundColor || ""}
                onChange={(e) => onChange({ ...styles, backgroundColor: e.target.value })}
              />
            </div>
          </div>

          {/* Gradient */}
          <div>
            <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">Gradient</label>
            <div className="grid grid-cols-3 gap-1.5">
              <div>
                <span className="text-[9px] text-[var(--text-faint)]">From</span>
                <input
                  type="color"
                  className="h-7 w-full cursor-pointer rounded border border-[var(--border)] bg-transparent"
                  value={styles.gradientFrom || "#ffffff"}
                  onChange={(e) => onChange({ ...styles, gradientFrom: e.target.value })}
                />
              </div>
              <div>
                <span className="text-[9px] text-[var(--text-faint)]">To</span>
                <input
                  type="color"
                  className="h-7 w-full cursor-pointer rounded border border-[var(--border)] bg-transparent"
                  value={styles.gradientTo || "#ffffff"}
                  onChange={(e) => onChange({ ...styles, gradientTo: e.target.value })}
                />
              </div>
              <div>
                <span className="text-[9px] text-[var(--text-faint)]">Angle</span>
                <input
                  className={inputCls}
                  placeholder="135deg"
                  value={styles.gradientAngle || ""}
                  onChange={(e) => onChange({ ...styles, gradientAngle: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Background Image URL */}
          <div>
            <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">Background Image URL</label>
            <input
              className={inputCls}
              placeholder="https://example.com/image.jpg"
              value={styles.backgroundImage || ""}
              onChange={(e) => onChange({ ...styles, backgroundImage: e.target.value })}
            />
          </div>

          {/* Padding */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">Padding Atas</label>
              <input
                className={inputCls}
                placeholder="4rem"
                value={styles.paddingTop || ""}
                onChange={(e) => onChange({ ...styles, paddingTop: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">Padding Bawah</label>
              <input
                className={inputCls}
                placeholder="4rem"
                value={styles.paddingBottom || ""}
                onChange={(e) => onChange({ ...styles, paddingBottom: e.target.value })}
              />
            </div>
          </div>

          {/* Text Align */}
          <div>
            <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">Text Align</label>
            <div className="flex gap-1">
              {["left", "center", "right"].map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onChange({ ...styles, textAlign: align })}
                  className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition ${
                    styles.textAlign === align
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]/40"
                  }`}
                >
                  {align === "left" ? "← Kiri" : align === "center" ? "↔ Tengah" : "→ Kanan"}
                </button>
              ))}
            </div>
          </div>

          {/* Border */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">Border Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  className="h-7 w-8 cursor-pointer rounded border border-[var(--border)] bg-transparent"
                  value={styles.borderColor || "#e8e8e8"}
                  onChange={(e) => onChange({ ...styles, borderColor: e.target.value })}
                />
                <input
                  className={inputCls + " flex-1"}
                  placeholder="#hex"
                  value={styles.borderColor || ""}
                  onChange={(e) => onChange({ ...styles, borderColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] text-[var(--text-faint)]">Border Radius</label>
              <input
                className={inputCls}
                placeholder="18px"
                value={styles.borderRadius || ""}
                onChange={(e) => onChange({ ...styles, borderRadius: e.target.value })}
              />
            </div>
          </div>

          {hasValues && (
            <button
              type="button"
              onClick={() => onChange({})}
              className="mt-1 w-full rounded-md border border-red-200 py-1 text-[10px] text-red-400 transition hover:bg-red-500/10"
            >
              Reset section style
            </button>
          )}
        </div>
      )}
    </div>
  );
}
