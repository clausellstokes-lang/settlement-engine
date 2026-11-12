// LAYER-MAP jsx-loader.mjs — lets plain node import the tree's .jsx modules (esbuild transform, automatic runtime).
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
  return next(url, context);
}
