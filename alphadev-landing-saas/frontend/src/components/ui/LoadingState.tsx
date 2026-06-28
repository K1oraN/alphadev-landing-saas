type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
      {message}
    </div>
  );
}
