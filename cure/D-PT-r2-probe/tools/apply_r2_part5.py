# part 5: align with RN's concurrent round-2 text (RN-V5(c) withdrew credibility scaling of a told reason;
# RULINGS-ROUND2 B RN / HOST-r1-7 struck RN-3's lighting gate; RN §7 states the refold undo; RN keeps the
# void's mask "inside the voider's reach"). Removes this lane's crediting test and the owner-row wait.
import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
R = []
def rep(old, new):
    R.append((old, new))

# answer paragraph
rep(r'''everyone who hears why takes it as just — unless the party's word counts for nothing in their town and nothing was shown — and those who never hear why judge the act alone.''',
r'''everyone who hears why takes it as just, and those who never hear why judge the act alone.''')

# PT13
rep(r'''that weight REPLACES the act's derived band for every hearer that can see it — its version shows the reason and it credits the teller (§11.3; RULINGS-ROUND2 A.2); where the reason never reached it, or was kept quiet, or the DM marked no weight, or a merely told reason comes from a party whose word is worth nothing there, the hearer judges the act alone.''',
r'''that weight REPLACES the act's derived band for every hearer that can see it — its version shows the reason (§11.3; RULINGS-ROUND2 A.2); where the reason never reached it, or was kept quiet, or the DM marked no weight, the hearer judges the act alone.''')

# §11.3 body
rep(r'''A hearer sees it when (1) the deed carries a marked `moralWeight`; (2) its version shows the reason part — proof `spoken` or `shown`, completeness at or above the reason's threshold (§11.1; in the omniscient arm, the whole story inside the scope); and (3) it CREDITS the teller — proof `shown` is always credited (the owner's "making discovery"); a reason only `spoken` is credited unless the party's word is `discredited` in the hearer's town (RN §7's band at that town, `partyCredibilityAt`; the doer's own holder for a paragon). For such a hearer''',
r'''A hearer sees it when (1) the deed carries a marked `moralWeight` and (2) its version shows the reason part — proof `spoken` or `shown`, completeness at or above the reason's threshold (§11.1: `shown` lowers it, the owner's "making discovery"; in the omniscient arm, the whole story inside the scope); an `unspoken` mark reaches no hearer. The teller's credibility never scales a told reason (RN §7: "a told reason is no longer scaled by it"). For such a hearer''')
rep(r'''Every other hearer — no weight marked, `unspoken`, the reason weathered away, or a merely told reason from a discredited party — reads the derived inherent value: the act alone.''',
r'''Every other hearer — no weight marked, `unspoken`, or the reason weathered away — reads the derived inherent value: the act alone.''')
rep(r'''the owner's orphanage burned for the infestation and TOLD reads with an admirable kindness to every hearer whose version shows why (save where the party's word is worth nothing), and SHOWN, to every one of them;''',
r'''the owner's orphanage burned for the infestation and TOLD reads with an admirable kindness to every hearer whose version shows why — and SHOWN, the why survives more hops;''')
rep(r'''the mark now moves `kind01` alone (P36).] [REFINED 2026-10-18 (fp-final r2) — RN §6.2's "the doer's credibility weight AT THE HEARER … scales how far a told reason is believed" is carried as the crediting test (a discredited party's told reason is not credited; a shown one always is), so A.2's replacement stays whole and the persisted credibility (A.1) keeps its reader here; RN §6.1's "for every reader" and §6.2's "scales" are RN's to restate in the same words. Vetoable.]''',
r'''the mark now moves `kind01` alone (P36). Round 1's belief factor (`weight × proofFactor`) is withdrawn with the lean: RN's round 2 withdrew the same scaling from its §6.2 and §7 (RN-V5(c)), so both volumes say "replaces, for every reader that can see it" and nothing more.]''')

# §11.2
rep(r'''and so it loses by its later start, its narrower scope, the weathering and — where it is only told — the crediting test (§11.3), never by a slower road.''',
r'''and so it loses by its later start, its narrower scope and the weathering, never by a slower road. [CURED 2026-10-18 (fp-final r2) — PT-r1-10 (A.2): "the credibility test" is struck — a told reason is never scaled by credibility (RN §7).]''')

# §8.5 credibility reader for "later"
rep(r'''`later` ⇒ `pledged` with `laterTick` (or open, under patience).''',
r'''`later` ⇒ `pledged` with `laterTick` (or open, under patience); the requester weighs a "later" by the party's word in ITS town — RN §7's declared reader, `partyCredibilityAt(worldState, requesterTownId, tick)`: where that word is `doubted` or `discredited`, one seeded draw at the answer decides whether the requester `turns_elsewhere` at once (DRAFT 0.25 · 0.5 by band; never for `ordinary` or `trusted`), closing the engagement at no cost to the party — a promise the world no longer leans on [REFINED 2026-10-18 (fp-final r2) — RN §7 names "an actor's willingness to accept 'later' (PT)" as a reader of the party's credibility and PT never read it; with A.1's persisted holder it now has its one PT reader. Vetoable].''')

# §6 undo: cite RN §7's undo rule
rep(r'''RN's `STRIKE_DEED` / `UNSTRIKE_DEED` on a party pledge deed or an exposure are followed, in the same act, by that re-fold (the party door's hook on RN's verb — RN's half, listed).''',
r'''RN's `STRIKE_DEED` / `UNSTRIKE_DEED` on a party pledge deed or an exposure rebuild the holder the same way (RN §7's undo rule: "a strike, an unstrike or PT's source-event undo of a charge REBUILDS the holder by refolding").''')

# §10.3 align to RN's reach wording
rep(r'''PT keeps no masked re-read and no reach rule of its own: a backing only ever counted inside the backer's reach (§10.2), which the higher authority's lands contain, so a hearer outside it loses nothing it had.''',
r'''PT keeps no masked re-read of its own: RN's correction masks the backing inside the voider's reach (RN §2.1's `correctsRef` row), and a backing only ever counted inside the backer's reach (§10.2), which the voider's lands contain.''')

# §14 bracket wording unchanged (value rows at RN-3). §15: strike the owner-row wait (RULINGS-ROUND2 B RN, HOST-r1-7: no lighting gate)
rep(r'''PT REGISTERS its §3.3 rows at RN-3's unit (in PT's commit there — the registry idiom; PT-0 carries none). RN-3 LIGHTS only after the owner answers alignment-25e and -25g (RN §13; fold §7 owner rows, the chair's), so PT-1 and PT-2 are BUILT after RN-3 and LIGHT only where RN-3 lights — they wait on those two owner rows; PT-0 does not (the deed door, the marks, presence, suggestions and the undo need no reading).''',
r'''PT REGISTERS its §3.3 rows at RN-3's unit (in PT's commit there — the registry idiom; PT-0 carries none), and PT-1 and PT-2 land after RN-3; PT-0 does not wait (the deed door, the marks, presence, suggestions and the undo need no reading). RN-3 carries NO lighting gate on the owner's alignment answers (RULINGS-ROUND2 B for RN, HOST-r1-7: H30 is the defects' slot), so nothing in C13 waits on an owner row.''')
rep(r'''| PT-1 (after RN-3; lights where RN-3 lights) |''',
r'''| PT-1 (after RN-3) |''')
rep(r'''| aspatial-safe; lights only after the owner's alignment-25e/-25g (through RN-3); the default preset: the omniscient arm; persons with C1 |''',
r'''| aspatial-safe; the default preset: the omniscient arm; persons with C1 |''')
rep(r'''| aspatial-safe (graph hops); lights where RN-3 lights (it reads regard); `hearingWeekEnabled` for the pause;''',
r'''| aspatial-safe (graph hops); after RN-3 (it reads regard); `hearingWeekEnabled` for the pause;''')
rep(r'''[CURED 2026-10-18 (fp-final r2) — PT-V3: PT-0 carried the value rows before RN-3 opened their door, and PT-1/PT-2 promised "who has heard and what they think" before any lens existed.]''',
r'''[CURED 2026-10-18 (fp-final r2) — PT-V3: PT-0 carried the value rows before RN-3 opened their door, and PT-1/PT-2 promised "who has heard and what they think" before any lens existed; the verifier's owner-row wait is moot — RN's round 2 struck RN-3's lighting gate under RULINGS-ROUND2 B.]''')

# §18
rep(r'''the reason's band centres; the crediting test's threshold (RN's `discredited` band);''',
r'''the reason's band centres; the "later" draw by the party's word (0.25 · 0.5);''')
rep(r'''RN-2 and RN-3 before PT-1/PT-2, which light only where RN-3 lights (the owner's alignment-25e/-25g) [CURED''',
r'''RN-2 and RN-3 before PT-1/PT-2 (RN-3 has no lighting gate, RULINGS-ROUND2 B) [CURED''')
rep(r'''which REPLACES the act's kindness for every hearer that can see it — the reason visible and the teller credited (shown always; told unless the party is discredited there) (§11.3) [CURED 2026-10-18 (fp-final r1) — PT-r1-10] [CURED 2026-10-18 (fp-final r2) — PT-r1-10 · PT-V2, RULINGS-ROUND2 A.2; REFINED: the crediting test, vetoable] |''',
r'''which REPLACES the act's kindness for every hearer that can see it — its version shows the reason (§11.3); credibility never scales a told reason [CURED 2026-10-18 (fp-final r1) — PT-r1-10] [CURED 2026-10-18 (fp-final r2) — PT-r1-10 · PT-V2, RULINGS-ROUND2 A.2] |''')

# §17 P3, P38
rep(r'''; the backer earns a half term; a neighbour where the party's word is `discredited` reads the act alone |''',
r'''; the backer earns a half term |''')
rep(r'''| P38 | a marked deed with a told reason (`spoken`) heard where the party's word is `discredited`; the same deed `shown` there | spoken: the act alone; shown: the marked band replaces (§11.3's crediting test) |''',
r'''| P38 | a marked deed with a told reason (`spoken`) heard where the party's word is `discredited` | the marked band replaces all the same — credibility never scales a told reason (A.2; RN §7); the party's "later" there may send the requester elsewhere (§8.5) |''')

# §20 REFINED list and OPEN list
rep(r'''· the crediting test carries RN §6.2's credibility clause inside A.2's replacement ·''',
r'''· the requester weighs a "later" by the party's word (RN §7's declared reader, §8.5) ·''')
rep(r'''(1) RN's halves under RULINGS-ROUND2 — the hook on `STRIKE_DEED` / `UNSTRIKE_DEED` that re-folds the party's credibility (A.1); §6.1's "for every reader" → "for every reader that can see it" and §6.2's "scales how far a told reason is believed" → the crediting test (A.2); the pledge words in §2.1, §3.1, §6.1 and §7 (A.3); the void and the repudiation as corrections whose reading masks the backing (A.4); the normalizer's PT fields `actAt`, `backerRole`, `partySeq` (`voidsRef` struck); §5.5/§11's STOP SEAMS-r1-6, closed by `party_voiced` (A.5); §3.1's `party_event` row ("every party-caused event that does not ripple");''',
r'''(1) RN's halves — RN's round 2, read while it was being written (07:27), already states A.1's refold, A.2's "replaces, for every reader that can see it" (the credibility scaling withdrawn), A.3's pledge words, A.4's correction with `correctsRef` and the end of STOP SEAMS-r1-6; still owed: the normalizer names PT's new `partySeq`; §3.1's `party_event` row still says "for EVERY party-caused settlement event" (PT: every one that does not ripple — the six mint through `party_impact`); and §7's reader "the truth chasing a rumor (PT)" has no PT read once a told reason is never scaled (strike it, or the chair gives it one);''')
rep(r''' (7) PT-V3's wait — whether PT-1 may light before RN-3 with fame and the DM's authored regard only; (8) round 1's two still open:''',
r''' (7) round 1's two still open:''')

for old, new in R:
    c = s.count(old)
    if c != 1:
        print('MISMATCH count=%d for: %s' % (c, old[:140].replace('\n', '\\n')))
        sys.exit(1)
    s = s.replace(old, new)
open(path, 'w', encoding='utf-8').write(s)
print('part5 applied', len(R), 'replacements')
