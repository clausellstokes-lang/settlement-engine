/**
 * lib/scribeGround.js — THE GROUND A RENDERED UNIT STANDS ON, as one comparable string.
 *
 * A Scribe unit is lawful for a town only while the facts it was written against still hold. The
 * town card (`domain/prose/townCard.js`) already harvests exactly those facts per pool, so the
 * ground is a projection of the card rather than a second opinion about what matters.
 *
 * WHAT IS IN THE GROUND (per pool): the drawn variant and the face it drew, the variant's angle
 * and marks, the sources the faces spoke through and the roles each of those sources seats, the
 * slot fills and their verb agreement, the piece roster, and the compromised roll's outcome.
 * Folded into every pool's ground is the TOWN's own roster — its sources, its seated roles, its
 * live institutions and their services, its compromised sources, its tier and culture — because
 * the referent scan (floor 1) convicts a unit that names a body or an office the town does not
 * hold, and those are town facts rather than pool facts.
 *
 * WHAT IS DELIBERATELY OUT: the corpus unit's own text (identical on both sides by
 * construction), the static card's codebase properties (a property of the build, not the town),
 * and the mount and section (where the line sits on the page, not what it asserts).
 *
 * ⚠ THE STATIC CARD IS NOT LOADED HERE, so the frozen FIELD VALUES are not in the comparison.
 * That is a deliberate omission, not an oversight: the static card is a 413 KB document and
 * loading it to decide a rare carry would put it in a product chunk for nothing. The omission is
 * safe in the fail-closed direction because the seed changes on a full generate, and the drawn
 * `vid` is `hashKey(seed::blockId::poolKey::v<n>)`, so essentially every pool's ground already
 * differs unless a lock froze it. The carry errs toward the corpus, never toward stale prose.
 *
 * This module is LAZY by contract: it imports the town card, which pulls the six generated prose
 * leaves, and must never enter the first-paint closure. Its one caller reaches it through a
 * dynamic import on a path that is dormant unless the replaced town actually carries prose.
 */

import { carryProseThroughGenerate } from './scribeArtefact.js';

/** Stable JSON for a card fragment. The card is already key-sorted, so this is byte-stable. */
const fix = (value) => JSON.stringify(value ?? null);

/**
 * The town-level half of the ground: what floor 1 measures a named body or office against.
 * @param {object} card @returns {string}
 */
function townGroundOf(card) {
  const town = card?.town || {};
  return fix([
    town.tier, town.culture, town.sources, town.roles,
    town.institutions, town.compromised, town.forceBuckets, town.armedForces,
  ]);
}

/**
 * The ground rows of one settlement, one row per pool that fires on any tab.
 * @param {object} settlement
 * @param {{townCard: Function, tabs: ReadonlyArray<string>, audience?: string}} deps
 * @returns {Array<{blockId: string, poolKey: string, ground: string}>}
 */
export function groundRowsFromCards(settlement, deps) {
  /** @type {Map<string, {blockId: string, poolKey: string, ground: string}>} */
  const rows = new Map();
  for (const tab of deps.tabs) {
    const card = deps.townCard(settlement, { tab, audience: deps.audience || 'dm' });
    const townGround = townGroundOf(card);
    for (const pool of Array.isArray(card?.pools) ? card.pools : []) {
      const key = `${pool.blockId}::${pool.poolKey}`;
      if (rows.has(key)) continue;
      rows.set(key, {
        blockId: String(pool.blockId || ''),
        poolKey: String(pool.poolKey || ''),
        ground: fix([
          townGround,
          pool.vid, pool.authoredIndex, pool.face, pool.angle, pool.marks,
          pool.faceSources, pool.faceRoles, pool.pairKinds, pool.pieces,
          pool.slots, pool.compromised,
        ]),
      });
    }
  }
  return [...rows.values()];
}

/**
 * ⭐ THE LOCKED CARRY, wired. Returns `fresh` unchanged (same reference) whenever nothing
 * carries, which is every generate with no lock set and every generate whose ground moved.
 *
 * @param {object|null|undefined} prev the settlement being replaced
 * @param {object} fresh the settlement just generated
 * @param {unknown} locks the lock map
 * @returns {Promise<object>}
 */
export async function carryProseAcrossGenerate(prev, fresh, locks) {
  const { townCard } = await import('../domain/prose/townCard.js');
  const { SCRIBE_TABS } = await import('../domain/prose/scribePage.js');
  return carryProseThroughGenerate(
    prev,
    fresh,
    locks,
    (settlement) => groundRowsFromCards(settlement, { townCard, tabs: SCRIBE_TABS }),
  );
}
