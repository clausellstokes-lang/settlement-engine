/**
 * proseTasteAnnex.walker.test.js — THE TASTE'S SEVEN MODIFIER POOLS, AND THE PROOF THAT
 * BIRTHING THEM MOVED NOTHING THAT ALREADY EXISTED (TASTE car M-2; ARCH §2.5, §6.3-§6.5, §8.6).
 *
 * ⛔ THIS DOCK IS NEVER LANDED. The seven pools carry a placeholder — one `[plain]` row whose
 * whole text is the authoring marker — until the writers replace them, and the projector
 * refuses that marker BY NAME unless it is invoked with `--taste`. The arms below hold three
 * properties that must be true whatever the writers write:
 *
 *   1. THE ADDITIVE PROOF. Every SHIFT REGISTER pin recomputed over the SPINE pools alone is
 *      byte-identical to the §916 value the register records as `additiveBase`. That is what
 *      "a new pool moves nothing existing" means executably: not that the corpus digest held
 *      (it cannot; there are seven more pools), but that the 708 rows behind it did.
 *   2. THE DECLARED SHAPE. The seven pools carry the role, relation, form, move, attach set
 *      and one read path ARCH §6.3-§6.5 specifies, and their census rows carry the same
 *      reading on the BRANCH grain with `rung: 'annex'` saying where it came from.
 *   3. THE TWO RELAXATIONS, EACH CONVICTED IN BOTH DIRECTIONS. The authoring marker and
 *      T-F12's civic-object-class collision are refused without `--taste` and PRINTED with it,
 *      and nothing else is.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT, STATE_ANNEX } from '../helpers/dossierCorpus.js';
import { modifierRows, spineRows } from '../../src/domain/prose/wiringCensus.js';
import {
  AUTHORING_MARKER, assertNoAuthoringMarker, assertPoolDeclaration, readAnnexDeclarations,
} from '../../scripts/lib/dossier-annex-grammar.mjs';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';

const CORPUS = {
  ...DOSSIER_STATE_PROSE_DEFENSE,
  ...DOSSIER_STATE_PROSE_ECONOMY,
  ...DOSSIER_STATE_PROSE_GENERAL,
  ...DOSSIER_STATE_PROSE_POWER,
  ...DOSSIER_STATE_PROSE_STRESSORS,
  ...DOSSIER_STATE_PROSE_WAR_FAITH,
};
const CENSUS = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
const REGISTER = JSON.parse(readFileSync(join(ROOT, 'docs/content/prose-shift-register.json'), 'utf8'));
const ROWS = new Map(CENSUS.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));

/** The seven, exactly as ARCH §6.3-§6.5 and the taste's charter name them. */
const TASTE = Object.freeze([
  { block: 'DS-DEF-11', pool: 'country: pressed (walled)', reads: 'settlement.config.monsterThreat', move: 'PRESENT', attach: ['WALLED-STRAINED'], covert: false },
  { block: 'DS-DEF-11', pool: 'country: pressed (unwalled)', reads: 'settlement.config.monsterThreat', move: 'PRESENT', attach: ['UNWALLED-LARGE', 'UNWALLED-SMALL'], covert: false },
  { block: 'DS-DEF-11', pool: 'watch: bought (revealed)', reads: 'compromised.revealed', move: 'INSTITUTION', attach: ['WALLED-QUIET', 'WALLED-STRAINED', 'WALLED-THREATENED'], covert: false },
  { block: 'DS-DEF-11', pool: 'watch: bought (covert)', reads: 'compromised.covert', move: 'INSTITUTION', attach: ['WALLED-QUIET', 'WALLED-STRAINED', 'WALLED-THREATENED'], covert: true },
  { block: 'DS-DEF-2', pool: 'stores: short', reads: 'settlement.economicState.foodSecurity.label', move: 'PRESENT', attach: ['Disasters & Famine: granary AND hospital'], covert: false },
  { block: 'DS-DEF-2', pool: 'stores: import-fed', reads: 'settlement.economicState.foodSecurity.label', move: 'PRESENT', attach: ['Disasters & Famine: granary AND hospital'], covert: false },
  { block: 'DS-GEN-3', pool: 'purse: short', reads: 'readings.economicGates.military', move: 'PRESENT', attach: ['scores.military: CRITICAL', 'scores.military: WEAK'], covert: false },
]);

/** Every (block, pool) of the state corpus, ordered as the register's digests are. */
const META_ROWS = Object.entries(CORPUS)
  .flatMap(([id, block]) => Object.entries(block.pools)
    .map(([pool, variants]) => ({ id, pool, variants, meta: (block.poolMeta || {})[pool] })))
  .sort((a, b) => (`${a.id} :: ${a.pool}` < `${b.id} :: ${b.pool}` ? -1 : 1));

/** @param {string} text */
const sha256Hex = (text) => createHash('sha256').update(text).digest('hex');
/** The register's own `_digestMaterial` idiom, re-spelled rather than imported. */
const digestOver = (rows, fn) => sha256Hex(rows.map((r) => `${r.id} :: ${r.pool} :: ${fn(r)}`).join('\n'));
const renameDigest = (rows) => sha256Hex(rows.map((r) => `${r.id} :: ${r.pool}`).join('\n'));
/** @param {string} id */
const mechanism = (id) => REGISTER.mechanisms.find((m) => m.id === id);

const SPINE_META = META_ROWS.filter((r) => r.meta.role !== 'modifier');

describe('the taste\'s seven modifier pools are BORN, with the shape ARCH specifies', () => {
  it('projects all seven with their declared role, relation, form, move, seat and attach set', () => {
    const wrong = [];
    for (const row of TASTE) {
      const at = `${row.block} :: ${row.pool}`;
      const meta = CORPUS[row.block]?.poolMeta?.[row.pool];
      if (!meta) { wrong.push(`${at}: no poolMeta`); continue; }
      if (meta.role !== 'modifier') wrong.push(`${at}: role ${meta.role}`);
      if (meta.relation !== 'addition') wrong.push(`${at}: relation ${meta.relation}`);
      if (meta.form !== 'sentence') wrong.push(`${at}: form ${meta.form}`);
      if (meta.move !== row.move) wrong.push(`${at}: move ${meta.move} against ${row.move}`);
      if (meta.readsCount !== 1) wrong.push(`${at}: readsCount ${meta.readsCount}`);
      // ⛔ THE SEAT REASON IS `not-consequence`, AND THE BRIEF PREDICTED `no-row`. Measured,
      // not argued: `seatOf` answers `not-a-modifier`, then `not-consequence`, and only then
      // reaches the pair walk that can answer `no-row`. All seven declare `addition`, so they
      // never reach the row question at all — `no-row` would be the answer for a modifier that
      // declared `consequence`, which none of them may (car 0's F1: the join is 0 of 165).
      if (meta.seat !== 'sentence') wrong.push(`${at}: seat ${meta.seat}`);
      if (meta.seatReason !== 'not-consequence') wrong.push(`${at}: seatReason ${meta.seatReason}`);
      if (meta.attach.join('|') !== row.attach.join('|')) wrong.push(`${at}: attach ${meta.attach.join('|')}`);
    }
    expect(wrong).toEqual([]);
  });

  it('carries the authoring marker on exactly those seven pools and nowhere else', () => {
    const marked = META_ROWS
      .filter((r) => r.variants.some((v) => String(v.text).includes(AUTHORING_MARKER)))
      .map((r) => `${r.id} :: ${r.pool}`);
    expect(marked.sort()).toEqual(TASTE.map((t) => `${t.block} :: ${t.pool}`).sort());
    // The covert pool's placeholder already carries the mark its READS path requires.
    const covert = CORPUS['DS-DEF-11'].pools['watch: bought (covert)'];
    expect(covert.every((v) => (v.marks || []).includes('dm-only'))).toBe(true);
    expect(CORPUS['DS-DEF-11'].pools['watch: bought (revealed)']
      .every((v) => (v.marks || []).includes('dm-only'))).toBe(false);
  });
});

describe('the census carries seven ANNEX-rung modifier rows, and nothing else moved', () => {
  it('gives each of the seven a row on the branch grain, with `rung: annex` saying where it came from', () => {
    const wrong = [];
    for (const t of TASTE) {
      const at = `${t.block} :: ${t.pool}`;
      const row = ROWS.get(at);
      if (!row) { wrong.push(`${at}: no census row`); continue; }
      if (row.role !== 'modifier') wrong.push(`${at}: role ${row.role}`);
      if (row.rung !== 'annex') wrong.push(`${at}: rung ${row.rung}`);
      if (row.readsGrain !== 'branch') wrong.push(`${at}: grain ${row.readsGrain}`);
      if (row.reads.join('|') !== t.reads) wrong.push(`${at}: reads ${row.reads.join('|')}`);
      if (row.covert !== t.covert) wrong.push(`${at}: covert ${row.covert}`);
      if (row.status !== 'RESOLVED') wrong.push(`${at}: status ${row.status}`);
    }
    expect(wrong).toEqual([]);
  });

  it('partitions the register: spines + modifiers = every row, and the totals count the spines', () => {
    const spines = spineRows(CENSUS.rows);
    const modifiers = modifierRows(CENSUS.rows);
    expect(spines.length + modifiers.length).toBe(CENSUS.rows.length);
    expect(modifiers.length).toBe(TASTE.length);
    expect(CENSUS.totals.modifierRows).toBe(TASTE.length);
    // ⭐ THE POINT OF THE FILTER: every corpus integer still counts the 708 it was pinned on.
    expect(CENSUS.totals.pools).toBe(spines.length);
    expect(CENSUS.totals.resolved + CENSUS.totals.unresolved).toBe(spines.length);
    expect(CENSUS.modifiers.rows.map((r) => `${r.block} :: ${r.pool}`).sort())
      .toEqual(TASTE.map((t) => `${t.block} :: ${t.pool}`).sort());
  });

  it('the annex reader and the projected leaves agree on every pool that declares a role', () => {
    const declared = readAnnexDeclarations(readFileSync(STATE_ANNEX, 'utf8'));
    const disagree = [];
    for (const [at, row] of declared) {
      const meta = CORPUS[row.block]?.poolMeta?.[row.pool];
      if (!meta) { disagree.push(`${at}: the reader found a pool the leaves do not hold`); continue; }
      if (meta.role !== row.role) disagree.push(`${at}: reader ${row.role}, leaf ${meta.role}`);
      if (row.role === 'modifier' && meta.readsCount !== row.reads.length) {
        disagree.push(`${at}: reader ${row.reads.length} reads, leaf readsCount ${meta.readsCount}`);
      }
    }
    expect(disagree).toEqual([]);
    // NON-VACUITY: the reader found the seven and not zero.
    expect([...declared.values()].filter((r) => r.role === 'modifier')).toHaveLength(TASTE.length);
  });
});

describe('⭐⭐ THE ADDITIVE PROOF — every SHIFT REGISTER pin over the SPINE pools is the §916 value', () => {
  it('variant counts, face counts, vids, keys and attach sets are byte-identical at the base', () => {
    const base = (id) => mechanism(id).additiveBase;
    expect(SPINE_META).toHaveLength(META_ROWS.length - TASTE.length);
    expect(SPINE_META.reduce((n, r) => n + r.meta.variantCount, 0))
      .toBe(base('variant-count-per-pool').sum);
    expect(digestOver(SPINE_META, (r) => r.meta.variantCount))
      .toBe(base('variant-count-per-pool').digest);
    expect(SPINE_META.reduce((n, r) => n + r.meta.faceCounts.reduce((a, b) => a + b, 0), 0))
      .toBe(base('face-count-per-variant').sum);
    expect(Math.max(...SPINE_META.flatMap((r) => r.meta.faceCounts)))
      .toBe(base('face-count-per-variant').max);
    expect(digestOver(SPINE_META, (r) => r.meta.faceCounts.join(',')))
      .toBe(base('face-count-per-variant').digest);
    expect(digestOver(SPINE_META, (r) => r.meta.vids.join(','))).toBe(base('vids').digest);
    expect(renameDigest(SPINE_META)).toBe(base('pool-key-rename').digest);
    expect(SPINE_META.filter((r) => r.meta.attach.length > 0)).toHaveLength(base('attach-set').nonEmpty);
    expect(digestOver(SPINE_META, (r) => r.meta.attach.join('|'))).toBe(base('attach-set').digest);
    // AND NO SPINE GAINED A SEAT KEY: the `seat` row's own promotion trigger is untouched.
    expect(SPINE_META.filter((r) => r.meta.seat !== undefined)).toEqual([]);
  });

  it('and the register\'s CURRENT pins are the recomputation over all pools, seven included', () => {
    const pins = (id) => mechanism(id).pin;
    const value = (id, kind, n = 0) => pins(id).filter((p) => p.kind === kind)[n].value;
    expect(META_ROWS.reduce((n, r) => n + r.meta.variantCount, 0))
      .toBe(value('variant-count-per-pool', 'integer'));
    expect(digestOver(META_ROWS, (r) => r.meta.variantCount))
      .toBe(value('variant-count-per-pool', 'digest'));
    expect(META_ROWS.reduce((n, r) => n + r.meta.faceCounts.reduce((a, b) => a + b, 0), 0))
      .toBe(value('face-count-per-variant', 'integer'));
    expect(Math.max(...META_ROWS.flatMap((r) => r.meta.faceCounts)))
      .toBe(value('face-count-per-variant', 'integer', 1));
    expect(digestOver(META_ROWS, (r) => r.meta.faceCounts.join(',')))
      .toBe(value('face-count-per-variant', 'digest'));
    expect(digestOver(META_ROWS, (r) => r.meta.vids.join(','))).toBe(value('vids', 'digest'));
    expect(renameDigest(META_ROWS)).toBe(value('pool-key-rename', 'digest'));
    expect(META_ROWS.filter((r) => r.meta.attach.length > 0)).toHaveLength(value('attach-set', 'integer'));
    expect(digestOver(META_ROWS, (r) => r.meta.attach.join('|'))).toBe(value('attach-set', 'digest'));
    // The `seat` NOT-mechanism's two pins: seven keys, zero clause seats.
    const seat = REGISTER.notMechanisms.find((n) => n.id === 'seat');
    expect(META_ROWS.filter((r) => r.meta.seat !== undefined)).toHaveLength(seat.pin[0].value);
    expect(META_ROWS.filter((r) => r.meta.seat === 'clause')).toHaveLength(seat.pin[1].value);
  });

  it('every mechanism carrying an ADDITIVE row names the seven pools it was moved by', () => {
    const moved = REGISTER.mechanisms.filter((m) => m.additive);
    expect(moved.map((m) => m.id).sort()).toEqual([
      'attach-set', 'face-count-per-variant', 'pool-key-rename', 'variant-count-per-pool', 'vids',
    ]);
    for (const m of moved) {
      expect(m.additivePools.sort(), `${m.id} names the additive pools`)
        .toEqual(TASTE.map((t) => `${t.block} :: ${t.pool}`).sort());
      expect(m.additive).toMatch(/NEVER LANDED/);
    }
    // AND NO OTHER MECHANISM MOVED: the ones with no additive row are the ones whose pins are
    // integers at zero or a source string, and those are asserted unmoved by their own arms.
    const untouched = REGISTER.mechanisms.filter((m) => !m.additive).map((m) => m.id);
    expect(untouched).toContain('norm-bit');
    expect(untouched).toContain('draw-formula');
    expect(untouched).toContain('registry-id');
  });
});

describe('the two relaxations of `--taste`, each convicted in BOTH directions', () => {
  const variants = [{ text: `${AUTHORING_MARKER} a pool nobody has written`, index: 1 }];

  it('the authoring marker THROWS without the flag and PRINTS with it', () => {
    expect(() => assertNoAuthoringMarker('FIXTURE :: pool', variants, false))
      .toThrow(/carries the authoring marker/);
    const printed = [];
    expect(() => assertNoAuthoringMarker('FIXTURE :: pool', variants, true, (m) => printed.push(m)))
      .not.toThrow();
    expect(printed).toHaveLength(1);
    expect(printed[0]).toContain('--taste');
    // A clean pool is silent under BOTH readings, so the flag cannot hide an ordinary run.
    const clean = [{ text: 'The stores are short.', index: 1 }];
    const quiet = [];
    assertNoAuthoringMarker('FIXTURE :: pool', clean, true, (m) => quiet.push(m));
    expect(quiet).toEqual([]);
    expect(() => assertNoAuthoringMarker('FIXTURE :: pool', clean, false)).not.toThrow();
  });

  it('T-F12\'s civic-object collision THROWS without the flag and PRINTS with it', () => {
    const censusOf = (key) => (key === 'SPINE'
      ? { tests: ['a.b'], reads: ['a.b'], objectClass: 'store', objectClasses: ['store', 'care'], sites: [] }
      : { tests: ['x.y'], reads: ['x.y'], objectClass: 'store', objectClasses: ['store'], sites: [] });
    const input = {
      blockId: 'DS-FIX-1',
      poolKey: 'stores: short',
      variants: [{ text: 'a', index: 1, marks: [], slots: [] }],
      declared: { role: 'modifier', reads: ['x.y'], relation: 'addition', attach: ['SPINE'] },
      censusOf,
      isCovert: () => false,
      edgesFrom: () => [],
      blockPoolKeys: new Set(['SPINE', 'stores: short']),
      declaredRoleByPool: { SPINE: 'spine', 'stores: short': 'modifier' },
    };
    expect(() => assertPoolDeclaration(input)).toThrow(/same civic object class `store`/);
    const printed = [];
    expect(() => assertPoolDeclaration({ ...input, taste: true, waive: (m) => printed.push(m) }))
      .not.toThrow();
    expect(printed).toHaveLength(1);
    expect(printed[0]).toContain('T-F12');
    // ⭐ AND THE SET IS WHAT COLLIDES, NOT THE FIRST CLASS (the projector half of the MEASURE
    // fold's cure 9). A modifier over the spine's SECOND class is refused too.
    const care = {
      ...input,
      poolKey: 'care: thin',
      variants: [{ text: 'a', index: 1, marks: [], slots: [] }],
      censusOf: (key) => (key === 'SPINE'
        ? { tests: ['a.b'], reads: ['a.b'], objectClass: 'store', objectClasses: ['store', 'care'], sites: [] }
        : { tests: ['x.y'], reads: ['x.y'], objectClass: 'care', objectClasses: ['care'], sites: [] }),
      declaredRoleByPool: { SPINE: 'spine', 'care: thin': 'modifier' },
      blockPoolKeys: new Set(['SPINE', 'care: thin']),
    };
    expect(() => assertPoolDeclaration(care)).toThrow(/same civic object class `care`/);
  });

  it('the ATTACH field guard reads the BRANCH grain, and the two grains disagree here', () => {
    // The shipped shape: WALLED-STRAINED's BRANCH does not test `monsterThreat`; its key
    // function's function-wide reading does. Read against the wrong grain the whole DS-DEF-11
    // country modifier of ARCH §6.3 is refused at the site the architecture specifies.
    const spine = ROWS.get('DS-DEF-11 :: WALLED-STRAINED');
    // anchored: the PRESENT half is the very next line — the same field on the other grain
    expect(spine.reads).not.toContain('settlement.config.monsterThreat');
    expect(spine.fieldsRead).toContain('settlement.config.monsterThreat');
    const censusOf = (key) => (key === 'WALLED-STRAINED'
      ? { tests: spine.fieldsRead, reads: spine.reads, objectClass: null, objectClasses: [], sites: [] }
      : { tests: ['settlement.config.monsterThreat'], reads: ['settlement.config.monsterThreat'], objectClass: null, objectClasses: [], sites: [] });
    const input = {
      blockId: 'DS-DEF-11',
      poolKey: 'country: pressed (walled)',
      variants: [{ text: 'a', index: 1, marks: [], slots: [] }],
      declared: {
        role: 'modifier', reads: ['settlement.config.monsterThreat'], relation: 'addition', attach: ['WALLED-STRAINED'],
      },
      censusOf,
      isCovert: () => false,
      edgesFrom: () => [],
      blockPoolKeys: new Set(['WALLED-STRAINED', 'country: pressed (walled)']),
      declaredRoleByPool: { 'WALLED-STRAINED': 'spine', 'country: pressed (walled)': 'modifier' },
    };
    expect(() => assertPoolDeclaration(input)).not.toThrow();
    // THE PLANT: hand the same call the FUNCTION-WIDE grain as its `reads`, and the attach dies.
    const wrongGrain = {
      ...input,
      censusOf: (key) => (key === 'WALLED-STRAINED'
        ? { tests: spine.fieldsRead, reads: spine.fieldsRead, objectClass: null, objectClasses: [], sites: [] }
        : censusOf(key)),
    };
    expect(() => assertPoolDeclaration(wrongGrain)).toThrow(/already tests/);
  });
});
