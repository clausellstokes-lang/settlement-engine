/**
 * harness/laneREG5/quayOne.mjs — one leaf's quay figures, as JSON, in a FRESH process.
 *
 * ⚠ THE CHILD PROCESS IS THE POINT. A planted control that edits a source file cannot be
 * measured in the process that already imported it: ESM caches the module graph, so the parent
 * would re-measure the code it loaded before the plant and report a DEAD control on a live cure.
 * Every arm of C1 therefore runs here, in a process that starts after the plant lands.
 *
 * Usage: node quayOne.mjs --seed=… --tier=… --terrain=… [--arm]
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { buildTownMapModel } = await import(join(ROOT, 'src/domain/townMap/townMapModel.js'));
const { buildFabric } = await import(join(ROOT, 'src/domain/townMap/fabric/buildFabric.js'));

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const cfg = { settType: arg('tier', 'town') };
const terrain = arg('terrain', null);
if (terrain) cfg.terrainOverride = terrain;
const settlement = generateSettlementPipeline(cfg, null, { seed: arg('seed', 'reg5-quay-01') });
const model = buildTownMapModel(settlement, null);
const fabric = buildFabric(settlement, model, process.argv.includes('--arm') ? { waterfrontExemption: true } : {});
const quays = (fabric.landmarks || []).filter((lm) => lm && lm.archetype === 'port');
const piersOf = (lm) => (Array.isArray(lm.solids) ? lm.solids.filter((s) => s && s.length >= 3).length : 0);
process.stdout.write(JSON.stringify({
  quays: quays.length,
  drawn: quays.filter((q) => piersOf(q) > 0).length,
  piers: quays.reduce((a, q) => a + piersOf(q), 0),
  moored: quays.filter((q) => q.fronts === 'water').length,
  exempt: fabric.ground ? (fabric.ground.waterfrontExempt || 0) : 0,
}));
