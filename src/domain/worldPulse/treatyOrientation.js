/**
 * treatyOrientation.js — WHO GIVES AND WHO RECEIVES (chair ruling CR-WR10-G).
 *
 * Every treaty this engine has ever minted was the end of a war, so every consumer
 * learned to read one pair of fields — `victorId` and `loserId` — and to spell the two
 * roles it needs out of them: the party that HANDS SOMETHING OVER, and the party that
 * RECEIVES it. WR-10's sovereignty market mints a treaty with no war in it at all. A
 * sale has a SELLER and a BUYER, and it has them for good reasons: naming the buyer a
 * "victor" would be a lie the ledger then carries forever, and leaving the war fields
 * absent turns every `String(treaty.victorId)` in the tree into the four-character
 * string `"undefined"` — which compiles, renders, and PERSISTS (peaceTerms' PASS 2
 * writes `defaultedBy` from exactly such a read, and a defaulted sale would have
 * accused a court literally named `undefined` of oathbreaking).
 *
 * So the orientation is READ ONCE, HERE, and every consumer asks this module instead of
 * spelling the fields itself. ONE reader, many consumers — the same discipline
 * `treatyEnforcement.js` was extracted for, and for the same reason: two spellings of
 * "who owes whom" would eventually disagree, and a treaty whose enforcement bound one
 * party while its receipts named the other is a peace nobody can reason about.
 *
 * ── THE TWO AXES, AND WHY THEY ARE NOT THE SAME AXIS ────────────────────────────
 *
 * THE CONVEYANCE AXIS — who hands the holding over:
 *   wartime   the LOSER gives, the VICTOR receives.
 *   sale      the SELLER gives, the BUYER receives.
 *
 * THE OBLIGATION AXIS — who bears the terms' burden:
 *   wartime   the LOSER pays; the tribute, the readiness cap and the ceded garrison
 *             all bind the defeated party.
 *   sale      the BUYER pays. The consideration flows to the seller — that is what
 *             makes it a sale rather than a confiscation — so on this axis the two
 *             roles are the MIRROR of the conveyance axis.
 *
 * Collapsing the two would have been the easy mistake and a silent one: a sale's stream
 * terms would have drawn grain out of the party that was owed it. The axes are
 * therefore separate fields with separate names, and the direction is pinned.
 *
 * `unknown` IS A REAL VERDICT. A treaty carrying neither pair resolves to empty strings
 * and `resolved: false` — never to a placeholder, never to `"undefined"`, and never to
 * one party silently standing in for the other. A caller that treats an unresolved
 * orientation as "this term binds nobody" is correct.
 *
 * PURE + ZERO IMPORTS. It is reached by `treatyEnforcement.js` — itself extracted to be
 * importable from anywhere in the war layer without closing a cycle — so it must be
 * able to close none of its own.
 */

/** The closed orientation vocabulary. `unknown` is a verdict, not a fallback. */
export const TREATY_ORIENTATION_KINDS = Object.freeze(['unknown', 'wartime', 'sale']);

/** The role words a party can hold in a treaty, per orientation kind. Closed, and
 *  exported so a display never invents a fifth. */
export const TREATY_ROLE_WORDS = Object.freeze({
  wartime: Object.freeze({ giver: 'the bound party', receiver: 'victor' }),
  sale: Object.freeze({ giver: 'the seller', receiver: 'the buyer' }),
  unknown: Object.freeze({ giver: 'a party', receiver: 'a party' }),
});

/** A string, or the empty string — NEVER `String(undefined)`. This one coercion is the
 *  whole needs-guard: every id and name below passes through it, so no consumer of this
 *  module can render or persist the literal `"undefined"`.
 *  @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * @typedef {Object} TreatyOrientation
 * @property {string} kind        a TREATY_ORIENTATION_KINDS member
 * @property {boolean} resolved   false ⇒ every id below is the empty string
 * @property {string} giverId     hands the holding over (wartime loser · sale seller)
 * @property {string} receiverId  acquires it (wartime victor · sale buyer)
 * @property {string} obligorId   bears the terms' burden (wartime loser · sale BUYER)
 * @property {string} obligeeId   is owed them (wartime victor · sale SELLER)
 * @property {string} giverName   the id when no name was recorded — never `undefined`
 * @property {string} receiverName
 * @property {string} obligorName
 * @property {string} obligeeName
 */

/** The unresolved orientation. Every field a caller might branch on is present and
 *  empty, so a `!orientation.resolved` guard and a `!orientation.obligorId` guard are
 *  the same guard. @returns {TreatyOrientation} */
function unresolvedOrientation() {
  return {
    kind: 'unknown',
    resolved: false,
    giverId: '',
    receiverId: '',
    obligorId: '',
    obligeeId: '',
    giverName: '',
    receiverName: '',
    obligorName: '',
    obligeeName: '',
  };
}

/**
 * READ ONE TREATY'S ORIENTATION.
 *
 * THE SALE FIELDS WIN WHEN THEY ARE BOTH PRESENT, and the order matters: a sale treaty
 * carries `sellerId`/`buyerId` and NOT the war pair (they are drop-when-absent under the
 * T4 byte-neutrality law — an absent key costs nothing, and a key set to null is still a
 * key and still a byte), so checking the sale pair first is what makes the war pair's
 * absence mean "this was never a war" rather than "this treaty is malformed". A record
 * carrying BOTH is read as a sale and its war pair ignored: the market is the newer
 * instrument, and a document that names a buyer has told you what it is.
 *
 * @param {Record<string, unknown> | null | undefined} treaty
 * @returns {TreatyOrientation}
 */
export function treatyOrientationOf(treaty) {
  const row = recordOf(treaty);
  const sellerId = text(row.sellerId);
  const buyerId = text(row.buyerId);
  if (sellerId && buyerId && sellerId !== buyerId) {
    const giverName = text(row.sellerName) || sellerId;
    const receiverName = text(row.buyerName) || buyerId;
    return {
      kind: 'sale',
      resolved: true,
      giverId: sellerId,
      receiverId: buyerId,
      // THE MIRROR (see the header's two-axes note): on a sale the BUYER pays.
      obligorId: buyerId,
      obligeeId: sellerId,
      giverName,
      receiverName,
      obligorName: receiverName,
      obligeeName: giverName,
    };
  }

  const loserId = text(row.loserId);
  const victorId = text(row.victorId);
  if (loserId && victorId && loserId !== victorId) {
    const giverName = text(row.loserName) || loserId;
    const receiverName = text(row.victorName) || victorId;
    return {
      kind: 'wartime',
      resolved: true,
      giverId: loserId,
      receiverId: victorId,
      obligorId: loserId,
      obligeeId: victorId,
      giverName,
      receiverName,
      obligorName: giverName,
      obligeeName: receiverName,
    };
  }

  return unresolvedOrientation();
}

/**
 * The word for one party's role in one treaty — 'victor' / 'the bound party' on a war
 * settlement, 'the buyer' / 'the seller' on a sale, 'a party' for anyone else. Exported
 * so the panels and the dossier speak the SAME four words the ledger's orientation
 * knows, instead of each deciding that a non-victor must be a loser.
 * @param {TreatyOrientation} orientation @param {unknown} partyId @returns {string}
 */
export function treatyRoleWord(orientation, partyId) {
  const id = text(partyId);
  const table = /** @type {Record<string, { giver: string, receiver: string }>} */ (TREATY_ROLE_WORDS);
  const words = table[String(orientation?.kind || '')] || TREATY_ROLE_WORDS.unknown;
  if (id && id === orientation?.receiverId) return words.receiver;
  if (id && id === orientation?.giverId) return words.giver;
  return TREATY_ROLE_WORDS.unknown.giver;
}
