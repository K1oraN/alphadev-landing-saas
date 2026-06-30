import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileText,
  HeartPulse,
  Image as ImageIcon,
  Laptop,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  Palette,
  Plus,
  Rocket,
  Save,
  Settings2,
  Smartphone,
  Sparkles,
  Trash2,
  UploadCloud,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../components/admin/AdminLayout";
import { getImages } from "../services/adminImageService";
import { getMyLanding, getSections } from "../services/adminLandingService";
import type { AdminLanding } from "../types/adminLanding";
import type { LandingImage, LandingSection } from "../types/landing";
import { getErrorMessage } from "../utils/getErrorMessage";
import { getImageUrl } from "../utils/getImageUrl";
import { defaultLandingTheme } from "../utils/landingTheme";

const tabs = [
  "Identidade",
  "Cores",
  "Textos",
  "Botoes",
  "Fotos e Imagens",
  "Layout",
  "Secoes",
];

const sectionToggles = [
  "Hero",
  "Sobre",
  "Servicos",
  "Beneficios",
  "Depoimentos",
  "Planos",
  "Galeria",
  "FAQ",
  "Contato",
];

const fallbackSections: LandingSection[] = [
  {
    id: "hero-fallback",
    type: "HERO",
    title: "Cuidado e atendimento profissional para voce",
    subtitle: null,
    content:
      "Atendimento de qualidade, com atencao aos detalhes e foco no que realmente importa: o seu bem-estar.",
    buttonLabel: "Agendar agora",
    buttonUrl: "#contato",
    order: 1,
    isActive: true,
  },
  {
    id: "about-fallback",
    type: "ABOUT",
    title: "Sobre o profissional",
    subtitle: null,
    content:
      "Aqui, voce encontra um atendimento personalizado, com foco no seu bem-estar e resultados reais.",
    buttonLabel: null,
    buttonUrl: null,
    order: 2,
    isActive: true,
  },
  {
    id: "services-fallback",
    type: "CUSTOM",
    title: "Nossos servicos",
    subtitle: "Solucoes personalizadas para atender o que voce precisa.",
    content: "Consulta inicial|Acompanhamento|Avaliacao|Tratamentos|Planos|Orientacao personalizada",
    buttonLabel: null,
    buttonUrl: null,
    order: 3,
    isActive: true,
  },
  {
    id: "testimonials-fallback",
    type: "TESTIMONIALS",
    title: "O que nossos clientes dizem",
    subtitle: null,
    content:
      "Juliana Martins, Cliente: Excelente profissional! Me senti acolhida desde o primeiro atendimento.|Ricardo Almeida, Cliente: Atendimento impecavel, sempre atenciosa e dedicada.|Camila Souza, Cliente: Profissional incrivel e ambiente aconchegante.",
    buttonLabel: null,
    buttonUrl: null,
    order: 4,
    isActive: true,
  },
];

function splitContent(value?: string | null, separator = "|") {
  return (value ?? "")
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSection(sections: LandingSection[], type: LandingSection["type"]) {
  return sections.find((section) => section.type === type) ?? fallbackSections.find((section) => section.type === type);
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${props.className ?? ""}`}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${props.className ?? ""}`}
    />
  );
}

function MiniSwitch({ checked = true }: { checked?: boolean }) {
  return (
    <span className={`flex h-6 w-11 items-center rounded-full p-1 ${checked ? "bg-blue-600" : "bg-slate-200"}`}>
      <span className={`h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
    </span>
  );
}

export function AdminPreview() {
  const [landing, setLanding] = useState<AdminLanding | null>(null);
  const [sections, setSections] = useState<LandingSection[]>(fallbackSections);
  const [images, setImages] = useState<LandingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [brandColors, setBrandColors] = useState({
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    accentColor: "#3882f6",
    backgroundColor: "#fbfafc",
    textColor: "#0f172a",
    lightTextColor: "#64748b",
  });
  const [heroDraft, setHeroDraft] = useState({
    title: "Cuidado e atendimento profissional para voce",
    subtitle:
      "Atendimento de qualidade, com atencao aos detalhes e foco no que realmente importa: o seu bem-estar.",
    primaryCta: "Agendar agora",
    secondaryCta: "Saiba mais",
  });

  useEffect(() => {
    async function loadLanding() {
      try {
        setLoading(true);
        const [landingData, sectionsData, imagesData] = await Promise.all([
          getMyLanding(),
          getSections(),
          getImages(),
        ]);
        setLanding(landingData);
        setSections(sectionsData.length > 0 ? sectionsData : fallbackSections);
        setImages(imagesData);
        setBrandColors({
          primaryColor: landingData.theme?.primaryColor ?? defaultLandingTheme.primaryColor,
          secondaryColor: landingData.theme?.secondaryColor ?? "#1e40af",
          accentColor: landingData.theme?.buttonColor ?? "#3882f6",
          backgroundColor: landingData.theme?.backgroundColor ?? "#fbfafc",
          textColor: landingData.theme?.textColor ?? "#0f172a",
          lightTextColor: "#64748b",
        });
        const hero = getSection(sectionsData, "HERO");
        setHeroDraft({
          title: hero?.title ?? "Cuidado e atendimento profissional para voce",
          subtitle:
            hero?.content ??
            "Atendimento de qualidade, com atencao aos detalhes e foco no que realmente importa: o seu bem-estar.",
          primaryCta: hero?.buttonLabel ?? "Agendar agora",
          secondaryCta: "Saiba mais",
        });
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Nao foi possivel carregar sua landing."));
      } finally {
        setLoading(false);
      }
    }

    loadLanding();
  }, []);

  const businessName = landing?.businessName || "SuaMarca";
  const hero = getSection(sections, "HERO") ?? fallbackSections[0];
  const about = getSection(sections, "ABOUT") ?? fallbackSections[1];
  const services = getSection(sections, "CUSTOM") ?? fallbackSections[2];
  const testimonials = getSection(sections, "TESTIMONIALS") ?? fallbackSections[3];
  const heroImage = images.find((image) => image.type === "HERO");
  const aboutImage = images.find((image) => image.type === "OTHER") ?? heroImage;
  const galleryImages = images.filter((image) => image.type === "GALLERY");
  const serviceItems = splitContent(services.content).slice(0, 6);
  const testimonialItems = splitContent(testimonials.content).slice(0, 3);

  const versionInfo = useMemo(
    () => ({
      updatedAt: landing?.updatedAt ? new Date(landing.updatedAt).toLocaleString("pt-BR") : "24/05/2024 as 16:30",
      publishedAt: "20/05/2024 as 10:15",
      currentVersion: "v1.4 (Rascunho)",
    }),
    [landing?.updatedAt],
  );

  return (
    <AdminLayout
      title="Painel Administrativo"
      description="Personalizacao da Landing Page"
      publicSlug={landing?.slug}
    >
      {loading ? <p className="mb-4 text-sm font-semibold text-slate-500">Carregando painel...</p> : null}

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]">
        <div className="min-w-0 space-y-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <div className="flex min-w-max gap-1">
              {tabs.map((tab, index) => (
                <button
                  className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-black transition ${
                    index === 0
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  key={tab}
                  type="button"
                >
                  {index === 0 ? <Users size={16} /> : null}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Cores da Marca" subtitle="Personalize as cores principais do seu site.">
              <div className="space-y-4">
                {[
                  ["primaryColor", "Cor primaria"],
                  ["secondaryColor", "Cor secundaria"],
                  ["accentColor", "Cor de destaque"],
                  ["backgroundColor", "Cor de fundo"],
                  ["textColor", "Cor do texto"],
                  ["lightTextColor", "Cor do texto claro"],
                ].map(([key, label]) => (
                  <Field key={key} label={label}>
                    <div className="flex gap-3">
                      <TextInput
                        className="h-11 w-14 cursor-pointer p-1"
                        onChange={(event) =>
                          setBrandColors((current) => ({ ...current, [key]: event.target.value }))
                        }
                        type="color"
                        value={brandColors[key as keyof typeof brandColors]}
                      />
                      <TextInput
                        onChange={(event) =>
                          setBrandColors((current) => ({ ...current, [key]: event.target.value }))
                        }
                        value={brandColors[key as keyof typeof brandColors]}
                      />
                    </div>
                  </Field>
                ))}
              </div>
            </Card>

            <Card title="Hero da Pagina" subtitle="Edite o conteudo da secao principal.">
              <div className="space-y-4">
                <Field label="Titulo">
                  <TextInput
                    onChange={(event) => setHeroDraft({ ...heroDraft, title: event.target.value })}
                    value={heroDraft.title}
                  />
                </Field>
                <Field label="Subtitulo">
                  <TextArea
                    onChange={(event) => setHeroDraft({ ...heroDraft, subtitle: event.target.value })}
                    value={heroDraft.subtitle}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="CTA principal">
                    <TextInput
                      onChange={(event) => setHeroDraft({ ...heroDraft, primaryCta: event.target.value })}
                      value={heroDraft.primaryCta}
                    />
                  </Field>
                  <Field label="CTA secundario">
                    <TextInput
                      onChange={(event) => setHeroDraft({ ...heroDraft, secondaryCta: event.target.value })}
                      value={heroDraft.secondaryCta}
                    />
                  </Field>
                </div>
                {[
                  "Exibir horarios de atendimento",
                  "Exibir botao de contato",
                  "Exibir card em destaque",
                ].map((label) => (
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2" key={label}>
                    <span className="text-sm font-bold text-slate-600">{label}</span>
                    <MiniSwitch />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card title="Fotos e Imagens" subtitle="Gerencie e substitua as fotos da sua landing page.">
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="grid place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <UploadCloud className="text-blue-600" size={42} strokeWidth={1.7} />
                <p className="mt-3 text-sm font-black text-slate-950">Arraste e solte suas imagens aqui</p>
                <p className="mt-2 text-xs text-slate-500">PNG, JPG ou WEBP ate 10MB</p>
                <Link
                  className="mt-4 inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-xs font-black text-blue-700"
                  to="/admin/images"
                >
                  Selecionar arquivos
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Imagem principal (Hero)", heroImage],
                  ["Foto do profissional", aboutImage],
                ].map(([label, image]) => (
                  <div key={label as string}>
                    <p className="mb-2 text-sm font-black text-slate-700">{label as string}</p>
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      {image ? (
                        <img
                          alt={(image as LandingImage).alt}
                          className="aspect-[16/9] w-full object-cover"
                          src={getImageUrl((image as LandingImage).url)}
                        />
                      ) : (
                        <div className="grid aspect-[16/9] place-items-center">
                          <ImageIcon className="text-blue-600" size={34} />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Link className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-black text-blue-700" to="/admin/images">
                        Substituir
                      </Link>
                      <button className="rounded-md border border-red-100 px-3 py-1.5 text-xs font-black text-red-600" type="button">
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <p className="mb-2 text-sm font-black text-slate-700">Galeria</p>
                  <div className="grid grid-cols-4 gap-3">
                    {galleryImages.slice(0, 3).map((image) => (
                      <img
                        alt={image.alt}
                        className="aspect-square rounded-lg object-cover"
                        key={image.id}
                        src={getImageUrl(image.url)}
                      />
                    ))}
                    <Link
                      className="grid aspect-square place-items-center rounded-lg border border-dashed border-slate-300 text-blue-600"
                      to="/admin/images"
                    >
                      <Plus size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-500">
              {["Hero: 1920x1080px", "Profissional: 800x1000px", "Galeria: 1200x800px", "Banners: 1200x500px"].map((item) => (
                <span className="rounded-md bg-slate-100 px-3 py-1.5" key={item}>{item}</span>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Secoes da Landing Page" subtitle="Ative, desative e reordene as secoes da sua pagina.">
              <div className="space-y-2">
                {sectionToggles.map((section) => (
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2" key={section}>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">::</span>
                      <span className="text-sm font-bold text-slate-700">{section}</span>
                    </div>
                    <MiniSwitch />
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Tipografia e Estilo" subtitle="Defina fontes, estilos e espacamentos do site.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Fonte dos titulos">
                  <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                    <option>Poppins</option>
                    <option>Inter</option>
                    <option>Montserrat</option>
                  </select>
                </Field>
                <Field label="Fonte do texto">
                  <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                  </select>
                </Field>
              </div>
              <div className="mt-4 grid grid-cols-2 rounded-lg border border-slate-200 p-1">
                <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-black text-white" type="button">
                  Preenchido
                </button>
                <button className="rounded-md px-3 py-2 text-sm font-black text-blue-700" type="button">
                  Contornado
                </button>
              </div>
              <div className="mt-5 space-y-5">
                {[
                  ["Raio das bordas", "12"],
                  ["Espacamento entre secoes", "48"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
                      <span>{label}</span>
                      <span>{value}px</span>
                    </div>
                    <input className="w-full accent-blue-600" defaultValue={value} max="80" min="0" type="range" />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                {[Sparkles, Settings2, HeartPulse].map((Icon, index) => (
                  <button
                    className={`grid h-11 w-14 place-items-center rounded-lg border ${index === 0 ? "border-blue-600 text-blue-600" : "border-slate-200 text-slate-500"}`}
                    key={index}
                    type="button"
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <Card title="Depoimentos" subtitle="Gerencie os depoimentos exibidos no site.">
            <div className="grid gap-3 md:grid-cols-2">
              {testimonialItems.map((item, index) => {
                const [person, text] = item.split(":");
                const name = person?.split(",")[0] ?? `Cliente ${index + 1}`;
                return (
                  <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3" key={item}>
                    <div className="flex min-w-0 gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-black text-blue-700">
                        {name.slice(0, 1)}
                      </span>
                      <div className="min-w-0">
                        <strong className="block truncate text-sm text-slate-950">{name}</strong>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{text ?? item}</p>
                      </div>
                    </div>
                    <Trash2 className="shrink-0 text-red-500" size={16} />
                  </div>
                );
              })}
            </div>
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-black text-blue-700" type="button">
              <Plus size={16} />
              Adicionar depoimento
            </button>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="SEO e Informacoes" subtitle="Configure as informacoes para SEO e contato.">
              <div className="grid gap-4">
                <Field label="Titulo da pagina (SEO)">
                  <TextInput defaultValue={landing?.seoConfig?.metaTitle ?? `${businessName} | Atendimento profissional`} />
                </Field>
                <Field label="Descricao SEO">
                  <TextArea defaultValue={landing?.seoConfig?.metaDescription ?? landing?.description ?? ""} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="WhatsApp">
                    <TextInput defaultValue={landing?.whatsappConfig?.phone ?? "(11) 98765-4321"} />
                  </Field>
                  <Field label="Telefone">
                    <TextInput defaultValue="(11) 3456-7890" />
                  </Field>
                  <Field label="E-mail">
                    <TextInput defaultValue="contato@suamarca.com.br" />
                  </Field>
                  <Field label="Endereco">
                    <TextInput defaultValue="Rua das Flores, 123 - Sao Paulo, SP" />
                  </Field>
                </div>
              </div>
            </Card>

            <Card title="Versionamento e Publicacao" subtitle="Gerencie versoes e status da sua landing page.">
              <div className="space-y-3 text-sm">
                {[
                  ["Status atual", landing?.status ?? "Rascunho"],
                  ["Ultima atualizacao", versionInfo.updatedAt],
                  ["Versao atual", versionInfo.currentVersion],
                  ["Publicado em", versionInfo.publishedAt],
                ].map(([label, value]) => (
                  <div className="flex justify-between gap-4 border-b border-slate-100 pb-2" key={label}>
                    <span className="font-bold text-slate-500">{label}</span>
                    <span className="text-right font-black text-slate-800">{value}</span>
                  </div>
                ))}
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-black text-green-700">v1.3 - Publicado</p>
                  <p className="mt-1 text-xs text-slate-500">20/05/2024 as 10:15</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-black text-amber-700">v1.2 - Rascunho</p>
                  <p className="mt-1 text-xs text-slate-500">18/05/2024 as 09:42</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-black text-blue-700" type="button">
                    <Download size={16} />
                    Restaurar versao
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-black text-blue-700" type="button">
                    <CalendarDays size={16} />
                    Agendar publicacao
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">Pre-visualizacao em tempo real</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Veja como sua landing page aparece para seus visitantes.
                </p>
              </div>
              <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
                <button
                  className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-black ${previewMode === "desktop" ? "bg-blue-600 text-white" : "text-slate-600"}`}
                  onClick={() => setPreviewMode("desktop")}
                  type="button"
                >
                  <Monitor size={16} />
                  Desktop
                </button>
                <button
                  className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-black ${previewMode === "mobile" ? "bg-blue-600 text-white" : "text-slate-600"}`}
                  onClick={() => setPreviewMode("mobile")}
                  type="button"
                >
                  <Smartphone size={16} />
                  Mobile
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className={`${previewMode === "mobile" ? "mx-auto max-w-[300px]" : "w-full"} overflow-hidden rounded-lg bg-white shadow-sm`}>
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-[9px] font-black">
                  <span className="flex items-center gap-2 text-slate-950">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white">
                      <Sparkles size={11} />
                    </span>
                    {businessName}
                  </span>
                  <span className="hidden gap-3 text-slate-500 sm:flex">
                    <span>Inicio</span>
                    <span>Sobre</span>
                    <span>Servicos</span>
                    <span>FAQ</span>
                  </span>
                  <span className="rounded bg-blue-600 px-3 py-1 text-white">{heroDraft.primaryCta}</span>
                </div>
                <div className={`grid gap-3 p-4 ${previewMode === "desktop" ? "grid-cols-[0.8fr_1.2fr]" : ""}`}>
                  <div className="py-4">
                    <h3 className="text-2xl font-black leading-tight text-slate-950">{heroDraft.title || hero.title}</h3>
                    <p className="mt-3 text-[11px] leading-5 text-slate-500">{heroDraft.subtitle || hero.content}</p>
                    <div className="mt-4 flex gap-2">
                      <span className="rounded bg-blue-600 px-3 py-2 text-[10px] font-black text-white">{heroDraft.primaryCta}</span>
                      <span className="rounded border border-blue-200 px-3 py-2 text-[10px] font-black text-blue-700">{heroDraft.secondaryCta}</span>
                    </div>
                  </div>
                  <div className="relative min-h-40 overflow-hidden rounded-lg bg-blue-50">
                    {heroImage ? (
                      <img alt={heroImage.alt} className="h-full w-full object-cover" src={getImageUrl(heroImage.url)} />
                    ) : (
                      <div className="grid h-full min-h-40 place-items-center bg-[radial-gradient(circle_at_30%_20%,#dbeafe,transparent_35%),linear-gradient(135deg,#f8fafc,#ffffff,#dbeafe)]">
                        <Laptop className="text-blue-600" size={38} />
                      </div>
                    )}
                    <div className="absolute right-3 top-3 w-24 rounded-lg bg-white/95 p-2 text-[8px] shadow-lg">
                      <strong>Proximos horarios</strong>
                      {["14:00", "09:00", "16:00"].map((hour) => (
                        <div className="mt-1 flex justify-between" key={hour}>
                          <span className="text-slate-500">Hoje</span>
                          <span className="text-blue-700">{hour}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 px-4 pb-4">
                  {["Atendimento humanizado", "Horarios flexiveis", "Equipe qualificada"].map((item) => (
                    <div className="rounded-lg border border-slate-100 p-2 text-[9px] font-black text-slate-700" key={item}>
                      <Clock3 className="mb-1 text-blue-600" size={15} />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 bg-slate-50 p-4 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-lg bg-slate-100">
                    {aboutImage ? (
                      <img alt={aboutImage.alt} className="aspect-[16/10] w-full object-cover" src={getImageUrl(aboutImage.url)} />
                    ) : (
                      <div className="grid aspect-[16/10] place-items-center">
                        <Users className="text-blue-600" size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950">{about.title}</h3>
                    <p className="mt-2 text-[10px] leading-4 text-slate-500">{about.content}</p>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-base font-black text-slate-950">{services.title}</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {serviceItems.slice(0, 6).map((item) => (
                      <div className="rounded-lg border border-slate-100 p-2 text-[9px] font-bold text-slate-600" key={item}>
                        <HeartPulse className="mx-auto mb-1 text-blue-600" size={14} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 text-center">
                  <h3 className="text-sm font-black text-slate-950">{testimonials.title}</h3>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {testimonialItems.slice(0, 3).map((item, index) => (
                      <div className="rounded-lg bg-white p-2 text-left text-[9px] leading-4 text-slate-500" key={item}>
                        "{item.split(":")[1] ?? item}"
                        <strong className="mt-2 block text-slate-800">Cliente {index + 1}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="m-4 rounded-lg bg-blue-50 p-4 text-center">
                  <h3 className="text-base font-black text-slate-950">Pronto para agendar seu atendimento?</h3>
                  <span className="mt-3 inline-flex rounded bg-blue-600 px-4 py-2 text-[10px] font-black text-white">
                    Agendar agora
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 border-t border-slate-100 p-4 text-[8px] text-slate-500">
                  {[MessageCircle, Mail, MapPin, Eye].map((Icon, index) => (
                    <span className="flex items-center gap-1" key={index}>
                      <Icon className="text-blue-600" size={11} />
                      Contato
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Link className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700" to="/admin/landing">
                <FileText size={16} />
                Editar
              </Link>
              <Link className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700" to="/admin/appearance">
                <Palette size={16} />
                Cores
              </Link>
              <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white" to="/admin/sections">
                <ChevronRight size={16} />
                Secoes
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}
