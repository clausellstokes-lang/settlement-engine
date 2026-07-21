/**
 * determinismBanCoverage.test.js — SS4: the determinism eslint-ban coverage pin.
 *
 * THE HOLE THIS CLOSES. The per-layer determinism `no-restricted-syntax` blocks in
 * eslint.config.js (generators / domain / workers / kernel / kernel-prng / pdf) rely
 * on flat-config LAST-WINS resolution: any later block whose `files` glob overlaps an
 * entropy-sensitive layer silently REPLACES that layer's whole ban for the matched
 * files (the F24 `', '` block is one no-restricted-syntax rule away from doing exactly
 * that). Until now the only defense was a prose comment above the F24 block ("each
 * file must be covered by exactly ONE no-restricted-syntax block") — a rung-3
 * convention where a rung-1 mechanical check was available.
 *
 * WHAT IT DOES. For EVERY file in the entropy-sensitive layers, resolve the file's
 * ACTUAL effective eslint config (ESLint.calculateConfigForFile — the same resolution
 * the gate lint uses) and assert:
 *   • `no-restricted-syntax` is present at ERROR severity, and
 *   • the resolved selector set still contains that layer's required ban selectors, and
 *   • the sanctioned exemptions still hold (clock.js keeps its wall-clock seam,
 *     prng.js keeps its entropy-minting seam, kernel keeps unseededRandom, pdf keeps
 *     its ledgered wall-clock allowance) — an exemption silently widening into a ban
 *     is ALSO drift, just in the strict direction.
 * A widened glob, a deleted block, a downgraded severity, or a dropped selector on any
 * single file goes red with the file named.
 *
 * CANNOT-CATCH: a selector whose AST pattern is edited to something equivalent-looking
 * but unmatchable (the selector STRING is what's pinned; mutation-sweep areas 1–2
 * prove two representative selectors actually fire); bans enforced outside eslint
 * (the source-regex guards have their own tests).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { ESLint } from 'eslint';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const rel = (p) => path.join(REPO, p);
const norm = (p) => path.relative(REPO, p).split(path.sep).join('/');

// The exact selector strings the eslint.config.js determinism blocks carry.
const MATH_RANDOM = "CallExpression[callee.object.name='Math'][callee.property.name='random']";
const DATE_NOW = "CallExpression[callee.object.name='Date'][callee.property.name='now']";
const NEW_DATE = "NewExpression[callee.name='Date'][arguments.length=0]";
const LOCALE_COMPARE = "CallExpression[callee.property.name='localeCompare']";
const IMPORT_META = "MetaProperty[meta.name='import']";

/**
 * The coverage contract, layer by layer. `required` selectors must be present in the
 * file's resolved no-restricted-syntax (at error severity); `forbidden` selectors must
 * be ABSENT (they are that layer's sanctioned seams — see the eslint.config.js block
 * comments). Kept in lockstep with eslint.config.js's determinism blocks.
 */
const LAYERS = [
  {
    name: 'generators (seeded pipeline)',
    roots: ['src/generators'], exts: /\.js$/,
    exempt: [],
    required: [MATH_RANDOM, DATE_NOW, NEW_DATE, LOCALE_COMPARE],
    forbidden: [],
  },
  {
    name: 'domain kernel (pure)',
    roots: ['src/domain'], exts: /\.js$/,
    exempt: ['src/domain/clock.js'], // the sole sanctioned wall-clock seam
    required: [MATH_RANDOM, IMPORT_META, NEW_DATE, DATE_NOW, LOCALE_COMPARE],
    forbidden: [],
  },
  {
    name: 'workers (sim path)',
    roots: ['src/workers'], exts: /\.js$/,
    exempt: [],
    required: [MATH_RANDOM, NEW_DATE, DATE_NOW, LOCALE_COMPARE],
    forbidden: [],
  },
  {
    name: 'kernel except prng (rngContext keeps unseededRandom)',
    roots: ['src/kernel'], exts: /\.js$/,
    exempt: ['src/kernel/prng.js'],
    required: [NEW_DATE, DATE_NOW, LOCALE_COMPARE],
    forbidden: [MATH_RANDOM], // unseededRandom() is the sanctioned fail-closed draw
  },
  {
    name: 'kernel/prng.js (the sole seed-minting entry)',
    files: ['src/kernel/prng.js'],
    required: [LOCALE_COMPARE],
    forbidden: [MATH_RANDOM, DATE_NOW], // generateSeed() mints from both BY DESIGN
  },
  {
    name: 'pdf (collation-only; ledgered wall-clock allowance)',
    roots: ['src/pdf'], exts: /\.(js|jsx)$/,
    exempt: [],
    required: [LOCALE_COMPARE],
    forbidden: [NEW_DATE], // Cover/Timeline USER timestamps — TEMPORAL_AUDIT.md ledger
  },
  {
    name: 'domain/clock.js (the sanctioned wall-clock seam must STAY exempt)',
    files: ['src/domain/clock.js'],
    required: [],
    forbidden: [NEW_DATE, DATE_NOW],
  },
];

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, exts, out);
    else if (exts.test(e.name)) out.push(fp);
  }
  return out;
}

/** selectors + severity of the resolved no-restricted-syntax for one file. */
function readRule(cfg) {
  const val = cfg.rules?.['no-restricted-syntax'];
  if (!val) return { severity: 0, selectors: [] };
  const arr = Array.isArray(val) ? val : [val];
  const raw = arr[0];
  const severity = raw === 'error' ? 2 : raw === 'warn' ? 1 : Number(raw) || 0;
  const selectors = arr.slice(1).map((e) => (typeof e === 'string' ? e : e?.selector)).filter(Boolean);
  return { severity, selectors };
}

describe('determinism eslint-ban coverage (last-wins shadow guard)', () => {
  /** layerName -> string[] of per-file problems */
  const problems = new Map();
  /** layerName -> number of files actually resolved */
  const counts = new Map();

  beforeAll(async () => {
    const eslint = new ESLint({ cwd: REPO });
    for (const layer of LAYERS) {
      const files = layer.files
        ? layer.files.map(rel)
        : layer.roots.flatMap((r) => walk(rel(r), layer.exts)).filter((f) => !layer.exempt.includes(norm(f)));
      const bad = [];
      for (const abs of files) {
        const cfg = await eslint.calculateConfigForFile(abs);
        const { severity, selectors } = readRule(cfg);
        const missing = layer.required.filter((s) => !selectors.includes(s));
        const leaked = layer.forbidden.filter((s) => selectors.includes(s));
        if (layer.required.length > 0 && severity !== 2) {
          bad.push(`${norm(abs)}: no-restricted-syntax severity is ${severity}, must be error(2)`);
        }
        if (missing.length) {
          bad.push(
            `${norm(abs)}: missing ban selector(s) ${JSON.stringify(missing)}.\n` +
            `    A later eslint.config.js block's files glob now shadows this file (flat config\n` +
            `    is LAST-WINS per rule) — or the layer's determinism block was edited. Restore the\n` +
            `    layer block / narrow the overlapping glob; never re-state bans per-file.`,
          );
        }
        if (leaked.length) {
          bad.push(
            `${norm(abs)}: sanctioned-seam exemption lost — now banned: ${JSON.stringify(leaked)}.\n` +
            `    This file is a documented determinism seam (see the eslint.config.js block\n` +
            `    comments); widening the ban here breaks the sanctioned entry point.`,
          );
        }
      }
      problems.set(layer.name, bad);
      counts.set(layer.name, files.length);
    }
  }, 120_000);

  for (const layer of LAYERS) {
    it(`${layer.name}: every file carries exactly its layer's ban set`, () => {
      expect(problems.get(layer.name)).toEqual([]);
    });
  }

  it('the walk is non-vacuous (a broken glob must not pass as full coverage)', () => {
    expect(counts.get('generators (seeded pipeline)')).toBeGreaterThan(50);
    expect(counts.get('domain kernel (pure)')).toBeGreaterThan(300);
    expect(counts.get('pdf (collation-only; ledgered wall-clock allowance)')).toBeGreaterThan(20);
    expect(counts.get('workers (sim path)')).toBeGreaterThan(0);
    expect(counts.get('kernel except prng (rngContext keeps unseededRandom)')).toBeGreaterThan(0);
  });

  it('negative control: a components file does NOT carry the domain ban set', async () => {
    // Components legitimately hold the F24 ', ' block, not the determinism bans —
    // proving this test discriminates layers rather than passing on anything.
    const eslint = new ESLint({ cwd: REPO });
    const cfg = await eslint.calculateConfigForFile(rel('src/components/AccountMenu.jsx'));
    const { selectors } = readRule(cfg);
    expect(selectors).not.toContain(MATH_RANDOM);
  });
});
