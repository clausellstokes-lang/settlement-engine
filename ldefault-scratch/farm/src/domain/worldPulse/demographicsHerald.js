/**
 * demographicsHerald.js — WAVE P4 (THE WORLD'S HAND), THE IN-WORLD LINES.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §8 ("Herald: demographic lines per the address law")
 * and the standing NEWS ADDRESS LAW and LEGIBILITY LAW are this file's contract.
 *
 * The design writes the target sentence itself: "Grain ran short in Ashford; three
 * hundred took the north road." Everything below exists to make that sentence, and
 * only that kind of sentence, reach a reader.
 *
 * THE NEWS ADDRESS LAW, satisfied field by field. Every entry carries the FULL address
 * chain (`settlementIds` plus `settlementNames`, so a reader and a router both have
 * what they need), a TYPED cause (`impactKind` plus `causeClass`), the affected
 * settlements BY NAME in the prose itself, and a RECORDED reason (`reasons`, naming
 * what the engine actually read rather than restating the headline).
 *
 * THE LEGIBILITY LAW, satisfied by construction. No ratio, no percentage, no band
 * token, no id and no digit reaches the prose. Counts are spoken through ONE closed
 * authored quantity vocabulary (`QUANTITY_BANDS`), which is the finite-semantics law
 * applied to the one place a number would otherwise leak onto a surface: the engine
 * knows three hundred and seven people left, and the Herald says several hundred did.
 *
 * WAVE P4 MINTED NO NEW VOCABULARY, AND THAT WAS A DELIBERATE REFUSAL. A new
 * `impactKind` literal reds three registration walkers at once and its registrations
 * live in files that slice could not touch: WHAT_PHRASES (settlementRumors.js),
 * EXPECTED_VOICE (the impactKind walker) and the Herald routing table. So the first two
 * lines ride the two EXISTING kinds that already mean exactly what they mean:
 * `hungry_gap` (the lean season) and `migration_flight` (families taking to the road).
 * The demographic lane is distinguished where the certification row's own precedent puts
 * lane ownership: on the RECORD, in `tags` and in the `sourceEventId`, exactly as the
 * shared migration ledger is distinguished by its per-column travelClass.
 *
 * ⭐⭐ SUPERSEDED IN SCOPE BY CAPACITY C1 (2026-09-03), AND THE PARAGRAPH ABOVE IS KEPT
 * RATHER THAN REWRITTEN, BECAUSE IT RECORDS A REFUSAL A LATER READER WOULD OTHERWISE
 * READ AS STILL BINDING. THE THIRD LINE MINTS `population_crowding`, AND IT PAYS THE
 * COST THE PARAGRAPH ABOVE DECLINED TO PAY: all three registrations land in the SAME
 * commit as the mint. The refusal was never "never mint"; it was "never mint without
 * paying", and P4 could not pay because those three files were outside its slice.
 *
 * WHY A NEW KIND RATHER THAN RIDING `urban_fabric`, which already exists and is about
 * towns being crowded: a typed cause must mean what it says. `urban_fabric` has one
 * producer whose routing and voice were decided for ITS nature, and no existing kind
 * means "this settlement's growth is bounded by what the place itself can hold".
 * Vetoable; the veto rides `urban_fabric` and pays no registration.
 *
 * ALREADY NARRATED ELSEWHERE, recorded so nobody double-writes it: the M4 rumor lane
 * (src/domain/spatial/migrationRumors.js, behind `migrationRumorsEnabled`) reads the
 * SAME `spatialLedgers.migration` columns the homeostat rides and already emits a
 * `migration_flight` RUMOR for each. That is the rumor net, not the Herald feed, and
 * the two are different surfaces; but a reader who sees both is seeing one exodus told
 * twice, which is honest rather than duplicated.
 *
 * BOUNDED BY BANDS, NEVER PER TICK PER SETTLEMENT. The demographic step runs for every
 * settlement every tick, so an unbanded Herald would be a wall. A line is emitted only
 * when the reading crosses an authored floor, at most one of each kind per settlement
 * per tick, which is what keeps the Herald a newspaper rather than a census.
 *
 * Pure leaf: no store, no React, no clock, no randomness, no I/O, no writes.
 *
 * @enforced-by tests/domain/demographicsWorldsHand.test.js
 */

/** @typedef {import('./demographicsKernel.js').DemographicReceipt} DemographicReceipt */

import { overflowBandOf, overflowRankOf } from './demographicsResponses.js';

/**
 * THE CLOSED QUANTITY VOCABULARY. The one place a head count would otherwise reach a
 * surface, expressed as an in-world phrase instead. Ordered by ceiling, ascending; the
 * last row is the open top. Owner-retunable prose, never a float.
 * @type {ReadonlyArray<readonly [number, string]>}
 */
export const QUANTITY_BANDS = Object.freeze(/** @type {ReadonlyArray<readonly [number, string]>} */ ([
  [3, 'a few souls'],
  [12, 'a dozen or so'],
  [40, 'dozens'],
  [120, 'a hundred or so'],
  [400, 'several hundred'],
  [1200, 'many hundreds'],
  [Number.POSITIVE_INFINITY, 'thousands'],
]));

/** The floors a reading must cross before the Herald says anything at all. */
export const HERALD_TUNING = Object.freeze({
  // A burial line needs real hunger behind it and real losses in front of it, or every
  // ordinary winter would make the paper.
  HUNGER_DEFICIT_FLOOR: 0.20,
  HUNGER_NET_LOSS_FLOOR: 4,
  // A departure line needs a column worth calling a departure.
  EXODUS_DEPARTURE_FLOOR: 12,
  // A realm that could place nobody says so at a lower floor: being turned away is the
  // more consequential fact, and it is the one the plan lane acts on.
  REFUSED_FLOOR: 6,
  MAJOR_DEPARTURE_FLOOR: 200,
  // ── THE CROWDING LINE (CAPACITY C1) ──
  // Below the thorp ceiling a one-soul jitter would re-cross the band most weeks, so
  // the crossing carries a head-count floor of its own before it is worth saying.
  CROWDING_LINE_MIN_SOULS: 60,
  // The two crowding severities and scores. They live in this table rather than as bare
  // decimals in the code below for two reasons: the tuning register scores this file's
  // bare decimals against a frozen baseline, and these are the owner's numbers to sign.
  CROWDING_FILLED_SEVERITY: 0.35,
  CROWDING_THINNED_SEVERITY: 0.5,
  CROWDING_FILLED_SCORE: 48,
  CROWDING_THINNED_SCORE: 56,
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** Codepoint comparator (device/locale-stable ordering). @param {string} a @param {string} b */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * SPEAK A COUNT WITHOUT WRITING ONE. Total: a nonpositive count reads as nobody, so a
 * caller can never produce "0 souls left".
 * @param {number} count @returns {string}
 */
export function quantityWords(count) {
  const n = Math.max(0, Math.round(num(count, 0)));
  if (n <= 0) return 'nobody';
  for (const [ceiling, phrase] of QUANTITY_BANDS) {
    if (n <= ceiling) return phrase;
  }
  return 'thousands';
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE CROWDING LINE — a CROSSING toward the fixed point, never a census
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * @typedef {'filled'|'thinned'} CrowdingDirection
 */

/** The three rungs the crossing reads, taken FROM the ladder rather than spelled as
 *  numbers, so a rung inserted into OVERFLOW_BANDS moves this file with it. */
const FILLING_RANK = overflowRankOf('filling');
const PRESSED_RANK = overflowRankOf('pressed');
const OVERFLOWING_RANK = overflowRankOf('overflowing');

/**
 * DID THIS STEP CROSS THE OVERFLOW LADDER, AND IN WHICH DIRECTION?
 *
 * WHY A CROSSING AND NOT A STATE, WHICH IS THE WHOLE DESIGN OF THIS LINE. The engine's
 * equilibrium sits at 76 to 83 percent of the bound, and `BIRTH_EASE` opens suppression
 * at 75 percent, so at rest EVERY settled settlement has suppressed births forever. A
 * state-keyed line would therefore print for every settlement every week: wallpaper, and
 * the exact opposite of a newspaper. A crossing fires when the reading MOVES between
 * rungs, which happens rarely and means something when it does.
 *
 * Both directions are toward the fixed point and both are news: FILLED is a place that
 * grew into its bound, THINNED is a place that had grown past it and paid for it.
 *
 * No persisted prior state and no new key: the step receipt already carries `before` and
 * `after` against its own `bound`, so the crossing is a pure function of one receipt.
 *
 * @param {DemographicReceipt|Record<string, unknown>|null|undefined} receipt
 * @returns {CrowdingDirection|null} null when there is no crossing, or no usable bound
 */
export function crowdingCrossingOf(receipt) {
  const step = asObject(receipt);
  const bound = num(step.bound, 0);
  // A settlement with no derived bound has no ladder to cross. INERT, never a divide.
  if (!(bound > 0)) return null;
  // The same denominator `pressureOf` uses, so the Herald and the kernel read one ladder.
  const denominator = Math.max(1, bound);
  const rankBefore = overflowRankOf(overflowBandOf(Math.max(0, num(step.before, 0)) / denominator));
  const rankAfter = overflowRankOf(overflowBandOf(Math.max(0, num(step.after, 0)) / denominator));
  if (rankBefore < FILLING_RANK && rankAfter >= FILLING_RANK) return 'filled';
  if (rankBefore === OVERFLOWING_RANK && rankAfter <= PRESSED_RANK) return 'thinned';
  return null;
}

/**
 * THE AUTHORED PROSE TABLE, direction by what the wall actually is.
 *
 * ⭐ THE GAME-GRADE LAW, APPLIED RATHER THAN CITED: translate the formula, never rename
 * it. The engine's word `walls` means the DENSITY ceiling, so a sentence reading "the
 * walls of Ashford are the wall" would land on a regular human as a typo rather than a
 * translation. Each cell therefore says what a person at the market would say: the
 * fields will not feed any more, or there is no ground left to build on.
 *
 * ⛔ AND NO RUNG OF THE PRESSURE LADDER APPEARS IN ANY CELL. `easy`, `filling`,
 * `pressed` and `overflowing` are the engine's words for how full a place is; a reader
 * must never meet one. That is why the lean-years reason says the years WORE the count
 * down rather than PRESSED it, and why crowded quarters are crowded rather than packed:
 * the natural English verb collides with a rung, and the rung loses.
 *
 * Every summary is TWO sentences, one idea each. 'Growth slowed because the fields are
 * full.' is the design's own sentence and is carried verbatim.
 *
 * @param {CrowdingDirection} direction
 * @param {string} binding one of BINDING_KINDS
 * @param {boolean} foodKnown
 * @param {string} name
 * @returns {{ headline: string, summary: string, reasons: string[] }}
 */
function crowdingProse(direction, binding, foodKnown, name) {
  // Unknown food is NEVER narrated as famine: with no receipted harvest to speak of,
  // the honest sentence is about the ground the place stands on.
  const wall = !foodKnown ? 'unknown' : binding === 'granary' ? 'granary' : 'walls';
  if (direction === 'filled') {
    if (wall === 'granary') {
      return {
        headline: `${name} has grown as large as its fields will feed`,
        summary: `${name} has filled what its fields can feed. Fewer children are born there now, and the place will hold rather than grow.`,
        reasons: [
          `The granaries of ${name} are the wall, and the harvest reaches it.`,
          'Growth slowed because the fields are full.',
        ],
      };
    }
    if (wall === 'walls') {
      return {
        headline: `${name} has grown as large as its walls will hold`,
        summary: `${name} has filled the ground inside its walls. Fewer children are born there now, and the place will hold rather than grow.`,
        reasons: [
          `There is no ground left inside the walls of ${name} to build on.`,
          'Growth slowed because there is no room left to build.',
        ],
      };
    }
    return {
      headline: `${name} has grown as large as its ground will hold`,
      summary: `${name} has filled the ground it stands on. Fewer children are born there now, and the place will hold rather than grow.`,
      reasons: [
        `The ground itself has no more room at ${name}.`,
        'Growth slowed because the place is full.',
      ],
    };
  }
  if (wall === 'granary') {
    return {
      headline: `${name} has thinned to what its fields will feed`,
      summary: `${name} has thinned to what its fields can feed. The count fits the harvest again.`,
      reasons: [
        `The granaries of ${name} are the wall, and the place had grown past it.`,
        'The lean years wore the count down until it fit the harvest.',
      ],
    };
  }
  if (wall === 'walls') {
    return {
      headline: `${name} has thinned to what its walls will hold`,
      summary: `${name} has thinned to the ground inside its walls. The count fits the ground again.`,
      reasons: [
        `${name} had spilled past its walls, and the crowding thinned it.`,
        'Crowded quarters wore the count down until it fit the ground.',
      ],
    };
  }
  return {
    headline: `${name} has thinned to what its ground will hold`,
    summary: `${name} has thinned to the ground it stands on. The count fits the ground again.`,
    reasons: [
      `${name} had spilled past the ground itself, and the crowding thinned it.`,
      'Crowded quarters wore the count down until it fit the ground.',
    ],
  };
}

/**
 * The house wizard-news envelope, filled from the one shape every pulse mover uses.
 * `id` is mandatory and house-shaped: an entry without one is refused by normalizeEntry
 * AND skipped by the audit receipt sink, so it would reach no reader, no Herald and no
 * soak receipt at all.
 * @param {{ slug: string, impactKind: string, causeClass: string, tick: number,
 *   now: string|null, key: string, ids: string[], names: string[], headline: string,
 *   summary: string, reasons: string[], significance: string, severity: number,
 *   score: number, scope: string }} f
 * @returns {Record<string, unknown>}
 */
function demographicNews(f) {
  return {
    id: `wizard_news.${f.tick}.${f.slug}.${f.key}`,
    tick: f.tick,
    createdAt: f.now,
    scope: f.scope,
    significance: f.significance,
    severity: f.severity,
    score: f.score,
    headline: f.headline,
    summary: f.summary,
    kind: 'applied',
    impactKind: f.impactKind,
    causeClass: f.causeClass,
    channelType: 'trade_route',
    // THE ADDRESS CHAIN: ids for the router, names for the reader, and the prose above
    // names them too so a line lifted out of its envelope still says where it happened.
    settlementIds: f.ids,
    settlementNames: f.names,
    impactIds: [],
    channelIds: [],
    sourceEventId: `demographics.${f.slug}.${f.key}.${f.tick}`,
    tags: ['world_pulse', 'demographics', f.causeClass],
    reasons: f.reasons,
  };
}

/**
 * THE HERALD LINES for one tick of the demographic lane.
 *
 * @param {{ receipts?: ReadonlyArray<DemographicReceipt>,
 *   migrationReceipts?: ReadonlyArray<Record<string, unknown>>,
 *   tick: number, now?: string|null,
 *   nameOf: (id: string) => string }} input
 * @returns {Array<Record<string, unknown>>} codepoint-stable, possibly empty
 */
export function demographicNewsEntries(input) {
  const tick = Math.max(0, Math.round(num(asObject(input).tick, 0)));
  const now = asObject(input).now == null ? null : String(asObject(input).now);
  const nameFn = typeof asObject(input).nameOf === 'function'
    ? /** @type {(id: string) => string} */ (asObject(input).nameOf)
    : (/** @type {string} */ id) => String(id);
  const nameOf = (/** @type {string} */ id) => String(nameFn(String(id)) || id);

  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  /** Settlements the hunger line already spoke for this tick: ONE cause per
   *  settlement per tick, and hunger outranks crowding. */
  const hungry = new Set();

  // ── THE HUNGER LINE. A settlement burying measurably more than it bears, with a
  // real food deficit behind it: the granaries are the wall and the wall is being
  // paid for. Ordinary mortality never reaches this. ──
  const steps = Array.isArray(asObject(input).receipts)
    ? /** @type {DemographicReceipt[]} */ (asObject(input).receipts)
    : [];
  for (const receipt of [...steps].sort((a, b) => codepoint(String(a.id), String(b.id)))) {
    const netLoss = Math.max(0, num(receipt.deaths, 0) - num(receipt.births, 0));
    if (num(receipt.deficit01, 0) < HERALD_TUNING.HUNGER_DEFICIT_FLOOR) continue;
    if (netLoss < HERALD_TUNING.HUNGER_NET_LOSS_FLOOR) continue;
    const id = String(receipt.id);
    const name = nameOf(id);
    hungry.add(id);
    out.push(demographicNews({
      slug: 'hunger',
      impactKind: 'hungry_gap',
      causeClass: 'hunger',
      tick,
      now,
      key: id,
      ids: [id],
      names: [name],
      scope: 'local',
      significance: netLoss >= HERALD_TUNING.MAJOR_DEPARTURE_FLOOR ? 'major' : 'notable',
      severity: 0.55,
      score: 62,
      headline: `Grain ran short in ${name}`,
      summary: `Grain ran short in ${name}, and ${quantityWords(netLoss)} more were buried than born this season.`,
      reasons: [
        receipt.binding === 'granary'
          ? `The granaries of ${name} are the wall, and the harvest no longer reaches it.`
          : `${name} has more mouths than its ground will hold.`,
        `The lean season pressed hardest on ${name}.`,
      ],
    }));
  }

  // ── THE DEPARTURE LINE. The design's own sentence: the cause, the place BY NAME, the
  // people, and where they went BY NAME. A column the realm could not place says so in
  // the same breath, because being turned away is the more consequential half. ──
  const columns = Array.isArray(asObject(input).migrationReceipts)
    ? /** @type {Array<Record<string, unknown>>} */ (asObject(input).migrationReceipts)
    : [];
  for (const receipt of [...columns].sort((a, b) => codepoint(String(a.id), String(b.id)))) {
    if (String(receipt.kind) !== 'demographic_migration') continue;
    const originId = String(receipt.originId || '');
    if (!originId) continue;
    const departures = Math.max(0, num(receipt.departures, 0));
    const unplaced = Math.max(0, num(receipt.unplaced, 0));
    if (departures < HERALD_TUNING.EXODUS_DEPARTURE_FLOOR && unplaced < HERALD_TUNING.REFUSED_FLOOR) continue;

    const origin = nameOf(originId);
    const placements = Array.isArray(receipt.placements)
      ? /** @type {Array<Record<string, unknown>>} */ (receipt.placements)
      : [];
    const destIds = [...new Set(placements
      .map((p) => String(asObject(p).destId || ''))
      .filter((v) => v !== ''))].sort(codepoint);
    const destNames = destIds.map(nameOf);
    const refugee = String(receipt.migrantClass) === 'refugee';

    const road = destNames.length === 0
      ? 'and found no road that would take them'
      : destNames.length === 1
        ? `and took the road to ${destNames[0]}`
        : `and took the roads to ${destNames.slice(0, -1).join(', ')} and ${destNames[destNames.length - 1]}`;

    /** @type {string[]} */
    const reasons = [
      refugee
        ? `${origin} became a place people flee rather than a place people leave.`
        : `${origin} offered less than the road promised.`,
    ];
    if (unplaced >= HERALD_TUNING.REFUSED_FLOOR) {
      reasons.push(`The realm had room for fewer than asked, and ${quantityWords(unplaced)} were turned back toward ${origin}.`);
    }
    if (destNames.length) reasons.push(`They were taken in at ${destNames.join(', ')}.`);

    out.push(demographicNews({
      slug: 'exodus',
      impactKind: 'migration_flight',
      causeClass: refugee ? 'flight' : 'departure',
      tick,
      now,
      key: originId,
      ids: [originId, ...destIds],
      names: [origin, ...destNames],
      scope: destIds.length ? 'regional' : 'local',
      significance: departures >= HERALD_TUNING.MAJOR_DEPARTURE_FLOOR ? 'major' : 'notable',
      severity: refugee ? 0.7 : 0.45,
      score: departures >= HERALD_TUNING.MAJOR_DEPARTURE_FLOOR ? 78 : 58,
      headline: `${quantityWords(departures || unplaced)} left ${origin}`,
      summary: departures > 0
        ? `${quantityWords(departures)} left ${origin} ${road}.`
        : `${quantityWords(unplaced)} would have left ${origin}, and the realm had nowhere to put them.`,
      reasons,
    }));
  }

  // ── THE CROWDING LINE. Not "this place is full" but "this place BECAME full", or
  // "this place is no longer past what it can hold". The ladder crossing is the whole
  // event; a settlement sitting at its own fixed point says nothing, forever. ──
  for (const receipt of [...steps].sort((a, b) => codepoint(String(a.id), String(b.id)))) {
    const id = String(receipt.id);
    // ONE CAUSE PER SETTLEMENT PER TICK, AND HUNGER OUTRANKS CROWDING. A place burying
    // more than it bears is not also filing a story about how much room it has left.
    if (hungry.has(id)) continue;
    const direction = crowdingCrossingOf(receipt);
    if (direction == null) continue;
    // The floor is the LARGER of the two counts, deliberately: a town that thins from
    // two hundred to fifty crossed a real rung and has real news, and keying the floor
    // to `after` alone would silence exactly that story.
    const souls = Math.max(num(receipt.before, 0), num(receipt.after, 0));
    if (souls < HERALD_TUNING.CROWDING_LINE_MIN_SOULS) continue;
    const filled = direction === 'filled';
    const prose = crowdingProse(direction, String(receipt.binding), receipt.foodKnown === true, nameOf(id));
    out.push(demographicNews({
      slug: 'crowding',
      impactKind: 'population_crowding',
      causeClass: 'crowding',
      tick,
      now,
      key: id,
      ids: [id],
      names: [nameOf(id)],
      scope: 'local',
      significance: 'notable',
      severity: filled ? HERALD_TUNING.CROWDING_FILLED_SEVERITY : HERALD_TUNING.CROWDING_THINNED_SEVERITY,
      score: filled ? HERALD_TUNING.CROWDING_FILLED_SCORE : HERALD_TUNING.CROWDING_THINNED_SCORE,
      headline: prose.headline,
      summary: prose.summary,
      reasons: prose.reasons,
    }));
  }

  return out;
}
