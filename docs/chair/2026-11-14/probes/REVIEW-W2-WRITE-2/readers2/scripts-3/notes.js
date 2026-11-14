const fs=require('fs');const P='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/out-3.json';
const o=JSON.parse(fs.readFileSync(P));const N=[
'Plague town: "market fills" against an emptied market; the replacement line about the market site is true.',
'Plague towns, no transit: through-traffic claim false; replacements true (thinned market / site / location).',
'Siege: a line about the market site is true; the removal was over-strict; the "grew up on the road\'s trade" replacement is equally true.',
'Siege: entrepot living false at a glance; nothing replaces it.',
'Siege: the "on the road" clause contradicts "nothing comes in by road"; the trimmed "no market" replacements are true.',
'Siege: the "passing traveller" bank line is a stretch; the bank replacements are true.',
'Siege: dealings carried outward is false; the "members do the buying and selling" replacement is true.',
'Siege: the outside-trader rule is a stretch; replacement true.',
'Guild entry rule true under siege; removal over-strict; replacements true.',
'Siege: road-to-buyer storage false; the "store a cargo" capability replacement is true.',
'Siege: the "trades out of them" cycle is false; replacement true.',
'Siege: the "between journeys" line is a stretch; replacement true.',
'Mount not found before or after (base/tip null); judged from the template and the record: occupied and Poor, the occupiers take the revenue. Nothing prints in its place.',
'Mount null; the removed and added text was recovered from the same town\'s market paragraph in other list entries. "Way into" a besieged town is false; the monk replacements are true.',
'Charity rule true under siege; removal over-strict; replacements true.',
'Single-ruler seats called a body that "must agree": all false. Replacement "fears the town turning on it" is false beside an Endorsed rating.',
'Same as v1.',
'Same as v1; most Endorsed and Approved metropolises are r2r-calm.',
'Record flags merchantArmy; the line is true; its mount prints nothing now.',
'Insurgency/revolt: danger is in the streets; the "officials paid little" replacement is true; Ardbridge is silent.',
'Siege: arrivals bypassing the gate contradict "nothing comes in by road"; nothing replaces it.',
'Inverts the occupation: false at a glance; 5 replacements are true, Dionpetra\'s "commander" line is LOW.',
'Struck line was true (good imported, siege in force); its rewording is equally true.',
'Siege: visitors cannot arrive (LOW); plague: true. All replacements true.',
'Mount null; occupied and Poor; nothing prints in its place.',
'Chains are only "vulnerable": the "short" claim is false outside siege/famine; 2 print the catalogue name "Tanner (established)"; 4 name a house the record words differently (Palisade, Garrison, Cartographer\'s guild). Replacements true.',
'Fractured/succession: rivals are the danger; Headman seats wrongly given "members" in their replacement.',
'Insurgency/revolt: the watch does not keep the streets; replacements true; Llanthwaite is silent.',
'Siege: no goods reach the town; Panteakra has no customs house; nothing replaces it.',
'Siege: no goods to go around customs; Longhu has no customs house; nothing replaces it.'];
o.forEach((x,i)=>x.note=N[i]);fs.writeFileSync(P,JSON.stringify(o,null,1));
let s={read:0,rt:0,rf:0,S:0,Tt:0,F:0};for(const x of o){s.read+=x.read;s.rt+=x.removedTrue;s.rf+=x.removedFalse;s.S+=x.replacement.silence;s.Tt+=x.replacement.true;s.F+=x.replacement.false;}console.log(s,o.length);
const bysev={};for(const x of o)for(const e of x.examples)if(!e.true)bysev[e.severity]=(bysev[e.severity]||0)+1;console.log(bysev);
for(const x of o)for(const f of x.replacement.falseExamples)if(f.severity!=='LOW')console.log(f.severity,x.id,f.town);
