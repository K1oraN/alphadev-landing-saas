import type { ButtonHTMLAttributes, ReactNode } from "react";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  children: ReactNode;
};

export function LoadingButton({ isLoading, children, ...props }: LoadingButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 ${props.className ?? ""}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? "Salvando..." : children}
    </button>
  );
}
