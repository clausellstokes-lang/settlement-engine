/**
 * HOOKS-BUILD (PAGE-7's brief, 2026-11-20 17:01 UTC; the chair's rulings of 16:35 and 17:00): A TROUBLE'S HOOKS FROM A
 * POOL BY NEED, THREE KEPT. The eight commonest tension kinds stored their template's WHOLE hook list, so two places of one
 * kind shared every line. Each kind now holds a pool (`src/data/troubleHooks.js :: TROUBLE_HOOKS`): a line is admitted
 * where its needs hold through the declared door (`drawDeclared.js`), the admitted lines are ranked by
 * `fnv1a32(`${seed}::trouble::${kind}::hook::${text}`)` highest first, and the top three are stored. No draw is added.
 *
 * The arms COMPUTE every sentence from the pool's own export; none is quoted.
 *   1. totality: the eight kinds and the ruled counts, at least four need-free lines a pool, every need a known atom;
 *   2. three hooks on every tension of these kinds, on 150 towns a size (0 short lists);
 *   3. each place's three are its pool's lines in rank order, every line above them stored or declaring a need; the door
 *      notes exactly the stored lines; and no stored hook's need fails on the final record but the two late writes named;
 *   4. same seed, same hooks;
 *   5. the approved seat's twin swap still reads the legitimacy pool (`historyData.js :: LEGITIMACY_HELD_TWINS`);
 *   6. `toPublicSafe` default mode carries no `plotHooks` (the chair's arm).
 * Red at 3411c9c83 (no pool module; the template's whole list stored).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf, isKnownAtom } from '../../src/domain/facts/factVocabulary.js';
import { fnv1a32 } from '../../src/kernel/proseHash.js';
import { HISTORICAL_EVENTS_DATA, LEGITIMACY_HELD_TWINS, legitimacyHeldTensions } from '../../src/data/historyData.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

// Loaded softly so the red at the base names every arm (the module does not exist there).
const troubleHooks = await import('../../src/data/troubleHooks.js').catch(() => ({}));
const POOLS = /** @type {Record<string, Array<{ text: string, needs?: string[], excludes?: string[] }>>} */ (/** @type {any} */ (troubleHooks).TROUBLE_HOOKS ?? {});
const RULED = Object.freeze({
  crime_wave: 16, guild_conflict: 16, resource_scarcity: 9, external_threat: 9,
  succession_crisis: 9, outside_debt: 9, legitimacy_crisis: 9, corruption_scandal: 9,
});
const KINDS = Object.keys(RULED);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const KEPT = 3;
/** Each approved-seat twin back to its form. */
const FORM_OF = Object.fromEntries(Object.entries(LEGITIMACY_HELD_TWINS).map(([form, twin]) => [twin, form]));
const atomsOf = (/** @type {{ needs?: string[], excludes?: string[] }} */ row) => [...(row.needs || []), ...(row.excludes || [])];
const rank = (/** @type {string} */ seed, /** @type {string} */ kind, /** @type {string} */ text) => fnv1a32(`${seed}::trouble::${kind}::hook::${text}`);
const birth = (/** @type {string} */ size, /** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });

describe('HOOKS-BUILD arm 1: the pools are total', () => {
  test('the eight kinds, at the ruled counts', () => {
    expect(Object.fromEntries(Object.entries(POOLS).map(([k, p]) => [k, p.length]))).toEqual(RULED);
  });
  test('every line is a string, unique in its pool, and every pool has at least four lines that need nothing', () => {
    for (const kind of KINDS) {
      const pool = POOLS[kind] || [];
      expect(pool.every((r) => typeof r.text === 'string' && r.text.length > 0), kind).toBe(true);
      expect(new Set(pool.map((r) => r.text)).size, `${kind} unique`).toBe(pool.length);
      expect(pool.filter((r) => atomsOf(r).length === 0).length, `${kind} need-free`).toBeGreaterThanOrEqual(4);
    }
  });
  test('every need is an atom the vocabulary knows', () => {
    const unknown = KINDS.flatMap((k) => (POOLS[k] || []).flatMap(atomsOf).filter((a) => !isKnownAtom(a)));
    expect(unknown).toEqual([]);
  });
  test("each kind's template is a tension template, and no pool line is an approved seat's twin", () => {
    for (const kind of KINDS) expect(HISTORICAL_EVENTS_DATA.some((t) => t.type === kind), kind).toBe(true);
    const twins = new Set(Object.values(LEGITIMACY_HELD_TWINS));
    expect(KINDS.flatMap((k) => (POOLS[k] || []).map((r) => r.text)).filter((t) => twins.has(t))).toEqual([]);
  });
  test('no byMemory copy of a hook list stands for these kinds (the pool belongs to the kind)', () => {
    const copies = HISTORICAL_EVENTS_DATA.filter((t) => KINDS.includes(t.type))
      .flatMap((t) => Object.entries(t.byMemory || {}).filter(([, w]) => w && 'plotHooks' in w).map(([m]) => `${t.type}.${m}`));
    expect(copies).toEqual([]);
  });
});

describe('HOOKS-BUILD arms 2-6: the stored hooks, 150 towns a size', () => {
  /** @type {Array<{ seed: string, size: string, record: any, notes: any[] }>} */
  const towns = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const size of SIZES) for (let i = 0; i < N; i++) {
      const seed = `hxd-${size}-${i}`;
      const { result: record, ledger } = withPresumptionLedger(() => birth(size, seed));
      towns.push({ seed, size, record, notes: ledger.filter((n) => String(n.pool).startsWith('troubleHooks:')) });
    }
  }, 900_000);

  const tensionsOf = () => towns.flatMap((t) => (t.record.history?.currentTensions || [])
    .filter((x) => KINDS.includes(x.type)).map((x) => ({ ...t, tension: x })));

  test('arm 2: every tension of these kinds stores three hooks (0 short lists)', () => {
    const rows = tensionsOf();
    expect(rows.length).toBeGreaterThan(500);
    const short = rows.filter(({ tension }) => !Array.isArray(tension.plotHooks) || tension.plotHooks.length !== KEPT).map(({ seed, tension }) => `${seed} ${tension.type} ${tension.plotHooks?.length}`);
    expect(short).toEqual([]);
  }, 60_000);

  test('arm 3: every stored hook is a line of its pool, the three in rank order, and a line that outranks them is stored or declares a need', () => {
    const bad = [];
    for (const { seed, tension } of tensionsOf()) {
      const pool = POOLS[tension.type] || [];
      const rowOf = (/** @type {string} */ h) => pool.find((r) => r.text === h) ?? pool.find((r) => r.text === FORM_OF[h]);
      const rows = (tension.plotHooks || []).map(rowOf);
      if (rows.some((r) => !r)) { bad.push(`${seed} ${tension.type}: a hook not of its pool`); continue; }
      const keys = rows.map((r) => rank(seed, tension.type, r.text));
      if (keys.some((k, i) => i > 0 && k > keys[i - 1])) bad.push(`${seed} ${tension.type}: not in rank order`);
      const floor = Math.min(...keys);
      const skipped = pool.filter((r) => !rows.includes(r) && rank(seed, tension.type, r.text) > floor);
      for (const r of skipped) if (atomsOf(r).length === 0) bad.push(`${seed} ${tension.type}: a need-free line outranks the stored three`);
    }
    expect(bad).toEqual([]);
  }, 60_000);

  test('arm 3b: the declared door notes exactly the stored lines, each admitted at the pick', () => {
    const bad = [];
    for (const { seed, record, notes } of towns) {
      for (const tension of (record.history?.currentTensions || []).filter((x) => KINDS.includes(x.type))) {
        const pool = POOLS[tension.type] || [];
        const mine = notes.filter((n) => n.pool === `troubleHooks:TROUBLE_HOOKS:${tension.type}`);
        const stored = (tension.plotHooks || []).map((h) => pool.findIndex((r) => r.text === (FORM_OF[h] ?? h))).sort((a, b) => a - b);
        const noted = mine.map((n) => n.lineId).sort((a, b) => a - b);
        if (stored.join() !== noted.join() || mine.some((n) => n.resolvedBy !== 'drawn')) bad.push(`${seed} ${tension.type}: stored ${stored} noted ${noted}`);
      }
    }
    expect(bad).toEqual([]);
  }, 60_000);

  test('arm 3c: every stored hook\'s needs hold on the FINAL record, but for the late writes named here', () => {
    // A late write: the atom held when the history was written and not at the end of the birth (the birth self-check,
    // `presumptionCheck.js`, names it). Both are `seat outranked` on the legitimacy pool; the cure is at assembly
    // (`power/rosterText.js :: settleTensionsToRoster`), outside this unit. The list is exact: a new one reds, a cured one reds.
    const LATE_WRITES = ['hxd-hamlet-36 legitimacy_crisis seat outranked', 'hxd-metropolis-61 legitimacy_crisis seat outranked'];
    const fails = [];
    for (const { seed, record, tension } of tensionsOf()) {
      const pool = POOLS[tension.type] || [];
      const facts = factsOf(record);
      for (const h of tension.plotHooks || []) {
        const r = pool.find((x) => x.text === (FORM_OF[h] ?? h));
        if (r && !declarationAdmits(declarationOf(r), facts).admitted) fails.push(`${seed} ${tension.type} ${atomsOf(r).join('+')}`);
      }
    }
    expect(fails).toEqual(LATE_WRITES);
  }, 60_000);

  test('arm 4: same seed, same hooks', () => {
    const picks = towns.filter((t, i) => i % 75 === 0);
    expect(picks.length).toBe(12);
    expectNoSeedFailures(collectSeedFailures(picks, ({ seed, size, record }) => {
      const again = birth(size, seed);
      expect(again.history?.currentTensions?.map((x) => x.plotHooks), seed).toEqual(record.history?.currentTensions?.map((x) => x.plotHooks));
    }), 'same seed, same hooks');
  }, 120_000);

  test("arm 5: an approved seat's legitimacy hook takes its twin, and the form comes back where the seat is not approved", () => {
    const form = (POOLS.legitimacy_crisis || []).map((r) => r.text).find((t) => t in LEGITIMACY_HELD_TWINS);
    expect(form, 'the legitimacy pool carries the line the approved seat swaps').toBeTruthy();
    const held = tensionsOf().filter(({ tension }) => tension.type === 'legitimacy_crisis');
    expect(held.length).toBeGreaterThan(0);
    expectNoSeedFailures(collectSeedFailures(held, ({ seed, record, tension }) => {
      const approved = record.powerStructure?.publicLegitimacy?.isApproved === true;
      expect(tension.plotHooks.filter((/** @type {string} */ h) => (approved ? h in LEGITIMACY_HELD_TWINS : h in FORM_OF)), seed).toEqual([]);
    }), 'each legitimacy hook in the form its seat reads');
    const t = { type: 'legitimacy_crisis', description: 'x', plotHooks: [String(form)] };
    const twin = legitimacyHeldTensions([t], { publicLegitimacy: { isApproved: true } })[0].plotHooks[0];
    expect(twin).toBe(LEGITIMACY_HELD_TWINS[String(form)]);
    expect(legitimacyHeldTensions([{ ...t, plotHooks: [twin] }], { publicLegitimacy: { isApproved: false } })[0].plotHooks[0]).toBe(form);
  }, 60_000);

  test("arm 6: toPublicSafe's default mode carries no plotHooks", () => {
    const withTension = towns.filter((t) => (t.record.history?.currentTensions || []).some((x) => KINDS.includes(x.type) && x.plotHooks?.length)).slice(0, 30);
    expect(withTension.length).toBe(30);
    expectNoSeedFailures(collectSeedFailures(withTension, ({ seed, record }) => {
      expect(JSON.stringify(toPublicSafe(record)).includes('"plotHooks"'), seed).toBe(false);
    }), 'no plotHooks in the public projection');
  }, 60_000);
});
