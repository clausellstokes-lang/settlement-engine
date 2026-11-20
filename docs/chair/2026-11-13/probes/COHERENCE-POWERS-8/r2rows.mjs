// r2rows.mjs <tree> <corpus.ndjson.gz>...: R2 — every relationship row's role word against its card's own style.
// A woman's row DISAGREES where her title's registry form is gendered and the row's word keeps the masculine form's last word
// ("the lord" beside "Lady"). The reader's own count (claims4305 :: femaleLordRows): a minted card (kind power), a woman, /\bthe lord\b/.
// Men's rows: the row's word equals the card's role.
import path from 'node:path'; import { recs } from './rd.mjs';
const TREE=process.argv[2]; const { FACE_HONORIFICS } = await import(path.join(TREE,'src/data/faceHonorifics.js'));
const R={births:0, rows:0, femaleEnds:0, disagree:0, byWord:{}, readerFemaleLord:0, menEnds:0, menChanged:0, ex:[]};
for (const f of process.argv.slice(3)) for await (const {seed,s} of recs(f)) { R.births++;
  const by=new Map((s.npcs||[]).map(c=>[c.id,c]));
  for (const r of s.relationships||[]) { R.rows++;
    for (const [id,word] of [[r.from,r.npc1Role],[r.to,r.npc2Role]]) { const c=by.get(id); if(!c) continue;
      if (c.gender==='female') { R.femaleEnds++;
        const form=(FACE_HONORIFICS[String(c.role||'').trim()]||[]).find(h=>typeof h!=='string');
        const m=form&&form.male.split(' ').at(-1).toLowerCase(), fe=form&&form.female.split(' ').at(-1).toLowerCase();
        if (m && m!==fe && new RegExp(`\\b${m}\\b`,'i').test(String(word||''))) { R.disagree++; R.byWord[c.role]=(R.byWord[c.role]||0)+1; if(R.ex.length<6) R.ex.push(`${seed}: ${c.name} row "${word}"`); }
        if (c.institution?.kind==='power' && /\bthe lord\b/.test(String(word||''))) R.readerFemaleLord++;
      } else { R.menEnds++; if (word!==c.role) R.menChanged++; } } } }
console.log(JSON.stringify(R,null,1));
