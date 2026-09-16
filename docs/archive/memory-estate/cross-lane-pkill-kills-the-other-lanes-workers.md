---
name: cross-lane-pkill-kills-the-other-lanes-workers
description: "⚠⚠ An archive's symlinked node_modules makes its vitest workers advertise the MAIN worktree's path — so a pkill by argv kills the OTHER lane's census, and --update does not enforce the vanished guard"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T02:20:57.681Z
---

MEASURED 2026-08-11, disclosed by the offending lane. A repair lane's foreground
Bash timed out (exit 143) orphaning its own vitest probe; it ran
`pkill -f "minifold/node_modules/vitest/dist/workers/forks.js"` believing the
survivors were its own. **They belonged to the census lane running in an ARCHIVE.**

⚠⚠ **THE MECHANISM: the archive-census law REQUIRES symlinking the worktree's own
`node_modules` (the main tree lacks `three` + `pg`), so the archive's vitest workers
advertise the MAIN WORKTREE'S ABSOLUTE PATH in argv.** Argv is therefore NOT a lane
discriminator — two lanes' workers are textually identical. This is a direct,
unavoidable consequence of [[archive-census-node-modules-leg]]; the two laws
interact badly and neither mentions the other.

⚠⚠ **WHY IT IS NOT BENIGN:** `check-test-ratchet.mjs` fails closed on a failing test
absent from the census (:388), and the baseline file was verifiably never written —
BUT **the `vanished` guard is deliberately NOT enforced under `--update` (:342)**, so
a baselined-failing test whose worker was killed can be **SILENTLY DROPPED** from the
entries list. A killed census can therefore SHRINK the census without any red.

**Why: a shrink-only ratchet trusts its own measurement; a contaminated measurement
launders a lost guard into a smaller, greener-looking census.**

**How to apply:**
- ⛔ **NEVER `pkill -f` by a node_modules/vitest argv pattern in a shared tree.** Kill
  by the PID SET YOU RECORDED AT SPAWN, or kill your own process group.
- After ANY cross-lane kill: **the census run is void — re-run it from scratch on a
  quiet tree.** Never bank an entries-list change from a run whose workers died.
- A census report must include the **entries-list DIFF** against the previous
  baseline, so a silent vanish is VISIBLE rather than inferred.
- The chair's sequencing cure: land the editing lane FIRST, then re-base the census
  lane to the new HEAD and give it an explicitly QUIET tree.
⭐ The offending lane DISCLOSED this unprompted with the blast radius measured — the
behavior to keep rewarding; an undisclosed kill would have shipped a shrunken census.
Related: [[two-lane-commit-shared-index-race]], [[concurrency-law-ruled]],
[[test-timeout-flake-and-phantom-census-class]].
