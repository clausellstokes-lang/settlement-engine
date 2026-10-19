# PART 3 — §13–§21 (D-PT-r2b)
rep(r'''for a paragon on a leg, its leg's origin; for a pledge, the requester's town.''',
    r'''for a paragon on a leg, its leg's origin; for a pledge, the requester's town; for `party_gate`'s road arm, the noticing court's town.''', 'E22a §13 anchor')

rep(r'''from the closed list `settlement · road(a, b) · country(a)` — `road` and `country` are MN's `MENACE_WHERE_KINDS` words (MN §2.4: `country · road`), `settlement` the registry's plain place — plus `site` (`{kind:'site', id}`, ST's widening) when THE SITES lands (§4's sites bracket); `border_segment` is never PT's.''',
    r'''from the closed list `settlement · road{a, b} · country(a)` — `road` and `country` are MN's `MENACE_WHERE_KINDS` words (MN §2.4: `country · road`), `settlement` the registry's plain place; `road{a, b}` is PR's ONE STRETCH KEY (unordered, keyed `a␟b`; a HALF is the part on one holder's land, cut at the digest gate — PR §2.2; the fold's WHERE companion adopts it at P4), and a party card on a road names the whole road except `party_gate`'s road arm, which names the riders' half — plus `site` (`ENGAGEMENT_WHERE_KINDS`' `site`, the site on the `subject` dial: a WHERE and a subject, never an actor kind) when THE SITES lands (§4's sites bracket); `border_segment` is never PT's. [REFINED 2026-10-18 (fp-final r2) — R2b-5: PT's `road(a, b)` is read as PR's ONE STRETCH KEY, as MN reads its own (MN §2.4: "the fold's `road{a,b}` when P4 writes it"; SEAMS-r2-8's key, routed to PR, PS and the fold) · RULINGS-ROUND2b ADDENDUM ST-r2-14.]''', 'E22b §13 place list')

rep_region(r'''**Patrols considered** [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E; THE PATROLS''',
    r'''Patrols stay map-only until the host lights them and opens H16 (PR item 18).''',
    r'''**Patrols considered** [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E; THE PATROLS (`DESIGN_FP_ARCH_PR.md`) PR8, PR19, §9.3, OD-PR-14/16, items 5, 13, 15, 18] [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · RULINGS-ROUND2b STOP-PR-2 (RULED (a)) · `cure/D-PR-r2.md` route PR-r2-13 · RULINGS-ROUND2b HOST-r2-5 (`cure/D-PL-r2b.md` §5 item 3; `cure/D-PR-r2.md` §5): the line said "until it is ruled a patrol never engages the party" and "opens H16"]: riders meet the party only through PT's own kinds — `party_gate`'s ROAD ARM (§9.2: a third court's riders who noticed the party on the road the DM's move crossed; CH's words; no new kind) and the WATCH of `party_warrant` · `party_ambush`, which on a road IS a detachment of the court's riders (PR19; §7.3); PR registers no party kind, and riders never seek the party of their own accord (PR19: "THE PARTY IS NEVER THE ENGINE'S TARGET"). Fault never reads patrols — a ridden road slows no journey (§8.3). A patrol's look that finds the party's traces reads the deed's VISIBLE parts (§11.1), never the deed. PR's `believedWatch` is a court's belief, never the DM's read of the party (the DM sees all, §16's veil row), so PT consumes it nowhere. Patrols stay a map-only picture until the host's PR lights; then the host's patrol facts go OUT through the events window (H9) and the lens window (H23), like every other host fact (PR14, PR §13), and H16 — the map's INBOUND door, which the host never consumes — stays untouched (RULINGS-ROUND2b HOST-r2-5).''', 'E21 §13 patrols line')

rep(r'''| STANDING | `road(court, first hop toward the party's last-heard place)` | as above |''',
    r'''| STANDING | `road{court, first hop toward the party's last-heard place}` (the whole road) | as above |''', 'E22c hunted WHERE')

rep(r'''| STANDING | `road(actor's town, the party's town)` when the two are neighbours, else `country(actor's town)` | as above |''',
    r'''| STANDING | `road{actor's town, the party's town}` (the whole road) when the two are neighbours, else `country(actor's town)` | as above |''', 'E22d ambush WHERE')

rep(r'''| `party_gate` | the party's arrival (the DM's toggle moving into the town); again only if the posture changes while it stays | `admitted · refused · admitted_under_watch · struck` (CH's town's-gate words) | CH's `gateDefault` for `{kind:'party'}` (§9.2); a plain admission is not heard | CLIMAX | `settlement` — the town's gate |''',
    r'''| `party_gate` | the party's arrival (the DM's toggle moving into the town); again only if the posture changes while it stays; THE ROAD ARM (THE PATROLS lit): the week of the DM's move, at most one card per move (§9.2) | `admitted · refused · admitted_under_watch · struck` (CH's town's-gate words, on the road too) | CH's `gateDefault` for `{kind:'party'}` (§9.2) — on the road, the noticing court's; a plain admission is not heard | CLIMAX | `settlement` — the town's gate · `road{a, b}` — the half the riders stood on (the road arm) |''', 'E22e gate registry row')

rep(r'''CH's flags for `party_visit`; RN's `renownLeansEnabled` (+ persons) for `party_voiced`; IN's (C1) for `party_slander` |''',
    r'''CH's flags for `party_visit` (a company's visit: `paragonCorpsEnabled` with WC-10); RN's `renownLeansEnabled` (+ persons) for `party_voiced`; IN's (C1) for `party_slander`; PR's `patrolsEnabled` (C16) for `party_gate`'s road arm and the riders' WATCH [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 · STOP-PR-2] |''', 'E23 §14 host flags')

rep(r'''on a map-module world the canon is born with the campaign whatever its tier (H22), the priced journey (§8.3) is then the default''',
    r'''on a map-module world the canon is born with the campaign whatever its tier (H22, once its canon root lands — §8.3), the priced journey (§8.3) is then the default''', 'E17 §14 paid tier canon root')

rep(r'''| PT-6 | the town's gate, bans, summons → warrant → bounty → hunted, ambush, slander's card | `engagementKinds` rows · CH's `gateDefault` · `BAN_PARTY` / `PARDON_PARTY` on the one edge writer (`npcLedger` 0) | the town's-gate card the week the party arrives | bans `npcConsequencesEnabled`; slander C1 (PT-S2); `hearingWeekEnabled` for the pause | the town's gate by regard alone |''',
    r'''| PT-6 | the town's gate and its road arm, bans (with `banKeys`), summons → warrant → bounty → hunted, ambush, slander's card | `engagementKinds` rows · CH's `gateDefault` · PR's `patrolEncounter` for the road arm (a read; 0 host lines) · `BAN_PARTY` / `PARDON_PARTY` on the one edge writer (`npcLedger` 0) | the town's-gate card the week the party arrives; the road card the week of a patrolled move | bans `npcConsequencesEnabled`; slander C1 (PT-S2); the road arm and the riders' WATCH `patrolsEnabled` (C16, after C15); `hearingWeekEnabled` for the pause | the town's gate by regard alone; no road card |''', 'E24 §15 PT-6')

rep(r'''| the party's exclusion edges (key `party`) |''',
    r'''| the party's exclusion edges (key `party`; the widening's key grammar also carries a corps' `u:<unitKey>`, which CH writes) |''', 'E25a §16 header')

rep(r'''| create | the DM verbs; the engagement pass; the hearing resolver (the seal's outcome); the party doors (`partySeq`; the credibility holder's first charge) |''',
    r'''| create | the DM verbs (`SET_PRESENCE` writes `presentAt.fromIds` with the toggle); the engagement pass; the hearing resolver (the seal's outcome; a `banned` verdict's `banKeys` row); the party doors (`partySeq`; the credibility holder's first charge) |''', 'E25b §16 create')

rep(r'''pruned at the landed `PRUNE_EPSILON`; `partySeq` stored |''',
    r'''pruned at the landed `PRUNE_EPSILON`; `partySeq` stored; `presentAt.fromIds` and `banKeys` stored, each drop-when-absent |''', 'E25c §16 persist')

rep(r'''`party` is never read as a person (every landed reader looks up by key — pinned) |''',
    r'''neither `party` nor a corps' `u:<unitKey>` is ever read as a person (every landed reader looks up by key — pinned) |''', 'E25d §16 migrate')

rep(r'''`partySeq` one integer | RN's (append-only; OD-RN-14) |''',
    r'''`partySeq` one integer; ≤ 8 `banKeys`, each dropped with its edge | RN's (append-only; OD-RN-14) |''', 'E25e §16 horizon')

rep(r'''· the verifier's carries (`MARK_DEED` after mint; a destroyed need's town).]''',
    r'''· the verifier's carries (`MARK_DEED` after mint; a destroyed need's town).] [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 (the `u:` key) · R2b-1 (`banKeys`) · R2b-3 (`fromIds`).]''', 'E25f §16 bracket')

rep(r'''| P41 | DARK until THE SITES: the party clears a band from a ruin (ST's S8) | one `party_event` deed `party_cleared_site` beside the DM's `SITE_HOLDER` act the same week; read as relief; no hearing about the party |''',
    r'''| P41 | DARK until THE SITES: the party clears a band from a ruin (ST's S8) — the DM records `RECORD_CLEARING(ruin)` | ONE act: a `party_cleared_site` deed and ST's `cleared` event (`causedBy` the deed, holder none) in one call, one undo reversing both; a DM who also records `SITE_HOLDER` that week writes one `cleared` (ST's idempotence); read as relief; no hearing about the party |''', 'E26a P41')

rep(r'''the undo receipt says so (OD-PT-28) |''',
    r'''the undo receipt says so (OD-PT-28, ACCEPTED — RULINGS-ROUND2b) |''', 'E26b P42')

ins_after(r'''the undo receipt says so (OD-PT-28, ACCEPTED — RULINGS-ROUND2b) |''',
    r'''
| P43 | THE PARTY ON A WATCHED ROAD (PR and engagements lit): the DM moves the party from Kell to Tolle; the cheapest land road crosses Ashford's land, where Ashford's riders stand that week and Ashford's watch regards the party at `mistrust` | the encounter runs once per power on each half; if noticed, ONE `party_gate` card at `road{a, b}` on Ashford's half, default `admitted_under_watch`, anchored on Ashford; Kell's and Tolle's own riders mint no road card (Tolle's town's gate hears its posture once, at arrival); with no warrant and no ambush no rider seeks the party; with `patrolsEnabled` dark, no road card (PR R33's twin) |
| P44 | THE CORPS (persons, CH's corps and WC-10 lit): Kell's BENCH bans the Grey Company; later the company, unretained, chooses `visit_party`, and the DM records the meeting | the edge is written under `u:<unitKey>` by the one writer (no host line); no projection lists `u:` or `party` as a person; the visit card's actor is `{kind:'corps', id: unitKey}`; `RECORD_MEETING` mints `met_in_person` with the company as its target; RN's `met` link keys `u:<unitKey>`, never `c:` |
| P45 | a `party_banned` verdict `banned` at Kell; later the DM changes Kell's ruling power by `CHANGE_RULING_POWER` (a tick-less row) | `banKeys` holds Kell's episode key from the ban's mint; at the next weekly pass `seatChangedSince(Kell, episode).changed === true`, so the windowed edge lapses and its key drops — as CH's paragon bans do (CH S11) |''', 'E26c P43-P45')

rep(r'''· RULINGS-ROUND2 §E (P41).]''',
    r'''· RULINGS-ROUND2 §E (P41).] [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · STOP-PR-2 (P43) · SEAMS-r2-6 (P44) · R2b-1 (P45) · `cure/D-ST-r2.md` route (P41) · OD-PT-28 (P42).]''', 'E26d §17 bracket')

rep(r'''`partySeq` [CURED 2026-10-18 (fp-final r1) — PT-r1-8] [CURED 2026-10-18 (fp-final r2) — PT-r1-8, RULINGS-ROUND2 A.1 · PT-r1-1] |''',
    r'''`partySeq`; `presentAt.fromIds` and `banKeys` [CURED 2026-10-18 (fp-final r1) — PT-r1-8] [CURED 2026-10-18 (fp-final r2) — PT-r1-8, RULINGS-ROUND2 A.1 · PT-r1-1] [REFINED 2026-10-18 (fp-final r2) — R2b-3 · R2b-1, vetoable] |''', 'E27a OD-PT-4')

rep(r'''PT's own `BAN_PARTY` / `PARDON_PARTY` [CURED 2026-10-18 (fp-final r1) — PT-r1-9] |''',
    r'''PT's own `BAN_PARTY` / `PARDON_PARTY`; the widening's key grammar carries a corps' `u:<unitKey>` (CH writes its edges); a court's own pardon reads `banKeys` in PL's exact key form [CURED 2026-10-18 (fp-final r1) — PT-r1-9] [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6] [REFINED 2026-10-18 (fp-final r2) — R2b-1, vetoable] |''', 'E27b OD-PT-6')

rep(r'''each with its WHERE and its TILT [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6 · HOST-r1-6 · PT-r1-30] |''',
    r'''each with its WHERE and its TILT; `party_gate` gains its ROAD ARM, no new kind (OD-PT-32) [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6 · HOST-r1-6 · PT-r1-30] [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · STOP-PR-2] |''', 'E27c OD-PT-10')

rep(r'''PT-S1's producers H12/H15 [CURED 2026-10-18 (fp-final r1) — HOST-r1-3 · HOST-r1-9 · HOST-r1-10] |''',
    r'''PT-S1's producers H12/H15; the site record from M-SITE-A on, its statuses across M-SITE-A and M-SITE-F, the reach-and-reveal path in M-SITE-A; the priced journey's canon root H2 → H7, H5 + H7 + H8 + H12 → H22 [CURED 2026-10-18 (fp-final r1) — HOST-r1-3 · HOST-r1-9 · HOST-r1-10] [CURED 2026-10-18 (fp-final r2) — HOST-r2-12] |''', 'E27d OD-PT-25')

rep_region(r'''| OD-PT-28 | undoing a party-caused RIPPLING event''',
    r'''New capability on a door designed with no undo — not built here |''',
    r'''| OD-PT-28 | undoing a party-caused RIPPLING event (opened by D-PT-r2 from the verifier's carry as THE CHAIR'S DECISION POINT) | RULED — ACCEPTED by the chair (RULINGS-ROUND2b: "PT's OD-PT-28 (undo strikes the deed; the world effects stay, as on master): ACCEPTED and recorded"): the deed is struck and the party impact's world outcomes stand, as on master (`undoToken:null`; the slice snapshots no ripple for a party-caused event); the undo receipt says so. The reversing road D-PT-r2 named (the two relationship kinds through the landed snapshot the slice skips for party-caused events) is NOT adopted: it would be new capability on a door designed with no undo, which is the owner's to ask for — CLOSED with this reason [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b OD-PT-28] |''', 'E27e OD-PT-28')

rep_region(r'''| OD-PT-30 | THE SITES |''',
    r'''— RULINGS-ROUND2 §E] |''',
    r'''| OD-PT-30 | THE SITES | §4's sites bracket: `siteId?` presence; `party_reached_site` (a placing deed) · `party_cleared_site` (ONE act through PT's door, `RECORD_CLEARING`, which calls ST's writer) · `party_made_known_site` (beside the DM's own `SITE_STATUS made_known`); `site` a WHERE and a subject, never an actor kind; a site deed's target the anchor with a `siteId` qualifier; no party kind from ST [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E] [CURED 2026-10-18 (fp-final r2) — `cure/D-ST-r2.md` route (ST-r2-19, HOST-r2-19) · RULINGS-ROUND2b ADDENDUM ST-r2-14] |
| OD-PT-31 | THE CORPS (RULINGS-ROUND2b SEAMS-r2-6; CH §16b) | the widening's key `u:<unitKey>` for a company's edges (CH writes them); a corps as an engagement's actor (its own `visit_party`) or as `officer` (retained, carrying its employer's threat); `RECORD_MEETING` takes a company; RN keys it `u:<unitKey>`, never `c:`; lit only with CH's corps and WC-10 [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6] |
| OD-PT-32 | the party on a watched road (STOP-PR-2, RULED (a) in RULINGS-ROUND2b) | `party_gate`'s ROAD ARM: fired by a patrolled traversal of the DM's own move (`presentAt.fromIds` → the destination; the cheapest land route's halves on PR's ONE STRETCH KEY), PR's `patrolEncounter` once per power, the noticing court's `gateDefault`, at most one road card per move, the origin's and destination's riders never a road card; the WATCH of a warrant or an ambush on a road is a detachment of the court's riders (PR19); `patrolsEnabled` (C16) [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · STOP-PR-2 · `cure/D-PR-r2.md` route PR-r2-13; REFINED (R2b-3 `fromIds`), vetoable] |''', 'E27f OD-PT-30..32')

ins_after(r'''- "Kell's Watch Captain has orders to turn the party away at Kell's gate." *(the town's-gate card; the officer)*''',
    r'''
- "Ashford's riders have orders to turn the party back on the road to Tolle." *(the town's gate's road arm; on scrutiny the half and the officer — STOP-PR-2, RULINGS-ROUND2b)*''', 'E28 §19 line')

rep(r'''`party_gate` "{court}'s Watch Captain has orders to {turn the party away at | watch the party at} {town}'s gate"''',
    r'''`party_gate` "{court}'s Watch Captain has orders to {turn the party away at | watch the party at} {town}'s gate" — on its road arm "{court}'s riders have orders to {turn the party back | watch the party} on the road {from a to b}" [CURED 2026-10-18 (fp-final r2) — STOP-PR-2]''', 'E29 §19b card')

rep(r'''**Round 2 raised NO new STOP** (`cure/D-PT-r2.md` §3); its other halves are listed there (§5).''',
    r'''**Round 2 raised NO new STOP** (`cure/D-PT-r2.md` §3); its other halves are listed there (§5). **Round 2b raised NO new STOP** (`cure/D-PT-r2b.md` §3); STOP-PR-2 and OD-PT-28 are RULED (RULINGS-ROUND2b) and executed.''', 'E30a §20 stops')

rep(r'''· the season and the sea cited, not re-minted (§8.3).''',
    r'''· the season and the sea cited, not re-minted (§8.3). ROUND 2b (`[REFINED 2026-10-18 (fp-final r2) — R2b-…]`): R2b-1 a court's pardon of the party reads `banKeys` in PL's exact key form (CH's rule; one ban, one lift) · R2b-2 the season and the sea rest on the landed law, never on chair notes items 13–14 · R2b-3 `presentAt.fromIds` for the road arm's traversal · R2b-4 the clearing's table verb `RECORD_CLEARING` · R2b-5 PT's road WHERE read as PR's ONE STRETCH KEY.''', 'E30b §20 refined')

rep_region(r'''OPEN FOR THE CHAIR (detail in `cure/D-PT-r2.md` §5–§6):''',
    r'''(RN §7's "a miss the DM marks a lie").''',
    r'''OPEN FOR THE CHAIR (detail in `cure/D-PT-r2b.md` §5–§6): (1) RN's halves of round 2 are CURED in RN's round 2b (`partySeq` named in the deed normalizer; §3.1's `party_event` row narrowed to events that do not ripple; §7's "truth chasing" reader struck — `cure/D-RN-r2b.md` §2), and RN keys the corps `u:<unitKey>`; still RN's: its sites bracket still reads "ST's actor convention gains `site`" (the ADDENDUM's ST-r2-14 withdrew that widening) and its `target` names no `siteId` qualifier (PT's site deeds carry one, §4); (2) the fold's party rows (§3.4 per A.5, A.6, A.13 — its WHERE `road` row gains `party_gate`'s road arm and `party_hunted`, while `party_visit` stays `settlement`, A.13's "PT's placement wins"; §3.3.12 gains `corps` and re-brackets `site` as a WHERE and a subject; §5 tokens incl. `partySeq`, `fromIds`, `banKeys` (CH's sense), `RECORD_CLEARING` and the three site kinds with `party_made_known_site`; §6's C11/C13 chain with RN-3 before PT-1; CHAIR-NOTES item 16 gains PT's corps edge arm); (3) IN's inbox: `plant_taken` skips a plant whose subject is the party; (4) CH names `met_in_person` as the producer of `marks.metParty` (still 0 hits in CH); (5) the reveal of a site as ONE act through PT's door, like the clearing — ST's closed caller list names only the clearing door, so today `party_made_known_site` rides beside the DM's `SITE_STATUS made_known` (a `party` dial on that verb is closed: it already carries four); (6) round 1's two still open: a deed-only upward size bias, and an AMEND `{ lie: true }` on `party_pledge_due` (RN §7's "a miss the DM marks a lie").''', 'E30c §20 open')

rep(r'''| R2-E-patrols | standing | CURED — ONE "patrols considered" line (PR items 5, 13, 15, 18; STOP-PR-2 left to the chair) | §13, §8.3 |''',
    r'''| R2-E-patrols | standing | CURED — ONE "patrols considered" line (PR items 5, 13, 15, 18; STOP-PR-2 left to the chair) [STOP-PR-2 ruled and executed in round 2b] | §13, §8.3 |''', 'E31a r2 patrols row')

rep(r'''| R2-E-host | standing | CURED — plague-R7's quarantine slot at the town's gate; patrols map-only until H16 | §9.2, §13 |''',
    r'''| R2-E-host | standing | CURED — plague-R7's quarantine slot at the town's gate; patrols map-only until H16 [superseded in round 2b: the host's patrol facts go out through the window and H16 stays untouched — RULINGS-ROUND2b HOST-r2-5, §13] | §9.2, §13 |''', 'E31b r2 host row')

ins_after(r'''| R2-E-doctrines | standing | CURED — the owner's doctrines of 2026-10-18 bracketed | §0 |''',
    r'''

### Round r2b (P3 round 2b, 2026-10-18; lane D-PT-r2b, Opus 5.5; inputs: the ids `skeptic/SEAMS-r2.md` and `skeptic/HOST-r2.md` route to PT, the items `briefs/RULINGS-ROUND2b.md` names for PT (with its ADDENDUM), and the rows the sibling round-2 logs route to PT; the log is `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-r2b.md`, probes `cure/D-PT-r2b-probe/`) — 14 ids: 11 CURED · 0 REFUTED · 0 ⛔ STOP · 3 NOTED

| Finding | Sev | Disposition | Where |
|---|---|---|---|
| SEAMS-r2-6 | MAJOR | CURED — THE CORPS' rows on PT's side: the widening's key grammar gains a corps' `u:<unitKey>` (CH writes its edges; zero host lines); a corps may be an engagement's actor (its own `visit_party`) or `officer` (retained); `RECORD_MEETING` takes a company; `corps` on the actor convention, `site` never an actor kind | §0, §2.1 shape 3, §2.2, §2.4, §6, §7.3, §14, §16, P44, OD-PT-6, OD-PT-31 |
| SEAMS-r2-14 | MINOR | CURED — `party_gate`'s ROAD ARM (with CH's road arm for persons): a third court's riders who noticed the party on the road the DM's move crossed; CH's words; at most one road card per move | §9.2, §7.3, §13, §2.2, §2.4, §14, §15, §19, §19b, P43, OD-PT-10, OD-PT-32 |
| HOST-r2-12 | MAJOR | CURED (PT's half) — M-SITE-A cited for the reach and reveal doors (and M-SITE-F for the statuses); the priced journey's canon root H2 → H7, H5 + H7 + H8 + H12 → H22; five host cites re-pointed to the newest document's lines | PT17, §4, §8.3, §14, OD-PT-25 |
| RULINGS-ROUND2b STOP-PR-2 | — | CURED — RULED (a) executed: `party_gate` widened to a road WHERE, no new kind, CH's words unchanged | as SEAMS-r2-14 |
| RULINGS-ROUND2b SEAMS-r2-6 | — | CURED — the corps keyed `u:<unitKey>` in PT's rows | as SEAMS-r2-6 |
| RULINGS-ROUND2b OD-PT-28 | — | CURED — ACCEPTED and recorded: undo strikes the deed, the world effects stay as on master; the reversing road CLOSED (new capability, the owner's to ask for) | §6, OD-PT-28, P42, §20 |
| RULINGS-ROUND2b HOST-r2-5 (`cure/D-PL-r2b.md` §5 item 3; `cure/D-PR-r2.md` §5) | — | CURED — "opens H16" struck: the host's patrol facts go out through the events window (H9) and the lens window (H23); H16, the map's inbound door, untouched | §13, §21 r2 row |
| RULINGS-ROUND2b ADDENDUM ST-r2-14 | — | CURED — `site` is a WHERE kind and a subject, never an actor kind; a site deed's target is the anchor with a `siteId` qualifier | §4 (1)/(3), §0, §2.2, §13, OD-PT-30 |
| `cure/D-ST-r2.md` route (ST-r2-19) | — | CURED — the party's clearing is ONE act through PT's door (`RECORD_CLEARING` → ST's one writer); one undo for both | §4 (2), §6, P41, OD-PT-30 |
| `cure/D-ST-r2.md` route (HOST-r2-19) | — | CURED — the court veil's word: the reveal deed is `party_made_known_site`; `revealed` is never a PT token | §2.4, §3.3, §4, §19b, OD-PT-30 |
| `cure/D-PR-r2.md` route (PR-r2-13) | — | CURED — the WATCH of a warrant or an ambush on a road IS a detachment of the court's riders (PR19); the hearing stays PT's | §7.3, §2.2, §13, OD-PT-32 |
| `cure/D-CH-r2b.md` §5 item 2 | — | NOTED — PT's corps edge arm, cured under SEAMS-r2-6 | §2.1 shape 3 |
| `cure/D-RN-r2b.md` | — | NOTED — RN routes nothing to PT; RN cured PT's three round-2 halves (§20 (1) updated) | §20 |
| the FOLD parenthetical (`cure/D-MN-r2.md`, `cure/D-PT-r2.md` "ROUTE to the chair / fold") | — | NOTED — the fold lane's notes; no PT row | — |

REFINED in round 2b (each marked in place, vetoable): R2b-1 `banKeys` (a court's pardon by PL's exact key form, CH's rule) · R2b-2 the season and the sea on the landed law · R2b-3 `presentAt.fromIds` · R2b-4 `RECORD_CLEARING` · R2b-5 the road WHERE as PR's ONE STRETCH KEY.''', 'E32 §21 r2b block')
