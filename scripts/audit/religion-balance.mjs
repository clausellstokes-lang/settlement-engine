/**
 * religion-balance.mjs — balance probe for the legitimacy / patron-contest /
 * growth-favor / compromise mechanics. Sweeps the parameter space with the SEEDED
 * roll across many trials and reports the emergent distributions, so the tuning
 * (RELIGION_TUNING.CONTEST_*, RELIGION_LEGITIMACY_TUNING.*) can be judged, not guessed.
 *
 *   node scripts/audit/religion-balance.mjs [--seeds 300] [--ticks 80]
 */
import { resolvePatronContest, advanceShares, RELIGION_TUNING } from '../../src/domain/worldPulse/religionState.js';
import { deityGrowthFavor, RELIGION_LEGITIMACY_TUNING } from '../../src/domain/worldPulse/religionLegitimacy.js';
import { createPRNG } from '../../src/generators/prng.js';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? Number(process.argv[i + 1]) : d; };
const SEEDS = arg('seeds', 300);
const TICKS = arg('ticks', 80);
const pct = (x) => `${(x * 100).toFixed(0)}%`.padStart(4);

const dEntry = (name, niche, share, legitimacy, standing = 'cult') => {
  const [temperamentAxis, alignmentAxis] = niche.split(':');
  return { deityRef: `d.${name}`, snapshot: { _deityRef: `d.${name}`, name, alignmentAxis, temperamentAxis },
    niche, share, standing, legitimacy, tenure: standing === 'ascendant' ? 20 : 0, heresyStain: 0, suppressed: false };
};
// Patron P + challenger C sharing the warlike:evil niche (a schism).
const schism = (pL, cL, cShare) => ({
  deities: { 'd.P': dEntry('P', 'warlike:evil', 100 - cShare, pL, 'ascendant'), 'd.C': dEntry('C', 'warlike:evil', cShare, cL, 'cult') },
  patronRef: 'd.P', patronChallengeTicks: 0, contestedTicks: 0, capacity: 3,
});
const activeInNiche = (st) => Object.values(st.deities).filter((d) => d.niche === 'warlike:evil' && !d.suppressed);

// ── 1. CONTEST hold-rate surface (fixed shares; isolates the roll) ────────────
// How often the standing patron holds, by patron vs challenger legitimacy.
function holdRate(pL, cL, cShare) {
  let hold = 0;
  for (let s = 0; s < SEEDS; s++) {
    const st = schism(pL, cL, cShare);
    for (let t = 0; t < TICKS; t++) resolvePatronContest(st, createPRNG(`hold:${pL}:${cL}:${s}:${t}`));
    if (st.patronRef === 'd.P') hold++;
  }
  return hold / SEEDS;
}

// ── 2. SCHISM soak (shares DRIFT via advanceShares; the realistic case) ───────
// An imposed cult seeds at 4%, grows at `cultGrowth`, patron at 0.5, both legit fixed.
function schismSoak(pL, cL, cultGrowth) {
  let held = 0, toppled = 0, unresolved = 0, sumBad = 0;
  for (let s = 0; s < SEEDS; s++) {
    const st = schism(pL, cL, 4); st.deities['d.C'].legitimacy = cL; st.deities['d.P'].legitimacy = pL;
    for (let t = 0; t < TICKS; t++) {
      advanceShares(st, { 'd.P': 0.5, 'd.C': cultGrowth });
      st.deities['d.P'].legitimacy = pL; st.deities['d.C'].legitimacy = cL;   // hold legit fixed for the probe
      resolvePatronContest(st, createPRNG(`soak:${pL}:${cL}:${s}:${t}`));
      const sum = Object.values(st.deities).filter((d) => !d.suppressed).reduce((a, d) => a + d.share, 0);
      if (sum !== 100 && activeInNiche(st).length) sumBad++;
    }
    const n = activeInNiche(st).length;
    if (n > 1) unresolved++; else if (st.patronRef === 'd.P') held++; else toppled++;
  }
  return { held: held / SEEDS, toppled: toppled / SEEDS, unresolved: unresolved / SEEDS, shareViolations: sumBad };
}

// ── 3. EVIL × COMPROMISE amplifier (is it significant AND variable?) ──────────
const growthFor = (align, comp) => deityGrowthFavor({ alignmentAxis: align, temperamentAxis: 'warlike' },
  { temper: 0.7, align: 0.4, power: 0.6, corrupt: comp, compromise: comp });

console.log(`\n# Religion balance probe  (seeds=${SEEDS}, ticks=${TICKS})`);
console.log(`tuning: CONTEST_LEGIT_W=${RELIGION_TUNING.CONTEST_LEGIT_W} SHARE_W=${RELIGION_TUNING.CONTEST_SHARE_W} PATRON_AMP=${RELIGION_TUNING.CONTEST_PATRON_AMP} FLIP_TICKS=${RELIGION_TUNING.PATRON_FLIP_TICKS} | COMPROMISE_EVIL_AMP=${RELIGION_LEGITIMACY_TUNING.COMPROMISE_EVIL_AMP}`);

const LEG = [0.1, 0.3, 0.5, 0.7, 0.9];
console.log('\n## 1. Patron HOLD-rate by legitimacy (challenger share 30%) — want a gradient, not all-or-nothing');
console.log('  patron↓ / challenger→   ' + LEG.map((c) => pct(c)).join('  '));
for (const pL of LEG) console.log(`  pL=${pL}                 ` + LEG.map((cL) => pct(holdRate(pL, cL, 30))).join('  '));

console.log('\n## 2. Schism SOAK with share drift (held / toppled / unresolved) — unresolved should be ~0');
for (const [pL, cL, g, label] of [[0.85, 0.1, 0.4, 'strong patron vs weak cult'], [0.5, 0.5, 0.7, 'even, popular cult'], [0.12, 0.8, 0.85, 'weak patron vs legit+popular rival']]) {
  const r = schismSoak(pL, cL, g);
  console.log(`  ${label.padEnd(36)} held ${pct(r.held)}  toppled ${pct(r.toppled)}  unresolved ${pct(r.unresolved)}  shareViol=${r.shareViolations}`);
}

console.log('\n## 3. Evil vs good GROWTH-favor by compromise — evil should rise, stay < runaway, good flat-ish');
console.log('  compromise   evil   good   gap');
for (const comp of [0, 0.3, 0.6, 0.9]) {
  const e = growthFor('evil', comp), g = growthFor('good', comp);
  console.log(`  ${comp.toFixed(1)}          ${e.toFixed(2)}   ${g.toFixed(2)}   +${(e - g).toFixed(2)}`);
}
console.log('');
