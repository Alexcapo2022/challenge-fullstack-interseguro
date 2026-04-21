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

interface Props {
  onLogout: () => void;
}

export function MatricesPage({ onLogout }: Props) {
  const [mode, setMode] = useState<Mode>("qr");
  const [matrixText, setMatrixText] = useState(DEFAULT_MATRIX);
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);
  const [direction, setDirection] = useState<"cw" | "ccw">("cw");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const parsed = useMemo(() => safeJsonParse<Matrix>(matrixText), [matrixText]);

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
        e?.response?.data?.error ||
        e?.response?.data?.detail ||
        e?.message ||
        "Error en la petición";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-12">
      {/* 🌌 Header Premium */}
      <header className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Matrix Studio</h1>
            <p className="text-xs text-slate-400 font-medium">Interseguro Digital Assets</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition-colors"
        >
          Cerrar Sesión
        </button>
      </header>

      <main className="mx-auto max-w-7xl px-6 grid gap-8 lg:grid-cols-[450px_1fr] animate-fade-in">
        <aside className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Configuración</h2>
            
            <div className="flex gap-2 p-1.5 bg-slate-900/50 rounded-2xl mb-6">
              <button
                className={`flex-1 py-2.5 rounded-[14px] text-sm font-semibold transition-all ${
                  mode === "qr" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setMode("qr")}
              >
                QR Dec.
              </button>
              <button
                className={`flex-1 py-2.5 rounded-[14px] text-sm font-semibold transition-all ${
                  mode === "rotation" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setMode("rotation")}
              >
                Rotación
              </button>
            </div>

            <div className="space-y-6">
              <MatrixEditor
                label="Entrada de Datos (JSON)"
                hint="Ejemplo: [[1,2],[3,4]]"
                value={matrixText}
                onChange={setMatrixText}
              />

              {mode === "rotation" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grados</label>
                    <select
                      className="glass-input w-full px-3 py-2.5 text-sm"
                      value={degrees}
                      onChange={(e) => setDegrees(Number(e.target.value) as any)}
                    >
                      <option value={90}>90°</option>
                      <option value={180}>180°</option>
                      <option value={270}>270°</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sentido</label>
                    <select
                      className="glass-input w-full px-3 py-2.5 text-sm"
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as any)}
                    >
                      <option value="cw">Horario</option>
                      <option value="ccw">Antihorario</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={run}
                disabled={loading}
                className="btn-primary w-full py-4 rounded-2xl font-bold text-sm tracking-wide disabled:opacity-50"
              >
                {loading ? "PROCESANDO..." : "EJECUTAR TRANSFORMACIÓN"}
              </button>

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                  <div className="font-bold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Error
                  </div>
                  <div className="mt-1">{error}</div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Validación</h3>
            <div className="max-h-48 overflow-auto rounded-xl bg-black/30 p-4 font-mono text-xs">
              <pre className={parsed.ok ? "text-indigo-300" : "text-red-400"}>
                {JSON.stringify(parsed.ok ? parsed.value : { error: parsed.error }, null, 2)}
              </pre>
            </div>
          </div>
        </aside>

        <section className="space-y-8">
          {result?.warning && (
            <div className="glass-card border-amber-500/30 bg-amber-500/10 p-5 animate-fade-in">
              <div className="flex items-center gap-3 text-amber-400 font-bold mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Atención (Microservicio Node)
              </div>
              <p className="text-sm text-slate-300">{result.warning}</p>
              {result.detail && <p className="mt-3 text-xs text-amber-500/70 font-mono">{result.detail}</p>}
            </div>
          )}

          {!result && (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
              <div className="w-24 h-24 mb-6 border-4 border-dashed border-slate-600 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-2xl font-bold">Sin resultados</h2>
              <p className="mt-2">Ingresa una matriz y ejecuta para ver la magia.</p>
            </div>
          )}

          {result && (
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                 <div className="glass-card p-6">
                    <h3 className="text-indigo-400 font-bold mb-4 uppercase text-xs tracking-widest">Resultado Principal</h3>
                    <div className="max-h-96 overflow-auto rounded-2xl bg-black/40 p-5 border border-white/5 shadow-inner">
                      <ResultPanel 
                        title={mode === "qr" ? "Q y R" : "Matriz Rotada"} 
                        subtitle="Cálculo matemático Go" 
                        data={mode === "qr" ? result.qr : result.rotated} 
                      />
                    </div>
                 </div>
                 
                 <div className="glass-card p-6">
                    <h3 className="text-pink-400 font-bold mb-4 uppercase text-xs tracking-widest">Estadísticas (Node API)</h3>
                    <div className="max-h-96 overflow-auto rounded-2xl bg-black/40 p-5 border border-white/5 shadow-inner">
                      <ResultPanel 
                        title="Agregados" 
                        subtitle="Procesado por Express" 
                        data={result.stats ?? { info: "No disponible" }} 
                      />
                    </div>
                 </div>
              </div>

               {/* ✨ Bonus: Info de Arquitectura Interactiva */}
               <div className="glass-card p-6 bg-indigo-500/5">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg">JWT AUTH: OK</div>
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg">SWAGGER: UP</div>
                    <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg">DOCKER: READY</div>
                  </div>
               </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}