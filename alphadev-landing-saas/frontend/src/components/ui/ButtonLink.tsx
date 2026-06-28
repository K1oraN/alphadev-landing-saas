import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  children: ReactNode;
  to: string;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ children, to, variant = "primary" }: ButtonLinkProps) {
  const variants = {
    primary: "bg-alpha-red text-white shadow-glow hover:bg-red-600",
    secondary: "border border-white/15 bg-white/5 text-white hover:bg-white/10",
  };

  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}
