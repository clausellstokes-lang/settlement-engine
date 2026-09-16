# W-F5 STAGE 1 — AXIS RETIREMENT — EVIDENCE

Status: **STAGE 1 EVIDENCE READY.** No fixture regeneration, no commits. Awaiting
architect confirmation before STAGE 2.

Reproduce: `node docs/evidence/phase4-wf5-oracle/derivation-evidence.mjs`
(machine output pinned in `derivation-matrix.json`).

## 1. The change (structural)

`src/domain/worldPulse/deityAxes.js` — dropped `deityTemper`'s stored-value
short-circuit. Temper is now DERIVED from the two alignment axes for **every** deity;
the stored `temperamentAxis` field is inert to every engine temper read.

```
- if (deity.temperamentAxis != null) return deity.temperamentAxis;   // retired
  return deriveTemper(evil01(deity), chaos01(deity));                 // now always
```

The three named paths + disposition already routed through the `deityTemper` shim, so
dropping the short-circuit re-keys them all onto the derivation with no further plumbing:

| Path | Site | Reads |
|---|---|---|
| Niche key | `cultImpositionApply.nicheOf` :36 | `deityTemper(d)` |
| Warbound conversion | `religiousContest.occupationFaithPull` :210; `incumbentCounterForce` :225 | `deityTemper(...)` |
| Mandate-fit | `religionState.mandateAlignmentFit` :520 | `deityTemper(deity)` |
| (Aggression drive) | `disposition.deityTemperDrive` :177 | `deityTemper(...)` — also a shim consumer, shifts with it |

Docstrings in `deityAxes.js` updated to state the retirement; the direct short-circuit
pin in `tests/domain/deityStance.test.js` (was: "SHIM returns stored temper VERBATIM…
NEVER the derived value") is re-pinned to the derivation. Those are the only two
source/test files touched.

## 2. The derivation is `temper = f(alignment)`, law-independent

Under `TEMPER_DERIVATION` (W_EVIL 0.7, W_CHAOS 0.3, THRESHOLD 0.15), chaos alone reaches
exactly `0.3·0.5 = 0.15`, which does not exceed the threshold — so the law axis never
tips temper on its own. The 3×3 matrix collapses to alignment:

| alignment | lawful | neutral | chaotic |
|---|---|---|---|
| good | peacelike | peacelike | peacelike |
| neutral | neutral | neutral | neutral |
| evil | warlike | warlike | warlike |

`lawIndependent: true` (all three law values yield one temper per alignment).

## 3. Per-fixture BEFORE → AFTER (the exactly-the-derivation class)

Every deity-holding shift in the whole repo (`612 files / 7094 tests`) reduces to **four**
inline fixture deities, and **every** shift is a *neutral-alignment deity carrying a
decoupled stored temper* — precisely the coupling axis retirement removes. `Storm` is the
control (stored == derived ⇒ no shift).

| Fixture deity (align · law · stored temper) | temper before → after | niche before → after | drive sign before → after | shifted |
|---|---|---|---|---|
| Kaor — neutral · absent · **warlike** (`religionCorruption.test.js:27`) | warlike → **neutral** | warlike:neutral → **neutral:neutral** | +1 → **0** | yes |
| Serel — neutral · absent · **peacelike** (`religionCorruption.test.js:28`) | peacelike → **neutral** | peacelike:neutral → **neutral:neutral** | −1 → **0** | yes |
| Faded — neutral · neutral · **peacelike** (`crisisConversion.test.js:63`) | peacelike → **neutral** | peacelike:neutral → **neutral:neutral** | −1 → **0** | yes |
| Storm — neutral · chaotic · neutral (`crisisConversion.test.js:62`, control) | neutral → neutral | neutral:neutral → neutral:neutral | 0 → 0 | no |

`allShiftsAreDerivation: true` (every AFTER value equals `deriveTemper(evil01, chaos01)`).
`everyShiftIsNeutralAlignmentDecoupled: true`.

### Downstream propagation (what the 6 failing assertions read)

- **OQ22 (`religionCorruption.test.js` — 4 assertions).** Kaor/Serel decouple a warlike/
  peacelike temper from a **neutral** alignment. Retirement makes both derive `neutral`,
  so `disposition.deityTemperDrive` contributes `0` (was +0.35 / −0.35 via `W_DEITY·sign`).
  `computeAggressiveness(warlike) == computeAggressiveness(none) == computeAggressiveness(peacelike)`
  ⇒ the "warlike > none > peacelike" monotonicity assertions fail. This is the axis
  retirement's *defining* consequence: temperament is no longer an independent authorable
  lever on a neutral-alignment deity.
- **Crisis conversion (`crisisConversion.test.js` — 2 assertions).** The incumbent `Faded`
  was authored `peacelike` on a **neutral** alignment specifically so its niche
  (`peacelike:neutral`) differed from the neutral source `Storm` (`neutral:neutral`), letting
  them coexist while the crisis-receptivity lift was isolated. Retirement collapses Faded to
  `neutral:neutral` — the **same** niche as the source — so they enter same-niche competition
  and the coexistence the test depended on is gone. Only the two comparative assertions
  break; STABLE-PEACE BYTE-IDENTITY still passes (disorder 0 ⇒ no lift either way).

## 4. Deity-free rows identical (the dormancy anchor — VERBATIM ABSOLUTE)

- `deityTemper(null) === undefined`, `deityTemper(undefined) === undefined` ⇒ an absent
  deity contributes drive sign `0` — the byte-identity anchor is untouched.
- `tests/domain/religionDormancy.byteIdentity.test.js` — **green**.
- `tests/fixtures/worldpulse-golden-master.json` (deity-free pulse hashes) and
  `tests/fixtures/generator-golden-master.json` — **unchanged** (`git status` clean).
- Full suite: the only 6 failures are the deity-holding fixtures above; every deity-free /
  law-neutral / consistent-temper fixture is byte-identical.

## 5. Migrations — no migration 128 required

Migrations 049 (`custom_content_deity_axes_check`) and 056 (lawAxis) pin, for deity rows,
`temperamentAxis IS NOT NULL AND IN ('warlike','peacelike','neutral')`. STAGE 1 does **not**
remove or rewrite the stored field — it only makes the engine ignore it for temper. Existing
and newly-authored deity rows still carry a valid `temperamentAxis` (`customContentSchema.
validateDeity` still requires it), so the CHECK is still satisfied and non-breaking. Repo
migration head is **127, contiguous** — no 128 exists and none is needed for STAGE 1.

Note (handoff, not STAGE 1): the stored `temperamentAxis` is now cosmetic/inert to the
engine while the schema + authoring surface still require it. Fully sunsetting the authored
field (schema/CHECK/UI) is a STAGE 2 / W-F6 decision, out of scope here.

## 6. Gate state at the STAGE 1 stop

| Gate | Result |
|---|---|
| Named must-be-green: **stance** (`deityStance`, `deityStanceLane`), **reciprocal-loop** (`reciprocalPatronLoop`), **piety** (`piety*`) | **green** (9 files / 90 tests) |
| Deity-free dormancy byte-identity | **green (verbatim)** |
| `typecheck` (tsc full) | **0 errors** |
| `typecheck:domain:strict` | **0 errors, ceiling 0** |
| `lint` | **0 errors** (15 pre-existing warnings, unrelated) |
| `validate:data / migration-head / edge / map` | **pass** (migration head 127 contiguous) |
| `build` | **exit 0** |
| Full `vitest run` | **6 oracle-pending failures** (below), 7088 pass |

**Oracle-pending (documented, NOT regenerated — architect reviews before UPDATE):**
`tests/domain/religionCorruption.test.js` OQ22 ×4 (incl. R3 live-pulse) and
`tests/domain/crisisConversion.test.js` ASYMMETRY + CRACKS ×2. Suggested re-fixture for
the architect: re-author these decoupled deities onto alignments whose derived temper
matches intent (evil ⇒ warlike, good ⇒ peacelike) if the assertions are to be preserved
under the retired model.

## 7. Out-of-scope direct readers (handoff — NOT re-plumbed in STAGE 1)

These still read the stored `temperamentAxis` directly (never routed through `deityTemper`),
so they can now disagree with the derived niche/warbound/mandate temper. Left as-is per the
STAGE 1 scope (niche + warbound + mandate-fit only); flag for the architect / W-F6:

- `magicProfile.js` :164, :259, :460 (`deityIsRegulatory`, reason strings)
- `relationshipRulesAdversarial.js` :544 (`deityTemperSign`)
- `religionLegitimacy.js` :224 (`deityRulerFit` — §3.3 says explicitly unchanged in Phase 4)
- `display/deityEffects.js` :148 (`DEITY_TEMPER_SIGN` display sign)

Pre-existing quirk noted (unchanged by this wave): `religiousContest.TEMPER_POS` and
`religionState.mandateAlignmentFit` compare against the string `'peaceful'`, but temper is
`'peacelike'` — those specific branches were already dead before and remain dead after.
