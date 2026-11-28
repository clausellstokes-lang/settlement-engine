// node crisislines.mjs <probe tree> <shard> <n> <out.jsonl> — ruling (3): in a forced crisis's births whose own power is
// not on the page, the printed strings that name that power (case-insensitive), by path
import path from 'node:path'; import fs from 'node:fs';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const [shard, n, out] = [+process.argv[3], +process.argv[4], process.argv[5]];
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const FIXED = { under_siege: ['War Council'], wartime: ['War Council'], occupied: ['Occupation Authority'], politically_fractured: ['Loyalist Noble Bloc', 'Reform Noble Bloc', 'Third Bloc (Neutrals)'], indebted: ["Creditor's Representative", 'Crown Creditors (Noble Coalition)'], recently_betrayed: ['The Inquiry'], infiltrated: [], succession_void: ['Noble Claimant (Senior Line)', 'Noble Claimant (Reform Line)'], famine: ['Grain Holders'], plague_onset: ['Quarantine Council'], monster_pressure: ['Monster Hunters / Adventurers'], insurgency: ["Commons' Reform Assembly", "Journeymen's League", "People's Council", 'Loyalist Noble Opposition', "Reform Stewards' Coalition", 'Reform Movement'], mass_migration: ["Newcomers' Settlement", 'Departure Committee'], religious_conversion: ['New Faith Community', 'Reform Congregation', 'Conversion Enforcement Office', 'Underground Old Faith'], slave_revolt: ['Revolt Leadership', 'Abolitionist Network'] };
const ALL = new Set(Object.values(FIXED).flat().concat(['Peace Movement', 'Resistance Network']));
const fd = fs.openSync(out, 'w');
for (const j of (await jobsFor(imp, 'RS')).filter((x) => x.stress).filter((_, i) => i % n === shard)) {
  globalThis.__probe = {};
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  const pushed = (globalThis.__probe.pushed || []).at(-1)?.names || [];
  const own = [...FIXED[j.stress], ...(['politically_fractured', 'infiltrated', 'succession_void'].includes(j.stress) ? pushed.filter((x) => !ALL.has(x)) : [])];
  const onPage = new Set((s.powerStructure?.factions || []).map((f) => f.faction));
  const absent = !own.some((x) => onPage.has(x));
  const hits = []; let strings = 0;
  if (absent) {
    const lower = own.map((x) => x.toLowerCase());
    const walk = (v, p) => { if (typeof v === 'string') { strings++; const l = v.toLowerCase(); const k = lower.find((x) => l.includes(x)); if (k) hits.push([p.replace(/\[\d+\]/g, '[]'), k, v.slice(0, 140)]); } else if (v && typeof v === 'object') for (const key of Object.keys(v)) walk(v[key], `${p}${Array.isArray(v) ? `[${key}]` : `.${key}`}`); };
    walk(s, '');
  }
  fs.writeSync(fd, JSON.stringify({ key: j.key, stress: j.stress, tier: j.tier, absent, own, hits, strings }) + '\n');
}
fs.closeSync(fd);
