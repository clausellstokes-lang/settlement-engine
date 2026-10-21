// D-WS-r3 probe 1 (WS-r1-1 under RULINGS-P6 E.1 · WS-V4 · WS-V5): the r3 fit and host lean over the
// volume's §3.3 strength cells (unchanged from r2) and §4.2 HOST cells.
// E.1: the WAY is the strengths alone; ties broken by CODEPOINT (no method tie-break); the method is a
// read-only label. Claim (S17): two courts with IDENTICAL strengths and different characters (method,
// plan existence — the plan's mint reads the atrocity brake over malice/lawfulness/expectedBloodyShare —
// and the general) take IDENTICAL C1/C2/C6 factors every week, unturned or turned.
// Also run under the r2 rules (method tie-break; plan FIRST; plan/commander host x1) to show the doors.
// Pure arithmetic over the volume's own cells; no import of the worktree.
const W = 0.12, KEEP = 0.5, FLOOR = 2, P_SIT = 0.5;
const lvl = { below: 0, level: 1, above: 2 };
const cells = {
  way_attrition:  (s) => (s.manpower === 'above' ? 2 : 0) + (lvl[s.institutions] >= 1 ? lvl[s.institutions] : 0),
  way_coalition:  (s) => ({ alone: 0, few: 1, many: 2 })[s.chain] + (lvl[s.manpower] <= 1 ? 1 : 0),
  way_fortress:   (s) => (s.institutions === 'above' ? 2 : 0) + (lvl[s.manpower] <= 1 ? 1 : 0),
  way_harassment: (s) => (s.manpower === 'below' ? 1 : 0) + (s.institutions === 'below' ? 1 : 0) + ({ none: 0, few: 1, many: 2 })[s.ways],
  way_logistics:  (s) => (s.harbour === 'seafaring' ? 1 : 0) + (lvl[s.institutions] >= 1 ? lvl[s.institutions] : 0), // r2 cell
  way_raiding:    (s) => (s.horses === 'horsed' ? 1 : 0) + ({ none: 0, few: 1, many: 2 })[s.ways] + (lvl[s.manpower] <= 1 ? 1 : 0),
  way_shock:      (s) => (s.materiel === 'above' ? 2 : 0) + (lvl[s.manpower] >= 1 ? lvl[s.manpower] : 0) + (s.horses === 'horsed' ? 1 : 0),
};
// r3 REFINED logistics cell (logisticsCells.out V3): seafaring + materiel level+ (two at above) + institutions level+ (one step)
const logisticsR3 = (s) => (s.harbour === 'seafaring' ? 1 : 0) + (lvl[s.materiel] >= 1 ? lvl[s.materiel] : 0) + (lvl[s.institutions] >= 1 ? 1 : 0);
const cellOf = (w, rules) => (rules === 'r3' && w === 'way_logistics' ? logisticsR3 : cells[w]);
const methodCell = { way_logistics: 'bloodless', way_raiding: 'bloody' }; // r2 only
const host = { // [C1 deploy, C1 defend/hold, C1 sue, C2 ramp, C6 raid]
  way_attrition: [+1, 0, -1, +1, 0], way_harassment: [0, +1, 0, 0, 0], way_logistics: [0, +1, 0, 0, 0],
  way_shock: [+1, -1, +1, +1, -1], way_fortress: [-1, +1, 0, -1, -1], way_coalition: [0, 0, 0, 0, 0],
  way_raiding: [0, 0, +1, +1, +1],
};
const ways = Object.keys(cells).sort();
const INDIRECT = new Set(['way_harassment', 'way_logistics', 'way_raiding']);
const SIT = [['field_lost', 'way_fortress'], ['coffers_bare', 'way_raiding'], ['levy_thin', 'way_coalition'],
  ['foe_on_the_ways', 'way_logistics'], ['ally_failed', 'way_fortress'], ['siege_long', 'way_logistics']];
function fit(s, method, rules) {
  const sc = Object.fromEntries(ways.map((w) => [w, cellOf(w, rules)(s)]));
  const best = Math.max(...ways.map((w) => sc[w]));
  const tied = ways.filter((w) => sc[w] === best);
  let top = tied[0]; // codepoint
  if (rules === 'r2' && tied.length > 1) { const m = tied.filter((w) => methodCell[w] === method); if (m.length) top = m[0]; }
  return { top, unique: tied.length === 1, applied: best >= FLOOR, tied };
}
const own = (f) => host[f.top].map((sg) => (f.unique && f.applied ? 1 + sg * W : 1));
const turnedF = (way) => host[way].map((sg) => 1 + sg * W * KEEP);
// court: { method, plan: null|'way_raiding'|'way_logistics', general: null|'way_shock'|'way_fortress' }
// schedule: { cause: name|null, from: week }; u: the season's one keyed draw (identical in the controlled pair)
function season(s, court, sched, u, rules) {
  const f = fit(s, court.method, rules); const out = []; let latch = null;
  for (let wk = 0; wk < 13; wk++) {
    const sitHolds = sched.cause && wk >= sched.from ? SIT.filter(([c]) => c === sched.cause).map(([c, to]) => ({ c, to }))[0] : null;
    const sit = sitHolds && sitHolds.to !== f.top ? sitHolds : null; // no-op judged against the court's own way
    const plan = court.plan && !INDIRECT.has(f.top) && court.plan !== f.top ? { c: 'campaign_plan', to: court.plan, p: 1 } : null;
    const gen = court.general && court.general !== f.top ? { c: 'commander', to: court.general, p: 0.5 } : null;
    if (rules === 'r3') {
      if (latch && (latch.c === 'campaign_plan' || latch.c === 'commander') && sit && u < P_SIT) latch = { ...sit }; // a situation replaces a character-borne latch
      if (!latch) {
        if (sit) { if (u < P_SIT) latch = { ...sit }; } // a holding situation masks the character-borne causes
        else if (plan) latch = plan; else if (gen && u < gen.p) latch = gen;
      }
      const charBorne = !latch || latch.c === 'campaign_plan' || latch.c === 'commander';
      out.push((charBorne ? own(f) : turnedF(latch.to)).map((x) => x.toFixed(4)).join(','));
    } else { // r2: plan FIRST (p=1), then situations, then commander; character-borne turns lean C1/C2/C6 x1
      if (!latch) {
        if (plan) latch = plan; else if (sit) { if (u < P_SIT) latch = { ...sit }; } else if (gen && u < gen.p) latch = gen;
      }
      const v = !latch ? own(f) : (latch.c === 'campaign_plan' || latch.c === 'commander') ? [1, 1, 1, 1, 1] : turnedF(latch.to);
      out.push(v.map((x) => x.toFixed(4)).join(','));
    }
  }
  return out.join('|');
}
const B3 = ['below', 'level', 'above']; const vecs = [];
for (const manpower of B3) for (const institutions of B3) for (const materiel of B3)
for (const kw of ['none', 'few', 'many']) for (const horses of ['poor', 'horsed'])
for (const chain of ['alone', 'few', 'many']) for (const harbour of ['landbound', 'seafaring']) vecs.push({ manpower, institutions, materiel, ways: kw, horses, chain, harbour });
// the controlled pairs: A bloody, a live raiding plan, a bold general; B bloodless, no plan, no general
const A = { method: 'bloody', plan: 'way_raiding', general: 'way_shock' };
const Bc = { method: 'bloodless', plan: null, general: null };
const A2 = { method: 'bloodless', plan: 'way_logistics', general: 'way_fortress' };
const scheds = [{ cause: null, from: 0 }, ...SIT.flatMap(([c]) => [{ cause: c, from: 0 }, { cause: c, from: 4 }])];
for (const rules of ['r2', 'r3']) {
  let pairs = 0, differ = 0, wayDiffers = 0; const byCause = {};
  for (const s of vecs) {
    if (fit(s, 'bloody', rules).top !== fit(s, 'bloodless', rules).top) wayDiffers++;
    for (const sc of scheds) for (const u of [0.2, 0.8]) for (const a of [A, A2]) {
      pairs++;
      if (season(s, a, sc, u, rules) !== season(s, Bc, sc, u, rules)) { differ++; const k = sc.cause || '(none)'; byCause[k] = (byCause[k] || 0) + 1; }
    }
  }
  console.log(`[${rules}] strength vectors ${vecs.length}; the WAY differs bloody vs bloodless on identical strengths: ${wayDiffers}/${vecs.length}`);
  console.log(`[${rules}] controlled pairs (13-week season x 13 schedules x 2 draws x 2 character pairs): ${pairs}; C1/C2/C6 week-series differ: ${differ}  ${JSON.stringify(byCause)}`);
}
// THE CODEPOINT TIE (r3): the distribution and the share decided by codepoint
let uniq = 0, tie = 0, below = 0; const dist = {}, distUnique = {}, tieWins = {};
for (const s of vecs) { const f = fit(s, null, 'r3'); dist[f.top] = (dist[f.top] || 0) + 1;
  if (!f.applied) below++; if (f.unique) { uniq++; distUnique[f.top] = (distUnique[f.top] || 0) + 1; } else { tie++; tieWins[f.top] = (tieWins[f.top] || 0) + 1; } }
console.log(`[r3] unique top ${uniq} · tie (codepoint names the first; host x1) ${tie} · below the floor (reported) ${below}`);
console.log(`[r3] way distribution (all): ${JSON.stringify(dist)}`);
console.log(`[r3] of which the strengths' UNIQUE top: ${JSON.stringify(distUnique)}`);
console.log(`[r3] of which named by codepoint on a tie: ${JSON.stringify(tieWins)}`);
// NEGATIVE CONTROLS (r3 cells, codepoint ties): drop one r3 rule at a time; each must re-open the door.
function seasonVariant(s, court, sched, u, v) {
  const f = fit(s, court.method, 'r3'); const out = []; let latch = null;
  for (let wk = 0; wk < 13; wk++) {
    const sh = sched.cause && wk >= sched.from ? SIT.filter(([c]) => c === sched.cause).map(([c, to]) => ({ c, to }))[0] : null;
    const sit = sh && sh.to !== f.top ? sh : null;
    const plan = court.plan && !INDIRECT.has(f.top) && court.plan !== f.top ? { c: 'campaign_plan', to: court.plan } : null;
    const gen = court.general && court.general !== f.top ? { c: 'commander', to: court.general, p: 0.5 } : null;
    const cb = (l) => l && (l.c === 'campaign_plan' || l.c === 'commander');
    if (v !== 'noReplace' && cb(latch) && sit && u < P_SIT) latch = { ...sit };
    if (!latch) {
      if (v === 'planFirst' && plan) latch = plan;
      else if (sit) { if (u < P_SIT) latch = { ...sit }; } else if (plan) latch = plan; else if (gen && u < gen.p) latch = gen;
    }
    const vals = !latch ? own(f) : cb(latch) ? (v === 'charX1' ? [1, 1, 1, 1, 1] : own(f)) : turnedF(latch.to);
    out.push(vals.map((x) => x.toFixed(4)).join(','));
  }
  return out.join('|');
}
for (const v of ['noReplace', 'planFirst', 'charX1']) {
  let differ = 0, pairs = 0;
  for (const s of vecs) for (const sc of scheds) for (const u of [0.2, 0.8]) for (const a of [A, A2]) { pairs++; if (seasonVariant(s, a, sc, u, v) !== seasonVariant(s, Bc, sc, u, v)) differ++; }
  console.log(`[negative control: r3 without ${v === 'noReplace' ? 'the replacement rule' : v === 'planFirst' ? 'the order (plan read FIRST)' : 'transparency (character-borne turn leans C1/C2/C6 x1)'}] differ ${differ}/${pairs}`);
}
