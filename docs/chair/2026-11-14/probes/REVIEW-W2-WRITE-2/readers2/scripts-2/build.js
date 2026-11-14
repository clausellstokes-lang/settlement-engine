const fs=require('fs');const L=require('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-2.json');
const split=s=>s?s.match(/[^.!?]+[.!?]+["')]*\s*|[^.!?]+$/g).map(x=>x.trim()):[];
// V[i] = {def:{t:bool,sev,fact}, towns:{town:{t,sev,fact}}, rep:{def:'true'|'silence', towns:{town:{sev,fact}}}, note}
const F=(sev,fact)=>({t:false,sev,fact}),T=(fact)=>({t:true,sev:null,fact});
const V={
0:{def:T('Prosperity Poor/Struggling; plague: "fewer come to market, travel discouraged" fits "little of it stops".'),note:'Removed line was true under plague onset; nothing replaces it (prosperity header now has no sentence).'},
1:{def:F('LOW','(c)/(g) "the road is busy" vs the page\'s plague note "travel is discouraged" and "quarantine have emptied the market"; market/poor parts true.'),note:'Only the "road is busy" clause is wrong under plague; silence in its place.'},
2:{def:T('No market institution in record; poor (Struggling/Poor).'),note:'True; silence in its place.'},
3:{def:F('MED','(b) "a nuisance, nothing more" beside organised crime on the page'),towns:{
 'r2r-city-13':F('HIGH','(b) record: Multiple criminal factions, Contract killer, Black market, Whisper market; criminal capture "corrupted".'),
 'r2r-city-22':F('HIGH','(b) Thieves\' Guild faction, Multiple criminal factions, Black market; capture adversarial.'),
 'r2r-city-35':F('MED','(b) Black market + Front businesses on page (Criminal economy, operational).'),
 'r2r-city-52':F('HIGH','(b) Smuggling network, Multiple criminal factions, Black market; criminal priority 87.'),
 'rww-city-calm-1':F('HIGH','(b) Thieves\' guild chapter, Smuggling network, Black market.'),
 'r2s-monster_pressure-city-3':F('HIGH','(b) Thieves\' guild chapter, Smuggling network, Whisper market, Black market.'),
 'r2s-plague_onset-city-0':F('MED','(b) Black market + Front businesses.'),
 'r2s-succession_void-city-1':F('MED','(b) Black market + Front businesses, gambling halls.'),
 'r2r-hamlet-20':F('LOW','Smuggling waypoint in record: more than unlicensed trade, a stretch.'),
 'r2s-famine-hamlet-3':T('No criminal institutions.'),
 'rv2-hamlet-under_siege-1':T('No criminal institutions.'),
 'r2r-metropolis-12':F('HIGH','(b) Thieves\' guild (powerful), Assassins\' guild, Underground city, Smuggling network.'),
 'r2r-metropolis-36':F('HIGH','(b) Multiple criminal factions, Smuggling network, Underground network, Black market bazaar.'),
 'r2r-metropolis-55':F('HIGH','(b) Multiple criminal factions, Underground city, Rookery, Contract killer, Black market bazaar.'),
 'rww-metropolis-infiltrated-1':F('HIGH','(b) Thieves\' guild (powerful).'),
 'r2s-monster_pressure-metropolis-1':F('HIGH','(b) Thieves\' guild (powerful), Whisper market.'),
 'rv2-metropolis-monster_pressure-2':F('HIGH','(b) Thieves\' guild (powerful), Underground city; Thieves\' Guild faction.'),
 'r2s-politically_fractured-metropolis-0':F('HIGH','(b) Assassins\' guild, Multiple criminal factions, Underground city, Thieves\' Guild faction.'),
 'r2s-religious_conversion-metropolis-3':F('HIGH','(b) Thieves\' guild (powerful), Underground network.'),
 'r2s-famine-thorp-0':T('No criminal institutions.'),
 'r2s-under_siege-thorp-3':T('No criminal institutions.'),
 'r2r-town-30':F('MED','(b) Street gang, gambling den.'),
 'r2r-town-42':F('MED','(b) Smuggling operation, Underground network.'),
 'r2r-town-55':F('MED','(b) criminal capture "corrupted", Corrupt Council faction power 52.'),
 'r2s-indebted-town-3':F('HIGH','(b) Thieves\' Guild faction (power 28), Street gang, Front businesses; capture "corrupted".'),
 'r2r-town-5':F('MED','(b) Smuggling operation.'),
 'r2s-occupied-town-3':F('MED','(b) Smuggling operation, Rookery; capture "corrupted".'),
 'r2s-recently_betrayed-town-2':F('MED','(b) capture "corrupted", Corrupt Council faction.'),
 'r2r-village-4':F('LOW','Smuggling waypoint; a stretch.'),
 'r2s-under_siege-village-1':T('No criminal institutions.')},
 rep:{def:'true',towns:{
 'r2s-under_siege-thorp-3':{sev:'LOW',fact:'(a) "annoy the clerks" in a thorp of 7 with no office or clerk (Subsistence farming, Fishing community, Woodcutter\'s camp only).'},
 'rv2-hamlet-under_siege-1':{sev:'LOW',fact:'(a) "clerks" in a hamlet of 32 with no government or toll house.'},
 'r2s-under_siege-village-1':{sev:'LOW',fact:'(a) "clerks" in a village of 95 with no government house.'}}},
 note:'Removed line denied organised crime in 23 of 30 towns; "somebody organises it" replacements match the record.'},
4:{def:T('Pressured; 25% of need imported; plague does not cut the roads.'),note:'True; silence.'},
5:{def:T('Grown 46-65% of need, the rest imported (record food figures).'),rep:{def:'silence',towns:{'r2r-town-37':{t:true}}},note:'True; one reworded fishing sentence (true), else silence.'},
6:{def:F('MED','(c) under siege: page says "Field work and trade have stopped", "market is shut"; "unreliable, a trader never knows" understates a total closure.'),note:'False under a siege; silence in its place.'},
7:{def:F('HIGH','(a)/(c) hamlet/thorp keeps only a Wayside shrine, "Access to parish church", Burial ground; income is Agricultural Rents 61-100% with no religious line.'),
 rep:{def:'true',towns:{
 'r2s-plague_onset-hamlet-3':{sev:'MED',fact:'(b)/(g) Resources tab lists Gemstone Deposits (output "luxury"), available.'},
 'r2s-religious_conversion-hamlet-1':{sev:'MED',fact:'(b)/(g) Resources tab lists Gemstone Deposits (output "luxury"), available.'},
 'r2r-thorp-15':{sev:'MED',fact:'(b)/(g) Resources tab lists Precious Metals (luxury, gems), available.'},
 'r2r-thorp-29':{sev:'MED',fact:'(b)/(g) Resources tab lists Precious Metals (luxury, gems), available.'},
 'r2s-under_siege-thorp-2':{sev:'MED',fact:'(b)/(g) Resources tab lists Gemstone Deposits (output "luxury"), available.'}}},
 note:'Removed line was false everywhere; 5 replacements say "produces no luxury goods" beside gem/precious-metal deposits.'},
8:{def:F('HIGH','(a)/(c) no religious house (Wayside shrine, Access to parish church, Burial ground only); income Agricultural Rents 64-100%, no religious line.'),rep:{def:'true'},note:'Removed line false everywhere; critical-import replacements check out.'},
9:{def:F('MED','(f)/(g) page Food Security shows imports covering a large share (and divine provision/stores): "lived off X and little else ... nothing else to turn to" is against the figures.'),towns:{
 'rv2-city-famine-1':F('MED','(f) grown 25%, imports 57%, magic 7%, granary 8 months.'),
 'r2s-famine-hamlet-2':F('MED','(f) grown 35%, imports 45%, magic 8%.'),
 'r2s-famine-hamlet-3':F('LOW','grown 48%, imports 18%: "nothing else" a stretch.'),
 'rv2-hamlet-famine-1':F('MED','(f) grown 38%, imports 37%.'),
 'r2s-occupied-hamlet-1':F('MED','(f) no imports, but 29% of food by spell or prayer.'),
 'r2s-famine-metropolis-1':F('MED','(f) grown 19%, imports 39%, magic 27%, 14 months stores.'),
 'r2s-famine-metropolis-2':F('MED','(f) grown 19%, imports 49%, magic 10%, 13 months stores.'),
 'rv2-metropolis-famine-2':F('MED','(f) grown 17%, imports 63%, magic 13%, 15 months stores.'),
 'rw3-thorp-famine-1':F('MED','(f) grown 35%, imports 39%.'),
 'r2s-famine-village-1':F('MED','(f) grown 38%, imports 32%.'),
 'rv2-village-famine-2':F('MED','(f) grown 39%, imports 37%, magic 9%.'),
 'rv2-village-under_siege+famine-1':T('Siege: imports 0, magic 0, stores 0.1 months; grain failed.'),
 'rv2-village-under_siege+famine-2':T('Siege: imports 0, magic 0; grain failed.')},
 rep:{def:'true'},note:'Struck line contradicted the import/magic figures in 11 of 13; replacements (single source, spell/prayer share) match the record.'},
10:{def:T('Under siege, several exports, all shut in (record: "trade has stopped").'),towns:{'r2s-under_siege-town-3':F('LOW','(e) "several kinds" for 2 exports (tools/weapons, letters of credit).')},
 rep:{def:'true',towns:{'r2s-under_siege-town-3':{sev:'LOW',fact:'(e) "several trades" for 2 exports.'}}},note:'True; reworded past-tense replacement equally true.'},
11:{def:T('Partially exploited chain on the page; siege closes the roads.'),rep:{def:'true',towns:{'r2r-metropolis-14':{silence:true},'r2s-under_siege-city-1':{sev:'LOW',fact:'(h)/(b) "coal or peat deposits" worked out: only coal_deposits is depleted; peat (marshlands) is available.'}}},note:'True (its "this trade" leans on the chip above); replacements mostly the depletion line with the town named.'},
12:{def:T('Good is a critical import the terrain cannot give; the house (Mill/Vintner/Potter/Smelter) exists; siege in force.'),rep:{def:'silence',towns:{'rv2-city-under_siege+famine-1':{t:true},'rv2-metropolis-under_siege+famine-1':{t:true}}},note:'True; struck as a duplicate of v3; 2 towns get the v3 wording (true), 15 silence.'},
13:{def:T('Critical import, no primaryImports, no house using it.'),towns:{'r2s-succession_void-thorp-0':F('MED','(b) "neither grows ... any luxury goods": record and Resources tab have Precious Metals (luxury, gems) available.')},
 rep:{def:'true',towns:{'r2s-succession_void-thorp-0':{sev:'MED',fact:'(b)/(g) "produces no luxury goods": Precious Metals (luxury, gems) available on the Resources tab.'}}},note:'True in 10 of 11; replacements true but one keeps the gem-deposit denial.'},
14:{def:F('LOW','(c) record holds no faith spending or religious income share (Agricultural Rents 61-100%); "felt in its money first" a stretch.'),
 rep:{def:'true',towns:{'rv2-thorp-under_siege+famine-2':{silence:true},'rv2-thorp-monster_pressure-2':{sev:'MED',fact:'(b)/(g) "None of the luxury goods ... comes from the country": Gemstone Deposits (luxury) available on Resources tab.'}}},
 note:'Removed line a doubtful stretch; "keeps no house" replacements true.'},
15:{def:F('LOW','(c) "Traffic moves along ... every day" vs page plague note "travel is discouraged", quarantine keeps people from trading.'),towns:{'r2s-plague_onset-village-1':F('LOW','(c) as above, and "moves along Erdenordu\'s crossroads" (slot word wrong kind).')},note:'Doubtful under plague; silence.'},
16:{def:F('MED','(c)/(g) foodSecurity Secure, granary 15-15.5 months on the page ("Stores: a granary, 16 months"): "fed only just, a poor harvest felt at every table" is false.'),
 rep:{def:'true',towns:{
 'r2r-metropolis-28':{sev:'MED',fact:'(g) same paragraph: stores "would carry it through a bad harvest and well beyond", then "a bad season for the fishing is felt at every table"; 15.3 months stores.'},
 'r2r-metropolis-29':{sev:'MED',fact:'(g) same paragraph: "stores would cover" one poor harvest, then "one bad year for the grain harvest would cost the whole metropolis dear"; 15 months stores.'},
 'r2r-metropolis-16':{sev:'LOW',fact:'(g) "stores would cover it" beside "one bad year for the fishing would cost ... dear".'},
 'r2r-metropolis-48':{sev:'LOW',fact:'(g) "stores would cover it" beside "one bad year for the fishing would cost ... dear".'}}},
 note:'Removed line false in all 30 (15 months stores); replacements right except two single-source lines that undo the stores line.'},
17:{def:F('MED','(c) under siege ("Field work and trade have stopped"): diversification "a bad year for one is not a bad year for everyone" presumes normal trade.'),
 rep:{def:'true',towns:{'rw3-town-under_siege+famine-1':{sev:'MED',fact:'(c) siege in force ("Field work and trade have stopped", "market is shut") yet "has more than one trade sending goods out, and the famine has made every one ... harder".'}}},note:'Removed line false under siege; one replacement names famine and keeps trade running under siege.'},
18:{def:T('Fully exploited chain shown on the page.'),rep:{def:'true',towns:{'rv2-metropolis-under_siege-16':{silence:true},'rv2-metropolis-under_siege-19':{silence:true},'rw3-metropolis-under_siege-1':{silence:true}}},note:'True; replacements name the chain correctly.'},
19:{def:T('House exists, good is a critical import, siege closes the roads.'),rep:{def:'silence'},note:'True; silence in all 22.'},
20:{def:F('MED','(c) "real weight in its money" vs Agricultural Rents 90%/no religious line; under siege people cannot leave on feast days ("nothing is bought or sold").'),note:'False; silence.'},
21:{def:F('MED','(c) under siege the page says "nothing is bought or sold"; feast-day buying and people leaving with offerings presume open roads.'),rep:{def:'silence',towns:{'r2s-under_siege-hamlet-1':{t:true}}},note:'False under siege; one true timber line, one silence.'}
};
const out=[];let totR=0,totT=0;const hm=[];
L.forEach((r,i)=>{const v=V[i];let rt=0,rf=0,worst=null;const ord={HIGH:3,MED:2,LOW:1};const ex=[];let trueEx=null;
 const rep={silence:0,true:0,false:0,falseExamples:[]};
 for(const t of r.read){const d=(v.towns&&v.towns[t.town])||v.def;const name=t.town;
  if(d.t){rt++;if(!trueEx)trueEx={town:name,removed:t.removedSentence,true:true,severity:null,fact:d.fact};}
  else{rf++;if(!worst||ord[d.sev]>ord[worst])worst=d.sev;ex.push({town:name,removed:t.removedSentence,true:false,severity:d.sev,fact:d.fact});}
  const b=split(t.baseParagraph),p=split(t.tipParagraph);const added=p.filter(x=>!b.includes(x));
  const rv=(v.rep&&v.rep.towns&&v.rep.towns[t.town])||null;const rdef=(v.rep&&v.rep.def)||'silence';
  if(t.tipParagraph===null||added.length===0||(rv&&rv.silence)){rep.silence++;}
  else if(rv&&rv.sev){rep.false++;rep.falseExamples.push({town:name,sentence:added.join(' '),severity:rv.sev,fact:rv.fact});if(rv.sev!=='LOW')hm.push(r.id+' | '+name+' | '+rv.sev);}
  else if((rv&&rv.t)||rdef==='true'){rep.true++;}
  else {console.error('UNJUDGED replacement',i,name,added);}
 }
 if(trueEx)ex.push(trueEx);totR+=r.read.length;totT+=rt;
 out.push({id:r.id,read:r.read.length,removedTrue:rt,removedFalse:rf,removedFalseWorst:worst,examples:ex,replacement:rep,note:v.note});
});
fs.writeFileSync('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/out-2.json',JSON.stringify(out,null,1));
console.log('removals',L.length,'prints',totR,'removedTrue',totT);
for(const o of out)console.log(o.id.slice(0,60),o.read,o.removedTrue,o.removedFalse,o.removedFalseWorst,JSON.stringify({s:o.replacement.silence,t:o.replacement.true,f:o.replacement.false}));
console.log(hm.join('\n'));
