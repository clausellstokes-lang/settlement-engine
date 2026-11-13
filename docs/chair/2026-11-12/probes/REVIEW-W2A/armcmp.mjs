// node armcmp.mjs <tree with pageCensusFindings> <census out dir>
import fs from 'node:fs'; import zlib from 'node:zlib';
const [TREE,OUT]=process.argv.slice(2);
const { pageCensusFindings } = await import(TREE+'/src/domain/coherence/pageCensusFindings.js');
const corpus=zlib.gunzipSync(fs.readFileSync(OUT+'/corpus.ndjson.gz')).toString().trim().split('\n').map(l=>JSON.parse(l));
const per=JSON.parse(fs.readFileSync(OUT+'/counts.perseed.json','utf8'));
const MAP={P1a:['P1a'],P1b:['P1b'],P2:['P2'],P3any:['P3any'],P4:['P4'],P5a:['P5a'],P5b:['P5b'],P6:['P6'],P7a:['P7a'],P7b:['P7b'],P8any:['P8any','P8houses'],P9:['P9'],P10:['P10'],P11:['P11'],F4:['P12ore','P12coal','P12quarry','P12saw'],P13:['P13'],P14:['P14','P14district'],P16three:['P16three'],P16powers:['P16powers'],P17:['P17'],P18:['P18npc','P18rec'],P19:['P19'],P20:['P20'],NEW1:['NEW1','NEW1b'],NEW2:['NEW2']};
const views=(txt)=>{ const o={}; let cur='_'; for(const l of txt.split('\n')){ const m=l.match(/^== (.*) ==/); if(m){cur=m[1]; o[cur]=[]; continue;} (o[cur]||(o[cur]=[])).push(l);} return o; };
const arm={}, cen={}, diff={};
for(const {seed,s} of corpus){ const txt=fs.readFileSync(`${OUT}/dumps/${seed}.txt`,'utf8'); const a=new Set(pageCensusFindings(s,views(txt)).map(f=>f.row)); const c=new Set(per[seed]||[]);
 for(const [row,ks] of Object.entries(MAP)){ const ah=a.has(row), ch=ks.some(k=>c.has(k)); if(ah) arm[row]=(arm[row]||0)+1; if(ch) cen[row]=(cen[row]||0)+1; if(ah!==ch) (diff[row] ||= []).push(seed); } }
for(const row of Object.keys(MAP)) console.log(row.padEnd(10), 'arm', String(arm[row]||0).padStart(4), 'census', String(cen[row]||0).padStart(4), diff[row]?('SEED-DIFF '+diff[row].length+' e.g. '+diff[row].slice(0,3).join(',')):'per-seed equal');
