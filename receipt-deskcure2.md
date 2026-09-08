# DESKCURE-2 — receipt

**STATUS: PARTIAL** — superseded by the COMPLETE block below. Left standing so a reader
who finds this file mid-crash knows the header was written before the work, not after it.

---

# DESKCURE-2 — receipt (COMPLETE)

Lane: DESKCURE-2 · seat Opus 5 · 2026-09-05
Dock: `$SC/laneINTEG-tree`, detached at **`361efc3c8`**, 14 cars over product `90702c3e9`.
Tree at start: porcelain 0, `node_modules` package entries symlinked (435 links, never materialised).
Tree at end: 5 modified files, nothing staged, no new untracked, no register act taken.

⚠ The brief's two named reads (`briefs/_PREAMBLE.md`, `briefs/brief-DESKCURE.md`) **do not exist** —
the `briefs/` directory is absent from the scratchpad, consistent with the recorded mid-flight
scratch deletion. Worked from the lane brief alone; flagging it because the PREAMBLE's hard rules
were never read by this lane and may contain constraints I did not honour by name.

---

## 1. THE BASELINE — taken BEFORE the first edit

```
cd $DOCK && npx vitest run tests/lint/ --reporter=verbose   →  EXIT=1
 Test Files  9 failed | 129 passed (138)
      Tests  20 failed | 2111 passed (2131)
```
Full log: `$SC/deskcure2/baseline.txt`; extracted arm set: `$SC/deskcure2/baseline-arms.txt`.
This is what licenses every "pre-existing" claim below by **set-difference**, not assertion.

Also measured before the first edit, because the any-cast cure could silently move them:

| instrument | before |
|---|---|
| `npm run typecheck:domain` | EXIT=2, 174 error lines across 37 files |
| `npm run typecheck:domain:strict` | EXIT=1 — `defenseStateProse.js +1`, `generalStateProse.js +14` |

---

## 2. THE AFTER RUN AND THE SET-DIFFERENCE

```
cd $DOCK && npx vitest run tests/lint/ --reporter=verbose   →  EXIT=1
 Test Files  6 failed | 132 passed (138)
      Tests  13 failed | 2118 passed (2131)
```

**Arms that disappeared — exactly 7, exactly my three families:**

| file | arms cured |
|---|---|
| `domainAnyCastBaseline.test.js` | 4 |
| `negativeAssertionAnchor.walker.test.js` | 1 |
| `ruinFilterRoster.walker.test.js` | 2 |

**New arms that appeared: 0.** (`comm -13` over the two sorted arm sets, count printed as `0`.)

**Still red — 13 arms across exactly the six files the brief reserved as chair register acts:**
`clampPrimitiveBaseline` 1 · `observedShapeReaders` 2 · `proseNumerics` 2 ·
`sovereigntyLightingContract` 1 · `tuningRegister` 3 · `writerReach` 4. **Untouched by this lane.**

---

## 3. THE CURES

### Family A — `domainAnyCastBaseline` (4 arms), 4 any-holes → 0

All four arms traced to the same two files. Both ceilings are monotone-down, so widening and a
`DECLARED_OVERRUN` row were both unavailable, as the brief said. Fixed the types.

- `src/domain/institutions/defenseInstitutionBuckets.js` — `Record<string, any[]>` → `Record<string, unknown[]>`
  at the `@returns` of `partitionDefenseInstitutions` and at the local `buckets` `@type`.
  `unknown` is the **accurate width, not a placeholder**: this module asks an institution exactly one
  question, `nativeSemanticName(inst)`, whose own parameter is `unknown`. `any[]` told every caller
  that any field it cared to name was present and correctly typed — which is the same class of defect
  the file's own header exists to describe.
- `src/domain/display/stateProse/defenseStateProse.js` — introduced `@typedef {{ type?: unknown }} StressEntry`
  and used it for `stressList` (`any[]` →) and `activeDefenceStress` (`any|null` →). The shape names one
  field because the desk reads one field.

Receipts:
```
npx vitest run tests/lint/domainAnyCastBaseline.test.js  →  EXIT=0   19 passed (19)
node scripts/count-domain-any.mjs   → neither file appears in the tally
```

⚠ **The `envoyPulse` trap was live here and was measured, not assumed.** That file's DECLARED_OVERRUN
row records that typing its holes `unknown` *added* strict errors in two files under both configs. So
the strict census was re-measured after the cure:

```
diff before-tsstrict.txt final-tsstrict.txt   →  no output
STRICT CENSUS: byte-identical to baseline
```
**Zero strict errors added by this lane. CONFIRMED by execution.**

### Family B — `negativeAssertionAnchor` (1 arm), 3 un-anchored negatives → 0

`tests/domain/defenseStateProseDesk.test.js`, lines 826 / 828 / 1044, frozen ceiling 0.
The file **already imported `expectAbsentWithAnchor`** — the lane knew the helper and missed three sites.

Every anchor was **measured before it was written**, by executing the producers:

- 826 / 828 (`not.toMatch(/[{}]/)` on drawn prose) → two `expectAbsentWithAnchor` calls each, one per brace.
  Anchor for the named case is `'Grand Merchant Oligarchy'`; for the unnamed case `'Thornwall'`. Both are
  **filled slots**, i.e. the mechanism under test — if the fill pipeline broke, the anchor is absent
  *before* the brace question is asked. Probe output that chose them: `$SC/deskcure2/probe-seat.mjs`.
- 1044 (`not.toContain('severity')`) → `expectAbsentWithAnchor(keys, 'severity', 'probability', type)`.
  `probability` is the anchor **because it is the argument**: the claim is "the entry carries rarity and
  no rank". Measured: all 15 `STRESS_TYPE_MAP` entries carry `probability` and `viabilityNote`, none
  carries `severity`.

**Two-sided trap cleared explicitly.** Neither `defenseStateProseDesk.test.js` nor
`generalStateProseDesk.test.js` appears in `FROZEN_UNANCHORED_NEGATIVES` (ceiling 0 for both); both now
scan at 0; **no other file's negatives were touched**, and the arm I added in family C introduces
**0** bare negatives (`git diff | grep -c` = 0).

```
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js  →  EXIT=0   9 passed (9)
```

### Family C — `ruinFilterRoster` (2 arms) — COMPLIANT, not a new exemption

One new reader: `src/domain/display/stateProse/generalStateProse.js:684`, inside `marketPoolKey`:
`const rows = Array.isArray(state?.institutions) ? state.institutions : []`.

**Both arms were cured by one edit** — routing that read through `liveInstitutions(state)`. The raw
`.institutions` spelling leaves the file, so it drops out of the discovery set exactly as
`defenseStateProse.js` did hours earlier, `readers.length` returns to the committed **92**, and the
literal was **not touched**. The alternative — exempting it and raising 92 → 93 — would have re-raised
a number the defence lane had just shrunk, to bank an exemption, which is the brief's "defect laundered
into debt".

```
npx vitest run tests/lint/ruinFilterRoster.walker.test.js  →  EXIT=0   12 passed (12)
```

---

## 4. ⚠ BEHAVIOUR SHIFT — DECLARED, NOT RIDDEN SILENTLY

Family C's cure **changes shipped prose**. `marketPoolKey` credited a town with a market from the raw
roster, so a calamity-flattened bazaar still produced `MARKET-OPEN`. Executed, at the tip, before and
after (`$SC/deskcure2/probe-market.mjs`):

| input | before | after |
|---|---|---|
| standing bazaar | `MARKET-OPEN` | `MARKET-OPEN` |
| bazaar `status: 'ruined'` | `MARKET-OPEN` | **`NO-MARKET`** |
| bazaar `_worldPulseInactive: true` | `MARKET-OPEN` | **`NO-MARKET`** |
| empty / non-array / null roster | `NO-MARKET` | `NO-MARKET` |

This is a **repair**, not new capability: it is the same defect class, with the same cure, that
`standingDefenseForces` was built for in this very train. A town whose only market is ash now reads as
having no market, which is the true reading. **Recorded as a one-time output shift for any golden that
covers a ruined-market settlement.**

**The desk suite could not see it** — 30/30 green both before and after the cure. An unpinned cure is
revertible in silence, so I added one arm to `tests/domain/generalStateProseDesk.test.js`
(*"⛔ THE MARKET READ IS RUIN-FILTERED — a burnt bazaar is not a market"*). It is written in **two
directions** — the same row reads `MARKET-OPEN` standing and `NO-MARKET` stamped — so it cannot pass on
a `marketPoolKey` broken into always answering `NO-MARKET`. Positive assertions only; no negative
matcher, so it adds nothing to the anchor walker.

```
npx vitest run tests/domain/generalStateProseDesk.test.js  →  EXIT=0   31 passed (31)   (was 30)
```

---

## 5. THE FALSIFIERS — every cure planted back, every guard proved to red

Restored by **inverse edit** each time; no `git checkout --` was used anywhere in this lane.

| plant | guard | result |
|---|---|---|
| one `any[]` restored in `defenseInstitutionBuckets.js` | `domainAnyCastBaseline` | **RED**, EXIT=1, all **4** arms |
| one anchored negative reverted to bare in `defenseStateProseDesk.test.js` | `negativeAssertionAnchor` | **RED**, EXIT=1, named the file, the line (1057) and ceiling 0 |
| `liveInstitutions(state)` reverted to the raw read | `ruinFilterRoster` **+ my new pin arm** | **RED**, EXIT=1, both |

Restoration verified after each: `grep -c '\.institutions'` on `generalStateProse.js` = **0**, and the
final `git status --porcelain` shows exactly the 5 intended files.

---

## 6. FINDINGS FOR THE CHAIR — outside my bill, not acted on

1. ⛔⛔ **`domainStrictBaseline.test.js` is green while the ratchet it is named for is RED.** The test
   asserts config *shape*, baseline *internal* consistency, and drives the script against **injected
   fixtures**; it never runs tsc over the live tree. The live instrument says:
   ```
   npm run typecheck:domain:strict  →  EXIT=1
     src/domain/display/stateProse/defenseStateProse.js: 1 strict errors (baseline 0) — +1
     src/domain/display/stateProse/generalStateProse.js: 14 strict errors (baseline 0) — +14
   ```
   **15 live strict-ratchet regressions the desk train carries that no vitest arm can see.** These are
   pre-existing (present in my before-baseline), unchanged by me, and enforced only by `npm run check` /
   CI — so they are a landing bill, not a lane bill. The `defenseStateProse` one is
   `TS7053` at line 603 (`CRIMINAL_STRUCTURE_POOL[key]`, a string index into a frozen literal) and is a
   one-line annotation away; the 14 in `generalStateProse` are unmeasured by me.
   ⚠ I deliberately did **not** cure them: a green I cannot produce with the instrument the estate
   actually runs is not mine to claim, and 14 of them are a different lane's surface.
2. ⚠ **`COMPLIANT_RE` is an import-presence test, not a use test.** My plant-back proved it: with the
   raw read restored, `generalStateProse.js` still read as **COMPLIANT**, because the `liveInstitutions`
   import specifier was still in the raw bytes. Only the **count** arm caught the regression. The
   walker's header states the asymmetry is deliberate (blanking strings would erase the import
   evidence), so this is a known trade — but it means a file can import the accessor, read the raw
   roster anyway, and satisfy the disposition arm. My new desk arm is the real pin on this cure.
3. Nit: `MONSTER_THREAT_TIERS` is an unused import at `defenseStateProse.js:80`. **Pre-existing**
   (verified byte-identical at `git show HEAD:`), a warning not an error, and no gate uses
   `--max-warnings`, so it does not block — but it is dead.
4. A pre-existing `stash@{0}` ("generation-tuning fixes", branch `analytics-intelligence-layer`) is
   present in the repo. Not mine, not touched — briefs forbid `git stash`.

---

## 7. JUDGMENT CALLS — recorded so they can be vetoed

| # | call | reasoning | reversibility |
|---|---|---|---|
| J1 | `marketPoolKey` made **COMPLIANT** rather than exempted | the read decides whether a town is described as having a market — a crediting, live-provider aggregation, which is precisely what the walker's own message routes to `liveInstitutions()`. Exempting would have re-raised 92 → 93 to bank an exemption. | one-line revert |
| J2 | Accepted the resulting **prose behaviour shift** without owner sign-off | it is a repair of the identical defect class the same train cured next door, not new capability or a tuning change; the previous output was a confident falsehood over ruined rows. Declared in §4 rather than ridden. | revert J1 |
| J3 | **Added** a test arm (`tests/domain/generalStateProseDesk.test.js`) | J2 was otherwise unpinned — the desk suite was 30/30 in both directions. Verified the test ratchet is a *failing-test* baseline, not a test-count one, so a passing arm banks nothing and reds nothing. Existing file, so no new-file census is owed. | delete the arm |
| J4 | Cured the any-holes with `unknown`, not a fabricated domain shape | measured: both sites feed values only to functions already typed `unknown`, so `unknown` is the honest width and strictly stronger than `any`. Re-measured the strict census to prove the `envoyPulse` backfire did not recur. | one-line revert |
| J5 | Did **not** cure the 15 live strict regressions | outside the bill; 14 are another lane's surface; reported in §6 instead of silently absorbed. | n/a |

---

## 8. RETROVALIDATION ROW

**What I claimed, what executed it, and what would have caught me if I were wrong.**

- **Claim: exactly my 7 arms were cured and nothing new appeared.**
  Executed by a full `tests/lint/` run at both ends (20 → 13 failures, 9 → 6 files) and a `comm`
  set-difference over the sorted arm sets, not by reading the summary line. The falsifier is the
  `comm -13` column, which printed **0**. Had I cured by luck and broken something elsewhere, that
  column would have been non-empty. **CONFIRMED.**
- **Claim: the cures are real, not the guards being satisfied.**
  Executed by planting all three cures back. Each guard went red, each named the right file, and one
  named the right line and ceiling. A cure whose falsifier was never exercised would have been a hope;
  all three were exercised. **CONFIRMED.**
- **Claim: no strict drift.** Executed by `diff` of the strict census before and after — byte-identical.
  This is the one claim I would most likely have got wrong by assertion, because the `envoyPulse`
  ledger row records that exact backfire; measuring rather than reasoning is what caught it. **CONFIRMED.**
- **Claim: the behaviour shift is what I say it is.**
  Executed by a direct probe of `marketPoolKey` across six inputs, before and after, rather than
  inferred from the suite — which was green in both directions and therefore proved nothing.
  **CONFIRMED**, and now pinned by an arm written in two directions.
- **Claim: the consumer surface is closed.** I enumerated every test touching the three changed src
  modules (`defenseStateProseDesk`, `generalStateProseDesk`, `ruinFilterRoster`, `vocabularyTotality`)
  and ran all four green, then ran the whole `tests/generators` tree — **111 files, 1017 tests, EXIT=0**
  — because `defenseGenerator.js:48` is the one consumer of `partitionDefenseInstitutions` outside the
  files I read. **CONFIRMED.**
- **Where I remain PLAUSIBLE, not CONFIRMED:** I did not execute the *entire* vitest corpus, the build,
  or `verify:dist`. Everything I could identify as reachable from my diff was executed; a consumer
  reached by a path my greps did not model is the residual risk, and it is small but not zero.
- **The finding I did not act on is the one most likely to bite the landing:** the strict ratchet
  (§6.1) is red at 15 and invisible to vitest, so a lane that trusts a green `tests/lint/` will land it
  unseen.
