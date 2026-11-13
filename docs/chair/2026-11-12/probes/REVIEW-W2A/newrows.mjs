import fs from 'node:fs'; import zlib from 'node:zlib';
const S=process.env.S; const { pageCensusFindings } = await import(S+'/tip/src/domain/coherence/pageCensusFindings.js');
const corpus=zlib.gunzipSync(fs.readFileSync(S+'/census-base/corpus.ndjson.gz')).toString().trim().split('\n').map(l=>JSON.parse(l));
const views=(txt)=>{ const o={}; let cur='_'; for(const l of txt.split('\n')){ const m=l.match(/^== (.*) ==/); if(m){cur=m[1]; o[cur]=[]; continue;} (o[cur]||(o[cur]=[])).push(l);} return o; };
for(const d of ['census-base','census-tip','census-tip96']){ const c={}; let rng=0, hm=0, sup=0, lost=0, long=0, ex=[];
 for(const {seed,s} of corpus){ const txt=fs.readFileSync(`${S}/${d}/dumps/${seed}.txt`,'utf8'); for(const f of pageCensusFindings(s,views(txt))) c[f.row]=(c[f.row]||0)+1;
  const l=txt.split('\n').find(x=>/^Reliance on magic: /.test(x)); if(l&&/supplied by/.test(l)){ sup++; if(/\(\d+-\d+\+?\)/.test(l)){rng++; if(ex.length<3) ex.push(seed+': '+l.slice(0,160));} if(/\(high magic\)/.test(l)) hm++; if(l.length>300) long++; }
  if(d==='census-tip96'){ const b=fs.readFileSync(`${S}/census-tip/dumps/${seed}.txt`,'utf8').split('\n').find(x=>/^Reliance on magic: (Relied|Integral)/.test(x)); if(b&&!l) lost++; } }
 console.log(d,'P2siege',c.P2siege||0,'P3source',c.P3source||0,'P20',c.P20||0,'| supplied-by lines',sup,'with a count range',rng,'with "(high magic)"',hm,'over 300 chars',long, d==='census-tip96'?'| reliance lines removed (no source) '+lost:''); if(ex.length) console.log('  e.g.',ex.join('\n  e.g. ')); }
