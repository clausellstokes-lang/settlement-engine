# SKEPTIC — WF (FAITH), waves WF-0 … WF-9 — 2026-09-15

**Seat:** the skeptic for the WF family in the #32–#34 history pass. My job is to re-derive every
verdict myself from code, attack each BUILT/PART-BUILT for reachability, search each UNBUILT two
further ways by its FICTION, verify every sha the adjudicator cites, and default to the more
conservative status when uncertain.

**Base, re-verified by me:**
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneCONSIST-932`,
HEAD `3150809288ba864527bacbca0b861bec0d139eff` — *"LT37 car 6: pdf.7's structural half…"*, 2026-09-15
(`git log -1`, executed by me). Read-only throughout; no suite run, no git mutated, nothing written
outside this directory.

**Inputs read:** `adjudicator.md` whole (521 lines), `ledger.md` §B.3/§C/§F, `older.md` §1/§3/§5,
the TRADE pilot fold's §A.1/§A.3/§A.4 + the grep-trap paragraph + §C whole,
`DESIGN_FP_ARCH_WF.md` §1/§2/§3/§4 (the ledger's 846-line cured copy).

**Labels:** **CONFIRMED** = I executed the grep/read/`git log` and quote it with `path:line`.
**PLAUSIBLE** = my derivation or arithmetic over CONFIRMED inputs.

---

## §A — THE VERDICT, AND WHERE I BREAK WITH THE ADJUDICATOR

I confirm the adjudicator's **shape** and its **count**, and I falsify its single most load-bearing
positive claim. Three programmes built faith machinery under three names; exactly one WF wave landed
under the WF name (`git log --all --grep='feat(WF'` returns **exactly seven** commits — WF-1a/b/C/d/E/F
and WF-8A — every one verified by me with `git log -1` and `git merge-base --is-ancestor`, CONFIRMED);
and I corroborate that with an independent receipt neither reader nor the adjudicator cites:
`docs/implementation/packets/fp/` holds **exactly seven WF packets** — `WF-1A…WF-1F` and `WF-8A` — and
no packet for any other WF wave (CONFIRMED by `ls`). The count stands at **0 built-and-lit /
1 LANDED-DARK-WHOLE (WF-1) / 2 PART-BUILT (WF-6, WF-8) / 7 UNBUILT**.

**But the adjudicator's ⭐⭐ WF-6 finding is false at the consist.** It writes: *"`temple_restitution`
ALREADY EXECUTES … A signed temple restitution moves stock today with no WF-6 executor"*, and prices
WF-6's executor car *down* on that basis. It cannot. The only producer of any faith term is
`PACT_DRAFT_LENS.faith_communion`, and the crossing that feeds it — `scoreFaithCommunion` — **returns
`NO_CROSSING` unconditionally, in every world, lit or dark**, because its self-side input is a dead
read: `pactFormation.js:217` calls `devotionGroundTruth(row.religionState)` on a **settlement record**,
and **no settlement record in this repository carries a `religionState` key** (the projection writes
`config.faithProfile` instead, `religionState.js:614-676`). No faith term can be drafted; no faith term
can therefore stream; `temple_restitution` has never moved a grain and cannot. WF-6 stays PART-BUILT
(the five catalog rows, the crossing and the ladder are real, landed code) but its landed half is
**LANDED-INERT, not LANDED-DARK**, and that is a downgrade, not polish.

A second, independent reachability failure sits behind the same lens even once the wiring is repaired:
the communion score is **three-valued**, and two of the five faith rows can never be selected. Details
in §B/WF-6. Net effect on the family: the cars move from the adjudicator's **50–79** to **51–79,
centre ≈ 65** — its band, with a raised floor — and one of its five mandatory car 0s (C0-3) changes
content from *"rule the semantics of a term that already executes"* to *"repair the crossing that
cannot fire, then rule the semantics"*.

### A.1 My corrections to the adjudicator (eight)

| # | Adjudicator says | I find | Label |
|---|---|---|---|
| **S1** | WF-6 ⭐⭐ *"`temple_restitution` ALREADY EXECUTES … moves real conserved grain today"*; *"`PACT_DRAFT_LENS` … drafts **all five** rows"* | Neither holds. The self-side devotion read is dead (`pactFormation.js:217` ← a key with **zero writers repo-wide**), so `scoreFaithCommunion` always takes its `mine < 0` NO_CROSSING arm. Zero faith terms are draftable; the stream loop is never reached by one. | **CONFIRMED** |
| **S2** | R7: `missionary_access` is *"the row a war's end can EXTRACT"* but no faith row is in `CLASS_TERM` — *"an in-code false sentence"* | Worse than a false sentence. With the peacetime door arithmetically closed to it too (§B/WF-6), `missionary_access` has **zero reachable producers in either door** — as does `shared_rite`. Two of the five rows are structurally unproducible. | **CONFIRMED** |
| **S3** | WF-3 car 0 reconciles **three** live deity→world producers | At least **five**. Add (4) `moralInstitutionPressure.js` — the patron seat's alignment axes × piety **abolish and found institutions**, mounted at `pulseKernel.js:114` (`evaluateMoralInstitutionPressure`, `evaluateMoralInstitutionFounding`), faith-gated by patron presence, not by any WF flag; and (5) `applyDivineMandate` (`pulseKernel.js:1807`) folding patron security into `publicLegitimacy`. (4) is also WF-5a's fiction. | **CONFIRMED** |
| **S4** | *"The corpus shrink-back was executed (`3a2db1110`, ancestor)"* | Half executed. `3a2db1110` (verified by me: *"TE-RESIDUE car 1 (WF-8): the fifth fall cause leaves the corpus"*) removed `abandoned` from the **dossier state-prose** corpus only. The **machine-read Herald annex** still carries it: `docs/content/RECEIPT_POOLS_FAITH.md:174` — `### faith.fall.abandoned (WF-1)`, seven variants — and that file is read by `tests/lint/faithKindPools.walker.test.js:80` (`ANNEX_URL`). ODQ §839 FLAG 2 records it as deliberately not actioned. **WF-8 carries TWO named unpaid obligations, not one.** | **CONFIRMED** |
| **S5** | `realmEvents.js:25-68` is *"five non-faith signatures"* | `gods_abandonment` **is** a faith signature: its `types` include `religious_conversion_fracture` (`realmEvents.js:30`) and its whole summary is a faith crisis — *"Flagellants walk the streets, scapegoats are named from pulpits, and prophets nobody ordained gather the desperate"* (`:31`), and it routes to the faith desk (`realm/heraldRouting.js:147 compound_gods_abandonment: 'faith'`). The correct claim is **"none a SCHISM"**. Q1's re-scope premise needs a second clause: WF-8's Persecution and Awakening arcs overlap this arc's shipped prose. | **CONFIRMED** |
| **S6** | WF-8 PART-BUILT via WF-8A (settlement obituary) only | The **realm** tier of faith narration is already partly live and **ungated by any flag**: `realmEvents.js:338 pantheon_ascendancy` and `:361 pantheon_twilight` mint on ordinary tier changes; only `:315 pantheon_extinction` is WF-1C's, gated on `unseating` (`pantheon.js:466-470`). WF-8's realm battery must reconcile with two live realm beats, not write onto an empty desk. | **CONFIRMED** |
| **S7** | WF-1's `suppressedAtTick` — *"the one writer … `religionState.js:239` (header), write at `:277`"* | True, and it **contradicts the volume's own WF-1 spec**, which demands a stamp at three write sites with a scanned-equals-stamped census pin (`DESIGN_FP_ARCH_WF.md` §4/WF-1). WF-1b instead **extracted** the three inline writes into one unexported `suppressDeity` (`religionState.js:274-280`, header `:239-268`: *"Three call sites suppress a creed … and every one of them routes here"*). Repo-wide there is exactly one `suppressed: true` write on a deity record. This is a **second** way the volume's WF-1 section is stale — it strengthens C0-1. | **CONFIRMED** |
| **S8** | Line addresses | Three of the adjudicator's citations have rotted (substance intact, navigate by symbol): `whole-world-soak.mjs:131` → the deity-free `customContent: {}` calls are at **`:248` and `:713`**; `heraldRouting.js` is at **`src/domain/realm/heraldRouting.js`**, not `worldPulse/`; the `suppressed: true` literal is at **`:276`**, the stamp at `:277`. | **CONFIRMED** |

### A.2 Where I back the adjudicator against a reader, or add to it

- Its correction of the older reader's summary arithmetic (its table governs: 1 dark / 2 part /
  7 unbuilt) — I re-derived every row and reach the same table. **CONFIRMED.**
- Its correction that `faithProfile.field` is a `settlement.config` key and so does **not** breach
  §3's "zero new `worldState.*` top-level keys" — I read `religionState.js:669-676` and agree.
  **CONFIRMED.**
- Its correction that SP-4's collision is already cured (`courtRiskAppetiteOf`, not
  `riskToleranceOf`) — I see `courtRiskAppetiteOf` imported and called at `pactFormation.js:110`
  and in `reserveFor` (`:360`). **CONFIRMED.**
- **No join car is owed.** I traced it end to end myself: `devotionGroundTruth`
  (`beliefAxisSubjects.js:356-372`) reads only `religionStates[cid].{deities[].share, .standing,
  .suppressed, patronRef}` through `STANDING_RUNG` (`:186`) and `DEVOTION_BANDS` (`:115`); those are
  rewritten every tick by `advanceReligionStates` (`pulseKernel.js:1261`). Nothing generator-frozen is
  in the path. The opposite of TR-3. **CONFIRMED.** (⚠ but see the DATA car — and note the irony that
  the one live ground truth in the family is read through a dead pointer, S1.)
- **The DATA car is real and I re-measured it rather than inheriting the 2026-07-31 comment.** The
  outer gate is `isSubsystemActive(snapshot, 'religion')` — deity **presence** — short-circuiting the
  whole module at `religiousContest.js:547`. Deity presence requires `config.primaryDeitySnapshot`,
  whose only production writer is the DM/mutation embed bridge `applyWorldPulse.js:242`; the soak
  fixture generates with `customContent: {}` (`scripts/audit/whole-world-soak.mjs:248`, `:713`); and
  the premade pool is **deleted** (below). A generated world is deity-free unless the player authors
  deities or the DM assigns one. **CONFIRMED by execution, not by the comment.**

---

## §B — WAVE BY WAVE, RE-DERIVED

### WF-0 — the observation floor — **UNBUILT** (2–3 C)

Nothing of it exists. `deityBearers` is a **private, unexported** helper inside
`religiousContest.js:265`, used once at `:591` — not a receipt field (CONFIRMED by grep: those are the
only two hits in `src/`, `tests/` and `scripts/`). The certification row still carries the honest
UNOBSERVED verdict and names the exact case owed (`subsystemRowsBaseline.js:60`). **CONFIRMED.**

*Second instrument, found by me, that says the same thing independently:*
`subsystemRowsGrowth.js:91` — *"the abolition lane skips any settlement carrying neither a patron nor
a reaching foreign faith … the founding lane returns early on a patron-less settlement … institution_founding
is ZERO in every case and every year. That zero is an ABSENT PRECONDITION and not a defect: the soak
fixture carries no deities."* Two independent certification rows are blocked on the same missing
fixture. **This strengthens the adjudicator's "WF-0 is the family's DATA car, say it in the lane
order" to "two subsystem families are waiting on one soak case".** CONFIRMED.

### WF-1 — the unseating — **LANDED-DARK, WHOLE** (1–2 C, unpriced in PRICING §B)

I re-opened every leaf. All present and mounted (all CONFIRMED by me):
`patronFall.js` is 167 lines; `PATRON_FALL_CAUSES` frozen at **four** at `:76`
(`['discredited','displaced','imposed','suppressed']`); `FALL_RING_CAP = 3` at `:83`;
`classifyPatronFall` `:102`; `recordPatronFall` `:138` refusing out-of-vocabulary causes at `:141`;
`fallCauseFor` `:160`. Two production importers and no more: `religiousContest.js:58`,
`warTermination.js:91`. The mint is at `religiousContest.js:908-912` under the strict flag read at
`:692`. The prune fork and the dormancy key are at `religionState.js:436`. The realm beat is
`realmEvents.js:305-316`, reachable only when `lastSeat` is set, which `advancePantheon`
(`pantheon.js:466-470`) computes **only** when `unseating === true`. The war join is
`warTermination.js:538`.

**Dark, and I re-ran the census myself.** `faithUnseatingEnabled` has **11 hits in `src/`** and
**zero `: true` in any preset** — its only `simulationRules.js` appearance is the manifest row at
`:295`. It is lit in nine non-src files, all tests and docs. **CONFIRMED.** On top of the flag sits
the deity-presence data gate, stated in the code itself at `religiousContest.js:689-691`.

*The reachability attack, and it passes:* the wave's behaviour is a real production path (kernel →
`advanceReligionStates` → classify → ring → panel/war-receipt readers), not a dark leaf; it is the
wave's own behaviour, not substrate; and its ground truth is live. The only thing standing between it
and running is a flag and a deity. **Status confirmed.**

### WF-2 — pilgrims + legates — **UNBUILT** (7–10 C)

All three of the wave's own leaves are absent (`pilgrimSeason.js`, `legateErrand.js`,
`pilgrimErrand.js` — `find src -name '*ilgrim*'` returns exactly one file, `src/domain/traditions/pilgrimage.js`;
CONFIRMED). Substrate is strong and I verified each half:
- SP-1's two rows are reserved **in code** at exact paths with `built: false`
  (`envoyErrandVocabulary.js:322-335`: `legates → legateErrand.js, purposeClass 'religious', wave 'WF-2b'`;
  `pilgrims → pilgrimErrand.js, purposeClass 'personal', wave 'WF-2b'`). CONFIRMED.
- The draw is **LIT under TRADITIONS' name**: `pilgrimageDraw` imported `worldPulse/traditionsKernel.js:79`,
  called `:726`; `traditionsEnabled: true` at `simulationRules.js:674` (a default, not a preset opt-in).
  And it is **deity-blind** — `grep 'deity|patron|faith|religio' src/domain/traditions/pilgrimage.js`
  returns **zero hits**. So WF-2a is a co-location gate + season over a live, faith-agnostic draw.
  CONFIRMED.

*Fiction search, two further ways:* (i) "people travel to a holy place" — the only mover is the
traditions draw above; `ERRAND_CONSUMERS` has no religious consumer built. (ii) "a legate carries a
creed's business abroad" — `ENVOY_PURPOSES` is still closed at war's two, and the class layer
(`purposeClass`) is the lawful join, exactly as the volume's discharged precondition says. Nothing
hidden. **UNBUILT confirmed.**

### WF-3 — stance consequences — **UNBUILT + a MANDATORY CAR 0 over FIVE producers** (4–6 C)

The premise holds exactly: `deityStance.js:160-173` computes `aggression` and `treatyDurability` and
still carries the verbatim deferral comment; `treatyDurability` has **no reader in `src/` outside its
own file** (CONFIRMED by repo grep — four hits, all in `deityStance.js`). `deityStanceLane.js` consumes
only `betrayalHazard` (`:86`) and `cooperation` (`:379`). **CONFIRMED.**

*The live couplings the wave must reconcile with — five, not three (all CONFIRMED by me):*
1. `disposition.js:195 W_DEITY = 0.35` → `:208 deityTemperDrive` × `:281 pietyLocalMultOf` summed into
   the drive at `:283`; plus `:469 W_LAW_DEITY = 0.3` at `:554`.
2. `dispositionProfile.js:168 deityPressureOf` (WR-2's domain pressure, one arm per deity).
3. W-FAITH's channel lift — `faithChannelBindings.js:81-88` → `causalState.js:156 applyFaithChannel`,
   called at `:561 :771 :828 :988 :1025 :1074`, on the production causal path with **no flag**.
4. ⭐ **`moralInstitutionPressure.js` — the adjudicator's miss.** Mounted at `pulseKernel.js:114`
   (`evaluateMoralInstitutionPressure`, `evaluateMoralInstitutionFounding`); imports `evil01/chaos01`
   from `deityAxes.js` and `pietyMoralBleedOf/pietyLawBleedOf` from `piety.js`; header: *"morally-loaded
   institutions are BUILT or TORN DOWN by who holds the patron seat"*. Faith-gated by patron presence.
   This is the single largest live deity→world coupling in the estate and **it is WF-5a's fiction as
   much as WF-3's** (`FOUNDING_INSTITUTIONS`, `foundingCatalog.js`).
5. `applyDivineMandate` (`religionState.js:762`, called `pulseKernel.js:1807`) → `publicLegitimacy`.

And the law it inherits stands verbatim: `faithField.js:30-38` — feeding the temper into a
`war_readiness` channel *"would be the DOUBLE-COUNT W-FAITH D1 forbids"*. **CONFIRMED.**

### WF-4 — omen reads — **UNBUILT** (5–8 C), with one new declaration owed

`omenReading`, `omenReadings`, `omenReadsEnabled` — **zero hits in `src/`** (CONFIRMED). No
`omenReading.js`. Nothing in the ledger.

*Fiction search, two further ways.* (i) "a calamity is read as a sign" — `portent|augur|auspice|prophec|foretell|\bomen\b`
over `src/domain` and `src/generators`: the mechanical hits are all prose pools
(`newsVoice.js:265/:295`, `causeConjunctionRole/arcane.js:224-239`) **except one**, and it is a real
product surface the adjudicator did not surface: ⭐ **`src/domain/worldPulse/auspice.js` — the V-16
AUSPICE, *"the omen, not the promise"*** — advances a throwaway clone of the realm, composes a
significance-tiered **omen** from the discarded forecast, and is rendered by
`components/auspice/AuspicePanel.jsx`, mounted **live** at `screen/DmScreen.jsx:107` behind `isDm`
only — **no simulation flag**. (CONFIRMED.) It is *not* WF-4 (no qualifying-calamity gate, no
deity-bearing precondition, no `spatialLedgers.omenReadings`, no clergy reader, no accuracy/fog), but
the product already ships an "omen" to the DM, and WF-4's charter owes a naming/voice reconciliation
or the estate will carry two unrelated omens. (ii) "the gods are judged to have withdrawn" —
`gods_abandonment` (S5), a live realm arc. **UNBUILT confirmed; +1 declaration line at ~0 cost.**

### WF-5 — schism + underground — **UNBUILT** (8–12 C)

`creedRef` — **zero hits in `src/`**. `covertCongregation` / `covertCreed` — **zero hits**. No covert
field on a religion state. **CONFIRMED.**

*Substrate re-verified:* the **settlement** schism has shipped since `0d01e1adc` (2026-06-27, verified
ancestor) as `resolvePatronContest`; WF-1 already classifies its outcome (`patronFall.js:113`
*"DISCREDITED — the schism / legitimacy-floor road: resolvePatronContest owned the seat"*). The
creed-agnostic institution backing that `creedRef` exists to fix is Phase 4's own design
(`religionLegitimacy.js:175-185` — `INSTITUTION_SCALE`, `INSTITUTION_SAT = 2.2`, `STANDING_BACKING`,
*"Creed-agnostic"*). **CONFIRMED.**

*New for the charter (mine):* the founding half of WF-5a's "reduced-ceremony founding call" is
**already live** — `moralInstitutionPressure`'s founding lane raises institutions from
`FOUNDING_INSTITUTIONS` under a patron's conviction on a years-scale integrator
(`FOUNDING_STEP: 0.015`, `FOUNDING_FLOOR: 0.6`, `FOUNDING_EMIT_P: 0.2`). WF-5a must fork that call,
not mint a second founding path. CONFIRMED.

### WF-6 — faith terms — **PART-BUILT, and its landed half is LANDED-INERT** (5–8 → **6–9 C**)

*What genuinely landed, under GRAMMAR's name (all CONFIRMED by me at source):* the five catalog rows,
whole family, priced and labelled — `peaceTermsCatalog.js:228 shared_rite` · `:231 pilgrimage_right` ·
`:236 tolerance_guarantee` · `:240 missionary_access` (`executor:'grant'`) · `:245 temple_restitution`
(`stream: true, executor: 'transfer'`), all `family: 'faith'`, labels `:416-420`; the crossing
`pactTriggers.js:226 scoreFaithCommunion`; the ladder `pactFormation.js:174-179`; and the four grant
readers `treatyEnforcement.js:270/:278/:285/:293` with **zero callers in `src/`** (only
`couplingRegistryGrammar.js:148/:186` strings and `tests/domain/peaceTermsGrantTerms.test.js`).

**⛔ DEFECT 1 — THE SELF-SIDE DEVOTION READ IS DEAD, AND IT MAKES THE WHOLE LANE INERT.**
`pactFormation.js:212-219`:
```
function selfBandsOf(settlement) {
  const row = recordOf(settlement);
  return {
    scarcity: recordOf(scarcityGroundTruth(row)),
    pull: text(recordOf(conditionsGroundTruth(row)).pullBand),
    devotion: text(devotionGroundTruth(row.religionState)),   // ← :217
  };
}
```
`scarcityGroundTruth` and `conditionsGroundTruth` take the settlement itself; `devotionGroundTruth`
takes a **religion state**, and `settlement.religionState` **has no writer anywhere in the
repository**. A repo-wide grep for `religionState:` as an object key (excluding `.git`,
`node_modules`, and JSDoc) returns exactly five hits: two test fixtures in
`tests/domain/faithWitnessSource.test.js`, one walker path map, and the two **belief-side** context
passes `beliefMap.js:503` / `beliefAxes.js:174`, which correctly hand over
`worldState.religionStates[subjectId]`. The pulse projects onto **`config.faithProfile`**
(`religionState.js:614-676`), never `settlement.religionState`. So `devotionGroundTruth(undefined)`
→ `{}` → `null` → `text(null)` → `''` → `rungOf(ladder, '') = -1` (`pactTriggers.js:147-150`) →
`mine < 0` → `NO_CROSSING('faith_communion', "One of these courts holds no belief about the other's
observance.")` (`:230-232`). **Every call. Every world. Lit or dark.** The believed side is wired
correctly, so the asymmetry is invisible to a reader who checks only that the ground truth is live.
**CONFIRMED.** Consequence: no faith term reaches `draftPactSheet`, no faith term reaches the stream
loop at `peaceTerms.js:721-735`, and the adjudicator's `temple_restitution` finding is void.

**⛔ DEFECT 2 — THE FOUR-RUNG LADDER HAS AT MOST TWO REACHABLE RUNGS, AND TWO ROWS ARE UNPRODUCIBLE.**
Independent of defect 1. `DEVOTION_BANDS` has exactly five members (`beliefAxisSubjects.js:115`), so
`top = 4`; `COMMUNION_RUNG_FLOOR = 2` and `COMMUNION_RUNG_SPREAD = 1` (`pactTriggers.js:80-81`); the
score is `(floor − 2 + 1) / (4 − 2 + 1)` (`:243`), i.e. **exactly {1/3, 2/3, 1}** for `floor ∈ {2,3,4}`.
`CROSSING_FLOOR01 = 0.5` (`:91`) filters the crossing at `pactFormation.js:265`, so only **2/3 and 1**
survive. `rungTermsFor` selects the **single highest** qualifying rung, not a cumulative union
(`pactFormation.js:285-296`, and the test pins the non-accumulation:
`tests/domain/pactFormation.test.js:435` — *"An accumulating ladder would give the top faith rung all
five faith terms"*). Therefore:

| attainable score | rung selected | terms drafted |
|---|---|---|
| 1/3 | — (below `CROSSING_FLOOR01`) | none |
| 2/3 | `min 0.45` | `pilgrimage_right`, `tolerance_guarantee` |
| 1 | `min 0.9` | `temple_restitution` |

**`shared_rite` (rung `min 0`) and `missionary_access` (rung `min 0.7`) can never be selected** — no
attainable score lies in `[0, 0.45)` or `[0.7, 0.9)`. And neither has a war door: `CLASS_TERM`
(`peaceTermsCatalog.js:385-394`) maps nine asset classes and **no faith term** (CONFIRMED), so the
catalog's own sentence at `:238-239` — `missionary_access` is *"the row a war's end can EXTRACT"* — is
false in both directions. **CONFIRMED** (arithmetic deterministic over quoted constants).

*Why this was never caught:* every ladder test feeds `draftPactSheet` a **synthetic** `score01`
(`pactFormation.test.js:416-421`: `0`, `0.44999`, `0.45`, `0.7`, `0.9`, `1`). No test composes
`scoreFaithCommunion`'s real output into the lens, and no test in `tests/domain/pactFormation.test.js`
or `pactTriggers.test.js` mentions `religionState` at all (CONFIRMED by grep). The two defects hide in
exactly the seam between two green unit suites.

*Status, conservatively:* **PART-BUILT** — the rows, the crossing and the ladder are landed code and
real work — but the landed half is **LANDED-INERT**, not dark, and the wave's charter must carry both
defects. Three dark flags (`pactFormationEnabled`, `beliefAxesEnabled`, `believedDevotionEnabled`) sit
above all of it (§C).

### WF-7 — the tithe — **UNBUILT** (5–8 C)

`templeWealth` has **no writer anywhere in `src/`** — the only hits are the dossier corpus
(`warFaith.generated.js:4604`, `:5574`) and two self-declaring comments
(`warFaithStateProse.js:96` ⛔ *"`templeWealth` HAS NO WRITER ANYWHERE IN THE ENGINE"*;
`dossierMounts.js:504-505`). `tithe.js` does not exist. **CONFIRMED.**

*Fiction search, two further ways.* (i) "the temple gets rich" — `endow|alms|offering|donation|temple
wealth/coffer/treasury` over `src/domain` and `src/generators`: every hit is prose, an NPC/faction
vulnerability string, a tradition **act** key (`customContentSchema.js:452 'offering'`), or the
granary reserve. No stock, no accrual, no draw. (ii) "temple richness has a mechanical effect" — it
**does**, and it is not wealth: `religionLegitimacy.js:92 W_INSTITUTION: 0.12` — *"max legitimacy a
temple-rich settlement lends the ESTABLISHED faith"* — computed as a saturated **count × scale**
(`:181-184`), explicitly *"Institutions carry no strength field (verified: they are presence records)"*.
So the estate already prices "a well-founded temple" as a count; WF-7's banded `templeWealth` must
declare against that or price the same fact twice. **UNBUILT confirmed; the declaration is new.**

### WF-8 — narration ×3 — **PART-BUILT (8A)**, blocked on a chair act (8–12 C)

Landed: `47ea9c9ba` (verified). `FAITH_KIND_REGISTRY` holds **exactly one** kind,
`faith_last_altar_dark` (`faithNews.js:118-124`); `FAITH_NEWS_TUNING = { LAST_ALTAR_SEVERITY: 0.5 }`
(`:140`); `faithReceipt` (`:209`) is imported by one module, `religiousContest.js:58`, and minted at
`:844-852` **inside `if (unseating)`** (`:819`) — dark by inheritance from WF-1's flag.
`faithNarrationEnabled` has **zero src hits**: a flag-name census scores this wave UNBUILT and is
wrong. **CONFIRMED.**

*What I add:*
- **Obligation 2 (S4):** the annex shrink-back is unpaid — `RECEIPT_POOLS_FAITH.md:174`
  `faith.fall.abandoned`, seven variants, for a cause `PATRON_FALL_CAUSES` structurally cannot emit.
  The annex is machine-read (`faithKindPools.walker.test.js:80`). Cheap, but named and inherited.
- **Q1's premise needs a second clause (S5/S6):** the realm tier is not empty. `pantheon_ascendancy`
  and `pantheon_twilight` mint today with **no flag**, and `gods_abandonment` is a live faith-desk
  compound arc whose prose already covers Persecution and a false-prophet Awakening.
- The desk baseline I re-read myself: `realm/heraldRouting.js:140-159` — 18 exact faith rows + 3 deity
  tier keys, of which exactly one (`faith_last_altar_dark`, `:158`) is WF's and one
  (`sovereignty_sale_judged`, `:152`) is WR-10's. R6's "re-baseline at your own commit" stands.
- The registry shrink-back obligation is verbatim in the code (`faithNews.js:99-107`). CONFIRMED.

### WF-9 — convergence instrumentation — **UNBUILT** (5–9 C)

`ls src/domain/certification/*onvergence*` → `tradeConvergenceContract.js`, `warConvergenceContract.js`,
`warConvergenceForces.js`. No faith contract. **CONFIRMED.**

---

## §C — THE LIGHTING CENSUS, RE-EXECUTED BY ME

`grep -rn '<flag>' src/ | wc -l` and `grep -n '<flag>: true' src/domain/worldPulse/simulationRules.js`:

| Flag | src hits | Lit |
|---|---|---|
| `faithSpreadEnabled` | 42 | ✅ `:811`, `:875` |
| `religionDynamicsEnabled` (legacy lockstep mirror) | 27 | ✅ `:817`, `:876` |
| `traditionsEnabled` | 20 | ✅ `:674` (a default) |
| `faithUnseatingEnabled` (WF-1) | 11 | ❌ |
| `beliefAxesEnabled` | 23 | ❌ |
| `believedDevotionEnabled` | 6 | ❌ |
| `pactFormationEnabled` | 20 | ❌ |
| `errandSpineEnabled` | 29 | ❌ |
| `magicEconomyEnabled` | 23 | ❌ |
| `faithFieldEnabled` | 3 (all comment/constant — no gate exists) | ❌ |
| `pilgrimageEnabled` · `faithStanceConsequencesEnabled` · `omenReadsEnabled` · `faithSchismEnabled` · `faithTermsEnabled` · `titheEnabled` · `faithNarrationEnabled` | **0 each** | ❌ never minted |

Byte-for-byte the adjudicator's §E. **CONFIRMED independently.** And above all of it the deity-presence
data gate with a deity-free release corpus (§A.2).

---

## §D — RECORD ≠ CODE (the adjudicator's nine, re-opened; two amended, one added)

| R | Verdict after my re-opening |
|---|---|
| **R1** volumes still write WF-1 as a leaf to build | **STANDS, and is worse.** `DESIGN_FP_ARCH_WF.md:406-412` writes `patronFall.js` as *"NEW leaf … budget ≤ 200 eff"*; the file is a landed 167-line mounted leaf. **Amended (S7):** the same section's `suppressedAtTick` clause ("stamp at EVERY suppression write site … three at the WF-F stamp: `:262/:277/:485`") is also stale — WF-1b **extracted** the three sites into one writer. A lane briefed off the volume would rebuild the wave *and* re-introduce three write sites the landing consolidated. CONFIRMED. |
| **R2** the ledger's only ratified-law violation (premade deity pool) | **STANDS, cured in code.** `src/generators/data/deityPool.js` and `src/generators/steps/seedStartingPantheon.js` do not exist (`ls`); deleted by `5f8dc7830` (2026-07-28, verified ancestor); guarded by `tests/lint/noPremadeDeityPool.walker.test.js` with a real anti-vacuity denominator (`expect(SRC_FILES.length).toBeGreaterThan(400)`, `:90`) across four scans. The record side is live and dated **2026-09-14**: `DEFERRAL_SWEEP_LAUNCH_PATH.md:82` row 1 + `:255`, ODQ §925.5(1), and the atlas row itself (`SETTLEMENT_CAPABILITY_ATLAS.md:8218-8224`) still says *"status: CONFIRMED (pool exists AND is wired…)"* citing three deleted files. CONFIRMED both sides. |
| **R3** `faithField.js` header says the field is dark | **STANDS.** Header at `:12-22` unchanged; `religionState.js:43` imports it and `:669` calls it on the pulse path; the **fence** was correctly amended (`faithFieldDormancyFence.test.js` allow-lists `religionState.js`, `causalState.js`, `faithDeepening.js`) while the header was not. CONFIRMED. |
| **R4** `deityAxes.js` "derived-only" vs the authored-temper embed | STANDS (not re-derived in depth by me; I accept the adjudicator's receipts). PLAUSIBLE. |
| **R5** FVQ says the faith `PACT_DRAFT_LENS` rows are empty | **STANDS but MUST NOT BE OVER-CORRECTED.** The rows are populated (`pactFormation.js:174-179`) — but per S1/S2 they still have no *reachable* producer, so a brief that simply inverts the FVQ row ("the faith terms have a producer now") would be as wrong as the FVQ. The accurate statement is: *a producer was authored; it cannot fire.* CONFIRMED. |
| **R6** `pantheon_ascendancy` "still unwired" | **STANDS, and I extend it (S6):** it is not merely wired, it mints **ungated** at `realmEvents.js:338`, as does `pantheon_twilight` at `:361`. CONFIRMED. |
| **R7** the catalog's false war-door sentence | **STANDS, upgraded (S2):** with the peacetime rung unreachable too, `missionary_access` has zero producers in both doors. CONFIRMED. |
| **R8** PROGRAMME §B calls WF-1 "BUILT" | **STANDS.** Built whole, dark in every preset, behind the data gate. CONFIRMED. |
| **R9** the §1 census predates W-FAITH | STANDS, with the adjudicator's own correction to the older reader (`faithProfile.field` is not a top-level key). CONFIRMED. |
| **R10 — NEW (S4)** | The ledger and the adjudicator both read `3a2db1110` as closing the fifth-cause corpus debt. It closed the **dossier state-prose** half. `docs/content/RECEIPT_POOLS_FAITH.md:174` still carries `### faith.fall.abandoned (WF-1)` with seven variants, in a file that is machine-read at `faithKindPools.walker.test.js:80`. ODQ §839 FLAG 2 records the residue as deliberately not actioned under WF-8A's condition-gated obligation. **Not a bug to re-find — a recorded deferral the pricing must carry as WF-8's second named obligation.** CONFIRMED. |
| **R11 — NEW (S1)** | Not record-vs-code but **code-vs-code**, and it is the family's sharpest: `pactFormation.js:217` reads `settlement.religionState`, a key with zero writers repo-wide, while the identical information is projected two lines of call-graph away at `config.faithProfile` (`religionState.js:669-676`) and correctly handed to the belief side at `beliefMap.js:503`. A landed, chair-signed GRAMMAR mechanism (GR-2's crossing) is inert on a typo-class defect that no suite can see because every ladder test injects a synthetic score. CONFIRMED. |

---

## §E — CAR RE-CUT

| Wave | PRICING §B | Adjudicator | **Mine** | Why |
|---|---|---|---|---|
| WF-0 | 2–3 | 2–3 | **2–3** | unchanged; it is the DATA car and **two** certification families wait on it (`subsystemRowsBaseline.js:60`, `subsystemRowsGrowth.js:91`) |
| WF-1 | *no row* | 1–2 | **1–2** | the adjudicator's new row stands: lighting + declaration under the 09-15 built-lit directive |
| WF-2 | 7–10 | 7–10 | **7–10** | unchanged; belief leg de-risked, draw live and deity-blind |
| WF-3 | 3–5 | 4–6 | **4–6** | car 0 stands; its **scope grows from three producers to five** (S3) at no extra car |
| WF-4 | 5–8 | 5–8 | **5–8** | unchanged; +1 declaration line (the live V-16 Auspice) at ~0 cost |
| WF-5 | 8–12 | 8–12 | **8–12** | unchanged; +1 charter clause (fork `moralInstitutionPressure`'s founding lane, never mint a second) |
| WF-6 | 4–7 | 5–8 | **6–9** | **+1 over the adjudicator: the crossing repair.** C0-3 changes content — repair the dead self-side read and rule the ladder's two unreachable rows *before* the semantics question, which is no longer "a term that already executes" but "a term that never has". The executor car does **not** narrow. ⚠ If the chair rules the `pactFormation.js:217` repair belongs to **GRAMMAR** (its owner) rather than WF, WF returns to 5–8 and GR gains the car — the work exists either way |
| WF-7 | 5–8 | 5–8 | **5–8** | unchanged; +1 declaration (W_INSTITUTION already prices temple richness as a count) |
| WF-8 | 8–12 | 8–12 | **8–12** | unchanged band, **two** named unpaid obligations (registry shrink-back + the annex `abandoned` pool), and Q1 now needs a second clause |
| WF-9 | 5–9 | 5–9 | **5–9** | unchanged |
| **Total** | **47–74** | 50–79 (≈64) | **51–79, centre ≈ 65** | **+4–5 over PRICING, ≈ +9 %** — the adjudicator's band with a raised floor (arithmetic mine, **PLAUSIBLE**; every input CONFIRMED) |

**Count:** unchanged from the adjudicator — **0 built-and-lit / 1 LANDED-DARK-WHOLE (WF-1) /
2 PART-BUILT (WF-6, WF-8) / 7 UNBUILT (WF-0, 2, 3, 4, 5, 7, 9)** — with WF-6's landed half re-labelled
**LANDED-INERT** inside its PART-BUILT status.

**Mandatory car 0s:** the adjudicator's five stand, with C0-3 rewritten (repair, then rule) and C0-4
extended (Q1 must also rule the overlap with `gods_abandonment`, `pantheon_ascendancy` and
`pantheon_twilight`). C0-5 becomes two obligations, not one. No sixth car 0: R11 is WF-6's car, not a
family-wide one.

---

## §F — GREP TRAPS (the adjudicator's nine re-tested; four new)

Carried and re-confirmed by me: `feat(WF` is the only clean landing door (and
`docs/implementation/packets/fp/` is a second, independent one) · `omen` matches `moment` ·
`tithe` (38 files) is the granary reserve + the `tithe_rights` prize token · `pilgrim` is TRADITIONS ·
`faithNarrationEnabled = 0` hits scores WF-8 UNBUILT and is wrong · `W-F<n>` ≠ `W-FAITH F<n>c` ≠
`WF-<n>` · `divination` is the Herald's forecast desk · SP-4's read is `courtRiskAppetiteOf` ·
council schism (`beliefMap.js:1450`) is not a creed schism.

**New, mine (all CONFIRMED at source):**
1. ⭐ **`religionState` (singular) is NOT a settlement key.** A grep that finds
   `devotionGroundTruth(row.religionState)` and concludes "the self side reads the religion state" is
   reading a dead pointer. The live spellings are `worldState.religionStates[cid]` and
   `settlement.config.faithProfile`.
2. ⭐ **A populated `PACT_DRAFT_LENS` rung is not a reachable rung.** `rungTermsFor` selects one rung,
   the crossing is three-valued, and `CROSSING_FLOOR01` cuts the bottom — so two authored rows are
   unproducible. Reading the lens table alone over-reports the producer by 40 %.
3. ⭐ **`auspice` / `AuspicePanel` is the V-16 forecast, not WF-4.** A fiction search for "omen" lands
   on a live DM surface that is not this wave.
4. ⭐ **`gods_abandonment` IS a faith arc** (`realmEvents.js:26-35`, routed
   `realm/heraldRouting.js:147`). "Five non-faith compound signatures" is wrong; "none a schism" is
   right.

---

## §G — WHAT I COULD NOT FALSIFY, AND RESIDUAL UNCERTAINTY

- I did **not** run any suite (read-only brief), so every "cannot fire" above is a static derivation
  over quoted constants and a repo-wide writer census, not an executed fixture. The cheapest
  disconfirmation available to a lane: light `pactFormationEnabled ∧ beliefAxesEnabled ∧
  believedDevotionEnabled` on a two-settlement deity-bearing fixture and assert a `pact_proposed` with
  `trigger: 'faith_communion'`. My prediction is that it cannot be produced. I label the defect
  **CONFIRMED** on the writer census (zero writers of `settlement.religionState` in the whole
  repository is not a judgement call) and the *consequence* — "no faith term has ever been drafted in
  any world" — **PLAUSIBLE**, because I cannot exclude a caller path I did not read.
- I accepted the adjudicator's R4 (`authoredTemper` embed) and its W-FAITH module table on its
  receipts rather than re-opening all nine modules; the two I did re-open (`faithField` mount,
  `faithChannelBindings` → `causalState`) checked out exactly.
- I did not audit the ~32,700-line ledger myself; I spot-checked §215, §400's executing commit, §765.1,
  §836, §839 and §925.5, and every one matched the ledger reader. I found **no WF analogue of TRADE's
  §96.2** — no ruling stops any WF wave. Consistent with both prior seats.
