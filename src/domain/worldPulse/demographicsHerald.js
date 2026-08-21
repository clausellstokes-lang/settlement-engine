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
 * NO NEW VOCABULARY IS MINTED, AND THAT IS A DELIBERATE REFUSAL. A new `impactKind`
 * literal would red three registration walkers at once and its registrations live in
 * files this slice may not touch: WHAT_PHRASES (settlementRumors.js), EXPECTED_VOICE
 * (the impactKind walker) and the Herald routing table. So the two lines ride the two
 * EXISTING kinds that already mean exactly what they mean: `hungry_gap` (the lean
 * season, minted today by the seasons lane) and `migration_flight` (families taking to
 * the road, minted today by the M4 rumor lane). The demographic lane is distinguished
 * where the certification row's own precedent puts lane ownership: on the RECORD, in
 * `tags` and in the `sourceEventId`, exactly as the shared migration ledger is
 * distinguished by its per-column travelClass.
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

  return out;
}
