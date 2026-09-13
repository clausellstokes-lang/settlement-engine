#!/usr/bin/env python3
"""Render validation-prose.md: measurements, opener variety, full refutation ledgers, craft, GM reading, verdict."""
import json, re
S = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad'
D = json.load(open(f'{S}/faces.json'))
F = D['faces']; CRAFT = D['craft']
ORDER = F['shipped']['order']
STOP = set('the a an and or of to in at is are was be been it its this that with no not nor neither what for on by has have had as from'.split())
def tok(x): return [w.lower().strip('.,;:?!') for w in x.split()]

# ── VERDICTS ──────────────────────────────────────────────────────────────────
# key: (pool_no 1..26, face_no 1..n) → 'VERDICT | ground'. Default PASS.
# FAIL  = denied on EVERY town the key matches (or a floor-2 grammar breach).
# COND  = denied on a NAMED subset of matching towns (row named). H = the subset is
#         essentially every generated town of the tier the key reaches; L = a small subset;
#         C = contestable (a table row exists but the same-page machine line agrees with the face).
RECUT = {
 (1,4):  "COND-H F1-24/F1-03 | 'The roll … says who can be put out' cites a muster roll; the only roll-keeper is `Citizen militia` (holderTable.js:279-288: 'a town with a Garrison and no militia has men under arms and no roll of them'). Garrison rows are Barracks (town) / Garrison (city); militia rows stop at town and are excluded by the required Town watch group — so on every generated town this pool draws for, the roll has no keeper.",
 (3,4):  "COND-L F1-06 | 'whose business it is to meet what walks in … is not settled' — denied where an `Adventurers' charter hall` row stands (hamlet 0.12 / village 0.12: 'coordinates local defense'); the key does not exclude the charter bucket.",
 (6,5):  "COND F1 economicGates.military<1 | 'the provision goes into the accounts as one line with no note against it' — DefenseTab.jsx:343 prints `Upkeep underfunded: … at N%` under the row, and DS-DEF-11 draws WALLED-STRAINED on the same tab, whenever the gate < 1 (econOutput < 50).",
 (6,8):  "COND F1 economicGates.military<1 | 'The charge for the works … falls in full … the entry goes in without comment' — same field; the fundingNote is the comment.",
 (7,4):  "FAIL F1-page (contestable under R-1) | 'Why nothing stands round {settlement} is entered nowhere … the record gives none' — DS-DEF-11 UNWALLED-SMALL ('too small to wall and knows it') / UNWALLED-LARGE ('spending its defense money on something else, and the books say what') prints a reason on the same tab for every unwalled town. Prose-vs-prose, so R-1 may file it WIRING rather than F1; either way the page contradicts itself.",
 (11,10): "COND-H F1 row desc | 'The garrison … is quartered among houses' — the garrison row a walled-less town can hold is `Barracks` (institutionalCatalog.js:1363, R-3: 'housing for guards or small garrison'); `Garrison` is city-only and city walls are required, so every generated town this pool draws for has a barracks the face denies.",
 (11,12): "COND-H F1 row desc | 'The men under arms are behind those doors … a fight here would find them at home' — same Barracks row.",
 (13,2): "COND-H(town) F1-25/F4-19 | 'nothing in it is drilled' / 'no barracks' — at town tier `Town watch` is required:true ('Part-time guards. Night patrol and gate duty.') and its wages arm the military purse (F4-19). PASS at village and below.",
 (13,3): "COND-H(town) F1-25 | 'at {settlement} neither head carries anything' — the men's head carries watch wages at town tier (defenseGenerator.js:163 military += 7 for hasWatch; F4-19).",
 (13,5): "COND-H(town) F1-25 | 'soldiers want paying. None of it is done at {settlement}' — watch wages are paid at town tier; also a `Mercenary company` row where present.",
 (13,6): "COND-H(town) F1-25 | 'Nothing at {settlement} is quartered or drilled at the town's own charge' — the required Town watch is at the town's charge.",
 (13,7): "COND-L F1-05 | 'keeps neither soldiers nor drilled men' — denied where a mercenary row stands (contracted soldiers).",
 (14,1): "COND-C F1-12 | 'a person is kept in another. The second waits on the first' — detention pending a hearing is criminal procedure; `hasCourtSystem` fires on the required `Town hall` ('Meeting place and administrative center'), and `Multiple courthouses` exists only at metropolis. The same-row machine line ('Full legal infrastructure provides enforcement capacity') agrees with the face, so a GM sees no contradiction on the page.",
 (14,2): "COND-C F1-12 | 'Before a magistrate … a dispute is heard out. In the cells a person waits on the same hearing' — same ground.",
 (14,3): "COND-C F1-12 | 'the papers settle who goes home' — a verdict releasing prisoners; same ground.",
 (14,7): "COND-C F1-12 | 'Two ways lead out of the cells … a decision or a payment' — a sentence; same ground.",
 (14,12): "COND-C F1-12 | 'Whether it ends in the cells or in a fee' — a sentence; same ground.",
 (15,1): "COND-C F1-12 | 'What answers it is a fine or a banishment' — a criminal sentence on a hall-only court (Town hall required at town; prison row absent by key). Machine line 'Courts prosecute but limited detention' agrees with the face.",
 (15,2): "COND-C F1-12 | 'answered in coin or in distance' — same.",
 (15,3): "COND-C F1-12 | 'Coin and the road are what {settlement} sets against a wrong' — same.",
 (15,4): "COND-C F1-12 | 'What leaves that table is coin, or a person on the road' — same.",
 (15,5): "COND-C F1-12 | 'charges money or sends the person off' — same.",
 (15,6): "COND-C F1-12 | 'the town takes coin or an empty house' — same.",
 (15,7): "COND-C F1-12 | 'paid for or walked away from' — same (weak).",
 (15,8): "COND-C F1-12 | 'A fine is nothing to a house that can pay it, and the road is hardest …' — same.",
 (15,9): "COND-C F1-12 | 'The one who will neither pay nor go' — same.",
 (15,11): "COND-C F1-12 | 'A fine and a departure are near to hand' — same.",
 (15,12): "COND-C F1-12 | 'Paying or walking is that person's own choice' — same.",
 (18,7): "FAIL F2-05 | 'A bad season here would not change the shape of the week' — a modal-future course over a season (the table's own example shape: 'would not last a winter'); also denied outright on a STRONG town under `under_siege`/`famine` stress, whose banner prints 'Land-based economic activity is suspended'.",
 (18,10): "COND-C F1-25 | 'Nothing at {settlement} is set aside to pay for what is going wrong' — STRONG is storage-driven (defenseGenerator.js:256-270) and `Town granary` is required at town+ ('Buffers harvests, prevents famine'); row 5 on the same box prints 'Granary provides food buffer'. Contestable: the face says coin, the row holds grain.",
 (21,1): "COND-H(town) F1-25 | 'somebody to send them. At {settlement} the asking finds nobody it belongs to' — at town+ the roster carries a required Town watch and Town hall (and a Barracks / charter hall where rolled); the band is `scores.economic`, a money-and-storage measure, and says nothing about organisation.",
 (21,2): "COND-L F1-25 | 'whose errands they are is a question the town leaves open' — weak form of the same denial.",
 (21,3): "COND-H(town) F1-25 | 'none of that would be arranged beforehand' — a charter hall 'coordinates local defense'; a watch and hall are standing bodies.",
 (21,6): "COND-H(town) F1-25 | 'nothing in the town is set up to do it' — same.",
 (21,8): "COND-H(town) F1-25 | 'When something serious begins, nothing in the town begins with it' — same; safetyProfile prints 'The citizen militia … reliable in a crisis' where a militia stands.",
 (21,9): "COND-L F1-25 | 'somebody ought to, and the sentence stops there' — weak form.",
 (21,10): "COND-H(town) F1-25 | 'would fall on people who have work of their own' — a Barracks garrison has no other work; a watch is the town's paid body.",
 (21,12): "COND-H(town) F1-25 | 'nobody can say who would begin it' — same.",
 (26,3): "COND-L F1-25 | 'no one at {settlement} holds either office [sick-house]' — at village `Parish church` is required and the same row prints 'Parish clergy provide basic wound care'; the key does not consult the church (defenseStateProse.js: 'A CHURCH COUNTS AS MEDICAL PROVISION ONLY IN THE GRANARY BRANCH').",
 (26,5): "COND-H(village) F1-25 | 'when somebody falls ill the same [neighbour's] door is knocked on. Neither has a door of its own' — the required village Parish church is a door for the sick on the engine's own line.",
 # the two pools the re-cut annex still carries as SHIPPED three-liners
 (10,1): "FAIL F2-05 + COND-H F1-25 | 'nobody to put on them' — Town watch is required at town (gate duty); 'A determined attacker takes this town' is a flat prediction (the machine line predicts it too, but F2 is grammar-decidable).",
 (10,2): "COND-H F1-25 | 'a serious absence of anyone standing in it' — the required Town watch stands gate duty.",
 (10,3): "COND-H F1-25 | 'not the people who would use it' — same.",
 (19,1): "FAIL F2-02 | 'begins eating reserves within a few months' — a duration the read does not hand you (the machine line says 'within months' too).",
 (19,2): "FAIL F2-06/F2-08 | 'every season of pressure moves the finite part closer' — a rate and a trend.",
 (19,3): "FAIL F2-02 + F2-04 | 'a few months past the beginning' and 'has not been asked to find out' — a duration and a history.",
}
SHIPPED = {
 (1,1): "FAIL F2-06 | 'both are in use constantly' — a rate.",
 (1,3): "PASS (note) | 'is being spent doing it' is durative but anchorless; the machine line itself is in the perfect ('have established').",
 (2,1): "FAIL F2-02/F2-05 + COND-H F1-25 | 'cannot supply for more than a night' — a duration; 'nobody to man it' — the required Town watch stands gate duty at town.",
 (2,2): "COND-H F1-25 | 'long stretches of good work with nobody on them' — the required Town watch.",
 (2,3): "FAIL F2-08/F2-06 | 'doing less each season as the watch thins, and the thinning is not being reversed' — a trend and a rate (slow thinning alone is licensed by R-9; the seasonal clock is not).",
 (3,1): "COND-L F1-06 | 'no specialist recourse' — denied where a charter-hall row stands; the key does not exclude it.",
 (4,1): "FAIL F2-06/F2-05 | 'Most of what comes out of the country will not press … and most of what comes here does not' — a rate and a modal future.",
 (4,2): "FAIL F2-05 | 'has taken it seriously long enough' — an elapsed course.",
 (4,3): "FAIL F2-06 | 'Very little reaches {settlement} out of the wild country' — a rate of incursion.",
 (5,2): "COND F1-27/F1-03 | 'A stranger finds soldiers' — the key is garrison OR militia; a militia is 'Part-time service', not soldiers.",
 (5,3): "FAIL F2-06 | 'costs it something every season' — a rate.",
 (6,2): "COND-C F1 | 'The pressures that matter to this town are internal' — denied where `safetyLabel` prints Very Safe/Safe beside it; contestable (the settled+any machine branch says the same).",
 (7,2): "FAIL F2-05 | 'The town has never needed to think about what is outside it' — a history.",
 (7,3): "FAIL F1-34 + F2-06 | 'in any direction at any hour and meets nothing that would justify a watch' — a totality of safety on a `settled` town (settled only multiplies threat down) and a rate; and at town tier the required Town watch is the watch the face says nothing justifies.",
 (10,1): "FAIL F2-05 + COND-H F1-25 | 'takes this town with ladders and patience' — flat prediction; 'nobody to put on them' — the required Town watch.",
 (10,2): "COND-H F1-25 | 'a serious absence of anyone standing in it'.",
 (10,3): "COND-H F1-25 | 'not the people who would use it'.",
 (12,3): "FAIL F2-05 + F1 row desc | 'have never stood in a line with anybody' — a history, and the `Citizen militia` row's own description is 'Able-bodied residents drill and muster'.",
 (13,2): "FAIL F2-04 | 'Nothing has come for {settlement}' — an event the record did not run (a negative history).",
 (14,1): "COND-C F1-12 | 'can arrest, try and hold' — a trial on a hall-only court (Town hall required at town).",
 (14,2): "FAIL F2-05 | 'the town has come to rely on that' — an elapsed course.",
 (15,1): "COND-C F1-12 | 'tries offences … the sentences available here are money and exile' — a trial and sentences on a hall-only court.",
 (15,2): "COND-C F1-12 | 'reaches for the purse or the road' — same.",
 (15,3): "FAIL F2-08 | 'Each judgment … costs the next one a little of its weight … spending down a reputation' — a trend.",
 (16,3): "FAIL F2-05 (weak) | 'has learned not to ask' — a perfect.",
 (17,2): "FAIL F2-06 (weak) | 'does not always settle them well' — a rate over outcomes.",
 (18,1): "COND-H F1-02 | 'the garrison can be kept paid' — STRONG towns at town tier have no garrison row (Garrison is city-only; a Barracks is optional); the face names a body the roster usually lacks.",
 (18,3): "FAIL F2-04/F2-06 | 'has not turned into a collapse' — a history; 'mostly does' — a rate.",
 (19,1): "FAIL F2-02 | 'within a few months'.",
 (19,2): "FAIL F2-06/F2-08 | 'every season of pressure moves the finite part closer'.",
 (19,3): "FAIL F2-02 + F2-04 | 'a few months past' and 'has not been asked'.",
 (20,1): "FAIL F2-05 (weak) | 'Chronic shortfall' — an elapsed course (the machine line says 'Chronic underfunding'; F2 is grammar-decidable).",
 (20,2): "PASS (note) | 'already owed … have not forgotten' — arrears without a figure is the licensed extreme (F4-04: short, late, thin).",
 (20,3): "FAIL F2-08/F2-06 | 'chronic … each season of it removes a little more' — a trend and a rate.",
 (21,1): "FAIL F2-05 (weak) | 'exhausts the town's capacity almost immediately and then continues' — a predicted course.",
 (21,2): "FAIL F4-10 | 'each thing that goes wrong makes the next thing cheaper to happen' — crises compounding; the engine rolls stresses independently (stressGenerator.js:339-346).",
 (21,3): "PASS (note) | 'a bad month' is a unit of hardship, not a date.",
 (23,3): "FAIL F1-14 + F2-01 | 'a modest infirmary' — the key is hasHospital FALSE; 'a full store' — a magnitude the read does not carry.",
 (24,2): "FAIL F2-05 + F2-03 | 'The stores will carry … Nothing here will carry … the town has not built anything' — modal future twice and a building narrated.",
 (25,1): "PASS (note) | 'treat and contain an outbreak' on a village Healer person — the machine says 'containment' only for hospital infrastructure, but the row does not deny it.",
 (25,3): "FAIL F2-04 | 'the sickness it has seen and … the hunger it has not' — a past outbreak the record did not run.",
 (26,1): "COND-H(village) F1-25 | 'has nobody to treat the sick' — the required village Parish church; the same row prints 'Parish clergy provide basic wound care'.",
}
LICENCE = {
 (26,7): "COND-H(village) F1-25 | 'without anywhere for the sick' — the required village Parish church (clergy tend the sick on the engine's own line).",
}
# licence 'has built' ×13 and the durative 'stays / goes on' ×4 adjudicated PASS: 'what the town has built' is a periphrasis for the works, not a raising narrated; the duratives carry no anchor.

def verdict_of(name, p, i):
    tbl = {'recut': RECUT, 'shipped': SHIPPED, 'licence': LICENCE}[name]
    return tbl.get((p, i), 'PASS')

def cls(v):
    if v.startswith('FAIL'): return 'FAIL'
    if v.startswith('COND'): return 'COND'
    return 'PASS'

out = []
W = out.append
W('# VALIDATION — IS THE RE-CUT BETTER? DS-DEF-2, three versions, refuted face by face')
W('')
W('*Fable judge, 2026-09-12. Read-only on the repo. Revisions: SHIPPED `f2da5a3ee` · LICENCE `471ce894a` · RE-CUT round 1 `a3e877e6e`. Dock for the engine: `scratchpad/dock-f2da5a3ee`. Instrument: `docs/rewrite-retro-2026-09-12/evidence/measure-prose.py` at budget 1900. Law: `evidence/CONTRADICTION-TABLE.md` (floors 1–4, §R). Every figure marked CONFIRMED was executed in this session; every judgment marked PLAUSIBLE is reasoning from the code and the table, not a rendered dossier.*')
W('')
W('## 0. What the three annexes hold (CONFIRMED)')
W('')
W('| version | pools | faces | shape |')
W('|---|---|---|---|')
W('| shipped `f2da5a3ee` | 26 | 78 | 3 stance lines per pool |')
W('| licence `471ce894a` | 26 | 312 | 3 stance lines + 3 `[face]` each = 12 per pool |')
W('| re-cut `a3e877e6e` | 26 | 294 | 24 pools × 12 re-cut faces = 288, plus TWO pools still carrying the shipped three-liners (`walls with NO force`, `Economic ADEQUATE`) |')
W('')
W("The round-1 commit's own account: 24 pools applied, 2 refused, 10 of 26 in band, **owned verdicts FAIL 0 · WITHHELD 0 · PASS 294** — i.e. the Opus refuter found nothing. This ledger is the adversarial test of that claim.")
W('')

# ── 1. measurements
W('## 1. MEASUREMENTS (CONFIRMED — measure-prose.py, budget 1900, plus opener variety computed here)')
W('')
W('| version | units | sample to 1900 tok | DISTINCT words | content types | mean words/unit | `,and` joins | distinct 3-word openers |')
W('|---|---|---|---|---|---|---|---|')
W('| shipped `f2da5a3ee` | 78 | 78u / 1905 | **519** | 489 | 24.4 | 63% | 78/78 (100%) |')
W('| licence `471ce894a` | 312 | 108u / 1902 | **168** | 143 | 17.4 | 74% | 300/312 (96%) |')
W('| re-cut `a3e877e6e` | 294 | 61u / 1906 | **377** | 349 | 27.7 | **85%** | 293/294 (99.7%) |')
W('')
W('Top content words at the budget — shipped: `{settlement}`×58, town×34, can×25, against×20 · licence: country×91, `{settlement}`×88, works×63, town×60, muster×38 · re-cut: `{settlement}`×53, country×40, town×35, garrison×24, works×24, out×21, muster×19, wall×17.')
W('')
W('Three readings. (i) The re-cut recovers **73%** of the shipped distinct-word count at equal budget (377/519) where the licence text recovered 32%; content types 349 vs 143. (ii) The re-cut\'s two-clause `,and` join rate is the **highest of the three** (85% vs 63% shipped) — the exemplar pack names that rate as "our measured failure" and the round-1 drafts made it worse, not better; the joins are mostly earning their place (cost/contrast/withholding), but the construction tic is intact. (iii) First-three-word opener variety saturates in BOTH rewrites (96% / 99.7%), so opener variety does not discriminate — the licence text varied its openers and was still flat. Construction collapse lives in the content vocabulary, which §5 measures per pool.')
W('')
W('Per-pool opener variety (distinct first-3-word openers / faces):')
W('')
W('| pool | shipped | licence | re-cut |')
W('|---|---|---|---|')
for p, pool in enumerate(ORDER, 1):
    row = []
    for name in ('shipped','licence','recut'):
        fs = F[name]['pools'][pool]
        ops = set(' '.join(tok(f['text'])[:3]) for f in fs)
        row.append(f'{len(ops)}/{len(fs)}')
    W(f'| {p}. {pool} | {row[0]} | {row[1]} | {row[2]} |')
W('')

# ── 2. ledgers
W('## 2. REFUTATION LEDGERS (every face, every version)')
W('')
W('Verdict vocabulary. **FAIL** — denied on every town the key matches, or a floor-2 grammar breach. **COND** — denied on a named subset of matching towns; **-H** the subset is essentially every generated town of the tier the key reaches (the roster row is `required`), **-L** a small subset, **-C** a table row exists but the same-page machine line agrees with the face, so the contradiction is table-visible and not page-visible. **PASS (note)** — passes with a remark. The pool keys are the corpus\'s (`defenseStateProse.js:393-597`): beasts `force = garrison || militia`; `settled country, perimeter` ignores the force; invasion: garrison outranks militia; disaster: the church is consulted only in the granary branch. Tier facts that drive the conditionals (institutionalCatalog.js, CONFIRMED): `Town granary` and `Parish churches (2-5)` and `Town hall` and `Town watch` are all `required: true` at town; `Garrison` and `Professional city watch` are city-only; `Barracks` is the only town-tier garrison row; `Citizen militia` rows stop at town; `Small hospital` (town, 0.3) is "Usually religious-run"; `Healer (divine, 1st level)` is a village row and a person; `Small prison/stocks` (town, 0.7) "Holding cells and public punishment"; `Multiple courthouses` is metropolis-only.')
W('')
W('Consequences for the keys (PLAUSIBLE, from the catalog): the no-reserves pools (25, 26) fire only at village and below; `granary, NO medical` (24) and `detention without process` (16) cannot fire on a generated town at all (church and hall are required wherever a granary or a prison exists) — they are custom-roster pools; `court without detention` (15) fires on roughly a third of towns and its "court" is the Town hall.')
W('')
for name, label in (('recut','RE-CUT a3e877e6e'),('shipped','SHIPPED f2da5a3ee'),('licence','LICENCE 471ce894a')):
    W(f'### 2.{ {"recut":1,"shipped":2,"licence":3}[name] } {label}')
    W('')
    counts = {'FAIL':0,'COND':0,'PASS':0}
    floors = {}
    for p, pool in enumerate(ORDER, 1):
        fs = F[name]['pools'][pool]
        W(f'**{p}. {pool}**')
        W('')
        W('| # | stance | face | verdict |')
        W('|---|---|---|---|')
        for i, f in enumerate(fs, 1):
            v = verdict_of(name, p, i)
            c = cls(v); counts[c] += 1
            if c != 'PASS':
                for m in re.findall(r'F[1-4]-\d\d|F1-page|F[1-4]\b', v.split('|')[0]):
                    floors[m] = floors.get(m, 0) + 1
            t = f['text'].replace('|','\\|')
            W(f'| {i} | {f["stance"]} | {t} | {v.replace("|","—")} |')
        W('')
    D.setdefault('counts', {})[name] = counts
    D.setdefault('floors', {})[name] = floors
    n = sum(counts.values())
    W(f'**{label} totals (CONFIRMED count of the verdicts above):** {n} faces · FAIL {counts["FAIL"]} · COND {counts["COND"]} · PASS {counts["PASS"]}. Floor tallies over the non-PASS verdicts: ' + ', '.join(f'{k} ×{v}' for k, v in sorted(floors.items())) + '.')
    W('')

# ── 3. summary
W('## 3. REFUTATION LEDGER SUMMARY')
W('')
rc, sc, lc = D['counts']['recut'], D['counts']['shipped'], D['counts']['licence']
# recut split: 288 new + 6 residual shipped
res = [(10,1),(10,2),(10,3),(19,1),(19,2),(19,3)]
res_fail = sum(1 for k in res if RECUT[k].startswith('FAIL')); res_cond = sum(1 for k in res if RECUT[k].startswith('COND'))
new_fail = rc['FAIL'] - res_fail; new_cond = rc['COND'] - res_cond
W('| version | faces | FAIL (every matching town / floor-2 grammar) | COND (named subset) | flagged total | flagged rate | floor-2 breaches | floor-1 findings | floor-4 |')
W('|---|---|---|---|---|---|---|---|---|')
sh_f2 = sum(1 for v in SHIPPED.values() if re.search(r'F2-', v.split('|')[0]))
sh_f1 = sum(1 for v in SHIPPED.values() if re.search(r'F1', v.split('|')[0]))
sh_f4 = sum(1 for v in SHIPPED.values() if re.search(r'F4', v.split('|')[0]))
W(f'| shipped | 78 | {sc["FAIL"]} | {sc["COND"]} | {sc["FAIL"]+sc["COND"]} | {100*(sc["FAIL"]+sc["COND"])/78:.0f}% | {sh_f2} faces carry an F2 breach | {sh_f1} | {sh_f4} |')
W(f'| licence | 312 | {lc["FAIL"]} | {lc["COND"]} | {lc["FAIL"]+lc["COND"]} | {100*(lc["FAIL"]+lc["COND"])/312:.1f}% | 0 | 1 | 0 |')
W(f'| re-cut (288 new faces) | 288 | {new_fail} | {new_cond} | {new_fail+new_cond} | {100*(new_fail+new_cond)/288:.1f}% | 1 | {new_fail+new_cond-1} | 0 |')
W(f'| re-cut annex as it stands (294 incl. 6 residual shipped) | 294 | {rc["FAIL"]} | {rc["COND"]} | {rc["FAIL"]+rc["COND"]} | {100*(rc["FAIL"]+rc["COND"])/294:.1f}% | | | |')
W('')
W('Strip the contestable F1-12 class (16 re-cut faces where the page\'s own machine line "Courts prosecute" / "Full legal infrastructure" agrees with the face) and the re-cut\'s flagged rate on its 288 new faces is **24/288 = 8.3%**, of which 2 are unconditional. The shipped corpus\'s unconditional rate is 27/78 = 35%, nearly all floor 2. The licence text is lawful to the point of one conditional.')
W('')
W('**The five worst re-cut failures, quoted with the denying field:**')
W('')
W('1. `plagued, perimeter AND organized force` #4 — *"The roll at {settlement} says who can be put out … Both entries stand in the record."* Denied by the roll holder: `holderTable.js:279-288` — "ONE institution in the whole shipped roster keeps a muster: the Citizen militia. A town with a Garrison and no militia has men under arms and no roll of them." The pool is keyed on a garrison; no generated roster pairs one with a militia. F1-24.')
W('2. `force with NO walls` #10 — *"The garrison at {settlement} is quartered among houses, and a stranger goes by it without knowing."* Denied by the only town-tier garrison row, `Barracks` (`institutionalCatalog.js:1363`, "housing for guards or small garrison", R-3). F1 on the row\'s own description.')
W('3. `Economic CRITICAL` #8 — *"When something serious begins, nothing in the town begins with it."* Denied at town tier by the required `Town watch` and `Town hall` rows and by any `Barracks` or charter hall; the band is `scores.economic`, a coin-and-storage measure that carries no organisation fact. F1-25 — the pool reads a money band as an absence of bodies.')
W('4. `settled, nothing organized` #4 — *"Why nothing stands round {settlement} is entered nowhere … because the record gives none."* On the same tab DS-DEF-11 prints UNWALLED-SMALL "too small to wall and knows it" or UNWALLED-LARGE "spending its defense money on something else, and the books say what." The page gives a reason in the next box. F1 at page grain (R-1 may file it as WIRING; the self-contradiction stands either way).')
W('5. `Economic STRONG` #7 — *"A bad season here would not change the shape of the week."* F2-05: a modal-future course over a season, the table\'s own example shape ("would not last a winter"); and false outright on a STRONG town whose stress banner reads "Land-based economic activity is suspended".')
W('')
W('Runner-up class: `neither walls nor force` #2/#3/#5/#6 — *"Nothing at {settlement} is quartered or drilled at the town\'s own charge"* — at town tier the required `Town watch` is paid from the military purse (F4-19). PASS at village.')
W('')
W('**What I hunted for and did not find in the re-cut.** Floor-2 aspectual and rate claims: the lexical scan of all 288 faces surfaced only "older work than" ×2 (freed by F2-07, and the exemplar pack\'s own aimed move), "never" ×4 (all scoping, none a frequency over events), "again" ×1 (enumerative), "already" ×1 (stative), "will" ×4 (all habitual refusals — "nobody will say why"), and the one modal course above. No "still", "no longer", "lately", "these days", "most nights", "for years", "since", no count, no date. `plagued` is read as monsters in all 36 plagued faces; `settled` as the quiet tier in all 24; no purse is split against the two-purse model (both "one purse" faces agree with F4-02/F4-03); no wall decays on a clock; no named person, no god acts. The re-cut\'s predicted failure mode did not materialise. Its ACTUAL failure mode is floor 1 by inference — a face that fills the silence with a body-shaped claim (a roll, quarters, "nobody to send", "no note") that a required roster row or a same-tab sentence denies.')
W('')

# ── 4. GM reading
W('## 4. GM READING — five pools, three versions side by side (PLAUSIBLE: a reader\'s judgment)')
W('')
GM = [
 (3, 'plagued, NO perimeter and NO force',
  'RE-CUT', 'The re-cut is the only version that hands a Thursday-night GM something to run: loose stock in the road after dark, a stranger\'s shutter barred from the inside, "what is heard out there is not always stock." The shipped lines are good but generic (the stranger "understands the danger before anybody explains it"); the licence lines are a receipt. All three are true to the machine line beside them ("no organized defense and no perimeter").',
  'A stranger arriving at {settlement} understands the danger before anybody explains it, because nothing about the place is arranged as though danger were expected to be met.',
  'Out in monster country {settlement} keeps neither works nor muster.',
  'The argument at {settlement} is whose stock is loose in the road once the light goes, and not what a loose animal draws in from the fields.'),
 (7, 'settled, nothing organized',
  'RE-CUT (with #4 struck)', 'The shipped pool\'s best line is its unlawful one ("at any hour … nothing that would justify a watch" — a totality on a merely down-multiplied threat, and at town tier a watch is required). The licence pool says "no works and no muster … few beasts" twelve ways. The re-cut\'s "Everything the town keeps up faces inward" is the sentence a GM remembers, and "tracks that go somewhere and nothing set against them" is a scene. Face #4 contradicts DS-DEF-11 on the same tab and must go.',
  'A stranger walks out of {settlement} in any direction at any hour and meets nothing that would justify a watch.',
  'Out of a country low in beasts a stranger comes on {settlement} and finds no works and no muster in the town.',
  'Everything the town keeps up faces inward. The quiet country at its back is the one direction nothing is turned toward.'),
 (12, 'militia only',
  'RE-CUT', 'The shipped line "have never stood in a line with anybody" is a history AND is denied by the militia row\'s own description ("drill and muster"). The licence pool repeats "part-time … not a professional garrison" in every one of twelve faces (content-type ratio 0.23, the lowest in the block). The re-cut gives the GM a muster that "lives in houses" and a defence whose directions "end at people and never at a place" — and is lawful throughout.',
  'A stranger at {settlement} meets armed townspeople who are entirely competent on their own ground and have never stood in a line with anybody.',
  'The people a stranger passes at {settlement} are at their own work behind no wall. Their muster is part-time, not a professional garrison.',
  'On an ordinary day the muster is invisible and those on it are at their trades. It comes out of the houses when it is called, and a force that soldiers for a living is not stopped by a thing that lives in houses.'),
 (15, 'court without detention',
  'RE-CUT (same caveat as shipped)', 'Shipped and re-cut share the F1-12 exposure (a "court" that is the Town hall handing down fines and banishment) and share the page\'s own agreement with them ("Courts prosecute but limited detention"). Given that, the re-cut\'s "A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here" is a faction seed; the shipped "reaches for the purse or the road" is the same thought unlanded; the licence "under it stands no gaol" is a field printed as a sentence.',
  "The town's law can name a wrong and cannot keep the person who did it, so it reaches for the purse or the road.",
  'Law here is formal, and under it stands no gaol.',
  'A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here. Naming is what the law can do; keeping is not.'),
 (26, 'NO reserves, NO medical provision',
  'RE-CUT', 'Only reachable at village and below, where a parish church is required — so every version that says "nobody / nowhere for the sick" brushes the clergy line on the same row; the re-cut does it once (#5), the shipped once (#1), the licence once (#7). Past that, the re-cut\'s "a name and a door" is the whole village in seven words and it is true; the shipped "directed to neither, because there is neither" is a good dry note; the licence is inventory.',
  'A stranger looking for the granary or the sick-house at {settlement} is directed to neither, because there is neither.',
  'A stranger crossing {settlement} passes no infirmary, and sees no storehouse for grain.',
  'The answer a stranger gets at {settlement}, whether he asks after the store or after the sick-house, is a name and a door.'),
]
for p, pool, pick, why, s, l, r in GM:
    W(f'### {p}. {pool} — pick: **{pick}**')
    W('')
    W(why)
    W('')
    W(f'- best shipped: *{s}*')
    W(f'- best licence: *{l}*')
    W(f'- best re-cut: *{r}*')
    W('')
W('One pool where the re-cut is WORSE than shipped on truth-to-tab: `Economic CRITICAL`. The shipped lines are about money ("cannot fund a response … nothing to spend") and match the badge beside them; the re-cut moved the whole pool to organisation ("nobody it belongs to", "nothing in the town is set up to do it"), which the band does not carry and a town-tier roster denies. It reads beautifully and it is the wrong fact.')
W('')

# ── 5. craft
W('## 5. CRAFT — the pool-grain DULL test on the 24 re-cut pools (CONFIRMED metrics; PLAUSIBLE verdicts)')
W('')
W('Metric: distinct content words / content tokens across the 12 faces (`{settlement}` and stop-words excluded), the words repeated most, the `,and` join count, and distinct openers. The licence pools ran 0.16–0.49 on the same ratio (median 0.34); the re-cut runs 0.51–0.72 (median 0.61). DULL is called where a single content skeleton (the same nouns in the same relation) appears in ≥10 of 12 faces.')
W('')
W('| pool | types/content | ratio | most repeated | `,and`/12 | verdict | the collapse named |')
W('|---|---|---|---|---|---|---|')
DULL = {
 'Beasts & Monsters: `plagued`, perimeter but NO force to hold it': 'DULL — "no garrison and no militia" + "plagued" + "the works" in 12/12; garrison×12, militia×12, plagued×11, works×11. The particulars (animals in before dusk, water in company, stores against the inner face) are good and are buried under the same three-noun receipt every time.',
 'Beasts & Monsters: `plagued`, NO perimeter and NO force': 'DULL — the negation triad "no wall, no garrison, no muster" in 12/12 (garrison×12, muster×12). The strongest particulars in the block (loose stock, the barred shutter) and still every face pays the same toll.',
 'Invasion & War: neither walls nor force': 'DULL — "no wall / no soldiers of its own / no drill / no roll" in 11/12; against×9, soldiers×7, own×7.',
 'Disasters & Famine: granary AND hospital': 'DULL — "grain … house that answers sickness … religious" in 11/12; grain×11, sickness×11, house×10; ratio 0.54.',
 'Disasters & Famine: granary AND parish care only': 'DULL — "granary / the parishes / no hospital" in 12/12; granary×10, parishes×9.',
 'Disasters & Famine: NO reserves, hospital present': 'DULL — one construction, the antithesis "X for the sick, nothing for hunger", in 12/12; against×11; 11/12 openers.',
}
NOTE = {
 'Invasion & War: walls AND professional garrison': 'PASS (borderline) — "the work + the men + the wage" skeleton in 10/12 (men×11, work×9), but the moves differ (books, clerk, charge, children, travellers, argument).',
 'Invasion & War: force with NO walls': 'PASS (borderline) — the raid/siege antithesis in 4/12 and "men can be gone around" in 3/12; ratio 0.52 is the second-lowest.',
 'Internal Security: court without detention': 'PASS (borderline) — "coin or the road / nobody is kept" in 10/12 but through six different rooms (book, line, table, door, houses, permit).',
}
for pool in ORDER:
    if pool not in CRAFT: continue
    c = CRAFT[pool]
    v = DULL.get(pool) or NOTE.get(pool) or 'PASS'
    verdict = v.split(' — ')[0]; named = v[len(verdict)+3:] if ' — ' in v else ''
    W(f'| {pool} | {c["types"]}/{c["content"]} | {c["ratio"]:.2f} | {", ".join(f"{k}×{n}" for k,n in c["top"][:4])} | {c["and"]} | **{verdict}** | {named} |')
W('')
W('**CRAFT tally: 18 PASS · 6 DULL** of 24 re-cut pools. The DULL six are exactly the pools whose key is a conjunction of absences or a fixed pair (no-garrison-no-militia, no-wall-no-force, grain-and-sickness): the writers restated the key in every face and hung a particular on it. The PASS pools are the ones whose faces stand in different rooms (the books, the gate, the road, the argument) and let the key stay implicit.')
W('')

# ── 6. verdict
W('## 6. VERDICT')
W('')
W('**Is the re-cut better?** Yes on vividness, yes on lawfulness against the shipped corpus, no against the licence text, and the risk the owner is buying is a specific, nameable one. (a) Vividness, CONFIRMED: at an equal 1,900-token budget the re-cut carries 377 distinct words and 349 content types against the licence text\'s 168/143 and the shipped 519/489; its per-pool content-type ratio doubles the licence text\'s (median 0.61 vs 0.34); 18 of 24 pools pass the DULL test. Its `,and` join rate (85%) is the worst of the three and its mean unit is the longest (27.7 words) — the drafts are richer, not tighter. (b) Lawfulness, CONFIRMED counts / PLAUSIBLE grounds: on 288 new faces the re-cut has 2 unconditional failures (0.7%) and 38 conditional ones (13.2%), 16 of those contestable because the page\'s own machine line agrees with the face; the shipped corpus has 27 unconditional failures on 78 faces (35%, 25 of them floor 2) and 11 conditional; the licence text has 0 and 1. So the re-cut removes the floor-2 disease almost entirely (one modal course in 288 faces, where the shipped had one every three lines) and replaces it with a smaller floor-1 exposure of a different kind. (c) The risk, PLAUSIBLE from the keys and the catalog: the re-cut\'s floor-1 exposure is not random — it is concentrated where a face fills a key\'s silence with a BODY the roster can deny: a muster roll on a garrison town (no keeper exists), a garrison "among houses" (the only town garrison row is a barracks), "nobody is set up to respond" on a CRITICAL money band (every town has a required watch and hall), "no note against it" on an underfunded gate (the funding note prints under the row). By tier: on a generated town-tier settlement, roughly 24 of the 288 faces (8%) would print beside a roster row or a same-tab sentence that denies them, and about 16 more sit on the contestable Town-hall-as-court seam; on a village nearly all of those go quiet and the exposure falls under 3%. After the pulse moves the town the picture is the same for all three versions — DS-DEF-2 rows 3–5 read a generation-time snapshot (W-11) and rows 1–2 read live forces — except that the re-cut\'s richer faces carry more incidental claims (a gate, a barracks, a purse) for a ruin or a demotion to falsify. Net: the owner trades a corpus that was one-third unlawful by grammar for one that is ~8% unlawful by inference at the tier that matters, with the prose a GM would actually keep.')
W('')
W('## 7. THE ONE THING')
W('')
W('The re-cut\'s refuter is looking for the wrong crime: it hunted aspect and rate and found none, while every real finding here is a body inferred into a silence — a roll, a barracks, a responder, a note — that a `required: true` roster row denies. Put the tier\'s required rows (Town watch, Town hall, Town granary, Parish churches, village Parish church) in front of the writer and the refuter as the FIRST line of every DS-DEF-2 key card, and the round-2 exposure drops to the two unconditional failures.')
W('')
W('---')
W('*Method receipts: `scratchpad/extract.py` (parsing, opener variety, craft metrics, floor-2 lexical scan) and `scratchpad/render.py` (the verdict tables and this file). The engine reads: `threatAssessment.js:33-196`, `safetyProfile.js:255-400`, `priorityHelpers.js:45-77`, `defenseGenerator.js:159-290`, `defenseStateProse.js:393-597` (keys), `:1055-1067` (DEF-11 key), `defenseDisplay.js:319-320` (fundingNote), `DefenseTab.jsx:322-343`, `holderTable.js:279-288`, `institutionalCatalog.js` rows 335, 763, 845, 867, 925, 1260, 1275, 1332, 1340, 1348, 1363, 1550, 1564, 1814, 1910, 1918-1925, 2268, 2275, 2355.*')

open(f'{S}/validation-prose.md', 'w').write('\n'.join(out) + '\n')
print(json.dumps({'counts': D['counts'], 'floors': D['floors']}, indent=1))
print('new-face recut: FAIL', new_fail, 'COND', new_cond)
