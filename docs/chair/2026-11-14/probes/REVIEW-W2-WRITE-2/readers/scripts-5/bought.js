const {rec,L,crises}=require("./lib");
const PROD={salt:[/salt works|salt pan|saltern/i,/^salt$|salt/i],iron:[/smelter|iron mine|\bmine\b|bloomer/i,/^iron$/i],grain:[/farmland|subsistence farming|grain fields/i,/^grain$/i],"medicinal herbs":[/herbalist|herb garden|apothecary/i,/^medicinal herbs$/i],herbs:[/herbalist|herb garden/i,/herb/i],stone:[/quarry/i,/^stone$/i],wool:[/shepherd|sheep|grazing/i,/^wool$/i],"incense and votive candles":[/chandler|candle/i,/candle|incense/i],"replacement arms and basic equipment":[/blacksmith|smith|armorer|weaponsmith/i,/weapon|arms/i],"quality weapons and armour":[/armorer|weaponsmith|swordsmith/i,/weapons? and armou?r/i],"paper materials":[/paper/i,/paper/i]};
module.exports=(i,re)=>L[i].prints.map(p=>{const t=rec(p.town);const pr=(p.page[0]||{}).printed||"";const m=re.exec(pr);const g=m&&m[1];
 const names=t.institutions.map(x=>x.name);const lp=t.economicState.localProduction||[];const P=PROD[g];
 const houses=P?names.filter(n=>P[0].test(n)):[];const lps=P?lp.filter(v=>P[1].test(v)):lp.filter(v=>v.toLowerCase()===String(g));
 const row=(t.economicState.primaryImports||[]).find(x=>x.toLowerCase().startsWith(String(g).toLowerCase()));
 return {town:p.town,tier:p.tier,cr:crises(t),g,houses,lps,row,pr};});
if(require.main===module){const i=+process.argv[2];const re=i===19?/brings in (.+) from outside/:/gets its (.+) and you/;const rows=module.exports(i,re);
const f=rows.filter(r=>r.houses.length||r.lps.length);console.log(L[i].id,"n",rows.length,"withLocalSource",f.length);f.forEach(r=>console.log("  ",r.town,r.tier,r.cr.join("+"),r.g,"houses="+JSON.stringify(r.houses),"lp="+JSON.stringify(r.lps),"row="+r.row));}
