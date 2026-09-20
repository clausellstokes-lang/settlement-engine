# EM-R0b — EVIDENCE, VERSION 2 (Opus COMPILE lane, session 7d3418f8, 2026-09-19 ~20:0x–20:3x EDT)

**Version 1's evidence is preserved whole at `EM-R0b.v1.evidence.md`** (measured at `58fcfe614`); rows
R-1…R-26 below are the version-1 rows RE-RUN at the new tree where the ruling touched them, and R-22…R-34
are new. Nothing from version 1 was rewritten in place.

**Tree read and imported:** `$SP/read-tip-e5bdfd031`, detached, `git status --porcelain
--untracked-files=all` = **0 lines** at start and end (R-0, R-34). Nothing edited, staged or committed
anywhere; every script and output lives under `$SP/lane-em-compile-EM-R0b-scratch/`. No vitest, eslint,
npm script or build; one `node` process at a time; **every write path absolute or shell-relative to this
lane's own directory** (the `process.chdir` hazard — R-34).

New scripts: `tools/r0b-v2.mjs`, `tools/r0b-v2b.mjs`; `tools/r0b-placement.mjs` extended with an EM-R0d
overlay. Version 1's toolchain is preserved at `tools-v1-58fcfe614/`.
Outputs: `out-r0b-v2.txt`, `out-r0b-v2b.txt`, `out-r0b-v2b-mutants.txt`, `out-r0b-placement-v2.txt`.

---

## R-0 — the new tip, its cleanliness, and exactly what moved

```
$ git -C "$SP/read-tip-e5bdfd031" rev-parse --short HEAD
e5bdfd031
$ git -C "$SP/read-tip-e5bdfd031" status --porcelain --untracked-files=all | wc -l
       0
$ git -C "$SP/read-tip-e5bdfd031" diff --stat 58fcfe614..e5bdfd031 -- src tests
 src/domain/density/factionLifecycle.js          |  16 +-
 src/domain/entities/npcs.js                     |  31 +-
 src/domain/entities/successors.js               |   5 +-
 src/domain/worldPulse/calamityKernel.js         |  47 ++-
 src/domain/worldPulse/envoyCasting.js           |  21 +-
 src/domain/worldPulse/magicFormsPractitioner.js |  13 +-
 tests/domain/espionageMission.test.js           |   2 +-
 tests/domain/ruinInstitution.test.js            | 345 ++++++++++++++++++
 tests/generators/densityLaw.test.js             |  18 +
 tests/lint/statusUnionTotality.walker.test.js   | 445 ++++++++++++++++++++++++
 10 files changed, 923 insertions(+), 20 deletions(-)
```
CONFIRMED — EM-B1d version 5's five files plus `calamityKernel.js`. **None is a band ladder and none is a
producer of a record field this module reads**, which R-1b confirms by execution rather than by reading.

## R-1 — the INERTNESS CONTROL, re-run at the new tree

```
$ node --import ./hook3.mjs c0-control.mjs
row      = town|germanic|plains|road|civilized|golden-master-v3
manifest = b77b5909009112855bad4dacf881847d06e43385f64a15f4b528e0d30c91c3ce
measured = b77b5909009112855bad4dacf881847d06e43385f64a15f4b528e0d30c91c3ce
EQUAL    = true
rows=25  identical=25/25  wall=504 ms
INERT = true
```
CONFIRMED.

## R-1b — ⭐ THE CONTROL IS UNCHANGED BY THE NEW TREE

```
$ node --import ./hook3.mjs r0b-v2.mjs
=== A. THE CONTROL at e5bdfd031 — the 25 recon exact checks over 525 rows ===
  rows violating any of the 25: 1/525  (wall 8118 ms)
    ⛔ town|germanic|mountain|mountain_pass|civilized|golden-master-v3: V-SUMMARY-DEPS: summary says 6 operational dependencies but dependencies.length=5
```
CONFIRMED — byte-for-byte the version-1 result at `58fcfe614`. The six changed `src/` files move nothing
this instrument reads.

## R-2 — the EM preamble's LIVE hash

```
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1
```
CONFIRMED — the §P2 row-12 text is present at this tree, and this is the hash the chair stamps. (Version
1's `1cf5442719f2…` was the pre-row-12 value and is now historical.)

## R-22 — ⭐⭐ THE READINESS PRODUCER: they cannot disagree, and the reason is precise

```
$ node --import ./hook3.mjs r0b-v2.mjs
=== C. THE READINESS PRODUCER — can the two disagree? ===
  rulingStructure.js label lines: 5
    :735  ? 'Well-Defended'
    :737  ? 'Defensible'
    :739  ? 'Lightly Defended'
    :741  ? 'Vulnerable'
    :742  : 'Undefended';
  rulingStructure.js lines naming "readiness": 0
  defenseProfile.readiness.label === readinessBandOf(score): 525/525   disagreements: 0
```
and the mechanism, read at the source:
```
$ sed -n '733,746p' src/generators/power/rulingStructure.js
  const _provDefLabel =
    _hasWalls && _hasGarrison   ? 'Well-Defended'
      : _hasWalls || _hasGarrison ? 'Defensible'
        : _hasMilitia             ? 'Lightly Defended'
          : ['thorp','hamlet'].includes(tier) ? 'Vulnerable'
            : 'Undefended';

  const legitimacyDefenseLabel = projection.defenseLabel || _provDefLabel;
  const publicLegitimacy = computePublicLegitimacy(economicState, legitimacyDefenseLabel, tier);
```
CONFIRMED: `_provDefLabel` is a PROVISIONAL defence label consumed ONLY as a fallback INPUT to the
legitimacy score. It never reaches `defenseProfile.readiness.label`, which comes solely from
`computeDefenseReadiness` (`defenseGenerator.js:487-522`). ⇒ **`V-BAND-READINESS` ships as an exact
check.** ⚠ `_provDefLabel` is a sixth, undeclared spelling of the readiness vocabulary and **omits
`Fortress`** — §12 noticed-not-touched row 1, slotted to EM-R0d v2.

## R-23 — ⭐⭐ THE ROUNDING RULE, PROVED

```
=== D. THE ROUNDING RULE (EM-R0d STOP-2) ===
  EXACT check on the published (rounded) inputs : 525 pass / 0 CONVICT
  TOLERANT check (published ± 0.5)             : 525 pass / 0 convict
  -- constructed boundary case --
    deficitPct=15 surplusPct=0 label="Import-Dependent"  EXACT=CONVICT  TOLERANT=pass     published 15, unrounded 15.4 -> Import-Dependent (OPEN below: d > 15)
    deficitPct=15 surplusPct=0 label="Pressured"         EXACT=pass     TOLERANT=pass     published 15, unrounded 14.6 -> Pressured
    deficitPct=15 surplusPct=0 label="Deficit"           EXACT=CONVICT  TOLERANT=CONVICT  a GENUINELY WRONG label at the same boundary
    deficitPct= 5 surplusPct=0 label="Pressured"         EXACT=CONVICT  TOLERANT=pass     published 5, unrounded 5.3 -> Pressured
    deficitPct= 5 surplusPct=0 label="Secure"            EXACT=pass     TOLERANT=pass     published 5, unrounded 4.8 -> Secure
    deficitPct= 5 surplusPct=0 label="Import-Dependent"  EXACT=CONVICT  TOLERANT=CONVICT  a GENUINELY WRONG label at the same boundary
```
CONFIRMED, all three things the chair asked for: **an exact check CONVICTS an honest record** at each cut;
**the tolerant check does not**; **a genuinely wrong label still reds** under both. On today's corpus no
row sits exactly on a cut, so both forms pass 525/525 — the difference is invisible until a DM's edit
lands on a boundary, which is exactly when it matters.

## R-24 — the `simulationTrace` evidence path: no shipped check reads it

```
=== F. the simulationTrace evidence path ===
  rows whose receipt cites a simulationTrace path: 525/525
    thorp|germanic|plains|road|civilized|golden-master-v3
      confidence_and_provenance :: simulationTrace :: undefined
  ⇒ do any of EM-R0b's five V-EVIDENCE-* checks read it?
      ROSTER   /^(\d+) NPCs \/ (\d+) relationships$/   on e.evidence
      EVENTS   /^(\d+) historical events$/              on e.evidence
      TENSION  /^history\.currentTensions\[(\d+)\]$/    on e.path
      STRESS   e.path === 'stress[0]'                   on e.path
      CONFLICT /^conflicts\[(\d+)\]$/                   on e.path
      MATCHED by any of the five: false
```
CONFIRMED — the entry exists on every row, its `evidence` value is **`undefined`** (the visible symptom of
EM-R0a's finding that the receipt is built before the trace is propagated), and **no matcher matches it**.
The module ABSTAINS on that entry under every merge policy, so the recompute hazard cannot reach it.

## R-25 — ⭐ THE FOUR BAND CHECKS, EXACT AGAINST EM-R0d's LADDERS

```
=== G. THE EXACT BAND CHECKS against EM-R0d's ladders, over 525 rows ===
  V-BAND-LEGITIMACY  exact: 525 pass / 0 convict
  V-BAND-READINESS   exact: 525 pass / 0 convict
  V-BAND-FOODSEC     tolerant: 525 pass / 0 convict
  V-COND-BAND        exact:  525/525 rows clean
```
CONFIRMED — **zero learned envelopes remain.** The ladders were transcribed into the harness from kit
`packets-waiting/EM-R0d.md` §6 (legitimacy 75/60/45/30 closed below; readiness 76/55/38/24/12 closed
below; food security 40/15/5 open below with famine outranking) and executed against the corpus.

## R-26 — `stress ≡ stressors` (§22.3 item 5)

```
=== B. stress ≡ stressors ===
  byte-identical: 525/525   in the 63 stride: 63/63
  both present: 525/525
```
CONFIRMED — the identity holds on the FULL corpus, not only the 63 rows §22.3 quotes. It joins as
`V-STRESS-IDENTITY`, the thirtieth check.

## R-27 — the flag table at 525, and why the whole-vector form is refused

```
  economicState.foodSecurity  [isDeficit,isPressured,isSecure,isSurplus] over 525:
    Deficit — Active Famine    [true,false,false,false]x36
    Deficit                    [true,false,false,false]x13
    Import-Dependent           [true,false,false,false]x196  [false,true,false,false]x12
    Pressured                  [false,true,false,false]x151
    Secure                     [false,false,true,false]x117
  powerStructure.publicLegitimacy  [isEndorsed,isApproved,isTolerated,isContested,isLegitimacyCrisis]:
    Approved                   [false,true,false,false,false]x212
    Contested                  [false,false,false,true,false]x55
    Endorsed                   [true,true,false,false,false]x23
    Legitimacy Crisis          [false,false,false,false,true]x36
    Tolerated                  [false,false,true,false,false]x199
```
CONFIRMED. `Import-Dependent` carries two live vectors and `Endorsed` carries `isApproved` as well
(`isApproved: score >= 60` has no upper bound), so a whole-vector equality would convict 12 legitimate
records outright. The per-FLAG rule is the only sound one.

## R-28 — the 63-row stride loses no label

```
  -- the same tables over the 63-row stride (the module's own test control) --
    foodSecurity labels at 63: Deficit | Deficit — Active Famine | Import-Dependent | Pressured | Secure
    labels present at 525 but ABSENT from the 63 stride: (none)
```
CONFIRMED — the table is TAUGHT on 525 (§22.3 item 6) and the module's own test can CONTROL on 63 without
losing a row of it.

## R-31 — ⭐⭐ THE SECOND ROUNDING HAZARD: the food card runs TWO ladders on the same number

```
$ node --import ./hook3.mjs r0b-v2b.mjs
=== I. THE (15,20] WINDOW ===
   label ladder (foodGenerator.js:340-358): OPEN below, cuts 40/15/5 on deficitPct
   flag  ladder (foodGenerator.js:475-478): isDeficit d>20 ; isPressured d>5 && d<=20
  rows with PUBLISHED deficitPct in (15,20]: 36
  published deficitPct -> rows / isPressured / isDeficit:
      19  n= 12  isPressured= 12  isDeficit=  0
      20  n= 24  isPressured=  0  isDeficit= 24
  the WHOLE corpus, published deficitPct vs the two flags (disagreement census):
    rows where isPressured != (published d in (5,20] and not famine): 24/525
```
⭐ CONFIRMED, and this is the measured justification for §22.3 item 6's "DECLARED data". The
`Import-Dependent` second vector is exactly the **12 rows published at 19**; the **24 rows published at
20** carry `isDeficit` because the flag ladder read an UNROUNDED value above 20. **A check that derived
the flags from the published number would convict 24 of 525 honest rows.** The module declares the
observed table and derives nothing. The 15-versus-20 disagreement itself is the OWNER's decision point
(ODQ §934.57), not this packet's to reconcile.

## R-29 — ⭐ THE MUTANTS for every check whose FORM changed, plus the new identity

```
$ node --import ./hook3.mjs r0b-v2b.mjs
  ✓ V-BAND-LEGITIMACY    trips=[V-BAND-LEGITIMACY]   publicLegitimacy.score -> 50 WITH breakdown corrected by the same delta; label stays Endorsed
  ✓ V-BAND-READINESS     trips=[V-BAND-READINESS]    defenseProfile.readiness.score -> 20 (label stays Fortress)
  ✓ V-BAND-FOODSEC       trips=[V-BAND-FOODSEC]      label Secure -> Deficit WITH its flags corrected to the Deficit vector
  ✓ V-COND-BAND          trips=[V-COND-BAND]         activeConditions[0].severityBand -> the adjacent band
  ✓ V-STRESS-IDENTITY    trips=[V-STRESS-IDENTITY]   stressors gains one entry that stress does not
  ✓ V-FLAGVEC            trips=[V-FLAGVEC]           isSecure=true beside label="Import-Dependent"   (carrier thorp|germanic|hills|…)
  ✓ V-FLAGVEC            trips=[V-FLAGVEC]           a foreign legitimacy flag true beside Approved   (carrier village|germanic|coastal|…)
```
CONFIRMED. With version 1's twenty-four rows re-confirmed (R-12, `EM-R0b.v1.evidence.md`), **all thirty
checks have an isolating planted mutant.**

## R-30 — ⭐ WHY THE FLAGVEC MUTANT NEEDED A DIFFERENT CARRIER (and what it revealed)

The first attempt used a `Secure` carrier and tripped **two** checks:
```
  ⛔ V-FLAGVEC   trips=[V-FOODSEC-FLAGS, V-FLAGVEC]
      + V-FOODSEC-FLAGS: foodSecurity.label="Secure" but isSurplus=true as well
      + V-FLAGVEC: …label="Secure" but isSurplus=true, which no record with that label carries
```
Diagnosed at the source: `V-FOODSEC-FLAGS`'s own map is `{ Secure, Pressured, Deficit, Surplus }` — it
covers **four of the six** food labels and silently ABSTAINS on `Import-Dependent` and
`Deficit — Active Famine`, where `V-FLAGVEC` is the sole check. The isolating carrier is therefore an
`Import-Dependent` record, and the mutation is **the recon's Finding-2 pair exactly**: `isSecure = true`
beside `Import-Dependent`. It isolates. ⇒ §12 noticed-not-touched row 2, and §6 now documents the
asymmetry.

## R-14 — ⭐ BUNDLE PLACEMENT, with EM-R0d's leaf in the overlay

```
$ node r0b-placement.mjs
=== BASE ===      ENGINE_SHARED_DOMAIN: 68  EAGER_FIRST_PAINT_MODULES: 283  generation.worker closure: 220
=== R0D_ONLY ===  68 / 283 / 220
=== PACKET ===    68 / 283 / 220     recordInvariants.js in shared/EAGER/WORKER : false / false / false
=== FORBID ===    69 / 285 / 222     recordInvariants.js in shared/EAGER/WORKER : true / true / true

=== DELTAS against BASE ===
  R0D_ONLY: eager 283 -> 283 (+0)   worker 220 -> 220 (+0)
  PACKET:   eager 283 -> 283 (+0)   worker 220 -> 220 (+0)
  FORBID:   eager 283 -> 285 (+2)   + EAGER src/domain/edit/recordInvariants.js
                                    + EAGER src/data/bandLadders.js
            worker 220 -> 222 (+2)
```
CONFIRMED — **this packet's delta is 0 on both budgets**, and the forbidden counterfactual now moves both
by **+2** because the offending import drags EM-R0d's ladder leaf in behind this one. ⚠ Method: these are
STATIC closures from `vite.config.js`'s own derivations run against a VIRTUAL overlay (nothing on disk
touched); EM-R0d's own placement is priced in EM-R0d's packet, and my overlay models its leaf as
present-but-unimported, so the load-bearing figure here is **this leaf's own delta**.

## R-32 — ⭐ THE BRIEF'S NEW STEPS 13 AND 15: both zero, and the reason is structural

```
$ node -e "…"    # docs/content/wiring-census.json
stamp.files entries: 7
any src/domain/edit: 0      any src/data/bandLadders: 0
```
**This packet MODIFIES no `src/` file at all** — its change manifest is two CREATEs and one TEST. So:
- **step 13 (line-addressed):** no `prose-numerics` baseline row can shift above or below, because no
  baselined file gains or loses a line. Its own new files carry no baseline rows.
- **step 15 (stamped):** `wiring-census.json`'s `stamp.files` holds seven entries and none is a path this
  packet writes, so `proseWiringCensus.walker.test.js` cannot go `stale-bytes`.
Both CONFIRMED by the manifest's own shape rather than by a scan that could miss a case.

## R-33 — steps 11, 12 and 14, answered

- **11 (a declared command's writes):** both `checks` are `npx vitest run` on files this manifest names;
  **no generator is among them**, so nothing is re-stamped mid-chain and no seventh generated path exists.
  Established by READING the two commands, not by running them.
- **12 (sweep `tests/` as well as `src/`):** this packet **changes no symbol and retires no literal** — it
  is pure CREATE. There is no constant to widen, no fixture spelling to red, and **no member added to any
  named set**, so the consequence-at-the-consumers question has no subject here. Stated rather than
  assumed.
- **14a (`checks` order):** no generator, so order is unconstrained; both steps are reachable by
  `check:packet`.
- **14b (a new test file's registration):** `parkReasonsFor = (src) => classify(src).reasons`
  (`sovereigntyLightingContract.walker.test.js:1670`). The packet pins the shape in §5.2 and §7:
  straight-line literal `it`s under ONE literal `describe`, and **never** a variable or parameter named
  `it`, `test` or `describe` — EM-B1e parked as `OPENER_UNRESOLVED:it` for exactly that, and 26 of the
  estate's 384 parked files park for that reason alone. `credited +1` is stated as CONDITIONAL on it.

## R-16 / R-16b / R-15 / R-6 / R-13 / R-5 / R-8 / R-4 / R-9 / R-12 — carried from version 1

Re-checked at `e5bdfd031` where the tree could have moved them:

```
=== R-17 targets ABSENT at e5bdfd031 ===
  ABSENT ✓ src/domain/edit/recordInvariants.js
  ABSENT ✓ src/domain/edit/recordInvariantFlags.js
  ABSENT ✓ tests/domain/recordInvariants.test.js
  ABSENT ✓ src/data/bandLadders.js          <- EM-R0d has not landed; its symbols are NOT requiredSymbols
=== R-18 requiredSymbols VERBATIM ===
  ✓ 2x src/domain/activeConditions.js :: export function severityBand
  ✓ 1x tests/helpers/goldenMasterCorpus.js :: export function goldenCorpus
  ✓ 1x tests/helpers/goldenMasterCorpus.js :: export const keyOf
  ✓ 1x src/generators/generateSettlementPipeline.js :: export function generateSettlementPipeline
  ✓ 1x tests/build/domainGeneratorsBoundary.test.js :: const BASELINE_EDGES
  (pending note present — 4 EM-R0d symbols named)
=== R-20 collisions at e5bdfd031 ===  packets: 190  collisions: 0
```
The unchanged version-1 rows, all still holding: the domain→generators ratchet at 4 files / 5 live edges
with a per-file arm that reds on any new importer (R-6); `activeConditions.js` self-contained at 43,420 B
with zero imports (R-13); `severityBand` exported at `:541` (R-5, the `2x` being the `severityBands`
prefix); `V-COND-BAND` clean over 516 conditions (R-8); `V-STRESS-NAME` unable to convict (R-4); band pair
4 identical to pair 3 on 525/525 (R-9); `tests/domain` not an `ENFORCER_DIR` and `recordInvariants.test.js`
matching no `NAME_PATTERN` token (R-16); the observed-shape inventory's nine same-key findings all on the
wrong receiver (R-16b); the lighting register measuredBy EM-P0 and behind three landings, so no absolute
is quoted (R-15).

## R-19 — THE POST-EDIT SIMULATION (pre-proof step 10)

Two CREATEs and one TEST; **no existing file is modified**, so the packet moves, renames and deletes **no
symbol**. `retiredSymbols` is EMPTY; no other LANDED packet's rows need discharging.

| requiredSymbols row | written by this packet? | present after its own edits |
|---|---|---|
| `src/domain/activeConditions.js#export function severityBand` | NO | YES |
| `tests/helpers/goldenMasterCorpus.js#export function goldenCorpus` | NO | YES |
| `tests/helpers/goldenMasterCorpus.js#export const keyOf` | NO | YES |
| `src/generators/generateSettlementPipeline.js#export function generateSettlementPipeline` | NO | YES |
| `tests/build/domainGeneratorsBoundary.test.js#const BASELINE_EDGES` | NO | YES |
| *(pending)* the four `src/data/bandLadders.js` symbols | NO | added by the chair at promotion, after EM-R0d lands |

## R-22b — the MANIFEST-EQUALITY validator arm, re-run on version 2

```
$ node r0b-manifest-equality.mjs
PACKET_ACTIONS (read from scripts/implementation-packets.mjs): CREATE, DOC, MODIFY, REGISTER, TEST
Markdown §7 rows parsed: 3        JSON changeManifest rows: 3
  SETS EQUAL : true       in Markdown but not JSON : (none)       in JSON but not Markdown : (none)
  every action in PACKET_ACTIONS and identical on both sides : true
  exactly one full repo-relative path per Markdown row       : true
✓ CONFORMS to the validator arm on every clause.
  acceptanceCases: 8 (cap 8) -> true     [and each row is a {id, case} object]
  checks[0] directories=tests/domain (one per array -> true)
  checks[1] directories=tests/build  (one per array -> true)
```

## R-34 — cost re-measured, and the tree still clean

```
=== H. COST, re-measured at e5bdfd031 (exact checks + the four imported ladders) ===
  thorp 0.030 ms · hamlet 0.033 · village 0.040 · town 0.050 · city 0.055 · metropolis 0.052
  ALL   n=525  0.044 ms
```
⭐ **0.044 ms, down from version 1's 0.060 ms** — the imported ladder functions are O(rungs) where the
learned envelope scan was O(labels) with a set allocation per pair. Against 5.6–26.2 ms of generation it
is 0.17–0.54 %.

```
=== III. THE SHIPPED v2 INSTRUMENT'S CONTROL over all 525 rows ===
  rows violating any SHIPPED v2 check: 1/525
    ⛔ town|germanic|mountain|mountain_pass|civilized|golden-master-v3: V-SUMMARY-DEPS: …
```
```
$ git -C "$SP/read-tip-e5bdfd031" status --porcelain --untracked-files=all | wc -l
       0
$ git -C "$SP/read-tip-e5bdfd031" rev-parse --short HEAD
e5bdfd031
```
CONFIRMED on every count. ⚠ The `process.chdir(TREE)` hazard was re-checked at the new tree: every output
is written by the SHELL with its cwd inside this lane's own `tools/`, no script here writes a file from
node, and the read tree is clean — 0 modified, 0 untracked.
