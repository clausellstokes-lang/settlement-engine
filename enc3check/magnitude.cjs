const fs=require('fs'),path=require('path');
const real=fs.readFileSync(process.argv[2],'utf8');
// pull the estate's own two functions out of the committed test source, verbatim
const slc=real.match(/function stringLiteralContents\(src\)[\s\S]*?\n}\n/)[0];
eval(slc);
function countFile(abs){let em=0,bang=0;for(const t of stringLiteralContents(fs.readFileSync(abs,'utf8'))){em+=(t.match(/—/g)||[]).length;bang+=(t.match(/!/g)||[]).length;}return{em,bang};}
function walkJs(dir,out=[]){for(const e of fs.readdirSync(dir)){const p=path.join(dir,e);
  if(fs.statSync(p).isDirectory())walkJs(p,out); else if(/\.js$/.test(e)&&!/\.test\./.test(e))out.push(p);}return out;}
const ROOT=process.argv[3];
const baseline=JSON.parse(fs.readFileSync(process.argv[4],'utf8'));
const files=[...walkJs(path.join(ROOT,'src/data')),...walkJs(path.join(ROOT,'src/domain'))]
  .map(p=>path.relative(ROOT,p).replace(/\\/g,'/')).sort();
const current={};
for(const rel of files){const c=countFile(path.join(ROOT,rel)); if(c.em>0||c.bang>0)current[rel]=c;}
// the per-file arm's failure message, exactly as the test builds it
const diffs=[];
const keys=new Set([...Object.keys(baseline),...Object.keys(current)]);
for(const k of [...keys].sort()){
  const b=baseline[k]||{em:0,bang:0}, c=current[k]||{em:0,bang:0};
  if(b.em!==c.em||b.bang!==c.bang) diffs.push(`${k}: baseline em:${b.em} bang:${b.bang} → current em:${c.em} bang:${c.bang}`);
}
const msg='\n'+diffs.join('\n')+'\n';
const sum=(re)=>[...msg.matchAll(new RegExp(re,'g'))].reduce((a,m)=>a+Number(m[1]),0);
const cnt=(re)=>(msg.match(new RegExp(re,'gm'))||[]).length;
const totals=Object.values(current).reduce((t,c)=>({em:t.em+c.em,bang:t.bang+c.bang}),{em:0,bang:0});
console.log(process.argv[5]);
console.log('  PER-FILE arm  em  (sum "current em:(\\d+)")            = '+sum('current em:(\\d+)')+'   [ceiling 382]');
console.log('  PER-FILE arm  bang(sum "current em:\\d+ bang:(\\d+)")   = '+sum('current em:\\d+ bang:(\\d+)')+'   [ceiling 9]');
console.log('  PER-FILE arm  files(count "^\\S+: baseline em:")       = '+cnt('^\\S+: baseline em:')+'   [ceiling 69]');
console.log('  TOTAL arm     em  (all scanned files)                 = '+totals.em+'   [budget 670, ceiling 770]');
console.log('  TOTAL arm     bang                                    = '+totals.bang+'   [budget 15]');
if(process.env.SHOW_NEW){
  const bl=new Set(Object.keys(baseline));
  console.log('  --- drifted files NOT in the frozen baseline that are ENC-3 paths ---');
  for(const k of Object.keys(current)) if(!bl.has(k)&&/Encounters|ChanceMeeting/.test(k)) console.log('      '+k+' '+JSON.stringify(current[k]));
}
