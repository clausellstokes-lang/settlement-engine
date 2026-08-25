---
name: walker-census-law-machinery
description: "The walker-census law is EXECUTABLE in testRatchet.test.js: identify by a UNION of FOUR arms (name / header-title / enumeration+frozen-inventory INCLUDING grep shell-outs / that same structure DELEGATED to an imported non-test module); the TITLE arm was measured and REJECTED (ratchet is a domain noun); triage by OPEN population vs CLOSED per-member identity; a ratchet whose --update is prohibited is freed by an attributed DECLARED_OVERRUNS ledger with monotone-down literal ceilings"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-08T00:54:06.388Z
---

2026-08-07, lane S12-W (build branch claude/composite-r4), all figures executed.

## Why (the shape of the failure)

`af8815e9` wrote the law — *a failing TEST is debt; a failing WALKER is a DISABLED
GUARD; an enforcement walker may never be put in the test census* — into
`CONTRIBUTING.md` **and** into the header of `tests/lint/testRatchet.test.js`, **as
comments that check nothing**, in the very commit that left TEN violating rows in
`scripts/.test-ratchet-baseline.json`. Prose about a ratchet is not a ratchet. If a
law is worth writing twice, it is worth a pin.

## ⭐⭐ HOW TO IDENTIFY AN ENFORCEMENT WALKER BY MACHINE

A `.walker.` **filename check is WRONG** — it misses `tests/property/mechanismLitCoverage.test.js`
(a walker with no `.walker.` in its name; two of the ten rows). The identification is a
UNION of three independent arms, and **no single arm classifies all ten**:

- **A1 NAME** — `*.walker.test.js`. Catches `warCostKindPools` / `warRulingKindPools`,
  which walk no tree at all.
- **A2 TITLE** — the module header's FIRST non-empty line calls it a walker. Survives a
  rename. (Matching "walker" anywhere in the header is far too loose: 148 estate files
  vs 85 for the title line.)
- **A3 STRUCTURE** — the file enumerates a source tree (`readdirSync`/`globSync`) **AND**
  compares against a frozen-inventory token (`BASELINE|CEILING|CENSUS|ALLOWLIST|EXEMPT|
  ROSTER|INVENTORY|MANIFEST|-baseline.json|shrink-only`). Needs no declaration; this is
  the arm that catches `mechanismLitCoverage`.

MEASURED inside an integrity-counted `git archive` of `af8815e9` (6,196 in / 6,196 out,
clean): the union flags **135 of 2,352** estate test files (5.7%) — A1 69, A2 85, A3 73.

⚠ RESIDUAL, STATED AGAINST INTEREST: A1 and A2 are DECLARATIONS and fail OPEN. A walker
that is renamed AND re-titled escapes both and is caught only if A3 sees it — i.e. only
if it scans a tree. A registry-reading walker that is renamed and re-titled escapes all
three. Narrow, needs two deliberate acts, no cheaper total predicate found.

## ⭐⭐ THE TRIAGE LINE — do not assume every walker row is the same defect

Ask what the FROZEN ROW's assertion ranges over:

- **OPEN, tree-derived population** → freezing the row freezes the whole population; a
  new violation is absorbed silently. **DISABLED GUARD — must come out.**
- **CLOSED, per-member identity** → `test.each(REGISTRY)('$kind …')` mints one test per
  member, so a new member mints a NEW identity that is absent from the census and reds
  as a regression. **ORDINARY BANKED DEBT — may stay.** Confirmed live: 6 of the 9
  war-cost kinds PASS while 3 are baselined.

## How to apply

- The machinery is the last `describe` of `tests/lint/testRatchet.test.js`. Two ledgers,
  both exact-identity and shrink-only, meaning different things: `WALKER_ROWS_ADMITTED`
  (legitimate per-member debt, with the argument) and `WALKER_ROWS_OWED` (CONFIRMED
  disabled guards nobody has freed — an outstanding bill, not permission).
- Freeing a walker row means making the walker GREEN by re-freezing its OWN inventory.
  You cannot just delete the census row: the ratchet then reads the still-failing test
  as a regression. That constraint is why one row could not be freed (below).
- ⚠⚠ **THE CHAIR'S TEN WAS AN UNDERCOUNT.** A derived classifier found TWELVE more rows
  of the same defect across eight files (`voiceMechanics` x4, `crisisTripleSync` x2,
  `deepCraftKillList`, `deployRunbookFreshness`, `enforcement-claims`,
  `metronomeCooldownLint`, `clampPrimitiveBaseline`, `proseNumerics`). Inventoried in
  `WALKER_ROWS_OWED`, NOT freed. Expect a hand-measured walker count to be low.
- ⛔ **STOP-S12W-1**: `spatialLedgerCoverage.walker` cannot be freed by a build lane. Its
  cure is two entries in `src/lib/spatialUsage.js`, which an owner session holds
  uncommitted with both writers. Its recorded cause was WRONG IN DIRECTION — the walker's
  dump gives `onlyClassified: []`, `onlyWritten: ["commercialReasons","pactProposals"]`;
  nothing is phantom. With the owner's edits applied it PASSES live while FAILING at the
  committed parent. Drop the row only after the owner's commit.
- `crisisTripleSync`-shaped rows must be **RE-POINTED, never re-frozen**: re-freezing a
  mis-pointed source pin banks the wrong address.

## Collateral, worth keeping

- The lighting census's five figures are asserted IN SEQUENCE, so a wrong `files` count
  means the other four are **never evaluated**. Its deferral was discharged by measuring
  inside an archive of a `git write-tree` of the exact change being committed (private
  `GIT_INDEX_FILE`, shared index never touched), then re-verifying live. Growth that
  accrued while the row was banked: +6 files, +171 titles, +34 suite titles.
- DERIVE-DON'T-RESTATE forbids RETYPING a figure, not banking one you did not author. A
  previous lane deferred a re-record on that misreading.
- `vitest --reporter=basic` does not exist in this repo's vitest; it fails at startup.

## ⭐⭐ SECOND CUT (lane S12-W2, 2026-08-07) — THE THREE-ARM UNION HAD A GAP AND A CONTROL PIN CERTIFIED IT

The classifier above missed FIVE more rows across three files, and **two of the missed
files were on that same commit's ORDINARY-TEST CONTROL LIST** — so a green pin asserted,
every run, that ignoring a disabled guard was correct. ⛔ **A control that certifies a miss
is worse than no control**: it turns an open hole into a proof, in the one place a reader
checks whether the hole exists. Fix the control, never just the classifier.

**THE MISSES WERE STRUCTURAL, NOT RANDOM.** Two shapes the arms could not see:

- **A4 DELEGATED STRUCTURE** — `domainAnyCastBaseline.test.js` and
  `transcendentalMathBaseline.test.js` delegate the tree walk to an imported counter in
  `scripts/`, so the test file contains no enumeration at all. New arm: apply the A3
  predicate to the non-test local modules the file imports.
  ⚠ **EXCLUDE `.test.` files from the transitive follow** — three ordinary domain tests
  import a helper EXPORTED FROM `tests/lint/engineGatedRuleKeys.walker.test.js` and were
  falsely claimed. A walker file's walker-ness belongs to its OWN rows.
- **A3's WALK REGEX WAS TOO NARROW** — `roadsParticipation.test.js` enumerates by
  SHELLING OUT: `execFileSync('grep', ['-rl', '\\.npcs', …])`. Widened to also match
  `execFileSync|execSync|spawnSync` of `grep`/`git`/`find`/`rg`.

MEASURED in an archive of `abc5a78b` (6,196 in / 6,196 out): union **135 → 140 of 2,352**
(5.74% → 5.95%). All five newly-swept files audited individually — all five are genuine
walkers, zero false positives.

**⛔ THE TITLE ARM WAS TESTED AND REJECTED — do not re-propose it without new evidence.**
Classifying from the census ROW's title (`ratchet`|`shrink-only`) catches all five and has
perfect precision on the census (12/12), but measured over all **27,287** collected titles
(`vitest list --json=<path outside the repo>`) it sweeps 362 titles / 83 files, **40 of
them outside the union**. **"ratchet" is a DOMAIN NOUN in this world sim** — a one-way stat
— e.g. `pantheon.test.js` "ratchet wins/losses (commutative fold)", `martialMoralWF8`
"martial readiness ratchet", `warConservationDismiss` "strips the exhaustion ratchet". The
broader token sets (`frozen`/`census`/`roster`) are far worse: 344 files, 14.7%. It also
buys nothing A1–A4 do not already catch, and it is a third DECLARATION arm.

**FREEING A RATCHET WHOSE `--update` IS PROHIBITED: the DECLARED-OVERRUN LEDGER.**
`domainAnyCastBaseline` carries a standing prohibition (`--update` re-freezes the WHOLE
tree and would bank `commercialReasons.js`'s 31 any-holes permanently), so the debt cannot
be relocated by a re-freeze. The pattern that works, and is now in BOTH baseline ratchets:
an in-file `DECLARED_OVERRUNS` map of `{count, introducedAt (40-hex), cause (>60 chars)}`,
plus FOUR governance arms — attribution; the set EXACT in both directions (a shrink reds
with "bank the win"); **no UNDECLARED file may exceed its baseline**; and two MONOTONE-DOWN
LITERAL ceilings (excess and row count). The ceilings are what make it a bill rather than a
permission slip: the exactness arms alone are satisfied by any set that matches the tree,
including one that grew. The two frozen arms then read the declared allowance and go live
again for every other file. ⚠ The `baseline exactly matches the tree` arm must OVERLAY the
declared rows, never EXCLUDE them, or a declared file could drift to any value.

Landed figures: any-cast 3 rows / 34 excess occurrences (`commercialReasons` 31,
`warDeployment` 17 vs 16, `envoyPulse` 2); transcendental 2 rows / 2 excess
(`bandedStock`, `dispositionLedger`, both the SAME `Math.pow(0.5, age/halfLife)`).
`roadsParticipation` got an `UNDISPOSITIONED_NPCS_READERS` quarantine of 7 (the
`ruinFilterRoster` precedent) — its inventory had already grown 31 → 38 unseen.

Census **35 → 30**; `testRatchet` CEILING 35 → 30. `WALKER_ROWS_ADMITTED` (4) and
`WALKER_ROWS_OWED` (13) untouched — the five freed rows were never in either, because the
classifier could not see them.

⚠ **The classifier has now been wrong twice in two days, both times by MISSING.** Expect a
third gap. Remaining hole, stated against interest: a registry-reading walker that is
renamed AND re-titled still escapes all four arms, and so does one whose walk is two
imports deep.

Related: [[absolute-path-substring-pin-fake-red]] (a fake red met while taking this lane's
archive census).

## ⚠⚠ 2026-08-10 — THE COUNTEREXAMPLE IS FRAGILE IN THE *OTHER* DIRECTION, AND IT BIT

`tests/lint/testRatchet.test.js` pins the two DECLARED-OVERRUN ledgers
(`domainAnyCastBaseline.test.js`, `transcendentalMathBaseline.test.js`) as the estate's
**named counterexamples for arm A4 (DELEGATED)** — the test `⛔ NO SINGLE ARM CLASSIFIES
THEM ALL` asserts `arms.name === false`, `arms.title === false`, `arms.structure === false`
and `arms.delegated === true` for BOTH files. They are the only proof the four-arm union is
not reducible to fewer arms.

**So the hazard is not only "a walker escapes the classifier". It is also "a pinned
counterexample stops being one."** Adding the F-S1-J8 `git cat-file -e` existence leg
directly inside `domainAnyCastBaseline.test.js` flipped its STRUCTURE arm TRUE, because
A3's predicate is

    SHELL_SCAN = /(?:execFileSync|execSync|spawnSync)\s*\(\s*['"`](?:grep|git|find|rg)['"`]/

MEASURED, not feared: `testRatchet` reds with *"tests/lint/domainAnyCastBaseline.test.js
contains no enumeration of its own — the walk is in scripts/: expected true to be false"*.

**CURE, landed:** the shell-out lives in `tests/helpers/gitObjectStore.js` and the ledgers
IMPORT it, so every walk they do stays delegated. Both ledger headers now carry a
⚠⚠ block saying the shell-out may not move back in, with the measured reason. A comment
merely *mentioning* `execFileSync` is safe — SHELL_SCAN needs the call parenthesis and the
quoted tool name.

**How to apply:** before adding ANY tree-reading call (`readdirSync`, `globSync`, `fg.sync`,
or a `grep`/`git`/`find`/`rg` shell-out) to a file under `tests/lint/`, run
`npx vitest run tests/lint/testRatchet.test.js` first — the arms are computed from source
text, so a one-line addition can silently re-classify a file that another pin depends on
being classified the other way.

## ⚠ 2026-08-10 — THE EXISTENCE LEG'S OWN SHAPE (F-S1-J8, landed)

`introducedAt` was attested by 40-hex SHAPE alone, and `'f'.repeat(40)` satisfies that. The
leg resolves each row with ONE `git cat-file -e <sha>^{commit}`, and it is **environment-aware
and still fail-closed**, because the wave-end attribution method runs the suite inside
`git archive` extractions that carry NO object store:

- git answers → a well-formed FAKE sha must FAIL to resolve **before any row is believed**
  (the negative control; blinding the helper's `catch` reds BOTH ledgers by name);
- git does not answer → the tree must genuinely carry **no `.git` entry**, so "no git here"
  can never be a silent downgrade back to the shape check.

⚠ Do NOT add this as a new `test(...)` — it lives inside the existing attribution test,
because a new title moves the lighting census (`sovereigntyLightingContract.walker.test.js`
counts titles across all of `tests/`) and that census is a shared serializer between lanes.

## ⚠ 2026-08-10 — THE GR-2 MUTATION-MANIFEST RATIONALE IS AN **ORPHAN**

`scripts/mutation-coverage-manifest.json` → `rationales["gr2-pact-formation-controls-executed-2026-08-06"]`
is referenced by **ZERO** entries in `invariants` (the key string occurs exactly once in the
whole file — its own definition). MEASURED BY MUTANT, both directions:

- deleting the WHOLE entry changes nothing in `tests/lint/mutationCoverageManifest.test.js`;
- truncating the rationale to `"thin"` (under the 40-char floor) changes nothing either —
  the well-formedness arm only reads a rationale via an entry whose `ref` points at it.

So folding text into that rationale is **documentation, not a guard**; the gate guarantees
only that the file stays valid JSON. This is consistent with J-GR2R-7's own finding that the
pact batteries are not enumerated invariant files. ⛔ The manifest is still NEVER
re-serialized — splice RAW TEXT (`git diff --numstat` must read `1 1`).
