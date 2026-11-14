const zlib=require('zlib'),fs=require('fs');
const R=process.argv[2],t=process.argv[3];
const j=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${R}/records/${t}.json.gz`)));
const show=(o,d=0,p='')=>{for(const k of Object.keys(o)){const v=o[k];const ty=Array.isArray(v)?`array[${v.length}]`:typeof v;let s=ty;if(typeof v!=='object'||v===null)s+=' '+JSON.stringify(v).slice(0,80);console.log(' '.repeat(d*2)+k+': '+s);if(d<1&&v&&typeof v==='object'&&!Array.isArray(v))show(v,d+1);}};
show(j);
