/**
 * domain/townMap/siteGenesis.js — STAGE 0 (THE SITE) + the genesis-order helpers (#38).
 *
 * The v2 generative pipeline runs in an EXPLICIT order the owner fixed:
 *   (0) THE SITE — generate the physical setting (river / coast / marsh / dunes /
 *       mountain-flank / plain) from the dossier's regional context BEFORE any urban
 *       form. SUBSTANCE (does a river exist?) is derived from the dossier — terrain,
 *       trade routes that must physically enter/exit, resources that imply landforms —
 *       and NEVER invented (the truth-projection law + REALM-COHERENCE: the site may
 *       not contradict the settlement's biome). EXPRESSION (which bank, which flank,
 *       the meander) is seeded from the `${_seed}::town-map:v2` fork.
 *   (1) THE ECONOMIC FIELD — attractors from the actual economy laid onto the site.
 *   (2) THE GENESIS CORE nucleates ON the field (the ford, the harbor landing), not an
 *       abstract center.
 *   (3)-(5) roads follow gradients → districts pull to attractors → composition pass.
 *
 * THE "OR NOT" CLAUSE — a town's RESPONSE MODE to its site (EXPLOIT the harbor /
 * ENDURE the marsh / FORTIFY the defensible flank over the trade-optimal bank) is
 * chosen from the settlement's character, not always from optimality; deliberate
 * suboptimality is a feature. The declined advantages are retained as THE LATENT
 * ADVANTAGE MAP, and — once the urban-fabric layer is lit — the town RECONCILES with
 * its site over time, in a STYLE set by alignment: LAWFUL reconciliation is planned +
 * discrete toward the CHOSEN doctrine's optimum (a lawful fortify town does NOT drift
 * to the harbor it declined); CHAOTIC reconciliation is greedy local opportunism that
 * grabs the latent advantage fast and messily. Dark fabric ⇒ the founding form simply
 * persists.
 *
 * PURE + deterministic: substance from the dossier, expression + response from the seed
 * fork; no trig, no Date, no Math.random, no localeCompare. Any-cast baseline 0.
 */

import { clamp, clamp01 } from '../../kernel/math.js';

const VIEW = 1000;

/** Order-independent codepoint digit of a string (seed-stable, no rng). */
function codeDigit(str) {
  let sum = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
  return sum;
}

/** Exports that imply a WATER economy (so water is dossier-substantiated even inland).
 *  NOTE: `salt` is deliberately EXCLUDED — salt comes from evaporation flats/dunes (a
 *  DRY landform), per the owner's salt⇒flats mapping; `preserved` still catches the
 *  coastal salt-meat trade. */
const WATER_ECONOMY_RE = /fish|preserved|reed|peat|pearl|whal|ferry|barge|timber|lumber|mill/i;
/** Biomes that FORBID standing water unless the economy justifies it (realm-coherence). */
const DRY_BIOME_RE = /desert|arid|dune|waste|scrub|steppe|badland/i;
/** Biomes/terrains that IMPLY water by nature. */
const WET_BIOME_RE = /marsh|swamp|fen|bog|coast|river|delta|lake|estuar|wetland/i;

/**
 * @typedef {Object} TownSite
 * @property {{ kind:'coast'|'river', path:Array<[number,number]> }|null} water
 * @property {{ x:number, y:number }|null} waterAnchor
 * @property {string} kind    coast | river | marsh | dunes | mountain-flank | plain
 * @property {boolean} hasWater
 * @property {Array<{ element:string, sourceFamily:string, sourceRef:string, effect:string }>} prov
 */

/**
 * STAGE 0 — generate the site. @param {{
 *   terrain: string|null, tradeAccess: string|null, isCoast: boolean, isRiver: boolean,
 *   exports: string[], realmBiome: string|null, seed: string
 * }} arg @returns {TownSite}
 */
export function generateSite(arg) {
  const { terrain, isCoast, isRiver, exports, realmBiome, seed } = arg;
  const biome = String(realmBiome || terrain || '').toLowerCase();
  const waterEconomy = (Array.isArray(exports) ? exports : []).some((e) => WATER_ECONOMY_RE.test(String(e)));

  // ── WATER SUBSTANCE (derived, never invented) ───────────────────────────────
  // A dry biome forbids water UNLESS the dossier holds a water economy or an explicit
  // coastal/river trade lane (the oasis/river that justifies it) — REALM-COHERENCE.
  const dryBiome = DRY_BIOME_RE.test(biome);
  const wetBiome = WET_BIOME_RE.test(biome);
  let hasWater = isCoast || isRiver || wetBiome || waterEconomy;
  if (dryBiome && !isCoast && !isRiver && !waterEconomy) hasWater = false; // no river in the desert

  /** @type {Array<{ element:string, sourceFamily:string, sourceRef:string, effect:string }>} */
  const prov = [];
  const d = codeDigit(`${seed}::site`);

  // ── SITE KIND (substance) + WATER EXPRESSION (seed) ─────────────────────────
  /** @type {{ kind:'coast'|'river', path:Array<[number,number]> }|null} */
  let water = null;
  /** @type {{ x:number, y:number }|null} */
  let waterAnchor = null;
  let kind = 'plain';

  if (isCoast || (hasWater && /coast|sea|ocean|port/.test(biome))) {
    kind = 'coast';
    // expression: the shore sits along the top OR bottom edge (seeded).
    const bottom = d % 2 === 0;
    const y = bottom ? 852 : 150;
    water = { kind: 'coast', path: [[0, y], [1000, y]] };
    waterAnchor = { x: 500, y: bottom ? 900 : 100 };
    prov.push({ element: 'site:water', sourceFamily: 'region', sourceRef: 'the coast (sea trade)', effect: 'site-water' });
  } else if (isRiver || (hasWater && (waterEconomy || /river|marsh|swamp|fen|delta/.test(biome)))) {
    kind = /marsh|swamp|fen|bog|reed|peat/.test(biome) || (waterEconomy && /reed|peat/i.test(exports.join(' '))) ? 'marsh' : 'river';
    // expression: the river enters/exits along seeded bearings, meandering L or R.
    const leftBend = d % 2 === 0;
    water = leftBend
      ? { kind: 'river', path: [[0, 250], [300, 430], [520, 520], [740, 470], [1000, 640]] }
      : { kind: 'river', path: [[0, 640], [300, 470], [520, 520], [740, 430], [1000, 250]] };
    waterAnchor = { x: 520, y: 560 };
    prov.push({ element: 'site:water', sourceFamily: 'region', sourceRef: kind === 'marsh' ? 'the marsh (reed/peat)' : 'the river (river trade / fishery)', effect: 'site-water' });
  } else if (/mountain|hill|crag|peak|highland/.test(biome) || (Array.isArray(exports) && exports.some((e) => /ore|iron|stone|mine|silver|gold|coal/i.test(String(e))))) {
    kind = 'mountain-flank';
    prov.push({ element: 'site:landform', sourceFamily: 'region', sourceRef: 'the mountain flank (mining terrain)', effect: 'site-slope' });
  } else if (dryBiome || (Array.isArray(exports) && exports.some((e) => /salt/i.test(String(e))))) {
    kind = 'dunes';
    prov.push({ element: 'site:landform', sourceFamily: 'region', sourceRef: 'the flats/dunes (dry biome / salt)', effect: 'site-flats' });
  }

  return { water, waterAnchor, kind, hasWater, prov };
}

/**
 * THE "OR NOT" CLAUSE — the town's response mode to its site, from its character. A
 * frontier/threatened walled town FORTIFIES (may take the defensible flank over the
 * optimal bank); a harsh site with no strong exploit ENDURES; otherwise it EXPLOITS.
 * @param {{ hasWalls: boolean, siteKind: string, monsterThreat: string|null, seed: string }} arg
 * @returns {{ mode: 'exploit'|'endure'|'fortify', prov: { element:string, sourceFamily:string, sourceRef:string, effect:string } }}
 */
export function responseModeFor(arg) {
  const { hasWalls, siteKind, monsterThreat } = arg;
  const threatened = /frontier|hostile|war|siege|contested|dangerous/.test(String(monsterThreat || '').toLowerCase());
  const harshSite = siteKind === 'marsh' || siteKind === 'dunes' || siteKind === 'mountain-flank';
  /** @type {'exploit'|'endure'|'fortify'} */
  let mode = 'exploit';
  if (hasWalls && threatened) mode = 'fortify';
  else if (harshSite && !hasWalls) mode = 'endure';
  else if (hasWalls) mode = 'fortify';
  const ref = mode === 'fortify' ? 'defensive founding (walled/threatened)'
    : mode === 'endure' ? `endured a harsh site (${siteKind})`
      : 'exploited its site (trade/landing)';
  return { mode, prov: { element: 'site:response', sourceFamily: 'habit', sourceRef: ref, effect: `response-${mode}` } };
}

/**
 * STAGE 2 — nucleate the genesis core ON the economic field: the strength-weighted
 * centroid of the attractors + gates, pulled off the abstract center toward the
 * economy's convergence (the ford, the market bearing). Falls back to the default
 * center when there is no field (a source-less town keeps its formal center).
 * @param {Array<{ point:{x:number,y:number}, strength:number }>} attractors
 * @param {Array<{x:number,y:number}>} gatePoints
 * @param {{x:number,y:number}} fallback
 * @returns {{x:number,y:number}}
 */
export function nucleateCore(attractors, gatePoints, fallback) {
  let wx = fallback.x * 0.6;
  let wy = fallback.y * 0.6;
  let w = 0.6; // the abstract center keeps a modest anchoring weight
  for (const a of (Array.isArray(attractors) ? attractors : [])) {
    const s = clamp01(a.strength) * 0.7;
    wx += a.point.x * s;
    wy += a.point.y * s;
    w += s;
  }
  for (const g of (Array.isArray(gatePoints) ? gatePoints : [])) {
    wx += g.x * 0.15;
    wy += g.y * 0.15;
    w += 0.15;
  }
  if (w <= 0) return fallback;
  return { x: clamp(Math.round(wx / w), 220, VIEW - 220), y: clamp(Math.round(wy / w), 220, VIEW - 220) };
}

/**
 * THE LATENT ADVANTAGE MAP — the attractors the founding response mode DECLINED (the
 * fortress town's unused harbor, the endure-town's undrained flat). Retained at
 * generation (fabric-independent) for the reconciliation renderer + a later hover
 * story. @param {Array<{ point:{x:number,y:number}, strength:number, family:string, cause:string, targets:string[]|null }>} attractors
 * @param {'exploit'|'endure'|'fortify'} responseMode
 * @returns {Array<{ attractorRef:string, declinedBy:string, latentValue01:number, point:{x:number,y:number} }>}
 */
export function latentAdvantageMap(attractors, responseMode) {
  /** @type {Array<{ attractorRef:string, declinedBy:string, latentValue01:number, point:{x:number,y:number} }>} */
  const out = [];
  for (const a of (Array.isArray(attractors) ? attractors : [])) {
    // Which advantages a mode leaves on the table:
    //  • FORTIFY declines TRADE-optimal attractors (the harbor it didn't build on).
    //  • ENDURE declines IMPROVABLE region attractors (the flat it didn't drain).
    //  • EXPLOIT declines little (it took the advantages) — only weak/secondary ones.
    const declined = responseMode === 'fortify'
      ? (a.family === 'resource' || /waterfront|harbou?r|trade|market/.test(a.cause))
      : responseMode === 'endure'
        ? (a.family === 'region' && !/waterfront/.test(a.cause))
        : a.strength < 0.55; // exploit leaves only the marginal ones
    if (!declined) continue;
    out.push({ attractorRef: a.cause, declinedBy: responseMode, latentValue01: Math.round(clamp01(a.strength) * 100) / 100, point: { x: a.point.x, y: a.point.y } });
  }
  out.sort((x, y) => (x.attractorRef < y.attractorRef ? -1 : x.attractorRef > y.attractorRef ? 1 : 0));
  return out;
}

/**
 * RECONCILIATION displacement for one district (the hasFabric branch only). Returns the
 * extra move a district makes as the town reconciles with its site over time, plus the
 * provenance of that move — or a zero move when fabric is dark. Direction from the
 * latent map; STYLE from alignment (drift); MAGNITUDE from fabric stocks.
 *   • LAWFUL (low drift): a small, discrete, ORDERED nudge — and NOT toward a declined
 *     trade attractor for a fortify town (doctrine maintained; lawful ≠ optimal).
 *   • CHAOTIC (high drift): a larger GREEDY nudge straight at the nearest latent
 *     advantage (the riverbank grab, the gate accretion).
 * @param {{ x:number, y:number }} centroid @param {string} category
 * @param {{ has:boolean, drift:number|null, stocks:Record<string,number> }} fabric
 * @param {Array<{ attractorRef:string, point:{x:number,y:number}, latentValue01:number }>} latent
 * @param {'exploit'|'endure'|'fortify'} responseMode
 * @returns {{ dx:number, dy:number, prov: ProvEntryLite|null }}
 * @typedef {{ sourceFamily:string, sourceRef:string, effect:string }} ProvEntryLite
 */
export function reconciliationDisplacement(centroid, category, fabric, latent, responseMode) {
  if (!fabric.has || latent.length === 0) return { dx: 0, dy: 0, prov: null };
  // No history has accrued yet (a lit-but-empty fabric) ⇒ the founding form persists.
  const anyStock = Object.keys(fabric.stocks || {}).length > 0;
  if (fabric.drift == null && !anyStock) return { dx: 0, dy: 0, prov: null };
  const drift = fabric.drift == null ? 0 : clamp01(fabric.drift);
  const lawful = drift < 0.5;
  // magnitude scales with how much stone this class has accreted (fabric stocks).
  const stock = clamp01(fabric.stocks[category] ?? 0);
  const mag = Math.round((lawful ? 14 : 30) * (0.4 + stock * 0.6));
  if (mag <= 0) return { dx: 0, dy: 0, prov: null };

  // pick the nearest latent advantage as the reconciliation direction
  let target = latent[0];
  let bestD = Infinity;
  for (const l of latent) {
    const dd = (l.point.x - centroid.x) ** 2 + (l.point.y - centroid.y) ** 2;
    if (dd < bestD) { bestD = dd; target = l; }
  }
  const vx = target.point.x - centroid.x;
  const vy = target.point.y - centroid.y;
  const dist = Math.sqrt(vx * vx + vy * vy) || 1;

  if (lawful) {
    // LAWFUL: a fortify town does NOT drift toward a DECLINED TRADE advantage — it
    // executes its chosen doctrine (walls maintained). Suppress the move in that case.
    if (responseMode === 'fortify' && /waterfront|harbou?r|trade|market|quay/.test(target.attractorRef)) {
      return { dx: 0, dy: 0, prov: { sourceFamily: 'habit', sourceRef: `doctrine held (${responseMode})`, effect: 'reconcile-hold' } };
    }
    // planned + discrete: a modest, ordered step (cap it small).
    const step = Math.min(mag, 16);
    return {
      dx: Math.round((vx / dist) * step), dy: Math.round((vy / dist) * step),
      prov: { sourceFamily: 'habit', sourceRef: `reconcile → ${target.attractorRef}`, effect: 'reconcile-planned' },
    };
  }
  // CHAOTIC: greedy grab straight at the latent advantage.
  return {
    dx: Math.round((vx / dist) * mag), dy: Math.round((vy / dist) * mag),
    prov: { sourceFamily: 'habit', sourceRef: `encroach → ${target.attractorRef}`, effect: 'reconcile-encroach' },
  };
}
