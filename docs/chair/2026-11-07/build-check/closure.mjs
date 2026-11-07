import {readFileSync,statSync} from 'node:fs';import {join} from 'node:path';import {gzipSync,brotliCompressSync,constants as z} from 'node:zlib';
const d=process.argv[2],a=join(d,'assets');
const spec=c=>{const s=new Set();for(const re of [/\bfrom\s*["'](\.\/[^"']+\.js)["']/g,/(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g]){let m;while((m=re.exec(c)))s.add(m[1].slice(2))}return[...s]};
const e=readFileSync(join(d,'index.html'),'utf8').match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)[1];
const seen=new Set([e]),q=[e];while(q.length){for(const x of spec(readFileSync(join(a,q.shift()),'utf8')))if(!seen.has(x)){seen.add(x);q.push(x)}}
let raw=0,gz=0,br=0;for(const f of [...seen].sort()){const b=readFileSync(join(a,f));raw+=b.length;gz+=gzipSync(b,{level:9}).length;br+=brotliCompressSync(b,{params:{[z.BROTLI_PARAM_QUALITY]:11}}).length;console.log(String(b.length).padStart(8),f)}
console.log('CLOSURE files',seen.size,'raw',raw,'gzip',gz,'brotli',br);
