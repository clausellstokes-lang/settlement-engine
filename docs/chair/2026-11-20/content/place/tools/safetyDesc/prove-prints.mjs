// PLACE-1 MEASURE, safetyDesc, section 0: PROVE THE FIELD PRINTS (the chair's rule of 16:25 UTC).
// First render the places through the real OutputContainer (the page census's walker), from the repository root:
//   node docs/chair/2026-11-20/content/tools/confinement/run.mjs <repo> <out> render --workers=3 --seeds=r2r-thorp-0,r2r-town-0,r2r-city-0
// Then, from this directory:   node prove-prints.mjs <repo> <out>/views > out/prove-prints.txt
// For each rendered place: the stored safetyDesc (born again by the same config, `configOf`), and every surface (group/tab) whose
// walked lines hold the whole stored string, else its first sentence.
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
  const sp = t.economicState?.safetyProfile || {};
  const desc = String(sp.safetyDesc || '');
  const first = desc.split(/(?<=[.!?])\s+/)[0];
  const whole = Object.entries(views).filter(([, lines]) => lines.some((l) => l.includes(desc))).map(([k]) => k);
  const firstOnly = Object.entries(views).filter(([, lines]) => lines.some((l) => l.includes(first))).map(([k]) => k);
  console.log(`${seed} (${sp.safetyLabel}): "${desc}"`);
  console.log(`   whole line printed on: ${whole.join(' | ') || 'NONE'}`);
  console.log(`   first sentence printed on: ${firstOnly.join(' | ') || 'NONE'}`);
  console.log(`   surfaces walked: ${Object.keys(views).length}`);
}
