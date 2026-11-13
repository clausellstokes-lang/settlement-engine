// annotate.mjs <merged.json> <out.json>: the reviewer's own read of the 18 MEDIUM lines that print at the tip and not at deb1544eb.
// faultAge: NEW = the false claim itself is new at the tip; OLD = the base printed the same false claim in other words.
import fs from 'node:fs';
const [I,O]=process.argv.slice(2); const a=JSON.parse(fs.readFileSync(I,'utf8'));
const R=[
 [/^Nothing threatens (Cnocholme|Ulfset|Maghleigh|Naranjopeten) now/,'NEW','base: "Nothing has come for X and nothing about the place would stop it" (true of a place nothing has attacked); tip: "Nothing threatens X now ... Its safety rests on nobody wanting it" beside a frontier beast threat and "needs specialists against the creatures" on the same tab'],
 [/^Nobody ever thought Ulfset worth a wall/,'NEW','a new line; the hamlet was founded as a defensive stronghold'],
 [/^Food endurance: .*village for about (four|three) months/,'OLD','the base printed the same figures ("carry the village for about four/three months"); only the mood of the verb changed'],
 [/^Reliance on magic: .*· supplied by/,'NEW','the "· supplied by …" clause is new at the tip (base: the label alone); it names a catalogue range or a priest beside a tab of absent roles'],
 [/^Banking & FinanceServiceExport|^Caravan & Overland TradeTrade/,'NOT-BORN','chip rows identical at the base; the reader joined lines across a changed neighbour'],
 [/^The city used to send its wool out half-worked/,'NEW','a new line (siege variant); the city has weavers, a dyer and a fuller and its cloth chain runs'],
 [/^Benglen cannot produce its own medicinal herbs/,'OLD','base: "Benglen works medicinal herbs it cannot produce; it buys the raw stuff in" (the same false claim)'],
 [/^The metropolis's soldiers are paid by the season/,'NEW','a new line; the same tab says the pay book is always behind'],
 [/^Maghleigh's Cartographer's guild is short/,'OLD','base: "Maghleigh\'s Cartographer\'s guild stands idle" (the guild name the roster lacks was already printed)'],
 [/^Ormaker cannot produce its own salt/,'NEW','a new line; the hamlet has Salt works (the raw salt is imported, the salt is made here)'],
];
let n=0; for(const x of a){ if(!x.bornOnLane) continue; for(const [re,age,why] of R) if(re.test(x.sentence)){ x.faultAge=age; x.reviewerNote=why; if(age==='NOT-BORN') x.bornOnLane=false; n++; break; } }
// The reviewer's own additions from reading the 218 tip-only sentences (readers missed them):
for(const [town,name] of [['rww-city-under_siege-1','Panteakra'],['rww-metropolis-under_siege-1','Naranjotepec']]) a.push({town,tab:'Summary/Overview',tabs:['Summary/Overview'],sentence:`Visitors find ${name}'s market without asking.`,kind:'c',mechanism:'presumes normal times under a crisis in force',fact:'stress under_siege ("nothing comes in by road"); same page, Crisis: the markets are listed among the institutions "critically impaired by siege". At deb1544eb this slot printed "'+name+'\'s market lives off through-traffic" (the debt cut\'s HIGH #964 class); the line in its place still presumes visitors under a siege.',source:'RECEIPT_POOLS_DOSSIER_STATE.md MARKET-OPEN v3 [visitor · crisis: any]',severity:'MED',section7:false,reader:0,readers:[0],verbatim:true,atBase:false,bornOnLane:true,faultAge:'NEW',corpusOwn:true,reviewerNote:'added by the reviewer from the tip-only sentence list'});
fs.writeFileSync(O,JSON.stringify(a,null,1));
const hm=a.filter(x=>x.bornOnLane&&x.severity!=='LOW'); console.log('annotated',n,'born MED/HIGH',hm.length,'NEW',hm.filter(x=>x.faultAge==='NEW').length,'OLD',hm.filter(x=>x.faultAge==='OLD').length,'unannotated',hm.filter(x=>!x.faultAge).length);
