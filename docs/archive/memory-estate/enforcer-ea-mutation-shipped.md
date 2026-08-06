---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-21
  type: milestone
  scope: "A+ tranche 2, enforcer E-A (mutation-sweep totality)"
  branch: claude/e-a-mutation
  commit: d3ff6778
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-26T19:08:10.564Z
---

# Enforcer E-A shipped: mutation-sweep totality (bar 1 CORRECTNESS)

Shipped @ claude/e-a-mutation d3ff6778 (base b339e178, worktree vision-i, NOT folded).
One gated commit, 4 files, eager delta 0 (zero src bytes).

## What exists now
- scripts/mutation-sweep.sh: 13 -> 23 planted regressions, all 23/23 CAUGHT with the
  attribution control (mutated=red AND reverted=green). New areas 14-23: size-ratchet
  (App.jsx past frozen 732), domain-strict implicit-any (gate = the script bare),
  committed-secrets AWS shape, RLS-less public table (new check_caught_planted helper:
  plants a file/dir, refuses if the path pre-exists), unmetered spend_credits edge
  function (planted dir), localeCompare-in-generators, transcendental-in-domain,
  voice '!'-in-data-prose, any-cast-in-domain, and manifest label-tamper (area 23
  proves the new meta-enforcer's own teeth).
- scripts/mutation-coverage-manifest.json: ALL 343 correctness-asserting invariant
  test files enumerated -> 23 mutation-proven, 124 rationaled (pglite-executed,
  golden-byte-pin, self-proving-meta classes), 199 uncovered BASELINED shrink-only.
- tests/lint/mutationCoverage.shared.mjs: THE ENUMERATION RULE (single source):
  every *.test.js(x) under tests/{lint,design,docs,data,copy,security,edgeFunctions}
  wholesale + invariant-nomenclature basenames (census/scan/baseline/ratchet/walker/
  killlist/parity/coverage/governance/freshness/integrity/exhaustiveness/roundtrip/
  golden/contract/pin) elsewhere in tests/.
- tests/lint/mutationCoverageManifest.test.js: reds on new-invariant-with-no-entry,
  stale entry, phantom/orphan/doubled label, uncovered drift EITHER direction
  (exact-equality ratchet). Negative control executed at build (probe file reddened
  totality by name, cleared on removal).

## Hazards (each bit or nearly bit this build)
1. SWEEP-SCRIPT SELF-INCLUSION: mutation-sweep.sh is a tracked text file INSIDE the
   committed-secrets scan corpus. A contiguous secret-shape literal in the script reds
   the gate on the CLEAN tree (first totality run scored area 16 BROKEN for exactly
   this). Cure = the scanner's concatenation idiom ("AKIA""..."), now commented in the
   script. Any future probe string that any source-scan walker matches needs the same
   treatment (voice '!' probe etc. are safe only because those scans cover src/ trees,
   not scripts/).
2. AREA 23 NEEDS THE MANIFEST IN THE INDEX: its revert is git checkout --, which
   restores from the index. Running the sweep with the manifest untracked would leave
   the mutation in place and score BROKEN. On a dirty-but-own-staged tree, run with
   MUTATION_SWEEP_ALLOW_DIRTY=1 after confirming ALL dirt is yours and staged.
3. FOLD FRICTION IS DELIBERATE: when other enforcer lanes (E-B..E-H) fold, their new
   invariant test files auto-enumerate and mutationCoverageManifest.test.js REDS until
   each gets a manifest entry (planted mutation preferred, else written rationale —
   NEVER a new uncovered; the baseline only shrinks). The failure message carries the
   recipe. Integrators: this red at fold time is the contract working, not a bug.
4. Upgrading an uncovered entry to mutation/rationale requires LOWERING
   uncoveredBaseline in the manifest by the same count (exact-equality both ways).

## 2026-07-26 amendment — WHICH KIND a new entry gets, and how to prove it safely

Landed @ claude/composite-r4 **b0fc33e1** (minifold, base e8a65e20): rationale entries for
tests/generators/{governanceNarrative,powerEconomyFreshness}.test.js. 8 lines, one file.
Counts after: uncovered 199 (baseline UNMOVED) | rationale 170 | mutation 43 | 412 invariants.

7. A MANIFEST ENTRY FOR AN UNTRACKED TEST FILE IS GREEN IN THE TREE AND RED AT HEAD.
   The "no stale entries" test filters on `existsSync` over the WORKING FILESYSTEM, so an
   entry naming a file another session has not committed passes locally and fails 1/6 on a
   clean checkout of the commit (MEASURED in a temp worktree, not inferred). Committing the
   entry alone is therefore a knowingly red-in-isolation commit; making it self-consistent
   would mean committing the other session's whole cone. Owner ruled 2026-07-26: commit the
   entry anyway rather than leave it as tree dirt in a 55KB file concurrent sessions write —
   state the limitation in the commit body. Re-check at fold that it went green.

5. AN UNTRACKED OR DIRTY MUTATION TARGET IS STRUCTURALLY INELIGIBLE for kind:"mutation".
   check_caught reverts with `git checkout -- <file>`: on an UNTRACKED file that revert
   is a no-op, so the mutation PERSISTS and the area scores GATE-BROKEN, not CAUGHT; on
   a tracked-but-dirty file it DISCARDS a parallel session's uncommitted work. In this
   live shared tree, new modules arriving from other sessions therefore always land as
   kind:"rationale" until they are committed. Never kind:"uncovered" — the totality test
   forbids it and uncoveredBaseline is shrink-only.
6. SAFE BUILD-TIME PLANT (no shared file is ever written). To earn the
   "walker-totality-executed" style rationale — "plant EXECUTED at build time, proven
   red-then-green" — without mutating a hot or untracked source:
     a. copy the target module to `tests/fixtures/mutant<Name>.mjs` and mutate the COPY;
     b. copy the invariant test to `tests/generators/mutantProbe.test.js` (any basename
        carrying NONE of the enumeration tokens, so it does not itself auto-enumerate)
        with its import redirected at the mutant; run it — expect RED;
     c. repoint the probe's import at the real module and re-run — expect GREEN (the
        sweep's own attribution control);
     d. delete both temp files.
   PRECONDITION: only works when the module is a leaf whose relative imports still
   resolve from the copy's directory (governanceNarrative.js has zero imports). If the
   invariant runs through the full pipeline instead of importing the module directly
   (powerEconomyFreshness), the copy is not reachable — fall back to a rationale citing
   the suite's own embedded negative control.

## How to apply
- Full sweep run is ~6 min and mutates tracked files transiently — never run it
  concurrently with other gates or edits in the same tree; it refuses dirty
  MUTATED_FILES without the env override.
- Labels are the join key between script and manifest — rename in both or the
  meta-test reds (bidirectionally).
- Burn-down worklist = the 199 kind:"uncovered" entries; drive to 0 over waves.
