
export function ResultPanel({ title, subtitle, data }: { title: string; subtitle?: string; data: unknown }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle ? <span className="text-xs text-slate-500">{subtitle}</span> : null}
        </div>
      </div>
      <div className="p-4">
        <pre className="max-h-[460px] overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}