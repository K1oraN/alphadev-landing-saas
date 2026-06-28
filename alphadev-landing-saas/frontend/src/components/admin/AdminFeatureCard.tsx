type AdminFeatureCardProps = {
  title: string;
  description: string;
};

export function AdminFeatureCard({ title, description }: AdminFeatureCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </article>
  );
}
