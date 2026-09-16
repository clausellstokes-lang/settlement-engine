/**
 * tests/build/userRouteIdentityLeaf.test.js — the first-paint contract for the
 * USER ROUTE identity seam (directive 3 / wave D).
 *
 * THE DEFECT THIS EXISTS TO PREVENT (measured 2026-08-01, the constitutional
 * ratchet RED at 1,056,635 / budget 1,040,000). `domain/events/mutate.js` is
 * reached statically from the store, so its MUTATION_HANDLERS table and every
 * module that table imports ride the first-paint closure. Wave D's CREATE_ROUTE
 * handler needed ONE three-line function — the deterministic edge id — and
 * imported it from `roads/userRoutes.js`. That dragged the whole route derivation
 * eager, and the derivation statically imports `spatial/distanceRead.js`, the
 * 53 kB frozen-digest reader whose OWN docblock states it "never reaches first
 * paint". Net: ~11 kB of minified geography in the browser's critical path to
 * serve a string template.
 *
 * THE CURE is the house leaf extraction (deityConstants / stablePart /
 * exportPosture): move the FUNCTION, not the chunk pin. `roads/userRouteIdentity.js`
 * carries the identity with ZERO imports, `roads/userRoutes.js` re-exports it
 * verbatim so no consumer changed its import site, and the eager handler imports
 * the leaf.
 *
 * FIVE LAYERS, because no single one of them is sufficient:
 *   1. SOURCE — the leaf has zero static imports. An import added there re-parents
 *      whatever it reaches straight back into first paint, which is the whole
 *      defect. Non-vacuous: the same scanner is shown finding imports in a sibling
 *      that legitimately has them.
 *   2. SOURCE — the eager handler imports the id from the LEAF, not from the
 *      derivation (anchored negative: its live sibling import must still be found).
 *   3. SOURCE GRAPH — nothing reachable from `src/main.jsx` by STATIC edges reaches
 *      the derivation or the digest reader. This is the layer that reds without a
 *      build, and it names the culprit edge rather than a byte count.
 *   4. DIST ABSENCE (ungated) — the derivation's fingerprint is not in the entry's
 *      transitive static closure. Per the stale-dist policy an absence check can
 *      only UNDER-report against an old dist, so it never false-reds.
 *   5. DIST PRESENCE (VERIFY_DIST=1) — the PAIR that makes layer 4 non-vacuous. A
 *      pure absence assertion is satisfied just as well by the whole feature being
 *      tree-shaken away, so the eager HALF of the seam (the mutation handler) is
 *      asserted PRESENT in the closure while the lazy half is asserted absent. That
 *      is what proves the split landed at the intended seam.
 *
 * @see tests/build/vendorPdfLazy.test.js — the byte ratchet these layers protect.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = process.cwd();
const SRC = resolve(ROOT, 'src');
const distDir = resolve(ROOT, 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDistRead = process.env.VERIFY_DIST === '1';

const LEAF = resolve(SRC, 'domain/roads/userRouteIdentity.js');
const DERIVATION = resolve(SRC, 'domain/roads/userRoutes.js');
const DIGEST_READER = resolve(SRC, 'domain/spatial/distanceRead.js');
const HANDLER = resolve(SRC, 'domain/events/mutateUserRoute.js');

// Reader-facing / refusal literals minted in exactly ONE source module each.
// String literals survive minification, so each is a stable fingerprint of its
// module, and each rides a LIVE return value (never a dead standalone export that
// tree-shaking would strip, which is how a sentinel guard goes vacuous).
const DERIVATION_FINGERPRINT = 'mode_not_supported';
const HANDLER_FINGERPRINT = 'A road chartered by hand runs between here and';

/** Static (never dynamic) module specifiers of one source file. */
function staticSourceSpecifiers(code) {
  const stripped = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs = new Set();
  for (const m of stripped.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.add(m[1]);
  for (const m of stripped.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.add(m[1]);
  return [...specs];
}

function resolveRelative(from, spec) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const candidate of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Everything `src/main.jsx` reaches over STATIC import edges. */
function firstPaintSourceGraph() {
  const entry = resolve(SRC, 'main.jsx');
  const seen = new Set([entry]);
  const parent = new Map();
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    for (const spec of staticSourceSpecifiers(readFileSync(file, 'utf-8'))) {
      const dep = resolveRelative(file, spec);
      if (!dep || seen.has(dep)) continue;
      seen.add(dep);
      parent.set(dep, file);
      queue.push(dep);
    }
  }
  return { seen, parent };
}

function chainTo(parent, file) {
  const chain = [];
  let cur = file;
  while (cur) { chain.push(cur.slice(ROOT.length + 1)); cur = parent.get(cur); }
  return chain.reverse().join(' -> ');
}

function staticChunkSpecifiers(code) {
  const specs = new Set();
  for (const m of code.matchAll(/\bfrom\s*["'](\.\/[^"']+\.js)["']/g)) specs.add(m[1].replace('./', ''));
  for (const m of code.matchAll(/(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g)) specs.add(m[1].replace('./', ''));
  return [...specs];
}

function entryStaticClosure() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  const seen = new Set([m[1]]);
  const queue = [m[1]];
  while (queue.length) {
    const file = queue.shift();
    for (const dep of staticChunkSpecifiers(readFileSync(join(assetsDir, file), 'utf-8'))) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return [...seen];
}

const chunksContaining = (literal) => readdirSync(assetsDir)
  .filter(f => f.endsWith('.js'))
  .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(literal));

describe('wave D — the user-route identity leaf (source contracts)', () => {
  it('the identity leaf has ZERO static imports', () => {
    const leafSpecs = staticSourceSpecifiers(readFileSync(LEAF, 'utf-8'));
    // Non-vacuity: the SAME scanner must find the derivation's real imports, or a
    // scanner that silently stopped matching would report every file import-free.
    const derivationSpecs = staticSourceSpecifiers(readFileSync(DERIVATION, 'utf-8'));
    expect(
      derivationSpecs.length,
      'the import scanner found nothing in roads/userRoutes.js — it is broken, so the zero-imports claim below measures nothing',
    ).toBeGreaterThan(0);
    expect(
      leafSpecs,
      `roads/userRouteIdentity.js must stay import-free — it is reached from the EAGER mutation table, `
      + `so anything it imports rides first paint. It now imports: ${leafSpecs.join(', ')}`,
    ).toHaveLength(0);
  });

  it('the eager CREATE_ROUTE handler takes the edge id from the LEAF, not the derivation', () => {
    const specs = staticSourceSpecifiers(readFileSync(HANDLER, 'utf-8'));
    expect(specs).toContain('../roads/userRouteIdentity.js');
    // Anchored negative: './mutateHelpers.js' travels the same import list and
    // would vanish under the same drift, so the absence below cannot go vacuous.
    expectAbsentWithAnchor(
      specs,
      '../roads/userRoutes.js',
      './mutateHelpers.js',
      'mutateUserRoute.js static imports',
    );
  });

  it('the derivation still re-exports the identity verbatim (no consumer had to move)', () => {
    const derivation = readFileSync(DERIVATION, 'utf-8');
    expect(derivation).toMatch(/from\s+['"]\.\/userRouteIdentity\.js['"]/);
    expect(derivation).toMatch(/export\s*\{[^}]*userRouteEdgeId[^}]*\}/);
    expect(derivation).toMatch(/export\s*\{[^}]*orderedRouteEndpoints[^}]*\}/);
  });

  it('no module reachable from main.jsx statically reaches the derivation or the digest reader', () => {
    const { seen, parent } = firstPaintSourceGraph();
    // ANCHOR: the eager half of the seam IS in this graph. Without it, an empty or
    // broken graph would satisfy both exclusions below for the wrong reason.
    expect(
      seen.has(HANDLER),
      'the first-paint source graph does not contain the CREATE_ROUTE handler — the walk is broken, '
      + 'so the exclusions below prove nothing',
    ).toBe(true);
    for (const target of [DERIVATION, DIGEST_READER]) {
      expect(
        seen.has(target),
        `${target.slice(ROOT.length + 1)} re-entered the first-paint static graph via `
        + `${seen.has(target) ? chainTo(parent, target) : '(unreachable)'} — import the zero-import identity leaf instead.`,
      ).toBe(false);
    }
  });

  it('each fingerprint is minted in exactly one source module', () => {
    // Anti-vacuity for the dist halves below: a fingerprint that drifted out of the
    // source, or leaked into a second module, would make them meaningless.
    const walk = (dir, out = []) => {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.jsx?$/.test(entry)) out.push(p);
      }
      return out;
    };
    const files = walk(SRC);
    for (const fingerprint of [DERIVATION_FINGERPRINT, HANDLER_FINGERPRINT]) {
      const hits = files.filter(f => readFileSync(f, 'utf-8').includes(fingerprint));
      expect(
        hits.map(f => f.slice(ROOT.length + 1)),
        `the fingerprint "${fingerprint}" must be minted in exactly one source module`,
      ).toHaveLength(1);
    }
  });
});

describe.runIf(distExists)('wave D — the user-route identity leaf (dist)', () => {
  it('the route derivation is ABSENT from the entry transitive static closure', () => {
    const leaked = entryStaticClosure()
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(DERIVATION_FINGERPRINT));
    expect(
      leaked,
      `roads/userRoutes.js reached first paint via the static graph (chunks: ${leaked.join(', ')}). `
      + 'It drags spatial/distanceRead.js with it and breaks the first-paint byte ratchet.',
    ).toHaveLength(0);
  });

  it.skipIf(!requireDistRead)('the eager CREATE_ROUTE handler IS in the closure (the absence above is a split, not a deletion)', () => {
    const carriers = entryStaticClosure()
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(HANDLER_FINGERPRINT));
    expect(
      carriers.length,
      `the CREATE_ROUTE handler fingerprint "${HANDLER_FINGERPRINT}" is in NO first-paint chunk. `
      + 'Either the handler left the eager mutation table (a behavior change) or the whole feature was '
      + 'tree-shaken away — in both cases the absence assertion above is vacuous.',
    ).toBeGreaterThan(0);
  });

  it.skipIf(!requireDistRead)('the route derivation DOES exist in a lazy chunk', () => {
    expect(
      chunksContaining(DERIVATION_FINGERPRINT).length,
      `the derivation fingerprint "${DERIVATION_FINGERPRINT}" is in NO dist chunk — did the refusal `
      + 'vocabulary change, or did the charter surfaces stop importing the validator?',
    ).toBeGreaterThan(0);
  });
});
