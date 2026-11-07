# CENSUS-5 — the Power & Factions, Defense & War and Faith pools declared (lane record, 2026-11-05)

> A build seat's record for the chair. Branch `lane/census-5-2026-11-04`, cut from `origin/lane/census-1b-2026-11-04` at `358b0a841`, with `origin/lane/window-rung2-2026-11-04` (`3bc72bc0c`, docs only) merged at `8734cd79c`. Transport push only; no pull request.
>
> **Where this seat stopped (the boundary rule).** The kernel half of the lane is done: DS-DEF, DS-POW, DS-REL, DS-WAR and DS-FTH were read, ledgered, applied, projected and census-taken, in three unit commits. **CENSUS-5b starts at brief item 5:** the off-census pools (the inline T branches of `rulingStructure`, `governanceNarrative`, `stressFactions` and `safetyProfile`; the R sites `FACTION_DESCRIPTORS` and `STRESS_RUMORS`; `threatProfile.js :: THREAT_TYPE_TEMPLATES`, `warRemembrance.js`, `threatDefensePolicy.js`; the faith panel pools `faithPanelModel.js` and `deityEffects.js`). Then item 6 (twins and fallbacks for those surfaces), then the "owed" rows below.

## The units

| unit | commit | what |
|---|---|---|
| 1 | `80d676864` | DS-DEF declared; the perimeter calm claims under threat and unrest (R-F 3); 14 pools `{crisis-scoped}`; four kernel sweeps hand facts (`tests/helpers/calmFactsDouble.js`) |
| 2 | `06b59812f` | DS-POW-4 v1/v2 `no crisis: unrest` (R-F 1) and ONE unrest-safe line (v6); DS-POW/DS-REL presence atoms |
| 3 | `41f2c679a` | DS-WAR-3 dormant note `war: peace`; DS-WAR presence atoms; DS-FTH `temple`; DS-FTH-3 `no crisis: religious_conversion` |
| doc | (this commit) | this record |

## How a declaration is spelled here (the chair's rulings this lane made, recorded, vetoable)

- **C5-1, two channels, one reader.** F12's kernel crisis marks (`no threat`, `succession settled`, `no unrest`, `threat`, …) are KEPT VERBATIM. The census atoms go BESIDE them in the same tag slot: `no crisis: threat, unrest`, `crisis: any`, `gate`, `watch`, `market`, `temple`, `institution: granary`, `war: peace`, and `no crisis: <kind>`. Both channels are answered by the one crisis home (`crisisDimensionsOf` and `factsOf(record).crisis` both come from `familyActiveIn`), so a kernel `no threat` and a census `no crisis: threat` refuse the same births. **Why both channels and not a conversion:** replacing a kernel mark changes which dimensions a block partitions by, and the mount registry pins each mount's declared dimensions (`dossierMountRegistry.walker`; measured red when I tried it). A kernel `threat` ON-mark also has no census twin under the conjunction rule: `crisis: threat` refuses a siege plus a betrayal. Converting is the composer lane's call once the mount rows read the census.
- **C5-2, an opted pool's crisis lines.** In a `{crisis-scoped}` pool, every line that is sayable under a crisis declares `crisis: any`. A line that is calm about some families adds `no crisis: <families>`. A line that is calm full stop ("Nothing presses…") stays silent, which in a scoped pool reads as calm. A crisis-only twin (the F12 kernel `threat` line) adds `crisis: any`, and the kernel mark still keeps it to the threat family.
- **C5-3, kind atoms for kind claims.** A claim that one crisis kind contradicts declares that kind, not a family: `no crisis: debt` ("could go through a bad season with its arrangements intact", soak1k-3604's breaker) and `no crisis: religious_conversion` ("no quarrel worth having").
- **C5-4, "Enforcement" is not a guard.** DS-DEF-3's "Enforcement at {settlement} sits far above…" lines take no `guardPresence`. The safety score's enforcement can come from the community or the court floor (`safetyProfile.js`), and declaring a guard there muted Very Safe and Safe under threat on a guardless place (measured in the window test's mute arm). Lines that name "the watch" literally declare `watch`.
- **C5-5, no `war:` atom on world-keyed pools.** The war desk hands the kernel lone-record facts. On a lone record `warStateOf` answers from the crisis home, and DS-WAR-1/2 are keyed on the world's `settlementWarStatus`. A `war: front` there would refuse the pool wherever the record carries no war crisis, which is CENSUS-2's R-C1 reading. Only DS-WAR-3, the dormant note, declares `war: peace`: "at peace" is exactly what a `wartime` / `occupied` / `under_siege` record contradicts. No legacy war probe reads anything here.
- **C5-6, the kernel sweeps hand facts.** This is the first lane to put census atoms into the kernel corpus. Seven test sweeps called `eligibleVariants` / `readStateProse` / `composeStateProse` without `facts`, so every declaring pool read as mute in them (fail-closed, law 5 generalised). The sweeps that mean "the state this pool is about, nothing else in the way" now hand `CALM_FACTS_ADMIT_ALL`: calm, with every presence fact held, so they measure what they measured before. The sweeps that read a birth hand `factsOf(birth)`. The blind (unanswered) reads stay fact-less and still read null. The double sits in `tests/helpers/`; CENSUS-1c should know it exists before wiring the R/H/T sites.

## The table

| surface | pools | lines read | lines declaring (census channel) | kernel-mark-only lines | crisis-scoped pools | twins / new lines (share) | lines refused by a declaration, kinds |
|---|---|---|---|---|---|---|---|
| DS-DEF | 127 | 396 | **0 → 67** | 29 → 7 | **0 → 14** | 0 | perimeter / street calm under threat + unrest (12), calm under threat (17), `gate` (6), `watch` (6), `no crisis: debt` (2), `no crisis: hunger` (2) |
| DS-POW | 79 | 262 → 263 | **0 → 8** | 13 → 12 | 0 | **1** (POW-4 v6; below) | `no crisis: unrest` (2), `gate` (2), `watch` (2), `market` (2) |
| DS-REL | 13 | 42 | **0 → 1** | 0 | 0 | 0 | `market` (1) |
| DS-WAR | 86 | 272 | **0 → 9** | 18 | 0 | 0 | `war: peace` (5, DS-WAR-3), `gate` (2), `market` (1), `institution: granary` (1) |
| DS-FTH | 52 | 158 | **0 → 9** | 4 | 0 | 0 | `temple` (7), `no crisis: religious_conversion` (2) |
| **total** | **357** | **1,130 → 1,131** | **0 → 94** | | **0 → 14** | **1** | |

Lines read includes the unmounted DS-DEF-7, DS-DEF-10, DS-WAR-4, DS-WAR-5 and DS-FTH-4. Of those, DS-DEF-7 and DS-DEF-10 carry four declarations (calm under threat), which move no birth. A line counts as "declaring" when it carries a census atom. "Kernel-mark-only" counts lines whose only marks are F10/F12 kernel words; these are F10's walls twins and F12's crisis twins, unchanged. **Pure-colour pools: none ruled.** The undeclared-lines register (design §3.5) is not built (1b item 5), so a `{colour}` ruling would have no reader. The DS-REL relationship pools and most DS-FTH/DS-WAR pools presume nothing beyond their keys, and are left for that register's first pass.

The crisis-scoped pools (grow-only): DS-DEF-1 readiness STRONG · WEAK · CRITICAL; DS-DEF-2 frontier credible deterrence · settled, defenses beyond the need · settled, nothing organized · Invasion & War: neither walls nor force; DS-DEF-3 Very Safe · Safe; DS-DEF-6 Logistics & Supply: Granary + port · Naval Defense: Naval force · Naval Defense: Port only; DS-DEF-11 WALLED-QUIET · UNWALLED-SMALL.

**Not opted in, measured.** DS-POW-2 `stable matched`: "Stable" never co-occurs with the succession or unrest family (0 of soak1k-0..399; the 17 Stable halls were all free of both families). DS-POW-4 is gated by F12's kernel marks plus v6, so it needs no opt-in.

## The new line (the chair's ruling, R-F 1 / R-G; the owner reads it after the fact)

DS-POW-4 `riskLabel: Stable (no challengers)`, v6, `[ledger · succession settled · unrest]`:

> No rival stands at {settlement} to take the {seat}, and in a season of fighting that is small comfort: what threatens {faction} now is the fighting itself, not a contender for the hall.

**Share:** v6 is eligible only when the seat is settled AND the unrest family is on. In that state v1–v3 are refused (v1/v2 by this lane, v3 by rung 2D unit 2) and v4/v5 need an open succession, so the pool was otherwise MUTE. It is the only survivor there (1/1) and is never eligible elsewhere, so it moves no birth outside that state. On the 60 it prints once (soak1k-1, a slave revolt), replacing v1.

## Waiting / owed (the line is left as it is)

| line | presumes | waiting on |
|---|---|---|
| DS-DEF-6 Economic Backing: Well-funded v2 "The soldiers at {settlement} are paid" | soldiers | CENSUS-1c's `soldiers` getter (R-E) |
| DS-DEF-4 capture none v2 "There is a criminal interest at {settlement} with the means…" | organised crime | CENSUS-3b's `crime` getter (R-E) |
| DS-DEF-4 structure null v1 "No criminal infrastructure has been identified…" (soak1k-1801's breaker) | crime = none | CENSUS-3b's `crime` getter |
| DS-DEF-1 readiness WEAK v2 "…how much of the perimeter has nobody on it…" | walls (the perimeter) | a `walls` declaration here is a kernel mark: it partitions DS-DEF-1 by walls, which the mount row must then declare (`dossierMounts.js`, not this lane's file). Declared calm-under-threat/unrest only |
| DS-DEF-2 Disasters & Famine: granary-only / granary + parish / granary + hospital (food endurance: "can outlast a hungry year", "a full store") | not hunger | every line of the granary-only pool makes the claim, so declaring it mutes the pool under hunger. Twin or silent slot: the chair's call (question 2) |
| DS-DEF-1 strategic value LOW (all three: "not worth an army's season") | not under siege / occupation | the same mute question |
| DS-FTH-3 every niche uncontested v1, LEGITIMACY secure ×3 | not under religious_conversion | the same mute question |
| DS-WAR-1 warExhaustion rested v1–v3 ("carries no scar from fighting") | not threat | the same mute question; renders only beside a war beat |

## The 60 and the 1,000 (R-B: before = this lane's base, after = its tip)

| run | settlements · findings · errors · verdict | `coh:crisis-blind-prose` | "nobody stops a stranger" | other contradiction classes | `cert:*` · `cert:false-presumption` | `declared-share` |
|---|---|---|---|---|---|---|
| 60 | 60 · 176 → 171 · 0 → 0 · STOP → STOP | 24 → **19** | 5 → **0** | none moved | none · 0 → 0 | `{}` → `{}` |
| 1,000 | 1,000 · 2,596 → 2,549 · 0 → 0 · STOP → STOP | 278 → **241** | 43 → **0** (siege 22, occupied 15, monster pressure 6) | none moved; `A-12:self-vouch-false` 18 → 14 (0.018 → 0.014; derived from crisis-blind) | none · 0 → 0 | `{}` → `{}` |

The STOP on both sides is the base's: `coh:crisis-blind-prose` on rung 2D unit 3's other claims (current stability, food secure, stable institutional competition, competent administration, depends on none alone, nothing is failing, a year closed ahead). Those belong to CENSUS-4's goal tags and CENSUS-3b's economy pools. **`declared-share` reads `{}` on both sides,** because the soak's ledger is the BIRTH's: the kernel draws at render, in the harness's SSR graph, and that graph's ledger is another module instance (1b's note on `renderHarness.mjs`). So the census channel declared here is enforced at the draw, but the self-check and the share do not see it yet. That wiring is CENSUS-1c's, and until it lands `cert:false-presumption` 0 is vacuous for these pools.

Records: 60 of 60 byte-identical (the record hash in `settlements.jsonl`). Pages: 21 of 60 sample pages moved, every move a refused winner or v6 (read: soak1k-1, -24, -0, -5).

## Rows moved, by cause (never re-recorded)

- **Golden records:** 0. A declaration moves only display prose, and the record hashes are identical on the 60 and on the 1,000 (1,000 of 1,000 identical).
- **Wiring census:** re-taken through its door at every unit (`node scripts/wiring-census.mjs`, then `--check` green). 1 row moved: DS-POW-4 :: riskLabel: Stable (no challengers), from v6's addition (variants 2,323 → 2,324). The census carries no declaration columns yet (design §3.5's extension is not built), so no other row moved.
- **Generated leaves:** `defense`, `power`, `general` (DS-REL), `warFaith`, through `npm run gen:dossier-prose` only, `--check` green.
- **Test pins re-keyed by cause:**
  - the declarations (C5-6): `crisisBlindDossierProse` (two arms read either channel), `stateProseKernel` (the pre-cure sweep), `dossierStateProseProjection.contract` (the answered reads and the authoring bill), `composeStateProse` (the shipped-corpus turn probe), `wallsWordDossierProse` (the no-walls read), `seatSafetyUnrest`;
  - the leaf vocabulary: `warFaithStateProseDesk` (kernel words stay the walls pair; every other mark must be declarable).
- **Red-firsts:** `defensePerimeterCalm.test.js` 5/5 red at `8734cd7`; `powerSuccessionUnrest.test.js` 3/5 red there (the two control arms are green at the base, as they should be). Both are green at the tip.
- **Governing suites** (every test naming a touched leaf, desk or the annex, 74 files): no red beyond the base's. The base carries 65 reds of its own in that set, and the tip fails exactly those 65 titles (63 in the first 64 files, 2 in the 10 added for units 2–3), compared title for title.
- **Typecheck:** `typecheck:ratchet` green. `typecheck:domain:strict` is red at the base and at the tip with the same four files (`factVocabulary.js` +42, `crisisFactFindings.js` +4, `composeStateProse.js` +2, `presumptionCheck.js` +1, all CENSUS-1b's). This lane changes no checked source.

## Open questions for the chair

1. Convert F12's kernel crisis marks to census atoms (one channel) once the mount rows read the census? That is the composer lane's change, with `dossierMounts.js` and its walker.
2. The mute claims (the food-endurance pools, strategic value LOW, uncontested niches, war-rested): twin, silent slot, or re-key? Each pool is minority-state, so R-G's bar ("empty for most births") is not met.
3. `walls` on DS-DEF-1 WEAK v2: a kernel mark (with the mount row declaring walls) or a census `walls` atom? The tag slot reads the word `walls` as the kernel's today.
4. Should CENSUS-1c carry the render-time K notes into the soak ledger before CENSUS-5b declares more? Without them, `declared-share` and `cert:false-presumption` cannot see a kernel declaration.

---

# CENSUS-5b — the off-census pools, the mute twins, DS-DEF-1 WEAK v2's walls (lane record, 2026-11-05)

> A build seat's record for the chair. Same branch, base `40f0490ad` (CENSUS-5's tip). Merged first: `origin/lane/census-1b-2026-11-04` at `d6f8456be` (R-J, the render ledger; `ea641f692`), then 1d's tip `7dc90a6f7` (R-H, the display sites, the two declaration registers; `9eeda1d9f`), each with the wiring census re-taken through its door. Transport push after every unit; no pull request.

## The units

| unit | commit | what |
|---|---|---|
| merge | `ea641f692` | 1c's render ledger (R-J) |
| 1 | `a5ee3fb53` | DS-DEF-1 WEAK v2 declares `walls` (R-O); the `defense.postureHeader` mount row declares `['threat', 'walls']` |
| 2 | `5b65db04c` | item 5: the off-census pools read; 5 wired baseline-conflict declarations with twins; 38 carried declarations (13 twins) for 1d's wiring |
| merge | `9eeda1d9f` | 1d's R-H (the disjunction), display sites, registers |
| 3 | `c00b30eb6` | item 6: the four pools that would go mute under their own crisis, one twin each (R-L) |
| doc | (this commit) | this record |

## How this seat spelled the declarations (the chair's rulings this lane made, recorded, vetoable)

- **C5b-1, a line declares only what its branch does not guarantee.** An inline T branch's `if (inst.hasWalls)` is the line's key (design §3.1: key-guaranteed atoms are never re-declared on a line). Every line of the named pools was read. Only lines that presume an atom their branch does not test declare it.
- **C5b-2, declared sibling sets beside the original (CENSUS-1c's shape), keyed by the printed text.** The originals stay where their string consumers read them, so nothing about a consumer changes. Where 1c already resolves the table through `resolveSibling` (`governanceNarrative.js :: BASELINE_CONFLICT_SIBLINGS`), the declaration is enforced at once. Everywhere else the table is CARRIED, with no consumer: the site is CENSUS-1d's to route (R-C; no draw site wired here). No `textOf` helper was added, because `drawDeclared.js :: lineText` already is that helper (R-C's "one helper").
- **C5b-3, a twin at a T site moves only its refused births.** A T lookup has no draw, so a twin adds no 1/(n+1) share. Without a twin, `resolveSibling` keeps the original, so a declaration with no twin is census-only at a T site. Twins were added where the record contradicts the line in measured births; R-site names (faction names) get none (an addition to an R stream, which is the chair's to price).
- **C5b-4, "Town watch and militia" declares the watch alone.** On the 1,000 it printed 48 times: `watch` was false in 0, `militia` in 48. Its towns hold a watch, and "militia" reads as the watch's levy. Declaring both (a conjunction) would refuse a true line every time.
- **C5b-5, `ruler: council` is too narrow for "fund the council".** A High Theocratic Council reads `ruler: priest` (soak1k-269), so the atom would refuse a true line. The two council lines stay undeclared, waiting on a council-presence atom (open question 3).
- **C5b-6, `priest` is not declared at the power step.** The baseline conflict's facts are a names-only record with no NPCs (`factsOf({ institutions })`), so `priest` reads false for every birth there. The two priest lines wait on the site handing the final record (open question 4).
- **C5b-7, the calm double gains 1c's getters.** `tests/helpers/calmFactsDouble.js` (R-N, this lane's helper) promises "every presence atom holds". It now also holds `soldiers`, `commander` and `faith.seniorCleric`, which 1c added after the double was written. Its six importers' reds are the base's, title for title.

## Item 5 — the off-census pools

| surface · pool (Appendix B row) | site kind · wired? | lines read | declaring | twins (share) | refused today (1,000, printed / false) | pure colour |
|---|---|---|---|---|---|---|
| Power · `governanceNarrative` baseline conflicts (69) | T · **wired by 1c** | ≈95 | 1 → **6** | 1 → **6** (5 new, below) | church "market day activities" 15 / 13 · "sells the most at market" 1 / 1 · militia captain, miller, market-day undercut 0 / 0 | the 15 stress narratives (stress-keyed; "three factions", "last winter" → the register's "needs a field / no atom") |
| Defense · `safetyProfile` (78) | T · carried | ≈128 | **10** | **10** (0 now) | the watch under succession 61 / 30, migration 63 / 28, revolt 61 / 25, insurgency 43 / 22, displacement 71 / 32; walls beside a garrison 52 / 3, beside a gate 229 / 0; thin watch 2 / 1; merchant army's watch 32 / 0; garrison chaplain 12 / 0 | the strain labels and descs (stress-keyed); "wizard's tower" → needs a home (no atom) |
| Power · `rulingStructure` descriptions (68) | T · carried | ≈60 | **7** | **2** (0 now) | Town watch and militia 48 / 0 · city garrison lines 101 / 0, 30 / 0 · market-day traders 8 / 0 · part-time militia 7 / 1 · armed patrol 34 / 13 | govDescBy* (label-keyed) |
| Power · `stressFactions` (70) | T | ≈39 | 0 | 0 | — | **all** (stress-keyed), pending the register |
| Factions · `FACTION_DESCRIPTORS` (66/67) | R · carried | 90 | **17** | 0 (an R stream) | Garrison Bloc 29 / 0 · Order of the Watch 29 / 0 | the rest |
| Power · `STRESS_RUMORS` (39) | R | 4 | 0 | 0 | — | **all** (the relationship's own text) |
| Power · `powerSupport :: ALIGNED_BASIS` (92) | T | 13 | 0 | 0 | — | **all** (archetype-keyed) |
| Power · `rulingPower` (116) | T · carried | 18 | **2** (`temple`; election "Stable" `crisis: calm`) | 0 | play-time (a transfer of power), not soaked | the rest |
| Defense · `threatProfile :: THREAT_TYPE_TEMPLATES` (118) | T · carried | 12 templates | **2** (siege "the walls"; unrest victims "the watch") | **1** (0 now) | not printed on the 1,000 | the rest |
| Defense · `threatDefensePolicy` (79) | T | 2 tables | 0 | 0 | — | **all** (catalogue names) |
| War · `warRemembrance` (105) | T | 23 | 0 | 0 | — | **all** (the world ledger's bands) |
| Faith · `faithPanelModel` / `deityEffects` (108/109) | A | 15 | 0 | 0 | — | **all** (cause- and axis-keyed) |

"Pure colour" is listed, **pending the register**. 1d's register reads the state-prose corpus only, and the off-census tables have no `{colour}` slot yet (the census's `tablePools`, design §3.5). No R-M leaked condition occurs in these files.

## The new lines (the chair's rulings, R-G / R-L; the owner reads them after the fact)

**Wired (they move births now; a T site, so each moves exactly its refused births):**

| original (its atom) | twin | share on the 1,000 |
|---|---|---|
| "The village militia captain is pushing for authority over disputes that the reeve used to handle." (`militia`) | "The strongest armed household is pushing for authority over disputes that the reeve used to handle." | 0 |
| "The miller and the largest farming household are in dispute over prices and access." (`institution: mill`) | "The largest farming household and the traders who buy from it are in dispute over prices and access." | 0 |
| "The household that sells the most at market has been throwing its weight around in community decisions." (`market`) | "The household that sells the most beyond the settlement has been throwing its weight around in community decisions." | 1 (soak1k-252) |
| "Two households have been undercutting each other on market day for months. …" (`market`) | "Two households have been undercutting each other on every sale for months. …" | 0 |
| "The church wants approval rights over market day activities. The village reeve disagrees." (`market`) | "The church wants approval rights over who may trade and when. The village reeve disagrees." | 13 (soak1k-18, -60, -97, -182 …) |

**Carried (0 now; at 1d's wiring each moves exactly the refused births measured above).** The safety profile's ten: the watch → "whoever keeps order" / "those who keep order"; "the walls and gates" → "the approaches"; "gates and walls" → "gates"; "The watch is too thinly spread" → "Enforcement is too thinly spread"; "The watch is looking the other way" → "No one with the authority to stop it is trying"; "The garrison chaplain and the commander are the same man" → "The settlement's chaplain also leads its armed men". The roster's two: "Part-time armed volunteers…", "Armed patrol of able-bodied residents…". The siege template: "…pressing the settlement".

**The mute twins (item 6), each `crisis: <kinds>` (R-I), each the only survivor under its crisis and refused everywhere else:**

| pool | the claims now declare | twin (v4) |
|---|---|---|
| DS-DEF-1 strategic value LOW | `no crisis: under_siege, occupied` (v1–v3) | `[counterforce]` Nothing at {settlement} was worth an army's season by any sensible reckoning, and somebody has come for it anyway; the town's plainness is no defense now. |
| DS-WAR-1 warExhaustion rested | `no crisis: under_siege, occupied` (v1, v2); v3 also `wartime` | `[unfolding]` {settlement} came to this fighting rested, with nothing spent before it began; that reserve is the town's whole advantage, and the fighting now draws on it daily. |
| DS-FTH-3 every niche uncontested | `no crisis: religious_conversion` (v1; v2, v3 by CENSUS-5) | `[threshold]` On paper each of the town's creeds still has its separate calling; the conversion pressing on {settlement} is not a quarrel between them but a pull on every household at once. |
| DS-FTH-3 LEGITIMACY secure | `no crisis: religious_conversion` (v1–v3) | `[ledger]` The patron's claim was settled long before the conversion reached {settlement}, and it is being tested now by people who never thought to question it. |

A twin moves no birth outside its state, because the pool was otherwise mute there. No silent slot was chosen. The mute scan (every DS-DEF/POW/REL/WAR/FTH pool under each single crisis kind, walls both ways) found **0 mute pools at the base and 0 at the tip**: rung 2D's and CENSUS-5's declarations had left none, and every pool this lane mutes is filled by its twin. Food endurance is CENSUS-3c's (R-K) and is not touched here.

## Waiting / owed (the line is left as it is)

| line | presumes | waiting on |
|---|---|---|
| `rulingStructure` "…and fund the council" (crossroads) · "…expect council access in return" | a council beside the ruler | a council-presence atom; `ruler: council` refuses a theocratic council (C5b-5) |
| `governanceNarrative` "The priest has been asking questions…" · "The local priest has declared…" | priest | the baseline-conflict site handing the final record (C5b-6) |
| `rulingPower` election "Stable: a fresh mandate…" | no crisis | a twin's wording, once a transfer of power is soaked (play-time) |
| `settlementNarrative :: genSuccessionNarr` "`ctx.milForce` or 'the garrison'" fallback; "the same market" | garrison; market | INTAKE (not in this lane's list): the Power area's next lane |
| DS-DEF-6 "The soldiers at {settlement} are paid"; DS-DEF-4 crime lines | soldiers; crime | CENSUS-5's owed rows: `soldiers` now exists (1c); `crime` is CENSUS-3b's |

## The 60 and the 1,000 (R-B: before = the merged base `10bd39e21` = CENSUS-5's tip + 1d's tip, without this lane's units; after = `c00b30eb6`)

| run | settlements · findings · errors · verdict | `coh:crisis-blind-prose` | other contradiction classes | `cert:*` · `cert:false-presumption` | records moved | pages moved |
|---|---|---|---|---|---|---|
| 60 | 60 · 171 → 171 · 0 → 0 · STOP → STOP | 19 → 19 | none (`coh:defence-words`, `coh:faith-denial`, `coh:crisis` 0 → 0) | none · **0 → 0** | 1 (soak1k-18) | 3 settlements (power 1, defense 2) |
| 1,000 | 1,000 · 2,549 → 2,549 · 0 → 0 · STOP → STOP | 241 → 241 | none; `A-12:self-vouch-false` 14 → 14; the nine `reader:*` classes identical | none · **0 → 0** | **14** = 13 church market-day + 1 sells-at-market, the measured set exactly | — |

The STOP on both sides is the base's. `coh:crisis-blind-prose` fires on rung 2D unit 3's other claims (current stability 119, nothing is failing 34, stable institutional competition 33, food secure 32, depends on none alone 22, competent administration 21, pilgrims 3, a year closed ahead 3), which belong to CENSUS-3c/4b. **On this lane's claims it reads 0 by claim before and after.** The DS-POW/DEF/WAR/FTH calm claims under their own crises are 0, and the four mute pools now speak their twin instead.

**`cert:false-presumption` is now meaningful for these pools.** 1c's render ledger sees the kernel's display-time draws. The 1,000's ledger noted 4,937 declared draws in tab:dossier (4,811 at the base) and 462 in the power baseline conflicts (114). Every one was re-asserted against the final record, and **0 failed**.

`declared-share` by surface (the 1,000, the soak's own aggregate): tab:dossier 4,811 → 4,937 of 213,783 (0.023), power 114 → 462 of 462 (1.000), npcs 543 of 39,351 (unchanged). By family on the 60 (a scratch probe over the same ledger): DS-DEF 176 → 181 of 1,013 (0.179), DS-POW 22 of 592 (0.037), DS-REL 0 of 440, DS-FTH 0 of 60, DS-WAR not drawn on the 60 (no world war), the governance baseline conflicts 0 → 27 of 27, the military modifier 3 of 3.

## Rows moved, by cause (never re-recorded)

- **Golden records:** 0 of 525 against the base's own output, at unit 2 (the baseline conflicts this lane twins do not occur in the corpus). Units 1 and 3 are display only. The base is red on all 525 against the recorded manifest, from 1c's unrecorded moves, not this lane's.
- **Soak records:** 14 of 1,000 (unit 2's wired twins; the list above).
- **Wiring census:** re-taken through its door at every unit and merge. Unit 1 moved the `dossierMounts.js` stamp. Unit 3 moved 4 pool rows (variants 2,324 → 2,328). The two merges moved stamps only.
- **Mount registry:** `defense.postureHeader` declares `['threat', 'walls']` (unit 1; the walker's honesty rule).
- **Generated leaves:** `defense` (units 1, 3) and `warFaith` (unit 3), through `npm run gen:dossier-prose` only, `--check` green.
- **The declaration registers (1d):** `declarationRegisters.test.js` is red on this branch in two arms, both from CENSUS-5's and 5b's declarations, and both are the compose's re-take. (a) The crisis-scoped register does not pin CENSUS-5's 14 opted pools. (b) The undeclared register reads falls, among them DS-DEF-1 / DS-FTH-3 / DS-WAR-1 from this lane and the DS-DEF/POW/WAR/FTH rows from CENSUS-5.
- **Test pins re-keyed by cause:** `stateProseKernel.test.js` twice (the non-vacuity floor 716 → 715 for unit 1's walls dimension; the calm reference sets aside a crisis-needing variant for unit 3); `defenceTwinLines.test.js` (reads the defence-atom sets of the shared baseline table, unit 2); `calmFactsDouble.js` gains 1c's getters (C5b-7).
- **Red-firsts:** `defenseWeakPerimeterWalls.test.js` 3/4 red at `ea641f692`; `census5bOffCensusDeclarations.test.js` 13/13 red at `a5ee3fb53`; `census5bMuteTwins.test.js` 5/5 red at `9eeda1d9f`. All green at the tip.
- **Governing suites, per unit, title for title against the unit's own base:** unit 1, 45 files, the base's 55 reds; unit 2, 150 files, the base's 69; unit 3, 74 files, the pre-unit tip's 64. No new red. Two of the base's reds this lane makes larger without causing them: the `power/` module ceiling (800; 826 / 820 at the base, +25 / +42 here), and the golden master (above).
- **Typecheck:** `typecheck:ratchet` green; `typecheck:domain:strict` red at the base and at the tip with the same two files (`crisisFactFindings.js` +4, `composeStateProse.js` +2), neither touched here.

## Where CENSUS-5c starts

1. The `{colour}` rulings on the DS-REL / DS-FTH / DS-WAR pools that presume nothing beyond their keys. 1d's register now gives a `{colour}` pool its reading; CENSUS-5 left these "for that register's first pass".
2. CENSUS-5's owed DS-DEF-6 "The soldiers at {settlement} are paid" (`soldiers` exists since 1c) and DS-DEF-4's crime lines once CENSUS-3b's `crime` lands.
3. The carried tables become enforced when CENSUS-1d/1e routes their sites (`safetyProfile`, the `rulingStructure` descriptions, `FACTION_DESCRIPTORS`, `THREAT_TYPE_TEMPLATES`, `rulingPower`). The census lane should enrol each table as a `tablePools` row.
4. The waiting rows above.

## Open questions for the chair

1. The two `declarationRegisters.test.js` arms red on this branch: confirm the compose re-takes them (CENSUS-5's 14 pools plus the falls), not the lane.
2. The `power/` module ceiling (800), red at the base: split the two modules, or move the sibling tables to a sibling data module? The tables stand beside their originals, which is 1c's shape.
3. A council-presence atom (C5b-5): "fund the council" is true under a theocratic council, so `ruler: council` cannot carry it.
4. The baseline-conflict site's facts hold no NPCs (C5b-6): should 1d/1e hand that site the final record, so `priest` can be declared there?

---

# CENSUS-5c — the {colour} rulings, the owed lines, the power split, the militia sets measured (lane record, 2026-11-05)

> A build seat's record for the chair. Same branch, base CENSUS-5b's tip `abed36651`. Merged first: `origin/lane/census-1b-2026-11-04` at `6e2cb6d65` (CENSUS-1e: the `safetyProfile`, `rulingStructure` and `threatProfile` sibling sets wired), as `ff4128242`; clean, `gen:dossier-prose --check` and the wiring census `--check` green. Fetched again before unit 4: no new commit on 1b. Transport push after every unit; no pull request.

## The units

| unit | commit | what |
|---|---|---|
| merge | `ff4128242` | 1b at `6e2cb6d65` (1e's T sites) |
| 1 | `bf41923` | R-AB, answer 2: the power sibling tables move to `src/data/powerSiblings.js`, byte-identical |
| 2 | `6dd3f9766` | R-R: 113 DS-REL / DS-FTH / DS-WAR pools read and braced `{colour}` |
| 3 | `8b304b8d8` | the owed lines (`soldiers`, `organised crime`) and the presumptions unit 2's reading found |
| R-A ruling | `b3d4fa202` | the chair's 05:25 ruling: `FACTION_DESC_SIBLINGS`' militia sets measured at the draw, reworded (R-Q → R-U) |
| 4 | (no commit) | the carried tables, measured where 1e enforces them; no slot empties, so no twin |
| doc | (this commit) | this record |

## Unit 1 — the split (R-AB)

`BASELINE_CONFLICT_SIBLINGS`, `MILITARY_MODIFIER_SIBLINGS` and `FACTION_DESC_SIBLINGS` (with `declaredSet`) moved verbatim to `src/data/powerSiblings.js`. Both `power/` modules re-export them on their existing one-line import, so no cited line moves. The three exported tables deep-equal base and tip, and both modules' export sets are identical. **The ceiling (`powerStructure.test.js`, 800 raw lines): 851 / 873 at the merged base → 813 / 819 (→ 817 after the R-A unit).** It is still red, but only by the overage it had before the census: 813 / 807 at `358b0a841`, CENSUS-5's cut, before any sibling table existed. The ceiling is not raised. Getting under 800 means decomposing logic, which is outside a census lane's scope.

## Unit 2 — the `{colour}` rulings (R-R; the chair's ruling under the delegation, vetoable)

Every line of the 151 DS-REL / DS-FTH / DS-WAR pools was read. **The rule:** a pool is braced only when no line in it declares and no line presumes a fact beyond its key. A pool with one declared line is not pure colour by definition, so it stays in the register with its other lines.

| family | pools | braced `{colour}` | left in the register (why) |
|---|---|---|---|
| DS-REL | 13 | **12** (DS-REL-1's seven relationship types, the two cross-settlement pools; DS-REL-2's three) | `trade_partner` (declares `market`) |
| DS-FTH | 52 | **34** | the ten pools that declare a line; ARC rising and DEVOTION lukewarm v3 ("the clergy": `priest`?); CULTS v3 ("its own quarter of the town", several cults); STANDING cult ("Its shrine is real": `sacredHouse`, R-AE, not homed); NICHE slots open ("Shrines stand unclaimed"); PANTHEON Major v2 (the lawfulness of magic as a live question); PILGRIM thin ("the town's inns": `institution: tavern`?); LEGITIMACY established (now declared, unit 3) |
| DS-WAR | 86 | **67** | the pools that declare (walls/gate/market twins, rested, WAR-3); DS-WAR-5 posture peace, null, live front, phantom front, blockade stamped ("the water"), siege_lifted, trade_realignment (unit 3 declares five of their lines) |
| **total** | **151** | **113** | |

The off-census tables CENSUS-5b listed as "pure colour, pending the register" are ruled `{colour}` here: `stressFactions` (the stress-keyed faction descriptions), `settlementNarrative :: STRESS_RUMORS` (the relationship's own text), `powerSupport :: ALIGNED_BASIS` (row 92, archetype labels; no label names a fact), `threatDefensePolicy` (catalogue names), `warRemembrance` (the world ledger's bands), and the faith panel tables (`faithPanelModel`, `deityEffects`; cause- and axis-keyed). I spot-checked 5b's reading and it holds. **No brace is applied to these tables, because none can be:** the table half of the registers (`tablePools`, CENSUS-1e's unit 3c) does not exist, and no reader has a table-level `{colour}` channel. This list is the row set for 3c to ingest. I did not invent a marker that 3c might spell differently.

**Mechanics.** DS-REL-1's eight compact one-line rows were unfolded into a label plus numbered lines, because the projector reads a brace only on a standalone label. The keys, the variants and their order are unchanged. **Byte-identity 0:** the regenerated leaves differ from HEAD's in exactly 113 `poolMeta.colour` entries and nothing else (deep compare), and `colour` has no reader in the kernel or in `drawDeclared`. **The undeclared register** (read by its own reader): 2,118 → 1,775 lines, 688 → 575 pools (DS-REL 41 → 2, DS-WAR 242 → 40, DS-FTH 141 → 39). It is not re-pinned (R-T).

## Unit 3 — the owed lines and the reading's presumptions

| line | declares | why |
|---|---|---|
| DS-DEF-6 Well-funded v2 "The soldiers at {settlement} are paid" | `soldiers` | owed since CENSUS-5 (1c's getter) |
| DS-DEF-4 capture none v2 "There is a criminal interest … with the means" | `organised crime` | owed (3b's getter) |
| DS-DEF-4 structure null v1 "No criminal infrastructure has been identified" | `no organised crime` | owed. Diffuse crime is not "an organization", so the line excludes the presence atom, not `crime > none` |
| DS-FTH-3 LEGITIMACY established v1 "Nobody disputes it" | `no crisis: religious_conversion` | 5b's reading of `secure`: a conversion tests the claim |
| DS-WAR-5 posture peace v3 "a town with no soldiers to speak of" | `no soldiers` | unmounted, so it moves no birth |
| DS-WAR-5 null v1, v3 (quarrels "the ordinary kind"; "nobody … is fighting anybody") | `no crisis: unrest` | unmounted |
| DS-WAR-5 live front v2, siege_lifted v1 (the gates) | `gate` | unmounted |
| DS-WAR-5 trade_realignment v2 (the stalls) | `market` | unmounted |

There are no twins: every declared pool keeps at least two lines under the contradicting fact. **Left undeclared:** DS-FTH-1 SINK rising v1 ("Crisis has a way of ending indifference") presumes that SOME crisis is active. `crisis: any` admits everywhere (R-H), and the bare `crisis` is F12's kernel mark word, a mount dimension DS-FTH-1 does not declare, so the line waits on CENSUS-1d unit 8 (R-O). Red-first: `census5cOwedLines.test.js` was 10/10 red at `6dd3f9766`.

## The chair's ruling of 05:25 (R-A) — the militia sets measured

**The measurement.** On the 1,000, a probe hook at `rulingStructure`'s military-description draw (in a scratch worktree) compared the native roster's `factsOf(...).defence` with `factsOf(final record).defence` at every power step of every birth (2,121 steps):

| component | differs at draw vs final |
|---|---|
| watch | **0** (settled) |
| garrison | **9** (not settled) |
| militia | **33** (not settled; false at the draw and true at the end: soak1k-73, -85, -229, -331, -558, -559 …) |

The two sets presume a militia, and a militia is not settled at that draw, so R-V does not apply. **R-U:** both lines are reworded at their branch to their own twins' wording. That wording is CENSUS-5b's, already the chair's ruling (R-G), so no new line is added. Both sets leave `FACTION_DESC_SIBLINGS`.

- "Part-time militia with limited organisation; …" → "Part-time armed volunteers with limited organisation; …"
- "Armed patrol and informal militia; …" → "Armed patrol of able-bodied residents; …"

**Moved, by this one cause:** golden **168 of 525** rows (hamlet 84, village 84), with zero residue: every moved record equals its base record once the two strings are replaced (computed in scratch worktrees; the golden door refuses an unsigned re-record, and none was attempted). Soak records **41 of 1,000** (7 part-time, of which 1 had no militia; 34 patrol, of which 13 had none), so **14 false claims leave the page**. On the 60, 3 records (soak1k-20, -26, -56). Red-first: `census5cMilitiaReword.test.js` was 3/3 red at `8b304b8d8`.

## Unit 4 — the carried tables where 1e enforces them

No new site landed on 1b after the merge. On this tree 1e enforces `SAFETY_LINE_SIBLINGS`, `FACTION_DESC_SIBLINGS` (settled sets) and `THREAT_TEXT_SIBLINGS`. `FACTION_NAME_SIBLINGS` (an R site, never pre-filtered) and `RULING_POWER_SIBLINGS` (1d: an import cycle) stay carried.

- **The `safetyProfile` enforcement, by cause (1e's wiring of 5b's ten carried sets):** on the base 1,000's birth ledgers, a safety line resolves to its twin in **111 births** (289 draws across the generator's passes). That is consistent with the ~137 expected. It is in both BEFORE and AFTER (R-B), so it is not this lane's move.
- **No slot empties.** A T site cannot mute: a refused line with no twin keeps the original. A probe re-asserted every printed original of this lane's wired tables against `factsOf(final record)` on 300 births. **0 kept-false** in `safetyProfile`, the settled `FACTION_DESC` sets, `MILITARY_MODIFIER` and the baseline conflicts. The one kept-false class was the militia patrol line (4 of 300), which the R-A unit cured. So no twin is owed (R-G, R-L).
- **A blind spot found (open question 1).** `drawDeclared.js :: resolveSibling` keeps a refused original when its set has no twin. `note()` returns before ledgering a null resolution, so a kept-false original never reaches `cert:false-presumption`. 1e's "24 → 0" came from parking the militia sets; it does not show that the remaining twin-less sets are true. The probe above shows they are, today.

## The 60 and the 1,000 (R-B: before = the merged base `ff4128242`; after = `b3d4fa202`)

| run | settlements · findings · errors · verdict | `coh:crisis-blind-prose` | other contradiction classes | `reader:*` (6 classes) | `cert:*` · `cert:false-presumption` | records moved | sample pages moved |
|---|---|---|---|---|---|---|---|
| 60 | 60 · 104 → 104 · 0 → 0 · CLIMB → CLIMB | 2 → 2 | none (`coh:defence-words`, `coh:faith-denial`, `coh:crisis` 0 → 0) | identical | none · **0 → 0** | 3 (soak1k-20, -26, -56) | 3, the same three |
| 1,000 | 1,000 · 1,714 → 1,714 · 0 → 0 · STOP → STOP | 35 → 35 | none; `A-12:self-vouch-false` 3 → 3 | identical | none (certification 1,000 / 1,000) · **0 → 0** | **41**, exactly the militia set | 2 of 60 sampled (soak1k-290, -674), both the patrol line |

**The STOP is the base's, at the same count.** All 35 crisis-blind findings belong to other lanes: "Food Secure." under a migration (32: the mirror row CENSUS-2c retires; uncovered on this tree, R-AG) and the pilgrims queueing patiently (3: institutions). **On this lane's claims the count is 0, before and after.** For reference, the pre-merge 1,000 (5b's tip `abed36651`, re-run here) read crisis-blind 241 and A-12 14. The merge brought both down; this lane's units did not move them.

**`cert:false-presumption` 0 on both sides of the 1,000.** It re-asserted 5,354 declared kernel draws in `tab:dossier` (5,093 at the base: +261 from unit 3's declarations), 2,457 in power, 1,494 in defense and 445 in threats. Every draw passed against the final record. Caveat: a refused original with no twin is not in that count (unit 4's blind spot).

**`declared-share` (the 1,000):** power 2,457 / 2,457 (1.000) · defense 1,494 / 1,494 (1.000) · tab:threats 89 / 89 · tab:dossier 0.024 → 0.025. **DS-DEF / DS-FTH on the 60** (the scratch probe over the same ledger was not re-run). The undeclared register is a better per-family reading: DS-FTH 141 → 38 undeclared lines (34 pools `{colour}`), DS-WAR 242 → 34, DS-REL 41 → 2, DS-DEF 319 → 316 (unit 3).

## Rows moved, by cause (never re-recorded)

- **Golden records:** 168 of 525 (hamlet 84, village 84), one cause: the R-A militia reword. Zero residue. Units 1–3 move 0 (unit 1 is byte-identical by deep equality; units 2–3 are display only). The base is red on all 525 against the recorded manifest from earlier lanes' unrecorded moves (5b's note).
- **Soak records:** 41 of 1,000, the R-A unit. 0 from units 1–3.
- **Pages:** the R-A unit's 41. Unit 3 refuses display-time winners (DS-DEF-4/6, DS-FTH-3), and it moved 0 of the sampled pages on the 60 and the 1,000. The rest of the 1,000's pages are not dumped, so its full page count is not measured.
- **Wiring census:** re-taken through its door at every unit; the JSON is unchanged (no colour or declaration column yet: 3c).
- **Generated leaves:** `general`, `warFaith` (unit 2), `defense`, `warFaith` (unit 3), through `npm run gen:dossier-prose` only, `--check` green.
- **Registers:** the undeclared register falls 2,118 → 1,765 lines, 688 → 575 pools (unit 2: −343; unit 3: −10, DS-DEF −3, DS-WAR −6, DS-FTH −1). `declarationRegisters.test.js` stays red in its two arms (5b's, plus these falls). That is the compose's re-take (R-T, answer 1), and it is not re-pinned here.
- **Test pins re-keyed by cause:** `calmFactsDouble.js` gains `crime: 'organized'` (C5b-7's rule); `stateProseKernel.test.js`'s calm reference sets aside a variant that excludes a presence atom (unit 3); `factionDescSiblings.test.js` arm (a) reads the reworded patrol line (R-A).
- **Governing suites, title for title against the merged base:** unit 1, 30 files; unit 2, 26 files, the base's 23 reds; unit 3, 35 files, the base's 31; R-A, 25 files, the base's reds. No new red. The `power/` ceiling falls (851 / 873 → 813 / 817) and is still red by its pre-census overage.
- **Typecheck:** `typecheck:ratchet` green; `typecheck:domain:strict` red at the base and the tip with the same two files (`crisisFactFindings.js` +4, `composeStateProse.js` +2), neither touched.

## Waiting (the line is left as it is)

| line | presumes | waiting on |
|---|---|---|
| DS-FTH-1 SINK rising v1 "Crisis has a way of ending indifference" | some crisis | CENSUS-1d unit 8 (R-O: bare `crisis` is a kernel mount word) |
| DS-FTH-1 ARC rising v3 / DEVOTION lukewarm v3 "the clergy" | a cleric | the reading of `priest` (a senior cleric) at the faith desk |
| DS-FTH-3 STANDING cult v2, NICHE slots open v1 (shrines) | a sacred house | `sacredHouse` (R-AE, the mechanism lane) |
| DS-FTH-3 PILGRIM thin v1 "the town's inns" | tavern | `institution: tavern` read at the faith desk |
| DS-FTH-1 CULTS v3 "several … its own quarter of the town" | several cults; a town | no atom for cult count; `tier: ≥ town` possible |
| DS-WAR-5 phantom front v1, live front v3, siege_lifted v2 (walls); blockade stamped v3 ("the water") | walls; water | unmounted block; walls is a kernel dimension with no mount row |
| `rulingStructure` "fund the council" · "council access" | a council body | "waiting on council" (R-AE) |
| `governanceNarrative` the priest baseline lines | priest | "waiting on order" (R-Q, answer 4) |
| the three `FACTION_DESC_SIBLINGS` garrison sets | garrison | measured NOT settled at the draw (9 of 2,121 steps); open question 2 |
| `BASELINE_CONFLICT_SIBLINGS` militia captain | militia | the same R-Q question at the governance draw (0 prints on the 1,000 at 5b) |

## Where CENSUS-5d starts

1. The chair's answers to the questions below (the twin-less refusal blind spot; the garrison sets).
2. The waiting rows above, as their atoms land (`sacredHouse`, `council`, unit 8's bare `crisis`).
3. The off-census `{colour}` list goes into 3c's `tablePools` when it exists. The mixed DS-FTH/WAR pools leave the register as their last presumption is declared.

## Open questions for the chair

1. **A refused original with no twin is silent to the self-check.** `resolveSibling` keeps the original and `note()` never ledgers a null resolution, so `cert:false-presumption` cannot see a kept-false line. Should 1f ledger it (as `resolvedBy: 'none'` with the original's atoms), so the cert reads every printed T line?
2. **The `garrison` sets at the faction-description draw:** garrison is not settled there (9 differences). Three twin-less sets still declare it, and they are true on the final record today (0 kept-false on 300 births). Reword under R-U as the militia sets were, or leave them while they are measured true?
3. **Pool-level `{colour}` for a mixed pool:** a pool with one declared line and two colour lines keeps those two in the register. Does that stay the rule (my reading), or may such a pool carry `{colour}` beside its declarations?

# CENSUS-5d — the garrison sets reworded, the four families read line by line, the waiting lines, the colour tables enrolled (lane record, 2026-11-05)

> A build seat's record for the chair. Same branch, base CENSUS-5c's tip `eda74442a`. Merged: `origin/lane/census-1b-2026-11-04` at `4818948` (1f) as `ebd84ce` (the merged base: BEFORE for the 1,000); at `99b0036` (1f docs) as `da93361`; at `28c6d2a` (1g units 1–2: R-AO's `colour` spelling, R-AM's ledgering) as `aa83044`; at `e8b0072` (1g units 2b–5: unit 3c `tablePools`, R-AL, R-AJ) as `7f1d2d1`. Every merge re-took the wiring census through its door (R-D) and kept `gen:dossier-prose --check` green. A transport push after every unit; no pull request. Not landed on 1g's lane at this tip: unit 8 (bare "some crisis") and a `council` home ("no bodies reader", 1f `fc45cc1`).

## The units

| unit | commit | what |
|---|---|---|
| merge | `ebd84ce` | 1f at `4818948` (`sacredHouse`, the v0 tag slot) |
| 1 (answer 2) | `1b74763` | R-AN / R-U: the three twin-less `FACTION_DESC_SIBLINGS` garrison sets reworded |
| 3a | `d5b8044` | the waiting faith lines declare as their atoms land (`sacredHouse`, `priest`, `institution: tavern`); CULTS v3 reworded |
| merge | `aa83044` | 1g units 1–2 (R-AO, R-AM) |
| 2a (answer 3) | `c24d711` | R-AO: DS-FTH / DS-WAR read line by line (60 lines `colour`, 5 declared, 1 reword) |
| 2b | `f260dba` + fix `152a4a0` | R-R / R-AO: DS-DEF / DS-POW read line by line (137 pools `{colour}`, 92 lines `colour`, 33 declared, 2 rewords) |
| merge | `7f1d2d1` | 1g units 2b–5 (one conflict, the Military Council line, resolved to this lane's wording) |
| 3b | `2a8fdd2` | 5c's off-census colour list into `tablePools` (the two one-export tables 1g left) |
| doc | (this commit) | this record |

## Unit 1 — the garrison sets (the chair's answer 2; R-AN, R-U)

Garrison differs between the faction-description draw and the final record on 9 of 2,121 steps (5c's probe), so it is not settled there. Watch differs on 0, so it is settled (R-V). Each line now presumes only its branch plus the settled watch. **No new line; every set keeps the original slot.**

| was | now | declares |
|---|---|---|
| "Military commanders and garrison officers hold decisive political weight; …" | "Military commanders and their officers hold …" | nothing (leaves the table) |
| "Well-funded garrison and city watch; …" | "Well-funded city watch; …" | `watch` |
| "Garrison and city watch; law enforcement and external defence, …" | "City watch; law enforcement and external defence, …" | `watch` |

**Moved, one cause:** golden **168 of 525** (city 84, metropolis 84), zero residue once the three strings are replaced (measured at unit 1, and again at the tip against `ebd84ce`: the same 168, zero residue); never re-recorded. **A finding:** the Military Council `said()` sat in an eagerly built object literal, so it was ledgered on every power step, printed or not. The power ledger's drawn count falls 147 → 72 on the 60 and 2,531 → 1,424 on the 1,000. 1g found the same thing independently (`1261515`, R-AM: 1,884 phantom kept-refused findings), and the merge took this lane's wording.

## Unit 3a — the waiting faith lines (their atoms landed)

| line | declares |
|---|---|
| DS-FTH-3 STANDING cult v2 "Its shrine is real" · NICHE slots open v1 "Shrines stand unclaimed" · DS-FTH-1 CULTS v1 "keep their own shrines" | `sacredHouse` (R-AE, 1f) |
| DS-FTH-1 DEVOTION lukewarm v3 · ARC rising v3 ("the clergy") | `priest` |
| DS-FTH-3 PILGRIM SEASON thin v1 "the town's inns" | `institution: tavern` |
| DS-FTH-1 CULTS v3 "Several lesser rites … its own quarter of the town" | reworded (R-U): "What else is kept here runs alongside the patron's rite, with its own days and its own corner of {settlement}." |

"The clergy" is satisfied by a named senior cleric OR a sacred house. On the golden corpus 60 births hold the cleric without a house and 36 the house without a cleric. That is a disjunction no line may declare (R-U), so each line declares the likelier fact. **`clergy` = priest ∨ sacredHouse is a wave-2 composite candidate (2 lines want it).** No twin is needed: each pool keeps ≥ 2 lines under the contradicting fact. `calmFactsDouble.js` gains `sacredHouse: true` (R-N's one double).

## Unit 2 — the per-line colour marks and the pool braces (the chair's answer 3; R-AO, R-R)

**The rule applied (the chair's ruling under the delegation, vetoable):** this seat READ every undeclared line of DS-DEF, DS-POW, DS-FTH and DS-WAR (625 lines). A line that presumes nothing beyond its pool key takes `colour`, and a keyed pool does not re-declare its key (R-B1), so the wall in a "walls present" pool is colour. A pool whose every line is colour takes the pool-level `{colour}` (R-R). A mixed pool's colour lines take the per-line mark (R-AO). A line that presumes a fact its key does not guarantee declares it; where it cannot be decided, it declares (R-AD). No unread line is marked.

| family | undeclared before → after | pools `{colour}` | lines `colour` | declared by the reading | reworded | left (waiting) |
|---|---|---|---|---|---|---|
| DS-DEF | 316 → **1** | 70 | 73 | 30 (watch 11, walls 10, gate 7, garrison 2, magic 2; two lines carry two atoms) | 1: Court + Prison v3 "on the same square" | Economic Survival STRONG v3 "Trouble … has not turned into a collapse" (some crisis: unit 8) |
| DS-POW | 243 → **2** | 67 | 20 | 3: FOOD adverse v1 `institution: granary` ("the granary door"), v2 `crisis: hunger` ("Hunger at"), criminal revenue v3 `market` (R-AD) | 1: Endorsed v4 "the watch is not the reason" → "enforcement is not the reason" | receipt deferred v2 (the alignment cap), v3 (an outbid): the deferral's reason has no home |
| DS-WAR | 34 → **0** | — | 30 | 4: live front v3, phantom front v1, siege_lifted v2 `walls`; blockade v3 ("points at the water") `navigable` | 1: blockade v1 "the roads or the harbour" → "the routes" | — |
| DS-FTH | 32 → **1** | — | 30 | 1: PANTHEON Major v2 ("the lawfulness of magic") `magic` | — | SINK arc rising v1 "Crisis has a way of ending indifference" (unit 8) |

(Counted from the tip's leaves: 137 pool braces and 93 line marks on DS-DEF/POW (2b's 92 plus Endorsed v4 after the fix), 60 line marks on DS-WAR/FTH (2a). Atoms added across the lane's units: watch 11, walls 13, gate 7, sacredHouse 3, magic 3, garrison 2, priest 2, granary, tavern, market, navigable and hunger 1 each.) **Endorsed v4 is reworded rather than declared:** it is the pool's one `{settlement}`-only line, the anchored-liveness floor when a `{seat}` fill is refused (`powerStateProseDesk.test.js`). Declaring `watch` muted the banner in a watch-less town (red at `f260dba`, green after `152a4a0`). Unit 2b's commit text says "34 declared / watch 13, gate 6"; the true count after the fix is 33 (watch 11, walls 10, gate 7, garrison 2, magic 2, granary 1, hunger 1, market 1). **No twin anywhere:** every declaring pool keeps a line under the contradicting fact. **The undeclared register (its own reader): 1,126 → 499 lines, 399 → 179 pools** on this lane's units (from 1,126 at the merged base `da93361`). These four families now hold 4 undeclared lines in all. Not re-pinned (R-T): the compose re-takes it.

## Unit 3b — `tablePools` (unit 3c landed: 1g `1425ac7`)

1g enrolled the one-export tables of 5c's `{colour}` list (ALIGNED_BASIS, DEFENSE_PREFERENCES, the three faith-panel tables). This unit enrols the two it left, with the census's own `colour` ruling: `warRemembrance.WAR_ENDING_TELLINGS` (11 lines, `{victor}` its only slot) and `deityEffects.DEITY_AXIS_EFFECTS` (13 `effect` lines, through a `lines` accessor). `stressFactions` (inline T branches) and `STRESS_RUMORS` (2e's) are not a single export, so they stay listed only.

## The 60 and the 1,000 (R-B: before = the merged base `ebd84ce`; after = the tip `2a8fdd2`)

| run | settlements · findings · errors · verdict | `coh:*` (incl. `crisis-blind-prose`, `defence-words`, `faith-denial`, `crisis`) | `cert:false-presumption` | `reader:*` | records moved |
|---|---|---|---|---|---|
| 60 | 60 · 101 → 119 · 0 → 0 · CLIMB → STOP | 0 → 0 | 0 → **18**, all `foodBalance:OUTLOOK_HOOK_SIBLINGS` | identical | 9 (city / metropolis: unit 1) |
| 1,000 | 1,000 · 1,662 → 1,912 · 0 → 0 · CLIMB → STOP | 0 → 0 | 0 → **250** (161 births), all `foodBalance:OUTLOOK_HOOK_SIBLINGS` | identical except `tension-memory` 60 → 61 | 144 (135 city/metropolis: unit 1; 9 lower-tier, consistent with 1g's R-AL history change, merged; inferred from tier, not traced) |

**The STOP is not this lane's.** Every one of the 250 `cert:false-presumption` findings is R-AM's instrument finally seeing a kept-refused original in `OUTLOOK_HOOK_SIBLINGS` (the food lane's / 1f unit 3c's sets: `tier: <= village`, `food: ≤ deficit`). By R-AM that is a rise by cause and not a STOP, and the owning lane twins or rewords. **On this lane's pools, `cert:false-presumption` is 0** (FACTION_DESC, MILITARY_MODIFIER, the baseline conflicts, the safety and threat sets, and every DS-DEF/POW/FTH/WAR declaration). Certification holds at 1,000 / 1,000 (no `cert:*` other than that class).

**`declared-share` (the 1,000):** power 1,424 / 1,424 (1.000; was 2,531 / 2,531, and the drop is unit 1's eager-ledger finding) · defense 1,494 / 1,494 · tab:threats 89 / 89 · tab:dossier 49,082 → 49,654 of 213,133 (0.230 → 0.233). A `colour` mark is silence to the ledger by design (R-AO), so the share moves only with the 38 new atom declarations. Per family, the register is the reading: DS-DEF 1, DS-POW 2, DS-FTH 1, DS-WAR 0 undeclared lines. **Pages (the 60's samples):** unit 2b moved 20 pages / 22 lines, every one a declared line refused where the record holds no watch, gate or wall (e.g. the compound override's "the watch is arranged around that" in watch-less thorps). Units 2a, 3a and 3b moved 0 sampled pages.

## Rows moved, by cause (never re-recorded)

- **Golden:** 168 of 525 (city 84, metropolis 84), one cause (unit 1), zero residue. Every other unit is display, data or scripts: 0.
- **Soak records:** 144 of 1,000 against the merged base; about 135 by unit 1 (see the table).
- **Generated leaves:** `warFaith` (3a, 2a), `defense` and `power` (2b and its fix), through `gen:dossier-prose` only, `--check` green. 2b's leaves differ from HEAD in exactly 137 `poolMeta.colour`, 126 marks and one text.
- **Wiring census:** re-taken through its door at every unit and merge; `tablePools` +2 rows (3b).
- **Registers:** undeclared 1,126 → 499 lines (this lane's units); the crisis-scoped register is untouched (no flag set or dropped). The compose re-pins both (R-T).
- **Test pins:** `calmFactsDouble.js` + `sacredHouse: true`. No other pin re-keyed.
- **Governing suites, title for title against each unit's base:** unit 1, 35 files, the base's 37 reds; 3a, 79 files, the base's 94; 2b (after the fix), 75 files, the base's 92. No new red.
- **Typecheck / lint:** `typecheck:ratchet` green; `typecheck:domain:strict` red at base and tip with the same two untouched files (`crisisFactFindings.js` +4, `composeStateProse.js` +2); eslint clean on every touched file. The `power/` ceiling is unchanged (one-for-one string edits).

## Waiting (the line is left as it is)

| line | presumes | waiting on |
|---|---|---|
| DS-FTH-1 SINK arc rising v1 · DS-DEF-2 Economic Survival STRONG v3 | some crisis | unit 8 (R-O), not on 1g's lane at `e8b0072` |
| DS-POW-7 receipt deferred v2 / v3 | the deferral's reason (the cap; an outbid) | "needs a home" (2 lines) |
| `rulingStructure` "fund the council" · "council access" | a council body | "waiting on council": 1f recorded no bodies reader |
| `governanceNarrative` the priest baseline lines · `BASELINE_CONFLICT_SIBLINGS` militia captain | priest / militia | "waiting on order" (R-Q), unchanged |
| DS-FTH-1 "the clergy" (2 lines, declared `priest`) | priest ∨ sacredHouse | the `clergy` composite (wave 2) |
| cult count ("several"), a cult's own shrine | — | "needs a home" (CULTS, STANDING) |

## Where CENSUS-5e starts

Nothing of this lane remains but the compose and the atoms above: unit 8's bare crisis (2 lines), a council home, the deferral reason. The register pins are the compose's (R-T).

## Open questions for the chair

1. **`MILITARY_MODIFIER_SIBLINGS` 'garrison-backed'** resolves at the same power step, against the same unsettled garrison (9 of 2,121). It has a twin, so it is not one of the "three twin-less sets" of answer 2. By R-AN it should still be reworded to its twin's wording ("arms-backed"), but the set sits on 1c's `defenceTwinLines.test.js` pins. Reword it here, or is it 1c/1h's?
2. **`clergy` = priest ∨ sacredHouse** is wanted by two lines (DEVOTION lukewarm v3, ARC rising v3), each declaring `priest` meanwhile. Define it in wave 2 (R-U's demand rule is met)?
3. **The 250 kept-refused `OUTLOOK_HOOK_SIBLINGS` findings** (`tier: <= village`, `food: ≤ deficit`) make the 1,000 read STOP. Which lane owns their twins or rewords, the food lane or 1h?

# CENSUS-5e — 'garrison-backed' reworded, the two `clergy` lines, unit 8 still waiting (lane record, 2026-11-05)

> A build seat's record for the chair. Same branch, base CENSUS-5d's tip `3aef91c28`. Merged: `origin/lane/census-1b-2026-11-04` at `f1d76057e` (1h: R-AT, R-AU, `clergy` `712ac7694`; a fast-forward), then at `5978662` (1i units 1–3: R-AW, the walker's second half, R-AX refined) as `d5cdedf`. Every merge re-took the wiring census through its door and kept `gen:dossier-prose --check` green. A transport push after every unit; no pull request. **Not landed on 1i's lane at this tip (fetched before each unit and at the record): unit 8 (bare "some crisis").**

## The units

| unit | commit | what |
|---|---|---|
| merge | `f1d7605` (ff) | 1h's tip: `clergy`, R-AU, R-AT |
| 2 (answer 1) | `def7feb` | R-AN / R-U: `MILITARY_MODIFIER_SIBLINGS` dissolves; the town military modifier prints `arms-backed` |
| 3 (answer 2) | `ba4ea14` | R-AE: DS-FTH-1 DEVOTION lukewarm v3 and ARC rising v3 declare `clergy` (were `priest`) |
| merge | `d5cdedf` | 1i units 1–3; one conflict (the `rulingStructure.js` import line), resolved without the dissolved set; the walker's channel row for it leaves (`scripts/lib/table-pools.mjs`) |
| 4 | — | unit 8 not landed: the two "some crisis" lines stay waiting |
| doc | (this commit) | this record |

## Unit 2 — 'garrison-backed' (the chair's answer 1; R-AN, R-U)

The town's informal military modifier (a town with no governance-named house, military priority 55–65) resolved `garrison-backed` / twin `arms-backed` at the power step against `garrison`, which differs from the final record on 9 of 2,121 steps: not settled there. The set dissolves and the site prints the twin's wording, which presumes nothing about the garrison. No new line. **Pins re-keyed by this cause:** `defenceTwinLines.test.js` (the set leaves `DEFENCE_SIBLINGS`, 11 → 10 keyed lines); at the 1i merge, `DECLARATION_CHANNELS` loses the set's row (the walker holds that list equal to the `*_SIBLINGS` exports). **Moved:** golden 0 of 525 (no configuration reaches the branch); soak records 0 of 1,000 (the branch was reached 21 times, every one in a town with no garrison, which already printed `arms-backed`); the power ledger's drawn count 1,787 → 1,766 (those 21 resolutions are no longer draws). Red-first: `census5eArmsBacked.test.js` 2/2.

## Unit 3 — the two `clergy` lines (the chair's answer 2; R-AE)

| line | was | now |
|---|---|---|
| DS-FTH-1 DEVOTION lukewarm v3 "the clergy preach to the same few households" | `priest` | `clergy` |
| DS-FTH-1 ARC rising v3 "What the clergy record is larger …" | `priest` | `clergy` |

Each line is now admitted where a sacred house stands without a named cleric (refused before), and refused only where both are answered false. Each pool keeps ≥ 2 lines under that refusal, so no twin. **Pin re-keyed by this cause:** `census5dWaitingLines.test.js`'s two rows (mark `clergy`; the refusing record lacks both). **Moved:** golden 0 (display); soak records 0; sampled pages 0 of 60 and 0 of 1,000 (the gain is display-time and fell outside the sampled pages). Wiring census: `lineDeclares` priest 1 → clergy 1 on the two pools. Red-first: `census5eClergyLines.test.js` 2/2.

## The 60 and the 1,000 (R-B: before = 1i's tip `5978662`, i.e. the merged base without this seat's units; after = `d5cdedf`)

| run | settlements · findings · errors · verdict | `coh:*` (incl. `crisis-blind-prose`, `defence-words`, `faith-denial`, `crisis`) | `cert:*` incl. `false-presumption` | other classes | records · sampled pages moved |
|---|---|---|---|---|---|
| 60 | 60 · 101 → 101 · 0 · CLIMB → CLIMB | 0 → 0 | 0 → 0 | identical | 0 · 0 |
| 1,000 | 1,000 · 1,662 → 1,662 · 0 · CLIMB → CLIMB | 0 → 0 | 0 → 0 | identical | 0 · 0 |

Certification holds at 1,000 / 1,000. **`declared-share` (the 1,000):** power 1,787 / 1,787 → 1,766 / 1,766 (1.000; unit 2's 21 dissolved resolutions) · defense 1,494 / 1,494 · tab:threats 89 / 89 · pdf:threats 356 / 356 · tab:dossier 49,970 / 213,123 (0.234), unchanged (DS-FTH / DS-WAR draw through the dossier kernel; a `priest` → `clergy` swap keeps one atom per line). **The undeclared register for the four families (from the census):** DS-DEF 1, DS-POW 2, DS-FTH 1, DS-WAR 0 = **4 lines**, unchanged, every one waiting below.

## Rows moved, by cause (never re-recorded)

- **Golden:** 0 of 525 (units 2 and 3, measured on the corpus before and after each).
- **Soak records:** 0 of 1,000; 0 of 60.
- **Generated leaves:** `warFaith` (unit 3), through `gen:dossier-prose` only, `--check` green.
- **Wiring census:** the two faith pools' `lineDeclares` (unit 3); nothing else after the merge.
- **Registers:** untouched by this seat (the undeclared count is unchanged; no flag set or dropped). `declarationRegisters.test.js` is red at the base for the compose's re-pin (R-T), not by this seat.
- **Test pins:** `defenceTwinLines.test.js` 11 → 10; `census5dWaitingLines.test.js` two rows; `DECLARATION_CHANNELS` one row (the walker list).
- **Governing suites:** unit 3, the 29 files that read the faith leaf: the base's 55 reds title for title, none new. Unit 2 and the merge: the power and walker suites green except the base's `power/` ceiling (821 / 813, unchanged; unit 2 is a one-for-one line edit).
- **Typecheck / lint:** `typecheck:ratchet` green; `typecheck:domain:strict` red at base and tip with the same two untouched files (`crisisFactFindings.js` +4, `composeStateProse.js` +2); eslint clean on every touched file.

## Waiting (the line is left as it is)

| line | presumes | waiting on |
|---|---|---|
| DS-FTH-1 SINK arc rising v1 · DS-DEF-2 Economic Survival STRONG v3 (2 lines) | some crisis (`needs: crisis`, bare, R-I) | CENSUS-1i unit 8, not on `origin/lane/census-1b-2026-11-04` at `5978662` |
| DS-POW-7 receipt deferred v2 / v3 (2 lines) | the deferral's reason (the cap; an outbid) | "needs a home" |
| `rulingStructure` "fund the council" · "council access" (2 lines) | a council body | "waiting on council" (R-AE) |
| `governanceNarrative` the priest baseline lines · `BASELINE_CONFLICT_SIBLINGS` militia captain | priest / militia | "waiting on order" (R-Q), unchanged |
| cult count ("several"), a cult's own shrine | — | "needs a home" (CULTS, STANDING) |

## Where CENSUS-5f starts

Only unit 8's two lines remain for a seat of this lane: once CENSUS-1i lands unit 8, DS-FTH-1 SINK arc rising v1 and DS-DEF-2 Economic Survival STRONG v3 each take `needs: crisis` in the annex, then `gen:dossier-prose` (a few-minute seat, or the compose's). Everything else is the compose's (the register pins, R-T) or waits on a home.

## Open questions for the chair

1. Four more DS-FTH lines speak of "the clergy" (e.g. "which the clergy find easier to forgive than to fix"; "the clergy have started asking"). CENSUS-5d read them as colour, so they are not this seat's to re-read (R-R). Should they declare `clergy` now that it exists (R-AD: a DM reads "the clergy" as a fact)?
2. If unit 8 lands after this lane closes, may the compose apply the two `needs: crisis` declarations instead of a CENSUS-5f seat?
