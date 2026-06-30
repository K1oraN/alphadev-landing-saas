import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  children: ReactNode;
  helper?: string;
};

export function FormField({ label, children, helper }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}
