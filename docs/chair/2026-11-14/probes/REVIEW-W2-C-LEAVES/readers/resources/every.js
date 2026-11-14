const fs=require("fs");const {leaves,rec}=require("./lib.js");
const fam=JSON.parse(fs.readFileSync("prose-fam.json","utf8"));
const ST={fish:[/fisher|fishing|landing/i,/fishmonger|fish market/i,/salt/i],livestock:[/butcher/i,/tann/i,/dairy/i],grain:[/\bmills?\b|mill /i,/baker/i],"iron ore":[/mine|miner/i,/smelt/i,/smith/i],"gold/silver ore":[/mine|miner/i,/smelt/i,/goldsmith|jewel/i]};
const KEY={fish:"fish",livestock:"livestock",grain:"grain","iron ore":"iron ore","gold/silver ore":"gold/silver ore"};
const out=[];
for(const k of ["full:everyStage","full:builtOn"])for(const r of fam[k]){const lv=leaves[r.seed];const R=rec(r.seed);
 let X=k==="full:everyStage"?r.m[0]:null;
 const fulls=lv.exploit.full.map(c=>c.r);
 const xs=X?[X]:fulls;
 const ev=xs.map(x=>{const st=ST[x]||[];const miss=st.filter(re=>!lv.roster.some(n=>re.test(n))).map(String);
   const card=lv.exploit.full.find(c=>c.r===x);return {x,miss,cardNeeds:card?card.needs:"NOFULLCARD",chains:lv.chains.filter(c=>new RegExp(x.split(" ")[0],"i").test(c.id+" "+c.input)).map(c=>c.id+":"+c.raw)}});
 out.push({k,seed:r.seed,tier:lv.tier,crisis:lv.crisis,stopped:lv.trade.tradeStopped,s:r.s,ev,inc:R.economicState.incomeSources.map(i=>i.source+" "+i.percentage).slice(0,3)});
}
for(const o of out.filter(o=>o.k==="full:everyStage"))console.log(o.seed,o.tier,o.crisis.join(),o.stopped?"STOPPED":"",JSON.stringify(o.ev));
fs.writeFileSync("every-out.json",JSON.stringify(out,null,1));
