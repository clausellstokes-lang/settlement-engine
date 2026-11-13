const fs=require("fs");const tipRed=new Set(fs.readFileSync("tip-red-files.txt","utf8").trim().split("\n"));
const rel=(n)=>n.replace(/^.*\/scratchpad\/(tip|prev|base)\//,"");
const load=(files)=>{const m=new Map();for(const f of files){if(!fs.existsSync(f))continue;for(const r of require("./"+f).testResults){const file=rel(r.name);const fails=r.assertionResults.filter(a=>a.status==="failed");
 if(r.status!=="passed"&&!fails.length) m.set(file+" :: (suite error)",String(r.message).replace(/\/[^ ]*\/scratchpad\/(tip|prev|base)\//g,"<T>/").replace(/\s+/g," ").slice(0,4000));
 for(const a of fails) m.set(file+" :: "+a.fullName,String(a.failureMessages?.[0]||"").replace(/\x1b\[[0-9;]*m/g,"").replace(/\/[^ ]*\/scratchpad\/(tip|prev|base)\//g,"<T>/").replace(/:\d+:\d+/g,"").replace(/\s+/g," ").slice(0,4000));}}return m;};
const T=load(["shard1.json","shard2.json","shard3.json"]),P=load(["class-prev.json"]),B=load(["class-base.json"]);const haveB=fs.existsSync("class-base.json");
const rows=[];for(const [k,msg] of T){const p=P.has(k),b=B.has(k);let cls=p&&b?"carried (4114 and base)":p?"carried from 4114 only (red at 4114, green at base)":b?"red at base, green at 4114, red again":"NEW at the tip";if(!haveB&&!p)cls="NEW vs 4114 (base not yet run)";
 const same=p? (P.get(k)===msg?"same message":"message differs"):"";rows.push([cls,k,same,msg]);}
rows.sort();for(const r of rows) console.log(r[0]+" | "+r[1].slice(0,200)+" | "+r[2]+(process.argv[2]?" | "+r[3].slice(0,260):""));
const c={};for(const r of rows)c[r[0]]=(c[r[0]]||0)+1;console.log(JSON.stringify(c),"tip reds",T.size,"prev reds",P.size,"base reds",B.size);
