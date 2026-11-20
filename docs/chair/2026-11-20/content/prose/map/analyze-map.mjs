/**
 * analyze-map.mjs — MAP-1's reader of draws.hxd.jsonl. Writes ALL-POOLS.md and OFFLIST-MAP.md beside itself.
 * usage: node analyze-map.mjs <OFF-LIST.md path>   (OFF-LIST from `git show origin/lane/same-1-2026-11-20:docs/chair/2026-11-20/content/same/census/OFF-LIST.md`)
 *
 * Per (size, blockId, poolKey) and per PLACE: the place's eligible count is the MAX over its (deduplicated) draws of that
 * pool (a place can draw one pool more than once); the place's chosen vids are all the vids it drew there. Places with an
 * eligible count of 0 drew the pool silently (no variant). Top vid share = places that drew the top vid / places that
 * drew any vid. Cause: ONE-VARIANT (pool length 1) · EXCLUDED (median eligible 1 < pool length) · UNKEYED (median
 * eligible >= 2 and top share > max(0.5, 2/median)) · SILENT (median eligible 0) · SPREAD (none of these).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = readFileSync(join(HERE, 'draws.hxd.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));

const median = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : 0; };
const pct = (x) => `${Math.round(x * 100)}%`;
const slotsOf = (t) => (String(t || '').match(/\{([^}]+)\}/g) || []).map((s) => s.slice(1, -1));
const esc = (s) => String(s).replace(/\|/g, '\\|');

// ── per (size, pool) → per place ──
/** @type {Map<string, any>} */
const pools = new Map();
for (const r of rows) {
  const k = `${r.size}\u0000${r.blockId}\u0000${r.poolKey}`;
  let p = pools.get(k);
  if (!p) { p = { size: r.size, blockId: r.blockId, poolKey: r.poolKey, leaf: r.leaf, poolLength: r.poolLength, places: new Map(), texts: new Map(), excl: new Map() }; pools.set(k, p); }
  let pl = p.places.get(r.seed);
  if (!pl) { pl = { elig: 0, vids: new Set() }; p.places.set(r.seed, pl); }
  pl.elig = Math.max(pl.elig, r.eligibleVids.length);
  if (r.chosenVid !== null) { pl.vids.add(r.chosenVid); p.texts.set(r.chosenVid, r.chosenText); }
  if (r.eligibleVids.length === 1) {
    const kept = slotsOf(r.chosenText);
    for (const x of r.excluded) {
      const why = [];
      const extra = x.slots.filter((s) => !kept.includes(s));
      if (extra.length) why.push(`name {${extra.join('},{')}}`);
      if (x.dmOnly) why.push('dm-only');
      if (x.dimMarks.length) why.push(`dim[${x.dimMarks.join(';')}]`);
      if (x.factMarks.length) why.push(`fact[${x.factMarks.join(';')}]`);
      const sig = why.join(' + ') || 'no static difference (a slot fill or a fact read)';
      const e = p.excl.get(x.vid) || new Map(); e.set(sig, (e.get(sig) || 0) + 1); p.excl.set(x.vid, e);
    }
  }
}

function stats(p) {
  const places = [...p.places.values()];
  const eligs = places.map((x) => x.elig);
  const drew = places.filter((x) => x.vids.size > 0);
  const vidCount = new Map();
  for (const x of drew) for (const v of x.vids) vidCount.set(v, (vidCount.get(v) || 0) + 1);
  let topVid = null; let topN = 0;
  for (const [v, n] of vidCount) if (n > topN || (n === topN && v < topVid)) { topVid = v; topN = n; }
  const med = median(eligs);
  const share = drew.length ? topN / drew.length : 0;
  const one = eligs.filter((e) => e === 1).length;
  let cause = 'SPREAD';
  if (p.poolLength === 1) cause = 'ONE-VARIANT';
  else if (med === 0) cause = 'SILENT';
  else if (med === 1) cause = 'EXCLUDED';
  else if (med >= 2 && share > Math.max(0.5, 2 / med)) cause = 'UNKEYED';
  return { n: places.length, drewN: drew.length, min: Math.min(...eligs), med, max: Math.max(...eligs), one, oneShare: one / places.length, topVid, topN, share, cause };
}

/** The excluded variants' signature, grouped: "vids 1,2 name {band}; vid 3 dm-only". */
function exclSig(p) {
  const bySig = new Map();
  for (const [vid, m] of p.excl) {
    const sig = [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
    bySig.set(sig, [...(bySig.get(sig) || []), vid]);
  }
  return [...bySig.entries()].map(([sig, vids]) => `vid${vids.length > 1 ? 's' : ''} ${vids.sort((a, b) => a - b).join(',')} ${sig}`).join('; ');
}

const causeText = (p, s) => (s.cause === 'EXCLUDED' ? `EXCLUDED: ${exclSig(p) || '—'}` : s.cause);

// ── ALL-POOLS.md ──
const byPool = new Map();
for (const p of pools.values()) {
  const k = `${p.blockId}\u0000${p.poolKey}`;
  byPool.set(k, [...(byPool.get(k) || []), p]);
}
const all = [];
for (const [k, list] of byPool) {
  list.sort((a, b) => SIZES.indexOf(a.size) - SIZES.indexOf(b.size));
  const st = list.map((p) => ({ p, s: stats(p) }));
  all.push({ k, blockId: list[0].blockId, poolKey: list[0].poolKey, leaf: list[0].leaf, poolLength: list[0].poolLength, st,
    oneTotal: st.reduce((a, x) => a + x.s.one, 0), placesTotal: st.reduce((a, x) => a + x.s.n, 0),
    hasOneMajority: st.some((x) => x.s.oneShare > 0.5), unkeyed: st.filter((x) => x.s.cause === 'UNKEYED' && x.s.n >= 10) });
}
all.sort((a, b) => (a.blockId < b.blockId ? -1 : a.blockId > b.blockId ? 1 : a.poolKey < b.poolKey ? -1 : 1));
const ranked = all.filter((a) => a.hasOneMajority).sort((a, b) => b.oneTotal - a.oneTotal || b.placesTotal - a.placesTotal);
const unkeyed = all.filter((a) => a.unkeyed.length > 0).sort((a, b) => Math.max(...b.unkeyed.map((x) => x.s.n)) - Math.max(...a.unkeyed.map((x) => x.s.n)));
const placesAffected = new Set();
for (const a of ranked) for (const { p } of a.st) for (const [seed, x] of p.places) if (x.elig === 1) placesAffected.add(seed);
const totals = `TOTALS: pools drawn ${all.length} (block × poolKey, over 300 places); pools with a one-eligible size (majority of drawing places at some size have exactly one eligible) ${ranked.length}; places affected (drew at least one such pool with one eligible) ${placesAffected.size} of 300; UNKEYED candidates (>= 10 places at a size) ${unkeyed.length}.`;

const line = (x) => `${x.p.size} ${x.s.n}p elig ${x.s.min}/${x.s.med}/${x.s.max} one ${pct(x.s.oneShare)} top v${x.s.topVid} ${pct(x.s.share)} ${causeText(x.p, x.s)}`;
const A = [];
A.push('# ALL-POOLS — every state-prose pool drawn in the 300 hxd places (MAP-1, 2026-11-20)', '');
A.push('Source: `draws.hxd.jsonl` (instrumented `drawVariant`, recording only inside `composePublicProse`, six generated leaves only). Written by `analyze-map.mjs`.', '');
A.push('Per place: eligible = the MAX eligible count over its draws of the pool; `one` = share of drawing places with exactly one eligible; `top` = share of places that drew any variant whose draws include the top vid. Cause: ONE-VARIANT (pool length 1) · EXCLUDED (median eligible 1 < pool length; the signature is what the excluded variants carry STATICALLY that the drawn one does not — slots it names, `dm-only`, dimension marks, fact marks; slot FILLS and fact VALUES are not visible at the draw, so "no static difference" means the exclusion came from a fill or a fact read) · UNKEYED (median eligible ≥ 2 and top share > max(0.5, 2/median)) · SILENT (median eligible 0: drawn, nothing printed) · SPREAD.', '');
A.push(totals, '');
A.push(`## THE RANKED LIST — pools where, at some size, the majority of drawing places have ONE eligible variant (${ranked.length}), by places (of 300) drawing it with one eligible`, '');
A.push('| # | places one-eligible | blockId | poolKey | pool len | per size (places · eligible min/med/max · one-share · top vid share · cause) |', '|---|---|---|---|---|---|');
ranked.forEach((a, i) => A.push(`| ${i + 1} | ${a.oneTotal}/${a.placesTotal} | ${a.blockId} | ${esc(a.poolKey)} | ${a.poolLength} | ${a.st.map((x) => esc(line(x))).join('<br>')} |`));
A.push('', `## UNKEYED candidates (≥ 10 places at a size; ${unkeyed.length})`, '');
A.push('| # | blockId | poolKey | pool len | the UNKEYED sizes (places · eligible min/med/max · top vid share) |', '|---|---|---|---|---|');
unkeyed.forEach((a, i) => A.push(`| ${i + 1} | ${a.blockId} | ${esc(a.poolKey)} | ${a.poolLength} | ${a.unkeyed.map((x) => `${x.p.size} ${x.s.n}p elig ${x.s.min}/${x.s.med}/${x.s.max} top v${x.s.topVid} ${pct(x.s.share)}`).join('<br>')} |`));
A.push('', `## EVERY POOL (${all.length}), by blockId`, '');
A.push('| blockId | poolKey | leaf | pool len | per size |', '|---|---|---|---|---|');
for (const a of all) A.push(`| ${a.blockId} | ${esc(a.poolKey)} | ${a.leaf} | ${a.poolLength} | ${a.st.map((x) => esc(line(x))).join('<br>')} |`);
A.push('', totals, '');
writeFileSync(join(HERE, 'ALL-POOLS.md'), `${A.join('\n')}\n`);

// ── OFFLIST-MAP.md ──
const offPath = process.argv[2];
const off = readFileSync(offPath, 'utf8').split('\n');
let size = null; const offRows = [];
for (const l of off) {
  const h = l.match(/^## (\w+)/); if (h) { size = h[1]; continue; }
  if (!l.startsWith('| ') || !l.includes('publicProse.blocks.')) continue;
  const cells = l.split(' | ').map((c) => c.replace(/^\| ?| ?\|$/g, '').trim());
  offRows.push({ size, num: cells[0], hxd: cells[1], cls: cells[3], source: cells[4], sentence: cells[cells.length - 1] });
}

/** Does `row` (masked, maybe truncated with …) match `template` (`{slot}` → anything, `town` ↔ the size noun)? */
function matches(template, row, sizeNoun) {
  // SAME-1 split printed lines into SENTENCES: the row may be any sentence of a multi-sentence template, so the
  // template is tried from its start and from after each sentence end in its literal text, and the row is read
  // as a PREFIX of what follows (a full sentence ends at a sentence end; a truncated one anywhere).
  const t = String(template);
  const starts = [0];
  for (const m of t.matchAll(/[.?!:;] +/g)) if (!/\{[^}]*$/.test(t.slice(0, m.index))) starts.push(m.index + m[0].length);
  let best = -1;
  for (const at of starts) { const sc = matchesFrom(t.slice(at), row, sizeNoun); if (sc > best) best = sc + (at === 0 ? 0.5 : 0); }
  return best;
}
/** The literal characters matched (>= 0), or -1. A slot never swallows the row's end; a full (untruncated) row must end
 * where the template ends or at a sentence end of a literal. */
function matchesFrom(template, row, sizeNoun) {
  const truncated = row.endsWith('…');
  const target = truncated ? row.slice(0, -1) : row;
  const toks = String(template).split(/(\{[^}]+\})/).filter((t) => t !== '');
  const lit = (t) => t.replace(/\btown\b/g, sizeNoun).replace(/\bTown\b/g, sizeNoun[0].toUpperCase() + sizeNoun.slice(1));
  const memo = new Map();
  const go = (ti, ri) => {
    const key = `${ti},${ri}`; if (memo.has(key)) return memo.get(key);
    let sc = -1;
    if (ri >= target.length) sc = (truncated || ti >= toks.length) ? 0 : -1;
    else if (ti >= toks.length) sc = -1;
    else if (toks[ti].startsWith('{')) {
      const last = ti + 1 >= toks.length;
      for (let j = ri + 1; j <= target.length; j += 1) { if (j === target.length && !last) break; const r = go(ti + 1, j); if (r > sc) sc = r; }
    } else {
      const L = lit(toks[ti]); const rest = target.slice(ri);
      let m = null;
      if (rest.startsWith(L)) m = L;
      else if (/[#\d]/.test(rest)) { const re = new RegExp(`^${L.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\d+/g, '#')}`); const x = rest.match(re); if (x) m = x[0]; }
      if (m !== null) { const r = go(ti + 1, ri + m.length); if (r >= 0) sc = r + m.length; }
      else if (L.startsWith(rest) && (truncated || /[.?!]$/.test(rest) && /^\s/.test(L.slice(rest.length)))) sc = rest.length;
    }
    memo.set(key, sc); return sc;
  };
  return go(0, 0);
}

const O = [];
O.push('# OFFLIST-MAP — SAME-1\'s STATE rows of OFF-LIST.md resolved to their pools (MAP-1, 2026-11-20)', '');
O.push('Source: `origin/lane/same-1-2026-11-20:docs/chair/2026-11-20/content/same/census/OFF-LIST.md` (every row whose source is `publicProse.blocks.*`) against `draws.hxd.jsonl`. Each top sentence is matched to the drawn templates of that size (`{slot}` matches anything, `town` ↔ the size noun, `…` = prefix match). Columns and causes as in ALL-POOLS.md; eligible is per place (max over its draws of the pool). The EXCLUDED signature is STATIC (what the excluded variants carry that the drawn one does not); slot fills and fact values are not visible at the draw.', '');
O.push('| size | OFF # | hxd top (SAME-1) | blockId | poolKey | vid | pool len | places drawing | eligible min/med/max | top vid share | cause |', '|---|---|---|---|---|---|---|---|---|---|---|');
const causeCount = {};
for (const r of offRows) {
  const cand = new Map();
  for (const p of pools.values()) {
    if (p.size !== r.size) continue;
    for (const [vid, text] of p.texts) { const score = matches(text, r.sentence, r.size); if (score >= 8) cand.set(`${p.blockId}\u0000${p.poolKey}\u0000${vid}`, { p, vid, text, score }); }
  }
  if (cand.size === 0) {
    const why = !/publicProse\.blocks\.(defense|economy|general|power|stressors|warFaith)/.test(r.source) ? 'source is not a block of the six state-prose leaves' : 'no drawn template of this size matches the sentence (an engine string or a non-pool line in that block)';
    O.push(`| ${r.size} | ${r.num} | ${esc(r.hxd)} | UNRESOLVED | — | — | — | — | — | — | UNRESOLVED: ${why}. Sentence: ${esc(r.sentence)} |`);
    causeCount.UNRESOLVED = (causeCount.UNRESOLVED || 0) + 1;
    continue;
  }
  // prefer the candidate with the most literal characters MATCHED (a whole-template match beats a later sentence), then the most-drawn pool
  const list = [...cand.values()].sort((a, b) => b.score - a.score || stats(b.p).n - stats(a.p).n);
  const best = list[0]; const s = stats(best.p);
  const others = list.slice(1).filter((c) => c.p !== best.p).map((c) => `${c.p.blockId}/${c.p.poolKey}/v${c.vid}`);
  const amb = others.length ? ` (also matches: ${esc(others.slice(0, 3).join(', '))}${others.length > 3 ? '…' : ''})` : '';
  const topNote = s.topVid === best.vid ? '' : ` (top is v${s.topVid}; row's v${best.vid} drawn by ${[...best.p.places.values()].filter((x) => x.vids.has(best.vid)).length})`;
  O.push(`| ${r.size} | ${r.num} | ${esc(r.hxd)} | ${best.p.blockId} | ${esc(best.p.poolKey)} | ${best.vid} | ${best.p.poolLength} | ${s.n} | ${s.min}/${s.med}/${s.max} | ${pct(s.share)}${topNote} | ${esc(causeText(best.p, s))}${amb} |`);
  causeCount[s.cause] = (causeCount[s.cause] || 0) + 1;
}
O.push('', `ROWS: ${offRows.length} STATE rows · ${Object.entries(causeCount).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '');
writeFileSync(join(HERE, 'OFFLIST-MAP.md'), `${O.join('\n')}\n`);
console.log(totals);
console.log(`OFFLIST: ${offRows.length} rows ${JSON.stringify(causeCount)}`);
