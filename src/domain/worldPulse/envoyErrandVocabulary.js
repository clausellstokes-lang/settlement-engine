/**
 * envoyErrand/vocabulary — WR-7a's closed envoy words and its persistence primitives.
 *
 * A PURE LEAF OF THE ENVOY-ERRAND WRITER FAMILY (ruling R-BLD-4: the single-writer law
 * reads ONE WRITER FAMILY, never one file). `envoyErrand.js` remains the family HEAD.
 * This leaf owns only two things, and neither of them can reach world truth:
 *
 *   THE CLOSED WORDS — every band, state, kind, resolution and evidence spelling the
 *     errand lifecycle is allowed to hold, plus the derived Sets and exact-key lists the
 *     persistence DTOs match against. One spelling, one file: two spellings of a journey
 *     would let an import forge a state the writer never authored (FINITE-SEMANTICS LAW).
 *   THE PERSISTENCE PRIMITIVES — the strict readers (`text`, `strictText`, `wholeTick`)
 *     and the cycle-rejecting, key-sorting `cloneData`. These are what make a persisted
 *     row detached and replay-stable, so they belong beside the words they validate.
 *
 * K3 (NOBODY IS EVER CURRENT): this leaf has ZERO imports. A module that reaches nothing
 * cannot pass truth along, which is why the K3 pin freezes its import list as empty.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/envoyK3BeliefSeam.test.js + tests/domain/envoyErrand.test.js
 */

export const ENVOY_ERRAND_LEDGER_KEY = 'envoyErrands';
export const MAX_CONCURRENT_ENVOYS = 2;
export const MAX_TERMINAL_ENVOY_HISTORY = 24;
export const MAX_ENVOY_RUMOR_REFS = 16;
export const MAX_ENVOY_ENCOUNTER_HISTORY = 16;
export const ENVOY_ENCOUNTER_SCHEMA_VERSION = 1;
export const ENVOY_CONTINUATION_SCHEMA_VERSION = 1;
export const ENVOY_PARLAY_REFUSAL_SCHEMA_VERSION = 1;

export const ENVOY_REQUIRED_RULES = Object.freeze([
  'warLayerEnabled',
  'warTerminationEnabled',
  'peaceEngineEnabled',
  'envoyDiplomacyEnabled',
  'npcConsequencesEnabled',
  'routeLifecycleEnabled',
]);

export const ENVOY_ERRAND_STATES = Object.freeze([
  'travelling',
  'parlaying',
  'intercepted',
  'held',
  'returning',
  'home',
  'lost',
]);

export const ENVOY_EVIDENCE_KINDS = Object.freeze([
  'envoy_departed',
  'envoy_on_the_road',
  'envoy_returning',
  'envoy_home',
  'envoy_lost',
  'envoy_silence_inference',
  'terms_never_reached',
  'envoy_intercepted',
  'envoy_parlaying',
  'envoy_terms_agreed',
  'envoy_held',
  'terms_signed_for_a_fallen_town',
  'parlay_at_an_occupied_venue',
  'interceptor_dilemma',
  'interceptor_parlays_own_edge',
  'parlay_terms_neither_court_drafted',
]);

export const ENVOY_STORES_BANDS = Object.freeze([
  'bare',
  'thin',
  'stocked',
  'deep',
]);

export const ENVOY_STRENGTH_BANDS = Object.freeze([
  'spent',
  'strained',
  'ready',
  'strong',
  'dominant',
]);

export const ENVOY_MORALE_EXHAUSTION_BANDS = Object.freeze([
  'quiet',
  'present',
  'pressing',
  'decisive',
]);

export const ENVOY_FOUNDING_CAUSE_STATES = Object.freeze([
  'dissolved',
  'anchor_unavailable',
  'live',
]);

export const ENVOY_BELIEVED_RATIO_BANDS = Object.freeze([
  'far_behind',
  'behind',
  'matched',
  'ahead',
  'far_ahead',
]);

export const ENVOY_PICTURE_FIELDS = Object.freeze([
  'storesBand',
  'strengthBand',
  'moraleExhaustionBand',
  'foundingCauseStatus',
  'believedRatioBand',
]);

export const ENVOY_PICTURE_DIRECTIONS = Object.freeze(['rise', 'fall']);
export const ENVOY_POSITION_BANDS = Object.freeze(['departed', 'underway', 'near', 'arrived']);
export const ENVOY_JOURNEYS = Object.freeze(['outbound', 'return']);
export const ENVOY_LOSS_CAUSES = Object.freeze(['killed', 'route_lost', 'dm_removed']);
export const ENVOY_PURPOSES = Object.freeze(['sue', 'self_parlay']);

/**
 * SP-D — THE SIX PURPOSE CLASSES. The errand stopped being a war artifact here: this is
 * the closed vocabulary of WHY a named person is on a road, and it sits BESIDE
 * `ENVOY_PURPOSES` rather than replacing it. A purpose is the errand's own errand
 * ('sue for peace'); a CLASS is the kind of business it is, and the classes are what
 * five unbuilt volumes (TRADE's factors, FAITH's legates and pilgrims, INFO's couriers,
 * INTERIOR's emigres) will mint against. Codepoint-ordered, because every enumeration in
 * this family is.
 */
export const ENVOY_PURPOSE_CLASSES = Object.freeze([
  'commercial',
  'covert',
  'diplomatic',
  'factional',
  'personal',
  'religious',
]);

/**
 * THE MAPPING ROW, AND IT IS DATA RATHER THAN INFERENCE (SP-D charter). Every war purpose
 * names its class here explicitly. The alternative — a reader that INFERS 'diplomatic'
 * from "no class was written" — is the same shape as a default that silently absorbs a
 * class the vocabulary never learned, and it would classify a future purpose wrongly and
 * quietly. TOTAL over `ENVOY_PURPOSES` by pin: a new purpose with no row here resolves to
 * NO class at all rather than to a guess.
 */
export const PURPOSE_CLASS_BY_PURPOSE = Object.freeze({
  self_parlay: 'diplomatic',
  sue: 'diplomatic',
});

/**
 * ES-1 — THE COVERT SUB-RECORD'S CLOSED WORDS. The espionage layer adds exactly ONE
 * conditional field to the errand row (`covert`, present only on purposeClass `covert`
 * rows), and its vocabulary lives HERE rather than in the espionage family for the reason
 * this leaf's header already gives: the persistence DTOs match against these words, and a
 * second spelling of a persisted vocabulary is how an import forges a state no writer
 * authored. The espionage family SPELLS these words; it does not own them.
 *
 * ⚠ THIS LEAF STILL HAS ZERO IMPORTS, and that is what forces the direction. The words
 * are minted here and the espionage arithmetic BORROWS them (espionageMath.js re-binds
 * `DEMAND_BANDS` and `ESPIONAGE_TUNING.MAX_ITINERARY_STOPS` to these exports rather than
 * authoring a second 3 and a second demand list) — J-WR-10's one-spelling law, pointed
 * the only way a zero-import leaf can point it.
 */

/** The typed mission product (ES §1). Codepoint-ordered. */
export const ENVOY_COVERT_PRODUCTS = Object.freeze(['acquire', 'confirm', 'refute']);

/**
 * THE GRADED BAR a mission is sent to clear (owner addition G). Codepoint-ordered.
 * `espionageMath.js` exports this same frozen array as `DEMAND_BANDS`.
 */
export const ENVOY_COVERT_DEMANDS = Object.freeze(['certain', 'confirm', 'corroborate']);

/** Whether a stop rides on the public face or only on the true itinerary. Ordered. */
export const ENVOY_COVERT_FACES = Object.freeze(['covert', 'declared']);

/**
 * ⟨F5⟩ THE SIX APPRAISAL LEGS AN ACQUIRE MAY TARGET, ENUMERATED EXACTLY — and the
 * enumeration is the point. SP-B's `conditionsBands` carries a FOURTH key, `pullBand`,
 * and it is EXCLUDED HERE BY RULE: pullBand is fed by SP-B's own populations road and no
 * espionage product can fill it, so admitting it would mint a vocabulary member no writer
 * can ever satisfy — the dead-band law's exact shape. A mint carrying `pullBand` is
 * REFUSED, and that refusal is pinned rather than assumed.
 */
export const ENVOY_COVERT_LEG_REFS = Object.freeze([
  'exports',
  'readiness',
  'routePositionBand',
  'storesBand',
  'strength',
  'tierBand',
]);

/**
 * The itinerary cap (ES §3.4). Minted ONCE, here, because the persistence DTO enforces it
 * and `ESPIONAGE_TUNING.MAX_ITINERARY_STOPS` re-exposes this same number rather than
 * authoring a second one that could drift a stop apart from the normalizer.
 */
export const MAX_COVERT_ITINERARY_STOPS = 3;

/** Exact-key list for one itinerary stop. */
export const COVERT_STOP_KEYS = Object.freeze(['face', 'settlementId', 'stayTicks']);

/**
 * ES-3 — THE ACCESS DEPTH A GATHERED READ WAS TAKEN AT (owner addition H).
 * Codepoint-ordered; the SEMANTIC depth order is performance < beliefs < delta and lives
 * with the arithmetic (`espionageMath.TAP_DEPTH`), never with the sort.
 *
 * MINTED HERE FOR THE SAME REASON THE DEMAND BANDS ARE. The word is a ROW fact before it
 * is an arithmetic fact: `normalizeCovertMission` matches a persisted partial against this
 * list on the way out of a save file, so the DTO owns the mint and `TAP_LEVELS` re-exposes
 * this same frozen array rather than authoring a second one that could drift a word apart
 * from the normalizer.
 */
export const ENVOY_COVERT_TAPS = Object.freeze(['beliefs', 'delta', 'performance']);

/**
 * ES-3 — HOW MANY ROOTED RE-SAMPLES ONE STOP MAY ACCRUE (§3.4b's hard backstop). Minted
 * here, re-exposed as `ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP`, for the same one-spelling
 * reason as the itinerary cap: the gradient's LENGTH is what the persistence DTO bounds,
 * so a ramp that counted to a different number than the normalizer accepts would let the
 * gauntlet price an interval the ledger cannot hold.
 */
export const MAX_COVERT_DWELL_RESAMPLES = 6;

/**
 * ES-3 — the gradient's hard length bound: every stop's minted stay plus its rooted
 * re-samples. DERIVED from the two caps above rather than authored, so neither can move
 * without this moving with it (the count-ledger discipline — a restated derivable goes
 * stale and greens a shrink-only guard).
 */
export const MAX_COVERT_GATHERED = MAX_COVERT_ITINERARY_STOPS * (1 + MAX_COVERT_DWELL_RESAMPLES);

/**
 * Exact-key list for one gathered partial (§1's gradient row). `sentHome` is CONDITIONAL
 * and appears only on a magic-transmitted partial, so the two lists below are the whole
 * lawful shape and anything else is refused.
 */
export const COVERT_GATHERED_KEYS = Object.freeze(['accuracyCap01', 'atTick', 'subjectId', 'tap']);

/** The same partial once it has been sent home by magic (addition E). */
export const COVERT_GATHERED_SENT_KEYS = Object.freeze([...COVERT_GATHERED_KEYS, 'sentHome']);

/**
 * Exact-key list for the covert sub-record. `legRefs`, `gathered` and `standoff` are all
 * conditional — drop-when-absent, never null (T4: a key is a byte).
 *
 * ⚠ ES-3 TAUGHT THIS LIST `gathered` AND `standoff` IN THE COMMIT THAT FIRST WROTE THEM,
 * which is the obligation ES-1's version of this comment set. The discipline it records
 * still binds every later wave: a normalizer that silently kept unknown keys would let an
 * import forge a gradient nobody gathered, and an amender that wrote a key this list does
 * not carry would have its field erased by the next persist with both halves looking
 * correct in isolation. A wave that mints another key teaches this list and
 * `normalizeCovertMission` in the SAME COMMIT — the columnOf precedent.
 */
export const COVERT_KEYS = Object.freeze([
  'demand',
  'gathered',
  'itinerary',
  'legRefs',
  'product',
  'standoff',
  'subjectId',
]);

/**
 * THE ERRAND CONSUMER REGISTRY (SP §8 seam 8) — the frozen consumer map, pointed at five
 * unbuilt programs. `built` is a CLAIM ABOUT THE TREE, and
 * tests/lint/errandConsumerRegistry.walker.test.js measures it BOTH WAYS: a module that
 * mints errands without a row here reds, and a row whose module does not mint reds. The
 * tripwire is what stops the sixth volume from quietly opening a second purposeful-travel
 * substrate on the day it needs one (J-SP-2: there is exactly one).
 */
export const ERRAND_CONSUMERS = Object.freeze([
  Object.freeze({
    consumer: 'envoys',
    purposeClass: 'diplomatic',
    module: 'src/domain/worldPulse/envoyErrand.js',
    wave: 'WR-7a',
    built: true,
  }),
  // FP GR-2: the SECOND BUILT consumer, and the first that is not a person-shaped one.
  // A pact proposal is business on the road exactly as an embassy is — same class, same
  // transit seam, same speed law — so it mints through the one head rather than growing a
  // private clock. The mint is at the proposal LEDGER's writer because that is where a
  // proposal is created; there is no separate `pactErrand.js` and there must not be one.
  Object.freeze({
    consumer: 'pact proposals',
    purposeClass: 'diplomatic',
    module: 'src/domain/worldPulse/pactProposals.js',
    wave: 'GR-2',
    built: true,
  }),
  Object.freeze({
    consumer: 'factors',
    purposeClass: 'commercial',
    module: 'src/domain/worldPulse/factorErrand.js',
    wave: 'TR-8',
    built: false,
  }),
  Object.freeze({
    consumer: 'legates',
    purposeClass: 'religious',
    module: 'src/domain/worldPulse/legateErrand.js',
    wave: 'WF-2b',
    built: false,
  }),
  Object.freeze({
    consumer: 'pilgrims',
    purposeClass: 'personal',
    module: 'src/domain/worldPulse/pilgrimErrand.js',
    wave: 'WF-2b',
    built: false,
  }),
  // ES-1: THE THIRD BUILT CONSUMER, and the row it was split out of is the reason the
  // split had to happen. The pre-pin read `couriers … wave: 'ES-1/IN-4'`, one row for two
  // programs — but the ES volume's own seam row 9 rules them DISTINCT ("IN-4's couriers
  // are CARGO movers, ES missions are PRODUCT movers — distinct purposes on the one
  // spine, BOTH in the consumer map"). One row could not have carried both: `built` is a
  // single boolean and `module` a single address, so landing ES-1 against the shared row
  // would have declared IN-4 built and pointed the registry at a file that does not exist.
  Object.freeze({
    consumer: 'covert missions',
    purposeClass: 'covert',
    module: 'src/domain/worldPulse/espionage/espionageMissions.js',
    wave: 'ES-1',
    built: true,
  }),
  Object.freeze({
    consumer: 'couriers',
    purposeClass: 'covert',
    module: 'src/domain/worldPulse/covertErrand.js',
    wave: 'IN-4',
    built: false,
  }),
  Object.freeze({
    consumer: 'ambitious',
    purposeClass: 'factional',
    module: 'src/domain/worldPulse/emigreErrand.js',
    wave: 'INT-3b',
    built: false,
  }),
]);
export const ENVOY_ENCOUNTER_KINDS = Object.freeze([
  'field_parlay',
  'war_continue',
  'private_goal',
]);
export const ENVOY_PRIVATE_GOALS = Object.freeze(['plant', 'imprison', 'terms_shop']);
export const ENVOY_ENCOUNTER_RESOLUTIONS = Object.freeze([
  'pending',
  'parlaying',
  'held',
  'resumed',
  'plant_resumed',
]);
export const ENVOY_ENCOUNTER_VENUE_KINDS = Object.freeze([
  'allied_hall',
  'occupied_enemy_settlement',
  'field_node',
]);
export const ENVOY_PARLAY_REFUSAL_REASONS = Object.freeze([
  'orientation_refused',
  'budget_refused',
  'family_refused',
  'asset_refused',
  'magnitude_refused',
  'duration_refused',
  'weight_refused',
  'no_sheet',
]);

export const STATE_SET = new Set(ENVOY_ERRAND_STATES);
// Every state a parlay can already have happened in. `travelling` is the only
// one excluded: nothing has been drafted there, so a refusal witness on it is a
// forged import.
export const REFUSAL_BEARING_STATES = new Set(
  ENVOY_ERRAND_STATES.filter((state) => state !== 'travelling'),
);
export const EVIDENCE_KIND_SET = new Set(ENVOY_EVIDENCE_KINDS);
export const JOURNEY_SET = new Set(ENVOY_JOURNEYS);
export const POSITION_BAND_SET = new Set(ENVOY_POSITION_BANDS);
export const LOSS_CAUSE_SET = new Set(ENVOY_LOSS_CAUSES);
export const PURPOSE_SET = new Set(ENVOY_PURPOSES);
export const PURPOSE_CLASS_SET = new Set(ENVOY_PURPOSE_CLASSES);
export const COVERT_PRODUCT_SET = new Set(ENVOY_COVERT_PRODUCTS);
export const COVERT_DEMAND_SET = new Set(ENVOY_COVERT_DEMANDS);
export const COVERT_FACE_SET = new Set(ENVOY_COVERT_FACES);
export const COVERT_LEG_REF_SET = new Set(ENVOY_COVERT_LEG_REFS);
export const COVERT_TAP_SET = new Set(ENVOY_COVERT_TAPS);
export const ENCOUNTER_KIND_SET = new Set(ENVOY_ENCOUNTER_KINDS);
export const PRIVATE_GOAL_SET = new Set(ENVOY_PRIVATE_GOALS);
export const ENCOUNTER_RESOLUTION_SET = new Set(ENVOY_ENCOUNTER_RESOLUTIONS);
export const ENCOUNTER_VENUE_KIND_SET = new Set(ENVOY_ENCOUNTER_VENUE_KINDS);
export const PARLAY_REFUSAL_REASON_SET = new Set(ENVOY_PARLAY_REFUSAL_REASONS);
export const TERMINAL_STATES = new Set(['home', 'lost']);
export const ACTIVE_STATES = new Set(['travelling', 'parlaying', 'intercepted', 'held', 'returning']);

export const ENCOUNTER_KEYS = Object.freeze([
  'schemaVersion',
  'id',
  'kind',
  'interceptorId',
  'armyId',
  'venueId',
  'venueRef',
  'routeId',
  'encounteredTick',
  'resolvedTick',
  'priorState',
  'priorJourney',
  'priorPosition',
  'destinationId',
  'continuation',
  'privateGoal',
  'resolution',
  'interceptorPictureId',
  'interceptorPicture',
  'termSheetId',
]);

export const PARLAY_REFUSAL_KEYS = Object.freeze([
  'schemaVersion',
  'id',
  'parlayId',
  'attemptedTick',
  'proposerPictureId',
  'responderPictureId',
  'reason',
]);

export const CONTINUATION_KEYS = Object.freeze([
  'schemaVersion',
  'resumeState',
  'journey',
  'destinationId',
  'resumedTick',
  'scheduledArrivalTick',
]);

export const PICTURE_BANDS = Object.freeze({
  storesBand: ENVOY_STORES_BANDS,
  strengthBand: ENVOY_STRENGTH_BANDS,
  moraleExhaustionBand: ENVOY_MORALE_EXHAUSTION_BANDS,
  foundingCauseStatus: ENVOY_FOUNDING_CAUSE_STATES,
  believedRatioBand: ENVOY_BELIEVED_RATIO_BANDS,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
export function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** Strict string read. IDs are never manufactured from numbers or indexes. */
export function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {number|null} */
export function wholeTick(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

/** Repository-independent codepoint order. */
export function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Clone JSON-like data while rejecting cycles, non-finite numbers, functions,
 * symbols, and class instances.  Object keys are sorted so an injected term
 * sheet cannot make replay serialization depend on authoring order.
 *
 * @param {unknown} value
 * @param {number} [depth]
 * @param {WeakSet<object>} [ancestors]
 * @returns {unknown}
 */
export function cloneData(value, depth = 0, ancestors = new WeakSet()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (!value || typeof value !== 'object' || depth > 12) return undefined;
  if (ancestors.has(/** @type {object} */ (value))) return undefined;
  ancestors.add(/** @type {object} */ (value));
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) {
      const cloned = cloneData(item, depth + 1, ancestors);
      if (cloned !== undefined) out.push(cloned);
    }
    ancestors.delete(/** @type {object} */ (value));
    return out;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    ancestors.delete(/** @type {object} */ (value));
    return undefined;
  }
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const key of Object.keys(/** @type {Record<string, unknown>} */ (value)).sort(compareCodepoint)) {
    const cloned = cloneData(/** @type {Record<string, unknown>} */ (value)[key], depth + 1, ancestors);
    if (cloned !== undefined) out[key] = cloned;
  }
  ancestors.delete(/** @type {object} */ (value));
  return out;
}

/** A detached, non-empty JSON-safe record, or null. */
export function jsonRecord(value) {
  const cloned = cloneData(value);
  const row = asObject(cloned);
  return Object.keys(row).length ? row : null;
}

/** @param {Record<string, unknown>} row @param {ReadonlyArray<string>} keys */
export function hasExactKeys(row, keys) {
  const actual = Object.keys(row).sort(compareCodepoint);
  const expected = [...keys].sort(compareCodepoint);
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

/** Authored WR-7b identities are not trimmed or coerced at persistence seams. */
export function strictText(value) {
  return typeof value === 'string' && value.length > 0 && value === value.trim()
    && ![...value].some((character) => {
      const code = character.charCodeAt(0);
      return code <= 31 || code === 127;
    })
    ? value
    : '';
}

/** Collision-free identity text for persisted witnesses. */
export function stableIdentity(parts) {
  return parts.map((value) => {
    const part = String(value);
    return `${part.length}:${part}`;
  }).join('|');
}

/**
 * SP-D — THE ONE READER OF AN ERRAND'S TRUE CLASS, and the reason `purposeClass` is
 * allowed to be absent at all.
 *
 * A written class wins; otherwise the MAPPING ROW derives one from the errand's purpose.
 * That derivation is what makes the field a genuine conditional (L4/T4: a key is a byte,
 * absent never null) — every legacy row, every installed save, and every errand the war
 * path mints today carries NO class key and reads `diplomatic` anyway, so SP-D asks for
 * no migration and re-serializes nothing.
 *
 * THE MIRROR HAZARD THIS CLOSES: a consumer that reads `errand.purposeClass` DIRECTLY
 * sees `undefined` on exactly those rows, and would file a peace embassy under no class
 * at all. The writer/reader spelling-drift class, one field wide. There is therefore one
 * reader, here, and `tests/lint/errandConsumerRegistry.walker.test.js` holds the estate
 * to it.
 *
 * @param {unknown} errand @returns {string} a member of ENVOY_PURPOSE_CLASSES, or ''
 */
export function purposeClassOf(errand) {
  const row = asObject(errand);
  const written = text(row.purposeClass);
  if (PURPOSE_CLASS_SET.has(written)) return written;
  const derived = /** @type {Record<string, string|undefined>} */ (
    PURPOSE_CLASS_BY_PURPOSE
  )[text(row.purpose)];
  return derived && PURPOSE_CLASS_SET.has(derived) ? derived : '';
}

/**
 * SP-D — THE PUBLIC HALF OF THE DECLARED/TRUE SPLIT: the class the world is allowed to
 * believe this errand is. When a cover story is riding, that is `declaredPurpose`; with
 * no split, the declared purpose IS the true one and this returns the same word.
 *
 * FAIL-CLOSED BY SHAPE, not by the caller's care: this function CANNOT return the true
 * class of a covert errand wearing a face, because it never consults `truePurpose` and
 * consults `purposeClass` only when no declaration exists. An audience-side caller that
 * reaches for the true class has to spell a different function to get it, and the
 * projection's audience split is the only place that spelling is lawful.
 *
 * ⚠⚠ ES-1 REPAIR R1 — THAT CLAIM WAS TRUE OF A ROW WEARING A FACE AND FALSE OF ONE THAT
 * IS NOT, AND THE GAP WAS A LIVE VEIL LEAK. The old body fell back to `purposeClassOf`
 * whenever no lawful `declaredPurpose` was written — and `purposeClassOf` happily returns
 * the covert class. The MINT refuses to write a faceless covert row, so no row this
 * estate CREATES could reach the gap; but a row that is minted lawfully, serialized, and
 * re-imported with its `declaredPurpose`/`truePurpose` pair DELETED heals back into the
 * ledger keeping `purposeClass` and losing its cover story, and the two SP-D-R4 doors that
 * drop a malformed pair reach the same state from inside. Executed at ES-1's commit
 * dda24851, `projectErrandPurpose(healed, {})` — the PLAYER arm — answered
 * `purposeClass: "covert"`. The absence of a face is not a missing cover story; on a
 * covert row it IS the secret, printed for whoever asked.
 *
 * THE FIX IS HERE RATHER THAN AT THE PERSIST SEAM, and that is a chokepoint choice with a
 * measured alternative behind it. Enforcing the law in `errandSpineBlock` by dropping the
 * class was executed: it closes the leak, and it reds the three SP-D-R4 door pins that
 * deliberately require a class to outlive a broken pair, and it destroys campaign history
 * exactly as repair SP-D-R5 already refused to. This function is the ONE public reader of
 * an errand's face — `envoyErrandProjection.js`'s player arm is its ONLY caller in src/,
 * and the consumer-registry walker is what keeps that true — so closing it here closes it
 * for every audience path at once, changes not one persisted byte, and leaves the row's
 * own history intact for the DM arm that is allowed to see it.
 *
 * SO THE VEILED CLASS IS NEVER THIS FUNCTION'S ANSWER, by any route: not as a written
 * face (a cover story that names the secret is not a cover story), not as a resolved
 * class, and not as a derivation. A later wave that mints a SECOND secret class joins it
 * to the guard below; a purpose that DERIVES a secret class yields '' rather than the word,
 * and tests/domain/espionageMission.test.js reds if the mapping row ever grows one.
 *
 * @param {unknown} errand @returns {string} a member of ENVOY_PURPOSE_CLASSES, or ''
 */
export function declaredPurposeClassOf(errand) {
  const row = asObject(errand);
  const declared = text(row.declaredPurpose);
  if (PURPOSE_CLASS_SET.has(declared) && declared !== 'covert') return declared;
  const resolved = purposeClassOf(row);
  if (resolved !== 'covert') return resolved;
  // The face a faceless covert row wears in public: the class its OWN PURPOSE derives,
  // which is the same word the mint would have derived for it at `covertFaceFor`.
  const derived = purposeClassOf({ purpose: row.purpose });
  return derived === 'covert' ? '' : derived;
}
