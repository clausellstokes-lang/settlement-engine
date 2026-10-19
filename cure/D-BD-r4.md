# D-BD-r4 — THE BODIES, round-4a disposition (lane D-BD-r4; Opus 5.5 xhigh; chair 0a2e8bd9, Fable 5.1, continuing a73343ed; started 22:04 EDT by `date`)

Inputs (read whole): kit README (RESUME BLOCK 2) · COMPILE-COMMON · DISPOSE · RESEARCH-COMMON · RULINGS-PL-MN · -AFTER-RESEARCH · -AFTER-COMPILE · CHAIR-NOTES (1–18, incl. 17) · ROUND1 (+addendum) · ROUND2 · ROUND2b (+addendum) · ROUND3 (§A–§G) · ROUND4 (§A–§D) · the BOARD (all 88 lines; the owner's words 18:3x–21:5x verbatim there) · `briefs/L-BD.md` items 1–49 + every lettered addendum · `cure/L-BD.md` (the compile log, its ROUTES and open questions) · the volume `docs/DESIGN_FP_ARCH_BD.md` WHOLE (702 lines, 176,801 B, sha256 `02e51be8…`, kept byte-for-byte at `D-BD-r4-probe/BD.pre-r4.md`). Routes to BD read: every `cure/D-*-r3.md` (two rows: D-FOLD-r3 R8 and D-MN-r3 (j), the ENTER-threshold correction) and — beyond the brief, because they had landed in this same round — the ROUTED sections of `cure/D-PL-r4.md`, `D-PS-r4.md`, `D-ST-r4.md` and PR's §5.5 as D-PR-r4 left it (PR's file had no ROUTES section yet at 22:0x). Code of record: the detached master worktree `…/a73343ed-…/scratchpad/master-81f1cd963` (HEAD `81f1cd963553f226b222714914ff34584e9911b8`, verified 22:04). Probes: `D-BD-r4-probe/` (`m1.out`–`m6.out`, `census-r4.out`, `tickcost.mjs` → `tickcost.out`). Never git; never the suite.

## §1 THE MEASUREMENTS FIRST (each CONFIRMED by a read at the cited symbol or by execution; PLAUSIBLE marked)

| # | What the input assumed | What master `81f1cd963` says (quoted) | Verdict |
|---|---|---|---|
| m1 | L-BD 29: alms "draw on the POOL the patron temple draws on (WF's temple wealth / tithe — measure `templeWealth`, `tithe_rights`)" | `display/stateProse/dossierMounts.js`: "DS-FTH-4 — ⛔ `templeWealth` HAS NO WRITER IN THE ENGINE (a WF-7 design-doc future …)"; `tithe` appears only as prose and services text (`m1.out`) | REFUTES the pool as a landed read: the pool is WF-7's SLOT; alms are a body-side supply gain and a court-fork input until WF-7 lands (§6.6) |
| m2 | L-BD 34b: the court chooses "`pay · hunt · wait`" on the `ransom` row | `worldPulse/ransomChoices.js`: "`export const HOME_ANSWERS = Object.freeze(['pay', 'refuse', 'abandon']);`" · "`export const CAPTOR_CHOICES = Object.freeze(['hold', 'ransom', 'release']);`"; the fold's §3.3.13: "The row takes the LANDED `pay · refuse · abandon`" | REFINES: the court's weekly line is the LANDED `pay · refuse · abandon`; "hunt" is the court's OTHER act (its stance `hunted`, `hunt_taken`), "wait" is requirement 24's LEAVE; the race's closings `ransom_granted · captive_freed · captive_released` are FREE (0·0·0, `census-r4.out`) |
| m3 | L-BD 48: "an envoy met by a body is STOPPED or ROBBED, never CAUGHT" | `worldPulse/roadsKernel.js` PASS 3 (frozen, 838): "In transit, a bandit road (T3) can still take an embassy that no army meets (bandits do not parley)" · "`res = fork.random() < p ? { cls: 'T3', outcome: 'hostage', captorId } : { cls: 'T3', outcome: 'robbed', captorId };`" on a hop whose `embattlementLevel ≥ ROADS_TUNING.EMBATTLED_THRESHOLD` | REFINES: the landed T3 arm already takes ROSTER envoys hostage on embattled hops (the roads hold, `RansomRec`); BD never edits the frozen kernel and ATTRIBUTES a fired T3 outcome to the body whose row is largest on that hop (the `banditryLoss` idiom); BD's OWN acts never take a named person into custody (ES-2b); the bodies' rows raise the T3 roll's level — declared in the re-feed shift (§8.5) |
| m4 | L-BD 39: "STOP with the shape if HB's record cannot carry a body-grain key" | `habit/habitLedger.js`: "`rows: { <actorId>: { <class>: { <action>: [stockInt, weekStamp] } } }`"; the writer refuses only "`if (!actorId \|\| !action \|\| !isCircumstanceClass(className)) return;`"; `habitVocabulary.js :: CIRCUMSTANCE_CLASSES` = twelve court circumstances incl. `route_menaced`, `stores_thin`, `rival_ascendant`; `habitCurve.js`: "`HABIT_ROWS_PER_ACTOR_CAP: 24`"; the gate `habitConditioningEnabled` (dark) | NO STOP: a body id is an `actorId`; three of the twelve classes carry the body's lessons in their landed meanings (§4.4); the class arrives as an ARGUMENT ("It computes no habit … the class arrives as an ARGUMENT"), so BD supplies its own closed classifier; 24 rows per body bound it |
| m5 | L-BD 41: "propose the name `warden` if free, else CH's nearest" | `roles/roleCatalog.js :: INSTITUTION_ROLES` has no warden office (`law_enforcement: [{ role: 'Watch Captain', importance: 'pillar' } …]`); CH16: "`warden`: a DISPLAY noun only" of the `wildland` domain (CH l.281, l.411) | REFINES: "the warden archetype" = a CH paragon whose `domain` is `wildland` (display noun "warden"); the OFFICE = the town's public-security office (L-BD 23's sword-holder read; the `law_enforcement` senior seat where the town has one) — the rule reads the domain and the office, never the word |
| m6 | L-BD 42 (b)/(d): "measure the urban band's institution table for a mercenary kind; if absent, a NEW institution kind" | `data/institutionalCatalog.js`: "`town: { name: 'Free company hall', baseChance: 0.3 …}`", "`shared: { name: 'Mercenary quarter' … }`" (city · metropolis); "`city: { name: \"Thieves' guild chapter\", baseChance: 0.6, minPopulation: 10000 …}`", "`metropolis: { name: \"Thieves' guild (powerful)\" …}`", "`shared: { name: \"Assassins' guild\" }` … metropolis", the group "`exclusiveGroup: 'criminalPower'`"; `worldPulse/institutionLifecycle.js :: applyInstitutionLifecycleOutcome` (the landed founding/closing writer, `fate: 'founded'`) | NO new institution kind: the mercenary end founds the catalog's FREE COMPANY HALL (town) or MERCENARY QUARTER (city+), the guild end the tier's `criminalPower` institution; "only where none exists" IS the catalog's `exclusiveGroup`; the writer is the landed lifecycle outcome (PLAUSIBLE that it admits an external founding cause — BD-8's car-0) |
| m7 | L-BD 42 (c): "the landed founding over a site … POP's founding read" | no runtime settlement-founding writer on master (`rg` for a founding of a settlement: 0 domain hits; `realm/autoplacement.js` places at world birth; `demographicsResponses.js` reads "at the founding mint" in POP's design only) | SLOT: the hamlet end is DARK until a runtime founding writer exists (POP's founding, the owner's capability: a new settlement record at runtime) — recorded ⭐ OD-BD-35 |
| m8 | L-BD 23b: "measure WF for an existing shared-faith affinity first and reuse it" | `worldPulse/generosityKernel.js`: "The faith-axis proximity for a pair (samePatron + a sharedFaith01 closeness)" · "`const sharedFaith01 = samePatron ? 1 : clamp01(1 - faithDist);`" (from the culture distance's faith axis), read by `spatial/generosityEV.js` | REUSED: the near case's trust rides the landed faith proximity as the creed's shares converge; NO `shared_faith` patch (it would count shared faith twice) |
| m9 | L-BD 43: "measure INT's commons-voice words first and reuse where they fit" | `commonsVoiceKernel.js`: "`const RUNG_WORD = Object.freeze(['', 'petition', 'gathering', 'riot']);`" (a grievance ladder, no stance); `anticipatedReactions.js :: REACTION_BANDS = ['supportive', 'indifferent', 'wary', 'opposed']` (a court's FORECAST of a power's answer — another meaning); RN §2.2: "`s:<settlementId>` … the town's people, the commons" (a regard HOLDER) | the commons' stance is RN's `s:` regard of the body's key, banded `fear · indifference · support` (one regard idiom, one writer); `fear` is a landed NPC corruption-vector literal (`paradigmAxisCatalog.js`: "`corruptionVector: 'fear'`") — a homonym on the NPC card, registered |
| m10 | L-BD 44: "FIRST MEASURE the landed stressor system" | `stressorsCore.js` types: `siege · famine · occupation · political_fracture · indebtedness · betrayal · infiltration · disease_outbreak · succession_void · monster_raider_pressure · insurgency · religious_conversion_fracture · slave_revolt · rebellion · wartime · mass_migration · market_shock · criminal_corridor · magical_instability · coup_detat · magic_deadzone`; `stressorGates.js :: STRESSOR_SPAWN_GATES` (twenty gates; `criminal_corridor: criminalCorridorGate` …); `stressorDynamics.js :: STRESSOR_COUNTERFORCES` (e.g. "`monster_raider_pressure: { sources: [ { kind: 'causal', key: 'defense_readiness', weight: 0.5 }, { kind: 'institution', key: 'defense', weight: 0.3 }, { kind: 'ally', key: 'military_protection', weight: 0.2 } ]`"; "`criminal_corridor: … 'criminal_opportunity' … invert: true … 'legitimacy' … 'labor_capacity'`"); `disease_outbreak`'s "`spreadChannels: ['trade_route', 'migration_pressure', 'service_dependency']`"; `conditionPromotion.js :: promoteStressorsToConditions`; NO embattled stressor on master (the gauge is the embattlement ledger) | the table (§22) maps every act, input and counterforce onto these; a SLOT where none exists |
| m11 | L-BD 37: "PG's hop seeds" | PG volume: "Seeding lands in the epidemic ledger, never a second system" (pg-1's column seeding, `COLUMN_SEED_CAP`); master's `disease_outbreak` spreads on `trade_route · migration_pressure · service_dependency` | a body is a traveller to PG's ONE seeding door (pg-1), counted against its cap; dark until pg-1 lands (the slot); never a second plague law |
| m12 | L-BD 46b: "measure GR's clause vocabulary" | `peaceTermsCatalog.js :: TERM_CATALOG` / `TERM_TYPES` (GR V-2: "12 terms / 8 families") | the "no hand in each other's hills" clause is ONE new term on GR's landed catalog — GR's to mint (ROUTE GR) |
| m13 | L-BD 49 (c): "the body step's PER-TICK COST at continent scale — a number with its method" | `tickcost.mjs` (a PROXY of the unbuilt reads: a radius BFS per body, a believed-coverage Map lookup per stretch in the radius, a seven-way weighted pick, one encounter test per patrol in its country; jittered grid, degree ~4, world cap one body per two towns): 30 towns / 15 bodies 0.16–0.27 ms · 300 / 150 1.4–2.5 ms · 3,000 / 1,500 20–38 ms · 10,000 / 5,000 78–150 ms per tick (radius 2–3 hops; `tickcost.out`) | CONFIRMED for the proxy (executed); the real reads PLAUSIBLE heavier. Linear in bodies × radius area. No STOP: at the belief envelope (5–30 towns, `armyTransit.js`: "the belief-envelope 5–30 settlements") the step is noise; at continent scale the CAP and the RADIUS are the levers, in that order; BD-0's car-0 measures the real reads against the aggregate per-tick budget (CHAIR-NOTES 18 (f)) and STOPs at build if they exceed it |
| m14 | the new tokens | `census-r4.out`: FREE (0 quoted, 0 word in src · tests · ledger docs): `ransom_granted · captive_freed · captive_released · alms_requested · sponsorship_offered · sponsor_exposed · snuffed_out · guild_war · moved_on · died_out · ranged_away · shared_faith · bounty_posted · subservient · commonsStance · almsOf`; quoted homonyms: `absorbed` (`demographicsResponses.js` placement response; WC's designed `EMBATTLED_RESOLUTIONS`), `bounty` (`AppViews.jsx` view `'bounty'` — the app's Contradiction Bounty page), `fear` (NPC corruption vector), `founded` (`institutionLifecycle.js` `fate: 'founded'`, same meaning), `returned` (`houseLedger.js` house note), `support` (account nav, a hireling tag); `peace_unkept` 2 ledger docs (PL's round-4 kind) | the code literals chosen avoid `bounty` bare (the kind is `body_bounty`) and keep the aligned homonyms registered |

## §2 THE RECORD TABLE (every input id; severity; disposition; where in the volume; receipt) — disposed 62 of 62
Severity: the owner's design words carry no skeptic severity; they are logged as `owner` (MAJOR-weight: an unapplied owner word would be a finding), the chair's rulings as `ruling`, routes as `route`.

| Id | Sev | Disposition | Where (BD) | Receipt |
|---|---|---|---|---|
| L-BD 29 alms | owner | CURED + REFINED (pool = WF-7 slot) | §6.6 · §2.5 · §7.1 · §12 | m1 (`templeWealth` no writer); ST §2.4 `settlementFundingBand`; `stanceOf` (§0.1) |
| L-BD 30 a flock's sites; the forced sale | owner | CURED | §9.4 · §7.1 | ST §6.1 6b · §8 `site_sale` (round 4a); ST m6/m7 |
| L-BD 31 repair ceiling; the patron's lift | owner | CURED | §9.4 | ST §6.1 step 2 (read 22:1x): "`BODY_REPAIR_CEILING` = `worn` … a conclave under THE PATRON'S LIFT … up to `sound`"; ST m8 |
| L-BD 32 names, leaders | owner | CURED | §6.10 · §2.2 · §4.1 · §6.4 · §11 | CH16 (display nouns); CH's retainer idiom |
| L-BD 32b · 33b naming threshold | owner | CURED + REFINED (beasts keep an unnamed belief record) | BD23 · §2.4 · §2.5 · §9.9 · BD12 | BOARD 18:58 verbatim |
| L-BD 33 bounties | owner | CURED + REFINED (`body_bounty`) | §9.9 · §12 | `AppViews.jsx` `'bounty'` view (census) |
| L-BD 34 captives | owner | CURED | BD27 · §9.2 | RULINGS-ROUND1 ADDENDUM SEAMS-r1-1 (custody waits ES-2b) |
| L-BD 34b ransom race | owner | CURED (DARK until ES-2b) + REFINED (landed answers) | §9.10 · §12 | m2 (`HOME_ANSWERS`, `CAPTOR_CHOICES`, `homeRansomAnswer`) |
| L-BD 25b clocked card | owner | CURED | BD13 · §12 | BOARD 18:55 verbatim |
| L-BD 35 fission | owner | CURED | §6.7 | `religionState.js` schism = `resolvePatronContest` |
| L-BD 36 DM verbs | owner | CURED (OD-BD-25 amended) | §11 · BD10 | BOARD 18:27 "do those" |
| L-BD 37 plague on the ways | owner | CURED (slot pg-1) | §5.2 | m11 |
| L-BD 38 winter need · notoriety · cover risk | owner | CURED | §6.1 · §2.5 · §5.2 | `routeReceipts[…].byTerrain` per hop (compile §1(d)) |
| L-BD 39 habits | owner | CURED (no STOP) | BD24 · §4.4 · BD-10 | m4 |
| L-BD 40 hunt led | owner | CURED + PR quarry rule | §9.11 · §12 | m5; PR §5.5 (round 4a text) |
| L-BD 41 warden | owner | CURED + REFINED (CH `wildland` paragon) | §2.3 · §9.11 · §9.5 · §5.3 | m5; CH16 |
| L-BD 42 the gang's end | owner | CURED; ⛔ STOP-BD-r4-1 for (c) | BD25 · §6.8 | m6 (catalog), m7 (no founding writer) |
| L-BD 42 (e) different region; hamlet in place | owner | CURED (the 18:46 reading visible, OD-BD-34) | §6.8 (e) | BOARD 18:46 · 18:47 verbatim |
| L-BD 43 commons | owner | CURED + REFINED (RN `s:` regard) | §7.6 · §2.5 | m9 |
| L-BD 44 stressor table | owner | CURED | BD28 · §22 (last) | m10 |
| L-BD 45 one-liners | ruling (chair) | CURED (all five applied) | BD10 · BD23 · §5.2 · §9.8 (e) · §2.4 · §19.0 | — |
| L-BD 46 sponsorship | owner | CURED (⭐ OD-BD-31) | BD26 · §10.4 · §12 | CH's exposure idiom (BD §0.2) |
| L-BD 46b cold war | owner | CURED | §10.5 · §9.8 (f) | m12 (GR `TERM_CATALOG`) |
| L-BD 47 delivery | owner | CURED | §10.4 | ES `covertCompetence01`; PR item 16 parity |
| L-BD 48 scrutiny and retaliation | owner | CURED + REFINED (T3 attributed; the compile's "never harms an envoy" corrected) | §9.5 · §8.5 | m3 |
| L-BD 49 (a) symmetries | ruling (chair) | CURED + REFINED (one word per end, landed words reused) | §6.9 · §2.6 · §3.4 · §11 | census (`recognized` PL's, `absorbed` POP's) |
| L-BD 49 (b) slots | ruling | CURED | §19.2 | — |
| L-BD 49 (c) per-tick cost | ruling | CURED (proxy measured; STOP at build kept) | BD-0 car-0 · S40 · OD-BD-47 | m13 (`tickcost.out`) |
| L-BD 49 (d) magic out | ruling | CURED | §19.2 | owner 05:3x (BOARD) |
| L-BD 49 (e) the record | ruling | NOTED | — | — |
| L-BD 22b spill per kind | owner | CURED | §10.1 | `faithCarriersOut` (RULINGS-AFTER-RESEARCH §6) |
| L-BD 23b consequences per kind | owner | CURED + REFINED (no `shared_faith` patch) | §10.2 · §2.6 | m8 |
| L-BD 11 addendum (the ask) | ruling | CURED | §5.2 · §19.0 | `refs/PROMPT-FOR-THE-MAPMAKER-HIDDEN-WAYS-2026-10-18.md` |
| §G.1 traffic_waylaid one kind | ruling | CURED | OD-BD-23 · §19.1 | — |
| §G.2 endowed kept | ruling | CURED | §9.4 · §19.1 | — |
| §G.3 sixth kind with `bodyKind` | ruling | CURED | §2.1 · §2.2 · OD-BD-3 | — |
| §G.4 deserter birth waits | ruling | CURED | §3.2 (d) · BD-1 · BD-7 · OD-BD-26 | — |
| §G.5 the eighteen REFINED stand | ruling | NOTED | — | volume unchanged on them |
| §G.6 criminal power at the read | ruling | NOTED | §7.3 | — |
| §G.7 build-time STOPs | ruling | NOTED (B1-S1 retired by G.4; BD-0 cost and BD-8 institution-writer STOPs added) | §14 | — |
| §G.8 items 29–49 are this lane's | ruling | CURED | this disposition | — |
| A.3 BD half | ruling | CURED | §0.2 · §2.1 · §15 | ST §2.1 (round 4a) |
| A.12 six kinds | ruling | CURED | §0.2 · §2.1 · §2.2 | — |
| A.17 BD half | ruling | CURED | §2.4 | ST §2.4 `believedDenOf` (round 4a) |
| B (BD row) stressor table last | ruling | CURED | §22 | — |
| PL→BD 1 `peace_unkept` no patch; episode; `huntOrderOf` | route | CURED | §10.2 (b) · S14 | PL §4.8 (1) · §4.9 (read) |
| PL→BD 2 harbouring under a standing order only | route | CURED | §7.1 | PL §4.8 (3) · OD-PL-57 |
| PL open 1 crown's-faith service credit | route | ROUTED to PL | §10.2 (b′) · §19.0 | D-PL-r4 §6 item 1 |
| PS→BD 1 §2.3 readers | route | CURED | §2.3 | PS `hiddenWayFor` (4 hits) |
| PS→BD 2 §5.2 the unit's might ladder | route | CURED | §5.2 | PS §2.1 · §5.6 |
| PS→BD 3 §19 PS row "carried at PS8 · §5.6" | route | CURED | §5.2 · §19.0 | — |
| ST→BD (a) one belief source; adoption hands sightings over | route | CURED | §2.1 · §2.4 | — |
| ST→BD (b) per-body presence term by name | route | CURED | §8.2 (`bodyPresenceTermOf`) | ST `denPressOf` |
| ST→BD (c) one raider-gate row per body | route | CURED | §8.3 | ST R2 |
| ST→BD (d) the sale's price; refusal one step to `curbed` | route | CURED | §9.4 · §7.1 | ST `site_sale` |
| ST→BD (e) dark-after-lit: a flock's site reads `faith` | route | CURED | §15 | — |
| ST→BD (f) a menace on a body's site = `site_cleared` | route | CURED | §9.4 | — |
| PR text → BD: `hunt_taken` is BD's; a flock only where `outlawed` | route | CURED | §9.11 · §12 | PR §5.5 (read 22:1x) |
| PR text → BD: the known set's union is BD's read | route | CURED | §2.3 (`knownTrailsOf`) | PR §2.6 `trailWatchOf` |
| D-FOLD-r3 R8 · D-MN-r3 (j) ENTER 0.55 | route | CURED at compile — re-verified | §0.1 · §8.2 | §0.1 quotes "`ENTER_THRESHOLD: 0.55`" |
| D-RN-r3 l.62 (keys admitted only when routed) | route | NOTED (BD's RN routes stand) | §19 · §19.0 | — |
| L-BD compile OQ 1–4 | ruling | CURED (= §G.1–G.4) | §19.1 | — |

Counts: disposed 62 of 62 — CURED 55 · REFUTED 0 · STOP 1 (L-BD 42: ends (a)(b)(d) cured, end (c) ⛔ STOP-BD-r4-1) · NOTED 5 (§G.5 · §G.6 · §G.7 · L-BD 49 (e) · D-RN-r3) · ROUTED 1 (PL's open item 1); every other-volume half is in §5.

## §3 STOPs
- ⛔ **STOP-BD-r4-1 (L-BD 42 (c), the hamlet end).** The ruling "FOUND A SETTLEMENT … (the landed founding over a site … POP's founding read)" cannot be built at `81f1cd963`: no runtime settlement-founding writer exists (m7). Proposed re-ruling: the runtime founding is NEW CAPABILITY and a persisted act — THE OWNER'S (⭐ OD-BD-35), POP's unit; until then end (c) is DARK and a `hamlet`-goal gang holds its site. The volume is written to that shape (§6.8 (c), §20.2).

## §4 REFINED (beyond the inputs; each marked in the volume)
1. The compile's "the engine never harms an envoy (PR §8.2's law)" CORRECTED by measurement: the frozen gauntlet's T3 arm takes envoys `hostage`/`robbed` on bandit roads; BD attributes, never edits (§9.5; m3) — and the bodies' rows raise that roll's level, added to the declared re-feed shift (§8.5).
2. `brigandage_exported` retired into `peace_unkept` with `bodyKind` (23b's own word), aligned with PL's row of the same name (§2.6, §10.2).
3. One word per end: `died_out` = `starved`, `named` = `raised`, `recognized`/`absorbed` = the faith row's `established`/`suppressed`, `moved_on` = the birth `driven_out` (§2.6, §6.9).
4. Tokens by census: goal `retire` (not `disperse`, a migration-mode literal), kind `body_bounty` (not `bounty`, a UI view), `undertaken` (not `taken`), `cache_drop` (not `cache`), compound exposure words (§2.6).
5. The record's `kind` → `bodyKind` (A.12's ref and the record say one thing).
6. No `shared_faith` patch: the landed faith proximity carries shared faith (m8).
7. The commons' stance is RN's `s:` regard banded (m9) — no second commons, no second regard.
8. The warden = a CH `wildland` paragon holding the public-security office; the office = the watch's senior seat else the sword faction's leader seat (m5).
9. Alms asked once a season per town (the push budget).
10. The guild war's security fall rides the corridor and infiltration stressors' landed effects (BD8 kept: a body never writes security) and the landed infiltration→corridor ×1.25 link is stated, clamped.
11. The founding ends use the catalog's existing institutions (no new kind; m6).
12. The ransom's `pay · hunt · wait` → the landed `pay · refuse · abandon` (m2).
13. A beast pack keeps an UNNAMED belief record (else PR's prediction could never hunt it, against BD10).
14. A fifth flag `bodySponsorshipEnabled` (the proxies need ES and IN lit; a separate lighting unit and shift).
15. The two-channel raid effect (presence row + raider stressor) declared in §22 A2 as deliberate, bounded, measured at BD-2 — the seams skeptic's first target.
16. `PLACE_BODY` admits a NAMELESS beast (the owner's L-BD 36 approval over the compile's OD-BD-25); naming or driving it stays a menace.
17. The derived names never carry the code word "conclave" (six landed name regexes class it ARCANE) and a beast pack is described by place, never named (§6.10).
18. The hunt's leader order: a warden in the office, else the sword-holder's leader seat by government, else the watch's senior seat (§9.11) — the owner's "prefernce given to wardens and nobles or whowever is in charge of public security".

## §5 ROUTED — the other-volume halves (one line each; volume · exact edit; the full list is the volume's §19.0)
- **MN** §3.3/§11: `PROMOTE_BODY` hands a NAMED body's name (a nameless one takes the DM's); a recruiting course takes NAMED gangs only.
- **ST** §2.4: `believedDenOf` reads a body holder's might from BD's `believedBodyOf` — cite it by name.
- **PR** §8.1/§8.3/§5.5: the commons' support as +0.2 cover in the body's town country; `informer` sightings in the town's belief; the riders' cadence as the learnable fact `believedWatch` carries; the warden's `bribe` on the unpaid-wages slot.
- **PL** §4.6/§4.8: a REQUESTED `service_answered` under `body:` for a flock of the crown's creed spreading from a member; a rival creed's spread = defiance on PL17's fault line; the mirror counterforce (curbing the liege's creed costs resentment and a protection step); sponsoring a body in a rival crown's member affronts that crown.
- **RN** §2.2/§3/§5: `body_act` rows for a NAMED body's acts toward a town's people; `believedBodyOf` as a registered belief source; the naming threshold opens the key; the leak row widened to a tie; trust both ways; an `escaped` hunt is the body's deed.
- **CH** §9/§14/§16b: the retainer kind `leads`; the bounty as a call on the board (`order` / `wildland`); the aim `hunt` with a body target; the warden = `wildland` paragon in the office (display noun kept); sponsorship on the one exposure source `covert_hire_exposed`; the mercenary market's birth path from a gang's `free_company`.
- **PT** §15: the party hunting a body = `party_hunted`'s mirror (its own deed door); `TRAIL_KNOWN` `to: party` marks the party's record.
- **CN**: the eight body verbs (§11).
- **HB**: the body grain (a body id as `actorId`; BD's classifier into `route_menaced · stores_thin · rival_ascendant`; the leader-change reset); the court grain's three rows.
- **PG**: "the road shut, not the way" — a body is a traveller to pg-1's one seeding door, against `COLUMN_SEED_CAP`.
- **WF**: WF-7's temple purse (alms; a mother temple's silver); the mother temple as a sponsor; a flock's ends in the faith row's own states.
- **WC**: the bought gate's one term on the siege defender read; a sponsored flock against a besieged town's resolve through `applyHomeWarCosts`; the mercenary institution's hired swords as a WC union unit.
- **EC/TR**: a sponsor's silver as contraband through the gauntlet.
- **WY**: a WY-6 caravan body under a public escort contract (the board's entry) = the "publicly contracted caravan".
- **POP**: the runtime founding (⭐ OD-BD-35); dispersed gangs rejoin towns through POP's people ledger when it runs.
- **INT**: the guild war's grievance reads the corridor and infiltration stressors; a sponsor's legitimacy at home when its commons learn.
- **GR**: one new `TERM_CATALOG` term "no hand in each other's hills" (its leaked violation a casus); the outrage grievance on the same demand road.
- **ES**: the sponsorship offer as an errand-spine objective; the operative carrier's catch, custody (ES-2b) and confession; the ransom race as the body's side of ES-2b.
- **IN**: the offer as a statecraft objective; a public mission KNOWN on the road; a mother temple's alms noticed by a brokerage; the sponsored pulpit's rumor campaign.
- **The voice program**: the bodies' name pools; the dossier's desk facts (§19.2).
- **The mapmaker ask**: a §C line (the warden office's ways count as known); the P4 addendum paragraph (the bodies' map pieces).
- **The treasury (W-COIN)**: `UPKEEP_LEDGERS` rows for bounties, ransoms and sponsors' coin when W-COIN lights.
- **THE FOLD (D-FOLD-r4 / P4)**: six new §3.4 kinds with WHERE and `clock`; the `ransom` row's closings and `clock`; §5's new words and homonyms (`peace_unkept` aligned with PL's; `fear` the NPC homonym; `spread_faith` aligned; `brigandage_exported` retired); §6 C17 + BD-8 · BD-9 · BD-10; §7 ⭐ OD-BD-31, ⭐ OD-BD-35, OD-BD-34's visible reading; THE FIRST SOAK's BODIES row.

## §6 OPEN FOR THE CHAIR
1. STOP-BD-r4-1 (above): the runtime founding as THE OWNER'S new capability.
2. OD-BD-34's reading of the owner's 18:46 "where their repuation does harm them" as DOES NOT harm them — kept visible for the owner.
3. OD-BD-25 amended on the owner's approval of L-BD 36 (a DM may place a NAMELESS beast); vetoable if the chair prefers beasts unplaceable.
4. The two-channel raid effect (§22 A2): the seams skeptic should attack whether the raider stressor's security path plus the presence row over-latches a country; BD-2's measurement decides.

## §7 CONFIRMED vs PLAUSIBLE
CONFIRMED by reading at `81f1cd963` (quoted in the volume and §1): m1–m12 (the temple purse's absence, the landed ransom answers, the T3 arm, HB's ledger shape and cap, the roles catalog, the institution catalog, the absent founding writer, the faith proximity, the commons' rung words, the stressor types/gates/counterforces/affected systems, PG's seeding door, GR's term catalog); CONFIRMED by read (22:4x): the T3 outcome is readable after the fact from the landed ransom record (`captorId`, `threatClass`, `startedTick`) and the robbed beat (`robbedReceipted`) — attribution needs no kernel line; CONFIRMED by execution: the token census (`census-r4.out`), the cost PROXY (`tickcost.out`), the table integrity (`tablecheck.out`: 18 tables, 0 mismatches); CONFIRMED by reading the siblings' current text (22:0x–22:2x): PL `huntOrderOf`/`peace_unkept`/`body:`, PS `hiddenWayFor`, ST §2.1/§2.4/§6.1/§8 `site_sale`, PR §5.5. PLAUSIBLE, not upgraded: the real reads' per-tick cost (BD-0 car-0), the institution writer admitting an external founding cause (BD-8 car-0, the host at 800), every DRAFT constant, and that the routed siblings land their halves as written.
