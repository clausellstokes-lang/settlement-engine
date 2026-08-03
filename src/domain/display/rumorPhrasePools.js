/**
 * domain/display/rumorPhrasePools.js — THE WIDENED SUBJECT-PHRASE CORPUS (R1).
 *
 * A PURE DATA LEAF of the rumor-display family (ruling R-BLD-4: the single-writer law
 * reads ONE WRITER FAMILY, never one file — the same split warReceiptPools.js makes from
 * eventProse.js). settlementRumors.js remains the family HEAD: it owns WHAT_PHRASES, the
 * `whatPhrase` selector, the FNV-1a fold and every consumer contract. This leaf holds only
 * the authored variants that widen a phrase already registered there.
 *
 * ── WHAT THIS DISCHARGES ────────────────────────────────────────────────────────────────
 * The spine's frequency-scaled floor (DESIGN_FP_SPINE.md §2 SP-6, AMENDED 2026-08-03)
 * extends to the ~269 LIVE routed tokens, which are today largely single-voiced. Their
 * pools are pre-authored in docs/content/RECEIPT_POOLS_LEGACY.md §3 and wired here. This
 * is the FIRST WIRING SLICE: the population/demographics desk, four kinds of the sixty-
 * three §3 carries.
 *
 * ── THE CANONICAL-AT-ZERO CONTRACT (read before adding a pool) ──────────────────────────
 * The doc's VARIANT 1 is the string the reader is shown today, and it is NOT repeated
 * here — it stays in WHAT_PHRASES, and `whatPhrase` prepends it. That is deliberate and
 * it is the strongest available form of the annex's byte-identity rule: the canonical
 * line cannot drift from the live line, because it IS the live line rather than a copy of
 * it. Everything below is doc variants 2..N, in doc order.
 *
 * ORDER IS LOAD-BEARING. Selection is `hash(seed) % pool.length` over
 * `[canonical, ...variants]`, so inserting or re-sorting moves every later index and
 * changes what an existing seed draws. APPEND ONLY — never insert, never re-sort.
 *
 * NO SLOTS. R1 subject phrases take none: the live frame supplies the settlement name and
 * the address chain around the phrase (RECEIPT_POOLS_LEGACY.md, THE SLOT CONVENTION), so
 * the news address law is satisfied without the phrase carrying a name.
 *
 * THE REGISTER (R1). A lowercase noun phrase, no terminal stop, no digits, no engine
 * token, reading correctly in BOTH live frames — capitalized-first ("Families leaving in
 * Thornwall") and after "word of …" ("Merchants bring word of families leaving in
 * Thornwall"). A phrase that only reads in one frame is a defect, not a variant.
 *
 * PURE DATA: frozen string literals only — no logic, no imports, no interpolation.
 *
 * @enforced-by tests/domain/rumorPhrasePools.test.js
 */

/**
 * kind → the widened variants (doc variants 2..N). A kind absent from this map is
 * single-voiced and renders its WHAT_PHRASES row unconditionally, which is exactly what
 * every unwired kind does today.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const WHAT_PHRASE_POOLS = Object.freeze({
  // ── THE POPULATION / DEMOGRAPHICS DESK (RECEIPT_POOLS_LEGACY.md §3c) ────────────────
  // Four kinds the engine already routes. Two of them — flow_migration and
  // migration_pressure — share the SAME live string today ('people on the move'), so a
  // reader watching a slow depopulation saw one sentence for two different engine facts.
  // Their widened pools are deliberately different: flow_migration is the movement SEEN
  // (carts, roads, arrivals at the gate), migration_pressure is the departure BUILDING
  // (talk in the lanes, requests to the clerk, what people are weighing). The kinds stay
  // distinguishable at the reading surface for the first time.

  // flow_migration — doc variants 2..8; variant 1 ('people on the move') is the
  // WHAT_PHRASES row. CADENCE chronic → floor 8.
  flow_migration: Object.freeze([
    'carts on the road with everything a house holds',
    'arrivals entered at the gate faster than the clerk can write',
    'villages that were there last year and are thinner now',
    'a road busier than the market',
    'travellers sharing the verge with families',
    'more feet on the road than the season usually brings',
    'a child asleep on a load of bedding',
  ]),

  // migration_flight — doc variants 2..8; variant 1 ('families taking to the road') is
  // the WHAT_PHRASES row. CADENCE chronic → floor 8.
  migration_flight: Object.freeze([
    'houses left with the doors standing open',
    'names coming off one gate roll and onto another',
    "a column that will be somebody else's business by winter",
    'what people do before they are asked to',
    'a verge lined with folk resting their loads',
    'a hearth left cold in a cold season',
    'more leaving than the town can afford to lose',
  ]),

  // migration_pressure — doc variants 2..8; variant 1 ('people on the move') is the
  // WHAT_PHRASES row. CADENCE chronic → floor 8. BELIEF ATTRIBUTION: this kind is the
  // BUILDING of a departure, read from talk as much as from carts, so its variants
  // report what is said and weighed rather than asserting that anyone has left.
  migration_pressure: Object.freeze([
    'talk in the lanes about where else there is to go',
    'more requests to leave than the clerk has taken in a year',
    'families weighing what they can carry',
    'a road that is about to get busier',
    'travellers asked, over and over, what it is like where they came from',
    'a spring in which nobody is planting as much',
    'a town that has begun to think of itself as somewhere to leave',
  ]),

  // population_emigration — doc variants 2..8; variant 1 ('families leaving') is the
  // WHAT_PHRASES row. CADENCE chronic → floor 8.
  population_emigration: Object.freeze([
    'carts going out that do not come back',
    'names struck from the town roll',
    'work going unclaimed for want of hands',
    'a lane with more empty houses than full ones',
    'travellers passing whole households headed the other way',
    'a departure season that has not ended with the season',
    'fewer at the market, and nobody saying why',
  ]),
});

/**
 * The kinds this wiring slice governs, in doc order. Named rather than derived from the
 * map's keys so the pin set has an INDEPENDENT denominator: a kind silently dropped from
 * the map above would otherwise shrink the census and its own coverage together.
 * @type {ReadonlyArray<string>}
 */
export const POPULATION_DESK_KINDS = Object.freeze([
  'flow_migration',
  'migration_flight',
  'migration_pressure',
  'population_emigration',
]);
