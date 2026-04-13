// cascadeGenerator.js — Supply chain cascade pass
// Gives chain-adjacent institutions a boosted second chance after main generation.
// Extracted from generateSettlement.js for maintainability.

import { random as _rng } from './rngContext.js';
import { institutionalCatalog } from '../data/institutionalCatalog.js';
import { SUPPLY_CHAIN_NEEDS } from '../data/supplyChainData.js';

// ══ Supply Chain Cascade Pass ════════════════════════════════════════════════
// Builds institution-to-institution adjacency from supply chain data, then
// gives chain-neighbouring institutions a boosted second chance to appear.

function _buildCascadeMap() {
  const map = {};
  const mk  = n => n.toLowerCase().slice(0, 16);
  Object.values(SUPPLY_CHAIN_NEEDS).forEach(need => {
    need.chains.forEach(chain => {
      const procs = chain.processingInstitutions || [];
      if (procs.length < 2) return;
      procs.forEach((proc, idx) => {
        const key = mk(proc);
        if (!map[key]) map[key] = { up: [], down: [] };
        for (let d = 1; d <= 2 && idx + d < procs.length; d++) {
          const nk = mk(procs[idx + d]);
          if (!map[key].down.find(x => x.mk === nk))
            map[key].down.push({ mk: nk, dist: d });
        }
        for (let u = 1; u <= 2 && idx - u >= 0; u++) {
          const nk = mk(procs[idx - u]);
          if (!map[key].up.find(x => x.mk === nk))
            map[key].up.push({ mk: nk, dist: u });
        }
      });
    });
  });
  return map;
}

// Memoised — cascade map is static after module load
let _cachedCascadeMap = null;
function getCascadeMap() {
  if (!_cachedCascadeMap) _cachedCascadeMap = _buildCascadeMap();
  return _cachedCascadeMap;
}

function _cascadeBoost(dir, dist) {
  // Upstream demand pull slightly stronger than downstream supply push
  if (dir === 'up')   return dist === 1 ? 1.55 : 1.20;
  if (dir === 'down') return dist === 1 ? 1.40 : 1.15;
  return 1.0;
}

function applyCascadeInstitutions(institutions, tier) {
  const TIER_ORD  = ['thorp','hamlet','village','town','city','metropolis'];
  const tierIdx   = TIER_ORD.indexOf(tier);
  const mk        = n => n.toLowerCase().slice(0, 16);
  const cascadeMap = getCascadeMap();

  // What's already present (match keys)
  const existingMKs = new Set(institutions.map(i => mk(i.name)));

  // Collect max boost per target match-key
  const boosts = {};
  institutions.forEach(inst => {
    const entry = cascadeMap[mk(inst.name)];
    if (!entry) return;
    [
      ...entry.up.map(n  => ({ ...n, dir: 'up'   })),
      ...entry.down.map(n => ({ ...n, dir: 'down' })),
    ].forEach(({ mk: targetMK, dist, dir }) => {
      if (existingMKs.has(targetMK)) return;
      const w = _cascadeBoost(dir, dist);
      if (w > (boosts[targetMK] || 1.0)) boosts[targetMK] = w;
    });
  });

  if (!Object.keys(boosts).length) return [];

  const CATS = [
    'Essential','Economy','Crafts','Religious','Government',
    'Infrastructure','Defense','Magic','Adventuring','Criminal','Entertainment','Exotic',
  ];

  const added = [];
  // Tier-appropriate cap on total cascade additions
  // Prevents cascade from overwhelming naturally-generated institutions
  const CASCADE_CAPS = {
    thorp: 1, hamlet: 3, village: 6, town: 9, city: 11, metropolis: 13,
  };
  const cascadeCap = CASCADE_CAPS[tier] || 8;

  // Only cascade into institutions from the SAME tier or ONE tier below
  // (prevents city chains from cascading all the way into thorp catalog at scale)
  const minCascadeTierIdx = Math.max(0, tierIdx - 1);

  // Search relevant tiers only
  TIER_ORD.slice(minCascadeTierIdx, tierIdx + 1).forEach(t => {
    const tierCat = institutionalCatalog[t];
    if (!tierCat) return;
    CATS.forEach(cat => {
      const catInsts = tierCat[cat];
      if (!catInsts) return;
      Object.entries(catInsts).forEach(([name, data]) => {
        const nameMK  = mk(name);
        const boost   = boosts[nameMK];
        if (!boost || boost <= 1.0) return;
        if (existingMKs.has(nameMK))  return; // already present
        if (added.some(a => mk(a.name) === nameMK)) return; // already cascade-added

        const baseChance   = data.p || 0;
        // Cap cascade chance at 0.65 — can't guarantee an institution appears
        // Cap: cascade gives a second chance but can't guarantee appearances
        // Lower cap means cascades supplement rather than dominate generation
        const cascadeChance = Math.min(baseChance * boost, 0.45);
        if (added.length >= cascadeCap) return; // cap reached
        if (_rng() < cascadeChance) {
          added.push({ name, category: cat, tier: t, cascadeAdded: true, cascadeBoost: boost });
          existingMKs.add(nameMK); // prevent re-rolling the same target
        }
      });
    });
  });

  return added;
}
// ═════════════════════════════════════════════════════════════════════════════


export { applyCascadeInstitutions };
