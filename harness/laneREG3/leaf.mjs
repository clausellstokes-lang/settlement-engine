/** leaf.mjs — one exemplar leaf's fabric, through the harness's OWN buildOne (never a fork). */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../..');
const ex = await import(join(ROOT, 'harness/exemplars.mjs'));
export const { CORPUS, buildOne, siteRepresentatives, bothTotals, siteKey } = ex;
export function buildLeaf(key, fabricOptions = {}) {
  const row = CORPUS.find((c) => c.key === key);
  if (!row) throw new Error(`no such leaf: ${key}`);
  return buildOne(row, fabricOptions);
}
