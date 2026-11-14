// forcenames.mjs TREE IN: every force-card name (the tab's sources) whose label seam changes it, per town
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { institutionDisplayName } = await import(R+'/domain/display/institutionDisplayName.js');
const { arcaneDefenseOf } = await import(R+'/domain/display/defenseDisplay.js');
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const all={}; const br={};
for await (const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); const inst=s.defenseProfile?.institutions||{};
  const forces=[...(inst.walls||[]),...(inst.garrison||[]),...(inst.militia||[]),...(inst.watch||[]),...(inst.mercenary||[]),...(inst.charter||[]),...arcaneDefenseOf(s)];
  for(const f of forces){ const d=institutionDisplayName(f); if(/\(/.test(f.name)) (br[f.name]??=[]).push(seed); if(d!==f.name) (all[f.name+' -> '+d]??=[]).push(seed+' '+s.tier+' '+s.population+' '+(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type).join('+')); } }
console.log(JSON.stringify({changed:all, bracketed:Object.fromEntries(Object.entries(br).map(([k,v])=>[k,v.length]))},null,1));
