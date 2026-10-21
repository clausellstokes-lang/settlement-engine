import sys
P = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_CH.md'
E = '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-CH-PD-r1-probe/edits/'
s = open(P, encoding='utf-8').read()
def rep(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: sys.exit(f'COUNT {c} != {n} for: {old[:90]!r}')
    s = s.replace(old, new)
# §4.3
rep("a SWORN paragon's `COMMIT_MARGIN` is multiplied by `patronLean(…).commit` (its god's law half, bounded ±`PATRON_LEAN_WEIGHT`, DRAFT): a lawful god's sworn holds an aim and a bargain longer, a chaotic god's yields to a better one sooner — never a forced break (§10b)]",
    "a SWORN paragon's `COMMIT_MARGIN` is multiplied by `swornLean(…).commit` (its god's law half, within [0.90, 1.10] — ±`SWORN_LEAN_WEIGHT`, DRAFT 0.10): a lawful god's sworn holds an aim and a bargain longer, a chaotic god's yields to a better one sooner — never a forced break (§10b)] [CURED 2026-10-20 (fp-final P6 r1) — RULINGS-P6 F.1 · F.3: the weight and the names]")
# §4.4
rep("each candidate's score is also multiplied by `patronLean(…).act` — its sworn god's reading of the act the candidate would make (exactly 1 for an act-less purpose, an unsworn paragon or a neutral god), bounded below a habit's span and below this doubled row; the pantheon rank is never read]",
    "each candidate's score is also multiplied by `swornLean(…).act` — its sworn god's two halves on the act the candidate would make, its alignment reading and its boldness (exactly 1 for an act-less purpose or an unsworn paragon; for a god neutral in alignment, law and temper, moved only by its own flock's tie), within [0.855, 1.155] — inside a habit's span, and S62 pins that this doubled row outweighs it; the pantheon rank is never read] [CURED 2026-10-20 (fp-final P6 r1) — RULINGS-P6 F.1 · F.3 · CH-PD-r1-1]")
# §4.5
rep("p(exert) is multiplied by `patronLean(…).act` for the exertion's own face (§10b); and `shame` gains one cause — an `exerted` week its own sworn god's reading condemns (`m ≤ −½`, §10b), one step on the same banded stock]",
    "p(exert) is multiplied by `swornLean(…).act` for the exertion's own face (§10b); and `shame` gains one cause — an `exerted` week its own sworn god's ALIGNMENT reading condemns (`m ≤ −½`, its own flock's tie included, §10b — reached by the fallen saint under a good or a neutral-lawful creed, EXECUTED), one step on the same banded stock] [CURED 2026-10-20 (fp-final P6 r1) — CH-PD-r1-2 · RULINGS-P6 F.1 · F.3]")
# §6.2 faith row
rep("a saint's patron IS its `creedRef`; the multiplicands are unchanged]",
    "a saint's sworn god IS its `creedRef`; the multiplicands are unchanged] [CURED 2026-10-20 (fp-final P6 r1) — CH-PD-r1-9: (3a)'s carrier hands `attemptEntry` the saint's OATH embed (`swornDeityOf`; the oath REQUIRED for a saint, §10b), so a creed seated nowhere enters with its saint (`religiousContest.js`: \"`const { deity, carrier, occupied } = reaching.get(dref);`\" — the carrier needs the deity object); before CH-11's door arm lands, (3a) carries only a creed some town's religion state already holds — the degraded arm]")
# §7 values term
rep("its sworn god (`patronDeityOf`, §10b; a faith paragon's `creedRef` already is), read by this same test; an unsworn paragon of another calling brings no creed term]",
    "its sworn god (`swornDeityOf`, §10b; a faith paragon's `creedRef` already is), read by this same test; an unsworn paragon of another calling brings no creed term] [CURED 2026-10-20 (fp-final P6 r1) — RULINGS-P6 F.3]")
# §10b body: replace from the field paragraph through the tier paragraph
L = s.split('\n')
i0 = [i for i, x in enumerate(L) if x.startswith('**The field (OD-CH-51, the OWNER')]
i1 = [i for i, x in enumerate(L) if x.startswith('**Tier.** The roll\'s lean with `paragonsEnabled`')]
if len(i0) != 1 or len(i1) != 1 or i1[0] < i0[0]: sys.exit(f'10b bounds {i0} {i1}')
body = open(E + 's10b.md', encoding='utf-8').read().rstrip('\n')
L[i0[0]:i1[0] + 1] = body.split('\n')
s = '\n'.join(L)
# §11 step 5b
old5b = [x for x in s.split('\n') if x.startswith("5b. **The creed's step** [ADDED 2026-10-20 (fp-final P6; L-CH-PD)")]
if len(old5b) != 1: sys.exit('5b')
new5b = "5b. **The creed's step** [ADDED 2026-10-20 (fp-final P6; L-CH-PD) — §10b; OD-CH-53] — for a SWORN paragon (a person or a corps) whose oath this court can see (not `secret_faith`): ONE step between `admitted` and `admitted_under_watch`, never into or out of `refused` — WARMER, reason `patron_creed`, where its god holds THIS town's patron seat (`religionStates[town].patronRef`), the court does not believe it a villain, and the watch is the one step 5 set (the WATCH's `mistrust`) — a watch the crown's ban set at step 2 (a `shaky` hold) stands; COLDER, reason `suppressed_creed`, where its god's creed is `suppressed` here or, THE BODIES lit, this court holds that creed's flock `outlawed`; both reads the court's own facts (truth); the party's and a body's arms take no step (they swear no oath). On THE CORPS ARM (below) the step runs between that arm's (5) and (6), reading the company's mark's `swornDeity`; that arm's \"it has no creed\" (its step 3) means the company carries no `creedRef` — the `opposed_creed` reason, never the oath. [CURED 2026-10-20 (fp-final P6 r1) — CH-PD-r1-11: WARMER lifts only step 5's watch (S63 (e)) · CH-PD-r1-13: the corps arm's place for the step, stated here (the corps paragraph itself untouched, RULINGS-P6 F.6) · F.3]"
rep(old5b[0], new5b)
open(P, 'w', encoding='utf-8').write(s)
print('part3 ok')
