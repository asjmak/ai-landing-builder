"use client";

export default function JsonBlock({ data }: { data: unknown }) {
  return (
    <pre className="max-h-96 overflow-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
