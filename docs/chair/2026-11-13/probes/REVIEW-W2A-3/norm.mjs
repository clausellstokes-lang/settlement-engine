import fs from 'node:fs';
const a=JSON.parse(fs.readFileSync('m/merged.json','utf8'));
const RANGE=/\((\d[\d,]*(-\d[\d,]*)?\+?( households)?|[\d,]+\+ only)\)/;
const base={}; const tip={};
for(const x of a){
  x.readerSeverity=x.severity;
  const s=x.sentence;
  const bare = RANGE.test(s) && !/[a-z]\. |\bsupplied by\b|, the [a-z]/.test(s) && s.length<120 && !/\bstops half-way\b/.test(s);
  if(/internal/.test(x.mechanism) && bare && !/Merchant guilds \(3-8\)|Merchant guilds \(15-40\)|Craft guilds \(5-15\) · Bowyers/.test(s)) { x.severity='LOW'; x.class='catalogue-range-name'; }
  else if(RANGE.test(s) && x.severity==='HIGH') { x.severity='MED'; }
  if(/priority is \d+\/100/.test(s)) x.severity='MED';
  const b=base[x.town]??=fs.readFileSync(`/home/user/wt/r-base/dumps/${x.town}.txt`,'utf8');
  x.atBase = b.includes(s);
}
fs.writeFileSync('m/normed.json',JSON.stringify(a,null,1));
const c={}; for(const x of a){ const k=x.severity+(x.class?'/cat':''); c[k]=(c[k]||0)+1;} console.log(c);
const nb=a.filter(x=>!x.atBase); console.log('not at base:',nb.length); for(const x of nb) console.log(x.severity,'|',x.town,'|',x.tabs.join(','),'|',x.sentence.slice(0,200),'##',x.fact.slice(0,160));
