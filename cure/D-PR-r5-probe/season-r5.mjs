// D-PR-r5 probe: THE SEASON LEDGER `weeksCovered` (RULINGS-ROUND5 B.9; PL §4.7 F.4 r5) against the r4 one-week `lived` read (PR-X2).
// The stage at tick t moves next→lived (forTick t) and counts week t into the member's pair { seasonStartTick, weeks };
// seasonStartTick = t − (t mod 13) (INTERVAL_WEEKS.one_season 13); PL's polity stage reads later in the same tick
// (advanceTreatiesWithDisposition l.2752 after advanceCalamity l.2527, PL's measured order).
const SEASON = 13;
const seasonStart = t => t - (t % SEASON);
function run(coveredWeeks, label) {
  let pair = null; let lived = null; const reads = [];
  for (let t = 0; t < SEASON * 2; t++) {
    const covered = coveredWeeks(t);
    lived = { forTick: t, coveredByOther: covered };            // the week just lived
    const s = seasonStart(t);
    if (!pair || pair.seasonStartTick !== s) pair = covered ? { seasonStartTick: s, weeks: 0 } : null; // new season: a fresh pair (absent while 0)
    if (covered) { if (!pair) pair = { seasonStartTick: s, weeks: 0 }; pair.weeks += 1; }
    if ((t + 1) % SEASON === 0) {                                // the season's LAST tick: PL reads
      const r4 = lived.coveredByOther ? 'protection_kept' : 'protection_failed';
      const weeks = pair && pair.seasonStartTick === s ? pair.weeks : 0;
      reads.push(`season ${s}–${s + SEASON - 1}: r4 lived-read → ${r4} · r5 weeksCovered ${weeks} → ${weeks > 0 ? 'protection_kept' : 'protection_failed'}`);
    }
  }
  return `${label}\n  ${reads.join('\n  ')}`;
}
const out = [];
out.push(run(t => t >= 1 && t <= 10, '(a) the verifier\'s case: the net rides weeks 1–10, then the hold slips'));
out.push(run(t => t === 12, '(b) one week only, the season\'s last'));
out.push(run(() => false, '(c) never covered'));
out.push(run(t => t >= 14 && t <= 15, '(d) covered only in the second season'));
// a stale pair: written in season 0, read in season 2 (a relit world; no stage ran between)
const stale = { seasonStartTick: 0, weeks: 9 }; const t = 30;
out.push(`(e) a stale pair { seasonStartTick 0, weeks 9 } read at tick ${t} (season ${seasonStart(t)}): reads ${stale.seasonStartTick === seasonStart(t) ? stale.weeks : 0}`);
console.log(out.join('\n'));
