/**
 * npcVerdictApply.test.js — W-H2: INFLUENCE RELINQUISHMENT, THE CONTESTED OPENING,
 * THE EXCLUSION DOOR, AND THE VERDICT'S HERALD ITEM.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §3c, §4, §10; laws 5 DORMANCY, 6 CONSERVATION,
 * 7 AUDIENCE PROJECTION.)
 *
 * THE FIXTURE IS ROUND-TRIPPED BEFORE IT IS MEASURED, and that is the whole design of
 * this file. `factions[].members[]` entries ARE the `npcs[]` objects in memory, so an
 * in-memory strip appears to reach both homes no matter which one it actually wrote.
 * Only serialization splits the alias, which means an in-memory pin over this property
 * is VACUOUS by construction. Every relinquishment assertion below therefore runs
 * against a JSON round trip, exactly as a save/reload produces, and the in-memory case
 * is pinned separately so a fix that relies on the alias is caught too.
 *
 * THE SECOND TRAP THIS FILE WATCHES is the faction home itself. There are two lists
 * called factions: the NPC GROUPING roster (`settlement.factions[]`, the only one the
 * real pipeline puts members on) and the POWER roster
 * (`powerStructure.factions[]`). A fixture that only ever builds the second one can
 * make a strip that never walks the first look perfectly healthy.
 */
import { describe, test, expect } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectPresentThenAbsent, expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  applyNpcVerdict,
  stripNpcInfluence,
  contestedOpeningFor,
  verdictHeraldItem,
  RELINQUISHED_FIELDS,
  VACANCY_CAUSE,
  VERDICT_NEWS_TYPE,
  NPC_CONSEQUENCE_KEY,
} from '../../src/domain/worldPulse/npcVerdictApply.js';
import {
  NPC_CONSEQUENCES_TUNING,
  npcVerdictFor,
} from '../../src/domain/worldPulse/npcVerdictTable.js';
import {
  npcLedgerOf,
  hasNpcLedger,
  isExcludedFrom,
  exclusionsOf,
  graduatedNpcIds,
  settlementNpcCensus,
} from '../../src/domain/worldPulse/npcLedger.js';
import { projectNpcPool, findDmTruthPaths } from '../../src/domain/worldPulse/npcLedgerProjection.js';
import { sanitizePublicValue } from '../../src/domain/display/publicSafe.js';
import { settlementWorldPulseEntries } from '../../src/domain/dossier/settlementWorldChronicle.js';

const DARK = () => ({ simulationRules: {} });
const LIT = () => ({ simulationRules: { npcConsequencesEnabled: true } });
const SEED = 'seed-aldermoor';
const SID = 'aldermoor';

const ousting = (extra = {}) => ({ npcId: 'n', settlementId: SID, name: 'Mira Vane', kind: 'ousted', criminalInstitution: null, homeInstitution: 'Town Council', ...extra });

/**
 * A settlement whose faction members ARE its npcs[] objects (the real in-memory alias),
 * built on BOTH faction homes so a strip that walks only one is visible.
 */
function aliasedTown({ prison = true, criminal = false } = {}) {
  const npcs = [
    { id: 'npc_1', name: 'Halden Roke', role: 'Warden', importance: 'key', influence: 'High', power: 40, dots: 3, structuralRank: 'dominant', factionAffiliation: 'Town Council', linkedFactionIds: ['Town Council'], institutionId: 'inst.watch', personality: { dominant: 'shrewd', flaw: 'greedy' } },
    { id: 'npc_2', name: 'Sera Quill', role: 'Archivist', importance: 'notable', influence: 'Moderate', power: 20, dots: 2, factionAffiliation: 'Town Council' },
    { id: 'npc_3', name: 'Mira Vane', role: 'Magistrate', importance: 'pillar', influence: 'High', power: 55, dots: 4, structuralRank: 'dominant', factionAffiliation: 'Town Council', linkedFactionIds: ['Town Council'], institutionId: 'inst.court', corrupt: true, timesExposed: 1, personality: { dominant: 'shrewd', flaw: 'greedy' } },
    { id: 'npc_4', name: 'Tobin Reave', role: 'Cooper', importance: 'notable', factionAffiliation: 'Guild of Coopers' },
  ];
  return {
    name: 'Aldermoor',
    tier: 'town',
    institutions: [
      ...(prison ? [{ name: 'Small prison/stocks' }] : []),
      ...(criminal ? [{ name: 'Smugglers ring', category: 'criminal' }] : []),
      { name: 'Granary' },
    ],
    npcs,
    // THE GROUPING ROSTER — the home the real pipeline writes members on.
    factions: [
      { name: 'Town Council', members: [npcs[0], npcs[1], npcs[2]] },
      { name: 'Guild of Coopers', members: [npcs[3]] },
    ],
    // THE POWER ROSTER — carried with members here on purpose, so a strip that walks
    // only the grouping home also reds.
    powerStructure: {
      factions: [
        { faction: 'Town Council', category: 'civic', power: 60, isGoverning: true, members: [npcs[2]] },
      ],
    },
  };
}

/** Split the alias exactly as a save/reload does. */
const reloaded = (value) => JSON.parse(JSON.stringify(value));

/** The person under sentence, from whichever settlement copy is handed in. */
const subjectOf = (settlement) => settlement.npcs.find((n) => n.id === 'npc_3');

function sentence(settlement, { worldState = LIT(), exposure = ousting(), tick = 5 } = {}) {
  return applyNpcVerdict({
    worldState,
    settlement,
    npc: subjectOf(settlement),
    exposure,
    settlementSeed: SEED,
    settlementId: SID,
    settlementName: 'Aldermoor',
    tick,
  });
}

/** Find the same person in every alias home of a settlement. */
function everyCopyOf(settlement, id) {
  const copies = [];
  for (const npc of settlement.npcs || []) if (npc.id === id) copies.push({ home: 'npcs[]', npc });
  for (const faction of settlement.factions || []) {
    for (const member of faction.members || []) if (member.id === id) copies.push({ home: 'factions[].members[]', npc: member });
  }
  for (const faction of settlement.powerStructure?.factions || []) {
    for (const member of faction.members || []) if (member.id === id) copies.push({ home: 'powerStructure.factions[].members[]', npc: member });
  }
  return copies;
}

// ── DESIGN §4: INFLUENCE RELINQUISHMENT ───────────────────────────────────────
describe('INFLUENCE RELINQUISHMENT (design §4) — atomic across BOTH alias homes', () => {
  test('a RELOADED settlement is stripped at every home, not only the roster', () => {
    const settlement = reloaded(aliasedTown());
    // ANTI-VACUITY, twice over: the alias is genuinely split, and the person genuinely
    // holds influence at every home before the strip.
    const before = everyCopyOf(settlement, 'npc_3');
    expect(before.length, 'the fixture must carry the subject at all three homes').toBe(3);
    expect(before[0].npc).not.toBe(before[1].npc); // anchored: `before` is asserted to have exactly 3 members on the line above, so this identity comparison cannot be vacuous
    for (const copy of before) {
      expect(copy.npc.influence, `${copy.home} must start with influence`).toBe('High');
      expect(copy.npc.factionAffiliation, `${copy.home} must start affiliated`).toBe('Town Council');
    }

    const result = sentence(settlement);
    expect(result.changed).toBe(true);
    expect(result.homes).toEqual({ roster: 1, groupingMembers: 1, powerMembers: 1 });

    const after = everyCopyOf(result.settlement, 'npc_3');
    expect(after.length, 'nobody is dropped from a home by a strip (law 6)').toBe(3);
    const failures = collectSeedFailures(after, (copy) => {
      expect(copy.npc.influence, `${copy.home} kept its influence`).toBe(0);
      expect(copy.npc.power, `${copy.home} kept its power`).toBe(0);
      expect(copy.npc.dots, `${copy.home} kept its dots`).toBe(0);
      expect(copy.npc.importance, `${copy.home} kept its ladder eligibility`).toBe('minor');
      expect(copy.npc.factionAffiliation, `${copy.home} kept its faction role`).toBe('');
      expect(copy.npc.linkedFactionIds, `${copy.home} kept a linked faction id`).toEqual([]);
      expect(copy.npc.institutionId, `${copy.home} kept its institutional seat`).toBe('');
      expect(copy.npc[NPC_CONSEQUENCE_KEY].verdictCause, `${copy.home} carries no consequence mark`).toBe(result.decision.verdict);
    });
    expectNoSeedFailures(failures, 'every alias home relinquished the same things');
  });

  test('the IN-MEMORY case strips both homes too, so the fix cannot lean on the alias', () => {
    const settlement = aliasedTown();
    expect(settlement.factions[0].members[2], 'anti-vacuity: the fixture must actually alias').toBe(settlement.npcs[2]);
    const result = sentence(settlement);
    for (const copy of everyCopyOf(result.settlement, 'npc_3')) {
      expect(copy.npc.influence, `${copy.home}`).toBe(0);
      expect(copy.npc.factionAffiliation, `${copy.home}`).toBe('');
    }
  });

  test('ALL FIVE affiliation handles are cleared, or the rung would never vacate', () => {
    // npcInFaction resolves membership through five keys, first present wins, so a
    // strip that cleared only the display handle would leave the seat occupied.
    const handles = ['factionAffiliation', 'factionId', 'factionLink', 'faction', 'organizationId'];
    const declared = RELINQUISHED_FIELDS.map((field) => field.key);
    for (const handle of handles) expect(declared, `${handle} must be relinquished`).toContain(handle);
    const npc = { id: 'npc_9', factionAffiliation: 'A', factionId: 'B', factionLink: 'C', faction: 'D', organizationId: 'E' };
    const stripped = stripNpcInfluence({ npcs: [npc] }, { rosterId: 'npc_9' });
    for (const handle of handles) expect(stripped.settlement.npcs[0][handle], handle).toBe('');
  });

  test('the strip only writes fields the record already carried', () => {
    const bare = { id: 'npc_9', name: 'Nobody', factionAffiliation: 'A' };
    const stripped = stripNpcInfluence({ npcs: [bare] }, { rosterId: 'npc_9' });
    const keys = Object.keys(stripped.settlement.npcs[0]);
    expect(keys).toEqual(['id', 'name', 'factionAffiliation']);
    expectAbsentWithAnchor(keys, 'influence', 'factionAffiliation', 'the strip never grows a shape');
  });

  test('an unknown or empty roster id patches NOTHING, and returns the same reference', () => {
    const settlement = aliasedTown();
    for (const rosterId of ['', null, undefined, 'npc_404']) {
      const result = stripNpcInfluence(settlement, { rosterId });
      expect(result.changed, `rosterId ${String(rosterId)} must be a no-op`).toBe(false);
      expect(result.settlement).toBe(settlement);
    }
    // FAIL-CLOSED ANCHOR: an empty id must not match the members whose id is also
    // empty, which is the reading that turns one verdict into a settlement-wide purge.
    const idless = { npcs: [{ name: 'A' }, { name: 'B' }] };
    expect(stripNpcInfluence(idless, { rosterId: '' }).changed).toBe(false);
  });

  test('an ID-LESS roster entry is refused outright, so no half-write can happen', () => {
    // The strip matches by roster id. Without the refusal, an id-less person would
    // graduate into the ledger while keeping every scrap of influence at both homes.
    const settlement = reloaded(aliasedTown());
    delete settlement.npcs[2].id;
    const result = applyNpcVerdict({
      worldState: LIT(), settlement, npc: settlement.npcs[2], exposure: ousting(),
      settlementSeed: SEED, settlementId: SID, settlementName: 'Aldermoor', tick: 5,
    });
    expect(result.decision).toBe(null);
    expect(result.settlement).toBe(settlement);
    expect(hasNpcLedger(result.worldState)).toBe(false);
    // ANCHOR: the SAME fixture with the id restored does graduate, so the refusal above
    // measures the guard rather than a broken entry point.
    expect(hasNpcLedger(sentence(reloaded(aliasedTown())).worldState)).toBe(true);
  });

  test('the relinquished snapshot records what they held, for the receipt', () => {
    const settlement = reloaded(aliasedTown());
    const stripped = stripNpcInfluence(settlement, { rosterId: 'npc_3' });
    expect(stripped.relinquished.influence).toBe('High');
    expect(stripped.relinquished.factionAffiliation).toBe('Town Council');
    expect(stripped.relinquished.importance).toBe('pillar');
  });
});

// ── DESIGN §4: THE VACANCY IS NEVER SILENTLY REFILLED ─────────────────────────
describe('the contested opening (design §4) — emitted, never refilled', () => {
  test('the opening carries the vacancy_from_disgrace cause and names the seat', () => {
    const result = sentence(reloaded(aliasedTown()));
    expect(result.opening).toMatchObject({
      kind: 'contested_opening',
      cause: 'vacancy_from_disgrace',
      settlementId: SID,
      factionName: 'Town Council',
      vacatedRosterId: 'npc_3',
      tick: 5,
    });
    expect(result.opening.cause).toBe(VACANCY_CAUSE);
    expect(result.opening.vacatedWnpcId).toBe(result.wnpcId);
  });

  test('NOBODY IS MINTED to fill it: the roster census is identical before and after', () => {
    const settlement = reloaded(aliasedTown());
    const before = settlementNpcCensus(settlement);
    expect(before.npcCount, 'anti-vacuity: the fixture must carry a cast').toBe(4);
    expect(before.memberCount, 'anti-vacuity: the fixture must carry faction members at both homes').toBe(5);
    const result = sentence(settlement);
    const after = settlementNpcCensus(result.settlement);
    expect(after).toEqual(before);
    // And no successor-shaped id appeared anywhere in the serialized settlement.
    const serialized = JSON.stringify(result.settlement);
    expect(serialized).toContain('Mira Vane'); // the ANCHOR: the roster is live and still names her
    expect(serialized).not.toContain('npc.successor'); // anchored: the same string is asserted to contain 'Mira Vane' on the line above, so the subject cannot have gone empty
  });

  test('an UNAFFILIATED person vacates no seat, so no opening is emitted', () => {
    const settlement = reloaded(aliasedTown());
    for (const faction of settlement.factions) faction.members = faction.members.filter((m) => m.id !== 'npc_3');
    settlement.powerStructure.factions[0].members = [];
    const subject = subjectOf(settlement);
    delete subject.factionAffiliation;
    delete subject.linkedFactionIds;
    const result = sentence(settlement);
    expect(result.decision, 'the verdict still lands; only the seat is missing').not.toBe(null);
    expect(result.opening).toBe(null);
    // ANCHOR: the same fixture WITH an affiliation does emit one, so the null above
    // measures the seat rather than a broken emitter.
    expect(sentence(reloaded(aliasedTown())).opening.cause).toBe(VACANCY_CAUSE);
  });

  test('contestedOpeningFor is frozen and total on garbage', () => {
    expect(contestedOpeningFor({ factionName: '' })).toBe(null);
    const opening = contestedOpeningFor({ settlementId: null, factionId: undefined, factionName: 'X', rosterId: null, wnpcId: null, verdict: 'jailed', tick: -3 });
    expect(Object.isFrozen(opening)).toBe(true);
    expect(opening.tick).toBe(0);
    expect(opening.settlementId).toBe('');
  });
});

// ── DESIGN §3c: THE EXCLUSION DOOR AND THE JAIL HOLD ──────────────────────────
describe('the exclusion edge and the jail hold', () => {
  test('BANISHMENT mints an exclusion edge; the other three verdicts do not', () => {
    // Each arm reached through the REAL entry point, by choosing a settlement + leash
    // that lands it, so the pin measures the lane rather than a hand-built decision.
    const cases = [
      { label: 'banished', town: { prison: false }, exposure: ousting(), expect: 'banished' },
      { label: 'jailed', town: { prison: true }, exposure: ousting(), expect: 'jailed' },
      { label: 'criminal_founding', town: { prison: false, criminal: true }, exposure: ousting({ criminalInstitution: 'Smugglers ring' }), expect: 'criminal_founding' },
    ];
    const failures = collectSeedFailures(cases, (item) => {
      const result = sentence(reloaded(aliasedTown(item.town)), { exposure: item.exposure });
      expect(result.decision.verdict, item.label).toBe(item.expect);
      const edges = exclusionsOf(result.worldState, result.wnpcId);
      if (item.expect === 'banished') {
        expect(edges).toHaveLength(1);
        expect(edges[0]).toEqual({ settlementId: SID, kind: 'banishment_edict', indefinite: true });
        expect(isExcludedFrom(result.worldState, result.wnpcId, SID, 99999)).toBe(true);
      } else {
        expect(edges, `${item.label} must shut no door`).toHaveLength(0);
        expect(result.exclusion).toBe(null);
      }
    });
    expectNoSeedFailures(failures, 'only banishment shuts the door behind them');
  });

  test('the banishment edict is INDEFINITE by declaration, and a window makes it timed', () => {
    expect(NPC_CONSEQUENCES_TUNING.BANISHMENT_EXCLUSION_TICKS).toBe(null);
    const result = sentence(reloaded(aliasedTown({ prison: false })));
    expect(result.exclusion.indefinite).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(result.exclusion, 'untilTick')).toBe(false);
  });

  test('JAILED holds in place: placed under this settlement, with a tunable release tick', () => {
    const result = sentence(reloaded(aliasedTown({ prison: true })));
    expect(result.decision.verdict).toBe('jailed');
    const ledger = npcLedgerOf(result.worldState);
    expect(ledger.placed[result.wnpcId].hostSettlementId).toBe(SID);
    expect(Object.keys(ledger.roamers)).toEqual([]);
    expect(result.jailUntilTick).toBe(5 + NPC_CONSEQUENCES_TUNING.JAIL_TERM_TICKS);
    expect(subjectOf(result.settlement)[NPC_CONSEQUENCE_KEY].jailUntilTick).toBe(result.jailUntilTick);
  });

  test('a ROAMING verdict enters the pool with no host and no release tick', () => {
    const result = sentence(reloaded(aliasedTown({ prison: false })));
    expect(result.decision.roaming).toBe(true);
    const ledger = npcLedgerOf(result.worldState);
    expect(Object.keys(ledger.placed)).toEqual([]);
    expect(ledger.roamers[result.wnpcId].verdictCause).toBe('banished');
    expect(result.jailUntilTick).toBe(null);
    const mark = subjectOf(result.settlement)[NPC_CONSEQUENCE_KEY];
    expectAbsentWithAnchor(Object.keys(mark), 'jailUntilTick', 'verdictCause', 'a roamer serves no sentence');
  });

  test('the banished roamer carries the banishment edict mark in their facets', () => {
    const result = sentence(reloaded(aliasedTown({ prison: false })));
    expect(npcLedgerOf(result.worldState).roamers[result.wnpcId].reputation.edictMark).toBe('banishment_edict');
  });
});

// ── DESIGN §3c: THE HERALD ITEM AND ITS ADDRESS CHAIN ─────────────────────────
describe('the verdict Herald item', () => {
  test('it resolves a full NEWS ADDRESS LAW address chain through the EXISTING projection', () => {
    const result = sentence(reloaded(aliasedTown({ prison: false })));
    // The item is shaped as a pulse row, so the estate's own chronicle projection
    // derives the address chain from it without a second read model.
    // BOTH address anchors are asserted DIRECTLY as well as through the projection.
    // The projection alone cannot see targetSaveId: settlementIdsOfPulseRow accepts
    // either discriminator and `containingId` falls back to the queried saveId, so a
    // blanked targetSaveId still produces a correct-looking row. Measured, not assumed
    // (the mutation that blanked it passed this pin until these two lines existed).
    expect(result.news.targetSaveId).toBe(SID);
    expect(result.news.settlementIds).toEqual([SID]);
    const worldState = { pulseHistory: [{ id: 'wp1', tick: 5, createdAt: '2026-01-01T00:00:00.000Z', selectedOutcomes: [result.news] }] };
    const rows = settlementWorldPulseEntries(worldState, SID, { savedSettlements: [{ id: SID, name: 'Aldermoor' }] });
    expect(rows).toHaveLength(1);
    // The address chain is a FILTER as well as a decoration: an unrelated settlement's
    // dossier must not pick this row up.
    expect(settlementWorldPulseEntries(worldState, 'crowmarch', { savedSettlements: [{ id: 'crowmarch', name: 'Crowmarch' }] })).toHaveLength(0);
    expect(rows[0].address).toEqual({
      subject: { settlementId: SID, settlementName: 'Aldermoor', npcId: 'npc_3', factionId: null },
      affectedSettlements: ['Aldermoor'],
      affectedSettlementIds: [SID],
      reason: 'The corruption was proven and the office was forfeit.',
      eventKind: VERDICT_NEWS_TYPE,
    });
    expect(rows[0].title).toBe('Mira Vane is banished from Aldermoor.');
  });

  test('the receipt NAMES ITS INPUTS, and every one of them rides dmTruth', () => {
    const result = sentence(reloaded(aliasedTown({ prison: true })), { exposure: ousting({ foreign: true, patronId: 'crowmarch' }) });
    const receipt = result.news.dmTruth.receipt;
    expect(result.news.dmTruth.compromiseSource).toBe('rival_power');
    expect(receipt).toEqual({
      exposureKind: 'ousted',
      prisonPresent: true,
      criminalPowerPresent: false,
      arm: 'rival_turncoat',
      baseVerdict: 'jailed',
      eligibleVerdict: 'turncoat',
      roll01: result.decision.roll01,
      weights: NPC_CONSEQUENCES_TUNING.VERDICT_WEIGHTS.rival_power,
    });
  });

  test('LAW 7: nothing covert reaches the reader prose, and the scrub strips the receipt', () => {
    const result = sentence(reloaded(aliasedTown({ prison: true, criminal: true })), { exposure: ousting({ foreign: true, patronId: 'crowmarch' }) });
    const readerProse = [result.news.headline, result.news.summary, ...result.news.reasons].join(' ');
    // POSITIVE ANCHOR FIRST: the covert payload demonstrably exists on the item, found
    // through the same helper the negative below uses.
    expect(findDmTruthPaths(result.news)).toEqual(['$.dmTruth']);
    expect(readerProse, 'the prose must actually name the person').toContain('Mira Vane');
    expect(readerProse).not.toContain('rival_power'); // anchored: the same string is asserted to contain 'Mira Vane' on the line above, so the prose collection is live
    expect(readerProse).not.toContain('crowmarch'); // anchored: same live-prose anchor as the line above
    const scrubbed = sanitizePublicValue(result.news);
    expect(findDmTruthPaths(scrubbed), 'the estate scrub must strip the whole receipt').toEqual([]);
    expect(JSON.stringify(scrubbed), 'ANCHOR: the scrub kept the public payload').toContain('Mira Vane');
  });

  test('a turncoat item declares itself DM-only; the others are public', () => {
    // A seed FAMILY, because the rival arm is a weighted choice: a handful of ticks
    // can land entirely on one face and prove nothing about the other.
    /** @type {Record<string, Set<string>>} */
    const audiences = {};
    const failures = collectSeedFailures(Array.from({ length: 60 }, (_, i) => i + 1), (tick) => {
      const result = sentence(reloaded(aliasedTown({ prison: true })), { exposure: ousting({ foreign: true }), tick });
      const verdict = result.decision.verdict;
      audiences[verdict] = audiences[verdict] || new Set();
      audiences[verdict].add(result.news.audience);
    });
    expectNoSeedFailures(failures, 'every tick in the family produced an item');
    expect(Object.keys(audiences).sort(), 'anti-vacuity: the family must reach both faces of the arm').toEqual(['jailed', 'turncoat']);
    expect([...audiences.turncoat]).toEqual(['dm_only']);
    expect([...audiences.jailed]).toEqual(['public']);
  });

  test('verdictHeraldItem is frozen and total on a garbage decision', () => {
    const item = verdictHeraldItem({
      decision: { verdict: 'nonsense', factionId: null, factionName: null, compromiseSource: null, exposureKind: null, prisonPresent: null, criminalPowerPresent: null, arm: null, baseVerdict: null, eligibleVerdict: null, roll01: NaN, weights: null },
      settlementId: null, settlementName: null, rosterId: null, wnpcId: null, npcName: null, tick: -1,
    });
    expect(Object.isFrozen(item)).toBe(true);
    expect(item.audience).toBe('public');
    expect(item.severity).toBe(0.5);
    expect(item.headline).toBe('A disgraced official is imprisoned in the settlement.');
  });
});

// ── LAW 5: DORMANCY ───────────────────────────────────────────────────────────
describe('DORMANCY (law 5) — dark is a pure no-op', () => {
  test('DARK: both references come back unchanged and byte-identical', () => {
    const world = DARK();
    const settlement = aliasedTown();
    const worldBytes = JSON.stringify(world);
    const settlementBytes = JSON.stringify(settlement);
    const result = sentence(settlement, { worldState: world });
    expect(result.worldState).toBe(world);
    expect(result.settlement).toBe(settlement);
    expect(result.decision).toBe(null);
    expect(result.changed).toBe(false);
    expect(JSON.stringify(result.worldState)).toBe(worldBytes);
    expect(JSON.stringify(result.settlement)).toBe(settlementBytes);
    expect(hasNpcLedger(result.worldState)).toBe(false);
    expect(Object.keys(result.worldState)).not.toContain('spatialLedgers'); // anchored: the same object is asserted byte-identical to `worldBytes` two lines above, so this collection cannot have silently emptied
  });

  test('DARK: twenty attempts leave no ledger and no consequence mark', () => {
    let world = DARK();
    let settlement = aliasedTown();
    const failures = collectSeedFailures(Array.from({ length: 20 }, (_, i) => i), (i) => {
      const result = sentence(settlement, { worldState: world, tick: i + 1 });
      world = result.worldState;
      settlement = result.settlement;
      expect(hasNpcLedger(world)).toBe(false);
      expect(subjectOf(settlement)[NPC_CONSEQUENCE_KEY]).toBe(undefined);
    });
    expectNoSeedFailures(failures, 'a dark world never accumulates a verdict');
    // ANCHOR: the identical loop LIT does produce a ledger, so the emptiness above is
    // the flag rather than a broken harness.
    expect(hasNpcLedger(sentence(aliasedTown(), { worldState: LIT() }).worldState)).toBe(true);
  });

  test('a covert (unexposed) corrupt NPC leaves the settlement byte-identical when LIT', () => {
    const settlement = aliasedTown();
    const bytes = JSON.stringify(settlement);
    const result = sentence(settlement, { exposure: null });
    expect(result.settlement).toBe(settlement);
    expect(JSON.stringify(result.settlement)).toBe(bytes);
    expect(result.worldState).toBe(result.worldState);
    expect(hasNpcLedger(result.worldState)).toBe(false);
  });
});

// ── DESIGN §10: LIFECYCLE PATHS ───────────────────────────────────────────────
describe('lifecycle paths (design §10)', () => {
  test('the ledger a verdict writes survives a JSON round trip byte-identically', () => {
    const result = sentence(reloaded(aliasedTown({ prison: false })));
    const beforeBytes = JSON.stringify(npcLedgerOf(result.worldState));
    const afterBytes = JSON.stringify(npcLedgerOf(reloaded(result.worldState)));
    expect(afterBytes).toBe(beforeBytes);
    expect(isExcludedFrom(reloaded(result.worldState), result.wnpcId, SID, 5)).toBe(true);
  });

  test('IDEMPOTENT: re-sentencing the same exposure mints no second identity or edge', () => {
    const first = sentence(reloaded(aliasedTown({ prison: false })));
    const second = applyNpcVerdict({
      worldState: first.worldState,
      settlement: first.settlement,
      npc: subjectOf(first.settlement),
      exposure: ousting(),
      settlementSeed: SEED,
      settlementId: SID,
      settlementName: 'Aldermoor',
      tick: 5,
    });
    expect(second.wnpcId).toBe(first.wnpcId);
    expect(second.decision.verdict).toBe(first.decision.verdict);
    expect(graduatedNpcIds(second.worldState)).toHaveLength(1);
    expect(exclusionsOf(second.worldState, second.wnpcId)).toHaveLength(1);
    expect(JSON.stringify(npcLedgerOf(second.worldState))).toBe(JSON.stringify(npcLedgerOf(first.worldState)));
  });

  test('the verdict is stable across processes: the same inputs give the same sentence', () => {
    const failures = collectSeedFailures(['a', 'b', 'c', 'd', 'e', 'f'], (seed) => {
      const town = reloaded(aliasedTown({ prison: true }));
      const one = npcVerdictFor({ worldState: LIT(), settlement: town, npc: subjectOf(town), exposure: ousting({ foreign: true }), settlementSeed: seed, settlementId: SID, tick: 5 });
      const two = npcVerdictFor({ worldState: LIT(), settlement: reloaded(town), npc: subjectOf(town), exposure: ousting({ foreign: true }), settlementSeed: seed, settlementId: SID, tick: 5 });
      expect(two).toEqual(one);
    });
    expectNoSeedFailures(failures, 'the sentence is a pure function of its inputs');
  });

  test('the pool projection of a sentenced person carries no DM truth for a player', () => {
    const result = sentence(reloaded(aliasedTown({ prison: false })), { exposure: ousting({ foreign: true, patronId: 'crowmarch' }) });
    const dm = projectNpcPool({ worldState: result.worldState, tick: 6, includeCovert: true });
    const player = projectNpcPool({ worldState: result.worldState, tick: 6, includeCovert: false });
    // POSITIVE ANCHOR: the DM view of this very fixture reports the covert path.
    expect(findDmTruthPaths(dm).length).toBeGreaterThan(0);
    expect(findDmTruthPaths(player)).toEqual([]);
    expect(player.total, 'ANCHOR: the player still sees the wanderer').toBe(1);
  });

  test('a removal, anchored by its own before-state: the seat leaves the ladder', () => {
    const settlement = reloaded(aliasedTown({ prison: true }));
    const before = (settlement.factions[0].members || []).filter((m) => m.factionAffiliation === 'Town Council').map((m) => m.id);
    const result = sentence(settlement);
    const after = (result.settlement.factions[0].members || []).filter((m) => m.factionAffiliation === 'Town Council').map((m) => m.id);
    expectPresentThenAbsent(before, after, 'npc_3', 'the disgraced magistrate leaves the council roster');
    expect(after, 'ANCHOR: the untouched members keep their seats').toEqual(['npc_1', 'npc_2']);
  });
});
