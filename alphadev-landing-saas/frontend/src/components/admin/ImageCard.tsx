import { useState } from "react";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import type { LandingSection } from "../../types/landing";
import type { LandingImage, LandingImageType, UpdateImagePayload } from "../../types/image";
import { getImageUrl } from "../../utils/getImageUrl";

const imageTypes: LandingImageType[] = ["LOGO", "HERO", "GALLERY", "TESTIMONIAL", "OTHER"];

type ImageCardProps = {
  image: LandingImage;
  sections: LandingSection[];
  onUpdate: (id: string, data: UpdateImagePayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function ImageCard({ image, sections, onUpdate, onDelete }: ImageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<UpdateImagePayload>({
    type: image.type,
    alt: image.alt,
    sectionId: image.sectionId ?? "",
    order: image.order,
  });

  async function handleSave() {
    setIsSaving(true);
    try {
      await onUpdate(image.id, form);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <img className="aspect-video w-full object-cover" src={getImageUrl(image.url)} alt={image.alt} />
      <div className="space-y-4 p-4">
        <div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{image.type}</span>
          <p className="mt-3 break-all text-sm text-slate-400">{image.url}</p>
        </div>

        {isEditing ? (
          <div className="grid gap-4">
            <FormField label="Tipo">
              <Select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as LandingImageType })}>
                {imageTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Texto alternativo">
              <Input value={form.alt} onChange={(event) => setForm({ ...form, alt: event.target.value })} />
            </FormField>
            <FormField label="Ordem">
              <Input type="number" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} />
            </FormField>
            <FormField label="Secao">
              <Select value={form.sectionId} onChange={(event) => setForm({ ...form, sectionId: event.target.value })}>
                <option value="">Sem secao especifica</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>{section.order} - {section.type}</option>
                ))}
              </Select>
            </FormField>
          </div>
        ) : (
          <div className="text-sm leading-6 text-slate-300">
            <p><strong>Alt:</strong> {image.alt}</p>
            <p><strong>Ordem:</strong> {image.order}</p>
            <p><strong>Secao:</strong> {image.sectionId ?? "Sem secao"}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button className="rounded-lg bg-alpha-red px-3 py-2 text-sm font-bold" disabled={isSaving} onClick={handleSave} type="button">
                {isSaving ? "Salvando..." : "Salvar"}
              </button>
              <button className="rounded-lg bg-white/10 px-3 py-2 text-sm font-bold" onClick={() => setIsEditing(false)} type="button">
                Cancelar
              </button>
            </>
          ) : (
            <button className="rounded-lg bg-white/10 px-3 py-2 text-sm font-bold" onClick={() => setIsEditing(true)} type="button">
              Editar metadados
            </button>
          )}
          <button className="rounded-lg bg-red-500/20 px-3 py-2 text-sm font-bold text-red-100" onClick={() => onDelete(image.id)} type="button">
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}
