/**
 * domain/worldPulse/commercialReasonTaxonomy.js — TR-1's closed commercial-reason
 * taxonomy: the eight severance causes and their eight partnership mirrors.
 *
 * THE CASUS COMMERCII. War has had a typed, receipted, walker-enforced reasons layer
 * since W-PEACE-1; commerce has had none, so every embargo in this estate was a state
 * change nobody had to justify. This dependency-free leaf is the one authority for the
 * persisted commercial casus types, exactly as warReasonTaxonomy.js is for war's — it
 * is deliberately separate from the writer so save normalization and pure reads can
 * validate records without pulling the world-pulse engine into their import graph.
 *
 * ⚠ THE WAR TAXONOMY IS THE SHAPE TEMPLATE AND NOTHING ELSE (J-TR-2, binding). This
 * file imports NOTHING — not warReasonTaxonomy.js, not its REASON_MIRRORS, not its
 * types. A commercial grievance is not a casus belli and this ledger never mints one:
 * the war coupling runs the other way, through tradeWar's existing intent deposit
 * reading a severance MAGNITUDE as pressure (WR-0c item 3's law — never a new front).
 * Two taxonomies that shared a table would be one taxonomy with two names, and the
 * first wave that added a war casus would silently widen commerce's.
 *
 * REGISTRATION-FIRST, the same order this estate's war taxonomy admits: a type is
 * registered here BEFORE its producer exists, because totality and bijection are
 * walker-enforced across the surfaces below, so a cause cannot be minted by a wave
 * that has not already authored its mirror and its two receipt pools. Four of the
 * eight pairs read live state today; the other four are registered seams whose scorer
 * is passed `undefined` until its producer lands (see commercialReasons.js's SEAMS
 * block), which yields 0 ⇒ no record ⇒ byte-identical.
 *
 * THE SAME-EVIDENCE LAW (SPINE §1.2, commercialized). Every pair is TWO SIGNS OF ONE
 * READ, never two independent measurements: the dependency that frightens is the
 * dependency that binds, and the toll that gouges is the toll that, relieved, warms.
 * That is why the mirrors are a bijection rather than a loose association — a mirror
 * with its own evidence could disagree with its force about what happened.
 *
 * @enforced-by tests/lint/commercialReasonTaxonomy.walker.test.js
 */

/**
 * The eight shipped severance causes — `from`'s recorded case for cutting `to` off.
 *
 * Ordered as DESIGN_FP_TRADE.md §5 TR-1 authors them, which is also the order the
 * receipt annex is written in; the walker pins the two orders against each other so
 * a reordering here cannot silently re-point a pool.
 *
 * @type {ReadonlyArray<string>}
 */
export const SEVERANCE_REASON_TYPES = Object.freeze([
  'contract_default',
  'toll_extortion',
  'market_exclusion',
  'cornering',
  'famine_profiteering',
  'dependency_fear',
  'contraband_injury',
  'route_predation',
]);

/** The eight shipped partnership mirrors, in force order. @type {ReadonlyArray<string>} */
export const PARTNERSHIP_REASON_TYPES = Object.freeze([
  'contract_honored',
  'toll_relief',
  'market_opened',
  'provision',
  'famine_relief',
  'dependency_comfort',
  'honest_gates',
  'route_wardenship',
]);

/**
 * The bijection: every severance cause has exactly one distinct partnership mirror
 * scoring off the SAME evidence. Totality and bijection are held by the taxonomy
 * walker, which also proves the inverse map is total — so neither direction can
 * acquire an orphan.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const COMMERCIAL_REASON_MIRRORS = Object.freeze({
  contract_default: 'contract_honored',
  toll_extortion: 'toll_relief',
  market_exclusion: 'market_opened',
  cornering: 'provision',
  famine_profiteering: 'famine_relief',
  dependency_fear: 'dependency_comfort',
  contraband_injury: 'honest_gates',
  route_predation: 'route_wardenship',
});

/**
 * THE BELIEF-SIDE PAIRS, named as data rather than re-spelled in six files.
 *
 * `contraband_injury` and `famine_profiteering` score off the OBSERVER'S BELIEF, not
 * off truth: a court can embargo an honest gate on a planted rumor, and that tragedy
 * is the INFO coupling consumed here and written there. Naming them here is what lets
 * the writer refuse a truth-side injection road structurally instead of by convention.
 *
 * @type {ReadonlyArray<string>}
 */
export const BELIEF_SOURCED_SEVERANCE_TYPES = Object.freeze([
  'famine_profiteering',
  'contraband_injury',
]);

const SEVERANCE_SET = new Set(SEVERANCE_REASON_TYPES);
const PARTNERSHIP_SET = new Set(PARTNERSHIP_REASON_TYPES);

/** @param {unknown} type @returns {boolean} */
export function isSeveranceReasonType(type) {
  return SEVERANCE_SET.has(String(type));
}

/** @param {unknown} type @returns {boolean} */
export function isPartnershipReasonType(type) {
  return PARTNERSHIP_SET.has(String(type));
}

/** Either side of the taxonomy. @param {unknown} type @returns {boolean} */
export function isCommercialReasonType(type) {
  return isSeveranceReasonType(type) || isPartnershipReasonType(type);
}

/**
 * The inverse index, built FROM the forward table so the two can never disagree.
 * Declared BEFORE its only reader: this estate has already paid once for a chunk-cycle
 * TDZ that made dist un-bootable, and a const referenced above its declaration is the
 * shape that class wears.
 * @type {Readonly<Record<string, string>>}
 */
const REVERSE_MIRRORS = Object.freeze(Object.fromEntries(
  Object.entries(COMMERCIAL_REASON_MIRRORS).map(([force, mirror]) => [mirror, force]),
));

/**
 * The mirror of either side, or null. Total on both sides by construction.
 * @param {unknown} type @returns {string | null}
 */
export function commercialReasonMirrorOf(type) {
  const key = String(type);
  if (key in COMMERCIAL_REASON_MIRRORS) return COMMERCIAL_REASON_MIRRORS[key];
  return REVERSE_MIRRORS[key] ?? null;
}

/** The sixteen types, severance first then mirrors, for census consumers. */
export const COMMERCIAL_REASON_TYPES = Object.freeze([
  ...SEVERANCE_REASON_TYPES,
  ...PARTNERSHIP_REASON_TYPES,
]);
