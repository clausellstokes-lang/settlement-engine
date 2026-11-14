import {createRequire} from 'module';const require=createRequire(import.meta.url);
const {L,rec,crises,page,tabs}=require('./lib.js');
const fs=require('fs');
const T='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/wt/tip';
const {isMarketInstitution}=await import(T+'/src/domain/facts/market.js');
const {isLiveInstitution}=await import(T+'/src/domain/institutions/institutionRoster.js');
const live=(r,re)=>r.institutions.filter(i=>re.test(i.name)&&isLiveInstitution(i));
const anyRe=(r,re)=>r.institutions.filter(i=>re.test(i.name));
const CLOSE=/closed against the sickness[^.]*turn back travellers and traders|Nobody comes into [^.]* and nobody leaves/;
const SEV={ // severity for plague-closure contradiction per line
 'DS-GEN-13::MARKET-OPEN::v3':'MED','DS-GEN-13::ENTREPOT::v1':'MED','DS-GEN-13::COMMERCE: a bank::v1':'MED','DS-GEN-13::COMMERCE: a merchant guild, no bank::v1':'MED','DS-GEN-13::COMMERCE: a merchant guild, no bank::v4':'MED','DS-GEN-13::WAREHOUSES::v4':'MED','DS-GEN-17::GREAT HOUSE: monastery::v3':'MED',
 'DS-GEN-13::WAREHOUSES::v1':'LOW','DS-GEN-13::COMMERCE: craft guilds, no merchant guild::v4':'LOW','DS-GEN-17::GREAT HOUSE: monastery::v1':'LOW'};
const out={};
for(const l of L){if(!/DS-GEN-13|monastery/.test(l.id)||!l.prints.length)continue;const res={t:0,f:[],low:[]};
 for(const p of l.prints){const r=rec(p.town);const cs=crises(p.town);const pg=page(p.town);const pr=p.page.map(v=>v.printed).join(' ');
  const F=[],W=[];const mk=r.institutions.filter(i=>isMarketInstitution(i)&&isLiveInstitution(i));
  const tw=(pr.match(/\b(?:the )(thorp|hamlet|village|town|city|metropolis)(?:'s| does| could| trades)/)||[])[1];
  if(tw&&tw!==r.tier)F.push('tier word '+tw+' vs '+r.tier);
  if(/NO-MARKET/.test(l.id)){if(mk.length)F.push('has market '+mk.map(i=>i.name));
    const fairish=anyRe(r,/\b(market|fair|bazaar|trading post|exchange)\b/i).filter(i=>!/black market|whisper market|smuggl/i.test(i.name));if(fairish.length)F.push('market-ish inst '+fairish.map(i=>i.name+'['+(i.status||'')+']'));
    if(/siege/.test(l.text)&&!cs.includes('under_siege'))F.push('no siege');
    if(/v3$/.test(l.id)&&cs.includes('under_siege'))F.push('siege');
  } else if(/MARKET-OPEN|ENTREPOT/.test(l.id)){if(!mk.length)F.push('no live market');
    if(/ENTREPOT/.test(l.id)&&r.economicState.isEntrepot!==true)F.push('not entrepot');
    if(/MARKET-OPEN/.test(l.id)&&['isolated','mountain_pass','mountain_road'].includes(r.config.tradeRouteAccess))F.push('narrow access');
    if(/v6$/.test(l.id)&&!cs.includes('plague_onset'))F.push('no plague');
    if(/v1$/.test(l.id)&&/MARKET-OPEN/.test(l.id)){if(cs.includes('monster_pressure'))W.push('roads bring buyers vs "carts stop coming" (monster_pressure)');if(cs.includes('famine'))W.push('market day fills under famine');}
  }
  if(/COMMERCE: a bank::/.test(l.id)){const b=live(r,/\bbank|banking|money ?changer|counting ?house/i);if(!b.length)F.push('no live bank: '+anyRe(r,/bank/i).map(i=>i.name+'['+i.status+']'));}
  if(/merchant guild, no bank/.test(l.id)){const g=live(r,/merchant/i).filter(i=>/guild|hall|compan/i.test(i.name));if(!g.length)F.push('no live merchant guild: '+anyRe(r,/guild/i).map(i=>i.name));const b=live(r,/\bbank|banking/i);if(b.length)F.push('has bank '+b.map(i=>i.name));}
  if(/craft guilds/.test(l.id)){const g=live(r,/guild/i).filter(i=>!/merchant|thieves|mage|wizard/i.test(i.name));if(!g.length)F.push('no live craft guild');if(live(r,/merchant/i).filter(i=>/guild/i.test(i.name)).length)F.push('has merchant guild');}
  if(/WAREHOUSES/.test(l.id)){const w=live(r,/warehouse/i);if(!w.length)F.push('no live warehouse: '+anyRe(r,/warehouse/i).map(i=>i.name+'['+i.status+']'));
    if(/v3$/.test(l.id)&&cs.includes('famine'))F.push('MED:"fill after the harvest" under famine (harvest lost)');}
  if(/monastery/.test(l.id)){const m=live(r,/monaster|abbey|priory|friary|convent/i);if(!m.length)F.push('no live monastery: '+anyRe(r,/monaster|abbey|priory|friary/i).map(i=>i.name+'['+i.status+']'));}
  if(/under_siege/.test(cs.join())&&!/siege/.test(l.text))F.push('siege in force');
  if(CLOSE.test(pg)&&SEV[l.id]){const q=(pg.match(CLOSE)||[''])[0];(SEV[l.id]==='MED'?F:W).push(SEV[l.id]+': plague closure: "'+q.slice(0,110)+'"');}
  if(F.length)res.f.push(p.town+' ['+r.tier+','+(cs.join('+')||'calm')+']: '+F.join(' | '));else res.t++;
  if(W.length)res.low.push(p.town+': '+W.join(' | '));
 }
 out[l.id]=res;console.log('##',l.id,'true',res.t,'false',res.f.length);res.f.forEach(x=>console.log('  F',x.slice(0,330)));res.low.forEach(x=>console.log('  L',x.slice(0,250)));
}
fs.writeFileSync(new URL('./mktres.json',import.meta.url),JSON.stringify(out));
