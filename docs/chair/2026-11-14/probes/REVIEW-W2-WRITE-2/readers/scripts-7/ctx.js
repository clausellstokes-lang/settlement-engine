// usage: node ctx.js town needle [before] [after] [surface]
const fs=require('fs');const [town,needle,b='6',a='6',surf='dumps']=process.argv.slice(2);
const R='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/r/tip';
const lines=fs.readFileSync(`${R}/${surf}/${town}.txt`,'utf8').split('\n');
let hdr='';const hdrs=[];lines.forEach((l,i)=>{if(/^== .* ==$/.test(l))hdr=l;hdrs[i]=hdr;});
let n=0;lines.forEach((l,i)=>{if(l.includes(needle)&&n<4){n++;console.log(`@@ ${i} ${hdrs[i]}`);for(let j=Math.max(0,i-+b);j<=Math.min(lines.length-1,i+ +a);j++)console.log((j===i?'>> ':'   ')+lines[j].slice(0,400));}});
if(!n)console.log('NOT FOUND');
