/**
 * scripts/lib/table-pools.mjs — THE OFF-CENSUS TABLE POOLS the wiring census enrols as `tablePools`
 * (CENSUS-1g unit 5, `docs/DESIGN_POOL_CENSUS.md` §3.5 "The wiring census, extended").
 *
 * One entry per pool outside the state corpus: the live export the census walks (`module` ::
 * `name`, an optional `lines` accessor where the table holds more than its printed lines), the
 * draw kind and site (from the lane ledgers, `docs/census/declarations/`), and the POOL rulings
 * (`colour`, `crisis-scoped` — the words of `factVocabulary.js :: POOL_RULINGS`, the same `colour`
 * a line takes since R-AO; never a marker of a lane's own). A table's lines declare in place
 * (`{ text, needs?, excludes?, crisis?, twinOf? }`, or `{ text, colour: true }`).
 *
 * Seeded from the 57 ledgers whose table is a live export (prose tables only: the trade and
 * resource catalogues, the dead causal register, the connectives — unit 7 — and the duplicated
 * `hooks.*` copies are left out), plus CENSUS-5c's off-census `{colour}` list where its table is
 * one export. A table that is no export, or a pool assembled inline, is not enrolled here (the lane
 * doc lists them).
 */
export const TABLE_POOLS = Object.freeze([
  { id: 'ARRIVAL_MEMORIES', module: 'src/data/arrivalProse.js', name: 'ARRIVAL_MEMORIES', drawKind: 'R', drawSite: 'src/generators/narrative/arrivalScene.js:183-191 chooseClosing (memory key) then :293 one pickRandom (NO agreeingLine fi' },
  { id: 'ARRIVAL_PEOPLE', module: 'src/data/arrivalProse.js', name: 'ARRIVAL_PEOPLE', drawKind: 'R', drawSite: 'src/generators/narrative/arrivalScene.js:288-289 agreeingLine (pickRandom, one redraw on a market/catch contradiction); ' },
  { id: 'ARRIVAL_SCENES', module: 'src/data/narrativeData.js', name: 'ARRIVAL_SCENES', drawKind: 'R', drawSite: 'src/generators/narrative/arrivalScene.js:216-228 (sceneKey from route/terrain/market fragments, then one pickRandom on t' },
  { id: 'ARRIVAL_SENSES', module: 'src/data/arrivalProse.js', name: 'ARRIVAL_SENSES', drawKind: 'R', drawSite: 'src/generators/narrative/arrivalScene.js:150-165 chooseSense (pickRandom over keys within one point of best) then :283-2' },
  { id: 'ARRIVAL_TENSIONS', module: 'src/data/arrivalProse.js', name: 'ARRIVAL_TENSIONS', drawKind: 'R', drawSite: 'src/generators/narrative/arrivalScene.js:173-197 chooseClosing (key) then :293 one pickRandom (NO agreeingLine filter); ' },
  { id: 'HOOK_LINE_POOLS', module: 'src/domain/dossier/hookLines.js', name: 'HOOK_LINE_POOLS', drawKind: 'H', drawSite: 'src/domain/dossier/hookLines.js:190-214 createConflictHookDraw (fnv1a32(`${a}>${b}::${issue}::${family}`) base, then +1 ' },
  { id: 'LINE_ROLE_CLAUSE', module: 'src/domain/crisis/crisisHooks.js', name: 'LINE_ROLE_CLAUSE', drawKind: 'T', drawSite: 'src/domain/crisis/crisisHooks.js:184-187 lineRoleHolderOf → LINE_ROLE_CLAUSE[holder.role](holderWords) → castSentence → ' },
  { id: 'POLITICAL_FLAVOR', module: 'src/generators/narrativeText.js', name: 'POLITICAL_FLAVOR', drawKind: 'R', drawSite: 'src/generators/narrative/historyCoherence.js:44-84 stressProfileDrawn → pickRandom2(POLITICAL_FLAVOR[pattern])(subset) →' },
  { id: 'PRESSURE_SENTENCES', module: 'src/generators/narrativeText.js', name: 'PRESSURE_SENTENCES', drawKind: 'R', drawSite: 'src/generators/narrativeGenerator.js:790-797 generatePressureSentence → filter(defenseWordsFindings) → pickRandom2' },
  { id: 'STRESSOR_SPINE_PHRASES', module: 'src/data/stressorSpinePhrases.js', name: 'STRESSOR_SPINE_PHRASES', drawKind: 'T', drawSite: 'src/domain/simulationSpine.js:374-402 strainPhraseOf / fearPhraseOf → STRESSOR_SPINE_PHRASES[type].strain|fear' },
  { id: 'STRESS_DESCS', module: 'src/data/narrativeData.js', name: 'STRESS_DESCS', drawKind: 'R', drawSite: 'src/generators/narrative/arrivalScene.js:213-227 (primary stress; filter at :224; one pickRandom at :227 on the ’arrival' },
  { id: 'TERRAIN_SEASON_TEXTURE', module: 'src/data/biomeTexture.js', name: 'TERRAIN_SEASON_TEXTURE', drawKind: 'T', drawSite: 'src/domain/briefs/roadScene.js:143 biomeSeasonTexture(terrainClass, season) (src/data/biomeTexture.js:117)' },
  { id: 'crisisCast.CAST_ABSENCES', module: 'src/domain/crisis/crisisCast.js', name: 'CAST_ABSENCES', drawKind: 'T', drawSite: 'crisisCast.js:461-701' },
  { id: 'crisisCast.CAST_REASONS', module: 'src/domain/crisis/crisisCast.js', name: 'CAST_REASONS', drawKind: 'T', drawSite: 'crisisCast.js:461-701 (src/domain/crisis/crisisCast.js)' },
  { id: 'crisisCast.STAKE_REASONS', module: 'src/domain/crisis/crisisCast.js', name: 'STAKE_REASONS', drawKind: 'T', drawSite: 'crisisCast.js:461-701' },
  { id: 'hooks.HISTORY_EVENT_HOOKS', module: 'src/data/historyData.js', name: 'HISTORICAL_EVENTS_DATA', drawKind: 'R', drawSite: '', lines: (t) => t.map((e) => e.plotHooks || []) },
  { id: 'institutionDescVariants.INSTITUTION_DESC_VARIANTS', module: 'src/data/institutionDescVariants.js', name: 'INSTITUTION_DESC_VARIANTS', drawKind: 'H', drawSite: 'assembleInstitutions.js:65 shipFreeDesc + :1004 kernel/proseHash.js pickVariant over [catalogDesc, ...variants]' },
  { id: 'institutionServices.INSTITUTION_SERVICES', module: 'src/data/institutionServices.js', name: 'INSTITUTION_SERVICES', drawKind: 'R', drawSite: 'services/institutionServices.js:69/203 one _rng()<p roll per eligible definition (A-printed at serviceRollMaterializatio' },
  { id: 'marketPrices.CRIER_FRAMES', module: 'src/domain/display/marketPrices.js', name: 'CRIER_FRAMES', drawKind: 'H', drawSite: '' },
  { id: 'marketPrices.MOVEMENTS', module: 'src/domain/display/marketPrices.js', name: 'MOVEMENTS', drawKind: 'T', rulings: ['crisis-scoped'], drawSite: '' },
  { id: 'npcData.MANNERISMS', module: 'src/data/npcData.js', name: 'MANNERISMS', drawKind: 'R', rulings: ['colour'], drawSite: 'npcGenerator.js:323 → hookVariety.js:93 drawUnique' },
  { id: 'npcData.NPC_AGE_DATA', module: 'src/data/npcData.js', name: 'NPC_AGE_DATA', drawKind: 'R', rulings: ['colour'], drawSite: 'npcGenerator.js:353 pickFromArray ×2' },
  { id: 'npcData.NPC_BUILDS', module: 'src/data/npcData.js', name: 'NPC_BUILDS', drawKind: 'R', rulings: ['colour'], drawSite: 'npcGenerator.js:354 pickFromArray' },
  { id: 'npcData.NPC_DEALING_BY_TRAIT', module: 'src/data/npcData.js', name: 'NPC_DEALING_BY_TRAIT', drawKind: 'T', drawSite: 'npcGenerator.js:552 dealingLineFor(disposition, personality) → NPC_DEALING_BY_TRAIT[disposition][DEALING_TRAIT_FAMILY[trait]] (draw-free; SW-7 B10(b), POWER-SIDE §7)' },
  { id: 'npcData.NPC_CRIMINAL_SECRETS', module: 'src/data/npcData.js', name: 'NPC_CRIMINAL_SECRETS', drawKind: 'R', drawSite: 'factionLeaderSecret.js:89 weighted type roll + :110 pickFromArray(eligiblePool)' },
  { id: 'npcData.NPC_FACTION_GOALS', module: 'src/data/npcData.js', name: 'NPC_FACTION_GOALS', drawKind: 'R', drawSite: 'npcGenerator.js:613 pickFromArray (keyed by role; reached only if the stress-goal roll at :608 fails)' },
  { id: 'npcData.NPC_FACTION_LOYALTY', module: 'src/data/npcData.js', name: 'NPC_FACTION_LOYALTY', drawKind: 'R', drawSite: 'npcGenerator.js:659/683/687 drawLoyalty → drawUnique (NPC plot-hook titles, keyed by category)' },
  { id: 'npcData.NPC_FEATURES', module: 'src/data/npcData.js', name: 'NPC_FEATURES', drawKind: 'R', rulings: ['colour'], drawSite: 'npcGenerator.js:355 pickFromArray' },
  { id: 'npcData.NPC_PERSONALITY_TRAITS', module: 'src/data/npcData.js', name: 'NPC_PERSONALITY_TRAITS', drawKind: 'R', rulings: ['colour'], drawSite: 'npcGenerator.js:316-318 pickFromArray' },
  { id: 'npcData.NPC_PLOT_HOOKS', module: 'src/data/npcData.js', name: 'NPC_PLOT_HOOKS', drawKind: 'R', rulings: ['colour'], drawSite: 'npcGenerator.js:692 pick (impressions keyed by category)' },
  { id: 'npcData.NPC_PLOT_HOOKS_DATA', module: 'src/data/npcData.js', name: 'NPC_PLOT_HOOKS_DATA', drawKind: 'T', rulings: ['colour'], drawSite: 'npcGenerator.js:696 (by disposition)' },
  { id: 'npcData.NPC_PRESENTATION_MODES', module: 'src/data/npcData.js', name: 'NPC_PRESENTATION_MODES', drawKind: 'R', rulings: ['colour'], drawSite: 'npcGenerator.js:844-846 pickRandom2' },
  { id: 'npcData.NPC_SECRETS', module: 'src/data/npcData.js', name: 'NPC_SECRETS', drawKind: 'R', drawSite: 'npcGenerator.js:627 pickFromArray (goal fallback by category)' },
  { id: 'npcData.NPC_WANTS', module: 'src/data/npcData.js', name: 'NPC_WANTS', drawKind: 'R', drawSite: 'npcGenerator.js:356 pickFromArray' },
  { id: 'npcData.SPEECH_PATTERNS', module: 'src/data/npcData.js', name: 'SPEECH_PATTERNS', drawKind: 'R', rulings: ['colour'], drawSite: 'npcGenerator.js:324 → hookVariety.js:93 drawUnique' },
  { id: 'npcData.STRESS_ECONOMIC_EFFECTS', module: 'src/data/npcData.js', name: 'STRESS_ECONOMIC_EFFECTS', drawKind: 'H', drawSite: 'relationshipArchetypes.js:138 createTieProseDraw (fnv, without replacement); archetype chosen by relationshipArchetypes.' },
  { id: 'stressInstitutionEffects.STRESS_INSTITUTION_EFFECTS', module: 'src/data/stressInstitutionEffects.js', name: 'STRESS_INSTITUTION_EFFECTS', drawKind: 'R', drawSite: 'npcGenerator.js:778-780 pickRandom2 (keyed by stress kind; secretsHeldByFoodRecord pre-filter; {npc} is the other-NPC sl' },
  { id: 'tonightSheet.CAST_WANTS', module: 'src/domain/summary/tonightSheet.js', name: 'CAST_WANTS', drawKind: 'H', drawSite: 'tonightSheet.js:98-102 castWantOf: pool[floor(castHash(personId, crisis, role) * n)] (no rng draw), called at :324' },
  { id: 'traditions.TRADITION_ACTS', module: 'src/data/traditionCorpus.js', name: 'TRADITION_ACTS', drawKind: 'R', rulings: ['colour'], drawSite: '' },
  { id: 'traditions.TRADITION_ELEMENTS', module: 'src/data/traditionCorpus.js', name: 'TRADITION_ELEMENTS', drawKind: 'R', drawSite: '' },
  { id: 'traditions.TRADITION_EPITHETS', module: 'src/data/traditionCorpus.js', name: 'TRADITION_EPITHETS', drawKind: 'R', drawSite: '' },
  { id: 'traditions.TRADITION_NAMING', module: 'src/data/traditionCorpus.js', name: 'TRADITION_NAME_TEMPLATES', drawKind: 'R', rulings: ['colour'], drawSite: '' },
  { id: 'traditions.TRADITION_PROSE', module: 'src/data/traditionProse.js', name: 'TRAD_HELD_SUMMARY', drawKind: 'H', rulings: ['colour'], drawSite: '' },
  { id: 'traditions.TRADITION_TRAPPINGS', module: 'src/data/traditionCorpus.js', name: 'TRADITION_TRAPPINGS', drawKind: 'R', drawSite: '' },  // CENSUS-5c's off-census {colour} list (R-R, its lane doc): the tables that are one export.
  { id: 'powerSupport.ALIGNED_BASIS', module: 'src/domain/dossier/powerSupport.js', name: 'ALIGNED_BASIS', drawKind: 'T', rulings: ['colour'], drawSite: 'powerSupport.js alignedBasisOf (Appendix B row 92)' },
  { id: 'threatDefensePolicy.DEFENSE_PREFERENCES', module: 'src/generators/threatDefensePolicy.js', name: 'DEFENSE_PREFERENCES', drawKind: 'T', rulings: ['colour'], drawSite: 'threatDefensePolicy.js (catalogue names)' },
  { id: 'faithPanelModel.CAUSE_SENTENCE', module: 'src/components/settlement/faithPanelModel.js', name: 'CAUSE_SENTENCE', drawKind: 'T', rulings: ['colour'], drawSite: 'faithPanelModel.js (cause-keyed)' },
  { id: 'faithPanelModel.STRUCTURAL_LABEL', module: 'src/components/settlement/faithPanelModel.js', name: 'STRUCTURAL_LABEL', drawKind: 'T', rulings: ['colour'], drawSite: 'faithPanelModel.js (axis-keyed)' },
  { id: 'faithPanelModel.FALL_SENTENCE', module: 'src/components/settlement/faithPanelModel.js', name: 'FALL_SENTENCE', drawKind: 'T', rulings: ['colour'], drawSite: 'faithPanelModel.js (axis-keyed)' },
  // CENSUS-5d unit 3: the two left of CENSUS-5c's list that are one export (R-R, read by 5c and re-read here).
  { id: 'warRemembrance.WAR_ENDING_TELLINGS', module: 'src/domain/display/warRemembrance.js', name: 'WAR_ENDING_TELLINGS', drawKind: 'T', rulings: ['colour'], drawSite: 'warRemembrance.js (ending-keyed by the record\'s classifier)' },
  { id: 'deityEffects.DEITY_AXIS_EFFECTS', module: 'src/domain/display/deityEffects.js', name: 'DEITY_AXIS_EFFECTS', drawKind: 'T', rulings: ['colour'], drawSite: 'deityEffects.js (axis-keyed)', lines: (t) => Object.values(t).flatMap((axis) => Object.values(axis).map((e) => e.effect)) },
]);

/**
 * THE DECLARATION CHANNELS HELD BESIDE A TABLE (CENSUS-1i unit 2, `tablePools`' second half; the
 * chair's acceptance in block k): every sibling set keyed by its original's text and every
 * declaration column keyed by a line's text. The walker (`census-declared.mjs :: tablePoolRow`)
 * reads each enrolled table's lines through all of them — a text is a key of at most one table's
 * channel, so one list serves every table. The walker test holds this list equal to every
 * `*_SIBLINGS` / `*_DECLARATIONS` export in `src`, less the ones ruled out by name below.
 */
export const DECLARATION_CHANNELS = Object.freeze([
  { module: 'src/data/factionLabelSiblings.js', name: 'FACTION_LABEL_SIBLINGS', kind: 'siblings' },
  { module: 'src/data/institutionDescVariants.js', name: 'DESC_VARIANT_SIBLINGS', kind: 'siblings' },
  { module: 'src/data/institutionDescVariants.js', name: 'DESC_VARIANT_DECLARATIONS', kind: 'column' },
  { module: 'src/data/institutionDescColour.js', name: 'DESC_VARIANT_COLOUR_DECLARATIONS', kind: 'column' }, // CENSUS-4h unit 4: R-AO's colour marks
  { module: 'src/data/institutionServices.js', name: 'SERVICE_DESC_SIBLINGS', kind: 'siblings' },
  { module: 'src/data/npcData.js', name: 'NPC_HOOK_SIBLINGS', kind: 'siblings' },
  { module: 'src/data/powerData.js', name: 'FACTION_NAME_SIBLINGS', kind: 'siblings' },
  { module: 'src/data/powerSiblings.js', name: 'BASELINE_CONFLICT_SIBLINGS', kind: 'siblings' },
  { module: 'src/data/powerSiblings.js', name: 'FACTION_DESC_SIBLINGS', kind: 'siblings' },
  { module: 'src/data/stressTypes.js', name: 'STRESS_TYPE_SIBLINGS', kind: 'siblings' },
  { module: 'src/data/stressorSpinePhrases.js', name: 'STRESSOR_SPINE_SIBLINGS', kind: 'siblings' },
  { module: 'src/domain/activeConditions.js', name: 'CONDITION_ARCHETYPE_SIBLINGS', kind: 'siblings' },
  { module: 'src/domain/crisis/crisisCast.js', name: 'CAST_REASON_SIBLINGS', kind: 'siblings' },
  { module: 'src/domain/crisis/crisisCast.js', name: 'CAST_CRISIS_SIBLINGS', kind: 'siblings' },
  { module: 'src/domain/hookEscalation.js', name: 'HOOK_ESCALATION_SIBLINGS', kind: 'siblings' },
  { module: 'src/domain/rulingPower.js', name: 'RULING_POWER_SIBLINGS', kind: 'siblings' },
  { module: 'src/domain/summary/settlementQuickGuide.js', name: 'QUICK_GUIDE_SIBLINGS', kind: 'siblings' },
  { module: 'src/domain/threatProfile.js', name: 'THREAT_TEXT_SIBLINGS', kind: 'siblings' },
  { module: 'src/generators/economy/foodBalance.js', name: 'OUTLOOK_HOOK_SIBLINGS', kind: 'siblings' },
  { module: 'src/generators/economy/prosperity.js', name: 'PROSPERITY_LINE_SIBLINGS', kind: 'siblings' }, // COHERENCE-AGREE: the market lines' twins
  { module: 'src/generators/narrativeText.js', name: 'POLITICAL_FLAVOR_SIBLINGS', kind: 'siblings' },
  { module: 'src/generators/npcGenerator.js', name: 'NPC_GOAL_SIBLINGS', kind: 'siblings' },
  { module: 'src/generators/safetyProfile.js', name: 'SAFETY_LINE_SIBLINGS', kind: 'siblings' },
  { module: 'src/generators/stressNarrative.js', name: 'STRESS_SUMMARY_SIBLINGS', kind: 'siblings' },
]);

/** The `*_SIBLINGS` / `*_DECLARATIONS` exports that are no text-keyed channel of a table, each with its reason. */
export const NOT_TABLE_CHANNELS = Object.freeze({
  DOSSIER_CONNECTIVE_DECLARATIONS: 'a list PARALLEL to each connective list, read by position (CENSUS-1h unit 7); the connectives are state-corpus joints, not an enrolled table',
  FIELD_DECLARATIONS: 'the edit cards\' field declarations (domain/edit), not prose',
  TENSION_TEMPLATE_DECLARATIONS: 'keyed by the tension template\'s TYPE beside the selection (CENSUS-1g unit 4); the history templates are not an enrolled table',
});
