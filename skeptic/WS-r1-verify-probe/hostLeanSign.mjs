// V-WS-r1 probe: does the court's TEMPER still set the SIGN of the C1 `deploy` host lean
// under the cured rule (WS §2.3 wayHostLeanOf = bundle sign x W x strength share; §3.3 score:
// +1 per satisfied cell, +1 more for an above/belligerent/dominant match)? Pure arithmetic
// over the volume's own §3.3 cells for way_shock and way_fortress (the two with opposite
// C1 deploy signs, §4.2: shock +, fortress -). Method cells: none for these two ways.
const W = 0.12;
// identical STRENGTHS for both courts: materiel above, institutions above, manpower level, horsed
const strengths = { materiel: 'above', institutions: 'above', manpower: 'level', horses: 'horsed' };
const shockStr = (s) => (s.materiel === 'above' ? 2 : 0) + (['level', 'above'].includes(s.manpower) ? (s.manpower === 'above' ? 2 : 1) : 0) + (s.horses === 'horsed' ? 1 : 0);
const fortStr = (s) => (s.institutions === 'above' ? 2 : 0) + (['below', 'level'].includes(s.manpower) ? 1 : 0);
const courts = {
  belligerent: { shockT: 2 /*lesson belligerent*/ + 2 /*people belligerent*/, fortT: 0 },
  pacific: { shockT: 0, fortT: 1 /*lesson pacific*/ + 2 /*lawfulness above*/ + 1 /*seat religious*/ },
};
for (const [name, t] of Object.entries(courts)) {
  const shock = { t: t.shockT, s: shockStr(strengths) }, fort = { t: t.fortT, s: fortStr(strengths) };
  const top = (shock.t + shock.s) >= (fort.t + fort.s) ? ['way_shock', shock, +1] : ['way_fortress', fort, -1];
  const share = top[1].s / (top[1].t + top[1].s);
  console.log(`${name} temper, SAME strengths ${JSON.stringify(strengths)}: shock ${shock.t}+${shock.s}, fortress ${fort.t}+${fort.s} -> ${top[0]}; share ${share.toFixed(3)}; C1 deploy x${(1 + top[2] * W * share).toFixed(4)}`);
}
