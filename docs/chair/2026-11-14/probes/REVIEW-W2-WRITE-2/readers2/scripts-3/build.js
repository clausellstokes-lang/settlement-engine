const fs=require('fs');
const L=require("../removals-3.json");const {facts,diff,rec}=require("./lib.js");
const OUT='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/out-3.json';
const T=(fact)=>({t:true,fact});const F=(sev,fact)=>({t:false,sev,fact});
const legit=t=>rec(t).powerStructure.publicLegitimacy;
const stab=t=>rec(t).powerStructure.stability||'';
const fearsJudge=(s,e)=>{const l=legit(e.town);const f=facts(e.town);
  if(l.label==='Endorsed')return F('MED',`(g) page prints "${l.score} Endorsed" beside a ruler whose fear is the town turning on it; stability "${stab(e.town).slice(0,30)}"`);
  if(l.label==='Approved'&&!f.stress&&/^(Stable|Ordered|Tense \(milit)/.test(stab(e.town)))return F('LOW',`legitimacy ${l.score} Approved, ${stab(e.town).slice(0,25)}, no crisis: fear of the town turning on it is a stretch`);
  return T(`legitimacy ${l.label}${f.stress?', '+f.stress:''}`);};
const monkRe=/monk/i;
function monkPair(town){for(const r of L)for(const x of r.read)if(x.town===town&&x.baseParagraph&&monkRe.test(x.baseParagraph)){const d=diff(x.baseParagraph,x.tipParagraph);return {gone:d.gone.filter(s=>monkRe.test(s))[0],add:d.added.filter(s=>monkRe.test(s))[0]};}return null;}
const single=g=>/Royal Authority|Noble Governorship|Ducal Governorship|Feudal Stewardship|Headman/.test(g);
const R={
0:{re:/market/i,rm:e=>F('HIGH','(c)/(g) plague_onset: page says "Fear of the sickness and the quarantine have emptied the market"; "Fewer people come to market"'),rp:s=>T('neutral history of the market site')},
1:{re:/market/i,rm:e=>F('MED','(c)/(g) plague_onset: transit routes 0 in record; page "travel is discouraged", "emptied the market"'),rp:s=>T(/sickness/.test(s)?'plague thins the market: matches record':'location statement; market exists')},
2:{re:/market/i,rm:e=>T('history of the market site; true under siege'),rp:s=>T('history; market exists')},
3:{re:/./,silence:true,rm:e=>F('HIGH','(c) under_siege: page "The market is shut and the caravans have stopped coming"; no entrepot living while besieged')},
4:{re:/market/i,rm:e=>F('MED','(c)/(g) under_siege: page "nothing comes in by road", yet trade said done "on the road"'),rp:s=>T('no market or fair in record')},
5:{re:/bank/i,rm:e=>F('LOW','(c) under_siege: nobody passes through; caravans stopped (bank exists)'),rp:s=>T('bank exists (Banking houses/district)')},
6:{re:/merchant guild/i,rm:e=>F('MED','(c) under_siege: members cannot carry dealings outward; "nothing comes in by road"'),rp:s=>T('merchant guild exists')},
7:{re:/merchant guild/i,rm:e=>F('LOW','(c) under_siege: no outside traders arrive (guild exists)'),rp:s=>T('merchant guild exists')},
8:{re:/guild/i,rm:e=>T('craft guilds exist; a guild rule, not a trade state'),rp:s=>T('craft guilds present, no merchant guild')},
9:{re:/warehouse/i,rm:e=>F('MED','(c)/(g) under_siege: goods do not move "between the road and the buyer"; page "nothing comes in by road"'+(facts(e.town).trade==='isolated'?'; trade access isolated':'')),rp:s=>T('warehouses exist; storage is not a trade-state claim')},
10:{re:/warehouse/i,rm:e=>F('MED','(c) under_siege: the town cannot trade out of its warehouses; page "market is shut", "nothing comes in by road"'),rp:s=>T('warehouses exist')},
11:{re:/warehouse/i,rm:e=>F('LOW','(c) under_siege: no trader journeys in or out (warehouses exist)'),rp:s=>T('warehouses exist')},
12:{re:/./,silence:true,rm:e=>F('MED','(c) occupied, prosperity Poor: record "The occupiers take the revenue"; the money is not "found every season"')},
13:{monk:1,rm:e=>F('MED','(c) under_siege: no one comes "on the way into" the town; page "nothing comes in by road"')},
14:{monk:1,rm:e=>T('monastery present; a charity rule, not a trade state'),},
15:{re:/temper|agree|decisions/i,rm:e=>F('MED',`(c)/(g) seat is a single ruler (${facts(e.town).gov}): page "${(rec(e.town).powerStructure.factions.find(f=>f.isGoverning)||{}).desc?.slice(0,60)}"; no body that "must agree"`),rp:fearsJudge},
16:{re:/temper|agree|decisions/i,rm:e=>F('MED',`(c)/(g) seat is a single ruler (${facts(e.town).gov}), not a body the business "goes to the whole" of`),rp:fearsJudge},
17:{re:/temper|agree|decisions/i,rm:e=>F('MED',`(c)/(g) seat is a single ruler (${facts(e.town).gov}): no "members" to disagree`),rp:fearsJudge},
18:{re:/./,silence:true,rm:e=>T('record flags merchantArmy true (merchant guild private security); occupation not denied')},
19:{re:/Officials at/,rm:e=>F('MED',`(c) ${facts(e.town).stress}: stability "${stab(e.town).slice(0,40)}": the danger is in the streets, not only the hall`),rp:s=>T('Poor prosperity; corruption pressure in record')},
20:{re:/customs|dues|duties|unrecorded|gate/i,rm:e=>F('MED','(c)/(g) under_siege: page "nothing comes in by road"; no flow of arrivals for a share to bypass the gate'),rp:s=>T('')},
21:{re:/Occupation Authority|commander|Nothing the/i,rm:e=>F('HIGH','(c) occupied: inverts the power; record "its own officials take their orders" from the occupiers, Occupation Authority outranks the governing council'),rp:(s,e)=>/commander/i.test(s)?F('LOW','occupation authority (power 25) dropped; "the commander" is ambiguous: the seat-holder is himself the watch commander and the occupying governor is unnamed'):T('Occupation Authority outranks the council in record')},
22:{re:/bought its|carts that kept/i,rm:e=>T('good is in primaryImports; siege cuts imports'),rp:s=>T('good imported; siege in force')},
23:{re:/market/i,rm:e=>/plague/.test(facts(e.town).stress)?T('plague: travel discouraged, not cut; market findable'):F('LOW','(c) under_siege: no visitors arrive ("nothing comes in by road"; market shut)'),rp:s=>T(/sickness/.test(s)?'plague thins the market':'history; market exists')},
24:{re:/./,silence:true,rm:e=>F('MED','(c) occupied, Poor: the forces of another power hold the town and take the revenue'+(e.town==='rv2-town-occupied-1'?'; page "people under arms, but too few and too badly placed to hold off a serious attack"':''))},
25:{re:/No trade at|Some of the work/i,rm:e=>{const inst=e.removedSentence.match(/'s (.*?) is short/)[1];const f=facts(e.town);const j=rec(e.town);const has=j.institutions.some(i=>i.name===inst);
  if(/\(/.test(inst))return F('HIGH',`(h) catalogue name "${inst}" printed in prose; (c) chain only vulnerable, not stalled`);
  if(!has){const alt=j.institutions.find(i=>i.name.toLowerCase().includes(inst.split(/[ ']/)[0].toLowerCase().slice(0,7)))?.name;return F('MED',`(a) record has no "${inst}" (it has "${alt}")`+(/siege/.test(f.stress)?'':'; (c) chain vulnerable, not short'));}
  if(/siege|famine/.test(f.stress)&&!(inst==='Waystation'))return T(`${f.stress}: imports cut / food short`);
  return F('MED',`(c) chain for ${inst} is "vulnerable" (input bought in), not short or stalled; no crisis cuts supply`);},rp:s=>T('upstream chain absent locally; input bought in / siege cuts it')},
26:{re:/council|agree|decisions|business goes|untaken|Authority/i,rm:e=>F('MED',`(c) ${facts(e.town).stress}: stability "${stab(e.town).slice(0,40)}"; rivals are the seat's main danger`),rp:(s,e)=>/Headman/.test(facts(e.town).gov)&&/members/.test(s)?F('MED','(c) the Headman\'s Authority is one headman ("A headman settles disputes and gives the orders"): no "members"'):T(`council-type seat (${facts(e.town).gov})`)},
27:{re:/Officials at/,rm:e=>F('MED',`(c) ${facts(e.town).stress}: stability "${stab(e.town).slice(0,40)}": the watch does not keep the streets`),rp:s=>T('prosperity Poor/Struggling; corruption pressure')},
28:{re:/customs|dues|duties|unrecorded/i,rm:e=>F('MED','(c)/(g) under_siege: page "nothing comes in by road"; no goods "reach" the town'+(facts(e.town).inst.includes('Customs house')?'':'; (a) no customs house in record')),rp:s=>T('')},
29:{re:/customs|dues|duties|unrecorded/i,rm:e=>F('MED','(c)/(g) under_siege: page "nothing comes in by road"; no share of goods to go around customs'+(facts(e.town).inst.includes('Customs house')?'':'; (a) no customs house in record')),rp:s=>T('')},
};
const out=[];
L.forEach((r,i)=>{const cfg=R[i];const o={id:r.id,read:r.read.length,removedTrue:0,removedFalse:0,removedFalseWorst:null,examples:[],replacement:{silence:0,true:0,false:0,falseExamples:[]},note:''};
 const rank={HIGH:3,MED:2,LOW:1};let trueEx=null;
 for(const e of r.read){const j=cfg.rm(e);const removed=e.removedSentence||(cfg.monk&&monkPair(e.town)?.gone)||'(not found; judged from template + record)';
  if(j.t){o.removedTrue++;if(!trueEx)trueEx={town:e.town,removed,true:true,severity:null,fact:j.fact};}
  else{o.removedFalse++;if(!o.removedFalseWorst||rank[j.sev]>rank[o.removedFalseWorst])o.removedFalseWorst=j.sev;o.examples.push({town:e.town,removed,true:false,severity:j.sev,fact:j.fact});}
  let s=null;
  if(cfg.monk){s=monkPair(e.town)?.add||null;if(!s){const m=require('./lib.js').grep(e.town,/monks/i)[0];s=m?(m.match(/[^.]*monks[^.]*\./i)||[null])[0]?.trim():null;}}
  else if(!cfg.silence){const d=diff(e.baseParagraph,e.tipParagraph);s=d.added.filter(x=>cfg.re.test(x))[0]||null;}
  if(!s)o.replacement.silence++;
  else{const rj=cfg.rp?cfg.rp(s,e):T('');if(rj.t)o.replacement.true++;else{o.replacement.false++;o.replacement.falseExamples.push({town:e.town,sentence:s,severity:rj.sev,fact:rj.fact});}}
 }
 if(trueEx)o.examples.push(trueEx);
 out.push(o);});
fs.writeFileSync(OUT,JSON.stringify(out,null,1));
for(const o of out)console.log(o.id.padEnd(70),o.read,'T',o.removedTrue,'F',o.removedFalse,o.removedFalseWorst,'| rep S',o.replacement.silence,'T',o.replacement.true,'F',o.replacement.false,o.replacement.falseExamples.map(x=>x.severity+':'+x.town).join(','));
