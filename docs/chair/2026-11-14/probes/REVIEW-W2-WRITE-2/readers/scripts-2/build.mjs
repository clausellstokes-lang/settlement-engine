import * as L from './lib.mjs'; import fs from 'fs';
const SR=JSON.parse(fs.readFileSync('script-results.json'));
const E=(town,ok,sev,kind,fact)=>({town,ok,sev,kind,fact});
const T=(t,f)=>E(t,true,null,null,f);
const D={
0:{eye:[T('rv2-metropolis-under_siege+famine-2','siege+famine in force; food_processing=running (econ chain +5); Disasters row: granary held but "the hall will not open it"')],note:'Siege+famine clause; true in its one town.'},
1:{eye:[T('rv2-city-under_siege+famine-1','siege+famine; food_processing=vulnerable not impaired (econ +5); famine band=famine')],note:'True in its one town.'},
2:{eye:[T('r2r-town-3','food_processing=impaired, econ chain -8, insurgency (no siege)'),T('r2r-metropolis-6','food_processing=impaired; Economics "Food Processing ... Impaired"'),T('r2s-occupied-city-0','occupied, food_processing=impaired; hypothetical "if cut off" fits')],note:'True; "little food put by" sits beside multi-month granary figures (relative claim, not listed).'},
3:{eye:[T('r2s-religious_conversion-city-1','food_processing=impaired'),T('rv2-metropolis-occupied-2','occupied; food_processing=impaired'),T('rv2-city-famine-2','famine; food_processing=impaired; Economic Survival Critical')],note:'True.'},
4:{eye:[T('rv2-city-calm-2','food_processing=impaired, grain=impaired'),T('r2r-metropolis-8','food_processing=impaired'),T('r2r-metropolis-53','food_processing=impaired'),T('r2r-metropolis-16','prior town: Economics "Food ProcessingManufacturing & craftsImpaired"; new text names no salting/drying'),T('r2r-metropolis-22','prior town: Food Processing Impaired, Grain & Bread Impaired')],
   prior:[{town:'r2r-metropolis-16',state:'CURED-TRUE',nowTrue:true,severity:null,fact:'reworded to "food trades"; Food Processing impaired on Economics; the Salt works chain is no longer named'},{town:'r2r-metropolis-22',state:'CURED-TRUE',nowTrue:true,severity:null,fact:'Food Processing and Grain & Bread both Impaired; river fishing no longer contradicted'}],note:'Rewording cures both prior reads.'},
5:{eye:[T('rv2-metropolis-under_siege-1','siege, food_processing=impaired'),T('rv2-metropolis-under_siege-2','siege, food_processing=impaired')],note:'True.'},
6:{eye:[T('rv2-town-under_siege-3','siege, food_processing=impaired; smallest'),T('rv2-metropolis-under_siege-28','siege, food_processing=impaired; largest'),T('rv2-city-under_siege-8','siege, food_processing=impaired')],note:'True.'},
7:{eye:[T('r2s-wartime-town-0','plagued, walls+gate+garrison; wartime is not a beast crisis'),T('rw3-metropolis-calm-1','plagued, walls, gate, garrison, calm'),
   E('r2s-monster_pressure-city-0',false,'MED','c','monster_pressure in force; same tab Military status: "The beasts give Burjmandi no rest between attacks" / "more is spent on defence, and people grow afraid" vs "nobody treats any of it as unusual"')],
   twin:'lacks "no crisis: monster_pressure" (or "no threat"): it carries no-siege/no-occupation but speaks routine calm under a beast crisis',note:'Routine-calm wording under an active beast crisis (1 town).'},
8:{eye:[T('r2s-monster_pressure-thorp-1','heartland, monster_pressure, no walls, no watch/force/charter'),T('r2s-monster_pressure-village-1','same; largest'),T('r2s-monster_pressure-hamlet-3','same; Hunter\'s lodge is an economy house')],note:'True.'},
9:{eye:[T('rv2-thorp-monster_pressure-1','heartland, monster_pressure, no defence'),T('r2s-monster_pressure-village-0','same; largest'),T('r2s-monster_pressure-hamlet-1','same')],note:'True.'},
10:{eye:[T('r2r-thorp-5','heartland, monster_pressure, no watch/force/charter')],
   prior:[{town:'r2r-thorp-40',state:'CURED-BY-SILENCE',nowPrints:'(Beasts & Monsters row shows badge "Critical" and no sentence)',nowTrue:null,severity:null,fact:'occupied thorp: no variant drawn'},{town:'r2s-monster_pressure-town-2',state:'CURED-BY-SILENCE',nowPrints:'(Beasts & Monsters row shows badge "Critical" and no sentence)',nowTrue:null,severity:null,fact:'has Town watch + Free company hall; no-guardPresence mark now bars it'}],note:'True; both prior towns silenced.'},
11:{eye:[T('r2r-town-16','walls+garrison, calm; smallest'),T('r2r-metropolis-8','walls+garrison; largest'),T('rv2-city-famine-1','famine; walls+garrison+mercenary')],
   low:'In 5 towns the posture line (overall readiness) says e.g. "Lykotion could deal with a brawl or a thief, but the town could not hold off a raid" (r2r-town-39, r2r-town-18, r2r-metropolis-7, r2s-politically_fractured-metropolis-2, rv2-metropolis-plague_onset-1): the two blocks disagree (g, LOW). The record backs this line.',note:'True; LOW page disagreement with the posture block in 5 towns.'},
12:{eye:[T('r2s-infiltrated-town-2','walls+garrison; smallest; LOW: posture "Much of Buyankher\'s perimeter has nobody on it" disagrees (g)'),T('r2r-metropolis-14','under_siege; walls+garrison; military score holds; largest'),
   E('rv2-town-under_siege+famine-1',false,'LOW','g','siege+famine, stores 0.1 months; posture "too few and too badly placed to hold off a serious attack for long" vs "good reason" to believe it could be held; military score 59 (Adequate) backs the line')],
   low:'13 of 126 towns carry a posture line that disagrees (7 under siege: r2s-under_siege-city-1, rv2-city-under_siege-25, rv2-city-under_siege-4, rv2-metropolis-under_siege-24, rv2-metropolis-under_siege-8, rv2-town-under_siege+famine-1, rv2-town-under_siege+famine-2). Military scores 56-92 back the line; the posture block reads the overall readiness.',
   twin:'twinHint: lacks "no crisis: under_siege". It matters little: under a siege "could be held" is a live belief, not a peacetime presumption, and the military scores back it. At most LOW where the posture line disagrees.',note:'True; LOW page disagreements.'},
13:{eye:[T('rv2-thorp-indebted-1','palisade walls, no watch/force; pop 11'),T('r2r-village-17','palisade, no watch/force; largest'),T('r2r-thorp-43','palisade, no watch/force')],note:'True; "walls" = palisade.'},
14:{eye:[T('r2r-thorp-50','palisade, no watch/force'),T('r2s-politically_fractured-village-2','largest'),T('rww-thorp-famine-1','famine; palisade, no watch/force')],note:'True.'},
15:{eye:[T('r2s-indebted-thorp-2','pop 8, palisade, no watch/force'),T('rv2-hamlet-mass_migration-1','hamlet'),T('r2s-religious_conversion-thorp-1','thorp')],note:'True.'},
16:{eye:[T('r2s-infiltrated-town-1','stone walls, watch only; smallest'),T('r2r-town-20','walls, watch only; largest'),T('r2r-town-37','plague_onset; watch only'),T('r2s-slave_revolt-town-1','revolt stops street patrols, but the same tab says "someone at the gate sees you come": consistent')],
   prior:[{town:'rww-town-occupied-1',state:'CURED-BY-SILENCE',nowPrints:'(Invasion & War row shows badge "Critical" and no sentence)',nowTrue:null,severity:null,fact:'no-occupied mark now bars it'}],note:'True.'},
17:{eye:[T('r2r-village-40','palisade, village watch; smallest'),T('r2s-mass_migration-town-1','walls, watch; largest'),T('r2s-famine-town-3','famine; walls, watch'),
   E('rww-town-slave_revolt-1',false,'MED','g','same tab: "the regular patrols have stopped" / "The watch has abandoned normal patrol patterns" / "everyone who keeps order is busy containing the revolt" vs "the watch on their rounds"')],
   prior:[{town:'rww-town-slave_revolt-1',state:'STILL-FALSE',severity:'MED',fact:'same tab: "the regular patrols have stopped"; "The watch has abandoned normal patrol patterns"'}],
   low:'"The town watch exists on paper" (guard grade) in 3 more towns (r2r-town-8, r2s-insurgency-town-2, r2s-plague_onset-town-1): not a contradiction.',note:'False in the one revolt town where the page says patrols stopped.'},
18:{eye:[E('rv2-thorp-under_siege+famine-1',true,'LOW','d','siege, palisade, no watch/force: true; "townsfolk" for a thorp of 19 is a mild size word')],
   prior:[{town:'r2s-under_siege-town-3',state:'CURED-BY-SILENCE',nowPrints:'Since the siege began, Rathwell\'s walls are manned by whoever can be spared from everything else.',nowTrue:true,severity:null,fact:'walls + Town watch under siege; no-watch mark now bars v6'}],slot:'"townsfolk" in a thorp (LOW)',note:'True.'},
19:{eye:[T('r2r-thorp-10','pop 10, frontier, monster_pressure, no defence'),T('r2r-hamlet-36','monster_pressure, no defence'),
   E('rv2-village-monster_pressure-2',false,'MED','b','record: Adventurers\' charter hall; same tab Guard assessment: "The adventurers\' charter hall coordinates emergency response to threats. Effective for monster incursions" under a beast crisis vs "nobody trained to send"')],
   prior:[{town:'rww-village-under_siege-1',state:'CURED-BY-SILENCE',nowPrints:'Qaryatsaray has no line and no force, and danger is close at hand.',nowTrue:true,severity:null,fact:'no walls, no watch/force, siege'}],
   twin:'lacks a "no charter" condition: a charter hall is a trained monster-response body the line denies',note:'False in the one town with a charter hall.'},
20:{eye:[T('rww-town-under_siege-1','siege; no walls; watch only'),
   E('rw3-town-under_siege+famine-1',true,'LOW','b','roster holds "Hired blades" (private hire, Adventuring) and a Military Council; not a town force'),
   E('r2s-monster_pressure-town-2',false,'HIGH','b','facts: mercenary=true (Free company hall); same tab: "A mercenary company provides enforcement" / "The free company at Velipol keeps its own muster roll" vs "the watch is all the town has to send"')],
   twin:'lacks "no mercenary" (the walls-with-NO-force siblings all carry it)',note:'Denies a hired company in 1 of 4 towns.'},
21:{eye:[T('r2r-town-10','STRONG (84), calm, Wealthy; smallest'),T('r2r-metropolis-10','STRONG (80), calm; largest'),T('r2r-city-41','STRONG (100), calm')],note:'True; all 34 calm, prosperity Comfortable or above.'},
22:{eye:[T('r2r-village-25','no wall, watch only, politically_fractured'),T('rv2-town-plague_onset-1','no wall, watch only'),T('r2s-famine-town-2','famine; no wall, watch only'),
   E('r2r-town-50',false,'HIGH','b','facts: mercenary=true (Free company hall); same tab: "A mercenary company provides enforcement" / "The free company at Saraibuurt keeps its own muster roll ... its fighters" vs "no soldiers"'),
   E('r2r-town-33',false,'MED','g','governingName=Military Council; Power tab: "Military commanders hold direct political authority" vs "no soldiers"')],
   prior:[{town:'r2r-town-33',state:'STILL-FALSE',severity:'MED',fact:'Military Council; Power tab: "Military commanders hold direct political authority; civic life is subordinate to defence"'}],
   twin:'lacks "no mercenary" (soldiers = garrison or hired company)',note:'Denies a hired company (HIGH, 1 town); two Military Council towns (MED).'},
23:{eye:[T('r2r-thorp-10','WEAK, nobody paid to defend; pop 10'),T('r2r-village-4','WEAK, no watch/force; largest'),T('r2s-occupied-thorp-3','occupied; hypothetical hire stands'),
   E('r2r-hamlet-4',false,'MED','g','defenseProfile charter=[Adventurers\' charter hall]; page: "It posts bounties, houses monster hunters, and takes up the local defence no garrison is here to keep"')],
   prior:[{town:'r2r-hamlet-4',state:'STILL-FALSE',severity:'MED',fact:'Adventurers\' charter hall posts bounties and takes up the local defence (it already pays people to defend it)'}],
   twin:'"no guardPresence" does not cover a charter hall (bounty-paid defence)',note:'False in 3 charter-hall towns (MED).'},
};
const out=L.LINES.map((l,i)=>{ const d=D[i]; const pr=(t)=>{const p=l.prints.find(x=>x.town===t);return p?p.page.map(v=>v.printed).join(' || '):null;};
 const eye=d.eye.map(e=>{const f=L.facts(e.town);return {town:e.town,size:f.tier,crisis:f.crisis.types.join('+')||'none',printed:pr(e.town),true:e.ok,severity:e.ok&&e.sev!=='LOW'?null:e.sev,kind:e.kind,fact:e.fact};});
 const s=SR[i]; const sevs=eye.filter(e=>!e.true).map(e=>e.severity);
 const falseHM=sevs.some(x=>x==='HIGH'||x==='MED')||(s.false>0&&i!==12);
 return {id:l.id,verdict:l.prints.length?(falseHM?'FALSE':'TRUE'):'NEVER PRINTS',printsIn:l.prints.length,eyeReads:eye,
  script:{tests:s.tests,true:s.true,false:s.false,falseTowns:s.falseTowns},prior:d.prior||null,
  twinMissingCondition:d.twin||null,slotOrAgreement:d.slot||null,machinery:null,note:d.note+(d.low?' LOW: '+d.low:'')};});
fs.writeFileSync(L.R.replace('/r/tip','/readers/out-2.json'),JSON.stringify(out,null,1));
for(const o of out) console.log(o.verdict, o.id, o.script.false, o.eyeReads.filter(e=>!e.true).map(e=>e.severity+':'+e.town).join(','), o.eyeReads.some(e=>!e.printed)?'MISSINGPRINT':'');
