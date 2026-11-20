// PEOPLE-1 seat M2, §7: THE MINIMAL ATOM SET. The §7 wordings (m2-quarters-pools-atoms.mjs) projected on the same births
// (m2-quarters-births.mjs, whose `atoms` are the vocabulary's own answers, `factVocabulary.js :: atomHolds`), first with NO new
// key granted, then granting the candidate keys one at a time, greedily (each step the key that most lowers the sum of the
// top shares the bar reads), so the chair can stop at any step and know what holds.
//   (a) none of §2's false presumptions survives: today's line, wherever it still prints, is checked against §2's checks;
//   (b) every quarter type with n >= 30 a size projects at or under 15%, and every size at or under 15%;
//   (c) a wording or a slot item needing an ungranted key leaves its pool.
// Usage: node m2-quarters-atoms.mjs <worktree> <births.json>
import { readFileSync } from 'node:fs';

const [, , L, BIRTHS] = process.argv;
const { pickVariant, fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
const { housesOf, series } = await import('./m2-quarters-pools.mjs');
const { POOLS, ITEMS, KEY_TESTS } = await import('./m2-quarters-pools-atoms.mjs');
const { places } = JSON.parse(readFileSync(BIRTHS, 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const BAR = 0.15;

const H = places.map((p) => ({ p, h: housesOf(p) }));
const holds = (p, w) => p.atoms[w] === true;

function project(p, h, q, granted) {
  const pool = POOLS[q.name];
  const branch = pool.branchOf(h, q);
  const keyOk = (ks = []) => ks.every((k) => granted.has(k) && KEY_TESTS[k](h));
  const items = (t) => ITEMS[t].filter((it) => (it.atoms || []).every((a) => holds(p, a)) && keyOk(it.keys)).map((it) => it.word(h));
  const eligible = pool[branch].filter((w) => w.atoms.every((a) => holds(p, a)) && !(w.not || []).some((a) => holds(p, a))
    && keyOk(w.keys) && (!w.when || w.when(h)) && (!w.slot || items(w.slot.table).length >= w.slot.k));
  if (!eligible.length) return { id: 'NONE', text: null };
  const key = `${p.seed}|quarters.${q.name}.desc`;
  const w = pickVariant(eligible, key);
  const some = (t, k, tag) => {
    const list = items(t);
    const chosen = list.map((x, i) => ({ x, i, r: fnv1a32(`${key}|${tag}|${x}`) })).sort((a, b) => a.r - b.r).slice(0, k).sort((a, b) => a.i - b.i).map((o) => o.x);
    return series(chosen);
  };
  return { id: w.id, text: w.text(h, some) };
}

// §2's false-presumption checks, applied wherever today's exact line still prints
const CHECKS = {
  'Houses of worship, cloisters, quiet streets with priests and pilgrims': (h) => !h.church || !h.monastery || ['thorp', 'hamlet'].includes(h.tier),
  'Smelly, dirty area with tanneries, butchers, and dyers': (h) => !h.tanners || !h.butchers || !h.dyers,
  'Warehouses, docks, sailors, longshoremen, salt, and fish': (h) => !h.warehouses || !h.saltWorks,
  'Warehouses, wharves, barges, dockworkers, and river traffic': (h) => !h.warehouses,
  'Towers, arcane shops, strange lights and sounds at night': (h) => !h.tower || !h.enchanter,
  'Narrow alleys, hidden markets, criminal activity': (h) => !h.blackMarket || h.crime === 'none',
  'Nets, drying racks, upturned boats, and the perpetual smell of salt and fish': (h) => !h.coast,
  'The alehouse and a scrap of common ground: the social heart of the settlement': (h) => !h.alehouse,
  'Official buildings, courts, administrative offices': (h) => !h.courtSits,
  'Workshops, guild halls, apprentices learning trades': (h) => !h.guild,
  'Bustling center with merchant stalls, hawkers, and crowds': (h) => !h.market,
};

function evaluate(granted) {
  const bySize = {}; const byType = {}; let falseLeft = 0; let none = 0;
  for (const { p, h } of H) {
    if (!p.quarters.length) continue;
    const s = (bySize[p.size] ||= { holders: 0, sent: new Map() }); s.holders++;
    const seen = new Set();
    for (const q of p.quarters) {
      const r = project(p, h, q, granted);
      const text = r.text ?? q.masked;
      if (r.id === 'NONE') none++;
      if (CHECKS[text] && CHECKS[text](h)) falseLeft++;
      if (!seen.has(text)) { seen.add(text); s.sent.set(text, (s.sent.get(text) || 0) + 1); }
      const t = ((byType[q.name] ||= {})[p.size] ||= { holders: 0, sent: new Map() }); t.holders++; t.sent.set(text, (t.sent.get(text) || 0) + 1);
    }
  }
  const top = (o) => { const [txt, n] = [...o.sent].sort((a, b) => b[1] - a[1])[0]; return { n, share: n / o.holders, txt, holders: o.holders }; };
  const sizes = Object.fromEntries(SIZES.map((s) => [s, top(bySize[s])]));
  const types = [];
  for (const [type, m] of Object.entries(byType)) for (const s of SIZES) if (m[s]) types.push({ type, size: s, ...top(m[s]) });
  const read = types.filter((t) => t.holders >= 30);
  const over = [...read.filter((t) => t.share > BAR + 1e-9), ...Object.entries(sizes).filter(([, v]) => v.share > BAR + 1e-9).map(([s, v]) => ({ type: '(size)', size: s, ...v }))];
  const score = read.reduce((a, t) => a + t.share, 0) + Object.values(sizes).reduce((a, v) => a + v.share, 0);
  return { sizes, types, over, score, falseLeft, none };
}

const pct = (x) => `${Math.round(100 * x)}%`;
function report(label, granted, ev) {
  console.log(`\n## ${label}: granted {${[...granted].join(', ')}}`);
  console.log(`(a) today's line printed where §2 finds it false: ${ev.falseLeft} · no eligible wording (falls back to today's line): ${ev.none}`);
  console.log(`(b) SIZE ${SIZES.map((s) => `${s} ${pct(ev.sizes[s].share)}`).join(' · ')}`);
  console.log(`(b) TYPES n>=30 over 15%: ${ev.over.length ? ev.over.map((t) => `${t.type}|${t.size} ${t.n}/${t.holders}=${pct(t.share)}`).join('; ') : 'none'}`);
  console.log(`(b) TYPE ${ev.types.filter((t) => t.holders >= 30).map((t) => `${t.type}|${t.size} ${pct(t.share)}`).join(' · ')}`);
  console.log(`    small n (<30, the bar unreadable): ${ev.types.filter((t) => t.holders < 30).map((t) => `${t.type}|${t.size} ${t.n}/${t.holders}`).join(' · ')}`);
}

let granted = new Set();
let ev = evaluate(granted);
report('STEP 0 (no new key)', granted, ev);
for (const s of SIZES) console.log(`    commonest ${s}: "${ev.sizes[s].txt}"`);
const candidates = new Set(Object.keys(KEY_TESTS));
let step = 0;
while (candidates.size) {
  let best = null;
  for (const k of candidates) {
    const g = new Set([...granted, k]); const e = evaluate(g);
    const rank = [e.falseLeft, e.over.length, e.score];
    if (!best || rank[0] < best.rank[0] || (rank[0] === best.rank[0] && (rank[1] < best.rank[1] || (rank[1] === best.rank[1] && rank[2] < best.rank[2])))) best = { k, e, rank };
  }
  step++; candidates.delete(best.k); granted = new Set([...granted, best.k]);
  const gain = ev.score - best.e.score; ev = best.e;
  console.log(`\nSTEP ${step}: + institution: ${best.k} (sum of the top shares the bar reads falls by ${(100 * gain).toFixed(1)} points)`);
  console.log(`  (a) ${ev.falseLeft} · NONE ${ev.none} · SIZE ${SIZES.map((s) => `${s} ${pct(ev.sizes[s].share)}`).join(' ')} · over 15% at n>=30: ${ev.over.length ? ev.over.map((t) => `${t.type}|${t.size} ${pct(t.share)}`).join('; ') : 'none'}`);
}
report('ALL KEYS', granted, ev);
