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
import { TRANSCENDENTAL_FNS, countText } from '../../scripts/count-transcendental-math.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const rel = (p) => path.join(REPO, p);
const norm = (p) => path.relative(REPO, p).split(path.sep).join('/');

// The exact selector strings the eslint.config.js determinism blocks carry.
const MATH_RANDOM = "CallExpression[callee.object.name='Math'][callee.property.name='random']";
const DATE_NOW = "CallExpression[callee.object.name='Date'][callee.property.name='now']";
const NEW_DATE = "NewExpression[callee.name='Date'][arguments.length=0]";
const LOCALE_COMPARE = "CallExpression[callee.property.name='localeCompare']";
const IMPORT_META = "MetaProperty[meta.name='import']";

// ── THE TRANSCENDENTAL BAN'S SELECTORS (T13 Car 5) ───────────────────────────
// Built from the counter's own roster, exactly as eslint.config.js builds them, so the
// pin cannot pass on a ban whose membership has silently changed shape.
//
// ⚠ AND THAT SHARED SOURCE IS ITSELF A HOLE, WHICH IS WHY THE ROSTER GUARD BELOW EXISTS.
// If the config and this pin both derive from `TRANSCENDENTAL_FNS`, then DELETING a member
// from that array weakens the ban and moves this pin in lockstep — the check would still
// pass, describing a smaller ban perfectly. Deriving is right (it kills transcription
// drift); the missing half is a floor on the roster ITSELF, asserted against literals that
// only ever go up. That is the `THE ROSTER IS THE COUNTER'S…` test at the bottom of this file.
const TRANSCENDENTAL_SELECTORS = [
  ...TRANSCENDENTAL_FNS.map((fn) => `CallExpression[callee.object.name='Math'][callee.property.name='${fn}']`),
  "BinaryExpression[operator='**']",
  "AssignmentExpression[operator='**=']",
];

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
    required: [MATH_RANDOM, DATE_NOW, NEW_DATE, LOCALE_COMPARE, ...TRANSCENDENTAL_SELECTORS],
    forbidden: [],
  },
  {
    name: 'domain kernel (pure)',
    roots: ['src/domain'], exts: /\.js$/,
    // clock.js: the sole sanctioned wall-clock seam. The generated admission
    // projection joined eslint.config.js's ignores at the SUBSTRATE landing (it is
    // regenerated and BYTE-CHECKED by validate:custom-content-manifest in the gate,
    // so lint buys nothing regeneration does not prove) — an ignored file has NO
    // resolvable config, so it walks through this door with that same reason.
    exempt: ['src/domain/clock.js', 'src/domain/content/customContentAdmission.generated.js'],
    required: [MATH_RANDOM, IMPORT_META, NEW_DATE, DATE_NOW, LOCALE_COMPARE, ...TRANSCENDENTAL_SELECTORS],
    forbidden: [],
  },
  {
    name: 'workers (sim path)',
    roots: ['src/workers'], exts: /\.js$/,
    exempt: [],
    required: [MATH_RANDOM, NEW_DATE, DATE_NOW, LOCALE_COMPARE, ...TRANSCENDENTAL_SELECTORS],
    forbidden: [],
  },
  {
    name: 'kernel except prng (rngContext keeps unseededRandom)',
    roots: ['src/kernel'], exts: /\.js$/,
    exempt: ['src/kernel/prng.js'],
    required: [NEW_DATE, DATE_NOW, LOCALE_COMPARE, ...TRANSCENDENTAL_SELECTORS],
    forbidden: [MATH_RANDOM], // unseededRandom() is the sanctioned fail-closed draw
  },
  {
    name: 'kernel/prng.js (the sole seed-minting entry)',
    files: ['src/kernel/prng.js'],
    required: [LOCALE_COMPARE, ...TRANSCENDENTAL_SELECTORS],
    forbidden: [MATH_RANDOM, DATE_NOW], // generateSeed() mints from both BY DESIGN
  },
  {
    name: 'pdf (collation + randomness; ledgered wall-clock allowance)',
    roots: ['src/pdf'], exts: /\.(js|jsx)$/,
    exempt: [],
    // Cycle-3 W6 added the RANDOMNESS ban (M21): Math.random must be banned in the
    // same-seed PDF export. Collation stays banned. WALL-CLOCK stays ALLOWED — the
    // generation-date stamp (Cover) + user event timestamps (Timeline) are the
    // ledgered src/pdf boundary reads (TEMPORAL_AUDIT.md §1), so new Date()/Date.now()
    // must remain UNbanned here.
    required: [LOCALE_COMPARE, MATH_RANDOM, ...TRANSCENDENTAL_SELECTORS],
    forbidden: [NEW_DATE, DATE_NOW], // Cover/Timeline USER timestamps — TEMPORAL_AUDIT.md ledger
  },
  {
    name: 'domain/clock.js (the sanctioned wall-clock seam must STAY exempt)',
    files: ['src/domain/clock.js'],
    // T13 Car 5 gave clock.js its OWN block: it sat inside a census tree with no
    // no-restricted-syntax at all, because the domain block `ignores` it for the
    // wall-clock seam. The ban reaches it now; the seam is preserved by `forbidden`.
    required: [...TRANSCENDENTAL_SELECTORS],
    forbidden: [NEW_DATE, DATE_NOW],
  },
  {
    // ODQ 764.2 / 759.4, lane T9: instantWorld composes a whole starting realm from
    // a seed and sat outside every determinism block — src/lib/ carries only the
    // size ratchet. Its one covered member (src/domain/instantWorld/worldPlan.js)
    // was in scope by the accident of its directory. The block reds nothing today;
    // it buys the property forward. The store and component EDGES stay out on
    // purpose (they mint the one timestamp and the UI reroll seed) — see the
    // eslint.config.js block's scope note.
    name: 'instantWorld composer (seeded realm mint)',
    roots: ['src/lib/instantWorld'], exts: /\.js$/,
    exempt: [],
    required: [MATH_RANDOM, DATE_NOW, NEW_DATE, LOCALE_COMPARE, ...TRANSCENDENTAL_SELECTORS],
    forbidden: [],
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
        // An eslint-IGNORED file resolves NO config at all (flat config returns
        // undefined) — which means no determinism ban covers it. That is a FINDING,
        // never a crash: a thrown beforeAll converts every test here into a skip,
        // which is exactly the blindness the scope sentinel exists to refuse.
        if (!cfg) {
          bad.push(`${norm(abs)}: IGNORED by eslint.config.js — no determinism ban can `
            + 'cover an ignored file. Exempt it here with the ignore\'s own reason, or '
            + 'remove it from the ignores.');
          continue;
        }
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
    expect(counts.get('pdf (collation + randomness; ledgered wall-clock allowance)')).toBeGreaterThan(20);
    expect(counts.get('workers (sim path)')).toBeGreaterThan(0);
    expect(counts.get('kernel except prng (rngContext keeps unseededRandom)')).toBeGreaterThan(0);
  });

  // ── THE TRANSCENDENTAL BAN'S OWN LIVENESS (T13 Car 5, risk-register row 9) ──
  // The per-layer arms above prove the selectors are PRESENT in a resolved config. Present
  // is not the same as firing: a selector string that parses but matches no AST node would
  // satisfy every arm above forever. These three close that, and each closes a different
  // half — that the ban CONVICTS, that its roster cannot silently SHRINK, and that the two
  // enforcers (eslint's spellings, the counter's census) agree on what a member IS.

  it('LIVENESS: the transcendental ban actually CONVICTS in a governed file, calls and operator alike', async () => {
    // A present-but-unmatchable selector is the CANNOT-CATCH this file's own header names.
    // So lint real text at a real governed path and require real reports.
    const eslint = new ESLint({ cwd: REPO });
    const src = 'export const f = (a, b) => Math.pow(a, b) + Math.exp(a) + (a ** b);\n';
    const [res] = await eslint.lintText(src, { filePath: rel('src/domain/__transcendentalBanLiveness.js') });
    const msgs = res.messages.filter((m) => m.ruleId === 'no-restricted-syntax');
    expect(msgs.length, `the ban reported nothing on text that is three violations:\n${src}`).toBe(3);
    expect(msgs.every((m) => /implementation-approximated/.test(m.message)), 'the reports are not the transcendental ban\'s').toBe(true);
    // …and it must still DISCRIMINATE: correctly-rounded math is not banned.
    const [ok] = await eslint.lintText('export const g = (a) => Math.sqrt(a) + Math.abs(a) + Math.floor(a);\n', {
      filePath: rel('src/domain/__transcendentalBanLiveness.js'),
    });
    expect(
      ok.messages.filter((m) => m.ruleId === 'no-restricted-syntax'),
      'Math.sqrt/abs/floor were convicted — sqrt is CORRECTLY ROUNDED by spec and must stay legal',
    ).toEqual([]);
  });

  it('THE ROSTER IS THE COUNTER\'S, AND IT CANNOT SHRINK — a floor on the ban itself', () => {
    // eslint.config.js and this file both DERIVE from TRANSCENDENTAL_FNS, which kills
    // transcription drift and creates a different hole: delete a member and both move
    // together, leaving every arm green over a weaker ban. This is that hole's floor, and
    // it is a monotone-UP literal — you may add members, you may never quietly drop one.
    expect(TRANSCENDENTAL_FNS.length, 'the transcendental roster SHRANK — a member was removed, weakening the ban and the census together').toBeGreaterThanOrEqual(22);
    // ⛔ ANCHORED, and the estate's own walker is why. This was first written as a bare
    // exclusion matcher, and tests/lint/negativeAssertionAnchor.walker.test.js convicted
    // it on the spot — correctly. A bare exclusion passes just as happily when
    // the COLLECTION drifted away as when the member was properly excluded, which is the
    // exact vacuity this whole test exists to close. The guard had the hole it was written
    // to prevent. `pow` is the anchor: it travels the same array, it is the member every
    // consumer of this roster actually cares about, and if it ever goes missing the
    // exclusion below stops meaning anything.
    expectAbsentWithAnchor(
      TRANSCENDENTAL_FNS, 'sqrt', 'pow',
      'Math.sqrt is CORRECTLY ROUNDED by spec — banning it costs precision and buys nothing',
    );
    // A representative spread across the §21.3.2 families, named so a wholesale rewrite reds.
    for (const fn of ['pow', 'exp', 'log', 'log2', 'log10', 'sin', 'cos', 'tan', 'tanh', 'atan2', 'hypot', 'cbrt', 'expm1', 'log1p']) {
      expect(TRANSCENDENTAL_FNS, `${fn} left the roster`).toContain(fn);
    }
    expect(TRANSCENDENTAL_SELECTORS.length).toBe(TRANSCENDENTAL_FNS.length + 2);
    expect(TRANSCENDENTAL_SELECTORS).toContain("BinaryExpression[operator='**']");
    expect(TRANSCENDENTAL_SELECTORS).toContain("AssignmentExpression[operator='**=']");
  });

  it('THE TWO ENFORCERS AGREE: every banned spelling is also one the census counts', () => {
    // The ban stops the SPELLING at edit time; the census counts the TRUTH after comment and
    // string stripping. They are deliberately different detectors — eslint cannot see an
    // eslint-ignored file, the counter cannot lex a template interpolation — so neither is
    // redundant. What must never differ is MEMBERSHIP: a function one convicts and the other
    // waves through is a hole with a green light over it.
    for (const fn of TRANSCENDENTAL_FNS) {
      expect(countText(`const v = Math.${fn}(a, b);`), `the census does not count Math.${fn}, but the ban convicts it`).toBe(1);
    }
    expect(countText('const v = a ** b;')).toBe(1);
    expect(countText('let v = a; v **= 2;')).toBe(1);
    expect(countText('const v = Math.sqrt(a);'), 'sqrt must be counted by NEITHER enforcer').toBe(0);
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
