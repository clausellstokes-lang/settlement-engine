const fs=require("fs"),zlib=require("zlib"),path=require("path");
const S="/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad";
const R=S+"/r/tip";
const L=JSON.parse(fs.readFileSync(S+"/readers/lines-3.json"));
const cache={};
function rec(t){ if(!cache[t]) cache[t]=JSON.parse(zlib.gunzipSync(fs.readFileSync(R+"/records/"+t+".json.gz"))); return cache[t];}
function page(t){ return fs.readFileSync(R+"/dumps/"+t+".txt","utf8");}
// return tab section containing needle
function tabOf(t,needle){ const lines=page(t).split("\n"); let hdr=null,out=[];
  for(let i=0;i<lines.length;i++){ if(/^== .* ==$/.test(lines[i])) hdr=lines[i]; if(lines[i].includes(needle)) out.push({i,hdr}); } return out;}
function ctx(t,needle,b=3,a=3){ const lines=page(t).split("\n"); const res=[];
  lines.forEach((l,i)=>{ if(l.includes(needle)){ let hdr=""; for(let j=i;j>=0;j--) if(/^== .* ==$/.test(lines[j])){hdr=lines[j];break;}
    res.push(hdr+" @"+i+"\n"+lines.slice(Math.max(0,i-b),i+a+1).map((x,k)=>(k===Math.min(b,i)?">> ":"   ")+x.slice(0,400)).join("\n"));}});
  return res.join("\n---\n");}
function section(t,hdrNeedle){ const lines=page(t).split("\n"); let on=false,out=[]; for(const l of lines){ if(/^== .* ==$/.test(l)) on=l.includes(hdrNeedle); if(on) out.push(l);} return out;}
function line(id){ return L.find(l=>l.id===id);}
function stress(r){ const s=r.stress; if(!s) return []; if(Array.isArray(s)) return s.map(x=>x.type||x); return [s.type||s];}
module.exports={rec,page,ctx,section,line,L,stress,R,tabOf};
