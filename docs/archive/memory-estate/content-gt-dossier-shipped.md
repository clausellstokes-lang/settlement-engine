---
name: content-gt-dossier-shipped
description: "CONTENT-GT-DOSSIER lane — dossier/naming content growth, draw-count-invariant, PARKED; the DOSSIER+NAMING half of task"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8ba463c5-d61d-4687-84e1-c6fc5e1cfa42
---

The DOSSIER + NAMING half of the content-volume commission (task #27) — the surfaces the
sibling event-prose lane deferred (see [[gallery-phase2-shipped]] family / the sibling's
`docs/GENERATION_TIME_SHIFT_MAP.md`). Built 2026-07-17 on branch
`claude/generation-time-content-dossier`, based on the sibling `claude/generation-time-content`
@ `f9720b5a` (to reuse its fnv idiom + stack both parked content lanes for the composite).
**PARKED** — no fold, no PR, no deploy (RULING #7 backup-on-branch). Tip `577179fb`. The live
plan + full ledger is `docs/GENERATION_TIME_SHIFT_MAP_DOSSIER.md` on the branch.

**Commits:** `6452295c` Wave 1 (dossier narrative + institution prose) · `8b1a5648` Wave 2
(world-scoped faction-name dedup) · `54f08b05` taste-sample · `577179fb` plan note.

**THE LOAD-BEARING LAW (why the park is safe):** the generation PRNG is forked PER-SETTLEMENT
(`createPRNG(seed)`) AND PER-STEP (`rng.fork(stepName)` = `createPRNG(seed::step)`, pipeline.js).
`pick(arr)` advances the stream by exactly ONE `_roll()` regardless of `arr.length`. So a pool
grown in place under a single `pick`/`pickRandom2` is DRAW-COUNT INVARIANT — only the chosen
string moves, no structural field. For 0-draw fixed-field surfaces, variety is added via a PURE
fnv hash (`src/kernel/proseHash.js` — `fnv1a32` + canonical-at-zero `pickVariant`; a local
kernel leaf, NOT a cross-import of eventProse). Proven empirically by a base-vs-tree STRUCTURAL
DIFF over the 187-row generator-golden grid: only prose paths moved (`pressureSentence`,
`history.historicalCharacter`, `institutions[].desc` + its `defenseProfile.*.desc` projections,
`arrivalScene`) — zero structural/numeric fields. The lane's verification bar is this diff, NOT
"goldens green".

**Grown + verified:** pressure sentences (CRITICAL; `religious_conversion`'s `name.length%3`
selector REPLACED by `pickRandom2` — draw-neutral, real re-roll variety) · POLITICAL_FLAVOR
(inner-`pickRandom2` count matched per pattern) · ARRIVAL_SCENES thinnest pools 2→4 · institution
descriptions (56-institution sample; fnv post-pass at assembleInstitutions end, scalar `desc`
written back — no persistence-shape change) · faction names (below).

**Faction dedup (CRITICAL, the survey's worst surface):** `src/lib/instantWorld/factionDedup.js`,
a PURE rng-free post-pass in `composeInstantWorld` (per-settlement generation byte-identical).
FACTION_DESCRIPTORS names live only in `settlement.factions[].name` + the `conflicts` fields
(NOT in dossier prose, which uses `powerStructure.factions[].faction` role archetypes). Renames
cross-settlement collisions to world-unique same-category descriptors. ⚠️ Rename by IDENTITY
(array index), not name-match — a settlement CAN carry two same-named factions (local dedup caps
out) and name-match collapses them to one (bug found+pinned).

**Full gate:** 12,446 tests pass, 1 PARK RED = `tests/property/generatorGoldenMaster.test.js`
(whole-settlement hash; regen once at the ONE REGEN via `UPDATE_GOLDEN=1` — do NOT re-record
here). No other golden red. typecheck + domain-strict(0) + lint + validate:data + build +
verify:dist(145/145) clean.

**DEFERRED (recorded, NOT bugs to re-find):** history-event descriptions (58 variants authored
+ banked in the authoring workflow journal / scratch; wiring needs token-verification vs
`generateEventNarrative` + `ctx._seed` threaded — clean fnv, same idiom) · exhaustive institution
descs (~245 of 301) · NPC display pools (authoring fan-out stalled; NPC_PERSONALITY_TRAITS
neg/neutral + NPC_CRIMINAL_SECRETS deferred regardless — content-branch draw hazard) · deeper
vignettes (STRESS_DESCS needs stressTypeContentWave probes made pool-robust; STRESS_NOTES needs
a seed threaded into genArrivalDetail). OWNER-GATED, untouched: institution NAME `displayName`
schema, deity/naming growth, institution service menus (adequate).

**Owner taste-pass gate:** `docs/CONTENT_GT_DOSSIER_TASTE_SAMPLE.md` — the owner wanted a prose
taste-sample before this rides the permanent regen. Queued taste calls: the faction rename
STRATEGY (same-category descriptor + base/suffix probe — some read clunky, e.g. "The Commercial
Circle Inner Circle"); a pre-existing `govFaction`/`topFaction` sentence-start casing quirk
(lowercase "the town council …" after a period; base has 5, lane added 4 in the same style — a
sentence-boundary capitalize pass would fix all 9; NOT done, out of content-growth scope).
