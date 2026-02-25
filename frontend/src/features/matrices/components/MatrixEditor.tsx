
type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
};

export function MatrixEditor({ label, value, onChange, hint }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-slate-800">{label}</label>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      <textarea
        className="min-h-[180px] w-full resize-y rounded-2xl border border-slate-200 bg-white p-3 font-mono text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}