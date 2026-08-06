# DESIGN — THE FP ARCHITECTURE (ten programs compiled for build)

## Synthesis architect, 2026-08-04; the ES + WY owner-amendment fold, chair
## 2026-08-05. THE SINGLE COMPILED VOLUME for the FP build: SPINE (SP) ·
## GRAMMAR (GR) · INFORMATION (IN) · TRADE (TR) · FAITH (WF) · POPULATIONS
## (POP) · INTERIOR (INT) · COUPLINGS (CW) · ESPIONAGE (ES) · WAYFARE (WY)
## — TEN programs. Compiled from eight program architectures plus one
## shared-substrate census, all authored
## 2026-08-04 against the LIVE minifold worktree (branch claude/composite-r4;
## architect measurements at e564e135, census at 3754c6f3, tree at 67a907fe at
## this compile — three points on a moving tree; LIVE CODE OUTRANKS EVERY TABLE
## IN THIS DOCUMENT). The template and protocol authority is
## docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md (its section discipline is copied
## here; its §10 binds verbatim in §10 below). This document is self-contained:
## an implementer with zero session context and this document can build every
## wave — the per-program architecture files (docs/DESIGN_FP_ARCH_{SP, GR,
## IN, TR, WF, POP, INT, CW}.md, plus docs/DESIGN_FP_ARCH_ES.md and
## docs/DESIGN_FP_ARCH_WY.md landed at the 2026-08-05 owner-amendment fold)
## carry the fine-grain per-wave detail and are normative where this volume
## compresses them. THE TWO AMENDMENT VOLUMES are owner-directive programs,
## not synthesis outputs: ES compiles the espionage directive (2026-08-04),
## WY the rumor-durability + absolute-distance directive (2026-08-05,
## sections 1 through 2l). Their own chair rulings (CR-ES-1..CR-ES-6, WY
## Q1-Q5) live in their §7s and are NOT re-stated here.

**Status: ARCHITECTURE. Nothing here is scheduled until the owner sequences it
against the standing pipeline. Every wave ships DARK; no flag lights, no soak
runs, no band ratifies outside the owner-signed schedule. Where this document
and a program architecture disagree on SUBSTRATE, the fresher measurement wins
and the disagreement is a bug to report; where they disagree on DESIGN, the
source volume (DESIGN_FP_*.md) wins. Judgments are labeled JUDGMENT and are
vetoable — an implementer NEVER re-rules one silently. Ten chair questions,
ranked, close this volume (§11) — CQ2, CQ5, CR-FP-1, CR-FP-2 and CR-FP-11
were ruled earlier this era, and CR-FP-3..CR-FP-10 plus CR-FP-12 (a ruling on
CQ2's SCOPE, not a question answer) are RULED in §11's dated addendum (chair,
2026-08-05; every one vetoable by one owner clause). The ES and WY amendment
volumes carry their own ruled lists in their §7s.**

**Reading order for the implementer:** this document top to bottom → the
program architecture file for the wave being built (an ES-/WY-prefixed wave
reads docs/DESIGN_FP_ARCH_ES.md / docs/DESIGN_FP_ARCH_WY.md, which are
normative where this volume compresses them) → the owning DESIGN_FP_*.md
volume, or for the two amendment programs the owner directive itself
(memory/espionage-confirmers-directive.md ·
memory/rumor-durability-and-absolute-distance-directive.md — LAW there) →
DESIGN_WAR_RULINGS_ARCHITECTURE.md §1/§10 (inherited law + protocol) →
docs/DESIGN_FP_ARCH_CENSUS.md (the measured ground).

---

## §1 THE LAWS THAT BIND EVERY WAVE (the WR-era laws; provenance named)

Nine law families. Each was proven by execution in the war/H/P programs — most
by a defect that bit. They bind every FP wave verbatim; the per-program
architectures restate program-specific bindings.

**L1 — DETERMINISM.** Zero new PRNG streams in any wiring. Every stochastic
choice is keyed `hash01` (home `src/domain/region/contestMath.js:45`), key =
`'<program>.<facet>.<realmId>.<settlementId>...'`, codepoint-ordered
enumeration; weighted races are `w * hash01` products with BOTH sides of every
weight proven live. The dead-band law binds every band authored here: measured
reachability, never assumed — three shapes have bitten (unreachable ratios
because a capacity ratio maxes at 1.50; never-written fallbacks because
`beliefRecord(x,x)` is never written; per-digest-calibrated spectra because a
whole realm spans 2..8 march weeks so a band >= 9 refuses nothing).
`pulseKernel.js` (enforcer-effective 1580, BANKED PERMANENTLY under R-BLD-10)
and `applyWorldPulse.js` (941, zero headroom) receive ZERO edits ever — FP
stages mount via the lifecycle host (`settlementLifecycleKernel.js`,
own-flag-before-host-gate — the advanceSovereigntyMarket precedent), the
treaty mint folds, or the mover seam. Provenance: the WR-10 wiring wave
measured that mounting the market stage in the lifecycle kernel the wrong way
would have minted a 35-module dist chunk-cycle (the TDZ boot class), and
R-BLD-10 proved the kernel's PRNG call order IS the stream identity.

**L2 — FLAGS.** Every FP flag is VIRTUAL: absent from
DEFAULT_SIMULATION_RULES and every preset spread, strict `=== true` reads,
dark-never-permissive. Manifest timing is MECHANICAL (CR-WR10-C): the flag
joins `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`simulationRules.js:185`) in the SAME
commit as its first real gate read, with its certification row (or a
declared-pending entry) in that commit, and
`tests/lint/engineGatedRuleKeys.walker.test.js` asserting exactly the one-key
delta. Every flag ships the FOUR-FENCE dormancy set (own-footprint golden ·
absent-vs-false differential · call-path spy · gate-polarity census) plus the
lit-mutant control proving the fences see — the differential alone is blind by
design. THE CONJUNCTION-GATE HOLE: a flag read only through a frozen-list
`.every()` is a computed member access that attributes to NO key — fully
wired, genuinely gated, and invisible to the walker; every flag lands at least
one BY-NAME strict read. Provenance: the WR-10 wiring lane hit the hole
itself (recorded at engineGatedRuleKeys.walker.test.js:141-149), and WW-A's
sovereigntyTradeEnabled join (2026-08-04) is the one-commit precedent quoted
in the manifest's own comment.

**L3 — EPISTEMICS.** Belief-side modules never import truth-side state for a
counterpart's legs. Two ruled pin geometries, pick one, never invent a third:
the ZERO-IMPORT appraisal leaf (sovereigntyAppraisal.js — scores from already
banded words, import list pinned empty) and the PINNED-IMPORT composer
(sovereigntyMarketStage.js — assembles words from a belief map, its import
list pinned, the P4 no-hidden-governor pattern), each with a token scan and a
guard-the-guard positive control pointing at a legitimate truth reader OUTSIDE
the negotiation set. Writers are truth-side by definition and re-read
eligibility at execution, LAPSING with a receipt when the world moved. Missing
belief legs are honest refusal receipts (`known: false`), never truth
backfill. Provenance: K3 ("nobody is ever current") is the war program's
standing law; CR-WR10-H measured that three of the four appraisal legs
existed nowhere and ruled the market un-lightable until they do — §5's SP-B2
is that discharge.

**L4 — PERSISTENCE.** Fight for ZERO new top-level worldState keys — rewrite
existing records through existing homes; the sanctioned growth surface is a
conditionally-materialized `spatialLedgers` sub-key with exactly ONE writer.
Conditional fields drop-when-absent (T4: an empty array is a key and a key is
a byte; absent, never null). Every state-writing wave lands its
canonical-model entry + Lifecycle-paths clause
(create/read/persist/regenerate-under-THE-PROMISE/undo/migrate/veil) BEFORE
the writer builds. Records with no load-time normalizer pin shape discipline
AT the writer (the occupations precedent); records WITH one teach the
normalizer the new field in the same commit (the columnOf precedent — §2's
RF-1). Single-writer families are enforced by shrink-only source-scan
censuses with an executed third-writer plant. Provenance: WR-10's conveyance
landed with zero new keys by rewriting satellites/occupations/treaties in
place; the ghost-write class (a write surviving one lifecycle path and
ghosting another) is this owner's most-bitten bug family.

**L5 — RECEIPTS.** GAME-GRADE TRANSLATE: no raw float ever reaches prose.
Banding is LOSSY, so each clause names ONE band and states every comparison in
WORDS — two numbers straddling a threshold share a band, and printing both
mints a visible contradiction (the contradiction shape). Scalars stay on the
returned read; composed output carries runtime no-decimal pins, because source
scans cannot see composers. Provenance: the WR-5/WR-10 receipt work, plus the
live counter-example this compile re-confirmed — heraldFeed.js:95 mixing a
banded significance word with a raw `0.72` float threshold.

**L6 — HERALD.** Every new news kind lands the FIVE JOINS in its mint commit:
the annex-verbatim pool row · the registry row with requiredSlots + slotless
fallback · WHAT_PHRASES (`settlementRumors.js:116`) ·
EXACT_SECTION/sectionAuthority (`heraldRouting.js`) · the full address chain
(id + settlementIds + typed action + recorded reasons + audience). Missing
identities return null, never throw; dm-only means covert:true fail-closed
UPSTREAM; actor-id keys spread only when non-empty. Kinds get their OWN
walker file (the envoy walker template, frequency-scaled floors), never rows
in a foreign walker. Provenance: the id-less-drop class voided entries at two
sinks; the Herald totality walkers exist because kinds shipped unregistered.

**L7 — VERIFICATION.** tests/lint runs red at base in this estate — attribute
by VIOLATION ROWS diffed against a git-archived base with node_modules
symlinked (the worktree npm-ci EUSAGE hazard), never by walker color or
failing-file name (that misattribution bit three times). Every load-bearing
conjunction gets an executed mutant (cp backup, cmp/md5-exact restore, NEVER
the checkout family) plus a `scripts/mutation-coverage-manifest.json` entry.
New negative assertions carry `// anchored:` on or above the assertion line.
Generation-facing trees are EXACT-ZERO and use
tests/helpers/{anchoredNegatives,seedFailures}.js. Every doc-reading pin
asserts its target appears EXACTLY ONCE (the first-match retargeting hole —
`indexOf('# WR-7')` matches `## WR-7a`). Analytic pins that recompute the
guarded value from the same tokens prove nothing — pin the RENDERED or
EXECUTED artifact. A claim proven on one breakpoint or one fixture is a claim
about one. Provenance: WW-G's address-lie and first-match defects (13 rows
across 3 walkers), the analytic-pin mirror from the V4C arrow work, and the
vacuous CR-WIRE-C pins the war program caught and replaced.

**L8 — SIZE.** sizeBaseline is tolerance-zero in BOTH directions; the domain
layer ceiling is 800 effective lines (components 600). New logic is a lazy
leaf; a hot file at ceiling gets its extraction FIRST (the decomposition
recipe: AST-canonical or stripped-concat behavior identity, whole-domain
strict delta neutral, THE TYPE SURFACE IS PUBLIC SURFACE). Measure with the
enforcer Linter AT the publishing commit — never inherit a figure, including
from this document. Provenance: the peaceTerms decomposition (1680 → 765) and
R-BLD-6/WR-7b; the census's §5 found five files within three effective lines
of the ceiling, one at exactly zero headroom (generosityKernel.js, 800).

**L9 — PROCESS.** Pathspec commits under the staged-set law (never
`git add -A/-u/.`); python3 byte-scan every authored file (the Write tool has
minted raw NULs from escape spellings six times); exactly-once discipline on
volume edits; per-wave implementer + adversarial verifier with reject gates;
STOP-and-report on a measured blocker is a SUCCESS mode (all three WR STOPs
were real). Spine requirements 13 (the Alignment line — engagement declared,
or declared-empty WITH REASON) and 14 (the Edit-verb story — every
player/DM-editable surface named, or engine-only recorded with rationale) are
per-wave totality obligations. Seam pre-contracts toward unbuilt programs are
PINNED FROM BOTH SIDES with a named tripwire — the TR-5 pattern, whose live
exemplar is `catalogGrewSinceWr10()` (sovereigntyBundle.js:166). Provenance:
the agent-stash incident, the NUL class, and the WR chain of honest STOPs.

---

## §2 SUBSTRATE CENSUS (merged; refutations PROMINENT; live code outranks
## every row — re-verify anything you build on, with the multi-spelling grep
## that found it; J-WR-13's standing STOP rule binds: an implementer finding
## another overstatement STOPS and reports before correcting or building on it)

Nine inputs measured the ground: eight per-program re-measurements (each row
receipted file:symbol) and one shared census with two calibrated parsers
(annex counts 7/7 exact against self-declared totals; effective-line strip
10/10 exact against enforcer-measured baseline entries). **45 volume premises
were REFUTED or materially superseded across the eight programs** (SP 4 ·
GR 7 · IN 9 · TR 3 · WF 8 · POP 4 · INT 7 · CW 3). They are the most valuable
output of the whole compile: each would have mis-built a wave. Grouped by
class:

### 2a THE REFUTATION REGISTER (nothing builds on the left column)

**CLASS 1 — MOVED / EXTRACTED SUBSTRATE (navigate by symbol, land in the new
home):**
- `TERM_CATALOG` no longer lives in peaceTerms.js. It was EXTRACTED to
  `peaceTermsCatalog.js` (:141-192): now **12 terms / 8 families**,
  `sovereignty_transfer` landed with WR-10, and `TERM_FAMILIES` is **DERIVED**
  from the catalog at :192 — every sizing pin derives its census from the live
  export, never a hand count. GR-3's "extract the catalog" slice is VOID
  (already done); GR-3/TR-5/WF-6 rows land in peaceTermsCatalog.js. [TR S17,
  WF R1, GR V-2]
- The war-reason taxonomy moved to `warReasonTaxonomy.js` and is **16 <-> 16**
  (lineage, alliance, atrocity pairs landed) — no FP pin may hard-code war's
  count; warReasons.js is a re-export compatibility surface. [WF R3, TR S37,
  IN S23]
- peaceTerms.js was DECOMPOSED into an eleven-module writer family
  (catalog/primitives/appraisal/drafting/carried-sheet/graph/coalition/
  overlay/document/sale + head); its baseline entry was DELETED, so the layer
  ceiling governs: ~766-776 effective at the two measurement points, ~24-34
  lines of headroom. "One family, leaves consume the family's modules" stands;
  the net-zero arithmetic relaxes to stated-delta-under-ceiling, net-zero
  preferred. [GR R-1, IN R4, TR S20]
- Line addresses rotted SYSTEMICALLY across every volume (seven citations in
  TR alone; five in CW; every IN §2 cite at least once). BINDING: navigate by
  SYMBOL; a wave brief that inherits a line address re-greps it first; every
  doc-anchored pin asserts exactly-once. [all eight files]

**CLASS 2 — LANDED SINCE THE SURVEYS (consume, never rebuild; the volumes
could not know):**
- The ENTIRE WR-7 envoy program (~7,750 lines, 20 modules) including
  `sendTwoDivergence.js`, whose header discharges **J-INF-15 by name** — IN-3
  consumes the divergence reader and the vetting vocabulary, never forks.
  [IN R2]
- `negotiationPictures.js` EXISTS (two-picture API complete) — the GR-2/GR-5
  and WF-6 build-precondition is satisfied; one evaluator, two transports,
  forever. [GR R-4, TR S33, WF R5]
- `peaceTermsSale.js` is already the THIRD victor-free mint transport into the
  one instrument — GR-2's pactFormation adds the FOURTH and copies the sale's
  exact pattern (family-member leaf, no peaceTerms re-export, caller outside
  the 35-module import cycle). [GR R-2]
- WR-5's interior halves are BUILT: `warSeatBooks.js` (515 lines — INT-1 is a
  GENERALIZATION wave, not an extraction), `warPoliticalLoop.js` war_decision
  incidents on factionPairStates (supersedes the volume's factionStates home),
  `inheritedDemand`, `applyWarPeaceRefusal`, and WR-2's dispositionChannels
  (decay landed). [INT R1-R6]
- The V-4 provenance/cause-walk estate LANDED: `provenanceKernel.js` (virtual
  `provenanceLedgerEnabled`, ONE_REGEN cohort), `causeWalk.js`,
  `chronicleGraph.js`, `discourseKernel.js`, `heraldIntegrity.js`,
  CauseWalkPanel/CausalityPopup. Building the coupling volume's CW-2 as
  written would erect a SECOND telephone — CW-2 is re-scoped to the CW-2x
  extension. [CW S9]
- The PLANT fold is BUILT (`processLies` takes `commissionedPlants`;
  `disinformationPlant.js` is the envelope-validator law leaf). What is
  missing is ONLY the pulse-level envelope handoff — nothing in src reads
  `metadata.plant`. IN-0a shrinks by two-thirds and becomes a transport wave
  under the zero-kernel-edit law. [IN R1]
- `faithLabel` is a LIVE believed axis on BeliefRecord — IN-2's devotion bait
  is no longer hard-blocked; scarcity/conditions remained blocked at compile
  (and are unblocked by SP-B in this volume's order — §5). [IN S25]
- WR-9's collector already observes the treaty ledger — GR-7 extends the
  collector's own idiom, never a rival script. [GR R-7]
- WR-10 landed whole and dark: treatyOrientation.js (one reader for
  seller/buyer vs victor/loser — the measured `String(treaty.loserId) ===
  "undefined"` failure it prevents), sovereigntyTransfer.js, the
  catalogGrewSinceWr10 tripwire, and the first faith-desk Herald kind
  (`sovereignty_sale_judged`). [TR S35-36, WF R6]

**CLASS 3 — ABSENT DESPITE CLAIM (new work, homed in a wave; never build as
if it existed):**
- **The coupling registry's three walkers DO NOT EXIST** — the only
  enforcement is a hand-enumerated data test, so the same-commit registry-row
  obligation is review courtesy today; AND the couplingId shape pin
  (tests/domain/couplingRegistry.test.js:299) is **WAR-locked**
  (`/^CPL-\d+\.[A-Z_]+\.WR-\d+\./`) — the FIRST non-war registry row reds it.
  CW-0w cures both and is therefore pulled forward (§5 phase 0). [CW S3/S4]
- **The Schism realm arc does not exist** (COMPOUND_SIGNATURES holds five
  keys, none schism) — WF-8 mints FIVE arcs, not four. [WF R2]
- **SP-1/SP-2/SP-3/SP-4 were all unbuilt at compile** (no errand
  generalization, no believed subjects, no peacetime formation, no postureOf)
  — this volume BUILDS them (SP-B/C/D, GR-2/3) and orders every consumer wave
  behind them; the per-program declared-dark arms remain as re-sequencing
  insurance. [GR R-5, TR S46, WF V40, INT §1]
- **Three of the four appraisal-class belief legs exist NOWHERE** for an
  arbitrary (court, holding) pair; `storesBand` is ERRAND-SCOPED; only
  `trajectoryBand` exists (and only under beliefAxesEnabled). The injectable
  `beliefLegsFor` seam (sovereigntyMarketStage.js:311) is the supply road —
  SP-B + SP-B2 supply the leg SURFACES and are two of the THREE members of
  the CR-WR10-H discharge; ES-4 is the third and proves the distant SOURCE
  (amended at the 2026-08-05 fold, ES ⟨F9⟩ — see §3's lighting contract).
  `readiness`/`confidence01` are
  raw floats with NO ladder — an L5 hazard at every consumer; any wave
  narrating them mints the ladder ONCE through SP-A's bandFamilies (J-WR-10-B
  binds the mint). [census §2, SP V6]
- **Seven of the eight FP receipt-pool annexes are read by NOTHING** (TRADE,
  FAITH, GRAMMAR, INFORMATION, INTERIOR, POPULATIONS, COUPLINGS — 3,679
  authored variants across 509 kinds with no source reader, no walker, no doc
  pin), and no FP volume names its own annex. The corpus itself is CLEAN
  (zero kinds below their SP-6 frequency-scaled floor in any of twelve
  annexes; 9,072 variants). What is missing is wiring, not sentences. §8
  carries the obligations. [census §1]
- **`alignmentOf` is NOT an export.** It is an INJECTED CLOSURE PARAMETER
  (typed at beliefMap.js:1021 and informationStatecraft.js:485, composed at
  the pulse call sites). The constitution's beliefMap.js:915 /
  informationStatecraft.js:584 addresses rotted, and WF's V40 row inherited
  the stale claim — SP's deeper measurement (R1) is the binding one.
  Req-13 consumers bind the injection seam, never an import. [SP R1 over
  WF V40]
- **No news-kind significance registration surface exists.** The pacing
  governor (narrativeTempo.js) throttles stressor/arc BIRTHS only; display
  significance is ad hoc (heraldFeed.js:95 mixes a banded word with a raw
  0.72). SP-A mints the one significance family; SP-E lands the registration
  walker and the migration census. [SP R4]

**CLASS 4 — SHAPE AND ADDRESS CORRECTIONS (the premise was subtly wrong):**
- The errand ledger is TOP-LEVEL `worldState.envoyErrands` (conditional
  materialization, writer envoyErrand.js), NOT `spatialLedgers.errands` —
  SP-D generalizes IN PLACE (J-SP-2); migrating a live persisted key is
  owner-gated churn, declined (§11 Q10 confirms). [SP R2]
- `riskToleranceOf` is TAKEN: `src/domain/roads/state.js:319` exports an
  npc-grain roads-courage read consumed by roadsKernel. SP-C's court-grain
  read collides by name — the one genuine cross-architect conflict in this
  compile (§11 Q1 rules it; whatever the arm, import-source pins and header
  documentation land at every consumer). [SP R3, GR R-5, WF V42, INT §1]
- `warIntents` rows are `{targetId, tick}` with TTL 2 — there is no intent
  scoring to pressure; GR-6's occasion 1 lands as a bounded multiplier at the
  opener's soft gate (the embassyLedger idiom mirrored). [GR R-6]
- **The migration column normalizer is a WHITELIST that strips unknown fields
  at THREE rebuild sites** (`columnOf`, spatial/migration.js — enqueueColumns
  rebuilds the whole ledger every M4 dispatch tick). POP-1/POP-5a's new column
  fields each amend the conditional carry-through IN THE SAME COMMIT as their
  writer, pinned by a round-trip-THROUGH-ENQUEUE test, not a save/load test.
  Columns persist fine — serialization was never the hazard. [POP RF-1]
- An UNCLASSED return column is landed by M4's releaseArrivals with the wrong
  story and no clearing — the closed class set gains `'returning'` (J-FP-POP
  ruling, §6; POP Q1's recommendation adopted). [POP RF-2]
- CR-WR10-C (2026-08-04) SUPERSEDES every volume's flag-manifest mechanics:
  manifest membership + certification row (or declared-pending) + first
  strict by-name gate read in ONE commit, never the backlog. §3 binds it for
  all 52 flags (43 at compile + espionageEnabled + the eight WY flags, folded
  2026-08-05). [POP RF-3, TR S38, IN §2, WF §2, INT §2]
- `mass_migration` IS a mintable stressor type — only the ARRIVAL coupling is
  absent; the capacityModel:633/stressorGates:476 reads are live for DM- and
  pressure-born stressors. POP must not repurpose them; arrivals-feed is
  owner-deferred (§11 Q6). [POP RF-4]
- PLANT_REFUSALS is SIX today (pin seven after `too_hot`); QUERY_REFUSALS
  stays five. [IN R5]
- The info flags are NOT uniformly dark: `distancePricedNewsEnabled` is lit
  in the ONE_REGEN preset spread; `allyIntelSharingEnabled` is lit in the
  Full Simulation preset (dormancy fences must capture THOSE presets by
  name); `intelTradeEnabled` is an INVISIBLE key (gated in src, declared
  nowhere) — cured in IN-4 commit 1 (J-INA-4). [IN R3]
- The npcCredibility mouthpiece plane landed (spokesperson stamps on
  DisinfoRecords) — IN receipts compose it; no new NPC state. [IN R6]
- The ruled significance vocabulary today is TWO-valued (`major|notable`);
  `routine` does not exist until SP-A mints the family — CW-1 and every
  damping target wait on it. [CW S15, SP §4]

### 2b THE SHARED GROUND (census digest — the eight facts every wave builds on)

1. **The annex corpus is complete and unwired** (2a class 3). The one lawful
   reader is `tests/helpers/receiptAnnex.js` (line-anchored regexes asserted
   exactly-once, every failure a THROW) — FP annex readers EXTEND it, never
   fork it, and copy `warCostKindPools` as the walker template (never
   `phrasedKindPools`/`lineageKindPools`, which read NO annex — a scoped
   boundary, but the wrong template to copy).
2. **BeliefRecord carries exactly two always-present banded legs**
   (`strengthBand` 0..4, `allianceLabel`) plus flag-conditional
   `populationTrendBand`/`observanceLabel`/`faithLabel`;
   NEGOTIATION_SUBJECT_BANDS (ten fields over four ladders) lives INSIDE an
   errand. There is no (observer, subject) query for stores/tier/route today —
   SP-B builds it as beliefAxes fold arms.
3. **The plans-lane discipline** (demographicsPlans.js header) is the worked
   example every state-minting wave reads first: band-crossing triggers, ONE
   persistent plan, ask-P2-first, single-writer foundings, zero PRNG.
4. **The ONE pressure ladder** (`OVERFLOW_BANDS` — a LEVEL, never a
   DIRECTION; all four rungs measured reachable) has exactly ONE non-owner
   consumer (WR-10's stage, under J-WR-10-B). NOTHING structurally enforces
   the single ladder — SP-A lands the shrink-only pressure-ladder mint census
   (J-FP-2) before seven programs start reading pressure. A program needing
   growing/shrinking borrows SOVEREIGNTY_TRAJECTORY_BANDS or
   populationTrendBand; needing how-full borrows OVERFLOW_BANDS; reading the
   wrong one is a silent semantic error no walker catches.
5. **The flag manifests, verbatim:** ENGINE_GATED_VIRTUAL_RULE_KEYS = five
   members (beliefAxes, conquestDoctrine, infoStatecraft, migrationRumors,
   sovereigntyTrade — all with certification rows);
   PENDING_MANIFEST_KEYS empty (WW-A drained it — the atomicity mechanism
   working); EXEMPT = routineMajorApproval alone, by recorded rationale;
   BACKLOG_RULE_KEYS = 17, shrink-only, asserted exact, new keys forbidden.
   The walker measures **51** gate-read keys in src (not the 18 an earlier
   census reported — the JSDoc-cast spelling hides fifteen); budget
   certification bills against 51.
6. **The hot-file ground (L8):** generosityKernel.js **800/800 (zero
   headroom)**; generationReceiptJudgments 799; convergence 798;
   armyTransitKernel 798 (the M speed-floor spine); envoyDiplomacy 797 (writes
   storesBand); then peaceTerms ~766-776, beliefMap 771-773,
   informationStatecraft 763. The three files FP grazes first have under
   fifty lines between them and a red gate — any wave adding a read budgets a
   lazy leaf in the same commit. eventProse.js (751) is the pool-shape
   precedent and CANNOT host seven programs' pools — each program's pools are
   their own leaf from the first commit (warReceiptPools.js is the pattern).
7. **The SP-6 kind-pool walker state:** post-WW-G the four war walkers route
   through receiptAnnex.js; the four surviving red rows are exactly the
   Class-B set, and D-W3's "trim the corpus" arm would put ALL FOUR kinds
   below their own SP-6 floor — only cap-raise survives (§11 Q7 formalizes).
8. **Certification substrate:** the CW-0 coupling registry EXISTS (schema v2,
   26 frozen WAR rows, ~10-12 rows of headroom before its own ceiling — the
   per-volume leaf split is pre-planned in CW-0w); subsystemRows* lanes are
   the certification idiom; couplingRegistry rows land in the SAME commit as
   their cross-layer read (walker-enforced only after CW-0w).

### 2c MEASUREMENT DISCIPLINE

Raw `wc -l` and enforcer-effective lines are DIFFERENT CURRENCIES: pulseKernel
is 2,820 raw / **1580 effective-banked**; applyWorldPulse 1,291 raw / **941
effective**; settlementStrategy 1,360 raw / 812; warTermination 818 effective
FROZEN. Only enforcer-effective figures are load-bearing, only at the
publishing commit. Counts rot like line numbers: the Herald routes 354 kind
tokens today (not 269; knowledge starvation ~1.1%, worse); WF-8's 3x census
re-baselines at its own commit; IN-6's decontamination lists re-measure at
build. Never quote a figure from a volume — including this one.

---

## §3 THE FLAG FAMILY (52 new virtual flags; the manifest law; the lighting
## contract)

**The law (all 52, no exceptions — CR-WR10-C, superseding every volume's §3
mechanics):** VIRTUAL (absent from DEFAULT_SIMULATION_RULES and every preset
spread); strict `=== true` reads, dark-never-permissive; at least one BY-NAME
read (the conjunction-gate hole, §1 L2); the flag joins
`ENGINE_GATED_VIRTUAL_RULE_KEYS` + its certification row OR declared-pending
entry + its first real gate read in ONE COMMIT (pending entries convert to
real rows at the program's convergence wave — the WW-A precedent; the
engineGatedRuleKeys walker asserts the exact one-key delta); the four-fence
dormancy set + lit-mutant control per flag; display-side flags take
EXEMPT_RULE_KEYS rationale rows instead (the heraldCausalVoiceEnabled
precedent). Certification lanes: each program certifies in its own
subsystemRows lane file (INT mints subsystemRowsInterior.js; others follow
the WW-A/virtual-rows pattern) — the totality walker asserts the PARTITION,
not the address. The five WR flags predate the manifest and certify
lane-only; that history-vs-doctrine nonuniformity is chair question Q5.

| # | Flag | Program / wave | Gates (one phrase) |
|---|---|---|---|
| 1 | `believedScarcityEnabled` | SP-B | believed-scarcity axis family in the beliefAxes fold (trade's subject) |
| 2 | `believedConditionsEnabled` | SP-B | believed tier + stores + route position + pull (populations' subject AND WR-10's three missing legs) |
| 3 | `believedDevotionEnabled` | SP-B | believed-devotion axis family (faith's subject) |
| 4 | `strategicPostureEnabled` | SP-C | settlement appetite stock + posture composition's appetite term |
| 5 | `errandSpineEnabled` | SP-D | generalized errand mint head (six purpose classes, declared/true split) |
| 6 | `treatyLifecycleVoiceEnabled` | GR-0 | lapse/detection beats, longevity voice, lie-revealed tie, DM true-state chip |
| 7 | `oathHolderEnabled` | GR-1/GR-4 | sworn stamps, succession question, succession_repudiation, repudiation credibility charge |
| 8 | `pactFormationEnabled` | GR-2/GR-3 | proposal ledger, triggers, two-sided drafting, standalone NAP, new term families' producers |
| 9 | `treatyRenewalEnabled` | GR-5 | renewal window, renegotiation, conversion, worstObservedEver writer |
| 10 | `mediationGeneralizedEnabled` | GR-6 | intent-stage pressure, fraying-pact pass, temple arm |
| 11 | `secondOrderBeliefEnabled` | IN-1 | mirrorOf + every consumer |
| 12 | `infoLureEnabled` | IN-2 | axis-typed plant subjects + bait receipts |
| 13 | `counterIntelEnabled` | IN-3 | sweep/vet/send-two/hide-as-answer + suspicionOf + house exposure producer |
| 14 | `reputationRaceEnabled` | IN-4 | race-at-arrivals + who-knew-first outcome keys |
| 15 | `casusCommerciiEnabled` | TR-1 | the commercial reason ledger (8 severance/partnership pairs) |
| 16 | `merchantHousesEnabled` | TR-2 | house ledger, formation/ruin/rename, threshold acts |
| 17 | `believedMarketsEnabled` | TR-3 | believed scarcity consumers + the WHERE composer |
| 18 | `foodCaravansEnabled` | TR-4 | physical grain arrivals + treaty streams as caravans |
| 19 | `tradePactsEnabled` | TR-5 | commercial term executors + the trade-demand trigger |
| 20 | `corneringEnabled` | TR-6 | corner gate/composer, warehouse seizure, monopoly dwell |
| 21 | `venturesEnabled` | TR-7 | venture ledger, legs, stake risk |
| 22 | `factorErrandsEnabled` | TR-8 | commercial errands + the compromised factor |
| 23 | `faithUnseatingEnabled` | WF-1 | fall classification, patronFalls ring, suppressedAtTick, obituaries |
| 24 | `pilgrimageEnabled` | WF-2 | the season + legate/pilgrim movers |
| 25 | `faithStanceConsequencesEnabled` | WF-3 | stance aggression/durability consumptions |
| 26 | `omenReadsEnabled` | WF-4 | omen readings ledger + opposable arms |
| 27 | `faithSchismEnabled` | WF-5 | split + creedRef + covert congregation |
| 28 | `faithTermsEnabled` | WF-6 | faith term executors over GR-3's rows |
| 29 | `titheEnabled` | WF-7 | quarterly fold, templeWealth, splendor/remission |
| 30 | `faithNarrationEnabled` | WF-8 | the faith voice + five realm arcs; lights LAST in WF |
| 31 | `believedMigrationEnabled` | POP-1 | belief arm at the pull seam, arrival clearing, return column, letters home |
| 32 | `commonsArcEnabled` | POP-2 | refusal rung, refusal pricing, the misrule answer |
| 33 | `departureMemoryEnabled` | POP-3 | departureMemory ledger, kin-pull, spent-tie |
| 34 | `calamityArcEnabled` | POP-4 | arc staging + attributed burial lines |
| 35 | `roadDramaEnabled` | POP-5a | column events, lost-column inference, road-reputation belief write |
| 36 | `moverPermitsEnabled` | POP-5b | the four permit consumers + treaty-input reads |
| 37 | `seatBooksEnabled` | INT-1 | the generalized books read's non-war consumers |
| 38 | `interiorVetoEnabled` | INT-3 | decision grievances generalized, join receipts, re-reads, emigre arm |
| 39 | `strainAttributionEnabled` | INT-4 | attributed pressure receipts, commons tribute term, rally receipt |
| 40 | `memoryHorizonSeamEnabled` | INT-5 | band-scaled half-life/lookback + founding wounds |
| 41 | `deliberateForgivenessEnabled` | INT-6 | burial verb both arms, suppression reads, dig-up |
| 42 | `legitimacyCrossingsEnabled` | INT-7 | legitimacy crossing receipts |
| 43 | `cascadeGovernorEnabled` | CW-1 | the cascade braid at Herald composition |
| 44 | `espionageEnabled` | **ES-0** ⚠ (this cell said ES-1 until 2026-08-06 — see below) | covert confirmation missions on the errand spine: mission mint + gauntlet + typed products (CONFIRM/ACQUIRE/REFUTE) + doctrine + absence discount |
| 45 | `severityDurableRumorsEnabled` | WY-2 | severity-durable rumor fidelity: the one-multiplier amendment on organic per-hop weathering |
| 46 | `caravanBodiesEnabled` | WY-3 | shipment departTick+path stamps, the mission leg clock, the quantization cadence |
| 47 | `flowMigrationPhysicalEnabled` | WY-4 | the flow_migration exactly-one fence: columns, not teleports, under the spatial canon |
| 48 | `migrationCargoEnabled` | WY-4 | faith cargo + launching receipt on migration columns |
| 49 | `moversCarryNewsEnabled` | WY-5 | arrival fidelity injections + the going-dark read |
| 50 | `caravanSeizureEnabled` | WY-6 | the army×caravan prize arm |
| 51 | `caravanFloorEnabled` | WY-11 | the per-region subsistence circulation floor |
| 52 | `armySupplyEnabled` | WY-8 (slice 8a) | military supply: the F9 stock-in-transit, consumption/condition coupling, rest-debits + requisition-resistance (2k) |

Existing flags this volume completes or consumes WITHOUT re-minting:
`settlementPoliticsEnabled` (INT-2 completes it — exists dark),
`economicCoupReadEnabled` (INT-4 note — owner lighting queue, no code change),
`commonsVoiceEnabled` (backlogged; POP-7 lands its certification row and
shrinks the backlog), `intelTradeEnabled` (invisible key; IN-4 commit 1 joins
it to the manifest — J-INA-4), `beliefAxesEnabled` (host conjunction of the
three SP-B axis flags — a family cannot be lit under dark axes),
`faithSpreadEnabled` (a REAL default-false key, not virtual; WF flags do NOT
copy its shape and religionDynamicsEnabled gains no new consumers),
`provenanceLedgerEnabled` (ONE_REGEN cohort, owned by the engine-finale
program; CW-2x reads its ledger and never touches the cohort),
`memoryWeaveEnabled` (gates the whole grievance-consumer lane — every INT
dormancy proof covers the weave-dark arm explicitly). `espionageEnabled`
requires `errandSpineEnabled` lit first; its axis-fed arms degrade declared
while `believedConditionsEnabled` is dark. The WY flags gate conditional
FIELDS on existing records (§4's WY entry); none mints a key.

**⚠⚠ FLAG-ATTRIBUTION NOTE — `espionageEnabled` WAS MINTED AT ES-0, NOT ES-1.
THIS PARAGRAPH IS THE ONE SPELLING; every other site points here.** (Chair
correction, 2026-08-06, vetoable. Row 44's "Wave" cell and ES-1's §5 block both
said ES-1 and both now point at this note rather than restating it — the
derive-don't-restate law.)

**THE AUTHORITY IS NOT THIS DOCUMENT — it is the manifest's own inline
provenance comment** in `src/domain/worldPulse/simulationRules.js`, which reads
*"Joined 2026-08-05 by FP wave ES-0 … in the SAME commit as its first real gate
read (`espionage/espionageGate.espionageActive`, read BY NAME with the strict
`=== true` idiom) and its AUTHORED certification row — never a pending entry."*
`git log -L` attributes that line to `55674790`, whose own message states *"THE
FLAG LANDS AT ES-0, not ES-1 — the chair rider that postdates the volume."*
`espionageGate.js` already implements the full three-door conjunction. **If this
note and the manifest ever disagree, THE MANIFEST WINS** and this note is the
thing that is stale.

**WHY THIS MATTERED ENOUGH TO AMEND A §3 CELL.** `SOL_QUEUE.md` names this
volume as the ordering authority, so an implementer working from row 44 would
mint a key that is already present with an authored row. The
`engineGatedRuleKeys` walker asserts an EXACT one-key delta and reds on the
unaccounted second mint. The correction had existed since 2026-08-05 in
`DESIGN_FP_ARCH_ES.md`, but was applied only to that volume's header and never
to the ES-1 block beneath it — **a half-applied correction is worse than none,
because the volume then contradicts itself and a reader may land on either
half.** Both halves are now pointers.

**⭐ THE SCHEDULING CONSEQUENCE, which the stale cell was hiding: ES-1 through
ES-7 are ALL no-new-flag waves.** Every one of them rides `espionageEnabled`.
They therefore do NOT contend for the CQ5 single-flag landing slot and may run
concurrently with a flag-minting lane. Seven waves leave the serialized column —
not the six a stale note elsewhere records.

**The lighting contract:** lighting order = build order (§5); a flag lit out
of order is an invalid config each program's convergence walker reds. SP-B's
axis flags require `beliefAxesEnabled` lit first; WF SPREAD-lane flags AND
with `isFaithSpreadEnabled`; POP flags require `demographicsEnabled`;
`faithNarrationEnabled` lights last within WF. All lighting is owner-held at
the signed soak redo. THE WR-10 CONVERGENCE (amended at the 2026-08-05 fold,
ES ⟨F9⟩): the `sovereigntyTradeEnabled` lighting condition is satisfied by
**SP-B + SP-B2 + ES-4 landed**: SP-B mints the leg SURFACES, SP-B2 wires the
SEAM, and ES-4 proves the SOURCE — a non-neighbor (court, holding) pair
appraised `known:true` through a completed confirmation mission, per the
owner's espionage amendment (2026-08-04: spies are the source of
tier/route/trajectory legs about non-neighbors). A market lit on surfaces
without distant sources would clear only rumor-range holdings — the CR-WR10-H
dead-lighting trap one level up. THE INHERITED PHANTOM, CORRECTED AND THEN
DISCHARGED: this paragraph previously claimed a WR-9 certification
lighting-order row cites those wave ids; no such row existed as an artifact
anywhere in src/tests/docs. RE-MEASURED AT THE FOLD HEAD `32cc17f7` (not
inherited from the 99d63d92 census, which undercounted): the phantom claim
lived at FIVE sites in TWO documents — this paragraph, §5 wave #4 (SP-B2's
charter), §9 seam row 4, and docs/DESIGN_FP_ARCH_SP.md at BOTH its SP-B2 wave
block and its §8 item 10. All five were amended by that fold commit; a
fold that amends fewer leaves a normative per-program volume contradicting
this one on the exact trap the amendment closes. **THE INSTRUMENT WAS BUILT
AT SP-B2, 2026-08-05.** The clause now reads: the lighting condition is
RECORDED in CR-WR10-H (war volume §9), this paragraph, §5 wave #4, seam row 4
and the SP volume's two sites, and it is EXECUTABLE as
`SOVEREIGNTY_LIGHTING_EVIDENCE` + `evaluateSovereigntyLighting` in
src/domain/certification/warConvergenceContract.js, measured against the tree
by tests/lint/sovereigntyLightingContract.walker.test.js. Three rows, one per
wave, each with an ADDRESS a walker can read rather than a boolean the
contract asserts about itself: SP-B by the CQ5 flag manifest, SP-B2 and ES-4
by markers a live pin must carry in its title. It cites SP-B + SP-B2 + ES-4 as
its green condition, reads `UNSATISFIED_TRACKED / missing ['ES-4']` today, and
flips `SATISFIED` the commit ES-4 lands — both states executed pins, and the
tracked state never reds the base suite, because a build-order fact is not a
defect and an instrument that failed on one would be deleted. THE NEGATIVE IS
EXECUTED, NOT REASONED: at `32cc17f7`, `warConvergenceContract.js` carries no
`requiresLandedWork` field at all, `subsystemRowsVirtual.js`'s
`sovereigntyTradeEnabled` row carries no landed-work condition, and
`tradeConvergenceContract.js` — the one file that does use
`requiresLandedWork` — never names `sovereigntyTradeEnabled`.

---

## §4 CANONICAL MODELS (per program — new state, deliberately small; every
## entry lands its full Lifecycle-paths clause in the program file BEFORE its
## writer builds; drop-when-empty at every level; exactly ONE writer each)

**The fights won:** ZERO new top-level worldState keys across all ten
programs. All growth is (a) EIGHT new conditionally-materialized
spatialLedgers sub-keys, (b) conditional drop-when-absent fields on existing
records, (c) pure modules with no state. One contingent ninth sub-key exists
only if IN-0a's primary transport fails verification (Q3). THE TWO AMENDMENT
PROGRAMS HOLD THE LINE AND ADD NOTHING TO (a): between them ES and WY mint
ZERO new top-level keys, ZERO new spatialLedgers sub-keys and ZERO new
mapState keys — ES one conditional sub-record, WY nine conditional fields on
existing records plus the frozen-digest datum `spatialDigest.kmScale`. WY's
nine are an OWNER-GATED BATCH SIGN-OFF (persisted-record shape;
docs/DESIGN_FP_ARCH_WY.md §2a IS the request). F9 `supplyCargo` is UNSIGNED
at this fold — no wave mints it until the owner signs its row; every field is
drop-when-absent and flag-gated, so an unsigned row stalls exactly one wave,
never the program.

| New spatialLedgers sub-key | Program/wave | Writer (one) | Regen story |
|---|---|---|---|
| `pactProposals` | GR-2 | pactProposals.js | RE-DERIVED from re-scored triggers (a queue, not an archive) |
| `commercialReasons` | TR-1 | commercialReasons.js | RE-DERIVED from state (same seed, same entries) |
| `houses` | TR-2 | houseLedger.js | PRESERVED — books are event-accrued (disclosed J-WR-3-class exception); ships a load-time normalizer (dormant-with-books shape) |
| `ventures` | TR-7 | ventureLedger.js | PRESERVED in flight; dangling shipmentRefs close `failed` with receipt |
| `omenReadings` | WF-4 | omenReading.js | history — preserved with religionStates; readings never re-derive |
| `departureMemory` | POP-3 | departureMemory.js | RE-DERIVED (pure function of ticks and flows); terminal death freezes pairs |
| `calamityArcs` | POP-4 | calamityArc.js | RE-DERIVED from replayed evidence; pruned after aftermath window |
| `burials` | INT-6 | burialLedger.js | PRESERVED (campaign state); a regen that removes a pair lapses its burials through the writer |
| (`pendingPlants`) | IN-0a fallback ONLY | act-apply lane | drop-when-empty deposit under the D-3 contract — exists only if Q3's primary road fails |

**Conditional-field families on existing records (owner: the existing
writer):**
- SP: `envoyErrands[].purposeClass` + `declaredPurpose`/`truePurpose` (present
  together only when they differ; legacy rows derive `diplomatic` — no
  migration); `dispositionStats[sid].appetite` (written only under
  strategicPostureEnabled; the lit ledger's bytes untouched dark — pinned);
  beliefRecord `scarcityBands`/`conditionsBands`/`devotionBand` (ride the
  belief partition's decay/forgetting/persistence wholesale).
- GR: `treaty.sworn` / `provenance` (legacy resolves 'dictated' AT READ, never
  rewritten) / `lineage` / `worstObservedEver` (MONOTONE, written only under
  treatyRenewalEnabled at the V-7 fold); `TermRecord.beneficiary`;
  breachType value `succession_repudiation` (vocabulary, not a key).
- IN: disinfo records gain `axis` ('strengthBand'|'faithLabel'|SP-2 family;
  ABSENT = legacy strength semantics — the only migration is no migration) +
  `assertedValue`/`trueValue`/`intent`. THE TWO-CHANNEL RULING (J-INA-2): the
  envoy-picture plant channel (ENVOY_PICTURE_PLANT_FIELDS, ephemeral,
  per-errand) and the belief-axis channel (persistent, lifecycled) are
  DISTINCT and stay distinct — a source scan asserts no axis token enters the
  picture vocabulary or vice versa.
- WF: `religionStates[cid].patronFalls[]` (ring <= 3) +
  `deities[ref].suppressedAtTick` + `deities[ref].covert` + `templeWealth`
  (banded stock, never books); `settlement.institutions[].creedRef`. Every
  spelling is BOUND to the pre-authored DS-FTH dossier corpus (R8) — one
  exactly-once doc pin lands with WF-1; divergence is a STOP; a wave amending
  a DS row re-runs `npm run gen:dossier-prose` in the same commit.
- POP: migration column extensions `travelClass:'returning'` + `believedBand`
  + `events[]` — each REQUIRES the columnOf conditional carry-through
  amendment in the same commit (RF-1), pinned through-enqueue; commonsVoice
  rung-extension fields through the one kernel writer.
- INT: `LadderGrudge.originHolderId` (stamped once at first succession,
  immutable); decision-grievance SIBLING incident types
  (pact/severance/stance/sale/burial `_decision`) through
  mintFactionPairIncident — never a re-type of persisted war rows (THE
  PROMISE).
- CW: NOTHING. The coupling program persists zero bytes; any CW slice that
  finds itself writing worldState has left its spec and STOPs. The braided
  item is VIEW-ITEM-WITH-RECEIPT-DISCIPLINE (deterministic composition-time
  id, address chain, typed action, entity refs — never persisted).
- ES: `envoyErrands[].covert` (present only on covert-class rows; itinerary
  <= 3 + product + demand band + tap-marked gathered gradient partials +
  standoff mark; drop-when-absent; `normalizeErrand` taught in the writer's
  commit). Vocabulary members: FOREIGN_GUEST_HOLD_CAUSES + `caught_spying`;
  TRAVELLER_KINDS/HIDDEN_PATH_KINDS + `covert_envoy`. ZERO new top-level
  keys; zero new spatialLedgers sub-keys; every
  clock/doctrine/notoriety/wariness/dwell/promotion-risk read DERIVED (the
  ransomDwellRead precedent).
- WY: nine conditional fields on existing records (supplyShipments
  departTick/path; missions legDepartTick; migration faithCargo/causeReceipt;
  deployments+armyTransit experience; armyTransit prizeCargo + supplyCargo) +
  the frozen-digest datum `spatialDigest.kmScale` (CARRIED FORWARD through
  every receipted re-canonize — the rebuild path re-receives it,
  lifecycle-pinned); ZERO new top-level keys, ZERO new ledger keys;
  normalizers taught same-commit (columnOf THROUGH-ENQUEUE; the commodityFlow
  arrive-loop reconstruction taught departTick/path; supplyShipments
  round-trip landed at WY-3); route positions stay DERIVED — the
  route-position-id guard census. Owner sign-off table:
  docs/DESIGN_FP_ARCH_WY.md §2a.

**Pure modules with no state (the spine's exports):** bandedStock.js (the
shared half-life shape + crossing-receipt grammar + anti-ratchet property),
bandFamilies.js (SP-6a significance {routine, notable, major} + SP-6b
severity — minted ONCE; volumes assign, never author), strategicPosture.js
(postureOf + the risk-appetite read, threshold-shaped only, import-pinned),
outboundImpression.js (second-order belief heuristic — reads the OUTBOUND
record only, zero-import pin excluding the belief partition), and every
program's evaluator leaves.

**Lifecycle discipline (all programs):** the full seven-path clause
(create/read/persist/regenerate/undo/migrate/veil) is written in each
program's §3/§4 BEFORE the writer builds — the war volume's WR-10 declaration
is the model. Universal clauses: JSON-round-trip pinned per shape including
the JSON-ALIAS TRAP (factions[].members[] ARE npcs[] objects — fixtures
round-trip through real serialization); undo rides the pulse ring wholesale;
import validates closed vocabularies and heals dangling refs to ABSENT with a
receipt, never a crash and never an invented name; veil — no new public
payload builder anywhere, every projection rides
includeCovert/includeGroundTruth fail-closed upstream, and every public
payload builder returns through veilPublicPayload (standing law).

---

## §5 THE WAVES (75 waves, dependency-ordered ACROSS programs; each: one
## commit per wave/slice, focused gates per slice, full gate at wave end
## through check:tail / gate-tail.sh, ledger row; every flagged wave DARK per
## §3; the per-program architecture file carries the full spec — the block
## here is the binding charter, order, and cross-program deltas)

Numbering is the compiled build order. "Early-eligible" marks the measured
buildable-now set whose early motion is chair question Q2; absent that
authorization, strict order holds. Two lanes may interleave only where a
wave's block names sanctioned parallelism.

THE FOLDED WAVES CARRY THEIR VOLUME IDS, NOT COMPILED NUMBERS (JUDGMENT,
vetoable — recorded here rather than taken silently). The 2026-08-05
owner-amendment fold inserts eight ES waves and seven WY engine waves into
this order: 60 + 8 + 7 = **75**. They are inserted AT the position each
volume's queue clause names and are read in document order like every other
wave, but they keep their `ES-`/`WY-` ids rather than renumbering #1..#60 —
renumbering would rot every live cross-reference to a numbered wave
(SOL_QUEUE, the eight program files, the war volume, the memory index, and
this document's own §9). The compiled number and the volume id are equally
binding as ORDER; only the number is scarce. WY's five SURFACE waves (WY-0,
WY-7..WY-10) are NOT in this count — they live in SOL_QUEUE §2 LANE B as
their own named sub-block, and WY-8's ENGINE slice 8a (which mints flag 52)
rides that row.

> **PROGRESS — THE ONE HOME FOR BUILD STATE. RE-DERIVE BEFORE YOU TRUST IT.**
> Measured at `d9c7cae4` on `claude/composite-r4`, 2026-08-06 (the CYCLE-5 close, LANE-B
> slice — read the scope caveat at the foot of this block before trusting its totality).
> **The command, so this block is never the authority — the tree is:**
> `git log --oneline --no-merges -300 | grep -E '^[0-9a-f]{7,} (SP-[A-F]|GR-[0-9]|IN-[0-9]|TR-[0-9]|WF-[0-9]|POP-[0-9]|INT-[0-9]|CW-[0-9]|ES-[0-9]|WY-[0-9])'`
> then READ each candidate's commit body — a wave-shaped subject is not a landing.
>
> **LANDED, by sha:** #1 SP-A `59df13a9` · #2 CW-0w `b3fb8f49`+`f7da6b60`+`03dee5fd`+`e30770bd`
> · #3 SP-B `4c0f2f38`(+`2a71dee3`) · #4 SP-B2 `f4016560` · #5 SP-C `cbd348a5` ·
> #6 SP-D `0aac6792`(+`57fe385b`) · **#7 SP-E `7a77c84b`** · #8 GR-0 `b441bca5`(+`d1cfdb67`) ·
> #9 GR-1 `caab995a` ·
> #10 GR-2 `a18fdcfa`(+`91075d45`) · #23 TR-1 `d7ea69a4`(+`93c118b6`) · ES-0 `55674790`.
> **PART-BUILT:** #16 IN-0 — slices **0a** (`729112df`+`94d0c798`), **0b** (`6a497bab`) and
> **0d** (`db35bad6`) of its four; **0c, the disclosure executor, is UNBUILT**;
> #31 TR-9 — slice **9c only** (`c7933e84`, the contract module).
> Everything not named above is UNBUILT. Full receipts, gate posture and the
> per-wave judgment register: `docs/FABLE_VALIDATION_QUEUE.md` — the cycle-4 close row, and
> the CYCLE-5 LANE-B close row for this stamp.
>
> ⚠ **GR-3 HAS NOT LANDED, AND ITS WORK IS SITTING IN THE WORKING TREE.** At this stamp
> GR-3a has ZERO commits in `d615171a..d9c7cae4`; its verifier returned REJECT and a repair
> lane holds nineteen uncommitted files. **A dirty tree is not a landing** — do not promote
> it here until a sha exists.
> ⚠ **THIS STAMP WAS TAKEN BY A LANE-B SLICE AND IS NOT A TOTALITY CLAIM OVER ITS OWN SPAN.**
> The span also carries four ES-lane commits — `dda24851`, `e7eeaeff`, `1b111399`,
> `d9c7cae4` — which that slice did NOT audit. **Whether ES-1 has LANDED is deliberately
> UNDETERMINED here**, not denied; it belongs to the ES lane and its repair chain. Every
> FP-numbered row above, and ES-0, was re-derived at this commit. Re-stamp from a slice that
> audited both lanes.
>
> ⚠ **ES-4 HAS NOT LANDED AND THE LOG READS AS IF IT HAD.** Eleven commits carry "ES-4"
> in their subject (`8a4b0aef` through `d48224e3`); `8a4b0aef`'s body opens "THE WAVE DID
> NOT LAND." Those commits built the LIGHTING INSTRUMENT, not the confirmation leg. ES-4
> is fifth in its volume. **ES-2 and ES-3 are unbuilt.** (This clause read "ES-1/2/3 are all
> unbuilt" at the `57fe385b` stamp, which was true then; ES-1 commits landed inside the
> cycle-5 span, so its status is now the UNDETERMINED item flagged above rather than
> "unbuilt". Corrected at re-stamp and reported, not changed silently.)
> ⚠ **THE PER-PROGRAM SIBLING FILES CARRY AD-HOC LANDED NOTES AND ARE NOT MAINTAINED AS
> A SET** — absence of a marker there proves nothing. Only this block claims totality, and
> only at the commit stamped above — and at this stamp only as qualified by the LANE-B scope
> caveat, which is the first thing to close on the next full-tree re-derive.

### PHASE 0 — THE GATE OPENERS (before any FP cross-layer registry row)

**#1 SP-A — THE PURE FOUNDATIONS** (no flag; dark by construction; SP §5).
Charter: `bandedStock.js` (the SP-5b shared half-life shape + crossing-receipt
grammar + anti-ratchet property with an executed ratchet-mutant);
`bandFamilies.js` — **the SP-6a significance family {routine, notable, major}
and SP-6b severity ladder are MINTED HERE, once** (this is the wave CW-1 and
every damping/pacing assignment waits on); the band-family reconciliation
walker (`spBandFamilies.walker` — Bands-line <-> tuning-table totality, both
directions, shrink-only frozen backlog for pre-existing war tables); the
no-term-literal source scan (no SP module can name a TERM_CATALOG family,
guard-the-guard against peaceTermsCatalog.js itself). COMPILED ADDITION
(J-FP-2): the shrink-only PRESSURE-LADDER MINT CENSUS lands here — the
OVERFLOW_BANDS single-ladder discipline gets structural enforcement before
seven programs read pressure, and the LEVEL-vs-DIRECTION distinction is
doc-pinned. Alignment: declared-empty with reason. Edit-verb: engine-only,
recorded. Zero existing-src edits.

**#2 CW-0w — THE WALKERS THE REGISTRY IS OWED** (no flag; four slices; CW §4;
pulled forward per Q2-CW ratified here as J-FP-3). Charter: slice 1 widens the
WAR-locked couplingId regex to the closed nine-prefix alternation
(WR|TR|GR|WF|POP|IN|INT|SP|CW) + splits couplingRegistryWar.js out of the
575-line head (verbatim row moves, head re-exports, census strings updated
same commit); slice 2 lands the baseline-frozen shrink-only cross-layer
INCLUSION RATCHET (`couplingInclusion.walker` over module SETS, positive
control on WR-4's registered trade read, two executed mutants); slice 3 lands
schema v3's optional frozen `kinds[]` + the DESK WALKER (registry-vs-routing
agreement, non-empty floor, IN-5 refile precedence stated in-file) + the
shared `couplingReceiptSample.js` helper with the WAR sample; slice 4 extends
proseNumericsWalk with the push-indirection fifth detector (the
relationshipMemory postureReasons escape, baselined shrink-only). HARD
PRECONDITION: no non-WAR cross-layer registry row lands before slice 1.
Alignment/Edit-verb: declared-empty (instrument estate). Collisions: one src
mechanical split — land in a quiet window, pathspec discipline.

### PHASE 1 — THE SPINE (SP first; the WR-10-lighting convergence lives here)

**#3 SP-B — THE BELIEVED-WORLD AXES** (flags 1-3; SP §5). Three subject
families as beliefAxes.js FOLD ARMS (seam ruling: no parallel believed-world
module, no second decay law — the axes ride BELIEF_TUNING and the infoMode
gate for free): scarcity (per closed good class), conditions (tier + stores +
route position + pull — WR-10's three missing legs), devotion (banded; the
engine never confirms the god). Each arm gates on ITS flag AND
beliefAxesEnabled, one by-name read each. beliefMap.js (771-773 effective)
gains fold call-site lines ONLY — new logic lands in beliefAxes.js or its
sibling leaf (the beliefMap-is-hot ruling, J-FP-4, answering TR Q3: SP-B's
family and TR-3's consumers are sibling lazy leaves with a module-set census
so relocation cannot leave filename-anchored pins vacuous).
`outboundImpression.js` (second-order heuristic, no flag — dark by
construction) ships beside. Pins: four-fence x3 + lit-mutants;
conjunction-reachability per axis; wrong-belief per family;
never-written-fallback audit; three-family independence goldens. Collision:
beliefMap.js is war-lane-adjacent — CHECK-GIT-FIRST.

**#4 SP-B2 — THE BELIEF-LEGS DISCHARGE** (rides SP-B's flags; SP §5).
`beliefLegsOf` (sovereigntyMarketStage.js) widens from one leg to four
THROUGH the existing injectable `beliefLegsFor` seam — the stage's
composition is untouched. The lit-with-legs contract fixture flips from
proves-the-seam to proves-the-supply; the four-leg totality pin (each absent
leg = `known:false`, never a guess); the degraded-arm pin (three lit, one
dark still refuses). **THIS WAVE PLUS SP-B ARE TWO OF THE THREE MEMBERS OF
THE CR-WR10-H DISCHARGE — the WR-10 lighting precondition; ES-4 is the third
(ES ⟨F9⟩, folded 2026-08-05).** After #3 + #4 + ES-4 land,
`sovereigntyTradeEnabled`'s lighting-order row is satisfiable and the war
program cites "SP-B + SP-B2 + ES-4 landed" as the receipt: SP-B mints the leg
SURFACES, SP-B2 wires the SEAM, ES-4 proves the SOURCE. The row itself was
MINTED AT SP-B2 (2026-08-05) as `SOVEREIGNTY_LIGHTING_EVIDENCE` in
src/domain/certification/warConvergenceContract.js — it did not exist at
32cc17f7 — and reads UNSATISFIED_TRACKED until ES-4;
see §3's lighting contract and §9 seam row 4. Collision:
sovereigntyMarketStage.js is the war lane's file — coordinate through the
queue if dirty.

**#5 SP-C — THE POSTURE READ** (flag `strategicPostureEnabled`; SP §5).
The appetite facet on dispositionStats (J-SP-4 — the J-WR-11
extend-never-duplicate idiom; outcome-learned, decayed on bandedStock's
shared shape; THE REVERSAL PIN mandatory) + `strategicPosture.js` (postureOf
+ the risk-appetite read for the closed actor set; threshold-shaped ONLY,
import-pinned so it cannot name a victim — E3's law). DEGRADED ARMS DECLARED:
books term ABSENT-not-zero until INT-1 mints seatBooksEnabled; channels term
absent while dispositionChannelsEnabled dark; the posture receipt NAMES its
input set (tripwire: a receipt that fails to reds). **BLOCKED ON Q1:** the
export naming (riskToleranceOf collision with roads/state.js:319) must be
ruled before this wave lands — whichever arm, the import-source pin set and
both-site header documentation land with it. Consumers: GR-2+, TR-2/5/7,
WF-3/5/7, POP-1/2/5b, INT-1 — lighting seatBooksEnabled later is a
pre-declared disclosed shift carried on INT-1's list.

**#6 SP-D — THE ERRAND SPINE GENERALIZATION** (flag `errandSpineEnabled`;
SP §5). The war errand becomes the estate's one purposeful-travel substrate,
IN PLACE (J-SP-2): six closed purpose classes {diplomatic, commercial,
religious, factional, personal, covert} beside the existing war purposes
('sue'/'self_parlay' map to diplomatic as data); the generalized mint head in
a NEW leaf `errandMint.js` (envoyErrand.js at ceiling gains only the
delegation call); the declared/true split on the covert seam (truePurpose
covert-side, fail-closed in the existing projection); per-errand keyed forks,
K.2 snapshot, interceptability, and the M speed floor apply to every class BY
CONSTRUCTION (same writer, same transit kernel — the totality walker extends
to the new leaf). THE CONSUMER REGISTRATION TRIPWIRE: a frozen consumer map
(GRAMMAR envoys; factors/legates/pilgrims/couriers/ambitious as volumes land)
with a both-ways walker. **This wave unblocks:** WF-2b (purpose `religious`),
TR-8 (`commercial`), IN-4's courier retirement (`covert`/`commercial`),
INT-3b (the emigre — INT Q1's HOLD dissolves by this sequencing: the
chair-commissioned generalization IS this wave). Collision: the envoy family
is the war lane's most-recently-edited surface — CHECK-GIT-FIRST mandatory.

**#7 SP-E — THE NARRATION KIT ASSEMBLY** (no engine flag; SP §5). The
registration checklist codified as `tests/helpers/kindPoolWalker.js` (the
envoy walker generalized — frequency-scaled floors by import, not
transcription; floors derive from the kind's OWN significance, retiring the
fixed-five requiredSlots class per D-W3's cap-raise arm, Q7); THE
FREQUENCY-SCALED FLOOR walker with the ~269-token legacy frozen backlog
(shrink-only — the walker cannot red the estate at birth); THE
PHRASE-REPETITION ENVELOPE soak instrument (own certification leaf; collapse
mutant executed); the heraldFeed.js:95 significance-migration census
(assessment first — the census names the debt, each surface migrates in its
own small wave). Zero engine behavior changes.

**WY-1 — THE SCALE CHARTER** (no flag; DATA-GATED by `spatialDigest.kmScale`;
WY §5, lane E; slots at the PHASE 1 TAIL — spine infrastructure, dark by
absent data). Charter: absolute realm distance derived from the map's own km
scale, the per-map band derivation, and the mode table. J-D11(b) is
ACTIVATED AND AMENDED here, not contradicted: the mode table lands gated by
`spatialDigest.kmScale`, DECOUPLED from `portOpportunityEnabled` (which stays
the J-D11 (a)/(c) port program's flag) — the war volume's two J-D11(b) sites
carry the pointer sentence landed in this same fold commit (WY §5b item 9).
The km-scale datum is CARRIED FORWARD through every receipted re-canonize
(lifecycle-pinned; the rebuild path re-receives it). Seam: SP — one position
model, no second speed floor (law M binds in every denomination); the
armyTransit exemption is FILED as a structural-prevention candidate, not
fixed here.

### PHASE 2 — GRAMMAR (SOL_QUEUE row 12; GR §5)

**#8 GR-0 — THE LIFECYCLE VOICE** (flag `treatyLifecycleVoiceEnabled`;
EARLY-ELIGIBLE — no spine reads). Lapse/detection beats at the V-10 prune
site and V-6 compliance crossing (peaceTerms.js ~766-776 effective: state the
delta, prefer net-zero); `treatyLifecycleVoice.js` leaf (beats + ageYears +
`treatiesPricedDuring` — the GRAMMAR-to-INFO read landed HERE, unconsumed-pin
tripwire reds when IN wires it); the twenty-year eulogy with a MOLD walker
(substring pins cannot see grammar); the DETECTION CROSSING keys on the
OBSERVED transition (two-tick fixture, never a single-tick harness). ALSO
lands the treatyDisposition OUTCOME-FREEZE pin (GR seam 8 — GR endings mint
no new WR-2 outcomes; one line, both programs safer). Own-footprint fence
runs with dispositionChannelsEnabled dark to isolate WR-2's deltas at the
same two sites.

**#9 GR-1 — THE OATH-HOLDER IDENTITY** (flag `oathHolderEnabled`;
EARLY-ELIGIBLE). `oathHolder.js` composes EXACTLY governingFactionOf ->
npcInFaction -> codepoint-stable pick -> durableIdForRoster; null = no stamp
= seat-voice. Stamps at THREE mint doors (war mint, carried-sheet, sale —
the tree grew a third since the volume; stamp totality walker across all
three or red); generosity credit obligations stamp too. Death changes
NOTHING; SAME-SEAT determinism + regen re-stamp pinned; the JSON-alias
round-trip (sworn.npcId IS a roster object). Collision: peaceTermsSale.js is
WR-10's file — the stamp hook is a small gated addition coordinated via the
war chair's queue row.

**#10 GR-2 — PEACETIME FORMATION + THE STANDALONE NAP** (flag
`pactFormationEnabled`; needs SP-B/SP-C landed). Mount: `advancePeacetimePacts`
as a settlementLifecycleKernel stage BESIDE advanceSovereigntyMarket
(own-flag-before-host-gate; NEVER a pulseKernel edit — J-GRC-2); stage order
FIXED and pinned: market first, pacts second (a court that just sold reads
the post-sale world — JUDGMENT, vetoable). Mint/amend: `pactFormation.js` +
`pactAmendment.js` as peaceTermsSale-pattern writer-family leaves (composes
catalog/primitives/clock directly, writes through treatyLedgerOf, NOT
re-exported by the head, caller outside the import cycle); the ONE
peaceTerms.js edit is the war door's amendment-awareness guard (delta
stated). `pactProposals` ledger per §4 (cap MAX_OPEN_PROPOSALS, settled rows
prune); five closed triggers incl. renewal; transport dark = hopWeeks
answerDueTick (dwell bands stated against the measured 2..8-week digest
spectrum — the calibrated-weeks hazard), lit = the SP-D/WR-7 envoy purpose
`diplomatic`, transport-mode on every receipt. THE THIRD readAllianceWebRisk
consumer — the closed-census walker update ARGUED in-commit. K3 pin set
gains pactTriggers/pactProposals; the SALE-COEXISTENCE pin (acceptance
against a standing sale instrument AMENDS it; the sale door's refusal
asserted UNCHANGED — Q8's fenced baseline). Edit-verb: `PROPOSE_PACT` with
the full store-action registration set (operationRegistry +
gen:compendium-data).

**#11 GR-3 — THE NEW TERM FAMILIES + THE ONE-TIME TRIPWIRE DISCHARGE**
(second slice of `pactFormationEnabled`). Rows land DIRECTLY in
peaceTermsCatalog.js: five faith + three population + `mutual_defense`, each
with its executor (the 7th `grant` executor kind consolidates in
treatyEnforcement.js), PLUS the three trade-rights rows (`exclusivity`,
`market_access`, `toll_exemption`) as executor:'seam' under GRAMMAR-canonical
spellings (the V-4 non_intervention mechanism: no producer = never drafted =
byte-identical) — GR Q1 and TR's recommendation AGREE; TR-5 lands executors
and producers later. **THE DISCHARGE (J-FP-1, binding):** this commit is the
FIRST catalog growth past WR-10's landing set, so `catalogGrewSinceWr10()`
reds HERE by recorded design, and THIS commit executes the tripwire's full
instruction ONCE: re-read the war volume's §5 degradation note, assert the
bundle widened mechanically (TERM_FAMILIES is derived — faith and trade
families become sovereignty-bundle-composable the same day, WF Q3's COMPOSE
arm, forced by the bundle's own no-literal source-scan pin), update/retire
sovereigntyBundleWr10.test.js:321/:388 per their headers, and DELETE the war
volume's §3 CR-WR10-B row as that row instructs. TR-5 and WF-6 land into the
post-discharge regime and MUST NOT expect the tripwire to still exist.
TREATY_COMPLIANCE_VOICE gains rows in BOTH tables, walkers same-commit; the
no-producer-less-term walker carries the seam-row exemption EXPLICITLY.

**#12 GR-4 — THE SUCCESSION QUESTION** (second slice of `oathHolderEnabled`).
Dark mode scores at the event; lit mode rides worldState.proposals
(actor-major shape) with terminal HONOR (declared divergence from
expire-to-DECLINE, pinned both ways); the repudiation credibility charge
writes through the MEASURED home (spatialLedgers.credibility, the
fractureCredibilityDeltas idiom) as a disclosed lit-path addition to WR-0c's
verb (both-paths + dark-negative pinned); silence-honors is the hardest pin;
treatyBreach factoring per J-GR-16. VERIFY-AT-BUILD: WR-5's landed
succession-event symbol.

**#13 GR-5 — RENEWAL, RENEGOTIATION, CONVERSION** (flag
`treatyRenewalEnabled`). `worstObservedEver` as the one-line MONOTONE fold at
the V-7 site (gated; dark = never written; read `?? 'honored'`); renewal
proposals ride pactProposals (trigger `renewal`); lineage acts execute
through pactAmendment.js (no new writer); GR-1 re-stamps at every act.
Hardest pin: refusal-of-renewal = clean lapse, no grievance invented.

**#14 GR-6 — MEDIATION GENERALIZED** (flag `mediationGeneralizedEnabled`).
Occasion 1 recompiled (J-GRC-3): `mediationPressure.js` — a dependency-free
leaf at the opener's soft gate, the embassyLedger deposit-and-consume idiom
mirrored (x1 exactly when dark/no-broker/no-intent = byte-identical); the
2-tick warIntents TTL DECLARED (the window IS one deliberation); "the war
that did not happen" receipt mints when a pressured intent expires unopened.
Occasions 2-3 per the volume (fraying read + worstObservedEver ?? 'honored';
temple arm through cohesionWeave). Never-forces is the hardest pin;
single-finder source-scan walker; accrueMediationTrust reused, never forked.

**#15 GR-7 — GRAMMAR MEASUREMENT + CERTIFICATION** (no flag). Extends
war-convergence-collector's OWN idiom with the treaty section: compliance
distributions, formation-vs-dictation THESIS METRIC, endings mix (closed
vocabulary, every producer named), term lifetimes on the 52-week clock,
stream grain moved, formation + mediation mixes with floors; certification
rows for all five GR flags (converting pendings); the out-of-order-lighting
red; GR-7 samples its OWN registry rows through couplingReceiptSample
(SC-9). Never a wizard_news.*-fed identity on a certification row. DONE =
envelopes hold on an owner-ordered soak.

### PHASE 3 — INFORMATION (SOL_QUEUE row 13; IN §4 + the ES owner-amendment
### family, docs/DESIGN_FP_ARCH_ES.md)

**#16 IN-0 — THE PRICES BECOME LAW** (four slices, four commits; rides
existing flags). **0a THE HANDOFF** (re-scoped by R1 — the fold is built; the
envelope dies in candidate metadata): carry the applied brokerage_plant
envelope to BOTH consumers via Q3's ruled transport (primary: each consumer
reads the PRIOR tick's applied events at its OWN head — zero keys, zero
kernel edits, law-M one-week lag; fallback: pendingPlants deposit; both fail:
STOP for a chair-signed kernel seam). `plant_took` DM-truth projection;
projectPlants' first non-test consumer with audience EXPLICIT at every call
site; the writer/reader pin boots rotation -> apply lane -> fold, no shortcut
fixture. **0b THE INTERCEPT CONSUMER:** the claim rides claimFrom (one
constructor — grep pin); refusal `no_record` from the UNTOUCHED five-token
QUERY_REFUSALS; HIDE's -0.7 rivals'-reads factor composes the vagueness band.
**0c THE DISCLOSURE EXECUTOR:** a NEW peaceTerms-family leaf
(peaceTermsDisclosure.js); the loser->victor feed behind peaceCausalActive x
allyIntelSharingEnabled — REACHABLE-LIT in the Full Simulation preset, so
goldens are captured against THAT preset BY NAME, FIRST; the signing credit
rides the pre-plumbed provenTrue param (zero statecraft-head surgery); expiry
lifts same tick. Rebases on GRAMMAR's landed peaceTerms leaves (order
guarantees it). **0d HIDE'S TRADE TAX:** `secrecyTradeFactor.js` — banded,
capped, identity-1.0 outside HIDE; dark = trade bytes identical (fence
first); the consuming join is TRADE's (pre-pinned, SC-IN-1).

**#17 IN-1 — THE MIRROR** (flag `secondOrderBeliefEnabled`). Pure
`secondOrderBelief.js` (no state, no writer, no RNG) deriving "what they
likely believe of us" from SEVEN outbound ledgered families — the seventh is
the WR-7b negotiation pictures we handed across a table (J-INA-5); allow-list
import fence; K3 exclusion of the counterpart's beliefMap unchanged;
EMPTY-RECORD = UNKNOWN at zero confidence (seeded non-empty sibling); THE
REVERSAL PIN; the phrase scan ("the record suggests", never "they believe");
mirrorOf's returned shape FROZEN with a shape pin (GRAMMAR consumes by that
pin — one reader shape, two programs).

**#18 IN-2 — THE LURE** (flag `infoLureEnabled`). The §4 axis model + the
TWO-CHANNEL RULING (J-INA-2) with its source-scan pin; ONE writer, ONE
axis-typed exposure law; the devotion bait on the LIVE faithLabel axis
(J-INA-3). COMPILED ORDER NOTE (J-FP-5): SP-B lands long before this wave, so
the scarcity/conditions baits' substrate blocker is GONE at build — the
implementer re-measures and either lands those baits here or as an immediate
IN-2b slice, recording which arm in the ledger row; the
axisFamiliesGrewSinceIn2 census is authored against the AT-BUILD family set
so the deferral (if any) cannot ghost. THE RESISTED LURE, the UNATTRACTIVE
BAIT, SPRING REACHABILITY under both restraint states, BLUFF-VS-BLUFF on the
expiry arm; blowback composes the mouthpiece plane where npcCredibility is
lit. Edit-verb: the DM LIE-COMMISSION verb lands here (store-action lane +
operationRegistry + gen:compendium-data; approval-routed).

**#19 IN-3 — THE COUNTER-GAME** (flag `counterIntelEnabled`). VET composes
the BUILT envoyTestimony ladder + sendTwoDivergence's vetting vocabulary;
SEND-TWO consumes sendTwoDivergence.js (the one-home contract — a source
scan proves no second implementation); suspicionOf derives from live
conditions/deception grievances/caught intercepts/mirror gap (degrades
dark); the house sub-program supplies projectPatronBindings' `exposed`
parameter at last; PLANT_REFUSALS grows six->SEVEN with `too_hot`
(QUERY_REFUSALS asserted unchanged); the witch-hunt counterforce with
no-fates wording; the Watch panel (sightPostures' first UI consumer, DM-only
fail-closed). Edit-verb: the SWEEP DM verb (same store-action discipline).

**WY-2 — THE DURABLE TRUTH** (flag `severityDurableRumorsEnabled`; WY §5;
slots in PHASE 3 IMMEDIATELY BEFORE ES-1 so the manipulation seam composes —
if the ES family is not present, WY-2 slots directly after #19 IN-3).
Charter: truth durability scales with SEVERITY per hop — the ONE-MULTIPLIER
amendment on the existing organic per-hop weathering, lit arm on the
keyed-hash01 closed table, dark arm VERBATIM. Big lies cost more by
corroboration; manipulated hops bypass the floor and are PRICED AT THE PLANT
SITE (the pricing pin lands ES-side and cites WY-2). Seam IN: the fork-key-set
census + the other-consumer stream golden (fork isolation IS the stream
guarantee — stream theft dies at birth).

**ES-0 — THE PURE LEAVES** (no flag; dark by construction; EARLY-ELIGIBLE is
a MEASURED FACT about this wave, NOT an authorization — it RUNS IN STRICT
ORDER: CR-FP-12 DECLINES to extend CQ2's early-motion set to ES-0, because
ES-0 edits two live WAR-LANE files (`warSeatBooks.js`, `warMagicGate.js`) and
its `lawWordFor` retarget is a cross-file war-lane VOCABULARY change with
golden-shift exposure — not the pure-density zero-collision profile CQ2's
four members share. ES-0 sits early in cycle 2 regardless, so nothing real is
lost; ES §4). Charter: `espionageDoctrine.js` — `lawWordFor` minted ONCE
and exported, `warSeatBooks.js` retiring its private `lawfulnessBand` to it
in the SAME commit (a ~6-line edit; coordinate with the war lane, note INT-1's
future claim on the file) + `readEspionageDoctrine`; `espionageMath.js` —
`operativeNotoriety01` (re-export with import-source pin), `covertCompetence01`,
`catchChance01`, `legStack`, `dwellRamp`, `TAP_LEVELS`/`MISSION_GRADES`
totality exports, the pure cores of `wariness01` and `promotionRiskOf`,
`deliberationRead`; `magicWorksAt.js` — the neutral lift of
`warMagicFunctions` with `warMagicGate.js` re-exporting (the R-BLD-5
precedent), its header NAMING the module-private twin `magicFunctionsAt` at
spatial/teleportEdges.js so a sweep never conflates them. Budgets: three
leaves <= 250 effective each; the warSeatBooks/warMagicGate edits <= 10 lines
each. Pins: the zero-import pin on the doctrine leaf (the sovereigntyAppraisal
geometry); two-tail `lawWordFor` reachability built from REAL
computeLawfulness output (hand-fed numbers refused); dwellRamp monotonicity +
all-bands-reachable. Dormancy: no flag, no caller — the WR-10 dark-instrument
precedent.

**ES-1 — THE MISSION** (⚠ **RIDES `espionageEnabled`; DOES NOT MINT IT** — see
the flag-attribution note below; needs #6 SP-D; ES §4). Charter: the covert arm in SP-D's
`errandMint.js` (mint validation: itinerary <= 3, closed products + demand
bands + the six-member legRefs set with pullBand refused, dispatch-refusal
seams, concurrency cap) + `normalizeErrand` taught the `covert` sub-record in
the SAME commit (the columnOf precedent) + the `covert_envoy` franchise
members in `routeNetworkConsumers.js` + the one-word kind fork at
`buildEnvoyRoutePlan`'s call site + covert casting (importance-inverse draw)
routed through the ONE vetting reader `vetVolunteerEnvoy` (sendTwoDivergence.js
— neither program forks a second vetting derivation).

**ES-2 — THE GAUNTLET** (second slice of `espionageEnabled`; needs ES-1;
consumes CR-ES-2 and CR-ES-3; ES §4). Charter: the stay-detection stage —
`espionageGauntlet.js` mounted INSIDE the errand advance (the covert stage
composes into `advanceEnvoyErrands`' existing per-tick walk, one transition
per row per pulse, read-back-before-adopt, the WR-7 stage discipline; NEVER a
pulseKernel/applyWorldPulse edit — L1) rolling at hostile stops; capture ->
`openForeignGuestHold` cause `caught_spying` (vocabulary member + the cause's
news arm) through the ONE hold writer. THE ENCOUNTER-TABLE ROW LANDS IN THIS
WAVE'S COMMIT (CR-ES-6): mounting the gauntlet adds row E15 — spy-dwell
detection, covert operative x host settlement watch — to the WY volume's §4
closed encounter-pairs table, which WY-6 (a phase later) then VERIFIES at
fifteen rather than re-closing at fourteen. The encounter-resolver REGISTRY is
ONE (that table); the catch MATH stays in ES §3.3. THE ANONYMITY AMENDMENT
(CR-ES-2)
lands at the law's LIVE HOMES BEFORE this wave builds — the
informationStatecraft.js BOUNDARY header block AND DESIGN_FP_INFORMATION.md
§1b (the law and its phrase-scan enforcer amend together); the war volume
gets exactly ONE cross-reference line beside the WR-7 hostage machinery,
never the amendment text. Until CR-ES-3's vocabulary unification lands, the
captor-leniency arm ships DARK behind the ruling's absence, DECLARED — not
silent.

**ES-3 — THE PRODUCTS + THE GRADIENT** (third slice; needs #3 SP-B for the
full arm, ships the degraded arm regardless; ES §4). Charter:
`espionageProducts.js` — the three synthetic-report builders (completeness
floored, sourceId = agent nid) + THE TAP LADDER (`tapLevelFor(stop, face,
asset)`, the performance-poisoning term over the imported `lieWillingness`,
the tap-composed accuracy caps, tap recorded on every gathered entry) + the
gradient accrual writer (`covert.gathered` through the errand writer's
transaction). J-INA-2 EXTENDED and scan-pinned: products ride the report
road, plants ride the plant roads, the two NEVER share a writer.

**ES-4 — THE JOINT-LEGS DISCHARGE** (rides SP-B/SP-B2's flags; the lighting
wave; ES §4). **THE THIRD MEMBER OF THE CR-WR10-H DISCHARGE** (see #4 SP-B2
and §3's lighting contract). Charter: ACQUIRE/CONFIRM/REFUTE wired to SP-B's
`conditionsBands` spellings (closed-vocabulary seam pin, both sides); the
fed-by-espionage companion fixture beside SP-B2's lit-with-legs contract
fixture — a non-neighbor (court, holding) pair goes `unknown -> known` through
a completed mission and `appraiseSettlementAsset` prices it end to end; THE
NON-NEIGHBOR DIFFERENTIAL pin — rumor-range-only feeding leaves the far pair
`known:false`, the mission fills it. The certification lighting-order row was
MINTED AT SP-B2 (2026-08-05) citing SP-B + SP-B2 + ES-4 —
`SOVEREIGNTY_LIGHTING_EVIDENCE` in
src/domain/certification/warConvergenceContract.js — so ES-4 SATISFIES it
rather than minting it: carry the marker `ES-4-DISTANT-SOURCE-EVIDENCE` in the
TITLE of the non-neighbour pin and the condition flips to SATISFIED. **"TITLE"
IS NARROWER THAN IT READS SINCE THE CAP (`d48224e3`), AND THIS VOLUME STATES
THE NARROWING SO IT DOES NOT DISAGREE WITH ITS OWN CHILDREN:** the pin lives in
`tests/domain/espionageDistantSourceEs4.test.js` — the walker's declared
evidence address — and the marker stands in an `it`/`test` title, never a
`describe` title. The full recipe is maintained in the walker header of
`tests/lint/sovereigntyLightingContract.walker.test.js` (clauses (0) and (0b)
and what follows) and is pointed at from here rather than copied.

**ES-5 — DOCTRINE ENGAGED + THE ABSENCE AMENDMENT** (fourth slice; the
absence arm rides CR-ES-1, SIGNED; ES §4). Charter: the doctrine STAGE
(`espionageDoctrineStage.js` — gathers words off worldState/snapshot, returns
null when dark; the conquestDoctrineStage split) + the autonomous dispatch
cadence (doctrine frequency01 x the deliberation read x candidate
availability — the court decides to spy, keyed-hash, receipted in doctrine
words, setting the mission DEMAND) + `wariness01` wired into the gauntlet +
the IN-3 `suspicionOf` handshake (ONE derivation; ES consumes it lit, derives
minimally dark). THE ROADS LAW-5 AMENDMENT (CR-ES-1): a flag-gated GRADED
COUNCIL-WEIGHT DISCOUNT via the `memberNpcIds` first consumer; `isOffStage`
UNTOUCHED; dark worlds byte-identical; the lit shift disclosed. The literal
full-off-stage reading is REFUSED as implementation.

**ES-6 — THE DOUBLE AGENT** (fifth slice; degraded-dark when the corruption
web is dark; ES §4). Charter: the leash read at dispatch (deterministic,
keyed on the minted errand id) + the leak delivery (magic two-address sends;
mundane reach-priced) + meta-intelligence writes + THE SILENT-SUCCESS
DISCIPLINE (no news, no home state — the negative is the hardest pin) +
vetting quality from home security x own-web health + the retroactive Herald
clause on web exposure. ES never writes web state; conversion of ES captives
rides the web's existing returned-captive road.

**#20 IN-4 — THE ROAD** (flag `reputationRaceEnabled`). The race's degraded
arm builds NOW (arrivals the existing ledgers stage — armies, exiles,
refugee columns, envoy returns); RACE_OUTCOMES tokens verbatim; THE TRUTH
THAT ARRIVED TOO LATE is the jewel pin; the D-3 deposit-courier retirement
flag-gated intelTradeEnabled x errandSpineEnabled — SP-D landed, so the
lit-arm errand contract (typed covert/commercial errand, K.2 decaying
snapshot as cargo) is BUILDABLE and the retirement pin reads SP-D's flag by
name; J-INA-4 lands in commit 1 (intelTradeEnabled joins the manifest + row
— its real gate reads are the membership test). NOTHING touches the chooser
(settlementStrategy at its 812 baseline). Cross-pins point at the BUILT
envoyInterceptionStage.

**#21 IN-5 — THE VOICE** (no engine state). The SEVENTH Herald section
(knowledge desk): section token + correspondence rows + walker updates +
EVERY HERALD_SECTIONS consumer audited by executed census; the
belief_misjudgment REFILE with non-omniscient-infoMode goldens captured
FIRST (Full Simulation preset named) and the registry row's intendedDesk
moved in the SAME commit (CW's desk walker stays green through the flip —
SC-2); intel_transfer STAYS under trade; the arc composer (pure — save/load
mid-arc recomposes identically); the inaction receipt court_sat_still with
its low-confidence negative; the significance ceiling raised to 'major' for
exactly three banded shapes.

**ES-7 — THE VOICE + THE MEASURE** (final `espionageEnabled` slice; slots
AFTER #21 IN-5 because it routes to the knowledge desk that wave mints;
converts the certification pending; ES §4). Charter: the six Herald kinds
with the L6 FIVE JOINS each in their mint commit (annex-verbatim pool rows ·
registry row with requiredSlots + slotless fallback · WHAT_PHRASES · section
authority — knowledge desk for confirmations/refutes, the war/politics desks
for captures/betrayals per heraldRouting's EXACT_SECTION · the full address
chain with typed action + recorded reasons + audience); its OWN walker file;
the TAP REGISTER; significance classes drawn from SP-A's family (covert beats
the `routine` class so quiet departures never clear
`passesSignificanceGate`). dm-only covert is fail-closed UPSTREAM. Every ES
kind is `espionage_*`-prefixed and receipt-addressed so the REAL-mission
story is distinguishable from the LIVE ambient `cold_war_espionage` drift,
which stays UNTOUCHED (a diff in its tests is a tripwire). The no-fates
phrase scan runs at its DESIGN_FP_INFORMATION.md §1b home over these strings
— the CR-ES-2 amendment's BY-THE-ENGINE qualifier is what makes them lawful.

**#22 IN-6 — THE MEASURE** (no flag). Decontamination ratchet baselines
re-measured at build; the earned-classification walker (bare `news` token
REMOVED from BEHAVIORAL_MOVER_FAMILIES.knowledge — classification earned by
registered own-vocabulary tokens); the display-safe banded truth provider
completing BeliefDivergenceBand; the lit/dark differential instrument the
certification row asks for by name; every envelope mechanically
cross-checked against every Endings entry, each with a tuning-constant
mutant. Certification rows for all four IN flags name their dispositive
literals.

### PHASE 4 — TRADE (SOL_QUEUE row 14; TR §4)

**#23 TR-1 — THE CASUS COMMERCII** (flag `casusCommerciiEnabled`;
EARLY-ELIGIBLE). commercialReasonTaxonomy (8 severance/partnership pairs,
REASON_MIRRORS-shaped — the war taxonomy is the SHAPE template, never shared
code) + commercialReasons writer (8 scorers + amendment-B suppression) + news
leaf + own walker (totality/bijection/suppression-receipt). THE ONE T9 SEAM
EDIT: tradeWar's escalation deposit gains a severance-magnitude read, gated
by name, dark byte-identical. Healthy-partnership-mints-nothing on generated
corpora; famine_profiteering suppressed against physically-empty stocks with
the receipt naming the stock read.

**#24 TR-2 — THE HOUSE** (flag `merchantHousesEnabled`). houseLedger
(formation/ruin-latch/rename + load-time normalizer — the dormant-with-books
shape round-trips from old saves) + houseActs (threshold chooser over the
closed verb set, import-pinned: no relationship graph, no target lists) +
deterministic factor casting + news. Eligibility ONLY via factionArchetype()
(the name-regex fallback makes rename-sensitivity real — the rename
round-trip pin is mandatory). Ruin reachable from the top band; formation
determinism (codepoint decides, same-seed identical); no-undead-house
cooldown.

**#25 TR-3 — BELIEVED MARKETS** (flag `believedMarketsEnabled`; needs SP-B).
beliefScarcity.js consumes SP-B's scarcity family as a SIBLING leaf
(beliefMap net-zero — J-FP-4); dispatchDestination.js is the whitelisted
WHERE composer (believed dearness belief-side, needPremium truth-side, NO
combining expression — the no-merge token scan with a seeded
deliberate-average control); dispatchEV gains the destination-consumer seam.
Staleness reachable (>= two bands, receipted); T-1 tellable (came for the
famine, found the harvest).

**WY-3 — THE MOVER BODIES** (flag `caravanBodiesEnabled`; owner sign-off rows
required before the fields mint; WY §5; slots in PHASE 4 IMMEDIATELY BEFORE
#26 TR-4 so grain inherits the caravan body). Charter: shipment
departTick+path stamps, the mission leg clock, the quantization cadence; the
commodityStocks/supplyShipments serialize->regen->undo->import round-trip pin
LANDS HERE (TR-4 verifies and extends it, never re-lands it); the
flowRegimeContract PRE-PINS TR-4's T7 rows — and TR-4's T7 row is ROUTED
CENSUS-SHAPED: "T7 fences the grep-derived `importDependency` consumer census
of the food ledger, shrink-only" (members at HEAD include foodCapacityOf and
substitutedImportDependency; the tierResourceDynamics same-name local excluded
by symbol-home) — NEVER a count-of-N row. Q5 ruled: the caravan map layer
ships on this wave against the M6a NON-FOOD shipments with an HONEST LEGEND;
grain caravans join AUTOMATICALLY when TR-4 lights, because the layer binds to
the LEDGER, not the flag. Collision: commodityFlow edits are SERIAL with the
TR lanes — CHECK-GIT-FIRST.

**#26 TR-4 — THE GRAIN ROAD** (flag `foodCaravansEnabled`; two slices;
EARLY-ELIGIBLE). Slice 1: grainFlow (one truth source, two denominations) +
grainArrivalCredit (units->months via ONE authored constant, credited
through applyFoodDeltasToUpdates; the equal-and-opposite lit-only offset
nets the generation stash's import share — GENERATION IS SACRED, the stash
is never rewritten); grain enters commodityFlow's conservation for free; THE
T7 WALKER LANDS HERE (exactly one of {netted rate share, physical arrivals}
live per settlement per tick, BOTH flag states, forever) + the five-site
storageMonths shrink-only census with an executed sixth-writer plant; the
calm-equivalence band (the disclosed, bounded lit-path shift); the three
bypass counterforces EACH executed (teleport 0.3 / airshipBesieged 0.15 /
underways). Slice 1 also LANDS the commodityStocks/supplyShipments
serialize->regen->undo->import round-trip pin (measured absent — do not
inherit) — LANDED AT WY-3, ordered immediately before; TR-4 VERIFIES and
extends it to the grain rows, never re-lands it. Slice 2: treaty streams ride
caravans (the lit fork in
treatyTransfer; robbery -> I2 reparations claim with the creditor's-picture
fork). The applyWorldPulse:92-110 second fold is handled per Q9's pre-ruling
(REPORTED-NOT-DEFECT; the queue row filed; the sixth-writer scan fences it).

**WY-6 — THE PRIZE ARM + THE PAIRS TABLE** (flag `caravanSeizureEnabled`;
owner sign-off row F8; WY §5; slots AFTER #26 TR-4). Charter: the army x
caravan prize arm and the CLOSED encounter-pairs table — the map SHOWS
encounters, it never CREATES them. THE TABLE IS CLOSED AT FIFTEEN, NOT
FOURTEEN (CR-ES-6, folded 2026-08-05): ES-2 admits row E15 (spy-dwell
detection) in its own commit a phase earlier, so this wave's walker is BORN
SEEING FIFTEEN and VERIFIES it — a walker written to re-close at fourteen
would red a resolver the estate consciously admitted. Prize credit moves real
stores exclusively
through commodityFlow's ONE stock-write seam (the same door F9's supply uses;
a store write outside that seam reds the stock-write source scan).

**#27 TR-5 — THE PACT LANE** (flag `tradePactsEnabled`; needs GR-2/GR-3).
commercialTermExecutors (five executors as lazy peaceTerms-family siblings)
+ tradeDemandTrigger (believed-dear x salient good x realmPressure01 hunger
arm x posture — the DEAD CONSUMER of realmPressure01 finally lands);
peaceTermsCatalog gains NOTHING new here if GR-3 minted the five commercial
rows as seams — TR-5 lands the executors + producers and the
TERM_CATALOG membership pin (each of the five spellings appears EXACTLY ONCE
with its GRAMMAR spelling — red on drift from either side). COMPILED DELTA
(J-FP-1): the catalogGrewSinceWr10 discharge was EXECUTED at GR-3 — TR-5
VERIFIES the discharge (pins retired, bundle widened) and does NOT re-run
it; the CR-WR10-B twin-degradation-sentence law still binds (byte-equal
across volumes, no second sentence ever). T-5 tellable end-to-end (pact ->
delivery -> pressure falls -> war-motive weight falls; five subsystems,
receipts at every link) + the same fixture dark byte-identical; the K3
absurdity twin (signed for grain the seller no longer has).

**#28 TR-6 — THE CORNER + FAMINE SPECULATOR** (flag `corneringEnabled`).
cornerGate (INDEPENDENT truth-side census — the denominator never from the
house's own interests; the self-referential-pin class executed as a mutant)
+ cornerComposer (whitelisted: belief motive, truth gate, two outputs) +
warehouseSeizure (NEW conserved machinery, one writer in the commodityFlow
family — the census admits it same commit; serves the riot counterforce AND
the seat's forced sale) + monopolyDwell + news. ALIGNMENT NEVER GATES (good
house corners and pays conscience+credibility+commons; evil pays less
morally, equally physically); EACH of the five counterforces WINS on its own
fixture; moral pricing READS spatial/moralDrift.js (path resolved — nothing
rebuilt).

**#29 TR-7 — VENTURES** (flag `venturesEnabled`). ventureLedger (the plan
grammar re-implemented at house grain — demographicsPlans.js UNTOUCHED per
its own fence) + ventureLegs (M6a/M8 dispatch binding — the road prices
duration) + news. Stake genuinely at risk; one-active-venture cap;
crossing-not-drift trigger; the Bardi arc tellable (fortune -> failed
venture -> ruin, receipts each step); seatBooks venture-appetite term
ABSENT-not-zero until INT-1 (the absence-then-presence pin pair lands here).

**#30 TR-8 — THE TRAVELING FACTOR** (flag `factorErrandsEnabled`; two
slices; needs SP-D + TR-5 + TR-7). Slice 1: commercialErrands on SP-D's
purpose `commercial` (pact proposal/renewal — the TR-5 call-site suppression
switch; venture supercargo; fair circuit with ARRIVAL-grade belief writes;
K.2 snapshot decays, never truth-refreshed). Slice 2: the compromised factor
(declared vs true purpose on the covert seam) + capture into
foreignGuestHold through ITS one writer (import pin proves no second) +
ransom on the I2 person-subject claim. The speed-floor walker extends to
commercial errands.

**#31 TR-9 — TRADE CONVERGENCE INSTRUMENTATION** (no flag; contract module
EARLY-ELIGIBLE). tradeConvergenceContract (TRADE_ENDING_KEYS {fortune, ruin,
monopoly, collapse, severance, cornered} CLOSED; `collapse` reports an
HONEST PERMANENT ZERO while routeLifecycleEnabled is dark); THE HERALD DEBT
PAID: WHAT_PHRASES + heraldRouting rows for the five route_* kinds + a
totality pin — the 17-module route estate speaks at last; certification rows
for all eight TR flags (converting pendings); the kind-availability walker
(a flag lit out of order is an invalid config); TR-9 samples its own
registry rows (SC-9); tickScanBudget lanes; house-Gini + corner + pact-mix +
endings-share envelopes, every window INTERVAL_WEEKS-derived, every envelope
with an executed mutant.

**WY-11 — THE LIFEBLOOD ENVELOPE** (flag `caravanFloorEnabled` + a
certification instrument; WY §5; slots AFTER #31 TR-9). Charter: the
per-region subsistence circulation floor — EV-side only, never a second
stock-write path — with its envelope window INTERVAL_WEEKS-derived and an
executed mutant, in the TR-9 convergence idiom.

### PHASE 5 — FAITH (program 5; WF §4)

**#32 WF-0 — THE OBSERVATION FLOOR** (no flag). The bearer-count invariant
on the two faith certification rows; the v5 `deityBearers` receipt field;
ONE authored deity-bearing soak case beside the whole-world grid (spatial
canon + two opposed-quadrant deities + a qualifying grand observance +
mapped reachable neighbour — pilgrimage.js's own bar). Bearer field correct
on the bearing fixture AND zero on the deity-free corpus (both arms). Every
WF fixture hereafter is deity-bearing through SET_PRIMARY_DEITY/IMPOSE_CULT
(mutateEntities.js:820/:864), never config poking.

**#33 WF-1 — THE UNSEATING** (flag `faithUnseatingEnabled`). patronFall.js
(classification + ring writer; five closed causes); suppressedAtTick stamped
by the two existing suppression transitions when lit; the >=4-suppressed
obituary with narrative (longest-dormant) selection lit / codepoint dark
(flag-forked, dormancy-covered); the realm last-seat beat; THE
DISSOLUTION-NAMES-THE-FALL two-flag fixture (warTerminationEnabled +
faithUnseatingEnabled — war's sacredAnchors join surface is live);
anchor_unavailable gets NO invented cause; warTermination.js is FROZEN 818 —
the join lands as a pure read at NET-ZERO effective lines or the wave STOPS
and proposes the extraction. THE DS-FTH DOC PIN lands here (Q-resolved:
binding — the corpus and the model already agree; divergence is a STOP).

**#34 WF-2 — PILGRIMS + LEGATES** (flag `pilgrimageEnabled`; two slices).
2a THE SEASON: co-location gate (genuinely new — no faith-site linkage
exists); the pull's belief leg reads SP-B's devotion family through an
injectable composition seam (landed by order — the observanceLabel substrate
is the declared dark arm); the three-way split negative (no-observance /
aspatial / unmapped) each its own seeded arm; the subsumption-seam
disclosure pin (lit vs dark observance-success delta measured on one seed).
2b THE MOVERS: legates/pilgrims mint through SP-D's writer with purpose
`religious` (the red-until-built existence probe from the WF side is GREEN
by order — war's closed ENVOY_PURPOSES was never widened); interception
rides WR-7b's foreignGuestHold; envoyDiplomacyEnabled dark = the declared
harassment/turn-back degraded arm. Never-resolve absolute (no named fate).

**#35 WF-3 — STANCE CONSEQUENCES** (flag `faithStanceConsequencesEnabled`).
stanceConsequences.js leaf (the lane file's betrayal machinery untouched);
aggression as threshold colour never selector (E3); durability -> the pact
fraying clock (GR-2's substrate landed by order; the SP-3 hook now binds
against real pacts); over-extension fraying is the counterforce; REVERSAL
both directions on one fixture; COLOUR-NEVER-DROWN cap; the G1c fence
captured FIRST.

**#36 WF-4 — OMEN READS** (flag `omenReadsEnabled`). omenReading.js — ONE
writer for spatialLedgers.omenReadings; five kinds, five opposable arms ON
THE SAME ROW; the lens reads patron temper x quadrant; NO-PHYSICS byte-diff
over physical ledgers with the import pin excluding every physical-state
writer (K3 pointed inward); failed-prophecy arm seeded once per kind;
two-towns-one-famine tellable; readings -> faith desk, open expectation ->
divination (the structural doctrine honored).

**#37 WF-5 — SCHISM + UNDERGROUND** (flag `faithSchismEnabled`; two
slices). The covert congregation (growth 520w / assimilation 156w,
INTERVAL_WEEKS-derived from the canonical leaf — never a fourth local copy);
creedRef minted only by the split's reduced-ceremony founding
(VERIFY-AT-BUILD the call surface); the creed-aware backing fork (the
ANTI-ENTRENCHMENT pin: the winner's backing does not rise vs pre-split);
never-prune-the-cellar (covert>0 unprunable); PREMIUM-ISOLATION hardest
(covert receipts absent from every non-includeCovert projection, all four
audience renders audited); exposure the faith-side covert/revealed read
(clandestineFacet stays criminal-only); backfire wins on a weak seat.

**#38 WF-6 — FAITH TERMS** (flag `faithTermsEnabled`; needs GR-2/GR-3).
Executors in NEW leaf siblings consuming peaceTerms exports (the head gains
net-zero seam lines only); the sacredClaim both-patrons guard imported
verbatim as the formation gate; missionary_access moves the CHANNEL never
share (executor honesty); sizing pins DERIVE from live TERM_FAMILIES (never
hand-count); the bundle-composition fixture proves a faith term composes in
the sovereignty bundle (Q-resolved COMPOSE — the derived-families mechanism;
one added herald sentence for the faith-consideration sale); dictated +
negotiated arms both reachable; pilgrimage_right cannot form with
pilgrimageEnabled dark (refusal receipted, no dead guarantee certified).

**#39 WF-7 — THE TITHE** (flag `titheEnabled`). tithe.js (draw + wealth fold
+ disposition; quarterly = 13 weeks off intervalWeeks.js — the 12-tick trap
is cured law, the pin names 13); templeWealth banded stock through the one
writer (coffers-at-the-fall: inherit named / dispersal conserved); THE
SPLENDOR CAP (gold gilds, never buys — rides INSIDE W_INSTITUTION's existing
slot, never a new additive); the sack-loot weight is a read the SACK
arithmetic consumes with conservation pinned (war-family territory — STOP if
warDeployment headroom is gone at build); resentment arm WINS measurably;
secular/temple-less negative non-vacuous.

**#40 WF-8 — NARRATION 3x** (flag `faithNarrationEnabled`; lights LAST in
WF). ~20 WHAT_PHRASES kinds + routing rows; FIVE realm arcs (Schism + Great
Pilgrimage + Persecution + Awakening + Reformation — all new work; the arcs
land in realmFaithArcs.js if realmEvents nears ceiling), each with a
seeded-cluster reachability pin and a WF-9 envelope; the Reformation
detector reads WF-1's patronFalls rings (window 260w / >=3 settlements / one
cause token); the >=3x census re-baselines against the LIVE phrased-token
count at the landing commit; the WF-8 census counts war-minted faith-desk
kinds (sovereignty_sale_judged) ONCE, never twice; the flood fixture holds
under the pacing caps (SP-A's classes registered).

**#41 WF-9 — FAITH CONVERGENCE INSTRUMENTATION** (no flag). The WF-0 case
grown to a grid; the eight-token endings walker (faith_converted qualified);
instrument-arc vocabularies OUTSIDE the mix with roads_closed + plundered
floors; tenure tail; per-mechanism envelopes incl. the subsumption-seam
delta; the NINE-row counterforce audit + sack lure; the invalid-config
walker (SPREAD flag lit while faithSpreadEnabled dark = red); certification
rows grown from WF-0 shells and rendered from a fixture. DONE = envelopes
hold on the owner-ordered soak.

### PHASE 6 — POPULATIONS (program 6; POP §4)

**#42 POP-1 — THE BELIEVED ROAD** (flag `believedMigrationEnabled`; needs
SP-B + migrationRumorsEnabled). believedMigrationRead.js (ONLY the
attraction axes resolve belief-side lit; admission/spare/capacity/viability
stay truth BOTH arms — the over-send guard untouched); THE ARRIVAL CLEARING
(capacity re-read at the wall, `refused_at_the_wall`, return column class
`'returning'` — the closed set extended per RF-2/Q-resolved, with the
executed wrong-lane mutant proving M4 no longer steals it); disappointment =
frozen believedBand vs lived reading, gap >= band = the letter home
(news-speed correction); columnOf carry-through for BOTH new fields
same-commit, pinned THROUGH-ENQUEUE (RF-1); THE OMNISCIENCE COLLAPSE
(omniscient infoMode = lit byte-identical to dark); THE GOLD RUSH pin (plant
-> column -> wall -> letter -> flow stops, no clamp); conservation
re-executed at 300 ticks over both new arms. The homeward column's
migration_flight rumor face is ACCEPTED for v1 and recorded in this wave's
ledger row (POP Q3 resolved).

**WY-4 — THE POPULATION CARGO + THE FENCE** (flags
`flowMigrationPhysicalEnabled` + `migrationCargoEnabled`; owner sign-off rows
F4/F5; WY §5; slots in PHASE 6 IMMEDIATELY AFTER #42 POP-1 — the shared
columnOf amendments compose BY ORDER, POP-1 first). Charter: the
flow_migration EXACTLY-ONE fence (columns, not teleports, under the spatial
canon), covering BOTH apply arms (auto + proposal-accept); faith cargo +
launching receipt on migration columns, the credit writing ONLY through
religionState's own writer family (single-writer law; occupationFaithPull is
the shape precedent). Q1 ruled BLEND: the column carries the banded
composition and arrival pulls the destination mix by
arrivals/(destPop+arrivals), renormed; the popup says "faiths carried", never
"faith conserved". The producer overlap with M4's own crisis lane is MEASURED
at build and fenced by attribution + dedup precedence (the fence yields to a
same-tick M4 dispatch). Pins: THROUGH-ENQUEUE; the proposal-accept pin; the
double-send mutant against the dedup pin; the wrong-lane mutant — a columnOf
edit that drops either program's fields reds BOTH programs' pins.

**WY-5 — THE CARRIED WORD** (flag `moversCarryNewsEnabled`; WY §5; slots
AFTER WY-4). Charter: arrival fidelity injections and the going-dark read —
movers carry news, and the tap-order law here is the MOVER instance of the
espionage volume's owner-addition H ruling. The going-dark Herald kind lands
with the L6 five joins and IN-5's desk routing honored; the fork-key-set
census + the other-consumer stream golden guard the stream.

**#43 POP-2 — THE COMMONS ARC** (flag `commonsArcEnabled`). The REFUSAL rung
+ jump rule (lit-no-target time-to-riot equals dark tick-for-tick);
LEGIT_DIP to five slots; refusal fields through the one kernel writer;
commonsAnswer.js (THE MISRULE ANSWER — receipted seat verb + legitimacy
repair + stressor stand-down); plan/levy/emigration refusal pricing
(`refused_by_the_commons` joins the closed vocabulary); REFUSED-LEVY
end-to-end lands a SMALLER REAL MUSTER upstream of WR-4's conscript-share
read, never a parallel multiplier (the double-count fence is the
levy/consent fixture); the revealed-only pin (covert corruption moves
nothing until exposed); reversal on BOTH answering arms.

**#44 POP-3 — DEPARTURE MEMORY** (flag `departureMemoryEnabled`).
departureMemory.js (ONE writer + decay + spent-tie; banded memory, never
accounting); fed at the P2 landing, M4 arrivals, orbit dispersal (razing
escape share dark until WR-8 lights); THE GENERATION-THAT-LEFT fixture both
ends; kin-pull capped (never outweighs crisis push); THE SPENT-TIE pin (the
loop converges through the counterforce); adoption double-count negative
(traditions checkpoints identical lit vs dark); freeze-at-death +
reopen-at-resettlement; the read API pinned band-words-only (the
diaspora-reconquest coupling consumes a stable surface).

**#45 POP-4 — THE PLAGUE ARC** (flag `calamityArcEnabled`). calamityArc.js
(staging + prune + attribution); ZERO-NEW-MORTALITY is the defining pin (lit
vs dark identical death totals); THE BELLS pin (plague year sans famine =
sickness line, not hunger — the food gate preserved); attribution covers
KERNEL deaths only while the decline double-shed stays open (the substrate
gate re-measured STILL OPEN — STOP if the queue ruling landed saying
otherwise); stage monotonicity, no zombie arcs; the 193-year zero-fire
counterforce fact carried to the owner's tuning table UN-retuned.

**#46 POP-5a — ROAD DRAMA** (flag `roadDramaEnabled`). columnEvents.js
(typed banded events on per-column keyed forks `column:<id>` — the ONE
declared rng surface, draw-accounted); the lost-column inference both arms
(M4 graves line; P2 inference then honest resolution); THE RE-ROUTE pin as a
route-CHOICE assertion with populationLegCost output byte-identical (belief
re-ranks, physics does not); conservation extended-unweakened (split sums
exact); `tolled` ships dormant unless a J4 charter toll read exists
(VERIFY-AT-BUILD; a source scan asserts POP prices no toll number of its
own); columnOf carry-through for `events` same-commit (RF-1).

**#47 POP-5b — THE PERMIT TABLE GOES LIVE** (flag `moverPermitsEnabled`).
The four calling surfaces gain moverPermitted reads (levy muster ·
institution seeding · trade/caravan assignment — or declared into TRADE's
seam, report never duplicate · promotion beside no_next_tier/no_headroom);
the J-POP-11 reconciliation at destinationMenuFor (the wired nonviable
refusal narrows to the grades the TABLE refuses — recovery in-migration
proven); the treaty-input reads (settlement_provision at the founding mint;
migration_right depth step) — GR-3's rows landed by order, so the
reachability pins are REQUIRED from birth (the degraded-declared arm is
history; both states recorded in the commit); the levy/consent double-bind
fixture (grade-refused AND commons-refused, one muster receipt, two named
reasons); INT-1 caller-posture coupling declared dark behind both flags
(CPL-18 row lands here, reachability pin written INTERIOR-side).

**#48 POP-6 — THE HOPEFUL HALF** (rides its machinery's flags).
populationLines.js (the mint list) + populationEditor.js (the per-tick
per-settlement significance budget over SP-A's classes, wrapping the kernel
RETURN — the kernel's mint site keeps its line); WHAT_PHRASES rows for the
eleven fallback kinds (authored prose, world-law-bound); the R-28 repair
(the departures=0 "left" headline — confirmed still open); prose for LIVE
kinds lands WR-0c-style (own commit, disclosed same-seed prose shift,
goldens re-recorded only under a recorded ruling — J-POP-12); THE FLOOD pin
+ quiet-world-single-line negative; honesty pins on every headline verb.

**#49 POP-7 — POPULATIONS CONVERGENCE INSTRUMENTATION** (no flag). Endings
envelopes over the seventeen producer-mapped tokens; rush:bust band;
no-permanent-rush horizon; rung pyramid; THE PARITY METRIC; memory-decay
stationarity; conservation UNCHANGED with every flag lit; certification rows
for all six POP flags with dispositive stateKeys channels (the v5 census
sees new ledger keys for free); POP-7 ALSO lands the `commonsVoiceEnabled`
certification row and shrinks the walker BACKLOG by one (Q-resolved; no-op
if the register lane landed it first — check-first); POP-7 samples its own
registry rows (SC-9).

### PHASE 7 — INTERIOR (program 7; INT §4)

**#50 INT-1 — THE BOOKS GENERALIZED** (flag `seatBooksEnabled`).
warSeatBooks.js IS the volume's seatBooks.js (J-INT naming ruling — no
rename, no facade; non-war consumers import readWarSeatBooks directly);
INT-1 = the generalized consumer seam + the change-gated books-standing
receipt (same weights two pulses = ONE receipt; deadband oscillation = zero)
+ the dossier line + the ONE-EVALUATOR census (comment-stripped source scan,
executed third-evaluator plant). sovereigntyIntent.js is counted as a LIVE
consumer from day one. The cycle-absence import pin (no postureOf import
into the books family) lands as a LIVE constraint — SP-C landed first, and
lighting seatBooksEnabled is SP-C's pre-declared disclosed posture shift.
The receipt lane mounts at warTermination's existing lane war-side (FROZEN
818 — no growth) and the lifecycle host non-war.

**#51 INT-2 — THE POSITIONS WIRED** (completes `settlementPoliticsEnabled`,
which EXISTS dark). blocCounsel.js + blocCounselNews.js leaves
(settlementPolitics.js is near ceiling — MEASURE FIRST; the composer never
lands in it); the quiet_local PRESET NEGATIVE pinned (factionCompetition
false there — zero blocs, zero counsel, while re-read/demand arms still
function); the CLAMP negative property-shaped (no composition zeroes or
forces a verb); override handoff = EXACTLY-ONE factionPair entry (minted
here, consumed by INT-3 — build order resolves the shared mint site);
per-verb loading tables grow ONLY as each program's verbs land (the
vocabulary never leads the events).

**#52 INT-3 — THE INTERIOR VETO COMPLETES** (flag `interiorVetoEnabled`; two
commits). 3a: SIBLING incident types (pact/severance/stance/sale/burial
`_decision`) via decisionPolitics.js beside the untouched war module; THE
JOIN RECEIPT (the still-absent core deliverable — a verdict landing in a
settlement holding a live decision incident NAMES the decision; the JOIN
NEGATIVE is hardest: pure legitimacy collapse names none); the `decision`
pressureKind through existing clamps (applyWorldPulse FROZEN — the stressor
lane's existing composition, never a kernel edit); the pact re-read triggers
GR-2's writer (landed by order — the dormant-writer-call arm retires);
memoryWeave-composition pin (weave dark = exactly as dark as WR-5's lane).
3b THE EMIGRE: UNBLOCKED by SP-D (the compiled order dissolves INT Q1's
HOLD) — the emigre errand rides purpose `factional`/`personal` through the
one writer.

**#53 INT-4 — THE NARRATED MIDDLE** (flag `strainAttributionEnabled`).
strainAttribution.js (co-presence read over live state at the pressure
crossing; closed burden vocab {tribute_strain, war_exhaustion, famine,
occupation, corruption}; banded words only); the commons tribute term feeds
the EXISTING composite through the existing writer (fence golden FIRST —
commonsVoiceKernel is live-lit), resolving each treaty's OWN cadence marker
(52-week current / legacy 12 — never re-price); the rally receipt's margin
read; CO-PRESENCE negative + positive control; DOUBLE-COUNT guard
(attribution adds WORDS never weight); runtime no-decimal pin on composed
output. Sanctioned parallelism: INT-4 and INT-5 may run as parallel lanes by
path.

**#54 INT-5 — THE MEMORY SEAM + THE FOUNDING WOUND** (flag
`memoryHorizonSeamEnabled`). relationshipMemory threads
{halfLifeTicks, maxLookbackTicks} x memoryHorizonMultiplierOf (LIVE lit-path
module — fence golden FIRST); the hard-zero lookback opens under long bands:
THE FORTY-YEAR pin EXECUTED on a real corpus under an undying band;
BOTH-SIGNS x BOTH-CONSTANTS anti-ratchet (bright rows lengthen exactly as
wounds); originHolderId stamped ONCE at first succession, immutable
(chain-immutability pinned); foundingWound.js reads. The seam SCALES
CONSTANTS ONLY (the existing Math.pow is pre-existing; no new
transcendental).

**#55 INT-6 — DELIBERATE FORGIVENESS** (flag `deliberateForgivenessEnabled`;
two slices). Slice 1: woundFamilyOf typed classifier replacing the open
WOUND_TYPE_RE at its call sites (seven families partitioning the regex
exactly; behavior-identical golden both directions; totality walker over the
incident-type inventory). Slice 2: burialLedger.js (the ONE writer;
decree/dig-up/lapse all close through it); the two suppression arms
(revanchism family-scoped exact; grievance BANDED RECEIPTED DISCOUNT, never
zero); SUPPRESSION-NOT-DELETION (held = covered reads 0 WITH receipt AND
every incident row byte-identical); the DM burial verb (REPUDIATE_TREATY
twin, approval-routed) + the autonomous plan-lane arm priced by INT-1's
books; dig-up age priced on INT-5's corrected clock; INT-6 speaks ONLY
burial/dug_up — the word `forgiveness` never enters a type, status, or id
(WR-6's coalition 'forgiveness' action exists; the collision-free spelling
is load-bearing).

**#56 INT-7 — LEGITIMACY'S ROW + THE INTERIOR ENVELOPES** (flag
`legitimacyCrossingsEnabled`). legitimacyCrossings.js (reads the stock AFTER
existing writers; hysteresis on the existing band edges; NEVER a second
legitimacy writer); the crossing-has-a-hit walker (typed-hit vocabulary from
the writer census); subsystemRowsInterior.js — the new certification lane
(joins the partition registry same commit); the interior envelopes TOTAL
over all 20 declared endings tokens + the two-part tempo envelope; adopt the
landed WR-9 harness pattern (verify its location at build).

**#57 INT-8 — THE INTERIOR VOICE** (no flag of its own; needs the Q4
pre-ruling). NEW-KIND pools (books-standing, counsel, crossings, burial
family, attribution, join receipts) ride their kinds' flags — build freely,
dark, on the warReceiptPools shape with per-entity keys
`int8.<kind>.<entityId>`; LIT-KIND upgrades proceed ONLY against the
J-INT-13 ruling pre-recorded in FABLE_VALIDATION_QUEUE.md (Q4 — recommended
DARK prose-version-flag arm). The two voice cures + the habitat in one
commit: deploymentReturn.js:471 pHold/roll prose -> pools (dice stay in
metadata); relationshipMemory toFixed(2) -> banded phrase tables; AND
proseNumericsWalk extended past the push-indirection blind spot with the
guard-the-guard fixture proving the extended walker catches the planted
pre-fix pattern; both ratchet baselines DELETE their rows and shrink.

### PHASE 8 — THE BRAID (CW-1..3 LAST, after the volumes exist to couple)

**#58 CW-1 — THE CASCADE GOVERNOR** (flag `cascadeGovernorEnabled`; needs
SP-A's significance family + upstream causedBy adoption). cascadeBraid.js —
display-side composition ONLY (the engine/display pacing split:
narrativeTempo throttles births engine-side; the braid imports no engine
writer, census-pinned); a CASCADE = N >= member-floor receipts in a closed
INTERVAL_WEEKS window sharing a causal ancestor BY IDENTITY (recorded
provenance edges — never similarity) whose links cross >= 3 LAYERS (the
registry is the layer authority); ONE story item at the cascade's top
significance rendered FORWARD through discourseKernel (reused, never a
second prose kernel); members damped to SP-A's `routine` class WITHOUT
losing ids or feed presence (damped, never dropped; a `major` member is
NEVER damped). The composition seam is a guarded one-line delegation
(realmItemReadModel is over-ceiling and frozen — more than one line = STOP
for a decomposition slice). The braided item carries typed entity-ref slots
so heraldIndex facets match it (the SOL_QUEUE wiring note honored). False
causality is the hardest negative (two unrelated same-window misfortunes DO
NOT braid — seeded live chains first).

**#59 CW-2x — THE CAUSE-WALK EXTENSION** (no new flag; the ratified re-scope
of CW-2). What the landed V-4 estate already satisfies is NOT rebuilt
(backward walk, covert truncation, root honesty, integrity register). The
extension: the REGISTRY JOIN (causeWalkCouplingJoin.js — from a coupling
receiptField, resolve the receipt and open the walk; the row renders as the
link's LAYER TAG); HORIZON HONESTY sharpened (true root vs RETENTION CUT —
"the trail runs past living memory", never a fabricated link; aged and
un-aged fixtures, two lines, two causes); cross-layer rendering (glance =
crossing count, table = the chain); THE STORY HARNESS (fixture format
binding story -> expected chain shape -> owning-wave flag set + ONE
synthetic multi-layer chain with a deliberate broken-chain variant that must
red; each of the six stories' real fixtures land with their final owning
waves). Layer tags derive ONLY from registry rows — no word-association
inference.

**#60 CW-3 — THE COUPLING MEASURE** (no flag; closes the FP program).
The DIFFERENTIAL HARNESS (paired lit/dark same-seed soaks per coupling flag
family, families ENUMERATED from registry rows — never hand-listed; it must
first show the KNOWN divergence named by the distance-priced-news
certification row before certifying any unknown); ALIVENESS FLOORS
(subsystemRowsCoupling.js — every registry row fires at or above a banded
floor in the owner-signed lit soak or reds as decoration; dark volumes read
UNOBSERVED-and-say-why, never borrowed-evidence ALIVE); CASCADE ENVELOPES
(chain-depth distribution: most shallow, some deep, none unbounded; the six
story shapes each observed; **the degenerate-depth red** — all chains depth
<= 1 means the volumes never adopted causedBy and the program's premise
failed: red loudly, `chainDepthDegenerate`). BUILDS the instruments; RUNNING
them is the owner's terminal phase. The FP program is DONE when these
envelopes hold on the owner-signed lit soak, and not before.

---

## §6 JUDGMENT BLOCKS (collected; every one vetoable; an implementer NEVER
## re-rules one silently. The per-program registers stand in full in their
## files — headline rulings inlined here; J-FP-* are this synthesis layer's
## own rulings)

**Synthesis-layer rulings (J-FP-*):**
- **J-FP-1 (the one-time discharge).** The catalogGrewSinceWr10 discharge
  belongs to the FIRST catalog-growing commit in the compiled order, which is
  GR-3 (#11). GR-3 executes the full instruction (bundle widening asserted,
  pins retired, the war volume's CR-WR10-B row deleted); TR-5 and WF-6
  verify-then-skip. VETO re-assigns the discharge (and must then re-order
  §5). The CR-WR10-B twin-degradation-sentence law survives the discharge:
  byte-equal across volumes, PIN-6-guarded, no second sentence ever.
- **J-FP-2 (the pressure-ladder census).** SP-A lands the shrink-only
  pressure-ladder mint census + the LEVEL-vs-DIRECTION doc pin, giving
  J-WR-10-B structural enforcement before seven programs read pressure. VETO
  leaves the discipline as two header comments.
- **J-FP-3 (CW-0w pulled forward).** CW-0w lands in phase 0 — its regex
  widening is a hard blocker for the first non-WAR registry row, and every
  wave landed walker-less widens the honor-system surface. VETO holds CW-0w
  in the CW slot and accepts hand-audited rows until phase 8.
- **J-FP-4 (where believed subjects live).** SP-B's families land as
  beliefAxes fold arms; TR-3's consumers and every other reader are sibling
  lazy leaves; beliefMap.js (771-773 effective) gains net-zero seam lines
  only; a module-set census (not filenames) guards relocation. Resolves TR
  Q3 and SP seam ruling 1 into one law. VETO grows beliefMap.
- **J-FP-5 (IN-2's bait scope under the compiled order).** SP-B precedes
  IN-2, so the scarcity/conditions baits' substrate blocker is gone at
  build; the implementer re-measures and lands them in IN-2 or an immediate
  IN-2b slice, recording which; the axis census is authored against the
  at-build family set. VETO restores the volume's hard block wholesale.
- **J-FP-6 (alignmentOf).** SP R1's measurement is binding: alignmentOf is
  an injected closure parameter, not an export; WF V40's contrary row
  inherited the constitution's rotted cites. Req-13 consumers bind the
  injection seam. The constitution owes an erratum row.
- **J-FP-7 (the annex shape).** Each program's FIRST annex-wiring wave
  authors `requiredSlots:` declarations (and, where rows relocate,
  `[live, verbatim]` tags) onto the rows it wires — the richer shape, so the
  walker's orthogonal witness exists (count-only proof cannot see wrong-row
  selection). Incremental, never a bulk annex rewrite; only the
  DOSSIER_STATE/CAUSAL_DOSSIER annexes feed gen:dossier-prose (re-run on
  those edits only). VETO accepts count-only proof.
- **J-FP-8 (readiness/confidence ladders).** Any FP wave narrating believed
  readiness or confidence mints the ladder ONCE through SP-A's bandFamilies
  (J-WR-10-B: borrow before minting; if you mint, record why nothing
  existed). No wave in this volume currently needs it — the obligation
  stands so the first consumer cannot print a float.

**SPINE:** J-SP-1 axes in the existing fold, no believed-world module ·
J-SP-2 the errand ledger generalizes IN PLACE (migration owner-gated,
declined — Q10 confirms) · J-SP-3 three per-family axis flags, not one ·
J-SP-4 appetite as a dispositionStats facet (VETO mints
spatialLedgers.settlementAppetite) · J-SP-5 posture export names — SUSPENDED
INTO Q1 (the one cross-architect conflict) · J-SP-6 second-order belief has
no flag (pure read, consumers gate) · J-SP-7 SP builds nothing against the
term catalog (GRAMMAR owns formation) · J-SP-8 the frequency floor lands
shrink-only over the ~269 legacy tokens.

**GRAMMAR:** J-GRC-1 pactFormation is a writer-family leaf on the sale
pattern (supersedes the volume's net-zero-seams-on-the-head mint arm) ·
J-GRC-2 the peacetime pass mounts in the lifecycle host, never pulseKernel ·
J-GRC-3 mediation occasion 1 is a bounded multiplier at the opener's soft
gate · stage order market-first-pacts-second (GR-2, vetoable) · GR-3 mints
the trade-rights rows as executor:'seam' (GR Q1, TR agrees — resolved).

**INFORMATION:** J-INA-1 the IN-0a transport (Q3 rules the road; the wave
does not start until ruled) · J-INA-2 the TWO-CHANNEL ruling
(envoy-picture patches vs belief-axis records — distinct forever,
source-scanned) · J-INA-3 the devotion bait builds on live faithLabel ·
J-INA-4 intelTradeEnabled joins the manifest in IN-4 commit 1 · J-INA-5 the
mirror's seventh input is the handed-over negotiation pictures · J-INF-15
DISCHARGED (sendTwoDivergence is the one home) · J-INF-14/-17 stand as
ruled.

**TRADE:** the buildability split is fact, not license to re-sequence (Q2
owns early motion) · J-TR volume rulings stand (no war-table imports; the T7
exactly-one-arm law; houses regen-preserved as the disclosed exception;
plan-fence untouched; alignment prices, never gates) · pending-then-certify
flag rows converting at TR-9 (compatible with CR-WR10-C — resolved).

**FAITH:** WF-8 mints FIVE arcs (Q-resolved: accept five — the settlement
schism contest supplies the signature's ingredients) · declared-dark posture
arms with import-source tripwires (Q-resolved; mostly mooted by order) ·
faith terms COMPOSE into the sovereignty bundle (Q-resolved: exclusion would
break the bundle's own no-literal pin) · the DS-FTH corpus is BINDING
spelling law (Q-resolved: one doc pin, writers already agree) · WF-0
registers no flag · stance consequences land in a leaf, the lane file
untouched.

**POPULATIONS:** the return column extends DEMOGRAPHIC_COLUMN_CLASSES with
`'returning'` (Q-resolved: the class IS the ownership mark) · POP-7 lands
the commonsVoiceEnabled certification row and shrinks the backlog
(Q-resolved; check-first) · the homeward flight-vocabulary rumor accepted
for v1, recorded (Q-resolved) · arrivals do NOT feed mass_migration in this
program (deferred beside J-POP-14 — Q6 carries it to the owner) ·
commonsArc's petition-side independence from demographicsEnabled kept.

**INTERIOR:** warSeatBooks.js IS seatBooks.js (no rename, no facade) ·
decision grievances are SIBLING types through the one landed writer, never a
re-type (THE PROMISE) · the six INT flags join the manifest + a new
subsystemRowsInterior.js lane (Q5 owns the war-flag uniformity half) ·
INT-6 speaks burial/dug_up only · INT-3b unblocked by SP-D (Q-resolved by
sequencing) · J-INT-13's lit-kind arm goes to Q4 for pre-recording.

**COUPLINGS:** CW-2 re-scoped to CW-2x over the landed V-4 estate
(Q-resolved: ratify — the no-second-telephone reasoning applies to
ourselves) · the inclusion ratchet is BASELINE-FROZEN shrink-only, not
greenfield-clean (a clean scan would red hundreds of legacy edges and be
deleted by Friday) · schema v3's optional frozen kinds[] + per-volume
receipt-field sampling (Q-resolved) · the braided item is
VIEW-ITEM-WITH-RECEIPT-DISCIPLINE, never persisted (Q-resolved; durable
braids would be a new key and a new L4 fight, priced later).

---

## §7 THE TUNING SURFACE (owner-signed at the soak redo, per THE PROMISE;
## every band raw-authored until signed; NONE in proposedSoakBands.js until
## ratified; every SP band row carries the ERA-PRESET-ELIGIBLE column — SP-F's
## one obligation; the SP-A reconciliation walker enforces Bands-line <->
## tuning-table totality both directions, growing one volume at a time)

- **SP:** the shared half-life band table · the SP-6a significance family and
  SP-6b severity ladder (the scales themselves, owner-signed ONCE) ·
  per-family accuracy-adoption bars · scarcity good-class band edges ·
  conditions band edges (tier/stores/route-position/pull) · devotion band
  edges · appetite learn rates + the shared half-life instance · posture
  composition weights + threshold caps (a posture COLOURS, never drowns) ·
  per-class interception weight deltas · declared/true divergence share ·
  the phrase-repetition envelope band + season window + cadence-class
  boundaries.
- **GR:** proposal caps (MAX_OPEN_PROPOSALS) · trigger crossing bands ·
  dwell/answer bands stated against the measured 2..8-week hopWeeks spectrum
  (the calibrated-weeks law) · renewal window + ask-cap · succession charge
  bands · mediation pressure multiplier bounds + trust accrual.
- **IN:** bait attractiveness + resistance bands · axis-typed exposure
  contradiction bands · suspicion derivation bands · sweep zeal thresholds
  (paranoid/trusting entries) · race window · secrecy trade factor band +
  cap · the significance-ceiling triple.
- **TR:** severance/partnership magnitude bands · house formation floor +
  MAX_HOUSES + ruin latch · corner share + MONOPOLY_DWELL seasons
  (INTERVAL_WEEKS-derived) · GRAIN_UNITS_PER_MONTH + the calm-equivalence
  band · pact trigger crossing + lean-year suspension · venture stake bands
  + one-active cap · factor interception deltas · the endings-share
  envelopes.
- **WF:** fall-cause histogram floors · season pull + subsumption delta ·
  stance colour caps · omen cooldowns/caps + lens damp · covert growth 520w
  / assimilation 156w + surfacing bars · faith-term appraisal weights ·
  tithe draw + splendor cap + remission bands + sack-loot weight · the 3x
  narration multiple + arc occurrence envelopes.
- **POP:** believed-attraction gap band (the letter threshold) · refusal
  rung dips + jump dwell · kin-pull cap + spent-tie decay · arc stage bands
  + aftermath window · column event weights + `column:<id>` draw budget ·
  permit depth steps · the herald floors (0.20/4/12/6/200 — verified exact)
  · rush:bust + parity envelopes.
- **INT:** books weight split + change-gate deadband · counsel margin +
  patience · decision severity spans (BASE 0.36 + POWER span 0.34 as landed)
  · strain burden bands · memory horizon multipliers (both constants) ·
  burial price + dig-up age scaling · crossing hysteresis · the tempo
  envelope floors (0.005/settlement-year baseline).
- **CW:** cascade window length · member floor · depth threshold (>= 3
  layers) · member cap · braid-class derivation (a class WITHIN SP-6a's
  family, never a new scale) · aliveness floors per registry row ·
  chain-depth envelope shape.

L5 binds every row: banded, no bare float on any surface, one tuning table
per wave (the house idiom). The dead-band law binds every band: reachability
measured at authoring (both sides of every weight live; no band outside its
input's measured spectrum).

---

## §8 HERALD + LEGIBILITY CONTRACT (the sentences this estate must be able
## to say, and the wiring that makes them provable)

**The annex ground (census §1):** the corpus is COMPLETE and CLEAN — 9,072
authored variants across twelve annexes, zero kinds below their
frequency-scaled floor. Seven FP annexes are read by NOTHING. Each program's
first herald wave therefore takes its annex's address FIRST:

| Program | Annex | Kinds / variants | First wiring wave |
|---|---|---|---|
| GR | RECEIPT_POOLS_GRAMMAR.md | 66 / 456 | GR-0 |
| IN | RECEIPT_POOLS_INFORMATION.md | 64 / 489 | IN-0a |
| TR | RECEIPT_POOLS_TRADE.md | 107 / 790 | TR-1 |
| WF | RECEIPT_POOLS_FAITH.md | 103 / 736 | WF-1 |
| POP | RECEIPT_POOLS_POPULATIONS.md | 70 / 508 | POP-2 |
| INT | RECEIPT_POOLS_INTERIOR.md | 76 / 498 | INT-1 |
| CW | RECEIPT_POOLS_COUPLINGS.md | 23 / 202 | CW-1 |

The five binding obligations per wiring wave (all census-derived, all
walker-enforced once landed): (1) the reader EXTENDS
tests/helpers/receiptAnnex.js — never a fork, never hand-rolled indexOf
slicing (the address-lie and first-match defects live exactly there); (2)
the walker copies warCostKindPools (annex-reading), never
phrasedKindPools/lineageKindPools (which read no corpus); (3) floors derive
from each kind's OWN significance class (major/rare >= 4, notable >= 6,
chronic >= 8-12) — never a hard-coded five (the Class-B lesson; Q7 closes
D-W3 to the cap-raise arm); (4) requiredSlots authored per J-FP-7 so the
orthogonal witness exists; (5) a mutation-coverage manifest entry with an
executed mutant per walker. Every FP volume also gains one line naming its
annex file (the volumes' binding is convention today — nothing reds a
rename).

**The five joins per kind (L6), restated as the per-program checklist:**
annex pool row (verbatim) · registry row with requiredSlots + slotless
fallback · WHAT_PHRASES · section authority (EXACT_SECTION/SECTION_OF; the
knowledge desk exists only after IN-5) · full address chain with id, typed
action, settlements BY NAME, recorded reason, audience projection. Every
kind gets its own walker file; frequency floors from SP-E's shared helper;
the pacing class assigned at mint from SP-A's family.

**The sentences (acceptance, per program — the legibility law is a criterion,
not decoration):**
- GR: "the pact was proposed, and refused" · "twenty years kept, and lapsed
  quietly" (the eulogy) · "the oath was his, and he is dead — the treaty
  stands" · "the seat repudiated what the old seat swore".
- IN: "the lie took" / "the lie was exposed, and the market named" · "the
  truth arrived a week too late" · "two envoys, one parlay, two stories" ·
  "the court sat still, and knew".
- TR: "they came for the famine and found the harvest" · "the pact was
  signed, and the granary rose" · "the house cornered the grain, and the
  town remembered" · "the venture sailed, and did not return".
- WF: "the god fell quietly, the last altar dark" · "the roads filled for
  the feast" · "the reading promised rain; the rain did not come" · "the
  cellar congregation surfaced at last" · "they burned the temple and took
  the coffers" (observer-axis judged).
- POP: "the letters home said the streets were not gold" · "the commons
  refused the levy, and the muster was smaller" · "the plague crested and
  passed; the bells were for sickness, not hunger" · "the column never
  arrived, and no one could say why".
- INT: "the seat and the town were of one mind" / "the war served the seat"
  · "the tribute wore the crown's welcome thin" (attributed, never
  amplified) · "the grudge was buried with ceremony, and dug up dearer".
- CW: the braided cascade — "the drought reached the temple by way of the
  granary, the road, and the count's pride" — forward-rendered, members
  damped never dropped, covert members truncated byte-identically for
  players.

**Health notes carried:** the knowledge lane routes ~1.1% of tokens today
(worse than surveyed — IN-5/IN-6 are the cure, re-measured at build); the
starvation figure and every numerator re-measure at the landing commit.

---

## §9 SEQUENCING RATIONALE + THE SEAM MATRIX

**Why this order (§5) and not another:** SP first because three programs'
subjects (scarcity/conditions/devotion), the posture read, the errand spine,
and the significance family are five-program dependencies — and because
SP-B+SP-B2 supply the leg SURFACES and the SEAM CR-WR10-H demands,
un-darkening a landed war instrument — still the highest-leverage motion in
this order. AMENDED 2026-08-05 (the ES + WY owner-amendment fold, ES ⟨F9⟩):
that discharge has THREE members, not two — ES-4 is the third and proves the
distant SOURCE, so the precondition COMPLETES in PHASE 3, not here. This
SHARPENS the rationale rather than softening it: SP still goes first because
the surfaces must exist before any source can be proved against them, and a
market lit on surfaces without distant sources clears only rumor-range
holdings. The count word this sentence used to carry ("a pair of commits") is
retired deliberately; see §3's lighting contract, §5 wave #4, ES-4's block,
and §9 seam row 4. CW-0w in phase 0
because the registry's growth path is mechanically blocked (the WAR-locked
regex) and every pre-walker wave widens the honor-system surface. GRAMMAR
before INFO/TRADE because the term catalog, formation writer, and proposal
ledger are their substrate (and GR-3 owns the one-time discharge). INFO
before TRADE so the lure/secrecy contracts exist when TRADE consumes them.
FAITH after TRADE for the tithe/pilgrim ports; POP after FAITH for the omen
and diaspora couplings; INTERIOR after POP because its consumers
(seatBooks/permits/commons) are the others' callers; CW-1..3 LAST because
braids, walks, and envelopes over couplings that do not exist yet are
instruments over an empty sky (the chainDepthDegenerate red says exactly
that). Early-eligible waves (GR-0, GR-1, TR-1, TR-4, TR-9-contract, and —
folded 2026-08-05 — ES-0's pure leaves) are measured facts about what COULD
build now; AUTHORIZING early motion is a separate act, and it is Q2, RULED as
CQ2 for exactly GR-0 + GR-1 + TR-1 + TR-9-contract. **THE FOLD DOES NOT WIDEN
THAT SET.** ES-0's early ELIGIBILITY is recorded above as the measured fact
it is, and CR-FP-12 (§11 addendum) DECLINES its early MOTION: ES-0 edits two
live war-lane files and carries a cross-file vocabulary retarget with
golden-shift exposure, so it runs in strict order. Eligibility is a
measurement; membership in CQ2 is a ruling; the two are never the same
sentence. WY-0 is buildable-now too but is a SURFACE wave: it opens the
SOL_QUEUE §2 LANE B WY sub-block, not this order.

**The seam matrix (every cross-program contract; pin owner each side; the
tripwire that makes silence impossible).** HONORED = the counterpart's pin
already exists; PRE-PIN = this volume lands both sides.

| # | Seam | Direction | Pinned by / tripwire |
|---|---|---|---|
| 1 | Term catalog growth | GR-3 -> WR-10 bundle | HONORED: catalogGrewSinceWr10() reds at GR-3; the one-time discharge is GR-3's (J-FP-1) |
| 2 | Twin degradation sentence | TR-5 <-> WR-10 | HONORED: byte-equal Seam One sentence, PIN-6 + uniqueness; no second sentence ever |
| 3 | Trade-rights rows | GR-3 -> TR-5 | PRE-PIN: seam rows minted at GR-3; a GR pin asserts them producer-less and reds the day TR-5 lands executors (the handoff signal) |
| 4 | Belief legs + the distant SOURCE | SP-B2 + ES-4 -> WR-10 lighting | HONORED/PRE-PIN: the injectable beliefLegsFor seam; the green condition is SP-B + SP-B2 + ES-4 landed (ES §5 seam 6, ⟨F9⟩). CORRECTED AT THE FOLD, DISCHARGED AT SP-B2: no certification lighting-order row existed as an artifact anywhere in src/tests/docs (RE-MEASURED AT THE FOLD HEAD `32cc17f7`, the same head §3's lighting contract cites — the 99d63d92 census this document once leaned on is repudiated as an undercount and is cited nowhere). **SP-B2 MINTED IT 2026-08-05**: `SOVEREIGNTY_LIGHTING_EVIDENCE` + `evaluateSovereigntyLighting` in src/domain/certification/warConvergenceContract.js, three rows citing SP-B / SP-B2 / ES-4, measured against the tree by tests/lint/sovereigntyLightingContract.walker.test.js — UNSATISFIED_TRACKED today (missing ES-4), SATISFIED the commit ES-4 carries its marker |
| 5 | Axis vocabulary | SP-B <-> TR-3/POP-1/WF-2a/IN-2 | PRE-PIN: closed-vocabulary pin SP-side; each volume's first consumer wave owes its-side pin; spelling-drift scan reds any axis token outside SP-B's module |
| 6 | Posture consumers | SP-C <-> GR-2/TR/WF/POP/INT-1 | PRE-PIN: with/without-books golden pair; a posture receipt that fails to name its inputs reds; seatBooksEnabled lighting = pre-declared disclosed shift |
| 7 | Errand consumer registry | SP-D <-> GR/TR-8/WF-2b/IN-4/INT-3b | PRE-PIN: frozen consumer map, both-ways walker (unregistered minter reds; consumerless row reds) |
| 8 | Appetite actor closure | SP-C <-> TR-2 houses / WF temples | PRE-PIN: riskToleranceOf-class read reds on an unknown actor class; widening = an SP-4a constitution amendment |
| 9 | Band-family reconciliation | SP-A <-> every volume §7 | PRE-PIN: Bands-line <-> tuning-table totality both directions, volume by volume |
| 10 | Pressure-ladder mints | SP-A <-> everyone | PRE-PIN (J-FP-2): shrink-only mint census; LEVEL vs DIRECTION doc-pinned |
| 11 | secrecyTradeFactorOf | IN-0d -> TR | PRE-PIN: identity-1.0-outside-HIDE + band/cap both sides; secrecyTradeContractChangedSinceIn0d() |
| 12 | Axis families census | IN-2 <-> SP-B | PRE-PIN: axisFamiliesGrewSinceIn2() authored against the at-build set (J-FP-5) |
| 13 | Courier retirement | IN-4 <-> SP-D | PRE-PIN: dark arm byte-identical + lit-arm errand contract; the retirement pin reads errandSpineEnabled BY NAME |
| 14 | mirrorOf shape | IN-1 -> GR negotiation posture | PRE-PIN: frozen return shape (closed keys, banded) — one reader shape, two programs |
| 15 | Knowledge desk | IN-5 <-> every volume's knowledge kinds | PRE-PIN: mint-time registration only; IN-6's earned-classification walker is the standing tripwire |
| 16 | Testimony ladder | IN-3 <-> WR-7c | HONORED: TESTIMONY_LADDER == RELIABILITY_LADDER equality pin; vet composes, never re-spells |
| 17 | Divergence reader | IN-3 <-> WR-7d | HONORED: sendTwoDivergence one home; source scan reds a fork |
| 18 | intelTransfers | IN-1/IN-4 <-> generosity | HONORED: D-3 single-writer (generosity owns + prunes; statecraft reads) |
| 19 | treatiesPricedDuring | GR-0 -> IN | PRE-PIN: find/miss pins GR-side; the unconsumed-export pin reds when IN wires it |
| 20 | Alliance-web risk | GR-2 -> WR-6 read | HONORED: the closed-census walker is the tripwire; the third-consumer update ARGUED in GR-2's commit |
| 21 | Repudiation charge | GR-4 <-> WR-0c verb | HONORED: disclosed lit-path addition under oathHolderEnabled; both-paths + dark-negative |
| 22 | Disposition outcomes | GR-* <-> WR-2 | PRE-PIN: the outcome-freeze pin lands at GR-0; a GR wave wanting a new outcome is a STOP to the war chair |
| 23 | Grant reads (faith/pop/trade) | GR-3 -> WF-6/POP-5b/TR-5 | PRE-PIN: producer-side pins at GR-3; consumer reachability required-from-birth in the compiled order, recorded per wave |
| 24 | seatBooks consumers | INT-1 <-> TR-7 / POP-5b / FAITH(absence) / SP-4b | PRE-PIN: declared-future-consumer census rows; the FAITH row pins the ABSENCE (its red is the lift signal); the cycle-absence import pin lands live |
| 25 | Oath-holder heir clause | GR-1 <-> INT-3 | PRE-PIN: the heir clause ships dormant with its activation-shape pin (J-INT-10) |
| 26 | seat_held drift | IN <-> INT-3 | PRE-PIN: the succession trigger declared, consumption dormant; interior never writes credibility |
| 27 | Registry row per read | CW-0w <-> every wave | SC-1: the inclusion walker makes the same-commit obligation mechanical; unregistered new cross-layer import pair reds |
| 28 | Desk agreement | CW-0w <-> IN-5 | SC-2: registry-vs-routing agreement walker; IN-5's refile moves row desks in the same commit |
| 29 | Significance family | SP-A -> CW-1 + every mint | SC-3: braid classes derive WITHIN the family; building against the two-valued vocabulary is a STOP |
| 30 | Engine/display pacing split | CW-1 <-> narrativeTempo | SC-4: zero-engine-import census on cascadeBraid |
| 31 | causedBy adoption | every state-writing FP wave -> CW | SC-6: each mint populates causedBy at the writer; CW-1 depth fixtures + CW-3's chainDepthDegenerate red are the double tripwire |
| 32 | couplingId prefix closure | CW-0w <-> all volumes | SC-7: the closed ELEVEN-prefix alternation (WR|TR|GR|WF|POP|IN|INT|SP|CW|ES|WY — ES tenth and WY eleventh, consciously admitted at the 2026-08-05 fold, both sites of tests/domain/couplingRegistry.test.js edited together); a TWELFTH prefix reds until consciously admitted. ADMISSION IS DOCUMENT-ONLY: no walker demands a registry row per admitted prefix, so ES and WY carry zero rows until their first cross-layer read — which owes its row SAME-COMMIT, and whose owningVolume also widens that file's owningVolume set assertion in the same commit |
| 33 | Braided entity refs | CW-1 <-> heraldIndex | SC-8: facetAvailability PENDING -> available is the tripwire |
| 34 | Receipt-field sampling | CW-0w helper <-> TR-9/GR-7/POP-7/WF-9/IN-6/INT-7 | SC-9: each convergence wave samples its OWN rows; CW-3 reds never-sampled rows as UNOBSERVED |
| 35 | DS-FTH spelling law | Lane-P corpus <-> WF-1/5/7 | HONORED: the exactly-once doc pin lands with WF-1; divergence is a STOP; DS edits re-run gen:dossier-prose |
| 36 | Faith desk kinds | WF-8 <-> WR-10's sovereignty_sale_judged | HONORED: counted once in the census, never twice |
| 37 | Dissolution join | WF-1 <-> WR-1 | HONORED: sacredAnchors + anchor_unavailable live; the two-flag fixture + net-zero against warTermination's frozen 818 |
| 38 | Foreign-guest hold | WF-2b/TR-8 <-> WR-7b | HONORED: one writer; import pins prove no second |
| 39 | T7 granary fence | TR-4 <-> P-lane | PRE-PIN: exactly-one-arm walker both flag states forever; five-site census + executed sixth-writer plant |
| 40 | Commons cohesion | TR-6/POP-2 <-> commonsVoiceKernel | HONORED: no new writer, no new effect vocabulary; the seizure writer is TR's own commodityFlow-family leaf |
| 41 | Toll physics | POP-5a <-> TR/J4 | PRE-PIN: `tolled` dormant unless a charter toll read exists; source scan — POP prices no toll number |
| 42 | Departure-memory API | POP-3 -> couplings' diaspora pair | PRE-PIN: band-words-only read surface |
| 43 | Belief subjects census | POP-1 <-> SP-B | PRE-PIN: beliefSubjectsGrewSincePop1() — the resolver names no axis outside the closed set; a new family reds until widened |
| 44 | Conscript share | POP-2 <-> WR-4 | HONORED: the shortfall is a smaller real muster UPSTREAM, never a parallel multiplier |
| 45 | Draw accounting | POP-5a <-> wave-E instrument | HONORED: column:<id> is the one declared rng fork, draw-accounted |
| 46-58 | THE ESPIONAGE BLOCK (13 rows) | ES <-> WAR · ROADS · TRADE(TR-8) · SPINE(SP-B/SP-D) · GRAMMAR · SOVEREIGNTY MARKET(WR-10) · HERALD · INTERIOR · INFO siblings(IN-2/3/4) · FAITH+alignment · MAGIC ECONOMY · CORRUPTION WEB · AMBIENT ESPIONAGE FLAVOR | PER-ROW IN docs/DESIGN_FP_ARCH_ES.md §5, which is normative for all thirteen. Their pins in one line: the ONE hold writer and the 16-16 taxonomy count pin (WAR); import-source pins both sites (ROADS); the SP-D consumer map carrying BOTH covert rows (TR-8); the axis-drift scan (SPINE); the by-name espionageEnabled read GR-side (GRAMMAR); the fed-by-espionage fixture + non-neighbor differential (WR-10); per-kind walkers + the covert-departure significance negative (HERALD); the deleted-symbol pin (INTERIOR); the writer-boundary scan + the vetting one-home scan (INFO); the one-spelling law-band scan (FAITH); the signature-shape scan (MAGIC); read-only scan on the web ledgers (WEB); the espionage_* kind-prefix walker (AMBIENT) |
| 59-66 | THE WAYFARE BLOCK (8 rows) | WY <-> WAR · TR · POP · WF · IN · SP · ES · SURFACES | PER-ROW IN docs/DESIGN_FP_ARCH_WY.md §6, which is normative for all eight. Their pins in one line: the UNIT_SOURCES sixth-ledger census + the F9 single-writer scan + conservation identity, and the war volume's two J-D11(b) sites amended IN THE FOLD COMMIT or the fold is incomplete (WAR); the grain pre-pin rows + the shrink-only T7 census + the one stock-write seam (TR); THROUGH-ENQUEUE + proposal-accept + the double-send and wrong-lane mutants (POP); the single-writer census on share writes (WF); the fork-key-set census + the other-consumer stream golden (IN); law M's second-speed-floor walker (SP); the fail-closed export mutant on covert movers + the plant-site pricing pin citing WY-2 (ES); the mirror walker both directions + the map-only import census + the size ratchet (SURFACES) |

**THE 2026-08-05 FOLD: 45 -> 66.** The two owner-amendment volumes bring
twenty-one further seams — ES rows 46-58 (thirteen) and WY rows 59-66 (eight)
— carried here as ONE ROW PER PROGRAM because this volume compresses and the
program files govern (§10.8). Reading a folded seam means opening its volume's
seam section; the two rows above are an INDEX, never the contract. FOUR fold
obligations sit OUTSIDE any wave and are owed by the fold commit itself: the
war volume's two J-D11(b) pointer sentences (WY §5b item 9); the 2l
OCCUPATION BOTH-SIDED REGISTER census, routed WAR-side, VERIFY-THEN-PIN (WY
§5b item 10); the CR-ES-2 anonymity amendment landing in BOTH its homes
before ES-2 builds; and THE THREE-MEMBER LIGHTING DISCHARGE LANDING IN EVERY
BINDING VOLUME — TEN sites, re-measured at the fold: this volume's own FIVE
(§2a, §3, §5 wave #4, §9's sequencing rationale, §9 seam row 4),
docs/DESIGN_FP_ARCH_SP.md's FOUR, and the war volume's
CR-WR10-H paragraph (ES §6 item 5 requires the
war-volume sentence by name). A fold commit missing any of them is
incomplete, and the fourth is the one whose omission would leave a NORMATIVE
per-program volume telling an SP-B2 implementer the discharge is two.

---

## §10 IMPLEMENTER PROTOCOL (binding; the war volume's §10 verbatim, plus
## the FP compile's additions — L7/L9 at verbatim strength)

1. **Worktree + branch:** all work in the minifold worktree
   (`.claude/worktrees/minifold`, branch `claude/composite-r4`). Hard-gate
   every state-mutating compound:
   `[ "$(git branch --show-current)" = "claude/composite-r4" ] || exit 1`.
   NEVER `git add -A/-u/.` — pathspec commits, every staged hunk verified
   yours. `git stash` is FORBIDDEN. Never touch `momentum.js`. Never edit
   another program's dirty files. THE TREE IS LIVE: fresh `git status` +
   `git log --oneline -5 -- <file>` before every edit session on a shared
   file; re-grep old names after every rename (the concurrent-lane
   silent-revert class); cp backups for negative controls, cmp/md5-exact
   restores, NEVER the checkout family.
2. **Gates:** never read a gate through a pipe — `npm run check:tail` or
   `sh scripts/gate-tail.sh <cmd>`; the full suite exceeds the 10-minute cap
   (run detached); gate only when `ps`/`lsof` shows zero other vitest
   workers; timeout-shaped reds under load are flakes — isolation re-run
   before diagnosis. tests/lint is red at base: attribute by VIOLATION ROWS
   against a git-archived base with node_modules symlinked, never by walker
   color or failing-file name.
   **RED-RATCHET CONTENT DIFFS — the attribution law's second half (added
   2026-08-05, settling lane; SP-B verifier FINDING B).** Failing-ROW identity
   is NOT sufficient attribution. A ratchet, inventory or allowlist test that
   is RED ON BOTH SIDES emits the same failing file, the same test name and
   the same normalised FAIL row while the inventory INSIDE it grows — so a
   wave can report "net attributed delta ZERO, failing-row identity diff EMPTY
   in both directions" truthfully at row granularity and falsely at content
   granularity. This is not hypothetical: SP-B added its three flags to
   mechanismLitCoverage's shrink-only gap (29 -> 31 entries) under a perfectly
   empty row diff, and the wave's acceptance record said the gap contained no
   SP-B name. THE LAW, BINDING AT EVERY WAVE END: for every ratchet /
   inventory / allowlist / baseline test that is red in BOTH archives, RUN IT
   DIRECTLY in each archive and diff its ASSERTION PAYLOAD — the actual
   received name lists, not the row text — attributing every added and every
   removed entry to a named cause. An entry a wave ADDS to a shrink-only
   inventory is that wave's own debt: discharge it, or defer it in the ledger
   row WITH A REASON. It is never inherited silently, and "the ratchet was
   already red" is not attribution.
3. **One wave = one commit** (sliced waves: one commit per slice) + focused
   gates per slice + full gate at wave end + a ledger row per the house
   convention. Every authored file byte-scanned (python3 — NUL/control
   bytes; the Write-tool escape class has bitten six times). Exactly-once
   discipline on volume edits; every doc-reading pin asserts its target
   appears EXACTLY ONCE.
4. **Goldens:** capture every dormancy fence BEFORE wiring (the J1
   precedent). A golden that moves unexpectedly is a STOP-and-report, never
   a re-record; re-records happen only against a ruling recorded in
   FABLE_VALIDATION_QUEUE.md or by the owner, with the field-level diff
   quoted (WR-0b's shape). Legitimate behavior shifts are DISCLOSED
   same-seed shifts, named in the commit.
5. **Tests:** new generation-tree tests use
   tests/helpers/{anchoredNegatives,seedFailures}.js (walkers red
   otherwise); `// anchored:` on every new negative assertion; every
   load-bearing conjunction gets an executed mutant (cp/cmp discipline) +
   a mutationCoverageManifest entry; analytic pins that recompute from
   tokens are refused — pin the rendered/executed artifact; seed non-empty
   state before any absence assertion (the vacuous-absence class); a claim
   proven on one fixture/breakpoint is a claim about one.
6. **Registration:** every new news kind = the L6 five joins in its mint
   commit + its own walker file; every new store action registers in
   operationRegistry + `npm run gen:compendium-data` (diff exactly the new
   operations); every cross-layer read adds its couplingRegistry row in the
   SAME commit; every new flag follows §3's one-commit manifest law; any
   edit to a DOSSIER_STATE/CAUSAL_DOSSIER annex row re-runs
   `npm run gen:dossier-prose` in the same commit; any lane touching
   edge-bundled inputs rebuilds edge-shared (the five-bundle law —
   VERIFY-AT-BUILD whether a touched file is a bundle input).
7. **Per-wave staffing (L9):** implementer + adversarial verifier with
   reject gates; the verifier budget at parity with the implementer half on
   voice/mold surfaces. Spine req 13 (Alignment line — engagement or
   declared-empty WITH REASON) and req 14 (Edit-verb story — or engine-only
   recorded with rationale) discharged in every wave's ledger row.
8. **Report, don't rule:** any conflict between this volume, a program
   architecture, a source volume, an amendment, or the tree is a
   STOP-and-report to the validation chair; deviations are proposed, never
   taken. STOP-and-report on a measured blocker is a SUCCESS mode. J-WR-13
   binds: a newly-found census overstatement STOPS the wave before anything
   builds on it.
9. **Navigation:** by SYMBOL, never by any document's line number (every
   volume's addresses have rotted at least once); a brief that inherits a
   line address re-greps it first. Size figures re-measure with the
   enforcer Linter at the publishing commit — never inherited, including
   from this document.
10. **Reporting:** every claim in a completion report is CONFIRMED
    (executed, output quoted) or PLAUSIBLE (labeled). "Should work" is not a
    state of the world. Nothing here lights a flag, runs a soak, ratifies a
    band, or pushes — the owner's boundary is unchanged (soaks, lighting,
    tuning, pushes are the terminal phase).

---

## §11 OPEN CHAIR QUESTIONS (capped at ten; ranked by blocking power; each
## with the synthesis recommendation — all vetoable; ALL TEN NOW RULED, see
## the dated addendum at the end of this section)

**The cap holds at ten — the two amendment volumes do NOT inflate it.** The
ES owner-amendment volume (docs/DESIGN_FP_ARCH_ES.md) carries five
ES-prefixed chair questions — its §7 is the authoritative list, RULED
CR-ES-1..CR-ES-5, and it carries CR-ES-6 beside them: the JOINT ES/WY ruling
admitting the espionage gauntlet to the Wayfare encounter table (raised at the
fold's cohesion pass, not a numbered question). The WY owner-amendment volume
(docs/DESIGN_FP_ARCH_WY.md) carries five WY-prefixed chair RULINGS (Q1-Q5,
each the volume's own recommendation AFFIRMED, each vetoable) — its §7 is the
authoritative record.

**Q1 — The posture-read naming (blocks SP-C, #5).** The one genuine
cross-architect conflict: SP rules keep the constitution's
`postureOf`/`riskToleranceOf` module-scoped beside roads' existing npc-grain
`riskToleranceOf` (an erratum cascade costs more than disambiguation); GR
rules the court reads are spelled `courtPostureOf`/`courtRiskAppetiteOf`
(the silent-wrong-import class is real); WF requires import-source pins
either way. RECOMMENDATION: keep `postureOf`; rename ONLY the colliding
second export to `courtRiskAppetiteOf` at SP-C's module with a one-row
constitution erratum — the collision dies at birth, the erratum is doc-only,
and the import-source pin set + both-site headers land regardless of arm.

**Q2 — Early-motion authorization (affects scheduling now).** The measured
buildable-today set is GR-0, GR-1, TR-1, TR-4, TR-9's contract module (no
spine reads). RECOMMENDATION: authorize exactly GR-0 + GR-1 + TR-1 +
TR-9-contract to interleave during phases 0-1 (pure density wins, no
cross-program seams); hold TR-4 for the spine-era soak instruments (its
calm-equivalence band deserves them); everything else strict order.

**Q3 — IN-0a's envelope transport (blocks #16; the wave does not start until
ruled).** RECOMMENDATION: the primary road — each consumer reads the PRIOR
tick's applied brokerage_plant events at its own head (zero new keys, zero
kernel edits, law-M one-week lag); VERIFY-AT-BUILD the metadata retention;
fallback = the pendingPlants conditional deposit under the D-3 contract;
both fail = STOP for a chair-signed kernel seam.

**Q4 — J-INT-13 pre-recording (blocks #57).** INT-8's lit-kind pool
upgrades need a recorded ruling BEFORE the wave starts. RECOMMENDATION:
pre-record the DARK arm now in FABLE_VALIDATION_QUEUE.md (lit-kind pools
ship behind a prose-version flag; every existing golden byte-identical); the
owner may later take the re-record arm with the WR-0b field-level diff.

**Q5 — Flag-manifest uniformity (shapes every flag commit).** All 43 FP
flags take manifest + certification row/pending + first gate read in one
commit (§3, bound). The five WR flags predate the manifest and certify
lane-only. RECOMMENDATION: record the war flags' absence as pre-WW-A
history (not doctrine); a back-join sweep is the war chair's own call,
queued not assumed.

**Q6 — Arrivals feeding mass_migration (POP RF-4; owner-shaped).** The
stressor type is mintable and its reads are live; only the arrival-side
writer is absent. RECOMMENDATION: NO in this program — a new pressure
mechanism wearing staging's clothes, counterforce unpriced; record as
deliberately deferred beside J-POP-14 for ONE owner ruling covering both
arrival-side couplings.

**Q7 — D-W3 formal close (unblocks the four red Class-B rows and SP-E's
helper).** Measured: trimming the corpus to five puts all four kinds below
their own SP-6 floor — the trim arm is forbidden by the spine's own law.
RECOMMENDATION: countersign the cap-raise arm; walkers read floors from
significance (SP-E's shared helper retires the fixed-five class).

**Q8 — The sale door vs the one-instrument law (post-GR-2 harmonization).**
peaceTermsSale.js:246 REFUSES a sale against a standing pair instrument;
once GR-2's amendment seam exists, a sale could be a lineage act instead.
RECOMMENDATION: not in this build — GR-2 pins the refusal UNCHANGED (the
fenced baseline); the harmonization is a recorded post-GR-2 candidate owned
jointly with the war chair.

**Q9 — The applyWorldPulse.js:92-110 second storageMonths fold (would stall
TR-4).** RECOMMENDATION: pre-rule REPORTED-NOT-DEFECT — it is the banked
file's own treaty fold; TR-4 routes zero traffic through it and the
sixth-writer scan fences it; file the queue row now so the lane never
stalls.

**Q10 — The errand ledger address (persistence-shape confirmation).** SP-D
generalizes `worldState.envoyErrands` IN PLACE; the constitution's
`spatialLedgers.errands` address is recorded as resolved-at-build.
RECOMMENDATION: confirm keep-in-place; the migration arm is owner-gated
persistence churn on a live save shape with zero behavioral payoff, declined
— the constitution owes the erratum row.

---

### §11 ADDENDUM — THE CHAIR RULINGS (chair, 2026-08-05; recorded at the ES +
### WY owner-amendment fold; every one VETOABLE by one owner clause; an
### implementer NEVER re-rules, softens, or extends one silently, and a ruling
### the tree refutes is a STOP-and-report, not a re-ruling)

The ten questions above stand as posed — nothing is deleted. Each ruling
below is the chair's answer to the like-numbered question — except CR-FP-12,
which answers no question and instead rules on the SCOPE of the already-ruled
CQ2, and is marked as such where it sits. All are rowed in
docs/FABLE_VALIDATION_QUEUE.md at this fold commit. Transcription note: bare
symbol names gained code spans and transport-stripped possessive apostrophes
were restored; no word was added, removed, softened, or extended.

**CR-FP-3 (Q1, posture-read naming) — RULED.** ACCEPT the synthesis
recommendation — keep `postureOf`; rename ONLY the colliding second export to
`courtRiskAppetiteOf` at SP-C's module; one-row constitution erratum;
import-source pin set + both-site headers land regardless of arm.

**CR-FP-4 (Q3, IN-0a envelope transport) — RULED.** ACCEPT — primary road:
each consumer reads the PRIOR tick's applied `brokerage_plant` events at its
own head (zero new keys, zero kernel edits, law-M one-week lag);
VERIFY-AT-BUILD the metadata retention; fallback = the `pendingPlants`
conditional deposit under the D-3 contract; both fail = STOP for a
chair-signed kernel seam.

**CR-FP-5 (Q4, J-INT-13 pre-recording) — RULED.** ACCEPT — pre-record the
DARK arm now in FABLE_VALIDATION_QUEUE.md (lit-kind pools ship behind a
prose-version flag; every existing golden byte-identical); the owner may
later take the re-record arm with the WR-0b field-level diff.

**CR-FP-6 (Q6, arrivals feeding mass_migration) — RULED.** ACCEPT NO —
deliberately deferred beside J-POP-14; ONE owner ruling covers both
arrival-side couplings; this goes on the owner queue, not into any wave.

**CR-FP-7 (Q7, D-W3 formal close) — RULED.** COUNTERSIGN the cap-raise arm —
the trim arm is forbidden by the spine floor law (measured: five puts all
four kinds below their own SP-6 floor); walkers read floors from
significance; SP-E's shared helper retires the fixed-five class. D-W3 is
formally CLOSED.

**CR-FP-8 (Q8, sale door vs one-instrument law) — RULED.** ACCEPT — not in
this build; GR-2 pins the refusal UNCHANGED (fenced baseline); harmonization
recorded as a post-GR-2 candidate owned jointly with the war chair.

**CR-FP-9 (Q9, applyWorldPulse second storageMonths fold) — RULED.**
PRE-RULED REPORTED-NOT-DEFECT — the banked file's own treaty fold; TR-4
routes zero traffic through it; the sixth-writer scan fences it; the queue
row is filed at the fold so the lane never stalls.

**CR-FP-10 (Q10, errand ledger address) — RULED.** CONFIRM keep-in-place —
SP-D generalizes `worldState.envoyErrands` IN PLACE; the migration arm is
DECLINED (owner-gated persistence churn on a live save shape, zero
behavioral payoff); the constitution owes the erratum row.

**CR-FP-12 (NOT a question answer — a ruling on Q2's SCOPE, raised at this
fold) — RULED.** ES-0's early MOTION is **DECLINED**; the CQ2 authorized set
stays EXACTLY GR-0 + GR-1 + TR-1 + TR-9-contract and this fold does not widen
it. ES-0 is early-ELIGIBLE — that is a measured fact about the wave (pure
leaves, no flag) and §5/§9 record it as such — but eligibility is a
measurement and CQ2 membership is an authorization, and only the chair grants
the second. The reason the two part here: ES-0 EDITS TWO LIVE WAR-LANE FILES
(`warSeatBooks.js` retiring its private `lawfulnessBand` to the new
`lawWordFor`; `warMagicGate.js` re-exporting the neutral `magicWorksAt` lift),
and the CR-ES-3 retarget those edits carry is a CROSS-FILE war-lane VOCABULARY
change with declared golden-shift exposure. CQ2's four members share the
opposite profile — pure density, zero foreign-lane collision. ES-0 sits early
in cycle 2 under strict order regardless, so the decline costs no real motion.
One owner clause admits ES-0 to CQ2 if the owner reads the collision risk
differently.

**STANDING — ruled earlier this era, recorded here, NOT re-opened.**
CR-FP-1: the desk-agreement seam is authority-routed (LANDED at commit
`79bceff5`). CR-FP-2: the proseNumerics re-record is instrument
reconciliation, not drift (LANDED at `f786df89`). CR-FP-11:
the cross-layer inclusion ratchet reaches the modules no family claimed
(ruled and LANDED this era at commit `1137f935` — recorded here so the jump
from CR-FP-10 to CR-FP-12 reads as a taken number, never a dropped ruling).
CQ2 (Q2): early motion authorized for GR-0 + GR-1 + TR-1 + TR-9-contract —
**exactly those four; CR-FP-12 above declined widening it to ES-0.** CQ5
(Q5): the flag one-commit law is affirmed; the five WR flags are recorded as
pre-manifest history, not doctrine.

**THE WAYFARE CHAIR TRANSLATION (seam-1 contract, binding on WY-8 slice
8a).** Low supply drags the army's OWN `accumulatedAttrition`, never the
realm's `warExhaustion` — the three-exhaustions labeling IS the contract (the
army's wear is "condition", the realm's is "the home front", the road's is
"march fatigue"). The owner's one-clause veto surface is the WY-8a ledger
row.

**⚠ FLAGGED — CR-ES-2 AMENDS THE HEADER OF AN OWNER RULING.** The espionage
volume's CR-ES-2 (docs/DESIGN_FP_ARCH_ES.md §7) amends the anonymity /
no-fates header of the owner ruling of 2026-07-19, preserving its core (the
engine still never executes, permanently turns, or ends a named character)
while admitting capture/hold/ransom/release, which the owner's own espionage
directive requires. The BY-THE-ENGINE qualifier is LOAD-BEARING and must
survive every edit — FOREIGN_GUEST_HOLD_CLOSE_REASONS already contains death,
so an unqualified no-fates clause would outlaw the war lane's authored
closes. ONE OWNER CLAUSE RESTORES THE OLD HEADER.

**OWNER-GATED — RECORDED, PARKED, NEVER BUILT BY THIS FOLD.** The F9
`supplyCargo` sign-off row (no build until the owner signs it); the ES Q5
alliance-topology ACQUIRE (PARKED — ship without it; the pairwise
allianceLabel REFUTE covers the drama; the new persisted key family goes to
the owner as a one-line future-widening row, and no surface is ever smuggled
into the SP-B family); the WAR-CHOOSER spy wiring (settlementStrategy, frozen
surface — DEFERRED to a future owner ruling, owner queue row; this program
wires the sovereignty buyer, GR-2 pact answers, and its own cadence only);
the Q6 / J-POP-14 arrival couplings; and every tuning band (raw-authored
until owner-signed, per THE PROMISE).

---

*Compiled read-only. Inputs: docs/DESIGN_FP_ARCH_{SP,GR,IN,TR,WF,POP,INT,CW}.md
+ docs/DESIGN_FP_ARCH_CENSUS.md (this directory), and — folded 2026-08-05 —
the two owner-amendment volumes docs/DESIGN_FP_ARCH_ES.md (ESPIONAGE) and
docs/DESIGN_FP_ARCH_WY.md (WAYFARE), each normative where this volume
compresses it. 45 refuted premises bound, 75 waves ordered, 52 flags
manifested, 8 new sub-ledgers priced, 66 seams pinned (45 here, ES 46-58, WY
59-66 — per-row in the two volumes). Where this volume compresses, the
program files govern; where any document disagrees with the tree, the tree
wins and the disagreement is reported. Nothing is scheduled until the owner
sequences it.*
