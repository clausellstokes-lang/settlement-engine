// usage: node ctx.js "<fam substring>" [nSeeds] [before] [after]
const fs=require("fs");const R="/tmp/claude-0/rw2c/run/";
const L=fs.readFileSync(R+"fam-surf/pdf.jsonl","utf8").trim().split("\n").map(JSON.parse);
const [q,n=3,b=6,a=4]=process.argv.slice(2);
const rows=L.filter(r=>r.fam.replace("(no section): ","")===q);
const seeds=[...new Set(rows.map(r=>r.seed))];
const pick=process.argv[6]?process.argv[6].split(","):seeds.slice(0,+n);
for(const s of pick){const t=fs.readFileSync(R+"surf-tip/"+s+".pdf-canon_dossier.txt","utf8").split("\n");
 const want=rows.filter(r=>r.seed===s).map(r=>r.line);
 const idx=[];t.forEach((x,i)=>{if(want.includes(x))idx.push(i)});
 console.log("#### "+s+" hits:"+idx.length);
 let last=-99;for(const i of idx.slice(0,4)){if(i-last<b+a){continue}last=i;console.log(t.slice(Math.max(0,i-b),i+(+a)+1).map((x,j)=>(j===+b?">> ":"   ")+x).join("\n"));console.log("   --");}
}
