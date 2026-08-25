---
name: ""
metadata:
  node_type: memory
  title: "R-BLD-6: the size baseline IS the banked-debt ledger — bank debt IN it, never bypass the hook (and both estate ratchets had silently broken)"
  date: 2026-08-03
  tags:
    - chair-ruling
    - size-baseline
    - any-cast-ratchet
    - hazard
    - lint-staged
    - wr-7b
    - burn-down
  surfaced_by: WR-7b Lane A land (Fable chair)
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T12:52:34.919Z
---

## The ruling (R-BLD-6, vetoable, landed @ e51ec17e on claude/composite-r4)

A wave whose file-budget debt the chair has already BANKED in a
`docs/FABLE_VALIDATION_QUEUE.md` guardrail column still cannot commit, because
`.husky/pre-commit` runs lint-staged → eslint and `eslint.config.js` reads its
per-file `max-lines` ceilings out of `scripts/.size-baseline.json`. The
machinery blocks exactly what the ruling banked.

**The resolution is NOT `--no-verify` and NOT an unplanned refactor inside a
functional wave. It is to make the banked ruling MECHANICAL: record it in
`scripts/.size-baseline.json`, which IS the estate's burn-down ledger, where
`tests/lint/sizeBaseline.test.js` keeps it exact.** Entering a file there is a
DEBT ENTRY, not a licence — the test's below-ratchets-down property forces the
number down and forces the entry's deletion once the file crosses its layer
ceiling.

## ⚠️⚠️ The finding that forced it — BOTH estate ratchets had been broken for waves

`.husky/pre-commit` → lint-staged lints **only STAGED files**. A lane that never
stages an over-ceiling file commits happily past a red house test. So the
ratchets drift invisibly until some wave is finally forced to stage the files.

Measured at HEAD `eea5a6c6` (2026-08-03), in a throwaway detached worktree:

- **SIZE:** 18 files exceeded their layer ceiling; only **12** were baselined.
  Six missing (envoyErrand 1389, eventProse 1334, peaceTerms 1289, roadsKernel
  838, settlementStrategy 812, warTermination 880) and three grown past frozen
  (applyWorldPulse 1388>903, pulseKernel 1580>1362, warDeployment 1412>1106).
- **ANY-CAST:** `tests/lint/domainAnyCastBaseline.test.js` RED with **19**
  inherited offenders at the same clean parent. Still red. Must NEVER be
  silently re-recorded with `node scripts/count-domain-any.mjs --update`.

The structural cure for both — a gate that lints/tests the WHOLE covered
surface, or CI running these two tests — is recorded as OWED, not done.

## How to apply

1. **Measure with the enforcer's own engine, never by eye or `wc -l`.** Use
   eslint's `Linter` with `max-lines: ['error', {max:1, skipBlankLines:true,
   skipComments:true}]` and espree + `ecmaFeatures.jsx` — the same construction
   `tests/lint/sizeBaseline.test.js` uses, so measurer and enforcer cannot
   disagree. A standalone script must import eslint by absolute path
   (`<worktree>/node_modules/eslint/lib/api.js` — the package's `exports` map
   has no `lib/index.js`) or node cannot resolve it from the scratchpad.
2. **Attribute inherited vs wave BEFORE writing any number.** Measure at the
   clean parent in a detached worktree and again in the tree, then diff. In
   WR-7b: 9,588 effective lines were already over ceiling at HEAD; the wave
   added +1,647 gross / +1,064 net. Five of the eight entries were
   byte-identical to HEAD and owed the wave nothing.
3. **Do not add a file that the wave brought back UNDER its ceiling.**
   eventProse went 1334 → 751 and is deliberately absent; the exact-set property
   reds if you add it. The offender set shrank 18 → 17.
4. Put the census and the burn-down obligation in a `_`-prefixed key. **Both
   consumers filter keys starting with `_`** (`eslint.config.js` line 48 and the
   test's `rawBaseline` filter), so the ledger can document itself in place.

## ⚠️ Trap: `count-domain-any.mjs` reads your PROSE

`scripts/count-domain-any.mjs` matches a JSDoc tag followed by a brace **anywhere
in the file, comment prose included**. Writing the literal cast name inside an
explanatory comment about the ratchet re-creates the very hole the comment is
explaining — my first fix still counted 25/24 for that reason alone. Describe the
cast in words; never spell it.

## Cross-refs

- Commits: `e51ec17e` (WR-7b whole, 54 files), `f99ff857` (factionPairOf import),
  `5702277a` (the any-cast +1 typed out).
- Queue rows: R-BLD-6 and the WR-7b landing row in `docs/FABLE_VALIDATION_QUEUE.md`.
- Sibling hazard: [[sizebaseline-exact-ceiling-hazard]] (TOLERANCE-0 exactness).
- Verifier method note: NEVER diff two gate-tails — the tail is lossy and
  manufactures findings; use full `npx vitest run > file` logs for walker diffs.
