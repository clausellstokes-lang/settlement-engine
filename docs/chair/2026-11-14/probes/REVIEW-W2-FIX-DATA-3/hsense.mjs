// Sense checks of the history lines against the record (TREE, CORPUS, JUDGE env).
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src';
const { factsOf } = await import(R+'/domain/facts/factsOf.js');
const { atomHolds } = await import(R+'/domain/facts/factVocabulary.js');
const rec=new Map(zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map(l=>{const o=JSON.parse(l);return [o.seed,o.s];}));
const J=JSON.parse(fs.readFileSync(process.env.JUDGE,'utf8'));
const A=(s,a)=>atomHolds(a,factsOf(s));
const names=(s)=>(s.institutions||[]).map(i=>i.name).join(' | ');
const tally=(id,f)=>{ const c=new Map(); for(const t of J[id].towns){ const s=rec.get(t.seed); const k=f(t,s); if(!c.has(k)) c.set(k,[]); c.get(k).push(t.seed); } console.log('##',id); for(const [k,v] of c) console.log('  ',String(v.length).padStart(3),'|',k,'|',v.slice(0,4).join(' ')); };
tally('H11',(t,s)=>{ const f=/Walls, civic|Its walls and civic|its walls and its larger houses|Civic buildings or a cathedral|Its civic buildings were|its larger houses raised/.exec(t.sent)?.[0]; return `${f} :: ${s.tier} walls=${A(s,'walls')} palisade=${A(s,'palisade')} temple=${A(s,'institution: temple')} quarry=${A(s,'institution: quarry')}`; });
tally('H13',(t,s)=>`${/and the guilds negotiated|agreed/.exec(t.sent)?.[0]} :: guild=${A(s,'guild')} ${s.tier}`);
tally('H15',(t,s)=>`${/controls extraction|holds those rights|mining contract|rights to the deposits|Fortified extraction/.exec(t.sent)?.[0]} :: mine=${A(s,'institution: mine')}`);
tally('H14',(t,s)=>`${/a district of|part of the settlement|Affected district|affected ground|Arcane regulatory/.exec(t.sent)?.[0]} :: ${s.tier}`);
tally('H07',(t,s)=>{ const w=/the merchants' quarter|the residential district|the temple district|the waterfront/.exec(t.sent)?.[0]; return `${w} :: ${s.tier} market=${A(s,'market')} nav=${A(s,'navigable')} temple=${A(s,'institution: temple')} :: ${t.sent.slice(0,70)}`; });
tally('H08',(t,s)=>{ const w=/the low ground|the edge of the fields|the yards behind the houses|the houses nearest the (shore|river)/.exec(t.sent)?.[0]; return `${w} :: ${s.tier} coast=${A(s,'coast')} river=${A(s,'river')}`; });
tally('H16',(t,s)=>{ const inc=(s.economicState?.incomeSources||[]).map(r=>`${r.source}:${r.percentage}`).join(','); const m=/(Among the trades the place lives by, the (.+?) trade|The (.+?) trade is the largest|runs mostly on the (.+?) trade)/.exec(t.sent); return `${m?.[0]} :: ${inc}`; });
