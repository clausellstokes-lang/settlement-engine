/**
 * domain/display/stateProse/dossierMounts.js — TRAIN 1 car C2/C3: THE MOUNT REGISTRY,
 * and the room the one-fact-one-sentence law lives in.
 *
 * WHAT THIS IS. A hand-written table saying which corpus block renders at which POSITION
 * on which tab, and at which depth. It is the dossier's router. Nothing else in the
 * subsystem knows where a block goes.
 *
 * ── WHY A REGISTRY AND NOT `sectionTarget` ───────────────────────────────────────────
 * The corpus already carries a `sectionTarget` on 45 of its 68 blocks, and it cannot do
 * this job — not because it is dirty (25 of the 45 carry a string outside the tab
 * vocabulary, which is a parser defect and is repaired separately), but because of what
 * it MEANS. `sectionTarget: ['economics']` says the block belongs to the economics
 * conversation. It can never say WHERE IN EconomicsTab the block renders, and a page
 * layout is exactly the question "where". A block's SECTION is a property of the block;
 * a block's POSITION is a property of the page. Those are different facts with different
 * owners, and the second one has never had a home. This is the home.
 *
 * The causal register is the control that shows the distinction is real rather than
 * invented for this file: `causalFamiliesForSection` routes joins by section and is
 * legitimate, because a join's section genuinely IS a property of the join. A state
 * block has no equivalent claim, and the parser census proves it: the causal register is
 * 100 percent canonical over 155 targets, the state register is not, and both run through
 * the same parser. So `sectionTarget` is demoted to a DISCOVERY field and routes nothing.
 *
 * ── THE ROOM: ONE FACT, ONE SENTENCE (car C3) ────────────────────────────────────────
 * A block's SENTENCE rung renders at exactly ONE position per settlement page-set. Where
 * the same record appears at other positions, those positions render the GLANCE and the
 * DETAIL rungs and no sentence.
 *
 * THIS IS NOT A NEW LAW. economyStateProse.js already states it for the SURFACE/LADDER
 * pair (R-DST-A): "A composed page draws at most one of each and never both about the
 * same fact." C3 extends the same sentence from within-a-tab to across-the-page-set,
 * because the fact it protects is the same one. A settlement has ONE story about its
 * crime wave. `history.currentTensions` genuinely renders on three tabs today, so the
 * page already repeats the RECORD; repeating the record is coherent and printing three
 * different sentences about it is the machine improvising in front of the reader.
 *
 * AND IT NEEDS NO MECHANISM. No draw-key change, no rotation, no offset, nothing that
 * races the one-way door. The law is held STRUCTURALLY, in two places that cannot
 * disagree: `rung` is a field on every row, so a component can only be given the depth
 * its row names; and `sentenceMountForBlock` is the only way to ask where a fact speaks,
 * and it answers with at most one position or with nothing at all. The walker
 * (tests/lint/dossierMountRegistry.walker.test.js) refuses two sentence rows for one
 * block at build time, which is what makes the law enforced rather than intended.
 *
 * THE ONE WRITTEN EXCEPTION, so the next reader does not "repair" it. DS-GEN-6's tier
 * overlay is composed AFTER the route line and never instead of it, so that single mount
 * renders two sentences drawn from two POOLS of one block. That is one fact reading at
 * one position at one depth; it is not one fact speaking twice. The law is one SENTENCE
 * RUNG per block per page-set, and it is spelled that way on purpose.
 *
 * ── ⭐⭐ THE GENERAL TEST: A MEASUREMENT, OR A DEFAULT? ───────────────────────────────
 *
 * Every dead arm this subsystem has shipped was A DEFAULT WEARING A READING'S CLOTHES — a
 * filter that dropped the field it filtered on, a cap that read no subject, a consumer
 * reading keys no writer writes, four pools defaulting into an audience nobody stated. The
 * test that separates them, and it is sharper than "prove aliveness":
 *
 *   DORMANT IS A TRUE STATEMENT, NOT A FALLBACK.
 *   Ask whether the value a surface is about to print is a MEASUREMENT or a DEFAULT.
 *
 * Two rulings in this arc show the same shape resolving opposite ways, which is why the
 * test is worth stating rather than the verdicts:
 *   • `economicBase: mixed` — every key it derives from has NO WRITER, so
 *     `normalizeEconomicBase` always failed soft to `mixed`. Printing it would hand a reader
 *     a fail-soft default dressed as a reading. The lens was DROPPED and its pools declared
 *     dark. (DESK CAR 8.)
 *   • `layer DORMANT (no ledger materialized)` — the corpus WROTE a pool for the absent
 *     politics layer, and its prose is accurate about an unorganised hall. That is a
 *     measurement of an absence, not a guess at a presence. It was DRAWN. (DESK CAR 9.)
 *
 * ── ⭐ THE LABEL-TRAP RULE (three instances across two leaves) ───────────────────────
 * A producer's token and the corpus's word for the same thing are OFTEN NOT THE SAME
 * STRING, and the difference is silent:
 *   `indebted` labels "Indebted to Outside Power"; the pool is `INDEBTED TO AN OUTSIDE POWER`
 *   `religious_conversion` labels "Religious Conversion"; the pool is `RELIGIOUS CRISIS`
 *   `heartland` is the producer's tier; the corpus's family is `settled`
 * A route that reads the LABEL, or that works for most of a vocabulary and drops the rest,
 * is a DEFAULT WEARING A READING'S CLOTHES one layer up from the value.
 *   ⇒ KEY ON THE CANONICAL PRODUCER TOKEN, NEVER ON THE CORPUS WORD, AND ASSERT THE MAP
 *     TOTAL IN BOTH DIRECTIONS.
 * Measured cost of getting it wrong: the label route darkens 2 of 15 crisis banners, and it
 * does so without an error anywhere.
 *
 * The companion distinction, at the READ rather than the POOL: a mounted-but-unreachable
 * pool is a FINDING (declare it, pin it, name the one act that lights it); a read of a key
 * no writer produces is a DEFECT (remove it). They get different treatment.
 *
 * ── THE DENOMINATOR ──────────────────────────────────────────────────────────────────
 * `UNMOUNTED_BLOCKS` is the dark half, written down. Before this file the corpus's
 * darkness was a silence; here it is a number a gate can see, and it is SHRINK-ONLY, so
 * a desk car can only ever move a block from that list into a mount row. A block in
 * neither list reds the walker, so a new block cannot arrive unrouted and unnoticed.
 *
 * PURE, HEADLESS, FROZEN LEAF: no imports, no state, no clock, no RNG. Every string here
 * is an identifier the walker joins against a producer, never reader-facing prose.
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js
 */

/**
 * The two depths a mount may draw at. The third rung of the legibility ladder (DETAIL)
 * is not a mount choice: a detail is rows, not a draw, so every mount may render one.
 * @type {Readonly<Record<string, string>>}
 */
export const MOUNT_RUNGS = Object.freeze({
  /** The position that speaks. At most one per block per page-set, by the law above. */
  SENTENCE: 'sentence',
  /** Every other position the same record appears at. Band word and rows, no sentence. */
  GLANCE: 'glance',
});

/**
 * One mount row.
 * @typedef {object} DossierMount
 * @property {string} mount the position id, spelled `<tab>.<position>`
 * @property {string} tab the tab id, a case label of OutputContainer's own `renderTab`
 * @property {string} desk the corpus leaf under src/data/dossierStateProse
 * @property {string} blockId the corpus block that renders here
 * @property {string} rung a value of MOUNT_RUNGS
 * @property {ReadonlyArray<string>} [dimensions] the demoted STATE dimensions this mount
 *   undertakes to answer. NOT the guard: the kernel derives the truth from the pool it is
 *   already holding (`poolDimensions`), and a registry a desk author must remember to
 *   fill would be a guard against a defect of ignorance written by someone who already
 *   knows. This is a DECLARATION OF INTENT the walker cross-checks against the corpus, so
 *   a mount over a dimension-bearing block that names no dimension reds at build time
 *   instead of going silently prose-less in front of a reader.
 */

/**
 * THE REGISTRY. It was empty at birth, and that was the honest state rather than a
 * shortfall: no desk had landed, so no component carried a position, and a row naming a
 * position that does not exist would have been the registry drifting into fiction on its
 * first day. Every desk car adds its rows and strikes the same blocks from
 * UNMOUNTED_BLOCKS in the SAME commit, and the walker holds both halves to each other.
 *
 * ── DESK CAR 1: THE ECONOMY DESK, THE FIRST FIVE POSITIONS BELOW ─────────────────────
 * `economyStateProse.js` was the only desk that existed when this table was born, so its
 * four blocks were the only four the tree could honestly route. A mount needs a desk to
 * turn live state into a pool key, and a row without one would name a position no
 * component could draw.
 *
 * ── DESK CAR 2: THE POWER DESK, THE SIXTH POSITION ───────────────────────────────────
 * `powerStateProse.js` adds `power.legitimacyBanner` (DS-POW-1), `power.stabilityHeader`
 * (DS-POW-2), `power.criminalUnderside` (DS-POW-6), `power.succession` (DS-POW-4) and
 * `power.factionLadder` (DS-POW-3), `power.rulingStructure` (DS-POW-5) and `power.blocs`
 * (DS-POW-7) — which completes the `power` leaf, the first leaf fully mounted — each taking
 * its block out of the dark list in the same
 * commit. ⚠ `power.factionLadder` is the first PER-FACTION position: it renders once per
 * faction inside the roster loop, which is still ONE position on the page-set — the row
 * says where the ladder speaks, not how many ladders a town has. Four of the
 * six desks remain unwritten; the count below is the authority on the dark number, not
 * this comment.
 *
 * ⚠ THAT ONE ROW READS TWO POOLS OF ITS BLOCK, and it is the C3 law rather than an
 * exception to it. DS-POW-1's eleven pools are three LENSES over one legitimacy record —
 * the band ladder, the breakdown dominance, and the fracture flag — and the banner draws
 * the ladder line with one of the other two underneath it, at one position, at one depth.
 * The law is one SENTENCE RUNG per block per page-set and is spelled that way on purpose;
 * DS-GEN-6's tier overlay below is the same shape. `powerStateProse.js` carries the
 * measurement showing why the lens ordering is load-bearing: reversed, it would make one
 * of the eleven pools unreachable in every world the generator can build.
 *
 * WHY ONLY TWO OF THE FIVE SPEAK. R-DST-A — a composed page draws at most one of the
 * SURFACE/LADDER pair and never both about the same fact:
 *   • PROSPERITY. DS-ECO-1 (the rung read against the approach) speaks in the header,
 *     which has paragraph room. DS-ECO-8 (the rung alone) therefore GLANCES on its tile;
 *     a second prosperity sentence a few inches below the first is the page contradicting
 *     itself about one fact. DS-ECO-8's speaking position is owed to another page-set
 *     position, not to this tab.
 *   • FOOD. DS-ECO-9 (the food-security ladder) speaks in the Food Security section.
 *     DS-ECO-2 (the at-a-glance tiles) therefore glances at BOTH of its positions — which
 *     car C3 would require in any case, since one block may draw its sentence rung at one
 *     position and the food tile and the season tile are two.
 * @type {ReadonlyArray<DossierMount>}
 */
export const DOSSIER_MOUNTS = Object.freeze([
  Object.freeze({
    mount: 'economics.prosperityHeader', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'economics.economyTile', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-8', rung: 'glance',
  }),
  Object.freeze({
    mount: 'economics.foodTile', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-2', rung: 'glance',
  }),
  Object.freeze({
    mount: 'economics.seasonTile', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-2', rung: 'glance',
  }),
  Object.freeze({
    mount: 'economics.foodSecurity', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-9', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'power.legitimacyBanner', tab: 'power', desk: 'power', blockId: 'DS-POW-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'power.stabilityHeader', tab: 'power', desk: 'power', blockId: 'DS-POW-2', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'power.criminalUnderside', tab: 'power', desk: 'power', blockId: 'DS-POW-6', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'power.succession', tab: 'power', desk: 'power', blockId: 'DS-POW-4', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'power.factionLadder', tab: 'power', desk: 'power', blockId: 'DS-POW-3', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'power.rulingStructure', tab: 'power', desk: 'power', blockId: 'DS-POW-5', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'power.blocs', tab: 'power', desk: 'power', blockId: 'DS-POW-7', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.crisisBanners', tab: 'overview', desk: 'stressors', blockId: 'DS-STR-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.activeConditions', tab: 'overview', desk: 'stressors', blockId: 'DS-CND-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.stressorLifecycle', tab: 'overview', desk: 'stressors', blockId: 'DS-STR-2', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'defense.publicOrder', tab: 'defense', desk: 'defense', blockId: 'DS-DEF-3', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'defense.threatAssessment', tab: 'defense', desk: 'defense', blockId: 'DS-DEF-2', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'defense.armedForces', tab: 'defense', desk: 'defense', blockId: 'DS-DEF-5', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'defense.postureHeader', tab: 'defense', desk: 'defense', blockId: 'DS-DEF-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'defense.militaryStatus', tab: 'defense', desk: 'defense', blockId: 'DS-DEF-8', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'defense.wallRationale', tab: 'defense', desk: 'defense', blockId: 'DS-DEF-11', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'defense.criminalStructure', tab: 'defense', desk: 'defense', blockId: 'DS-DEF-4', rung: 'sentence',
  }),
]);

/**
 * The blocks the registry has not mounted yet: the corpus's darkness, as a number.
 *
 * ORDER IS MACHINE-CHECKED, not decorative — desk name ascending, then each leaf's own
 * block order. A hand-sorted list drifts and then nobody can tell an insertion from a
 * reordering in a diff, so the walker asserts the order rather than a comment claiming it.
 *
 * SHRINK-ONLY. The walker refuses growth against the committed baseline, so a block can
 * leave this list and never join it. A NEW corpus block therefore cannot be parked here:
 * it must be mounted, or the walker reds and someone has to say why in writing.
 * @type {ReadonlyArray<string>}
 */
export const UNMOUNTED_BLOCKS = Object.freeze([
  'DS-DEF-6', 'DS-DEF-7',
  'DS-DEF-9', 'DS-DEF-10',
  'DS-ECO-3', 'DS-ECO-4',
  'DS-ECO-5', 'DS-SUP-1', 'DS-ECO-6', 'DS-ECO-7',
  'DS-SUP-2', 'DS-ECO-10',
  'DS-ECO-11', 'DS-ECO-12', 'DS-SUP-3',
  'DS-POP-1', 'DS-POP-2', 'DS-GEN-1', 'DS-GEN-2',
  'DS-GEN-3', 'DS-GEN-5', 'DS-GEN-6', 'DS-GEN-7',
  'DS-GEN-8', 'DS-REL-1', 'DS-REL-2', 'DS-GEN-9',
  'DS-GEN-10', 'DS-HK-1', 'DS-GEN-11', 'DS-GEN-12',
  'DS-GEN-13', 'DS-GEN-14', 'DS-POP-3', 'DS-GEN-15',
  'DS-GEN-16', 'DS-GEN-17', 'DS-GEN-18',
  'DS-WAR-1', 'DS-WAR-2', 'DS-WAR-3', 'DS-WAR-4',
  'DS-WAR-5', 'DS-FTH-1', 'DS-FTH-2', 'DS-FTH-3',
  'DS-FTH-4',
]);

/**
 * What renders at one position. THE ROUTER READ: a component knows its own mount id and
 * asks the registry what belongs there, rather than a desk telling a tab where to put it.
 * @param {string} mount
 * @returns {DossierMount|null} the row, or null when nothing is mounted there
 */
export function mountById(mount) {
  if (typeof mount !== 'string' || mount === '') return null;
  return DOSSIER_MOUNTS.find((row) => row.mount === mount) || null;
}

/**
 * Every position one tab carries, in declared order. The order is the page's, which is
 * why the registry is an array and not a map: a map would lose it, and would also let a
 * duplicate position overwrite its twin in silence instead of reddening.
 * @param {string} tab
 * @returns {ReadonlyArray<DossierMount>}
 */
export function mountsForTab(tab) {
  if (typeof tab !== 'string' || tab === '') return Object.freeze([]);
  return Object.freeze(DOSSIER_MOUNTS.filter((row) => row.tab === tab));
}

/**
 * WHERE THIS FACT SPEAKS — the runtime half of the one-fact-one-sentence law, and the
 * only way to ask the question.
 *
 * FAIL-CLOSED ON A CONTRADICTION, deliberately, on the kernel's own law 5 reasoning: if
 * two positions claim the sentence for one block the registry is contradictory, and a
 * contradiction has no safe reading. Returning "the first one" would pick a winner by
 * array order, which is the silent-wrong-answer shape this whole subsystem is built to
 * refuse. Silence is the safe failure and R-DST-K already means silence. The walker reds
 * on the same state at build time, so this arm is the belt behind that brace and should
 * never fire in a shipped tree.
 * @param {string} blockId
 * @returns {DossierMount|null} the one position that speaks, or null
 */
export function sentenceMountForBlock(blockId) {
  if (typeof blockId !== 'string' || blockId === '') return null;
  const speaking = DOSSIER_MOUNTS.filter(
    (row) => row.blockId === blockId && row.rung === MOUNT_RUNGS.SENTENCE,
  );
  return speaking.length === 1 ? speaking[0] : null;
}

/**
 * WHAT THIS POSITION MAY SHOW — the router read a component actually performs.
 *
 * A component holds a rung its desk built and asks the registry HOW DEEP it may draw
 * here. It never decides its own depth: flip a row from `glance` to `sentence` in the
 * table above and that position starts speaking with no edit at the call site, which is
 * the whole difference between a component that ROUTES and one that merely names a
 * string. The walker's reachability arm can only see that a mount id appears once under
 * src/components; this function is what makes that appearance a draw rather than a
 * citation.
 *
 * A GLANCE position keeps its band word and its rows and loses the sentence AND its
 * provenance — the provenance describes a line that is not being printed, and a surface
 * carrying the trail of a sentence it did not draw is the false-report shape.
 *
 * UNMOUNTED IS SILENCE, not a fallback to speech: a position with no row renders nothing
 * at all, which is R-DST-K, and is why this returns null rather than the rung unchanged.
 * @param {string} mount
 * @param {{glance: string, sentence: string|null, detail: ReadonlyArray<{label: string, value: string}>, provenance: object|null}|null|undefined} rung
 * @returns {object|null}
 */
export function drawnAtMount(mount, rung) {
  const row = mountById(mount);
  if (!row || !rung) return null;
  if (row.rung === MOUNT_RUNGS.SENTENCE) return rung;
  return Object.freeze({ ...rung, sentence: null, provenance: null });
}
