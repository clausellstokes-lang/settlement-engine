# landing-plan.md — the executable landing for the seven GOLDEN cars

Written by lane GOLDENPLAN (Opus 5), 2026-09-04. **Measurement only — this lane executed nothing
that mutates a ref, an index, a worktree, or a test run.**

---

## 0. The headline

- **7 of 7 cars still needed. 0 superseded.**
- **The rebase does NOT conflict.** The one file both sides moved merges by line offset alone.
- **`commitTrailerRefusal` does NOT block.** It is advisory by design, not unfinished.
- **There IS a real blocker, and it is not the one on the docket:** the product minted a new
  `UPDATE_` env spelling (`UPDATE_MOUNT_BASELINE`) that the golden walker's arm 2 will convict.
  It costs one register entry to cure.

---

## 1. THE ONE COLLIDING FILE — and why it is not a conflict

`tests/property/generatorGoldenMaster.test.js` is the **only** file both branches moved since
`8b07ce45f`. (Product moved 316 files; the consist moved 50; the intersection is exactly 1.)

**It does not conflict.** Two independent read-only three-way inspections agree:

```
$ git merge-tree --write-tree --name-only claude/composite-r4 refs/preserve/golden-build-2026-09-02
ef0f30de54d541bfe14846c8db8464d18b69190f
```
A bare tree oid, exit 0, **no conflicted-path list** ⇒ clean merge.

```
$ git merge-tree fdb2ea62f^ claude/composite-r4 fdb2ea62f | grep -c -E '^(<<<<<<<|>>>>>>>|=======)$'
0
```
Zero conflict markers. Git labels the file `changed in both` and then emits a **merged** result.

**Why they miss each other:** the two sides edit regions ~600 lines apart.

| side | region | what |
|------|--------|------|
| product | lines **18–131** | a 108-line T13 TRANS doc block prepended to the re-record ledger comment |
| golden (car 6) | lines **650** and **761** | the import line, and the `writeFileSync` → `recordGolden` call |

The merge output shows car 6's hunks simply rebasing onto the new offsets:
`@@ -650` → `@@ -758`, `@@ -761` → `@@ -869` — a uniform **+108** shift, exactly the product's
inserted block length.

### RESOLUTION: **none required. It applies mechanically.**
No judgment call, no hunk for a human to decide. Both edits survive intact: the product keeps its
T13 ledger prose, the consist keeps its door migration. Take the merge result as-is.

⚠ The honest caveat: `git merge-tree` is textual. If the rebase is run with a different merge
driver, `merge.conflictStyle`, or a `.gitattributes` merge strategy for `*.test.js`, re-verify.
Default settings were used for the measurement above.

---

## 2. THE REAL BLOCKER — `UPDATE_MOUNT_BASELINE` (must be cured, not optional)

### What it is

Car 2's walker enumerates golden instruments **by pattern over the whole `tests/` tree**:

```js
const GOLDEN_ENV_PATTERN = /^UPDATE_[A-Z_]+$/;      // line 98
const TREE_FILES = walk(join(ROOT, 'tests'))        // line 112 — the WHOLE tests tree
```

and arm 2 asserts:

```js
it('every golden-adjacent env spelling in tests is enrolled or written-excluded', () => {
  … if (ENROLLED_ENVS.has(spelling) || EXCLUDED_ENVS.has(spelling)) continue;
      unclaimed.push(`${rel} reads process.env.${spelling}`);
  expect(unclaimed, 'a same-seed instrument minted under a spelling nobody enrolled — enroll it
    in the register, or write its exclusion. Silence is not a disposition.').toEqual([]);
});
```

The register was measured at `8b07ce45f`. **In the 197 intervening commits the product minted a
new spelling:**

```
claude/composite-r4:tests/lint/dossierMountRegistry.walker.test.js:74:
    const UPDATE = process.env.UPDATE_MOUNT_BASELINE === '1';
```
Landed by `0fdbc53a0` — *"TRAIN 1 cars C2+C3 (lane REGISTRY): the dossier gets a router…"*.

`UPDATE_MOUNT_BASELINE` matches `/^UPDATE_[A-Z_]+$/`; it is in **neither** the 43 enrolled
`recordEnv` values **nor** the 7 `excludedEnvSpellings`. It is a genuine module-scope
`MemberExpression`, so the AST enumerator sees it (this is not the comment-only false positive the
walker was built to ignore). **Arm 2 reds.**

Full env-census diff, base vs product, over `tests/**/*.js` (identical method both sides):
```
+ TUNING_INVENTORY_GENESIS      + TUNING_INVENTORY_NOTE
+ TUNING_INVENTORY_REFREEZE     + TUNING_SIGNATURE_RECORD
+ UPDATE_MOUNT_BASELINE   ← the only one matching ^UPDATE_
```
The four `TUNING_*` spellings do **not** match `^UPDATE_` and are invisible to this walker.
Positive control: the same census reproduces the register's measured `UPDATE_GOLDEN = 40` and
43 env-bearing carriers at the base **exactly**.

### The cure — one entry, chair-level

`UPDATE_MOUNT_BASELINE` governs `tests/lint/.dossier-mounts-baseline.json`, a **mount-registry
ratchet over `src/components`** (`const COMPONENTS = join(ROOT, 'src/components')`). It is not a
same-seed world fingerprint. It belongs on the **exclusion roster**, the same disposition already
given to `UPDATE_SITE_COHERENCE_BASELINE` and `UPDATE_PROSE_SEAMS_BASELINE`.

Append to `excludedEnvSpellings` in `tests/fixtures/.golden-freeze-register.json` (making it 8):

```json
{
  "envSpelling": "UPDATE_MOUNT_BASELINE",
  "files": ["tests/lint/dossierMountRegistry.walker.test.js"],
  "reason": "A dossier-mount REGISTRY ratchet baseline over src/components, not a same-seed world fingerprint. It records which mounts exist and which facts are routed, not what a seed produces. Minted by 0fdbc53a0 after this register's inventory was measured at 8b07ce45f."
}
```

**Governance:** this is NOT a hand-edit of a measured field. The register's own `_doc` forbids
hand-editing `sha256`, `rows`, `seedSet`, `distinctFloor`, `frozenConstants`, `ownerRow` — all of
which stay `null`. An exclusion is an affirmative written disposition; under `ACTIONS`, protection
that only **grows** is chair-signed vetoably. **Chair act, not owner-gated.** Record it in the
ledger.

⚠ Do it in the SAME commit as car 1 (amend car 1) or as a fixup landing before car 2. If car 2
lands without it, the gate reds — and per the known-failure census law an 11th failing identity
**cannot be banked** (§6 below).

---

## 3. `commitTrailerRefusal` — DOES NOT BLOCK

**Where it lives:** `tests/helpers/goldenRecordDoor.js:210`, on the golden tip **only**. Absent
from `claude/composite-r4` entirely. Exactly four references exist, all inside the consist:
the definition, the walker's import (line 74), and two walker assertions (lines 769, 773).
**Zero non-test callers.**

**What "unwired" actually means:** it is a pure exported checker with test coverage and no
production caller — and that is the documented design, in its own docblock:

> ⚠ NO GIT HOOK IS INSTALLED BY THIS LANE, and that is deliberate rather than unfinished.
> §709.5 measured the reason: the sandbox line carries zero `.husky/` and zero `scripts/`
> enforcement, so a hook is absent from exactly the line where an unsupervised re-record is most
> likely. The in-tree walker is the load-bearing half BECAUSE hooks do not exist on every line.
> … So the rule is exported here for chair tooling to call where chair tooling runs, and the
> walker enforces the same closure in-tree where it always runs.

And the walker's own header, line 20:

> …which is why the load-bearing half of the freeze lives here and the commit-trailer backstop
> **is merely advisory.**

**Is it a precondition of the GOLDEN freeze?** **No.** Nothing in the register, the door, or the
walker gates the freeze on a caller existing. The freeze act is gated on `frozenAt`/`frozenAtSha`/
`genesis` being cut together through the door — the tri-state closure — not on the trailer.

**What breaks if it stays unwired:** a golden re-record commit can be authored without an
`Owner-Signed: §NNN` trailer. The *authorization* is unaffected — the door still refuses unless
`GOLDEN_SHIFT_SIGNED` names a signed record on disk whose parsed content authorizes that exact
surface, and the walker still convicts an unenrolled or unbound move on every gate run. What is
lost is only the redundant commit-message attestation.

**Assessment of R11 (HIGH, "UNWIRED"):** the grade is a misread. "Exported, tested, uncalled" is
the intended shape of an advisory backstop on a line with no hook infrastructure. **Recommend
regrading R11 to INFO/ACCEPTED with the two quotations above as its rationale** — a documented
deferral, not a defect. Wiring it would require installing a `.husky/commit-msg` hook, which
mutates a shared config surface other lanes commit against, and which §709.5 measured as absent
from the sandbox line anyway.

**Judgment recorded for veto:** I am ruling this NOT a blocker on documented-design evidence.
A reviewer who disagrees should re-read `goldenRecordDoor.js:198–214` and
`goldenFreeze.walker.test.js:17–21` and say so.

---

## 4. THE CENSUS BILL — what the landing owes because car 2 is a NEW TEST FILE

Car 2 adds exactly one `.test.js`: `tests/lint/goldenFreeze.walker.test.js` (84 `it(` arms,
12 `describe(` blocks — text count, not `vitest list`). Car 3's `goldenRecordDoor.js` and car 5's
`scripts/dormancy-bit-compare.mjs` are **not** `.test.js` and owe nothing here.

**The consist carries NEITHER cure.** Verified: the 50-file union contains no lighting baseline
and no mutation manifest. Both are owed at landing.

### (a) Lighting census — OWED
`tests/lint/.lighting-census-baseline.json`, currently at `53fd36d2c` (§890 train +O-17):
```
files 2510 · parked 370 · credited 2140 · titles 22841 · suiteTitles 6142
```
`sovereigntyLightingContract.walker.test.js` walks `tests/` for `.test.js|.test.jsx` and pins with
exact `.toBe()`. **+1 file ⇒ red.** Car 2's walker is deliberately written in straight-line
`it('literal')` form with no `it.each`, so it will be **credited**, not parked — its titles land in
`titles` and `suiteTitles` too.

**PREDICTED:** `files` → **2511**.
**I CANNOT DERIVE** `parked`, `credited`, `titles`, `suiteTitles`. I refuse to name them. They are
not arithmetic on 84 — the walker's title-counting and park rules are its own, and the baseline's
`_doc` forbids hand-editing the five figures outright. **Regenerate; never hand-patch `files` alone.**

```
LIGHTING_CENSUS_REFREEZE='<lane/seat id>' LIGHTING_CENSUS_NOTE='TE-GOLDEN-1 lands: +1 test file, tests/lint/goldenFreeze.walker.test.js' \
  npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
```
Refuses on a dirty tree; writes all five or none; **exits non-zero by design** — re-run plainly
afterwards and that green is the receipt.

### (b) mutationCoverageManifest TOTALITY — OWED
`tests/lint/mutationCoverage.shared.mjs` enumerates every `*.test.js` under **eight** enforcer dirs
(⚠ eight, not the seven older notes record — `tests/generators` was added):
`tests/lint, design, docs, data, copy, security, edgeFunctions, generators`
plus, elsewhere, any basename matching
`/(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i`.

`tests/lint/goldenFreeze.walker.test.js` qualifies **twice over** (enforcer dir + `walker`/`golden`).
It owes one entry in `scripts/mutation-coverage-manifest.json`
(currently `invariants` 656, `rationales` 41, `uncoveredBaseline` **186**).

⛔ `uncovered` is refused twice — the header forbids it and the shrink-only arm pins the count
**exactly** at `uncoveredBaseline`. The two lawful dispositions:
1. a **`rationale`** entry, written reason ≥ 40 chars — the estate's normal answer (41 already), **or**
2. a standing plant in `scripts/mutation-sweep.sh` — a TWO-FILE edit (plant + a `MUTATED_FILES` row,
   or the dirty-guard arm reds).

**Recommend (1).** The walker already ships five in-memory plants that run on every gate; a
rationale can cite them. A sweep plant would need `git checkout --` for its revert, which this
program's shared-tree protocol forbids.

### (c) negativeAssertionAnchor — **NOT OWED**
Generation-root scoped; a `tests/lint` file does not red it. Recorded as proved by execution in
both directions on 2026-08-23 (TE-CH-1). ⚠ Carried from memory, not re-executed by this lane.

---

## 5. REGISTERS THAT DO NOT MOVE — predicted in writing

The consist touches **zero `src/`** and **zero `package.json`**. That single fact discharges most
of the register surface.

| register | verdict | basis |
|---|---|---|
| **`sizeBaseline`** | **NO MOVEMENT** | `scripts/.size-baseline.json` has 8 entries, **all** under `src/`. CONFIRMED by enumeration. |
| **writer-reach** | **NO MOVEMENT** | `writerReach.walker.test.js` scopes to `src/domain/worldPulse` + `src/components`. |
| **prose numerics** | **NO MOVEMENT** | prose walkers scan `src/`; the consist adds no src prose. |
| **observed-shape / OSR** | **NO MOVEMENT** | subject tree is `src/`; `scannerToolFiles()` is a fixed list — `package.json`, `package-lock.json`, `scripts/lib/*.mjs`, `check-observed-shape-readers.mjs`. **`scripts/dormancy-bit-compare.mjs` is NOT in it**, so car 5 does not perturb scanner provenance. ⭐ No dossier-prose leaf is regenerated, so the OSR input arm is untouched, and `MIN_ROWS=40` is nowhere near. |
| **dossier mounts** | **NO MOVEMENT** | `dossierMountRegistry.walker.test.js` scans `src/components`. (It is nonetheless the *source* of the arm-2 blocker in §2 — different mechanism entirely.) |
| **test ratchet totals** | **NO MOVEMENT** | `totalTests 31141` / `totalFiles 2458` are **collapse floors** (`SCOPE_FLOOR_RATIO`), not exact pins — growth cannot red them. `skippedCeiling 1`; the consist adds no skips. |
| **docs enforcement-claims** | **NO MOVEMENT** | Ran the live `CLAIM_RE` against `docs/shift-records/README.md`: **zero hits**. No census row owed. ⭐ This matters because that scanner reads `fs.readdirSync`, not `git ls-files`. |
| **golden register's own floors** | **PASS** | `envCarriers ≥ 43`, `constantCarriers ≥ 3`, `surfaces ≥ 48` are all `toBeGreaterThanOrEqual`. The +1 carrier passes. |
| **`unresolvedRoster` arm** | **PASS** | asserts the 6 fixtureless dormancy suites still exist. Dormancy roster is **unchanged**: 32 suites / 27 fixtures at both base and product, zero added, zero removed. |
| **constant-carrier sites** | **PASS** | espionage fences measure 1 / 11 / 11 at both base and product, matching the register's `constantSites`. Two of three blobs are byte-identical. |

### Figures I refuse to name
- lighting `parked`, `credited`, `titles`, `suiteTitles` after landing — **underivable without
  executing the instrument**, and hand-editing them is forbidden by the baseline's own `_doc`.
- Whether all 84 of car 2's arms pass against the post-landing tree. **Only arm 2 is provably red**
  (§2). The other 83 were read, not executed. I did not run vitest.
- The exact runnable test count car 2 contributes. 84 is a `grep -c '^\s*it('` count, not `vitest list`.

---

## 6. THE KNOWN-FAILURE CENSUS — why the §2 cure is mandatory

`scripts/.test-ratchet-baseline.json` at `69bd44f65`:
```
entries: 10 keys        ← the census is FULL at 10/10, ZERO headroom (CONFIRMED)
totalTests 31141 · totalFiles 2458 · skippedCeiling 1 · uncollectedSuites 0
```
`check-test-ratchet.mjs` header: *"A NEW REGRESSION IS NEVER BASELINED. `--update` can only
REMOVE entries."*

⇒ If car 2 lands with arm 2 red, there is **no lawful disposition**. It cannot be banked as an
11th row. The landing would have to be reverted or the cure applied anyway. **Apply the §2
exclusion before car 2 lands. It is a precondition, not a follow-up.**

---

## 7. ORDER — the built order is already correct; preserve it

The chain must not be reordered. Car 2 (the walker) is **last** in the chain despite its name, and
that is load-bearing — it imports and reads what every earlier car creates:

- reads `tests/fixtures/.golden-freeze-register.json` → **car 1 first**
- imports `tests/helpers/goldenRecordDoor.js` → **car 3 before it**
- enforces the door-import closure over the 43 capture arms → **car 6 before it**
- imports `rawBitFormOf`/`stableBitFormOf` from `dormancyOracle.js` → **car 4 before it**
- `readdirSync('docs/shift-records')` and reads its README → **car 7 before it**

**Order: 1 → 3 → 6 → 4 → 7 → 5 → 2** — i.e. exactly the existing parent chain
`635dc0f70 · 98627d11f · fdb2ea62f · cc625eb24 · 4a0ba7933 · 3e8238282 · ba08939d7`.
A plain rebase preserves it. **Do not cherry-pick out of order.**

---

## 8. THE COMMAND SEQUENCE

⚠ Read `shared-tree-git` first. Confirm no gate is running and the tree is clean/attributable.
Never `git add -A`. Never `git stash`.

```bash
cd /Users/cstokes/Desktop/settlement-engine

# ── 0. FRESH STATE. Trust nothing cached, including this document's shas.
git status --porcelain
git rev-parse --short claude/composite-r4                       # expect ca651d54b or later
git rev-parse --short refs/preserve/golden-build-2026-09-02      # expect ba08939d7
git merge-base claude/composite-r4 refs/preserve/golden-build-2026-09-02   # expect 8b07ce45f…
# If the product tip has MOVED past ca651d54b, re-run §2's env census before proceeding:
git grep -h -o -E 'process\.env\.[A-Z0-9_]+' claude/composite-r4 -- 'tests/*.js' \
  | sed 's/.*process\.env\.//' | grep -E '^UPDATE_' | sort -u
#   Any ^UPDATE_ spelling not in the register's enrolled+excluded sets needs its own §2 entry.

# ── 1. DEDICATED DOCK. Never rebase the shared worktree.
#    ⛔ NEVER materialise node_modules — link the dock's own, per standing law.
git worktree add /tmp/dock-golden -b landing/te-golden-1 refs/preserve/golden-build-2026-09-02

# ── 2. REBASE ONTO THE PRODUCT TIP. Predicted: clean, no conflict (§1).
cd /tmp/dock-golden
git rebase claude/composite-r4
#   EXPECTED: seven commits replay with no stop.
#   If it DOES stop on tests/property/generatorGoldenMaster.test.js, the resolution is
#   KEEP BOTH: the product's lines 18–131 T13 doc block AND car 6's two edits
#   (the `recordGolden` import replacing writeFileSync, and the recordGolden(...) call).
#   They are ~600 lines apart; there is no semantic overlap and no judgment to make.

# ── 3. THE MANDATORY CURE (§2) — fold into car 1 so no commit is ever red.
git rebase -i claude/composite-r4     # mark car 1 (635dc0f70's replay) as `edit`
#   append the UPDATE_MOUNT_BASELINE object to excludedEnvSpellings (json in §2)
git add tests/fixtures/.golden-freeze-register.json     # EXPLICIT path, never -A
git commit --amend --no-edit
git rebase --continue

# ── 4. THE CENSUS BILL (§4) — one commit, both cures, landing on top.
#   (a) mutation manifest: add the rationale entry for tests/lint/goldenFreeze.walker.test.js
#   (b) lighting census: REGENERATE, never hand-edit.
LIGHTING_CENSUS_REFREEZE='<lane/seat>' LIGHTING_CENSUS_NOTE='TE-GOLDEN-1 lands: +1 test file' \
  npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
#   ⛔ exits NON-ZERO by design. That is not a failure. Re-run it plainly; THAT green is the receipt.
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
git add tests/lint/.lighting-census-baseline.json scripts/mutation-coverage-manifest.json
git commit    # subject names both cures and the +1 file

# ── 5. PROVE IT. The new walker and its neighbours, then the whole gate.
npx vitest run tests/lint/goldenFreeze.walker.test.js          # 84 arms — arm 2 is the one at risk
npx vitest run tests/lint/tuningRegister.walker.test.js        # predicted GREEN unchanged (cars.md)
npx vitest run tests/lint/mutationCoverageManifest.test.js
npx vitest run tests/property/generatorGoldenMaster.test.js    # the merged file
npm run check   # or the project gate — OUTLAST it in your own turn; capture the exit status

# ── 6. Only then fast-forward the product branch. ⛔ OWNER-GATED: the push is not yours.
```

**Post-landing:** `frozenAt` stays `null`. **The landing is NOT the freeze act.** The freeze cuts
`frozenAt` / `frozenAtSha` / `genesis` together through the door on the post-T13 tree, owner-signed,
as a separate act. While unfrozen the walker asserts the **inverse** — that no row carries a
recorded value — so a lane that fills one early convicts immediately.

---

## 9. Residual risks a later chair must own

1. **The 83 unexecuted arms.** Only arm 2 is provably red. The consist was built and sealed against
   `8b07ce45f`; 197 commits have passed. Any other arm reading the live tree could have drifted.
   Highest-suspicion arms (all read the tree, all checked here and predicted green, none executed):
   the fixture-claim arm, the constant-site arm, the `unresolvedRoster` arm, the three floors.
2. **The product tip may move again.** Every figure here is anchored to `ca651d54b`. Re-run step 0's
   env census before landing; that is the check that caught the blocker.
3. **A second new `^UPDATE_` spelling** could land in the meantime. Same cure, same place.
4. **R11's regrade** (§3) is a judgment call I made under delegated authority. It is vetoable.

---

## 10. ⚠ ADDENDUM — two GOLDEN docks already exist. Do not rebase them.

`git worktree list` shows, under session `825f209c…`:

```
…/scratchpad/laneGOLDEN-tree   ba08939d7 (detached HEAD)   ← the build lane's own dock, AT the golden tip
…/scratchpad/laneGOLDEN-ctrl   8b07ce45f (detached HEAD)   ← its control dock, AT the merge base
```

These are the build lane's docks, not this landing's. **Rebasing `laneGOLDEN-tree` in place would
destroy another lane's dock and the sealed tip it holds.** Step 1 of §8 deliberately creates a
*fresh* worktree on a *new branch* (`landing/te-golden-1`) rather than reusing either. Keep it that
way. The consist is preserved by the ref `refs/preserve/golden-build-2026-09-02`, so the new branch
can be discarded and remade freely.

Also confirmed at plan time: the shared worktree HEAD is `review-fixes-2026-07-08` @ `04f6b255e`,
i.e. **not** on the product branch — so a landing must target `claude/composite-r4` explicitly and
must not assume the shared tree is checked out to it.
