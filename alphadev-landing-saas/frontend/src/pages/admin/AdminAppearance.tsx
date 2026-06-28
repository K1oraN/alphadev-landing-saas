import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { getMyLanding, updateTheme } from "../../services/adminLandingService";
import type { AdminLanding, UpdateThemePayload } from "../../types/adminLanding";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { defaultLandingTheme } from "../../utils/landingTheme";

export function AdminAppearance() {
  const [landing, setLanding] = useState<AdminLanding | null>(null);
  const [form, setForm] = useState<UpdateThemePayload>(defaultLandingTheme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLanding() {
      try {
        const data = await getMyLanding();
        setLanding(data);
        setForm({ ...defaultLandingTheme, ...(data.theme ?? {}) });
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Nao foi possivel carregar a aparencia."));
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
      const response = await updateTheme(form);
      setMessage(response.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  const colorFields: Array<{ key: keyof UpdateThemePayload; label: string }> = [
    { key: "primaryColor", label: "Cor primaria" },
    { key: "secondaryColor", label: "Cor secundaria" },
    { key: "backgroundColor", label: "Cor de fundo" },
    { key: "textColor", label: "Cor do texto" },
    { key: "buttonColor", label: "Cor do botao" },
    { key: "buttonTextColor", label: "Cor do texto do botao" },
  ];

  return (
    <AdminLayout
      title="Aparencia"
      description="Configure cores, fonte e veja uma previa simples do tema."
      publicSlug={landing?.slug}
    >
      {loading ? <p className="text-slate-300">Carregando tema...</p> : null}
      <form className="grid gap-6 lg:grid-cols-[1fr_0.8fr]" onSubmit={handleSubmit}>
        <div className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-2">
          {colorFields.map((field) => (
            <FormField key={field.key} label={field.label}>
              <div className="flex gap-3">
                <Input
                  className="h-12 w-16 cursor-pointer p-1"
                  type="color"
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
                <Input
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              </div>
            </FormField>
          ))}
          <FormField label="Fonte">
            <Input value={form.fontFamily} onChange={(e) => setForm({ ...form, fontFamily: e.target.value })} />
          </FormField>
          <div className="sm:col-span-2">
            {message ? <p className="mb-3 rounded-lg bg-green-500/10 p-3 text-sm text-green-100">{message}</p> : null}
            {error ? <p className="mb-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
            <LoadingButton isLoading={saving} type="submit">Salvar aparencia</LoadingButton>
          </div>
        </div>

        <div
          className="rounded-lg border border-white/10 p-6"
          style={{
            backgroundColor: form.backgroundColor,
            color: form.textColor,
            fontFamily: form.fontFamily,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: form.primaryColor }}>
            Preview
          </p>
          <h2 className="mt-3 text-3xl font-black">Sua landing com novo tema</h2>
          <p className="mt-4 opacity-80">
            Essa previa mostra cores principais, texto e botao antes de salvar.
          </p>
          <button
            className="mt-6 rounded-lg px-5 py-3 text-sm font-bold"
            style={{ backgroundColor: form.buttonColor, color: form.buttonTextColor }}
            type="button"
          >
            Botao da landing
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
