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
 *
 * BAR3-CLOSE-SWEEP-B (2026-11-16, letter c; the chair's RG1, RG1b and RG1c, vetoable by the owner): SINCE BAR3-POWERS P3
 * (c0d013098) the relation rows are DERIVED from the conflicts at any intensity (factionDynamics.js ::
 * withConflictRelations: a symbiotic or dependent row, or the merchants' and craftsmen's vote, names its pair's quarrel),
 * and the regen draws its conflicts on its own stream, so the exemption follows the derivation: arm 2 leaves out the
 * conflicts AND, only for a relation row whose pair a conflict of EITHER record names, the two fields the twin writes
 * (`narrative`, `direction`). The law's purpose is kept by a new arm: in the regenerated record every echo names a quarrel
 * the record holds, and every quarrel of a twin-eligible pair is echoed. Measured at fb59da43e: fsr-10 kept its BORN
 * cast's echo ("…at odds over a preacher who denounces the other power") beside a regenerated list that no longer held it.
 * THE CURE (RG1c): the regen keeps every born quarrel and draws only for the pairs the born list does not name
 * (power/conflicts.js :: carryBornQuarrels), and twins only those pairs' rows, through the generator's own function.
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline, regenNPCsPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withConflictRelations } from '../../src/generators/factionDynamics.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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

/** a pair, unordered @param {unknown[]} pair */
const pairKey = (pair) => [...pair].map(String).sort().join('\u0000');
/** the pairs the conflicts of either record name @param {...any[]} lists */
const pairsNamed = (...lists) => new Set(lists.flat().filter((c) => Array.isArray(c?.parties) && c.parties.length === 2).map((c) => pairKey(c.parties)));
/** the echo the twin writes (factionDynamics.js :: withConflictRelations, its three forms) */
const ECHO = /now at odds over|are at odds over .+, and fight over who keeps the profit of the trade\./;
/** the power structure with the two fields the twin writes left out of every row whose pair a conflict names
 * @param {any} ps @param {Set<string>} named */
const withoutEchoes = (ps, named) => ({ ...ps, factionRelationships: (ps?.factionRelationships || []).map((/** @type {any} */ row) => {
  if (!row || !Array.isArray(row.pair) || !named.has(pairKey(row.pair))) return row;
  const { narrative: _n, direction: _d, ...rest } = row;
  return rest;
}) });
/** the governing row's play-time ladder seed @param {any} s */
const governingSeed = (s) => (s?.powerStructure?.factions || []).find((/** @type {any} */ f) => f?.isGoverning)?.captureState ?? null;
/** the relation matrix's rows that carry a capture rung @param {any} s */
const captureRows = (s) => (s?.powerStructure?.factionRelationships || []).filter((/** @type {any} */ r) => r && r.captureState !== undefined);

describe('FIX-SECTION-REGEN — an NPC section regen derives the hall-capture state the full generation derives', () => {
  test('every derived field of the hall: the state, the governing seed, the capture rows', () => {
    expectNoSeedFailures(collectSeedFailures(planted(), ({ seed, record, full }) => {
      expect(`${seed} ${record.powerStructure?.criminalCaptureState}`).toBe(`${seed} ${full.powerStructure?.criminalCaptureState}`);
      expect(`${seed} ${governingSeed(record)}`).toBe(`${seed} ${governingSeed(full)}`);
      expect([seed, captureRows(record)]).toEqual([seed, captureRows(full)]);
    }), 'the regenerated record holds the full generation\'s hall');
  }, 240_000);

  test('the whole power structure but the conflicts address and what is derived from it agrees with the full generation', () => {
    expectNoSeedFailures(collectSeedFailures(planted(), ({ seed, record, full }) => {
      const named = pairsNamed(record.conflicts, full.conflicts);
      const { conflicts: _a, ...regen } = record.powerStructure || {};
      const { conflicts: _b, ...reference } = full.powerStructure || {};
      expect([seed, withoutEchoes(regen, named)]).toEqual([seed, withoutEchoes(reference, named)]);
    }), 'the regenerated power structure equals the full generation\'s but for the conflicts address and its echoes');
  }, 240_000);

  test('the regenerated rows echo exactly the regenerated record\'s own quarrels (the planted four and fsr-0..39)', () => {
    const seeds = [...new Set([...PLANTED, ...Array.from({ length: 40 }, (_, i) => i)])];
    expectNoSeedFailures(collectSeedFailures(seeds, (i) => {
      const { seed, record } = CACHE.get(i) || plant(i);
      const named = pairsNamed(record.conflicts);
      for (const row of record.powerStructure?.factionRelationships || []) {
        if (!row || !Array.isArray(row.pair)) continue;
        const echoed = ECHO.test(String(row.narrative || ''));
        // no echo of a quarrel the record does not hold
        if (echoed) expect([seed, row.pair, 'echo held', named.has(pairKey(row.pair))]).toEqual([seed, row.pair, 'echo held', true]);
        // no missing echo: a row the record's own quarrel names, and that the generator's twin would change, carries it
        const quarrels = (record.conflicts || []).filter((c) => Array.isArray(c?.parties) && pairKey(c.parties) === pairKey(row.pair));
        if (!echoed && quarrels.length) {
          const twinned = withConflictRelations({ factionRelationships: [row] }, quarrels).factionRelationships[0];
          expect([seed, row.pair, 'echoed', twinned]).toEqual([seed, row.pair, 'echoed', row]);
        }
      }
    }), 'every echo names a quarrel the regenerated record holds');
  }, 600_000);

  test('the conflicts\' two addresses are one list, as the full generation dual-writes them', () => {
    // Cause 2 (measured at bd07005b9: 36/40 seeds held the regen's conflicts at the root and the BORN cast's on
    // powerStructure.conflicts — the address aiLayer, dailyLifeLogic and the generate-narrative edge function read).
    expectNoSeedFailures(collectSeedFailures(planted(), ({ seed, born, parts, record, full }) => {
      expect([seed, full.powerStructure?.conflicts]).toEqual([seed, full.conflicts]);
      expect([seed, record.powerStructure?.conflicts]).toEqual([seed, record.conflicts]);
      expect([seed, record.conflicts]).toEqual([seed, parts.conflicts]);
      expect(born.powerStructure?.conflicts).toEqual(born.conflicts);
    }), 'the conflicts\' two addresses hold one list after a regen');
  }, 240_000);

  test('not vacuous: on every planted seed the regenerated cast earns a different hall than the born one', () => {
    expectNoSeedFailures(collectSeedFailures(planted(), ({ seed, born, full }) => {
      expect(`${seed} ${full.powerStructure?.criminalCaptureState}`).not.toBe(`${seed} ${born.powerStructure?.criminalCaptureState}`);
    }), 'the regenerated cast earns a different hall on every planted seed');
  }, 240_000);
});
