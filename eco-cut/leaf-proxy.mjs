// $SC/kit/eco-cut/leaf-proxy.mjs <dock> [prefix...] — the clarity sweep's parser and proxy, over the
// WORKING TREE alone, listing every unit that still fails and how. Reports; refuses nothing.
import fs from 'node:fs'; import path from 'node:path';
const [dock, ...prefixes] = process.argv.slice(2);
const mg = await import(path.join(dock, 'src/domain/prose/moveGrammar.js'));
const ANNEX='docs/content/RECEIPT_POOLS_DOSSIER_STATE.md';
const tree = fs.readFileSync(path.join(dock, ANNEX),'utf8');
function parse(text, prefix){ const out=[]; let blk=null, pool=null, v=0;
  for (const [i,l] of text.split('\n').entries()) { let m;
    if ((m=l.match(/^### (DS-[A-Z]+-\d+)/))) { blk = l.startsWith(prefix) ? m[1] : null; pool=null; continue; }
    if (!blk) continue;
    if ((m=l.trim().match(/^\*\*(.+?)\*\* — (\d+\. `\[.+)$/))) { pool=m[1]; v=0;
      for (const part of m[2].split(/ · (?=\d+\. `\[)/)) { const mm=part.match(/^(\d+)\. `\[([^\]]+)\]` (.+)$/); if (mm) { v=+mm[1]; out.push({blk,pool,where:`v${v} SPINE`,line:i+1,text:mm[3].replace(/<!--.*?-->/g,'').trim()}); } }
      continue; }
    if ((m=l.trim().match(/^\*\*(.+)\*\*$/))) { pool=m[1]; v=0; continue; }
    if ((m=l.match(/^(\d+)\. `\[([^\]]+)\]` (.+)/))) { v=+m[1]; out.push({blk,pool,where:`v${v} SPINE`,line:i+1,text:m[3].replace(/<!--.*?-->/g,'').trim()}); continue; }
    if ((m=l.match(/^\s*- `\[face\]` (?:`\[(.+?)\]` )?(.+)/))) { out.push({blk,pool,where:`v${v} face [${m[1]||''}]`,line:i+1,text:m[2].replace(/<!--.*?-->/g,'').trim()}); }
  } return out; }
const GLOSS=/\b(has it that|have it that|puts it that|the account is|the talk is that|'s position is|'s account is|'s own account|'s word is|own answer is|the word is that|the view is that|'s view is)\b/;
const ARCH=/\b(granary|infirmary|pedlar|factor|watchman|sexton|alehouse|bier|billhook|gaol|patrolman|tallow)\b/;
function proxy(t){ const f=[]; if (t.includes(' and that ')) f.push('and-that'); if (GLOSS.test(t)) f.push('gloss');
  if (t.split(/(?<=[.!?])\s+/).some(x=>x.split(/\s+/).length>24)) f.push('>24w'); if (ARCH.test(t)) f.push('archaism'); if (/;|—|!|\d|\bwill\b|\bshall\b/.test(t)) f.push('bar'); return f; }
let n=0, fail=0;
for (const prefix of prefixes) for (const u of parse(tree, prefix)) { n++; const f=proxy(u.text); if (!f.length) continue; fail++;
  const m=mg.classifyMoves(u.text);
  console.log(`${u.blk} · ${u.pool} · ${u.where} · L${u.line}\n   FLAGS ${f.join(',')} · MOVES ${m.join('+')} · order ${mg.orderIdOf(m)||'none'}\n   ${u.text}\n`); }
console.log(`units ${n} · still failing ${fail}`);
