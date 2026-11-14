// usage: node magic.js town...  -> magic tab + faith tab + flags + arcane institutions
const fs=require('fs'),z=require('zlib');const R='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/r/tip';
for(const town of process.argv.slice(2)){const pg=fs.readFileSync(`${R}/dumps/${town}.txt`,'utf8').split('\n');
const sec=(h)=>{const i=pg.findIndex(l=>l===`== ${h} ==`);if(i<0)return[];let j=i+1;while(j<pg.length&&!/^== .* ==$/.test(pg[j]))j++;return pg.slice(i+1,j);};
const t=JSON.parse(z.gunzipSync(fs.readFileSync(`${R}/records/${town}.json.gz`)));const f=t.economicState.safetyProfile.flags;
const arc=t.institutions.filter(i=>/wizard|mage|alchem|arcane|magic|sorcer|academy|enchant|scroll|witch|hedge|druid|grove|teleport/i.test(i.name)).map(i=>i.name);
const tem=t.institutions.filter(i=>/temple|church|chapel|shrine|cathedral|monaster|abbey|house of worship|priest|parish/i.test(i.name)).map(i=>i.name);
console.log('#####',town,t.tier,t.population,'heresy',f.heresySuppression,f.heresyIntensity,'mageTheo',f.mageTheocracy,'arcane',JSON.stringify(arc),'temple',JSON.stringify(tem));
console.log(' MAGIC:',sec('Systems/Magic').map(s=>s.slice(0,220)).join(' ¦ '));
console.log(' FAITH:',sec('World/Faith').map(s=>s.slice(0,600)).join(' ¦ '));}
