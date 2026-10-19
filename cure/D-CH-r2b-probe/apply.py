#!/usr/bin/env python3
"""D-CH-r2b: apply the round-2b cures to DESIGN_FP_ARCH_CH.md by exact, single-occurrence replacement.
Every replacement asserts its anchor occurs exactly once; nothing is written unless all anchors match."""
import sys

PATH = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_CH.md'
R2B = '[CURED 2026-10-18 (fp-final r2b) — '
F2B = '[REFINED 2026-10-18 (fp-final r2b) — '

EDITS = []

def edit(old, new):
    EDITS.append((old, new))

# X — the status banner
edit(
    "No STOP stands in round 2.\n",
    "No STOP stands in round 2. **ROUND 2b DISPOSED (2026-10-18, lane D-CH-r2b):** the one seams finding routed to CH (SEAMS-r2-6 — THE CORPS keyed by RN's UNIT prefix `u:`, never the court's `c:`, and its arm at the town's gate) and the round-2b corrections that reach CH's text (HOST-r2-5: the host's patrol facts go out through the window, H16 untouched; HOST-r2-1: winter slows a pass and never cuts it, and the climate band is landed; PR's one stretch key and `fameIn`; ST-r2-1's ceiling; the landed navy) are disposed in §25's Round 2b block (`cure/D-CH-r2b.md`). No STOP stands in round 2b.\n",
)

# A — §0 POSTURE_ACTOR_KINDS row
edit(
    "RULINGS §4 widens to `settlement · person · party · menace` (the chair's row) | always | 136 |",
    "RULINGS §4 widens to `settlement · person · party · menace` (the chair's row) " + R2B + "SEAMS-r2-6: the convention is now `settlement · person · party · menace · site` (fold §3.3.12) and gains `corps` (THE CORPS, §16b; `RULINGS-ROUND2b.md`) — the fold's row at P4] | always | 136 |",
)

# B — CH12
edit(
    "owned here with an arm per actor kind (person · party — PT cites it):",
    "owned here with an arm per actor kind (person · party · corps — PT cites it; the corps arm is a FREE company's, §11, CH-10) " + R2B + "SEAMS-r2-6: THE PASSAGE sends a free corps to this town's gate (PS1 (d), PS §5.5)]:",
)

# C — §2.2 gateDefault row
edit(
    "| the town's-gate default for EVERY actor kind (person · party), one reason vocabulary (§11); PT's `party_gate` calls it [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-5] |",
    "| the town's-gate default for EVERY actor kind (person · party · corps), one reason vocabulary (§11); PT's `party_gate` calls it [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-5] " + R2B + "SEAMS-r2-6: the corps arm, §11] |",
)

# D — §2.2b the RN key
edit(
    "The person's key on RN's ledger is RN's `p:<wnpc>`.",
    "The person's key on RN's ledger is RN's `p:<wnpc>`; a corps' is RN's UNIT key `u:<unitKey>` — never `c:`, the court's prefix — and it is the doer of its `sold_out` deed (RN's `doer` gains `corps`, RN's row) " + R2B + "SEAMS-r2-6, as RULED in `RULINGS-ROUND2b.md`].",
)

# E1 — §5 sea and seasons: slow, never cut
edit(
    "and the canon's frozen SEASONAL OVERLAY (SEASONS-B) lengthens a winter pass; the route search",
    "and the canon's frozen SEASONAL OVERLAY (SEASONS-B) lengthens a winter pass — it SLOWS the pass and never cuts it (`spatialCost.js :: SLOW_NOT_SEVER_MAX = 6`: \"NEVER infinite/cut — so a snowed-in town is dear to reach yet still RESCUABLE by spring\"; every `SEASON_TERRAIN_COST` value finite and ≤ that cap) " + R2B + "HOST-r2-1, as RULED in `RULINGS-ROUND2b.md`: \"winter SLOWS a pass, NEVER cuts it\"]; the route search",
)

# E2 — §5 the climate band
edit(
    "The per-settlement CLIMATE BAND the map supplies (ENC-HL-09) is the fold's one owed host consumer (CHAIR-NOTES item 13, narrowed at 07:5x); when it lands it enters the same price, never a CH term.",
    "The per-settlement CLIMATE BAND is ALREADY landed and read by the food year (`spatialDigest.js :: CLIMATE_BAND_VERSION = 1`; `seasons.js :: climateBandFor`, \"W-CAP CAP-3 — this settlement's frozen climate band\"); what is owed is the host document's accepted H11 RE-VERSION of it (ENC-HL-09), and travel reads it only through ONE re-versioned `SEASON_TERRAIN_COST` table inside the same price — the band SCALES the slowing, never a second multiplier, never a closure, never a CH term " + R2B + "HOST-r2-1: the round-2 sentence called the band \"the fold's one owed host consumer\" (CHAIR-NOTES item 13 as narrowed at 07:5x); the band exists, and only its re-version is owed].",
)

# E3 — §5 the carriage sentence (SEAMS-r2-1, NOTED with a refinement)
edit(
    "A ship is a column's or an army's carriage (CHAIR-NOTES item 14): a paragon with one mirrors its leg as on land.",
    "A paragon riding WITH an army mirrors the army's leg by land or sea; at sea the army is carried by W-NAVY's CONVOY (`armyTransit.js :: ARMY_ROLES.CONVOY` on the sibling `navalTransit` ledger; `navalLayer.js`: \"A navy convoys an own/allied army over water\"; lit by `simulationRules.js :: WAVES` `navalEnabled: true`), and a paragon riding with a lost convoy's army debarks with it (`navalKernel.js`: the embarked army \"SHARES the convoy's fate … a forced debark\") — never harmed beyond its leg (CH3). CH mints no sea law and no sea fight. " + F2B + "SEAMS-r2-1 (routed to the chair, MN, PR and PS, not to CH): the round-2 sentence cited CHAIR-NOTES item 14's \"a ship = a column's or army's CARRIAGE (WC's union)\", which the landed, lit, owner-commissioned navy contradicts (`docs/DESIGN_NAVY.md` on master); CH now rests on the landed carriers alone and needs no ruling on item 14 either way — that item is the chair's before P4.]",
)

# F — §5 patrols considered
edit(
    "patrols stay a MAP-ONLY picture until the host's PR lights and opens the map's H16 door (the host document's newest version, 2026-10-18: \"patrols stay a map-only picture for now\"); CH mints nothing for patrols.",
    "patrols stay a MAP-ONLY picture until the host's PR lights (the host document's newest version, 2026-10-18: \"patrols stay a map-only picture for now\"); then the host's patrol facts go OUT THROUGH THE WINDOW like every other host fact (PR14, PR §13: the events window H9 and the lens window H23), and H16 — the map's INBOUND door — stays untouched " + R2B + "HOST-r2-5, as RULED in `RULINGS-ROUND2b.md` (the chair's own error corrected): never \"opens H16\"]; CH mints nothing for patrols.",
)
edit(
    "(a) CH's leg choice reads PR's ONE `believedWatch(worldState, snapshot, observerId, stretch, tick)` (OD-PR-16: one planning read, never a second);",
    "(a) CH's leg choice reads PR's ONE `believedWatch(worldState, snapshot, observerId, roadKey, tick)` over PR's ONE STRETCH KEY (`road{a, b}`, unordered, keyed by the codepoint-sorted pair `a␟b`; a power's half is the part on its own land, cut at the digest gate — PR §2.2) (OD-PR-16: one planning read, never a second);",
)
edit(
    "(b) a hostile paragon NOTICED on its leg by PR's one encounter law (`patrolEncounter`, PR8; a paragon's fame cuts its cover through RN's `fameOf`) is TURNED BACK in CH's own words — a `person_at_the_gate` card whose WHERE is the road stretch (`road (a, b)`, ENC-HL-13), default `refused` — and never seized (custody waits on ES-2b, A.11);",
    "(b) a hostile paragon NOTICED on its leg by PR's one encounter law (`patrolEncounter`, PR8; a paragon's fame cuts its cover through RN's `fameIn` AT THE RIDERS' TOWN — that town's belief, never `fameOf`'s world-wide truth, PR §8.1) is TURNED BACK in CH's own words — a `person_at_the_gate` card whose WHERE is the road (`road{a, b}`, the half on the riders' town's land; ENC-HL-13), default `refused` — and never seized (custody waits on ES-2b, A.11); the leg's `hopIndex` and `progress01` place the paragon on a half (PR §2.2's hop-to-half map); a paragon of the diplomacy calling is a PERSON on its own leg, never THE PASSAGE's envoy arm (no errand row names a paragon, CH-V1; RULINGS-ROUND2b SEAMS-r2-2 keeps `envoy_intercepted` / `envoy_held` the army interception's); a FREE corps noticed on a road is turned back by the same words (the corps arm, §11), a RETAINED corps is THE PASSAGE's (PS's witness and ladder) " + R2B + "PR's round-2 cures aligned in CH's text: SEAMS-r2-8 (THE ONE STRETCH KEY), PR-r2-12 (`fameIn`, not `fameOf`), SEAMS-r2-2 (envoys), SEAMS-r2-6 (the corps)];",
)

# G — §5 sites (d): the purse onto ST's funding band; the DM's ceiling
edit(
    "(d) a person holder's funding band is CH's derived purse band (ST `fundingBandOf`; `meagre` until CH lights);",
    "(d) a person holder's DERIVED funding band is CH's purse band read onto ST's `FUNDING_BANDS` (`penniless` → `unfunded` · `scraping` → `meagre` · `provided` → `funded` · `moneyed` → `lavish`; DRAFT, UNMEASURED), and ST's EFFECTIVE band is `min(fundingSet, derived)` — the DM's band a CEILING (ST6; RULINGS-ROUND2b ST-r2-1); `meagre` until CH lights " + R2B + "ST-r2-1 aligned: the two vocabularies had no declared map, and the DM's band is now a ceiling, never an override];",
)

# H — §6.2 wildland prose reads the outcome
edit(
    "on the SIEGE, a warden exerting in the besieged town shifts the verdict's keyed draw",
    "on the SIEGE, a warden whose week's `exertion.outcome` in the besieged town is `exerted` (read through `paragonLean`, never `aim.exert` — MN §5.2 reads it so) shifts the verdict's keyed draw",
)
edit(
    "in a RAID, `menaceCounterTerms` row (1): a warden exerting in the raided town +DRAFT 0.10 to the wear read,",
    "in a RAID, `menaceCounterTerms` row (1): a warden whose exertion in the raided town is `exerted` +DRAFT 0.10 to the wear read " + F2B + "SEAMS-r2-5 / `cure/D-MN-r2b.md`'s note: the prose said \"exerting\"; CH's own leaf reads the outcome, and MN now reads it through that leaf],",
)

# I — §7 the terms ceiling from ST's one settlement band
edit(
    "the court SETS its terms from its own `prosperityRank01`, and `treasuryBandOf` where the treasury is lit)",
    "the court SETS its terms' CEILING from ST's ONE settlement band `settlementFundingBand(worldState, courtId, snapshot)` (itself the cut of `prosperityRank01`, ST §2.4), so a court's purse is read ONCE for its sites, its riders' pay and its retainers — `unfunded` → at most `meagre` · `meagre` → `decent` · `funded` → `handsome` · `lavish` → `princely` (DRAFT, UNMEASURED) — and `treasuryBandOf` where the treasury is lit) " + F2B + "the BAND/COIN split the chair drew for ST-r2-1 and SEAMS-r2-12: the band half is always on, from the one settlement band; the coin half is W-COIN's `retainers` row (CH10); if CH lands before ST's leaf, CH's commit lands that pure read in ST's module, ST its owner; round 2 read `prosperityRank01` directly, a second cut of the same quantity]",
)

# I2 — CH10 the split stated at the law
edit(
    "the paragon's purse is a DERIVED band, never a coin store (debt stays owner-gated).",
    "the paragon's purse is a DERIVED band, never a coin store (debt stays owner-gated). " + F2B + "the BAND/COIN split (RULINGS-ROUND2b ST-r2-1; SEAMS-r2-12): the court's terms ceiling is the BAND, always on, from ST's one settlement band (§7); the COIN is W-COIN's `retainers` row.]",
)

# J — §11 the corps arm (before the bans)
edit(
    "\n**Bans — one ban, the landed edge.**\n",
    "\n**The corps arm (a FREE company at a town's gate).** " + R2B + "SEAMS-r2-6: THE PASSAGE rules that a free corps \"meets a town through CH's gate (the corps arm of `person_at_the_gate`), never this ladder\" (PS1 (d), PS §5.5, OD-PS-34).] A corps with NO standing retainer (PS's \"free\") that arrives at a settlement meets the same leaf with `actorRef = { kind: 'corps', id: unitKey }`, the same order and the same reasons; a corps carrying a retainer — bound, or free under a temporary one (PS's \"retained\") — is its employer's unit: THE PASSAGE judges it on foreign land, and at its destination it is its employer's force, never a town's-gate case. The steps: (1) the ban from truth, on the edge keyed by that ref (PT's actor-ref widening's `corps` arm; until it lands a corps carries no edge and the DM's `banish` offers persons only); (2) `polity_ban`, as for a person; (3) of the circumstance reasons only `under_quarantine` (an unretained company serves no court, so `at_war_with_employer` and `enemy_in_service` cannot fire, and it has no creed); (4) renown: the WATCH's regard of the company (RN, subject `u:<unitKey>`) at `enmity` or worse ⇒ `refused` — `rejectionFor`'s person table is never read for a unit; (5) the watch: `mistrust`, or it believes the company of the villain side ⇒ `admitted_under_watch`; (6) otherwise `admitted`. A refused company does not quarter there: WC's one stepper keeps it where it stood, and its next weekly choice weighs another destination; on a road a patrol's turn-back reads the same words (§5). The card is `person_at_the_gate` with the corps as its party — ONE kind for both holder kinds of the mark (`person · corps`), its name kept because PR8, PS1 (d) and the fold's §3.4 already cite it (§2.3's register row). Lands with CH-10 (WC-10).\n\n**Bans — one ban, the landed edge.**\n",
)

# K — §16b who it is to the world
edit(
    "Its actor ref is `{ kind: 'corps', id: unitKey }`: a cross-volume row for the fold — SP-4a's `POSTURE_ACTOR_KINDS` gains `corps` (as it gained `site`), the exclusion edge's actor-ref widening (PT's shape change) gains a `corps` arm, and RN keys its fame and regard as `c:<unitKey>` beside `p:<wnpc>` (RN's registration).",
    "Its actor ref is `{ kind: 'corps', id: unitKey }`: cross-volume rows, each its owner's — SP-4a's `POSTURE_ACTOR_KINDS` and the fold's actor-ref convention (`settlement · person · party · menace · site`) gain `corps`; the exclusion edge's actor-ref widening (PT's shape change) gains a `corps` arm; RN keys its fame and regard as the UNIT key `u:<unitKey>` beside `p:<wnpc>` — never `c:`, the court body's prefix (RN's registration; RN's `doer` gains `corps`); CHAIR-NOTES item 16 carries these rows to the fold at P4. The refused-pair rule does not apply to `u:` (`RULINGS-ROUND2b.md` SEAMS-r2-6), so a corps holds regard of the court that hires it and is regarded by it — the relations term (§4.4) and the retainer's answer (§7) read both. ON THE ROADS (THE PASSAGE): a RETAINED corps — one carrying a `retainer`, bound or free under a temporary one — crossing foreign land is PS's passage mover, its employer's unit (PS1 (d); key `corps:<unitKey>`, PS §2.1); a FREE corps meets each town through CH's town's gate (the corps arm, §11). " + R2B + "SEAMS-r2-6, as RULED: \"a corps keys in RN as `u:<unitKey>` (a UNIT holder/subject; the `c:` prefix stays the court body; the refused-pair rule does not apply to `u:`)\" — the round-2 text keyed the corps under the court's `c:`, so it would have taken a derived body regard and could hold no regard of the court that hires it.]",
)

# L — CH-10 hosts
edit(
    "PT's actor-ref widening (`corps` arm); RN's `c:<unitKey>` key.",
    "PT's actor-ref widening (`corps` arm); RN's `u:<unitKey>` key (RULINGS-ROUND2b SEAMS-r2-6; never `c:`); the corps arm of `gateDefault` (§11; zero host lines — CH's own leaf).",
)

# M — OD-CH-36
edit(
    "actor kind `corps` (the fold's SP-4a row, PT's edge widening, RN's `c:` key);",
    "actor kind `corps` (the fold's SP-4a row, PT's edge widening, RN's `u:` key — never `c:`); a RETAINED corps is THE PASSAGE's mover, a FREE one meets CH's town's gate (the corps arm, §11) " + R2B + "SEAMS-r2-6];",
)

# N — OD-CH-15
edit(
    "| OD-CH-15 | The town's gate | ONE leaf `gateDefault` for every actor kind (person · party):",
    "| OD-CH-15 | The town's gate | ONE leaf `gateDefault` for every actor kind (person · party · corps — the corps arm a FREE company's, §11, SEAMS-r2-6):",
)

# O — §18 person_at_the_gate row
edit(
    "| `person_at_the_gate` | CH (CH-5) | person ↔ the court at the town's gate (its WATCH named) | `settlement` — the town's gate · `site` from ST's `worldSites` · `road (a, b)` for a patrol's turn-back where THE PATROLS are lit (§5)",
    "| `person_at_the_gate` | CH (CH-5; the corps arm CH-10) | person — or a FREE corps, `{kind:'corps', id: unitKey}` (§11's corps arm, SEAMS-r2-6) — ↔ the court at the town's gate (its WATCH named) | `settlement` — the town's gate · `site` from ST's `worldSites` · `road{a, b}` (the half on the riders' town's land — PR's ONE STRETCH KEY, PR §2.2) for a patrol's turn-back where THE PATROLS are lit (§5)",
)

# P — §18 scope sentence
edit(
    "and the road stretch for a patrol's turn-back at `person_at_the_gate` where PR is lit;",
    "and the road (`road{a, b}`, PR's one stretch key) for a patrol's turn-back at `person_at_the_gate` where PR is lit;",
)

# Q — §19 TIER
edit(
    "PATROLS — `patrolsEnabled`, and the host's H16 door opened, for the patrol rows (§5).",
    "PATROLS — `patrolsEnabled` for the patrol rows (§5); the host's patrol facts go out through the window (PR §13), H16 untouched " + R2B + "HOST-r2-5].",
)

# R — S39
edit(
    "| S39 | PR lit, the host's H16 open: an enemy captain of `realm` fame on Kell's road | PR's encounter notices it (fame cuts its cover); a `person_at_the_gate` card with WHERE `road (a, b)`, default `refused`; no seizure (E) |",
    "| S39 | PR lit: an enemy captain whose `realm` fame has reached Kell, on Kell's road | PR's encounter notices it — its fame cuts its cover only where the riders' town has heard the deeds (`fameIn` at Kell; at a town that has not, the cover is unchanged); a `person_at_the_gate` card with WHERE `road{a, b}` (Kell's half), default `refused`; no seizure; nothing sent through H16 (E · HOST-r2-5 · PR-r2-12) |\n| S40 | WC-10 lit: the Grey Company, unretained, arrives at Kell, whose watch regards it at `enmity`; later Merewick retains it and it marches across Ashford's land | at Kell a `person_at_the_gate` card with the corps as its party, default `refused` by the renown step (the watch's RN regard of `u:<unitKey>`), and no `rejectionFor` read; RN keys it `u:<unitKey>`, never `c:`; across Ashford it is THE PASSAGE's mover (PS1 (d), key `corps:<unitKey>`), never CH's gate (SEAMS-r2-6) |",
)

# T — OD-CH-37
edit(
    "the climate band is the fold's one owed host consumer (the owner's 06:35 question) |",
    "the climate band is LANDED (`CLIMATE_BAND_VERSION`, read by the food year) and only H11's re-version is owed, read by travel through ONE re-versioned `SEASON_TERRAIN_COST` table — it scales the slowing and never closes a pass (`SLOW_NOT_SEVER_MAX`) " + R2B + "HOST-r2-1]; at sea an army rides W-NAVY's convoy and a paragon riding with it shares that leg — landed carriers only; CHAIR-NOTES item 14's carriage clause is the chair's (SEAMS-r2-1) (the owner's 06:35 question) |",
)

# U — OD-CH-38
edit(
    "patrols map-only until the host's PR lights and opens H16, then four registered rows (`believedWatch`, the turn-back at the road,",
    "patrols map-only until the host's PR lights — its patrol facts then go out through the window, H16 untouched (HOST-r2-5) — then four registered rows (`believedWatch` over PR's one stretch key, the turn-back at the road `road{a, b}` with `fameIn` at the riders' town,",
)

# V — §25 round-2 row bracket
edit(
    "| map-only until the host's PR lights and opens H16; then four registered rows |",
    "| map-only until the host's PR lights and opens H16; then four registered rows [superseded in round 2b — HOST-r2-5: the host's patrol facts go out through the window; H16 untouched] |",
)

# W — §2.3 round-2b register row (after the ROUND 2 row)
edit(
    "| THE MAP REGISTER (HOST-r1-5; the map's \"One word, one meaning\" rule) |",
    "| ROUND 2b: `u:<unitKey>` (RN's UNIT key for a corps — RN's token, cited, never minted here) · the `corps` actor kind (the fold's convention) · `person_at_the_gate`'s corps party · `road{a, b}` (PR's ONE STRETCH KEY, cited) · `meagre` (shared with ST) | no `'u:'` key literal in master `src` (`cure/D-CH-r2b-probe/receipts.out`); `meagre` 0 src · 0 tests (ST §2.3's census) — CH's `termsBand` word and ST's `FUNDING_BANDS` word | cited / shared | `person_at_the_gate` is ONE kind for both holder kinds of the paragon mark (`person · corps`); the name is kept because PR8, PS1 (d) and the fold's §3.4 cite it, and a card says \"the Grey Company at Kell's gate\", never \"a person\"; `meagre` means a small sum on both fields (a retainer's terms; a site holder's purse) — one sense, registered " + R2B + "SEAMS-r2-6 · ST-r2-1 · SEAMS-r2-8] |\n| THE MAP REGISTER (HOST-r1-5; the map's \"One word, one meaning\" rule) |",
)


def main():
    text = open(PATH, encoding='utf-8').read()
    bad = []
    for i, (old, new) in enumerate(EDITS):
        n = text.count(old)
        if n != 1:
            bad.append((i, n, old[:90]))
    if bad:
        for b in bad:
            print('ANCHOR FAIL', b)
        sys.exit(1)
    for old, new in EDITS:
        text = text.replace(old, new, 1)
    open(PATH, 'w', encoding='utf-8').write(text)
    print('applied', len(EDITS), 'edits')


if __name__ == '__main__':
    main()
