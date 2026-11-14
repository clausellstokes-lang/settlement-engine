// whereprints2.mjs <items.json> <out.json> <renderRoot>... : for every item (a corpus line: block, pool, vid, text), the
// towns and views where it prints, on three surfaces: the page (<root>/dumps), the PDF's text (<root>/pdf) and the
// stored public prose (<root>/pp). Slots folded to .{1,80}?, the tier noun folded. From REVIEW-W2-WRITE's whereprints.mjs.
import fs from 'node:fs'; import path from 'node:path';
const [I,O,...roots]=process.argv.slice(2); const items=JSON.parse(fs.readFileSync(I,'utf8'));
const TIER='(?:thorp|hamlet|village|town|city|metropolis)';
// The page cuts some rungs at the first ';' and the weave names the town once, then "Its"/"It"/"The town": so a line is
// matched on its first clause (before ';') when that clause has 25+ fixed characters, else on its whole text; a
// {settlement}'s may print as "Its"; other slots fold to [^.]{0,80}?.
const esc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const rx=t=>{ let body=t; const semi=t.indexOf(';'); if(semi>0 && t.slice(0,semi).replace(/\{[a-zA-Z_]+\}/g,'').length>=25) body=t.slice(0,semi);
  let src=''; const re=/\{([a-zA-Z_]+)\}('s)?/g; let last=0, m;
  while((m=re.exec(body))){ src+=esc(body.slice(last,m.index)); src+= m[2] ? "(?:[^.]{1,80}?'s|[Ii]ts)" : '[^.]{1,80}?'; last=re.lastIndex; }
  src+=esc(body.slice(last));
  return new RegExp(src.replace(/\b(?:thorp|hamlet|village|town|city|metropolis)(?=\b|')/g,TIER)); };
for(const it of items){it.re=rx(it.text);it.prints=[];}
for(const root of roots) for(const surface of ['dumps','pdf','pp']){ const dir=path.join(root,surface); if(!fs.existsSync(dir)) continue;
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.txt'))){
    const town=f.replace(/\.txt$/,''); let view='?';
    for(const l of fs.readFileSync(path.join(dir,f),'utf8').split('\n')){ const h=l.match(/^== (.*) ==/); if(h){view=h[1];continue;}
      for(const it of items){ const m=l.match(it.re); if(m && !it.prints.some(p=>p.town===town&&p.view===view)) it.prints.push({surface:surface==='dumps'?'page':surface,town,view,printed:m[0]}); } } } }
for(const it of items) delete it.re;
fs.writeFileSync(O,JSON.stringify(items,null,1));
const towns=it=>new Set(it.prints.filter(p=>p.surface==='page').map(p=>p.town)).size;
console.log('items',items.length,'printing on the page',items.filter(i=>towns(i)).length,'page prints',items.reduce((a,i)=>a+towns(i),0),
 '| pdf-only',items.filter(i=>!towns(i)&&i.prints.some(p=>p.surface==='pdf')).length,'| pp-only',items.filter(i=>!towns(i)&&i.prints.some(p=>p.surface==='pp')).length);
