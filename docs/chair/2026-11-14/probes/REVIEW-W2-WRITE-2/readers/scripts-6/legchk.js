const {L,rec,crises,tabs,page}=require('./lib');
const band=y=>y>60?'older than its bearers':y>15?'a generation old':y>10?'a decade old':y>1?'years old':'not yet a year old';
const out={};
for(const l of L.filter(x=>x.id.includes('LEGACY')&&x.prints.length)){
 const res={t:0,f:[],low:[],notes:{}};
 for(const p of l.prints){const r=rec(p.town);const a=r.history.legacyAnnotations[0];const cal=a.eventName.replace(/^The /,'').toLowerCase();
  const pr=p.page.map(v=>v.printed);const problems=[],lows=[];
  if(!pr.every(x=>x.includes(cal)))problems.push('calamity word mismatch');
  if(!pr.every(x=>x.includes(band(a.yearsAgo))))problems.push('band mismatch '+a.yearsAgo);
  const ev=r.history.historicalEvents.find(e=>e.name===a.eventName);
  if(!ev)problems.push('event not in record');
  else if(ev.yearsAgo!==a.yearsAgo)problems.push('years differ ev '+ev.yearsAgo+' ann '+a.yearsAgo);
  if(/^(plague years|heresy trials)$/.test(cal))problems.push('agreement: "'+cal+' is"');
  const H=(tabs(p.town)['World/History']||[]).join('\n');
  const unA=new RegExp('(The '+cal+' happened here, but [^.]*moved on|remembers the '+cal+' as an event that happened)','i');
  if(unA.test(page(p.town)))problems.push('page calls same event unanchored');
  if(ev&&ev.anchored===false)lows.push('record event anchored=false');
  const cs=crises(p.town);
  if((cal==='siege'&&cs.includes('under_siege'))||(cal==='occupation'&&cs.includes('occupied')))lows.push('names past '+cal+' while one is in force');
  if(l.id.includes('RECOVERED')&&/compact|construction|pilgrimage|migration/.test(cal))lows.push('"came through"/"built in answer" a non-blow: '+cal);
  // pdf check
  if(problems.length){res.f.push(p.town+': '+problems.join('; '));}else res.t++;
  if(lows.length)res.low.push(p.town+': '+lows.join('; '));
 }
 out[l.id]=res;
 console.log('##',l.id,'true',res.t,'false',res.f.length);res.f.forEach(x=>console.log('  F',x));console.log('  LOW count',res.low.length);res.low.slice(0,40).forEach(x=>console.log('   L',x));
}
require('fs').writeFileSync(__dirname+'/legres.json',JSON.stringify(out));
