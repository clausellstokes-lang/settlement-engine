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

## CENSUS-4e (2026-11-05)

**Merge.** census-1b at `e35d60b` (CENSUS-1f: sites 19 `d422a8d`, 18 `1e71261`, 15 `9eee701`; the arrival redraw
`f6ec896`; 3a; the census-2/census-3 merges): a **fast-forward** of `f8c92c9` (no merge commit). The local branch ref
was stale at `83325f5` with HEAD detached for the third seat running; after an ancestor check it was re-pointed and
checked out. `wiring-census --check` (709 / 2338 / 165) and `gen:dossier-prose --check` green. The container had no
`node_modules`: `npm ci` (lockfile untouched). **R-Z's sentence is not on 1f's tip** (no "container" rule in
`docs/census/declarations/VOCABULARY.md` or the rulings doc); it stays 1f's (answer 3).

| unit | commit | what | golden (525) | soak records (1,000) |
|---|---|---|---|---|
| 1 | (the ff) | 1f's three sites arrive; re-measured on the 1,000 | — (1f's: 24 · 145 · 74) | 570 (below) |
| 2 | `25145f1` | answer 2 (R-X): `guild` leaves Hired blades, Contract killer, Customs house, Auction house, Assay office | **183** | **368** |

**Unit 1 — the three wired sites, re-measured on the 1,000** (1f counted the 525 and the 60). Records diffed on the
clean first-parent chain `fe7bb1d` → `9eee701` (only the three site commits between), and every refusal logged at the
tip by an instrumented scratch copy of `drawDeclared` (the repo's module untouched):

| site | births moved (`fe7bb1d` → `9eee701`) | refusals at the tip (births / draws) | resolution | the refused atoms |
|---|---|---|---|---|
| 19 ties (H) | 109 | 109 / 392 | argmax 392 | `no ruler: lord` 373 · `garrison` 13 · `market` 6 · `watch` 4 · `institution: granary` 1 |
| 18 descriptions (H) | 238 | 242 / 283 | argmax 282 · twin 1 | `terrain: forest` 131 · `river` 76 · `tier: ≤ hamlet` 25 · `militia` 25 · `coast` 13 · `tier: ≥ city` 9 · `market` 3 · `walls` 1 |
| 15 services (R) | 381 (436 services not materialized, 0 added) | 384 / 445 | none 436 · twin 9 | `gate` 225 · `tier: ≤ village` 119 · `watch` 46 · `tier: ≥ city` 25 · `walls` 9 (the twins) · `institution: temple` 9 · `militia` 6 · `river` 6 |

570 births moved in all; 8 of them also move outside the three parts, every one a downstream mirror (the walls-desc
mirror `defenseProfile.institutions.walls[].desc` 3, `pressureSentence` 1 quoting the prominent tie, and 4 coherence
receipts that lose a false `battery.defense-words` "soldiers without a garrison" finding when a refused veterans'
service stops printing). The tip's descriptions read 242 (not 238): 2e/3e merged between. **The bowyers' "Military
supply" (`needs: guardPresence`, 4d's R-W):** 346 births hold a Bowyers service and all 346 print it; refused **0** —
every birth that holds the guild stands a guard (the brief's expectation, CONFIRMED). The 3 description rows "waiting
on order" (R-Q: town Parish burial grounds #0, Town watch #0/#1, `gate`) stay undeclared.

**Unit 2 (answer 2, R-X).** The five rows retagged at the catalogue, each keeping its other tags; the readers
(`isCommerceGuild`, `historyGenerator.js`, `upgradeOpportunities.js`, `facts/market.js`) untouched. Golden 183:
`institutions[].tags` 183, the Guild Master's chosen house (`npcs[].title` / `.institution` + the member mirror) 114,
`simulationTrace[].downstreamEffects` 31. Soak 368 (town 51, city 156, metropolis 161): tags 368, the Guild Master's
house 165 (every other NPC field identical), trace 43; Guild Masters gained or lost **0**, roster sizes **0**.
Red-first `tests/data/catalogGuildTag.test.js` (the 4e block) 6/6 red, 13/13 green; the 40 governing files: the same
6 pre-existing reds base and tip.

**The 60 and the 1,000 as a diff (R-B).** BEFORE = `a432465`; MERGED = `e35d60b` (1f's tip); AFTER = the tip `25145f1`.

| class (settlements) | the 60: merged → after | the 1,000: before → merged → after |
|---|---|---|
| goal claims (current stability · competent administration · stable institutional competition) | 0 · 0 · 0 → same | 0 · 0 · 0 → same → same |
| coh:crisis-blind-prose | 0 → 0 | 35 → 0 → 0 (2c/2e's retirements and declarations, merged) |
| A-12:self-vouch-false | 0 → 0 | 4 → 0 → 0 (2c's row retirement, merged: 4d's unmasking read as R-AG said) |
| **A-11:sea-words-landlocked** | 0 → 0 | **0 → 1 → 1** — soak1k-152, "A basket of fish, still flapping…" (`arrivalProse.js`, fish beat); bisected to 1f unit 2 `f6ec896` (0 at `2b31f33`, 1 at `f6ec896`); not this lane's, at the same count base → tip |
| reader:faction-role-fit (accepted) | 18 → 18 | 348 → 348 → 348 |
| reader:relation-types · rule-text · possessive-slip | 0 · 0 · 0 → same | 0 · 0 · 0 → same → same |
| reader:hook-pools · daily-life-placeholder | 3 · — → same | 108 · 495 → 70 · 0 → same (merged) |
| every other class | identical | identical (A-05 977, battery-would-not-vouch 676, A-09 8) |
| cert:* (incl. `cert:false-presumption`) | none → none | none → none → none |
| `declared-share` npcs | 333 / 2,658 → same | 2,830 / 42,932 (0.066) → 5,156 / 42,932 (0.120) → same |
| `declared-share` relationships (the ties: the draws the self-check re-asserted at site 19) | 149 / 1,356 → same | — → 2,077 / 21,528 (0.096) → same |
| `declared-share` institutions (site 18) | 120 / 246 → same | 1 / 1 → 2,168 / 4,215 (0.514) → same |
| `declared-share` services (site 15) | 116 / 3,435 → same | 115 / 115 → 1,965 / 55,655 (0.035) → same |

`cert:false-presumption` 0 with 21,528 + 4,215 + 55,655 ledger draws re-asserted at the three sites (the services'
`none` resolutions are not noted, by `drawDeclared`'s rule). Unit 2 moves no class and no share on either corpus.

**Rows moved, by cause (nothing re-recorded):** golden unit 2 183 (one cause); soak records unit 2 368; unit 1's 570
are 1f's (counted above, 1f's to own); wiring census 0 rows (verified, stamp unchanged); no manifest row; no pin.

**Tests / gates.** eslint 0; typecheck:ratchet OK; domain:strict only the merged crisisFactFindings +4 /
composeStateProse +2.

**Open questions for the chair.**
1. A-11 soak1k-152: 1f unit 2's arrival redraw admits the undeclared fish beat "A basket of fish, still flapping…" in a
   landlocked birth — the sibling lines there declare `navigable`; this one is 1f's / 2b's table to declare (or the
   instrument's to read freshwater fish as lawful).
2. R-Z's sentence is not yet in the vocabulary doc at 1f's `e35d60b`.

**Where CENSUS-4f starts.** Nothing of the NPC lane remains but the compose: every table is declared, every site this
lane's tables feed is enforced (19 / 18 / 15 by 1f; the goal registry by 1e), and the chair's answers are applied. The
compose re-takes the registers (R-T) and reads A-11 against 1f.

## CENSUS-4f (2026-11-05)

**Merges.** census-1b at `d2b1ab0` (merge `86cc1e3`: 1g's R-AO, R-AM, R-AJ) and at `e8b0072` (merge `04e36ff`:
1g unit 4 = R-AL, 2b, unit 5 = unit 3c's declared columns and `tablePools`, its record). Both clean; `wiring-census
--check` and `gen:dossier-prose --check` green at each (709 / 2338 / 165, stamp unchanged). The local ref was stale at
`83325f5` with HEAD detached for the fourth seat running; ancestor-checked and re-pointed before the first push.
`npm ci` (lockfile untouched).

| unit | commit | what | golden (525) | soak (60 / 1,000) |
|---|---|---|---|---|
| 1 | `86cc1e3` | the merge; census through its door; the 60 as the merged base | — | — |
| 2 | `3cb9861` | the `Military/Guard` label declares `guardPresence` (twin "Military Party"), **carried** | 0 | 0 / 0 |
| 3 | (read only) | R-AM on this lane's pools | — | — |
| 4 | (measured, not applied) | R-AO `colour` marks | — | — |
| 6 | `501f0be` | NPC_WANTS's three ledgered declarations applied, **carried** (found by unit 3) | 0 | 0 / 0 |

**Unit 2 — the five `[guard]` labels (the chair's ruling of 07:2x).** All five print ONE string: the faction label
`Military/Guard` that `rulingStructure.js :: generatePowerStructure` pushes by the military priority and the tier
(soak1k-110, -462, -470, -614 as a conflict party "X vs Military/Guard"; -571 as the revolt instigator's house — the
brief's -614/-571 roles are swapped). The label is a declared row in `src/data/factionLabelSiblings.js`
(`needs: guardPresence`), its twin **"Military Party"** (`excludes: guardPresence`) — THE CHAIR'S RULING (R-G): it keeps
"Military", so `inferFactionCategory` and every `includes('military')` reader (factionDynamics, history, narrative, NPC
placement) read the same kind, and names no body. **It is carried, not resolved, because the fact is not settled
where the label is pushed** (R-AN), measured on the 1,000 through `onStep`: 363 births hold the label; `guardPresence`
differs between the power step and the final record in **1** (soak1k-331: no guard at the power step, a militia
after). The name is then copied into conflicts, affiliations and prose (~20 prints per birth: the power tab, PDF,
Foundry, the NPC table, the crisis cast), so curing only the plot-hooks print would game the instrument.
**Listed for the mechanism lane:** resolve `FACTION_LABEL_SIBLINGS` after the roster settles, against the final record,
reaching every copy of the name. Would-be share: **12 of 1,000** births (12 of 363 holders: soak1k-110, -236, -247,
-260, -326, -446, -462, -470, -571, -614, -674, -776; the instrument reads 5 of them — the other 7 carry a guard-like
role on the roster or print no hook). `[guard]` therefore stays **5 → 5** on this lane.

**Unit 3 — R-AM on this lane's pools.** `cert:false-presumption` at the merged base: the 60 42 settlements / 123, the
1,000 711 / 2,134 — **none on a pool of this lane** (the ties, descriptions, services, goals, stress secrets). By pool:
`rulingStructure:FACTION_DESC_SIBLINGS #0 'garrison'` 628 / 1,884 (CENSUS-5d's reword `1b74763` and 1g's 2b, merged
second: 0 at the tip) and `foodBalance:OUTLOOK_HOOK_SIBLINGS` 161 / 250 (CENSUS-3d's table, lane 3's). **But the zero is
partly blindness:** two of this lane's R draws were never wired and their ledgered declarations never applied, so the
self-check cannot see them. Measured on the 1,000 (final record): NPC_WANTS "a dockhand's oilskins…" false in **48 of
81** prints, the shrine vestments 17 / 151, the guild colours 2 / 146 → unit 6; NPC_CRIMINAL_SECRETS' 12 ledgered rows
false 0–12 per line (military#4 "skimming from military supply budgets" 12 / 67, religious#0/#1/#3 8–9 each) → NOT
applied: the secret TYPE is weighted by the roster's institutions, not the holder's role, so a religious secret
("Lost their faith completely but maintains the role") presumes a CLERIC holder — no atom — and the ledger's
`institution: temple` would refuse true lines and admit false ones. Waiting on a re-read (CENSUS-4g).

**Unit 4 — R-AO, measured, not applied.** The brief's premise that the register falls by the marked lines does not hold
for this lane's three named tables. The undeclared register (`statePools`) counts the dossier state prose only; the
census's `tablePools` (unit 3c, merged) enrols this lane's tables but walks strings and `{ text }` rows in place: the
catalogue descriptions keep their declarations BESIDE the table (`DESC_VARIANT_DECLARATIONS`, six string consumers read
the variants), the tie prose is closures (not walked), and the goals are `{ short, long }` objects (a `colour` flag on
one leaves its `short` and `long` counted). So the mark lowers **0** rows there until 1h's "`tablePools`' second half"
(read declarations held beside a table) lands — then the lane marks `colour` in the beside-column with no consumer
change. Also: `isColourLine` has no reader outside `tablePoolRow`, and marking any table moves the census
(`--check` stale; the re-take is the compose's, R-T). Phase A recorded the colour split per line only for the tie prose
(267 of 276 no-atom rows) and the wants (53 / 53); the other pools' no-atom rows (descriptions 599, services 929, goals
99 + 71 + 17, secrets 152 + 115 + 28) mix "presumes nothing" with "presumes a fact with no home" and need a re-read
before any mark — never marked unread.

**Unit 6 — NPC_WANTS (this lane's leftover).** `{ text, needs }` in place: docks · guild · sacredHouse (religious#4
re-read under R-AE: the shrine a priest serves is a sacred house, not a temple; the ledger row follows). The draw
`npcGenerator.js :: generateNPCAppearance` (R, bespoke, not wired) reads its pick through `textOf`. **Listed for the
mechanism lane** with unit 2's site. A test reader corrected by the same cause: `terrainPoolsHookLines` read the
declaration column as prose (`needs: ['docks']` a "wet line"); it now skips the column (the wet set it reads is
identical to the base's, 2 lines).

**The 60 and the 1,000 as a diff (R-B).** BEFORE = the merged base `86cc1e3` (unit 2 is byte-identical to it);
AFTER = the tip `501f0be` (with 1g's second merge).

| class (settlements) | the 60 | the 1,000 |
|---|---|---|
| goal claims (current stability · competent administration · stable institutional competition) | 0 · 0 · 0 → same | 0 · 0 · 0 → same |
| `coh:*` · `A-12` | 0 → 0 | 0 → 0 |
| `reader:hook-pools [guard]` | 0 → 0 | **5 → 5** (carried; the mechanism lane's resolution) |
| `cert:false-presumption` | 42 → 10 | 711 → 161 — none of this lane's: FACTION_DESC 628 → 0 (1g 2b, merged), OUTLOOK_HOOK 161 → 161 (lane 3) |
| `reader:tension-memory` | 4 → 4 | **60 → 61** — soak1k-976 "collaborators and resisters continued…", 0 at `3cb9861`, 1 at the tip: the second merge (1g's R-AL history change), not this lane's |
| reader:faction-role-fit · relation-types · validation-on-page · A-05 · A-09 · A-11 | identical | identical (348 · 147 · 985 · 977 · 8 · 1) |
| other `cert:*` | none | none |
| `declared-share` npcs · relationships · institutions · services | 333/2,658 · 149/1,356 · 120/246 · 116/3,435 → same | 5,156/42,932 (0.120) · 2,077/21,528 (0.096) · 2,168/4,215 (0.514) · 1,965/55,655 (0.035) → same |
| `declared-share` power (1g 2b's eager `said()` no longer ledgered) | 252 → 72 drawn, share 1 | 4,424 → 1,424, share 1 |

**Rows moved, by cause (nothing re-recorded):** golden 0 (units 2 and 6); soak records 0 of 60 (both units; the 1,000
diff above is 1g's second merge); wiring census: unit 6 moves the `tablePools` row `npcData.NPC_WANTS` (undeclared
56 → 53; lineDeclares docks, guild, sacredHouse; `--dry`: tablePools only, +72 bytes, 0 state rows, no stamp) — it
reds the census interlock (`proseWiringCensus.walker` "the committed census is byte-identical to a fresh build" and
"THE DRY READ"), the compose's re-take (R-T); no manifest row; no pin.

**Tests / gates.** New: `tests/data/factionLabelSiblings.test.js` (4), `tests/generators/npcWantsDeclared.test.js` (2),
each red-first. Governing suites: unit 2 31 files, the base's 38 reds title for title; unit 6 55 files, the base's 47
plus the two census-interlock reds. eslint 0; typecheck:ratchet 167/167; domain:strict only the merged
crisisFactFindings +4 / composeStateProse +2.

**Open questions for the chair.**
1. Unit 2: confirm "Military Party" as the label's twin, and that the label resolves after the roster settles (a
   mechanism-lane site: a late record pass that renames every copy, or a display read model) rather than at the push.
2. Unit 4: confirm the marks wait on 1h's `tablePools` second half, and that the no-atom rows of the descriptions,
   services, goals and secrets are re-read before any mark.
3. NPC_CRIMINAL_SECRETS: the religious and military secrets presume the HOLDER's role, which no atom carries; reword
   under R-U, key the type by the holder's role (a roll change), or declare `ctx` the way the stress secrets' `{npc}` does?
4. Should the census interlock's two reds be re-taken on this lane (unit 6's own declarations), or left for the compose?

**Where CENSUS-4g starts.** Not nothing: (a) the criminal secrets' re-read and carry (question 3); (b) once 1h reads
beside-columns, the R-AO marks after the re-read; (c) re-measure `[guard]` when the mechanism lane resolves
`FACTION_LABEL_SIBLINGS` (expected 5 → 0, 12 births' labels change). Sites for the mechanism lane:
`rulingStructure.js :: generatePowerStructure` (the label, after the roster settles), `npcGenerator.js ::
generateNPCAppearance` (R), `factionLeaderSecret.js :: generateFactionLeaderSecret`'s pick (R, after the re-read).

## CENSUS-4g (2026-11-05)

**Merges.** census-1b at `0c445be` (merge `8c55289`: 1h units 6, 7 and R-AT; census-5d) — one conflict,
`rulingStructure.js`'s single import line, both sides kept (4f's `textOf` + `MILITARY_GUARD_LABEL`; 5c's
`powerSiblings` re-export); and at `712ac76` (merge `2b0efef`, clean: 1h's R-AU `d035cf8` and `clergy` `712ac76`;
census-3h). At each: `gen:dossier-prose --check` green; `wiring-census --dry` stale by exactly 4f unit 6's known
`tablePools` row (+72 bytes, 0 rows, no stamp — the compose's re-take, R-T, the chair's answer 4). The local ref was
stale with HEAD detached for the fifth seat running (here at `ec45a02`, the pushed tip); re-pointed before the first
push. `npm ci` (lockfile untouched).

| unit | commit | what | golden (525) | soak (60 / 1,000) |
|---|---|---|---|---|
| 1 | `8c55289` | the merge; census through its door; the 60 as the merged base | — | — |
| 2 | `6e9cbc6` | R-AX: the criminal secrets keyed by the holder's role, **carried**; the mismatch measured | 0 | 0 / 0 |
| 3 | (listed) | NPC_WANTS "a dockhand's oilskins…": the site listed for the mechanism lane, re-measured | — | — |

**Unit 2 — R-AX (the chair's answer 3).** `src/data/npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER` holds the rows by
the holder's role class (`domain/roles/roleClass.js :: classOfRole`, the fact's own reader, R-AP): `clergy` — religious
#0 "Lost their faith completely but maintains the role", #1 "covering for a colleague's heretical activities", #3
"falsifying miracle reports", #4 "their religious order was founded on a historical lie", #5 the relic "officially
declared destroyed" that it fell to them to destroy; `military` — military #0 "Gave an order during a battle", #3
"selling patrol routes and schedules", #4 "skimming from military supply budgets", #5 "ordered to commit an atrocity
… risen in the organisation"; `any` — every other row (religious #2, the visions; military #1, captured and
released; #2, the victory won by treachery). Religious #5 and military #0 are keyed by R-AD's rule (where the reading
cannot decide, it declares); military #3 is keyed military (the holder's access), which retires the disjunction
(watch ∨ militia ∨ garrison) the phase-A ledger left undeclared. The ledger's six `institution: temple` declarations
are withdrawn (`npcData.NPC_CRIMINAL_SECRETS.json`: declaring 9 → 3; `holderKey` recorded): a temple on the roster is
not a cleric holding the secret. No atom enters the vocabulary.
- **Carried, not keyed.** `factionLeaderSecret.js` still reads the flat `NPC_CRIMINAL_SECRETS`, now rebuilt in its
  historic order by `CRIMINAL_SECRET_LEGACY_ORDER` (its sha-256 pinned to `8c55289`'s). The mechanism lane keys the
  draw on `criminalSecretsForHolder(type, classOfRole(role))` — the role must be handed to
  `generateFactionLeaderSecret` from `npcGenerator.js :: generateSingleNPC` (it holds `role`). That view keeps the
  historic order and drops only rows keyed to another role, so a clergy holder's religious pool and a soldier's
  military pool are the flat pools themselves: only a mismatched holder's draw moves, and the pick count is
  unchanged (one `pickFromArray`, or the personal fallback's one).
- **Byte identity:** 525 golden + 60 soak records hashed `8c55289` vs the unit: 0 of 585 differ.
- **The mismatch, measured on the 1,000** (a scratch instrumented copy of `8c55289`; the data is identical):

| figure | draws | births |
|---|---|---|
| faction-leader secret draws | 9,550 | 1,000 |
| of type religious or military | 2,070 | — |
| **to a holder of another role class — the births that move once keyed** | **1,711** | **665** |
| … whose drawn row is keyed to another role (false today: clergy 955, military 474) | 1,429 | 620 |
| … that find the role-free pool empty after `allowsSecret` (the visions line) and fall to the personal pool | 775 | — |
| printed on the final record: keyed secrets / mismatching their holder | 740 / **600** | — / 393 |

  By line on the final record (false prints): miracle reports 90 · heretical colleague 86 · religious order 86 · lost
  faith 75 · relic 74 · patrol routes 53 · supply budgets 52 · atrocity 45 · order in battle 39. The 775 empty-pool
  draws are the mechanism lane's to read: a non-clergy holder whose type roll lands on `religious` in a world without
  magic now draws a personal secret (the type roll's weights read the roster, not the holder; R-AX keys the pool,
  not the roll). One reader edge, not bent (R-X): `Temple Guard Commander` is `clergy` by `classOfRole`, so a
  soldierly secret drawn by one is counted as a mismatch.
- Red-first: `tests/data/criminalSecretsByHolder.test.js` 3/4 red on `8c55289`, 4/4 green. Governing suites (the 22
  files importing `npcData`): the base's 6 reds title for title (generationForkCensus ×4, hookThemeDraws,
  narrativeQualityCorpus).

**Unit 3 — NPC_WANTS's site, listed.** Its declarations stand (4f unit 6, carried through `textOf`); the draw
`npcGenerator.js :: generateNPCAppearance` (R, `clothes: textOf(pickFromArray(NPC_WANTS[r] || NPC_WANTS.other))`) is
**listed for the mechanism lane** to route through `drawDeclared` (R-C). Re-measured on the merged tip `2b0efef` (the
final record's `physical.clothes` against `factsOf(settlement)`): "a dockhand's oilskins over hands too clean for the
work" (`docks`) false in **58 of 96 prints, 48 births** (4f's "48 of 81" counted births against prints); "vestments a
size too grand for the shrine they serve" (`sacredHouse`) 17 / 168 (17 births); "guild colours worn with pride"
(`guild`) 2 / 166 (2 births). Nothing else here.

**A third merge:** census-1b at `f1d7605` (merge `85f18a3`, docs only: 1h's lane record). It records that **CENSUS-1h
stopped at its boundary before R-AW and `tablePools`' second half**; both are now CENSUS-1i's items 1 and 2 (item 3 is
R-AX's keyed draw, on unit 2's rows). So:

| unit | status |
|---|---|
| 4 — R-AW re-measured | **waiting on CENSUS-1i item 1.** `[guard]` stays **5 → 5** on the 1,000 (soak1k-110, -462, -470, -571, -614); the would-be label changes stay 4f's measurement, 12 of 1,000 births (12 of 363 holders). Nothing to apply here: the label row and its twin are on this lane since 4f (`3cb9861`). |
| 5 — the `colour` marks | **waiting on CENSUS-1i item 2** (the walker). Read verdicts exist only for the tie prose (267 rows marked `colour` in its phase-A ledger) and the wants (53); the catalogue descriptions (599 no-atom rows) and the goal texts (99 + 71 + 17) carry no per-line verdict, so they must be re-read before any mark (the chair's answer 2: never an unread line). The register count is unmoved by this seat. |

**Unit 6 — the 60 and the 1,000 as a diff (R-B).** BEFORE = the first merged base `8c55289`; AFTER = the tip `85f18a3`
(units 2–3 plus the two later merges). This lane's units are byte-identical (unit 2: 0 of 585), so every movement below
is a merge's.

| class (settlements) | the 60 | the 1,000 |
|---|---|---|
| goal claims (current stability · competent administration · stable institutional competition) | 0 · 0 · 0 → same | 0 · 0 · 0 → same |
| `coh:*` · `A-12` | 0 → 0 | 0 → 0 |
| `reader:hook-pools [guard]` | 0 → 0 | **5 → 5** (R-AW not landed) |
| `cert:false-presumption` | 10 → **0** | 161 → **0** — all `foodBalance:OUTLOOK_HOOK_SIBLINGS` (lane 3's), cured by 1h's R-AU `d035cf8`, merged; none of this lane's pools on either side |
| other `cert:*` | none | none (certification 1,000 / 1,000, 0 errors) |
| reader:faction-role-fit · relation-types · tension-memory · validation-on-page · A-05 · A-09 · A-11 · info:battery-would-not-vouch | identical | identical (348 · 147 · 61 · 985 · 977 · 8 · 1 · 676) |
| verdict | STOP → CLIMB | STOP (1,912 findings) → CLIMB (1,662) |
| `declared-share` npcs · relationships · institutions · services | 333/2,658 · 149/1,356 · 120/246 · 116/3,435 → same | 5,155/42,933 (0.120) · 2,077/21,528 (0.096) · 2,168/4,215 (0.514) · 1,965/55,655 (0.035) → same |
| `declared-share` economics (R-AU's kept notes gone) | 31/110 → 25/104 | 549/1,932 → 504/1,887 |

R-AX adds no share yet: the criminal-secret draw is unwired (carried), so its pool is not ledgered.

**Rows moved, by cause (nothing re-recorded):** golden 0 (unit 2, proven 0 of 525); soak records 0 of 60 (unit 2);
wiring census: 0 rows — still stale only by 4f unit 6's `tablePools` row (+72 bytes; the census interlock's two reds,
`proseWiringCensus.walker` "byte-identical to a fresh build" and "THE DRY READ", stay listed for the compose, the
chair's answer 4); unit 2 moves no `tablePools` row (the flat view walks the same 124 strings); no manifest row; no pin.

**Tests / gates.** New: `tests/data/criminalSecretsByHolder.test.js` (4), red-first. eslint 0; typecheck:ratchet
167/167; domain:strict only the merged crisisFactFindings +4 / composeStateProse +2.

**Sites for the mechanism lane (CENSUS-1i):** `rulingStructure.js :: generatePowerStructure`'s `Military/Guard` label
(R-AW, resolved at the birth's close); `factionLeaderSecret.js :: generateFactionLeaderSecret`'s pick (R-AX: hand it
the holder's role from `generateSingleNPC`, draw over `criminalSecretsForHolder(type, classOfRole(role))`; 665 births
move, counted above); `npcGenerator.js :: generateNPCAppearance` (R, NPC_WANTS; 48 births print a false dockhand line).

**Open questions for the chair.**
1. R-AX's keyed draw sends 775 of the 1,711 moved draws to the personal pool (a non-clergy holder whose type roll lands
   on `religious`, with the visions line barred by `allowsSecret`). Accept that, or should the type roll's weights
   also read the holder (a weight change: it moves the type roll's births too)?
2. `Temple Guard Commander` is `clergy` by `classOfRole`, so a soldierly secret is refused to it once keyed. Leave the
   reader as it is (R-X), or should the military rows also admit a clergy holder whose title is a command?

**Where CENSUS-4h starts.** Only on CENSUS-1i's landings: (a) when R-AW lands, merge and re-measure `[guard]` 5 → 0 and
the ~12 label changes; (b) when the walker lands, re-read the descriptions' and goals' no-atom rows, then mark
`colour` on the read rows (the ties' 267 and the wants' 53 are read already) and count the register's fall; (c) when
R-AX's keyed draw lands, count the births against unit 2's 665. Otherwise nothing of this lane remains but the compose.

## CENSUS-4h (2026-11-05)

**Merges.** census-1b at `5978662` (merge `8fcdc1e`, clean: 1i units 1–3 = R-AW at the birth's close, the walker,
R-AX refined) and at `e36e491` (merge `63eaa09`, clean: 1i units 4–6 = R-O's family marks, R-AT's wider audit,
NPC_WANTS's site). At the first: `gen:dossier-prose --check` green; `wiring-census --check` green and `--dry` CURRENT
(1i re-took the census including 4f unit 6's row). At the second: `--check` green; `--dry` stale by exactly unit 4's
rows. The local ref was stale with HEAD detached for the sixth seat running (at `1bb90ad`, the pushed tip). It was
re-pointed before the first commit. `npm ci` (lockfile untouched).

| unit | commit | what | golden (525) | soak (60 / 1,000) |
|---|---|---|---|---|
| 1 | `8fcdc1e` | the merge; census through its door; the 60 as the merged base | — | — |
| 2 | (measured) | `[guard]` re-measured after R-AW | — | — |
| 3 | (measured) | the keyed secret draws counted (R-AX refined) | — | — |
| 4 | `ea6b9e1` | R-AO `colour` marks: wants 53, tie variants 249, goals 35, descriptions 511 | 0 | 0 / 0 |
| 5 | `63eaa09` | the merge carrying NPC_WANTS's site; re-measured | 0 vs `e36e491` | 0 vs `e36e491` |

**Unit 2 — `[guard]` (R-AW, answer 1).** On the 1,000 at `8fcdc1e`: `reader:hook-pools` reads **0** (4g: 5, on
soak1k-110, -462, -470, -571, -614). Label changes are counted on scratch births of the 1,000, comparing `7e31bee`
(pre-R-AW) with `b00d387`. **12 births** moved, and they are exactly 4f's twelve (soak1k-110, -236, -247, -260,
-326, -446, -462, -470, -571, -614, -674, -776). Each now prints "Military Party" (128 copies through the rename
cascade). Nothing else in any record moved.

**Unit 3 — R-AX refined (answer 3).** Scratch births of the 1,000, `b00d387` vs `5978662`: **419 births** moved,
against 4g's prediction of 665 births and 1,711 draws. The difference is draws that never reach the final record.
1i's own walk found 419, all in `npcs[].secret`. 1,313 printed secrets changed:
- 600 were exactly the keyed secrets that were false for their holder;
- 713 come from the re-mapped type roll and the shifted row index of the keyed view.

By holder class: office 279 · trade 229 · merchant 207 · military 164 · clergy 142 · criminal 139 · noble 94 ·
other 38 · arcane 21. **Printed keyed secrets false on the final record: 600 (393 births) → 0.** Keyed prints
fell 740 → 142. `cert:false-presumption` on the secrets: 0.

**Unit 4 — the `colour` marks (answer 2), after the walker.** Only lines READ are marked, and a mark is a
declaration with no atom (silence to every draw).
- **Wants:** phase A's 53 colour rows, `{ text, colour: true }` in place.
- **Tie prose:** phase A's 249 colour variants, `{ line, colour: true }`. The ledger's other 18 colour rows are
  the archetype labels.
- **Goals:** re-read, short and long together. 35 marked; 10 stay unmarked because each presumes a fact with no
  home: Mayor#1 and Abbot/Abbess#1 a lord · Mayor#3 a council election · Governor#0 the season and the crown ·
  Tax Collector#0 a past riot · Crime Lord#1 a guard captain · Council Member#0 and Wealthiest Merchant#1 a
  council and a merchant bloc · Guild Master#0 a second guild · Chief Magistrate#0 a nobility. The last four
  follow phase A's own note.
- **Descriptions:** the 599 no-atom rows re-read. 511 marked in a new column beside the table,
  `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS`, enrolled in `DECLARATION_CHANNELS`.
  `DESC_VARIANT_DECLARATIONS` stays pinned at 62. 88 stay unmarked:
  - a fact the row does not or cannot declare: a road, alehouses or taverns, a church, a river, stream or
    bridge, a marsh, no other government, no lawful slave market, no resident clergy, magic (compelled truth),
    banks, militias, a season;
  - every designer rule phase A listed as printed fact, plus its possessive slip;
  - the village Waystation #1, which declares by 1c's walls sibling set.

Each verdict is in the two re-read ledgers (`colour`, `colourReadBy`, `pool.colourReRead`). Byte identity: 525
golden + 60 soak, `8fcdc1e` vs the unit: 0 of 585 differ.

**The register's fall, measured through `buildCensus` and not re-taken (R-T, answer 4):**

| `tablePools` row | undeclared before → after | what the fall is |
|---|---|---|
| descriptions | 921 → **144** | the 511 marked texts occur 777 times over the tier keys |
| goals | 46 → **11** | the eleventh is Guard Captain#1, whose ledgered `crime` was never applied |
| wants | 53 → **0** | — |
| tie prose | 18 → 18 | the walker reads each archetype as one row; listed for the mechanism lane: read a `pairProse` closure's `.lines` |

`--dry`: tablePools only, +66 bytes, 0 state rows, no stamp. The census interlock's two reds
(`proseWiringCensus.walker` "byte-identical to a fresh build", "THE DRY READ") stay listed for the compose.

**Unit 5 — NPC_WANTS's site (landed as 1i unit 6).** The merge is byte-identical to `e36e491`: 0 of 585 differ,
so the marks reach the wired draw as silence. Final record of the 1,000, `b00d387` → the tip:

| want | false prints before → after |
|---|---|
| "a dockhand's oilskins…" (`docks`) | 58 of 96 (48 births) → **0 of 38** |
| shrine vestments (`sacredHouse`) | 17 / 168 → 0 / 151 |
| guild colours (`guild`) | 2 / 166 → 0 / 162 |

**Unit 6 — the 60 and the 1,000 as a diff (R-B).** BEFORE = 4g's tip `1bb90ad` (its recorded figures) and the
merged base `8fcdc1e`; AFTER = the tip `63eaa09`. Units 4 and 5 move no birth (0 of 585 each), so every
movement is a merge's.

| class (settlements) | the 60 | the 1,000 (4g tip → merged base → tip) |
|---|---|---|
| goal claims (current stability · competent administration · stable institutional competition) | 0 · 0 · 0 | 0 · 0 · 0 throughout |
| `coh:*` · `A-12` | 0 | 0 |
| `reader:hook-pools [guard]` | 0 | **5 → 0 → 0** (R-AW) |
| `cert:false-presumption` | 0 | 0 → 0 → 0; on the secrets 0, on every pool of this lane 0 |
| other `cert:*` | none | none (certification 1,000 / 1,000, 0 errors) |
| reader:faction-role-fit | 17 → 17 | 348 → 352 → 352: the first merge (R-AW renames and R-AX's moved secrets), not this lane's units |
| relation-types · tension-memory · validation-on-page · A-05 · A-09 · A-11 · battery-would-not-vouch | identical | 147 · 61 · 985 · 977 · 8 · 1 · 676 throughout |
| verdict | CLIMB → CLIMB (101) | CLIMB (1,662) throughout |

`declared-share` on the 60 (base → tip):

| surface | declared / drawn |
|---|---|
| npcs | 335/2,653 → 357/3,248 |
| relationships | 149/1,356, unchanged |
| institutions | 120/246, unchanged |
| services | 116/3,435, unchanged |

`declared-share` on the 1,000 (merged base → tip):

| surface | declared / drawn |
|---|---|
| npcs | 5,160/42,934 (0.120) → 5,513/52,483 (0.105) |
| relationships | 2,077/21,528 (0.096), unchanged |
| institutions | 2,168/4,215 (0.514), unchanged |
| services | 1,965/55,655 (0.035), unchanged |

The npcs drawn count rises because 1i's wired wants site now ledgers its 9,549 draws. The share falls because
the ledger reads a `colour` row as undeclared: R-AO counts it as declared in the registers but as silence in a
draw, so the share does not count the marks.

**Rows moved, by cause (nothing re-recorded):**
- golden: 0 by this lane's units (unit 4 0 of 525; the second merge 0 of 525 vs `e36e491`);
- soak records: 0 of 60;
- wiring census: 3 `tablePools` rows by unit 4 (descriptions, goals, wants, as above), not re-taken; the two
  interlock reds are the compose's;
- manifest rows: 0; pins: 0.

Test re-keyed by this unit's own cause: `npcWantsDeclared` (a), because the wants are `{ text, colour }`, no
longer strings.

**Tests / gates.** New: `tests/data/colourMarks4h.test.js` (4), red-first (4/4 red with an empty column).
Governing suites (44 files): the base's 57 reds title for title, plus the two interlock reds. eslint 0;
typecheck:ratchet 167/167; domain:strict only the merged crisisFactFindings +4 / composeStateProse +2.

**Open questions for the chair.**
1. The ledger's `declared-share` reads a `colour` row as undeclared while the registers count it as declared.
   Should the share count marks (a mechanism-lane instrument change), or stay "presumption declared" only?
2. The tie prose's 249 marks lower no census row until the walker reads a `pairProse` closure's `.lines`. Is
   that the mechanism lane's (wave 2)?
3. Guard Captain#1 ("on the thieves' guild payroll") carries a ledgered `crime` that was never applied. Is it
   now declarable through 3b's `crime` getter, or listed "waiting on crime"?

**Where CENSUS-4i starts.** Nothing of this lane remains but the compose: the census re-take for unit 4's three
rows (R-T) and the open questions above. The NPC lane's tip for the compose is this section's commit.
