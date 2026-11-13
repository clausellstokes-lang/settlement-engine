const fs=require("fs"),zlib=require("zlib");
const load=(f)=>{const m=new Map();for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split("\n").filter(Boolean)){const {seed,s}=JSON.parse(l);m.set(seed,s);}return m;};
const P=load("corp-prev/corpus.ndjson.gz"),T=load("census-tip/corpus.ndjson.gz");
const RX=[["forge",/[^.]*(lives by its forges|ring of the anvils never|Racks of new ironwork)[^.]*\./],["crafts",/Craftspeople sit in rows[^.]*\./],["precinct",/[^.]*ceremonial precinct overlooks[^.]*\.?/i]];
for(const [k,rx] of RX){const c={};for(const [seed,p] of P){const t=T.get(seed);const pa=String(p.arrivalScene||""),ta=String(t.arrivalScene||"");const pm=pa.match(rx);const tm=ta.match(rx);
 if(pm&&!tm){const names=(p.institutions||[]).map(i=>i.name);const line=pm[0].trim();const key=p.tier+"|"+line.replace(/[A-Z][a-z]+ lives/,"N lives").slice(0,60);c[key]=(c[key]||0)+1;
  if(process.argv[2]===k) console.log(seed,p.tier,p.population,"| smith:",names.filter(n=>/smith|forge|metal/i.test(n)).join(";")||"-","| market:",names.filter(n=>/market|bazaar|fair/i.test(n)).join(";")||"-","\n  PREV:",pa.slice(0,600),"\n  TIP: ",ta.slice(0,600));}}
 console.log("##",k,JSON.stringify(c));}
