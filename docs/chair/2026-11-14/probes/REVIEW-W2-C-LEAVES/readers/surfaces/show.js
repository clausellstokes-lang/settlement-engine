const fs=require("fs");const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
for(const s of process.argv.slice(2)){const x=P.find(z=>z.seed===s);console.log("#####",s,x.facts.tier,x.facts.pop,x.L.kinds.join("+")||"calm","route",x.L.route);
 console.log(" EXP:",(x.pdf.exports||[]).join(" ; "));console.log(" IMP:",(x.pdf.imports||[]).join(" ; "));console.log(" LOC:",(x.pdf.local||[]).join(" ; "));
 console.log(" recEXP:",(x.facts.exp||[]).join(" ; "));console.log(" recLOC:",(x.facts.loc||[]).join(" ; ").slice(0,300));
 console.log(" CHAINS(pdf state/tab shown):",x.pdf.chains.map((c,i)=>c.name+"="+c.state+"/"+((x.L.chains.find(q=>q.name===c.name)||{}).shown??"?")).join(" | "));
 console.log(" JR chains:",x.jr.chains.map(c=>c.name+"("+c.state+")").join(" "));
 console.log(" EXPLOIT:",x.pdf.exploit.map(g=>g.grp+" "+g.count+": "+g.rows.map(r=>r.r+" » "+r.proc+" » "+r.out+" ["+r.word+"]").join(" ; ")).join(" || "));
 console.log(" GAPS:",x.pdf.gaps.map(g=>g.sev+": "+g.text).join(" ; "));console.log(" CRIME:",x.pdf.crime,"| SUPPORT:",(x.pdf.support||[]).join(" / ").slice(0,250));
 console.log(" roster:",x.facts.inst.join("; ").slice(0,400));}
