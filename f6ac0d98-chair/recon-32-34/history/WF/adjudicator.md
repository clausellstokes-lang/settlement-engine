# ADJUDICATOR — WF (FAITH), waves WF-0 … WF-9 — 2026-09-15

**Seat:** the adjudicator for the WF family in the #32–#34 history pass.
**Inputs read whole:** `DESIGN_FP_ARCH_WF.md` (846 lines, the ledger's §308-signed cured copy),
`history/WF/ledger.md` (228 lines), `history/WF/older.md` (185 lines), the TRADE pilot fold
(`HISTORY-TRADE-2026-09-15.md` §A.1/§A.3/§A.4, the grep-trap paragraph, §C whole), and the WF rows of
`PROGRAMME-32-34.md` §B, `RECHECK-32-34.md` §1/§5, `PRICING-32-33.md` §B/§C.
**Adjudication base:** every LANDED / DARK / INERT / RECORD≠CODE claim below was RE-OPENED by me at
`/private/tmp/claude-502/…/4e3d2f70…/scratchpad/kit/laneCONSIST-932`, **HEAD `315080928`**
(`LT37 car 6`, 2026-09-15). Read-only; no suite executed, no git mutated.
**Labels:** CONFIRMED = I executed the grep/read and quote it with `path:line`, or ran the `git log` /
`git merge-base` myself. PLAUSIBLE = a derivation or arithmetic of mine over CONFIRMED inputs.

---

## §A — THE VERDICT IN ONE PARAGRAPH

Both readers are right that faith was built far deeper than any recon pass records, and I confirm the
shape of it: **three programmes built faith machinery under three different names, and exactly one WF
wave landed under the WF name.** `git log --all --grep='feat(WF'` returns **seven commits and only
seven** — WF-1's six cars (`66fda66d4` 1a · `39d0ad7c8` 1b · `adb5faf3f` 1C · `1a90b5639` 1d ·
`3ac279db4` 1E · `5d18b4a0c` 1F) plus `47ea9c9ba` WF-8A — every one an ancestor of HEAD (CONFIRMED,
`git merge-base --is-ancestor`). Everything else the owner may remember as faith is either **Phase 4**
(July's `W-F0…W-F8` religion engine, the only faith machinery LIT in a shipped preset), **GRAMMAR**
(GR-2/GR-3a/GR-3b, which built ~80 % of WF-6 under its own name), or **W-FAITH** (ODQ §797, cars
F1c–F7c, 2026-08-30 → 09-01 — a second, entirely separate faith programme of ~nine modules that the
WF volume predates by four weeks and that **no recon pass names once**). The family's count moves from
the recon's *1 built / 2 part / 7 unbuilt* to **0 built-and-lit / 1 LANDED-DARK-WHOLE (WF-1) /
2 PART-BUILT (WF-6, WF-8) / 7 UNBUILT**, and the cars from **47–74 → 50–79** (+3–5, ≈ +7 %). Unlike
TRADE there is **no ledger stop** against any WF wave (no §96.2 analogue) and — the sharpest positive
finding — **no join car is owed**: WF's believed-devotion ground truth is LIVE where TR-3's was
generation-frozen. What WF owes instead are **four mandatory car 0s**, all of the "live producer to
reconcile" and "stale record" classes, and **one chair act** (volume Q1) that blocks pricing WF-8's
remainder.

### A.1 Where I CORRECT a reader

1. **The older reader's summary arithmetic is wrong and its own table is right.** §1 says
   "0 built / 1 LANDED-DARK / 3 part / 5 unbuilt" = 9 of 10 waves; its §3 table reads WF-0 UNBUILT ·
   WF-1 DARK · WF-2 UNBUILT · WF-3 UNBUILT · WF-4 UNBUILT · WF-5 UNBUILT · WF-6 PART · WF-7 UNBUILT ·
   WF-8 PART · WF-9 UNBUILT = **1 dark / 2 part / 7 unbuilt**. The table governs. (CONFIRMED by
   re-deriving every row below.)
2. **The older reader's row #46 overstates one of its three "stale volume" sub-claims.** §3 of the
   volume forbids a new **`worldState.*` top-level key**; W-FAITH's `field` is written at
   `settlement.config.faithProfile.field` (`religionState.js:669-671`) — a settlement-config key on a
   projection that pre-dated W-FAITH. §3's letter is NOT violated. The other two sub-claims stand
   (V10's "temper derived-only" is now a two-arm read; §2's "nothing in this program lights a flag"
   sits beside an unflagged live producer). CONFIRMED.
3. **The ledger reader's WF-3 hazard framing is stale in the safe direction.** It says volume Q2's
   premise is dead and "the §5-4 import-source tripwire is the live hazard". SP-4 landed as
   `strategicPosture.js` and its own header records the collision and refuses the name:
   `strategicPosture.js:9-18` ("`riskToleranceOf` IS ALREADY TAKEN: `src/domain/roads/state.js`
   exports `riskToleranceOf(npc)`"), and the read is spelled `courtRiskAppetiteOf` (`:303`,
   `:295` "⚠ NOT `riskToleranceOf` — see the header"). **The collision is already cured by SP-4's own
   naming**; WF-3 inherits a resolved hazard, not a live one. Also ODQ §215.1's "SP-4 posture LANDED
   but dark with **zero callers**" is now stale: `pactFormation.js:110` imports `courtPostureOf` and
   `courtRiskAppetiteOf`. CONFIRMED.
4. **PROGRAMME §B's WF-1 row ("BUILT — code wins") is true and incomplete.** It is built whole and it
   is **dark in every preset**. Under the owner's 09-15 built-lit directive that is a live gap, and
   WF-1 has **no row at all in PRICING §B** — so the lighting/declaration work is unpriced. CONFIRMED
   (row absence by grep of PRICING §B; darkness by the lighting census, §E).

---

## §B — WAVE BY WAVE (the verdict PRICING §B should carry)

Status vocabulary: **LANDED-LIT** (runs in a shipped preset) · **LANDED-DARK** (code present, gated,
no preset lights the gate) · **LANDED-UNFLAGGED** (runs on a production path with no gate; dormant by
data) · **LANDED-INERT** (present, unreachable regardless of flag) · **PART-BUILT** ·
**UNBUILT** · **DESIGNED-ONLY**.

### WF-0 — the observation floor — **UNBUILT** (2–3 C, unchanged)

*Described behaviour:* a bearer-count invariant on the two faith certification rows, a `deityBearers`
field in the v5 receipt schema, and ONE authored deity-bearing soak case.

*At the consist:* nothing of it. `deityBearers` is a **private, unexported** helper inside
`religiousContest.js:265`, used once at `:591` — not a receipt field (CONFIRMED). The certification row
still reads the honest verdict and names the exact case owed:
`subsystemRowsBaseline.js:60` — *"the soak fixture is DEITY-FREE … THE OBSERVATION NEEDED to certify
this row: one soak case whose settlements carry an embedded `config.primaryDeitySnapshot`, at a horizon
long enough for a patron seat to change, plus a v5 `subsystems.stateKeys` census over
`worldState.religionStates`. Until such a case exists the honest verdict is UNOBSERVED."* (CONFIRMED.)
The certification programme built the ROW; the observation was never taken.

*Remaining:* exactly the volume's WF-0 list. No delta.

### WF-1 — the unseating — **LANDED-DARK, WHOLE** (unpriced; owes 1–2 C)

*Described behaviour:* the flag, the `patronFall.js` leaf, the capped ring, the cause classifier, a
`suppressedAtTick` stamp at every suppression write site, the flag-forked narrative prune key, the
realm last-seat beat, the war-dissolution join, the faith panel's cause line.

*At the consist — every leaf present and mounted (all CONFIRMED):*
- `patronFall.js:2` "WF-1a, THE TYPED PATRON FALL"; `PATRON_FALL_CAUSES` frozen at four at `:76`
  (`['discredited','displaced','imposed','suppressed']`); `FALL_RING_CAP = 3` at `:83`;
  `classifyPatronFall` `:102`; `recordPatronFall` `:138` refusing out-of-vocabulary causes at `:141`;
  `fallCauseFor` `:160`.
- **The one writer** of `suppressed`/`suppressedAtTick`: `religionState.js:239` (header), write at
  `:277`; dormancy key read at `:436`.
- **The flag-forked prune**: `religionState.js:409-440` — dark ⇒ codepoint order, lit ⇒
  newest-suppressed first, `KEEP = 3` read in its own scope (`:434`, the §308.3 "a literal 4 is
  forbidden" ruling honoured).
- **The realm beat**: `realmEvents.js:305-316` mints `impactKind: 'pantheon_extinction'` / headline
  *"The Last Altar of {name}"*, reached only when `lastSeat` is set, which `pantheon.js:466-470`
  computes **only** when `unseating === true`.
- **The war join**: `warTermination.js:538`
  `rules.faithUnseatingEnabled === true ? asObject(state.religionStates) : {}`.
- **Four production gate reads**: `pulseKernel.js:1637`, `religionState.js:649`, `warTermination.js:538`,
  `religiousContest.js:692`; manifest row `simulationRules.js:295`; certification row
  `subsystemRowsVirtual.js:460`; panel fence `faithPanelModel.js:227`.

*The status correction:* **`faithUnseatingEnabled: true` appears in NO preset** — zero hits in
`simulationRules.js`; the only lit sites are five test files
(`tests/property/faithUnseatingDormancyFence.test.js`, `tests/components/faithPanelModel.test.js`,
`tests/domain/{warTermination,pantheon,patronFall}.test.js`). CONFIRMED. So the wave is **built whole
and dark**, and *on top of that* sits the outer data gate (§E).

*Live law bound to it:* ODQ §215.2(1)'s four-cause STOP (`abandoned` cut for having zero producers; a
fifth cause is *"a NEW ENGINE BEHAVIOUR and its own wave"*) and §400's **producer door**: if a future
member builds pure-secularization seat vacancy, the fifth cause and its doc block land in the SAME
commit as the producer. The corpus shrink-back was executed (`3a2db1110`, ancestor).

*Remaining (new, unpriced):* **1–2 C** — the lighting/declaration car under the 09-15 built-lit
directive: light the flag in the lit presets, capture the own-footprint golden on a **deity-bearing**
world before the light, declare the shift, and state in the same act that lighting buys nothing in a
**deity-free** shipped world (§E).

### WF-2 — pilgrims + legates — **UNBUILT** (7–10 C, unchanged; the belief leg is de-risked)

*At the consist:* none of the wave's own leaves exist — `pilgrimSeason.js`, `legateErrand.js`,
`pilgrimErrand.js` all absent (CONFIRMED by `find`). What exists is substrate, and it is better
substrate than TRADE's:
- **SP-1 is built**: `errandMint.js` present; `envoyErrandVocabulary.js:322-335` reserves both rows by
  exact path and type — `legates → src/domain/worldPulse/legateErrand.js`, `purposeClass 'religious'`,
  `wave 'WF-2b'`, `built: false`; `pilgrims → …/pilgrimErrand.js`, `purposeClass 'personal'`,
  `built: false`. Each module must land with its `built:true` flip in the same commit. CONFIRMED.
- **The draw is LIT under TRADITIONS' name**: `traditions/pilgrimage.js` `pilgrimageDraw` imported at
  `traditionsKernel.js:79`, called `:726`; `traditionsEnabled: true` at `simulationRules.js:674`.
  Deity-agnostic, host-only. So WF-2a is a **co-location gate + season composition over a live draw**,
  not a new draw. CONFIRMED.
- **THE BELIEF LEG'S GROUND TRUTH IS LIVE** — the family's answer to the pilot's question 1, and it is
  the OPPOSITE of TR-3's. `beliefAxisSubjects.js:356-372 devotionGroundTruth` reads **only**
  `religionState.{deities[].share, .standing, .suppressed, patronRef}` (rung table `:186`, bands `:115`),
  and `advanceReligionStates` rewrites those every tick from `pulseKernel.js:1261`. There is no
  generator-frozen input anywhere in the path. CONFIRMED. **Believed devotion can be surprised; the
  TR-3-shaped join car is NOT owed.**

*Remaining:* the volume's list, unchanged in size — the season leaf + the ~5-line subsumption fork in
`pilgrimage.js`, the co-location gate, the three-way seeded negative, the two errand consumers with
their registry flips, WR-7b hold consumption + the degraded arm, the flag and its four fences.

### WF-3 — stance consequences — **UNBUILT + a MANDATORY CAR 0** (3–5 → **4–6 C**)

*The premise holds exactly.* `deityStance.js:158-173` still computes `aggression` and
`treatyDurability` and still carries the deferral comment verbatim ("formalized not wired …
OWNER-GATED new-capability / deferred-wave resurrection"); `treatyDurability` has **no reader anywhere
in src** outside that file (CONFIRMED by grep). Only `betrayalHazard` + `cooperation` are consumed.

*What changed under the wave's feet — three LIVE mechanical deity→world couplings it must reconcile
with rather than restate (all CONFIRMED):*
1. **The warlike drive, LIT**: `disposition.js:195 W_DEITY = 0.35`, `:208 deityTemperDrive`, multiplied
   by `pietyLocalMultOf` at `:281`, summed into the drive at `:283`; plus `:469 W_LAW_DEITY = 0.3`.
2. **WR-2's domain pressure**, with the §851 precedence guard: `dispositionProfile.js:168
   deityPressureOf`, `:124 authoredAspectsOf`, `:135` "one arm per deity".
3. **W-FAITH's channel lift — UNFLAGGED, on the production causal path** (see §C).

*And a law it inherits:* `faithField.js:30-38` forbids feeding the temper into a `war_readiness`
channel — *"Feeding the temper into a `war_readiness` channel here would be the DOUBLE-COUNT W-FAITH D1
forbids"*. WF-3's compile must carry that, or it re-prices the same quantity twice at a second grain.

*Remaining:* the volume's WF-3 cars **plus one car 0**: a written reconciliation of the three live
couplings (own / gate / declare each), inheriting the no-double-count law.

### WF-4 — omen reads — **UNBUILT, genuinely untouched** (5–8 C, unchanged)

`omenReading`, `omenReadings`, `omenReadsEnabled` — **zero hits in src** (CONFIRMED); no
`omenReading.js`. The ledger has zero §, zero sha, zero ruling for it. The desk it would speak through
is live: `heraldRouting.js:64 HERALD_SECTIONS` includes `divination`. The family's one wave with
nothing under any name and nothing in any record.

### WF-5 — schism + underground — **UNBUILT + a charter declaration** (8–12 C, unchanged)

`creedRef` — **zero hits in src**. `covertCongregation` — **zero hits**. No covert field on
`religionState`. CONFIRMED.

*Three substrate facts the charter must carry (CONFIRMED):*
- The **settlement** schism has shipped since 2026-06-27 (`0d01e1adc`, ancestor):
  `religionState.js:532 resolvePatronContest`, called `religiousContest.js:893`; and **WF-1 already
  classifies its outcome** — `patronFall.js:113` "DISCREDITED — the schism / legitimacy-floor road:
  resolvePatronContest owned the seat". WF-5a's creed split is a different object and must say so.
- The creed-agnostic institution backing that `creedRef` exists to fix is Phase 4's own design
  (`religionLegitimacy.js:175-185`, "creed-agnostic", `STANDING_BACKING`).
- ⚠ **W-K's institution status lifecycle is LANDED-INERT and flag-dark**:
  `institutionStatusLifecycle.js` exports `advanceInstitutionStatus` / `applyInstitutionStatus` and has
  **zero importers in src** (only comment mentions in `institutionStatusModel.js`,
  `magicSubstitutionReagents.js` and a certification module string), under
  `magicEconomyEnabled` lit in no preset. WF-5a's founding call **cannot lean on a mounted status
  system** — declare it at charter.
- The anti-entrenchment / never-prune-the-cellar pins must be re-derived against WF-1b's **landed**
  flag-forked prune key (`religionState.js:409-440`), not the volume's V4 text.

### WF-6 — faith terms — **PART-BUILT, the most built of the nine** (4–7 → **5–8 C**)

*Landed under GRAMMAR's name, not WF's (all CONFIRMED at the consist):*
- **The five rows**, whole family, priced and labelled: `peaceTermsCatalog.js:228 shared_rite` ·
  `:231 pilgrimage_right` · `:236 tolerance_guarantee` · `:240 missionary_access` (`executor:'grant'`) ·
  `:245 temple_restitution` (`stream: true, executor: 'transfer'`), all `family: 'faith'`; heralds'
  labels at `:416-420`.
- **The crossing**: `pactTriggers.js:226 scoreFaithCommunion`, called `pactFormation.js:261` with
  `DEVOTION_BANDS`.
- **The producer**: `pactFormation.js:174-179` `PACT_DRAFT_LENS.faith_communion` — a four-rung ask
  ladder that drafts **all five** rows (`shared_rite` @0 → `pilgrimage_right`/`tolerance_guarantee`
  @0.45 → `missionary_access` @0.7 → `temple_restitution` @0.9).
- ⭐⭐ **`temple_restitution` ALREADY EXECUTES.** The stream loop is generic over the catalog:
  `peaceTerms.js:721-735` reads `TERM_CATALOG[term.type].stream` and calls `computeTreatyGrainDraw`
  (`treatyTransfer.js`), moving **real conserved grain** through the sink-only primitive. A signed
  temple restitution moves stock today with **no WF-6 executor**. CONFIRMED by reading both sites.

*What is genuinely owed (CONFIRMED):*
- **The four GRANT readers are LANDED-INERT**: `treatyEnforcement.js:270 missionaryAccessFor`,
  `:278 sharedRiteFor`, `:285 pilgrimageRightFor`, `:293 toleranceGuaranteeFor` — **zero callers
  anywhere in src** outside their own module (the only other hits are a comment at
  `couplingRegistryGrammar.js:148` and a registry string at `:186`). Four readers, no consumer: the
  wave's real work is *what a grant DOES*, not *who reads it*.
- **No war-door producer, and the catalog's own comment says otherwise.** `CLASS_TERM`
  (`peaceTermsCatalog.js:385-394`) maps nine asset classes to term types and **no faith row appears**;
  the only two producers in the estate are `CLASS_TERM` (war) and `PACT_DRAFT_LENS` (peacetime). Yet
  `:238-239` calls `missionary_access` *"the row a war's end can EXTRACT (Augsburg's darker half)"*.
  An in-code RECORD≠CODE (§D R7).
- **Three dark flags, not one**, before the crossing can fire at all: `pactFormationEnabled`,
  `beliefAxesEnabled`, `believedDevotionEnabled` — none lit in any preset (§E).
- **A semantics ruling is owed before an executor is written**: a `temple_restitution` that moves
  *grain* rather than repairing a *temple* is already the shipped behaviour. Own it, re-denominate it,
  or fence it — but a WF-6 executor written on top of it double-counts the same clause.

*Remaining cars:* the four grant consumers, the `tolerance_guarantee` breach seam (leaf-first against
`peaceTerms.js`'s zero headroom), the flag + four fences + lit mutant, the bundle fixture, the herald
sentence, **plus the ruling car** (temple-restitution semantics + the war-door decision). The §5-1
catalog tripwire is already DONE (the volume's own `:598-610` records it).

### WF-7 — the tithe — **UNBUILT** (5–8 C, unchanged)

No cousin under any name. `templeWealth` has **no writer anywhere in src** — the only hits are the
dossier-prose corpus (`warFaith.generated.js:4604`, `:5574`) and two self-declaring comments:
`warFaithStateProse.js:96` ⛔ *"`templeWealth` HAS NO WRITER ANYWHERE IN THE ENGINE"* and
`dossierMounts.js:504-505`. CONFIRMED. `tithe.js` absent. The estate's `tithe` is the **granary
reserve** (`foodStockpile.js:12-22`) and the faction prize token `tithe_rights`
(`factionCompetition.js:90`) — the 38-file grep trap, re-confirmed.

The reader-side contract is already authored and bound: DS-FTH-3/DS-FTH-4 name `templeWealth` verbatim
and ODQ §333.2 made the corpus binding spelling law, with `ENDOWED` kept and marked not-drawable until
WF-7 lands (a recorded deferral, not a gap).

### WF-8 — narration ×3 — **PART-BUILT (8a), blocked on a chair act** (8–12 C, unchanged band)

*Landed:* `47ea9c9ba` WF-8A, the settlement obituary. `faithNews.js:118-126 FAITH_KIND_REGISTRY` holds
**exactly one kind**, `faith_last_altar_dark`; `FAITH_NEWS_TUNING = { LAST_ALTAR_SEVERITY: 0.5 }` at
`:140` (the chair's §350 R-3 signature), consumed `:226`; `faithReceipt` at `:209` is imported by one
module, `religiousContest.js:63`, and minted at `:855`. CONFIRMED.

*It is DARK BY INHERITANCE, and I traced the gate:* the mint loop at `religiousContest.js:853` sits
inside `if (unseating) {` at `:819`, where `unseating` is WF-1's strict flag read at `:692`.
`faithNarrationEnabled` has **zero hits in src** — WF-8's own flag was never minted (§350 ratified
"inherited darkness"). CONFIRMED. **A flag-name census therefore scores WF-8 UNBUILT and is wrong.**

*Two things the pricing must carry:*
- ⛔ **A NAMED, UNPAID OBLIGATION, written in the code itself**: `faithNews.js:99-107` — *"THIS IS THE
  ESTATE'S SECOND ONE-ROW FAMILY, AND THAT IS A REVIEWED ACT … the SHRINK-BACK IS A RECORDED OBLIGATION
  of the next WF-8 member that takes this family to five rows or more."* CONFIRMED.
- ⛔ **An UNRULED chair question blocks pricing the remainder**: volume Q1 (four realm arcs or five)
  was left open at §78.3 "for the WF family sitting" and never ruled. The re-scope premise still holds
  at the consist: `realmEvents.js:25` `COMPOUND_SIGNATURES` is still exactly five keys —
  `gods_abandonment` `:27` · `the_wasting` `:38` · `starving_city` `:48` · `calling_of_debts` `:58` ·
  `shadow_court` `:68` — **none a schism**. CONFIRMED.
- *And the census baseline is live:* the Herald faith desk is already **18 exact rows + 3 deity-tier
  keys** deep (`heraldRouting.js:140-159`) and **only `faith_last_altar_dark` `:158` is WF's**;
  `sovereignty_sale_judged` `:152` is WR-10's. R6's "re-baseline at your own commit, never inherit 9"
  is the operative instruction, and the census must not double-count war-minted faith-desk kinds.

### WF-9 — convergence instrumentation — **UNBUILT** (5–9 C, unchanged)

`ls src/domain/certification/*onvergence*` returns `tradeConvergenceContract.js`,
`warConvergenceContract.js`, `warConvergenceForces.js` — **no faith contract**. CONFIRMED. The war
contract remains the template.

---

## §C — THE NON-WAVE ROW: W-FAITH (a reconciliation, not a wave)

A second faith programme (ODQ §797/§798, cars F1c–F7c, 2026-08-30 → 09-01) landed ~nine modules that
no WF row prices and no recon pass names. I re-opened each claim:

| Mechanism | Status | Evidence at `315080928` |
|---|---|---|
| The influence field kernel | **LANDED-UNFLAGGED** | `faithField.js` (`faithFieldProjection`); imported `religionState.js:43`, called `:669` inside `projectReligionStateOntoSettlement` (`:614`), which the pulse calls at `pulseKernel.js:1806` under **no flag** — only `if (nextReligionStates)` |
| Six boon/bane channels on causal variables | **LANDED-UNFLAGGED** | `faithChannelBindings.js:81-88` (harvest→food_security, trade→trade_connectivity, craft→economic_capacity, healing→healing_capacity, order→law_order, war_readiness→defense_readiness); `causalState.js:78` imports, `:156 applyFaithChannel`, called at `:561 :771 :828 :988 :1025 :1074`; `CAUSAL_SWING = 20` |
| Its door is a string no gate reads | **CONFIRMED** | `faithTuningSurface.js:175 FAITH_FIELD_DOOR = 'faithFieldEnabled'`; **three `faithFieldEnabled` hits in all of src**, all comment/constant (`faithField.js:23`, `faithTuningSurface.js:168`, `:175`) |
| Dormancy is a DATA fact, not an engine fact | **CONFIRMED** | `causalState.js:132` "DORMANT BY ABSENCE, which is stronger than dormant by flag"; `faithFieldProjection` returns `null` unless a channel total is non-zero; `customContentManifest.generated.js:1623-1627` `boonChannel` `ui:false`, `effect:"mechanical"` |
| The tuning surface is LIT on UNSIGNED numbers | **CONFIRMED** | `faithTuningSurface.js:125 FAITH_TUNING_SIGNATURE = { signed: false, live: true }` |
| The authored temper reaches the engine | **LANDED-UNFLAGGED** | `deityCommitEmbed.js:54-61 DEITY_AUTHORED_CHARACTER_KEYS` (incl. `'authoredTemper'`), picker `:86`; `deitySnapshot.js:29/:66` spreads it into the embed; walker `tests/domain/deityTemperConsumerCensus.walker.test.js` records *"the ten embed consumers now hear an authored word"* |
| The witness-plane adapter | **LANDED-INERT** | `faithWitnessSource.js` has **zero importers** in src (every hit is a comment) |
| The flaw register | **LANDED**, rides the field | `deityFlaws.js:59` consumers line; only the jealous arm is reachable (the wrathful arm rides the inert adapter) |
| The FaithTab deepening model | **LANDED** (display) | `display/faithDeepening.js`, consumed by `components/settlement/faithPanelModel.js` |

**Why it matters to WF:** two of these are **unflagged live producers** on production paths whose
dormancy is a content fact. Any WF compile that touches deity reads, `config.faithProfile`, the faith
tab or the tuning surface must read W-FAITH first, or it will re-price a quantity that already has a
live arm. That is WF-3's car 0 and a declaration line in WF-7's and WF-8's charters.

---

## §D — MANDATORY CAR 0s, JOIN CARS, RECORD≠CODE

### D.1 MANDATORY CAR 0 (five; each is a live producer or a dead/stale record, none is polish)

| # | Wave | The car 0 | Why it is car 0 |
|---|---|---|---|
| **C0-1** | **family-wide, before any WF brief** | **Carry the landings into the volumes.** `DESIGN_FP_ARCH_WF.md:406-412` still writes `patronFall.js` as a leaf to build; `DESIGN_FP_FAITH.md:10` still says *"Status: ARCHITECTURE. Nothing here is scheduled"*. Neither volume contains `66fda66d`, "WF-1a LANDED" or "WF-8A". | The volumes are the only design surface a WF lane reads. A lane briefed off them **rebuilds a landed wave**. This is WF's analogue of TRADE's §96.2 — not a ruling stop, a record stop. |
| **C0-2** | **WF-3** | **Reconcile with three live deity→world producers** (`disposition.js:195/:208/:281`, `dispositionProfile.js:168` under §851's one-arm rule, and W-FAITH's unflagged channel lift) and inherit `faithField.js:30-38`'s no-temper-channel law. | Three live arms already price what WF-3 proposes to price. Without this the wave double-counts at a second grain — the TRADE famine-block shape, three times over. |
| **C0-3** | **WF-6** | **Rule the `temple_restitution` semantics and the war door before writing an executor.** The term already executes as a conserved grain levy through `peaceTerms.js:721-735`; and no faith row is in `CLASS_TERM` although `peaceTermsCatalog.js:238-239` says a war's end can extract one. | A live executor the wave does not own, plus a false sentence in the wave's own catalog. Writing an executor first re-prices a firing clause. |
| **C0-4** | **WF-8** | **A CHAIR ACT: rule volume Q1 (four realm arcs or five).** Never ruled (§78.3 left it open; §308/§309/§313–§352/§400 are silent). The re-scope premise holds — `realmEvents.js:25-68` is five non-faith signatures. | WF-8's realm-arc battery is **unpriceable** until it is ruled; the band 8–12 C assumes an arc count nobody has signed. |
| **C0-5** | **WF-8** | **Pay the chartered registry shrink-back review** (`faithNews.js:99-107`, ODQ §350 R-1) as the first act of the next member. | A named, unpaid obligation written into the code, inherited whether or not the lane reads this file. |

Two further **declarations** (not car 0s, but charter lines): WF-5a must declare W-K's inert
`institutionStatusLifecycle`; WF-1 must declare that lighting buys nothing in a deity-free world.

### D.2 JOIN CARS (a frozen ground truth) — **NONE OWED**

The TRADE pilot's TR-3 join car exists because believed scarcity tracks `foodRatio`, which only
generators write. **WF is the opposite case, and I verified it end to end:** `devotionGroundTruth`
(`beliefAxisSubjects.js:356-372`) reads only `religionStates[cid].{deities[].share, .standing,
.suppressed, patronRef}`; `advanceReligionStates` rewrites those every tick from `pulseKernel.js:1261`;
`standingOf` recomputes with hysteresis. **No join car is owed anywhere in WF.** CONFIRMED.

⚠ **But there is a DATA car, and it is the family's real ceiling.** Every faith mechanism in the
estate — lit, dark, unflagged or inert — sits behind an **outer data gate**:
`isSubsystemActive(snapshot, 'religion')` is deity **PRESENCE**, not a flag
(`religiousContest.js:536-542`), and the release corpus is **deity-free** (`subsystemRowsBaseline.js:60`,
measured 2026-07-31, still standing at the consist). WF-0's soak case **is** that car. Until it is paid,
lighting any WF flag moves nothing in a shipped world, and every "lit" acceptance is vacuous. This
should be stated once at the head of the family's lane order, not discovered at WF-8's soak.

### D.3 RECORD ≠ CODE (nine rows; each opened at the consist)

| R | The record says | The consist says | Consequence |
|---|---|---|---|
| **R1** | `DESIGN_FP_ARCH_WF.md:406-412` writes `patronFall.js` as a leaf to build; `DESIGN_FP_FAITH.md:10` "Status: ARCHITECTURE. Nothing here is scheduled" | WF-1 landed as six ancestors 08-16 → 08-21 and WF-8A on 08-22; `patronFall.js` is a 167-line mounted leaf | **C0-1.** The structural risk of the whole family |
| **R2** | `DEFERRAL_SWEEP_LAUNCH_PATH.md` row 1 + ODQ §925.5(1) (2026-09-14): the DEITY DOCTRINE is violated because *"the live tree still ships the governed core pool and bakes it into every seed"* — the sweep's ONLY row contradicting a ratified law, parked on the owner's desk in T4 ONE-REGEN | `src/generators/data/deityPool.js` — **no such file**. `src/generators/steps/seedStartingPantheon.js` — **no such file**. Deleted by `5f8dc7830` (2026-07-28, ancestor). Guarded by `tests/lint/noPremadeDeityPool.walker.test.js` (four scans: no pool module, no `deity:core:` mint, no step registration, …). `latentPantheon.js:8` records the removal in-code | **Retire the row and the T4 entry, or re-price T4 without it.** The owner is holding a cured violation |
| **R3** | `faithField.js:12-22` ⭐ *"THE FIELD IS DARK. Nothing in production calls it"* | `religionState.js:43` imports `faithFieldProjection`; `:669` calls it; reached at `pulseKernel.js:1806`. The **fence** was correctly amended; the **header** was not | A stale darkness claim on a mounted leaf. One-comment repair, but it will mislead the next reader — and it did mislead a recon pass |
| **R4** | `deityAxes.js:35-42`: *"`deitySnapshotFrom` … does not carry `authoredTemper`, so every consumer that reads an EMBED — the whole engine — still derives"* | `deitySnapshot.js:66` spreads `authoredCharacterEmbedKeys(raw)`; `deityCommitEmbed.js:55` lists `'authoredTemper'`; the census walker records *"the ten embed consumers now hear an authored word"* | Two in-code records contradict; the walker is right. WF-3's "the one place faith reads authored truth" premise is already half-spent |
| **R5** | FVQ J-GR-2-3: *"faith_communion … `PACT_DRAFT_LENS` rows are EMPTY"*; FVQ GR-3 landing: *"the nine faith/population/security rows have no producer"*; FVQ L4096: WF-6 *"blocked on #11 GR-3"* | `pactFormation.js:174-179` carries the full four-rung ladder over all five faith terms; `peaceTermsCatalog.js:228-245` carries the rows | **Both blockers are dead.** The FVQ is the only place a reader is told the faith terms are producer-less, and it is false. WF-6's brief must be written off the code |
| **R6** | FVQ J-LEG-WIRE-11: *"`pantheon_ascendancy` is still registered, still authored, still unwired"* | `realmEvents.js:338` mints `impactKind: 'pantheon_ascendancy'` (and `:361` twilight, `:315` extinction) | Superseded inside the same document by wiring slice 4, but the earlier row reads as current |
| **R7** | `peaceTermsCatalog.js:238-239` — `missionary_access` is *"the row a war's end can EXTRACT"* | `CLASS_TERM` (`:385-394`) names nine asset classes and **no faith term**; the only producers are `CLASS_TERM` (war) and `PACT_DRAFT_LENS` (peacetime) | An in-code false sentence. **C0-3**: either add the war door or strike the sentence |
| **R8** | `PROGRAMME-32-34.md` §B: WF-1 *"BUILT — code wins"* | Built whole, **dark in every preset** (11 src hits, zero `: true` in `simulationRules.js`, lit only in five test files), and behind the deity-presence data gate on top | The count row must read LANDED-DARK, and WF-1 needs a PRICING row it does not have |
| **R9** | The volume's §1 census (2026-08-04) V10 "temper derived-only"; §2 "Nothing in this program lights a flag, runs a soak, or ratifies a band" | V10 is now a two-arm read (R4); §2 sits beside an unflagged live producer (§C) and a tuning surface at `{ signed: false, live: true }` | The substrate census predates W-FAITH by four weeks. ⚠ **Correction to the older reader:** its third sub-claim (§3's "zero new top-level keys") is NOT violated — `faithProfile.field` is a `settlement.config` key, not a `worldState.*` top-level key |

---

## §E — THE LIGHTING CENSUS, EXECUTED BY ME

`grep -c '<flag>' src/**/*.js` and `grep -n '<flag>: true' src/domain/worldPulse/simulationRules.js`:

| Flag | src hits | Lit in a preset |
|---|---|---|
| `faithSpreadEnabled` | 42 | ✅ `:811`, `:875` (dramatic_campaign, full_simulation) |
| `religionDynamicsEnabled` (lockstep legacy mirror) | 27 | ✅ `:817`, `:876` |
| `traditionsEnabled` | 20 | ✅ `:674` |
| `faithUnseatingEnabled` (WF-1) | 11 | ❌ none — lit only in five test files |
| `beliefAxesEnabled` | 23 | ❌ |
| `believedDevotionEnabled` | 6 | ❌ |
| `pactFormationEnabled` | 20 | ❌ |
| `errandSpineEnabled` | 29 | ❌ |
| `magicEconomyEnabled` | 23 | ❌ |
| `faithFieldEnabled` | **3** (all comment/constant — no gate) | ❌ (no gate exists) |
| `pilgrimageEnabled` · `faithStanceConsequencesEnabled` · `omenReadsEnabled` · `faithSchismEnabled` · `faithTermsEnabled` · `titheEnabled` · `faithNarrationEnabled` | **0 each** | ❌ never minted |

⛔ And above all of it: `isSubsystemActive(snapshot, 'religion')` — deity **presence** — with a
**deity-free release corpus** (§D.2).

---

## §F — GREP TRAPS CONFIRMED (three of them new to this seat)

1. ⭐ **NEW — `schism` in src has THREE non-faith senses.** M9a's **COUNCIL** schism is the loudest:
   `beliefMap.js:1450 detectCouncilSchism`, mounted at `pulseKernel.js:681` — a faction-dissent
   mechanism, nothing to do with creeds. Plus `conditionPromotion.js:60`'s regex and
   `factionRelationshipUpdate.js:692`'s prose. The faith schism is the **settlement patron contest**
   (`religionState.js:532`). CONFIRMED by me.
2. ⭐ **NEW — `feat(WF` is the only clean door to the family's landings.** `git log --all --grep='feat(WF'`
   returns exactly seven commits (WF-1a/b/C/d/E/F + WF-8A); a `-E --grep='WF-[0-9]'` sweep returns
   dozens of unrelated subjects because the pattern matches bodies. CONFIRMED by me.
3. ⭐ **NEW — SP-4's posture read is NOT spelled `riskToleranceOf`.** A WF brief pre-pinning the
   collision is pre-pinning a cured hazard: `strategicPosture.js:9-18` records the collision and
   `:303` spells the read `courtRiskAppetiteOf`. CONFIRMED by me.
4. **`omen` matches `moment`.** `git log --all -i --grep=omen` = **373** commits; word-boundary
   `omen` = **3**, none of them faith (two are the V-16 auspice vision folds, one a prose batch).
   `omenReading` = 0 commits, 0 src hits. CONFIRMED by me.
5. **`tithe` (38 files) is the granary reserve** (`foodStockpile.js:12-22`) and the faction prize token
   `tithe_rights` (`factionCompetition.js:90`) — never WF-7. CONFIRMED by me.
6. **`pilgrim` is TRADITIONS + the peace term + the reserved errand row**, never WF-2a's leaf
   (`pilgrimSeason.js` does not exist). CONFIRMED by me.
7. **`faithNarrationEnabled` = 0 src hits** ⇒ a flag-name census scores WF-8 UNBUILT and is wrong
   (§350 ratified WF-8A landing with no flag, "inherited darkness"). CONFIRMED by me.
8. **`W-F<n>` (Phase 4, July) ≠ `W-FAITH F<n>c` (August) ≠ `WF-<n>` (the FP volume)** — three
   programmes, three numbering schemes, one three-letter stem. CONFIRMED (the ledger reader's trap,
   re-derived by the `feat(WF` count above).
9. `divination` is the Herald's forecast desk (`heraldRouting.js:64`), not WF-4's omens; `covert`
   across worldPulse is espionage/brokerage vocabulary; `patronCounterforce.js` /
   `brokeragePatronage.js` patrons are relationship-graph and news-house patrons, not religious
   (readers' traps, consistent with everything I read — carried).

---

## §G — THE COUNT AND THE CAR RE-CUT

### G.1 Count

| Source | built | part | unbuilt | dark |
|---|---|---|---|---|
| PROGRAMME §B | 1 (WF-1) | 1 (WF-8) | 8 | — |
| RECHECK §1 (WF-6 upgraded) | 1 | 2 | 7 | — |
| **This adjudication** | **0 built-and-lit** | **2** (WF-6, WF-8) | **7** (WF-0, 2, 3, 4, 5, 7, 9) | **1 LANDED-DARK-WHOLE** (WF-1) |

No wave moves UP to BUILT; WF-1 moves sideways from "BUILT" to "landed whole and dark"; nothing moves
down. Ten wave-units, reconciled.

### G.2 Cars (PLAUSIBLE arithmetic; every input a CONFIRMED receipt above)

| Wave | PRICING §B | Corrected | Why |
|---|---|---|---|
| WF-0 | 2–3 | **2–3** | unchanged; it is the family's DATA car — say so in the lane order |
| **WF-1** | **no row** | **1–2** | ⭐ NEW ROW: the lighting/declaration car under the 09-15 built-lit directive (deity-bearing own-footprint golden captured first; declare that a deity-free world moves nothing) |
| WF-2 | 7–10 | **7–10** | unchanged; the belief leg is de-risked (no join car) and the draw is live — the wave is a gate over both |
| WF-3 | 3–5 | **4–6** | **+1: car 0** — reconcile the three live deity→world producers and inherit the no-double-count law |
| WF-4 | 5–8 | **5–8** | unchanged |
| WF-5 | 8–12 | **8–12** | unchanged; two declarations (the inert W-K lifecycle; the landed prune key) fold into the charter car |
| WF-6 | 4–7 | **5–8** | **+1: the ruling car** (temple-restitution semantics + the war door). The executor car narrows — one of five terms already executes — but not below the band |
| WF-7 | 5–8 | **5–8** | unchanged; +1 declaration line for W-FAITH's surfaces, at zero cost |
| WF-8 | 8–12 | **8–12** | unchanged band, **but unpriceable until Q1 is ruled**, and the registry shrink-back review is a named unpaid obligation inside it |
| WF-9 | 5–9 | **5–9** | unchanged |
| **WF total** | **47–74** | **50–79, centre ≈ 64** | **+3–5 cars, ≈ +7 %** — the same order as the TRADE pilot's +10 % |

Lighting is not added per wave elsewhere: PRICING §D routes every #32 flag through the single declared
lighting window. WF-1's row is the exception because the wave is **already landed** and therefore
already inside the built-lit directive's scope, with no row to carry it.

### G.3 What a WF lane must be handed, in order

1. **C0-1** the volume repair (or every brief is written against a corpse).
2. **WF-0** — the deity-bearing soak case: it is the family's data precondition, not an instrument
   nicety.
3. **C0-4** the chair act on Q1, then **C0-5** the WF-8 shrink-back review.
4. **WF-6** (most built; needs **C0-3** first and serialises after TR-5 on `peaceTerms.js`).
5. **WF-1's lighting car**, then WF-3 (after **C0-2**), then the rest by family in PRICING's order.
