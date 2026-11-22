// RUN (repo root): node docs/chair/2026-11-20/content/page/build/SIDES-LISTS/towns.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/SIDES-LISTS/towns.out.txt 2>&1
// PAGE-13, unit 4's list (render only): over the chair's 300 (`hxd-<size>-0..49`, DEFAULT_CONFIG), the towns where some live
// tension's sides AS SHOWN (`tensionShown.js :: tensionSidesShown`) differ from its stored words (capitalised), i.e. the
// towns SIDES moves on every surface that prints a side; per size; and each change by kind, stored -> shown.
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { tensionSidesShown } = await import(`${L}/src/domain/display/tensionShown.js`);
await loadGenerationLawPayloads();
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const moved = []; const bySize = {}; const kinds = new Map();
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  const doc = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const names = new Set((doc?.powerStructure?.factions || []).map((f) => f?.faction));
  let m = false;
  for (const t of doc?.history?.currentTensions || []) {
    const stored = (t.factions || []).filter((s) => typeof s === 'string' && s.trim()).map(String);
    const shown = tensionSidesShown(doc, t);
    if (JSON.stringify(shown) === JSON.stringify(stored.map(cap))) continue;
    m = true;
    const k = `${t.type}: [${stored.map((s) => (names.has(s) ? '<power>' : s)).join(' | ')}] -> [${shown.map((s) => (names.has(s) ? '<power>' : s)).join(' | ')}]`;
    kinds.set(k, (kinds.get(k) || 0) + 1);
  }
  if (m) { moved.push(seed); bySize[size] = (bySize[size] || 0) + 1; }
}
console.log(`MOVED ${moved.length} of 300; by size ${JSON.stringify(bySize)}`);
console.log(`TOWNS ${moved.join(' ')}`);
for (const [k, n] of [...kinds].sort((a, b) => b[1] - a[1])) console.log(`${String(n).padStart(4)} ${k}`);
