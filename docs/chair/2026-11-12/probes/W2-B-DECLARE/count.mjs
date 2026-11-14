// SECOND-WAVE-CENSUS counter: one test per pattern over OUT/dumps + OUT/corpus.ndjson.gz of TREE (env).
// Regex vocabulary = pools.snapshot.json (db832c892 ∪ 8866a0ddd) ∪ the counted tree's own pools. Prints a row per
// pattern: total, calm, crisis, then calm/crisis per size. Tests and their rows: SECOND-WAVE-CENSUS-2026-11-12.md.
import fs from 'node:fs';
import { loadCorpus, dump, views, sizeOf, armOf } from './load.mjs';
const R=process.env.TREE+'/src'; const TREES=[R]; const SNAP=JSON.parse(fs.readFileSync(new URL('./pools.snapshot.json', import.meta.url)));
const SIZES=['thorp','hamlet','village','town','city','metropolis'];
async function poolTexts(mod, wantKey){ const out=[]; for(const T of TREES){ let m; try{ m=await import(T+'/data/dossierStateProse/'+mod);}catch{continue;} for(const corp of Object.values(m)) if(corp&&typeof corp==='object') for(const blk of Object.values(corp)) { const pools=blk?.pools; if(!pools) continue; for(const [k,v] of Object.entries(pools)) if(wantKey(k)&&Array.isArray(v)) for(const x of v) out.push({key:k,text:x.text}); } } return out; }
const snapPlus=(k,own)=>{ const out=[...SNAP[k]]; for(const o of own) if(!out.some(x=>x.text===o.text)) out.push(o); return out; };
const toRe=(t)=>new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\\\{settlement\\\}/g,'.+?').replace(/\\\{[a-z]+\\\}/g,'.+?').replace(/\btown\b/g,'(?:thorp|hamlet|village|town|city|metropolis)'));
const capturePools=snapPlus('capture',await poolTexts('power.generated.js',k=>/^capture pressure/.test(k))).map(p=>({...p,re:toRe(p.text)}));
const beastPools=snapPlus('beast',await poolTexts('defense.generated.js',k=>/^Beasts & Monsters: /.test(k))).map(p=>({...p,re:toRe(p.text)}));
const magPools=snapPlus('mag',await poolTexts('economy.generated.js',k=>k==='INCOME WEIGHT: the practice of magic')).map(p=>({...p,re:toRe(p.text)}));
const relPools=snapPlus('rel',await poolTexts('economy.generated.js',k=>k==='INCOME WEIGHT: the religious houses')).map(p=>({...p,re:toRe(p.text)}));
const NOT_A_GOOD=[...new Set([...SNAP.notAGood, ...(await Promise.all(TREES.map(T=>import(T+'/data/tradeListDeclarations.js').then(m=>m.NOT_A_GOOD||[]).catch(()=>[])))).flat()])];
const LOCAL_COAL_LINE='Local coal fires the forges, but the iron is bought in; this income stream leans on the trade route.'; const { institutionDisplayName } = await import(R+'/domain/display/institutionDisplayName.js'); const perSeed={};
const corpus=loadCorpus(process.env.CORPUS);
const P={}; const ex={}; const P11K={}; const P4L={};
function hit(pat, seed, a, b){ (perSeed[seed] ||= new Set()).add(pat); (P[pat] ||= {}); const k=`${sizeOf(seed)}|${armOf(seed)}`; P[pat][k]=(P[pat][k]||0)+1; (ex[pat] ||= []); if(ex[pat].length<6) ex[pat].push({seed,a:String(a).slice(0,230),b:String(b).slice(0,230)}); }
const word={a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12};
function months(ph){ if(!ph) return null; ph=ph.toLowerCase(); if(/few weeks/.test(ph)) return 0.5; if(/about a month|^a month/.test(ph)) return 1; if(/more than two years/.test(ph)) return 24; if(/more than a year/.test(ph)) return 13; if(/about a year/.test(ph)) return 12; const m=ph.match(/(\w+) months/); if(m) return word[m[1]] ?? Number(m[1]); return null; }
const FOUNDER=/^(was founded by|was settled by|was established by|was founded as|grew because a healer|grew because a famous navigator|was founded by religious|was built around a single family)/;
const cls=(t)=>/military|soldier|veteran|garrison|command|war\b/.test(t)?'military':/religious|hermit|monk|priest|church|temple/.test(t)?'religious':/healer/.test(t)?'healer':/navigator|merchant|trade|consortium|coalition/.test(t)?'merchant':/family|mill/.test(t)?'family':/noble|lord|crown|royal|imperial|decree/.test(t)?'noble':'other';
const crimFaction=(s)=>(s.powerStructure?.factions||[]).filter(f=>f.category==='criminal'||/thie|gang|criminal|syndicate|smuggl|underworld|racket/i.test(f.faction||''));
const coverage={dumps:0};
const roster=(s)=>(s.institutions||[]).map(i=>String(i.name||'').toLowerCase());
const p12={}; const oq={};
for(const {seed,s} of corpus){
  const txt=dump(seed); if(!txt) continue; coverage.dumps++;
  const V=views(txt); const all=txt.split('\n');
  const E=V['Systems/Economics']||[], D=V['Systems/Defense']||[], PW=V['Systems/Power']||[], M=V['Systems/Magic']||[], H=V['World/History']||[], OV=V['Summary/Overview']||[], SV=V['Systems/Services']||[], NP=V['World/NPCs']||[];
  const fr=s.economicState?.foodSecurity?.foodRecord||{};
  // P1
  const onlyJust=E.find(l=>/is fed, but only just/.test(l)), grows=E.find(l=>/grows (a little more|more|far more) than it eats/.test(l));
  if(onlyJust&&grows) hit('P1a',seed,onlyJust,grows);
  const margin=E.find(l=>/feeds itself with a small margin/.test(l));
  if(margin && Number(fr.normalImportPct)>=25) hit('P1b',seed,margin,(E.find(l=>/^Production:/.test(l))||'')+` [record normalImportPct ${fr.normalImportPct}]`);
  // P2
  const st=E.find(l=>/^No granary;|^Stores: a granary/.test(l)); const fe=D.find(l=>/^Food endurance:/.test(l));
  if(st&&fe){ const m1=st.match(/^No granary; (.+?) in household stores|^No granary; (a few weeks) in the larder|^Stores: a granary,? (?:of )?(.+?)(?: of grain| that)/); const a=months(m1&&(m1[1]||m1[2]||m1[3])); const m2=fe.match(/for (.+?) at full rations/); const b=m2?months(m2[1]):null; (P.P2n ||= {n:0}); P.P2n.n++; if(a!=null&&b!=null&&a!==b) hit('P2',seed,st,fe); }
  // P3
  const noArc=D.some(l=>/No arcane practitioners on the rolls/.test(l));
  const relIdx=M.findIndex(l=>/^Reliance on magic/.test(l)); const relLine=M.find(l=>/^Reliance on magic: /.test(l))||''; const rel=/Relied upon|Integral/i.test(relLine);
  const avail=(M.find(l=>/^Availability/.test(l))||'').replace('Availability','');
  if(noArc&&rel) hit('P3rel',seed,relLine,'Arcane SupportNone · No arcane practitioners on the rolls');
  if(noArc&&/common|broad|pervasive/.test(avail)) hit('P3avail',seed,'Availability'+avail,'Arcane SupportNone · No arcane practitioners on the rolls');
  if(noArc&&(rel||/common|broad|pervasive/.test(avail))) hit('P3any',seed,relLine||avail,'No arcane practitioners');
  // P4
  const lvl=PW.find(l=>/Three powers stand almost level/.test(l));
  if(lvl){ const f=[...(s.powerStructure?.factions||[])].sort((a,b)=>b.power-a.power); const dom=PW.find(l=>/^Ruler.*Dominant/.test(l)); (P.P4labels ||= {n:0}); const rl=(PW.find(l=>/^Ruler/.test(l))||'').match(/(Dominant|Strong|Significant|Moderate|Minor|Contested)/); P4L[rl?rl[1]:'none']=(P4L[rl?rl[1]:'none']||0)+1; (P.P4n ||= {n:0}); P.P4n.n++; if(f.length>=3 && f[0].power-f[2].power>10) { if(dom) hit('P4dominant',seed,lvl.slice(lvl.indexOf('Three')).slice(0,60),dom); hit('P4',seed,lvl.slice(lvl.indexOf('Three')).slice(0,90),`${dom||'(no Dominant label)'} [powers ${f.map(x=>x.power).join('/')}]`); } }
  // P5a
  const free=PW.find(l=>/^Free of the criminals/.test(l));
  const cap=PW.find(l=>capturePools.some(p=>p.re.test(l)));
  if(free&&cap){ const p=capturePools.find(p=>p.re.test(cap)); hit('P5a',seed,free.slice(0,60),`[${p.key.slice(0,28)}] `+cap); }
  // P5b
  const diff=D.find(l=>/Criminal structure: Diffuse/i.test(l)||/books record no gang, guild or racket/.test(l));
  const gangP=PW.find(l=>/^Thieves' Guild|^Rival gangs|^Street gang|Thieves' Guild \(\d+\)|CriminalDominant|CriminalStrong|CriminalMinor|CriminalMajor/.test(l));
  const gangD=D.find(l=>/^Underworld: /.test(l));
  if(diff&&(gangP||gangD)) hit('P5b',seed,diff,'Power: '+(gangP||'')+' / Defense: '+(gangD||''));
  if(diff&&gangD) hit('P5bSameTab',seed,diff,gangD);
  // P6
  const impIdx=E.indexOf('Imports'); const imp=(impIdx>=0?E[impIdx+1]:'').toLowerCase();
  for(const l of (V['Systems/Resources']||[])){ const m=l.match(/^No (.+?) (?:reaches|reach) the (.+)\.$/); const m2=l.match(/exists but lacks access to (.+?)\.?$/); if(!m&&!m2) continue; const nouns=(m?m[1]:m2[1]).split(/, | or | and /); if(nouns.some(n=>imp.includes(n.toLowerCase()))){ hit('P6',seed,l,'Imports: '+E[impIdx+1]); break; } }
  // P7
  const org=(H.find(l=>/^Origin:/.test(l))||'').replace('Origin:',''), fb=(H.find(l=>/^Founded by:/.test(l))||'').replace('Founded by:','');
  if(org&&fb&&FOUNDER.test(org)&&!/^was founded as/.test(org)&&cls(org)!==cls(fb)) hit('P7a',seed,'Origin: '+org,'Founded by: '+fb);
  const ovOrigin=OV[OV.indexOf('Settlement Origin▲')+1]||'';
  if(/wharf/.test(ovOrigin)&&/trading port|maritime hub|naval base|natural harbour|shipwright/.test(org)) hit('P7b',seed,ovOrigin,'Origin: '+org);
  if(org&&fb) { (P.P7n ||= {n:0}); P.P7n.n++; }
  // P8
  const noCh=all.find(l=>/has no church of its own/.test(l));
  if(noCh){ const rh=E.find(l=>relPools.some(p=>p.re.test(l))); const fi=E.findIndex(l=>/^Faith & Worship/.test(l)); const flow=fi>=0&&/Running|Operational/.test(E[fi])?E[fi]+' · '+(E[fi+2]||''):null;
    if(rh) hit('P8houses',seed,rh,noCh); if(flow) hit('P8flow',seed,flow,noCh); if(rh||flow) hit('P8any',seed,rh||flow,noCh); }
  // P9
  const bi=D.indexOf('Beasts & Monsters'); if(bi>=0){ const rating=(D[bi+1]||'').replace(/[▲▼]/g,''); const t=D[bi+2]||''; const p=beastPools.find(p=>p.re.test(t)); if(p){ (P.P9n ||= {n:0}); P.P9n.n++; if(/settled/.test(p.key)&&/Critical|Weak/.test(rating)) hit('P9',seed,`Beasts & Monsters: ${rating}`,`[${p.key}] `+t); if(/plagued, NO perimeter/.test(p.key)&&/Strong/.test(rating)) hit('P9inv',seed,rating,t); } }
  // P10
  const hg=all.find(l=>/hold the gates/.test(l)); if(hg&&all.some(l=>/No perimeter walls/.test(l))) hit('P10',seed,hg,'Unfortified. No perimeter walls.');
  // P11
  const near=new Set(s.config?.nearbyResources||[]);
  for(const ch of s.economicState?.activeChains||[]){ if(ch.resource&&ch.resourceKey&&!near.has(ch.resourceKey)){ const l=E.find(x=>x===ch.resource||x.startsWith(ch.resource+' ·')||x.startsWith(ch.resource+' (')); if(l){ hit('P11',seed,`${ch.label}: From ${l}`,`nearbyResources: ${[...near].join(', ')}`); hit(ch.substituteActive?'P11substitute':'P11noSubstitute',seed,`${ch.label}: From ${l}`,`nearbyResources: ${[...near].join(', ')}`); if(ch.resourceKey!=='foraging_areas') hit('P11noForage',seed,`${ch.label}: From ${l}`,`nearbyResources: ${[...near].join(', ')}`); P11K[ch.resourceKey]=(P11K[ch.resourceKey]||0)+1; break; } } }
  // P12 (F4 recount)
  const R=roster(s); const has=(re)=>R.some(n=>re.test(n));
  const imps=(s.economicState?.primaryImports||[]).map(x=>x.toLowerCase());
  const t12=[['ore','Local ore feeds the smithy',/smith|forge|foundr|smelt|metal|armou?r|weapon/],['coal',LOCAL_COAL_LINE.slice(0,30),/smith|forge|foundr|smelt|metal|armou?r|weapon/],['quarry','Local quarry provides dressed stone',/quarr|mason|stone/],['saw','managed felling and sawmilling',/sawmill|lumber|timber|carpent|wood|forest/]];
  for(const [k,needle,re] of t12){ const l=E.find(x=>x.includes(needle)); if(l&&!has(re)) hit('P12'+k,seed,l.slice(0,120),'roster has none matching '+re); }
  const ore=E.find(x=>x.includes('Local ore feeds the smithy')); if(ore&&imps.some(x=>/iron ore/.test(x))) hit('P12oreImport',seed,ore.slice(0,90),'primaryImports: '+imps.join(', '));
  // P13
  const rep=all.find(l=>/more slowly and less comfortably and go on\./.test(l)); if(rep) hit('P13',seed,rep,'');
  // P14
  if(['thorp','hamlet','village'].includes(s.tier)){ const sw=all.find(l=>/urban food supply|dense populations/.test(l)); if(sw) hit('P14',seed,sw,'tier '+s.tier); }
  // P15
  const hi=SV.findIndex(l=>/^Healing\(\d+\)/.test(l)); if(hi>=0){ let j=hi+1; for(;j<SV.length&&!/^\S.*\(\d+\)▲?$/.test(SV[j]);j++){ if(/^(Burial|Burial of the poor|Funeral|Last rites|Full religious coverage|Interment|Rites|Memorial)/i.test(SV[j])||/interment|burial|funeral|last rites/i.test(SV[j])){ hit('P15',seed,SV[hi],SV[j]); break; } } }
  // P16
  const r3=PW.findIndex(l=>/^The ruling three of/.test(l)); if(r3>=0){ const n=['Head ·','Second ·','Third ·'].filter((h,i)=>(PW[r3+1+i]||'').startsWith(h)).length; (P.P16n ||= {n:0}); P.P16n.n++; if(n<3) hit('P16three',seed,PW[r3],PW.slice(r3+1,r3+4).join(' | ')); }
  const pc=PW.filter(l=>/^The Powers \(\d+\)/.test(l)); if(pc.length>=2&&new Set(pc).size>1) hit('P16powers',seed,pc[0],pc[1]);
  // P17
  const pli=E.indexOf('Produced locally'); const pl=pli>=0?(E[pli+1]||''):''; const nag=NOT_A_GOOD.map(x=>String(x).toLowerCase()).filter(x=>pl.toLowerCase().includes(x)); const acc=pl.match(/[a-z ]*access|[A-Z][a-z]+ services/g)||[];
  if(nag.length||acc.length) hit('P17',seed,'Produced locally: '+pl,[...new Set([...nag,...acc])].join(', '));
  // P18
  const via=E.filter((l,i)=>E[i-1]==='Via'); const vr=via.find(l=>/\(\d+-\d+\)/.test(l)); if(vr) hit('P18via',seed,'Via '+vr,'');
  const nr=NP.find(l=>/\((\d+)-(\d+)\)/.test(l)); if(nr) hit('P18npc',seed,nr,'');
  const viaFalse=[]; for(const l of via) for(const item of l.split(' · ')){ if(/\(missing\)/.test(item)) continue; const nm=item.replace(/\s*\(\d+-\d+\)/,'').toLowerCase(); if(['theater','theatre','arena','courthouse'].some(w=>nm===w)&&!R.some(n=>n.includes(nm))) viaFalse.push(item); }
  if(viaFalse.length) hit('P18named',seed,'Via '+viaFalse.join(', '),'roster lacks it');
  for(const ch of s.economicState?.activeChains||[]) { if((ch.processingInstitutions||[]).some(p=>/\(\d+-\d+\)/.test(institutionDisplayName(p)))) { hit('P18rec',seed,ch.label,''); break; } }
  // P19
  const stk=all.find(l=>/operating on stockpiles only/.test(l)); if(stk) hit('P19',seed,stk,'');
  // P20
  const sg=D.find(l=>/under siege the outlying fields are lost/i.test(l)); if(sg&&!s.economicState?.foodSecurity?.hasSiege) hit('P20',seed,sg.slice(0,120),'not besieged');
  // P21
  if(all.some(l=>/^\[STYLE\] @keyframes spin/.test(l))) hit('P21',seed,'[STYLE] @keyframes spin','');
  // NEW1
  const hdr=OV[1]||''; const shi=OV.indexOf('Defense'); const shd=shi>=0?OV[shi+1]:'';
  if(/underdefended/.test(hdr)&&/^(Defensible|Well-defended|Fortress)$/.test(shd)) hit('NEW1',seed,hdr.slice(hdr.lastIndexOf('·')),'Systems Health · Defense '+shd);
  if(/strong military presence/.test(hdr)&&/^(Undefended|Lightly defended|Vulnerable)$/.test(shd)) hit('NEW1b',seed,hdr.slice(hdr.lastIndexOf('·')),'Systems Health · Defense '+shd);
  // NEW2
  const mw=E.find(l=>magPools.some(p=>p.re.test(l))); if(mw&&noArc) hit('NEW2',seed,mw,'Arcane SupportNone · No arcane practitioners on the rolls');
  // P14b
  if(['thorp','hamlet','village'].includes(s.tier)){ const dl=all.find(l=>l!==OV[1]&&/\bdistricts?\b|whole quarters/i.test(l)&&!/\(district\)/.test(l)); if(dl) hit('P14district',seed,dl,'tier '+s.tier); }
  // P12 open question
  const inc=(s.economicState?.incomeSources||[]).map(i=>i.source);
  const fam={'Iron & Metalwork':/iron|ore|coal|metal|smelt|mining|smith|forge/i,'Timber Trade':/timber|lumber|wood|sawmill|forest|carpent/i,'Stone Quarrying':/stone|quarr|mason/i};
  const resFam={'Iron & Metalwork':/iron|coal|precious/,'Timber Trade':/forest|timber/,'Stone Quarrying':/stone|quarry/};
  for(const src of Object.keys(fam)){ if(!inc.includes(src)) continue; (oq[src] ||= {offered:0, own:0, bought:0, none:0, noneDetail:{} }); const o=oq[src]; o.offered++;
    const chs=(s.economicState?.activeChains||[]).filter(c=>c.resourceKey?resFam[src].test(c.resourceKey):fam[src].test(c.chainId||''));
    const runs=chs.filter(c=>['running','operational','entrepot','vulnerable','magically_sustained'].includes(c.status));
    const ownR=runs.filter(c=>c.resourceKey&&near.has(c.resourceKey)&&c.resourceActive!==false);
    if(ownR.length) o.own++; else if(runs.length) o.bought++; else { o.none++; const lp=(s.economicState?.localProduction||[]).filter(x=>fam[src].test(x)); const exs=(s.economicState?.primaryExports||[]).filter(x=>fam[src].test(x)); const key=`local:${lp.length?'yes':'no'} export:${exs.length?'yes':'no'}`; o.noneDetail[key]=(o.noneDetail[key]||0)+1; (o.ex ||= []); if(o.ex.length<3) o.ex.push({seed, chains:chs.map(c=>c.chainId+':'+c.status), lp, exs}); } }
}
const table={}; for(const [k,v] of Object.entries(P)){ if(v.n!=null){table[k]=v.n;continue;} const row={total:0}; for(const sz of SIZES){ const c=v[`${sz}|calm`]||0, x=v[`${sz}|crisis`]||0; row[sz]=`${c}/${x}`; row.total+=c+x; } row.calm=SIZES.reduce((a,sz)=>a+(v[`${sz}|calm`]||0),0); row.crisis=row.total-row.calm; table[k]=row; }
fs.writeFileSync(process.env.OUT+'/counts.perseed.json', JSON.stringify(Object.fromEntries(Object.entries(perSeed).map(([k,v])=>[k,[...v]]))));
fs.writeFileSync(process.env.OUT+'/counts.json', JSON.stringify({coverage,table,ex,oq,P11K,P4L},null,1));
console.log(coverage); for(const [k,v] of Object.entries(table)) console.log(k.padEnd(14), typeof v==='object'?`total ${v.total} calm ${v.calm} crisis ${v.crisis} | `+SIZES.map(s=>s.slice(0,4)+' '+v[s]).join(' '):v);
