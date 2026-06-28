import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { ImageSection } from "../../components/admin/ImageSection";
import { ImageUploadForm } from "../../components/admin/ImageUploadForm";
import { getMyLanding, getSections } from "../../services/adminLandingService";
import {
  deleteImage,
  getImages,
  updateImage,
  uploadImage,
} from "../../services/adminImageService";
import type { AdminLanding } from "../../types/adminLanding";
import type { LandingSection } from "../../types/landing";
import type { LandingImage, LandingImageType, UpdateImagePayload, UploadImagePayload } from "../../types/image";
import { getErrorMessage } from "../../utils/getErrorMessage";

const imageGroups: Array<{ title: string; type: LandingImageType }> = [
  { title: "Logo", type: "LOGO" },
  { title: "Imagem principal / Hero", type: "HERO" },
  { title: "Galeria", type: "GALLERY" },
  { title: "Depoimentos", type: "TESTIMONIAL" },
  { title: "Outras imagens", type: "OTHER" },
];

export function AdminImages() {
  const [landing, setLanding] = useState<AdminLanding | null>(null);
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [images, setImages] = useState<LandingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const [landingData, sectionsData, imagesData] = await Promise.all([
        getMyLanding(),
        getSections(),
        getImages(),
      ]);
      setLanding(landingData);
      setSections(sectionsData);
      setImages(imagesData);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Nao foi possivel carregar imagens."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpload(payload: UploadImagePayload) {
    setUploading(true);
    setMessage("");
    setError("");

    try {
      const response = await uploadImage(payload);
      setMessage(response.message);
      setImages(await getImages());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setUploading(false);
    }
  }

  async function handleUpdate(id: string, data: UpdateImagePayload) {
    setMessage("");
    setError("");

    try {
      const response = await updateImage(id, data);
      setMessage(response.message);
      setImages(await getImages());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Tem certeza que deseja remover esta imagem?");

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await deleteImage(id);
      setMessage(response.message);
      setImages(await getImages());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <AdminLayout
      title="Imagens"
      description="Envie, visualize, edite metadados e remova imagens da sua landing."
      publicSlug={landing?.slug}
    >
      {loading ? <p className="text-slate-300">Carregando imagens...</p> : null}

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <ImageUploadForm isLoading={uploading} onSubmit={handleUpload} sections={sections} />
          {message ? <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-100">{message}</p> : null}
          {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
        </div>

        <div className="space-y-10">
          {imageGroups.map((group) => (
            <ImageSection
              images={images}
              key={group.type}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              sections={sections}
              title={group.title}
              type={group.type}
            />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
