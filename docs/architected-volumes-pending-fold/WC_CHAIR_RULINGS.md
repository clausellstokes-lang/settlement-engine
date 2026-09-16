# WC_CHAIR_RULINGS — THE WAR-CIRCULATION VOLUME, CR-WC-1..CR-WC-22

**DATE: 2026-08-06.**
**PREPARED UNDER OPUS 5, NOT FABLE 5.**
**⏳ OPUS-ERA — FABLE SURVEY OWED.**

> **EVERY RULING IN THIS DOCUMENT IS VETOABLE.** Each carries a single
> VETO SENTENCE stating the one thing a future session would need to
> believe in order to flip it. A veto costs one word today; discovering
> the same call baked into a landed wave costs the wave.

**WHAT THIS DOCUMENT IS.** Rulings prepared against
`docs/architected-volumes-pending-fold/WC_war-circulation_in-progress-snapshot.md`
(6,492 lines), whose §6 held twenty-two open chair questions and whose
closing line read "Chair questions CR-WC-1..CR-WC-22 await rulings".
Seventeen waves in four arcs were undispatchable behind them; WC-15 was
blocked outright by CR-WC-21's "BOTH POSITIONS, NEITHER TAKEN".

**THE AUTHORITY THIS CONSUMES, AND ITS FOUR HOLES.** The owner's blanket
queue sign-off (`memory/owner-blanket-queue-signoff.md`; the repo-side row
in `docs/FABLE_VALIDATION_QUEUE.md`) signs every queued owner-gated item
**per the chair's recorded recommendation for that item** — a signature
RELEASES a blocked-but-recommended item to build at its queue position and
RATIFIES a recommended-defer item AS DEFERRED. **A BLANKET GRANT DOES NOT
FLIP A PARK INTO A BUILD**, and four carve-outs survive it: (1) legal
sign-off, (2) the V5 aesthetic cull, (3) the constitutional TUNING
SIGNATURE, (4) per-push confirmations. **NOTHING BELOW RULES INSIDE ANY
CARVE-OUT.** In particular: every band, edge, weight and curve this volume
authors stays RAW-AUTHORED and enters `proposedSoakBands.js` only at the
soak, on a specific owner act. Where a ruling below fixes a SHAPE whose
NUMBERS are tuning, it says so in terms.

**⛔ WHAT THIS DOCUMENT DOES NOT DO.** No ruling here presents itself as
the owner having specifically considered it. Four classes were held back
from self-ruling regardless of the blanket sign-off — persisted-state
shape and public-API surface, data deletion, security posture and paid
surfaces, and anything the volume or the owner marks parked. **ONE
QUESTION ESCALATES ON THAT GROUND: CR-WC-9.** One more (CR-WC-18) is
recorded as consuming an existing owner act rather than as a fresh ruling.

---

## §A — THE GOVERNING PRINCIPLE FOR THE SIX COLLISIONS

Six questions (CR-WC-2, CR-WC-3, CR-WC-4, CR-WC-5, CR-WC-21, CR-WC-22)
are directive-versus-law collisions that §0.1 parked rather than resolved.
They are ruled under one principle, stated here once:

> **THE OWNER'S DIRECTIVE EXPRESSES INTENT; A PROGRAM LAW EXPRESSES A
> MECHANISM PROVEN BY MEASUREMENT. When the two truly collide, the
> resolution is to HONOR THE INTENT THROUGH A DIFFERENT MECHANISM —
> never to overrule the measurement, and never to silently narrow the
> intent. Where no such resolution exists, say so rather than
> manufacture one.**

Applying it requires a prior finding on each: **is the collision REAL, or
an artifact of imprecise wording?** A collision is an ARTIFACT when the
directive's word carries a connotation the owner's own gloss disclaims —
the classic shape here is a terrain-flavored idiom for a non-terrain
intent, or a person-flavored idiom for a conservation intent. An artifact
is dissolved by reading, not by trading anything away. A REAL collision
costs something, and the ruling must name the cost.

**THE FINDING, ALL SIX:** five are ARTIFACTS OF WORDING (CR-WC-2,
CR-WC-3, CR-WC-4, CR-WC-5, CR-WC-21). **ONE IS REAL: CR-WC-22** — two
live gates in built code genuinely forbid the directive's central cases
through the levy surface. It is the one that gets the different-mechanism
treatment in its strong form, and the volume had already applied it
correctly before the question was asked.

---

## §B — THE VERIFY-AT-BUILD PREMISE LEDGER

Standing law: **LIVE CODE OUTRANKS EVERY TABLE**, and a doc overstatement
is a STOP-and-report. Every ruling below that rests on a claim about live
code has that claim checked here against the build worktree
`/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`,
branch `claude/composite-r4`, **HEAD `cbd348a5`** — which is byte-exactly
the sha the volume's own round-3 re-measure names ("re-measured at HEAD
cbd348a50567114b8743508f9ff954d39123d32b"). **The volume's measurement
base and the current build tree are the same commit: CONFIRMED.**

### B.1 — THREE CORRECTIONS THAT CHANGED A RULING

**⚠️⚠️ B.1a — THE bandFamilies OWNERSHIP CLAIM IS OVERSTATED, AND IT
FLIPS CR-WC-19.** §5.2 states "The standing law gives bandFamilies.js
ownership of magnitude/severity/significance scales", and CR-WC-19's
recommendation (b) rests entirely on "bandFamilies.js is the declared
owner". **MEASURED AT HEAD, `src/domain/worldPulse/bandFamilies.js`'s own
header reads: "SP-6a SIGNIFICANCE and SP-6b SEVERITY, THE TWO BAND
FAMILIES, MINTED ONCE HERE. Volumes ASSIGN their kinds to a class; no
volume authors a scale."** It declares exactly two exports —
`SIGNIFICANCE_CLASSES` (:75) and `SEVERITY_LADDER` (:85). **The word
"magnitude" is not a scale name in that file, and no magnitude family
exists there to assign a kind to.** The project memory index agrees with
the code and not with the volume: it records bandFamilies as owner of
"decay law or significance/severity scale" — magnitude is absent from
both. **TWO DOCUMENTS DISAGREE AND THE DISAGREEMENT IS REPORTED RATHER
THAN RESOLVED SILENTLY: the volume claims three families, the file
declares two.** CR-WC-19 is ruled on the file. STATUS: **CONFIRMED
(refutation).**

**⚠️ B.1b — "MEASURED SILENT" IS AN EMPIRICAL ZERO, NOT DEAD CODE, AND IT
STRENGTHENS CR-WC-22's HOLD.** §1.1 fact 4 and CR-WC-22's POSITION LIFT
both lean on the levy sweep being "measured silent". The bytes at
`src/domain/certification/subsystemRowsWar.js` do carry the words —
":54 `war_levy fires ZERO times in every case while its siblings fire`"
and ":202 `MEASURED SILENT, and that is this row's whole point`" — but the
same row **traces a live, reachable path and names the suppressor**:
"LEVY_POP_RATE_PER_TICK 0.004 against LEVY_POP_FLOOR 300 means a source
under roughly 550 people levies nobody at all." **The sweep is silent on
the seven completed release cases, not structurally dead.** A corpus with
larger settlements would fire it. This makes LIFT's "silent anyway"
argument materially weaker and LIFT's own stated cost ("it would make WC's
arrival ledger inherit a corpus nobody has measured") materially heavier.
STATUS: **CONFIRMED (nuance that moves the weight, not the direction).**

**⚠️ B.1c — A LINE-ADDRESS IMPRECISION ON THE WR-6 CITATION, CITED THREE
TIMES.** The volume cites the WR-6 peer-levy comment as
`warHomeCosts.js:115-116` at §0.3, at §1.1 fact 2, and at CR-WC-22.
**MEASURED: the comment occupies :114-115 and the gate it explains is the
CODE at :116** (`if (coalitionLit && relState.relationshipType !==
'vassal') continue;`). The SUBSTANCE is confirmed exactly — comment text
and gate both present and saying what the volume says. Only the address is
off by one line, in three places. **This is the hand-keyed line-address
rot class §5.7 forbids, realized inside the volume that forbids it.** The
correct citation is `:114-115` (comment) and `:116` (the gate); a fold
sweep should repoint all three. STATUS: **CONFIRMED (substance), PARTIAL
REFUTATION (address).** No ruling changes.

**⚠️⚠️ B.1d — TWO OF WC's FOUR ADMISSION SPELLINGS ARE DEAD AT HEAD. A NEW
FINDING, NOT A CHAIR QUESTION, AND IT IS THE DEAD-BAND CLASS REALIZED
INSIDE THE VOLUME'S OWN NEW ROAD.** §1.1's admission set for a
sender-elected contribution is enumerated as "**ALLIED / ALLY /
DEFENSIVE_PACT**", stated to be "enumerated against the LIVE
relationshipType vocabulary". **MEASURED: two of those three spellings
cannot be reached.**

- **`'ally'` is STRUCTURALLY dead.** It is itself an *alias key* in
  `RELATIONSHIP_TYPE_ALIASES` (`relationshipState.js:113-128`) mapping to
  `'allied'`. **`normalizeRelationshipType` can never emit the literal
  string `"ally"`** — the alias table intercepts it first, by
  construction.
- **`'defensive_pact'` is EMPIRICALLY dead, by a different mechanism, and
  the difference matters.** It is *not* an alias key, so it would pass
  through the normalizer unchanged if anything wrote it. **Nothing does.**
  The canonical written vocabulary (`RELATIONSHIP_DEFAULTS`,
  `relationshipState.js:19-110`) is `neutral, trade_partner, allied,
  patron, client, vassal, rival, cold_war, hostile, criminal_network` —
  **`defensive_pact` is not among them and has no producer in `src/`.** It
  survives only inside membership Sets (`LEVY_SUPPORT_TYPES`
  `warHomeCosts.js:79`, `ALLY_SUPPORT_TYPES`, `ALLY_LIKE`, and
  `warAllianceRisk.js`'s own weight array).

**CONSEQUENCE:** of WC's admission set, only **`allied`**, **`vassal`**
and the occupation ladder are live roads. This does not break the
volume — the allied arm still works through `'allied'` — **but it means
WC would land two admission arms that no fixture can exercise and no
seeded world can reach**, which is exactly the POINTS-GAP / dead-band
class §5.5 commits every WC band edge to checking. **Recorded as
obligation O-9.** STATUS: **CONFIRMED.**

**⚠️ B.1e — `isDemographicColumn` DOES NOT DISCRIMINATE MILITARY FROM
CIVILIAN, AND THE VOLUME'S ROUND-3 REPAIR IS RIGHT FOR A REASON THE
VOLUME DOES NOT STATE.** **MEASURED: `DEMOGRAPHIC_COLUMN_CLASSES =
['refugee', 'voluntary']` (`migration.js:474`), and `isDemographicColumn`
(:483-486) arbitrates between TWO CIVILIAN LANES** — the P2 demographic
homeostat's columns versus M4's crisis-migration columns — failing closed
toward M4. **Armies do not enter this structure at all today: they live in
the separate `armyTransit` sub-ledger, which has no `travelClass`
concept.** The boundary against armies is **ARCHITECTURAL (separate
ledger, separate kernel), not this predicate.**

**The volume's round-3 repair is nonetheless CORRECT**, and its stated
consequence holds: a `reinforcement_column` stamped with a military
`travelClass` returns `false` from `isDemographicColumn`, falls through to
`if (col.arrivalTick <= now)`, and **is released by M4's arrival pass into
`destId`'s census.** **But the reason it is exposed at all is that WC
DELIBERATELY DISSOLVES THE EXISTING ARCHITECTURAL BOUNDARY** — §0.2 places
military columns in the *migration* column ledger, "military and
demographic columns are ONE object class per directive (m)". **WC is
trading an architectural separation for a predicate-based one, and the
`isDemographicColumn` widening is the first consequence of that trade, not
an incidental repair.** No chair question captures this trade. **Recorded
as obligation O-10;** the persisted half of it rides CR-WC-9's escalated
batch. STATUS: **CONFIRMED.**

### B.2 — PREMISES CONFIRMED AS STATED

| # | Premise | Address | Status |
|---|---|---|---|
| P1 | Deployer exclusion builds the exclude set with `...Object.keys(deployments).map(String)` | `warHomeCosts.js:391` | **CONFIRMED**, byte-exact |
| P2 | Its in-file rationale (:386-390) is about DOUBLE-LEVY across overlords and floors, and says nothing about self-deployers | `warHomeCosts.js:386-390` | **CONFIRMED** — the self-deployer arm is genuinely unargued |
| P3 | WR-6 peer-levy removal, comment text as quoted | `warHomeCosts.js:114-116` | **CONFIRMED** (see B.1c on the address) |
| P4 | `warHomeCosts.js:443-450` is the levy-map write (merges per-source counts into `leviedPopulationBySource`) | `warHomeCosts.js:443-451` | **CONFIRMED** |
| P5 | A magnitude ladder `['unknown','trifling','modest','substantial','great','crown_jewel']` exists | `sovereigntyAppraisal.js:104-106`, exported as **`SOVEREIGNTY_VALUE_BANDS`** | **CONFIRMED** — the file calls it a "value ladder", not a "magnitude ladder" |
| P6 | `PRESSURE_BANDS` is 4-rung with `decisive` on top | `envoyNegotiationPictureBuilder.js:28` | **CONFIRMED**, byte-exact |
| P7 | Largest-remainder apportionment precedent exists | `deploymentReturn.js:270-346`, in `deploymentReturnOutcomes` (declared :233) | **CONFIRMED** — floor + remainder sort with codepoint tie-break |
| P8 | `bandedStock.js` owns half-life decay; throws on unknown band | `bandedStock.js:53` (`HALF_LIFE_BANDS`), `:113` (`decayTowardNeutral`), `:91-92` (throw) | **CONFIRMED** |
| P9 | `armySupply.js` does not exist (WY-8a unbuilt) | absent from `src/` | **CONFIRMED (absence)** |
| P10 | SOL_QUEUE row 23a carries the TB tribute family | `docs/SOL_QUEUE.md:246,:252` | **CONFIRMED** |
| P11 | SOL_QUEUE carries NO war-auxiliary / WC row | `docs/SOL_QUEUE.md` — zero hits | **CONFIRMED (absence)** |
| P12 | The owner parked the hireable mercenary FORCE MARKET | `memory/war-auxiliary-contribution-directive.md:101-102`, verbatim: "Hireable mercenary FORCE MARKET recorded as a parked future-widening (owner question)" | **CONFIRMED** |
| P13 | Directive (e)'s payoff is an adventuring CLASS via institutions + pool, not parties | same file, :96-102 | **CONFIRMED** |
| P14 | The volume's measurement sha equals the current build-tree HEAD | `cbd348a5` both sides | **CONFIRMED** |
| P15 | `MOVEMENT_SITES` is a named-person physics census; header reads "intentionally a physics census, not a census of all entity placement writes"; `DISCOVERY_RE` keys entirely on named-person tokens; `armyTransit` matches **zero** of them | `tests/lint/namedPersonTransitTotality.walker.test.js:1-13` (header), `:23` (regex), `:31` (manifest) | **CONFIRMED** — and `armyTransit.js:25-28` independently declares the named-character boundary ("armies are AGGREGATE units ... holds no npc ids, reads no roster") |
| P16 | `stepArmyPosition` call sites at `:467, :502, :698, :742`, symbol imported at `:33` | `armyTransitKernel.js`; defined at `spatial/armyTransit.js:371` | **CONFIRMED**, addresses exact |
| P17 | `migrationKernel.js`'s `releaseMigrationArrivals` (:336) over `spatial/migration.js`'s `releaseArrivals` (:578) | both | **CONFIRMED** |
| P18 | `LAW_WORD_EDGES` estate default is 0.67 / 0.33; `lawWordFor` at :71 | `lawWord.js:56`, `:71` — `Object.freeze({ lawful: 0.67, lawless: 0.33 })` | **CONFIRMED**, byte-exact |
| P19 | `security01Of` implements a **worse-of** discipline over two inputs | `demographicsPushPull.js:375-389` — "The WORSE of the two existing exposures ... **Taking the worse rather than blending them** means a settlement cannot launder a live crime wave behind a comfortable generation-time score" | **CONFIRMED** — a near-exact precedent for CR-WC-8(iii)'s reasoning |
| P20 | `APPLY_STRESSOR` / `RESOLVE_STRESSOR` are canon event types | `crisisLifecycle.js:87`, `events/registry.js:549` and `:597`, `events/mutate.js:100`/`:103` | **CONFIRMED** |
| P21 | `spatialLedgers` is **PERSISTED** | listed in `CONDITIONAL_LEDGER_KEYS`, `worldState.js:401-404` | **CONFIRMED** — this is what makes CR-WC-9 genuinely a schema question |
| P22 | `deployment` has **no** `blocks` field today | `warDeployment.js` / `warCosts.js` / `warHomeCosts.js` / `deploymentReturn.js` — zero data-field hits | **CONFIRMED (absence)** |
| P23 | `leviedPopulationBySource` is `Record<string, number>` on the deployment record | `warHomeCosts.js:442-451`, read at `warCosts.js:367` | **CONFIRMED** |
| P24 | `isDemographicColumn` fails closed toward M4 | `migration.js:474`, `:483-486`; release guard inside `releaseArrivals` at `:590-606` | **CONFIRMED** (see B.1e for what it actually discriminates) |

### B.3 — PREMISE STATUS AFTER VERIFICATION

**Seven of the eight premises this document opened as UNVERIFIED were
measured and CONFIRMED.** They are listed here with their resolutions
rather than deleted, so a future session can see what was checked and what
the check changed.

- **U1 — RESOLVED, CONFIRMED WITH A PRECISION THAT CHANGES THE DEFERRAL
  NOTE (CR-WC-13).** Both weights are dead, **but by two different
  mechanisms, and the difference is load-bearing.** `'ally'` is
  **structurally** dead (an alias key that normalizes to `'allied'` —
  the normalizer cannot emit it). `'defensive_pact'` is **empirically**
  dead (not aliased, would pass through, but nothing in `src/` writes it).
  **So the deferral note may say "behavior-neutral today" only of the
  `'ally'` arm; the `'defensive_pact'` arm is one producer away from
  becoming live.** See B.1d — the same two spellings are dead in WC's own
  admission set.
- **U2 — RESOLVED, CONFIRMED IN FULL (CR-WC-10).** See P15. The
  second-manifest ruling no longer rests on an unverified header.
- **U3 — RESOLVED, CONFIRMED WITH A REFINEMENT THAT AVOIDS AN ESCALATION
  (CR-WC-11).** The event pair exists (P20). **But the CATALOG stressor
  definition has NO `source` / `sourceRef` field** (`STRESSOR_CATALOG`,
  `stressorsCore.js:54-63`, and `normalizeStressor` likewise). What does
  carry a source is the **fired instance**: `crisisLifecycle.js:272-281`
  writes `source: 'event', addedByEventId: event.id`, and a condition's
  `causes` array carries `{ source: 'event', eventId, detail }` (`:335`).
  **This changes how CR-WC-11 must be built — see the refinement in its
  entry.**
- **U4 — RESOLVED, CONFIRMED IN FULL (CR-WC-8(i), 8(iii)).** See P18, P19.
- **U5 — RESOLVED, CONFIRMED IN FULL, AND IT STRENGTHENS THE ESCALATION
  (CR-WC-9).** See P21, P22, P23.
- **U6 — STILL UNVERIFIED, AND STILL NOT RELIED ON.** The
  nine-times/two-arities intensity-ladder census (§5.2). CR-WC-19 is ruled
  without it.
- **U7 — RESOLVED, CONFIRMED, WITH A REFUTATION OF WHAT THE PREDICATE
  DISCRIMINATES.** See P24 and B.1e.

**WHAT REMAINS UNVERIFIED AND IS RELIED ON, STATED AFFIRMATIVELY:**

- **U6** above (not load-bearing).
- **U8 — `settlementStrategy.js` has no closed exported move vocabulary
  today** (`enumerateMoves` module-private at `:634`, bare re-export at
  `:1360`), carried from the volume's own measurement and **not
  independently re-measured by this lane.** CR-WC-1 is *robust to it being
  wrong*: if a closed vocabulary already exists, both volumes amend and
  neither mints, which the at-most-one fence catches automatically.
- **U9 — the WY §2a field-batch precedent's exact table shape**, cited by
  CR-WC-9's recommendation. **Not re-measured.** It affects the table's
  form, not whether one is owed.

---

## §C — THE RULINGS

---

### CR-WC-1 — THE MOVE-VOCABULARY MINT

**THE QUESTION.** Who mints the closed strategist move vocabulary that
both this volume's WC-4 and the (unarchitected) habit volume's HB-1 want
to create — HB-1 or WC-4?

**THE ARMS AS THE VOLUME STATES THEM.** (a) HB-1 mints and WC-4 amends;
(b) WC-4 mints and HB-1 amends; the volume's §4.1.1 contract makes either
order safe, and its recommendation is "build-order decides", with a stated
preference that HABIT mints because the chooser is habit's subject matter.

**THE RULING. BUILD-ORDER DECIDES, AND WC-4 DOES NOT WAIT FOR HB-1 — BUT
THE RULING IS THE FENCE, NOT THE PREFERENCE.** Whichever volume reaches
its strategy wave first mints `strategyMoveVocabulary.js` as a
dependency-free leaf; the second amends it additively. **The load-bearing
half of this ruling is §4.1.1's STRUCTURAL repair: the AT-MOST-ONE
single-exporter source scan lands in WC-0**, the registration wave, before
either volume's strategy wave — pinned at at-most-one (zero is the tree's
legal state today, two is never legal), tightening to exactly-one in
whichever volume mints.

**REASONING.** The preference for HABIT is sound on subject-matter grounds
and worthless as a gate: **the habit-conditioning directive is NOT YET
ARCHITECTED**, so gating WC-4 on HB-1 would stall ARC A behind a volume
that does not exist. §4.1.1 states the asymmetry precisely — "a
source-scan pin that only exists once WC-4 builds cannot restrain the
volume that builds FIRST". A race is safe only if the fence precedes both
racers, so the fence is the ruling and the order is left to the queue.
Measured support: `settlementStrategy.js` has no closed exported move
vocabulary today (`enumerateMoves` module-private at :634, bare re-export
at :1360) — **UNVERIFIED, carried from the volume's own measurement**; if
it turns out one already exists, both volumes amend and neither mints,
which the at-most-one fence catches automatically.

**WAVES.** Unblocks **WC-0** (which gains the fence as a LANDS row) and
**WC-4**. Changes nothing else.

**CHAIR-RULED.** No gate touched: a test-side source scan is neither
persisted shape nor public API.

**⚠️ TWO ARTIFACTS OWED AND NOT DISCHARGED HERE.** §4.1.1 records that the
arbitration must also be written INTO the habit directive's memory file as
an INBOUND OBLIGATION on HB-1, and carried as a row in
`FABLE_VALIDATION_QUEUE.md`. **This lane could write neither** (the
validation queue lives in the build worktree, which this lane may read and
never write). **Until both artifacts exist, the arbitration is a
RECOMMENDATION WITH A FENCE, NOT A CONTRACT** — §4.1.1's own words, and
they remain true after this ruling. Recorded in §F as obligation O-1.

**VETO SENTENCE.** Veto if the chair wants WC-4 hard-gated behind HB-1's
mint rather than racing it under an at-most-one fence — which trades ARC
A's schedule for a contract with two signatures instead of one.

---

### CR-WC-2 — COUNTS OR NAMES *(collision 1 of 6)*

**THE QUESTION.** Is a person in the people ledger a COUNT or a NAME?

**BOTH POSITIONS, FAIRLY.**

- **THE DIRECTIVE'S POSITION.** The composite-armies extension is
  verbatim: "THE PEOPLE LEDGER is the spine: census -> block -> composite
  army -> losses/returns/orphans -> census|defense|free-lance pool --
  **every person conserved end to end**, walker-enforced." "Every person"
  is individual language. A ledger of named members would honor it most
  literally, and would let a DM follow one soldier out and back.
- **THE LAW'S POSITION.** PRODUCT SCOPE is world-only and **NEVER RESOLVES
  A NAMED CHARACTER'S FATE**; the sanctioned named-mover plane is the
  roads layer. A blocks-members roster of named people would put the
  engine in the business of deciding, per name, who died at a siege —
  which is the exact act the boundary exists to forbid — and would drag
  named-person telemetry hygiene across the whole war surface.

**REAL OR ARTIFACT: ARTIFACT.** The owner's sentence is a **CONSERVATION**
claim, not an identity-tracking claim. Read it with its own trailing
clause — "every person conserved end to end, **walker-enforced**" — and
the payoff being asked for is that nobody vanishes on any leg of the
journey, enforced by a machine. **Integer conservation satisfies that
exactly and totally.** The word "person" is doing the work of "no one is
lost", not of "each individual is individually addressable". Nothing in
the directive asks to follow a named soldier, and §0.2 was written
counts-first without the model changing shape.

**THE RULING: COUNTS — AND THE INTENT IS HONORED BY A DIFFERENT MECHANISM
THAN NAMING, WHICH DELIVERS MORE IDENTITY FIDELITY THAN NAMING WOULD.**
The mechanism is **ORIGIN-TAGGED COUNTS PLUS THE ROUND-TRIP BYTE-IDENTITY
PIN**. §0.2 makes origin immutable ("a person has exactly one origin"),
banks the drawn composition onto `blocks[].drawnCohorts` at `muster` and
`dispatch`, carries it home on `depart`, and restores it row-for-row at
`arrive_home`. WC-16's pin then asserts that a muster followed by a return
leaves `residentCohorts` **BYTE-IDENTICAL PER ROW, not merely equal in
total**.

That is the whole point and it is worth stating plainly: **a naming scheme
would have been checked by a weaker test.** LAW 1 closes on a laundered
cohort because the sum never moves — the volume found exactly that defect
in round 3, where `arrive_home` re-keyed foreign-origin veterans into the
host's self-origin row with no named event and no walker arm. The counts
model, pinned per-row on a round trip, catches it. A named roster's
conservation check would have been a set-equality on names, which is a
*weaker* statement about origin than a per-row composition identity.

**WAVES.** Unblocks **WC-6** (the block rosters and the conservation
walker), **WC-13**, **WC-15**, **WC-16**. **AND IT IS A PRECONDITION FOR
CR-WC-10** — §1.7.3 declines to widen `MOVEMENT_SITES` precisely "against
this volume's own CR-WC-2 ruling that the people ledger is counts", so
CR-WC-10 cannot be ruled before this one. **Rule CR-WC-2 first; CR-WC-10
inherits.**

**CHAIR-RULED.** The counts arm is the volume's architected shape, so
ruling it changes no persisted shape. **The naming arm would have been an
escalation** — a world-boundary change plus a telemetry-class flip.

**VETO SENTENCE.** Veto if the chair reads "every person" as a demand for
individually addressable members rather than for machine-enforced
conservation — in which case the cohort/roster telemetry class flips to
EXEMPT with the npcLedger reasoning, and CR-WC-10 must be re-taken.

---

### CR-WC-3 — THE ADVENTURING-CLASS LINE *(collision 2 of 6)*

**THE QUESTION.** Directive (e) says the world generates its own
adventuring class; PRODUCT SCOPE boundary 1 excludes rival adventuring
parties. Where is the line?

**BOTH POSITIONS, FAIRLY.**

- **THE DIRECTIVE'S POSITION**, verbatim at
  `war-auxiliary-contribution-directive.md:96-102`: demobilization raises
  "mercenary + adventure institutions where veterans pool (FOUNDED if
  absent)", the orphan branch feeds the free-lance pool, "**⭐ the world
  thereby GENERATES ITS OWN ADVENTURING CLASS WITH REASONS (launch-copy
  grade)**". The owner marks this launch-copy grade — it is a headline
  payoff, not a detail.
- **THE LAW'S POSITION.** World-only; no rival adventuring parties. An
  engine that stands up adventuring parties is an engine that must resolve
  their fates, which is the boundary's whole content.

**REAL OR ARTIFACT: ARTIFACT — AND THE OWNER DREW THE LINE HIMSELF IN THE
SAME PARAGRAPH.** A CLASS and a PARTY are different objects. A class is a
demographic fact about a settlement (there are hireable veterans here, and
a mercenary hall). A party is a resolved actor. The two words share a
stem and nothing else. **Decisively: the very next sentence of the
directive reads "Hireable mercenary FORCE MARKET recorded as a parked
future-widening (owner question)" — CONFIRMED at :101-102.** The owner
asked for the class and parked the market in one breath. There is no
collision to resolve; there is a line the owner already drew.

**THE RULING: INSTITUTIONS PLUS FREE-LANCE COUNT POOLS AS BACKGROUND
TEXTURE. NEVER PARTY-FACING ACTORS, NEVER A RESOLVED RIVAL PARTY. THE
HIREABLE FORCE MARKET STAYS PARKED, AND THIS RULING DOES NOT UNPARK IT.**

**REASONING.** The owner's payoff is delivered in full by the two surfaces
he named: institution presence (founded if absent, decaying through
extended peace) and the `free_lance` overlay tag over census. A DM reading
a post-war town sees hireable veterans and a mercenary hall with reasons
attached — launch-copy grade, exactly as asked. What is withheld is only
the thing the owner withheld. **The structural proof that this line holds
is already in §0.2: the `enlist` event is census -> block "a free-lance-
tagged resident takes service in the hiring SETTLEMENT'S OWN roster ...
NOT the mercenary force market, which the owner parked."** Every road out
of the free-lance pool terminates in a settlement's own roster. There is
no event in the closed COUNT_EVENTS list that hires a pool member to a
party, so the boundary is enforced by the vocabulary rather than by
authorial restraint.

**WAVES.** Unblocks **WC-14** (homecoming and the pulse) and **WC-12**'s
brigand institutions. Bounds **WC-16**'s `enlist` arm.

**CHAIR-RULED.** It preserves an owner park rather than crossing it.
Unparking the force market would be owner-gated and is not done here.

**VETO SENTENCE.** Veto if the chair reads "generates its own adventuring
class" as requiring a party-shaped object the engine resolves — which
would reopen the force market the owner explicitly parked, and is his call
and not the chair's.

---

### CR-WC-4 — THE SUB-CENTURY HORIZON *(collision 3 of 6)*

**THE QUESTION.** Diaspora and veteran cohorts fade generationally;
PRODUCT SCOPE boundary 2 caps the product at sub-century. Do they collide?

**BOTH POSITIONS, FAIRLY.**

- **THE DIRECTIVE'S POSITION.** (n) and (o) ask for diaspora bonds and
  veteran cohorts that fade with the carriers — "first-generation memory
  dies with the first generation" — and for veterans to matter to the next
  war. "Generational" invites a multi-generation clock.
- **THE LAW'S POSITION.** Sub-century. A dynastic fade is a clock the
  product does not run, and a fade whose interesting part starts at year
  110 is a mechanic no campaign ever sees.

**REAL OR ARTIFACT: ARTIFACT, AND THE OWNER'S OWN GLOSS SETTLES IT.** The
directive does not say "generations", plural. It says **FIRST**-generation
memory dies with the **FIRST** generation — one generation, which is
twenty to forty years, comfortably inside a century. The word
"generational" was never asking for a dynasty.

**THE RULING: COHORT AGE BANDS SIZED TO A 20-40 YEAR ARC, THE WHOLE FADE
LEGIBLE INSIDE ONE CAMPAIGN LIFETIME, RETIREMENT BY MORTALITY, NO DYNASTIC
CLOCKS AND NO INHERITED COHORT TAGS.**

**REASONING, AND THE PART THAT MATTERS MOST.** The band edges are a tuning
choice and tuning choices drift. **What makes this ruling structural
rather than a preference is §0.2's `birth` event, which carries NO TAG
ARM:** "A newborn takes NO cohort tag and NO free_lance overlay ... a
birth that credited its parents' cohort would make every long-lived
diaspora row grow without a single arrival, and directive (n)'s
'first-generation memory dies with the first generation' would be false by
arithmetic." **A cohort tag therefore cannot propagate into a second
generation by construction, not by band sizing.** The sub-century boundary
is enforced by the event vocabulary; the band edges only decide how the
single generation's arc is narrated. That is the right division, and it
means a mis-tuned edge is a legibility bug rather than a boundary breach.

**⛔ THE CARVE-OUT LINE, STATED IN TERMS.** This ruling fixes the **SHAPE**
(three bands, one generation, mortality retirement, no inheritance). It
does **NOT** sign `AGE_BAND_EDGES_YEARS` (5 / 20) or any other number.
**Those are TUNING and TUNING IS CARVE-OUT 3** — constitutional, presented
at soak for a specific owner act, never pre-executed. §7.B's row stands
raw-authored.

**WAVES.** Unblocks **WC-15** jointly with CR-WC-21, and bounds
**WC-16**'s veteran reads.

**CHAIR-RULED** as to shape; **the numbers are not ruled and cannot be.**

**VETO SENTENCE.** Veto if the chair wants a multi-generation diaspora
arc, which would require minting a tag-inheritance arm on `birth` and
would put the interesting part of the mechanic outside the product's
declared horizon.

---

### CR-WC-5 — THE CLOUD-WORLD RE-EXPRESSIONS *(collision 4 of 6)*

**THE QUESTION.** Two directive clauses are terrain-physics claims as
written — the forage radius ((i)/(l)) and campaign seasons from winter
burn ((j)). PRODUCT SCOPE boundary 6 (the cloud-world test) forbids
geophysical constants and demands cause-agnostic consequences. Confirm the
volume's two re-expressions?

**BOTH POSITIONS, FAIRLY.**

- **THE DIRECTIVE'S POSITION.** An army in the field forages over a
  radius; campaigns have seasons, and winter burns supplies. Both are
  concrete, both are what the owner wrote, and both carry real mechanical
  payoffs: armies cannot mass without limit, and there are times when
  campaigning costs more.
- **THE LAW'S POSITION.** SETTING-AGNOSTIC, the cloud-world test: a world
  with no ground has no forage radius and no winter. A terrain constant
  authored into a domain leaf makes the engine assume a geography it was
  built not to assume.

**REAL OR ARTIFACT: ARTIFACT — A TERRAIN-FLAVORED IDIOM FOR A NON-TERRAIN
INTENT.** Strip the flavor and ask what each clause buys. The forage
radius buys **a cap on how much force a place can sustain**. The campaign
season buys **a periodic cost modulation on being in the field**. Neither
payoff mentions ground once you state it.

**THE RULING: CONFIRM BOTH RE-EXPRESSIONS.**

- **FORAGE RADIUS -> NETWORK CARRYING CAPACITY.** What the settlement
  NETWORK can feed: settlements x tier x stores, no terrain radius. The
  constraint survives whole; the geography does not.
- **CAMPAIGN SEASONS -> THE EXISTING SEASONAL-SEVERITY ABSTRACTION**,
  whatever a given world's seasons mean. A cloud-world's storm season
  modulates the same way a winter does — cause-agnostic consequence,
  exactly as the product-scope law words it.

**REASONING.** This is the governing principle in its cleanest form: the
intent is honored through a different mechanism, the measurement (the
cloud-world test, which the product has already committed to) is not
overruled, and **the intent is not narrowed** — both mechanical payoffs
survive at full strength. Note also that the re-expression is not a
concession: network carrying capacity composes with the rest of this
volume (relay hops, stores, tier) in a way a radius never could, because
the volume has no terrain plane to read a radius from.

**⚠️ ONE ADDITION BEYOND THE VOLUME'S RECOMMENDATION — JUDGMENT, VETOABLE.**
§0.3 states "no terrain constant is authored anywhere in this volume" as a
**PROSE CLAIM**. This estate's standing practice is that a claim which a
future wave can silently falsify becomes a SCAN, not a sentence. **RULING:
WC-0 lands a source-scan fence asserting no terrain-keyed constant in any
WC leaf, alongside the two single-exporter scans §4.1.1 and §4.1.2 already
place there.** Cost is one scan in a wave that is already minting two.
Benefit is that boundary-6 compliance survives sixteen further waves
without anyone re-reading this ruling.
**JUDGMENT: chose a source-scan fence over the prose claim because the
estate's structural-prevention habit converts exactly this shape of claim
into a guard — say "veto" to flip it back to prose.**

**WAVES.** Unblocks **WC-10** (endurance and concentration) and
**WC-11**'s carrying-capacity arm; adds one LANDS row to **WC-0**.

**CHAIR-RULED.**

**VETO SENTENCE.** Veto if the chair holds that a terrain constant is
acceptable where the directive used terrain language, which would reopen
boundary 6 for the whole family and not just for this volume.

---

### CR-WC-6 — STANCE PERSISTENCE

**THE QUESTION.** Is the war stance a persisted typed field or a pure
derived band?

**THE ARMS.** (a) Persisted typed field on the deployment or relationship
record; (b) pure derived, computed at read time from persisted facts.

**THE RULING: PURE DERIVED. NO SCHEMA SURFACE, NO MIGRATION, NO
STALENESS.**

**REASONING.** Three independent arguments, and the third is decisive.
First, the derivation is cheap and its inputs (deployments, contribution
receipts) are already persisted facts, so a stored copy buys nothing and
owes a staleness story. Second, §1.2.2 already commits: "There is NO
persisted stance field", with a grep-fence pin at WC-2 and a companion
scan asserting no consumer calls `warStanceOf` with an anchor key. Third
and decisively: **the stance is keyed per WAR EPISODE
(`<originAttackerId>:<originSinceTick>`), and no persisted record is
episode-keyed.** Anchors nest under episodes and the anchor-to-episode map
is explicitly "derived from the deployments' targets and their join
anchors, never stored". A persisted stance field would therefore need a
new episode-keyed home invented for it — which is a schema act to store a
value that is cheaper to compute than to key.

There is also a conservation-of-authority argument that should be visible:
**the derived arm is the one inside chair authority.** Ruling (a) would
create persisted state and would be an escalation under this document's
own limits. Ruling (b) creates none.

**WAVES.** Unblocks **WC-2** (the derived stance) and everything reading
stance: WC-4, WC-5, WC-7, WC-9.

**CHAIR-RULED**, and note it is ruled *toward* the arm that touches no
persisted shape.

**VETO SENTENCE.** Veto if the chair wants a DM-declared stance dial,
which is a separate owner-gated widening that would make stance persisted
state and would need its own episode-keyed home.

---

### CR-WC-7 — THE coalitionShares SHIFT

**THE QUESTION.** WC-2 replaces the coalition strength split with a
contribution split at `coalitionShares`. Approve the behavior shift?

**THE ARMS.** (a) Approve as a declared lit-only shift with a one-time
golden record at lighting; (b) refuse, keeping the strength split.

**THE RULING: APPROVE, AS A DECLARED LIT-ONLY BEHAVIOR SHIFT, WITH A
ONE-TIME GOLDEN RE-RECORD AT LIGHTING AND ITS CAUSE STATED IN THE SAME
COMMIT.**

**REASONING.** The shift IS directive (f) — "realized stance outranks
declared" — made arithmetic. A coalition's spoils and terms weight
following what each party actually contributed rather than what it
nominally fields is the entire point of the clause, and refusing the shift
would honor (f) in the stance band while contradicting it at the one
surface where the stance is supposed to pay out. Dark worlds are untouched
(the flag family is virtual, no `DEFAULT_SIMULATION_RULES` entry), so the
shift cannot reach an unlit world.

**THE DEGENERACY IS ALREADY HANDLED — CONFIRMED IN-DOC, so this ruling
does not need to invent a fallback:** WC-2's LANDS row states "the share
integral for non-composite worlds degenerates to own-army = 1.0, so ARC A
needs no roster". A lit coalition with no receipts therefore reads its own
army at full share rather than an all-zero split.

**TWO OBLIGATIONS RIDE THIS APPROVAL, both from the standing golden-shift
law.** (1) The re-record happens **only from a proven-clean HEAD**, never
from a tree with an unexplained red. (2) The commit **states the
legitimate cause** and never lets the shift ride under a "fix" or
"refactor" label. WC-2's ALIGNMENT LINE already carries the declaration
slot; this ruling fills it.

**WAVES.** Unblocks **WC-2**; feeds WC-5's terms weight and WC-9's
comradeship join.

**CHAIR-RULED.** Lit-only, flag-gated, no persisted shape, no paid
surface.

**VETO SENTENCE.** Veto if the chair wants the strength split retained as
a permanent parallel read rather than replaced, which would require a
consumer-by-consumer ruling on which surface reads which split and would
reopen the "one quantity per name" discipline §1.1.4 settles.

---

### CR-WC-8 — LAW-BAND EDGES, THE RELAY'S PARTICIPANTS, AND RELAY PURITY

Three parts, ruled separately because they fail differently.

#### CR-WC-8(i) — WHOSE LAW WORD EDGES

**THE QUESTION.** Does WC read the estate default `LAW_WORD_EDGES`
(0.67 / 0.33) or sign a program-specific pair, per the espionage J-ES-10
precedent?

**THE RULING: READ THE ESTATE DEFAULT. WC SIGNS NO PROGRAM PAIR.**

**REASONING.** The modulation table varies the **CURVES**, not the word
edges — §4.1.2 is explicit that the table "is a zero-import leaf either
way (lawWordFor's three words are the only vocabulary it may key on; no
fourth word ever)". A program-specific edge pair would mean the same
settlement is "lawful" to the relay and "balanced" to espionage, which is
a second spelling of a shared world fact and precisely the drift the
one-vocabulary discipline exists to stop. J-ES-10's precedent licenses a
program pair; it does not oblige one, and espionage had a reason WC does
not have. **Note this ruling is a ruling to read WHATEVER the default is,
not an assertion about a number** — and the number is now measured:
**`lawWord.js:56` reads `export const LAW_WORD_EDGES = Object.freeze({
lawful: 0.67, lawless: 0.33 })`, with `lawWordFor` at `:71`. CONFIRMED
byte-exact**, so the ruling names a verified default rather than an
assumed one.

**WAVES.** Unblocks **WC-3** (the relay). **CHAIR-RULED.**

**VETO SENTENCE.** Veto if the chair finds relay economics need edges
that diverge from every other law-word consumer, which would make a
settlement's lawfulness reader-dependent.

#### CR-WC-8(ii) — IS THE RELAY LAW-BAND-PURE?

**THE QUESTION.** §1.3.2 gives per-hop efficiency a comradeship term.
Keep it, or make the relay law-band-pure?

**THE RULING: KEEP THE COMRADESHIP TERM.**

**REASONING, and it is a rule about how owner clauses are honored rather
than about relays.** Directive (h) names relay efficiency as one of
comradeship's four consumers **in so many words** — "so it immediately
feeds caravan density (the WY law), alliance odds, call-in answer weights,
and relay efficiency". **An owner clause with a NAMED CONSUMER cannot be
honored by writing to an axis nobody reads for that purpose.** Dropping
the term would leave comradeship credited somewhere and the named payoff
unpaid, which is honoring a clause by its bookkeeping rather than by its
effect. The seam is already correctly staged: WC-3 lands the read with the
term present and NEUTRAL (zero bond = today's arithmetic exactly), and
WC-9 supplies the value — which is also what makes WC-9's pin possible
(an identical relay run between comrades and between strangers, strictly
ordered).

**WAVES.** Unblocks **WC-3**; makes the **WC-9** ordering pin
constructible. **CHAIR-RULED.**

**VETO SENTENCE.** Veto if the chair prefers a law-band-pure relay, which
is a deliberate NARROWING of an owner clause — and if taken, it must be
recorded at this ruling as a narrowing and never as silence in §1.3.2.

#### CR-WC-8(iii) — WHOSE LAW BAND THE HOP READS

**THE QUESTION.** Does per-hop efficiency read the STAGING settlement's
law band alone, or all three participants'?

**THE RULING: THE PARTICIPANTS' — `WORSE-OF(sender, stager, receiver)` VIA
`lawWordFor`. THE SKIM STILL BELONGS TO THE STAGER.**

**REASONING.** Directive R4 is verbatim: "per-hop efficiency reads the
**PARTICIPANTS'** law bands". The stager-only read was a narrowing made by
**silence**, and it exempted a lawless SENDER and a lawless RECEIVER from
contributing anything to loss or skim — in the same paragraph that sets
the opposite standard for the comradeship term one page below. The
composition is disciplined rather than invented: **ordering three law
words and taking the worst invents no fourth vocabulary; blending them
would**, and the estate already uses worse-of for security reads
(`security01Of`). The skim's attribution to the stager is independently
correct on physical grounds — a diverted consignment sits in the barn that
handled it, so a lawless sender does not steal from itself at a lawful
barn.

**✅ THE BORROW IS NOW MEASURED, AND THE PRECEDENT IS CLOSER THAN THE
VOLUME CLAIMED.** `security01Of` (`demographicsPushPull.js:375-389`)
documents its own discipline verbatim: "The **WORSE** of the two existing
exposures ... **Taking the worse rather than blending them** means a
settlement cannot launder a live crime wave behind a comfortable
generation-time score." **CONFIRMED.** That is the same argument the relay
needs, in the same shape: worse-of prevents a lawless participant from
laundering its exposure behind a lawful one. The composition is a genuine
borrow, not a rhetorical one.

**WAVES.** Unblocks **WC-3**. **CHAIR-RULED.**

**VETO SENTENCE.** Veto if the chair prefers the stager-only read, which
is a deliberate narrowing of an owner clause and must be recorded here as
one so it can never again be made by silence.

---

### CR-WC-9 — THE FIELD BATCH ⛔ **ESCALATED**

**THE QUESTION.** How many new persisted fields does WC request, and
signed how?

**THE LIST AS THE VOLUME STATES IT.** `deployment.blocks[]` including
`blocks[].drawnCohorts`; the transit blocks projection; shipment relay
buckets (consumed / skimmed / destroyed); column cohort tag + military
classes; **FOUR new spatialLedgers** (`warContributions`, `freeUnits`,
`residentCohorts`, `serviceBonds`); and one edge archive (contribution
closes).

**⛔ THIS QUESTION ESCALATES AND IS NOT RULED HERE.** It is a
**PERSISTED-STATE SHAPE** question — the one class this lane holds back
from self-ruling regardless of the blanket sign-off, because a schema
surface is the thing a signature is *for*. The blanket grant's own
enumeration lists the closest precedent on the deferred side: **the ES Q5
alliance-topology ACQUIRE, "a new persisted key family", RATIFIED AS
DEFERRED.** Four new ledger families is a larger act than the one the
grant ratified as parked.

**THE GATE IT ESCALATES TO.** The owner, through the chair, via a field
batch table on the **WY §2a precedent**.

**WHAT I RECOMMEND THE TABLE SAY — the chair may adopt this wholesale.**

1. **THE FULL FOUR-LEDGER LIST UP FRONT, SIGNED AS ONE BATCH.** The
   volume's own note is right and should be followed: `serviceBonds` lands
   at WC-9, *after* the WC-6 signing point, "so either the batch is signed
   as the full four-ledger list up front or serviceBonds carries a one-row
   addendum at its own landing". **A field batch signed in two pieces is
   the shape a later wave cites without re-reading.** One table, four
   ledgers, all rows.
2. **⚠️ SIGN BEFORE WC-1, NOT BEFORE WC-6 — I DISAGREE WITH THE VOLUME
   HERE AND REPORT THE DISAGREEMENT RATHER THAN RESOLVING IT SILENTLY.**
   §6 recommends signing "before WC-6", reasoning that "WC-0/WC-1 touch
   only the new ledgers". But **WC-1 lands `spatialLedgers.warContributions`,
   which IS a new persisted key family** — the first one. Under the
   volume's reading the schema gate binds at the first *consumer*; under
   mine it binds at the first *writer*.
   **THE VOLUME'S STRONGEST COUNTER, stated fairly because it is
   genuinely good:** every ledger is drop-when-empty behind a virtual
   flag, so a dark world's persisted bytes are unchanged and the shape
   does not *materialize* until lighting — and lighting is separately
   gated (PRE-SIGNED, consumed at the soak). On that reading the signature
   is owed before LIGHTING, not before WC-1.
   **WHY I STILL RECOMMEND WC-1:** the cost of signing early is one table
   written once; the cost of signing late is that four waves land writers
   against an unsigned shape and the question re-opens at the soak, when
   the tree is at its least changeable. **The asymmetry is not close.**
   The chair should rule which reading binds; either way, *stating* which
   one binds is worth more than the timing itself.
3. **WC-0 IS UNAFFECTED EITHER WAY.** WC-0 lands vocabularies with "no
   consumers" — `warStance.js`, `peopleLedger.js`, the modulation table's
   SHAPE ONLY, and the column class vocabulary. **It writes no ledger and
   creates no persisted key.** WC-0 is dispatchable without this table.

**✅ THE SCHEMA PREMISE IS NOW MEASURED, AND IT CONFIRMS THE ESCALATION
RATHER THAN SOFTENING IT.**

- **`spatialLedgers` IS PERSISTED — CONFIRMED.** It is listed in
  `CONDITIONAL_LEDGER_KEYS` (`worldState.js:401-404`), the set the world
  state carries through save and clone. Four new families there are four
  new persisted key families.
- **`deployment.blocks` DOES NOT EXIST — CONFIRMED (absence)**, across
  `warDeployment.js`, `warCosts.js`, `warHomeCosts.js` and
  `deploymentReturn.js`. So `blocks[]` is **genuinely new persisted shape
  on a WAR-LAYER RECORD**, which is heavier than a new spatial ledger key
  and is the single largest item in the batch.
- **`leviedPopulationBySource` is `Record<string, number>` on the
  deployment record — CONFIRMED** (`warHomeCosts.js:442-451`, read at
  `warCosts.js:367`). The map `blocks[]` must reconcile against is
  measured and its sole writer is settled by §0.3's one-mouth ruling.

**ONE MITIGANT, STATED FAIRLY BECAUSE IT CUTS AGAINST MY OWN
RECOMMENDATION:** `spatialLedgers` already carries roughly **forty-seven**
sub-ledger keys today (`armyTransit, beliefMaps, embattlement, migration,
supplyShipments, treaties, ...`). Four more is a marginal widening of a
long-established container, not a new container — which makes the batch
table cheaper to justify than the raw count of "four new ledgers"
suggests. **`deployment.blocks[]` does not get that mitigant**; it is a
new field on a record that has none like it.

**WAVES.** Blocks **WC-1..WC-16** under my recommended reading; blocks
**WC-6..WC-16** under the volume's. **WC-0 is unblocked under both.**

**VETO SENTENCE.** Veto the *escalation* if the chair holds that the
blanket sign-off's queue coverage already reaches a drop-when-empty ledger
behind a dark virtual flag — in which case CR-WC-9 becomes chair-ruled as
"the full four-ledger table, recorded not signed", and the waves dispatch
on the volume's reading.

---

### CR-WC-10 — THE SECOND (COUNTS-MOVER) MANIFEST

**THE QUESTION.** Approve a SECOND totality manifest for counts-movers,
with its own discovery signature, minted in WC-11's opener — registering
`armyTransitKernel.js`'s `stepArmyPosition` sites, `migrationKernel.js`'s
column release, and this volume's `freeUnitKernel.js`?

**THE ARMS.** (a) Widen `MOVEMENT_SITES` (law M) to admit army-style
steppers; (b) mint a second manifest for the counts plane, leaving law M's
scope, header and signature untouched.

**THE RULING: (b) — MINT THE SECOND MANIFEST. DO NOT WIDEN LAW M.**

**REASONING.** The earlier form of this question ("widen
`MOVEMENT_SITES`?") was built on a mischaracterisation the volume itself
corrected at §1.7.3: `MOVEMENT_SITES` is a **NAMED-PERSON leg-physics
census**, its `DISCOVERY_RE` keys entirely on named-person tokens, and its
header says it is "intentionally a physics census, not a census of all
entity placement writes". **`armyTransit` is therefore not EXEMPT from law
M — it is OUT OF SCOPE**, which is a different relationship and licenses a
different repair. Widening law M would put a counts-mover inside a
named-person manifest, **directly against CR-WC-2's ruling above**, and
would corrupt a guard's declared subject to borrow its coverage.

The affirmative case is stronger than the defensive one: **the counts
plane has never had totality coverage at all**, and this volume is the one
adding a second counts stepper (`freeUnitKernel.js`). A program that adds
a mover to an uncovered plane and does not cover the plane is how the
plane stays uncovered forever.

**✅ THE PREMISE IS MEASURED AND CONFIRMED — this ruling no longer rests on
an unverified header.** `tests/lint/namedPersonTransitTotality.walker.test.js`
header, verbatim at `:1-13`: "**This is intentionally a physics census, not
a census of all entity placement writes**: first placement, admission,
undo, and display interpolation do not open or advance a route leg."
`DISCOVERY_RE` at `:23` keys on eleven named-person tokens and nothing
else; **`armyTransit.js`, `armyTransitKernel.js` and `migrationKernel.js`
match ZERO of them**, so the walker's own `discoverMovementSites()` cannot
find them. **CONFIRMED.**

**AND A SECOND, INDEPENDENT CONFIRMATION THE VOLUME DID NOT CITE:**
`armyTransit.js:25-28` declares the boundary from its own side —
"**NAMED-CHARACTER BOUNDARY (owner, BINDING): armies are AGGREGATE units**
— strength / size NUMBERS. NO named NPC is ever killed by a battle; a
battle moves counts, never a roster. ... This module holds no npc ids,
reads no roster, returns no npc mutation." **Both files agree that armies
are out of the named-person plane, and one of them says the owner made it
binding.** Out-of-scope is confirmed from both ends; EXEMPT was never the
right word.

**ORDERING.** Rule CR-WC-2 first: this ruling cites it.

**WAVES.** Unblocks **WC-11**. Coordinates with WY (seam 6's filed
candidate is answered by the new manifest), **with no edit requested to
WY's guard**.

**CHAIR-RULED.** A test-side manifest is neither persisted shape nor
public API.

**VETO SENTENCE.** Veto if the chair holds that two totality manifests
over movement is one manifest too many, and would rather widen law M and
amend its header in the same commit — which trades a clean guard subject
for a smaller manifest count.

---

### CR-WC-11 — THE CRISIS TRIPLE

**THE QUESTION.** Is the `embattled` state expressible through the
existing `APPLY_STRESSOR` / `RESOLVE_STRESSOR` pair, or does it need a
third event type?

**THE RULING: YES — AN ORDINARY CATALOG STRESSOR WITH A TYPED SOURCE
REFERENCE. NO THIRD EVENT TYPE.**

**REASONING.** `embattled` is, mechanically, a settlement under a
condition that begins, persists, and ends — which is what the stressor
pair models. Minting a third event type to express it would add a
store-consumer surface for a state that the existing pair already shapes,
and every consumer of the crisis plane would then need to learn a third
verb. The volume's §1.8.2 already treats embattlement as breeding crime
through existing stressor-mediated channels, so the catalog road is the
one the rest of the design already assumes.

**⚠️⚠️ MEASURED, AND THE MEASUREMENT FORCES A REFINEMENT — WITHOUT IT THIS
RULING WOULD HAVE ESCALATED.** The event pair is confirmed
(`crisisLifecycle.js:87`; `events/registry.js:549`/`:597`;
`events/mutate.js:100`/`:103`). **But the CATALOG stressor definition has
NO `source` or `sourceRef` field** — `STRESSOR_CATALOG`
(`stressorsCore.js:54-63`) is `{ label, durationPolicy, pressureKinds,
birthThreshold, spreadChannels, residualEffects, affectedSystems }`, and
`normalizeStressor` adds none. What *does* carry a source is the **fired
instance**: `crisisLifecycle.js:272-281` writes `source: 'event',
addedByEventId: event.id`, and a condition's `causes` array carries
`{ source: 'event', eventId, detail }` at `:335`.

**THE REFINEMENT, AND IT IS PART OF THE RULING: THE TYPED SOURCE RIDES THE
APPLYING EVENT'S PAYLOAD, REACHED THROUGH THE EXISTING `addedByEventId` —
NOT A NEW FIELD ON THE STRESSOR ENTRY, AND NOT A WIDENING OF THE `causes`
SHAPE.** The `APPLY_STRESSOR` event that embattles a settlement carries
the besieging free-unit reference in its own payload; the stressor entry
already points back at that event by id. **So the besieger is addressable
with zero new fields on any shared shape.** Widening the `causes` entry or
adding `sourceRef` to the stressor entry would each be a **store-consumer
change** — which is exactly the gate this question was circling, and the
`addedByEventId` path steps around it rather than through it.

**THE ESCALATION VALVE STILL STANDS, NARROWED.** If build finds the
`addedByEventId` road genuinely cannot carry the reference, **the third
event type — or any widening of the `causes` shape — is a STORE-CONSUMER
CHANGE and comes back to the chair BEFORE landing, never as a WC-12
implementation detail.** A build that discovers this and mints inside its
own wave has crossed a gate on momentum.

**WAVES.** Unblocks **WC-12** (brigandage and the embattled state).

**CHAIR-RULED** with the refinement and the valve. The valve's far side is
escalation.

**VETO SENTENCE.** Veto if the chair holds that a besieging-unit reference
on a stressor is a misuse of the crisis catalog, in which case WC-12 opens
with the third-event-type question rather than closing it.

---

### CR-WC-12 — CATALOG ORDER

**THE QUESTION.** WC-0's amnesty/jubilee catalog rows versus the queued TB
tribute family (SOL_QUEUE row 23a). Who goes first?

**THE RULING: NEITHER WAITS. WC-0 REGISTERS ITS TWO PRODUCER-LESS ROWS
IMMEDIATELY; TB PROCEEDS INDEPENDENTLY THROUGH THE SAME ONE-OWNER FLOOR;
WHICHEVER LANDS SECOND REBASES TRIVIALLY.**

**REASONING.** Catalog rows are **additive**, and WC-0's two rows are
**producer-less** — nothing emits them until a later wave mints a
producer — so their registration is byte-identical and cannot move any
seeded world. There is no shared mutable surface to serialize on: the CQ5
serialization law binds FLAG waves (manifest + cert + test surfaces
shared), and a catalog row is none of those three. Sequencing two additive
registrations against each other would buy nothing and would couple two
independent lanes.

**MEASURED: SOL_QUEUE row 23a exists and carries the tribute family**
(`docs/SOL_QUEUE.md:246`, `:252` — "THE WAR AMENDMENTS: CONVENIENCE +
TRIBUTE + STATECRAFT + EXPANSION", "TB-1..TB-7 + TB-1b (the tribute...)").
**CONFIRMED.**

**WAVES.** Unblocks **WC-0**.

**CHAIR-RULED.**

**VETO SENTENCE.** Veto if the chair finds the two row sets share a key
that makes them non-additive, which would make the second lander a
conflict rather than a rebase.

---

### CR-WC-13 — THE DEAD ARMS

**THE QUESTION.** `readAllianceWebRisk`'s `'ally'` / `'defensive_pact'`
weights are reported dead under `normalizeRelationshipType`. Repair inside
WC?

**THE RULING: RECORD AS A DELIBERATE DEFERRAL IN THIS VOLUME; REPAIR IN A
HYGIENE WAVE OUTSIDE WC.**

**REASONING.** The class boundary is the whole argument. WC's boundary
sentence is "auxiliary contribution, composite armies, the people ledger,
and the domestic dividend" — a dead weight arm in the diplomacy plane's
risk read is not a member of that class, and repairing it inside a WC
commit is the grab-bag shape that gets a diff distrusted and reverted
wholesale, taking the real work with it. A dead arm that has been dead is
not urgent; a seventeen-wave volume that also quietly changes diplomacy
risk weights is.

**⚠️⚠️ MEASURED — BOTH ARMS ARE DEAD, BUT BY TWO DIFFERENT MECHANISMS, AND
THE DEFERRAL NOTE MUST SAY SO.** The volume records this as one finding;
it is two, and they have different futures.

- **`'ally'` IS STRUCTURALLY DEAD.** It is itself an *alias key* in
  `RELATIONSHIP_TYPE_ALIASES` (`relationshipState.js:113-128`) mapping to
  `'allied'`. **`normalizeRelationshipType` cannot emit `"ally"` by
  construction** — the alias table intercepts it. This arm is
  behavior-neutral today **and permanently**, absent an edit to the alias
  table.
- **`'defensive_pact'` IS ONLY EMPIRICALLY DEAD.** It is **not** an alias
  key, so it would pass the normalizer through unchanged. It is dead
  because **nothing in `src/` ever writes it** — it is absent from
  `RELATIONSHIP_DEFAULTS` (`relationshipState.js:19-110`) and survives
  only inside membership Sets. **One producer makes this arm live**, and
  nothing guards against one appearing.

**SO THE DEFERRAL NOTE READS: "`'ally'` behavior-neutral by construction;
`'defensive_pact'` behavior-neutral only while no producer exists."** Do
not carry the volume's single "behavior-neutral today" phrase forward over
both — that is the sentence a future session would act on wrongly.

**⚠️ AND THE SAME TWO SPELLINGS ARE DEAD INSIDE WC's OWN ADMISSION SET —
see B.1d.** §1.1 enumerates "ALLIED / **ALLY** / **DEFENSIVE_PACT**"
against what it calls "the LIVE relationshipType vocabulary", and two of
the three cannot be reached. **This is the dead-band class landing inside
the volume's own new road, and it is a WC-scope finding rather than a
diplomacy-hygiene one** — so unlike `readAllianceWebRisk`, **it does not
defer.** Recorded as obligation O-9; WC-1's admission-set pin must assert
reachability per spelling, or drop the two dead ones.

**WAVES.** The `readAllianceWebRisk` half unblocks nothing and **removes a
residual from ARC A's fold**. The admission-set half (O-9) is a **WC-1
build obligation**, not a deferral.

**CHAIR-RULED as a deferral**, per the deferral discipline: item, reason,
and a home, labelled for its future reader as *deliberately deferred —
documented, not a bug to re-find*.

**VETO SENTENCE.** Veto if the chair wants the hygiene repair folded into
WC-0 while the diplomacy plane is already open, accepting the class-
boundary cost for one fewer wave.

---

### CR-WC-14 — THE WY-8a GATE

**THE QUESTION.** WC-10 and WC-11 hard-gate on `armySupply.js` (WY-8a).
Hold the gate or re-scope?

**THE RULING: HOLD THE GATE. ARC A AND WC-6..WC-9 DELIVER VALUE WITHOUT
IT; WC-10..WC-16 QUEUE BEHIND IT.**

**REASONING.** Re-scoping WC-10 to a relay-throughput-only envelope
(declared v1) means building the endurance envelope twice — once without
supply and once with — and the second build would have to reconcile a v1
envelope's landed pins against the real one. The volume's own recommendation
is to wait, and there is a great deal of value ahead of the gate:
**ten of seventeen waves (WC-0..WC-9) are on the near side of it.**

**⚠️ A MATERIAL UPDATE THE QUESTION PREDATES, AND THE CHAIR SHOULD SEE IT.**
CR-WC-14 was written as though WY-8a's blocker were a pending owner
signature. **It is not, any more.** The blanket sign-off **RELEASED the F9
`supplyCargo` sign-off row TO BUILD** — recorded verbatim as "F9
supplyCargo sign-off row (WY-8's gate) — SIGNED; WY-8 builds whole".
**So the gate is now a BUILD-ORDER gate, not a signature gate.**
**MEASURED: `armySupply.js` is ABSENT from `src/` — CONFIRMED.** WY-8a is
authorized and unbuilt. That changes the shape of the wait from "waiting
on the owner" to "waiting on a queue slot the chair controls", which makes
holding the gate a cheaper decision than it looked when the question was
written.

**WAVES.** Confirms **WC-10, WC-11** gated; leaves **WC-0..WC-9**
ungated by this question.

**CHAIR-RULED.**

**VETO SENTENCE.** Veto if WY-8a slips badly enough that ten waves of WC
finish and stall, in which case the re-scope to a declared v1
relay-throughput-only envelope becomes the cheaper of two bad options.

---

### CR-WC-15 — THE WY-1 ORDERING

**THE QUESTION.** WC authors distance bands before WY-1 publishes the
calibration spectrum surface. Block or proceed?

**THE RULING: DO NOT BLOCK. AUTHOR EVERY DISTANCE BAND AGAINST
`calibration(digest)` AT READ TIME, WITH AN IN-FILE DERIVATION NOTE AND A
SHRINK-ONLY CENSUS ROW THAT WY-1 CLOSES; DECLARE THE `kmScale` ONE-TIME
SHIFT WHEN IT LIGHTS.**

**REASONING.** The hazard being avoided is precise and already measured:
§5.3 records that a whole realm spans roughly **2..8 march weeks** under
per-digest calibration, **so any authored absolute band edge >= 9 refuses
nothing** — a dead arm, the POINTS-GAP class. Deriving from
`calibration(digest)` at read time sidesteps it entirely and does not
depend on WY-1 existing. The shrink-only census row is what makes the
deferral self-closing rather than a note someone must remember: WY-1
closes rows, it does not need to find them.

**WAVES.** Unblocks the distance-band arms of **WC-3, WC-4, WC-10,
WC-13** — four waves that would otherwise each wait on WY-1.

**CHAIR-RULED**, with the `kmScale` declaration as a standing obligation
under the golden-shift law.

**VETO SENTENCE.** Veto if the chair would rather WC hold all distance
bands until WY-1 publishes, accepting a four-wave stall to avoid one
declared lighting shift.

---

### CR-WC-16 — THE QUEUE SLOT

**THE QUESTION.** SOL_QUEUE has no war-auxiliary row. Where does WC slot?

**THE RULING: ARC A SLOTS *WHOLE* (WC-0..WC-5) AFTER THE CURRENT FP PHASE
IN FLIGHT AND THE ADVANCE-EPOCH CHARTER'S INTEGRATION POINT. ARC B SLOTS
BEHIND WY-8a's BUILD SLOT. WC-8 MUST PRECEDE WC-11.**

**REASONING, and the whole-arc clause is the load-bearing part.** The
round-2 re-derivation from the corrected §7.F graph found that **WC-5
(call-ins and the exits) is INSIDE the critical path**, because WC-9
depends on it for two of `CONTRIBUTION_CLOSE_GRADES`' four members. So the
tempting split — a WC-0..WC-3 opener with call-ins deferred — **would have
stalled the entire composite arc at WC-9**, and the old graph would have
permitted it. Slotting ARC A whole is not a scheduling preference; it is
the graph. Likewise WC-8 before WC-11, so the block forks cannot be
deferred past the fission wave.

**MEASURED: SOL_QUEUE carries no WC row — CONFIRMED (zero hits for
war-auxiliary, war-circulation, or WC-0 in `docs/SOL_QUEUE.md`).** So this
ruling has no queue artifact behind it yet. **Adding the row is an
obligation this lane could not discharge** (SOL_QUEUE lives in the build
worktree, read-only to this lane). Recorded in §F as obligation O-2.

**WAVES.** Orders all seventeen; blocks none.

**CHAIR-RULED** — and note the chair owns the queue outright, so this is
a recorded derivation offered to the queue's owner rather than a
constraint on him.

**VETO SENTENCE.** Veto the *position* freely (the chair owns the queue);
veto the *whole-arc clause* only with the §7.F graph in hand, because
splitting ARC A stalls WC-9 on two grade members.

---

### CR-WC-17 — K1 SCOPE

**THE QUESTION.** Do the peace-capable exercisers (famine aid, joint
ventures, temple-raisings, trade drift) ship inside this volume or as a
successor program?

**THE RULING: SUCCESSOR PROGRAM. THIS VOLUME BUILDS THE PRIMITIVES
PEACE-SHAPED — KIND VOCABULARIES NOT WAR-CONDITIONED — AND NAMES THE
EXERCISERS AS DEFERRED CENSUS ROWS.**

**REASONING.** Two arguments, and they point the same way. First, **the
exercisers are genuinely new capability rather than repair** — famine aid
and temple-raisings are new causal links, not restorations of what the
code already intended — and new capability is a design act that gets its
own shaping rather than a rider on a war volume. Second, size: **this
volume is already the family's largest at seventeen waves and a
~4,960/5,290/5,090 derived budget triple**, and the exercisers would add a
fifth arc to a four-arc volume.

The *primitives* still land here, and that is the part that must not be
lost: the kind vocabularies ship **peace-shaped**, so the successor
program extends rather than re-mints. A volume that built war-conditioned
primitives would force the successor to fork them, which is the cost this
ruling is buying against.

**WAVES.** Removes a scope ambiguity from **WC-5** and **WC-14**; adds no
wave.

**CHAIR-RULED as a deferral**, with the deferral's home named (a successor
program) and its shape constrained (peace-shaped primitives).

**VETO SENTENCE.** Veto if the chair wants at least one exerciser inside
WC to prove the primitives are genuinely peace-capable rather than
nominally so — which is a real argument, and would cost one wave.

---

### CR-WC-18 — PRISONERS AND THE SEA (K7)

**THE QUESTION.** Do prisoners and naval war enter this volume's wave
plan?

**THE DISPOSITION — AND THIS IS A RECORD OF AN EXISTING OWNER ACT, NOT A
FRESH RULING.** The volume's recommendation is **defer**: hold both as
named, shaped, unbuilt census rows (PRISONERS = one event pair on the
walker's closed list when it lands; THE SEA = naval rows on the encounter
table), and "neither enters the wave plan **until the owner calls them**".

**Under the blanket sign-off, a recommend-defer item is RATIFIED AS
DEFERRED** — the grant's own words: a signature "RATIFIES a
recommended-defer item AS DEFERRED", and "**A BLANKET GRANT DOES NOT FLIP
A PARK INTO A BUILD**". **So CR-WC-18 is ALREADY DISPOSED: deferred, with
the owner's ratification, and this document does no more than record where
that disposition comes from.**

**⛔ THE BOUNDARY, STATED SO NOBODY OVER-READS THIS ENTRY.** Any move to
**BUILD** prisoners or naval war requires the owner's call, which the
blanket grant explicitly does not supply. The chair may shape the census
rows; the chair may not schedule the waves.

**WAVES.** None. Keeps both out of the seventeen.

**NOT SELF-RULED — RECORDED AS RATIFIED-DEFERRED.**

**VETO SENTENCE.** Veto only by the owner calling one of the two in, which
converts it from a census row into a wave with its own gates.

---

### CR-WC-19 — THE CREDIT BAND'S MAGNITUDE WORDS ⚠️ **RULING FLIPPED ON A CORRECTED PREMISE**

**THE QUESTION.** Does the credit band (a) BORROW `sovereigntyAppraisal`'s
magnitude words, or (b) land as a named ROW in `bandFamilies.js`? **Ruled
out either way: a fresh four-word ladder in `contributionLedger.js`.**

**THE VOLUME'S RECOMMENDATION WAS (b)**, on the stated ground that
"`bandFamilies.js` is the declared owner and a row there is the shape the
next volume can reuse without a third spelling", with (a) called
"acceptable and cheaper".

**⚠️⚠️ THE PREMISE UNDER (b) IS REFUTED AT HEAD.** §5.2 asserts "The
standing law gives `bandFamilies.js` ownership of **magnitude**/severity/
significance scales." **MEASURED: the file's own header reads "SP-6a
SIGNIFICANCE and SP-6b SEVERITY, THE TWO BAND FAMILIES, MINTED ONCE HERE.
Volumes ASSIGN their kinds to a class; no volume authors a scale."** Two
exports, two families, and **magnitude is not one of them**. The project
memory index independently records the same two-family scope. **There is
no magnitude class in `bandFamilies.js` for WC to assign a kind to** — so
arm (b) is not "assigning a kind to a class" at all; **it is WIDENING a
file that declares itself closed at two families**, and doing so under a
disjointness walker (`tests/lint/spBandFamilies.walker.test.js`).

**THE RULING: (a) — BORROW `SOVEREIGNTY_VALUE_BANDS`. THE CREDIT BAND
MINTS NOTHING AND WIDENS NOTHING.**

**REASONING.** With the premise corrected, (a) is the only arm that adds
no declaration anywhere, which is exactly what §5.2 claims the volume
does. **MEASURED at `sovereigntyAppraisal.js:104-106`: `export const
SOVEREIGNTY_VALUE_BANDS = Object.freeze(['unknown', 'trifling', 'modest',
'substantial', 'great', 'crown_jewel'])` — CONFIRMED byte-exact.** Reading
four of its six rungs is a **read-side** concern, not a mint. Arm (b),
correctly priced, costs a third band family in a file whose header says
two plus a walker amendment — which is more than a credit band should buy,
and is an estate-level act wearing a WC label.

**⚠️ THE COST OF (a), STATED HONESTLY RATHER THAN GLOSSED.** The borrowed
vocabulary is named for sovereignty appraisal, and the credit band is
about contribution. **A cross-domain name is a real cost** and the build
should carry an in-file note at the borrow site saying why it reads a
sovereignty-named ladder. That is cheaper than a third band family, but it
is not free, and a future reader deserves the sentence.

**WHAT IS STILL RULED OUT, UNCHANGED:** a fresh four-word ladder
(`token | modest | substantial | decisive`) in `contributionLedger.js`. It
duplicated two members of `SOVEREIGNTY_VALUE_BANDS` outright, and
`decisive` is the top rung of `PRESSURE_BANDS`
(`envoyNegotiationPictureBuilder.js:28` — **CONFIRMED byte-exact**), which
this volume borrows in the same appendix.

**⚠️ A SEPARATE, LARGER QUESTION IS EXPOSED AND IS NOT SMUGGLED IN HERE.**
The estate has **no single owner for magnitude scales** — `bandFamilies`
owns two families, `SOVEREIGNTY_VALUE_BANDS` and `PRESSURE_BANDS` are
independently authored in their own files. If the chair wants one owner,
that is a third band family in `bandFamilies.js` and an estate-level
consolidation, **properly its own hygiene wave alongside the already-owed
intensity-ladder consolidation** (the standing "CHAIR DECISION OWED" from
FP SP-A). Recorded in §F as obligation O-3. **It is not WC's to do**, and
folding it in would be exactly the momentum-through-a-graze this program
guards against.

**WAVES.** Unblocks **WC-1** (the arrival ledger's credit band) and
**WC-9**'s close grades.

**CHAIR-RULED.** A read-side borrow touches no persisted shape.

**VETO SENTENCE.** Veto if the chair holds that a cross-domain vocabulary
name is worse than widening `bandFamilies.js` to three families — which is
a defensible taste call, but it should be taken knowing that (b) is a
widening and not the assignment the volume described.

---

### CR-WC-20 — POOLS OR TAGS: WHAT A COHORT IS

**THE QUESTION.** Are a cohort and the free-lance roll POOLS standing
beside census, or TAGS on census members?

**THE ARMS.** (a) **TAGS** — labels partitioning the host's population, so
`shed` credits census AND the tag in ONE event, `untag` moves nobody, and
neither appears in the conservation identity. (b) **DISJOINT POOLS** —
cohorts stand beside census.

**THE RULING: (a), THE TAG MODEL, AFFIRMED AS §0.2 ALREADY RULES IT.**

**REASONING.** The volume's own argument is correct and is not restated
here at length: the disjoint alternative **double-counts**, because
§1.12.1's homecoming credits returning veterans to CENSUS while the cohort
ledger also counts them, and a `census -> cohort` transfer is a member of
no event list this volume can close.

**THE ARGUMENT THE VOLUME UNDERSTATES, AND IT IS THE DECISIVE ONE.** Look
at the third consequence §6 lists for the disjoint arm: "state explicitly
which read sees which pool — defence, density, absorption capacity,
taxation and every other census consumer — **because under disjoint pools
a settlement's 'population' stops being its population**." That is not a
third bullet of equal weight with the other two. **It is a change to the
MEANING of an existing persisted field (`settlement.population`) for every
consumer that already reads it**, with an unbounded blast radius across
defence, density, absorption and taxation — none of which are in this
volume's scope and all of which would silently change. The tag model
changes census not at all. **Under this document's own limits, arm (b)
would have been an escalation** (it re-shapes what persisted state means);
arm (a) is an affirmation of the architected shape and changes nothing.

**WAVES.** Unblocks **WC-13** and **WC-15** *on the same arithmetic* —
which is the point: it is what keeps a shed and a cohort read from being
two arithmetics separated by a silent migration.

**CHAIR-RULED.** Affirming the architected shape changes no persisted
shape. **The persisted SHAPE of `residentCohorts` itself still rides
CR-WC-9's escalated batch table** — this ruling settles the model, not the
signature.

**VETO SENTENCE.** Veto only with an answer in hand to "what does a
settlement's population mean to defence, density, absorption and taxation
under disjoint pools", because the disjoint arm cannot be taken without
one, and taking it also mints `enrol`, re-signs `enlist`, and forbids
`return`/`arrive_home` from crediting census.

---

### CR-WC-21 — WHAT STEPS THE COHORT AGE BAND *(collision 5 of 6 — the parked contradiction; blocks WC-15)*

**THE QUESTION.** Does a cohort's age band step by CALENDAR or by
MORTALITY-REALIZED COMPOSITION? §6 records "BOTH POSITIONS, NEITHER
TAKEN" and "the wave does not land".

**THE CONTRADICTION, RESTATED PRECISELY.** The volume bands cohorts by
calendar (`AGE_BAND_EDGES_YEARS` 5 / 20; `RECENCY_WEIGHTS` 1.0 / .6 / .25)
while **WC-15's hardest negative demands that a zero-mortality world decay
NO bond and that a calendar-decay mutant RED**. In a world with no deaths
the count never moves, but the band still steps and the derived bond falls
to a quarter. **The pin is unpassable against the design's own behavior.**

**BOTH POSITIONS, FAIRLY.**

- **POSITION A — BAND BY MORTALITY-REALIZED COMPOSITION.** A cohort
  reaches `rooted` as its arrival generation is thinned, not as the
  calendar turns. Keeps "mortality is the decay law (no new constant)" and
  §5.1 verbatim; keeps the WC-15 pin as written. **COST:** it narrows the
  owner's "how long ago" / "long ago memory is not recent memory" to a
  thinning proxy, and in a low-mortality world a sixty-year-old cohort may
  still read `newly_arrived`.
- **POSITION B — KEEP CALENDAR BANDS, DECLARE TWO TERMS.** The count term
  is mortality-driven; the recency term is calendar-driven and declared as
  such. Keeps "how long ago" literal. **COST:** `RECENCY_WEIGHTS` becomes
  a decay constant, so directive (n)'s "no new constant", §1.13.2's "no
  new decay law", and §5.1's "authors ZERO decay constants" must all be
  amended in the same commit, and the WC-15 pin must be weakened.

**WHY IT WAS PARKED, AND WHY THAT REASON DISSOLVES.** §1.13.2 parks it
because "the owner's own words cut both ways in one clause" and "each
candidate repair **edits an owner word**". **That is the premise to
attack, and it does not survive inspection: neither position needs to edit
an owner word. Both proposed edits land on VOLUME PROSE.** Position B's
listed casualties are §5.1's headline sentence, §1.13.2's restatement, and
a WC-15 pin phrasing — **all three are the volume's own restatements of
directive (n), not directive (n) itself.** The collision is between the
volume's *generalization* of an owner clause and the volume's *pin*, not
between two owner clauses.

**REAL OR ARTIFACT: ARTIFACT OF THE VOLUME'S OWN OVERGENERALIZATION.** The
owner's clause is scoped by his own gloss. "MORTALITY IS THE DECAY LAW (no
new constant — **first-generation memory dies with the first
generation**)" is a statement about **what makes the bond DIE**: the
carriers stop being alive. It is not a statement that every term in the
bond expression must be a function of mortality. Meanwhile "how many came,
how far, **how long ago** — 'long ago memory is not recent memory'" is
unambiguously elapsed time, and §1.13.3 already reads the bond as those
**three separate terms**. The owner asked for three terms and named the
driver of one of them. The volume's §5.1 flattened that into "zero decay
constants, full stop", and the WC-15 pin flattened it into "decays NO
bond" — and *those two flattenings* are what contradict each other.

**THE RULING: POSITION B, KEEP THE CALENDAR BANDS — BUT NOT AS §6 PRICES
IT. THE RECENCY TERM IS RECLASSIFIED, NOT CONCEDED: IT IS A BOUNDED,
FLOORED BAND MODULATION AND IT IS NOT A DECAY LAW. NO OWNER WORD IS
EDITED, AND §5.1's HEADLINE CLAIM SURVIVES INTACT.**

**THE MECHANISM THAT MAKES THIS TRUE RATHER THAN RHETORICAL — and it is
one measured distinction.** The estate's decay-law owner is
`bandedStock.js` and its ownership is over **half-life shapes**:
**MEASURED — `HALF_LIFE_BANDS` at `:53`, `decayTowardNeutral(value,
neutral, ageWeeks, band)` at `:113`, throw-on-unknown at `:91-92` —
CONFIRMED.** A half-life decay is **continuous in elapsed time and
asymptotic toward a neutral value: given enough time it takes its quantity
to nothing.**

`RECENCY_WEIGHTS` is **discrete (three members), finite (three steps), and
FLOORED (it reaches .25 and stops)**. It is structurally incapable of
taking anything to zero. **And the volume's OWN operational test for "is
this a decay law" already agrees:** WC-15's fence is a **source scan for
"no `Math.pow` half-life and no `bandedStock` call in the cohort path"**,
and WC-15's own text concedes the fence "keeps its source-scan shape"
under variant B. **A three-member floored lookup table passes that fence
trivially, under BOTH variants.** So by the volume's own structural test,
`RECENCY_WEIGHTS` is not a decay law; only §5.1's *prose* ever said it
was.

**WHAT THIS BUYS — the owner's sentence becomes literally, arithmetically
true.** The bond is a product. Its **count term is mortality-driven and
CAN reach zero**; its **recency term is floored and CANNOT**. Therefore
**only mortality can take a bond to nothing**, which is exactly
"first-generation memory dies with the first generation". The calendar
does not kill the memory; it only makes it quieter, and then stops. And
"how long ago" stays literal, so nothing of the owner's is narrowed.

**⚠️ AND WHY NOT POSITION A — A MECHANISM ARGUMENT, NOT A TASTE ONE.**
Position A does more damage than §6 prices. Under A, the recency band is a
function of how thinned the arrival generation is — **which is the same
underlying variable that drives the count term.** The bond would then
multiply a thinning proxy by a thinning count: **quadratic in cumulative
mortality, with the owner's three terms collapsed to two.** Position A
does not merely narrow "how long ago"; **it deletes it as an independent
term and double-counts mortality in its place.** That is a design defect,
and it is the strongest single reason to take B.

**THE PIN SET WC-15 CARRIES — STRICTLY STRONGER THAN EITHER VARIANT
OFFERED, WHICH IS HOW THIS RULING PAYS FOR THE PIN IT REWRITES.** §6
prices B as *weakening* the hardest negative to "only the count term is
mortality-driven". **That weakening is not necessary.** Three pins replace
the one, and together they assert the owner's sentence directly:

1. **THE COUNT TERM IS MORTALITY-DRIVEN.** Zero-mortality world, arbitrary
   elapsed time: the cohort COUNT is **byte-identical**. The
   calendar-count-decay mutant reds.
2. **THE FLOOR IS REAL — the new pin, and the one that carries the
   ruling.** Zero-mortality world, elapsed time pushed arbitrarily past
   the last band edge: the bond reads a **NONZERO, STABLE** value at the
   floor weight and **stays there forever**. **Two mutants red it:** a
   fourth, lower band appended; and the floor weight set to 0. **This pin
   is what makes "mortality is the decay law" arithmetic rather than
   prose — it proves the calendar CANNOT zero a bond.**
3. **MORTALITY IS THE ONLY ZEROING ROAD.** Drive mortality until the
   cohort empties: the bond reads **ABSENT**. The mutant that keeps a
   nonzero bond over an empty cohort reds.

Plus the arm §6 says is not in dispute and should be kept: a mortality
spike measurably accelerates the fade.

**THE ONE AMENDMENT OWED, AND IT IS ONE CLAUSE OF VOLUME PROSE.** §5.1's
"CONDITIONAL ON CR-WC-21" paragraph is struck and its headline claim
stands, extended by one sentence: *the cohort recency weighting is a
BOUNDED, FLOORED band modulation registered with its consumer — not a
decay law — and only mortality can drive a bond to zero.* §1.13.2's
"unresolved contradiction" subsection becomes a resolved one citing this
ruling. **§7.A.9, §1.13.3 and §7.B's `RECENCY_WEIGHTS` row need no change
of substance** — the weights stay raw-authored, and **their VALUES remain
TUNING under carve-out 3, unsigned by this ruling.**

**IF THE CHAIR WANTS ONE FACT TO DECIDE IT INSTEAD OF A RULING**, it is
this: **is `RECENCY_WEIGHTS` capable of taking a bond to zero?** It is
not — three members, floored at .25 — and every other question here
follows from that answer.

**WAVES.** **UNBLOCKS WC-15 OUTRIGHT** — the wave that "does not land"
now lands, with three pins instead of two variants. Consequently unblocks
**WC-16**, which depends on WC-15.

**CHAIR-RULED.** It edits volume prose and a pin, not an owner word, not a
persisted shape, and not a tuning value.

**VETO SENTENCE.** Veto if the chair holds that any monotone-decreasing
function of elapsed time is a decay law regardless of having a floor — in
which case Position A returns, and with it the collapse of the owner's
three terms into two and a bond quadratic in mortality.

---

### CR-WC-22 — THE TWO LEVY GATES *(collision 6 of 6 — the one REAL collision)*

**THE QUESTION.** Two live gates on the receiver-side levy sweep forbid
the directive's central cases. Should they ALSO lift on the levy side?

**THE TWO GATES, MEASURED.**

- **GATE 1 — THE DEPLOYER EXCLUSION.** `warHomeCosts.js:391` builds the
  exclude set as `new Set([...targets,
  ...Object.keys(deployments).map(String), ...leviedThisTick])`. **CONFIRMED
  byte-exact.** Any settlement fielding its own army is excluded from levy.
  **Its in-file rationale at `:386-390` is entirely about DOUBLE-LEVY
  across overlords and skeleton/food floors and mentions self-deployers
  nowhere — CONFIRMED.** The self-deployer arm is genuinely unargued.
- **GATE 2 — THE WR-6 PEER-LEVY REMOVAL.** `warHomeCosts.js:116` is
  `if (coalitionLit && relState.relationshipType !== 'vassal') continue;`,
  under the comment at `:114-115`: "WR-6 removes free peer levies: a
  canonical ally either joins with its own army or refuses." **CONFIRMED**
  (address corrected per B.1c). While the coalition layer is lit, no
  ALLIED edge can be levied at all.

**BOTH POSITIONS, FAIRLY.**

- **THE DIRECTIVE'S POSITION.** The owner's verbatim spine is "an
  **allied**, vassalized, or occupied settlement may elect to send
  reinforcements and supplies ... to an **ally's**, overlord's, or
  occupier's army", and the strategy tension is
  "**own-troops-for-own-army vs supporting others**". Gate 2 forbids the
  allied arm outright; Gate 1 forbids the tension outright, since a
  settlement fielding its own army cannot also send.
- **THE LAW'S POSITION.** WR-6 is a deliberate, commented law on a built
  subsystem with a golden record. Gate 1 is live code whose removal
  changes levy behavior for every seeded world that ever fires the sweep.
  These are mechanisms, and they were put there on purpose.

**REAL OR ARTIFACT: REAL. THIS IS THE GENUINE COLLISION OF THE SIX.** No
reading of the directive makes the gates permit what it asks for. The
`belligerent` rung (minority share AND an army of its own) and the
`auxiliary` rung ("her blocks serve under another party's banner") are
**STRUCTURALLY UNREACHABLE** through the levy surface, and there is no
wording to reinterpret.

**THE RULING: HOLD BOTH GATES EXACTLY AS THEY ARE. WC BUILDS ITS OWN
ROAD. EITHER WAY THIS IS NOT A WC WAVE.**

**REASONING — THE GOVERNING PRINCIPLE, APPLIED IN ITS STRONG FORM, AND
THE VOLUME HAD ALREADY APPLIED IT BEFORE THE QUESTION WAS ASKED.** The
directive is INTENT; the gates are MECHANISM PROVEN BY MEASUREMENT. So the
resolution is to honor the intent **through a different mechanism** — and
that is exactly what §1.1 does: a **sender-elected contribution road**
with its own chooser (`contributionMoves.js`), its own executor
(`contributionDispatch.js`), and **its own admission set**, beside the
levy sweep rather than through it.

**THE DISTINCTION IS SEMANTIC AND IT IS SOUND, NOT A DODGE.** WR-6's
comment says an ally "either joins with its own army or refuses" — a
statement about **FREE PEER LEVIES**, i.e. about being **TAKEN FROM**
without electing. **An ELECTED SEND and a LEVIED TAKE are different acts.
WR-6 says an ally is not freely taken from; nothing in it says an ally may
not GIVE.** Under that reading the two mechanisms coexist and **no
war-layer behavior moves at all.**

**THE TEST THE PRINCIPLE DEMANDS — IS THE INTENT NARROWED? NO, AND THIS
IS CHECKED RATHER THAN ASSUMED.** All three arms of the owner's spine
reach a live road under the new mechanism: **ALLIED/ALLY/DEFENSIVE_PACT**
("ADMITTED WHETHER OR NOT THE SENDER FIELDS ITS OWN ARMY — that is the
whole strategy tension"), **VASSAL** (junior -> senior, above any coerced
requisition), and **OCCUPIED** (through `occupation.js`'s STATE_LADDER,
per the one-authority rule). The `belligerent` rung is reachable; the
`auxiliary` rung is reachable; the strategy tension is expressible.
**Nothing of the directive is left unserved by holding.** That is the
finding that makes HOLD correct rather than merely conservative — **there
is no intent remaining that lifting would buy.**

**WHY LIFT LOSES, WITH ITS BEST ARGUMENT CORRECTED.** POSITION LIFT rests
on three claims. (1) "The sweep is measured silent anyway" — **⚠️ this is
weaker than stated. CONFIRMED per B.1b: `subsystemRowsWar.js:54` and
`:202` record an EMPIRICAL zero across seven completed release cases, and
the same row names the suppressor (`LEVY_POP_RATE_PER_TICK` 0.004 against
`LEVY_POP_FLOOR` 300 — "a source under roughly 550 people levies nobody at
all"). The path is live and reachable, not dead.** A corpus of larger
settlements fires it. So lifting does not touch an inert mechanism; it
changes a live one whose current silence is a threshold artifact. (2) "The
deployer exclusion's rationale doesn't cover self-deployers" — **true and
CONFIRMED**, and it is a genuine reason to revisit Gate 1 *someday*, but a
rationale that fails to argue for a line is not a demonstration that the
line is wrong. (3) "One road is simpler than two" — an aesthetic
preference, and it is outweighed by the costs LIFT itself concedes: a
behavior change on a built subsystem with a golden record, reopening a
WR-6 law whose comment reads deliberate, and **making WC's arrival ledger
inherit a corpus nobody has measured** — a cost that claim (1)'s
correction makes *heavier*, not lighter, because the inherited corpus is
live rather than empty.

**⛔ THE AUTHORITY BOUNDARY, STATED EXPLICITLY BECAUSE THE TWO ARMS SIT ON
OPPOSITE SIDES OF IT.** **HOLD is chair-ruleable: nothing moves, no built
behavior changes, no golden re-records.** **LIFT would NOT have been** —
it is a declared behavior change on built war-layer code with a golden
record, which is an owner-facing shift needing its own wave, its own
declaration, and its own re-record. **This document rules the arm that is
inside its authority, and says so rather than quietly ruling the other.**

**WAVES.** Unblocks **nothing directly and blocks nothing** — which is
the point, and it is the most useful fact about this question: **§6 states
"THE VOLUME'S POSITION, AND IT DOES NOT NEED A RULING TO BUILD".
CONFIRMED by reading. CR-WC-22 was never a build gate**; it was an
unresolved question sitting in a list of build gates, which is why it read
as one.

**CHAIR-RULED (HOLD).** Lifting escalates.

**VETO SENTENCE.** Veto if the chair wants one road rather than two,
accepting a war-layer behavior wave with its own golden re-record and an
unmeasured levy corpus flowing into WC's arrival ledger — and note that
even a veto does not make it a WC wave.

---

## §D — DISPATCHABILITY

**BEFORE:** one wave buildable (WC-0), and only because §6 said so.
**AFTER:** the count depends on one escalation, so it is given both ways
rather than rounded to the flattering number.

| Scenario | Dispatchable waves | Which |
|---|---|---|
| **Rulings adopted; CR-WC-9 signed before WC-1 (my recommendation)** | **1 immediately, 10 on signature** | WC-0 now; WC-1..WC-9 the moment the field batch is signed |
| **Rulings adopted; CR-WC-9 read the volume's way (signature owed before WC-6)** | **6 immediately, 10 on signature** | WC-0..WC-5 now; WC-6..WC-9 on signature |
| **Gated on WY-8a regardless** | WC-10, WC-11 | build-order gate, not a ruling gate |
| **Unblocked by ruling but downstream** | WC-12..WC-16 | ruled through; queue behind their dependencies |

**THE HEADLINE: ALL SEVENTEEN WAVES ARE NOW RULED THROUGH. No wave remains
blocked on an unruled chair question.** WC-15, which "did not land",
lands. What remains between the volume and a dispatched build is **one
field-batch signature (CR-WC-9)** and **one external build slot (WY-8a)** —
neither of which is an open question any more; both are scheduled acts.

---

## §E — ESCALATIONS

| # | Item | Why it escalates | To which gate |
|---|---|---|---|
| **E-1** | **CR-WC-9 — the field batch** | **PERSISTED-STATE SHAPE.** Four new `spatialLedgers` families plus `deployment.blocks[]`, a transit projection, relay buckets and column tags. A schema surface is precisely what a signature is for, and the blanket grant's nearest precedent (ES Q5, "a new persisted key family") was ratified as **DEFERRED**, not released. Also rests on an unrun shape census (U5). | Owner, through the chair, on a **WY §2a-style field batch table**. Recommended content is written out in full in the CR-WC-9 entry so the chair can adopt it wholesale. |

**ONE FURTHER ITEM RECORDED RATHER THAN RULED (not an escalation):**
**CR-WC-18** — prisoners and the sea. The recommendation was defer, and
the blanket sign-off **ratifies a recommend-defer item as deferred**. It
is already disposed. **Building either one still requires the owner's
call, which the grant does not supply.**

**TWO CONDITIONAL ESCALATIONS ARMED BY RULINGS ABOVE** (they do not
escalate now, but a build finding flips them):

- **CR-WC-11's valve.** If build finds a catalog stressor cannot carry a
  typed source reference, the third event type is a **store-consumer
  change** and returns to the chair **before landing**.
- **CR-WC-22's far arm.** If the chair ever prefers LIFT, that is a
  war-layer behavior wave with its own golden re-record — owner-facing,
  and never a WC commit.

---

## §F — OBLIGATIONS MINTED, AND WHAT THIS LANE COULD NOT DISCHARGE

This lane was read-only outside
`docs/architected-volumes-pending-fold/` and ran no test or gate command
(a build lane holds the gate as a machine mutex). The following are
**owed, named, and not done** — recorded so none is re-found as a defect.

- **O-1 (from CR-WC-1).** The move-vocabulary arbitration must be written
  INTO `memory/habit-conditioning-directive.md` as an **INBOUND OBLIGATION
  on HB-1**, and carried as a row in `docs/FABLE_VALIDATION_QUEUE.md`.
  **Neither written** — the validation queue lives in the build worktree,
  read-only to this lane. **Until both exist, the arbitration is a
  RECOMMENDATION WITH A FENCE, NOT A CONTRACT** (§4.1.1's own words).
  The same obligation applies to §4.1.2's law-band modulation table.
- **O-2 (from CR-WC-16).** **SOL_QUEUE carries no WC row — CONFIRMED.**
  The row must be added at ARC A's slot. Not written by this lane.
- **O-3 (from CR-WC-19).** The estate has **no single owner for magnitude
  scales**. If the chair wants one, it is a third band family in
  `bandFamilies.js` plus a walker amendment — **its own hygiene wave**,
  alongside the already-owed intensity-ladder consolidation. **Not WC's.**
- **O-4 (from B.1c).** The `warHomeCosts.js:115-116` citation is off by
  one line in **three places** (§0.3, §1.1 fact 2, CR-WC-22). Repoint to
  `:114-115` (comment) and `:116` (gate) at the fold sweep. The
  hand-keyed line-address rot class, realized inside the volume that
  forbids it.
- **O-5 (from B.1a).** §5.2's claim that `bandFamilies.js` owns
  **magnitude** scales is an **overstatement of the live file**, which
  declares two families. Correct the sentence at the fold; it is the
  premise CR-WC-19 was ruled against.
- **O-6 (from B.1b).** §1.1 fact 4 and CR-WC-22 should carry the
  qualifier that "measured silent" is an **empirical zero across seven
  release cases with a named threshold suppressor**, not dead code.
- **O-7 (from CR-WC-21).** §5.1's "CONDITIONAL ON CR-WC-21" paragraph is
  struck; §1.13.2's "unresolved contradiction" becomes resolved; WC-15's
  PINS row replaces the two variants with the three pins. **One commit.**
- **O-8 (verification debt, now small).** Seven of the eight premises this
  document opened as unverified were measured and confirmed. **What
  remains: U6** (the nine-times/two-arities intensity-ladder census — not
  relied on), **U8** (`settlementStrategy.js` has no closed exported move
  vocabulary — CR-WC-1 is robust to it being wrong), and **U9** (the WY
  §2a table's exact form). None would flip a ruling.
- **⚠️⚠️ O-9 (from B.1d — A NEW FINDING, NOT A CHAIR QUESTION, AND IT IS A
  BUILD OBLIGATION RATHER THAN A DEFERRAL).** **Two of the three
  relationship spellings in WC's own admission set are unreachable at
  HEAD:** `'ally'` structurally (an alias key that normalizes to
  `'allied'`), `'defensive_pact'` empirically (no producer anywhere in
  `src/`). §1.1 presents the set as "enumerated against the LIVE
  relationshipType vocabulary", which is the claim that fails. **WC-1's
  admission-set pin must assert REACHABILITY PER SPELLING** — the §5.5
  dead-band discipline the volume commits to for every band edge, applied
  to its own admission set — **or the two dead spellings are dropped.**
  Either is fine; landing them unchecked is not.
- **⚠️ O-10 (from B.1e — AN ARCHITECTURAL TRADE NO CHAIR QUESTION
  CAPTURES).** `isDemographicColumn` arbitrates **two civilian lanes**
  (P2 homeostat vs M4 crisis), not military versus civilian. **Armies are
  kept out of the migration ledger ARCHITECTURALLY today** — separate
  `armyTransit` sub-ledger, separate kernel, no `travelClass` concept.
  **WC dissolves that separation by design**, placing military columns in
  the migration ledger per directive (m)'s one-object-class rule, and the
  `isDemographicColumn` widening is the **first consequence** of that
  trade rather than an incidental repair. **The chair should decide
  knowingly that a predicate now carries a boundary that two ledgers used
  to carry.** The persisted half rides CR-WC-9's batch; the architectural
  half is recorded here because nothing else records it.

---

## §G — THE SURVEY DEBT

**⏳ OPUS-ERA — FABLE SURVEY OWED.** This document was prepared under
**Opus 5, not Fable 5**, under the standing succession protocol. Every
ruling here is marked for the next Fable session's survey-and-validate
pass, which clears the Opus-era debt **first**, before new architecture.

**WHAT FABLE SHOULD RE-EXAMINE MOST CLOSELY, in priority order:**

1. **CR-WC-21's reclassification.** The whole ruling turns on
   `RECENCY_WEIGHTS` being a **bounded floored modulation** rather than a
   decay law, tested against the volume's own source-scan fence. If that
   distinction does not hold, WC-15 re-blocks.
2. **CR-WC-19's flip.** It reverses the volume's recommendation on a
   **measured refutation** of the premise under it. Confirm the
   `bandFamilies.js` header independently.
3. **CR-WC-9's escalation.** Specifically whether a drop-when-empty ledger
   behind a dark virtual flag is a persisted-shape act at its **writer**
   or at its **lighting**. That reading decides five waves' dispatch date.
4. **The five ARTIFACT findings** (CR-WC-2/3/4/5/21). Each dissolves a
   parked collision by reading rather than by trading. A wrong ARTIFACT
   call is the failure mode with the least visible symptom, because it
   looks like a ruling that cost nothing.
5. **The two new findings, O-9 and O-10**, which are not rulings on the
   twenty-two but were surfaced by verifying them. O-9 (two dead
   admission spellings) is a WC-1 build obligation. O-10 (the
   architectural boundary WC trades for a predicate) is the one item here
   that arguably deserved to have been a chair question of its own.
6. **§B.3's three surviving unverified premises** (U6, U8, U9), none of
   which would flip a ruling, each named at the entry that touches it.
