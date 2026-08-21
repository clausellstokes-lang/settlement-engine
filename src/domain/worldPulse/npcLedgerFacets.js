/**
 * domain/worldPulse/npcLedgerFacets.js — W-H1: THE REPUTATION FACETS + EXCLUSION EDGES.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §3b, law 4 FINITE SEMANTICS; companion
 * DESIGN_NPC_LIFECYCLE.md §0/§1 THE FACET LAW.)
 *
 * THE FACET LAW APPLIED TO REPUTATION. A roamer's standing in the world is not a
 * number and it is not prose: it is a small set of BANK-TYPED, CLOSED, BANDED facets.
 * Five of them, exactly as the design names them — notoriety band, edict mark, scandal
 * class, alignment read, competence read. Every one is a closed vocabulary with an
 * explicit "the world has formed no read" rung, so a freshly graduated NPC carries a
 * TOTAL facet set rather than a sparse one, and no consumer ever branches on absence.
 *
 * WHY THE NEUTRAL RUNG IS LOAD-BEARING. NEUTRAL_REPUTATION_FACETS is a single frozen
 * object and normalizeReputationFacets returns exactly it for any input that reads
 * neutral. That gives the ledger a byte-identity anchor: a record whose reputation was
 * never marked serializes identically no matter which path built it, so the dormancy
 * and round-trip pins measure real drift rather than construction noise.
 *
 * VOCABULARY CONFORMANCE, NOT INVENTION. `alignmentRead` reuses the estate's own
 * alignment axis tokens (deityAxes.js EVIL01: good / neutral / evil) rather than
 * minting a parallel spelling; it adds only the 'unknown' rung, which the axis itself
 * does not need because a deity always has an alignment and a stranger does not.
 *
 * THE READS ARE BELIEFS, NOT MEASUREMENTS (design §6b). alignmentRead and
 * competenceRead record what the world SAYS about a person, which is why they are
 * reads rather than copies of the NPC's own facets. H1 stores the truth-side value the
 * ledger was minted with; the per-settlement belief derivation that complicates it by
 * distance and infoMode is H3's, and it derives on demand from the news record — it is
 * never stored per pair.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O. This leaf imports
 * NOTHING, so it can be reached from any lane (the deityAxes.js / stablePart.js
 * dependency-free-leaf pattern) without dragging a graph behind it.
 *
 * @enforced-by tests/domain/npcLedgerFacets.test.js
 */

// ── NOTORIETY (ordered, low to high) ─────────────────────────────────────────
/**
 * How widely and how badly a person is spoken of. ORDERED: index is the band's
 * severity, so a consumer may compare rungs without a lookup table. 'unknown' is the
 * mint rung, not a missing value.
 * @type {ReadonlyArray<string>}
 */
export const NOTORIETY_BANDS = Object.freeze([
  'unknown',
  'whispered',
  'known',
  'notorious',
  'infamous',
]);

// ── SCANDAL CLASS (what the story is ABOUT) ──────────────────────────────────
/**
 * The typed shape of the disgrace a roamer carries. Closed: the rejection table (H3)
 * keys on this, and a free-prose cause would make that table impossible to close.
 * @type {ReadonlyArray<string>}
 */
export const SCANDAL_CLASSES = Object.freeze([
  'none',
  'venality',
  'betrayal',
  'brutality',
  'conspiracy',
  'heresy',
]);

// ── EDICT MARK (banished only, per design §3b) ───────────────────────────────
/**
 * The formal legal mark on a person. The design constrains this facet to the banished
 * case, so the vocabulary is deliberately two rungs and NOT a general verdict mirror:
 * a jailed or turncoat NPC carries 'none' here and records its verdict on the roamer
 * record's own verdictCause field. Keeping the two apart stops the edict mark from
 * silently becoming a second, drifting copy of the verdict table.
 * @type {ReadonlyArray<string>}
 */
export const EDICT_MARKS = Object.freeze([
  'none',
  'banishment_edict',
]);

// ── ALIGNMENT READ (the estate's own axis tokens plus an unknown rung) ───────
/**
 * How the world reads this person's intent. Tokens match deityAxes.js's alignmentAxis
 * vocabulary verbatim so a consumer can compare a roamer's read against a settlement's
 * patron deity without a translation table.
 * @type {ReadonlyArray<string>}
 */
export const ALIGNMENT_READS = Object.freeze([
  'unknown',
  'good',
  'neutral',
  'evil',
]);

// ── COMPETENCE READ (ordered, low to high) ───────────────────────────────────
/**
 * How the world reads this person's capability. ORDERED like NOTORIETY_BANDS. This is
 * the facet that lets a disgraced but formidable official still be worth hiring, which
 * is the whole reason circulation is interesting rather than a one-way drain.
 * @type {ReadonlyArray<string>}
 */
export const COMPETENCE_READS = Object.freeze([
  'unknown',
  'inept',
  'adequate',
  'capable',
  'formidable',
]);

// ── VERDICT CAUSES (design §3c, closed; H2 resolves, H1 only declares) ───────
/**
 * The closed cause vocabulary a roamer record's verdictCause carries. The four verdict
 * outcomes plus the destruction-dispersal entry point (design §9), which reaches the
 * pool without passing through the verdict table at all. Declared here in H1 so the
 * ledger's normalizer is total from the first commit; H2 owns the table that CHOOSES
 * among them.
 * @type {ReadonlyArray<string>}
 */
export const VERDICT_CAUSES = Object.freeze([
  'none',
  'jailed',
  'banished',
  'turncoat',
  'criminal_founding',
  'destruction_dispersal',
]);

// ── COMPROMISE SOURCES (DM truth, design §3c inputs) ─────────────────────────
/**
 * Where a compromised official's leash was held. This is COVERT INTELLIGENCE: it rides
 * the roamer record's dmTruth and never reaches a player projection (law 7). The
 * tokens name the corruption web's two channel classes (a hostile/rival edge versus a
 * criminal_corridor / criminal_network channel, corruptionWeb.js rawChannelQuality)
 * without importing that module.
 * @type {ReadonlyArray<string>}
 */
export const COMPROMISE_SOURCES = Object.freeze([
  'none',
  'rival_power',
  'criminal_institution',
]);

// ── EXCLUSION EDGE KINDS ─────────────────────────────────────────────────────
/**
 * Why a door is shut. The vocabulary exists so a new reason lands as a new rung rather
 * than as an untyped boolean, and W-H3 is the first wave to take that extension point.
 *
 * THE TWO RUNGS ARE NOT THE SAME KIND OF SHUT, and the difference is why the second one
 * is an edge rather than a fourth ledger map. A BANISHMENT_EDICT is a legal fact about
 * a person, minted by a court and lifted by the DM's pardon verb. A REHOST_COOLDOWN is
 * bookkeeping: design §6 requires that a rejected pair record a cooldown so a roamer
 * does not knock on the same door every tick, and design §3b freezes the world ledger at
 * exactly three maps, so a fourth map would be a shape change to a surface whose
 * contract must be right before it persists (H2 refused an `openings` map for the same
 * reason). Both are "this door is not open to you at this tick" keyed by (person,
 * settlement, window), which is precisely what an ExclusionEdge already is.
 *
 * CONSUMERS MUST READ THE KIND. isExcludedFrom answers the whole-door question and is
 * therefore total over kinds; the candidate filter wants that reading, and the roamer
 * PROJECTION wants only the edict (a cooldown is not a shut door in the fiction, it is
 * the wanderer not trying again yet). npcLedger.exclusionsOfKind is the kind-aware read.
 * @type {ReadonlyArray<string>}
 */
export const EXCLUSION_KINDS = Object.freeze([
  'banishment_edict',
  'rehost_cooldown',
]);

/**
 * The exclusion kinds that are a PUBLIC legal fact about a person, as opposed to
 * private circulation bookkeeping. The projection's shutDoors list and every reader
 * surface filter on this; the candidate flow does not.
 * @type {ReadonlyArray<string>}
 */
export const EDICT_EXCLUSION_KINDS = Object.freeze(['banishment_edict']);

/**
 * @typedef {Object} ReputationFacets
 * @property {string} notorietyBand   a NOTORIETY_BANDS member
 * @property {string} edictMark       an EDICT_MARKS member
 * @property {string} scandalClass    a SCANDAL_CLASSES member
 * @property {string} alignmentRead   an ALIGNMENT_READS member
 * @property {string} competenceRead  a COMPETENCE_READS member
 */

/**
 * The mint-state facet set: every facet at its "no read formed" rung. THE BYTE-IDENTITY
 * ANCHOR — normalizeReputationFacets returns this exact frozen reference for any
 * neutral-reading input, so two independently built neutral records are identical by
 * reference as well as by value.
 * @type {ReputationFacets}
 */
export const NEUTRAL_REPUTATION_FACETS = Object.freeze({
  notorietyBand: 'unknown',
  edictMark: 'none',
  scandalClass: 'none',
  alignmentRead: 'unknown',
  competenceRead: 'unknown',
});

/**
 * Key order is LOAD-BEARING for byte identity: JSON.stringify emits insertion order,
 * so every constructed facet set must use this order or two equal facet sets would
 * serialize differently and the round-trip pin would measure key order instead of
 * content.
 * @type {ReadonlyArray<string>}
 */
export const REPUTATION_FACET_KEYS = Object.freeze([
  'notorietyBand',
  'edictMark',
  'scandalClass',
  'alignmentRead',
  'competenceRead',
]);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * Clamp a value into a closed vocabulary, failing closed to the vocabulary's FIRST
 * member (which is the neutral/unknown rung in every list above). Total on garbage.
 * @param {unknown} value
 * @param {ReadonlyArray<string>} vocabulary
 * @returns {string}
 */
export function closedValue(value, vocabulary) {
  const v = typeof value === 'string' ? value : '';
  return vocabulary.includes(v) ? v : vocabulary[0];
}

/**
 * Normalize any input into a TOTAL, closed, canonically-ordered ReputationFacets.
 * Returns the shared NEUTRAL_REPUTATION_FACETS reference when every facet reads
 * neutral, so a neutral record carries no bespoke object at all.
 *
 * Total on garbage: null, a string, an array and a facet set full of invented tokens
 * all normalize to neutral rather than throwing. FINITE SEMANTICS is enforced HERE,
 * at the one door, so no caller can persist a token outside the bank.
 *
 * @param {unknown} raw
 * @returns {ReputationFacets}
 */
export function normalizeReputationFacets(raw) {
  const r = asObject(raw);
  const notorietyBand = closedValue(r.notorietyBand, NOTORIETY_BANDS);
  const edictMark = closedValue(r.edictMark, EDICT_MARKS);
  const scandalClass = closedValue(r.scandalClass, SCANDAL_CLASSES);
  const alignmentRead = closedValue(r.alignmentRead, ALIGNMENT_READS);
  const competenceRead = closedValue(r.competenceRead, COMPETENCE_READS);
  if (
    notorietyBand === NEUTRAL_REPUTATION_FACETS.notorietyBand
    && edictMark === NEUTRAL_REPUTATION_FACETS.edictMark
    && scandalClass === NEUTRAL_REPUTATION_FACETS.scandalClass
    && alignmentRead === NEUTRAL_REPUTATION_FACETS.alignmentRead
    && competenceRead === NEUTRAL_REPUTATION_FACETS.competenceRead
  ) {
    return NEUTRAL_REPUTATION_FACETS;
  }
  return Object.freeze({ notorietyBand, edictMark, scandalClass, alignmentRead, competenceRead });
}

/**
 * Does this facet set read entirely neutral (no mark of any kind)? Used by the ledger's
 * prune pass and by the projection's "is there anything to say" check.
 * @param {unknown} facets
 * @returns {boolean}
 */
export function reputationFacetsAreNeutral(facets) {
  return normalizeReputationFacets(facets) === NEUTRAL_REPUTATION_FACETS;
}

/**
 * The severity index of a notoriety band (0 for 'unknown', rising). -1 is impossible:
 * the value is clamped first, so an invented token reads 0 rather than falling through.
 * @param {unknown} band
 * @returns {number}
 */
export function notorietyRank(band) {
  return NOTORIETY_BANDS.indexOf(closedValue(band, NOTORIETY_BANDS));
}

/**
 * The capability index of a competence read (0 for 'unknown', rising).
 * @param {unknown} read
 * @returns {number}
 */
export function competenceRank(read) {
  return COMPETENCE_READS.indexOf(closedValue(read, COMPETENCE_READS));
}

/**
 * @typedef {Object} ExclusionEdge
 * @property {string} settlementId  the settlement whose door is shut
 * @property {string} kind          an EXCLUSION_KINDS member
 * @property {number} [untilTick]   WINDOWED variant: the first tick the door reopens
 * @property {true} [indefinite]    INDEFINITE variant: no reopening tick
 */

/**
 * Build a normalized ExclusionEdge. EXACTLY ONE of the two variants materializes:
 * a finite, non-negative NUMBER `untilTick` makes a WINDOWED edge; anything else
 * (absent, null, a string, NaN, negative) makes an INDEFINITE one. The two never
 * coexist on one edge, so a consumer reading `indefinite` never has to also check for
 * a contradicting window, and the serialized shape has no ambiguous third state.
 *
 * IT FAILS SHUT, AND THE TYPE CHECK IS WHY. Coercing with `Number(...)` looks
 * equivalent and is not: `Number(null)` is 0, `Number('')` is 0, and `Number(false)`
 * is 0, so an edge whose window was absent-but-present-as-null would normalize to a
 * window that expired at tick zero, silently reopening a door that should have stayed
 * shut. Caught by the totality pin rather than in production. Only a real number is a
 * real window; every other reading keeps the sentence indefinite, because the safe
 * direction for a garbage banishment record is to hold, never to free.
 *
 * Key order is fixed for the same byte-identity reason as the facet set.
 *
 * @param {{ settlementId?: unknown, kind?: unknown, untilTick?: unknown, indefinite?: unknown }} raw
 * @returns {ExclusionEdge}
 */
export function normalizeExclusionEdge(raw) {
  const r = asObject(raw);
  const settlementId = String(r.settlementId == null ? '' : r.settlementId);
  const kind = closedValue(r.kind, EXCLUSION_KINDS);
  const rawUntil = typeof r.untilTick === 'number' ? r.untilTick : Number.NaN;
  const windowed = r.indefinite !== true && Number.isFinite(rawUntil) && rawUntil >= 0;
  return windowed
    ? Object.freeze({ settlementId, kind, untilTick: Math.floor(rawUntil) })
    : Object.freeze({ settlementId, kind, indefinite: /** @type {true} */ (true) });
}

/**
 * Is this door still shut at `tick`? An indefinite edge is always shut; a windowed one
 * is shut STRICTLY BEFORE its untilTick, so `untilTick` is the first tick a return is
 * legal (a half-open window, the estate's convention for tick ranges).
 * @param {unknown} edge
 * @param {number} tick
 * @returns {boolean}
 */
export function exclusionActiveAt(edge, tick) {
  const e = asObject(edge);
  if (e.indefinite === true) return true;
  // The same FAIL-SHUT type check as normalizeExclusionEdge, and for the same reason:
  // `Number(null)` is 0, so a coercing read would treat a windowless edge as a window
  // that expired before the world began. Anything that is not a real number leaves the
  // door shut. Duplicated deliberately rather than shared, so this predicate is safe
  // when handed a RAW persisted edge that never passed through the normalizer.
  const until = typeof e.untilTick === 'number' ? e.untilTick : Number.NaN;
  if (!Number.isFinite(until)) return true;
  const now = Number(tick);
  return Number.isFinite(now) ? now < until : true;
}

/**
 * Normalize a list of exclusion edges: total on garbage, one edge per (settlementId,
 * kind) pair, and codepoint-ordered so the persisted array is permutation-independent.
 *
 * MERGE RULE when the same door is shut twice: the STRICTER edge wins — indefinite
 * beats any window, and a later untilTick beats an earlier one. A second banishment
 * from the same town extends the sentence rather than quietly replacing it with a
 * shorter one, which is the reading a DM would expect and the only one that cannot
 * silently free a roamer.
 *
 * @param {unknown} raw
 * @returns {ReadonlyArray<ExclusionEdge>}
 */
export function normalizeExclusionEdges(raw) {
  const list = Array.isArray(raw) ? raw : [];
  /** @type {Map<string, ExclusionEdge>} */
  const merged = new Map();
  for (const item of list) {
    const edge = normalizeExclusionEdge(asObject(item));
    if (!edge.settlementId) continue; // an edge naming no door is not an edge
    const key = `${edge.settlementId}|${edge.kind}`;
    const prior = merged.get(key);
    if (!prior) {
      merged.set(key, edge);
      continue;
    }
    if (prior.indefinite === true) continue;             // already the strictest
    if (edge.indefinite === true) {
      merged.set(key, edge);
      continue;
    }
    const priorUntil = Number(prior.untilTick);
    const nextUntil = Number(edge.untilTick);
    if (Number.isFinite(nextUntil) && (!Number.isFinite(priorUntil) || nextUntil > priorUntil)) {
      merged.set(key, edge);
    }
  }
  return Object.freeze(
    [...merged.values()].sort((a, b) => (
      (a.settlementId < b.settlementId ? -1 : a.settlementId > b.settlementId ? 1 : 0)
      || (a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0)
    )),
  );
}
