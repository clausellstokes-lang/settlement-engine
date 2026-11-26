// PROOF-4 attribution (a MEASURE; changes nothing). node attr.mjs <K> [--list=N]
// Every place moved by RECORD hash and every page moved by PAGE hash, BEFORE (line tip) vs AFTER (join), attributed to a
// named unit by the unit's own words or fields. Record: each changed string (WORDS-1 twin-strings, both trees) and each moved
// field (BIRTH-1 measure-keys) classed; page: each printed line gone/arrived per view classed (WORDS-2 unit-attribute's
// rules, WORDS-1 joined-proof's classOf, the unit's own words), or traced to a changed record string of the place.
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const K = process.argv[2];
const P = '/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/proof';
const SP = '/tmp/claude-0/-home-user-settlement-engine/f9f37e55-dc9e-512d-9953-f1c7274d335f/scratchpad';
const R = `${P}/runs-${K}`;
const jl = (f) => !existsSync(f) ? new Map() : new Map(readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const M = {};
for (const m of ['d2', 'd2b', 'd3', 'd7', 'keys']) for (const t of ['before', 'join']) M[`${m}-${t}`] = jl(`${R}/${m}-${t}.jsonl`);

// ---- the units' words ----
const held = (t) => String(t).replace(/\b(?:him|her)self\b/g, 'themselves');
const D6W = /Could contend|Could contest the seat|could contest the seat/;
const D7_NAMING = ["The creditor's agent has blocked the money for repairs.", 'In public they talk of prudence;', "the creditor's representative arrived last month", 'two priests, two congregations'];
const D7_TWINS = ['Word from the creditor has blocked the money for repairs.', 'In public those in charge talk of prudence;', "the creditor's letters began last month", 'the converts keep their own register'];
const E3W = /grazing rights|water access|access to water|rights on the|field rotation|thin harvest|late frost|herd|pasture|marsh|shore/i;
const CARD = /\.(personality\.tell|presentation\.(impression|behaviour)|secret\.what|goal\.long)$/;
// E1's detector (joined-proof.mjs / e1-measure.mjs, copied)
const CONTRACTIONS = new Set(['it', 'that', 'there', 'he', 'she', 'what', 'who', 'let', 'here', 'where', 'how', 'one', 'everyone', 'nobody', 'someone', 'no one', 'anyone', 'something', 'nothing', 'everything', 'this', 'when', 'why']);
const STOP = new Set(['is', 'are', 'was', 'were', 'be', 'been', 'and', 'or', 'but', 'nor', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'the', 'a', 'an', 'as', 'than', 'that', 'which', 'who', 'whom', 'whose', 'has', 'have', 'had', 'will', 'would', 'can', 'could', 'may', 'might', 'shall', 'should', 'must', 'do', 'does', 'did', 'not', 'no', 'into', 'over', 'under', 'about', 'after', 'before', 'its', 'their', 'his', 'her', 'our', 'your', 'my', 'this', 'these', 'those', 'if', 'so', 'yet', 'while', 'once', 'says', 'keeps', 'holds', 'runs', 'takes', 'makes', 'gives', 'sets', 'puts', 'gets', 'lets']);
const WORD = String.raw`[\p{L}\p{N}][\p{L}\p{N}\-]*`;
const POSS = new RegExp(String.raw`(?<![\p{L}\p{N}])(${WORD})(?:['’]s|s['’])(?![\p{L}\p{N}])`, 'gu');
const SPLIT = /(?<=[.!?…]["”')]?)\s+(?=["“'(]?\p{Lu})/u;
function doubles(s, GAP) {
  const ps = [];
  for (const m of String(s).matchAll(POSS)) { if (CONTRACTIONS.has(m[1].toLowerCase()) && /['’]s$/.test(m[0])) continue; ps.push({ start: m.index, end: m.index + m[0].length }); }
  const out = [];
  for (let i = 0; i + 1 < ps.length; i++) {
    const between = s.slice(ps[i].end, ps[i + 1].start);
    if (!/^\s+$/.test(between) && !new RegExp(String.raw`^\s+(?:${WORD}\s+){1,${Math.max(GAP, 1)}}$`, 'u').test(between)) continue;
    const words = between.trim() ? between.trim().split(/\s+/) : [];
    if (words.length > GAP || words.some((w) => STOP.has(w.toLowerCase()))) continue;
    out.push(s.slice(ps[i].start, ps[i + 1].end));
  }
  return out;
}
const dbl = (t) => String(t ?? '').split(SPLIT).flatMap((x) => doubles(x, 3)).length;

/** A changed string's unit: by its path and words, with the place's own measure rows (fields) for the power-step lines. */
const TIE = /^(.+?) has asked (.+?) for an introduction (.+?) would rather keep to (\w+)\.$/;
const tieE8 = (a, b) => { const ta = TIE.exec(a ?? ''); const tb = TIE.exec(b ?? ''); return !!(ta && tb && ta[1] === tb[1] && ta[2] === tb[2] && ta[4] === 'themselves' && /^(?:him|her)self$/.test(tb[4])); };
const words = (t) => new Set(String(t).toLowerCase().split(/[^a-z']+/).filter(Boolean));
const jacc = (a, b) => { const x = words(a), y = words(b); let i = 0; for (const w of x) if (y.has(w)) i++; return i / Math.max(1, x.size + y.size - i); };
function stringUnit(seed, path, a, b) {
  const A = a ?? ''; const B = b ?? '';
  if (tieE8(A, B)) return 'E8';
  if (/\.presentation\.behaviour$/.test(path) && a !== undefined && b !== undefined && held(A) !== held(B)) return 'E13b';
  if (a !== undefined && b !== undefined && held(A) === held(B)) return CARD.test(path) ? 'E8b' : 'E8';
  if (a !== undefined && b !== undefined && dbl(A) > dbl(B)) return held(A) === A && held(B) === B ? 'E1' : 'E1+E8';
  if (D6W.test(B) && held(A) === held(B.replace(/Could contend/g, 'Contender').replace(/Could contest the seat/g, 'Contests the seat').replace(/could contest the seat/g, 'contests the seat'))) return 'D6';
  if (D7_NAMING.some((w) => A.includes(w)) && D7_TWINS.some((w) => B.includes(w))) return 'D7';
  return null;
}
/** A public-projection string (composePublicProse): the same display units as the page, by the block's own view. */
const PUB_VIEW = [[/economics\./, 'Systems/Economics'], [/viability\./, 'Systems/Outlook'], [/rulingStructure/, 'Systems/Power'], [/defen[cs]e/i, 'Systems/Defense']];
let PAGE_RULES = [];
function publicUnit(seed, k, a, b, pl) {
  const view = (PUB_VIEW.find(([r]) => r.test(k)) || [])[1];
  const strip = (t) => String(t ?? '').replace(/^VIABLE: /, '');
  if (view) for (const t of [a, b]) { const hit = PAGE_RULES.find(([, f]) => f(view, strip(t))); if (hit && t) return hit[0]; }
  // the Power desk's stability lens reads the stored quarrel (recentConflict): the units that moved it
  if (/stabilityLens/.test(k) && pl.length) return pl.join('+');
  return null;
}
/** The power step's lines (recentConflict, pressureSentence and their copies): by the units' own measure rows. */
function powerLineUnits(seed) {
  const u = [];
  const d2a = M['d2-before'].get(seed), d2b_ = M['d2-join'].get(seed);
  if (d2a && (d2a.prCovert || d2a.prPair || d2a.psBoth > 0) && (d2a.prHash !== d2b_?.prHash || d2a.psHash !== d2b_?.psHash)) u.push('D2');
  const s0 = M['d2b-before'].get(seed), s1 = M['d2b-join'].get(seed);
  if (s0?.shared && !s1?.shared) u.push('D2b');
  const t0 = M['d3-before'].get(seed), t1 = M['d3-join'].get(seed);
  if (t0?.stale && t0.stored !== t1?.stored) u.push(t1?.stored === t0.overSettled ? 'D3' : 'D3+G43(E3 rule)');
  const r0 = M['d7-before'].get(seed), r1 = M['d7-join'].get(seed);
  const tx = (r) => `${r?.recentConflict ?? ''}\n${r?.pressure ?? ''}`;
  if (r0 && D7_NAMING.some((w) => tx(r0).includes(w)) && D7_TWINS.some((w) => tx(r1).includes(w))) u.push('D7');
  if (r0 && (E3W.test(String(r0.recentConflict ?? '')) || E3W.test(String(r0.pressure ?? '')) || E3W.test(String(r1?.recentConflict ?? '')) || E3W.test(String(r1?.pressure ?? '')))
    && (r0.recentConflict !== r1?.recentConflict || r0.pressure !== r1?.pressure)) u.push('E3');
  return u;
}
export { stringUnit, powerLineUnits, held, dbl, E3W, D6W, tieE8, jacc };

if (process.argv[1].endsWith('attr.mjs')) {
  const LIST = Number((process.argv.find((x) => x.startsWith('--list=')) || '--list=40').slice(7));
  const B = `${SP}/before-${K}/rows`; const A = `${P}/after-${K}/rows`;
  const out = { rec: 0, page: 0, recU: {}, pageU: {}, unexplRec: [], unexplPage: [], fieldU: {}, places: {} };
  const add = (o, u, seed) => ((o[u] ||= new Set()).add(seed));
  const V10 = /^(The war takes most of the money|Big decisions wait for a new leader|Nothing gets decided, repairs|Trade suffers as carts stop|People no longer trust those in charge|Much of what is earned here goes|Trade by road, gate and water has stopped|Food will run short|Taxes are disputed|Nothing is being taken yet|The occupiers take the revenue|Fewer people come to market|No one can earn a normal living|Travel is discouraged|The tithe is split)/;
  const RULES = [ // WORDS-2 unit-attribute.mjs's rules, copied, then the other display units' own words
    ['G34', (v, l) => /^Law & order/.test(l) || /^(Unsafe|Dangerous) day to day; the law/.test(l)],
    ['G10', (v, l) => v === 'Systems/Defense' && V10.test(l)],
    ['G11', (v, l) => v === 'Systems/Defense' && /^(No stable governing authority[.;]|Enforcement is inconsistent; which power|Whoever holds sway decides)/.test(l)],
    ['G9', (v, l) => v === 'Systems/Defense' && /(has no wall, and nothing threatens it|^No wall marks where|is too small to wall and knows it)/.test(l)],
    ['E4', (v, l) => v === 'Systems/Economics' && /^(There is no market at |Whatever its \w+ brings goes on past)/.test(l)],
    ['G6', (v, l) => v === 'Systems/Economics' && /(^Little that comes past|sits on its \w+ and stays poor all the same|'s \w+ is busy, and the \w+ is poor all the same)/.test(l)],
    ['G1', (v, l) => v === 'Systems/Power' && /(must agree, and once made|business goes to the whole|left obvious decisions untaken|watches the \w+'s temper closely|^The shape of authority$)/.test(l)],
    ['E13a', (v, l) => v === 'Systems/Outlook' && /(feeds itself and pays its own way\.|grows what it eats and makes what it needs, and owes no one|^Nothing .+ needs to get through the year has to come from outside\.|feeds itself and pays its way, and buys in what it cannot make|eats it grows, and what it spends it earns; some of what it needs is bought in|gets through the year, buying in what its own land|gets through the year on its own land and trades)/.test(l)],
    ['NOISE(Patron deity block)', (v, l) => v === 'Systems/Power' && /^(Patron deity|Assign a patron god to awaken the settlement)/.test(l)],
    ['D6', (v, l) => /Contender|Contests the seat|Could contend|Could contest the seat|contests the seat/.test(l)],
  ];
  PAGE_RULES = RULES;
  for (const f of readdirSync(B).sort()) {
    const a = JSON.parse(readFileSync(join(B, f))); const b = JSON.parse(readFileSync(join(A, f)));
    const seed = a.seed; const recMoved = a.recordHash !== b.recordHash; const pageMoved = a.pageHash !== b.pageHash;
    if (!recMoved && !pageMoved) continue;
    const place = (out.places[seed] = { size: a.size, rec: recMoved, page: pageMoved, units: new Set(), strs: [], lines: [] });
    if (recMoved) out.rec++;
    if (recMoved && existsSync(`${R}/strings-join/${seed}.json`)) {
      const x = JSON.parse(readFileSync(`${R}/strings-before/${seed}.json`)).s; const y = JSON.parse(readFileSync(`${R}/strings-join/${seed}.json`)).s;
      const pl = powerLineUnits(seed);
      for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
        if (x[k] === y[k]) continue;
        let u = stringUnit(seed, k, x[k], y[k]);
        if (!u && pl.length) {
          // the power step's lines and any string that carries one of them (before or after)
          const r0 = M['d7-before'].get(seed), r1 = M['d7-join'].get(seed);
          const lines = [r0?.recentConflict, r0?.pressure, r1?.recentConflict, r1?.pressure, M['d2b-before'].get(seed)?.pr, M['d2b-join'].get(seed)?.pr].filter((s) => typeof s === 'string' && s.length > 20);
          if (/recentConflict$|pressureSentence$|prominentRelationship\./.test(k) || lines.some((l) => String(x[k] ?? '').includes(l) || String(y[k] ?? '').includes(l))) u = pl.join('+');
        }
        if (!u && k.startsWith('public.')) u = publicUnit(seed, k, x[k], y[k], pl);
        place.strs.push([k, x[k], y[k], u]);
        if (u) { for (const v of u.split('+')) place.units.add(v); add(out.recU, u, seed); } else out.unexplRec.push([seed, k, x[k], y[k]]);
      }
      // a public block's empty glance follows its own block's sentence (the same block, the sentence's unit)
      for (let i = 0; i < place.strs.length; i++) {
        const [k, a, b, u] = place.strs[i];
        if (u || !k.startsWith('public.') || (a && b)) continue;
        const sib = place.strs.find(([k2, , , u2]) => u2 && k2 !== k && k2.replace(/\.[^.]+$/, '') === k.replace(/\.[^.]+$/, ''));
        if (sib) { place.strs[i][3] = `${sib[3]}(its block's sentence)`; const j = out.unexplRec.findIndex((x) => x[0] === seed && x[1] === k); if (j >= 0) out.unexplRec.splice(j, 1); add(out.recU, place.strs[i][3], seed); }
      }
      // fields that moved with no string under them
      const k0 = M['keys-before'].get(seed)?.keys || {}; const k1 = M['keys-join'].get(seed)?.keys || {};
      for (const fk of new Set([...Object.keys(k0), ...Object.keys(k1)])) {
        if (k0[fk] === k1[fk]) continue;
        const pre = `record.${fk}`;
        const strs = place.strs.filter(([p]) => p === pre || p.startsWith(`${pre}.`) || p.startsWith(`${pre}[`));
        const us = [...new Set(strs.map((s) => s[3]).filter(Boolean))].join(',') || 'NO STRING';
        (out.fieldU[fk] ||= {})[us] = ((out.fieldU[fk] ||= {})[us] || 0) + 1;
        if (!strs.length && !(fk === 'powerStructure' || fk === 'history')) out.unexplRec.push([seed, `field ${fk}`, k0[fk], k1[fk]]);
      }
    }
    if (pageMoved) out.page++;
    place.units = [...place.units];
  }

  // ---- PAGES: every moved printed line, classed ----
  const { gunzipSync } = await import('node:zlib');
  const { factsOf } = await import('/home/user/wt/join/src/domain/facts/factsOf.js'); const { declarationAdmits, declarationOf } = await import('/home/user/wt/join/src/domain/facts/factVocabulary.js');
  const ELDER = /^(The elder is asked at first light|People stop at the elder's door|Matters of any weight are talked over at the elder's door)/;
  const FARE = /^(Nobody here goes hungry, though few eat richly|Money is short, so meals are plain, but nobody goes without)/;
  const L12 = /^The lord's steward is obeyed/;
  const D6N = (t) => held(t).replace(/Could contend/g, 'Contender').replace(/Could contest the seat/g, 'Contests the seat').replace(/could contest the seat/g, 'contests the seat');
  const ms = (xs) => { const m = new Map(); for (const x of xs) m.set(x, (m.get(x) || 0) + 1); return m; };
  const sentences = (t) => String(t ?? '').split(/(?<=[.!?;:])\s+/).map((x) => x.trim()).filter((x) => x.length >= 24);
  for (const f of readdirSync(B).sort()) {
    const a = JSON.parse(readFileSync(join(B, f))); const b = JSON.parse(readFileSync(join(A, f)));
    if (a.pageHash === b.pageHash) continue;
    const seed = a.seed; const place = out.places[seed];
    for (const v of new Set([...Object.keys(a.printed), ...Object.keys(b.printed)])) {
      const X = ms(a.printed[v] || []), Y = ms(b.printed[v] || []);
      const gone = []; const came = [];
      for (const [l, n] of X) for (let i = (Y.get(l) || 0); i < n; i++) gone.push(l);
      for (const [l, n] of Y) for (let i = (X.get(l) || 0); i < n; i++) came.push(l);
      if (!gone.length && !came.length) continue;
      const moved = [...gone.map((l) => ['-', l]), ...came.map((l) => ['+', l])].map(([d, l]) => ({ d, l, u: null }));
      // (1) pairs equal once the units' word changes are normalized (E8/E8b reflexive, D6 words)
      for (const g of moved.filter((m) => m.d === '-')) {
        const c = moved.find((m) => m.d === '+' && !m.u && D6N(m.l) === D6N(g.l));
        if (c) { const u = held(c.l) === held(g.l) && c.l !== g.l && D6N(c.l) === D6N(g.l) && !/Could cont/.test(c.l) ? 'E8/E8b' : 'D6'; g.u = c.u = u; }
      }
      // (1b) E8's tie (its asked card's own reflexive) and E1's doubles (the same line, fewer double possessives), paired in the view
      for (const g of moved.filter((m) => m.d === '-' && !m.u)) {
        const c = moved.find((m) => m.d === '+' && !m.u && tieE8(g.l, m.l));
        if (c) { g.u = c.u = 'E8'; continue; }
        if (dbl(g.l) > 0) { const c2 = moved.filter((m) => m.d === '+' && !m.u && dbl(m.l) < dbl(g.l) && jacc(g.l, m.l) >= 0.5).sort((x, y) => jacc(g.l, y.l) - jacc(g.l, x.l))[0]; if (c2) { const u = held(g.l) !== g.l || held(c2.l) !== c2.l ? 'E1+E8' : 'E1'; g.u = c2.u = u; } }
      }
      // (2) the display units' own words
      if (v === 'World/Daily Life') {
        // WORDS-2 unit-dailylife-trigger.mjs's admission test (copied; facts from the join's own factsOf over the BEFORE record)
        const who = [];
        let rec = null; try { rec = JSON.parse(gunzipSync(readFileSync(`${R}/rec-before/${seed}.json.gz`)).toString()).record; } catch {}
        if (rec) {
          const fx = factsOf(rec);
          const ad = (needs, excludes) => declarationAdmits(declarationOf({ text: 'x', needs, excludes }), fx).admitted;
          if (ad(['ruler: elder'], []) !== ad(['office: elders'], [])) who.push('E5');
          if (ad(['prosperity: < comfortable'], []) && !ad(['prosperity: < comfortable'], ['food: = pressured'])) who.push('G8');
          else if (ad(['prosperity: ≤ poor'], []) && !ad(['prosperity: ≤ poor'], ['food: = pressured'])) who.push('G8');
          if (ad(['sovereign', "office: lord's steward", 'institution: lordsSteward'], [])) who.push('E6');
        } else who.push('NO-RECORD');
        if (who.length) for (const m of moved) if (!m.u) m.u = `DL:${who.join('+')}`;
      }
      for (const m of moved) if (!m.u) { const hit = RULES.find(([, t]) => t(v, m.l)); if (hit) m.u = hit[0]; }
      // P9 (BIRTH-2): the beasts grade as printed: the Overview's "Monster Defense" row, and the Defense tab's grade chip where
      // that row moved too (the chip is the Beasts & Monsters row's; the grade alone)
      const ovA = a.printed['Summary/Overview'] || [], ovB = b.printed['Summary/Overview'] || [];
      const p9 = ovA.find((l) => /^Monster Defense/.test(l)) !== ovB.find((l) => /^Monster Defense/.test(l));
      for (const m of moved) if (!m.u && p9 && ((v === 'Summary/Overview' && /^Monster Defense/.test(m.l)) || (v === 'Systems/Defense' && /^(Critical|Weak|Adequate|Strong|Excellent|Fortified|Vulnerable|Robust)[▼▲]?$/.test(m.l)))) m.u = 'P9';
      // (2b) the guard leaf's families words (guardLineUnderTheLaw.js :: familiesHeldOf, BAR7-ORDER, in both trees): the
      // no-watch / quarrel lines name the families only where the finished record does; the record's quarrel
      // (powerStructure.recentConflict) named them before and does not after: the units that moved that line
      {
        const FAM = /\b(?:famil(?:y|ies)|nobles?|nobility|clans?|elders?)\b/i;
        const r0 = M['d7-before'].get(seed), r1 = M['d7-join'].get(seed);
        const famMoved = r0 && FAM.test(String(r0.recentConflict ?? '')) && !FAM.test(String(r1?.recentConflict ?? ''));
        const pl = famMoved ? powerLineUnits(seed) : [];
        if (pl.length) for (const m of moved) if (!m.u && v === 'Systems/Defense' && /(old families|oldest families|The neighbours keep the peace|The neighbours once kept|heads of households)/.test(m.l)) m.u = `${pl.join('+')}(guard leaf reads the quarrel)`;
      }
      // (2c) the Overview's "Notable connection" block stands only where the record holds a prominent tie: its unit
      { const pr = (place?.strs || []).find(([k, , , u]) => u && k.startsWith('record.prominentRelationship'));
        if (pr) for (const m of moved) if (!m.u && v === 'Summary/Overview' && /^(Notable connection|Full relationship web)/.test(m.l)) m.u = `${pr[3]}(the prominent tie's block)`; }
      // (3) traced to a changed record string of the place (its before value in a line that left, its after value in one that came)
      if (place?.strs) for (const m of moved) if (!m.u) {
        for (const [k, x, y, u] of place.strs) {
          const src = m.d === '-' ? x : y; if (!u || typeof src !== 'string') continue;
          if ((src.length >= 12 && m.l.includes(src)) || sentences(src).some((s) => m.l.includes(s))) { m.u = `${u}`; m.via = k; break; }
        }
      }
      for (const m of moved) {
        if (m.u) { add(out.pageU, m.u, seed); (place.lines ||= []).push([v, m.d, m.u]); }
        else out.unexplPage.push([seed, a.size, place?.rec ? 'R' : '-', v, m.d, m.l]);
      }
    }
  }
  // every moved place must carry at least one attributed string (record) / line (page); a page that moved by ORDER or by a
  // view's name alone (no line gained or lost) is listed too
  const recNone = [], pageNone = [];
  for (const [seed, pl] of Object.entries(out.places)) {
    if (pl.rec && !(pl.strs || []).some((x) => x[3])) recNone.push(seed);
    if (pl.page && !(pl.lines || []).length && !out.unexplPage.some((x) => x[0] === seed)) pageNone.push(seed);
  }
  const rep = [];
  rep.push(`places moved by record with no attributed string: ${recNone.length} ${recNone.slice(0, 10).join(' ')}`);
  rep.push(`places moved by page with no moved line (order or view set only): ${pageNone.length} ${pageNone.slice(0, 10).join(' ')}`);
  writeFileSync(`${R}/attr-none.json`, JSON.stringify({ recNone, pageNone }));
  rep.push(`${K}: record moved ${out.rec}, page moved ${out.page}`);
  rep.push('record strings by unit (places):'); for (const [u, s] of Object.entries(out.recU)) rep.push(`  ${u}: ${s.size}`);
  rep.push('fields moved (count of places by the units of the strings under them):'); for (const [f, v] of Object.entries(out.fieldU)) rep.push(`  ${f}: ${JSON.stringify(v)}`);
  rep.push(`UNEXPLAINED record strings/fields: ${out.unexplRec.length} in ${new Set(out.unexplRec.map((x) => x[0])).size} places`);
  for (const x of out.unexplRec.slice(0, LIST)) rep.push(`  ${x[0]} ${x[1]}\n     - ${String(x[2]).slice(0, 200)}\n     + ${String(x[3]).slice(0, 200)}`);
  rep.push('page lines by unit (places):'); for (const [u, s] of Object.entries(out.pageU)) rep.push(`  ${u}: ${s.size}`);
  const up = new Set(out.unexplPage.map((x) => x[0]));
  rep.push(`UNEXPLAINED page lines: ${out.unexplPage.length} in ${up.size} places`);
  writeFileSync(`${R}/attr-unexpl-page.tsv`, out.unexplPage.map((x) => x.join('\t')).join('\n') + '\n');
  for (const x of out.unexplPage.slice(0, LIST)) rep.push(`  ${x.slice(0, 5).join(' ')} ${String(x[5]).slice(0, 170)}`);
  console.log(rep.join('\n'));
  writeFileSync(`${R}/attr-rec.json`, JSON.stringify(out.places));
}
