/**
 * npcVerdictTable.test.js — W-H2: THE TOTAL VERDICT TABLE.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §3c, laws 2 REVEALED-ONLY, 3 TOTALITY,
 * 4 FINITE SEMANTICS, 5 DORMANCY.)
 *
 * WHAT THE TOTALITY PIN ACTUALLY PROVES, and why it is a WALK rather than fixtures.
 * The mountain_pass class is the recorded cautionary tale: a vocabulary cell nobody
 * enumerated resolved to a fall-through nobody noticed, and no number of per-outcome
 * fixtures would have found it because a fixture only visits the cells its author
 * thought of. So the walk here does two things a fixture cannot:
 *   1. it enumerates the domain from the module's OWN verdictCells(), so a widened
 *      input widens the walk instead of leaving new cells unvisited; and
 *   2. it independently RECONSTRUCTS the expected cell set from the closed vocabulary
 *      (COMPROMISE_SOURCES x prison x criminal power) and asserts equality, so the
 *      enumerator cannot silently shrink and take the walk down with it. Without that
 *      second half the walk would be self-referential: a verdictCells() that returned
 *      one cell would pass a walk over verdictCells().
 *
 * SEED FAMILIES, NOT SEEDS. Two of the three arms end in a WEIGHTED choice, so a
 * single-key pin over them is vacuous by construction: it proves what one roll did,
 * never what the arm can do. Every restriction pin below runs a family and asserts on
 * the SET of outcomes observed, and every family loop rides collectSeedFailures so the
 * reported failure count is the true one rather than the first casualty.
 */
import { describe, test, expect } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  VERDICTS,
  ROAMING_VERDICTS,
  HOLDING_VERDICT,
  EXPOSURE_KINDS,
  VERDICT_TRIGGERING_EXPOSURE_KINDS,
  NPC_CONSEQUENCES_TUNING,
  VERDICT_FORK_LABEL,
  PRISON_INSTITUTION_NAMES,
  verdictCells,
  resolveVerdict,
  baseVerdictFor,
  verdictRollKey,
  verdictRoll01,
  hasPrison,
  hasCriminalPower,
  settlementVerdictState,
  compromiseSourceOf,
  exposureContextOf,
  verdictReputationFacets,
  alignmentReadOf,
  competenceReadOf,
  vacatedSeatOf,
  npcVerdictFor,
} from '../../src/domain/worldPulse/npcVerdictTable.js';
import { COMPROMISE_SOURCES, NOTORIETY_BANDS } from '../../src/domain/worldPulse/npcLedgerFacets.js';

/** A family of roll keys wide enough that a 55/45 arm shows both faces many times. */
const KEY_FAMILY = Array.from({ length: 240 }, (_, i) => `${VERDICT_FORK_LABEL}|fam|${i}`);

const DARK = () => ({ simulationRules: {} });
const LIT = () => ({ simulationRules: { npcConsequencesEnabled: true } });

/** The exposure record shape npcAgency.js actually pushes. */
const ousting = (extra = {}) => ({ npcId: 'n', settlementId: 'aldermoor', name: 'Mira Vane', kind: 'ousted', criminalInstitution: null, homeInstitution: 'Town Council', ...extra });

function townWith({ prison = false, criminal = false, faction = 'Town Council' } = {}) {
  const npcs = [{
    id: 'npc_3',
    name: 'Mira Vane',
    role: 'Magistrate',
    importance: 'key',
    influence: 'High',
    power: 40,
    dots: 3,
    corrupt: true,
    factionAffiliation: faction,
    personality: { dominant: 'shrewd', flaw: 'greedy' },
  }];
  return {
    name: 'Aldermoor',
    institutions: [
      ...(prison ? [{ name: 'Small prison/stocks' }] : []),
      ...(criminal ? [{ name: 'Smugglers ring', category: 'criminal' }] : []),
    ],
    npcs,
    factions: [{ name: faction, members: [npcs[0]] }],
    powerStructure: { factions: [{ faction, category: 'civic', power: 60, isGoverning: true }] },
  };
}

/** Every verdict a cell can produce across the whole key family. */
function outcomeSetFor(cell) {
  const seen = new Set();
  for (const key of KEY_FAMILY) seen.add(resolveVerdict({ ...cell, rollKey: key }).verdict);
  return [...seen].sort();
}

// ── LAW 3: TOTALITY ───────────────────────────────────────────────────────────
describe('TOTALITY (law 3) — the table is total over its whole domain', () => {
  test('the enumerated domain is exactly the closed vocabulary cross product', () => {
    // GUARD THE GUARD. The walk below iterates verdictCells(); this reconstructs the
    // same set from the VOCABULARY, so an enumerator that shrank could not quietly
    // shrink the walk with it.
    const expected = [];
    for (const compromiseSource of COMPROMISE_SOURCES) {
      for (const prisonPresent of [false, true]) {
        for (const criminalPowerPresent of [false, true]) {
          expected.push(JSON.stringify({ compromiseSource, prisonPresent, criminalPowerPresent }));
        }
      }
    }
    expect(expected.length, 'anti-vacuity: the cross product must be non-trivial').toBe(12);
    expect(verdictCells().map((cell) => JSON.stringify(cell)).sort()).toEqual(expected.sort());
  });

  test('EVERY cell resolves, for every key in the family, with no fall-through', () => {
    const arms = new Set(['rival_turncoat', 'criminal_founding', 'base']);
    const failures = collectSeedFailures(verdictCells(), (cell) => {
      for (const key of KEY_FAMILY) {
        const decision = resolveVerdict({ ...cell, rollKey: key });
        expect(VERDICTS, `cell ${JSON.stringify(cell)} left the vocabulary`).toContain(decision.verdict);
        expect(arms.has(decision.arm), `cell ${JSON.stringify(cell)} took an undeclared arm: ${decision.arm}`).toBe(true);
        expect(VERDICTS, 'the base arm must itself be in the vocabulary').toContain(decision.baseVerdict);
        expect(Number.isFinite(decision.roll01) && decision.roll01 >= 0 && decision.roll01 < 1).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'every verdict cell resolves inside the closed vocabulary');
  });

  test('ANTI-VACUITY: all four verdicts are actually reachable from the walk', () => {
    // A table that answered 'jailed' for everything would pass the walk above. This is
    // the pin that makes the walk mean something.
    const reached = new Set();
    for (const cell of verdictCells()) for (const v of outcomeSetFor(cell)) reached.add(v);
    expect([...reached].sort()).toEqual([...VERDICTS].sort());
  });

  test('the vocabulary partitions into the holding verdict and the roaming three', () => {
    expect([HOLDING_VERDICT, ...ROAMING_VERDICTS].sort()).toEqual([...VERDICTS].sort());
    expectAbsentWithAnchor(ROAMING_VERDICTS, HOLDING_VERDICT, 'banished', 'jail holds in place');
  });
});

// ── DESIGN §3c: THE RESOLUTION ORDER ──────────────────────────────────────────
describe('the resolution order — eligibility is not certainty', () => {
  test('the base verdict is prison-present ? jailed : banished, and nothing else', () => {
    expect(baseVerdictFor(true)).toBe('jailed');
    expect(baseVerdictFor(false)).toBe('banished');
  });

  test('a rival-compromised NPC IN A PRISON TOWN can still simply be jailed', () => {
    // THE HEADLINE PROPERTY of design §3c. Arm 1 makes turncoat ELIGIBLE, never
    // certain, and the alternative is the base verdict the settlement supports.
    const outcomes = outcomeSetFor({ compromiseSource: 'rival_power', prisonPresent: true, criminalPowerPresent: false });
    expect(outcomes).toEqual(['jailed', 'turncoat']);
  });

  test('a rival-compromised NPC in a prison-less town lands on turncoat or banished', () => {
    const outcomes = outcomeSetFor({ compromiseSource: 'rival_power', prisonPresent: false, criminalPowerPresent: false });
    expect(outcomes).toEqual(['banished', 'turncoat']);
  });

  test('the rival arm runs even when a criminal power is present (arm 1 outranks arm 2)', () => {
    const failures = collectSeedFailures(KEY_FAMILY, (key) => {
      const decision = resolveVerdict({ compromiseSource: 'rival_power', prisonPresent: true, criminalPowerPresent: true, rollKey: key });
      expect(decision.arm).toBe('rival_turncoat');
    });
    expectNoSeedFailures(failures, 'a rival-compromised official never reaches the criminal arm');
  });

  test('RESTRICTION, over a seed family: criminal_founding is unreachable without a criminal power', () => {
    const without = outcomeSetFor({ compromiseSource: 'criminal_institution', prisonPresent: false, criminalPowerPresent: false });
    // ANCHOR: the SAME source and the SAME family DOES reach criminal_founding the
    // moment a criminal power exists, so the absence above is the conjunct doing work
    // rather than the arm being dead.
    const withPower = outcomeSetFor({ compromiseSource: 'criminal_institution', prisonPresent: false, criminalPowerPresent: true });
    expect(withPower).toContain('criminal_founding');
    expectAbsentWithAnchor(without, 'criminal_founding', 'banished', 'no criminal power to found under');
  });

  test('RESTRICTION, over a seed family: an uncompromised exposure reaches only the base pair', () => {
    const failures = collectSeedFailures(verdictCells().filter((cell) => cell.compromiseSource === 'none'), (cell) => {
      const outcomes = outcomeSetFor(cell);
      expect(outcomes).toEqual([baseVerdictFor(cell.prisonPresent)]);
    });
    expectNoSeedFailures(failures, 'a compromise-free exposure never mints a turncoat or a founding');
  });

  test('the declared weights are the ones the arms actually use', () => {
    const weights = NPC_CONSEQUENCES_TUNING.VERDICT_WEIGHTS.rival_power;
    const decision = resolveVerdict({ compromiseSource: 'rival_power', prisonPresent: true, criminalPowerPresent: false, rollKey: KEY_FAMILY[0] });
    expect(decision.weights).toEqual(weights);
    // The observed split must sit near the declared ratio, or the weights are decoration.
    const total = weights.eligible + weights.base;
    const wins = KEY_FAMILY.filter((key) => resolveVerdict({ compromiseSource: 'rival_power', prisonPresent: true, criminalPowerPresent: false, rollKey: key }).verdict === 'turncoat').length;
    const share = wins / KEY_FAMILY.length;
    expect(Math.abs(share - weights.eligible / total)).toBeLessThan(0.1);
  });
});

// ── DETERMINISM (design §11) ──────────────────────────────────────────────────
describe('determinism — a hashed roll, zero draws', () => {
  test('the same key always yields the same roll and the same verdict', () => {
    const failures = collectSeedFailures(KEY_FAMILY, (key) => {
      expect(verdictRoll01(key)).toBe(verdictRoll01(key));
      const cell = { compromiseSource: 'rival_power', prisonPresent: true, criminalPowerPresent: true };
      expect(resolveVerdict({ ...cell, rollKey: key })).toEqual(resolveVerdict({ ...cell, rollKey: key }));
    });
    expectNoSeedFailures(failures, 'the verdict roll is a pure function of its key');
  });

  test('the roll key carries the npcfate label and every identity part', () => {
    const key = verdictRollKey({ settlementSeed: 'seed-a', settlementId: 'aldermoor', rosterId: 'npc_3', name: 'Mira Vane', tick: 5 });
    expect(key.startsWith(`${VERDICT_FORK_LABEL}|`)).toBe(true);
    for (const part of ['seed-a', 'aldermoor', 'npc_3', 'Mira Vane', '5']) expect(key).toContain(part);
    // Changing ANY part changes the key, so two people cannot share a fate by construction.
    const others = [
      verdictRollKey({ settlementSeed: 'seed-b', settlementId: 'aldermoor', rosterId: 'npc_3', name: 'Mira Vane', tick: 5 }),
      verdictRollKey({ settlementSeed: 'seed-a', settlementId: 'crowmarch', rosterId: 'npc_3', name: 'Mira Vane', tick: 5 }),
      verdictRollKey({ settlementSeed: 'seed-a', settlementId: 'aldermoor', rosterId: 'npc_4', name: 'Mira Vane', tick: 5 }),
      verdictRollKey({ settlementSeed: 'seed-a', settlementId: 'aldermoor', rosterId: 'npc_3', name: 'Halden Roke', tick: 5 }),
      verdictRollKey({ settlementSeed: 'seed-a', settlementId: 'aldermoor', rosterId: 'npc_3', name: 'Mira Vane', tick: 6 }),
    ];
    expect(new Set(others).size).toBe(others.length);
    for (const other of others) expect(other).not.toBe(key); // anchored: `key` and every member of `others` are built above by the same builder from concrete inputs, and the Set size assertion on the line above proves the collection is live and fully distinct
  });

  test('the roll is INDEPENDENT of the settlement state, so the order pin reads cleanly', () => {
    const key = verdictRollKey({ settlementSeed: 's', settlementId: 'a', rosterId: 'npc_1', name: 'X', tick: 1 });
    const withPrison = resolveVerdict({ compromiseSource: 'rival_power', prisonPresent: true, criminalPowerPresent: false, rollKey: key });
    const without = resolveVerdict({ compromiseSource: 'rival_power', prisonPresent: false, criminalPowerPresent: false, rollKey: key });
    expect(withPrison.roll01).toBe(without.roll01);
    expect(withPrison.baseVerdict).toBe('jailed');
    expect(without.baseVerdict).toBe('banished');
  });
});

// ── LAW 2: REVEALED-ONLY ──────────────────────────────────────────────────────
describe('REVEALED-ONLY (law 2) — covert corruption is untouched', () => {
  test('a corrupt NPC with NO exposure record yields no verdict, but the same NPC with one does', () => {
    const settlement = townWith({ prison: true });
    const npc = settlement.npcs[0];
    expect(npc.corrupt, 'anti-vacuity: the fixture must actually be corrupt').toBe(true);
    const covert = npcVerdictFor({ worldState: LIT(), settlement, npc, exposure: null, settlementSeed: 's', settlementId: 'aldermoor', tick: 5 });
    expect(covert).toBe(null);
    // THE ANCHOR: the identical call with the covert-to-revealed transition supplied
    // DOES sentence them, so the null above measures the gate rather than a broken
    // entry point.
    const revealed = npcVerdictFor({ worldState: LIT(), settlement, npc, exposure: ousting(), settlementSeed: 's', settlementId: 'aldermoor', tick: 5 });
    expect(revealed && revealed.verdict).toBe('jailed');
  });

  test('a DEMOTION is a revealed exposure that the settlement absorbs', () => {
    const settlement = townWith({ prison: true });
    const npc = settlement.npcs[0];
    const context = exposureContextOf({ npc, exposure: ousting({ kind: 'demoted' }) });
    expect(context.revealed, 'a demotion IS revealed').toBe(true);
    expect(context.triggering, 'and it is deliberately not a verdict trigger').toBe(false);
    expect(npcVerdictFor({ worldState: LIT(), settlement, npc, exposure: ousting({ kind: 'demoted' }), settlementSeed: 's', settlementId: 'aldermoor', tick: 5 })).toBe(null);
    expect(VERDICT_TRIGGERING_EXPOSURE_KINDS).toEqual(['ousted']);
    expectAbsentWithAnchor(VERDICT_TRIGGERING_EXPOSURE_KINDS, 'demoted', 'ousted', 'only an ousting reaches the court');
  });

  test('an invented exposure kind is not revealed at all', () => {
    for (const kind of ['exiled', '', null, undefined, 42]) {
      const context = exposureContextOf({ npc: {}, exposure: { kind } });
      expect(context.revealed, `kind ${String(kind)} must not read as revealed`).toBe(false);
      expect(context.compromiseSource).toBe('none');
    }
    expect(EXPOSURE_KINDS).toEqual(['ousted', 'demoted']);
  });

  test('DARK (law 5): the entry point is a no-op whatever the exposure says', () => {
    const settlement = townWith({ prison: true });
    expect(npcVerdictFor({ worldState: DARK(), settlement, npc: settlement.npcs[0], exposure: ousting(), settlementSeed: 's', settlementId: 'aldermoor', tick: 5 })).toBe(null);
    for (const rules of [{ npcConsequencesEnabled: 'true' }, { npcConsequencesEnabled: 1 }, {}, null]) {
      expect(npcVerdictFor({ worldState: { simulationRules: rules }, settlement, npc: settlement.npcs[0], exposure: ousting(), settlementSeed: 's', settlementId: 'aldermoor', tick: 5 })).toBe(null);
    }
  });
});

// ── THE COMPROMISE SOURCE (design §3c inputs) ─────────────────────────────────
describe('the compromise source rides the estate leash resolver', () => {
  test('a foreign exposure is a rival power; a named criminal org is a criminal institution', () => {
    expect(compromiseSourceOf({ npc: {}, exposure: ousting({ foreign: true, patronId: 'crowmarch' }) })).toBe('rival_power');
    expect(compromiseSourceOf({ npc: {}, exposure: ousting({ criminalInstitution: 'Smugglers ring' }) })).toBe('criminal_institution');
    expect(compromiseSourceOf({ npc: {}, exposure: ousting() })).toBe('none');
  });

  test('with no exposure record the NPC own leash answers', () => {
    expect(compromiseSourceOf({ npc: { corruptTies: { foreignPatron: 'crowmarch' } } })).toBe('rival_power');
    expect(compromiseSourceOf({ npc: { corruptTies: { criminalInstitution: 'Smugglers ring' } } })).toBe('criminal_institution');
    expect(compromiseSourceOf({ npc: {} })).toBe('none');
    expect(compromiseSourceOf()).toBe('none');
  });

  test('the source is always a bank member, for any garbage', () => {
    for (const exposure of [null, 'x', 7, [], { kind: 'ousted', criminalInstitution: '' }]) {
      expect(COMPROMISE_SOURCES).toContain(compromiseSourceOf({ npc: null, exposure }));
    }
  });
});

// ── THE SETTLEMENT STATE READERS ──────────────────────────────────────────────
describe('the settlement-state readers', () => {
  test('every catalog prison reads as a prison, and a custom gaol does too', () => {
    for (const name of PRISON_INSTITUTION_NAMES) {
      expect(hasPrison({ institutions: [{ name }] }), `${name} must read as a prison`).toBe(true);
    }
    expect(hasPrison({ institutions: [{ name: 'The Old Gaol' }] })).toBe(true);
  });

  test('a workhouse is NOT a prison, though its description says the line is blurry', () => {
    const workhouse = { institutions: [{ name: 'Workhouse', desc: 'Not a prison but the line is blurry.' }] };
    expect(hasPrison(workhouse)).toBe(false);
    // ANCHOR: the same reader on the same shape DOES see a real prison, so the false
    // above is a name-scoped read rather than a detector that sees nothing.
    expect(hasPrison({ institutions: [{ name: 'Workhouse' }, { name: 'Large prison' }] })).toBe(true);
  });

  test('ruined institutions credit neither prison nor criminal capacity', () => {
    expect(hasPrison({ institutions: [{ name: 'Gaol', status: 'ruined' }] })).toBe(false);

    const ruinedDen = {
      institutions: [{ name: 'Smugglers ring', category: 'criminal', status: 'ruined' }],
    };
    expect(hasCriminalPower(ruinedDen)).toBe(false);
    // ANCHOR: factions are organizations rather than buildings, so the deliberately
    // unfiltered faction half must still see a live underworld beside the ruined den.
    expect(hasCriminalPower({ ...ruinedDen, factions: [{ name: 'Thieves guild' }] })).toBe(true);
  });

  test('a criminal power is a criminal FACTION or a criminal INSTITUTION, in either faction home', () => {
    expect(hasCriminalPower({ factions: [{ name: 'Thieves guild' }] })).toBe(true);
    expect(hasCriminalPower({ powerStructure: { factions: [{ faction: 'The Syndicate', category: 'criminal' }] } })).toBe(true);
    expect(hasCriminalPower({ institutions: [{ name: 'Smugglers ring', category: 'criminal' }] })).toBe(true);
    expect(hasCriminalPower({ factions: [{ name: 'Town Council' }], institutions: [{ name: 'Granary' }] })).toBe(false);
    expect(hasCriminalPower(null)).toBe(false);
  });

  test('settlementVerdictState reads both halves at once', () => {
    expect(settlementVerdictState(townWith({ prison: true, criminal: true })))
      .toEqual({ prisonPresent: true, criminalPowerPresent: true });
    expect(settlementVerdictState(townWith({})))
      .toEqual({ prisonPresent: false, criminalPowerPresent: false });
  });

  test('the vacated seat is read from the membership list, then the affiliation handle', () => {
    const settlement = townWith({ prison: true });
    expect(vacatedSeatOf(settlement, settlement.npcs[0])).toEqual({ factionId: '', factionName: 'Town Council' });
    // A settlement with no grouping roster still resolves through the handle.
    expect(vacatedSeatOf({ npcs: [] }, { id: 'npc_9', factionAffiliation: 'Guild of Coopers' }))
      .toEqual({ factionId: '', factionName: 'Guild of Coopers' });
    // Nobody holds a seat they never had.
    expect(vacatedSeatOf({ npcs: [] }, { id: 'npc_9' })).toEqual({ factionId: '', factionName: '' });
  });
});

// ── THE FACETS A VERDICT MINTS (THE FACET LAW) ────────────────────────────────
describe('the reputation facets a verdict mints', () => {
  test('the edict mark is BANISHED-ONLY, and the other three carry none', () => {
    const failures = collectSeedFailures(VERDICTS, (verdict) => {
      const facets = verdictReputationFacets({ verdict, compromiseSource: 'none', npc: {} });
      expect(facets.edictMark).toBe(verdict === 'banished' ? 'banishment_edict' : 'none');
    });
    expectNoSeedFailures(failures, 'the edict mark never becomes a second copy of the verdict table');
  });

  test('every compromise source maps to a distinct scandal class', () => {
    const classes = COMPROMISE_SOURCES.map((compromiseSource) => verdictReputationFacets({ verdict: 'jailed', compromiseSource, npc: {} }).scandalClass);
    expect(classes).toEqual(['venality', 'betrayal', 'conspiracy']);
  });

  test('a repeat offender is spoken of one band louder, capped at the top rung', () => {
    const at = NPC_CONSEQUENCES_TUNING.REPEAT_EXPOSURE_NOTORIETY_BUMP_AT;
    const once = verdictReputationFacets({ verdict: 'banished', compromiseSource: 'none', npc: {}, timesExposed: at - 1 });
    const again = verdictReputationFacets({ verdict: 'banished', compromiseSource: 'none', npc: {}, timesExposed: at });
    expect(once.notorietyBand).toBe('notorious');
    expect(again.notorietyBand).toBe('infamous');
    const many = verdictReputationFacets({ verdict: 'banished', compromiseSource: 'none', npc: {}, timesExposed: 99 });
    expect(NOTORIETY_BANDS).toContain(many.notorietyBand);
    expect(many.notorietyBand).toBe('infamous');
  });

  test('the alignment read distinguishes NO SIGNAL from a neutral one', () => {
    expect(alignmentReadOf({})).toBe('unknown');
    expect(alignmentReadOf({ personality: {} })).toBe('neutral');
    expect(alignmentReadOf({ personality: { dominant: 'shrewd', flaw: 'greedy' } })).toBe('evil');
  });

  test('the competence read bands the importance tiers, and is total on garbage', () => {
    expect(competenceReadOf({ importance: 'pillar' })).toBe('formidable');
    expect(competenceReadOf({ importance: 'key' })).toBe('capable');
    expect(competenceReadOf({ importance: 'notable' })).toBe('adequate');
    expect(competenceReadOf({ importance: 'minor' })).toBe('inept');
    expect(competenceReadOf(null)).toBe('inept');
  });

  test('every facet set is total and in the bank, for every cell of the table', () => {
    const failures = collectSeedFailures(verdictCells(), (cell) => {
      const facets = verdictReputationFacets({
        verdict: resolveVerdict({ ...cell, rollKey: KEY_FAMILY[0] }).verdict,
        compromiseSource: cell.compromiseSource,
        npc: { importance: 'key', personality: { dominant: 'diligent' } },
      });
      expect(Object.keys(facets)).toEqual(['notorietyBand', 'edictMark', 'scandalClass', 'alignmentRead', 'competenceRead']);
      for (const value of Object.values(facets)) expect(typeof value).toBe('string');
    });
    expectNoSeedFailures(failures, 'a verdict always mints a total facet set');
  });
});
