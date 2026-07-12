"use client";

export default function LandingPreview({ html }: { html: string }) {
  return (
    <iframe
      title="Preview Landing Page"
      className="h-[640px] w-full rounded-lg border border-slate-200 bg-white shadow-sm"
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
