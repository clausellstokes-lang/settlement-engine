import re,sys
p='docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'; s=open(p).read()
E=[ # (unique text start, marks to add)
("{settlement} is all but undefended. Nothing in the town would stop","no crisis: occupied"),
("{settlement} has people under arms, but too few and too badly placed","no crisis: occupied"),
("You can walk into the centre of {settlement} without being stopped","no guardPresence"),
("{settlement} could deal with a brawl or a thief, but the town could not hold off a raid","no crisis: occupied"),
("The tally of raids at {settlement} is short for a frontier town","no crisis: threat"),
("The town takes the frontier seriously and has taken it seriously long enough","no crisis: threat"),
("The country around {settlement} is thick with creatures, and the town keeps both","no crisis: occupied"),
("{settlement} keeps its wall against the creatures, and nobody walks out past it unarmed","no crisis: under_siege · no crisis: occupied"),
("As long as {settlement}'s food trades keep working","no crisis: famine"),
("{settlement}'s accounts have money in hand: the town can keep its defenders paid","no crisis: occupied"),
("The town could go through a bad season with its arrangements intact","prosperity: ≥ poor"),
("{settlement} had money laid by before this trouble began","no crisis: famine · prosperity: ≥ poor"),
("The famine is costing the town dearly, and the town is paying","prosperity: ≥ poor"),
("Nobody in {settlement} lies awake over a lean year","prosperity: ≥ poor"),
("Hunger has come to the town, but its money has not run out","prosperity: ≥ poor"),
("Food is dear and hard to find here, but whatever food reaches the town is bought","prosperity: ≥ poor"),
("The town went into this trouble with money in hand","prosperity: ≥ poor"),
("{settlement} had money laid by when the occupiers came","prosperity: ≥ poor"),
("The town's plan for an army is to not be interesting to one","no mercenary"),
("Cross a street at {settlement} and you may cross from one power's rules","population: ≥ middling"),
("Whatever reaches {settlement} by road reaches it at a gate","no crisis: under_siege"),
("There is a line around {settlement} and it is kept: the gates shut","no crisis: under_siege"),
("The town has a wall and arranges its day around the gates without noticing","no crisis: under_siege"),
("Each crackdown on the insurgents at {settlement}","guardPresence"),
("The longer the hunger lasts at {settlement}, the less its defenders can do","guardPresence"),
("{settlement} was betrayed recently, and its defence is being rearranged","guardPresence"),
("{settlement} pays its creditors first and its defence with what is left","guardPresence"),
("The older people of {settlement} say defences are easier to keep than to raise","no crisis: unrest"),
("{settlement}'s accounts show little spent on its {defwork} now that it asks little","no crisis: unrest"),
("The commander at {settlement} is a political player in their own right","no crisis: occupied"),
("Treat the commander at {settlement} as a power, not a servant","no crisis: occupied"),
("Nothing the {seat} orders at {settlement} goes ahead if {faction} refuses it","no crisis: occupied"),
("{faction} has grown stronger than the {seat} at {settlement}, and both know it","no crisis: occupied"),
]
for t,m in E:
    rx=re.compile(r'^(\d+\. `\[)([^\]]*)(\]` )'+re.escape(t), re.M)
    hits=rx.findall(s)
    if len(hits)!=1: sys.exit(f"MISS {len(hits)}: {t}")
    def f(mo):
        tags=mo.group(2).split(' · ')
        tags=[x for x in tags if x!='colour']  # a colour line declares nothing else
        tags+= [x for x in m.split(' · ') if x not in tags]
        return mo.group(1)+' · '.join(tags)+mo.group(3)+t
    s=rx.sub(f,s,count=1)
open(p,'w').write(s); print('applied',len(E))
