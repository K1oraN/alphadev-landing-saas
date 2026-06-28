import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../hooks/useAuth";

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
  description?: string;
  publicSlug?: string;
};

const navItems = [
  { label: "Visao Geral", to: "/admin" },
  { label: "Minha Landing", to: "/admin/landing" },
  { label: "Secoes", to: "/admin/sections" },
  { label: "Imagens", to: "/admin/images" },
  { label: "Leads", to: "/admin/leads" },
  { label: "Aparencia", to: "/admin/appearance" },
  { label: "WhatsApp", to: "/admin/whatsapp" },
  { label: "SEO", to: "/admin/seo" },
];

export function AdminLayout({ children, title, description, publicSlug }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-alpha-dark text-slate-50">
      <Helmet>
        <title>{title} | AlphaDev Landing SaaS</title>
      </Helmet>
      <header className="border-b border-white/10 bg-black/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-alpha-red">
                AlphaDev Landing SaaS
              </p>
              <h1 className="mt-2 text-2xl font-black">{title}</h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="text-sm text-slate-300">
                <span className="block font-semibold text-white">{user?.name}</span>
                <span className="break-all">{user?.email}</span>
              </div>
              <button
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                onClick={handleLogout}
                type="button"
              >
                Sair
              </button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-alpha-red text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
            {publicSlug ? (
              <a
                className="rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10"
                href={`/site/${publicSlug}`}
                rel="noreferrer"
                target="_blank"
              >
                Ver Landing Publica
              </a>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
