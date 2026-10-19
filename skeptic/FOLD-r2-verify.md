# FOLD-r2-verify — the refuting verifier of D-FOLD-r2b (the fold, the spine §1, CN), P3 round 2b

Seat V-FOLD-r2 (Opus 5.5), chair a73343ed, 2026-10-18 ~12:3x–13:08 EDT (by `date`). I read the kit README, VERIFY, SKEPTIC, L-FOLD2, every rulings file (round 2b and its addendum win), CHAIR-NOTES, the BOARD, `SEAMS-r2` and `HOST-r2` whole, `D-FOLD-r2b` and `D-FOLD-r2`, the routed notes in `D-MN-r2` §4 and `D-PT-r2` §5, and the fold whole. I re-checked every cross-reference against the sibling volumes as they stand now (PR · PS · ST · MN · PL · RN · CH · PT · ES · WC; PT and CH after their 12:1x–12:2x round-2b writes) and against master `81f1cd963` (read-only). Probe: `FOLD-r2-verify-probe/` (code receipts 1–3, sea census, token census, insertions-only, table-pipe check). I wrote no other file and ran no git and no test suite.

## COUNTS

**Scope: 19 BLOCKING/MAJOR ids (SEAMS-r2: 2B · 7M; HOST-r2: 2B · 8M). Holds 18 · fails 1 · STOP 0 · new 2 (0 BLOCKING · 2 MAJOR).** There are no REFUTED rows.

**Insertions-only proof, re-executed:** fold +78/−0, spine 0, CN 0. All 67 inserted table rows match their header's column count. Every code symbol the new rows cite resolves at `81f1cd963`. That includes `SLOW_NOT_SEVER_MAX = 6`, `climateBandFor`, pestilence `hopWeeks(…, season)`, `SEASON_ROAD_DEATH`, `planMarch` (fed `season` at `armyTransitKernel.js`), `attrition.js` (0 season reads), `WAVES.navalEnabled`, the navalKernel sea battle and blockade, the `foreignGuestHold` `encounterId` guard, the stamp `counterforce: assessment`, `smuggleSuccessChance`/`worstGate`, `WORLD_SNAPSHOT_HARD_DENY ∋ 'spatialLedgers'`, `UPKEEP_LEDGERS = ['deployments']`, and the `gateKey` local in `defenseDisplay.js`.

**Holds (18):** SEAMS-r2-1, -2, -3, -4, -6, -8, -9, -10, -12; HOST-r2-1, -2, -4, -5, -6, -8, -10, -12, -13. For each one, the owning volume's current text says the same thing as the fold's new row:
- **Sea:** MN, PR, PS, CH and ST all say "in the books" and name W-NAVY.
- **Envoys:** PS §6.5's `PASSAGE_ENVOY_VERDICTS`.
- **Patrol counter term:** PR §6.2's one entry, with MN §5.5's slot filled through the stamp.
- **The corps:** RN §2.2 `u:`, CH §16b, PT's edge arm and PS1 (d).
- **Stretch key:** PR §2.2 = PS PS8.
- **Riders and garrison:** PL §4.1/OD-PL-46/50/51; ST OD-ST-39 and PR OD-PR-41.
- **Patrols and the map:** PR §2.3 (a periodic clock) and §13 (the window).
- **Sites:** ST §2.1 (`mapSiteRef`, `rekinded`).
- **Milestones:** match the host document's rows.

## FAILS

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| HOST-r2-9 (M) | CURED: the fold gives THE SITES site garrisons only; a seat's force band is a slot (§3.1.29 ↳ r2b) | **FAILS** | **The fold now contradicts itself.** HOST-r1-15's cure wrote the over-claim in two places, and r2b narrowed only one. §5's MAP REGISTER row (fold:748) still says "the map's force band reads THE SITES' garrison record when it lands". That row's force band is H13's per-seat band ("a seat's force band 0–4 and garrison presence"), which §3.1.29 ↳ r2b now says is "not sites: … a SLOT". **Cure:** one bracket on fold:748 pointing at §3.1.29 ↳ r2b. |

## NEW FINDINGS

| id | sev | site | claim and receipt | cure |
|---|---|---|---|---|
| FOLD-V3 | MAJOR | §5 "PT round-2 tokens ↳ r2b" (fold:735) | **The register lists a token PT no longer uses and misses the one it does.** The row registers `party_revealed_site` as PT's FREE kind and says it "reads with ST's `made_known`". PT's own round-2b lane renamed it `party_made_known_site` (`cure/D-PT-r2b.md` row 36: "`party_revealed_site` → `party_made_known_site`"). Counts: PT has 7 hits for the new name and 0 for the old; the fold has 1 hit for the old name and 0 for the new. This is FOLD-V1's class (a fold mirror written before the owning volume's cure in the same round). So the routed item "D-PT-r2 §5 (tokens, `revealed`)" fails as well. D-PT-r2b §5 item 5 has already routed the fix to P4. | Bracket the row: the token is `party_made_known_site`, FREE (0 · 0 on master, CONFIRMED). |
| FOLD-V4 | MAJOR | OD-FC-63 (fold:925; marked VISIBLE in ODQ §934.93) | **An owner-visible row says RN-3 waits on the owner, which every other text now denies.** OD-FC-63 says "RN-3's LIGHTING waits on 25e and 25g". On the other side: RULINGS-ROUND2 B ("no lighting gate"); RN §6.2 and §13 ("NO lighting gate waits on the owner's alignment answers … it is struck"); PT OD-PT-17; and the fold's own ORDER NOTE ↳ r2b (2), which puts PT-1/PT-2 behind RN-3 "(RN-3 carries no lighting gate)". OD-FC-63 ↳ r2 fixed only the word "lenses". If OD-FC-63 is read as it stands, C13 waits on two owner questions, and the ODQ draft would carry a gate that has been struck. | Bracket OD-FC-63: the gate is struck (RULINGS-ROUND2 B); the three questions stay visible and gate no wave. |

**Minor notes (not counted):**
- **The `u:` prefix.** §5's regard-keys ↳ says "no quoted `'u:` literal on master (0 files)". In fact `u:` is landed as a rate-limit key in `supabase/functions/ingest-events/index.ts`, migration 029 and one test file. RN already registers it as a homonym.
- **`cut01`.** The digest records no gate fraction (its gates are `{between, cellA, cellB, cost}`), so the rule is always 0.5.
- **Two spellings of one pair key.** `a␟b` sits beside the digest's landed `pairKey` `a|b`.
- **Actor-kind lists not updated.** §1's requirement-24 bracket and the spine still list four actor kinds, without `corps`.
- **The site rationale also excludes `menace`.** The r2b actor-kind rationale ("posture-bearing DECIDERS; a site has no mind") applies equally to `menace` ("no mind", MN6), which the convention keeps.
- **`party_stopped`.** The recount at fold:556 still sends `party_stopped` to P4, but STOP-PR-2 was ruled with no new kind.
- **A rule on the map program.** §5's cadence row says the map "never recomputes" patrol presence, which reads as a rule on the map program. That sits against §3.1.26 ↳ r2b's "No FP text supersedes a map derivation" (HR law 10 names the patrol cadence). INBOX (h) frames it as an ask.
- **Piracy placed in a dark module.** §3.3.14 (c) attributes piracy parity to D-6 S3, and `seaRoadsEnabled` is lit nowhere. The live parity is the shared `banditryLoss`/`scoreRoute` (`navalLayer.js`, Stage 5).
- **Unbracketed rows.** §8 has no round-2b line. OD-FC-56 and OD-FC-19 are not bracketed for C14–C16. OD-FC-46 ↳ (3) still says "two feeders".
- **ST still carries the STOP-era wording.** ST §7.3 and §7.4 keep the `site` actor widening, and D-FOLD-r2b §5 does not list ST among its sibling halves.

**For the chair:** `briefs/L-FOLD2.md` still carries pre-r2b text, and P4 would bring both errors back if it folds that text literally:
- Item 4: "SEA WITHOUT A NAVAL PROGRAM … WY navalTransit … W11 … a ship is carriage … a landing is an incursion". This re-introduces SEAMS-r2-1.
- Item 5: `patrol_order` among PR's kinds. This re-introduces SEAMS-r2-10.

## CONFIRMED vs PLAUSIBLE

**CONFIRMED by execution:**
- the insertions-only diff
- the token census
- the table-column check

**CONFIRMED by read:**
- HOST-r2-9's fail and both new findings: the two sides of each are quoted
- every code receipt and sibling-text match

**PLAUSIBLE, not upgraded:** that army attrition by season is the only unbuilt seasonal arm.
