// sev.mjs: TREE=<tree> IN=<births.gz>: every tension (and conflict intensity) in every town: how many hold a RANGE
// (more than one distinct severity), and what word each surface prints for it: the PDF view-model (Overview pill,
// HistoryFounding pill), the web History TensionRow (its own rule, re-stated), the Foundry journal (none).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src'; const { buildViewModel } = await import(R+'/pdf/lib/viewModel.js');
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let T=0,range=0,vmWordOnRange=0,one=0,vmErr=0,cr=0,crWord=0; const ex=[]; const shapes={};
for await (const l of rl){ const {seed,s}=JSON.parse(l); const ts=s.history?.currentTensions||[]; let vm=null; try{ vm=buildViewModel({settlement:s}); }catch(e){ vmErr++; }
  ts.forEach((t,i)=>{ T++; const sv=t.severity; const k=Array.isArray(sv)?'arr'+new Set(sv).size:typeof sv; shapes[k]=(shapes[k]||0)+1; const isR=Array.isArray(sv)&&new Set(sv.filter(Boolean)).size>1; if(isR) range++; else one++;
    const w=vm?.history?.tensions?.[i]?.severity ?? vm?.tensions?.[i]?.severity; if(isR&&w){ vmWordOnRange++; if(ex.length<3) ex.push(seed+' '+JSON.stringify(sv)+' -> '+w); } });
  for(const c of s.conflicts||[]){ cr++; if(typeof c.intensity!=='string') crWord++; } }
console.log({tensions:T,range,single:one,vmWordOnRange,vmErr,shapes,conflicts:cr,conflictsNonString:crWord,ex});
