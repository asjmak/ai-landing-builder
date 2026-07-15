"use client";

import { MODULE_CATALOG } from "@/lib/prompts";
import type { CopyOutput, ModuleContent, StatusMap } from "@/lib/types";
import StyleEditor, { type StyleProps } from "./StyleEditor";
import SectionStyleEditor, { type SectionStyleProps } from "./SectionStyleEditor";

/**
 * Editor konten terstruktur untuk landing page yang sudah di-generate.
 * Mengedit `content` tiap module (terikat ke state `copy`), lalu UI memanggil
 * endpoint /api/render (tombol "Render HTML") untuk membangun ulang HTML.
 *
 * Pendekatan: single source of truth tetap di data terstruktur (copy),
 * bukan di HTML mentah — sehingga hasil AI bisa di-regenerate kapan saja
 * tanpa kehilangan suntingan pengguna.
 */

type FieldType = "text" | "textarea" | "number" | "list";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  item?: FieldDef[]; // untuk list berisi objek
}

export const COPY_SCHEMA: Record<string, FieldDef[]> = {
  hero: [
    { key: "headline", label: "Headline", type: "textarea" },
    { key: "subheadline", label: "Sub-headline", type: "textarea" },
    { key: "ctaText", label: "Teks Tombol CTA", type: "text" },
    { key: "imageUrl", label: "URL Gambar (opsional)", type: "text" },
    { key: "imageHint", label: "Petunjuk Gambar (opsional)", type: "text" },
  ],
  leadForm: [
    { key: "title", label: "Judul Form", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "fields", label: "Field Input", type: "list" },
    { key: "submitText", label: "Teks Submit", type: "text" },
    { key: "privacyNote", label: "Catatan Privasi", type: "textarea" },
  ],
  trustBadges: [
    { key: "badges", label: "Trust Badges", type: "list", item: [{ key: "label", label: "Label", type: "text" }] },
    { key: "note", label: "Catatan", type: "textarea" },
  ],
  benefits: [
    { key: "title", label: "Judul Section", type: "text" },
    { key: "intro", label: "Pengantar", type: "textarea" },
    {
      key: "items",
      label: "Daftar Benefit",
      type: "list",
      item: [
        { key: "title", label: "Judul", type: "text" },
        { key: "desc", label: "Deskripsi", type: "textarea" },
      ],
    },
  ],
  socialProof: [
    { key: "title", label: "Judul Section", type: "text" },
    { key: "intro", label: "Pengantar", type: "textarea" },
    {
      key: "testimonials",
      label: "Testimoni",
      type: "list",
      item: [
        { key: "name", label: "Nama", type: "text" },
        { key: "role", label: "Peran", type: "text" },
        { key: "quote", label: "Kutipan", type: "textarea" },
        { key: "result", label: "Hasil", type: "text" },
      ],
    },
  ],
  faq: [
    { key: "title", label: "Judul Section", type: "text" },
    {
      key: "items",
      label: "FAQ",
      type: "list",
      item: [
        { key: "q", label: "Pertanyaan", type: "textarea" },
        { key: "a", label: "Jawaban", type: "textarea" },
      ],
    },
  ],
  finalCta: [
    { key: "headline", label: "Headline", type: "textarea" },
    { key: "subheadline", label: "Sub-headline", type: "textarea" },
    { key: "ctaText", label: "Teks Tombol CTA", type: "text" },
  ],
  footer: [
    { key: "copyright", label: "Copyright", type: "text" },
    { key: "links", label: "Tautan", type: "list", item: [{ key: "label", label: "Label", type: "text" }] },
  ],
  stickyBar: [
    { key: "text", label: "Teks Bar", type: "textarea" },
    { key: "ctaText", label: "Teks CTA", type: "text" },
  ],
  countdownTimer: [
    { key: "label", label: "Label", type: "text" },
    { key: "durationHours", label: "Durasi (jam)", type: "number" },
  ],
  exitIntentPopup: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "subheadline", label: "Sub-headline", type: "textarea" },
    { key: "ctaText", label: "Teks CTA", type: "text" },
    { key: "offer", label: "Penawaran", type: "textarea" },
  ],
  floatingCta: [{ key: "ctaText", label: "Teks CTA", type: "text" }],
  liveActivity: [{ key: "template", label: "Template Notifikasi", type: "textarea" }],
};

const inputCls =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";

function emptyFromSchema(item?: FieldDef[]): any {
  if (!item) return "";
  const obj: Record<string, any> = {};
  for (const f of item) obj[f.key] = f.type === "number" ? 0 : "";
  return obj;
}

function updateModuleContent(
  modules: ModuleContent[],
  moduleId: string,
  newContent: Record<string, any>,
): CopyOutput {
  return { modules: modules.map((m) => (m.id === moduleId ? { ...m, content: newContent } : m)) };
}

/** Ambil semua field keys yang berupa teks (bukan list) dari schema */
function getTextFields(schema: FieldDef[]): string[] {
  return schema.filter((f) => f.type !== "list").map((f) => f.key);
}

/** Default styles berdasarkan shell CSS — tampil saat pertama kali edit */
export const DEFAULT_ELEMENT_STYLES: Record<string, Record<string, string>> = {
  headline:     { color: "#1a1a2e", fontSize: "clamp(2rem,5.5vw,3.6rem)", fontWeight: "800" },
  subheadline:  { color: "#6a6a6a", fontSize: "clamp(1rem,1.5vw,1.15rem)", fontWeight: "400" },
  title:        { color: "#1a1a2e", fontSize: "clamp(1.5rem,3.2vw,2.2rem)", fontWeight: "800" },
  ctaText:      { color: "#ffffff", backgroundColor: "#2563eb", fontSize: "1rem", borderRadius: "999px" },
  submitText:   { color: "#ffffff", backgroundColor: "#2563eb", fontSize: "1rem" },
  description:  { color: "#6a6a6a", fontSize: "0.95rem", lineHeight: "1.65" },
  note:         { color: "#4a6fa5", fontSize: "0.9rem" },
  text:         { color: "#2e2e2e", fontSize: "0.95rem" },
  label:        { color: "#6a6a6a", fontSize: "0.85rem", fontWeight: "600" },
  quote:        { color: "#6a6a6a", fontSize: "1rem", fontStyle: "italic" },
  result:       { color: "#2563eb", fontSize: "0.9rem", fontWeight: "700" },
  copyright:    { color: "#acacac", fontSize: "0.85rem" },
};

/** Default styles untuk list item sub-fields */
const DEFAULT_LIST_ITEM_STYLES: Record<string, Record<string, string>> = {
  title:  { color: "#1a1a2e", fontSize: "1.05rem", fontWeight: "700" },
  desc:   { color: "#6a6a6a", fontSize: "0.95rem", lineHeight: "1.6" },
  label:  { color: "#2e2e2e", fontSize: "0.9rem" },
  q:      { color: "#1a1a2e", fontSize: "0.95rem", fontWeight: "600" },
  a:      { color: "#6a6a6a", fontSize: "0.95rem", lineHeight: "1.7" },
  name:   { color: "#1a1a2e", fontSize: "0.95rem", fontWeight: "700" },
  role:   { color: "#acacac", fontSize: "0.85rem" },
  quote:  { color: "#6a6a6a", fontSize: "1rem", fontStyle: "italic" },
  result: { color: "#2563eb", fontSize: "0.9rem", fontWeight: "700" },
};

/** Isi _styles dengan default bila kosong */
function ensureDefaultStyles(content: Record<string, any>, schema: FieldDef[]): Record<string, any> {
  if (content._styles && Object.keys(content._styles).length > 0) return content;
  const styles: Record<string, Record<string, string>> = {};
  for (const field of schema) {
    if (field.type === "list" && field.item) {
      // Default untuk sub-fields pertama
      for (const sub of field.item) {
        if (!styles[sub.key] && DEFAULT_LIST_ITEM_STYLES[sub.key]) {
          styles[sub.key] = { ...DEFAULT_LIST_ITEM_STYLES[sub.key] };
        }
      }
    } else if (DEFAULT_ELEMENT_STYLES[field.key]) {
      styles[field.key] = { ...DEFAULT_ELEMENT_STYLES[field.key] };
    }
  }
  return { ...content, _styles: styles };
}

function ModuleFields({
  moduleId,
  content,
  schema,
  onChange,
}: {
  moduleId: string;
  content: Record<string, any>;
  schema: FieldDef[];
  onChange: (next: Record<string, any>) => void;
}) {
  const name = MODULE_CATALOG.find((x) => x.id === moduleId)?.name ?? moduleId;
  const textFields = getTextFields(schema);
  // Pre-fill default styles bila kosong
  const contentWithDefaults = ensureDefaultStyles(content, schema);
  const styles: Record<string, StyleProps> = contentWithDefaults._styles || {};
  const sectionStyle: SectionStyleProps = content._sectionStyle || {};

  const updateStyle = (fieldKey: string, nextStyle: StyleProps) => {
    const newStyles = { ...styles, [fieldKey]: nextStyle };
    // Hapus field kosong
    if (Object.keys(nextStyle).length === 0) delete newStyles[fieldKey];
    onChange({ ...content, _styles: newStyles });
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-2)]">
          Module
        </span>
        <span className="text-sm font-semibold text-[var(--text)]">{name}</span>
      </div>

      {/* Content Fields */}
      <div className="space-y-3">
        {schema.map((field) => {
          const value = content[field.key];
          if (field.type === "list") {
            const arr: any[] = Array.isArray(value) ? value : [];
            const isObjectList = !!field.item;
            return (
              <div key={field.key}>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-[var(--text-muted)]">{field.label}</label>
                  <button
                    type="button"
                    onClick={() => onChange({ ...content, [field.key]: [...arr, emptyFromSchema(field.item)] })}
                    className="rounded-md border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)]"
                  >
                    + Tambah
                  </button>
                </div>
                <div className="space-y-2">
                  {arr.length === 0 && (
                    <p className="text-xs italic text-[var(--text-faint)]">Belum ada item.</p>
                  )}
                  {arr.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        {isObjectList ? (
                          field.item!.map((sub) => (
                            <div key={sub.key}>
                              <label className="mb-0.5 block text-[11px] text-[var(--text-faint)]">{sub.label}</label>
                              {sub.type === "textarea" ? (
                                <textarea
                                  className={inputCls + " min-h-[52px]"}
                                  value={item?.[sub.key] ?? ""}
                                  onChange={(e) =>
                                    onChange({
                                      ...content,
                                      [field.key]: arr.map((it, j) =>
                                        j === i ? { ...it, [sub.key]: e.target.value } : it,
                                      ),
                                    })
                                  }
                                />
                              ) : (
                                <input
                                  className={inputCls}
                                  type={sub.type === "number" ? "number" : "text"}
                                  value={item?.[sub.key] ?? ""}
                                  onChange={(e) =>
                                    onChange({
                                      ...content,
                                      [field.key]: arr.map((it, j) =>
                                        j === i
                                          ? { ...it, [sub.key]: sub.type === "number" ? Number(e.target.value) : e.target.value }
                                          : it,
                                      ),
                                    })
                                  }
                                />
                              )}
                            </div>
                          ))
                        ) : (
                          <input
                            className={inputCls}
                            value={item ?? ""}
                            onChange={(e) =>
                              onChange({ ...content, [field.key]: arr.map((it, j) => (j === i ? e.target.value : it)) })
                            }
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onChange({ ...content, [field.key]: arr.filter((_, j) => j !== i) })}
                        className="mt-1 rounded-md px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                        aria-label="Hapus item"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // field teks / textarea / number
          return (
            <div key={field.key}>
              <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  className={inputCls + " min-h-[64px]"}
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) => onChange({ ...content, [field.key]: e.target.value })}
                />
              ) : (
                <input
                  className={inputCls}
                  type={field.type === "number" ? "number" : "text"}
                  value={field.type === "number" ? (typeof value === "number" ? value : 0) : typeof value === "string" ? value : ""}
                  onChange={(e) =>
                    onChange({
                      ...content,
                      [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                    })
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Section Style */}
      <div className="mt-4">
        <SectionStyleEditor
          styles={sectionStyle}
          onChange={(next) => onChange({ ...content, _sectionStyle: next })}
        />
      </div>

      {/* Element Style Section */}
      {textFields.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-1.5 border-t border-[var(--border)] pt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">🎨 Style per Elemen</span>
          </div>
          <div className="space-y-1.5">
            {textFields.map((fieldKey) => (
              <StyleEditor
                key={fieldKey}
                elementKey={fieldKey}
                styles={styles[fieldKey] || {}}
                onChange={(next) => updateStyle(fieldKey, next)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CopyEditor({
  copy,
  statuses,
  onChange,
}: {
  copy: CopyOutput;
  statuses: StatusMap;
  onChange: (next: CopyOutput) => void;
}) {
  const visible = copy.modules.filter((m) => statuses[m.id] !== "off");

  if (visible.length === 0) {
    return (
      <p className="p-4 text-sm text-[var(--text-faint)]">
        Tidak ada module aktif. Nyalakan module di tab Modules untuk menyunting isinya.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--text-faint)]">
        Sunting isi tiap section, lalu tekan <span className="font-medium text-[var(--text-muted)]">Render HTML</span> di
        bawah untuk memperbarui tampilan. Perubahan tersimpan saat Anda menekan Simpan.
      </p>
      {visible.map((m) => {
        const schema = COPY_SCHEMA[m.id];
        if (!schema) return null;
        return (
          <ModuleFields
            key={m.id}
            moduleId={m.id}
            content={m.content}
            schema={schema}
            onChange={(next) => onChange(updateModuleContent(copy.modules, m.id, next))}
          />
        );
      })}
    </div>
  );
}
