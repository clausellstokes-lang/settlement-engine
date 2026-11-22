/**
 * tests/build/interiorLazy.test.js — DOOR 3 first-paint lazy contract.
 *
 * THE KEYED SCALE model (domain/interior/**) and its viewer (components/interior/
 * InteriorView) must stay OUT of the entry's first-paint static closure — they are
 * reached only through the lazy map surface (the enter-from-map hook the manager wires
 * at fold). This mirrors the town-map / vendor-pdf / engine lazy contracts exactly.
 *
 * The load-bearing fingerprint is the unique string literal the interior model mints
 * (`::interior:v1:`), which survives minification, so a BFS of the entry's transitive
 * static closure must never contain it. Runs only when dist/ exists (post-build); the
 * VERIFY_DIST=1 post-build re-run enforces it against the fresh dist.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);

const INTERIOR_FINGERPRINT = '::interior:v1:';

function staticImportSpecifiers(code) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
}

function findEntryChunk() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  return m[1];
}

function entryStaticClosure() {
  const entry = findEntryChunk();
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    for (const dep of staticImportSpecifiers(code)) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return { entry, files: [...seen] };
}

describe.runIf(distExists)('DOOR 3 — interiors stay off first paint', () => {
  it('the interior model fingerprint is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const leaked = files.filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(INTERIOR_FINGERPRINT));
    expect(
      leaked,
      `the interior model reached first paint via the static graph (chunks: ${leaked.join(', ')}).`,
    ).toHaveLength(0);
  });
});
