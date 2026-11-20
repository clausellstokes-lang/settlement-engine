import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync('census.json', 'utf8'));
const [, , size, minSeen = '0.10', minHolders = '10'] = process.argv;
const drop = /^(simulationTrace|generationCoherenceReceipt|availableServices|institutions\[\]\.(name|category|key|family)|economicState\.(compound|safetyProfile\.compound|activeChains\[\]\.(processingInstitutions|outputs|label|chainId)|institutionalServices|primaryExports|primaryImports|tradeDependencies\[\]\.(resource|institution)|activeChains\[\]\.dependency\.institution)|npcs\[\]\.(role|title|institution|memberships|category|factionAffiliation)|relationships\[\]\.(npc1Role|npc2Role)|config|debug|coherence|spatialLayout\.quarters\[\]\.(name|location))/;
const rows = r[size].filter((x) => x.holders >= +minHolders && x.seen >= +minSeen && !drop.test(x.path)).sort((a, b) => b.seen - a.seen);
console.log(`== ${size}: ${rows.length} narrative or card paths with a second place repeating >= ${(+minSeen * 100).toFixed(0)}%`);
for (const x of rows) console.log(`${(x.seen * 100).toFixed(0).padStart(3)}% | top ${String(x.topN).padStart(2)}/${String(x.holders).padEnd(2)} | ${String(x.distinct).padStart(4)} distinct | ${String(x.perPlace).padStart(5)}/place | ${x.path} :: "${x.top.slice(0, 84)}"`);
