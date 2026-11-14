import {createRequire} from 'module';const require=createRequire(import.meta.url);
const {L,rec,crises,page,tabs}=require('./lib.js');
const T='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/wt/tip';
const {defenceOf}=await import(T+'/src/domain/facts/defence.js');
const {isLiveInstitution}=await import(T+'/src/domain/institutions/institutionRoster.js');
for(const id of ['DS-GEN-17::GARRISONED::v1','DS-GEN-17::GARRISONED::v2']){const l=L.find(x=>x.id===id);let t=0;const f=[],notes=[];
 for(const p of l.prints){const r=rec(p.town);const d=defenceOf(r);
  const forceRe=/garrison|watch|guard|mercenar|barracks|militia|soldier|company|knight|army|fort|citadel|patrol|constab|sheriff|warden/i;
  const forces=r.institutions.filter(i=>forceRe.test(i.name)||/Defense|Military/i.test(i.category||'')).map(i=>i.name+(i.status?'['+i.status+']':''));
  const paid=d.garrison||d.watch||d.mercenary||r.economicState?.compound?.inst?.hasNavy===true;
  const probs=[];
  const tierWord=p.page[0].printed.match(/^The (\w+) keeps|^The (\w+) pays/);const tw=tierWord&&(tierWord[1]||tierWord[2]);
  if(tw&&tw!==r.tier)probs.push('tier word '+tw+' vs '+r.tier);
  if(!paid)probs.push('no paid force: '+forces.join(';'));
  if(id.endsWith('v2')&&!d.walls)probs.push('no walls');
  if(id.endsWith('v2')&&d.walls&&d.wallKind==='palisade')notes.push(p.town+': walls are palisade');
  if(crises(p.town).includes('occupied'))probs.push('occupied');
  // page: walls ruined / no walls?
  const pg=page(p.town);if(id.endsWith('v2')&&/no walls|has no wall|without walls|unwalled/i.test(pg))probs.push('page says no walls: '+(pg.match(/.{0,60}(no walls|has no wall|without walls|unwalled).{0,60}/i)||[''])[0]);
  if(/no (?:garrison|soldiers|guard|watch)\b|nobody (?:stands )?guard|no one (?:keeps|stands) (?:watch|guard)|keeps no (?:guard|watch|soldiers)/i.test(pg))probs.push('page denies force: '+(pg.match(/.{0,70}(no (?:garrison|soldiers|guard|watch)\b|nobody (?:stands )?guard|no one (?:keeps|stands) (?:watch|guard)|keeps no (?:guard|watch|soldiers)).{0,70}/i)||[''])[0]);
  if(probs.length)f.push(p.town+' ['+r.tier+','+(crises(p.town).join('+')||'calm')+']: '+probs.join(' | '));else t++;
  if(process.argv[2]===p.town)console.log(p.town,JSON.stringify(d),forces);
 }
 console.log('##',id,'true',t,'false',f.length);f.forEach(x=>console.log('  F',x.slice(0,400)));console.log('  notes',notes.length,notes.slice(0,5));}
