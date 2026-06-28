import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type PublicLayoutProps = {
  children: ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-alpha-dark text-slate-50">
      <header className="border-b border-white/10 bg-black/35 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link to="/" className="text-lg font-bold tracking-wide">
            AlphaDev <span className="text-alpha-red">Landing SaaS</span>
          </Link>

          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            <Link className="transition hover:text-white" to="/">
              Início
            </Link>
            <Link className="transition hover:text-white" to="/site/demo">
              Demo pública
            </Link>
            <Link className="transition hover:text-white" to="/admin">
              Admin preview
            </Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
