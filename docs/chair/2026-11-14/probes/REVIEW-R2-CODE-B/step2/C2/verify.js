const fs=require("fs"); const D="/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-"+process.argv[2]+"/dumps/";
const rows=fs.readFileSync(process.argv[3],"utf8").trim().split("\n").map(JSON.parse);
const tally={}, miss={};
for (const x of rows){ let d; try{ d=fs.readFileSync(D+x.seed+".txt","utf8"); }catch{ continue; } const lines=new Set(d.split("\n").map(s=>s.trim()));
  for (const l of x.L){ const [t,f,...rest]=l.split("|"); let txt=rest.join("|").replace(/ \[TEMP\]$/,""); if(f==="lever"&&txt==="NONE") txt="Nobody here controls what this crisis turns on."; if(f==="cast"&&txt==="nobody") continue;
   const k=f; tally[k]=tally[k]||[0,0]; tally[k][1]++; if(lines.has(txt)) tally[k][0]++; else { (miss[k]=miss[k]||[]).push(x.seed+" :: "+txt.slice(0,160)); } } }
console.log(JSON.stringify(tally)); for (const k in miss) { console.log("MISS",k,miss[k].length); miss[k].slice(0,4).forEach(m=>console.log("   ",m)); }
