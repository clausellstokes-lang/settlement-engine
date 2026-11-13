// REVIEW-VEIL-5 — THE KEY CENSUS, one side at a time. Births towns with one side's own generator (the dials a browser
// sends) and counts every key of every record the veil addresses, with the types it holds, plus the top-level keys and
// the keys under the data each grouping removes. Run once in a master worktree and once in a lane worktree, then
// compare the two files with census-compare.mjs: a key on master's side that is gone at the tip is a RETIRED name, and
// it matters when an eye or a hidden row governs it.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';

const SRC = process.env.RV5_SRC; const OUT = process.env.RV5_OUT; const SEEDS = Number(process.env.RV5_SEEDS || 3);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const ty = (v) => (v === null ? 'null' : Array.isArray(v) ? (v.length ? `array<${[...new Set(v.map((x) => (isRec(x) ? 'object' : Array.isArray(x) ? 'array' : typeof x)))].sort().join('|')}>` : 'array<>') : typeof v);

it('key census', async () => {
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const census = {}; const idShapes = {};
  const count = (bucket, rec) => { census[bucket] = census[bucket] || {}; for (const [k, v] of Object.entries(rec)) { const c = census[bucket][k] = census[bucket][k] || { n: 0, types: {} }; c.n += 1; c.types[ty(v)] = (c.types[ty(v)] || 0) + 1; } };
  const at = (root, path) => path.reduce((c, seg) => (isRec(c) ? c[seg] : undefined), root);
  let towns = 0; const linked = { cards: 0, withLinked: 0, linkedBeyondAffiliations: 0, examples: [] };
  for (let k = 0; k < SEEDS; k += 1) for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated', 'under_siege', 'famine']) {
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let s;
    try { s = generateSettlementPipeline(birthConfig(cfg), null, { seed: `rv5-census-${size}-${stress}-${k}`, customContent: {} }); } catch { continue; }
    towns += 1;
    count('TOP', s);
    for (const [kind, def] of Object.entries(veil.CARD_KINDS)) for (const path of def.lists) {
      const star = path.indexOf('*');
      const owners = star < 0 ? [s] : (Array.isArray(at(s, path.slice(0, star))) ? at(s, path.slice(0, star)).filter(isRec) : []);
      for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (!Array.isArray(arr)) continue;
        for (const c of arr.filter(isRec)) { count(`${kind} @ ${path.join('.')}`, c); const id = def.idOf(c); const sh = String(id).replace(/[a-z]+/g, 'a').replace(/[0-9]+/g, '9').slice(0, 40); idShapes[kind] = idShapes[kind] || {}; idShapes[kind][sh] = (idShapes[kind][sh] || 0) + 1; } }
    }
    for (const p of [['availableServices'], ['economicState', 'safetyProfile'], ['powerStructure'], ['history'], ['publicProse'], ['publicProse', 'blocks']]) { const v = at(s, p); if (isRec(v)) count(`REC ${p.join('.')}`, v); }
    for (const p of [['powerStructure', 'factionRelationships'], ['structuralViolations'], ['decrees']]) { const v = at(s, p); if (Array.isArray(v)) v.filter(isRec).forEach((x) => count(`LIST ${p.join('.')}`, x)); }
    // what the retired `linkedFactionIds` held beside the two affiliation names (master's shape only)
    const fid = (n) => String(n || '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
    for (const n of (s.npcs || []).filter(isRec)) { linked.cards += 1; if (!Array.isArray(n.linkedFactionIds)) continue; linked.withLinked += 1;
      const known = new Set([n.factionAffiliation, n.secondaryAffiliation].filter(Boolean).flatMap((x) => [String(x), `faction.${fid(x)}`, fid(x)]));
      const beyond = n.linkedFactionIds.filter((x) => !known.has(String(x)));
      if (beyond.length) { linked.linkedBeyondAffiliations += 1; if (linked.examples.length < 5) linked.examples.push({ aff: [n.factionAffiliation, n.secondaryAffiliation], linked: n.linkedFactionIds }); } }
  }
  writeFileSync(OUT, JSON.stringify({ towns, census, idShapes, linked }, null, 1));
}, 3_600_000);
