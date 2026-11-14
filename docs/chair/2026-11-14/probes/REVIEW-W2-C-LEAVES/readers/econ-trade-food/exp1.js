const {leaves,lines,rec}=require("./lib");
const strip=p=>p.replace(/ \((transit|naval route only|taxed by occupation)\)/g,"").trim();
const res={};const nochain={};
for(const l of lines){if(!l.fam.startsWith("TRADE-PILLS"))continue;const L=leaves.get(l.seed);if(L.trade.exports.join("")!==l.line)continue;const r=rec(l.seed);
 for(const p of L.trade.exports){const g=strip(p).toLowerCase();const ch=L.chains.filter(c=>c.outputs.some(o=>o.toLowerCase()===g));
  const st=ch.map(c=>c.id+":"+(c.shown||c.raw)+(c.entrepot?"(E)":""));
  const works=ch.some(c=>/running|vulnerable|operational|entrepot|magically/.test(c.shown||c.raw));
  const k=strip(p);res[k]=res[k]||{works:0,notworking:[],nochain:[]};
  if(!ch.length)res[k].nochain.push(l.seed);else if(works)res[k].works++;else res[k].notworking.push(l.seed+" "+st.join(","));}}
for(const k in res){const o=res[k];if(o.nochain.length||o.notworking.length)console.log(k,"works",o.works,"nochain",o.nochain.length,o.nochain.slice(0,3).join(" "),"| notworking",o.notworking.length,o.notworking.slice(0,3).join(" ; "))}
