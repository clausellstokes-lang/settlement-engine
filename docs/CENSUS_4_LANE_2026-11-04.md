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

| # | unit | commit | rows moved, by cause |
|---|---|---|---|
| R9 | `reader:possessive-slip`: `guildTitleName` | `8bededc` (amended: census re-taken through its door, 0 rows, producer index 1275 → 1276) | 17 of 525 golden rows, only `npcs[].title` + its mirror `factions[].members[].title` |
| A | the phase-A ledger | this commit | 0 (docs and scripts only) |
