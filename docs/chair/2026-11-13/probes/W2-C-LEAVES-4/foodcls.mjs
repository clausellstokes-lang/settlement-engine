import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,food,T]=process.argv.slice(2);
const { hasInstitution } = await import(T+'/src/domain/facts/institutions.js'); const { famineOf } = await import(T+'/src/domain/facts/famine.js');
const rec=new Map(); for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); rec.set(seed,s); }
const W0={ 'less than a fifth':[0,0.2],'about a fifth':[0.155,0.245],'about a quarter':[0.205,0.295],'about a third':[0.29,0.375],'about two parts in five':[0.355,0.445],'about half':[0.455,0.545],'about three parts in five':[0.555,0.645],'about two parts in three':[0.62,0.71],'about three parts in four':[0.705,0.795],'about four parts in five':[0.755,0.845],'about nine parts in ten':[0.855,0.945],'nearly all':[0.86,1],
 'a little of the rest':[0,0.2],'about half the rest':[0.455,0.545],'most of the rest':[0.6,1],'nearly all the rest':[0.86,1]};
const C={'less than a fifth':[0,0.2],'about a fifth':0.2,'about a quarter':0.25,'about a third':1/3,'about two parts in five':0.4,'about half':0.5,'about three parts in five':0.6,'about two parts in three':2/3,'about three parts in four':0.75,'about four parts in five':0.8,'about nine parts in ten':0.9,'nearly all':[0.9,1],'a little':[0,0.2],'most':[0.6,1]};
const WORD={}; for(const [k,v] of Object.entries(C)){ const r=Array.isArray(v)?v:[v-0.05,v+0.05]; WORD[k]=r; WORD[k+' of the rest']=r; WORD[k.replace(/^about half$/,'about half')+' the rest']=r; }
const c={}, ex={}; const add=(k,x)=>{c[k]=(c[k]||0)+1; (ex[k]=ex[k]||[]).push(x);};
let n=0;
for (const l of fs.readFileSync(food,'utf8').split('\n')) { if(!l) continue; const {seed,sentence}=JSON.parse(l); const s=rec.get(seed); if(!s||!sentence) continue; n++;
  const fb=s.economicViability?.metrics?.foodBalance||{}; const eco=s.economicState||{};
  const m=sentence.match(/grows (.+?) of what it eats, and (\w+) brings? in (.+?)\./);
  if(m){ const g=fb.dailyProduction/Math.max(1,fb.dailyNeed); const b=fb.importCoverage/(fb.rawDeficit||fb.importCoverage);
    const gw=WORD[m[1]]; if(gw&&(g<gw[0]||g>gw[1])) add('(a) grown word false',`${seed}: "${m[1]}" of ${Math.round(g*100)}`);
    const bw=WORD[m[3]]; if(bw&&(b<bw[0]||b>bw[1])) add('(a) brought word false',`${seed}: "${m[3]}" of ${Math.round(b*100)}`);
    const docks=hasInstitution(s,'docks'), boats=docks||(s.institutions||[]).some(i=>/ferry|barge|boat/i.test(i.name||''));
    if((m[2]==='ships'&&!docks)||(m[2]==='boats'&&!boats)) add('(b) carrier with no wharf',`${seed}: ${m[2]}`); }
  const mg=sentence.match(/provision makes up (.+?)(?: of what it eats)?\./); const mf=fb.magicFoodOffset/Math.max(1,fb.dailyNeed); if(mg&&(mg[1]==='a little more'?fb.magicFoodOffset>2*fb.dailyProduction:(WORD[mg[1]]&&(mf<WORD[mg[1]][0]||mf>WORD[mg[1]][1])))) add('(a) "a little more" of > twice the harvest',`${seed}: ${fb.magicFoodOffset} vs ${fb.dailyProduction}`);
  if(/nothing to spare/.test(sentence)&&Math.round(Number(eco.foodSecurity?.foodRecord?.storageMonths))>=3) add('(c) "nothing to spare" beside 3+ months',`${seed}: ${eco.foodSecurity.foodRecord.storageMonths}`);
  if(/bad season would/.test(sentence)&&famineOf(s).famine) add('(b) "a bad season would" under a famine',seed);
  if(/brought in covers/.test(sentence)&&!(Number(eco.foodSecurity?.foodRecord?.normalImportPct)>0)) add('(b) "brought in" with no food by trade',seed);
}
console.log('sentences',n); for(const [k,v] of Object.entries(c)) console.log(v,k,'e.g.',ex[k].slice(0,3).join(' | '));
