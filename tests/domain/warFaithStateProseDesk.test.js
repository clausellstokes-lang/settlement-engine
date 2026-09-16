/**
 * warFaithStateProseDesk.test.js — DESK CAR 4: the WAR & FAITH desk.
 *
 * ⭐ EVERY FIXTURE HERE IS MINTED BY THE REAL PRODUCER, never hand-shaped. The faith
 * fixtures go `ensureReligionState` → `projectReligionStateOntoSettlement` →
 * `faithPanelModel`; the war fixtures go a raw `worldState` ledger →
 * `settlementWarStatus` / `settlementOccupation` / `occupierHoldings` /
 * `settlementMobilization` / `renderTreatiesForSettlement`. That is deliberate and it is
 * this estate's most expensive lesson: a fixture can be the only writer of the FIELD OR
 * THE SHAPE it grades, and a desk green on a hand-shaped bag while dark on every real
 * world is the bitten case. Here, if a producer renames a field or changes a shape, these
 * arms go dark WITH it instead of grading a shape nothing writes.
 *
 * WHAT IT PINS:
 *   THE MAP, TOTAL IN BOTH DIRECTIONS — every key the desk can emit exists in the corpus,
 *     and every corpus pool of the six mounted blocks is either REACHED or named in the
 *     declared-unreachable ledger. The ledger is asserted as the EXACT complement, so a
 *     pool that becomes reachable reds here instead of silently staying dark.
 *   NO DIMENSIONS — the whole leaf carries no STATE dimension mark, which is what licenses
 *     every warFaith mount row to declare none.
 *   THE TWO DEFECTS THIS CAR FOUND, both caught by a smoke render before any test existed:
 *     the occupier-holdings SLOT-ROLE INVERSION, and the standing surface speaking on a
 *     town with no martial beat.
 *   THE RAMP'S TWO ZEROES — `ticksToDeploy` is 0 for `mobilized` AND for `demobilizing`.
 *   THE PATRON-LESS TOWN — what the 44-settlement deity-free review corpus actually renders.
 *   THE AUDIENCE — the three `dm-only` pools are silent for a player and speak for a DM.
 *   THE PROMISE — same seed + same state ⇒ same sentence.
 *
 * @enforced-by itself
 */
import { describe, expect, test } from 'vitest';

import { DOSSIER_STATE_PROSE_WAR_FAITH as WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { poolDimensions } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { drawnMember } from '../helpers/drawnProse.js';
import {
  DOSSIER_MOUNTS, UNMOUNTED_BLOCKS, drawnAtMount, sentenceMountForBlock,
} from '../../src/domain/display/stateProse/dossierMounts.js';
import {
  SLOT_FILL_SHAPES, SLOT_FILL_TABLES, creedLegitimacyPoolKey, creedStandingPoolKey,
  devotionPoolKey, dormantNotePoolKey, leadingTerm, mandatePoolKey, mobilizationPoolKey,
  nicheContestPoolKey, occupationPaysPoolKey, occupierHoldingsPoolKey, patronFallPoolKey,
  patronRankPoolKey, pietyArcPoolKey, sinkPoolKey, standingsPoolKey, faithTeaserPoolKey,
  treatyDocumentPoolKey, treatyFrayingPoolKey, treatyTermPoolKey, warExhaustionPoolKey,
  warFaithStateProse, warStatusPoolKey,
} from '../../src/domain/display/stateProse/warFaithStateProse.js';

// THE REAL PRODUCERS — the whole point of this file's fixtures.
import { divineMandateStatus, ensureReligionState, projectReligionStateOntoSettlement } from '../../src/domain/worldPulse/religionState.js';
import { faithPanelModel } from '../../src/components/settlement/faithPanelModel.js';
import { settlementWarStatus, settlementWarExhaustion, warExhaustionBand } from '../../src/domain/display/warStatus.js';
import { settlementMobilization } from '../../src/domain/display/mobilizationStatus.js';
import { settlementOccupation, occupierHoldings } from '../../src/domain/display/occupationStatus.js';

const BLOCK = (id) => WAR_FAITH[id];
const POOLS = (id) => Object.keys(BLOCK(id).pools);
/** The six blocks DESK CAR 4 mounts. */
const MOUNTED = Object.freeze(['DS-WAR-1', 'DS-WAR-2', 'DS-WAR-3', 'DS-FTH-1', 'DS-FTH-2', 'DS-FTH-3']);

// ── THE FIXTURES, MINTED BY PRODUCERS ────────────────────────────────────────────────

const PATRON = { name: 'Vaelith', rankAxis: 'major', alignmentAxis: 'good', temperamentAxis: 'peacelike', domain: 'harvest' };
const CULT = { name: 'Orr', rankAxis: 'cult', alignmentAxis: 'evil', temperamentAxis: 'warlike', domain: 'ash' };

/**
 * A live faith town, built the way the pulse builds one: seed a religion state, project it
 * onto the settlement, then read it with the panel model the tab uses.
 * @param {object} [extraProfile] fields the pulse adds conditionally (piety, patronFall)
 */
function faithTown(extraProfile = {}) {
  let s = {
    id: 'thornwall', name: 'Thornwall', tier: 'town',
    config: { primaryDeitySnapshot: PATRON, cultDeitySnapshots: [CULT] },
  };
  const states = { thornwall: ensureReligionState(null, s, 'town') };
  s = projectReligionStateOntoSettlement(s, states, 'thornwall', null, null, null);
  if (Object.keys(extraProfile).length > 0) {
    s = { ...s, config: { ...s.config, faithProfile: { ...s.config.faithProfile, ...extraProfile } } };
  }
  return { settlement: s, model: faithPanelModel(s) };
}

/** The deity-free town the whole review corpus is made of. */
function patronLessTown() {
  const settlement = { id: 'greyford', name: 'Greyford', tier: 'village', config: {} };
  return { settlement, model: faithPanelModel(settlement) };
}

const NAME_FOR = (id) => /** @type {Record<string, string>} */ ({
  thornwall: 'Thornwall', eastmarch: 'Eastmarch', hollowmere: 'Hollowmere', lowfen: 'Lowfen',
})[String(id)] || String(id);

/**
 * The war readings for one settlement, taken from a raw ledger through the display readers
 * the war tab itself calls — including `occupierPosition`, which is taken for THIS TOWN'S
 * OCCUPIER and never for this town (see the inversion arm below).
 * @param {string} sid @param {any} worldState @param {boolean} warBeat
 */
function warReadings(sid, worldState, warBeat = true) {
  const status = settlementWarStatus({ settlementId: sid, worldState, regionalGraph: null });
  const record = worldState.occupations ? worldState.occupations[sid] : null;
  const occupierId = record && record.occupierId != null ? record.occupierId : null;
  const posture = worldState.warPosture ? worldState.warPosture[sid] : null;
  const lone = (ids) => (Array.isArray(ids) && ids.length === 1 ? NAME_FOR(ids[0]) : '');
  return {
    status,
    exhaustionBand: warExhaustionBand(settlementWarExhaustion({ settlementId: sid, worldState })),
    mobilization: settlementMobilization({ settlementId: sid, worldState }),
    postureState: posture ? String(posture.state || '') : '',
    occupation: settlementOccupation({ settlementId: sid, worldState, nameFor: NAME_FOR }),
    occupierPosition: occupierId != null
      ? occupierHoldings({ settlementId: occupierId, worldState, nameFor: NAME_FOR })
      : null,
    holdings: occupierHoldings({ settlementId: sid, worldState, nameFor: NAME_FOR }),
    treaties: [],
    counterpart: lone(status?.besiegedBy) || lone(status?.besiegingTargets),
    warBeat,
  };
}

/** Thornwall held by Eastmarch, which is overextended across three towns. */
const OCCUPIED_WORLD = Object.freeze({
  tick: 40,
  warExhaustion: { thornwall: 0.3 },
  occupations: {
    thornwall: { occupierId: 'eastmarch', state: 'extractive', resistance: 0.5 },
    hollowmere: { occupierId: 'eastmarch', state: 'contested', resistance: 0.7 },
    lowfen: { occupierId: 'eastmarch', state: 'unstable', resistance: 0.6 },
  },
});

const DM = { seed: 'thornwall', audience: 'dm' };
const PLAYER = { seed: 'thornwall', audience: 'player' };

/**
 * A settlement whose government HAS a divine mandate to prop, at one security reading.
 * `divineMandateStatus` is government-scoped — it answers null for a merchant council —
 * which is one of the two reasons the desk reads it instead of banding the number itself.
 * @param {number} patronSecurity @param {boolean} [contested]
 */
const mandateTown = (patronSecurity, contested = false) => ({
  powerStructure: { government: 'monarchy' },
  config: { faithProfile: { patronSecurity, contested } },
});
/** The reader's three outcomes, taken FROM THE READER at its own cuts (0.4 and 0.6). */
const MANDATE_OUTCOMES = Object.freeze([
  divineMandateStatus(mandateTown(0.2)),
  divineMandateStatus(mandateTown(0.5)),
  divineMandateStatus(mandateTown(0.9)),
]);

// ── GUARD THE GUARD ──────────────────────────────────────────────────────────────────

describe('the warFaith corpus join is populated, or every claim below is free', () => {
  test('nine blocks, 138 pools, 418 authored variants', () => {
    const ids = Object.keys(WAR_FAITH);
    expect(ids).toEqual([
      'DS-WAR-1', 'DS-WAR-2', 'DS-WAR-3', 'DS-WAR-4', 'DS-WAR-5',
      'DS-FTH-1', 'DS-FTH-2', 'DS-FTH-3', 'DS-FTH-4',
    ]);
    const pools = ids.flatMap((id) => Object.values(BLOCK(id).pools));
    expect(pools).toHaveLength(138);
    expect(pools.reduce((n, pool) => n + pool.length, 0)).toBe(418);
  });

  test('the producer-minted fixtures really carry the producer shapes', () => {
    // If these go empty the whole file grades nothing, which is the vacuity this arm buys.
    const { settlement, model } = faithTown();
    expect(settlement.config.faithProfile.deities.length).toBe(2);
    expect(model.hasEmbed).toBe(true);
    expect(model.live).toBe(true);
    expect(model.ranks.find((d) => d.isPatron).standing).toBe('ascendant');
    // The BAND is the panel's own object, not a word this test chose.
    expect(model.ranks.find((d) => d.isPatron).band.label).toBeTruthy();
    const war = warReadings('thornwall', OCCUPIED_WORLD);
    expect(war.occupation.occupierName).toBe('Eastmarch');
    expect(war.occupierPosition.holds.length).toBe(3);
  });
});

// ── THE DIMENSION MEASUREMENT THAT LICENSES THE MOUNT ROWS ───────────────────────────

describe('NO STATE DIMENSION anywhere in the leaf', () => {
  test('every one of the 138 pools is dimension-free, so no mount row owes a declaration', () => {
    const partitioned = [];
    for (const id of Object.keys(WAR_FAITH)) {
      for (const [key, pool] of Object.entries(BLOCK(id).pools)) {
        if (poolDimensions(pool).length > 0) partitioned.push(`${id} :: ${key}`);
      }
    }
    expect(partitioned).toEqual([]);
    // The only mark the leaf uses at all is the AUDIENCE mark, which is law 2 and not a
    // dimension. Stated as a measurement so a corpus that grows a dimension word reds here
    // AND at the walker's honesty arm rather than only at the second one.
    const marks = new Set(Object.keys(WAR_FAITH).flatMap((id) => Object.values(BLOCK(id).pools)
      .flat().flatMap((v) => v.marks || [])));
    expect([...marks]).toEqual(['dm-only']);
    for (const row of DOSSIER_MOUNTS.filter((r) => r.desk === 'warFaith')) {
      expect(row.dimensions, `${row.mount} declares a dimension the leaf does not carry`)
        .toBeUndefined();
    }
  });
});

// ── THE REGISTRY HALF ────────────────────────────────────────────────────────────────

describe('the mount rows this car lands', () => {
  test('seven rows over six blocks, across TWO tabs, with one glance', () => {
    const rows = DOSSIER_MOUNTS.filter((r) => r.desk === 'warFaith');
    expect(rows.map((r) => `${r.mount}:${r.rung}`)).toEqual([
      'war.standing:sentence', 'war.treaties:sentence', 'war.dormantNote:sentence',
      'faith.patronSeat:sentence', 'faith.teaser:sentence',
      'faith.creedStanding:sentence', 'faith.nicheRow:glance',
    ]);
    expect([...new Set(rows.map((r) => r.tab))].sort()).toEqual(['faith', 'war']);
    // C3 ACROSS THE PAGE-SET: every mounted block speaks at exactly ONE position, and
    // DS-FTH-3 — the only block with two rows — speaks at the creed position and glances
    // at the niche row. This is the law's first real test on this leaf.
    for (const id of MOUNTED) expect(sentenceMountForBlock(id), id).not.toBeNull();
    expect(sentenceMountForBlock('DS-FTH-3').mount).toBe('faith.creedStanding');
  });

  test('the three dark blocks stay dark, and the dark half SHRANK by six', () => {
    expect(UNMOUNTED_BLOCKS.filter((id) => id.startsWith('DS-WAR-') || id.startsWith('DS-FTH-')))
      .toEqual(['DS-WAR-4', 'DS-WAR-5', 'DS-FTH-4']);
    // The accounting identity for this leaf: 6 mounted + 3 dark = the 9 the corpus holds.
    expect(new Set(DOSSIER_MOUNTS.filter((r) => r.desk === 'warFaith').map((r) => r.blockId)).size
      + 3).toBe(9);
  });
});

// ── THE MAP, TOTAL IN BOTH DIRECTIONS ────────────────────────────────────────────────

/**
 * Every pool key the desk can emit, derived by driving each key function over its whole
 * input vocabulary rather than by listing what the author remembers writing.
 * @returns {Map<string, Set<string>>} blockId → keys
 */
function reachableKeys() {
  const out = new Map(MOUNTED.map((id) => [id, new Set()]));
  const add = (id, key) => { if (key) out.get(id).add(key); };

  // DS-WAR-1
  add('DS-WAR-1', warStatusPoolKey({ besiegingTargets: ['x'], besiegedBy: [] }, null, true));
  add('DS-WAR-1', warStatusPoolKey(null, { pays: true }, true));
  add('DS-WAR-1', warStatusPoolKey(null, null, true));
  for (const band of ['rested', 'near peace', 'war-weary', 'exhausted']) {
    add('DS-WAR-1', warExhaustionPoolKey(band));
  }
  for (const state of ['peace', 'alert', 'war_preparation', 'mobilized', 'deployed', 'war_exhaustion', 'demobilizing']) {
    for (const ticks of [0, 1, 2, 3, 5]) {
      add('DS-WAR-1', mobilizationPoolKey(state, ticks, false));
      add('DS-WAR-1', mobilizationPoolKey(state, ticks, true));
    }
  }
  for (const pays of [true, false]) add('DS-WAR-1', occupationPaysPoolKey({ pays }));
  add('DS-WAR-1', occupierHoldingsPoolKey({ stretchedThin: true }));
  add('DS-WAR-1', occupierHoldingsPoolKey({ strengthened: true }));

  // DS-WAR-2 — every ENGINE family, not just the seven the corpus names.
  for (const family of ['economic', 'relational', 'security', 'territorial', 'political',
    'informational', 'sovereignty', 'sovereignty_transfer', 'faith', 'population',
    'commercial', 'amnesty', 'jubilee', 'a_family_nobody_has_written_yet']) {
    for (const state of ['honored', 'strained', 'defaulted', 'a_word_from_a_newer_build']) {
      add('DS-WAR-2', treatyTermPoolKey(family, state));
    }
  }
  add('DS-WAR-2', treatyFrayingPoolKey({ fraying: true, yearsRemaining: 4 }));
  add('DS-WAR-2', treatyDocumentPoolKey({ termLines: [{ yearsRemaining: 1 }] }, 'x'));
  add('DS-WAR-2', treatyDocumentPoolKey({ victorId: 'x', termLines: [{ yearsRemaining: 9 }] }, 'x'));
  add('DS-WAR-2', treatyDocumentPoolKey({ loserId: 'x', termLines: [{ yearsRemaining: 9 }] }, 'x'));

  // DS-WAR-3
  add('DS-WAR-3', dormantNotePoolKey(false, false, true));

  // DS-FTH-1
  for (const rank of ['major', 'minor', 'cult']) add('DS-FTH-1', patronRankPoolKey(rank));
  out.get('DS-FTH-1').add('CULTS: cults[] present beneath the patron');
  for (const band of ['devout', 'faithful', 'observant', 'lukewarm', 'secular']) {
    add('DS-FTH-1', devotionPoolKey(band));
  }
  for (const trend of ['rising', 'falling', 'steady']) add('DS-FTH-1', pietyArcPoolKey(trend));
  add('DS-FTH-1', standingsPoolKey({ ranks: [{ isPatron: true }], contested: false }));
  add('DS-FTH-1', standingsPoolKey({ ranks: [{ isPatron: true }], contested: true }));
  add('DS-FTH-1', standingsPoolKey({ ranks: [{ isPatron: false }] }));
  add('DS-FTH-1', sinkPoolKey({ unaffiliated: 10, piety: { trend: 'falling' } }));
  add('DS-FTH-1', sinkPoolKey({ unaffiliated: 10, piety: { trend: 'rising' } }));
  // The mandate lens is driven through the REAL reader over its three outcomes, never over
  // a threshold this test chose — see the totality arm below.
  for (const mandate of MANDATE_OUTCOMES) add('DS-FTH-1', mandatePoolKey({ mandate }));
  out.get('DS-FTH-1').add('live: false');

  // DS-FTH-2
  add('DS-FTH-2', faithTeaserPoolKey(false));

  // DS-FTH-3
  for (const standing of ['cult', 'established', 'ascendant']) add('DS-FTH-3', creedStandingPoolKey(standing));
  for (const band of ['secure', 'established', 'tenuous', 'contested']) add('DS-FTH-3', creedLegitimacyPoolKey(band));
  for (const cause of ['displaced', 'discredited', 'imposed', 'suppressed']) add('DS-FTH-3', patronFallPoolKey(cause));
  add('DS-FTH-3', nicheContestPoolKey([{ niche: 'a', isPatron: true }, { niche: 'a' }]));
  add('DS-FTH-3', nicheContestPoolKey([{ niche: 'a', isPatron: true }, { niche: 'b' }]));
  return out;
}

/**
 * THE UNREACHABLE LEDGER — every pool of a MOUNTED block the desk cannot key today, with
 * the reason. This is the "mounted-but-unreachable pool is a FINDING" half of the mount
 * docblock, written down where a gate can see it. It is asserted as the EXACT complement
 * of what the desk reaches, so a pool that becomes reachable reds HERE and someone reads
 * the reason instead of rediscovering it.
 */
const DECLARED_UNREACHABLE = Object.freeze({
  'DS-WAR-1': Object.freeze([
    // Six feasibility pools: `feasibilityOutlook` needs attacker/defender CAPACITY scores
    // (0..100), which are a DM siege-preview input and are computed nowhere on the war tab.
    'feasibility plausible', 'feasibility auto_fail', 'feasibility harassment',
    'feasibility require_coalition', 'feasibility require_betrayal', 'feasibility require_magic',
    // ⚠ `mobilization: COVERT` is NOT listed, and the distinction cost this arm one red.
    // The DESK reaches it — the audience test below proves it draws a sentence for a DM —
    // so declaring it unreachable would have been false at this layer. What is unreachable
    // is the WIRING: WarTab calls `settlementMobilization` with `includeCovert` defaulted
    // FALSE, so the reading is null before the pool is ever considered. That is a
    // TAB-SIDE finding about one call's argument, not a corpus-side one about a pool with
    // no producer, and the two must not be filed in the same ledger. The one act that
    // lights it is passing `includeCovert: includeGroundTruth` at that call — a DM-truth
    // disclosure decision the tab already makes for its belief band, raised for the chair
    // rather than taken inside a desk car.
  ]),
  'DS-WAR-2': Object.freeze([]),
  'DS-WAR-3': Object.freeze([]),
  'DS-FTH-1': Object.freeze([]),
  'DS-FTH-2': Object.freeze([
    // ⛔ AUTHORED FOR THE ONE READER THE PAID-SURFACE LINE FORBIDS. §885.3 rules dossier
    // corpus prose a paid surface and O2GATE nulls every rung on a public dossier, so the
    // desk is never CALLED for the viewer this pool was written for. Owner-gated to light.
    'PUBLIC / SHARED DOSSIER',
  ]),
  'DS-FTH-3': Object.freeze([
    // capacityForTier is not projected onto the settlement, and neither is the tier it is
    // measured against.
    'NICHE: slots saturated at tier capacity', 'NICHE: slots open',
    // The same fact DS-FTH-1's PATRON lens speaks on the same tab — one story, one sentence.
    'PANTHEON RANK: Cult', 'PANTHEON RANK: Minor', 'PANTHEON RANK: Major',
    // ⛔ `templeWealth` HAS NO WRITER IN THE ENGINE (WF-7 design-doc future; the estate's
    // own DESIGN_FP_ARCH_WF.md V27 row records grep templeWealth in src/domain: 0).
    'TEMPLE WEALTH: rich', 'TEMPLE WEALTH: modest', 'TEMPLE WEALTH: drawn down',
    // `deities[ref].covert` lives on the religion state and is not among the seven fields
    // projectReligionStateOntoSettlement puts on config.faithProfile.deities[].
    'COVERT CONGREGATION: deities[ref].covert present',
    // No pilgrimage reading exists on either host tab.
    'PILGRIM SEASON: heavy', 'PILGRIM SEASON: thin', 'PILGRIM SEASON: suppressed by road danger',
  ]),
});

describe('THE MAP, total in both directions', () => {
  test('FORWARD: every key the desk can emit is a pool the corpus actually holds', () => {
    const invented = [];
    for (const [id, keys] of reachableKeys()) {
      for (const key of keys) if (!BLOCK(id).pools[key]) invented.push(`${id} :: ${key}`);
    }
    expect(invented, 'the desk keys a pool the corpus does not have').toEqual([]);
  });

  test('BACKWARD: every pool of a mounted block is REACHED or DECLARED, and never both', () => {
    const reached = reachableKeys();
    for (const id of MOUNTED) {
      const declared = new Set(DECLARED_UNREACHABLE[id]);
      const hit = reached.get(id);
      const both = [...hit].filter((k) => declared.has(k));
      expect(both, `${id}: a pool is both reached and declared unreachable`).toEqual([]);
      const orphans = POOLS(id).filter((k) => !hit.has(k) && !declared.has(k));
      expect(
        orphans,
        `${id}: pool(s) neither reached by the desk nor named in DECLARED_UNREACHABLE. A`
        + ' mounted-but-unreachable pool is a FINDING and must be written down with the one'
        + ' act that lights it — there is no third state.',
      ).toEqual([]);
      // And the ledger may not name a pool that no longer exists, or one that has since
      // become reachable: the complement is asserted exactly, in both directions.
      const stale = [...declared].filter((k) => !BLOCK(id).pools[k]);
      expect(stale, `${id}: the unreachable ledger names a pool the corpus dropped`).toEqual([]);
    }
  });

  test('the reach is a real number, not an empty walk', () => {
    const reached = reachableKeys();
    const total = MOUNTED.reduce((n, id) => n + reached.get(id).size, 0);
    const declared = MOUNTED.reduce((n, id) => n + DECLARED_UNREACHABLE[id].length, 0);
    // 98 pools across the six mounted blocks: 79 REACHED, 19 DECLARED dark with a reason.
    // ⚠ BOTH FIGURES ARE THE MEASUREMENT, NOT THE AUTHOR'S ARITHMETIC. They were written
    // by hand first (76 / 22), and both were wrong — the identity above still held because
    // one pool was counted on BOTH sides. Count both sides; never take a total on trust.
    expect(total + declared).toBe(MOUNTED.reduce((n, id) => n + POOLS(id).length, 0));
    expect(MOUNTED.reduce((n, id) => n + POOLS(id).length, 0)).toBe(98);
    expect(declared).toBe(19);
    expect(total).toBe(79);
  });
});

// ── THE TWO DEFECTS THIS CAR FOUND ───────────────────────────────────────────────────

describe('⛔ the occupier-holdings SLOT-ROLE INVERSION', () => {
  test('the pool speaks from the OCCUPIED town\'s chair: {counterpart} holds, {settlement} is held', () => {
    const war = warReadings('thornwall', OCCUPIED_WORLD);
    // ⚠ A LOCAL SEED, AND IT MOVED AT REWRITE car 8a-1. The direction is demonstrated by
    // NAMES — Eastmarch as the holder, Thornwall as a place held — so this arm needs a
    // variant of `occupierHoldings.stretchedThin` that fills BOTH slots. The index-stable
    // draw (kernel law 6) re-drew every pool once and the file's shared `thornwall` seed now
    // lands on the counterforce variant, which names the settlement alone and could not carry
    // the assertion. The seed is overridden HERE rather than on the shared `DM` constant, so
    // this arm's need does not silently re-draw every other arm in the file.
    const seed = 'thornwall-b';
    const desk = warFaithStateProse({ id: 'thornwall', name: 'Thornwall', config: {} },
      { settlementId: 'thornwall', war }, { ...DM, seed });
    const line = desk.warHoldings.sentence;
    // Eastmarch holds three towns, two of them resisted ⇒ stretchedThin.
    expect(war.occupierPosition.stretchedThin).toBe(true);
    expect(line).toContain('Eastmarch');
    expect(line).toContain('Thornwall');
    // THE DIRECTION IS THE WHOLE POINT: the holder is named as the one whose grip is thin,
    // and the town is named as a PLACE it holds. The corpus's own sentence says so — and it
    // says so through the SHIPPED READ PATH rather than through a transcription of it
    // (car 8a-13), so the next re-index or rewrite moves the desk's line and this anchor
    // together instead of reddening an arm about a direction that has not changed.
    expect(line).toBe(drawnMember({
      leaf: 'warFaith', blockId: 'DS-WAR-1', poolKey: 'occupierHoldings.stretchedThin',
      seed, slots: { settlement: 'Thornwall', counterpart: 'Eastmarch' },
    }));
    // …and the NAMES are what the toContain pair above proves are in it, so the equality is a
    // direction claim and not merely "the desk agrees with itself".
  });

  test('feeding it THIS TOWN\'S OWN holdings would name the wrong side — the reading is not used', () => {
    // Thornwall AS OCCUPIER of Eastmarch: the reader whose NAME matches the pool.
    const asHolder = occupierHoldings({
      settlementId: 'thornwall',
      worldState: { occupations: { eastmarch: { occupierId: 'thornwall', state: 'stabilized', resistance: 0 } } },
      nameFor: NAME_FOR,
    });
    expect(asHolder.strengthened).toBe(true);
    // The desk is handed `occupierPosition`, NOT `holdings`, so a war reading that carries
    // only the holder-side reading draws NOTHING here. Before the cure this printed
    // "the garrison at Thornwall is stronger for the occupier's other successes" about the
    // town that OWNS the garrison — fluent, confident and false.
    const desk = warFaithStateProse({ id: 'thornwall', name: 'Thornwall', config: {} },
      { settlementId: 'thornwall', war: { holdings: asHolder, warBeat: true, treaties: [] } }, DM);
    expect(desk.warHoldings).toBeNull();
  });
});

describe('⛔ R-DST-K on the standing surface', () => {
  test('a quiet town draws the DORMANT NOTE and no martial sentence at all', () => {
    const desk = warFaithStateProse({ id: 'greyford', name: 'Greyford', config: {} }, {
      settlementId: 'greyford',
      hasPatron: false,
      war: { status: null, exhaustionBand: warExhaustionBand(0), treaties: [], warBeat: false },
    }, PLAYER);
    // Before the gate, `warExhaustion: rested` drew on every peaceful campaign settlement —
    // a true sentence about a surface that is not rendering, printed an inch above the
    // dormant note that says the same quiet. MEASURED by a smoke render.
    expect(desk.warStatus).toBeNull();
    expect(desk.warExhaustion).toBeNull();
    expect(desk.warMobilization).toBeNull();
    expect(desk.dormantNote.sentence).toBeTruthy();
  });

  test('`rested` IS reachable — on a town at war that has spent nothing', () => {
    // DORMANT IS A TRUE STATEMENT, NOT A FALLBACK: a zero in the war-exhaustion ledger is a
    // real reading, and a besieged town with no accumulated scar is a coherent thing to say.
    const desk = warFaithStateProse({ id: 'thornwall', name: 'Thornwall', config: {} }, {
      settlementId: 'thornwall',
      war: { status: { besiegingTargets: ['eastmarch'], besiegedBy: [] }, counterpart: 'Eastmarch',
        exhaustionBand: warExhaustionBand(0), treaties: [], warBeat: true },
    }, DM);
    expect(desk.warExhaustion.provenance.poolKey).toBe('warExhaustion: rested');
  });
});

describe('⛔ the ramp has TWO zeroes, and only one of them is ready', () => {
  test('`mobilized` is fully ready; `demobilizing` and `war_exhaustion` draw NOTHING', () => {
    // `ticksToDeploy` returns 0 for `mobilized` (nothing left to climb) AND for every
    // non-ramp state (`RAMP_ORDER.indexOf(state) < 0`). Keying on the tick count would
    // print the muster complete over a town standing down.
    expect(mobilizationPoolKey('mobilized', 0)).toBe('mobilization: fully ready');
    expect(mobilizationPoolKey('deployed', 0)).toBe('mobilization: fully ready');
    expect(mobilizationPoolKey('demobilizing', 0)).toBeNull();
    expect(mobilizationPoolKey('war_exhaustion', 0)).toBeNull();
    expect(mobilizationPoolKey('peace', 0)).toBeNull();
    // The climb splits at two rungs remaining.
    expect(mobilizationPoolKey('alert', 3)).toBe('mobilization: climbing the ramp, still distant');
    expect(mobilizationPoolKey('war_preparation', 1)).toBe('mobilization: climbing, close to ready');
    // Covert outranks the ramp, and the pool it reaches is `dm-only` by the corpus.
    expect(mobilizationPoolKey('mobilized', 0, true)).toBe('mobilization: COVERT');
  });

  test('a siege has NO pool, and is silence rather than the nearest neighbour', () => {
    // WarTab's ladder names four states; this block authored three. Routing a besieged town
    // into `On campaign` would say the army is abroad about a town with an enemy at its
    // walls — the opposite fact.
    expect(warStatusPoolKey({ besiegedBy: ['eastmarch'], besiegingTargets: [] }, null, true)).toBeNull();
    expect(POOLS('DS-WAR-1').filter((k) => k.startsWith('statusLabel')))
      .toEqual(['statusLabel: On campaign', 'statusLabel: Occupied',
        'statusLabel: At war (no front at the walls, no army abroad)']);
  });
});

// ── THE TREATY MAP ───────────────────────────────────────────────────────────────────

describe('DS-WAR-2 — the family map is total, and its floor is the producer\'s own', () => {
  test('the SIX engine families the corpus did not author fall to the generic floor', () => {
    for (const family of ['sovereignty_transfer', 'faith', 'population', 'commercial', 'amnesty', 'jubilee']) {
      expect(treatyTermPoolKey(family, 'strained')).toBe('generic floor · strained');
    }
    // The seven it did author keep their own voice.
    expect(treatyTermPoolKey('territorial', 'defaulted')).toBe('territorial · defaulted');
    // An unrecognised compliance word reads as `honored`, exactly as normalizeState does.
    expect(treatyTermPoolKey('economic', 'a word from a newer build')).toBe('economic · honored');
  });

  test('the leading term is the most strained, then the earliest to lapse', () => {
    const term = leadingTerm([
      { family: 'economic', complianceState: 'honored', yearsRemaining: 1 },
      { family: 'security', complianceState: 'defaulted', yearsRemaining: 9 },
      { family: 'political', complianceState: 'strained', yearsRemaining: 2 },
    ]);
    expect(term.family).toBe('security');
    expect(leadingTerm([])).toBeNull();
  });

  test('the expiry outranks the side the town took', () => {
    expect(treatyDocumentPoolKey({ victorId: 'x', termLines: [{ yearsRemaining: 1 }] }, 'x'))
      .toBe('document-level: the treaty runs out within the year');
    expect(treatyDocumentPoolKey({ victorId: 'x', termLines: [{ yearsRemaining: 12 }] }, 'x'))
      .toBe('document-level: the town is the VICTOR side');
    // A fraying clause with no time left is a clause ENDING, not a promise breaking early.
    expect(treatyFrayingPoolKey({ fraying: true, yearsRemaining: 0 })).toBeNull();
  });
});

// ── THE FAITH HALF, ON PRODUCER-MINTED STATE ─────────────────────────────────────────

describe('the faith desk over a settlement the pulse actually built', () => {
  test('the live panel and the creed standing both speak, from the projected profile', () => {
    const { settlement, model } = faithTown();
    const desk = warFaithStateProse(settlement, { faith: model, hasPatron: true }, DM);
    expect(desk.patronRank.provenance.poolKey).toBe('PATRON: rankAxis: major');
    expect(desk.patronCults.provenance.poolKey).toBe('CULTS: cults[] present beneath the patron');
    expect(desk.standings.provenance.poolKey).toBe('STANDINGS: the patron dominant');
    expect(desk.creedStanding.provenance.poolKey).toBe('STANDING: ascendant');
    // The legitimacy band is the PANEL'S OWN object, so the desk and the patron-seat block
    // can never disagree about the same number.
    expect(desk.creedLegitimacy.provenance.poolKey)
      .toBe(`LEGITIMACY: ${model.ranks.find((d) => d.isPatron).band.label}`);
    // The creed name reached the slot: the sentence names the deity the pulse seated.
    //
    // ⚠ ON ITS OWN SEED, AND THAT SEED MOVED AT REWRITE car 8a-1. Only ONE of the three
    // variants of `STANDING: ascendant` fills `{creed}`; the other two say "the creed" and
    // "this faith" in their own words, which is the pool degrading exactly as the annex
    // intends. The index-stable draw (kernel law 6) re-drew every pool once and the file's
    // shared `thornwall` seed now lands on a slot-free variant, so the slot question is asked
    // on a seed that reaches the naming variant. The desk above keeps its own seed because
    // every other assertion in this arm reads a POOL KEY, which no seed can move.
    const named = warFaithStateProse(settlement, { faith: model, hasPatron: true },
      { ...DM, seed: 'thornwall-b' });
    expect(named.creedStanding.provenance.poolKey, 'the same pool, a different draw')
      .toBe('STANDING: ascendant');
    expect(named.creedStanding.sentence).toContain('Vaelith');
  });

  test('the patron fall is keyed on the FLAGGED record\'s own cause token', () => {
    const { settlement, model } = faithTown({ patronFall: { ref: 'Vaelith', cause: 'displaced', atTick: 12 } });
    // The CAUSE is read in the projection layer and handed over, exactly as FaithTab does.
    const cause = settlement.config.faithProfile.patronFall.cause;
    const desk = warFaithStateProse(settlement, { faith: model, hasPatron: true, patronFallCause: cause }, DM);
    expect(desk.creedFall.provenance.poolKey).toBe('FALL: displaced');
    // A dark world writes no patronFall key at all ⇒ nothing is handed over ⇒ no sentence.
    expect(faithTown().settlement.config.faithProfile.patronFall).toBeUndefined();
    expect(warFaithStateProse(settlement, { faith: model, hasPatron: true }, DM).creedFall).toBeNull();
  });

  test('⛔ the MANDATE lens reads the canonical reader, and the map is TOTAL both ways', () => {
    // THE DEFECT THIS ARM EXISTS FOR: the lens was first written as a hand cut on
    // `patronSecurity` at 0.5 / 0.75, and `divineMandateStatus` cuts the SAME number at
    // 0.4 / 0.6. A town between the two cuts would have had one surface say its church
    // props the throne and another say it does not, with nothing anywhere to notice.
    // Caught by a size ratchet counting bare decimals, not by anything that understood it.
    expect(MANDATE_OUTCOMES.every(Boolean), 'the reader stopped answering').toBe(true);
    // FORWARD: every outcome the reader can produce maps to a pool.
    const keys = MANDATE_OUTCOMES.map((mandate) => mandatePoolKey({ mandate }));
    expect(keys).toEqual([
      'MANDATE: contested, or patron security below the floor',
      'MANDATE: a measure of divine mandate',
      'MANDATE: a dominant church',
    ]);
    // BACKWARD: the three pools DS-FTH-1 authored are exactly the three the reader reaches.
    expect([...keys].sort()).toEqual(POOLS('DS-FTH-1').filter((k) => k.startsWith('MANDATE:')).sort());
    // The contested FLAG reaches the same pool as a low security, which is the reader's own
    // disjunction and the pool's own name.
    expect(mandatePoolKey({ mandate: divineMandateStatus(mandateTown(0.9, true)) })).toBe(keys[0]);
    // GOVERNMENT-SCOPED: a council has no divine mandate, so there is no sentence to draw.
    // A desk banding `patronSecurity` itself would have printed one over this town.
    expect(divineMandateStatus({ powerStructure: { government: 'merchant council' }, config: { faithProfile: { patronSecurity: 0.9 } } })).toBeNull();
    expect(mandatePoolKey({ mandate: null })).toBeNull();
  });

  test('the niche contest is read off the projected niches, never re-derived', () => {
    const { model } = faithTown();
    // The seeded pantheon gives the patron and the cult DIFFERENT niches.
    expect(new Set(model.ranks.map((d) => d.niche)).size).toBe(2);
    expect(nicheContestPoolKey(model.ranks)).toBe('NICHE: every niche uncontested');
    const crowded = model.ranks.map((d) => ({ ...d, niche: 'peacelike:good' }));
    expect(nicheContestPoolKey(crowded)).toBe("NICHE: the patron's niche carries a contestant");
  });
});

describe('⭐ THE PATRON-LESS TOWN — what the deity-free review corpus renders', () => {
  test('DS-FTH-2 speaks, and it names no creed and no god', () => {
    const { settlement, model } = patronLessTown();
    // The producer's own answer for a town with no embed.
    expect(model).toEqual({ hasEmbed: false });
    const desk = warFaithStateProse(settlement, { faith: model, hasPatron: !!model.hasEmbed },
      { seed: 'greyford', audience: 'player' });
    expect(desk.faithTeaser.provenance.poolKey).toBe('PRIVATE DOSSIER');
    const line = desk.faithTeaser.sentence;
    expect(line).toBeTruthy();
    expect(line.length).toBeGreaterThan(40);
    // ⛔ THE DEITY DOCTRINE: no pool of this block may name a creed, and there is none to
    // name. Every one of the four authored variants is asserted, not just the drawn one,
    // so a future corpus edit that slips a deity name in reds here.
    for (const variant of BLOCK('DS-FTH-2').pools['PRIVATE DOSSIER']) {
      // anchored: the same four variants are asserted non-empty on the line below, so an emptied pool cannot pass this absence
      expect(variant.text).not.toMatch(/Vaelith|Orr|\{creed\}|\{rival_creed\}/);
      expect(variant.text.length).toBeGreaterThan(40);
    }
    // And every OTHER faith position is silent: there is no seat, no standing, no arc.
    expect(desk.patronRank).toBeNull();
    expect(desk.creedStanding).toBeNull();
    expect(desk.standings).toBeNull();
    expect(desk.nicheRow).toBeNull();
  });

  test('a town WITH a patron draws no teaser — the page cannot say both', () => {
    const { settlement, model } = faithTown();
    expect(warFaithStateProse(settlement, { faith: model, hasPatron: true }, DM).faithTeaser).toBeNull();
    expect(faithTeaserPoolKey(true)).toBeNull();
  });
});

// ── THE AUDIENCE, THE REGISTRY READ, AND THE PROMISE ─────────────────────────────────

describe('the audience, the rung depth, and the promise', () => {
  test('the three dm-only pools are silent for a player and speak for a DM', () => {
    const covert = { status: null, exhaustionBand: '', postureState: 'mobilized', treaties: [],
      mobilization: { ticksToDeploy: 0, covert: true }, warBeat: true };
    const town = { id: 'thornwall', name: 'Thornwall', config: {} };
    expect(warFaithStateProse(town, { war: covert }, PLAYER).warMobilization).toBeNull();
    expect(warFaithStateProse(town, { war: covert }, DM).warMobilization.sentence).toBeTruthy();
  });

  test('the GLANCE row keeps its band word and loses the sentence AND the provenance', () => {
    const { settlement, model } = faithTown();
    const desk = warFaithStateProse(settlement, { faith: model, hasPatron: true }, DM);
    // The desk builds the full rung; the REGISTRY decides the depth.
    expect(desk.nicheRow.glance).toBe('ascendant');
    expect(desk.nicheRow.sentence).toBeTruthy();
    const glanced = drawnAtMount('faith.nicheRow', desk.nicheRow);
    expect(glanced.glance).toBe('ascendant');
    expect(glanced.sentence).toBeNull();
    expect(glanced.provenance).toBeNull();
    // The SENTENCE row a few inches up hands the rung back whole — so DS-FTH-3 speaks once.
    expect(drawnAtMount('faith.creedStanding', desk.creedStanding)).toBe(desk.creedStanding);
  });

  test('THE PROMISE: same seed + same state ⇒ same sentence, and a different seed may differ', () => {
    const { settlement, model } = faithTown();
    const once = warFaithStateProse(settlement, { faith: model, hasPatron: true }, DM);
    const twice = warFaithStateProse(settlement, { faith: model, hasPatron: true }, DM);
    expect(twice.creedStanding.sentence).toBe(once.creedStanding.sentence);
    // Seedless is canonical-at-zero (kernel law 4), so a walker reads a stable sentence.
    const seedless = warFaithStateProse(settlement, { faith: model, hasPatron: true }, { audience: 'dm' });
    expect(seedless.creedStanding.sentence)
      .toBe(BLOCK('DS-FTH-3').pools['STANDING: ascendant'][0].text.replace(/\{creed\}/g, 'Vaelith')
        .replace(/\{settlement\}/g, 'Thornwall'));
  });

  test('the desk declares its slot shapes and owns no fill table', () => {
    expect(Object.keys(SLOT_FILL_SHAPES).sort())
      .toEqual(['counterpart', 'creed', 'rival_creed', 'settlement', 'term']);
    for (const shape of Object.values(SLOT_FILL_SHAPES)) expect(shape).toBe('proper');
    // Every fill this desk supplies is a NAME a producer already carries, never a word the
    // desk chose — so there is no literal table to hold to a shape.
    expect(SLOT_FILL_TABLES).toEqual({});
  });

  test('an id is never allowed to reach a slot as a name', () => {
    // `{counterpart}` is filled from a name the TAB resolved. A raw save id is snake_case,
    // which `properFill` refuses — so the variant drops rather than printing an engine
    // token at a reader. This is the failure mode that would have been invisible.
    const desk = warFaithStateProse({ id: 'thornwall', name: 'Thornwall', config: {} }, {
      war: { status: { besiegedBy: [], besiegingTargets: ['east_march'] },
        counterpart: 'east_march', exhaustionBand: '', treaties: [], warBeat: true },
    }, DM);
    // anchored: the same pool is asserted to DRAW a sentence on the line below, so this is the fill being refused rather than the pool being empty
    expect(desk.warStatus.sentence).not.toContain('east_march');
    expect(desk.warStatus.provenance.poolKey).toBe('statusLabel: On campaign');
  });
});
