import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, ctf] = process.argv.slice(2);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { isSeatVacant } = await import('/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/domain/people/seatKeeper.js');
const CT=new Map(fs.readFileSync(ctf,'utf8').trim().split('\n').map(l=>{const o=JSON.parse(l);return [o.seed,o.L];}));
const t={};
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const L=CT.get(seed)||[]; const v=isSeatVacant(s);
  for (const x of L) { if(!/whoever holds the seat|than the seat|holds the seat/.test(x)) continue; const [ty,f,...r]=x.split('|'); const txt=r.join('|');
    const cls = /whoever holds the seat/.test(txt)?'whoever': /holds the seat/.test(txt)?'holds the seat':'other';
    const k=f+' | '+cls+' | vacant='+v; (t[k]=t[k]||[]).push(seed+' :: '+txt.slice(0,140)); } }
for (const k of Object.keys(t).sort()) { console.log(t[k].length, k); if(/vacant=true/.test(k)) t[k].slice(0,6).forEach(e=>console.log('    ',e)); }
