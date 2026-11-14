// CENSUS-3 kind i: THE SURFACES DISAGREE. One fact printed differently on the tab, the PDF and the journal (and the
// Tonight sheet) of the same town. A TOWN-LEVEL test: it reads the town's whole dump (ctx.V, the views of
// render.census3.jsx) and returns hits { pattern:'i', sub:'<fact>:<pair>', view, line, why, writer } where `line` is
// the line of the surface that differs from the tab (the tab is the reference: the owner reads the tab first; a
// difference is a fault on one of the two, the read says which). Facts (the brief's list):
//   chain-state   a chain's state word: the PDF's chain card (Services) and the tab's chain card (Economics), by the
//                 chain's printed label; the journal's "Chain (<state>)" rows against the tab's states as a multiset
//   chain-count   the count of chains: the tab's "Economic Flows (N active", the PDF's "ACTIVE SUPPLY CHAINS · N" and
//                 "ECONOMIC FLOWS · N CHAINS", the journal's chain rows
//   chain-outputs an output the PDF's card prints ("Normally yields: a, b") that the tab's card for that chain does not
//   food-word     the food word's class (deficit/short; surplus; balanced) on the Economics tab, the PDF, the journal
//                 and the Tonight sheet; food-figure: the shortfall's (or surplus's) figure, tab against PDF/journal
//   stores-span   the span of the stores ("about seven months of grain") wherever a "Stores:" row prints
//   house-label   a house the tab prints by its display name and the PDF or journal by its raw catalogue name
//   trade-list    the Exports list: the tab's pills (run together in the dump: compared joined) against the PDF's
//                 EXPORTS block and the journal's "Exports:" row
// Writers (by form; EXECUTED that the function is the surface's section): see W below.
const W = {
  'pdf:chain-state': { file: 'src/pdf/sections/Services.jsx', fn: 'Services' }, 'journal:chain-state': { file: 'src/foundry/journalPages.js', fn: 'economicsPage' },
  'pdf:chain-count': { file: 'src/pdf/sections/Services.jsx', fn: 'Services' }, 'journal:chain-count': { file: 'src/foundry/journalPages.js', fn: 'economicsPage' },
  'pdf:chain-outputs': { file: 'src/pdf/sections/Services.jsx', fn: 'Services' },
  'pdf:food-word': { file: 'src/pdf/sections/EconomicsTrade.jsx', fn: 'EconomicsTrade' }, 'journal:food-word': { file: 'src/foundry/journalPages.js', fn: 'economicsPage' }, 'tonight:food-word': { file: 'src/domain/summary/tonightSheet.js', fn: 'composeTonightSheet' },
  'pdf:food-figure': { file: 'src/pdf/sections/EconomicsTrade.jsx', fn: 'EconomicsTrade' }, 'journal:food-figure': { file: 'src/foundry/journalPages.js', fn: 'economicsPage' },
  'pdf:stores-span': { file: 'src/pdf/sections/EconomicsTrade.jsx', fn: 'EconomicsTrade' }, 'journal:stores-span': { file: 'src/foundry/journalPages.js', fn: 'economicsPage' }, 'tonight:stores-span': { file: 'src/domain/summary/tonightSheet.js', fn: 'composeTonightSheet' }, 'tab:stores-span': { file: 'src/components/new/tabs/DefenseTab.jsx', fn: '(a second tab)' },
  'pdf:house-label': { file: 'src/pdf/sections/Institutions.jsx', fn: 'Institutions' }, 'journal:house-label': { file: 'src/foundry/journalPages.js', fn: 'institutionsPage' },
  'pdf:trade-list': { file: 'src/pdf/sections/EconomicsTrade.jsx', fn: 'EconomicsTrade' }, 'journal:trade-list': { file: 'src/foundry/journalPages.js', fn: 'economicsPage' },
};
const STATE = /(Running|Vulnerable|Impaired|Dormant|Idle|Collapsed|Failing|Disrupted|Operational|Active|Unexploited|Stalled|Entrepôt)$/;
const lc = (t) => String(t).toLowerCase().trim();
const surfOf = (v) => (v.startsWith('PDF/') ? 'pdf' : v.startsWith('Journal/') ? 'journal' : v.startsWith('Table/') ? 'tonight' : 'tab');
function foodClass(t) { const m = String(t).match(/\b(Short|Deficit|DEFICIT|Surplus|SURPLUS|Balanced|BALANCED|Sufficient|Self-sufficient|Famine|Shortfall)\b/); if (!m) return null; const w = m[1].toLowerCase(); return /short|deficit|famine/.test(w) ? 'deficit' : /surplus/.test(w) ? 'surplus' : 'balanced'; }
export function testI(ctx) {
  const V = ctx.V; const res = []; const get = (v) => V[v] || [];
  const push = (fact, surface, view, line, why) => res.push({ pattern: 'i', sub: `${fact}:tab-${surface}`, view, line, why, writer: { ...(W[`${surface}:${fact}`] || { file: '(untraced)', fn: '' }), evidence: 'traced form: kind i (the surface section that prints the fact)' } });
  const eco = get('Systems/Economics'); const pS = get('PDF/Services'); const pE = get('PDF/EconomicsTrade'); const jE = get('Journal/Economics & Trade'); const ton = get('Table/Tonight sheet');
  // tab chain cards: label + need + state on one line (the dump joins the card's head)
  const tabChains = eco.filter((l) => STATE.test(l) && !/^All \(/.test(l));
  // PDF chain cards: label / state / "NEED ..." triples after "ACTIVE SUPPLY CHAINS"
  const pdfCards = []; for (let i = 0; i + 2 < pS.length; i++) if (/^NEED /.test(pS[i + 2]) && STATE.test(pS[i + 1]) && pS[i + 1].split(' ').length <= 3) pdfCards.push({ label: pS[i], state: pS[i + 1], i, desc: pS[i + 3] || '' });
  for (const c of pdfCards) { const t = tabChains.find((l) => l.startsWith(c.label)); if (!t) continue; const ts = t.match(STATE)[1];
    if (lc(ts) !== lc(c.state)) push('chain-state', 'pdf', 'PDF/Services', `${c.label}: ${c.state}`, `the PDF's card says "${c.state}", the tab's "${ts}"`); }
  const jStates = jE.map((l) => l.match(/^Chain \(([^)]+)\)$/)?.[1] || (l.match(/^(?:.*?) \((operational|running|vulnerable|impaired|dormant|idle|unexploited|entrepot|entrepôt|active)\)$/i)?.[1])).filter(Boolean).map(lc);
  if (jStates.length && tabChains.length) { const norm = (w) => (w === 'operational' || w === 'active' ? 'running' : w === 'entrepot' ? 'entrepôt' : w);
    const a = tabChains.map((l) => norm(lc(l.match(STATE)[1]))).sort().join(','); const b = jStates.map(norm).sort().join(',');
    if (a !== b) push('chain-state', 'journal', 'Journal/Economics & Trade', jE.find((l) => /^Chain \(|\((?:operational|vulnerable|impaired)\)$/i.test(l)) || '', `the journal's chain states [${b}] against the tab's [${a}]`); }
  // chain count
  const tabN = +(eco.join('\n').match(/Economic Flows \((\d+) active/)?.[1] ?? NaN); const pN = +(pS.join('\n').match(/ACTIVE SUPPLY CHAINS · (\d+)/)?.[1] ?? NaN); const fN = +(pE.join('\n').match(/ECONOMIC FLOWS · (\d+) CHAINS/)?.[1] ?? NaN);
  if (tabN >= 0 && pN >= 0 && tabN !== pN) push('chain-count', 'pdf', 'PDF/Services', `ACTIVE SUPPLY CHAINS · ${pN}`, `the PDF counts ${pN} chains, the tab ${tabN} active`);
  else if (tabN >= 0 && fN >= 0 && tabN !== fN) push('chain-count', 'pdf', 'PDF/EconomicsTrade', `ECONOMIC FLOWS · ${fN} CHAINS`, `the PDF's flow counts ${fN} chains, the tab ${tabN} active`);
  if (tabN >= 0 && jStates.length && jStates.length !== tabN) push('chain-count', 'journal', 'Journal/Economics & Trade', `(${jStates.length} chain rows)`, `the journal lists ${jStates.length} chains, the tab ${tabN} active`);
  // chain outputs: the PDF card's "Normally yields: a, b" against the tab card's outputs line
  for (const c of pdfCards) { const m = c.desc.match(/Normally yields: (.*)$/); if (!m) continue; const ti = eco.findIndex((l) => l.startsWith(c.label) && STATE.test(l)); if (ti < 0) continue;
    let end = eco.findIndex((l, k) => k > ti && STATE.test(l)); if (end < 0) end = eco.length; const block = lc(eco.slice(ti + 1, end).join(' | '));
    const miss = m[1].split(', ').map(lc).filter((o) => o && !block.includes(o)); if (miss.length) push('chain-outputs', 'pdf', 'PDF/Services', c.desc, `the PDF's ${c.label} card yields "${miss.join(', ')}", the tab's card does not`); }
  // food word and figure
  const tabFoodL = eco.find((l) => /^Production: .*Need: /.test(l)) || ''; const tabFood = foodClass(tabFoodL.replace(/^.*Need: [\d,]+ lbs\/day/, ''));
  const tabFig = +(tabFoodL.match(/(?:Short|Surplus|Deficit): ([\d,]+)/)?.[1]?.replace(/,/g, '') ?? NaN);
  const pi = pE.findIndex((l) => /^(DEFICIT|SURPLUS|BALANCED)$/.test(l)); const pFood = pi >= 0 ? foodClass(pE[pi]) : null; const pFig = pi >= 0 ? +String(pE[pi + 1] || '').replace(/,/g, '') : NaN;
  const jL = jE.find((l) => /^Food: /.test(l)) || ''; const jFood = foodClass(jL); const jFig = +(jL.match(/[−-]?([\d,]+)/)?.[1]?.replace(/,/g, '') ?? NaN);
  const tL = ton.find((l) => /^Food /.test(l)) || ''; const tFood = foodClass(tL);
  if (tabFood) { if (pFood && pFood !== tabFood) push('food-word', 'pdf', 'PDF/EconomicsTrade', pE[pi], `the PDF says ${pFood}, the tab ${tabFood}`);
    if (jFood && jFood !== tabFood) push('food-word', 'journal', 'Journal/Economics & Trade', jL, `the journal says ${jFood}, the tab ${tabFood}`);
    if (tFood && tFood !== tabFood) push('food-word', 'tonight', 'Table/Tonight sheet', tL, `the Tonight sheet says ${tFood}, the tab ${tabFood}`); }
  // L14 (the page's food word has one home): the Summary tabs' food sentence and the Tonight sheet against Economics
  if (tabFood) { const CUE = [[/\b(?:less food than it eats|cannot feed itself|can't feed itself|does not feed itself|goes short|short of food|food (?:is )?short|deficit)\b/i, 'deficit'], [/\b(?:more (?:food )?than it eats|food to spare|surplus|feeds itself and more)\b/i, 'surplus'], [/\b(?:feeds itself|just enough|enough to eat|balanced)\b/i, 'balanced']];
    for (const v of ['Summary/Overview', 'Summary/Foundations']) for (const l of get(v)) { if (!/\bfood|eats|feed/i.test(l)) continue; const c = CUE.find(([re]) => re.test(l)); if (c && c[1] !== tabFood) { res.push({ pattern: 'L14', sub: `${v.split('/')[1]}-economics`, view: v, line: l, why: `the ${v} food word is ${c[1]}, the Economics tab's ${tabFood}`, writer: { file: '(untraced)', fn: '' } }); break; } }
    if (tFood && tFood !== tabFood) res.push({ pattern: 'L14', sub: 'tonight-economics', view: 'Table/Tonight sheet', line: tL, why: `the Tonight sheet says ${tFood}, the Economics tab ${tabFood}`, writer: { ...W['tonight:food-word'], evidence: 'traced form' } }); }
  if (tabFig >= 0) { if (pFig >= 0 && pFood === tabFood && pFig !== tabFig) push('food-figure', 'pdf', 'PDF/EconomicsTrade', `${pE[pi]} ${pE[pi + 1]}`, `the PDF prints ${pFig}, the tab ${tabFig}`);
    if (jFig >= 0 && jFood === tabFood && jFig !== tabFig) push('food-figure', 'journal', 'Journal/Economics & Trade', jL, `the journal prints ${jFig}, the tab ${tabFig}`); }
  // the span of the stores: every "Stores: ..." row (and "about N months/weeks of grain") by surface
  const SPAN = /\b(?:about |some |nearly |barely |only |perhaps )?((?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|a few|several|\d+)(?: or (?:two|three|four))? (?:days?|weeks?|months?|years?|seasons?))(?:'s?)? of (?:grain|food|stores|supplies|provisions)\b/i;
  const spans = []; for (const [v, ls] of Object.entries(V)) { if (v === '_' || v.startsWith('Notes/')) continue; for (const l of ls) { if (!/\bStores?\b/.test(l)) continue; const m = l.match(SPAN); if (m) spans.push({ v, s: surfOf(v), span: lc(m[1]).replace(/^an? /, 'one '), l }); } }
  const ref = spans.find((x) => x.v === 'Systems/Economics'); if (ref) { const done = new Set(); for (const x of spans) { if (x.span === ref.span || done.has(x.s + x.v)) continue; done.add(x.s + x.v);
    push('stores-span', x.s === 'tab' ? 'tab' : x.s, x.v, x.l, `"${x.span}" here, "${ref.span}" on the Economics tab`); } }
  // a house's label: the tab's display name against a raw catalogue name on the PDF or the journal
  if (ctx.displayName) { const tabInst = get('Systems/Institutions').join('\n'); const surf = [['pdf', 'PDF/Institutions'], ['journal', 'Journal/Institutions']];
    for (const i of ctx.s.institutions || []) { const n = String(i.name || ''); const d = ctx.displayName(n); if (!n || d === n || !n.includes('(')) continue; if (!tabInst.includes(d) || tabInst.includes(n)) continue;
      for (const [s, v] of surf) { const l = get(v).find((x) => x.includes(n)); if (l) push('house-label', s, v, l, `the ${s} prints "${n}", the tab "${d}"`); } } }
  // the Exports list: joined, as the tab's pills run together in the dump
  const ei = eco.indexOf('Exports'); const tabEx = ei >= 0 ? eco[ei + 1] || '' : null;
  if (tabEx != null && !/^No /.test(tabEx)) { const pi2 = pE.indexOf('EXPORTS'); if (pi2 >= 0) { const items = []; for (let k = pi2 + 1; k < pE.length && !/^[A-ZÉÔ &]{4,}$/.test(pE[k]); k++) if (pE[k] !== '•') items.push(pE[k]);
      if (items.length && lc(items.join('')) !== lc(tabEx)) push('trade-list', 'pdf', 'PDF/EconomicsTrade', items.join(', '), `the PDF's exports [${items.join(', ')}] against the tab's pills "${tabEx}"`); }
    const jx = jE.find((l) => /^Exports: /.test(l)); if (jx) { const items = jx.replace(/^Exports: /, '').split(', '); if (lc(items.join('')) !== lc(tabEx)) push('trade-list', 'journal', 'Journal/Economics & Trade', jx, `the journal's exports against the tab's pills "${tabEx}"`); } }
  return res;
}
