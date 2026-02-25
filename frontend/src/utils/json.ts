export function safeJsonParse<T>(text: string): { ok: true; value: T } | { ok: false; error: string } {
  try {
    const value = JSON.parse(text) as T;
    return { ok: true, value };
  } catch {
    return { ok: false, error: "Invalid JSON. Must be a 2D array of numbers (number[][])." };
  }
}