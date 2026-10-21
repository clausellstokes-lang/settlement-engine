from lib import apply
R2 = '[CURED 2026-10-20 (fp-final P6 r2) — '
pairs = [
# §2.1 deposit false_word row
(r'''| `false_word` | `carrierNpcId · senderId · audienceId · face ('covert'|'declared') · depositTick` —''',
 r'''| `false_word` | `carrierNpcId · senderId · audienceId · face ('covert'|'declared') · depositTick` — `carrierNpcId` is the carrier's D-2 POSITIONAL key, mapped at the deposit by `rosterKeyOf` (§2.5), never the errand's durable `wnpc_` id, and ABSENT for a `covert` face or a carrier the reverse read cannot map (then no mouthpiece: the court's weight alone) ''' + R2 + r'''OP-V1]; '''),
# §2.5 opportunitiesAt: the rung toward the jailer
(r'''how the town receives the traveller's court's man (the truth rung home → this town, the catch law's own read),''',
 r'''how each hold's JAILER receives the traveller's court's man (the truth rung home → `jailerOf(hold)` — the town's own court, or the occupier whose watch keeps an occupied town's cells — the catch law's own read) ''' + R2 + r'''OP-r1-5 (D.2)],'''),
# §2.5 detourCandidates: carried hold + n4
(r'''its court's own man held there as a ROADS hostage (the ransom its court pays names the captor); for an envoy with a declared margin, a town of an ally its departure picture names.''',
 r'''its court's own man held there, as its court had been TOLD by the errand's `departedTick` (OP3 (b): a ROADS ransom its court pays names the captor; a persisted ransom DEMAND arrived — WR-7d, none at master; a capture telling arrived — RN's row, none at master) ''' + R2 + r'''OP-r1-1 (D.1)]; for an envoy with a declared margin, a town of an ALLY of its court by the court's OWN pacts at `departedTick` (a court knows its own pacts — CH §14 road (a); the ally's NEED is read by presence on arrival) — the departure picture names no ally (`ENVOY_PICTURE_FIELDS` = `storesBand · strengthBand · moraleExhaustionBand · foundingCauseStatus · believedRatioBand`) ''' + R2 + r'''n4].'''),
# §2.5 new reads, before rescueMotiveOf
(r'''- `rescueMotiveOf(worldState, rescuerCourtId, captive, captiveHomeId, tick) → { motive, takeReason }`''',
 r'''- `jailerOf(worldState, hold) → courtId` — THE COURT WHOSE CELLS HOLD THE CAPTIVE (RULINGS-P6 D.2): for a foreign-guest hold, `captorId` where the held errand's `encounter.venueRef.kind` is `occupied_enemy_settlement` (`legalEncounterVenue` mints that kind only when the town's occupier is the interceptor — the cells are the occupier's, the town's own court is the captor's enemy); the venue's own court for `allied_hall` (the captor's own hall, or an ally's that keeps him for it) and for `host_settlement` (the town whose watch took him, once ES-2b opens it); for a roads hostage, its `captorId` (held in the captor's own town). Every read that names the court whose cells are broken — the admission rung (§4.3), the catch law's `hostRung` (§5.2), the caught rescuer's `captorId` (§5.3), the grievance (§6.3) and the unwitnessed blame (§6.4) — reads THIS court, never the venue's own court by default. TRUTH (presence: the one standing there sees whose watch keeps the cells). ''' + R2 + r'''OP-r1-5 (the verifier's fail)]
- `rosterKeyOf(worldState, wnpcId) → string | null` — THE POSITIONAL KEY of a durable person in its home roster, `${originRef.settlementId}:${originRef.rosterId}` (`npcAgency.js :: npcId`'s shape, the key D-2's credibility and mouthpiece and the corruption web's leans use), read through the ledger's `originRef` IN REVERSE exactly as `livedExperienceSources.js :: subjectByDurableId` reads it ("BOTH halves must agree" — the roster row's id AND name); `null` where no roster row answers (an introduced paragon, a renamed or re-rolled slot). One read for BOTH the carrier's mouthpiece (§7.1) and the freed's lean (§6.2); ⛔ S-8 (widened). TRUTH of the record. ''' + R2 + r'''OP-V1]
- `rescueMotiveOf(worldState, rescuerCourtId, captive, captiveHomeId, tick) → { motive, takeReason }`'''),
# §3.3 n3
(r'''It replaces the not-yet-walked outbound legs, keeps the walked ones and the return legs, and writes the aside mark''',
 r'''It replaces the not-yet-walked outbound legs, keeps the walked ones (a `travelling` row carries no return legs yet — `normalizeErrand` refuses one that does, `returning.length && state === 'travelling'` ⇒ null; the return is planned at `beginEnvoyReturn`) ''' + R2 + r'''n3], and writes the aside mark'''),
# §3.3 who may detour: the paragon
(r'''a paragon by CH's own aim (§9 — CH's mover, never this verb); never toward the party (OP13).''',
 r'''a paragon by CH's own aim (§9 — CH's mover, never this verb; a paragon reaches this verb only on CH's `court_errand`, which waits on the owner's errand-row slot, CH §4.2) [REFINED 2026-10-20 (fp-final P6 r2) — RULINGS-P6 A.3's "paragons on an aim" among errand rows read as CH's `court_errand` once its row exists; MG §0.2's "(envoys, operatives, a paragon on an aim)" ROUTED to MG for the same reading]; never toward the party (OP13).'''),
# §4.3 header n2
(r'''### 4.3 Who may be rescued by whom (the admission rule, in the rescuer court's BELIEF)''',
 r'''### 4.3 Who may be rescued by whom (the admission rule — presence, and the JAILER's truth rung) ''' + R2 + r'''n2: the header said BELIEF; the body is presence and truth]'''),
# §4.3 body: jailer
(r'''The VENUE town — where the cells are — must sit at a T4 rung (`ROADS_TUNING.T4_RUNG`: rival · cold war · hostile) toward the rescuer's court IN TRUTH at the arrival tick: presence, and the very rung the catch law reads (`gauntletCatchFactors`: home → the venue town) — the catch law's friend rule (OP10)''',
 r'''The JAILER — the court whose cells hold the captive (`jailerOf`, §2.5: the venue's own court; the OCCUPIER in an `occupied_enemy_settlement`) — must sit at a T4 rung (`ROADS_TUNING.T4_RUNG`: rival · cold war · hostile) toward the rescuer's court IN TRUTH at the arrival tick: presence, and the very rung the catch law reads (`gauntletCatchFactors`' `hostRung`, re-read home → the jailer) — the catch law's friend rule (OP10) ''' + R2 + r'''OP-r1-5 (D.2): in an occupied town the venue's own court is the captor's enemy — perhaps the rescuer's friend, or the rescuer itself — so a breakout from the hostile occupier was refused by the friend rule, or aggrieved the occupied victim; the cells are the occupier's]'''),
(r'''the CAPTOR is the hold's `captorId`, named apart);''',
 r'''the CAPTOR is the hold's `captorId`, named apart — and IS the jailer in an occupied town);'''),
# §4.4 n1
(r'''the nature (a lawful carrier never lies, a cautious spy rarely acts)''',
 r'''the nature (a lawful-GOOD carrier never lies — restraint fades with malice; a cautious spy rarely acts) ''' + R2 + r'''n1]'''),
(r'''"she chose it: her own court's envoy was held there, and the errand could spare the week"''',
 r'''"she chose it: her own court's envoy was held there, and she took the week's lateness for him" ''' + R2 + r'''n1: at master no errand can spare a week (OP6)]'''),
# §5.1 jailer on the card; the rung re-read
(r'''or the venue no longer at a T4 rung toward the traveller's court) mints no card''',
 r'''or the jailer no longer at a T4 rung toward the traveller's court) mints no card'''),
(r'''the CAPTOR named on the card apart from the venue, the rescuer's errand held that week''',
 r'''the JAILER (`jailerOf`) and the CAPTOR named on the card apart from the venue ''' + R2 + r'''OP-r1-5 (D.2)], the rescuer's errand held that week'''),
# §5.2 hostRung
(r'''The friend rule holds (OP10): `hostRung` is the TRUTH rung of the rescuer's home toward the VENUE town (`gauntletCatchFactors`), the admission read that same rung at that same climax tick''',
 r'''The friend rule holds (OP10): `hostRung` is the TRUTH rung of the rescuer's home toward the JAILER (`jailerOf` — the factors are `gauntletCatchFactors`' over the venue town, its watch, law, porosity and underways, with this ONE field re-read home → the jailer; byte-equal to the landed read wherever the jailer is the venue's own court, and no line of the gauntlet changes) ''' + R2 + r'''OP-r1-5 (D.2)], the admission read that same rung at that same climax tick'''),
# §5.3 caught: captorId the jailer
(r'''`openForeignGuestHold({ hold: { cause: 'caught_spying', captorId: <the venue's court>, venueId: <the venue town>, … } })`''',
 r'''`openForeignGuestHold({ hold: { cause: 'caught_spying', captorId: <the JAILER>, venueId: <the venue town>, … } })` — in an occupied town it is the occupier's watch that takes him, so ES-2b's court-carried encounter there carries the occupier as its actor and `legalEncounterVenue` takes its occupied arm (ROUTED ES: confirm) ''' + R2 + r'''OP-r1-5 (D.2)]'''),
(r'''(c) The captor learns who sent the rescuer (the hold names its errand's home): `breakout_exposed` on the captor ↔ rescuer's court (§6.3).''',
 r'''(c) The JAILER learns who sent the rescuer (the hold names its errand's home): `breakout_exposed` on the jailer ↔ rescuer's court (§6.3) ''' + R2 + r'''OP-r1-5 (D.2)].'''),
]
apply(pairs, 'b2')
