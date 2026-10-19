// D-PS-r5 probe — minor 1 (P7, the r4 verifier's EXECUTED fail) re-cured: MINIMALITY by the
// landed EFFECTIVE cost (seasonal + danger + toll — `chooseRoute`'s own minimand), never by the
// seasonal cost alone. Landed reads only (master 81f1cd963, read-only):
// distanceRead.js :: seasonalPathCost, spatialCost.js :: buildSeasonalOverlay,
// embattlement.js :: scoreRoute (+ its embattlementLevel / tollRateOf ledgers).
// Part A re-runs the verifier's three fixtures (skeptic/PS-r4-verify-probe/p7-danger.mjs).
// Part B sweeps random worlds (terrain per hop, embattlement and toll per node, season, risk
// tolerance) and asserts BOTH clauses — the reroute's and the planner's — in the cured form,
// with the struck seasonal form as the negative control (it must fail somewhere).
// Run: node p7-effective.mjs <master-worktree>
const M = process.argv[2];
const { seasonalPathCost } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { buildSeasonalOverlay } = await import(`${M}/src/domain/spatial/spatialCost.js`);
const { scoreRoute } = await import(`${M}/src/domain/spatial/embattlement.js`);
const pk = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
const overlay = buildSeasonalOverlay();
const pickMin = (xs) => xs.reduce((b, s) => (!b || s.eff < b.eff || (s.eff === b.eff && s.path < b.path) ? s : b), null);

function score(digest, ws, cands, season, rt, median) {
  return cands.map((c) => {
    const s = seasonalPathCost(digest, c.path, c.cost, season);
    const r = scoreRoute(c.path, ws, s, rt, median);
    return { path: c.path.join('>'), seasonal: s, eff: r.effectiveCost };
  });
}

function check(digest, ws, detours, direct, passageCost, season, rt, median) {
  const scored = score(digest, ws, detours, season, rt, median);
  const pick = pickMin(scored); // the reroute's pick = chooseRoute's scoring over the avoided candidates
  const cured = scored.every((s) => !(s.eff < pick.eff)); // no B-avoiding candidate cheaper in EFFECTIVE cost
  const struck = scored.every((s) => !(s.seasonal < pick.seasonal)); // the r4 clause (seasonal alone)
  // the planner: the direct route through B carries its believed passage cost on top of its effective cost
  const [d] = score(digest, ws, [direct], season, rt, median);
  const all = [{ path: d.path, seasonal: d.seasonal, eff: d.eff + passageCost, base: d.eff }, ...scored];
  const pp = pickMin(all);
  const plannerCured = !(pp.path !== d.path && d.eff + passageCost < pp.eff); // never a detour when direct effective + passage is lower
  const plannerStruck = !(pp.path !== d.path && d.seasonal + passageCost < pp.seasonal);
  return { scored, pick: pick.path, cured, struck, plannerPick: pp.path, plannerCured, plannerStruck };
}

const out = [];
// ── Part A: the verifier's fixture, verbatim ──
{
  const receipts = {
    [pk('O', 'B')]: { cost: 50, byTerrain: { grassland: 50 } }, [pk('B', 'D')]: { cost: 50, byTerrain: { grassland: 50 } },
    [pk('O', 'C')]: { cost: 55, byTerrain: { mountain: 55 } }, [pk('C', 'D')]: { cost: 55, byTerrain: { mountain: 55 } },
    [pk('O', 'E')]: { cost: 65, byTerrain: { grassland: 65 } }, [pk('E', 'D')]: { cost: 65, byTerrain: { grassland: 65 } },
  };
  const digest = { reserved: { seasonalOverlay: overlay }, routeReceipts: receipts };
  const cases = [['no danger', {}, 'summer'], ['danger on C and B', { C: 0.6, B: 0.6 }, 'summer'], ['danger on E only', { E: 0.6 }, 'winter']];
  for (const [label, emb, season] of cases) {
    const ws = { spatialLedgers: { embattlement: Object.fromEntries(Object.entries(emb).map(([id, level]) => [id, { level, phase: 'embattled', sinceTick: 0, lastTick: 0 }])) } };
    const r = check(digest, ws, [{ path: ['O', 'C', 'D'], cost: 110 }, { path: ['O', 'E', 'D'], cost: 130 }], { path: ['O', 'B', 'D'], cost: 100 }, 0, season, 1, 50);
    out.push(`A ${label} (${season}): ${r.scored.map((s) => `${s.path} seasonal ${s.seasonal} effective ${s.eff}`).join(' ; ')}`);
    out.push(`  reroute pick ${r.pick}: CURED clause (effective) ${r.cured ? 'holds' : 'VIOLATED'} · struck clause (seasonal) ${r.struck ? 'holds' : 'VIOLATED'}`);
    out.push(`  planner pick ${r.plannerPick}: CURED clause ${r.plannerCured ? 'holds' : 'VIOLATED'} · struck clause ${r.plannerStruck ? 'holds' : 'VIOLATED'}`);
  }
}
// ── Part B: a seeded sweep ──
let seed = 20261019;
const rnd = () => { seed = (seed * 1103515245 + 12345) >>> 0; return seed / 4294967296; };
const terrains = ['grassland', 'mountain', 'forest', 'wetland', 'desert', 'hills', 'tundra'];
const seasons = ['spring', 'summer', 'autumn', 'winter'];
let n = 0, curedFail = 0, struckFail = 0, plCuredFail = 0, plStruckFail = 0;
for (let i = 0; i < 20000; i++) {
  const nodes = ['O', 'B', 'C', 'E', 'F', 'D'];
  const receipts = {};
  const hop = (a, b) => { const c = 20 + Math.floor(rnd() * 80); const t = terrains[Math.floor(rnd() * terrains.length)]; receipts[pk(a, b)] = { cost: c, byTerrain: { [t]: c } }; return c; };
  const dc = hop('O', 'B') + hop('B', 'D');
  const c1 = hop('O', 'C') + hop('C', 'D');
  const c2 = hop('O', 'E') + hop('E', 'D');
  const c3 = hop('O', 'F') + hop('F', 'D');
  const digest = { reserved: { seasonalOverlay: overlay }, routeReceipts: receipts };
  const emb = {}; const ent = {};
  for (const id of nodes) { if (rnd() < 0.4) emb[id] = { level: Math.round(rnd() * 100) / 100, phase: 'embattled', sinceTick: 0, lastTick: 0 }; if (rnd() < 0.2) ent[id] = { toll: Math.round(rnd() * 50) / 100 }; }
  const ws = { spatialLedgers: { embattlement: emb, entrepots: ent } };
  const season = seasons[Math.floor(rnd() * 4)];
  const rt = 0.3 + rnd() * 0.7;
  const passage = Math.floor(rnd() * 3) * 25;
  const r = check(digest, ws, [{ path: ['O', 'C', 'D'], cost: c1 }, { path: ['O', 'E', 'D'], cost: c2 }, { path: ['O', 'F', 'D'], cost: c3 }], { path: ['O', 'B', 'D'], cost: dc }, passage, season, rt, 50);
  n++; if (!r.cured) curedFail++; if (!r.struck) struckFail++; if (!r.plannerCured) plCuredFail++; if (!r.plannerStruck) plStruckFail++;
}
out.push(`B sweep: ${n} worlds (3 B-avoiding candidates + the direct road, random terrain/season/embattlement/toll/risk tolerance/believed passage cost)`);
out.push(`  reroute — CURED clause (no candidate cheaper in EFFECTIVE cost than the pick) fails in ${curedFail}; struck clause (seasonal alone) fails in ${struckFail} (negative control)`);
out.push(`  planner — CURED clause (never a detour when the direct road's effective cost + believed passage cost is lower) fails in ${plCuredFail}; struck clause fails in ${plStruckFail} (negative control)`);
console.log(out.join('\n'));
