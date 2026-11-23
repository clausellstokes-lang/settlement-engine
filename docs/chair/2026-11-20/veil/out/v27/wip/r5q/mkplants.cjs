const fs=require('fs');
const host=JSON.parse(fs.readFileSync('/var/tmp/v18/m27/r5q/stored/r5q-village-none-0.json','utf8'));
const T=JSON.parse(fs.readFileSync('/var/tmp/v18/m27/r5q/targets.json','utf8'));
const crim=fs.readFileSync('/var/tmp/v18/m27/r5q/twin.jsonl','utf8').trim().split('\n').map(JSON.parse).find(l=>l.seed==='r5q-village-none-0').crim;
const fill=(t)=>t.replace(/\{settlement\}/g,host.name).replace(/\{seat\}/g,host.powerStructure?.government||'council');
const want=['DS-DEF-3 / Safe / v3','DS-DEF-3 / Safe / v8','DS-DEF-3 / Unsafe / v5','DS-DEF-4 / structure semi-organized / v4','DS-DEF-4 / structure semi-organized / v6','DS-DEF-4 / capture none / v2'];
const plants=[];
for(const k of want){const t=T.find(x=>x.key===k); const text=fill(t.text); const s=JSON.parse(JSON.stringify(host)); const b=s.publicProse.blocks; let hits;
 if(k.startsWith('DS-DEF-3')){ b['defense:state'].publicOrder.beside=text; b['defense:state'].publicOrder.rung.sentence=text; b['defense:state'].publicOrder.rung.glance=k.includes('Unsafe')?'Unsafe':'Safe';
   hits=[{key:k,path:'defense:state.publicOrder.beside',text},{key:k,path:'defense:state.publicOrder.rung.sentence',text}]; }
 else if(k.includes('capture')){ b['defense:criminal'].capture={glance:'',sentence:text,detail:[]}; hits=[{key:k,path:'defense:criminal.capture.sentence',text}]; }
 else { b['defense:criminal'].structure.sentence=text; hits=[{key:k,path:'defense:criminal.structure.sentence',text}]; }
 plants.push({seed:'plant:'+k,stored:s,hits,crim});}
fs.writeFileSync('/var/tmp/v18/m27/r5q/plants.json',JSON.stringify(plants));
console.log(plants.map(p=>p.seed+' | '+p.hits[0].text).join('\n'));
