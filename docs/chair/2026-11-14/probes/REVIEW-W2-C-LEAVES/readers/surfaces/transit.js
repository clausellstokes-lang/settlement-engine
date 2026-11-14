const fs=require("fs");const R="/tmp/claude-0/rw2c/run/";const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const cls=x=>{const k=x.L.kinds||[];if(k.includes("under_siege"))return"siege";if(k.includes("famine"))return"famine";if(k.includes("occupied"))return"occupation";return k.length?"othercrisis":"calm"};
const f=s=>String(s).toLowerCase();
const stats={};const bad=[];const chainIds={};
for(const x of P){
  const goods=[...(x.pdf.exports||[])].filter(g=>/\(transit\)/.test(g));
  for(const g of goods){const label=g.replace(/\s*\((transit|naval route only|taxed by occupation)\)/g,"").trim();
    const storedTransit=(x.facts.exp||[]).some(e=>/\(transit\)/.test(e)&&f(e).startsWith(f(label)));
    const makers=x.facts.chains.filter(c=>(c.outputs||[]).some(o=>f(o)===f(label)));
    const rec=JSON.parse(fs.readFileSync(R+"tip/records/"+x.seed+".json","utf8"));
    const ac=rec.economicState.activeChains.filter(c=>(c.outputs||[]).some(o=>f(o)===f(label)));
    const entre=ac.filter(c=>c.entrepot===true), nonEntre=ac.filter(c=>c.entrepot!==true);
    const local=(x.facts.loc||[]).some(l=>f(l)===f(label));
    for(const c of ac)chainIds[label+"<-"+c.chainId+(c.entrepot?"[E]":"")+":"+c.status]=(chainIds[label+"<-"+c.chainId+(c.entrepot?"[E]":"")+":"+c.status]||0)+1;
    const k=label;stats[k]=stats[k]||{n:0,stored:0,entreOnly:0,madeHere:0,local:0,none:0,byCls:{}};const S=stats[k];S.n++;S.byCls[cls(x)]=(S.byCls[cls(x)]||0)+1;
    if(storedTransit)S.stored++;
    if(entre.length&&!nonEntre.length)S.entreOnly++;
    if(nonEntre.length){S.madeHere++;bad.push({seed:x.seed,g,why:"non-entrepot chain outputs it",chains:nonEntre.map(c=>c.chainId+":"+c.status+":"+c.processingInstitutions.join("/"))})}
    if(local){S.local++;bad.push({seed:x.seed,g,why:"in record localProduction"})}
    if(!ac.length&&!storedTransit){S.none++;bad.push({seed:x.seed,g,why:"no chain carries it, not stored transit"})}
    if(x.L.kinds.includes("under_siege"))bad.push({seed:x.seed,g,why:"under siege"});
  }
}
console.log(JSON.stringify(stats,null,0));console.log(chainIds);console.log(bad.length,JSON.stringify(bad.slice(0,15),null,0));
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/transit-out.json",JSON.stringify({stats,bad},null,1));
