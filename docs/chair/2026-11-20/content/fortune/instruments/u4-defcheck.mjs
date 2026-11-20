// U4 (FS7 step 4): run from the tree's root: node <this> <births.json from u4-births.mjs>
import { readFileSync } from 'node:fs';
const a = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const { FORTUNE_LAW_TUNING } = await import(process.cwd() + '/src/domain/fortune/fortuneLaw.js');
const { READINESS_BANDS } = await import(process.cwd() + '/src/data/bandLadders.js');
const { DEFENSE_CONTRIB, legitimacyDefScale } = await import(process.cwd() + '/src/generators/factionDynamics.js');
const ORDER = READINESS_BANDS.map((b) => b.label).reverse();
const S = FORTUNE_LAW_TUNING.standing;
const lit = (label, tier) => { const i = ORDER.indexOf(label); if (i < 0) return 0; const [lo, hi] = S.defenceUsualRange[tier].map((b) => ORDER.indexOf(b)); const off = i > hi ? i - hi : i < lo ? i - lo : 0; return Math.round(Math.max(-S.defenceBound, Math.min(S.defenceBound, S.defencePointsPerBand * off)) * legitimacyDefScale(tier)); };
const dark = (label, tier) => Math.round((DEFENSE_CONTRIB[label] ?? 0) * legitimacyDefScale(tier));
let n = 0, dis = 0;
for (const r of a) { n++; const want = r.law === 2 ? lit(r.defence, r.size) : dark(r.defence, r.size); if (want !== r.breakdown.defense) { dis++; console.log('DISAGREE', r.law, r.size, r.seed, r.name, 'card', r.defence, 'term', r.breakdown.defense, 'card-would-be', want, r.legLabel, r.causesAdverse.join('+')); } }
console.log(`read ${n}; the term disagrees with the card's own label in ${dis}`);
