/**
 * probeFusion.mjs — the fabric-side reading of REG-1's fusion, per leaf.
 * Run from the tree root: node harness/laneREG1/probeFusion.mjs [key ...]
 */
import { CORPUS, buildOne } from '../exemplars.mjs';

const want = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const rows = [];
for (const spec of CORPUS) {
  if (want.length && want.indexOf(spec.key) < 0) continue;
  const { fabric } = buildOne(spec, { frontageFusion: true });
  const f = fabric.fusion;
  const c = f.counts;
  const covered = c.eligibleParcels ? c.fusedParcels / c.eligibleParcels : 0;
  rows.push({
    key: spec.key, tier: fabric.meta.tier, parcels: fabric.parcels.length,
    eligible: c.eligibleParcels, runs: c.runs, groups: c.groups, fused: c.fusedParcels,
    coveredPct: Math.round(covered * 1000) / 10,
    perGroup: c.groups ? Math.round((c.fusedParcels / c.groups) * 100) / 100 : 0,
    largest: c.largestGroup, partyLines: c.partyLines, frontEdges: c.frontEdges,
    brokeNonParty: c.brokeNonParty, brokeSeq: c.brokeSeq, brokeAlley: c.brokeAlley,
    brokeDerelict: c.brokeDerelict, brokeGable: c.brokeGable, brokeShape: c.brokeShape,
  });
}
const cols = Object.keys(rows[0]);
process.stdout.write(`${cols.map((c) => c.padStart(c === 'key' ? 12 : 9)).join(' ')}\n`);
for (const r of rows) {
  process.stdout.write(`${cols.map((c) => String(r[c]).padStart(c === 'key' ? 12 : 9)).join(' ')}\n`);
}
process.stdout.write('PROBE_FUSION_DONE\n');
