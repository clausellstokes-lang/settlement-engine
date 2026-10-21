// D-FS-r2 probe 2 (WS-r1-6 at FS under RULINGS-P6 D.10): master's courtPostureOf with EVERY SP/WR flag dark.
// A court with a dispositionStats entry built by the landed legacy writer (ratchetDisposition, the outcome fold
// advancePulseDisposition runs under the war layer) reads a LIVE direction; a court with no entry reads 'neutral'.
// Also: no caller passes `books` — FS reads a books-free posture (FS-V-n1).
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const { courtPostureOf } = await import(M + '/src/domain/worldPulse/strategicPosture.js');
const { ratchetDisposition } = await import(M + '/src/domain/worldPulse/dispositionLedger.js');
const rules = {}; // every flag absent: strategicPostureEnabled, dispositionChannelsEnabled dark
const out = [];
const actor = { kind: 'settlement', id: 's1' };
out.push(`no entry: ${JSON.stringify(pick(courtPostureOf(actor, null, { rules })))}`);
let ledger = {};
for (let n = 1; n <= 3; n++) {
  ledger = ratchetDisposition(ledger, 's1', { outcome: 'win' });
  out.push(`after ${n} win(s): ${JSON.stringify(pick(courtPostureOf(actor, ledger.s1, { rules })))}`);
}
let lost = {};
for (let n = 1; n <= 3; n++) {
  lost = ratchetDisposition(lost, 's1', { outcome: 'loss' });
  out.push(`after ${n} loss(es): ${JSON.stringify(pick(courtPostureOf(actor, lost.s1, { rules })))}`);
}
const withBooks = courtPostureOf(actor, ledger.s1, { rules, books: { stock01: 0 } });
out.push(`same 3-win court WITH an empty-treasury books term (no master caller passes it): ${JSON.stringify(pick(withBooks))}`);
console.log(out.join('\n'));
function pick(p) { return { direction: p.direction, band: p.band, factor: p.factor, terms: p.terms, absent: p.absent }; }
