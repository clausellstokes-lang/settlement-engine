import { readFileSync, readdirSync } from 'node:fs';
const P = await import('/home/user/wt/meas/tests/security/personIdBijection.shared.mjs');
const SITES = new Set(['npcs[].id','powerStructure.factions[].members[].id','factions[].members[].id','npcs[].goal.intent.short.target.id','npcs[].goal.intent.long.target.id','npcs[].allegiance.handler',...['from','to','npc1Id','npc2Id','id'].map(k=>`relationships[].${k}`),...['from','to','npc1Id','npc2Id','targetId','npcId','id'].map(k=>`npcs[].relationships[].${k}`),...['stress','stress[]','stressors','stressors[]'].flatMap(c=>[`${c}.cast.roles[].id`,`${c}.cast.levers[].holderId`]),'simulationTrace[].targetId','simulationTrace[].downstreamEffects[].target']);
const dir = process.argv[2]; const out = {}; let docs = 0, ids = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('index'))) {
  const d = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')); docs++;
  const hits = P.storedIdsServed([d, null], d); ids += hits.length;
  for (const h of hits) { const m = /^\[0\](.*?) = /s.exec(h); if (!m) continue; const n = m[1].replace(/^\./, '').replace(/\[\d+\]/g, '[]'); const e = (out[n] ||= { count: 0, docs: new Set(), ex: h.slice(0, 160) }); e.count++; e.docs.add(f); }
}
console.log(`documents ${docs}; stored-id occurrences ${ids}`);
for (const [p, e] of Object.entries(out).sort((a, b) => b[1].count - a[1].count)) console.log(`${SITES.has(p) ? 'SITE ' : 'OFF-SITE '} ${p}: ${e.count} in ${e.docs.size}; e.g. ${e.ex}`);
