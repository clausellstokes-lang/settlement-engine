# DESIGN_FP_ARCH_WS — THE WAY OF WAR: the closed ways a court fights, chosen by its personality against its strengths and weaknesses, deviated per war

## Compiled by lane L-WS (Opus 5.5, 2026-10-20) under chair session 6eb7b5b6 (Fable 5.1), the FP final architecture program of chairs a73343ed and 0a2e8bd9, on the owner's word of 2026-10-20 12:29 CDT.
## Compiled on the owner's word; DARK behind three virtual flags (`wayOfWarEnabled`, `wayOfWarDeviationEnabled`, `wayOfWarBeliefEnabled`, §9); nothing scheduled.
## Bound by the FP constitution's requirements 1–24 (`DESIGN_FP_SPINE.md` §1; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1) and by the fold.
## The compile log, every measurement (taken FIRST, at master `81f1cd963`), the STOPs and the routes: `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/L-WS.md`.
## `[REFINED 2026-10-20 (fp-final P6) — what; why]` brackets mark every place the measurement changed the brief (`briefs/L-WS.md`); each is vetoable. The OWNER's shapes and rows are marked OWNER.

---

## THE OWNER'S WORDS, VERBATIM (BOARD, 2026-10-20)

12:29 CDT: "also when it comes to war strategies, think about all of the archetypes, which we can deviate, to war strategies including roman legionary style attrition warfare where they just kept raising armies vs guerilla tactics vs logistical strength vs etc. in flexible yet appropriate scenarios that speak about as much of the personality of the settlement as their habits and strengths and weaknesses."

12:29 CDT: "do you agree with this?" (the chair: yes, with the manpower crux and the derived-personality pushback — `briefs/L-WS.md` items 9–10.)

12:31 CDT: "i defer everything to your judgemetn" (ruled by delegation: the personality is DERIVED; the DM's setting is the one stored thing, the owner's shape.)

The doctrines this volume serves (2026-10-17/18, verbatim on the BOARD): "Think of this tool as the DMs tool not the party … We only supply setting and consequence"; "The DM wants emergent experience that only when scrutinized upon shows coherence … we’re not trying to show the full machinery"; THE WORLD HOSTS THE CAMPAIGN, NEVER COMPETES; and (2026-10-20 12:50) "ordinary people's lives are teh view of the DM and is the main point of the settlemetn dossier at large … even military units nad bandats and beasts affect the states of the settlement which is then interpreted by the DM into how they want ot portray the ordinary day to day life."

## THE ANSWER IN ONE PARAGRAPH (for the DM)

Every court that goes to war has a WAY of fighting it — one of eight: it outlasts (raises levy after levy), it bleeds the enemy from hidden ways, it starves the enemy by roads, walls and granaries, it seeks one decisive blow, it sits behind its walls, it fights with friends and hired companies, it raids and withdraws, or it rots the enemy from within. The way is never rolled from nothing and never stored as a temperament: it is READ from what the court has DONE (its martial, mercantile, diplomatic and inward habits, learned from its own wars and treaties), who holds its seat, its faith, and what it HAS (its levy, walls, stores, coin, roads, horses, allies). It changes slowly — over years, and the dossier says the season it changed and why. In each war the court starts from its way and may DEVIATE one step a season — because its captain is bold where the court is cautious, or because the field is lost, the treasury empty, the enemy on the hidden ways — and every deviation is said in a deed ("Kell, which raises a levy each spring, this year hired the Grey Company instead — its granary was empty"). An enemy fights the way it BELIEVES its foe fights, so a court can be misread and can feint. Nothing here adds a war mechanism: each way is a small, named, bounded lean on the war choices the world already makes, and each way's weakness is a real cost the world already keeps. The DM may set any court's way, or one war's, at will; the dossier carries one line, the Why panel the fit, and the machinery stays out of sight.

---

## §0 WHAT THE CODE ALREADY IS (measured first, at master `81f1cd963`; receipts in `cure/L-WS.md` §1)

### 0.1 The substrate

| `path :: symbol` | what it is (the quoted line) | what it gives this volume | gate / presets | host effective lines (≈, eslint at build) | persisted / derived |
|---|---|---|---|---|---|
| `src/domain/worldPulse/settlementStrategy.js :: enumerateMoves` | the settlement chooser: "enumerate candidate moves, score each, pick one"; moves `defend · hold · deploy · sue_for_peace` + objective levers | WHETHER and AGAINST WHOM a court goes to war; four landed bounded-factor idioms after the base formula (`causal.warFor`, `coalitionLoad.factorFor`, `commitmentLoad.factorFor`, `dispositionThresholds`) | `settlementStrategyEnabled` (default false) | 762 (fold §3.1.23: 763) — AT the shared-signal car | derived per tick (CONFIRMED) |
| `src/domain/worldPulse/scoringObjective.js :: objectiveForArchetype` | "Returns the DEFAULT … for any archetype without an override"; sets `merchant · religious · military` | the SEAT's archetype already re-tunes the chooser — the way of war never rewrites a coefficient | `beliefsActive` | 136 raw | constants (CONFIRMED) |
| `src/domain/worldPulse/feasibilityGate.js :: classifyFeasibility` | "PURE + DETERMINISTIC: no rng — the verdict is fully determined by the capacities and the defender's live state"; verdicts `plausible · auto_fail · harassment · require_coalition · require_betrayal · require_magic` | WHAT IS POSSIBLE — physics the way of war READS and never leans (WS3) | the war layer | 348 raw | derived (CONFIRMED) |
| `src/domain/worldPulse/militaryStrength.js :: deriveMilitaryCapacity` | facets `manpower · institutions · materiel · logistics · economy · will` (0..100) + hooks `warExhaustion · warDrain · armyDeployed` | THE STRENGTHS AND WEAKNESSES in one landed decomposition (§3.2) | none (pure; "eight modules call it" — the header's "MOUNTED NOWHERE" is stale, HOST alignment-31b) | 178 | derived (CONFIRMED) |
| `src/domain/worldPulse/dispositionLedger.js :: DISPOSITION_CHANNELS` | "'martial', 'mercantile', 'diplomatic', 'insular'" in `worldState.dispositionStats`; learned only from resolved outcomes; `CHANNEL_HALF_LIFE_TICKS = 1040` ("generational"); bands `restrained · measured · settled · marked · dominant` | THE COURT'S PERSONALITY READ THROUGH DEEDS — landed, settlement grain (§3.1) | `dispositionChannelsEnabled` | 816 raw | PERSISTED (landed shape; CONFIRMED) |
| `dispositionLedger.js :: APPETITE_STOCK_KIND` (SP-C) | `'court_risk_appetite'`, half-life `'a_few_years'` ("A court's nerve is not its culture") | the court's nerve, a second personality term | `strategicPostureEnabled` | — | PERSISTED facet (CONFIRMED) |
| `src/domain/worldPulse/habit/habitLedger.js :: writeHabits` | "spatialLedgers.habits = { rows: { <actorId>: { <class>: { <action>: [stockInt, weekStamp] } } } }"; ⛔ "nothing in `src/` calls it" | HB's court-grain habit stocks per circumstance class × action — the third personality term where lit | `habitConditioningEnabled` (lit nowhere) | 282 | PERSISTED when lit (CONFIRMED dark) |
| `src/domain/worldPulse/habitForkRegistry.js` | "⛔ THE CHOOSER-TOTALITY STOP LAW … A fork that lands unclassified REDS the tree" | every fork this volume touches is a registry row (WS16) | walker | 888 raw | constants (CONFIRMED) |
| `src/domain/worldPulse/warDeployment.js` (header) | "A settlement fields EXACTLY ONE army (`worldState.deployments[saveId]`)" | the legionary way re-fills ONE army and re-raises it; it never fields two | `warLayerEnabled` | 685 | persisted ledger (CONFIRMED) |
| `src/domain/worldPulse/mobilization.js :: stepPosture` | posture `peace · alert · war_preparation · mobilized · deployed · war_exhaustion · demobilizing`; "The ramp RATE is gated by the settlement's disposition / economy / deity / legitimacy" | the levy's CADENCE — the re-raise after a return | the war layer | 242 | persisted `worldState.warPosture` (CONFIRMED) |
| `src/domain/worldPulse/reinforcement.js :: computeReinforcement` | "Each tick the home settlement sends a PARTIAL, EXPENSIVE replenishment"; `MAX_FLOW_FRACTION = 0.10` ("never a full restore") | the raise-again-in-the-field physics (read, never leaned) | the war layer | 104 | derived (CONFIRMED) |
| `src/domain/worldPulse/warHomeCosts.js` | "const WAR_CONSCRIPT_RATE_PER_TICK = 0.006" · "const WAR_CONSCRIPT_POP_FLOOR = 250;       // never conscript the home below this" · vassal levy `LEVY_POP_FLOOR = 300`, `LEVY_STRAIN_PER_TICK = 0.05`, `LEVY_FOOD_FRACTION = 0.1` · the scar `EXHAUSTION_DECAY_PER_TICK = 0.03` ("~5× slower (non-reverting)") | THE MANPOWER FLOOR, the levy's loyalty and granary cost, the scar — `attrition`'s weaknesses, landed | `warEconomyDrainEnabled`, `warLevyEnabled` (default false) | 324 | persisted (CONFIRMED) |
| `src/domain/worldPulse/demographicsKernel.js :: advanceDemographics` + `populationDynamics.js` | "births minus deaths against min(K_food, D_tier)"; legacy growth "A one_year coarse call grows exactly 12 months' worth" | THE LEVY POOL REGROWS (slowly, food- and tier-bound) | `demographicsEnabled` | — | persisted population (CONFIRMED) |
| `src/domain/worldPulse/demographicsWar.js :: warCapabilityOf` | "Armies eat … a starving realm can still raid its neighbour's granary; it cannot campaign for a season" | the logistics strength and the raiding fallback, landed | `demographicsEnabled` | 334 raw | derived (CONFIRMED) |
| `src/domain/spatial/armyTransit.js :: resolveFieldBattle` / `armyTransitKernel.js` | "HOSTILE armies on crossing paths meet BETWEEN settlements it is a FIELD BATTLE" | a field battle is a COLLISION, never a choice — seeking it is a movement verb (MG) | spatial canon | kernel 795 — AT THE CEILING | derived (CONFIRMED) |
| `src/domain/worldPulse/relationshipRulesAdversarial.js` `hostile_raid` | "Either side of a war can raid"; "disposition scales by the raider" | the raid's frequency, leaned by `raiding` | the war layer | unmeasured (build) | candidate (CONFIRMED) |
| `src/domain/worldPulse/mercenaryMarket.js` | "STRICTLY ENDOGENOUS … NO user/party action ever feeds it" | hired steel is automatic and untouched ("Mercenaries are fine as is") | its own gate | 133 | persisted ledger when active (CONFIRMED) |
| `src/domain/worldPulse/treasury.js :: treasuryBandOf` | `TREASURY_BANDS = ['empty', 'lean', 'adequate', 'full', 'overflowing']` | the purse (coalition's strength) | `treasuryEnabled` (lit in no preset) | — | persisted (CONFIRMED) |
| `src/domain/worldPulse/beliefMap.js :: belief(observerId, subjectId, worldState)` | the record's bands `strengthBand · storesBand · populationTrendBand · tierBand · devotionBand · routePositionBand · pullBand` | the observer's picture of a foe's strengths (§6) | `beliefsActive` | — | persisted belief (CONFIRMED names) |
| `src/domain/edit/dmLayer.js` | "`roots` holds THE DM'S OVERRIDE, keyed by the root key EM-A1 declares"; "`recordRegister.js` still declares `dmLayer` NOT YET WRITTEN" | the DM's standing setting of a court's way (P1) | edit mode (EM-B3) | 945 raw | persisted by EM (CONFIRMED unwritten) |
| `src/domain/edit/directives.js :: PIN_FORK_TYPE` | "'pin-fork'" … "keys by the REGISTERED FORK ID"; `PIN_FORK_FIELDS = ['forkId', 'outcome']`; "the TICK is the entry's own `when`" | the DM's per-war setting (a pin on the deviation fork) | edit mode | 238 raw | EM's op (CONFIRMED) |
| `src/data/institutionalCatalog.js` `Stable district` | "Concentrated stabling, horse trading, and farriery …" — a catalog row with NO stock field | the horse stock's home (MG item 11's slot) | — | — | — (CONFIRMED) |

### 0.2 The binding prior words
- THE PROMISE (a seed is a starting world forever; lived history immutable; tuning owner-signed) — every constant below is DRAFT, UNMEASURED, on the FP-46 roster.
- Requirement 24 / THE HEARING WEEK (owner law 2026-10-16): engagements pause at their climax for a week; long advances run defaults; nothing queues.
- THE EVIDENCE LAW (2026-10-02, amended 10-03): who, which power, what effect; complete, not cryptic; deeds, never forecasts.
- BEHIND THE SCENES and UNPREDICTABLE IN PROSPECT, LEGIBLE ON SCRUTINY (2026-10-17): never call surprise a risk; the risks are illegibility, incoherence and runaways.
- THE DEITY DOCTRINE (ODQ addendum 15): the followers act, the god does not — the faith enters only as `deityAxes.js :: deityTemper`, the DERIVED temper.
- MACRO OVER MICRO and THE ORDINARY LIFE IS THE DM'S READING OF THE DOSSIER (2026-10-20 12:50; CHAIR-NOTES 20): every felt output lands as a SETTLEMENT STATE or a named NPC's deed.
- THE MOUNT RULE: zero lines in `pulseKernel.js` (1581), `applyWorldPulse.js` (907), `warTermination.js` (818); a host at the 800 ceiling only through a leaf-first car.
- THE CHOOSER'S SHARED-SIGNAL CAR (fold §3.1.23, OD-FC-59; the ODQ closing addition (a) of 10-19 names WC its owner): ONE context read in `settlementStrategy.js` all claimants consume.
- C4 THE GENERALS (`docs/DESIGN_FP_GENERALS.md`, design, unbuilt): G2's dials at THREE EXISTING choice points (engage/avoid · hold/withdraw · storm/wait); G13's origin tilt "never past the feasibility gate".
- MG item 9d (`briefs/L-MG.md`): "THE PRIOR OF THE MOTIVES IS THE COURT'S WAY OF WAR … MG reads `wayOfWarOf(court)` as the motive weights' prior".
- CH §16b (the owner, 2026-10-18): "Mercenaries are fine as is." — a corps never joins a hirer's manpower.

### 0.3 Population facts that bound the design
- One army per court; a court re-fills it (reinforcement ≤ 10% of its start a week) and re-raises it (the posture ramp after a return). A "second and third army within a year" in this world is the SAME host re-filled and re-raised — CONFIRMED by the ledger's key shape.
- The manpower floor is 250 at home and 300 in a levied vassal; the levy regrows only by births bounded by food and tier. CONFIRMED (constants).
- Four personality channels, twelve circumstance classes, six strength facets, five treasury bands — every input the fit reads is already banded. CONFIRMED.
- The distribution of the eight ways across real seeds is UNMEASURED: WS-0's instrument measures it before any lean lights (§10).

### 0.4 What the measurement changed (each bracketed where it sits)
R1 the feasibility gate is physics — read, never leaned · R2 the chooser takes one bounded factor through the shared-signal car; the HOW lands downstream · R3 the personality is the landed WR-2 channels + SP-C appetite + HB's court stocks + the seat + the faith's derived temper · R4 the strengths are `deriveMilitaryCapacity`'s six facets plus five named reads · R5 `attrition` is NOT a stop (its physics is landed); only the harvest-labour cost is (STOP WS-S1) · R6 no siege-versus-field-versus-raid fork is minted · R7 the DM's setting rides EM's two landed doors · R8 the believed way rides HB-6's `doctrineBands` and IN's record · R9 no hearing kind of its own · R10 the code tokens are `way_*` · R11 an eighth way, `subversion` · R12 two deviations (the captain, the situation), one step a season · R13 inertia from the inputs' own half-lives, no second decay law.

---

## §1 THE LAWS (WS1–WS17)

**WS1 — ONE READ, DERIVED; NEVER A STORED TEMPERAMENT.** A court's way of war is `wayOfWarOf(court)`, derived on every read from records the world already keeps; no temperament, doctrine or strategy field is stored for a court. The ONE stored thing is the DM's own setting (P1, the owner's shape); a contingent memo (P3) exists only if the instrument proves the derivation flickers, and only by the owner's word. "Temperament" is the world preset's word (`temperamentPresets.js`) and PS's word for a court's alignment; "doctrine" is a four-way homonym (fold §5); this volume uses neither.

**WS2 — A WAY IS A PRIOR, NEVER A CHOOSER.** A way is a bounded WEIGHT BUNDLE over choices other modules already make (§4's coverage table): each term enters through an EXISTING input of an EXISTING fork, is named, is bounded by `WS_LEAN_W` (DRAFT 0.12: a factor in [0.88, 1.12]), and is ×1 exactly when dark. The way never adds a move, a target, a legality, a mechanism or a second chooser; it reorders what the world already weighs. [REFINED 2026-10-20 (fp-final P6) — R2/R6: the brief's "the siege-vs-field-vs-raid choice" names no landed fork (a field battle is a collision, `armyTransit.js`; the raid is a reactive rule); seeking or refusing battle is a movement verb (MG), so the way enters there as MG's prior.]

**WS3 — PHYSICS IS NEVER LEANED.** The feasibility gate (`classifyFeasibility` — "A thorpe must NOT be able to storm a fortified city on a lucky roll"), the siege and field-battle odds, transit speed, the reinforcement caps, the conscription floor and every capacity are read, never tilted. A way changes what a court TRIES; the world decides what HAPPENS. [REFINED 2026-10-20 (fp-final P6) — R1: the brief's "tilts … WC's feasibility read" is corrected to "reads WC's feasibility verdict"; the gate has no strategy input and its thresholds are frozen constants.]

**WS4 — EVERY WEAKNESS IS A COST THE WORLD ALREADY KEEPS.** No way carries a cost of its own. `attrition` pays in the conscription floor, the levy's strain and granary, the scar and the commons' refusal; `harassment` in the countryside the enemy may burn (EC's conditions, ST's sites) and a keep it cannot take (the gate); `logistics` in the clock and the exposed column; `shock` in one lost battle; `fortress` in the field surrendered and the siege's clock; `coalition` in the ally's own clock, the retainer's price and the corps' loyalty; `raiding` in retaliation and the casus; `subversion` in the operative caught and the plant exposed. Each is §3.3's table, each cites its ledger. The one cost the world does NOT keep — the harvest a marching levy leaves unreaped — is ⛔ STOP WS-S1 (a slot and an OWNER row), never invented here.

**WS5 — A WAY IS SLOW.** The way changes only when a SLOW input crosses a band: a personality channel (half-life a generation), the court's nerve (a few years), the seat changing hands, a lasting strength gained or lost (the latent facets, never the current erosions). The week it moves, the crossing receipt says so and names the cause; the age receipt names every shift of the century (requirement 16). Inertia is the inputs' own; there is no second decay law (SP-B). [REFINED 2026-10-20 (fp-final P6) — R13.]

**WS6 — DEVIATION IS PER WAR AND PER SEASON, ONE STEP, PRICED, RECEIPTED.** A war starts from the court's way. Its commander's own dials (C4's G2/G15) and the situation (§5's closed causes) may move THAT WAR's way one step per season (DRAFT), and the move is a deed with its cause in the world's words. A deviation is priced by clumsiness — a court fighting against its habit applies its deviated bundle at HALF weight (DRAFT) — and taught by its outcome through the landed learners (the WR-2 channels, HB's habit stocks); no new legitimacy or cohesion write. [REFINED 2026-10-20 (fp-final P6) — the brief's "pays cohesion/legitimacy — measure which ledger": measured; no landed ledger prices "acting out of habit" without a new writer, so the price is the half-weight lean and the outcome's lesson.]

**WS7 — BELIEF, NEVER TRUTH.** A court reads its OWN way as truth (it knows itself). Every other court reads a BELIEVED way through its own picture (§6): the believed habit sheet (HB-6's `doctrineBands`) and IN's belief record; with no evidence the foe is `unread`. A court may be misread and may FEINT (MG's `feint`, IN's plants). Every consumer that plans against a foe reads the believed way, never the true one (Law One).

**WS8 — THE DM'S HAND IS TOTAL.** The DM may SET a court's way (P1, standing until lifted), PIN one war's way at any of that war's hearings (EM's `pin-fork`), and undo any advance. A set way is the court's way for every consumer; the Why panel says "set by the DM".

**WS9 — THE WORLD HOSTS THE CAMPAIGN.** A way of war is the world's own. It never targets the party, never reads the party as a term, never schedules a war, never forecasts one. The party meets a court's way only as the court's deeds.

**WS10 — NO HEARING OF ITS OWN; THE WAR'S HEARINGS CARRY IT.** A way is not an engagement. It mints NO registry kind; it adds one line to the war kinds' cards (§8) and the DM's tilt at `war_declaration` and at every standing war card is a pin of that war's way. Long advances run the defaults (the derived way and the deviation roll). [REFINED 2026-10-20 (fp-final P6) — R9.]

**WS11 — THE EVIDENCE LAW.** The dossier carries ONE line per warring court: what it DID that shows its way (deeds, never a forecast; no numerals; the world's words). A shift and a deviation each have one sentence naming who, which power and what effect.

**WS12 — BEHIND THE SCENES.** SURFACE: the dossier's one line and the deviation's deed. SCRUTINY (the Why panel, on purpose): the fit's three strongest reasons, the believed way of each foe, the deviation's cause. MACHINERY (never pushed): the scores, the bundle, the weights.

**WS13 — THE MOUNT RULE.** Zero lines in `pulseKernel.js`, `applyWorldPulse.js`, `warTermination.js`. Every lean lives in the leaf `src/domain/worldPulse/wayOfWar.js` (new; DRAFT budget 260 effective) and is consumed by its host through ONE call: the chooser through the shared-signal car (§4.1); `armyTransitKernel.js` (795, AT THE CEILING) only through MG's or C4's own leaf-first car, never a WS line; every other host under 800 takes one import and one call per term, measured at its unit.

**WS14 — THE PHYSICAL WORLD IS A SEAM.** In an aspatial world the way still derives (personality and the six facets are aspatial); the spatial terms (known hidden ways, the harbour, the lanes, the transit verbs) are ABSENT — not zero — and the ways that lean on them (`harassment`, `raiding`) fit only on their aspatial halves. Nothing here computes geometry.

**WS15 — FINITE SEMANTICS; ONE WORD, ONE MEANING.** The ways are a CLOSED set of eight (§2.1), grown only by the owner's word. The code tokens are `way_*` because five of the bare words are landed values with other meanings (§2.5).

**WS16 — THE CHOOSER-TOTALITY LAW.** Every fork this volume touches is classified in `habitForkRegistry.js`: the two forks it mints (`way_of_war_shift`, the derived read's crossing, STAY-DETERMINISTIC; `war_way_deviation`, the per-war roll, DEFER with `closeOwed` to HB) and every fork it leans (its row gains the lean as a named input, never a new fork).

**WS17 — DARK IS BYTE-IDENTICAL.** With the flags absent or not `=== true`, no read runs, no factor differs from 1, no key materializes, no rng forks; lighting `wayOfWarEnabled` is a declared same-seed shift at its own unit.

---

## §2 THE ONTOLOGY

### 2.1 THE CLOSED SET — `WAYS_OF_WAR` (eight members; `src/domain/worldPulse/wayOfWar.js`, frozen, codepoint-sorted export)

| token | the world's name (scrutiny only) | what the court does | the owner's word |
|---|---|---|---|
| `way_attrition` | the long levy | raises its levy again and again, accepts losses, outlasts the enemy by people and coin | "roman legionary style attrition warfare where they just kept raising armies" |
| `way_harassment` | the hidden war | small bands on the hidden ways strike supply and stragglers; never offers the field | "guerilla tactics" |
| `way_logistics` | the starving war | cuts roads and lanes, blockades, besieges to starve, holds its own granary | "logistical strength" |
| `way_shock` | the hammer | gathers its strength and seeks the one decisive battle or storm | "vs etc." |
| `way_fortress` | the walled war | keeps its walls and its ready keep, yields the field, waits the siege out | "vs etc." |
| `way_coalition` | the war of friends | calls its vassals, courts allies, retains companies; fights with others' strength | "vs etc." |
| `way_raiding` | the border war | strikes and withdraws for plunder and renown; holds nothing | "vs etc." |
| `way_subversion` | the war from within | works the enemy's seat with operatives and plants and strikes when it rots | "vs etc." |

[REFINED 2026-10-20 (fp-final P6) — R11: `way_subversion` ADDED. Receipt: the landed gate already names a verdict whose precondition a court can work toward — `feasibilityGate.js :: defenderHasCollapseSignal` ("Does the defender carry an INTERNAL-COLLAPSE signal — a coup / rebellion / legitimacy crisis condition, or a fragile legitimacy score?") opening `require_betrayal` ("the storm was opened by the rot inside the defender, not by weight of arms"); no other way reaches that verdict on purpose. Struck: none. A sea way was considered and NOT added: the landed navy (`navalStrength.js`) is a STRENGTH that `logistics` (the blockade) and `raiding` (the lanes) read, not a separate way.]

`unread` is a BELIEVED value only (§6): a foe with no evidence. It is never a court's own way.

### 2.2 THE PERSISTED SHAPES (requirement 22a; every one the OWNER's)

| id | shape | where | writer | status |
|---|---|---|---|---|
| P1 | `wayOfWarSet`: one member of `WAYS_OF_WAR` | ONE DM-layer root on the settlement record (`src/domain/edit/dmLayer.js :: roots`, keyed by EM-A1's root key; the record is regenerated FROM the layer) | the DM only, through EM's edit door | OWNER'S SHAPE, declared (OD-WS-1); rides EM-B3's persistence; absent ⇒ derived |
| P2 | a `pin-fork` op `{ forkId: 'war_way_deviation', outcome: <a member> }` with its entry's `when` | EM's directive ops (`src/domain/edit/directives.js`) | the DM only | EM's landed shape — NO new shape; the fork id and its outcome vocabulary are this volume's (OD-WS-2) |
| P3 (CONTINGENT) | `spatialLedgers.waysOfWar[courtId] = [wayToken, sinceWeek]` | one `spatialLedgers` sub-key, drop-when-empty | `wayOfWar.js :: writeWayMemo` (the one writer) | DARK AND UNDECLARED unless WS-0's instrument measures flicker above `WAY_FLIP_CEILING` (DRAFT one shift per court per five years) and the OWNER says so (OD-WS-3); its ten paths are written in §11 so the decision is informed |

[REFINED 2026-10-20 (fp-final P6) — R7: the brief's "a stored OVERRIDE on the settlement record" rides EM's TWO landed doors — the DM layer's root for a standing setting, the director's pin for one war — so this volume owns a fork id and a vocabulary, not a new field writer. The DM's tool is the house's one DM tool.]

### 2.3 THE DERIVED READS (pure; rng-free; codepoint-ordered; in `src/domain/worldPulse/wayOfWar.js`)

| signature | reads | returns | belief or truth |
|---|---|---|---|
| `wayOfWarOf(worldState, snapshot, courtId, tick)` | P1 if set; else `wayFitOf` | `{ way, source: 'derived'·'dm_set', reasons: string[≤3] }` | TRUTH (the court of itself) |
| `wayFitOf(worldState, snapshot, courtId)` | `wayPersonalityOf` × `wayStrengthsOf` through `WAY_AFFINITY` (§3.3) | `{ scores: Record<way, number>, top: way, reasons }` — argmax, codepoint tie-break | TRUTH |
| `wayPersonalityOf(worldState, snapshot, courtId)` | the WR-2 channel bands, the SP-C appetite band, HB's court stocks (where lit), the seat's archetype (`governingCoalition(item).governing`), the faith's `deityTemper` | a closed vector of BANDS (§3.1) | TRUTH |
| `wayStrengthsOf(worldState, snapshot, courtId)` | `deriveMilitaryCapacity(item).facets` (LATENT, never `currentCapacity`) ranked against the court's own mean; `treasuryBandOf`; `knownTrailsOf` size band (spatial); the horse proxy; the vassal and ally counts; the harbour | a closed vector of BANDS (§3.2) | TRUTH |
| `wayOfWarForWar(worldState, snapshot, courtId, warKey, tick)` | `wayOfWarOf` + the war's deviation (§5) + a P2 pin | `{ way, deviatedFrom?, cause? }` | TRUTH |
| `wayLeanOf(way, term)` | the frozen bundle table `WAY_BUNDLES` (§4) | a factor in [1−W, 1+W]; 1 for an unlisted term | constant |
| `believedWayOfWarOf(worldState, snapshot, observerId, subjectId, tick)` | HB-6's believed habit sheet (`doctrineBands`) where lit; IN's belief record bands; BL-2's conduct bands of the subject's generals (C4) | `{ way \| 'unread', basis: 'sheet'·'record'·'conduct'·'none' }` | BELIEF |
| `wayOfWarCrossingOf(before, after, courtId, tick)` | `wayOfWarOf` on the pre- and post-apply worlds (the `dispositionLedger.js :: appetiteCrossingOf(beforeEntry, afterEntry, cause, tick)` idiom) | a shift receipt `{ from, to, cause }` or null | TRUTH |

### 2.4 THE OTHER CLOSED VOCABULARIES

| vocabulary | members | notes |
|---|---|---|
| `WAY_SOURCES` | `derived · dm_set · dm_pinned` | the Why panel's provenance |
| `WAY_SHIFT_CAUSES` | `seat_changed · channel_moved · nerve_moved · strength_gained · strength_lost · dm_set · dm_lifted` | the crossing receipt's cause; total, first match in this order |
| `WAY_DEVIATION_CAUSES` | `commander · field_lost · purse_empty · levy_thin · foe_on_the_ways · ally_failed · siege_long · seat_rotting · dm_pinned` | §5; closed; the receipt names one (`levy_thin` = a thin levy WITH a full purse) |
| `WAY_STEP` | the ADJACENCY of the eight (§5.2) | a deviation moves one step |
| the believed basis | `sheet · record · conduct · none` | §6 |

Every band this volume reads is BORROWED (the WR-2 `CHANNEL_BANDS`, `TREASURY_BANDS`, IN's bands, the facet quintiles on `bandFamilies.js`'s magnitude ladder); it mints no ladder (CR-WC-19's borrow rule).

### 2.5 HOMONYMS REGISTERED (checked by `rg -w -i` on the worktree's src/tests/docs and the ledger's docs; receipts `cure/L-WS.md` §1.1)

| word | its landed meaning(s) | this volume's rule |
|---|---|---|
| `harassment` | `FeasibilityVerdict` "'harassment'" — the gate's "no more than a raid on the approaches" | the way is `way_harassment`; prose "the hidden war" |
| `logistics` | `DEFENSE_ROLES` key "'logistics'" ("Logistics — supply & siege endurance"); the `logistics` FACET of `deriveMilitaryCapacity` | the way is `way_logistics`; the facet keeps its name |
| `fortress` / `Fortress` | `bandLadders.js` readiness label "label: 'Fortress'"; `factionDynamics.js` "'Fortress':          +10" | the way is `way_fortress`; prose "the walled war" |
| `coalition` | the verdict `require_coalition`; `PerspectiveStandings.jsx` "kind: 'coalition'"; `governingCoalition` (beliefMap); `coalitionLoad` | the way is `way_coalition`; prose "the war of friends" |
| `raiding` | fold §5: WC `FREE_UNIT_STATES` "the state is renamed **`raiding`**"; `MENACE_STATES` `raiding` | the way is `way_raiding`; prose "the border war" |
| `attrition` | `attrition.js` (`applyAttritionToRecord` — a host's strength decay); fold §5 "`attrition` … renamed **`worn_down`**" | the way is `way_attrition`; prose "the long levy" |
| `subversion` | `threatProfile.js` "vector: 'subversion'" | the way is `way_subversion`; prose "the war from within" |
| `archetype` | the CONDITION's word (`activeConditions[].archetype`); the seat's (`objectiveForArchetype`); C4's faction archetypes | this volume never calls a way an archetype in code or prose |
| `temperament` | `temperamentPresets.js` (the world's temper); PS §5.2 (a court's alignment) | never used |
| `doctrine` | four-way homonym (fold §5 ruling in HB's header) | never used |
| `way` | the map's rung `way` (fold §5, THE ONE ROAD LADDER: `wild · way · trail · track · road · highway`) | the code token is always `way_*`/`wayOfWar*`; prose says "how Kell makes war", never "Kell's way" bare where a road rung could be read |

[REFINED 2026-10-20 (fp-final P6) — R10: the code tokens are `way_*`-prefixed (all FREE: `rg -w -i` 0/0/0/0 for each of the eight and for `wayOfWarOf`, `WAYS_OF_WAR`, `wayOfWarEnabled`).]

---

## §3 THE FIT — how a court's way is read (mechanism 1)

### 3.1 The personality half (TRUTH of self; every input landed or designed, none new)

| term | read (`path :: symbol`) | bands | gate | absent ⇒ |
|---|---|---|---|---|
| martial · mercantile · diplomatic · insular | `dispositionLedger.js :: readDispositionChannel(entry, channel)` → `dispositionBandOf(stock01)` | `restrained · measured · settled · marked · dominant` | `dispositionChannelsEnabled` | the term drops (absent-not-neutral) |
| nerve | `dispositionLedger.js :: readDispositionAppetite(entry)` (SP-C) | the same five | `strategicPostureEnabled` | drops |
| habit | HB's stocks for the court under `war_open`/`siege_pressed` × the chooser's actions (`habitCurve.js :: habitFactor`) | HB's hold bands | `habitConditioningEnabled` | drops (HB is dark today) |
| seat | `beliefMap.js :: governingCoalition(item).governing` (the archetype `objectiveForArchetype` keys on) | the landed archetype words | `beliefsActive` | drops |
| faith | `deityAxes.js :: deityTemper(primaryDeitySnapshot)` (`warlike · peacelike · neutral`) — the followers act | three words | a deity assigned | drops |
| conduct (requirement 13) | `disposition.js :: computeLawfulness(item, worldState)` · `computeMalice(item, worldState)` (landed alignment reads) | `below · level · above` (DRAFT thirds) | the alignment layer | drops |

[REFINED 2026-10-20 (fp-final P6) — R3: the brief named HB's habit curve as the personality's carrier; HB is dark (`writeHabits` has no caller) and its grain is class × action, while the LANDED court-grain memory of deeds is WR-2's four channels and SP-C's nerve. The culture record is NOT a term: `src/data/cultureProfiles.js` carries military organisation as PROSE ("A warrior following provides the permanent core around which levy and ship crews assemble") with no machine field — the dossier's, not the fit's; the culture reaches the fit only through the landed reads that already carry it (the government label in the `will` facet, the faith).]

### 3.2 The strengths half (TRUTH of self; the LATENT facets, so a passing siege never flips a way)

| strength | read | band | spatial? |
|---|---|---|---|
| manpower · institutions · materiel · logistics · economy · will | `militaryStrength.js :: deriveMilitaryCapacity(item).facets` — each facet's RANK against the court's own mean (`above · level · below`, DRAFT ±10 points) | three words per facet | no |
| purse | `treasury.js :: treasuryBandOf(settlement)` | `empty · lean · adequate · full · overflowing` | no (`treasuryEnabled`) |
| known hidden ways | BD `knownTrailsOf(worldState, snapshot, courtId, tick)` — its size banded (`none · few · many`, DRAFT) | three | YES (absent aspatial) |
| horses | MG item 11's stock where lit; else the PROXY: a live `Stable district` institution or a `materiel` contributor matching `mount\|cavalry\|warhorse\|steed` (`MATERIEL_PATTERN`) | `horse_poor · horsed` (proxy) | no |
| the chain and friends | PL's member count under the court (PL-0's walk) and the court's `allied` / `defensive_pact` edges (`warHomeCosts.js :: LEVY_SUPPORT_TYPES`) | `alone · few · many` | no |
| the harbour | the landed navy (`navalStrength.js`) | `landbound · shipped` | YES |
| stores | `demographicsWar.js :: warCapabilityOf` where lit, else the `logistics` facet | the facet's band | no |

[REFINED 2026-10-20 (fp-final P6) — R4: twelve separately-named strength reads in the brief collapse to ONE landed decomposition plus six named reads; the ready keep's readiness (ST) is the `institutions` facet's walls-and-garrison term (`defenseLedger(s).military`), not a second read.] [STOP WS-S2 — the horse STOCK is MG's slot (the `Stable district` row has no stock field); until it lands the read is proxy-grade.]

### 3.3 THE AFFINITY TABLE — way × the facts that make it fit, and the costs that are its weakness (every cell a landed or designed read)

| way | fits when (personality) | fits when (strengths) | its weakness — the cost the world already keeps |
|---|---|---|---|
| `way_attrition` | martial `marked+`; nerve `measured+`; seat `military`/`government` | manpower `above`; economy `level+`; the chain `few+` | the conscription floor and the war dead (`warHomeCosts.js` `WAR_CONSCRIPT_POP_FLOOR`; `deploymentReturn.js` "deployed − returned === war dead"); the vassal's strain → rebellion (`LEVY_STRAIN_PER_TICK`); the levied granary (`LEVY_FOOD_FRACTION`); the scar (`EXHAUSTION_DECAY_PER_TICK`); the commons' refusal (POP-2 `commonsArcEnabled`); ⛔ the unreaped harvest (STOP WS-S1) |
| `way_harassment` | insular `marked+`; martial `measured–settled`; nerve `restrained–measured` | known hidden ways `few+`; manpower `below`; institutions `below` | it cannot take a keep (the gate: harassment never permits a siege, `verdictPermitsSiege`); it cannot hold ground; the enemy's answer falls on its countryside (EC's conditions; ST's sites) |
| `way_logistics` | mercantile `marked+`; diplomatic `measured+`; seat `merchant` | logistics `above`; economy `above`; the harbour `shipped`; purse `adequate+` | slow (the siege's own weeks; `siege` STANDING); the exposed column (WY's road danger; PR's coverage); the clock of the scar |
| `way_shock` | martial `dominant`; nerve `marked+`; faith `warlike` | materiel `above`; will `above`; horses `horsed` | one lost battle (`resolveFieldBattle`'s loser's withdrawal; C4 G4's capture of the commander); the misjudgment road (`detectMisjudgment`) |
| `way_fortress` | insular `marked+`; nerve `restrained`; lawfulness `above`; seat `religious`/`civic` | institutions `above` (walls, garrison, ST's ready keep); stores `above` | the field surrendered (the enemy's raids land: `hostile_raid`); the countryside burned; the siege's clock (`siege` STANDING) |
| `way_coalition` | diplomatic `marked+`; mercantile `measured+` | the chain and friends `few+`; purse `full+` | the ally's own clock (WC-5 `call_in_answer`: `refused · lapsed`); the retainer's price and a corps that sells out (CH §16b: "sold Merewick out at the ford"); the debt (WC §1.10) |
| `way_raiding` | martial `marked+`; insular `restrained–measured`; malice `above`; seat `military` | horses `horsed`; known hidden ways `few+`; manpower `below–level` | nothing held; retaliation (the foe's casus, W-PEACE-1 `warReasons.js`); the court-to-court fall |
| `way_subversion` | diplomatic `marked+`; martial `restrained–measured`; nerve `measured+`; lawfulness `below` | economy `above`; purse `adequate+` (ES's operatives are paid) | the operative caught (`spy_at_target` `caught`); the plant exposed (`lure_sprung` `exposed_first · backfired`); the court's credibility (IN) |

The SCORE (DRAFT, UNMEASURED): each satisfied cell adds `WAY_AFFINITY_STEP` (DRAFT 1) and each `dominant`/`above` match adds a second step; an absent term contributes nothing (absent-not-neutral). The top score wins; ties break by codepoint. A court whose top score is below `WAY_FIT_FLOOR` (DRAFT 2 steps) takes the DEFAULT way `way_fortress` for a court that has never warred and `way_attrition` for one that has (the landed default war is a siege fed by conscription — the legionary way is what the unleaned engine already does). [REFINED 2026-10-20 (fp-final P6) — a floor and a default make the read total; the defaults are the landed behaviour, so a weakly-fitted court leans almost nothing.]

### 3.4 The clock, the counterforce, the receipt
- CLOCK (requirement 9): derived on read; consumed by the weekly war stage; CADENCE = the inputs' own writes (a channel moves only at a resolved outcome, the nerve likewise, the seat at a seat change, a latent facet when the town itself changes) — so a shift is recognised in the very week one of those writes crosses a band, and the crossing read runs post-apply on that week's before/after worlds; DWELL = the inputs' half-lives (a generation; a few years) — there is no season gate and no memory, because a pure read cannot remember; WS-0's instrument measures the shifts per court-decade and, above `WAY_FLIP_CEILING`, the OWNER may light the contingent memo P3 (OD-WS-3) — never this volume by itself; TIER aspatial-safe (spatial terms absent-not-zero). [REFINED 2026-10-20 (fp-final P6) — the brief's "one step per season" inertia for the WAY (not the deviation) needs memory a derived read cannot hold; the honest carrier is the inputs' slowness, measured, with the memo as the owner's contingent shape.]
- COUNTERFORCE (requirement 2): the inputs' own half-lives (a generation; a few years); the latent facets (a siege's erosion never flips a way); the weakness costs of §3.3; the enemy's believed read (§6: an over-fit way is READ and countered — C4 BL-2's "a known storm-taker is BAITED"); the DM's setting.
- RECEIPT (the crossing): `{ from, to, cause ∈ WAY_SHIFT_CAUSES }`, minted as a `causedBy` child of the input's own write (the seat change's receipt, the war resolution that moved the channel). FELT: "Since the fall of its walls at Ashford, Merewick keeps to its keep and lets the fields go." SCRUTINY: the three strongest cells of §3.3 and the cause.

---

## §4 THE BUNDLES — how a way leans the choices the world already makes (mechanism 2)

### 4.1 The rule
Every lean is `wayLeanOf(way, term)`: a factor in [1 − `WS_LEAN_W`, 1 + `WS_LEAN_W`] (DRAFT 0.12, UNMEASURED) multiplied into ONE existing input of ONE existing fork, in the landed bounded-factor idiom (`coalitionLoad.factorFor(move)` — "a bounded, clamped multiplier … ×1 exactly … when politics is dormant"). A term unlisted for a way is ×1. The way reads TRUTH for its own court and BELIEF for any foe (§6). No lean may add a move, a target or a legality; the chooser's own text binds it: "no channel can add a target, turn a friend hostile, or bypass a legality gate" (`settlementStrategy.js`, WR-2's placement).

THE CHOOSER'S ONE TERM rides the shared-signal car (fold §3.1.23; OD-FC-59; the ODQ's closing addition (a) of 10-19 names WC its owner): ONE registered term `way` in the car's context read, applied after `dispositionThresholds` and before the softmax, on the four base moves only. WS writes no line in `settlementStrategy.js` (762 effective); it REGISTERS its term with the car's owner (a ROUTE to WC). [REFINED 2026-10-20 (fp-final P6) — R2.]

### 4.2 THE COVERAGE TABLE — way × chooser (the input each lean enters by; `+` = ×(1+W), `−` = ×(1−W), `·` = ×1)

| chooser (owner) · the input | host (≈ effective) · car | attr | har | log | sho | for | coa | rai | sub |
|---|---|---|---|---|---|---|---|---|---|
| C1 the settlement chooser (WC's car) · `deploy` score | `settlementStrategy.js` (762) · the shared-signal car | + | − | · | + | − | · | + | − |
| C1 · `defend` / `hold` | same | · | + | + | − | + | · | · | + |
| C1 · `sue_for_peace` | same (⛔ never when a WR-1 termination read owns the move — the landed `if (termination && move === 'sue_for_peace') continue` idiom) | − | · | · | + | · | · | + | · |
| C2 the posture ramp · `rampReadiness` (the re-raise after a return) | `mobilization.js` (242) · one call in a leaf it imports | + | · | · | + | − | · | + | − |
| C3 the withdrawal homeostasis (step 3; C4 G2 (ii) "HOLD/WITHDRAW") · the withdrawal threshold | `warDeployment.js` (685) · one call | + (holds) | − (leaves early) | + | − | · | · | − | · |
| C4 THE GENERALS' choice points — (i) ENGAGE/AVOID · (iii) STORM/WAIT · G1's `riskFit` appetite term · G13's target ORDER | `warGeneral.js` (C4's leaf; unbuilt — STOP WS-S3) | (i)· (iii)wait · G1 low-standing | (i)avoid · (iii)wait | (i)· (iii)wait · G13 supply first | (i)engage · (iii)storm · G1 best | (i)avoid · (iii)wait | · · G1 · | (i)avoid · G13 the richest | (iii)wait for the rot · G13 the contested seat |
| C5 MG's motive prior (`briefs/L-MG.md` 9d) · the motive weights | `movementGrammar` leaf (MG's) | sacrifice a rearguard + | never give battle +; lie_in_wait +; hide + | hold the ford +; shadow + | advance +; forced_march + | hold +; retreat to walls + | rejoin at the ally + | split for speed +; double_back + | feint + |
| C6 the raid rule `hostile_raid` · its weight beside "disposition scales by the raider" | `relationshipRulesAdversarial.js` (measure at unit) · one call | · | + | · | − | − | · | + | · |
| C7 PS's mover · `believedPassageCost` / `moverRoadOf`'s patience (`rerouted · waited` vs `trespassed`) | PS's leaf (`DESIGN_FP_ARCH_PS.md` §5) | · | quiet way + (§5.6) | patience + | patience − | patience + | asks + | quiet way + | quiet way + |
| C8 WC-5 call-ins · PL-4's call on the service default | WC's / PL's leaves | call sooner + | · | · | · | call sooner + | call sooner + | · | · |
| C9 CH §7's retainer OFFER to a corps (never the market) | CH's paragon stage | + | · | · | · | · | + | + (plunder) | · |
| C10 GR's pact appetite (`courtRiskAppetiteOf`'s road, `pactFormation.js`) | GR's leaf | · | · | + | · | · | + | · | + |
| C11 ST's ready-keep readiness spend · PR's patrol placement | ST's / PR's leaves | · | trail watch + | road watch + | · | keep + | · | · | · |
| C12 ES's mission choice (the operative's errand kind) | ES's leaf | · | · | · | · | · | · | · | toward the foe's seat + |

THE COVERAGE CHECK (the owner's "which existing reads can carry each"): every way has at least three landed or designed carriers and NO way depends on a carrier that does not exist at all — `way_shock` and `way_raiding` lean C1, C2, C6 (landed) before C4 and MG land; `way_harassment` leans C1, C3, C6 (landed) and C7/C11 (designed); `way_subversion` leans C1, C2 (landed) and C10/C12 (designed). CONFIRMED for the landed hosts by read; PLAUSIBLE for the designed carriers until each sibling confirms (the ROUTES). [REFINED 2026-10-20 (fp-final P6) — the brief's "the mobilization's size" is NOT leaned: the committed `start` is C4 G3's (standing scales offence) and the capacity is physics (WS3); only the CADENCE (the re-raise) is.]

### 4.3 Surface · scrutiny · machinery
SURFACE: nothing per lean (a lean is never a sentence). SCRUTINY: the war card's Why line names the way and, for a chosen move, the lean that tipped it ("the long levy kept the host in the field"). MACHINERY: the factor and its term.

---

## §5 DEVIATION — one war, one season, one step (mechanism 3; the owner's "which we can deviate")

### 5.1 What moves a war's way
`wayOfWarForWar` starts from the court's way and takes AT MOST ONE deviation, first match, each cause a derived read of the CURRENT situation (no memory):

| cause | the read | deviates toward |
|---|---|---|
| `dm_pinned` | a P2 pin due for this war | the pinned way (no roll) |
| `field_lost` | the court's host lost a field battle this war (`resolveFieldBattle`'s loser, the deployment's own record) or its `currentEffectiveStrength` fell below the splinter ratio (C4 G4's `SPLINTER_RATIO`) | `way_fortress` |
| `seat_rotting` | the foe `defenderHasCollapseSignal` (BELIEVED: the court's picture of the foe's legitimacy and conditions) | `way_subversion` |
| `purse_empty` | `treasuryBandOf` = `empty` | `way_raiding` |
| `levy_thin` | the `manpower` facet `below` AND the purse `full+` (a thin levy that can pay) | `way_coalition` |
| `foe_on_the_ways` | the foe's BELIEVED way is `way_harassment` (§6) | `way_logistics` (answer the hidden war by holding roads and granaries) |
| `ally_failed` | a WC-5 call-in of this war answered `refused` or `lapsed` | `way_fortress` |
| `siege_long` | the court's siege has stood longer than `WAY_SIEGE_LONG` (DRAFT one season) and its stores are `above` | `way_logistics` |
| `commander` | the war's general's dials (C4 G2: `boldness01`, the acquired `cautious`/`bold`/`proud`) disagree with the way (a `bold`+ general in a `way_fortress` court; a `cautious` general in a `way_shock` court) | one step toward the general's dial (§5.2) — DARK until C4 (STOP WS-S3) |

### 5.2 The step and the roll
- THE ADJACENCY (`WAY_STEP`; closed; each way has two or three neighbours, a deviation moves to a neighbour only): attrition ↔ fortress ↔ logistics ↔ coalition ↔ subversion ↔ harassment; attrition ↔ shock ↔ raiding ↔ harassment ↔ logistics (every way has two or three neighbours). A cause naming a non-neighbour moves one step toward it along the codepoint-first shortest path. [REFINED 2026-10-20 (fp-final P6) — "one step" needs a defined neighbourhood; this ring keeps a deviation recognisable as the court's own.]
- THE ROLL: the house roll, `rng.fork('war_way:' + courtId + ':' + warKey + ':' + seasonIndex)` (a STABLE key per season: re-rolled at most once a season, identical every week within it, no memory), taken with probability `WAY_DEVIATE_P[cause]` (DRAFT 0.5 for situation causes, the general's dial distance × 0.5 for `commander`). The fork is `war_way_deviation` in `HABIT_FORK_REGISTRY` (DEFER, `closeOwed` HB: a deviation that wins teaches).
- THE PRICE: a deviated war applies its deviated bundle at HALF weight (`WAY_DEVIATION_KEEP`, DRAFT 0.5) — a court fights clumsily outside its habit; and the outcome teaches through the landed learners (the WR-2 channels at the war's resolution; HB where lit). No new cost write (WS6).
- THE RECEIPT: the post-apply crossing (`wayOfWarCrossingOf` on the war arm) the week the deviation is taken or dropped, a `causedBy` child of the cause's own receipt (the lost battle, the refused call-in, the treasury's fall). FELT: "Kell, which raises a levy each spring, this year hired the Grey Company instead — its granary was empty." SCRUTINY: the cause and the court's own way.

### 5.3 Long advances
A month, season or year advance runs the defaults: the derived way, the deviation's seasonal roll, no hearing (requirement 24 — the war's own hearings run on their defaults). A year advance produces at most four deviation receipts per war (one per season), folded by the herald's landed digest.

---

## §6 BELIEF — the foe's picture of a court's way (mechanism 4)

### 6.1 The read
`believedWayOfWarOf(observer, subject)` runs the SAME fit on the observer's picture, never on truth:
- the personality half from HB-6's believed habit sheet (`doctrineBands`, flag `believedDoctrineEnabled`) where lit — HB's sheet "is a legible artifact a DM can read, a spy can steal, and a liar can forge" — else from C4's BL-2 CONDUCT bands of the subject's generals that the observer was AFFECTED by (`storms|starves · holds|retreats · bold|cautious · spares|seizes`, "written ONLY from engagements the observer court was AFFECTED by"), else nothing;
- the strengths half from IN's belief record (`belief(observer, subject).strengthBand · storesBand · tierBand · populationTrendBand`) — never `deriveMilitaryCapacity` of the subject;
- NO personality evidence ⇒ `unread` (a court that has never fought where the observer could see it is unread; its foes plan on the landed defaults). [REFINED 2026-10-20 (fp-final P6) — R8: the brief's "IN's picture; RN's reputation from deeds" — RN's deed store is PERSON-keyed (RN2) and a second court-reputation law is forbidden; the believed behaviour of a court is HB-6's family by design, with C4's conduct bands as its person-grain feeder.]

### 6.2 What reads it
Every lean in §4 that depends on a FOE reads the believed way: C4 (i) ENGAGE/AVOID (a foe believed `way_harassment` or `way_fortress` is not sought in the field: the engage lean −); §5's `foe_on_the_ways`; PS's crossing of a believed `way_raiding` court's land (escort or the quiet way); PR/ST's watch against a believed `way_harassment` neighbour (the trail watch +); WC's call-in answer (an ally believed `way_coalition` is expected to call back). Bounded by `WS_LEAN_W`; ×1 for `unread`.

### 6.3 The feint and the misread
A court may fight AGAINST its believed way on purpose only through landed deceptions — MG's `feint` (a believed heading) and IN's plants (a false report carried by a person) — never by a WS-minted act. A misread is the gap between the believed and the true way; the truth resolves in the war's deeds (the conduct bands update at each engagement; HB-6's sheet decays on the observer's believed law band). The gap is the surprise, and the surprise is the goal (UNPREDICTABLE IN PROSPECT); the Why panel shows the DM both pictures (LEGIBLE ON SCRUTINY).

---

## §7 LEGIBILITY — what the DM sees, and where

- SURFACE (the dossier, Power or War tab, one line, only for a court that has warred in the dossier's horizon): a deeds sentence of its way — "Kell makes its wars long: it raises a levy each spring and keeps its host in the field until its enemies tire." A court never at war shows nothing (no forecast; the Evidence Law).
- SURFACE (the deviation deed, in the herald's feed for that war): §5.2's sentence.
- SURFACE (the shift, the age receipt): "In the year its old prince died, Merewick turned from raiding to its walls."
- SCRUTINY (the Why panel, on purpose): the way's three strongest cells (§3.3) in words; the source (`derived · dm_set · dm_pinned`); each foe's BELIEVED way of this court and this court's believed way of each foe, side by side with the truth (the DM's view only).
- MACHINERY (never pushed): scores, factors, the bundle table, the roll.
- THE MAP: nothing new. The way is not drawn; its consequences (where hosts go, raids, sieges) are drawn by the layers that already draw them.

---

## §8 THE HEARINGS (requirement 24)

THE WAY OF WAR OWNS NO ENGAGEMENT-REGISTRY KIND. A way is a court's own disposition, not an engagement between settlements, and a shift or a deviation is a court's own act; neither pauses the world. The war's own kinds carry it (registry rows of record in the fold §3.4; WHERE from `ENGAGEMENT_WHERE_KINDS` = `settlement · road · country · site · border_segment`):

| kind (owner) | WHERE | CLIMAX / STANDING | what this volume adds to its card | the DM's three choices (requirement 24) | the DEFAULT |
|---|---|---|---|---|---|
| `war_declaration` (the war volume) | `settlement` (the declaring court) | CLIMAX | ONE line: the declaring court's way for this war and the foe's way AS THE DECLARING COURT BELIEVES IT; the deviation and its cause, if taken | LEAVE (the derived/deviated way) · TILT (pin this war's way: one P2 pin on `war_way_deviation`) · DECREE (`declared · stayed`, the kind's own words) | the derived way, deviated by §5's roll; `declared` or `stayed` by the kind's own default |
| `siege` (the war volume) | `settlement` (the besieged town) | STANDING (every week) | the besieger's and the defender's ways for this war (the believed one for the other side) | LEAVE · TILT (a pin for the war, due this week) · the kind's own decree (`holds · falls · relieved · lifted`) | the kind's own; the way unchanged |
| `armies_meet` (WC) | `road` | CLIMAX | each side's way for the war (its own) — the engage/avoid lean that brought it here | LEAVE · TILT (a pin) · the kind's decree | the kind's own |
| `raid` / `supply_raid` (the war volume) | `settlement` / `road` | CLIMAX | the raider's way when it is `way_raiding` or `way_harassment` ("as Varn does each harvest") | the kind's own | the kind's own |
| `blockade` (the war volume) | `settlement` | STANDING | the blockader's way when it is `way_logistics` | the kind's own + TILT | the kind's own |
| `call_in_answer` (WC-5) · `coalition_join` (the war volume) | `settlement` | CLIMAX | the caller's way when it is `way_coalition` (the call came sooner) | the kind's own | the kind's own |

A party is never a subject of any way, so the party default "nothing has happened to the party yet" is untouched. LONG ADVANCES: no card opens for a way; the war kinds run their defaults; the deviation's seasonal roll runs; the shift receipts land in the digest. A pin made at a hearing binds that war until the DM lifts it or the war ends. [REFINED 2026-10-20 (fp-final P6) — R9.]

---

## §9 THE FLAGS (virtual; absent-when-dark; read by name `=== true`; every lean ×1 and every read unrun when dark)

| flag | lights | requires | certification row | lit-mutant pins | presets it may light in |
|---|---|---|---|---|---|
| `wayOfWarEnabled` | §3 the read; §4's landed-host leans (C1 through the car, C2, C3, C6); the dossier line; the Why panel; the shift receipt | `warLayerEnabled` · `settlementStrategyEnabled` (the chooser is its first consumer) | a CW-0 manifest row + a `subsystemRowsVirtual` row (WS-0) | (1) every lean's SIGN flipped ⇒ the S3/S4 assertions RED; (2) `WS_LEAN_W` = 0 ⇒ the vacuity pin RED (the instrument's lean is non-zero on the corpus); (3) the gate read through a way ⇒ the S5 physics pin RED; (4) the latent facets swapped for `currentCapacity` ⇒ the S11 flicker pin RED | the war presets of record only (where `warLayerEnabled` and `settlementStrategyEnabled` are lit — the fold §2's status of record); never a no-war preset |
| `wayOfWarDeviationEnabled` | §5 the deviation, the pin's consumption, the deviation receipt | `wayOfWarEnabled` | its rows | (5) the roll keyed per week instead of per season ⇒ S6's within-season identity RED; (6) the half-weight dropped ⇒ the S6 magnitude pin RED | the same |
| `wayOfWarBeliefEnabled` | §6 the believed read and its consumers | `wayOfWarEnabled` · `beliefsActive` (the belief map marker) | its rows | (7) the believed read fed TRUTH ⇒ S8's misread fixture RED; (8) `unread` read as a way ⇒ S8's ×1 pin RED | the same, where the belief layer is lit |

`hearingWeekEnabled` is not this volume's: the card line rides the war kinds' cards under their own gate. No flag lights by itself in any preset without the owner's word (THE PROMISE: lighting `wayOfWarEnabled` is a same-seed shift, declared at WS-2's unit).

---

## §10 THE WAVES (each: leaves · hosts · FIRST-VISIBLE · TIER · DEGRADED ARM · EDITOR (a) fork row (b) predicates (c) real-only (d) DM acts (e) receipts · Alignment · `causedBy`)

| wave | leaves · hosts | FIRST-VISIBLE (sign, latency) | TIER | DEGRADED ARM | EDITOR | Alignment (req 13) | `causedBy` |
|---|---|---|---|---|---|---|---|
| **WS-0 REGISTRATION + THE INSTRUMENT** | `wayOfWar.js` (vocabularies; the bundle SHAPE, no values); two `HABIT_FORK_REGISTRY` rows (`way_of_war_shift` STAY · `war_way_deviation` DEFER, `closeOwed` HB); the §14 tokens; three manifest rows (dark); the instrument `scripts/review/wayOfWarCensus.mjs` (the reader corpus, nine realms, twenty advances: the eight ways' distribution, shifts per court-decade, the fit margin) | none (instrument only) | aspatial-safe | — | (a) the two rows (b) `isWay` (c) — (d) — (e) — | the instrument reports the ways by alignment third | — |
| **WS-1 THE READ** | `wayOfWar.js :: wayOfWarOf · wayFitOf · wayPersonalityOf · wayStrengthsOf · wayOfWarCrossingOf`; the dossier desk's war line (a display leaf); the herald's post-apply observation pass (one call) | the dossier line for every court that has warred, on the first advance after lighting (latency: none — derived); the shift receipt the week an input crosses | aspatial-safe (spatial terms absent) | channels dark ⇒ the fit reads strengths, seat, faith and conduct only; the Why panel says "read from its strengths and seat alone" | (a) `way_of_war_shift` (b) `wayOfWarOf` (c) a phantom court (a believed town that does not exist) has no way (d) the DM's P1 set/lift (with WS-6) (e) the crossing receipt | the conduct term (§3.1) | the crossing is a child of the input's write (the war resolution, the seat change) |
| **WS-2 THE CHOOSER AND THE WAR LAYER** | the `way` term registered on the shared-signal car (WC's; fold §3.1.23); C2 `mobilization.js :: rampReadiness` (one call); C3 the withdrawal threshold in `warDeployment.js` (one call); C6 `hostile_raid`'s weight (one call) | the war card's Why line ("the long levy kept the host in the field") on the first war after lighting; the measured war-length shift (S3) | aspatial-safe | the car not yet built ⇒ C1 is absent and C2/C3/C6 lean alone (declared) | (a) each leaned fork's row gains the input `way` (b) — (c) — (d) the war hearings' existing choices (e) the war's receipts name the lean | the raid weight reads the raider's malice through the landed disposition multiplier (unchanged) | the war's own `causedBy` chain |
| **WS-3 THE SIBLINGS' INPUTS** — each at ITS sibling's wave, never before: C5 MG (the motive prior) · C7 PS (patience, the quiet way) · C8 WC-5 / PL-4 (the call) · C9 CH §7 (the retainer offer) · C10 GR (pact appetite) · C11 ST/PR (watch and keep) · C12 ES (the mission) | one `wayLeanOf` call in each sibling's leaf | each sibling's own first sign, with the way in its Why line | each sibling's tier | the sibling dark ⇒ the term absent | each sibling's (a)–(e); WS adds only the input name | each sibling's | each sibling's |
| **WS-4 THE DEVIATION** | `wayOfWar.js :: wayOfWarForWar` + the seasonal roll; the deviation receipt; the commander arm with C4 (STOP WS-S3 — the arm is dark until C4's G2 lands) | the deviation deed in the war's feed the season it is taken | aspatial-safe (the `foe_on_the_ways` cause is spatial-only, absent aspatial) | C4 unbuilt ⇒ the situation causes only | (a) `war_way_deviation` (b) `wayOfWarForWar` (c) real-only (d) the pin at a war hearing (e) the deviation receipt | the `commander` arm reads the general's dials (C4), not a court axis | a child of the cause's receipt (the lost battle, the refused call-in, the treasury's fall) |
| **WS-5 THE BELIEF** | `believedWayOfWarOf`; the foe-dependent reads of §6.2 | the Why panel's two pictures; the `foe_on_the_ways` deviation | belief infoMode (requires `beliefsActive`) | HB-6 dark ⇒ the conduct bands (C4 BL-2); both dark ⇒ `unread` (×1) | (a) none (a read) (b) `believedWayOfWarOf` (c) a phantom foe's believed way IS read (a belief may concern a phantom) (d) — (e) — | — | — |
| **WS-6 THE DM'S DOORS** | the P1 root through EM's `dmLayer` (after EM-B3 lands persistence); the P2 fork id `war_way_deviation` in EM's pin catalogue | the Why panel's "set by the DM" | every tier | EM-B3 unlanded ⇒ the DM's standing set is unavailable; the hearing's existing decrees and the advance undo remain the DM's tools (declared) | (a) — (b) — (c) — (d) set · lift · pin (e) EM's edit receipt | — | EM's |

ORDER (for the fold's §6 chains; the fold lane places it): after C4 THE GENERALS' first wave and MG's first wave, inside the war chain; WS-0 and WS-1 may run as soon as the war layer's chain is lit (they lean nothing).

---

## §11 THE LIFECYCLE OF EVERY PERSISTED SHAPE (requirement 22a)

### P1 `wayOfWarSet` — the DM's standing setting (one DM-layer root; the OWNER'S SHAPE)

| path | behaviour |
|---|---|
| create | the DM sets a court's way through EM's edit door; the consult refuses a value outside `WAYS_OF_WAR` (EM's fail-closed `unknown_target`/outcome refusal) |
| read | `wayOfWarOf` reads it FIRST; every consumer reads the result; foes never read it (they read deeds — §6) |
| persist | EM-B3's DM-layer persistence (local, cloud, worker transport — JSON scalar) |
| regenerate | the record is regenerated FROM the layer (EM design §14): the setting survives a regeneration |
| undo | an EM edit undo removes it; an ADVANCE undo leaves it (the layer is the DM's input, not simulated state) |
| import | travels with the campaign's DM layer; an unknown member is dropped at read (total on garbage) and reported by EM's import receipt |
| migrate | none at birth (absent ⇒ derived); a member renamed later is an owner-signed migration row |
| dark-after-lit | `wayOfWarEnabled` off: stored, read by nobody; relit: honoured as set |
| death | the court destroyed or razed: the root dies with its record (EM's keying); conquest: the setting STANDS (the DM's hand), the Why panel adds "set by the DM before the conquest" |
| veil | the DM's view only; no foe, dossier reader or party-facing surface learns that it is set |
HORIZON: one value per court; no ring.

### P2 the `pin-fork` op on `war_way_deviation` — EM's landed shape (not this volume's); its lifecycle is EM's (`directives.js`: "IT NEVER REFUSES OUT LOUD AND NEVER THROWS"; a pin "DOES NOT ADVANCE THE STREAM"). This volume adds only the fork id and its outcome words (`WAYS_OF_WAR`).

### P3 (CONTINGENT, DARK, UNDECLARED until OD-WS-3) `spatialLedgers.waysOfWar[courtId] = [wayToken, sinceWeek]`

| path | behaviour |
|---|---|
| create | the first shift of a court after the owner lights it; written by `writeWayMemo` only |
| read | `wayOfWarOf` holds the memo's way until the fit's lead exceeds `WAY_HYSTERESIS` (DRAFT one affinity step) |
| persist | `spatialLedgers` JSON scalars (the habit ledger's law: never a Map, Set or Date) |
| regenerate | a regenerated world starts without it (derived again) |
| undo | rides the advance's snapshot undo with the rest of `spatialLedgers` |
| import | rides the campaign; garbage ⇒ absent |
| migrate | absent ⇒ none |
| dark-after-lit | kept, unread; relit: a row older than `WAY_MEMO_HORIZON` is dropped at the first write |
| death | dropped with the court (the drop pass) |
| veil | never read by a foe |
HORIZON: one row per warring court; drop-when-equal-to-the-derived-way for `WAY_MEMO_HORIZON` (DRAFT ten years); the sub-ledger drops when empty.

---

## §12 THE SCENARIO MATRIX (each row a measurable assertion; DRAFT thresholds UNMEASURED)

| # | scenario | assertion |
|---|---|---|
| S1 | ALL THREE FLAGS DARK (absent and `false`) | byte-identical to the unflagged engine on the golden seeds and the soak: no `wayOfWar*` key, no rng fork keyed `war_way:`, every factor ×1 |
| S2 | lit; `dispositionChannelsEnabled` dark | the fit reads strengths, seat, faith and conduct only; reversing the saves array yields the identical way for every court (codepoint order) |
| S3 | a court with `manpower above` and martial `marked+` (`way_attrition`) at war | its `deploy` ×(1+W) and `sue_for_peace` ×(1−W) on the scored rows; its median war length on the instrument corpus ≥ the unleaned median (DRAFT +10%) |
| S4 | a `way_fortress` court threatened | `defend`/`hold` ×(1+W), `deploy` ×(1−W); the posture ramp slower (C2) |
| S5 | THE PHYSICS PIN, every (attacker, defender) pair on the corpus | `classifyFeasibility`'s verdict, `fieldBattleWinProbability`, `computeReinforcement`'s flow and the conscription debit are IDENTICAL lit and dark |
| S6 | a court whose host lost a field battle this war (`wayOfWarDeviationEnabled`) | the war's way deviates toward `way_fortress` with probability `WAY_DEVIATE_P`, by ONE step; the outcome is identical every week of the season and may change only at the season's turn; the deviated bundle applies at half weight |
| S7 | a P2 pin at `war_declaration` | the war's way is the pinned member; no rng is drawn for that war's deviation (`chooseOrPinFork`) |
| S8 | an observer with no sheet and no conduct evidence of a foe | `believedWayOfWarOf` = `unread`; every foe-dependent lean ×1; a foe that feints (MG) is believed ≠ true and the Why panel shows both |
| S9 | ASPATIAL (no spatial canon) | the known-ways and harbour terms are ABSENT (not zero); `way_harassment` fits on its aspatial half only; `wayOfWar.js` imports no spatial module except BD's `knownTrailsOf` behind the canon check (source scan) |
| S10 | LONG ADVANCE (one year vs fifty-two weeks) | the derived way and every deviation are identical (preview ≡ apply); at most four deviation receipts per war; no card opens for a way |
| S11 | a seat changes hands and its archetype moves (`military` → `merchant`) | exactly one crossing receipt that week, cause `seat_changed`, a child of the seat change's receipt; a siege's erosion (current, not latent) moves no way |
| S12 | the DM sets P1, then lifts it | every consumer reads the set way while set; the derived way after the lift; the Why panel says "set by the DM" |
| S13 | THE HOSTING DOCTRINE | `wayOfWar.js` reads no party key and imports no party module (source scan); no way is a function of the party's position or deeds |
| S14 | the instrument's distribution (WS-0) | across the nine-realm corpus over a century, no way holds more than DRAFT 40% of warring courts and none less than 3% — else the affinity table is retuned before any lean lights (owner-signed) |
| S15 | flicker | shifts per court-decade ≤ `WAY_FLIP_CEILING` (DRAFT two); above it the owner is asked OD-WS-3 (the memo) — never lit by this volume |
| S16 | no runaway | each host calls `wayLeanOf` once per decision per term (source scan); no lean multiplies another way's lean; a deviation never chains (one step from the court's way, never from a deviated way) |

---

## §13 THE COUPLINGS (each seam named; each the sibling's to confirm — the ROUTES in `cure/L-WS.md` §4)

| seam | the sibling | what this volume asks |
|---|---|---|
| the shared-signal car (fold §3.1.23) | WC (owner by the ODQ closing addition (a)) | register ONE term `way` on the four base moves |
| C3 the withdrawal threshold · C2 the posture ramp · C6 the raid weight | the war volume / WC | one call each in the landed hosts (685 · 242 · measure) |
| G1 cast · G2 (i)/(iii) · G13 order | C4 THE GENERALS | read `wayLeanOf` as the court-grain prior; the general's dials are the deviation's `commander` arm |
| BL-2 conduct bands | C4 | a feeder of `believedWayOfWarOf` |
| the motive prior (9d) | MG | MG's motive table keys; WS supplies a bundle per way over MG's motive classes (§4.2 C5 is the seed, MG's table is of record) |
| the habit sheet and `doctrineBands` | HB | the believed personality half; the two fork rows |
| the DM layer root and the pin catalogue | EM (edit mode) | `wayOfWarSet` as a declared root; `war_way_deviation` as a pinnable fork |
| the retainer offer | CH §7 | one lean under `way_coalition`/`way_raiding`/`way_attrition`; the corps unchanged |
| the believed passage cost, the mover's road, the quiet crossing | PS §5 | one patience term; the quiet-way preference |
| `knownTrailsOf` | BD | the known-ways strength (read only) |
| the trail watch and the ready keep | PR · ST | one placement/spend term under `way_harassment`/`way_logistics`/`way_fortress` |
| the pact appetite | GR | one term under `way_coalition`/`way_logistics`/`way_subversion` |
| the call on the service default | PL-4 · WC-5 | "call sooner" under `way_attrition`/`way_fortress`/`way_coalition` |
| the operative's mission | ES | "toward the foe's seat" under `way_subversion` |
| the belief record bands | IN | read only |
| the levy's harvest cost | the demographic engine (POP/EC) | ⛔ STOP WS-S1 — an OWNER row; WS reads it when it exists |
| the horse stock | MG item 11 | ⛔ STOP WS-S2 — WS reads the slot when it lands |
| the fiscal seat's war purse | FS (compiling beside this volume) | if FS lands a war-purse band, it REPLACES `treasuryBandOf` as the `purse` term (one read) |
| the opportunity on the road | OP (compiling beside this volume) | none — a traveller's detour is OP's; a way never reads a traveller |

---

## §14 THE TOKEN REGISTER (rows the fold lane is asked to add to §5; every token FREE by `rg -w -i` on the worktree's src/tests/docs and the ledger's docs)

| token / vocabulary | members / meaning | homonyms registered |
|---|---|---|
| `WAYS_OF_WAR` | `way_attrition · way_coalition · way_fortress · way_harassment · way_logistics · way_raiding · way_shock · way_subversion` (codepoint order) | `harassment` (gate verdict) · `logistics` (DEFENSE_ROLES key; the facet) · `fortress` (readiness band label) · `coalition` (gate verdict; standings kind; `governingCoalition`) · `raiding` (WC free-unit and MN menace state) · `attrition` (`attrition.js`; WC's `worn_down`) · `subversion` (threat vector) |
| `unread` | a believed way with no evidence | — |
| `WAY_SOURCES` | `derived · dm_set · dm_pinned` | — |
| `WAY_SHIFT_CAUSES` | `seat_changed · channel_moved · nerve_moved · strength_gained · strength_lost · dm_set · dm_lifted` | — |
| `WAY_DEVIATION_CAUSES` | `dm_pinned · field_lost · seat_rotting · purse_empty · levy_thin · foe_on_the_ways · ally_failed · siege_long · commander` | — |
| forks | `way_of_war_shift` (STAY) · `war_way_deviation` (DEFER, `closeOwed` HB) | — |
| flags | `wayOfWarEnabled` · `wayOfWarDeviationEnabled` · `wayOfWarBeliefEnabled` | — |
| reads | `wayOfWarOf · wayFitOf · wayPersonalityOf · wayStrengthsOf · wayOfWarForWar · wayLeanOf · believedWayOfWarOf · wayOfWarCrossingOf` | — |
| the DM root | `wayOfWarSet` | — |
| words NEVER used | `archetype` (the condition's and the seat's) · `temperament` (the world preset's; PS's) · `doctrine` (four-way homonym) · bare `way` in prose where the road rung `way` could be read | — |

---

## §15 THE RULINGS (OD-WS-1..22; by delegation under the owner's words of 2026-10-16, 2026-10-17 and 2026-10-20 — "i defer everything to your judgemetn" — vetoable; OWNER rows marked; every DRAFT constant UNMEASURED on the FP-46 roster)

| id | ruling | class |
|---|---|---|
| OD-WS-1 | P1 `wayOfWarSet`: the DM's standing setting as ONE DM-layer root on the settlement record (EM's door) | ⭐ OWNER — a persisted shape |
| OD-WS-2 | the per-war setting is a `pin-fork` on `war_way_deviation` (EM's landed shape; WS owns the fork id and words) | delegation |
| OD-WS-3 | P3 the contingent memo, lit only if the instrument measures flicker above `WAY_FLIP_CEILING` | ⭐ OWNER — a persisted shape (contingent) |
| OD-WS-4 | the closed set of EIGHT, `way_subversion` added; a sea way not added (a strength, not a way) | delegation (the owner may strike or add) |
| OD-WS-5 | NO stored court temperament: the personality is derived (the 12:31 ruling stands) | ⭐ OWNER-VISIBLE (the owner may ask for a stored one; it would be HIS shape) |
| OD-WS-6 | the feasibility gate and every physics read are never leaned (WS3) | delegation |
| OD-WS-7 | no hearing kind; one card line on the war kinds; the DM's tilt is a pin | delegation |
| OD-WS-8 | `WS_LEAN_W` = 0.12 | DRAFT, UNMEASURED |
| OD-WS-9 | `WAY_AFFINITY_STEP` 1 · `WAY_FIT_FLOOR` 2 · the defaults (`way_fortress` never warred; `way_attrition` warred) | DRAFT, UNMEASURED |
| OD-WS-10 | `WAY_DEVIATE_P` 0.5 (situation) · the `commander` probability = dial distance × 0.5 · `WAY_SIEGE_LONG` one season · the adjacency ring of §5.2 | DRAFT, UNMEASURED |
| OD-WS-11 | the price of a deviation = half weight (`WAY_DEVIATION_KEEP` 0.5) + the landed learners; no new legitimacy or cohesion write | delegation; the constant DRAFT |
| OD-WS-12 | ⛔ STOP WS-S1: the HARVEST-LABOUR COST of a marching levy is absent; `attrition`'s "harvest lost" is a slot | ⭐ OWNER ROW — new capability (the demographic engine's) |
| OD-WS-13 | ⛔ STOP WS-S2: the horse STOCK is MG's slot; the proxy until then | delegation (MG's owner row carries the shape) |
| OD-WS-14 | ⛔ STOP WS-S3: the `commander` arm and C4's choice-point leans wait on C4 | delegation |
| OD-WS-15 | the `way_*` code tokens; the prose names of §2.1 | delegation |
| OD-WS-16 | the believed carrier = HB-6 `doctrineBands` → C4 BL-2 → `unread`; IN's bands for strengths | delegation |
| OD-WS-17 | the chooser term rides the shared-signal car (WC's); WS writes no chooser line | delegation |
| OD-WS-18 | the facet rank cut ±10 points; known-ways bands `none · few · many`; chain bands `alone · few · many`; conduct thirds | DRAFT, UNMEASURED |
| OD-WS-19 | `WAY_FLIP_CEILING` two per court-decade; the instrument's 40% / 3% band; `WAY_HYSTERESIS` one step; `WAY_MEMO_HORIZON` ten years | DRAFT, UNMEASURED |
| OD-WS-20 | the alignment term (lawfulness, malice) is a personality input (requirement 13) | delegation |
| OD-WS-21 | lighting `wayOfWarEnabled` is a same-seed shift, declared and signed at WS-2's unit | ⭐ OWNER (THE PROMISE) |
| OD-WS-22 | the culture record enters only through its landed machine reads; its military PROSE is the dossier's | delegation |

---

## §16 WHAT A DM READS (felt sentences under the Evidence Law — deeds, never forecasts; SURFACE unless marked)

1. "Kell makes its wars long: it raises a levy each spring and keeps its host in the field until its enemies tire." (the dossier's line; `way_attrition`)
2. "Varn never meets an army in the open: its riders strike the grain carts on the back trails and are gone by dark." (`way_harassment`)
3. "Ashford took Corley without a storm — it held the ford and the coast road until the town's granary ran dry." (`way_logistics`)
4. "Brannoch gathered every spear it had and broke the Merewick host at the river in a single day." (`way_shock`)
5. "Merewick shut its gates, kept its keep manned, and let the Kell foragers have the fields." (`way_fortress`)
6. "Tolland fought this war with its vassals' levies and the Grey Company's swords, and paid for both." (`way_coalition`)
7. "The Fenmark riders burned three farms on the Ashford march and were home before the alarm reached the keep." (`way_raiding`)
8. "Corley's prince was overthrown by his own council the week Ashford's banners reached the walls." (`way_subversion`; SCRUTINY adds: Ashford's agents had worked the council for a year)
9. "Kell, which raises a levy each spring, this year hired the Grey Company instead — its granary was empty." (a deviation)
10. "Since its walls fell at Ashford, Merewick keeps to its keep and lets the fields go." (a shift; the age receipt)
11. SCRUTINY (the Why panel): "Kell fights the long war: its people are many, its captains have won more than they lost, and its council is a soldiers' council. Varn believes Kell will sit behind its walls — it has only seen Kell's last siege."
12. SCRUTINY (the war card at `war_declaration`): "Brannoch declares for the hammer; it believes Varn will fight from the hidden ways."

END OF VOLUME.
