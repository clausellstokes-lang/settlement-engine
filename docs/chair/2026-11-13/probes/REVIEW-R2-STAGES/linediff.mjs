// node linediff.mjs <dumpsA> <dumpsB> [seedsfile]: per seed, unique page lines (views folded) only in A, only in B, shared.
import fs from 'node:fs';
const [a,b,sf]=process.argv.slice(2); const seeds=fs.readFileSync(sf,'utf8').trim().split('\n');
const set=(f)=>new Set(fs.readFileSync(f,'utf8').split('\n').filter(l=>l&&!l.startsWith('== ')&&!l.startsWith('[STYLE]')));
let T=[0,0,0];
for(const s of seeds){ const A=set(`${a}/${s}.txt`),B=set(`${b}/${s}.txt`); const onlyA=[...A].filter(x=>!B.has(x)).length, onlyB=[...B].filter(x=>!A.has(x)).length, both=[...A].filter(x=>B.has(x)).length; T[0]+=onlyA;T[1]+=onlyB;T[2]+=both; console.log(s, 'onlyA',onlyA,'onlyB',onlyB,'shared',both); }
console.log('TOTAL onlyA',T[0],'onlyB',T[1],'shared',T[2]);
