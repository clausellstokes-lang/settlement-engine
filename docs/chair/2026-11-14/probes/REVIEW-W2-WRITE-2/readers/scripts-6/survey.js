const {L,rec}=require('./lib');
for(const l of L){const P=l.prints||[];if(!P.length){console.log('##',l.id,'NO PRINTS');continue;}
 const tiers={},cr={},views={},pats={};
 for(const p of P){tiers[p.tier]=(tiers[p.tier]||0)+1;const c=(p.stress||[]).join('+')||'calm';cr[c]=(cr[c]||0)+1;
  for(const v of p.page||[]){views[v.view]=(views[v.view]||0)+1;const name=rec(p.town).name;const pat=v.printed.split(name).join('{S}');pats[pat]=(pats[pat]||0)+1;}
  if(!(p.page||[]).length){views['(none on page)']=(views['(none on page)']||0)+1;}
 }
 console.log('##',l.id,P.length);console.log(' tiers',JSON.stringify(tiers));console.log(' crisis',JSON.stringify(cr));console.log(' views',JSON.stringify(views));
 const ps=Object.entries(pats).sort((a,b)=>b[1]-a[1]);console.log(' patterns('+ps.length+')',JSON.stringify(ps.slice(0,6)).slice(0,900));
}
