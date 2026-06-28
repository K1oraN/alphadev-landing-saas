import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";
import { LoadingButton } from "../ui/LoadingButton";
import { Select } from "../ui/Select";
import type { LandingSection } from "../../types/landing";
import type { LandingImageType, UploadImagePayload } from "../../types/image";

const imageTypes: LandingImageType[] = ["LOGO", "HERO", "GALLERY", "TESTIMONIAL", "OTHER"];

type ImageUploadFormProps = {
  sections: LandingSection[];
  isLoading: boolean;
  onSubmit: (payload: UploadImagePayload) => Promise<void>;
};

export function ImageUploadForm({ sections, isLoading, onSubmit }: ImageUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [type, setType] = useState<LandingImageType>("GALLERY");
  const [alt, setAlt] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setPreview(nextPreview);

    return () => URL.revokeObjectURL(nextPreview);
  }, [file]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      return;
    }

    await onSubmit({
      image: file,
      type,
      alt,
      sectionId,
      order,
    });

    setFile(null);
    setPreview("");
    setAlt("");
    setSectionId("");
    setOrder(0);
  }

  return (
    <form className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-xl font-black">Enviar imagem</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Formatos aceitos: JPG, PNG e WEBP. Limite de 5MB por imagem.
        </p>
      </div>

      <FormField label="Arquivo">
        <Input
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          type="file"
        />
      </FormField>

      {preview ? (
        <img className="aspect-video w-full rounded-lg object-cover" src={preview} alt="Preview do upload" />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Tipo">
          <Select value={type} onChange={(event) => setType(event.target.value as LandingImageType)}>
            {imageTypes.map((imageType) => (
              <option key={imageType} value={imageType}>
                {imageType}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Ordem">
          <Input type="number" value={order} onChange={(event) => setOrder(Number(event.target.value))} />
        </FormField>
      </div>

      <FormField label="Texto alternativo">
        <Input value={alt} onChange={(event) => setAlt(event.target.value)} />
      </FormField>

      <FormField label="Secao vinculada">
        <Select value={sectionId} onChange={(event) => setSectionId(event.target.value)}>
          <option value="">Sem secao especifica</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.order} - {section.type} - {section.title}
            </option>
          ))}
        </Select>
      </FormField>

      <LoadingButton className="w-full sm:w-auto" disabled={!file} isLoading={isLoading} type="submit">
        Enviar imagem
      </LoadingButton>
    </form>
  );
}
