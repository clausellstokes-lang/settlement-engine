// P1: the grade cards (resourceAnalysis.exploitation) against the one reading (resourceWorkReading); sentence agreement.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, T, outf] = process.argv.slice(2);
const v = await import(T+'/src/domain/display/validationOnPage.js');
const { liveInstitutions } = await import(T+'/src/domain/institutions/institutionRoster.js');
const G={unexploited:'unexploited',partiallyExploited:'partial',fullyExploited:'full'};
const cls={}; const towns={}; const ex={}; const disagree=[]; const r7=[];
const add=(k,seed,row)=>{cls[k]=(cls[k]||0)+1; (towns[k]??=new Set()).add(seed); (ex[k]??=[]).push(row);};
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const sent=v.resourceGapLines(s).map(g=>g.impact).filter(t=>/^No one here works/.test(t));
  const exportsText=(s.economicState?.primaryExports||[]).join(' | ');
  for (const [k,g] of Object.entries(G)) for (const c of (s.resourceAnalysis?.exploitation?.[k]||[])) {
    const r=v.resourceWorkReading(s,c.rawResource);
    const key=`${g}|${r.modelled?(r.worked?'worked':'idle'):'silent'}`;
    const chains=(s.economicState?.activeChains||[]).filter(ch=>r.keys.includes(ch.resourceInputKey)).map(ch=>`${ch.chainId}:${ch.status}:${ch.resourceInputAvailable}:${(ch.processingInstitutions||[]).join('/')}`);
    add(key,seed,{seed,res:c.rawResource,keys:r.keys,chains,roster:liveInstitutions(s).map(i=>i.name).join(', ').slice(0,400), depleted:s.config?.nearbyResourcesDepleted, exports:exportsText.slice(0,300)});
    const noun=String(c.rawResource).toLowerCase(); const says=sent.some(t=>t.includes(`works the ${noun} `)||t.includes(`works the ${noun}`));
    if (says && g!=='unexploited') disagree.push({seed,res:c.rawResource,g,key});
  }
  for (const t of sent) { const m=t.match(/works the (.+?) near/); if(m && exportsText.toLowerCase().includes(m[1].split(' ').at(-1).replace(/s$/,''))) r7.push({seed,line:t,exports:exportsText.slice(0,200)}); }
}
for (const k of Object.keys(cls).sort()) console.log(k, cls[k], 'cards in', towns[k].size, 'towns');
console.log('sentence beside a Partial/Full card:', disagree.length, JSON.stringify(disagree.slice(0,5)));
console.log('ruling 7 (a raw export beside a not-worked line):', r7.length, 'lines in', new Set(r7.map(x=>x.seed)).size, 'towns');
fs.writeFileSync(outf, JSON.stringify({ex,disagree,r7},null,1));
