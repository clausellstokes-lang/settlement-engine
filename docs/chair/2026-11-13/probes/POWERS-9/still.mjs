// still.mjs <dir> <fileSubstr>: each of the lane's 78 lines in that writer, does its sentence still stand in its town's record (compact rows)?
import fs from 'node:fs'; import zlib from 'node:zlib';
const [D,F]=process.argv.slice(2); const rows=new Map();
for(const f of fs.readdirSync(D).filter(f=>/^r80\..*gz$/.test(f))) for(const l of zlib.gunzipSync(fs.readFileSync(D+'/'+f)).toString().split('\n')) if(l){const r=JSON.parse(l); rows.set(r.key,r);}
const m=JSON.parse(fs.readFileSync('/home/user/p9probes/mine78.json','utf8')).filter(x=>x.file.includes(F));
for(const l of m){ const r=rows.get(l.town); const s=l.s.replace(/^(Constraint|Secret|Wants) ?:? ?/,'').slice(0,45); const blob=JSON.stringify(r);
  console.log(l.id, l.town, blob.includes(s)?'STILL':'gone', '|', s); }
