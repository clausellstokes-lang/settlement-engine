#!/usr/bin/env python3
# BRACKETS-B-champions — CH insertions only. Each entry: (anchor prefix, lines to insert AFTER the unique line that starts with it).
import sys
PATH = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_CH.md'
T = 'ADDED 2026-10-20 (fp-final P6c; '

E = []
def add(anchor, *lines):
    E.append((anchor, list(lines)))

# 1 CH22 — the never-read list scoped; (3a) the one door; H.1
add('**CH22 — A SWORN GOD LEANS THE CHOICE',
 r'''[''' + T + r'''RULINGS-P6 §H.3 · CH-PD-V2 · §H.1) — THE NEVER-READ LIST IS CH'S OWN: "carried and NEVER read" and "never a deity embed beyond the DM's door's own copy" are scoped to CH's OWN reads and writes (the roll, the gate, the page, the door, the normalizer). ONE place takes the oath into WORLD state: §6.2's faith carrier (3a), where `attemptEntry` seeds a town's religion state (`religionState.js`: "`const seed = (existingShare = 0) => ({ deityRef: ref, snapshot: deity, …`") whose snapshot the contest then reads (`religiousContest.js :: deityRankStrength`: "`[deity.rankAxis]`"; `faithField.js`: "`if (str(snapshot.boonChannel) === channel)`"). So (3a) hands `attemptEntry` the WORLD's OWN snapshot of that `_deityRef` wherever any religion state already holds one, and the oath's copy ONLY where none does — the one door by which an oath enters world state, named here once; an oath copy older than the DM's last edit never becomes a second snapshot of a god some town already holds. And (3a)'s saint-oath arm is DARK until the god holds a seat somewhere or the faith layer is active (`religionActive`): a saint's oath to a god seated nowhere is admitted as custom content WITHOUT a contest (§10b's H.1 bracket).]''')

# 2 P1 creedRef row — D-CH-PD-r1 route 5
add('| `creedRef` | a deity ref the campaign knows',
 r'''| ↳ `creedRef` [''' + T + r'''D-CH-PD-r1 route 5 · CH-PD-r1-9)] | for a faith CHAMPION, DERIVED from `swornDeity` — written at the door (`creedRef := deityIdOf(swornDeity)`), re-derived by the normalizer (§10b); a heretic's `creedRef` stays authored, never derived | the saint's god IS its creed — one choice at the door, never a second truth (`sworn_creed_conflict` refuses a saint with no oath or a mismatch) | §10b, §6.2 (3a) |''')

# 3 P1 swornDeity row — V2 scope
add('| `swornDeity` | a COMMITTED DEITY EMBED',
 r'''| ↳ `swornDeity` [''' + T + r'''RULINGS-P6 §H.3 · CH-PD-V2)] | "the rest are carried, never read" — scoped to CH's OWN reads | the ONE door by which the oath enters world state is §6.2 (3a): `attemptEntry` takes the world's own snapshot of the `_deityRef` where any religion state holds one, the oath's copy only where none does (CH22's bracket) — the seeded state's `rankAxis`, `boonChannel` and kin are then the CONTEST's reads of a town's religion state, never CH's of the paragon | §6.2 faith (3a), CH22 |''')

# 4 P2 aim — OD-OP-24
add('  aim?: { purpose, destId, sinceTick, reasons:',
 r'''  //   [''' + T + r'''RULINGS-P6 §B.1 · §C · OP-r1-15 · OD-OP-24 ⭐)] aim.roadOpportunity?: { kind, atId, tick, verdict? } — THE OPPORTUNITY's aside mark on a paragon's aim (OP §2.1, §9; its ten paths OP §13 L4; at most one per aim, OP4; `detourFrom` always absent — CH is a paragon's mover): written ONLY by CH's weekly writer at OP's request, kept by `normalizeParagon` from the SAME commit that first writes it (garbage drops the key, never the aim), gone with its aim; the OWNER's persisted shape (OD-OP-24 ⭐ VISIBLE, §23)''')

# 5 P2 exertion — G.1 carrier (OP's proposal)
add('  exertion?: { tick, outcome, settlementId },',
 r'''  //   [''' + T + r'''RULINGS-P6 §G.1 · OP-V5)] an exertion that answers a `captive_held` call carries that call's `source.kind` (OP §9's proposal, PLAUSIBLE; the key's name fixed by CH-1's car-0 token census, ROUTED to the fold §5) so the calling stay (§2.2b), `paragonLean` / `paragonRows` (§6) and `patrol_will` SKIP it — the exert at the venue is THE RESCUE CARD ONLY (§4.5's bracket)''')

# 6 §2.2 paragonLean row — G.1
add('| `paragonLean` | `(worldState, settlementId, domain, seam)',
 r'''| ↳ `paragonLean` [''' + T + r'''RULINGS-P6 §G.1 · OP-V5)] | — | an exertion that answered a `captive_held` source contributes NOTHING at any seam — no magistrate's ×0.8 row, no agitator's ×1.3, no `patrol_will` (PR's WILL gate reads no lean from it): the exert at the jailer's town is THE RESCUE CARD ONLY (OP §9 "THE EXERT IS THE CARD ONLY"; §4.5's bracket) |''')

# 7 §2.2b paragraph — G.1 stay carve-out + G.6
add("RN owns the deed ledger (`spatialLedgers.deeds`",
 r'''[''' + T + r'''RULINGS-P6 §G.1 · OP-V5) — THE CALLING STAY'S CARVE-OUT: an exert that answers a `captive_held` source (the HELP call at the venue, or the villain's `harm` twin there, §14) neither OPENS nor ADVANCES `calling`, so no `paragon_exerted` is ever minted for it at the jailer's town; its ONE deed is OP's `opportunity_act` (`captive_rescued` on `freed`, `rescue_foiled` on `caught`; nothing on `turned_back` or `refused`), its `target` the JAILER `jailerOf(hold)` — the occupier in an occupied town (RULINGS-P6 §D.2), never the occupied court (OP §5.3, §9)] [''' + T + r'''RULINGS-P6 §G.6 · §B.1 · the D-OP-r3 route · OP-r1-17) — NO HEROIC-FACED ACT IS A FALSE REPORT: any paragon — champion or villain, of any calling — may take OP's `false_word` (OP §7.1) through the one roll (the owner's 08:41 word: "Envoys, champions, spies, etc could also provide false information"); it is registered here as a `paragon_act` on the DECEIVER's (villain-side) face (the `false_word` row of the table below), shameful — a champion that lies does a villain's deed, the DM's to mark (§13's turning point); of any sworn paragon the lean says "less readily", never "never" (§10b)]''')

# 8 §2.2b table — the false_word row
add('| `hunt_won` — a conclave (only one its court holds',
 r'''| `false_word` — a false word spoken (OP §7.1; any paragon, either living side; the doer the paragon) [''' + T + r'''RULINGS-P6 §G.6 · OP-r1-17)] [REFINED 2026-10-20 (fp-final P6c) — the coordinates are the `information` villain row's ("false reports"), the face OP §9 names; DRAFT, UNMEASURED; vetoable] | the DECEIVER's face (villain side, whatever the speaker's polarity) | 0.30 | 0.25 | 0.50 | no (false reports) | shameful |''')

# 9 §2.4 npcLedgerProjection — D-CH-PD-r1 route 6
add('| `npcLedgerProjection.js` (audience projection',
 r'''| ↳ `npcLedgerProjection.js` [''' + T + r'''D-CH-PD-r1 route 6 · CH-PD-r1-14)] | — | the non-DM allow-list gains the PUBLIC OATH ("sworn to <god>") beside the display noun — never under `secretKind: secret_faith` (then DM-only, §10b; L1c veil) | inside the row above's ≤ 119 (a one-entry widening, no new line) |''')

# 10 §3 CH-0b — D-CH-PD-r1 route 7
add("**CH-0b — THE LIBRARY BUCKET (the OWNER'S HAND).**",
 r'''[''' + T + r'''D-CH-PD-r1 route 7 · CH-PD-r1-21) — A LIBRARY PARAGON'S OATH: a library entry's `swornDeity` is a CROSS-BUCKET DEITY REFERENCE the `paragons` manifest row must carry (the deity bucket's ref, `mintDeityRef`), copied by `commitDeityEmbed` into `paragon.authored` at introduction (§10b; L1c create) — the OWNER's hand with CH-0b (OD-CH-2)]''')

# 11 §4.2 work_here
add('| `work_here` | where it stands | a call in its domain stands here',
 r'''| ↳ `work_here` [''' + T + r'''the D-OP-r3 route · OP-Vm1 · RULINGS-P6 §G.1)] | for a `captive_held` source the call STANDS AT its `source.venueId` — the exert gate's "here" (§4.5) | the paragon has arrived at the venue | none (it stays); its exert there is THE RESCUE CARD ONLY (OP §9; §4.5's bracket) |''')

# 12 §4.2 answer_call — E.5 (D-OP-r3 replaces r2) + OP-r1-14
add('| `answer_call` | a place whose call in its domain',
 r'''| ↳ `answer_call` [''' + T + r'''RULINGS-P6 §E.5 · the D-OP-r3 route, which REPLACES r2's · OP-V2 · OP-V3 · OP-r1-14)] | for a `captive_held` source the destination is `source.venueId` (the `hunt_body` precedent), never the call's settlement | a BOUND paragon answers it only when the call's settlement (the captive's HOME) is its employer or its employer's ally (`ALLY_LIKE`) and the jailer (OP `jailerOf`) sits at a T4 rung toward its employer — never where the jailer is its employer or sits at no T4 rung toward it (the friend rule, OP10: a jailer allied to the employer forbids it; an `allied_hall`'s jailer is the hall's lord, RULINGS-P6 §E.7 Q2); a FREE paragon answers by its own roll | a bound paragon on its own leg inside its employer's lands, beyond them only by its employer's `court_errand` (never offered until the owner's errand-row slot lands); a free paragon by its own leg — and a FREE paragon's rescue writes REGARD ONLY, no court-level favor (OP §6, §9) |''')

# 13 §4.5 — G.1 card only + the minor (wholly neutral)
add('**4.5 The exert decision and the moods.**',
 r'''[''' + T + r'''RULINGS-P6 §G.1 · OP-V5 · OP-Vm1 · the D-FOUR-r4 route) — THE RESCUE EXERT IS THE CARD ONLY: for a `captive_held` source "where its domain calls" is the source's `venueId`; arrived there, the exert's ONLY effect is the offer of OP's `rescue_attempt` card and that card's verdict (OP §5.2–§5.3): (i) NO CALLING STAY — §2.2b's `calling` is neither opened nor advanced, so no `paragon_exerted` is minted at the jailer's town; (ii) NO SEAM LEAN — `paragonLean` and §6.1's `paragonRows` find no row from it (no magistrate's ×0.8, no agitator's ×1.3) and PR's WILL gate no `patrol_will`; (iii) ONE DEED — OP's `opportunity_act`, targeted at `jailerOf` (the occupier in an occupied town). HOW: the persisted `exertion` carries its call's `source.kind`, and the stay's opener, `paragonLean`, `paragonRows` and `patrol_will` skip `captive_held` (OP §9's proposal, PLAUSIBLE; P2's comment); p(exert) for it reads the face §10b's bracket names (`captive_rescued`), so the sworn lean weighs the rescue itself] [''' + T + r'''`skeptic/CH-PD-r1-verify.md`'s minor on CH-PD-r1-2) — the `shame` cause is also reached for the fallen saint under a WHOLLY NEUTRAL god (neutral in alignment, law and temper), as §10b and the executed table say (`lean2.out.txt` T5: "faith/villain (FALLEN: against its own god): good/lawful good/neutral good/chaotic neutral/lawful neutral/neutral")]''')

# 14 §4.8 — WS purse_empty / coffers_bare
add('**4.8 The receipt and the felt sentence.**',
 r'''[''' + T + r'''the D-WS-r1 route · WS-r1-15) — `purse_empty` stays CH's reason word for a PARAGON's own purse; THE WAY OF WAR's court-grain deviation cause is `coffers_bare` (`DESIGN_FP_ARCH_WS.md` §2.5, `WAY_DEVIATION_CAUSES`: "`purse_empty` NOT used (CH §4.8's reason word for a paragon's purse)") — two words, two subjects, never merged (the fold's §5, P7)]''')

# 15 §5 — MG movement verbs + riding (a new bullet after "Bodies considered")
add('- **Bodies considered**',
 r'''- **Movement considered** [''' + T + r'''RULINGS-P6 §A.3 · §A.6 · the D-MG-r1 route · OP-r1-18)]: THE MOVEMENT GRAMMAR (`DESIGN_FP_ARCH_MG.md`) NAMES a paragon's movement verb from CH's weekly choice (`personVerbOf` — `keep_course` · `reroute` · `hold`, MG §4.2 N-6) for the map's verb word and the Why panel only; MG ROLLS NOTHING for a paragon and CH's roll is unchanged; a paragon on its own aim is CH's mover, and an errand row only on `court_errand` once the owner's errand-row slot lands (OP's `detourEnvoyErrand` then its one in-flight re-plan, A.3); the paragon RIDES as CH's aim decides (MG's `RIDING_MISSIONS`: "a paragon by CH's aim"), MG's derived `ridingOf` applying to it as to any person, its gain and access WY's to rule (A.6).''')

# 16 §6.1 — G.1 no row
add('**6.1 The birth side — one row per domain',
 r'''[''' + T + r'''RULINGS-P6 §G.1 · OP-V5) — `paragonRows` returns NO row for an exertion that answered a `captive_held` source (§4.5's bracket): breaking a jailer's cells neither calms that town's streets (the magistrate's ×0.8 "hears the people's grievances in <town>") nor stirs them (the agitator's ×1.3); the act's one consequence is OP's card and its deed]''')

# 17 §6.2 faith row — H.1 + V2 + route 8
add('| faith | `religiousContest.js :: advanceReligionStates` at BOTH',
 r'''| ↳ faith (3a) [''' + T + r'''RULINGS-P6 §H.1 · §H.3 · CH-PD-r1-9 (FAIL) · CH-PD-V2 · D-CH-PD-r1 route 8)] | the same site | "so a creed seated nowhere enters with its saint" (the bracket above) is WITHDRAWN (H.1): the contest returns early where the faith layer is not active (`religiousContest.js :: advanceReligionStates`: "`if (!isSubsystemActive(snapshot, 'religion')) return …`"), so a saint's oath to a god seated nowhere is admitted as CUSTOM CONTENT WITHOUT A CONTEST (a saint seats no god); and (3a) hands `attemptEntry` the WORLD's own snapshot of the god's `_deityRef` wherever any religion state holds one, the oath's copy only where none does — the one place the oath enters world state (CH22's bracket; V2) | (3a)'s saint-oath arm lands WITH CH-11 (before it, (3a) carries only a seated creed) and is DARK until the god holds a seat somewhere or the faith layer is active (`religionActive` — `pulseKernel.js`: "`const religionActive = isSubsystemActive(snapshot, 'religion');`") | the saint tilts no contest where the faith layer is dark; its oath still leans its own roll (§10b) |''')

# 18 §10b — the field: H.1 withdrawn + V2
add('**The field (OD-CH-51, the OWNER\'s persisted shape).**',
 r'''[''' + T + r'''RULINGS-P6 §H.1 · CH-PD-r1-9 (FAIL)) — WITHDRAWN: "so a creed seated nowhere in the world can enter with the saint who carries it" — where no town seats any god the faith contest never runs (`religiousContest.js :: advanceReligionStates`: "`if (!isSubsystemActive(snapshot, 'religion')) return …`"; `religionActive` reads only the config's seated snapshots, `config?.primaryDeitySnapshot` / `cultDeitySnapshots` — the verifier's receipt), and the deity doctrine makes entry share-driven and the patron seat sticky. RULED: a saint's oath to a god seated nowhere is ADMITTED AS CUSTOM CONTENT WITHOUT A CONTEST — the field stands (the oath is REQUIRED for a saint), the (3a) contest arm is DARK until the god holds a seat somewhere or the faith layer is active (`religionActive`); a saint seats no god. Vetoable] [''' + T + r'''RULINGS-P6 §H.3 · CH-PD-V2) — "§6.2's faith carrier (3a) hands `attemptEntry` the oath's embed" reads: (3a) hands `attemptEntry` the WORLD's own snapshot of that `_deityRef` wherever any religion state already holds one, and the oath's copy ONLY where none does — the one place the oath enters world state (`attemptEntry`'s seed makes the snapshot a town's religion-state snapshot, read by `deityRankStrength` and `faithField`), so a copy older than the DM's last edit never becomes a second snapshot of one god (CH22's bracket)]''')

# 19 §10b — THE ACT'S FACE: G.1 + G.6
add("- THE ACT'S FACE: CH's OWN registered row",
 r'''[''' + T + r'''RULINGS-P6 §G.1 · §G.6 · OP §9's REFINED (r4) · the D-FOUR-r4 route) — two faces carved out: (1) the exert that answers a `captive_held` source reads the `captive_rescued` row RN registers from OP's proposal (OP §2.4), NEVER `paragon_exerted` — so the sworn lean weighs the rescue itself (a GOOD god's sworn frees a prisoner more readily; no recorded axis is "merciful", CH-PD-r1-17); (2) a paragon's `false_word` (OP §7.1) reads its OWN row on the DECEIVER's face (§2.2b), whatever its living side — a champion that lies does a villain's deed]''')

# 20 §10b — act MONOTONE restated per half (V1)
add('- `act = align × bold` — MONOTONE in each recorded coordinate',
 r'''[''' + T + r'''RULINGS-P6 §H.3 · CH-PD-V1 (MAJOR)) — "MONOTONE in each recorded coordinate" is OVER-STATED and is RESTATED PER HALF: `align` is monotone in malice and in law, `bold` (and so `act`) in an AUTHORED temper; on the DERIVED arm `deriveTemper` ties the temper to the alignment, so one malice step moves both halves and `act` can move AGAINST the face's kind coordinate — EXECUTED, 18 such rows (`skeptic/CH-PD-r1-verify-probe/s68i.out.txt`, re-run byte-identical at `cure/BRACKETS-B-champions-probe/s68i.rerun.out.txt`). Said plainly (an owner-visible consequence, OD-CH-52's ↳ row): under a derived temper a GOOD god's war champion leans BELOW an unsworn one (`act` 0.9722 against 1 — its alignment half 1.0233 warm, its boldness half 0.95) and below an evil god's (1.0535 under evil/lawful); S68 (i) is restated to the rows the table supports (S68's ↳ row)]''')

# 21 §10b — flock: H.2 placed in RN
add('**The flock — RN\'s lane, routed (CH writes no regard).**',
 r'''[''' + T + r'''RULINGS-P6 §H.2 · CH-PD-r1-10 (FAIL)) — RN's sworn-doer route is PLACED by this lane in RN §6.2: the earlier P6c bracket there (the live `swornDeityOf(paragon)` read inside lens one) is SUPERSEDED by a dated bracket beside it — lens one reads the god's coordinates from the TELLING's carried oath, never a live read, and the temple officer's reading is REGISTERED as the one override of "a person its own"; the god-to-coordinate mapping is this volume's (THE GOD'S THREE COORDINATES above, per half). RN's lens-one core and lens-two mix EXPORTS remain RN's to name (D-CH-PD-r1 route 1; PLAUSIBLE until RN-3's car-0)]''')

# 22 §10b — what it never does (V2 scope)
add('**What it never does.**',
 r'''[''' + T + r'''RULINGS-P6 §H.3 · CH-PD-V2) — "read by nothing" and "never a deity embed beyond the DM's door's own copy" are CH's OWN reads and writes; the ONE door by which an oath enters WORLD state is (3a)'s `attemptEntry` seed (the contest's own writer seeds the religion state; CH writes none), taking the world's own snapshot of the ref wherever one exists and the oath's copy only where none does; the seeded state's `boonChannel` and `rankAxis` are then the contest's reads of a town's religion state (CH22's bracket)]''')

# 23 §10b — couplings: G.6
add("**Couplings — one direction, through CH's one roll",
 r'''[''' + T + r'''RULINGS-P6 §G.6 · §B.1 · the D-OP-r3 route (R-PD-8)) — "no champion act is a false report" READS "no HEROIC-FACED act is a false report": any paragon may take OP's `false_word` through the one roll (RULINGS-P6 §B.1; the owner's 08:41 "Envoys, champions, spies, etc could also provide false information"), registered on the deceiver's (villain-side) face (§2.2b's `false_word` row), shameful — a champion that lies does a villain's deed, the DM's to mark; of any sworn, the lean says "less readily", never "never". The call-board half is placed at §14's `captive_held` row, §4.2's two ↳ rows and §4.5's bracket]''')

# 24 §10b — Tier: H.1 same words
add("**Tier.** The roll's lean with `paragonsEnabled`",
 r'''[''' + T + r'''RULINGS-P6 §H.1) — THE TIER LINE AND §10b SAY THE SAME WORDS: "reads the field absent" holds for the faith CONTEST only — a deity-free world, and every born world until the DM seats a god, runs no contest, so (3a) is dark there — while the field stands on the record (the saint's oath REQUIRED) and leans the paragon's own roll; a saint's oath to a god seated nowhere is admitted as custom content WITHOUT a contest, (3a) dark until the god holds a seat somewhere or `religionActive` [REFINED 2026-10-20 (fp-final P6c) — H.1's "the field stands" read as: the roll's lean and the page read it; vetoable — the alternative keeps the lean dark too until the god is seated]]''')

# 25 §14 table — the captive_held row
add('| order | `rebellion`, `insurgency`, `political_fracture`; legitimacy',
 r'''| order — `captive_held` [''' + T + r'''RULINGS-P6 §B.1 · §D.1 · §E.6 · OP-r1-13 · OP-r1-1 · OP-V4 · the D-OP-r2 and D-OP-r3 routes; ⛔ S-5 RESOLVED)] | THE OPPORTUNITY's source row (OP §9): `{ settlementId: <the captive's HOME>, domain: 'order', side: 'help', band, source: { kind: 'captive_held', venueId, captorId, toldBy: { road: 'roads_ransom' \| 'ransom_demand' \| 'telling', ref, tick } } }`, MINTED ONLY FROM THE ARRIVED RECORD that carried the hold home — a roads ransom its court pays (`toldBy.tick` = `RansomRec.startedTick`), WR-7d's persisted ransom DEMAND arrived (its `demandLeg`), or a capture TELLING arrived by RN's `heardAt` (once RN's P7 row accepts one) — its `venueId` and `captorId` COPIED FROM THAT RECORD, never from `foreignGuestHoldsOf` (the truth hold), in EVERY info mode (the omniscient arm knows a row that exists, never mints one); CH's row cites the arrival record as its source; its `harm` twin at the VENUE town, MINTED FROM THE JAILER's own hold record (a court knows its own cells — road (a) below is lawful for the holder; `jailerOf`, the occupier in an occupied town), KNOWN by presence in the belief presets and on the omniscient presets' board as the truth BY THE PRESET'S LAW (stated, not a leak); both banded in the SEVERITY words by the captive's standing; BOTH EXCLUDED FROM PT's read (no `party_request` source) |''')

# 26 §14 BELIEF — PT exclusion
add('BELIEF [CURED 2026-10-18 (fp-final r1) — CH-r1-11:',
 r'''[''' + T + r'''RULINGS-P6 §B.1 · OP-r1-13 · the D-OP-r2 route) — "The PARTY volume reads the same board": PT's `party_request` NEVER reads a `captive_held` call, help or harm — the help call's settlement is the captive's home, so no jailer can ask through it to have his own cells broken, and the harm twin is a villain's chance, never a request (OP §9; PT's own line routed to P7)]''')

# 27 §7 — WS C9 the retainer offer to a corps
add('**Kept distinct from the force market — which now closes into THE CORPS.**',
 r'''[''' + T + r'''THE WAY OF WAR's ask of CH — `DESIGN_FP_ARCH_WS.md` §4.2 C9 ("CH §7's retainer OFFER to a corps (never the market) | CH's paragon stage | PRIOR") and §13 ("the retainer offer | CH §7 | one lean under `way_coalition`/`way_raiding`/`way_attrition`; the corps unchanged"); the D-WS-r1 couplings (WS-r1-1 · WS-r1-12)) — a court's retainer OFFER to a corps takes ONE bounded PRIOR lean of that court's way of war — `wayLeanOf` at WS's ONE bound (`WS_LEAN_W`, a factor in [0.88, 1.12], ×1 exactly when dark) under `way_coalition`, `way_raiding` (plunder) and `way_attrition`, entering the offering court's own offer score in CH's paragon stage at WS-3 (C9, at this volume's CH-4 unit); the CORPS itself is unchanged — born only by the DM (§16b)]''')

# 28 CH-3 wave — route 8 + H.1/H.3
add('**CH-3 — THE GIFTS.** Leaves:',
 r'''[''' + T + r'''D-CH-PD-r1 route 8 · RULINGS-P6 §H.1 · §H.3) — (3a)'s saint-oath arm lands WITH CH-11; before it (3a) carries only a seated creed; once CH-11 lands, the arm stays DARK until the saint's god holds a seat somewhere or the faith layer is active (`religionActive`), and it hands `attemptEntry` the world's own snapshot of the ref where one exists, the oath's copy only where none does (§6.2's ↳ faith row)]''')

# 29 CH-11 wave — H.1 + V1 + V2
add('**CH-11 — THE PATRON DEITY.**',
 r'''[''' + T + r'''RULINGS-P6 §H.1 · §H.3 · CH-PD-V1 · CH-PD-V2) — the faith carrier (3a)'s arm in this wave is DARK until the saint's god holds a seat somewhere or `religionActive` (H.1 — a saint's oath to a god seated nowhere is custom content admitted WITHOUT a contest); `attemptEntry` takes the world's own snapshot of the ref where any religion state holds one, the oath's copy only where none does (V2); car-0 re-runs `lean2.mjs` against S68 as RESTATED per half (V1) — this lane's re-run `cure/BRACKETS-B-champions-probe/lean2.rerun.out.txt` is byte-identical to `cure/D-CH-PD-r1-probe/lean2.out.txt`]''')

# 30 L3 — aim.roadOpportunity lifecycle cite + exertion mark
add('**L3 — habits, moods, the picture, carried facts',
 r'''[''' + T + r'''OP-r1-15 · OD-OP-24 ⭐ · RULINGS-P6 §G.1) — `aim.roadOpportunity` (P2; THE OPPORTUNITY's aside mark on a paragon's aim): its ten paths are OP §13 L4's, cited and not restated — created only by CH's weekly writer at OP's request, persisted through `normalizeParagon` (absent when no aside was taken on the current aim), restored whole by the pulse's snapshot undo, gone with its aim — CH's writer and normalizer, the OWNER's shape (OD-OP-24 ⭐ VISIBLE). The `exertion`'s `captive_held` source mark (P2's comment, §4.5) lives and drops with `exertion`]''')

# 31 S60 minor
add('| S60 [ADDED 2026-10-20 (fp-final P6; L-CH-PD)] |',
 r'''| ↳ S60 [''' + T + r'''`skeptic/CH-PD-r1-verify.md` minor)] | "(and so no saint stands)" is false for a saint introduced BEFORE CH-11 (L1c migrate: it stays unsworn until the DM's revision swears it) | the pin's world is one in which no record carries `swornDeity`; a pre-CH-11 unsworn saint may stand in it, its (3a) carrying only a seated creed — the dormancy pin holds unchanged |''')

# 32 S61/S65 minor (after S65)
add('| S65 | ONE fallen saint',
 r'''| ↳ S61 · S65 [''' + T + r'''`skeptic/CH-PD-r1-verify.md` minor)] | "≥ / ≤ over a year on the same hash stream" is not guaranteed once the two runs' states diverge (an extra exertion moves moods, stays and stakes) | the pin asserts the ORDER on IDENTICAL state — the first week, and every week until the two runs' records first differ: the sworn run's p(exert) is ≥ (S61) / ≤ (S65) the unsworn run's on the same draw; the year's counts are REPORTED, never pinned [REFINED 2026-10-20 (fp-final P6c) — vetoable: the alternative pins the counts on a fixture whose moods and stakes are held fixed] |''')

# 33 S68 restated
add('| S68 [ADDED 2026-10-20 (fp-final P6 r1) — RULINGS-P6 F.1] |',
 r'''| ↳ S68 (i) RESTATED [''' + T + r'''RULINGS-P6 §H.3 · CH-PD-V1)] | the same grid | (i) is pinned PER HALF, as the executed table supports: the ALIGNMENT half `align` is monotone in malice and in law (each one-step change, the temper arm held AUTHORED, moves `align` the way the face's kind and law coordinates say, or not at all); the BOLDNESS half (and so `act`) is monotone in an AUTHORED temper. `act` is NOT monotone in malice on the DERIVED arm — `deriveTemper` ties the temper to the alignment, so one malice step moves both halves — EXECUTED, 18 one-step changes move `act` AGAINST the kind coordinate (`skeptic/CH-PD-r1-verify-probe/s68i.out.txt`, re-run byte-identical at `cure/BRACKETS-B-champions-probe/s68i.rerun.out.txt`: war champion good/lawful/derived 0.9722 → neutral/lawful/derived 1.0033 → evil/lawful/derived 1.0535); (ii)–(v) stand (`lean2.rerun.out.txt`, byte-identical: "T2 monotone in each coordinate holding the others (malice, law on the alignment half; temper on act): true") |''')

# 34 OD-CH-52 plainly
add('| OD-CH-52 | The lean |',
 r'''| ↳ OD-CH-52 [''' + T + r'''RULINGS-P6 §H.3 · CH-PD-V1)] | The lean, said plainly | "monotone" is PER HALF (S68 (i) restated). An OWNER-VISIBLE consequence of the derived temper: a GOOD god's war champion leans BELOW an unsworn one (`act` 0.9722 against 1) and below an evil god's (1.0535 under evil/lawful) — the landed derivation makes every good god `peacelike`, so its sworn finds the forceful act harder, while the alignment half alone still reads the war deed warmly (1.0233). By delegation, vetoable |''')

# 35 OD-CH-55 — H.1 + minor
add('| OD-CH-55 | Saints, heretics and the fallen |',
 r'''| ↳ OD-CH-55 [''' + T + r'''RULINGS-P6 §H.1 · the verifier's minor on CH-PD-r1-2)] | Saints, heretics and the fallen | (a) a saint's oath to a god SEATED NOWHERE is admitted as custom content WITHOUT A CONTEST: the field stands (the oath is required), the (3a) arm is DARK until the god holds a seat somewhere or `religionActive`; "a DM-made god seated nowhere can enter a world's faith contest through its saint" is WITHDRAWN (the deity doctrine: entry is share-driven, the patron seat is sticky; a saint seats no god); (b) the fallen saint's shame is reached under a good, a neutral-lawful OR a wholly neutral creed (`lean2.out.txt` T5). By delegation, vetoable (H.1) |''')

# 36 §23 — OD-OP-24 cited row (after OD-CH-56)
add('| OD-CH-56 ⭐ (an owner-signed PIN changed by declaration',
 r'''| OD-OP-24 ⭐ VISIBLE — CITED (THE OPPORTUNITY's row; the OWNER's persisted shape) [''' + T + r'''RULINGS-P6 §B.1 · §C · OP-r1-15)] | The paragon's aside mark | `aim.roadOpportunity` — a conditional sub-field of CH's `aim` (P2), CH's writer and `normalizeParagon` its normalizer, at most one per aim (OP4), its ten paths OP §13 L4; declared by OP and carried here so CH's record and normalizer name it; re-confirmed at its unit (OP-6, CH's wave) |''')

def main():
    lines = open(PATH, encoding='utf-8').read().split('\n')
    plan = []
    for anchor, new in E:
        hits = [i for i, l in enumerate(lines) if l.startswith(anchor)]
        if len(hits) != 1:
            sys.exit(f'ANCHOR NOT UNIQUE ({len(hits)}): {anchor!r}')
        plan.append((hits[0], new))
    idx = [p[0] for p in plan]
    if len(set(idx)) != len(idx):
        sys.exit('two entries share an anchor line')
    for i, new in sorted(plan, key=lambda p: -p[0]):
        lines[i+1:i+1] = new
    open(PATH, 'w', encoding='utf-8').write('\n'.join(lines))
    print(f'inserted {sum(len(n) for _, n in E)} lines at {len(E)} anchors')
    for i, _ in sorted(plan): print('after line', i+1)

if __name__ == '__main__':
    main()
