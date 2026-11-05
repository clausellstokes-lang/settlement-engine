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
  it.each([[83, 0], [539, 1], [160, 2]])('soak1k-%i: no NPC holds the council goal under its lord', (i, k) => {
    const ledger = [];
    const { result } = withPresumptionLedger(() => birth(i), ledger);
    const s = result.settlement;
    expect(rulerKindOf(s)).toBe('lord');
    const held = (s.npcs || []).filter((n) => (n.goal?.short ?? n.goal) === COUNCIL_GOALS[k]).map((n) => n.role);
    expect(held).toEqual([]);
    expect(presumptionFindings(s, ledger.filter((e) => e.pool === POOL))).toEqual([]);
  }, 120000);
});
