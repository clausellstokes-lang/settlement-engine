# Town cartography / MF-CG1 — the cartography ground: the stage's premises get a real-pipeline corpus, and the corpus refutes the cure

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `b2852ccc3cc4753499996da6582dd672e90499d0`
  ⚠ RE-STAMPED AT THE LANDING ACT (§410). The member was BUILT on `00e7af612d428078634d52ea37054bd00b773ca6` and a REBASE WAS
  OWED: `git merge-base --is-ancestor b2852ccc 74586243` returned FALSE, so the holding tip was
  rebased `--onto` this slot by lane TE-CG1-LANDING. See §10.
  ⚠ Read with `git rev-parse` at this lane's opening, never extended from a quoted prefix
  (§381's fabricated-SHA law) and never taken from the dispatch text.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Depends on:** nothing.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file at
  THIS base by this lane, identical to the value MF-T2Q carries, so no re-stamp occurred in the
  window.
- **Charter:** ODQ **§484** (the lane's dispatch), **§506** (the inherited diagnosis and the
  ratified cap rule), **§503.2 / §505.4** (the measurement laws quoted in §3 below).
- **Collision group:** none. At the BUILD base **167 of 168 registered packets were LANDED and
  the remaining one SUPERSEDED**; RE-MEASURED at the landing slot `b2852ccc` by execution
  against `PACKET_MANIFEST.json`, **168 of 169 are LANDED and the remaining one is
  SUPERSEDED** — MF-CH1 landed in the window, and its change set and this member's are
  disjoint at blob level (§10), so no packet reserves any path this member names at either
  end.
- **Commit authority:** this lane commits on its own detached worktree ref. **No ref was moved.**
- **Family:** `town-cartography`, not the dispatch's suggested `catalog-hygiene`. The validator has
  no family concept — a family is only the directory segment inside `packetPath` — and this
  member's whole subject is the TC-3b binding cap and the TC-4 byte band, whose authoring packets
  (`TC-3B.md`, `TC-4.md`) already live in that directory. `catalog-hygiene` does not exist as a
  directory at this base, so choosing it would mint a one-member family for a member that belongs
  to a populated one. **JUDGMENT, vetoable.**

---

## §1 · WHAT THIS MEMBER IS, AND WHAT IT DELIBERATELY IS NOT

**It is the GROUND.** The cartography stage's per-tier premises are calibrations, and until this
member the only corpus any of them was ever proved against was `V2_GOLDEN_CONFIGS` — twenty
hand-authored settlements in `tests/fixtures/townMapFixtures.js` whose institution counts are
literal constants (`TIER_INSTITUTIONS = { thorp: 2, hamlet: 4, village: 6, town: 10, city: 16,
metropolis: 22 }`). A cap cannot be exceeded by a corpus that cannot draw past it. That is the real
defect, and this member removes its habitat: a real-pipeline calibration corpus, a frozen
measurement manifest, and a suite that re-measures a live sample of it on every run.

**It is NOT the cap change.** The dispatch's Half B — apply the ratified rule
`max(current, ceil(measuredMax x 1.5))` to `MAXIMUM_INSTITUTION_BINDINGS` — is **NOT PERFORMED**,
and the reason is a measurement, not a preference. The dispatch named the exact contingency:
*"if something other than a number fails, or if a cap still bites after the rule — STOP at that
boundary and report the measured fact rather than widening the cure."* Both arms fired. §3 is the
measurement; §4 is what the chair would have to ratify for the cure to exist.

**No production file is modified by this member.** `src/**` is byte-identical at this member's tip.

---

## §2 · THE INHERITED DIAGNOSIS, RE-PROVED AND CORRECTED

Re-proved by execution at this base, never carried:

| Inherited claim | Verdict | Evidence |
|---|---|---|
| The dark compile succeeds; the pipeline output is not malformed | **CONFIRMED** | 504/504 dark compiles clean over the corpus; zero `dark != 'ok'` rows in the manifest |
| `MAXIMUM_WARDS` never bites | **CONFIRMED** | zero rows in the `other` premise bucket across 504 |
| Nothing is orphaned | **CONFIRMED** | the two orphan premises (`lowered to no ward`, `carved no parcel`) never fire; same bucket |
| **"Only a number fails"** | **REFUTED AS STATED** | **TWO** independent premises fail, not one — see §3 |
| The cap rule unblocks the throw | **REFUTED** | uncapping the binding cap entirely leaves 61/504 still throwing — see §3 |

---

## §3 · THE MEASUREMENT (all figures executed at `00e7af61`)

### 3a · The corpus, and why it is not the golden-master grid unchanged

504 rows: the estate's own golden-master grid, 6 tiers x 12 cultures x 7 terrains, terrain paired
with the trade route that honestly reaches it. **Two dimensions the golden master holds fixed are
rotated by row index, and that choice is measured rather than assumed.** The calibration quantity —
the canonical institution roster — is a SEEDED DRAW inside a tier band. At one fixed config, eight
seeds alone moved `hamlet` from 11 to 20 and `town` from 45 to 58, while the whole 12x7
culture-by-terrain sweep at ONE seed moved `hamlet` only from 7 to 17. A single-seed grid therefore
systematically under-measures the maximum no matter how wide it looks.

The proof that this mattered: at ONE seed the grid reported **thorp 0/84 failures**. With the seed
rotated it reports **thorp 28/84**. A whole tier the old ground called clean is not clean.

### 3b · What the stage does with real settlements

| Tier | rows | ok | binding-cap throw | TC-4 byte throw | max institutions | binding cap | total-building cap |
|---|---:|---:|---:|---:|---:|---:|---:|
| thorp | 84 | 56 | 28 | 0 | 11 | 8 | 12 |
| hamlet | 84 | 13 | 71 | 0 | 24 | 12 | 24 |
| village | 84 | 1 | 83 | 0 | 41 | 20 | 48 |
| town | 84 | 0 | 84 | 0 | 62 | 32 | 96 |
| city | 84 | 63 | 0 | 21 | 55 | 64 | 176 |
| metropolis | 84 | 84 | 0 | 0 | 63 | 96 | 240 |
| **total** | **504** | **217** | **266** | **21** | | | |

**287 of 504 real settlements raise a cartography premise error.** The dispatch's inherited figure
was 32 of 48 (66.7%); this corpus reads 56.9% over a corpus that is both broader and — because of
the seed rotation — drawn from the right distribution.

### 3c · ⛔ THE STOP: a second premise the ratified rule cannot reach

`MAXIMUM_INSTITUTION_BINDINGS` was set to `100000` at every tier in this lane's worktree and the
504-row grid re-run. The binding cap is then unreachable by construction. **61 of 504 rows still
throw**, every one of them on the OTHER premise:

| Tier | rows still throwing | worst measured bytes | derived band | over |
|---|---:|---:|---:|---:|
| hamlet | 1 | 9,897 | 9,600 | +3.09% |
| village | 12 | 19,551 | 19,200 | +1.83% |
| town | 24 | 39,651 | 38,400 | +3.26% |
| city | 24 | 71,211 | 70,400 | +1.15% |

That band is `MAXIMUM_CARTOGRAPHY_BUILDINGS[tier] x TC4_ROW_BYTES_BAND`, and
`TC4_ROW_BYTES_BAND: 400` carries this comment in `cartographyTuning.js`:

> *"the per-row UTF-8 ceiling, against a measured worst case of 374 B/row at thorp"*

**The byte band is the same defect as the binding cap.** It is a ceiling measured at ONE tier
against the synthetic corpus, and real output crosses it at four tiers. Curing the binding cap
alone therefore does not unblock the dwellings program; it moves 226 of the 287 failures and leaves
61 standing at every middle tier. `32/48 -> 0/48` is unreachable by the ratified rule at any value.

The probe was reverted byte-exact (`sha256 1503d3068cc098ba1ff1adf1fc93c469a823aed8cd315500c256c174fb710253`,
`git status --porcelain` empty) before anything was authored.

### 3d · ⛔ THE SECOND STOP: the ratified rule's own output reds a currently-green pin

`tests/domain/townCartographyBuildings.test.js :: the two static tuning invariants hold for every
tier` asserts `MAXIMUM_INSTITUTION_BINDINGS[t] <= MAXIMUM_CARTOGRAPHY_BUILDINGS[t]`, which is
`{12, 24, 48, 96, 176, 240}`. Applying `max(current, ceil(max x 1.5))`:

| Tier | amendment lane's value | this lane's rule-derived value | total-building cap | verdict |
|---|---:|---:|---:|---|
| thorp | 18 | 17 | 12 | **both violate** |
| hamlet | 30 | 36 | 24 | **both violate** |
| village | 59 | 62 | 48 | **both violate** |
| town | 92 | 93 | 96 | both fit |
| city | 77 | 83 | 176 | both fit |
| metropolis | 96 | 96 | 240 | both fit |

The invariant is not decorative: a flagship is drawn for every bound institution, so a binding cap
above the total building cap promises more flagships than the layer may ever emit.

### 3e · Disagreement with `{18, 30, 59, 92, 77, 96}`, as the dispatch asked

Those values imply measured maxima `{12, 20, 39, 61, 51, 64}`. This lane measures
`{11, 24, 41, 62, 55, 63}`. **Neither set dominates the other** — the amendment lane read higher at
thorp and metropolis, this lane higher at hamlet, village, town and city. Two honest samples of the
same draw disagreeing in both directions is the finding: **a sampled maximum is not a ceiling**, and
a cure built on `ceil(sample x 1.5)` inherits that sample's luck. The corpus this member commits is
what makes the next sample reproducible and its drift visible; it does not turn a sample into a
bound, and this packet does not claim it does.

### 3f · The measurement laws, quoted and discharged (§503.2, §505.4)

> *"`facetOf` is called ZERO times in the generation pipeline, so a whole-record corpus digest is
> STRUCTURALLY BLIND to inference changes."*

Discharged in kind: every claim above is carried by a probe that can FAIL. The corpus's cheap
quantity (`settlement.institutions.length`) is not assumed to stand for the expensive one — W3's
IDENTITY arm compares it against the count the TC-3b leaf states in its OWN premise message across
266 rows and reds on one disagreement. The `other` premise bucket is asserted EMPTY and the
classifier's negative arm is pinned, so an unseen premise class cannot be silently folded into a
known one. The `tc4-bytes` arm re-derives the band from the tuning tables, so the documented
derivation is checked against the code rather than restated.

> *"Any catalog-row key addition reds `generatorGoldenMaster` because `assembleInstitutions`
> spreads the row onto the record."*

**Confirmed not applicable.** This member adds no catalog row and touches no `src/**` byte. The
generator golden fixture is unmoved at
`sha256 29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8` at both ends.

---

## §4 · WHAT A CURE WOULD COST — for the chair, NOT started

Not a proposal this lane may adopt: `MAXIMUM_CARTOGRAPHY_BUILDINGS` and `TC4_ROW_BYTES_BAND` are
tuning-signature tables, and moving `MAXIMUM_CARTOGRAPHY_BUILDINGS` changes how many buildings the
map DRAWS, which is drawn output and not a premise. Recorded so the chair has the shape:

1. **`MAXIMUM_INSTITUTION_BINDINGS`** must clear each tier's real maximum. The ratified rule gives
   `{17, 36, 62, 93, 83, 96}` on this lane's corpus.
2. **`MAXIMUM_CARTOGRAPHY_BUILDINGS`** must then be at least that at every tier — currently
   `{12, 24, 48, 96, 176, 240}`, so thorp, hamlet and village must move. This is a DRAWN-OUTPUT
   change, not a premise repair.
3. **The TC-4 byte band** moves with (2) because it is derived, but the measured overrun is 1–3%
   at four tiers, so whether (2) alone clears it is an OPEN MEASUREMENT this lane did not run
   (it would require making the change, which is the thing being gated).

The corpus this member lands is what makes (3) a one-command measurement instead of an argument.

---

## §5 · EXACT CHANGE MANIFEST

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `tests/fixtures/cartographyCalibrationCorpus.js` | `calibrationRows`, `measureCalibrationRow`, `calibrationKeyOf`, `calibrationSampleKeys`, `calibrationVocabularyReceipt`, `classifyCalibrationFailure`, `CALIBRATION_*` | 180 eff | the corpus rule and the measurement seam; no stage rule re-implemented |
| `CREATE` | `tests/fixtures/cartography-calibration-corpus.json` | 504-row frozen measurement | n/a | generated only by the committed regeneration path |
| `CREATE` | `tests/domain/townCartographyCalibration.test.js` | W1–W5 | 300 eff | the ratchet, the live sample, the identity control |
| `DOC` | `docs/implementation/packets/town-cartography/MF-CG1.md` | this packet | n/a | — |
| `DOC` | `docs/implementation/INDEX.md` | one row | n/a | — |
| `MODIFY` | `docs/implementation/PACKET_MANIFEST.json` | one packet record | n/a | — |

Generated artifacts: `tests/fixtures/cartography-calibration-corpus.json`, by
`UPDATE_CARTOGRAPHY_CALIBRATION=1 npx vitest run tests/domain/townCartographyCalibration.test.js`.

**No `src/**` file is edited. No tuning number is moved. No migration is minted; the migration head
is not pinned anywhere in this packet.**

---

## §6 · CENSUS

> **`censusAuthorization`:** this member moves the test census by
> **`+1 files / +0 parked / +1 credited / +19 titles / +6 suiteTitles`** — one new CREDITED test
> file carrying exactly nineteen straight-line `it` titles under six literal `describe`s. The two
> fixture artifacts are NOT `*.test.js`, so `TEST_FILES` in
> `tests/lint/sovereigntyLightingContract.walker.test.js` does not see them.
> **Base tuple, RE-DERIVED at `00e7af61`: `2515 / 366 / 2149 / 20854 / 5807`** (the live `CENSUS`
> object). **After tuple, CONVICTED 33/33 at this member's tip: `2516 / 366 / 2150 / 20873 / 5813`.**
> ⭐ **ALL FIVE FIGURES READ IN ONE RUN, NONE PATCHED.** The census is SEQUENCED and stops at its
> first red figure, so a patched `files` would leave four stale figures standing behind it. A
> `console.log` probe inside the census test and before its first assertion printed all five from
> the walker's own `TEST_FILES` scan and classifier; it minted no title and it is gone.
> ⭐ **THE DELTA IS FULLY ATTRIBUTED, WHICH IS THE CONTROL THAT MATTERS.** `+19 titles / +6 suite`
> equals this file's OWN nineteen titles and six describes exactly (`liveTitlesIn` 19,
> `liveSuiteTitlesIn` 6, `parkReasonsFor` `[]`), and `366 + 2150 = 2516` closes the file
> arithmetic. Had any other file drifted a pin in this window the aggregate would exceed this
> file's own counts and the closure would fail. NEGATIVE CONTROL: the base tuple put back reds at
> `files` — *"the estate's file count moved — re-measure, do not re-word: expected 2516 to be
> 2515"* — and the file was restored byte-identical (`cmp` 0,
> `sha256 811b044a8d6527d5216eec9434f097be06a5e7b0bfbed7bec79194272d9b8399`).
> Its authorizing decision is **ODQ §484**.

> ⚠⚠ **A HAZARD THIS MEMBER HIT, CURED, AND IS RECORDING SO THE NEXT LANE DOES NOT.** The first
> draft used generatorGoldenMaster's shape — `if (process.env.UPDATE_…) { describe(…) } else
> { describe(…) … }` at module scope. The walker PARKED the entire file under
> `SUITE_UNREGISTERED:describe` / `TEST_UNREGISTERED:it`, and the walked delta was
> **`+1 / +1 / +0 / +0 / +0`**: every one of the nineteen titles SWALLOWED, nothing red anywhere,
> and a census row that would have looked arithmetically fine. The cure is straight-line
> registration with the re-record as an opt-in ARM of W0's single test; the file's header states
> the rule and the measurement.

> ⚠ **THE SECOND CENSUS IS UNMOVED.** `scripts/.test-ratchet-baseline.json` caps `skippedCeiling`
> (this member adds no skip) and lists FAILING tests (this member's nineteen all pass);
> `totalTests` / `totalFiles` are read only as a scope FLOOR (`SCOPE_FLOOR_RATIO`), which growth
> cannot breach. No edit to that baseline is owed by this member.

⛔ **THE SHARED CENSUS ROW IS DEFERRED TO THE CHAIR'S LANDING ACT (§417).** This lane walked both
censuses at its tip, recorded the delta, and REVERTED each edit digest-exact. The row's exact text
for `PACKET_MANIFEST.json`:

```json
        {
          "action": "TEST",
          "path": "tests/lint/sovereigntyLightingContract.walker.test.js"
        }
```

⚠ **INTERIOR RED, NAMED IN ADVANCE.** Until the chair re-records the tuple,
`tests/lint/sovereigntyLightingContract.walker.test.js` reds at this member's tip on the census arm.

---

## §7 · ACCEPTANCE CASES

1. **W1 · the corpus is a rule.** The vocabulary arithmetic closes (6 x 12 x 7 = 504), every row
   obeys the stated threat/seed/route rotation index for index, and the rotation reaches every
   (tier, seed) and (tier, threat) pair — the failure a row count cannot see.
2. **W1 · the manifest covers the corpus EXACTLY.** Key-set equality both ways: an unmeasured row
   and a stale row are the same defect wearing two faces.
3. **W1 · every outcome is a known class, the `other` bucket is EMPTY, and every dark compile
   succeeded** — the claim that makes each failure a calibration defect rather than a generator bug.
4. **W1 · the classifier refuses foreign words.** Its negative arm is what keeps arm 3's empty
   `other` bucket from being vacuous.
5. **W2 · the frozen measurement is re-measured LIVE.** A deterministic sample — a fixed stride
   UNIONED with every tier's argmax row — is regenerated through the real pipeline and the real
   compiler and must reproduce its manifest record exactly.
6. **W3 · the corpus quantity is PROVEN.** The count the TC-3b leaf states in its own premise
   message equals `settlement.institutions.length` on all 266 binding-cap rows, with a
   non-vacuity floor so an empty left-hand side cannot pass.
7. **W4 · the premise-failure inventory only shrinks**, with the honesty companion that forbids a
   stale row, and the per-tier institution maximum pinned EXACTLY against a literal table.
8. **W5 · the headroom is recorded.** Each cap is listed beside the real maximum, the four short
   tiers are named as an exact list, and the binding-cap-under-building-cap invariant is restated
   as the constraint any future repair must satisfy.

---

## §8 · CHECKS

```sh
npx vitest run tests/domain/townCartographyCalibration.test.js
npx vitest run tests/domain/townCartographyParcels.test.js tests/domain/townCartographyBuildings.test.js
npx vitest run tests/property/generatorGoldenMaster.test.js
npx tsc -p tsconfig.json --noEmit   # via the two ratchet scripts
npx eslint tests/fixtures/cartographyCalibrationCorpus.js tests/domain/townCartographyCalibration.test.js
node scripts/implementation-packets.mjs validate
```

---

## §8b · EXECUTED RECEIPTS AT THIS MEMBER'S TIP

| Gate | Result |
|---|---|
| the stage's new suite | `19 passed (19)`, `TRUE_EXIT=0` |
| the re-record arm, through the COMMITTED path | `1 passed (1)`, `TRUE_EXIT=0`, 41.59 s, 504 rows written |
| `typecheck:ratchet` | `OK — no type regressions (173 error(s), ceiling 173)`, exit 0 |
| `typecheck:domain:strict` | `✓ no strict-type regressions (1134 errors, ceiling 1134)`, exit 0 |
| `eslint` on both authored JS files | exit 0, no output |
| `eslint --fix-dry-run` on both | exit 0, no output |
| `node scripts/implementation-packets.mjs validate` | `valid: 169 packets`, exit 0 |
| generator golden fixture | `sha256 29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8`, unmoved at both ends |
| `node scripts/check-observed-shape-readers.mjs` | exit 1, output BYTE-IDENTICAL (`cmp` 0) to the chair baseproof at `b10ed1a1` — the pre-existing schema-10 red, not this member's |
| `node scripts/check-tuning-bands.mjs` | `manifest v2 OK: 9 ratified soak bands, all valid`, exit 0 |

### The §489.3 grep-driven arm, widened by shape

`git grep -l` over every symbol, cap constant and premise name this member reads —
`MAXIMUM_INSTITUTION_BINDINGS`, `MAXIMUM_CARTOGRAPHY_BUILDINGS`, `TC4_ROW_BYTES_BAND`,
`cartographyBand`, `CARTOGRAPHY_TIERS`, `TOWN_CARTOGRAPHY_TUNING`, `compileTownParcelLayers`,
`compileTownBuildingLayers`, `bindCanonicalInstitutionsToParcels`, `V2_GOLDEN_CONFIGS`,
`townMapFixtures`, `CULTURE_PROFILE_KEYS`, `townCartographyEnabled`, and both premise message
fragments — across all of `tests/`. The union reached beyond the cartography suites into
`tests/design`, `tests/hooks`, `tests/lib` and `tests/property`, so the sweep was WIDENED BY SHAPE
from the dispatch's ten trees to **thirteen**: `tests/lint tests/build tests/docs tests/ops
tests/domain tests/property tests/edgeFunctions tests/scripts tests/ui tests/data tests/design
tests/hooks tests/lib`.

### The sweep, ONCE, and its classification against a RE-PROVED seven

`1682 passed | 6 failed | 7 skipped` files; `21,576 passed | 8 failed | 114 skipped` tests;
412.03 s. The banked set was re-proved by EXECUTION in a detached baseproof worktree at
`00e7af61` (`$SP/laneTECG1-baseproof`, its own `node_modules`), never read off a commit subject:
**seven titles, with assertion messages byte-identical at both ends** —

1. `tests/docs/enforcement-claims.test.js :: every completeness claim carries an @enforced-by tag with ≥1 target`
2. `tests/domain/metronomeCooldownLint.test.js :: the non-cooldown emitter set may only SHRINK …`
3. `tests/lint/clampPrimitiveBaseline.test.js :: baseline exactly matches the files that still define a local clamp/clamp01`
4. `tests/lint/warCostKindPools.walker.test.js :: 'trajectory_misread' retains the five receipt-annex families verbatim`
5. `tests/lint/warCostKindPools.walker.test.js :: 'war_trajectory_losing' …`
6. `tests/lint/warCostKindPools.walker.test.js :: 'war_trajectory_winning' …`
7. `tests/lint/warRulingKindPools.walker.test.js :: 'succession_demand_inherited' …`

`tests/lint/sovereigntyLightingContract.walker.test.js` **PASSED at the baseproof**, which is the
control that makes the eighth title attributable rather than assumed. The eighth is this member's
own §417 census red, named in advance in §6.

**8 failing titles − 7 re-proved banked = 1, and that 1 is the declared interior red. ZERO STRAYS.**

---

## §9 · DELIBERATE DEFERRALS — documented, not bugs to re-find

- **The cap change itself (Half B).** Stopped at the measured boundary, §3c/§3d. Owner-gated by
  nature once it reaches `MAXIMUM_CARTOGRAPHY_BUILDINGS`, which is drawn output.
- **The TC-4 byte band's own recalibration.** Same gate; the measurement is in §3c so the chair
  does not have to re-derive it.
- **Whether raising the total building cap alone clears the byte band.** Cannot be measured without
  making the gated change; named in §4(3).
- **A ratchet over the SECOND corpus (`V2_GOLDEN_CONFIGS`).** The synthetic corpus is still the
  ground for the geometry pins in `townCartographyParcels.test.js`, and correctly so — geometry is
  not a distribution question. Only the per-tier CEILINGS needed a real-output ground. No change
  proposed.


## §10 · THE LANDING SLOT (TE-CG1-LANDING, 2026-08-24 — slot `b2852ccc`, the MF-CH1 landing)

Landed by lane **TE-CG1-LANDING**, **`[OPUS-RUN · FABLE-VALIDATION OWED]`** (ODQ §484). The lane
moved no ref; the chair executes the CAS `b2852ccc → this tip`.

### §10.1 · A REBASE WAS OWED, and it is a measurement

The member built on `00e7af612d428078634d52ea37054bd00b773ca6` and held at
`7458624339009f43c88d936b4bc663fde7607f3c` (`refs/preserve/holding-cg1`, re-read in-shell at GO;
that ref and the lane worktree's detached HEAD agreed, porcelain empty). The slot ref
`claude/composite-r4` had moved to `b2852ccc3cc4753499996da6582dd672e90499d0` — MF-CH1, the 47th
landing — and `git merge-base --is-ancestor b2852ccc 74586243` returned **FALSE** while
`--is-ancestor 00e7af61 74586243` returned TRUE. So the holding tip was rebased
`--onto b2852ccc 00e7af612 74586243`.

**Carry-proof-by-absence at blob level, ten rows, read at all three ends** (build base · slot ·
holding tip). ⚠ The instrument was itself proved before it was believed: a first pass used
`git rev-parse "${SHA}:${path}"`, which ECHOES an unresolvable argument back and exits 0, so every
row read as present. The nonexistent-path control caught it; the table below is `git rev-parse
--verify -q`, with a path that exists at all three ends re-read as a non-vacuity probe.

| path | base | slot | tip | reading |
|---|---|---|---|---|
| `docs/implementation/INDEX.md` | `12b5e8fa1d` | `a4e17f45fa` | `6a92251b1c` | MOVED at the slot — CH-1 landed a packet ⇒ conflict expected |
| `docs/implementation/PACKET_MANIFEST.json` | `7bc924732f` | `87621b19f6` | `4e10c7a16d` | MOVED at the slot ⇒ conflict expected |
| `docs/implementation/packets/town-cartography/MF-CG1.md` | ABSENT | ABSENT | `ab8b297e41` | created by this member |
| `tests/domain/townCartographyCalibration.test.js` | ABSENT | ABSENT | `ed7fe9e327` | created by this member |
| `tests/fixtures/cartography-calibration-corpus.json` | ABSENT | ABSENT | `210d9fa903` | created by this member |
| `tests/fixtures/cartographyCalibrationCorpus.js` | ABSENT | ABSENT | `9bf3f8a1f1` | created by this member |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | `0303493ea2` | `95ed6be312` | `0303493ea2` | ⚠ **MOVED at the slot, tip == base** — CH-1 paid a census row into it ⇒ **the census must be RE-WALKED, never carried** |
| `package.json` | `2b5ec2014c` | `2b5ec2014c` | `2b5ec2014c` | unmoved — **no mint trigger crossed** |
| `package-lock.json` | `1a8a80b12b` | `1a8a80b12b` | `1a8a80b12b` | unmoved |
| `…/NO-SUCH-FILE-CONTROL.md` | ABSENT | ABSENT | ABSENT | **the control that makes the four real ABSENT readings evidence** |

The rebase stopped exactly where the table predicted and nowhere else: INDEX and the manifest,
both resolved **keep-both**. INDEX is a ONE-LINE pure insertion over the slot's file
(`difflib` opcodes: a single `insert` at line 1045), MF-CH1's row first and this member's second.
The manifest was resolved by **string surgery, never re-serialized**: the slot's 169 records are a
byte-identical prefix and this member's record block is verbatim from the holding tip. Deep
compare against both parents: **169 → 170, ADDED `[MF-CG1]`, REMOVED `[]`, DRIFTED `[]`**, top-level
keys and `indexPath` unchanged, slot order preserved.

**The rebased change set is SIX files and ZERO `src/` bytes** — `git diff --name-only b2852ccc HEAD`
filtered on `^src/` returns nothing, which is this member's whole premise (no tuning number moved;
Half B was a measured STOP, re-chartered as CG-1b). The four created files are **blob-identical**
to the holding tip (`ab8b297e41` / `ed7fe9e327` / `210d9fa903` / `9bf3f8a1f1`), and the two resolved
files were committed at exactly the bytes written (`git hash-object` == the committed blob), so no
hook rewrote the resolution.

### §10.2 · THE CENSUS ROW — WALKED AT THE REBASED TREE, AND THE CREDIT PROVED DIRECTLY

The member DEFERRED its census row under §417; this act pays it. The row could not be carried:
the walker itself moved at the slot (row 7 above), so the member's own absolutes describe a tree
that no longer exists.

Slot `2516/366/2150/20863/5808` → tip **`2517/366/2151/20882/5814`**, delta **`+1/+0/+1/+19/+6`** —
identical to the delta the member walked at its own base, which is the receipt that the rebase
moved no title. Every figure was READ FROM THE ARM'S OWN FAILURE MESSAGE in assertion order and
never computed: `files` "expected 2517 to be 2516" → `parked` **PASSED UNMOVED** at 366 →
`credited` "expected 2151 to be 2150" → `titles` "expected 20882 to be 20863" → `suiteTitles`
"expected 5814 to be 5808". Green at the end: `Test Files 1 passed (1)` · `Tests 1 passed |
32 skipped (33)` · exit 0. Arithmetic closes: 366 + 2,151 = 2,517.

**Two negative controls, both red as predicted, both restores `cmp` 0**: the slot's whole tuple put
back reds at `files` ("expected 2517 to be 2516"), this member's +1 exactly; and `credited` ALONE
put back at 2,150 reds at `credited` ("expected 2151 to be 2150").

⭐ **AND THE CREDIT IS PROVED DIRECTLY, not inferred from the totals.** The member's first draft
registered its suites inside an `if (process.env.UPDATE_…) { … } else { … }` at module scope and
the walker PARKED THE WHOLE FILE at birth — nineteen titles swallowed, the arithmetic still
closing, nothing red. So this act read the walker's OWN `parkReasonsFor` / `liveTitlesIn` /
`liveSuiteTitlesIn` for that one file through a deliberately-red probe arm:
`{"inTestFiles":true,"inCredited":true,"inParked":false,"titles":19,"suiteTitles":6,"parkReasons":[]}`.
The walker was restored `cmp` 0 after the probe.

### §10.3 · THE THREE-PLACE LANDED FLIP (§410), each place read back through the validator

`[implementation-packets] valid: 170 packets (0 READY)`, exit 0.

1. **The manifest row** — `status` READY → LANDED and **`verifiedBase` RE-STAMPED** from the build
   base to the slot `b2852ccc3cc4753499996da6582dd672e90499d0` (a re-stamp CH-1 did not owe and
   this member does). Its ten `requiredSymbols` rows were re-read and are every one a **symbol or
   an export marker** — no count, no migration head.
2. **This packet's Markdown header** — `Status` and `Verified base`, both parsed by
   `parsePacketHeader`.
3. **The INDEX STATUS column**, reached through the manifest's `indexPath`.

**FOUR non-vacuity controls, each perturbing exactly one place, all restores `cmp` 0:**

| control | validator |
|---|---|
| INDEX marker alone → READY | refused: `status disagrees with index: manifest=LANDED index=READY` |
| packet header alone → READY | refused: `status disagrees with packet Markdown: manifest=LANDED packet=READY` |
| manifest `verifiedBase` alone → build base | refused: `verifiedBase disagrees with packet Markdown` |
| manifest `status` alone → READY | refused on BOTH the index and the Markdown |

⚠ **A VACUITY CAUGHT AND CURED IN FLIGHT, worth banking.** The INDEX control PASSED on its first
run. `parseIndexPacketStatuses` scans the status cell for the FIRST member of `PACKET_STATUSES`
(order `BLOCKED, DRAFT, LANDED, READY, …`) that appears anywhere in it — and this act's first
draft of that cell said "…and landed at slot `b2852ccc`" in prose, so the cell still read LANDED
with the marker flipped back to READY. **A status word in the prose of a STATUS cell silently
disables the index half of the three-place agreement.** The cell was rewritten so the bold marker
is the only status word in it (measured: exactly one occurrence), and the control then redded.
The row's own standing warning — "keep status words out of it" — is now a measurement, not advice.

### §10.4 · S0, BOTH PARTS

**Part 1.** `node scripts/check-observed-shape-readers.mjs` at this tip: exit **1**, **159 B**,
sha256 `c5b67844abe51226f4c6862ae485dc5d9fa1e51148c70b4bd021e661f1ae0854`. The same command at the
chair baseproof `chair-baseproof-b10ed1a1` (HEAD `b10ed1a1f5a0f2acd00bbfc9b5d0a41931697c3d`, its
own `node_modules`, **porcelain 0 BEFORE and AFTER** — this lane wrote nothing there): exit **1**,
**159 B**, the SAME sha256. **`cmp` exit 0.** The comparison is live, not vacuous: appending ONE
byte to a copy makes the same `cmp` exit 1. Pre-existing, and not this member's.

**Part 2.** The reader-walker literals stand VERBATIM at `tests/lint/observedShapeReaders.walker.
test.js:737` — `{ reads: 1995, identities: 1409, files: 387, bankedReads: 60, taggedRows: 40 }` —
with the walker green, `Test Files 1 passed (1)` · `Tests 27 passed (27)`. The OSR inventory blob
`scripts/.observed-shape-readers-baseline.json` is `8d91fdfa14` at the slot, at this tip and in the
worktree — unmoved.

### §10.5 · THE RE-PROOFS, every vitest run mutexed on the shared lock

| run | target | result |
|---|---|---|
| A | `tests/domain/townCartographyCalibration.test.js` | `Test Files 1 passed (1)` · **`Tests 19 passed (19)`** — the member's nineteen arms |
| B | the cartography stage's own suites (Parcels · Buildings · townSceneCartography) | `3 passed (3)` · `59 passed (59)` |
| C | `tests/property` | `101 passed (101)` · `643 passed (643)` |
| D | `tests/lint/observedShapeReaders.walker.test.js` (S0 part 2) | `1 passed (1)` · `27 passed (27)` |
| E | the §489.3 grep arm re-derived at the rebased tree, **68 files** | `68 passed (68)` · `807 passed (807)` |

The generator golden `tests/fixtures/generator-golden-master.json` is blob `cd8d125ef8` at the slot,
at this tip and in the worktree, sha256 `29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8`
before AND after the whole battery; `generatorGoldenMaster.test.js` rode runs C and E and is green
in both, which is the direct unmoved-golden proof rather than an inference from the hash.

Every run cross-checked its own file count against the paths handed to it (`PASSED_PATHS` vs the
`Test Files` total) — a mis-spelled vitest path is dropped SILENTLY over a green exit, and a
zsh-unsplit `$FILES` has cost an earlier lane a vacuous green.

`[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173)`, exit 0.
`[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134)`, exit 0.
`eslint` over the three touched JS paths exits 0 with empty output, and `--fix-dry-run` changes
nothing. Zero tabs and zero control bytes in the walker diff.

### §10.6 · THE GREP ARM'S OWN UNION IS FIFTEEN TREES, NOT THIRTEEN — a correction by execution

§8 states the widening rule ("the sweep was WIDENED BY SHAPE" to whatever trees the token union
reaches) and then lists thirteen. Re-deriving the union at this tree from §8's own token set —
all fourteen tokens, `git grep -l` across `tests/` — returns **72 paths in eleven trees**, of which
68 are runnable test files. Two of those trees, **`tests/pdf` and `tests/security`**, are absent
from §8's thirteen: `tests/pdf/townMapDocument.smoke.test.js`,
`tests/security/townMapGalleryOptIn.test.js` and `tests/security/townScenePlayerSafe.test.js` are
all reached by the `townMapFixtures` token, and were reached by it **at the member's own build base
too** (verified against `00e7af612`), so this is an omission in the list rather than drift under it.
The rule is right and the enumeration was N−2. **This landing's sweep therefore runs FIFTEEN trees**
plus MF-CH1's eleventh item, the root-level `tests/generation.test.js` that sits outside every tree.
§8's list is left as the member's own record; this section is the correction.

### §10.7 · THE SWEEP, ONCE, AND ITS CLASSIFICATION AGAINST A RE-PROVED SEVEN

The banked set was **re-proved by EXECUTION, at the SLOT** — a detached baseproof worktree at
`b2852ccc` (`$SP/laneTECG1-slotproof`, its own linked `node_modules`, porcelain 0 before and
after), never inherited from a commit subject or from the member's own base run:
`Test Files 5 failed | 1 passed (6)` · `Tests 7 failed | 132 passed (139)` — **exactly seven
titles**, the same seven §8 names:

1. `tests/docs/enforcement-claims.test.js :: every completeness claim carries an @enforced-by tag with ≥1 target`
2. `tests/domain/metronomeCooldownLint.test.js :: the non-cooldown emitter set may only SHRINK …`
3. `tests/lint/clampPrimitiveBaseline.test.js :: baseline exactly matches the files that still define a local clamp/clamp01`
4. `tests/lint/warCostKindPools.walker.test.js :: 'trajectory_misread' retains the five receipt-annex families verbatim`
5. `tests/lint/warCostKindPools.walker.test.js :: 'war_trajectory_losing' …`
6. `tests/lint/warCostKindPools.walker.test.js :: 'war_trajectory_winning' …`
7. `tests/lint/warRulingKindPools.walker.test.js :: 'succession_demand_inherited' retains the five annex families without editorial cross-references`

`tests/lint/sovereigntyLightingContract.walker.test.js` is the sixth file in that run and it
**PASSED at the slot**, which is the control that makes this act's census row attributable rather
than assumed — and, since this act PAYS that row, the arm is green at the tip too.

**THE SWEEP, ONE DRIVE**, mutexed, over the fifteen trees plus `tests/generation.test.js` at these
bytes: `Test Files 5 failed | 1870 passed | 8 skipped (1883)` · `Tests 7 failed | 23,685 passed |
115 skipped (23,807)` · 792.99 s · **SWEEP_TRUE_EXIT 1**.

The failing-title set is **IDENTICAL, set for set, to the seven re-proved at the slot** — compared
mechanically (`diff` of the two sorted `×` lists returns empty), not read side by side. So:

**7 failing titles − 7 re-proved banked = 0. ZERO STRAYS, and ZERO member reds** — the member's
one authorized interior red, its deferred §417 census row, is GREEN here because this act pays it.
`tests/lint/sovereigntyLightingContract.walker.test.js` appears in no failure list at either end:
it PASSED at the slot baseproof and it passes here.

### §10.8 · JUDGMENTS AND DEFERRALS OF THE LANDING ACT

| | |
|---|---|
| **J-TECG1L-1** | **Decided:** resolve the manifest conflict by string surgery on the SLOT's file, splicing this member's record block verbatim from the holding tip, rather than re-serializing. **Why:** the member's own build proved a full re-serialize produces a 26k-line reformat. **Verified:** the slot's 169 records are a byte-identical prefix; deep compare says ADDED `[MF-CG1]`, REMOVED `[]`, DRIFTED `[]`. **Reversal:** re-serialize and take the reformat |
| **J-TECG1L-2** | **Decided:** widen the sweep from §8's thirteen trees to fifteen (adding `tests/pdf` and `tests/security`) plus `tests/generation.test.js`. **Why:** §8's own widening rule, re-executed, reaches those trees through the `townMapFixtures` token, and did so at the member's build base too — the list was N−2 of its own rule. **Reversal:** run thirteen and accept an unswept 187 files. **Blast radius:** wall-clock only; the verdict is unchanged (0 strays either way, since the seven banked live in `tests/docs`, `tests/domain` and `tests/lint`) |
| **J-TECG1L-3** | **Decided:** re-stamp the member's base-dependent header figures rather than leave them describing a tree that no longer exists — `verifiedBase` in both places (§410 requires it), and the collision-group count, RE-MEASURED at the slot as 168 of 169 LANDED with one SUPERSEDED. **Why:** a landed packet's moving-head figures are the trap the next migration inherits. **Reversal:** revert the two header lines |
| **J-TECG1L-4** | **Decided:** correct §8's thirteen-tree enumeration in §10.6 rather than editing §8 in place. **Why:** §8 is the member's own record of what it did; the correction belongs to the act that measured it. **Reversal:** fold §10.6 into §8 |

**DEFERRED, documented, not bugs to re-find.** Everything §9 defers stands unchanged — the cap
change (Half B, re-chartered as CG-1b), the TC-4 byte band's recalibration, and the two questions
that cannot be measured without making the gated change. This act moved no tuning number and no
`src/` byte.
