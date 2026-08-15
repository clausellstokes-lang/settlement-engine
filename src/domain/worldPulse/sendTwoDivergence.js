/**
 * sendTwoDivergence.js — WR-7d: the traitor's signature, and the seat that did
 * or did not look for it.
 *
 * Amendment Q gives the world one honest channel and then corrupts it. K.2 hands
 * the envoy the TRUE picture of his own realm because he must carry it; K3
 * forbids everyone else from ever holding truth. So treachery transmits what
 * loyalty cannot, and a compromised envoy is the only leak in the model that
 * moves real facts.
 *
 * SEND-TWO is the counter-intelligence answer, and it costs nothing to state:
 * send two people to one parlay and compare what they say. Two honest envoys
 * who sat in the same tent AGREE. Divergent accounts of ONE parlay are the
 * traitor's signature — and the detector is not new machinery, it is the
 * corroboration ladder WR-7c already built. This leaf adds only the question
 * the ladder does not itself ask: were these accounts of the SAME parlay, and
 * therefore is their disagreement a fact about the world or a fact about a man?
 *
 * J-INF-15, DISCHARGED HERE. The shared corroboration-divergence reader has ONE
 * home, declared at build time, and this is it: WR-7d built first, so the
 * information volume's SEND-TWO verb (IN-3) consumes THIS reader rather than
 * forking a second one. If a future INFO wave needs a wider signal, it extends
 * this module; it does not re-implement it.
 *
 * PURE: no world state, no writer, no RNG, no clock.
 */

// The ladder itself, from the leaf that owns it. `envoyTestimony.js` imports
// NOTHING, so reaching it cannot widen this module's K3 reach — the same
// reviewed reasoning the ratification vote's vocabulary import records.
import { TESTIMONY_LADDER, testimonyRungOf } from './envoyTestimony.js';

/** What a send-two comparison concluded. Closed; `agreed` is a real answer. */
export const SEND_TWO_VERDICTS = Object.freeze([
  'agreed', 'diverged', 'not_a_send_two',
]);

/** How hard the seat looked before it handed a man the realm's true picture. */
export const VETTING_QUALITIES = Object.freeze(['hurried', 'careful']);

/** What the seat's own records say about a volunteer's loyalty. Closed. */
export const VOLUNTEER_LOYALTY_BANDS = Object.freeze(['suspect', 'uncertain', 'proven']);

/** Known ties to a foreign patron. Closed; `none` is an absence, not a silence. */
export const VOLUNTEER_TIE_BANDS = Object.freeze(['none', 'known', 'close']);

/** Why a volunteer was refused or accepted. Closed. */
export const VETTING_BASES = Object.freeze([
  'loyalty', 'foreign_tie', 'no_time_to_look', 'nothing_found',
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function strictText(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value ? value : '';
}

/** @param {unknown} value @param {readonly string[]} vocabulary @returns {string} */
function closedValue(value, vocabulary) {
  return typeof value === 'string' && vocabulary.includes(value) ? value : '';
}

/** @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * THE READER. Given a graded testimony read and the encounter the seat believes
 * those envoys both attended, decide whether their disagreement is a signature.
 *
 * The distinction that makes this honest: two envoys who attended DIFFERENT
 * parlays may disagree about the world without either lying, so a divergence
 * claim requires the same encounter on every account. An account from another
 * encounter is not counter-evidence — it is not evidence at all, and it is
 * reported as excluded rather than silently dropped.
 *
 * The reader never names a traitor. It names a DIVERGENCE and the accounts that
 * carry it, at the ladder rung each was already graded to; which of two men lied
 * is a question the ruler answers with `selectBelievedAccount`, as character,
 * and exposure runs the covert→revealed seam that this leaf does not own.
 *
 * @param {{testimony?:unknown, encounterId?:unknown, attendedBy?:unknown}} args
 * @returns {Record<string, unknown>}
 */
export function readSendTwoDivergence({ testimony, encounterId, attendedBy } = {}) {
  /** @param {string} reason */
  const unread = (reason) => ({
    verdict: '',
    reason,
    encounterId: '',
    accounts: [],
    excludedAccountIds: [],
    digests: [],
    topRung: '',
    signature: false,
  });
  const read = recordOf(testimony);
  const encounter = strictText(encounterId);
  if (read.reason !== 'graded' || !Array.isArray(read.accounts)) return unread('invalid_testimony');
  if (!encounter) return unread('invalid_encounter');
  const attended = Array.isArray(attendedBy)
    ? [...new Set(attendedBy.map(strictText).filter(Boolean))]
    : [];
  if (attended.length < 2) return unread('not_a_send_two');
  const rows = /** @type {Array<Record<string, unknown>>} */ (read.accounts);
  const inScope = rows.filter((row) => attended.includes(String(row.npcId)));
  const excluded = rows
    .filter((row) => !attended.includes(String(row.npcId)))
    .map((row) => String(row.id))
    .sort(codepoint);
  // A send-two that came home as a send-one is not evidence of anything: the
  // second man may be dead, held, or still on the road, and a court that read
  // silence as proof of treachery would convict the unlucky.
  if (inScope.length < 2) {
    return {
      ...unread('only_one_account_returned'),
      verdict: 'not_a_send_two',
      encounterId: encounter,
      excludedAccountIds: excluded,
    };
  }
  const ordered = [...inScope].sort((left, right) => codepoint(String(left.id), String(right.id)));
  const digests = [...new Set(ordered.map((row) => String(row.sheetDigest)))].sort(codepoint);
  const diverged = digests.length > 1;
  // The rung the divergence sits at. Two CORROBORATED accounts contradicting
  // each other is a far louder signal than two pieces of tavern talk, and the
  // seat should be told which it has.
  const topRung = TESTIMONY_LADDER[
    Math.min(...ordered.map((row) => testimonyRungOf(row.rung)))
  ];
  return {
    verdict: diverged ? 'diverged' : 'agreed',
    reason: 'compared',
    encounterId: encounter,
    accounts: ordered.map((row) => ({
      id: String(row.id),
      npcId: String(row.npcId),
      sheetDigest: String(row.sheetDigest),
      rung: String(row.rung),
    })),
    excludedAccountIds: excluded,
    digests,
    topRung,
    // ONE parlay, two stories: somebody in that tent is lying about it. The
    // reader says that much and stops — naming which one is the ruler's act.
    signature: diverged,
  };
}

/**
 * THE VETTING, which is a seat decision and therefore a character decision.
 *
 * A careful seat reads what it already holds — the volunteer's loyalty record
 * and his known ties — and refuses a man who reads badly. A hurried seat takes
 * the volunteer, because somebody has to go and he offered. Both arms are real
 * and both are reachable: this is not a check that a competent court passes and
 * an incompetent one fails, it is a choice about how much delay a court can
 * afford, and Q's whole betrayal depends on the hurried arm existing.
 *
 * The seat reads ONLY its own records. A `suspect` loyalty band is what the
 * court believes, not what is true — a well-run treachery reads `proven`.
 *
 * @param {{quality?:unknown, volunteer?:unknown}} args
 * @returns {{accepted:boolean, quality:string, basis:string, reason:string}}
 */
export function vetVolunteerEnvoy({ quality, volunteer } = {}) {
  /** @param {string} reason */
  const refusal = (reason) => ({
    accepted: false, quality: '', basis: '', reason,
  });
  const care = closedValue(quality, VETTING_QUALITIES);
  const row = recordOf(volunteer);
  const npcId = strictText(row.npcId);
  const loyaltyBand = closedValue(row.loyaltyBand, VOLUNTEER_LOYALTY_BANDS);
  const foreignTieBand = closedValue(row.foreignTieBand, VOLUNTEER_TIE_BANDS);
  if (!care) return refusal('invalid_quality');
  if (!npcId || !loyaltyBand || !foreignTieBand) return refusal('invalid_volunteer');
  if (care === 'hurried') {
    // The court does not look. Nothing about the man changes; only whether
    // anybody read him before handing him the realm's true picture.
    return {
      accepted: true, quality: care, basis: 'no_time_to_look', reason: 'vetted',
    };
  }
  if (foreignTieBand === 'close') {
    return { accepted: false, quality: care, basis: 'foreign_tie', reason: 'vetted' };
  }
  if (loyaltyBand === 'suspect') {
    return { accepted: false, quality: care, basis: 'loyalty', reason: 'vetted' };
  }
  return { accepted: true, quality: care, basis: 'nothing_found', reason: 'vetted' };
}
