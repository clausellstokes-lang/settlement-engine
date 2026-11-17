// BAR7-AUDIT-I · THE WIDE LOW FAMILIES (counted apart: LOW rows do not count against the bar) and ONE DESIGN POINT.
//   low.generation   "a generation old" said of an event the record dates 40 years back or more (the annex's
//                    `{timeband_age}`: `heraldCausalGrammar.js :: TIME_BANDS` a_generation runs to 60 years)
//   low.agree        a plural label as a singular subject ("Weak defences is the reason", "Weak defences keeps ...")
//   low.doubled      a trade list that prints one good twice (exact) or a good inside another item of the same list
//   low.hook-party   a hook or a defence line that names a party ("the old families", "the reformers") no power, tension,
//                    conflict or crisis of the record holds (a hook states its own fact: only where the record denies it)
//   design.outside   under a siege (and beside it), the Outlook's food "bought from outside" and the "one importer" of
//                    "all the grain" (`src/generators/economy/foodBalance.js`), each with its case
// Pure; reads one town read by `pageB.mjs :: readTown`; no I/O.
import { sentences } from './pageB.mjs';

const DOSSIER = /^(Summary|Systems|World|Notes)\//;
const each = (T, re, f) => { for (const x of T.all) { if (!DOSSIER.test(x.tab) || !re.test(x.text)) continue; for (const s of sentences(x.text)) if (re.test(s)) f(x, s); } };
const fold = (s) => s.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['and', 'of', 'the', 'for', 'a', 'an', 'or', 'materials', 'goods']);

export function lowFamiliesI(T, town) {
  const rec = T.record || {};
  const out = [];
  const push = (rule, x, s, against, why, extra = {}) => out.push({ law: 'LOW', rule, town, tab: x.tab, line: x.text, sentence: s, against, why, status: 'apart', cause: T.crises.size ? 'crisis' : 'other', ...extra });
  // low.generation
  const events = (rec.history?.historicalEvents || []).filter((e) => e && typeof e.yearsAgo === 'number');
  each(T, /\ba generation old\b/, (x, s) => {
    const low = s.toLowerCase();
    const ev = events.find((e) => { const w = String(e.name || '').replace(/^the\s+/i, '').toLowerCase(); return w && low.includes(w); });
    if (ev && ev.yearsAgo >= 40) push('low.generation', x, s, { tab: 'record', line: `history.historicalEvents "${ev.name}" yearsAgo ${ev.yearsAgo}` }, `"a generation old" of ${ev.name}, ${ev.yearsAgo} years back`, { age: ev.yearsAgo });
  });
  // low.agree
  each(T, /\b(?:Weak|Strong|Poor|Thin|Old|Open) (?:defences|walls|roads|markets|fields|stores|trades|harvests)\s+(?:is|keeps|has|was|makes|means|leaves|does)\b/, (x, s) => push('low.agree', x, s, { tab: x.tab, line: s }, 'a plural subject with a singular verb'));
  // low.doubled
  const eco = T.tabs['Systems/Economics'] || [];
  const lists = [];
  eco.forEach((l, i) => {
    if (/^(Imports|Exports|Produced locally)$/.test(l) && eco[i + 1] && eco[i + 1].includes(' · ')) lists.push({ name: l, i: i + 1, items: eco[i + 1].split(' · ') });
    const m = /^Needed, and not brought in: (.+?)\.?$/.exec(l);
    if (m) lists.push({ name: 'Needed', i, items: m[1].split(/, (?![^(]*\))/) });
  });
  for (const L of lists) {
    const items = L.items.map((s) => s.trim()).filter(Boolean);
    const seen = new Set();
    items.forEach((it, j) => {
      const f = fold(it); if (!f) return;
      const x = { tab: 'Systems/Economics', text: eco[L.i] };
      if (seen.has(f)) { push('low.doubled', x, eco[L.i], { tab: 'Systems/Economics', line: `${L.name}: "${it}" twice` }, `the ${L.name} list prints "${it}" twice`, { kind: 'exact' }); return; }
      seen.add(f);
      const w = f.split(' ').filter((t) => !STOP.has(t));
      if (!w.length) return;
      const within = items.find((o, k) => k !== j && fold(o) !== f && w.every((t) => fold(o).split(' ').includes(t)));
      if (within) push('low.doubled', x, eco[L.i], { tab: 'Systems/Economics', line: `${L.name}: "${it}" inside "${within}"` }, `the ${L.name} list prints "${it}" and again inside "${within}"`, { kind: w.length >= 2 ? 'within-phrase' : 'within-word' });
    });
  }
  // low.hook-party
  const PARTY = /\bthe (old families|reformers|reform party|loyalists|hardliners|radicals|traditionalists|zealots)\b/i;
  const KEY = { 'old families': /famil|noble|clan|elder/i, reformers: /reform/i, 'reform party': /reform/i, loyalists: /loyal/i, hardliners: /hardline/i, radicals: /radical/i, traditionalists: /tradition/i, zealots: /zealot|fanatic/i };
  const held = JSON.stringify([rec.powerStructure?.factions?.map((f) => f?.faction), rec.conflicts, rec.history?.currentTensions, rec.stress, rec.powerStructure?.recentConflict]);
  each(T, PARTY, (x, s) => {
    if (!/^(Summary\/Plot Hooks|Systems\/Defense|Summary\/Overview)$/.test(x.tab)) return;
    const p = PARTY.exec(s)[1].toLowerCase();
    if (!KEY[p].test(held)) push('low.hook-party', x, s, { tab: 'record', line: `no power, conflict, tension or crisis names ${p}` }, `names "the ${p}"; the record holds no such party`);
  });
  // design.outside
  const OUT = /\b(what food can still be bought from outside costs more every week|decide what it can still afford to import|One importer now brings in all the grain)\b/;
  const fb = rec.economicViability?.metrics?.foodBalance || {};
  const fs = rec.economicState?.foodSecurity || {};
  const siege = T.crises.has('under_siege');
  const channel = String(fb.importChannel || fs.magicTradeChannel || '');
  const cover = Number(fb.importCoverage || fs.importCoverage || 0);
  const grainIn = JSON.stringify(rec.economicState?.primaryImports || []).toLowerCase().includes('grain');
  const kase = siege ? (cover > 0 && channel ? `siege · imports by ${channel}` : cover > 0 ? 'siege · imports counted, no channel named' : 'siege · nothing brought in')
    : (grainIn ? 'no siege · grain imported' : cover > 0 ? 'no siege · food imported, no grain' : 'no siege · nothing brought in');
  each(T, OUT, (x, s) => push('design.outside', x, s, { tab: 'record', line: `foodBalance.importChannel=${channel || '-'} importCoverage=${cover}` }, kase, { case: kase }));
  return out;
}
