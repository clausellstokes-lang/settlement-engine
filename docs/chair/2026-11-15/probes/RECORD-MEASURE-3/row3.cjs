const L=require('./load.cjs')(process.argv[2]);
let n=0,dDef=0,dImp=0,dMag=0,dPct=0,maxD=0,maxI=0,ex=[],either=0,issueTxt=0;const big=[];
for(const {seed,s} of L){const fs=s.economicState.foodSecurity, fb=s.economicViability?.metrics?.foodBalance; if(!fs||!fb)continue;n++;
 const a=Math.round(fs.deficit||0), b=Math.round(fb.deficit||0), ia=Math.round(fs.importCoverage||0), ib=Math.round(fb.importCoverage||0), ma=Math.round(fs.magicOffset||0), mb=Math.round(fb.magicFoodOffset||0);
 if(a>0||b>0)either++;
 if(a!==b){dDef++;maxD=Math.max(maxD,Math.abs(a-b)); if(Math.abs(a-b)>=50)big.push(seed)}
 if(ia!==ib){dImp++;maxI=Math.max(maxI,Math.abs(ia-ib))}
 if(ma!==mb)dMag++;
 if(Math.round(fs.deficitPct||0)!==Math.round(fb.deficitPercent??fb.deficitPct??0))dPct++;
 const txt=JSON.stringify([s.economicViability.issues,s.economicViability.warnings]); if(/lbs/.test(txt)&&a!==b)issueTxt++;
 if(ex.length<4&&a!==b)ex.push([seed,s.tier,'fs',a,ia,ma,fs.deficitPct,'fb',b,ib,mb,fb.deficitPercent,'need',fs.dailyNeed,fb.dailyNeed]);
}
console.log({n,either,dDef,maxD,dImp,maxI,dMag,dPct,issueTxt,big:big.length});ex.forEach(e=>console.log(e.join(' ')));
console.log(Object.keys(L[0].s.economicViability.metrics.foodBalance).join(' '));
