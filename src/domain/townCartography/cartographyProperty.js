/**
 * townCartography/cartographyProperty.js — THE PROPERTY LINE, JOINED (MP-1).
 *
 * The owner's §494 directive: hovering a building must highlight THE PROPERTY LINE —
 * the ground the building stands on, yard and court included — and not the building.
 * §495 measured that the line already exists: a `CartographyParcelRow` has carried a
 * real `polygon` since TC-3b. cartographyPaint.js now PUBLISHES that ring as a
 * `parcel` op. This leaf answers the other half of the question, which is not a
 * drawing question at all: GIVEN A BUILDING A READER IS POINTING AT, WHICH PROPERTY
 * IS IT ON, AND WHAT ELSE STANDS ON IT.
 *
 * ── MEMBERSHIP NEEDS NO NEW RELATION (§495.3) ────────────────────────────────
 * Two structures are the same property iff they SHARE A `parcelId`. That is already
 * total: TC-4 packs every footprint INSIDE the carved parcel it was bound to, so a
 * building's `parcelId` is its property, and the set of rows carrying that id is the
 * property's membership. Nothing is stored, nothing is derived twice, and there is no
 * geometric test anywhere below — a compound is a JOIN, never a proximity guess.
 *
 * ── THE YARD IS THE RING MINUS ITS MEMBERS, AND NOTHING CLIPS ────────────────
 * `openGroundOf` returns the parcel ring together with its members' footprints as
 * HOLES. It performs no polygon algebra: `footprint ⊂ parcel` is a theorem
 * (cartographyParcels.js:11-20), so a ring plus its contained rings IS the open
 * ground under an even-odd fill, and the renderer does the subtraction exactly. A
 * boolean-difference routine here would be the clipping the ONE LAW keeps out of this
 * family, and it would be a second truth about a shape the theorem already fixes.
 *
 * ⚠ WHAT THIS LEAF DOES NOT KNOW, AND MUST NOT PRETEND TO. Open ground is not yet
 * TYPED: an enclosed COURT and an open YARD are the same subtraction here, and a
 * detached outbuilding does not exist in the model at all. Both are DW-1/DW-2's
 * typed `CompoundMember`. When they land, `membersOf` reads the typed member rows
 * INSTEAD of the parcel's building rows and `openGroundOf` reads the typed open-
 * ground member instead of subtracting — the RETURN SHAPES below do not move, so the
 * overlay that consumes them is re-pointed at a new INPUT rather than rebuilt.
 * (§495.5(3); the two-tier estate halo of §498.3/§519 is the same swap one level up:
 * `PropertyLine.ownerRef` joins to a POWER and the overlay draws the faint tier.)
 *
 * ── TOTAL, NEVER THROWING — AND WHY THAT IS NOT THE FAIL-OPEN THE PAINTER BANS ──
 * cartographyPaint.js refuses to narrow a malformed block, because there the block IS
 * the picture and an empty picture would be a lie. Here the block is an OVERLAY
 * SOURCE whose ordinary state is absent: the cartography rule is virtual and dark by
 * default, so "no property lines known" is the common case, not an error state. A
 * malformed block therefore yields an EMPTY index — the same visible result as a dark
 * one — while the painter still throws loudly on that same block on the sheet that
 * draws it. One loud reader, one quiet one, and no error is swallowed by both.
 *
 * Pure and headless: no store, no clock, no randomness, no I/O, no module-scope
 * mutable state, no PRNG draw, no float, no while/do loop, no colour, no SVG.
 *
 * @enforced-by tests/domain/townCartographyProperty.test.js
 */

/**
 * @typedef {import('./cartographyPlan.js').PlanPoint} PlanPoint
 * @typedef {{ parcelId: string, wardId: string, ring: PlanPoint[], memberIds: string[],
 *   memberFootprints: PlanPoint[][] }} PropertyLine
 * @typedef {{ ring: PlanPoint[], holes: PlanPoint[][] }} OpenGround
 */

/**
 * THE ONE SPELLING OF THE SEMANTIC-ID PREFIX, and the reason it is a constant.
 *
 * A cartography building row names its institution by `institutionRef`, which is the
 * manifest building's `semanticId`; buildingProfiles.js:443 mints that as the anchor
 * key behind this prefix. The 2D pane knows its buildings by ANCHOR KEY alone, so the
 * join has to cross the prefix somewhere. It crosses HERE, once, rather than at each
 * call site — and `tests/domain/townCartographyProperty.test.js` pins the agreement
 * against a real compiled manifest, so this constant cannot drift away from the
 * minting site in silence. A `slice(indexOf(':'))` would have spelled no prefix at
 * all and would also have accepted any other ref shape without a word.
 */
export const CARTOGRAPHY_INSTITUTION_REF_PREFIX = 'building:';

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {unknown[]} */
function rowsOf(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {unknown} value @returns {string} */
function textOf(value) {
  return typeof value === 'string' ? value : '';
}

/**
 * A ring of integer plan points, or an empty ring. A malformed vertex disqualifies
 * the whole ring rather than being repaired: half a boundary drawn confidently is
 * worse than none, and none is the state a reader already understands.
 * @param {unknown} value @returns {PlanPoint[]}
 */
function ringOf(value) {
  if (!Array.isArray(value) || value.length < 3) return [];
  /** @type {PlanPoint[]} */
  const ring = [];
  for (const point of value) {
    if (!Array.isArray(point) || point.length !== 2) return [];
    if (!Number.isInteger(point[0]) || !Number.isInteger(point[1])) return [];
    ring.push(/** @type {PlanPoint} */ ([point[0], point[1]]));
  }
  return ring;
}

/**
 * THE INDEX. One pass over the block's parcel and building layers, producing the
 * property lines and the two lookups a reader needs: by the parcel's own id, and by
 * the ANCHOR KEY the 2D pane speaks.
 *
 * A parcel with no ring is dropped rather than indexed with an empty one, so a
 * lookup either answers with a drawable boundary or answers `null`. That is the
 * §495.4(e) contract: a building whose parcel is absent from the block — which the
 * `PARCELS_PER_WARD` tier band makes ordinary — highlights itself alone, and the
 * overlay never invents a boundary to fill the gap.
 *
 * @param {unknown} cartography a compiled cartography block, or null/undefined
 * @returns {{ byParcelId: Map<string, PropertyLine>,
 *   byAnchorKey: Map<string, PropertyLine> }}
 */
export function buildPropertyLineIndex(cartography) {
  /** @type {Map<string, PropertyLine>} */
  const byParcelId = new Map();
  /** @type {Map<string, PropertyLine>} */
  const byAnchorKey = new Map();
  if (!isRecord(cartography)) return { byParcelId, byAnchorKey };

  for (const raw of rowsOf(cartography.parcels)) {
    if (!isRecord(raw)) continue;
    const parcelId = textOf(raw.id);
    const ring = ringOf(raw.polygon);
    if (!parcelId || ring.length === 0 || byParcelId.has(parcelId)) continue;
    byParcelId.set(parcelId, {
      parcelId,
      wardId: textOf(raw.wardId),
      ring,
      memberIds: [],
      memberFootprints: [],
    });
  }

  for (const raw of rowsOf(cartography.buildings)) {
    if (!isRecord(raw)) continue;
    const line = byParcelId.get(textOf(raw.parcelId));
    if (!line) continue;
    const id = textOf(raw.id);
    if (id) line.memberIds.push(id);
    const footprint = ringOf(raw.footprint);
    if (footprint.length > 0) line.memberFootprints.push(footprint);
    const ref = textOf(raw.institutionRef);
    if (ref.startsWith(CARTOGRAPHY_INSTITUTION_REF_PREFIX)) {
      const anchorKey = ref.slice(CARTOGRAPHY_INSTITUTION_REF_PREFIX.length);
      // FIRST WINS, deliberately. Multiplicity lets one canonical institution emit
      // several instances (cartographyBuildings.js:330), and the rows arrive in the
      // compiler's own deterministic order — so a last-wins map would make the
      // answer depend on how many instances happened to be emitted.
      if (anchorKey && !byAnchorKey.has(anchorKey)) byAnchorKey.set(anchorKey, line);
    }
  }

  return { byParcelId, byAnchorKey };
}

/**
 * THE PROPERTY A READER IS POINTING AT, or null when the block does not know one.
 *
 * @param {{ byAnchorKey: Map<string, PropertyLine> }|null|undefined} index
 * @param {unknown} anchorKey the 2D pane's own building key
 * @returns {PropertyLine|null}
 */
export function propertyLineForAnchor(index, anchorKey) {
  if (!index || typeof anchorKey !== 'string' || !anchorKey) return null;
  return index.byAnchorKey.get(anchorKey) ?? null;
}

/**
 * THE OPEN GROUND — the property's ring, and its members as holes. The subtraction is
 * the even-odd fill rule's, not this function's: see the header. Returned as plain
 * rings so the caller owns the serialization and this leaf owns no SVG.
 *
 * @param {PropertyLine|null|undefined} line
 * @returns {OpenGround|null}
 */
export function openGroundOf(line) {
  if (!line || !Array.isArray(line.ring) || line.ring.length === 0) return null;
  return { ring: line.ring, holes: line.memberFootprints.slice() };
}
