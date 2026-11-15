// row 3 against the PAGE's figures: the tab's Short (foodRowShown's remainder) and imports vs the viability view's
const L=require('./load.cjs')(process.argv[2]);let n=0,dDef=0,maxD=0,dImp=0,maxI=0,dMag=0,txt=0,bothPrinted=0;const ex=[];
for(const {seed,s} of L){const f=s.economicState.foodSecurity, fb=s.economicViability.metrics.foodBalance;
 const rem=Math.max(0,f.dailyNeed-Math.max(0,f.dailyProduction)-Math.max(0,f.importCoverage)-Math.max(0,f.magicOffset));
 const pageShort=(f.deficit>0)?rem:0; const b=fb.deficit||0;
 if(Math.round(pageShort)!==Math.round(b)){dDef++;maxD=Math.max(maxD,Math.abs(pageShort-b)); if(ex.length<3)ex.push([seed,pageShort,b,f.deficit].join(' '))}
 if(Math.round(f.importCoverage||0)!==Math.round(fb.importCoverage??0)){dImp++;maxI=Math.max(maxI,Math.abs((f.importCoverage||0)-(fb.importCoverage||0)))}
 const t=JSON.stringify([s.economicViability.issues,s.economicViability.warnings]); const m=/~(\d+) lbs/.exec(t); if(m&&Math.round(pageShort)!==Number(m[1])&&/cannot cover/.test(t))txt++;}
console.log({dDef,maxD,dImp,maxI,cannotCoverTextDiffers:txt});ex.forEach(e=>console.log(e));
