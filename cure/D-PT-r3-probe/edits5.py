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
rep("an emergent ban alone at Ashford lapses at Ashford's seat change while the DM's Kell ban stands (EXECUTED",
    "an emergent ban alone at Kell (the DM's ban standing at Tolle instead) lapses at Kell's seat change while the Tolle ban stands (EXECUTED")
rep("**Round 2b raised NO new STOP** (`cure/D-PT-r2b.md` §3); STOP-PR-2 and OD-PT-28 are RULED (RULINGS-ROUND2b) and executed.",
    "**Round 2b raised NO new STOP** (`cure/D-PT-r2b.md` §3); STOP-PR-2 and OD-PT-28 are RULED (RULINGS-ROUND2b) and executed. **Round 3a raised NO new STOP** (`cure/D-PT-r3.md`).")
rep("R2b-5 PT's road WHERE read as PR's ONE STRETCH KEY.",
    "R2b-5 PT's road WHERE read as PR's ONE STRETCH KEY. ROUND 3a (`[REFINED 2026-10-18 (fp-final r3) — …]`): R3-1 one `banKeys` key per door, the newer episode replacing (one lift rule for the one merged edge).")
rep("OPEN FOR THE CHAIR (detail in `cure/D-PT-r2b.md` §5–§6): (1) RN's halves of round 2 are CURED in RN's round 2b (`partySeq` named in the deed normalizer; §3.1's `party_event` row narrowed to events that do not ripple; §7's \"truth chasing\" reader struck — `cure/D-RN-r2b.md` §2), and RN keys the corps `u:<unitKey>`; still RN's: its sites bracket still reads \"ST's actor convention gains `site`\" (the ADDENDUM's ST-r2-14 withdrew that widening) and its `target` names no `siteId` qualifier (PT's site deeds carry one, §4);",
    "OPEN FOR THE CHAIR (detail in `cure/D-PT-r2b.md` §5–§6 and `cure/D-PT-r3.md`): (1) RN's halves of round 2 are CURED in RN's round 2b (`partySeq` named in the deed normalizer; §3.1's `party_event` row narrowed to events that do not ripple; §7's \"truth chasing\" reader struck — `cure/D-RN-r2b.md` §2), and RN keys the corps `u:<unitKey>`; RULINGS-ROUND3 B gives RN's lane its remaining halves — the sites bracket's withdrawn \"actor convention gains `site`\" (A.7), the deed target's `siteId` field (§4), the heard pass's triple key (§11.1) and §5.5's court arm (A.11) "+B+"routed, RN's lane];")
rep("(4) CH names `met_in_person` as the producer of `marks.metParty` (still 0 hits in CH); (5) the reveal of a site as ONE act through PT's door, like the clearing — ST's closed caller list names only the clearing door, so today `party_made_known_site` rides beside the DM's `SITE_STATUS made_known` (a `party` dial on that verb is closed: it already carries four);",
    "(4) ~~CH names `met_in_person` as the producer of `marks.metParty`~~ — CLOSED: CH now names it (CH L3, §16) "+B+"the verifier's carry \"§20(4) is stale\"]; (5) \"the reveal\" has ONE meaning, `party_made_known_site` (RULINGS-ROUND3 B; ST cites PT's kind, `cure/D-ST-r3.md`); still open: whether that deed should also be ONE act through PT's door, like the clearing — ST's closed caller list names only the clearing door, so today `party_made_known_site` rides beside the DM's `SITE_STATUS made_known` (a `party` dial on that verb is closed: it already carries four) "+B+"the verifier's carry on \"the reveal\"];")
open(p,'w',encoding='utf-8').write(s)
print("ok")
