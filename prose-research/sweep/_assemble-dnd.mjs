// Assemble section-dnd.md (round 12) from: the round-9 section (unchanged feature blocks copied by number),
// new blocks in sweep/_r12/, and the generated tables. Run from the prose-research directory.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const old = readFileSync('sweep/section-dnd.r11.md', 'utf8').split('\n');
const blocks = {};
for (let i = 0; i < old.length; i++) {
  let m = old[i].match(/^\*\*(\d+)\. /); let key = null;
  if (m) key = 'F' + m[1]; else { m = old[i].match(/^\*\*Reconciliation (\d+) /); if (m) key = 'R' + m[1]; }
  if (!key) continue;
  let j = i + 1;
  while (j < old.length && !/^\*\*(\d+)\. /.test(old[j]) && !/^\*\*Reconciliation \d+ /.test(old[j]) && !/^## /.test(old[j])) j++;
  const lines = old.slice(i, j); while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  blocks[key] = lines.join('\n');
}
const part = (name) => existsSync('sweep/_r12/' + name) ? readFileSync('sweep/_r12/' + name, 'utf8').replace(/\s+$/, '') : null;
const must = (name) => { const p = part(name); if (p === null) throw new Error('missing new part ' + name); return p; };
const feat = (n) => { const nb = part('F' + String(n).padStart(2, '0') + '.md'); if (nb !== null) return nb; if (!blocks['F' + n]) throw new Error('missing old block F' + n); return blocks['F' + n]; };
const rec = (n) => { const nb = part('R' + String(n).padStart(2, '0') + '.md'); if (nb !== null) return nb; if (!blocks['R' + n]) throw new Error('missing old block R' + n); return blocks['R' + n]; };
const out = [];
out.push(must('00-header.md') + '\n');
out.push(must('01-method.md') + '\n');
out.push('## I. The house guide and what it actually governs\n'); for (let n = 1; n <= 14; n++) out.push(feat(n) + '\n');
out.push("## II. The publisher's adventure doctrine, in its own documents\n"); for (let n = 15; n <= 20; n++) out.push(feat(n) + '\n');
out.push('## III. The read-aloud craft rules, where official and community converge\n'); for (let n = 21; n <= 29; n++) out.push(feat(n) + '\n');
out.push('## IV. The key: order, format, density\n'); for (let n = 30; n <= 37; n++) out.push(feat(n) + '\n');
out.push('## V. The place and the record: how official D&D writes a settlement\n'); for (let n = 38; n <= 50; n++) out.push(feat(n) + '\n');
out.push(must('06-partVI-intro.md') + '\n'); for (let n = 51; n <= 61; n++) out.push(feat(n) + '\n');
out.push('## Reconciliations: the ten self-contradictions of the round-8 section, resolved\n');
out.push(must('07-recon-intro.md') + '\n'); for (let n = 1; n <= 10; n++) out.push(rec(n) + '\n');
out.push(must('08-tail.md') + '\n');
out.push(must('09-coverage.md') + '\n');
const ai = old.findIndex(l => l.startsWith('## Appendix')); const pi = old.findIndex(l => l.startsWith('## PARTIAL rows'));
out.push(old.slice(ai, pi).join('\n').replace(/\s+$/, '') + '\n');
out.push(must('10-route-table.md') + '\n');
out.push(must('11-partial-table.md') + '\n');
const text = out.join('\n');
writeFileSync('sweep/section-dnd.md', text);
const newParts = Object.keys(blocks).filter(k => existsSync('sweep/_r12/' + k.replace(/^([FR])(\d+)$/, (m, a, b) => a + b.padStart(2, '0')) + '.md'));
console.log('written bytes', Buffer.byteLength(text), 'lines', text.split('\n').length, 'old blocks parsed', Object.keys(blocks).length, 'replaced by new parts:', newParts.join(','));
