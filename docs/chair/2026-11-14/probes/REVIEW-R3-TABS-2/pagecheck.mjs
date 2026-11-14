// pagecheck.mjs <dumps> <desk.jsonl> <deskdiff.jsonl>: for every town the cure moved, is the tip desk's sentence on the rendered
// Defense tab (present where the desk prints it; the base's removed sentence absent)? And: strong posture lines on pages under "Under occupation".
import fs from 'node:fs';
const [dir,deskf,difff]=process.argv.slice(2); const D=new Map(fs.readFileSync(deskf,'utf8').trim().split('\n').map(JSON.parse).map(o=>[o.seed,o]));
const rows=fs.readFileSync(difff,'utf8').trim().split('\n').map(JSON.parse); const c={};
const def=(s)=>{ const t=fs.readFileSync(`${dir}/${s}.txt`,'utf8'); const i=t.indexOf('== Systems/Defense =='); const j=t.indexOf('\n== ',i+5); return t.slice(i,j<0?undefined:j); };
for(const r of rows){ const p=def(r.seed); const k=r.k+' '+r.kind; c[k]??={tipOnPage:0,tipMissing:0,baseGone:0,baseStill:0};
  if(r.tip){ p.includes(r.tip)?c[k].tipOnPage++:c[k].tipMissing++; } if(r.line){ p.includes(r.line)?c[k].baseStill++:c[k].baseGone++; } }
console.log(c);
let occStrong=0, pages=0; for(const f of fs.readdirSync(dir)){ const p=def(f.replace(/\.txt$/,'')); pages++; if(/^Under occupation$/m.test(p)&&/reads as a defended place from the road in|can field and what .* has built are both in good order|does not spend much time thinking about being attacked|^Nothing presses .* at present/m.test(p)) occStrong++; }
console.log('pages',pages,'strong posture on a page whose military status reads Under occupation:',occStrong);
