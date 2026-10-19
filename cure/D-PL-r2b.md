# D-PL-r2b — DISPOSITION LOG for `docs/DESIGN_FP_ARCH_PL.md`, P3 round 2b (lane D-PL-r2b, chair a73343ed; seat Opus 5.5; 2026-10-18, 08:00–08:12 EDT by `date`)

## OUTCOME
All 8 items routed to PL are disposed: 7 CURED, 1 NOTED, nothing refuted, no STOP.
- **From the seams and host skeptics (3).** These are the ids in the "routes" sections of `skeptic/SEAMS-r2.md` and `skeptic/HOST-r2.md`: SEAMS-r2-10 (MAJOR), SEAMS-r2-17 (MINOR) and HOST-r2-4 (MAJOR).
- **From RULINGS-ROUND2b (2).** The file names no row for PL, but two of its corrections reach PL sentences. HOST-r2-5 corrects the H16 door. PS-r2-3/4 makes the unit key stable.
- **From other files (2).** These are PL-text items other lanes' files routed here. D-CH-r2 §5.1 (the third faith carrier) was written after D-PL-r2 ran. PS-r2-25's cure names PL's row.
- **The rest of RULINGS-ROUND2b (1).** It was read against PL and is NOTED.

The volume went from 734 lines (206,288 B) to 753 lines (222,192 B). The diff is `D-PL-r2b-probe/volume.diff` and the pre-round copy is `D-PL-r2b-probe/PL.before-r2b.md`. Every table still has matching columns (`check-r2b.out`: 0 mismatches). Git and the test suite were not touched. Master `81f1cd963` was only read.

The FOLD parenthetical in the prompt (the fold lane's notes in D-MN-r2 / D-PT-r2) belongs to the fold lane, not PL. I read both files. D-MN-r2 §4 routes only to D-PR, the fold and D-ST. D-PT-r2 §5 routes to RN, the fold and PR. Neither has a PL row.

## 1. FIRST ACT — the measurements that could refute the cures (master `81f1cd963`, read-only; CONFIRMED unless marked)
- **Token census** (`tokens.out`). `appendRelationshipFealtyRow`, `requestFealtyRow`, `call_in_answer`, `half_answered`, `patrol_order`, `paragonFaithCarriers` and `riders_quartered` have 0 src and 0 tests hits. All are design tokens, and `riders_quartered` is free. `attemptEntry` (4 src), `mintMemoryWeaveIncident` (3) and `MEMORY_WEAVE_INCIDENT_TYPES` (4) are landed.
- **The weave's closed list.** `relationshipEvolution.js :: MEMORY_WEAVE_INCIDENT_TYPES` is a frozen object: `route_seized · rite_imposed · elite_feud · elite_amity`.
- **The regexes, executed** (`regex.out`). `riders_quartered` is matched neither by `ESCALATION_HINT` nor by `grievanceRead.js :: WOUND_TYPE_RE` (`/war|betray|tribute|conquest|occupation|sack|raid|seiz|impos|contest_loss|contest_forestalled/i`). `appointment_imposed`, which is already in PL §15.9's list, DOES match the wound set (`impos`).
- **The call-in record** (WC §1.9.1). `CALL_IN_REQUEST = { fromId, toId, warAnchorKey, askedKind, askedBand, askedTick, horizonTicks, answer, answeredTick }`. It has no id field, so a summons row's episode is `warAnchorKey · askedTick`. The fold §3.4 row is `call_in_answer | WC (WC-5) | … | answered · half_answered · refused · lapsed | CLIMAX`.
- **The 3a entry carrier.** `religiousContest.js` has "3a. entries — faiths reaching C not yet present" and `const entered = attemptEntry(state, deity, strength, { force: Boolean(occupied), tick: stampTick });`. The reach map is filled only `if (spread)` ("no carrier entries" otherwise), so the carrier is gated by spread.
- **The host document** (`host-lines.out`):
  - HR:671 (law 10): "the two owner-ruled map derivations, the sway and the patrol cadence, drawn as the map's own and reaching the host only as offers"; also "facts recomputed by the host's own exported function on the same snapshot, labelled so".
  - HR:499: "Two partitions, never one".
  - HR:531: H13 asks for raw `PolityLink` rows and notes the puppet seat's three drawings (J-V13.67).
- **Sibling census** (`siblings.out`, `opens-h16.out`). PS cites `appendRelationshipFealtyRow` twice and PR once. PR names `patrol_order` 8 times. CH already uses `requestFealtyRow`. CH, PT, RN and MN still say patrols wait until the host "opens H16" (lines in §5).

## 2. THE RECORD
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| SEAMS-r2-10 | MAJOR | CURED (PL's half) | §4.1, §4.6, §7 `call_in_answer` row, §15.12, P44, OD-PL-46, OD-PL-50 | PL §4.1's summons on `call_in_answer`; PR3 (riders absorbed into the levy); the call-in record's key; one fact, one hearing (requirement 24; §4.3's precedent) |
| SEAMS-r2-17 | m | CURED | §15.12 | PR R-8 struck `warden` |
| HOST-r2-4 | MAJOR | CURED (PL's half: CONFIRMED) | §2 tuple bracket, §9 PL-1, OD-PL-42 | HR:671, HR:499, HR:531; the owner's 05:57 word (CHAIR-NOTES 9) |
| ROUND2b HOST-r2-5 | — | CURED | §15.12 | "H16 is the map's INBOUND door … the host's patrol facts go OUT through the events WINDOW (H9)" |
| ROUND2b PS-r2-3/4 | — | CURED | §4.3, §4.6, P42, OD-PL-46, OD-PL-48 | "the unit key is the unit's own stable id (the deployment id), never `departTick`" |
| D-CH-r2 §5.1 | m | CURED | §14.7 | CH §6.2's three carriers; the 3a step read on master |
| PS-r2-25 | m | CURED (PL's row) | §3.4 | "transit, not a decision"; PL's "passage" is the charter's toll right |
| ROUND2b, all other rows | — | NOTED | §16 r2b | `round2b-grep.out`: PL has no navy, sea, weather, pass, gate keeper, corps, envoy interception, site funding, keep or patrol envelope text. Its five "harbour" hits all mean the act of harbouring. |

**How the SEAMS-r2-10 cure works.** The riders are INSIDE PL-5's summons, as one input line on `call_in_answer`:
- `answered` sends them to the crown's war with the member's service.
- `half_answered` keeps them on the member's own roads, and the `fraction` records what stayed.
- `refused` keeps all of them.
- `lapsed` means the call ran out undecided.

The rule is one hearing and one row per member per call. PL withdraws its §15.12 co-signature of PR's `patrol_order`. A summons row is PL's own: it is minted, never requested, so there is no `riders:` prefix. §4.6 states that `appendRelationshipFealtyRow` is the relationship writer's internal append and is never a door. Before PL-5 lands, the crown summons no riders. The root's own riders are still PR's instrument and ride by the hold.

**Cross-volume check (DISPOSE).** These SEAMS-r2-10 cures now contradict PR's text: §10.3, §11.2, R22, OD-PR-27, PR-4's car-0 and the §15.1 PL row. They also contradict PS l.291's citation of the internal append. Both volumes are routed SEAMS-r2-10 for their own lanes, with the same skeptic cure. No other volume names `patrol_order` or the internal append.

## 3. STOPS
None. HOST-r2-4 needed a call, recorded here because it is vetoable:
- **The conflict.** The round-1 ADDENDUM (HOST-r1-1) says "the map's own chain rule is superseded by that read when H13 lands". HOST-r2-4 says that clause re-decides the map's owner-ruled sway.
- **Why it is not a STOP.** The owner's word of 2026-10-18 05:57 ("i told the mapmaker i do as it suggested", recorded as H1–H30 ACCEPTED WORK) came after the ADDENDUM. It accepts the map document, which keeps the sway as its own derivation (HR:671). The kit's standing rule is that the owner's words on the BOARD outrank every ruling.
- **What PL did.** PL's text already said what HOST-r2-4 asks (PL-1 (b)/(c), written before the ADDENDUM). PL only re-worded its own §2 phrase.
- **What is left.** The fold's half (§3.1.26, INBOX ↳ r1 (a)) is P4's. The chair may still want to re-state the ADDENDUM clause in a rulings file.

## 4. REFINED (each bracketed in the volume, vetoable)
1. **SEAMS-r2-20** (routed to PR). §15.12 now writes the reference text for PR to cite. The root's own decision reads `polityHoldOf(…, rootId, rootId)`. A sub-vassal's roads are open only where `crownReachAt(…, rootId, subVassalId, rootId).share01 > 0`. PR's `staunch` threshold stays PR's.
2. **`riders_quartered`.** At PR's request (PR §7.6, OD-PR-26), it is registered in §15.9's closed incident list and gets a §2 census row and OD-PL-51.
3. **`appointment_imposed`.** Its match of the landed revanchism wound set is STATED and not changed: the landed set catches "any future imposition/seizure incident" by intent (§15.9, OD-PL-51).
4. **OD-PL-33** is aligned with HOST-r2-9's split. Site garrisons are THE SITES'. The seat's force band and garrison presence are a slot. No PL term reads either.

## 5. OTHER FILES' HALVES — routed (this lane wrote none of them)
1. **PR (SEAMS-r2-10, PR-r2-17).** Strike the `patrol_order` kind, or keep it with `call_in_answer`'s words. With PL's cure the input-line road is the one PL supports. Fix §10.3, §11.2, R22, OD-PR-27 and the §15.1 PL row. PR-4's car-0 should name `requestFealtyRow`, not `appendRelationshipFealtyRow`. PR §7.6 can now cite PL's registration of `riders_quartered`. §10.3 can cite §15.12's reach line (SEAMS-r2-20).
2. **PS (SEAMS-r2-10).** At l.291, cite `requestFealtyRow` and not `appendRelationshipFealtyRow`. PS's stable unit key must keep its kind prefix (`army:` / `column:`): that prefix is the occasion PL registers (§4.6).
3. **CH, PT, RN, MN.** Each still says patrols wait until the host "opens H16". The lines are CH:393, :692, :818, :863, :980; PT:377; RN:239; MN:349, :605, :751. RULINGS-ROUND2b HOST-r2-5 corrected only PR, the fold INBOX (h) and the §5 row. These lines echo RULINGS-ROUND2 §E's own wording, so the chair may want to correct §E as well.
4. **The fold (P4).**
   - HOST-r2-4's half: §3.1.26 and INBOX ↳ r1 (a) become an ask, not a supersession.
   - The §3.4 `call_in_answer` row notes the riders' input line. No `patrol_order` row is registered.
   - §5 registers "transit" (PS-r2-25).

## 6. OPEN FOR THE CHAIR
1. **The ADDENDUM HOST-r1-1 "superseded" clause** (§3 above). Re-state it, or confirm that the owner's 05:57 word governs.
2. **If the chair prefers PR to keep a separate riders' card**, PL would then register a `riders:` prefix for PR's requested rows. PL did not do this: two hearings for one fact break requirement 24's one-fact rule, and PL already hears the summons.

## CONFIRMED vs PLAUSIBLE
- **CONFIRMED by code read at `81f1cd963`:** the token census, `MEMORY_WEAVE_INCIDENT_TYPES`, the two regexes, the 3a entry step and its gate on spread.
- **CONFIRMED by execution:** the regex matches (`regex.out`).
- **CONFIRMED by reading the files:** the WC call-in record, the fold's `call_in_answer` row, HR:499/531/671, and the sibling lines.
- **PLAUSIBLE:** that PS's stable key keeps its kind prefix (it does today); and the end-to-end behaviour of the riders' input line, which waits on WC-5 and PL-5 being built.
