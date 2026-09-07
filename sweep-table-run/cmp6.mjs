import { readFileSync } from 'node:fs';
const DOC=process.argv[2], REP=process.argv[3];
const R=JSON.parse(readFileSync(REP,'utf8'));
const doc=readFileSync(DOC,'utf8').split('\n');
const parse=(l)=>l.replace(/^\|/,'').replace(/\|$/,'').split('|').map(s=>s.replace(/\*\*/g,'').trim());
// published HIGH and LOW lists
const grab=(hdr)=>{const i=doc.findIndex(l=>l.trim()===hdr);
  const s=doc.findIndex((l,k)=>k>i&&l.startsWith('| x median |'));
  const out=[];for(let k=s+2;k<doc.length;k++){if(!doc[k].startsWith('|'))break;out.push(parse(doc[k]));}return out;};
const high=grab('### HIGH — above double the median');
const low=grab('### LOW — below half the median');
console.log('published HIGH rows:',high.length,' LOW rows:',low.length);
console.log('measured outliers total:',R.outliers.length,
  ' high:',R.outliers.filter(o=>o.dir==='high').length,
  ' inf:',R.outliers.filter(o=>o.dir==='high-vs-zero-median').length,
  ' low:',R.outliers.filter(o=>o.dir==='low').length);
const key=(reg,met)=>reg+'||'+met;
const mm=new Map();
for(const o of R.outliers) mm.set(key(o.register,o.metric),o);
let diffs=0,checked=0;
const check=(rows,label)=>{
 for(const r of rows){
  const [x,reg,met,val,med]=r; checked++;
  const o=mm.get(key(reg,met));
  if(!o){console.log(`MISSING in measured [${label}]: ${reg} / ${met} (published ${x}, v=${val}, med=${med})`);diffs++;continue;}
  const ok=(a,b)=>Math.abs(Number(a)-Number(b))<1e-9;
  if(!ok(o.value,val)){console.log(`VALUE DIFF ${reg} / ${met}: published ${val} measured ${o.value}`);diffs++;}
  if(!ok(o.median,med)){console.log(`MEDIAN DIFF ${reg} / ${met}: published ${med} measured ${o.median}`);diffs++;}
  const px=x.startsWith('∞')?Infinity:Number(String(x).replace('x',''));
  if(!(px===Infinity&&o.ratio===null||px===Infinity&&!Number.isFinite(o.ratio))&&!ok(px,o.ratio)){
    console.log(`RATIO DIFF ${reg} / ${met}: published ${x} measured ${o.ratio}`);diffs++;}
  mm.delete(key(reg,met));
 }
};
check(high,'HIGH');check(low,'LOW');
console.log('\nrows in measured NOT in published lists:',mm.size);
for(const [k,o] of mm) console.log('  UNPUBLISHED:',o.dir,o.register,'/',o.metric,'v=',o.value,'med=',o.median,'ratio=',o.ratio);
console.log(`\npublished outlier rows checked: ${checked}  diffs: ${diffs}`);
