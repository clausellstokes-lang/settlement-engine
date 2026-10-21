import sys
p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_OP.md'
s=open(p,encoding='utf-8').read()
orig_len=len(s)
def rep(old,new,count=1):
    global s
    n=s.count(old)
    assert n==count, (n, old[:120])
    s=s.replace(old,new)
B4='[CURED 2026-10-20 (fp-final P6 r4) — '
# 0. header line after ROUND r3
old='the record is §19\'s Round r3 block; the log `cure/D-OP-r3.md`.\n'
rep(old, old+'## ROUND r4 CONSOLIDATED (P6d, the residue lane D-FOUR-r4, Opus 5.5, 2026-10-20; RULINGS-P6 §G — no round 4, no verifier; the seams seat and the P7 fold check it): the r3 verifier\'s one fail-turned-MAJOR OP-V5 under the chair\'s ruling §G.1 and its five minors (`skeptic/OP-r3-verify.md`); `[CURED 2026-10-20 (fp-final P6 r4) — <id>: …]` and `[REFINED 2026-10-20 (fp-final P6 r4) — …]` mark every change; the record is §19\'s Round r4 block; the log `cure/D-FOUR-r4.md`.\n')
# A. §9 sentence pointer
old='[CURED 2026-10-20 (fp-final P6 r3) — OP-Vm1] — and a man no longer there is `not_there` (OP3)'
rep(old,'[CURED 2026-10-20 (fp-final P6 r3) — OP-Vm1] — and that exert is THE RESCUE CARD ONLY, never a week in its calling at the jailer\'s town (the bullet THE EXERT IS THE CARD ONLY, below; RULINGS-P6 G.1) '+B4+'OP-V5] — and a man no longer there is `not_there` (OP3)')
# B. new bullet after THE ACT
old='[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-21: relabelled from "before ES-2b", unreachable once the flag\'s certification requires ES-2b].\n'
new=old+('- **THE EXERT IS THE CARD ONLY (RULINGS-P6 G.1).** When CH\'s exert answers a `captive_held` source — the HELP call at the venue, or the villain\'s `harm` twin there — its ONLY effect is the offer of `rescue_attempt` and that card\'s verdict (§5.2–§5.3); it is NOT a week in the paragon\'s calling at the jailer\'s town: (i) NO CALLING STAY — CH §2.2b\'s stay (`calling: { settlementId, sinceTick, weeks }`, opened at the first `exerted` week in a town) is neither opened nor advanced by it, so no `paragon_exerted` deed is ever minted for it at that town; (ii) NO SEAM LEAN — CH §6\'s `paragonLean` and §6.1\'s `paragonRows` find no row from it (no magistrate\'s ×0.8 "hears the people\'s grievances in <town>", no agitator\'s ×1.3) and PR\'s WILL gate reads no `patrol_will` from it; (iii) ONE DEED — OP\'s `opportunity_act` (`captive_rescued` on `freed`, `rescue_foiled` on `caught`; nothing on `turned_back` or `refused`, §5.3), its `target` the JAILER `jailerOf(hold)` — the court whose cells they are, the OCCUPIER in an occupied town (D.2), never the occupied court — so a champion breaking Kell\'s cells neither calms Kell\'s streets nor stiffens Kell\'s watch nor earns an admirable deed AT Kell, and a villain breaking an occupied town\'s cells harms the occupier, never the occupied court. How CH records such an exertion so that its stay, its two gift reads and `patrol_will` skip it is CH\'s carve-out on §4.5 · §6.1 · §2.2b (ROUTED — the P6c CH lane; proposed, PLAUSIBLE: the persisted `exertion` carries its call\'s `source.kind` and each of those readers skips `captive_held`) '+B4+'OP-V5 (MAJOR; G.1): r3\'s gate read the source\'s venue as "here" and so made the rescuer\'s exert an ordinary calling exertion — CH §4.5 "it EXERTS", the §6.1 `order` row\'s ×0.8 at `exertion.settlementId`, CH l.229 `patrol_will`, CH l.242 `paragon_exerted` "its target the town" — all firing at the JAILER\'s town] [REFINED 2026-10-20 (fp-final P6 r4) — the act\'s FACE that CH\'s roll reads for this exert (CH §10b l.569 "THE ACT\'S FACE … the exert decision → `paragon_exerted` for its domain") is the `captive_rescued` row RN registers from OP\'s proposal (§2.4), never `paragon_exerted` — so the patron\'s lean ("a merciful god\'s champion rescues readily") weighs the rescue itself; ROUTED to CH with the carve-out].\n')
rep(old,new)
# C. §5.3 (d) and (e)
old='else its court as a TALE (RN1: a tale adds no fame); witnessed per RN\'s own rules.'
rep(old,'else its court as a TALE (RN1: a tale adds no fame); witnessed per RN\'s own rules; its `target` the JAILER — `jailerOf(hold)`, the court whose cells were broken (the OCCUPIER in an occupied town, D.2), never the venue as a place nor the occupied court — so RN\'s lens two reads the rescue against the jailer, and a paragon rescuer mints this deed and no `paragon_exerted` (§9 THE EXERT IS THE CARD ONLY) '+B4+'OP-V5 (G.1): the deed\'s target named].')
old='(e) THE DEED `rescue_foiled` (RN).'
rep(old,'(e) THE DEED `rescue_foiled` (RN), its `target` the jailer (`jailerOf`, as `freed`\'s (d)) '+B4+'OP-V5 (G.1)].')
# D. §12 OP-6
old='its gate reading the source\'s `venueId` as here (§9) [CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 · OP-V2] [CURED 2026-10-20 (fp-final P6 r3) — OP-Vm1];'
rep(old, old[:-1]+' — that exert is THE RESCUE CARD ONLY: no calling stay, no seam lean, no `paragon_exerted` at the jailer\'s town; the act\'s one deed is OP\'s `opportunity_act` targeted at `jailerOf` (§9; G.1 — CH\'s carve-out on §4.5 · §6.1 · §2.2b is the P6c CH lane\'s bracket) '+B4+'OP-V5];')
# E. §15 CH row
old='the exert\'s offer of `rescue_attempt` at the venue;'
rep(old,'the exert\'s offer of `rescue_attempt` at the venue AS ITS ONLY EFFECT (RULINGS-P6 G.1): for a `captive_held` source the exert opens and advances no calling stay, leans no seam (`paragonLean` and `paragonRows` — the magistrate\'s ×0.8, the agitator\'s ×1.3 — and PR\'s `patrol_will`) and mints no `paragon_exerted` at the jailer\'s town; the act\'s one deed is OP\'s `opportunity_act` targeted at `jailerOf` (the occupier in an occupied town), and the act\'s FACE CH\'s roll reads (§10b l.569) is that `captive_rescued` row [REFINED 2026-10-20 (fp-final P6 r4)] — CH\'s carve-out on §4.5 · §6.1 · §2.2b · §10b (the P6c CH lane) '+B4+'OP-V5];')
# F. §14 new row 37 after row 36
i=s.index('| 36 | The harm twin\'s knowledge |')
j=s.index('\n',i)
row37=('\n| 37 | The rescuer\'s exert is the card only | a champion answering Tolle\'s `captive_held` call exerts at Kell: `rescue_attempt` is offered; the paragon\'s `calling` stay at Kell is neither opened nor advanced; `paragonLean(worldState, Kell, \'order\', seam)` and `paragonRows` return no row from that exertion and PR\'s `patrol_will` reads none; no `paragon_exerted` is minted at Kell, then or at departure; on `freed` exactly ONE deed — `opportunity_act` / `captive_rescued`, `target` = `jailerOf` (Kell\'s court; in an occupied Kell the occupier); on `caught` one `rescue_foiled`, same target; on `turned_back` / `refused` none '+B4+'OP-V5 (G.1)] | OP-6 (CH) |')
s=s[:j]+row37+s[j:]
# G. OD-OP-36 after OD-OP-35 row
i=s.index('| OD-OP-35 |')
j=s.index('\n',i)
od36=('\n| OD-OP-36 | THE RESCUER\'S EXERT IS THE CARD ONLY (RULINGS-P6 G.1): for a `captive_held` source — help or harm — CH\'s exert offers `rescue_attempt` and nothing else: no calling stay, no seam lean (the `order` row\'s ×0.8 / ×1.3, `patrol_will`), no `paragon_exerted` at the jailer\'s town; the act\'s one deed is OP\'s `opportunity_act` targeted at `jailerOf`, and its face in CH\'s roll is the `captive_rescued` row [REFINED]; CH\'s carve-out is the P6c CH lane\'s bracket '+B4+'OP-V5] |')
s=s[:j]+od36+s[j:]
# H. minor m1: OP16 + §2.5 pricer
old='a detour\'s price is `namedPersonLegTicks` over `hopWeeks` on a canonized map and `UNPRICED_LEG_WEEKS` (one week) per graph hop without one'
rep(old,'a detour\'s price is the errand\'s own pricer `livedLegTicks` — `namedPersonLegTicks` over `hopWeeks` with the hop\'s grade multiplier (§3.3) — on a canonized map and `UNPRICED_LEG_WEEKS` (one week) per graph hop without one '+B4+'OP-r3v-m1: the bare `namedPersonLegTicks` dropped the grade multiplier §3.3 names]')
old='less the planned one, priced by `namedPersonLegTicks` (a rider\'s pace'
rep(old,'less the planned one, priced by the errand\'s pricer `livedLegTicks` (`namedPersonLegTicks` with the hop\'s grade multiplier, §3.3) '+B4+'OP-r3v-m1] (a rider\'s pace')
# I. minor m3: OP-1 dependency wording
old='the persisted demand is the only arrival (D.1); the roads-hostage detour'
rep(old,'the persisted demand is that hold\'s only arrival at master\'s roads (D.1) — an RN capture TELLING joins it only once RN\'s P7 row accepts that source (OP3 (b)) '+B4+'OP-r3v-m3]; the roads-hostage detour')
# J. minor m5: OP-6 FIRST-VISIBLE parenthesis
old='(at master only a roads hostage\'s home holds such a call, and only a free paragon — or a bound one whose venue lies inside its employer\'s lands — can reach it)'
rep(old,'(at master only a roads hostage\'s home holds such a call, and only a free paragon — or a bound one whose venue lies inside its employer\'s lands — can reach it; a roads hostage is held in the CAPTOR\'s own town, so the bound case needs a member town of its employer\'s lands to be the captor at a T4 rung toward its own crown — a rebel\'s roads, rare (PLAUSIBLE) — and the first sign is in practice a FREE paragon\'s '+B4+'OP-r3v-m5])')
open(p,'w',encoding='utf-8').write(s)
print('ok', orig_len, len(s))
