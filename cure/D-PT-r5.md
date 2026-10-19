# D-PT-r5 — THE PARTY, round-5a disposition lane (Opus 5.5; chair 0a2e8bd9 continuing a73343ed; 2026-10-19 04:1x–04:2x EDT by `date`)

Lane: `docs/DESIGN_FP_ARCH_PT.md`. I read it WHOLE first (820 lines, round-4a text); it is now 849 lines (sha1 `a68aa65a…`), with 30 `[CURED 2026-10-19 (fp-final r5)]` and 5 `[REFINED 2026-10-19 (fp-final r5)]` brackets. The other outputs are this file and `cure/D-PT-r5-probe/`. I used no git and no suite. Master `81f1cd963` was read-only (the detached worktree of `briefs/RESEARCH-COMMON.md`, verified at HEAD `81f1cd963`).

Inputs read:
- WHOLE: README (both resume blocks), COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-ROUND4 (§A–§E), RULINGS-ROUND5 (§A–§C) and `skeptic/PT-r4-verify.md`.
- `skeptic/SEAMS-r4.md` (its ROUTES say "PT: —"; I read SEAMS-r4-5, -6 and -7 as PT's cites) and `skeptic/BD-r4.md` (its ROUTES PT line).
- The ROUTES sections of all ten `cure/D-*-r4.md`. Only BD, CH and RN route to PT.
- The earlier rulings files by grep for every PT, bounty, reveal and patience row. None contradicts this round's cures.
- Sibling text I re-read as it now stands, since round 5a is writing it:
  - BD §2.2, §2.3, §9.9 and §11 (BD's r5 lane has already applied PT's r4 routes: RU-13 and RU-14).
  - CH §14, the `banKeys` row and S48.
  - RN §2.1's `target` row.
  - The fold §5 at l.845.
  - The host requirements at HR:601.
  - `cure/D-BD-r5.md`, `D-PL-r5.md`, `D-PS-r5.md`, `D-ST-r5.md` and `D-RN-r5.md`. All of these route nothing new to PT.

## 1. MEASURED FIRST (the receipts that convicted, re-read)
- **PT-X1's premise.** PT §8.2 (r4) said: "no PLACE a journey could be priced to … can never be `fell_short`". PT's own §9.2 body half says: "a BODY whose own `where` that week is that stretch … the body's record AS IT STANDS (truth …)". BD §2.2 now reads `where: { kind: 'country' | 'road' | 'trail' | 'site', ids: [a] | [a, b], siteId? }`, a non-optional field of every record. So the premise is refuted, CONFIRMED by quoting both.
- **The cure, MODELLED.** `D-PT-r5-probe/huntFault.mjs` → `huntFault.out` runs PT §8.4/§8.6's fold verbatim on a toy hop matrix:

  | Case | Round 4 | Round 5 |
  |---|---|---|
  | A: yes at Kell, never rides, gang a week away broken at week 6 | `came_to_nothing` | `fell_short` |
  | B: four weeks away, broken at week 2 | `came_to_nothing` | `came_to_nothing` |
  | C: rides to the gang's road, another hand breaks it | `came_to_nothing` | `made_good` |
  | D: the party's own `END_BODY` | `made_good` | `made_good` |
  | E: gang moves away, bounty lapses at week 3, reachable in week 1 | `came_to_nothing` | `fell_short` |

  This is a model, because the design is unbuilt.
- **L-BD 33's contradiction.** The texts read now:
  - PT (r4): "a conclave → `faith`".
  - BD §9.9: "in the `order` domain for a gang or a flock — an outlawed flock's bounty is an `order` call, never `faith` (RULINGS-ROUND5 B.15)".
  - CH §14: "an `outlawed` conclave's an `order` call only (… never a faith call …)".

  All three CONFIRMED.
- **L-BD 36's grammar and home.**
  - BD §11, as cured in r5: "`TRAIL_KNOWN` | town · trail · known / forgotten · party | … the DM tells a TOWN of a way (`by_dm`, §2.3) or, with the `party` dial ON, REVEALS it TO THE PARTY — the execution calls PT's door, `party_made_known_trail` (a mark on THE PARTY's record — PT's shape and writer, read by nothing in the world)".
  - BD §2.3: "The party's knowledge is not the towns' … the party's own discoveries reach a town only when the DM tells the world (`by_dm`)".
  - The host, HR:601: "the party's known places are kept in the host's map record … a 'revealed' site is just its address added to it" (ENC-HS-01).

  The host's list holds PLACES. Whether it admits a way's address is unknown (PLAUSIBLE; a HOST-ask).
- **The token census.** `census-r5.sh` → `census-r5.out`: `waysKnown` and `needPlaceOf` are FREE (0 word files and 0 quoted literals in master `src`/`tests`/`docs`). `party_made_known_trail` and `body_ended` have 0 on master; in the ledger docs they appear only in PT, BD and the fold.
- **Volume integrity.** `tablecheck.out`: 23 tables, 0 column mismatches. The struck rules survive only inside brackets and record rows.

## 2. THE RECORD (22 ids: 12 CURED · 0 REFUTED · 0 STOP · 10 NOTED — the volume's §21 round-r5 block is the same table)
| Id | Sev | Disposition | Where | Receipt checked |
|---|---|---|---|---|
| L-BD 33 (FAIL) | MAJOR | CURED per B.15. PT reads the call's own domain; `body_ended` books a conclave as `order` | §7.2, P53, OD-PT-33 | BD §9.9 and CH §14 quoted (§1). 0 live "conclave → `faith`" |
| L-BD 36 · `D-BD-r4` route (4) (FAIL · ROUTED-UNAPPLIED) | MAJOR | CURED per B.22. BD's grammar is adopted: `party` ON reveals a way TO the party, the town dial is unread, and the way is PT's `waysKnown` row (no deed; read by nothing in the world; offered to the host's one reveal writer). `party_made_known_trail` is struck as a deed kind and now names the write | §3.1, §2.1, §2.3, §2.4, §3.3, §4, §12, §15, §16, §19b, OD-PT-4, OD-PT-33, P54 | BD §2.3/§11 now read the same as PT. HR:601's one writer is kept |
| PT-X1 | MAJOR (new) | CURED. The hunt is a THRESHOLD clock; `needPlaceOf` gives the body's own `where` each week (truth); the fault fold and the reached read take that place; §8.6's one rule then applies | §2.2, §2.3, PT10, §8.2, §8.4, §8.6, §15, P53, OD-PT-33 | `huntFault.out` A–E (a model) |
| m1 | minor | CURED: the `need` list gains `{ bodyId }` | §7.3 | — |
| m2 | minor | CURED: no patience on a hunt | PT10, §8.2 | — |
| m3 | minor | CURED: BD's own ends (it drops at a claim or a lost name, and lapses after DRAFT 52 weeks) | §8.2, P53 | BD §9.9 "lapses", "drops" |
| m4 | minor | NOTED and ROUTED CH: BD §9.9 names the source; CH §14 still owes it | — | `grep body_bounty` CH = 0 |
| m5 | minor | CURED (PT's text) and ROUTED CH again | §2.1 | CH:186 has no `untilTick` |
| m6 | minor | NOTED. Nothing is owed: RN's volume defers to PT's line rule (RN §2.1 `target`). The wrong trigger word was only in `D-RN-r4`'s route text | — | RN l.130 quoted |
| m7 | minor | NOTED and ROUTED FOLD (P4) | — | — |
| SEAMS-r4-5 | MAJOR (BD's) | CURED (PT's cite): BD §11 carries the dial | §3.1 | BD l.693 |
| SEAMS-r4-6 | MAJOR (CH's) | NOTED. PT's case F stands; CH's half is ROUTED | §2.1 | — |
| SEAMS-r4-7 · B.5 | MAJOR | CURED (PT's cite): the party's claim IS `body_ended` (one deed); no `hunt_won` beside it | §3.1, P53, OD-PT-33 | BD §9.9 "The claim", B.5 |
| B.15 | ruling | CURED: as L-BD 33 | §7.2 | — |
| B.22 (PT 1) | ruling | CURED: as L-BD 36 | §3.1 … | — |
| BD-r4 ROUTES "PT: agrees" | — | NOTED: its trail half did not agree; it is resolved by L-BD 36 | — | — |
| `D-BD-r4` route (3) | routed | NOTED: held | §7.2 | — |
| `D-CH-r4` PT (1) | routed | NOTED: held (the verifier's re-run was byte-identical) | §9.2 | — |
| `D-CH-r4` PT (2) | routed | NOTED: held | §9.2 | — |
| `D-RN-r4` PT (the veil) | routed | NOTED: held | §4 (6) | — |
| `D-CH-r5` route to PT (late; applied on the re-dispatch at 07:3x) | routed | CURED: PT's "a court knows its own needs by presence" gains "save a DEN, a call the court knows only through ST's `believedDenOf` and never by presence, CH §14" | §7.2 | CH §14 BELIEF row quoted: "NEVER for a DEN, whose holder is a belief and is known only through ST's `believedDenOf`"; ST §2 `believedDenOf` exists (l.193) |
| RULINGS-ROUND5 §A | ruling | NOTED: no row names PT | — | — |

## 3. STOPs
NONE.

## 4. REFINED (beyond the inputs; each is bracketed in the volume and vetoable)
1. **R5-1.** A way revealed to the party is a PT RECORD and never a deed.
   - A deed is the party's act and travels as a tale. A reveal is the DM telling the players, and no hearer in the world could hear it.
   - The host's known-places list keeps its one writer. PT is its producer, as PT already is for ENC-HL-04.
   - A town learns a party's find only by the DM's `TRAIL_KNOWN` to that town. That act mints no party deed.
2. **R5-2.** Presence where the hunted body worked, in a week after the answer, counts as `made_good`. This is the siege's own rule (P26), and it follows the answer paragraph's "never blamed for a box the DM forgot to tick". The verifier's cure priced only the miss.

## 5. ROUTED (the other lanes' halves; one line each)
- **CH:**
  - §14's bounty call `source` = `{ kind: 'body_bounty', courtId, bodyId }` (BD §9.9's words; m4).
  - `paragon.banKeys` rows gain `untilTick`, and `banish`'s inverse re-writes a still-ahead window (SEAMS-r4-6 / m5; PT's case F).
  - Align the gang bounty's domains with BD: CH §14 has `wildland · war · order` where BD §9.9 has `order`. PT reads the call's domain either way.
- **BD:**
  - §9.9 "The claim" names the party's claim as PT's `body_ended` (B.5: one deed; no `hunt_won` for the party).
  - Otherwise BD's §2.3, §11 and §19.0 rows already agree with PT's cured text. Nothing else is owed.
- **FOLD (P4):**
  - §5 l.845: `party_made_known_trail` is NOT a party-door event type. Re-word it as "PT's sub-ledger write of a way shown to the party (`waysKnown`)", and register `waysKnown` and `needPlaceOf`.
  - §3.4: the `party_gate` row registers both verdict sets (the gate's `admitted · refused · admitted_under_watch · struck` and the body half's `passed · reaches_party · struck`) (m7).
  - The `party_request` row's hunt is a clocked pledge. It is no longer patience-only.
- **HOST-ask (through the fold's host rows):** does ENC-HS-01's list (`MapRecord.party`) admit a way's address, so the map's party view can draw a way PT offers? Until it is answered, the way is shown in the DM's window only.

## 6. OPEN QUESTIONS FOR THE CHAIR
1. R5-1: is the way-revealed-to-the-party a record (as cured), or should the host's list alone carry it once the map is connected? The latter needs the HOST-ask's yes, and PT would then still hold the engine-side row for unmapped worlds.
2. R5-2: should presence where the body worked count as `made_good` for a hunt? The alternative is the deed or the click only.

## 7. CONFIRMED vs PLAUSIBLE
- **CONFIRMED by quoting both sides' current text:** L-BD 33's contradiction and its cure, L-BD 36's grammar and home (BD §2.3/§11 as BD's r5 lane wrote them), PT-X1's refuted premise, and every minor's receipt.
- **CONFIRMED by execution:** the token census and the table integrity check.
- **MODELLED (a model of an unbuilt design, not master's code):** the hunt's fault fold (`huntFault.out`).
- **PLAUSIBLE, never upgraded:** whether the host's list admits a way's address; that "the party takes no `hunt_taken`" stays true as CH and BD write the hunt card; and that CH, BD and the fold take the routed halves as written.

## 8. RE-DISPATCH CHECK (2026-10-19 07:3x EDT by `date`; the workflow resumed after the 5h trip)
- This lane's first pass closed at 04:24 with the record above. On the re-dispatch I re-checked the inputs: none changed after 04:24 (README 03:26, RULINGS-ROUND5 03:26, PT-r4-verify 03:03, SEAMS-r4 02:29, BD-r4 02:39, every `D-*-r4.md` before 23:00).
- The sibling r5 records written AFTER 04:24 were read for PT lines: `D-CH-r5` (04:29) routes ONE line to PT, now CURED (§2 row above); `D-RN-r5` (04:30) "PT: none"; `D-MN-r5` (04:33), `D-PR-r5` and `D-FOLD-r5` are unfinished (their lanes died on the 5h limit and are re-running) — anything they route to PT is the next round's input.
- The probes re-run byte-identical: see `D-PT-r5-probe/rerun-0731.out`. The volume's sha before this late cure is kept at `D-PT-r5-probe/PT.pre-late-route.md`.
- PT's own routes to CH (§5) are LANDED in CH's r5 record: F1 · SEAMS-r4-6 `banKeys.untilTick` CURED; F4 the `body_bounty` source CURED; n7 · B.15 one call, one domain CURED. They are no longer owed; the FOLD and HOST lines of §5 stay owed (P4).
- Table integrity after the late cure: 23 tables, 0 mismatches (`rerun-0731.out`).
