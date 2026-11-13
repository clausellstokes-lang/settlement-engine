// ROUND-3-CUT class (a): every parenthetical form a house name carries in the institution catalogue (every
// `name: '…'` entry of src/data/institutionalCatalog.js, each tier's row counted once), with counts.
// node catalogue-forms.mjs <tree> [out.json]
import fs from 'node:fs';
const T=process.argv[2]; const src=fs.readFileSync(T+'/src/data/institutionalCatalog.js','utf8');
const rows=[...src.matchAll(/name:\s*(['"`])((?:(?!\1).)+)\1/g)].map(m=>m[2]); const names=[...new Set(rows)];
const cls=(p)=> /^\d[\d,]*[-–]\d[\d,]*\+?$/.test(p)?'count range "(a-b)"': /^\d[\d,]*[-–]\d[\d,]* households$/.test(p)?'household range "(a-b households)"': /^\d[\d,]*\+ households$/.test(p)?'household floor "(n+ households)"': /^\d[\d,]*\+$/.test(p)?'count floor "(n+)"': /^\d[\d,]*\+ only$/.test(p)?'population gate "(n+ only)"': /^(multiple|several|many)$/i.test(p)?'count word':/^if /i.test(p)?'condition "(if …)"': /magic/i.test(p)?'magic gate': /district/i.test(p)?'district tag':'other qualifier';
const forms={}; for(const n of names){ for(const m of n.matchAll(/\(([^)]*)\)/g)){ const c=cls(m[1].trim()); (forms[c]||=[]).push(n);} }
const P=names.filter(n=>/\(/.test(n));
console.log('distinct names',names.length,'name rows',rows.length,'distinct names with a parenthesis',P.length);
const o=Object.entries(forms).sort((a,b)=>b[1].length-a[1].length);
for(const [k,v] of o) console.log(String(v.length).padStart(4), k.padEnd(36), v.slice(0,5).join(' | '));
if(process.argv[3]) fs.writeFileSync(process.argv[3],JSON.stringify({distinctNames:names.length,withParen:P.length,forms:Object.fromEntries(o)},null,1));
