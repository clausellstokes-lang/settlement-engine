import {towns} from './iter.mjs';
const c={}; const ex=[];
for await (const {seed,s} of towns(process.argv[2])){ const names=(s.institutions||[]).map(i=>i.name);
  for(const n of names){ const m=n.match(/\((high magic|if walled)\)\s*$/i); if(!m) continue; const walled=names.some(x=>/walls|palisade|rampart|fortif/i.test(x)); const k=n+' walled='+walled+' magic='+s.config.magicLevel; c[k]=(c[k]||0)+1; if(!walled&&/walled/.test(n)&&ex.length<5) ex.push(seed+' '+names.filter(x=>/gate|wall/i.test(x)).join('; ')); } }
console.log(c, ex);
