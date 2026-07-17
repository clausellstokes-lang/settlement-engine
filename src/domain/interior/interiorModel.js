/**
 * domain/interior/interiorModel.js — THE KEYED SCALE interior render model (DOOR 3).
 *
 * `buildInteriorModel(settlement, institution, opts)` is a PURE, view-time PROJECTION
 * of an institution — a third scale below the town map, derived the same way everything
 * else is: deterministic from `${seed}::interior:v1:<institutionId>`, no engine coupling,
 * no persisted interior state. It emits normalized 0..1000 vector geometry (numbers
 * only, no rendering) that interiorDraw.js paints and interiorExport.js walls into a
 * UVTT scene. An institution that changes hands re-derives its interior on the NEXT mint
 * (projections have no lifecycle ghost-writes by construction); cosmetic edits ride a
 * scoped sidecar (interiorEdits.js) and survive re-derivation via the edits-delta law.
 *
 * THE CONSTITUTIONAL LAWS this file holds:
 *   • ENVELOPE — the interior fits the building's map footprint (interiorFootprint.js):
 *     the outer walls ⊆ the derived footprint bounds and the entrance sits on the
 *     map-facing edge (the town map and the interior never disagree).
 *   • FACET GRAMMAR — the room set is chosen through the ONE facet chokepoint
 *     (interiorTemplates.js): declared ?? inferred ?? kind-default, so a custom
 *     institution gets an interior for free and an absent facet is byte-identical.
 *   • SEMANTIC FURNISHING — prosperity scales the envelope + density; a REVEALED
 *     corruption impairment adds a visible evidence room (a public scandal); a COVERT
 *     one adds a concealed DM-only chamber that NEVER touches the visible geometry and
 *     is scrubbed from every public projection (the covert-scrub precedent, fail-closed).
 *   • DETERMINISM — integer geometry only (round/min/max), a canonical south-entrance
 *     frame rotated by whole quarter-turns to the map-facing edge (no trig), fixed
 *     output key order ⇒ byte-identical JSON per (settlement, institution, opts).
 *
 * PURITY: no Date / Math.random / localeCompare (pinned by interiorPurity.test.js).
 */

import { createPRNG } from '../../kernel/prng.js';
import { clamp } from '../../kernel/math.js';
import { anchorForInstitution } from '../townMap/anchors.js';
import {
  interiorKindOf, interiorFunctionOf, resolveRoomSet, tierIndexOf,
} from './interiorTemplates.js';
import { deriveBuildingFootprint } from './interiorFootprint.js';

const VIEW = 1000;
const MARGIN = 60;
export const INTERIOR_VERSION = 1;

/**
 * The institution view an interior reads. A superset of the map's AnchorableInstitution
 * (catalogId / localUid / name) plus the facet + corruption-exposure fields — all
 * optional, tolerant of a genre-blind custom entity. `unknown` where the shape is loose.
 * @typedef {Object} InteriorInstitution
 * @property {string} [name] @property {string} [catalogId] @property {string} [localUid]
 * @property {string} [category] @property {string[]} [tags]
 * @property {Record<string, unknown>} [facets]
 * @property {Array<{ type?: string, covert?: boolean }>} [impairments]
 */
/**
 * The settlement view an interior reads (seed + tier scale + the furnishing signals).
 * @typedef {Object} InteriorSettlement
 * @property {string|number|null} [_seed] @property {string|number|null} [id]
 * @property {string|null} [tier] @property {number|null} [population]
 * @property {{ faithProfile?: { piety?: { localMult?: number } } }|null} [config]
 * @property {{ prosperity?: string|{ label?: string, tier?: string }|null }|null} [economicState]
 * @property {unknown[]} [institutions] @property {unknown} [defenseProfile]
 * @property {unknown} [spatialLayout] @property {unknown} [mapEdits] @property {unknown} [urbanFabric]
 */

/** A settlement's prosperity as 0..1 — the same bounded read as townLayoutV2 (the
 *  prosperous tavern IS bigger). @param {InteriorSettlement} s @returns {number} */
function prosperityScore(s) {
  const p = s?.economicState?.prosperity;
  const label = typeof p === 'string' ? p : (p ? (p.label || p.tier) : '');
  const t = String(label || '').toLowerCase();
  if (/opulent|wealthy|rich|prosperous/.test(t)) return 0.9;
  if (/comfortable|modest|stable/.test(t)) return 0.5;
  if (/poor|destitute|struggling|failing/.test(t)) return 0.2;
  return 0.5;
}

/**
 * An institution's corruption exposure, read from its own `impairments`. A corruption
 * impairment with `covert !== true` is REVEALED (a public scandal); one that is only
 * `covert === true` is HIDDEN DM state. In publicSafe mode covert impairments are NEVER
 * read (fail-closed — the covert chamber cannot be generated at all).
 * @param {InteriorInstitution} inst @param {boolean} publicSafe
 * @returns {{ revealed: boolean, covert: boolean }}
 */
function readCorruption(inst, publicSafe) {
  const imps = Array.isArray(inst?.impairments) ? inst.impairments : [];
  let revealed = false;
  let covert = false;
  for (const imp of imps) {
    if (!imp || imp.type !== 'corruption') continue;
    if (imp.covert !== true) revealed = true;
    else if (!publicSafe) covert = true;
  }
  return { revealed, covert };
}

/** High-faith signal (bumps sanctuary/nave furnishing for a faith interior). Reads the
 *  pulse-projected piety, tolerant of absence (absence ≠ neutrality → false).
 *  @param {InteriorSettlement} s @returns {boolean} */
function readFaithHigh(s) {
  const mult = s?.config?.faithProfile?.piety?.localMult;
  return typeof mult === 'number' && Number.isFinite(mult) && mult >= 1.15;
}

/** Rotate a point by `rot` quarter-turns clockwise about the VIEW center.
 *  Integer-exact (no trig), cross-machine stable.
 *  @param {number} x @param {number} y @param {number} rot @returns {[number, number]} */
function rotPoint(x, y, rot) {
  switch (rot & 3) {
    case 1: return [VIEW - y, x];
    case 2: return [VIEW - x, VIEW - y];
    case 3: return [y, VIEW - x];
    default: return [x, y];
  }
}

/** @typedef {{ x1:number, y1:number, x2:number, y2:number }} Seg */
/** @typedef {{ x:number, y:number, w:number, h:number }} Rect */

/** Split a vertical segment (x fixed) by a centered door gap; returns 0–2 sub-segments.
 *  @param {number} x @param {number} ya @param {number} yb @param {number} doorW @returns {Seg[]} */
function splitVertical(x, ya, yb, doorW) {
  const mid = Math.round((ya + yb) / 2);
  const half = Math.round(doorW / 2);
  const a = { x1: x, y1: ya, x2: x, y2: mid - half };
  const b = { x1: x, y1: mid + half, x2: x, y2: yb };
  /** @type {Seg[]} */
  const out = [];
  if (a.y2 > a.y1) out.push(a);
  if (b.y2 > b.y1) out.push(b);
  return out;
}
/** Split a horizontal segment (y fixed) by a door gap centered at `cx`.
 *  @param {number} y @param {number} xa @param {number} xb @param {number} cx @param {number} doorW
 *  @returns {Seg[]} */
function splitHorizontal(y, xa, xb, cx, doorW) {
  const half = Math.round(doorW / 2);
  const a = { x1: xa, y1: y, x2: cx - half, y2: y };
  const b = { x1: cx + half, y1: y, x2: xb, y2: y };
  /** @type {Seg[]} */
  const out = [];
  if (a.x2 > a.x1) out.push(a);
  if (b.x2 > b.x1) out.push(b);
  return out;
}

/**
 * @typedef {Object} InteriorRoom
 * @property {string} id @property {string} kind @property {'front'|'back'} band
 * @property {number} x @property {number} y @property {number} w @property {number} h
 * @property {true} [covert]
 */
/**
 * @typedef {Object} InteriorFurnishing
 * @property {string} id @property {string} kind @property {string} roomId
 * @property {number} x @property {number} y @property {number} w @property {number} h
 * @property {true} [covert]
 */
/** @typedef {{ x1:number, y1:number, x2:number, y2:number, covert?:true }} InteriorWall */
/** @typedef {{ x1:number, y1:number, x2:number, y2:number, kind:'entrance'|'internal'|'concealed', covert?:true }} InteriorDoor */
/**
 * @typedef {Object} InteriorMeta
 * @property {string} institutionId @property {string} kind @property {string|null} functionVariant
 * @property {number} tierIndex @property {'landmark'|'derived'} source @property {number} entranceSide
 * @property {number} widthCells @property {number} depthCells @property {number} prosperity01
 * @property {number} roomCount @property {boolean} hasEvidenceRoom @property {boolean} hasConcealed
 * @property {boolean} publicSafe
 */
/**
 * @typedef {Object} InteriorModel
 * @property {number} interiorVersion @property {string} seedFork @property {InteriorMeta} meta
 * @property {Rect} bounds @property {InteriorRoom[]} rooms @property {InteriorWall[]} walls
 * @property {InteriorDoor[]} doors @property {InteriorFurnishing[]} furnishings
 */

/**
 * Build the interior render model. Pure; never mutates its inputs.
 * @param {InteriorSettlement} settlement
 * @param {InteriorInstitution} institution   the institution object (or a resolved building's institution)
 * @param {{ publicSafe?: boolean }} [opts]
 * @returns {InteriorModel}
 */
export function buildInteriorModel(settlement, institution, opts = {}) {
  const publicSafe = opts.publicSafe === true;
  const inst = institution || /** @type {InteriorInstitution} */ ({});
  const s = settlement || /** @type {InteriorSettlement} */ ({});
  const institutionId = anchorForInstitution(inst);
  const seed = String(s._seed ?? s.id ?? 'interior-seedless');
  const seedFork = `${seed}::interior:v1:${institutionId}`;
  const rng = createPRNG(seedFork);

  const kind = interiorKindOf(inst);
  const fnKey = interiorFunctionOf(inst);
  const tierIndex = tierIndexOf(s);
  const prosperity01 = prosperityScore(s);
  const corruption = readCorruption(inst, publicSafe);
  const faithHigh = readFaithHigh(s);

  const footprint = deriveBuildingFootprint(s, institutionId, kind, tierIndex, prosperity01);

  // ── the room set: base (facet grammar) + a visible evidence room iff corruption is
  //    REVEALED (a public scandal joins the floor plan). Covert corruption adds NOTHING
  //    to the visible set — it only nests a concealed chamber later, so the visible
  //    geometry of a covertly-corrupt building is byte-identical to a clean one. ──────
  const baseRooms = resolveRoomSet(kind, fnKey, tierIndex).map((r) => r);
  /** @type {Array<{ kind:string, weight:number, band:'front'|'back', furnish:ReadonlyArray<string> }>} */
  const roomSpecs = baseRooms.map((r) => ({ kind: r.kind, weight: r.weight, band: r.band, furnish: r.furnish }));
  if (corruption.revealed) {
    roomSpecs.push({ kind: 'evidence', weight: 2, band: 'back', furnish: ['strongbox', 'crate'] });
  }

  // ── the canonical frame (entrance at the SOUTH edge) — a centered footprint box ──
  const cell = Math.max(1, Math.floor((VIEW - 2 * MARGIN) / Math.max(footprint.widthCells, footprint.depthCells)));
  const w = footprint.widthCells * cell;
  const h = footprint.depthCells * cell;
  const ox = Math.round((VIEW - w) / 2);
  const oy = Math.round((VIEW - h) / 2);
  const doorW = Math.max(20, Math.round(cell * 0.7));

  const frontSpecs = roomSpecs.filter((r) => r.band === 'front');
  const backSpecs = roomSpecs.filter((r) => r.band === 'back');
  const hasBack = backSpecs.length > 0;
  // Back band sits AWAY from the entrance (the top); front band abuts the entrance.
  const backH = hasBack ? Math.round(h * 0.42) : 0;
  const dividerY = oy + backH;

  /** @type {InteriorRoom[]} */
  const canonRooms = [];
  /** Tile a band's width among its rooms by weight. Stable ids: kind + occurrence. */
  const occ = /** @type {Record<string, number>} */ ({});
  /** @param {typeof frontSpecs} list @param {number} bx @param {number} by @param {number} bw @param {number} bh */
  const tileBand = (list, bx, by, bw, bh) => {
    const totalWeight = list.reduce((n, r) => n + r.weight, 0) || 1;
    let cursor = bx;
    list.forEach((r, i) => {
      const isLast = i === list.length - 1;
      const rw = isLast ? (bx + bw - cursor) : Math.round((bw * r.weight) / totalWeight);
      const n = occ[r.kind] ?? 0; occ[r.kind] = n + 1;
      const id = `room:${r.kind}${n > 0 ? `:${n}` : ''}`;
      canonRooms.push({ id, kind: r.kind, band: r.band, x: cursor, y: by, w: rw, h: bh });
      cursor += rw;
    });
  };
  if (hasBack) tileBand(backSpecs, ox, oy, w, backH);
  tileBand(frontSpecs, ox, dividerY, w, oy + h - dividerY);

  const frontRooms = canonRooms.filter((r) => r.band === 'front');
  const backRooms = canonRooms.filter((r) => r.band === 'back');
  const mainFront = frontRooms[0] || canonRooms[0];

  // ── walls (canonical) — outer perimeter + internal partitions, each split by a door ──
  /** @type {InteriorWall[]} */
  const walls = [];
  /** @type {InteriorDoor[]} */
  const doors = [];
  const right = ox + w;
  const bottom = oy + h;
  // outer: top / left / right full; bottom split by the entrance at the main front room.
  walls.push({ x1: ox, y1: oy, x2: right, y2: oy });   // top
  walls.push({ x1: ox, y1: oy, x2: ox, y2: bottom });  // left
  walls.push({ x1: right, y1: oy, x2: right, y2: bottom }); // right
  const entranceCx = Math.round(mainFront.x + mainFront.w / 2);
  for (const seg of splitHorizontal(bottom, ox, right, entranceCx, doorW)) walls.push(seg);
  doors.push({ x1: entranceCx - Math.round(doorW / 2), y1: bottom, x2: entranceCx + Math.round(doorW / 2), y2: bottom, kind: 'entrance' });

  // internal vertical partitions within a band (each boundary between adjacent rooms).
  /** @param {InteriorRoom[]} band @param {number} bandTop @param {number} bandBottom */
  const bandVerticals = (band, bandTop, bandBottom) => {
    for (let i = 0; i < band.length - 1; i++) {
      const x = band[i].x + band[i].w;
      for (const seg of splitVertical(x, bandTop, bandBottom, doorW)) walls.push(seg);
      const midY = Math.round((bandTop + bandBottom) / 2);
      doors.push({ x1: x, y1: midY - Math.round(doorW / 2), x2: x, y2: midY + Math.round(doorW / 2), kind: 'internal' });
    }
  };
  bandVerticals(frontRooms, dividerY, bottom);
  if (hasBack) {
    bandVerticals(backRooms, oy, dividerY);
    // the band divider (full width) with a door into the main front room's span.
    for (const seg of splitHorizontal(dividerY, ox, right, entranceCx, doorW)) walls.push(seg);
    doors.push({ x1: entranceCx - Math.round(doorW / 2), y1: dividerY, x2: entranceCx + Math.round(doorW / 2), y2: dividerY, kind: 'internal' });
  }

  // ── furnishings — a deterministic grid inside each room, kinds cycled from the room's
  //    bounded vocab with a per-room seeded rotation (variety without free geometry). ──
  /** @type {InteriorFurnishing[]} */
  const furnishings = [];
  const specByKind = new Map(roomSpecs.map((r) => [r.kind, r]));
  for (const r of canonRooms) {
    const spec = specByKind.get(r.kind);
    const vocab = spec && spec.furnish.length ? spec.furnish : ['crate'];
    const inset = Math.max(8, Math.round(cell * 0.4));
    const innerX = r.x + inset;
    const innerY = r.y + inset;
    const innerW = r.w - 2 * inset;
    const innerH = r.h - 2 * inset;
    if (innerW < 12 || innerH < 12) continue;
    const fsz = Math.max(10, Math.round(cell * 0.55));
    const gap = Math.max(6, Math.round(cell * 0.35));
    const cols = Math.max(1, Math.floor((innerW + gap) / (fsz + gap)));
    const rows = Math.max(1, Math.floor((innerH + gap) / (fsz + gap)));
    const faithBump = (faithHigh && (r.kind === 'sanctuary' || r.kind === 'nave')) ? 1 : 0;
    const densityCap = clamp(2 + Math.round(prosperity01 * 3) + faithBump, 1, 8);
    const count = Math.min(cols * rows, densityCap);
    const rot = rng.fork(r.id).randInt(0, vocab.length - 1);
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const rowN = Math.floor(i / cols);
      const fx = innerX + col * (fsz + gap);
      const fy = innerY + rowN * (fsz + gap);
      if (fy + fsz > r.y + r.h - inset) break;
      const fkind = vocab[(i + rot) % vocab.length];
      furnishings.push({ id: `furn:${r.id}:${i}`, kind: fkind, roomId: r.id, x: fx, y: fy, w: fsz, h: fsz });
    }
  }

  // ── COVERT concealed chamber (DM-only) — nested in the back-most room, flagged
  //    covert:true on the room, its four walls, its door, and its strongbox, so a
  //    public projection strips ALL of it and the visible geometry is untouched. ──────
  const hasConcealed = corruption.covert && !publicSafe;
  if (hasConcealed) {
    const host = (backRooms[backRooms.length - 1]) || mainFront;
    const cw = clamp(Math.round(host.w * 0.5), 40, host.w - 16);
    const ch = clamp(Math.round(host.h * 0.5), 40, host.h - 16);
    const cx0 = host.x + host.w - cw - 8;
    const cy0 = host.y + 8;
    const cId = 'room:concealed';
    canonRooms.push({ id: cId, kind: 'concealed', band: 'back', x: cx0, y: cy0, w: cw, h: ch, covert: true });
    // covert walls: three solid edges + a door on the inner (left) edge into the host.
    walls.push({ x1: cx0, y1: cy0, x2: cx0 + cw, y2: cy0, covert: true });         // top
    walls.push({ x1: cx0 + cw, y1: cy0, x2: cx0 + cw, y2: cy0 + ch, covert: true }); // right
    walls.push({ x1: cx0, y1: cy0 + ch, x2: cx0 + cw, y2: cy0 + ch, covert: true }); // bottom
    for (const seg of splitVertical(cx0, cy0, cy0 + ch, doorW)) walls.push({ ...seg, covert: true });
    const cMidY = Math.round(cy0 + ch / 2);
    doors.push({ x1: cx0, y1: cMidY - Math.round(doorW / 2), x2: cx0, y2: cMidY + Math.round(doorW / 2), kind: 'concealed', covert: true });
    furnishings.push({ id: `furn:${cId}:0`, kind: 'strongbox', roomId: cId, x: cx0 + 10, y: cy0 + 10, w: Math.max(10, Math.round(cell * 0.55)), h: Math.max(10, Math.round(cell * 0.55)), covert: true });
  }

  // ── orient: rotate the canonical (south-entrance) frame to the map-facing edge by
  //    whole quarter-turns. Objects rebuilt in FIXED key order after the transform. ──
  const rot = (footprint.entranceSide + 2) & 3;
  /** @param {Rect} r @returns {Rect} */
  const rotRect = (r) => {
    const [ax, ay] = rotPoint(r.x, r.y, rot);
    const [bx, by] = rotPoint(r.x + r.w, r.y + r.h, rot);
    return { x: Math.min(ax, bx), y: Math.min(ay, by), w: Math.abs(bx - ax), h: Math.abs(by - ay) };
  };

  const bounds = rotRect({ x: ox, y: oy, w, h });
  /** @type {InteriorRoom[]} */
  const outRooms = canonRooms.map((r) => {
    const rr = rotRect(r);
    return r.covert
      ? { id: r.id, kind: r.kind, band: r.band, x: rr.x, y: rr.y, w: rr.w, h: rr.h, covert: true }
      : { id: r.id, kind: r.kind, band: r.band, x: rr.x, y: rr.y, w: rr.w, h: rr.h };
  });
  /** @type {InteriorWall[]} */
  const outWalls = walls.map((s2) => {
    const [x1, y1] = rotPoint(s2.x1, s2.y1, rot);
    const [x2, y2] = rotPoint(s2.x2, s2.y2, rot);
    return s2.covert ? { x1, y1, x2, y2, covert: true } : { x1, y1, x2, y2 };
  });
  /** @type {InteriorDoor[]} */
  const outDoors = doors.map((d) => {
    const [x1, y1] = rotPoint(d.x1, d.y1, rot);
    const [x2, y2] = rotPoint(d.x2, d.y2, rot);
    return d.covert ? { x1, y1, x2, y2, kind: d.kind, covert: true } : { x1, y1, x2, y2, kind: d.kind };
  });
  /** @type {InteriorFurnishing[]} */
  const outFurn = furnishings.map((f) => {
    const rr = rotRect(f);
    return f.covert
      ? { id: f.id, kind: f.kind, roomId: f.roomId, x: rr.x, y: rr.y, w: rr.w, h: rr.h, covert: true }
      : { id: f.id, kind: f.kind, roomId: f.roomId, x: rr.x, y: rr.y, w: rr.w, h: rr.h };
  });

  return {
    interiorVersion: INTERIOR_VERSION,
    seedFork,
    meta: {
      institutionId,
      kind,
      functionVariant: fnKey,
      tierIndex,
      source: footprint.source,
      entranceSide: footprint.entranceSide,
      widthCells: footprint.widthCells,
      depthCells: footprint.depthCells,
      prosperity01,
      roomCount: outRooms.filter((r) => !r.covert).length,
      hasEvidenceRoom: corruption.revealed,
      hasConcealed,
      publicSafe,
    },
    bounds,
    rooms: outRooms,
    walls: outWalls,
    doors: outDoors,
    furnishings: outFurn,
  };
}

/**
 * Project an interior model to its PUBLIC-SAFE form: drop every covert:true room /
 * wall / door / furnishing and clear the covert meta flags. Defense-in-depth twin of
 * the publicSafe BUILD mode — the two public paths are byte-identical (pinned), so a
 * DM model shared to the gallery can never leak the concealed chamber. Pure.
 * @param {InteriorModel} model
 * @returns {InteriorModel}
 */
export function toPublicSafeInterior(model) {
  if (!model || typeof model !== 'object') return model;
  return {
    interiorVersion: model.interiorVersion,
    seedFork: model.seedFork,
    meta: { ...model.meta, hasConcealed: false, publicSafe: true },
    bounds: model.bounds,
    rooms: model.rooms.filter((r) => !r.covert),
    walls: model.walls.filter((w2) => !w2.covert),
    doors: model.doors.filter((d) => !d.covert),
    furnishings: model.furnishings.filter((f) => !f.covert),
  };
}
