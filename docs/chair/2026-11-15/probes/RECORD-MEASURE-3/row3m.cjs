const L=require('./load.cjs')(process.argv[2]);const c={};
for(const {seed,s} of L){const fs=s.economicState.foodSecurity, fb=s.economicViability.metrics.foodBalance;
 const ma=Math.round(fs.magicOffset||0), mb=Math.round(fb.magicFoodOffset||0); if(ma===mb)continue;
 const k=`fs>0:${ma>0} fb>0:${mb>0} magicOn:${s.config.magicExists!==false}`; c[k]=(c[k]||0)+1;}
console.log(c);
