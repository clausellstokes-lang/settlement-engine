// CENSUS-4d (the chair's answer 1 to CENSUS-4c, R-V): the three STRESS_GOALS lines that name
// "the council" as this place's authority (famine#1, indebted#1, slave_revolt#2) declare
// `excludes: ruler: lord, ruler: occupier`, and the goal draw is handed the ruler kind it already
// has (`birthFactsOf` + the power structure, settled before `generatePopulation`: 0 of 585 differ,
// CENSUS-4c). No draw moves and no roll changes; the birth self-check stays the guard.
import { describe, it, expect, beforeAll } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { rulerKindOf } from '../../src/domain/facts/rulerKind.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { presumptionFindings } from '../../src/domain/facts/presumptionCheck.js';
import { birthFactsOf } from '../../src/domain/facts/factsOf.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const COUNCIL_GOALS = [
  'Find out where the hoarded reserves are before the council does',
  'Identify which members of the council have already made private terms with the creditor',
  'Reach the revolt’s leaders with a settlement the council has forbidden them to offer',
];
const POOL = 'npcGenerator:STRESS_GOALS';

describe('birthFactsOf carries the ruler kind when handed the power structure', () => {
  it('reads the government; absent, it reads null as before', () => {
    expect(birthFactsOf({ powerStructure: { government: 'Feudal lord' } }).rulerKind).toBe('lord');
    expect(birthFactsOf({}).rulerKind).toBeNull();
  });
});

describe('the council goals are refused under a lord or an occupier', () => {
  beforeAll(async () => { await ensureLaws(); });
  // one birth per goal, each printing it under a lord at CENSUS-4c's tip
  // LANDING-R2 seat E: one parameterless test over the three births, every seed run and collected.
  it('soak1k-83, -539, -160: no NPC holds the council goal under its lord', () => {
    const failures = collectSeedFailures([[83, 0], [539, 1], [160, 2]], ([i, k]) => {
      const ledger = [];
      const { result } = withPresumptionLedger(() => birth(i), ledger);
      const s = result.settlement;
      expect(rulerKindOf(s), `soak1k-${i}`).toBe('lord');
      const held = (s.npcs || []).filter((n) => (n.goal?.short ?? n.goal) === COUNCIL_GOALS[k]).map((n) => n.role);
      expect(held, `soak1k-${i}`).toEqual([]);
      expect(presumptionFindings(s, ledger.filter((e) => e.pool === POOL)), `soak1k-${i}`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no council goal is held under a lord');
  }, 360000);
});

// R-V hands the site the ONE fact measured as settled (the ruler kind), not the whole power
// structure: a guild FACTION (guild.js's power branch) is not settled at the draw — the density
// law can empty it later — so handing it admitted Mayor#0's guild goal in births whose final
// record holds no guild (soak1k-224, -842, -878: cert:false-presumption, unit 2a's first cut).
describe('the goal draw is handed the government only', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('soak1k-224, -842, -878: no NPC goal presumes a fact the final record denies', () => {
    const failures = collectSeedFailures([224, 842, 878], (i) => {
      const ledger = [];
      const { result } = withPresumptionLedger(() => birth(i), ledger);
      const goals = ledger.filter((e) => /^npc(Data|Generator):(NPC_FACTION_GOALS|STRESS_GOALS)$/.test(e.pool));
      expect(goals.length, `soak1k-${i}`).toBeGreaterThan(0);
      expect(presumptionFindings(result.settlement, goals), `soak1k-${i}`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no NPC goal presumes a fact its final record denies');
  }, 360000);
});
