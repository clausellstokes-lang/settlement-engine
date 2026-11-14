// node honor.mjs <tree> <corpus...>: honorifics whose gender word contradicts the card's gender
import { recs } from './rd.mjs'; import path from 'node:path';
const T=path.resolve(process.argv[2]);
const { cardHonorificOf } = await import(T+'/src/domain/people/cardDoor.js');
const FEM=/\b(Goodwife|Mother|Matron|Madam|Sister|Lady|Alewife|Abbess|Queen|Priestess|Mistress|Dame)\b/; const MAS=/\b(Goodman|Father|Brother|Lord|Abbot|King|Priest)\b|man$/;
const C={}; const towns={};
for (const f of process.argv.slice(3)) for await (const {seed,s} of recs(f)) for (const c of s.npcs||[]) {
  let h=''; try { h=cardHonorificOf(c, s)||''; } catch(e) { h='ERR'; }
  const bad = (c.gender==='male' && FEM.test(h)) || (c.gender==='female' && MAS.test(h) && !/Headman|Foreman|Ferryman|Tollman|Dairyman|Frontman|Spokesman|Shaman/.test(h));
  if (bad) { const k=`${h} on ${c.gender} (${c.institution?.title})`; C[k]=(C[k]||0)+1; (towns[k]??=new Set()).add(seed); }
}
for (const k of Object.keys(C).sort((a,b)=>C[b]-C[a])) console.log(C[k], towns[k].size, k);
