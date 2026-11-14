const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";const o=require("./crime-towns.json");const picks=require("./picks.json");
const L=fs.readFileSync(B+"fam-all/defense-magic.jsonl","utf8").trim().split("\n").map(JSON.parse);
const fams={};for(const r of L){(fams[r.fam]=fams[r.fam]||[]).push(r)}
const legalNone=require("./legalflags-none.json"),legalPr=require("./legalflags-prison.json");
const out=[];
const short=s=>s.length>220?s.slice(0,217)+"...":s;
for(const[f,rows]of Object.entries(fams)){const seeds=[...new Set(rows.map(r=>r.seed))];const R={fam:f,towns:seeds.length,readByHand:picks[f],scripted:true};
 if(/Legal Infrastructure|No deterrence|Detention without/.test(f)){
  const none=/None|No deterrence/.test(f);const src=none?legalNone:legalPr;
  R.falseTowns=src.length;R.trueTowns=0;R.verdict="FALSE";R.severity="MED";R.kind="g";
  R.examples=src.slice(0,5).map(x=>({seed:x.s,sentence:rows.find(r=>r.seed===x.s).line,fact:`record economicState.compound.inst.hasCourtSystem=true, hasPrison=${x.prison}; roster law houses: ${x.ros.join(",")||"none"}; the same Defense tab's Guard assessment says: "${(x.g.match(/[^.]*(court|tried)[^.]*\./i)||[""])[0].trim()}"`}));
  R.note=(none?"86/86 towns: the row reads the roster (no courthouse/prison house on it; defenseDisplay.js reads `courtOnRoster`, not the flag), but the record's hasCourtSystem=true in every one and the same tab's Guard assessment ('A court exists, though there is nowhere to hold the guilty' / 'Offenders ... go before the court' / 'The court can try a case') and Internal Security ('The town's law can name a wrong and cannot keep the person') say a court sits; 29 also print '<N>'s court passes sentences it cannot enforce'. No town has a court house on the roster, so the row is true to the roster and false to the record flag and to its own page; one of the two must change. All are towns (pop 309-2453); 30+ are under siege/famine/occupation, no difference there.":"19/19 towns: roster holds 'Small prison/stocks' and no court house, but hasCourtSystem=true and the same tab's Guard assessment says 'A functioning court and prison mean crimes carry real consequences' / 'Thieves here know that the court sits and the cells are real' / 'Offenders ... are tried at the court and held in the prison'; 'Detention without process. Arbitrary enforcement.' contradicts it outright. Same roster-vs-flag split as the None row.");
  out.push(R);continue;}
 // crime families
 const isLabel=/Criminal structure: Semi|Criminal activity is coordinated enough to maintain/.test(f);
 const contra=rows.some(r=>/answer to a guild, and the guild decides|Few thefts at .* thieves. guild settles/.test(r.line));
 const fl=[],tr=[];const ex=[];
 for(const s of seeds){const t=o[s];const gov=t.crimF.find(x=>x.g);const tg=t.ros.find(n=>/thie/i.test(n));
  if(gov||tg||contra){fl.push(s);const line=rows.find(r=>r.seed===s).line;
   const sent=isLabel?line:(line.split(/(?<=\.) /)[0]);
   const facts=[];if(gov){const pg=fs.readFileSync(B+'tip/dumps/'+s+'.txt','utf8').split('\n');const u=pg.find(l=>/^Underworld: /.test(l));facts.push(`Power tab: Ruler ${gov.n} (Criminal, power ${gov.p}) governs the ${t.tier}`+(u?`; this same Defense section prints '${u}'`:''));}if(tg)facts.push(`roster and this tab's 'Active criminal operations' hold '${tg}'`);
   if(contra)facts.push(`the line's own next sentence says ${/Few thefts/.test(line)?"'a thieves' guild settles them first'":"'The thieves ... answer to a guild, and the guild decides who works which streets'"}`);
   ex.push({seed:s,sentence:contra?line:sent,fact:facts.join("; "),_gov:!!gov});}
  else tr.push(s);}
 R.trueTowns=tr.length;R.falseTowns=fl.length;
 R.verdict=fl.length===0?"TRUE":fl.length===seeds.length?"FALSE":"MIXED";
 const anyGov=ex.some(e=>e._gov);
 R.severity=fl.length===0?null:(contra?"HIGH":anyGov?"HIGH":"MED");R.kind=fl.length===0?null:(contra?"g":anyGov?"c,g":"g");
 ex.sort((a,b)=>b._gov-a._gov);R.examples=ex.slice(0,5).map(({_gov,...e})=>e);
 const ng=ex.filter(e=>e._gov).length;
 R.note=fl.length===0?"True in every town: the opener's 'no head / rival crews / who takes the cut changes' stands with Rival Gangs or Multiple criminal factions on the roster (or two contesting criminal powers on the Power tab) and no criminal power in the seat; the second sentence's black market / smuggling / gangs / tier word all match the roster and tier.":
  (contra?"Self-contradicting line: the opener says the crime has no head / is contested, the second sentence (true: the roster holds a Thieves' guild) says a guild runs it."+(ng?` ${ng} of these towns are also ruled by a criminal power.`:""):
  `False where a criminal power holds the seat (${ng}; HIGH) or the roster holds a thieves' guild (${fl.length-ng} more; MED: the generator classes 160 of 181 thieves'-guild towns 'organized'). Second sentences (black market, smuggling, gangs, the tier word) are true in every town.`)+(isLabel?" The label/note print in a town with a governing criminal power or a thieves' guild in 36 of 289.":"");
 out.push(R);}
const asides=[
 "LOW, not counted false: in 66 of the 253 towns where the semi-organized label/opener is counted true, the Power tab's only criminal power is 'Thieves' Guild' and this same Defense section prints 'Underworld: Thieves' Guild · <band>' (desc 'Underworld effectively controls vice, smuggling, and key officials' or 'Organised criminal network controls the black market'), beside 'lacks a single controlling authority ... Less predictable than a guild'. The roster holds Multiple criminal factions / Rival Gangs, which supports the label, so the record does not settle it.",
 "LOW, rival crews with no Rival Gangs on the roster: 4 towns (r2s-insurgency-city-2, rr3-city-famine-rand-1, rr3-city-famine-port-0, rr3w-city-famine-port-0) print 'Rival crews ... fighting' with no Rival Gangs/Multiple criminal factions; each has a second criminal power contesting the Thieves' Guild's niche on the Power tab, so counted true.",
 "OUT OF SCOPE (old lines, not new): 'Criminal structure: Semi-organized networks' prints in 26 towns whose record has no criminal institution at all (e.g. rr3w-town-under_siege+famine-rand-0, r2r-hamlet-17, r2r-village-0), where 'coordinated enough to maintain routes and territories' names operations the town lacks (kind a).",
 "No Arcane Support or Naval Defense row is new in any town in this file; none was read. No broken text, slot, identifier or wrong tier word in any new line (tier word city/metropolis matches the record in 286/286 prose lines; black-market, smuggling and gang second sentences all match the roster)."];
fs.writeFileSync("result.json",JSON.stringify({families:out,asides},null,1));
for(const r of out)console.log(r.verdict,r.severity,r.falseTowns+"/"+r.towns,r.fam.slice(37,150));
