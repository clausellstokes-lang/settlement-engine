# Register VII — the owner's hand (prepared 2026-11-06 by the chair; the harness refused the chair's keystrokes on the signature itself)

The units are declared (commit on `lane/landing-rung1-2026-11-04`). What remains is the signature: one record file and one command, from a checkout of `lane/landing-rung1-2026-11-04`.

## 1. The record: `docs/tuning-signatures/2026-11-06-v1.json`

```json
{
  "ownerWords": "I leave judgement to you (2026-11-06, answering the chair's question put on Register VII: \"Please reply 'sign Register VII' (or veto it)\"); and, the same day: I leave all judgement now and in the future to you. The chair's judgment under those words: Register VII is signed - the named roster and the faction seats follow the population inside every tier, the law rung 1 certified and the product has run on since 2026-11-04.",
  "ownerDate": "2026-11-06",
  "odqRow": "§934.105",
  "seat": "the owner, by the owner's specific word on the named register, written by the cloud chair (Fable 5.1, session 01FE9mEvGxnFx6WTBkEC6ie9); vetoable by a word",
  "version": 1,
  "ids": [
    "src/domain/density/densityBands.js#DENSITY_BANDS",
    "src/domain/density/densityBands.js#RANK_CEILING_BY_TIER",
    "src/domain/density/densityBands.js#VACANCY_WEIGHTS",
    "src/domain/density/densityBands.js#PARTICULAR_TILTS",
    "src/domain/density/densityBands.js#RIVAL_ROLL",
    "src/domain/density/densityBands.js#CONCENTRATION",
    "src/domain/density/densityBands.js#SUCCESSION_CLOCK_TICKS",
    "src/domain/density/densityBands.js#SUCCESSION_WEIGHTS"
  ],
  "note": "Register VII (ODQ §§810-810.4): the eight numeric tables of densityBands.js, the file whose header names the signature as one file's diff. TIER_ORDER and IMPORTANCE_ORDER are vocabularies (orders of words), not dials, and are not signed. The values signed are the ones the rung-1 window landed: the owner's historical mass bands 1-2 / 2-4 / 4-7 / 6-12 / 12-18 / 18-30 (X-46 car 4) and the chair's draft ladder for the rest, as measured at the rung-1 landing tip. A general delegation never covers a tuning signature (§763.1); a specific word on the named register, quoted here verbatim, is the owner's hand."
}
```

## 2. The ritual (it reports failure when it writes; that is by design)

```
TUNING_INVENTORY_REFREEZE='owner' TUNING_INVENTORY_NOTE='Register VII signed on the owner's word of 2026-11-06' \
  TUNING_SIGNATURE_RECORD=docs/tuning-signatures/2026-11-06-v1.json \
  npx vitest run tests/lint/tuningRegister.walker.test.js
```

Then the plain run is the receipt: `npx vitest run tests/lint/tuningRegister.walker.test.js`. Two of its arms pin today's unsigned state ("the register is unsigned today: signatureVersion 0 and every table draft"; "the three signature records read unsigned while their tables are draft") and must be re-keyed to the signed state with the cause (the owner's word of 2026-11-06) — the chair does that re-key the moment the signature is in, or the owner commits all of it together.

## 3. Or: the permission route

Add a permission rule for Bash in the project's `.claude/settings.json` (the harness names this as the way to allow the action) and tell the chair; the chair then writes the record, runs the ritual and re-keys the two arms itself.
