// FORTUNE U5 instrument: the text patches `u5-tree.mjs` applies to a COPY that already holds the ruled rule (`tree.mjs`
// mode `proto`). In the copy the rule is unconditional: the copy stands for a world born under the fortune law.
// Every figure is a DRAFT row of the leaf's one table (`FORTUNE_LAW_TUNING`, `src/domain/fortune/fortuneLaw.js`).
//
// PART 1, SAFETY against the size's usual (in `computePublicLegitimacy`): a calm-ladder safety label (Dangerous, Unsafe,
//   Moderate, Safe, Very Safe) inside its size's usual range is worth 0; outside it, the label's own points LESS those of
//   the nearest usual band (`offset`, the default), or four points a band within +-10 (`points`, defence's form). A
//   crisis strain label ("Tense — Plague" ...) and the two governance labels keep today's points.
// PART 2, THE MERITS (a step at the END of birth, after the ruler's card and the history exist): each a pure read of
//   the born record, counted only upward, only where the standing before them is at least Tolerated, and only where
//   no trouble of today concerns the ruler (PART 3, a condition). Endorsed never stands on fewer than two reasons.
//
// Environment knobs (each defaults to the proposal's value):
//   U5_SAFETY=offset|points|off   PART 1's form
//   U5_POINTS=10                  the points of one merit
//   U5_WINDOW=40                  the weathered catastrophe's window in years (a generation; 60 measured as the alternative)
//   U5_MERITS=principled,weathered  the merits counted (also: kindly, founding — the measured alternatives)
//   U5_GATE=45                    the standing a place must hold before its merits count (Tolerated's cut)
const F = 'src/generators/factionDynamics.js';
const PIPE = 'src/generators/generateSettlementPipeline.js';
const SAFETY = process.env.U5_SAFETY ?? 'offset';
const POINTS = Number(process.env.U5_POINTS ?? 10);
const WINDOW = Number(process.env.U5_WINDOW ?? 40);
const MERITS = (process.env.U5_MERITS ?? 'principled,weathered').split(',').filter(Boolean);
const GATE = Number(process.env.U5_GATE ?? 45);
// DRAFT: each size's usual range of the calm safety ladder, p10 to p90 on the derivation set (seeds hxe-<size>-<0..99>,
// untouched settings, the ruled rule in force, towns whose label is on the ladder): `u5-report.mjs` prints it.
export const SAFETY_USUAL = { thorp: [2, 2], hamlet: [2, 2], village: [2, 2], town: [2, 2], city: [1, 2], metropolis: [2, 2] };
// the kinds of today's trouble that concern the ruler (history.currentTensions[].type), besides any that names the seat
export const RULER_TROUBLE = ['succession_crisis', 'corruption_scandal', 'tyranny', 'popular_uprising', 'legitimacy_crisis', 'leadership_vacuum'];

const safetyPatch = SAFETY === 'off' ? [] : [{
  id: 'u5-safety', file: F,
  find: '  const sContrib = safetyContrib(safetyLabel);\n',
  replace: `  // U5 PART 1: safety judged against the size's usual (DRAFT: p10..p90 of the calm ladder on seeds hxe), form ${SAFETY}
  const _SAFE_LADDER = ['Dangerous', 'Unsafe', 'Moderate', 'Safe', 'Very Safe'];
  const _safeUsual = ${JSON.stringify(SAFETY_USUAL)}[tier] ?? [2, 2];
  const _safeIdx = _SAFE_LADDER.indexOf(safetyLabel);
  const _safeEdge = _safeIdx < 0 ? -1 : Math.max(_safeUsual[0], Math.min(_safeUsual[1], _safeIdx));
  const sContrib = _safeIdx < 0 ? safetyContrib(safetyLabel)
    : ${SAFETY === 'points'
    ? 'Math.max(-10, Math.min(10, 4 * (_safeIdx - _safeEdge)))'
    : 'safetyContrib(safetyLabel) - safetyContrib(_SAFE_LADDER[_safeEdge])'};
`,
}];

const meritStep = `
// ── U5 PART 2 (prototype): the merits of rule, read from the born record at the end of birth ──
function __u5Merits(settlement) {
  const ps = settlement?.powerStructure; const pl = ps?.publicLegitimacy;
  if (!pl || typeof pl !== 'object' || typeof pl.score !== 'number') return;
  const seat = ps.governingName;
  const h = settlement.history || {}; const tensions = Array.isArray(h.currentTensions) ? h.currentTensions : [];
  // PART 3, A CONDITION: no trouble of today concerns the ruler (a tension of the ruler's kinds or one that names the seat), and no capture
  const trouble = tensions.some((t) => ${JSON.stringify(RULER_TROUBLE)}.includes(t?.type) || (t?.factions || []).includes(seat))
    || ['corrupted', 'capture'].includes(ps.criminalCaptureState);
  if (trouble || pl.score < ${GATE}) return;
  const ruler = (settlement.npcs || []).find((n) => (n?.memberships || []).some((m) => m?.power === seat && m?.rank === 1));
  const fam = (w) => (w ? __U5_FAMILY[w] ?? null : null);
  const vice = ['price', 'slippery', 'hard'].includes(fam(ruler?.personality?.flaw));
  const names = [];
  if (${JSON.stringify(MERITS)}.includes('principled') && ruler && fam(ruler.personality?.dominant) === 'straight' && !vice) names.push('principled');
  if (${JSON.stringify(MERITS)}.includes('kindly') && ruler && fam(ruler.personality?.dominant) === 'warm' && !vice) names.push('kindly');
  if (${JSON.stringify(MERITS)}.includes('weathered')) {
    const notes = Array.isArray(h.legacyAnnotations) ? h.legacyAnnotations : [];
    const w = (h.historicalEvents || []).find((e) => e?.severity === 'catastrophic' && (e.yearsAgo ?? Infinity) <= ${WINDOW}
      && !tensions.some((t) => t?.type === e.templateType)
      && !notes.some((n) => n?.eventName === e.name && /never been put right/.test(String(n?.annotation ?? ''))));
    if (w) names.push('weathered');
  }
  if (${JSON.stringify(MERITS)}.includes('founding') && h.founding?.overcoming === 'through sustained effort and reliable governance') names.push('founding');
  if (!names.length) return;
  let score = Math.max(0, Math.min(100, pl.score + ${POINTS} * names.length));
  // never Endorsed on fewer than two reasons (a reason: a merit, or a positive term of the sum)
  const reasons = names.length + Object.values(pl.breakdown || {}).filter((v) => typeof v === 'number' && v > 0).length;
  if (score >= 75 && reasons < 2) score = Math.max(pl.score, 74);
  const band = __u5Band(score);
  ps.publicLegitimacy = {
    score, label: band.label, color: band.color, bg: band.bg,
    breakdown: { ...pl.breakdown, merits: score - pl.score },
    govMultiplier: band.govMultiplier, crimMultiplier: band.crimMultiplier,
    isEndorsed: band.isEndorsed, isApproved: band.isApproved, isTolerated: band.isTolerated, isContested: band.isContested,
    isLegitimacyCrisis: band.isLegitimacyCrisis, governanceFractured: band.governanceFractured,
    merits: names, reasons,
  };
}
`;

export const U5_PATCHES = [
  ...safetyPatch,
  {
    id: 'u5-merits-import', file: PIPE,
    find: "import { runPipeline } from './pipeline.js';\n",
    replace: `import { runPipeline } from './pipeline.js';\nimport { legitimacyBandFor as __u5Band } from './factionDynamics.js';\nimport { DEALING_TRAIT_FAMILY as __U5_FAMILY } from '../data/npcData.js';\n${meritStep}`,
  },
  {
    id: 'u5-merits-step', file: PIPE,
    find: '  if (typeof options.onComplete === \'function\') {\n',
    replace: '  __u5Merits(finalCtx.settlement); // U5 PART 2 (prototype)\n  if (typeof options.onComplete === \'function\') {\n',
  },
];
