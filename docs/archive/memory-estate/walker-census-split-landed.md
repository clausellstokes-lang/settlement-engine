---
name: walker-census-split-landed
description: "⭐⭐ A FAILING TEST IS DEBT; A FAILING WALKER IS A DISABLED GUARD — they must never be frozen by the same mechanism. Four enforcement-walker rows in scripts/.test-ratchet-baseline.json meant a NEW un-anchored negative or bare seed loop reddened NOTHING, and the inventories inside those tolerated rows grew unseen (1,303→1,565 sites, 13→26 loops). Cured at af8815e9 by re-freezing each walker's OWN inventory plus an EXACT-IDENTITY generation-facing quarantine; census 49→40"
metadata:
  node_type: memory
  type: project
  created: 2026-08-07
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T23:35:27.302Z
---

# The walker/census split — landed af8815e9 on claude/composite-r4

## The law this establishes

**A failing TEST is debt. A failing WALKER is a DISABLED GUARD. They must never be
frozen by the same mechanism.** The step-12 per-test census
(`scripts/.test-ratchet-baseline.json`) tolerates a *whole row*, and a tolerated row is
**byte-identical however much worse the tree gets** — so once an enforcement walker is
banked there, its verdict stops carrying information.

`CONTRIBUTING.md` now states this rule inline, and
`tests/lint/testRatchet.test.js`'s `CEILING` comment says **⛔ NEVER RE-ADD A WALKER ROW
HERE**.

## What was measured (CONFIRMED, 2026-08-07)

Premise proved BEFORE repair: a bare `not.toContain` planted in
`tests/simulation/discourseParity.test.js`, full suite run in an integrity-counted
`git archive` of `36e50c73` → **the plant appears nowhere in the ratchet's regression
list**. The four walker rows absorbed it silently.

Growth while the rows were tolerated (both ends measured — live by each walker's own
`UPDATE_EPISTEMIC_ALLOWLIST` regeneration, frozen by summing the literal being replaced):

| walker | frozen | live at 36e50c73 |
|---|---|---|
| negativeAssertionAnchor | 447 files / 1,303 sites | 519 files / **1,565** sites |
| seedLoopTotality | 10 files / 13 loops | 18 files / **26** loops (DOUBLED) |

⚠ The walkers' own header prose said "1,309" — itself stale. **Derive from the literal,
never restate the header.**

## The shape of the cure (reusable)

1. Re-freeze the walker's **own** shrink-only inventory from its own regeneration, taken
   in an archive of a committed sha.
2. Split generation-facing re-admissions into a separately-named
   `READMITTED_GENERATION_FACING` map audited by **EXACT IDENTITY** — a new file reds,
   growth reds, and an **un-banked shrink also reds** (so a repair cannot become slack).
3. Keep a third arm asserting the **general roster may never name a generation-facing
   file**. This is the load-bearing one: a generation-facing row in the general roster
   would raise that file's ceiling and silence new offences in a swept tree.
4. `ceilingFor(file) = GENERAL[file] ?? QUARANTINE[file] ?? 0` — the zero default for an
   unlisted file is what makes a brand-new offender red.
5. Only then remove the rows from the census.

**Rejected alternative, and why it is a trap:** leaving the "trees stay at EXACT zero"
arm red in the census. That test asserts TWO things, and its second half *is* the
anti-laundering check — baselining the whole arm disables that half too.

## How to prove a guard like this actually works

Paired FULL-SUITE mutant, never scoped: plant → `npm run test:ratchet` exit 1 with the
regressions naming exactly the guard's arms → restore → exit 0. Prove the restore two
independent ways: `cmp` against pre-plant copies **and** the archive's own `git status`
(which should list only your cure files). Use three plants: a new offender in a protected
tree, one MORE in a file already at its frozen ceiling, and one per walker.

## What is owed

- The habitat is **inventoried, not burned down**: 1,565 sites and 26 loops remain, a
  separate wave. Anchor via `tests/helpers/anchoredNegatives.js`; route loops through
  `tests/helpers/seedFailures.js`.
- ⚠ The EP-2/EP-6 "four trees at EXACT zero, not spendable" claim was **relaxed to
  "exactly this enumerated set"** — 3 files / 5 sites and 1 file / 2 loops re-offended
  while the arm was frozen. Enforcement against NEW offenders is unchanged (strictly
  stronger, since the census no longer tolerates the row); the aspiration is owed back.
  Emptying `READMITTED_GENERATION_FACING` restores it. `HZ-EPISTEMIC` stays **PARTIAL**
  and its `upgradePath` names this as the priority.

## Also banked in the same commit

Census **49 → 40** and `CEILING` 49 → 40. Five ratchet-down wins, each re-verified
PASSING in a pristine archive before removal (`layerBoundaries`,
`domainGeneratorsBoundary` ×2, `userRouteIdentityLeaf`, `mapOverlayTransformContract`) —
the first three cleared by the layering inversion at `67f8a58e`. **`--update` is
REMOVE-ONLY, so a removal you cannot reproduce is a silent widening.**

⚠ The six built-artifact rows (3× `edgeSharedBundleReproducibility`, 3× `ai*Bundle.freshness`)
were LEFT FROZEN per the chair — but measured 2026-08-07 they **pass in both the clean
archive and the live dirty tree**. Their verdict is a function of build state, not source,
so one green reading is not evidence the debt is repaid. Open question for the owner.
