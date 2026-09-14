import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readStateProse, eligibleVariants, STATE_MARK_DIMENSIONS, poolDimensions } from '../laneSEAM/src/domain/display/stateProse/stateProseKernel.js';
import { composeStateProse, composedPieceOf } from '../laneSEAM/src/domain/display/stateProse/composeStateProse.js';

const LEAF_DIR = join(process.cwd(), 'src/data/dossierStateProse');
const corpus = {};
for (const f of readdirSync(LEAF_DIR).filter((x) => x.endsWith('.generated.js')).sort()) {
  const mod = await import(`file://${join(LEAF_DIR, f)}`);
  const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) {
    if (corpus[block]) throw new Error(`block collision ${block}`);
    corpus[block] = b;
  }
}
const SEEDS = ['', 'a', 'seed-1', 'seed-2', 'town-42', 'zzz'];
let pools = 0; let checks = 0; const drift = [];
for (const [block, b] of Object.entries(corpus)) {
  for (const [key, pool] of Object.entries(b.pools || {})) {
    pools += 1;
    const slots = {};
    for (const v of pool) for (const s of (v.slots || [])) slots[s] = `<${s}>`;
    const dims = {};
    for (const d of poolDimensions(pool)) dims[d] = STATE_MARK_DIMENSIONS[d][0];
    for (const audience of ['dm', 'player']) {
      for (const seed of SEEDS) {
        checks += 1;
        const opts = { slots, seed, audience, dimensions: dims };
        const base = readStateProse(corpus, block, key, opts);
        const got = composeStateProse(corpus, block, { ...opts, spineKey: key, candidates: [], turns: [] });
        if (base === null) { if (got !== null) drift.push(`NULL ${block}::${key}::${audience}::${seed}`); continue; }
        if (got === null) { drift.push(`GOTNULL ${block}::${key}::${audience}::${seed}`); continue; }
        if (got.text !== base.text || got.angle !== base.angle || got.poolKey !== base.poolKey || got.blockId !== base.blockId) {
          drift.push(`TEXT ${block}::${key}::${audience}::${seed}`);
        }
        if (got.pieces.length !== 1 || got.pieces[0].role !== 'spine' || got.pieces[0].key !== key || got.pieces[0].face !== 0) {
          drift.push(`PIECE ${block}::${key}::${audience}::${seed}`);
        }
      }
    }
  }
}
console.log(JSON.stringify({ blocks: Object.keys(corpus).length, pools, checks, drift: drift.slice(0, 10), driftCount: drift.length }, null, 2));
