import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
R = []
def rep(old, new):
    R.append((old, new))

# §16
rep(r'''| Path | `spatialLedgers.party` | the deed's party fields (`backing` · `moralWeight` · `proof` · `reasonGiven` · `actAt` · `witnessIds` · `voidsRef`) | the party's exclusion edges (key `party`) |''',
r'''| Path | `spatialLedgers.party` | the deed's party fields (`backing` · `moralWeight` · `proof` · `reasonGiven` · `actAt` · `witnessIds` · `partySeq`) | the party's exclusion edges (key `party`) |''')
rep(r'''| create | the DM verbs; the engagement pass; the hearing resolver (the seal's outcome) | the party doors at mint (defaults, `actAt`); `MARK_DEED`; the backing hearings (`voidsRef`) | `BAN_PARTY`; a `party_banned` verdict |''',
r'''| create | the DM verbs; the engagement pass; the hearing resolver (the seal's outcome); the party doors (`partySeq`; the credibility holder's first charge) | the party doors at mint (defaults, `actAt`, `partySeq`) with the marks the act carried; a later `MARK_DEED` and the backing hearings mint CORRECTIONS (`correctsRef`), never a rewrite (RN2) | `BAN_PARTY`; a `party_banned` verdict |''')
rep(r'''| read | `partyOf` only (`whereaboutsOf` and `lastHeardOf` derive from it and the deed ledger) |''',
r'''| read | `partyOf` only (`whereaboutsOf` and `lastHeardOf` derive from it and the deed ledger; RN's `partyCredibilityOf` reads the holder through it) |''')
rep(r'''| persist | blob; drop-when-empty at every level; zero first-paint bytes; `lastHeard` and `credibility` are NOT stored (derived) |''',
r'''| persist | blob; drop-when-empty at every level; zero first-paint bytes; `lastHeard` is NOT stored (derived); `credibility` IS stored (RN §7's holder, A.1), pruned at the landed `PRUNE_EPSILON`; `partySeq` stored |''')
rep(r'''| undo | every DM verb's inverse; the engine week by the pulse snapshot; undoing an answer unwinds its pledge and strikes the deeds it led to — credibility and `lastHeard`, derived, follow exactly | `MARK_DEED`'s inverse; RN's strike;''',
r'''| undo | every DM verb's inverse; the engine week by the pulse snapshot; undoing an answer unwinds its pledge and strikes the deeds it led to — `lastHeard` (derived) follows exactly and the credibility holder is RE-FOLDED from the unstruck deeds (exact); `partySeq` is never rolled back (a stamp) | a later mark's correction struck; RN's strike;''')
rep(r'''| import | normalizer: caps enforced, unknown kinds, states and course words dropped |''',
r'''| import | normalizer: caps enforced, unknown kinds, states and course words dropped; `credibility` clamped to ±`SCORE_MAX`; `partySeq` raised to at least the highest `partySeq` on the party's deeds |''')
rep(r'''engagements whose need's town is gone close with no cost |''',
r'''an engagement still `seeking` or `awaiting` whose need's town is gone closes with no cost; a `pledged` one has its clock end that week and is judged (§8.2), never closed free |''')
rep(r'''| horizon (req. 23) | bounded: ≤ 6 open engagements, ≤ 16 archived, strikes dropped when past |''',
r'''| horizon (req. 23) | bounded: ≤ 6 open engagements, ≤ 16 archived, strikes dropped when past; one credibility holder; `partySeq` one integer |''')
rep(r'''· PT-r1-29 (destroyed settlements; no `NaN`) · PT-r1-9 · PT-r1-14 · SEAMS-r1-11.]''',
r'''· PT-r1-29 (destroyed settlements; no `NaN`) · PT-r1-9 · PT-r1-14 · SEAMS-r1-11.] [CURED 2026-10-18 (fp-final r2) — PT-r1-8 (A.1) · PT-r1-1 (B) · PT-r1-14 (A.4) · the verifier's carries (`MARK_DEED` after mint; a destroyed need's town).]''')

# §17
rep(r'''| at Kell and its one-hop neighbours whose telling shows the reason, lens one reads toward `admirable` by `0.6 × weight` (§11.3) plus the backing term inside Kell's reach; the backer earns a half term |''',
r'''| at Kell and its one-hop neighbours whose telling shows the reason, lens one reads `kind01` at `admirable`'s centre with the act's own `law01` and `force01` (§11.3), plus the backing term inside Kell's reach; the backer earns a half term; a neighbour where the party's word is `discredited` reads the act alone |''')
rep(r'''| the pledge unwinds; the `party_pledge` deed is struck; credibility restored EXACTLY (derived) |''',
r'''| the pledge unwinds; the `party_pledge` deed is struck; the persisted credibility holder is re-folded to EXACTLY its value without that verdict |''')
rep(r'''| P21 | the DM sets Kell; the party then records two deeds in Tolle | `whereaboutsOf` = Tolle (`word`); the pledge's journey and fault start at Tolle; Kell is not a witness of the Tolle deeds; the DM sets Kell again ⇒ Kell (`toggle`) |''',
r'''| P21 | in ONE session (one tick) the DM sets Kell, then records two deeds in Tolle | `whereaboutsOf` = Tolle (`word`, the later `partySeq`); the pledge's journey and fault start at Tolle; Kell is not a witness of the Tolle deeds; the DM then sets Kell again, still the same tick ⇒ Kell (`toggle`); an advance with nothing new ⇒ still Kell |''')
rep(r'''| credibility and regard exactly as before the verdict |''',
r'''| credibility (the holder re-folded) and regard exactly as before the verdict |''')
rep(r'''| P26 | yes to Tolle's siege; the DM moves the toggle to Tolle before the siege ends and records nothing else |''',
r'''| P26 | yes to Tolle's siege; the DM moves the toggle to Tolle, an advance turns while it stands, and the siege ends; nothing else recorded |''')
rep(r'''| one non-commons voice; then two (the court and the second faction) — never the governing faction twice |''',
r'''| one non-commons voice; then two (the court and the second faction) — never the governing faction's derived regard twice; a DM stance on the governing faction adds its authored band as one voice at its share (P37) |''')
rep(r'''| `backing_voided` the week it is heard, once; default `voided`; members' hearers re-read the deed without the backing from the week they hear the void |''',
r'''| `backing_voided` the week it is heard, once; default `voided`; a CORRECTION deed (`correctsRef`) mints; each hearer that hears it re-reads the backed deed with the backing masked (RN's one re-read); a hearer that never hears it keeps the backing |
| P35 | yes given while the party stands in Tolle; in the same session the DM moves the toggle to Merewick; the siege runs on, within reach, and ends | no evaluation after the answer saw the party at Tolle ⇒ default `fell_short` (a reachable miss counts); had the toggle stood at Tolle through one advance ⇒ `made_good` |
| P36 | a balanced (K = 0), chaotic, peaceful holder hears a deed marked `villainous`, its reason visible and credited | lens one equals the UNMARKED reading — the mark moves only `kind01`, which K = 0 discounts, and `law01` and `force01` are the act's own — never round 1's +0.23 approval |
| P37 | the DM declares Kell's governing faction an enemy of the party | `netEffectAt(Kell)` gains ONE voice, the faction's authored `enmity` at its power share; the court's derived voice is unchanged; the town's gate's renown step reads the new verdict |
| P38 | a marked deed with a told reason (`spoken`) heard where the party's word is `discredited`; the same deed `shown` there | spoken: the act alone; shown: the marked band replaces (§11.3's crediting test) |
| P39 | yes to Tolle's siege, within reach; the party goes elsewhere; Tolle is destroyed | the clock ends the week Tolle falls; default `fell_short`; the pledge is never closed at no cost |
| P40 | the DM marks a minted deed `admirable` a week later | a `correction` deed (`correctsRef`) carries the mark; the original record is byte-unchanged (the append-only pin); hearers re-read it as the correction arrives |
| P41 | DARK until THE SITES: the party clears a band from a ruin (ST's S8) | one `party_event` deed `party_cleared_site` beside the DM's `SITE_HOLDER` act the same week; read as relief; no hearing about the party |
| P42 | the DM undoes a party-caused BROKERED_ALLIANCE | the deed struck (renown falls back); the relationship the party impact moved stands, as on master; the undo receipt says so (OD-PT-28) |''')
rep(r'''· SEAMS-r1-18 (P30).]''',
r'''· SEAMS-r1-18 (P30).] [CURED 2026-10-18 (fp-final r2) — PT-r1-1 (P21) · PT-r1-8 (P18, P24) · PT-r1-10 (P3, P38) · PT-r1-14 (P34) · PT-V1 (P26, P35) · PT-V2 (P36) · PT-V4 (P29, P37) · the verifier's carries (P39, P40, P42) · RULINGS-ROUND2 §E (P41).]''')

# §18
rep(r'''| the DM's toggle; `lastHeard` derived from the deeds; ONE read `whereaboutsOf` — the later word (PT3) [CURED 2026-10-18 (fp-final r1) — PT-r1-1, RULINGS-ROUND1 PT-r1-1] |''',
r'''| the DM's toggle; `lastHeard` derived from the deeds; ONE read `whereaboutsOf` — the LATER STAMP (tick, `partySeq`), the deed on a same-tick tie no sequence settles (PT3) [CURED 2026-10-18 (fp-final r1) — PT-r1-1, RULINGS-ROUND1 PT-r1-1] [CURED 2026-10-18 (fp-final r2) — PT-r1-1, RULINGS-ROUND2 B; REFINED: the party's sequence, vetoable] |''')
rep(r'''| `spatialLedgers.party`, §2.1 shape 1; `lastHeard` and `credibility` derived, not stored [CURED 2026-10-18 (fp-final r1) — PT-r1-8] |''',
r'''| `spatialLedgers.party`, §2.1 shape 1; `lastHeard` derived; `credibility` PERSISTED (RN §7's holder), re-folded after a strike; `partySeq` [CURED 2026-10-18 (fp-final r1) — PT-r1-8] [CURED 2026-10-18 (fp-final r2) — PT-r1-8, RULINGS-ROUND2 A.1 · PT-r1-1] |''')
rep(r'''| §2.1 shape 2; `proof: unspoken · spoken · shown` (R-PT-1); `backerRole`, `actAt`, `voidsRef` added [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-11 · PT-r1-8 · PT-r1-14] |''',
r'''| §2.1 shape 2; `proof: unspoken · spoken · shown` (R-PT-1); `backerRole`, `actAt`, `partySeq` added; the void links by RN's `correctsRef` [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-11 · PT-r1-8 · PT-r1-14] [CURED 2026-10-18 (fp-final r2) — PT-r1-14, RULINGS-ROUND2 A.4 · PT-r1-1] |''')
rep(r'''the world's evidence decides a kept pledge first (§8.6) [CURED 2026-10-18 (fp-final r1) — PT-r1-4 · PT-r1-5] |''',
r'''the world's evidence decides a kept pledge first, counting presence only after the answer's week (§8.6); a destroyed need's town ends the clock [CURED 2026-10-18 (fp-final r1) — PT-r1-4 · PT-r1-5] [CURED 2026-10-18 (fp-final r2) — PT-V1 · the verifier's carry] |''')
rep(r'''the reason's band centres and proof factors (0.6 / 0.9);''',
r'''the reason's band centres; the crediting test's threshold (RN's `discredited` band);''')
rep(r'''| chain C13, after C11; ONE head unit RN-0 + PT-0; RN-2 before PT-1/PT-2 [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-15] |''',
r'''| chain C13, after C11; ONE head unit RN-0 + PT-0; RN-2 and RN-3 before PT-1/PT-2, which light only where RN-3 lights (the owner's alignment-25e/-25g) [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-15] [CURED 2026-10-18 (fp-final r2) — PT-V3] |''')
rep(r'''| it carries only the DM's marked weight, as far as the hearer believes the teller (§11.3) [CURED 2026-10-18 (fp-final r1) — PT-r1-10] |''',
r'''| it carries only the DM's marked weight, which REPLACES the act's kindness for every hearer that can see it — the reason visible and the teller credited (shown always; told unless the party is discredited there) (§11.3) [CURED 2026-10-18 (fp-final r1) — PT-r1-10] [CURED 2026-10-18 (fp-final r2) — PT-r1-10 · PT-V2, RULINGS-ROUND2 A.2; REFINED: the crediting test, vetoable] |''')
rep(r'''| OD-PT-26 | the verbs' hats | table records ride the party door's named exemption; acts upon the world's actors take the AUTHOR shape (§6) [REFINED 2026-10-18 (fp-final r1), vetoable] |''',
r'''| OD-PT-26 | the verbs' hats | table records ride the party door's named exemption; acts upon the world's actors take the AUTHOR shape (§6) [REFINED 2026-10-18 (fp-final r1), vetoable] |
| OD-PT-27 | the order of two acts in one tick | the party's own `partySeq` on the toggle, the answer and every party deed; RULINGS-ROUND2 B's same-tick rule (to the deed) the fallback [CURED 2026-10-18 (fp-final r2) — PT-r1-1; REFINED on B's letter, vetoable] |
| OD-PT-28 | undoing a party-caused RIPPLING event (THE CHAIR'S DECISION POINT, opened by D-PT-r2 from the verifier's carry) | today the deed is struck and the party impact's world outcomes stand, as on master (`undoToken:null`; the slice snapshots no ripple for a party-caused event); the undo receipt says so. The question: should the undo also reverse the impact's outcomes? One road, PLAUSIBLE until PT-0's car-0 measures it: the two relationship kinds (`BROKERED_ALLIANCE`, `SETTLEMENT_DISPUTE`) could take the landed snapshot and reverse (`captureCanonRelationshipUndo` / `reverseCanonRelationshipRipple`) that the slice skips for party-caused events, the four person and faction kinds staying the DM's hand. New capability on a door designed with no undo — not built here |
| OD-PT-29 | a mark changed after the deed is minted | a `correction` deed carrying the revised marks (RN2: the deed is never rewritten); strike and re-record to unsay a mark everywhere at once (§6) [CURED 2026-10-18 (fp-final r2) — the verifier's carry] |
| OD-PT-30 | THE SITES | §4's sites bracket: `siteId?` presence; `party_reached_site` · `party_cleared_site` · `party_revealed_site` deeds beside the DM's own site acts; `site` as a WHERE; no party kind from ST [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E] |''')

# §19b
rep(r'''**The corpus owner:** the prose lane (as MN named for its kinds);''',
r'''The three site deeds (§4's sites bracket) register their subjects in PT's commit at ST-4, with THE SITES. **The corpus owner:** the prose lane (as MN named for its kinds);''')
rep(r'''[CURED 2026-10-18 (fp-final r1) — PT-r1-18: PT had no voice section; a deed telling's subject read `UNREGISTERED_SUBJECT`.]''',
r'''[CURED 2026-10-18 (fp-final r1) — PT-r1-18: PT had no voice section; a deed telling's subject read `UNREGISTERED_SUBJECT`.] [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E (sites): the subjects' slot.]''')

# §20
rep(r'''**Round 1 raised NO new STOP.** Every finding was cured or is cured on PT's side with its other half listed for the chair (`cure/D-PT-r1.md` §5).''',
r'''**Round 1 raised NO new STOP.** Every finding was cured or is cured on PT's side with its other half listed for the chair (`cure/D-PT-r1.md` §5). **Round 2 raised NO new STOP** (`cure/D-PT-r2.md` §3); its other halves are listed there (§5).''')
rep(r'''· the verbs' hats split (table records vs acts upon the world's actors).''',
r'''· the verbs' hats split (table records vs acts upon the world's actors). ROUND 2 (`[REFINED 2026-10-18 (fp-final r2) — …]` or a REFINED clause inside a CURED bracket): the whereabouts stamp carries the party's own sequence (on RULINGS-ROUND2 B's letter) · the crediting test carries RN §6.2's credibility clause inside A.2's replacement · the season and the sea cited, not re-minted (§8.3).''')

start = "OPEN FOR THE CHAIR (detail in `cure/D-PT-r1.md` §5):"
i = s.find(start); assert i >= 0 and s.count(start) == 1, 'open start'
j = s.find("\n", i); assert j > i
newopen = r'''OPEN FOR THE CHAIR (detail in `cure/D-PT-r2.md` §5–§6): (1) RN's halves under RULINGS-ROUND2 — the hook on `STRIKE_DEED` / `UNSTRIKE_DEED` that re-folds the party's credibility (A.1); §6.1's "for every reader" → "for every reader that can see it" and §6.2's "scales how far a told reason is believed" → the crediting test (A.2); the pledge words in §2.1, §3.1, §6.1 and §7 (A.3); the void and the repudiation as corrections whose reading masks the backing (A.4); the normalizer's PT fields `actAt`, `backerRole`, `partySeq` (`voidsRef` struck); §5.5/§11's STOP SEAMS-r1-6, closed by `party_voiced` (A.5); §3.1's `party_event` row ("every party-caused event that does not ripple"); (2) the fold's party rows (§3.4 per A.5, A.6, A.13; §5 tokens incl. `partySeq` and the three site kinds; §6's C11/C13 chain with RN-3 before PT-1); (3) IN's inbox: `plant_taken` skips a plant whose subject is the party; (4) CH names `met_in_person` as the producer of `marks.metParty`; (5) PR's ⛔ STOP-PR-2 (a road stop of the party; PT's recommendation is (a), one kind for a holder's reception of the party on its land) and PR's OD-PR-16, which names PT as a `believedWatch` consumer that PT declines (§13); (6) OD-PT-28, the ripple's undo; (7) PT-V3's wait — whether PT-1 may light before RN-3 with fame and the DM's authored regard only; (8) round 1's two still open: a deed-only upward size bias, and an AMEND `{ lie: true }` on `party_pledge_due` (RN §7's "a miss the DM marks a lie").'''
s = s[:i] + newopen + s[j:]

for old, new in R:
    c = s.count(old)
    if c != 1:
        print('MISMATCH count=%d for: %s' % (c, old[:120].replace('\n', '\\n')))
        sys.exit(1)
    s = s.replace(old, new)
open(path, 'w', encoding='utf-8').write(s)
print('part4 applied', len(R) + 1, 'replacements')
