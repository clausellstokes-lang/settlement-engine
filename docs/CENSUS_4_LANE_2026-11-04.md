# CENSUS-4 — the NPC pools, then the Institutions and Services descriptions (lane record, 2026-11-04)

> A build seat's record for the chair. Branch `lane/census-4-2026-11-04`, cut from `lane/census-1-2026-11-04` at
> `ee3b9c7`. Transport push only; no pull request. The design is `docs/DESIGN_POOL_CENSUS.md`; the atom words are
> `docs/census/declarations/VOCABULARY.md`.

## The byte-identity method

The committed golden master is red at this base (CENSUS-1's record), so it cannot witness byte identity. Every unit is
proven with a scratch hasher: the 525 golden configurations' records (`goldenMasterCorpus.js` through
`generateSettlementPipeline`, sha-256), base worktree at `ee3b9c7` vs the lane, and every moved row is diffed path by
path; plus the soak's 60 record hashes and rendered pages.

## Phase A — the ledger (every line read)

`scripts/census/census4-extract-pools.mjs <dir>` enumerates every line of the lane's pools (data modules by import; the
inline pools of `npcGenerator.js`, `corruptionPass.js`, `factionLeaderSecret.js` and the `npcStructure.js` registry by
AST/eval of the literal); `scripts/census/census4-validate-ledger.mjs <dir>` proves the ledger covers every line, in
order, with only the vocabulary's atoms (BAD 0 at this commit).

| figure | value |
|---|---|
| pools read | **29** (NPC 27 · Institutions and Services 2) |
| lines read | **3,317** (NPC 1,675 · Institutions descriptions 664 distinct-pair lines over 518 keys · Services 978) |
| lines declaring | **281** (8.5%) |
| pure-colour pools | **10** (MANNERISMS, SPEECH_PATTERNS, NPC_PERSONALITY_TRAITS, NPC_AGE_DATA, NPC_BUILDS, NPC_FEATURES, NPC_PLOT_HOOKS, NPC_PLOT_HOOKS_DATA, NPC_PRESENTATION_MODES, RELATIONSHIP_STRENGTHS) |
| crisis-scoped pools | **0** (no pool both prints calm under a crisis AND wants silence-as-calm; the 35 calm lines are declared `crisis: "calm"` line by line) |
| atoms used with no factsOf reader | `institution: guild` (21 lines), `crime` (10), `tier: …` (21) — see below |

The lines counted differ from the design's §2.1 surface totals (NPCs 2,348, Institutions and Services 2,515) because the
design's rows group other tables onto those surfaces (the catalogue's own 519 descs, the cause-conjunction content);
this lane's scope is the brief's named pools. FACTION_CONFLICT_TYPES (a category table) has no prose and no row.

**The declared share is a sixth of the design's estimate (8.5% vs ~49%).** The design's sample read the first 20
lines of each pool and counted key-guaranteed atoms at line level; this ledger puts what the key guarantees on the pool
(`keyDeclares`), so a Garrison Commander goal does not declare `garrison`, and a siege secret does not declare
`under_siege`.

**Atom histogram (lines).** calm 35 · `ruler: council, elder, mayor, priest` 24 · `institution: guild` 21 ·
`institution: temple` 20 · `other-npc` 20 · watch 19 · market 19 · magic 17 · garrison 15 · walls 13 · gate 13 ·
`migration: influx` 13 · crime 10 · river 9 · `tier: >= city` 9 · `tier: >= town` 7 · `terrain: forest` 7 · water 6 ·
coast 5 · militia 5 · smaller tails.

**Per pool** (lines / declaring): npcStructure.T 288/35 (all `calm`) · NPC_FACTION_GOALS 108/9 · STRESS_GOALS 80/9 ·
STRESS_GOAL_OVERRIDES 22/5 · NPC_SECRETS 28/0 · CORRUPT_SHORT_GOAL 5/0 · STRESS_INSTITUTION_EFFECTS 190/38 ·
NPC_CRIMINAL_SECRETS 124/9 · SAFE_SECRET_FALLBACK 2/0 · CRIME_LEVEL_OTHER_NPC 8/0 · CAST_REASONS 41/8 ·
CAST_ABSENCES 13/2 · STAKE_REASONS 12/0 · CAST_WANTS 13/0 · STRESS_ECONOMIC_EFFECTS (tie texts) 306/30 ·
NPC_FACTION_LOYALTY 80/19 · NPC_WANTS 56/3 · INSTITUTION_DESC_VARIANTS 664/65 · INSTITUTION_SERVICES 978/49 · the ten
colour pools 0.

### Two corrections to the brief's premises

1. **The siege and famine secrets are not "1 fact-free line in 20".** DEFENSE-2's rewording (`8284242ef`, the
   golden shift record of 2026-11-03) removed every soldier, garrison and wall from STRESS_INSTITUTION_EFFECTS. Fact-free
   rows per key now: under_siege 12/18, famine 15/16. The thin key is `mass_migration` (4/12): nearly every line there
   presumes an INFLUX, and `mass_migration` does not fix the direction. So no siege/famine fallback twin is owed; the
   empty-slot risk is `migration: exodus` under mass_migration (the ruling is the chair's: see open questions).
2. **CAST_WANTS draws by hash (H), not R**: `tonightSheet.js :: castWantOf` picks by `castHash`, no roll.

### Lines probably wrong today (the annotators' reads, PLAUSIBLE until phase B's gate shows them)

- `npcStructure.T`: the `other` category reuses its stable text under corruption / food_crisis / economic_stress /
  contested (`npcStructure.js:387-391`): 24 rows print "in a stable settlement" under a crisis (12 claim calm).
- NPC_FACTION_GOALS Garrison Commander#0 "repair the east wall" (`needs: walls`, no twin).
- STRESS_GOALS monster_pressure#0 "without the garrison they were supposed to have" (`excludes: garrison`, no twin).
- Tie texts with the force word written in, not substituted: "The watch reports", "under the watch's command", "the
  watch … the barracks".
- NPC_WANTS criminal#4 "a dockhand's oilskins" inland.
- Institution descriptions shared across tiers name the wrong tier noun (Fisher's landing#1, Smuggling waypoint,
  Elder Grove Council, Citadel#1, Listening post#1, Rookery#0, Harbour master); hamlet Common grazing land#0 says "the
  village"; River ferry / River boatyard lines can reach a coastal port.
- Services: Citadel "the city's" from town; Veteran's Lodge "village watch / village militia" from village to
  metropolis; Town watch "Gate duty" in an unwalled town.

### Presumptions the vocabulary cannot express (no atom; recorded so they are not lost)

A council merely existing (vs ruling); an overlord ("the lord's court", "the capital", "the crown"); a court or
magistrate; a customs house; a road; a marsh or uplands nearby; a graveyard; a mercenary company; "guard presence" as
one of watch / militia / garrison (needs is a conjunction; the vocabulary has no cross-dimension OR); past events (a
riot, a desecration); season (winter) — ruling 8.

## Units

| # | unit | commit | rows moved, by cause (never re-recorded) |
|---|---|---|---|
| R9 | `reader:possessive-slip`: `generators/npc/guildTitleName.js` | `1e28fbf` (census re-taken through its door, 0 rows) | 17 of 525 golden rows, only `npcs[].title` + its mirror `factions[].members[].title` |
| A | the phase-A ledger | `42f212b` | 0 (docs and scripts only) |
| R8 | `reader:rule-text`: the threshold notes move into the catalogue's registry-only `thresholdNote` | `e152ee2` | 171 of 525, only `institutions[].desc` + its mirror `defenseProfile.institutions.magicDef[].desc` |
| R3 | the tie rule: `domain/roles/roleClass.js` (moved from readerBattery) + the tie step's resolve-after | `596cb8b` | 441 of 525, every path relationship-derived (below) |
| R12 | faction-role-fit: `reader:faction-role-fit` (kind 9) + the assembly seam's re-home | this unit | 272 of 525, every path faction-derived (below) |

### R8 — the wording the chair rules on

Twelve catalogue `desc` notes and 22 variant clauses move off the page. Two variants, once stripped, would have equalled
their canonical, so each takes a short new clause (wording, the chair's to veto): Printing house "Printed books and
broadsheets, struck off by the sheet."; Golem workforce "Constructed servants, put to the heavy work.". Not touched
(outside this lane's pools): `tradeGoodsData.js:532` "Mass-produced texts (if technology exists)" — matched by the same
instrument if printed; Docks "If coastal or river access" (true wherever it prints: the route is required).

### R3 — the tie rule (`domain/roles/roleClass.js`)

One rule, one home: `ROLE_CLASS`, `classOfRole`, `holdsOffice`, `shareTradeOrOffice`, `exemptedVerdict`,
`seatFactions` moved verbatim; readerBattery re-exports them (the test pins identity). `TIE_PRESUMES` names what each
presuming kind needs; `resolveTieKey` keeps a lawful kind byte-identical and resolves a refused one by hash, no roll,
**within its polarity** (the chair's to veto): Professional Rivalry → Unresolved History (so it still seeds its
conflict — the first, polarity-blind cut emptied the one "rich" stride row `recordInvariants.test.js` needs and dropped
6 of 45 stride conflicts); Jurisdictional Tension → Mutual Leverage; Mentor and Successor → respect, debt or family. At
the tie step the seat is unknown (the affiliation is decided later), so the draw is at least as strict as the reader.
`NOBLE_ROLES` moved to `data/nobleRoles.js` so the domain imports no generator (domainGeneratorsBoundary: 2 reds cured).

Draw-count law: soak1k-0..59 — the 12 births with no refused tie are byte-identical; all 48 with one moved. The 60:
exempted fires 160 → **0** (the 19 left are the `[~strict]` column the chair's rule exempts). Golden paths:
`relationships[]` type/typeName/strength/archetypeKey (1,734 refused ties), description/tension/proseVariant (3,527,
the without-replacement tie-prose sequence), `prominentRelationship` (39), `pressureSentence` (3; it quotes the
prominent tie); conflicts 0.

### R12 — faction-role-fit

`FACTION_ROLE_FIT` (religious → clergy; noble → noble or office; military → military; criminal → criminal; other kinds
unrestricted; an unjudged `other` role fits anywhere) and `factionRoleFits` live beside the tie rule. **The faction that
holds or contests the seat also seats office-holders and nobles** (ruling Q1: the seat is one office) — without this the
first cut emptied 11 seats on the 60 (`coh:seat-holder` 0 → 11, STOP; withdrawn before commit).

**The base rate (the 60, read by the new check on the base): 71 factions in 35 settlements seat a misfit.** The seam
(`generators/power/factionRoleFit.js`, at assembly before the faction groups, and the reroll path before canon rides
over) re-homes a misfit by hash to a fitting faction — **bound by the density law** (R18/R20: a faction exists exactly as
long as its roster; every house crewed). The unbound cut reached 0 but broke 7 density-law tests (emptied 26 factions,
unaffiliated 21 NPCs) and was withdrawn. Bound: **71 → 25** (18 settlements); every kept misfit is its faction's last
member or fits no other faction (the property test). soak1k-2401's Priest no longer stands in the Military/Guard's
insurgency cast. Reaching 0 needs a fitting member to exist (a new role or a different roll) — the chair's call.

Draw-count law: soak1k-0..59 — 26 births with no re-home byte-identical; all 34 re-homed moved. Golden paths:
`npcs[].factionAffiliation` (354), `factions` / `factions[].members` (grouping), `conflicts` and its
`powerStructure.conflicts` mirror (parties, desc, plotHooks, intensity) and the coherence receipt's conflict evidence.

## Phase B (2026-11-05)

**Merges taken.** `origin/lane/census-1b-2026-11-04` at `f7e1861` (merge `148731d`; it carries `window-rung2` at
`ebb5136`, so that branch is in too). One conflict, `docs/content/wiring-census.json`, resolved through its door
(`wiring-census.mjs`, `gen:dossier-prose`, both `--check` green).

**Unit B1 — the ledger re-spelled** (`9a879c5`): 177 atoms, mechanically, to `factVocabulary.js` and the chair's
vocabulary rulings (mapping in `docs/census/declarations/VOCABULARY.md`); `tests/lint/census4Ledger.walker.test.js`.
NPC_FACTION_LOYALTY is CENSUS-3's to apply (ruling 7).

**Unit B2 — the stress secrets applied and drawn through `drawDeclared`** (Appendix B item 4). The 32 declaring
pairs of STRESS_INSTITUTION_EFFECTS carry the sibling column (`needs` / `excludes` on the entry objects);
`npcGenerator.js :: generateCrimeLevel`'s secret draw is `drawDeclared(stressEffects, { draw: pickRandom2, … ctx: {
npc } })` — the same one roll over the same pool, resolved after (twin → hash argmax → none, `none` returns no
secret); `enrichNpcCoherence` hands the facts thunk (`factsOf(settlement)`) on the summary. The food pre-filter
(`secretsHeldByFoodRecord`) and the 0.45 gate are unchanged.
- Draw-count law, soak1k-0..59: the 58 births with no refused secret are byte-identical; the 2 with one moved.
- Golden: **0 of 525** rows move (no refusal in the corpus).
- The 60: every class unchanged (STOP on both sides: `coh:crisis-blind-prose` 74, which arrived with the merged
  window's widened instrument, `ebb5136`; not this lane's); `cert:false-presumption` **0**; `declared-share` npcs
  **68 / 199 (0.342)**, from none.
- Red-first: `tests/generators/stressSecretDeclared.test.js` 3/3 red on the merged base, 3/3 green.
- **Pin moved by cause (not re-recorded):** `tests/generators/sentenceSlotFallback.test.js` "soak1k-1248: the secret
  opens on 'Someone'" pins F11's fallback sentence for a one-NPC thorp. The census now refuses the `{npc}` line there
  (`needs: other npc`) and the secret resolves to one that presumes no second person — the `someone` class closed by
  declaration. The pin is the chair's to re-record; it stays red on this lane.
- `typecheck:domain:strict` reds beyond the window's +4 are in 1b's merged files (`factVocabulary.js` +42,
  `composeStateProse.js` +2, `presumptionCheck.js` +1), untouched here.

## Where this seat stops, and where the next starts

Stopped at the boundary rule (context budget), clean and pushed. **Applied:** the stress secrets (item 4). **Ledgered,
not yet applied:** the goals (items 3: NPC_FACTION_GOALS, STRESS_GOALS, NPC_SECRETS; Garrison Commander#0 `needs:
walls` has no twin — the gate will refuse it, the pool's other lines serve, ruling 5), the criminal secrets (item 6,
`factionLeaderSecret.js:110`), the npcStructure registry (T; its 35 lines are `excludes: crisis` and need
`resolveDeclared` at `npcStructure.js:424`), the crisis cast tables (T), the tie texts (H, `createTieProseDraw`: its
draw is without replacement, so resolve-after must keep the `used` counter), the institution descriptions (H,
`assembleInstitutions.js:65/:1004 pickVariant`) and services (the per-definition roll at `institutionServices.js:69/203`
must keep one roll per eligible definition: declare, roll, then drop a refused row at materialization). The next seat
starts with item 3 on this branch's tip, same method: apply the ledger's column, wire the site, byte-identity on the 60,
golden paths, the self-check.

## CENSUS-4b (2026-11-05)

**Merges.** R11 `efb84c0` (`7a07a44`, clean); census-1b at `f82fc62` (`bb6fa12`: readerBattery imports; the
stress-secret site both lanes had wired — 1c's kept, its facts preferring the summary's whole-record facts; a
duplicate `factsOf` import); census-3 at `7af3c67` (`5409262`, answer 4's crime getter: the vocabulary's three
conflicts, two "named-but-refused" pins reconciled to `[]`); census-1b at `d6f8456` (docs). Census re-taken through
its door at each merge; `gen:dossier-prose` and both `--check` green.

| unit | commit | what | golden rows moved (scratch hasher, 525), by cause |
|---|---|---|---|
| 1b | `2dfdd0d` | crisisBlindWidened's 7 goal rows and the instrument's three goal regexes re-anchored to R11's wording (answer d) | 0 |
| 3a | `60d509c` | answer 4: `guild` homed once (`facts/guild.js`: live non-criminal guild on the roster ∨ a guild power); ledger re-spelled | 0 |
| 2 | `b84dc1d` | Appendix B item 3, the goals (below) | 145: Mayor#0 `guild` 84 · Priest#1 `temple` 60 · Healer#0 `tier: ≥ town` 12 · Tavern Owner#0 `hospital` 1 (paths `npcs[].goal.long`/`.short` + the `factions[].members[]` mirror); every refused atom false on the final record, 157/157 |
| 2 fix | `3435fd6` | Guard Captain#1 undeclared (F4's writer already makes it crime-free; soak1k-531) | 0 |
| 3b | `06affd2` | answer 5: the exodus twin pair; answer 3: soak1k-1248's pin re-keyed by cause | 0 (no birth is an exodus) |
| 3c | `09975f2` | the chair's item 2: Mill services "(if water mill)" / "(if saw mill)" → declarations | 0 records; 0 of 1,000 soak pages print them (`on: false` toggle services) |

**The goals (item 3).** The registry's 16 `stable` entries carry `tags: CALM_ONLY` (`no crisis`; R-F 4) — carried,
not yet enforced: the T lookup `npcStructure.js :: enrichNPCsWithStructure` is **CENSUS-1d's** (1c stopped before
it), so the goal claims of `coh:crisis-blind-prose` fall when 1d routes it through `resolveDeclared(…, { tagged:
true })`. Measured: 56 of 190 enriched NPCs in 13 of 60 births are `stable` under a crisis; with no admissible entry
they keep their role goal (no twin owed: the slot never empties). STRESS_GOALS (R, wired): monster_pressure#0 `no
garrison`; mass_migration#0-2 `migration: influx`. STRESS_GOAL_OVERRIDES (T, 1d's): insurgency.mil `watch`,
mass_migration.gov `migration: influx`, slave_revolt.merchant `market`. NPC_FACTION_GOALS (R, wired): the eight
above. `domain/facts/bareLine.js` (R-C): a drawn goal is stored without its declaration column.
**Not declared:** famine#1, indebted#1, slave_revolt#2 (`no ruler: lord / occupier`) — the ruler is decided AFTER
the NPC goal draw, so the birth facts would admit and the final record could contradict (`cert:false-presumption`);
waiting on a draw after the power step. Guard Captain#1 (above). The walls / soldiers / navigable goals 1c's
sibling sets carry.

**Answers.** (1) faction-role-fit: **the 25 accepted** (1,000: 521). The kinds are named in the faction NAMES ("The
Faithful Assembly", "War Council"), drawn in the power step before the roster: re-kinding without renaming
contradicts the name; renaming is a new name draw at the ⚠ faction-name retry (a roll change, 1d's site); re-homing
is already bound by the density law. By tier on the 60: city 8 · metropolis 8 · town 6 · village 2 · thorp 1. (2)
recorded above (R3). (3) re-keyed. (4) `guild` homed; `organised crime` by 3b's merged getter. (5) THE CHAIR'S
RULING, the twin: "Diverted the coin meant to keep the departing families here into a private arrangement, and the
shortfall is being blamed on the families who left" / "More households go every week for want of it. The blame is
holding, for now" — share 0 at birth (`STRESS_TYPE_MAP.mass_migration.direction` = influx), 1/6 of secret draws
under a pulse exodus.

**The 1,000, before (`5409262`) → after (`06affd2`):** every class identical — coh:crisis-blind-prose 791 → 791
(claims: current stability 538, competent administration 93, stable institutional competition 82: the T lookup is
1d's), reader:faction-role-fit 521 → 521, relation-types 212 → 212 (the `[~strict]` exempt column), A-12 18 → 18;
`cert:false-presumption` **0 → 0**, no `cert:*` finding; `declared-share` npcs **0.038 → 0.057** (1,481 → 2,260 of
~39,400), institutions / services 1.0 (render-time only). The 60 at the merged base: crisis-blind 65, faction-role-fit 25.

**Tests.** The generator suite at the tip: 49 reds in 25 files, every one red on the merged base too (pipeline
pinned-choosers, data-flow contracts, institution budgets, captureBirthScale, …: the merged lanes'); the two tip-only
reds were cured in-lane (soak1k-531; the twin's count). domain:strict: composeStateProse +2, crisisFactFindings +4
(merged lanes'). The chair's item 3 (calmFactsDouble): no tip red reads a mute pool, so not merged.

**Where CENSUS-4c starts:** unit 4 — the remaining NPC pools (stakes, impressions, ties incl. the tie rule's texts,
`createTieProseDraw`'s without-replacement counter), then INSTITUTION_DESC_VARIANTS (H, `assembleInstitutions ::
pickVariant`) and the rest of INSTITUTION_SERVICES (the per-definition roll) — tags in the tables, the tolerance at
each consumer, 1d's wiring.

## CENSUS-4c (2026-11-05)

**Merges** (each clean; the wiring census re-taken through its door, stamp only, 0 rows; `gen:dossier-prose --check`
green): census-1b at `c456d1b` (`e2f34a4`: 1d unit 1, R-H, and sites 89/90/111), `fc38e11` (`be761f9`: sites 97–103,
110), `ca14125` (`0aa20a4`: site 94 and unit 3's two registers), `7dc90a6` (`e3e70fc`: 1d's record). The local branch
ref had been left at `83325f5` with HEAD detached at `11bacee`; it was re-pointed to HEAD (an ancestor check first)
before the first push.

| unit | commit | what | golden rows moved (525, scratch hasher) |
|---|---|---|---|
| 1 | `727d8a3` | answer 3: `isCommerceGuild` and its detector chain move verbatim to `domain/institutions/institutionCategory.js`; `roleCategory.js` / `computeActiveChains.js` re-export; `facts/guild.js` delegates its roster reading | 0 (and 0 of 60) |
| 4 | `99fbe26` | the ties declare in place (30 rows); stakes and impressions read | 0 (and 0 of 60) |
| 5 | `cd17614` | the institution descriptions (62 rows, a text-keyed column) and services (49 rows, in place) declare | 0 (and 0 of 60) |

**Unit 1 (answer 3).** Measured first: the delegated atom agrees with the regex home on all 585 records (303 hold a
guild; 0 disagree). The power-structure branch (a guild FACTION by name) stays in `guild.js`: the power structure
carries names, not catalogue rows, and no other reader of a guild power exists. A guild-tagged house not named
"guild" (Furrier's district) now holds the atom — it already drives a guild master.

**Unit 4 — the NPC pools.**
- **Ties** (`STRESS_ECONOMIC_EFFECTS`, 18 archetypes, 288 desc/tension lines + 18 labels; site 19, H). The variants
  are closures, so a declared one is `{ line: closure, needs?, excludes? }`; `pairProse` accepts both (`closureOf`,
  byte-identical) and exposes `lines` (frozen, index order) for 1e's resolution. ⚠ One index picks the desc AND the
  tension: a refusal of either row refuses the pair. Every tie draw is in `generatePopulation`.
- **Stakes.** The stress secrets' stakes are 4b's entries (B2). crisisCast `STAKE_REASONS` (12): each is chosen by
  the exact condition it states — key-guaranteed, 0 declare.
- **Impressions** (`NPC_PLOT_HOOKS`, 1c's site): 28 impressions + dispositions + behaviours re-read — pure colour,
  pending a register (1d's two registers cover the state-prose corpus only, not the generator's tables).

**Unit 5 — the institutions.**
- **Descriptions** (664 lines / 332 pairs / 518 keys; site 18, H, `assembleInstitutions` pickVariant): the ledger's
  65 declaring rows less 3 (R-Q) in `DESC_VARIANT_DECLARATIONS`, keyed by exact text — the shape R-P(3) accepted
  for the sibling sets, chosen because six string consumers read the pairs (the ship filter, `shipFreeDesc`, the
  tier-noun walkers, the dossier corpus, the ledger extractor). The texts are unique across pairs; the test holds
  every key live. 1e lifts a drawn text to `{ text, ...column[text] }` and resolves after the draw.
- **Services** (978 definitions; site 15, R, one roll per eligible definition in `economyReconcilePass`, then
  printed whole): 49 rows in place on the definition objects (none shared between institutions). The two canonical
  texts of 1c's `SERVICE_DESC_SIBLINGS` carry a superset of their sibling row's atoms (pinned).
- **R-M:** nothing left in either table's prose. "Gates (if walled)" is a catalogue KEY (an institution name).

**R-Q, measured (the rule's check per pool).** Each declared row's admission at its draw (the ctx at the draw step,
via `onStep`) against the birth record, only on births where the row's pool is reachable, 525 golden + the soak:

| pool | draw step | rows | births | rows that differ | verdict |
|---|---|---|---|---|---|
| ties | `generatePopulation` (after `generatePower`) | 30 | 585 | 0 | all declare |
| descriptions | `assembleInstitutions` | 65 | 1,525 | 3 (4 births: soak1k-291, -453, …) | 62 declare; **waiting on order:** town Parish burial grounds #0, Town watch #0/#1 (`gate`: the cascade adds a town's gate after the draw; every case draw-refuses / birth-admits) |
| services | `economyReconcilePass` | 49 | 1,525 | 0 | all declare |

**Waiting on order (the chair's answer 1):** STRESS_GOALS famine#1, indebted#1, slave_revolt#2 (`no ruler: lord /
occupier`) — R11b's register rewrite is their cure. Measured beside the ties: the ruler kind is ALREADY settled
before `generatePopulation` (0 of 585 differ between that step and birth); the goal draw is handed
`birthFactsOf({ institutions, config, tier })`, which carries no power structure. So the order is not the obstacle;
the facts handed to the draw are (open question 1).

**Faction-role-fit:** the 25 on the 60 (city 8, metropolis 8, town 6, village 2, thorp 1) ACCEPTED, the chair's
ruling of 2026-11-05 (the faction name carries its kind; a rename is a new roll at the name retry).

**⚠ Unit 1 moves 3 of 1,000 soak births (0 of 525 golden, 0 of the 60) — one cause, counted, not re-recorded.**
soak1k-236, -320, -452 (all villages): the only "guild" is the catalogue's `guild` TAG on a Village scribe or a
Veteran's lodge. The generator's `isCommerceGuild` reads that tag (and already crews a Guild Master there); the
regex home did not. Now that the atom has one definition, Mayor#0's drawn goal ("Navigate a dispute between two
powerful guilds…", `needs: guild`) is admitted instead of resolved by argmax. Paths: `npcs[].goal.long` + the
`factions[].members[]` mirror. The byte-identity law was proven where the brief asked (525 + 60); the 1,000 shows the
tail. The admitted claim is arguably false (a scribe is not two powerful guilds), so the defect is the one
definition's tag arm (open question 2).

**The 60 and the 1,000 as a diff (R-B).** BEFORE = `11bacee` + census-1b `7dc90a6` (a scratch merge, none of this
seat's units); AFTER = the tip. `cert:*` findings: **none on either side** (`cert:false-presumption` 0 → 0).

| class (settlements) | the 60 | the 1,000 |
|---|---|---|
| coh:crisis-blind-prose | 22 → 22 | 231 → 231 |
| — "current stability" / "competent administration" / "stable institutional competition" | 11 / 1 / 4 → same | 119 / 21 / 33 → same |
| reader:faction-role-fit (accepted) | 18 → 18 | 348 → 348 |
| reader:relation-types (the exempt column) | 10 → 10 | 147 → 147 |
| A-12:self-vouch-false | 0 → 0 | 18 → 18 |
| rule-text · possessive-slip | 0 → 0 | 0 → 0 |
| every other class | identical | identical |
| `declared-share` npcs | — | 2,121 / 39,351 → 2,124 / 39,351 (0.054; the +3 are the three births above) |
| `declared-share` institutions · services | — | 1 / 1 → same · 115 / 115 → same |

The goal claims did not fall: 1d stopped at its boundary before the `npcStructure` registry lookup (CENSUS-1e's
now). The figures are lower than 4b's (538 / 93 / 82) because R-H and 1d's sites merged in between. The ties, the
descriptions and the services are not yet wired (1e: sites 19, 18, 15), so none of their declarations reach the render
ledger; the declared share moves only when 1e enforces them.

**Rows moved, by cause:** golden 0 of 525 (all units); soak records 3 of 1,000 (unit 1, above); wiring census: the
stamp at each of the four merges, 0 rows; no manifest row, no pin. Nothing re-recorded.

**Tests.** Each unit's governing suites: the same reds on the base and the tip (unit 1: 17, unit 4: 8, unit 5: 26;
golden master, the prose walkers, generationForkCensus, pipelinePinnedChoosers… — the merged lanes'). domain:strict
only the merged composeStateProse +2 / crisisFactFindings +4.

**Open questions for the chair.**
1. The three ruler-excluding goals: the ruler kind is settled before `generatePopulation` (0 of 585 differ). Should
   1e hand the goal draw the power structure (`birthFactsOf` + `powerStructure`, no draw moved) so they can declare,
   rather than wait on R11b?
2. The one guild definition's TAG arm (Village scribe, Veteran's lodge, town crier, mint carry `guild`) crews false
   Guild Masters and now admits guild claims in villages (3 / 1,000). Drop the tag arm (a generator change; it moves
   births) or retag the catalogue?
3. `Bowyers & fletchers (guild)|Military supply` needs garrison AND militia; that never holds (0 of 558 births), so
   1e's materialization filter will drop it everywhere. A twin in the force-word form ("…to the {force}")?
4. `Palisade or earthworks|Gated entry` / `|Night watch` are refused in every birth they reach (`gate` 0 of 117,
   `watch` 0 of 30). Should a palisade's own entry read as a gate (a fact-home question, R-E)?

**Where CENSUS-4d starts.** This lane's tables are all declared (NPC goals and secrets with 4b; ties, descriptions,
services here). What remains is enforcement, which belongs to CENSUS-1e (sites 19, 18 and 15 and the `npcStructure` lookup):
merge 1e's tip, re-measure the goal claims and the declared share, and count births by cause as each site lands. No
further table work is owed here unless the chair rules on questions 1–4.

## CENSUS-4d (2026-11-05)

**Merges.** census-1b at `1c00ed2` (a fast-forward: 1e had already merged 4c's tip; no merge commit; the wiring
census verified through its door, stamp unchanged); census-1b at `f2367a4` (`a432465`, clean: 1e unit 2's
STRESS_GOAL_OVERRIDES, threatProfile, DEFENSE_CONTEXT and its FACTION_DESC_SIBLINGS R-Q cure). Each: `wiring-census
--check` (709 / 2324 / 165) and `gen:dossier-prose --check` green. ⚠ The checkout had HEAD detached and the local
branch ref stale at `83325f5` again (4c met the same); after an ancestor check the ref was re-pointed and checked
out before the first push. Sites 19 / 18 / 15 are **not** on 1e's tip at 04:45Z, so step 3 did not run.

| unit | commit | what | golden (525) | soak records (1,000) |
|---|---|---|---|---|
| 1 | (the ff merge) | the registry goal lookup arrives; re-measure | — (1e's) | 345 vs 4c's tip, three causes, all merged: the registry goal lookup 234 (`npcs[].goal.short`, `structuralPosition`, `activeConstraint`, `settlementCondition`, `structuralRank` + the member mirror); 1e's `SAFETY_LINE_SIBLINGS` 111 (`economicState.safetyProfile`); `FACTION_DESC_SIBLINGS` 29 (`powerStructure.factions[].desc`, `recentConflict`, `pressureSentence` 3) |
| 2a | `aa76fb4` | answer 1: the three council goals declare `excludes: ruler: lord, ruler: occupier`; the goal site is handed the ruler kind | 0 | (first cut, withdrawn by 2a fix) |
| 2a fix | `6c66e38` | the site hands `{ government }` only | 0 | **20** (2a + fix vs base): `npcs[].goal.long` 20 / `.short` 16 + the member mirror |
| 2b | `fa39513` | answer 2: the catalogue's `guild` tag leaves the village scribe, crier, mint and veterans' lodge | **142** (city 61, metropolis 78, town 3) | **333** |
| 2c | `1abf16d` | answer 3: the bowyers' "Military supply" → "to the local guard", `needs: guardPresence` | **212** | **346** |

**Unit 1 — the goal claims, re-measured** (the 1,000; 4c's tip → this merged base): "current stability" **119 → 0**,
"competent administration" **21 → 0**, "stable institutional competition" **33 → 0** (every claim, every crisis
kind); `coh:crisis-blind-prose` 231 → 35 (left: "food secure under mass_migration" 32 — R-P(1), CENSUS-2c's; "pilgrims
queue patiently" 3). The 60: 22 → 2. The base also carried `cert:false-presumption` **8** (24 occurrences, all
`rulingStructure:FACTION_DESC_SIBLINGS #1 'no militia'`, 1e/5b's) and `A-12` 18 → 3; neither this lane's.

**Unit 2a (answer 1, R-V).** `birthFactsOf` takes `powerStructure` and forwards it to `factsOf`; the goal site passes
`{ government: config._government }` (`npcConfig._government`, beside `_dominantFaction`). ⚠ **The first cut handed
the whole power structure** and lit `guild.js`'s guild-POWER branch at the draw: a guild faction is NOT settled there
(the density law can empty it), so Mayor#0's `needs: guild` goal was admitted in soak1k-224, -842, -878 and failed the
self-check (`cert:false-presumption` 8 → 11). Caught on the unit's own 1,000 before the next unit; the fix hands
only the measured fact. Lesson for R-V: hand the ONE measured field, never the container. Base: 28 NPCs in 16 births
printed a council goal under a lord (0 under an occupier); at the fix: 0.

**Unit 2b (answer 2, R-X).** Retagged at the catalogue; `isCommerceGuild` untouched. Of 4c's three births,
**soak1k-236 and -320 revert** (no guild atom, no Guild Master); **soak1k-452 does not**: it also holds a "Merchant
Guilds" faction, so the atom holds by the record (4c's "the only guild is the tag" was wrong for 452) — only its
scribe's Guild Master goes. Soak, by path: `institutions[].tags` 333; the Guild Master's chosen house
(`filterByGuild`'s one pick over fewer candidates: `npcs[].title` / `.institution` + mirror) 168;
`simulationTrace[].downstreamEffects` 48; **7 villages lose a false Guild Master** (soak1k-236, -320, -452, -512,
-668, -752, -866; the slot refills, the roster count holds; the downstream NPC sequence moves). Golden: tags 142,
Guild Master's house 92, trace 9. The red-first was run on `1c00ed2` (the catalogue is identical at `6c66e38`; the
commit body names the latter).

**Unit 2c (answer 3, R-W).** Golden 212 / soak 346: `availableServices.equipment[].desc`, and the record battery's
false `battery.defense-words` "garrison without a garrison" on the old text gone (golden 40, soak 62 receipts; 15
judgment statuses). The phase-A ledger row follows the table.

**Answer 4 (a palisade is not a gate):** listed, no change; a line that wants a palisade's opening declares
`palisade` with its own wording.

**The 60 and the 1,000 as a diff (R-B).** BEFORE = the merged base `1c00ed2`; MINE = `1abf16d` (units 2a–2c, no
second merge); AFTER = the tip `a432465` (+ 1e's `f2367a4`).

| class (settlements) | the 60 before → after | the 1,000 before → mine → after |
|---|---|---|
| goal claims (current stability · competent administration · stable institutional competition) | 0 · 0 · 0 → same | 0 · 0 · 0 → same → same (4c's tip: 119 · 21 · 33) |
| coh:crisis-blind-prose | 2 → 2 | 35 → 35 → 35 |
| reader:faction-role-fit (accepted) | 18 → 18 | 348 → 348 → 348 |
| reader:relation-types · rule-text · possessive-slip | 10 · 0 · 0 → same | 147 · 0 · 0 → same → same |
| **A-12:self-vouch-false** | 0 → 0 | **3 → 4 → 4** (see below) |
| cert:false-presumption | 0 → 0 | 8 → 8 → **0** (1e's cure, `f2367a4`) |
| every other class | identical | identical (info:battery-would-not-vouch 691 → 676: the bowyers' false finding) |
| `declared-share` npcs | 153/2,584 → 180/2,658 | 2,361/41,732 (0.057) → 2,624/41,731 (0.063) → 2,830/42,932 (0.066) |
| `declared-share` institutions · services | — | 1/1 · 115/115 → same (sites 18 / 15 not wired) |

**⚠ The one rise, A-12 3 → 4, is an unmasking (CONFIRMED on the birth).** soak1k-573: at 2b its receipt did not vouch
(the bowyers' false `defense-words` finding); at 2c that finding is gone, the receipt vouches, and the page also
carries "Food Secure." under the migration — the instrument row R-P(1) rules a false reading (the food record counts
the influx) and assigns to CENSUS-2c to retire. All four A-12 at the tip (284, 573, 648, 988) are that one row; they
fall to 0 when 2c retires it. Not reverted: the reworded line is the ruling's and true.

**Rows moved, by cause (nothing re-recorded):** golden 2b 142 + 2c 212 (row sets overlap; one cause each); soak
records 2a 20, 2b 333, 2c 346; no manifest row; wiring census: 0 rows (stamp unchanged at both merges); pins: none
(the defence-reach fixture quotes the old bowyers sentence as a string and stays).

**Tests.** New: `tests/generators/stressGoalRulerDeclared.test.js` (7), `tests/data/catalogGuildTag.test.js` (7),
`tests/data/bowyersMilitarySupply.test.js` (2), each red-first. Governing suites: 2b 67 files, the same 13 reds base
and tip; 2c 59 files, the same 43. At the tip the nine declaration suites of this lane and 1e's goal lookup pass
(33/33). typecheck:ratchet 167/167; domain:strict only the merged composeStateProse +2 / crisisFactFindings +4.

**Open questions for the chair.**
1. A-12's four births are R-P(1)'s instrument row (CENSUS-2c): confirm the rise is read as the unmasking, not a STOP.
2. Two more catalogue rows carry `guild` beside a military tag and are not guilds by their text: Hired blades
   (`military, guild`) and Contract killer (`guild, military`, criminal — `isCommerceGuild` already refuses the
   criminal group). Customs house, Auction house, Assay office carry it too ("run by royal or municipal officials").
   Retag under R-X (the catalogue's owner, this lane), or leave?
3. R-V's rule, as learned in 2a: should the vocabulary doc say a site is handed the measured FIELD, never the
   container (a container carries unsettled siblings)?

**Where CENSUS-4e starts.** The tables are declared and answers 1–3 applied. What remains is 1e's enforcement of
sites 19 (ties), 18 (descriptions) and 15 (services): merge 1e's tip when they land, re-measure the ties,
descriptions and services (`declared-share` institutions / services from the render ledger; births by cause —
the bowyers' line will then print only where a guard stands, which is every golden birth that holds the guild), and
take the 1,000 as a diff against `a432465`. The 3 description rows "waiting on order" (R-Q) stay.
