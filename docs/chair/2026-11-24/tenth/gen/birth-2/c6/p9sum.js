const rows=require("fs").readFileSync(process.argv[2],"utf8").trim().split("\n").map(JSON.parse);
const Z=["thorp","hamlet","village","town","city","metropolis"];const t={};const land={};const sc={};const ex=[];const settledBand={};
for(const r of rows){const key=(String(r.beasts).match(/poolKey":"([^"]+)/)||[])[1]||"(no line)";
 if(r.family==="settled"){const k=r.band+" | "+key.replace("Beasts & Monsters: ","");(t[k]||={})[r.size]=((t[k]||{})[r.size]||0)+1;
  if(/settled/.test(key)&&(r.band==="CRITICAL"||r.band==="WEAK")){land[r.terrain]=(land[r.terrain]||0)+1;sc[r.monster]=(sc[r.monster]||0)+1;if(ex.length<3)ex.push(r.seed+" "+r.terrain+" score "+r.monster)}}}
console.log(process.argv[3],"settled-country births by band | line, by size (thorp..metropolis)");
for(const[k,v]of Object.entries(t).sort())console.log(" ",k.padEnd(52),Z.map(z=>String(v[z]||0).padStart(4)).join(""),"  all",Z.reduce((n,z)=>n+(v[z]||0),0));
console.log("  P9 lands",JSON.stringify(land));console.log("  P9 scores",JSON.stringify(sc));console.log("  ex",ex.join("; "));
