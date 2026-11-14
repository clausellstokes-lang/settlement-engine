const fs=require("fs");const R="/tmp/claude-0/rw2c/run/";const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const famL=fs.readFileSync(R+"fam-surf/pdf.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse).filter(r=>/^No one here works|^Work on the timber/.test(r.line));
const H={stone:/quarr|mason|stonecut|stonework/i,timber:/woodcut|sawmill|lumber|logging|forester|charcoal|carpenter/i,"medicinal herbs":/herb|apothec|alchem|forag/i};
const G={stone:/stone|quarr/i,timber:/forest|timber|wood|grove/i,"medicinal herbs":/herb|forag|grove|marsh|spring/i};
const EXP={stone:/stone|marble|granite|slate/i,timber:/timber|lumber|plank|wood|beams|charcoal/i,"medicinal herbs":/herb|remed|potion/i};
const res={};const bad=[];
for(const r of famL){const x=P.find(z=>z.seed===r.seed);const rec=JSON.parse(fs.readFileSync(R+"tip/records/"+r.seed+".json","utf8"));
 let res0=(r.line.match(/works the (.+?) near/)||[])[1]||"timber(halfway)";const key=res0.replace("(halfway)","");
 const inst=x.facts.inst.filter(n=>!/^access to/i.test(n));const hs=inst.filter(n=>(H[key]||/$^/).test(n));
 const ch=x.L.chains.filter(c=>(G[key]||/$^/).test(String(c.input))&&/running|operational|vulnerable|entrepot|magically/.test(c.shown));
 const ex=(rec.economicState.primaryExports||[]).filter(e=>(EXP[key]||/$^/).test(e));
 const conds=(rec.resourceAnalysis.resourceConditions||[]).filter(c=>(G[key]||/$^/).test(c.key)).map(c=>c.key+"="+c.condition);
 const k=res0;res[k]=res[k]||{n:0,houses:0,chains:0,exports:0};res[k].n++;if(hs.length)res[k].houses++;if(ch.length)res[k].chains++;if(ex.length)res[k].exports++;
 if(hs.length||ch.length||ex.length)bad.push({seed:r.seed,line:r.line,houses:hs,chains:ch.map(c=>c.id+"("+c.input+"):"+c.shown),exports:ex,conds,kinds:x.L.kinds.join("+")});}
console.log(res);console.log(bad.length);for(const b of bad.slice(0,30))console.log(JSON.stringify(b));
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/gaps-out.json",JSON.stringify({res,bad},null,1));
