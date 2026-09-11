import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync, brotliCompressSync, constants as zc } from 'node:zlib';
const dist = process.argv[2]; const assets = join(dist,'assets');
function specs(code){const s=new Set();const fromRe=/\bfrom\s*["'](\.\/[^"']+\.js)["']/g;const bareRe=/(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;let m;while((m=fromRe.exec(code))!==null)s.add(m[1].replace('./',''));while((m=bareRe.exec(code))!==null)s.add(m[1].replace('./',''));return [...s];}
const html=readFileSync(join(dist,'index.html'),'utf-8');
const m=html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
const entry=m[1];const seen=new Set([entry]);const q=[entry];
while(q.length){const f=q.shift();const code=readFileSync(join(assets,f),'utf-8');for(const d of specs(code)) if(!seen.has(d)){seen.add(d);q.push(d);}}
const files=[...seen].sort();
let raw=0,gz=0,br=0;
for(const f of files){const b=readFileSync(join(assets,f));raw+=b.length;gz+=gzipSync(b,{level:9}).length;br+=brotliCompressSync(b,{params:{[zc.BROTLI_PARAM_QUALITY]:11}}).length;console.log(String(b.length).padStart(9),f);}
console.log('FILES',files.length,'RAW',raw,'GZIP',gz,'BROTLI',br);
console.log('boundary in closure:',files.some(f=>f.startsWith('densityCreateBoundary')));
