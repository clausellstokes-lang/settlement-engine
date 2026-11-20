// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/MAGIC/measure.mjs "$PWD" [--line] > docs/chair/2026-11-20/content/page/build/MAGIC/measure.out.txt 2>&1
// PAGE-1 MAGIC (F3c), the measure first: are "Reliance on magic" and "Magical Capability" two honest measures, and what
// does each count in the towns where they sit two steps or more apart? The chair's 300 (measureA's recipe: SIZES x 0..49,
// seed `hxd-<size>-<i>`, DEFAULT_CONFIG untouched). With `--line` it also prints the build's line (magicMeasuresApart.js).
const L = process.argv[2];
const WITH_LINE = process.argv.includes('--line');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { deriveMagicReliance } = await import(`${L}/src/domain/magicReliance.js`);
const { deriveMagicRelianceView, deriveMagicSupplyView, magicRowsGated, deriveMagicPosture } = await import(`${L}/src/domain/display/dossierViewModel.js`);
const { scoreBand } = await import(`${L}/src/domain/display/defenseScoreBands.js`);
const { computeEffectiveMagicPresence } = await import(`${L}/src/generators/priorityHelpers.js`);
const apart = WITH_LINE ? await import(`${L}/src/domain/display/magicMeasuresApart.js`) : null;

await loadGenerationLawPayloads();
const RANK_R = { none: 0, present: 1, 'relied-upon': 3, integral: 4 }; // B's scale (f3.out.txt line 2)
const RANK_C = { CRITICAL: 0, WEAK: 1, ADEQUATE: 3, STRONG: 4 };
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
const rows = [];
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const shownRows = magicRowsGated(t, [{ key: 'magicReliance' }, { key: 'magical' }]).map((r) => r.key);
  const view = deriveMagicRelianceView(t);
  const rec = deriveMagicReliance(t);
  const score = Math.min(100, Math.max(0, t.defenseProfile?.scores?.magical || 0));
  const band = scoreBand(score);
  const presence = computeEffectiveMagicPresence(t.institutions || [], { ...t.config, nearbyResources: t.config?.nearbyResources || [] });
  rows.push({ seed, size, t, shownRows, view, rec, score, band, presence, gap: Math.abs(RANK_R[view.reading] - RANK_C[band]) });
}
const both = rows.filter((r) => r.shownRows.includes('magicReliance') && r.shownRows.includes('magical'));
const far = both.filter((r) => r.gap >= 2);
console.log(`TOWNS ${rows.length}; both rows print on the Overview: ${both.length}; two steps or more apart: ${far.length}`);
console.log(`  by size: ${SIZES.map((s) => `${s} ${far.filter((r) => r.size === s).length}/50`).join(' · ')}`);
console.log(`  pairs: ${JSON.stringify(tally(far.map((r) => `${r.view.reading} | ${r.band}`)))}`);
console.log(`  record reading == page reading in the far towns: ${far.filter((r) => r.rec.reading === r.view.reading).length}/${far.length}`);
const relyFar = far.filter((r) => ['relied-upon', 'integral'].includes(r.view.reading));
const divine = relyFar.filter((r) => r.view.dependents.some((d) => /divine/i.test(d)));
console.log(`  relied upon/integral beside Weak/Critical: ${relyFar.length}; of them a divine-healing chain among the dependents: ${divine.length}`);
console.log(`  none/present beside Adequate/Strong: ${far.length - relyFar.length}`);
console.log('');
console.log('WHAT CAPABILITY COUNTS: scores.magical against the magic presence (computeEffectiveMagicPresence) in the far towns');
for (const r of far) console.log(`  ${r.seed}: magical ${r.score} (${r.band}) · presence ${r.presence.score} [${(r.presence.primarySources || []).map((s) => s.name || s).join(', ') || '-'}] · dial ${r.t.config?.priorityMagic} · reliance ${r.view.reading} · deps ${JSON.stringify(r.view.dependents)} · practitioners ${JSON.stringify(r.view.practitioners)} · supply ${JSON.stringify(deriveMagicSupplyView(r.t).supply)}`);
console.log('');
console.log(`THE MAGIC TAB HEADLINE (deriveMagicPosture().display) across the 300: ${JSON.stringify(tally(rows.map((r) => deriveMagicPosture(r.t).display)))}; dial (config.priorityMagic): ${JSON.stringify(tally(rows.map((r) => r.t.config?.priorityMagic)))}`);
if (apart) {
  console.log('');
  const lined = rows.filter((r) => apart.magicMeasuresApartLine(r.t));
  console.log(`THE LINE: ${lined.length} towns carry it; far towns without it: ${far.filter((r) => !apart.magicMeasuresApartLine(r.t)).map((r) => r.seed).join(', ') || 'none'}; lined towns not far: ${lined.filter((r) => !far.includes(r)).map((r) => r.seed).join(', ') || 'none'}`);
  for (const r of lined) console.log(`  ${r.seed}: ${apart.magicMeasuresApartLine(r.t)}`);
  console.log(`  headline caption: ${JSON.stringify(tally(rows.map((r) => apart.magicHeadlineScope(r.t))))}`);
}
