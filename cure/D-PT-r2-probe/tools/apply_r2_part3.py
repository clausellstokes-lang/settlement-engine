import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
R = []
def rep(old, new):
    R.append((old, new))

# E22 §7.3 / §9.3 / §10.3 seatChangedSince
rep(r'''a NEW ruler in the backer's seat — `seatChangedSince(backerSeatId, deed.tick)`, PL's one read over BOTH landed tails''',
r'''a NEW ruler in the backer's seat — `seatChangedSince(worldState, backerSeatId, deed.tick)` (its tick form), PL §2's one read over BOTH landed tails''')
rep(r'''— PL's STOP-2 precedent]''',
r'''— PL's STOP-2 precedent] [CURED 2026-10-18 (fp-final r2) — the verifier's carry: PL now names the read (PL §2, PL-V3); PT takes its signature and its TICK form, under which the DM's own tick-less `CHANGE_RULING_POWER` counts only behind a later stamped row (PL §2), so that card, like KILL/ASSIGN's, offers the same act]''')
rep(r'''read through PL's ONE seat-change read `seatChangedSince(settlementId, banTick)`''',
r'''read through PL's ONE seat-change read `seatChangedSince(worldState, settlementId, banTick)` (its tick form, PL §2)''')
rep(r'''a DM KILL/ASSIGN writes neither tail, so its card offers "lift this court's bans on the party"''',
r'''a DM KILL/ASSIGN writes neither tail (and the DM's tick-less `CHANGE_RULING_POWER` counts only behind a later stamped row), so its card offers "lift this court's bans on the party"''')
rep(r'''minted when `seatChangedSince(backerSeatId, deed.tick)`, §7.3;''',
r'''minted when `seatChangedSince(worldState, backerSeatId, deed.tick)`, §7.3;''')

# E20 §9.1
rep(r'''There is no separate crown voice and no separate governing-faction voice — each is inside the court's; on scrutiny the court's reason names them ("its lord, and the crown behind him").''',
r'''There is no separate crown voice, and the governing faction's DERIVED regard is inside the court's (its leader is the ruler); on scrutiny the court's reason names them ("its lord, and the crown behind him"). But where the DM has AUTHORED a stance or set a regard on the governing faction's own body (`f:<sid>:<gov>`; RN §5.6: `DECLARE_STANCE` and `SET_REGARD` take "any holder kind, bodies … included"), that AUTHORED band alone (`dmSet ⊳ declared` — never the body's derivation, so nothing is counted twice) speaks as its own voice at the faction's power share, so the DM's word on the governing faction reaches the net effect and, through it, the town's gate (§9.2 step 4); the producers of §7.3 stay acts of courts and persons, so a DM who wants the court itself to act on that stance sets the court's own (`c:`) or directs it (`DIRECT_TO_PARTY`).''')
rep(r'''· SEAMS-r1-12: the crown's weight is the one reach read, inside the court.]''',
r'''· SEAMS-r1-12: the crown's weight is the one reach read, inside the court.] [CURED 2026-10-18 (fp-final r2) — PT-V4: a DM's stance on the governing faction reached no voice, so neither the town's gate nor the DM's net-effect line felt it.]''')

# E21 §9.2 plague-R7
rep(r'''(3) circumstance, from belief — `under_quarantine`, `at_war_with_employer`''',
r'''(3) circumstance, from belief — `under_quarantine` (CH's believed-plague test; when PG's quarantine verb lands it is a STANCE input at the town's gate — one stance vocabulary with EC-6 and PS, `open · taxed · restricted · closed` — and this reason reads it: plague-R7's slot, chair notes item 11 [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E, the host document's plague-R7]), `at_war_with_employer`''')

# E23 §10.3
rep(r'''A void or a repudiation travels as its own deed (`party_event`, doer the voiding court, target the party, `voidsRef` the backed deed, significance `notable` so the news stays local — DRAFT); from the week a hearer's town hears it, that hearer re-reads the backed deed with the backing part masked (RN's re-read of a version), inside the voider's reach only. A backing never expires on its own.''',
r'''A void or a repudiation is a CORRECTION of the backed deed (RULINGS-ROUND2 A.4): a `party_event` deed of its own kind, doer the voiding court, target the party, `correctsRef` the backed deed, significance `notable` so the news stays local (DRAFT). It rides RN's ONE re-read mechanism — wherever it is heard, "the holder's term for the original is REPLACED by its reading of the correction" (RN §3.3; RN §5.1's one writer) — and that reading is the backed deed with its BACKING part masked (§3.3). PT keeps no masked re-read and no reach rule of its own: a backing only ever counted inside the backer's reach (§10.2), which the higher authority's lands contain, so a hearer outside it loses nothing it had. A backing once voided at a hearer stays masked in every later reading there (a later `SEND_WORD` correction brings its reason, never the voided backing). A backing never expires on its own.''')
rep(r'''· SEAMS-r1-3 · SEAMS-r1-22: `honoured` → `upheld`.]''',
r'''· SEAMS-r1-3 · SEAMS-r1-22: `honoured` → `upheld`.] [CURED 2026-10-18 (fp-final r2) — PT-r1-14 (RULINGS-ROUND2 A.4): RN's one writer re-reads only on a changed version or a correction, so round 1's "re-read with the backing masked" had no trigger in RN and the belief presets kept the backed reading; the void is now RN's correction.]''')

# E24 §11.2
rep(r'''and so it loses by its later start, its narrower scope, the weathering and the credibility test, never by a slower road.''',
r'''and so it loses by its later start, its narrower scope, the weathering and — where it is only told — the crediting test (§11.3), never by a slower road.''')

# E26 §13
rep(r'''from the closed list `settlement · road(a, b) · country(a)` (MN's `MENACE_WHERE_KINDS` words), plus `site` when the owner's world-site record lands; `border_segment` is never PT's.''',
r'''from the closed list `settlement · road(a, b) · country(a)` — `road` and `country` are MN's `MENACE_WHERE_KINDS` words (MN §2.4: `country · road`), `settlement` the registry's plain place — plus `site` (`{kind:'site', id}`, ST's widening) when THE SITES lands (§4's sites bracket); `border_segment` is never PT's.''')
rep(r'''· HOST-r1-6: an ambush anchored on the actor's town could not be placed on the road where it waits.]''',
r'''· HOST-r1-6: an ambush anchored on the actor's town could not be placed on the road where it waits.] [CURED 2026-10-18 (fp-final r2) — the verifier's carry: `settlement` is not one of MN's words.]

**Patrols considered** [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E; THE PATROLS (`DESIGN_FP_ARCH_PR.md`) PR8, PR19, §9.3, OD-PR-14/16, items 5, 13, 15, 18]: riders meet the party only through a PT kind, and PT registers none this round — PR's ⛔ STOP-PR-2 (widen `party_gate` to a `road` WHERE, or mint `party_stopped`) is the chair's; until it is ruled a patrol never engages the party and the party's default holds (PR19: "THE PARTY IS NEVER THE TARGET"). Fault never reads patrols — a ridden road slows no journey (§8.3). A patrol's look that finds the party's traces reads the deed's VISIBLE parts (§11.1), never the deed. PR's `believedWatch` is a court's belief, never the DM's read of the party (the DM sees all, §16's veil row), so PT consumes it nowhere. Patrols stay map-only until the host lights them and opens H16 (PR item 18).''')
rep(r'''**Long advances:** month, season and year advances run every party hearing on its default each tick of the span''',
r'''**Long advances:** month, season, year and N-year advances (chair notes item 1) run every party hearing on its default each tick of the span''')

# E27 §14
rep(r'''the deed doors' party fields, the §3.3 registration rows, suggestions,''',
r'''the deed doors' party fields, the §3.3 registration rows (registered at RN-3's unit), suggestions,''')
rep(r'''| reach, the backing's effect, the parts' visibility, the reason's term, the truth chase, voiding and repudiation |''',
r'''| reach, the backing's effect, the parts' visibility, the seen mark (§11.3), the truth chase, voiding and repudiation |''')
rep(r'''`partyValueRows.js` (§3.3's registration),''',
r'''`partyValueRows.js` (§3.3's registration, at RN-3's unit),''')
rep(r'''· PT-r1-35 · PT-r1-17 · PT-r1-18.]''',
r'''· PT-r1-35 · PT-r1-17 · PT-r1-18.] [CURED 2026-10-18 (fp-final r2) — PT-V3 (the value rows register at RN-3) · PT-r1-10 (the seen mark).]''')

# E28 §15
rep(r'''**RN-2** (`courtRegardOf`, `actingOfficer`) lands BEFORE PT-1 and PT-2, because the net effect and every producer's office read it. The first felt chain is therefore **(RN-0 + PT-0) → RN-1 → RN-2 → PT-1 → PT-2**:''',
r'''**RN-2** (`courtRegardOf`, `actingOfficer`) lands BEFORE PT-1 and PT-2, because the net effect and every producer's office read it; and so does **RN-3** (the inherent value, the two lenses and the registration door), because RN-1's heard pass reads each tale "through §6's lenses" (RN §5.1) — without RN-3 no reading exists, so there is no regard of the party beyond the DM's own seeds for PT-1 to show or PT-2 to answer. PT REGISTERS its §3.3 rows at RN-3's unit (in PT's commit there — the registry idiom; PT-0 carries none). RN-3 LIGHTS only after the owner answers alignment-25e and -25g (RN §13; fold §7 owner rows, the chair's), so PT-1 and PT-2 are BUILT after RN-3 and LIGHT only where RN-3 lights — they wait on those two owner rows; PT-0 does not (the deed door, the marks, presence, suggestions and the undo need no reading). The first felt chain is therefore **(RN-0 + PT-0) → RN-1 → RN-2 → RN-3 → PT-1 → PT-2**:''')
rep(r'''RN-2 sat in no first felt chain while PT-1 and PT-2 read it.]''',
r'''RN-2 sat in no first felt chain while PT-1 and PT-2 read it.] [CURED 2026-10-18 (fp-final r2) — PT-V3: PT-0 carried the value rows before RN-3 opened their door, and PT-1/PT-2 promised "who has heard and what they think" before any lens existed.]''')
rep(r'''| PT-0 (with RN-0) | the sub-ledger, presence and whereabouts, the deed doors and the marks, the §3.3 value rows, suggestions, the source event's undo | `partyLedger`, `whereabouts`, `deedMark`, `partyValueRows` ·''',
r'''| PT-0 (with RN-0) | the sub-ledger, presence and whereabouts (the stamp, `partySeq`), the deed doors and the marks, suggestions, the source event's undo | `partyLedger`, `whereabouts`, `deedMark` ·''')
rep(r'''| PT-1 (after RN-2) | the party's renown reads (RN), the net effect, `partyView` | `netEffect`, `partyView` | the same week: "who has heard and what they think" | aspatial-safe; the default preset: the omniscient arm; persons with C1 |''',
r'''| PT-1 (after RN-3; lights where RN-3 lights) | the §3.3 value rows (registered at RN-3's unit), the party's renown reads (RN), the net effect, `partyView` | `partyValueRows`, `netEffect`, `partyView` | the same week: "who has heard and what they think" | aspatial-safe; lights only after the owner's alignment-25e/-25g (through RN-3); the default preset: the omniscient arm; persons with C1 |''')
rep(r'''| aspatial-safe (graph hops); `hearingWeekEnabled` for the pause; the default preset: requests from courts that know of the party at once inside scope |''',
r'''| aspatial-safe (graph hops); lights where RN-3 lights (it reads regard); `hearingWeekEnabled` for the pause; the default preset: requests from courts that know of the party at once inside scope |''')
rep(r'''| PT-4 | the deed's parts on the road, the reason's term, the doer swap,''',
r'''| PT-4 | the deed's parts on the road, the seen mark, the doer swap,''')
rep(r'''PT-0 READ (the mark's moral weight; the value rows' three coordinates); PT-1/PT-3 THE ENGAGEMENT (RN's lenses on all three axes;''',
r'''PT-0 READ (the mark's moral weight); PT-1/PT-3 THE ENGAGEMENT (the value rows' three coordinates, registered at RN-3; RN's lenses on all three axes;''')
rep(r'''PT-4 READ (the reason's term moves the reading toward the DM's mark, scaled by belief — no longer alignment-empty)''',
r'''PT-4 READ (a seen mark replaces the act's kindness in lens one — RULINGS-ROUND2 A.2)''')
rep(r'''every void its backed deed (`voidsRef`);''',
r'''every void or repudiation its backed deed (`correctsRef`, A.4);''')
rep(r'''[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-15 · PT-r1-15 · PT-r1-10 · PT-r1-19 · PT-r1-14.]''',
r'''[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-15 · PT-r1-15 · PT-r1-10 · PT-r1-19 · PT-r1-14.] [CURED 2026-10-18 (fp-final r2) — PT-V3 · PT-r1-10 (A.2) · PT-r1-14 (A.4).]''')

for old, new in R:
    c = s.count(old)
    if c != 1:
        print('MISMATCH count=%d for: %s' % (c, old[:120].replace('\n', '\\n')))
        sys.exit(1)
    s = s.replace(old, new)

# E25 §11.3 marker-based
start = "What it CAN carry is the one thing the DM told the engine about the act: `moralWeight`. Therefore:"
end = "RN's half, listed for the chair.]"
i = s.find(start); assert i >= 0 and s.count(start) == 1, 'start'
j = s.find(end, i); assert j > i, 'end'
j += len(end)
new113 = r'''What it CAN carry is the one thing the DM told the engine about the act: `moralWeight`. THE RULE (RULINGS-ROUND2 A.2 — RN §6.1's law, scoped by PT's visibility): the DM's mark REPLACES the derived band for every reader THAT CAN SEE IT. A hearer sees it when (1) the deed carries a marked `moralWeight`; (2) its version shows the reason part — proof `spoken` or `shown`, completeness at or above the reason's threshold (§11.1; in the omniscient arm, the whole story inside the scope); and (3) it CREDITS the teller — proof `shown` is always credited (the owner's "making discovery"); a reason only `spoken` is credited unless the party's word is `discredited` in the hearer's town (RN §7's band at that town, `partyCredibilityAt`; the doer's own holder for a paragon). For such a hearer lens one reads the act with `kind01` at the marked band's centre (DRAFT `heroic` 0.92 · `admirable` 0.73 · `neutral` 0.5 · `shameful` 0.27 · `villainous` 0.08); `law01` and `force01` stay the act's own, because the band is a `kind01` scale (RN §6.1: "by `kind01` edges") and the mark says how the act looks, not how lawful or how violent it was. Lens two is untouched (whom the act helped or hurt is no reason's to change). Every other hearer — no weight marked, `unspoken`, the reason weathered away, or a merely told reason from a discredited party — reads the derived inherent value: the act alone. The DM's own view always shows the marked weight. Consequences, each pinned (§17): the zero-click default `spoken` softens nothing unless the DM marked a weight, so no deed carries a phantom reason; the owner's orphanage burned for the infestation and TOLD reads with an admirable kindness to every hearer whose version shows why (save where the party's word is worth nothing), and SHOWN, to every one of them; burned "without telling anybody" (`unspoken`) it reads villainous to every good hearer; three towns over, where the reason fell away, it reads villainous too. [CURED 2026-10-18 (fp-final r1) — PT-r1-10: neither volume gave a told reason a term (RN's lens formulas had none; only the backing had one), so `proof` changed the visibility of a part with no effect, and the default `spoken` asserted a reason the DM never authored.] [CURED 2026-10-18 (fp-final r2) — PT-r1-10 (RULINGS-ROUND2 A.2): round 1's `kind01 + (marked01 − kind01) × belief` leaned toward the mark where RN §6.1 replaces it; both volumes now say "replaces, for every reader that can see it" · PT-V2: round 1 moved `law01` and `force01` toward a `kind01` band's centre too, so a believed `villainous` mark read +0.23 — approval — to a balanced, chaotic, peaceful holder under RN §6.2's lens one; the mark now moves `kind01` alone (P36).] [REFINED 2026-10-18 (fp-final r2) — RN §6.2's "the doer's credibility weight AT THE HEARER … scales how far a told reason is believed" is carried as the crediting test (a discredited party's told reason is not credited; a shown one always is), so A.2's replacement stays whole and the persisted credibility (A.1) keeps its reader here; RN §6.1's "for every reader" and §6.2's "scales" are RN's to restate in the same words. Vetoable.]'''
s = s[:i] + new113 + s[j:]
open(path, 'w', encoding='utf-8').write(s)
print('part3 applied', len(R) + 1, 'replacements')
