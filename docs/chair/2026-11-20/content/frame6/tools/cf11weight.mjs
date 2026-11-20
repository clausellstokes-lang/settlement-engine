// CF11 final (FRAME-2 · B2): over the cached calm pool, the towns with a trouble of weight and without, by tier; each
// strain held, and held with a tension about it, by tier, with the matched tensions' types; the opening trouble by type.
// argv: the cached pool (the FRAME-1 pool script), a tree's src/ path. Prints markdown; exits 1 if the script's own
// reading of the opening ever disagrees with troubleOfWeight's (the script re-reads every tension's strains to list them).
import fs from 'node:fs';
const R = process.argv[3];
const { troubleOfWeight, castTroubleFrame, WEIGHT_GRADES } = await import(R + 'domain/tension/troubleCast.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const c = (m, k) => { m[k] = (m[k] || 0) + 1; };
const rank = (g) => WEIGHT_GRADES.findIndex((row) => row.includes(g));
const T = Object.fromEntries(TIERS.map((t) => [t, { towns: 0, with: 0, without: 0, W1held: 0, W1: 0, W2held: 0, W2: 0, W3held: 0, W3: 0, castNull: 0 }]));
const matched = { W1: {}, W2: {}, W3: {} }, opening = {}, openingGrade = {}, openingByTier = {}, grades = {};
let disagree = 0;
for (const { tier, s } of towns) {
  const X = T[tier]; X.towns++;
  const top = troubleOfWeight(s);
  if ((castTroubleFrame(s) === null) !== (top === null)) disagree++;
  // EACH STRAIN ALONE: the town read with only that strain left standing (the others' causes read away: legitimacy 60 and
  // the incumbent gated by a large govMultiplier; no conflicts row; food Secure and no chain), then troubleOfWeight over
  // the town with ONE tension, so a tension is listed under every strain it is about, not only its sharpest.
  const ps = s.powerStructure || {}, es = s.economicState || {};
  const noSeat = { publicLegitimacy: { ...(ps.publicLegitimacy || {}), score: 60, govMultiplier: 1e6 } };
  const only = {
    W1: { ...s, powerStructure: { ...ps, conflicts: [] }, economicState: { ...es, foodSecurity: { label: 'Secure' }, activeChains: [] } },
    W2: { ...s, powerStructure: { ...ps, ...noSeat }, economicState: { ...es, foodSecurity: { label: 'Secure' }, activeChains: [] } },
    W3: { ...s, powerStructure: { ...ps, ...noSeat, conflicts: [] } },
  };
  const about = (k, t) => troubleOfWeight({ ...only[k], history: { currentTensions: [t] } })?.strain.strain === k;
  const held = {
    W1: about('W1', { type: 'succession_crisis', factions: ['x', 'y', 'z'] }),
    W2: (ps.conflicts || []).some((r) => r?.intensity === 'high' && (r.parties || []).some((p) => about('W2', { type: 'great_fire', factions: [p, 'y', 'z'] }))),
    W3: about('W3', { type: 'trade_dispute', factions: ['x', 'y', 'z'] }),
  };
  const hit = { W1: false, W2: false, W3: false };
  (s.history?.currentTensions || []).forEach((t) => {
    for (const k of ['W1', 'W2', 'W3']) if (held[k] && about(k, t)) { hit[k] = true; c(matched[k], `${tier}|${t.type}`); }
  });
  for (const k of ['W1', 'W2', 'W3']) { if (held[k]) X[`${k}held`]++; if (hit[k]) X[k]++; }
  if (top) {
    X.with++; c(opening, top.tension.type); c(openingGrade, top.strain.grade); c(grades, `${top.strain.grade}|${top.tension.type}`);
    openingByTier[tier] = openingByTier[tier] || {}; c(openingByTier[tier], top.tension.type);
  } else X.without++;
  if (castTroubleFrame(s) === null) X.castNull++;
}
const tot = (k) => TIERS.reduce((a, t) => a + T[t][k], 0);
const row = (label, k) => console.log(`| ${label} | ${TIERS.map((t) => T[t][k]).join(' | ')} | ${tot(k)} |`);
console.log(`| measure | ${TIERS.join(' | ')} | total |\n|---|${TIERS.map(() => '---:').join('|')}|---:|`);
row('calm towns', 'towns'); row('**with a trouble of weight (framed)**', 'with'); row('**without (today\'s sheet)**', 'without');
row('W1 held (seat: ungated, or legitimacy < 45)', 'W1held'); row('W1 with a tension about it', 'W1');
row('W2 held (a conflicts row at intensity high)', 'W2held'); row('W2 with a tension about it', 'W2');
row('W3 held (food < Secure, a creditor power, an impaired chain)', 'W3held'); row('W3 with a tension about it', 'W3');
row('(cast null: must equal "without")', 'castNull');
const fmt = (m) => Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ');
for (const k of ['W1', 'W2', 'W3']) {
  const byType = {};
  for (const [kk, v] of Object.entries(matched[k])) { const [tier, type] = kk.split('|'); byType[type] = byType[type] || {}; byType[type][tier] = v; }
  console.log(`\n**${k}: matched tensions by type and tier** (tensions)\n\n| type | ${TIERS.join(' | ')} | total |\n|---|${TIERS.map(() => '---:').join('|')}|---:|`);
  for (const [type, m] of Object.entries(byType).sort((a, b) => Object.values(b[1]).reduce((x, y) => x + y) - Object.values(a[1]).reduce((x, y) => x + y)))
    console.log(`| ${type} | ${TIERS.map((t) => m[t] || 0).join(' | ')} | ${Object.values(m).reduce((x, y) => x + y)} |`);
}
const framed = tot('with');
console.log(`\n**The opening trouble by type** (of ${framed} framed towns): ${fmt(opening)}`);
for (const [type, n] of Object.entries(opening)) if (n > framed / 3) console.log(`ONE TYPE OPENS MORE THAN A THIRD: ${type} ${n} of ${framed} (${(100 * n / framed).toFixed(1)}%)`);
console.log(`\n**By tier**: ${TIERS.map((t) => `${t}: ${fmt(openingByTier[t] || {}) || 'none'}`).join(' · ')}`);
console.log(`\n**The opening strain's grade**: ${fmt(openingGrade)}`);
console.log(`\n**Grade and type**: ${fmt(grades)}`);
console.log(`\ncast/weight disagreements: ${disagree}`);
process.exitCode = disagree ? 1 : 0;
