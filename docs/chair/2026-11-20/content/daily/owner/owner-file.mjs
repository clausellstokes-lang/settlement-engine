// DAILY-3 · THE OWNER'S FILE: the Daily Life page's engine lines for six places (one a size), as the page prints them,
// from the tree at <root>. Run it twice, BEFORE on the working line's tip and AFTER on the lane's tip, through the gate
// mutex, and keep both outputs beside this file:
//   sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/daily/owner/owner-file.mjs <root> > <out>
// <root> is an absolute path to a checkout (e.g. a detached worktree of the line; the lane's own checkout). Births are
// M1's recipe (seed `hxd-<size>-0`). The slots printed are the page's own: `dailyLife.js :: DAILY_LIFE_PAGE_SLOTS` where
// that tree exports it (the lane after U4c), else the tab's three of point 95 (dawn_work, gathering_places, child_warnings).
// A slot whose text is empty or the empty marker prints nothing (the page's rule). No audience is passed: a reader's page.
const root = process.argv[2];
if (!root) { console.error('usage: owner-file.mjs <absolute root of a checkout>'); process.exit(2); }
const { generateSettlementPipeline } = await import(`${root}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${root}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${root}/src/store/configSlice.js`);
const dl = await import(`${root}/src/domain/dailyLife.js`);
await loadGenerationLawPayloads();
const slots = dl.DAILY_LIFE_PAGE_SLOTS ?? ['dawn_work', 'gathering_places', 'child_warnings'];
const empty = dl.DAILY_LIFE_EMPTY_SLOT_TEXT ?? '—';
console.log(`# The Daily Life page as it prints, at ${root}\n\nSlots in the page's order: ${slots.join(', ')}.\n`);
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const seed = `hxd-${size}-0`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  console.log(`## ${rec.name} (a ${size}; seed ${seed})\n`);
  const { slots: got } = dl.deriveDailyLife(rec);
  for (const key of slots) {
    const text = typeof got[key]?.text === 'string' ? got[key].text.trim() : '';
    if (text && text !== empty) console.log(`- ${got[key].label}: ${text}`);
  }
  console.log('');
}
