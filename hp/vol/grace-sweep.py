# THE GRACE RULE carried in place (OD-FC-128) into the consolidated volumes that named a canon born with the campaign (V-HP-16).
import sys, os
D = sys.argv[1]
SITES = {
 'CH': [
  ("H22's canon born with every map-module campaign", "H22's canon adopted at every map-module campaign's first advance (THE GRACE RULE, fold OD-FC-136)"),
  ("so on a map-module world whose canon is born with the campaign (H22) a paragon walks priced legs from week one", "so on a map-module world whose canon is adopted at the campaign's first advance (H22, THE GRACE RULE) a paragon walks priced legs from week one"),
  ("so a free campaign born canonized simply runs no CH", "so a free campaign canonized at its first advance simply runs no CH"),
  ("On a map-module world whose canon is born with the campaign (H22) this arm is never taken.", "On a map-module world whose canon is adopted at the campaign's first advance (H22, THE GRACE RULE) this arm is never taken."),
  ("on a map-module world the canon is born with the campaign, H22 — canonized ≠ premium", "on a map-module world the canon is adopted at the campaign's first advance, H22 (THE GRACE RULE) — canonized ≠ premium"),
  ("on a map-module world the canon is born with the campaign, H22);", "on a map-module world the canon is adopted at the campaign's first advance, H22);"),
  ("on a map-module world the canon is born with the campaign (H22), so the spatial arm is the default there", "on a map-module world the canon is adopted at the campaign's first advance (H22, THE GRACE RULE), so the spatial arm is the default there"),
 ],
 'MN': [
  ("on a map-module world whose canon is born with the campaign (the host document's H22 — canonized ≠ premium", "on a map-module world whose canon is adopted at the campaign's first advance (the host document's H22, as the map amended it — canonized ≠ premium"),
  ("On a map-module world whose campaign adopts the canon at creation (the host document's H22), the canon marker is present from week one", "On a map-module world whose campaign adopts the canon at its first advance (the host document's H22, as the map amended it: THE GRACE RULE), the canon marker is present from week one"),
  ("the map layer needs a canonized map (born with the campaign on a map-module world, H22 — §8)", "the map layer needs a canonized map (adopted at the campaign's first advance on a map-module world, H22 — §8)"),
  ("**The canon-born world.**", "**The map-module world.**"),
  ("a canon-born world (H22) runs MN's canon arms from week one", "a world whose canon is adopted at its first advance (H22, THE GRACE RULE) runs MN's canon arms from week one"),
 ],
 'RN': [
  ("H22 canonizes every new map-world campaign at birth \"whatever its tier\"", "H22 canonizes every new map-world campaign at its first advance (THE GRACE RULE, fold OD-FC-136) \"whatever its tier\""),
 ],
 'PT': [
  ("On a map-module world the canon is born with the campaign once H22 lands", "On a map-module world the canon is adopted at the campaign's first advance once H22 lands (THE GRACE RULE)"),
  ("on a map-module world the canon is born with the campaign whatever its tier (H22, once its canon root lands — §8.3)", "on a map-module world the canon is adopted at the campaign's first advance whatever its tier (H22 with THE GRACE RULE, once its canon root lands — §8.3)"),
 ],
 'BD': [
  ("on a map-module world born canonized, the canon arms run from week one where the flags are lit.", "on a map-module world, canonized at its first advance (H22, THE GRACE RULE), the canon arms run from week one where the flags are lit."),
 ],
}
for v, pairs in SITES.items():
    t = open(os.path.join(D, f'{v}-master.md'), encoding='utf-8').read()
    for old, new in pairs:
        n = t.count(old); assert n == 1, (v, n, old[:80])
        t = t.replace(old, new)
    open(os.path.join(D, f'DESIGN_FP_ARCH_{v}.md'), 'w', encoding='utf-8').write(t)
    print(v, len(pairs), 'sites')
