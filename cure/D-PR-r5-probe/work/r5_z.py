p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PR.md'
s=open(p,encoding='utf-8').read()
reps=[
# ROUTES (round 5a): BD (6) and the fold's token row
(r"""(5) §2.3's gleaning factors cite PR §5.5's roll (`GLEAN_BASE`, `GLEAN_CAP`).""",
 r"""(5) §2.3's gleaning factors cite PR §5.5's roll (`GLEAN_BASE`, `GLEAN_CAP`); (6) §5.2 (a)'s `body` token enters `routeNetworkConsumers.js :: TRAVELLER_KINDS` as well as `HIDDEN_PATH_KINDS`, both codepoint-sorted, and BD-5's unit re-records master's exact-vocabulary pin (`tests/domain/routeNetworkConsumers.test.js`: "`for (const kind of HIDDEN_PATH_KINDS) expect(TRAVELLER_KINDS).toContain(kind);`", "`expect([...TRAVELLER_KINDS]).toEqual(['army', 'caravan', 'covert_envoy', 'smuggler', 'wanderer']);`") — the measurement behind PR's OD-PR-51 (the resumed seat)."""),
(r"""`HIDDEN_PATH_KINDS` + `patrol` (declared, beside BD's `body`);""",
 r"""`TRAVELLER_KINDS` and `HIDDEN_PATH_KINDS` + `patrol` (declared and VISIBLE, ⭐ OD-PR-51, beside BD's `body`, ⭐ OD-BD-49; master's vocabulary pin re-recorded at each unit);"""),
# §19 Q1
(r"""The alternative: no patrol rides a way at all (a warden-led hunt waits at the junctions; the warden's word then reaches knowledge only) — PS §5.5's "it never takes a hidden way" would then read as written.""",
 r"""The alternative: no patrol rides a way at all (a warden-led hunt waits at the junctions; the warden's word then reaches knowledge only) — PS §5.5's "it never takes a hidden way" would then read as written. Measured since (the resumed seat): the franchise rests on TWO pinned arrays, so the token enters `TRAVELLER_KINDS` too and PR-2's unit re-records master's exact-vocabulary pin; the row is now ⭐ visible beside OD-BD-49 (a landed access law widened is the owner's to see)."""),
# §20 cure record: the resumed seat's rows
(r"""| non-naming rows reaching PR's text: A.4 · A.5 (the den's belief; sightings into the holder's own record) · B.6 · B.12 · B.16 | — | CURED on PR's side (cited where PR's text echoed the struck form) | §5.1 · §9.2 (b) · §2.5 · §5.5 · §12 |""",
 r"""| non-naming rows reaching PR's text: A.4 · A.5 (the den's belief; sightings into the holder's own record) · B.6 · B.12 · B.16 | — | CURED on PR's side (cited where PR's text echoed the struck form) | §5.1 · §9.2 (b) · §2.5 · §5.5 · §12 |
| concurrent: D-ST-r5's two PR routes (R11's holder after `cleared`; a look at an id-less authored gang) | — | CURED (the resumed seat) — Kell's garrison holds the cleared keep, no reclaim (ST A.3); the `band` holder of R11 re-worded (RULINGS-ROUND4 A.3); a look at an id-less gang writes nothing | R11 · §9.2 (b) |
| the resumed seat's sweep — two §15.1 residues of this round's own cures | — | CURED — the PL row named the r4 `crownReachAt` share (PR-X1 · B.8); the BD row named `believedBodies` as the prediction's read (BD→PR (9)) | §15.1 PL · §15.1 BD |
| the resumed seat's measurement — OD-PR-51's franchise rests on TWO pinned arrays | — | REFINED — `patrol` enters `TRAVELLER_KINDS` and `HIDDEN_PATH_KINDS` codepoint-sorted, master's exact-vocabulary pin re-recorded at PR-2 with its cause (`tests/domain/routeNetworkConsumers.test.js`, CONFIRMED by reading); ⭐ visible beside OD-BD-49; BD's `body` routed the same | PR16 · §0.1 · §5.5 · §14 PR-2 · §15.2 · OD-PR-51 · §19 Q1 · ROUTES |"""),
(r"""the declared riders' token `patrol` (OD-PR-51, by delegation, vetoable).""",
 r"""the declared riders' token `patrol` (OD-PR-51, by delegation, vetoable; ⭐ visible since the resumed seat measured its second pinned array); §18 (21)'s lord ridden past re-named to R42's chain (Kell). THE RESUMED SEAT (07:3x EDT; the first died on the 5h limit at 04:38 with the volume written and its cure file a header): the three probes re-run byte-identical (`net-r5`, `season-r5`, `drawshare-r5`), every round-5 bracket re-read against its receipt and its sibling, and the rows above marked "the resumed seat" added — none changes the 39."""),
]
for a,b in reps:
    n=s.count(a)
    assert n==1,(n,a[:90])
    s=s.replace(a,b)
open(p,'w',encoding='utf-8').write(s)
print('applied',len(reps))
