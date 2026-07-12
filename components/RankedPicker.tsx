"use client";

import type { RankedOption } from "@/lib/types";

/**
 * Menampilkan opsi yang di-rank AI sebagai kartu yang bisa diklik.
 * Warna gradasi: rank 1 = hijau (paling disarankan) → rank tertinggi = merah.
 * Hue HSL dari 140 (hijau) ke 0 (merah) proporsional dengan posisi rank.
 */
export default function RankedPicker({
  title,
  options,
  selectedLabel,
  onSelect,
}: {
  title: string;
  options: RankedOption[];
  selectedLabel: string;
  onSelect: (label: string) => void;
}) {
  const total = options.length;

  const styleFor = (rank: number): React.CSSProperties => {
    const t = total > 1 ? (rank - 1) / (total - 1) : 0;
    const hue = Math.round(140 - 140 * t); // 140 hijau -> 0 merah
    return {
      backgroundColor: `hsl(${hue} 75% 94%)`,
      borderColor: `hsl(${hue} 70% 50%)`,
    };
  };

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div className="space-y-2">
        {options.map((o) => {
          const selected = o.label === selectedLabel;
          return (
            <button
              key={o.label}
              type="button"
              onClick={() => onSelect(o.label)}
              style={styleFor(o.rank)}
              className={`w-full rounded-lg border p-3 text-left transition hover:opacity-90 ${
                selected ? "ring-2 ring-[var(--accent)]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase text-slate-600">
                  {o.rank === 1 ? "★ Paling disarankan" : `Preferensi #${o.rank}`}
                </span>
                {selected && <span className="text-xs font-semibold text-[var(--accent)]">✓ Dipilih</span>}
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-900">{o.label}</p>
              {o.reason && <p className="mt-1 text-xs leading-relaxed text-slate-600">{o.reason}</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
