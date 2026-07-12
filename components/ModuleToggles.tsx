"use client";

import type { StrategyOutput } from "@/lib/types";

export default function ModuleToggles({
  strategy,
  statuses,
  onChange,
}: {
  strategy: StrategyOutput;
  statuses: Record<string, "on" | "off">;
  onChange: (id: string, val: "on" | "off") => void;
}) {
  const sorted = [...strategy.modules].sort((a, b) =>
    a.category === b.category ? 0 : a.category === "core" ? -1 : 1,
  );

  return (
    <div className="space-y-2">
      {sorted.map((m) => (
        <div
          key={m.id}
          className="flex items-start justify-between gap-3 rounded-md border border-slate-200 bg-white p-3"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  m.category === "core"
                    ? "bg-slate-800 text-white"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {m.category}
              </span>
              <span className="truncate text-sm font-medium">{m.name}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{m.reason}</p>
          </div>

          <label className="relative inline-flex shrink-0 cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={statuses[m.id] === "on"}
              onChange={(e) => onChange(m.id, e.target.checked ? "on" : "off")}
            />
            <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-[var(--accent)] peer-focus:outline peer-focus:outline-2 peer-focus:outline-[var(--accent)] after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
          </label>
        </div>
      ))}
    </div>
  );
}
