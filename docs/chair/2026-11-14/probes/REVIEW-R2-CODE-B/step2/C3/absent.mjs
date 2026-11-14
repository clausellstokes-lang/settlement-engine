// absent.mjs <births> <dumpsdir> <surfdir>: per absent-ground chain, does the page's Economics tab / PDF row print its ground?
import fs from 'node:fs'; import {towns} from './iter.mjs';
const [B,DUMPS,SURF]=process.argv.slice(2);
let ch=0,pageHit=0,pdfHit=0,towns_=0; const pageT=new Set(),pdfT=new Set(); const ex=[];
for await (const {seed,s} of towns(B)){ const df=`${DUMPS}/${seed}.txt`; if(!fs.existsSync(df)) continue; towns_++;
  const txt=fs.readFileSync(df,'utf8'); const m=txt.split(/^== /m).find(x=>x.startsWith('Systems/Economics'))||''; const eco=new Set(m.split('\n'));
  const pf=`${SURF}/${seed}.pdf-canon_dossier.txt`; const pdf=fs.existsSync(pf)?fs.readFileSync(pf,'utf8').split('\n'):[];
  const chains=s.economicState?.activeChains||[]; const liveRes=new Set(chains.filter(c=>c.resourceCondition!=='absent').map(c=>c.resource));
  for(const c of chains){ if(c.resourceCondition!=='absent'||!c.resource) continue; ch++; if(liveRes.has(c.resource)) continue;
    if(eco.has(c.resource)||eco.has(c.resource+' (depleted)')){pageHit++;pageT.add(seed); if(ex.length<12) ex.push('PAGE '+seed+' '+c.chainId+' '+c.resource);}
    const hit=pdf.filter(l=>l.startsWith(c.resource+' » ')||l.startsWith(c.resource+' (depleted) » ')); if(hit.length){pdfHit+=hit.length;pdfT.add(seed); if(ex.length<12) ex.push('PDF '+seed+' '+hit[0].slice(0,120));}
  } }
console.log({towns:towns_,absentChains:ch,pageHit,pageTowns:pageT.size,pdfHit,pdfTowns:pdfT.size}); console.log(ex.join('\n'));
