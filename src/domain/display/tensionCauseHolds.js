/**
 * domain/display/tensionCauseHolds.js — WHETHER A TROUBLE'S CAUSE HOLDS IN THE DOCUMENT IN HAND (PAGE-7, the brief
 * CAUSES-DATA at 9e4ba24b6; the chair's shape of 15:10, rule 2, and rulings of 15:18). One pure function per key of
 * `data/tensionCauses.js`'s `holds`, over `(record, facts)` with `facts = factsOf(record)`.
 *
 * THE PREDICATES are the chair's of 14:21 and 14:33 (`PAGE-5-HANDBACK.md` §5, `measures/page-5/sim.mjs :: T`), each
 * re-read through the fact's ONE HOME: a fact `factsOf` answers is read there (`facts.<fact>`); the crisis kinds are the
 * crisis home's (`crisisKind.js`, the alias order `stressors` → `stress` → `stresses`); a criminal power is the crime
 * signal's (`crimeSignal.js`); the governing power is `rulingPower.js :: governingFactionOf`'s; the docks are
 * `institutions.js :: hasInstitution(record, 'docks')`; every other house is `facts/causeHouses.js`'s, on the live roster
 * by catalogue identity (a DM's own house is never matched by its name). What has no home is read off the record as
 * sim.mjs read it: a past event of the timeline, the public legitimacy's band label (the entrepot mark has its home since
 * addendum 4, `facts/entrepot.js`).
 *
 * A predicate reads only the document it is handed: where a shared document has lost a hidden house or power, the cause
 * does not hold (one rule for every audience; `hideable` in the data file is a list, not a branch).
 *
 * Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/display/tensionCause.test.js
 */
import { crimeSignalOf } from '../crimeSignal.js';
import { governingFactionOf } from '../rulingPower.js';
import { hasInstitution } from '../facts/institutions.js';
import { causeHouseStands } from '../facts/causeHouses.js';

/** @typedef {ReturnType<typeof import('../facts/factsOf.js').factsOf>} Facts */
/**
 * The record slice the predicates read off the document themselves (every other fact is its home's reading).
 * @typedef {{
 *   institutions?: unknown,
 *   powerStructure?: { factions?: unknown, publicLegitimacy?: { label?: unknown } | null } | null,
 *   history?: { historicalEvents?: unknown } | null,
 * } | null | undefined} CauseRecord
 */
/** @typedef {(record: CauseRecord, facts: Facts) => boolean} CauseHolds */

/** The timeline holds an event of one of these template kinds (`history.historicalEvents[].templateType`, else `.type`). @param {CauseRecord} record @param {ReadonlyArray<string>} kinds */
const pastEventHolds = (record, kinds) => {
  const events = record?.history?.historicalEvents;
  return Array.isArray(events) && events.some((/** @type {{ templateType?: unknown, type?: unknown } | null | undefined} */ e) => kinds.includes(String(e?.templateType || e?.type || '')));
};

/** The crisis home holds this kind. @param {Facts} facts @param {string} kind */
const crisisHolds = (facts, kind) => facts.crisis.kinds.includes(kind);

/** War is upon the place: the war-state home reads at war or the front. @param {Facts} facts */
const warUpon = (facts) => facts.warState === 'at war' || facts.warState === 'front';

/** The governing power is a power of trade (category economy). @param {CauseRecord} record */
const governedByTrade = (record) => /** @type {{ category?: unknown } | null} */ (
  governingFactionOf(/** @type {import('../rulingPower.js').RulingPowerSettlement | null} */ (record)))?.category === 'economy';

/** @type {Readonly<Record<string, CauseHolds>>} */
export const TENSION_CAUSE_HOLDS = Object.freeze({
  // ── the powers ──
  criminalPowerSeated: (record) => {
    const seats = record?.powerStructure?.factions;
    return crimeSignalOf({ seats: Array.isArray(seats) ? seats : null }).seated;
  },
  governedByTrade: (record) => governedByTrade(record),
  rivalPower: (record, facts) => facts.rivalPower === true,
  seatOutranked: (record, facts) => facts.seatOutranked === true,
  rulerLord: (record, facts) => facts.rulerKind === 'lord',
  // ── the law and the force that keeps order ──
  lawCriticalOrCollapsed: (record, facts) => facts.lawBand === 'critical' || facts.lawBand === 'collapsed',
  rivalRings: (record, facts) => facts.rivalRings === true,
  noForceKept: (record, facts) => !facts.orderForce.kept,
  // CAUSES-PARITY B (PAGE-12, the brief CAUSES-PARITY-2): its SERVED arms alone. `orderForce.payCut` reads
  // `npcs[].settlementCondition`, which no shared read serves, and its served restatement is not exact (measure M: 14 of
  // 900), so the cut is no arm of this row; `orderForce.js` is left as it is.
  forceUnpaidOrCut: (record, facts) => {
    const force = facts.orderForce;
    return force.kept && (force.volunteers || force.pay === 'short' || force.pay === 'unpaid');
  },
  militiaNoGarrison: (record, facts) => facts.defence.militia && !facts.defence.garrison,
  // ── the houses (the live roster) ──
  thievesGuildHouse: (record) => causeHouseStands(record, 'thievesGuild'),
  smugglingByWater: (record, facts) => causeHouseStands(record, 'smuggling') && facts.water.navigable,
  undergroundHouse: (record) => causeHouseStands(record, 'underground'),
  assassinsHouse: (record) => causeHouseStands(record, 'assassins'),
  blackMarketHouse: (record) => causeHouseStands(record, 'blackMarket'),
  whisperMarketHouse: (record) => causeHouseStands(record, 'whisperMarket'),
  outlawsHouse: (record) => causeHouseStands(record, 'outlaws'),
  caravanHouse: (record) => causeHouseStands(record, 'caravans'),
  docksHouse: (record) => hasInstitution(record, 'docks'),
  fairHouse: (record) => causeHouseStands(record, 'fair'),
  exchangeHouse: (record) => causeHouseStands(record, 'exchange'),
  luxuryQuarterHouse: (record) => causeHouseStands(record, 'luxuryQuarter'),
  // ── the route, the water, the country ──
  routeCrossroads: (record, facts) => facts.route === 'crossroads',
  routeIsolated: (record, facts) => facts.route === 'isolated',
  waterCoast: (record, facts) => facts.water.coast,
  waterRiver: (record, facts) => facts.water.river,
  monsterFrontier: (record, facts) => facts.monsterFrontier === true,
  entrepot: (record, facts) => facts.entrepot === true,
  // ── the crises, the war, the food, the purse, the people's assent ──
  crisisPlague: (record, facts) => crisisHolds(facts, 'plague_onset'),
  crisisMonsterPressure: (record, facts) => crisisHolds(facts, 'monster_pressure'),
  crisisSuccessionVoid: (record, facts) => crisisHolds(facts, 'succession_void'),
  crisisIndebted: (record, facts) => crisisHolds(facts, 'indebted'),
  crisisInsurgency: (record, facts) => crisisHolds(facts, 'insurgency'),
  crisisReligiousConversion: (record, facts) => crisisHolds(facts, 'religious_conversion'),
  warUpon: (record, facts) => warUpon(facts),
  warUponOrWartime: (record, facts) => warUpon(facts) || crisisHolds(facts, 'wartime'),
  famine: (record, facts) => facts.famine?.famine === true,
  foodSourceSpentOrFailed: (record, facts) => !!facts.leadingSourceSpent || !!facts.failedSource,
  prosperityStrugglingOrPoor: (record, facts) => facts.prosperity === 'struggling' || facts.prosperity === 'poor',
  legitimacyCrisis: (record, facts) => facts.legitimacyCrisis === true,
  legitimacyContested: (record) => record?.powerStructure?.publicLegitimacy?.label === 'Contested',
  // ── the timeline: the trouble, or its engine, has come before ──
  pastGuildConflict: (record) => pastEventHolds(record, ['guild_conflict']),
  pastResourceScarcity: (record) => pastEventHolds(record, ['resource_scarcity']),
  pastExternalThreat: (record) => pastEventHolds(record, ['external_threat']),
  pastSuccessionCrisis: (record) => pastEventHolds(record, ['succession_crisis']),
  pastMarketCrashOrTradeCollapse: (record) => pastEventHolds(record, ['market_crash', 'trade_collapse']),
  pastOutsideDebt: (record) => pastEventHolds(record, ['outside_debt']),
  pastGreatFlood: (record) => pastEventHolds(record, ['great_flood']),
});
