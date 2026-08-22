# WF FAMILY PACKET PREAMBLE — the invariants signed once per volume

> **Authored by lane TC-WF at the code of record `f8d978df`, under the seat model
> `OWNER_DECISION_QUEUE.md` §291.5 (the compile lane verifies; the chair signs and lands), and
> landed at this path by the chair, SIGNED at `OWNER_DECISION_QUEUE.md` **§308** with the rulings on RAISED-1..5 recorded there (the volume re-fold lands in the same commit, closing the copy divergence).** Per `docs/DESIGN_BUILD_EFFICIENCY.md` §4 one family preamble
> per volume lives at `docs/implementation/preambles/WF-PREAMBLE.md`; each member packet then
> carries only its own scope, contract, manifest, acceptance, mutants and hazards, plus a line
> citing this file **BY SHA-256**. An edit here re-stamps every citing packet, so drift between the
> family's members and their shared law is structural rather than merely discouraged.
>
> ⚠ **THE FORMAL FAMILY SIGNATURE IS THE §78 ROUND STAMP, AND IT IS ALREADY GRANTED.** WF carries a
> §70.4 Fable-round stamp accepted at `OWNER_DECISION_QUEUE.md` **§78.1** (2026-08-15), so this file
> lands as the **stamped** family's law rather than as a candidate for one, and §P10's stamp line —
> not the standard's table — is where a compiler reads which member-cap column WF sits in.
> ⛔ **`WF-1A`'s header says the opposite and it was right when it was written**: it read the family
> as UN-STAMPED because `docs/implementation/preverification/` held `EP-SUBSTRATE.md` and nothing
> else, which was true. The stamp lived on the ledger branch with no build-branch artifact carrying
> it. **This preamble and `WF-SUBSTRATE.md` are what close that gap**, and `WF-1A`'s stamp line is
> superseded by this one — an erratum of record, not a re-opened packet.
>
> ⛔⛔ **THE EXTRACTION SOURCE IS THE LEDGER COPY OF THE VOLUME, NOT THE BUILD COPY, AND THIS IS THE
> SHARPEST THING IN THE FILE.** The two copies diverge in **NINE HUNKS**, and every hunk is a §78
> cure the build copy never received. A WF compiler who reads `docs/DESIGN_FP_ARCH_WF.md` at the
> build branch — the ordinary act, since that is where the packets live — inherits **five dead
> premises**, four of which would mis-build a wave. See §P0 and `WF-SUBSTRATE.md`'s COPY DIVERGENCE
> block, which enumerates all nine.
>
> ⚠ **THE SUBSTRATE FIGURES BELOW LIVE IN THE ANNEX, NOT HERE.** This file carries no per-wave
> figure by design (see the closing bullet of this header). ⛔ **A WF compile re-executes every row
> it touches at its own verified base and inherits no absolute from this file or from the annex.**

- **Status:** LANDED at this path by the chair. Compiled by lane TC-WF; verification receipt
  `laneTCWF-receipt.md`.
- **First citing members:** `WF-1B`, then `WF-1C` and `WF-1D` — the three remaining stages of the
  `wf-1` split promotion. `WF-1A` is **LANDED and predates this file**; it carries its own law
  in-packet on the EP-0 precedent, and its §13 "WHAT STAGE TWO INHERITS" is folded into §P1 and §P9
  below rather than left in a landed packet nobody re-reads.
- **Volume:** WF — the FAITH program (`docs/DESIGN_FP_ARCH_WF.md`), **ten declared waves**
  WF-0..WF-9 with WF-2 and WF-5 in two slices each; WF-1 split FOUR ways at compile, giving a live
  ladder of **fifteen members**.
- **Extraction source:** `docs/DESIGN_FP_ARCH_WF.md` at the **LEDGER** branch
  `review-fixes-2026-07-08`, blob **`169c75e7`**, 846 lines — the copy carrying the §78 cures. The
  BUILD copy `f2e5c935` (774 lines) is the PRE-CURE text and is cited only where the annex records
  a divergence. As CORRECTED throughout by the graded substrate annex
  `docs/implementation/preverification/WF-SUBSTRATE.md` (102 graded rows, 23 refuted). Every law below is
  a quotation or a compression of those two; **this file invents nothing.**
- **Compiled against base:** `claude/composite-r4` @ `f8d978df`.
  ⛔ **`docs/implementation/BASE_STATE.json` admissibility is NOT asserted here** — the capsule's
  `stampedAt` is re-read and discharged by each member at its own base, per §P8.
- **Citation law:** a member packet cites this file BY SHA-256 in its header. An edit here re-stamps
  every citing packet, so drift between the family's members and their shared law is structural
  rather than merely discouraged.
- ⛔ **THIS FILE CARRIES NO PER-WAVE FIGURE.** Every census tuple, effective-line count, seal and
  denominator lives in the member packet and is re-executed there. Where a number is load-bearing
  law rather than a budget — the 800 effective layer ceiling, a frozen `scripts/.size-baseline.json`
  literal, the closure of a frozen vocabulary — it is named as a LAW and its measurement is cited to
  the annex.

---

## §P0 · THE VOLUME'S OWN STANDING WARNING, RESTATED FIRST

> ⚠⚠ **THE WF VOLUME IS AN ARCHITECTURE DOCUMENT, AND ITS HEADER'S "compiled against the LIVE tree
> (`claude/composite-r4` @ `e564e135`)" NAMES A 2026-08-04 TREE THAT NO LONGER EXISTS.**

**THE FAITH PROGRAM IS ONE-FIFTEENTH BUILT.** Measured by lane TC-WF by **module census** over the
volume's own declared deliverables — never by commit subject, which is the recorded ES-4/EP
false-positive law:

| declared | at `f8d978df` |
|---|---|
| ten new leaves | **ONE** (`patronFall.js`) |
| eight flags | **ONE** (`faithUnseatingEnabled`) |
| six persisted additions | **ONE** (`religionStates[cid].patronFalls[]`) |
| fifteen live ladder members | **ONE LANDED** (`WF-1A` at `66fda66d`) |

⛔ **MODULE PRESENCE NEVER PROMOTES A WAVE.** Sixteen modules the volume names are already in `src/`
because they are pre-existing MODIFY targets, not WF deliverables: `religionState.js`,
`religiousContest.js`, `religionLegitimacy.js`, `piety.js`, `pantheon.js`, `sacredClaim.js`,
`deityStance.js`, `deityStanceLane.js`, `realmEvents.js`, `peaceTerms.js`, `peaceTermsCatalog.js`,
`warTermination.js`, `pilgrimage.js`, `generosityEV.js`, `settlementRumors.js`, `heraldRouting.js`.

⛔ **LIVE CODE OUTRANKS EVERY TABLE IN THE VOLUME, AND THAT IS THE VOLUME'S OWN RULE**, stated in its
header: *"Where this document and the faith volume disagree on a SUBSTRATE FACT, this document's
executed receipt wins (live code outranks the volume's 2026-08-02 census — its own rule)."* The
architecture layer claimed that authority over the volume beneath it; **the annex now claims it over
the architecture layer**, on the identical reasoning.

⭐ **NAVIGATE BY SYMBOL, NEVER BY LINE NUMBER — AND THE WF FAMILY HAS THE ESTATE'S SHARPEST PROOF OF
IT.** The volume's own §1a R7 is a line-rot sweep: it corrects seven addresses and then closes by
naming the one that held — *"journalPages.js:345 is EXACT at HEAD (`gateFaithEvents`) — one census
row that did not rot."* **At `f8d978df` it is at `:355`.** Two other R7 corrections are dead in both
directions: the empty `customContent: {}` the volume moved from `:112` to `:131` is now at `:210`
and `:680`, and `mutateEntities.js` is not where either address puts it. **A line-rot correction
rots too.** Every WF packet that cites an address cites **TWO ANCHORS** and leads with the symbol;
the annex's §9 carries the family's two-anchor table.

---

## §P1 · THE EIGHT WF-ERA REFUTATIONS THIS PREAMBLE ADDS — each STOP-class, each executed

Each was invisible to reading and visible only to execution; each binds **every** WF wave, not just
the one that found it. All eight are graded rows in `WF-SUBSTRATE.md`.

**R-WF-1 · THE VOLUME EXISTS IN TWO COPIES AND THE BUILD BRANCH CARRIES THE PRE-CURE ONE.** Nine
hunks, all of them §78 cures: the errand precondition, the catalog re-scope, the three-suppression-
site correction, the struck no-normalizer sentence and its replacement lifecycle law, the WF TUNING-
HOME LAW, the `pilgrimageEnabled` lane row, the fired catalog tripwire, and the struck SP-1 probe.
⛔ **A WF PACKET WHOSE "Design authority" LINE POINTS AT THE BUILD-BRANCH VOLUME WITHOUT NAMING THE
LEDGER BLOB `169c75e7` IS DEFECTIVE ON ITS FACE.** The correct citation names both copies and says
which one governs.

**R-WF-2 · THE FAITH FAMILY IS SPLIT DOWN THE MIDDLE BY ONE REGEX, AND SEVEN OF ITS EIGHT REMAINING
NAMED LEAVES FALL ON THE COSTLY SIDE.** `LAYER_PATTERNS.FAITH`
(`tests/lint/couplingInclusion.walker.test.js`) is **eight SUBJECT-NOUN prefixes** —
`faith|sacred|religion|pantheon|conversion|piety|deity|temple` — plus WF-1a's cure, an **exact-path**
regex for `patronFall.js`. The census is TOTAL over `CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//`
and `UNLAYERED_BASELINE_CEILING` is asserted `.toBe`, **exact in both directions**.

| Claimed free by the noun prefixes | Homeless — owes a `LAYER_PATTERNS` row or an argument |
|---|---|
| `faithTermExecutors.js` | `pilgrimSeason.js`, `pilgrimErrand.js`, `legateErrand.js`, `stanceConsequences.js`, `omenReading.js`, `covertCongregation.js`, `tithe.js`, `realmFaithArcs.js` |

⛔ **THE CURE IS AN EXACT-PATH REGEX, NEVER A PREFIX AND NEVER A RENAME**, and WF-1a already wrote
the reasoning into the walker: *"A prefix would claim files nobody has designed and silently widen a
frozen family."* ⭐ **AND IT IS NOT AN `ARGUED_UNLAYERED` CASE**: that roster is for modules owning
no subject at all, and every leaf above owns FAITH's subject outright. ⚠ **An `ARGUED_UNLAYERED`
entry is NOT safe ahead of its target** — the arm asserts `expect(DOMAIN_MODULES, '<module> vanished
— re-aim the exclusion').toContain(module)`, so such an entry must land in the SAME commit as its
leaf. ⚠ **A `LAYER_PATTERNS` addition IS safe while its target is absent**, because no arm requires
a regex to match anything.

⭐ **AND THE PLACEMENT DIRECTORY IS ITSELF A DESIGN FORK NO COPY OF THE VOLUME NAMES.** Four modules
the volume cites bare do not live under `worldPulse/` at all — `settlementRumors.js` is under
`display/`, `heraldRouting.js` under `realm/`, `pilgrimage.js` under `traditions/`, `generosityEV.js`
under `spatial/` — and the first three are **outside the coupling census entirely**. A
`pilgrimSeason.js` placed beside `pilgrimage.js` in `traditions/` costs no row; the same file in
`worldPulse/` owes one. **The choice is made at compile and stated in the packet, never discovered
at the terminal gate.**

**R-WF-3 · A REGISTRATION WAVE CANNOT MINT A FLAG, AND THE WF BILL IS FIVE OBLIGATIONS, NOT FOUR.**
`auditEngineGatedKeys` (`tests/lint/engineGatedRuleKeys.walker.test.js`) is a two-way audit: a key in
`ENGINE_GATED_VIRTUAL_RULE_KEYS` with no by-name `=== true` gate read **reds**, and a gate read
accounted for by nothing **also** reds. ⇒ **the manifest row, the first by-name gate read, and the
AUTHORED certification row are ONE ATOMIC ACT.** ⛔ **A WF wave whose closing line reads "DORMANCY:
total" has no door and therefore mints no flag.**

⛔⛔ **AND THE FIFTH OBLIGATION LIVES IN A SUITE NO FAITH BATTERY WOULD RUN**, which is exactly why
`WF-1A` met it at a terminal gate rather than at compile. `tests/soak-harness/coveringArrayCoverage.test.js`
pins the flag-domain census arithmetic **SEQUENCED**: the `virtual` count, then `union`, then
`union − governed`. **Curing only the first reds the next line.** Every WF flag mint prices all
three literals at compile, with their live values re-read at the member's own base (the annex
carries them).

⚠ **THE CONJUNCTION-GATE HOLE, RESTATED BECAUSE IT IS THE FAMILY'S DESIGN.** Six of the eight WF
flags AND with something — the SPREAD lane with `isFaithSpreadEnabled(rules)`, the LOCAL lane with
`isSubsystemActive(snapshot, 'religion')`. **At least one read per flag is BY NAME.** A read that
exists only through a frozen-list `.every()` is a computed member access, attributes to NO key, and
hides a fully wired flag from the census entirely — that is how a wired flag once shipped invisible.

⚠ **THE ARRAY IS NO LONGER ALPHABETICAL AND NOTHING PINS THAT IT IS.** The only comparison in the
estate sorts both sides. "Insert at the alphabetical position" is a house courtesy; **no WF packet
may price it as an obligation.**

**R-WF-4 · THE ERRAND REGISTRY ALREADY RESERVES WF-2b's TWO MODULES BY EXACT PATH, AND TYPES THE
PILGRIM HALF `personal`.** `ERRAND_CONSUMERS` (`src/domain/worldPulse/envoyErrandVocabulary.js`)
carries, frozen and live: `legates → src/domain/worldPulse/legateErrand.js`, purposeClass
`religious`, `built: false`; and `pilgrims → src/domain/worldPulse/pilgrimErrand.js`, purposeClass
**`personal`**, `built: false`. Both name `wave: 'WF-2b'`.

- ⛔ **THE MODULE LANDS AT THE RESERVED PATH, AND ITS `built: true` FLIP LANDS IN THE SAME COMMIT.**
  `tests/lint/errandConsumerRegistry.walker.test.js` measures both directions: an unregistered
  minter reds, and an unbuilt row whose module mints reds with the message *"flip `built:true` in
  the same commit as WF-2b's landing"*.
- ⛔ **`ENVOY_PURPOSES` STAYS CLOSED AT `['sue','self_parlay']`.** The volume's "never widen war's
  envoy vocabulary" is right and binds THAT LEAF ONLY. ⭐ **The lawful join is one layer up and
  costs nothing**: `ENVOY_PURPOSE_CLASSES` is a six-member frozen vocabulary already containing both
  `religious` and `personal`, whose own header names *"FAITH's legates and pilgrims"* as intended
  minters. **Nothing is widened at all.**
- ⛔ **THE VOLUME'S §5-3 RED-UNTIL-BUILT EXISTENCE PROBE IS STRUCK, AND STRIKING IT IS A CURE RATHER
  THAN A DELETION.** A probe for "module + purpose-token `religious`" passes on the legate half
  alone and would silently mis-type the pilgrim half. **The registry row, not a probe, is the seam.**
- ⚠ Two further arms of that walker bind a WF-2b landing: a `toEqual` naming the built set exactly,
  under a test TITLED for its count (a title rename keeps census cardinality still — take that
  door), and an anti-vacuity arm requiring some row to remain unbuilt (WF-2b leaves two; it holds).

**R-WF-5 · THE "NO LOAD-TIME NORMALIZER" PREMISE IS DEAD, AND THERE IS ALSO A LIVE MIGRATION.**
`worldState.js`'s `CONDITIONAL_LEDGER_KEYS` lists **both** `religionStates` and `spatialLedgers`; the
array's own comment says **the array order IS the serialized key order**, APPEND-ONLY; and the
materialization loop puts every present key through one of three branches (frozen / mutable
deep-clone / dedicated normalizer). ⭐ **AND NEITHER COPY OF THE VOLUME MENTIONS THE MIGRATION**: a
live `WORLD_STATE_MIGRATIONS` entry walks `raw.religionStates` per settlement, renames the pre-split
`chief*` keys, and stamps `schemaVersion: 2`.

⇒ **EVERY WF WAVE ADDING PERSISTED MATERIAL RE-DERIVES ITS LIFECYCLE CLAUSE AGAINST THE EXISTING
MACHINERY** (§78 F-4), naming: (i) which branch its ledger takes and whether a dedicated normalizer
is owed — `normalizeEnvoyRows` is the precedent, and it is an INJECTABLE default-parameter seam rather than a hard import; (ii) the byte-order consequence — top-level order is
the pinned serialized order and **never moves for WF**, which §3's zero-new-top-level-keys law makes
an assertable pin rather than an assumption, while sub-key order inside `religionStates[cid]` and
`spatialLedgers` is the writer's enumeration and is pinned explicitly; (iii) round-trip pins running
**through `ensureWorldState`**, both arms, field-absent and field-present; (iv) the VEIL check,
asserted rather than assumed, that the new material sits inside ledgers `WORLD_SNAPSHOT_HARD_DENY`
already covers. ⛔ **A drop-when-empty fence is asserted against the loop's MEASURED behaviour for
the absent key, at the byte level** — never against the writer alone.

**R-WF-6 · `suppressedAtTick` HAS THREE WRITERS, NONE OF THEM HAS A TICK IN SCOPE, AND THE PRUNE IT
FEEDS IS A PRIVATE FUNCTION.** Three facts, each executed, and together they are WF-1b's whole shape:

1. **THREE write sites, not two.** The build copy names two; there are three, the third inside
   `resolvePatronContest`'s siege-resolution loop — *"precisely the transition a fall cares most
   about"* (`WF-1A` §13). §78 F-3 adopts the correction; the ledger copy carries it with a census
   pin — **scanned write-site count EQUALS stamped-site count, exact** — so a future fourth site
   reds rather than minting a stamp-less entry. **The single-writer obligation is therefore a
   `suppressDeity(state, ref, tick)` helper routing all three, not two.**
2. **No site has a tick.** Neither exported signature takes one and the religion-state record carries
   no tick field. ⇒ **a signature change to TWO exported functions with live callers** — one `src`
   caller each, plus a `scripts/audit/` caller with two call sites that a `src`-only census misses,
   plus fifteen test call sites. ⛔ **PRICE IT AT COMPILE; DO NOT DISCOVER IT.**
3. ⭐ **AND THE NARRATIVE PRUNE KEY LANDS INSIDE A PRIVATE FUNCTION** that no copy of the volume
   names as such: `pruneSuppressed` is **unexported**, its `KEEP` is a function-local const rather
   than a `RELIGION_TUNING` member, and its ONE caller is the last statement of `advanceShares`. The
   flag cannot reach it from the fold without either threading through `advanceShares` or lifting
   the prune out. **That fork is an architectural decision WF-1b states in its packet.**

**R-WF-7 · THE CATALOG TRIPWIRE ALREADY FIRED, WAS DISCHARGED, AND ITS PIN NOW ASSERTS THE FIRED
STATE.** GR-3a landed the five `family:'faith'` catalog rows. `catalogGrewSinceWr10()` returns
**true**, its pin asserts **true**, and the module's own header carries the discharge in prose:
*"the three new families became composable consideration the moment they landed, with no edit here
and no rename sweep anywhere."*

- ⛔ **WF-6 MINTS NO CATALOG ROW** (§78 F-2). It compiles as a CONSUMER; a re-mint collides with
  GR-3a's walkers.
- ⛔ **NEVER WIDEN `WR10_FAMILIES_AT_LANDING`.** The module forbids it in writing — *"IT IS
  DELIBERATELY NOT WIDENED. It is named a LANDING RECORD rather than a policy … widening it would
  erase the fact the tripwire exists to preserve"* — and an exact-length pin reds it. **The lawful
  move is the NAMED GROWN SET**, which is itself an exact-set `toEqual` that has already grown twice
  and reds on a family the set does not name.
- ⛔ **`peaceTerms.js` IS A ZERO-HEADROOM-CLASS FILE**, alongside `warTermination.js`, which sits at
  its frozen `scripts/.size-baseline.json` literal with **zero** headroom, shrink-only. For both:
  net-zero seam lines only, re-measured at the compile's own base with eslint's own `Linter`; **any
  growth is a STOP plus an extraction recipe, never a squeeze.**
- ⚠ Volume **Q3 is not an open question** — the tree already answered it, and §78.3 records it
  CLOSED in the tree's direction.

**R-WF-8 · THE DEFAULT HARD SCOPE BUDGET REFUSES WF WAVES AS CHARTERED, AND THE FAMILY HAS ALREADY
PROVED IT ONCE.** Chartered WF-1 carried thirteen deliverables and broke **five** `PACKET_STANDARD`
hard limits simultaneously — user-facing surfaces, direct production consumers, existing
logic-bearing production files, registration-only production files, and acceptance cases — which is
why the wave is four members. ⛔ **EVERY WF WAVE PRICES ITS DELIVERABLE LIST AGAINST ALL SIX CAPS
BEFORE IT COMPILES**, and where it does not fit, `PACKET_STANDARD` binds: *"the agent stops and
proposes the smallest split. The agent may not quietly renegotiate the budget."*

⚠ **THE REGISTRATION LIMIT IS THE ONE THAT BITES THIS FAMILY HARDEST, BECAUSE A HERALD DESK KIND
COSTS FIVE REGISTRATION HOMES** under CR-GR4B-2's standing override — which lives in
`docs/implementation/preambles/GR-PREAMBLE.md` and `docs/implementation/packets/foreign-policy/GR-4B.md`,
not in the queue; cite it there rather than to a §-ref that does not resolve. ⛔ **ON `WF-1A`'s OWN
READING, ONE DESK KIND ALREADY EXCEEDS THE THREE-FILE REGISTRATION CAP** — that is one of the five
limits its refusal-in-part table names. WF-1b carries one such kind; WF-8 charters roughly twenty.
**WF-8 is a multi-member train by arithmetic, not by preference, and its split is priced at
compile.**

---

## §P2 · THE HAZARD DISPOSITIONS THAT ALWAYS APPLY

1. **THE DEITY DOCTRINE IS CONSTITUTIONAL AND IT IS THE FAMILY'S FIRST LAW.** Faith is **CULTURAL,
   never theological**; there is **no premade deity pool**; buckets are typed under
   FINITE-SEMANTICS; **AI is clerk, never writer.** Every token, receipt and field records **what
   the believers and their rulers did and said**, never what a god did. WF-1a's four causes are the
   worked example: a garrison, an eviction, a contest, a share flip. ⛔ **A WF vocabulary member
   that names a divine act is refused at compile, not softened.**
2. **FIXTURES ACQUIRE DEITIES ONLY THROUGH THE DOCTRINE PATH** — the `SET_PRIMARY_DEITY` /
   `IMPOSE_CULT` mutation verbs — **never by poking config**, and never from a catalogue. ⛔ **THE
   DEITY-FREE CORPUS GOLDEN IS NOT A FAITH DORMANCY FENCE; IT IS VACUOUS FOR THIS FAMILY.** The
   own-footprint golden is captured on a deity-BEARING fixture, **BEFORE wiring**.
3. **THE OUTER GATE IS DATA, NOT CONFIG, AND IT IS WHY DARK IS BYTE-IDENTICAL TWICE OVER.**
   `isSubsystemActive(snapshot, 'religion')` short-circuits the fold on deity PRESENCE before any
   flag is read, so a deity-free world is unchanged even with a WF key lit. **State that
   affirmatively in every WF packet**; it is also why the certification row for a WF flag can only
   ever grade UNOBSERVED until a deity-bearing soak case exists (WF-0's whole purpose).
4. **THE WF FLAGS DO NOT COPY `faithSpreadEnabled`'s SHAPE.** That is a REAL default-false key with
   a legacy `religionDynamicsEnabled` alias kept in preset lockstep. Every WF flag is **VIRTUAL** —
   absent from `DEFAULT_SIMULATION_RULES`, read strictly as
   `worldState.simulationRules.<flag> === true`, normalized into no preset. ⛔ **`religionDynamicsEnabled`
   GAINS NO NEW CONSUMER**, ever.
5. ⛔⛔ **THE WF TUNING-HOME LAW (§78 F-5) IS A PRE-CURED STOP AND IT GATES EVERY BAND IN THE
   PROGRAM.** Every new WF dial lands INSIDE a frozen tuning table: a dial on an existing module
   joins that module's existing table — **all eight homes resolve at this base** and the annex names
   each with an exact anchor — and **every new leaf mints exactly ONE `<NAME>_TUNING` frozen table
   in its own module**, never bare module constants. ⛔ **Every value the volume proposes enters its
   wave's compile as a RECOMMENDATION carrying an executed derivation from measured substrate, or
   the compile STOPS at promotion** (§43's rationale-or-STOP; the HB-2B derivation rows are the
   template). **Lighting and ratification remain owner-held under THE PROMISE.**
   ⚠ The counter-example is in the family's own tree: `pilgrimage.js` carries four bare module
   dials and no table. **It is the shape to refuse, not the shape to copy.**
6. **`spatialLedgers` SUB-LEDGER REGISTRATION IS AN EXACT-EQUALITY CLAIM ABOUT A LIVE WRITER.**
   `tests/lib/spatialLedgerCoverage.walker.test.js` asserts the source-scanned written-key set
   EQUALS `TRACKED_LEDGER_KEYS ∪ EXEMPT_LEDGER_KEYS`. WF declares exactly one
   (`omenReadings`, WF-4). ⛔ **The registration row and its `setSpatialLedger` writer are ONE
   ATOMIC ACT.** Neither copy of the volume prices this; the wave must.
7. **THE DS-FTH CORPUS IS READER-SIDE SPELLING LAW, AND DIVERGENCE IS A STOP.** Seven `DS-FTH-`
   blocks in `src/data/dossierStateProse/warFaith.generated.js` pre-authored the WF state signature,
   `patronFalls[]` and `templeWealth` included. A wave whose writer spells a field differently
   **STOPS**; a wave that amends a DS-FTH row re-runs `npm run gen:dossier-prose` in the same commit
   (Lane P's standing law). ⚠ **Volume Q4 is open at the chair** — this disposition is the
   engineering fact, not the ruling.
8. **THE `patronFall.js` PRECEDENT IS THE FAMILY'S REGISTRATION TEMPLATE, INCLUDING ITS MISS.**
   WF-1a's own compile measured only half the coupling instrument — it checked the pair scan and not
   the unlayered census — and the miss surfaced at the terminal gate. ⛔ **A WF packet that names the
   coupling registry names BOTH halves**, or it is defective on its face.
9. **THE PIN-VACUITY FAMILY, ALL FOUR ARMS.** No WF pin may: assert a list against itself; mirror
   the deriver in its fixture; assert over a surface that never rendered; or sit under an
   unreachable arm. Every negative carries a **positive control in the same test**.
   ⚠ **The family has a fifth, measured instance**: `drawsPilgrims` qualifies on
   `scaleBand >= GRAND_SCALE_MIN && (PILGRIM_ACTS.has(act) || scaleBand >= SPECTACLE_SCALE)`, so a
   "wrong act ⇒ no pilgrims" negative **is vacuous at metropolis scale**. The volume quotes only the
   act-set half as *"pilgrimage.js's own bar"*. **Read the whole predicate before writing the
   negative.**
10. **A COUNT MUTANT ON A LITERAL GOES VACUOUS**, and **a redundant second guard subsumes the one it
    duplicates**. WF mutants convict a **BRANCH**, never a constant. ⚠ If two mutants convict the
    same arms, one of the two guards is vacuous — **that is a STOP and a re-shape, not a pass.**
11. **`fallCauseFor` IS WF-1d's WHOLE CONSUMPTION SURFACE.** It is built, it deliberately has no
    production caller until then, and it returns `null` for a missing identity and **never throws**
    (the Herald-desk law). ⛔ **No WF wave may give it a second caller ahead of WF-1d** without
    re-pricing WF-1a's producer-first identity claim.
12. **THE FIVE-TOKEN FALL VOCABULARY IS FOUR, AND THE CUT IS A MEASUREMENT.** `abandoned` was
    refused for having **zero producers**: `applyUnaffiliatedSink` touches `state.patronRef` on no
    path, `'none'` is a scalar that can never hold the seat, and the sink runs AFTER the seat is
    decided. **Precedence is total and first-match-wins: `imposed` > `suppressed` > `discredited` >
    `displaced`**, settled at compile because the arms genuinely overlap. ⛔ **A later WF member may
    earn a fifth cause only by landing its producer in the same commit** (the GR-5A / INT-3B law).

---

## §P3 · THE §31 ANCHOR PREFLIGHT — MANDATORY, PER NEW TEST FILE

`OWNER_DECISION_QUEUE.md` §31 ruling 2 is law: *"every new acceptance file runs the
negative-assertion anchor walker focusedly BEFORE its member proof is declared green."*
⛔ **A NEW TEST FILE HAS CEILING ZERO IN EVERY TREE**, `tests/domain/` and `tests/lint/` alike; the
scanned matchers are `not.toContain` / `not.toMatch` / `not.toHaveProperty`.

**TO COMPLY**, one of:

1. route through `tests/helpers/anchoredNegatives.js` (`expectPresentThenAbsent` /
   `expectAbsentWithAnchor`) **called by name on the same line** — an alias or wrapper is not
   recognised; or
2. carry `// anchored: <why this cannot go vacuous>` on the assertion line **or the line immediately
   above it**. ⚠ For a multi-line comment only the **LAST** line counts.

⚠ **THIS BITES THE WF FAMILY HARDER THAN MOST**, because the family's signature pins are absences:
*a world that never fell carries NO `patronFalls` key* · *no covert receipt reaches a
non-`includeCovert` projection* · *no `omenReadings` key materializes dark* · *no faith term forms
with `pilgrimageEnabled` dark* · *the executor moves the CHANNEL and never the share*. Every one of
those is a negative and every one owes an anchor.

**THE PREFLIGHT COMMAND** (bare, in-shell, never piped):

```
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?
```

## §P3b · THE MUTATION-COVERAGE ROW EVERY NEW `tests/lint/**` FILE OWES (ODQ §102.2)

⛔ **PRICED AT COMPILE, NOT DISCOVERED AT THE GATE.** `tests/lint/mutationCoverageManifest.test.js`
enumerates every invariant file and requires each to carry a mutation-coverage entry. **A new
`tests/lint/**` file is an enumerated invariant file the moment it lands**, so a wave that mints one
owes its row in the SAME landing. ⚠ **The obligation is invisible to a focused run**, which is how
it was found twice in this estate.

**TO COMPLY**, one of, in the ruling's own order of preference:

1. plant a standing regression in `scripts/mutation-sweep.sh` proving the file reds (**preferred**,
   and it makes the row `kind: 'mutation'`); or
2. add ONE `rationale` entry to `scripts/mutation-coverage-manifest.json` with a written reason that
   describes **real convicting power**, honest only if the file genuinely carries in-suite controls
   or the wave executed mutants against it.

⛔ **NEVER as an `uncovered` row** — that list only ever shrinks. ⛔ **NEVER by re-serializing the
manifest**; insert surgically and check the diff is a pure insert. ⚠ A `rationale` row should NAME
ITS PROMOTION PATH, because the sweep's own revert is the `git checkout --` family this program's
shared-tree protocol forbids outright, so **no build lane may run the sweep on this tree** — the
deferral is real and recorded, not an excuse.

---

## §P4 · THE REGISTRATION TEMPLATE — MANDATORY AT FULL STRENGTH (ODQ §35.3)

Every WF packet that mints a row in a registration file names, **EXPLICITLY AND BY PATH**: the ROW,
the HEAD RE-EXPORT (or the reason none exists), the EXACT-LIST / EXACT-COUNT PIN, and the REGISTRY
TEST PATH. **A packet that names fewer than four is defective on its face.**

**THE WF-SPECIFIC INSTANCES.** Seven registers fire on WF work; each is an **exact** assertion, and
the annex carries each one's measured value at `f8d978df`:

| Register | Instrument | Form |
|---|---|---|
| the engine-gated flag manifest | `tests/lint/engineGatedRuleKeys.walker.test.js` + `tests/domain/subsystemRowsVirtual.test.js` | the two-way audit (§P1 R-WF-3) + the ordered bijection's module-scope literals |
| the flag-domain census | `tests/soak-harness/coveringArrayCoverage.test.js` | THREE SEQUENCED literals — `virtual`, `union`, `union − governed`; curing one reds the next |
| the unlayered census | `tests/lint/couplingInclusion.walker.test.js` | `UNLAYERED_BASELINE_CEILING` `.toBe`, plus the escaped-module, stale-baseline and exact-set arms |
| the argued roster | same file | `ARGUED_ROSTER_CEILING` `.toBe` — **EXACT in both directions**, because a bound that only forbids growth lets a shrink go unbanked |
| `spatialLedgers` coverage | `tests/lib/spatialLedgerCoverage.walker.test.js` | source-scanned written keys `toEqual` TRACKED ∪ EXEMPT |
| the errand consumer registry | `tests/lint/errandConsumerRegistry.walker.test.js` | both directions on `built`, plus an exact `builtModules` list and an anti-vacuity arm |
| the lighting census | `tests/lint/sovereigntyLightingContract.walker.test.js` | the five-figure tuple, **SEQUENCED** (§P5) |

⚠ **AND THREE FURTHER INSTRUMENTS FIRE ON WF WORK WITHOUT BEING REGISTERS**, so a packet that lists
only the seven above is still short: the Herald totality walkers
(`tests/lint/{heraldRouting.walker,phrasedKindPools.walker,wizardNewsAuthoring.walker}.test.js`),
`tests/lint/sizeBaseline.test.js` (which reds a SHRINK as well as growth), and
`tests/lint/.prose-numerics-baseline.json`, whose `line` fields are **hand-keyed addresses that rot
when a WF edit moves lines above them** — WF-1a paid that bill for six rows. ⛔ **RE-ADDRESS such
rows; NEVER delete them.**

⭐ **THE HERALD DESK HAS A PREFIX ROUTER, AND IT IS BOTH THE CHEAP DOOR AND THE TRAP.** A kind spelled
`faith_*` or `pantheon_*` routes with no token-map row at all. **WF-8's totality census must count
such a kind exactly once**, and must count the war-minted faith-desk kind `sovereignty_sale_judged`
once rather than twice.

---

## §P5 · THE GATE-READING LAW, AND THE CENSUS LAW FOR THIS FAMILY

- ⛔⛔ **NEVER WRAP `npm run check*` IN `gate-mutex.sh --run`.** `test:ratchet` re-acquires and
  self-deadlocks; **exit 3 is the mutex giving up, not a red.** Run `check:tail` **bare**, from a
  fresh shell, with `; echo TRUE_EXIT=$?`, and **outlast it in your own turn.**
- ⚠ **AN EXIT NOT READ FROM THE GATE'S OWN TAIL IS NO RECEIPT** (ODQ §50.4). A backgrounded ratchet
  once outlasted its window and the harness reported the WRAPPER's exit 0 over a red gate.
  **Trust no exit status you did not capture.**
- ⚠ **L3 — A SHARED LOG DIRECTORY LIES BY RECENCY.** Read only SELF-NAMED logs, and pair every one
  with an in-shell `TRUE_EXIT`. A log that is merely the newest file in a shared directory is
  another lane's.
- ⚠ **REPORT BOTH TYPECHECK CONFIGURATIONS** (`typecheck:ratchet` / `typecheck:domain:strict`) at
  their exact floors, naming the config AND the window. A per-file `tsc` is a vacuum.
- ⚠⚠ **THE LIGHTING CENSUS IS SEQUENCED AND STOPS AT ITS FIRST RED FIGURE.** When `files` reds,
  `parked` / `credited` / `titles` / `suiteTitles` **never execute** — a green there is a green that
  never ran. In a multi-member train, `suiteTitles` is proved **separately**: grep the WHOLE train
  diff over `tests/` for added `describe(` lines and require the exact predicted count.
- ⚠ **`credited` IS THE FIGURE THAT LIES.** A `test.each()` case is invisible to the census by
  construction and a `describe.runIf()` parks a file WHOLE; either keeps the arithmetic closing
  while `credited` silently does not move. ⛔ **Every WF acceptance file is ONE literal `describe`
  with straight-line `it` calls and string-literal titles. No `.each`, no `runIf`, no nesting.**
- **A census re-record re-derives ALL FIVE figures together** and names the cause; it never patches
  one figure at a time, and the delta is decomposed per file.
- ⭐⭐ **THE TEST CENSUS SITS AT ITS PINNED CEILING, AND "JUST CENSUS IT" IS UNAVAILABLE.**
  `scripts/.test-ratchet-baseline.json` is monotone-down against a literal `CEILING`; *"you may burn
  it; you may never pad it."* **Extend an existing test file; do not mint one** unless the wave has
  priced the two censuses a new file reds. ⛔ **A WF wave whose honest cure is gated leaves the
  identity red-with-attribution and ESCALATES; it never censuses it.** And a failing WALKER is a
  DISABLED GUARD, never census debt.
- ⛔⛔ **ANY CENSUS OR RATCHET MOVE NAMES ITS AUTHORIZING DECISION IN THE PACKET BODY** (ODQ §299.4,
  binding forward: *"a packet that moves any census/ratchet NAMES ITS AUTHORIZING DECISION in the
  packet body, and the packet validator gains a refusal for census moves without an authorization
  ref"*; §303.7 adopts the `censusAuthorization` block as the design of record and is itself the
  authorizing decision for that schema move). **A WF packet moving a census without a resolvable
  §-ref is defective at promotion.**
- ⚠ **AN INTERIOR RED MUST BE NAMED IN THE TRAIN PLAN BEFORE IT EXISTS.** A new WF test file reds
  the census by construction; that is a planned interior red, and an unplanned one is a STOP.
- **The runtime-test count is a FLOOR, not a pin** — transcribed into the capsule from the
  terminal's own executed `test:ratchet` receipt, never predicted.
- ⚠⚠ **ANY `docs/**.md` WRITE IS A GATE RISK.** Naked-claim debt is PER-CLAIM: a new claim reds a
  test that is GREEN today. Run the exact `CLAIM_RE` **before** writing, and never accept a `0
  problems` match that is silently `30 problems`.

---

## §P6 · MUTANT HYGIENE

- Every mutant is **planted by `cp` backup, convicted, and restored `cmp`/`md5`-exact** — the
  restore is proved by digest, never by eye. ⛔ **NEVER the `git checkout` family**: it discards
  uncommitted work, and on this shared tree that work is the owner's.
- **A mutant convicts a BRANCH**, never a literal count (§P2.10).
- ⚠ **A REDUNDANT SECOND GUARD SUBSUMES THE FIRST.** Where two guards can each independently hold an
  invariant, the mutant must delete the one under test **and** prove the other does not cover for
  it, or the conviction is vacuous.
- **A defence-in-depth pair pinned only at the outcome is blind to either door.**
- **A LIT-MUTANT CONTROL IS MANDATORY.** The absent-vs-false differential is blind by design; the
  lit arm is what proves the fences can see. Every WF flag therefore carries the four-fence set
  **plus** the lit-mutant: (1) own-footprint golden on a deity-BEARING fixture captured BEFORE
  wiring; (2) absent-vs-false byte-identity; (3) call-path spy proving the evaluator is not invoked
  dark; (4) gate-polarity source census, non-zero and shrink-only.
- ⚠⚠ **THE FIXTURE MUST BE ABLE TO EXECUTE ITS OWN DEFECT, AND THIS FAMILY HAS THE ESTATE'S
  CANONICAL INSTANCE.** `PATRON_FLIP_TICKS` is 3 and `SHARE_STEP_MAX` is 6, so a fixture advanced
  fewer than ~4 ticks, or whose rival cannot gain 6 share points per tick, produces **base == cure**
  and a silently vacuous pin. ⛔ **BEFORE WRITING ANY PIN, RUN THE SPECIFIED FIXTURE AND PRINT WHAT
  THE ENGINE ACTUALLY DID.** This is standing chair law across the estate, not a WF courtesy, and it
  generalizes to every rate × magnitude dial this family touches — the sink rates, the piety lag,
  the stance cooldowns, the promote/demote thresholds.
- **The volume's own red-capability inventory is the floor, not the ceiling**: every structural guard
  lands with its executed red proof at the wave that mints it — *a guard that cannot be reddened
  cannot be proven*.

---

## §P7 · STANDING STOP CONDITIONS

A WF wave STOPS — and reports rather than repairs — on any of:

1. A premise taken from the BUILD copy of the volume where the LEDGER copy differs (§P1 R-WF-1).
2. A `CREATE` row whose path already exists at HEAD. ⚠ `validate:packets` existence-checks `CREATE`
   rows only at `LANDED`, so such a packet promotes cleanly and dies at the flip — the most
   expensive place to find it.
3. A flag declared without its first BY-NAME gate read in the same commit, or a flag mint that
   prices fewer than five obligations (§P1 R-WF-3).
4. A new leaf under `src/domain/worldPulse/**` or `src/domain/spatial/**` without a `LAYER_PATTERNS`
   home or an `ARGUED_UNLAYERED` argument in the same commit (§P1 R-WF-2).
5. A `spatialLedgers` registration row without a live `setSpatialLedger` writer, or the writer
   without the row (§P2.6).
6. An errand-minting module without its `ERRAND_CONSUMERS` `built: true` flip in the same commit, or
   a purpose-class spelling that departs from the reserved rows (§P1 R-WF-4).
7. A scope budget exceeding any `PACKET_STANDARD` cap (§P1 R-WF-8).
8. **Any movement of `peaceTerms.js` or `warTermination.js` effective lines.** Both are
   ZERO-HEADROOM-CLASS; the lawful answer is an extraction recipe, never a squeeze.
9. **A tuning constant of any kind that has not cleared §78 F-5** — its derivation home table and
   its chair signature under §42/§43 (§P2.5). ⛔ **A curve is a constant, and constants are
   owner-signature surface under THE PROMISE.**
10. A persisted field or schema surface whose lifecycle clause was written against the dead
    no-normalizer premise (§P1 R-WF-5).
11. A same-seed golden that moves. ⛔ **Dark is byte-identical by construction; motion is a STOP,
    never a re-record.** Where a WF wave legitimately shifts output, that is a DECLARED SHIFT: it is
    stated in the packet, carries a pre-feature golden built from `git archive <base>` and the test
    file's OWN fixture, and is proven by a KEY-BY-KEY diff with zero added and zero removed — never
    by the capture's own exit 0.
12. A dependency bump. ⚠ **`package.json` / `package-lock.json` are governed paths and a bump is a
    schema-mint trigger.** No WF wave takes one.
13. A new OSR finding (**verify-at-build; never a `--write`**), or any detector change.
14. Two members of one train promoted together while sharing any `changeManifest` path. ⚠ **A change
    path is reserved at EVERY non-terminal status, DRAFT included** — `religiousContest.js` is named
    by WF-1a, b and c, and `religionState.js` by b and c — so the cure is a **staged promotion**,
    never a validator edit and never a demotion.
15. An interior red that was not NAMED in the train plan before it existed.
16. A further overstatement in either copy of the volume beyond the annex's twenty-three: **STOP before
    building on it**, and add it to this family's refutation register. This is J-WR-13's standing
    rule, which the volume imports by name.

---

## §P8 · CAPSULE ADMISSIBILITY AND THE RE-EXECUTION LAW

`docs/implementation/BASE_STATE.json` is citable as executed **only** by a compiler whose verified
base is exactly `stampedAt`, **or** whose base is a DOCS-ONLY descendant of it with every measured
path byte-identical across that window (chair judgment **J-T1**). ⛔ **The discharge is an EXECUTED
`git diff --name-only`, quoted in the packet — never an assertion that the window "looks
docs-only".** ⚠ `WF-1A` measured its capsule **NOT CITABLE** and re-executed every figure; a later WF
member inherits that finding not at all and re-runs the check at its own tip.

**And regardless: every row a manifest touches is re-executed by the member that touches it.**
Capsule-only compilation is refused.

---

## §P9 · THE FAMILY'S MEASURED SUBSTRATE — stamped facts about the base, not budgets

*Executed at `f8d978df` by lane TC-WF; every figure lives in
`docs/implementation/preverification/WF-SUBSTRATE.md` and is re-executed by the member that touches
it. What follows is the shape of the ground, not its measurements.*

- **The volume exists in two copies with different content.** Build `f2e5c935` (774 lines) is
  pre-cure; ledger `169c75e7` (846 lines) carries the §78 cures. **The ledger copy governs.**
- **The annex grades 102 rows: 79 MEASURED-TRUE, 23 REFUTED.** Where the
  annex and either copy of the volume disagree on a substrate fact, **the annex wins and the volume
  is docketed.**
- **The §78 obligations every WF wave consumes rather than re-argues:** **F-1** (WF-2b builds on the
  landed errand spine; the reserved exact paths govern; pilgrims are `personal`) · **F-2** (WF-6
  CONSUMES the landed GR-3 rows and mints none) · **F-3** (WF-1 stamps all THREE suppression sites)
  · **F-4** (persisted-addition waves re-derive lifecycle against the EXISTING normalizer) ·
  **F-5** (THE WF TUNING-HOME LAW). ⛔ **All five are compile obligations, adopted by the chair's
  signature at §78.2. None is a recommendation.**
- **Two volume questions are CLOSED in the tree's direction** (§78.3): Q2 — SP-4 posture LANDED,
  spelled `courtPostureOf` / `courtRiskAppetiteOf` behind a second virtual flag, so the
  `riskToleranceOf` name-collision the volume feared can no longer occur; and Q3 — faith families
  are already sovereignty-bundle-composable and the tripwire has been discharged.
  ⏳ **Q1 (five realm arcs) and Q4 (the DS-FTH binding) remain OPEN for the WF family sitting.**
  Both premises reproduce: no realm-scale schism arc exists, and DS-FTH-3 binds the state signature
  verbatim. ⛔ **No WF wave may read a validated premise as a ruling.**
- **The WF-1a laws that bind the whole family, inherited rather than re-derived:** the four-token
  fall vocabulary with `abandoned` CUT on a measurement · the total first-match-wins precedence ·
  the `priorPatron`-before-`ensureReligionState` capture cure and its dedicated mutant · the
  fixture-scale hazard · the exact-path `LAYER_PATTERNS` cure · and the four-stage split, whose
  remaining stages are **WF-1b** (`suppressedAtTick` behind its single writer, the flag-forked
  narrative prune key, the settlement extinction beat), **WF-1c** (the realm last-seat beat, distinct
  from the existing tier-change beats) and **WF-1d** (the `warTermination` dissolution join and the
  FaithSection cause-chain line).
- **The one artifact still owed to this family, named so the obligation is legible from its own
  law:** `WF-1A` records that a **WF family preamble** and a **WF substrate annex with a
  Fable-round stamp** are both OWED chair acts, and that *"until the stamp exists the family stays
  at the four-member cap."* **This file and `WF-SUBSTRATE.md` discharge both.** The cap consequence
  is §P10's to state, and it is the chair's to sign.
- **The volume-text corrections owed as a prose micro-act, done by NO wave:** the R7 line-rot
  corrections that have themselves rotted; the V32 compliance-union address; the V36 flag-manifest
  count; the V40 SP-absent row; the V24 pilgrim-bar clause; and the build copy's nine-hunk gap
  against the ledger copy. ⭐ **The last is the most urgent by a wide margin**, because a compiler
  reading the build copy inherits five dead premises without any signal that a cured copy exists.

---

## §P10 · THE §74 CAP, THE §70.4 STAMP PRECONDITION, AND THE §81.3 STANDING BATTERY TEMPLATES

⚠ **ESTATE-WIDE LAW, LIFTED VERBATIM INTO EVERY FAMILY PREAMBLE.** `PACKET_STANDARD.md` permits the
lift for "sections that are genuinely estate-wide law" and requires the lift to be recorded as one;
this is that record. Only the **stamp line** below is family-measured. Every other byte of this
section is identical in the GR, HB, IN, INFRA and INT preambles, so a compile may read it once and
cite it thereafter.

### 1 · The member cap is evidence-gated (`DESIGN_BUILD_EFFICIENCY.md` §2.6, ODQ §74.2)

| Family's §70.4 Fable-round stamp | Engine train | Prose / docs / dossier train |
|---|---:|---:|
| **stamped** | up to **8** members | up to **10** members |
| **un-stamped** | **4** | **4** |

⛔ **THE STAMP IS A PRECONDITION, NEVER A DEFAULT.** ODQ §70.4: a compile citing an Opus-swept annex
that carries no Fable-round stamp **inherits a STOP**. An un-stamped family stays at four however
light its waves look, and no executor may read a light wave class as a stamp. The §61 incremental
machinery keeping an annex green is not a stamp either — the stamp is the round's own recorded
acceptance.

⛔ **NOTHING ELSE IN §2 MOVES WITH THE CAP.** Per-member full proof (§2.2), the ONE terminal bare
gate, truncate-to-green (§2.4), the flag-wave train boundary (§2.5) and the census re-derived WHOLE
at the last tests-moving member (§2.3) are all unchanged. The gate is amortized wider, never thinned.

**THIS FAMILY'S STAMP, AS RECORDED:** **STAMPED** at ODQ §78.1 (absorption 42/54 annex-carried + 12 STRUCTURAL rows unabsorbed, all twelve completed in that same act via the §73 mechanism; voided rows 13 intact / 2 superseded-as-predicted / 0 verdict changes over 7 landings; law pass 5 MATERIAL / 8 DRIFT / 8 HOLDS). **WF engine trains cap at EIGHT members; WF prose / docs / dossier trains cap at TEN.**

### 2 · Pre-proof is compression, never proof (`DESIGN_BUILD_EFFICIENCY.md` §2.7, ODQ §74.3)

A train plan MAY declare a pre-proof plan and run `scripts/preproof-train.mjs` from the serial
executor slot, executing member batteries concurrently in throwaway worktrees outside the repo
before the train assembles.

- ⛔ **A pre-proof green is NEVER landing proof.** Every battery re-runs at its own member commit,
  and the terminal still runs the one bare gate plus the separate boot smoke.
- A pre-proof **exit 1** is an early truncation signal — every battery ran and at least one was red.
- A pre-proof **exit 2** is a harness or setup failure and implies **nothing** about any member;
  reading it as a truncation signal is the recorded R-D6 defect.

### 3 · The premise map rides every train plan (§77; `scripts/premise-map.mjs`)

The compile runs `validate` (with `--annex`), then `queue-check`; at any refutation the executor runs
`scope`. An absent map, an invalid map, a LAW-graded refutation, a near-miss row id, or a truncation
that leaves nothing to continue all keep the conservative FULL-TRAIN STOP. A surviving tail
RE-CHAINS by exact-manifest cherry-pick and re-proves at its new commits; it never lands its original
commits, because those carry the stopped member's tree as ancestor.

⚠ **WF's first train inherits the §77 premise-map obligation from birth** (ODQ §78.3).

### 4 · §81.3 · THE STANDING BATTERY TEMPLATE PER WAVE CLASS

The template deletes the per-wave re-derivation of proof ARCHITECTURE. **Proof CONTENT is
unchanged** — a wave still executes every line below and records its own figures in its own packet.
Per-line provenance is tagged: `[receipt: …]` lines were re-verified against the named landed
receipt, `[law: …]` / `[practice: …]` lines against the named law text. No line claims a receipt
that does not exist.

**Every wave, regardless of class, additionally owes:** the §31 anchor preflight · the validator
status-sequence simulation · `CLAIM_RE` at zero over authored docs bytes, with the per-claim
naked-claim ratchet consulted BEFORE writing · manifest edits surgical-only · exits read in-shell and
gates read from the gate-tail's own line · the §77 premise-map rows for its train.

#### T-ENGINE (exemplars: GR-5A P1′/I1′, INT-3B I1)

1. Focused vitest battery: every touched module's own suite **plus every walker suite whose scan
   claims a touched path** — run own-shell, exits captured.
2. Behaviour pins for each contract line in the packet's contract section, including at least one
   NEGATIVE control per new branch — trajectory / multi-tick pins where state accumulates, not only
   pure-function pins. `[receipt: TE13 C3 (the two-armed eligibility control, proved by reachability
   over 400 seeds) and C6 (totality on the POST-change composer); law: fixture-mirrors-deriver for
   the trajectory clause — a fixture that mirrors the deriver can never see a dead arm]`
3. Census re-derived WHOLE at the last tests-moving member, never patched; effective lines by
   eslint's own `Linter` under `max-lines {skipBlankLines, skipComments}`, never `wc -l`.
   `[receipt: TE12 §4; TE13 §3]`
4. Both typecheck ratchets at their exact floors; the OSR figure held; zero new coupling pairs unless
   the packet prices the row. `[receipt: TE12 and TE13, both]`
5. Same-seed posture STATED: dark = byte-identity proven behind the dormancy fence `[receipt: TE13
   C4 — the dark golden byte- and sha-identical]`; output-moving = the declared-shift row plus a
   pre-feature golden built from `git archive <base>` and the test file's OWN fixture `[practice:
   the ES-Da landing and the §80.2 declared-shift batch — NOT exemplified by any of the three named
   train receipts, all of which were dark]`.

#### T-PROSE

⚠ **NO LANDED TRAIN RECEIPT EXISTS FOR THIS CLASS.** These lines derive from the AO prose-family
contract landings, the GR producers-before-prose law, the finite-semantics law, the per-claim
naked-claim ratchet and the rendered-surface-negative law. `gen-2` will supply the first train
exemplar. A compiler verifies these lines against the named LAW texts, and must not cite a receipt
for them.

1. Corpus additions are DATA under the finite-semantics law: typed buckets only, no new engine
   branches; producers land BEFORE prose (the GR law).
2. `CLAIM_RE` at zero on every authored doc; the per-claim naked-claim ratchet consulted BEFORE
   writing, because a new claim key mints a NEW key and reds a test that is green today.
3. Census motion is TITLE-ONLY or none; no walker baseline moves; the validator status sequence is
   simulated at compile.
4. A rendered-surface pin for at least one consumer of each new bucket — the
   rendered-surface-negative law's second vacuity is a negative that passes because the surface never
   rendered at all.

#### T-WALKER (exemplars: INT-3B's three walkers, IN-1C-A's registry walker)

1. The walker convicts BOTH directions — an exact-set `toEqual` or equivalent: unwritten claims red
   AND unclaimed writes red. `[receipt: TE12 M4]`
2. At least two IN-SUITE MUTANT-CONTROL arms proven to THROW on every ordinary run (the §75 idiom) —
   never a sweep plant, because `git checkout --` on a live shared tree is thrice prohibited.
   `[receipt: TE13 §4.3 — arms 5 and 6, a duplicated section heading and a rotted kind heading, each
   proven to throw]`
3. The mutation-coverage manifest row: the family's own rationale ref in the GRAMMAR / COMMERCIAL /
   §75 shape, TWO surgical inserts, **never a re-serialize**. `[law: ODQ §75.1 option 2, adopted
   verbatim]`
4. Two-census pricing declared at compile — a new test FILE reds two censuses, and the ceiling doors
   are lock-the-win / re-point / cure, named in the packet. `[receipt: TE13 J-TE13-2]`
5. `// anchored:` lines obey the last-line rule; no self-supplied anchors.

#### T-REGISTRY (exemplar: IN-1C-A)

1. The registry row lands WITH its live writer or minter in the SAME commit — the §73.3 F-1
   consumerless-row law; both directions red otherwise. `[law: ODQ §73.3 F-1, quoted]`
2. Flag-minting prices the §49/§50 THREE OBLIGATIONS: the ordered `subsystemRowsVirtual` pin · the
   seven edge-shared bundles when `simulationRules.js` moves · the LITERAL `<flag>: true` drive in
   the acceptance file. Flag waves are train boundaries. `[law: ODQ §50.2]`
3. Minting a seeded chooser or pool additionally prices the §85.4 TWO OBLIGATIONS at compile: its
   decision-fork classification row and its mechanism-coverage baseline row. `[law: ODQ §85.4]`
4. Width and liveness bounds are CURED, never lowered — non-emptiness plus an exact-equality
   exception list naming the small family. `[receipt: TE13 J-TE13-3]`
5. Registry-count constants re-derived, each a measured edit and never an inherited figure.
   `[receipt: TE13 §5]`

⚠ **WF-SPECIFIC RIDER ON T-REGISTRY ITEM 2, MEASURED BY THIS FAMILY:** the flag-mint bill is **FIVE**
obligations, not three or four — §P1 R-WF-3 names the fifth, and `WF-1A`'s own §7 records that it was
found at a terminal gate rather than at compile.

---

## §P11 · BINDING DESIGN-LAW CITATIONS

| Source | What it binds |
|---|---|
| `docs/DESIGN_FP_ARCH_WF.md` @ **`169c75e7`** (ledger) | **the volume of record**: §1 the substrate claims, §2 the eight-flag law and the four-fence set, §3 the canonical model and its lifecycle re-derivation law, §4 the wave specs, §5 the seam contracts, §6 the open questions |
| `docs/DESIGN_FP_ARCH_WF.md` @ `f2e5c935` (build) | cited ONLY where the annex records a divergence; **it is the pre-cure text** |
| `docs/implementation/preverification/WF-SUBSTRATE.md` | **the 23 refutations BIND.** Where the volume and the annex disagree, the annex wins and the volume is docketed |
| `docs/DESIGN_FP_FAITH.md` | the parent faith volume; its §6 judgment blocks stand |
| `docs/DESIGN_FP_SPINE.md` | the constitution: 12 core requirements + chair amendments **13** (alignment engagement, declared or alignment-empty WITH REASON) and **14** (the DM edit story, recorded — never omitted) |
| `docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md` §1/§10 | the inherited laws and the implementer protocol, verbatim, plus the faith addenda |
| `docs/implementation/packets/fp/WF-1A.md` @ `d9cc1638` | the family's only landed member; its learned laws bind (§P9) |
| `docs/implementation/PACKET_STANDARD.md` | statuses, dispatch lifecycle, scope budget, hot-file law, differential member caps, train landings, the preamble citation law, the base-state capsule |
| `DESIGN_BUILD_EFFICIENCY.md` §2 / §2.6 / §2.7 / §3 / §4 | train topology, the evidence-gated cap, pre-proof, the capsule, this preamble's own authority |
| `DESIGN_PREVERIFICATION.md` §1/§2 | SPV consumption + staleness; **TTS §2.2 — a plan asserting an unexecuted validator sequence is DEFECTIVE at promotion** |
| ODQ **§31** · **§35.3** · **§42/§43** · **§49/§50** · **§70.4** · **§74.2/§74.3** · **§77** · **§78** · **§81.3** · **§85.4** · **§102.2** · **§291.5** · **§299.4** · **§303.7** | the anchor preflight · the registration template · tuning signature · the flag-mint law · the stamp precondition · the caps and pre-proof · the premise map · **THE WF ROUND AND ITS FIVE CURES** · the battery templates · seeded choosers · mutation coverage · the compile/chair seat model · census authorization · the `censusAuthorization` block |
| `THE PROMISE` | a seed is a starting world forever; lived history immutable; **tuning owner-SIGNED** |
| the **DEITY DOCTRINE** | faith is cultural, never theological; no premade pool; typed buckets; AI is clerk, never writer |

---

## §P12 · WHAT EVERY WF PACKET STILL CARRIES ON ITS OWN

Scope and boundary, with the non-goals named affirmatively and never by silence · the behaviour and
identity contract · the exact change manifest with its budget priced against every
`PACKET_STANDARD` cap · the executed hot-file, size and coupling preflights · at most eight
acceptance cases with a closed denominator · its wave-specific mutants with their executed red
proofs · its own predicted census motion with its authorizing §-ref · its spine req-13 and req-14
dispositions, RECORDED rather than omitted · its §77 premise-map rows · and the header line citing
this file **by SHA-256**.
