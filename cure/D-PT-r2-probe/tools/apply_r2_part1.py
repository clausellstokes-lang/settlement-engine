import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
R = []
def rep(old, new):
    R.append((old, new))

# E0/E1 header + status
rep(r'''the log is `cure/D-PT-r1.md` (probes `cure/D-PT-r1-probe/`).

> **Status: COMPILED DRAFT, ROUND 1 DISPOSED (2026-10-18).** Every id of `skeptic/PT-r1.md`''',
r'''the log is `cure/D-PT-r1.md` (probes `cure/D-PT-r1-probe/`). Round 2 (2026-10-18, lane D-PT-r2, Opus 5.5) re-cured the round-1 verifier's fails and disposed its new findings in place: each change carries `[CURED 2026-10-18 (fp-final r2) — <id>: …]`, each refinement `[REFINED 2026-10-18 (fp-final r2) — …]`; the log is `cure/D-PT-r2.md` (probes `cure/D-PT-r2-probe/`).

> **Status: COMPILED DRAFT, ROUND 2 DISPOSED (2026-10-18).** Round 2 re-cured the five fails and disposed the four new findings and nine carries of `skeptic/PT-r1-verify.md` under RULINGS-ROUND2 (A.1 the party's credibility is persisted; A.2 the DM's mark replaces the band for every reader that can see it; A.3 one pledge vocabulary, PT's; A.4 a voided or repudiated backing is a correction; B the whereabouts' later stamp) and applied its §E standing items (sites considered §4, patrols considered §13, the host document's slots, the owner's doctrines of 2026-10-18 §0) — §21's round-r2 block. In round 1 every id of `skeptic/PT-r1.md`''')

# E2 answer paragraph
rep(r'''A told reason carries only what the DM marked: if the DM says the burning was just, those who hear why may believe it, and those who never hear why judge the act alone.''',
r'''A told reason carries only what the DM marked: if the DM says the burning was just, everyone who hears why takes it as just — unless the party's word counts for nothing in their town and nothing was shown — and those who never hear why judge the act alone.''')
rep(r'''the paragraph follows the cured whereabouts, backing, reason, pledge-evidence and voice rules; "the town's gate", never the bare word.]''',
r'''the paragraph follows the cured whereabouts, backing, reason, pledge-evidence and voice rules; "the town's gate", never the bare word.] [CURED 2026-10-18 (fp-final r2) — PT-r1-10 · PT-V2 (RULINGS-ROUND2 A.2): a told reason's mark replaces, it does not lean.]''')

# E3 §0 credibility row
rep(r'''| RN §7's law; a deterministic fold over dated charges, so the party's credibility is DERIVED on read from its pledge deeds (§2.1) [CURED 2026-10-18 (fp-final r1) — PT-r1-8] | — | — | — | CONFIRMED |''',
r'''| RN §7's law and its party holder `spatialLedgers.party.credibility = { score, lastUpdateTick }`, PERSISTED (RULINGS-ROUND2 A.1); the law is a deterministic fold over dated charges — clamped to ±`SCORE_MAX` at each charge, decayed by `halfLifeFactor`, spent past the lookback (`decayedNpcCredibilityScore`: `if (age > T.MAX_LOOKBACK_TICKS) return 0;`) — so the party door RE-FOLDS the holder exactly from the deed ledger after any strike, unstrike or undo (§2.1) [CURED 2026-10-18 (fp-final r1) — PT-r1-8] [CURED 2026-10-18 (fp-final r2) — PT-r1-8 (RULINGS-ROUND2 A.1): "derived" is dropped; the holder is RN §7's, persisted, and the re-fold keeps a strike exact] | — | — | persisted (the party's holder) | CONFIRMED |''')

# E3b §0 hopWeeks row
rep(r'''| the party's fastest journey and the card's distance words (§8) | priced legs need a canonized map; unpriced = one week a hop | 544 · leaf · leaf | derived | CONFIRMED |''',
r'''| the party's fastest journey and the card's distance words (§8); under it `pathCost(digest, fromId, toId, season = null)` already prices the SEASON (the digest's frozen `reserved.seasonalOverlay`, SEASONS-B M3) and the SEA (TRADE M8's `seaLanes` slot with its storm-season law, `stormSeasonFactor`; teleport M9c) — "Dormant (pre-M8/M9c, or a non-modal pair) ⇒ … the land distance EXACTLY" [REFINED 2026-10-18 (fp-final r2) — weather and the sea are already in the books: the party's journey crosses them by the landed law and PT mints neither (chair notes items 13–14, as corrected)] | priced legs need a canonized map; unpriced = one week a hop | 544 · leaf · leaf | derived | CONFIRMED |''')

# E4 §0 doctrines bracket
rep(r'''[CURED 2026-10-18 (fp-final r1) — HOST-r1-2 · HOST-r1-3 · HOST-r1-5 · HOST-r1-6 · HOST-r1-9 · HOST-r1-10: the host document is named as a binding neighbour.]''',
r'''[CURED 2026-10-18 (fp-final r1) — HOST-r1-2 · HOST-r1-3 · HOST-r1-5 · HOST-r1-6 · HOST-r1-9 · HOST-r1-10: the host document is named as a binding neighbour.] [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E: the owner's doctrines of 2026-10-18 bind here. THE WORLD HOSTS THE CAMPAIGN, NEVER COMPETES — the simulation stays indifferent to the party (PT1) and no engagement exists to make the party matter. MACRO OVER MICRO — there is no trial of the party: a summons, a warrant, a bounty or a ban is a hearing card, and what happens to the party happens at the table. NO ENGINE MORTALITY CLOCK — the party's fate and every named person's death are the DM's (PT1, PT6). MEDIEVAL FOR MILLENNIA — no era changes PT's shapes; an advance by N years runs the same defaults year upon year (§13). MENACES NEVER EMERGENT — the party's hand on a menace is MN's dial on the DM's own verbs (§3.1). PURPOSE ONLY BY THE DM — an engagement is an actor's own need or grievance, never a purpose the engine gives the party (ST16 and PR19 say the same).]''')

# E5 PT3
rep(r'''ONE whereabouts read serves everything: `whereaboutsOf(party)` = whichever of `presentAt` and `lastHeard` was set MORE RECENTLY, with its source; the DM's toggle wins whenever it is the later (and on a tie).''',
r'''ONE whereabouts read serves everything: `whereaboutsOf(party)` = whichever of `presentAt` and `lastHeard` carries the LATER STAMP, with its source. A stamp is (tick, `partySeq`): the tick the act was recorded at and the party's own monotone sequence, which every `SET_PRESENCE`, every answer and every party deed takes from the sub-ledger as it is written — so a deed recorded after the toggle in the same session is the later word, and so is a toggle set after that deed; where no sequence distinguishes two stamps of one tick, the deed wins (RULINGS-ROUND2 B: "the deed is the newer fact").''')
rep(r'''· PT-r1-26 (one pair rule; no verb "writes … to `presentAt`").]''',
r'''· PT-r1-26 (one pair rule; no verb "writes … to `presentAt`").] [CURED 2026-10-18 (fp-final r2) — PT-r1-1 (RULINGS-ROUND2 B): a party deed is stamped `const tick = worldState.tick;` (`partyImpact.js :: applyPartyImpact`) and the tick moves only on an advance, so the toggle and every deed of one session shared a tick, and "the toggle on a tie" let the morning's toggle outrank the afternoon's deeds. REFINED on B's letter, vetoable: B's same-tick rule alone would let a deed outrank a toggle the DM set AFTER it in the same session (the party fought in Tolle, then rode to Kell) until a later advance; the party's sequence decides by the order of recording — B's own principle, "the LATER STAMP wins" — and B's same-tick rule stands as the fallback.]''')

# PT4
rep(r'''the subject of RN's party credibility (RN1, RN10), derived on read from the party's pledge deeds (§2.1);''',
r'''the subject of RN's party credibility (RN1, RN10), RN §7's persisted holder on PT's sub-ledger written by the party door (§2.1; RULINGS-ROUND2 A.1);''')
rep(r'''PT-r1-20: the owner's "from NPC's to kingdoms" — the kingdom is a holder · PT-r1-8 · PT-r1-2.]''',
r'''PT-r1-20: the owner's "from NPC's to kingdoms" — the kingdom is a holder · PT-r1-8 · PT-r1-2.] [CURED 2026-10-18 (fp-final r2) — PT-r1-8 (A.1).]''')

# PT6
rep(r'''a backing voided or repudiated (§10.3),''',
r'''a backing voided or repudiated (§10.3; a correction of the backed deed, RULINGS-ROUND2 A.4),''')
rep(r'''· SEAMS-r1-6 · PT-r1-16: the pledge words.]''',
r'''· SEAMS-r1-6 · PT-r1-16: the pledge words.] [CURED 2026-10-18 (fp-final r2) — PT-r1-14 (A.4).]''')

# PT13
rep(r'''The REASON's content is the DM's: where the DM marked a moral weight and a hearer's version shows the reason, the hearer reads the act toward that weight, as far as it believes the teller (§11.3); where the reason never reached it, or was kept quiet, or the DM marked no weight, the hearer judges the act alone.''',
r'''The REASON's content is the DM's: where the DM marked a moral weight, that weight REPLACES the act's derived band for every hearer that can see it — its version shows the reason and it credits the teller (§11.3; RULINGS-ROUND2 A.2); where the reason never reached it, or was kept quiet, or the DM marked no weight, or a merely told reason comes from a party whose word is worth nothing there, the hearer judges the act alone.''')
rep(r'''already implied; vetoable).]

**PT14''',
r'''already implied; vetoable).] [CURED 2026-10-18 (fp-final r2) — PT-r1-10 · PT-V2 (A.2).]

**PT14''')

# E6 shape 1
rep(r'''one writer `src/domain/party/partyLedger.js` (the DM verbs and the engagement pass both write through it; the hearing resolver writes the seal's outcome through it).''',
r'''one writer `src/domain/party/partyLedger.js` (the DM verbs and the engagement pass both write through it; the hearing resolver writes the seal's outcome through it; the party doors write `partySeq` and the credibility holder through it).''')
rep(r'''| `presentAt` | `{ settlementId, sinceTick }` | DM only (`SET_PRESENCE`) | "the party is here" (PT3) — one of the two inputs of `whereaboutsOf` |''',
r'''| `presentAt` | `{ settlementId, sinceTick, partySeq }` | DM only (`SET_PRESENCE`) | "the party is here" (PT3) — one of the two inputs of `whereaboutsOf`; its stamp is (`sinceTick`, `partySeq`) |
| `partySeq` | integer ≥ 0 | the sub-ledger writer, as each `SET_PRESENCE`, each answer and each deed whose doer is the party is written | the party's own monotone ORDER OF RECORDING — the stamp that orders two acts of one tick (PT3); never decremented, an undo included (a stamp, not state) [CURED 2026-10-18 (fp-final r2) — PT-r1-1 (RULINGS-ROUND2 B)] |''')
rep(r'''| (`credibility` — DERIVED, NOT persisted) | — | — | RN §7's law folded on read over the party's unstruck `party_pledge` deeds and exposures (`partyCredibilityOf`; per town `partyCredibilityAt`) — no stored score, so a strike after a month advance restores it exactly [CURED 2026-10-18 (fp-final r1) — PT-r1-8: the clamped, decayed running score (`npcCredibility.js`: `SCORE_MAX: 12`, `HALF_LIFE_TICKS: 52`) cannot be un-charged exactly by subtraction; RN §2.1/§7's stored holder becomes this derived read — RN's half, listed for the chair in `cure/D-PT-r1.md` §5] |''',
r'''| `credibility` | `{ score, lastUpdateTick }` — RN §7's holder (the landed person law) | the party door (`partyLedger.js`): a charge at each pledge verdict (`TRUE_RISE` · `MISS_FALL`) and each exposure (`LIE_FALL`); a RE-FOLD after any strike, unstrike or undo of a charging deed | the party's word, PERSISTED (RULINGS-ROUND2 A.1 — RN wins); the DM's view reads it through RN's `partyCredibilityOf`, and a town reads `partyCredibilityAt` over the pledge deeds IT heard. THE RE-FOLD replays RN §7's law over the party's unstruck `party_pledge` deeds and exposures in tick order — within a tick in deed-id codepoint order, the order the door charges in — with the landed decay, clamp (±`SCORE_MAX`), spend past `MAX_LOOKBACK_TICKS` and four-place rounding: the very writes the door made, minus the struck deed's, so a strike after a month advance restores the holder exactly [CURED 2026-10-18 (fp-final r1) — PT-r1-8: a clamped, decayed running score (`npcCredibility.js`: `SCORE_MAX: 12`, `HALF_LIFE_TICKS: 52`) cannot be un-charged exactly by subtraction] [CURED 2026-10-18 (fp-final r2) — PT-r1-8 (RULINGS-ROUND2 A.1): round 1 made the holder derived and so contradicted RN §7's persisted holder; it is RN's holder again, and the re-fold — not a derived read — is what keeps a strike exact] |''')

# E7 shape 2
rep(r'''| `voidsRef` | deedId | — (only on `backing_voided` / `backing_repudiated` deeds) | the backed deed whose backing the voiding court withdrew in its reach (§10.3) [CURED 2026-10-18 (fp-final r1) — PT-r1-14: no field linked the void to the deed; `correctsRef` means correction] |''',
r'''| `partySeq` | integer | stamped at mint from the sub-ledger, on every deed whose doer is `{kind:'party'}` | the deed's place in the party's order of recording (PT3; the pledge evidence, §8.6). The void and the repudiation are CORRECTIONS of the backed deed and carry RN's own `correctsRef` (RULINGS-ROUND2 A.4) — PT mints no link field [CURED 2026-10-18 (fp-final r2) — PT-r1-1 (B) · PT-r1-14 (A.4): round 1's `voidsRef` is struck; RN's one re-read of a correction carries the void] |''')
rep(r'''| the DM's word on how the act truly looks; it reaches a HEARER only through a visible reason (§11.3) |''',
r'''| the DM's word on how the act truly looks; it REPLACES the derived band for every hearer that can see it (§11.3; RULINGS-ROUND2 A.2) |''')

# E8 engagement
rep(r'''  reachedTick?,                                // the first tick the party's whereabouts named the need's settlement while pledged (§8.6)''',
r'''  reachedTick?,                                // the first weekly evaluation AFTER the answer's tick at which whereaboutsOf named the need's settlement (§8.6)''')
rep(r'''  answer?: { word: 'yes'|'later'|'no', deedId, tick, laterTick? },''',
r'''  answer?: { word: 'yes'|'later'|'no', deedId?, tick, partySeq, laterTick? },''')
rep(r'''· HOST-r1-6: `anchorId` and `where`.]''',
r'''· HOST-r1-6: `anchorId` and `where`.] [CURED 2026-10-18 (fp-final r2) — PT-V1: `reachedTick` counts only presence after the answer's week · PT-r1-1: the answer carries its stamp.]''')

# E9 §2.3
rep(r'''— the later of `presentAt` and `lastHeardOf` (the toggle on a tie);''',
r'''— whichever of `presentAt` and `lastHeardOf` carries the LATER STAMP, (tick, `partySeq`); a same-tick tie no sequence settles goes to the deed (PT3; RULINGS-ROUND2 B) [CURED 2026-10-18 (fp-final r2) — PT-r1-1];''')
rep(r'''- `lastHeardOf(worldState, tick) → { settlementIds, tick, deedId } | null` — the newest unstruck placing deed (§4)''',
r'''- `lastHeardOf(worldState, tick) → { settlementIds, tick, partySeq, deedId } | null` — the newest unstruck placing deed by (tick, `partySeq`) (§4)''')

for old, new in R:
    c = s.count(old)
    if c != 1:
        print('MISMATCH count=%d for: %s' % (c, old[:120].replace('\n', '\\n')))
        sys.exit(1)
    s = s.replace(old, new)
open(path, 'w', encoding='utf-8').write(s)
print('part1 applied', len(R), 'replacements')
