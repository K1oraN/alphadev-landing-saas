import { Link } from "react-router-dom";
import { AdminLayout } from "../components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { getMyLanding } from "../services/adminLandingService";
import type { AdminLanding } from "../types/adminLanding";
import { getErrorMessage } from "../utils/getErrorMessage";

const cards = [
  { title: "Informacoes principais", to: "/admin/landing" },
  { title: "Secoes", to: "/admin/sections" },
  { title: "Aparencia", to: "/admin/appearance" },
  { title: "WhatsApp", to: "/admin/whatsapp" },
  { title: "SEO", to: "/admin/seo" },
];

export function AdminPreview() {
  const [landing, setLanding] = useState<AdminLanding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLanding() {
      try {
        setLoading(true);
        setLanding(await getMyLanding());
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Nao foi possivel carregar sua landing."));
      } finally {
        setLoading(false);
      }
    }

    loadLanding();
  }, []);

  return (
    <AdminLayout
      title="Visao Geral"
      description="Resumo da sua landing e atalhos para editar conteudo, aparencia, WhatsApp e SEO."
      publicSlug={landing?.slug}
    >
      {loading ? <p className="text-slate-300">Carregando painel...</p> : null}

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-100">
          {error}
        </div>
      ) : null}

      {landing ? (
        <div className="space-y-8">
          <section className="grid gap-4 lg:grid-cols-4">
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-5 lg:col-span-2">
              <p className="text-sm font-semibold text-red-100">Empresa</p>
              <h2 className="mt-2 text-3xl font-black">{landing.businessName}</h2>
              <p className="mt-3 text-sm leading-6 text-red-50/80">{landing.description}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">Slug atual</p>
              <strong className="mt-2 block break-all text-lg">/{landing.slug}</strong>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">Status</p>
              <strong className="mt-2 block text-lg">{landing.status}</strong>
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-black">Editar landing</h2>
              <a
                className="inline-flex rounded-lg border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10"
                href={`/site/${landing.slug}`}
                rel="noreferrer"
                target="_blank"
              >
                Abrir landing publica
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {cards.map((card) => (
                <Link
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:border-red-500/40 hover:bg-red-500/10"
                  key={card.to}
                  to={card.to}
                >
                  <h3 className="font-bold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Abrir tela de edicao.
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </AdminLayout>
  );
}
