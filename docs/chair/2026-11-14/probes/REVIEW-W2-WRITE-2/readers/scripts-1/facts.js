const fs=require('fs'),z=require('zlib');const R=process.env.R||'/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/r/tip';
const cache={};
function rec(town){if(!cache[town])cache[town]=JSON.parse(z.gunzipSync(fs.readFileSync(`${R}/records/${town}.json.gz`)));return cache[town];}
function page(town){return fs.readFileSync(`${R}/dumps/${town}.txt`,'utf8');}
function facts(town){const t=rec(town);const es=t.economicState||{};const inst=es.compound?.inst||{};
 const st=[];if(t.stress?.type)st.push(t.stress.type);if(Array.isArray(t.stressors))for(const s of t.stressors)if(s?.type&&!st.includes(s.type))st.push(s.type);
 if(Array.isArray(t.stresses))for(const s of t.stresses)if(s?.type&&!st.includes(s.type))st.push(s.type);
 const live=(t.institutions||[]).filter(i=>!i.status||!/ruin|destroy|abandon|closed|collapsed/i.test(String(i.status)));
 const def=live.filter(i=>i.category==='Defense').map(i=>i.name+(i.status?`[${i.status}]`:''));
 const ch=Object.fromEntries((es.activeChains||[]).map(c=>[c.chainId,c.status]));
 const fr=es.foodSecurity?.foodRecord||{};
 return {town,tier:t.tier,pop:t.population,stress:st,mt:t.config?.monsterThreat,def,
  inst:{walls:inst.hasWalls,gates:inst.hasGates,garrison:inst.hasGarrison,militia:inst.hasMilitia,watch:inst.hasWatch,merc:inst.hasMercenary,charter:inst.hasCharterHall,court:inst.hasCourtSystem,prison:inst.hasPrison},
  scores:t.defenseProfile?.scores&&{mil:t.defenseProfile.scores.military,mon:t.defenseProfile.scores.monster,int:t.defenseProfile.scores.internal,eco:t.defenseProfile.scores.economic},
  cm:t.defenseProfile?.chainModifiers,chains:{garrison:ch.garrison,fortification:ch.fortification,mercenary:ch.mercenary,food_processing:ch.food_processing},
  food:{band:fr.band,months:fr.storageMonths,gap:fr.gapPct},pros:es.prosperity,safety:es.safetyProfile?.safetyLabel};}
module.exports={rec,page,facts};
if(require.main===module){for(const a of process.argv.slice(2))console.log(JSON.stringify(facts(a)));}
