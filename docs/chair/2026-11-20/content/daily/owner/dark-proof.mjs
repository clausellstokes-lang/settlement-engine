// DAILY-4 · THE DARK PROOF for rule 8 (COMMON-EIGHTH 14): M1's 900 births (150 a size, seeds hxd-<size>-0..149, M1's
// recipe) at the tree <root>, each record JSON.stringify'd, the 900 joined by "\n" and hashed (sha256). Run it on the
// working line's tip and on the lane's tip, each through the gate mutex; EQUAL hashes mean no born record moved.
//   sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/daily/owner/dark-proof.mjs <abs root> > <out>
// Prints the count, the hash, and per size the hash of that size's 150 (to localize a difference).
import { createHash } from 'node:crypto';
const root = process.argv[2];
if (!root) { console.error('usage: dark-proof.mjs <absolute root of a checkout>'); process.exit(2); }
const { generateSettlementPipeline } = await import(`${root}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${root}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${root}/src/store/configSlice.js`);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const all = createHash('sha256');
let count = 0;
const bySize = [];
for (const size of SIZES) {
  const h = createHash('sha256');
  for (let i = 0; i < 150; i++) {
    const seed = `hxd-${size}-${i}`;
    const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const s = JSON.stringify(rec) + '\n';
    all.update(s); h.update(s); count++;
  }
  bySize.push(`${size} ${h.digest('hex')}`);
}
console.log(`DARK-PROOF root=${root} births=${count} sha256=${all.digest('hex')}`);
for (const l of bySize) console.log(`  ${l}`);
