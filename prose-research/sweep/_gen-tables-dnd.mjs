// Generate the PARTIAL table (11-partial-table.md) and print the route-row skeleton, from the merge outputs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
mkdirSync('sweep/_r12', { recursive: true });
const st = JSON.parse(readFileSync('sweep/state-dnd.json', 'utf8'));
const partial = JSON.parse(readFileSync('sweep/partial-dnd.json', 'utf8'));
const angles = JSON.parse(readFileSync('sweep/_angles-dnd.json', 'utf8'));
const tw = s => String(s || '').replace(/\s+/g, ' ').replace(/\|/g, '/');
const cut = (s, n) => { const w = tw(s).trim().split(/\s+/).filter(Boolean); return w.length > n ? w.slice(0, n).join(' ') + ' …' : w.join(' '); };
const route = new Set([...Array(8).keys()].map(i => 932 + i).concat([...Array(19).keys()].map(i => 944 + i)).concat([...Array(13).keys()].map(i => 972 + i)));
const t = ['## PARTIAL rows (cited above only for their quotation; never for the unsupported limb)', '',
  partial.length + ' rows. "(fs)" marks a row whose full trueWording exceeds twelve words; every quotation here is cut at eleven words. "(RQ)" marks one of the forty ROUTE QUESTIONED rows, whose unsupported limb is the witness itself (the thirty lowered by the round-12 regrade carry the mark in their verdict note; the ten already PARTIAL on a limb carry it by the chair\'s ruling and show their original limb here). The limb column is the verifier\'s statement of what the page does not support, compressed.', '',
  '| index | angle | quotation (verifier-confirmed wording, under twelve words) | the unsupported limb (not to be cited) |', '|---|---|---|---|'];
for (const r of partial) {
  const q = cut(r.verdict.trueWording || r.quote, 11);
  const limb = cut(r.verdict.unsupportedLimb || r.verdict.note, 28);
  t.push('| ' + r.index + (r.fullSentence ? ' (fs)' : '') + (route.has(r.index) ? ' (RQ)' : '') + ' | ' + (angles[r.index] || '?') + ' | ' + q + ' | ' + limb + ' |');
}
writeFileSync('sweep/_r12/11-partial-table.md', t.join('\n') + '\n');
console.log('partial table rows:', partial.length, 'quotations over eleven words after the cut:', t.filter(l => l.startsWith('| ')).slice(1).filter(l => l.split('|')[3].trim().replace(' …', '').split(/\s+/).length > 11).length);
const fe = { 932: '51, 60', 933: '60', 934: '51', 935: '54', 936: '51, 60', 937: '51, 60', 938: '51', 939: '51, 60', 944: '55, 56, 61', 945: '55, 61', 946: '51', 947: '51', 948: '51, 60', 949: '51, 60', 950: '55, 60', 951: '57', 952: '51, 61', 953: '61', 954: '61', 955: '55, 61', 956: '55, 61', 957: '61', 958: '51', 959: '54', 960: '51, 54', 961: '54', 962: '51', 972: '52', 973: '54', 974: '54', 975: '54', 976: '54', 977: '54', 978: '52, 57, 60', 979: '52', 980: '54', 981: '54', 982: '56, 61', 983: '56, 61', 984: '61' };
for (const i of [...route].sort((a, b) => a - b)) { const c = st.claims[i], v = st.verdicts[i]; const rte = (i <= 939 || i >= 972) ? 'Roll20' : 'archive.org OCR'; const before = v.fromFile.includes('regrade-r12') ? 'kept, lowered r12' : 'PARTIAL already'; console.log('| ' + i + ' | ' + rte + ' | ' + before + ' | ' + cut(v.trueWording || c.quote, 11) + ' | ' + (fe[i] || '?') + ' |'); }
