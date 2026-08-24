/**
 * probeRung.mjs — ⭐ THE RUNG LADDER EXERCISED, INCLUDING THE RUNGS THE CORPUS CANNOT PRODUCE.
 * MEASURED: the sixteen exemplars carry only `palisade` and `citywall` forms, so hf261's rungs 3
 * (bank-and-ditch revetted) and 4 (the narrow curtain) — and with them the whole COURSE-TICK arm —
 * are DARK in the corpus. ⭐ A shape the corpus never produces looks CLEAN, so the rungs are
 * exercised here by fixture, the way `wallForm`'s own material precedence says a dossier states it.
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { renderFolio } from '../renderFolio.mjs';

const CASES = [
  { id: 'palisade', settType: 'town', seed: 'reg2-rung-p1', walls: 'timber palisade' },
  { id: 'bank', settType: 'town', seed: 'reg2-rung-b1', walls: 'earth bank and ditch' },
  { id: 'stone', settType: 'town', seed: 'reg2-rung-s1', walls: 'stone masonry' },
  { id: 'citywall', settType: 'city', seed: 'reg2-rung-c1', walls: 'ashlar' },
];
const h = ['case', 'form', 'rung', 'plate', 'walk', 'core', 'pales', 'courses', 'gate', 'joints', 'gh', 'prim', 'ticks', 'pitch', 'coarsen', 'bands'];
console.log(h.join('\t'));
for (const c of CASES) {
  let s = generateSettlementPipeline({ settType: c.settType }, null, { seed: c.seed });
  s = { ...s, defenseProfile: { ...(s.defenseProfile || {}), walls: c.walls } };
  const model = buildTownMapModel(s, null);
  const fabric = buildFabric(s, model, { rampart: true });
  if (!fabric.walls.length) { console.log(`${c.id}\t(unwalled — the model gave this settlement no circuit)`); continue; }
  const r = fabric.walls[0].rampart;
  const out = renderFolio(fabric, { lens: 'parchment' });
  const sp = out.wallOps.spend;
  console.log([c.id, fabric.walls[0].form, r.rung, r.plate, r.dress.walk, r.dress.core, r.dress.pales,
    r.dress.courses, r.dress.gate, r.joints.length, r.gatehouses.length, out.primitiveCount,
    sp.ticks, sp.tickPitch, sp.tickRung, sp.bands].join('\t'));
}
