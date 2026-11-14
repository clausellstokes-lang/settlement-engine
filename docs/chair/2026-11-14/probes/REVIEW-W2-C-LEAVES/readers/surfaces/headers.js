const fs=require("fs");const R="/tmp/claude-0/rw2c/run/";const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const cls=x=>{const k=x.L.kinds||[];if(k.includes("under_siege"))return"siege";if(k.includes("famine"))return"famine";if(k.includes("occupied"))return"occupation";return k.length?"othercrisis":"calm"};
const res={agree:{},disagree:{}};const ex=[];let groupsBad=0,groupsAll=0,rawMatch=0;
for(const x of P){if(!x.pdf.flowHeaders.length)continue;const rec=JSON.parse(fs.readFileSync(R+"tip/records/"+x.seed+".json","utf8"));
 const ac=rec.economicState.activeChains;let bad=[];
 for(const h of x.pdf.flowHeaders){const n=+h.text.match(/^(\d+)/)[1];const k=+((h.text.match(/· (\d+) impaired/)||[0,0])[1]);
  const idx=ac.map((c,i)=>i).filter(i=>String(ac[i].needLabel).toLowerCase()===h.group.toLowerCase());
  const tabK=idx.filter(i=>x.L.chains[i].shown==="impaired").length, rawK=idx.filter(i=>ac[i].status==="impaired").length;groupsAll++;
  if(idx.length!==n)bad.push(h.group+": count "+n+" vs "+idx.length);
  else if(tabK!==k){bad.push(`${h.group}: PDF "${h.text}" vs tab ${tabK} impaired (raw ${rawK})`);groupsBad++;if(rawK===k)rawMatch++;}}
 const c=cls(x);const ok=!bad.length;res[ok?"agree":"disagree"][c]=(res[ok?"agree":"disagree"][c]||0)+1;if(!ok)ex.push({seed:x.seed,cls:c,kinds:x.L.kinds.join("+"),bad});}
console.log(JSON.stringify(res),"groups",groupsAll,"bad",groupsBad,"pdf=raw",rawMatch);console.log(ex.filter(e=>e.cls!=="siege").slice(0,8).map(e=>JSON.stringify(e)).join("\n"));console.log(ex.filter(e=>e.cls==="siege").slice(0,3).map(e=>JSON.stringify(e)).join("\n"));
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/headers-out.json",JSON.stringify({res,groupsAll,groupsBad,rawMatch,ex},null,1));
