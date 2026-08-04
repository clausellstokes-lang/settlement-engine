/**
 * sovereigntyAssets.js — WR-10 amendment S: WHAT IS EVEN FOR SALE.
 *
 * "Only satellite edges and vassal edges are tradeable; sovereignty of a free
 * settlement is not a commodity (it can only be lost through the war machinery).
 * User-placed settlements obey the sovereign-hand law absolutely."
 *
 * THE SOVEREIGN-HAND LAW HAS NO CODE SPELLING, AND THE CURE IS THE SHAPE OF THIS
 * MODULE. A census of the tree finds no `userPlaced`, no `dmPlaced`, no
 * `isUserPlaced`, no `sovereignHand` — the law lives in three design volumes as
 * prose and nowhere as a field. An eligibility read written as a DENY-LIST ("tradeable
 * unless user-placed") would therefore have compiled, passed, and silently made every
 * DM-placed settlement in every campaign a commodity, because the flag it consulted
 * would always have been absent and absent reads as false.
 *
 * So eligibility is POSITIVE and derived from LEDGER MEMBERSHIP ONLY. A settlement is
 * tradeable exactly when the world's own records already say someone holds it: the
 * `satellites` spatial ledger names it as a parent's steading, or the `occupations`
 * ledger has climbed it to the `vassalized` rung. Everything else — including every
 * settlement a DM ever placed — is `free`, and free is not for sale. The sovereign
 * hand is obeyed not by checking for it but by never having a way to reach past it.
 *
 * THE VASSAL RUNG IS THE TOP OF THE OCCUPATION LADDER AND ONLY THAT. `contested`,
 * `unstable`, `extractive` and `stabilized` are occupations in progress; selling one
 * would be selling a fight rather than a holding, and the ladder's own arithmetic
 * (occupation.js's STATE_BENEFIT_SCALE, which yields ~0 at `contested`) already says a
 * fresh conquest is worth nothing to its holder. Only `vassalized` — the rung that
 * converts into a formal vassalage edge — is a thing a court can convey.
 *
 * PURE READ: no mutation, no rng, no wall-clock. It answers questions about a
 * worldState and writes nothing to it.
 */
import { satellitesLedgerOf, satellitesOf } from './settlementLifecycleKernel.js';

/** The closed eligibility vocabulary. Every answer, including every way of being
 *  ineligible, has a word — and `free` is a VERDICT, not a fallback. */
export const SOVEREIGNTY_ASSET_KINDS = Object.freeze([
  'unknown', 'satellite', 'vassal', 'free',
]);

/** The occupation rung that is conveyable. The rungs below it are fights in
 *  progress; see the header. Kept as a named constant so the coupling to
 *  occupation.js's STATE_LADDER is visible rather than a bare string in a branch. */
export const SOVEREIGNTY_CONVEYABLE_OCCUPATION_STATE = 'vassalized';

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/**
 * @typedef {Object} SovereigntyAssetRead
 * @property {string} assetId
 * @property {string} kind      a SOVEREIGNTY_ASSET_KINDS member
 * @property {boolean} tradeable
 * @property {string|null} holderId  the parent or overlord, when there is one
 * @property {string} receipt
 */

/**
 * WHAT KIND OF HOLDING IS THIS, AND MAY IT BE CONVEYED? Reads the two ledgers and
 * nothing else. A settlement absent from both is `free` — which is an ANSWER ("no one
 * holds it, so no one may sell it"), not a gap.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {unknown} assetId
 * @returns {SovereigntyAssetRead}
 */
export function readSovereigntyAsset(worldState, assetId) {
  const id = text(assetId);
  if (!id) {
    return {
      assetId: '',
      kind: 'unknown',
      tradeable: false,
      holderId: null,
      receipt: 'no holding was named, so none can be judged.',
    };
  }
  const world = recordOf(worldState);

  // 1) THE SATELLITE LEDGER. A steading is its parent's property outright.
  const ledger = satellitesLedgerOf(world);
  if (ledger) {
    for (const parentId of Object.keys(ledger).sort(codepoint)) {
      for (const satellite of satellitesOf(ledger, parentId)) {
        if (text(recordOf(satellite).id) !== id) continue;
        return {
          assetId: id,
          kind: 'satellite',
          tradeable: true,
          holderId: parentId,
          receipt: `${id} is a steading of ${parentId}, and a steading is property that may change hands.`,
        };
      }
    }
  }

  // 2) THE OCCUPATION LADDER, at its top rung only.
  const occupation = recordOf(recordOf(world.occupations)[id]);
  const occupierId = text(occupation.occupierId);
  if (occupierId) {
    const state = text(occupation.state);
    if (state === SOVEREIGNTY_CONVEYABLE_OCCUPATION_STATE) {
      return {
        assetId: id,
        kind: 'vassal',
        tradeable: true,
        holderId: occupierId,
        receipt: `${id} is a settled vassal of ${occupierId}, and a vassalage may be conveyed.`,
      };
    }
    return {
      assetId: id,
      kind: 'free',
      tradeable: false,
      holderId: occupierId,
      receipt: `${id} is an occupation of ${occupierId} still at '${state || 'no rung'}':`
        + ' a fight in progress is not a holding, and cannot be sold.',
    };
  }

  // 3) EVERYTHING ELSE. Including every settlement a DM ever placed.
  return {
    assetId: id,
    kind: 'free',
    tradeable: false,
    holderId: null,
    receipt: `${id} answers to no one, and the sovereignty of a free settlement is not a commodity.`,
  };
}

/**
 * EVERY HOLDING ONE COURT COULD PUT ON A TABLE, codepoint-ordered. The candidate set
 * is built by walking the ledgers rather than by filtering all settlements, which is
 * the same positive-derivation discipline the single read uses: a settlement this
 * function has never heard of can never appear in its output.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {unknown} holderId
 * @returns {ReadonlyArray<SovereigntyAssetRead>}
 */
export function tradeableAssetsOf(worldState, holderId) {
  const holder = text(holderId);
  if (!holder) return Object.freeze([]);
  const world = recordOf(worldState);
  /** @type {string[]} */
  const ids = [];

  const ledger = satellitesLedgerOf(world);
  for (const satellite of ledger ? satellitesOf(ledger, holder) : []) {
    const id = text(recordOf(satellite).id);
    if (id) ids.push(id);
  }

  const occupations = recordOf(world.occupations);
  for (const occupiedId of Object.keys(occupations).sort(codepoint)) {
    const record = recordOf(occupations[occupiedId]);
    if (text(record.occupierId) !== holder) continue;
    if (text(record.state) !== SOVEREIGNTY_CONVEYABLE_OCCUPATION_STATE) continue;
    ids.push(occupiedId);
  }

  return Object.freeze(
    [...new Set(ids)].sort(codepoint)
      .map((id) => readSovereigntyAsset(world, id))
      .filter((read) => read.tradeable),
  );
}
