// DAILY-4 preview for the chair's E110: the six places (one a size) with the eight public slots in the ruled order,
// and the owner-only line after the public resentment (owner's read only). M1's births, seed hxd-<size>-0.
const root = process.argv[2];
const { generateSettlementPipeline } = await import(`${root}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${root}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${root}/src/store/configSlice.js`);
const dl = await import(`${root}/src/domain/dailyLife.js`);
await loadGenerationLawPayloads();
const ORDER = ['outsider_impressions', 'dawn_work', 'food_culture', 'gathering_places', 'child_warnings', 'commoner_resentments', 'unspoken_topics', 'recent_changes'];
const empty = dl.DAILY_LIFE_EMPTY_SLOT_TEXT ?? '—';
const t = (s) => (typeof s?.text === 'string' ? s.text.trim() : '');
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const seed = `hxd-${size}-0`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const pub = dl.deriveDailyLife(rec).slots;
  const own = dl.deriveDailyLife(rec, { audience: 'owner' }).slots;
  console.log(`## ${rec.name} (a ${size}; seed ${seed})\n`);
  for (const k of ORDER) {
    const x = t(pub[k]);
    if (x && x !== empty) console.log(`- ${pub[k].label}: ${x}`);
    if (k === 'commoner_resentments') { const d = t(own.commoner_resentments_dm); if (d && d !== empty) console.log(`- [owner only] ${own.commoner_resentments_dm.label}: ${d}`); }
  }
  console.log('');
}
