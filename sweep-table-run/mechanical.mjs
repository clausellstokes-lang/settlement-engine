// MECHANICAL — the voice bible's §3 HARD RULES, counted over the PRE-ADMISSION extraction.
// The bible's rule is "any user-facing STRING", not "any sentence", so the prose-admission floor
// (>= 20 chars / >= 4 words) is the wrong screen for it: it drops "Email confirmed!" (16 chars,
// two words), which is exactly the kind of string the rule exists to catch.
// Cross-checked against the estate's own voiceMechanics tier-3 finding (396 em dashes,
// 10 exclamation points already live in .jsx).
// Usage: node mechanical.mjs <DIR> <OUT.json>
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { REGISTERS, DEV_PATHS, NOISE, admit } from './registers.mjs';

// PROSE-SHAPED AT ANY LENGTH: the admission NOISE screen (which drops regex source, code
// fragments, ids and the annexes' connective-table rows) WITHOUT the length floor, so a short
// reader string like "Email confirmed!" is counted and `(?<![.\w])blockadeBypass\s*,` is not.
const proseShapedAnyLength = (s) => {
  const m = s.replace(/\{[^}]*\}/g, '{}');
  if (!/[a-z]/.test(m)) return false;
  if (m.split(/\s+/).filter(Boolean).length < 2) return false;
  return !NOISE.some((r) => r.test(m));
};

const S = process.argv[2];
const OUT = process.argv[3];
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
for (const r of load('annex.json')) rows.push({ register: r.register === 'ANNEX-WIRED' ? 'A-W' : 'A-U', file: r.file, text: r.text });

const out = {};
const examples = {};
for (const r of rows) {
  const o = (out[r.register] ||= { allStrings: 0, strings: 0, emDash: 0, emDashStrings: 0, bang: 0, bangStrings: 0, enDashConnector: 0, thePCs: 0, emphasisCaps: 0, belowFloorEm: 0, belowFloorBang: 0 });
  o.allStrings++;
  if (!proseShapedAnyLength(r.text)) continue;
  o.strings++;
  const unit = (REGISTERS.find((R) => R.id === r.register) || {}).unit || 'sentence';
  if (!admit(r.text, unit)) {
    if (/—/.test(r.text)) o.belowFloorEm++;
    if (/!/.test(r.text)) o.belowFloorBang++;
  }
  const em = (r.text.match(/—/g) || []).length;
  const bang = (r.text.match(/!/g) || []).length;
  if (em) { o.emDash += em; o.emDashStrings++; ((examples[r.register] ||= {}).em ||= []).push(r); }
  if (bang) { o.bang += bang; o.bangStrings++; ((examples[r.register] ||= {}).bang ||= []).push(r); }
  if (/\w–\w/.test(r.text)) o.enDashConnector++;
  if (/\bthe PCs\b/.test(r.text)) { o.thePCs++; ((examples[r.register] ||= {}).pcs ||= []).push(r); }
  if (/\b[A-Z]{3,}\b/.test(r.text.replace(/\{[^}]*\}/g, '').replace(/\b(DM|DMs|PDF|NPC|NPCs|PC|PCs|AI|UI|GM|TTRPG|URL|API|CSV|FAQ|USD|EU|UK|US|ID|IDs)\b/g, ''))) o.emphasisCaps++;
}
writeFileSync(OUT, JSON.stringify({ counts: out, examples: Object.fromEntries(Object.entries(examples).map(([k, v]) => [k, { em: (v.em || []).slice(0, 6), bang: (v.bang || []).slice(0, 6), pcs: (v.pcs || []).slice(0, 6) }])) }, null, 1));
console.log('reg'.padEnd(6), 'prose-strings'.padStart(13), 'em-dash'.padStart(8), '(strings)'.padStart(10), 'excl'.padStart(6), '(strings)'.padStart(10), 'CAPS'.padStart(6), 'the PCs'.padStart(8));
for (const [id, o] of Object.entries(out).sort()) {
  console.log(id.padEnd(6), String(o.strings).padStart(8), String(o.emDash).padStart(8), String(o.emDashStrings).padStart(10), String(o.bang).padStart(6), String(o.bangStrings).padStart(10), String(o.emphasisCaps).padStart(6), String(o.thePCs).padStart(8));
}
const T = Object.values(out).reduce((a, o) => ({ strings: a.strings + o.strings, emDash: a.emDash + o.emDash, bang: a.bang + o.bang }), { strings: 0, emDash: 0, bang: 0 });
console.log('TOTAL'.padEnd(6), String(T.strings).padStart(8), String(T.emDash).padStart(8), ' '.repeat(10), String(T.bang).padStart(6));
