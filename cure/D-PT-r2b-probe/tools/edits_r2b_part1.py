# PART 1 — global renames, header/status, §0, §2 (D-PT-r2b)
glob('party_revealed_site', 'party_made_known_site', 6, 'G1 D-ST-r2 route (HOST-r2-19): the reveal deed renamed')
glob('HR:513', 'HR:514', 2, 'G2 HOST-r2-12: host cite re-pointed')
glob('HR:600', 'HR:601', 2, 'G3 HOST-r2-12: host cite re-pointed')
glob('HR:655', 'HR:656', 2, 'G4 HOST-r2-12: host cite re-pointed')
glob('HR:666', 'HR:667', 2, 'G5 HOST-r2-12: host cite re-pointed')
glob('HR:872', 'HR:873', 2, 'G6 HOST-r2-12: host cite re-pointed')

rep(r'''the log is `cure/D-PT-r2.md` (probes `cure/D-PT-r2-probe/`).''',
    r'''the log is `cure/D-PT-r2.md` (probes `cure/D-PT-r2-probe/`). Round 2b (2026-10-18, lane D-PT-r2b, Opus 5.5) disposed in place the SEAMS-r2 / HOST-r2 ids routed to PT and the items `briefs/RULINGS-ROUND2b.md` names for PT, with the same bracket form; the log is `cure/D-PT-r2b.md` (probes `cure/D-PT-r2b-probe/`).''', 'E1 header')

rep(r'''> **Status: COMPILED DRAFT, ROUND 2 DISPOSED (2026-10-18).** Round 2 re-cured''',
    r'''> **Status: COMPILED DRAFT, ROUND 2b DISPOSED (2026-10-18).** Round 2b (lane D-PT-r2b) disposed every id `skeptic/SEAMS-r2.md` and `skeptic/HOST-r2.md` route to PT — SEAMS-r2-6 (THE CORPS' rows: the edge key `u:<unitKey>`, a company as actor and officer), SEAMS-r2-14 (`party_gate`'s ROAD ARM), HOST-r2-12 (the map's site milestones M-SITE-A / M-SITE-F and the priced journey's canon root) — and the items `briefs/RULINGS-ROUND2b.md` names for PT (STOP-PR-2 RULED (a); the corps keyed `u:<unitKey>`; OD-PT-28 ACCEPTED; H16 the map's inbound door, the host's patrol facts out through the window; `site` a WHERE and a subject, never an actor kind), with the rows the sibling lanes routed here (THE SITES' one clearing act and its court-veil word `made_known`; THE PATROLS' WATCH as a riders' detachment) — §21's round-r2b block; no STOP. Round 2 re-cured''', 'E2 status')

rep(r'''| the actor ref `{kind:'party'}` joins by the chair's fold row (`settlement · person · party · menace`, RULINGS §4) | always |''',
    r'''| the actor ref `{kind:'party'}` joins by the chair's fold row (`settlement · person · party · menace`, RULINGS §4) [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 · RULINGS-ROUND2b ADDENDUM ST-r2-14: THE CORPS adds `corps` (`{kind:'corps', id: unitKey}`, CH §16b; RN keys it `u:<unitKey>`) — the fold's SP-4a row at P4; `site` is a WHERE kind and a subject (the `subject` dial), NEVER an actor kind: a site has no mind (ST4)] | always |''', 'E3 §0 actor kinds')

rep(r'''(chair notes items 13–14, as corrected)]''',
    r'''(chair notes items 13–14, as corrected)] [REFINED 2026-10-18 (fp-final r2) — R2b-2: the journey rests on the LANDED carriers alone, never on chair notes items 13–14, whose texts SEAMS-r2-1, SEAMS-r2-3, HOST-r2-1 and HOST-r2-13 contest before P4: the seasonal law is SLOW, NEVER SEVER (`spatial/spatialCost.js :: SLOW_NOT_SEVER_MAX = 6`: winter makes a mountain pass "NEAR-impassable … but NEVER infinite/cut — so a snowed-in town is dear to reach yet still RESCUABLE by spring"), and so is the storm season (`distanceRead.js :: stormSeasonFactor`, internal: "Always ≥ 1 (slow, not sever)"); the party is no army and rides no navy's convoy (W-NAVY's `navalTransit` carries armies), so a sea leg is the lanes' own price]''', 'E4 §0 season/sea REFINED')

rep(r'''the hearing resolver writes the seal's outcome through it; the party doors''',
    r'''the hearing resolver writes the seal's outcome (and a `banned` verdict's `banKeys` row) through it; the party doors''', 'E6a shape 1 writer')

rep(r'''| `presentAt` | `{ settlementId, sinceTick, partySeq }` | DM only (`SET_PRESENCE`) | "the party is here" (PT3) — one of the two inputs of `whereaboutsOf`; its stamp is (`sinceTick`, `partySeq`) |''',
    r'''| `presentAt` | `{ settlementId, sinceTick, partySeq, fromIds? }` | DM only (`SET_PRESENCE`) | "the party is here" (PT3) — one of the two inputs of `whereaboutsOf`; its stamp is (`sinceTick`, `partySeq`); `fromIds` — the settlement ids `whereaboutsOf(party)` named at the moment the DM moved the toggle (the place the move LEFT), written by `SET_PRESENCE` alone, absent on a first toggle or where no known position stood, read by the ROAD ARM of `party_gate` at the next pass (§9.2) [REFINED 2026-10-18 (fp-final r2) — R2b-3: the road arm is "fired by a patrolled traversal of the DM's own move" (PR §8.2), and a move's origin was overwritten by the toggle; `fromIds` FREE as a field (0 src word or quoted files; two test files use it as a parameter name, another surface — `cure/D-PT-r2b-probe/census-r2b-2.out`)] |''', 'E5 presentAt.fromIds')

ins_after(r'''| `closedRecent` | `[≤ DRAFT 16 { engagementId, kind, actorKey, closedTick, how }]` | the engagement pass | the bounded archive the view reads ("what came of it"); the `allianceCalls` bounded-archive idiom |''',
    r'''
| `banKeys` | `[≤ 8 { settlementId, episode }]` | the hearing resolver, at a `party_banned` verdict `banned` (a key drops when its edge lapses, is pardoned or is lifted) | the banning court's seat EPISODE KEY (PL §2's `seatEpisodeKeyOf`) recorded at each emergent ban's mint — the input of the court's own pardon at a seat change (§9.3), because a landed `ExclusionEdge` carries no mint tick (`npcLedgerFacets.js :: normalizeExclusionEdge` returns `{ settlementId, kind, untilTick }` or `{ settlementId, kind, indefinite: true }`) [REFINED 2026-10-18 (fp-final r2) — R2b-1: §9.3 read `seatChangedSince(…, banTick)` and no record held a ban tick; CH keeps the same key on a paragon's record (`paragon.banKeys`, CH §11, OD-CH-34) — one ban, one lift rule, one sense of the word on two records] |''', 'E6 banKeys row')

ins_after(r'''the party arm owned by PT (CH §11 "owned by PT for the party").''',
    r''' THE KEY GRAMMAR of the widening, which PT declares: `wnpc_…` a person (unchanged) · `party` the party · `u:<unitKey>` a CORPS — a free company carrying the paragon mark (CH §16b; RN §2.2's unit key, RULINGS-ROUND2b SEAMS-r2-6) — whose edges CH writes (the corps arm of its town's gate and its bans, CH §11) through the same writer; a `wnpc_` id never begins with `u:`, so the three keys never meet. [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 (and `cure/D-CH-r2b.md` §5 item 2): CH's corps arm reads "the edge keyed by that ref (PT's actor-ref widening's `corps` arm; until it lands a corps carries no edge …)"; the arm is the key `u:<unitKey>`, at zero host lines (the writers key by any string), lit only with CH's corps and WC-10 and, like every edge write, `npcConsequencesEnabled`.]''', 'E7a shape 3 key grammar')

rep(r'''Every landed reader looks edges up by key, so a `party` key is never read as a person (pinned).''',
    r'''Every landed reader looks edges up by key, so neither a `party` key nor a `u:` key is ever read as a person (pinned).''', 'E7b shape 3 pin')

rep(r'''  actor: actorRef,    // { kind: 'settlement', id } (a court) · { kind: 'person', id: 'wnpc_…' } (a paragon, a renowned voice — persons lit)''',
    r'''  actor: actorRef,    // { kind: 'settlement', id } (a court) · { kind: 'person', id: 'wnpc_…' } (a paragon, a renowned voice — persons lit) · { kind: 'corps', id: unitKey } (a free company carrying the paragon mark, its own visit — CH §16b, WC-10)''', 'E8a engagement actor')

rep(r'''  officer?,           // RN's actingOfficer key and office (the WATCH, the BENCH …) — who makes the act; a bound paragon carrying its employer's act''',
    r'''  officer?,           // RN's actingOfficer key and office (the WATCH, the BENCH …) — who makes the act; a bound paragon carrying its employer's act (a retained corps by RN's `u:<unitKey>`); with THE PATROLS lit, the WATCH on a road is a detachment of the court's riders (PR19)''', 'E8b engagement officer')

rep(r'''  where,              // { kind: 'settlement' | 'road' | 'country', ids } — the card's place the map can name (§13, ENC-HL-13)''',
    r'''  where,              // { kind: 'settlement' | 'road' | 'country' | 'site', ids, half? } — the card's place the map can name (§13, ENC-HL-13); a road is PR's ONE STRETCH KEY road{a, b} (ids codepoint-sorted, keyed a␟b), `half` the land holder of the half the card stands on (the road arm); 'site' with THE SITES, a WHERE only''', 'E8c engagement where')

ins_after(r'''[CURED 2026-10-18 (fp-final r2) — PT-V1: `reachedTick` counts only presence after the answer's week · PT-r1-1: the answer carries its stamp.]''',
    r''' [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6: a corps as actor and as officer · SEAMS-r2-14 · RULINGS-ROUND2b STOP-PR-2: the road half on `where` · RULINGS-ROUND2b ADDENDUM ST-r2-14: `site` a WHERE only.]''', 'E8d engagement bracket')

rep(r'''`refused` is a landed literal (34 files) in CH's registered sense [CURED 2026-10-18 (fp-final r1) — PT-r1-13 · SEAMS-r1-5] |''',
    r'''`refused` is a landed literal (34 files) in CH's registered sense [CURED 2026-10-18 (fp-final r1) — PT-r1-13 · SEAMS-r1-5] [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · RULINGS-ROUND2b STOP-PR-2: the SAME words on the road arm — `refused` = turned back on the road, `admitted_under_watch` = let pass under the riders' eye; no new kind and no new word] |''', 'E9 gate verdicts')

rep(r'''· PT-r1-14 (A.4): the two backing kinds mint as corrections.] |''',
    r'''· PT-r1-14 (A.4): the two backing kinds mint as corrections.] [CURED 2026-10-18 (fp-final r2) — `cure/D-ST-r2.md` route (HOST-r2-19's class): the party's hand on a site made known is `party_made_known_site` — THE SITES' court veil is `keptSecret` · `kept_secret` · `made_known` (ST §2.1, §2.3), and the round-2 token's root `revealed` is the map's PARTY secrecy state (ENC-MS-02: "DM only · revealed · discovered"); FREE (0 src · 0 tests · 0 docs, `cure/D-PT-r2b-probe/census-r2b-2.out`)] |''', 'E10 party_event kinds')

rep(r'''· `revealed` — THE SITES' `SITE_STATUS` event (a hidden site made known to the world's courts; the party's hand on it is `party_made_known_site`) is never the host's reveal of the players' KNOWN PLACES (ENC-HS-01) ·''',
    r'''· `revealed` — never a PT token: it is the map's PARTY secrecy state (ENC-MS-02: "DM only · revealed · discovered") and the host's reveal of the players' KNOWN PLACES (ENC-HS-01); THE SITES' court veil is `keptSecret` · `kept_secret` · `made_known` (ST §2.1, §2.3; HOST-r2-19), and the party's hand on a site made known is `party_made_known_site` · `u:` — RN's UNIT key for a corps (RN §2.2), and on another surface a landed rate-limit prefix (`supabase/functions/ingest-events/index.ts`, RN's registered homonym); PT cites it as a corps' edge key and mints nothing · `banKeys` — CH's word on a paragon's record and PT's on the party's sub-ledger, ONE sense (the banning court's seat episode key at an emergent ban's mint) ·''', 'E11a homonyms')

rep(r'''· RULINGS-ROUND2 §E (sites: `revealed`).]''',
    r'''· RULINGS-ROUND2 §E (sites: `revealed`).] [CURED 2026-10-18 (fp-final r2) — `cure/D-ST-r2.md` route (HOST-r2-19: `revealed` → `made_known`) · SEAMS-r2-6 (`u:`) · R2b-1 (`banKeys`).]''', 'E11b homonyms bracket')
