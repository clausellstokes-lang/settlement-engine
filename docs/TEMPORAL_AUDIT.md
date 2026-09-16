# Temporal audit — the calendar-law sweep (Phase 5.5 W0, Lane B)

Audit date: 2026-07-12 · branch `review-fixes-2026-07-08` · scope: every
time-touching module on the simulation path, per the W0 brief (docs/briefs/
W0_FOUNDATIONS_BRIEF.md) and the calendar law (PHASE55_SPATIAL_ENGINE_DESIGN
§4i / PART II §II.5-1). Method: exhaustive source scans for `new Date` /
`Date.now` / `wallClock*` / `createdAt` / `getTime` / `performance.now` /
`setTimeout` / calendar constants across `src/`, then call-chain verification
of every hit.

## 1. The temporal architecture (what "PASS" means)

The engine's time model has three legs, all verified intact:

1. **The tick is canonical.** All sim durations are INTEGER WEEKS on the 4-4-5
   calendar. `INTERVAL_WEEKS {one_week:1, one_month:4, one_season:13,
   one_year:52}` is single-sourced in `worldState.js`; `MONTH_END_WEEKS
   [4,8,13,17,21,26,30,34,39,43,47,52]` is the only week→month table;
   `calendarFromWeeks` is the only label derivation; `advanceWorldCalendar`
   adds integer weeks with **no float accumulation** (coarse == weekly walk,
   byte-identical — pinned by `worldPulseCalendarAndHygiene.test.js`).
2. **Wall-clock enters at the boundary, once, as a pinned `now`.** The store
   layer (`campaignWorldPulseSlice`, `campaignAdvanceSession`) mints
   `new Date().toISOString()` and threads it; the kernel entries
   (`simulateCampaignWorldPulse`, `simulateCampaignWorldInterval`) enforce the
   pin structurally (`assertNowPinnedInTest` throws in test on an unpinned
   call). Inside `src/domain`, the ONLY sanctioned wall-clock reader is
   `domain/clock.js` (`wallClockNow`/`wallClockMs`).
3. **`createdAt`/`updatedAt`/`discoveredAt` are stamps derived from the pinned
   `now`** — display/audit metadata, not sim inputs (one flagged exception,
   §5).

## 2. Gate coverage — before and after this audit

| Directory | Before W0 | After W0 |
|---|---|---|
| `src/generators/**` | eslint no-arg `new Date`/`Date.now`/`Math.random` ban (determinism block) | unchanged (already covered) |
| `src/domain/**` (except `clock.js`) | eslint ban + source-regex backstop (`tests/domain/domainWallClock.test.js`) | unchanged (already covered) |
| `src/workers/**` | **NOT COVERED** (the advance worker runs kernel code — an ambient read there forks worker vs main-thread bytes) | eslint ban + regex backstop (`tests/domain/temporalGates.w0.test.js`) — verified clean, lands hard-error with zero debt |
| `src/kernel/**` (except `prng.js`) | **NOT COVERED** (rngContext/prng must stay the only sanctioned non-determinism seams) | eslint ban + regex backstop — verified clean; `prng.js` `generateSeed()` exempt by design (the documented ambient-entropy seed mint) |
| `src/store`, `src/lib`, `src/hooks`, `src/components`, `src/pdf` | not covered | **deliberately not covered** — this is the boundary where wall-clock legitimately enters (pinned-`now` mints, user-action timestamps, analytics durations, UI dwell timers). Gating it would force ceremony onto legitimate reads. |
| `src/data` | not covered | no time reads found; static data — no gate needed |

Extension shipped as: one new eslint block (`eslint.config.js`, beside the
domain determinism block) + one new regex backstop with anti-vacuity pins
(`tests/domain/temporalGates.w0.test.js`).

## 3. The audit table — every time-touching module

Verdicts: **PASS** (calendar-lawful), **PASS**\* (lawful with a documented
note), **FLAG** (lawful today, structurally worth naming), **VIOLATION** (none
found — see §4).

### 3a. Wall-clock touchpoints in `src/domain`

| Module | Time source | Verdict |
|---|---|---|
| `domain/clock.js` | `new Date()` / `Date.now()` | **PASS** — the one documented seam (eslint-exempt, regex-exempt, export shape pinned by test) |
| `worldPulse/pulseKernel.js:168` | `wallClockNow()` fallback | **PASS** — boundary default behind `assertNowPinnedInTest` (unpinned call THROWS in test) |
| `worldPulse/advanceInterval.js:249` | `wallClockNow()` fallback | **PASS** — same structural guard; one pinned `now` threads all interior ticks |
| `worldPulse/worldState.js:302` (`canonizeWorldState`) | `wallClockNow()` default param | **PASS** — canonize is a DM boundary action; tests pin `now` |
| `worldPulse/worldState.js:427` (proposal patch) | `wallClockNow()` fallback for `updatedAt` | **PASS** — DM proposal decision (boundary action), display stamp only |
| `worldPulse/applyWorldPulse.js:1024` (`applyWorldPulseProposal`) | `wallClockNow()` default param | **PASS** — DM boundary action |
| `region/graph.js:84` (`nowIso`) | `wallClockNow()` fallback | **PASS** — every sim caller threads `{now}`; fallback serves DM-direct graph edits |
| `region/wizardNews.js:169` (`nowIso`) | `wallClockNow()` fallback | **PASS** — same pattern; sim path threads `options.now`/`createdAt` |
| `region/propagation.js:292,451` | `wallClockNow()` pre-stamp on minted impacts | **PASS**\* — the pre-stamp is OVERWRITTEN by the deterministic re-stamp at `deriveRegionalImpacts` exit (`if (now) … item.createdAt = now`, :689). The kernel path threads pinned `now` end-to-end (verified: `applyWorldPulse.js:803 → propagateRegionalEvent{now} → deriveRegionalImpacts{now}`). The pre-stamp is live only for now-less boundary callers. NOTE: dead work on the pinned path; removing it would change now-less-caller bytes, so left as-is (out of byte-neutral fence). |
| `region/discoverDependencyCandidates.js:212` | `wallClockNow()` for `discoveredAt` | **PASS** — SUGGESTED-only DM-confirm heuristics, zero sim-path callers (exported via region/index only); `discoveredAt` is display provenance |
| `events/drainQueuedEvents.js:52` | `wallClockNow()` default param | **PASS** — boundary default; the pulse path threads `now` |
| `trace.js:239` | `wallClockMs()` fallback for trace `ts` | **PASS**\* — generation threads the deterministic `_traceClock` (monotonic counter, 85bb8c51); the wall fallback serves ad-hoc callers outside the seeded pipeline. Trace `ts` is diagnostic, never a sim input. |
| `userEdits.js:171` | `wallClockNow()` for `editedAt` | **PASS** — a user edit IS a wall-clock event (boundary metadata) |
| `dossier/chronicleFeed.js:37` | `new Date(at).getTime()` (parsing) | **PASS** — deterministic-given-input parse, display sort only |
| `worldPulse/advanceInterval.js:49` | `setTimeout(resolve, 0)` | **PASS** — scheduling yield BETWEEN ticks (paint responsiveness); affects WHEN ticks run, never WHAT they compute (pinned by `advanceIntervalProgressYield` + equivalence tests) |

### 3b. Calendar-constant consumers (the 4-4-5 grid)

| Module | Usage | Verdict |
|---|---|---|
| `worldPulse/worldState.js` | `INTERVAL_WEEKS` + `MONTH_END_WEEKS` + `calendarFromWeeks`/`advanceWorldCalendar` | **PASS** — the single source; integer weeks canonical; `elapsedMonths` retained as DERIVED legacy display field (weeks × 3/13), never read back for advancement |
| `worldPulse/advanceInterval.js` | `weeksPerInterval = INTERVAL_WEEKS` (same object re-export) | **PASS** — one object, cannot drift |
| `worldPulse/foodStockpile.js` | LOCAL mirror of `INTERVAL_WEEKS` + `monthsForInterval` (weeks × 3/13) | **PASS**\* — documented leaf-copy; exact 4-4-5 ratio; **drift guard ADDED this audit** (`temporalGates.w0.test.js` pins the literal against the canonical table) |
| `worldPulse/populationDynamics.js` | LOCAL mirror of `INTERVAL_WEEKS` + `monthsForInterval` | **PASS**\* — same pattern, same new drift guard |
| `ageBands.js` | literal week boundaries (4/13/52) | **PASS** — pre-existing test pins them against the imported table (per module note) |
| `hooks/useAdvance…` (`ADVANCE_TICKS`) | UI mirror | **PASS** — pre-existing mirror guard (`tests/hooks/advanceTicksDrift.test.js`) |

Fractional-tick scan: **zero** fractional tick arithmetic anywhere in
`src/domain/worldPulse` (no `tick * 0.x`, no `tick /` divisions into state).
All cooldowns/windows (`FLIP_COOLDOWN_TICKS`, `RECENCY_TICKS`, memory keys,
ratchet stamps) are integer tick arithmetic.

### 3c. `createdAt` on the sim path (the display-only law)

Sweep: every `createdAt` in `src/domain` is a WRITE of the pinned `now` (news
entries, stressor stamps, realm events, cause records, faction-capture
records) except:

| Site | Read | Verdict |
|---|---|---|
| `worldPulse/applyWorldPulse.js:436` (`mergeStressorUpsert`) | `prior.createdAt !== now` — same-tick collision detector deciding wholesale-take vs commutative field-merge | **FLAG** (deterministic, but a semantic sim read) — `createdAt` is used as a TICK-IDENTITY proxy. Both sides derive from the one pinned `now`, so replay is byte-identical; the lawful key would be the tick number (a `bornTick` stamp). Renaming/re-keying changes persisted stressor bytes ⇒ out of this wave's byte-neutral fence. **Reported for the SEASONS-A/KEYSTONE window** (any wave already touching stressor shapes). |
| `worldPulse/stressors.js:404` | `updatedAt: stressor.updatedAt \|\| stressor.createdAt` | **PASS** — projection fallback for display (dossier stressor view) |
| `region/wizardNews.js:476` | sort key (`compareCodepoint(b.createdAt, a.createdAt)`) | **PASS**\* — ordering of news entries; createdAt derives from pinned `now`, and same-stamp ties fall through to id codepoint — deterministic |
| `region/graph.js:190-191` | preserve-on-merge (`impact.createdAt \|\| now`) | **PASS** — write-path stamp preservation |
| `events/mutate.js:142`, `events/applyEvent.js:35`, `events/mutateEntities.js:645,734` | `event.timestamp \|\| event.createdAt \|\| now` → `appliedAt` stamps | **PASS** — deterministic-given-event; display provenance on entities |
| `dossier/chronicleFeed.js:63` | display feed ordering | **PASS** — display only |

### 3d. Off-domain sim-path dirs

| Module | Time source | Verdict |
|---|---|---|
| `workers/advanceInterval.worker.js` | none — threads the caller's pinned `now` through structured clone | **PASS** (now gate-covered) |
| `kernel/prng.js:79` (`generateSeed`) | `Date.now()` + `Math.random()` | **PASS** — the documented sole seed-minting entry (ambient entropy BY DESIGN; everything downstream is pure in the seed). Exempted from the new gate. |
| `kernel/rngContext.js` | none | **PASS** (now gate-covered — must stay clean) |
| `store/campaignWorldPulseSlice.js` (6 sites), `store/campaignAdvanceSession.js:125,359` | `new Date().toISOString()` | **PASS** — THE boundary mints of the pinned `now` (leg 2 of the architecture). Outside gate scope by design. |
| `store/*` (aiSlice, mapSlice, settlementSlice, creditsSlice, accountImportSlice) | `Date.now()` / ISO stamps | **PASS** — user-action/analytics/UI metadata, not sim inputs |

## 4. Violations found / fixed / reported

- **Hard calendar-law violations (wall-clock in a sim computation, fractional
  weeks, float calendar accumulation, RNG-visible time): ZERO found.** The
  tick-49 class is structurally closed by the pin-`now` guards + the (now
  extended) gates.
- **Fixed in-fence (byte-neutral):**
  1. Gate extension to `src/workers` + `src/kernel` (eslint block + regex
     backstop) — both dirs verified clean first, so zero behavior/bytes moved.
  2. Drift guards for the two unguarded `INTERVAL_WEEKS` mirrors
     (`foodStockpile.js`, `populationDynamics.js`) — test-only.
- **Reported (structural, NOT fixed — byte-neutral fence):**
  1. `mergeStressorUpsert`'s `createdAt`-as-tick-identity read (§3c) — replace
     with a `bornTick` integer stamp when a wave next touches stressor shapes.
  2. `region/propagation.js` dead `wallClockNow()` pre-stamps (§3a) — collapse
     into the exit re-stamp when region propagation is next open; removing them
     today would change now-less boundary-caller output.

## 5. Standing law for future waves (what the gates now enforce)

- New sim code in `src/domain`, `src/generators`, `src/workers`, `src/kernel`
  cannot read ambient wall-clock (eslint hard error + regex backstops).
- Durations are integer weeks; convert to months ONLY via the exact 4-4-5
  ratio (×3/13); never accumulate floats across ticks.
- `createdAt`-family stamps derive from the pinned `now` and are display/audit
  metadata. Do not branch sim behavior on them — key on the tick.
- The keystone (frozen spatial digest) denominates every route/travel duration
  in these same integer weeks; this audit is its entry evidence.
