// LAYER-MAP jsx-loader.mjs — lets plain node import the tree's .jsx modules (esbuild transform, automatic runtime).
// With LAYER_MAP_HOOK=1 it also wraps the state-prose kernel's `eligibleVariants` so a measuring script can see
// every real eligibility call (pool, options, result) through `globalThis.__EV_HOOK`. The tree's file is not changed.
// Use: node --import <dir>/jsx-register.mjs script.mjs   (TREE must point at the tree, for esbuild's resolution)
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const req = createRequire((process.env.TREE || process.cwd()) + '/package.json');
const { transform } = req('esbuild');
export async function load(url, context, next) {
  if (url.endsWith('.jsx')) {
    const src = await readFile(new URL(url), 'utf8');
    const out = await transform(src, { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: url });
    return { format: 'module', source: out.code, shortCircuit: true };
  }
  if (process.env.LAYER_MAP_HOOK === '1' && url.endsWith('/stateProse/stateProseKernel.js')) {
    let src = await readFile(new URL(url), 'utf8');
    src = src.replace('export function eligibleVariants(', 'function __eligibleVariants(')
      + '\nexport function eligibleVariants(pool, options = {}) { const r = __eligibleVariants(pool, options); if (globalThis.__EV_HOOK) globalThis.__EV_HOOK(pool, options, r, __eligibleVariants); return r; }\n';
    return { format: 'module', source: src, shortCircuit: true };
  }
  return next(url, context);
}
