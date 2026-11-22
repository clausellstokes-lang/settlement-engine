// node f8page.mjs <tree> <which> <shard> <nshards> <out.jsonl> — F8's page check: wherever the hall's state is not clean
// ('none'), does the game master's page (patronage.js :: dmPowerViewOf(s).hall.line, the Power tab's DM panel and the
// PDF's DM chapter) name the house the hall answers to? A name counts when it is a power on the roster or an
// institution of the town; the fallback words "the criminal houses" name none.
import path from 'node:path'; import fs from 'node:fs';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const [which, shard, nshards, out] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { dmPowerViewOf } = await imp('src/domain/people/patronage.js');
const { hallCaptureOf } = await imp('src/domain/people/hallCapture.js');
const { nameOf } = await imp('src/domain/rulingPower.js');
await loadGenerationLawPayloads();
const jobs = (await jobsFor(imp, which)).filter((_, i) => i % nshards === shard);
const fd = fs.openSync(out, 'w');
for (const j of jobs) {
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  const state = s.powerStructure?.criminalCaptureState ?? null;
  const v = dmPowerViewOf(s); const hall = v?.hall || null; const h = hallCaptureOf(s);
  const powers = (s.powerStructure?.factions || []).map((f) => nameOf(f)).filter(Boolean);
  const insts = (s.institutions || []).map((i) => i?.name).filter(Boolean);
  const line = hall?.line || '';
  const candidates = [...new Set([...h.agents.map((a) => a.guild), h.underworld, h.rulerCriminal ? h.ruler : null].filter(Boolean))];
  const named = candidates.filter((n) => line.includes(n) && (powers.includes(n) || insts.includes(n)));
  fs.writeSync(fd, JSON.stringify({ key: j.key, c: j.c, tier: j.tier, stress: j.stress, state, rung: hall?.rung ?? null, line, view: !!v,
    agents: h.agents.map((a) => [a.rank, a.guild]), underworld: h.underworld, rulerCriminal: h.rulerCriminal, ruler: h.ruler, named,
    fallback: line.includes('the criminal houses') }) + '\n');
}
fs.closeSync(fd);
