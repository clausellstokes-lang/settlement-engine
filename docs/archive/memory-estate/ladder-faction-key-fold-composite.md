---
name: ladder-faction-key-fold-composite
description: "THE LADDER faction-key bug folded into claude/the-composite (25749ae5 + dc0b6e2b); the slugify-revert trap at fold, the inertness correction, and the newly-activated traditions cross-layer join"
metadata: 
  node_type: memory
  created: 2026-07-19
  type: project
  branch: claude/the-composite (aad6265e -> dc0b6e2b)
  commits: "25749ae5 (fold of the-ladder 14e8a2fa), dc0b6e2b (pin hardening)"
  originSessionId: f8133321-d61d-4f4d-992b-57eb10e4ee46
  modified: 2026-07-20T00:02:58.343Z
---

# THE LADDER faction-key fix — FOLDED into the composite, 2026-07-19

⭐ The eighth and last ladder commit (14e8a2fa) is now on **claude/the-composite**.
Predecessors through db6b505e were already ancestors. Composite tip: **dc0b6e2b**.
NOT pushed. Flag still dark.

## What the bug actually was (the recorded severity was WRONG)
Real `powerStructure.factions` records carry the name in `.faction` — keys are
`[faction, modifier, power, desc, isGoverning, category, rawPower, powerLabel]`, with
**no `.name` and no `.id`** (CONFIRMED by probe over a real `generatePowerStructure`
run). The ladder read `.name`/`.id`, so all factions keyed `fac.unknown`.

**The correction:** every prior account (14e8a2fa's own message, the design docs) says
the kernel's first-wins loop *merged* all factions into one ladder. It merges, but the
merged bucket is then **empty** — `npcInFaction` matches nobody, so
`if (!rungs.length) continue` fires before `factions[fkey]` is assigned; `factions`
stays `{}`, `sortedRecord` returns null, `mirrorOf` returns null. A lit pre-fix advance
produced `changed:false` and **no mirror at all**. The ladder was **INERT, not merged**.
That is why the dark goldens never noticed: the failure mode is indistinguishable from
never having been lit. Revert-proof measured 0 ladders, not 1.

## ⚠️ THE FOLD TRAP — do not cherry-pick ladder commits blind
Composite commit **8a5b10a1** migrated the slug lines in BOTH touched files onto the
shared `src/kernel/slugify.js` primitive. 14e8a2fa predates that, so its hunks
**reinstate the hand-rolled inline regex**. `git apply --check` fails on ladderRead.js;
`-X theirs` or resolving toward the commit would silently REVERT the slugify migration
on an identity-bearing slug line — re-forking the single-writer primitive — and **no
test would catch it**, because the two forms are byte-equivalent today.
Resolve by hand: keep the composite's `slugify(name, {sep:'_',max:80,fallback:'unknown',
empty:'unknown'})` call on both sides, change only the name-derivation arm.

**I walked into this trap once**: `git diff db6b505e..HEAD -- <2 paths> | head -20`
truncated the second file's hunks, so npcLadderState.js looked drift-free and I
clobbered it with `git checkout 14e8a2fa -- <path>`. Caught by an explicit unpiped
re-check. Same family as [piped-gate-exit-masking] — **never size a drift check through
a pipe that can truncate**.

## ⚠️ NEWLY ACTIVATED: the traditions cross-layer join (a THIRD key-minter)
`traditionsKernel.js:249` reads `ladderInstabilityOf(settlement, rec.ownerKey)` — the
TRADITIONS owner key (`traditions/politics.js factionOwnerKey`) indexed straight into
the LADDER's mirror. Pre-fix this was **dead code** (ladder keyed `fac.unknown`,
ownerKey keyed the true slug — could never hit). The fix **activates** it: with
`npcLadderEnabled` + `traditionsEnabled` both lit, festival outcomes become
ladder-churn-sensitive. Neither the commit nor the design docs gate this.
Pinned for parity in dc0b6e2b.

**DEFERRED, documented not dropped:** `ladderFactionKey` short-circuits on `.id` and
returns it verbatim; `factionOwnerKey` ignores `.id` and always slugs the name. So an
id-bearing record keys `fac.garrison` vs `fac.the_garrison` — a permanent miss.
Generated records carry no `.id` (sound); hand-authored/fixture ones (sampleDossier.json)
miss. Reconciling two minters over one keyspace is an **owner-gated keyspace decision**.
The divergence is PINNED AS CURRENT BEHAVIOR so it stays visible — do not delete that
test without deciding the keyspace question.

## Why folding BEFORE lighting was the load-bearing ordering
The kernel reads `prior.factions[fkey]` from a persisted sidecar. Folding before
`npcLadderEnabled` is ever lit means no world ever mints a `fac.unknown` mirror.
Probed the inverse: a planted stale mirror is **discarded, not orphaned** (both
structures are full re-projections each advance), and per-NPC standings survive a rekey
because they key on `npcId`, not the faction key. **No data migration needed, ever.**

## Verification (all executed, this tree)
- Pin 12 passed. **Revert-proof at base aad6265e: 7 failed / 5 passed** (was 5/4 before
  hardening) — every assertion pins the fix, not the weather.
- `tests/domain` full shard: **527 files / 6788 tests, 0 failures**.
- tsc 0 · check-domain-strict 0 (ceiling 0) · eslint 0.
- **Eager closure delta = EXACTLY 0 B.** Measured both sides: base aad6265e = 1,040,998;
  post-fold = 1,040,998. The verify:dist red is the inherited owner-gated breach,
  neither worsened nor cured. Measure with `VERIFY_DIST=1 vitest run
  tests/build/vendorPdfLazy.test.js` AFTER `npm run build` — the assertion is
  `it.skipIf(!requireDistRead)`, so without `VERIFY_DIST=1` it **silently skips** and
  the file reports green.
- 5 pre-existing golden reds (worldpulseDeityGolden, goldenViewModel, beliefMapGolden,
  generatorGoldenMaster, joins/ordering) — **identical 5 failed / 21 passed at base**,
  so NOT mine.

## ⚠️ Gotcha corrections to the index
- The composite worktree `.claude/worktrees/agent-a04d3f325c72e62dd` has an **EMPTY
  node_modules directory** (`ls | wc -l` = 0). Resolution still walks up to the main
  tree, so vitest works — but run it as
  `/Users/cstokes/Desktop/settlement-engine/node_modules/.bin/vitest` from inside the
  worktree. A scratchpad worktree (outside the repo) gets **no walk-up** — symlink
  main's node_modules into it or vite.config.js fails to load.
- **REFUTED:** a recon agent reported `docs/DESIGN_DEEP_COUPLINGS.md` as untracked and
  one `git clean` from destruction. It is committed at **26cf51a9** and `git status`
  shows it clean. Do not act on that alarm.

## Still open
- ChroniclePanel.jsx:182 renders `f?.name || 'Unnamed'` over `powerStructure.factions` —
  same defect class, AI-settlement display path. Spawned as a follow-up; verify the AI
  entry shape before fixing (an edge transform may rename fields).
- The flag stays dark; lighting joins THE ONE REGEN.

Related: [[the-ladder-engine-lift-3]] [[composite-budget-breach-998b]]
[[piped-gate-exit-masking]] [[wave-c-traditions-seams-shipped]]
