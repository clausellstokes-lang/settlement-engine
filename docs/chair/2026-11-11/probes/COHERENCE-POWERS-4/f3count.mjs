// node f3count.mjs <tree> <which> <shard> <nshards> <out.jsonl> — F3's class, per succession birth: (a) a claimant power
// ('Noble Claimant (…)') with no first on the page; (b) the old families' body (a pool-named noble power the succession
// pushes) with no first while a landed power's member who leads none stands; the seat row's text; plus every card id and
// the roster, so the move can be read as births under a succession crisis only.
import path from 'node:path'; import fs from 'node:fs'; import { createHash } from 'node:crypto';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const [which, shard, nshards, out] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { nameOf } = await imp('src/domain/rulingPower.js');
const { rulingChainOf } = await imp('src/domain/dossier/powerStrata.js');
const { leaderlessLineOf, stressPowerRowOf } = await imp('src/domain/people/stressPowerFaces.js');
await loadGenerationLawPayloads();
const LANDED = ['Noble Families', 'Noble Houses', 'Landed Gentry', 'Manor Household'];
const jobs = (await jobsFor(imp, which)).filter((_, i) => i % nshards === shard);
const fd = fs.openSync(out, 'w');
for (const j of jobs) {
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  const npcs = s.npcs || [];
  const leads = (c) => (c.memberships || []).some((m) => m.rank === 1);
  const firstOf = (n) => npcs.find((c) => (c.memberships || []).some((m) => m.power === n && m.rank === 1)) || null;
  const succ = [].concat(s.stress || []).some((x) => x?.type === 'succession_void');
  const claimants = []; const bodies = [];
  for (const f of s.powerStructure?.factions || []) {
    const n = nameOf(f); const row = stressPowerRowOf(s, f);
    if (!row || row.stress !== 'succession_void') continue;
    const first = firstOf(n);
    if (/claimant/i.test(n)) claimants.push({ n, first: first ? `${first.name} · ${first.title}` : null, line: leaderlessLineOf(s, n) });
    else {
      const free = npcs.filter((c) => (c.memberships || []).some((m) => LANDED.includes(m.power)) && !leads(c)).map((c) => c.name);
      bodies.push({ n, first: first ? `${first.name} · ${first.title}` : null, line: leaderlessLineOf(s, n), free });
    }
  }
  const ch = rulingChainOf(s);
  fs.writeSync(fd, JSON.stringify({ key: j.key, c: j.c, tier: j.tier, stress: j.stress, succ, claimants, bodies,
    seat: ch.npc ? ch.npc.name : (ch.absence?.line || null),
    cards: npcs.map((c) => [c.id, c.name, c.title]).map((x) => x.join('|')), roster: (s.powerStructure?.factions || []).map((f) => nameOf(f)),
    hash: createHash('sha256').update(JSON.stringify(s)).digest('hex') }) + '\n');
}
fs.closeSync(fd);
