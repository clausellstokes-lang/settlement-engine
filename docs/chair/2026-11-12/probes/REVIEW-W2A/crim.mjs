import fs from 'node:fs';
const {town}=await import(process.env.S+'/tools/probe2.mjs');
for(const s of fs.readFileSync(process.env.S+'/cold/seeds40.txt','utf8').trim().split('\n')){ const t=town(s); const ps=t.powerStructure||{};
 const crim=(ps.factions||[]).filter(f=>f.category==='criminal'||/thiev|crim|smugg|gang/i.test(f.faction||''));
 const ops=JSON.stringify(t).match(/"(criminalOperations|criminalOps|operations)":\[[^\]]{0,150}/);
 console.log(s.padEnd(34), String(ps.criminalCaptureState).padEnd(12),'bmc',t.economicState?.safetyProfile?.blackMarketCapture, 'crim:',crim.map(f=>`${f.faction}(${Math.round(f.power)}${f.isGoverning?',GOV':''})`).join('; '), ops?ops[0].slice(0,120):'');
}
