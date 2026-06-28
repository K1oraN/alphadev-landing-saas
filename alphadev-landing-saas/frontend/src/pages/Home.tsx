import { ButtonLink } from "../components/ui/ButtonLink";
import { PublicLayout } from "../components/layout/PublicLayout";

export function Home() {
  return (
    <PublicLayout>
      <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-alpha-red">
            SaaS para landing pages editáveis
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            AlphaDev Landing SaaS
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Uma base moderna para clientes criarem e gerenciarem landings públicas
            com textos, cores, imagens, logo, botões, contatos e conteúdo editável
            pelo painel administrativo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/site/demo">Ver landing demo</ButtonLink>
            <ButtonLink to="/admin" variant="secondary">
              Ver preview do admin
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-lg border border-red-500/25 bg-alpha-panel p-6 shadow-glow">
          <div className="rounded-lg border border-white/10 bg-black/40 p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="h-3 w-24 rounded-full bg-alpha-red" />
              <span className="text-xs text-slate-400">Preview dinâmico</span>
            </div>
            <div className="space-y-4">
              <div className="h-28 rounded-lg bg-gradient-to-br from-red-600/40 to-white/5" />
              <div className="h-4 w-4/5 rounded-full bg-white/20" />
              <div className="h-4 w-3/5 rounded-full bg-white/10" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-20 rounded-lg bg-white/5" />
                <div className="h-20 rounded-lg bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
