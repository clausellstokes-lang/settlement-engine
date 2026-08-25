---
name: l6-formative-loop-shipped
description: "Wave L-6 BUILT 2026-07-27 (uncommitted, minifold): supabase/functions/_shared/repairLoop.ts turns a failed validation into a bounded repair re-prompt; ships INERT (REPAIR_ROUNDS_BY_TIER all zero); the 7 runCreditedCall invariants pinned untouched"
metadata: 
  node_type: memory
  type: build
  modified: 2026-07-27T18:13:04.065Z
  originSessionId: 88199162-811c-4be3-8912-b0f33c64d43d
---

WAVE L-6, THE FORMATIVE LOOP (owner ruling 2026-07-27: "the tests become part of the
process for the AI rather than a barrier"). BUILT + gated, UNCOMMITTED, on the minifold
worktree (branch claude/composite-r4). It overturns the surveyed fact that failed
validation never re-prompts, and overturns this design doc's own §6 non-goal.

**The engine:** `supabase/functions/_shared/repairLoop.ts` — `runWithRepair({basePrompt,
callModel, parse, validate, merge, renderPrompt?, maxRounds, roundTimeoutMs, deadline,
now?, usage?})`. Draft once (UNCONDITIONALLY: the credit is already spent), parse,
validate; while violations remain AND rounds remain AND the deadline allows, render the
validator's own reason codes as a typed feedback block, re-call the SAME model with
`basePrompt + repair tail`, merge, RE-VALIDATE the merge. Returns `{answerText, parsed?,
halted, roundsUsed, violationsInitial, violationsFinal, usage}`.

**The four load-bearing properties (each pinned, `_shared/repairLoop.test.ts`, 25 Deno tests):**
1. INERT: `REPAIR_ROUNDS_BY_TIER = {scout:0, journeyman:0, master:0}`. Zero rounds means
   exactly ONE provider call with the base prompt byte-for-byte, and the parsed result is
   compared against the literal pre-L-6 expression `compile<Surface>(answerText, vocab)`
   for all five cores.
2. CACHE: the repair prompt is `basePrompt + tail`, so `splitForAnthropic`'s first-marker
   split still lands at the sealed static prefix and the charter is cache-READ on repairs.
   The loop strips its own fence tokens AND the cache marker out of the prior answer.
3. MERGE SAFETY: the merged value is re-validated; if it carries a violation NEITHER input
   carried, the merge is discarded WHOLE and the loop stops on the last accepted state.
4. CONFLICTED WITNESS: no loop decision reads model-authored confidence/rider/musing. A
   self-declared fix that fails the wall is an executed test case.

**Money:** the loop lives INSIDE `runCreditedCall`'s `callModel` window. Three provider
round-trips still make ONE reserve, ONE rate-limit, ONE `spend_credits`, ONE
`ai_usage_events` row, ONE release, and a refund only on failure — pinned in
`tests/edgeFunctions/creditFlow.test.js` (9 → 13 tests). Repair tokens sum through a
CALLER-OWNED `RepairUsage` ledger, which is why it is passed in rather than only returned:
a provider throw on round 2 must not erase round 1's tokens from the COGS row.

**Why:** the design's constitution is "same confirmed buckets + same seed = same world on
every tier". A repair loop is safe under that because the validator, not the model, decides
what is accepted; the loop only buys the model more chances to satisfy a verdict it can
now read.

**How to apply:**
- A NEW compile surface (one that seals a cache prefix via `_shared/anthropicCache.ts`)
  MUST wire the loop, or `tests/edgeFunctions/aiProviderAbstraction.test.js` reds. That
  wall is DISCOVERED from source, not hand-listed.
- Activation is an OWNER SWITCH, M5-adjacent (batch with the mig-192 tier multiplier).
  Intended shape `{scout:0, journeyman:1, master:2}`. Never flip it in a build wave: repair
  rounds are provider spend.
- Per-surface verdict/fold helpers live NEXT TO THE VALIDATOR, in each core:
  `contentRepairViolations`/`mergeContentCompiled`, `constructRepairViolations`/
  `mergeConstructResults`, `interpretRepairViolations`/`mergeInterpretations`,
  `autonomyRepairViolations`/`mergeAutonomyCompositions`, `styleRepairViolations`/
  `mergeStyleCompiled`.
- ⚠ style-overhaul's EDGE verdict is STRUCTURAL ONLY (top-level fields the coercion
  dropped, spelled `unsupported_field` exactly as `src/design/townMapStyleWall.js` spells
  it). Value-level style repair needs `validateBespokeStyle`'s verdict at the edge, which
  is a request-shape change (owner-gated). Do NOT add a second value checker on the edge:
  that is the fork that drifts.
- ⚠ `deno task lint:edge` is a PRE-EXISTING-RED gate (204 `no-import-prefix` findings
  tree-wide) and is NOT part of `npm run check`. A new Deno test importing
  `https://deno.land/std@.../assert/mod.ts` adds one more; that is the house pattern
  (`anthropicCache.test.ts` does the same).

Related: [[capability-remediation-program-state]] [[minifold-tree-is-live]].
