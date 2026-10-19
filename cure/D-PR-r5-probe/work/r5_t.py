p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PR.md'
s=open(p,encoding='utf-8').read()
reps=[
(r"""*(THE HUNT — a catch on a trail; a cold trail; scrutiny: the prediction's three reasons)*""",
 r"""*(THE HUNT — a catch on a way; a cold trail; scrutiny: the prediction's three reasons)* [REFINED 2026-10-19 (fp-final r5) — "lost the Tolle gang's trail" re-worded: `trail` is the map's RUNG word on the same surface (SEAMS-r4-16), so the DM line says what happened without it]"""),
(r"""*(scrutiny only — the learnable clock, L-BD 39; never pushed)* [CURED 2026-10-18 (fp-final r4) — A.7 · BD's routes · L-BD 39 · 40 · 41: five sentences for the new deeds, each who · which power · what effect]""",
 r"""*(scrutiny only — the learnable clock, L-BD 39; never pushed)* [CURED 2026-10-18 (fp-final r4) — A.7 · BD's routes · L-BD 39 · 40 · 41: five sentences for the new deeds, each who · which power · what effect]
20. "Kell's riders followed the Tolle gang as far as the ford; the watch knows the way that far now." *(GLEANING IN PURSUIT — L-BD 11e; scrutiny: the snow, the gang's haste, the warden leading)* [CURED 2026-10-19 (fp-final r5) — L-BD 11e]
21. "Tolle took it ill that the crown called Ashford's riders past it." *(THE RIDE PAST — PL's precedence friction under `unbroken`, §10.3 (b); scrutiny: the summons, Tolle's answer, the row)* [CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1 as RE-RULED]"""),
]
for a,b in reps:
    assert s.count(a)==1,a[:70]
    s=s.replace(a,b)
open(p,'w',encoding='utf-8').write(s)
print('ok')
