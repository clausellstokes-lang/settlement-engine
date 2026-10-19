// V-PS-r4 probe — does the round-4 P7 MINIMALITY pin hold on a CORRECT world where the
// candidates differ in DANGER (embattlement) — the term the landed chooseRoute minimizes
// beside the seasonal cost? Landed reads only (master 81f1cd963, read-only):
// distanceRead.js :: seasonalPathCost, spatialCost.js :: buildSeasonalOverlay,
// embattlement.js :: scoreRoute. Fixture = D-PS-r4's p7-minimality fixture, plus an
// embattlement ledger. Run: node p7-danger.mjs <master-worktree>
const M = process.argv[2];
const { seasonalPathCost } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { buildSeasonalOverlay } = await import(`${M}/src/domain/spatial/spatialCost.js`);
const { scoreRoute } = await import(`${M}/src/domain/spatial/embattlement.js`);
const pk = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
const receipts = {
  [pk('O', 'B')]: { cost: 50, byTerrain: { grassland: 50 } }, [pk('B', 'D')]: { cost: 50, byTerrain: { grassland: 50 } },
  [pk('O', 'C')]: { cost: 55, byTerrain: { mountain: 55 } }, [pk('C', 'D')]: { cost: 55, byTerrain: { mountain: 55 } },
  [pk('O', 'E')]: { cost: 65, byTerrain: { grassland: 65 } }, [pk('E', 'D')]: { cost: 65, byTerrain: { grassland: 65 } },
};
const digest = { reserved: { seasonalOverlay: buildSeasonalOverlay() }, routeReceipts: receipts };
const median = 50; const rt = 1;
const run = (label, embattled, season) => {
  const ws = { spatialLedgers: { embattlement: Object.fromEntries(Object.entries(embattled).map(([id, level]) => [id, { level, phase: 'embattled', sinceTick: 0, lastTick: 0 }])) } };
  const cands = [{ path: ['O', 'C', 'D'], cost: 110 }, { path: ['O', 'E', 'D'], cost: 130 }];
  const scored = cands.map(c => { const s = seasonalPathCost(digest, c.path, c.cost, season); const r = scoreRoute(c.path, ws, s, rt, median); return { path: c.path.join('>'), seasonal: s, danger: r.danger, eff: r.effectiveCost }; });
  const pick = scored.reduce((b, s) => (!b || s.eff < b.eff || (s.eff === b.eff && s.path < b.path) ? s : b), null);
  const cheaperSeasonal = scored.filter(s => s.seasonal < pick.seasonal).map(s => s.path);
  const out = [`${label} (${season}; embattled ${JSON.stringify(embattled)}): ${scored.map(s => `${s.path} seasonal ${s.seasonal} danger ${s.danger} effective ${s.eff}`).join(' ; ')}`,
    `  chooseRoute's scoring picks ${pick.path}; P7 clause "a detour is never chosen when a more direct B-avoiding route's seasonal cost is lower": ${cheaperSeasonal.length ? 'VIOLATED (cheaper in season: ' + cheaperSeasonal.join(',') + ')' : 'holds'}`];
  // §5.1's planner clause: the DIRECT route through B (ally: believed passage cost 0) vs the detours
  const dS = seasonalPathCost(digest, ['O', 'B', 'D'], 100, season); const dR = scoreRoute(['O', 'B', 'D'], ws, dS, rt, median);
  const all = [{ path: 'O>B>D', seasonal: dS, eff: dR.effectiveCost + 0 }, ...scored.map(s => ({ path: s.path, seasonal: s.seasonal, eff: s.eff }))];
  const pp = all.reduce((b, s) => (!b || s.eff < b.eff || (s.eff === b.eff && s.path < b.path) ? s : b), null);
  out.push(`  planner (direct O>B>D seasonal ${dS} + passage 0, effective ${dR.effectiveCost}): picks ${pp.path}; §5.1 clause "a detour around a holder is never chosen when the direct route's seasonal cost plus its believed passage cost is lower": ${pp.path !== 'O>B>D' && dS < pp.seasonal ? 'VIOLATED' : 'holds'}`);
  return out.join('\n');
};
console.log([
  run('no danger', {}, 'summer'),
  run('danger on C and B', { C: 0.6, B: 0.6 }, 'summer'),
  run('danger on E only', { E: 0.6 }, 'winter'),
].join('\n'));
