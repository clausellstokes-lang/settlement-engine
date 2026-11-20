import {readFileSync,readdirSync} from 'node:fs';import {join} from 'node:path';import zlib from 'node:zlib';
const closure=(d)=>{const a=join(d,'dist/assets');const html=readFileSync(join(d,'dist/index.html'),'utf8');const e=html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)[1];const seen=new Set([e]);const q=[e];const dep=f=>{const c=readFileSync(join(a,f),'utf8');const s=new Set();for(const m of c.matchAll(/\bfrom\s*["']\.\/([^"']+\.js)["']/g))s.add(m[1]);for(const m of c.matchAll(/(?:^|[;}])import\s*["']\.\/([^"']+\.js)["']/g))s.add(m[1]);return[...s]};while(q.length)for(const x of dep(q.shift()))if(!seen.has(x)){seen.add(x);q.push(x)}return{a,files:[...seen]}};
const norm=s=>s.replace(/([A-Za-z0-9_.-]+?)-[A-Za-z0-9_-]{8}\.(js|css)/g,'$1-H.$2');
const [L,K]=process.argv.slice(2).map(closure);
const key=f=>norm(f);
const lm=new Map(L.files.map(f=>[key(f),f]));const km=new Map(K.files.map(f=>[key(f),f]));
let tl=0,tk=0;
for(const k of new Set([...lm.keys(),...km.keys()])){const lf=lm.get(k),kf=km.get(k);const lb=lf?readFileSync(join(L.a,lf),'utf8'):'';const kb=kf?readFileSync(join(K.a,kf),'utf8'):'';tl+=Buffer.byteLength(lb);tk+=Buffer.byteLength(kb);const d=Buffer.byteLength(kb)-Buffer.byteLength(lb);if(d||lb!==kb)console.log(k,'raw',Buffer.byteLength(lb),'->',Buffer.byteLength(kb),'d',d,'normalisedEqual',norm(lb)===norm(kb));}
console.log('closure raw',tl,'->',tk);
// find differing segments in entry normalised
for(const k of km.keys()){const lf=lm.get(k),kf=km.get(k);if(!lf||!kf)continue;const lb=norm(readFileSync(join(L.a,lf),'utf8')),kb=norm(readFileSync(join(K.a,kf),'utf8'));if(lb!==kb){let i=0;while(lb[i]===kb[i])i++;let j=0;while(lb[lb.length-1-j]===kb[kb.length-1-j])j++;console.log('DIFF in',k,'line:',JSON.stringify(lb.slice(i-80,lb.length-j+40)),'\nlane:',JSON.stringify(kb.slice(i-80,kb.length-j+40)))}}
