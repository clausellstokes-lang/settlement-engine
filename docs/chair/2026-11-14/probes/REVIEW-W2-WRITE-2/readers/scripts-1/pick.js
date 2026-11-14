const fs=require('fs');const L=JSON.parse(fs.readFileSync(process.argv[2]));
const ORD=['thorp','hamlet','village','town','city','metropolis'];
const out={};
L.forEach((l,idx)=>{const P=l.prints;const tiers={},st={};P.forEach(p=>{tiers[p.tier]=(tiers[p.tier]||0)+1;const k=p.stress.join('+')||'calm';st[k]=(st[k]||0)+1;});
 const sorted=[...P].sort((a,b)=>ORD.indexOf(a.tier)-ORD.indexOf(b.tier)||a.pop-b.pop);
 const pick=new Set();if(sorted.length){pick.add(sorted[0].town);pick.add(sorted[sorted.length-1].town);}
 for(const c of ['under_siege','famine','occupied']){const x=P.find(p=>p.stress.includes(c)&&!pick.has(p.town));if(x){pick.add(x.town);break;}}
 for(const x of P){if(pick.size>=3)break;pick.add(x.town);}
 const views={};P.forEach(p=>(p.page||[]).forEach(v=>views[v.view]=(views[v.view]||0)+1));
 out[idx]=[...pick];
 console.log(idx,l.id.split('::').slice(1).join('::'),'n=',P.length,JSON.stringify(tiers),JSON.stringify(st),'views',JSON.stringify(views),'pick',[...pick].join(','));});
fs.writeFileSync(process.argv[3],JSON.stringify(out));
