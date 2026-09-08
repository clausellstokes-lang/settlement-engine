const wilson=(k,n,z=1.96)=>{const p=k/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z/d*Math.sqrt(p*(1-p)/n+z*z/(4*n*n));return [c-h,c+h];};
const f=(x)=>(x*100).toFixed(2)+'%';
for(const [k,n] of [[27,525],[10,200],[26,525],[28,525],[53,525],[3,200],[6,200],[7,200]]){
  const [lo,hi]=wilson(k,n); console.log(`${k}/${n} = ${f(k/n)}  95% CI [${f(lo)}, ${f(hi)}]`);
}
// smallest true rate that measures >=27/525 with 50% prob, and largest that measures <27
console.log('--- floor crossing: P(X>=27) for true p, n=525 (normal approx)');
const pnorm=(z)=>0.5*(1+erf(z/Math.SQRT2));
function erf(x){const t=1/(1+0.3275911*Math.abs(x));const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);return x>=0?y:-y;}
for(const p of [0.030,0.035,0.040,0.045,0.050,0.055,0.060,0.070]){
  const mu=525*p,sd=Math.sqrt(525*p*(1-p)); console.log(`  true p=${f(p)}  P(count>=27)=${f(1-pnorm((26.5-mu)/sd))}`);
}
// repeat census power
console.log('--- repeat census power at N=525');
for(const [cellShare,floor,label] of [[0.11,12,'bare 3x4 spine, military WEAK cell'],[0.11,432,'one tension modifier + 3 openers'],[0.11,144,'one addition modifier (1 opener)'],[0.11,5184,'two modifiers, GEN-3 corrected'],[0.11,15552,'two modifiers, doc figure']]){
  const towns=Math.round(525*cellShare), pairs=towns*(towns-1)/2, exp=pairs/floor;
  console.log(`  ${label}: towns=${towns} pairs=${pairs} expected collisions=${exp.toFixed(2)} (Poisson sd ${Math.sqrt(exp).toFixed(2)})`);
}
// corpus/coverage ceiling
console.log('--- coverage arithmetic');
const facts=72, poolsPerFactPerSite=2, sitesPerFact=3;
console.log('  modifier-pool ceiling under echo(iii) + the two-edge-band rule:',facts*poolsPerFactPerSite*sitesPerFact);
console.log('  attachments at that ceiling (attach<=3):',facts*poolsPerFactPerSite*sitesPerFact*3,'over 708 spines');
console.log('  §6.6 budgeted modifier pools (3 x ~50 blocks):',150,'-> attachments',450,'-> max spines with 1 modifier',450,`= ${f(450/708)} of 708`);
console.log('  ... with 2 modifiers each:',225,`= ${f(225/708)} of 708`);
console.log('  spines needed for "spine + up to two modifiers" on every pool:',708*2,'attachments =',Math.ceil(708*2/3),'modifier pools');
// bytes
console.log('--- bytes');
const meanB=280581/2266; console.log('  mean variant text bytes',meanB.toFixed(1));
console.log('  doc prices new pieces at', (630*1024/3080).toFixed(1),'B/sentence; estate mean is',meanB.toFixed(1));
console.log('  3080 new wordings at estate mean =',(3080*meanB/1024).toFixed(0),'KB (doc: 630 KB)');
console.log('  ceiling 432 modifier pools x 3 variants x 4 faces =',432*3*4,'wordings =',(432*3*4*meanB/1024).toFixed(0),'KB text');
