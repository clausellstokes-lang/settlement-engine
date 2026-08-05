# CW-ARCHITECTURE — THE COUPLING CROSS-WIRES, COMPILED IMPLEMENTATION LAYER

## CW program architect, 2026-08-04. Measured against the live tree at
## claude/composite-r4 @ e564e135 (worktree minifold). This file COMPILES
## DESIGN_FP_COUPLINGS.md §6 (CW-0..CW-3 — the only machinery the coupling
## volume builds; the per-pair couplings land in their owning volumes' waves)
## into the war-volume build idiom (DESIGN_WAR_RULINGS_ARCHITECTURE.md is the
## format precedent; its §10 implementer protocol binds verbatim). Where this
## file and the volume conflict, the volume wins and the conflict is a bug to
## report — EXCEPT where §1 below REFUTES a volume premise by execution, in
## which case the refutation is binding on the wave and reported to the chair.
## Every substrate premise was RE-MEASURED by grep/read on this date; LIVE CODE
## OUTRANKS EVERY TABLE IN THIS FILE. Judgments are labeled JUDGMENT and are
## vetoable by the chair or the owner.

**Status: IMPLEMENTATION ARCHITECTURE. Sequencing per SOL_QUEUE.md row 18
(verified at docs/SOL_QUEUE.md:72-75): CW-1 → CW-2 → CW-3 land LAST; CW-0 does
NOT wait — it landed EARLY with WR-3 and grows under the same-commit
obligation. This file therefore splits CW-0 into what is BUILT (the registry)
and what is OWED (the walkers — §1a S3 finds them absent), and re-scopes CW-2
onto the cause-walk estate that landed after the volume was drafted (§1b S9).
Everything ships DARK; no flag lights, no soak runs, no band ratifies outside
the owner-signed schedule.**

---

## §1 SUBSTRATE CLAIMS — every existing-code premise the CW waves lean on,
## re-measured 2026-08-04

Verdicts: **VERIFIED** (receipt quoted from the live tree) · **VERIFIED/MOVED**
(mechanism confirmed; the volume's line address rotted — navigate by SYMBOL,
never by the doc's line number; the hand-keyed-line-address-rot hazard) ·
**REFUTED** (the premise as stated is wrong; the correction is binding).

The refuted premises are the most valuable rows in this file. Three were found.

### 1a The registry estate (CW-0's ground truth)

| # | Claim | Live receipt | Verdict |
|---|---|---|---|
| S1 | CW-0's registry is BUILT and growing: pure data + pure lookup, no state/writer/clock/randomness | `src/domain/certification/couplingRegistry.js` (575 lines): `COUPLING_REGISTRY_SCHEMA_VERSION = 2` at :13; header states "Pure data plus pure lookup only"; 26 frozen rows — WR-3 (1) + WR-4 (4) + WR-5 (5) + WR-6 (7) + WR-7 (9), composed at `COUPLING_REGISTRY` :532-538; `couplingRowsFor`/`couplingRowFor` fail closed on a shared frozen empty | VERIFIED |
| S2 | Rows land in the SAME commit as their cross-layer read (the §0.3 obligation), starting at WR-3 | `git log -S couplingRegistry` → 526c5e31 "WR-3 LINEAGE CLAIM…"; FABLE_VALIDATION_QUEUE.md:154 records the CW-0 ruling ("WR-3 adds its machine-readable registry row in this commit"); SOL_QUEUE.md:201 chair checkpoint "Any cross-layer read → CW-0 registry row in the SAME commit" | VERIFIED |
| S3 | **The volume's three CW-0 walkers exist ("the registry + walkers … lands EARLY", SOL_QUEUE:73; "walker-enforced", SOL_QUEUE:201)** | `ls tests/lint | grep -iE "coupl|layer|desk"` → ZERO files; the ONLY enforcement is `tests/domain/couplingRegistry.test.js` (358 lines) — a hand-enumerated data-shape test. NO inclusion-ratchet import-graph scan, NO fixture-sampled receipt-field walker, NO desk walker asserting registry-vs-routing agreement exists anywhere in tests/ | **REFUTED** — the same-commit obligation is enforced by review courtesy, not machinery. CW-0w (wave 1) builds the walkers; until it lands, every FP wave's registry row is on the honor system |
| S4 | **The registry can grow across volumes as designed** | `tests/domain/couplingRegistry.test.js:299`: `expect(row.couplingId).toMatch(/^CPL-\d+\.[A-Z_]+\.WR-\d+\.[a-z_]+$/)` — the shape pin hard-codes the **WR-** wave prefix | **REFUTED** — the first non-WAR registry row (TR-*, GR-*, WF-*, POP-*, IN-*, INT-*, SP-*) REDS the shape test. The growth path the whole program depends on is blocked at the pin. CW-0w widens the regex to the closed volume-prefix alternation; MUST land before the first non-WAR cross-layer wave |
| S5 | Size headroom for growth | couplingRegistry.js = 575 effective; the domain-layer max-lines ceiling is **800** (tests/lint/sizeBaseline.test.js:66-74 `ceilingFor`); a row costs ~18-22 lines with its comment → ~10-12 more rows before the eslint layer rule reds the file. The seven volumes' ADDS will exceed that severalfold | VERIFIED (measurement) — §4 CW-0w pre-plans the per-volume leaf split per the WR-7b decomposition recipe, BEFORE the ceiling forces it mid-wave |
| S6 | The certification family already binds the registry into subsystem censuses | `src/domain/certification/subsystemRowsWar.js` (771 lines) lists couplingRegistry.js in its module censuses at :536, :618, :656, :705 | VERIFIED — CW-3's aliveness rows extend an existing idiom (the subsystemRows* family), not a new invention. Note 771/800: the coupling rows go in a NEW sibling file, never into this one |

### 1b The provenance / cause-walk estate (CW-2's ground truth — the biggest finding)

| # | Claim | Live receipt | Verdict |
|---|---|---|---|
| S7 | A durable, recorded (not reconstructed) cause-edge ledger exists with a single writer | `src/domain/worldPulse/provenanceKernel.js` (511 lines) — "THE PROVENANCE LEDGER writer (engine finale #1)", owner commission task #32. Records, at the single durable-write seam (appendPulseHistory), `{ [receiptId]: { parents, type, tick } }` from `causedBy` (scalar/array parent seam) + `sourceEventId` (the one-hop edge); mechanical roots add `receiptClass:"mechanical"`; eviction marks `retentionClass:"collapsed_ancestor"`; capped at MAX_PROVENANCE_EDGES sized to pulseHistory's MAX_HISTORY=80; NO prose, NO PII. Home: `worldState.spatialLedgers.provenance` (conditional-ledger family, self-drops when empty) | VERIFIED |
| S8 | Its flag is virtual and ALREADY in the lit cohort | `provenanceLedgerEnabled` in the ONE_REGEN preset-override spread, `src/domain/worldPulse/simulationRules.js:271` (block :258-279 — the eight chartered dark engines + roads, lit together at the single declared golden boundary; VIRTUAL, `=== true` reads, zero persisted flag bytes) | VERIFIED |
| S9 | **The volume's CW-2 premise: "a read-only DM surface over persisted receipts" is to be BUILT (greenfield; walks sourceEventId / causes[] / registry receiptFields)** | The surface EXISTS: `src/domain/display/causeWalk.js` (306 lines, "THE CAUSE-WALK read model (VISION WAVE V-4)") walks the provenance DAG backward with `seesSecrets` covert redaction (`REDACTED_HOP`, structural `redacted:true`), graceful lines `NO_DEEPER_MEMORY` + `LEDGER_DARK_LINE`, zero-engine-contact; reader `src/domain/display/chronicleGraph.js` (528); UI consumers `src/components/map/CauseWalkPanel.jsx`, `CausalityPopup.jsx`, `HeraldHeadline.jsx`; the information-integrity register (CLEAN / WORN IN THE TELLING / PLANTED / PLANTED-THEN-WORN / UNKNOWN, the seed-not-growth law) in `src/domain/display/heraldIntegrity.js` (288) | **REFUTED** — the V-4 estate landed after the volume's 2026-08-02 drafting and the volume never cites it. Building the volume's CW-2 as written would erect a SECOND cause-walk — the second-telephone defect (J-CPL-11's shape pointed at ourselves). CW-2 is RE-SCOPED to an extension program (§4 CW-2x; chair question Q1) |
| S10 | A forward prose realization over walks exists | `src/domain/display/discourseKernel.js` (486, "TRANCHE 3c: THE DISCOURSE KERNEL") — deterministic finite-lexicon connective realization over a resolved cause-walk, "multi-hop via E-J-v2's causedBy edges"; headlines carried byte-verbatim; clause.text = connective + ' ' + recorded (walker-provable anti-embellishment) | VERIFIED — CW-1's braid body REUSES this kernel; it never builds a second prose writer |
| S11 | causedBy adoption breadth (what chains exist to braid/walk) | `grep -rl causedBy src/domain` → 6 files; engine-side writers: provenanceKernel.js + roadsKernel.js ONLY (rest are display readers). `sourceEventId` breadth: 65 files | VERIFIED (measurement) — **cross-layer chains of depth ≥3 essentially cannot exist yet**; the multi-hop seam is built but only ONE kernel feeds it. CW-1's depth-≥3 detection and CW-3's chain-depth envelopes are vacuous until the FP volumes adopt causedBy at their mint sites — seam contract SC-6, and the reason CW-1/CW-2x/CW-3 sequence LAST |
| S12 | Retention rings the walk must be honest about | pulseHistory: `MAX_HISTORY = 80` (`src/domain/worldPulse/worldState.js:16`, applied :518, :665) VERIFIED. wizardNews 240: referenced as "MAX_ENTRIES (240)" in `src/domain/worldPulse/believedRazings.js:39`; the constant's own home did not surface under this spelling sweep — VERIFY-AT-BUILD. turningPoints 24: VERIFY-AT-BUILD (not re-measured) | VERIFIED (pulseHistory) / VERIFY-AT-BUILD (the other two rings) |

### 1c The Herald composition estate (CW-1's ground truth)

| # | Claim | Live receipt | Verdict |
|---|---|---|---|
| S13 | Desk routing is single-home and content-typed; belief_misjudgment sits at the faith desk pending IN-5 | `src/domain/realm/heraldRouting.js` (525): `EXACT_SECTION` at :81, SECTION_OF single-home law in header :18; `belief_misjudgment: 'faith'` at **:134** (volume said :118 — rotted); `grep -n knowledge heraldRouting.js` → ZERO hits: **the knowledge desk does not exist; IN-5 has not landed** | VERIFIED/MOVED — the desk walker (CW-0w) asserts registry-vs-routing AGREEMENT over CURRENT desks and never pins the pre-refile seat (J-CPL-10's precedence, honored); today's 26 rows carry desks {adjudication 10, war 6, trade 5, events 4, divination 1} and the WR-10 comment at :140 records that SECTION_OF and the governed registry's desks agree |
| S14 | An engine-side pacing governor exists and CW-1 must not duplicate it | `src/domain/worldPulse/narrativeTempo.js` (511, "E0, THE NARRATIVE TEMPO GOVERNOR"): "THE ONE LAW: throttle SPONTANEITY, never CAUSALITY… a receipted consequence chain is never censored"; gates independent arc BIRTHS only, deterministic, dormant-default | VERIFIED — the engine/display split J-CPL-4 demands already exists structurally. CW-1 is display-side composition ONLY; its census pin proves cascadeBraid imports no engine writer |
| S15 | The significance vocabulary CW-1's braid derivation needs | Today TWO-valued: `'major'|'notable'` (`src/domain/display/chroniclersLetter.js:164, :287`; `src/domain/display/settlementRumors.js:634`). The three-band `routine/notable/major` family is MINTED AT SP-6a (DESIGN_FP_SPINE.md ~:220, ruling R5: "significance/severity band FAMILIES are minted HERE… assign each news KIND a class in the wave that mints it") | VERIFIED — **CW-1 is BLOCKED on SP-6a** for its braid-class derivation and damping target ('routine' does not exist yet) |
| S16 | The Herald index landed and its wiring is declared to ride CW-1 | `src/domain/display/heraldIndex.js` (313, "SP-6's THE HERALD INDEX amendment, owner order 2026-08-03"): typed-ref facets, PENDING facets await mint-time entity-ref slots, includeCovert fail-closed; SOL_QUEUE.md:182 "Wiring rides CW-1 (the braid) + the Herald composers" | VERIFIED — a POST-volume obligation: the braided item must carry typed entity-ref slots so search sees it (the volume, drafted 08-02, predates this) |
| S17 | The causal voice pulls walks; pacing reads headlines only | `src/domain/display/heraldCausalVoice.js` (643): header :16 "PULL, NEVER PUSH: the pacing governor reads headlines only"; registers heraldHeadlineRegister/:369, heraldSubheaderRegister/:419, heraldTellingRegister/:488 take `walk` + `seesSecrets`; display pacing floor exists (`src/domain/display/rumorHeraldLink.js:8,:101`) | VERIFIED |

### 1d The measure estate (CW-3's ground truth)

| # | Claim | Live receipt | Verdict |
|---|---|---|---|
| S18 | The differential harness is the certification estate's own named gap | `src/domain/certification/subsystemRowsRegen.js:61` (volume said :59 — rotted): "THE HONEST GAP… What would close the gap is a PAIRED run… two soaks on one seed, one with the flag lit and one dark, compared over the new per-year beliefDivergence series (BELIEF_DIVERGENCE_RECEIPT_PATH). Half of that instrument now exists; the differential harness does not" | VERIFIED/MOVED — CW-3's harness has a named, waiting first consumer: closing that row's UNOBSERVED verdict is its guard-the-guard proof |
| S19 | The hop-count theorem is measured (CW-3's aliveness-floor precedent for evidence-grade claims) | `src/domain/worldPulse/brokerageStamps.js` header table: hop 0 core 1.000 → hop 4 core 0.465 (n per hop quoted in-file) | VERIFIED — the volume's "1.000→0.465" is exact |
| S20 | Exaggeration is the carrier's (J-CPL-11's substrate) | `src/domain/spatial/rumorNetwork.js` — `degradeTelling` export at :473 (doc range :472-507 ≈ holds): bounded structural mutations, 30% magnitude band drift ±1, 12% name swap ONLY to a real settlement id from the frozen digest | VERIFIED |
| S21 | The misjudgment/schism reads the stories lean on | `detectMisjudgment` now at `src/domain/worldPulse/beliefMap.js:1468` (doc: 1362-1457); `council_schism` minted at `src/domain/worldPulse/pulseKernel.js:597-621` (doc: 564-591). Both files also MOVED homes vs the doc's spellings (worldPulse/, not spatial/) | VERIFIED/MOVED — navigate by symbol |

### 1e Cross-cutting hazard claims (CW-0w's scope items)

| # | Claim | Live receipt | Verdict |
|---|---|---|---|
| S22 | The prose-numerics push-indirection escape is LIVE | `src/domain/worldPulse/relationshipMemory.js:296-303` (`postureReasons`, doc said :300-302): `out.push(\`High resentment (${relState.resentment.toFixed(2)}) shapes the posture.\`)` + two siblings — raw floats into reader prose; `grep relationshipMemory tests/lint/.prose-numerics-baseline.json` → ZERO: the file is NOT frozen debt, it ESCAPES the scanner entirely (the walker covers authored templates; the baseline holds 401 reviewed instances in 4 detector classes, `tests/lint/proseNumerics.test.js:21-27`) | VERIFIED — CW-0w's fourth-detector extension has a live, receipted target |
| S23 | Flag machinery CW-1's law-2 shape rides | `ENGINE_GATED_VIRTUAL_RULE_KEYS` at `src/domain/worldPulse/simulationRules.js:185`; its one-key-delta walker exists (`tests/lint/engineGatedRuleKeys.walker.test.js`); `tests/lint/mutationCoverageManifest.test.js` exists | VERIFIED |
| S24 | CW sequencing as briefed | SOL_QUEUE.md:72-75 (CW-1→CW-2→CW-3 LAST; CW-0 early, growing, "the walker asserts" the same-commit obligation) | VERIFIED as INTENT; see S3 for the enforcement gap |

**Tally: 21 VERIFIED (5 of them MOVED — quote no line number from the volume
without re-grepping), 3 REFUTED (S3 walkers absent, S4 growth-path regex
block, S9 CW-2 greenfield premise). Every wave below binds the refutations.**

---

## §2 THE FLAG FAMILY (law-2 shape + manifest timing)

ONE flag. The program's other three waves are instrument- or read-side and
declare flaglessness per the WR-9 precedent (stated, not omitted).

| Flag | Wave | Shape | Manifest timing |
|---|---|---|---|
| `cascadeGovernorEnabled` | CW-1 | VIRTUAL: ABSENT from DEFAULT_SIMULATION_RULES; every gate reads `=== true`; dark-never-permissive; read by NAME at the composition seam (one by-name read lands even if a list-driven gate also exists — the conjunction-gate hole, L2) | Joins ENGINE_GATED_VIRTUAL_RULE_KEYS (simulationRules.js:185) in the SAME commit as its first real gate read; engineGatedRuleKeys walker asserts exactly that one-key delta |

Four-fence dormancy set for `cascadeGovernorEnabled` (all four + the
lit-mutant control proving the fences see):
1. **Own-footprint golden** — flag absent ⇒ the composed Herald feed is
   byte-identical to pre-CW-1 (display-side dormancy: same items, same order,
   same prose).
2. **Absent-vs-false differential** — `undefined` and `false` produce
   identical composition (strict `=== true`).
3. **Call-path spy** — the braid detector is never invoked dark (spy on the
   cascadeBraid entry export).
4. **Gate-polarity census** — every read site of the flag name is `=== true`
   (source scan over the module set, not filenames — the
   filename-anchored-pin vacuity law).
Lit-mutant control: force the flag on over the braid fixture; fences 1 and 3
must trip — proving the dormancy set is not vacuous.

NOT flags of this program (declared): `provenanceLedgerEnabled` (S8 — exists,
ONE_REGEN cohort, owned by the engine-finale program; CW-2x READS the ledger
and never touches the flag's cohort membership); the per-coupling flags in
registry rows (owned by their volumes; CW-3's differential harness ENUMERATES
them from the registry, never declares them).

---

## §3 CANONICAL MODEL — the L4 fight, won outright: ZERO new persisted keys

This program persists NOTHING. That is not luck; it is the volume's own design
(§6: registry = source data; governor = display composition; walk = pure read;
measure = soak-side) and this file keeps it. **newPersistedKeys = [] — any CW
implementation slice that finds itself writing worldState has left its spec
and STOPs.**

Per-wave lifecycle clauses (L4 discharged; each wave's spec restates its own):

- **CW-0w (registry + walkers):** source-tree data only. Create = authored
  rows in couplingRegistry*.js; read = `couplingRowsFor`; persist = NONE
  (nothing in saves); regenerate = N/A; undo = N/A; migrate = N/A; veil = N/A
  (no payloads). The registry is evidence, not runtime state — rows are frozen
  at module load.
- **CW-1 (cascade braid):** derived at Herald composition, per view. Create =
  composition-time braid over already-persisted receipts + provenance edges;
  read = the Herald feed; persist = NONE — the braided item is a VIEW ITEM in
  the rumorHeraldLink idiom, carrying receipt DISCIPLINE (deterministic id
  derived from member receipt ids codepoint-ordered, full address chain,
  typed action `cascade`, reasons) without pulseRecord membership (chair
  question Q4; JUDGMENT below); regenerate-under-THE-PROMISE = trivially
  byte-stable (pure function of persisted state + bands); undo = follows the
  underlying receipts; migrate = none; veil = audience projection at
  composition (covert members truncate for players — J-CPL-5's shape via the
  causeWalk redaction states, S9).
- **CW-2x (cause-walk extension):** pure read over `spatialLedgers.provenance`
  + pulseHistory + registry data. No writes anywhere. Veil = the existing
  seesSecrets redaction (S9), extended to the new join surfaces, byte-identical
  truncation pinned.
- **CW-3 (the measure):** soak-side artifacts under scripts/audit output
  conventions — never worldState, never saves. Lifecycle: receipts only, in
  the WR-9 sense.

JUDGMENT (vetoable): the volume's CW-1 text calls the braided item "itself a
receipt (id-carrying…)" while also ruling "Lifecycle: display-side; no save
state". These are reconciled as VIEW-ITEM-WITH-RECEIPT-DISCIPLINE: the braid
carries id + address chain + typed action + reasons so the Herald/index/walk
treat it as first-class, but it is derived, never persisted — the
id-less-news-drop hazard (volume §1c) does not bite because the id is minted
deterministically at composition, and THE PROMISE cannot be bitten because
nothing lands in the save. Persisting braids would be the first new key of a
program that needs none.

---

## §4 THE WAVES (dependency order; one commit per wave unless sliced; focused
## gates per slice, full gate at wave end, ledger row; DARK per §2; the war
## volume's §10 implementer protocol binds verbatim)

### CW-0w — THE WALKERS THE REGISTRY IS OWED (no flag; structural prevention;
### buildable NOW and sequenced FIRST — S3/S4 make it urgent)

**Why now:** S3 — every FP wave that lands before the inclusion walker exists
adds cross-layer reads on the honor system; S4 — the FIRST non-WAR registry
row reds `tests/domain/couplingRegistry.test.js:299` as written, so this wave
is a hard precondition of TR-1/GR-2/whichever non-war cross-layer wave lands
first. Report to the chair: SOL_QUEUE row 18's "the walker asserts" is
aspirational until this lands.

**Slice 1 — the growth unblock + the leaf split (one commit):**
- `tests/domain/couplingRegistry.test.js` (358): widen :299 to the CLOSED
  volume-prefix alternation
  `/^CPL-\d+\.[A-Z_]+\.(WR|TR|GR|WF|POP|IN|INT|SP|CW)-\d+[a-z]?\.[a-z_]+$/`
  (still a closed set — a NEW volume prefix must touch this line; that closure
  is seam SC-7's tripwire). Add a synthetic-row shape case proving a TR-
  prefixed id passes and an unlisted prefix fails (anchored negative).
- Pre-plan the size ceiling (S5): split `couplingRegistry.js` (575) into
  `couplingRegistryWar.js` (the 26 rows + comments, verbatim moves) with
  couplingRegistry.js as the head (schema, couplingRow, composition, lookups;
  ~120 lines after the split) re-exporting every row constant so NO consumer
  import path moves (subsystemRowsWar.js:536 et al. name the head file in
  module censuses — those census strings gain the leaf path in the same
  commit). Behavior identity per the WR-7b recipe: stripped-declaration map
  equality, all exports preserved at the head. Future volumes add
  `couplingRegistry<Volume>.js` leaves (~one per volume, each far under 800).
**Slice 2 — the inclusion ratchet (one commit):**
- NEW `tests/lint/couplingInclusion.walker.test.js` (budget ~260): an
  import-graph scan over the seven layers' module families (the layer→module
  map is a frozen in-walker table, module SETS not filenames). A CROSS-LAYER
  STATIC IMPORT not present in the frozen BASELINE inventory and not covered
  by a registry row REDS.
- JUDGMENT (vetoable — an implementation-grade correction to the volume's §6):
  the ratchet is BASELINE-FROZEN + shrink-only, not greenfield-clean. The
  volume's own §4 documents dozens of LIVE pre-program cross-layer reads
  (EXISTS blocks) that will never get rows retroactively — rows are never
  pre-registered and the registry enumerates DESIGNED couplings (§6 scope).
  A clean scan would red hundreds of legacy edges on day one and be deleted
  by Friday. The baseline freezes today's cross-layer import inventory by
  (importing-module, imported-module) pair identity in
  `tests/lint/.coupling-inclusion-baseline.json`; NEW pairs require a registry
  row; the baseline only shrinks. Declared-empty directions stay enforced as
  the ABSENCE of rows (J-CPL-2 honored — no forbidden-list anywhere).
- Positive control (guard-the-guard, the K3 idiom): the scan FINDS a known
  registered cross-layer read (warCosts' trade read, S1's WR-4 row) — proving
  the detector sees before trusting what it does not flag.
- Executed mutants (cp backup → mutate → red → cmp-exact restore, NEVER
  checkout-family): (a) plant an unregistered cross-layer import into a real
  layer module → walker reds; (b) delete a baseline entry whose import still
  exists → walker reds (shrink-only proven live). Both rows enter
  mutationCoverageManifest.
- **CR-FP-11 AMENDMENT (the reach repair, 2026-08-05) — WHAT THE INCLUSION**
  **WALKER CANNOT CATCH.** This clause exists because the first gap was found
  by a cycle-close verifier rather than by the design: it was never written
  down, so nobody could look for it. The gap: the layer map is a table of
  family PREFIXES, and `scanCrossLayerPairs` iterated only layered modules as
  importers while `continue`-ing on any dependency with no layer. A module
  matching NO pattern was therefore invisible on BOTH sides — unscannable, not
  merely unclassified. Nine of the ten leaves FP cycle 1 landed matched
  nothing (the four `commercial*`, `oathHolder`, `grammarNews`,
  `grammarReceiptPools`, `bandFamilies`, `bandedStock`); MEASURED matched pair:
  an unregistered `warCosts` read appended to `commercialReasons.js` left the
  walker green 7/7, while the identical import in the layered
  `treatyLifecycleVoice.js` reds by name. Repaired in two arms — (A) the table
  gains the `commercial*`, `grammar*` and `oath*` families, floors re-measured
  to the live family sizes, and the two SP substrate leaves join the argued
  exclusions beside the four infrastructure hosts (each with a written reason
  and a still-has-no-layer assertion); (B) an UNLAYERED-MODULE CENSUS makes the
  blind spot itself countable — every module under `src/domain/worldPulse` or
  `src/domain/spatial` is layered, argued, or frozen in
  `tests/lint/.coupling-unlayered-baseline.json` (179 at landing, shrink-only),
  so a new unlayered leaf REDS instead of disappearing. An inventory that grows
  only by pattern will always trail an estate that grows by file; arm B is what
  removes the habitat rather than the instance.
- **THE STANDING CANNOT-CATCH LIST** (kept here and in the walker header, so
  the next gap is documented before it is discovered): DYNAMIC imports
  (`await import()` — the scan reads static `from '…'` only); RE-EXPORT
  LAUNDERING (A→B→C names two pairs and never the A→C coupling when B is
  same-layer); NON-IMPORT COUPLING (reading a foreign key off `worldState`
  needs no import — the registry's receipt addresses cover that, not this
  scan); and ANYTHING OUTSIDE THE CENSUS SCOPE (a layer leaf landing in a third
  directory is unclaimed and uncounted until the scope widens).
- **OWED ROWS, FROZEN NOT LAUNDERED (chair ruling owed).** Widening the table
  revealed two program-era cross-layer reads that landed with no registry row
  because the importer was invisible: `commercialReasons.js` →
  `relationshipState.js` (INTERIOR→TRADE, TR-1) and `oathHolder.js` →
  `npcLadderState.js` (INTERIOR→GRAMMAR, GR-1). They are held in the walker's
  `REACH_OWED_ROWS` register — exact and shrink-only, reddening the moment
  either gains a row — rather than dropped into the legacy pair baseline,
  which is reserved for the volume's §4 pre-program EXISTS blocks; baselining
  a program-era violation would launder it into permanent invisibility. Minting
  the rows is a chair declaration (direction/desk/flags/receipt address, plus a
  `couplingRegistryGrammar.js` leaf that does not exist yet and a widening of
  the `owningVolume` exact-set pin), so this lane measured and froze it instead
  of improvising it.
**Slice 3 — the desk walker + the receipt-field helper (one commit):**
- Schema v3 (JUDGMENT, vetoable; chair question Q3): rows gain OPTIONAL frozen
  `kinds[]` naming the Herald kinds the coupling mints (rows with no minted
  kinds omit the field — absent, never empty, the T4 discipline applied to
  source data). NEW `tests/lint/couplingDesk.walker.test.js` (~140): for every
  row carrying kinds, `SECTION_OF(kind) === row.intendedDesk`
  (heraldRouting.js:81's EXACT_SECTION + the function tail), with a NON-EMPTY
  floor (≥ the WR-7/WR-10 kind count at landing — the vacuous-absence law).
  PRECEDENCE STATED IN-FILE per J-CPL-10: IN-5 owns the belief_misjudgment
  refile and the no-word-association assertion; this walker asserts AGREEMENT
  and must never pin the pre-refile desk — when IN-5 flips heraldRouting:134,
  IN-5's commit updates the registry row's intendedDesk in the same change
  (the same-commit obligation covers desk moves), and this walker stays green
  through the flip by construction.
- **CR-FP-1 AMENDMENT (chair ruling, executed 2026-08-05) — THE DESK RULE IS**
  **AUTHORITY-OR-TOKEN, NOT TOKEN-OUTPUT.** As landed, the walker's own header
  recorded that the specced rule ("every row's kinds route to intendedDesk" via
  SECTION_OF) was MEASURED FALSE for 7 of the 12 kind-carrying rows, while TEN
  rows carried `intendedDesk: 'adjudication'` — a desk SECTION_OF can never
  return. RULED: a rule falsified 7-of-12 is the wrong premise, not a rule with
  exceptions. Adjudication is an AUTHORITY-ROUTED desk — the
  `sovereignty_registry` precedent generalized: `heraldSectionOfRecord` honours
  a governed `section` on any record carrying one of four closed
  `sectionAuthority` values (war_rulings, war_coalition, envoy, sovereignty),
  and files by token only as its last step. EXECUTED: schema v4 adds the
  optional `deskAuthority`; the seven falsified rows name theirs
  (`war_coalition_registry` ×2, `envoy_registry` ×5); the walker's rule becomes
  "the desk must be reachable by the kind's explicit token route OR by the
  governed kind registry of the authority the row names". The join is per-KIND,
  not per-word — naming an authority that does not govern the kind buys nothing.
  RESULT, measured: 9 pairs agree by token, 7 by authority, and the disputed
  register shrinks 11 → 4 by a ruling rather than an edit to either side. The
  four survivors are genuine row-vs-projector splits with no structural excuse
  (WR-6.coalition_settlement/coalition_apportionment,
  WR-6.pairwise_settlement/coalition_spoils_divided, and
  WR-7.envoy_encounter's envoy_parlaying + envoy_held) and stay frozen and
  shrink-only. The walker also gains THE FORBID: a row may not claim a desk
  neither path can reach, with executed negative controls (unreachable desk
  refused, wrong-authority refused, no-authority-adjudication refused, and the
  reachable twins admitted so the refusals are not a predicate that says no to
  everything).
- NEW `tests/helpers/couplingReceiptSample.js` (~90): the shared
  receipt-field sampler — boots a REAL writer under locally-lit flags, walks a
  row's receiptField path expression against emitted receipts, seeded
  non-empty. CW-0w lands the helper + the WAR-volume sample over the 26 rows
  (reusing the war suites' fixtures); each LATER volume's convergence wave
  (TR-9, GR-7, …) samples its OWN rows through this helper — the
  per-volume distribution is chair question Q3's second half, recommended
  and specced here (SC-9).
**Slice 4 — the prose-numerics push-indirection extension (one commit):**
- Extend `tests/helpers/proseNumericsWalk.js` (719) with the fifth detector:
  template-literal float/`.toFixed(`/percent tokens inside `<array>.push(...)`
  where the array feeds a prose-named return or a return consumed by a
  prose-named export (S22's exact shape). New category ceiling in
  `.prose-numerics-baseline.json`; freeze current offenders (relationshipMemory
  postureReasons among them — the walk found it, the baseline names it,
  shrink-only banks every future fix). Executed mutant: a planted pushed float
  in a scratch copy reds; the baseline path prints on failure.
**Pins summary:** positive control; the prefix-closure pair (pass/fail);
walker mutants ×3; non-empty desk floor; helper's seeded-non-empty assertion.
**Spine req 13 (Alignment):** declared-empty WITH REASON — gate-time
instruments mint no receipts and touch no engagement surface. **Spine req 14
(edit-verb story):** none — no DM-editable surface exists in this wave;
declared, not omitted. **Dormancy proof:** N/A per the WR-9 instrument
precedent (no flag, no engine path, no save bytes) — stated as such.
**Collision map:** tests/lint + tests/domain + tests/helpers + one src
mechanical split (slice 1). Zero overlap with the war lane's open chair items
(WR-10 queue rows untouched); zero overlap with HK/MG/Herald-content lanes
(no display module edited). The ONE src touch (registry split) collides with
any concurrently-landing registry row — pathspec discipline + re-read before
edit (the live-tree law); land slice 1 in a quiet window.

### CW-1 — THE CASCADE GOVERNOR (`cascadeGovernorEnabled`) — BLOCKED on SP-6a
### (S15); starved until upstream causedBy adoption (S11); sequenced LAST-1

**Scope (volume §6 CW-1, bound to the measured tree):** display-side
composition ONLY (J-CPL-4). At Herald composition, detect a CASCADE — N ≥
member-floor receipts inside a closed INTERVAL_WEEKS-denominated window
sharing a causal ANCESTOR by IDENTITY (recorded edges via
chronicleGraph.buildRecordedEdges over `spatialLedgers.provenance`, S7 — never
similarity) whose links cross ≥3 LAYERS (layer of a link = the registry join:
the receipt's kind/desk mapped through the row's pairId — the registry is the
layer authority, S1). Braid: ONE story item at the cascade's top significance
carrying the chain rendered FORWARD through discourseKernel (S10 — reuse,
never a second prose kernel), member beats damped to the SP-6a 'routine' class
WITHOUT losing ids or feed presence (damped, never dropped).

**Files + budgets (measured):**
- NEW `src/domain/display/cascadeBraid.js` (~300 budget): pure leaf —
  detection, ancestor grouping, layer counting, braid assembly (member refs,
  top-class derivation), damping marks. Zero engine imports (census pin — the
  causeWalk zero-engine-contact precedent, S9).
- The composition seam: `src/domain/realm/realmItemReadModel.js` is **1072
  lines — OVER the 800 ceiling and baseline-frozen** (S5's law: hot files at
  ceiling get extraction FIRST or a one-line lazy hook). CW-1 adds AT MOST a
  guarded one-line delegation to the leaf at the composition point; if the
  seam needs more, the wave STOPs and reports for a decomposition slice
  BEFORE proceeding (the LD-ladder lesson). VERIFY-AT-BUILD the exact
  composition chokepoint (realmItemReadModel vs the Herald page composer —
  navigate by the feed-assembly symbol, not this file's guess).
- Braided item: id = deterministic derivation from member receipt ids
  (codepoint-ordered join, existing hash01 only if a hash is needed — ZERO new
  PRNG streams, and in fact zero stochastic choices at all: composition is
  order-determined); full address chain over every member settlement; typed
  action `cascade`; reasons = the chain; typed entity-ref slots so
  heraldIndex facets match it (S16 — the SOL_QUEUE:182 wiring obligation).
**Pins (negative hardest):**
- Two unrelated same-window misfortunes DO NOT braid (identity ancestor join
  — the false-causality negative; fixture seeds two live chains first, then
  proves non-braiding: the vacuous-absence law).
- A 2-layer chain never braids (depth floor); the SAME fixture braided at 3
  layers proves the machinery CAN fire (adjacent-live seeding).
- A `major`-class member is NEVER damped (the significance-floor
  counterforce; the razing inside a cascade still leads the page).
- Damped members remain individually present in the feed with their ids
  (nothing dropped — count identity pre/post braid).
- Dark ⇒ byte-identical composed feed (fence 1); the whole four-fence set +
  lit-mutant control per §2.
- Runtime no-decimal pin on the braided item's rendered prose (L5 — source
  scans cannot see composers).
- The braid names every named actor its member receipts name (address-law
  totality over members).
**Executed mutants:** ancestor-identity → similarity grouping (must red the
false-causality pin); depth floor 3→2 (must red the two-layer pin); damping
that REMOVES a member (must red nothing-dropped). All in
mutationCoverageManifest with anchored negatives.
**Bands (owner-signed at the lit soak, per THE PROMISE):** window length ·
member floor · depth threshold (default ≥3 layers) · member cap · braid-class
derivation (a CLASS within SP-6a's routine/notable/major, per R5 — never a
new scale).
**Spine req 13:** the braid IS an engagement surface — the Alignment line
states its audience projection (player braid truncates covert members
byte-identically; DM braid whole). **Spine req 14:** braids are derived and
never DM-edited; the member receipts' own edit stories are untouched —
declared. **Dormancy:** the four-fence set (§2). **Collision map:** display
modules shared with the Herald content program (herald*, discourseKernel —
READ-only reuse, no edits to those files planned; any needed discourseKernel
change is a STOP-and-report to the content lane's owner); realmItemReadModel
one-liner collides with LD-ladder lanes — coordinate by pathspec; zero war-src
overlap.

### CW-2x — THE CAUSE-WALK EXTENSION (no new flag; the re-scope of the
### volume's CW-2 per S9 — chair question Q1, recommendation: ratify)

**What already satisfies the volume's CW-2 (no work owed):** backward walk
over recorded provenance (causeWalk.js); covert fail-closed with byte-identical
truncation (REDACTED_HOP + whole-walk gating, S9); root/absent-ledger honesty
(NO_DEEPER_MEMORY, LEDGER_DARK_LINE); named actors via the panel's resolvers;
the integrity register (S9/heraldIntegrity); DM/player projection.

**What the volume adds that the estate lacks (the extension, four slices):**
1. **The registry join** — NEW `src/domain/display/causeWalkCouplingJoin.js`
   (~130): from a coupling receiptField on a town-page/Herald surface, resolve
   the receipt id and open the walk there; the registry row (pairId,
   direction, owningVolume) renders as the link's LAYER TAG. causeWalk.js
   (306) gains at most the tag pass-through (headroom fine; prefer the leaf).
2. **Horizon honesty, sharpened** — distinguish the TRUE root
   (NO_DEEPER_MEMORY) from the RETENTION CUT: where the chain leaves the ring
   caps (S12) or hits an evicted/`collapsed_ancestor` edge (S7), render the
   distinct line ("the trail runs past living memory" — the volume's
   phrasing), NEVER a fabricated link. Seeded by aging a fixture past
   MAX_PROVENANCE_EDGES; negative control: the un-aged fixture still shows
   the root line (two lines, two causes, never conflated).
3. **Cross-layer rendering** — layer-crossing count + tags on the walk
   (glance → sentence → table per the LEGIBILITY LAW; the glance is the
   crossing count, the table is the chain).
4. **The acceptance harness** — the six §5 stories are CW-2x's acceptance
   FIXTURES per the volume, but S11 means no story can render end to end
   until its owning waves land. CW-2x lands the HARNESS (a fixture format
   binding story → expected chain shape → owning-wave flag set) + ONE
   synthetic multi-layer chain fixture proving the harness sees; each story's
   real fixture lands with its FINAL owning wave (the per-story wave map is
   the volume's §5, unchanged); CW-3's envelopes measure the story shapes at
   soak. A story harness that cannot fail is refused: the synthetic fixture
   carries a deliberate broken-chain variant that must red.
**Pins:** the player-walk byte-identity truncation EXTENDED over join+tags
(a walk entered through a coupling receiptField leaks nothing more than the
panel walk — same redaction states); horizon line only-where-cut (the paired
fixtures); layer tags derive ONLY from registry rows (no word-association
layer inference — the moverFamilyOf hazard, volume §1c, S13's cousin);
every doc-anchored assertion in the harness asserts its target appears
EXACTLY ONCE (L7's first-match law).
**Spine req 13:** the walk is the program's crown engagement surface — the
Alignment line names it (this wave IS the dossier round-trip for every §4
coupling lacking a dedicated panel, per the volume). **Spine req 14:**
read-only surface; no edit verbs — declared. **Dormancy:** no new flag; the
extension is inert where `spatialLedgers.provenance` is absent (the existing
LEDGER_DARK_LINE arm, already pinned) — restated per the WR-9 precedent.
**Collision map:** causeWalk.js/chronicleGraph.js are the VISION lane's;
CW-2x edits are additive leaves + tag pass-through — re-read both before
editing (live tree); CauseWalkPanel.jsx touch is components-layer (600
ceiling — measure at build).

### CW-3 — THE COUPLING MEASURE (no flag; the program's close; soak-side only;
### builds DARK instruments — RUNNING them is the owner's terminal phase)

**Three instruments (volume §6 CW-3, bound to the measured tree):**
1. **The differential harness** — paired lit/dark same-seed soaks per
   coupling flag family (families ENUMERATED from registry rows' `flags`,
   S1 — never hand-listed), compared over divergence series. FIRST consumer
   and guard-the-guard proof: the distance-priced-news row's named gap
   (subsystemRowsRegen.js:61, S18) — the harness must first show the KNOWN
   divergence (belief lagging ground truth by more at equal distance, lit vs
   dark) before it certifies any unknown coupling. Home: scripts/audit
   (soak-side, mirrors behavioral-observation.mjs conventions).
2. **Aliveness floors** — NEW `src/domain/certification/
   subsystemRowsCoupling.js` (budget ~250; the subsystemRows* family idiom,
   S6; sibling file, never additions to subsystemRowsWar.js at 771/800):
   registry-keyed rows; every registry row must FIRE at or above a banded
   floor in the owner-signed lit soak or it reds as decoration (the WR-9
   endings-mix criterion generalized). Rows for volumes still dark at
   measure time read UNOBSERVED-and-say-why (the S18 row's honest idiom),
   never borrowed-evidence ALIVE — the knowledgeLaneEvidence vacuity lesson
   (S13's neighbor) is the in-tree precedent.
3. **Cascade envelopes** — chain-depth distribution over the lit soak's
   provenance ledger: most chains shallow, some deep, none unbounded (a chain
   still growing at the soak horizon reds); the six §5 story SHAPES each
   observed ≥ once across the seed family (consuming CW-2x's harness
   fixtures); **the degenerate-depth red** — a lit soak whose chains are all
   depth ≤1 means the volumes never adopted causedBy (S11) and the program's
   premise failed: red loudly, name the tripwire `chainDepthDegenerate`
   (seam SC-6).
**Pins:** every envelope carries an executed mutant negative control (the
estate's law — a doctored soak series that should red, does); the harness
proves the known divergence before any unknown (order-asserted);
INTERVAL_WEEKS denomination on measured windows (SP-7's assertion applies to
the SERIES, not the instrument — stated).
**Spine reqs 13/14:** measurement, not news; no engagement, no edit verbs —
declared-empty with reason (the WR-9 wording verbatim). **Dormancy:** no
flag, no engine path, no save bytes — N/A stated. **Collision map:**
certification + scripts/audit only; the owner boundary is LOUD in the wave's
ledger row: CW-3 BUILDS; soak execution, lighting, and band ratification are
the owner/Fable terminal phase (standing directive, 2026-08-02).

**This wave closes the program: the coupling map is DONE when the envelopes
hold on the owner-signed lit soak, and not before (volume §6, binding).**

---

## §5 SEAM CONTRACTS

### 5a Already-pinned seams this program HONORS (tripwires named)

- **SC-1 — the same-commit registry-row obligation** (volume §0.3; spine §5
  reciprocal line; SOL_QUEUE:201 chair checkpoint). CW-0w's inclusion walker
  is what makes it mechanical (S3). Tripwire: the walker red on an
  unregistered new cross-layer import pair.
- **SC-2 — IN-5's desk-refile precedence** (J-CPL-10, closed by adoption;
  J-INF-6/7). The desk walker asserts registry-vs-routing AGREEMENT over
  current desks and never pins the pre-refile seat; heraldRouting.js:134 is
  the flip site; IN-5's commit moves row desks in the same change. Tripwire:
  the desk walker itself — green through the flip or the flip forgot its rows.
- **SC-3 — SP-6a's significance family** (spine R5). CW-1 derives a CLASS
  within routine/notable/major, never a scale; CW-1 is BLOCKED until SP-6a
  lands (S15 — 'routine' does not exist in the tree today). Tripwire: CW-1's
  Bands entry names SP-6a's exported scale; building CW-1 against the
  two-valued vocabulary is a STOP.
- **SC-4 — the engine/display pacing split** (J-CPL-4; narrativeTempo E0,
  S14). CW-1 never imports an engine writer; census pin on cascadeBraid's
  import list. Tripwire: the zero-engine-contact scan (the causeWalk
  precedent, S9).
- **SC-5 — the provenance estate's ownership** (S7-S9: provenanceKernel /
  chronicleGraph / causeWalk are the VISION-lane's landed work; WR-10's four
  chair STOP items and the war queue rows are untouched by every CW wave).
  Tripwire: pathspec discipline + the re-read-before-edit law on shared
  display files.

### 5b Pre-pins this program lands TOWARD its unbuilt neighbors (the TR-5
### pattern: pinned from both sides, with a tripwire)

- **SC-6 — the causedBy adoption contract** (toward EVERY FP volume). Each
  state-writing FP wave that mints a child receipt of a known outcome
  populates `causedBy` at the mint (the provenanceKernel seam, S7) — the
  volume side pins it in its own wave specs; the CW side pre-pins it TWICE:
  CW-1's depth-floor fixtures (a chain must be mintable to braid) and CW-3's
  `chainDepthDegenerate` envelope red (S11). Without adoption, CW-1/CW-2x/
  CW-3 are instruments over an empty sky — the tripwire says so at soak, in
  those words.
- **SC-7 — the couplingId volume-prefix closure** (toward all volumes'
  waves). CW-0w widens the shape pin to the closed nine-prefix alternation
  (S4's cure); any FUTURE volume prefix must amend the closed set — the
  closure IS the tripwire (a new prefix reds until consciously admitted).
- **SC-8 — the braided item's typed entity-refs** (toward SP-6's index,
  landed, and CW-1, unbuilt). heraldIndex PENDING facets light when mint-time
  ref slots land (S16); CW-1's braid carries them at composition; pinned from
  the index side by a facet test sampling a braided item when CW-1 lands
  (SOL_QUEUE:182's wiring note honored). Tripwire: facetAvailability reports
  the braid's refs PENDING→available.
- **SC-9 — the per-volume receipt-field sampling obligation** (toward TR-9,
  GR-7, and every volume's convergence wave). CW-0w lands the shared helper +
  the WAR sample; each convergence wave samples its OWN rows through it
  (central sampling would need every volume's flags lit in one harness — the
  empty-harness vacuity hazard). Tripwire: CW-3's aliveness floor reds any
  row no sampler ever exercised (UNOBSERVED is a named verdict, not a pass).

---

## §6 OPEN CHAIR QUESTIONS (max 4, each with recommendation — all vetoable)

1. **Q1 — ratify the CW-2 re-scope (S9).** The volume's CW-2 as drafted would
   build a second cause-walk beside the landed V-4 estate (causeWalk.js +
   panel + popup + integrity register + discourseKernel). RECOMMENDATION:
   ratify CW-2x (extension: registry join, horizon sharpening, layer tags,
   story harness) and record a one-line correction in the volume's §10
   register via the cohesion agent — the volume's own drafting predates the
   estate's landing, and J-CPL-11's no-second-telephone reasoning applies to
   us with full force.
2. **Q2 — pull CW-0w forward, out of the CW slot.** SOL_QUEUE row 18 holds
   CW-1..3 LAST but CW-0 "does not wait"; S3/S4 show the walkers absent and
   the growth regex WAR-locked. RECOMMENDATION: land CW-0w (all four slices)
   BEFORE the first non-WAR cross-layer wave — slice 1 is a hard blocker for
   that wave's registry row; slices 2-4 close the honor-system gap that
   widens with every landing wave.
3. **Q3 — schema v3's optional `kinds[]` field.** The desk walker needs the
   row→kind join the v2 schema lacks (S13). RECOMMENDATION: adopt the
   optional frozen field (absent-never-empty), with the per-volume
   receipt-field sampling distribution of SC-9; the alternative (deriving
   kinds from receiptField strings) is word-association by another name and
   is refused on the moverFamilyOf precedent.
4. **Q4 — the braided item's standing.** "Itself a receipt" vs "no save
   state" (volume §6 CW-1). RECOMMENDATION: view-item-with-receipt-discipline
   (§3 JUDGMENT): deterministic composition-time id, full address chain,
   typed action, entity refs — never persisted, never in pulseRecord. If the
   owner later wants braids durable (e.g., for cross-session cascade memory),
   that is a NEW persisted key and a new L4 fight — priced then, not smuggled
   now.

---

**In one sentence:** the rolls are half-kept (a real registry, no watchman —
and a lock on its own gate), the inquest already sits (the volume just never
met it), the edition waits on the spine's significance scale and on chains no
kernel yet remembers to record, and the assay office is a named hole in the
certification wall — so this program's build order is: post the watchman and
unlock the gate (CW-0w), then braid (CW-1), then extend the inquest (CW-2x),
then weigh everything (CW-3), persisting not one byte along the way.
