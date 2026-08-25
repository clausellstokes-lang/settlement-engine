# RECEIPT — TE-DEPLOYDOC-188 (docs car: the runbook names migration 188)

SLOT (corrected by the chair at dispatch; LANE-LAW's `c3289244d` line is STALE):
`claude/composite-r4` = **233c35a69ccb67bb3ce2612427ad918a42fc4af8** (62 cars).
WORKTREE: `<chair-scratchpad>/laneDEPLOYDOC-tree`, own `npm ci` (589 packages, exit 0),
`.husky/_` PRESENT ⇒ pre-commit regime is LIVE. Slot package.json declares **40** deps
(matches LANE-LAW §1; the shared tree's 36 was never used — no symlink was made).
DISK at start: 18,740,240 KB free on `/` (17.8 GB) — far above the 2 GB floor.

## What landed

ONE hunk, ONE file, 11 insertions, 0 deletions:

    docs/DEPLOY.md | 11 +++++++++++
    @@ -166,0 +167,11 @@   (HUNKS=1)

The inserted block is BYTE-IDENTICAL to the charter's fenced text (proved by comparing the
charter's ```markdown fence against `docs/DEPLOY.md` lines 167–177: `EXACT_MATCH true`).
It sits immediately before the `197_…` row, keeping lexical order 188 < 197 < 198.

## Verification executed

1. **Naked-claim discipline (charter §3).** The exact `CLAIM_RE` was EXTRACTED FROM
   `tests/docs/enforcement-claims.test.js` rather than retyped, and run over the edit:
       INSERTED_MATCHES=0
       FILE_MATCHES=2  (both pre-existing: DEPLOY.md:155 and :308→:319, each already
                        carrying an `@enforced-by` inside the ±3-line window)
   NEGATIVE CONTROLS on the instrument: a planted `machine-enforced … 0 problems` line
   matches (true), a planted `fails the gate` line matches (true), ordinary prose does not
   (false). The scanner is live, and the chair's text claims no enforcement.
   ⚠ The insertion is at line 167 and the only claim ABOVE it is at 155 with its tag at
   156, so no existing claim/tag pair was pushed out of its ±3 window.

2. **Doc-facing suites** (`gate-mutex --run --`, `--pool=threads --maxWorkers=2`):
       Test Files  1 failed | 1 passed (2)
             Tests  1 failed | 32 passed (33)
   The one failure is `tests/docs/enforcement-claims.test.js :: … every completeness claim
   carries an @enforced-by tag with ≥1 target` — entry #5 of the **11 banked failures** in
   `scripts/.test-ratchet-baseline.json` (BANKED_COUNT=11, confirmed by reading the file).
   Its six naked claims are all in FABLE_VALIDATION_QUEUE / GOLDEN_SHIFT_LEDGER / IN-0C —
   NONE in DEPLOY.md. The per-claim frozen pin ("a seventh cannot hide inside the sixth")
   **PASSED**, which is the proof this car added no new naked claim.
   `tests/docs/deployRunbookFreshness.test.js` — all green (it pins the HEAD line, which
   this edit does not touch).

3. **Charter facts corroborated against the migration itself** (not required, but a wrong
   filename would be a real defect): `188_reviewed_supply_chain_persistence.sql` exists
   (120,312 B); it contains `do $$`, `category = 'supplyChains'`, the journal kind
   `content.reviewed-supply-chain.legacy-quarantine`, `raise exception … quarantine
   conflict`, an `@rollback:` note reading "Forward-fix only after first use", and deletes
   in exactly the charter's order: `content_environment_activations` →
   `content_environment_revisions` → `content_environments` → `content_pack_versions` →
   `content_packs` → `custom_content_definitions`.

## Judgment calls

- **J1 — NO PACKET MINT (the car lands unpacketed).** Decided by execution, not assumption:
  (a) `npm run validate:packets` exits **0** with the edit present — "valid: 181 packets
  (0 READY)"; (b) NO non-terminal packet reserves `docs/DEPLOY.md` (the only two DRAFTs are
  MF-CH3 and MF-CG2, neither naming it), so there is no reservation to honour;
  (c) PACKET_STANDARD §Purpose scopes a packet to "the only document that may tell a coding
  agent to implement a not-yet-built subsystem slice" — this car implements no slice, it
  transcribes text the chair had already authored in full; (d) §"Registration obligations a
  wave prices at compile" lists three mint classes (flag mint, seeded chooser/pool mint, new
  `tests/lint/` file) and a census burn — this car is none of them; (e) current-era
  precedent: **TE-R3** and **TE-STACK-5** landed with no packet at all (no `R3`/`STACK` id
  exists in the manifest), while every packet-minting car of the era (MF-CH4/CH5/CH7, MF-CG2,
  AIP-2) changed shipped CODE. There is no docs-only car in the last 80 commits to copy.
  A mint would also have added three files (packet + PACKET_MANIFEST.json + INDEX.md) beyond
  the charter's single insertion, which the lane brief forbids. **If the chair wants 182
  minted anyway, that is a one-commit follow-up and this receipt is its evidence.**
- **J2 — the chair's text was inserted VERBATIM including one imprecision I did not
  reword.** The row says "the pack activations"; the table the block actually deletes first
  is `public.content_environment_activations`, whose schema (185_custom_content_versions.sql)
  is one row per owner pointing at the active `environment_revision_id` — an ENVIRONMENT
  activation, not a pack activation. Charter §3 forbids rewording the mitigation facts
  without the chair, so it stands as authored. **Proposed one-phrase correction for the
  chair: "the pack activations" → "the environment activation".**
- **J3 — no census row.** No test file, title or suite title moves (the edit is prose in a
  non-test doc), so the census tuple is unchanged; `test:ratchet` inside the full gate is
  the proof, not a hand assertion.

## Gate

Both mutex dirs were polled per ODQ §582.2 before every run
(`/tmp/settlementforge-vitest-gate.lock` AND
`$TMPDIR/settlementforge-vitest-gate.lock` — `gate-mutex.sh:21` defaults to the TMPDIR one,
which is why the two-dir poll exists). Both FREE, no vitest/gate processes alive.

GATE RESULT — **GREEN**, one run, BARE (`npm run check:tail`), fresh shell, quiescent tree
at tip `714a398b7`. All 17 steps ran; nothing was blacked out by an `&&` red. VERBATIM:

    [gate-tail] start: 11:48  up 20 days,  1:20, 1 user, load averages: 3.90 6.30 20.34 · cores: 8
    [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    [domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
    [test-ratchet] OK — no test regressions (11 known failure(s) of 29067 tests, ceiling 11).
    [prerender] wrote 314 static route documents (13 views + 15 gallery hubs + 286 compendium entries) under dist/
    [test-ratchet] STRICT DIST OK — 53 discovered/reported file(s), 467 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.
    [gate-tail] end: 12:07  up 20 days,  1:38, 1 user, load averages: 64.35 101.91 73.68
    [gate-tail] full log: /var/folders/0l/_sz6gzvd11x6sthjy1jdj0_80000gp/T//gate-tail.59446.log
    [gate-tail] exit: 0 (the gate's own status, not a pipe's)
    TRUE_EXIT=0

THE THREE GREEN CONDITIONS, each read rather than inferred:
  · `TRUE_EXIT=0` — captured from the bare run's own `; echo TRUE_EXIT=$?`
  · `[gate-tail] exit: 0`
  · COLLECTED COUNT PRESENT: **29,067** source-phase tests (11 known failures against a
    ceiling of 11 — the frozen census exactly, so the banked enforcement-claims red is
    inside the ceiling and NOTHING new joined it), plus 467 dist-phase tests over 53 files.
  · DISK AT END: 18,377,664 KB free (≈17.5 GB) — far above the 300 MB floor.

POST-GATE INTEGRITY (the mid-flight-edit hazard, LANE-LAW §2): `HEAD` is still
`714a398b758553af3a753a0fa26bfe2823ea4ee9`, `git status --porcelain` is EMPTY, the diff
against the slot is still the one 11-line hunk, and `POST_GATE_EXACT_MATCH true` —
the tree the gate measured is the tree that is committed. This is an uncontaminated green.

## RESUME POINT (updated 2026-08-24, LANE COMPLETE — nothing in flight)

- **THE CAR IS DONE AND GREEN.** TIP `714a398b758553af3a753a0fa26bfe2823ea4ee9`, one file,
  one hunk, +11/−0, full gate green at that exact tip. Worktree left in place at
  `<chair-scratchpad>/laneDEPLOYDOC-tree`, clean, detached on top of slot `233c35a69`.
- NOTHING WAS PUSHED, no ref was moved, no stash was taken, the main worktree was not
  touched, no census row was widened, no memory file was written.
- FOR THE CHAIR: two open items, both recorded above — J1 (no packet minted; if the chair
  wants 182/183 minted anyway it is a one-commit follow-up, and the evidence is in this
  receipt) and J2 (the one-phrase "pack activations" → "environment activation"
  correction, deliberately NOT applied because the charter reserves the wording).
- Artefacts: `laneDEPLOYDOC-gate.log` (the check:tail capture), `laneDEPLOYDOC-docstests.log`
  (the targeted suites), `laneDEPLOYDOC-npmci.log`, `laneDEPLOYDOC-msg.txt` (the commit body),
  and the gate's own full log at `$TMPDIR/gate-tail.59446.log`.

## PRIOR RESUME POINT (superseded — kept for the audit trail)

- TIP: **714a398b758553af3a753a0fa26bfe2823ea4ee9** (detached, on top of slot 233c35a69).
  Working tree CLEAN at launch; `TIP_EXACT_MATCH true` re-proved AT THE COMMITTED TIP
  (`git show ${SHA}:docs/DEPLOY.md`, braced), and pre-commit re-staged nothing —
  lint-staged printed "could not find any staged files matching configured tasks",
  which is expected: its globs are `*.{js,jsx,mjs,cjs}` and `docs/implementation/**`,
  and this car touches neither.
- DONE: worktree + npm ci; the single 11-line insertion, byte-exact; CLAIM_RE clean with
  controls; the two doc suites run (1 banked failure, identified); packet question settled
  (J1: no mint); committed as 714a398b7.
- IN FLIGHT: ONE full gate, BARE, fresh shell, quiescent tree, launched with both mutex
  dirs polled FREE and no vitest/gate process alive, 16.5 GB free:
      cd <worktree> && npm run check:tail ; echo TRUE_EXIT=$?
      log: <chair-scratchpad>/receipts/laneDEPLOYDOC-gate.log
  GREEN = TRUE_EXIT=0 + `[gate-tail] exit: 0` + a collected-test count + disk ≥300 MB.
- ⛔ DO NOT EDIT THE WORKTREE WHILE THE GATE RUNS (LANE-LAW §2: a mid-flight edit yields a
  verdict about a tree that never existed).
- IF THE GATE REDS: compare failure identities against the eleven banked entries in
  `scripts/.test-ratchet-baseline.json`; this car can only plausibly move
  `tests/docs/*` and `validate:packets`. Report verbatim; repair nothing unrelated.
- FORBIDDEN for this lane: push, ref moves, stash, main-worktree edits, any docs edit
  beyond the single insertion, census widening, memory writes.
