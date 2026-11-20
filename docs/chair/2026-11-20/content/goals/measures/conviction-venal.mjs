// The chair's 11:05 count: conviction-cluster wants beside a venal secret (money or goods taken to betray one's own office or
// trade), by size, on the 300 towns; and a cross-tab of PERSONALITY clusters × secret kinds for other flat contradictions.
const [, , L, nA = '50', out] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const KINDS = {
  venal: /embezzl|brib|for a fee|for money|for coin|for a cut|a cut of|payroll|skim|kickback|in exchange for (money|coin|payment|silver|gold)|paid to|takes? (money|payment|coin|silver)|sells? (the |their |stolen|confiscat|seized|inspection|licen|pass|favou)|pocket|graft|lines? (their|his|her) (own )?pocket|falsif\w* .* (fee|pay|coin|money)|on the take|accepts? (gifts|payment|money)|selling (votes|verdicts|licen|passes|offices|favou)/i,
  violence: /murder|killed|kill |ordered what was officially ruled an accident|poison|had .* (killed|drowned|beaten)|let .* die|hanged an innocent|executed an innocent/i,
  faithless: /no longer believes|does not believe|lost (their|his|her) faith|faith is a lie|atheis|doubts? the (gods|faith)/i,
  coward: /fled|ran from|abandoned (their|his|her) (post|comrades|unit)|deserted/i,
};
const kindOf = (s) => Object.entries(KINDS).filter(([, re]) => re.test(s)).map(([k]) => k);
const rows = []; const venalTexts = new Map();
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
  for (const n of t.npcs || []) { const s = typeof n.secret === 'string' ? n.secret : (n.secret?.what || ''); const ks = kindOf(s);
    for (const v of ['short', 'long']) { const it = n.goal?.intent?.[v]; if (it?.family === 'PERSONALITY') rows.push({ size, town: t.name, card: `${n.name} — ${n.title || n.role}`, cluster: it.kind, v, goal: n.goal[v], secret: s, ks }); }
    if (ks.includes('venal')) venalTexts.set(s, (venalTexts.get(s) || 0) + 1);
    rows.cards = (rows.cards || 0) + 1; rows.bySize = rows.bySize || {}; rows.bySize[size] = (rows.bySize[size] || 0) + 1; }
}
const L2 = [];
L2.push(`cards: ${rows.cards} (${SIZES.map((s) => `${s} ${rows.bySize[s]}`).join(', ')})`);
const conv = rows.filter((r) => r.cluster === 'conviction' && r.ks.includes('venal'));
const convCards = new Set(conv.map((r) => r.town + r.card));
L2.push(`\n== conviction want + venal secret: ${convCards.size} cards (1 in ${(rows.cards / Math.max(1, convCards.size)).toFixed(0)}); threshold 1 in 200 = ${(rows.cards / 200).toFixed(1)} cards`);
for (const s of SIZES) L2.push(`  ${s.padEnd(10)} ${new Set(conv.filter((r) => r.size === s).map((r) => r.town + r.card)).size}`);
for (const r of conv.slice(0, 6)) L2.push(`  e.g. ${r.size} ${r.town}: ${r.card} | ${r.v}: ${r.goal} | secret: ${r.secret}`);
L2.push('\n== cross-tab, PERSONALITY cluster × secret kind (holdings)');
const clusters = [...new Set(rows.map((r) => r.cluster))].sort();
L2.push('cluster'.padEnd(20) + Object.keys(KINDS).map((k) => k.padStart(10)).join(''));
for (const c of clusters) L2.push(c.padEnd(20) + Object.keys(KINDS).map((k) => String(rows.filter((r) => r.cluster === c && r.ks.includes(k)).length).padStart(10)).join(''));
L2.push('\n== examples for review (kindness/duty × violence; duty × venal; conviction × faithless; mastery × ...)');
for (const [c, k] of [['kindness', 'violence'], ['duty', 'venal'], ['duty', 'violence'], ['conviction', 'faithless'], ['conviction', 'violence'], ['kindness', 'venal']]) {
  const ex = rows.filter((r) => r.cluster === c && r.ks.includes(k)); L2.push(`-- ${c} × ${k}: ${ex.length}`); for (const r of ex.slice(0, 3)) L2.push(`   ${r.card} | ${r.goal} | ${r.secret}`); }
L2.push('\n== the venal secret rows found (text · cards)');
for (const [s, n] of [...venalTexts].sort((a, b) => b[1] - a[1])) L2.push(`  ${n}  ${s}`);
(await import('node:fs')).writeFileSync(out, L2.join('\n') + '\n');
