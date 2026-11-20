# SEAT-MEASURE — addendum: the seat's own kind, the guild council, and the form / holder / person model (written 2026-11-20T04:46Z, base `85fccf898`)

The chair's addendum of 2026-11-20 04:32Z carries the owner's question: *"a guild council that competes with the merchant guilds or crafts guilds. It seems redundant … Shouldn't a guild council represent the seat that is led by the power of a merchant guild or craft guild? … the government type could be an autocracy but it is the merchant guilds who installed a king of their own on the throne"*.

**Executed** (files beside this one; config through `birthConfig`, `--law v1` for the stored population):
- `measure-kin.mjs --arm default` (900 towns) → `kin-default.{md,json}`;
- `measure-kin.mjs --arm presets` (960 towns) → `kin-presets.{md,json}`;
- `measure-guild-seats.mjs` (both arms) → `guild-seats.txt`.

The seeds and configs are the same as in `SEAT-COUNT.md`, with 0 errors. "Seat kind" is `powerSupport.js :: backingArchetypeOf` (the reader that sees craft); "contends" is `coupContenders`. The seat-holder is the first entry of `powerStrata.js :: liveSeatCandidatesOf`, and "heads" means membership rank 1. **Read, not executed:** the map and the options below.

## 1. The count (today's births, through `birthConfig`, v2; the stored v1 population in `kin-*-v1.*`, `guild-seats-v1.txt`)

> ⚠ Corrected at 04:58Z (see SEAT-COUNT.md's correction): the first version of this section measured v1 worlds. The seats are byte-identical under both laws. The roster beside them is pruned by the density law, so the figures below are v2; the v1 figure, where it differs, is in brackets.

**The chair's case is the rule, not an exception.** Seed `rv2-calm-town-9001` at tier town (named Evangepolis under this config) reproduces it: the Feudal Appointee rules, Landed Gentry stands beside it and contends, and one person is rank 1 of both. That holds in **15 of 15** Feudal Appointee towns at default, under both laws.

**(a) Per kind of seat** (default arm, then presets):

| seat kind | seats | a power of its own kind stands beside it | …and contends for the seat | the seat-holder is that power's first member |
|---|---|---|---|---|
| merchant | 148 · 179 | **138 · 164** [v1: 148 · 178] | 132 · 152 | 58 · 80 |
| noble (Feudal Appointee only) | 15 · 12 | 15 · 9 | 15 · 9 | 15 · 9 |
| religious | 0 · 85 | – · **55** [85] | – · 55 | – · **0** |
| military | 0 · 61 | – · **58** [61] | – · 58 | – · **0** |
| arcane | 0 · 20 | – · 16 [20] | – · 16 | – · **0** |
| criminal | 0 · 22 | – · 16 | – · 0 (excluded) | – · 0 |
| government (civic, and every other noble-named seat) | 680 · 579 | 13 · 7 | 7 · 5 | 0 · 0 |

So almost every seat of a kind has its own kind's power standing beside it as a rival row: 93% of merchant seats, 65–95% of the presets' church, military and arcane seats. Where it stands, it contends for the seat in 96–100% of cases. For the church, military and arcane seats, the person in the seat is **never** that power's first member: the seat and its own power are two unconnected rows.

**The guild council** (`guild-seats.txt`). Guild Council, Merchant Guild Council and Grand Guild Consortium are born in 79 towns at default and 83 under the presets.
- Merchant Guilds stands beside them in 73 of 79 (default) and 73 of 83 (presets), and contends for the guild seat in **71 of 79** and 65 of 83.
- Craft Guilds stands beside them in 35 of 79 and 51 of 83, and contends in 0 and 38.
- Under v1, both guild powers stood beside every guild seat (79 of 79).
- Every guild seat reads **merchant** (`rulingKindOf`). No seat ever reads **craft**: `backingArchetypeOf` finds craft only where *craft* or *artisan* is in the name, and no chooser emits such a name.
- **So the chair and the owner are both partly right.** Craftsmen have a body by *name*, but no seat of their *kind*, and the guild council stands beside the guild powers as a rival.

**(b) The pairs: the body against the same-kind power beside it.** The top rows (all in `kin-*.md`):
- default: Merchant oligarchy | Merchant Guilds 41; Merchant Guild Council | Merchant Guilds 28; Guild Council | Merchant Guilds 22; Grand Guild Consortium | Merchant Guilds 21; Grand Merchant Oligarchy | Merchant Guilds 20; Feudal Appointee | Landed Gentry 15 (all contend);
- presets, in addition: Military Council | Military/Guard 26; Church Council | Religious Authorities 25; Military City Council | Military/Guard 18; Grand Military Council | Military/Guard 14; Ecclesiastical Council | Religious Authorities 13; High Theocratic Council | Religious Authorities 11; Arcane Council | Arcane Orders 9 (all contend).

**(c) Form against the power behind it: the merchant king already exists, by accident.** This counts the form against the kind of the power whose first member holds the seat (the dual hat). Default, v2:
- City Council × Merchant Guilds 53; Town Mayor × Merchant Guilds 42; Elder Council × Merchant Guilds 28;
- Grand Merchant Oligarchy × Merchant Guilds 23; Grand Guild Consortium × Merchant Guilds 22; Town Council × Merchant Guilds 22;
- **Ducal Governorship × Noble Houses 21**; Grand Council × Merchant Guilds 20; **Noble Governorship × Noble Families 18**;
- Democratic assembly × Merchant Guilds 16; Feudal Appointee × Landed Gentry 15.
- [v1 also: Town Mayor × Craft Guilds 23, gone under v2 with the pruned Craft Guilds.]

The holder heads no other power in 251 Elder Councils, 39 Merchant oligarchies, 32 Merchant Guild Councils, 25 Feudal Stewardships and **all 16 Royal Authorities**. So form and holder are **already drawn separately**: the form from the roster's label or the size, the person from the dual-hat house draw (`people/representatives.js`). But the pairing is never stated, never weighted, and never read by the contest. A merchant who holds a City Council's seat still has Merchant Guilds contending against that seat.

Noble-named seats have **no ruling kind**. `rulingKindOf` is null for Royal Authority, Noble / Ducal Governorship and Feudal Stewardship (executed), so neither `drawCouncilOfAKind`'s house test nor `settleHouselessPowers`' fold reaches them.

## 2. The map for the three-part model (form · holding power · person; the seat an office, not a rival row)

| what | where it lives today (read) | what the model breaks or moves |
|---|---|---|
| **The stored shape of rule** | `powerStructure.factions[]`: one row marked `isGoverning` *is* the body, and it carries a power figure inside the shares that renormalize to 100 (`renormalizeFactionPower`, `applyLegitimacyMultipliers`). Beside it: `powerStructure.government` (the form, a string), `governingName`, `previousGovernments`, `publicLegitimacy`. The person is `npcs[].memberships` (rank 1 of the body) | **Breaks the shape.** The seat leaves the power rows and becomes an office record, e.g. `{ form, holderPower, holder }`. That is a **persisted-shape change, the owner's.** Every share moves (the body's ~25–40 points are re-dealt), and so do every `powerLabel` and every power-ranked sentence. |
| **Reading an old stored town** | `rulingPower.js :: governingFactionOf` (isGoverning, else `governingName`) | Needs a read-time derivation; no migration is needed to *read*. Form = `government`. The holding power is, in order: the power whose first member holds the seat (§1c, which exists in most kind seats); else the same-kind power beside it (§1b); else the civic body itself. The person = `liveSeatCandidatesOf`. The old row's power figure stays as is (no rewrite of lived history). |
| **The transfer of power** | `rulingPower.js :: transferRulingPower` → `resolveGovernmentLabel` → **`rulingPower.js :: GOVERNMENT_PREFERENCES`** (archetype × size band → label, with `ALT_GOVERNMENT_LABELS` and `GOVERNMENT_DESCS`). The seat row is renamed and re-kinded (`seatCategory`); **the winner stays a separate row** (+6 power, `ascendant`). ⚠ A second, unrelated table shares the name: `worldPulse/factionCompetition.js :: GOVERNMENT_PREFERENCES` (eight form ids, `council_rule` … `arcane_magocracy`, through `GOVERNMENT_BY_ARCHETYPE`, where craft → `merchant_charter` and outsider → `noble_patronage`) | The transfer **builds the redundancy itself**: a winning Merchant Guilds stands beside its own new Merchant City Council. Under the model the winner becomes `holderPower` and the form is a separate weighted draw (keep, or change on a stated reason). This moves every coup outcome's roster. The two preference tables must become one home first, or form and holder drift between birth, coup and competition. |
| **The contender list** | `coupContenders`: the three heaviest rows other than the governing row; the incumbent's weight = the body row's power × `govMultiplier` | Moves. The holding power is excluded (it never contests its own seat), and the incumbent's weight becomes the holding power's weight × legitimacy. Today, with the body as the incumbent and its own power contending, the same house is counted on both sides. Every reader in SEAT-MAP §3 moves. |
| **The power page** | `powerStrata.js :: derivePowerStrata` (ruler + contenders), `rulingChainOf` (power → faction → NPC: **already three links**), `deciderOf` / `crisisNoteFor`; `PowerStrata.jsx`, `EngineSections.jsx`, the desk and print readers; the shared public page and party link | Moves. `rulingChainOf` is the model's natural home (form, power, person), but it reads "power" as the governing *row*. The "holds power" marker moves from the body row to the holding power. `outrankingRivalOf` / `deciderOf` stop naming the seat's own power as the rival that "really decides". |
| **The prose that names the body** | form-keyed: `rulingStructure.js` desc tables, `governanceNarrative.js`, `claimStanding.js`, `officeTitles.js`, `rulerKindLabel.js`. Holder-keyed today by accident: `factionDynamics.js` relation lines ("*X* carries out what *Y* decides"), `factionStanding.js` (`contestedBy`), `castPowers.js` (contender reads), the dual-hat card (`cardPowers.js :: cardHatsOf`: "the miller and Mayor") | The form-keyed prose stays. The relation and standing lines that pit a seat against its own power ("Merchant Guilds contests the seat") must go or be rewritten as holder-and-office lines. That is authored prose: one golden member, with the dossier-prose manifest. |
| **The registry rows of the security lane** (`rosterChoiceRegistry.js` at `fa97f71b0`) | `power.entry` / `power.composition` / `power.share` (recompose to 100) / `power.desc` / `power.label`; `tile.governmentType` (diffuse); `hasHouseOfKind` sited for `people.card` only | A new stored `holderPower` (and `holder`) needs rows. If a hidden house is the holder, the holder must be **withheld** while the form (`government_type`) stays. `power.share`'s recompose changes because the seat row no longer holds a share. The government type stays diffuse only if the form is drawn without reading a house. |
| **The golden master and registers** | as in SEAT-MAP §5 | One cause, but every row moves (shares, labels, contenders, prose). The largest single shift on the table. |

## 3. The options for the model (vetoable; I recommend, the chair designs)

- **K1. Read-side first (no stored change).** Derive `holderPower` at read time (as in §2's old-town reading). Exclude it from `coupContenders`, and show form · holding power · person in `rulingChainOf` and the power page. Fixes the visible redundancy ("Merchant Guilds contests its own guild council") with **no persisted-shape change and no birth move**. It moves only `annotateFactionStanding` and `castPowers` at birth (one golden member) plus the simulation's contest. Cost: one derivation leaf and its tests, plus the veil row for a derived holder.
- **K2. Birth draws form and holder separately, with weights.** Draw the holding power from the roster's powers (usual pairs common; unusual ones only with a stated reason, from the circumstances in SEAT-MAP's options). Then draw the form from a form×power weight table: guild council ← merchant or craft; junta in a council ← military with a legitimacy crisis; governor imposed ← outsider, occupation or debt; merchant king ← merchant holder with a noble or royal form. The seat stops being a share row. Cost: the persisted shape, every golden row, the registers, the veil re-measure, and the read of old towns from K1. It needs the owner's word on the shape.
- **K3. One preference home.** Merge `rulingPower.js :: GOVERNMENT_PREFERENCES` and `factionCompetition.js :: GOVERNMENT_PREFERENCES` into one form×power table that birth, coup and competition all read. This is a prerequisite for K2 and cheap on its own (the sim's competition layer moves).

**Recommendation: K1 now (it answers the owner's "redundant" complaint without touching the stored shape), K3 with it, and K2 as the owner's persisted-shape decision.** This sits with SEAT-MAP's O1 (true kinds), since K1's holder derivation and O2's circumstance weights both need the kinds to read right. **The crux** is whether the seat may stop holding a share of power. If the owner wants the office to carry no power figure of its own, K2 (the shape) is unavoidable. If the office may keep its figure as the holder's "seat bonus", K1 plus K3 delivers the model's behaviour with no migration.
