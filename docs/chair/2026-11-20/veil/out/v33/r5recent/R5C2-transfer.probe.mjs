// R5C2's measure (3)(ii): what a served document carries of a transfer (rulingPower.js :: transferRulingPower), on a born
// town whose seat is taken by its strongest other power (a coup), and by a lawful cause; the twin's unmarked share, Reveal off.
const W = '/home/user/wt/r5c/src';
const { generateSettlementPipeline } = await import(`${W}/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${W}/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${W}/store/configSlice.js`);
const veil = await import(`${W}/domain/display/galleryVeil.js`);
const { transferRulingPower } = await import(`${W}/domain/rulingPower.js`);
await loadGenerationLawPayloads();
const clone = (v) => JSON.parse(JSON.stringify(v));
const t = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: 'r5c2-transfer-0', customContent: {} }));
const other = t.powerStructure.factions.find((f) => !f.isGoverning && !f.hidden);
for (const cause of ['coup', 'election']) {
  const { settlement: s, error } = transferRulingPower(clone(t), other.faction, { cause });
  const pub = veil.projectShareVeil(veil.galleryPayloadFor(clone(s), { shareDm: false, memberOverrides: null }), null);
  const ps = pub.powerStructure;
  console.log(cause, 'error', error, '| stored sentence:', s.powerStructure.recentConflict);
  console.log('  served powerStructure keys:', Object.keys(ps).join(','));
  console.log('  served previousGovernments:', JSON.stringify(ps.previousGovernments), '| governingName', ps.governingName);
  console.log('  served rows:', JSON.stringify(ps.factions.map((f) => [f.faction, f.isGoverning === true, f.modifiers])));
}
