import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync, brotliCompressSync, constants as z } from 'node:zlib';
const distDir = process.argv[2], assetsDir = join(distDir,'assets');
function specs(code){const s=new Set();const a=/\bfrom\s*["'](\.\/[^"']+\.js)["']/g,b=/(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;let m;while((m=a.exec(code))!==null)s.add(m[1].replace('./',''));while((m=b.exec(code))!==null)s.add(m[1].replace('./',''));return [...s];}
const html=readFileSync(join(distDir,'index.html'),'utf-8');
const entry=html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)[1];
const seen=new Set([entry]),q=[entry];
while(q.length){const f=q.shift();for(const d of specs(readFileSync(join(assetsDir,f),'utf-8')))if(!seen.has(d)){seen.add(d);q.push(d);}}
let g=0,br=0;
for(const f of [...seen].sort()){const b=readFileSync(join(assetsDir,f));g+=gzipSync(b,{level:9}).length;br+=brotliCompressSync(b,{params:{[z.BROTLI_PARAM_QUALITY]:11}}).length;}
console.log('gzip',g,'brotli',br);
