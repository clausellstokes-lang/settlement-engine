/**
 * fabricDigest.mjs — a DETERMINISTIC digest of a published fabric, for the byte-freeze proof.
 * Run: node fabricDigest.mjs <treeRoot> <outJsonPath> [--arm]
 * Emits { key: { digest, walls: [...], meta } } for a fixed fixture set.
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.argv[2];
const OUT = process.argv[3];
const ARM = process.argv.includes('--arm');

const { buildFabric } = await import(join(ROOT, 'src/domain/townMap/fabric/buildFabric.js'));
const { buildTownMapModel } = await import(join(ROOT, 'src/domain/townMap/townMapModel.js'));
const fx = await import(join(ROOT, 'tests/fixtures/townMapFixtures.js'));

/** A total, cycle-safe, key-sorted serialization. Typed arrays go in as their own tag + values. */
function stable(v, seen = new Set()) {
  if (v === null || v === undefined) return String(v);
  const t = typeof v;
  if (t === 'number') return Number.isFinite(v) ? v.toFixed(9) : String(v);
  if (t !== 'object') return JSON.stringify(String(v));
  if (ArrayBuffer.isView(v)) return `TA[${Array.prototype.join.call(v, ',')}]`;
  if (seen.has(v)) return '<cycle>';
  seen.add(v);
  let out;
  if (Array.isArray(v)) out = `[${v.map((x) => stable(x, seen)).join(',')}]`;
  else {
    const keys = Object.keys(v).sort();
    out = `{${keys.map((k) => `${JSON.stringify(k)}:${stable(v[k], seen)}`).join(',')}}`;
  }
  seen.delete(v);
  return out;
}
const sha = (s) => createHash('sha256').update(s).digest('hex');

export const CASES = [
  { key: 'plains',    terrain: 'plains',    seed: 'cliff-plains' },
  { key: 'riverside', terrain: 'riverside', seed: 'cliff-riverside' },
  { key: 'hills',     terrain: 'hills',     seed: 'cliff-hills' },
  { key: 'mountain',  terrain: 'mountain',  seed: 'cliff-mountain' },
  { key: 'fjord',     terrain: 'mountain',  seed: 'cliff-fjord', access: 'port' },
  { key: 'coastal',   terrain: 'coastal',   seed: 'cliff-coastal' },
];

export function fixtureFor(c) {
  return fx.makeWalledFixture({
    _seed: c.seed,
    config: { terrainType: c.terrain, tradeRouteAccess: c.access || 'moderate' },
  });
}

const out = {};
for (const c of CASES) {
  const s = fixtureFor(c);
  const f = buildFabric(s, buildTownMapModel(s, null), ARM ? { cliffTermination: true } : {});
  const text = stable(f);
  out[c.key] = {
    digest: sha(text),
    bytes: text.length,
    wallsDigest: sha(stable(f.walls)),
    walls: (f.walls || []).map((r) => ({
      epoch: r.epoch, poly: r.polygon.length, towers: r.towers.length,
      gates: r.gates.length, runCounts: r.runCounts,
      termini: (r.cliffTermini || []).length,
      segments: r.cliffSegments || 0, dropped: r.cliffDropped || 0, fallbacks: r.cliffFallbacks || 0,
      polyDigest: sha(stable(r.polygon)),
    })),
    inputsHash: f.wallCircuit ? f.wallCircuit.inputsHash : null,
    contentHash: f.wallCircuit ? f.wallCircuit.contentHash : null,
    cliffs: f.cliffs ? { edges: f.cliffs.edges.length, brink: f.cliffs.counts.brink,
      foot: f.cliffs.counts.foot, regions: f.cliffs.regions.length, cragCells: f.cliffs.cragCells,
      impassableCells: f.cliffs.impassableCells, key: f.cliffs.key } : null,
  };
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`wrote ${OUT} (${CASES.length} cases, armed=${ARM})`);
