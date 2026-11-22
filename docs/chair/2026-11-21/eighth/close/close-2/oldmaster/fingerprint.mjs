// usage: node fingerprint.mjs <tree> <out.json>  -- per row, per leaf family, a hash
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const [tree, outPath] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${tree}/src/generators/generateSettlementPipeline.js`);
const { goldenCorpus, keyOf } = await import(`${tree}/tests/helpers/goldenMasterCorpus.js`);
const FAM = [
  ['arrivalScene', /^\.arrivalScene/], ['safetyDesc', /^\.economicState\.safetyProfile\.safetyDesc/],
  ['pressureSentence', /^\.pressureSentence/], ['conflicts.desc', /^\.(powerStructure\.)?conflicts\[\]\.desc$/],
  ['factionRel.narrative', /^\.powerStructure\.factionRelationships\[\]\.(narrative|dmNote)/],
  ['factions.desc', /^\.powerStructure\.factions\[\]\.desc$/], ['recentConflict', /^\.powerStructure\.recentConflict/],
  ['rel.description', /^\.relationships\[\]\.description/], ['rel.tension', /^\.relationships\[\]\.tension/],
  ['rel.proseVariant', /^\.relationships\[\]\.proseVariant/], ['prominentRel', /^\.prominentRelationship/],
  ['hist.tensions.hooks', /^\.history\.currentTensions\[\]\.plotHooks/], ['hist.tensions.desc', /^\.history\.currentTensions\[\]\.description/],
  ['hist.events.hooks', /^\.history\.historicalEvents\[\]\.plotHooks/], ['npc.goal', /^\.npcs\[\]\.goal/],
  ['npc.secret', /^\.npcs\[\]\.secret/], ['npc.position', /^\.npcs\[\]\.structuralPosition/], ['npc.constraint', /^\.npcs\[\]\.activeConstraint/],
  ['receipt', /^\.generationCoherenceReceipt/],
];
function leaves(x, p, out) {
  if (x && typeof x === 'object') { const isArr = Array.isArray(x); const ks = Object.keys(x);
    if (ks.length === 0) out.push([p, JSON.stringify(x)]);
    for (const k of ks) leaves(x[k], isArr ? `${p}[${k}]` : `${p}.${k}`, out);
  } else out.push([p, JSON.stringify(x)]);
}
const out = {}; const t0 = Date.now();
for (const c of goldenCorpus()) {
  const { _seed, ...cfg } = c;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  const ls = []; leaves(s, '', ls);
  const buckets = {};
  for (const [p, v] of ls) { const n = p.replace(/\[\d+\]/g, '[]'); const f = FAM.find(([, re]) => re.test(n))?.[0] ?? ('other:' + (n.split(/[.[]/)[1] || '')); (buckets[f] ??= []).push(p + '=' + v); }
  const row = { full: createHash('sha256').update(JSON.stringify(s)).digest('hex').slice(0, 16) };
  for (const f in buckets) row[f] = createHash('sha256').update(buckets[f].join('\n')).digest('hex').slice(0, 12);
  out[keyOf(c)] = row;
}
writeFileSync(outPath, JSON.stringify(out));
console.log(`rows=${Object.keys(out).length} secs=${((Date.now() - t0) / 1000).toFixed(1)}`);
