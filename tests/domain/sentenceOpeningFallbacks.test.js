/**
 * tests/domain/sentenceOpeningFallbacks.test.js — F11 unit 1b, rung 2B: the lower-case
 * sentence-opening fallbacks.
 *
 * A lower-case filler (`x || 'the court'`) interpolated where a sentence OPENS (the string's
 * start, or just after `. ` / `! ` / `? `) printed "the court cannot judge a conquest…". The
 * cure is the unit-1a shape: the slot is sentence-cased ONLY when the fallback fills it; a held
 * name or id is printed exactly as before, and a mid-sentence use keeps its lower-case filler.
 *
 * Each block calls the exported function (or the nearest exported caller) with the name missing
 * so the fallback fires, and, where cheap, with a held name to prove it is unchanged.
 */
import { describe, expect, it } from 'vitest';
import { EVENT_REGISTRY } from '../../src/domain/events/registry.js';
import { coupVerdictOutcomes } from '../../src/domain/worldPulse/coup.js';
import { settlementBlocs } from '../../src/domain/display/politicsRead.js';
import { starvationReceipt } from '../../src/domain/spatial/supplyShipments.js';
import { generosityReceipt } from '../../src/domain/spatial/generosityEV.js';
import {
  evaluateMoralInstitutionPressure, evaluateMoralInstitutionFounding,
} from '../../src/domain/worldPulse/moralInstitutionPressure.js';
import { targetedFootholds } from '../../src/domain/worldPulse/clergyTraitPlane.js';
import { conquestMarginVerdict } from '../../src/domain/worldPulse/conquestExecution.js';
import { readConquestIntent, conquestMercyReceipt } from '../../src/domain/worldPulse/conquestIntent.js';
import {
  readConquestFeasibility, conquestTermsRange, termsRangesOverlap, mistakenFeasibilityReceipt,
} from '../../src/domain/worldPulse/conquestFeasibility.js';
import { readRelationshipExtremity, razingGate, tierFallDescriptor } from '../../src/domain/worldPulse/razing.js';
import { appraiseSettlementAsset } from '../../src/domain/worldPulse/sovereigntyAppraisal.js';
import { concludedWarRows } from '../../src/domain/display/warRemembrance.js';
import {
  placeWord, assignmentNewsItem, deathNewsItem,
} from '../../src/domain/worldPulse/npcDmVerbRecords.js';
import { deriveTraditionAlmanac } from '../../src/domain/traditions/almanac.js';

describe('1. registry SET_PRIMARY_DEITY narrate', () => {
  const narrate = /** @type {(e: any) => string} */ (EVENT_REGISTRY.SET_PRIMARY_DEITY.narrate);
  it('a nameless patron opens on "A new god"; a named one is unchanged', () => {
    expect(narrate({ payload: { snapshot: {}, deityRef: 'd1' } })).toBe("A new god is proclaimed the settlement's patron deity.");
    expect(narrate({ payload: { snapshot: { name: 'Pelor' }, deityRef: 'd1' } })).toBe("Pelor is proclaimed the settlement's patron deity.");
  });
});

describe('2. coup verdict headline', () => {
  const resolved = [{ id: 'c1', type: 'coup_detat', status: 'resolved', severity: 0.5, originSettlementId: 's1', affectedSettlementIds: ['s1'] }];
  const run = (/** @type {any} */ settlement) => coupVerdictOutcomes({
    resolved,
    snapshot: { byId: new Map([['s1', { name: 'Oakmere', settlement, causal: { scores: {} } }]]) },
    rng: { random: () => 0.5 },
    tick: 3,
  });
  it('a seat with no named incumbent opens on "The ruling power"', () => {
    const [out] = run({ name: 'Oakmere', powerStructure: { factions: [] } });
    expect(out.candidateType).toBe('coup_suppressed');
    expect(out.headline).toBe('The ruling power crushes the coup in Oakmere');
  });
});

describe('3. politicsRead projectBloc presence', () => {
  const ws = (/** @type {string[]} */ members) => ({ politicsLedgers: { s1: { blocs: [{ id: 'b1', members, end: 'seats', strain: 0, sinceTick: 0 }] } } });
  it('a memberless open bloc opens on "A power" (SW-5: the retired word, STYLE-RULINGS-2 A8); a held member is unchanged', () => {
    expect(settlementBlocs({ worldState: ws([]), settlementId: 's1' })?.blocs[0].presence).toBe('A power stand together as a bloc, for a share of the seats.');
    expect(settlementBlocs({ worldState: ws(['the Guild']), settlementId: 's1' })?.blocs[0].presence).toBe('the Guild stand together as a bloc, for a share of the seats.');
  });
});

describe('4. supplyShipments starvationReceipt', () => {
  it('a nameless institution opens on "The institution"; a held name is unchanged', () => {
    expect(starvationReceipt({ input: 'iron' })).toBe('The institution starves: the iron road is cut (every supplier severed).');
    expect(starvationReceipt({ institutionName: 'smithy', input: 'iron' })).toBe('smithy starves: the iron road is cut (every supplier severed).');
  });
});

describe('5. generosityEV generosityReceipt', () => {
  const terms = (/** @type {Record<string, number>} */ o) => ({ bond: 0, history: 0, conscience: 0, strategy: 0, faith: 0, margin: 0, commitment: 0, route: 0, domestic: 0, dependency: 0, ...o });
  const base = { giverId: '', receiverId: '', strategicOverride: false, leverageIntent: 0 };
  it('every giver-led opener sentence-cases the fallback', () => {
    expect(generosityReceipt({ ...base, verdict: 'refuse', terms: terms({ commitment: 0.5 }) })).toMatch(/^The giver's granaries stayed shut/);
    expect(generosityReceipt({ ...base, verdict: 'refuse', terms: terms({ route: 0.5 }) })).toBe('The giver held the grain back. The road to the receiver is cut, and seized bushels feed the enemy.');
    expect(generosityReceipt({ ...base, verdict: 'refuse', terms: terms({ dependency: 0.5 }) })).toMatch(/^The giver's patience thins: the receiver asks again/);
    expect(generosityReceipt({ ...base, verdict: 'refuse', terms: terms({}) })).toMatch(/^The giver kept the granaries shut\./);
    expect(generosityReceipt({ ...base, verdict: 'give_as_credit', terms: terms({}) })).toMatch(/^The giver advanced grain to the receiver\./);
  });
  it('the mid-sentence giver keeps its lower-case filler; a held name is unchanged', () => {
    expect(generosityReceipt({ ...base, verdict: 'give_full', strategicOverride: true, terms: terms({}) })).toBe("Grain went to the receiver: their ground shields the giver's flank: the granary opened as defense spending.");
    expect(generosityReceipt({ ...base, giverName: 'thornwall', verdict: 'refuse', terms: terms({}) })).toMatch(/^thornwall kept the granaries shut/);
  });
});

describe('6. moralInstitutionPressure openers', () => {
  const DEVOUT = { localMult: 1.6, realmMult: 1, composite: 1.6, moralMult: 1.6, dampener: { megaphoneLaw: 1 } };
  const settlement = (/** @type {any} */ patron, /** @type {any[]} */ institutions) => ({ institutions, config: { primaryDeitySnapshot: patron, faithProfile: { piety: DEVOUT } } });
  const drive = (/** @type {Function} */ fn, /** @type {any} */ s, /** @type {number} */ max) => {
    let ws = /** @type {any} */ ({ tick: 0, simulationRules: {}, settlementTickStates: {} });
    for (let t = 0; t < max; t++) {
      const out = fn({ ...ws, tick: t }, { settlements: [{ id: 's1', name: 's1', settlement: s }] }, { tick: t });
      ws = out.worldState;
      if (out.candidates.length) return out.candidates[0];
    }
    return null;
  };
  it('a nameless prescriber leads the abolition as "A reaching faith"', () => {
    const fired = drive(evaluateMoralInstitutionPressure, settlement({ alignmentAxis: 'good', lawAxis: 'lawful' }, [{ name: 'Slave market', status: 'active' }]), 40);
    expect(fired?.reasons[0]).toMatch(/^A reaching faith leads the abolition: /);
    expect(fired?.summary).toMatch(/^Under a reaching faith, /);
  });
  it('a nameless patron raises the founding as "The patron"', () => {
    const fired = drive(evaluateMoralInstitutionFounding, settlement({ alignmentAxis: 'good', lawAxis: 'lawful' }, []), 400);
    expect(fired?.reasons[0]).toMatch(/^The patron raises the /);
    expect(fired?.summary).toMatch(/^Under the patron, /);
  });
});

describe('7. clergyTraitPlane targetedFootholds minister name', () => {
  // MERGE-CAR-2 (2026-11-08): the minister in the people car's shape — `entityLinksFaction` reads
  // `memberships[].power` since PEOPLE-5B (57b0de61e); `linkedFactionIds` left the card.
  const settlementWith = (/** @type {any} */ npc) => ({
    powerStructure: { factions: [{ id: 'temple', archetype: 'religious' }] },
    npcs: [{ importance: 'pillar', memberships: [{ power: 'temple', rank: 1, share: 1 }], personality: { dominant: 'corrupt', flaw: 'deceitful' }, ...npc }],
  });
  const patron = { name: 'The Lawgiver', alignmentAxis: 'good', lawAxis: 'lawful' };
  const rivals = [{ ref: 'maw', snapshot: { name: 'The Red Maw', alignmentAxis: 'evil', lawAxis: 'chaotic' } }];
  it('a nameless, id-less minister reads "A minister"; a held name is unchanged', () => {
    expect(targetedFootholds(/** @type {any} */ (settlementWith({})), patron, rivals)[0]?.npcName).toBe('A minister');
    expect(targetedFootholds(/** @type {any} */ (settlementWith({ id: 'n1', name: 'Brother Aldo' })), patron, rivals)[0]?.npcName).toBe('Brother Aldo');
  });
});

describe('8. conquestExecution conquestMarginVerdict', () => {
  it('each band opens on "The victor"; the mid-sentence unknown receipt keeps "the victor"', () => {
    expect(conquestMarginVerdict({ occupierCapacity: 60, occupiedCapacity: 40 }).receipt).toMatch(/^The victor outweighs the held settlement by 20 points/);
    expect(conquestMarginVerdict({ occupierCapacity: 48, occupiedCapacity: 40 }).receipt).toMatch(/^The victor is plainly winning/);
    expect(conquestMarginVerdict({ occupierCapacity: 41, occupiedCapacity: 40 }).receipt).toMatch(/^The victor holds the held settlement by 1 points/);
    expect(conquestMarginVerdict({}).receipt).toMatch(/^the margin between the victor and the held settlement/);
    expect(conquestMarginVerdict({ occupierCapacity: 60, occupiedCapacity: 40, occupierName: 'Marchmont' }).receipt).toMatch(/^Marchmont outweighs/);
  });
});

describe('9. conquestIntent', () => {
  const row = { martialBand: 'pressing', conquestHistoryBand: 'once', ownNatureBand: 'balanced', patronNatureBand: 'none', believedEnemyNatureBand: 'balanced' };
  it('the intent receipt opens on "The court"; the unknown receipt keeps it mid-sentence', () => {
    expect(readConquestIntent(row).receipt).toMatch(/^The court means to /);
    expect(readConquestIntent({}).receipt).toBe('no conquest intent can be read: the court has no martial disposition on record.');
    expect(readConquestIntent({ ...row, partyId: 'Marchmont' }).receipt).toMatch(/^Marchmont means to /);
  });
  it('the mercy receipt opens on "The victor"', () => {
    const mercy = conquestMercyReceipt(/** @type {any} */ ({ known: true, intent: 'terms', moralVerdict: 'refused_the_decent' }), { known: true, conquestReachBand: 'assured' });
    expect(mercy?.receipt).toBe('The victor could have taken everything from the defeated and did not.');
  });
});

describe('10. conquestFeasibility', () => {
  it('the four court-led receipts open capitalised', () => {
    expect(readConquestFeasibility({}).receipt).toBe('The court cannot judge a conquest of its rival: the pair is not two named settlements.');
    expect(conquestTermsRange({}).receipt).toBe('The court has no bargaining range: it cannot judge the war.');
    const range = { partyId: '', known: true, takeByForce01: 0.2, mustGiveToSurvive01: 0.9 };
    expect(termsRangesOverlap(range, range).receipt).toMatch(/^One side and the other price the war compatibly/);
    expect(mistakenFeasibilityReceipt({}, {}).receipt).toBe('The court held no judgement to be wrong about.');
    expect(mistakenFeasibilityReceipt({ partyId: 'Marchmont' }, {}).receipt).toBe('Marchmont held no judgement to be wrong about.');
  });
});

describe('11. razing', () => {
  it('the extremity receipt opens on "The court"', () => {
    expect(readRelationshipExtremity({}).receipt).toMatch(/^The court is not at the extreme with its neighbour: /);
  });
  it('every gate receipt opens on "The victor"; a held actor is unchanged', () => {
    expect(razingGate({}).receipt).toBe('The victor has not taken the defeated: there is no razing without a won siege.');
    expect(razingGate({ siegeWon: true }).receipt).toMatch(/^The victor took the defeated and will not burn it: /);
    expect(razingGate({ actorId: 'marchmont' }).receipt).toMatch(/^marchmont has not taken/);
  });
  it('the tier-fall receipts open on "The settlement"; the mid-sentence unknown keeps it', () => {
    const order = ['village', 'town'];
    expect(tierFallDescriptor({ tierBefore: 'town', tierAfter: 'village', tierOrder: order }).receipt).toBe('The settlement fell from town to village: one rung.');
    expect(tierFallDescriptor({ tierBefore: 'town', tierAfter: 'town', tierOrder: order }).receipt).toMatch(/^The settlement burned and is still a town/);
    expect(tierFallDescriptor({}).receipt).toMatch(/^what the settlement was and what it is now/);
  });
});

describe('12. sovereigntyAppraisal', () => {
  it('the unknown appraisal opens on "The court"', () => {
    expect(appraiseSettlementAsset({}).receipt).toBe('The court cannot price the holding: the pair is not an asset and a court.');
  });
});

describe('14. warRemembrance territory and cost lines', () => {
  const rows = (/** @type {(id: string) => string} */ nameFor) => concludedWarRows({
    worldState: { tick: 5, concludedWars: { w1: {
      warId: 'w1', originPair: ['a', 'd'], originAttackerId: 'a', concludedTick: 4,
      territorialOutcomes: [{ settlementId: 'p', kind: 'razed', occupierId: 'o' }, { settlementId: 'q', kind: 'occupied' }],
      cost: { attackerRemainingBand: 'battered' },
    } } },
    nameFor,
  })[0];
  it('a nameless occupier or place opens on "A court the record no longer names"', () => {
    const row = rows(() => '');
    expect(row.territory[0]).toBe('A court the record no longer names burned a court the record no longer names.');
    expect(row.territory[1]).toBe('A court the record no longer names was held.');
  });
  it('a held name is unchanged', () => {
    const row = rows((id) => ({ o: 'Marchmont', p: 'Thornwall', q: 'Fenby' }[id] || id));
    expect(row.territory).toEqual(['Marchmont burned Thornwall.', 'Fenby was held.']);
  });
});

describe('16. npcDmVerbRecords place word', () => {
  const where = placeWord('', '');
  it('the fallback is still lower-case at the source', () => {
    expect(where).toBe('the realm');
  });
  it('a sentence-opening place slot reads "The realm"; mid-sentence keeps it', () => {
    const assign = assignmentNewsItem({ wnpcId: 'w', who: 'Ada', where, settlementId: '', originSettlementId: '', departureSettlementId: '', overrides: [], tick: 1, inTransit: false });
    expect(assign.summary).toBe('The realm opens its gate to them.');
    expect(assign.headline).toBe('Ada takes up residence in the realm.');
    const death = deathNewsItem({ wnpcId: 'w', who: 'Ada', where, settlementId: '', rosterId: '', locationKnown: true, foreignGuestHoldClosed: false, tick: 1 });
    expect(death.summary).toBe('The realm strikes their name from the register of the living. The realm was the last place that held them.');
  });
  it('a held place is unchanged', () => {
    const assign = assignmentNewsItem({ wnpcId: 'w', who: 'Ada', where: placeWord('s1', ''), settlementId: 's1', originSettlementId: '', departureSettlementId: '', overrides: [], tick: 1, inTransit: false });
    expect(assign.summary).toBe('s1 opens its gate to them.');
  });
});

describe('almanac: a nameless rite at the strip line', () => {
  const saves = (/** @type {any} */ rec) => [{ id: 's1', settlement: { name: 'Fenby', traditions: [{ window: { startWeekOfYear: 3, weeks: 1 }, ...rec }] } }];
  it('opens on "An observance"; a held name is unchanged', () => {
    expect(deriveTraditionAlmanac({ settlements: saves({}), weekTick: 0 }).display).toBe('An observance coming this season');
    expect(deriveTraditionAlmanac({ settlements: saves({}), weekTick: 0 }).coming[0].name).toBe('an observance');
    expect(deriveTraditionAlmanac({ settlements: saves({ name: 'the Lantern Walk' }), weekTick: 0 }).display).toBe('the Lantern Walk coming this season');
  });
});
