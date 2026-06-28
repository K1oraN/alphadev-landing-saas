type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-left text-sm"
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span className="font-semibold text-slate-200">{label}</span>
      <span
        className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
          checked ? "bg-alpha-red" : "bg-white/20"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
