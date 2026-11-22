# SK / SK-5 — machine-diffed curve baselines, the tm-3 consumer (member 4 of `sk-b`)

- **Status:** LANDED
- **Landed at:** `94ef9b89`
- **Verified base:** `claude/composite-r4` at `6c2bedad2064a523b9e7f61d7e0f6e61f0571650`
  (the `sk-a` terminal)
- **Train:** `sk-b`, family **SK**, member **4** of 5.
- **Depends on:** SK-4, SK-6; **`tm-core` LANDED** — this is the member that makes `sk-b`
  depend on tm.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§143.3** · **§72.3 as amended by §110.3** ·
  §42/§43 · §3h's band firewall.
- **Compile of record:** `laneTC28-SK-PLAN.md` §4.4; TE-27 receipt §9.2.

---

## §1 ⭐ THE tm-3 SEAM, CONSUMED IN CODE RATHER THAN IN A TEST

The band set is enumerated FROM tm's closed registry — `bandFamilies()`, one family per
`epoch: 'year'` row — and never hand-listed. The production module imports it, not just the
test: wiring the seam only in the test would leave the production path free to hand-list
and the pin free to agree with itself. A registry row with no band family is a curve the
harness would silently not watch, so a missing series REDS.

⚠ Both directories are on the TELEMETRY side of the engine/telemetry wall, so the edge is
lawful — Arm B forbids `scripts/soak/**` importing ENGINE specifiers, not sibling telemetry.

## §2 ⛔ THESE ARE HARNESS-SIDE REGRESSION INSTRUMENTS, AND NOTHING ELSE

Never engine tuning bands, never `certificationManifest` entries, never anything under
`src/`. §3h's band firewall is untouched: nothing here signs, applies or adjusts a tuning
band.

## §3 ⛔⛔ BANDS FREEZE ONLY FROM THE FIRST CLEAN FULL INSTRUMENT

Clean means ZERO deterministic-class tripwires AND every behavioral-contract property
passing, at build-complete-dark, and the freeze is a recorded chair-signed act. **A rolling
soak on a mid-build tip may NEVER freeze a band**: pre-freeze rolling runs emit curves
marked PROVISIONAL. Tripwire verdicts bind; provisional curves inform; nothing freezes.
`freeze()` THROWS on every ineligible shape — a half-written capsule is worse than none,
because a later reader cannot tell it from a baseline.

⛔ **A red harness or a red ratchet makes the band capsule UNWRITABLE BY DESIGN.** Clear
the reds; never invent the figure.

## §4 ⛔ THE DECLARED-SHIFT RE-RECORD IS PROVEN THREE WAYS OR REFUSED

(1) the declared-shift table quoted in the re-record — **the table IS the declaration**;
(2) a **KEY-BY-KEY band diff proving ZERO undeclared curves moved**, with zero keys added
and zero removed — the arm that stops a bad fix hiding wide damage behind ONE declared
shift, and the one a capture's own exit 0 can never satisfy; (3) the chair's CAS. A
declared shift that did NOT move is also refused: a declaration nothing happened to is a
declaration nobody checked.

**The post-tuning re-freeze is pre-declared here** as ONE declared batch re-record, so it
is a planned act and never an improvisation.

## §5 · VALUES (§42/§43)

| value | band | home |
|---|---|---|
| band width `k` | `observed ± k·σ`, `k ∈ [2, 3]` default 2.5 | ⚠ **UNSOAKED** until the first clean instrument exists. Rationale recorded: tighter than 2σ manufactures false findings on a legitimately stochastic grid; wider than 3σ stops detecting what §143.3 exists to detect. **Chair-signed AT THE FREEZE, not at promotion**, and the capsule carries the unsoaked marker on its face. |

## §6 · SCOPE AND BOUNDARY

Nothing under `src/`. No flag. **Same-seed: NEUTRAL.**

## §7 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the band set is enumerated from tm-3's registry, one family per year-epoch row, and no run-epoch row becomes one |
| A2 | a provisional, rolling or restored receipt throws rather than freezing |
| A3 | a clean full instrument freezes, and the capsule carries the unsoaked marker |
| A4 | a red ratchet makes the capsule unwritable, by its own named cause |
| A5 | the re-record is proven three ways, and an undeclared curve movement is convicted by the key-by-key diff |

## §8 · CHECKS

```
npx vitest run tests/soak-harness/curveBandFreeze.test.js
```

## §9 · MUTANTS AND HAZARDS

- ⚠ The §151.3 experience family (`sim_narration_tempo`) is asserted present, so the band
  set provably reaches experience-facing aggregates and not only engine ones.
- ⚠ §102.3: `curveBandFreeze.test.js` matches no `NAME_PATTERN` token ⇒ no row owed.
- ⚠ Census: one new test file, four titles, one suite title.
