# D-FOUR-r4 (resumed seat): the WS re-check's three edits + the §17 Round r4 block
import sys
p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_WS.md'
s=open(p,encoding='utf-8').read(); L0=len(s)
def rep(old,new,count=1):
    global s
    n=s.count(old); assert n==count,(n,old[:160])
    s=s.replace(old,new)
C="[CURED 2026-10-20 (fp-final P6 r4) — "
R="[REFINED 2026-10-20 (fp-final P6 r4) — "
# 1. WS19 — WS-Vm3's third site
rep("— in the Why panel and the dossier, and never changes the way, a tie or any factor (E.1);",
    "— in the Why panel (the dossier carries the hand only as the deeds its own receipts recorded, §7 — never the label word; E.1's \"reported in … the dossier\" read so) "+C+"WS-Vm3: the third site the verifier named (WS19 · §2.3 · S23); §2.3 and S23 carry the same reading], and never changes the way, a tie or any factor (E.1);")
# 2. §5.2 — the completion quote made exact (it spans two comment lines on master)
rep("or its last stage completes it (\"Drop it (the siege is now the war layer's job)\")",
    "or its last stage completes it (the completion arm: \"it (the siege is now the war layer's job) with a completion receipt.\" — `completeNews`) "+C+"WS-V7, re-checked: r4's quote joined two comment lines of `advanceSupplyWebWarfare`; now quoted as one line]")
# 3. S24 — the declared edge pinned
old="with P5 unsigned the cause never fires "+C+"WS-V8];"
assert s.count(old)==1
rep(old, old[:-1]+"; THE DECLARED EDGE, pinned so it cannot pass silently: a non-war loss inside the stamp's own week is read as the home the host marched from (`cure/D-FOUR-r4-probe/levyShrink-r4.out`, last row: a home of 400 with 140 fled in the march's first week stamps \"mark\":10 and holds (ii) from tick 3 against a truth that never holds — \"r4EverDisagreesWithTruth\":28) — OD-WS-40's one-week window; the WC car that stamps the room on the deployment at its mint closes it "+R+"the residue lane's re-check: the stamp window's measured cost stated where it is tested; vetoable];")
# 4. OD-WS-40 — the window's measured cost beside the alternative
old="the alternative — a WC car stamping the room on the deployment record at its mint — changes a landed shape]"
rep(old, old+" "+R+"the window's measured cost (S24's declared edge): one loss inside the stamp week is read as the march's home — 28 of 30 ticks disagree with the truth in that one probe case, 0 in every other; the WC car removes the window at the price of a landed shape's change — the owner's choice at OD-WS-40]")
open(p,'w',encoding='utf-8').write(s)
print('ok',L0,len(s))
