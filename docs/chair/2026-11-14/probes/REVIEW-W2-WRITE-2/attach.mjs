// attach.mjs <items.json> <drawn.json> <renderRoot> <out.json>: each line's towns = the towns whose kernel ledger DREW it
// (drawn.mjs); in each, the sentence as printed on the page (dumps) and in the PDF text, found by the line's HEAD (its
// text up to the first , ; : or — past 12 fixed characters; the overview rungs clip lines there), slots folded, the
// town's "Its" folded. printed:null = drawn but not found on that surface.
import fs from 'node:fs'; import path from 'node:path';
const [I,D,R,O]=process.argv.slice(2); const items=JSON.parse(fs.readFileSync(I,'utf8')); const drawn=JSON.parse(fs.readFileSync(D,'utf8'));
const TIER='(?:thorp|hamlet|village|town|city|metropolis)'; const esc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function head(t){ const re=/[,;:—]/g; let m; while((m=re.exec(t))){ if(t.slice(0,m.index).replace(/\{[a-zA-Z_]+\}/g,'').length>=12) return t.slice(0,m.index); } return t.replace(/[.]$/,''); }
function rx(body){ let src=''; const re=/\{([a-zA-Z_]+)\}('s)?/g; let last=0,m;
  while((m=re.exec(body))){ src+=esc(body.slice(last,m.index)); src+= m[2] ? "(?:[^.]{1,80}?'s|[Ii]ts)" : '[^.]{1,80}?'; last=re.lastIndex; }
  src+=esc(body.slice(last)); return new RegExp('[^.]*'+src.replace(/\b(?:thorp|hamlet|village|town|city|metropolis)(?=\b|')/g,TIER)+'[^.]*\\.?'); }
const cache=new Map(); const read=(f)=>{ if(!cache.has(f)) cache.set(f, fs.existsSync(f)?fs.readFileSync(f,'utf8').split('\n'):[]); return cache.get(f); };
function find(lines,re){ let view='?'; const hits=[]; for(const l of lines){ const h=l.match(/^== (.*) ==/); if(h){view=h[1];continue;} const m=l.match(re); if(m && !hits.some(x=>x.view===view)) hits.push({view,printed:m[0].trim()}); } return hits; }
for(const it of items){ const re=rx(head(it.text)); it.head=head(it.text); it.prints=[];
  for(const [town,v] of Object.entries(drawn)){ if(!v.drawn.includes(it.id)) continue;
    const page=find(read(path.join(R,'dumps',town+'.txt')),re), pdf=find(read(path.join(R,'pdf',town+'.txt')),re);
    it.prints.push({town,tier:v.tier,pop:v.pop,stress:v.stress,page,pdf:pdf.map(x=>x.printed)}); }
  if(cache.size>200) cache.clear(); }
fs.writeFileSync(O,JSON.stringify(items,null,1));
const n=items.filter(i=>i.prints.length).length, notFound=items.reduce((a,i)=>a+i.prints.filter(p=>!p.page.length).length,0);
console.log('items',items.length,'drawn somewhere',n,'town-draws',items.reduce((a,i)=>a+i.prints.length,0),'drawn but not found on page',notFound);
