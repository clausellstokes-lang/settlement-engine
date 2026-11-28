import fs from 'node:fs';
const [base,after,list]=process.argv.slice(2); const W=/\b(established|marginal|commanding)\b/g;
let n=0,bTowns=0,aDisp=0,aStand=0,same=0, bLines=0, aLines=0;
for(const t of fs.readFileSync(list,'utf8').trim().split('\n')){ const pa=`${after}/dumps/${t}.txt`; if(!fs.existsSync(pa)) continue; n++;
  const B=fs.readFileSync(`${base}/dumps/${t}.txt`,'utf8').split('\n'), A=fs.readFileSync(pa,'utf8').split('\n');
  const bd=B.filter(l=>/^Disposition /.test(l)&&W.test(l)); W.lastIndex=0;
  const ad=A.filter(l=>/^Disposition /.test(l)&&/\b(established|marginal|commanding)\b/.test(l));
  const as=A.filter(l=>/^Standing (established|marginal|commanding)$/.test(l));
  const bw=new Set(bd.flatMap(l=>l.match(/\b(established|marginal|commanding)\b/g))), aw=new Set(as.map(l=>l.split(' ')[1]));
  if(bd.length) bTowns++; if(ad.length) aDisp++; if(as.length) aStand++; bLines+=bd.length; aLines+=as.length;
  if([...bw].sort().join()===[...aw].sort().join()) same++; }
console.log({towns:n,townsWithStandingWordInDisposition_before:bTowns,after:aDisp,townsWithStandingRow_after:aStand,townsWhoseStandingWordSetIsUnchanged:same,distinctDispositionLinesBefore:bLines,distinctStandingLinesAfter:aLines});
