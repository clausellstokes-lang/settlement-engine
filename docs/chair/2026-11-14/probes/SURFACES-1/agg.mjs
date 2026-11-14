// agg.mjs <facts dir> <dumps dir> <pdf/journal dir> <seeds> [out.json]: item 0's table, by fact, by surface, three towns named.
import fs from 'node:fs';
const [FD, DD, SD, SF, OUTF] = process.argv.slice(2);
const seeds = fs.readFileSync(SF, 'utf8').trim().split('\n');
const fold = (x) => String(x ?? '').toLowerCase().replace(/_/g, ' ').replace(/[✓✦○]/g, '').replace(/\s+/g, ' ').trim();
const cls = (w) => { const f = fold(w); if (f === '') return 'none'; if (/impaired|broken|blocked|collapsing/.test(f)) return 'impaired'; if (/vulnerable|strained|scarce/.test(f)) return 'vulnerable'; return 'working'; };
const rows = {}; const add = (fact, surface, seed, note) => { const k = `${fact} | ${surface}`; (rows[k] ||= { towns: new Set(), items: 0, ex: [] }); const r = rows[k]; r.items++; if (!r.towns.has(seed)) { r.towns.add(seed); if (r.ex.length < 3) r.ex.push(`${seed}: ${note}`); } };
const crisis = (seed, d) => ({ siege: /Field work and trade have stopped/.test(d) || /under_siege/.test(seed), famine: /famine/.test(seed), occupied: /occupied/.test(seed) });
let n = 0; const kinds = { siege: 0, famine: 0, occupied: 0 };
for (const seed of seeds) {
  const ff = `${FD}/${seed}.facts.json`; if (!fs.existsSync(ff)) continue; n++;
  const o = JSON.parse(fs.readFileSync(ff, 'utf8'));
  const dump = fs.existsSync(`${DD}/${seed}.txt`) ? fs.readFileSync(`${DD}/${seed}.txt`, 'utf8') : '';
  const pdf = fs.existsSync(`${SD}/${seed}.pdf-canon_dossier.txt`) ? fs.readFileSync(`${SD}/${seed}.pdf-canon_dossier.txt`, 'utf8') : '';
  const jr = fs.existsSync(`${SD}/${seed}.foundry-canon_dossier.txt`) ? fs.readFileSync(`${SD}/${seed}.foundry-canon_dossier.txt`, 'utf8') : '';
  const tn = fs.existsSync(`${SD}/${seed}.tonight.txt`) ? fs.readFileSync(`${SD}/${seed}.tonight.txt`, 'utf8') : '';
  const cr = crisis(seed, dump); for (const k of Object.keys(kinds)) if (cr[k]) kinds[k]++;
  const tag = [cr.siege && 'siege', cr.famine && 'famine', cr.occupied && 'occupied'].filter(Boolean).join('+') || 'calm';
  const { tab, cards, rows: fl, groups, jr: jc } = o.chains;
  const byLabel = new Map(tab.map((t) => [t.label, t]));
  // F1 the chain's state
  for (const c of cards) { const t = byLabel.get(c.name); if (!t) continue; if (cls(c.status) !== cls(t.word)) add('1 chain state (class)', 'PDF Services card', seed, `${tag} "${c.name}" card ${c.status} / tab ${t.word || '(none)'}`);
    if (cls(c.status) === 'working' && cls(t.word) === 'impaired' && (cr.siege || cr.famine)) add('1 chain state: working word under siege/famine where tab Impaired', 'PDF Services card', seed, `${tag} "${c.name}" ${c.status}`);
    if (fold(c.status) !== fold(t.word)) add('1 chain state (word)', 'PDF Services card', seed, `${tag} "${c.name}" ${c.status} / tab ${t.word || '(none)'}`); }
  for (const r of fl) { const t = byLabel.get(r.label); if (!t) continue; if (cls(r.status) !== cls(t.key)) add('1 chain state (class)', 'PDF flow colour', seed, `${tag} "${r.label}" ${r.status} / tab ${t.key || '(none)'}`); }
  for (const g of groups) { const m = g.text.match(/· (\d+) impaired/); const k = m ? +m[1] : 0; const want = tab.filter((t, i) => (o.chains.tab[i] && true) && cls(t.key) === 'impaired').length; void want; }
  jc.forEach((j, i) => { const t = tab[i]; if (!t) return; if (cls(j.state) !== cls(t.key)) add('1 chain state (class)', 'journal', seed, `${tag} #${i} ${j.state} / tab ${t.word}`);
    if (j.state && fold(j.state) !== fold(t.word)) add('1 chain state: stored key printed raw', 'journal', seed, `${tag} "*(${j.state})*" / tab ${t.word}`);
    if (j.name === 'Chain') add('(10) chain named "Chain"', 'journal', seed, `#${i}`); });
  // group headers: the impaired count per need group against the tab's shown states
  if (groups.length) { const recNeed = JSON.parse(fs.readFileSync(`${process.env.RECS}/${seed}.json`, 'utf8')).economicState.activeChains.map((c) => c.needKey || 'other');
    for (const g of groups) { const m = g.text.match(/· (\d+) impaired/); const k = m ? +m[1] : 0; const want = tab.filter((t, i) => recNeed[i] === g.needKey && cls(t.key) === 'impaired' && t.raw !== 'unexploited').length; if (k !== want) add('1 chain state: group header "K impaired"', 'PDF flow header', seed, `${tag} ${g.needKey} prints ${k} / tab ${want}`); } }
  // F2 the chain's outputs
  for (const r of fl) { const t = byLabel.get(r.label); if (!t) continue; const ok = new Set(t.outs.map(fold)); const extra = r.outs.filter((x) => !ok.has(fold(x))); if (extra.length) add('2 chain outputs the tab does not print', 'PDF flow', seed, `${tag} "${r.label}" +${extra.join(', ')}`); }
  for (const c of cards) { const t = byLabel.get(c.name); if (!t || !c.description) continue; const segs = c.description.split(' » '); const last = segs[segs.length - 1].replace(/^Normally yields: /, ''); const rawOuts = (o.chains.tab.find((x) => x.label === c.name) && true) ? last.split(', ') : []; const ok = new Set(t.outs.map(fold)); const extra = rawOuts.filter((x) => !ok.has(fold(x)) && segs.length > 1); if (extra.length && t.outs.length + extra.length > 0) add('2 chain outputs the tab does not print (card, last segment)', 'PDF Services card', seed, `${tag} "${c.name}" +${extra.join(', ')}`); }
  // F2b trade lists
  const T = o.trade; const sorted = (xs) => (xs || []).map(fold).sort().join(' | ');
  if (T.pdf) { if (sorted(T.pdf.exports.items) !== sorted(T.tabShown.exports)) add('2 trade list: exports', 'PDF', seed, `${tag} pdf[${T.pdf.exports.items}] tab[${T.tabShown.exports}]`);
    if (sorted(T.pdf.imports.items) !== sorted(T.tabShown.imports)) add('2 trade list: imports', 'PDF', seed, `${tag} pdf[${T.pdf.imports.items}] tab[${T.tabShown.imports}]`);
    if (sorted(T.pdf.local.items) !== sorted(T.tab.local)) add('2 trade list: local', 'PDF', seed, `${tag}`); }
  if (T.tab.exports.some((x) => !T.tabShown.exports.includes(x)) || T.tab.imports.some((x) => !T.tabShown.imports.includes(x))) add('2 trade list: a pill in another spelling than the tab', 'PDF+journal', seed, `${tag} ${[...T.tab.exports, ...T.tab.imports].filter((x, i, a) => ![...T.tabShown.exports, ...T.tabShown.imports].includes(x)).join(', ')}`);
  if (T.tab.stopped && ((T.pdf?.imports.items.length || 0) > 0 || T.jr.imports)) add('2 imports under a siege', 'PDF/journal', seed, `${tag}`);
  // F3 the food block: the tab's Short against the PDF's DEFICIT
  const econ = dump.split('== Systems/Economics ==')[1]?.split('\n== ')[0] || '';
  const sm = econ.match(/Short: ([\d,]+) lbs/); const tabShort = sm ? +sm[1].replace(/,/g, '') : 0; const pdfDef = +(o.food.pdfDeficit || 0);
  if (Math.round(tabShort) !== Math.round(pdfDef)) add('3 food block: PDF deficit vs tab Short', 'PDF', seed, `${tag} pdf ${pdfDef} / tab ${tabShort}`);
  const ov = dump.split('== Summary/Overview ==')[1]?.split('\n== ')[0] || ''; const fm = ov.match(/^Food Security(.+)$/m);
  if (fm && o.food.band && fold(fm[1]) !== fold(o.food.band)) add('3 Overview food word vs the food band (Tonight/Daily Life)', 'Overview tab', seed, `${tag} "${fm[1]}" / band ${o.food.band}`);
  // F4 the rest
  if (cr.siege && /\nAbundant\n/.test(pdf)) add('4 "Abundant" kicker under a siege', 'PDF', seed, `${tag}${/\nAbundant/.test(dump.split('== Systems/Resources ==')[1]?.split('\n== ')[0] || '') ? ' (tab prints it too)' : ''}`);
  for (const f of o.mods) { const keys = [f.modifier, ...(f.modifiers || [])].filter((k) => typeof k === 'string' && k); for (const k of keys) { if (pdf.includes(k)) add('4 power modifier key raw', 'PDF', seed, `${tag} "${k}"`); if (dump.includes(k) || dump.toUpperCase().includes(k.toUpperCase())) add('4 power modifier key raw', 'tab (Power/Summary)', seed, `${tag} "${k}"`); } }
  const br = /[A-Za-z]+ \(\d+[-–]\d+\)/g;
  for (const [sec, name] of [['== Summary/Overview ==', 'Overview tab'], ['== World/History ==', 'History tab']]) { const t = dump.split(sec)[1]?.split('\n== ')[0] || ''; const m = t.match(br); if (m) add('(i) catalogue count range printed', name, seed, `${tag} ${m[0]}`); }
  { const m = pdf.match(br); if (m) add('(i) catalogue count range printed', 'PDF', seed, `${tag} ${m[0]}`); const mj = jr.match(br); if (mj) add('(i) catalogue count range printed', 'journal', seed, `${tag} ${mj[0]}`); }
  { const g = tn.match(/granary[^"]{0,60}few days/i); const def = dump.split('== Systems/Defense ==')[1]?.split('\n== ')[0] || ''; const st = def.match(/a few weeks of grain|granary[^\n]{0,40}weeks/i); if (g && st) add('(ii) Tonight granary length vs the stores row', 'Tonight sheet', seed, `${tag} "${g[0]}" / "${st[0]}"`); else if (g) add('(ii) Tonight granary line "few days" (stores row other)', 'Tonight sheet', seed, `${tag} "${g[0]}"`); }
}
const table = Object.entries(rows).sort().map(([k, r]) => ({ row: k, towns: r.towns.size, items: r.items, ex: r.ex }));
console.log(`towns ${n}; siege ${kinds.siege}, famine ${kinds.famine}, occupied ${kinds.occupied}`);
for (const r of table) console.log(`${r.row} :: ${r.towns} towns, ${r.items} items\n   ${r.ex.join('\n   ')}`);
if (OUTF) fs.writeFileSync(OUTF, JSON.stringify({ n, kinds, table }, null, 1));
