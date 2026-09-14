// clarity-sweep-gen.mjs <dock> <prefix-list, comma-separated e.g. "### DS-GEN-,### DS-HK-"> [base-rev=HEAD]
// THE CLAIM-FREEZE INSTRUMENT, WIDENED A THIRD TIME (general lane, 2026-09-14).
// clarity-sweep.mjs sees two authoring forms: the BLOCK form (`**key**` then `N. `[tag]` text` lines)
// and the INLINE POOL form (`**key** — 1. `[tag]` … · 2. …` on one line, widened for DS-REL-1).
// DS-GEN-3 uses a THIRD: a `**field**` GROUPING HEADER whose pools are BULLET CELLS one per line —
//   `- `CELL` — 1. `[tag]` text · 2. `[tag]` text · 3. `[tag]` text`
// The `**field**` line is NOT a pool; each `- …` bullet IS one, and the census/wave gate agree
// (DS-GEN-3 = 42 pools / 128 units, where every kit instrument saw 7 pools / 0 spines).
// Also takes MULTIPLE prefixes in one run, so a leaf split across wave-gate sections measures as one leaf.
import fs from 'node:fs'; import { execSync } from 'node:child_process'; import path from 'node:path';
const [dock, prefixArg, base='HEAD'] = process.argv.slice(2);
const PREFIXES = prefixArg.split(',').map(s=>s.trim()).filter(Boolean);
const mg = await import(path.join(dock, 'src/domain/prose/moveGrammar.js'));
const ANNEX='docs/content/RECEIPT_POOLS_DOSSIER_STATE.md';
const head = execSync(`git -C "${dock}" show ${base}:${ANNEX}`, {maxBuffer: 1<<28}).toString();
const tree = fs.readFileSync(path.join(dock, ANNEX),'utf8');
function splitInline(rest){ const out=[];
  for (const part of rest.split(/ · (?=\d+\. `\[)/)) { const mm=part.match(/^(\d+)\. `\[([^\]]+)\]` (.+)$/); if (mm) out.push({v:+mm[1], tag:mm[2], text:mm[3]}); }
  return out; }
function parse(text){ const out=[]; let blk=null, pool=null, v=0;
  for (const l of text.split('\n')) { let m;
    if ((m=l.match(/^### (DS-[A-Z]+-\d+)/))) { blk = PREFIXES.some(p=>l.startsWith(p)) ? m[1] : null; pool=null; continue; }
    if (!blk) continue;
    // FORM 3 — the bullet cell (DS-GEN-3). Checked BEFORE the others; a `- ` line is never a `**key**` line.
    if ((m=l.match(/^- (.+?) — (\d+\. `\[.+)$/))) { pool=m[1].replace(/`/g,''); v=0;
      for (const s of splitInline(m[2])) { v=s.v; out.push({blk,pool,where:`v${v} SPINE`,form:3,text:s.text.replace(/<!--.*?-->/g,'').trim()}); }
      continue; }
    // FORM 2 — the inline pool (DS-REL-1)
    if ((m=l.trim().match(/^\*\*(.+?)\*\* — (\d+\. `\[.+)$/))) { pool=m[1].replace(/`/g,''); v=0;
      for (const s of splitInline(m[2])) { v=s.v; out.push({blk,pool,where:`v${v} SPINE`,form:2,text:s.text.replace(/<!--.*?-->/g,'').trim()}); }
      continue; }
    // FORM 1 — the block pool
    if ((m=l.trim().match(/^\*\*(.+)\*\*$/))) { pool=m[1].replace(/`/g,''); v=0; continue; }
    if ((m=l.match(/^(\d+)\. `\[([^\]]+)\]` (.+)/))) { v=+m[1]; out.push({blk,pool,where:`v${v} SPINE`,form:1,text:m[3].replace(/<!--.*?-->/g,'').trim()}); continue; }
    if ((m=l.match(/^\s*- `\[face\]` (?:`\[(.+?)\]` )?(.+)/))) { out.push({blk,pool,where:`v${v} face [${m[1]||''}]`,form:1,text:m[2].replace(/<!--.*?-->/g,'').trim()}); }
  } return out; }
const GLOSS=/\b(has it that|have it that|puts it that|the account is|the talk is that|'s position is|'s account is|'s own account|'s word is|own answer is|the word is that|the view is that|'s view is)\b/;
const ARCH=/\b(granary|infirmary|pedlar|factor|watchman|sexton|alehouse|bier|billhook|gaol|patrolman|tallow)\b/;
function stripNotes(t){ return t.replace(/\*—[^*]*\*/g,' '); }   // italic AUTHORING NOTES are stripped by cleanText before the projection
function proxy(t0){ const t=stripNotes(t0); const f=[]; if (t.includes(' and that ')) f.push('and-that'); if (GLOSS.test(t)) f.push('gloss');
  if (t.split(/(?<=[.!?])\s+/).some(x=>x.split(/\s+/).length>24)) f.push('>24w'); if (ARCH.test(t)) f.push('archaism'); if (/;|—|!|\d|\bwill\b|\bshall\b/.test(t)) f.push('bar'); return f; }
const a=parse(head), b=parse(tree);
if (process.env.ROSTER) { const by={}; for (const r of b) { const k=r.blk+' :: '+r.pool; (by[k] ||= {n:0,form:r.form}); by[k].n++; }
  for (const k of Object.keys(by)) console.log(`${k} :: units=${by[k].n} :: form=${by[k].form}`);
  console.log(`ROSTER: pools ${Object.keys(by).length} · units ${b.length}`); process.exit(0); }
if (a.length!==b.length) { console.log(`⛔ UNIT COUNT MOVED ${a.length} -> ${b.length}: a spine or face was added or removed — STOP`); }
let changed=0, shifts=0, orderLost=0, pB=0, pA=0;
for (let i=0;i<Math.min(a.length,b.length);i++){ const x=a[i], y=b[i];
  if (x.where!==y.where||x.pool!==y.pool) { console.log(`⛔ ROW MISALIGNED at ${i}: ${x.pool} ${x.where} vs ${y.pool} ${y.where}`); break; }
  const fa=proxy(x.text).length===0, fb=proxy(y.text).length===0; pB+=fa; pA+=fb;
  if (x.text===y.text) continue; changed++;
  const ma=mg.classifyMoves(x.text), mb=mg.classifyMoves(y.text); const oa=mg.orderIdOf(ma)||'', ob=mg.orderIdOf(mb)||'';
  const flags=[]; if (ma.join('+')!==mb.join('+')) { shifts++; flags.push(`MOVES ${ma.join('+')} -> ${mb.join('+')}`); }
  const isSpine = x.where.endsWith('SPINE');
  if (oa && !ob) { if (isSpine) orderLost++; flags.push(isSpine ? `⛔ LEVEL1 ORDER ${oa} LOST ON A SPINE` : `(face) order ${oa} -> none, informational`); } else if (oa!==ob) flags.push(`order ${oa||'none'} -> ${ob||'none'}`);
  if (mb.includes('PROVENANCE') && !ma.includes('PROVENANCE')) flags.push('⛔ PROVENANCE ADDED (A13)');
  if (mb.includes('HISTORY') && !ma.includes('HISTORY')) flags.push('⚠ HISTORY ADDED (check habitual -> episode)');
  const pb=proxy(y.text); if (pb.length) flags.push('proxy still fails: '+pb.join(','));
  if (flags.length) console.log(`${x.blk} · ${x.pool} · ${x.where}\n   ${flags.join(' | ')}\n   WAS: ${x.text}\n   NOW: ${y.text}\n`);
}
console.log(`units ${b.length} · changed ${changed} · move-grammar shifts ${shifts} · LEVEL1 orders lost ON SPINES ${orderLost} · owner-proxy ${pB} -> ${pA} of ${b.length}`);
