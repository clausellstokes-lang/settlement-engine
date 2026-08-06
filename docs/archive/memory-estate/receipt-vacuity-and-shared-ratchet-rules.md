---
name: receipt-vacuity-and-shared-ratchet-rules
description: "Three standing rules from cycle 22: tsc-with-file-args typechecks NOTHING; git-diff shared ratchets before staging; zsh mangles git show $r:path"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T09:11:30.712Z
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

**Why:** all three produce confident-looking green receipts over nothing;
two nearly corrupted verification conclusions this cycle.

**How to apply:** verifier briefs cite the real gates by name; shared-file
staging always diffs first; the empty-string sha256 (e3b0c442...) appearing
anywhere in a receipt is an alarm, never a confirmation.
