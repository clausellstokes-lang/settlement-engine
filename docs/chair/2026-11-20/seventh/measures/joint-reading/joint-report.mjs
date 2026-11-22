// Tables from the four arms written by joint-measure.mjs. node joint-report.mjs > tables.txt
import { readFileSync } from 'node:fs';
const DIR = new URL('.', import.meta.url).pathname;
const ARMS = ['off', 'fortune', 'seat', 'both'];
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const load = (a) => readFileSync(`${DIR}arm-${a}.jsonl`, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const D = Object.fromEntries(ARMS.map((a) => [a, load(a)]));
const out = [];
const p = (n, d) => (d ? `${Math.round((1000 * n) / d) / 10}` : '-');
const RULER = new Set(['succession_crisis', 'corruption_scandal', 'tyranny', 'popular_uprising', 'legitimacy_crisis', 'leadership_vacuum']);
const contested = (r) => r.risk === 'Contested' || String(r.risk).startsWith('Critical');

// errors
out.push('== ERRORS (thrown at birth or in a reader), by arm');
for (const a of ARMS) {
  const errs = D[a].filter((r) => r.error || r.contestErr || r.holderErr || r.transferErr || r.govKindErr);
  out.push(`${a}: ${errs.length}${errs.length ? ` e.g. ${errs[0].seed}: ${errs[0].error || errs[0].contestErr || errs[0].holderErr || errs[0].transferErr || errs[0].govKindErr}` : ''}`);
}
// switches took
out.push('', '== SWITCH CHECK (stored config markers, and places whose reading moved vs off)');
const bySeed = (a) => new Map(D[a].map((r) => [r.seed, r]));
const off = bySeed('off');
for (const a of ARMS) {
  const cf = {}; for (const r of D[a]) { const k = `fortune=${r.cfg.fortune} seat=${r.cfg.seat}`; cf[k] = (cf[k] || 0) + 1; }
  let band = 0, risk = 0, calm = 0, tens = 0;
  for (const r of D[a]) { const o = off.get(r.seed); if (o.band !== r.band || o.score !== r.score) band++; if (o.risk !== r.risk) risk++; if (o.calm !== r.calm) calm++; if (o.tensions.join() !== r.tensions.join()) tens++; }
  out.push(`${a}: config ${JSON.stringify(cf)}; vs off: standing moved ${band}, coup-risk label moved ${risk}, calm/crisis moved ${calm}, tension kinds moved ${tens}`);
}
const BANDS = [...new Set(ARMS.flatMap((a) => D[a].map((r) => r.band)))];
out.push('', `== (b) BY SIZE AND ARM, calm and crisis-born apart. Bands seen: ${BANDS.join(' | ')}`,
  'cols: n | ' + BANDS.map((b) => `${b}%`).join(' ') + ' | protected% | contested% (risk Contested or Critical) | any challenger% | transfer at birth%');
for (const size of SIZES) for (const state of ['calm', 'crisis']) {
  out.push(`-- ${size} ${state}`);
  for (const a of ARMS) {
    const rs = D[a].filter((r) => r.size === size && (state === 'calm') === r.calm);
    const n = rs.length;
    const bands = BANDS.map((b) => p(rs.filter((r) => r.band === b).length, n)).join(' ');
    out.push(`  ${a.padEnd(8)} n=${String(n).padStart(3)} | ${bands} | prot ${p(rs.filter((r) => r.protected).length, n)} | contested ${p(rs.filter(contested).length, n)} | chall ${p(rs.filter((r) => r.nChallengers > 0).length, n)} | transfer ${p(rs.filter((r) => r.transfer).length, n)}`);
  }
}
out.push('', '== (c) THE CROSS: CALM places, rulers standing Tolerated. contested = risk Contested/Critical; unprotected = !incumbent.gated; unseated = a transfer written at birth',
  'size        | BOTH: tolerated contested unprotected unseated | SEAT ONLY: tolerated contested unprotected unseated');
for (const size of SIZES) {
  const row = (a) => { const rs = D[a].filter((r) => r.size === size && r.calm && r.band === 'Tolerated'); return [rs.length, rs.filter(contested).length, rs.filter((r) => !r.protected).length, rs.filter((r) => r.transfer).length]; };
  const b = row('both'); const s = row('seat');
  out.push(`${size.padEnd(11)} | ${b.join(' / ')} | ${s.join(' / ')}`);
}
out.push('', '== (d) BOTH ON, CALM, (contested or unprotected) AND no ruler-kind trouble AND capture not corrupted/capture');
const d = D.both.filter((r) => r.calm && (contested(r) || !r.protected) && !r.tensions.some((t) => RULER.has(t)) && !/corrupt|capture/i.test(String(r.capture)));
const captures = [...new Set(D.both.map((r) => r.capture))];
out.push(`capture rungs seen in BOTH: ${captures.join(', ')}`);
for (const size of SIZES) {
  const all = D.both.filter((r) => r.size === size && r.calm && (contested(r) || !r.protected)).length;
  const sOnly = D.seat.filter((r) => r.calm && r.size === size && (contested(r) || !r.protected) && !r.tensions.some((t) => RULER.has(t)) && !/corrupt|capture/i.test(String(r.capture))).length;
  const offN = D.off.filter((r) => r.calm && r.size === size && (contested(r) || !r.protected) && !r.tensions.some((t) => RULER.has(t)) && !/corrupt|capture/i.test(String(r.capture))).length;
  out.push(`${size.padEnd(11)} both: ${d.filter((r) => r.size === size).length} of ${D.both.filter((r) => r.size === size && r.calm).length} calm (contested-or-unprotected in all: ${all}); same count seat only: ${sOnly}; both off: ${offN}`);
}
out.push(`total both: ${d.length}`);
out.push('', 'ten such places (both on):');
const pick = []; for (const size of [...SIZES].reverse()) pick.push(...d.filter((r) => r.size === size).slice(0, 2));
for (const r of d) if (pick.length < 10 && !pick.includes(r)) pick.push(r);
for (const r of pick.slice(0, 10)) {
  out.push(`- ${r.seed}: ${r.govName} (${r.govKind}); standing ${r.band} ${r.score} (mult ${r.govMult}); risk ${r.risk}; protected ${r.protected}; inc weight ${r.incWeight}; challengers ${r.challengers.join(' ; ') || '(none)'}; holder ${r.holderRule} ${r.holder ?? '-'}; capture ${r.capture}; transfer ${r.transfer}; stability "${r.stability}"; troubles ${r.tensions.join(', ') || '(none)'}; recentConflict "${String(r.recentConflict).slice(0, 160)}"`);
}
console.log(out.join('\n'));
