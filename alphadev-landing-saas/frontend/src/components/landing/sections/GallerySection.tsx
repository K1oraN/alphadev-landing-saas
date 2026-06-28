import type { LandingSectionProps } from "./types";

export function GallerySection({ section, images, theme }: LandingSectionProps) {
  const galleryImages = images.filter(
    (image) => image.sectionId === section.id || image.type === "GALLERY",
  );

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16 sm:px-6" style={{ backgroundColor: theme.secondaryColor }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.24em]"
            style={{ color: theme.primaryColor }}
          >
            Galeria
          </p>
          <h2 className="text-3xl font-black sm:text-4xl">{section.title}</h2>
          {section.subtitle ? <p className="mt-4 opacity-75">{section.subtitle}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {galleryImages.map((image) => (
            <img
              key={image.id}
              className="aspect-[4/3] w-full rounded-lg object-cover"
              src={image.url}
              alt={image.alt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
