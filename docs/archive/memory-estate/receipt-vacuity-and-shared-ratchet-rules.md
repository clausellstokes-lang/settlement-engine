---
name: receipt-vacuity-and-shared-ratchet-rules
description: "Three standing rules from cycle 22: tsc-with-file-args typechecks NOTHING; git-diff shared ratchets before staging; zsh mangles git show $r:path"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-07T12:30:17.913Z
---

2026-08-03 (cycle 22, each verified by execution):

1. **THE VACUOUS tsc RECEIPT**: `npx tsc --noEmit --strict <file.js>` with
   files on the command line SILENTLY IGNORES tsconfig.json (TS5112),
   typechecks nothing, and prints a fake clean 0 for every file. The only
   honest strict receipt is the project's own gate
   (`scripts/check-domain-strict.mjs` / `npm run typecheck:domain:strict`).
   Any lane report citing per-file tsc invocations is citing vacuum.
2. **THE SHARED-RATCHET STAGING LAW**: a pathspec `git add` of a SHARED
   baseline/ratchet file stages the WHOLE file — including other lanes'
   uncommitted rows. Pathspec staging is NOT protection there. Before
   staging any shared ratchet: `git diff` it and confirm every hunk is
   yours; an arithmetic check (expected delta vs observed delta) is the
   detection method that caught the one real incident (a foreign lane's -2
   win nearly swept; repaired).
3. **THE STAGED-SET LAW** (W8-D's self-reported failure, 2026-08-03 evening):
   `git add <path>` + a BARE `git commit` commits the WHOLE INDEX — a
   concurrent lane's staged files ride along under your message (eight nav
   files landed under a war commit). Cure: immediately before EVERY commit,
   `git diff --cached --name-only` and verify every staged file is yours;
   prefer `git commit -- <paths>` so the commit itself is pathspec-bound.
   Now in every lane preamble.
4. **THE zsh `:t` HAZARD**: `git show $rev:tests/fixtures/foo.json` in zsh
   parses `:t` as a history/parameter MODIFIER, mangles the path, errors to
   stderr — and the EMPTY stdout piped into shasum yields
   e3b0c44298fc1c14... (the empty-string hash), which can silently
   "confirm" a wrong comparison. Quote the argument or use --
   (`git show "$rev:path"`).

5. **THE BUILT-ARTIFACT GHOST PATH** (found by lane MD, 2026-08-03 night):
   a domain fix that lands in src/ SURVIVES the app path and GHOSTS the
   edge-function path — supabase/functions/_shared/*.js are BUILT ARTIFACTS
   (`npm run build:edge-shared`) that keep serving retired defects until
   rebuilt (the spliced "People fear…" sentence outlived its fix by three
   lanes there). Cure: any lane touching a module the edge bundle folds must
   check tests/edgeFunctions/*freshness* and either rebuild-disclosed
   (CR-EB-1: rebuild = repair; DEPLOY stays the owner's train) or
   STOP-report. The freshness tests are the tripwire — never leave them red
   as "inherited." CURED @ f2c10742 (CR-EB-2: all five bundles rebuilt from
   clean HEAD; THREE were dirty-tree unreproducible, not two; the fold was
   28 commits/108 modules, disclosed as a correction). STANDING LAW: a lane
   touching bundled inputs rebuilds edge-shared IN THE SAME COMMIT with
   inputs STAGED (the reproducibility pin checks the git INDEX). ⚠️ the
   pre-commit hook runs eslint --fix over generated bundles — verify
   committed artifacts byte-match builder output (the pin sees input hashes,
   not bundle bytes).

6. **THE GHOST-WRITE BASELINE CLASS** (WZ-4, 2026-08-04): applyRelationshipPatch
   rebuilt baselines via ensureRelationshipState({}, existing) — an EMPTY edge —
   so ANY caller writing a not-yet-materialized edge silently RE-TYPED authored
   hostile/allied edges to neutral in passing. Six callers wrote through the
   door; WZ-5 cures at the WRITER (edge-derived baseline). The class: a patch
   helper that derives its baseline from anything but the true current state.
7. **THE CLOCK LAW for byte-identity harnesses** (WZ-4's phantom diff): 14
   wall-clock `updatedAt` sites made two runs of the SAME tree differ — any
   same-seed harness must strip clock keys AND run each tree twice, with a
   negative control, or it reports phantom findings.
8. **THE PROVENANCE-COVERAGE LAW for byte-identity claims** (WZ-5's rejected
   close, 2026-08-04): a same-seed hash is only as strong as the fixture's
   coverage of the changed path. WZ-5's 3-settlement fixture had only
   hand-authored edges — it never minted a `channel_inferred` inferred
   channel, so "byte-identical, twice, both commits" was VACUOUSLY true while
   the real pipeline moved in 3/6 cells. A change at a plane's ONE WRITER
   needs a fixture whose graph contains EVERY provenance the tree can mint,
   plus an executed NON-VACUITY assertion that the drive actually exercised
   the changed path (count the writes; assert > 0) — the same way a hop-delay
   pin asserts the delay is non-zero before trusting pre-arrival absence.
   COROLLARY (WZ-5r's F4): a COMBINED hash over one harness's cells is
   unverifiable BY CONSTRUCTION by any independently built harness — acceptance
   rows quote PER-CELL base-to-HEAD equality + the executed mint/materialize
   ledger (tick + key names), never a cross-harness combined constant.

9. **THE ARCHIVE-CENSUS LAW** (contained-disposition repair round, 2026-08-07 —
   the SIXTH instance of this exact cause): **A CENSUS TAKEN IN A SHARED LIVE
   TREE MEASURES THE OTHER LANE'S WORK TOO. EVERY CENSUS FIGURE MUST BE TAKEN IN
   A `git archive` OF THE COMMITTED SHA, NEVER IN THE WORKING TREE.** MEASURED:
   `cef0ac18`'s report quoted the wizardNewsAuthoring walker at `files 958`; the
   walker's own `censusNewsAuthoringSites` run in an archive of that sha returns
   **956**, and the two extra were the sibling ES lane's uncommitted
   `espionageDoctrineStage.js` + `espionageWariness.js` sitting inside the
   src/domain scan scope. Every other figure was identical, which is what makes
   the class insidious — one number moves and the receipt still looks right.
   METHOD THAT WORKS: `git archive --format=tar -o f.tar <sha>` + `tar -xf`
   (never a pipe), symlink node_modules in, then import the walker's OWN shared
   scanner module and print the members. ⚠️ **INTEGRITY-COUNT EVERY ARCHIVE
   BEFORE TRUSTING IT**: `git ls-tree -r <sha> | wc -l` must equal
   `find <dir> -type f | wc -l`. A concurrent `git archive | tar` extraction was
   SILENTLY TRUNCATED (6,162 of 6,163; `warDeployment.js` missing) and produced
   FOUR FAKE FAILURES in the verifier of that same wave.
10. **`let x;` IS NOT A TDZ GUARD — a false rationale that reached shipped source**
   (same round). `let inversion01;` initializes the binding to `undefined` the
   moment the declaration executes; the temporal dead zone ENDS at the
   declaration, so a later unhandled arm reads `undefined` and NOTHING THROWS.
   `cef0ac18` deleted a dead `= 0` seed (correctly, per `no-useless-assignment`)
   and wrote "so an unhandled arm is a TDZ error rather than a silent neutral 0"
   into BOTH the comment and the commit message. MEASURED: three runs read
   `typeof === "undefined"` with no ReferenceError; and the downstream is silent
   either way — with the seed the standing lands at `bondScore01` 0.8 (the CAP),
   without it at 0, because `clamp01` in `src/kernel/math.js` clamps non-finite
   to 0. Two different silent answers, neither an error. **Only an explicit
   `throw` or exhaustiveness check makes an arm loud**, and at that site the
   third arm is unreachable through `standingFor` (the `if (!direction ||
   !parentRef)` guard returns null first), so a throw there would be an
   unpinnable guard — the estate's unreachable-predicate-conjunction class.
   Corrected in source @ the repair commit; git history keeps the false message.

## ⚠⚠ A "ZERO INTRODUCED" CLAIM SCOPED TO ONE TYPECHECKER READS AS TOTAL

Minted 2026-08-07 by the typecheck burn's blast-radius verifier. The sweep reported
`introducedCount: 0`. **TRUE under `tsconfig.full.json`** (independently reproduced: 174
removed / 0 introduced, no file grew, no new erroring file). **FALSE under
`tsconfig.domain-strict.json`** — the OTHER typechecker the SAME `npm run check` chain runs
one step later — where it was **+2**, and one of the two files (`peaceTerms.js`) **appears in
no burn commit's file list at all.**

⭐ **THE SPILLOVER MECHANISM:** JSDoc annotations added to file A NARROW an inferred type that
flows into file B. So "I only touched my files" is not a safety argument for a type change,
and a per-file diff cannot detect it. Only re-running every typechecker the gate runs can.

⚠ **THE SECOND HALF IS WORSE THAN THE FIRST:** the burn turned `check-domain-strict.mjs` from
GREEN (`✓ 1303 < 1313`) to RED while its own receipt said zero introduced. **A ratchet that
was passing and now fails is a REGRESSION THE ROUND CAUSED**, and the cure is never to widen
the baseline — the script's own message says *"fix or annotate; do not widen the baseline."*

**How to apply:** before claiming any error-count delta, **enumerate every checker the gate
chain invokes and report the figure under EACH.** Name the config alongside the number, always
— a bare "0 introduced" is not a claim, it is a scope waiting to be discovered. The law now
lives in `CONTRIBUTING.md` §"The gate" with cross-pointers in BOTH ratchet script headers.

### ⭐⭐ AND THE SHARPER HALF: "0 INTRODUCED" AND "THE RATCHET IS GREEN" ARE DIFFERENT CLAIMS

Measured on the same round: the true domain-strict spillover was **31 introduced, of which 29
REDDENED NOTHING** — because these ratchets compare **PER-FILE COUNTS**, so an error introduced
in a file that is still under its own ceiling is invisible to the ratchet while being entirely
real. **Neither claim implies the other, in either direction**, and a receipt that offers one as
evidence for the other is wrong twice.
⚠ Corollary, demonstrated live: a per-file COUNT ceiling also permits an **IDENTITY SWAP** —
remove one finding, add another, count holds, ratchet green, fresh defect landed. A ratchet is
only as strong as the granularity of the thing it counts.
⚠ Always state the WINDOW too: a delta measured across a span that contains other lanes' commits
attributes their work to you.

**Why:** all three produce confident-looking green receipts over nothing;
two nearly corrupted verification conclusions this cycle.

**How to apply:** verifier briefs cite the real gates by name; shared-file
staging always diffs first; the empty-string sha256 (e3b0c442...) appearing
anywhere in a receipt is an alarm, never a confirmation.

## Appended 2026-08-09 (F-S1 survey, M2 — from the cycle-4 debt-discharge row's lesson)

**THE HASH-IN-THE-SAME-COMMAND LAW.** An artifact's hash must be stamped INSIDE the one
command that measures it (`measure && hash` as a single invocation), never captured by a
separate later command — a foreign lane's in-flight mutant can swap the artifact between
your measurement and your hash, and the receipt then binds the figure to bytes nobody
measured. Minted when a mid-slice dirty file (a sibling lane's plant-proving state) sat
between a lane's measure and its stamp.
