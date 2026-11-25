import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const esbuild = createRequire('/home/user/settlement-engine/package.json')('esbuild');
export async function load(url, context, next) {
  if (/\.(css|scss|svg|png|jpe?g|woff2?)$/.test(url)) return { format: 'module', source: 'export default "";', shortCircuit: true };
  if (url.endsWith('.jsx')) {
    const src = readFileSync(fileURLToPath(url), 'utf8');
    const { code } = esbuild.transformSync(src, { loader: 'jsx', format: 'esm', jsx: 'automatic', sourcefile: fileURLToPath(url) });
    return { format: 'module', source: code, shortCircuit: true };
  }
  return next(url, context);
}
