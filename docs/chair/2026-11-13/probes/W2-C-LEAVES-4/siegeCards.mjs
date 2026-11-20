import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T]=process.argv.slice(2);
const { chainStateShown, tradeStoppedHere } = await import(T+'/src/domain/display/chainStateShown.js');
const { chainCarrierOf } = await import(T+'/src/domain/facts/chainCarrier.js');
const W=new Set(['running','operational','entrepot']); const by={}; let towns=0, cards=0;
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  if(!tradeStoppedHere(s)) continue; towns++;
  const roster=(s.institutions||[]).map(i=>String(i.name||''));
  for(const c of s.economicState?.activeChains||[]){ const st=chainStateShown(c,s); if(!W.has(st)) continue; cards++;
    const k=chainCarrierOf(c,s).kind; const acc=roster.filter(n=>/^access to/i.test(n));
    const own=(c.processingInstitutions||[]).filter(p=>roster.some(n=>!/^access to/i.test(n)&&n.toLowerCase().includes(String(p).toLowerCase().split(/[\s(]/)[0])));
    const key=`${st}|${k}|${c.needKey}|ownHouse:${own.length>0}`; (by[key]=by[key]||[]).push(`${seed}:${c.chainId}`);
  }}
console.log('siege towns',towns,'cards shown working',cards);
for(const [k,v] of Object.entries(by).sort((a,b)=>b[1].length-a[1].length)) console.log(v.length,k,v.slice(0,4).join(' '));
