// V-WS-r2 probe 2 (S17 under deviation): the lane's own cells (copied from cure/D-WS-r2-probe/hostLean-r2.mjs,
// which mirror §3.3/§4.2 r2) + §5.1's cause→way table + §5.2's rules: "A cause whose way is already the war's
// way does nothing"; a turned war leans C1/C2/C6 at sign x W x KEEP (x1 for commander/campaign_plan).
// Claim under test (S17): "any two courts with IDENTICAL strengths and different tempers and methods have
// IDENTICAL C1/C2/C6 factors, sign and size". Pure arithmetic over the volume's cells.
const W = 0.12, KEEP = 0.5, FLOOR = 2;
const lvl = { below: 0, level: 1, above: 2 };
const cells = {
  way_attrition:  (s) => (s.manpower === 'above' ? 2 : 0) + (lvl[s.institutions] >= 1 ? lvl[s.institutions] : 0),
  way_coalition:  (s) => ({ alone: 0, few: 1, many: 2 })[s.chain] + (lvl[s.manpower] <= 1 ? 1 : 0),
  way_fortress:   (s) => (s.institutions === 'above' ? 2 : 0) + (lvl[s.manpower] <= 1 ? 1 : 0),
  way_harassment: (s) => (s.manpower === 'below' ? 1 : 0) + (s.institutions === 'below' ? 1 : 0) + ({ none: 0, few: 1, many: 2 })[s.ways],
  way_logistics:  (s) => (s.harbour === 'seafaring' ? 1 : 0) + (lvl[s.institutions] >= 1 ? lvl[s.institutions] : 0),
  way_raiding:    (s) => (s.horses === 'horsed' ? 1 : 0) + ({ none: 0, few: 1, many: 2 })[s.ways] + (lvl[s.manpower] <= 1 ? 1 : 0),
  way_shock:      (s) => (s.materiel === 'above' ? 2 : 0) + (lvl[s.manpower] >= 1 ? lvl[s.manpower] : 0) + (s.horses === 'horsed' ? 1 : 0),
};
const method = { way_logistics: 'bloodless', way_raiding: 'bloody' };
const host = {
  way_attrition: [+1, 0, -1, +1, 0], way_harassment: [0, +1, 0, 0, 0], way_logistics: [0, +1, 0, 0, 0],
  way_shock: [+1, -1, +1, +1, -1], way_fortress: [-1, +1, 0, -1, -1], way_coalition: [0, 0, 0, 0, 0],
  way_raiding: [0, 0, +1, +1, +1],
};
const ways = Object.keys(cells).sort();
function fit(s, m) {
  const sc = Object.fromEntries(ways.map((w) => [w, cells[w](s)]));
  const best = Math.max(...ways.map((w) => sc[w]));
  const tied = ways.filter((w) => sc[w] === best);
  let top = tied[0];
  if (tied.length > 1) { const withM = tied.filter((w) => method[w] === m); if (withM.length) top = withM[0]; }
  return { top, unique: tied.length === 1, applied: best >= FLOOR };
}
// §5.1 situation causes (C1/C2/C6 lean at W x KEEP when the war is turned)
const causes = { field_lost: 'way_fortress', coffers_bare: 'way_raiding', levy_thin: 'way_coalition',
  foe_on_the_ways: 'way_logistics', ally_failed: 'way_fortress', siege_long: 'way_logistics' };
function warHost(s, m, cause) {
  const f = fit(s, m);
  const to = causes[cause];
  if (to === f.top) return host[f.top].map((sg) => (f.unique && f.applied ? 1 + sg * W : 1)); // no-op: the court's own way
  return host[to].map((sg) => 1 + sg * W * KEEP); // turned
}
const B3 = ['below', 'level', 'above'];
let n = 0, wayDiffers = 0; const diffByCause = {}; let example = null;
for (const manpower of B3) for (const institutions of B3) for (const materiel of B3)
for (const kw of ['none', 'few', 'many']) for (const horses of ['poor', 'horsed'])
for (const chain of ['alone', 'few', 'many']) for (const harbour of ['landbound', 'seafaring']) {
  const s = { manpower, institutions, materiel, ways: kw, horses, chain, harbour };
  n++;
  if (fit(s, 'bloody').top !== fit(s, 'bloodless').top) wayDiffers++;
  for (const c of Object.keys(causes)) {
    const a = warHost(s, 'bloody', c).map((x) => x.toFixed(4)).join(','), b = warHost(s, 'bloodless', c).map((x) => x.toFixed(4)).join(',');
    if (a !== b) { diffByCause[c] = (diffByCause[c] || 0) + 1; if (!example && c === 'siege_long') example = { s, c, bloody: a, bloodless: b, wb: fit(s, 'bloody').top, wl: fit(s, 'bloodless').top }; }
  }
}
console.log(`strength vectors ${n}; the WAY itself differs bloody vs bloodless (same strengths): ${wayDiffers}/${n}`);
console.log(`C1/C2/C6 factors [deploy, defend/hold, sue, C2 ramp, C6 raid] differ bloody vs bloodless under a situation cause (same strengths, same cause):`);
for (const [c, k] of Object.entries(diffByCause)) console.log(`  ${c.padEnd(16)} ${k}/${n}`);
console.log('example:', JSON.stringify(example));
