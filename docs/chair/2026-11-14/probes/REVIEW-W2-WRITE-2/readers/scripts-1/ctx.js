// usage: node ctx.js town "substring" [before] [after]
const fs=require('fs');const R=process.env.R;
const [town,sub,b='3',a='3']=process.argv.slice(2);
const L=fs.readFileSync(`${R}/dumps/${town}.txt`,'utf8').split('\n');
let hdr='';const hits=[];
L.forEach((l,i)=>{if(/^== .* ==$/.test(l))hdr=l; if(l.includes(sub))hits.push([i,hdr]);});
for(const [i,h] of hits){console.log(`@${i} ${h}`);for(let j=Math.max(0,i-+b);j<=Math.min(L.length-1,i+ +a);j++)console.log((j===i?'>> ':'   ')+L[j].slice(0,400));}
if(!hits.length)console.log('NO HIT');
