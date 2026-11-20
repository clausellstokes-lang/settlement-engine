// FORTUNE-1 instrument: the text patches `tree.mjs` applies to a COPY. `trace` records each term of the
// fortune sum (no output moves); `fortune` adds the prototype fortune rule (FS1, and the calm floor of FS4);
// `proto` adds the standing rule too (FS2). In the copy the rule is unconditional: the copy stands for a world
// born under the new law (the fixture arm that forces the version).
// Environment knobs, for the variants the proposal reports (each defaults to the proposal's value):
//   FORTUNE_FLAT=1     FS1's flat development figure (0 = the variant without it: the world deflates)
//   FORTUNE_FLOOR=1    FS4's calm floor (0 = without it)
//   FORTUNE_DEF=range  FS2's defence term: `range` (the size's usual range of bands) or `point` (one usual band)
//   FORTUNE_PROSPEROUS=15, FORTUNE_WEALTHY=20  the standing term's Prosperous and Wealthy points (the chair's second column, 5.1)
//   FORTUNE_DEPTH=ratio FS1's depth term: `ratio` (the code's own x0.75/x1.3 against each size's measured median) or `quantile` (the size's p20/p80)
const P = 'src/generators/economy/prosperity.js';
const F = 'src/generators/factionDynamics.js';
const FLAT = Number(process.env.FORTUNE_FLAT ?? 1);
const FLOOR = (process.env.FORTUNE_FLOOR ?? '1') !== '0';
const DEF = process.env.FORTUNE_DEF ?? 'range';
const DEPTH = process.env.FORTUNE_DEPTH ?? 'ratio';
const PROSPEROUS = Number(process.env.FORTUNE_PROSPEROUS ?? 15);
const WEALTHY = Number(process.env.FORTUNE_WEALTHY ?? 20);
const REQUIRED_ECONOMY = String.raw`/subsistence farming|access to external mill|farmland|town granary|weekly market|city granari|market square|district markets|state granary|inns and taverns \(district\)/i`;

export const PATCHES = [
  // ── trace: every term, the raw sum, the index after the food and floor rules ──
  {
    id: 'trace-terms', modes: ['trace', 'fortune', 'proto'], file: P,
    find: '  let Z = _PLABELS[_baseIdx];\n',
    replace: `  globalThis.__FT?.push({ standing: !!globalThis.__FTS, tier, route: tradeRoute, routeBase: _routeBase, tierBonus: _tierBonus, eco: _ecoBonus, magic: _magicBonus, threat: _threatPenalty, mil: _milDrain, defPrem: _defPremium, depth: _depthBonus, econInst: _econInstCount, diversity: _diversityBonus, incomeCount: _incomeCount, food: _foodMod ? _foodMod.type + ':' + _foodMod.value : null, foodLabel: _foodSec?.label ?? null, raw: _routeBase + _tierBonus + _ecoBonus + _magicBonus + _threatPenalty + _milDrain + _defPremium + _depthBonus + _diversityBonus, baseIdx: _baseIdx });
  let Z = _PLABELS[_baseIdx];
`,
  },
  {
    id: 'trace-standing', modes: ['trace', 'fortune', 'proto'], file: P,
    find: '  return computeBaseProsperity(tier, tradeRoute, institutions, standing, instNames, incomeNormalized, food).label;\n',
    replace: '  globalThis.__FTS = true; try { return computeBaseProsperity(tier, tradeRoute, institutions, standing, instNames, incomeNormalized, food).label; } finally { globalThis.__FTS = false; }\n',
  },
  // ── FS1 (fortune): what only measures size no longer moves the label ──
  {
    id: 'fs1-tier-bonus', modes: ['fortune', 'proto'], file: P,
    find: '  const _tierBonus = { thorp: 0, hamlet: 0, village: 0, town: 1, city: 1, metropolis: 2 }[tier] || 0;\n',
    replace: `  const _tierBonus = ${FLAT}; // FS1: one development figure at every size (DRAFT: the old size-only terms' pooled mean, 0.99 on seeds hxe); the size is said by the tier and the population\n`,
  },
  {
    id: 'fs1-magic-scale', modes: ['fortune', 'proto'], file: P,
    find: '  const _magicTierScale = { thorp: 0, hamlet: 0, village: 0.3, town: 0.6, city: 1.0, metropolis: 1.4 }[tier] || 0;\n',
    replace: "  const _magicTierScale = 0.6; // FS1: one scale at every size (the town's, the middle of the old ladder)\n",
  },
  {
    id: 'fs1-depth', modes: ['fortune', 'proto'], file: P,
    find: '  const _tierExpectedEco = { thorp: 3, hamlet: 8, village: 13, town: 22, city: 13, metropolis: 14 }[tier] || 8;\n  // Bonus: +1 if well above expectation, -1 if well below. Bounded ±1 to avoid dominating.\n  const _depthBonus = _econInstCount >= _tierExpectedEco * 1.3 ? 1 : _econInstCount >= _tierExpectedEco * 0.75 ? 0 : -1;\n',
    replace: DEPTH === 'quantile'
      ? "  // FS1 (variant quantile): the depth of its trades against its OWN size: below the size's p20 is thin (-1), above its p80 deep (+1); DRAFT, derived on 600 towns (seeds hxe-<size>-<0..99>)\n  const _depthBand = { thorp: [2, 4], hamlet: [4, 7], village: [5, 11], town: [16, 24], city: [28, 50], metropolis: [50, 55] }[tier] || [5, 11];\n  const _depthBonus = _econInstCount > _depthBand[1] ? 1 : _econInstCount < _depthBand[0] ? -1 : 0;\n"
      : "  // FS1: the code's own depth rule against each size's MEASURED expectation (DRAFT: the median count on 600 towns, seeds hxe-<size>-<0..99>; the old table expected 13 at a city that holds 42)\n  const _tierExpectedEco = { thorp: 3, hamlet: 5, village: 8, town: 20, city: 42, metropolis: 53 }[tier] || 8;\n  const _depthBonus = _econInstCount >= _tierExpectedEco * 1.3 ? 1 : _econInstCount >= _tierExpectedEco * 0.75 ? 0 : -1;\n",
  },
  {
    id: 'fs1-diversity', modes: ['fortune', 'proto'], file: P,
    find: '  const _diversityBonus = _incomeCount >= 7 ? 0.5 : _incomeCount >= 5 ? 0.25 : 0;\n',
    replace: '  const _diversityBonus = 0; // FS1: a count that grows with size; the depth term already reads the trades against the size\n',
  },
  // ── FS4 (fortune): a calm place with its required economy is never below Poor, after the label's steps too (an isolated thorp or hamlet excepted) ──
  ...(FLOOR ? [{
    id: 'fs4-calm-floor', modes: ['fortune', 'proto'], file: P,
    find: "  if (active.includes('slave_revolt')) idx = Math.max(0, idx - 1);\n  return LABELS[Math.min(5, Math.max(0, idx))];\n",
    replace: `  if (active.includes('slave_revolt')) idx = Math.max(0, idx - 1);
  // FS4: the base's own floor ("Struggling is reserved for active stress") holds after the steps above: born under no crisis, with its required economy, a place reads at least Poor (an isolated thorp or hamlet excepted: its route makes it Subsistence)
  if (!active.length && !isIsolatedSmall && institutions.some((institution) => institutionMatchesRegex(institution, ${REQUIRED_ECONOMY}))) idx = Math.max(1, idx);
  return LABELS[Math.min(5, Math.max(0, idx))];
`,
  }] : []),
  // ── FS2 (standing): defence judged against what is usual for the size ──
  {
    id: 'fs2-defence', modes: ['proto'], file: F,
    find: '  const dContrib = Math.round((DEFENSE_CONTRIB[defenseLabel] ?? 0) * defScale);\n',
    replace: DEF === 'point'
      ? `  // FS2 (variant point): four points a band above or below the size's usual band, within +-10, weighted by the size's scale
  const _DEF_ORDER = ['Undefended', 'Vulnerable', 'Lightly Defended', 'Defensible', 'Well-Defended', 'Fortress'];
  const _defUsual = { thorp: 1, hamlet: 1, village: 1, town: 2.5, city: 4.5, metropolis: 5 }[tier] ?? 2.5;
  const _defIdx = _DEF_ORDER.indexOf(defenseLabel);
  const dContrib = _defIdx < 0 ? 0 : Math.round(Math.max(-10, Math.min(10, 4 * (_defIdx - _defUsual))) * defScale);
`
      : `  // FS2: four points a band above or below the size's USUAL RANGE of bands (DRAFT: p10..p90 of the band on 600 towns, seeds hxe, the fortune rule in force), within +-10, weighted by the size's scale as before
  const _DEF_ORDER = ['Undefended', 'Vulnerable', 'Lightly Defended', 'Defensible', 'Well-Defended', 'Fortress'];
  const _defUsual = { thorp: [1, 1], hamlet: [0, 1], village: [0, 1], town: [2, 3], city: [4, 5], metropolis: [4, 5] }[tier] ?? [2, 3];
  const _defIdx = _DEF_ORDER.indexOf(defenseLabel);
  const _defOff = _defIdx < 0 ? 0 : _defIdx > _defUsual[1] ? _defIdx - _defUsual[1] : _defIdx < _defUsual[0] ? _defIdx - _defUsual[0] : 0;
  const dContrib = Math.round(Math.max(-10, Math.min(10, 4 * _defOff)) * defScale);
`,
  },
  // ── 5.1's second column (measure only): the standing term's Prosperous and Wealthy points ──
  ...(PROSPEROUS !== 15 || WEALTHY !== 20 ? [{
    id: 'second-column', modes: ['proto'], file: F,
    find: "  'Prosperous': +15,\n  'Wealthy':    +20,\n",
    replace: `  'Prosperous': ${PROSPEROUS},\n  'Wealthy':    ${WEALTHY},\n`,
  }] : []),
];
