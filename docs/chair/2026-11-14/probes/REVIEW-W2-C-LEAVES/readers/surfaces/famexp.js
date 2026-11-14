const fs=require("fs");const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const J=fs.readFileSync("/tmp/claude-0/rw2c/run/fam-surf/other-Economics & Trade.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse).filter(r=>/Exports/.test(r.line));const JS=new Set(J.map(r=>r.seed));
const RE={fish:/fish|catch|seafood/i,livestock:/livestock|sheep|cattle|game meat|^meat/i,grain:/grain|flour|bread|baked|meal\b/i};
const all=[],nw=[];
for(const x of P){if(!x.L.kinds.includes("famine"))continue;const rec=JSON.parse(fs.readFileSync("/tmp/claude-0/rw2c/run/tip/records/"+x.seed+".json","utf8"));const fs0=(JSON.stringify(rec).match(/"failedSource":"([^"]*)"/)||[])[1];if(!fs0||!RE[fs0])continue;
 const hit=(x.pdf.exports||[]).filter(e=>RE[fs0].test(e)&&!/\(transit\)/.test(e));if(!hit.length)continue;
 const o={seed:x.seed,failedSource:fs0,exports:hit,newJournalRow:JS.has(x.seed),tabChains:x.L.chains.filter(c=>c.outsShown.some(q=>hit.includes(q))).map(c=>c.id+":"+c.raw+"/"+c.shown)};all.push(o);if(o.newJournalRow)nw.push(o)}
console.log("famine towns exporting failed food",all.length,"new journal rows",nw.length);console.log(nw.map(o=>JSON.stringify(o)).join("\n"));
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/famexp-out.json",JSON.stringify({all,nw},null,1));
