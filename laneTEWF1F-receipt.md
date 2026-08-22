# laneTEWF1F — EXECUTOR RECEIPT for packet WF-1F (the §326.4 micro-batch)

- **Lane:** TE-WF1F (executor). The chair CASes; this lane moves no ref.
- **Built at:** `claude/composite-r4` @ `3ac279db4232cc65abb57c4fa016578efd0f695d` (WF-1E).
- **REBASED ONTO:** `27c250f94bb7c5c799693a62985c5ddecd4b6c7c` (MF-T2D's landing) when TE-T2D
  landed first, per the slot-aware law.
- **TIP FOR CAS: `5d18b4a0c5515baa795c6fc763258a17d607d1ed`** — ONE commit, parent
  `27c250f9`, which is the branch tip, so the CAS is a clean fast-forward.
- **Worktrees:** `<scratchpad>/tewf1f-tree` (build, own `node_modules`, `npm ci` TRUE_EXIT=0)
  and `<scratchpad>/tewf1f-tree2` (rebase). Pristine `git archive` trees at BOTH bases.
- **Work order:** `<scratchpad>/laneTCWF1E-WF-1F-seed.md` (pre-executed seed, ODQ §333.1 /
  §326.4). ⛔ Every figure in it was re-executed here; nothing was inherited.

---

## §1 · PREFLIGHT — RE-DERIVED AT MY OWN BASE, BEFORE THE FIRST EDIT

| premise | seed's figure | MY measurement | verdict |
|---|---|---|---|
| preamble SHA-256 | `f4cd39fe…` (780 lines) | identical at BOTH bases | ✅ unmoved |
| `realmEvents.js` | 309 eff, 800 ceiling, no baseline row | **309** eff / 447 wc-l; `src/domain/**.js` ⇒ 800; absent from the 16-row size baseline | ✅ |
| `subsystemRowsVirtual.js` | 723 eff, no baseline row | **723** eff / 1300 wc-l; absent | ✅ |
| zero-headroom four | 797 / 818 / 1581 / 941 | **797 / 818 / 1581 / 941** | ✅ frozen table exact |
| `CENSUS_SCOPE_RE` excludes `display/` | asserted | `/^src\/domain\/(?:worldPulse\|spatial)\//` at `couplingInclusion.walker.test.js:615` | ✅ no pair, no registry row |
| four `worldPulse → display` precedents | 4 | `chronicle.js:16`, `eventProse.js:36`, `pressureModel.js:2`, `settlementStrategy.js:53` | ✅ |
| prose-numerics baseline | 413 rows, member files unkeyed | **413 rows, 0 member hits** | ✅ no address can rot |
| §104.4 edge-bundle metas | 5 metas, no member path | **5 metas (110/66/111/2/2 inputs), 0 hits** | ✅ NOT INCURRED |
| `PACKET_MANIFEST` | terminal-only | 136 rows, 135 LANDED + 1 SUPERSEDED, **zero non-terminal** | ✅ no path reserved |
| committed pins of fallback names | ONE, `pantheon.test.js:416` | **ONE**, verified BY SYMBOL, and confirmed empirically | ✅ |
| fixtures/goldens carrying arc phrases | zero | **zero** in `tests/fixtures/`; no preset declares `faithUnseatingEnabled` | ✅ |

**Baseline instruments captured BEFORE the first edit:** the six-file battery
(lighting walker, anchor walker, coupling walker, subsystemRowsVirtual, pantheon,
worldpulseDeityGolden) → **113 passed, TRUE_EXIT=0**.

### ⭐ ADDRESS CORRECTION (the §P0 line-rot law, harmless)

The seed places the stale-snapshot control at `:421`. At my base it is at **`:419-420`**; the
symbol anchor (the `slugArcs` block inside A1) resolves correctly, so the two-anchor law absorbs
it. The re-recording pin IS at `:416` exactly as the seed states.

---

## §2 · THE THREE ITEMS, AS BUILT

### Item 1 — RAISED-B, the cure

`deityNameForRef`'s two fallback lines are replaced by `return deityDisplayNameFromRef(deityId);`
plus one import. Both stale comments rewritten. **`realmEvents.js` 309 → 309 eff: NET ZERO.**
`pulseKernel.js` appears in **no hunk of this member's diff**, so its zero-headroom obligation is
discharged by absence — and it was re-measured at 1581/2865 anyway, on both instruments, at both
bases, before and after the pre-commit hook.

⛔ The wider `deityNameFromSnapshots` was REFUSED as the seed charters, and the refusal is now
MACHINERY rather than prose — see §4 mutant (b).

### Item 2 — `src/domain/certification/subsystemRowsVirtual.js:1268`

ONE physical line, changed in place (`git diff --numstat` = `1 1`). `other.length` **2,505 →
2,786** measured at RUNTIME on both trees (not counted off the source line, where escapes inflate
it), against the contract's `> 400` floor. Row still grades UNOBSERVED.

⚠ Two unescaped apostrophes in my first draft broke the single-quoted literal and were caught by
`node --check` and by A7's own acorn parse — not by eye. Recorded because the next lane editing a
long single-quoted certification row will meet the same trap.

### Item 3 — `tests/lint/couplingInclusion.walker.test.js:157`

Comment-only. Names both importers and the licensing row
`CPL-23.FAITH_TO_WAR.WF-1d.dissolution_names_the_fall` (verified live at
`couplingRegistryWar.js:545`), mirroring `patronFall.js`'s own WF-1D M4 header. Ratio unaffected.

⛔ **The forbidden-matcher trap was PRICED BEFORE THE EDIT, by measurement:** neither this file
nor `pantheon.test.js` carries a row in `FROZEN_UNANCHORED_NEGATIVES`, so each sits at an EXACT
ceiling of ZERO. Both were scanned after the edits — **zero sites** — and mutant (e) plants one
deliberately to prove the trap is live.

---

## §3 · THE DECLARED SHIFT — PROVED KEY BY KEY, TWICE

Probe `laneTEWF1F-probe.mjs` reproduces A1's fixture verbatim and sweeps eleven ref FORMS. Run
against a `git archive` tree of the base and against the wired tree, same harness.

```
keys pristine=45 wired=45
added=0 removed=0
MOVED=14
```

Every one of the 14 movers is a name-bearing string of a ref whose LAST segment carries `_` or
`-`. Unmoved: the `deity:<Name>` production shape, every scan-resolved arm, the empty ref, and
the beat's `id` / `score` / `tags` / `impactKind` / `settlementIds`.

**Agreement measured, not hoped:** for all **11** swept refs the headline equals
`The Last Altar of ${deityDisplayNameFromRef(ref)}` — **11 matches, 0 divergences.**

**The blast radius was EXECUTED, not trusted.** Wired tree against the untouched committed corpus:

```
AssertionError: expected 'The Last Altar of Sun Of The Deep For…' to be 'The Last Altar of Forge'
Tests  1 failed | 40 passed (41)
```

**EXACTLY ONE committed pin re-records** — the seed's claim reproduces empirically.
`worldpulseDeityGolden.test.js` is green on both sides; the golden-motion STOP does not fire.

⛔ The re-recorded value was derived by EXECUTING the cured helper, never predicted.

⭐ **Re-proved after the rebase** on a fresh archive of `27c250f9`: 45 keys, 0 added, 0 removed,
**14 moved**, the identical set — and the two pristine transcripts are byte-identical to each
other, which is the affirmative statement that MF-T2D changed nothing this member observes.

---

## §4 · MUTANTS — EXECUTED, `md5`-EXACT RESTORES

Planted by `cp`, `node --check`ed, convicted, restored, restores proved by `md5`. ⛔ Never the
`git checkout` family. Post-restore **75/75 green**, `git status` showing exactly my files.

| mutant | predicted | **MEASURED** |
|---|---|---|
| (a) revert the cure to the tail-pop | the re-recorded arm alone | **A1 alone** ✓ |
| (b) delegate to `deityNameFromSnapshots` | — | ⛔ **36/36 PASSED.** After the guard: **A1 alone** |
| (c) title-case only the first token | A1 | **A1 alone** ✓ |
| (d) truncate the certification row | registry contract | **that arm alone** ✓ |
| (e) spell a scanned matcher in the new prose | anchor walker | **that arm alone** ✓ |

⭐ **Mutant (b) is the finding.** The seed forbade the wider delegation in prose; the executed
mutant proved nothing in the estate would have caught it. The new arm builds the one world where
the two resolvers disagree — a town whose PATRON is Harrow but which still keeps the forge creed
as a CULT — and pins the floor's casing. Probe evidence, printed before the pin was written:

```
PROD headline (cult-carried ref)  = "The Last Altar of Sun Of The Deep Forge"   ← the floor
WIDER deityNameFromSnapshots      = "Sun of the Deep Forge"                     ← the widening
```

---

## §5 · CENSUS — STILL, CONVICTED, AND NEVER CARRIED ACROSS THE REBASE

**At the ORIGINAL base `3ac279db`:** convicted `2490/364/2126/20669/5778` → delta **+0 ×5**.
**At the REBASE base `27c250f9`:** re-derived from scratch, convicted
`2492/364/2128/20677/5780` → delta **+0 ×5**. The first tuple was **DISCARDED, never carried**.

| # | figure | conviction at `27c250f9`, verbatim |
|---|---|---|
| 1 | `files` | `expected 2492 to be +0` |
| 2 | `parked` | `expected 364 to be +0` |
| 3 | `credited` | `expected 2128 to be +0` |
| 4 | `titles` | `expected 20677 to be +0` |
| 5 | `suiteTitles` | `expected 5780 to be +0` |

The lighting walker is **GREEN UNTOUCHED** at both wired tips (33 passed), restored `md5`-exact
after each conviction sweep, and `git diff` against the walker file is EMPTY. **No re-record
block was written and none is owed** — the seed's prediction of stillness holds.

⭐ **`suiteTitles` proved SEPARATELY** (a sequenced census that stops early never runs its later
figures): the whole member diff over `tests/` carries **ZERO** added and **ZERO** removed
`describe(` lines, and **ZERO** added `it(`/`test(` lines. `pantheon.test.js` runs 36 tests
before and 36 after.

---

## §6 · THE REBASE, EXECUTED TO THE LETTER OF THE SLOT-AWARE LAW

TE-T2D landed while this member was in proof. Executed:

1. Fresh detached worktree at `27c250f9`; `git cherry-pick --no-commit 623ed269`.
2. Only `PACKET_MANIFEST.json` conflicted. ⛔ **The auto-merge of `INDEX.md` was NOT accepted
   either** — both shared metas were **BYTE-RESTORED from the new base** (`git show 27c250f9:…`,
   `md5` verified equal to the base blob) and my appends **re-run**. This is the
   merge-destroys-cures law applied before it could bite.
3. My row sits **LAST** in the manifest, after MF-T2D — landing order preserved (138 rows).
   T2D's own INDEX row survives (grep count 1) and mine is inserted after WF-1E's.
4. `INDEX.md` **+1/−0** and `PACKET_MANIFEST.json` **+118/−0** — both PURE APPENDS, no
   re-serialization of the manifest.
5. The five carried files are `md5`-identical to my pre-rebase commit's versions.
6. Every base-dependent figure re-derived at the new base; only the census tuple, the
   `verifiedBase` sha and the packet count changed, and all three were corrected in prose.

---

## §7 · PROOF TABLE — EVERY EXIT CAPTURED IN-SHELL

| step | result | TRUE_EXIT |
|---|---|---|
| `npm ci` (own `node_modules`) | ok | **0** |
| baseline battery at the PRISTINE base, pre-edit | 6 files, **113 passed** | **0** |
| behaviour + walker battery at the rebased tip | 12 files, **194 passed** | **0** |
| `npx eslint` × 4 member files | clean | **0** |
| `npm run typecheck:ratchet` | `no type regressions (173 error(s), ceiling 173)` | **0** |
| `npm run typecheck:domain:strict` | `no strict-type regressions (1134 errors, ceiling 1134)` | **0** |
| `validate:packets` @ DRAFT / READY / LANDED | 137 (0 READY) / 137 (1 READY) / **138 (0 READY)** | **0** |
| lighting walker, untouched, at both tips | 33 passed | **0** |
| mutants (a)–(e) + post-restore | as tabled; **75/75** after | **0** |
| `git commit` (rebased) | 7 files, 523+/20− | **0** |

⚠ Both typechecks reported at their exact floors with the config named (§P5).

⚠ **The pre-commit hook ran `eslint --fix` over my four JS files and re-updated the index — an
edit after a green run, so the green was VOIDED and RE-EARNED.** `git diff HEAD` is empty, the
effective-line instrument was re-run on the committed tree (309 / 723 / 1581 unchanged), the
declared-shift probe was re-run on the committed tree and is byte-identical to the proved
transcript, and the 12-file battery was re-run green. The hook's own backup stash was cleaned up
by the hook; the visible `stash@{0}` is the OWNER'S pre-existing stash from
`analytics-intelligence-layer` and is untouched. **This lane ran no `git stash`.**

---

## §8 · THE SIX BANKED REDS — EARNED EMPIRICALLY, NOT ASSUMED

`npx vitest run tests/lint tests/build` → **5 failed of 2,114**: `warCostKindPools` ×3,
`warRulingKindPools` ×1, `clampPrimitiveBaseline` ×1. A sixth, `enforcement-claims`, fails in
`tests/docs`.

1. **Baseline LOOKUP first** (never an inference): all six titles carry rows in
   `scripts/.test-ratchet-baseline.json` (7 entries).
2. The five reproduce **identically — `5 failed | 76 passed`** at the **pristine `git archive`
   tree** of my base, a tree containing none of my edits.
3. ⭐ The `enforcement-claims` offenders were compared **LIST-TO-LIST, not by count**: the same
   **six** lines in the same three documents at pristine and wired. My contribution is **zero**,
   and a `CLAIM_RE` scan of my packet and of `INDEX.md` returns **0 hits**.

Nothing was banked. `test:ratchet:update` was never run.

---

## §9 · JUDGMENT CALLS (all vetoable)

- **J-TEWF1F-1 — the three new arms are folded INSIDE the existing `A1` test, not added as new
  `it()` calls.** The seed prices the census delta at exactly `+0 ×5`, and "arm" is this estate's
  word for an assertion group rather than a title (WF-1C's own "separately labelled measured-truth
  ARM" is a block inside A1). New titles would have moved figure 4 and owed a re-record.
  *Veto: split them into their own `it()` calls and re-record the tuple.*
- **J-TEWF1F-2 — a scan-width guard was written that the seed did not require.** Mutant (b)
  passed 36/36, proving the seed's ⛔ against `deityNameFromSnapshots` was prose with no
  machinery behind it. Zero titles, zero production lines. *Veto: drop the arm and accept that a
  future widening of the arc producer's scan goes unseen.*
- **J-TEWF1F-3 — the packet, manifest row and INDEX row were authored rather than deferred.**
  The seed's priced shape names the packet as one of the five handwritten files, and the family
  precedent (WF-1E) is that the executor carries DRAFT → READY → LANDED. *Veto: any of the three
  surfaces is re-authorable without touching code.*

## §10 · RAISED TO THE CHAIR

- ⭐ **RAISED-1 — A THIRD STALE CLAUSE WAS FOUND IN THE §326.4 ROW AND REPAIRED BEYOND THE
  CHARTER.** The row's *"NOTHING IN PRODUCTION READS THE RING AT THIS WAVE"* is falsified by
  **WF-1E**, which landed at this member's own base: `religionState.js:644` projects the record
  and `faithPanelModel.js:197` renders it. The repair sits on the same physical line the charter
  already opened and changes no behaviour, but the charter was widened by one clause. *If the
  chair prefers the narrow charter, the clause reverts in a one-line edit — but it will then be
  knowingly false in a certification row.*
- ⚠ **RAISED-2 — the cure also changes `custom:lu_<name>` refs**, which is the shape the test
  helper `deitySnapshot` mints throughout `pantheon.test.js` (`custom:lu_vael` → "Vael" becomes
  "Lu Vael"). **No committed pin moved**, because every such pin is scan-resolved. Recorded so a
  future fixture that lets one fall through the floor is not re-found as a defect.
- ⚠ **RAISED-3 — mutant (b)'s survival is a family-level lesson.** A seed's ⛔ is not a guard.
  This one had been written into the compile as a prohibition and would have been silently
  violable by the next lane. Worth a preamble line: *a chartered refusal owes a pin, or it is
  only a wish.*
- ℹ **RAISED-4 — `.gitignore` carries `node_modules/` with a trailing slash**, so a worktree
  whose `node_modules` is a SYMLINK shows as untracked `??`. Never staged here (explicit staging
  only, verified against `git diff --cached`), but a lane using `git add -A` would commit it.

---

## §10b · CHAIR RULINGS ON THIS LANE'S RAISED ITEMS (received with the terminal GO)

- **RAISED-1 — RATIFIED, the third repair stays.** The chair's reasoning: a certification row
  that is knowingly false the moment it lands is worse than a scope nudge on a line the charter
  had already opened; WF-1E's landing falsified the clause at this member's own base, and
  truth-maintenance on certification prose is the §320-family law. Recorded as a chair-ratified
  beyond-charter act with WF-1E's two reader addresses as the evidence.
- **J-TEWF1F-2 — RATIFIED**, and it earns a sentence in the collection row: the seed's
  prohibition was prose with no machinery — a dead law of exactly the class §321 convicted in the
  Chronicle row — and the guard gives it teeth with a discriminating fixture at zero census and
  zero production cost. Mutant (b) convicting via A1 alone is the proof the prohibition now
  exists.
- **J-TEWF1F-1 — RATIFIED** on the WF-1D precedent (arms folded into an existing test to hold
  the census at zero), with the standing condition already satisfied: each folded arm convicts
  via the mutant map rather than riding along.
- The chair also read the rebase record as to law.

## §10c · ⚠ A FOURTH FINDING, MEASURED AFTER THE GO AND DECLARED BEFORE THE GATE

Reviewing the committed diff adversarially turned up one further difference the seed had not
named and the shift proof had not covered, because the sweep used only realistic refs:

```
deityId      PRE-CURE                        POST-CURE
null         "The Last Altar of Null"        "The Last Altar of "
undefined    "The Last Altar of Undefined"   "The Last Altar of "
0 / false / 123                              byte-identical across the cure
```

**PROVED UNREACHABLE rather than argued.** `changes[].deityId` is an `Object.keys()` iteration
variable over the pantheon ledger (`pantheon.js:384` and `:441`), so it is always a non-empty
string; the two upstream builders (`ratchetFaith`, `collectFaithDeltas`) each guard
`deityId == null` before a key is ever minted. The note is carried in the packet anyway, because
the declared-shift claim is scoped to REACHABLE copy and an unreachable difference left unstated
is what a later lane re-finds as a defect. The tip moved to `5d18b4a0…` to carry it.

## §10d · ⚠ THE TERMINAL WAS RUN TWICE, AND THE FIRST 143 IS NOT A GATE STATUS

The first `check:tail` was killed by the HARNESS at its 10-minute ceiling (exit 143). ⛔ That
status is the wrapper being killed, never the gate's verdict — the log held only the npm banner,
and `gate-tail.sh` writes its real output to its own temp log and prints the tail only at the
end, so a killed run yields no verdict at all.

**Diagnosed rather than retried blindly:** a sibling lane, **TE-T2E, was holding the Vitest gate
mutex** (`sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/townMapMassPart.test.js
…` in `tet2e-tree`), and `check:tail` wraps `test:ratchet` and `verify:dist` in that same mutex,
so my run was queued behind it. ⚠ The chair's GO said TE-T2E was in a build phase with no gate;
it was in fact holding the machine lock. **No sibling process was killed** — the recorded
`pkill -f` hazard (a sibling's kill returns the other lane's workers as SKIPS) cuts both ways.
The lock directory was then confirmed EMPTY (no `pid` file), so the killed run left no stale
lock, and the gate was re-launched DETACHED so it outlasts the turn — the recorded lane law.

---

## §10e · THE ONE TERMINAL GATE — RUN BARE, GREEN

Run as `npm run check:tail` **BARE**, from a fresh shell, on the chair's explicit GO.
⛔ NOT wrapped in `gate-mutex.sh --run` (its exit 3 is the mutex giving up, not a red); the gate
wraps `test:ratchet` and `verify:dist` in the mutex ITSELF, which is its own internal use — and
that is exactly what the first attempt queued behind. The exit is read from **the gate's own
tail line**, never from a pipe or from the harness.

```
[gate-tail] full log: /var/folders/…/gate-tail.53196.log
[gate-tail] exit: 0 (the gate's own status, not a pipe's)
TRUE_EXIT=0
```

| gate step | result |
|---|---|
| `validate:hazard-registry` | OK — 29 classes: MACHINERY 12, PARTIAL 11, DOCUMENT 6, ACCEPTED 0; floor 27 |
| `validate:premortem` | SELF-CHECK OK — 28 predicates, 23/29 registry classes routed |
| **`validate:packets`** | **valid: 138 packets (0 READY)** |
| `validate:data` / `custom-content-manifest` / `edge` / `map` / `tuning-bands` / `foundry-module` / `mcp-server` | all OK |
| `validate:migration-head` | repo head 196, contiguous; the standing PENDING-DEPLOY notice (visible, not fatal) |
| **`typecheck:ratchet`** | **no type regressions (173 errors, ceiling 173)** — exact floor |
| **`typecheck:domain:strict`** | **no strict-type regressions (1134 errors, ceiling 1134)** — exact floor |
| `lint` | **29 problems, 0 errors, 29 warnings** — the estate's standing warning set, unmoved |
| **`test:ratchet`** | **OK — no test regressions (11 known failures of 28,693 tests, ceiling 11)** |
| `build` | built in 35.55s; postbuild wrote 314 static route documents |
| `verify:dist` | STRICT DIST OK — 52 files, 433 tests, zero failed/non-run/uncollected/missing/extra/duplicate |
| **GATE** | **TRUE_EXIT=0** |

⭐ **THE FROZEN 11 HELD EXACTLY** — 11 of 28,693 against a ceiling of 11, which is precisely why
the gate is green with the six documented banked reds inside it. Nothing was banked, nothing was
re-recorded, and `test:ratchet:update` was never run.

### The separately-owed boot smoke (§P10.2 — the gate does not include it)

```
npm run smoke:boot   →   SMOKEBOOT_TRUE_EXIT=0
boot-smoke: 524 chunks · entry index-DnK5X-7m.js
boot-smoke: stage 2: 524/524 chunks initialised
boot-smoke: stage 3: shell mounted, 31706 B of markup under #root
boot-smoke: PASS — the built bundle boots.
```

⚠ **A THIRD LANE WAS RUNNING VITEST UNMUTEXED DURING MY GATE** — TE-OSR9's
`npx vitest run tests/lint` in `teosr9-tree`, outside `gate-mutex.sh`. My gate had already
acquired the atomic lock (PID 54006 after 15 polls) and completed cleanly, so it did not bite
here; recorded because an unmutexed sibling vitest is exactly the contention-flake habitat.

---

## §11 · FINAL STATE

- **TIP FOR CAS: `5d18b4a0c5515baa795c6fc763258a17d607d1ed`** (one commit).
- Parent `27c250f94bb7c5c799693a62985c5ddecd4b6c7c` — re-read after the commit and still the
  branch tip, so the CAS is a clean fast-forward and **no further rebase is owed**.
- Worktrees clean apart from the untracked `node_modules` symlink. **This lane moved no ref**,
  ran no `git stash`, and never used the `git checkout` family.
