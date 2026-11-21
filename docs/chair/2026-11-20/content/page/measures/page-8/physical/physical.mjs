// PAGE-8 PHYSICAL (brief: docs/chair/2026-11-20/content/page/briefs/PHYSICAL.md): the cards' physical lines
// (`npcs[].physical.build`, `.feature`, `.clothes`) repeated inside one place. MEASURE FIRST: the pools, the draw, the cards
// a place holds, the share of places where two cards share a line and the five worst lines; then (a) THE HELD PICK's
// projection (the roll kept, a draw-free walk in seed order to the next unheld admitted row) and (b) the lines each pool
// needs. Writes nothing under src/ or tests/; imports only modules it never changes.
//
//   forge:   node <this> forge "$PWD" <cache.json> [nPerSize=150]
//            the chair's recipe (untouched settings, seeds hxd-<size>-<i>, as page-8/secret/secretLines.mjs forges),
//            each place reduced to its cards' three lines (pool indices) and the clothes rows its facts admit;
//            run it through `sh scripts/gate-mutex.sh --run -- …`.
//   measure: node <this> measure "$PWD" <cache.json>     (reads the cache only)
//
// A place counts once for a line when two or more of its cards carry that line (the line's own text, no masking: the
// three fields carry no name).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const [, , MODE, L = process.cwd(), CACHE, nA = '150'] = process.argv;
const say = (...a) => console.log(...a);
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : 'n/a');

const { NPC_BUILDS, NPC_FEATURES, NPC_WANTS } = await import(`${L}/src/data/npcData.js`);
const { lineText, filterDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const CATS = Object.keys(NPC_WANTS);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

if (MODE === 'forge') {
  const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
  const { birthFactsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
  const { resolveGenerationWorldLaw } = await import(`${L}/src/generators/generationContext.js`);
  await loadGenerationLawPayloads();
  const towns = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : [];
  const have = new Set(towns.map((t) => t.seed));
  const t0 = Date.now();
  let n = 0;
  for (const size of SIZES) for (let i = 0; i < +nA; i++) {
    const seed = `hxd-${size}-${i}`;
    if (have.has(seed)) continue;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    // the clothes rows the place's birth facts admit, per category (the birth's own read: npcGenerator.js ::
    // generateSingleNPC hands generateNPCAppearance birthFactsOf({ institutions, config, tier, powerStructure }, worldLaw))
    const cfg = t.config || {};
    const worldLaw = resolveGenerationWorldLaw(null, cfg);
    const facts = birthFactsOf({ institutions: t.institutions, config: cfg, tier: t.tier || size, powerStructure: { government: t.powerStructure?.government } }, worldLaw);
    const admitted = Object.fromEntries(CATS.map((c) => {
      const keep = new Set(filterDeclared(NPC_WANTS[c], { facts }));
      return [c, NPC_WANTS[c].map((row, k) => (keep.has(row) ? k : -1)).filter((k) => k >= 0)];
    }));
    towns.push({
      seed, size, admitted,
      npcs: (t.npcs || []).map((c) => ({
        id: c.id ?? null, cat: c.category ?? null,
        b: c.physical?.build ?? null, f: c.physical?.feature ?? null, c: c.physical?.clothes ?? null,
      })),
    });
    if (++n % 50 === 0) say(`forged ${n} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  writeFileSync(CACHE, JSON.stringify(towns));
  say(`FORGED ${towns.length} places in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${CACHE}`);
  process.exit(0);
}
if (MODE !== 'measure') { say('mode: forge|measure <tree> <cache.json> [n]'); process.exit(2); }

const towns = JSON.parse(readFileSync(CACHE, 'utf8'));
const bySize = Object.fromEntries(SIZES.map((s) => [s, towns.filter((t) => t.size === s)]));

// ── 1. THE POOLS ─────────────────────────────────────────────────────────────────────────────────────────────────
const wantText = Object.fromEntries(CATS.map((c) => [c, NPC_WANTS[c].map((r) => lineText(r))]));
const wantHome = new Map(); // clothes text -> [category, row]
let wantDupes = 0;
for (const c of CATS) wantText[c].forEach((x, k) => { if (wantHome.has(x)) wantDupes++; else wantHome.set(x, [c, k]); });
say('## 1. THE POOLS');
say(`build    npcData.js :: NPC_BUILDS    ${NPC_BUILDS.length} rows, flat strings, no declarations, no class split`);
say(`feature  npcData.js :: NPC_FEATURES  ${NPC_FEATURES.length} rows, flat strings, no declarations, no class split`);
say(`clothes  npcData.js :: NPC_WANTS     ${CATS.length} category pools: ${CATS.map((c) => `${c} ${NPC_WANTS[c].length}`).join(', ')} (= ${CATS.reduce((a, c) => a + NPC_WANTS[c].length, 0)} rows; ${wantDupes} text shared across categories)`);
for (const c of CATS) NPC_WANTS[c].forEach((r, k) => { if (r.needs) say(`         declared: ${c}[${k}] needs ${JSON.stringify(r.needs)}  "${lineText(r)}"`); });

// ── 2. THE CARDS A PLACE HOLDS, AND THE FIELDS ARE ALL STORED ─────────────────────────────────────────────────────
say('\n## 2. THE CARDS A PLACE HOLDS (npcs[])');
let missing = 0; let offPool = { b: 0, f: 0, c: 0 };
const B = new Set(NPC_BUILDS); const F = new Set(NPC_FEATURES);
for (const t of towns) for (const n of t.npcs) {
  if (!n.b || !n.f || !n.c) missing++;
  if (n.b && !B.has(n.b)) offPool.b++;
  if (n.f && !F.has(n.f)) offPool.f++;
  if (n.c && !wantHome.has(n.c)) offPool.c++;
}
say(`cards missing a field: ${missing}; lines off their pool: build ${offPool.b}, feature ${offPool.f}, clothes ${offPool.c}`);
let catMismatch = 0;
for (const t of towns) for (const n of t.npcs) if (n.c && wantHome.has(n.c) && wantHome.get(n.c)[0] !== n.cat) catMismatch++;
say(`cards whose clothes come from a pool other than their stored category's: ${catMismatch}`);
say('size        places  cards mean  max  | max cards of one clothes category in a place (which)');
const cardStats = {};
for (const s of SIZES) {
  const ts = bySize[s]; const ks = ts.map((t) => t.npcs.length);
  let worstCat = 0; let worstWhich = '';
  for (const t of ts) {
    const cnt = {}; for (const n of t.npcs) { const h = wantHome.get(n.c); if (h) cnt[h[0]] = (cnt[h[0]] || 0) + 1; }
    for (const [c, v] of Object.entries(cnt)) if (v > worstCat) { worstCat = v; worstWhich = c; }
  }
  cardStats[s] = { mean: ks.reduce((a, b) => a + b, 0) / ks.length, max: Math.max(...ks), worstCat, worstWhich };
  say(`${s.padEnd(11)} ${String(ts.length).padStart(6)}  ${cardStats[s].mean.toFixed(1).padStart(10)}  ${String(cardStats[s].max).padStart(3)}  | ${worstCat} (${worstWhich})`);
}
// the category spread of a metropolis's cards
{
  const tot = {}; let all = 0;
  for (const t of bySize.metropolis) for (const n of t.npcs) { const h = wantHome.get(n.c); if (h) { tot[h[0]] = (tot[h[0]] || 0) + 1; all++; } }
  say(`metropolis cards by clothes pool: ${CATS.map((c) => `${c} ${pct(tot[c] || 0, all)}`).join(', ')}`);
  const mx = Object.fromEntries(CATS.map((c) => [c, 0]));
  const p90 = Object.fromEntries(CATS.map((c) => [c, []]));
  for (const t of bySize.metropolis) {
    const cnt = {}; for (const n of t.npcs) { const h = wantHome.get(n.c); if (h) cnt[h[0]] = (cnt[h[0]] || 0) + 1; }
    for (const c of CATS) { mx[c] = Math.max(mx[c], cnt[c] || 0); p90[c].push(cnt[c] || 0); }
  }
  const q = (a, f) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(f * s.length))]; };
  say(`metropolis cards of one category in a place, mean / p90 / max: ${CATS.map((c) => `${c} ${(p90[c].reduce((a, b) => a + b, 0) / p90[c].length).toFixed(1)}/${q(p90[c], 0.9)}/${mx[c]}`).join(', ')}`);
}

// ── 3. THE REPEAT, AS IT STANDS ──────────────────────────────────────────────────────────────────────────────────
const FIELDS = [['build', 'b'], ['feature', 'f'], ['clothes', 'c']];
const repeatsIn = (vals) => { const m = new Map(); for (const v of vals) if (v) m.set(v, (m.get(v) || 0) + 1); return [...m].filter(([, k]) => k > 1).map(([v]) => v); };
say('\n## 3. THE REPEAT AS IT STANDS (share of places where two cards share a line)');
const before = {};
for (const [name, k] of FIELDS) {
  say(`\n### ${name}`);
  const all = new Map();
  for (const s of SIZES) {
    const per = new Map(); let hit = 0;
    for (const t of bySize[s]) {
      const r = repeatsIn(t.npcs.map((n) => n[k]));
      if (r.length) hit++;
      for (const v of r) { per.set(v, (per.get(v) || 0) + 1); all.set(v, (all.get(v) || 0) + 1); }
    }
    before[`${name}:${s}`] = hit;
    const top = [...per].sort((a, b) => b[1] - a[1]).slice(0, 5);
    say(`${s.padEnd(11)} ${String(hit).padStart(3)}/${bySize[s].length} ${pct(hit, bySize[s].length).padStart(6)}  worst: ${top.map(([v, c]) => `"${v}" ${c}`).join(' | ') || '-'}`);
  }
  const top = [...all].sort((a, b) => b[1] - a[1]).slice(0, 5);
  say(`ALL 900: places repeating each of the five worst lines: ${top.map(([v, c]) => `"${v}" ${c}`).join(' | ')}`);
}

// ── 4. (a) THE HELD PICK: the roll kept, a draw-free walk in seed order (the next row, wrapping) to the first row ────
// no card of the place holds and the place's facts admit; every admitted row held: the least-held admitted row nearest
// the roll (a repeat cannot be avoided). Simulated in npcs[] order (the birth order: the houses' faces in roster order,
// then the mints); the share after does not depend on the order, the count of cards that move does.
const walk = (pool, admittedIdx, start, counts) => {
  const ok = new Set(admittedIdx);
  const n = pool.length;
  let best = -1; let bestHeld = Infinity;
  for (let j = 0; j < n; j++) {
    const r = (start + j) % n;
    if (!ok.has(r)) continue;
    const h = counts.get(pool[r]) || 0;
    if (h === 0) return r;
    if (h < bestHeld) { bestHeld = h; best = r; }
  }
  return best >= 0 ? best : start;
};
say('\n## 4. (a) THE HELD PICK, PROJECTED (the roll kept; a draw-free walk to the next unheld admitted row)');
const after = {};
for (const [name, k] of FIELDS) {
  say(`\n### ${name}`);
  for (const s of SIZES) {
    let hit = 0; let moved = 0; let cards = 0; let overfull = 0;
    for (const t of bySize[s]) {
      const counts = new Map(); const out = [];
      for (const n of t.npcs) {
        const v = n[k]; if (!v) continue; cards++;
        let pool; let adm; let start;
        if (k === 'b') { pool = NPC_BUILDS; adm = pool.map((_, i) => i); start = pool.indexOf(v); }
        else if (k === 'f') { pool = NPC_FEATURES; adm = pool.map((_, i) => i); start = pool.indexOf(v); }
        else { const [c, row] = wantHome.get(v); pool = wantText[c]; adm = t.admitted[c]; if (!adm.includes(row)) adm = [...adm, row].sort((a, b) => a - b); start = row; }
        const r = walk(pool, adm, start, counts);
        const w = pool[r];
        if (w !== v) moved++;
        counts.set(w, (counts.get(w) || 0) + 1);
        out.push(w);
      }
      if (repeatsIn(out).length) hit++;
      // a place with more cards drawing on one pool than the pool has admitted rows
      if (k === 'c') {
        const per = {}; for (const n of t.npcs) { const h = wantHome.get(n.c); if (h) per[h[0]] = (per[h[0]] || 0) + 1; }
        if (Object.entries(per).some(([c, m]) => m > Math.max(t.admitted[c].length, 1))) overfull++;
      } else if (t.npcs.length > (k === 'b' ? NPC_BUILDS.length : NPC_FEATURES.length)) overfull++;
    }
    after[`${name}:${s}`] = hit;
    say(`${s.padEnd(11)} before ${pct(before[`${name}:${s}`], bySize[s].length).padStart(6)}  after ${String(hit).padStart(3)}/${bySize[s].length} ${pct(hit, bySize[s].length).padStart(6)}  cards moved ${moved}/${cards} (${pct(moved, cards)})  places with more cards on one pool than its admitted rows: ${overfull}`);
  }
}

// ── 5. (b) THE LINES EACH POOL NEEDS ────────────────────────────────────────────────────────────────────────────────
// WITH (a): a pool cures a place iff its admitted rows >= the cards that draw on it there. The need is the most cards
// one place puts on the pool (max over the 900), and the 99th-percentile figure beside it.
// WITHOUT (a) (draws with replacement, the roll as it is): the rows n for which a place of k cards on the pool repeats
// with probability <= 15% (the chair's bar), from P(no repeat) = prod_{i<k} (1 - i/n).
const noRepeat = (k, n) => { let p = 1; for (let i = 1; i < k; i++) p *= Math.max(0, 1 - i / n); return p; };
const rowsFor = (k, bar = 0.15) => { let n = Math.max(k, 1); while (1 - noRepeat(k, n) > bar) n = Math.ceil(n * 1.01) + 1; return n; };
say('\n## 5. (b) THE LINES EACH POOL NEEDS');
const q = (a, f) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(f * s.length))]; };
for (const [name, k] of FIELDS) {
  if (k !== 'c') {
    const pool = k === 'b' ? NPC_BUILDS : NPC_FEATURES;
    const ks = towns.map((t) => t.npcs.length);
    const met = bySize.metropolis.map((t) => t.npcs.length);
    const kMax = Math.max(...ks); const k99 = q(met, 0.99); const kMean = met.reduce((a, b) => a + b, 0) / met.length;
    say(`${name.padEnd(8)} has ${pool.length}; WITH (a) needs ${kMax} (max cards in one place; metropolis p99 ${k99}, mean ${kMean.toFixed(1)}) -> +${Math.max(0, kMax - pool.length)}; WITHOUT (a) needs ~${rowsFor(Math.round(kMean))} for a mean metropolis (${Math.round(kMean)} cards) to repeat in <=15% of places, ~${rowsFor(kMax)} for the largest`);
  } else {
    for (const c of CATS) {
      const per = towns.map((t) => t.npcs.filter((n) => wantHome.get(n.c)?.[0] === c).length);
      const met = bySize.metropolis.map((t) => t.npcs.filter((n) => wantHome.get(n.c)?.[0] === c).length);
      const kMax = Math.max(...per); const kMean = met.reduce((a, b) => a + b, 0) / met.length;
      const adm = Math.min(...towns.map((t) => t.admitted[c].length));
      say(`clothes.${c.padEnd(10)} has ${NPC_WANTS[c].length} (fewest admitted in a place ${adm}); WITH (a) needs ${kMax} admitted (max cards of the category in one place; metropolis mean ${kMean.toFixed(1)}, p90 ${q(met, 0.9)}) -> +${Math.max(0, kMax - adm)}; WITHOUT (a) ~${rowsFor(Math.round(kMean))} for a mean metropolis, ~${rowsFor(kMax)} for the largest`);
    }
  }
}
say('\nDONE');
