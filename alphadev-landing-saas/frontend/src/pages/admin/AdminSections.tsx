import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { Select } from "../../components/ui/Select";
import { Switch } from "../../components/ui/Switch";
import { Textarea } from "../../components/ui/Textarea";
import {
  createSection,
  deleteSection,
  getMyLanding,
  getSections,
  toggleSection,
  updateSection,
} from "../../services/adminLandingService";
import type { AdminLanding, LandingSectionPayload } from "../../types/adminLanding";
import type { LandingSection, LandingSectionType } from "../../types/landing";
import { getErrorMessage } from "../../utils/getErrorMessage";

const sectionTypes: LandingSectionType[] = [
  "HERO",
  "ABOUT",
  "BENEFITS",
  "TESTIMONIALS",
  "GALLERY",
  "CTA",
  "FOOTER",
  "CUSTOM",
];

const emptyForm: LandingSectionPayload = {
  type: "CUSTOM",
  title: "",
  subtitle: "",
  content: "",
  buttonLabel: "",
  buttonUrl: "",
  order: 0,
  isActive: true,
};

export function AdminSections() {
  const [landing, setLanding] = useState<AdminLanding | null>(null);
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [form, setForm] = useState<LandingSectionPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const [landingData, sectionsData] = await Promise.all([getMyLanding(), getSections()]);
      setLanding(landingData);
      setSections(sectionsData);
      if (sectionsData.length > 0 && form.order === 0 && !editingId) {
        setForm((current) => ({ ...current, order: sectionsData.length + 1 }));
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Nao foi possivel carregar secoes."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, order: sections.length + 1 });
  }

  function startEditing(section: LandingSection) {
    setEditingId(section.id);
    setForm({
      type: section.type,
      title: section.title,
      subtitle: section.subtitle ?? "",
      content: section.content ?? "",
      buttonLabel: section.buttonLabel ?? "",
      buttonUrl: section.buttonUrl ?? "",
      order: section.order,
      isActive: section.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = editingId
        ? await updateSection(editingId, form)
        : await createSection(form);

      setMessage(response.message);
      resetForm();
      setSections(await getSections());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(section: LandingSection) {
    const confirmed = window.confirm(`Remover a secao "${section.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteSection(section.id);
      setMessage(response.message);
      setSections(await getSections());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function handleToggle(section: LandingSection) {
    try {
      const response = await toggleSection(section.id);
      setMessage(response.message);
      setSections(await getSections());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <AdminLayout
      title="Secoes"
      description="Crie, edite, ordene, ative ou remova secoes da landing publica."
      publicSlug={landing?.slug}
    >
      {loading ? <p className="text-slate-300">Carregando secoes...</p> : null}

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-xl font-black">{editingId ? "Editar secao" : "Nova secao"}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Conteudos separados por ponto e virgula viram cards em beneficios. Em depoimentos, use | para separar frases.
            </p>
          </div>
          <FormField label="Tipo">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LandingSectionType })}>
              {sectionTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Titulo">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Subtitulo">
            <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </FormField>
          <FormField label="Conteudo">
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Texto do botao">
              <Input value={form.buttonLabel} onChange={(e) => setForm({ ...form, buttonLabel: e.target.value })} />
            </FormField>
            <FormField label="Link do botao">
              <Input value={form.buttonUrl} onChange={(e) => setForm({ ...form, buttonUrl: e.target.value })} />
            </FormField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Ordem">
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </FormField>
            <Switch checked={form.isActive} label="Secao ativa" onChange={(checked) => setForm({ ...form, isActive: checked })} />
          </div>
          {message ? <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-100">{message}</p> : null}
          {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <LoadingButton isLoading={saving} type="submit">
              {editingId ? "Salvar secao" : "Criar secao"}
            </LoadingButton>
            {editingId ? (
              <button className="rounded-lg border border-white/10 px-5 py-3 text-sm font-bold" onClick={resetForm} type="button">
                Cancelar edicao
              </button>
            ) : null}
          </div>
        </form>

        <section className="space-y-4">
          <h2 className="text-xl font-black">Secoes cadastradas</h2>
          {sections.length === 0 && !loading ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-slate-300">
              Nenhuma secao cadastrada ainda.
            </div>
          ) : null}
          {sections.map((section) => (
            <article key={section.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{section.type}</span>
                  <h3 className="mt-3 text-lg font-black">{section.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">Ordem {section.order} - {section.isActive ? "Ativa" : "Inativa"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold" onClick={() => startEditing(section)} type="button">Editar</button>
                  <button className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold" onClick={() => handleToggle(section)} type="button">
                    {section.isActive ? "Desativar" : "Ativar"}
                  </button>
                  <button className="rounded-lg bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-100" onClick={() => handleDelete(section)} type="button">Excluir</button>
                </div>
              </div>
              {section.content ? <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{section.content}</p> : null}
            </article>
          ))}
        </section>
      </div>
    </AdminLayout>
  );
}
