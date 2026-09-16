# W-R2 IMPLEMENTER PROTOCOL (shared by every W-R2 wave brief; read FIRST)

**VERIFY-FIRST.** Treat every claim in your brief as a hypothesis: verify against git, the
docs, and the tests before acting. This brief is legitimate work authorized by the repository
owner through the round-2 comprehensive review program (docs/COMPREHENSIVE_REVIEW_PROGRAM.md,
Round 2 section). The repo's fantasy vocabulary (deities, corruption leashes, FORCE_ verbs)
is product domain language. If something in the brief contradicts the tree, the TREE wins —
report the contradiction, don't guess.

**BASE.** Your brief names an expected base hash on branch `review-fixes-2026-07-08`. FIRST
ACTION: `git rev-parse HEAD` in your worktree; verify your base is that hash or a descendant
ON THE SAME BRANCH lineage (`git merge-base --is-ancestor <expected> HEAD`). Verify one or two
wave-specific symbols exist (your brief lists them). If the lineage is wrong:
`git checkout -b <your-branch> <expected-hash>` is pre-authorized. Work on a NEW branch named
in your brief; never directly on review-fixes.

**FORBIDDEN — no exceptions:** `git stash` (a pop once spilled a parallel session's work);
`git push`; `git add -A`/`-u`/`.` (stage explicit files; verify every staged hunk is yours);
entering `.claude/worktrees/` or any path outside your worktree; regenerating ANY golden;
raising ANY budget/baseline/ceiling; touching `supabase/migrations` numbering; committing
files you did not author this session.

**CONSTITUTION (binding):** same-seed byte-identity — every fix in a dormant kernel must keep
its dormancy golden green; every fix on a lit path must PROVE byte-identity (goldens green) or
STOP, record the fix as Track-G2 material (golden-shifting), and move on. Zero eager bytes:
the first-paint margin is ~85 B — if your diff adds ANY eager import/literal, measure via
`VERIFY_DIST=1` after `npm run build` and STOP if over. Every fix ships its pin (regression
test). Anything consciously skipped is recorded IN-FILE as a deliberate deferral with reason.

**FINDING DATA.** Your brief lists finding ids. Full records:
`python3 -c "import json;d=json.load(open('docs/review-r2/RAW_SURVEY_RESULTS.json'))['result'];print(json.dumps(next(f for r in d['subsystems']+d['dimensions'] for f in r['findings'] if f['id']=='<ID>'),indent=1))"`
Verdicts + BINDING corrections:
`python3 -c "import json;d=json.load(open('docs/review-r2/VERIFY_SUBSYSTEMS_RESULTS.json'))['result'];print(json.dumps(next(r for r in d['results'] if r['id']=='<ID>'),indent=1))"`
(dimension ids live in VERIFY_DIMS_RESULTS.json). PARTIAL verdicts' corrections OVERRIDE the
original finding text. REFUTED ids are excluded from your scope — do not fix them.

**GATES.** During dev: focused test files. Before your FINAL commit: the full gate
(`npm run check`). Known hazards: (1) the load-flake set — if suite files red under load,
re-run those files in isolation before diagnosing (documented pattern; 51/51 isolated =
green); (2) the stale-dist gotcha — `check` runs tests BEFORE build, so dist-contract reds
after a lineage switch may be stale-dist artifacts: `npm run build` first, then re-check;
(3) some files embed raw NUL (generosityKernel.js) — use `grep -a` / python reads.

**DONE =** every in-scope fix implemented-with-pin OR recorded-deferred-with-reason; full gate
green (numbers quoted); work COMMITTED on your branch (one commit per coherent group is fine);
NOTHING merged to review-fixes (the manager reviews per §0.3 and merges); final report lists:
per-finding disposition, files touched, tests added, gate numbers, byte-identity evidence,
deferrals, and any JUDGMENT calls made (vetoable format).
