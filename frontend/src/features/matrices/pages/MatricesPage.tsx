import { useMemo, useState } from "react";
import { matricesApi } from "../../../api/matrices.api";
import type { Matrix } from "../../../types/matrix.types";
import { safeJsonParse } from "../../../utils/json";
import { MatrixEditor } from "../components/MatrixEditor";
import { ResultPanel } from "../components/ResultPanel";

type Mode = "qr" | "rotation";

const DEFAULT_MATRIX = `[
  [1, 2, 3],
  [4, 5, 6]
]`;

export function MatricesPage() {
  const [mode, setMode] = useState<Mode>("qr");
  const [matrixText, setMatrixText] = useState(DEFAULT_MATRIX);
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);
  const [direction, setDirection] = useState<"cw" | "ccw">("cw");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const parsed = useMemo(() => safeJsonParse<Matrix>(matrixText), [matrixText]);

  const endpointLabel = mode === "qr"
    ? "POST /api/v1/matrices/qr"
    : "POST /api/v1/matrices/rotation";

  async function run() {
    setError(null);
    setResult(null);

    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    setLoading(true);
    try {
      const data =
        mode === "qr"
          ? await matricesApi.qr({ matrix: parsed.value })
          : await matricesApi.rotation({ matrix: parsed.value, degrees, direction });

      setResult(data);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        e?.message ||
        "Request failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-base font-semibold text-slate-900">Matrix Gateway</h1>
            <p className="text-xs text-slate-500">React + TS + Tailwind • Go API • Node Stats</p>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            Enterprise Demo
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Request Builder</h2>
                <p className="text-xs text-slate-500">{endpointLabel}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                    mode === "qr" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => setMode("qr")}
                >
                  QR
                </button>
                <button
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                    mode === "rotation"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => setMode("rotation")}
                >
                  Rotation
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <MatrixEditor
                label="Matrix JSON"
                hint="number[][]"
                value={matrixText}
                onChange={setMatrixText}
              />

              {mode === "rotation" ? (
                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Degrees</label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      value={degrees}
                      onChange={(e) => setDegrees(Number(e.target.value) as any)}
                    >
                      <option value={90}>90</option>
                      <option value={180}>180</option>
                      <option value={270}>270</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Direction</label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as any)}
                    >
                      <option value="cw">cw</option>
                      <option value="ccw">ccw</option>
                    </select>
                  </div>
                </div>
              ) : null}

              <button
                onClick={run}
                disabled={loading}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Running..." : "Run"}
              </button>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <div className="font-semibold">Error</div>
                  <div className="mt-1">{error}</div>
                </div>
              ) : null}
            </div>
          </div>

          <ResultPanel title="Parsed Preview" subtitle="Client-side validation" data={parsed.ok ? parsed.value : { error: parsed.error }} />
        </div>

        <div className="space-y-6">
          {result?.warning ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <div className="font-semibold">Warning</div>
              <div className="mt-1">{result.warning}</div>
              {result.detail ? <div className="mt-2 text-xs text-amber-700">{result.detail}</div> : null}
            </div>
          ) : null}

          <ResultPanel title="API Response" subtitle={endpointLabel} data={result ?? { info: "Run a request to see response." }} />
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          API base: <span className="font-mono">{import.meta.env.VITE_GO_API_BASE}</span>
        </div>
      </footer>
    </div>
  );
}