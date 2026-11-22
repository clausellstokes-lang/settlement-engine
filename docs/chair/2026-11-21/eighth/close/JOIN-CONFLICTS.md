# THE TRIAL JOIN'S CONFLICTS (CLOSE-1 unit 1; written 2026-11-22 08:06 UTC, read from `date -u`)

What it is: `lane/close-1-join-scratch-2026-11-22`, cut from 840020b9b (point 97: who rules,
`lane/seat-10-2026-11-21` at 46339e5c7, merged onto the stack of points 94 to 96 at cc2f43aee), and
then `lane/fortune-6-2026-11-21` at f13f31820 merged as a TRIAL: merge 4bba8781d. A scratch ref is
merged into no lane. These are the conflicts the real landing of fortune (point 98) will hit.

| file | class (BRIEF-LANDING-STACK) | resolution on the scratch |
|---|---|---|
| docs/content/wiring-census.json | REGISTER | the line's side, then its door |
| scripts/.observed-shape-readers-baseline.json | REGISTER | the line's side, then its door |
| scripts/.writer-reach-baseline.json | REGISTER | the line's side, then its door |
| tests/lint/.lighting-census-baseline.json | REGISTER | the line's side, then its door |
| tests/lint/.tuning-inventory.json | REGISTER | the line's side, then its door |
| tests/lint/samenessHideable.walker.test.js :: HAND_CEILING | THE SAMENESS DOOR'S OWN FILES | 74 (the stack's: 73 + PAGE-12's TROUBLE_HOOKS) + 1 (FORTUNE_MERIT_LINES) = 75, both comments, the line's first; handPools.json auto-merged, 75 rows |
| tests/lint/.tuning-register.json :: tables | REGISTER by the brief's list; IN PRACTICE NO DOOR WRITES ITS ROWS | the union of the two new DRAFT rows (SEAT_CIRCUMSTANCE_TUNING, then FORTUNE_LAW_TUNING); no other row differs (checked three ways). The line's side would DROP fortune's row. THE CHAIR'S TO CLASS |
| src/domain/density/densityCreateBoundary.js | ANY OTHER | the union, seat first: the import, the clamp's doc paragraph, birthConfig's clamp and its mint, the GENERATION_LAWS row (`seat` then `fortune`) |
| tests/lint/densityCreateBoundary.walker.test.js :: MINT_SYMBOLS, MINT_HOMES | ANY OTHER | the union, seat first |

Auto-merged clean: `vite.config.js`, `scripts/mutation-coverage-manifest.json`, `tests/lint/samenessHideable.handPools.json`.

Checked on the merged tree (CONFIRMED, by node): `Object.keys(GENERATION_LAWS)` is density, livingContent,
seat, fortune; `birthConfig({_seatLawVersion:2,_fortuneLawVersion:2,a:1})` gives
`{"a":1,"_densityLawVersion":2,"_livingContentLawVersion":2}` (both incoming markers clamped; both dials dark).

## BOTH SIDES OF THE "ANY OTHER" CONFLICTS (at most 12 lines a side)

```
--- hunk 1: OURS (point 97, who rules), 7 lines
// ⭐ THE THIRD GENERATION LAW, THE SEAT LAW (CS10, SEAT-1 train 1 unit U1), WIRED HERE AND
// NOWHERE ELSE, AND DARK. Its module is a dependency-free leaf that declares the key, the dial,
// the reader and the mint in one file, so this one edge brings all four and nothing behind them;
// it lands on whichever side of first paint this module does (the lazy side, per the
// living-content row below). Its dial sits at the default, so the mint is `{}` and a birth's
// config is byte-identical; lighting it is the owner's word (U8).
import { SEAT_LAW_CONFIG_KEY, newSettlementSeatLaw } from '../seat/seatLaw.js';
--- hunk 1: THEIRS (fortune f13f31820), 6 lines
// ⭐ THE FOURTH GENERATION LAW, THE FORTUNE LAW (FS5, FORTUNE-1 unit U1), WIRED HERE AND
// NOWHERE ELSE, AND DARK. Its module is a dependency-free leaf that declares the key, the dial,
// the reader and the mint in one file, so this one edge brings all four and nothing behind them.
// Its dial sits at the default, so the mint is `{}` and a birth's config is byte-identical;
// lighting it is the owner's word, never before the seat's law.
import { FORTUNE_LAW_CONFIG_KEY, newSettlementFortuneLaw } from '../fortune/fortuneLaw.js';
--- hunk 2: OURS (point 97, who rules), 4 lines
 * ⛔ THE SEAT LAW'S MARKER IS CLAMPED THE SAME WAY, FOR THE SAME REASON (CS10, U1). Its dial
 * sits at the dormant default, so its mint is `{}` and deletes nothing: without its own
 * destructure, an imported seat-law world's configuration loaded through the Library and
 * regenerated would birth a NEW world under the seat law on a build whose dial is dark.
--- hunk 2: THEIRS (fortune f13f31820), 4 lines
 * ⛔ THE FORTUNE LAW'S MARKER IS CLAMPED THE SAME WAY, FOR THE SAME REASON (FS5, FORTUNE-1 U1).
 * Its dial sits at the dormant default, so its mint is `{}` and deletes nothing: without its own
 * destructure, an imported fortune-law world's configuration loaded through the Library and
 * regenerated would birth a NEW world under the fortune law on a build whose dial is dark.
--- hunk 3: OURS (point 97, who rules), 1 lines
    [SEAT_LAW_CONFIG_KEY]: _incomingSeatLaw,
--- hunk 3: THEIRS (fortune f13f31820), 1 lines
    [FORTUNE_LAW_CONFIG_KEY]: _incomingFortuneLaw,
--- hunk 4: OURS (point 97, who rules), 1 lines
    ...newSettlementSeatLaw(),
--- hunk 4: THEIRS (fortune f13f31820), 1 lines
    ...newSettlementFortuneLaw(),
--- hunk 5: OURS (point 97, who rules), 14 lines
  seat: Object.freeze({
    mint: 'newSettlementSeatLaw',
    module: 'src/domain/seat/seatLaw.js',
    dial: 'NEW_SETTLEMENT_SEAT_LAW_VERSION',
    configKey: '_seatLawVersion',
    wiring: 'WIRED',
    why: 'the seat law (CS10: the form of government, the holder of the seat and the person in '
      + 'it read apart), spread by birthConfig beside the other two, with its incoming marker '
      + 'clamped off, so every classified BIRTH mints it and no PREVIEW or re-derivation can. THE '
      + 'DIAL IS DARK, and that is the chair\'s ruling (a) of 2026-11-20, not an omission: the mint '
      + 'writes not one config byte, so no born world, golden or born fixture moves while every '
      + 'unit of the train proves itself on its own explicit _seatLawVersion: 2 arm; lighting it '
--- hunk 5: THEIRS (fortune f13f31820), 14 lines
  fortune: Object.freeze({
    mint: 'newSettlementFortuneLaw',
    module: 'src/domain/fortune/fortuneLaw.js',
    dial: 'NEW_SETTLEMENT_FORTUNE_LAW_VERSION',
    configKey: '_fortuneLawVersion',
    wiring: 'WIRED',
    why: 'the fortune law (FS5: a place\'s fortune and its public standing read against its own '
      + 'size), spread by birthConfig beside the others, with its incoming marker clamped off, so '
      + 'every classified BIRTH mints it and no PREVIEW or re-derivation can. THE DIAL IS DARK, and '
      + 'that is the chair\'s ruling of 2026-11-20 10:33 UTC, not an omission: the mint writes not '
      + 'one config byte, so no born world, golden or born fixture moves while every unit of the '
      + 'build proves itself on its own explicit _fortuneLawVersion: 2 arm; lighting it is the '
--- hunk 1: OURS (point 97, who rules), 4 lines
  // ⭐ The seat law's mint (CS10, SEAT-1 U1), added in the act that wired it, for the reason
  // above: its row lands WIRED, so the starred register arm does not watch it and these three
  // per-caller arms are what hold where it may be named.
  'newSettlementSeatLaw',
--- hunk 1: THEIRS (fortune f13f31820), 4 lines
  // ⭐ The fortune law's mint (FS5, FORTUNE-1 U1), added in the act that wired it, for the reason
  // above: its row lands WIRED, so the starred register arm does not watch it and these three
  // per-caller arms are what hold where it may be named.
  'newSettlementFortuneLaw',
--- hunk 2: OURS (point 97, who rules), 3 lines
  // The seat law's own module (CS10, SEAT-1 U1), added with its mint symbol above: it DECLARES
  // the mint, the one legitimate way to name it outside the boundary and its BIRTH callers.
  'src/domain/seat/seatLaw.js',
--- hunk 2: THEIRS (fortune f13f31820), 3 lines
  // The fortune law's own module (FS5, FORTUNE-1 U1), added with its mint symbol above: it
  // DECLARES the mint, the one legitimate way to name it outside the boundary and its BIRTH callers.
  'src/domain/fortune/fortuneLaw.js',
```
