const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";
const L=fs.readFileSync(B+"fam-all/defense-magic.jsonl","utf8").trim().split("\n").map(JSON.parse);
const fam=process.argv[2];
const seeds=[...new Set(L.filter(r=>r.fam===fam).map(r=>r.seed))];
const LAW=/court|prison|gaol|jail|magistr|justice|judge|bailiff|sheriff|stocks|pillory|moot|tribunal|assize|lockup|dungeon(?! delving)/i;
const out=[];
for(const s of seeds){const rec=JSON.parse(fs.readFileSync(B+"tip/records/"+s+".json"));
 const ros=rec.institutions.map(i=>i.name).filter(n=>LAW.test(n));
 const sv=[];for(const[k,arr]of Object.entries(rec.availableServices||{}))for(const x of arr||[]){const t=(x.name||"")+" "+(x.desc||"");if(LAW.test(t))sv.push(x.name+"@"+x.institution)}
 const np=rec.npcs.filter(n=>LAW.test((n.role||"")+" "+(n.title||""))).map(n=>n.role+"/"+n.title);
 const page=fs.readFileSync(B+"tip/dumps/"+s+".txt","utf8").split("\n");
 const pl=page.filter(l=>/\bcourt|tried|hearing|magistrat|gaol|cells|prison|\bjudge|lockup|stocks/i.test(l)&&!/Legal Infrastructure/.test(l));
 out.push({s,tier:rec.tier,pop:rec.population,crisis:(rec.stress||[]).map?((rec.stress||[]).map(x=>x.type||x.id||x).join(",")):JSON.stringify(rec.stress).slice(0,60),gov:rec.powerStructure.factions.filter(f=>f.isGoverning).map(f=>f.category+":"+f.name).join(","),ros,sv,np,pl:pl.map(l=>l.slice(0,200))});
}
if(process.argv[3]==="full")console.log(JSON.stringify(out,null,1));else{
 for(const o of out)console.log(o.s,o.tier,o.pop,"ros:",o.ros.join("|"),"sv:",o.sv.length,"np:",o.np.join("|"),"pageCourt:",o.pl.length);}
