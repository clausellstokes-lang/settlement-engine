// K1b: per birth, the founding set (deriveFoundingTraditions), the shown set (shownTraditionsOf) and the shared rows
// (sharedTraditionRowsOf), as born (0.10.0), re-stamped 0.9.0, and with the stamp stripped; and the same for the
// record's JSON-imported copy (`_seed` dropped). Hashes and the founding names. Births only, no render.
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { deriveFoundingTraditions } from 'TREE/src/domain/traditions/genesis.js';
import { shownTraditionsOf, sharedTraditionRowsOf } from 'TREE/src/domain/traditions/shownTraditions.js';
import { appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const h = (v) => createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0, 16);
const clone = (v) => JSON.parse(JSON.stringify(v));
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const of = (s) => { let shared = null; try { shared = sharedTraditionRowsOf(s); } catch (e) { shared = `ERR ${String(e).slice(0, 80)}`; }
      const f = deriveFoundingTraditions(s); return { f: h(f), names: f.map((r) => r.name), shown: h(shownTraditionsOf(s, [])), shared: h(shared) }; };
    const old = { ...clone(born), generatorVersion: '0.9.0' };
    const bare = clone(born); delete bare.generatorVersion;
    const copy = clone(born); delete copy._seed; if (copy.config) delete copy.config._seed; delete copy._config;
    appendFileSync(out, `${JSON.stringify({ seed: row.seed, gv: born.generatorVersion, mirror: Array.isArray(born.traditions) ? born.traditions.length : null, born: of(born), old: of(old), bare: of(bare), copy: of(copy) })}\n`);
  }
}
