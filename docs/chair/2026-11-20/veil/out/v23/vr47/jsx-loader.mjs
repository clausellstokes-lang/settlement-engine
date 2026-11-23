// node --import ./jsx-loader.mjs probe.mjs : .jsx compiled by the tree's own esbuild (the probe reaches publicProseCompose.js's JSX).
import { register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(`
import { readFile } from 'node:fs/promises'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const req = createRequire(process.env.TREE + '/package.json'); const { transform } = req('esbuild');
export async function load(url, ctx, next) {
  if (!url.endsWith('.jsx')) return next(url, ctx);
  const src = await readFile(fileURLToPath(url), 'utf8');
  const { code } = await transform(src, { loader: 'jsx', jsx: 'automatic', format: 'esm' });
  return { format: 'module', source: code, shortCircuit: true };
}`));
