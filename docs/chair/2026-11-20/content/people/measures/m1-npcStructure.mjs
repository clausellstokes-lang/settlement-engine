// PEOPLE-1 seat M1 (2026-11-20): `npcs[].activeConstraint` and `npcs[].structuralPosition` (src/generators/npcStructure.js),
// today and projected, on the births m1-births.mjs cached (n per size, the chair's instrument's seeds and mask).
//
// TODAY: every card carrying a field is classified to the branch that wrote it, read off the writer's own table — the `T`
// registry and LOW_STANDING_TWIN are SLICED FROM THE SOURCE FILE ITSELF and evaluated here (never retyped), so a row's
// identity is the writer's. "Share" (MEASURE-COMMON): the places of a size printing the masked sentence at the field, over
// the places of that size holding the field at all.
//
// THE PROJECTION: the proposal's pools (m1-pools.mjs) are applied HERE, not in src/: for each card on a branch the proposal
// gives a pool, the wordings whose NEEDS hold on the place's facts (read through factsOf on the FINAL record by
// m1-births.mjs) are listed in pool order (index 0 = today's exact line, needs nothing), and `pickVariant` (src/kernel/
// proseHash.js, the real function) picks one, keyed `<record seed>::npcStructure.<field>::<card id>`; the slots are filled
// from the place's own record. Approximations are printed with the counts.
//
// Usage: node m1-npcStructure.mjs <checkout> <cache.json>   (prints count lines only)
import { readFileSync } from 'node:fs';

const [, , L, cachePath] = process.argv;
if (!L || !cachePath) throw new Error('usage: node m1-npcStructure.mjs <checkout> <cache.json>');
const { pickVariant } = await import(`${L}/src/kernel/proseHash.js`);
const { houseFill, resourceFill } = await import(`${L}/src/generators/people/goals.js`);
const pools = await import('./m1-pools.mjs');

// ── the writer's table, sliced from the file ─────────────────────────────────────────────────────────────────────────────
const src = readFileSync(`${L}/src/generators/npcStructure.js`, 'utf8');
const cut = (from, to) => { const a = src.indexOf(from); const b = src.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`slice ${from}`); return src.slice(a, b); };
const moduleText = [
  cut('const GOVERNANCE_FRACTURED', 'function getPrimaryCondition'),
  cut('const T = {};', '// ── Score NPCs'),
  cut('const LOW_STANDING_TWIN', '/** The card\'s position as its standing bears it.'),
  cut('const HOLDS_THE_SEAT', '/** The seat rows\' opening'),
  'export { T, LOW_STANDING_TWIN, HOLDS_THE_SEAT };',
].join('\n');
const W = await import(`data:text/javascript;base64,${Buffer.from(moduleText).toString('base64')}`);
const { T, LOW_STANDING_TWIN, HOLDS_THE_SEAT } = W;
const TWIN_BACK = Object.fromEntries(Object.entries(LOW_STANDING_TWIN).map(([a, b]) => [b, a]));

const cache = JSON.parse(readFileSync(cachePath, 'utf8'));
const SIZES = Object.keys(cache.sizes);
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const maskerOf = (names) => { const list = [...names].sort((a, b) => b.length - a.length); const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null; return (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0'); };
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '-');

// ── classification: which branch wrote the card ──────────────────────────────────────────────────────────────────────────
const HOUSE_TAIL = / (Still .+ as well\.)$/;
function classify(card) {
  const pos = card.pos;
  if (pos == null) return { branch: 'no-position', key: null };
  const holder = /^Holds the seat\b/.test(pos);
  if (pos === HOLDS_THE_SEAT || pos.startsWith(`${HOLDS_THE_SEAT} Still `)) return { branch: pos === HOLDS_THE_SEAT ? 'HOLDS_THE_SEAT' : 'HOLDS_THE_SEAT+house', key: 'HOLDS_THE_SEAT', holder: true, houseTail: pos === HOLDS_THE_SEAT ? '' : pos.slice(HOLDS_THE_SEAT.length + 1) };
  let base = pos; let houseTail = ''; let twin = false;
  if (holder) { const m = pos.match(HOUSE_TAIL); if (m) { houseTail = m[1]; base = pos.slice(0, -m[0].length); } }
  if (TWIN_BACK[base]) { base = TWIN_BACK[base]; twin = true; }
  const cat = holder ? 'government' : card.category || 'other';
  const cond = card.cond || 'stable';
  const tries = [`${cat}__${cond}__dominant`, `${cat}__${cond}__subordinate`, `${cat}__stable__dominant`, `${cat}__stable__subordinate`, 'other__stable__dominant'];
  let key = tries.find((k) => T[k] && T[k].position === base);
  if (!key) key = Object.keys(T).find((k) => T[k].position === base) || 'UNRESOLVED';
  const branch = holder ? (houseTail ? 'holder-row+house' : 'holder-row') : twin ? 'row(low-standing twin)' : 'row';
  return { branch, key, holder, houseTail, twin, conOk: key !== 'UNRESOLVED' && card.con === T[key].constraint };
}

// ── the counter ──────────────────────────────────────────────────────────────────────────────────────────────────────────
function measure(rowsByPlace) {
  // rowsByPlace: Array<{ place, sentences: string[] (masked) }> ; returns { H, top, topN, distinct, ranked }
  const by = new Map(); let H = 0;
  for (const { sentences } of rowsByPlace) {
    if (!sentences.length) continue; H++;
    for (const s of new Set(sentences)) by.set(s, (by.get(s) || 0) + 1);
  }
  const ranked = [...by.entries()].sort((a, b) => b[1] - a[1]);
  return { H, top: ranked[0]?.[0] ?? null, topN: ranked[0]?.[1] ?? 0, distinct: by.size, ranked };
}

// ── projection ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const fill = (text, ctx) => { const s = text.replace(/\{(house|export|import)\}/g, (_, k) => ctx[k] || ''); return s.charAt(0).toUpperCase() + s.slice(1); };
const eligibleOf = (pool, ctx, vocabOnly) => pool.slice(1).filter((x) => (!vocabOnly || !x.needs.some((a) => a.startsWith('ATOM?')))
  && x.needs.every((a) => pools.atomHolds(a, ctx)) && !(x.excludes || []).some((a) => pools.atomHolds(a, ctx))).map((x) => fill(x.text, ctx));
function project(field, place, card, cls, mode) {
  const today = field === 'con' ? card.con : card.pos;
  if (field === 'con' && mode === 'A-holder' && cls.key === 'government__stable__dominant') return null;
  if (field === 'con' && mode === 'A-calm' && cls.key && /__stable__/.test(cls.key)) return null;
  if (mode !== 'B' && mode !== 'B-vocab') return today;
  if (!cls.key || cls.key === 'UNRESOLVED' || cls.key === 'HOLDS_THE_SEAT') return today;
  const pool = (field === 'con' ? pools.CONSTRAINT_POOLS : pools.POSITION_POOLS)[pools.poolKeyOf(cls.key)];
  if (!pool) return today;
  if (pool[0].text !== '@today') throw new Error(`pool ${cls.key}: index 0 is not today's line`);
  const ctx = pools.contextOf(place, card, { houseFill, resourceFill });
  const canonical = field === 'con' ? T[cls.key]?.constraint : T[cls.key]?.position;
  const list = [canonical, ...eligibleOf(pool, ctx, mode === 'B-vocab')];
  const chosen = pickVariant(list, `${place.recordSeed}::npcStructure.${field === 'con' ? 'activeConstraint' : 'structuralPosition'}::${card.id}`);
  if (field === 'con') return chosen;
  // the position's two tails, as the writer adds them: the dual-hat holder's house, second; the low-standing twin of index 0
  let out = chosen;
  if (chosen === canonical && cls.twin) out = LOW_STANDING_TWIN[canonical] || canonical;
  if (cls.houseTail) out = `${out} ${cls.houseTail}`;
  return out;
}

// ── run ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const lines = [];
const say = (s) => lines.push(s);
say(`# M1 measure · base ${cache.base ?? '?'} · n ${cache.n} a size · seeds hxd-<size>-<i> · masked as the chair's instrument masks`);
const FIELDS = [['con', 'activeConstraint'], ['pos', 'structuralPosition']];
const MODES = { con: ['today', 'A-holder', 'A-calm', 'B', 'B-vocab'], pos: ['today', 'B', 'B-vocab'] };
const summary = {};
let unresolved = 0, conMismatch = 0;
for (const size of SIZES) {
  const places = cache.sizes[size];
  say(`\n## ${size} (${places.length} places)`);
  // branch table
  for (const [f, label] of FIELDS) {
    const br = new Map();
    for (const p of places) {
      const seen = new Set();
      for (const c of p.cards) {
        if (c[f] == null) continue;
        const cls = classify(c);
        if (cls.key === 'UNRESOLVED') unresolved++;
        if (f === 'con' && cls.conOk === false) conMismatch++;
        const k = `${cls.key} · ${cls.branch}`;
        const o = br.get(k) || { places: 0, entries: 0 }; o.entries++; if (!seen.has(k)) { o.places++; seen.add(k); } br.set(k, o);
      }
    }
    say(`### ${label} · branches (places · entries)`);
    for (const [k, o] of [...br.entries()].sort((a, b) => b[1].places - a[1].places)) say(`branch ${size} ${label} | ${k} | ${o.places} | ${o.entries}`);
  }
  // shares
  for (const [f, label] of FIELDS) {
    for (const mode of MODES[f]) {
      const rows = places.map((p) => {
        const mask = maskerOf(p.names);
        const sentences = [];
        for (const c of p.cards) {
          if (c[f] == null) continue;
          const v = project(f, p, c, classify(c), mode);
          if (v != null) sentences.push(mask(v));
        }
        return { place: p, sentences };
      });
      const m = measure(rows);
      (summary[`${label} ${mode}`] ||= {})[size] = `${m.topN}/${m.H} ${pct(m.topN, m.H)}`;
      say(`share ${size} ${label} ${mode} | top ${m.topN} of ${m.H} places (${pct(m.topN, m.H)}) · distinct ${m.distinct} | ${m.top}`);
      for (const [s, k] of m.ranked.slice(1, mode === 'today' || mode === 'B' ? 5 : 2)) say(`  next ${size} ${label} ${mode} | ${k} of ${m.H} (${pct(k, m.H)}) | ${s}`);
    }
  }
}
say('\n## SUMMARY · top share by size (places printing the commonest masked sentence / places holding the field)');
say(`row | ${SIZES.join(' | ')}`);
for (const [k, v] of Object.entries(summary)) say(`${k} | ${SIZES.map((s) => v[s]).join(' | ')}`);
say(`\nchecks: unresolved positions ${unresolved} · constraint not its row's ${conMismatch}`);
// THE WORDINGS' OWN GUARDS (the readers that match words: tests/generators/npcStructureSeatPlain.test.js MACHINERY and
// DEFENCE_WORDS; tests/components/seatHolderOnThePage.test.jsx SUBORDINATE on the holder's lines; tests/generators/people/
// seatHolderCard.test.js HOLDS on the holder's position; tests/generators/people/lordNotGovernment.test.js /\boffice\b/ on
// the old families' rows; tests/generators/npcStructureBody.test.js UNDER on the heads' rows), each run over every new line
const MACHINERY = /legitimacy|institutional|governance|governing|structur|faction|civic|rather than|Formal title|contingent|consolidat|accountab|capacity|settlement/i;
const DEFENCE_WORDS = /\bsoldiers?\b|\bgarrison|\b(?:walls|walled)\b|\bhospitals?\b|Guard Captain/i;
const SUBORDINATE = new RegExp(['Heads an old family while the seat', 'Serves the faith under its leaders', 'Belongs to a lesser', 'Runs a smaller house', 'Leads a squad', 'Works spells under', 'Holds an office', 'Holds a place', 'under (its|the|a) (leaders|senior casters|seat|crew)', 'behind the leading', 'a lesser (old )?family', 'smaller house', 'takes orders from', 'only as strong as the seat', "without the seniors'? leave", 'has little say', 'decides? what it (may|can) do', 'offices that run things', 'truly runs? the seat', 'say (slowly )?shrinks'].join('|'));
const UNDER = /under its leaders|under the senior casters|under the crew's boss|in a crew|Works spells|Serves the faith|Holds a place/;
const guard = [];
for (const [field, P] of [['activeConstraint', pools.CONSTRAINT_POOLS], ['structuralPosition', pools.POSITION_POOLS]]) {
  for (const [key, pool] of Object.entries(P)) {
    if (!T[key]) guard.push(`${field} ${key}: no such row in T`);
    for (const x of pool.slice(1)) {
      const t = x.text;
      if (MACHINERY.test(t)) guard.push(`${field} ${key}: machinery word: ${t}`);
      if (DEFENCE_WORDS.test(t) && !x.needs.some((a) => /walls|garrison/.test(a))) guard.push(`${field} ${key}: defence word without its atom: ${t}`);
      if (/^government__.*__dominant$/.test(key) && SUBORDINATE.test(t)) guard.push(`${field} ${key}: subordinates the holder: ${t}`);
      if (field === 'structuralPosition' && /^government__.*__dominant$/.test(key) && !/^Holds the seat\b/.test(t)) guard.push(`${field} ${key}: holder position not "Holds the seat": ${t}`);
      if (field === 'structuralPosition' && !/^government__.*__dominant$/.test(key) && /^Holds the seat\b/.test(t)) guard.push(`${field} ${key}: a non-holder row says "Holds the seat": ${t}`);
      if (/^other__/.test(key) && /\boffice\b/i.test(t)) guard.push(`${field} ${key}: an old family's row says office: ${t}`);
      if (/__dominant$/.test(key) && UNDER.test(t)) guard.push(`${field} ${key}: a head's row places it under: ${t}`);
      if (/^other__/.test(key) && /quiet|calm|good years|steady season/i.test(t)) guard.push(`${field} ${key}: the other rows serve crisis keys and claim no calm: ${t}`);
      if (t.split(/\s+/).length > 30) guard.push(`${field} ${key}: over thirty words: ${t}`);
    }
  }
}
say(`guards over the proposed wordings: ${guard.length} miss(es)`);
for (const g of guard) say(`  GUARD ${g}`);
const count = (P) => Object.values(P).reduce((a, p) => a + p.length - 1, 0);
say(`proposed wordings: activeConstraint ${count(pools.CONSTRAINT_POOLS)} in ${Object.keys(pools.CONSTRAINT_POOLS).length} pools · structuralPosition ${count(pools.POSITION_POOLS)} in ${Object.keys(pools.POSITION_POOLS).length} pools (index 0, today's line, not counted)`);
say('APPROXIMATIONS: (1) the facts are read on the FINAL record (factsOf at the end of the birth), where the writer reads factsOf on the record at the structural pass; a fact a later step changes would differ. (2) The pick is keyed on the record seed and the card id; the writer would read the same two (settlement._seed, npc.id) at enrichNPCsWithStructure. (3) A card whose row the projection changes keeps its goal, rank and condition: only the field\'s text is re-derived. (4) The atoms are read by m1-pools.mjs :: atomHolds over the cached facts, a stand-in for factVocabulary.js\'s readers (the same homes: rulingBody, guild, market, defence, paidWatch, courtSits, rivalPower, seatOutranked, faith.hasChurch, populationBand, prosperity). (5) B-vocab drops the wordings that need an atom the vocabulary lacks (own house, export good, import good).');
console.log(lines.join('\n'));
