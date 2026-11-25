// WORDS-2 · E13 STEP ONE (RULING G31 (2)): the 14 slots the sameness door refused, read with the door's own measureSlots over a
// --measure render (hxd, 150 a size, at the base). A MEASURE. Usage (from the base tree): node e13-slots.mjs <render dir>
const M = await import('/home/user/wt/base/scripts/sameness-census.mjs');
const DIR = process.argv[2];
const W = [['hamlet','web:Systems/Outlook | ViabilityTab.0.0.1.0.0.1'],['hamlet','web:World/NPCs | NPCsTab.0.0.1.0 > InfoPill.1.0.1'],['hamlet','pdf:canon_dossier | SettlementPDF.12 > ViabilityAssessment > PageChrome.1.3 > Callout.2.0 > EditableProse'],
 ['town','pdf:canon_dossier | SettlementPDF.13 > NPCQuickRef > PageChrome.1.4.0.* > NPCRow.0.1'],['town','pdf:canon_dossier | SettlementPDF.14 > NotableNPCs > PageChrome.1.3.1.* > FullCard.0.0.1'],
 ['city','pdf:canon_dossier | SettlementPDF.13 > NPCQuickRef > PageChrome.1.4.0.* > NPCRow.0.1'],['city','pdf:canon_dossier | SettlementPDF.14 > NotableNPCs > PageChrome.1.3.1.* > FullCard.0.0.1'],
 ['metropolis','pdf:canon_dossier | SettlementPDF.13 > NPCQuickRef > PageChrome.1.4.1.* > NPCRow.0.1']];
for (const [size, key] of W) {
  const rows = M.readSize(DIR, size); const m = M.measureSlots(rows).get(key);
  if (!m) { console.log('MISSING', size, key); continue; }
  // top three sentences by places
  const by = new Map();
  for (const [i, row] of rows.entries()) { const [surface, pos] = key.split(' | '); for (const line of row.surfaces[surface] || []) if (M.positionOf(surface, line) === key) for (const s of line[0].split(/(?<=[.!?…])\s+(?=[A-Z"#])/)) { (by.get(s) || by.set(s, new Set()).get(s)).add(i); } }
  const top3 = [...by].map(([s, st]) => [s, st.size]).sort((a, b) => b[1] - a[1]).slice(0, 3);
  console.log(`== ${size} TOP «${m.sentence}» ${key.slice(0, 95)}\n   places ${m.places}/${m.of} distinct ${m.distinct} perPlace ${m.perPlace} shareAll ${m.shareAll} seen ${m.seen}\n   paths ${JSON.stringify(m.paths).slice(0, 200)}`);
  for (const [s, n] of top3) console.log(`   ${n}× ${s.slice(0, 150)}`);
}
