const {leaves,lines,rec,dump}=require("./lib");const {parseRow,foodSection,parseSentence}=require("./food.js");
const flags=[];const F=(l,code,msg)=>flags.push({seed:l.seed,fam:l.fam,code,msg,line:l.line});
const hhStats={};
for(const l of lines){if(!/^FOOD/.test(l.fam))continue;const L=leaves.get(l.seed);const r=rec(l.seed);const fs=r.economicState.foodSecurity;
 const sec=foodSection(l.seed);const row=parseRow(sec[0]||"");const sentLine=sec[1]||"";
 const siege=L.crisis.includes("under_siege");
 if(/^FOODROW/.test(l.fam)){
   const R=parseRow(l.line);if(!R){F(l,"rowparse","");continue}
   const impR=siege&&L.trade.tradeStopped?0:fs.importCoverage;
   // compare with record
   if(R.prod!==Math.round(fs.dailyProduction))F(l,"prod",R.prod+" vs "+fs.dailyProduction);
   if(R.need!==Math.round(fs.dailyNeed))F(l,"need",R.need+" vs "+fs.dailyNeed);
   if(R.imp!==Math.round(impR))F(l,"imp",R.imp+" vs rec "+fs.importCoverage+" siege="+siege+" stopped="+L.trade.tradeStopped);
   if(R.magic!==Math.round(fs.magicOffset))F(l,"magic",R.magic+" vs "+fs.magicOffset);
   const sh=Math.max(0,R.need-R.prod-R.imp-R.magic);if(Math.abs(R.short-sh)>1)F(l,"short",R.short+" vs computed "+sh+" rec deficit "+fs.deficit);
   if(R.short===0&&sh>1)F(l,"noshort","");
   continue}
 const s=parseSentence(l.line);
 if(!row){F(l,"norow",sec[0]);continue}
 if(s.nofood&&row.imp>0)F(l,"nofood-but-imp",JSON.stringify(row));
 if(s.carrier&&row.imp===0)F(l,"carrier-but-noimp",JSON.stringify(row));
 if(s.kind&&s.kind!==row.kind)F(l,"kind",s.kind+" vs row "+row.kind);
 if(!s.kind&&row.magic>0&&!s.covers)F(l,"magic-unsaid",JSON.stringify(row));
 if(s.covers){if(row.short>0)F(l,"covers-but-short",JSON.stringify(row));if(s.covers==="grown"&&row.imp>0)F(l,"grown-but-imp",JSON.stringify(row));if(s.covers==="both"&&row.imp===0)F(l,"both-but-noimp",JSON.stringify(row));if(row.magic>0)F(l,"covers-magic-unsaid",JSON.stringify(row));
   const spare=(row.prod+row.imp+row.magic)/row.need;if(s.nospare&&spare>1.1)F(l,"nospare-but-surplus",spare.toFixed(2));}
 if(s.hh){const pct=row.short/row.need*100;const k=s.hh+"|"+s.tail;(hhStats[k]=hhStats[k]||[]).push(pct)}
 // carrier vs route
 if(s.carrier){const route=r.economicState.tradeAccess;const ok={ships:["port"],boats:["river"],carts:["road","crossroads","isolated"],trade:["port","river","road","crossroads","isolated"]}[s.carrier];
   (hhStats["CARRIER "+s.carrier+"@"+route]=hhStats["CARRIER "+s.carrier+"@"+route]||[]).push(0);
   if(siege&&s.carrier!=="ships")F(l,"siege-carrier",s.carrier+" route "+route);}
 if(s.hh&&!fs.hasFamine&&!siege&&/hunger is already here/.test(s.tail))F(l,"hunger-no-crisis",L.crisis.join("+")+" pct "+(row.short/row.need*100).toFixed(0));
}
require("fs").writeFileSync("foodflags.json",JSON.stringify(flags,null,1));
const c={};for(const f of flags)c[f.code]=(c[f.code]||0)+1;console.log(c);
for(const k in hhStats){const a=hhStats[k];console.log(k,a.length,Math.min(...a).toFixed(1),Math.max(...a).toFixed(1))}
