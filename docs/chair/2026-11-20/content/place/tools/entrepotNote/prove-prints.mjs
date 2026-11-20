// PLACE-1 MEASURE, entrepotNote, section 0: PROVE THE FIELD PRINTS (the chair's rule of 16:25 UTC).
// Adapted from ../safetyDesc/prove-prints.mjs. First render (from the repository root):
//   DM:     node docs/chair/2026-11-20/content/tools/confinement/run.mjs <repo> <dm> render --workers=2 --seeds=r2r-town-3,r2r-city-2
//   player: node docs/chair/2026-11-20/content/place/tools/safetyDesc/render-player.mjs <repo> <pl> r2r-town-3,r2r-city-2
// Then: node prove-prints.mjs <repo> <dm>/views > out/prove-prints.dm.txt ; and <pl>/views > out/prove-prints.player.txt
// For each rendered place: every chain holding an entrepotNote (born again by the same config), whether it passes
// EconomicsTab's gate (entrepot && entrepotNote && !dependency), and every surface whose walked lines hold the note.
import fs from 'node:fs';
const [, , L, VIEWS] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { configOf, censusPlan } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const plan = censusPlan('r2');
for (const f of fs.readdirSync(VIEWS).filter((x) => x.endsWith('.json')).sort()) {
  const { seed, views } = JSON.parse(fs.readFileSync(`${VIEWS}/${f}`, 'utf8'));
  const row = plan.find((r) => r.seed === seed);
  const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
  console.log(`${seed}: surfaces walked ${Object.keys(views).length}`);
  for (const c of (t.economicState?.activeChains || []).filter((x) => x.entrepotNote)) {
    const note = String(c.entrepotNote);
    const on = Object.entries(views).filter(([, lines]) => lines.some((l) => l.includes(note))).map(([k]) => k);
    console.log(`   ${c.chainId || c.id} (entrepot ${!!c.entrepot}, dependency ${!!c.dependency}, status ${c.status}): "${note.slice(0, 90)}…"`);
    console.log(`      printed on: ${on.join(' | ') || 'NONE'}`);
  }
}
