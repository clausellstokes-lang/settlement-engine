const fs=require("fs"),zlib=require("zlib");
const R="/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/r/tip";
const cache={};
exports.rec=t=>cache[t]||(cache[t]=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${R}/records/${t}.json.gz`))));
exports.page=t=>fs.readFileSync(`${R}/dumps/${t}.txt`,"utf8");
exports.L=JSON.parse(fs.readFileSync("/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers/lines-5.json"));
exports.line=id=>exports.L.find(l=>l.id===id);
exports.tab=(t,name)=>{const p=exports.page(t);const i=p.indexOf("== "+name);if(i<0)return null;const j=p.indexOf("\n== ",i+5);return p.slice(i,j<0?undefined:j);};
exports.crises=t=>{const s=t.stress;const a=[];const add=x=>{if(!x)return;if(typeof x==="string")a.push(x);else if(Array.isArray(x))x.forEach(add);else if(x.type)a.push(x.type);};add(s);add(t.stresses);return [...new Set(a)];};
