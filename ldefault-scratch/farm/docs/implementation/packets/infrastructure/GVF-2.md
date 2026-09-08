# GVF / GVF-2 — the anti-vacuity CLASS FOLD (member 2 of `gvf`, §116.3)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `ec7443301ec74325cd051890d0e99ed452bd8ad5`
  (the `gv` terminal; the micro-batch's third train base)
- **Train:** `gvf`, family **GVF**, member **2** of 3.
- **Preamble:** none — GVF is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§116.3** (structural prevention over
  guard-by-guard probing) · **§75** · **§137** · **§142**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.2, annex rows `MB.M8`, `MB.U4`; law
  `MB.L6` (the fold lands AFTER the guards it convicts).

---

## §1 · THE DEFECT

`gv` cured five guards of two recurring shapes. Nothing stops the sixth. §116.3 rules that the
answer is structural prevention rather than guard-by-guard probing, so both shapes fold into the
standing anti-vacuity walker as rules:

- **Rule 3 — SAME-LINE CONJUNCTION.** Two distinct source-derived probes required to match the
  same PHYSICAL line. Prettier splits any call whose arguments do not fit one line — exactly the
  shape a long secret travels in — so the sink lands on one line and the value on the next and
  the conjunction goes silently blind.
- **Rule 4 — UNCONSUMED GATE CALL.** A guard proving a symbol is imported and that its name
  appears followed by `(`. Presence is not enforcement: `if (false && await isSessionSuperseded(…))`
  satisfies both probes while the gate is disarmed.

## §2 · THE SCOPE DECISION IS THE MEMBER'S REAL CONTENT (`MB.M8`, `MB.U4`)

Three of the five convicted guards live OUTSIDE the walker's `inScope` — `sessionGateCensus`
(`tests/edgeFunctions/`), `ciCheckParity` (`tests/build/`) and `spatialLedgerCoverage`
(`tests/lib/`). A prevention rule that cannot see the directories where its own class has
actually occurred is vacuity one level up.

⛔ **BUT THE WIDENING IS NOT FREE, AND THE COMPILE NEVER PRICED THAT.** `MB.U4` priced the two
NEW rules' population. Running the walker's THREE EXISTING rules over the same +247 files reports
**seven pre-existing hits**: Rule 1a ×2 (`tests/lib/emailTemplates.test.js:169`, `:185` — both a
bare `if (!edgeSource) return;` directly before the only assertion, genuine), Rule 1b ×1
(`tests/edgeFunctions/surveyorByok.test.js::block` — the extractor-NAME heuristic the walker's own
ACCEPTED GAPS note admits), Rule 2 ×4 (`providerErrors`, `founderChairRequest`, `importScrub`,
`townMapExport`). Widening all five rules at once forces a choice between a red gate and exemption
rows the file's own header calls silencers.

**THE RESOLUTION: A PER-RULE SCOPE.** Rules 1a/1b/2 keep `inScope`, the population they were
triaged against. Rules 3 and 4 get `inFoldScope`, which covers the three directories where the
folded class lived. The seven are RECORDED in-file by name and by rule as a scope boundary with a
measured census — nothing is exempted, because those rules do not scan there. Triaging them is its
own act and the fold does not smuggle it in.

**MEASURED at this base:** 270 files narrow, 517 fold-scope (+247). Rule 3 and Rule 4 each convict
**nothing extra** in the widened set — the widening buys future coverage, not a debt discovery.

## §3 · THE THIRD RULE-3 INSTANCE, CURED HERE (`GVF-2'`)

`tests/security/mapForkXssChain.test.js:341` carries the same blindness — a per-line
`console` × `token` conjunction guarding the Dropbox OAuth token — and GV-1 did not cure it. It is
cured in THIS commit through the helper GV-1 landed, never carried as an allowlist row. Comment
lines are blanked first (preserving line count) so the historical commented-out debug line stays
excluded exactly as before while the window widens to the statement.

## §4 · A LATENT SKELETON DEFECT, FOUND AND CLOSED

`codeSkeleton` mis-parsed `line => /re/.test(line)`: the last non-space character before the
slash is `>`, which was not in its regex-trigger set, so the opening slash read as DIVISION and
the NEXT slash opened a phantom regex that blanked the real code after it — including the `&&`
Rule 3 hunts. Rule 3 would have shipped blind to the most natural spelling of its own defect.
Adding `>` was measured across all 517 files: **no convictions gained or lost by any of the five
rules**, one blind spot closed. A `/` can never be division after `>`.

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | Rules 3 and 4 land in the file's fail-closed idiom with empty allowlists |
| A2 | the fold scope covers tests/edgeFunctions, tests/build and tests/lib, and is pinned wider than the base scope |
| A3 | Rules 1a/1b/2 keep their triaged scope, and the seven are recorded by name and rule |
| A4 | the third Rule-3 instance is cured in this commit, not exempted |
| A5 | each new rule fires on a planted shape and clears the cured form |
| A6 | neither new rule can be forged from a shape quoted in a string or comment |
| A7 | a planted Rule-4 shape in tests/edgeFunctions reds — reachable only via the widening |
| A8 | the skeleton arrow fix changes no conviction anywhere in scope |

## §6 · CHECKS

```
npx vitest run tests/lint/contractTestAntiVacuity.walker.test.js \
  tests/security/mapForkXssChain.test.js tests/edgeFunctions/sessionGateCensus.test.js \
  tests/build/ciCheckParity.test.js
```

## §7 · MUTANTS AND HAZARDS

- **Estate plant — Rule 3.** The historical pre-cure line restored in the REAL
  `mapForkXssChain.test.js` reds Rule 3, naming its line and the cure.
- **Estate plant — Rule 4.** GV-2's pre-cure presence-only gate restored in the REAL
  `sessionGateCensus.test.js` reds Rule 4. That file is `inScope=false` / `inFoldScope=true`, so
  this conviction is the EXECUTED proof the widening is load-bearing.
- Both restored byte-exact, verified by `cmp`.
- ⚠ **The compile's live-subject argument for the widening is STALE at this base.** It rested on
  Rule 4's only live subject sitting in `tests/edgeFunctions/`; GV-2 cured that subject, so both
  rules land with an empty live population — which `MB.L6` requires and which is this file's own
  birth idiom. The widening is justified by WHERE THE CLASS OCCURRED, proven by the plant above.
- ⚠ **Same-seed: NEUTRAL.** Test files only.
- ⚠ **Census:** no test FILE is created or deleted. `titles` moves.
