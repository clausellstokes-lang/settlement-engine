// Each reader FALSE: does the same line (its pattern) print in the same town at the stage's base? Base dumps: BASE.
import fs from 'node:fs';
import L from './lines.mjs';
const V=[1,2,3,4].flatMap(n=>JSON.parse(fs.readFileSync(`/tmp/claude-0/runs/readers/verdict-${n}.json`,'utf8')).map(v=>({...v,reader:n})));
const out=[]; const tally={};
for(const v of V){ tally[v.verdict]=(tally[v.verdict]||0)+1; if(v.verdict!=='FALSE') continue;
  const l=L.find(x=>x.id===v.id); const bf=`${process.env.BASE}/${v.seed}.txt`; const base=fs.existsSync(bf)?fs.readFileSync(bf,'utf8'):'';
  const atBase=l&&l.re.test(base); out.push({...v,atBase,kindOfLine:l?.kind}); }
console.log(JSON.stringify(tally));
for(const o of out) console.log(o.id.padEnd(4),o.seed.padEnd(38),(o.severity||'').padEnd(6),o.kind,'base:'+(o.atBase?'PRINTS':'absent'),o.kindOfLine,'|',(o.fact||'').slice(0,110));
fs.writeFileSync('/tmp/claude-0/runs/readers/false-classed.json',JSON.stringify(out,null,1));
