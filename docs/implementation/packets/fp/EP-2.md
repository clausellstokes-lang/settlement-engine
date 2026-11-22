# EP / EP-2 — the fork semantics (stage 3 of the `ep-1` split promotion)

- **Status:** LANDED
- **Landing commit:** `20df088b` (the implementation; `7feb70a5` is this
  stage's promotion). Do not redispatch.
- **Verified base:** `claude/composite-r4` at `da8207f3e4d6f4f7683e9e9e63e3de4b8b60d14d`
  (the EP-1 terminal — stage 2 of this same train, ODQ §191)
- **Train:** `ep-1`, family **EP**, member **3** of 5. ⛔ The five members are NOT
  path-disjoint (TTS S1: eleven duplicate-change-path convictions), so the train promotes in
  **FOUR STAGES**. **This packet is stage 3 and promotes ALONGSIDE EP-3A**, which is lawful
  because those two are mutually path-disjoint and because EP-1's LANDED status released
  `campaignAdvanceSession.js`.
- **Preamble:** none. A family preamble is a chair act (PACKET_STANDARD, "Family packet
  preambles") and EP still has none; this packet carries its own law, as EP-0's and EP-1's did.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§191** (stage three dispatched) · **§188.3**
  (the four-stage split promotion) · **§102.3** (the mutation-coverage trigger is a NAME
  PATTERN) · **§75** (the mutant-control idiom) · **§183.3** (no lane inherits `BASE_STATE`
  figures — every figure below is re-executed at this tip).
- **Design authority:** `docs/DESIGN_FP_ARCH_EP.md` §1.3, §1.4, §2.2, §2.3b, §3c, §3d, §4.
- **Compile of record:** `laneTC24-EP-PLAN.md` §3.3, §3.6.
- **THE FLAG:** `advanceEpochEnabled` — a NO-FLAG SLICE. The §49/§50/§148 bill was paid in
  full by EP-1 and is not re-paid here; this member touches no manifest and mints no key.

---

## §1 · WHAT THIS WAVE DOES

EP-1 minted the nonce and threaded it into the pulse root. This member decides what happens
at every point the advance FORKS — a pause, a reload, a preview, a forecast, an undo — and
the whole of it is one rule with two halves:

- **A RESUMED advance REUSES its epoch.** It is a CONSTRAINT, not an opportunity: the resume
  re-derives the paused tick from the cursor's pre-tick inputs and must land byte-identically
  on the minors the pause already committed. Minting there would split a single advance
  across two streams, mid-interval, with no crash — a silent divergence.
- **A NON-COMMITTING consumer INHERITS, NEVER MINTS.** The rules-dialog preview and the realm
  forecast exist to predict the advance the DM is about to press; one that minted its own
  nonce would show a future the Advance button then refuses to produce.

## §2 · THE CURE

| Surface | The edit |
|---|---|
| `buildPausedAdvanceCursor` | a fourth parameter `epochTerm`, materialized as `...(epochTerm ? { advanceEpoch: epochTerm } : {})` — **MATERIALIZATION M2**, keyed on the FLAG-GATED term |
| `runAdvanceCampaignWorld`'s park | passes `advanceEpoch`, which on that path IS the gated term (the mint is `epochLit ? … : null`) |
| `runResolveIntervalMajors` | its OWN `epochTerm`, gated by a by-name strict read, threaded `options.epoch \|\| cursor.advanceEpoch \|\| null` — the identical three-term fallback `now` already uses — into `resumeArgs.advanceEpoch` and into the re-pause park |
| `campaignWorldPulseDeferred.js` | the preview literal gains `advanceEpoch: previewCampaign.worldState?.pausedAdvance?.advanceEpoch \|\| null` (chair ruling R2) |
| `forecastRun.js` | `simulatePendingFuture` reads the realm's pending epoch off the pre-drain world and threads it — INHERIT, NEVER MINT |
| `campaignWorldPulseSlice.js` | the `resolveIntervalMajors` options typedef gains `epoch?: string` |

**Budgets, all measured with eslint's own `Linter` under `max-lines {skipBlankLines,
skipComments}`, none exceeded:** `campaignAdvanceSession.js` 535 → 541, **+6** (≤ +30) ·
`campaignWorldPulseDeferred.js` 700 → 701, **+1** (≤ 4) · `forecastRun.js` 78 → 79, **+1**
(≤ 8).

## §3 · ACCEPTANCE

| id | case |
|---|---|
| A1 | a paused LIT advance parks its epoch on the cursor, and a dark advance parks no such key at all |
| A2 | the cursor is the resume's source, an explicit option overrides it, and a DIFFERENT value finishes a DIFFERENT world |
| A3 | across a mid-pause flag flip the store WITHHOLDS the value, and a world that never ran lit resumes composing the LITERAL legacy string with no epoch key on its record |
| A4 | the store preview inherits the campaign's PENDING epoch, and previews the bare root when the rule is dark |
| A5 | preview and commit agree over the WHOLE projection in both flag states, with exactly two exclusions, both proven load-bearing by an empty-list control |
| A6 | a preview threaded a different epoch predicts a different future, and one with none under a lit rule is a hard error rather than a silent dark composition |
| A7 | the forecast inherits the pending epoch, mints nothing, and reaches no draw when the rule is dark |
| A8 | undo → re-advance draws a DIFFERENT world lit and the SAME world dark, with the proposal ring, the advance sequence and the snapshot-revert door untouched |

## §4 · CHECKS

```
npx vitest run tests/store/advanceEpochForkSemantics.test.js \
  tests/store/advanceFullAutoResolve.test.js \
  tests/store/advancePauseResume.test.js \
  tests/store/advancePauseSnapshotBounded.test.js \
  tests/property/advanceEpochDormancyFence.test.js \
  tests/domain/forecastRun.test.js \
  tests/joins/realmForecast.test.js \
  tests/components/simulationRulesDialog.test.jsx \
  tests/store/catchUpCampaignWorld.test.js
```

## §5 · PRICED OBLIGATIONS

| obligation | verdict |
|---|---|
| **§49/§50/§148 — the flag mint** | **NOT INCURRED.** Spent by EP-1; this is a no-flag slice. It adds a THIRD strict `=== true` read, inside a file fence 4's roster already names, so the gate-polarity census is unmoved |
| **§104.4 — edge-shared closures** | **NOT INCURRED.** None of this member's four source files is an input to any bundle closure, resolved from the committed metas |
| **§102.3 — mutation coverage** | **NOT INCURRED.** `advanceEpochForkSemantics.test.js` is outside the seven enforcer dirs and its basename matches none of the sixteen invariant tokens. Verified by RUNNING the meta-test, not by reading the law |
| **test census** | ⛔ **INCURRED, and DECLARED AS AN INTERIOR RED.** One new test file moves `files`/`titles`. The lighting census is re-recorded ONCE for the whole stage, in EP-3A's commit, because two co-live packets may not share a change path — so this member's own commit leaves that census red BY CONSTRUCTION, and EP-3A's cures it for both |
| **size baseline** | **NOT INCURRED.** No file this member touches is baselined, and none approaches its layer ceiling |
| **§85.4 — seeded-chooser registry** | **NOT INCURRED.** No seeded chooser, no pool |
| **declared shift** | **NOT INCURRED.** Every materialization is conditional on the flag-gated term; a dark world's persisted bytes are unchanged |
| **coupling registry** | **NOT INCURRED.** No new module and no new import |

## §6 · MUTANTS AND FINDINGS

- **MUTANT — DROP `advanceEpoch: epochTerm` FROM THE RESUME ARGS.** EXECUTED on the live
  store: **3 failed | 8 passed**, convicting the reload pin, the highest-risk claim and
  fence 5's store half. Restored `cmp`-exact.
- **⛔⛔ FINDING — ON THE RESUME PATH THE BELT IS LIVE AND THE BRACES ARE STALE.** §2.3b argues
  dark identity from TWO gates: the store mint, and the kernel re-reading the flag beside the
  value. MEASURED at `advanceInterval.js` (`runningCampaign = { …campaign, worldState:
  resume.preWorldState, … }`), **the resume re-derives the paused tick from the cursor's
  PRE-SNAPSHOT world, so the kernel's flag gate reads the rules FROZEN AT PAUSE TIME, not the
  campaign's live ones.** A DM who turns the rule off mid-pause therefore does not darken the
  kernel's gate at all — what closes that cell is the STORE withholding the value, which is
  exactly the gate this member adds. The volume's mechanism is inert on the one path it was
  written for, and the outcome it wants is reached by the other half.
- **⚠ CONSEQUENCE, REPORTED UNDER THE E5 STOP-AND-REPORT RULE RATHER THAN REPAIRED.** Two
  LAWFUL production states now put the kernel in "rules strictly true, no epoch threaded" —
  a rule flipped off mid-pause, and a legacy cursor written before this program. Production
  composes dark and is correct in both. **A TEST RUN THROWS**, because EP-1's
  `assertEpochPinnedInTest` cannot distinguish those from a caller that forgot. The behaviour
  is asserted here in all four cells rather than left to be discovered, and the rejection is
  used as the OBSERVABLE PROOF that the store withheld — with the still-lit cell as the
  control that proves it is not simply always thrown. **Narrowing the guard would be a kernel
  edit, which is EP-3A's path and not this member's; the disposition is the chair's.**

## §7 · WHAT THIS MEMBER DID NOT DO

- **No kernel edit.** `pulseKernel.js` is EP-3A's path in this same stage; a touch here would
  have convicted the promotion.
- **No mint anywhere but the store's existing one.** The resume, the preview and the forecast
  all inherit; `generateSeed()` is still called from exactly one site in `src`.
- **The lit arm of the cross-store byte comparison stayed OUT of
  `advanceFullAutoResolve.test.js`.** That file is TAUGHT a pinned `epoch` — an input added,
  no assertion relaxed — and its fixture declares no `simulationRules`, so the pin is inert
  there today and says so. The LIT arm lives in this member's own file, on a fixture that
  lights the rule.
