---
name: cq5-flag-law-collides-with-parallel-lanes
description: 2026-08-04 — ⚠⚠ the CQ5 one-commit flag law is UNLANDABLE for two concurrent lanes in one worktree; GR-1 built green and STOPPED at the commit
metadata: 
  node_type: memory
  type: project
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-06T10:25:07.476Z
---

# ⚠⚠ THE CQ5 × PARALLEL-LANE COLLISION (measured, FP cycle 1, 2026-08-04)

**The class.** CR-WR10-C / the FP charter's §3 flag law binds every flag to land
its manifest entry (`ENGINE_GATED_VIRTUAL_RULE_KEYS`, `worldPulse/simulationRules.js`),
its certification row (`certification/subsystemRowsVirtual.js` + that lane's test's
hand-written `VIRTUAL_RULES` list), and its FIRST strict gate read **in ONE commit**.
Three of those four files are SHARED BY EVERY FLAG-BEARING WAVE. So when the
orchestrator runs two flag-bearing waves in parallel against ONE worktree on ONE
branch, neither can land: a pathspec commit takes whole files, so committing the
manifest carries the other lane's flag hunks too.

**Why it is not merely untidy — it is a CERTAINLY-BROKEN commit.** GR-1 and GR-0
both edit `peaceTerms.js`. GR-0's hunk is `import … from './treatyLifecycleVoice.js'`
and that leaf was still UNTRACKED. Committing `peaceTerms.js` would put an import of
a non-existent file into HEAD — green in the worktree (the file is on disk), broken
in any clone, archive or CI checkout of that commit. That is the decisive fact, not
a preference.

**Why the obvious workarounds are all refused.**
- Partial staging (`git add -p` / index surgery) → the pre-commit hook is
  `npx lint-staged`, and lint-staged STASHES unstaged changes when a file is
  partially staged. With three lanes' uncommitted work in the tree that is the
  recorded agent-stash incident waiting to happen. `git stash` is forbidden anyway.
- Committing only the exclusively-mine files → lands a `rules.<key> === true` gate
  read with no manifest entry, which REDS `engineGatedRuleKeys.walker` by design.
  The gate read and the manifest entry are inseparable by law.
- Committing the co-edited files whole → commits another lane's mid-flight work
  under my commit message, plus the broken import above.

**The convention the tree actually demonstrates:** lane TR-9c committed
`c7933e84` with a pathspec set of exactly its own four files and left every shared
dirty file alone. That works for a NO-FLAG wave (a pure new leaf). It cannot work
for a flag wave.

**HOW TO APPLY.** Before dispatching parallel FP waves: either (a) serialize the
flag-bearing waves so only one at a time holds `simulationRules.js` +
`subsystemRowsVirtual.js` + its test, or (b) give each lane its own worktree/branch
and merge, or (c) split the flag join into its own tiny chair-sequenced commit per
wave. Waves with NO flag (SP-A, CW-0w, TR-9-contract) parallelize safely.

**Also measured, same cycle:** `peaceTerms.js` had 24 effective lines of headroom
(776/800) at cycle start; GR-1 (+5) and GR-0 (+4) took 9 of them in one evening
without either lane seeing the other's spend. A shared hot file near its ceiling
needs a per-cycle line budget, not per-wave.

**GR-1's own state at the stop:** BUILT AND GREEN, uncommitted, in
`.claude/worktrees/minifold`. See [[gr1-oath-holder-identity-built]].

**⛔ WORKAROUND (b) IS SINCE REFUSED (noted 2026-08-06 during an index-verification
pass; vetoable).** The chair's later ruling — [[concurrency-law-ruled]], 2026-08-06
— REFUSES a second worktree for engine lanes: the gate is a MACHINE mutex, not a
tree resource (full suite 636s / 2,129 files / 22,581 tests), and the exact-census /
shrink-only files merge TEXTUALLY GREEN and SEMANTICALLY WRONG in both parents. The
sanctioned cure is (a) serialize, or the SERIALIZED LANDING recipe in
[[fp-cycle1-serialized-landing-and-cq5-row-guard]]. Nothing above is retracted —
this note only marks which branch of HOW TO APPLY the chair has since closed.
