# R3 HAND-BACK: the drawn conditional rows (VEIL-22's builder, branch `v22-r3`, base d136940c3) — NOT GREEN (stopped on the seat's word)

## The bytes
- 211 BYTE-FROZEN, proved before the first edit and after: `eface6d0…3be0b01` and rollback `ce8474ff…3d49712f`.
- 212 before `05b915ab119e2f9766a3cea47fdd9ec023fc2155f588f1b4127ea5b347118f10`, after
  `04693646033fafb56d474a92355806af2b9d870f1d4642036069865a9e61959e`. Its rollback before `1454f8f3…a2e66e`, after
  `653ae8b2c319259cf766799bdd588088caaf8eb1c38fe29f22e77118c20ab2f4` (drops `_gallery_veil_roster_choices(jsonb, jsonb)`; it
  restores 211's `_gallery_veil` verbatim as before, which never calls it).

## What was built (14 rows, `built: true`; hosts `public._gallery_veil_roster_choices` / `galleryRosterChoices.js :: applyRosterChoices`)
ONE section of 212 headed `-- R3: the roster choices` (immediately before the restated `_gallery_veil`), REVOKED from
public, anon, authenticated by name (VR27); ONE call line in `_gallery_veil` immediately before R2's step, and on the
unmarked path (`res is null`) before R2's step. The twin: a new module `src/domain/display/galleryRosterChoices.js` (its own
module, as R2's step is: `gallerySecondHomes.js` was at 784 of its layer's 800 counted lines and R3's block took it to 929,
max-lines red; the size baseline is shrink-only, so the block moved, no guard touched); the houses are read in
`gallerySecondHomes.js :: rosterHouses` (8 lines, a name lookup beside the second homes', so no new `.institutions` reader
and no ruin-walker pin move). `galleryVeil.js :: applyVeil` calls it before `withholdAlways(s)`; `projectShareVeil` on the
unmarked path. The registry host `tChoice` names the new module (the walker binds it).

| row | class | the rule (both engines) |
|---|---|---|
| power.entry | (b) | where a house is hidden whole: every criminal power (seat `category` criminal, or a thieves' name) EXCEPT the governing row (VR42: never removed) |
| power.share | (a) VR11/VR31 | wherever a power is withheld (fewer than the projection held) OR the served shares do not sum to 100 (a hidden power the projection drops off a non-DM read: measured, the 100 failed there), re-derived to 100 by largest remainder from the served `power` (D's income rule) |
| power.relation.entry, power.relation.direction | (b) | with the share rule's trigger: a relation stays only where both of its `pair` name a served power; the direction word goes with its relation |
| economy.complexity | (a) | `deriveEconomicComplexity`'s ladder over the SERVED tier, income rows (count, shares), exports, a served house named market/trading/merchant/guild, the food record; unreadable inputs: withheld |
| safety.guardEffectivenessDesc | (a) | where no served house moves goods beneath the walls, the gates tail's twin, its force noun read back |
| safety.safetyDesc | (a) | the foothold word ("found no foothold") where no served house or flag accounts for crime; the Very Safe gates line (facts-resolved twin) and the criminal-governance line a hidden house raised: withheld whole |
| safety.crimeTypes | (b) VR39, VR29 | BY ATTRIBUTION: an entry leaves where a flag that raises its type (hasSmuggling, hasThievesGuild, hasGangInfra, hasCriminalInst: safetyProfile.js / getStressFlags) is true on the record and no served house raises it (item C's recomposed flags); crisis and shown-house entries stay; an entry with no type: withheld; stays an array |
| safety.plotHooks | (b) | the safety profile's closed hook pool, each hook by its raising flag, the same test; a hook the pool does not hold: withheld |
| safety.economicDragDesc | (b) VR42 | withheld where a hidden house raised hasCriminalInst or hasMarket or carried an organised name (the black-market share and the line's wording move only with these); a criminal governing body moves none |
| history.tension.crimeWave | (b) | the crime_wave tension where the SERVED crime signal is false |
| history.event.crimeWave | (b) | a crime_wave event and its timeline copy where no served criminal house stands |
| institutions.desc | (b) | the six texts of the three declared pairs the roster-moved fact 'rival power' chooses between (not every description) |
| prose.criminal | (b) | `publicProse.blocks['defense:criminal']` |

## MEASURE FIRST (out/v21/r3/measure-observables.txt; 140 born towns a shape, through the server, groupings and the plot-hooks tab opened by hand, every hideable house hidden, Reveal off and on)
Before (new shape, 92 towns with a hideable house): non-governing criminal power served 31; Smuggling served 59 (VR39
reproduced); shares not 100 where a power was withheld 6; smuggling hook with no served smuggling flag 52; gates tail
"beneath the walls" with none served 45; drag line where a hidden house raised hasCriminalInst 66; rival-power description 13;
the criminal desk 92. After: 0 on every one, both shapes (master's: `RV9_GEN=/home/user/wt/master`, same table), but
"Magical crime" served in 2 towns, raised by a SHOWN house (the served hasCriminalInst stays true), which VR39 keeps; the
hidden-free pool of 48 has none (the counterfactual births do). No row's class was refuted; every (a) row is rebuilt from
served data alone (the born test proves equality with the engine's own ladder on the served rows).

THE POWER OBSERVABLE, the label a visitor derives (criminalStructureKeyOf over the served document), hidden towns, after:
organized 11, semi 65, diffuse 5, none 11 (control 48: 1, 7, 11, 29). ORGANIZED is now only the governing criminal row
(VR42's towns). SEMI-ORGANIZED EXCEEDS THE CONTROL, AND NOT BY A HIDDEN HOUSE: of the 65, 53 are read from SERVED houses'
names (Gambling halls and kin: not of the hideable class) and 12 from the served operations list of the same houses. The
criterion "does not exceed the control pool's distribution" is NOT MET literally; what drives the excess is shown houses,
which no R3 rule may withhold. FOR THE SEAT.

VR42, `safety.economicDragDesc` (12 governing-criminal towns, 11 with a hidden house; stored line in 10): by the counterfactual,
the line is unchanged without the hidden houses in 5 (city-insurgency-1-104, city-under_siege-1-108, city-insurgency-1-114,
town-insurgency-0-14, city-indebted-1-106); a hidden house moved it in 6 (town-infiltrated-0-12, city-politically_fractured-1-120,
metropolis-indebted-1-136, town-none-0-21, town-occupied-1-85, city-none-1-117). The rule keeps it in 14 and 106 and withholds it
in 104, 108 and 114 (hasCriminalInst flips there; the band would need the withheld crime figures): OVER-WITHHOLDING 3, named.

## Red and green (born test `tests/security/galleryRosterChoices.pglite.test.js`, + its manifest row)
RED at the base (`red.txt`, a scratch copy of d136940c3 with this test): 7 failed of 11. GREEN (`green.txt`): 11 of 11. Arms:
coverage; VR39 + VR29; VR39 control (the DM shows the houses: types as stored); power observable/VR42 + VR11 + relations;
VR31 on every read incl. unmarked and hidden-free towns (72 reads with a power withheld, all 100); the derived key
(organized only by the governing row); (a) rows; (b) rows; drag/VR42; the owner's record; the twin equal to the server at
every R3 path (the criminal desk by presence: its wording differs between engines at the base on every read, R7's class).

## Guards, gates (files in out/v21/r3/) — STOPPED ON THE SEAT'S WORD, NOT GREEN
- `guards-security.txt` (full log /tmp/gate-tail.23263.log; the six guards, signal copies, R2's born test, this born test,
  the registry walker, manifest, copy-sites walker): 173 passed, 3 failed, exit 1:
  1. `galleryRosterChoices` twin arm: a 20 s TIMEOUT under the mutex's load (no assertion failed); cured by an arm timeout
     (600 s, a deadlock guard).
  2. `galleryVeilCures` V5-4: R3'S REGRESSION, CURED IN CODE: VR31's "sum not 100" trigger added `power: 100` to a hand row
     whose powers carry no number. Now a share set is required (every served power a JSON number), both engines; 212 sha
     above is after this cure.
  3. `galleryVeilHandRows` V8-4 ("THE TOP-LEVEL POWER'S FLOOR"): 8 reds "powerStructure.factions[0] lost its name": the hand
     row hides the house "Thieves' guild (powerful)" and pins a "Thieves' Guild" POWER as served. R3's power.entry (the power
     observable, VR42) now withholds that power where a house is hidden whole, server and twin alike. A TEST PINNING THE
     BEHAVIOUR THE RULING CHANGED; NOT TOUCHED (never loosen): FOR THE SEAT (its intent, the name floor, would hold on a
     shown power that is not criminal-worded, e.g. a house "Black market" and a power "Black Market Traders").
- THE RE-RUN of these three files after cures 1 and 2: STILL RUNNING at the stop, writing
  `out/v21/r3/guards-security-rerun.txt` (exit appended to `guards-exits.txt`).
- `guards-harnesses.txt`: render-twice, inversion, allegianceVeil, criminalSwitchHandReach, publicPayloadVeilTotality:
  58 of 58, exit 0 (run before cure 2).
- `guards-twin.txt` (publicSafe*, publicProseVeil*, gallery, import, every test naming a changed module, observedShapeReaders):
  STILL RUNNING at the stop (queued on the mutex), writing `out/v21/r3/guards-twin.txt`.
- Born test after cure 2: not re-run green before the stop (green.txt is 11/11 before cure 2; the rerun above covers it).
- Registry `--check` exit 0; export regenerated (registry.json +14 rows); walker, manifest, copy-sites walker 27 of 27
  (`walker-manifest.txt`, before the module move: the security batch re-ran the walker after it, green). `typecheck:domain:strict`
  0 (1113/1113), `typecheck:ratchet` 0 (167/167), eslint 0 (`eslint.txt`).

## Acceptance
REVIEW-VEIL-7 run-all: EXIT 0, 40 PASS, 0 FAIL (`acceptance.txt`; before cure 2).

## Cost (before cure 2, which touches only a power-less record; `cost-big-town.txt`, `cost-v8245.txt`; chains r3x211 | r3base | r3after, measured while guard batches ran)
Largest born town (Langengrund, 502,604 B, sha a060ce8d…, R2's town regenerated): gallery off 354.5 | 506.0 | 530.8; gallery
DM 200.8 | 537.8 | 570.7; link 236.8 | 480.5 | 511.4 ms. Bound (R2's form): DM after 570.7 <= 2 x 354.5 = 709.0, MET; every read
served. NAMED: the link is 2.16x its own 211 (base 2.03x). v8245 medians: V8-3 row 9277 | 8887 | 9025; 50/500/500 150 | 266 |
295 (1.97x, tight; base 1.77x); 300 KB rows 491 | 523 | 599 and 1874 | 1965 | 2045.

## Residuals named (not built; not R3's rows, or for the seat)
- A served person's membership naming a withheld criminal power (`npcs[].memberships[].power`) stays: the people are R4's
  (VR9); `restampServedMemberships` untouched (R3 withholds no membership).
- The composed rows over the withheld powers (`power.desc`, `power.label` over the re-derived shares, `power.recentConflict`)
  are R5's; the label ladder now reads re-derived shares where a power left.
- A kept crime type's DESCRIPTION can still read the network a hidden house made (`debt evasion`, `Background crime`'s twin,
  `Survival crime` where a shown house keeps it: settleCrimeLinesToSignal's twins): recomposable exactly from the served
  signal; not in R3's table; FOR THE SEAT.
- The defence profile's copies of a rival-power description (second homes) are not touched.

## REDS NOT MINE
`tests/lint/observedShapeReaders.walker.test.js` (violations and register arm: the close's; its run is in the unfinished
guards-twin.txt; the new module may move its register counts). `criminalVeilSwitch.test.js`: in the same unfinished batch.
MINE: the V8-4 pin above (the ruling's), and cure 2 (fixed, rerun pending).

## CONFIRMED (executed) / PLAUSIBLE
CONFIRMED: everything above with an output file. PLAUSIBLE: that the attribution flags (item C's recomposition) answer
every house the engine's keyword table names, beyond the 280 born towns measured; that the drag line moves with nothing else.
