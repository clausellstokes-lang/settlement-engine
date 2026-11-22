// Owner Q3: three measures on the 300 untouched towns (hxd-<size>-<i>, 50 a size). Usage: node measures.mjs <line>
import { bornAll, masker, rng } from './born.mjs';
const L = process.argv[2];
const t0 = Date.now();
const { towns, SIZES } = await bornAll(L);
console.log(`born ${towns.length} in ${((Date.now() - t0) / 1000).toFixed(0)}s from ${L}`);
const R = rng(20261120);
const pick = (n) => Math.floor(R() * n);
const distinctIdx = (n, k) => { const s = new Set(); while (s.size < k) s.add(pick(n)); return [...s]; };
const mean = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN;
const pct = (x) => (100 * x).toFixed(1) + '%';
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
const M = new Map(towns.map((t) => [t, masker(t)]));

// ===== (A) cross-town repeats =====
const fields = {
  'short goal': (t) => t.npcs.map((n) => n.goal?.short),
  'long goal': (t) => t.npcs.map((n) => n.goal?.long),
  'secret': (t) => t.npcs.map((n) => n.secret?.what),
  'own hook': (t) => t.npcs.flatMap((n) => n.plotHooks || []),
  'tie description': (t) => (t.relationships || []).map((r) => r.description),
};
const lines = new Map(towns.map((t) => [t, Object.fromEntries(Object.entries(fields).map(([k, f]) => [k, f(t).filter((x) => typeof x === 'string' && x).map(M.get(t)).filter(Boolean)]))]));
console.log('\n===== (A) CROSS-TOWN REPEATS (names masked as batch.mjs; secrets ALSO masked here, batch.mjs left them raw) =====');
console.log('Per size: 600 random ordered pairs (A,B) of distinct towns (50*49=2450 > 600), and 600 random ordered triples (A,B,C).');
console.log('count = lines of B (C) whose masked text stands among A\'s (A\'s or B\'s) lines of that field; share = count / B\'s (C\'s) lines; mean share over pairs where B (C) has >=1 line. B\'s lines counted with multiplicity.');
console.log('size        field             B lines(mean)  PAIR count  PAIR share | TRIPLE count  TRIPLE share');
for (const size of SIZES) {
  const g = towns.filter((t) => t.tier === size);
  const pairs = Array.from({ length: 600 }, () => distinctIdx(g.length, 2));
  const triples = Array.from({ length: 600 }, () => distinctIdx(g.length, 3));
  for (const k of Object.keys(fields)) {
    const pc = [], ps = [], tc = [], ts = [], bl = [];
    for (const [a, b] of pairs) { const A = new Set(lines.get(g[a])[k]); const Bl = lines.get(g[b])[k]; const c = Bl.filter((x) => A.has(x)).length; pc.push(c); bl.push(Bl.length); if (Bl.length) ps.push(c / Bl.length); }
    for (const [a, b, c3] of triples) { const AB = new Set([...lines.get(g[a])[k], ...lines.get(g[b])[k]]); const Cl = lines.get(g[c3])[k]; const c = Cl.filter((x) => AB.has(x)).length; tc.push(c); if (Cl.length) ts.push(c / Cl.length); }
    console.log(`${size.padEnd(11)} ${k.padEnd(17)} ${mean(bl).toFixed(1).padStart(8)}      ${mean(pc).toFixed(2).padStart(7)}    ${pct(mean(ps)).padStart(7)}  | ${mean(tc).toFixed(2).padStart(9)}    ${pct(mean(ts)).padStart(7)}`);
  }
}

// ===== (B) sameness of a tension's sentence =====
console.log('\n===== (B) TENSION DESCRIPTION SAMENESS (history.currentTensions[].description, as batch.mjs reads "tension: description") =====');
const tRaw = new Map(towns.map((t) => [t, new Set((t.history.currentTensions || []).map((x) => x.description).filter(Boolean))]));
const tMask = new Map(towns.map((t) => [t, new Set((t.history.currentTensions || []).map((x) => M.get(t)(x.description)).filter(Boolean))]));
const shares = (tri, map) => { const a = tri.map((t) => map.get(t)); const sh = (x, y) => [...x].some((d) => y.has(d)); return sh(a[0], a[1]) || sh(a[0], a[2]) || sh(a[1], a[2]); };
const triRun = (pool, label) => { let r = 0, m = 0; for (let i = 0; i < 3000; i++) { const tri = distinctIdx(pool.length, 3).map((j) => pool[j]); if (shares(tri, tRaw)) r++; if (shares(tri, tMask)) m++; } console.log(`${label.padEnd(12)} n=${String(pool.length).padStart(3)} 3000 triples: >=2 share a description: as stored ${pct(r / 3000)}  masked ${pct(m / 3000)}`); };
triRun(towns, 'mixed sizes');
for (const size of SIZES) triRun(towns.filter((t) => t.tier === size), size);
console.log(`towns with >=1 tension: ${towns.filter((t) => tRaw.get(t).size).length}/300; tensions total ${towns.reduce((x, t) => x + (t.history.currentTensions || []).length, 0)}`);
for (const [label, map] of [['as stored', tRaw], ['masked', tMask]]) {
  const tl = tally(towns.flatMap((t) => [...map.get(t)]));
  console.log(`distinct descriptions (${label}): ${tl.length}. Five commonest (towns reached of 300):`);
  for (const [d, c] of tl.slice(0, 5)) console.log(`  ${String(c).padStart(3)} (${pct(c / 300)})  "${d}"`);
}

// ===== (C) five facts among calm towns =====
console.log('\n===== (C) FIVE FACTS, CALM TOWNS (t.stress null/empty) =====');
const CAT_KINDS = { external_threat: 'siege ("The Siege", type disaster)', great_fire: 'great fire', great_flood: 'flood', plague_years: 'plague', resource_scarcity: 'famine? ("The Shortage"; GUESS)' };
const CAT_STRICT = new Set(['external_threat', 'great_fire', 'great_flood', 'plague_years']);
const CAT_WIDE = new Set([...CAT_STRICT, 'resource_scarcity']);
const MAJOR = new Set(['major', 'catastrophic']);
const BAD = new Set(['corruption_scandal', 'legitimacy_crisis', 'succession_crisis', 'tyranny', 'leadership_vacuum', 'popular_uprising', 'heresy_trial']);
const STRAIGHT = new Set(['honest', 'candid', 'forthright', 'plain-dealing', 'principled', 'incorruptible', 'fair-minded', 'equitable']); // npcData.js DEALING_TRAIT_FAMILY 'straight'
const JUSTICE = new Set(['principled', 'fair-minded', 'equitable', 'incorruptible']); // paradigmAxisCatalog JUSTICE virtue + expressions
const FRIENDLY = new Set(['symbiotic', 'dependent']); // GUESS: no 'alliance'/'friendly' type exists
console.log('M1 path: powerStructure.previousGovernments (also checked history.previousGovernments); empty = absent, non-array or length 0');
console.log('M2 kinds by historicalEvents[].templateType:', JSON.stringify(CAT_KINDS), '; severity field historicalEvents[].severity in {major, catastrophic}; same kind = currentTensions[].type === templateType. No raid kind exists.');
console.log('M3 tension kinds:', [...BAD].join(','), '+ powerStructure.criminalCaptureState === "none"');
console.log('M4 leader = the npc holding rank 1 in a membership of powerStructure.governingName (exactly 1 per town; always structuralRank "head"); temperament = personality.dominant; principled = DEALING_TRAIT_FAMILY "straight":', [...STRAIGHT].join(','));
console.log('M5 powerStructure.factionRelationships[] row whose pair holds governingName and a faction of category "religious", type in', [...FRIENDLY].join('/'), '(GUESS; types seen: dependent, subordinate, tense, symbiotic, competitive)');
const leaderOf = (t) => t.npcs.find((n) => (n.memberships || []).some((m) => m.power === t.powerStructure.governingName && m.rank === 1));
const calmOf = (t) => !t.stress || (Array.isArray(t.stress) && !t.stress.length);
function facts(t) {
  const ps = t.powerStructure, h = t.history;
  const pg = ps.previousGovernments ?? h.previousGovernments;
  const tenT = new Set((h.currentTensions || []).map((x) => x.type));
  const m2 = (set) => { const ev = (h.historicalEvents || []).filter((e) => set.has(e.templateType) && MAJOR.has(e.severity)); return ev.length > 0 && !ev.some((e) => tenT.has(e.templateType)); };
  // "AND no current tension is of the same kind": read as no tension of the kind of ANY qualifying event (stricter)
  const lead = leaderOf(t); const dom = lead?.personality?.dominant;
  const cat = Object.fromEntries(ps.factions.map((f) => [f.faction, f.category]));
  const govRel = (ps.factionRelationships || []).filter((r) => r.pair.includes(ps.governingName) && r.pair.some((x) => x !== ps.governingName && cat[x] === 'religious'));
  return {
    M1: !Array.isArray(pg) || pg.length === 0,
    M2: m2(CAT_STRICT), M2w: m2(CAT_WIDE),
    M3: ![...tenT].some((x) => BAD.has(x)) && ps.criminalCaptureState === 'none',
    M4: STRAIGHT.has(dom), M4j: JUSTICE.has(dom), M4null: dom == null,
    M5: govRel.some((r) => FRIENDLY.has(r.type)), M5sym: govRel.some((r) => r.type === 'symbiotic'), govRelig: govRel.length > 0,
  };
}
console.log('\nsize        calm  M1          M2(strict)  M2(+famine) M3          M4(straight) M4(justice) leaderNoTemperament  M5(sym|dep) M5(sym only) govHasRelRowWithFaith');
const F = new Map(towns.map((t) => [t, facts(t)]));
for (const size of SIZES) {
  const c = towns.filter((t) => t.tier === size && calmOf(t)); const n = c.length;
  const cs = (k) => { const x = c.filter((t) => F.get(t)[k]).length; return `${x} (${Math.round(100 * x / n)}%)`.padEnd(12); };
  console.log(`${size.padEnd(11)} ${String(n).padStart(4)}  ${cs('M1')}${cs('M2')}${cs('M2w')}${cs('M3')}${cs('M4')} ${cs('M4j')}${cs('M4null')}         ${cs('M5')}${cs('M5sym')}${cs('govRelig')}`);
}
const score = (f) => [f.M1, f.M2, f.M3, f.M4, f.M5].filter(Boolean).length;
console.log('\nJOINT (M1, M2 strict, M3, M4 straight, M5 sym|dep): calm towns holding 0..5 facts');
console.log('size         0   1   2   3   4   5');
for (const size of SIZES) { const c = towns.filter((t) => t.tier === size && calmOf(t)); const d = [0, 0, 0, 0, 0, 0]; for (const t of c) d[score(F.get(t))]++; console.log(`${size.padEnd(11)} ${d.map((x) => String(x).padStart(3)).join(' ')}`); }
console.log('\nCALM + prosperity Prosperous/Comfortable: how many hold >=2 and >=3 of the five (M5 as guessed); [and of the four M1-M4]');
console.log('size        calm  P/C   >=2   >=3   [M1-4 >=2  >=3]   legitimacy labels of calm towns');
for (const size of SIZES) {
  const c = towns.filter((t) => t.tier === size && calmOf(t)); const pc = c.filter((t) => ['Prosperous', 'Comfortable'].includes(t.economicState?.prosperity));
  const s4 = (f) => [f.M1, f.M2, f.M3, f.M4].filter(Boolean).length;
  const lab = tally(c.map((t) => t.powerStructure.publicLegitimacy?.label)).map(([k, v]) => `${k} ${v}`).join(', ');
  console.log(`${size.padEnd(11)} ${String(c.length).padStart(4)} ${String(pc.length).padStart(4)}  ${String(pc.filter((t) => score(F.get(t)) >= 2).length).padStart(4)}  ${String(pc.filter((t) => score(F.get(t)) >= 3).length).padStart(4)}   [${String(pc.filter((t) => s4(F.get(t)) >= 2).length).padStart(4)}  ${String(pc.filter((t) => s4(F.get(t)) >= 3).length).padStart(4)}]    ${lab}`);
}
