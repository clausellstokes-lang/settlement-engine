# REFERENT REFUTE — THE POWER DESK (DS-POW-1 … DS-POW-7)

Refuter seat: Fable 5.1. Dock `laneRW-DEFW` at `f2da5a3ee`, read-only (nothing modified, staged or committed; no vitest, no build). Surveyor packet: `power.referent.survey.md` (05:57). Every cite below was re-derived in the dock by `sed -n`/`grep`; the only executions were `scripts/prose-licence-card.mjs` (two cards) and five printing `node` probes over the committed census, the generated leaf and the shipped roster (`_pow_ref_probe.mjs`, `_pow_leaf_probe.mjs`, `_pow_leaf_ctx.mjs`, `_pow_leaf_ctx2.mjs`, `_pow_roster_probe.mjs`, beside this file).

STATUS: COMPLETE (all eleven sections written).

Verdict vocabulary: **HOLDS** (true for every member, consistent with the engine) · **CONDITIONAL** (true only under a stated condition) · **REFUTED** (false for some member, or contradicted by code — quoted). Doubt resolves to CONDITIONAL or REFUTED.

## §0 METHOD
Every claim in the survey (§2 layer table, §4.1 noun rows, §4.2 role rows, §5 slots, §6 overlaps, §7 visibility, §8 findings, §9 wiring) is re-read against the dock. Where a cite is wrong but the claim is right, the row says **cite REFUTED, claim HOLDS** and gives the true line.

---

## §1 THE CITE AUDIT (survey line numbers re-derived)

| Survey cite | Verdict | Actual |
|---|---|---|
| `holderTable.js:78, :90, :115, :129-143, :164, :188-199, :206-208, :210-212, :271, :280-288, :304-308, :311-316, :318-323, :325-330, :332-337, :338-347, :357-362, :599, :642, :678-700` | HOLDS | all re-derived at those lines |
| `holderTable.js:751-760` (the pair dedupe, O-5) | cite REFUTED | the pair dedupe is `holderTable.js:730-744` (`seen.add(\`${kind}::${holder}\`)` at :741) |
| `defenseInstitutionBuckets.js:83-105, :116, :134, :169` | HOLDS | |
| `corruption.js:474, :490-497, :630, :663, :677-680` | HOLDS | `captureAdvanceChance` :491-496; the revealed/covert split :675-681 |
| `brokeragePatronage.js:60, :202, :228, :285-296, :303-312, :319-329` | HOLDS | bindings :287-297; projection :319-328 |
| `factionCapture.js:93-99, :106-121, :136` | HOLDS | rank loop :93-100 |
| `rulingStructure.js:161-176, :164, :259, :260, :284, :702, :764-767, :781, :787, :792, :797` | HOLDS | seed :764-766 |
| `factionDynamics.js:113-118, :127, :132-133, :179, :220-273, :237-243` | HOLDS | |
| `factionDynamics.js:245-246` and `:257-259` (both offered for "the council is purchased") | cite REFUTED | the comment is `factionDynamics.js:246-247`; :257-259 is inside `computeFactionRelationships` |
| `cohesionWeave.js:133, :171-180, :194-197` | HOLDS | `ARCHETYPE_TO_RULING` :171-177 |
| `institutionTable.js:129-138, :210-216, :377-400, :396-398, :457` | HOLDS | `officesOf` :377-398; the seat fold :395-397 |
| `powerStateProse.js:53-55, :149-152, :155-162, :178-186, :436-440, :634, :639, :665-701, :709-713, :858, :860, :875-876, :909, :953, :962, :994` | HOLDS | |
| `powerStateProse.js:957-958` (the "captured house" comment, R-3) | cite REFUTED | the comment is `powerStateProse.js:900-901` ("DS-POW-6 uses {seat} as the governing BODY (like DS-POW-1) and {faction} for the captured house"); :962 fills both from `governing` (claim HOLDS) |
| `powerStateProse.js:809-810` (`b?.covert === true`; `text(rulingPower) === 'autocrat'`) | cite REFUTED | `politicsPresencePoolKey` is :797-804; `b?.covert === true` at :800; the `'autocrat'` literal at :801 |
| `settlementPolitics.js:63-67, :246-258, :252-253, :316-318, :423-455, :461, :549, :604, :792-803, :823-830, :927-928, :959-962, :992` | HOLDS | `classifyGlue` :423-457 |
| `wiringCensus.js:608, :1176-1177, :1252-1259, :1265-1269, :1302-1322` | HOLDS | `CIVIC_OBJECT_CLASSES` :1301-1322 |
| `institutionServices.js:32, :48, :55, :89, :96, :134, :320, :497, :517, :524, :530, :759, :835, :879, :920, :930, :941, :985, :1002, :1064, :1069, :1117, :1132, :1206, :1322, :1346, :1623, :1629, :1635, :1640, :1671` | HOLDS | |
| `institutionServices.js:838` ("City granaries") | cite REFUTED | :838 is a closing brace; `"City granaries"` is :839 |
| `criminalOpRole.js:38-57`, `ladderRead.js:95-107`, `npcProfile.js:341-353`, `dossierComposedFill.js:141` | HOLDS | |
| `RECEIPT_POOLS_DOSSIER_STATE.md:1915, :1928-1930, :1990-1993, :2009-2011, :2078-2085, :2199-2201, :2292-2293, :2297, :2319-2328` | HOLDS | |
| `RECEIPT_POOLS_DOSSIER_STATE.md:2305-2307` ("the seat rank … never appears outside a dm-only tag") | cite REFUTED | that fence is `:2293-2295`; :2305-2307 is the `neutral baseline` pool |
| `prose-wave-gate.mjs:279-290, :294, :298, :307-331`; `generate-dossier-state-prose.mjs:109` | HOLDS | |
| §1 desk figures: 79 pools · 256 variants · 29 dm-only (1/0/0/0/3/12/13) · LICENSED 14 = court 10 · watch 2 · court+watch 2 · SOURCE-UNRESOLVED 65 · INTERESTED 0 · covert 0 | HOLDS | re-measured from `wiring-census.json` and the leaf (`_pow_ref_probe.mjs`, `_pow_leaf_ctx.mjs`) |
| §0 "zero hits for `institution|impair|patron|corrupt|forces|walls|garrison|militia|watch|muster|charter|mercenary` over the 79 rows' reads" | HOLDS | the 79 `reads` arrays printed by the probe carry none of those tokens |

---

## §2 THE FOUR LAYERS (survey §2) — VERDICTS

| Survey row | Verdict | Evidence / condition |
|---|---|---|
| BODY (bucket) — six defence buckets plus `magicDef`, substring over the native semantic name | HOLDS | `defenseInstitutionBuckets.js:83-109`, `:137-138` |
| BODY (roster) — 285 authored rows | HOLDS | measured: `Object.keys(INSTITUTION_SERVICES).length === 285` |
| BODY (partition) ruin-blind / `standingDefenseForces` live | HOLDS | `:119-121`, `:169-170` |
| HOLDER-ORGAN — twelve closed kinds; four state organs; field→kind→institution | HOLDS | `holderTable.js:78-81`, `:115`, `:164`, `:599-615` |
| POWER (settlement-wide) — the five-rung ladder, written `:797`, computed `factionDynamics.js:220` | HOLDS | |
| POWER (per faction) — seeded onto the GOVERNING entry only at equilibrium+ | HOLDS | `rulingStructure.js:764-766` (`if (['equilibrium','corrupted','capture'].includes(criminalCaptureState))`) |
| POWER (INTERESTED) — "the four state organs become interested parties in their own records" | **CONDITIONAL** | (a) the birth-time reading fires on `adversarial` and `equilibrium` too: `capturedRulingStructure` returns `captured: (criminal !== null && criminal !== 'none') || faction !== null` (`holderTable.js:141`), by design (`:121-125` "adversarial and equilibrium are contested states of the same capture arc") — while the producer defines `adversarial` as "criminal is present but enforcement is winning" (`factionDynamics.js:267-268`). So the organ is marked INTERESTED on a rung where no power holds it. (b) The `corrupt` (compromised lists) and `controlled` (patron) arms of `standingOf` (`:644-645`, `:664-666`) are dead in the product: the only caller of `sourceOfForTown`/`standingOf` outside the module is `scripts/taste-holders.mjs:54, :102`, both passing `{}`. In every product path INTERESTED can arise only from `impairments[].type === 'corruption'` (`:656`) or `capturedAtBirth` (`:685-696`). |
| POWER (per institution) — a `corruption` impairment on a SECURITY body; `covert !== true` ⇒ scandal, else hidden | **CONDITIONAL** | true for the impairment path, but incomplete: the covert set ALSO fills from an unexposed corrupt NPC — `for (const npc of settlement?.npcs) { if (npc?.corrupt !== true || npc?.ousted) continue; const home = npcHomeInstitution(npc); … if (match && !revealed.has(match.name)) covert.add(match.name); }` (`corruption.js:683-689`), where `npcHomeInstitution` reads `npc?.factionAffiliation || npc?.factionLink || npc?.institutionId` (`:651`) and `nameMatches` is a substring test (`:640-645`). And the regex tests the RAW `inst.name` (`:665`) while the buckets test `nativeSemanticName`, which returns `''` for materialized custom content (`customContentSemanticAuthority.js:41-42`): a custom "Night Watch" is a SECURITY body that sits in NO bucket. |
| POWER (patron) — `genesis`/`captured`, audience projection | HOLDS | `brokeragePatronage.js:60`, `:287-297`; `covert: house.legality === 'illegal'` (`:296`); the player projection writes `patronName: 'unknown'` (`:327`), not a blank |
| POWER (the name) — a faction is a NAME, `governingName` is a `proper` string | HOLDS, with an addition the law must carry | the typed slot can render a BODY or OFFICE word, because faction NAMES contain them: `faction: 'Military/Guard'` (`rulingStructure.js:596`), `"Thieves' Guild"` (`:671`), `'War Council'`, `'Occupation Authority'`, `'Investigation Faction'`, `'Conversion Enforcement Office'`, `'Revolt Leadership'`, `'Quarantine Council'` (`stressFactions.js:21, :43, :96, :148, :337, :380`); `properFill('Military/Guard')` returns the string (probe). The engine itself reads the military by the substring `guard` in a faction name (`factionDynamics.js:233`). |
| ROLE — `officesOf` = NPC `role` + `title` nouns + the seat's designation; OPEN by law | HOLDS | `institutionTable.js:377-398`, `:210-216` |
| PERSON — never a referent; "`holderRole` is a hardcoded null … no typed NPC→institution edge exists anywhere in the estate" | **REFUTED as a measured absence; the RULE can still be ratified** | a typed NPC→institution edge EXISTS: `linkedInstitutionIds` is a schema field (`settlement.schema.js:459`), written by the generator — `const linkedInst = def.linkToInst ? institutions.find(inst => def.linkToInst.test(nativeSemanticName(inst).toLowerCase())) : null; … linkedInstitutionIds: linkedInstId ? [linkedInstId] : []` (`factionRoles.js:215-233`; `role: 'Watch Captain', linkToInst: /watch|garrison|barracks|militia/` at `:45`; `'Lord Mayor' … /council|court|government|…halls?/` at `:56`) and by `magicFormsPractitioner.js:216`; read by `events/batch.js:149`, `magicFormsPractitioner.js:125`, `SuccessorPrompt.jsx:56`. `holderRole: null` (`institutionTable.js:457`) is the table's CHOICE not to read it; the honest sentence is "the institution table reads no NPC→institution edge", not "none exists". The law's conclusion (a person is never a referent; the office is named, never the officer) is a rule the chair may ratify on product-scope grounds; it is not an engine measurement. |

---

## §3 THE NOUN ROWS (survey §4.1) — VERDICTS

| Noun | Verdict | Evidence / condition |
|---|---|---|
| **the watch** — layers BODY/HOLDER/POWER; desk reads → 4 rows (watch · court+watch); "the guard" as the safe body word; "the muster" as the class word and the watch not in it | layers HOLDS · reads HOLDS · **safe word CONDITIONAL** | bucket `:95-97`, kind `:78`, organ `:115`, records `:318-323`, `SECURITY_INSTITUTION_RE` `corruption.js:630`; census: the 4 rows resolve `watch`/`court + watch` (probe). BUT "the guard" is not a body word only: `'Military/Guard'` is a FACTION name (`rulingStructure.js:596`), `guard` is a MILITARY ROLE keyword (`roleCategory.js:38`), and 'Guard Captain' is a mandated NPC role (`npcGenerator.js:1514-1516, :1522, :1536`). "The guard" is safe as a body word only where the sentence's read is a body read AND `{counterpart}`/`{faction}` does not render 'Military/Guard' beside it. The count "the watch (5)" HOLDS (five noun uses); the desk ALSO uses **watch as a verb** three times ("what the {seat} … watches for", DS-POW-5 `council` v3 and two others) — the same reverse alias trap the survey rows for `muster` (O-9) and did not row for `watch`. |
| **the hall** — 50 occurrences, zero reads; `Town hall`/`City hall` are office-kind holders; civic class `hall` | HOLDS | leaf probe: 50 (46 "the hall" + 4 other forms); `institutionServices.js:1623, :1629`; `holderTable.js:357-362`; `wiringCensus.js:1314` |
| **the walls** — 4 occurrences; `walls` token → muster kind; `Gates (if walled)` in walls bucket and toll-bar holder | HOLDS | leaf 4 (DS-POW-2 siege v1, v4; DS-POW-6 neutral v1; DS-POW-7 glue threat v1); `holderTable.js:188`; roster probe: toll-bar holders = Town council · Major Port · Gates (if walled) |
| **the gates** — walls bucket + toll-bar | HOLDS | as above; leaf: DS-POW-2 siege v2, DS-POW-6 duty evasion v2 |
| **the granary** — `City granaries`; class `storehouse`; withdrawn holder row | claim HOLDS · cite REFUTED | `institutionServices.js:839` (not :838); also `Town granary` `:1429`, `State granary complex` `:1472` are roster rows the survey did not list; `holderTable.js:157-159`; `wiringCensus.js:1321` |
| **the customs** — `Customs house` body; toll-bar holder | HOLDS | `:530`; `holderTable.js:305` (`Customs brokerage`) |
| **the market** — many roster rows; `market` kind (holder = Market square); operation-role pools read `name` | HOLDS, one overlap missed | roster probe: market-kind holder = `Market square` only; BUT `Weekly market` is a **TREASURY** holder (roster probe; `holderTable.js:277` lists it) — a market-word institution keeps the treasury's record, unrowed |
| **the court** — `court` kind, state organ, SECURITY match; 12 of 14 LICENSED rows; the assembly sense untyped | HOLDS | census: court 10 + court+watch 2 = 12; `corruption.js:630`; `DS-POW-7 :: consolidation 0 … divided court` objectClass `law` (probe) |
| **the council** — roster rows; `RULING_POWERS` value; fourteen governingName values; civic class `hall`; DS-POW-5 `council` census-unresolved | HOLDS, one layer missed | census `DS-POW-5 :: council` reads `[]` SOURCE-UNRESOLVED (probe). ADD: `council` is also a GOVERNMENT ROLE keyword (`roleCategory.js:33-34`) and `'Council Member'` is a mandated NPC role (`npcGenerator.js:1525, :1530, :1534`) — a fifth register (ROLE) for the word |
| **the workshops** — dark by declaration | HOLDS | `powerStateProse.js:668-678`; census `economicBase:*` reads `[]` |
| **the tables** — `Gambling halls` | HOLDS | `:941`; leaf DS-POW-6 unlicensed revenue v3 |
| **the clearinghouse** — no engine row anywhere | HOLDS | `grep -ci clearinghouse institutionServices.js` = 0; no bucket keyword, no civic class member |
| **the temple / `{institution}`** — one variant, never filled | HOLDS | census `DS-POW-5 :: theocracy` `slotsWithoutProvider: ["institution"]` (probe); `powerStateProse.js:696-701` |
| **the prison / the gaol** — roster rows, class `law`, not rendered | HOLDS; one role missed | `:1635, :1640`; `wiringCensus.js:1311`. ADD: `'Prison Warden'` is an emitted power role (`historyData.js:148`, reached through `getUpgradeOpportunities` → `npcGenerator.js:1465`) |
| **the guard** — "zero occurrences"; the safe BODY word for the garrison bucket | **REFUTED** on both halves | (1) the leaf carries `guards` as a verb: "fights in a limited way and guards its supply" (DS-POW-5 `economicBase: craft` v3 — a dark pool, but a shipped byte); (2) `guard` is a faction name, a role keyword and a mandated role name (see the watch row) — it is a body word ONLY under a body read, which this desk has none of |
| **the muster** — holder-organ only; one holder (Citizen militia); the verb on DS-POW-4 | HOLDS | `holderTable.js:280-288`; roster probe: muster holder = `Citizen militia`; leaf DS-POW-4 `neither helps nor hurts` v1 "what {faction} can muster for itself" |
| **the rolls · records · accounts · books · returns · manifests · minutes** — holder-layer surfaces; `ledger` withdrawn | HOLDS | `holderTable.js:159-161`, `:361-363`; leaf counts roll 8 · record 7 · account 6 · return 2 · book 2 · manifest 1 · minute 1 (probe) |
| **the houses / a house** — a faction is a recorded NAME; `factionStates` entry; brokerage/bank overlap | HOLDS, with a hole | leaf 21 (houses 4 + house forms); `rulingStructure.js:781, :787`; `settlementPolitics.js:246-258`. HOLE: `{counterpart}` = `challengers[0].name` and the challenger filter is only `c.archetype !== A.CRIMINAL && c.power >= MIN_CONTENDER_POWER && c.name` with `MIN_CONTENDER_POWER = 5` (`rulingPowerCoup.js:51, :104`), so the stress faction `'Unknown Faction (hidden)'` (power 15, `stressFactions.js:105-107`, "Its presence is not known to the settlement") can be seated in `{counterpart}` on DS-POW-4 `Contested`/`Critical` faces that carry no dm-only mark (leaf probe: DS-POW-4 has 0 dm-only); `properFill` does not reject `(hidden)` (`powerStateProse.js:178-186`). CONDITION: the `infiltrated` stress is present and that faction is the top non-criminal challenger by weight. |
| **the combination / the bloc / the majority** — the `Bloc` typedef; patronage glue people-held | HOLDS | `settlementPolitics.js:63-67`, `:451-455`, `:792-803` |
| **the criminal interest / the operator** — "the ladder names no faction and no person"; "none typed — the criminal party is never named by a slot" | **CONDITIONAL** | the ladder's OUTPUT names nobody (HOLDS), but the criminal party IS a typed, named faction: `const isCrim = f => f.category === 'criminal' || f.faction?.toLowerCase().includes('thiev'); const crim = factions.find(f => !f.isGoverning && isCrim(f));` (`factionDynamics.js:221-222`), born as `faction: "Thieves' Guild"` (`rulingStructure.js:671`), with typed roles `'Kingpin'`, `'Lieutenant'` (`factionRoles.js:52-53`). No slot of THIS desk carries the name (HOLDS); the engine records it (the survey's "none typed" overstates). |

---

## §4 THE ROLE ROWS (survey §4.2) — VERDICTS

The survey's ground for several rows is "no typed row: a clerk is neither a roster institution nor a holder kind". That test is the wrong instrument for the ROLE layer: `officesOf` folds every NPC `role` string (`institutionTable.js:380-386`), and the generator EMITS roles from three tables — `TIER_MANDATORY_ROLES` / `STRESS_MANDATORY_ROLES` (`npcGenerator.js:1510-1537`: Elder · Mayor · Guard Captain · High Priest · Governor · City Watch Chief · Council Member · Chief Magistrate · Corrupt Official · Garrison Commander · Moneylender · Healer · Guild Master …), the structural roster (`factionRoles.js:42-59`: High Priestess · Watch Captain · Guildmaster · Senior Trader · Kingpin · Lieutenant · Lord Mayor · Archmagister) and `POWER_ROLES_BY_CATEGORY` (`historyData.js:15-192`: Mayor · Lord · Governor · Grand Chancellor · Master of Coin · Spymaster · Council Member · Tax Collector · Chief Magistrate · City Clerk · Harbor Master · Reeve · Herald · Notary/Scrivener · Customs Inspector · Prison Warden · Alderman …, reached via `getUpgradeOpportunities` at `npcGenerator.js:1465`).

| Role word | Verdict | Evidence / condition |
|---|---|---|
| **the clerks** — "no typed row"; PERSON doing an act | **CONDITIONAL** | `'City Clerk'` is an emitted role (`historyData.js:103` → `npcGenerator.js:1465`), so at the ROLE layer the word has an engine row on towns where that upgrade lands; the ACT charge (record · name · chase) stands under law 1 regardless |
| **the officials** — PERSON with a disposition | **CONDITIONAL** | `'Corrupt Official'` is a mandated role under `occupied` and `insurgency` (`npcGenerator.js:1524, :1532`) and `official` is a government role keyword (`roleCategory.js:35`). NOTE for law 4: this role NAME bakes a corruption STANDING into a public roster string — the engine names a corrupt officer openly where the law says the office is named and never the officer |
| **a ruler / its rulers** — ROLE as a standing condition; the maxim frame | HOLDS | leaf 7; `officesOf` seat fold `:395-397` |
| **an operator** — "the criminal side has no typed person" | **CONDITIONAL** | typed criminal roles exist (`'Kingpin'`, `'Lieutenant'`, `factionRoles.js:52-53`); the DESK reads none (HOLDS) |
| **a leader** — `leaderNpcId`/`leaderName` typed, unread by the desk | HOLDS | `settlementPolitics.js:252-253`; census DS-POW-7 `receipt fractured` reads `[]` |
| **the person who speaks for {faction}** — a ROLE off a settlement-wide rung | HOLDS | `capturePoolKey` `:436-440`; `computeCriminalCaptureState` `:220-273` names no seat |
| **the incumbent / the challenger** — a caller READING; `{counterpart}` carries a recorded name | HOLDS; shape verified | `rulingPowerCoup.js:77-79` (`challengers: Array<{name, archetype, power, weight}>`, `incumbent: {name, power, govMultiplier, amplifiedWeight, gated}`), `:87-104`; handed in at `PowerTab.jsx:198-201` |
| **`{npc}`** — the desk's one person-named slot | HOLDS; one carrier missed | `ladderRead.js:95-107`; filled `:639`. The draw is gated at the CALLER: `const drawn = publicDossier ? null : drawnAtMount(LADDER_MOUNT, powerLadderRung(s, { factionName: f.faction, rungs, instability: instab }, { seed: …, audience }))` (`PowerTab.jsx:477-480`) — a visibility carrier outside the marks (see §7) |
| **the reeve · the headman · the mayor · the priest** inside `{seat}` | HOLDS; ROLE emission missed | `rulingStructure.js:164, :259-260, :284`. ADD: `'Reeve'` (`historyData.js:119`) and `'Mayor'` (`npcGenerator.js:1514-1516`; `historyData.js:21`) are emitted NPC ROLES, so `officesOf` can hold "Mayor" and "Reeve" as offices beside a `{seat}` of `Town Mayor` / `Elected Reeve` — the same word at ROLE and at the seat |
| **elder** — an angle tag, a holder kind, three roster rows | HOLDS; ROLE emission missed | `holderTable.js:332-337`; ADD `'Elder'` is the thorp/hamlet mandated role (`npcGenerator.js:1512-1513`) and `elder` a government role keyword (`roleCategory.js:33`) — four registers |
| **the captain · the factor** — "zero occurrences … captain matches no roster row and no holder kind … not part of this desk's vocabulary" | **REFUTED** (the engine emits it) | the leaf count is zero (HOLDS), but the ROLE layer's vocabulary is `officesOf`'s, and the engine emits `'Guard Captain'` (`npcGenerator.js:1514-1516, :1522, :1536`), `'Watch Captain'` with a typed institution link (`factionRoles.js:45`, `:215-233`), `'City Watch Chief'` (`:1517`), `'Garrison Commander'` (`:1522, :1533, :1535`); `captain` is a MILITARY role keyword (`roleCategory.js:38`). ADDENDUM 11's specimen "the captain" is an engine role word; "the factor" is not (no emission found) |
| **somebody · nobody · anybody · everybody · a stranger · people** | HOLDS | leaf: a stranger 29 · nobody 16 · somebody 11 · everybody 8 · anybody 4 · the people 4 (probe) |

---

## §5 THE TYPED SLOTS (survey §5) — VERDICTS

| Slot | Verdict | Evidence / condition |
|---|---|---|
| `{settlement}` | HOLDS | `:858`, `properFill` `:178-186` |
| `{seat}` = `governingName`; class untagged (body / office / role) | HOLDS | `:860`, `:875`; `rulingStructure.js:787`; the label map `:161-177`, `:259-260`, `:284` |
| `{faction}` = the same `governingName` in DS-POW-2/-4/-6/-7 | HOLDS | `stabilitySlots` `:876`; `:909`, `:953`, `:962` |
| `{counterpart}` = `challengers[0].name`, "a rival faction's recorded name" | **CONDITIONAL** | true, and the name can be `'Military/Guard'` (a garrison body word inside a POWER slot), `'War Council'`, `'Conversion Enforcement Office'`, or `'Unknown Faction (hidden)'` (a covert power on a player face) — `rulingPowerCoup.js:87-104`; `stressFactions.js:105`; the `proper` slot type carries no visibility and no class |
| `{npc}` | HOLDS | `:639`; `ladderRead.js:95-107` |
| `{institution}`, `{route}`, `{good}` — no provider | HOLDS | census `slotsWithoutProvider` (probe) |
| the ruling structure as a CLASS — `RULING_POWERS`, total, fail-soft `mixed` | HOLDS | `cohesionWeave.js:133`, `:171-177`, `:194-197` |
| the patron — read by no pool | HOLDS | census reads (probe); `brokeragePatronage.js:287-297` |
| `SLOT_FILL_TABLES = {}` | HOLDS | `:162` |

---

## §6 THE OVERLAPS (survey §6) — VERDICTS, AND THE OVERLAPS MISSED

| # | Verdict | Note |
|---|---|---|
| O-1 professional city watch in garrison AND watch | HOLDS | `:90`, `:96`; roster probe: garrison = Garrison · Multiple garrisons · Professional city watch · Barracks; watch = Professional city watch · Town watch |
| O-2 watch = bucket AND holder kind (state organ) | HOLDS | `holderTable.js:202-209` |
| O-3 court = kind AND assembly AND class `law` | HOLDS | |
| O-4 council four registers | HOLDS, incomplete | a FIFTH: a ROLE keyword and role name (§4) |
| O-5 Town council = elders + toll-bar; dedupe on the pair | claim HOLDS · cite REFUTED | roster probe confirms both; dedupe at `holderTable.js:730-744` |
| O-6 reeve = row + treasury holder + governingName + role | HOLDS | roster probe: treasury holders include `Village reeve`; ADD `'Reeve'` as an emitted NPC role (`historyData.js:119`) |
| O-7 Town hall / City hall = office + treasury | HOLDS | roster probe: treasury holders include `Town hall`; office = City administration · Town hall · City hall |
| O-8 four state organs vs the security bodies; 8 regex matches, four are this desk's holders | HOLDS, one gap unflagged | roster probe: Courthouse · Garrison · Multiple court buildings · Multiple garrisons · Professional city watch · Town watch · Barracks · Watchtower. **`Watchtower` matches `SECURITY_INSTITUTION_RE` but sits in NO defence bucket and keeps NO holder kind** — a security body the corruption model can buy that neither the body layer nor the organ layer can name |
| O-9 muster noun vs verb | HOLDS | and the same for `watch` (3 verb uses) and `guard` (1) — unrowed |
| O-10 the civic classifier cuts across the holder table | HOLDS | census objectClass: `end patron` → temple; `a fully divided court` → law; `the seat could fall` → hall; `merchant_league`/`trade_hub`/`end commerce`/`stolen goods market` → market; `craft` → craft; `council` → hall (probe) |
| O-11 muster kind has one holder | HOLDS | roster probe |
| O-12 tradition has none | HOLDS | `holderTable.js:338-347` |

### ADDED OVERLAPS (the surveyor missed; each is a wiring fact for the register car)

| # | Overlap | Evidence |
|---|---|---|
| A-1 | **A typed NPC→institution edge exists**: `npc.linkedInstitutionIds` (schema `settlement.schema.js:459`; written `factionRoles.js:215-233` for `Watch Captain` → `/watch|garrison|barracks|militia/`, `Lord Mayor` → `/council|court|government|…halls?/`, `High Priestess`, `Guildmaster`, `Archmagister`; read `events/batch.js:149`, `magicFormsPractitioner.js:125`). The institution table's `holderRole: null` is a refusal to read it, not an absence | refutes the PERSON row's ground (§2) |
| A-2 | **`guard` is a body word, a faction name, a role keyword and a role name at once**: garrison bucket `:89`; `faction: 'Military/Guard'` `rulingStructure.js:596`; `factionDynamics.js:233` reads the military by the substring; `roleCategory.js:38`; `'Guard Captain'` `npcGenerator.js:1514` | the survey's "always-safe" body word for the garrison bucket is a POWER name on the same page |
| A-3 | **Faction NAMES carry office/body class words**: 'War Council', 'Quarantine Council', 'Occupation Authority', 'Investigation Faction', 'Conversion Enforcement Office', 'Revolt Leadership' (`stressFactions.js:21, :43, :96, :148, :337, :380`); "Thieves' Guild" (`rulingStructure.js:671`) | a `proper` slot renders "office", "council", "authority" as a POWER name |
| A-4 | **`office` is five things**: a HOLDER KIND (`holderTable.js:80`), a register STANDING (`SOURCE_STANDINGS` 'OFFICE' `:87`), a civic-class member of `hall` (`wiringCensus.js:1314`), the seat-as-office in the desk's own prose (DS-POW-4 `Contested` v1, `Critical` v1; DS-POW-7 `end seats` v1, `end doctrine` v1 — 5 uses, unrowed), and a faction-name word (A-3) | the survey rows "the office" nowhere (§10) |
| A-5 | **`Village headman`** keeps the treasury AND the elders records (roster probe), is a `governingName` source (`"Headman's Authority"` `rulingStructure.js:259`) and a role word | one institution, two kinds, a seat and a role |
| A-6 | **`Weekly market`** is a TREASURY holder (`Tax …` services; `holderTable.js:277`), while `market` is its own kind with `Market square` as holder | a market-word institution keeps the coin's record |
| A-7 | **`City administration`** keeps the treasury AND the office records | two kinds, one row |
| A-8 | **`Watchtower`**: SECURITY body, no bucket, no holder kind | see O-8 |
| A-9 | **The birth-time INTERESTED standing fires at `adversarial`** (`holderTable.js:141`) where the ladder's producer says enforcement is winning (`factionDynamics.js:267-268`); the world-run `captured` arm fires only at corrupted/capture (`:661`) | two definitions of "captured" inside one function |
| A-10 | **The holder standing ignores the covert flag**: `impairments.some((imp) => String(imp?.type || '') === 'corruption')` (`holderTable.js:656`) marks `corruption-impaired` covert or not, while `corruption.js:677-680` splits revealed from covert | law 4's split is not carried by the instrument that prints INTERESTED |
| A-11 | **Two name authorities**: buckets and `linkToInst` test `nativeSemanticName` (`''` for materialized custom content, `customContentSemanticAuthority.js:41-42`); `SECURITY_INSTITUTION_RE` and `nameMatches` test raw `inst.name` (`corruption.js:665, :686`) | a custom-content watch is a security body in no bucket |
| A-12 | **`'Corrupt Official'` is a role NAME that bakes a standing** (`npcGenerator.js:1524, :1532`) | the roster names the corrupt officer openly |
| A-13 | **`watch` and `guard` as verbs** in the leaf (3 + 1) beside the noun uses | the O-9 trap generalised |
| A-14 | **The criminal party is a typed, named faction** (`factionDynamics.js:221-222`; `rulingStructure.js:671`) with typed roles (`factionRoles.js:52-53`); no slot of this desk carries it | the survey's "none typed" overstates |
| A-15 | **A hidden faction can be seated in `{counterpart}` on a player face** (`stressFactions.js:105-107`; `rulingPowerCoup.js:51, :104`; DS-POW-4 carries 0 dm-only marks) | a covert POWER named through a typed slot |

---

## §7 VISIBILITY (survey §7) — VERDICTS

| Survey row | Verdict | Evidence / condition |
|---|---|---|
| `criminalCaptureState` carries no covert flag; the ANNEX decides via dm-only marks | HOLDS · cite REFUTED | the fence is `RECEIPT_POOLS…:2293-2295`; leaf probe: DS-POW-6 carries 12 dm-only (the six rank variants + six direction variants) |
| capture DIRECTION narratable, all 6 variants dm-only | HOLDS | `:2292-2293`; leaf |
| `factions[].captureState` read by no pool | HOLDS | census reads (probe) |
| a corruption impairment: revealed ⇒ both faces, covert ⇒ DM only; read by no shipped pool of any desk | **CONDITIONAL** | the split HOLDS for the impairment path; the covert set also fills from a corrupt unexposed NPC (`corruption.js:683-689`) — a PERSON-sourced covert mark on an institution; "no shipped pool of any desk" HOLDS on the census (`covert: true` on 4 rows, all `DS-WAR-1 :: mobilization: …`, probe) |
| brokerage patron projection blanks `patronName` unless exposed | HOLDS (it writes `'unknown'`, `:327`) | |
| `blocs.covert` typed; the desk reads `politics.blocs` and never `blocs.covert`; JS reads `b?.covert` | HOLDS · cite REFUTED | `powerStateProse.js:800` (not :809); census `covert` false on 79/79 (probe) |
| the plain fields — both faces; 1 dm-only on DS-POW-1 | HOLDS | leaf: DS-POW-1 dm-only = 1 |
| **THE MEASURED GAP / Q-7: "draft law 4 currently has no mechanical carrier on this desk"; visibility "lives entirely in the annex's dm-only variant marks"** | **REFUTED** | the desk has THREE mechanical carriers, all at the CALLER and none in the census: (1) `const audience = playerView ? 'player' : 'dm'` (`PowerTab.jsx:194`) gates the dm-only marks; (2) `publicDossier` nulls the WHOLE desk before any mark matters — `const contenders = publicDossier ? null : coupContenders(s); const deskReadings = publicDossier ? {} : {…}` (`:198-200`), `const deskProse = publicDossier …` (`:215`), and DS-POW-3 at `:477`; (3) DS-POW-7's projection honours the secrets filter — "`includeCovert` honours the projection's own secrets filter — a conspiracy does not enter a player's projection at all" (`:203-206`). The survey's finding that the CENSUS carries none of this (covert=false on 79/79) HOLDS; the conclusion that NOTHING carries it does not. |

---

## §8 THE FINDINGS (survey §8) — VERDICTS

Every quote in §8.1-§8.5 was located in the leaf by the context probe; the layer charges are read against the census reads.

| # | Verdict | Note |
|---|---|---|
| R-1a the watch on `Endorsed` v4 (no read) | HOLDS | census `DS-POW-1 :: Endorsed` reads `[]` |
| R-1b gates · watch rota · besieged on `siege matched` v2 (`power.stability`, court) | HOLDS | |
| R-1c harvest · watch · walls on `neutral baseline` v1 | HOLDS | |
| R-1d "a working watch" as AGENT on `capture RECOVERING` v2 (court + watch, dm-only) | HOLDS | the one place the desk puts the WATCH BODY on the watch ORGAN's own record — law 3's fused-agent case in the survey's own words |
| R-1e the watch on `stolen goods market` v2 (`name`) | HOLDS | census reads `[]` for that pool (the survey says `name`; the census attributes `name` only to the `(unclassified)` pool — the charge stands either way) |
| R-1f the granary on `FOOD, adverse` v1 | HOLDS | |
| R-1g the hall, 50 | HOLDS | |
| R-1h the customs on `duty evasion` | HOLDS | |
| R-1i the clearinghouse | HOLDS | |
| R-1j "A council falls to unrest" on `council` v3 | HOLDS | |
| R-4a-c the clerks | HOLDS as an ACT charge; the "no typed row" ground is CONDITIONAL (§4) | |
| R-4d the officials | HOLDS; ground CONDITIONAL (§4) | |
| R-4e the person who speaks for {faction} | HOLDS | |
| R-4f an operator | HOLDS; ground CONDITIONAL (§4) | |
| R-4g a leader (unread typed field) | HOLDS | |
| R-4h a ruler as maxim | HOLDS | |
| R-5a-d fused agents | HOLDS | R-5d's ground (R-2) verified at `:860`, `:953` |
| §8.4 the rank claim reads no seat rank | HOLDS | `factionCapture.js:93-100` (`st.dotRank || seat.dotRank`); `corruption.js:491-496` |
| R-2 `{seat}` and `{faction}` from one string | HOLDS | `:860`, `:875-876`, `:909`, `:953`, `:962`; DS-POW-2 leaves `{seat}` unfilled `:862-876` |
| R-3 DS-POW-6's `{faction}` documented as the captured house, filled with the governing body | claim HOLDS · cite REFUTED | the comment is `:900-901`; the fill `:962` |
| R-6 `governanceFractured` coextensive with the crisis band; the annex fence says the opposite | HOLDS | `factionDynamics.js:132-133`; `powerStateProse.js:53-55`; annex `:1928-1930` |
| §1 "66 of 256 variants carry at least one body word" | CONDITIONAL on the word list | on the list hall · watch · wall · gate · granary · customs · market · clearinghouse · workshop · council · court · table · guard · garrison · militia with the definite article, the probe reads **55**; the survey's list is not printed, so 66 cannot be reproduced |

---

## §9 INSTRUMENT AND WIRING (survey §9) — VERDICTS

| # | Verdict | Evidence |
|---|---|---|
| W-1 DS-POW-1's card prints the wrong bag (`resolveBag` first-match) | **CONFIRMED by execution** | `node scripts/prose-licence-card.mjs DS-POW-1 'governanceFractured true'` printed `FILLED at this block's call sites: {faction} {npc} {settlement} · NAMED BUT NEVER FILLED: {seat}`; `const slots =` at `:634` (DS-POW-3's bag) and `:875` (DS-POW-1's); `resolveBag` uses `new RegExp(\`\\bconst\\s+${name}\\s*=\`).exec(src)` (`dossierComposedFill.js:141`) |
| W-2 DS-POW-5 `autocrat` resolved against `politicsPresencePoolKey` | HOLDS · cite REFUTED | census `keyFunction: politicsPresencePoolKey`, `reads: ["politics.blocs"]`, `source: LICENSED/court` (probe); the literal is `:801` (not :810); `rulingPowerPoolKey` `:709-713` has no literal |
| W-3 the desk reads no institution row | HOLDS | |
| W-4 the corruption impairment is read by no shipped pool | HOLDS | census; the only product reader of `impairments[].type === 'corruption'` on the prose side is `holderTable.js:656`, reached only from `scripts/taste-holders.mjs` |
| W-5 `blocs.covert` unread by the census | HOLDS | |
| W-6 the patron has no prose consumer; `end patron` from `ARCHETYPE_END` | HOLDS | `settlementPolitics.js:461-465` (`criminal: 'patron', outsider: 'patron'`) |
| W-7 the bloc ROLE layer typed and unread; 18 of 20 WIRING-UNRESOLVED | HOLDS | census: 18 DS-POW-7 rows read `[]` (probe) |
| W-8 one string, no hall-name producer | HOLDS | |
| W-9 coextensive predicates | HOLDS | |
| W-10 three mis-files | HOLDS | census objectClass (probe) |
| W-11 the economicBase pools dark; three slots unprovided | HOLDS | |
| W-12 rank split reads no seat rank | HOLDS | |
| W-13 muster has one holder, tradition none | HOLDS | |
| card `covert: no` on all 79; `source:` the one layer signal; `audience: player (no mark) · marks in this pool: dm-only` | HOLDS | the DS-POW-6 `capture reached a LEADER` card printed exactly that |
| Q-1..Q-6 (questions raised) | open — not verdicts | Q-4 gets an engine answer above: "the captain" IS an emitted role word (`Guard Captain`, `Watch Captain`); "the reeve" is emitted too (`historyData.js:119`) |
| Q-7 | REFUTED (§7) | |

---

## §10 MISSED NOUNS AND ROLE WORDS (institution-class nouns or role words of this desk the survey did not row)

| Word | Where | Layer(s) the engine gives it |
|---|---|---|
| **the office** (5 uses: DS-POW-4 `Contested` v1 "the office rather than the strength"; `Critical` v1 "the {seat} has the office"; DS-POW-7 `end seats` v1 "wants is office"; `end doctrine` v1 "spend office") | leaf | HOLDER KIND `office` (`holderTable.js:80`) · the 'OFFICE' STANDING (`:87`) · civic class `hall` (`wiringCensus.js:1314`) · the seat-as-office (ROLE/POWER) · a faction-name word ('Conversion Enforcement Office'). The desk's most layer-loaded unrowed noun |
| **the writ** (DS-POW-1 `Endorsed` v3, `Contested` v2 "the {seat}'s writ") | leaf | a court/office INSTRUMENT surface, like the rolls (R-vi class); no engine row |
| **an army** (DS-POW-5 `trade_hub` v3, `agrarian` v3 — dark pools) | leaf | civic class `force`-adjacent; the muster kind's class; no bucket keyword |
| **the harvest** (5 uses) | leaf | civic class `store` (`wiringCensus.js:1309` lists `harvest`) — a STOCK word on a legitimacy/lens read |
| **the government / the governing body** (DS-POW-1 `governanceFractured` v3; DS-POW-4 `previousGovernments` v3) | leaf | `powerStructure.government` (`rulingStructure.js:792`) — a typed field equal to `governingName` at birth; the survey rows it only inside R-6 |
| **watch (verb)** ×3, **guard (verb)** ×1 | leaf | the O-9 reverse trap, unrowed for these two |
| **Guard Captain · Watch Captain · City Watch Chief · Garrison Commander** | engine roles (`npcGenerator.js:1514-1536`; `factionRoles.js:45`) | ROLE, with a typed institution link (`linkedInstitutionIds`) |
| **Corrupt Official** | engine role (`npcGenerator.js:1524, :1532`) | ROLE with a baked standing |
| **Council Member · Chief Magistrate · Governor · Alderman · Tax Collector · City Clerk · Customs Inspector · Prison Warden · Notary · Herald · Reeve · Mayor · Elder** | engine roles (`npcGenerator.js:1510-1537`; `historyData.js:15-192` via `:1465`) | ROLE (the survey's role table names none of these as engine emissions) |
| **Kingpin · Lieutenant** | `factionRoles.js:52-53` | the criminal ROLE words the desk's "an operator" stands in for |
| **Watchtower** | roster | SECURITY body (`corruption.js:630`), no bucket, no holder |
| **Town granary · State granary complex** | roster `:1429`, `:1472` | `storehouse` bodies beside `City granaries` |
| **Military/Guard · Thieves' Guild · War Council · Occupation Authority · Unknown Faction (hidden)** | faction NAMES | POWER-layer names that carry body/office class words or a covert standing |

---

## §11 THE VERDICT ROLL

Counted over the survey's rowed claims (§2 14 · §4.1 20 · §4.2 12 · §5 9 · §6 12 · §7 8 · §8 24 · §9 15 = 114 verdicts): **HOLDS 93 · CONDITIONAL 12 · REFUTED 9** (five of the nine are cite-only refutations where the claim itself holds; four are substantive: the PERSON row's "no typed NPC→institution edge exists", the guard row, the captain row, and Q-7/the measured gap).

THE FOUR SUBSTANTIVE REFUTATIONS, for the chair:
1. **A typed NPC→institution edge exists** (`linkedInstitutionIds`, `factionRoles.js:215-233`; schema `:459`). The law may still say a person is never a referent, but as a product-scope RULE, not as "a measured null"; the addendum's and the holder table's sentence should read "the institution table reads no such edge".
2. **"The guard" is not an always-safe body word**: it is a faction name the engine itself reads as the military (`rulingStructure.js:596`; `factionDynamics.js:233`), a role keyword and a mandated role name. Same word, three layers, on one page.
3. **The engine emits "the captain"** (`Guard Captain`, `Watch Captain`, `City Watch Chief`, `Garrison Commander`) and "the reeve", "the mayor", "the elder", "the clerk" (`City Clerk`), "the official" (`Corrupt Official`) as ROLE words through `officesOf`. The survey's role verdicts were tested against the roster and the holder kinds, which is the BODY/HOLDER instrument, not the ROLE one.
4. **Law 4 has mechanical carriers on this desk** — at the caller (`PowerTab.jsx:194, :198-215, :477`; the DS-POW-7 secrets filter), none of them visible to the census. The wiring row is "the visibility carriers are caller-side and uncensused", not "there are none".

THE TWO CONDITIONS THE LAW MUST WRITE DOWN:
- The INTERESTED standing at birth fires on `adversarial` (`holderTable.js:141`), a rung whose producer says enforcement is winning; an ORGAN-UNDER-POWER read on that rung asserts a power the engine denies.
- A `proper` slot carries neither class nor visibility: `{counterpart}` can render `'Military/Guard'` (a body word as a power) or `'Unknown Faction (hidden)'` (a covert power on a player face).

*Packet written by the power-desk referent refuter, seat Fable 5.1, from `laneRW-DEFW` at `f2da5a3ee`. Nothing in the dock was modified, staged or committed; no vitest, no build.*
