const M = await import('/home/user/wt/base/scripts/sameness-census.mjs');
const KEYS = ['web:Systems/Outlook | ViabilityTab.0.0.1.0.0.1', 'pdf:canon_dossier | SettlementPDF.12 > ViabilityAssessment > PageChrome.1.3 > Callout.2.0 > EditableProse', 'pdf:draft_brief | SettlementPDF.12 > ViabilityAssessment > PageChrome.1.3 > Callout.2.0 > EditableProse'];
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const k of KEYS) {
  const a = M.measureSlots(M.readSize(process.argv[2], size)).get(k), b = M.measureSlots(M.readSize(process.argv[3], size)).get(k);
  console.log(size, k.split(' | ')[0], 'base', a?.shareAll, '→ e13a', b?.shareAll, '| top', JSON.stringify(b?.sentence ?? '').slice(0, 90));
}
