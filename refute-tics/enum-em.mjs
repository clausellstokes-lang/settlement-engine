import { readFileSync } from 'node:fs';
import { REGISTERS, DEV_PATHS, NOISE } from './registers.mjs';
const load = (f) => JSON.parse(readFileSync(f, 'utf8'));
const proseShapedAnyLength = (s) => { const m = s.replace(/\{[^}]*\}/g, '{}');
  if (!/[a-z]/.test(m)) return false;
  if (m.split(/\s+/).filter(Boolean).length < 2) return false;
  return !NOISE.some((r) => r.test(m)); };
const pickReg = (file) => { for (const R of REGISTERS) if (R.files && R.files.some((p) => p.test(file))) return R.id; return null; };
const rows = [];
for (const r of load('walk.json')) { if (/^src\/data\/(dossierStateProse|dossierCausalProse)/.test(r.file)) continue; if (DEV_PATHS.some((p)=>p.test(r.p))) continue; const id=pickReg(r.file); if (id) rows.push({register:id,file:r.file,text:r.text}); }
for (const r of load('inline.json')) rows.push({ register:'R18', file:r.file, line:r.line, text:r.text });
const want = process.argv[2];
const hits = rows.filter(r=>r.register===want && proseShapedAnyLength(r.text) && /—/.test(r.text));
const byFile = {};
for (const h of hits) (byFile[h.file] ||= []).push(h);
console.log('# '+want+' em-dash strings:', hits.length, ' files:', Object.keys(byFile).length);
for (const [f, hs] of Object.entries(byFile).sort((a,b)=>b[1].length-a[1].length)) {
  console.log('\n--- '+f+'  ('+hs.length+') ---');
  for (const h of hs) console.log('   L'+(h.line||'?')+': '+h.text.slice(0,170).replace(/\n/g,' '));
}
