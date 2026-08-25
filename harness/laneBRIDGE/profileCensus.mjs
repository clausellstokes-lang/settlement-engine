/**
 * harness/laneBRIDGE/profileCensus.mjs — ⭐ THE RIVER-PROFILE LIVENESS CENSUS + its controls.
 *
 * THE EXIT (ODQ §641.5): min/mean/max width per river with max/min MEANINGFULLY greater than the
 * 1.06 meander-only figure REG-5 measured, and a same-seed double run byte-identical.
 *
 * ⛔ THE CONTROL MATTERS MORE THAN THE FIGURE. A profile derivation that silently returned the
 * nominal width everywhere would publish max/min = 1.000 and read as "not live yet" rather than
 * as broken; a profile that ignored the ground would publish a healthy spread that no measurement
 * could tell from a decoration. So the census carries: (C1) the UNARMED arm must show no profile
 * at all; (C2) a FLATTENED substrate must collapse the ground-read terms; (C3) the same seed twice
 * must agree digit for digit.
 *
 * Usage: node harness/laneBRIDGE/profileCensus.mjs [--controls]
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/instruments/leaf.mjs'));
const { deriveWidthProfile, RIVER_PROFILE } = await import(join(ROOT, 'src/domain/townMap/fabric/waterMode.js'));

/** REG-5's measured meander-only figure — what "no profile" already produced by chord clipping. */
export const MEANDER_ONLY = 1.06;

export function rows(opts) {
  const out = [];
  for (const spec of CORPUS) {
    const f = buildOne(spec, opts).fabric;
    const rel = f.water;
    if (!rel || rel.kind !== 'river' || !rel.line) continue;
    const p = rel.widthProfile || null;
    out.push({
      leaf: spec.key,
      nominal: +rel.width.toFixed(3),
      has: !!p,
      min: p ? +p.min.toFixed(3) : null,
      mean: p ? +p.mean.toFixed(3) : null,
      max: p ? +p.max.toFixed(3) : null,
      ratio: p ? +p.ratio.toFixed(4) : null,
      meanDrift: p ? +(p.mean / rel.width).toFixed(5) : null,
      verts: rel.line.length,
    });
  }
  return out;
}

function table(rs, label) {
  process.stdout.write(`\n── ${label}\n`);
  process.stdout.write('   leaf         nominal    min    mean     max   max/min  mean/nominal  verts\n');
  for (const r of rs) {
    process.stdout.write(`   ${r.leaf.padEnd(12)} ${String(r.nominal).padStart(7)} `
      + `${String(r.min ?? '—').padStart(6)} ${String(r.mean ?? '—').padStart(7)} ${String(r.max ?? '—').padStart(7)} `
      + `${String(r.ratio ?? '—').padStart(9)} ${String(r.meanDrift ?? '—').padStart(13)} ${String(r.verts).padStart(6)}\n`);
  }
  return rs;
}

const armed = table(rows({ riverProfile: true }), 'RIVER PROFILE · ARMED (--river)');
const live = armed.filter((r) => r.has && r.ratio > MEANDER_ONLY);
process.stdout.write(`\n   VERDICT: ${live.length} of ${armed.length} river leaves carry a profile whose spread exceeds`
  + ` the ${MEANDER_ONLY} meander-only figure`
  + `${live.length === armed.length ? ' — EXIT MET' : ' — ⛔ EXIT NOT MET'}\n`);
process.stdout.write(`   constants: ${JSON.stringify(RIVER_PROFILE)}\n`);

if (process.argv.includes('--controls')) {
  process.stdout.write('\n── CONTROLS\n');

  // C1 · the UNARMED arm must carry no profile at all.
  const bare = rows({});
  const anyProfile = bare.filter((r) => r.has).length;
  process.stdout.write(`   C1 · UNARMED: ${anyProfile} of ${bare.length} river leaves carry a profile\n`);
  process.stdout.write(`        → ${anyProfile === 0 ? 'LIVE — the mint is dormant with the flag off' : '⛔ DEAD — the profile leaks into the unarmed arm'}\n`);

  // C2 · a FLAT substrate must collapse the two ground-read terms. The accumulation envelope and
  //      the confinement both go dead on flat, featureless ground; only the meander bend survives,
  //      so the spread must fall well below the armed figure. This is the control that separates
  //      "read from the ground" from "a decoration that looks like a taper".
  const ref = armed[0];
  const { buildOne: b1 } = await import(join(ROOT, 'harness/instruments/leaf.mjs'));
  const spec = CORPUS.find((c) => c.key === ref.leaf);
  const f = b1(spec, { riverProfile: true }).fabric;
  const sub = f.substrate;
  const flat = {
    n: sub.n, cell: sub.cell,
    height: new Float64Array(sub.height.length).fill(0.5),
    flow: new Float64Array(sub.flow.length).fill(0.5),
    slope: sub.slope, wet: sub.wet,
  };
  const flatP = deriveWidthProfile(flat, f.water.line, f.water.width);
  const realP = f.water.widthProfile;
  process.stdout.write(`   C2 · FLAT SUBSTRATE on ${ref.leaf}: spread ${flatP ? flatP.ratio.toFixed(4) : 'null'}`
    + `  vs the real ground's ${realP.ratio.toFixed(4)}\n`);
  const collapsed = flatP && flatP.ratio < realP.ratio * 0.62;
  process.stdout.write(`        → ${collapsed ? 'LIVE — the taper is READ from the ground: flatten it and the spread collapses'
    : '⛔ DEAD — the spread survives a flat substrate, so it is not a reading of anything'}\n`);

  // C3 · determinism, digit for digit.
  const again = rows({ riverProfile: true });
  const drift = again.filter((r, i) => JSON.stringify(r) !== JSON.stringify(armed[i])).length;
  process.stdout.write(`   C3 · SAME-SEED DOUBLE RUN: ${drift} of ${armed.length} rows differ\n`);
  process.stdout.write(`        → ${drift === 0 ? 'LIVE — deterministic' : '⛔ the profile is not deterministic'}\n`);
}
