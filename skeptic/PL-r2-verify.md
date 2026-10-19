# PL-r2-verify — the refuting verifier for THE POLITY, P3 rounds 2 and 2b (V-PL-r2, Opus 5.5, chair a73343ed, 2026-10-18 12:36 EDT by `date`)

**COUNTS: 12 holds · 1 fail · 0 stop · 2 new (0 BLOCKING · 2 MAJOR).**

I judged 13 rows. These are every BLOCKING or MAJOR id the two disposition files cured:
- `cure/D-PL-r2.md`: PL-r1-4, -6, -11, -15, PL-V1, -V2, -V3, plus the substantive ruling cures A.14·C.Q3 and C.Q4.
- `cure/D-PL-r2b.md`: SEAMS-r2-10, HOST-r2-4, and two RULINGS-ROUND2b corrections, HOST-r2-5 (a MAJOR in HOST-r2) and PS-r2-3/4 (a BLOCKING in PS-r2).

Neither file REFUTED anything, and neither raised a STOP. I also spot-checked the minor and noted rows (SEAMS-r2-17, D-CH-r2 §5.1, PS-r2-25, the two verifier minors, E, and the NOTED rest of RULINGS-ROUND2b, including its 10:0x ADDENDUM). All of them hold, and they are not counted.

The code of record is master `81f1cd963`, read-only. Two probes were executed, both under `PL-r2-verify-probe/`:
- `walk.rerun.mjs` → `walk.rerun.out`. This is D-PL-r2's walk probe run again over the real `foreignSeatOf`. Its output is byte-IDENTICAL to `cure/D-PL-r2-probe/walk.out`.
- `regex.mjs` → `regex.out`. It runs the landed `ESCALATION_HINT` and `WOUND_TYPE_RE` over PL's incident words. `riders_quartered` matches neither. `appointment_imposed` matches the wound set, as §15.9 states.

I edited no other file. Git and the test suite were not touched.

## The 12 rows that hold
- **PL-r1-4.** Every window now cites a real key. `intervalWeeks.js :: INTERVAL_WEEKS` is `{ one_week, one_month, one_season, one_year }`, and no `.season` or `.year` is left (§3.5, §5.5, P33, OD-PL-40).
- **PL-r1-6.** The probe was re-executed with identical output (W1/W1b give root H in chains; W2/W3 give `polity_circle`; W4 gives the lord in chains). PL1's member bases, PL2's cut through an unbacked rung, PL12 and P2b/P33 agree with one another.
- **PL-r1-11.** MN §3.4 (l.202) and §4.7 (l.287–289, 398) now call `relief_answer` an input line, never a kind. The fold's §5 ↳ row (l.668) amends PL's kinds list. The round-1 contradiction is gone.
- **PL-V1.** The channel has its own §8 row. `pulseKernel.js` has `const coupOutcomes = simulationRules.stressorsEnabled ? coupVerdictOutcomes({`, and `coup.js :: coupVerdictOutcomes` exists. Each verdict is minted only under its owner's flag, which P41 pins.
- **PL-V2.** `decisionTier.js :: deriveDecisionTier` classifies by `candidateType` alone, so a sealed `polity_verdict` is minor and `polity_verdict_default` in `CAMPAIGN_ALTERING_CANDIDATE_TYPES` is major. The contract test (`changeAuthorityPolicy.contract.test.js`) pins the marked set and reads each mint from `src/domain/worldPulse/<module>`. The stage's host receives `graph: applied.regionalGraph`, so the no-ghost rule is buildable. The weekly re-ask under the pause is stated, and it is PLAUSIBLE end to end.
- **PL-V3.** `authorityTransferEpochFor` is exported, and every transfer appends `'ascendant'` (`rulingPower.js` l.556), so the key moves even when the 6-row tail repeats. The tick-less DM row is real: `mutateWorld.js :: changeRulingPower` passes `{ cause }` alone, and the transfer then stamps `tick: null`. The ladder's organic rows sit behind `warRulingsLit`.
- **A.14 · C.Q3.** The request door and the "never a break" rule agree with CH l.533/799, PS l.343 and ST l.353. The detector reads only treaties and coalition joins.
- **C.Q4.** The aggregation the ruling asks for is executed: one answer per liege per unit, rows on each crossed edge, and P42. The answer's effect is the new finding PL-V5.
- **SEAMS-r2-10.** PR l.406/760 withdrew `patrol_order` and uses PL's words for the riders' line. The fold l.466 registers that line and no `patrol_order`. PS l.343 no longer names the internal append as a door. WC §1.9.1's `CALL_IN_REQUEST` has no id field, so the episode `warAnchorKey · askedTick` is right.
- **HOST-r2-4.** PL carries no supersession anywhere (grep). The fold's §3.1.26 ↳ r2b and its INBOX (a) ↳ now say "an ask".
- **HOST-r2-5.** H16 is gone from PL's patrol line, as the ruling words it. See the minor note on H9.
- **PS-r2-3/4.** PS §2.1 l.129: `unitKey = 'army:' + armyId + ':' + deployment.sinceTick`, which is stable across holds. P42 holds. The prefixes are the subject of PL-V4.

## FAILS
| Id | Disposition | Verdict | Why / receipt |
|---|---|---|---|
| PL-r1-15 (M) | CURED (PL's half) | **FAILS**: a second flag pair breaks the claim | §8 pins (l.358) say the round-1 claim "was false for one pair" and is now cured. **A second pair is false.** §8 gates "the fealty record's writes (incl. the menace arm's relief and protection rows)" under `polityObligationsEnabled` (l.351). §10 shape 3's dark-after-lit reads "kept, unread" (l.422), and CH ties the harbouring row to `polityObligationsEnabled` (CH l.539, 692, 799). **Three other flags write or need those rows**, and none of their host columns names obligations: `politySuccessionEnabled` (l.352; §5.6: "EVERY answer leaves its keyed row", the `fealty_sworn` baseline, and "an edge with no such row … is not asked"); the channel's dark-hearings carrier (§5.5 source (2): "a fealty row whose answer re-points"); and `polityBreakEnabled`'s price (l.350, P5). **What follows with succession lit and obligations dark** (a legal combination under OD-PL-14): either PL-8 writes another flag's output, or it writes no row. With no row there is no baseline, the question is never asked, and a `free` decided with hearings dark has no carrier, which breaks P38 and P41. P41 itself asserts a `fealty_withheld` row with no obligations flag. | §8 assigns each row family to its owner: relief, protection and service rows to obligations; `fealty_sworn`, `fealty_renewed` and `fealty_withheld` to succession; PL7's `fealty_defied` to break; requested rows to the requester's flag plus `polityEnabled`. §10 shape 3's dark-after-lit is then stated per family. Alternatively, add obligations to succession's and break's host flags. CH's tier line follows. |

## NEW FINDINGS (introduced by the round's cures)
| Id | Sev | Site | Claim / receipt | Cure |
|---|---|---|---|---|
| PL-V4 | MAJOR | §4.6 r2 and r2b brackets (l.241); PL7 (l.88); OD-PL-46; P40 | **Two of PS's four mover kinds are not registered prefixes.** PL7 prices "granting passage to a unit whose mover is at war with its liege (PS §7.7)", and the r2b bracket says PS's kind prefix "is the contract PL registers", yet the list "stays `polity_ban:` · `army:` / `column:` · `den_unanswered:`". PS's round-2b cure made `PASSAGE_MOVER_KINDS = army · column · patrol · corps`, with keys `'patrol:' + detachmentId` and `'corps:' + unitKey` (PS l.128–132). PS l.343 now says "a `patrol:` or `corps:` crossing is not priced as harbouring until PL registers its prefix (a routed row to PL)", and PS l.596 says the same. A member that lets the crown's enemy's riders or retained company through is therefore unpriced, against PL7's own sentence. CONFIRMED (both texts). | Register `patrol:` and `corps:` in `FEALTY_EPISODE_PREFIXES` in PL's commit, extend P40, and re-word the r2b bracket to name all four. Alternatively, state in PL7 that those crossings are not harbouring (vetoable). |
| PL-V5 | MAJOR | §4.3 incursion arm (l.235); P42; OD-PL-48 | **On an incursion, the liege's `sent` has no carrier.** For a siege, `sent` has a reader: `computeAllyRelief` "counts the liege only on `sent`". For an incursion, no reader is named. PS §7.5's contest fights "A's unit as attacker and B's `homeDefense` as the defender's size" (PS l.337), and PS P-row l.526 asserts only that the input is "present". Yet `sent` writes `protection_kept` when the incursion ends (§4.3), which moves the hold's `P` and, through the trust patch, grip, and so deference. **The effect:** a liege earns deference for relief that moves no force, even when the member's guard loses and the column marches on. The DM reads "came to its aid" with no deed behind it (Evidence Law; legibility on scrutiny). The gate the cure chose (`allyDefenseEnabled`, the siege relief's switch) shows that relief was meant to count somewhere. CONFIRMED (no reader in either text). The deference consequence is PLAUSIBLE. | Make the incursion's `sent` enter PS §7.5's contest on the defender's side, using the liege's relief share as `computeAllyRelief` does, a PS-and-PL joint row. Or make the incursion a protection-only occasion with no `sent · kept` answer, where `protection_failed` follows a lost or unopposed crossing. The chair rules which. |

## Minor notes (not counted)
- §15.12 says patrol facts go out "through the events window (H9) like every other host fact".
  - The fold's (h) ↳ (l.349) splits the channels: dated acts go through H9, the week's presence through an H23 row, and patrol inputs through H13 (HR:538).
  - PL-1 (a) sends polity facts per seat through H13.
  - So "like every other" is false. PL follows the chair's literal words, so the row holds.
- Stale singulars: PL-9's hosts say "`changeAuthorityPolicy.js` (238) one row", and OD-PL-35's base text says "one … row (auto); minor". The brackets beside both, and §5.5, say two rows.
- §15.12's sub-vassal line `crownReachAt(…, rootId).share01 > 0` adds nothing. The same observer's `staunch`+ gate already makes `r ≥ 0.2`.
- §15.12 cites "§3.1 b" for the riders' quartering, but §3.1 (b) is the summons.
- A `den_unanswered` `protection_failed` row gets no trust/resentment patch, because `requestFealtyRow` returns a patch only for `fealty_defied`. §4.3 says "Each row also patches trust/resentment".
- A pre-existing gap the cures did not introduce: with succession lit and the contest dark, the fealty question's `claim` answer has nowhere to go (§5.6; P41 covers `free` only).

**CONFIRMED vs PLAUSIBLE.**
- **CONFIRMED by code read at `81f1cd963`:** the interval keys, the channel's host gate, `deriveDecisionTier` and the contract test, the epoch and its `ascendant` marker, and the tick-less DM row.
- **CONFIRMED by execution:** the walk rule's five worlds (re-run, identical) and the incident regexes.
- **CONFIRMED by quoting both sides:** the PL-r1-15 flag pair, PL-V4 and PL-V5's missing reader, and every cross-volume hold.
- **PLAUSIBLE:**
  - The weekly re-ask under the majors pause.
  - P39's tick-form assertion where the ladder is lit.
  - PL-V5's deference consequence.
