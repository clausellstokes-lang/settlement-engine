/**
 * constructionUsage.js — coarse, id-free derivations for the Analytics v2
 * construction-insight groupings (DESIGN_ANALYTICS_V2 §1.2 settlement construction +
 * §1.3 realm construction). Two enrich-existing-props signals:
 *
 *   - configArchetype(config)  → the priority-PROFILE cluster a settlement was asked to
 *     be ('martial' | 'mercantile' | 'pious' | 'arcane' | 'criminal-leaning' | 'balanced').
 *     Enriches GENERATION_COMPLETED — the demand signal for what players build.
 *   - realmShape(graph, saves) → { topology_class, settlement_count_band, tier_mix } for a
 *     realm at canonize — the new realm-construction tier of aggregation (§1.3).
 *
 * ── DETERMINISM (side-channel, never engine state) ────────────────────────────
 * Pure READ of already-final config / regionalGraph. No mutation, no engine feedback,
 * not part of worldState — so same-seed byte-identity and all goldens are untouched
 * (telemetry is never in the golden comparison).
 *
 * ── FIRST-PAINT BUDGET (keep LAZY) ────────────────────────────────────────────
 * Imported ONLY from lazy paths (settlementSlice's GENERATION_COMPLETED dynamic-import
 * block, and the canonize actions). It must NOT be statically imported by any eager
 * store slice / boot module, or its bytes enter the first-paint entry closure. Kept
 * dependency-free (no domain/fingerprint imports) so it can never drag a heavy graph
 * into a hot chunk.
 *
 * ── PROP HYGIENE ─────────────────────────────────────────────────────────────
 * Emits ONLY enums / bands / counts. NEVER a settlement/NPC id, name, seed, or coord.
 * Node/edge ids are read for DEGREE COUNTING only; the ids themselves are never emitted.
 */

const isObj = (v) => !!v && typeof v === 'object';
const arr = (v) => (Array.isArray(v) ? v : []);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

// ── §1.2 config archetype (priority-profile cluster) ──────────────────────────
// Maps the five 0–100 priority sliders to the design's small named taxonomy by the
// DOMINANT axis. A near-flat profile (the default 50s, or no axis meaningfully ahead)
// reads 'balanced' — itself a real demand signal (the user expressed no preference).
const AXIS_TO_ARCHETYPE = {
  military: 'martial',
  economy: 'mercantile',
  religion: 'pious',
  magic: 'arcane',
  criminal: 'criminal-leaning',
};
// A dominant axis must lead the profile mean by at least this much to name the cluster;
// below it the profile is 'balanced'. Chosen so the default 50s (mean-lead 0) are
// balanced while a clear preset lead (e.g. military 92 vs mean ~42) names its axis.
const ARCHETYPE_LEAD_MARGIN = 12;

/**
 * The priority-profile cluster a settlement config was asked to be. Pure; id-free.
 * @param {any} config - settlement.config (or the wizard config)
 * @returns {'martial'|'mercantile'|'pious'|'arcane'|'criminal-leaning'|'balanced'}
 */
export function configArchetype(config) {
  const c = isObj(config) ? config : {};
  const axes = {
    military: num(c.priorityMilitary),
    economy: num(c.priorityEconomy),
    religion: num(c.priorityReligion),
    magic: num(c.priorityMagic),
    criminal: num(c.priorityCriminal),
  };
  let topKey = null; let topVal = -Infinity; let sum = 0; let n = 0;
  for (const [k, v] of Object.entries(axes)) {
    if (Number.isFinite(v)) { sum += v; n += 1; if (v > topVal) { topVal = v; topKey = k; } }
  }
  if (!n) return 'balanced';
  const mean = sum / n;
  if (topKey && topVal - mean >= ARCHETYPE_LEAD_MARGIN) return AXIS_TO_ARCHETYPE[topKey];
  return 'balanced';
}

// ── §1.3 realm shape (settlement count band + tier mix + topology class) ───────
function settlementCountBand(n) {
  const c = Number(n) || 0;
  if (c <= 1) return 'single';
  if (c <= 4) return '2_4';
  if (c <= 9) return '5_9';
  if (c <= 19) return '10_19';
  return 'gt_20';
}

/** Tally an enum field over a node/settlement list (id-free: counts by tier). */
function tierMix(list) {
  const out = {};
  for (const it of arr(list)) {
    const t = it && (it.tier ?? it.settType);
    if (typeof t === 'string' && t.length <= 40) out[t] = (out[t] || 0) + 1;
  }
  return out;
}

/**
 * Coarse topology class from the realm graph's degree distribution:
 *   scattered      — sparse / many isolated settlements (avg degree < 1)
 *   hub-and-spoke  — one dominant hub most others connect through
 *   coastal-ring   — a cycle (~all degree 2, no endpoints)
 *   linear-valley  — a path/chain (mostly degree 2 with the two path endpoints)
 * Reads node/edge ids for degree counting ONLY; never emits an id. Edges are the
 * settlement-relationship adjacency; falls back to channels when no edges exist.
 */
function topologyClass(nodes, edges) {
  const n = nodes.length;
  if (n < 3) return 'scattered'; // too small to have a discernible shape
  const deg = {};
  for (const nd of nodes) { const id = nd && nd.id != null ? String(nd.id) : null; if (id) deg[id] = 0; }
  let edgeCount = 0;
  for (const e of edges) {
    const a = e && e.from != null ? String(e.from) : null;
    const b = e && e.to != null ? String(e.to) : null;
    if (!a || !b || a === b) continue;
    if (a in deg) deg[a] += 1;
    if (b in deg) deg[b] += 1;
    edgeCount += 1;
  }
  const degrees = Object.values(deg);
  if (!degrees.length) return 'scattered';
  const connected = degrees.filter(d => d > 0).length;
  if (edgeCount < n - 1 || connected < Math.ceil(n * 0.6)) return 'scattered';
  const maxDeg = Math.max(...degrees);
  const deg2 = degrees.filter(d => d === 2).length;
  const deg1 = degrees.filter(d => d === 1).length;
  if (maxDeg >= n - 1 || (maxDeg >= Math.ceil(n * 0.6) && maxDeg >= 3)) return 'hub-and-spoke';
  if (deg2 >= Math.ceil(n * 0.8) && deg1 === 0) return 'coastal-ring';
  if (deg2 >= Math.ceil(n * 0.5) && deg1 >= 1 && deg1 <= 2) return 'linear-valley';
  return 'scattered';
}

/**
 * Realm-shape summary at canonize. Prefers the regionalGraph's nodes/edges; falls
 * back to the settlement list for the count/tier mix when the graph is sparse.
 * @param {any} graph - campaign.regionalGraph
 * @param {any[]} [settlements] - the campaign's saves (for count/tier fallback)
 * @returns {{ settlement_count_band: string, tier_mix: Object, topology_class: string }}
 */
export function realmShape(graph, settlements) {
  const g = isObj(graph) ? graph : {};
  const nodes = arr(g.nodes);
  const edges = arr(g.edges).length ? arr(g.edges) : arr(g.channels);
  const saves = arr(settlements);
  const count = nodes.length || saves.length;
  return {
    settlement_count_band: settlementCountBand(count),
    tier_mix: nodes.length ? tierMix(nodes) : tierMix(saves.map(s => ({ tier: s?.settlement?.tier ?? s?.tier }))),
    topology_class: topologyClass(nodes, edges),
  };
}
