// BD-r5 probe 4: BD §2.3's knowledge FRESHNESS on HB's landed curve — one learning event (a catch, a purchase),
// credited UP from neutral by habitCurve.applyCredit, against BD's DRAFT lapse band "within one tenth of neutral".
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const H = await import(M + '/domain/worldPulse/habit/habitCurve.js');
const T = H.HABIT_TUNING;
const laws = Object.keys(T.LEARN_RATE); const rungs = (await import(M + '/domain/worldPulse/habit/habitVocabulary.js'));
const sev = rungs.OUTCOME_RUNGS || rungs.SEVERITY_RUNGS || null;
const rungList = ['glancing', 'telling', 'grave', 'ruinous'];
console.log('NEUTRAL_I', T.NEUTRAL_I, 'CAP_I', T.CAP_I, '| lapse band read A: |stock-neutral| <= 0.1 x NEUTRAL_I =', 0.1 * T.NEUTRAL_I, '| read B: <= 0.1 x (CAP_I-NEUTRAL_I) =', 0.1 * (T.CAP_I - T.NEUTRAL_I));
for (const law of laws) {
  const line = [];
  for (const r of rungList) {
    let s; try { s = H.applyCredit({ stock: T.NEUTRAL_I, lawWord: law, outcomeRung: r, direction: +1 }); } catch (e) { s = 'ERR ' + e.message; }
    line.push(`${r}: +${typeof s === 'number' ? s - T.NEUTRAL_I : s}`);
  }
  console.log(String(law).padEnd(14), 'one credit from neutral ->', line.join(' · '));
}
