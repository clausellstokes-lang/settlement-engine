// @ts-check
/**
 * rosterChoiceRegistry.js — THE ROSTER-CHOICE REGISTRY (the chair's ruling VR7, 2026-11-19 06:53 UTC, vetoable by
 * the owner; the staged build of docs/chair/2026-11-19/veil/briefs/SUB-BRIEF-VR7.md, stage R1).
 *
 * THE LAW IT SERVES: a house the DM hid whole, and anything that gives it away, never reaches a non-owner read (the
 * gallery read, the party link, the import send, the public page, the map; both stored shapes; Reveal DM off and
 * on). WHERE THE VEIL CANNOT BE SURE, IT WITHHOLDS.
 *
 * WHAT IT IS: the ONE list that says, path by path, what the veil does about every payload path the reader's
 * counterfactual differ finds differing by a hidden house (REVIEW-VEIL-9's differ.probe.jsx, read THROUGH THE SERVER
 * by ruling VR15: both stored shapes, every veil, the gallery read and the party link). Each row is in the binding
 * form of SUB-BRIEF-VR7 design point 3:
 *   id      the row's name (cited by a server rule as `-- registry: <id>`, by a twin rule as `// registry: <id>`)
 *   path    a regex over the differ's normalised path (anchored; the gate's `new RegExp(path)` reads it)
 *   writer  `path :: symbol` of the chooser (the code that wrote the value from the roster)
 *   house   the house predicate whose answer chose it
 *   rule    'withhold' | 'recompose' | 'diffuse' (VR8, VR14 (iv)) | 'rng' (VR13)
 *   when    'always' (every non-owner read, whatever the veil: VR16) | 'house-hidden' (where a house is hidden whole)
 *   vr14    the class of a derived number (VR14 (i) to (iv)); null for a text, a label or an entry
 *   drawn   whether a non-owner page draws it (VR7-MEASURE M3's answer; 'unsettled' where M3 did not reach it: R2's
 *           render-twice test proves "undrawn", VR16 condition (1))
 *   inputs  the row ids a COMPOSED path is built from (VR12); its rule and `when` are DERIVED from theirs by
 *           `derivedRule`, never written by hand
 *   server  the 212 symbol the server's rule lives (or will live) in
 *   twin    `path :: symbol` of the client twin's rule
 *   built   whether the rule is built in both engines (R1 builds none: every row is false)
 * plus `scope`, where one path's rule reaches only part of what the path holds (the rest is said there).
 *
 * THE EXPORT (scripts/veil/rosterChoiceRegistry.mjs) writes the reader's gate input from these rows alone:
 * registry.json `[{path, rule, by}]` and rulings.json `{diffuse, rng}`, BUILT rows only, so the gate still reds on
 * every path whose rule is not built. The walker (tests/lint/rosterChoiceRegistry.walker.test.js) binds the rows to
 * 212 and the twin, the chooser sites to the rows, and the export to the module.
 *
 * NO NEW KEY on the served payload or the saved record comes from this file; it changes no behaviour.
 */

/** @typedef {'withhold' | 'recompose' | 'diffuse' | 'rng'} RosterRule */
/** @typedef {'always' | 'house-hidden'} RosterWhen */
/** @typedef {'i' | 'ii' | 'iii' | 'iv' | null} Vr14Class */
/** @typedef {'yes' | 'no' | 'unsettled'} DrawnAnswer */
/**
 * @typedef {object} RegistryRow
 * @property {string} id
 * @property {string} path
 * @property {string} writer
 * @property {string} house
 * @property {RosterRule} rule
 * @property {RosterWhen} when
 * @property {Vr14Class} vr14
 * @property {DrawnAnswer} drawn
 * @property {ReadonlyArray<string>} inputs
 * @property {string} server
 * @property {string} twin
 * @property {boolean} built
 * @property {string} scope
 * @property {'recompose' | 'withhold' | null} compose  a composed row's own answer where an input withholds
 * @property {string} chair  '' or the reason the row is listed for the chair (the law decided it meanwhile)
 * @property {'re-derive' | 'not drawn' | null} page  VR19 (c): a universally drawn value the server withholds on every
 *   non-owner read: the page re-derives it from the SERVED document with the engine's own function, or does not draw it
 * @property {boolean} crimeOnly  VR19 (d): content that exists only because of crime stays CONDITIONAL (withheld where
 *   its chooser is hidden or its grouping shut), even where an input is withheld on every read
 * @property {ReadonlyArray<string>} condition  a diffuse row's condition (VR8): the rows that must be built before it is exported
 * @property {string | null} copyOf  a copy of another row's value (V10-1, the tile columns): it takes that row's rule
 */
/**
 * @typedef {object} RegistryHost
 * @property {'server' | 'twin'} engine
 * @property {'exists' | 'planned'} state
 * @property {string} stage  the stage that builds rules in it
 */

// ── THE HOSTS: where each rule lives or will live. A planned host does not exist yet; the walker checks a built
//    row's host exists and names the row; R2 to R5 create the planned ones (SUB-BRIEF-VR7 design point 5).
const H = Object.freeze({
  sAlways: 'public._gallery_veil_withhold_always',
  tAlways: 'src/domain/display/galleryWithholdAlways.js :: withholdAlways',
  sChoice: 'public._gallery_veil_roster_choices',
  tChoice: 'src/domain/display/galleryRosterChoices.js :: applyRosterChoices',
  sPeople: 'public._gallery_veil_holders',
  tPeople: 'src/domain/display/gallerySecondHomes.js :: withholdHolders',
  sRekey: 'public._gallery_veil_rekey',
  tRekey: 'src/domain/display/gallerySecondHomes.js :: rekeyPeople',
  sComposed: 'public._gallery_veil_composed',
  tComposed: 'src/domain/display/gallerySecondHomes.js :: withholdComposed',
  sHomes: 'public._gallery_veil_second_homes',
  tHomes: 'src/domain/display/gallerySecondHomes.js :: withholdSecondHomes',
  sApply: 'public._gallery_veil_apply',
  tIncome: 'src/domain/display/gallerySecondHomes.js :: withholdCriminalIncome',
  sTile: 'public._gallery_veil_tile_columns',
  tTile: 'src/domain/display/gallerySecondHomes.js :: withholdTileColumns',
  sChronicle: 'public._gallery_veil_chronicle',
  tChronicle: 'src/domain/display/gallerySecondHomes.js :: withholdChronicle',
  sSent: 'public.get_gallery_dossier',
  tSent: 'src/domain/display/galleryVeil.js :: galleryPayloadFor',
});

/** @type {Readonly<Record<string, RegistryHost>>} */
export const REGISTRY_HOSTS = Object.freeze({
  [H.sAlways]: { engine: 'server', state: 'exists', stage: 'R2 (VR16: the undrawn fields, VR14 (i), the band\'s condition; VR33; VR37), in 212 by VEIL-21' },
  [H.tAlways]: { engine: 'twin', state: 'exists', stage: 'R2' },
  [H.sChoice]: { engine: 'server', state: 'exists', stage: 'R3 (the drawn conditional rows: (a) recompose, (b) withhold), in 212 by VEIL-22\'s builder' },
  [H.tChoice]: { engine: 'twin', state: 'exists', stage: 'R3' },
  [H.sPeople]: { engine: 'server', state: 'planned', stage: 'R4 (VR9: the holder\'s card whole with its ties)' },
  [H.tPeople]: { engine: 'twin', state: 'planned', stage: 'R4' },
  [H.sRekey]: { engine: 'server', state: 'planned', stage: 'R4 (VR10: every person\'s id re-keyed per read)' },
  [H.tRekey]: { engine: 'twin', state: 'planned', stage: 'R4' },
  [H.sComposed]: { engine: 'server', state: 'planned', stage: 'R5 (VR12: every composed block by its inputs)' },
  [H.tComposed]: { engine: 'twin', state: 'planned', stage: 'R5' },
  [H.sHomes]: { engine: 'server', state: 'exists', stage: 'B, C (SUB-BRIEF-BCD, in 212 by VEIL-19)' },
  [H.tHomes]: { engine: 'twin', state: 'exists', stage: 'B, C' },
  [H.sApply]: { engine: 'server', state: 'exists', stage: 'D (SUB-BRIEF-BCD, in 212 by VEIL-19)' },
  [H.tIncome]: { engine: 'twin', state: 'exists', stage: 'D' },
  [H.sTile]: { engine: 'server', state: 'planned', stage: 'V10-1 (the tile columns beside data: VEIL-19 places them)' },
  [H.tTile]: { engine: 'twin', state: 'planned', stage: 'V10-1' },
  [H.sChronicle]: { engine: 'server', state: 'planned', stage: 'V10-1 (the chronicle: VEIL-19 designs it)' },
  [H.tChronicle]: { engine: 'twin', state: 'planned', stage: 'V10-1' },
  [H.sSent]: { engine: 'server', state: 'exists', stage: 'none: a diffuse (VR8) or rng-only (VR13) row is sent as stored' },
  [H.tSent]: { engine: 'twin', state: 'exists', stage: 'none' },
});

// ── THE WRITERS (the choosers, traced to their code; cited by symbol)
const W = Object.freeze({
  safety: 'src/generators/safetyProfile.js :: generateSafetyProfile',
  gates: 'src/generators/safetyLineTruth.js :: gatesSmugglersLine',
  foothold: 'src/generators/safetyLineTruth.js :: footholdWord',
  flags: 'src/generators/priorityHelpers.js :: getInstFlags',
  defence: 'src/generators/defenseGenerator.js :: generateDefenseProfile',
  conditions: 'src/domain/conditionPromotion.js :: promoteStressorsToConditions',
  economy: 'src/generators/economy/economicState.js :: generateEconomicState',
  complexity: 'src/generators/economy/prosperity.js :: deriveEconomicComplexity',
  prosperity: 'src/generators/economy/prosperity.js :: labelFromBase',
  situation: 'src/generators/economy/prosperity.js :: situationDescOf',
  food: 'src/generators/foodGenerator.js :: generateFoodSecurity',
  income: 'src/generators/economy/incomeLineSiblings.js :: shareIncomeRows',
  history: 'src/generators/historyGenerator.js :: generateHistory',
  event: 'src/generators/historyGenerator.js :: buildHistoricalEvent',
  historyProse: 'src/generators/narrative/historyCoherence.js :: deriveLegacyAnnotations',
  siege: 'src/generators/narrative/historyCoherence.js :: historySiegeNarrative',
  founding: 'src/generators/narrativeGenerator.js :: genArrivalDetail',
  spatial: 'src/generators/spatialGenerator.js :: generateSpatialLayout',
  ruling: 'src/generators/power/rulingStructure.js :: generatePowerStructure',
  stability: 'src/generators/power/governanceNarrative.js :: deriveBaselineStability',
  legitimacy: 'src/generators/factionDynamics.js :: computePublicLegitimacy',
  powerShares: 'src/generators/factionDynamics.js :: applyLegitimacyMultipliers',
  relations: 'src/generators/factionDynamics.js :: withCaptureRelations',
  fingerprint: 'src/generators/power/economyReconciliation.js :: fingerprintPowerEconomyInput',
  conflicts: 'src/generators/power/conflicts.js :: generateConflicts',
  stakes: 'src/domain/crisis/crisisCast.js :: deriveStakes',
  cast: 'src/generators/people/castPowers.js :: landMemberships',
  faces: 'src/generators/people/representatives.js :: generateRepresentatives',
  roster: 'src/generators/npcGenerator.js :: mergeNPCLists',
  ties: 'src/generators/people/ties.js :: drawTies',
  allegiance: 'src/domain/people/allegiance.js :: assignHandlers',
  arrival: 'src/generators/narrativeGenerator.js :: genArrivalDetail',
  density: 'src/generators/density/applyDensityLaw.js :: applyDensityLaw',
  composer: 'src/components/new/publicProseCompose.js :: composePublicProse',
});

// ── THE HOUSE PREDICATES (SUB-BRIEF-VR7 design point 3)
const P = Object.freeze({
  hideable: 'isHideableHouse',
  criminal: 'isCriminalInstitution',
  flags: 'getInstFlags crime flags (hasCriminalInst and its four: the engine\'s keyword list over house names)',
  any: 'any hidden-whole house',
  gates: 'BENEATH_THE_WALLS (src/generators/safetyLineTruth.js)',
  signal: 'crimeSignalOf(...).present',
  holder: 'isHideableHouse, by the card\'s identity (VR4 section 2: the npc_veiled_ id, else category criminal)',
});

/** The anchored regex of one literal differ path. */
export function exactPath(/** @type {string} */ p) {
  return `^${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
}

/**
 * @typedef {object} RowSpec
 * @property {string} id
 * @property {string} path  a literal differ path (made exact) unless `re` is set
 * @property {boolean} [re]  `path` is already a regex
 * @property {string} writer
 * @property {string} house
 * @property {RosterRule} [rule]
 * @property {RosterWhen} [when]
 * @property {Vr14Class} [vr14]
 * @property {DrawnAnswer} drawn
 * @property {string[]} [inputs]
 * @property {'recompose' | 'withhold' | null} [compose]
 * @property {string} server
 * @property {string} twin
 * @property {string} [scope]
 * @property {string} [chair]
 * @property {'re-derive' | 'not drawn' | null} [page]
 * @property {boolean} [crimeOnly]
 * @property {string[]} [condition]
 * @property {string | null} [copyOf]
 * @property {boolean} [built]
 */

/** @returns {RegistryRow} */
function row(/** @type {RowSpec} */ o) {
  return {
    id: o.id,
    path: o.re ? o.path : exactPath(o.path),
    writer: o.writer,
    house: o.house,
    rule: o.rule ?? 'withhold',
    when: o.when ?? 'always',
    vr14: o.vr14 ?? null,
    drawn: o.drawn,
    inputs: o.inputs ?? [],
    server: o.server,
    twin: o.twin,
    built: o.built ?? false,
    scope: o.scope ?? '',
    compose: o.compose ?? null,
    chair: o.chair ?? '',
    page: o.page ?? null,
    crimeOnly: o.crimeOnly ?? false,
    condition: o.condition ?? [],
    copyOf: o.copyOf ?? null,
  };
}

/** @typedef {Omit<RowSpec, 'rule' | 'when' | 'server' | 'twin' | 'drawn'> & { drawn?: DrawnAnswer }} ShortSpec */

/** VR16 / VR14 (iii): a field no non-owner page draws, withheld on every non-owner read whatever the veil (R2). */
const undrawn = (/** @type {ShortSpec} */ o) => row({ drawn: 'no', built: true, ...o, rule: 'withhold', when: 'always', server: H.sAlways, twin: H.tAlways });
/** VR14 (i): a number that measures crime itself, withheld on every non-owner read (R2). */
const crimeMeasure = (/** @type {ShortSpec} */ o) => row({ drawn: 'no', built: true, ...o, vr14: 'i', rule: 'withhold', when: 'always', server: H.sAlways, twin: H.tAlways });
/** VR8 / VR14 (iv): a drawn form that stays, DIFFUSE, sent as stored (built once the band's condition holds). */
const BAND_CONDITION = Object.freeze(['compound.criminalEffective', 'safety.compound.criminalEffective', 'safety.safetyRatio', 'compound.militaryEffective', 'safety.compound.militaryEffective']);
const diffuse = (/** @type {ShortSpec} */ o) => row({ drawn: 'yes', condition: [...BAND_CONDITION], ...o, rule: 'diffuse', when: 'always', server: H.sSent, twin: H.tSent });
/** VR13: history drawn again by the rng alone (the seed never ships). */
const rng = (/** @type {ShortSpec} */ o) => row({ drawn: 'yes', ...o, rule: 'rng', when: 'always', built: true, server: H.sSent, twin: H.tSent });
/** (a) a drawn field rebuilt exactly from served data alone where a house is hidden whole (R3). */
const recompose = (/** @type {ShortSpec} */ o) => row({ drawn: 'yes', built: true, ...o, rule: 'recompose', when: 'house-hidden', server: H.sChoice, twin: H.tChoice });
/** (b) a drawn field withheld where a house hidden whole could have chosen it (R3). */
const choiceWithhold = (/** @type {ShortSpec} */ o) => row({ drawn: 'yes', built: true, ...o, rule: 'withhold', when: 'house-hidden', server: H.sChoice, twin: H.tChoice });
/** VR9: the holder's card withheld whole with its ties; every copy of a tie follows (R4). */
const holder = (/** @type {ShortSpec} */ o) => row({ drawn: 'yes', ...o, rule: 'withhold', when: 'house-hidden', server: H.sPeople, twin: H.tPeople });
/** VR12: a composed path; its rule and `when` are derived from its inputs (R5). */
const composed = (/** @type {ShortSpec & { inputs: string[], compose: 'recompose' | 'withhold' }} */ o) => row({ drawn: 'yes', ...o, server: H.sComposed, twin: H.tComposed });

const ROWS_SPEC = [
  // ── the conditions (crisis severity: the stressors a hidden house moved)
  undrawn({ id: 'conditions.severity', path: 'activeConditions[].severity', writer: W.conditions, house: P.any, vr14: 'iii', drawn: 'yes', page: 're-derive',
    scope: 'VR33, VR37 (a): R2\'s render-twice found it DRAWN (the Foundations chips, causalState.js); the number withheld on every read, the band served; the page draws the chips from the band (pageRederive.js :: rederiveForPage: the band\'s own default severity, activeConditions.js :: defaultSeverityForBand)' }),
  diffuse({ id: 'conditions.severityBand', path: 'activeConditions[].severityBand', writer: W.conditions, house: P.any, vr14: 'iv',
    scope: 'VR37: a condition\'s band, a closed ordered vocabulary (VR28 tier 2), sent as stored; the page draws the chips from it' }),

  // ── the defence profile (getInstFlags' crime flags and the criminal compound feed every score)
  undrawn({ id: 'defence.readiness.score', path: 'defenseProfile.readiness.score', writer: W.defence, house: P.flags, vr14: 'iii', drawn: 'yes', page: 're-derive',
    scope: 'VR33, VR37 (a): DRAWN (the Foundations chip); withheld on every read, the label and colours stay (tier 2); the page re-derives it (pageRederive.js :: rederiveForPage)' }),
  diffuse({ id: 'defence.readiness.label', path: 'defenseProfile.readiness.label', writer: W.defence, house: P.flags, vr14: 'iv', scope: 'DefenseTab readiness banner' }),
  diffuse({ id: 'defence.readiness.colours', path: '^defenseProfile\\.readiness\\.(color|background|border)$', re: true, writer: W.defence, house: P.flags, vr14: 'iv', scope: 'the banner\'s colours, the label\'s drawn form' }),
  // VR33 (the seventh chair, FINAL): all six scores and the gates withheld on EVERY non-owner read, both stored shapes (R1 had
  // them diffuse); the page re-derives what it draws (pageRederive.js :: rederiveForPage), the import's save re-derives them
  undrawn({ id: 'defence.scores.disaster', path: 'defenseProfile.scores.disaster', writer: W.defence, house: P.flags, vr14: 'iii', drawn: 'yes', page: 're-derive', scope: 'VR33; R2\'s render-twice moved no byte on its three towns; the page re-derives it with the other five' }),
  undrawn({ id: 'defence.scores.economic', path: 'defenseProfile.scores.economic', writer: W.defence, house: P.flags, vr14: 'iii', drawn: 'yes', page: 're-derive', scope: 'VR33; DRAWN (Overview bars, Foundations, DefenseTab)' }),
  undrawn({ id: 'defence.scores.internal', path: 'defenseProfile.scores.internal', writer: W.defence, house: P.flags, vr14: 'iii', drawn: 'yes', page: 're-derive', scope: 'VR33; DRAWN (Foundations, DefenseTab)' }),
  undrawn({ id: 'defence.scores.magical', path: 'defenseProfile.scores.magical', writer: W.defence, house: P.flags, vr14: 'iii', drawn: 'yes', page: 're-derive', scope: 'VR33; DRAWN (Overview bars)' }),
  undrawn({ id: 'defence.scores.military', path: 'defenseProfile.scores.military', writer: W.defence, house: P.flags, vr14: 'iii', drawn: 'yes', page: 're-derive', scope: 'VR33; DRAWN (Foundations, DefenseTab)' }),
  undrawn({ id: 'defence.scores.monster', path: 'defenseProfile.scores.monster', writer: W.defence, house: P.flags, vr14: 'iii', drawn: 'yes', page: 're-derive', scope: 'VR33; DRAWN (Overview bars, DefenseTab)' }),
  undrawn({ id: 'defence.economicGates', path: '^defenseProfile\\.economicGates\\.(disaster|economic|internal|military|monster)$', re: true, writer: W.defence, house: P.flags, vr14: 'iii', drawn: 'yes', page: 're-derive', scope: 'VR33; the object goes whole; DRAWN (the Defense tab\'s law and guard lines read the gates: publicProseEquality soak1k-3, -9), so the page re-derives it' }),

  // ── the compound (economicState.compound and its copy safetyProfile.compound: getInstFlags' stamp)
  crimeMeasure({ id: 'compound.criminalEffective', path: 'economicState.compound.criminalEffective', writer: W.flags, house: P.flags }),
  crimeMeasure({ id: 'compound.criminalPreStress', path: 'economicState.compound.criminalPreStress', writer: W.flags, house: P.flags }),
  row({ id: 'compound.economyOutput', path: 'economicState.compound.economyOutput', writer: W.flags, house: P.flags, rule: 'withhold', when: 'always', vr14: 'i', drawn: 'yes', page: 're-derive', server: H.sAlways, twin: H.tAlways, built: true,
    scope: 'VR19 (b), (c), ruling 1: it moves only with the hidden house (B 85, C 0), so VR14 (iv)\'s exception makes it (i). The page may re-derive it: getInstFlags(config, institutions) reads only the config (priorities, stresses, threat, neighbour) and the house names, both in the served document (config is in SETTLEMENT_FLOOR); that every config key it reads survives the projection is PLAUSIBLE, not executed' }),
  undrawn({ id: 'compound.magicInfluence', path: 'economicState.compound.magicInfluence', writer: W.flags, house: P.flags, vr14: 'iii' }),
  undrawn({ id: 'compound.militaryEffective', path: 'economicState.compound.militaryEffective', writer: W.flags, house: P.flags, vr14: 'iii', scope: 'VR8\'s condition: drawn on no shared page (VR7-MEASURE M3), so withheld' }),
  undrawn({ id: 'compound.religionInfluence', path: 'economicState.compound.religionInfluence', writer: W.flags, house: P.flags, vr14: 'iii' }),
  crimeMeasure({ id: 'safety.compound.criminalEffective', path: 'economicState.safetyProfile.compound.criminalEffective', writer: W.flags, house: P.flags }),
  crimeMeasure({ id: 'safety.compound.criminalPreStress', path: 'economicState.safetyProfile.compound.criminalPreStress', writer: W.flags, house: P.flags }),
  undrawn({ id: 'safety.compound.economyOutput', path: 'economicState.safetyProfile.compound.economyOutput', writer: W.flags, house: P.flags, vr14: 'iii' }),
  undrawn({ id: 'safety.compound.magicInfluence', path: 'economicState.safetyProfile.compound.magicInfluence', writer: W.flags, house: P.flags, vr14: 'iii' }),
  undrawn({ id: 'safety.compound.militaryEffective', path: 'economicState.safetyProfile.compound.militaryEffective', writer: W.flags, house: P.flags, vr14: 'iii' }),
  undrawn({ id: 'safety.compound.religionInfluence', path: 'economicState.safetyProfile.compound.religionInfluence', writer: W.flags, house: P.flags, vr14: 'iii' }),
  // C (SUB-BRIEF-BCD): every existence flag of both compounds by getInstFlags over the SERVED houses
  row({ id: 'compound.inst.flags', path: '^economicState\\.(safetyProfile\\.)?compound\\.inst\\.has[A-Za-z]+$', re: true, writer: W.flags, house: P.flags, rule: 'recompose', when: 'house-hidden', vr14: 'i', drawn: 'no', server: H.sHomes, twin: H.tHomes,
    scope: 'item C: every boolean of both compounds recomposed from the served houses by the engine\'s own getInstFlags rule, one keyword table, one fold; a flag the served houses cannot decide is withheld (false)' }),
  row({ id: 'compound.inst.names', path: '^economicState\\.(safetyProfile\\.)?compound\\.inst\\.names\\[\\]', re: true, writer: W.flags, house: P.hideable, rule: 'withhold', when: 'house-hidden', vr14: null, drawn: 'no', server: H.sHomes, twin: H.tHomes,
    scope: 'built by 212 (17) by positive account; registered so the walker binds it' }),

  // ── the economy
  recompose({ id: 'economy.complexity', path: 'economicState.economicComplexity', writer: W.complexity, house: P.criminal, vr14: 'iv', inputs: [],
    scope: 'VR4 ii-14: the ladder re-derived from the served rows (count without the withheld row, the served shares, the engine\'s hasInst words over the served names)' }),
  diffuse({ id: 'food.record.storageMonths', path: 'economicState.foodSecurity.foodRecord.storageMonths', writer: W.food, house: P.flags, vr14: 'iv', scope: 'drawn as words (tonightSheet.js :: foodStoresWords)' }),
  diffuse({ id: 'food.resilienceScore', path: 'economicState.foodSecurity.resilienceScore', writer: W.food, house: P.flags, vr14: 'iv' }),
  undrawn({ id: 'food.storageMonths', path: 'economicState.foodSecurity.storageMonths', writer: W.food, house: P.flags, vr14: 'iii', scope: 'campaign-season only (dossierViewModel.js :: deriveGranaryOutlook); R2\'s render-twice: no byte' }),
  undrawn({ id: 'food.storageNote', path: 'economicState.foodSecurity.storageNote', writer: W.food, house: P.flags }),
  // D (SUB-BRIEF-BCD): the income row by its house, the shares re-derived, weight withheld
  row({ id: 'income.criminalRow', path: 'economicState.incomeSources[] (only in A)', writer: W.income, house: P.criminal, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sApply, twin: H.tIncome,
    scope: 'item D (1): the criminal row withheld where either grouping is shut OR any criminal house is hidden whole; its desc goes with it' }),
  row({ id: 'income.composition', path: 'economicState.incomeSources[] (only in B)', writer: W.economy, house: P.any, rule: 'diffuse', when: 'always', drawn: 'yes', server: H.sSent, twin: H.tSent,
    condition: [...BAND_CONDITION], scope: 'ruling 4: a lawful row only the counterfactual drew (17 towns), recorded as diffuse' }),
  row({ id: 'income.percentage', path: 'economicState.incomeSources[].percentage', writer: W.income, house: P.criminal, rule: 'recompose', when: 'house-hidden', vr14: 'ii', drawn: 'yes', server: H.sApply, twin: H.tIncome,
    scope: 'item D (2), VR6: wherever a row is withheld the rest re-derived to 100 by largest remainder from weight' }),
  undrawn({ id: 'income.weight', path: 'economicState.incomeSources[].weight', writer: W.income, house: P.criminal, vr14: 'iii', scope: 'item D (4): no non-owner page reads it' }),
  row({ id: 'income.desc', path: 'economicState.incomeSources[].desc', writer: W.income, house: P.criminal, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sApply, twin: H.tIncome, scope: 'master\'s shape (2 towns): a row\'s desc goes with its row (item D (3)); a desc naming a hidden house leaves its row (212 (12))' }),
  diffuse({ id: 'economy.prosperity', path: 'economicState.prosperity', writer: W.prosperity, house: P.flags, vr14: 'iv' }),
  diffuse({ id: 'economy.prosperityStanding', path: 'economicState.prosperityStanding', writer: W.prosperity, house: P.flags, vr14: 'iv' }),
  undrawn({ id: 'economy.situationDesc', path: 'economicState.situationDesc', writer: W.situation, house: P.flags, scope: 'a fallback no born town draws (settlementQuickGuide.js material_life); its text names crime' }),

  // ── the safety profile
  choiceWithhold({ id: 'safety.economicDragDesc', path: 'economicState.safetyProfile.economicDragDesc', writer: W.safety, house: P.flags, scope: 'VR4 i-6: withheld with blackMarketCapture, and where a criminal house is hidden whole. R3, VR42: by attribution, withheld where a hidden house raised hasCriminalInst or hasMarket (the black-market share and its line move with them) or carried an organised name; a criminal governing body moves none of them, so there it stays. R3-TELL-3 (ruling 62 (2), the chair 19:21): WITHHELD AS null, never deleted and never \'\': the key stays and its value is the empty form nothing-hidden pages show (the generator writes null where the black-market share is low; an absent key is a tell GATE-1 finds), both engines' }),
  row({ id: 'safety.blackMarketCapture', path: 'economicState.safetyProfile.blackMarketCapture', writer: W.safety, house: P.criminal, rule: 'withhold', when: 'always', vr14: 'i', drawn: 'yes', server: H.sAlways, twin: H.tAlways, built: true,
    page: 're-derive', scope: 'VR14 (i), ruling 2: withheld on every non-owner read. R2-CURE (VEIL-21; the chair\'s ruling of 04:27 UTC, identity; VR19 (c)): the engine\'s generateSafetyProfile over the served config, tier and houses gives the stored figure (40 of 40 soak towns\' unmarked shares), and the page puts it back ONLY on a share it knows carries no veil (pageRederive.js, `unveiled`; gallery.js :: sanitizeDossier): a marked share and the map\'s member, which cannot prove the underside grouping open, do not draw it (VR17)' }),
  undrawn({ id: 'safety.flags.anyActive', path: 'economicState.safetyProfile.flags.anyActive', writer: W.safety, house: P.flags, vr14: 'i' }),
  undrawn({ id: 'safety.flags.arcaneBlackMarket', path: 'economicState.safetyProfile.flags.arcaneBlackMarket', writer: W.safety, house: P.flags, vr14: 'i' }),
  undrawn({ id: 'safety.flags.merchantArmy', path: 'economicState.safetyProfile.flags.merchantArmy', writer: W.safety, house: P.flags, vr14: 'iii' }),
  undrawn({ id: 'safety.flags.religiousFraud', path: 'economicState.safetyProfile.flags.religiousFraud', writer: W.safety, house: P.flags, vr14: 'i' }),
  undrawn({ id: 'safety.flags.merchantCriminalBlur', path: 'economicState.safetyProfile.flags.merchantCriminalBlur', writer: W.safety, house: P.flags, vr14: 'i' }),
  recompose({ id: 'safety.guardEffectivenessDesc', path: 'economicState.safetyProfile.guardEffectivenessDesc', writer: W.gates, house: P.gates,
    scope: 'VR4 i-1: the gates tail, the fixed twin template with lawRef read back from the chosen sentence' }),
  recompose({ id: 'safety.safetyDesc', path: 'economicState.safetyProfile.safetyDesc', writer: W.foothold, house: P.flags,
    scope: 'VR4 i-3: the foothold word swapped exactly; VR4 i-2 (the Very Safe gates line, a facts-resolved sibling with no exact SQL twin): where it stands the field is withheld whole' }),
  diffuse({ id: 'safety.safetyLabel', path: 'economicState.safetyProfile.safetyLabel', writer: W.safety, house: P.flags, vr14: 'iv', scope: 'VR8: the overall safety band, diffuse on its condition (criminalEffective and safetyRatio withheld)' }),
  row({ id: 'safety.safetyRatio', path: 'economicState.safetyProfile.safetyRatio', writer: W.safety, house: P.flags, rule: 'withhold', when: 'always', vr14: 'i', drawn: 'yes', server: H.sAlways, twin: H.tAlways, built: true,
    page: 'not drawn',
    scope: 'VR8\'s condition, VR19 (b), (c), ruling 2: withheld on every non-owner read. Measured: the daily-life order words cut safetyRatio at 2.0, 1.5, 1.2, 1.0, 0.7, 0.5 (dailyLifeLogic.js safetyScore) where the safety band cuts effectiveSafety at 3.5, 2, 1.2, 0.6 (safetyProfile.js): FINER than the band, and no served field re-derives the ratio, so the shared page does not draw them' }),
  row({ id: 'safety.crimeTypes', path: '^economicState\\.safetyProfile\\.crimeTypes\\b', re: true, writer: W.safety, house: P.flags, rule: 'withhold', when: 'house-hidden', vr14: 'i', drawn: 'yes', server: H.sChoice, twin: H.tChoice, built: true,
    scope: 'VR4 ii-1, i-4, i-5: an entry a hidden house chose withheld by the house\'s eye, not the grouping\'s; today the grouping block:defense.criminalStructure withholds the whole. R3-CURE: a type the attribution map does not hold FAILS CLOSED (withheld); the map holds every type safetyProfile.js writes (tests/lint/rosterChoicePools.walker.test.js)' }),
  row({ id: 'safety.plotHooks', path: '^economicState\\.safetyProfile\\.plotHooks\\b', re: true, writer: W.safety, house: P.flags, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sChoice, twin: H.tChoice, built: true,
    scope: 'VR4 i-7: a hook a hidden house chose, withheld by the house\'s eye; today tab:plot_hooks' }),
  row({ id: 'safety.criminalInstitutions', path: '^economicState\\.safetyProfile\\.criminalInstitutions\\b', re: true, writer: W.safety, house: P.criminal, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sApply, twin: H.tHomes,
    scope: 'VR4 ii-2: built by 212 (16)/(19) by name; registered so the walker binds it. R3-CURE-2 (the chair\'s ruling 2, the seat\'s relay of 09:18: the whole list): where a house is hidden whole, every entry is RE-DERIVED over the served houses by the engine\'s label table (212 `crimlabels` and the twin CRIMINAL_INST_LABELS in R3\'s host, held equal to safetyProfile.js by tests/lint/rosterChoicePools.walker.test.js), kept only as many times as served houses carry its label: a hidden "Multiple criminal factions" wrote "Rival Gangs", which no by-name rule reads, and the Defense key read it (`listed`); VR29: the array stays' }),

  // ── history: the crime-wave entries are the house's; every other re-draw is the rng's (VR13)
  choiceWithhold({ id: 'history.tension.crimeWave', path: 'history.currentTensions[] (only in A)', writer: W.event, house: P.signal, scope: 'VR4 ii-7: the crime_wave tension withheld where the SERVED crime signal is false (no criminal seat, no served criminal house)' }),
  rng({ id: 'history.tension.redraw', path: 'history.currentTensions[] (only in B)', writer: W.history, house: P.any }),
  rng({ id: 'history.tension.description', path: 'history.currentTensions[].description', writer: W.history, house: P.any }),
  rng({ id: 'history.tension.factions', path: '^history\\.currentTensions\\[\\]\\.factions\\[\\] \\(only in [AB]\\)$', re: true, writer: W.history, house: P.any,
    scope: 'M3\'s one unread path, resolved: DRAWN (HistoryTab.jsx :: TensionRow renders t.factions as chips); re-drawn with its tension' }),
  choiceWithhold({ id: 'history.event.crimeWave', path: '^history\\.(historicalEvents|eventsTimeline)\\[\\] \\(only in A\\)$', re: true, writer: W.event, house: P.criminal,
    scope: 'VR4 ii-11: an event of type crime_wave (and its timeline copy) withheld where no served criminal house stands; every other entry only in A is the rng\'s re-draw (VR13)' }),
  rng({ id: 'history.event.redraw', path: '^history\\.(historicalEvents|eventsTimeline)\\[\\] \\(only in B\\)$', re: true, writer: W.history, house: P.any }),
  undrawn({ id: 'history.timeline.anchored', path: 'history.eventsTimeline[].anchored', writer: W.history, house: P.any }),
  undrawn({ id: 'history.timeline.year', path: 'history.eventsTimeline[].year', writer: W.history, house: P.any, vr14: 'iii' }),
  rng({ id: 'history.timeline.yearsAgo', path: 'history.eventsTimeline[].yearsAgo', writer: W.history, house: P.any, vr14: 'iv' }),
  diffuse({ id: 'history.founding.overcoming', path: 'history.founding.overcoming', writer: W.founding, house: P.flags, inputs: ['economy.prosperity'], compose: 'recompose',
    scope: 'picked from OVERCOMING_BY_PROSPERITY by the prosperity label (diffuse, VR14 (iv)); B 24, C 0' }),
  rng({ id: 'history.character', path: 'history.historicalCharacter', writer: W.history, house: P.any }),
  undrawn({ id: 'history.event.anchored', path: 'history.historicalEvents[].anchored', writer: W.history, house: P.any }),
  rng({ id: 'history.event.description', path: 'history.historicalEvents[].description', writer: W.history, house: P.any }),
  rng({ id: 'history.event.lastingEffects', path: '^history\\.historicalEvents\\[\\]\\.lastingEffects\\[\\] \\(only in [AB]\\)$', re: true, writer: W.history, house: P.any }),
  rng({ id: 'history.event.severity', path: 'history.historicalEvents[].severity', writer: W.history, house: P.any }),
  rng({ id: 'history.event.yearsAgo', path: 'history.historicalEvents[].yearsAgo', writer: W.history, house: P.any, vr14: 'iv' }),
  undrawn({ id: 'history.legacy', path: '^history\\.legacyAnnotations\\[\\](\\.(annotation|eventName|eventType|severity|yearsAgo))?$', re: true, writer: W.historyProse, house: P.any,
    scope: 'drawn only through publicProse general:history.legacyLines (VR7-MEASURE M3)' }),
  undrawn({ id: 'history.siegeNarrative', path: 'history.siegeNarrative', writer: W.siege, house: P.signal, scope: 'a desk input only (generalStateProse); its text names crime' }),

  // ── the houses and the people (new shape)
  choiceWithhold({ id: 'institutions.desc', path: 'institutions[].desc', writer: 'src/domain/facts/drawDeclared.js :: drawDeclared', house: 'the fact \'rival power\' (factVocabulary.js), read from powerStructure, which the hidden house\'s power moves',
    scope: 'ruling 7, (b): measured on the three towns: each open-house description is one of a declared twin pair (src/data/institutionDescVariants.js: "belongs solely to" excludes \'rival power\', its twin "rests with"), chosen by a roster-moved fact, so not rng; withheld where a house is hidden whole' }),
  undrawn({ id: 'npcs.memberships.veiled', path: 'npcs[].memberships[].veiled', writer: W.cast, house: P.hideable, drawn: 'no',
    scope: 'Reveal DM: a membership\'s veiled mark (no component reads it)', chair: 'the import may need the mark to keep the cover on the importer\'s record (VR16 condition (2)): not decided here' }),
  undrawn({ id: 'npcs.stressNote', path: 'npcs[].stressNote', writer: W.arrival, house: P.any, scope: 'Reveal DM; no component reads npcs[].stressNote (only history.founding.stressNote)' }),
  row({ id: 'ties.covertHandler', path: '^relationships\\[\\]\\.(covert|handler)$', re: true, writer: W.ties, house: P.criminal, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sHomes, twin: H.tHomes,
    scope: 'VR4 ii-12 with item B: the handler tie to a criminal house hidden whole withheld whole by identity (allegiance.js :: criminalHousesOf)' }),
  row({ id: 'trace.criminalAllegiance', path: '^simulationTrace\\[\\]\\.(targetId|causes\\[\\]\\.reason|downstreamEffects\\[\\]\\.(reason|target))$', re: true, writer: W.allegiance, house: P.criminal, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sHomes, twin: H.tHomes,
    scope: 'item B: a trace entry (and each cause and downstream effect) stays only where a native listed house accounts for it; with it VR4 ii-12\'s "runs to the town\'s criminal power" / "the local underworld" line' }),
  choiceWithhold({ id: 'people.allegiance', path: '^npcs\\[\\]\\.allegiance\\b', re: true, writer: 'src/domain/people/allegiance.js :: dealAllegiances', house: P.criminal,
    scope: 'R3-TELL-4 unit (i) (ruling 73 (2): served as the house-free twin serves it): a served person\'s allegiance stays only BY POSITIVE ACCOUNT, its `house` a house the read lists and its `power` null or a power the read serves; else THE KEY leaves (the open place\'s form: no nothing-hidden birth of the pool serves one, 1,808 of 1,808; no husk, ruling 47). Not R4\'s holder pass (VR9): an agent is not its house\'s holder; the handler id inside it leaves with the key' }),

  // ── the power structure
  undrawn({ id: 'power.fingerprint', path: 'powerStructure.economyInputFingerprint', writer: W.fingerprint, house: P.flags, vr14: 'iii' }),
  choiceWithhold({ id: 'power.entry', path: 'powerStructure.factions[] (only in A)', writer: W.ruling, house: P.criminal,
    scope: 'a criminal POWER the hidden house raised, withheld with it; the rest re-derived (VR11). VR42 (tier 2): THE GOVERNING POWER\'S ROW IS NEVER REMOVED (a criminal-worded governing body is the town\'s public nature); every other criminal power (its seat\'s mark, or a thieves\' name) is withheld where a house is hidden whole (R3). R3-CURE (the chair, 07:31 and 07:39 UTC): WHOLE, in either stored shape (the top-level factions[] too, an entry naming a governing power kept) and EVERY STRUCTURED COPY (a conflict or tension naming it, a contestsNiche, a person\'s membership, affiliation key and the goal that targets or names it); prose over the powers is R5\'s (power.desc)' }),
  diffuse({ id: 'power.composition', path: 'powerStructure.factions[] (only in B)', writer: W.ruling, house: P.any,
    scope: 'ruling 4: the counterfactual\'s own draw (a path only B holds), recorded as diffuse' }),
  undrawn({ id: 'power.contestsNiche', path: 'powerStructure.factions[].contestsNiche', writer: W.ruling, house: P.any }),
  composed({ id: 'power.desc', path: 'powerStructure.factions[].desc', writer: W.ruling, house: P.criminal, inputs: ['power.share', 'power.entry'], compose: 'withhold',
    scope: 'a power\'s standing sentence ("close enough now to contest the seat") composed from the shares a withheld power held; withheld with it (ruling 3)' }),
  row({ id: 'power.share', path: 'powerStructure.factions[].power', writer: W.powerShares, house: P.criminal, rule: 'recompose', when: 'house-hidden', vr14: 'ii', drawn: 'yes', server: H.sChoice, twin: H.tChoice, built: true,
    scope: 'VR11: where a power is withheld, the remaining powers\' shares re-derived to 100 by largest remainder' }),
  composed({ id: 'power.label', path: 'powerStructure.factions[].powerLabel', writer: W.powerShares, house: P.criminal, vr14: 'iv', inputs: ['power.share'], compose: 'recompose',
    scope: 'the label ladder over the re-derived share' }),
  undrawn({ id: 'power.rawPower', path: 'powerStructure.factions[].rawPower', writer: W.powerShares, house: P.criminal, vr14: 'iii' }),
  choiceWithhold({ id: 'power.relation.entry', path: 'powerStructure.factionRelationships[] (only in A)', writer: W.relations, house: P.criminal,
    scope: 'a relation one of whose ends is a withheld power (the capture relation, "symbiotic") leaves with it' }),
  diffuse({ id: 'power.relation.composition', path: 'powerStructure.factionRelationships[] (only in B)', writer: W.relations, house: P.any,
    scope: 'ruling 4: the counterfactual\'s own draw, recorded as diffuse' }),
  composed({ id: 'power.relation.dmNote', path: 'powerStructure.factionRelationships[].dmNote', writer: W.relations, house: P.criminal, inputs: ['power.relation.entry'], compose: 'withhold',
    scope: 'Reveal DM: the note names the withheld criminal power by its own name' }),
  undrawn({ id: 'power.relation.ratio', path: 'powerStructure.factionRelationships[].ratio', writer: W.relations, house: P.any, vr14: 'iii' }),
  choiceWithhold({ id: 'power.relation.direction', path: 'powerStructure.factionRelationships[].direction', writer: W.relations, house: P.criminal,
    scope: 'VR37 (b): DRAWN (Systems/Power, PowerStrata.jsx :: chipDirection). Not (a): it is chosen by the capture state and the legitimacy flags (factionDynamics.js), and the flags are withheld on every read, so no served field re-derives it. The relation names its two powers (pair), so the word goes with its relation per entry, by the powers\' rule (power.relation.entry, R3); the word left is a closed vocabulary (stable / escalating: VR28 tier 2)' }),
  diffuse({ id: 'legitimacy.label', path: 'powerStructure.publicLegitimacy.label', writer: W.legitimacy, house: P.flags, vr14: 'iv' }),
  diffuse({ id: 'legitimacy.score', path: 'powerStructure.publicLegitimacy.score', writer: W.legitimacy, house: P.flags, vr14: 'iv', scope: 'drawn raw on PowerTab (the number); VR14 (iv) until the differ shows the drawn form alone identifies a house' }),
  diffuse({ id: 'legitimacy.colours', path: '^powerStructure\\.publicLegitimacy\\.(bg|color)$', re: true, writer: W.legitimacy, house: P.flags, vr14: 'iv', scope: 'the label\'s drawn colours' }),
  undrawn({ id: 'legitimacy.breakdown', path: '^powerStructure\\.publicLegitimacy\\.breakdown\\.(prosperity|safety|defense)$', re: true, writer: W.legitimacy, house: P.flags, vr14: 'iii' }),
  crimeMeasure({ id: 'legitimacy.crimMultiplier', path: 'powerStructure.publicLegitimacy.crimMultiplier', writer: W.legitimacy, house: P.flags }),
  undrawn({ id: 'legitimacy.govMultiplier', path: 'powerStructure.publicLegitimacy.govMultiplier', writer: W.legitimacy, house: P.flags, vr14: 'iii' }),
  undrawn({ id: 'legitimacy.flags', path: '^powerStructure\\.publicLegitimacy\\.(isApproved|isContested|isEndorsed|isTolerated|governanceFractured|isLegitimacyCrisis)$', re: true, writer: W.legitimacy, house: P.flags, vr14: 'iii' }),
  composed({ id: 'power.recentConflict', path: 'powerStructure.recentConflict', writer: W.conflicts, house: P.criminal, inputs: ['power.entry'], compose: 'withhold',
    scope: 'a conflict that names a withheld power leaves with it; every other conflict is the power roster\'s composition (diffuse)' }),
  diffuse({ id: 'power.conflicts', path: '^(powerStructure\\.)?conflicts\\[\\](\\.(intensity|issue))?$', re: true, writer: W.conflicts, house: P.any, drawn: 'unsettled',
    scope: 'ruling 4: master\'s shape, the conflicts the counterfactual drew; a conflict naming a withheld power follows power.recentConflict' }),
  row({ id: 'power.stability', path: 'powerStructure.stability', writer: W.stability, house: P.flags, rule: 'recompose', when: 'always', vr14: 'iv', drawn: 'yes', page: 'not drawn', server: H.sAlways, twin: H.tAlways, built: true,
    scope: 'VR19 (a), (b), ruling 5: the band word before its cause stays ("Unstable"), cut by one exact rule in both engines; the cause (the parenthesis or the clause after the dash) is withheld on every non-owner read, uniform, so a bare word tells nothing' }),
  undrawn({ id: 'power.factions.legitimacyCrisis', path: 'powerStructure.factions[].legitimacyCrisis', writer: W.ruling, house: P.any, drawn: 'unsettled', scope: 'master\'s shape' }),

  // ── publicProse (each composed block follows its inputs, VR12; an undrawn copy is withheld always, VR16)
  composed({ id: 'prose.posture.posture', path: 'publicProse.blocks.defense:posture.posture.field', writer: W.composer, house: P.gates, drawn: 'no', inputs: ['safety.guardEffectivenessDesc'], compose: 'recompose' }),
  composed({ id: 'prose.posture.prize', path: 'publicProse.blocks.defense:posture.prize.field', writer: W.composer, house: P.gates, drawn: 'no', inputs: ['safety.guardEffectivenessDesc'], compose: 'recompose' }),
  composed({ id: 'prose.posture.terrain', path: 'publicProse.blocks.defense:posture.terrain.field', writer: W.composer, house: P.gates, drawn: 'no', inputs: ['safety.guardEffectivenessDesc'], compose: 'recompose' }),
  composed({ id: 'prose.state.firstSurvey', path: 'publicProse.blocks.defense:state.firstSurvey.field', writer: W.composer, house: P.flags, drawn: 'no', inputs: ['safety.safetyDesc'], compose: 'recompose' }),
  composed({ id: 'prose.state.publicOrder.field', path: 'publicProse.blocks.defense:state.publicOrder.field', writer: W.composer, house: P.flags, drawn: 'no', inputs: ['safety.safetyDesc'], compose: 'recompose' }),
  composed({ id: 'prose.state.publicOrder.beside', path: 'publicProse.blocks.defense:state.publicOrder.beside', writer: W.composer, house: P.flags, inputs: ['safety.safetyLabel'], compose: 'recompose', scope: 'the order rung\'s sentence, chosen by the band' }),
  composed({ id: 'prose.state.publicOrder.rung.sentence', path: 'publicProse.blocks.defense:state.publicOrder.rung.sentence', writer: W.composer, house: P.flags, inputs: ['safety.safetyLabel'], compose: 'recompose' }),
  composed({ id: 'prose.state.publicOrder.rung.glance', path: 'publicProse.blocks.defense:state.publicOrder.rung.glance', writer: W.composer, house: P.flags, drawn: 'no', inputs: ['safety.safetyLabel'], compose: 'recompose' }),
  composed({ id: 'prose.threat.economic', path: 'publicProse.blocks.defense:threat.economic.sentence', writer: W.composer, house: P.flags, inputs: ['defence.scores.economic'], compose: 'recompose' }),
  composed({ id: 'prose.wall.rationale', path: 'publicProse.blocks.defense:wall.rationale.sentence', writer: W.composer, house: P.flags, inputs: ['defence.readiness.label'], compose: 'recompose', scope: 'the wall line, chosen by the defence state (DefenseTab :: wallLine)' }),
  row({ id: 'prose.incomeWeight', path: 'publicProse.blocks.economy:economics.incomeWeight', writer: W.composer, house: P.criminal, vr14: 'ii', drawn: 'yes', inputs: ['income.percentage'], compose: 'recompose', server: H.sApply, twin: H.tIncome,
    scope: 'ruling 6: a share (VR14 (ii)): it follows item D, re-derived with the percentages where a row is withheld, else withheld' }),
  undrawn({ id: 'prose.incomeWeight.alias', path: '^publicProse\\.blocks\\.economy:(daily_life|resources|services)\\.incomeWeight$', re: true, writer: W.composer, house: P.flags, scope: 'the aliases ({"@": "economy:economics"}) no tab draws' }),
  composed({ id: 'prose.shadowEconomy', path: '^publicProse\\.blocks\\.economy:economics\\.shadowEconomy(\\.sentence)?$', re: true, writer: W.composer, house: P.flags, inputs: ['safety.economicDragDesc', 'safety.blackMarketCapture'], compose: 'withhold', crimeOnly: true,
    scope: 'V9-5, VR19 (d), ruling 2: crime-only content: sent as stored only where its grouping\'s eye is open AND no hideable house is hidden whole on that share; else withheld (VR12)' }),
  undrawn({ id: 'prose.shadowEconomy.alias', path: '^publicProse\\.blocks\\.economy:(daily_life|resources|services)\\.shadowEconomy$', re: true, writer: W.composer, house: P.flags, scope: 'the aliases no tab draws' }),
  composed({ id: 'prose.incomeMix', path: '^publicProse\\.blocks\\.economy:economics\\.(incomeMix(\\.sentence)?|criminalLine)$', re: true, writer: W.composer, house: P.criminal, inputs: ['income.criminalRow', 'income.percentage'], compose: 'withhold',
    scope: 'item D (3) and VR4 ii-15: the sentences that carry the criminal income go with the row' }),
  composed({ id: 'prose.prosperityHeader.detail', path: 'publicProse.blocks.economy:economics.prosperityHeader.detail[].value', writer: W.composer, house: P.criminal, drawn: 'no', inputs: ['economy.complexity'], compose: 'recompose' }),
  composed({ id: 'prose.prosperity.sentence', path: '^publicProse\\.blocks\\.economy:economics\\.prosperity(Header|Rung)\\.sentence$', re: true, writer: W.composer, house: P.flags, inputs: ['economy.prosperity'], compose: 'recompose' }),
  undrawn({ id: 'prose.prosperity.glance', path: '^publicProse\\.blocks\\.economy:economics\\.prosperity(Header|Rung)\\.glance$', re: true, writer: W.composer, house: P.flags, scope: 'a glance is rendered at one place only (WarFaithDesk patron seat)' }),
  composed({ id: 'prose.legacyLines.a', path: 'publicProse.blocks.general:history.legacyLines[] (only in A)', writer: W.composer, house: P.criminal, inputs: ['history.event.crimeWave', 'history.event.description'], compose: 'withhold',
    scope: 'a line composed from a crime_wave event leaves with it; every other line is the rng\'s re-draw (VR13)' }),
  composed({ id: 'prose.legacyLines.b', path: 'publicProse.blocks.general:history.legacyLines[] (only in B)', writer: W.composer, house: P.any, inputs: ['history.event.redraw'], compose: 'recompose' }),
  composed({ id: 'prose.legitimacyBanner', path: 'publicProse.blocks.power:desk.legitimacyBanner.glance', writer: W.composer, house: P.flags, drawn: 'no', inputs: ['legitimacy.label'], compose: 'recompose' }),
  composed({ id: 'prose.legitimacyLens', path: 'publicProse.blocks.power:desk.legitimacyLens', writer: W.composer, house: P.flags, drawn: 'no', inputs: ['legitimacy.label'], compose: 'recompose' }),
  composed({ id: 'prose.stabilityHeader', path: 'publicProse.blocks.power:desk.stabilityHeader.glance', writer: W.composer, house: P.flags, drawn: 'no', inputs: ['power.stability'], compose: 'withhold' }),
  composed({ id: 'prose.structureFlag', path: 'publicProse.blocks.power:desk.structureFlag', writer: W.composer, house: P.flags, inputs: ['safety.flags.merchantCriminalBlur'], compose: 'withhold', crimeOnly: true, scope: 'VR4 ii-15, VR19 (d), ruling 2: crime-only content: sent as stored only where its grouping\'s eye is open AND no hideable house is hidden whole; else withheld' }),
  composed({ id: 'prose.successionRisk', path: 'publicProse.blocks.power:desk.successionRisk.glance', writer: W.composer, house: P.any, drawn: 'no', inputs: ['power.share'], compose: 'recompose' }),
  composed({ id: 'prose.conditionSeverity', path: 'publicProse.blocks.stressors:overview.conditionSeverity.sentence', writer: W.composer, house: P.any, inputs: ['conditions.severity'], compose: 'recompose', scope: 'drawn (OverviewTab CONDITIONS_MOUNT)' }),
  undrawn({ id: 'prose.conditionSeverity.glance', path: 'publicProse.blocks.stressors:overview.conditionSeverity.glance', writer: W.composer, house: P.any }),
  composed({ id: 'prose.templeFraud', path: 'publicProse.blocks.warFaith:faith.templeFraud', writer: W.composer, house: P.flags, inputs: ['safety.flags.religiousFraud'], compose: 'withhold', crimeOnly: true,
    scope: 'VR19 (d), ruling 2: crime-only content: sent as stored only where its grouping\'s eye is open AND no hideable house is hidden whole; else withheld' }),

  row({ id: 'prose.criminal', path: '^publicProse\\.blocks\\.defense:criminal\\b', re: true, writer: W.composer, house: P.criminal, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sChoice, twin: H.tChoice, built: true,
    scope: 'VR4 i-11: the criminal desk (structure sentence, ring note) composed from the crime key over the roster; withheld by the house\'s eye, not only by block:defense.criminalStructure' }),

  // ── V10-1 (the reader, HIGH): columns a read returns BESIDE `data` (get_gallery_dossier, the gallery list's cards), cut
  //    from data by public._gallery_public_tile_rows (147); each is a copy of its source path and takes its rule
  row({ id: 'tile.stability', path: '^tile\\.stability$', re: true, writer: 'supabase/migrations/147_gallery_tile_chain_aliveness_title_reactions.sql :: _gallery_public_tile_rows', house: P.flags, drawn: 'yes', copyOf: 'power.stability', server: H.sTile, twin: H.tTile,
    scope: 'the tile column `stability` = data powerStructure.stability (first of its coalesce)' }),
  row({ id: 'tile.prosperity', path: '^tile\\.prosperity$', re: true, writer: 'supabase/migrations/147_gallery_tile_chain_aliveness_title_reactions.sql :: _gallery_public_tile_rows', house: P.flags, drawn: 'yes', copyOf: 'economy.prosperity', server: H.sTile, twin: H.tTile,
    scope: 'the tile column `prosperity` = data economicState.prosperity' }),
  row({ id: 'tile.threatLevel', path: '^tile\\.threat_level$', re: true, writer: 'supabase/migrations/147_gallery_tile_chain_aliveness_title_reactions.sql :: _gallery_public_tile_rows', house: P.any, rule: 'diffuse', drawn: 'yes', condition: [...BAND_CONDITION], server: H.sTile, twin: H.tTile,
    scope: 'the tile column `threat_level` = data threatProfile.level (else defense.threatLevel): its source differed in none of the four runs, so it is not in the class; recorded diffuse' }),
  row({ id: 'tile.governmentType', path: '^tile\\.government_type$', re: true, writer: 'supabase/migrations/147_gallery_tile_chain_aliveness_title_reactions.sql :: _gallery_public_tile_rows', house: P.any, rule: 'diffuse', drawn: 'yes', condition: [...BAND_CONDITION], server: H.sTile, twin: H.tTile,
    scope: 'the tile column `government_type` = data powerStructure.government (else governingName, governmentType): its source differed in none of the four runs; recorded diffuse' }),
  row({ id: 'chronicle', path: '^chronicle\\b', re: true, writer: 'supabase/migrations/032_gallery_public_chronicle.sql :: _gallery_chronicle_json', house: P.any, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sChronicle, twin: H.tChronicle,
    scope: 'PLACEHOLDER FAMILY (V10-1): the campaign chronicle (campaign_state eventLog) returned beside data; VEIL-19 designs its rule; withheld where a house is hidden whole until then (the law)' }),

  // ── the town's quarters (V9-3)
  undrawn({ id: 'spatial.quarters', path: '^spatialLayout\\.quarters\\[\\]', re: true, writer: W.spatial, house: P.criminal, scope: 'VR4 ii-10 (V9-3): the town plan\'s criminal-named entry; no non-owner page draws that list (VR4 section 2b)' }),

  // ── the crisis cast (both copies: stress and stressors)
  undrawn({ id: 'cast.absent', path: '^(stress|stressors)\\.cast\\.absent\\[\\]$', re: true, writer: W.stakes, house: P.any, scope: 'the Crisis tab is off on every player-view or public page' }),
  row({ id: 'cast.roles', path: '^(stress|stressors)\\.cast\\.roles\\[\\]\\.(reason|role)$', re: true, writer: W.stakes, house: P.any, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sAlways, twin: H.tAlways, built: true,
    scope: 'VR37 (b): DRAWN (Plot Hooks); a role row names its person, power or house and goes PER ENTRY with it (kept only where that is served: 212 :: _gallery_veil_cast); the rest dense (VR21)' }),
  row({ id: 'cast.stakes', path: '^(stress|stressors)\\.cast\\.stakes\\[\\](\\.(factionId|reason|stake))?$', re: true, writer: W.stakes, house: P.criminal, rule: 'withhold', when: 'house-hidden', drawn: 'yes', server: H.sAlways, twin: H.tAlways, built: true,
    scope: 'VR37 (b): DRAWN (Plot Hooks); a stake names its power (factionId) and goes PER ENTRY with it (kept only where that power is served: 212 :: _gallery_veil_cast), so a criminal power\'s stake goes with the power (R3: power.entry); the rest dense (VR21)' }),
  holder({ id: 'cast.roles.entry', path: '^(stress|stressors)\\.cast\\.roles\\[\\]( \\(only in [AB]\\)|\\.name)$', re: true, writer: W.stakes, house: P.holder, drawn: 'no',
    scope: 'master\'s shape: a cast role held by a person whose card is withheld follows the card (VR9); undrawn on a non-owner page besides' }),
  holder({ id: 'cast.levers.holder', path: '^(stress|stressors)\\.cast\\.levers\\[\\]\\.(holderId|holderName)$', re: true, writer: W.stakes, house: P.holder, drawn: 'no',
    scope: 'master\'s shape: a lever\'s holder copy follows the card (VR9); holderId re-keyed per read (VR10)' }),

  // ── master's stored shape: the people, their roster copies, their ties (VR8 composition; VR9 the holder's card)
  holder({ id: 'people.entry', path: '^npcs\\[\\] \\(only in [AB]\\)$', re: true, writer: W.roster, house: P.holder,
    scope: 'the holder\'s card withheld whole (VR9); every other person is the roster\'s general composition, DIFFUSE (VR8)' }),
  holder({ id: 'people.card', path: '^npcs\\[\\]\\.(name|role|title|category|gender|influence|power|secondaryAffiliation|goal\\.(short|long)|personality\\.(dominant|flaw|modifier|speech|tell)|physical\\.(age|build|clothes|feature)|presentation\\.(behaviour|disposition|impression))$', re: true, writer: W.roster, house: P.holder,
    scope: 'a holder\'s card withheld whole with category criminal (VR9); every other person\'s field is the roster\'s composition, DIFFUSE (VR8)' }),
  holder({ id: 'people.rosterCopy', path: '^factions\\[\\]\\.members\\[\\]\\.(activeConstraint|category|goal\\.(short|long)|influence|personality\\.tell|physical\\.clothes|power|presentation\\.(behaviour|disposition|impression)|role|secondaryAffiliation|settlementCondition|structuralPosition|structuralRank)$', re: true, writer: W.roster, house: P.holder,
    scope: 'a roster copy of a person follows the person\'s own card (212 (10), ruling (5)); the holder\'s copy goes whole' }),
  holder({ id: 'people.secret', path: '^npcs\\[\\]\\.secret\\b', re: true, writer: W.roster, house: P.criminal,
    scope: 'VR4 i-9: a secret whose wording a hidden house chose (crimeSignal.js :: crimeHasThievesGuild, withTownsOwnUnderworld); withheld by class:npc:secret today, SENT on Reveal DM' }),
  holder({ id: 'people.ties', path: '^relationships\\[\\] \\(only in [AB]\\)$', re: true, writer: W.ties, house: P.holder, scope: 'a tie of a withheld card leaves whole (VR9, ruling (5)); every other tie is the roster\'s composition' }),
  holder({ id: 'people.prominentRelationship', path: '^prominentRelationship\\.(full|npc1|npc2|phrasing|tension|type)$', re: true, writer: W.ties, house: P.holder, scope: 'the copy of a withheld tie follows it whole (ruling (5))' }),
  holder({ id: 'people.pressureSentence', path: 'pressureSentence', writer: W.ties, house: P.holder, scope: 'where it names a withheld tie\'s two ends or holds its words (ruling (5))' }),
];

/**
 * VR12's ONE FUNCTION: a composed row's rule and `when` from its inputs'. An input withheld only for payload
 * minimisation (VR16, `when: 'always'` with no crime class) carries no tell and does not move a composed row; an input
 * a hidden house moves (`when: 'house-hidden'`, or VR14 (i)) does: the row takes its own `compose` answer (recompose
 * where SQL rebuilds it exactly from served data alone, else withhold), on the strictest `when` of those inputs. With
 * no such input, the row is what its inputs are (rng where every input is rng, else diffuse). An UNDRAWN composed row
 * is withheld on every non-owner read whatever its inputs (VR16).
 * @param {RegistryRow} r
 * @param {ReadonlyMap<string, RegistryRow>} byId
 * @param {Set<string>} [seen]
 * @returns {{ rule: RosterRule, when: RosterWhen }}
 */
export function derivedRule(r, byId, seen = new Set()) {
  if (!r.inputs.length) return { rule: r.rule, when: r.when };
  if (r.drawn === 'no') return { rule: 'withhold', when: 'always' };
  if (seen.has(r.id)) throw new Error(`roster-choice registry: a cycle through ${r.id}`);
  seen.add(r.id);
  const ins = r.inputs.map((id) => {
    const x = byId.get(id);
    if (!x) throw new Error(`roster-choice registry: ${r.id} names an unknown input ${id}`);
    return { row: x, ...derivedRule(x, byId, new Set(seen)) };
  });
  const telling = ins.filter((x) => (x.rule === 'withhold' || x.rule === 'recompose') && (x.when === 'house-hidden' || x.row.vr14 === 'i'));
  if (telling.length) {
    // VR19 (d): content that exists only because of crime stays conditional whatever its inputs
    const when = !r.crimeOnly && telling.some((x) => x.when === 'always' && x.rule === 'withhold') ? 'always' : 'house-hidden';
    return { rule: r.compose ?? 'withhold', when };
  }
  return { rule: ins.every((x) => x.rule === 'rng') ? 'rng' : 'diffuse', when: 'always' };
}

/** @returns {ReadonlyArray<Readonly<RegistryRow>>} */
function finalise(/** @type {RegistryRow[]} */ rows) {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const derived = rows.map((r) => {
    const d = { ...r, ...derivedRule(r, byId) };
    // a composed row that derives diffuse takes its inputs' conditions (VR8's band, by default)
    if (d.rule === 'diffuse' && !d.condition.length) {
      const fromInputs = [...new Set(r.inputs.flatMap((id) => byId.get(id)?.condition ?? []))];
      d.condition = fromInputs.length ? fromInputs : [...BAND_CONDITION];
    }
    return d;
  });
  const done = new Map(derived.map((r) => [r.id, r]));
  // V10-1: a copy takes its source's rule, when, class and page
  const copied = derived.map((r) => {
    const src = r.copyOf ? done.get(r.copyOf) : null;
    if (r.copyOf && !src) throw new Error(`roster-choice registry: ${r.id} copies an unknown row ${r.copyOf}`);
    return src ? { ...r, rule: src.rule, when: src.when, vr14: src.vr14, page: src.page, condition: [...src.condition], built: false } : r;
  });
  const builtIds = new Set(copied.filter((r) => r.built && r.rule !== 'diffuse').map((r) => r.id));
  // VR8: a diffuse row is exported (built) once every row its condition names is built
  return Object.freeze(copied.map((r) => Object.freeze({
    ...r,
    // VR13 (the chair's ruling 10): an rng row is a ruling, not a build: built
    built: r.rule === 'diffuse' ? r.condition.length > 0 && r.condition.every((id) => builtIds.has(id)) : r.rule === 'rng' ? true : r.built,
    inputs: Object.freeze([...r.inputs]),
    condition: Object.freeze([...r.condition]),
  })));
}

/** Every row, its composed rules derived (VR12). */
export const REGISTRY_ROWS = /** @type {ReadonlyArray<Readonly<RegistryRow>>} */ (finalise(ROWS_SPEC));

/**
 * The gate's two inputs from the rows: registry.json (withhold and recompose rows) and rulings.json (diffuse and rng
 * rows). BUILT rows only unless `all` (the every-row coverage proof, never committed).
 * @param {ReadonlyArray<Readonly<RegistryRow>>} rows
 * @param {{ all?: boolean }} [opts]
 */
export function registryExport(rows, { all = false } = {}) {
  const live = rows.filter((r) => all || r.built);
  return {
    registry: live.filter((r) => r.rule === 'withhold' || r.rule === 'recompose').map((r) => ({ path: r.path, rule: r.rule, by: r.writer })),
    rulings: { diffuse: live.filter((r) => r.rule === 'diffuse').map((r) => r.path), rng: live.filter((r) => r.rule === 'rng').map((r) => r.path) },
  };
}

// ── THE WALKER'S CENSUS (tests/lint/rosterChoiceRegistry.walker.test.js): the registered predicates and the crime-name
//    pattern of SUB-BRIEF-VR7 design point 5 (R1), and EVERY site in src/generators/** and the composer's reach
//    (src/components/new/publicProseCompose.js and every src module it imports, transitively) that calls one or holds
//    a regex literal matching the pattern. A site is `path :: top-level symbol` (a top-level registerStep call is
//    `registerStep(<step>)`); it names the rows it chooses, or why it chooses no served path. `rx` is the count of
//    crime-name regex literals there. The set is exact in both directions: a new site reds until registered, a gone
//    one reds until struck.

/** The registered predicates (a call of one from an unregistered site reds the walker). */
export const REGISTERED_PREDICATES = Object.freeze([
  'isHideableHouse', 'isCriminalInstitution', 'institutionMatchesRegex', 'institutionMatchesNativeName', 'crimeSignalOf',
  'getInstFlags', 'criminalHousesOf', 'gatesSmugglersLine', 'beneathTheWalls', 'footholdWord', 'gangHousesOf',
  'GANG_HOUSES_OF', 'oneRingRules', 'criminalStructureKeyOf', 'covertCrimeHeld', 'withTownsOwnUnderworld',
  'brokerageLegalityOf', 'crimeHasThievesGuild', 'settleRosterCrimeLines', 'settleCrimeLinesOnly', 'settleCrimeLinesToSignal',
]);

/** The crime-name pattern (SUB-BRIEF-VR7 design point 5): a regex literal whose source matches it is a chooser site. */
export const CRIME_NAME_PATTERN = Object.freeze({ source: 'thie|smuggl|underground|black.?market|gang|criminal|fence|assassin|clandestine|outlaw|bandit', flags: 'i' });

/** @typedef {{ rows?: string[], why?: string, rx?: number }} RegistrySite */

const SAFETY_ROWS = ['safety.safetyDesc', 'safety.guardEffectivenessDesc', 'safety.safetyLabel', 'safety.safetyRatio', 'safety.economicDragDesc', 'safety.crimeTypes', 'safety.plotHooks', 'safety.criminalInstitutions'];
const SERVICES_WHY = 'availableServices only: a hidden house\'s service rows leave with it (X-21e, _gallery_veil_apply; galleryVeil.js :: applyVeil); no differ path. R3-CURE-2 (the chair\'s ruling 2): where a house is hidden whole, a covert criminal service (institution \'(covert)\', drawn from the criminal climate the houses moved, the Defense key\'s covert rung) is WITHHELD in R3\'s host (212 _gallery_veil_roster_choices, twin applyRosterChoices): no served field re-derives it (town-indebted-0-16, town-wartime-0-19 served diffuse against a counterfactual null). R3-TELL-3 unit 4b (ruling 60; the chair\'s word of 20:03 UTC): a NON-criminal services row whose `institution` named a hidden house in a spelling the fold finds (the sweep took the key) LEAVES WHOLE in the same host, both engines: a husk (ruling 42 (1)); a row born without the key, or one whose `institution` named no hidden house, stays. R3-TELL-5 unit (ii) (ruling 73 (2): served as the house-free twin serves it; ruling 74 (ii)): where a house is hidden whole a CRIMINAL services row stays only BY POSITIVE ACCOUNT, in the same host, both engines: its `institution` a house the read lists, or the tag of a crime type a shown house or a crisis raises (VR39 over the record\'s own list; servicesGenerator.js writes each tag row from its type); every other row (the climate\'s \'(lawless)\', \'(informal)\') leaves; [] is an open place\'s form at every size (VR29: the list stays a list)';

/** @type {Readonly<Record<string, RegistrySite>>} */
export const REGISTRY_SITES = Object.freeze({
  'src/domain/coherence/hookTruth.js :: WORDS': { rx: 1, why: 'a hook\'s truth words over hook text, never house names; the hooks themselves are row safety.plotHooks' },
  'src/domain/conditionPromotion.js :: STRESSOR_ARCHETYPE_RULES': { rx: 1, why: 'over stressor names (criminal corridor, smuggling route), never a house name' },
  'src/domain/corruption.js :: isCriminalInstitution': { rx: 1, rows: ['ties.covertHandler', 'trace.criminalAllegiance', 'people.secret'], why: 'the registered predicate\'s own definition (category criminal)' },
  'src/domain/corruption.js :: rivalRingsOf': { rx: 1, rows: ['prose.criminal'] },
  'src/domain/crimeSignal.js :: crimeFactionNameOf': { rx: 1, rows: ['people.secret', 'cast.stakes'] },
  'src/domain/crimeSignal.js :: crimeHasThievesGuild': { rx: 1, rows: ['people.secret'] },
  'src/domain/crimeSignal.js :: crimeSignalOf': { rows: ['history.tension.crimeWave', 'history.event.crimeWave', 'people.entry', 'safety.crimeTypes'] },
  'src/domain/crimeSignal.js :: withTownsOwnUnderworld': { rx: 1, rows: ['people.secret', 'trace.criminalAllegiance'] },
  'src/domain/crimeSignal.js :: withoutCriminalGuild': { rx: 1, rows: ['people.secret'] },
  'src/domain/display/defenseDisplay.js :: PATTERN_DENIES_ORGANISATION': { rx: 1, rows: ['prose.criminal'] },
  'src/domain/display/defenseDisplay.js :: deriveCriminalStructure': { rows: ['prose.criminal'] },
  'src/domain/display/defenseDisplay.js :: ringNoteAmongRivalGangs': { rows: ['prose.criminal'] },
  'src/domain/display/defenseDisplay.js :: ringWithoutSeat': { rows: ['prose.criminal'] },
  'src/domain/display/guardLineUnderTheLaw.js :: safetyLineAsPrinted': { rows: ['safety.guardEffectivenessDesc', 'prose.posture.posture'] },
  'src/domain/display/tradeListDisplay.js :: MADE_GOOD_ROWS': { rx: 5, why: 'the trade list\'s made-good rows over the SERVED service rows at display; a hidden house\'s rows have left with it (X-21e); nothing stored' },
  'src/domain/dossier/powerSupport.js :: houseBacksOf': { rows: ['power.entry', 'power.share'] },
  'src/domain/factionArchetypes.js :: NAME_RULES': { rx: 1, rows: ['power.entry', 'power.composition'] },
  'src/domain/facts/criminalIncome.js :: criminalIncomeOf': { rows: ['income.criminalRow', 'income.percentage', 'prose.incomeMix'] },
  'src/domain/facts/criminalStructureKey.js :: THIEVES_GUILD_HOUSE': { rx: 1, rows: ['safety.crimeTypes', 'prose.criminal'] },
  'src/domain/facts/criminalStructureKey.js :: criminalStructureKeyOf': { rows: ['safety.crimeTypes', 'prose.criminal', 'safety.economicDragDesc'] },
  'src/domain/facts/criminalStructureKey.js :: ringHousesOf': { rx: 1, rows: ['safety.crimeTypes', 'prose.criminal'] },
  'src/domain/facts/factsOf.js :: factsOf': { rows: ['safety.economicDragDesc', 'safety.safetyDesc'] },
  'src/domain/facts/guild.js :: CRIMINAL_GUILD_RE': { rx: 1, why: 'keeps a criminal house OUT of the guild fact (namesGuild); the guild facts\' readers are rows compound.inst.flags and economy.complexity' },
  'src/domain/npcProfile.js :: CATEGORY_INSTITUTION_HINTS': { rx: 1, rows: ['people.card'] },
  'src/domain/npcProfile.js :: POWER_DOMAIN_HINTS': { rx: 1, rows: ['people.card', 'power.entry'] },
  'src/domain/npcProfile.js :: institutionsForCategory': { rows: ['people.card'] },
  'src/domain/people/allegiance.js :: assignHandlers': { rows: ['ties.covertHandler', 'trace.criminalAllegiance'] },
  'src/domain/people/allegiance.js :: criminalHousesOf': { rows: ['ties.covertHandler', 'trace.criminalAllegiance'] },
  'src/domain/people/allegiance.js :: dealAllegiances': { rows: ['ties.covertHandler', 'trace.criminalAllegiance', 'people.secret', 'people.allegiance'] },
  'src/domain/people/allegiance.js :: isCriminalPower': { rx: 1, rows: ['ties.covertHandler', 'trace.criminalAllegiance'] },
  'src/domain/people/allegiance.js :: organizedCrimeOf': { rows: ['ties.covertHandler', 'trace.criminalAllegiance'] },
  'src/domain/spatial/cohesionWeave.js :: FACET_INFERENCE': { rx: 1, rows: ['spatial.quarters'] },
  'src/domain/summary/settlementQuickGuide.js :: CRIMINAL_POWER': { rx: 1, why: 'the quick guide reads the SERVED powers at display; nothing stored or sent' },
  'src/domain/threatProfile.js :: TYPE_PATTERNS': { rx: 1, why: 'over threat type names (bandit raids), never a house name' },
  'src/generators/defenseGenerator.js :: computeDefenseScores': { rows: ['defence.scores.internal', 'defence.scores.economic', 'defence.scores.disaster', 'defence.scores.military', 'defence.readiness.score', 'defence.economicGates'] },
  'src/generators/defenseGenerator.js :: scaledPartsOfHouse': { rows: ['defence.readiness.score', 'defence.readiness.label'] },
  'src/generators/density/applyDensityLaw.js :: RIVAL_DESC_OF_HOST': { rx: 2, rows: ['institutions.desc'] },
  'src/generators/economy/economicState.js :: generateEconomicState': { rows: ['compound.criminalEffective', 'compound.criminalPreStress', 'compound.economyOutput', 'compound.inst.flags', 'compound.inst.names', 'economy.complexity'] },
  'src/generators/economy/foodBalance.js :: deriveFoodBalanceAnalysis': { rows: ['food.record.storageMonths', 'food.storageMonths', 'food.resilienceScore', 'food.storageNote'] },
  'src/generators/economy/localSupplyEvidence.js :: hasLocalAgriculturalSupply': { why: 'an agricultural name pattern (farms, granaries); no crime word, no criminal house answers it' },
  'src/generators/economy/prosperity.js :: computeBaseProsperity': { rows: ['economy.prosperity', 'economy.prosperityStanding'] },
  'src/generators/economy/prosperity.js :: labelFromBase': { rows: ['economy.prosperity', 'economy.prosperityStanding'] },
  'src/generators/economy/prosperity.js :: situationDescOf': { rows: ['economy.situationDesc'] },
  'src/generators/history/historyEventStrands.js :: generateSafetyNarrative2': { rows: ['history.siegeNarrative', 'history.event.description'] },
  'src/generators/historyGenerator.js :: buildHistoricalEvent': { rx: 1, rows: ['history.event.crimeWave', 'history.tension.crimeWave'] },
  'src/generators/npcGenerator.js :: computeNPCWeights': { rows: ['people.entry', 'people.card'] },
  'src/generators/npcGenerator.js :: mergeNPCLists': { rx: 2, rows: ['people.entry', 'people.card', 'people.secret'] },
  'src/generators/people/castPowers.js :: landMemberships': { rows: ['npcs.memberships.veiled', 'people.secret', 'cast.stakes'] },
  'src/generators/people/castPowers.js :: seatStressPowers': { rows: ['cast.stakes', 'cast.roles', 'cast.absent'] },
  'src/generators/people/goals.js :: goalContextOf': { rows: ['people.card'] },
  'src/generators/people/representatives.js :: dualHatHouseOf': { rows: ['people.card', 'people.entry'] },
  'src/generators/people/representatives.js :: generateRepresentatives': { rows: ['people.card', 'people.entry', 'npcs.memberships.veiled'] },
  'src/generators/people/representatives.js :: hasHouseOfKind': { rows: ['people.card'] },
  'src/generators/people/ties.js :: drawTies': { rows: ['people.ties', 'ties.covertHandler', 'people.prominentRelationship'] },
  'src/generators/power/conflicts.js :: generateConflicts': { rows: ['power.conflicts', 'power.recentConflict'] },
  'src/generators/power/rulingStructure.js :: captureClimateOf': { rows: ['power.relation.entry', 'power.relation.dmNote'] },
  'src/generators/power/rulingStructure.js :: generatePowerStructure': { rows: ['power.entry', 'power.share', 'power.stability', 'power.composition'] },
  'src/generators/power/stressFactions.js :: applyStressEventFactions': { rows: ['power.entry', 'power.composition'] },
  'src/generators/priorityHelpers.js :: getInstitutionNames': { rows: ['compound.inst.flags', 'compound.inst.names'] },
  'src/generators/priorityHelpers.js :: getStressFlags': { rows: ['conditions.severity', 'conditions.severityBand'] },
  'src/generators/safetyLineTruth.js :: BENEATH_THE_WALLS': { rx: 1, rows: ['safety.guardEffectivenessDesc', 'safety.safetyDesc'] },
  'src/generators/safetyLineTruth.js :: oneRingRules': { rows: ['safety.crimeTypes'] },
  'src/generators/safetyProfile.js :: generateSafetyProfile': { rx: 1, rows: SAFETY_ROWS },
  'src/generators/safetyProfile.js :: settleCrimeLinesOnly': { rows: ['safety.crimeTypes'] },
  'src/generators/safetyProfile.js :: settleCrimeLinesToSignal': { rows: ['safety.crimeTypes'] },
  'src/generators/services/serviceAvailability.js :: getServiceTierInfo': { why: SERVICES_WHY },
  'src/generators/services/serviceRollMaterialization.js :: materializeInstitutionServiceRolls': { why: SERVICES_WHY },
  'src/generators/servicesGenerator.js :: generateAvailableServices': { why: SERVICES_WHY },
  'src/generators/steps/assembleSettlement.js :: registerStep(assembleSettlement)': { rows: ['safety.crimeTypes'] },
  'src/generators/steps/generateNarratives.js :: registerStep(generateNarratives)': { why: 'reads getInstFlags(...).inst.hasPort only (the port reason): no crime flag' },
  'src/lib/entities.js :: INSTITUTION_KEYWORD_TAGS': { rx: 1, why: 'entity tags for the page\'s links over the SERVED houses at display; nothing stored' },
});
