const fs=require("fs");const {leaves,rec,tab}=require("./lib.js");
const fam=JSON.parse(fs.readFileSync("prose-fam.json","utf8"));
const SOLD={timber:/timber|lumber|plank|beam|\blogs?\b|hewn/i,mountain_timber:/timber|lumber|plank|beam|hewn|charcoal/i,wool:/wool|fleece/i,alpine_pasture:/wool|sheep|fleece/i,"animal hides":/hide|fur|pelt/i,"glass sand":/raw sand|sand/i,glass_sand:/raw sand|sand/i,"medicinal herbs":/herb/i,desert_salt:/salt/i,hot_springs_mineral:/mineral salt|healing water|alum|sulfur/i,stone:/stone/i,"iron ore":/iron ore/i,camel_herds:/camel/i,gemstones:/raw gem/i,"gold/silver ore":/ore|precious metal/i};
const LABEL={wool:["wool"],timber:["timber"],"glass sand":["glass sand","glass_sand"],stone:["stone"]};
const res={};
for(const k of ["part:easyHalf","part:worksPart","part:halfFinished"]){res[k]={n:0,f:[],ok:[]};
 for(const r of fam[k]){res[k].n++;const lv=leaves[r.seed];const R=rec(r.seed);const ex=(R.economicState.primaryExports||[]).filter(e=>!/sacred wood|ritual/i.test(e));
  let cards=lv.exploit.partial;
  if(k!=="part:easyHalf"){const nm=r.m[0];const keys=LABEL[nm]||[nm];cards=cards.filter(c=>keys.includes(c.r))}
  const ev=cards.map(c=>({r:c.r,moved:c.moved,needs:c.needs,sold:ex.filter(e=>SOLD[c.r]&&SOLD[c.r].test(e))}));
  const good=ev.filter(e=>e.needs.length>0&&e.sold.length>0);
  const unShown=lv.exploit.unexploited.filter(c=>!c.moved).length;
  const rec_={seed:r.seed,tier:lv.tier,crisis:lv.crisis,s:r.s,ev,unShown,stopped:lv.trade.tradeStopped};
  if(good.length)res[k].ok.push(rec_);else res[k].f.push(rec_)}}
for(const k in res){console.log("##",k,res[k].n,"false",res[k].f.length);for(const x of res[k].f.slice(0,10))console.log(JSON.stringify(x).slice(0,500))}
fs.writeFileSync("part-out.json",JSON.stringify(res,null,1));
