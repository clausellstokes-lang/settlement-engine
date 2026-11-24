// A scratch ESM loader hook (no file under src/ changes): it rewrites, IN MEMORY, the one export of
// src/generators/safetyProfile.js so every call of generateSafetyProfile hands its arguments, its result and the
// active stream's seed to globalThis.__safetyTap. Used by measure.mjs only to read what the writer had in scope.
// It adds no draw: the wrapper reads getActiveRng()?.seed (a field read, no roll), as the file's own voiceOf does.
export async function load(url, context, nextLoad) {
  const r = await nextLoad(url, context);
  if (!url.endsWith('/src/generators/safetyProfile.js')) return r;
  let src = String(r.source);
  src = src.replace('export const generateSafetyProfile = (', 'const __generateSafetyProfile = (');
  src += '\nexport const generateSafetyProfile = (...a) => { const out = __generateSafetyProfile(...a); '
    + 'try { globalThis.__safetyTap?.(a, out, getActiveRng()?.seed); } catch (e) { globalThis.__safetyTapErr = e; } return out; };\n';
  return { ...r, source: src, shortCircuit: true };
}
