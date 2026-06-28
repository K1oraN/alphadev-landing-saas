import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { getMyLanding, updateLandingMain } from "../../services/adminLandingService";
import type { AdminLanding, LandingStatus, UpdateLandingMainPayload } from "../../types/adminLanding";
import { getErrorMessage } from "../../utils/getErrorMessage";

const initialForm: UpdateLandingMainPayload = {
  name: "",
  slug: "",
  businessName: "",
  description: "",
  status: "PUBLISHED",
};

export function AdminLandingMain() {
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
          name: data.name,
          slug: data.slug,
          businessName: data.businessName,
          description: data.description,
          status: data.status,
        });
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Nao foi possivel carregar sua landing."));
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
      const response = await updateLandingMain(form);
      setLanding((current) => (current ? { ...current, ...response.landing } : current));
      setMessage(response.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout
      title="Minha Landing"
      description="Edite dados principais, slug e status da landing publica."
      publicSlug={landing?.slug}
    >
      {loading ? <p className="text-slate-300">Carregando dados...</p> : null}
      <form className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5" onSubmit={handleSubmit}>
        <FormField label="Nome da landing">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <FormField label="Nome da empresa">
          <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
        </FormField>
        <FormField label="Slug" helper="Use letras, numeros e hifens. O backend normaliza automaticamente.">
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </FormField>
        <FormField label="Status">
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LandingStatus })}>
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="BLOCKED">BLOCKED</option>
          </Select>
        </FormField>
        <FormField label="Descricao">
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </FormField>
        {message ? <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-100">{message}</p> : null}
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
        <LoadingButton className="w-full sm:w-auto" isLoading={saving} type="submit">
          Salvar informacoes
        </LoadingButton>
      </form>
    </AdminLayout>
  );
}
