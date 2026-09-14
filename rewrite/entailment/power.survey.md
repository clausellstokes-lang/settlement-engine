# ENTAILMENT SURVEY — THE POWER DESK (DS-POW-1 … DS-POW-7)

Research packet for the Fable chair, REWRITE 8b / the owner's bounded-flexibility question
(2026-09-09 23:5x). **Nothing here decides the law.** Every row is evidence with a citation.

- **Dock (read-only):** `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW` at `f2da5a3ee` (`REWRITE car 8b-W-5-lighting`).
- **All `file:line` below are dock-relative.** No vitest, no build, no write into the dock was run.
- **Desk membership is DERIVED, not guessed.** `scripts/prose-wave-gate.mjs:293-300` makes a
  desk section EQUAL to one generated leaf; `scripts/generate-dossier-state-prose.mjs:108`
  gives the `power` leaf exactly the prefix `['DS-POW-']`; `src/data/dossierStateProse/power.generated.js`
  carries blocks `DS-POW-1 … DS-POW-7` and nothing else (lines 7, 598, 1058, 1317, 1762, 2328, 2924).
  `scripts/prose-licence-card.mjs:56` names the same desk leaf.

**Census shape of the desk** (`docs/content/wiring-census.json`, 708 rows total):
79 rows are `DS-POW-*` — **31 RESOLVED, 48 WIRING-UNRESOLVED**.

| Block | RESOLVED | WIRING-UNRESOLVED |
|---|---|---|
| DS-POW-1 | 1 | 10 |
| DS-POW-2 | 8 | 1 |
| DS-POW-3 | 5 | 0 |
| DS-POW-4 | 7 | 2 |
| DS-POW-5 | 1 | 11 |
| DS-POW-6 | 7 | 6 |
| DS-POW-7 | 2 | 18 |

Per the standing law (MEMORY: *the rewrite carries the licensed claim set*), a
WIRING-UNRESOLVED pool is **wiring debt, not a rewrite target**; it is surveyed here only
because its SLOT NOUNS and NAME CLASSES are the same ones the resolved pools render.

---

## §1 THE DESK'S BLOCKS — receipt, state key, slots, provenance, census reads

Annex: `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. Cluster header (WRITER-2) at `:1762-1830`.

| Block | Annex line | RECEIPT (engine file:line, as the annex cites) | STATE-KEY (the values) | SLOTS named | Census `reads` on its RESOLVED rows |
|---|---|---|---|---|---|
| DS-POW-1 · Public legitimacy banner | `:1915` | `src/components/new/tabs/PowerTab.jsx:67-111`; bands `src/domain/compendium/bandLadders.js:168-180`; PDF twin `src/pdf/lib/viewModel.js:44-49,564-568` | `publicLegitimacy.label` (5 bands) · `breakdown{prosperity,safety,defense,food}` signed · `governanceFractured` bool | `{settlement}` `{seat}` `{faction}` `{band}` `{timeband_since}` | `legitimacy`, `legitimacy.governanceFractured` |
| DS-POW-2 · Stability + governing authority | `:1998` | `src/components/new/tabs/PowerTab.jsx:46-59, :113-150` | `stability` FREE STRING (first-word matched) · `factions[]{faction,power,powerLabel,isGoverning}` · `recentConflict` engine prose · `governingName` | `{settlement}` `{seat}` `{faction}` `{counterpart}` `{band}` `{reason}` `{timeband_since}` | `power.stability`, `first (via STABILITY_LADDER)`, `factions`, `factions.length`, `power.recentConflict` |
| DS-POW-3 · The Ladder | `:2069` | `src/components/new/tabs/PowerTab.jsx:174-222` | `rungs[]{name, standing 0..1}` top-first · `ladderInstabilityOf` 0..1 | `{settlement}` `{faction}` `{npc}` `{band}` `{timeband_since}` | `reading.instability`, `reading.rungs`, `reading.rungs.length`, `reading.rungs.map` |
| DS-POW-4 · Rule and succession | `:2116` | `src/components/dossier/EngineSections.jsx:208-287` (`legitimacyHold` `:208-214`) | `contenders.incumbent{name,gated,govMultiplier}` · `challengers[]{name,archetype,weight}` · `riskLabel` 4-way · `previousGovernments[]{government,cause,tick,by}` | `{settlement}` `{seat}` `{faction}` `{counterpart}` `{npc}` `{reason}` `{timeband_since}` `{timeband_age}` | `label (via RISK_POOL_OF)`, `legitimacy.govMultiplier` |
| DS-POW-5 · Ruling structure + structural lens | `:2186` | `src/domain/spatial/cohesionWeave.js:130-197`; `src/generators/power/rulingStructure.js:3-4,:167-200,:251-260,:372-429` | `rulingPower` (6 closed) · `economicBase` (5 closed) · `legitimacyNerve` (5) · `hysteresisWiden` · `governingName` | `{settlement}` `{seat}` `{faction}` `{counterpart}` `{good}` `{route}` `{band}` `{institution}` | `politics.blocs` (1 row only) |
| DS-POW-6 · Legitimacy absence, capture, criminal roles | `:2276` | `bandLadders.js:168-195,:237-244`; `src/domain/governanceLedger.js:25-64`; `src/domain/corruption.js:421-441`; `src/domain/display/defenseDisplay.js:92-140` | `governanceLedger → {legitimacyScore,legitimacyLabel,present}` · CAPTURE_LADDER pressure · seven criminal economic roles | `{settlement}` `{seat}` `{faction}` `{npc}` `{good}` `{band}` | `ledger`, `ledger.present`, `legitimacy.breakdown`, `breakdown.prosperity`, `breakdown.safety`, `power.criminalCaptureState`, `name` |
| DS-POW-7 · Blocs, coalitions, the divided court | `:2366` | `src/domain/worldPulse/settlementPolitics.js:57-61,:77-148,:159-164,:309-314,:414-447,:452-464,:668-669,:746-946` | `blocs[]{members,glue{type,detail},end,strain,sinceTick,covert}` · `rulingBlocOf` · `coalitionConsolidation01` · 5 glues · 5 ends · 5 receipt kinds · tie vocabulary | `{settlement}` `{faction}` `{counterpart}` `{npc}` `{seat}` `{reason}` `{band}` `{timeband_since}` | `politics.blocs` |

**PROVENANCE + FENCE lines that already bind (quoted from the annex, abridged):**

| Block | Annex line | The fence, as written |
|---|---|---|
| DS-POW-1 | `:1926-1930` | "A breakdown factor licenses a causal clause ONLY where it is the dominant contributor … `governanceFractured` is a SEPARATE assertion and is never inferred from a low band" — **§5 row L-1 shows the engine contradicts the second half.** |
| DS-POW-2 | `:2007-2015` | "A variant asserts ONLY the condition its own token names… The `powerLabel (NN)` digit never reaches the page… `recentConflict` is engine prose with a recorded subject and DOES license a causal clause; the stability string alone does not." |
| DS-POW-3 | `:2077-2086` | "the ladder carries ORDER and CHURN and nothing else — it records no reason for any rise or fall… **except** … high instability erodes the faction's effective power… No named death, ever." |
| DS-POW-4 | `:2131-2139` | "`govMultiplier` is a coefficient and MUST NOT reach the page in any form… `previousGovernments[].cause` is a RECORDED cause and is the one place in this shape where a causal clause is fully licensed. No prior ruler's fate is ever resolved." |
| DS-POW-5 | `:2202-2211` | "the governing body's NAME is a slot and never a baked noun… prose that hard-codes *the council* will be wrong on most settlements… The nerve is a DISPOSITION — what this kind of seat fears — and never an assertion that the feared thing is happening." |
| DS-POW-6 | `:2291-2301` | "`present: false` must read as *no reading*, never as a middling one… Capture DIRECTION is state and is narratable; the damping and amplification coefficients are not… The economic roles are short labels for what an operation IS, which is its own entailment and licenses nothing about who runs it." |
| DS-POW-7 | `:2385-2400` | "**Dormant means no bloc, factor 1.0, consolidation 0 — and the prose must render a plain undifferentiated court, never invent a coalition.** … `patronage` is PEOPLE-HELD and dies at succession — that entailment is the glue's own definition and is lawful to state." |

---

## §2 THE LICENCE CARDS AS PRINTED — eight pools, one per block plus one

Run in the dock: `node scripts/prose-licence-card.mjs <block> '<pool>'` (print-only).

| # | Block :: pool | `may claim` (verbatim) | `may NOT` (verbatim) | `source` / standing |
|---|---|---|---|---|
| 1 | `DS-POW-1 :: governanceFractured true` | "that `governanceFractured` (=== true) holds, as a STANDING fact of the record" | "a count, a cause, a season, a future, a standpoint, a second fact" | `court` · LICENSED · a STATE ORGAN |
| 2 | `DS-POW-2 :: siege matched` | "that `stability` holds, as a STANDING fact of the record" | same five | `court` · LICENSED |
| 3 | `DS-POW-3 :: high instability (churn at the top)` | "that `instability` holds, as a STANDING fact of the record" | same five | **(none) · SOURCE-UNRESOLVED** — "NO citation is licensed: a face naming a record holder here is refused by arm A13" |
| 4 | `DS-POW-4 :: riskLabel: Critical. The seat could fall` | "that the key `label` selects the row `Critical. The seat could fall` of `RISK_POOL_OF` in `powerStateProse.js`" | same five **+ "another civic object of the class `hall`"** | (none) · SOURCE-UNRESOLVED |
| 5 | `DS-POW-5 :: autocrat` | "that `blocs` holds, as a STANDING fact of the record" | same five | `court` · LICENSED |
| 6 | `DS-POW-6 :: capture reached a LEADER` | "that `criminalCaptureState` holds, as a STANDING fact of the record" | same five | `watch` · LICENSED · marks in this pool: `dm-only` |
| 7 | `DS-POW-6 :: present: false (no legitimacy reading)` | "that `present` (falsy (no literal)) holds, as a STANDING fact of the record" | same five | (none) · SOURCE-UNRESOLVED |
| 8 | `DS-POW-7 :: layer DORMANT (no ledger materialized)` | "that `blocs` (=== 0) holds, as a STANDING fact of the record" | same five | `court` · LICENSED |

Every card also prints the constant refusal:
> "REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is
> null everywhere); a named character and that character's fate (product scope); a theological
> claim about a deity (the deity doctrine)."

**What the card's grammar already says about the owner's question.** The card licenses one
thing — *that the recorded value holds, as a STANDING fact*. It refuses "a cause, a season, a
future, a standpoint, a second fact". The owner's bounded flexibility is therefore a question
about the **noun's dictionary**, not about the card's fact budget: a definitional attribute
(*a palisade is timber*) is not a second fact, it is part of what the first fact SAYS. Two
observations from the printed cards bear on where the line falls on this desk:

- **Card 4 already names a civic-object class as a refusal** ("another civic object of the class
  `hall`"), from `wiringCensus.js:1298-1325`. That list is a **key-string** classifier, not a
  roster read (`wiringCensus.js:1236-1240` says so outright). It cannot be used as evidence
  that the town HAS a hall.
- **Cards 3, 4 and 7 are SOURCE-UNRESOLVED**: no holder may be named at all on the ladder, the
  succession risk, or the absent-legitimacy cells. Any entailment rule that lets prose reach a
  record-keeping institution must be gated on the holder standing, not on the noun alone.

---

## §3 EVERY SLOT NOUN OF THE DESK

Slot register: `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:134-183` (§0c) and `:185-211` (§0c-2).
Fills: `src/domain/display/stateProse/powerStateProse.js:849-935`.

| Slot | Shape (§0c) | What it fills with (annex) | Actual producer on this desk | Filled? |
|---|---|---|---|---|
| `{settlement}` | proper | the page's own town | `settlement.name` — `powerStateProse.js:851` | YES, all 7 blocks |
| `{seat}` | proper | "the governing body **by its own generated name** — tier-scaled … never a baked noun" (`:1816`, `:196`) | `powerStructure.governingName` — `powerStateProse.js:853`, produced at `src/generators/power/rulingStructure.js:787` | YES in DS-POW-1/4/5/6/7; **NO in DS-POW-2** |
| `{faction}` | proper | "the acting faction, seat, bloc or house" (`:172`) | **also `governingName`** — `powerStateProse.js:871` (DS-POW-2), `:889`, `:912`, `:935` | YES; **same string as `{seat}`** |
| `{counterpart}` | proper | "the other end of a directed relation" (`:171`) | `readings.contenders.challengers[0].name` — `powerStateProse.js:975`; produced at `src/domain/rulingPowerCoup.js:94-100` | YES in DS-POW-4 and DS-POW-7 |
| `{npc}` | proper | "a cast person named on a member receipt; never minted, no fate resolved" (`:173`) | `reading.rungs[0].name` — `powerStateProse.js:639`; produced at `src/domain/townMap/ladderRead.js:95-107` | YES in DS-POW-3 only |
| `{band}` | **RESERVED** | "a band word from a closed vocabulary — never a figure … not declarable" (`:181`, `:150`) | none — the card prints `band: RESERVED` | NEVER |
| `{reason}` | bare-common | "the RECORDED reason, typed, from the field's own reason slot" (`:182`) | none on this desk | NO |
| `{timeband_since}` | phrase | §0d bands | none — desk holds no clock (`powerStateProse.js:918-928`) | NO |
| `{timeband_age}` | phrase | §0d bands | declared absent with two measured reasons — `powerStateProse.js:915-929` | NO |
| `{institution}` | proper | "a named building or house on the settlement's roster" (`:172`); here "the theocracy arm's temple" (`:2197`) | **deliberately unfilled** — `powerStateProse.js:895-897`, `:688-692` | NO |
| `{good}` | bare-common | "the named trade good" (`:174`) | unfilled; the `economicBase: craft` pool is **dark by declaration** (`powerStateProse.js:672-682`) | NO |
| `{route}` | proper | "the named road, lane, crossing or pass" (`:177`) | unfilled; the `economicBase: trade_hub` pool is dark | NO |

**The two-bag note is load-bearing** (`powerStateProse.js:855-869`, quoted): "{seat} CARRIES TWO
INCOMPATIBLE ROLES ACROSS THESE BLOCKS… In DS-POW-1 every {seat} seam is the governing BODY…
In DS-POW-2 it is the HALL, a PLACE the body occupies… **No hall-name producer exists**, so
DS-POW-2 leaves {seat} UNFILLED and supplies {faction} only. Anchored liveness then drops the 10
seat-naming variants and keeps 21 of 31."

---

## §4 EVERY RECORDED NAME CLASS THE DESK CAN RENDER

### 4.1 GOVERNANCE LABELS — the `{seat}` and `{faction}` fill class

`governingName` = the `isGoverning` roster entry's `.faction` string — `src/generators/power/rulingStructure.js:787`
(and `government`, the same string, `:792`).

| Sub-class | Members (verbatim) | file:line |
|---|---|---|
| Institution-keyed labels (`governanceLabelMap`) | Elder Consensus · Household Council · Free Elder Council · Elder Council · Elected Reeve · Feudal Stewardship · Feudal Appointee · Grand Council · City Council · Town Council · Grand Guild Council · Guild Authority · Guild Council · Grand Guild Consortium · Merchant Guild Council · Ducal Governorship · Noble Governorship · Grand Merchant Oligarchy · Merchant oligarchy · Democratic assembly · City-State Council · Royal Authority | `rulingStructure.js:161-175` |
| Council modifiers when a priority > 65 | Grand Military Council · Military City Council · Military Council · High Theocratic Council · Ecclesiastical Council · Church Council · Grand Merchant Senate · Merchant City Council · Merchant Council · Shadow Senate · Corrupt City Council · Corrupt Council · Arcane Senate · Arcane Council | `rulingStructure.js:196-233` |
| Small-tier fallbacks (thorp/hamlet/village) | Headman's Authority · Priestly Guidance · Household Council · Elder Council | `rulingStructure.js:244-256` |
| Town fallbacks | Military Council · Church Council · Merchant Council · Corrupt Council · Arcane Council · Town Council · **Town Mayor** | `rulingStructure.js:266-287` |
| Metropolis / city fallbacks | Grand Military Council · High Theocratic Council · Grand Merchant Senate · Shadow Senate · Arcane Senate · Grand Council · Military City Council · Ecclesiastical Council · Merchant City Council · Corrupt City Council · City Council | `rulingStructure.js:288-320` |
| Governing-body modifier words (adjectival, never the noun) | military-dominated · theocratic-aligned · commerce-driven · corruption-riddled · arcane-advised; informal: defended · church-guided · merchant-led · compromised · mage-advised · garrison-backed | `rulingStructure.js:192-196`, `:338-357` |
| Authored per-label descriptions (canonical-at-zero, may be lifted) | 33 rows, `govDescByLabel` | `rulingStructure.js:362-425` |

### 4.2 FACTION NAMES — the `{counterpart}` fill class

| Member | file:line |
|---|---|
| `Merchant Guilds` / `Merchant Guilds (dominant)` | `rulingStructure.js:497-501, :506` |
| `Manor Household` (hamlet/village) · `Landed Gentry` (town) · `Noble Families` (city) · `Noble Houses` (metropolis) | `rulingStructure.js:524-531, :565` |
| `Military/Guard` | `rulingStructure.js:596` |
| `Religious Authorities` | `rulingStructure.js:638` |
| `Craft Guilds` | `rulingStructure.js:647` |
| `Thieves' Guild` | `rulingStructure.js:671` |
| `Arcane Orders` | `rulingStructure.js:682` |
| Stress-minted: War Council · Occupation Authority · Resistance Network · Loyalist Noble Bloc · Rival Faction B · Reform Noble Bloc · Third Bloc (Neutrals) · Investigation Faction · Unknown Faction (hidden) · Noble Claimant (Senior Line) · Claimant Bloc A · Noble Claimant (Reform Faction) · Claimant Bloc B · Grain Holders · Quarantine Council · Monster Hunters / Adventurers · Newcomers' Settlement · Departure Committee · Peace Faction · New Faith Community · Reform Congregation · Conversion Enforcement Office · Underground Old Faith · Revolt Leadership · Abolitionist Network | `src/generators/power/stressFactions.js:21,43,48,60,68,96,105,122,130,139,148,163,212,231,280,288,326,332,337,342,380,385` |
| Neighbour-injected mirror/oppose rows | `src/generators/steps/neighbourFactions.js:77-93, :116-130` |

### 4.3 CLOSED STATUS / POSTURE VOCABULARIES

| Class | Members | file:line |
|---|---|---|
| Legitimacy band | Endorsed (≥75) · Approved (≥60) · Tolerated (≥45) · Contested (≥30) · Legitimacy Crisis (<30) | `src/generators/factionDynamics.js:106-112`; ladder text `src/domain/compendium/bandLadders.js:175-181` |
| `govMultiplier` | 1.30 · 1.15 · 1.00 · 0.80 · 0.60 | `factionDynamics.js:113-118` |
| `crimMultiplier` | 0.75 · 0.90 · 1.00 · 1.15 · 1.30 | `factionDynamics.js:119-124` |
| Legitimacy contributions | prosperity ±20 · safety ±20 · defense ±10 × tierScale · food ±10 × tierScale | `factionDynamics.js:20-27, :30-44, :51-59, :62-70, :76-82, :150-166` |
| `powerLabel` band words | Dominant (≥35) · Strong (≥25) · Significant (≥18) · Minor (≥10) · Suppressed | `factionDynamics.js:582-586`; twin at `src/generators/power/economyReconciliation.js:77-83`; twin at `src/generators/steps/neighbourFactions.js:17-23` |
| Stability labels (baseline) | Enforced Order (authoritarian) · Unstable — criminal governance · Rigid (militant theocracy) · Fragile (private security, no public law) · Unstable (pervasive organized crime) · Tense (militarised, chronically underfunded) · Stable (theocratic governance) · Tense (external threat) · Vulnerable (prosperous but underdefended) · Ordered (strong military presence) · Stable | `src/generators/power/governanceNarrative.js:249-279` |
| Stability labels (stress override) | Critical (active siege — survival priority) · Suppressed (under occupation: resistance simmers) · Fractured — no stable governing authority · Shaken — institutional trust collapsed · Desperate — hunger is eroding order · Anxious — disease is overriding normal authority · Volatile — power is available to whoever moves first · Strained — debt obligations constrain every decision · Tense (monster pressure from surrounding region) | `governanceNarrative.js:288-321` |
| Stability labels (monster annotation) | `<label>; monster threat active` · Tense — regional monster threat | `governanceNarrative.js:329-338` |
| Stability labels (play-time transfer) | Unsettled: … · Subjugated: … · Stable: a fresh mandate, still finding its footing · Transitional: the succession held … · Transitional: an appointed authority … | `src/domain/rulingPower.js:414-420` |
| Desk stability classifier | first-word ladder `stable → stable matched` · `unstable`/`volatile → unstable matched` · `critical → critical matched` · `desperate → Desperate matched`; `\bsiege\b` tested FIRST; everything else → the FLOOR | `src/domain/display/stateProse/powerStateProse.js:305-330` |
| Coup risk labels | Stable · Holding · Contested · Critical. The seat could fall | `src/domain/rulingPowerCoup.js:255-260` |
| `COUP_COERCION` per archetype | military 1.25 · noble 1.1 · arcane 1.05 · government 1.0 · civic 1.0 · religious 1.0 · occupation 1.0 · merchant 0.95 · outsider 0.9 · craft 0.85 · labor 0.85 · other 0.9 | `rulingPowerCoup.js:36-49` |
| Criminal capture ladder | none · adversarial · equilibrium · corrupted · capture | `src/domain/corruption.js:474` |
| Capture display labels | No organised crime · Criminal: Adversarial · Criminal: Tolerated · Criminal: Corrupted Officials · Criminal: Governance Captured | `src/components/new/tabs/PowerTab.jsx:163-169` |
| Criminal operation economic roles | parallel marketplace · duty evasion · unlicensed revenue · money laundering · stolen goods market · protection + extraction · criminal revenue stream | `src/domain/criminalOpRole.js:38-46`, roster `:56-64` |
| Criminal structure keys | organized (Organized Syndicate) · semi-organized (Semi-Organized Networks) · diffuse (Diffuse Criminal Presence) | `src/domain/display/defenseDisplay.js:160-177` |
| Ruling powers | autocrat · council · theocracy · merchant_league · criminal · mixed | `src/domain/spatial/cohesionWeave.js:134` |
| Legitimacy nerves | coup · unrest · heresy · insolvency · betrayal · (mixed → unrest) | `cohesionWeave.js:159-166` |
| Economic bases | extraction · agrarian · trade_hub · craft · mixed, each with a `fear` and `warStyle` | `cohesionWeave.js:131`, lens `:141-148` |
| Archetype → ruling power | noble/military/occupation → autocrat · government/civic/labor → council · religious/arcane → theocracy · merchant/craft → merchant_league · criminal → criminal | `cohesionWeave.js:180-186` |
| Faction archetypes (canonical) | government · noble · military · merchant · religious · criminal · arcane · craft · labor · outsider · occupation · civic · other | `src/domain/factionArchetypes.js:34-48` |
| Faction **categories** (the generator's own, DIFFERENT set) | military · religious · criminal · magic · economy · government · noble · other | `src/generators/power/factionCategories.js:31-176` (`inferFactionCategory` `:146-176`) |
| Bloc glue types | compromise · threat · doctrine · patronage · concession | `src/domain/worldPulse/settlementPolitics.js:414-457` |
| Bloc ends | seats · doctrine · commerce · survival · patron | `settlementPolitics.js:461-472` |
| Bloc receipt kinds | formed · realigned · fractured · exposed · deferred | `settlementPolitics.js:708` (typedef); emitted `:786,804,818,833,849,855,885,888,907,977,979,982,986` |
| Warm leader ties | family · mentor_student · ally · respect · lover · patron_client | `settlementPolitics.js:315` |
| Hostile leader ties | rival · enemy; hard-block strengths bitter · mortal · personal · serious | `settlementPolitics.js:317-320` |
| Bloc caps | MAX_BLOCS_PER_SETTLEMENT 3 · MIN_BLOC_MEMBERS 2 · MIN_DWELL_TICKS 8 · RULING_CONSOLIDATION_FLOOR 0.4 | `settlementPolitics.js:93, :96, :120, :149` |
| Ladder tuning | STAND_MAX 10 · STAND_BASELINE 3.0 · SEED_SPREAD 3.0 · half-life 156 weeks · RUNG_ELIGIBLE_FLOOR 0.4 | `src/domain/worldPulse/npcLadderState.js:44-56` |
| Rung cap by tier | thorp 1 · hamlet 2 · village 3 · town 3 · city 4 · metropolis 5 | `npcLadderState.js:107-110` |
| NPC dot-rank seats | leader_champion (3) · lieutenant_operator (2) · agent_protege (1) | `src/domain/worldPulse/npcAgency.js:411-415` |
| Importance ladder | pillar · key · notable · minor | `src/domain/corruption.js:447` |
| Transfer causes | coup · election · succession · conquest · appointment; lawful passage = succession/election/appointment | `src/domain/rulingPower.js:356`, `:376` |
| Settlement tiers | thorp · hamlet · village · town · city · metropolis (· capital in the typedef) | `src/domain/settlement.schema.js:758`; `npcLadderState.js:108-110` |
| Defense group label (minted in the POWER generator) | The garrison · The militia · The watch · The mercenary company · The community (small tiers) · **The guard** | `src/generators/power/governanceNarrative.js:499-506` |
| Civic-object classes (a KEY-STRING classifier, not a roster read) | wall · force · store · market · law · temple · road · hall · care · craft · storehouse, each with its token list | `src/domain/prose/wiringCensus.js:1298-1325`; the "key and nothing else reads the key" note `:1236-1240` |
| Record-holder kinds | treasury · muster · census · parish · toll-bar · market · watch · court · elders · tradition · road · office | `src/domain/prose/holderTable.js:78-80`; per-kind services `:271-366` |
| Institution names (the `{institution}` class) | 238 authored rows including Courthouse · Multiple court buildings · Town hall · City hall · City administration · Town council · Village headman · Village elder · Household elder · Town watch · Professional city watch · Citizen militia · Garrison · Parish church · Royal seat · Democratic assembly · Merchant oligarchy · Guild governance · Guild consortium · Noble governor · City-state government · Mayor and council · Village reeve · Lord's appointee · Informal elder consensus · Head-of-household consensus | `src/data/institutionServices.js` (238 keys enumerated by direct read of the file's top-level entries) |

---

## §5 ENTAILMENT CANDIDATES

Each row: the **noun** a face of this desk can put on a page; its **name class** with members and
citation; **ENTAILS** (what the word means by definition, member by member); **NOT ENTAILED**
(the typical associations the word does not carry); **ENGINE CONTRADICTS** (real-world
entailments the engine's own rules refuse).

---

### E-1 · `{seat}` / the governing body's name

| Column | Content |
|---|---|
| **Name class** | GOVERNANCE LABELS (§4.1), `rulingStructure.js:161-175, :192-337, :787` |
| **ENTAILS** | *Council · Consensus · Assembly · Senate · Consortium · Court(-council)*: **a body — more than one person decides**. *Reeve · Mayor · Headman's Authority · Governorship · Stewardship · Appointee · Royal Authority · Oligarchy*: **an office or a small holder, not an assembly**. `Elected Reeve` entails election ("A reeve elected from the peasantry", `rulingStructure.js:365`). `Feudal Appointee` entails delegation and revocability ("all authority is delegated from above and revocable at will", `:369-370`). `Merchant oligarchy` entails that office is bought ("political office is effectively purchased through commercial success", `:414-415`). These are the label's **own authored gloss**, i.e. the engine's model of what the word means. |
| **NOT ENTAILED** | a building; a chamber; how many sit on it; how often it meets; its age; its tenure; whether it is loved; whether it convenes at all; a hall. |
| **ENGINE CONTRADICTS** | (a) `Democratic assembly`'s gloss is "An assembly of citizens votes on major decisions; **factions lobby for influence rather than seizing control**" (`rulingStructure.js:418-419`) — the engine denies the coup framing for it, while `coupContenders` still fields challengers against it (`rulingPowerCoup.js:81`). (b) The annex names the hazard itself: "prose that hard-codes *the council* will be wrong on most settlements in the realm" (`RECEIPT_POOLS_DOSSIER_STATE.md:2202-2204`, `:1816`). |

### E-2 · "the hall"

| Column | Content |
|---|---|
| **Name class** | **NONE — the word is baked in the corpus, not filled.** `powerStateProse.js:855-869`: "it is the HALL, a PLACE the body occupies … **No hall-name producer exists**". The census's `hall` civic-object class (`wiringCensus.js:1313`) is a key-string classifier, explicitly not a roster read (`:1236-1240`). |
| **ENTAILS** | nothing whatever about a building. |
| **NOT ENTAILED** | that the settlement has a `Town hall` / `City hall` institution (both exist in `institutionServices.js` and nothing joins them to this word); a chamber; a door; a place a stranger can walk into. |
| **ENGINE CONTRADICTS** | On a thorp/hamlet the governing institution is `Head-of-household consensus` or `Informal elder consensus` (`institutionServices.js`; matched at `rulingStructure.js:162-163`) — a **consensus**, not a place. DS-POW-2's floor prose "{faction} holds the hall at {settlement}" and DS-POW-7's "the hall at {settlement}" assert a hall on every town of every tier. |

### E-3 · "the watch"

| Column | Content |
|---|---|
| **Name class** | (i) holder kind `watch` → services *Crime reporting · Crime response · Missing persons*, instantiated only by `Professional city watch` and `Town watch` (`holderTable.js:318-324`); (ii) the POWER generator's own group label ladder (`governanceNarrative.js:499-506`). |
| **ENTAILS** | for `Town watch` / `Professional city watch`: a body that **keeps watch** and **takes crime reports** (the service rows are the definition). Nothing more. |
| **NOT ENTAILED** | numbers; pay; competence; that it patrols at night; that it is the settlement's only armed body; that it is answerable to the seat. |
| **ENGINE CONTRADICTS** | DS-POW-1's `Endorsed` variant 4 ("Crime finds little room at {settlement}, **and the watch is not the reason**") and DS-POW-6's `capture pressure RECOVERING` variant 2 ("Prosperity and **a working watch** did what no investigation did") both assert a watch. Neither pool reads any watch row: DS-POW-1's only read is `legitimacy` (census), DS-POW-6's are `breakdown.prosperity` + `breakdown.safety` + `power.criminalCaptureState`. The engine holds `inst.hasWatch` and the roster row, and the desk consults neither. |

### E-4 · "the rolls" / "the clerks" / "the record"

| Column | Content |
|---|---|
| **Name class** | holder kind `office` → services *Public records · Public record access · Record filing*, instantiated by `City administration`, `City hall`, `Town hall` only (`holderTable.js:357-366`). Note `:363-365`: "the office keeps its own books, so a CITATION on a fact sourced here is a finding … the record would be citing the speaker." |
| **ENTAILS** | that a record exists **only where such an institution does**. |
| **NOT ENTAILED** | clerks as persons; a chase for arrears; a collection; a ledger book; literacy. |
| **ENGINE CONTRADICTS** | DS-POW-1's `[ledger]` angle asserts rolls and clerks in every one of its five bands ("its rolls come back filled and its levies come back paid"; "the clerks record almost nothing they have had to chase"). Small tiers have no office-kind institution, so the holder resolves `null` **with its reason** (`holderTable.js:36-45`, the three-standing law) — the licence card for such a pool would read SOURCE-UNRESOLVED, and cards 3/4/7 in §2 show that state is real on this desk. |

### E-5 · "the court" (the political sense)

| Column | Content |
|---|---|
| **Name class** | **two disjoint classes share the word.** (i) holder kind `court` → *Criminal trials · Civil disputes · Notary services · Criminal proceedings · Civil litigation · Appeals*, from `Courthouse` / `Multiple court buildings` (`holderTable.js:325-333`). (ii) DS-POW-7's political court — an unfilled English noun with no producer. |
| **ENTAILS** | (i) adjudication. (ii) nothing; it is the set of factions. |
| **NOT ENTAILED** | (ii) a room; an audience; a monarch; a bench; that the two senses coincide in this town. |
| **ENGINE CONTRADICTS** | the census's own instrument read DS-POW-7's `consolidation 0: a fully divided court` as `objectClass: law` (measured in the census row) because `court` is a token of the `law` class (`wiringCensus.js:1311`). The classifier itself cannot tell the two senses apart. |

### E-6 · "a bloc" / "the combination"

| Column | Content |
|---|---|
| **Name class** | `Bloc` typedef `settlementPolitics.js:64-67` |
| **ENTAILS** | at least **two** members (`MIN_BLOC_MEMBERS: 2`, `:96`); a **primary glue** and an **end** (both required fields); the settlement holds at most **three** (`MAX_BLOCS_PER_SETTLEMENT: 3`, `:93`); a bloc must hold **8 ticks** before it may dissolve for a non-triggering reason (`MIN_DWELL_TICKS: 8`, `:120`). |
| **NOT ENTAILED** | that it governs; a name; a leader; a meeting; a membership count beyond two; a size; that anyone outside knows of it. Ruling status is a **separate** derivation needing the governing faction inside AND ≥ 0.4 of settlement power (`rulingBlocOf` `:549-592`, floor `:149`). |
| **ENGINE CONTRADICTS** | `coalitionConsolidation01` returns **0 for both** a dormant layer and a live layer with no ruling bloc (`:604-607`), and `rulingBlocOf` also returns null when `totalPower <= 0` (`:581`). So a face that reads a 0 as *a measured full division* ("No combination at {settlement} holds enough of the hall to govern it") is asserting a discrimination the value does not carry. |

### E-7 · the glue words

| Glue | ENTAILS (engine's own definition + detail string) | NOT ENTAILED | ENGINE CONTRADICTS |
|---|---|---|---|
| `patronage` | **PEOPLE-HELD; dies at succession.** `settlementPolitics.js:447-450` returns `peopleHeld: true`; the fracture is executed at `:799-806` ("a leader who bound the bloc left the seat; the personal loyalty went with them"). Detail: "personal loyalty between the leaders". | kinship; affection; money; a debt; that either leader is old. | — (this is the one entailment the annex already declares lawful, `:2396-2397`; CONFIRMED by the code.) |
| `concession` | **SEAT-HELD; outbiddable; survives leader changes.** `:452-455`; the outbid market at `:858-889`, margin `OUTBID_POWER_MARGIN 0.25` (`:127-131`). Detail: "seats and revenue traded for a working majority". | who paid; how much; that any seat actually changed. | — |
| `doctrine` | **two or more members whose archetype is `religious` OR `arcane`.** `:443-446`. Detail: "a shared creed binds the seats". | a deity; a temple; a rite; orthodoxy; that the creed is religious at all. | The word "creed" is asserted for **two wizard colleges** (`arcane` satisfies the test). A face saying "agree about something larger than the town" of two mage guilds is reading the label as English. |
| `threat` | **an external danger is live** (`underThreat`, `:438-440`). Detail: "a common danger at the walls: the fractious close ranks". Dissolves past the dwell when the danger lifts (`:846-850`). | a siege; an army; **walls**; a named enemy. | The engine's own detail string says "at the walls" and `settlementUnderThreat` never reads a wall row. On an unwalled town the phrase is the engine's, and lifting it verbatim carries a wall the model does not hold. |
| `compromise` | **a member's seat-holder carries a corruption leash**; `covert: true`; shatters (never loosens) on exposure (`:427-437`, detonation `:810-820`). Detail: "a seat-holder carries a corruption leash. A leash the bloc does not name aloud". | who holds the other end; money; that it is local (the code says "local OR foreign", `:428`). | — |

### E-8 · the end words

| End | ENTAILS | NOT ENTAILED | ENGINE CONTRADICTS |
|---|---|---|---|
| `seats` | the leading member's archetype is noble/military/government/civic, or a leader goal in {secure_office, seek_promotion, consolidate_power} (`:461-472`) | ambition; a named target seat; a plan | — |
| `commerce` | archetype merchant/craft/labor, or goal in {profit_from_change, accumulate_wealth, expand_trade} | a good; a route; a sum | — |
| `doctrine` | archetype religious/**arcane**, or goal in {spread_faith, defend_doctrine} | a deity; a creed's content | same arcane conflation as E-7 |
| `survival` | **an external threat override** — `deriveEnd` returns `survival` unconditionally when `underThreat` (`:754`) | a famine; a siege; a plan | it is an override, not a member interest; a face reading it as *what this bloc wants* is reading a world fact as a preference |
| `patron` | archetype **criminal OR outsider** (`:463-464`), or goal `serve_patron` | a deity; a temple; a foreign power | The census classed `end patron` as `objectClass: temple` because `patron` is a token of the `temple` class (`wiringCensus.js:1312`). The engine's `patron` here is a political sponsor. |

### E-9 · "the ladder" / "a rung" / "standing"

| Column | Content |
|---|---|
| **Name class** | `ladderRungsOf` → `[{npcId, name, standing 0..1}]`, top-first (`src/domain/townMap/ladderRead.js:95-107`); `standing` = `stock / STAND_MAX` where STAND_MAX is 10 (`npcLadderState.js:44-46, :920`). |
| **ENTAILS** | an **order** (the array is sorted top-first); a **prominence stock** that decays toward baseline over a 156-week half-life (`npcLadderState.js:39-43, :51`); only office-holders hold a rung (`RUNG_ELIGIBLE_FLOOR 0.4`, `:55-56`). High instability **erodes effective power** — `ladderEffectivePowerFactor = powerMod × (1 − 0.4 × instability)` (`ladderRead.js:204, :211-217`). This last is the one causal clause the annex licenses, and the code confirms it. |
| **NOT ENTAILED** | a reason for any rise or fall; a title; an office name; an age; a tenure; a death (annex fence `:2082-2086`); a count of members; that anyone is climbing. |
| **ENGINE CONTRADICTS** | **(a) Depth is a TIER cap, not a faction size.** `RUNG_CAP_BY_TIER = {thorp 1, hamlet 2, village 3, town 3, city 4, metropolis 5}` (`npcLadderState.js:107-110`), and `SHALLOW_RUNGS_BELOW = 3` (`powerStateProse.js:578`). A thorp or hamlet is therefore **always** "shallow ladder", whatever the faction's size. The pool's prose — "The ladder is short **because the faction is**, not because the climbing has finished" — is false on exactly those towns. **(b) At first light the gaps are a pure function of rung count.** `seedStandingForRung` spreads BASELINE 3.0 … BASELINE+SEED_SPREAD 6.0 evenly by rung index (`npcLadderState.js:217-224`). Normalised: 3 rungs → 0.60/0.45/0.30, every gap exactly 0.15 = `SETTLED_MIN_GAP` → **`low instability, long-held order`**; 4 rungs → gaps 0.10 → **`clear top rung`**; 5 rungs → gaps 0.075 ≤ `CROWDED_TOP_GAP` 0.08 → **`crowded top rung`** (cuts at `powerStateProse.js:580-582`). On a world with no lived churn, three of the five pools are selected by **tier alone**, and "Nobody has moved on the top rung … in a long while" describes the seed spread. **(c)** `ladderInstabilityOf` returns 0 for a record that carries rungs and no `instability` field (`ladderRead.js:138-141`), so "long-held" also spells "no churn recorded". |

### E-10 · "a challenger" / "outweighs" / "the seat could fall"

| Column | Content |
|---|---|
| **Name class** | `coupContenders` (`rulingPowerCoup.js:81-125`) → top **3** non-governing, **non-criminal** factions with `power ≥ MIN_CONTENDER_POWER 5` (`:51, :102-104`), each carrying `weight = power × COUP_COERCION[archetype]` (`:36-49, :99`). `coupRiskLabel` (`:274-282`). |
| **ENTAILS** | that a rival exists on the roster with the stated relative weight. `Critical. The seat could fall` entails the incumbent is **ungated** — its amplified weight did not re-enter the top three (`:111-112, :278`). |
| **NOT ENTAILED** | an intention; a plan; a claim; a grievance; a date; that anybody has moved. `weight` is a **coercion coefficient** on raw power, not an ambition (`:30-34`). |
| **ENGINE CONTRADICTS** | `riskLabel: Stable` means **no non-criminal challenger with power ≥ 5**. Criminal factions are filtered out by construction: "Criminal factions never vie for power openly — the capture ladder is their path" (`rulingPowerCoup.js:102-104`). So the pool's prose "**Nobody** at {settlement} is positioned to take the {seat}" is false of a town whose Thieves' Guild sits at capture-ladder `corrupted` or `capture` — the engine models exactly that route and this label excludes it. |

### E-11 · the legitimacy band words

| Column | Content |
|---|---|
| **Name class** | `legitimacyBandFor` (`factionDynamics.js:106-140`), rungs `bandLadders.js:175-181`. |
| **ENTAILS** | a score position: 50 + four bounded signed contributions, clamped 0..100 (`factionDynamics.js:161-166`). |
| **NOT ENTAILED** | a cause; a trend; a history; that anyone was asked; that the score moved; a season; a person's opinion. |
| **ENGINE CONTRADICTS** | **L-1.** The annex's fence says `governanceFractured` "is a SEPARATE assertion and is never inferred from a low band — a crisis-band town with an intact hall is a real and common state" (`:1927-1930`). **All three writers set it to exactly `score < 30`**: `factionDynamics.js:133`, `src/domain/timeProgression.js:179`, `src/domain/rulingPower.js:352`. The fracture flag and the `Legitimacy Crisis` band are the SAME fact at birth and in play. `powerStateProse.js:249-251` records the same measurement ("the fracture flag and the crisis band are coextensive at the producer"). A face treating the fracture as a second, independent fact ("the records show one thing, the town obeys another") is more knowledgeable than the simulation. |

### E-12 · "the dominant contributor" (prosperity / safety / defense / food)

| Column | Content |
|---|---|
| **Name class** | `BREAKDOWN_WORD` (`powerStateProse.js:220-225`); selection by max absolute value (`:255-260`). |
| **ENTAILS** | which of the four signed numbers has the largest magnitude on this town. |
| **NOT ENTAILED** | that the town cares about it most; that it is what the town talks about; a cause; a direction of travel. |
| **ENGINE CONTRADICTS** | **the four are not commensurable.** prosperity ±20 (`factionDynamics.js:20-27`); safety ±20 (`:30-44`); defense ±10 **× tier scale 0.3/0.4/0.6/0.85/1.0** (`:51-59, :76-82`); food ±10 **× tier scale 0.4/0.5/0.65/0.85/1.0** (`:155-159`). On a thorp the defense term cannot exceed |3| and the food term |4|, against |20| available to each of the other two. So "dominated by DEFENSE, adverse" is a **coefficient-range artifact** on small tiers, and the prose "nothing else in the reckoning pulls half so hard against it" restates the coefficient table, not the town. **Second:** only prosperity has a favourable pool; safety/defense/food positives draw **silence** by declaration (`powerStateProse.js:262-266`). |

### E-13 · "the hold" (govMultiplier)

| Column | Content |
|---|---|
| **Name class** | five bands 1.30/1.15/1.00/0.80/0.60 (`factionDynamics.js:113-118`); the page's five authored clauses at `EngineSections.jsx:208-214`. |
| **ENTAILS** | the direction and magnitude of legitimacy's effect on the incumbent's coup defence (`rulingPowerCoup.js:69-73, :109`). |
| **NOT ENTAILED** | a public act; a vote; a protest; a rival's move. |
| **ENGINE CONTRADICTS** | the desk maps **five bands into three pools**: `>1 → hardens`, `<1 → rejection is breaking`, `=1 → neither` (`powerStateProse.js:517-522`). So `1.15`, which the shipped page calls "public **approval lends them weight**", draws the pool whose prose is "**backing hardens** their hold"; and `0.80`, which the page calls "public **doubt loosens** their hold", draws "public **rejection is breaking** the hold". The engine holds a milder middle and the corpus has no cell for it. |

### E-14 · the capture rungs

| Column | Content |
|---|---|
| **Name class** | `CAPTURE_LADDER = ['none','adversarial','equilibrium','corrupted','capture']` (`corruption.js:474`); birth classifier `computeCriminalCaptureState` (`factionDynamics.js:220-255`); display labels `PowerTab.jsx:163-169`. |
| **ENTAILS** | a **faction-level** position on that ladder. `capture` at birth additionally entails crimP > govP×1.5 AND crimP ≥ 24 AND govP ≥ 15 AND safetyRatio < 0.35 (`factionDynamics.js:243`). |
| **NOT ENTAILED** | which person; which seat; a sum; a date; a method. **There is no person-level captured-role record anywhere in the tree** — stated and measured at `powerStateProse.js:396-404`. |
| **ENGINE CONTRADICTS** | the corpus asks for `an AGENT of a faction` vs `a LEADER`; the desk supplies them from `corrupted` → AGENT and `capture` → LEADER as a **declared JUDGMENT** grounded only in the display labels (`powerStateProse.js:399-404`). A face that reads AGENT/LEADER as a **person's rank** is reading a faction-level rung as a seat. The annex compounds this by spelling the middle NPC seat "deputy" (`:2284`) where the engine spells it `lieutenant_operator` (`npcAgency.js:413`). |

### E-15 · the criminal operation roles

| Column | Content |
|---|---|
| **Name class** | seven roles, substring-matched on the operation NAME (`criminalOpRole.js:38-46`); roster `:56-64`. |
| **ENTAILS** | **what the operation IS** — the annex already declares this the role's own entailment (`:2299-2301`). `duty evasion` entails goods moving around customs; `money laundering` entails a legitimate-looking front; `stolen goods market` entails a clearinghouse; `parallel marketplace` entails a second market. |
| **NOT ENTAILED** | who runs it; its size; its age; its profit; how many people; whether the watch knows. |
| **ENGINE CONTRADICTS** | the desk narrates only the **first classifiable** operation (`powerStateProse.js:962-968`), so the sentence is about one row of a list the reader can see in full. And the fallback row is **wide**: `Slave market`, `Whisper market`, `Human trafficking network`, `Kidnapping ring`, `Contract killer`, `Street gang`, `Bandit affiliate`, `Outlaw shelter`, `Underground network`, `Underground city`, `Multiple criminal factions`, `Assassins Guild` all fall to `criminal revenue stream` (unclassified) — the pool's prose "no clearer description of it than that" is true of the classifier, not of the town. |

### E-16 · the ruling-power words

| Column | Content |
|---|---|
| **Name class** | `RULING_POWERS` (`cohesionWeave.js:134`); derivation `structuralLensOf` (`:275-287`) → `structuralLens` (`:219-240`) → `rulingPowerFromArchetype` (`:196-199`) over `ARCHETYPE_TO_RULING` (`:180-186`). |
| **ENTAILS** | `autocrat`: one decider, fast and swinging (nerve `coup`). `council`: averaged, sticky decisions, `hysteresisWiden 1.4` (nerve `unrest`). `theocracy`: doctrine-first (nerve `heresy`). `merchant_league`: interest and leverage (nerve `insolvency`). `criminal`: leverage rather than consent (nerve `betrayal`). All from `RULING_POWER_LENS` `:159-166`. The `fear` and `warStyle` strings are authored design vocabulary the annex expressly permits lifting verbatim (`:2206-2209`). |
| **NOT ENTAILED** | that the feared thing is happening (annex `:2210-2211`, confirmed — the nerve is a field on the lens table, never a world reading); a number of deciders; a building; a tenure. |
| **ENGINE CONTRADICTS** | **three separate defects, all measured here.** (a) **`structuralLensOf` reads the MAX-POWER faction, not the governing one** — `cohesionWeave.js:279-285` iterates the whole roster for the highest `power` and never consults `isGoverning`. So the word can describe a house that does not hold the seat, while the prose says "what the {seat} decides". (b) **The two vocabularies do not join.** The ONE generation-side writer of `f.category` is `inferFactionCategory` (`rulingStructure.js:700`), whose output set is {military, religious, criminal, **magic**, **economy**, government, noble, **other**} (`factionCategories.js:146-176`). `ARCHETYPE_TO_RULING`'s key set is {noble, military, occupation, government, civic, labor, religious, arcane, merchant, craft, criminal}. **`magic`, `economy` and `other` are unmapped and fail soft to `mixed`** (`cohesionWeave.js:196-199`). Consequences: **`merchant_league` is unreachable** (there is no `merchant` or `craft` category to produce it — a Merchant oligarchy town reads `mixed`); an Arcane Council town reads `mixed`, not `theocracy`; `council` is reachable only from category `government`. (c) Therefore `mixed`'s prose — "**Nothing at {settlement} governs cleanly.** The {seat} is an arrangement between kinds of power" — is drawn for towns governed very cleanly by one kind of power, i.e. it is a fail-soft value dressed as a reading. The desk refuses exactly this for `economicBase` and says so at length (`powerStateProse.js:672-682`) but does not refuse it for `rulingPower`. |

### E-17 · the economic-base words

| Column | Content |
|---|---|
| **Name class** | `ECONOMIC_BASES` + `ECONOMIC_BASE_LENS` (`cohesionWeave.js:131, :141-148`). |
| **ENTAILS** | each base's authored `fear` and `warStyle` — e.g. `extraction`: "mine depletion" / "turtle the chokepoints"; `agrarian`: "harvest failure" / "seasonal army (the harvest imperative bites)". |
| **NOT ENTAILED** | a mine; a field; a road; a workshop; any institution. |
| **ENGINE CONTRADICTS** | **all five pools are DARK by declaration.** `structuralLensOf` calls `structuralLens({ governingArchetype })` with **no `economicBase`** (`cohesionWeave.js:286`), so `normalizeEconomicBase('')` fails soft to `mixed` on every world (`:191-199`); and `powerStateProse.js:672-682` records that the three keys the base would come from have **no writer at all**. Nothing on this desk may render these words today. |

### E-18 · the stability words

| Column | Content |
|---|---|
| **Name class** | 21 baseline/stress/annotation labels (`governanceNarrative.js:249-338`) + 5 transfer labels (`rulingPower.js:414-420`), classified by **first word only** (`powerStateProse.js:305-330`). |
| **ENTAILS** | only the token the classifier matched. The annex's fence is explicit: "A variant asserts ONLY the condition its own token names. A `stable` match may not assert *no rivals*; an `unstable` match may not assert *a coup is coming*" (`:2010-2013`). |
| **NOT ENTAILED** | duration; a cause; a rival; a trend; a future. |
| **ENGINE CONTRADICTS** | **(a)** `critical matched` has **no producer** — the only label carrying `critical` also carries `siege`, and siege is tested first (`powerStateProse.js:294-302`, declared). **(b)** the FLOOR pool absorbs **seventeen distinct labels** (see §6 L-4) and its prose asserts "{faction} holds the hall at {settlement} and the town's affairs run through it", which is precisely what `Fractured — no stable governing authority` denies (`governanceNarrative.js:295`). |

### E-19 · "the militia" / "the garrison" / "the guard" / "the community"

| Column | Content |
|---|---|
| **Name class** | `deriveDefenseGroupLabel` — **minted inside the POWER generator** at `governanceNarrative.js:499-506`: garrison > militia > watch > mercenary company > (small tier) the community / the guard. |
| **ENTAILS** | for each named row, the institution it is matched on. `The community` and `The guard` are the **fallbacks** and entail no institution at all. |
| **NOT ENTAILED** | pay; numbers; training; that they are the same body as the watch. |
| **ENGINE CONTRADICTS** | the ladder is a **first-match precedence**, so a town with both a garrison and a militia is always called "The garrison" — the word is a selection, not an inventory. |

### E-20 · "previous government" / "the cause"

| Column | Content |
|---|---|
| **Name class** | `RULING_POWER_CAUSES = ['coup','election','succession','conquest','appointment']` (`rulingPower.js:356`); lawful passage = succession/election/appointment (`:376`); the row shape `{label, cause, tick}` (`:631`). |
| **ENTAILS** | a **recorded** cause, which the annex licenses as a full causal clause (`:2136-2138`). `LAWFUL_PASSAGE_CAUSES` entail that the defeated house **survives demoted** (`:358-376`, modifier `fell_from_power` `:380`). |
| **NOT ENTAILED** | a death; a date in years; a name; a battle. |
| **ENGINE CONTRADICTS** | the field has **no generation-time writer**; it is written only on a play-time transfer (`rulingPower.js:631`). `powerStateProse.js:527-534` and `:920-923` record the measurement: "previousGovernments absent on **48 of 48** generated towns". Both DS-POW-4 lineage pools are unwired (census: WIRING-UNRESOLVED). The `previousGovernments empty` pool's prose — "Whatever came earlier was not the kind of thing the rolls kept" — would therefore be drawn for **every generated town**, asserting a historical claim about a field that is simply not written yet. |

---

## §6 LABEL TRAPS — an engine value or label whose English meaning is not its engine meaning

| # | Label / value | Field | Engine meaning (quoted) | file:line |
|---|---|---|---|---|
| L-1 | `governanceFractured: true` | `publicLegitimacy.governanceFractured` | **exactly `score < 30`** — the same predicate as the `Legitimacy Crisis` band, at all three writers. Not an independent fracture. | `src/generators/factionDynamics.js:133`; `src/domain/timeProgression.js:179`; `src/domain/rulingPower.js:352`; the measurement restated at `src/domain/display/stateProse/powerStateProse.js:249-251` |
| L-2 | `equilibrium` (capture ladder) | `powerStructure.criminalCaptureState` | renders as **"Criminal: Tolerated"** — a tacit tolerance of an underworld, not a balanced or healthy state. | `src/components/new/tabs/PowerTab.jsx:166`; ladder `src/domain/corruption.js:474` |
| L-3 | `adversarial` (capture ladder) | same | renders as **"Criminal: Adversarial"** — crime present and *opposed*, i.e. better than `equilibrium`, worse than `none`. The English word suggests hostility toward the town; the engine means hostility toward the underworld. | `PowerTab.jsx:165` |
| L-4 | `Stable` (first word) | `powerStructure.stability` | The classifier matches the **first word only**. Three different labels lead with it: bare `Stable`, `Stable (theocratic governance)`, and the play-time `Stable: **a fresh mandate, still finding its footing**`. All three draw the pool whose prose is "the town expects {faction} to go on holding it, and business is conducted on that expectation". | ladder `powerStateProse.js:305-330`; labels `governanceNarrative.js:266, :279`; transfer label `src/domain/rulingPower.js:417` |
| L-5 | `Fractured — no stable governing authority` | same | falls to the **FLOOR** pool, whose prose asserts "{faction} holds the hall at {settlement} and the town's affairs run through it". The desk deliberately avoided the *substring* bug ("would print 'The hall is settled'", `powerStateProse.js:275-284`) but the floor still asserts the holding. | `governanceNarrative.js:295`; floor `powerStateProse.js:313` |
| L-6 | `Enforced Order (authoritarian)` · `Rigid` · `Fragile` · `Ordered` · `Suppressed` · `Shaken` · `Anxious` · `Strained` · `Vulnerable` · `Tense` ×4 · `Unsettled` · `Subjugated` · `Transitional` ×2 | same | **seventeen distinct engine states collapse into ONE floor pool.** The floor's three variants are the whole of what the reader gets for any of them. | `governanceNarrative.js:249-321`; `rulingPower.js:414-420`; floor `powerStateProse.js:313` |
| L-7 | `plagued` | `config.monsterThreat` | **plagued by MONSTER activity**, never disease: "The surrounding region is plagued by monster activity." It reaches the POWER desk by minting the stability label `Tense — regional monster threat` or appending `; monster threat active`. | `src/components/new/SummaryTab.jsx:37`; `src/generators/defenseGenerator.js:197, :227, :498`; the power-side annotation `governanceNarrative.js:329-338` |
| L-8 | `Anxious — disease is overriding normal authority` | same | this one **is** disease (`plague_onset` stress). The desk's two nearest labels therefore carry opposite meanings; only this one licenses illness. | `governanceNarrative.js:303-305` |
| L-9 | `Desperate — hunger is eroding order` | same | **hunger specifically** (`famine` stress), not general despair. The corpus pool is keyed `Desperate matched` and its prose speaks of governance, not food. | `governanceNarrative.js:300-302`; pool key `powerStateProse.js:310` |
| L-10 | `Volatile` | same | `succession_void` — "power is available to whoever moves first". The desk routes it to **`unstable matched`**, whose prose says "{faction} governs, and how long {faction} governs is an open question". A succession void may mean **nobody** governs. | `governanceNarrative.js:306-308`; mapping `powerStateProse.js:307` |
| L-11 | `Critical (active siege — survival priority)` | same | the ONLY label carrying `critical`, and it also carries `siege`, so **`critical matched` is mounted and unreachable** — declared at `powerStateProse.js:294-302`. | `governanceNarrative.js:288-290` |
| L-12 | `govMultiplier` 1.15 and 0.80 | `publicLegitimacy.govMultiplier` | the shipped page calls them "public approval **lends them weight**" and "public doubt **loosens** their hold"; the desk's three-way routes them to the **extreme** pools ("backing hardens", "rejection is breaking"). | bands `factionDynamics.js:113-118`; clauses `src/components/dossier/EngineSections.jsx:208-214`; routing `powerStateProse.js:517-522` |
| L-13 | `Stable` (coup risk) | `riskLabel` | means **no non-governing, non-criminal faction with power ≥ 5** — not that nobody wants the seat. Criminal factions are excluded from the field by design. | `src/domain/rulingPowerCoup.js:51, :102-104, :274-277` |
| L-14 | `weight` / "outweighs" | `challengers[].weight` | `power × COUP_COERCION[archetype]` — a **coercion coefficient**, so a military house of 20 power outweighs a merchant house of 25. | `rulingPowerCoup.js:36-49, :99` |
| L-15 | `gated` | `incumbent.gated` | "the ruler only presents a case if it re-enters the top 3 post-amplification"; with fewer than three challengers it is **always true** by construction. | `rulingPowerCoup.js:69-76, :111-112` |
| L-16 | `mixed` (ruling power) | `structuralLens.rulingPower` | the **fail-soft default** of `rulingPowerFromArchetype`, returned for every unmapped category — `magic`, `economy`, `other`. It is not a measured reading of a blended government. | `cohesionWeave.js:196-199`; the unmapped set at `factionCategories.js:146-176` vs `cohesionWeave.js:180-186` |
| L-17 | `mixed` (economic base) | `structuralLens.economicBase` | likewise fail-soft, and it is the **only** value the shipped lens can ever produce, because `structuralLensOf` passes no base at all. | `cohesionWeave.js:191-199, :286`; declared dark at `powerStateProse.js:672-682` |
| L-18 | `legitimacyNerve` | `structuralLens.legitimacyNerve` | a **constant of the lens table**, one per ruling power. It is a disposition of the KIND of seat, never a reading of this town. | `cohesionWeave.js:159-166`; annex fence `:2210-2211` |
| L-19 | `hysteresisWiden` | same | a multiplier on the verdict deadband/dwell (council 1.4, everything else 1.0-1.1). Only its **consequence** may be spoken. | `cohesionWeave.js:152-166`; annex `:2208-2210` |
| L-20 | `consolidation` = 0 | `coalitionConsolidation01` | returned for **both** a dormant layer and a live layer with no ruling bloc; also for `totalPower <= 0`. It is not a measured "fully divided". | `settlementPolitics.js:581, :604-607` |
| L-21 | `covert` (census column) | census row field | on this desk **every** DS-POW row reads `covert: false`, because the column keys on the READ PATH (`COVERT_SOURCES` includes `blocs.covert`, not `politics.blocs`), not on the variants' `dm-only` marks. DS-POW-6's four capture pools are 100% dm-only and still read `covert: false`. | `wiringCensus.js:1252-1268`; the dm-only measurement at `powerStateProse.js` caller note `PowerTab.jsx:205-212` |
| L-22 | `objectClass` | census row field | derived from the **pool-key string alone**, licensed as the one label read: "the pool key string is never the PREDICATE… this column reads the key and nothing else reads the key". It is never evidence about the town. | `wiringCensus.js:1236-1240, :1358-1381` |
| L-23 | `present: false` | `governanceLedger(settlement).present` | means **no legitimacy record at all** (a legacy save or an ungenerated settlement), and the ledger still returns `legitimacyScore: 50`. The 50 is a neutral default, not a reading. | `src/domain/governanceLedger.js:32-36, :55-66`; annex fence `:2292-2294` |
| L-24 | `deferred` (receipt kind) | politics receipt | three different situations share it: the draw missed, the leaders' rivalry blocked it, or the settlement is at the three-bloc cap. | `settlementPolitics.js:979, :982, :986` |

---

## §7 ALIAS TRAPS — a generic English word naming a class the engine splits into rows

| # | Word | The engine rows it spans | file:line | The rule the word must follow |
|---|---|---|---|---|
| A-1 | **the council** | Elder Consensus · Household Council · Free Elder Council · Elder Council · Town Council · City Council · Grand Council · Guild Council · Guild Authority · Merchant Guild Council · Grand Guild Council · Grand Guild Consortium · Military Council · Military City Council · Grand Military Council · Church Council · Ecclesiastical Council · High Theocratic Council · Merchant Council · Merchant City Council · Corrupt Council · Corrupt City Council · Arcane Council · Quarantine Council · War Council · City-State Council — **and the non-council seats it excludes**: Town Mayor · Elected Reeve · Headman's Authority · Priestly Guidance · Feudal Stewardship · Feudal Appointee · Noble Governorship · Ducal Governorship · Merchant oligarchy · Grand Merchant Oligarchy · Democratic assembly · Royal Authority · Grand Merchant Senate · Arcane Senate · Shadow Senate | `rulingStructure.js:161-175, :192-337` | Follow the `{seat}` fill. The annex already forbids the baked noun (`:1816`, `:2202-2204`). **The always-safe spellings are `the {seat}` and "the governing body"**; "the hall" is NOT safe (E-2). |
| A-2 | **the hall** | no engine row at all — no hall-name producer exists; `Town hall` / `City hall` are institution rows nothing joins to this word | `powerStateProse.js:855-869`; roster `src/data/institutionServices.js` | Treat as a baked English noun with zero warrant. The safe spellings are `the {seat}` (the body) or "where the town takes its business". |
| A-3 | **the court** | (i) judicial: `Courthouse`, `Multiple court buildings` via holder kind `court`; (ii) political: the DS-POW-7 word with no row; (iii) the census's `law` object class token | `holderTable.js:325-333`; `wiringCensus.js:1311` | Never let the political sense license a courthouse or an adjudication. |
| A-4 | **the watch** | `Town watch` · `Professional city watch` (holder kind `watch`) — and the label ladder that **outranks** it with `The garrison` and `The militia` | `holderTable.js:318-324`; `governanceNarrative.js:499-506` | A pay/manning/enforcement fact must follow the town's own row. **The always-safe generic spellings are "the guard" and (small tiers) "the community"** — the exact fallbacks the engine itself mints. |
| A-5 | **the guard / the armed body** | The garrison > The militia > The watch > The mercenary company > The community / The guard (a first-match precedence, one winner) | `governanceNarrative.js:499-506` | The word is a **selection**, not an inventory: a town with a garrison AND a militia is only ever "The garrison". Never enumerate from the label. |
| A-6 | **a creed / doctrine** | the glue `doctrine` fires on **≥2 members whose archetype is `religious` OR `arcane`**; the end `doctrine` likewise; the ruling power `theocracy` maps from `religious` OR `arcane` | `settlementPolitics.js:443-446, :463`; `cohesionWeave.js:182` | A "creed" sentence must not assert a deity, a temple, a rite or orthodoxy — the row may be two wizard colleges. The deity doctrine (MEMORY: faith = culture, never theological) bites here too. |
| A-7 | **a leader** | (i) capture rung `capture` → the desk's word "LEADER" (`powerStateProse.js:439`); (ii) NPC dot-rank seat `leader_champion` (`npcAgency.js:412`); (iii) a bloc's `leaderNpcId` (`settlementPolitics.js:443`); (iv) the ladder's top rung (`ladderRead.js:95`). **Four different objects.** | as cited | Name which ladder. The annex's "deputy" (`:2284`) matches **none** of them; the engine's middle seat is `lieutenant_operator` (`npcAgency.js:413`). |
| A-8 | **the faction** | on this desk `{faction}` and `{seat}` are filled from the **same** string, `governingName` | `powerStateProse.js:871, :889, :912, :935` | Any variant naming both renders one name twice ("Town Council outweighs everyone who wants the Town Council"). The rewrite must not add a variant that pairs them. |
| A-9 | **a guild** | the `craft` object class token `guild` (`wiringCensus.js:1315`); the roster rows `Craft Guilds`, `Merchant Guilds`, `Thieves' Guild`, `Arcane Orders`; the category keywords `Guild` (economy) vs `Thiev` (criminal) | `wiringCensus.js:1315`; `rulingStructure.js:497, :647, :671, :682`; `factionCategories.js:78-107, :191-206` | The bare word crosses three archetypes. `factionArchetypes.js:73-83` orders criminal BEFORE merchant precisely so "thieves guild" does not classify as a guild. |
| A-10 | **the market** | the `market` object class tokens (market/trade/export/import/commerce/merchant/caravan) vs the holder kind `market` (`Market square` only) vs the criminal role `parallel marketplace` vs the roster rows `Market`, `Market square`, `Weekly market`, `Daily markets`, `Black market`, `Slave market`, `Whisper market`, `Fish market` | `wiringCensus.js:1310`; `holderTable.js:311-317`; `criminalOpRole.js:39` | `Slave market` and `Whisper market` do **not** classify as `parallel marketplace` (only `black market` does), so the generic word cannot carry the role. |
| A-11 | **a patron** | (i) bloc end `patron` = a political sponsor, from archetype **criminal or outsider**; (ii) the `temple` object class token `patron`; (iii) the warm tie type `patron_client` | `settlementPolitics.js:463-464, :315`; `wiringCensus.js:1312` | Never let the bloc's `patron` end reach a deity or a temple. The census's own classifier already mis-files it. |
| A-12 | **the record / the rolls / the books** | twelve holder kinds, each with its own instantiating institutions; `tradition` has **none in the whole shipped roster** | `holderTable.js:78-80, :271-366` (`tradition` note `:341-347`) | The card decides: three of the eight cards printed in §2 are SOURCE-UNRESOLVED and refuse any holder naming (arm A13). |
| A-13 | **the underworld / crime** | seven operation roles + three structure keys + five capture rungs + the faction row `Thieves' Guild` — four independent classifications of one English word | `criminalOpRole.js:56-64`; `defenseDisplay.js:160-177`; `corruption.js:474`; `rulingStructure.js:671` | Say which classification. A structure key (`organized`) is not a capture rung (`capture`) is not a role (`protection + extraction`). |
| A-14 | **the militia / muster** (inherited from the defense desk, live on this desk too) | the holder kind `muster` is instantiated by **exactly one** institution in the shipped roster, `Citizen militia`: "A town with a Garrison and no militia has men under arms and no roll of them, which is the sharpest wiring debt this table found." | `holderTable.js:279-287` | The power desk reaches this whenever a face sources an armed-strength fact. |

---

## §8 ENGINE-CONTRADICTS — the class summary for this desk

The chair's canonical example is *walls never decay in the model*. The power desk's counterparts,
ranked by how load-bearing the contradiction is:

| # | The real-world entailment | What the engine actually holds | file:line |
|---|---|---|---|
| C-1 | *A fractured government and an unpopular one are different facts.* | They are the same predicate, `score < 30`, at all three writers. | `factionDynamics.js:133`; `timeProgression.js:179`; `rulingPower.js:352` |
| C-2 | *A settled ladder means nobody has moved in a long while.* | At first light the gaps are `SEED_SPREAD` divided by rung count, i.e. a function of TIER. 3 rungs → "long-held order"; 4 → "clear top"; 5 → "crowded top". | `npcLadderState.js:107-110, :217-224`; cuts `powerStateProse.js:578-582` |
| C-3 | *A short ladder means a small faction.* | Depth is capped by tier: thorp 1, hamlet 2. | `npcLadderState.js:107-110` |
| C-4 | *"Nobody is positioned to take the seat" means nobody is.* | Criminal factions are excluded from the coup field by construction; the capture ladder is their route. | `rulingPowerCoup.js:102-104` |
| C-5 | *The dominant legitimacy contributor is what the town cares about most.* | The four contributions have different ranges (±20 / ±20 / ±10×tier / ±10×tier), so dominance is a coefficient artifact on small tiers. | `factionDynamics.js:20-27, :30-44, :51-59, :76-82, :155-159` |
| C-6 | *A "mixed" government is a blended one.* | `mixed` is the fail-soft default for three unmapped categories, one of which (`economy`) covers every merchant-led town. | `cohesionWeave.js:196-199` vs `factionCategories.js:146-176` |
| C-7 | *The ruling-power word describes whoever holds the seat.* | It describes the **strongest** faction on the roster; `isGoverning` is never consulted. | `cohesionWeave.js:279-285` |
| C-8 | *A "fully divided court" is a measured division.* | `0` is also what a dormant layer and a zero-power roster return. | `settlementPolitics.js:581, :604-607` |
| C-9 | *"The danger at the walls" implies walls.* | The engine's own glue detail says "at the walls" and `underThreat` reads siege/war-footing/war-front channels, never a wall row. | `settlementPolitics.js:438-440` |
| C-10 | *A recorded lineage says something about a town's history.* | `previousGovernments` has no generation-time writer; measured absent on 48 of 48 generated towns. | `rulingPower.js:631`; measurement `powerStateProse.js:920-923` |
| C-11 | *"Public rejection is breaking the hold" describes rejection.* | It is also what `0.80` draws, which the shipped page calls "public doubt loosens their hold". | `powerStateProse.js:517-522` vs `EngineSections.jsx:208-214` |
| C-12 | *An economic base tells you what the town lives on.* | Every world reads `mixed`; the five pools are dark by declaration. | `cohesionWeave.js:286`; `powerStateProse.js:672-682` |

---

## §9 WHAT THE DESK ALREADY DOES RIGHT (evidence for the chair's "no new mechanism" side)

| Practice | Where |
|---|---|
| An unrecognised band label renders **nothing** rather than falling into a band. | `powerStateProse.js:203-212` |
| A dominant contribution of **zero** is no dominance; the desk goes silent. | `powerStateProse.js:259-261` |
| Only prosperity has a favourable lens, so a favourable safety/defense/food draws **silence** rather than the prosperity sentence. | `powerStateProse.js:262-266` |
| The stability classifier reads the **first word**, never a substring — the fix that stopped "The hall is settled" printing about a settlement with no governing authority. | `powerStateProse.js:275-284, :327-329` |
| The `NARROW` plurality cut renders **nothing** in the middle band rather than rounding into one. | `powerStateProse.js:342-348, :362` |
| The five `economicBase` pools are refused outright rather than drawn off a fail-soft default. | `powerStateProse.js:672-682` |
| Six of DS-POW-7's twenty pools are dark by declaration, each with a measured reason. | `powerStateProse.js:749-772` |
| The audience is passed explicitly because the kernel is fail-closed and an unstated audience would silently darken four authored dm-only pools. | `PowerTab.jsx:205-212` |

---

## §10 OPEN QUESTIONS THE CHAIR MAY WANT ON THE DOCKET (raised, not decided)

1. **Does a label's own authored gloss count as its definition?** `govDescByLabel` (`rulingStructure.js:362-425`)
   is the engine's own statement of what each governance label means ("A reeve elected from the
   peasantry…", "revocable at will"). If the owner's rule is *what the noun means by definition*,
   these 33 rows are the desk's dictionary and are already shipped. If it is *only what the word
   means in English*, they are a second fact.
2. **The `{seat}` / `{faction}` collision** (A-8) is a corpus-side slot-role ambiguity the desk
   already raises for the chair (`powerStateProse.js:866-869`). Any entailment rule that lets a
   face reason from "the faction" will reason from the seat's own name.
3. **The 17-into-1 stability floor** (L-6) and the **5-into-3 hold mapping** (L-13) are pool-coverage
   gaps, not entailment questions — but both make a *correctly entailed* sentence false on
   specific engine states, which is the same failure mode by a different route.
4. **`merchant_league` is unreachable** (E-16b). Either the vocabularies are joined (a wiring act)
   or the pool is declared dark like the economic bases. Today it is neither.
5. **The annex's DS-POW-1 fence is contradicted by the engine** (C-1). The fence text at
   `RECEIPT_POOLS_DOSSIER_STATE.md:1927-1930` should either be amended or the pool re-scoped;
   the desk's own code already records the contradiction.

---

*Packet written 2026-09-09 by the power-desk entailment lane (Opus 5). Read-only against the dock
at `f2da5a3ee`. No test, build or write touched the dock.*
