import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
R = []
def rep(old, new):
    R.append((old, new))

# E10 §2.4
rep(r'''RN §2.1/§6.1 cite `kept · broken` as PT's words — RN's half, listed.]''',
r'''RN §2.1/§6.1 cite `kept · broken` as PT's words — RN's half, listed.] [CURED 2026-10-18 (fp-final r2) — PT-r1-16 (RULINGS-ROUND2 A.3): ONE vocabulary, PT's `made_good · fell_short`; RN aligns its §2.1, §3.1, §6.1 and §7, and `broken` stays out of every deed-kind list.]''')
rep(r'''`actAt` · `voidsRef` · `whereaboutsOf` | — | FREE (''',
r'''`actAt` · `partySeq` · `whereaboutsOf` | — | FREE (`partySeq` 0 everywhere, `cure/D-PT-r2-probe/census-r2.out` — round 1's `voidsRef` is struck, A.4; ''')
rep(r'''| `menace_weakened · menace_ended · correction · refused_request · backing_voided · backing_repudiated · met_in_person` + every composer event type that does not ripple |''',
r'''| `menace_weakened · menace_ended · correction · refused_request · backing_voided · backing_repudiated · met_in_person` + every composer event type that does not ripple; with THE SITES, `party_reached_site · party_cleared_site · party_revealed_site` (§4's sites bracket) |''')
rep(r'''were used and not listed).]''',
r'''were used and not listed).] [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E (sites): `party_reached_site` is ST's minted token for ENC-HL-04's event, registered as PT's kind; `party_cleared_site` and `party_revealed_site` are FREE (0 everywhere, `cure/D-PT-r2-probe/census-r2.out`, `census-r2-quoted.out`) · PT-r1-14 (A.4): the two backing kinds mint as corrections.]''')
rep(r'''· `lens` — never a PT word (the map's layers; RN's two readings) ·''',
r'''· `lens` — never a PT code token and never a DM-facing word (the map's layers); "lens one" and "lens two" are RN's design prose for a deed's two readings (RN §2.4's homonym note), used here only in that sense · `revealed` — THE SITES' `SITE_STATUS` event (a hidden site made known to the world's courts; the party's hand on it is `party_revealed_site`) is never the host's reveal of the players' KNOWN PLACES (ENC-HS-01) ·''')
rep(r'''· L-FOLD's census (`presentAt`, `spoken`/`unspoken`).]''',
r'''· L-FOLD's census (`presentAt`, `spoken`/`unspoken`).] [CURED 2026-10-18 (fp-final r2) — the verifier's carry ("`lens` — never a PT word" against six uses of "lens one/two") · RULINGS-ROUND2 §E (sites: `revealed`).]''')

# E11 §3.1 stamp
rep(r'''

**ONE ACT, ONE DEED** (RULINGS-ROUND1 PT-r1-3, SEAMS-r1-8):''',
r'''

**THE STAMP** (PT3): every deed whose doer is the party takes the next `partySeq` from the sub-ledger at mint, through `partyLedger.js` (the one writer), whichever door mints it; `SET_PRESENCE` and `ANSWER_ENGAGEMENT` take theirs the same way. The `backing_voided` / `backing_repudiated` resolutions mint as CORRECTIONS of the backed deed (`correctsRef`, RULINGS-ROUND2 A.4; §10.3). [CURED 2026-10-18 (fp-final r2) — PT-r1-1 (B) · PT-r1-14 (A.4).]

**ONE ACT, ONE DEED** (RULINGS-ROUND1 PT-r1-3, SEAMS-r1-8):''')

# E12 §3.3
rep(r'''the rows PT REGISTERS into RN's table (RN derives; RN §6.1's registration door; DRAFT, UNMEASURED, on the FP-46 roster)''',
r'''the rows PT REGISTERS into RN's table (RN derives; RN §6.1's registration door, which RN-3 opens — PT registers at RN-3's unit, §15; DRAFT, UNMEASURED, on the FP-46 roster)''')
rep(r'''· `backing_voided` / `backing_repudiated` read 0.5 · 0.5 · 0.5 (no moral content; their effect is the backing's withdrawal, §10.3) ·''',
r'''· `backing_voided` / `backing_repudiated` have NO row: each is a CORRECTION of the backed deed (`correctsRef`; RULINGS-ROUND2 A.4), read wherever it is heard as the ORIGINAL deed with its backing part masked — RN's one re-read of a correction (RN §3.3, §5.1), never a re-read of PT's own · a later `MARK_DEED` is a `correction` carrying the revised marks, read as the original with them (§6) · with THE SITES, `party_cleared_site` reads `resolve_stressor`'s row when the holder driven out was an untied band or a menace (relief), else AMBIGUOUS; `party_revealed_site` has no row (it informs: neutral); `party_reached_site` has no value (a placing deed) ·''')
rep(r'''· `met_in_person` has no value (RN reads it as the cause `met`).''',
r'''· `met_in_person` has no value (RN reads it as the cause `met`). [CURED 2026-10-18 (fp-final r2) — PT-r1-14 (A.4) · the verifier's carry on `MARK_DEED` · RULINGS-ROUND2 §E (sites).]''')

# E13 §4
rep(r'''`lastHeardOf` is DERIVED: the newest unstruck placing deed, so a strike, an unstrike or a source event's undo moves it back exactly. `whereaboutsOf(party)` is the later of `presentAt.sinceTick` and that deed's tick, with its source (`toggle` · `word`); the DM's toggle wins on a tie.''',
r'''`lastHeardOf` is DERIVED: the newest unstruck placing deed by (tick, `partySeq`), so a strike, an unstrike or a source event's undo moves it back exactly. `whereaboutsOf(party)` is whichever of the toggle and that deed carries the LATER STAMP — (tick, `partySeq`), PT3 — with its source (`toggle` · `word`); a same-tick tie no sequence settles goes to the deed (RULINGS-ROUND2 B).''')
rep(r'''once the owner's world-site record lands, `presentAt` gains a `site` arm and `SET_PRESENCE` at a site is ENC-HL-04's "the party reached a place" event, PT its producer;''',
r'''once the owner's world-site record lands, `presentAt` gains a `site` arm and `SET_PRESENCE` at a site is ENC-HL-04's "the party reached a place" event, PT its producer (the sites bracket below);''')
rep(r'''· PT-r1-26 · PT-r1-29 · HOST-r1-3 · HOST-r1-9.]''',
r'''· PT-r1-26 · PT-r1-29 · HOST-r1-3 · HOST-r1-9.] [CURED 2026-10-18 (fp-final r2) — PT-r1-1 (RULINGS-ROUND2 B).]

**Sites considered** [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E; THE SITES (`DESIGN_FP_ARCH_ST.md`) coverage row for PT: "BY THE SITE READ — presence at a site, reach and reveal doors, clearing deeds"]: when THE SITES lands (ST-4, `worldSitesEnabled`), (1) `presentAt` gains `siteId?` additively and `SET_PRESENCE` at a site mints the placing `party_event` deed `party_reached_site` (ST's token for ENC-HL-04's event; `actAt` the site's anchor settlement, the site on the deed's target as `{kind:'site', id}`), so `lastHeard`, the journey and the champions' visits read the site through its anchor; (2) the party clearing a den, or revealing a hidden site, is a `party_event` deed — `party_cleared_site` · `party_revealed_site` — recorded beside the DM's own `SITE_HOLDER` / `SITE_STATUS revealed` act in the same week (the DM's act changes the world; the deed carries the renown — ST's S8), each with its §3.3 row; (3) every PT card's WHERE may be `site` by ST's widening of the actor convention (`settlement · person · party · menace · site`), the proposals' anchor still a real settlement; (4) no ST kind is a party kind and no PT kind targets a site — a den on the road is a fact of the world, never a call aimed at the party (ST16); (5) ST's `revealed` is never the host's reveal of the players' known places (§2.4). The three deeds' telling subjects register in PT's commit at ST-4 (§19b).''')

# E14 §5
rep(r'''its credibility (`partyCredibilityOf`, and per town `partyCredibilityAt`, both derived from the party's pledge deeds — §2.1)''',
r'''its credibility (`partyCredibilityOf`, RN §7's PERSISTED holder on PT's sub-ledger — RULINGS-ROUND2 A.1 — and per town `partyCredibilityAt`, the same law over the pledge deeds that town heard — §2.1)''')
rep(r'''PT-r1-20: the kingdom was missing from the owner's list · PT-r1-8.]''',
r'''PT-r1-20: the kingdom was missing from the owner's list · PT-r1-8.] [CURED 2026-10-18 (fp-final r2) — PT-r1-8 (A.1).]''')

# E16 §6
rep(r'''`MARK_DEED(deedId, { backing | moralWeight | proof })` ·''',
r'''`MARK_DEED(deedId, { backing | moralWeight | proof })` (on the act's own card the marks are part of the act and mint with it; on a deed already minted it mints a `correction` deed — `correctsRef` the deed — carrying the revised marks, so the deed is never rewritten (RN2: "APPEND-ONLY … never rewritten") and the revised word travels as the truth does, read wherever it is heard as the original with the corrected marks (§11.2; RN §3.3's one re-read); the DM's own view shows the revised marks at once; to unsay a mark everywhere at once the DM strikes the deed and records the act again) ·''')
rep(r'''Undoing `ANSWER_ENGAGEMENT` unwinds its pledge, strikes its deed and any `party_pledge` deed it led to — and because the party's credibility and `lastHeard` are DERIVED from unstruck deeds (§2.1), both fall back exactly. Undoing the authored event a deed came from strikes that deed (§3.4). A strike survives reload (it is world state). `BAN_PARTY`'s inverse lifts exactly the edges it wrote. [CURED 2026-10-18 (fp-final r1) — PT-r1-7 · PT-r1-8.]''',
r'''Undoing `ANSWER_ENGAGEMENT` unwinds its pledge, strikes its deed and any `party_pledge` deed it led to; `lastHeard`, derived from unstruck deeds, falls back exactly, and the party door RE-FOLDS the persisted credibility holder from the unstruck deeds (§2.1), so it falls back exactly too. RN's `STRIKE_DEED` / `UNSTRIKE_DEED` on a party pledge deed or an exposure are followed, in the same act, by that re-fold (the party door's hook on RN's verb — RN's half, listed). Undoing the authored event a deed came from strikes that deed (§3.4) — but what a RIPPLING party impact did to the world stands, as it does on master: the landed party door has no undo (`undoToken:null, undoState:'none'`) and the slice snapshots no ripple for a party-caused event (`settlementSlice.js`: `if (campaign && !event?.partyCaused) {` before `captureCanonRelationshipUndo`); the undo's receipt says so in the world's words ("the party's deed is struck from the record; what it did to Kell stands"), and whether the undo should reverse the impact's outcomes too is OD-PT-28, the chair's. A strike survives reload (it is world state). `BAN_PARTY`'s inverse lifts exactly the edges it wrote. [CURED 2026-10-18 (fp-final r1) — PT-r1-7 · PT-r1-8.] [CURED 2026-10-18 (fp-final r2) — PT-r1-8 (A.1: the holder persisted, re-folded) · the verifier's carries on `MARK_DEED` (RN2's append-only law) and on the ripple's outcomes (a decision point, OD-PT-28).]''')

# E17 §8.2
rep(r'''A need resolved by others ends the clock with NO fault (the world never waits).''',
r'''A need resolved by others ends the clock with NO fault (the world never waits). The need's TOWN destroyed (`DESTROY_SETTLEMENT`) or deleted ends the clock that week — the worst end, judged like any other (§8.6: reached in time, a reachable miss, or never reachable), never a free close [CURED 2026-10-18 (fp-final r2) — the verifier's carry: §16 closed such a pledge "with no cost", so a reachable miss on the worst outcome was free].''')

# E18 §8.3
rep(r'''(RULINGS-ROUND1 PT-r1-1) · PT-r1-29 · HOST-r1-2.]''',
r'''(RULINGS-ROUND1 PT-r1-1) · PT-r1-29 · HOST-r1-2.] The SEASON and the SEA are already in the books and PT mints neither: `pathCost(digest, fromId, toId, season)` prices the digest's frozen seasonal overlay (SEASONS-B M3) and TRADE M8's sea lanes with their storm-season law, byte-identical where a digest carries neither; the journey passes the world's season at the evaluation tick, so a winter pass or a storm season lengthens the fastest journey and fault is judged on that (chair notes items 13–14). A ridden road slows no journey: THE PATROLS never enter fault (§13's patrols line). [REFINED 2026-10-18 (fp-final r2) — the `season` argument was named and never fed; weather and the sea are cited, not re-minted.]''')

# E19 §8.6
rep(r'''**`made_good`** if the DM recorded `KEEP_PLEDGE`, or the party REACHED the need in time — `reachedTick ≤ T` (the first week the party's whereabouts named the need's settlement while the pledge stood: the DM's toggle there, or a placing deed there) — or a party deed resolved the need itself (its target is the need's stressor, siege town or war);''',
r'''**`made_good`** if the DM recorded `KEEP_PLEDGE`, or the party REACHED the need in time — `reachedTick ≤ T`, where `reachedTick` is the first weekly evaluation AFTER the answer's tick at which `whereaboutsOf(party)` named the need's settlement (the DM's toggle there, or a placing deed there, as the later stamp): a yes given in the need's own town counts only if the party is still there, or back, when a week has turned (the pass sees a clock end only at an advance, so `T` always falls after the answer's tick) — or a RELIEF deed of the party's met the need after the answer (a later stamp than the answer's; a deed reading `resolve_stressor`'s or `ease_stressor`'s row — §19b's `deed_rescue` set — whose target is the need's stressor, or, for a siege or war need, whose `actAt` is the need's town);''')
rep(r'''never `LIE_FALL` · PT-r1-25.]''',
r'''never `LIE_FALL` · PT-r1-25.] [CURED 2026-10-18 (fp-final r2) — PT-V1: the usual yes is given in the requester's own town (`awaiting` only once co-located; the requester is the court of the call's own settlement), so `reachedTick` was set in the week of the yes and a party that left the next day was `made_good` — the owner's "of the party fails to meet and they accepted it … that is on the reputation" could not fire by default; a deed that merely targets the siege town no longer counts as meeting the need.]''')

for old, new in R:
    c = s.count(old)
    if c != 1:
        print('MISMATCH count=%d for: %s' % (c, old[:120].replace('\n', '\\n')))
        sys.exit(1)
    s = s.replace(old, new)
open(path, 'w', encoding='utf-8').write(s)
print('part2 applied', len(R), 'replacements')
