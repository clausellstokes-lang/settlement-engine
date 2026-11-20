// PLACE-1 MEASURE, viabilityHooks, section 0: PROVE THE FIELD PRINTS (the chair's rule of 16:25 UTC).
// Adapted from ../entrepotNote/prove-prints.mjs. First render (from the repository root):
//   DM:     node docs/chair/2026-11-20/content/tools/confinement/run.mjs <repo> <dm> render --workers=2 --seeds=r2r-town-3,r2r-town-5,r2r-village-4
//   player: node docs/chair/2026-11-20/content/place/tools/safetyDesc/render-player.mjs <repo> <pl> r2r-town-3,r2r-town-5,r2r-village-4
// Then: node prove-prints.mjs <repo> <dm>/views > out/prove-prints.dm.txt ; and <pl>/views > out/prove-prints.player.txt
// For each rendered place: every stored economicViability.plotHooks[].hook (born again by the same config), the text the
// one collector every printer reads gives it (`domain/dossier/plotHooks.js :: collectPlotHooks`, its truth gate
// `speakHookTruthfully` may re-speak a stored line), and every walked surface whose lines hold that text. The PDF
// (`pdf/lib/viewModel.js`, its hooks slice) and the session sheet (`components/session/SessionMode.jsx`,
// `domain/summary/tonightSheet.js`) print the same collector's text; their lines are listed beside.
import fs from 'node:fs';
const [, , L, VIEWS] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { configOf, censusPlan } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { collectPlotHooks } = await import(`${L}/src/domain/dossier/plotHooks.js`);
const { buildViewModel } = await import(`${L}/src/pdf/lib/viewModel.js`).catch((e) => ({ buildViewModel: null, err: e }));
await loadGenerationLawPayloads();
const plan = censusPlan('r2');
for (const f of fs.readdirSync(VIEWS).filter((x) => x.endsWith('.json')).sort()) {
  const { seed, views } = JSON.parse(fs.readFileSync(`${VIEWS}/${f}`, 'utf8'));
  const row = plan.find((r) => r.seed === seed);
  if (!row) continue;
  const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
  const collected = collectPlotHooks(t).filter((h) => h.category === 'economics');
  console.log(`${seed}: surfaces walked ${Object.keys(views).length}; collector's economics hooks ${collected.length}`);
  for (const h of t.economicViability?.plotHooks || []) {
    const stored = String(h.hook);
    const head = stored.split(/(?<=[.!?;:])\s+/)[0].slice(0, 60);
    const said = collected.find((c) => c.text === stored || c.text.startsWith(head))?.text ?? null;
    const on = said ? Object.entries(views).filter(([, lines]) => lines.some((l) => l.includes(said))).map(([k]) => k) : [];
    console.log(`   [${h.category} / ${h.severity}] stored: "${stored}"`);
    console.log(`      collector says: ${said === null ? 'NOTHING (refused or folded)' : said === stored ? 'the stored string, unchanged' : `"${said}"`}`);
    console.log(`      printed on: ${on.join(' | ') || 'NONE'}`);
    if (said !== null && buildViewModel) {
      let pdf = 'ERR';
      try { pdf = (buildViewModel({ settlement: t }).hooks?.all || []).some((x) => x.hook === said) ? 'yes' : 'no'; } catch (e) { pdf = `ERR ${e.message}`; }
      console.log(`      in the PDF view model's Plot Hooks chapter (pdf/lib/viewModel.js, hooks.all): ${pdf}`);
    }
  }
}
