let m = null, a = null;
export async function measure(t, { tree }) {
  m ||= await import(`${tree}/src/domain/facts/beastsReadiness.js`);
  a ||= await import(`${tree}/src/domain/display/defenseScoreBands.js`);
  const r = m.beastsReadinessOf(t); const sc = t.defenseProfile?.scores;
  return { lift: r.shownScore !== r.score, stored: a.avgScore(sc), shown: a.avgScore(m.scoresAsShown(t, sc)) };
}
