/**
 * outboundImpression.js — SP-B: THE SECOND-ORDER HEURISTIC ("what do they likely believe
 * of us?"), derived from the OUTBOUND record and nothing else.
 *
 * ── WHY THIS IS A HEURISTIC OVER OUR OWN LEDGERS AND NOT A NESTED BELIEF MAP ────────
 *
 * A court that wants to know what a rival thinks of it has exactly one honest source: the
 * record of what it has SHOWN that rival. What it planted, what it sold or gifted, what it
 * shared as an ally, what it deliberately hid. Every one of those is already ledgered on
 * OUR side of the world — `spatialLedgers.disinfo` rows carry the band we asserted to a
 * named audience, `intelTransfers` carry what we handed over, the ally-intel pass carries
 * what we volunteered, the sight/secrecy postures carry what we sealed.
 *
 * THE ALTERNATIVE WOULD BE THE RECURSION LAW ONE FORBIDS. Reading the counterpart's own
 * belief record to answer "what do they believe of us" is not a model of a mind, it is
 * omniscience with an extra step — and it would make every court a perfect mind-reader of
 * every other court, which is the exact failure the belief partition exists to prevent. So
 * this module holds a ZERO-IMPORT contract and never receives a belief record at all: the
 * caller passes rows it has already read from OUR outbound ledgers, and the derivation
 * cannot reach a counterpart's beliefs even by accident. The structural pin is the whole
 * design, not a comment on it.
 *
 * ── IT MINTS NO VOCABULARY, DELIBERATELY ───────────────────────────────────────────
 *
 * The impression comes back shaped like a BELIEF RECORD — the same field names and the
 * same ladders the belief partition already speaks — because the one consumer this is
 * built for (IN-1's `mirrorOf`, behind `secondOrderBeliefEnabled`) wants to compare it
 * against a belief. A second-order vocabulary would be a second spelling of the first-order
 * one, which is the drift class the estate has counted fourteen instances of.
 *
 * ── NO FLAG, DARK BY CONSTRUCTION (J-SP-6) ─────────────────────────────────────────
 *
 * A pure read with no writer and no land-time consumer costs a campaign zero bytes on
 * every path, so it ships without a gate and INFO's consumers gate it when they arrive.
 * Adding `secondOrderBeliefEnabled` and its four-fence bill here would be paying for a
 * fence around an empty field. The lane-P precedent, and the SP architecture's ruling.
 *
 * ABSENCE IS A RESULT. No outbound evidence toward an observer yields NULL — not a
 * midpoint, not a guess. "We have shown them nothing, so we do not know what they think"
 * is the honest answer and the one a receipt can say out loud.
 *
 * PURE: no imports, no rng, no wall-clock, no mutation, no state. Deterministic over its
 * arguments, codepoint-ordered wherever order could leak.
 */

/**
 * How an outbound act shapes the picture. Ordered strongest-evidence-first for the
 * receipt; the derivation itself is order-independent (it takes the LATEST act per field).
 * @type {readonly string[]}
 */
export const OUTBOUND_CHANNELS = Object.freeze(['plant', 'transfer', 'share']);

/**
 * A plant we seeded in a named audience about ourselves.
 * @typedef {{ audienceId?: unknown, subjectId?: unknown, assertedBand?: unknown, seededTick?: unknown }} OutboundPlant
 */

/**
 * Intel we sold or gifted to a counterpart about ourselves (fidelity01 = how faithful the
 * handover was; 1 is the whole truth).
 * @typedef {{ toId?: unknown, subjectId?: unknown, strengthBand?: unknown, fidelity01?: unknown, tick?: unknown }} OutboundTransfer
 */

/**
 * Something we volunteered as an ally: a label we declared about ourselves.
 * @typedef {{ toId?: unknown, subjectId?: unknown, allianceLabel?: unknown, tick?: unknown }} OutboundShare
 */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asRecord(v) { return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {}; }

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) { return Array.isArray(v) ? v : []; }

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) { return typeof v === 'number' && Number.isFinite(v) ? v : fallback; }

/** @param {unknown} v @returns {string} */
function text(v) { return typeof v === 'string' ? v : ''; }

/**
 * Rows aimed at THIS observer about THIS subject (us), newest last. Ties broken by the
 * row's own codepoint identity so a same-tick pair cannot reorder between runs.
 * @param {unknown[]} rows @param {string} toKey @param {string} observerId @param {string} selfId
 * @returns {Record<string, unknown>[]}
 */
function aimedAt(rows, toKey, observerId, selfId) {
  const out = [];
  for (const raw of asArray(rows)) {
    const row = asRecord(raw);
    if (text(row[toKey]) !== observerId) continue;
    if (text(row.subjectId) !== selfId) continue;
    out.push(row);
  }
  return out.sort((a, b) => {
    const at = finiteNumber(a.tick ?? a.seededTick, 0);
    const bt = finiteNumber(b.tick ?? b.seededTick, 0);
    if (at !== bt) return at - bt;
    const ak = JSON.stringify(a);
    const bk = JSON.stringify(b);
    return ak < bk ? -1 : ak > bk ? 1 : 0;
  });
}

/**
 * WHAT THEY LIKELY BELIEVE OF US, from what we have shown them.
 *
 * The rule is deliberately blunt, because a subtle rule over this evidence would be
 * fiction: the LATEST act on a field is what they were last told, so that is what they
 * likely hold. A plant asserts a strength band outright. A faithful transfer hands over
 * the band we ourselves reported; an unfaithful one is still what they received, and the
 * fidelity rides on the receipt rather than silently bending the number — we know what we
 * sent, not how well they read it.
 *
 * A HIDE posture toward this observer does not change WHAT they believe; it changes how
 * OLD it is. That is carried as `sealed: true` on the receipt so a consumer can discount
 * for staleness with its own law rather than this file inventing a decay — the estate has
 * exactly one belief decay law and it lives in beliefMap.js.
 *
 * @param {Object} args
 * @param {string} args.selfId       the court forming the impression (the SUBJECT of it)
 * @param {string} args.observerId   the counterpart whose mind is being guessed
 * @param {OutboundPlant[]} [args.plants]        rows from OUR disinfo ledger
 * @param {OutboundTransfer[]} [args.transfers]  rows from OUR intel-transfer ledger
 * @param {OutboundShare[]} [args.shares]        rows from OUR ally-intel sharing pass
 * @param {boolean} [args.sealed]    a HIDE posture stands toward this observer
 * @returns {{ strengthBand?: number, allianceLabel?: string, basis: string[], sealed: boolean } | null}
 */
export function outboundImpressionOf({ selfId, observerId, plants = [], transfers = [], shares = [], sealed = false }) {
  const self = text(selfId);
  const observer = text(observerId);
  if (!self || !observer || self === observer) return null;

  const planted = aimedAt(plants, 'audienceId', observer, self);
  const handed = aimedAt(transfers, 'toId', observer, self);
  const told = aimedAt(shares, 'toId', observer, self);

  /** @type {{ strengthBand?: number, allianceLabel?: string, basis: string[], sealed: boolean }} */
  const impression = { basis: [], sealed: sealed === true };

  // STRENGTH — the latest thing we asserted about our own strength wins, whichever
  // channel carried it. A plant and a transfer on the same tick resolve by the channel
  // order above, which is stated rather than incidental: a lie we seeded is the louder
  // act, because we chose the number.
  const strengthActs = [
    ...handed.map((row) => ({ channel: 'transfer', tick: finiteNumber(row.tick, 0), band: finiteNumber(row.strengthBand, NaN), fidelity: finiteNumber(row.fidelity01, 1) })),
    ...planted.map((row) => ({ channel: 'plant', tick: finiteNumber(row.seededTick, 0), band: finiteNumber(row.assertedBand, NaN), fidelity: 1 })),
  ].filter((act) => Number.isFinite(act.band));
  if (strengthActs.length) {
    // Ascending tick, then WEAKEST channel first so the strongest lands last and the
    // `latest` read below picks it. OUTBOUND_CHANNELS is strongest-first, so the channel
    // comparator is deliberately inverted here — writing it the other way round is how a
    // same-tick tie silently resolves to the quieter act.
    strengthActs.sort((a, b) => (a.tick !== b.tick
      ? a.tick - b.tick
      : OUTBOUND_CHANNELS.indexOf(b.channel) - OUTBOUND_CHANNELS.indexOf(a.channel)));
    const latest = strengthActs[strengthActs.length - 1];
    impression.strengthBand = latest.band;
    impression.basis.push(`${latest.channel}:strengthBand`);
    if (latest.channel === 'transfer' && latest.fidelity < 1) impression.basis.push('transfer:partial');
  }

  // RELATIONSHIP — only an ally share declares one, and only the latest.
  const labelled = told.filter((row) => text(row.allianceLabel));
  if (labelled.length) {
    impression.allianceLabel = text(labelled[labelled.length - 1].allianceLabel);
    impression.basis.push('share:allianceLabel');
  }

  // NOTHING SHOWN, NOTHING KNOWN. A `sealed` posture alone is not evidence about their
  // picture; it is evidence we gave them none.
  if (!impression.basis.length) return null;
  impression.basis.sort();
  return impression;
}
