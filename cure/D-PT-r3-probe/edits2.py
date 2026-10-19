import sys
p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PT.md'
s=open(p,encoding='utf-8').read()
def rep(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit(f"MISMATCH {n} for: {old[:100]!r}")
    s=s.replace(old,new)
B='[CURED 2026-10-18 (fp-final r3) — '
R='[REFINED 2026-10-18 (fp-final r3) — '

# homonyms: banKeys vs the ban grammar
rep("· `banKeys` — CH's word on a paragon's record and PT's on the party's sub-ledger, ONE sense (the banning court's seat episode key at an emergent ban's mint) ·",
    "· `banKeys` — CH's word on a paragon's record and PT's on the party's sub-ledger, ONE sense (the banning court's seat episode key at an emergent ban's mint), and NEVER the ban grammar `polity_ban:<subjectKey>:<banTick>` — PL's ONE form for a ban or harbouring EPISODE (`subjectKey` RN's `p:<wnpcId>` or `u:<unitKey>`; RULINGS-ROUND3 A.8, PL OD-PL-46): a seat episode and a ban episode are two facts; PT names no ban or harbouring episode of its own "+B+"A.8 (PL's routed note: \"PT's `banKeys` hold seat episode keys, which are a different fact and are unchanged\")] ·")
# §4 sites (1) siteId
rep("with the site as an optional `siteId` qualifier beside RN's `institution` / `factionId` / `stressorId` — a SUBJECT, never an actor ref),",
    "with the site as an optional `siteId` qualifier beside RN's `institution` / `factionId` / `stressorId` — a SUBJECT, never an actor ref; RN's deed target shape gains the `siteId` field, RN's to write in its one normalizer (RULINGS-ROUND3 B for RN: \"the deed target shape gains `siteId` (the party's cleared site is a target)\") "+B+"the verifier's carry \"RN's normalizer drops unnamed fields, and its `target` names no `siteId`\": PT cites RN's field, mints none]),")
# §7.3 party_voiced producer row
rep("| `party_voiced` | a renowned holder (fame `regional` or wider) whose regard of the party crosses into `enmity`/`hatred` or `esteem`/`adoration` — RN §5.5's crossing, handed to PT by the stage (RN mints nothing for it) | the voice itself (a person; persons lit) | CLIMAX · the town where it stands [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6 (the chair's ruling)] |",
    "| `party_voiced` | a COURT (any — a court is heard by its standing), or a PERSON or a CORPS of `regional` fame or wider (by fame), whose regard of the party crosses into `enmity`/`hatred` or `esteem`/`adoration` — RN §5.5's crossing, its court arm included, handed to PT by the stage (RN mints nothing for it) | a court's RULER for a court's voice; else the voice itself (a person, persons lit; a company, CH's corps lit) | CLIMAX · the town where it stands (a court: its own town) [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6 (the chair's ruling)] "+B+"A.11 · the RN verifier's note \"PT §7.3's voice is 'a person', yet RN §5.5's famous holder may be a `u:` corps\": the producer reads \"a court, a person or a corps\"; a court's voice needs no person lit] |")
# §7.3 warrant on a road
rep("**The WATCH on the road (THE PATROLS lit).** A `party_warrant` served or a `party_ambush` laid on a road is carried by a DETACHMENT of the court's riders (PR19: aim `pursue`, drawn from the round, its cost borne on the round) — one road force per town, never a second — and the hearing stays PT's with its default unchanged (nothing has happened to the party yet); with PR dark the WATCH is the court's office as written.",
    "**The WATCH on the road (THE PATROLS lit).** A `party_ambush` laid on a road is carried by a DETACHMENT of the court's riders (PR19: aim `pursue`, drawn from the round, its cost borne on the round) — one road force per town, never a second — and the hearing stays PT's with its default unchanged (nothing has happened to the party yet); with PR dark the WATCH is the court's office as written. A `party_warrant` stands at the court's town and is served there — its WHERE is `settlement` (§13) — never on a road. "+B+"the verifier's carry \"a warrant never stands at WHERE `road`\" (RULINGS-ROUND3 B: \"'a warrant served on a road' → struck\"); PR19, PR §8.2 and R33 say the same since D-PR-r3]")
# §7.3 voice spoken: court arm
rep("**The voice spoken** (`party_voiced`): at `spoken` (the default) RN's `voiced_regard` deed mints (`praise` or `condemnation`, target the party), once per (holder, party) per year by RN's cooldown; at `withheld` nothing mints and `strikes` quiets that voice for the same year.",
    "**The voice spoken** (`party_voiced`): at `spoken` (the default) RN's `voiced_regard` deed mints (`praise` or `condemnation`, target the party), once per (holder, party) per year by RN's cooldown; at `withheld` nothing mints and `strikes` quiets that voice for the same year. A COURT's voice is a settlement doer's deed: it travels as a TALE and moves no fame (RN1 — no court has fame), and it reaches hearers' regard of the party through the tale and the teller's credibility, exactly as `party_slander` does (RULINGS-ROUND3 A.11; RN §5.5's court arm). "+B+"A.11]")
# §9.2 enemy_in_service
rep("`enemy_in_service` (one meaning: the party serves — a backing — a court this court regards at `enmity` or worse) ⇒ `refused`;",
    "`enemy_in_service` (one meaning: the party serves — a backing — a court with which this court's LANDED PAIR STATE is `hostile`, as this court believes it: `worldPulse/beliefMap.js :: readBeliefRelationship(observerId, subjectId, worldState, truthType)` — \"if (b.source === 'belief') return b.record.allianceLabel || truthType;\", truth in the omniscient preset; a war between them is reached first as `at_war_with_employer`) ⇒ `refused` "+B+"A.4 (SEAMS-r2-11's class, routed by the CH verifier: \"PT reuses the one meaning\"): a court's feeling for a court is the landed pair state, never RN regard — RN refuses an `s:`/`c:` × `s:`/`c:` entry (R51), so \"regards at `enmity`\" could never fire; CH §11 step 3 carries the same meaning (CH's lane)];")
# §9.2 road arm sea hop
rep("a sea or teleport hop has no road half and meets no rider)",
    "a sea hop — `roads/seaRoads.js :: classifyLegModes(digest, path)` → `'sea'` — or a teleport hop has no road half and meets no rider "+B+"A.14: the sea-hop test is the landed classifier])")
open(p,'w',encoding='utf-8').write(s)
print("ok")
