// D-PR-r4 probe: PR-W3 (drawShare01 at offensive 0). Imports master's feasibilityGate read-only.
const M = process.argv[2];
const { classifyFeasibility, verdictPermitsSiege } = await import(M + '/src/domain/worldPulse/feasibilityGate.js');
const CONQUEST_MARGIN = 0.12; // warDeployment.js :: CONQUEST_MARGIN (read)
const out = [];
// (1) the hard gate at attackerCurrent 0 against a collapsing and a sound defender
for (const legit of [10, 80]) {
  const item = { settlement: { activeConditions: [], powerStructure: { publicLegitimacy: { score: legit } } } };
  for (const def of [0, 5, 40]) {
    const r = classifyFeasibility({ attackerCurrent: 0, defenderCurrent: def, coalitionSize: 1, defenderItem: item, attackerFacets: {}, defenderFacets: {} });
    out.push(`(1) attacker 0 · defender ${def} · legitimacy ${legit} → ${r.verdict} · permits siege ${verdictPermitsSiege(r.verdict)}`);
  }
}
// (2) the prefilter predicate (skip iff fromStrength*share*casus*mediation <= target + margin) under three guards, offensive 0, kept riders
const fromStrength = 0.6, target = 0.3; // strength-index scale (illustrative; the index is not offensive)
const shares = { 'raw 0/0 (NaN)': 0 / 0, 'guard 0': 0, 'guard 1 (identity)': 1 };
for (const [k, s] of Object.entries(shares)) out.push(`(2) offensive 0, riders kept, ${k}: prefilter skips = ${fromStrength * s <= target + CONQUEST_MARGIN}`);
// (3) the r4 construction: share over points ACTUALLY drawn
function drawn(off, pts) { const take = Math.min(off, pts); const cap = take > 0 ? off - take : off; const share = take > 0 ? (off > 0 ? cap / off : 0) : 1; return { take, cap, share }; }
for (const [off, pts] of [[0, 6], [5, 12], [40, 6], [40, 0]]) { const d = drawn(off, pts); out.push(`(3) offensive ${off} · draw ${pts} → drawn ${d.take} · drawnCap.offensive ${d.cap} · drawShare01 ${d.share} · stamp ${d.take > 0 ? `{riders, points: ${d.take}}` : 'absent'}`); }
console.log(out.join('\n'));
