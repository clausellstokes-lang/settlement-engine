// D-WS-r2 probe (WS-r1-1 / D.5 · WS-V3): the CURED fit and host lean, over the volume's own
// §3.3 strength cells (r2) and §4.2 HOST cells, every strength vector x both method reads.
// Claim under test: the C1/C2/C6 host factors are a function of the STRENGTHS alone — the
// method (W-DOCTRINE-1's bloody/bloodless, a read of the seat's archetype and the conscience,
// i.e. the temper) never changes a host factor's sign or size; a strengths' tie leans x1.
// Pure arithmetic; no import of the worktree (the cells are the volume's, not master's).
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
  // way_subversion: PARKED (corruptionWebEnabled lit nowhere) — no candidate.
};
const method = { way_logistics: 'bloodless', way_raiding: 'bloody' };
// §4.2 HOST rows: [C1 deploy, C1 defend/hold, C1 sue_for_peace, C2 ramp, C6 raid weight]
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
  let top = tied[0], methodBroke = false;
  if (tied.length > 1) { // THE METHOD TIE-BREAK: among the strengths' tied top only
    const withM = tied.filter((w) => method[w] === m);
    if (withM.length) { top = withM[0]; methodBroke = true; }
  }
  return { top, best, unique: tied.length === 1, methodBroke, applied: best >= FLOOR };
}
// wayHostLeanOf (r2): sign x W only where the strengths alone make the way the UNIQUE top and it is applied.
const hostFactors = (f) => host[f.top].map((sg) => (f.unique && f.applied ? 1 + sg * W : 1));
const turned = (way, cause) => host[way].map((sg) => (cause === 'commander' || cause === 'campaign_plan') ? 1 : 1 + sg * W * KEEP);
const B3 = ['below', 'level', 'above'];
let n = 0, mismatch = 0, unique = 0, tie = 0, broke = 0, below = 0; const dist = {}; const distB = {};
for (const manpower of B3) for (const institutions of B3) for (const materiel of B3)
for (const ways of ['none', 'few', 'many']) for (const horses of ['poor', 'horsed'])
for (const chain of ['alone', 'few', 'many']) for (const harbour of ['landbound', 'seafaring']) {
  const s = { manpower, institutions, materiel, ways, horses, chain, harbour };
  const fb = fit(s, 'bloody'), fl = fit(s, 'bloodless');
  const hb = hostFactors(fb).join(','), hl = hostFactors(fl).join(',');
  n++; if (hb !== hl) mismatch++;
  if (fb.unique) unique++; else tie++;
  if (fb.methodBroke || fl.methodBroke) broke++;
  if (!fb.applied) below++;
  dist[fb.top] = (dist[fb.top] || 0) + 1; distB[fl.top] = (distB[fl.top] || 0) + 1;
}
console.log(`strength vectors ${n} (x 2 method reads)`);
console.log(`host factors differ between a bloody and a bloodless court with the SAME strengths: ${mismatch}/${n}`);
console.log(`strengths' unique top ${unique} · tie at the top (host x1) ${tie} · the method broke a tie ${broke} · below the floor (reported, x1) ${below}`);
console.log(`way distribution (bloody court):    ${JSON.stringify(dist)}`);
console.log(`way distribution (bloodless court): ${JSON.stringify(distB)}`);
// the verifier's own scenario: identical strengths, a belligerent and a pacific court
const s0 = { materiel: 'above', institutions: 'above', manpower: 'level', horses: 'horsed', ways: 'none', chain: 'alone', harbour: 'landbound' };
for (const m of ['bloody', 'bloodless']) { const f = fit(s0, m); console.log(`verifier's strengths ${JSON.stringify(s0)} · method ${m} -> ${f.top} (unique ${f.unique}) · C1 deploy x${hostFactors(f)[0].toFixed(4)}`); }
// WS-V3: a turned war's host size is W x KEEP for a situation cause, x1 for commander / campaign_plan
console.log(`turned to way_fortress by field_lost: ${turned('way_fortress', 'field_lost').map((x) => x.toFixed(2)).join(',')} · by commander: ${turned('way_fortress', 'commander').join(',')} · way_logistics by campaign_plan: ${turned('way_logistics', 'campaign_plan').join(',')}`);
