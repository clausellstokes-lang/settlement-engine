/**
 * captureSidecar.js — SEAM-3, THE PROVENANCE-STAMPED CAPTURE SIDECAR
 * (DESIGN_FMG_WEAVE §3 W-SEAM, ordered and versioned by A1.2.10; Q-W1 pre-ruled: the
 * sidecar SHIPS, pure additive, absent = byte-identical).
 *
 * ⭐ THE GAP THIS CLOSES IS NAMED IN THE TREE ITSELF. SEAM-2's re-resolution comment ends:
 * *"The receipts say 're-derived', never 'cured': no provenance stamp exists to prove the
 * pack in hand is the geometry these coordinates came from. That is SEAM-3."* SEAM-2 had
 * to INFER that a placement's stored x/y belong to the pack being captured, using the
 * WITNESS RULE — find one row whose stored cellId is reproduced by re-deriving from its
 * coordinates, and take that as evidence for every other row. That rule is sound but it is
 * evidence, not proof, and it has two failure modes it cannot see: a realm where NO row
 * can witness (every Instant World, whose placements all carry `cellId: null`), and a
 * coincidence where a stale id happens to reproduce.
 *
 * A sidecar replaces the inference with a RECORD. At capture we stamp what geometry we
 * actually held; at any later capture or headless re-canonize we compare the stamp instead
 * of guessing. The question "is this the same map?" stops being answered by archaeology.
 *
 * WHAT IT IS NOT. It is not a second digest and it does not seed anything. It answers ONE
 * question — is the pack in hand the geometry this canon was built against — and it says
 * so in typed words a receipt can carry.
 *
 * DORMANCY (raw-byte bar, A1.2.7). Purely additive: a canon with no sidecar keeps none,
 * every existing digest is byte-identical, and every comparison against an absent sidecar
 * returns the ABSENT verdict rather than a failure. Nothing here can refuse an old canon.
 *
 * ⛔ AN UNDER-VERSIONED SIDECAR EMITS A RECEIPT AND NEVER SILENTLY DEGRADES (A1.2.10, in
 * those words). The failure this forbids is the tempting one: read what you recognise from
 * an older stamp, ignore the rest, and proceed as though the comparison were complete. A
 * partial comparison that reports as a full one is worse than no comparison, because the
 * next reader trusts it.
 */
import { fnv1a32 } from '../../kernel/proseHash.js';

/**
 * The sidecar's own schema version (the sub-digest precedent A1.2.10 names). It moves
 * INDEPENDENTLY of the geometry/cost/overlay version axes: those record which LAWS built a
 * canon, this records which GEOMETRY was in hand.
 */
export const CAPTURE_SIDECAR_VERSION = 1;

/** The closed verdict vocabulary. A comparison returns exactly one of these. */
export const SIDECAR_VERDICTS = Object.freeze({
  /** No stamp stored — a canon frozen before this car. The witness rule still governs. */
  ABSENT: 'sidecar_absent',
  /** Stored stamp is older than this build understands. Receipted, never degraded. */
  UNDER_VERSIONED: 'sidecar_under_versioned',
  /** Stored stamp is NEWER than this build. Also receipted; we refuse to guess. */
  OVER_VERSIONED: 'sidecar_over_versioned',
  /** The pack in hand IS the geometry the stamp was taken from. */
  CONFIRMED: 'geometry_confirmed',
  /** Same lattice size, different positions — a re-graph of the same dimensions. */
  REGRAPHED: 'geometry_regraphed',
  /** A different lattice entirely. */
  CHANGED: 'geometry_changed',
  /** The pack in hand is unreadable, so nothing can be concluded either way. */
  UNREADABLE: 'geometry_unreadable',
});

/**
 * One cell centroid, in EITHER of the two spellings a pack may carry: the `[x, y]` pair
 * the raw FMG pack uses, or the `{ x, y }` record the normalized pack carries. Both are
 * read, and a missing entry is tolerated rather than refused — a stamp over a sparse
 * array is still a stamp, it simply hashes the gap.
 * @typedef {[number, number] | { x?: number, y?: number } | null | undefined} CellPoint
 */

/**
 * A captured pack as this module reads it — raw or normalized, and only the keys the
 * stamp actually touches. Everything is optional because `buildCaptureSidecar` answers
 * "unreadable" rather than throwing on a pack that carries none of them.
 * @typedef {{ cellCount?:number, p?:ArrayLike<CellPoint>, h?:ArrayLike<number>,
 *   cells?:{ p?:ArrayLike<CellPoint>, h?:ArrayLike<number> } }} CapturedPack
 */

/**
 * The stamp itself. The four leading fields are REQUIRED because `buildCaptureSidecar`
 * always writes all four; the frame fields are additive-when-known (a key that is absent
 * means "not observed", never "observed as nothing").
 * @typedef {{ version:number, cellCount:number, positionHash:string|null,
 *   heightHash:string|null, graphWidth?:number, graphHeight?:number,
 *   mapSeed?:string, mapKind?:string }} CaptureSidecar
 */

/**
 * What a comparison OBSERVED, for a reader who wants the numbers behind the verdict
 * rather than the verdict alone. Both halves are optional: the version doors return
 * before any field is read, so their detail is legitimately empty.
 * @typedef {{ cellCount?:{ stored:number, current:number },
 *   positionHash?:{ stored:string|null, current:string|null } }} SidecarComparisonDetail
 */

/** 8-hex FNV-1a-32 of a string. */
const hex = (/** @type {string} */ s) => fnv1a32(s).toString(16).padStart(8, '0');

/**
 * Hash a numeric cell array to a stable 8-hex stamp.
 *
 * Values are joined with a delimiter rather than concatenated: without one, the arrays
 * [1, 23] and [12, 3] render the same characters and stamp identically, which is precisely
 * the collision a provenance stamp must not have.
 * @param {ArrayLike<number>|null|undefined} arr
 * @param {number} count how many leading entries participate
 */
function hashCells(arr, count) {
  if (!arr || !count) return null;
  let s = '';
  for (let i = 0; i < count; i++) {
    const v = arr[i];
    s += (v === undefined || v === null ? '' : String(v)) + ',';
  }
  return hex(s);
}

/**
 * Hash the cell CENTROIDS — the geometry a stored coordinate actually resolves against.
 * `cells.p` is an array of [x, y] pairs; both halves participate, because a pack whose
 * points moved only in y would otherwise stamp identically to one that never moved.
 * @param {ArrayLike<CellPoint>|null|undefined} points
 * @param {number} count
 */
function hashPoints(points, count) {
  if (!points || !count) return null;
  let s = '';
  for (let i = 0; i < count; i++) {
    const p = points[i];
    if (Array.isArray(p)) s += `${p[0]},${p[1]};`;
    else if (p && typeof p === 'object') s += `${p.x},${p.y};`;
    else s += ';';
  }
  return hex(s);
}

/**
 * Build the provenance stamp for a captured pack.
 *
 * @param {CapturedPack|null|undefined} pack a captured pack, raw or normalized — both
 *        shapes are read, and an absent one is answered rather than refused
 * @param {{ graphWidth?:number, graphHeight?:number, mapSeed?:string, mapKind?:string }} [frame]
 *        the coordinate frame and map plan, when the caller can observe them. TOLERATED
 *        ABSENT (the CAP-1 posture A1.2.10 names): a stamp without them is still a valid
 *        stamp, it simply answers fewer questions.
 * @returns {CaptureSidecar | null} null when the pack is unreadable
 */
export function buildCaptureSidecar(pack, frame = {}) {
  const points = pack?.cells?.p ?? pack?.p;
  const heights = pack?.cells?.h ?? pack?.h;
  const count = Number.isFinite(pack?.cellCount) && Number(pack?.cellCount) > 0
    ? Number(pack?.cellCount)
    : (heights?.length || points?.length || 0);
  if (!count) return null;
  return {
    version: CAPTURE_SIDECAR_VERSION,
    cellCount: count,
    positionHash: hashPoints(points, count),
    heightHash: hashCells(heights, count),
    // Additive-when-known, exactly like the digest's own optional keys: a key that is
    // absent means "not observed", never "observed as nothing".
    ...(Number.isFinite(frame?.graphWidth) ? { graphWidth: Number(frame.graphWidth) } : {}),
    ...(Number.isFinite(frame?.graphHeight) ? { graphHeight: Number(frame.graphHeight) } : {}),
    ...(frame?.mapSeed ? { mapSeed: String(frame.mapSeed) } : {}),
    ...(frame?.mapKind ? { mapKind: String(frame.mapKind) } : {}),
  };
}

/**
 * Compare a STORED stamp against the pack now in hand.
 *
 * @param {CaptureSidecar|null|undefined} stored the sidecar frozen with the canon (or absent)
 * @param {CapturedPack|null|undefined} pack the pack being captured now
 * @returns {{ verdict:string, storedVersion:number|null, matched:boolean,
 *   detail:SidecarComparisonDetail }}
 */
export function compareCaptureSidecar(stored, pack) {
  // `storedVersion` is annotated rather than left to inference: a `= null` default infers
  // the type `null`, and every caller below that reports a REAL version would then be
  // handing a number to a null-only parameter. The default is a fallback, not the domain.
  const none = (
    /** @type {string} */ verdict,
    /** @type {number|null} */ storedVersion = null,
    /** @type {SidecarComparisonDetail} */ detail = {},
  ) => (
    { verdict, storedVersion, matched: false, detail }
  );
  if (!stored || typeof stored !== 'object') return none(SIDECAR_VERDICTS.ABSENT);

  const storedVersion = Number.isFinite(stored.version) ? Number(stored.version) : null;
  // ⛔ VERSION IS CHECKED BEFORE ANY FIELD IS READ. Comparing the fields we happen to
  // recognise from an unknown schema and reporting the result as a verdict is the exact
  // "silent degradation" A1.2.10 forbids — the receipt would look complete and would not be.
  if (storedVersion === null || storedVersion < CAPTURE_SIDECAR_VERSION) {
    return none(SIDECAR_VERDICTS.UNDER_VERSIONED, storedVersion);
  }
  if (storedVersion > CAPTURE_SIDECAR_VERSION) {
    return none(SIDECAR_VERDICTS.OVER_VERSIONED, storedVersion);
  }

  const current = buildCaptureSidecar(pack);
  if (!current) return none(SIDECAR_VERDICTS.UNREADABLE, storedVersion);

  const detail = {
    cellCount: { stored: stored.cellCount, current: current.cellCount },
    positionHash: { stored: stored.positionHash ?? null, current: current.positionHash },
  };
  if (stored.cellCount !== current.cellCount) {
    return { verdict: SIDECAR_VERDICTS.CHANGED, storedVersion, matched: false, detail };
  }
  if (stored.positionHash && current.positionHash && stored.positionHash === current.positionHash) {
    return { verdict: SIDECAR_VERDICTS.CONFIRMED, storedVersion, matched: true, detail };
  }
  return { verdict: SIDECAR_VERDICTS.REGRAPHED, storedVersion, matched: false, detail };
}

/**
 * The receipt row a comparison contributes, or null when there is nothing to say.
 *
 * A CONFIRMED match writes NO row. That is the dormancy discipline the whole capture
 * receipt already follows: a receipt exists to record what a reader would want to know,
 * and "everything was exactly as recorded" is the case a reader assumes. Writing it would
 * put a key on every future canon to say nothing happened.
 * @param {ReturnType<typeof compareCaptureSidecar>} comparison
 */
export function sidecarReceiptRow(comparison) {
  if (!comparison || comparison.verdict === SIDECAR_VERDICTS.CONFIRMED) return null;
  if (comparison.verdict === SIDECAR_VERDICTS.ABSENT) return null;
  return {
    reason: comparison.verdict,
    storedVersion: comparison.storedVersion,
    expectedVersion: CAPTURE_SIDECAR_VERSION,
  };
}
