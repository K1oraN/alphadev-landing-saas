import {
  BarChart3,
  Bell,
  Eye,
  FileText,
  HelpCircle,
  Image,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Palette,
  Plug,
  Rocket,
  Save,
  Search,
  Settings,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
  description?: string;
  publicSlug?: string;
};

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Landing Page", to: "/admin/landing", icon: Layers3 },
  { label: "Aparencia", to: "/admin/appearance", icon: Palette },
  { label: "Conteudo", to: "/admin/content", icon: FileText },
  { label: "Imagens", to: "/admin/images", icon: Image },
  { label: "Secoes", to: "/admin/sections", icon: BarChart3 },
  { label: "Depoimentos", to: "/admin/testimonials", icon: Star },
  { label: "FAQ", to: "/admin/faq", icon: HelpCircle },
  { label: "SEO", to: "/admin/seo", icon: Search },
  { label: "Integracoes", to: "/admin/integrations", icon: Plug },
  { label: "Publicacao", to: "/admin/publication", icon: Rocket },
  { label: "Leads", to: "/admin/leads", icon: Users },
  { label: "Configuracoes", to: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-200 px-6">
        <NavLink className="flex min-w-0 items-center gap-3" to="/admin">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Sparkles size={18} />
          </span>
          <span className="truncate text-lg font-black text-slate-950">SuaMarca</span>
        </NavLink>
        <button
          aria-label="Fechar menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
              key={item.to}
              onClick={() => setIsOpen(false)}
              to={item.to}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="m-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <Bell className="text-blue-600" size={22} />
        <p className="mt-3 text-sm font-black text-slate-950">Precisa de ajuda?</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Acesse nossas orientacoes para configurar sua landing.
        </p>
        <button
          className="mt-3 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-black text-blue-700"
          type="button"
        >
          Abrir ajuda
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Helmet>
        <title>{title} | Painel Administrativo</title>
      </Helmet>

      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <div className="relative h-full">{sidebar}</div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="flex min-h-16 flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <button
                aria-label="Abrir menu"
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden"
                onClick={() => setIsOpen(true)}
                type="button"
              >
                <Menu size={22} />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-black tracking-tight text-slate-950">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {description ?? "Personalizacao da Landing Page"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                href="/"
                rel="noreferrer"
                target="_blank"
              >
                <Eye size={17} />
                Visualizar
              </a>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                type="button"
              >
                <Save size={17} />
                Salvar rascunho
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                type="button"
              >
                <Rocket size={17} />
                Publicar alteracoes
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-black text-slate-500 transition hover:bg-slate-100"
                onClick={handleLogout}
                type="button"
              >
                <LogOut size={17} />
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
