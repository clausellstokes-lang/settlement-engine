/**
 * env-shim-hooks.mjs — the loader half of env-shim.mjs. See that file for the whole
 * rationale; this one only carries the mechanics.
 *
 * The hook rewrites ONLY files that literally contain `import.meta.env`, and ONLY those
 * loaded as ESM from the filesystem. Everything else is passed through untouched, so the
 * blast radius is the set of modules that would otherwise throw.
 */
let ENV = {};

export async function initialize(data) {
  ENV = data?.env ?? {};
}

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format !== 'module' || !url.startsWith('file:')) return result;
  const source = typeof result.source === 'string'
    ? result.source
    : result.source == null ? null : Buffer.from(result.source).toString('utf8');
  if (source == null || !source.includes('import.meta.env')) return result;
  const prelude = `import.meta.env ??= ${JSON.stringify(ENV)};`;
  return { ...result, source: `${prelude}\n${source}` };
}
