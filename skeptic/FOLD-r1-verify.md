# FOLD-r1-verify — the refuting verifier of D-FOLD-r1 (the fold, the spine §1, CN), P3 round 1

Seat V-FOLD (Opus 5.5), chair a73343ed, 2026-10-18. Inputs read: the kit README, VERIFY, RULINGS-ROUND1 (its ADDENDUM included), RESEARCH-COMMON, `cure/D-FOLD-r1.md`, `skeptic/SEAMS-r1.md`, `skeptic/HOST-r1.md`, the fold whole, the spine §1 and the CN diff. I also checked the current text of PL, MN, RN, CH and PT wherever the fold cites them. The code of record is `master-81f1cd963` (read-only). The probe is `FOLD-r1-verify-probe/`: three diffs against D-FOLD's snapshots, and `born2.mjs` with its output `born2.out.json`. No other file was written; git and the test suite were not touched.

## COUNTS

**Scope: 23 BLOCKING or MAJOR ids. Holds 18 · fails 5 · STOP 0 · new findings 2 (0 BLOCKING · 2 MAJOR).** There are 0 REFUTED rows to check.

The insertions-only proof holds: +158/+2/+1 lines, zero deletions, re-diffed. All 36 cited code symbols resolve on master.

Holds: SEAMS-r1-5, -15, -16, -17; HOST-r1-1, -2, -3, -5, -7, -8, -9, -12, -13, -14, -15, -16, -17, -18.

The five failures share one pattern. Two cures went wrong inside the fold itself (HOST-r1-4 and HOST-r1-6). The other three now contradict CH's or PT's round-1 text: either the fold's cure overreached (SEAMS-r1-1), or PT wrote a different answer after the fold had written its own (SEAMS-r1-6, SEAMS-r1-11). These are not reopened findings. Each fix is a single ruling followed by one bracket per file.

## FAILS

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| SEAMS-r1-1 (B) | CURED: custody waits on ES-2b | **FAILS** | **The fold now says something CH and the landed code both contradict.** Fold §3.3.13 ↳ says "NO engine custody of a paragon". §3.4 `envoy_held` ↳ says "no engine road holds a paragon until ES-2b", and `ransom` ↳ and OD-FC-60 ↳ say the champion is "NOT a consumer". CH as it stands keeps the landed arm. OD-CH-11 reads "a BOUND paragon on a court errand intercepted by an army rides the landed `foreignGuestHold`"; L7 and S27 say the same; CH §18's `ransom` row says "`abandon` mints `abandoned_to_captivity` (CH its first consumer)". The fold's own OD-FC-48 ↳ (2) puts bound paragons on court errands. `envoyInterceptionStage.js :: holdInterruptedEnvoy` opens a hold for any intercepted errand row and never checks who the traveller is. D-FOLD §5 flagged this as an open question but still wrote the flat sentence. **Fix:** the chair rules on the narrow arm, then the fold and CH say the same thing. |
| SEAMS-r1-6 (M) | CURED: `party_voiced` | **FAILS** | **The fold and PT put the deed and the hearing in opposite order.** Fold §1's 10-18 bracket, the §3.4 row and the spine bracket all say the kind is "produced by RN's `voiced_regard` deed", so the deed comes first. PT §13 says "RN §5.5's crossing, handed to PT by the stage (RN mints nothing for it)". PT's P31 says "default `spoken` ⇒ … minted at resolution; `withheld` ⇒ nothing minted". Under the fold's order the deed reaches hearers before the DM's week (RN §5.5), which is the skeptic's original complaint. The 10-17 bracket's line "every party kind's default 'nothing has happened to the party yet'" is also never squared with the default `spoken`. **Fix:** the crossing produces the card, and the deed is minted only on `spoken`. |
| SEAMS-r1-11 (M) | CURED: `backerRole` | **FAILS** | **One closed list now has three spellings, and the fold kept the defect the skeptic named.** Fold §3.3.12 ↳ and §5 give `court · faction · creed · polity`, with `polity` resolving to "the root's or the liege's court … by PL's `polityOf`". That is the crown-or-liege conflation the finding named: one value, two keys, and no rule for choosing between them. PT §2.1, cured after the fold, uses `BACKER_ROLES` = `town_court · town_power · liege_court · paramount_court · creed_clergy`, with the note "`polity: true` conflated the crown with a liege". RN §2.2 still keys on `polity: true`. **Fix:** one list, PT's five values, in the fold and in RN §2.2. |
| HOST-r1-4 (M) | CURED (the chair's part) + OD-FC-66 | **FAILS** | **The fold rules the deferral while saying the deferral is the owner's.** OD-FC-22 ↳ rules by delegation that on native worlds "the normalized arm runs before [H2], exactly as H7 says". That is the content of J385's deferral, yet the same row says the deferral is the owner's to accept or refuse. OD-FC-66 then claims "OD-FC-22 ↳ states what the fold does either way", but OD-FC-22 ↳ contains no refused branch. **Fix:** make the native-world arm conditional on OD-FC-66 and write both branches. |
| HOST-r1-6 (M) | CURED: the WHERE table | **FAILS** | **The table repeats the error the finding was about: it treats the anchor as the place.** The settlement row says "for a party kind the anchor settlement". So `party_hunted` is placed in `settlement` (the bounty court), and `party_ambush` appears under `road` only, while `country` reads "none heard today". PT §13 places `party_hunted` at `road(court, first hop toward the party's last-heard place)` and `party_ambush` on a road or in `country(actor's town)`. The finding's point was that an anchor is not a place. The fold also claims each owning volume carries "the same cell". **Fix:** keep WHERE separate from the anchor and take PT's cells. |

## NEW FINDINGS

| id | sev | site | claim and receipt | cure | class |
|---|---|---|---|---|---|
| FOLD-V1 | MAJOR | fold §3.4 party rows; §2's PT row; §5's PT rows; against PT §13 | **The fold's registry, which is the status of record and "one closed list", now contradicts PT's round-1 registry in five ways.** (1) `party_gate`: the fold has STANDING with course words. PT has CLIMAX with CH's `admitted · refused · admitted_under_watch · struck`, and the fold's own §3.1.25 already says `party_gate` calls `gateDefault`. (2) `party_pledge_due`: the fold has `kept · broken · void`; PT has `made_good · fell_short · came_to_nothing · struck`. (3) The backing keep-verdict: the fold ruled `honored` under SEAMS-r1-22; PT has `upheld`. (4) PT adds `struck` to every party row; the fold has none. (5) §2's PT row and §5's `PARTY_ENGAGEMENT_KINDS` still say "fourteen". | The chair rules `honored` against `upheld`. The P4 fold lane then folds PT §13 into the registry, the WHERE table and the §5 rows. | CONFIRMED (both texts quoted) |
| FOLD-V2 | MAJOR | OD-FC-62 | **The owner said yes to a shift of a different size from the one now measured.** The fold says "THE CURE IS ALREADY THE OWNER'S YES: OD-EC-5". OD-EC-5's yes (ODQ §934.90 addendum 1) priced the shift as "+7 persisted keys", and `simulationRules.js`'s header says "30 -> 37 measured at realistic_regional". Executed now (`born2.out.json`): a born campaign has 30 keys and a forced default birth has 60. Twenty-three switches turn on, among them `pactFormationEnabled`, `faithUnseatingEnabled`, `roadsEnabled` and `npcLadderEnabled`. | The visible ODQ row states the re-measured shift and asks the owner to re-confirm before OD-EC-5's car. | CONFIRMED (executed and read) |

**Minor notes, not counted:**
- The fold's own OD-FC-63 writes "RN's lenses", against its new MAP REGISTER rule.
- The fold says "nine private `prosperity01Of`". There are nine definitions, but two are exported (`navalStrength.js` and `demographicsPushPull.js`).
- §5's polity-records row still lists the struck `relief_answer`.
- H13 exports `polityHold` "per seat", but PL defines it per observer (PLAUSIBLE).

## CONFIRMED vs PLAUSIBLE

Every failure and both new findings are CONFIRMED by quoting both sides, and FOLD-V2 also by execution. One element is only PLAUSIBLE: whether the landed interception stage reaches a paragon's errand row in practice (CH marks its S27 PLAUSIBLE). That does not affect the contradiction between the two texts.
