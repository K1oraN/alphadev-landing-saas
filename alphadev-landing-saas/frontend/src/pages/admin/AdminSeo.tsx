import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { Textarea } from "../../components/ui/Textarea";
import { getMyLanding, updateSeo } from "../../services/adminLandingService";
import type { AdminLanding, UpdateSeoPayload } from "../../types/adminLanding";
import { getErrorMessage } from "../../utils/getErrorMessage";

const initialForm: UpdateSeoPayload = {
  metaTitle: "",
  metaDescription: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  canonicalUrl: "",
};

export function AdminSeo() {
  const [landing, setLanding] = useState<AdminLanding | null>(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLanding() {
      try {
        const data = await getMyLanding();
        setLanding(data);
        setForm({
          metaTitle: data.seoConfig?.metaTitle ?? data.businessName,
          metaDescription: data.seoConfig?.metaDescription ?? data.description,
          ogTitle: data.seoConfig?.ogTitle ?? "",
          ogDescription: data.seoConfig?.ogDescription ?? "",
          ogImage: data.seoConfig?.ogImage ?? "",
          canonicalUrl: data.seoConfig?.canonicalUrl ?? "",
        });
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Nao foi possivel carregar SEO."));
      } finally {
        setLoading(false);
      }
    }

    loadLanding();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await updateSeo(form);
      setMessage(response.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="SEO" description="Configure metadados basicos para compartilhamento e buscadores." publicSlug={landing?.slug}>
      {loading ? <p className="text-slate-300">Carregando SEO...</p> : null}
      <form className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5" onSubmit={handleSubmit}>
        <FormField label={`Meta title (${form.metaTitle.length}/70)`}>
          <Input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
        </FormField>
        <FormField label={`Meta description (${form.metaDescription.length}/180)`}>
          <Textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
        </FormField>
        <FormField label="OG title">
          <Input value={form.ogTitle} onChange={(e) => setForm({ ...form, ogTitle: e.target.value })} />
        </FormField>
        <FormField label="OG description">
          <Textarea value={form.ogDescription} onChange={(e) => setForm({ ...form, ogDescription: e.target.value })} />
        </FormField>
        <FormField label="OG image">
          <Input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} />
        </FormField>
        <FormField label="Canonical URL">
          <Input value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} />
        </FormField>
        {message ? <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-100">{message}</p> : null}
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
        <LoadingButton className="w-full sm:w-auto" isLoading={saving} type="submit">Salvar SEO</LoadingButton>
      </form>
    </AdminLayout>
  );
}
