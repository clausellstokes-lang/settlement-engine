// PEOPLE-2 seat M6 (2026-11-20), copied from m4-measure.mjs (PEOPLE-1 seat M4) and changed only where the brief
// (briefs/P2-M6-power-tranche2-AUTHOR.md) changes it:
//   - 150 places a size (seeds hxd-<size>-0..149, born by m6-births.mjs into one cache file a size), the same mask;
//   - THE UNIT IS THE SENTENCE AS PRINTED: a description is cut into its OPENING (the ladder's line and anything a later
//     writer joined to it) and its standing CODAS (m6-common.mjs :: CODAS, the sentences factionStanding.js appends), each
//     part split into its sentences and counted apart; a relation narrative is counted whole. A sentence's SHARE is the places
//     of a size printing it (masked) over ALL places of that size (150), whether or not they hold the field;
//   - the pick is pickVariantMixed (m6-common.mjs, the kernel-mix commit's function reimplemented; checked below against the
//     commit's own file when its path is handed in) over [today's line, ...eligible new wordings], keyed as M4 keyed it;
//   - the pools are the first tranche AS RULED (m6-pools.mjs: the verdict's items 1 and 2, the village priest's index 0
//     taking `priest` as a need) and, at stage T2, the second tranche added (m6-tranche2.mjs).
// Stages: TODAY (as born), RULED (the first tranche as ruled: openings and codas, step A with step B), T2 (RULED plus the
// second tranche). Everything is applied HERE, on the final record's lines and facts, as M4's projection was (see its notes).
//
// Usage: node m6-measure.mjs <checkout> <cacheDir> [<kernel-mix proseHash.js>]   (prints count lines only)
import { readFileSync, existsSync } from 'node:fs';
import { maskerOf, pct, SIZES, relationBranch, admits, pickVariantMixed, cutDescription, sentencesOf, CODAS } from './m6-common.mjs';
import { RELATION_POOLS, DESC_POOLS, CODA_POOLS, INDEX0_NEEDS, AMENDMENTS } from './m6-pools.mjs';
import { DESC_POOLS_2, CODA_POOLS_2 } from './m6-tranche2.mjs';

const [, , L, cacheDir, kernelPath] = process.argv;
if (!L || !cacheDir) throw new Error('usage: node m6-measure.mjs <checkout> <cacheDir> [<kernel-mix proseHash.js>]');
const { powerNameWithArticle, powerNameAfterArticle, powerPossessive } = await import(`${L}/src/domain/display/powerSentenceName.js`);
const { pluralPowerName } = await import(`${L}/src/domain/display/pluralPowerName.js`);

// ── the pick, checked against the kernel-mix commit's own function (git show bd42d63c7:src/kernel/proseHash.js > <file>) ──
if (kernelPath && existsSync(kernelPath)) {
  const K = await import(kernelPath);
  let miss = 0; const pools = Array.from({ length: 15 }, (_x, k) => Array.from({ length: k + 1 }, (_y, j) => j));
  for (let i = 0; i < 20000; i++) for (const pool of pools) if (K.pickVariantMixed(pool, `hxd-check-${i}::k`) !== pickVariantMixed(pool, `hxd-check-${i}::k`)) miss++;
  console.log(`pick check: m6-common.mjs :: pickVariantMixed against bd42d63c7's own, 20000 keys x pools of 1..15: misses ${miss}`);
} else console.log('pick check: not run (no kernel file handed in)');

// ── the writer's own name forms (factionDynamics.js :: say, sayOf, verb, opening), as M4 ──
const say = (name) => powerNameWithArticle(name);
const sayOf = (name) => `the ${powerPossessive(powerNameAfterArticle(name))}`;
const plural = (name) => !!pluralPowerName(say(name));
const opening = (t) => t.replace(/(^|[.!?]\s+)the /g, '$1The ');
const ROLES = { GM: ['G', 'Mil'], GE: ['G', 'M'], GR: ['G', 'R'], MC: ['M', 'C'], MR: ['M', 'R'], NG: ['N', 'G'] };
function render(text, roles) {
  const out = text.replace(/\{(\w+)('s)?(?:\|([^|}]*)\|([^}]*))?\}/g, (_m, role, poss, one, many) => {
    const name = roles[role];
    if (name == null) throw new Error(`role ${role} unbound in: ${text}`);
    if (role === 'L') return name;
    if (one !== undefined) return plural(name) ? many : one;
    return poss ? sayOf(name) : say(name);
  });
  return opening(out);
}
const relationPoolKey = (row, branch) => (branch === 'NG.sub' ? (/merchant money and /.test(row.narrative) ? 'NG.sub+merchant' : 'NG.sub') : branch);
function rolesOf(row, branch) {
  const [a, b] = ROLES[branch.split('.')[0]] || [];
  const roles = { [a]: row.pair[0], [b]: row.pair[1] };
  if (branch === 'MC.vote-against') roles.L = / vote together against (.+), then fight over who keeps the profit\.$/.exec(row.narrative)[1];
  return roles;
}

// ── the guards (M4's, and the verdict's item 1 as a word list over every wording; item 5 over every wording's atoms) ──
const SEASON = /\b(winter|summer|spring|autumn|harvest|season)/i;
const MACHINERY = /\b(power share|faction|ratio|legitimacy score|percent|%)/i;
const FEELING = /\b(resent\w*|neither likes|likes it|dislikes?|enjoys?|fears?|envy|envies|jealous\w*|hates?|proud|pride|bitter\w*|grudg\w*|schem\w*|plots?|intrigu\w*|wish\w*|cannot accept|uneasy|ang\w*ry|anger|on purpose|by choice|deliberately|for now|arranging marriages|quietly)\b/i;
const CRIME_ATOM = /crime|criminal|rings|thieves|smuggl|black market/i;
const DESC_ALL = (stage) => (stage === 'T2' ? { ...DESC_POOLS, ...DESC_POOLS_2 } : DESC_POOLS);
const codaPoolOf = (stage, id) => {
  const base = CODA_POOLS.find((c) => c.id === id)?.variants || [];
  return stage === 'T2' ? [...base, ...(CODA_POOLS_2[id] || [])] : base;
};
let gm = 0; let fm = 0; let cm = 0; let n2 = 0;
const all = [
  ...Object.entries(RELATION_POOLS).map(([k, v]) => [`relation ${k}`, v, 1]),
  ...Object.entries(DESC_POOLS).map(([k, v]) => [`opening ${k.slice(0, 40)}`, v, 1]),
  ...CODA_POOLS.map((c) => [`coda ${c.id}`, c.variants, 1]),
  ...Object.entries(DESC_POOLS_2).map(([k, v]) => [`T2 opening ${k.slice(0, 40)}`, v, 2]),
  ...Object.entries(CODA_POOLS_2).map(([k, v]) => [`T2 coda ${k}`, v, 2]),
];
for (const [k, pool, tranche] of all) for (const v of pool) {
  if (tranche === 2) n2++;
  const words = v.text.replace(/\{[^}]*\}/g, 'X').split(/\s+/).length;
  if (SEASON.test(v.text) || MACHINERY.test(v.text) || words > 45) { gm++; console.log(`GUARD MISS ${k}: ${v.text}`); }
  if (FEELING.test(v.text)) { fm++; console.log(`FEELING WORD (tranche ${tranche}) ${k}: ${v.text.slice(0, 150)}`); }
  for (const a of [...(v.needs || []), ...(v.excludes || [])]) if (CRIME_ATOM.test(a)) { cm++; console.log(`CRIME ATOM ${k}: ${a}`); }
}
console.log(`guards: first tranche as ruled ${all.filter((x) => x[2] === 1).reduce((a, x) => a + x[1].length, 0)} wordings (${AMENDMENTS.length} amended), second tranche ${n2}; season / machinery / >45 words misses ${gm}; feeling or scheme words ${fm}; crime atoms ${cm}`);

const isLeaf = (s) => typeof s === 'string' && s.length >= 25 && s.includes(' ');
const addTo = (m, s, i) => { let st = m.get(s); if (!st) { st = new Set(); m.set(s, st); } st.add(i); };
const topOf = (m) => { let best = null; let n = 0; for (const [s, st] of m) if (st.size > n) { n = st.size; best = s; } return [best, n]; };
const short = (s, n = 150) => (s && s.length > n ? `${s.slice(0, n)}…` : s);

/** One opening, at a stage: [the opening as printed, the pool key it took or null]. */
function projectOpening(open, stage, p, faction) {
  if (stage === 'TODAY') return [open, null];
  const pools = DESC_ALL(stage);
  const key = Object.keys(pools).find((o) => open === o || open.startsWith(`${o} `));
  if (!key) return [open, null];
  const need0 = INDEX0_NEEDS[key];
  const zeroOk = !need0 || need0.every((a) => admits({ needs: [a] }, p.facts));
  const list = [...(zeroOk ? [key] : []), ...pools[key].filter((v) => admits(v, p.facts)).map((v) => v.text)];
  if (!list.length) return [open, key];
  const chosen = pickVariantMixed(list, `${p.recordSeed}::powerStructure.factions.desc::${faction}`);
  return [chosen + open.slice(key.length), key];
}
/** One coda, at a stage. */
function projectCoda(hit, stage, p, faction) {
  if (stage === 'TODAY') return hit.text;
  const pool = codaPoolOf(stage, hit.id);
  if (!pool.length) return hit.text;
  const fill = (t) => opening(t.replace(/\$(\d)/g, (_x, d) => hit.groups[+d - 1]));
  const list = [hit.text, ...pool.filter((v) => admits(v, p.facts)).map((v) => fill(v.text))];
  return pickVariantMixed(list, `${p.recordSeed}::powerStructure.factions.desc::${faction}::${hit.id}`);
}
/** One relation row, at a stage (the relation pools are the first tranche's at RULED and T2 alike). */
function projectRelation(row, stage, p) {
  if (stage === 'TODAY') return row.narrative;
  const { branch, twin } = relationBranch(row);
  const pool = twin ? null : RELATION_POOLS[relationPoolKey(row, branch)];
  if (!pool) return row.narrative;
  const roles = rolesOf(row, branch);
  const list = [row.narrative, ...pool.filter((v) => admits(v, p.facts)).map((v) => render(v.text, roles))];
  return pickVariantMixed(list, `${p.recordSeed}::powerStructure.factionRelationships.narrative::${[...row.pair].sort().join('||')}`);
}

const STAGES = ['TODAY', 'RULED', 'T2'];
const R = {}; // R[size][stage] = { open: Map, coda: Map, rel: Map, codaId: Map(sentence -> id), codaPlaces: Map(id -> Set), openKey: Map(sentence -> key) }
let missedRest = 0;
for (const size of SIZES) {
  const places = JSON.parse(readFileSync(`${cacheDir}/${size}.json`, 'utf8')).sizes[size];
  R[size] = { N: places.length };
  for (const stage of STAGES) {
    const S = { open: new Map(), coda: new Map(), rel: new Map(), codaId: new Map(), codaPlaces: new Map(), openKey: new Map(), poolPlaces: new Map() };
    for (const p of places) {
      const mask = maskerOf(p.names);
      for (const f of p.factions) {
        if (!isLeaf(f.desc)) continue;
        const cut = cutDescription(f.desc);
        if (cut.rest && stage === 'TODAY') missedRest++;
        const [op, key] = projectOpening(cut.opening, stage, p, f.faction);
        if (key) addTo(S.poolPlaces, key, p.i);
        for (const s of sentencesOf(op)) { const m = mask(s); addTo(S.open, m, p.i); if (key) S.openKey.set(m, key); }
        for (const hit of cut.codas) {
          addTo(S.codaPlaces, hit.id, p.i);
          for (const s of sentencesOf(projectCoda(hit, stage, p, f.faction))) { const m = mask(s); addTo(S.coda, m, p.i); S.codaId.set(m, hit.id); }
        }
      }
      for (const row of p.relations) if (isLeaf(row.narrative)) addTo(S.rel, mask(projectRelation(row, stage, p)), p.i);
    }
    R[size][stage] = S;
  }
}
console.log(`descriptions with text after a coda that no coda pattern matched: ${missedRest}`);

// ════ A. the top sentence by size, by part, today / as ruled / with the second tranche ════
console.log('\n=== A. THE TOP SENTENCE BY SIZE (places printing it / ALL places of the size) ===');
for (const size of SIZES) for (const stage of STAGES) for (const part of ['open', 'coda', 'rel']) {
  const [s, n] = topOf(R[size][stage][part]);
  const tag = part === 'coda' && s ? ` [${R[size][stage].codaId.get(s)}]` : '';
  console.log(`A ${stage} ${size} ${part === 'open' ? 'openings' : part === 'coda' ? 'codas' : 'relations'}: ${n}/${R[size].N} ${pct(n, R[size].N)}${tag} | ${short(s)}`);
}
for (const stage of ['RULED', 'T2']) for (const size of SIZES) for (const part of ['open', 'coda', 'rel']) {
  for (const [s, st] of [...R[size][stage][part]].filter(([, st]) => st.size / R[size].N > 0.15).sort((a, b) => b[1].size - a[1].size)) {
    const tag = part === 'coda' ? ` [coda ${R[size][stage].codaId.get(s)}]` : part === 'open' && R[size][stage].openKey.get(s) ? ' [pooled]' : '';
    console.log(`  over 15% ${stage} ${size} ${part}: ${st.size}/${R[size].N} ${pct(st.size, R[size].N)}${tag} | ${short(s, 130)}`);
  }
}

// ════ B. the codas printing in more than half of a size's places today, and what the ruling leaves ════
console.log('\n=== B. CODAS IN MORE THAN HALF OF A SIZE\'S PLACES TODAY ===');
const codaTop = (size, stage, id) => { let n = 0; let best = null; for (const [s, st] of R[size][stage].coda) if (R[size][stage].codaId.get(s) === id && st.size > n) { n = st.size; best = s; } return [best, n]; };
for (const size of SIZES) for (const [id, st] of [...R[size].TODAY.codaPlaces].sort((a, b) => b[1].size - a[1].size)) {
  if (st.size / R[size].N <= 0.5) continue;
  const [, t0] = codaTop(size, 'TODAY', id); const [s1, t1] = codaTop(size, 'RULED', id); const [, t2] = codaTop(size, 'T2', id);
  console.log(`B ${size} ${id}: prints in ${st.size}/${R[size].N} ${pct(st.size, R[size].N)} · its top sentence today ${pct(t0, R[size].N)} · as ruled ${t1}/${R[size].N} ${pct(t1, R[size].N)}${t1 / R[size].N > 0.2 ? ' ABOVE 20%' : ''} · with T2 ${pct(t2, R[size].N)} | ${short(s1, 110)}`);
}

// ════ C. the heaviest codas as ruled (max over sizes of the top sentence any coda branch prints) ════
console.log('\n=== C. CODAS BY THEIR HEAVIEST SENTENCE AS RULED (max over sizes) ===');
const heavy = CODAS.map((c) => {
  let best = 0; let at = null; let text = null;
  for (const size of SIZES) { const [s, n] = codaTop(size, 'RULED', c.id); if (n / R[size].N > best) { best = n / R[size].N; at = size; text = s; } }
  return { id: c.id, best, at, text, pooled: !!CODA_POOLS.find((x) => x.id === c.id), crime: !!c.crime };
}).sort((a, b) => b.best - a.best);
for (const h of heavy.slice(0, 14)) console.log(`C ${h.id}${h.crime ? ' (crime)' : ''}${h.pooled ? ' (pooled in tranche 1)' : ''}: ${Math.round(100 * h.best)}% at ${h.at} | ${short(h.text, 120)}`);

// ════ D. each second-tranche pool: where it prints and the commonest sentence it leaves ════
console.log('\n=== D. THE SECOND TRANCHE, POOL BY POOL (its commonest sentence, by size where the line prints) ===');
for (const key of Object.keys(DESC_POOLS_2)) for (const size of SIZES) {
  const placesWith = R[size].T2.poolPlaces.get(key)?.size || 0;
  if (!placesWith) continue;
  let n = 0; let best = null; for (const [s, st] of R[size].T2.open) if (R[size].T2.openKey.get(s) === key && st.size > n) { n = st.size; best = s; }
  let r = 0; for (const [s, st] of R[size].RULED.open) if (s === sentencesOf(key)[0] && st.size > r) r = st.size;
  console.log(`D opening ${size} "${short(key, 60)}": opens in ${placesWith}/${R[size].N} · as ruled its first sentence ${pct(r, R[size].N)} · with T2 top ${n}/${R[size].N} ${pct(n, R[size].N)} | ${short(best, 100)}`);
}
for (const id of Object.keys(CODA_POOLS_2)) for (const size of SIZES) {
  const pl = R[size].T2.codaPlaces.get(id)?.size || 0;
  if (!pl) continue;
  const [, t1] = codaTop(size, 'RULED', id); const [s2, t2] = codaTop(size, 'T2', id);
  console.log(`D coda ${size} ${id}: prints in ${pl}/${R[size].N} · as ruled top ${pct(t1, R[size].N)} · with T2 top ${t2}/${R[size].N} ${pct(t2, R[size].N)} | ${short(s2, 100)}`);
}

console.log('\nSUMMARY (the top sentence, places / all places of the size; openings · codas · relations)');
for (const stage of STAGES) for (const size of SIZES) {
  const f = (part) => { const [, n] = topOf(R[size][stage][part]); return `${n}/${R[size].N} ${pct(n, R[size].N)}`; };
  console.log(`SUMMARY ${stage} ${size}: openings ${f('open')} · codas ${f('coda')} · relations ${f('rel')}`);
}
console.log('\nAPPROXIMATIONS: as M4 (its notes 1-4: facts on the FINAL record; atoms by m6-common.mjs :: atomHolds over cached facts; a relation\'s branch read off its sentence shape; ~3 places a size is noise, here 150 a size, ~2%). M6 adds: (5) a description is cut by the codas\' own words (m6-common.mjs :: CODAS); text a stress event joins to an opening stays with the opening. (6) A sentence is split at . ! ? followed by a space or the end. (7) A coda variant is keyed <seed>::powerStructure.factions.desc::<power>::<coda id>, as M4 keyed it; an opening <seed>::powerStructure.factions.desc::<power>.');
