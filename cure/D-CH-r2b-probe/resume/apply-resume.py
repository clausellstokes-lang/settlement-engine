# D-CH-r2b (resumed seat) — anchored single-occurrence replacements, all-or-nothing.
import sys
f='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_CH.md'
t=open(f,encoding='utf-8').read()
R=[]
def rep(old,new): R.append((old,new))
C='[CURED 2026-10-18 (fp-final r2b) — '
RF='[REFINED 2026-10-18 (fp-final r2b) — '

# 1. ST-r2-14 — §0 actor-kinds row
rep("[CURED 2026-10-18 (fp-final r2b) — SEAMS-r2-6: the convention is now `settlement · person · party · menace · site` (fold §3.3.12) and gains `corps` (THE CORPS, §16b; `RULINGS-ROUND2b.md`) — the fold's row at P4]",
"[CURED 2026-10-18 (fp-final r2b) — SEAMS-r2-6: the convention gains `corps` (THE CORPS, §16b; `RULINGS-ROUND2b.md`) — the fold's row at P4] "+C+"ST-r2-14, as RULED in `RULINGS-ROUND2b.md`'s ADDENDUM: the actor kinds are `settlement · person · party · menace`, and CH's `corps` joins them because a company DECIDES (its weekly choice, §16b); `site` is a WHERE kind (the fold's `ENGAGEMENT_WHERE_KINDS`, §3.4) and a SUBJECT (the `subject` dial), NEVER an actor kind — `POSTURE_ACTOR_KINDS` is the closed set of posture-bearing deciders (\"a posture read that quietly treats a temple as a settlement would be wrong in a way no gate could see\") and \"A site has no mind\" (ST4); the first round-2b seat had copied the fold's §3.3.12 ↳ r2 row (`… · menace · site`), which P4 re-brackets]")

# 2. ST-r2-14 — §16b
rep("SP-4a's `POSTURE_ACTOR_KINDS` and the fold's actor-ref convention (`settlement · person · party · menace · site`) gain `corps`;",
"SP-4a's `POSTURE_ACTOR_KINDS` and the fold's actor-ref convention (`settlement · person · party · menace`) gain `corps` — a company decides, as a site does not: `site` is a WHERE and a subject, never an actor kind "+C+"ST-r2-14, as RULED in `RULINGS-ROUND2b.md`'s ADDENDUM; the convention quoted here had carried `site`];")

# 3. RN rebinding closes the §4.1 carry
rep("[CURED 2026-10-18 (fp-final r2) — the verifier's carry: RN's volume still names no `settlementUpdates` threading (`rg -c settlementUpdates docs/DESIGN_FP_ARCH_RN.md` = 0); CH's requirement stands as written and is routed to RN's lane and the fold's §3.1.22 row; the harbouring write (§11) needs only `worldState` and the graph the stage already receives, so it adds nothing to the requirement]",
"[CURED 2026-10-18 (fp-final r2) — the verifier's carry: RN's volume then named no `settlementUpdates` threading; CH's requirement was routed to RN's lane and the fold's §3.1.22 row; the harbouring write (§11) needs only `worldState` and the graph the stage already receives, so it adds nothing to the requirement] "+C+"`cure/D-RN-r2b.md` (D-CH-r2 §5.2(a), CURED in RN): the requirement is MET — RN's stage now REBINDS the three parameters `worldState`, `wizardNews` and `settlementUpdates` from its result before ENC-3's drop pass and the early return (RN §5.1, ≈ 4 host lines), and RN's lane EXECUTED the shut-gate case (\"with the envoy gate shut the function hands back the very `worldState`, `wizardNews` and `settlementUpdates` it was given\", `cure/D-RN-r2b-probe/earlyReturn.out`), so CH's court hits survive both returns]")

# 4. heardAt in believedWhereabouts (§2.2)
rep("the place of the newest deed about it whose telling has ARRIVED at the observer (RN's arrival test on RN's deed ledger — PLAUSIBLE until CH-4's car-0 names RN's per-deed arrival read); the truth in the omniscient arm — the recruiter's destination (§7) [CURED 2026-10-18 (fp-final r2) — CH-V1] |",
"the `actAt` of the newest deed about it by RN's ONE HEARD TEST at the observer's town — `heardAt(worldState, deed, observerSettlementId, tick).heardTick` (RN §2.3, R55); in the omniscient arm the newest of its deeds inside whose projected reach the town lies, after the news delay — the recruiter's destination (§7) [CURED 2026-10-18 (fp-final r2) — CH-V1] "+C+"`cure/D-RN-r2b.md` (D-CH-r2 §5.2(c), CURED in RN): RN named its per-deed arrival read, so this read is no longer PLAUSIBLE on a missing name] |")

# 5. §7 recruiter's destination wording
rep("(`believedWhereabouts`, §2.2: the place of the newest deed about it whose telling has reached the court; the truth in the omniscient arm)",
"(`believedWhereabouts`, §2.2: where the newest deed about it took place, by RN's heard test `heardAt(…).heardTick` at the court's town; in the omniscient arm the newest inside whose reach that town lies)")

# 6. CH-4 car-0
rep("RN's per-deed arrival read that `believedWhereabouts` composes is named (else the recruiter reads the omniscient arm only, and says so).",
"`believedWhereabouts` composes RN's named per-deed arrival read `heardAt(…).heardTick` (RN §2.3; a pin over R55's case) "+C+"D-RN-r2b §5].")

# 7. §9 road 1 — the leak row of RN's TELLING_SOURCES
rep("CH REGISTERS a leak source with RN-0's telling arm (`renown/deedTelling.js`, already ONE call inside `rumorNetwork.js :: advanceRumorLedgers`, RN's +4 lines) — a closed registration list that one call reads, so CH adds no host line; if RN's arm cannot take a registered source, CH's own call costs ≤ 3 lines in `rumorNetwork.js` (364), measured at CH-7's car-0. The telling's origin is the worked-against town (`provenance.originId`; the slander idiom of RULINGS §4, so the source is traceable) and its `eventRef` is `leak:<wnpcId>:<employerId>`.",
"CH REGISTERS the `leak` row of RN's `TELLING_SOURCES` (RN §2.4, §3.4: \"a closed registration list of NON-DEED tellings RN's one telling call seeds\", read inside `renown/deedTelling.js`, the ONE call in `rumorNetwork.js :: advanceRumorLedgers`), so CH adds no host line; RN records that the ≤ 3-line fallback in `rumorNetwork.js` \"is not needed\", PLAUSIBLE until CH-7's car-0 measures the row's inputs. THE ROW is a pure function of `(worldState, tick)` returning RN's seed shape `{ eventRef, eventTick, originIds, significance, score, content }`: for each paragon whose `retainer.covert` stands and whose `exertion` reads `{ tick: tick − 1, outcome: 'exerted' }` at the settlement it stands in (an exerting paragon stays where it exerted, §4.2), the keyed hash decides. Its inputs were written by the person stage LAST tick, because the rumour stage runs before the person stage in the kernel's order — so a leak lags its exertion by one week, §6.3's t+1. The telling's origin is the worked-against town (`originIds`; the slander idiom of RULINGS §4, so the source is traceable) and its `eventRef` is `leak:<wnpcId>:<employerId>`. ITS DECLARED CONTENT (RN copies only the fields a row declares — `captureContent`'s law, \"ONLY structured fields are copied\" — and each declared field's lifecycle row is CH's, §21 L9): `what: 'paragon_leak'`; `whereId: ''` and `partyIds: []`, so the secret refreshes no settlement's belief slot (`beliefMap.js :: reportsBySubject` reads a record as a report about S only for S in `whereId` ∪ `partyIds`); `scope: 'settlement'`; `magnitude: 0`; `causeClass` and `deityName` null; `visibility: 'mechanical'`, the landed state-only marker, so no rumour panel lists the secret (`settlementRumors.js` keeps only records whose `content?.visibility !== 'mechanical'`) and the accusation's one surface is CH's own dossier line in the court's voice (below); and two structured fields, `paragonId` (the villain's `wnpc_`) and `employerId` (the court). "+C+"`cure/D-RN-r2b.md` §5: RN now takes CH's two registered sources by a closed list and asked CH to name each row's inputs and declare its content fields] "+RF+"the leak's empty `whereId`/`partyIds` and its `mechanical` visibility: a secret about a person and a court should move no town's picture and appear on no rumour panel; vetoable — the alternative names the worked-against town and lets its belief slot refresh, a disclosed shift either way (RN §3.4)]")

# 8. §8 findings row
rep("the meeting seeds ONE telling about its post with the meeting town as its hop-0 origin, through the same registration with RN's telling arm inside `rumorNetwork.js :: advanceRumorLedgers` that §9's leak uses (the next tick's rumour stage; the same fallback of ≤ 3 host lines, shared), so the home court's beliefs absorb it by the one belief road — in the omniscient arm the court already knows; in the two news-only presets it is a news line (PLAUSIBLE until CH-7's car-0 confirms RN's arm takes a second registered source).",
"the meeting seeds ONE telling about its post — the `findings` row of RN's `TELLING_SOURCES` (RN §3.4), read at the NEXT tick's rumour stage: for each paragon with a `postId` whose `aim` is `keep_rendezvous` and which stands at `aim.destId` (it arrived there in last tick's person stage), one seed with `eventRef` `rendezvous:<wnpcId>:<aim.sinceTick>` (one telling per trip; the prefix is CH's, named here as RN asked), hop-0 origin the meeting town, and DECLARED CONTENT `what: 'paragon_findings'`, `whereId: <postId>` and `partyIds: [<postId>]` (so `reportsBySubject` reads it as a report about the post — the one belief road by which the home court's picture of the post refreshes), `scope: 'settlement'`, `magnitude: 0`, `causeClass` and `deityName` null, `visibility: 'mechanical'` (an operative's report is never a rumour panel's line) and `paragonId`. Beliefs have one writer, and this is it; in the omniscient arm the court already knows. PLAUSIBLE until CH-7's car-0 measures the row's inputs on `worldState` at the rumour stage. "+C+"`cure/D-RN-r2b.md` §5 (D-CH-r2 §5.2(d), CURED in RN: the second registered source exists); the round-2 sentence's \"news line in the two news-only presets\" is struck — a `mechanical` telling is never displayed]")

# 9. CH-7 hosts
rep("RN's telling arm — the leak source's and the findings source's registration rows (zero host lines; fallback ≤ 3 in `rumorNetwork.js`, shared) [CURED 2026-10-18 (fp-final r2) — CH-V1];",
"RN's `TELLING_SOURCES` — CH's two rows, `leak` and `findings` (zero host lines; RN §3.4: the ≤ 3-line fallback \"is not needed\") [CURED 2026-10-18 (fp-final r2) — CH-V1] "+C+"D-RN-r2b §5];")

# 10. CH-7 car-0
rep("car-0: the second `applyForeignExposureBlowback` call composes with the kernel's own in one tick; the `exposedAt` latch pin (a row that stays `confident` fires no second blowback)",
"car-0: the second `applyForeignExposureBlowback` call composes with the kernel's own in one tick; the `exposedAt` latch pin (a row that stays `confident` fires no second blowback); each `TELLING_SOURCES` row's inputs stand on `worldState` at the rumour stage, the tick after CH's pass wrote them (the leak: `retainer.covert`, `retainer.employerId`, `exertion.{tick, outcome}` and where the paragon stands; the findings: `postId`, `aim.{purpose, destId, sinceTick}` and where it stands) — RN's PLAUSIBLE, measured once here; the two rows' declared content fields survive a save round trip inside the rumour record (L9) "+C+"`cure/D-RN-r2b.md` §5]")

# 11. waves table CH-7
rep("| CH-7 | paragonLiaison, paragonCovert | RN telling registration 0 (fallback rumorNetwork 3) · ES subject kind 1 row |",
"| CH-7 | paragonLiaison, paragonCovert | RN `TELLING_SOURCES` 2 rows, 0 lines · ES subject kind 1 row |")

# 12. L9 lifecycle row
rep("death — the DM's `disband` (WC's `dissolving` road); veil — as L1 [CURED 2026-10-18 (fp-final r2) — B].",
"death — the DM's `disband` (WC's `dissolving` road); veil — as L1 [CURED 2026-10-18 (fp-final r2) — B].\n\n**L9 — the two registered tellings' declared content fields** (`content.paragonId`, `content.employerId` and the `what` words `paragon_leak` · `paragon_findings`, on `spatialLedgers.rumorLedgers[observerId][key].content`; RN §3.4: \"each declared field is a persisted rumor-ledger field whose lifecycle row is its OWNER's — CH's\"): create — only RN's one telling call, from CH's two `TELLING_SOURCES` rows (§8, §9); CH never writes the rumour ledger; read — CH's pass in THE ONE PERSON STAGE (a leak arrival raises the hearing court's `paragonBeliefs` row, L5) and `reportsBySubject` through the findings' `whereId`/`partyIds` (the home court's belief of the post); persist — inside the rumour record, which `degradeTelling` and `mergeArrival` copy whole (`{ ...record.content, partyIds: [...] }`), so the declared fields ride every relay and merge (PLAUSIBLE until CH-7's car-0 pins the save round trip); regenerate — keyed by `wnpc_` and settlement ids, both stable; undo — the pulse snapshot; import — the rumour ledger's own handling; a `paragonId` that resolves to no paragon is skipped by CH's reader with a receipt; dark-after-lit — the rows seed nothing while `paragonCovertEnabled` is dark, and tellings already on the road finish it read by no one; death of the paragon — its tellings finish their road unread (its `paragonBeliefs` rows drop, L5); veil — `visibility: 'mechanical'`, so no rumour panel lists them, and `'spatialLedgers'` is in `worldSnapshotPublic.js :: WORLD_SNAPSHOT_HARD_DENY`, so no public snapshot carries them. Horizon (requirement 23): the rumour ledger's own TTL (`rumorNetwork.js :: RUMOR_TTL_TICKS`, `{ major: 26, notable: 13 }`), never a CH horizon. Draws: the rumour stage forks per record (`rng.fork(`rumor-organic:${record.eventRef}:…`)`), so a CH telling moves no other record's draw (PLAUSIBLE: the label-keying is read, not executed); lighting the rows is inside `paragonCovertEnabled`'s declared same-seed shift (OD-CH-20). "+C+"`cure/D-RN-r2b.md` §5: \"declares the leak's structured content fields (CH's lifecycle row)\"]")

# 13. §2.3 token row
rep("| THE MAP REGISTER (HOST-r1-5;",
"| ROUND 2b (resumed): `paragon_leak` · `paragon_findings` (the `what` words of CH's two registered tellings) · `paragonId` (a rumour content field) · `employerId` reused as a rumour content field in P1's meaning (the employing court) · `rendezvous:` (the findings' `eventRef` prefix) | 0 src · 0 tests · 0 master docs each (`cure/D-CH-r2b-probe/resume/census-r2b-resume.out`); `employerId` 2 ledger docs (CH, RN — the same meaning); `rendezvous` 3 ledger docs, prose (CH, the champions brief, the fold); no `'leak:` or `'rendezvous:` literal in src | FREE | `paragonId` names a `wnpc_` id only; a corps never seeds a telling "+C+"D-RN-r2b §5] |\n| THE MAP REGISTER (HOST-r1-5;")

# 14. §5 (d) — STOP-PR-0 and SEAMS-r2-7
rep("(d) PR §10.5's warden who rides with a town's riders and the magistrate's order on a town's will register as rows of CH's shared seam leaf, each receipt naming the paragon.",
"(d) PR §10.5's warden who rides with a town's riders and the magistrate's order on a town's will register as rows of CH's shared seam leaf, each receipt naming the paragon. \"Riding with the watch\" is a WEEK, never a mirrored leg: a patrol is a weekly-placed detachment of the town's own capacity, never a stepped unit (PR1; `RULINGS-ROUND2b.md` STOP-PR-0), so the warden's row reads a `wildland` champion whose `exertion.outcome` that week is `exerted` in a town whose riders walk their round, and its one-step lift reaches that town's own halves (PR's `roundOf`). The lift rides INSIDE PR's leans and inherits their bounds: it lowers only what bandits, dens and roosts added to the roads — never the walls term and never a hostile army's or column's presence (PR5 (a); `RULINGS-ROUND2b.md` ADDENDUM SEAMS-r2-7: OD-PS-19 STANDS, \"forts and riders never suppress a hostile ARMY's presence\"). "+C+"STOP-PR-0 (ruled in the round-2b body; not disposed by the first seat) · SEAMS-r2-7 (ADDENDUM): CH's row had no WHEN and no bound of its own]")

# 15. §4.4 pointer
rep("a warden of the champion side weighs riding with a town's riders)",
"a warden of the champion side weighs riding with a town's riders — a week in that town, never a mirrored leg, §5's patrols line (d))")

# 16. §11 waypoint at sea (OD-PS-28)
rep("**The corps arm (a FREE company at a town's gate).**",
"**A waypoint at sea is no arrival.** "+C+"`RULINGS-ROUND2b.md` ADDENDUM OD-PS-28 (\"sailing past a harbour is not landing; coast voyages over waypoints at sea ask nowhere\"), applied to the town's gate so \"landing\" keeps one meaning across THE PASSAGE and CH.] A paragon's leg is ONE hop and lands at its far end — `npcCirculationTransit.js :: nextHopToward` takes `path[1]` of the cheapest candidate route over the routing graph, sea lanes included, and `advanceWanderer` reads \"arriving ⇒ land at the far end and CLOSE the leg\" — so a voyage over several sea lanes touches every port between. A hop arrival at a port ENTERED BY SEA whose next hop toward the aim's destination also LEAVES BY SEA is a WAYPOINT AT SEA: the town's gate is not read, nothing lodges, and the pass opens the next sea leg in the same weekly pass, the record staying a roamer in transit (each leg is still one edge and arrives at least a tick after it departs — `namedPersonTransit`'s law). The modality is the landed `seaRoads.js :: classifyLegModes(digest, path)` (`land · sea`) over the arriving hop and the next one — the read PS2 uses — never a classifier of CH's own. A port entered by sea where the paragon STOPS, or whose next hop leaves by land, is a LANDING, and the town's gate reads it as any arrival; a teleport arrival likewise; every land arrival stays the town's gate's. The corps arm takes the same rule when WC's stepper reports a sea hop (WC-10). "+RF+"the same-pass next leg at a waypoint: a ship that touches a harbour and sails on costs no rest week and never stands in a town it did not enter; vetoable — the alternative rests a week aboard, which needs a whereabouts state the ledger does not have]\n\n**The corps arm (a FREE company at a town's gate).**")

# 17. §5 sea bullet pointer
rep("so a saint takes ship where the canon has a lane.",
"so a saint takes ship where the canon has a lane — and sails past a port without landing there (a WAYPOINT AT SEA, §11: no town's gate, no lodging; OD-PS-28's one meaning).")

# 18. §16 met_in_person
rep("and NEVER repeats once met (`marks.metParty`, one-way).",
"and NEVER repeats once met (`marks.metParty`, one-way — set by CH's stage, the field's one writer, when PT's `met_in_person` deed, minted by PT's door at `RECORD_MEETING` (PT §7.3: \"doer the party, target the person\"), names this paragon as its target) "+C+"`cure/D-PT-r2.md` §5 item 3: \"CH: name `met_in_person` as the producer of `marks.metParty`\"].")

# 19. L3 marks
rep("`marks` are one-way facts (never pruned);",
"`marks` are one-way facts (never pruned; `metParty` is written by CH's stage when PT's `met_in_person` deed names the paragon, §16);")

# 20. §5 (a) believedWatch return
rep("(a) CH's leg choice reads PR's ONE `believedWatch(worldState, snapshot, observerId, roadKey, tick)` over",
"(a) CH's leg choice reads PR's ONE `believedWatch(worldState, snapshot, observerId, roadKey, tick) → { watch01, known }` (its return named, `cure/D-PR-r2.md`'s CH row) over")

# 21. §11 the corps' harbouring episode
rep("`rowId` keeps it exact-once, and the prefix `polity_ban:` is REGISTERED in PL's `FEALTY_EPISODE_PREFIXES` (OD-PL-46).",
"`rowId` keeps it exact-once, and the prefix `polity_ban:` is REGISTERED in PL's `FEALTY_EPISODE_PREFIXES` (OD-PL-46). A FREE corps admitted under the crown's ban (the corps arm's step 2, once PT's actor-ref widening carries the `corps` arm that step 1 needs) is harboured by the same row with the episode `polity_ban:corps:<unitKey>:<banTick>`: the same registered prefix, with the `corps:` segment keeping a company's id apart from a person's. "+RF+"the corps arm reads `polity_ban` \"as for a person\", but the harbouring row's episode named only a `wnpc_` id; PS's `corps:` crossing prefix (a routed PL row) is a different occasion and is not this]")

# 22. banner
rep("No STOP stands in round 2b.",
"No STOP stands in round 2b. **ROUND 2b RESUMED (2026-10-18 ~12:1x EDT, lane D-CH-r2b, a second seat; the first finished its edits and its log but died on the five-hour limit before returning):** the chair's ADDENDUM rows that reach CH — ST-r2-14 (`site` is a WHERE and a subject, never an actor kind), SEAMS-r2-7 (riders never suppress a hostile army, so a warden riding with them never does), OD-PS-28 (a waypoint at sea is no arrival) — the round-2b body's STOP-PR-0 (a patrol is a weekly-placed detachment), and the halves sibling lanes routed here (RN's `TELLING_SOURCES`, `heardAt` and the stage's three rebindings; PT's `met_in_person`; PR's `believedWatch` return) are disposed in §25's Round 2b (resumed) block. No STOP stands.")

# 23. S6
rep("its findings enter Merewick's beliefs only by the one telling seeded at the meeting town;",
"its findings enter Merewick's beliefs only by the one telling seeded at the meeting town (RN's `TELLING_SOURCES` `findings` row, `eventRef` `rendezvous:<wnpc>:<aim.sinceTick>`, `visibility: 'mechanical'` — on no rumour panel);")

# 24. S7
rep("leak rumours write Kell's `paragonBeliefs` row `vague → uncertain`;",
"leak tellings (RN's `TELLING_SOURCES` `leak` row, one week after the exertion, `visibility: 'mechanical'` so no rumour panel lists them, `whereId` empty so no town's belief slot moves) write Kell's `paragonBeliefs` row `vague → uncertain`;")

# 25. S41 / S42
rep("never CH's gate (SEAMS-r2-6) |",
"never CH's gate (SEAMS-r2-6) |\n| S41 | a canon with three ports on one coast joined by sea lanes; a free saint sails from the first to the third; the second port's court bans her | at the second port (entered by sea, left by sea — `classifyLegModes`) no town's-gate card, no residency written, the next sea leg opened in the same pass; at the third, where she stops, the town's gate reads her arrival; the ban at the second port never fires (OD-PS-28) |\n| S42 | PR lit: Ilsa, a warden, exerts in Kell while Kell's riders walk their round, and an enemy army enters Kell's country | Ilsa's row lifts Kell's riders one step on Kell's own halves — the presence that bandits and dens added falls; the army's presence is untouched and latches as before; no leg is mirrored (STOP-PR-0 · SEAMS-r2-7 / OD-PS-19) |")

# 26. OD rows
rep("| — (the OWNER's own, 10-17, message 6) |",
"| OD-CH-39 | A waypoint at sea (`RULINGS-ROUND2b.md` ADDENDUM OD-PS-28) | a port entered by sea and left by sea is no arrival: no town's gate, no lodging, the next sea leg opened in the same pass (REFINED, vetoable); the modality by the landed `classifyLegModes`; a landing or a teleport arrival is the town's gate's as any arrival (§11) |\n| OD-CH-40 | The two registered tellings (persisted shape: rumour content fields; `cure/D-RN-r2b.md` §5) | CH's `leak` and `findings` rows of RN's `TELLING_SOURCES`, each a pure function of `(worldState, tick)` over what the person stage wrote last tick; declared content `what` (`paragon_leak` · `paragon_findings`), `paragonId`, the leak's `employerId`, `visibility: 'mechanical'`; the leak's `whereId`/`partyIds` empty (REFINED, vetoable), the findings' the post; `eventRef`s `leak:<wnpcId>:<employerId>` and `rendezvous:<wnpcId>:<aim.sinceTick>`; lifecycle L9; never deeds, never renown facts (RN OD-RN-38) |\n| — (the OWNER's own, 10-17, message 6) |")

# 27. OD-CH-16 tokens
rep("`sold_out`, `SITE_FIT`, `paragonCorpsEnabled` |",
"`sold_out`, `SITE_FIT`, `paragonCorpsEnabled`; round 2b: `paragon_leak`, `paragon_findings`, `paragonId`, `rendezvous:` (and `employerId` reused in its CH meaning as a rumour content field) |")

# 28. OD-CH-38
rep("plague-R7's quarantine is a slot the town's gate's `under_quarantine` reads when it exists |",
"plague-R7's quarantine is a slot the town's gate's `under_quarantine` reads when it exists; a warden \"riding with the watch\" is a week in that town, never a mirrored leg (STOP-PR-0), and its lift inherits PR5's bounds — never a hostile army's or column's presence (SEAMS-r2-7, OD-PS-19) |")

# 29. §25 heading of the first seat's block
rep("### Round 2b (2026-10-18, lane D-CH-r2b, Opus 5.5) — 21 items: 6 CURED · 0 REFUTED · 0 ⛔ STOP · 15 NOTED",
"### Round 2b — first seat (2026-10-18, lane D-CH-r2b, Opus 5.5) — 21 items: 6 CURED · 0 REFUTED · 0 ⛔ STOP · 15 NOTED")

# 30. CH-1 car-0
rep("car-0: RN's mount threads `worldState`, `wizardNews` AND `settlementUpdates` to both returns (CH-r1-30);",
"car-0: RN's mount threads `worldState`, `wizardNews` AND `settlementUpdates` to both returns (CH-r1-30; met by RN's rebinding, RN §5.1); the waypoint test — `classifyLegModes` over the arriving and the next hop, the same-pass next leg opened with `departTick` = the arrival tick (§11, OD-CH-39);")

for old,new in R:
    n=t.count(old)
    if n!=1:
        print('ANCHOR COUNT',n,'::',old[:100]); sys.exit(1)
for old,new in R:
    t=t.replace(old,new,1)

block = """

### Round 2b — resumed (2026-10-18 ~12:1x EDT, lane D-CH-r2b, a second Opus 5.5 seat) — 15 items: 9 CURED · 0 REFUTED · 0 ⛔ STOP · 6 NOTED

Sources: `briefs/RULINGS-ROUND2b.md`'s ADDENDUM (~10:0x; written after the first seat died) and the round-2b body's STOP-PR-0 (not disposed by the first seat); the halves the round-2b and round-2 sibling lanes route to CH that the first seat did not take (`cure/D-RN-r2b.md` §5, `cure/D-PT-r2.md` §5 item 3, `cure/D-PR-r2.md`'s CH row, `cure/D-PS-r2.md`'s PL note). The first seat's 21 dispositions were verified in place (the volume equals its recorded diff: `diff -u CH.before-r2b.md` against the volume reproduces `volume.diff` byte for byte). Receipts: `cure/D-CH-r2b.md` (resumed section); pre-edit copy, edit script and census: `cure/D-CH-r2b-probe/resume/`.

| Item | Severity | Disposition | Where | What changed |
|---|---|---|---|---|
| ST-r2-14 (ADDENDUM, ACCEPTED) | MAJOR (ST's STOP) | CURED | §0 actor-kinds row, §16b | the actor kinds are `settlement · person · party · menace` plus CH's `corps` (a decider); `site` a WHERE kind and a subject, never an actor kind — the first seat's bracket had copied the fold's `… · menace · site` |
| SEAMS-r2-7 (ADDENDUM; OD-PS-19 STANDS) | MAJOR | CURED | §5 patrols (d), §4.4, OD-CH-38, S42 | a warden's lift on a town's riders rides inside PR's leans and inherits PR5 (a)'s bounds: never the walls term, never a hostile army's or column's presence |
| OD-PS-28 (ADDENDUM) | — | CURED (+ REFINED) | §11 (a waypoint at sea), §5 sea, CH-1 car-0, OD-CH-39, S41 | a port entered by sea and left by sea is no arrival — no town's gate, no lodging; the next sea leg opens in the same pass; modality by the landed `classifyLegModes` |
| STOP-PR-0 (round-2b body) | — | CURED | §5 patrols (d), §4.4, OD-CH-38, S42 | "riding with the watch" is a week in the town, never a mirrored leg — a patrol is a weekly-placed detachment, never a stepped unit |
| `cure/D-RN-r2b.md` §5 — `TELLING_SOURCES` | MAJOR (routed) | CURED (+ REFINED) | §9 road 1, §8, CH-7 hosts and car-0, waves table, §2.3, §21 L9, OD-CH-40, S6, S7 | CH's `leak` and `findings` rows named, their inputs (written by last tick's person stage; t+1) and their declared content fields (`what`, `paragonId`, the leak's `employerId`, `visibility: 'mechanical'`); the leak refreshes no town's belief slot; lifecycle row L9; the ≤ 3-line fallback no longer needed |
| D-CH-r2 §5.2(a) — closed in RN | MINOR | CURED | §4.1 | RN's stage rebinds `worldState`, `wizardNews`, `settlementUpdates` (executed by RN's lane); CH's requirement is met |
| D-CH-r2 §5.2(c) — closed in RN | MINOR | CURED | §2.2 `believedWhereabouts`, §7, CH-4 car-0 | the read composes RN's named `heardAt(…).heardTick` |
| `cure/D-PT-r2.md` §5 item 3 | MINOR (routed) | CURED | §16, §21 L3 | `marks.metParty` is set by CH's stage from PT's `met_in_person` deed (`RECORD_MEETING`) |
| `cure/D-PR-r2.md` — CH row | MINOR (routed) | CURED | §5 patrols (a) | `believedWatch(…) → { watch01, known }`; its "opens H16" half was already cured by the first seat |
| HOST-r2-11 (ADDENDUM, ACCEPTED) | MAJOR (ST's STOP) | NOTED | — | CH carries no conveyance or territory text; a held site's holder `kill`ed by the DM goes to ST's endings (§5 sites (e)) |
| OD-PS-29 (ADDENDUM) | — | NOTED | — | a paragon riding with an army mirrors whatever path the march chose; CH prices only its own legs |
| PS-r2-14 / OD-PS-21 (ADDENDUM) | — | NOTED | — | CH has no welcome or treaty-road card |
| PS's S-e, S-f (ADDENDUM) | — | NOTED | — | PS's own car-0 stop conditions; no CH text |
| `cure/D-RN-r2b.md` §5 — `c:` → `u:` | — | NOTED | §16b, CH-10, OD-CH-36 | already cured by the first seat; no `c:<unitKey>` survives outside brackets quoting the old text |
| `cure/D-PS-r2.md` — `patrol:` / `corps:` prefixes for PL | — | NOTED (+ REFINED) | §11 | PS's crossing prefixes are PL's row; CH's harbouring keeps `polity_ban:` and gains the corps form `polity_ban:corps:<unitKey>:<banTick>` |

REFINED in the resumed round 2b (each bracketed where it stands, vetoable): the same-pass next leg at a waypoint at sea (§11, OD-CH-39); the leak telling's empty `whereId`/`partyIds` and `mechanical` visibility (§9, OD-CH-40); the corps' harbouring episode `polity_ban:corps:<unitKey>:<banTick>` (§11).

ROUND 2b IN ALL (both seats): 36 items — 15 CURED · 0 REFUTED · 0 ⛔ STOP · 21 NOTED.
"""
t=t.rstrip('\n')+block
open(f,'w',encoding='utf-8').write(t)
print('applied',len(R),'replacements + the §25 block')
