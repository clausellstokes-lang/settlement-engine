import fs from 'node:fs';
const A=JSON.parse(fs.readFileSync('/home/user/wt/debt/lanes.json','utf8'));
const HIGH_CURED={17:'write',21:'merge',25:'write',54:'merge',172:'merge',178:'data',283:'write',340:'write',344:'write',417:'data',451:'write',683:'data',805:'write',867:'write',983:'write',1056:'write'};
const HIGH_STILL={247:'upkeep/merge: the covers row reprinted, still a debug chip'};
const MED_SAMPLE_TRUE=new Set([37,77,104,197,233,278,298,339,349,359,418,420,509,561,684,735,834]);
const MED_SAMPLE_FALSE=new Set([122,166,294,382,467,472,503,523,554,646,787,811,629]);
const L=['write','data','upkeep','merge'];
for(const x of A){
  const goneKept=L.filter(k=>!x.lanes[k].prints&&!x.lanes[k].town.startsWith('RE-DEALT'));
  const goneRedealt=L.filter(k=>!x.lanes[k].prints&&x.lanes[k].town.startsWith('RE-DEALT'));
  const srcTouched=L.filter(k=>x.lanes[k].literalGone||x.lanes[k].variantGone||x.lanes[k].declTouched);
  const fileOnly=L.filter(k=>x.lanes[k].fileTouched);
  x.goneKept=goneKept; x.goneRedealt=goneRedealt; x.srcTouched=srcTouched; x.fileTouched=fileOnly;
  if(x.severity==='HIGH'){
    x.status = HIGH_CURED[x.n]?'cured':HIGH_STILL[x.n]?'touched, still false':(goneKept.length||srcTouched.length)?'touched, still false':goneRedealt.length?'only in re-dealt towns':'untouched';
    x.curedOn=HIGH_CURED[x.n]||null;
  } else {
    if(MED_SAMPLE_TRUE.has(x.n)) x.status='cured';
    else if(MED_SAMPLE_FALSE.has(x.n)) x.status='touched, still false';
    else if(goneKept.length) x.status='gone from a lane page (unread)';
    else if(srcTouched.length) x.status='touched, still false';
    else if(goneRedealt.length) x.status='only in re-dealt towns';
    else x.status='untouched';
  }
}
fs.writeFileSync('/home/user/wt/debt/final.json',JSON.stringify(A,null,1));
const grp=(o)=>o.startsWith('code')?'code':o;
const T={}; for(const x of A){ const g=grp(x.owner); T[g]??={}; const k=x.severity+' | '+x.status; T[g][k]=(T[g][k]||0)+1; }
console.log(JSON.stringify(T,null,1));
const tot={}; for(const x of A){ const k=x.severity+' | '+x.status; tot[k]=(tot[k]||0)+1;} console.log('TOTAL',JSON.stringify(tot,null,1));
const byLane={}; for(const x of A.filter(x=>x.status==='cured')){ const k=x.curedOn||x.goneKept.join('+'); byLane[x.severity+' '+k]=(byLane[x.severity+' '+k]||0)+1;} console.log('cured by lane',byLane);
const ub=A.filter(x=>x.status==='gone from a lane page (unread)'); const ubl={}; for(const x of ub){ const k=x.goneKept.join('+'); ubl[k]=(ubl[k]||0)+1;} console.log('MED gone unread, by lane',ubl);
