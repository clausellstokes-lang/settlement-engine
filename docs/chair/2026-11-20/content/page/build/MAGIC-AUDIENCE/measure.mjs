// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/MAGIC-AUDIENCE/measure.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/MAGIC-AUDIENCE/measure.out.txt 2>&1
// PAGE-4 MAGIC-AUDIENCE, point 1 (measure first): for the owner, player and public/shared audiences, does the Magic tab
// print the reliance names (`magicRelyNames`) at all, and does every chain the Overview's line names print on that same
// audience's Magic tab, for the same document?
// The page (src/components/OutputContainer.jsx:711, :732) hands BOTH tabs the same document `s` and the same two flags
// (`publicDossier`, `playerView`); the Magic tab is in the base TABS list, registered for every audience. Neither the
// Magic tab's "· for …" list (MagicTab.jsx: `relyFor`) nor the Overview's line (OverviewTab.jsx: `magicApart`) reads a flag.
// So the audiences differ only by the document each is handed: the owner's and the player view's own record; a public
// gallery page's `toPublicSafe(record)` (src/lib/gallery.js); the veiled reader record (`publicVeiledRecordOf`) too.
// This script reads the two tabs' own gates (no render): the Magic tab prints the names where posture.available &&
// posture.magicExists && reliance.shown && supply.statable && the list is non-empty; the Overview line names them where
// `magicMeasuresApartLine` takes its "leans on magic for" branch.
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { deriveMagicRelianceView, deriveMagicSupplyView, deriveMagicPosture } = await import(`${L}/src/domain/display/dossierViewModel.js`);
const { magicRelyNames, magicMeasuresApartLine } = await import(`${L}/src/domain/display/magicMeasuresApart.js`);
const { toPublicSafe, publicVeiledRecordOf } = await import(`${L}/src/domain/display/publicSafe.js`);

await loadGenerationLawPayloads();
const docs = [];
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  docs.push({ seed, t: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
}
for (const row of censusPlan('r2')) docs.push({ seed: row.seed, t: generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }) });

function tabNames(d) {
  const posture = deriveMagicPosture(d);
  if (!posture.available || !posture.magicExists) return { printed: false, names: [] };
  const rel = deriveMagicRelianceView(d);
  const sup = deriveMagicSupplyView(d);
  if (!(rel.shown && sup.statable)) return { printed: false, names: [] };
  const names = magicRelyNames(d);
  return { printed: names.length > 0, names };
}
function lineNames(d) {
  const line = magicMeasuresApartLine(d);
  if (!line || !/ leans on magic for /.test(line)) return { line, names: [] };
  return { line, names: magicRelyNames(d) };
}
const AUD = {
  owner: (t) => t,
  player: (t) => t,
  'public (toPublicSafe)': (t) => toPublicSafe(t),
  'public (toPublicSafe full)': (t) => toPublicSafe(t, { full: true }),
  'reader (publicVeiledRecordOf)': (t) => publicVeiledRecordOf(t),
};
for (const [aud, project] of Object.entries(AUD)) {
  let tabPrints = 0, lineNamed = 0, breach = 0, anyLine = 0; const breaches = [];
  for (const { seed, t } of docs) {
    const d = project(t);
    const tab = tabNames(d); const ov = lineNames(d);
    if (tab.printed) tabPrints += 1;
    if (ov.line) anyLine += 1;
    if (ov.names.length) lineNamed += 1;
    const tabSet = new Set(tab.names);
    const missing = ov.names.filter((n) => !tab.printed || !tabSet.has(n));
    if (missing.length) { breach += 1; breaches.push(`${seed}: ${JSON.stringify(missing)}`); }
  }
  console.log(`${aud}: docs ${docs.length}; Magic tab prints the reliance names in ${tabPrints}; Overview line in ${anyLine}, naming chains in ${lineNamed}; line names a chain the same audience's Magic tab does not print: ${breach}`);
  for (const b of breaches.slice(0, 20)) console.log(`  ${b}`);
}
