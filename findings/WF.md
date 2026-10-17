# WF — THE FAITH FAMILY: COHERENCE READ (2026-10-16, reader seat, chair session 2fc13d59)

Scope read WHOLE: `volumes/DESIGN_FP_FAITH.md` (1693 lines, cited `FAITH:n`), `volumes/DESIGN_FP_ARCH_WF.md` (846, cited `ARCH_WF:n`); `volumes/DESIGN_FP_SPINE.md` §1 (:17-107) and §3's FP-FAITH crux (:503-513) (cited `SPINE:n`); `volumes/DESIGN_FP_ARCHITECTURE.md` PHASE 5 (:1919-2022) and the flag table rows (:464, :484-491) (cited `FOLD:n`). Code of record: `master-00b648c9d` (cited `src/...:n`, static reads only). Build record: `fp-kit-87797a6a-2026-09-23/FP-PROGRESS-BOARD.md` (`BOARD:n`), `FP-ORDER.md` (`ORDER:n`), `FP-QUEUE.md` (`FPQ-n`). Ledger: `docs/OWNER_DECISION_QUEUE.md` (`ODQ:n`, grep only). Doctrine source: `docs/archive/memory-estate/deity-doctrine-no-premade-pool.md` (`DOCTRINE:n`) and `docs/rewrite-retro-2026-09-12/verbatim/BRIEF-ADDENDA-14-to-17.as-run.md` (`ADD15:n`).
Evidence class: every claim below is a READ (CONFIRMED by file:line) unless marked PLAUSIBLE. No test was run. Git log was read on the code-of-record checkout only (no writes).

---

## 1. THESIS

FAITH makes belief move like the other substances while the engine never confirms a god: a patron's fall becomes a typed believer-side record (WF-1), pilgrims and legates travel (WF-2), creed stances gain consequences (WF-3), the pulpit reads calamities (WF-4), a temple can split and a suppressed faith can go underground (WF-5), the treaty table can trade in faith (WF-6), temples gain a coffer (WF-7), and the voice triples (WF-8), all measured by WF-0/WF-9 (`FAITH:46-50`, `SPINE:503-513`).

The DM-felt sentence for the flagship (WF-1, the unseating), the volume's own receipt line: **"The Lady of Harvests fell discredited in Greyfen — a decade of stain, an empty nave, and the Deep Forge's bell now rings the hour."** (`FAITH:569-570`, `:1591-1592`). **It has no producer at master.** No Herald/news kind for a fall exists (`src/domain/realm/heraldRouting.js:148-169` faith rows carry no fall kind); the only reader of the ring is the town faith panel, which renders a cause-only sentence that cannot name the creed: "The patron fell. Discredited: the creed lost its rightful claim, and the town let another take the seat." (`src/components/settlement/faithPanelModel.js:112-117`, `:226-230` "The CAUSE alone renders: the raw ref is a slug").

Per-mechanism DM sentences and their wiring at master:
- WF-1 settlement obituary: "The last altar of the Pale Warden in Marrow's Ford went dark; none there now keep the rite." (`FAITH:1593-1594`) — WIRED, `faith_last_altar_dark` (`src/domain/worldPulse/faithReceiptPools.js:60`, minted `religiousContest.js:806-830`, routed `heraldRouting.js:168`).
- WF-1 realm last seat: "The Last Altar of ${name}" (`src/domain/worldPulse/realmEvents.js:312`) — WIRED (`pantheon_extinction`, WF-1C).
- WF-1 × WR-1: "Men still dying for a god nobody worships" naming the fall (`FAITH:1596-1597`) — WIRED but **cannot fire in any shipped preset**: the join reads `fallCauseFor` (`warTermination.js:538`, `:869`) behind `warTerminationEnabled`, which is "deliberately absent from DEFAULT_SIMULATION_RULES and every other preset" and declared `false` in full_simulation (`simulationRules.js:1031-1036`).
- WF-2 "Pilgrims on the road to Greyfen: the feast fills every inn." (`FAITH:1598`) — **No DM-felt sentence** (no `pilgrimSeason`, no `pilgrimageEnabled` anywhere in src).
- WF-3 "Communion kept at the river shrine — the old quarrel cools." (`FAITH:1601`) — **No DM-felt sentence** (no `faithStanceConsequencesEnabled` in src; the stance lane's existing `faith_pact_formed` news is the pre-FP W-F-era beat, `heraldRouting.js:149`).
- WF-4 "The priests read the failed harvest as the Lady's wrath…" (`FAITH:1602-1607`) — **No DM-felt sentence** (no `omenReading`/`omenReadings` in src).
- WF-5 "The temple split…" / "dragged into the light…" (`FAITH:1608-1611`) — **No DM-felt sentence** (no `creedRef`, no `covert` field, no `faithSchismEnabled`).
- WF-6 "Peace signed: the victor's missionaries may preach within the walls." (`FAITH:1612`) — **No DM-felt sentence**: the five faith rows exist (`peaceTermsCatalog.js:249-266`) and are drafted only by the `faith_communion` occasion (`pactFormation.js:191-196`), which cannot cross in any shipped preset (§2 below); every faith grant read is unconsumed (`treatyEnforcement.js:270-293`; `missionaryAccessFor`/`pilgrimageRightFor`/`toleranceGuaranteeFor`/`sharedRiteFor` have no reader outside that file and one certification registry).
- WF-7 "The tithe weighs heavier than the harvest…" (`FAITH:1614-1617`) — **No DM-felt sentence** (no `tithe.js`, no `titheEnabled`; `templeWealth` appears only in dossier prose, `src/data/dossierStateProse/warFaith.generated.js`).
- WF-8 voices of the silent machinery (entry/eviction/suppression/resurgence/standing) — **No DM-felt sentence** (no `faithNarrationEnabled`); the one WF-8 slice that landed is the obituary above.

---

## 2. STATUS, TRUTHFULLY

Volume headers: `FAITH:10-15` "Status: ARCHITECTURE. Nothing here is scheduled… Every wave ships DARK."; `ARCH_WF:13` "Nothing here is scheduled; every wave ships DARK." Neither records that WF-0 and the WF-1 ladder LANDED, that `faithUnseatingEnabled` is LIT in four presets including the default, or that the build split WF-1 into WF-1a..1F and re-filed the obituary to WF-8a (ODQ §215 `ODQ:7778-7813`; §309 re-file `ODQ:12970-13010`).

Lighting at master: `FP_LIT_ALIVE = { faithUnseatingEnabled: true, pactFormationEnabled: true }` (`simulationRules.js:789-792`) spread into realistic_regional (`:899`, the DEFAULT preset per `:6`), dramatic_campaign (`:956`), living_realm (`:999`), full_simulation (`:1213`); `FP_LIT_BELIEF = { beliefAxesEnabled, believedConditionsEnabled, believedScarcityEnabled }` (`:793-797`) in dramatic/living/full — **`believedDevotionEnabled` is registered (`:251`) and in NO lit fragment**; the code's own comment: "believedDevotionEnabled (faith_communion's family) is not a member: the unit lights the three." (`:772-773`). `faithSpreadEnabled` lit only in dramatic_campaign (`:940`) and full_simulation (`:1018`). Owner authority for shipped-lit: ODQ §934.84 "no just build it all shipped lit" (quoted `simulationRules.js:755`; LIT-1a `BOARD:50`).

**faith_communion can fire in NO shipped preset — CONFIRMED by the read chain:** the counterparty word is `believed.devotion = text(record.devotionBand)` off the belief record (`pactFormation.js:262-271`, consumed `:301`); `devotionBand` exists "only under believedDevotionEnabled ∧ beliefAxesEnabled" (`beliefMap.js:349`; gate `beliefAxes.js:93`, door `beliefAxisSubjects.js:396`, `:451`); with the key dark the word is empty, `rungOf` is < 0, and `scoreFaithCommunion` returns NO_CROSSING "One of these courts holds no belief about the other's observance." (`pactTriggers.js:233-235`). The proposer half was cured (FPQ-27, `c38312527`, `pactFormation.js:231-251`) but the counterparty half is gated dark. No UI names the key (`rg believedDevotionEnabled src` → simulationRules + certification + beliefMap/beliefAxes only). Consequence: all five faith term rows are undraftable in shipped play except by a DM editing rules (PLAUSIBLE that no rules editor exposes virtual keys — not checked).

| Wave / unit | Volume's claim | Board / ledger | Code @ 00b648c9d | Verdict |
|---|---|---|---|---|
| WF-0 observation floor | ARCHITECTURE, no flag (`FAITH:470-510`) | LANDED 09-24: `48ae40f30`/`217ff1700` + `d3e00d773`/`5ee982bf1` + `06e0dab89`/`4bc3ef9e9` + cure `06025d546` (`BOARD:46,49,62`) | `deityBearers` in v5 receipt (`scripts/audit/whole-world-soak.mjs:1178`), bearer invariant on faith rows (`subsystemRowsBaseline.js:60-74`), deity case module `scripts/audit/whole-world-soak-deity-fixture.mjs` + `--deity-case` arg (`whole-world-soak.mjs:168-205,263`) | LANDED (volume header stale) |
| WF-1a typed fall | 5 causes (`FAITH:527-532`; J-WF-5 `:1485`) | LANDED `66fda66d4` 08-16; four-cause vocabulary ACCEPTED (ODQ §215.2 `ODQ:7799-7802`) | `PATRON_FALL_CAUSES` = 4 tokens, `abandoned` cut on zero producers (`patronFall.js:58-76`); writer `recordPatronFall` called `religiousContest.js:908-914` | LANDED, **4 causes not 5** — volume stale |
| WF-1b stamp + narrative prune | stamp at 2 sites (`FAITH:378-384`); ARCH says 3 (`ARCH_WF:270-276`) | LANDED `39d0ad7c8` + fix `4f25da23d` 08-21 | ONE writer of `suppressed`/`suppressedAtTick` (`religionState.js:239-277`); narrative prune `:410-440` | LANDED (site count now 1 writer) |
| WF-1C realm last seat | own kind (`FAITH:554-558`) | LANDED `adb5faf3f` 08-21 | `pantheon_extinction` (`realmEvents.js:305-326`) | LANDED |
| WF-1d dissolution names the fall | two-flag fixture (`FAITH:595-600`) | LANDED `1a90b5639` 08-21 | `fallCauseFor` at `warTermination.js:869`; licensed CPL-23 row (`patronFall.js:26-36`) | LANDED, **unreachable in shipped play** (warTermination dark everywhere) |
| WF-1E/1F panel line + name | FaithSection cause-chain line (`FAITH:611-614`) | LANDED `3ac279db4`, `5d18b4a0c` 08-21 | `FALL_SENTENCE` (`faithPanelModel.js:112-117,226-230`) — cause only, no creed name, no "(scandal of the granary tithe)" amplifier | LANDED thinner than spec |
| WF-8a settlement obituary | WF-1's beat (`FAITH:540-553`) under `faithNarrationEnabled` family | LANDED `47ea9c9ba` 08-22 (re-filed WF-8, ODQ §309); TE-RESIDUE `3a2db1110` cut the `abandoned` pool | `faith_last_altar_dark` behind `faithUnseatingEnabled`, NOT a narration flag (`religiousContest.js:806-818`) | LANDED, on the unseating flag |
| LIT-1a | "lit only at the owner-signed soak redo" (`FAITH:274-275`) | LIT 09-24 `f473b94ad` (`BOARD:50`) | `faithUnseatingEnabled` in 4 presets incl. default | LIT; volume law superseded by §934.84 |
| WF-2 pilgrims + legates | 2 slices | ORDER pair 3 (`ORDER:6`); not dispatched | no `pilgrimSeason`/`pilgrimageEnabled`; `ERRAND_CONSUMERS` rows legates/pilgrims `built:false` (`envoyErrandVocabulary.js:320-334`) | NOT BUILT |
| WF-3 stance consequences | — | pair 3 | no `stanceConsequences`/flag; deferral comment stands (`deityStance.js:170`) | NOT BUILT |
| WF-4 omen reads | — | pair 3 | no `omenReading`/`omenReadings` | NOT BUILT |
| WF-5 schism + underground | — | pair 3 | no `creedRef`, no `covert`, no flag | NOT BUILT |
| WF-6 faith terms | executors here, rows at GR-3 | GR-3a landed the rows (`ARCH_WF:597-601`) | 5 rows `peaceTermsCatalog.js:249-266`; drafted by `faith_communion` (`pactFormation.js:191-196`); grant reads unconsumed; no `faithTermsEnabled` | ROWS LANDED, executors NOT BUILT, drafting unreachable |
| WF-7 tithe | — | pair 3 | no `tithe.js`; W-COIN's `tithe_share` tax form exists dark (`treasury.js:269-272`) | NOT BUILT; premise collided (§6) |
| WF-8 remainder | 3× voice, 5 arcs, honesty fix | pair 3 "WF-8's remainder + WF-8b" | Ascendancy still says "the faithful walk the roads in numbers" (`realmEvents.js:336`) | NOT BUILT |
| WF-9 convergence | — | pair 3 | — | NOT BUILT |

---

## 3. LAWS AND OWNER-SETTLED ITEMS (the fold may NOT re-narrate)

Constitutional / spine:
- `SPINE:21-25` "THE HEURISTIC LAW (Law One, owner-dictated): … No price engines, no theology, no census realism. The engine never confirms the divine, never resolves a fate, never contradicts a DM's canon."
- `SPINE:503-513` the FP-FAITH crux (eight mechanisms, "the owner-gated deferral is hereby scheduled into this program, veto open").
- `FAITH:14-15` "The eight crux mechanisms are owner/spine law and are not [vetoable]."

The DEITY DOCTRINE (owner), verbatim where the source holds it:
- 2026-07-21 (no premade pool): "No premade deities anywhere." (`DOCTRINE:` header block; walker `tests/lint/noPremadeDeityPool.walker.test.js`).
- 2026-08-06, recorded as "verbatim intent" (`DOCTRINE:65-71`): "Faith is right to be [a] slimmer system... we have to treat it agnostically. It is nothing more than an extension of culture and traditions. The users have to determine whether a divine act happens and whether to attribute any meaning to it. Not our faith system. And by divine action, it simply means that they [the DM] edit the settlement or states themselves, and they tell their players this happened because a god did so." With the record's own law: "the engine simulates faith SOCIOLOGICALLY … and NEVER THEOLOGICALLY" (`DOCTRINE:73`) and "no theological waves are owed, ever" (`DOCTRINE:84`).
- 2026-08-06 chair refinement, accepted, vetoable — THE ATTRIBUTED EDIT: "Slots as a small wave beside the WF sociological set" (`DOCTRINE:86-93`).
- 2026-09-12 (ADDENDUM 15, `ADD15:30`): "dieties can have prose that act according to their alignment position and related to their rank in the hierarchy of that settlement." · "or it would be correct to say that the followers of the diety acted that way." — the grammatical subject is the FOLLOWERS, never the god; the stored `temperamentAxis` is INERT and the DERIVED `deityTemper` governs.

Volume laws (vetoable only where §6 says so):
- `FAITH:124-128` §1c-1 THE AGNOSTIC LAW: "no receipt, no term executor, no reading, no transition may assert a god ACTED."
- `FAITH:129-134` §1c-2 THE TWO-LANE GATE stands.
- `FAITH:135-140` §1c-3 NO LOCAL GENESIS; fixtures through SET_PRIMARY_DEITY/IMPOSE_CULT.
- `FAITH:141-146` §1c-4 NEVER-RESOLVE-FATES.
- `FAITH:147-154` §1c-5 PREMIUM INHERITANCE (Feature D.0, LOCKED).
- `FAITH:155-157` §1c-6 NO ATHEIST ENDSTATE — SINK_MAX 45, "a secular city, never a godless one" (live `religionState.js:79,82`).
- `FAITH:158-161` §1c-7 EXTEND, NEVER DUPLICATE — religionStates keep ONE writer (but see §6 item 10).
- `FAITH:288-294` THE LANE RULING (binding).
- J-WF-5 `FAITH:1485-1487`: "names vetoable; the closure and the one-cause-per-fall law are not." — and ODQ §215.2 (chair, 08-16): "the FOUR-cause fall vocabulary ACCEPTED … if the owner ever wants `abandoned`, a sink-crossing unseat is a NEW ENGINE BEHAVIOUR and its own wave." (`ODQ:7799-7802`).
- J-WF-6 `FAITH:1488-1490`: "closure, the no-physics law, and the falsifiable expectation arm are not [vetoable]."
- J-WF-7 `FAITH:1495-1497`: "What remains THIS volume's and is not vetoable here: the walker-enforced compliance executors and the both-patrons guard." (see §4: the guard is unhonored at drafting.)
- `FAITH:1459-1460` / `ARCH_WF:725-726` "The program is DONE when these envelopes hold on the owner-ordered soak, and not before."
- `ARCH_WF:239-255` THE WF TUNING-HOME LAW (chair-signed).
- `ARCH_WF:257-262` zero new top-level keys.
- ODQ §934.84 (owner) "no just build it all shipped lit" — overrides `FAITH:274-275` "lit only at the owner-signed soak redo".
- FPQ-62: "the birth preset seats no deity, so faith unseating never fires in any read … THE OWNER'S open word (§903 row 1, the birth preset); the chair records, never decides".

---

## 4. CROSS-PROGRAM CLAIMS

| # | FAITH claim (line) | Other side / code | Verdict |
|---|---|---|---|
| 1 | WF-1 typed cause printed by WR-1's dissolution receipt (`FAITH:519-521`, `:1648-1650`) | Built `warTermination.js:538,869`; flag dark everywhere `simulationRules.js:1031-1036` | AGREES in code, DARK in product |
| 2 | Legates AND named pilgrims ride SP-1 "purpose `religious`" (`FAITH:76-77`, `:660-661`); FOLD says "legates/pilgrims mint … with purpose `religious`" (`FOLD:1946-1947`) | ARCH_WF: pilgrims purposeClass "`personal` — NEVER `religious`" (`ARCH_WF:450-452`); code agrees with ARCH_WF (`envoyErrandVocabulary.js:331`) | DISAGREES (FAITH + FOLD stale) |
| 3 | SP-1 ledger is `spatialLedgers.errands` (`FAITH:439`) | `worldState.envoyErrands` per CR-FP-10 (`ARCH_WF:444-447`) | STALE |
| 4 | `postureOf(settlement)` / `riskToleranceOf(temple)` (SP-4a temple actor class) (`FAITH:102-106`, `:686-688`, `:1010-1012`) | SP-4 landed as `courtPostureOf`/`courtRiskAppetiteOf`, `POSTURE_ACTOR_KINDS = ['settlement']` (`strategicPosture.js:97,222,303`); `riskToleranceOf` is the roads NPC read (`src/domain/roads/state.js:334`, ARCH said :319) | DISAGREES — no temple actor class exists |
| 5 | faith_communion = "same patron or brothers-quadrant proximity, sacredClaim's faithProximityOf" (`FAITH:1122-1125`) | GRAMMAR: "the existing faith-facet quadrant reads (`cohesionWeave` substrate) crossing a communion band" (`DESIGN_FP_GRAMMAR.md:694-696`); code: two courts believed devout to within one rung, NO creed identity read (`pactTriggers.js:221-246`; zero `faithProximityOf`/`patronRef` in pactFormation/pactTriggers/pactProposals) | DISAGREES three ways |
| 6 | Both-patrons guard is THE formation gate for every faith term, not vetoable here (`FAITH:1133-1135`, J-WF-7 `:1497`) | Pact drafting has no guard; `devotionGroundTruth` returns a band for a cult-only settlement with no patron (`beliefAxisSubjects.js:356-373`) | DISAGREES (PLAUSIBLE that a patronless pair could draft faith terms once devotion lights) |
| 7 | `pilgrimage_right` CANNOT FORM with `pilgrimageEnabled` dark — "the drafting pool excludes it" (`FAITH:310-314`; `ARCH_WF:638-639`) | `PACT_DRAFT_LENS.faith_communion` drafts it at ≥0.45 unconditionally (`pactFormation.js:193`); `pilgrimageEnabled` does not exist | DISAGREES (latent dead guarantee) |
| 8 | `missionary_access` "moves a GATE, never a share directly" (`FAITH:1111-1114`, pin `:1167-1169`) | GRAMMAR: "Moves believer-share bands and sacred tension" (`DESIGN_FP_GRAMMAR.md:861-864`) | DISAGREES |
| 9 | `tolerance_guarantee` forswears suppression "of a named creed" (`FAITH:1126-1129`) | Code keys the grant on a court PAIR, "Has `grantorId` forsworn suppressing `granteeId`'s creed?" — no creed ref in the grant (`treatyEnforcement.js:289-293`) | DISAGREES (PLAUSIBLE: the creed is implied as grantee's patron; a patron fall would silently re-target it) |
| 10 | `tolerance_guarantee`/`temple_restitution` are "CATALOG-ADDITION REQUESTS … if the canonical catalog declines" (`FAITH:1095-1101`) | Rows LANDED (`peaceTermsCatalog.js:257,266`; `ARCH_WF:597-601`) | STALE |
| 11 | WF-2a/WF-7 register TRADE stream entries through "CPL-12" / "CPL-7" ports (`FAITH:648`, `:1209`) | COUPLINGS labels CPL-12 as FAITH×POP (`DESIGN_FP_COUPLINGS.md:239`, `:811`) yet declares the feast port there (`:827-833`) | AGREES on substance, CONFUSING label (a TRADE port housed on the POP pair) |
| 12 | Tithe = "piety band × temple-class institution presence × patron rank" (`FAITH:1203-1206`); tithe.js "import nothing from TRADE's internals" (`ARCH_WF:753-755`) | TRADE: "tithe: a band of house fortune flows to the temple" and "FAITH's tithe executor will READ house books" (`DESIGN_FP_TRADE.md:610`, `DESIGN_FP_ARCH_TR.md:288`); SPINE crux "tithe coupling to TRADE" (`SPINE:513`) | DISAGREES on the stream's source (believers vs house) |
| 13 | "no treasury, no temple wealth, no gold touches a temple anywhere in src/domain" (`FAITH:246-249`) | W-COIN treasury with `tithe_share` TAX_FORM — "a theocracy takes its tithe and little else" (`treasury.js:269-272`, `:296-297`; flag `treasuryEnabled` dark `simulationRules.js:469-478`) | STALE (coin reversal ODQ §731.1) |
| 14 | THE LURE's "sacred arm" (planted calamity rumor baits a reading) and "planted-heresy arm" built in FP-INFORMATION (`FAITH:887-888`, `:1015-1016`) | INFO volumes: zero hits for omen/calamity/heresy; INFO's devotion bait rides `faithLabel` (WHICH rite) and feeds sacred tension (`DESIGN_FP_ARCH_IN.md:407-408`) | SILENT |
| 15 | Wrath reading → POP flight (`FAITH:885`) | POP: "FAITH's omen read is THEIR write (coupling row only)" (`DESIGN_FP_ARCH_POP.md:400`; `DESIGN_FP_POPULATIONS.md:781-782`) | AGREES |
| 16 | INT-1 seatBooks seam deliberately NOT reserved (`FAITH:322-328`) | INTERIOR pins the ABSENCE (`DESIGN_FP_ARCH_INT.md:644-645`); FOLD seam row 24 (`FOLD:2637`) | AGREES |
| 17 | (silent) | INTERIOR Row 7 expects INT-6's burial public rite to consume FAITH's shared-rite family (`DESIGN_FP_INTERIOR.md:1405-1410`) | SILENT on FAITH side |
| 18 | GRAMMAR mediation's "temple arm via FAITH" (`SPINE:540`) | FAITH specs no temple mediator; FPQ-26: "'faith-led on both sides' cannot occur under the one finder" | SILENT / unbuildable |
| 19 | religionStates has ONE writer (`FAITH:158-161`; `ARCH_WF:265-266`) | WC: faith exposure is "a bounded religionState share nudge through traditionsKernel's one sanctioned writer" (`DESIGN_FP_ARCH_WC.md:662-669`, `:2476`); code: `traditionsKernel.applyFaithNudges` returns "the possibly-new religionStates object" (`traditionsKernel.js:444-455`) | DISAGREES — two writers |
| 20 | (silent) | WY-4 `faithCargo` on migration columns (`DESIGN_FP_ARCH_WY.md:500`, `:566`; `FOLD:509`) and WC veteran faith exposure carry faith as culture | SILENT — the volumes never mention the two programs that the 08-06 record calls faith's "sociological maturation" (`DOCTRINE:81-84`) |
| 21 | WF-8 census counts `sovereignty_sale_judged` once (`ARCH_WF:704-707`) | Routed `heraldRouting.js:162` | AGREES |
| 22 | DS-FTH-3 spellings bind patronFalls/covert/templeWealth/season (`ARCH_WF:114-126`) | ODQ §394 F2: "templeWealth is ARCHITECTED-NOT-BUILT (WF-7) … ENDOWED kept and marked not-drawable until WF-7 lands" (`ODQ:16046-16047`) | AGREES |
| 23 | W-FAITH F1c–F7c (authored deity character, boon/bane channels bound to causal quantities, the faith influence field, the tuning surface — `faithField.js` 472 lines, `faithChannelBindings.js`, `faithTuningSurface.js`; commits `a8673e3e9`..`4c7d59d1e`, 08-31/09-01) | Neither WF volume mentions them (zero hits for W-FAITH/faithField/boon/bane) | SILENT — the census `FAITH:189-257` / `ARCH_WF:128-177` omits a landed faith subsystem |

---

## 5. INTERNAL CONTRADICTIONS (both statements from the family's own volumes, incl. the fold's PHASE 5)

1. **Suppression stamp sites.** `FAITH:378-381` "stamped by the existing suppression transitions (religionState.js:262/:277)" (two) · `FOLD:1931-1932` "suppressedAtTick stamped by the two existing suppression transitions" · `ARCH_WF:270-276` "three at the WF-F stamp: :262/:277/:485". Code settles it: ONE writer (`religionState.js:239` "THE ONE WRITER of `deities[ref].suppressed` and `deities[ref].suppressedAtTick`").
2. **Pilgrims' purpose.** `FAITH:76-77` "legates and named pilgrims ride SP-1 with typed purpose `religious`" and `FAITH:660` "Named movers ride SP-1, purpose `religious`" · `ARCH_WF:450-452` "`pilgrims → …pilgrimErrand.js` (purposeClass **`personal`** — NEVER `religious`)" · `FOLD:1946-1947` "legates/pilgrims mint through SP-D's writer with purpose `religious`".
3. **SP-1 status inside ARCH_WF.** `ARCH_WF:88-92` (R5) "SP-1 … remains ABSENT tree-wide" and "WF-2b's movers … must NOT be built by widening war's envoy vocabulary" · `ARCH_WF:443-447` "HARD PRECONDITION — DISCHARGED (WF-F round): SP-1 is BUILT … `worldState.envoyErrands`". R5 was never bracket-corrected.
4. **Term catalog counts inside ARCH_WF.** `ARCH_WF:39` "TWELVE terms across EIGHT families" · `ARCH_WF:599` "catalog now 24 terms / 11 families" · `ARCH_WF:609-610` (same WF-6 block) "twelve terms / eight families today + faith's rows — R1". FAITH still says "eleven TERMS across SEVEN families" (`FAITH:239-241`, `:1079-1080`). Code: 26 terms / 13 families (count of `family:` rows in `peaceTermsCatalog.js`).
5. **The realm Schism arc.** `FAITH:1316-1317` "the Schism realm arc EXISTS (realmEvents.js:104) — joined by" four · `ARCH_WF:49-62` (R2) "FALSE at HEAD … WF-8's realm-arc battery therefore mints FIVE arcs". FAITH's §5-WF-8 and §7 were never bracketed (`FAITH:1395`, `:1578-1579` still four-arc shaped).
6. **GR-3 faith rows.** `FAITH:1095-1101` two rows are "CATALOG-ADDITION REQUESTS … if the canonical catalog declines them, their executors do not build" · `ARCH_WF:597-601` "GR-3's five faith rows are LANDED".
7. **Which "pact" frays.** `FAITH:203` (census) the stance lane's "pact/foothold = news-only" · `FAITH:747-750` WF-3 "faith pacts gain a durability read … consumed by the pact's fraying clock (the existing compliance/fraying machinery via SP-3)". A stance-lane pact (a creed-to-creed news beat, `deityStanceLane.js:233`) has no treaty instrument to fray; the SP-3 instrument is a court-to-court treaty. The volume never says which object WF-3's durability attaches to (PLAUSIBLE design gap, not a quote-level contradiction).
8. **The lighting law.** `FAITH:274-275` "Eight new virtual flags … lit only at the owner-signed soak redo" and `FAITH:1631` "nothing here lights a flag" · the shipped tree lights `faithUnseatingEnabled` in four presets under §934.84 (`simulationRules.js:789-792`). The fold's PHASE 5 header (`FOLD:1919`) carries no lit marker either.
9. **The obituary's flag.** `FAITH:1303-1310` WF-8's voices land "behind the flag" `faithNarrationEnabled` (J-WF-9 `:1503-1506`) · the WF-8a obituary shipped behind `faithUnseatingEnabled` ("Behind the SAME hoisted `unseating` local WF-1b lit — no second flag read", `religiousContest.js:810-811`). Either J-WF-9 is amended to say "each WF-8 slice rides its producer's flag" or `faithNarrationEnabled` is dead.

---

## 6. STALE PREMISES (refuted at `00b648c9d`; live line quoted)

1. **Fall vocabulary is four, not five.** `FAITH:527-532`, J-WF-5 `:1485`, `FAITH:1419` ("all five causes REACHED"), `ARCH_WF:414` ("five closed causes"), `FOLD:1931` ("five closed causes"). Live: `PATRON_FALL_CAUSES = Object.freeze(['discredited', 'displaced', 'imposed', 'suppressed'])` (`patronFall.js:76`) — "`abandoned` IS DELIBERATELY ABSENT, AND THE ABSENCE IS A MEASUREMENT" (`:61`). Ruling ODQ §215.2. WF-9's histogram, WF-8's "fall causes ×5" (`FAITH:1312`) and §8's sentences must read four.
2. **`faithUnseatingEnabled` is lit, the volume says every wave ships dark.** Live: `simulationRules.js:789-792`, spread `:899/:956/:999/:1213`.
3. **`believedDevotionEnabled` is lit nowhere** (CONFIRMED): registered `simulationRules.js:251`; `FP_LIT_BELIEF` holds the other three (`:793-797`); comment `:772-773`. WF-2a's season pull (`FAITH:637-639`) and WF-6's negotiated arm both stand on it.
4. **`faith_communion` cannot cross in any shipped preset** (CONFIRMED, chain in §2): `pactTriggers.js:233-235`. The tellable sentence "the Forge's missionaries may preach within the walls" (`FAITH:1146-1147`) is unreachable through negotiation, and no war-end lens drafts faith terms (GR finding: `CLASS_TERM` carries no faith class, `peaceTermsCatalog.js:406-416`, per findings/GR.md).
5. **The WR-1 join is built and dark.** `FAITH:1648-1650` "consumed by war's WR-1 dissolution receipts when `warTerminationEnabled` lights". Live: `warTerminationEnabled: false` with "deliberately absent from DEFAULT_SIMULATION_RULES and every other preset" (`simulationRules.js:1031-1036`).
6. **SP-1 ledger name and purpose.** `FAITH:439` `spatialLedgers.errands`, `FAITH:76-77` `religious` for pilgrims. Live: `ERRAND_CONSUMERS` rows `legates … purposeClass: 'religious'` and `pilgrims … purposeClass: 'personal'`, both `built: false` (`envoyErrandVocabulary.js:320-334`); the errand spine is HELD DARK in every preset (`simulationRules.js:781-783`).
7. **SP-4's temple actor does not exist.** `FAITH:102-106` `riskToleranceOf(temple)`. Live: `POSTURE_ACTOR_KINDS = Object.freeze(['settlement'])` (`strategicPosture.js:97`); reads are `courtPostureOf` (`:222`) / `courtRiskAppetiteOf` (`:303`). The roads collision ARCH_WF warned of is now at `roads/state.js:334` (ARCH_WF:173 said :319).
8. **"No gold touches a temple."** `FAITH:246-249`. Live: W-COIN treasury mints a `tithe_share` tax form (`treasury.js:269-272`), "a theocracy takes its tithe and little else" (`:296-297`), mapped from "Church Tithes" income rows (`:354-355`); dark (`simulationRules.js:469-478`). Overturned by the coin reversal (ODQ §731.1, `ODQ:31490`: the owner "KNOWINGLY REVERSES the recorded no-conserved-coin ruling"). WF-7's J-WF-3 "wealth band, not books" (`FAITH:1478-1480`) was argued against a coinless estate.
9. **religionStates has two writers.** `FAITH:158-161`, `ARCH_WF:265-266`. Live: `traditionsKernel.js:444-455` "Apply deity-flavored ±1 religionStates share nudges … Returns the possibly-new religionStates object" — a second write path the WF "one writer" law never names.
10. **Five compound arcs, no schism.** `FAITH:1316` "the Schism realm arc EXISTS". Live: `COMPOUND_SIGNATURES` keys `gods_abandonment`/`the_wasting`/`starving_city`/`calling_of_debts`/`shadow_court` (`realmEvents.js:25-68`).
11. **The Ascendancy still lies.** `FAITH:1332-1335` (the honesty fix). Live: "Temples multiply, rivals bend the knee, and the faithful walk the roads in numbers." (`realmEvents.js:336`).
12. **The pilgrim bar is wider than the volume's.** `FAITH:487-489`, `ARCH_WF:380-381` "act ∈ {procession, offering, fair}". Live: `return scaleBand >= GRAND_SCALE_MIN && (PILGRIM_ACTS.has(act) || scaleBand >= SPECTACLE_SCALE);` (`src/domain/traditions/pilgrimage.js:62`) — a spectacle-scale rite qualifies with any act.
13. **Frozen kernel figure.** `ARCH_WF:78` "pulseKernel.js is FROZEN at 1580 effective". Live: `scripts/.size-baseline.json` `src/domain/worldPulse/pulseKernel.js 1581`; `warTermination.js 818` (ARCH_WF:410 holds).
14. **Catalog site and size.** `FAITH:239` "peaceTerms.js:164-188"; `ARCH_WF:599` "peaceTermsCatalog.js:228-245". Live: faith rows at `peaceTermsCatalog.js:249-266`; 26 terms / 13 families.
15. **Certification prose is now false.** Live `subsystemRowsVirtual.js:480`: "no preset declares this key, so a soak receipt carries no entry for it and this row can only ever grade UNOBSERVED" — four presets declare it since LIT-1a. (Code-side; the chair may route it to a cure lane.)
16. **The census omits W-FAITH.** `FAITH:193-214` / `ARCH_WF:130-171` list no authored-character fields, no boon/bane channel bindings, no influence field (`faithField.js`, `faithChannelBindings.js`, `faithTuningSurface.js`, `faithWitnessSource.js`; W-FAITH F1c–F7c, 08-31..09-01). Any WF lens reading "patron temper" (`FAITH:820`) must name the DERIVED `deityTemper` (the stored axis is INERT — `ADD15`, `deityAxes.js`).
17. **The birth door.** No WF mechanism can fire on a born world: the birth preset seats no deity (FPQ-62, the owner's open word), deities are premium custom content (D.0, `FAITH:147-150`), and the release corpus is deity-free (`whole-world-soak.mjs:263` passes `{}` unless `--deity-case`). Every WF DM-felt sentence is a premium-world sentence. (The volume says this at `FAITH:164-169`; the fold should say it at the top.)

### 6b. THE DEITY DOCTRINE AUDIT (every mechanism; strays quoted)

The volumes are largely compliant: every receipt's subject is priests, pews, courts, congregations or garrisons. Strays and tensions:
- **`FAITH:149`** "a free user's god can never act." — the sentence implies a premium user's god can. Under §1c-1 and the 08-06 law no god acts in any tier. Wording stray.
- **`FAITH:864`** "they say the gods have abandoned Greyfen" — predicates abandonment of gods (reported speech). The landed faith corpus holds the stricter line: "It never says a god died, departed, abandoned anyone or failed." (`faithNews.js:14-17`). Stray.
- **WF-4 as a whole (`FAITH:806-915`)** is the one mechanism in tension with the 08-06 law: "The users have to determine whether a divine act happens and whether to attribute any meaning to it. Not our faith system." (`DOCTRINE:67-68`). WF-4 has the ENGINE originate the attribution (the pulpit reads a famine as wrath); the 09-12 carve-out licenses followers ACTING per the deity's recorded axes, not the engine choosing that a calamity MEANS something. The kind `portent` adjudicates that "a qualifying calamity/relief lands as foretold ⇒ fulfilled" (`FAITH:837-839`) — an engine-resolved prophecy a DM will read as confirmation. PLAUSIBLE stray; the owner's call (§11 Q1).
- **The ATTRIBUTED EDIT was never slotted.** `DOCTRINE:86-93`: "Slots as a small wave beside the WF sociological set (edit machinery + belief joins + Herald voice …)". Zero hits in both volumes and the fold. Under the owner's never-deferred law this is a dropped thread, and it is the doctrine-sanctioned twin of WF-4 (DM attributes; believers contest).
- **Code, shipped (outside the volumes, surfaced because the doctrine is constitutional):** `realmEvents.js:28` `label: "God's Abandonment"` rendered as the headline `${signature.label}: …` (`:198`) — predicates abandonment of a god with no believer subject. `realmEvents.js:34` "A false prophet is gathering the desperate." — "false" adjudicates a prophecy's truth (PLAUSIBLE stray; the summary's "prophets nobody ordained" at `:30` is the compliant phrasing).
- Compliant, checked: `patronFall.js:9-16`; `faithReceiptPools.js:57-62`; `FALL_SENTENCE` (`faithPanelModel.js:112-117`); the faith catalog rows' comment "the engine is a clerk of what courts promise each other about people who worship" (`peaceTermsCatalog.js:240-243`); `scoreFaithCommunion` ("a shared rite is a recognition, not a conversion", `pactTriggers.js:221-223`); WF-3's authored-axis read (`FAITH:767-769`, compliant under ADD15 provided the derived temper is read).
- **The 08-06 scope note.** "Faith is right to be [a] slimmer system" and "no theological waves are owed, ever" (`DOCTRINE:65`, `:84`) post-date the volume (08-02) and the compile (08-04). Neither volume records the slimming. WF-2..WF-7 are sociological, not theological, so none is forbidden; but the owner's "slimmer" is a scope signal the 10-wave program never answered (§11 Q2).

---

## 7. THE CLOCK AND THE TIER

A tick is one week (`intervalWeeks.js:7-12`; `FAITH:91-93` STAIN_DECAY 0.06/tick ≈ 11-week half-life). Every WF mechanism needs a DEITY-BEARING world (premium; the birth preset seats none — FPQ-62).

| Mechanism | Cadence / dwell | Aspatial OK? | Needs lit | Felt clock |
|---|---|---|---|---|
| WF-1 fall | fast: flip at PATRON_FLIP_TICKS 3 weeks (`religionState.js:57`) | yes (LOCAL) | `faithUnseatingEnabled` (lit, 4 presets) | weeks — FELT |
| WF-1 obituary | slow: prune at ≥4 suppressed (`religionState.js:434-440`) | yes | same | years |
| WF-1 × WR-1 join | war-end | yes | `warTerminationEnabled` (dark everywhere) | never in product |
| WF-2a season | annual feast weeks (`FAITH:683-684`) | **no** — aspatial draws zero (`FAITH:639-641`; `src/domain/traditions/pilgrimage.js:71,78` "null ⇒ aspatial ⇒ 0") | spatial canon + grand observance + `faithSpreadEnabled` (2 presets) + `believedDevotionEnabled` (none) | **yearly** — a DM advancing weeks sees one feast a year |
| WF-2b legates/pilgrims | legs in weeks (law M) | needs routes | errand spine (dark everywhere, `simulationRules.js:781`) | weeks, but cannot be lit |
| WF-3 consequences | per-tick thresholds; durability slow | yes | `faithSpreadEnabled` | **seasonal–yearly** (fraying) |
| WF-4 reading | fast on the calamity tick; expectation windows "banded weeks" (`FAITH:879-881`) | yes | none beyond deity | weeks — FELT (the program's most tellable fast beat) |
| WF-5a split | fast on contest resolution | yes | — | rare event |
| WF-5b underground | growth half-life 520 w, assimilation 156 w (`FAITH:998-1002`) | yes | — | **decade / epoch** — the volume's own "a decade of silence, then a week of bells" (`FAITH:1005-1006`) |
| WF-6 terms | SP-3 proposal cadence; grants 3–20 years (`peaceTermsCatalog.js:249-266`) | yes | belief axes + devotion (unlit) | **yearly** |
| WF-7 tithe | quarterly 13 w (`FAITH:1257`) | yes | — | **seasonal** |
| WF-8 voices | fast | yes | — | weeks — FELT |
| WF-8 Reformation arc | 260 w window (`FAITH:1326`) | yes | — | **epoch** |
| WF-9 | soak | — | — | — |

Flagged (felt drama at the seasonal/yearly/epoch clock): WF-2a, WF-3, WF-5b, WF-6, WF-7, the WF-8 realm arcs. The fast, felt beats are WF-1's fall, WF-4's reading and WF-8's voicing of transitions that already happen every week.

---

## 8. DEPTH VS FELT VALUE

- **WF-0** — the DM sees nothing; the owner sees certification rows. KEEP (landed).
- **WF-1** — a cause-only panel line, a town obituary, a realm obituary. KEEP, and finish the felt half: the flagship sentence has no producer and the panel line cannot name the creed (`faithPanelModel.js:226-230`). Cheapest felt win in the family.
- **WF-1 × WR-1** — dark with war termination. KEEP the join; nothing to build.
- **WF-2a season** — yearly, map-bound, standing on an unlit belief family. DEFER (the owner deferred the map layer, ODQ §740.1 `ODQ:31547`; the season needs spatial canon).
- **WF-2b legates/pilgrims** — errand spine held dark everywhere. DEFER.
- **WF-3 stance consequences** — invisible threshold colour plus an over-extension counterforce that WF-9 must prove at soak scale. CUT-TO-SENTENCE (keep the G1c fence and the law that a stance colours, never selects); FOLD the durability idea into GR's pact lifecycle if faith terms ever form.
- **WF-4 omen reads** — the most tellable fast beat ("two towns, one famine"). KEEP only after the owner rules it in-doctrine (§11 Q1); if he rules the 08-06 line strictly, FOLD it into THE ATTRIBUTED EDIT (the DM attributes, the believers' readings contest it).
- **WF-5a split** — rare, lands on the town roster. KEEP small (it needs `creedRef` — a persistence shape, owner-gated per CLAUDE.md non-negotiable 3).
- **WF-5b underground** — decade clocks, DM-only, a new covert field. CUT-TO-SENTENCE: `suppressedAtTick` already exists (`religionState.js:277`), so a resurgence receipt can say how many years a creed was out of the light ("kept in cellars a decade") with no covert machinery.
- **WF-6 faith terms** — rows landed, drafting unreachable, consumers zero. FOLD into GRAMMAR: two consumers (missionary_access → the spread channel gate; tolerance_guarantee → the eviction gate) plus lighting `believedDevotionEnabled` is the whole felt path; `pilgrimage_right` and `temple_restitution` DEFER with WF-2/WF-7.
- **WF-7 tithe** — seasonal, a second coin-like stock beside W-COIN's `tithe_share`. FOLD into W-COIN (the treasury already models a theocracy's tithe); the resentment arm is POP's commons voice. templeWealth DEFER.
- **WF-8 narration** — the volume's own diagnosis: "Faith's stories die at the mouth, not the heart" (`FAITH:1301-1302`). KEEP and promote to first: voice entry/eviction/suppression/resurgence/standing (weekly, already computed, no new state) and the one-line Ascendancy honesty fix. The five realm arcs: DEFER except the Reformation (it reads the ring WF-1 already writes).
- **WF-9** — KEEP, sized to what lands.

---

## 9. VOCABULARY (closed ladders the family mints or leans on)

| Name | Values | Line | Homonym risk |
|---|---|---|---|
| fall causes | volume {displaced, discredited, abandoned, imposed, suppressed}; code {discredited, displaced, imposed, suppressed} | `FAITH:527-532`; `patronFall.js:76` | `abandoned` vs WF-4 `abandonment` vs `gods_abandonment` arc |
| reading kinds | {wrath, test, abandonment, vindication, portent} | `FAITH:425-426`, `:821-822` | `abandonment` (above) |
| reading state | {open, fulfilled, failed} | `FAITH:435` | — |
| season bands | {trickle, steady, feast, flood} | `FAITH:636-637` | — |
| covert size | {a handful, a score, a congregation in all but name} | `FAITH:1063-1064` | — |
| endings mix (8) | {faith_converted, hollowed, gone_underground, resurgent, extinct, split, communion, imposed_held} | `FAITH:1399-1400` | `faith_converted` vs GRAMMAR `converted` (handled `FAITH:583-586`); `communion` vs the `faith_communion` trigger vs `shared_rite` |
| arc transitions | {feast_kept, roads_closed} · {kept, betrayed} · {endowed, plundered} | `FAITH:699-704`, `:782-784`, `:1266-1269` | `kept` vs GR/compliance "honored"; `endowed` vs DS-FTH prose "ENDOWED" (`ODQ:16046-16047`) |
| flags (8) | faithUnseating · pilgrimage · faithStanceConsequences · omenReads · faithSchism · faithTerms · tithe · faithNarration (+Enabled) | `FAITH:279-286` | `titheEnabled` vs W-COIN `treasuryEnabled`'s `tithe_share` |
| faith term family | {missionary_access, pilgrimage_right, shared_rite, tolerance_guarantee, temple_restitution} | `FAITH:1493-1494`; `peaceTermsCatalog.js:249-266` | — |
| realm arcs | {Schism, Great Pilgrimage, Persecution, Awakening, Reformation} | `ARCH_WF:682-684` | "Schism" = settlement contest vs realm arc |
| piety bands (substrate) | secular → devout | `FAITH:208` | **code DEVOTION_BANDS reuse the same five words keyed on `standing`, not piety** (`subsystemRowsBelief.js:292`; `beliefAxisSubjects.js:356-373`) — same words, two quantities |
| standing vs rank | standing {cult, established, ascendant}; rankAxis {major, minor, cult} | `ADD15` record; `FAITH:197` | `cult` in both ladders (the "TWO DIFFERENT RANKS" trap) |
| "tithe" | WF-7 stream · W-COIN `tithe_share` · EC reserve band `tithe` · granary tithe · prize token `tithe_rights` | `FAITH:1199`; `treasury.js:271`; `DESIGN_FP_ARCH_EC.md:631`; `FAITH:246-248` | FIVE meanings |
| "pact" | stance-lane `faith_pact` (creed news) · SP-3 treaty · `faith_communion` occasion | `FAITH:203`, `:751`; `heraldRouting.js:149`; `pactTriggers.js:61` | WF-3 conflates the first two (§5 item 7) |
| Herald desks | faith · divination (readings → faith; open expectation → divination) | `FAITH:870-878` | — |

---

## 10. REFINEMENTS (in-place, dated-bracket idiom)

1. `[FAITH:10-15]` — "Status: ARCHITECTURE. … Every wave ships DARK." → `[CORRECTED 2026-10-16 (coherence fold) — WF-0 LANDED 09-24 (217ff1700…06025d546); WF-1 LANDED as WF-1a..1F 08-16/08-22 (66fda66d4…5d18b4a0c) with the obituary as WF-8a (47ea9c9ba); faithUnseatingEnabled ships LIT in four presets incl. the default under ODQ §934.84. WF-2..WF-9 unbuilt.]` — status truth.
2. `[FAITH:527-532]` and `[FAITH:1485]` — five causes → `[CORRECTED 2026-10-16 (coherence fold) — FOUR causes ship (patronFall.js:76); `abandoned` cut on zero producers (ODQ §215.2); a sink-crossing unseat is a new behaviour and its own wave. WF-8 "×5" and WF-9 "all five causes REACHED" read four.]` — the law's closure stands; its membership moved.
3. `[FAITH:76-77]`, `[FAITH:660]`, `[FOLD:1946-1947]` — pilgrims purpose `religious` → `[CORRECTED 2026-10-16 (coherence fold) — legates ride purposeClass `religious`, pilgrims `personal` (envoyErrandVocabulary.js:320-334, ARCH_WF:450-452); the ledger is worldState.envoyErrands (CR-FP-10), not spatialLedgers.errands.]`
4. `[FAITH:102-106]` — `riskToleranceOf(temple)` → `[CORRECTED 2026-10-16 (coherence fold) — SP-4 landed with one actor kind, `settlement` (strategicPosture.js:97; courtPostureOf/courtRiskAppetiteOf). No temple appetite exists; every temple-posture read in WF-2/3/5/6/7 falls back to the seat's posture or waits for a new actor kind (owner-gated new capability).]`
5. `[FAITH:1122-1125]` — the communion trigger → `[CORRECTED 2026-10-16 (coherence fold) — SHIPPED as believed-devotion parity (pactTriggers.js:221-246), with no creed-identity or both-patrons read, and unreachable while believedDevotionEnabled is lit nowhere. Three definitions exist (this line, GRAMMAR:694-696, the code); the fold names one.]`
6. `[FAITH:310-314]` — "the drafting pool excludes it" → `[CORRECTED 2026-10-16 (coherence fold) — it does not: PACT_DRAFT_LENS drafts pilgrimage_right at ≥0.45 unconditionally (pactFormation.js:193). Latent while faith_communion cannot cross; must be fenced before devotion lights.]`
7. `[FAITH:246-249]` — "no gold touches a temple" → `[CORRECTED 2026-10-16 (coherence fold) — the coin reversal (ODQ §731.1) landed W-COIN; treasury.js mints a `tithe_share` tax form (dark). WF-7 must compose with it or fold into it; J-WF-3 was argued against a coinless estate.]`
8. `[FAITH:158-161]` — ONE writer → `[CORRECTED 2026-10-16 (coherence fold) — religionStates has a second write path, traditionsKernel.applyFaithNudges (±1 share nudge, traditionsKernel.js:444-455), used by WC/WY faith exposure. The law reads "one writer per field family", or the nudge is routed through the fold.]`
9. `[FAITH:1316-1317]` — "the Schism realm arc EXISTS" → `[CORRECTED 2026-10-16 (coherence fold) — it does not (ARCH_WF R2); five arcs if built.]`
10. `[FAITH:149]` — "a free user's god can never act." → `[CORRECTED 2026-10-16 (coherence fold) — wording: no god acts in any tier (§1c-1); read "a free user's world mints no faith event".]`
11. `[FAITH:864]` — "they say the gods have abandoned Greyfen" → `[CORRECTED 2026-10-16 (coherence fold) — the deity doctrine's subject is the followers (ADDENDUM 15; faithNews.js:14-17): "they say Greyfen's altars stand empty" — never a god abandoning.]`
12. `[FAITH:1095-1101]` — "CATALOG-ADDITION REQUESTS" → `[CORRECTED 2026-10-16 (coherence fold) — all five faith rows LANDED (GR-3a; peaceTermsCatalog.js:249-266); the decline branch is dead.]`
13. `[FAITH:239-241]`, `[FAITH:1079-1080]`, `[ARCH_WF:39]`, `[ARCH_WF:609-610]` — term counts → `[CORRECTED 2026-10-16 (coherence fold) — 26 terms / 13 families at 00b648c9d; every sizing pin derives from live TERM_FAMILIES (ARCH_WF R1's own rule).]`
14. `[ARCH_WF:88-92]` (R5) — "SP-1 … remains ABSENT" → `[CORRECTED 2026-10-16 (coherence fold) — superseded by ARCH_WF:443-447 (SP-1 built, envoyErrands).]`
15. `[ARCH_WF:270-276]`, `[FOLD:1931-1932]`, `[FAITH:378-381]` — stamp sites → `[CORRECTED 2026-10-16 (coherence fold) — one writer stamps (religionState.js:239-277).]`
16. `[FAITH:1648-1650]` — the WR-1 join → `[CORRECTED 2026-10-16 (coherence fold) — built (warTermination.js:869) and dark in every preset (simulationRules.js:1031-1036): the sentence reaches no DM until war termination lights.]`
17. `[FAITH:569-570]` (WF-1 receipt) → `[CORRECTED 2026-10-16 (coherence fold) — no producer: the landed reader is the cause-only panel line (faithPanelModel.js:112-117), which cannot name the creed. The flagship sentence is owed a kind (WF-8 voice).]`
18. `[FAITH:1503-1506]` (J-WF-9) → `[CORRECTED 2026-10-16 (coherence fold) — WF-8a shipped on its producer's flag (faithUnseatingEnabled, religiousContest.js:810-811); faithNarrationEnabled gates only the voices of PRE-EXISTING silent transitions.]`
19. `[FAITH:189-214]` (census) → `[CORRECTED 2026-10-16 (coherence fold) — add the landed W-FAITH layer (authored character, boon/bane channel bindings, influence field, tuning surface; faithField.js et al.) and WY-4 faithCargo / WC faith exposure as faith's sociological producers (DOCTRINE:81-84). WF lenses read the DERIVED deityTemper.]`
20. `[FAITH:1464]` (§6 head) → add `[ADDED 2026-10-16 (coherence fold) — THE ATTRIBUTED EDIT (owner law 2026-08-06, chair refinement accepted) is unslotted in this volume; it needs a slot or a recorded close.]`

---

## 11. OPEN QUESTIONS FOR THE OWNER

1. **Is WF-4 (the pulpit reads a calamity) inside your 08-06 line?** Your words: "The users have to determine whether a divine act happens and whether to attribute any meaning to it. Not our faith system." WF-4 has the engine originate the attribution (believers' voice, never the god's). Options: keep it as followers' speech under the 09-12 carve-out; or rebase it on THE ATTRIBUTED EDIT so only a DM's attribution starts a reading.
2. **"Slimmer system."** WF still charters ten waves and eight flags. Re-sequence to the felt core (WF-8's voices + finishing WF-1 + WF-6's two consumers), and defer or close WF-2/3/5b/7? That is re-sequencing, which is yours.
3. **Light `believedDevotionEnabled`?** Without it no faith term can ever be negotiated in shipped play. It is a same-seed shift in dramatic/living/full.
4. **The birth preset (FPQ-62, §903 row 1).** It seats no deity, so the only lit faith layer is vacuous on every born world. The open word stays yours.
5. **WF-5a `creedRef` and WF-7 `templeWealth`** are new persisted shapes. WF-7 must also be ruled against W-COIN's `tithe_share`: compose or fold.
6. **The shipped "God's Abandonment" headline** (`realmEvents.js:28`, `:198`) predicates abandonment of a god. Rename (e.g. "The Forsaken Altars") as a declared text shift?
