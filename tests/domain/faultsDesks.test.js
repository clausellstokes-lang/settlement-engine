/**
 * faultsDesks.test.js — FAULTS-DESKS (the round FAULTS, `docs/chair/2026-11-18/faults/BRIEF-FAULTS.md` on the chair's lane,
 * section FAULTS-DESKS; the chair's rulings FR6 and FR7).
 *
 *   FR7  THE NUMBERING GUARD. `scripts/generate-dossier-state-prose.mjs` refuses to project where a text that stood at the
 *        baseline (the state leaves on disk) would take another vid, or a vid would be re-used, compared BY TEXT. Driven on
 *        a COPY of the tree's projector over a planted annex (the committed annex and leaves are never touched): a planted
 *        renumbering (two rows of one pool swapped), a planted re-use, BAR6-DEFDESK's own shape (a line inserted before older
 *        ones), a dropped number and a rewording in place with no allowance row each refuse by the guard's message; the annex
 *        as committed, a new line at the NEXT number and the rewording WITH its row pass the guard (the negatives beside the
 *        positives; the chair's note of 06:51 UTC: a correction of words passes only through its named row).
 *   13d  (FR6) ONE NEW ATOM, `court or gaol`: a court sits on the live roster (`court sits`) or a prison stands (`prison`),
 *        read off the defence home's own readers; the seven "record of crimes" lines of the four DS-DEF-3 safety pools
 *        declare it. HELD EQUAL to the Defense tab's Legal Infrastructure row (anything but "None") on every town born
 *        here, on the record, its public projection and the share veil; refused where it is false, admitted where true.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import url from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import { defenseStateProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '../..');
const ANNEX_REL = 'docs/content/RECEIPT_POOLS_DOSSIER_STATE.md';
const ANNEX = readFileSync(path.join(ROOT, ANNEX_REL), 'utf8');
const GUARD = 'the numbering guard (FR7)';
/**
 * THE CENSUS OF THE PLANTED TREE: the committed census with its STAMP re-hashed against this tree's own composers, so the
 * projector's interlock (a census stamped over moved composers refuses every run) does not stand in front of the guard
 * while the close re-takes the census (it is the close's figure: this file re-takes nothing). Measured at the base
 * (FAULTS-DESKS hand-back, item 2): a census freshly taken there projects every leaf byte-equal to the committed ones.
 */
const CENSUS = (() => {
  const census = JSON.parse(readFileSync(path.join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
  for (const rel of Object.keys(census.stamp?.files || {})) {
    census.stamp.files[rel] = createHash('sha256').update(readFileSync(path.join(ROOT, rel), 'utf8')).digest('hex');
  }
  return JSON.stringify(census);
})();

// ─── FR7: the projector, copied beside a planted annex ───────────────────────────────────────────────────────────────

/** @type {string[]} */ const trees = [];
afterAll(() => { for (const t of trees) rmSync(t, { recursive: true, force: true }); });

/**
 * A tree whose projector is the committed one (with `corrections` as its allowance rows) and whose annex is `annex`: the script copied (its ROOT is the tree), its
 * libraries, `src/` and every other content file linked. The run is `--check`, so nothing is written anywhere.
 * @param {string} annex @param {Array<object>} [corrections] @returns {{ status: number, out: string }}
 */
function project(annex, corrections = []) {
  const t = mkdtempSync(path.join(tmpdir(), 'faults-desks-'));
  trees.push(t);
  mkdirSync(path.join(t, 'scripts'));
  const script = readFileSync(path.join(ROOT, 'scripts/generate-dossier-state-prose.mjs'), 'utf8');
  const open = 'const WORD_CORRECTIONS = Object.freeze([\n';
  if (corrections.length) expect(script.split(open).length - 1, 'the allowance table stands once in the committed projector').toBe(1);
  writeFileSync(path.join(t, 'scripts/generate-dossier-state-prose.mjs'), corrections.length
    ? script.replace(open, `${open}${corrections.map((c) => `  ${JSON.stringify(c)},\n`).join('')}`) : script);
  symlinkSync(path.join(ROOT, 'scripts/lib'), path.join(t, 'scripts/lib'));
  symlinkSync(path.join(ROOT, 'src'), path.join(t, 'src'));
  symlinkSync(path.join(ROOT, 'node_modules'), path.join(t, 'node_modules'));
  mkdirSync(path.join(t, 'docs/content'), { recursive: true });
  for (const f of readdirSync(path.join(ROOT, 'docs/content'))) {
    if (f !== path.basename(ANNEX_REL) && f !== 'wiring-census.json') symlinkSync(path.join(ROOT, 'docs/content', f), path.join(t, 'docs/content', f));
  }
  writeFileSync(path.join(t, 'docs/content/wiring-census.json'), CENSUS);
  writeFileSync(path.join(t, ANNEX_REL), annex);
  try {
    const out = execFileSync(process.execPath, [path.join(t, 'scripts/generate-dossier-state-prose.mjs'), '--check'],
      { cwd: t, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { status: 0, out };
  } catch (e) {
    const err = /** @type {{ status?: number, stdout?: string, stderr?: string }} */ (e);
    return { status: err.status ?? 1, out: `${err.stdout || ''}${err.stderr || ''}` };
  }
}

/** The annex with `from` replaced by `to` (each must stand exactly once). @param {Array<[string, string]>} pairs */
function plant(pairs) {
  let s = ANNEX;
  for (const [from, to] of pairs) {
    expect(s.split(from).length - 1, `the plant's anchor must stand once: ${from.slice(0, 60)}`).toBe(1);
    s = s.replace(from, to);
  }
  return s;
}

// DS-DEF-3 › Moderate's rows, COMPUTED from the committed leaf by vid (never a literal sentence: proseDrawnAnchors), and
// found in the annex as `<vid>. \`[tags]\` <text>` (each must stand once).
const MODERATE = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-3'].pools.Moderate;
const textOf = (/** @type {number} */ vid) => /** @type {string} */ (MODERATE.find((/** @type {any} */ v) => v.vid === vid)?.text);
const rowOf = (/** @type {number} */ vid) => {
  const rows = ANNEX.split('\n').filter((l) => l.startsWith(`${vid}. \``) && l.endsWith(`\` ${textOf(vid)}`));
  if (rows.length !== 1) throw new Error(`DS-DEF-3 › Moderate v${vid}: ${rows.length} annex rows, not one`);
  return rows[0];
};
const MOD3 = rowOf(3);
const MOD4 = rowOf(4);
// LAST-VARIETY (2026-11-18): the pool's LAST row (v10 since that seat appended v9 and v10), so the planted line takes the next number
const MOD_LAST = MODERATE[MODERATE.length - 1].vid;
const MOD_LAST_LINE = rowOf(MOD_LAST);
/** the message's own quotation of a text (the guard cuts it at 69 characters), escaped for a pattern */
const head = (/** @type {number} */ vid) => textOf(vid).slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const body = (/** @type {string} */ row) => row.replace(/^\d+\.\s+/, '');

describe('FR7: the numbering guard refuses a renumbering and a re-use, by text', () => {
  it('NEGATIVE: the annex as committed passes the guard (and the whole --check)', () => {
    const r = project(ANNEX);
    // anchored: the same output is asserted below to be the whole --check's success (exit 0), so the run is live
    expect(r.out).not.toContain(GUARD);
    expect(r.status, r.out.slice(-1500)).toBe(0);
  }, 120_000); // its own budget (moved from the describe's options for SUITE_ARG_FORM, the last close)

  it('POSITIVE: two rows of one pool swapped (each text would take the other\'s vid) is RENUMBERED', () => {
    const r = project(plant([[MOD3, `3. ${body(MOD4)}`], [MOD4, `4. ${body(MOD3)}`]]));
    expect(r.status).not.toBe(0);
    expect(r.out).toContain(GUARD);
    expect(r.out).toMatch(new RegExp(`DS-DEF-3 :: Moderate: RENUMBERED: the text "${head(3)}.*stood at v3 at the baseline and would take v4`));
    expect(r.out).toMatch(new RegExp(`DS-DEF-3 :: Moderate: RENUMBERED: the text "${head(4)}.*stood at v4 at the baseline and would take v3`));
  }, 120_000); // its own budget (moved from the describe's options for SUITE_ARG_FORM, the last close)

  it('POSITIVE: a vid handed a text another vid holds is RE-USED (and nothing is RENUMBERED)', () => {
    const r = project(plant([[MOD4, `4. ${body(MOD3)}`]]));
    expect(r.status).not.toBe(0);
    expect(r.out).toContain(GUARD);
    expect(r.out).toMatch(new RegExp(`DS-DEF-3 :: Moderate: RE-USED: v4 named "${head(4)}.*the baseline's v3`));
    // anchored: the same output carries the RE-USED refusal (asserted above), so the guard ran and spoke
    expect(r.out).not.toContain('RENUMBERED');
  }, 120_000); // its own budget (moved from the describe's options for SUITE_ARG_FORM, the last close)

  it('POSITIVE: BAR6-DEFDESK\'s shape, a line inserted before older ones with the rows below renumbered, is refused', () => {
    const from = ANNEX.indexOf('**`Moderate`**\n');
    const to = ANNEX.indexOf('**`Unsafe`**\n', from);
    const pool = ANNEX.slice(from, to)
      .replace(/^(\d+)\. /gm, (m, n) => (Number(n) >= 3 ? `${Number(n) + 1}. ` : m))
      .replace(/^4\. /m, '3. `[visitor · tier: ≥ village]` A planted line that takes an older line\'s number.\n4. ');
    const shifted = ANNEX.slice(0, from) + pool + ANNEX.slice(to);
    expect(shifted).not.toBe(ANNEX);
    const r = project(shifted);
    expect(r.status).not.toBe(0);
    expect(r.out).toContain(GUARD);
    expect(r.out).toMatch(new RegExp(`DS-DEF-3 :: Moderate: RENUMBERED: the text "${head(3)}.*stood at v3 at the baseline and would take v4`));
    expect(r.out).toMatch(new RegExp(`DS-DEF-3 :: Moderate: RE-USED: v3 named "${head(3)}`));
  }, 120_000); // its own budget (moved from the describe's options for SUITE_ARG_FORM, the last close)

  it('POSITIVE: a number gone from a pool is DROPPED', () => {
    const r = project(plant([[`${MOD4}\n`, '']]));
    expect(r.status).not.toBe(0);
    expect(r.out).toContain(GUARD);
    expect(r.out).toMatch(new RegExp(`DS-DEF-3 :: Moderate: DROPPED: v4 "${head(4)}`));
  }, 120_000); // its own budget (moved from the describe's options for SUITE_ARG_FORM, the last close)

  /** v3's own words cut at its first comma: a rewording in place, under the same number and tags */
  const REWORDED = `${textOf(3).split(',')[0]}.`;
  const reworded = MOD3.replace(textOf(3), REWORDED);
  const sha = (/** @type {string} */ t) => createHash('sha256').update(t).digest('hex');
  it('POSITIVE: words changed in place under the same number, with no allowance row, are REWORDED', () => {
    const r = project(plant([[MOD3, reworded]]));
    expect(r.status).not.toBe(0);
    expect(r.out).toContain(GUARD);
    expect(r.out).toMatch(/DS-DEF-3 :: Moderate: REWORDED: v3 would change its words in place/);
    // anchored: the same output carries the REWORDED refusal (asserted above), so the guard ran and spoke
    expect(r.out).not.toMatch(/RENUMBERED|RE-USED|DROPPED/);
  }, 120_000); // its own budget (moved from the describe's options for SUITE_ARG_FORM, the last close)

  it('NEGATIVE: the same rewording WITH its row passes the guard; a row for another number, or another text, does not', () => {
    const annex = plant([[MOD3, reworded]]);
    const row = { pool: 'DS-DEF-3 :: Moderate', vid: 3, from: sha(textOf(3)), to: sha(REWORDED), ruling: 'FAULTS-DESKS plant' };
    const ok = project(annex, [row]);
    // anchored: the same output is asserted on the next line to reach the --check's staleness test, past the guard
    expect(ok.out).not.toContain(GUARD);
    expect(ok.out).toContain('is stale; run `npm run gen:dossier-prose`');
    // each wrong row is refused, and the refusal says what is true of it (FR18 (3))
    for (const [wrong, why] of /** @type {Array<[object, RegExp]>} */ ([
      [{ ...row, vid: 4 }, /REWORDED: v3 would change its words in place, .* with no row of WORD_CORRECTIONS;/],
      [{ ...row, to: sha('another text') }, /REWORDED: v3 .* its row of WORD_CORRECTIONS does not answer them \(the row's new-text hash does not match the new words\);/],
      [{ ...row, from: sha('another text') }, /REWORDED: v3 .* does not answer them \(the row's old-text hash is not the baseline's words\);/],
      [{ ...row, ruling: '' }, /REWORDED: v3 .* does not answer them \(the row names no ruling\);/],
    ])) {
      expect(project(annex, [wrong]).out).toMatch(why);
    }
  }, 120_000); // its own budget (moved from the describe's options for SUITE_ARG_FORM, the last close)

  it('NEGATIVE: a new line at the NEXT number passes the guard (the --check then finds the leaf stale)', () => {
    const r = project(plant([[MOD_LAST_LINE, `${MOD_LAST_LINE}\n${MOD_LAST + 1}. \`[visitor · tier: ≥ village]\` A planted line at the next number.`]]));
    // anchored: the same output is asserted on the next line to reach the --check's staleness test, past the guard
    expect(r.out).not.toContain(GUARD);
    expect(r.out).toContain('is stale; run `npm run gen:dossier-prose`');
  }, 120_000); // its own budget (moved from the describe's options for SUITE_ARG_FORM, the last close)
});

// ─── 13d (FR6): the atom and the seven lines ─────────────────────────────────────────────────────────────────────────

const SAFETY_POOLS = ['Very Safe', 'Safe', 'Moderate', 'Unsafe'];
/** every "record of crimes" line of the four pools, by identity (block, pool, vid) */
const RECORD_LINES = SAFETY_POOLS.flatMap((pool) => (DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-3'].pools[pool] || [])
  .filter((/** @type {any} */ v) => /record of crimes/.test(v.text)).map((/** @type {any} */ v) => ({ pool, v })));

/** the bar0- arm of the census probe's seed map (PAGE-COPY `seedcfg.mjs`), and its r2r- arm */
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
function cfgFor(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
}
/** 13d's towns (the thirty's control C16222 first; DESKS-DEF's and DESKS-2's), and towns that keep a court or a gaol */
const NEITHER = ['bar0-hamlet-calm-rand-45', 'bar0-hamlet-calm-rand-29', 'bar0-thorp-calm-rand-33', 'bar0-thorp-calm-rand-35', 'bar0-thorp-calm-rand-41',
  'r2r-hamlet-55', 'r2r-thorp-28', 'r2r-village-19', 'r2r-village-6', 'r2r-town-4', 'r2r-town-33'];
/** the Unsafe twin's three towns (no watch, no court, no gaol), and two Unsafe cities that keep a watch and a court */
const UNSAFE_EMPTY = ['bar0-hamlet-calm-rand-27', 'bar0-hamlet-calm-rand-29', 'r2r-thorp-30'];
const UNSAFE_KEPT = ['r2r-city-0', 'r2r-city-41'];
// FR18 (2): a court with no gaol is in the arm by name ("Court only", "Town hall bench only"), so the atom's court half is
// held as its prison half is ("Prison only": bar0-town-calm-rand-30, -46, bar0-town-occupied-rand-47)
const OTHERS = ['bar0-town-calm-rand-45', 'bar0-town-calm-rand-28', 'bar0-town-calm-rand-30', 'bar0-town-calm-rand-46', 'bar0-town-occupied-rand-47', 'bar0-city-wartime-rand-32', 'r2r-town-5', 'r2r-village-3'];

/** @type {Map<string, any>} */ const towns = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...NEITHER, ...OTHERS, ...UNSAFE_EMPTY, ...UNSAFE_KEPT])) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
}, 300_000);

const legalRow = (/** @type {any} */ s) => deriveSupportingCapabilities(s).find((r) => r.label === 'Legal Infrastructure')?.status;
const forms = (/** @type {any} */ s) => /** @type {Array<[string, any]>} */ ([['record', s], ['public', toPublicSafe(structuredClone(s))], ['the share veil', projectShareVeil(toPublicSafe(structuredClone(s)), null)]]);

describe('13d (FR6): `court or gaol`, and the record-of-crimes lines that presume it', () => {
  it('the seven record-of-crimes lines of the four safety pools each declare `court or gaol` (and no other line of the four does)', () => {
    expect(RECORD_LINES.map(({ pool, v }) => `${pool} v${v.vid}`)).toEqual(['Very Safe v3', 'Very Safe v5', 'Safe v2', 'Safe v3', 'Safe v5', 'Moderate v2', 'Unsafe v2']);
    const failures = collectSeedFailures(SAFETY_POOLS.flatMap((pool) => DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-3'].pools[pool].map((/** @type {any} */ v) => ({ pool, v }))), ({ pool, v }) => {
      expect(variantFactDeclaration(v).needs.includes('court or gaol'), `${pool} v${v.vid}`).toBe(/record of crimes/.test(v.text));
    });
    expectNoSeedFailures(failures, 'a line declares the atom exactly where it presumes a record kept');
  });

  it('the atom is held equal to the Legal Infrastructure row on every town, on all three forms; both answers occur', () => {
    const seen = new Set();
    const rows = new Set();
    const failures = collectSeedFailures([...towns.keys()], (seed) => {
      const s = towns.get(seed);
      const row = legalRow(s);
      expect(row, seed).toBeTruthy();
      seen.add(row !== 'None');
      rows.add(row);
      for (const [form, r] of forms(s)) expect(factsOf(r).courtOrGaol, `${seed} · ${form} · Legal row "${row}"`).toBe(row !== 'None');
    });
    expectNoSeedFailures(failures, '`court or gaol` answers as the Legal row prints');
    expect([...seen].sort()).toEqual([false, true]);
    // each half alone is in the arm: a court with no gaol, and a gaol with no court (FR18 (2))
    expect([...rows].filter((r) => /^(Court|Town hall bench|Council bench) only$/.test(String(r))).length).toBeGreaterThan(0);
    expect(rows.has('Prison only')).toBe(true);
  });

  it('13d\'s towns keep neither, and none of them draws a record-of-crimes line into the public-order slot', () => {
    const failures = collectSeedFailures(NEITHER, (seed) => {
      const s = towns.get(seed);
      expect(factsOf(s).courtOrGaol, seed).toBe(false);
      const line = defenseStateProse(s, { seed })?.publicOrder?.beside;
      // anchored: RECORD_LINES (the first test) pins the seven record lines present in the pools these towns draw from
      expect(String(line?.text ?? line ?? ''), seed).not.toMatch(/record of crimes/);
    });
    expectNoSeedFailures(failures, 'no record of crimes where no court sits and no gaol stands');
  });

  it('each line is refused by the atom where it is false and not where it holds (a negative beside each positive)', () => {
    const neither = factsOf(towns.get('bar0-hamlet-calm-rand-45'));
    const over = (/** @type {boolean} */ held) => { const f = Object.create(neither); Object.defineProperty(f, 'courtOrGaol', { value: held }); return f; };
    const failures = collectSeedFailures(RECORD_LINES, ({ pool, v }) => {
      const decl = variantFactDeclaration(v);
      expect(declarationAdmits(decl, over(false)).refused, `${pool} v${v.vid} where neither stands`).toContain('court or gaol');
      // anchored: the line above holds the same declaration refused by `court or gaol` where it is false
      expect(declarationAdmits(decl, over(true)).refused, `${pool} v${v.vid} where one stands`).not.toContain('court or gaol');
    });
    expectNoSeedFailures(failures, 'the atom refuses each line exactly where it is false');
  });
});

// ─── the Unsafe twin (the chair's word of 09:11 UTC): v4, at the pool's next number ─────────────────────────────────────

describe('13d (FR6): the Unsafe pool\'s twin `[ledger · no court or gaol · no watch]` where its record line was false', () => {
  const unsafe = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-3'].pools.Unsafe;
  const twin = unsafe.find((/** @type {any} */ v) => v.vid === 4);
  const filled = (/** @type {any} */ s) => String(twin?.text).replace('{settlement}', s.name);

  it('the twin stands at v4, the NEXT number, and declares what it presumes', () => {
    // LAST-VARIETY (2026-11-18) appended v5 and v6 after it: the twin keeps v4
    expect(unsafe.map((/** @type {any} */ v) => v.vid).slice(0, 4)).toEqual([1, 2, 3, 4]);
    expect(twin?.marks).toEqual(['no court or gaol', 'no watch']);
  });

  // LAST-VARIETY (2026-11-18, BRIEF-LAST item 1) gave these three towns two more admitted lines (v5, v6), so the draw now
  // chooses among three there: re-keyed by identity from "prints" to "is admitted, and what prints is an admitted line"
  it('it is admitted in the three towns where the pool spoke no line, and they print a line the pool admits there, on the record, its public projection and the share veil', () => {
    const failures = collectSeedFailures(UNSAFE_EMPTY, (seed) => {
      const s = towns.get(seed);
      expect(s.economicState?.safetyProfile?.safetyLabel, seed).toBe('Unsafe');
      for (const [form, r] of forms(s)) {
        const admitted = unsafe.filter((/** @type {any} */ v) => declarationAdmits(variantFactDeclaration(v), factsOf(r)).admitted);
        expect(admitted.map((/** @type {any} */ v) => v.vid), `${seed} · ${form}`).toContain(4);
        expect(admitted.map((/** @type {any} */ v) => String(v.text).replace('{settlement}', s.name)), `${seed} · ${form}`).toContain(defenseStateProse(r, { seed })?.publicOrder?.beside);
      }
    });
    expectNoSeedFailures(failures, 'the Unsafe twin is admitted where no watch, no court and no gaol stand');
  });

  it('NEGATIVE: an Unsafe town with a watch and a court does not print it, and each premise alone refuses it', () => {
    const failures = collectSeedFailures(UNSAFE_KEPT, (seed) => {
      const s = towns.get(seed);
      expect(s.economicState?.safetyProfile?.safetyLabel, seed).toBe('Unsafe');
      const line = defenseStateProse(s, { seed })?.publicOrder?.beside;
      expect(typeof line, seed).toBe('string');
      expect(line, seed).not.toBe(filled(s));
    });
    expectNoSeedFailures(failures, 'the twin stays out where a watch or a court stands');
    const base = factsOf(towns.get('bar0-hamlet-calm-rand-27'));
    const over = (/** @type {Record<string, unknown>} */ o) => { const f = Object.create(base); for (const [k, v] of Object.entries(o)) Object.defineProperty(f, k, { value: v }); return f; };
    const decl = variantFactDeclaration(twin);
    expect(declarationAdmits(decl, base).admitted).toBe(true);
    expect(declarationAdmits(decl, over({ courtOrGaol: true })).refused).toEqual(['no court or gaol']);
    expect(declarationAdmits(decl, over({ defence: { ...base.defence, watch: true } })).refused).toEqual(['no watch']);
  });
});
