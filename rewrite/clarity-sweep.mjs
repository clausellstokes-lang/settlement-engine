// clarity-sweep.mjs <dock>  (tag regex widened 2026-09-14: `[x · dm-only]` rows were invisible to `\w+`) <heading-prefix e.g. "### DS-POW-"> [base-rev=HEAD]
// THE CLAIM-FREEZE INSTRUMENT (chair, 2026-09-14): for every spine and face under the prefix that differs
// between <base-rev> and the working tree, print the move-grammar sequence before and after (classifyMoves),
// the LEVEL1 order id before and after (orderIdOf), and the owner's-test proxy before and after. Reports; refuses nothing.
import fs from 'node:fs'; import { execSync } from 'node:child_process'; import path from 'node:path';
const [dock, prefix, base='HEAD'] = process.argv.slice(2);
const mg = await import(path.join(dock, 'src/domain/prose/moveGrammar.js'));
const ANNEX='docs/content/RECEIPT_POOLS_DOSSIER_STATE.md';
const head = execSync(`git -C "${dock}" show ${base}:${ANNEX}`, {maxBuffer: 1<<28}).toString();
const tree = fs.readFileSync(path.join(dock, ANNEX),'utf8');
function parse(text){ const out=[]; let blk=null, pool=null, v=0;
  for (const l of text.split('\n')) { let m;
    if ((m=l.match(/^### (DS-[A-Z]+-\d+)/))) { blk = l.startsWith(prefix) ? m[1] : null; pool=null; continue; }
    if (!blk) continue;
    // the INLINE pool form (DS-REL-1 and others): `**key** — 1. `[tag]` text · 2. `[tag]` text …` on one line — invisible until 2026-09-14
    if ((m=l.trim().match(/^\*\*(.+?)\*\* — (\d+\. `\[.+)$/))) { pool=m[1]; v=0;
      for (const part of m[2].split(/ · (?=\d+\. `\[)/)) { const mm=part.match(/^(\d+)\. `\[([^\]]+)\]` (.+)$/); if (mm) { v=+mm[1]; out.push({blk,pool,where:`v${v} SPINE`,text:mm[3].replace(/<!--.*?-->/g,'').trim()}); } }
      continue; }
    if ((m=l.trim().match(/^\*\*(.+)\*\*$/))) { pool=m[1]; v=0; continue; }
    if ((m=l.match(/^(\d+)\. `\[([^\]]+)\]` (.+)/))) { v=+m[1]; out.push({blk,pool,where:`v${v} SPINE`,text:m[3].replace(/<!--.*?-->/g,'').trim()}); continue; }
    if ((m=l.match(/^\s*- `\[face\]` (?:`\[(.+?)\]` )?(.+)/))) { out.push({blk,pool,where:`v${v} face [${m[1]||''}]`,text:m[2].replace(/<!--.*?-->/g,'').trim()}); }
  } return out; }
const GLOSS=/\b(has it that|have it that|puts it that|the account is|the talk is that|'s position is|'s account is|'s own account|'s word is|own answer is|the word is that|the view is that|'s view is)\b/;
const ARCH=/\b(granary|infirmary|pedlar|factor|watchman|sexton|alehouse|bier|billhook|gaol|patrolman|tallow)\b/;
function proxy(t){ const f=[]; if (t.includes(' and that ')) f.push('and-that'); if (GLOSS.test(t)) f.push('gloss');
  if (t.split(/(?<=[.!?])\s+/).some(x=>x.split(/\s+/).length>24)) f.push('>24w'); if (ARCH.test(t)) f.push('archaism'); if (/;|—|!|\d|\bwill\b|\bshall\b/.test(t)) f.push('bar'); return f; }
const a=parse(head), b=parse(tree);
if (a.length!==b.length) { console.log(`⛔ UNIT COUNT MOVED ${a.length} -> ${b.length}: a spine or face was added or removed — STOP`); }
let changed=0, shifts=0, orderLost=0, pB=0, pA=0;
for (let i=0;i<Math.min(a.length,b.length);i++){ const x=a[i], y=b[i];
  if (x.where!==y.where||x.pool!==y.pool) { console.log(`⛔ ROW MISALIGNED at ${i}: ${x.pool} ${x.where} vs ${y.pool} ${y.where}`); break; }
  const fa=proxy(x.text).length===0, fb=proxy(y.text).length===0; pB+=fa; pA+=fb;
  if (x.text===y.text) continue; changed++;
  const ma=mg.classifyMoves(x.text), mb=mg.classifyMoves(y.text); const oa=mg.orderIdOf(ma)||'', ob=mg.orderIdOf(mb)||'';
  const flags=[]; if (ma.join('+')!==mb.join('+')) { shifts++; flags.push(`MOVES ${ma.join('+')} -> ${mb.join('+')}`); }
  // LEVEL1 orders are stamped and enforced on SPINES (the census's variant grammars); a face carries no order of its own, so a face's loss is reported, never a stop.
  const isSpine = x.where.endsWith('SPINE');
  if (oa && !ob) { if (isSpine) orderLost++; flags.push(isSpine ? `⛔ LEVEL1 ORDER ${oa} LOST ON A SPINE` : `(face) order ${oa} -> none, informational`); } else if (oa!==ob) flags.push(`order ${oa||'none'} -> ${ob||'none'}`);
  if (mb.includes('PROVENANCE') && !ma.includes('PROVENANCE')) flags.push('⛔ PROVENANCE ADDED (A13)');
  if (mb.includes('HISTORY') && !ma.includes('HISTORY')) flags.push('⚠ HISTORY ADDED (check habitual -> episode)');
  const pb=proxy(y.text); if (pb.length) flags.push('proxy still fails: '+pb.join(','));
  if (flags.length) console.log(`${x.blk} · ${x.pool} · ${x.where}\n   ${flags.join(' | ')}\n   WAS: ${x.text}\n   NOW: ${y.text}\n`);
}
console.log(`units ${b.length} · changed ${changed} · move-grammar shifts ${shifts} · LEVEL1 orders lost ON SPINES ${orderLost} · owner-proxy ${pB} -> ${pA} of ${b.length}`);
