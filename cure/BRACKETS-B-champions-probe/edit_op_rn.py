#!/usr/bin/env python3
# BRACKETS-B-champions — OP (F.4 re-attribution + route 4's three lines) and RN (H.2, one bracket). Insertions only.
import sys
T = 'ADDED 2026-10-20 (fp-final P6c; '
OWNER_1244 = '"laslty, with the champion system champions and villains should also have a patron diety option that would also contribute to their decision makings"'
LESS = ('"a lawful god\'s sworn lies less readily" reads: less readily than a CHAOTIC god\'s of the same good-evil axis (CH S68 — the law half is monotone; '
        'EXECUTED, `cure/D-CH-PD-r1-probe/lean2.out.tsv`: the `information` villain face under a good god 0.957 · 0.973 · 0.990 lawful · neutral · chaotic); '
        'an EVIL, lawful god\'s sworn still lies a little MORE readily than an unsworn one (1.010)')

OP = {
 'path': '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_OP.md',
 'E': [
  ('| PARAGON on an aim (CH §4) | through CH\'s ONE roll (§9) |',
   [r'''| ↳ PARAGON [''' + T + r'''D-CH-PD-r1 route 4 · CH-PD-r1-17)] | — | ''' + LESS + r''' | — | — |''']),
  ('- **THE CHOICE:** admitted for an envoy (`declared` face',
   [r'''[''' + T + r'''D-CH-PD-r1 route 4 · CH-PD-r1-17) — ''' + LESS + r''']''']),
  ('- **ONE CALL-BOARD SOURCE ROW** `captive_held`',
   [r'''[''' + T + r'''RULINGS-P6 §F.4 · CH-PD-r1-12 · D-CH-PD-r1 route 3) — RE-ATTRIBUTED (OWNER QUOTATIONS ARE SACRED): "a merciful god's champion rescues readily", quoted above as "the owner's 12:44 word", is the CHAIR's design sentence (`briefs/L-CH-PD.md` item 2), NOT the owner's. The owner's 12:44 word, verbatim (`cure/OWNER-WORDS-2026-10-20.md` item 8; BOARD 2026-10-20 12:44 CDT): ''' + OWNER_1244 + r'''. The chair's sentence reads "a GOOD god's" (no recorded axis is "merciful" — CH-PD-r1-17): a good god's champion rescues more readily, by CH §10b's alignment half on the `captive_rescued` face (CH §10b's P6c bracket). The same re-attribution binds the quote in THE EXERT IS THE CARD ONLY's REFINED bracket below.]''']),
  ('- **THE EXERT IS THE CARD ONLY (RULINGS-P6 G.1).**',
   [r'''[''' + T + r'''RULINGS-P6 §F.4) — "a merciful god's champion rescues readily" in the REFINED bracket above is the chair's sentence, not the owner's word (re-attributed beside §9's first bullet, with the owner's 12:44 word verbatim); read "a good god's"]''']),
  ("- **ANY PARAGON'S FALSE WORD:**",
   [r'''[''' + T + r'''D-CH-PD-r1 route 4 · CH-PD-r1-17) — ''' + LESS + r''']''']),
 ]}

RN = {
 'path': '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_RN.md',
 'E': [
  ('[ADDED 2026-10-20 (fp-final P6c; `cure/L-CH-PD.md` §4 RN (b)',
   [r'''[''' + T + r'''RULINGS-P6 §H.2 · CH-PD-r1-10 (FAIL) · D-CH-PD-r1 route 2; RN lent to lane B for this one bracket) — THE BRACKET ABOVE IS SUPERSEDED IN ITS READ (kept, not deleted): its live read "THE CHAMPIONS' `swornDeityOf(paragon)`" is REPLACED — lens one reads the god's coordinates from the TELLING's CARRIED OATH, never a live read of the doer's record: the doer's public oath is a PART of a telling, heard with the doer as its display noun is, lost where the doer is lost (all parts at once in the omniscient arm; never under `secret_faith`), so a temple officer far from the doer reads only the oath the version it heard carried (Law One; CH §10b: "never `swornDeityOf` on the live record"). The temple officer's sworn-doer reading is REGISTERED HERE as the ONE OVERRIDE of "Which character each holder reads" above ("a person its own"): for this one doer class — a deed whose heard version carries an oath to the officer's own creed — the officer reads X's coordinates in place of the doer's own. The god-to-coordinate mapping is CH's (CH §10b, THE GOD'S THREE COORDINATES — RULINGS-P6 §F.1 as D-CH-PD-r1 derived it, its monotonicity PER HALF, CH S68 (i) as restated); RN mints none, and the bracket above's "MONOTONE in the god's character" reads per half. CH cites (CH §10b's flock paragraph).]''']),
 ]}

def run(spec):
    path = spec['path']
    lines = open(path, encoding='utf-8').read().split('\n')
    plan = []
    for anchor, new in spec['E']:
        hits = [i for i, l in enumerate(lines) if l.startswith(anchor)]
        if len(hits) != 1:
            sys.exit(f'ANCHOR NOT UNIQUE ({len(hits)}) in {path}: {anchor!r}')
        plan.append((hits[0], new))
    for i, new in sorted(plan, key=lambda p: -p[0]):
        lines[i+1:i+1] = new
    open(path, 'w', encoding='utf-8').write('\n'.join(lines))
    print(path, 'inserted after', [i+1 for i, _ in sorted(plan)])

run(OP); run(RN)
