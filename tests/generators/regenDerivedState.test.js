/**
 * tests/generators/regenDerivedState.test.js — FIX-SECTION-REGEN (2026-11-09; car 2's finding, ruled 04:3x;
 * docs/chair/2026-11-09/FIX-SECTION-REGEN-2026-11-09.md).
 *
 * A SECTION regeneration must leave the record holding the same DERIVED state a full generation derives for the
 * same cast. The reference is the full generation itself: the same seed and config, with the regenerated cast and
 * its ties held (`pins: { npcs, relationships }`), so the coherence seam derives the hall from exactly that cast
 * (generators/narrativeGenerator.js :: generateCoherence, its held-roster arm) — one writer for one fact.
 *
 * Written FIRST, red-first at bd07005b9: there `regenNPCsPipeline` derived the hall-capture state on its own view
 * (`{ ...settlement, npcs, config }`, inside enrichNpcCoherence) and returned no `powerStructure`, so the record kept
 * the state its OLD cast had earned. Measured over 40 seeds (fsr-0..39, the four tiers in turn): the regenerated
 * record disagreed with the full generation on `criminalCaptureState`, the governing row's birth `captureState`
 * seed and the relation matrix's capture rows on 7 (fsr-6, fsr-10, fsr-15, fsr-29 planted below), and on nothing
 * else in `powerStructure` but the conflicts' second address.
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline, regenNPCsPipeline } from '../../src/generators/generateSettlementPipeline.js';

const TIERS = ['village', 'town', 'city', 'metropolis'];
/** the planted seeds: the measurement's index i reads tier TIERS[i % 4] */
const PLANTED = [6, 10, 15, 29];

/** @param {number} i */
function plant(i) {
  const seed = `fsr-${i}`;
  const config = { settType: TIERS[i % 4] };
  const born = generateSettlementPipeline(config, null, { seed });
  const { _preservation, _regenSeed, ...parts } = regenNPCsPipeline(born, born.config || config, { seed: `${seed}::regen` });
  const record = { ...born, ...parts };
  const full = generateSettlementPipeline(config, null, { seed, pins: { npcs: parts.npcs, relationships: parts.relationships } });
  return { seed, born, parts, record, full };
}

/** @type {Map<number, ReturnType<typeof plant>>} */
const CACHE = new Map();
const planted = () => PLANTED.map((i) => { if (!CACHE.has(i)) CACHE.set(i, plant(i)); return /** @type {ReturnType<typeof plant>} */ (CACHE.get(i)); });

/** the governing row's play-time ladder seed @param {any} s */
const governingSeed = (s) => (s?.powerStructure?.factions || []).find((/** @type {any} */ f) => f?.isGoverning)?.captureState ?? null;
/** the relation matrix's rows that carry a capture rung @param {any} s */
const captureRows = (s) => (s?.powerStructure?.factionRelationships || []).filter((/** @type {any} */ r) => r && r.captureState !== undefined);

describe('FIX-SECTION-REGEN — an NPC section regen derives the hall-capture state the full generation derives', () => {
  test('every derived field of the hall: the state, the governing seed, the capture rows', { timeout: 240_000 }, () => {
    for (const { seed, record, full } of planted()) {
      expect(`${seed} ${record.powerStructure?.criminalCaptureState}`).toBe(`${seed} ${full.powerStructure?.criminalCaptureState}`);
      expect(`${seed} ${governingSeed(record)}`).toBe(`${seed} ${governingSeed(full)}`);
      expect([seed, captureRows(record)]).toEqual([seed, captureRows(full)]);
    }
  });

  test('the whole power structure but the conflicts address agrees with the full generation', { timeout: 240_000 }, () => {
    for (const { seed, record, full } of planted()) {
      const { conflicts: _a, ...regen } = record.powerStructure || {};
      const { conflicts: _b, ...reference } = full.powerStructure || {};
      expect([seed, regen]).toEqual([seed, reference]);
    }
  });

  test('the conflicts\' two addresses are one list, as the full generation dual-writes them', { timeout: 240_000 }, () => {
    // Cause 2 (measured at bd07005b9: 36/40 seeds held the regen's conflicts at the root and the BORN cast's on
    // powerStructure.conflicts — the address aiLayer, dailyLifeLogic and the generate-narrative edge function read).
    for (const { seed, born, parts, record, full } of planted()) {
      expect([seed, full.powerStructure?.conflicts]).toEqual([seed, full.conflicts]);
      expect([seed, record.powerStructure?.conflicts]).toEqual([seed, record.conflicts]);
      expect([seed, record.conflicts]).toEqual([seed, parts.conflicts]);
      expect(born.powerStructure?.conflicts).toEqual(born.conflicts);
    }
  });

  test('not vacuous: on every planted seed the regenerated cast earns a different hall than the born one', { timeout: 240_000 }, () => {
    for (const { seed, born, full } of planted()) {
      expect(`${seed} ${full.powerStructure?.criminalCaptureState}`).not.toBe(`${seed} ${born.powerStructure?.criminalCaptureState}`);
    }
  });
});
