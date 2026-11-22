/**
 * domain/townMap/arch/conditionParams.js -- K-4: THE SINGLE WRITER OF DRIFT INTO GEOMETRY.
 *
 * The kernel doc's K-4 (docs/KERNEL_MAX_PROGRAM.md): "conditionParams.js is the SINGLE WRITER of drift
 * into geometry." K-2 resolved a settlement's state into a typed DRESS (conditionGrammar.js selects
 * tokens; settlementDress.js folds the one coherent dress + per-building specialization; dressRoleAlbedo
 * lowers it into the plate's role->albedo -- ALBEDO only, zero geometry). This module is the missing half:
 * it takes a building's frozen params + its resolved dress and WRITES the drift into actual MESH geometry
 * -- statuary placed as instanced kit assets, war damage as ruin solids, the recorded history mark as a
 * relief band -- appended to the base grammar's terminals and emitted through the K-1 mesh emitter. It is
 * the ONE place a conditionVector becomes triangles; every other arch module is condition-agnostic (the
 * base rulesets) or selection-only (the dress layer).
 *
 * THE LAWS IT KEEPS:
 *   - THE PROMISE / determinism: same (seedId, anchorKey, conditionVector) -> byte-identical geometry.
 *     No trig, no Date, no random; placement is a pure function of the building envelope + the dress.
 *   - DORMANCY (the frozen contract, params.js: "a grammar with the neutral vector == a grammar with no
 *     vector"): drift geometry is a DEVIATION FROM THE NEUTRAL reference -- the neutral conditionVector
 *     (and an absent vector) add ZERO drift terminals, so the drifted mesh is byte-identical to the base.
 *     Statuary is added only for a beneficent/macabre LEAN (neutral 'neutral' adds none); war damage only
 *     ABOVE the neutral damage index (the pristine base is never "un-damaged"); relief only for a recorded
 *     history mark (neutral historyMark = 0 -> none).
 *   - THE SALIENCY BUDGET (doc): drift terminals <= 25% of the base at signature, 15% at commons, ~0
 *     ("1 bit") at glyph; PRIORITY-TRUNCATED -- recorded causal truth (war damage, then the history mark)
 *     before alignment statuary, so an over-budget building keeps the truth and drops the flourish.
 *   - COVERT SECURITY: geometry is a function of alignment / moral / warScar / historyMark / emblem ONLY.
 *     It never reads corruption (covert OR revealed -- corruption dresses ALBEDO in K-2, never structure),
 *     so the map's STRUCTURE can never leak what the dossier hides (the covert negative control).
 *   - FAIL-CLOSED: the drifted mesh is metered against HARD_TIER_CEILINGS and throws on a breach.
 *
 * PURITY: {+,-,*,/} + Math.round/min/max/floor; 0 transcendental sites (the arch view-wall scan + the
 * transcendental ratchet hold this file at 0). Imported by NOTHING shipped -- the kernel stays dormant.
 *
 * @typedef {import('./ops.js').TerminalRec} TerminalRec
 * @typedef {import('./settlementDress.js').BuildingDress} BuildingDress
 * @typedef {import('./grammarIR.js').Ruleset} Ruleset
 * @typedef {Readonly<Record<string, number>>} ConditionVector
 * @typedef {{ min: number[], max: number[] }} Envelope
 */

import { interpret } from './interpreter.js';
import { emitMesh } from './emitter.js';
import { KIT_ASSETS } from './kit.js';
import { childPath, HARD_TIER_CEILINGS } from './grammarIR.js';
import { neutralConditionVector, assertConditionVector, ORNAMENT_DENSITY } from './params.js';
import { DAMAGE_STATES } from './conditionGrammar.js';
import { resolveSettlementDress, driftBuildingDress } from './settlementDress.js';

/**
 * SALIENCY_FRACTION -- the per-tier drift budget as a fraction of the base building's TRIANGLE count
 * (doc: drift <=25% signature / <=15% commons / ~0 "1 bit" glyph). Triangles, not terminals: it expresses
 * "drift is <=25% of the building's visual mass" uniformly whether the host is a 2,000-tri cathedral or a
 * 40-tri massing block -- a rich signature carries statuary + damage + a relief band; a bare massing block
 * carries at most a token, its condition otherwise read through the K-2 albedo dress. Glyph carries no
 * drift, so a distant silhouette is byte-identical to its base for every condition.
 * @type {Readonly<Record<number, number>>}
 */
export const SALIENCY_FRACTION = Object.freeze({ 0: 0, 1: 0.15, 2: 0.25 });

/** the drift-class priority: recorded causal truth (war damage, then the recorded history mark) before
 *  alignment statuary. An over-budget building keeps the truth and drops the flourish. @type {ReadonlyArray<string>} */
export const DRIFT_PRIORITY = Object.freeze(['damage', 'relief', 'statuary']);

/** triangles per drift primitive kind (box = 6 quads; spire = 4 sides + a base quad) -- the budget estimate. @type {Readonly<Record<string, number>>} */
const TRIS_PER_KIND = Object.freeze({ box: 12, spire: 6 });

/** estimate the triangle count of a drift terminal list (box/spire primitives). @param {ReadonlyArray<TerminalRec>} terms @returns {number} */
function estimateTris(terms) {
  let n = 0;
  for (const t of terms) n += TRIS_PER_KIND[t.kind] || 0;
  return n;
}

/** the statuary modes that read as a LEAN worth a drift statue (neutral/none add no drift statuary). @type {ReadonlyArray<string>} */
const LEAN_MODES = Object.freeze(['beneficent', 'macabre']);

// ── TERMINAL CONSTRUCTORS (the ops.js TerminalRec shape) ─────────────────────────────────────────

/** a drift BOX terminal. @param {string} role @param {number} tier @param {string} path @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {TerminalRec} */
function boxTerm(role, tier, path, x0, x1, y0, y1, z0, z1) {
  return {
    path, sym: 'drift', role, tier, kind: 'box', spec: { x0, x1, y0, y1, z0, z1 },
    aabb: { min: [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)], max: [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)] },
  };
}

/** expand a kit asset into drift terminals at a placement box. @param {string} asset @param {Envelope} aabb @param {string} role @param {number} tier @param {string} path @returns {TerminalRec[]} */
function kitTerms(asset, aabb, role, tier, path) {
  const fn = KIT_ASSETS[asset];
  if (!fn) throw new Error(`arch/conditionParams: statuary asset "${asset}" is not a registered kit asset`);
  return fn(aabb, role).map((t, i) => ({ ...t, path: childPath(path, `${asset}.${i}`), sym: 'drift', tier }));
}

/** the AABB envelope over a terminal list. @param {ReadonlyArray<TerminalRec>} terminals @returns {Envelope} */
function envelopeOf(terminals) {
  /** @type {number[]} */ const mn = [Infinity, Infinity, Infinity];
  /** @type {number[]} */ const mx = [-Infinity, -Infinity, -Infinity];
  for (const t of terminals) for (let k = 0; k < 3; k++) { if (t.aabb.min[k] < mn[k]) mn[k] = t.aabb.min[k]; if (t.aabb.max[k] > mx[k]) mx[k] = t.aabb.max[k]; }
  return { min: mn, max: mx };
}

// ── THE DRIFT SPEC (deviation from the neutral reference -> zero drift at neutral) ────────────────

/**
 * The drift spec: what geometry the dress asks for, measured AS A DEVIATION from the neutral dress so
 * the neutral vector adds nothing. @param {ConditionVector} cv @param {BuildingDress} dress
 * @param {BuildingDress} neutralDress @param {number} tier
 * @returns {{ statMode: string, statVocab: ReadonlyArray<string>, statCount: number, dmgDelta: number, hasHistory: boolean, reliefMotif: number }}
 */
function driftSpec(cv, dress, neutralDress, tier) {
  const lean = LEAN_MODES.includes(dress.statuaryMode);
  const ornIdx = Math.max(0, ORNAMENT_DENSITY.indexOf(dress.ornamentDensity)); // 0..3
  const statCount = !lean ? 0 : tier === 1 ? Math.min(2, Math.max(1, ornIdx)) : Math.min(4, ornIdx + 1);
  const dmgDelta = Math.max(0, DAMAGE_STATES.indexOf(dress.damageState) - DAMAGE_STATES.indexOf(neutralDress.damageState));
  const hasHistory = Math.round(cv.historyMark) > 0;
  return { statMode: dress.statuaryMode, statVocab: dress.statuaryVocab, statCount, dmgDelta, hasHistory, reliefMotif: dress.reliefMotif };
}

// ── THE DRIFT-GEOMETRY COMPOSERS (each: spec -> TerminalRec[]) ────────────────────────────────────

/** alignment STATUARY: instanced kit assets along a frieze band on the upper front face. @param {ReturnType<typeof driftSpec>} spec @param {Envelope} env @param {number} tier @param {string} path @returns {TerminalRec[]} */
function statuaryTerminals(spec, env, tier, path) {
  if (spec.statCount <= 0 || spec.statVocab.length === 0) return [];
  const w = env.max[0] - env.min[0], d = env.max[2] - env.min[2], h = env.max[1] - env.min[1];
  const slot = Math.max(6, Math.min(w, d) * 0.10);
  const bandY = env.min[1] + h * 0.66, front = env.max[2];
  const n = spec.statCount;
  /** @type {TerminalRec[]} */ const out = [];
  // statuary sits FLUSH against the front face, extending INWARD (z <= front) so the drift never grows the
  // base footprint -- the LOD silhouette law (glyph == signature footprint; pops change detail, not shape).
  for (let i = 0; i < n; i++) {
    const cx = env.min[0] + (w * (i + 1)) / (n + 1);
    const asset = spec.statVocab[i % spec.statVocab.length];
    const aabb = { min: [cx - slot / 2, bandY, front - slot], max: [cx + slot / 2, bandY + slot * 1.6, front] };
    for (const t of kitTerms(asset, aabb, 'relief', tier, childPath(path, `s${i}`))) out.push(t);
  }
  return out;
}

/** REVEALED war DAMAGE as ruin solids, scaled by the deviation above the neutral damage. @param {ReturnType<typeof driftSpec>} spec @param {Envelope} env @param {number} tier @param {string} path @returns {TerminalRec[]} */
function damageTerminals(spec, env, tier, path) {
  if (spec.dmgDelta <= 0) return [];
  const w = env.max[0] - env.min[0], d = env.max[2] - env.min[2], h = env.max[1] - env.min[1];
  const t = Math.max(4, Math.min(w, d) * 0.06), base = env.min[1], front = env.max[2];
  /** @type {TerminalRec[]} */ const out = [];
  // all ruin stays WITHIN the base envelope (x >= min, z <= front) so damage never grows the footprint.
  // >=1 shored: a raking buttress strut flush against the west wall
  out.push(boxTerm('buttressStone', tier, childPath(path, 'shore'), env.min[0], env.min[0] + t * 1.6, base, base + h * 0.5, env.min[2] + d * 0.4, env.min[2] + d * 0.4 + t * 2));
  if (spec.dmgDelta >= 2) { // broken: rubble at a base corner
    out.push(boxTerm('groundStone', tier, childPath(path, 'rub0'), env.min[0], env.min[0] + t * 2.5, base, base + t * 1.5, front - t * 2, front));
    out.push(boxTerm('groundStone', tier, childPath(path, 'rub1'), env.min[0] + t * 0.8, env.min[0] + t * 2, base, base + t * 0.9, front - t * 3.4, front - t * 1.7));
  }
  if (spec.dmgDelta >= 3) { // patched: a dressed-stone patch set INTO the front face
    out.push(boxTerm('dressedStone', tier, childPath(path, 'patch'), env.min[0] + w * 0.42, env.min[0] + w * 0.6, base + h * 0.3, base + h * 0.55, front - t * 0.6, front));
  }
  return out;
}

/** the recorded HISTORY MARK as a relief-band course on the front face (a mural, never text). Its block
 *  count reads the finite motif (never fades below the record). @param {ReturnType<typeof driftSpec>} spec @param {Envelope} env @param {number} tier @param {string} path @returns {TerminalRec[]} */
function reliefTerminals(spec, env, tier, path) {
  if (!spec.hasHistory) return [];
  const w = env.max[0] - env.min[0], h = env.max[1] - env.min[1], front = env.max[2];
  const motif = (((spec.reliefMotif % 16) + 16) % 16);
  const N = 5 + (motif % 6);                            // the motif reads as the band's block count (5..10)
  const bandY = env.min[1] + h * 0.42, bh = Math.max(4, h * 0.05), bt = Math.max(2, w * 0.02);
  const span = w * 0.9, x0 = env.min[0] + w * 0.05, cell = span / N, bw = cell * 0.78;
  // the relief course is set INTO the front face (z <= front) so it never grows the base footprint.
  /** @type {TerminalRec[]} */ const out = [];
  for (let i = 0; i < N; i++) {
    const lx = x0 + i * cell;
    out.push(boxTerm('relief', tier, childPath(path, `r${i}`), lx, lx + bw, bandY, bandY + bh, front - bt, front));
  }
  return out;
}

/**
 * driftTerminals -- THE drift geometry, priority-truncated to the saliency TRIANGLE budget. Glyph
 * carries none. @param {ConditionVector} cv @param {BuildingDress} dress @param {BuildingDress} neutralDress
 * @param {Envelope} env @param {number} tier @param {number} baseTriangles @param {string} path
 * @returns {TerminalRec[]}
 */
export function driftTerminals(cv, dress, neutralDress, env, tier, baseTriangles, path) {
  const budget = Math.floor(baseTriangles * (SALIENCY_FRACTION[tier] || 0));
  if (budget <= 0) return [];
  const spec = driftSpec(cv, dress, neutralDress, tier);
  const byClass = {
    damage: damageTerminals(spec, env, tier, childPath(path, 'dmg')),
    relief: reliefTerminals(spec, env, tier, childPath(path, 'rel')),
    statuary: statuaryTerminals(spec, env, tier, childPath(path, 'stat')),
  };
  /** @type {TerminalRec[]} */ const out = [];
  let usedTris = 0;
  for (const cls of DRIFT_PRIORITY) {
    const terms = /** @type {TerminalRec[]} */ (byClass[/** @type {'damage'|'relief'|'statuary'} */ (cls)]);
    if (terms.length === 0) continue;
    const tris = estimateTris(terms);
    if (usedTris + tris > budget) break; // strict priority truncation: keep the truth, drop the flourish
    for (const term of terms) out.push(term);
    usedTris += tris;
  }
  return out;
}

/**
 * resolveDrift -- the resolved dress + spec for a building (for the writer, the exhibit, and the tests).
 * @param {{ seedId: string, anchorKey: string, archetype: string, conditionVector?: ConditionVector, tier: number }} opts
 * @returns {{ dress: BuildingDress, neutralDress: BuildingDress, spec: ReturnType<typeof driftSpec>|null }}
 */
export function resolveDrift(opts) {
  const { seedId, anchorKey, archetype, tier } = opts;
  const nSettlement = resolveSettlementDress(seedId, anchorKey, neutralConditionVector());
  const neutralDress = driftBuildingDress(nSettlement, archetype, neutralConditionVector());
  if (!opts.conditionVector) return { dress: neutralDress, neutralDress, spec: null };
  const cv = assertConditionVector(opts.conditionVector);
  const settlement = resolveSettlementDress(seedId, anchorKey, cv);
  const dress = driftBuildingDress(settlement, archetype, cv);
  return { dress, neutralDress, spec: driftSpec(cv, dress, neutralDress, tier) };
}

/**
 * writeDriftedMesh -- THE SINGLE WRITER. Interpret the base ruleset, append the drift geometry, emit the
 * combined mesh, fail-closed on the tier ceiling. An ABSENT conditionVector adds no drift -> the mesh is
 * byte-identical to buildArchMesh(baseRuleset) (dormancy); the neutral vector adds no drift either
 * (deviation-from-neutral), honoring the frozen "neutral == no vector" contract.
 * @param {Ruleset} baseRuleset
 * @param {{ seedId: string, anchorKey: string, archetype: string, conditionVector?: ConditionVector, tier: number }} opts
 * @returns {ReturnType<typeof emitMesh>}
 */
export function writeDriftedMesh(baseRuleset, opts) {
  const { seedId, archetype, tier } = opts;
  const base = interpret(baseRuleset, { seedId, tier });
  const baseTerminals = base.terminals;
  // emit the base once to measure its triangle mass (the saliency budget denominator); absent a drift
  // vector this IS the returned mesh (dormancy -- byte-identical to buildArchMesh).
  const baseMesh = emitMesh(baseTerminals);
  /** @type {ReturnType<typeof emitMesh>} */ let mesh = baseMesh;
  if (opts.conditionVector) {
    const cv = assertConditionVector(opts.conditionVector);
    const settlement = resolveSettlementDress(seedId, opts.anchorKey, cv);
    const dress = driftBuildingDress(settlement, archetype, cv);
    const nSettlement = resolveSettlementDress(seedId, opts.anchorKey, neutralConditionVector());
    const neutralDress = driftBuildingDress(nSettlement, archetype, neutralConditionVector());
    const env = envelopeOf(baseTerminals);
    const drift = driftTerminals(cv, dress, neutralDress, env, tier, baseMesh.triangleCount, 'drift');
    if (drift.length) mesh = emitMesh(baseTerminals.concat(drift));
  }
  const ceil = HARD_TIER_CEILINGS[tier];
  if (!ceil) throw new Error(`arch/conditionParams: unknown LOD tier ${tier}`);
  if (mesh.triangleCount > ceil.triangles) throw new Error(`arch/conditionParams: drift breached the triangle ceiling ${ceil.triangles} at tier ${tier} (${mesh.triangleCount})`);
  if (mesh.vertexCount > ceil.vertices) throw new Error(`arch/conditionParams: drift breached the vertex ceiling ${ceil.vertices} at tier ${tier} (${mesh.vertexCount})`);
  return mesh;
}
