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
function parse(text){ const out=[]; let blk=null, header=null, pool=null, v=0;
  for (const l of text.split('\n')) { let m;
    if ((m=l.match(/^### (DS-[A-Z]+-\d+)/))) { blk = PREFIXES.some(p=>l.startsWith(p)) ? m[1] : null; header=null; pool=null; continue; }
    if (!blk) continue;
    // a FACE row (form 1 only)
    if ((m=l.match(/^\s*- `\[face\]` (?:`\[(.+?)\]` )?(.+)/))) { out.push({blk,pool,where:`v${v} face [${m[1]||''}]`,form:1,text:m[2].replace(/<!--.*?-->/g,'').trim()}); continue; }
    // FORM 3 — the BULLET CELL: `- `CELL` — 1. `[tag]` … · 2. …`; the preceding `**field**` is a GROUPING HEADER, not a pool.
    if ((m=l.match(/^- (.+?)(?:\s+\*[^*]*\*)* — (\d+\. `\[.+)$/))) { pool=(header?header+': ':'')+m[1].replace(/`/g,''); v=0;
      for (const s of splitInline(m[2])) { v=s.v; out.push({blk,pool,where:`v${v} SPINE`,form:3,text:s.text.replace(/<!--.*?-->/g,'').trim()}); }
      continue; }
    // FORM 2 — the INLINE POOL: `**key** — 1. `[tag]` … · 2. …`
    if ((m=l.trim().match(/^\*\*(.+?)\*\*(?:\s+\*[^*]*\*)* — (\d+\. `\[.+)$/))) { pool=m[1].replace(/`/g,''); header=null; v=0;
      for (const s of splitInline(m[2])) { v=s.v; out.push({blk,pool,where:`v${v} SPINE`,form:2,text:s.text.replace(/<!--.*?-->/g,'').trim()}); }
      continue; }
    // a BOLD HEAD: the FIRST bold segment only (trailing italics and further bold segments are annotation)
    if ((m=l.match(/^\*\*(.+?)\*\*/))) { header=m[1].replace(/`/g,'').replace(/:$/,''); pool=header; v=0; continue; }
    // FORM 1 — the numbered SPINE under a bold head
    if ((m=l.match(/^(\d+)\. `\[([^\]]+)\]` (.+)/))) { v=+m[1]; out.push({blk,pool,where:`v${v} SPINE`,form:1,text:m[3].replace(/<!--.*?-->/g,'').trim()}); continue; }
  } return out; }
const GLOSS=/\b(has it that|have it that|puts it that|the account is|the talk is that|'s position is|'s account is|'s own account|'s word is|own answer is|the word is that|the view is that|'s view is)\b/;
const ARCH=/\b(granary|infirmary|pedlar|factor|watchman|sexton|alehouse|bier|billhook|gaol|patrolman|tallow)\b/;
function stripNotes(t){ return t.replace(/\*—[^*]*\*/g,' '); }   // italic AUTHORING NOTES are stripped by cleanText before the projection
// ⛔ INSTRUMENT DEBT, FOUND ON THIS LEAF: the bar regex's `\d` arm fires on the SLOT NAME `{faction2}`
// (and `{parties2}`-shaped names generally), which never reaches a reader — the slot fills with a faction's
// name. `stripSlots` renders slots the way the projection does before the bar is applied. RAWPROXY=1
// restores the chair's own counting so this leaf's figure stays comparable with power's and warFaith's.
function stripSlots(t){ return process.env.RAWPROXY ? t : t.replace(/\{[a-zA-Z_]+\d*\}/g,'the town'); }
function proxy(t0){ const t=stripSlots(stripNotes(t0)); const f=[]; if (t.includes(' and that ')) f.push('and-that'); if (GLOSS.test(t)) f.push('gloss');
  if (t.split(/(?<=[.!?])\s+/).some(x=>x.split(/\s+/).length>24)) f.push('>24w'); if (ARCH.test(t)) f.push('archaism'); if (/;|—|!|\d|\bwill\b|\bshall\b/.test(t)) f.push('bar'); return f; }
const a=parse(head), b=parse(tree);
if (process.env.ROSTER) { const by={}; for (const r of b) { const k=r.blk+' :: '+r.pool; (by[k] ||= {n:0,form:r.form}); by[k].n++; }
  for (const k of Object.keys(by)) console.log(`${k} :: units=${by[k].n} :: form=${by[k].form}`);
  console.log(`ROSTER: pools ${Object.keys(by).length} · units ${b.length}`); process.exit(0); }

// ── THE FIVE FIGURES, over ALL THREE FORMS. Close / forecast / self-citation regexes ported
// VERBATIM from measure-block.py (which is itself the kernel's `closeClassOf`), because that
// instrument's own pool parser sees form 1 only and is blind to 166 units of this leaf.
const REASSURANCE_RE=/(?:all is well|nothing to fear|in good order|as it should be|nothing amiss|no cause for alarm)[.?!]?\s*$/i;
const WHICH_TAIL_RE=/,\s*which\b[^.?!]*[.?!]?\s*$/i;
const SUMMARY_RE=/(?:,\s*(?:and that is|which is to say|so)\b|\.\s+(?:and that is|which is to say)\b)[^.?!]*[.?!]?\s*$/i;
const ANTITHESIS_RE=/,\s*(?:and not|but not|never|not)\b[^.?!]*[.?!]?\s*$/i;
const QUESTION_RE=/,\s*(?:whether|who|what|where|why|how)\b[^.?!]*\.\s*$/i;
const SELF_CITE=/\b(?:the survey|this office|the record has|entered as|set down here)\b/i;
const FORECAST=/\b(?:will|shall)\s+(?:not\s+|never\s+|no longer\s+)?[a-z]+\b/i;
function closeClassOf(t){ const raw=(t||'').trim(); if(!raw) return 'plain';
  if(REASSURANCE_RE.test(raw)) return 'reassurance'; if(WHICH_TAIL_RE.test(raw)) return 'which-tail';
  if(SUMMARY_RE.test(raw)) return 'summary'; if(ANTITHESIS_RE.test(raw)) return 'antithesis';
  if(QUESTION_RE.test(raw)) return 'question'; return 'plain'; }
const RENDER=t=>stripNotes(t).replace(/\{[a-zA-Z_]+\}/g,'the town').replace(/`/g,'').replace(/\*/g,'').trim();
function sentsOf(t){ return RENDER(t).split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(Boolean); }
function figures(rows){ const by={};
  for (const r of rows){ const k=r.blk; (by[k] ||= {units:0,sent:0,words:0,pools:{},closes:{},fc:0,sc:0});
    const B=by[k]; B.units++; const ss=sentsOf(r.text); B.sent+=ss.length;
    const w=RENDER(r.text).split(/\s+/).filter(Boolean).length; B.words+=w;
    (B.pools[r.pool] ||= {w:0,s:0}); B.pools[r.pool].w+=w; B.pools[r.pool].s+=ss.length;
    const c=closeClassOf(r.text); B.closes[c]=(B.closes[c]||0)+1;
    if (FORECAST.test(RENDER(r.text))) B.fc++; if (SELF_CITE.test(RENDER(r.text))) B.sc++; }
  return by; }
function med(a){ if(!a.length) return 0; const s=[...a].sort((x,y)=>x-y), m=s.length>>1; return s.length%2?s[m]:(s[m-1]+s[m])/2; }
if (process.env.FIGURES) {
  const fa=figures(a), fb=figures(b);
  const blocks=[...new Set(b.map(r=>r.blk))].sort((x,y)=>{const n=z=>[z.replace(/-\d+$/,''),+z.match(/\d+$/)[0]]; const [ax,an]=n(x),[bx,bn]=n(y); return ax===bx?an-bn:ax.localeCompare(bx);});
  let TW=[0,0],TS=[0,0],TU=0;
  for (const blk of blocks){ const A=fa[blk]||{units:0,sent:0,words:0,pools:{},closes:{},fc:0,sc:0}, B=fb[blk];
    const wpsA=med(Object.values(A.pools).map(p=>p.s?p.w/p.s:0)), wpsB=med(Object.values(B.pools).map(p=>p.s?p.w/p.s:0));
    const cs=o=>Object.entries(o).sort().map(([k,v])=>`${k} ${v}`).join('/');
    console.log(`${blk.padEnd(10)} units ${String(B.units).padStart(4)} · sentences ${A.sent} -> ${B.sent} · words ${A.words} -> ${B.words} · wps median ${wpsA.toFixed(2)} -> ${wpsB.toFixed(2)} · closes [${cs(A.closes)}] -> [${cs(B.closes)}] · forecasts ${A.fc} -> ${B.fc} · self-citations ${A.sc} -> ${B.sc}`);
    TW[0]+=A.words; TW[1]+=B.words; TS[0]+=A.sent; TS[1]+=B.sent; TU+=B.units; }
  console.log(`LEAF: units ${TU} · sentences ${TS[0]} -> ${TS[1]} · words ${TW[0]} -> ${TW[1]}`);
  process.exit(0); }

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
