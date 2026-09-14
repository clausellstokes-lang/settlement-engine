import json
rows=json.load(open("def2-faces.json"))
U={64,66,71,74,82,94,126,127,206,282,285,389,427,435,497,499}
S={20,30,47,70,78,110,122,172,173,189,202,280,281,307,428,483,498}
# craft history: DULL verdicts received before the pool landed
dull={
 "Beasts & Monsters: `plagued`, perimeter AND organized force":1,
 "Beasts & Monsters: `plagued`, perimeter but NO force to hold it":1,
 "Beasts & Monsters: `plagued`, NO perimeter and NO force":2,
 "Beasts & Monsters: `frontier`, credible deterrence":0,
 "Beasts & Monsters: `frontier`, force without a perimeter":1,
 "Beasts & Monsters: `settled`, defenses beyond the need":2,
 "Beasts & Monsters: `settled`, nothing organized":1,
 "Invasion & War: walls AND professional garrison":0,
 "Invasion & War: walls with citizen militia":1,
 "Invasion & War: walls with NO force":1,
 "Invasion & War: force with NO walls":0,
 "Invasion & War: militia only":1,
 "Invasion & War: neither walls nor force":1,
 "Internal Security: full legal chain (court AND prison)":1,
 "Internal Security: court without detention":0,
 "Internal Security: no legal infrastructure":0,
 "Economic Survival: `STRONG`":0,
 "Economic Survival: `WEAK`":2,
 "Disasters & Famine: granary AND hospital":0,
 "Disasters & Famine: granary AND parish care only":0,
 "Disasters & Famine: NO reserves, NO medical provision":0,
}
from collections import OrderedDict
tot=OrderedDict()
for i,r in enumerate(rows,1):
    p=r['pool']; t=tot.setdefault(p,[0,0,0])
    if i in U: t[0]+=1
    elif i in S: t[1]+=1
    else: t[2]+=1
print("| pool | faces | U | S | C | U+S share | DULL verdicts before landing |")
print("|---|---|---|---|---|---|---|")
for p,(u,s,c) in tot.items():
    n=u+s+c
    print(f"| {p} | {n} | {u} | {s} | {c} | {100*(u+s)/n:.1f}% | {dull[p]} |")
gu=gs=gc=0
for p,(u,s,c) in tot.items(): gu+=u; gs+=s; gc+=c
print(f"| **ALL** | **{gu+gs+gc}** | **{gu}** | **{gs}** | **{gc}** | **{100*(gu+gs)/(gu+gs+gc):.1f}%** | |")
print()
print("| craft group | pools | faces | U | S | U+S | U+S share | U share |")
print("|---|---|---|---|---|---|---|---|")
for k,lab in [(0,"PASS at the first sitting (0 DULL)"),(1,"one DULL, then PASS"),(2,"DULL twice (repeatedly DULL)")]:
    ps=[p for p in tot if dull[p]==k]; u=sum(tot[p][0] for p in ps); s=sum(tot[p][1] for p in ps); n=sum(sum(tot[p]) for p in ps)
    print(f"| {lab} | {len(ps)} | {n} | {u} | {s} | {u+s} | {100*(u+s)/n:.1f}% | {100*u/n:.1f}% |")
