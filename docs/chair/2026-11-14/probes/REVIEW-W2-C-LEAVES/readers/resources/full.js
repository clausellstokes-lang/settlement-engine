const fs=require("fs");const {leaves,rec,tab}=require("./lib.js");
const fam=JSON.parse(fs.readFileSync("prose-fam.json","utf8"));
const RK={fish:"fish",grain:"grain",livestock:"livestock","gold/silver ore":"gold/silver ore",clay:"clay",timber:"timber","iron ore":"iron ore"};
const GW={"preserved fish":/salted fish|smoked|preserved fish|dried fish/i,bread:/bread|baked/i,"leather goods":/leather/i,jewelry:/jewel/i,pottery:/potter/i,furniture:/furniture/i};
const out=[];
for(const r of fam["full:allWay"]){const lv=leaves[r.seed];const R=rec(r.seed);const [X,H,G]=r.m;
 const hRe=new RegExp(H.replace(/s$/,"").slice(0,6),"i");
 const onRoster=lv.roster.filter(n=>hRe.test(n));
 const ex=(R.economicState.primaryExports||[]).filter(e=>GW[G]?GW[G].test(e):new RegExp(G,"i").test(e));
 const card=lv.exploit.full.find(c=>c.r===X);
 const chains=lv.chains.filter(c=>c.houses.some(h=>hRe.test(h))||(c.outputs||[]).some(o=>GW[G]&&GW[G].test(o))).map(c=>c.id+":"+c.raw);
 out.push({seed:r.seed,tier:lv.tier,crisis:lv.crisis,stopped:lv.trade.tradeStopped,X,H,G,onRoster,ex,chains,card:card&&card.needs});
}
const c={};for(const o of out){const k=o.X+"|"+o.H+"|"+o.G;c[k]=c[k]||{n:0,noH:0,noG:0,stop:0};c[k].n++;if(!o.onRoster.length)c[k].noH++;if(!o.ex.length)c[k].noG++;if(o.stopped)c[k].stop++}
console.log(c);
for(const o of out.filter(o=>!o.onRoster.length||!o.ex.length||o.stopped))console.log(JSON.stringify(o));
fs.writeFileSync("full-out.json",JSON.stringify(out,null,1));
