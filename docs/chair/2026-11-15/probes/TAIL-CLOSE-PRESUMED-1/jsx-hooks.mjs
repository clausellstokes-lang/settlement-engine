/**
 * A module hook for the measure (no part of the product): the census composes the public prose through a module that
 * imports components (.jsx); node cannot load JSX, so .jsx is compiled by esbuild as the build compiles it, and a style
 * or image import is an empty module. Registered by measure-fresh-rows.mjs before its births.
 */
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

export async function load(url, context, next) {
  if (/\.(?:css|svg|png|jpe?g|gif|webp)(?:\?.*)?$/.test(url)) return { format: 'module', source: 'export default "";', shortCircuit: true };
  if (url.endsWith('.jsx')) {
    const src = await readFile(new URL(url), 'utf8');
    const out = await transform(src, { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: url });
    return { format: 'module', source: out.code, shortCircuit: true };
  }
  return next(url, context);
}
