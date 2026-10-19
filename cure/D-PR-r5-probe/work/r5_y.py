p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PR.md'
s=open(p,encoding='utf-8').read()
TK = "[REFINED 2026-10-19 (fp-final r5) — measured by the resumed seat: master's franchise rests on TWO pinned arrays, so a token in `HIDDEN_PATH_KINDS` alone reds `tests/domain/routeNetworkConsumers.test.js` (\"`for (const kind of HIDDEN_PATH_KINDS) expect(TRAVELLER_KINDS).toContain(kind);`\")]"
reps=[
# 1. §15.1 PL row: the r4 crownReachAt share residue (PR-X1 / B.8)
(r"""the crown's share of a member's riders is PL's one `crownReachAt` share (F.2, PL's row);""",
 r"""the liege's share of a member's riders is PL's ONE share, `POLITY_LIEGE_SHARE[band]` toward the member's IMMEDIATE liege (F.2, PL's row; `crownReachAt`'s reach is the crown's voice in a sub-vassal's decisions, never a call on its men) [CURED 2026-10-19 (fp-final r5) — PR-X1 · B.8, the §15.1 residue: this cell still named the r4 `crownReachAt` share that §10.3 (c)'s cure struck];"""),
# 2. §15.1 BD row: believedBodies residue (BD→PR (9))
(r"""THE HUNT predicts on `believedBodies`, the known trails and `BODY_HABITS`,""",
 r"""THE HUNT predicts on the town's ONE belief record of the body, `believedBodyOf` (listed by `believedBodies`), the known ways and `BODY_HABITS` [CURED 2026-10-19 (fp-final r5) — BD→PR route (9), the §15.1 residue],"""),
# 3. R11: ST's round-5 route + the struck `band` holder
(r"""| R11 | THE DEN CLEARED — a DM-placed `modest` band holds the abandoned keep; Kell's fielded riders sum past `modest` | a detachment forms; ST's `site_cleared` is minted with the detachment's band as the force; on `cleared` the site is unheld and ST's reclaim follows; credit to Kell (and to an ally that `rides`) | PR-2 |""",
 r"""| R11 | THE DEN CLEARED — a DM-placed `modest` gang (an id-less authored gang, ST §2.1 — the `band` holder kind struck by RULINGS-ROUND4 A.3) holds the abandoned keep; Kell's fielded riders sum past `modest` | a detachment forms; ST's `site_cleared` is minted with the detachment's band as the force; on `cleared` KELL'S GARRISON holds the keep (ST §6.1 step 6d: the clearer named holds — RULINGS-ROUND5 A.3), no reclaim offered; credit to Kell (and to an ally that `rides`, receipted and holding nothing) [CURED 2026-10-19 (fp-final r5) — ST's round-5 route to PR (`cure/D-ST-r5.md` §5: "on `cleared` Kell's garrison holds the site (ST A.3 — the clearer named holds); no reclaim") · RULINGS-ROUND4 A.3's struck `band` holder; applied by the resumed seat so none is left unapplied] | PR-2 |"""),
# 4. §9.2 (b): ST's round-5 route (a look at an id-less authored gang)
(r"""MN's `believedMenaces` for a MENACE holder, BD's `believedBodyOf` for a BODY (RULINGS-ROUND5 A.5""",
 r"""MN's `believedMenaces` for a MENACE holder, BD's `believedBodyOf` for a BODY — and a look at an ID-LESS AUTHORED GANG (no record and no belief owner before BD-0, ST §2.1) writes nothing [CURED 2026-10-19 (fp-final r5) — ST's round-5 route to PR (`cure/D-ST-r5.md` §5: "a look at an id-less authored gang writes nothing")] (RULINGS-ROUND5 A.5"""),
# 5. §18 felt sentence 21: the chain of R42 (Ashford under Kell)
(r"""21. "Tolle took it ill that the crown called Ashford's riders past it." *(THE RIDE PAST — PL's precedence friction under `unbroken`, §10.3 (b); scrutiny: the summons, Tolle's answer, the row)*""",
 r"""21. "Kell took it ill that the crown called Ashford's riders past it." *(THE RIDE PAST — PL's precedence friction under `unbroken`, §10.3 (b); scrutiny: the summons, Kell's answer, the row)* [REFINED 2026-10-19 (fp-final r5) — the resumed seat: the line named Tolle, but R42's chain is Ashford under KELL under Merewick, so the lord ridden past is Kell]"""),
# 6a. OD-PR-51: both arrays, the pins, visible
(r"""| OD-PR-51 | THE RIDERS ON THE WAYS — one seam, one price (B.4): master's hidden franchise gains ONE declared token, `patrol` (`routeNetworkConsumers.js :: HIDDEN_PATH_KINDS`; +0 lines),""",
 r"""| ⭐ OD-PR-51 (visible: a landed access law widened, as OD-BD-49) | THE RIDERS ON THE WAYS — one seam, one price (B.4): master's hidden franchise gains ONE declared token, `patrol`, in BOTH closed arrays it rests on — `routeNetworkConsumers.js :: TRAVELLER_KINDS` ("`Object.freeze(['army', 'caravan', 'covert_envoy', 'smuggler', 'wanderer'])`") and `HIDDEN_PATH_KINDS`, each kept codepoint-sorted (+0 lines); master's pins in `tests/domain/routeNetworkConsumers.test.js` bind it — "`for (const kind of HIDDEN_PATH_KINDS) expect(TRAVELLER_KINDS).toContain(kind);`", "`expect([...HIDDEN_PATH_KINDS].sort()).toEqual([...HIDDEN_PATH_KINDS]);`" and the exact-vocabulary pin "`expect([...TRAVELLER_KINDS]).toEqual(['army', 'caravan', 'covert_envoy', 'smuggler', 'wanderer']);`", which PR-2's unit RE-RECORDS with this cause stated (no src module iterates `TRAVELLER_KINDS`: the widening moves no other behaviour) """ + TK + r""","""),
# 6b. PR16
(r"""the riders' declared hidden token `patrol` joins `routeNetworkConsumers.js :: HIDDEN_PATH_KINDS`' one frozen array (+0 lines; PR-2's unit, OD-PR-51) [CURED 2026-10-19 (fp-final r5) — B.4];""",
 r"""the riders' declared hidden token `patrol` joins `routeNetworkConsumers.js :: TRAVELLER_KINDS` and `HIDDEN_PATH_KINDS` (+0 lines: one token in each frozen array, codepoint-sorted; master's exact-vocabulary pin re-recorded with its cause; PR-2's unit, OD-PR-51) [CURED 2026-10-19 (fp-final r5) — B.4] """ + TK + r""";"""),
# 6c. §5.5 franchise paragraph
(r"""PR DECLARES ONE token, `patrol`, on `HIDDEN_PATH_KINDS` at PR-2's unit""",
 r"""PR DECLARES ONE token, `patrol`, on the franchise's two pinned arrays `TRAVELLER_KINDS` and `HIDDEN_PATH_KINDS` (codepoint-sorted; OD-PR-51) at PR-2's unit"""),
# 6d. PR-2 car-0
(r"""(540 lines; the token `patrol` joins the one frozen array, no new line""",
 r"""(540 lines; the token `patrol` joins `TRAVELLER_KINDS` and `HIDDEN_PATH_KINDS`, codepoint-sorted, no new line, and master's exact-vocabulary pin in `tests/domain/routeNetworkConsumers.test.js` is re-recorded at this unit with the cause stated """ + TK + r""""""),
# 6e. PR-2 host edits
(r"""**Host edits:** `routeNetworkConsumers.js :: HIDDEN_PATH_KINDS` (+0 lines: the declared token `patrol`) [CURED 2026-10-19 (fp-final r5) — B.4];""",
 r"""**Host edits:** `routeNetworkConsumers.js :: TRAVELLER_KINDS` · `HIDDEN_PATH_KINDS` (+0 lines: the declared token `patrol` in each; `tests/domain/routeNetworkConsumers.test.js`'s exact-vocabulary pin re-recorded, cause stated) [CURED 2026-10-19 (fp-final r5) — B.4] [REFINED 2026-10-19 (fp-final r5) — the second array and the pin, measured];"""),
# 6f. token register row
(r"""enters `HIDDEN_PATH_KINDS` in the SAME sense (a settlement's riders)""",
 r"""enters `TRAVELLER_KINDS` and `HIDDEN_PATH_KINDS` in the SAME sense (a settlement's riders; both arrays pinned codepoint-sorted on master)"""),
]
for a,b in reps:
    n=s.count(a)
    assert n==1,(n,a[:90])
    s=s.replace(a,b)
open(p,'w',encoding='utf-8').write(s)
print('applied',len(reps))
