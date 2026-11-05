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
