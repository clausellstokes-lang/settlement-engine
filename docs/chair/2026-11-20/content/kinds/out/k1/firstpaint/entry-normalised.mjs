import {readFileSync,readdirSync} from 'node:fs';import {join} from 'node:path';
const ent=d=>{const h=readFileSync(join(d,'dist/index.html'),'utf8');return readFileSync(join(d,'dist/assets',h.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)[1]),'utf8')};
const norm=s=>s.replace(/([A-Za-z0-9_.-]+?)-[A-Za-z0-9_-]{8}\.(js|css)/g,'$1-H.$2');
const [l,k]=process.argv.slice(2).map(d=>norm(ent(d)));
const occ=(k.match(/trouble-law/g)||[]).length;console.log('trouble-law occurrences in lane entry:',occ,' in line entry:',(l.match(/trouble-law/g)||[]).length);
const k2=k.split('"assets/trouble-law-H.js",').join('');
console.log('after removing the name: bytes line',Buffer.byteLength(l),'lane',Buffer.byteLength(k2));
const dn=s=>s.replace(/\d+/g,'N');console.log('equal with indices normalised:',dn(l)===dn(k2));
// the index arrays that changed
const nums=s=>s.match(/__vite__mapDeps\(\[[\d,]*\]\)/g)||[];const a=nums(l),b=nums(k2);let ch=0,ext=0;for(let i=0;i<a.length;i++){if(a[i]!==b[i]){ch++;ext+=b[i].length-a[i].length}}console.log('mapDeps calls',a.length,b.length,'changed',ch,'extra bytes in index arrays',ext);
const an=s=>s.replace(/__vite__mapDeps\(\[[\d,]*\]\)/g,'MD');console.log('equal with mapDeps arrays normalised:',an(l)===an(k2));
let added=0;for(let i=0;i<a.length;i++){const x=a[i].match(/\d+/g)||[],y=b[i].match(/\d+/g)||[];if(y.length!==x.length)added++}console.log('calls whose array gained an element:',added);
