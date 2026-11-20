// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/SIDES/pinCause.mjs "$PWD" <reader-bytes vitest log> > docs/chair/2026-11-20/content/page/build/SIDES/pinCause.out.txt 2>&1
// PAGE-9 SIDES: the cause of the reader-bytes pin's moves (tests/ui/safetyReaderBytes.test.jsx). Over the chair's 300, the
// towns where some tension's sides AS SHOWN (tensionSidesShown) differ from its stored words byte for byte; compared with
// the towns the pin reports moved (read from the vitest log's `+   "hxd-… <surface>"` lines). Equal sets: the sides are
// the whole cause.
import { readFileSync } from 'node:fs';
const [L, log] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { tensionSidesShown } = await import(`${L}/src/domain/display/tensionShown.js`);
await loadGenerationLawPayloads();
const moved = new Set([...readFileSync(log, 'utf-8').matchAll(/^\+ {3}"(hxd-[a-z]+-\d+) /gm)].map((m) => m[1]));
const changed = new Set();
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  const doc = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  for (const t of doc?.history?.currentTensions || []) {
    if (JSON.stringify(tensionSidesShown(doc, t)) !== JSON.stringify(t.factions || [])) { changed.add(seed); break; }
  }
}
const onlyMoved = [...moved].filter((s) => !changed.has(s));
const onlyChanged = [...changed].filter((s) => !moved.has(s));
console.log(`MOVED ${moved.size} SIDES-CHANGED ${changed.size} moved-not-changed ${onlyMoved.length} ${JSON.stringify(onlyMoved)} changed-not-moved ${onlyChanged.length} ${JSON.stringify(onlyChanged)}`);
