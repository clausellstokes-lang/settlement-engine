const fs=require("fs");const R="/tmp/claude-0/rw2c/run/";const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const cls=x=>{const k=x.L.kinds||[];if(k.includes("under_siege"))return"siege";if(k.includes("famine"))return"famine";if(k.includes("occupied"))return"occupation";return k.length?"othercrisis":"calm"};
const lc=s=>String(s||"").toLowerCase().replace(/_/g," ");
const byRes={};const rows=[];
for(const x of P){const rec=JSON.parse(fs.readFileSync(R+"tip/records/"+x.seed+".json","utf8"));const ac=rec.economicState.activeChains;const conds=(rec.resourceAnalysis.resourceConditions||[]);
 for(const r of (x.L.exploit.partial||[]).filter(r=>r.moved)){const res=lc(r.r);const w=res.split(" ")[0].replace(/s$/,"");
  const ch=ac.map((c,i)=>({c,i})).filter(({c})=>[c.resourceInputKey,c.resourceKey,c.resource].some(k=>lc(k).includes(w)));
  const exp=(rec.economicState.primaryExports||[]).filter(e=>lc(e).includes(w));
  const cond=conds.filter(c=>lc(c.key).includes(w)||lc(c.label).includes(w)).map(c=>c.condition);
  const chs=ch.map(({c,i})=>c.chainId+":"+c.status+"/"+(x.L.chains[i].shown||"-"));
  const working=ch.some(({i})=>/running|operational|vulnerable|entrepot|magically/.test(x.L.chains[i].shown));
  const k=(working?"chainWorks":ch.length?"chainNotWorking":"noChain")+"+"+(exp.length?"exported":"notExported")+(cond.includes("depleted")?"+DEPLETED":"");
  byRes[res]=byRes[res]||{};byRes[res][k]=(byRes[res][k]||0)+1;rows.push({seed:x.seed,cls:cls(x),kinds:x.L.kinds.join("+"),res,k,chs,exp,cond,local:(rec.economicState.localProduction||[]).filter(e=>lc(e).includes(w))});}}
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/moved-out.json",JSON.stringify({byRes,rows},null,1));
console.log(JSON.stringify(byRes,null,0));const t={};for(const r of rows){t[r.k+" "+r.cls]=(t[r.k+" "+r.cls]||0)+1}console.log(t);
for(const k of ["noChain+notExported","chainNotWorking+notExported","chainNotWorking+exported"])console.log(k,JSON.stringify(rows.filter(r=>r.k.startsWith(k)).slice(0,6)));
console.log("DEPLETED",JSON.stringify(rows.filter(r=>/DEPLETED/.test(r.k)).slice(0,6)));
