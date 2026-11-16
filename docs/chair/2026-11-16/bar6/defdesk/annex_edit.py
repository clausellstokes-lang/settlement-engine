#!/usr/bin/env python3
"""annex_edit.py <annex.md> : the BAR6-DEFDESK declarations and twins on the DS-DEF blocks (exact, each asserted once)."""
import re, sys
p = sys.argv[1]
L = open(p, encoding='utf-8').read().split('\n')
DEF_START = next(i for i, l in enumerate(L) if l.startswith('### DS-DEF-1:'))

def find(frag, lo=DEF_START):
    hits = [i for i, l in enumerate(L) if frag in l and i >= lo]
    assert len(hits) == 1, (frag, hits)
    return hits[0]

def retag(frag, old, new, after=None):
    """the variant holding `frag`: its tag `[old]` becomes `[new]`; `after` lines are inserted beneath it (renumbered later)"""
    i = find(frag)
    o = f'`[{old}]`'
    assert o in L[i], (frag, L[i][:120])
    L[i] = L[i].replace(o, f'`[{new}]`', 1)
    if after:
        for k, t in enumerate(after):
            L.insert(i + 1 + k, f'0. `[{t[0]}]` {t[1]}')

# ── 7a · "nothing threatens" reads the page's own beasts (the `monster frontier` atom) ──
retag('has no wall, and nothing threatens it now that a wall would keep out',
      'ledger · no threat · no danger coming · no crisis: wartime · crisis: any',
      'ledger · no threat · no danger coming · no monster frontier · no crisis: wartime · crisis: any',
      after=[('ledger · monster frontier · no threat · no danger coming · no crisis: wartime · crisis: any',
              '{settlement} has no wall, and the beasts of the country around it come right up to the last houses.')])
retag('Nothing presses {settlement} at present: its defences would make any attack costly',
      'counterforce · no threat · no danger coming', 'counterforce · no threat · no danger coming · no monster frontier')

# ── 7b · "defended in the ordinary way" declares against the families; "fresh repairs" reads the walls' state ──
retag('looks defended in the ordinary way', 'visitor · no crisis: occupied', 'visitor · no crisis: threat, unrest')
retag("Fresh repairs show on {settlement}'s {defwork}", 'visitor', 'visitor · no crisis: under_siege · no route: isolated')

# ── 6a · a place-word meets its size: streets and alleys a village or larger (`tier: ≥ village`) ──
retag('The danger at {settlement} comes from lone thieves, not a gang', 'visitor', 'visitor · no crime wave · tier: ≥ village',
      after=[('visitor · no crime wave · tier: ≤ hamlet',
              'The danger at {settlement} comes from lone thieves, not a gang: a purse cut or a door left open at night, and nobody running the place.')])
# (Moderate v3 already declares tier: ≥ village)
retag('Order at {settlement} could tip either way', 'threshold · watch', 'threshold · watch · tier: ≥ village')
retag('Nobody at {settlement} warns visitors about particular streets', 'visitor · colour', 'visitor · tier: ≥ village')
retag('A crisis now governs the streets of {settlement}', 'street · colour', 'street · tier: ≥ village',
      after=[('street · tier: ≤ hamlet', "A crisis now governs daily life at {settlement}, and the place's usual safety no longer holds.")])
retag("quarrels over rations and theft of food are the trouble on {settlement}'s streets now", 'street', 'street · tier: ≥ village')
retag('Fighting between the rebels and the town\'s guards has closed whole streets', 'street · guardPresence', 'street · guardPresence · tier: ≥ village')
retag('keep away from the streets where the revolt is being fought', 'visitor · colour', 'visitor · tier: ≥ village')
retag('Whole streets of {settlement} stand half empty', 'visitor', 'visitor · tier: ≥ village')
retag('The streets of {settlement} are quiet because the authorities are everywhere', 'street', 'street · tier: ≥ village')
retag('At {settlement} you pay the people who run the streets', 'visitor', 'visitor · tier: ≥ village')
retag('Rival crews at {settlement} are fighting over who runs the streets', 'unfolding', 'unfolding · tier: ≥ village')
retag('the guild decides who works which streets', 'street', 'street · tier: ≥ village')
retag('through the streets they hold or the businesses they front', 'street', 'street · tier: ≥ village')
retag('its watch keeps the peace in the streets and would be no answer to an army',
      'ledger · watch · no threat · crisis: any · no mercenary', 'ledger · watch · no threat · crisis: any · no mercenary · tier: ≥ village')
retag('The guards at {settlement} walk streets where they are not welcome', 'street · guardPresence', 'street · guardPresence · tier: ≥ village')
# districts: a town or larger (`tier: ≥ town`), where the pool said "population: ≥ middling"
retag('some districts are closed to anyone without business there', 'street · guardPresence · population: ≥ middling', 'street · guardPresence · tier: ≥ town')
retag('Some districts of {settlement} are closed off now', 'ledger · population: ≥ middling', 'ledger · tier: ≥ town')
retag('Which power holds a district of {settlement}', 'street · population: ≥ middling', 'street · tier: ≥ town')
retag('a wrong punished in one district goes unpunished in the next', 'ledger · population: ≥ middling', 'ledger · tier: ≥ town')

# ── 9a · the crime wave (the `crime wave` atom) and the law band ──
retag('There is a curfew at {settlement} now, and checkpoints; ordinary theft has dropped', 'street', 'street · no crime wave',
      after=[('street · crime wave', 'There is a curfew at {settlement} now, and checkpoints, and theft goes on all the same; people fear informers more than thieves.')])
retag('there is crime, but enforcement keeps it down and keeps it from growing', 'ledger · guardPresence · crisis: any', 'ledger · guardPresence · no crime wave · crisis: any',
      after=[('ledger · guardPresence · crime wave · crisis: any',
              "The town's record of crimes at {settlement} is still short, but it grows longer each season, and enforcement is not keeping pace.")])
retag('keeps a working balance: the law is present', 'street · guardPresence', 'street · patrol · law: > collapsed')
# ruling HK1: under a crime wave its hook says the wave is directed; the diffuse lines speak of appearances
retag('Crime at {settlement} is opportunistic and unorganized', 'ledger', 'ledger · no crime wave',
      after=[('ledger · crime wave', 'Crime at {settlement} looks opportunistic: fences, bandits and small operators, each seeming to work for themselves; if someone directs them, nobody has found out who.')])
retag('Things go missing at {settlement}, taken by whoever saw the chance', 'street', 'street · no crime wave',
      after=[('street · crime wave', 'Things go missing at {settlement} more often than they used to, and each theft looks like the work of whoever saw the chance; if there is a boss, nobody has found one.')])
# the court line BAR5-SAFETY left (fact g)
retag('Bring a complaint at {settlement} and there is a court to hear it', 'visitor · colour', 'visitor · court · prison · law: > collapsed',
      after=[('visitor · court · prison · law: = collapsed', '{settlement} has a court and a cell, but with the law as it stands, few complaints brought there are ever heard.')])
retag('Offenders at {settlement} are arrested, heard and held', 'ledger · law: > collapsed', 'ledger · court · prison · law: > collapsed')
retag('A thing done wrong at {settlement} goes somewhere and takes time', 'street · watch · law: > collapsed', 'street · watch · court · prison · law: > collapsed')

# ── 9c · the stores and the surplus ──
retag('so less food is being put by than should be', 'ledger · no crisis: under_siege', 'ledger · no crisis: under_siege · stores: < 12',
      after=[('ledger · no crisis: under_siege · stores: ≥ 12', "{settlement}'s food trades are failing, though its stores would still carry the town through a year cut off.")])
retag('less is being put by against the town being cut off than ought to be', 'street · no crisis: under_siege', 'street · no crisis: under_siege · stores: < 12')
retag('what they fail to put by is food the town would miss', 'unfolding · no crisis: under_siege', 'unfolding · no crisis: under_siege · stores: < 12')
retag('so less was put by than there should have been', 'ledger · crisis: under_siege', 'ledger · crisis: under_siege · stores: < 12')
retag('an ordinary year leaves nothing over', 'visitor · food: ≥ pressured', 'visitor · food: ≥ pressured · no food surplus')
retag('leaves nothing over in an ordinary year, and a bad harvest is felt before spring', 'ledger · food: ≥ pressured', 'ledger · food: ≥ pressured · no food surplus',
      after=[('ledger · food: ≥ pressured · food surplus', '{settlement} grows more than it eats, but no dependable road, river or port takes the rest anywhere, and what the town cannot grow or make it mostly goes without.')])

# ── 9a.manned · a watch alone is too few; soldiers on the walls are not ──
retag('so the defences stand and too few people man them', 'ledger · watch · no crisis: under_siege · no crisis: occupied',
      'ledger · watch · no soldiers · no crisis: under_siege · no crisis: occupied')

# ── B4 · the office and goods words declared by their own atom ──
retag('keeps paid soldiers behind its walls', 'ledger · no crisis: under_siege · no crisis: occupied', 'ledger · garrison · no crisis: under_siege · no crisis: occupied')
retag('you see the walls and the soldiers who belong on them', 'visitor · no crisis: under_siege · no crisis: occupied', 'visitor · garrison · no crisis: under_siege · no crisis: occupied')
retag('the soldiers on the walls give them good reason to', 'street · no crisis: occupied', 'street · garrison · no crisis: occupied')
retag('The militia at {settlement} know every path around the town', 'street', 'street · militia')
retag('Nobody at {settlement} is paid to keep order; what order the place has', 'street · no guardPresence', 'street · no guardPresence · no watch')
retag("soldiers serve all year, not for a season", 'street · colour', 'street · garrison')
retag('take up arms when they must and go back to work after', 'street', 'street · militia')
retag('could keep soldiers and does not', 'counterforce', 'counterforce · militia')
retag('Anyone walking {settlement} late is watched, not stopped', 'visitor · no crisis: occupied · no crisis: wartime', 'visitor · watch · no crisis: occupied · no crisis: wartime')
retag('The town pays for some of its soldiers and knows which ones', 'street', 'street · mercenary')
retag('You can see the courthouse and the gaol at {settlement}', 'visitor', 'visitor · court · prison')
retag('The soldiers at {settlement} command its magic', 'street', 'street · soldiers')

# renumber only the lists that took a twin (the inserted lines are written "0.")
item = re.compile(r'^(\d+)\. `\[')
for idx in [i for i, l in enumerate(L) if l.startswith('0. `[')]:
    a = idx
    while a > 0 and (item.match(L[a - 1]) or (not L[a - 1].strip() and a > 1 and item.match(L[a - 2]))): a -= 1
    b = idx
    while b + 1 < len(L) and (item.match(L[b + 1]) or (not L[b + 1].strip() and b + 2 < len(L) and item.match(L[b + 2]))): b += 1
    n = 0
    for k in range(a, b + 1):
        m = item.match(L[k])
        if m:
            n += 1
            L[k] = f'{n}.' + L[k][len(m.group(1)) + 1:]
open(p_out := p, 'w', encoding='utf-8').write('\n'.join(L))
print('ok')
