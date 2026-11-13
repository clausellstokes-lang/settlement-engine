const T=process.env.TREE;
const PIC = await import(T+'/src/domain/display/prosperityInCrisis.js');
const CK = await import(T+'/src/domain/facts/crisisKind.js');
const base={economicState:{prosperity:'Struggling',prosperityStanding:'Comfortable'}};
for(const stress of [[{type:'mystery_event'}],[{type:'famine'},{type:'mystery_event'}],[],[{type:'famine'}]]){
  const s={...base,stress,stressors:stress}; let types; try{types=CK.activeCrisisTypes(s);}catch(e){types='ERR '+e;}
  console.log(JSON.stringify(stress.map(x=>x.type)),'active',JSON.stringify(types),'->',JSON.stringify(PIC.prosperityInCrisisLine(s)));
}
// master shape: no standing label
console.log('master shape ->',JSON.stringify(PIC.prosperityInCrisisLine({economicState:{prosperity:'Struggling'},stress:[{type:'famine'}]})));
// shown ABOVE standing (a crisis that raised it)
console.log('shown above standing ->',JSON.stringify(PIC.prosperityInCrisisLine({economicState:{prosperity:'Prosperous',prosperityStanding:'Moderate'},stress:[{type:'wartime'}]})));
