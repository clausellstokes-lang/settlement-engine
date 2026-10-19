import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
R = [
("ONE answer per liege per incursion unit (the episode is the unit's `unitKey`), however many",
 "ONE answer per liege per incursion unit (the episode is the unit's `unitKey`, PS's STABLE unit key — §4.6's round-2b bracket), however many"),
("ONE answer per liege per incursion unit (episode the `unitKey`), an input line on every crossed member's `armed_incursion` card; rows per crossed sworn edge (§4.3) [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 C.Q4] |",
 "ONE answer per liege per incursion unit (episode the `unitKey`), an input line on every crossed member's `armed_incursion` card; rows per crossed sworn edge (§4.3) [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 C.Q4] [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b PS-r2-3: the `unitKey` is PS's stable unit id, never `departTick`, so a held week keeps one answer] |"),
]
for old, new in R:
    n = s.count(old)
    if n != 1:
        print("MISMATCH count=%d for: %s" % (n, old[:90])); sys.exit(2)
for old, new in R:
    s = s.replace(old, new, 1)
block = '''
### §16 — ROUND 2b (2026-10-18, lane D-PL-r2b; every id `skeptic/SEAMS-r2.md` and `skeptic/HOST-r2.md` route to PL, the RULINGS-ROUND2b corrections that reach a PL sentence, and two PL-text items other files routed here; the measurements in `cure/D-PL-r2b.md`, the probes in `cure/D-PL-r2b-probe/`)

| Id | Sev | Disposition |
|---|---|---|
| SEAMS-r2-10 | MAJOR | CURED (PL's half) — the riders are INSIDE PL-5's summons: an input line on `call_in_answer` (`half_answered` keeps them on the member's roads; the row's `fraction` says what stayed), one hearing and one row per member per war (episode the call-in's `warAnchorKey`); PL withdraws its co-signature of PR's second kind `patrol_order`; `appendRelationshipFealtyRow` is stated as the relationship writer's INTERNAL append, never a door; a summons row is PL's own, minted and never requested, so there is no `riders:` prefix; before PL-5 lands the crown summons no riders (§4.1, §4.6, §7 `call_in_answer` row, §15.12, P44, OD-PL-46, OD-PL-50). PR's half (R-13, §10.3, §11.2, R22, OD-PR-27, PR-4's car-0, §15.1) and PS's citation of the internal append are their lanes'; the fold §3.4 row is the chair's |
| SEAMS-r2-17 | MINOR | CURED — "the CROWN'S ROAD WARDENS" → "the crown's riders" (PR's R-8 struck `warden`) (§15.12) |
| HOST-r2-4 | MAJOR | CURED (PL's half: CONFIRMED) — PL-1 (c) is the text of record: H13 carries `polityOf`'s tuple, additive beside its accepted raw `PolityLink` rows, for the host's borders lens; the map MAY adopt it for its sway — an ask, never a supersession (HR:671's law 10, HR:499). §2's "so the map never re-derives the polity" is re-worded. The owner's word of 05:57 ("i told the mapmaker i do as it suggested", CHAIR-NOTES 9) outranks the round-1 ADDENDUM's "superseded" clause, so this is not a STOP (§2, §9 PL-1, OD-PL-42); the fold's §3.1.26 and INBOX ↳ r1 (a) are the fold half, for P4 |
| RULINGS-ROUND2b HOST-r2-5 | — | CURED — "Patrols stay map-only until the host's PR lights and opens H16" → the host's patrol facts go OUT through the events window (H9); H16 is the map's inbound door, which the host never consumes (§15.12) |
| RULINGS-ROUND2b PS-r2-3/4 | — | CURED — PL's four `unitKey` citations (the incursion episode and the harbouring prefixes) bind to PS's STABLE unit key, never `departTick`, so a held, screened or rerouted week mints no second row and no second relief answer (§4.3, §4.6, P42, OD-PL-46, OD-PL-48) |
| D-CH-r2 §5.1 (CH-r1-9's third carrier, routed to PL) | MINOR | CURED — §14.7 points at CH §6.2's THREE faith carriers: the 3a ENTRY carrier (`paragonFaithCarriers` → `religionState.js :: attemptEntry`, the step "3a. entries" read on master), the 3b multiplicand on `strengthByRef`, and the birth-side stressor gate row |
| PS-r2-25 | MINOR | CURED (PL's row) — the army-transit exemption reads "transit, not a decision"; "passage" in PL names only the charter's toll right (§3.4); the fold §5 register row is the chair's |
| RULINGS-ROUND2b, every other row | — | NOTED — read against PL (`cure/D-PL-r2b-probe/round2b-grep.out`): PL has no passage on the navy, the sea or a harbour (its five "harbour" hits are the act of harbouring the crown's enemy), the weather or a pass, the gate's keeper, the corps, an envoy's interception, a site's funding band or keep, the patrol envelope or its fast half, so STOP-PR-0/1/2, PR-r2-1/-2/-5, SEAMS-r2-2, SEAMS-r2-6, PS-r2-1/-2, HOST-r2-1, HOST-r2-3, ST-r2-1/-4/-5/-7, FOLD-V1/-V2 and OD-PT-28 change nothing here; PL's scutage already says "W-COIN's treasury, when lit" |

REFINED in round 2b (each bracketed where it sits): the root's own read and the sub-vassal line for the crown's riders, written for PR to cite (SEAMS-r2-20, routed to PR; §15.12); `riders_quartered` registered in §15.9's closed incident list at THE PATROLS' request, with `appointment_imposed`'s match of the landed revanchism wound set stated (§15.9, §2 census, OD-PL-51); OD-PL-33's garrison sentence aligned with HOST-r2-9's split (site garrisons THE SITES', the seat's force band a slot; no PL term reads either).
'''
s = s.rstrip('\n') + '\n' + block
open(path, 'w', encoding='utf-8').write(s)
print('ok')
