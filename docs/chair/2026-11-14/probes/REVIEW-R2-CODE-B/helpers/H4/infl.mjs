import fs from 'node:fs'; import zlib from 'node:zlib';
const D='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-tip/dumps/';
const lines=zlib.gunzipSync(fs.readFileSync('../../out/births-tip.ndjson.gz')).toString().split('\n').filter(Boolean);
const t={}; let n=0; const bad=[];
for(const l of lines){const {seed,s}=JSON.parse(l); const f=D+seed+'.txt'; if(!fs.existsSync(f)) continue;
 const txt=fs.readFileSync(f,'utf8'); const m=txt.split('\n').find(x=>/\d+ Key Figures/.test(x)); if(!m){t['nohead']=(t['nohead']||0)+1;continue;} n++;
 const tail=m.replace(/^.*?holds\./,''); const hi=(tail.match(/(\d+) high influence/)||[])[1]|0; const mo=(tail.match(/(\d+) moderate/)||[])[1]|0; const kf=+m.match(/(\d+) Key Figures/)[1];
 const rh=(s.npcs||[]).filter(x=>x.influence==='high').length, rm=(s.npcs||[]).filter(x=>x.influence==='moderate').length;
 const k=`${/·\s*$|^\s*·/.test(tail.trim())?'TRAIL':'ok'} hiMatch=${hi===rh} moMatch=${mo===rm} kfMatch=${kf===(s.npcs||[]).length}`; t[k]=(t[k]||0)+1; if(bad.length<5&&!(hi===rh&&mo===rm)) bad.push([seed,m.slice(0,140),rh,rm,(s.npcs||[]).length]);
 const sing=/^1 Key Figures/.test(m)?'one':'';
 if(sing) t['1 Key Figures']=(t['1 Key Figures']||0)+1;
}
console.log(n,t,bad);
