const fs=require('fs'),zlib=require('zlib'),path=require('path');
const S='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad';
const R=S+'/r/tip';
const L=JSON.parse(fs.readFileSync(S+'/readers/lines-6.json'));
const cache={};
function rec(t){if(!cache[t])cache[t]=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${R}/records/${t}.json.gz`)));return cache[t];}
const pcache={};
function page(t){if(!pcache[t])pcache[t]=fs.readFileSync(`${R}/dumps/${t}.txt`,'utf8');return pcache[t];}
function tabs(t){const out={};let cur='?';for(const ln of page(t).split('\n')){const m=/^== (.*) ==$/.exec(ln);if(m){cur=m[1];out[cur]=[];continue;}(out[cur]=out[cur]||[]).push(ln);}return out;}
function line(id){return L.find(l=>l.id===id);}
function crisis(t){const r=rec(t);const s=r.stress;const ss=r.stresses;const arr=[];if(s){if(Array.isArray(s))s.forEach(x=>arr.push(x.type||x));else arr.push(s.type||s);}
 if(Array.isArray(ss))ss.forEach(x=>{const k=x.type||x;if(!arr.includes(k))arr.push(k)});return arr;}
function ctx(t,needle,n=2){const lines=page(t).split('\n');const out=[];let tab='?';lines.forEach((ln,i)=>{const m=/^== (.*) ==$/.exec(ln);if(m)tab=m[1];if(ln.includes(needle))out.push({tab,i,around:lines.slice(Math.max(0,i-n),i+n+1).map(x=>x.slice(0,300))});});return out;}
function inst(t){return (rec(t).institutions||[]).map(i=>({n:i.name,c:i.category,s:i.status}));}
module.exports={fs,zlib,S,R,L,rec,page,tabs,line,crisis,ctx,inst};
function crises(t){const r=rec(t);const s=r.stressors;let a=[];if(Array.isArray(s))a=s.map(x=>x&&(x.type||x));else if(s&&s.type)a=[s.type];if(r.stress&&r.stress.type&&!a.includes(r.stress.type))a.push(r.stress.type);return a.filter(Boolean);}
module.exports.crises=crises;
