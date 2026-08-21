/**
 * contributionLedger.js — THE WAR-CONTRIBUTION RECORD SHAPES, THEIR FAIL-CLOSED NORMALIZER,
 * AND THE LANE'S GATE (WC-0E).
 *
 * `DESIGN_FP_ARCH_WC.md` §7.A.2 names the two kinds a party may contribute to somebody
 * else's war. This module lands their vocabulary, the shape of a credit record, the
 * normalizer that keeps a save honest, and the two-flag gate the lane reads.
 *
 * ⛔⛔ IT WRITES NOTHING, AND THAT IS THE MEMBER'S BOUNDARY. There is no `setSpatialLedger`
 * call here, no credit, no shortfall booking, no arrival fold and no close fold. The
 * volume's own WC-0 LANDS block says it in terms — *"record shapes + normalizer (no writer
 * calls yet)"* — and WC-1's says where the writer goes: *"the contributionLedger.js writer
 * live."*
 *
 * ⭐⭐ WHICH IS WHY NO `spatialUsage` TRACKED ROW LANDS WITH THIS FILE.
 * `tests/lib/spatialLedgerCoverage.walker.test.js` asserts `classified` EQUALS `written` in
 * BOTH directions, and it derives `written` by scanning the tree for real
 * `setSpatialLedger` calls. A TRACKED row for a key nothing writes reds on the day it
 * lands. The volume charters those rows in the same sentence that says this wave makes no
 * writer calls; ODQ §73.3's F-1 is the correction, and `warContributions` travels to WC-1
 * with its writer.
 *
 * ⭐⭐ THE GATE IS A TWO-FLAG CONJUNCTION, AND BOTH READS ARE BY NAME.
 * `engineGatedRuleKeys` direction 1 reds any manifest key the engine does not actually gate
 * on, so a flag minted without a by-name `=== true` read in the SAME commit reds at its own
 * landing. The `blocks[]` persistence arm could not carry these reads —
 * `normalizeDeployments` takes no rules and must not acquire any, because save hygiene has
 * to run whether or not a feature is lit — so the reads live here, in the module the flags
 * exist for. The shape is the estate's own, borrowed rather than invented:
 * `settlementStrategy.js` already reads `rules.warLayerEnabled === true &&
 * rules.warTerminationEnabled === true`, a LAYER flag conjoined with a FEATURE flag.
 *
 * ⚠ BOTH FLAGS ARE VIRTUAL AND LIT IN NO PRESET, so no seeded world reaches this lane. The
 * corpus is byte-identical because the flags are DARK, not because the module is inert —
 * and the acceptance file asserts that structural absence rather than asserting that
 * nothing moved.
 *
 * PURE: no rng, no clock, no store, no world read.
 */

/**
 * The two kinds a party may contribute to another party's war, codepoint-sorted.
 * `troops_lent` is headcount, conserved through the people ledger; `supplies_delivered` is
 * stores, conserved through the shipment identity.
 * @type {ReadonlyArray<string>}
 */
export const CONTRIBUTION_KINDS = Object.freeze(['supplies_delivered', 'troops_lent']);

/**
 * The fields a credit record carries, and the ONLY fields a normalized one keeps. Declared
 * as a closed set so an unknown field cannot ride into a save on the back of a spread.
 * @type {ReadonlyArray<string>}
 */
export const CONTRIBUTION_RECORD_FIELDS = Object.freeze([
  'amount', 'kind', 'sinceTick', 'toPartyId',
]);

/** @param {string} message @returns {never} */
const fail = (message) => {
  throw new TypeError(`contributionLedger: ${message}`);
};

/**
 * ⭐⭐ THE LANE'S GATE. Both reads are BY NAME and both are `=== true`: a truthiness read, a
 * destructured alias or a computed key is invisible to the gate-read walker and would red
 * `engineGatedRuleKeys` direction 1 at this member's own commit.
 *
 * The conjunction is meant, not decorative: `warCirculationEnabled` gates the war-circulation
 * LAYER, and `contributionLedgerEnabled` gates this ledger within it. Either one dark leaves
 * the lane dark.
 *
 * @param {unknown} rules the live simulation rules.
 * @returns {boolean}
 */
export function contributionLedgerActive(rules) {
  if (!rules || typeof rules !== 'object') return false;
  const r = /** @type {Record<string, unknown>} */ (rules);
  return r.warCirculationEnabled === true && r.contributionLedgerEnabled === true;
}

/**
 * Is this a kind the ledger knows? Total, and false for everything else.
 * @param {unknown} kind
 */
export function isContributionKind(kind) {
  return CONTRIBUTION_KINDS.indexOf(String(kind ?? '')) >= 0;
}

/**
 * The canonical kind, throw-on-unknown — for call sites that must not proceed on a
 * misspelling rather than silently booking nothing.
 * @param {unknown} kind
 * @returns {string}
 */
export function contributionKind(kind) {
  const name = String(kind ?? '');
  if (!isContributionKind(name)) {
    fail(`unknown contribution kind ${JSON.stringify(kind)} — the vocabulary is closed at ${CONTRIBUTION_KINDS.join('|')}`);
  }
  return name;
}

/**
 * NORMALIZE ONE PERSISTED CREDIT RECORD, or null when the record is not one.
 *
 * ⛔ FAIL-CLOSED IN EVERY DIRECTION, which is what makes it safe against saves written
 * before this module existed and against saves written by a future wave that widens the
 * vocabulary: a non-object, an unknown kind, a non-finite or negative amount, or a missing
 * counterparty all yield null rather than a half-shaped record. Only the four declared
 * fields survive; anything else a spread carried in is dropped.
 *
 * @param {unknown} record
 * @returns {{ amount: number, kind: string, sinceTick: number, toPartyId: string }|null}
 */
export function normalizeContribution(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  const raw = /** @type {Record<string, unknown>} */ (record);
  const kind = String(raw.kind ?? '');
  if (!isContributionKind(kind)) return null;
  const toPartyId = String(raw.toPartyId ?? '');
  if (!toPartyId) return null;
  const amount = Number(raw.amount);
  if (!Number.isFinite(amount) || amount < 0) return null;
  const sinceTickRaw = Number(raw.sinceTick);
  if (!Number.isInteger(sinceTickRaw) || sinceTickRaw < 0) return null;
  return { amount, kind, sinceTick: sinceTickRaw, toPartyId };
}

/**
 * Normalize a whole ledger of credit records, dropping every row the record normalizer
 * refuses. Deterministic key order; a non-object ledger normalizes to an empty one.
 * @param {unknown} ledger
 * @returns {Record<string, { amount: number, kind: string, sinceTick: number, toPartyId: string }>}
 */
export function normalizeContributionLedger(ledger) {
  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) return {};
  const source = /** @type {Record<string, unknown>} */ (ledger);
  /** @type {Record<string, { amount: number, kind: string, sinceTick: number, toPartyId: string }>} */
  const next = {};
  for (const key of Object.keys(source).sort()) {
    const row = normalizeContribution(source[key]);
    if (row) next[key] = row;
  }
  return next;
}
