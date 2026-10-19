import sys
p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PT.md'
s=open(p,encoding='utf-8').read()
def rep(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit(f"MISMATCH {n} for: {old[:100]!r}")
    s=s.replace(old,new)
B='[CURED 2026-10-18 (fp-final r3) — '
R='[REFINED 2026-10-18 (fp-final r3) — '

rep("an indefinite door's key inert, outside the cap), each dropped with its edge",
    "an indefinite door's key inert, outside the cap — at most one per settlement), each dropped with its edge")
# §17 P45 and new rows
rep("so the windowed edge lapses and its key drops — as CH's paragon bans do (CH S11) |",
    "so the windowed edge lapses and its key drops — as CH's paragon bans do (CH S11) |\n| P46 | a `party_banned` verdict `banned` at Kell (windowed); the DM then records `BAN_PARTY(Kell)`; later Kell's seat changes hands | the strictest-wins merge leaves ONE `indefinite` edge at Kell; the weekly pass lifts NOTHING there (the edge is not windowed) and Kell's key stays inert; the party is still banned at Kell until `PARDON_PARTY`; with the DM's ban recorded FIRST and the verdict after, the same; an emergent ban alone at Ashford lapses at Ashford's seat change while the DM's Kell ban stands (EXECUTED as a model on master's writers, `cure/D-PT-r3-probe/windowedLapse.out` A–D) "+B+"PT-V1] |\n| P47 | nine `party_banned` verdicts at nine towns, all windowed, and one DM-indefinite door with a key | eight windowed keys kept, the OLDEST evicted (its edge still bans until its `untilTick`, then opens); the indefinite door's key kept outside the cap (`windowedLapse.out` F) "+B+"the cap carry] |\n| P48 | a court whose regard of the party crosses into `enmity`, persons dark, `renownLeansEnabled` lit | ONE `party_voiced` card, the voice the court (its RULER on the card), WHERE its town; at `spoken` a `voiced_regard` deed with a SETTLEMENT doer that travels as a tale and adds NO fame to anyone (RN1); a company of `regional` fame voices the same way once CH's corps lights "+B+"A.11] |\n| P49 | the party, backed by Ashford, arrives at Kell; Kell's pair state toward Ashford is `hostile` (as Kell believes it), not at war | `party_gate` default `refused`, reason `enemy_in_service`; with Kell and Ashford at war the reason is `at_war_with_employer` (reached first); no RN court-to-court regard is read (A.4) "+B+"A.4] |")
# §17 cure bracket for the matrix
rep("[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · STOP-PR-2 (P43) · SEAMS-r2-6 (P44) · R2b-1 (P45) · `cure/D-ST-r2.md` route (P41) · OD-PT-28 (P42).]",
    "[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · STOP-PR-2 (P43) · SEAMS-r2-6 (P44) · R2b-1 (P45) · `cure/D-ST-r2.md` route (P41) · OD-PT-28 (P42).] "+B+"PT-V1 (P46) · the cap carry (P47) · A.11 (P48) · A.4 (P49).]")
# §18 OD rows
rep("a court's own pardon reads `banKeys` in PL's exact key form [CURED 2026-10-18 (fp-final r1) — PT-r1-9] [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6] [REFINED 2026-10-18 (fp-final r2) — R2b-1, vetoable] |",
    "a court's own pardon reads `banKeys` in PL's exact key form and lapses ONLY a still-windowed edge — an indefinite edge is the DM's, lifted only by `PARDON_PARTY`; the cap counts windowed keys only [CURED 2026-10-18 (fp-final r1) — PT-r1-9] [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6] [REFINED 2026-10-18 (fp-final r2) — R2b-1, vetoable] "+B+"PT-V1 · the cap carry] |")
rep("| OD-PT-22 | the public voice naming the party | `party_voiced`, CLIMAX, `spoken · withheld`, default `spoken` — THE CHAIR'S RULING (RULINGS-ROUND1 ADDENDUM, SEAMS-r1-6) executed |",
    "| OD-PT-22 | the public voice naming the party | `party_voiced`, CLIMAX, `spoken · withheld`, default `spoken` — THE CHAIR'S RULING (RULINGS-ROUND1 ADDENDUM, SEAMS-r1-6) executed; the voice is a COURT (any), or a PERSON or CORPS of `regional` fame or wider (RULINGS-ROUND3 A.11) "+B+"A.11] |")
# §19b card
rep("· `party_voiced` \"{person}, {fame clause}, is ready to {praise | denounce} the party before {audience}\" ·",
    "· `party_voiced` \"{the voice — a court by its ruler (\"Kell's lord\"), a person or a company by name}, {its standing or fame clause}, is ready to {praise | denounce} the party before {audience}\" "+B+"A.11: \"a court, a person or a corps\"] ·")
open(p,'w',encoding='utf-8').write(s)
print("ok")
