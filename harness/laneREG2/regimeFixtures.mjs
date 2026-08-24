/**
 * regimeFixtures.mjs — ⭐⭐⭐ REG-2 EXIT LEG 1 (A2.1 BLOCKER 1's repair): the §575 regime
 * derivation fired over N **GENERATED** fixture settlements, coin-flip-proof BY FIXTURE IDENTITY.
 *
 * ⛔ THE CORPUS NEVER APPEARS HERE, and that is the amendment's own instruction: REG-2's original
 * corpus-derivation exit was STRUCK as a structural-truth use of the corpus. Every seed below is
 * minted for this check and belongs to no exemplar.
 *
 * ⭐ THE FIXTURES ASSERT DOSSIER FACTS THE WAY A USER WOULD ASSERT THEM — the `forcePort`/
 * `forceCrossing` discipline — never a regime, never a threshold. What is being tested is that
 * the DERIVATION reads them, so handing it its own answer would test nothing.
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';

const N = Number((process.argv.find((a) => a.startsWith('--n=')) || '--n=10').slice(4));

/** Seeds minted for this check. None is an exemplar seed. */
const seedsOf = (tag) => Array.from({ length: N }, (_, i) => `reg2-${tag}-${i + 1}`);

const GARRISON = seedsOf('garrison').map((seed, i) => ({
  id: `garrison/${seed}`, want: 'clear', seed,
  settType: i % 2 ? 'city' : 'town',
  // A garrison town: a war is on, and the dossier says the ground is a frontier posture.
  apply: (s) => ({
    ...s,
    stressors: [i % 3 === 0 ? 'under_siege' : i % 3 === 1 ? 'border_raids' : 'monster_pressure'],
    defenseProfile: { ...(s.defenseProfile || {}), defensiveTerrain: 'fortified frontier march' },
  }),
}));

const PEACE = seedsOf('peace').map((seed, i) => ({
  id: `peace/${seed}`, want: 'tangent', seed,
  settType: i % 2 ? 'city' : 'town',
  // A long-peaceful, prosperous town: no war on the record, a sheltered posture, and a purse.
  apply: (s) => ({
    ...s,
    stressors: null,
    defenseProfile: { ...(s.defenseProfile || {}), defensiveTerrain: 'sheltered inland vale' },
    economicState: { ...(s.economicState || {}), prosperity: 'wealthy' },
  }),
}));

const rows = [];
for (const f of GARRISON.concat(PEACE)) {
  let s = generateSettlementPipeline({ settType: f.settType }, null, { seed: f.seed });
  s = f.apply(s);
  const model = buildTownMapModel(s, null);
  const fabric = buildFabric(s, model, { rampart: true });
  const reg = fabric.meta.bandRegime;
  rows.push({
    id: f.id, tier: fabric.meta.tier, walled: fabric.walls.length > 0,
    want: f.want, got: reg ? reg.regime : '(no wall)',
    mil: reg ? reg.military : null, peace: reg ? reg.peace : null,
    inputs: reg ? reg.inputs : null,
    ok: reg ? reg.regime === f.want : null,
  });
}

const h = ['id', 'tier', 'walled', 'want', 'got', 'mil', 'peace', 'ok'];
console.log(h.join('\t'));
for (const r of rows) console.log(h.map((k) => r[k]).join('\t'));

const scored = rows.filter((r) => r.ok !== null);
const right = scored.filter((r) => r.ok).length;
const clear = scored.filter((r) => r.got === 'clear').length;
const tangent = scored.filter((r) => r.got === 'tangent').length;
console.log(`\nSCORED ${scored.length} of ${rows.length} fixtures (unwalled ones cannot carry a regime and are excluded).`);
console.log(`CORRECT BY FIXTURE IDENTITY: ${right}/${scored.length}`);
console.log(`COUNTS — clear ${clear}, tangent ${tangent} (the exit requires BOTH > 0)`);
console.log(`COIN-FLIP PROBABILITY of ${right}/${scored.length} by chance: 2^-${scored.length} = ${(2 ** -scored.length).toExponential(2)}`);
if (right !== scored.length) {
  console.log('\nMISSES:');
  for (const r of scored.filter((x) => !x.ok)) console.log(`  ${r.id}: want ${r.want} got ${r.got} — ${JSON.stringify(r.inputs)}`);
}
