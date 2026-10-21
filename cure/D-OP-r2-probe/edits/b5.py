from lib import apply
R2 = '[CURED 2026-10-20 (fp-final P6 r2) — '
pairs = [
(r'''(a walker: no OP read and no call row reads a `foreignGuestHolds` row for a captive's HOME)''',
 r'''(a walker: the home-keyed call row's builder reads only `toldBy` records — a `RansomRec`, a persisted demand, an RN telling — never `foreignGuestHoldsOf`)'''),
# §16 tokens
(r'''| `riding` · `ridingOf` | MG's (prose-only at master) |''',
 r'''| `jailerOf` · `rosterKeyOf` · `toldBy` (a field of CH's call source; its `road` members `ransom_demand · roads_ransom · telling`) | FREE (`jailerOf` · `rosterKeyOf` · `toldBy` · `roads_ransom` 0 · 0 · 0 · 0); `ransom_demand` design-only in master docs (`DESIGN_WAR_RULINGS_ARCHITECTURE.md`'s errand purposes — the same meaning, a demand carried home); `telling` LANDED (RN's and IN's word — the same meaning); `jailer` prose-only (one `src` string) — `cure/D-OP-r2-probe/tokens-r2.out` | identifiers, and a closed source vocabulary proposed to CH (ROUTED); `jailer` never a bare code value ''' + R2 + r'''OP-r1-1 · OP-r1-5 · OP-V1] |
| `riding` · `ridingOf` | MG's (prose-only at master) |'''),
# §17 OD-OP-7
(r'''| OD-OP-7 | a rescue only where the VENUE town sits at a T4 rung toward the rescuer's court IN TRUTH at the arrival tick (presence; the catch law's own rung);''',
 r'''| OD-OP-7 | a rescue only where the JAILER (`jailerOf` — the venue's own court; the OCCUPIER in an occupied town, RULINGS-P6 D.2) sits at a T4 rung toward the rescuer's court IN TRUTH at the arrival tick (presence; the catch law's own rung, its `hostRung` re-read home → the jailer) ''' + R2 + r'''OP-r1-5];'''),
# OD-OP-14
(r'''the captive may be any NAMED person the court has heard is held —''',
 r'''the captive may be any NAMED person the traveller FINDS held where it stands, or its court has been TOLD is held by a record that ARRIVED (a roads ransom; WR-7d's persisted demand; an RN telling — RULINGS-P6 D.1) ''' + R2 + r'''OP-r1-1: "has heard" named no road] —'''),
# OD-OP-26
(r'''THE TRAVELLER'S KNOWLEDGE: presence, the frozen departure picture and its court's own roads hostages;''',
 r'''THE TRAVELLER'S KNOWLEDGE: presence, the frozen departure picture and what its court had been TOLD by the errand's `departedTick` (a roads ransom; WR-7d's arrived demand; an RN telling — D.1) ''' + R2 + r'''OP-r1-1];'''),
# OD-OP-27
(r'''| OD-OP-27 | THE FALSE WORD is the landed SELF-BLUFF with the carrier as its mouthpiece (declared face) — `commissionedPlantAt` untouched; a third-party claim waits on IN's declared carried-plant shape; the sender charged on exposure as the hearer sees it [CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10 · OP-r1-27] |''',
 r'''| OD-OP-27 | THE FALSE WORD is the landed SELF-BLUFF with the carrier as its mouthpiece (declared face), keyed by the carrier's POSITIONAL key (`rosterKeyOf`; none where no roster row answers) — `commissionedPlantAt` untouched; a third-party claim waits on IN's declared carried-plant shape; the sender charged on exposure as the hearer sees it [CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10 · OP-r1-27]; the r1 STOP on RULINGS-P6 §C's IN text RULED by §D.3 as proposed — IN's marker telling a carried bluff apart is a persisted shape, the OWNER's, VISIBLE; the carried-plant shape a SLOT, the owner's ''' + R2 + r'''STOP-C-IN · OP-V1] |'''),
# new OD rows before OD-OP-23
(r'''| OD-OP-23 | THE RESCUE LIGHTS ONLY AFTER ES-2b's CUSTODY WAVE:''',
 r'''| OD-OP-31 | THE JAILER: every read of "the court whose cells are broken" reads `jailerOf` — the venue's own court for `allied_hall` and `host_settlement`, the hold's `captorId` (the OCCUPIER) for `occupied_enemy_settlement`, a roads hostage's `captorId` — never the venue's own court by default (RULINGS-P6 D.2) ''' + R2 + r'''OP-r1-5] |
| OD-OP-32 | THE HOME IS TOLD: the home-keyed `captive_held` call and every carried chance toward a captive exist only from a record that ARRIVED at the home (a roads ransom; WR-7d's persisted demand — none at master; an RN capture telling — none at master), its venue and captor COPIED from that record (RULINGS-P6 D.1); at master only a roads hostage has a home call ''' + R2 + r'''OP-r1-1] |
| OD-OP-33 | THE CHAMPION GOES TO THE CELLS: `answer_call` on a `captive_held` source walks to `source.venueId` (CH's bracket, the `hunt_body` precedent); the call's settlement stays the home; a bound champion only inside its employer's lands ''' + R2 + r'''OP-V2] |
| OD-OP-34 | ONE POSITIONAL KEY: the carrier's mouthpiece and the freed's lean are keyed by the roster's positional key through the reverse `originRef` read (`rosterKeyOf`); unmappable ⇒ no mouthpiece / the fork falls to `debt` (⛔ S-8, widened) ''' + R2 + r'''OP-V1] |
| OD-OP-23 | THE RESCUE LIGHTS ONLY AFTER ES-2b's CUSTODY WAVE:'''),
# §18 line 14
(r'''13. "Tolle feared Varn had taken its legate: he was a week late from Kell." (SCRUTINY — the landed silence inference on the home's page, its cause the aside [CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2])
''',
 r'''13. "Tolle feared Varn had taken its legate: he was a week late from Kell." (SCRUTINY — the landed silence inference on the home's page, its cause the aside [CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2])
14. "Tolle's spy broke Tolle's envoy out of Varn's cells at occupied Ashford; Varn lays the escape at Tolle's door." (the occupied town's jailer is the occupier — the grievance names Varn, never Ashford ''' + R2 + r'''OP-r1-5 (D.2)])
'''),
(r'''Surface vs scrutiny: lines 1–6 and 8–11 are deeds''',
 r'''Surface vs scrutiny: lines 1–6, 8–11 and 14 are deeds'''),
]
apply(pairs, 'b5')
