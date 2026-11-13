// sentdiff.mjs <base-dumps> <tip-dumps> <out.json>: per town and view, SENTENCES only at tip, each with its nearest base-only sentence.
import fs from 'node:fs';
const [B,T,O]=process.argv.slice(2);
const split=l=>l.split(/(?<=[.!?…])\s+(?=[A-Z"“])/).map(s=>s.trim()).filter(Boolean);
const parse=f=>{const m=new Map();let cur='?';for(const l of fs.readFileSync(f,'utf8').split('\n')){const h=l.match(/^== (.*) ==/);if(h){cur=h[1];if(!m.has(cur))m.set(cur,new Set());continue;}if(l.trim()&&!l.startsWith('[STYLE]'))for(const s of split(l))m.get(cur)?.add(s);}return m;};
const tok=s=>new Set(s.toLowerCase().match(/[a-z']+/g)||[]);
const sim=(a,b)=>{const A=tok(a),B=tok(b);let i=0;for(const x of A)if(B.has(x))i++;return i/Math.max(1,Math.min(A.size,B.size));};
const out=[];
for(const f of fs.readdirSync(T).filter(x=>x.endsWith('.txt')).sort()){
  const t=parse(`${T}/${f}`), b=parse(`${B}/${f}`); const town=f.replace(/\.txt$/,'');
  const views=new Set([...t.keys(),...b.keys()]);
  for(const v of views){const ts=t.get(v)||new Set(), bs=b.get(v)||new Set();
    const tOnly=[...ts].filter(x=>!bs.has(x)), bOnly=[...bs].filter(x=>!ts.has(x));
    for(const s of tOnly){let best=null,bv=0;for(const x of bOnly){const q=sim(s,x);if(q>bv){bv=q;best=x;}}out.push({town,view:v,kind:'tip',sentence:s,nearestBase:bv>=0.5?best:null,sim:+bv.toFixed(2)});}
    for(const s of bOnly){let bv=0;for(const x of tOnly){const q=sim(s,x);if(q>bv)bv=q;}if(bv<0.5)out.push({town,view:v,kind:'baseGone',sentence:s});}
  }
}
fs.writeFileSync(O,JSON.stringify(out,null,1));
const c=k=>out.filter(x=>x.kind===k).length; console.log('tip-only sentences',c('tip'),'(of which with a near base form',out.filter(x=>x.kind==='tip'&&x.nearestBase).length,') base sentences gone with no near tip form',c('baseGone'));
