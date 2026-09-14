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
 * ── ⛔⛔ THE FIRST-PAINT LAW: A LIT SENTENCE A READER CANNOT SEE IS DARK ──────────────
 * A mount is not a position until a reader reaches it. `Primitives.jsx:114` (and
 * `Collapsible` at :83) render a closed section as `{open && <div>{children}</div>}` — a
 * collapsed host emits NO BYTES AT ALL, not hidden ones. So a SENTENCE row drawn inside a
 * `collapsible` host that is not open on first paint is lit in this table and dark on the
 * page, and every instrument this subsystem owns is green over it: the reachability arm
 * sees the literal, the public-dossier guard sees the gate, the desk builds the rung and
 * the DOM carries nothing.
 *
 * IT IS NOT HYPOTHETICAL AND IT WAS NOT NOTICED — IT WAS WORKED AROUND, TWICE, IN WRITING.
 * `tests/ui/defenseTabFlow.test.js`'s own docblock records the fold and answers it with an
 * `openSection()` click helper; `tests/ui/economicsTabFlow.test.js` records it and answers
 * it by choosing a fixture that carries a real deficit so the fold opens. Both arms went
 * green; both readers stayed dark. A cure that lives in the test fixture is not a cure.
 *
 * THE LAW. Every `sentence` row draws where a reader can see it on first paint, or the row
 * says `visibility: 'closed-section'` and carries the argument for it. `defaultOpen={false}`
 * is shut for everybody; a DATA-DEPENDENT `defaultOpen={<expr>}` is shut for every world on
 * the wrong side of the cut, which is the same defect on those towns — measured, DS-ECO-6
 * was reaching 1 town in 60 that way. Enforced by the VISIBILITY arm in the walker, which
 * follows each mount from its id through its carrier variables to every JSX site that draws
 * it and out of that component to everywhere the component is rendered.
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
 * @property {string} [visibility] the written exemption from the FIRST-PAINT LAW above, and
 *   the only one. Its one legal value is `'closed-section'`.
 *
 *   A SENTENCE row whose draw sits inside a `collapsible` host that is not open on first
 *   paint reds the visibility arm, because `Primitives.jsx:114` renders `{open &&
 *   children}`: a collapsed host produces NO BYTES and the position is lit in the registry
 *   and dark to every reader. A row may declare instead of moving, and then it OWES a
 *   `visibilityReason`. The arm is TWO-SIDED: a row declaring this whose host is actually
 *   open reds too, so the exemption cannot outlive the layout that earned it.
 *
 *   ⚠ SPELLED AS `string` AND NOT AS THE LITERAL TYPE, DELIBERATELY. `rung` above is typed
 *   the same way for the same reason: `Object.freeze()` on an object literal widens a
 *   string literal to `string`, so a literal-union annotation would be unassignable. The
 *   walker holds the vocabulary; the type does not pretend to.
 * @property {string} [visibilityReason] why this position is allowed to sit inside a fold.
 *   It must be a real argument, not a token (the arm holds it to a length), and the only
 *   argument that has passed is that the DATUM the sentence stands beside is inside the
 *   SAME fold, so the page never prints a fact and hides the sentence about it.
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
 *     itself about one fact. DS-ECO-8's speaking position was owed to another page-set
 *     position and is PAID at `daily_life.standingOfLiving` (DESK-ECON2). Not `overview`:
 *     DS-GEN-3 already speaks about the prosperity rung there through five `prosperity: *`
 *     pools at `overview.systemsHealth`, so that tab is the one place a second prosperity
 *     sentence WOULD be the page contradicting itself. `daily_life` prints the band word as
 *     its Economy anchor fact and carries no prosperity sentence of any kind.
 *   • FOOD. DS-ECO-9 (the food-security ladder) speaks in the Food Security section.
 *     DS-ECO-2 (the at-a-glance tiles) therefore glances at BOTH of its positions — which
 *     car C3 would require in any case, since one block may draw its sentence rung at one
 *     position and the food tile and the season tile are two.
 *
 * ── THE DEFENSE DESK, AND THE FIRST ROW THAT LEAVES THE TAB ITS LEAF IS NAMED FOR ────
 * `defenseStateProse.js` carries eleven blocks. Nine now speak: seven on `defense` from the
 * landed cars, plus `defense.supportingCapabilities` (DS-DEF-6) and — the registry's first
 * cross-tab row — `viability.magicDependency` (DS-DEF-9). The `desk` column names the CORPUS
 * LEAF, not the tab, so a `defense`-leaf block speaking on `viability` is the column working
 * as specified rather than an inconsistency: DS-DEF-9's fact is whether the town would still
 * function without its practitioners, which is a viability question that happens to have
 * been authored into the defense leaf.
 *
 * ⚠ THAT ROW MADE `ViabilityTab` THE FIFTH TAB TO NEED `publicDossier` FROM THE ROUTER, and
 * it did not have it — `OutputContainer.jsx:737` passed the tab only `settlement` and
 * `narrativeNote`. The public-dossier guard's ARM 1 is what says so, derived from this table,
 * exactly as designed: adding the row is what made the omission measurable.
 *
 * ── ⛔ WHY DS-DEF-7 AND DS-DEF-10 ARE STILL DARK, AND IT IS NOT A MISSING PRODUCER ───
 * Both blocks' producers are present, exact and reachable. DS-DEF-10 is dark under the C3
 * law: all three of its lens families (fifteen postures, four badge bands, two overall
 * readings) state a fact that DS-DEF-8, DS-DEF-2 and DS-DEF-1 respectively already speak on
 * the same tab, and because C3 is per PAGE-SET there is no other tab it could speak from
 * either. DS-DEF-7 is dark on a measured chunk cost (546,887 B of transitive imports to give
 * `DefenseTab` the live causal band) plus a host component that exists and has no production
 * call site. Both declarations, with the one act that lights each, are in
 * `defenseStateProse.js` at `DEF7_DARK_POOLS` and `DEF10_DARK_POOLS`, pinned by desk arms so
 * neither can be quietly forgotten or quietly lit.
 * ── DESK-ECON2: THE ECONOMY DESK LEAVES ITS OWN TAB ──────────────────────────────────
 * `economics.exportPosture` (DS-ECO-10), `resources.groundAndWorkings` (DS-ECO-11) and
 * `services.catalogStanding` (DS-SUP-3). The economy LEAF was never an economics-TAB leaf:
 * DS-ECO-11 is the terrain, the strengths and the exploitation ladder (the resources page)
 * and DS-SUP-3 is the tier-expected service catalog (the services page). The desk's call
 * therefore moved out of `EconomicsTab.jsx` into `components/new/economyDeskRead.js`,
 * because ARM 2 of the walker admits exactly ONE component file per desk and three tabs
 * cannot each call one. Five economy-leaf blocks stay dark and every one of them has a
 * MEASURED reason written in `economyStateProse.js`'s header rather than a silence.
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
    mount: 'economics.commercialProfile', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-12', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'economics.shadowEconomy', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-6', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'economics.tradeFlow', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-3', rung: 'sentence',
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
    visibility: 'closed-section',
    visibilityReason: 'DefenseTab\'s "Criminal Architecture & Public Order" is collapsible '
      + 'defaultOpen={orderElevated||crimStructure===\'organized\'}, open on 43 of 60 generated '
      + 'towns (5 tiers x 4 cultures x 3 seeds). The rung arrives already PROJECTED BESIDE the '
      + 'DM\'s own safetyDesc field, and that field, the Internal Security headline, the order '
      + 'badge and the safety band word are ALL inside the same fold: on the 17 towns that fold '
      + 'shut, the page prints no public-order fact anywhere and hides no sentence about one. '
      + 'Hoisting the line out would orphan it from the field it is a projection of. Whether a '
      + 'calm town should open that fold is a LAYOUT ruling for the chair, not a lane\'s.',
  }),
  Object.freeze({
    mount: 'defense.threatAssessment', tab: 'defense', desk: 'defense', blockId: 'DS-DEF-2', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.conflicts', tab: 'overview', desk: 'general', blockId: 'DS-GEN-2', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.situation', tab: 'overview', desk: 'general', blockId: 'DS-GEN-5', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.origin', tab: 'overview', desk: 'general', blockId: 'DS-GEN-6', rung: 'sentence', dimensions: ['deficit'],
  }),
  Object.freeze({
    mount: 'overview.systemsHealth', tab: 'overview', desk: 'general', blockId: 'DS-GEN-3', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.warnings', tab: 'overview', desk: 'general', blockId: 'DS-GEN-7', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.ground', tab: 'overview', desk: 'general', blockId: 'DS-GEN-12', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.market', tab: 'overview', desk: 'general', blockId: 'DS-GEN-13', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.institutions', tab: 'overview', desk: 'general', blockId: 'DS-GEN-17', rung: 'sentence',
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
    visibility: 'closed-section',
    visibilityReason: 'The same DefenseTab fold as defense.publicOrder above, and the same '
      + 'argument: the criminal-structure CARD the desk was handed the key of (csd.label and '
      + 'csd.note) sits three inches above the sentence INSIDE that fold, so a reader who is '
      + 'shown the classification is shown the sentence with it, and a reader shown neither is '
      + 'told there is a topic by the header. Measured open on 43 of 60 generated towns. The '
      + 'fold default itself is the chair\'s ruling.',
  }),
  // ── DESK CAR 4: THE WAR & FAITH DESK, AND THE FIRST LEAF TO SPAN TWO TABS ───────────
  // Until now every desk lived on one tab, so C3's "one sentence rung per block per
  // PAGE-SET" cost nothing to obey. `warFaith` splits across the war tab and the faith
  // tab, which are two tabs of ONE page-set, so the law is load-bearing here for the
  // first time. THE SPLIT, per block, and the reason each way:
  //   • DS-WAR-1 / DS-WAR-2 speak on WAR. Their producers (warStatus, mobilizationStatus,
  //     occupationStatus, treatyDocument) are read by WarTab and by nothing on FaithTab.
  //   • DS-WAR-3 is the CROSS-TAB block — "no war beat AND no treaty AND faith HIDDEN" —
  //     and it speaks on WAR because the war tab is the only one that can EVALUATE it.
  //     The faith half is the absence of `config.primaryDeitySnapshot`, readable off the
  //     settlement anywhere; the war half needs the campaign's worldState, which FaithTab
  //     holds none of by §805's own constitution. A tab that can answer half a condition
  //     cannot host the sentence. ⛔ AND IT DOES NOT GLANCE ON FAITH: a glance row whose
  //     rung is null in every world is a position the registry names and the tree can
  //     never fill — the citation shape the reachability arm exists to refuse. Silence on
  //     the second tab is R-DST-K, and it is the true answer rather than a shortfall.
  //   • DS-FTH-1 / DS-FTH-2 / DS-FTH-3 speak on FAITH, off faithPanelModel.
  //   • `faith.nicheRow` is the leaf's ONE glance, and the only honest one: the niche row
  //     ALREADY PRINTS the standing word DS-FTH-3's STANDING pools are keyed on, so the
  //     record appears there and must not speak there. No CROSS-tab glance is honest —
  //     a glance draws a band the surface already carries, and neither tab carries the
  //     other's band.
  // ⭐ NO ROW BELOW DECLARES `dimensions`, and that is MEASURED rather than forgotten: the
  // only `marks` value anywhere in the 138 warFaith pools is `dm-only` (the audience mark),
  // so `poolDimensions` is empty for every one of them and the honesty arm is satisfied by
  // omission. This is the first leaf for which that was checked before positions were
  // chosen rather than after.
  Object.freeze({
    mount: 'war.standing', tab: 'war', desk: 'warFaith', blockId: 'DS-WAR-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'war.treaties', tab: 'war', desk: 'warFaith', blockId: 'DS-WAR-2', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'war.dormantNote', tab: 'war', desk: 'warFaith', blockId: 'DS-WAR-3', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'faith.patronSeat', tab: 'faith', desk: 'warFaith', blockId: 'DS-FTH-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'faith.teaser', tab: 'faith', desk: 'warFaith', blockId: 'DS-FTH-2', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'faith.creedStanding', tab: 'faith', desk: 'warFaith', blockId: 'DS-FTH-3', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'faith.nicheRow', tab: 'faith', desk: 'warFaith', blockId: 'DS-FTH-3', rung: 'glance',
  }),
  Object.freeze({
    mount: 'defense.supportingCapabilities', tab: 'defense', desk: 'defense', blockId: 'DS-DEF-6', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'viability.magicDependency', tab: 'viability', desk: 'defense', blockId: 'DS-DEF-9', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'economics.exportPosture', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-10', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'resources.groundAndWorkings', tab: 'resources', desk: 'economy', blockId: 'DS-ECO-11', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'services.catalogStanding', tab: 'services', desk: 'economy', blockId: 'DS-SUP-3', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'daily_life.standingOfLiving', tab: 'daily_life', desk: 'economy', blockId: 'DS-ECO-8', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'history.identity', tab: 'history', desk: 'general', blockId: 'DS-GEN-9', rung: 'sentence', dimensions: ['anchor'],
  }),
  Object.freeze({
    mount: 'history.founded', tab: 'history', desk: 'general', blockId: 'DS-GEN-14', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'history.record', tab: 'history', desk: 'general', blockId: 'DS-GEN-16', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'viability.verdict', tab: 'viability', desk: 'general', blockId: 'DS-GEN-11', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'plot_hooks.framing', tab: 'plot_hooks', desk: 'general', blockId: 'DS-HK-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.notableConnection', tab: 'overview', desk: 'general', blockId: 'DS-REL-2', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'economics.craftReason', tab: 'economics', desk: 'general', blockId: 'DS-GEN-18', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.steadings', tab: 'overview', desk: 'general', blockId: 'DS-GEN-8', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'relationships.network', tab: 'relationships', desk: 'general', blockId: 'DS-REL-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'overview.populationDirection', tab: 'overview', desk: 'general', blockId: 'DS-POP-3', rung: 'sentence',
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
  'DS-DEF-7',
  'DS-DEF-10',
  'DS-ECO-4',
  'DS-ECO-5', 'DS-SUP-1', 'DS-ECO-7',
  'DS-SUP-2',
  'DS-POP-1', 'DS-POP-2', 'DS-GEN-1',
  'DS-GEN-10', 'DS-GEN-15',
  // ── warFaith, after DESK CAR 4 ─────────────────────────────────────────────────────
  // Six of the nine mounted above. These three are dark by MEASUREMENT, and each names the
  // one act that would light it (warFaithStateProse.js carries the full derivation):
  //   DS-WAR-4 — its five keys are the vocabulary of `aggressionPosture`, a module-PRIVATE
  //     function in src/pdf/lib/liveWorld.js. The one EXPORTED band reader
  //     (`aggressionChip`) spells two of the five differently and returns null for a
  //     third, so the block has no exported canonical producer and a desk-side ladder
  //     would be its THIRD spelling. Lit by hoisting one posture ladder both read.
  //   DS-WAR-5 — its occupation pools restate DS-WAR-1's from the same `state` datum; its
  //     resistance pools exist only as PHRASES with no token (the label trap); its
  //     aftermath, blockade and treaty-burden pools need activeConditions/spatialLedgers
  //     reads the war tab does not perform. Lit by a token-returning resistance ladder and
  //     an aftermath reader on the tab.
  //   DS-FTH-4 — ⛔ `templeWealth` HAS NO WRITER IN THE ENGINE (a WF-7 design-doc future;
  //     the estate's own DESIGN_FP_ARCH_WF.md V27 row records `grep templeWealth in
  //     src/domain: 0` as VERIFIED), and `tenure` is not among the seven fields
  //     `projectReligionStateOntoSettlement` puts on `config.faithProfile.deities[]`. Its
  //     one remaining pool (CONTESTED) is the fact DS-FTH-1 already speaks on that tab.
  //     Lit by the banded temple stock plus `tenure` in the projection.
  'DS-WAR-4',
  'DS-WAR-5',
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
