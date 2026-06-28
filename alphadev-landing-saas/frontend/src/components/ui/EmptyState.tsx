type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-400">
      {message}
    </div>
  );
}
