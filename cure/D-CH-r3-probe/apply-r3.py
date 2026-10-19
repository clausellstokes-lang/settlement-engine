# D-CH-r3 — anchored, all-or-nothing edits to docs/DESIGN_FP_ARCH_CH.md (round 3a). Every anchor must occur once.
import sys
P = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_CH.md'
s = open(P, encoding='utf-8').read()
C = '[CURED 2026-10-18 (fp-final r3) — '
R = '[REFINED 2026-10-18 (fp-final r3) — '

E = []  # (old, new)

# ── status banner
E.append(("are disposed in §25's Round 2b (resumed) block. No STOP stands.",
 "are disposed in §25's Round 2b (resumed) block. No STOP stands. **ROUND 3a DISPOSED (2026-10-18 ~17:5x EDT, lane D-CH-r3):** the round-2b refuting verifier's fail and two new MAJORs (`skeptic/CH-r2-verify.md`: SEAMS-r2-11 — a court's feeling about a court is the landed pair state, never RN; CH-V3 — the DM's assignment and post hold the paragon; CH-V4 — the operative's report reaches the home court alone), its eight minor notes, the rows the other eight verifiers route here, and every A-row of `briefs/RULINGS-ROUND3.md` (A.1–A.15) are disposed in §25's Round 3 block (`cure/D-CH-r3.md`; probes `cure/D-CH-r3-probe/`). No STOP stands."))

# ── header count (pre-existing: six flags since round 2's corps flag)
E.append(("## owner's word; DARK behind five virtual flags; nothing scheduled.",
 "## owner's word; DARK behind six virtual flags (§19; the sixth, `paragonCorpsEnabled`, since round 2); nothing scheduled."))
E.append(("| S1 | all five flags dark, any seed |",
 "| S1 | all six flags dark, any seed " + R + "§19 lists six flags since round 2's `paragonCorpsEnabled`; the header and this row said five] |"))

# ── §0 actor kinds (A.7)
E.append(("which P4 re-brackets] | always | 136 | — | CONFIRMED |",
 "which P4 re-brackets] " + C + "A.7 (CH-r2-verify minor 8; FOLD-r2-verify minor): THE ACTOR CONVENTION IS FIVE KINDS, `settlement · person · party · menace · corps` — a corps decides (its weekly choice, §16b) and is keyed `u:`; a `menace` stays an actor because the DM's authored course stands in for its mind (MN12, MN6: the course chooses); a `site` has no course and no choice — a WHERE and a subject, never an actor; the fold's §1 bracket, the spine mirror and §3.3's row say so at P4 (the fold's)] | always | 136 | — | CONFIRMED |"))

# ── CH8 (CH-V3)
E.append(("The DM's `assign` is the landed `dmAssignment` transit.",
 "The DM's `assign` is the landed `dmAssignment` transit, and while that transit stands the paragon takes no aim and exerts nothing: ONE mover per record (§4.2) " + C + "CH-V3: `npcDmVerbs.js :: assignRoamer` refuses to open beside another mover because \"two lifecycle owners … whichever pulse ran last would appear to teleport the person\"; the paragon pass yields to a live `dmAssignment` the same way]."))

# ── §2.2 paragonLean (A.15)
E.append(("| `paragonLean` | `(worldState, settlementId, domain, side) → { mult, reason, wnpcIds } \\| null` |",
 "| `paragonLean` | `(worldState, settlementId, domain, seam) → { mult, reason, wnpcIds } \\| null` — ONE bounded MULTIPLIER on the consuming seam's own quantity: `seam` is a word of CH's closed `PARAGON_LEAN_SEAMS`, each with its declared deviation `d` — `menace_siege_draw` 0.05 (MN §5.2's keyed verdict draw) · `menace_raid_wear` 0.10 (MN §5.5's wear read), DRAFT, UNMEASURED; each paragon whose `exertion.outcome` there is `exerted` contributes `1 + d` (a champion) or `1 − d` (a villain), `mult` is the product, and the consumer clamps it by its own cap and applies it as `x × mult`, NEVER as an additive shift; `mult > 1` reads the champion's way on that seam (MN orients its draw so) " + C + "A.15 (MN-r2-verify minor: \"CH's `paragonLean` returns `{ mult }`, but MN and CH apply additive draw shifts\"): one form; the fourth argument named a side, which the seam word now carries] |"))

# ── §2.2 believedWhereabouts (A.12)
E.append(("the `actAt` of the newest deed about it by RN's ONE HEARD TEST",
 "the `actAt` of the newest deed WHOSE DOER is the paragon (`deedIndex(...).byDoer`; a deed done by someone else about the paragon places nobody) " + C + "A.12 (RN-r2-verify minor): RN §2.3's wording wins] by RN's ONE HEARD TEST"))

# ── §2.2 gateDefault signature (A.4 needs the graph)
E.append(("| `gateDefault` | `({ worldState, snapshot, actorRef, settlementId, tick }) →",
 "| `gateDefault` | `({ worldState, snapshot, graph, actorRef, settlementId, tick }) →"))

# ── §2.3 register: round-3 row before THE MAP REGISTER
E.append(("| THE MAP REGISTER (HOST-r1-5;",
 "| ROUND 3: `PARAGON_LEAN_SEAMS` (`menace_siege_draw · menace_raid_wear`, `paragonLean`'s seam words, A.15) · `paragon_leak` as the accusation incident's `incidentType` on the pair state (§9, A.4) · `relayedTick` (the landed continuation-guard stamp, reused in its landed meaning, §8) · the leak `eventRef` per hire `leak:<wnpcId>:<employerId>:<retainer.sinceTick>` | `PARAGON_LEAN_SEAMS`, `menace_siege_draw`, `menace_raid_wear` 0 · 0 · 0 · 0 · 0; `paragon_leak` 0 src · 0 tests · 0 master docs · 1 ledger doc (this volume); `relayedTick` LANDED (`rumorNetwork.js`, 1 src file, 4 test files); `incidentType` LANDED (24 src files — the relationship incident's field, `relationshipEvolution.js :: applyRelationshipPatch`) — `cure/D-CH-r3-probe/census-r3.out` | FREE / reused | `paragon_leak` names the leak of a covert hire on both fields (the telling's `what`, the pair's incident) — one sense, registered " + C + "A.4 · A.15 · CH-V4 · CH-r2-verify minor 1] |\n| THE MAP REGISTER (HOST-r1-5;"))

# ── §4.2 work_here (CH-V3)
E.append(("| a call in its domain stands here, or it is retained here | none (it stays);",
 "| a call in its domain stands here, or it is retained here, or — a bound paragon posted abroad — this is its post (`postId`, §8) | none (it stays);"))
E.append(("A HELD paragon (`authored.heldAt`, §12.4) takes no aim at all: it stays, and exerts nothing.]",
 "A HELD paragon (`authored.heldAt`, §12.4) takes no aim at all: it stays, and exerts nothing.]\n\n"
 "**One mover per record; the DM's post holds.** " + C + "CH-V3 (MAJOR; `skeptic/CH-r2-verify.md`: \"The DM's post does not hold the paragon\" — two movers on one record, and nothing kept a posted paragon at its post)] (1) THE DM'S ASSIGNMENT IN TRANSIT. Where the lifecycle is lit (`routeNetworkLedger.js :: routeLifecycleActive`, `routeLifecycleEnabled` false in every preset today — so this arm is latent), `npcDmVerbs.js :: assignRoamer` writes a `transit` leg and a `dmAssignment` (`{ targetSettlementId, atSettlementId, issuedTick }`) and `advanceAssignedNpcTransits` walks it after the person stage, placing the record at the target on arrival (`placeNpcRecord(state, wnpcId, target, …, { residency: null, transit: null, dmAssignment: null })`). A paragon whose record carries a LIVE `dmAssignment` TAKES NO AIM AND EXERTS NOTHING until that placement: the pass skips it before the weekly choice, opens no leg of its own, writes no `aim`, no `exertion` and no `calling` week (an open calling stay closes at the assignment's departure and mints its one deed, §2.2b), and the assignment's arrival is the DM's placement, never a town's-gate case (`assignRoamer` already reads the shut doors and asks the DM to override, `excluded_without_override`). Mid-leg the DM cannot assign it where the lifecycle is lit (`npcDmVerbAuthority.js :: assignmentOrigin` reads no origin for a record in transit, so `assignRoamer` refuses `no_route`); where it is dark the assignment places it at once (`dmAssignment: null`), its own leg discarded — the DM's word — and it chooses next week from where the DM put it. Two movers never share one record: `assignRoamer`'s own refusal is the law. (2) THE POST HOLDS. A bound paragon placed by an assignment outside its lands is POSTED (`postId`, §8), and a posted paragon HOLDS ITS POST: its own initiative reaches only `work_here` at the post (the row above admits it), `take_rest` there, and `keep_rendezvous` out to the meeting place and back; `return_home`, `answer_call`, `wander` and `visit_party` are not candidates while the post stands, so nothing walks it home between rendezvous — going home is the DM's `assign` home (which clears `postId`), and leaving otherwise is a RESIGNATION (its `seek_work` candidate and the `paragon_resigns` hearing, §7). " + R + "the post's candidate set: the ruling admits `work_here` at the post; without also striking the walking purposes a homesick operative's `return_home` could still outscore it, which S6 forbids; vetoable — the alternative keeps every purpose and lets a posted paragon drift home on its own nature] Pins: S6 (it stays between rendezvous) and S43 (an assignment in transit)."))

# ── §5 sea (A.13)
E.append(("— and sails past a port without landing there (a WAYPOINT AT SEA, §11: no town's gate, no lodging; OD-PS-28's one meaning)",
 "— and sails past a port without landing there (a coast voyage is ONE leg, port to port, §11: a harbour passed at sea is no arrival — A.13; OD-PS-28's one meaning)"))

# ── §5 patrols line: lens residue, pair key, cut01, half by leg position, PR5 (a) wording, A.1/A.3
E.append(("(PR14, PR §13: the events window H9 and the lens window H23)",
 "(PR14, PR §13: the events window H9 and the week's-presence row H23 " + C + "CH-r2-verify minor 3: the word rule — \"the lens window\" was a bare map word]"))
E.append(("over PR's ONE STRETCH KEY (`road{a, b}`, unordered, keyed by the codepoint-sorted pair `a␟b`; a power's half is the part on its own land, cut at the digest gate — PR §2.2)",
 "over PR's ONE STRETCH KEY (`road{a, b}`, unordered, keyed `stretch:<a|b>` — the digest's own `pairKey` form; a power's half is the part on its own land, split at the crossing point between the two territories, PR §2.2's `cut01`, 0.5 until the digest carries that fraction) " + C + "A.14 (FOLD-r2-verify minors; PR-V9): the minted `a␟b` was a second spelling of the landed `pairKey`, and \"cut at the digest gate\" both named the map's gate and implied a fraction the digest does not carry]"))
E.append(("the leg's `hopIndex` and `progress01` place the paragon on a half (PR §2.2's hop-to-half map)",
 "the half is chosen by the LEG's own position — `namedPersonTransit.js :: namedPersonPathPosition`'s leg-wide `progress01` against `(hopIndex + cut01) / last` (PR §2.2, as PR-V8 cured it) — and a sea hop has no half and no watch (PR §2.2: \"water carries no watch\")"))
E.append(("it lowers only what bandits, dens and roosts added to the roads — never the walls term and never a hostile army's or column's presence (PR5 (a);",
 "it lowers only what raiding menaces and untied dens added to the roads (PR5 (a)'s own words) — never the walls term and never a hostile army's or column's presence — and only inside PR's feeder of the ONE capped suppression `min(0.25, σ_site + σ_patrol)` that the SHARED presence composer applies, so the lift can never raise the cap (A.1; A.3: the composer is a shared car, its builder the first of C14 · C15 · C16 · C10 to land) " + C + "CH-r2-verify minor 4 (PR5 (a)'s wording) · A.1 · A.3] (PR5 (a);"))

# ── §6.2 wildland (A.15)
E.append(("shifts the verdict's keyed draw ±DRAFT 0.05 toward holding (a beast-caller toward the breach), inside MN's clamped draw bias (±0.20 with the DM's tilt) — a DRAW BIAS, never a re-classification of might or defence; in a RAID, `menaceCounterTerms` row (1): a warden whose exertion in the raided town is `exerted` +DRAFT 0.10 to the wear read",
 "multiplies the verdict's keyed draw by `paragonLean(…, 'menace_siege_draw').mult` — a warden's factor `1 + 0.05` toward holding, a beast-caller's `1 − 0.05` toward the breach (DRAFT) — inside MN's clamped draw bias (±0.20 with the DM's tilt): a DRAW BIAS applied as `draw × mult`, never an additive shift and never a re-classification of might or defence; in a RAID, `menaceCounterTerms` row (1): the wear read × `paragonLean(…, 'menace_raid_wear').mult` — a warden whose exertion in the raided town is `exerted` ×1.10"))
E.append(("], a beast-caller −0.10 (the list clamped to +0.15);",
 "], a beast-caller ×0.90 (MN's clamp of the list at ±0.15) " + C + "A.15: one form, `x × mult`; MN applies it at §5.2 and §5.5 (MN's lane)];"))

# ── §7 recruiter's believed whereabouts (A.12)
E.append(("(`believedWhereabouts`, §2.2: where the newest deed about it took place, by RN's heard test",
 "(`believedWhereabouts`, §2.2: where the newest heard deed WHOSE DOER is the paragon took place (A.12), by RN's heard test"))

# ── §8 findings (CH-V4)
E.append(("hop-0 origin the meeting town, and DECLARED CONTENT",
 "hop-0 origin the EMPLOYER'S SEAT (`originIds: [<employerId>]` — the liaison carries the report home), the CONTINUATION GUARD PRE-STAMPED (`relayedTick` = the seed's tick, so `rumorNetwork.js :: advanceRumorLedgers`'s relay skips it: \"`if (record.relayedTick != null) continue; // continuation guard`\") — so the report lives in the home court's ledger alone, no other court ever holds it, and `scope: 'settlement'` is honoured by construction —, DECLARED `significance: 'notable'` (its TTL 13 weeks, `RUMOR_TTL_TICKS`) and `score: 0` (read only by a `major`'s hop budget, `maxHopsFor`), and DECLARED CONTENT"))
E.append(("PLAUSIBLE until CH-7's car-0 measures the row's inputs on `worldState` at the rumour stage. [CURED 2026-10-18 (fp-final r2b) — `cure/D-RN-r2b.md` §5 (D-CH-r2 §5.2(d), CURED in RN: the second registered source exists); the round-2 sentence's \"news line in the two news-only presets\" is struck — a `mechanical` telling is never displayed]",
 "PLAUSIBLE until CH-7's car-0 measures the row's inputs on `worldState` at the rumour stage. [CURED 2026-10-18 (fp-final r2b) — `cure/D-RN-r2b.md` §5 (D-CH-r2 §5.2(d), CURED in RN: the second registered source exists); the round-2 sentence's \"news line in the two news-only presets\" is struck — a `mechanical` telling is never displayed] " + C + "CH-V4 (MAJOR; EXECUTED by the verifier, `skeptic/CH-r2-verify-probe/findingsRelay.out`: seeded at the meeting town, a hop-0 findings record reached a THIRD court at hop 1 with `partyIds: ['post']`, and `reportsBySubject` keys it to the post for any observer — so every court within two hops refreshed its belief of the post from another court's operative): the seed's origin is the employer's seat and its guard is pre-stamped; RE-EXECUTED here, `cure/D-CH-r3-probe/findingsHome.out`: stamped, only `home` ever holds the record; the round-2b shape unstamped, `home`, `meet` and `third` (two hops); a `notable` / score-0 record's hop budget is 2 and it drops 13 weeks after arrival. RN's telling arm copies a row's declared `relayedTick` onto the seed — RN's half, routed]"))

# ── §9 road 1 (leak eventRef per hire; significance/score; re-seed honesty)
E.append(("and its `eventRef` is `leak:<wnpcId>:<employerId>`. ITS DECLARED CONTENT",
 "and its `eventRef` is `leak:<wnpcId>:<employerId>:<retainer.sinceTick>` — one per HIRE " + R + "the round-2b key was per (villain, employer) pair, so a second hire of the same villain by the same court reused the first hire's record; vetoable]. ITS DECLARED SIGNIFICANCE AND SCORE: `significance: 'notable'` (its TTL 13 weeks) and `score: 0`, so the tale travels at most two hops from the worked-against town (`maxHopsFor` gives a `notable` record 2 — EXECUTED, `cure/D-CH-r3-probe/findingsHome.out`) " + C + "CH-r2-verify minor 1: \"The leak's significance and score are undeclared\"]. ITS DECLARED CONTENT"))
E.append(("writes the hearing court's `paragonBeliefs` row at `vague`; repeated arrivals raise the band one step each (`vague → uncertain`) [CURED 2026-10-18 (fp-final r1) — CH-r1-7: nothing written inside the rumour stage survives but `rumors.next`].",
 "writes the hearing court's `paragonBeliefs` row at `vague`; a later FRESH arrival raises it one step (`vague → uncertain`, the rumour road's ceiling) [CURED 2026-10-18 (fp-final r1) — CH-r1-7: nothing written inside the rumour stage survives but `rumors.next`]. A fresh arrival is rare by construction, and the volume says so: a second leak of one hire inside the TTL FOLDS into the record the court already holds (`rumorNetwork.js :: mergeArrival` keeps the first-heard `arrivalTick` — \"FIRST-HEARD wins the arrival\"; EXECUTED by the verifier, `skeptic/CH-r2-verify-probe/findingsRelay.out`: a re-seed at tick 14 merged with `arrivalTick` 10), so a court's band rises again only after its copy has expired (13 weeks after it arrived) or with a NEW hire's `eventRef` " + C + "CH-r2-verify minor 1: \"repeated arrivals raise the band\" happened at most once per TTL per court]."))

# ── §9 accused before confirmed (SEAMS-r2-11 · A.4)
E.append(("A court holding a `vague` or `uncertain` row is a court that has HEARD — its regard of the accused employer moves (RN) and its dossier says so in its voice (\"In Kell they say Merewick pays the agitator\") — but only `confident` fires the blowback.",
 "A court holding a `vague` or `uncertain` row is a court that has HEARD — the PAIR between it and the accused employer moves, and its dossier says so in its voice (\"In Kell they say Merewick pays the agitator\") — but only `confident` fires the blowback. A court's feeling about a court is the LANDED PAIR STATE, never RN (RN's refused pairs: \"A holder `s:`/`c:` never holds an entry about a subject `s:`/`c:` … that feeling is the landed pair state\"; R51 returns `null`, reason `pair_state`): each arrival that RAISES the court's band writes ONE typed incident on that pair through the one relationship writer — a STATE-ONLY patch, `relationshipEvolution.js :: applyRelationshipPatch(worldState, { relationshipKey, relationshipPatch: { trust: t − m, resentment: r + m }, metadata: { incidentType: 'paragon_leak', paragonId, employerId }, proposalPayload: null }, now, edge)`, the verdict writer's STATE idiom (PL §5.5; the landed precedent `sovereigntyTransfer.js :: accrueSaleGrievance`, which writes `resentment: clamp01(r + m)`, `trust: clamp01(t − m)` with `metadata: { incidentType: 'sovereignty_sale' }`) — `m` DRAFT 0.02, UNMEASURED; on the REAL graph edge between the two courts only (no edge ⇒ nothing is written: the grudge has nowhere to sit, the sale's own rule); at most two such incidents per court and hire (`vague`, `uncertain`), the blowback's own grievance at exposure the third and last. The writer appends the incident to the pair's `recentIncidents` (≤ 8, the landed shape). " + C + "SEAMS-r2-11 (FAIL) · RULINGS-ROUND3 A.4: \"CH §9's leak moves the pair's trust/resentment through a typed relationship patch with cause `paragon_leak` on the pulse's own channel (the verdict writer's idiom)\"; round 2b's NOTED receipt (\"CH reads RN's court regard only of persons and corps\") was false here and at §11 step 3] " + R + "the accusation's bound — one incident per band step, two per court and hire — so the accusation never ratchets the pair by repetition]"))

# ── §11 gateDefault signature
E.append(("the leaf `paragon/gateDefault.js :: gateDefault({ worldState, snapshot, actorRef, settlementId, tick })`",
 "the leaf `paragon/gateDefault.js :: gateDefault({ worldState, snapshot, graph, actorRef, settlementId, tick })` (`graph` the regional graph the person stage already receives, `regionalGraph` — the pair-label reads of step 3 need it) " + C + "A.4: the signature gains the graph; PT's `party_gate` passes the same graph (PT's half, routed)]"))
E.append(("read at a member's gate by the MEMBER's believed hold",
 "read at a member's town's gate by the MEMBER's believed hold " + C + "CH-r2-verify minor 3: the word rule — a named gate]"))
E.append(("`at_war_with_employer` (a person: its employer — as the court believes it, so a covert employer counts only once believed; the party: its backer of record, PT's `backing.by` — is at war with this court)",
 "`at_war_with_employer` (a person: its employer — as the court believes it, so a covert employer counts only once believed; the party: its backer of record, PT's `backing.by` — stands at open war with this court: a live war front between them, `roads/embassyHazard.js :: atOpenWar(graph, courtId, employerId)`)"))
E.append(("`enemy_in_service` (ONE meaning for every actor kind: the actor serves — a retainer for a person, a backing for the party — a court this court regards at `enmity` or worse) ⇒ `refused`",
 "`enemy_in_service` (ONE meaning for every actor kind: the actor serves — a retainer for a person, a backing for the party — a court whose LANDED PAIR LABEL with this court is `hostile` with no live front: `roads/embassyHazard.js :: relationshipTypeBetween(graph, worldState, courtId, employerId) === 'hostile'` — never RN, because a court's feeling about a court is the pair state) ⇒ `refused`. The two reasons together are exactly the landed `atWarWith` (\"`atOpenWar(graph, a, b) || relationshipTypeBetween(graph, worldState, a, b) === 'hostile'`\" — the ruling's \"`hostile`, or at war\"); `at_war_with_employer` is read first and the reason word names which half fired " + C + "SEAMS-r2-11 (FAIL) · A.4: \"CH §11 step 3's `enemy_in_service` reads the landed pair label (`hostile`, or at war) — never RN\"; with RN's regard of a court refused (`null`, `pair_state`), the round-2 reading never fired in the lit arm, for persons or for the party] " + R + "the split of the one landed read between the two reason words — the war front to `at_war_with_employer`, the `hostile` label to `enemy_in_service` — so the two words never name the same fact; vetoable: the alternative strikes one word, which PT's card also cites]"))

# ── §11 waypoint paragraph → A.13 (replace the whole paragraph line)
NEW_VOYAGE = ("**A harbour passed at sea is no arrival — a coast voyage is ONE leg, port to port.** " + C + "RULINGS-ROUND3 A.13 (CH-r2-verify minor 7: \"The same-pass waypoint leg departs on the arrival tick, against the landed movers' 'taking no further hop this tick'\"): \"A SEA WAYPOINT ENDS NO LEG … a coast voyage is planned port to port as ONE leg; harbours passed at sea are not leg ends … a LANDING ends the leg and the next leg opens next tick\"; round 2b's REFINED same-pass next leg is WITHDRAWN] A paragon's ordinary leg is ONE hop and lands at its far end (`npcCirculationTransit.js :: nextHopToward` takes `path[1]` of the cheapest candidate route; `advanceWanderer`: \"arriving ⇒ land at the far end and CLOSE the leg, taking no further hop this tick\"). When its next hop LEAVES ITS PORT BY SEA, CH's road leaf `paragonRoad.js` plans the VOYAGE instead: over the cheapest route `candidateRoutes(digest, fromId, destId, 1)` it reads the hops' modality by the landed `seaRoads.js :: classifyLegModes(digest, path)` (`land · sea`; the read PS2 uses) and runs forward over the consecutive SEA hops to the first node where the paragon LANDS — the aim's destination, or a port whose next hop leaves by land or by a teleport edge — and opens ONE leg through the one physics, `namedPersonTransit.js :: openNamedPersonLeg({ fromId: <embarkation port>, toId: <landing port>, departTick: tick, nominalWeeks: hopWeeks(digest, <embarkation port>, <landing port>, season) })`, priced by the one read (`pathCost` takes the cheapest sea-augmented route between the two ports, its storm season included). One leg spanning several nodes is a landed idiom (`namedPersonPathPosition` projects one leg onto a caller-owned route, which Roads and the sea roads already use), and the leg keeps the closed H3/J4 shape — no path is stored. Harbours passed at sea are NOT leg ends: nothing arrives there, so no town's gate is read, nothing lodges and no ban fires, and the landed \"taking no further hop this tick\" is untouched; mid-voyage the paragon stands at no settlement (`namedPersonLegPosition`: \"explicitly not at either settlement\"), and a sea hop has no half and no watch (PR §2.2). The LANDING ends the leg, the town's gate reads it as any arrival, and the next leg opens the next tick. A teleport arrival and every land arrival are the town's gate's as before. EXECUTED (`cure/D-CH-r3-probe/voyage.out`, an eight-port coast fixture with sea lanes, both seasons): in 72 voyages that pass a harbour at sea, the one leg is never at a settlement mid-voyage, never slower than the landed hop-by-hop walker and at least one week long, while the hop-by-hop walker, which re-plans from each port it reaches, arrives at an intermediate node in every voyage (156 intermediate arrivals) — the behaviour this rule removes. The corps arm meets a town's gate only where WC's stepper LANDS it (WC-10).")
lines = s.split('\n')
idx = [i for i, l in enumerate(lines) if l.startswith('**A waypoint at sea is no arrival.**')]
assert len(idx) == 1, idx
lines[idx[0]] = NEW_VOYAGE
s = '\n'.join(lines)

# ── §11 corps arm step 1 (PT's edge arm has landed)
E.append(("(1) the ban from truth, on the edge keyed by that ref (PT's actor-ref widening's `corps` arm; until it lands a corps carries no edge and the DM's `banish` offers persons only);",
 "(1) the ban from truth, on the edge keyed `u:<unitKey>` (PT's SHAPE 3: the actor-ref widening's key grammar `wnpc_…` · `party` · `u:<unitKey>`, \"which CH writes\" — the BENCH's emergent ban and the DM's `banish` write a company's edge as a person's) " + C + "CH-r2-verify minor 6: PT's corps edge arm has landed, so \"until it lands\" is struck];"))

# ── §11 Lifted: PT-V1's CH half + banKeys eviction
E.append(("each week, an edge whose court reads `seatChangedSince(…, episode).changed === true` is lifted and its key dropped (a key also drops when its edge lapses or is pardoned).",
 "each week, where the banning court reads `seatChangedSince(…, episode).changed === true`, the edge at that door is lifted ONLY IF IT IS STILL WINDOWED, and its key drops either way (a key also drops when its edge lapses or is pardoned): where the landed strictest-wins merge (`npcLedgerFacets.js :: normalizeExclusionEdges` keeps one edge per (settlementId, kind), and an `indefinite` edge beats any window) has folded the emergent ban into the DM's own `indefinite` one, the DM's ban stands and the seat change lifts nothing at that door — the DM's word is lifted only by `pardon` " + C + "PT-V1 (CH's half; `skeptic/PT-r2-verify.md`, EXECUTED there for the party): RE-EXECUTED for a person, `cure/D-CH-r3-probe/banLapse.out` — a windowed ban alone lifts; the emergent ban merged under the DM's `banish` lifts nothing under the guard and stays banned, while an unguarded door-scoped lift erases the DM's ban]. Past eight keys the oldest evicts first, and its edge then lapses only by its own window or a pardon, never by a seat change " + R + "the cap's rule, as PT's ruling gives its own `banKeys`]."))

# ── §11 polity-wide ban: A.8 grammar, A.5 flags
E.append(("episodeId: 'polity_ban:<wnpcId>:<banTick>' })",
 "episodeId: 'polity_ban:p:<wnpcId>:<banTick>' })"))
E.append(("A FREE corps admitted under the crown's ban (the corps arm's step 2, once PT's actor-ref widening carries the `corps` arm that step 1 needs) is harboured by the same row with the episode `polity_ban:corps:<unitKey>:<banTick>`: the same registered prefix, with the `corps:` segment keeping a company's id apart from a person's. [REFINED 2026-10-18 (fp-final r2b) — the corps arm reads `polity_ban` \"as for a person\", but the harbouring row's episode named only a `wnpc_` id; PS's `corps:` crossing prefix (a routed PL row) is a different occasion and is not this]",
 "A FREE corps admitted under the crown's ban (the corps arm's step 2) is harboured by the same row with the episode `polity_ban:u:<unitKey>:<banTick>`: PL's ONE ban grammar `polity_ban:<subjectKey>:<banTick>`, `subjectKey` RN's key — `p:<wnpcId>` for a person, `u:<unitKey>` for a company (PL §4.6, OD-PL-46; P40) " + C + "A.8 (CH-r2-verify minor 5): round 2b's REFINED form `polity_ban:corps:<unitKey>:<banTick>` and the person form `polity_ban:<wnpcId>:<banTick>` are replaced by the one grammar; PS's `corps:` crossing prefix stays a different occasion]"))
E.append(("FLAGS: the `polity_ban` reason needs PL's `polityHoldEnabled` (the hold and `crownReachAt`); the harbouring row needs PL's `polityObligationsEnabled` (the fealty record's writes, PL-4) — with it dark the admission is priced nowhere and the dossier notes the crown's word unheeded.",
 "FLAGS: the `polity_ban` reason needs PL's `polityHoldEnabled` (the hold and `crownReachAt`); the harbouring row is a REQUESTED row, written under the requester's own flag ∧ `polityEnabled` (A.5; PL §8's REQUESTED family) — here `paragonGateEnabled` ∧ `polityEnabled` — and it can fire only where the `polity_ban` reason does; `polityObligationsEnabled` no longer gates it; with the polity dark the admission is priced nowhere and the dossier notes the crown's word unheeded " + C + "PL-r1-15 (CH's tier line; `skeptic/PL-r2-verify.md`) · A.5: \"requested rows → the requester's flag ∧ `polityEnabled`\"]."))

# ── §11 belief residue; actor refs
E.append(("reads the edge as truth only at the court's own gate,",
 "reads the edge as truth only at the court's own town's gate,"))
E.append(("paragons keep the person key unchanged (`{kind:'person', id: wnpcId}` resolves to the same map entry).",
 "paragons keep the person key unchanged (`{kind:'person', id: wnpcId}` resolves to the same map entry), and a corps keys `u:<unitKey>` (PT's shape 3; CH writes a company's edges) " + C + "CH-r2-verify minor 6]."))
E.append(("its harbouring row `polityObligationsEnabled` (D-PL-r2 §5.3)",
 "its harbouring row `paragonGateEnabled` ∧ `polityEnabled` (a REQUESTED row, A.5)"))

# ── §15 #12 seasons
E.append(("`hopWeeks(…, season)`; `seasonsEnabled` (dramatic, living, full); no festival calendar",
 "`hopWeeks(…, season)` — the kernel computes the season for every travel read whatever `seasonsEnabled` says (`pulseKernel.js`: \"`const roadSeason = seasonForTick(worldState.calendar.elapsedWeeks).season;`\", \"seasonal roads gate on the digest's seasonalOverlay, not seasonsEnabled\"), so no flag gates CH's season " + C + "CH-r2-verify minor 2]; no festival calendar"))

# ── §16b: A.7, PT edge arm, A.12 lens two
E.append(("SP-4a's `POSTURE_ACTOR_KINDS` and the fold's actor-ref convention (`settlement · person · party · menace`) gain `corps` — a company decides, as a site does not: `site` is a WHERE and a subject, never an actor kind",
 "SP-4a's `POSTURE_ACTOR_KINDS` and the fold's actor-ref convention gain `corps` — FIVE kinds, `settlement · person · party · menace · corps` (A.7): a company decides, a menace's course is the DM's authored mind (MN12, MN6), and a site does not decide: `site` is a WHERE and a subject, never an actor kind"))
E.append(("the exclusion edge's actor-ref widening (PT's shape change) gains a `corps` arm;",
 "the exclusion edge's actor-ref widening carries a company's `u:<unitKey>` (PT's shape 3, landed in round 2b; CH writes the edge);"))
E.append(("so a corps holds regard of the court that hires it and is regarded by it — the relations term (§4.4) and the retainer's answer (§7) read both.",
 "so a corps holds regard of the court that hires it and is regarded by it — the relations term (§4.4) and the retainer's answer (§7) read both. Where a company HEARS a tale and reads a deed (RN's second reading for a `u:` holder) is its retaining court's seat, else, free, its unit record's own position " + C + "A.12 (RN-r2-verify minor: \"A corps holder's lens two has no fallback\"); RN's row, cited]."))

# ── §19 flags
E.append(("and its harbouring row PL's `polityObligationsEnabled` (the fealty record's writes)",
 "and its harbouring row `polityEnabled` (a REQUESTED row, written under this flag ∧ `polityEnabled` — A.5)"))

# ── §20 CH-1 car-0 and TIER
E.append(("the waypoint test — `classifyLegModes` over the arriving and the next hop, the same-pass next leg opened with `departTick` = the arrival tick (§11, OD-CH-39);",
 "the voyage test — `classifyLegModes` over the cheapest route's path, ONE leg from the embarkation port to the landing port priced by `hopWeeks(digest, embark, landing, season)`, no arrival at a harbour passed at sea, the next leg opened the tick after the landing (§11, OD-CH-39; `cure/D-CH-r3-probe/voyage.out`) " + C + "A.13];"))
E.append(("drift needs `characterDriftEnabled`; seasons `seasonsEnabled` ·",
 "drift needs `characterDriftEnabled`; the season always threaded (`roadSeason`; no flag — CH-r2-verify minor 2) ·"))

# ── §20 CH-3 leaves (A.15)
E.append(("`paragonLeans.js` (`paragonFaithCarriers`, `paragonFaithMult`, `paragonCareLean`, `paragonPactLean`, `paragonPeaceLean`);",
 "`paragonLeans.js` (`paragonFaithCarriers`, `paragonFaithMult`, `paragonCareLean`, `paragonPactLean`, `paragonPeaceLean`, and `paragonLean` over `PARAGON_LEAN_SEAMS` — A.15);"))

# ── §20 CH-5 TIER (A.5)
E.append(("the crown's ban `polityHoldEnabled`, its harbouring row `polityObligationsEnabled` [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 B]",
 "the crown's ban `polityHoldEnabled`, its harbouring row `polityEnabled` (a REQUESTED row under `paragonGateEnabled`, A.5) [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 B] " + C + "A.5]"))

# ── §20 CH-7 car-0 (CH-V4 pin)
E.append(("the two rows' declared content fields survive a save round trip inside the rumour record (L9)",
 "the two rows' declared content fields survive a save round trip inside the rumour record (L9); the findings row's pre-stamped guard keeps the report in the home court's ledger alone (a pin: no court but the employer ever holds a `rendezvous:` record — `cure/D-CH-r3-probe/findingsHome.out`, CH-V4); the leak's accusation writes at most two `paragon_leak` incidents per court and hire, on a real edge only (A.4)"))

# ── §20 CH-10 hosts
E.append(("PT's actor-ref widening (`corps` arm);",
 "PT's actor-ref widening (its `u:<unitKey>` key, landed in PT's shape 3);"))

# ── §21 L5 (+ the accusation's landed shape), L9 (findings home-only)
E.append(("death of the employer — its rows drop; veil — each row IS a court's belief, shown only in that court's voice.",
 "death of the employer — its rows drop; veil — each row IS a court's belief, shown only in that court's voice. The ACCUSATION a row's band step writes (§9, A.4) lives in the LANDED pair state — `relationshipStates[key]`'s trust, resentment and `recentIncidents` (≤ 8, typed `paragon_leak`) through the one relationship writer — so every lifecycle path is that state's own (persist with the world; undo the pulse snapshot; regenerate keyed by stable settlement ids; dark-after-lit kept, no new incident) and CH declares no new shape for it " + C + "A.4]."))
E.append(("and `reportsBySubject` through the findings' `whereId`/`partyIds` (the home court's belief of the post);",
 "and `reportsBySubject` through the findings' `whereId`/`partyIds` (the home court's belief of the post) — the findings record held by the home court alone (origin the employer's seat, the continuation guard pre-stamped, §8; CH-V4);"))

# ── §22 scenario rows
E.append(("its findings enter Merewick's beliefs only by the one telling seeded at the meeting town (RN's `TELLING_SOURCES` `findings` row, `eventRef` `rendezvous:<wnpc>:<aim.sinceTick>`, `visibility: 'mechanical'` — on no rumour panel);",
 "its findings enter Merewick's beliefs only by the one telling seeded AT MEREWICK'S SEAT with the continuation guard pre-stamped (RN's `TELLING_SOURCES` `findings` row, `eventRef` `rendezvous:<wnpc>:<aim.sinceTick>`, `visibility: 'mechanical'` — on no rumour panel), and no other court's ledger ever holds it (CH-V4); between rendezvous it STAYS at Ashford (`work_here`, posted here) and is never walked home by `return_home` (CH-V3);"))
E.append(("per-court knowledge is each court's `paragonBeliefs` row and RN regard;",
 "per-court knowledge is each court's `paragonBeliefs` row, and per-court feeling the pair state (one `paragon_leak` incident at each band step, then the blowback's grievance) — never an RN regard of a court (A.4); Kell's second step comes only at a fresh arrival, after its first copy has expired (13 weeks);"))
E.append(("with `polityObligationsEnabled` the admission REQUESTS one row through `requestFealtyRow` (episode `polity_ban:<wnpc>:<tick>`)",
 "with the polity lit (`polityEnabled`; the REQUESTED row under `paragonGateEnabled`, A.5) the admission REQUESTS one row through `requestFealtyRow` (episode `polity_ban:p:<wnpc>:<tick>`, A.8)"))
E.append(("never CH's gate (SEAMS-r2-6)",
 "never CH's town's gate (SEAMS-r2-6; the word rule, CH-r2-verify minor 3)"))
S41 = ("| S41 | a canon with three ports on one coast joined by sea lanes; a free saint sails from the first to the third; the second port's court bans her | ONE leg from the first port to the third (the cheapest route's consecutive sea hops end where she lands — `classifyLegModes`), its `arrivalTick` priced by `hopWeeks(digest, first, third, season)`; the second port is passed at sea — no arrival, no town's-gate card, no residency, and its ban never fires; at the third, where she lands, the town's gate reads her arrival and her next leg opens the next tick (A.13, OD-PS-28; `cure/D-CH-r3-probe/voyage.out`) |")
lines = s.split('\n')
idx = [i for i, l in enumerate(lines) if l.startswith('| S41 |')]
assert len(idx) == 1
lines[idx[0]] = S41
idx = [i for i, l in enumerate(lines) if l.startswith('| S42 |')]
assert len(idx) == 1
lines.insert(idx[0] + 1, "| S43 | the DM assigns Sister Aude, free and resting at Kell, to Tolle where `routeLifecycleEnabled` is lit; the same act with it dark | lit: while her record carries `dmAssignment` the pass writes no `aim`, no `exertion` and no `calling` week and opens no leg of its own; her arrival at Tolle is no town's-gate card; `advanceAssignedNpcTransits` places her at Tolle and she chooses from Tolle the next week; dark: `assignRoamer` places her at once (no `dmAssignment`) and she chooses from Tolle; in neither arm do two movers write her record in one tick (CH-V3) |")
lines.insert(idx[0] + 2, "| S44 | belief preset, the web dark: Kell has heard Merewick pays the agitator (a leak arrival, `vague`), and Kell and Merewick share a graph edge; Ashford hears the same tale and shares no edge with Merewick | Kell's pair with Merewick takes ONE `paragon_leak` incident (trust down, resentment up by `m`) through `applyRelationshipPatch`, state-only, `proposalPayload: null`; a later fresh arrival raising Kell to `uncertain` writes the second and last; Ashford's dossier carries the accusation and no pair is written; no RN entry about a court is read or written (RN R51); at Kell's town's gate a paragon in Merewick's service is refused `enemy_in_service` only where the pair's label is `hostile`, `at_war_with_employer` where a war front stands (SEAMS-r2-11 · A.4) |")
s = '\n'.join(lines)

# ── §23 rulings
E.append(("flags `polityHoldEnabled` (the reason) and `polityObligationsEnabled` (the row)",
 "flags `polityHoldEnabled` (the reason) and, for the REQUESTED row, the requester's own `paragonGateEnabled` ∧ `polityEnabled` (A.5); the episode in PL's one grammar `polity_ban:<subjectKey>:<banTick>` (A.8) " + C + "A.5 · A.8]"))
E.append(("round 2b: `paragon_leak`, `paragon_findings`, `paragonId`, `rendezvous:` (and `employerId` reused in its CH meaning as a rumour content field) |",
 "round 2b: `paragon_leak`, `paragon_findings`, `paragonId`, `rendezvous:` (and `employerId` reused in its CH meaning as a rumour content field); round 3: `PARAGON_LEAN_SEAMS` (`menace_siege_draw · menace_raid_wear`), `paragon_leak` also as the accusation incident's `incidentType` (one sense), the leak `eventRef` per hire (`…:<retainer.sinceTick>`), `relayedTick` reused in its landed meaning |"))
E.append(("the catch is the target's town's gate on re-entry and the patrols (when lit); the findings travel by one telling through RN's arm, never a belief write |",
 "the catch is the target's town's gate on re-entry and the patrols (when lit); the findings travel by one telling through RN's arm, never a belief write — seeded at the employer's seat with the continuation guard pre-stamped, so they reach the home court alone (CH-V4); a posted paragon HOLDS its post (`work_here` admits it; `return_home` and the walking purposes are no candidates while posted; going home is the DM's `assign` home or a resignation), and no paragon takes an aim while a DM assignment is in transit on its record (CH-V3) " + C + "CH-V3 · CH-V4] |"))
lines = s.split('\n')
idx = [i for i, l in enumerate(lines) if l.startswith('| OD-CH-39 |')]
assert len(idx) == 1
lines[idx[0]] = ("| OD-CH-39 | A coast voyage (`RULINGS-ROUND3.md` A.13; OD-PS-28) | a coast voyage is ONE leg, port to port: CH's road leaf runs the cheapest route over its consecutive sea hops (`classifyLegModes`) to the first node where the paragon LANDS and opens one leg priced by `hopWeeks(digest, embark, landing, season)`; a harbour passed at sea is no leg end — no arrival, no town's gate, no lodging; the landing ends the leg and the next leg opens the next tick; a teleport or land arrival is the town's gate's as any arrival (§11) " + C + "A.13: round 2b's REFINED same-pass next leg is withdrawn] |")
idx = [i for i, l in enumerate(lines) if l.startswith('| OD-CH-40 |')]
assert len(idx) == 1
lines[idx[0]] = ("| OD-CH-40 | The two registered tellings (persisted shape: rumour content fields; `cure/D-RN-r2b.md` §5) | CH's `leak` and `findings` rows of RN's `TELLING_SOURCES`, each a pure function of `(worldState, tick)` over what the person stage wrote last tick; declared content `what` (`paragon_leak` · `paragon_findings`), `paragonId`, the leak's `employerId`, `visibility: 'mechanical'`; both declare `significance: 'notable'` and `score: 0`; the leak's `whereId`/`partyIds` empty (REFINED, vetoable), its origin the worked-against town, its `eventRef` per hire `leak:<wnpcId>:<employerId>:<retainer.sinceTick>` (REFINED r3, vetoable); the findings' `whereId`/`partyIds` the post, its origin the EMPLOYER'S SEAT and its continuation guard PRE-STAMPED (`relayedTick`), so the report reaches the home court alone (CH-V4) — RN's arm copies the declared stamp; `eventRef`s `leak:…` and `rendezvous:<wnpcId>:<aim.sinceTick>`; lifecycle L9; never deeds, never renown facts (RN OD-RN-38) " + C + "CH-V4 · CH-r2-verify minor 1] |")
s = '\n'.join(lines)

# ── apply the anchored replacements (all or nothing), spliced by position on ONE snapshot (no anchor can match new text)
spans = []
for old, new in E:
    n = s.count(old)
    if n != 1:
        print('ANCHOR COUNT', n, '::', old[:120]); sys.exit(1)
    i = s.index(old)
    spans.append((i, i + len(old), new))
spans.sort()
for a, b in zip(spans, spans[1:]):
    if a[1] > b[0]:
        print('OVERLAP at', a[0], b[0]); sys.exit(1)
out, pos = [], 0
for i, j, new in spans:
    out.append(s[pos:i]); out.append(new); pos = j
out.append(s[pos:])
s = ''.join(out)
open(P, 'w', encoding='utf-8').write(s)
print('applied', len(E), 'anchored replacements + 5 line edits')
