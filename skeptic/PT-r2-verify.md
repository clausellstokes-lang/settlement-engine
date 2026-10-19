# PT-r2-verify — the refuting verifier for THE PARTY, P3 round 2b (V-PT-r2, Opus 5.5, chair a73343ed, 2026-10-18 12:50 EDT by `date`)

**COUNTS: 8 holds · 0 fails · 0 stop · 1 new (0 BLOCKING · 1 MAJOR).**

I judged 8 rows: every BLOCKING or MAJOR id routed to PT in round 2b, and the two RULINGS-ROUND2b decisions PT executed.
- SEAMS-r2-6 (M) and HOST-r2-12 (M), routed by the skeptics.
- HOST-r2-5 (M in HOST-r2) and ST-r2-14 (M in ST-r2), routed by RULINGS-ROUND2b and its ADDENDUM.
- ST-r2-19 (M) and PR-r2-13 (M), routed by the sibling logs.
- STOP-PR-2, ruled (a), which carries SEAMS-r2-14 (m).
- OD-PT-28, accepted by the chair.

`cure/D-PT-r2b.md` REFUTED nothing and raised no STOP. The NOTED rows and the m-severity HOST-r2-19 were spot-checked, hold, and are not counted.

**Inputs read whole:** the README, VERIFY, all seven rulings files, the BOARD, SEAMS-r2, HOST-r2, D-PT-r2, D-PT-r2b, and the volume (718 lines, sha1 `0c0b0661…`).

**Read by grep or section:** CH §11, §16b and L3; RN §2.1, §2.2 and the persist row; PL §2; PR PR19, §2.2, §2.7 and §8.1–8.2; ST §2.3, §6.3, §7.2, §7.3 and S8; the host document's rows at HR:51, 66, 79, 81, 83, 84, 514, 601, 644–647, 656, 667 and 873.

**Code:** master `81f1cd963`, read only. One executed probe: `PT-r2-verify-probe/mergeLift.mjs` → `mergeLift.out`. No other file was edited, and git and the test suite were not touched.

## Verdicts (all 8 hold)
| id | disposition | verdict | receipt |
|---|---|---|---|
| SEAMS-r2-6 | CURED | HOLDS | The edge key is `u:<unitKey>`. `addExclusionEdge` and `liftExclusionEdges` key on any string (`const id = String(wnpcId …)`). Every reader looks edges up by key (`npcLedgerProjection.js`: `ledger.exclusions[id]`). This matches CH §16b, L8 and S40, and RN's `u:` row and its refused pairs. A corps visits as a paragon does (CH §16b: "lives exactly as a paragon does"). |
| HOST-r2-12 | CURED (PT's half) | HOLDS | M-SITE-A is confirmed at HR:601, 644 and 647, and M-SITE-F at HR:645. H7 waits on "H2; M-W1; H4; H5" and H22 on "H5; H7; H8; H12". The five re-pointed cites now land on the right lines. |
| HOST-r2-5 | CURED (PT's line) | HOLDS | PT §13 now matches PR14 and PR §13: facts go out through H9 and H23, and H16 is untouched. |
| ST-r2-14 | CURED (PT's half) | HOLDS | PT keeps no `site` as an actor anywhere (`grep "kind: 'site'"` = 0). This follows the ADDENDUM. ST §7.3 and RN l.243 still carry the withdrawn widening, but those are their own rows. |
| ST-r2-19 | CURED (PT's half) | HOLDS | ST l.341 names "PT's party door for `party_cleared_site`". The writer is idempotent per (site, word, tick) (l.395), and S8 gives one act and one undo. |
| PR-r2-13 | CURED (PT's half) | HOLDS | PR19 says the same as PT: "that WATCH IS a detachment of the court's riders (aim `pursue` …), and the hearing stays PT's". |
| STOP-PR-2 / SEAMS-r2-14 | CURED (ruled (a)) | HOLDS | PR §8.1's inputs (cover by `fameIn` scope, strangers, ban ×2, notice keyed per road) match. `candidateRoutes(digest, from, to, k)` exists with that signature. The `lived` placement row covers `sinceTick` (PR §2.7). PR R33 and CH §11 both give the road arm. |
| OD-PT-28 | ACCEPTED, recorded | HOLDS | The text is in §6, P42 and the OD row. The master code is as stated (`if (campaign && !event?.partyCaused) {`). |

## New finding
| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| PT-V1 | MAJOR (from R2b-1) | §9.3 | "each week an edge whose court reads `seatChangedSince(…, episode).changed === true` lapses through the same lift" | **What R2b-1 changed.** The round-2 text lapsed only "the windowed edges that court minted"; R2b-1 dropped the word "windowed". CH §11 still keeps it ("the windowed edges IT minted"). **What the code does.** `normalizeExclusionEdges` keeps one edge per (settlementId, kind), and "indefinite beats any window". **What the probe shows.** An emergent ban plus a DM `BAN_PARTY` at Kell become one `indefinite` edge. A door-scoped lift removes that edge, and `stillBannedAtKell: false` (CONFIRMED by execution). So a seat change erases the DM's own ban, and PT's lift no longer matches CH's. | Lapse only an edge that is still windowed. An indefinite edge is the DM's word, lifted only by `PARDON_PARTY`. |

**Carries (minor, not counted):**
- RN's normalizer drops unnamed fields, and its `target` names no `siteId` (RN l.127, l.506). PT lists this in §20(1).
- §20(4) is stale: CH now names `met_in_person` (4 hits).
- §15's EDITOR line lists the actors as "court, person or menace"; it should say "court, person or corps".
- A warrant never stands at WHERE `road`, so §7.3's "a warrant served on a road" has no place on the card.
- `banKeys` has no rule for what happens past its cap of 8.
- "The reveal" in ST's PT row (l.395) has no single meaning (PT's open question 5).

**CONFIRMED vs PLAUSIBLE:**
- **CONFIRMED by code read:** every hold.
- **CONFIRMED by execution:** PT-V1.
- **CONFIRMED by reading the text:** the host lines.
- **PLAUSIBLE:** that `candidateRoutes`' primary path is the path `hopWeeks` prices (PT marks it so). None of these was upgraded.
