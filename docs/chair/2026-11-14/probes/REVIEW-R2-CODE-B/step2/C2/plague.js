const z=require("zlib"),fs=require("fs"); const [f,ctf]=process.argv.slice(2);
const CT=new Map(fs.readFileSync(ctf,"utf8").trim().split("\n").map(l=>{const o=JSON.parse(l);return [o.seed,o.L];})); const t={};
for(const l of z.gunzipSync(fs.readFileSync(f)).toString().split("\n")){ if(!l) continue; const {seed,s}=JSON.parse(l); const L=CT.get(seed)||[];
 const h=L.find(x=>x.startsWith("plague_onset|hook|")); if(!h) continue; const txt=h.split("|hook|")[1];
 const m=txt.match(/^(.*?), the healer who identified the outbreak first,/); let k;
 if(!m) k=/^The healer who identified/.test(txt)?"unfilled":"other:"+txt.slice(0,60);
 else { const n=s.npcs.find(x=>x.name===m[1]); k="filled role="+(n?n.role:"?")+(n&&n.temporary?" TEMP":""); }
 (t[k]=t[k]||[]).push(seed); }
for(const k of Object.keys(t).sort()) console.log(t[k].length,k,t[k].slice(0,3).join(" "));
