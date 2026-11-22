/**
 * RUN (from the repository root, through the mutex, to the out file): sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/daily/measures/B3/L8/thorps.l8.mjs "$PWD" > docs/chair/2026-11-20/content/daily/measures/B3/L8/thorps.l8.out.txt 2>&1
 * DAILY-3 B3 L8, the chair's E95 (2): every thorp of M1's 150 where office: lord's steward holds, one JSON row each: L12 printed,
 * the steward house absent by the rule book's reader, the governing row and its formKindOf, powerStructure.government and
 * governingName, the shared document's governing row, the Power tab's ruling chain (powerStrata.js :: rulingChainOf), the
 * governance line (governanceAccount.js :: governanceAccountOf), sovereign, and the roster's office-like houses. Read only.
 */
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLife } = await import(`${L}/src/domain/dailyLife.js`);
const { governingFactionOf, nameOf } = await import(`${L}/src/domain/rulingPower.js`);
const { formKindOf } = await import(`${L}/src/domain/seat/seatTable.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { REGISTERED_WORDS } = await import(`${L}/src/domain/facts/registeredWords.js`);
const { liveInstitutionNames } = await import(`${L}/src/domain/facts/liveInstitutionNames.js`);
const { toPublicSafe } = await import(`${L}/src/domain/display/publicSafe.js`);
const { rulingChainOf } = await import(`${L}/src/domain/dossier/powerStrata.js`);
const { governanceAccountOf } = await import(`${L}/src/domain/display/governanceAccount.js`);
await loadGenerationLawPayloads();
const L12 = "The lord's steward is obeyed, but not much liked.";
for (let i = 0; i < 150; i++) {
  const seed = `hxd-thorp-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'thorp' }), null, { seed, customContent: {} });
  const f = factsOf(rec);
  if (!f.office["lord's steward"]) continue;
  const text = deriveDailyLife(rec).slots.commoner_resentments.text;
  const g = governingFactionOf(rec);
  const houseAbsent = REGISTERED_WORDS["house: lord's steward"].absent(f, liveInstitutionNames(rec), rec);
  const pg = governingFactionOf(toPublicSafe(rec));
  console.log(JSON.stringify({ seed, L12: text.includes(L12), houseAbsent, row: nameOf(g), isGoverning: g?.isGoverning === true, formKindOf: formKindOf(nameOf(g)),
    government: rec.powerStructure?.government, governingName: rec.powerStructure?.governingName, governmentDesc: rec.powerStructure?.governmentDescription ?? rec.powerStructure?.governmentDesc ?? null,
    sharedRow: nameOf(pg), powerTab: { name: rulingChainOf(rec).power?.name ?? null, government: rulingChainOf(rec).power?.government ?? null }, governanceLine: governanceAccountOf(rec)?.text ?? null, sovereign: f.sovereign, roster: liveInstitutionNames(rec).filter((n) => /steward|lord|manor|reeve|headman|elder/i.test(n)) }));
}
