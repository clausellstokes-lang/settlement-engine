const {L,leaves,rec,tab}=require("./lib.js");
const SP={
 timber:{h:/woodcut|sawmill|carpent|lumber|logg|charcoal|cooper|shipwright|woodcarv|bowyer|forester|joiner|wheelwright/i,x:/timber|lumber|plank|\bbeams?\b|hardwood|charcoal|\blogs?\b|furniture/i},
 stone:{h:/quarr|mason|stonecut|stonework/i,x:/stone|marble|granite|slate|quarr/i},
 "medicinal herbs":{h:/apothec|herbal|alchem|physician|healer|hospital|infirmar/i,x:/herb|remed|potion|medicin|elixir|salve|tincture/i},
};
const rows=L.filter(r=>/^No one here works the/.test(r.line));
const res=[];
for(const r of rows){const X=r.line.match(/works the (.+) near/)[1];const sp=SP[X];const lv=leaves[r.seed];const R=rec(r.seed);
 const houses=(R.institutions||[]).map(i=>i.name).filter(n=>sp.h.test(n));
 const ex=(R.economicState.primaryExports||[]).filter(x=>sp.x.test(x)&&!/sacred wood/i.test(x));
 const chains=lv.chains.filter(c=>sp.x.test([c.input,c.resource,...(c.outputs||[])].join(" "))||c.houses.some(h=>sp.h.test(h))).map(c=>c.id+":"+c.raw);
 const econ=tab(r.seed,"Systems/Economics");
 const inc=(R.economicState.incomeSources||[]).filter(i=>sp.x.test(i.source+" "+i.desc)).map(i=>i.source+" "+i.percentage+"%");
 const loc=lv.trade.local.filter(x=>sp.x.test(x));
 const unworkedLine=econ.filter(l=>new RegExp(X,"i").test(l)).map(l=>l.slice(0,160));
 res.push({seed:r.seed,X,tier:lv.tier,crisis:lv.crisis,houses,ex,chains,inc,loc,econ:unworkedLine});
}
require("fs").writeFileSync("gaps-out.json",JSON.stringify(res,null,1));
const by={};for(const x of res){const k=x.X;by[k]=by[k]||{n:0,f:[]};by[k].n++;if(x.houses.length||x.ex.length||x.chains.length||x.loc.length||x.inc.length)by[k].f.push(x)}
for(const k in by){console.log("##",k,by[k].n,by[k].f.length);for(const x of by[k].f)console.log(JSON.stringify(x).slice(0,600))}
