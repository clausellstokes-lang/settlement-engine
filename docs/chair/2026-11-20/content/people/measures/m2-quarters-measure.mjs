// PEOPLE-1 seat M2 (2026-11-20): the quarters measure. TODAY: `spatialLayout.quarters[].desc` by size, by quarter type and by
// branch; the false presumptions today's lines make (each read off the fact home, or the roster's row where no home exists);
// the crisis-scoped lines printed under the crisis they exclude. PROJECTED: the proposal's wordings (m2-quarters-pools.mjs)
// applied by keyed hash (`src/kernel/proseHash.js :: pickVariant`, key `${seed}|quarters.${name}.desc`), then the same counts.
// Usage: node m2-quarters-measure.mjs <worktree> <births.json from m2-quarters-births.mjs>
// "Share" = places of a size printing the sentence at the field / places of that size holding the field (any quarter).
import { readFileSync } from 'node:fs';

const [, , L, BIRTHS] = process.argv;
const { pickVariant, fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
const { POOLS, housesOf } = await import('./m2-quarters-pools.mjs');
const { places } = JSON.parse(readFileSync(BIRTHS, 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '-');

/** keyed choice of k of the items, printed in the table's order; zero draws */
const someOf = (key) => (list, k, tag) => {
  const ranked = list.map((w, i) => ({ w, i, r: fnv1a32(`${key}|${tag}|${w}`) })).sort((a, b) => a.r - b.r).slice(0, k);
  return ranked.sort((a, b) => a.i - b.i).map((x) => x.w);
};

/** project one quarter: { branch, id, text } */
function project(p, h, q) {
  const pool = POOLS[q.name];
  if (!pool) return { branch: '?', id: 'unpooled', text: q.masked };
  const branch = pool.branchOf(h, q);
  const eligible = pool[branch].filter((w) => w.when(h));
  if (!eligible.length) return { branch, id: 'NONE', text: q.masked };
  const key = `${p.seed}|quarters.${q.name}.desc`;
  const w = pickVariant(eligible, key);
  return { branch, id: w.id, text: w.text(h, someOf(key)) };
}

/** the shares: per size, the top sentence over all quarters; per size × type, the type's top sentence */
function shares(label, sentenceOf) {
  console.log(`\n## ${label}: TOP SENTENCE BY SIZE (places printing it / places holding the field)`);
  const perType = new Map();
  for (const s of SIZES) {
    const ps = places.filter((p) => p.size === s && p.quarters.length);
    const bySent = new Map();
    for (const p of ps) {
      const h = housesOf(p);
      const seen = new Set();
      for (const q of p.quarters) {
        const t = sentenceOf(p, h, q);
        if (!seen.has(t)) { seen.add(t); bySent.set(t, (bySent.get(t) || 0) + 1); }
        const k = `${q.name}`; const m = perType.get(k) || {}; m[s] = m[s] || { holders: 0, sent: new Map() };
        m[s].holders++; m[s].sent.set(t, (m[s].sent.get(t) || 0) + 1); perType.set(k, m);
      }
    }
    const [top, n] = [...bySent].sort((a, b) => b[1] - a[1])[0] || ['-', 0];
    console.log(`${label} SIZE ${s}: ${n}/${ps.length} = ${pct(n, ps.length)} distinct=${bySent.size} top="${top}"`);
  }
  console.log(`\n## ${label}: PER QUARTER TYPE (places holding the type; the type's commonest sentence)`);
  for (const [type, m] of perType) {
    for (const s of SIZES) {
      if (!m[s]) continue;
      const [top, n] = [...m[s].sent].sort((a, b) => b[1] - a[1])[0];
      console.log(`${label} TYPE ${type} | ${s}: holders=${m[s].holders} distinct=${m[s].sent.size} top=${n} (${pct(n, m[s].holders)}) "${top}"`);
    }
  }
}

// ── TODAY ──
console.log(`# M2 quarters measure: ${places.length} places (${SIZES.map((s) => `${s} ${places.filter((p) => p.size === s).length}`).join(', ')})`);
shares('TODAY', (p, h, q) => q.masked);

console.log('\n## TODAY: BRANCHES (places / entries), by size');
for (const type of Object.keys(POOLS)) {
  for (const s of SIZES) {
    const c = {};
    for (const p of places.filter((x) => x.size === s)) {
      const h = housesOf(p);
      for (const q of p.quarters.filter((x) => x.name === type)) { const b = POOLS[type].branchOf(h, q); c[b] = (c[b] || 0) + 1; }
    }
    if (Object.keys(c).length) console.log(`BRANCH ${type} | ${s}: ${Object.entries(c).map(([b, n]) => `${b}=${n}`).join(' ')}`);
  }
}

// today's false presumptions: a word of today's line whose fact the record lacks
const CHECKS = {
  'Religious Quarter': [['houses of worship (church)', (h) => !h.church], ['cloisters (institution: monastery)', (h) => !h.monastery], ['priests (clergy)', (h) => !h.church], ['streets (tier ≥ village)', (h) => ['thorp', 'hamlet'].includes(h.tier)]],
  'Market Quarter': [['market', (h) => !h.market]],
  'Noxious Trades Quarter': [['tanneries', (h) => !h.tanners], ['butchers', (h) => !h.butchers], ['dyers', (h) => !h.dyers]],
  'Waterfront District': [['warehouses', (h) => !h.warehouses], ['salt (salt works; maritime line only)', (h, q) => /salt/.test(q.desc) && !h.saltWorks]],
  'Government Quarter': [['courts (court sits)', (h) => !h.courtSits]],
  "Mages' Quarter": [["towers (wizard's tower)", (h) => !h.tower], ["arcane shops (enchanter's shop)", (h) => !h.enchanter]],
  'Shadows District': [['hidden markets (black market)', (h) => !h.blackMarket], ['criminal activity (organised crime)', (h) => h.crime === 'none']],
  'Artisan Quarter': [['guild halls (guild)', (h) => !h.guild]],
  'Fishing Landing': [['salt and fish smell (coast)', (h) => !h.coast]],
  'Alehouse & Common': [['the alehouse', (h) => !h.alehouse]],
};
console.log('\n## TODAY: FALSE PRESUMPTIONS (places holding the quarter whose record lacks the word\'s fact)');
for (const [type, checks] of Object.entries(CHECKS)) {
  for (const s of SIZES) {
    const ps = places.filter((p) => p.size === s && p.quarters.some((q) => q.name === type));
    if (!ps.length) continue;
    const row = checks.map(([w, bad]) => `${w}: ${ps.filter((p) => { const h = housesOf(p); return bad(h, p.quarters.find((q) => q.name === type)); }).length}`);
    console.log(`FALSE ${type} | ${s} (${ps.length}): ${row.join(' · ')}`);
  }
}

console.log('\n## TODAY: CRISIS-SCOPED LINES PRINTED UNDER THE CRISIS THEY EXCLUDE (declared, not enforced: textOf carries them)');
const FAMS = { threat: ['under_siege', 'occupied', 'monster_pressure'], unrest: ['insurgency', 'slave_revolt', 'wartime'] };
for (const s of SIZES) {
  let mk = 0, mkAll = 0, rq = 0, rqAll = 0;
  for (const p of places.filter((x) => x.size === s)) {
    const k = p.crisis.kinds;
    if (p.quarters.some((q) => q.name === 'Market Quarter')) { mkAll++; if (k.some((x) => FAMS.threat.includes(x) || x === 'plague_onset')) mk++; }
    if (p.quarters.some((q) => q.name === 'Religious Quarter')) { rqAll++; if (k.some((x) => FAMS.unrest.includes(x))) rq++; }
  }
  console.log(`CRISIS ${s}: Market Quarter under threat/plague_onset ${mk}/${mkAll} · Religious Quarter under unrest ${rq}/${rqAll}`);
}

// ── PROJECTED ──
shares('PROJECTED', (p, h, q) => project(p, h, q).text);
console.log('\n## PROJECTED: WORDING USE by type and size (id=count); NONE = no wording eligible (falls back to today\'s line)');
for (const type of Object.keys(POOLS)) {
  for (const s of SIZES) {
    const c = {};
    for (const p of places.filter((x) => x.size === s)) {
      const h = housesOf(p);
      for (const q of p.quarters.filter((x) => x.name === type)) { const r = project(p, h, q); const k = `${r.branch}:${r.id}`; c[k] = (c[k] || 0) + 1; }
    }
    if (Object.keys(c).length) console.log(`USE ${type} | ${s}: ${Object.entries(c).sort().map(([b, n]) => `${b}=${n}`).join(' ')}`);
  }
}
console.log('\n## PROJECTED: SAMPLE (first 2 places a size, every quarter)');
for (const s of SIZES) {
  for (const p of places.filter((x) => x.size === s).slice(0, 2)) {
    const h = housesOf(p);
    for (const q of p.quarters) console.log(`SAMPLE ${p.seed} | ${q.name}: ${project(p, h, q).text}`);
  }
}

console.log('\n## PROJECTED: THE CRISIS LAW KEPT (the same scopes as today, not widened): a "quiet" line under unrest; a Market Quarter line under threat/plague_onset');
for (const s of SIZES) {
  let quiet = 0, quietAll = 0, mk = 0;
  for (const p of places.filter((x) => x.size === s)) {
    const h = housesOf(p); const k = p.crisis.kinds;
    for (const q of p.quarters) {
      const t = project(p, h, q).text;
      if (/quiet/i.test(t)) { quietAll++; if (k.some((x) => FAMS.unrest.includes(x))) quiet++; }
      if (q.name === 'Market Quarter' && k.some((x) => FAMS.threat.includes(x) || x === 'plague_onset')) mk++;
    }
  }
  console.log(`PCRISIS ${s}: quiet lines ${quietAll}, of them under unrest ${quiet} · Market Quarter under threat/plague_onset ${mk}`);
}
