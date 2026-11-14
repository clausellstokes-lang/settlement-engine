// sweep.mjs <dumps>: every catalogue-shaped bracket on every tab of every page: a digit-led range or floor ("(5-10)",
// "(10,000+ only)", "(50-100+)"), "(if …)", "(high magic)"; page tallies "(2)" are not brackets of a name. Per tab: lines, towns, examples.
import fs from 'node:fs';
const dir=process.argv[2]; const RE=/\((?:\d[\d,]*\s*[-–+][^)]*|if [^)]*|high magic|[^)]*\bonly)\)/i; const c={};
for(const f of fs.readdirSync(dir)){ let tab=''; const seen=new Set(); for(const l of fs.readFileSync(`${dir}/${f}`,'utf8').split('\n')){ if(l.startsWith('== ')){tab=l.slice(3,-3);continue;} if(l.startsWith('[STYLE]')) continue; const m=l.match(RE); if(!m) continue;
  const k=tab+' :: '+m[0]; const e=(c[k]??={lines:0,towns:new Set(),ex:[]}); e.lines++; e.towns.add(f.replace(/\.txt$/,'')); if(e.ex.length<3&&!seen.has(k)) e.ex.push(f.replace(/\.txt$/,'')+': '+l.slice(Math.max(0,l.indexOf(m[0])-60),l.indexOf(m[0])+m[0].length+20)); seen.add(k);} }
for(const [k,e] of Object.entries(c).sort((a,b)=>b[1].towns.size-a[1].towns.size)) console.log(`${e.towns.size}\t${e.lines}\t${k}\t${e.ex.join(' || ')}`);
console.log('pages',fs.readdirSync(dir).length);
