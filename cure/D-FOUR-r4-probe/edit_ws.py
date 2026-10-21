p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_WS.md'
s=open(p,encoding='utf-8').read()
L0=len(s)
C='[CURED 2026-10-20 (fp-final P6 r4) — '
R='[REFINED 2026-10-20 (fp-final P6 r4) — '
def rep(old,new,count=1):
    global s
    n=s.count(old); assert n==count,(n,old[:150])
    s=s.replace(old,new)
# H header
old="The lane log and its executed probes: `cure/D-WS-r3.md`, `cure/D-WS-r3-probe/` (the pre-round volume: `WS-before-r3.md`).\n"
rep(old, old+"## CONSOLIDATED IN ROUND r4 (P6d, 2026-10-20; the residue lane D-FOUR-r4, Opus 5.5; no round 4, no verifier — the seams seat and the P7 fold check it) under the chair's `briefs/RULINGS-P6.md` §G (G.3 WS-V7 by the verifier's own cure · G.4 DEPLETION = CONSCRIPTED ONLY): the two NEW MAJORs and three minors of `skeptic/WS-r3-verify.md` are in §17 THE CURE RECORD (round r4 block); each changed passage carries `[CURED 2026-10-20 (fp-final P6 r4) — <id>: what changed]`, each refinement `[REFINED 2026-10-20 (fp-final P6 r4) — …]`. The lane log and its executed probe: `cure/D-FOUR-r4.md`, `cure/D-FOUR-r4-probe/levyShrink-r4.{mjs,out}`.\n")
# ---- G.3 WS-V7: the replacing sentence tensed by the plan's own record
old="A situation turn that REPLACES a character-borne one says so, and never claims the doctrine's campaign stopped (WS never leans inside it): \"Brannoch, still closing Varn's markets, kept its host behind its own walls this season: its host had been beaten in the field.\" [CURED 2026-10-20 (fp-final P6 r3) — WS-r1-1 (E.1)]"
new=("A situation turn that REPLACES a character-borne one says so, and never claims the doctrine's campaign stopped (WS never leans inside it) — NOR THAT IT GOES ON WHEN IT HAS ENDED: the plan's clause is TENSED BY THE PLAN'S OWN RECORD at the receipt's tick — (a) while the court's plan stands against this foe (`spatialLedgers.campaignPlans[courtId].targetId` = the foe), \"still …\": \"Brannoch, still closing Varn's markets, kept its host behind its own walls this season: its host had been beaten in the field.\"; (b) once the plan is gone — the landed abandon arm drops it (`supplyWebWarfare.js :: advanceSupplyWebWarfare` \"continue; // drop the plan (do not carry to nextLedger)\", its news \"${A} abandons its strangulation of ${Tn}\") or its last stage completes it (\"Drop it (the siege is now the war layer's job)\") — the PAST tense of a stage its own receipt recorded: \"Brannoch, which had closed Varn's markets, kept its host behind its own walls this season: its host had been beaten in the field.\"; (c) with no struck stage on record, no clause: \"Brannoch kept its host behind its own walls this season: its host had been beaten in the field.\" The clause's verb is the struck stage's own instrument (the embargo's markets, the raid's farms), never a forecast [CURED 2026-10-20 (fp-final P6 r3) — WS-r1-1 (E.1)] "+C+"WS-V7 (MAJOR; G.3, the verifier's own cure): r3's \"still closing\" asserted a campaign the landed abandon arm may already have ended — §5.1's flicker law keeps the TURN standing through an abandonment, never the plan; CONFIRMED at master: the abandon arm drops the row and mints `webwar_campaign_abandoned`]")
rep(old,new)
# S22 add assertion
old="with the deviation dark nothing turns and the war's source stays `derived` [CURED 2026-10-20 (fp-final P6 r3) — WS-r1-1 (E.1)] |"
rep(old,"with the deviation dark nothing turns and the war's source stays `derived` [CURED 2026-10-20 (fp-final P6 r3) — WS-r1-1 (E.1)]; the replacing receipt says \"still …\" only while `campaignPlans[courtId].targetId` is the foe at its tick; after the abandon arm (or the completion) drops the plan, the past tense of a stage whose own receipt is on record; with none, no plan clause "+C+"WS-V7] |")
# §16 #16 new felt sentence after #15
old="15. SCRUTINY (a tie, the Why panel):"
i=s.index(old); j=s.index('\n',i)
s=s[:j]+"\n16. SURFACE (a situation REPLACING a plan's turn, after the plan was abandoned): \"Brannoch, which had closed Varn's markets, kept its host behind its own walls this season: its host had been beaten in the field.\" (`field_lost` → `way_fortress` over a `campaign_plan` turn; \"still closing\" only while the plan stands against Varn, the past tense of a recorded stage once it is gone, no clause where none struck — §5.2) "+C+"WS-V7]"+s[j:]
# ---- G.4 WS-V8: levy_thin (ii)
start="(ii) the war has taken MOST of the men its home could spare when this host marched"
end="a home that could spare no one at the march (at or below the floor) is SMALL, never thin — the cause does not hold;"
assert s.count(start)==1 and s.count(end)==1
i=s.index(start); j=s.index(end)+len(end)
newii=("(ii) the war has taken MOST of the men its home could spare when this host marched — DEPLETION IS CONSCRIPTED ONLY (RULINGS-P6 G.4): the NUMERATOR is the SENT COUNT, the landed bank on the host — `deployments[courtId].deployedPopulation` (`warHomeCosts.js :: applyHomeWarCosts` \"deployments[fromId] = { ...deployments[fromId], deployedPopulation: prevDeployed + sent };\") less its vassals' levies (`leviedPopulationBySource`), read through `conscriptedShareOf(deployment)` (the landed `deploymentReturn.js :: deploymentReturnOutcomes` \"const conscripted = Math.max(0, deployedPopulation - leviedTotal);\"; `warCosts.js :: readWarHomeFront` takes the same subtraction, \"const actorDeployedPopulation = Math.max(0, deployedPopulation - leviedPopulation);\"); the DENOMINATOR is THE ROOM AT THE MARCH, which no landed record keeps (the deployment stores no home population — `warArmyRecord.js` mints \"sinceTick: tick,\" … \"maxStartStrength: start,\" and no headcount of the home), so WS STAMPS IT ONCE — P5 `spatialLedgers.warLevyMarks[courtId] = [roomAtMarch, sinceTick]` (⭐ THE OWNER'S SHAPE, OD-WS-40; §2.2, §11), written by `wayOfWar.js :: markLevyRoom` at the first read of the court's deployment while its `deploymentAge` is at most one week: `roomAtMarch := conscriptionRoomOf(homePopNow + conscriptedNow)` — the landed \"const room = Math.max(0, homePop - WAR_CONSCRIPT_POP_FLOOR);\" over the home as it stood before the war's own draw (a non-war loss in the march's own week is part of the home the host marched from — declared, DRAFT); a host re-raised against the same foe is a new deployment (a new `sinceTick`) and is stamped afresh; (ii) holds where `conscripted / roomAtMarch` is at or above `WAY_LEVY_SPENT` (DRAFT one half, UNMEASURED). EXODUS, PLAGUE AND FAMINE ARE NOT DEPLETION — they move the home's population band, a strengths fact (§3.2), never this ratio; EXECUTED `cure/D-FOUR-r4-probe/levyShrink-r4.out` over the verifier's four homes (`skeptic/WS-r3-verify-probe/levyShrink.out`, re-run byte-identical): a home of 400 with an exodus of 140 reads \"r3\":1 against the cure's \"r4\":0.067 = \"truth\":0.067, 600 with 300 fled \"r3\":0.74 against \"r4\":0.106, 1,000 with 700 fled \"r3\":1 against \"r4\":0.08 — \"firstR4Hold\":null in all four; the positive controls agree with the truth tick for tick (a home of 300 \"firstR4Hold\":13 = \"firstTrueHold\":13; 400 at 38 = 38; \"r4EverDisagreesWithTruth\":0); a deployment first read OLDER than a week carries NO mark and (ii) never holds for it — a war lit mid-campaign never claims a depletion it cannot measure (\"firstReadAge\":6 → \"mark\":\"none\", never holds); a home that could spare no one at the march (at or below the floor) is SMALL, never thin — its mark is 0 and the cause does not hold "+C+"WS-V8 (MAJOR; G.4): r3's denominator `conscripted + room` equalled the room at the march only while nothing but conscription moved the home — `calamityKernel.js` (\"Fled the calamity.\") and `populationDynamics.js` shrink it too, and the verifier's probe read a home of 400 with an exodus of 140 as \"spent\":1 against a true 0.067] "+R+"the room at the march has no landed carrier, so G.4's \"start-of-war room\" is a one-row stamp WS owns (P5, the owner's shape — vetoable; the alternative is a WC car stamping it on the deployment record at its mint, a landed shape's change); the stamp's one-week window and the mid-war no-mark rule are this lane's];")
s=s[:i]+newii+s[j:]
# §2.2 P5 row after P4 row
i=s.index('| P4 | `spatialLedgers.warWays[courtId]'); j=s.index('\n',i)
p5row=("\n| P5 | `spatialLedgers.warLevyMarks[courtId] = [roomAtMarch, sinceTick]` — the room the court's HOME could spare when its CURRENT host marched (`conscriptionRoomOf` over the home before the war's own draw), keyed by the court (one deployment per settlement at a time) and stamped with the deployment's `sinceTick` | one `spatialLedgers` sub-key, drop-when-empty (a row drops when the court's deployment ends or its `sinceTick` differs — a re-raised host is stamped afresh) | `wayOfWar.js :: markLevyRoom` (the one writer; written only at the first read of a deployment at most a week old, only where `levy_thin` can fire: `wayOfWarDeviationEnabled` ∧ `warEconomyDrainEnabled` ∧ `treasuryEnabled`) | ⭐ OWNER'S SHAPE, declared (OD-WS-40); `levy_thin`'s half (ii) REQUIRES it — unsigned, `levy_thin` never holds; its ten paths in §11 "+C+"WS-V8 (G.4)] |")
s=s[:j]+p5row+s[j:]
# §11 P5 lifecycle before P3 section
old="### P3 (CONTINGENT, DARK, UNDECLARED until OD-WS-3)"
p5life=("### P5 `spatialLedgers.warLevyMarks[courtId] = [roomAtMarch, sinceTick]` — the room at the march (⭐ THE OWNER'S SHAPE, OD-WS-40; `levy_thin`'s half (ii) requires it) "+C+"WS-V8 (G.4)]\n\n"
"| path | behaviour |\n|---|---|\n"
"| create | `markLevyRoom`, at the FIRST read of the court's own deployment (`worldState.deployments[courtId]`) while its `deploymentAge` is at most one week and no row carries its `sinceTick`: `roomAtMarch := conscriptionRoomOf(homePopNow + conscriptedShareOf(deployment))` — the home before the war's own draw; only where `wayOfWarDeviationEnabled` ∧ `warEconomyDrainEnabled` ∧ `treasuryEnabled` are lit (where `levy_thin` can fire); a deployment first met older than a week is never stamped |\n"
"| read | `wayDeviationCauseOf`'s `levy_thin` half (ii) only: `conscriptedShareOf(deployment) / roomAtMarch ≥ WAY_LEVY_SPENT`, the row's `sinceTick` equal to the deployment's (a mismatch reads as no mark) |\n"
"| persist | `spatialLedgers` JSON scalars — two integers (the habit ledger's law: never a Map, Set or Date) |\n"
"| regenerate | a regenerated world starts without it (no deployment, no mark) |\n"
"| undo | rides the advance's snapshot undo with the rest of `spatialLedgers` |\n"
"| import | rides the campaign; a non-integer or negative field drops the row at read (total on garbage) — `levy_thin` (ii) then does not hold for that host |\n"
"| migrate | none at birth (absent ⇒ (ii) never holds) |\n"
"| dark-after-lit | any of the three flags off: no write; the drop pass removes every row whose deployment has ended; relit mid-war: the host already older than a week stays unstamped and (ii) never holds for it |\n"
"| death | the court's deployment ends (homecoming, recall, withdrawal) or the court is destroyed ⇒ the row dropped by the drop pass; a re-raised host is a new `sinceTick`, stamped afresh at its own march |\n"
"| veil | the court's own and the DM's (SCRUTINY: the Why panel may say \"of the men Kell could spare when its host marched, the war has taken most\"); a foe never reads it |\n\n"
"HORIZON: at most one row per court (one deployment per settlement at a time); a row lives exactly as long as its host's deployment; the sub-ledger drops when empty. Its token census: `warLevyMarks` · `markLevyRoom` FREE (`cure/D-FOUR-r4-probe/tokens-ws.out`: 0 files on master `src` · `tests` · `docs` and the ledger's docs).\n\n")
rep(old,p5life+old)
# §9 flags: deviation requires
old="| `wayOfWarEnabled` · P4 DECLARED BY THE OWNER (OD-WS-23) |"
rep(old,"| `wayOfWarEnabled` · P4 DECLARED BY THE OWNER (OD-WS-23); for `levy_thin`'s half (ii) also P5 (OD-WS-40 — unsigned, `levy_thin` never holds) "+C+"WS-V8] |")
# §10 WS-4 wave: add markLevyRoom and degraded arm
old="`warEconomyDrainEnabled` dark ⇒ `levy_thin` dark (no conscription to spend);"
rep(old,"`warEconomyDrainEnabled` dark ⇒ `levy_thin` dark (no conscription to spend); P5 unsigned (OD-WS-40) ⇒ `levy_thin` dark (no room at the march to measure against) "+C+"WS-V8];")
old="| **WS-4 THE DEVIATION** | `wayOfWar.js :: wayOfWarForWar · wayDeviationCauseOf · latchWarWay · wayPriorOf` + the season's draw; the P4 ledger (⭐ OD-WS-23, the owner's word first);"
rep(old,"| **WS-4 THE DEVIATION** | `wayOfWar.js :: wayOfWarForWar · wayDeviationCauseOf · latchWarWay · wayPriorOf · markLevyRoom` + the season's draw; the P4 ledger (⭐ OD-WS-23, the owner's word first); the P5 mark (⭐ OD-WS-40, the owner's word first; `levy_thin`'s room at the march) "+C+"WS-V8];")
# §12 S24
old="a home at or below the conscription floor at the march never holds it (small, never thin — `levyDepletion.out`);"
rep(old,"a home at or below the conscription floor at the march never holds it (small, never thin — `levyDepletion.out`); EXODUS IS NOT DEPLETION (G.4): the verifier's four homes (`levyShrink.out` — 400 with 140 fled, 600 with 300, 1,000 with 700, and 400 with none) never hold (ii) under the cure (`cure/D-FOUR-r4-probe/levyShrink-r4.out`: \"firstR4Hold\":null each), while a home of 300 whose conscription alone spends half its room holds at the same tick as the truth (13); a host first read older than a week has no P5 mark and never holds (ii); with P5 unsigned the cause never fires "+C+"WS-V8];")
# §13 WC coupling row: conscriptionRoomOf read once at the mark
old="(byte-identical; the denominator of `levy_thin`'s depletion — the draw is no longer read, E.2);"
rep(old,"(byte-identical; read ONCE, at the P5 mark, over the home before the war's own draw — the room at the march, `levy_thin`'s denominator (G.4); never the live room "+C+"WS-V8]; the draw is no longer read, E.2);")
# §15 OD rows
old="the home's conscripts on the host at least `WAY_LEVY_SPENT` of the room it had at the march (`conscriptedShareOf` over itself plus `conscriptionRoomOf` — WC's two cars), the coffers `full+`;"
rep(old,"the home's conscripts on the host at least `WAY_LEVY_SPENT` of the room it had at the march — the SENT COUNT (`conscriptedShareOf`, the landed bank less the vassals' levies) over P5's mark (`conscriptionRoomOf` over the home before the war's own draw, stamped once, G.4; exodus, plague and famine are not depletion) "+C+"WS-V8: r3's `conscripted + room` denominator struck], the coffers `full+`;")
old="the home's own share read through `conscriptedShareOf` (the landed subtraction, never re-derived) [CURED 2026-10-20 (fp-final P6 r3) — WS-r1-13 (E.2)] |"
rep(old,"the home's own share read through `conscriptedShareOf` (the landed subtraction, never re-derived) [CURED 2026-10-20 (fp-final P6 r3) — WS-r1-13 (E.2)]; the denominator the P5 mark (OD-WS-40), stamped at the march and never the live room — a host first read older than a week has none and never holds (ii) "+C+"WS-V8] |")
i=s.index('| OD-WS-39 |'); j=s.index('\n',i)
s=s[:j]+"\n| ⭐ OD-WS-40 | P5 `spatialLedgers.warLevyMarks[courtId] = [roomAtMarch, sinceTick]` — THE ROOM AT THE MARCH, `levy_thin`'s depletion denominator (RULINGS-P6 G.4: \"DEPLETION = CONSCRIPTED ONLY — the sent count … against the start-of-war room\"), stamped once by `markLevyRoom` at the first read of a deployment at most a week old; ten paths in §11; unsigned ⇒ `levy_thin` never holds "+C+"WS-V8] "+R+"the carrier is this lane's; the alternative — a WC car stamping the room on the deployment record at its mint — changes a landed shape] | OWNER'S SHAPE, declared (VISIBLE); the one-week stamp window DRAFT |"+s[j:]
# §16 #9 bracket
old="a modest Kell in a long campaign — a large town rarely reaches it within one campaign, `levyDepletion.out`; full_simulation with the treasury lit; spoken only when the call was made) [CURED 2026-10-20 (fp-final P6 r3) — WS-r1-13 (E.2)]"
rep(old, old+" "+C+"WS-V8: \"most of the men Kell itself could spare\" is now TRUE BY CONSTRUCTION — Kell's own conscripts on the host are at least half the room P5 stamped when the host marched; an exodus or a plague that shrank Kell since never makes it true (`levyShrink-r4.out`)]")
# §14 token register: add a row after the r3 tokens row
old="| new in r3, FREE by `rg -w`/`grep -w` (`cure/D-WS-r3-probe/tokens-r3.out`): `WAY_LEVY_SPENT` · `conscriptedShareOf` · `tiedWith` |"
i=s.index(old); j=s.index('\n',i)
# determine the column count of that row
row=s[s.rfind('\n',0,i)+1:j]
def cells(l):
    out=0; inb=False
    for ch in l:
        if ch=='`': inb=not inb
        elif ch=='|' and not inb: out+=1
    return out
nc=cells(row)
if nc==4:
    s=s[:j]+"\n| NEW in r4 | `warLevyMarks` (P5's sub-key) · `markLevyRoom` (its one writer) "+C+"WS-V8] | FREE by `rg -l -w -i` (`cure/D-FOUR-r4-probe/tokens-ws.out`: 0 files on master `src` · `tests` · `docs`, 0 in the ledger's docs) |"+s[j:]
else:
    raise SystemExit('token row has %d pipes'%nc)
# ---- minors
# Vm1
old="(the general's authored traits may already sit in the drive's people term; C4 confirms — if not, KEEP may apply)"
rep(old,"(the general's authored traits may already sit in the drive's people term; C4 confirms — either way the turn stays transparent and no KEEP is taken: S17 pins IDENTICAL C1/C2/C6 factors for different generals, and transparency already meets A.2's \"the general once\" "+C+"WS-Vm1: \"if not, KEEP may apply\" struck])")
old="— if they do not, a `commander` turn may lean C1/C2/C6 at KEEP (WS's transparency — the court's own way's lean — is the safe side, E.1);"
rep(old,"— either way a `commander` turn leans C1/C2/C6 exactly as the court's own way (transparency, E.1; S17's identical factors) and never at KEEP "+C+"WS-Vm1];")
# Vm2
old="SURFACE (the shift, the age receipt): \"In the year its new walls were finished, Merewick turned from raiding to its walls.\" [CURED 2026-10-20 (fp-final P6 r2) — WS-r1-13 · WS-r1-1: a strength the town gained; the seat moves a way only through the method's tie-break]"
rep(old, old+" "+C+"WS-Vm2: the r3 correction carried here — E.1 struck the method's tie-break, so a seat moves no way at all (`method_moved` STRUCK, §3.4)]")
# Vm3
old="a READ-ONLY LABEL (\"the doctrine's hand\") for the Why panel and the dossier desk's war line — imported by no fit and no lean (source scan, S23);"
rep(old,"a READ-ONLY LABEL (\"the doctrine's hand\") for the Why panel — the dossier reports the hand only as the deeds its own receipts recorded (§7: \"The doctrine's hand enters the line only as deeds its own receipts recorded\"; E.1's \"reported in … the dossier\" read so), never the label word — imported by no fit, no lean and no dossier leaf (source scan, S23) "+C+"WS-Vm3];")
old="`wayMethodOf` is imported only by the Why panel's and the dossier desk's display leaves (source scan);"
rep(old,"`wayMethodOf` is imported only by the Why panel's display leaf (source scan; the dossier's line carries the hand only as recorded deeds, §7) "+C+"WS-Vm3];")
open(p,'w',encoding='utf-8').write(s)
print('ok',L0,len(s))
