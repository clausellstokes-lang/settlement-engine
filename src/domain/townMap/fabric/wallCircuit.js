/**
 * domain/townMap/fabric/wallCircuit.js — ⭐⭐⭐ THE CANONICAL CIRCUIT NODE (owner law ODQ §230
 * MUTUAL BOUNDING; chair directive §234's derivation-graph architecture, of which this module
 * is the declared PILOT).
 *
 * ⭐⭐⭐ THE OWNER'S LAW, IN ONE SENTENCE: **buildings are bounded within the walls AS the walls
 * bound around the buildings** — one derivation order, ONE shared circuit object, the lens
 * drawing and every census measuring the same geometry BY CONSTRUCTION rather than by
 * agreement.
 *
 * ⛔⛔ WHY A SHARED OBJECT WAS NOT ENOUGH, AND THIS IS THE PILOT'S FIRST LESSON. The b8 wall
 * census already consumed the object the lens drew — PROVEN by hash, not assumed: the census's
 * `claimLine` reconstructs byte-identically from the drawn `polygon` under the band's own
 * offset (town: sha 857ffc4f… both ways). The staleness hypothesis §230.1 raised is therefore
 * REFUTED on every walled leaf, and the wall still crossed buildings, because the two surfaces
 * shared the geometry and also shared a BLIND PREDICATE (see reservedGround.js). So the node
 * below publishes THREE things and a consumer may use nothing else:
 *
 *   1. THE DRAWN RUNS      — exactly what the lens strokes;
 *   2. THE CLAIM RUNS      — exactly what every law and census reserves;
 *   3. THE BAND SIDE       — inside / in-band / outside, for §232's district partition;
 *
 * and all three are cut by ONE splitter at ONE gate radius, so the ink, the reservation and the
 * partition open in the same places to the last unit.
 *
 * ⭐⭐ THE GRAPH IDIOM, AS §234 MANDATES IT, MADE CONCRETE HERE:
 *   • THE NODE DECLARES ITS INPUTS. `WALL_CIRCUIT_INPUTS` is the whole consumed set; the
 *     builder hashes exactly those and refuses an input record carrying anything else, so a
 *     later lane cannot quietly read a fact the hash does not cover.
 *   • THE OUTPUT CARRIES A CONTENT HASH over the geometry it publishes.
 *   • CONSUMERS PULL THROUGH ACCESSORS, and every accessor re-verifies the content hash. A
 *     consumer handed a mutated node, or a node from another generation, throws rather than
 *     measuring the wrong wall. **STALENESS IS IMPOSSIBLE BY CONSTRUCTION, NOT BY AGREEMENT.**
 *   • THE CYCLE IS BOUNDED AND NAMED. wall ↔ fabric is a genuine cycle (§234.2's SCC note):
 *     the circuit is traced from the built fabric, and the districts are then partitioned WITH
 *     the circuit as a stopping boundary. It is solved in TWO fixed passes and never iterated —
 *     the wall is not re-traced against the partition it produced. No fixed-point engine.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare.
 */

import { hash32 } from './fabricRng.js';
import { q6, topoText, ringIndex } from './fabricGeometry.js';
import { traceWalls, wallForm } from './walls.js';
import { pointInPoly, ringNearestSegment, ringNearestIndex } from './reservedGround.js';
import { deriveEpochs } from './epochAxis.js';
import { epochCircuitRing } from './builtUmbrella.js';
import { wallStandingAt } from './snapshot.js';

/**
 * ⭐ THE DECLARED INPUT SET. Every fact the circuit derivation consumes, named once. The hash
 * covers exactly this list; anything a future arm needs must join the list, which is the point.
 */
export const WALL_CIRCUIT_INPUTS = Object.freeze([
  'hasWalls', 'circuitBody', 'umbrellaComponents', 'roads', 'extentTier', 'builtRadius',
  'highWater', 'substrateKey', 'waterMode', 'waterLine', 'waterWidth', 'frontage',
  'glacisClear', 'wallForm', 'vintage', 'seed', 'variant',
  // ⭐⭐⭐ ODQ §240 · THE EPOCH LADDER IS A DECLARED INPUT, so a change in how many circuits a
  // settlement earned moves the node's input hash and every accessor refuses a stale reading.
  'epochExtents',
  // ⭐⭐⭐ §5 W2 · THE RUN CHAIN'S OWN FACTS. B8b §11.3 named the seam this closes: *"a handle
  // that gains a fact of its own escapes the hash silently"*. The run classifier reads the
  // institution SEATS (the notch and the detour-to-a-work runs are caused by them) and the
  // FOUNDING AGE (G-42's gate), so both are declared inputs rather than handles — a seat that
  // MOVED without changing the count moves the circuit's hash, which is the whole point.
  'institutionSeats', 'foundingAge',
]);

/** The node's identity in the derivation graph. */
export const WALL_CIRCUIT_NODE = 'fabric.wall.circuit';

/** A 128-bit content hash from four salted 32-bit passes. Integer ops only; no crypto import
 *  in the domain. ⚠ IT IS A STALENESS DETECTOR, NOT A SECURITY PRIMITIVE, and says so. */
export function contentHash(text) {
  const s = String(text);
  let out = '';
  for (const salt of ['h0|', 'h1|', 'h2|', 'h3|']) {
    out += (hash32(salt + s) >>> 0).toString(16).padStart(8, '0');
  }
  return out;
}

// ⭐ THE TOPOLOGY QUANTUM HAS ONE HOME (fabricGeometry.TOPOLOGY_PLACES). This module used to
// carry its own `n6`/`polyText`, which is a private spelling of a shared rule — the class this
// programme has found in `wallClaims`, in the gate split and in the reroll salt.
const n6 = q6;
const polyText = topoText;

/**
 * Serialize the declared inputs in a fixed order. ⚠ THE ROADS ENTER BY GEOMETRY, NOT BY COUNT:
 * a road that MOVED without changing the count is exactly the staleness this hash exists to
 * catch, and a count would miss it.
 */
export function inputsText(inputs) {
  const parts = [];
  for (const k of WALL_CIRCUIT_INPUTS) {
    const v = inputs[k];
    if (v == null) { parts.push(`${k}=∅`); continue; }
    if (Array.isArray(v)) {
      if (v.length && Array.isArray(v[0])) parts.push(`${k}=[${polyText(v)}]`);
      // ⛔ A LIST OF PLAIN OBJECTS USED TO SERIALIZE AS `[object Object]` — a hash column that
      // cannot move, which is the same defect `wallForm: null` was. Every own key is written,
      // in sorted order, at topology precision.
      else parts.push(`${k}=[${v.map((r) => (r && r.line ? `${r.key || ''}:${polyText(r.line)}`
        : (r && typeof r === 'object'
          ? Object.keys(r).sort().map((kk) => `${kk}:${typeof r[kk] === 'number' ? n6(r[kk]) : String(r[kk])}`).join(',')
          : String(r)))).join('|')}]`);
    } else if (typeof v === 'object') {
      parts.push(`${k}={${Object.keys(v).sort().map((kk) => `${kk}:${typeof v[kk] === 'number' ? n6(v[kk]) : String(v[kk])}`).join(',')}}`);
    } else parts.push(`${k}=${typeof v === 'number' ? n6(v) : String(v)}`);
  }
  return parts.join('\n');
}

/** Serialize what the node PUBLISHES — the surface every consumer sees. */
export function ringsText(rings) {
  return rings.map((r) => [
    r.kind, r.form, String(r.weight), String(r.halfRing),
    polyText(r.polygon),
    polyText(r.claimLine),
    (r.gates || []).map((g) => `${g.key}:${n6(g.x)},${n6(g.y)}:${g.bricked ? 'B' : 'O'}`).join('|'),
    polyText(r.towers),
    r.bandParts ? Object.keys(r.bandParts).sort().map((k) => `${k}=${n6(r.bandParts[k])}`).join(',') : '∅',
    // ⚠ THE EPOCH INDEX IS PART OF WHAT THE NODE PUBLISHES. Two rings of identical geometry at
    // different epochs are different facts, and a content hash that could not tell them apart
    // would let an epoch re-labelling pass every accessor.
    `E${r.epoch == null ? '?' : r.epoch}`,
    // ⭐⭐ §5 W2 · THE RUN CHAIN AND THE TOWER TYPES ARE PART OF WHAT THE NODE PUBLISHES. Two
    // circuits of identical geometry whose runs are typed differently reserve different ground
    // and carry different towers — a hash blind to that would let a re-typing pass every
    // accessor, which is the same defect the epoch index was added to close.
    (r.runs || []).map((x) => `${x.type}@${x.idx[0]}+${x.idx.length}`).join('|'),
    (r.towerTypes || []).join(','),
  ].join('#')).join('\n');
}

/**
 * ⭐⭐ THE INPUT RECORD IS BUILT HERE, NOT AT THE CALL SITE, and that is the graph idiom rather
 * than tidiness: a node that DECLARES its inputs must also be the thing that reads them out of
 * the world, or the declaration and the reading are two files that can drift — which is the
 * whole class this lane exists to close. (It also keeps `buildFabric.js` under the 800-line
 * domain ceiling: MEASURED, the inline record put it at 824.)
 *
 * @param {Object} a the fabric's live handles at STAGE 5
 * @returns {Record<string, any>} exactly the WALL_CIRCUIT_INPUTS keys
 */
export function circuitInputsFrom(a) {
  return {
    hasWalls: a.hasWalls,
    circuitBody: a.circuitBody,
    umbrellaComponents: a.umbrella.components.length,
    roads: a.web.roads,
    extentTier: a.tierScale.extentTier,
    builtRadius: a.tierScale.builtRadius,
    highWater: a.tierScale.highWater
      ? { demoted: !!a.tierScale.highWater.demoted, deficit: a.tierScale.highWater.deficit }
      : null,
    substrateKey: a.sub.key || `${a.sub.n}x${a.sub.cell}`,
    waterMode: a.water.mode,
    waterLine: a.water.line,
    waterWidth: a.water.width,
    // §200: the band is derived in FRONTAGES (the drawn module every other width uses) and its
    // outer face is the §5.0e.3 seriousness dial the faubourg law already reads, so the glacis
    // and the wall-foot tell can never disagree about the same town.
    frontage: a.frontage,
    glacisClear: a.glacisClear,
    // ⛔ IT USED TO BE `null` ON EVERY LEAF — a declared input whose value was a constant, which
    // is a hash column that can never move and therefore a declaration that never declared
    // anything. The form decides the facets, the tower interval, the smoothing and the ditch.
    wallForm: wallForm(a.settlement, a.tierScale.extentTier).form,
    vintage: a.vintage ? { ageAtBuild: a.vintage.ageAtBuild, year: a.vintage.year } : null,
    seed: a.seeding.seed,
    variant: a.seeding.variant,
    epochExtents: epochLadder(a).extents,
    institutionSeats: institutionSeatsOf(a.orgsSeated || a.seated),
    foundingAge: foundingAgeOf(a.settlement),
  };
}

/**
 * ⭐⭐ THE SEATS THE RUN CHAIN READS, compiled to the two facts it needs: WHERE and WHICH KIND.
 * A `monumental` seat causes a NOTCH (the wall doubles back to wrap a precinct); a `work` — a
 * mill, quay, pond or extraction site — causes a DETOUR TO A WORK. Everything else is invisible
 * to the wall, which is correct: an ordinary house never moved a circuit.
 */
export function institutionSeatsOf(seated) {
  /** @type {Array<{x:number,y:number,kind:string}>} */ const out = [];
  for (const lm of (seated || [])) {
    if (!lm || !Number.isFinite(lm.x) || !Number.isFinite(lm.y)) continue;
    const arch = `${String(lm.archetype || '')} ${String(lm.anchorKey || '')}`;
    const work = /mill|quay|port|dock|wharf|pond|forge|extraction|tannery|kiln|smelt|mine|salt/i.test(arch);
    if (lm.monumental) out.push({ x: lm.x, y: lm.y, kind: 'monumental' });
    else if (work) out.push({ x: lm.x, y: lm.y, kind: 'work' });
  }
  // Canonical order: a declared input's serialization must not depend on seating order.
  out.sort((p, q) => (p.x - q.x) || (p.y - q.y) || (p.kind < q.kind ? -1 : p.kind > q.kind ? 1 : 0));
  return out;
}

/**
 * ⭐⭐⭐ THE EPOCH LADDER FOR THIS SETTLEMENT (ODQ §240.2). Derived from facts that all exist
 * before any circuit is traced — the tier the extent reached, today's built radius and whether
 * the wall has a recorded vintage — which is precisely what makes core → wall → ring → wall
 * acyclic rather than simultaneous.
 */
export function epochLadder(a) {
  return deriveEpochs({
    hasWalls: a.hasWalls,
    extentTier: a.tierScale.extentTier,
    builtRadius: a.tierScale.builtRadius,
    vintage: a.vintage,
    // ⭐⭐⭐ G-42 · THE FOUNDING AGE IS THE FABRIC LADDER'S GATE, exactly as the vintage is the
    // circuit's. It is read where the settlement is read; a ladder that guessed an age would
    // be inventing the one fact §257.3(a)'s cure rests on.
    foundingAge: foundingAgeOf(a.settlement),
  });
}

/** The settlement's recorded age — `history.founding.age` first, `history.age` as the mirror. */
export function foundingAgeOf(s) {
  const h = (s && s.history) || null;
  if (!h) return null;
  if (h.founding && Number.isFinite(h.founding.age)) return Math.trunc(h.founding.age);
  return Number.isFinite(h.age) ? Math.trunc(h.age) : null;
}

/**
 * ⭐⭐ §11.8 / §161d.4 THE VINTAGE GATE — WHETHER THERE IS A WALL AT ALL AT THIS YEAR, resolved
 * where the circuit is derived rather than at the call site, because it is the node's own first
 * input. `hasWalls` comes from the landed MODEL, which is NOT year-indexed, so a snapshot's
 * truncated event list cannot reach it — the gate has to be applied where the model is read.
 * A leaf dated before the circuit's own vintage carries NO CIRCUIT, and with it no gates, no
 * ditch, no water gates, no faubourg and no lean-tos.
 *
 * ⛔⛔ AND THE VINTAGE MUST COME FROM THE PRESENT-DAY RECORD. `compile.deriveWallVintage`
 * computes `ageAtBuild = age × (TOWN_FLOOR / peak)` — A FRACTION OF *NOW* — so under a year
 * projection the build age slides down with the year and the circuit is ALWAYS ALREADY BUILT:
 * MEASURED, the year-18 leaf of a town whose wall was raised in year 49 came back with its wall
 * standing, silently. ⭐ THE CLASS: **A FACT DERIVED AS A FRACTION OF "NOW" IS NOT A DATE, AND A
 * SNAPSHOT EXPOSES IT INSTANTLY.** The caller therefore stamps the present-day vintage
 * (`options.wallBuiltAtAge`) and it is held fixed across every snapshot of that settlement.
 */
export function wallStandingFor(a) {
  const vintage = Number.isFinite(a.options.wallBuiltAtAge)
    ? { ageAtBuild: a.options.wallBuiltAtAge, source: 'stamped by the caller from the present-day record (§11.11)' }
    : a.record.get('wall-built-year', null);
  const landed = !!(a.model && a.model.meta && a.model.meta.hasWalls);
  const gate = wallStandingAt(vintage, a.options.year, landed);
  return { vintage, hasWalls: gate.standing, reason: gate.reason };
}

/**
 * ⭐⭐⭐ DERIVE THE CIRCUIT NODE. The one place a wall comes into existence.
 *
 * @param {Record<string, any>} inputs  exactly the WALL_CIRCUIT_INPUTS keys
 * @param {Object} raw  the un-hashed handles traceWalls needs (substrate grid, rng seeding,
 *                      record) — declared separately BECAUSE THEY ARE NOT FACTS, they are
 *                      accessors onto facts already named in the input set. A handle that
 *                      carried a fact of its own would have to join WALL_CIRCUIT_INPUTS.
 */
export function deriveWallCircuit(inputs, raw) {
  for (const k of Object.keys(inputs)) {
    if (!WALL_CIRCUIT_INPUTS.includes(k)) {
      throw new Error(`wallCircuit: undeclared input '${k}' — add it to WALL_CIRCUIT_INPUTS or do not read it`);
    }
  }
  // ⭐⭐⭐ ODQ §240 · ONE BODY PER WALLED EPOCH, EACH CLOSED FROM ITS OWN EPOCH'S CELLS. Ordered
  // OUTERMOST FIRST so `rings[0]` is the working circuit, exactly as every consumer expects.
  const ladder = epochLadder(raw);
  const epochBodies = ladder.epochs.filter((e) => e.walled).map((e) => ({
    index: e.index,
    kind: e.kind,
    extent: e.extent,
    body: epochCircuitRing({
      part: raw.part, bodyMask: raw.bodyMask, wallCloseR: raw.wallCloseR,
      extent: e.extent, ring: inputs.circuitBody, key: `${raw.key}|E${e.index}`,
    }),
  })).reverse();
  const rings = traceWalls({
    epochBodies,
    hasWalls: inputs.hasWalls,
    settlement: raw.settlement,
    umbrella: raw.umbrella,
    tierScale: raw.tierScale,
    sub: raw.sub,
    water: raw.water,
    web: raw.web,
    seeding: raw.seeding,
    record: raw.record,
    circuitBody: inputs.circuitBody,
    frontage: inputs.frontage,
    glacisClear: inputs.glacisClear,
    // ⭐ THE RUN CHAIN'S CAUSES COME FROM THE **DECLARED** INPUT, never from the raw handle —
    // so the seats the classifier read are exactly the seats the node's hash covers.
    institutionSeats: inputs.institutionSeats,
  });
  const gateRadius = inputs.builtRadius * GATE_RADIUS_SHARE;
  const node = {
    nodeId: WALL_CIRCUIT_NODE,
    inputsHash: contentHash(inputsText(inputs)),
    contentHash: contentHash(ringsText(rings)),
    rings,
    // ⭐⭐ THE WHOLE LADDER, INCLUDING THE UNWALLED OUTER EPOCH — a consumer asking "which
    // version of this town is this body in" needs the suburb named as much as the walled
    // rings, and each walled epoch carries THE BODY ITS RING WAS TRACED FROM.
    // ⚠ THE BODIES ARE DIAGNOSTIC, NOT A LAW SURFACE: the content hash covers what the
    // ACCESSORS publish (the rings), so a consumer that measured legality against these
    // would be reading an unverified copy. They exist so the epoch census can ask the one
    // question that matters — did the trace keep the fabric it was traced from inside it.
    epochs: ladder.epochs.map((e) => {
      const r = rings.find((x) => x.epoch === e.index);
      return r ? { ...e, body: r.epochHull, containmentResidual: r.containmentResidual } : { ...e };
    }),
    epochReason: ladder.reason,
    builtRadius: inputs.builtRadius,
    frontage: inputs.frontage,
    gateRadius,
    glacisClear: inputs.glacisClear,
    reason: rings.length
      ? `${rings.length} circuit(s) derived from the built fabric; band and claim published together`
      : 'no circuit — the settlement is unwalled or its wall is not yet built at this year',
  };
  return Object.freeze(node);
}

/**
 * ⭐ THE GATE RADIUS, ONE NUMBER, ONE HOME. The lens broke its stroke at `builtRadius × 0.075`
 * and `wallClaims` opened its reservation at `builtRadius × 0.075`, restated in two files —
 * two spellings of one fact, which is the shape every divergence in this programme has had.
 */
export const GATE_RADIUS_SHARE = 0.075;

/**
 * ⭐⭐⭐ THE FRESHNESS GATE. Every accessor calls it, so a consumer cannot measure a wall that
 * is not this fabric's wall.
 */
export function verifyCircuit(node) {
  if (!node || node.nodeId !== WALL_CIRCUIT_NODE) {
    throw new Error('wallCircuit: not a circuit node — consumers must pull through the accessors');
  }
  const live = contentHash(ringsText(node.rings));
  if (live !== node.contentHash) {
    throw new Error(`wallCircuit: STALE OR MUTATED NODE — published ${node.contentHash}, recomputed ${live}`);
  }
  return node;
}

/**
 * ⭐⭐⭐ MF-ARCH · THE RAW HANDLE IS PUBLISHED AS A **VERIFYING ACCESSOR**, so there is no raw
 * handle left to police.
 *
 * ⛔ THE PROBLEM MF-B8b LEFT, IN ITS OWN WORDS: "`fabric.walls` IS STILL REACHABLE… a consumer
 * that ignores the accessors and re-derives from `walls[].polygon` can still publish a second
 * reading. The accessors make staleness impossible FOR CONSUMERS THAT USE THEM." Its proposed
 * cure was a SOURCE SCAN for raw-handle reads. MF-ARCH built that scan first and MEASURED why
 * it cannot be the primary enforcement: the fabric travels under many names — `fabric`, `f`,
 * `dp`, `P`, `a`, `ctx`, `closing` — so a token scan for `.walls` convicts `fort.walls`,
 * `P.walls` and `c.fortifications.walls`, and an alias-aware scan found only 6 of the files
 * that actually hold one. ⭐ THE CLASS: **A SCAN OVER READ SITES MUST SOLVE ALIASING; A GUARD
 * AT THE PUBLICATION POINT DOES NOT HAVE TO.** There is exactly ONE place the handle is
 * published and unboundedly many places it is read, so the guard belongs at the one.
 *
 * Every read of `fabric.walls`, under every alias, in every file, now passes through
 * `verifyCircuit` — by construction rather than by convention.
 *
 * ⚠ THE LIMIT, STATED EXACTLY: the verification is memoized per node (a render reads
 * `fabric.walls` in loops and re-hashing a 117-vertex circuit per read is a real cost — the
 * §217 op ceilings are pinned). So this catches a node that is STALE OR MUTATED **when the
 * fabric first hands it out**, which is the §230 staleness class it exists for; it does not
 * catch a mutation performed after that first read inside one render.
 *
 * ⚠ THE MEMO IS A MODULE-SCOPE `WeakSet`, AND THE FIRST SPELLING WAS A PROPERTY ON THE NODE —
 * which threw, because `deriveWallCircuit` FREEZES the node. That refusal is the node's own
 * guarantee working, so the memo moved off it rather than the freeze being loosened. The set
 * is keyed by object identity, is never read by any derivation, and cannot reach a hash, a
 * golden or a serialization: it decides only whether a check that always gives the same answer
 * is run again.
 *
 * @param {any} fabric  the assembled fabric, before it is returned
 * @param {any} node    the circuit node
 * @returns {any} the same fabric
 */
const VERIFIED = new WeakSet();

export function publishCircuitRings(fabric, node) {
  Object.defineProperty(fabric, 'walls', {
    enumerable: true,
    configurable: false,
    get() {
      if (!VERIFIED.has(node)) { verifyCircuit(node); VERIFIED.add(node); }
      return node.rings;
    },
  });
  return fabric;
}

/**
 * ⭐⭐⭐ THE STALE-GENERATION GATE (§230.2's counterfactual). Re-derives the input hash from the
 * inputs the CURRENT fabric would supply and refuses a node built from any other generation.
 * This is the arm that must red when a lane re-cuts the fabric and forgets to re-trace.
 */
export function assertCircuitFresh(node, inputs) {
  verifyCircuit(node);
  const live = contentHash(inputsText(inputs));
  if (live !== node.inputsHash) {
    throw new Error(`wallCircuit: STALE GENERATION — the circuit was derived from inputs ${node.inputsHash}`
      + ` and this fabric's inputs hash ${live}. The wall must be re-derived, never re-used.`);
  }
  return node;
}

/**
 * ⭐⭐ THE ONE SPLITTER. Cut a closed line into the runs that survive between the open gates —
 * EXACTLY, at the gate circle's own crossing points.
 *
 * ⛔ THE LENS WAS STILL SPLITTING BY DROPPING VERTICES, which is the defect MF-B7 cured inside
 * `wallClaims` and left standing inside `renderFolio`: a ring vertex within `gateR` of a gate
 * ended the run, so BOTH segments touching it vanished and the DRAWN opening was as wide as the
 * trace's vertex spacing happened to make it, while the RESERVED opening was the gate's own
 * diameter. ⭐ THE CLASS, restated one surface out: **A DEFECT CURED IN ONE SPELLING OF A
 * DUPLICATED RULE SURVIVES IN THE OTHER, AND THE TWO THEN DISAGREE ABOUT THE SAME TOWN.**
 * Cutting at the analytic crossing is exact for both and inflates neither's vertex count.
 */
export function splitAtGates(line, gates, gateR, closed = true) {
  if (!line || line.length < (closed ? 3 : 2)) return [];
  const open = (gates || []).filter((g) => !g.bricked);
  if (!open.length) return [line.slice()];
  const rr = gateR * gateR;
  /** @type {Array<[number,number]>} */ let run = [];
  /** @type {Array<Array<[number,number]>>} */ const runs = [];
  const inGate = (x, y) => open.some((g) => (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y) < rr);
  const flush = () => { if (run.length > 1) runs.push(run); run = []; };
  const n = line.length;
  // ⛔⛔ THE `closed` FLAG IS NOT A CONVENIENCE AND A PIN CAUGHT WHY. §5 W2 cuts the reservation
  // PER TYPED RUN, and a run is an OPEN polyline — but this splitter wrapped `(i + 1) % n`
  // unconditionally, so every open run gained a phantom closing segment from its last vertex
  // back to its first. MEASURED by the gate pin on the `chaotic` fixture: that phantom chord
  // ran **7.2 units from an open gate whose radius is 29.4** — a reservation lying straight
  // across the opening the road goes through, drawn by nothing and reserved by geometry that
  // does not exist. ⭐ THE CLASS: **A HELPER WRITTEN FOR A CLOSED RING SILENTLY INVENTS AN EDGE
  // WHEN IT IS HANDED AN OPEN ONE**, and the invented edge is the longest one on the line.
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = line[i], b = line[(i + 1) % n];
    const aIn = inGate(a[0], a[1]);
    if (!aIn) run.push(a); else flush();
    // Every crossing of every open gate circle on this segment, in parameter order.
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const A = dx * dx + dy * dy;
    if (A < 1e-12) continue;
    /** @type {number[]} */ const ts = [];
    for (const g of open) {
      const fx = a[0] - g.x, fy = a[1] - g.y;
      const B = 2 * (fx * dx + fy * dy);
      const C = fx * fx + fy * fy - rr;
      const disc = B * B - 4 * A * C;
      if (disc <= 0) continue;
      const sq = Math.sqrt(disc);
      for (const t of [(-B - sq) / (2 * A), (-B + sq) / (2 * A)]) if (t > 0 && t < 1) ts.push(t);
    }
    ts.sort((p, q) => p - q);
    for (const t of ts) {
      const px = a[0] + dx * t, py = a[1] + dy * t;
      // Entering a gate closes the run at the circle; leaving one opens it there.
      const eps = 1e-6;
      const before = inGate(a[0] + dx * (t - eps), a[1] + dy * (t - eps));
      if (!before) { run.push([px, py]); flush(); } else { run = [[px, py]]; }
    }
  }
  // ⛔⛔ §287.12 · THE THIRD MEMBER OF THIS HELPER'S OWN SEAM FAMILY, AND MF-D0 CAUGHT IT WITH A
  // NUMBER. `run.length === 1` at the end of a CLOSED walk means exactly one thing: the SEAM
  // SEGMENT (last vertex → vertex 0) LEFT a gate circle before it arrived, so the single pending
  // point is that gate's exit. `flush` drops a one-point run, and the merge below then joined the
  // FIRST run to whatever run happened to be last — **a chord straight across the open gate**,
  // drawn by nothing. MEASURED on the metropolis fixture at MF-D0's tip: the ink came within
  // **10.54 units of an open gate whose radius is 33.13**, and the §230 pin convicted it.
  // ⭐ THE CONDITION `!inGate(line[0])` WAS NECESSARY AND NEVER SUFFICIENT: vertex 0 can sit
  // outside every circle while the segment that reaches it passes through one.
  // ⚠ AND IT IS LATENT RATHER THAN LIVE AT THE SEALED W2 BASE — 0 of 25 rings across the corpus
  // and every walled fixture trip it (`laneMFD0-seam.log`), which is why nothing had ever seen
  // it. The offset repair re-seams a ring it excises a loop from, and the seam landed in a gate.
  const seamExit = closed && run.length === 1 ? run[0] : null;
  if (!closed && run.length > 1) runs.push(run);
  else flush();
  if (seamExit && runs.length) {
    // The pending piece is contiguous with the FIRST run through vertex 0 — and the run that is
    // currently last ended AT a gate, so it must stay closed there.
    runs[0] = [seamExit].concat(runs[0]);
  } else if (closed && runs.length > 1 && !inGate(line[0][0], line[0][1])) {
    // The closed line's first run and last run are one run when the seam is not in a gate.
    const first = runs.shift();
    runs[runs.length - 1] = runs[runs.length - 1].concat(first);
  }
  return runs;
}

/** ⭐ ACCESSOR — what the LENS strokes. */
export function circuitDrawnRuns(node) {
  verifyCircuit(node);
  /** @type {Array<{kind:string, weightKind:string, line:Array<[number,number]>, ring:any}>} */
  const out = [];
  for (const ring of node.rings) {
    for (const line of splitAtGates(ring.polygon, ring.gates, node.gateRadius)) {
      out.push({ kind: ring.kind, weightKind: ring.kind === 'old-core' ? 'wallOld' : 'wall', line, ring });
    }
  }
  return out;
}

/**
 * ⭐ ACCESSOR — what every LAW and every CENSUS reserves. Same splitter, same gate radius as
 * the drawn runs above, which is the whole point: a gate is the one place a road is SUPPOSED
 * to cross the circuit, so the ink and the reservation must open in the same place or one of
 * them is governing ground the other does not.
 */
export function circuitClaims(node) {
  verifyCircuit(node);
  const out = [];
  for (const c of node.rings) {
    if (!c.band || !c.claimLine || c.claimLine.length < 3) continue;
    // ── ⭐⭐⭐ §5 W2 exit 4 · **THE CLAIM IS PER RUN, AND ITS EXEMPTION KEYS TO THE RUN TYPE.**
    //    §239.2's wall-side street is a PER-RUN policy (7/7 walled plates show it on some runs,
    //    0/7 on every run), so a single ring-wide reservation governs ground the corpus leaves
    //    to the tofts — and §200's census would then RED on correct output. Each run publishes
    //    its own width and, where it has one, its named exemption.
    // ⚠ THE CLAIM LINE IS CUT FROM THE **RING'S** OFFSET COPY BY VERTEX INDEX, never re-offset
    // per run: `offsetPolygonOutward` on a short open run would mitre its ends differently and
    // the reservation would stop agreeing with the ink at every run boundary.
    if (c.runs && c.runs.length && c.runBands && c.runBands.length === c.runs.length) {
      for (let j = 0; j < c.runs.length; j++) {
        const run = c.runs[j], rb = c.runBands[j];
        const line = run.idx.map((k) => c.claimLine[k % c.claimLine.length]).filter(Boolean);
        if (line.length < 2) continue;
        let i = 0;
        // ⚠ `closed: false` — a RUN is an open polyline. See splitAtGates's own note for the
        // phantom chord this flag exists to prevent and for the pin that measured it.
        for (const piece of splitAtGates(line, c.gates, node.gateRadius, false)) {
          out.push({
            key: `wall.${c.kind}.${run.type}.${run.idx[0]}.${i++}`,
            kind: 'wall', line: piece, width: rb.width,
            runType: run.type, lane: rb.lane, exempt: rb.exempt,
          });
        }
      }
      continue;
    }
    let i = 0;
    for (const line of splitAtGates(c.claimLine, c.gates, node.gateRadius)) {
      out.push({ key: `wall.${c.kind}.${i++}`, kind: 'wall', line, width: c.band * 2 });
    }
  }
  return out;
}

/**
 * ⭐⭐ ACCESSOR — THE TYPED RUN CHAIN. Every consumer that asks "what is this piece of wall
 * doing" comes here, so there is no second reading of the run typing to drift from this one.
 */
export function circuitRuns(node) {
  verifyCircuit(node);
  const out = [];
  for (const ring of node.rings) {
    for (let j = 0; j < (ring.runs || []).length; j++) {
      out.push({ ring, index: j, ...ring.runs[j], band: (ring.runBands || [])[j] || null });
    }
  }
  return out;
}

/**
 * ⭐⭐ ACCESSOR — THE WALL-SIDE LANES, as street channels. §239.2's engineering gain: the wall
 * is always reachable, every gate necessarily meets the street web, and "no building touches
 * the wall" becomes a consequence of geometry. The carriageway is inside the band the circuit
 * already reserves, so this adds a DRAWING to reserved ground and never a new reservation.
 */
export function circuitWallLanes(node) {
  verifyCircuit(node);
  const out = [];
  for (const ring of node.rings) {
    // An old core's intervallum was built over generations ago (walls.wallBand's own reading),
    // so it has no lane to draw — its ring street arrives through `circuitDemotion` instead.
    if (ring.kind === 'old-core') continue;
    for (const lane of (ring.wallLanes || [])) {
      out.push({ key: lane.key, rank: 'wallLane', width: lane.width, line: lane.line, run: lane.run });
    }
  }
  return out;
}

/** The same claim set for a bare ring list — the ONE path a consumer without the node may
 *  take, and it exists only for the tests that construct rings by hand. Production consumers
 *  pull `circuitClaims(fabric.wallCircuit)` so the freshness gate runs. */
export function claimsOfRings(rings, builtRadius) {
  return circuitClaims({
    nodeId: WALL_CIRCUIT_NODE, rings, builtRadius,
    gateRadius: builtRadius * GATE_RADIUS_SHARE,
    contentHash: contentHash(ringsText(rings)),
  });
}

/**
 * ⭐⭐⭐ MF-PERF1 · THE MEASURING RIGS — **ONE LAW BODY, TWO INSTRUMENTS**, and the separation is
 * the whole of this lane's cure for the §232 accessors.
 *
 * ⛔ WHAT WAS WRONG, MEASURED, AND IT WAS NOT WHAT IT LOOKED LIKE. `circuitBandSide` and
 * `circuitHold` each opened with `verifyCircuit(node)`, which re-serializes EVERY ring at
 * topology precision and re-hashes the text four times. The partition asks them once per grid
 * cell, once per region vertex and once per straddler sample, so on one metropolis build the
 * freshness gate ran **12,283 times and serialized 40.2 MB of ring text** (MFPERF1-counts.mjs).
 * The integration spike read this as *"14.1 % of the entire build inside `toFixed(6)`"* — true,
 * and the cause was not the formatter. ⭐ THE CLASS: **A GUARD THAT IS CORRECT PER CALL BECOMES
 * A COST PER CALL, AND PROFILES AS ITS INNERMOST HELPER RATHER THAN AS ITSELF.**
 *
 * ⭐⭐ THE CURE IS NOT TO WEAKEN THE GATE — IT IS TO GIVE THE CALLER AN INSTRUMENT TO HOLD.
 * `circuitProbe(node)` verifies ONCE, at the moment the instrument is acquired, and builds the
 * spatial index once; a caller that asks ten thousand questions of one wall in one derivation
 * pass verifies one wall once. The one-shot accessors below keep verifying per call and are
 * unchanged in behaviour, so the §230 counterfactuals still red at every accessor.
 *
 * ⭐ AND BOTH INSTRUMENTS RUN THE SAME LAW BODY (`bandSideOf` / `holdOf` below). The only
 * difference between them is HOW the nearest segment and the containment are found — walked, or
 * indexed. That is what makes the equivalence pin a real comparison rather than a tautology:
 * the exhaustive rig is the DEFINITION and the indexed rig must reproduce it exactly.
 *
 * @param {any} node
 * @param {boolean} indexed
 * @returns {Array<{ring:any, parts:any, near:(x:number,y:number)=>{d2:number,qx:number,qy:number},
 *                  inside:(x:number,y:number)=>boolean}>}
 */
function bandRigs(node, indexed) {
  const out = [];
  for (const ring of node.rings) {
    // ⚠ THE FILTER IS THE ACCESSORS' OWN, VERBATIM. Old cores do not partition district space:
    // a wall the city outgrew is a change of GRAIN, not a boundary (walls.js's own reading, and
    // the reason its band is its stones). A ring with no band has no faces to be a side of.
    if (ring.kind === 'old-core') continue;
    const parts = ring.bandParts;
    if (!parts) continue;
    const poly = ring.polygon;
    if (indexed) {
      const seg = ringNearestIndex(poly);
      const ins = ringIndex([poly]);
      out.push({ ring, parts, near: seg.nearest, inside: (x, y) => ins.contains(x, y) });
    } else {
      out.push({
        ring, parts,
        near: (x, y) => ringNearestSegment(poly, x, y),
        inside: (x, y) => pointInPoly(poly, x, y),
      });
    }
  }
  return out;
}

/** §232's SIDE OF THE WALL. −1 intramural, 0 in the reserved band, +1 extramural. */
function bandSideOf(rigs, x, y) {
  let side = 1;
  for (const rig of rigs) {
    const d = Math.sqrt(rig.near(x, y).d2);
    const signed = rig.inside(x, y) ? -d : d;
    if (signed >= rig.parts.shift - rig.parts.half && signed <= rig.parts.shift + rig.parts.half) return 0;
    if (signed < rig.parts.shift - rig.parts.half) side = -1;
  }
  return side;
}

/** Hold a point to its side of every working band, ring by ring, in the node's own order. */
function holdOf(rigs, x, y, wantSide) {
  let px = x, py = y;
  for (const rig of rigs) {
    // The nearest point on the ring, with the ring's own OUTWARD normal and the signed
    // distance (negative inside). One place knows how to measure against the circuit.
    const q = rig.near(px, py);
    const d = Math.sqrt(q.d2);
    const inside = rig.inside(px, py);
    let nx = d > 1e-9 ? (px - q.qx) / d : 0, ny = d > 1e-9 ? (py - q.qy) / d : 0;
    if (inside) { nx = -nx; ny = -ny; }
    const signed = inside ? -d : d;
    const lo = rig.parts.shift - rig.parts.half, hi = rig.parts.shift + rig.parts.half;
    if (signed >= lo && signed <= hi) continue;          // in the band: legal for either side
    const side = signed < lo ? -1 : 1;
    if (side === wantSide) continue;
    const target = wantSide < 0 ? lo : hi;
    px = q.qx + nx * target;
    py = q.qy + ny * target;
  }
  return [px, py];
}

/**
 * ⭐⭐⭐ ACCESSOR — THE MEASURING INSTRUMENT. Verifies the node ONCE, builds the ring index ONCE,
 * and answers §232's two questions as many times as one derivation pass needs.
 *
 * ⚠ THE GUARANTEE IT CARRIES, EXACTLY, AND IT IS THE ONE `publishCircuitRings` ALREADY CARRIES:
 * the freshness gate runs when the instrument is ACQUIRED, so a consumer cannot measure a wall
 * that is not this fabric's wall. It does not re-check between two questions asked of the same
 * probe — which is the same declared limit the published `fabric.walls` getter states, for the
 * same reason, and a probe's lifetime is one synchronous pass inside one derivation.
 * ⛔ A CONSUMER THAT WANTS PER-CALL VERIFICATION USES THE ONE-SHOT ACCESSORS BELOW. They are
 * unchanged, and the §230 counterfactual pins fire on them.
 */
export function circuitProbe(node) {
  verifyCircuit(node);
  const rigs = bandRigs(node, true);
  return {
    side: (x, y) => bandSideOf(rigs, x, y),
    hold: (x, y, wantSide) => holdOf(rigs, x, y, wantSide),
    rings: rigs.length,
  };
}

/**
 * ⭐ THE EXHAUSTIVE TWIN — the DEFINITION of the two accessors, walked rather than indexed, and
 * exported so the equivalence pin has a reference that is not the thing under test.
 * ⚠ It verifies once, like the probe: the pin compares GEOMETRY, and running the freshness gate
 * n times would only make the reference slower, never more correct.
 */
export function circuitProbeExhaustive(node) {
  verifyCircuit(node);
  const rigs = bandRigs(node, false);
  return {
    side: (x, y) => bandSideOf(rigs, x, y),
    hold: (x, y, wantSide) => holdOf(rigs, x, y, wantSide),
    rings: rigs.length,
  };
}

/**
 * ⭐⭐ ACCESSOR — §232's SIDE OF THE WALL, one question, one freshness check. −1 intramural,
 * 0 in the reserved band, +1 extramural.
 */
export function circuitBandSide(node, x, y) {
  verifyCircuit(node);
  return bandSideOf(bandRigs(node, false), x, y);
}

/**
 * ⭐⭐ ACCESSOR — HOLD A POINT TO ITS SIDE OF THE BAND (§232's "a district CLIPS at the wall").
 * Returns the point unchanged when it is already legal, and otherwise the point moved to the
 * band's own face along the circuit's outward normal. ⚠ IT IS A PROJECTION, NOT A MARCH: an
 * earlier spelling stepped toward the region's centroid, which for a crescent-shaped faubourg
 * wrapping its own gate points ACROSS the wall — it cured the intramural region and created a
 * straddle in the extramural one. **A "move it back inside" that takes its direction from the
 * region rather than from the boundary can move it further out.**
 */
export function circuitHold(node, x, y, wantSide) {
  verifyCircuit(node);
  return holdOf(bandRigs(node, false), x, y, wantSide);
}

/** Convenience for consumers that only need "is this leaf walled". */
export function circuitRings(node) { return verifyCircuit(node).rings; }
