import { ImageCard } from "./ImageCard";
import type { LandingSection } from "../../types/landing";
import type { LandingImage, LandingImageType, UpdateImagePayload } from "../../types/image";

type ImageSectionProps = {
  title: string;
  type: LandingImageType;
  images: LandingImage[];
  sections: LandingSection[];
  onUpdate: (id: string, data: UpdateImagePayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function ImageSection({ title, type, images, sections, onUpdate, onDelete }: ImageSectionProps) {
  const filteredImages = images.filter((image) => image.type === type);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-black">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{filteredImages.length} imagem(ns)</p>
      </div>

      {filteredImages.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-400">
          Nenhuma imagem cadastrada nesta categoria.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredImages.map((image) => (
            <ImageCard
              image={image}
              key={image.id}
              onDelete={onDelete}
              onUpdate={onUpdate}
              sections={sections}
            />
          ))}
        </div>
      )}
    </section>
  );
}
