import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { Switch } from "../../components/ui/Switch";
import { Textarea } from "../../components/ui/Textarea";
import { getMyLanding, updateWhatsapp } from "../../services/adminLandingService";
import type { AdminLanding, UpdateWhatsappPayload } from "../../types/adminLanding";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { getWhatsAppUrl } from "../../utils/landingContent";

const initialForm: UpdateWhatsappPayload = {
  phone: "",
  defaultMessage: "",
  buttonLabel: "",
  isEnabled: true,
};

export function AdminWhatsapp() {
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
        setForm(data.whatsappConfig ?? initialForm);
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Nao foi possivel carregar WhatsApp."));
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
      const response = await updateWhatsapp(form);
      setMessage(response.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  const previewUrl = form.phone ? getWhatsAppUrl(form.phone, form.defaultMessage) : "";

  return (
    <AdminLayout title="WhatsApp" description="Edite telefone, mensagem padrao e botao flutuante." publicSlug={landing?.slug}>
      {loading ? <p className="text-slate-300">Carregando WhatsApp...</p> : null}
      <form className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5" onSubmit={handleSubmit}>
        <Switch checked={form.isEnabled} label="Exibir botao de WhatsApp na landing" onChange={(checked) => setForm({ ...form, isEnabled: checked })} />
        <FormField label="Telefone">
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="5511999999999" />
        </FormField>
        <FormField label="Texto do botao">
          <Input value={form.buttonLabel} onChange={(e) => setForm({ ...form, buttonLabel: e.target.value })} />
        </FormField>
        <FormField label="Mensagem padrao">
          <Textarea value={form.defaultMessage} onChange={(e) => setForm({ ...form, defaultMessage: e.target.value })} />
        </FormField>
        {previewUrl ? (
          <div className="rounded-lg border border-white/10 bg-black/25 p-4 text-sm">
            <span className="block font-semibold text-white">Preview do link</span>
            <a className="mt-2 block break-all text-red-100" href={previewUrl} target="_blank" rel="noreferrer">
              {previewUrl}
            </a>
          </div>
        ) : null}
        {message ? <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-100">{message}</p> : null}
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
        <LoadingButton className="w-full sm:w-auto" isLoading={saving} type="submit">Salvar WhatsApp</LoadingButton>
      </form>
    </AdminLayout>
  );
}
