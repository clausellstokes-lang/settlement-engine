// INDEPENDENT re-derivation of the mechanical row set, to expose the columns §5 does not print.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { REGISTERS, DEV_PATHS, NOISE } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/probe-all/registers.mjs';
const S = process.argv[2];
const load = (f) => JSON.parse(readFileSync(path.join(S, f), 'utf8'));
const pickReg = (file) => { for (const R of REGISTERS) if (R.files && R.files.some((p) => p.test(file))) return R.id; return null; };
const rows = [];
for (const r of load('json-leaves.json')) rows.push({ register: r.register, file: r.file, text: r.text });
for (const r of load('walk.json')) {
  if (/^src\/data\/(dossierStateProse|dossierCausalProse)/.test(r.file)) continue;
  if (DEV_PATHS.some((p) => p.test(r.p))) continue;
  const id = pickReg(r.file); if (id) rows.push({ register: id, file: r.file, text: r.text });
}
for (const r of load('inline.json')) rows.push({ register: 'R18', file: r.file, text: r.text });
for (const r of load('jsx.json')) for (const h of r.hits) rows.push({ register: 'R16', file: r.file, text: h });
for (const r of load('annex.json')) rows.push({ register: r.register === 'ANNEX-WIRED' ? 'A-W' : 'A-U', text: r.text, file: r.file });

const proseShaped = (s) => { const m = s.replace(/\{[^}]*\}/g, '{}');
  if (!/[a-z]/.test(m)) return false; if (m.split(/\s+/).filter(Boolean).length < 2) return false;
  return !NOISE.some((r) => r.test(m)); };

// ── 1. EN-DASH CONNECTORS, the third punctuation hard rule, never printed in §5
console.log('=== EN-DASH CONNECTORS (bible §3: "No en dashes as connectors either.") ===');
const en = {};
for (const r of rows) { if (!proseShaped(r.text)) continue; if (/\w–\w/.test(r.text)) (en[r.register] ||= []).push(r); }
for (const [id, list] of Object.entries(en).sort()) {
  console.log(`-- ${id}: ${list.length}`);
  for (const r of list.slice(0, 6)) console.log('    ', r.file, '::', r.text.slice(0, 130).replace(/\n/g, ' '));
}
console.log('EN-DASH TOTAL:', Object.values(en).reduce((a, l) => a + l.length, 0));

// ── 2. THE NOISE SCREEN'S BLIND SPOT for exclamations: strings the screen REJECTED that carry !
console.log('\n=== EXCLAMATION-BEARING STRINGS REJECTED BY THE PROSE SCREEN (invisible to "zero exclamations") ===');
const rejBang = rows.filter((r) => /!/.test(r.text) && !proseShaped(r.text) && !/!==|!=|\)\s*!|![A-Za-z_$]/.test(r.text));
console.log('count:', rejBang.length);
for (const r of rejBang.slice(0, 25)) console.log('   ', r.register, r.file, '::', JSON.stringify(r.text.slice(0, 110)));
const allBang = rows.filter((r) => /!/.test(r.text));
console.log('ALL rows containing "!" (any shape, incl. code):', allBang.length, '| of which prose-shaped:', allBang.filter((r) => proseShaped(r.text)).length);

// ── 3. TERMINOLOGY & VERB REGISTRY — §3's thirteen banned terms, none measured by Axis A
console.log('\n=== §3 TERMINOLOGY REGISTRY BREACHES (never measured by Axis A) ===');
const TERMS = [
  ['AI-generated', /\bAI[- ]generated\b/i], ['AI-narrated / AI overlay', /\bAI[- ](narrated|overlay)\b/i],
  ['live engine / payload', /\b(live engine|payload)\b/i], ['DM-private', /\bDM-private\b/i],
  ['unlock / push to (a size)', /\b(unlock(s|ed|ing)?|push to)\b/i], ['publicly visible / public-safe', /\b(publicly visible|public-safe)\b/i],
  ['"the PCs"', /\bthe PCs\b/], ['promotional intensifier (enormously/earn)', /\b(profit enormously|earn(s|ed|ing)? (a|your) campaign)\b/i],
  ['abstract enablement verb (supports/enables/attracts)', /\b(supports|enables|attracts)\b/i],
  ['"real"/"true" as quality judgment', /\b(a|the) (real|true) (campaign|world|settlement|town|city)\b/i],
  ['en dash as range/connector', /\w–\w/],
];
const hits = {};
for (const r of rows) { if (!proseShaped(r.text)) continue;
  for (const [name, re] of TERMS) if (re.test(r.text)) ((hits[name] ||= { n: 0, ex: [] }).n++, hits[name].ex.length < 4 && hits[name].ex.push(`${r.register} ${r.file}: ${r.text.slice(0, 100)}`)); }
for (const [name, h] of Object.entries(hits)) { console.log(`-- ${name}: ${h.n}`); for (const e of h.ex) console.log('     ', e.replace(/\n/g, ' ')); }
