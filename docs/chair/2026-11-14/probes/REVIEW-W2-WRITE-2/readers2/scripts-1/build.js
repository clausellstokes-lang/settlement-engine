const L=require("../removals-1.json");const fs=require("fs");
const split=p=>((p||"").match(/[^.!?]+(?:[.!?]+["')]*)(?=\s|$)|[^.!?]+$/g)||[]).map(s=>s.trim()).filter(Boolean);
function newSents(x){const bs=split(x.baseParagraph);return split(x.tipParagraph).filter(s=>!bs.includes(s));}
const T=(f)=>({t:true,f});const F=(s,f)=>({t:false,s,f});
// removed judgments: R[i] = function(k,x)->{t,s,f}; P[i] = function(k,x)->{k:"silence"|"true"|"false",s,f,re}
const occ=x=>x.stress.includes("occupied"),sie=x=>x.stress.includes("under_siege");
const R={},P={},N={};
const pick=(x,re)=>newSents(x).find(s=>re.test(s));
R[0]=()=>F("HIGH","(c) siege/occupation in force; 'gates close on time, nobody treats it as unusual' states normal times");
P[0]=(k,x)=>({k:"true",re:/creatures/});
N[0]="Removed lines stated peacetime routine under siege/occupation; replacements (creature-wall lines, plagued country) are true.";
R[1]=(k,x)=>occ(x)?F("MED","(c) occupied: another power holds the place; the town is not improvising a defence, and nothing came from the country (monsterThreat heartland)"):
 k===8?F("MED","(b)/(g) has a Town watch; crisis text says 'its defences were built for quieter times'"):
 (k===9||k===10)?F("LOW","(b) has a Town watch; and the threat is a besieging army, not 'the country'"):
 F("LOW","(c) the threat at hand is a besieging army; monsterThreat heartland, so 'the country is asking now' is a stretch");
P[1]=(k,x)=>occ(x)?{k:"silence"}:{k:"true",re:/no line and no force|watch is all|no wall and only its watch/};
N[1]="All 12 false (occupied MED, siege/watch LOW); replacements are silence or true 'no line and no force' lines.";
R[2]=(k)=>k===2?F("LOW","(b) the town has a Town watch"):T("no wall, no force; a threat is at hand");
P[2]=(k,x)=>k===4?{k:"true",re:/no line and no force/}:{k:"silence"};
N[2]="Mostly true duplicate of the 'no line and no force' line; mainly silence after.";
R[3]=(k,x)=>occ(x)?F("MED","(c) occupied, monsterThreat heartland: nothing has 'come out of the country'; another power holds the place"):
 k===3?F("MED","(b) has Town watch and a Free company hall (professional soldiers for hire)"):
 k===4?F("MED","(b) has Town watch and a Warden's Lodge (rangers)"):F("MED","(c) threat is a besieging army, not something out of the country; (b) has a Town watch");
P[3]=(k,x)=>occ(x)?{k:"silence"}:k===3?{k:"false",s:"MED",re:/watch is all/,f:"(b) Velipol has a Free company hall (band of professional soldiers) as well as its watch"}:
 k===4?{k:"false",s:"LOW",re:/only its watch/,f:"(b) Uaxaccoba also has a Warden's Lodge (rangers who scout and track in a crisis)"}:{k:"true",re:/only its watch/};
N[3]="All 6 false; one replacement ('watch is all the town has to send') denies Velipol's Free company hall.";
R[4]=()=>F("MED","(c) occupied: the city is already held by another power (garrison backs the Occupation Authority); 'any attacker would think again' is normal-times deterrence");
P[4]=()=>({k:"silence"});N[4]="Removed deterrence lines were false under occupation; silence after.";
R[5]=()=>F("MED","(c) occupied: the town was already taken; its garrison backs the occupier, so 'people believe the town could be held' is not so");
P[5]=()=>({k:"silence"});N[5]="False under occupation; silence after.";
R[6]=()=>F("LOW","(c) occupied: another power already holds the thorp; the 'determined attacker' frame ignores it (walls/no force are true)");
P[6]=()=>({k:"silence"});N[6]="Doubtful under occupation; silence after.";
R[7]=()=>T("palisade/earthworks and no local force (record)");P[7]=()=>({k:"silence"});N[7]="True; silence after.";
const fch8=[0,1,2,7,8,9];
R[8]=(k)=>fch8.includes(k)?F("MED","(b) the town also has a Free company hall (professional soldiers for hire), so not 'its watch and nobody else'"):
 (k===3||k===6)?F("LOW","(b) the town also has an Adventurers' charter hall"+(k===6?" and Hunter's lodge":"")):T("walls and only a Town watch in the record");
P[8]=()=>({k:"silence"});N[8]="Six of ten denied a Free company hall; silence after.";
R[9]=(k)=>k===4?F("LOW","(b) the town also has an Adventurers' charter hall"):F("MED","(b) the town also has a Free company hall (professional soldiers for hire), so the watch is not 'the only people'");
P[9]=()=>({k:"silence"});N[9]="Seven of eight denied a Free company hall; silence after.";
R[10]=(k)=>F("LOW","(b) the town had a Town watch"+(k===1?" and Hired blades":"")+" before the siege, so not 'nobody'");
P[10]=()=>({k:"true",re:/manned by whoever/});N[10]="Doubtful (watch existed); replacement 'manned by whoever can be spared' is true.";
R[11]=(k)=>(k===13||k===14)?F("LOW","(b) the village has an Adventurers' charter hall"):T("no wall, no force; crisis in force");
P[11]=(k,x)=>occ(x)?{k:"silence"}:{k:"true",re:/no line and no force/};N[11]="Mostly true; removal looks like duplicate trimming; replacements true.";
R[12]=(k,x)=>occ(x)?F("MED","(c) occupied: prosperity Poor and 'the occupiers take the revenue'; its arrangements are not intact"):
 sie(x)?F("MED","(c) under siege in force, prosperity Struggling, viability false; 'could go through a bad season' ignores the crisis"):T("economic score 67-100 and prosperity Comfortable/Moderate or better");
P[12]=(k,x)=>occ(x)?{k:"false",s:"MED",re:/money laid by|money in hand|put by|still paid/,f:"(c)/(g) occupied, prosperity Poor, and the crisis text says 'the occupiers take the revenue'; 'defenders still paid on time/from money laid by' is not so"}:{k:"true",re:/money laid by|money in hand|put by|still paid/};
N[12]="Mostly true (strong economy); the replacements for the 2 occupied towns claim defenders paid from the town's money while occupiers take the revenue.";
R[13]=(k,x)=>{const R0=require("./facts.js").rec(x.town);return (x.tier==="thorp"||R0.population<50)?F("HIGH","(d) "+x.tier+" of "+R0.population+": no streets to avoid"):F("MED","(d) hamlet of "+R0.population+": 'which few streets to avoid' is a size it lacks")};
P[13]=()=>({k:"true",re:/keep order|keep the peace/});N[13]="Removed size line was false in every thorp/hamlet; the order-keeping replacements are true.";
R[14]=()=>F("HIGH","(c) under siege: 'nothing comes in by road', yet everyone entering is counted at the gate");
P[14]=()=>({k:"true",re:/soldiers serve|standing force/});N[14]="False under siege; the standing-force replacements are true.";
R[15]=()=>F("LOW","(c) occupied: another power's forces hold the place; 'defense here is individual armed citizens' ignores them (no local force is true)");
P[15]=(k)=>k===2?{k:"true",re:/no gate/}:{k:"silence"};N[15]="Doubtful under occupation; mainly silence after.";
R[16]=()=>T("no local force (record); hypothetical");P[16]=()=>({k:"silence"});N[16]="True; silence after.";
R[17]=()=>T("no local force or defence institution (record)");P[17]=()=>({k:"silence"});N[17]="True; silence after.";
R[18]=(k)=>F("LOW","(c) wartime is a distant war (conscription, requisition); nothing in the record has the town attacked or 'defended now'");
P[18]=()=>({k:"true",re:/leans on whoever/});N[18]="Doubtful (war is distant); replacement is true.";
R[19]=(k)=>F("LOW","(c) wartime is a distant war; nobody is 'leading the defence' of the place in the record"+(k===9?"; also has a Veteran's lodge":""));
P[19]=()=>({k:"true",re:/leans on whoever/});N[19]="Doubtful; replacement is true.";
R[20]=(k,x)=>{const R0=require("./facts.js").rec(x.town);const F0=R0.economicState.foodSecurity;return /Deficit/.test(F0.label)?F("HIGH","(c)/(f) food "+F0.label+", food ratio "+F0.foodRatio+" ("+F0.deficitPct+"% short); it does not 'get by on its own'"):F("MED","(g) food Import-Dependent, ratio "+F0.foodRatio+" ("+F0.deficitPct+"% short); not 'enough on its own'")};
P[20]=(k,x)=>{const R0=require("./facts.js").rec(x.town);return /Deficit/.test(R0.economicState.foodSecurity.label)?{k:"false",s:"LOW",re:/make do/,f:"(c) 'a good year is comfortable' is the ordinary lot, beside a famine/deficit in force (food ratio "+R0.economicState.foodSecurity.foodRatio+")"}:{k:"true",re:/make do/}};
N[20]="All 14 false (famine/siege HIGH, imports MED); the 'make do' replacement is general but softer (LOW under famine).";
R[21]=()=>T("no wall, a Town watch, a crisis in force");
P[21]=(k)=>k===0?{k:"false",s:"MED",re:/watch is all/,f:"(b) Velipol also has a Free company hall (professional soldiers for hire)"}:k===3?{k:"false",s:"LOW",re:/watch is all/,f:"(b) Cobapan also has Hired blades"}:{k:"true",re:/watch|wall/};
N[21]="Removed line was true; one replacement denies Velipol's Free company hall.";
R[22]=(k)=>k===4?F("MED","(a) hamlet of 20 has no arms trades (chains: fishing, petty mining, fortification, forage, parish)"):
 k===9?F("MED","(c) weapons_armor, iron and smelting chains all impaired"):
 [1,2,7].includes(k)?F("LOW","(c) no running arms chain ("+(k===1?"bowyer_fletcher impaired":k===2?"no weapons/bowyer chain":"leather impaired, weapons none")+"); record defence-chain modifier small"):T("arms/defence chains running or guild present; positive military chain modifier");
P[22]=()=>({k:"true",re:/more good than harm/});N[22]="Mixed; the 'food is short, but the trades behind its defence do more good than harm' replacement matches the positive chain modifier.";
R[23]=(k)=>k===3?F("MED","(d) thorp of 22 with a household levy: no 'lanes' or order-keepers walking in pairs"):T("insurgency in force; watch/militia present");
P[23]=()=>({k:"true",re:/./});N[23]="Mostly true; replacements true.";
R[24]=(k)=>(k===12||k===26)?F("MED","(g) the same page says the pay book is always behind: 'defenders are paid late or not at all'"):T("professional garrison in the record");
P[24]=()=>({k:"true",re:/soldiers serve|standing force|counted at the gate/});N[24]="Mostly true; replacements (standing force / year-round soldiers / gate count in unsieged towns) true.";
R[25]=()=>T("under siege, no force before (record)");P[25]=()=>({k:"true",re:/siege/});N[25]="True; replacements true.";
R[26]=(k)=>k===3?F("LOW","(a) hamlet of 82 with only a citizen militia: 'guards posted' is a stretch"):T("mass migration; garrison/watch present");
P[26]=()=>({k:"true",re:/newcomers|arriving/});N[26]="True; replacements true.";
R[27]=(k,x)=>x.tier==="thorp"?T("palisade, household levy, readiness Strained/Critical"):F("LOW","(h) the {defwork} slot prints the catalogue name 'palisade or earthworks' (otherwise true: readiness Strained)");
const und27={0:"Undefended",10:"readiness Critical",11:"Undefended, readiness Critical",15:"Undefended",16:"Undefended",18:"Undefended"};
P[27]=(k,x)=>und27[k]?{k:"false",s:"MED",re:/defences are sound/,f:"(g) the same page rates it "+und27[k]+" (Defense readiness "+(/Critical/.test(und27[k])?"Critical":"Strained")+")"}:
 [1,4,5,6,14,17].includes(k)?{k:"false",s:"LOW",re:/defences are sound/,f:"(h) 'to man the palisade or earthworks' prints the catalogue name"}:
 k===7?{k:"false",s:"LOW",re:/defences are sound/,f:"(c) fortification chain vulnerable"}:{k:"true",re:/defences are sound/};
N[27]="Removed line was right about strain; 'X's defences are sound' replacement contradicts an Undefended/Critical rating in 6 towns.";
R[28]=(k)=>k===10?F("LOW","(d) a town of 407: 'large enough that anyone expects a wall' is a stretch"):T("town tier, no walls in record");
P[28]=(k)=>k===10?{k:"false",s:"LOW",re:/./,f:"(d) a town of 407 'as big as places that usually raise a wall of stone'"}:{k:"true",re:/./};
N[28]="True; replacements true.";
R[29]=(k)=>F("MED","(c) occupied: the city is already held, garrison backs the occupier; 'raiders stay away and an army would pay dearly'"+((k===0||k===2)?"; (g) page rates it Lightly Defended":""));
P[29]=(k)=>(k===2||k===3)?{k:"true",re:/creatures/}:{k:"silence"};N[29]="False under occupation; silence or true creature-wall lines.";
R[30]=()=>F("LOW","(c) occupied: the threat (an occupying power) is already in the place, not 'noticing' it");
P[30]=()=>({k:"silence"});N[30]="Doubtful under occupation; silence after.";
R[31]=(k,x)=>sie(x)?F("MED","(c)/(g) under siege: the enemy is camped around it, and the page's military status says the siege is held by householders, so not 'nobody posted anywhere ... danger close'"):F("LOW","(c) occupied: the danger is already in the place, not 'close'");
P[31]=(k,x)=>sie(x)?{k:"true",re:/no line and no force/}:{k:"silence"};N[31]="False under siege (MED); 'no line and no force, and danger is close at hand' is true.";
R[32]=()=>F("MED","(c) famine already active (Deficit, Active Famine); stores do not 'stand between the town and hunger', hunger is here");
P[32]=()=>({k:"true",re:/hunger|hungry/});N[32]="False beside an active famine; replacements name the hunger and are true.";
R[33]=(k,x)=>{const R0=require("./facts.js").rec(x.town);const F0=R0.economicState.foodSecurity;return F("HIGH","(f)/(c) stores "+F0.storageMonths+" months, "+F0.label+"; not 'an ordinary year'")};
P[33]=(k,x)=>({k:"false",s:"LOW",re:/make do/,f:"(c) the ordinary lot ('a good year is comfortable'), beside an active famine/deficit"});
N[33]="All 10 false (HIGH figure); the 'make do' replacement is LOW under famine.";
R[34]=()=>F("HIGH","(h) slot fills a catalogue name: \"X's city walls and gates was short of hands\" (ungrammatical); also (b) a professional garrison holds the walls");
P[34]=()=>({k:"true",re:/siege has put more people/});N[34]="All broken slot text; replacement is true.";
R[35]=()=>T("palisade, no force (record)");P[35]=()=>({k:"true",re:/palisade/});N[35]="True; replacement true.";
R[36]=()=>F("LOW","(h) 'its palisade or earthworks' prints the catalogue name");
P[36]=()=>({k:"false",s:"MED",re:/defences are sound/,f:"(g) the same page rates Kaltenberg Undefended (Defense readiness Strained); also (h) 'the palisade or earthworks'"});
N[36]="Removed slot LOW; replacement claims sound defences beside Undefended.";
const rank={HIGH:3,MED:2,LOW:1};
const out=L.map((r,i)=>{let rt=0,rf=0,worst=null;const ex=[];let oneTrue=null;const rep={silence:0,true:0,false:0,falseExamples:[]};
 r.read.forEach((x,k)=>{const j=R[i](k,x);const rem=(x.removedSentence||r.text);
  if(j.t){rt++;if(!oneTrue)oneTrue={town:x.town,removed:rem,true:true,severity:null,fact:j.f};}
  else{rf++;if(!worst||rank[j.s]>rank[worst])worst=j.s;ex.push({town:x.town,removed:rem,true:false,severity:j.s,fact:j.f});}
  const p=P[i](k,x);if(p.k==="silence")rep.silence++;else{const s=p.re?pick(x,p.re):null;
   if(!s){console.error("NO REPL",i,k,x.town,p.re);rep.silence++;return;}
   if(p.k==="true")rep.true++;else{rep.false++;rep.falseExamples.push({town:x.town,sentence:s,severity:p.s,fact:p.f});}}});
 if(oneTrue)ex.push(oneTrue);
 return {id:r.id,read:r.read.length,removedTrue:rt,removedFalse:rf,removedFalseWorst:worst,examples:ex,replacement:rep,note:N[i]};});
fs.writeFileSync("/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/out-1.json",JSON.stringify(out,null,1));
let tr=0,tot=0;for(const o of out){tr+=o.removedTrue;tot+=o.read;console.log(o.id.slice(0,60).padEnd(60),o.read,"T"+o.removedTrue,"F"+o.removedFalse,o.removedFalseWorst,"| rep s"+o.replacement.silence,"t"+o.replacement.true,"f"+o.replacement.false);}
console.log("total",tot,"true",tr);
for(const o of out)for(const f of o.replacement.falseExamples)if(f.severity!=="LOW")console.log("REPLFALSE",f.severity,o.id,f.town,"|",f.sentence);
