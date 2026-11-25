const fs=require("fs");const Z=["thorp","hamlet","village","town","city","metropolis"];
const run=(c)=>{const t=JSON.parse(fs.readFileSync(process.argv[2]+"/"+c+"/counted.json","utf8"));const res={};const over=[];
for(const z of Z){const slots=t[z].slots.filter(s=>s.holders>=5);let o={WORDING:0,FURNITURE:0};let n={WORDING:0,FURNITURE:0};
 for(const s of slots){const fam=/^(STATE|NARRATIVE)/.test(s.cls)?"WORDING":"FURNITURE";n[fam]++;const one=s.perPlace<=1.5;const reading=one?s.topN/150:s.seen;const bar=one?0.15:0.30;
  if(reading>bar){o[fam]++;if(fam==="WORDING")over.push({z,key:s.key.slice(0,110),reading:+reading.toFixed(2),bar,top:String(s.top).slice(0,90),cls:s.cls})}}
 res[z]={n,o}}
console.log(c+": wording slots over the bar / counted, by size; furniture (labels, catalogue names) over / counted");
for(const z of Z)console.log("  "+z.padEnd(11)+"wording "+String(res[z].o.WORDING).padStart(3)+" / "+String(res[z].n.WORDING).padStart(3)+"    furniture "+String(res[z].o.FURNITURE).padStart(3)+" / "+String(res[z].n.FURNITURE).padStart(3));
over.sort((a,b)=>b.reading-a.reading);fs.writeFileSync(process.argv[2]+"/over-"+c+".json",JSON.stringify(over,null,1));
const byKey={};for(const x of over){(byKey[x.key]||={sizes:[],max:0,top:x.top,cls:x.cls,bar:x.bar});byKey[x.key].sizes.push(x.z.slice(0,3)+" "+x.reading);byKey[x.key].max=Math.max(byKey[x.key].max,x.reading)}
const ks=Object.entries(byKey).sort((a,b)=>b[1].max-a[1].max);console.log("  distinct wording slots over the bar: "+ks.length);for(const[k,v]of ks.slice(0,14))console.log("   "+v.max.toFixed(2)+" (bar "+v.bar+") "+k+" | "+v.sizes.join(",")+" | \""+v.top+"\"");};
run("C");run("V");
