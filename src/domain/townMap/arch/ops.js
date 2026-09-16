/**
 * domain/townMap/arch/ops.js -- K-1 GRAMMAR: the 12-op registry (the shape-grammar vocabulary).
 *
 * Each op is a PURE handler (ctx, shape, args) -> { children, terminals, pending } over frozen data.
 * The interpreter dispatches on op name and FAILS CLOSED on an unregistered op. The twelve:
 *
 *   MASSING / SUBDIVISION (produce child shapes)
 *     split   -- subdivide the local box along an axis into named parts (absolute | weight `*` |
 *                remainder `~`), with an optional repeat count (tiling); the CGA core.
 *     comp    -- select a named component region/face of the box (top / front / a face slab).
 *     extrude -- set the box's depth along an axis (a footprint becomes a solid of given thickness).
 *     inset   -- shrink the box inward by per-axis margins (convex + rectilinear ONLY).
 *     offset  -- translate/grow the box by a per-axis delta.
 *     orient  -- replace the child's frame by a SELECTED finite frame (index + reflect); no trig.
 *     defer   -- LOD branch: pick the child set for ctx.tier from ONE derivation prefix.
 *
 *   TERMINALS (produce mesh terminal records)
 *     emit    -- a base solid: box | spire (explicit world spec OR scope-derived AABB).
 *     prism   -- an n-gon radial prism (curved massing) on the pinned N_GON_DIRS.
 *     sweep   -- a moulding profile swept along a Bezier (profile='square' === addTube).
 *     instance-- place a registered kit asset (expands to sub-terminals; K-3 fills the registry).
 *
 *   CROSS-SHAPE (phase 2, over the frozen occlusion index)
 *     occlude -- record a PENDING branch resolved after the massing index freezes (then/else by a
 *                predicate over the frozen index). The two-phase CGA++ gate.
 *
 * PURITY: {+,-,*,/} + Math.sqrt via helpers; 0 transcendental sites. All stochastic choice comes
 * from ctx.prng(shape.path) -- keyed by the stable derivation path (never restamped).
 *
 * @typedef {import('./grammarIR.js').Shape} Shape
 * @typedef {import('./grammarIR.js').Scope} Scope
 * @typedef {import('./grammarIR.js').InterpCtx} Ctx
 * @typedef {import('./grammarIR.js').OpArgs} OpArgs
 * @typedef {import('./grammarIR.js').ArgScalar} ArgScalar
 * @typedef {number[]} V3
 * @typedef {{ path: string, sym: string, role: string, tier: number, kind: string, spec: any, aabb: { min: number[], max: number[] } }} TerminalRec
 * @typedef {{ shape: Shape, args: OpArgs }} Pending
 * @typedef {{ children: Shape[], terminals: TerminalRec[], pending: Pending[] }} OpResult
 */

import { makeShape, childPath, assertRole } from './grammarIR.js';
import { resolveFrame, placeLocal } from './frames.js';
import { KIT_ASSETS } from './kit.js';

/** empty op result. @returns {OpResult} */
function emptyResult() { return { children: [], terminals: [], pending: [] }; }

/**
 * Resolve an arg value: a literal number/string/bool passes through; `{ param: 'k' }` reads the
 * shape's params; `{ prng: [lo, hi] }` draws a keyed uniform from ctx (deterministic on the path).
 * @param {Ctx} ctx @param {Shape} shape @param {any} v @returns {any}
 */
function resolveArg(ctx, shape, v) {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if ('param' in v) {
      const p = shape.attrs.params[v.param];
      if (p === undefined) throw new Error(`arch/ops: param "${v.param}" missing on shape ${shape.path}`);
      return p;
    }
    if ('prng' in v) {
      const [lo, hi] = v.prng;
      const u = ctx.rand(shape.path, v.salt || 0);
      return lo + (hi - lo) * u;
    }
  }
  return v;
}

/** child scope covering local sub-box [lo,hi] (each component in [0,1]) of the parent. @param {Scope} sc @param {V3} lo @param {V3} hi @returns {Scope} */
function subScope(sc, lo, hi) {
  const frame = resolveFrame(sc.frameRef);
  const origin = placeLocal(sc.origin, sc.size, frame, lo);
  /** @type {V3} */ const size = [
    (hi[0] - lo[0]) * sc.size[0], (hi[1] - lo[1]) * sc.size[1], (hi[2] - lo[2]) * sc.size[2],
  ];
  return { origin, frameRef: sc.frameRef, size };
}

/** the 8 world corners of a scope's unit box, and their AABB. @param {Scope} sc @returns {{ min: V3, max: V3 }} */
export function scopeAabb(sc) {
  const frame = resolveFrame(sc.frameRef);
  /** @type {V3} */ let mn = [Infinity, Infinity, Infinity];
  /** @type {V3} */ let mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < 8; i++) {
    const c = placeLocal(sc.origin, sc.size, frame, [i & 1, (i >> 1) & 1, (i >> 2) & 1]);
    for (let k = 0; k < 3; k++) { if (c[k] < mn[k]) mn[k] = c[k]; if (c[k] > mx[k]) mx[k] = c[k]; }
  }
  return { min: mn, max: mx };
}

/** make a child shape with an inherited/patched attr bag + a tagged path. @param {Shape} parent @param {string} sym @param {Scope} scope @param {string} tag @param {{ materialRole?: string, params?: object }} [patch] @returns {Shape} */
function makeChild(parent, sym, scope, tag, patch) {
  const a = parent.attrs;
  const attrs = {
    materialRole: patch && patch.materialRole ? assertRole(patch.materialRole) : a.materialRole,
    lodTier: a.lodTier,
    params: patch && patch.params ? Object.freeze({ ...a.params, ...patch.params }) : a.params,
  };
  return makeShape(sym, scope, attrs, childPath(parent.path, tag));
}

/** aabb of a world box spec. @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {{min:V3,max:V3}} */
function boxAabb(x0, x1, y0, y1, z0, z1) {
  return { min: [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)], max: [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)] };
}

// ── SUBDIVISION OPS ─────────────────────────────────────────────────────────────────────────────

/** axis name -> component index. */
const AXIS = /** @type {Record<string, number>} */ ({ x: 0, y: 1, z: 2 });

/**
 * split(axis, parts): parts is [{ size, sym, tag?, role? }...]; size is a positive number (absolute
 * world units), `'*'`/`{weight}` (share of the flexible remainder), or `'~'` (the single remainder
 * part). An optional `repeat` on a part tiles it to fill its span. Children slice the parent along
 * `axis` in order.
 */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opSplit(ctx, shape, args) {
  const res = emptyResult();
  const ax = AXIS[args.axis];
  if (ax === undefined) throw new Error(`arch/ops: split axis "${args.axis}" invalid`);
  const total = shape.scope.size[ax];
  const parts = args.parts;
  // first pass: sum absolute + count weights
  let absSum = 0, weightSum = 0, hasRemainder = false;
  for (const p of parts) {
    const s = resolveArg(ctx, shape, p.size);
    if (s === '~') hasRemainder = true;
    else if (s === '*' || (s && typeof s === 'object')) weightSum += (s === '*' ? 1 : (s.weight || 1));
    else absSum += (p.repeat ? s * resolveArg(ctx, shape, p.repeat) : s);
  }
  const flex = Math.max(0, total - absSum);
  const remainder = hasRemainder ? flex - 0 : 0;
  const weightUnit = weightSum > 0 ? (hasRemainder ? 0 : flex) / weightSum : 0;
  // second pass: lay out cursor 0..1 along axis
  let cursor = 0;
  let ord = 0;
  for (const p of parts) {
    const s = resolveArg(ctx, shape, p.size);
    const reps = p.repeat ? Math.max(1, Math.round(resolveArg(ctx, shape, p.repeat))) : 1;
    /** @type {number} */ let spanWorld;
    if (s === '~') spanWorld = remainder;
    else if (s === '*' || (s && typeof s === 'object')) spanWorld = weightUnit * (s === '*' ? 1 : (s.weight || 1));
    else spanWorld = s * reps;
    const each = spanWorld / reps;
    for (let r = 0; r < reps; r++) {
      const lo0 = cursor / total, hi0 = (cursor + each) / total;
      /** @type {V3} */ const lo = [0, 0, 0]; /** @type {V3} */ const hi = [1, 1, 1];
      lo[ax] = lo0; hi[ax] = hi0;
      const tag = reps > 1 ? `${p.tag || p.sym}.${r}` : `${p.tag || p.sym}.${ord}`;
      res.children.push(makeChild(shape, p.sym, subScope(shape.scope, lo, hi), tag, { materialRole: p.role, params: p.params }));
      cursor += each;
      ord++;
    }
  }
  return res;
}

/** comp(select): a named component region of the box. Faces are thin slabs at a chosen depth. */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opComp(ctx, shape, args) {
  const res = emptyResult();
  const t = resolveArg(ctx, shape, args.thickness ?? 0.04); // fractional slab thickness for a face
  /** @type {Record<string, [V3, V3]>} */
  const REGIONS = {
    top: [[0, 1 - t, 0], [1, 1, 1]],
    bottom: [[0, 0, 0], [1, t, 1]],
    front: [[0, 0, 1 - t], [1, 1, 1]],
    back: [[0, 0, 0], [1, 1, t]],
    left: [[0, 0, 0], [t, 1, 1]],
    right: [[1 - t, 0, 0], [1, 1, 1]],
    core: [[t, t, t], [1 - t, 1 - t, 1 - t]],
  };
  const r = REGIONS[args.select];
  if (!r) throw new Error(`arch/ops: comp select "${args.select}" invalid`);
  res.children.push(makeChild(shape, args.sym, subScope(shape.scope, r[0], r[1]), `comp.${args.select}`, { materialRole: args.role }));
  return res;
}

/** extrude(depth, axis='z'): set the box's size along `axis` to `depth`, keeping the low corner. */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opExtrude(ctx, shape, args) {
  const res = emptyResult();
  const ax = AXIS[args.axis || 'z'];
  const depth = resolveArg(ctx, shape, args.depth);
  const frac = shape.scope.size[ax] > 0 ? depth / shape.scope.size[ax] : 1;
  /** @type {V3} */ const lo = [0, 0, 0]; /** @type {V3} */ const hi = [1, 1, 1];
  hi[ax] = frac;
  res.children.push(makeChild(shape, args.sym, subScope(shape.scope, lo, hi), 'extrude', { materialRole: args.role }));
  return res;
}

/** inset(margins): shrink the box inward by per-axis WORLD margins (convex + rectilinear). */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opInset(ctx, shape, args) {
  const res = emptyResult();
  const sz = shape.scope.size;
  const m = args.margins; // { x?, y?, z? } world units
  const mx = resolveArg(ctx, shape, m.x || 0), my = resolveArg(ctx, shape, m.y || 0), mz = resolveArg(ctx, shape, m.z || 0);
  /** @type {V3} */ const lo = [sz[0] ? mx / sz[0] : 0, sz[1] ? my / sz[1] : 0, sz[2] ? mz / sz[2] : 0];
  /** @type {V3} */ const hi = [1 - lo[0], 1 - lo[1], 1 - lo[2]];
  for (let k = 0; k < 3; k++) if (hi[k] <= lo[k]) { hi[k] = lo[k] = 0.5; } // degenerate guard (fail-safe)
  res.children.push(makeChild(shape, args.sym, subScope(shape.scope, lo, hi), 'inset', { materialRole: args.role }));
  return res;
}

/** offset(delta): translate the low corner by per-axis WORLD delta; optional size scale. */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opOffset(ctx, shape, args) {
  const res = emptyResult();
  const sz = shape.scope.size;
  const d = args.delta || {};
  const dx = resolveArg(ctx, shape, d.x || 0), dy = resolveArg(ctx, shape, d.y || 0), dz = resolveArg(ctx, shape, d.z || 0);
  /** @type {V3} */ const lo = [sz[0] ? dx / sz[0] : 0, sz[1] ? dy / sz[1] : 0, sz[2] ? dz / sz[2] : 0];
  /** @type {V3} */ const hi = [lo[0] + 1, lo[1] + 1, lo[2] + 1];
  res.children.push(makeChild(shape, args.sym, subScope(shape.scope, lo, hi), 'offset', { materialRole: args.role }));
  return res;
}

/** orient(frameIndex, reflect): re-frame the child (a SELECTED finite orientation). */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opOrient(ctx, shape, args) {
  const res = emptyResult();
  const frameRef = { frameIndex: args.frameIndex | 0, reflect: args.reflect ? 1 : 0 };
  const scope = { origin: shape.scope.origin, frameRef, size: shape.scope.size };
  res.children.push(makeChild(shape, args.sym, /** @type {Scope} */ (scope), 'orient', { materialRole: args.role }));
  return res;
}

/** defer(tiers): { byTier: { [tier]: [ opInvocation | childSpec ] } } -- pick children for ctx.tier. */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opDefer(ctx, shape, args) {
  const res = emptyResult();
  const branch = args.byTier[ctx.tier] || args.byTier.default || [];
  let ord = 0;
  for (const spec of branch) {
    // a defer branch entry is { sym, tag?, role?, params?, scope? }: it re-expands under a new sym,
    // keeping the parent scope unless an explicit world scope is given (e.g. an instanced-asset slot).
    const scope = spec.scope ? /** @type {Scope} */ (spec.scope) : shape.scope;
    res.children.push(makeChild(shape, spec.sym, scope, `defer.${spec.tag || spec.sym}.${ord++}`, { materialRole: spec.role, params: spec.params }));
  }
  return res;
}

// ── TERMINAL OPS ────────────────────────────────────────────────────────────────────────────────

/** emit(kind): a base solid terminal. kind 'box' | 'spire'; explicit world spec or scope-derived. */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opEmit(ctx, shape, args) {
  const res = emptyResult();
  const role = assertRole(args.role || shape.attrs.materialRole);
  if (args.kind === 'box') {
    let x0, x1, y0, y1, z0, z1;
    if (args.box) { [x0, x1, y0, y1, z0, z1] = args.box.map((/** @type {ArgScalar} */ v) => resolveArg(ctx, shape, v)); }
    else { const b = scopeAabb(shape.scope); x0 = b.min[0]; x1 = b.max[0]; y0 = b.min[1]; y1 = b.max[1]; z0 = b.min[2]; z1 = b.max[2]; }
    res.terminals.push({ path: shape.path, sym: shape.sym, role, tier: shape.attrs.lodTier, kind: 'box', spec: { x0, x1, y0, y1, z0, z1 }, aabb: boxAabb(x0, x1, y0, y1, z0, z1) });
  } else if (args.kind === 'spire') {
    const s = args.spire.map((/** @type {ArgScalar} */ v) => resolveArg(ctx, shape, v));
    const [cx, cz, baseHalf, baseY, apexY, apexCx, apexCz] = s;
    const ax = apexCx === undefined ? cx : apexCx, az = apexCz === undefined ? cz : apexCz;
    const aabb = { min: [Math.min(cx - baseHalf, ax), Math.min(baseY, apexY), Math.min(cz - baseHalf, az)], max: [Math.max(cx + baseHalf, ax), Math.max(baseY, apexY), Math.max(cz + baseHalf, az)] };
    res.terminals.push({ path: shape.path, sym: shape.sym, role, tier: shape.attrs.lodTier, kind: 'spire', spec: { cx, cz, baseHalf, baseY, apexY, apexCx, apexCz }, aabb });
  } else if (args.kind === 'extrudeConvex') {
    // a convex u,v ring extruded from z0..z1 (mesh.js addExtrudedConvex) -- the gable + wall bands
    const ring = args.ring;
    const z0 = resolveArg(ctx, shape, args.z0), z1 = resolveArg(ctx, shape, args.z1);
    /** @type {V3} */ let mn = [Infinity, Infinity, Math.min(z0, z1)]; /** @type {V3} */ let mx = [-Infinity, -Infinity, Math.max(z0, z1)];
    for (const p of ring) { if (p[0] < mn[0]) mn[0] = p[0]; if (p[0] > mx[0]) mx[0] = p[0]; if (p[1] < mn[1]) mn[1] = p[1]; if (p[1] > mx[1]) mx[1] = p[1]; }
    res.terminals.push({ path: shape.path, sym: shape.sym, role, tier: shape.attrs.lodTier, kind: 'extrudeConvex', spec: { ring, z0, z1 }, aabb: { min: mn, max: mx } });
  } else {
    throw new Error(`arch/ops: emit kind "${args.kind}" invalid (box|spire|extrudeConvex)`);
  }
  return res;
}

/** prism(n, radius, y0, y1): an n-gon radial prism (curved massing) on the pinned N_GON_DIRS. */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opPrism(ctx, shape, args) {
  const res = emptyResult();
  const role = assertRole(args.role || shape.attrs.materialRole);
  const n = args.n | 0;
  const radius = resolveArg(ctx, shape, args.radius);
  const cx = resolveArg(ctx, shape, args.cx), cz = resolveArg(ctx, shape, args.cz);
  const y0 = resolveArg(ctx, shape, args.y0), y1 = resolveArg(ctx, shape, args.y1);
  const rot = args.rot ? resolveArg(ctx, shape, args.rot) : 0;
  const aabb = { min: [cx - radius, Math.min(y0, y1), cz - radius], max: [cx + radius, Math.max(y0, y1), cz + radius] };
  res.terminals.push({ path: shape.path, sym: shape.sym, role, tier: shape.attrs.lodTier, kind: 'prism', spec: { n, radius, cx, cz, y0, y1, rot }, aabb });
  return res;
}

/** sweep(profile, path, halfW, halfH): a moulding profile swept along a Bezier control path. */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opSweep(ctx, shape, args) {
  const res = emptyResult();
  const role = assertRole(args.role || shape.attrs.materialRole);
  /** @type {V3[]} */ const path = args.path || (args.pathParam ? shape.attrs.params[args.pathParam] : null);
  if (!path) throw new Error(`arch/ops: sweep needs args.path or a params path via pathParam (sym ${shape.sym})`);
  const halfW = resolveArg(ctx, shape, args.halfW), halfH = resolveArg(ctx, shape, args.halfH);
  /** @type {V3} */ let mn = [Infinity, Infinity, Infinity]; /** @type {V3} */ let mx = [-Infinity, -Infinity, -Infinity];
  const r = Math.max(halfW, halfH);
  for (const p of path) for (let k = 0; k < 3; k++) { if (p[k] - r < mn[k]) mn[k] = p[k] - r; if (p[k] + r > mx[k]) mx[k] = p[k] + r; }
  res.terminals.push({ path: shape.path, sym: shape.sym, role, tier: shape.attrs.lodTier, kind: 'sweep', spec: { path, profile: args.profile || 'square', halfW, halfH, refUp: args.refUp || null }, aabb: { min: mn, max: mx } });
  return res;
}

/** instance(asset): place a registered kit asset -> its sub-terminal children, placed at the scope. */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opInstance(ctx, shape, args) {
  const res = emptyResult();
  const asset = KIT_ASSETS[args.asset];
  if (!asset) throw new Error(`arch/ops: kit asset "${args.asset}" is not registered`);
  const b = scopeAabb(shape.scope);
  let ord = 0;
  for (const t of asset(b, args.role || shape.attrs.materialRole)) {
    res.terminals.push({ ...t, path: childPath(shape.path, `inst.${args.asset}.${ord++}`), sym: shape.sym, tier: shape.attrs.lodTier });
  }
  return res;
}

// ── CROSS-SHAPE (phase 2) ─────────────────────────────────────────────────────────────────────

/** occlude(predicate): defer a then/else branch to phase 2 (after the massing index freezes). */
/** @param {Ctx} ctx @param {Shape} shape @param {OpArgs} args @returns {OpResult} */
function opOcclude(ctx, shape, args) {
  const res = emptyResult();
  if (!ctx.occlusionIndex) { res.pending.push({ shape, args }); return res; }
  // phase 2: resolve against the frozen index
  const p = args.at ? args.at.map((/** @type {ArgScalar} */ v) => resolveArg(ctx, shape, v)) : scopeCenter(shape.scope);
  const occluded = ctx.occlusionIndex.solidAt(/** @type {V3} */ (p));
  const chosen = occluded ? args.then : args.else;
  if (chosen) res.children.push(makeChild(shape, chosen.sym, shape.scope, `occlude.${occluded ? 'then' : 'else'}`, { materialRole: chosen.role }));
  return res;
}

/** center of a scope's box. @param {Scope} sc @returns {V3} */
function scopeCenter(sc) {
  const frame = resolveFrame(sc.frameRef);
  return placeLocal(sc.origin, sc.size, frame, [0.5, 0.5, 0.5]);
}

/**
 * THE OP REGISTRY (frozen). The interpreter fails closed on any op name not present here.
 * @type {Readonly<Record<string, (ctx: Ctx, shape: Shape, args: OpArgs) => OpResult>>}
 */
export const OPS = Object.freeze({
  split: opSplit,
  comp: opComp,
  extrude: opExtrude,
  inset: opInset,
  offset: opOffset,
  orient: opOrient,
  defer: opDefer,
  emit: opEmit,
  prism: opPrism,
  sweep: opSweep,
  instance: opInstance,
  occlude: opOcclude,
});

/** The registered op names (exactly twelve). @type {ReadonlyArray<string>} */
export const OP_NAMES = Object.freeze(Object.keys(OPS));
