# SEAT-1 — THE PROPOSAL (train 1: who holds the seat, who contests it)

Written 2026-11-20T05:33Z (read from `date -u` in the command that wrote it), on `lane/seat-2026-11-20`, cut from `origin/lane/join-2026-11-14` at **`85fccf898`** and fast-forwarded onto the measure (`origin/lane/seat-measure-2026-11-20` at `14db733e7`, docs only). Nothing under `src/` or `tests/` is written until the chair sends "BUILD".

**Instruments** (beside this file; every figure below is in an output file named with it):
- `seat-draft.mjs`: my measurement draft of CS2 (`holderOf`), CS4 (`contestKindOf`, `formKindOf`), CS5 (`CIRCUMSTANCES`, `CIRCUMSTANCE_FACTORS`) and CS6 (`SEAT_TABLE`, `pairLicense`). An instrument, not the build: builders write their own leaves, red first.
- `measure-holder.mjs --arm default|presets` → `holder-default.{md,json}` (900 towns), `holder-presets.{md,json}` (960 towns). Same seeds and configs as `measure-seat.mjs`, through `birthConfig` (today's births). **The BEFORE column is re-spelled and checked against the shipped `coupContenders` town by town: 0 mismatches on both pools.** 0 generation errors.
- `sim/` (the coup-rate soak, item 3; brief `briefs/SIM-MEASURE.md`).

CONFIRMED = executed here. READ = read in the code by symbol, not executed.

## (1) The holder leaf: its order, and the towns each rule answers (CONFIRMED)

The order is the chair's CS2, unchanged: **R1** the taker of the last transfer; **R2** the power whose first member is the seat-holder (`liveSeatCandidatesOf(s)[0]`, membership rank 1); **R3** for a seat of a kind (its form's kind through the one table), the leading open power of that kind (`!isVeiledPower`, by power, then name); **R4** the office holds itself; **R5** a government in `APPOINTED_GOVERNMENTS`, the one who appoints, named only as the record names it (the record names none at birth, so R5 answers "appointed", no name).

| rule | default (900) | presets (960) |
|---|---|---|
| R1 transfer | 0 | 0 |
| R2 dual hat | 365 (merchant 295, noble 61, military 5, craft 4) | 213 (merchant 144, noble 64, military 3, craft 2) |
| R3 same kind | 96 (merchant 80, noble 16) | 243 (merchant 84, military 58, religious 55, noble 30, arcane 16) |
| R4 office | 413 | 444 (22 of them criminal forms: the office holds itself, and no criminal power is ever named holder by R3) |
| R5 appointed | 26 | 60 |

- **R1 is 0 at birth by construction** (no birth holds a transfer). Its read is the edge `transferRulingPower` already writes, `"${winner} is the power behind the ${toGovernment.toLowerCase()}. The seat answers to them now."`, matched exactly against the current form; an older transfer's edge (renamed onto the new form, its narrative naming the old) never answers. Its count on a simulated campaign is in `sim/` (item 3).
- **Two rules disagree in 2 towns of 1,860** (presets; listed in `holder-presets.md`): `seat-measure-city-mage_city-7` (Merchant Guild Council: R2 The Guild Alliance, R3 Merchant Guilds) and `seat-measure-city-arcane_academy-3` (Merchant oligarchy: R2 The Merchant Bloc, R3 Merchant Guilds). R2 wins by the order: the person heads the coalition, so the coalition holds. 0 disagree at default. The seat-holder heads two powers in 0 towns.
- **The public audience loses no holder on either pool** (0 veiled holders: no criminal and no hidden power is ever answered at birth). The audience argument still matters after play (a DM's `CHANGE_RULING_POWER` can install a criminal power; item 8).
- **⚠ For the chair: R2 answers 77 of the 103 towns whose form is APPOINTED at default** (Ducal Governorship 21, Noble Governorship 18, Royal Authority 16, Feudal Appointee 15, Feudal Stewardship 7: the appointee is the first member of a local noble house). The CS2 order puts R2 before R5, so those seats are held by the noble house, and the noble house stops contesting its own seat (the chair's Evangepolis case, 15 of 15). I keep the order; it is the reading the record supports. It contradicts the letter of "unless appointed" (the appointee is sent, no dual hat) and that contradiction lives in the birth, not in this train (§9).

## (2) The contender table per kind (CONFIRMED; every column read by the CS4 reader, so a craft guild counts as craft throughout)

Present = a non-governing power of that kind stands. Contends = it is one of the three challengers.

| kind | present | BEFORE | CS3 alone | CS3+CS4 | CS3+CS4+CS5 |
|---|---|---|---|---|---|
| **default (900)** | | | | | |
| noble | 252 | 98 | 115 | 115 | 117 |
| craft | 161 | **2** | **37** | 36 | 37 |
| merchant | 473 | 450 | 145 | 145 | 146 |
| military | 452 | 446 | 444 | 444 | 443 |
| religious | 545 | 472 | 525 | 525 | 526 |
| arcane | 207 | 29 | 71 | 71 | 67 |
| labourers · outsiders | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |
| criminal | 26 | 0 | 0 | 0 | 0 |
| **towns with no contender** | | 240 | 269 | 269 | 269 |
| **presets (960)** | | | | | |
| noble | 257 | 220 | 158 | 158 | 161 |
| craft | 247 | 147 | 191 | 167 | 170 |
| merchant | 419 | 345 | 209 | 215 | 214 |
| military | 411 | 356 | 339 | 345 | 345 |
| religious | 383 | 290 | 277 | 282 | 275 |
| arcane | 203 | 74 | 103 | 105 | 100 |
| **towns with no contender** | | 293 | 313 | 313 | 313 |

- **CS3 does the owner's work.** Merchant powers stop contesting their own seats (450 → 145 at default), and the places they free go to craft (2 → 37), nobles (98 → 115) and mages (29 → 71). Under the presets nobles FALL (220 → 158) because 94 noble seats now have their own noble house as holder: the house stops contesting the Ducal Governorship it holds, which is the owner's "redundant" complaint cured, not a loss.
- **CS4 alone weighs craft down** (presets 191 → 167: Craft Guilds goes from 0.95 to 0.85), exactly as the measure warned, which is why it lights only with CS5 under one dial.
- **CS5 at my figures adds a little and only where the record holds the circumstance** (default: craft 36 → 37, nobles 115 → 117; presets: craft 167 → 170, nobles 158 → 161). Per circumstance (the lift table in `holder-*.md`): craft-led lifts craft into the three in 4 → 5 of 9 towns (default) and 18 → 21 of 28 (presets); a questioned mandate lifts nobles 26 → 28 of 28 (presets); martial pressure lifts nobles 1 → 3 of 16 (default), 129 → 132 of 132 (presets).
- **No town gains a contender from nothing.** The towns with no contender rise 240 → 269 (default) and 293 → 313 (presets): in 29 and 20 towns the holder was the only power standing. Those are calm towns and they stay calm (the owner's law (3)). CS5 never opens a field: the count is identical with and without it.
- **The coup-risk ladder** (default): BEFORE Holding 407 · Stable 240 · Contested 220 · Critical 33; CS3 402 · 269 · 205 · 24; CS3+CS4+CS5 398 · 269 · 209 · 24. Presets: 507 · 293 · 150 · 10 → 517 · 313 · 124 · 6 → 509 · 313 · 131 · 7.
- **Measured only, NOT proposed (CS3's last clause):** counting the holder's own power on the incumbent's side makes the incumbent gated in 887 towns against 876, and the ladder Holding 446 · Stable 269 · Contested 172 · Critical 13 against 402 · 269 · 205 · 24 (default); presets Contested 124 → 92, Critical 6 → 2. It steadies roughly one Contested seat in six. I do not propose it in this train: it is a tuning act on the verdict's `share`, and the adj budget's own instrument calls that the owner's.

## (3) What CS3 does to coups in a simulated run

PENDING: the measuring seat is running `briefs/SIM-MEASURE.md` (born towns of today's law in a campaign region, the real pulse, arm A the shipped tree, arm B a throwaway worktree whose `coupContenders` drops the holder). This section is filled from `sim/` when it returns.

## (4) CS6, the one table (drafted in `seat-draft.mjs :: SEAT_TABLE`)

One row per kind: the forms it may hold, by size band, weighted; its competition-layer family; `alt` (today's `ALT_GOVERNMENT_LABELS`); and, for an unusual pair, the circumstance that licenses it. **The first row per kind and band is today's `rulingPower.js :: GOVERNMENT_PREFERENCES` label byte for byte**, so `governmentLabelFor` under the old law reads the new table and returns the same string (a pin proves it per kind and band).

- Own forms: military (Militia Command / Military Council / Grand Military Council; birth's Military City Council); religious (Church Council / Theocratic Council / High Theocratic Council; Ecclesiastical Council, Priestly Guidance); merchant (Merchant Council / Merchant City Council / Grand Merchant Senate; Merchant oligarchy, Grand Merchant Oligarchy, Merchant Guild Council, Grand Guild Consortium, Guild Council); noble (Feudal Stewardship / Ducal Governorship / Royal Authority; Noble Governorship, Feudal Appointee, Noble Regency); arcane; craft (Guildmasters' Moot / Guildhall Council / Grand Guild Assembly; Guild Council, Guild Authority, Grand Guild Council); labour; outsider; occupation; criminal; government (the civic forms: Elder / Town / City Council, Town Mayor, Grand Council, Democratic assembly, City-State Council, Elected Reeve, Household Council, Free Elder Council, Elder Consensus, Headman's Authority).
- **Civic forms** are held by craft, merchant or noble (the dual hat's `CIVIC_HOUSE_KINDS`), and by any other open kind only as the dual hat's own fallback (no trade or landed house stands): 5 towns at default, 3 under the presets, all military holding an Elder Council or a headman's seat.
- **Licensed pairs:** a merchant holder of Royal Authority or Ducal Governorship (the merchant king), licensed by trade wealth. 0 at birth (the birth draws no such pair; it is the transfer's and train 2's).
- **What the pool holds today** (form × holder kind, CONFIRMED): own 215 · civic 241 · fallback 5 · office 413 · appointed 26 (default); own 387 · civic 66 · fallback 3 · office 444 · appointed 60 (presets). **No born pair is outside the table.**

**Every pair the two old tables disagree on** (rulingPower's label against factionCompetition's id through `CANONICAL_TO_COMPETITION` → `GOVERNMENT_BY_ARCHETYPE`; READ):

| kind | rulingPower.js | factionCompetition.js | the one table |
|---|---|---|---|
| craft | Guildmasters' Moot / Guildhall Council / Grand Guild Assembly | `merchant_charter` (craft folded into merchant) | `guild_charter` (new family) |
| outsider | Foreign Stewardship / Foreign Administration | `noble_patronage` | `foreign_administration` (new family) |
| occupation | Occupation Authority | `military_order` (occupation folded into military) | `occupation_rule` (new family) |

Every other kind agrees (military, religious, merchant, noble, arcane, labour, criminal, civic/government/other). The competition layer reads its family only to word a faction's stated preference (`pref` in its lines, `governmentPreference` in its payloads; READ), and keeps its own value for a faction state already stored (`faction.governmentPreference ||` first). Under the new law a new faction state takes the table's family; the three new ids need their prose words checked ("guild charter", "foreign administration", "occupation rule").

## (5) The circumstances (CONFIRMED counts; each a pure read of what the town records)

| circumstance | the stored field it reads | default (900) | presets (960) |
|---|---|---|---|
| craft-led economy | `powerStructure.factions[]`: a non-governing craft power at least 4/5 as strong as the strongest merchant power; or `economicState.incomeSources` 'Guild Fees' / 'Guild Licensing' ≥ 25% with a craft power standing | 9 | 29 |
| trade wealth | `economicState.prosperity` ∈ {Prosperous, Wealthy} and the largest `incomeSources` row a trade source (Market Taxes, tariffs, tolls …) | 228 | 212 |
| strong faith | `config.priorityReligion` ≥ 70, or the `religious_conversion` stress | 23 | 247 |
| martial pressure | the `under_siege` / `wartime` / `insurgency` / `monster_pressure` stress, or `config.priorityMilitary` ≥ 70 | 103 | 460 |
| hunger | the `famine` stress, or `economicState.foodSecurity.label` beginning "Deficit" | 23 | 31 |
| questioned or vacant mandate | `powerStructure.publicLegitimacy.isContested` / `isLegitimacyCrisis`, the governing row's `vacant` modifier, or the `succession_void` / `politically_fractured` stress | 329 | 302 |
| outside debt | the `indebted` stress, or a power named for creditors | 30 | 41 |
| occupation | the `occupied` stress, or a row carrying `occupied` | 10 | 6 |
| none held | | 295 | 164 |

The stress is read from `config.stressTypes`, `stress.type` and `stressors[].type`. No circumstance reads a hidden fact (the `infiltrated` stress and every veiled power are left out), so a public page computing the contest from the served document cannot learn a hidden fact from a weight (item 8).

**The proposed figures** (kind × circumstance; each factor in [1, 1.5]; the product clamped at 1.6; `seat-draft.mjs :: CIRCUMSTANCE_FACTORS`): craft-led → craft 1.5 · trade wealth → merchant 1.15 · strong faith → religious 1.25 · martial pressure → noble 1.15 · hunger → labour 1.4 · mandate → noble 1.3, craft 1.2 · outside debt → outsider 1.4, merchant 1.15 · occupation → outsider 1.2. The labour and outsider factors are inert until train 2 bears a power of theirs. My first pass also lifted military, religious and merchant under a questioned mandate and military under martial pressure; those kinds already contend almost everywhere they stand, so those factors only reordered the three and pushed a noble or a mage out (arcane 71 → 67). I struck them. **The table lands DARK** (every factor 1) with these figures written beside it for the owner's tuning signature; CS4's kind read lights with it under the one dial.

## (6) The units, the files, the builders, the order

Briefs U1 to U4 are written (`briefs/COMMON.md`, `briefs/U1-LAW.md` … `briefs/U4-CONTEST.md`, each with its red arms); U5 to U7 are briefed when U4 lands (rule 3: no packet more than two trains ahead). Every builder is an Agent seat on Opus at high effort, in its own worktree on its own branch `lane/seat-2026-11-20-u<N>`, briefed by a committed file under `briefs/`, red first. I read every diff line by line and merge onto `lane/seat-2026-11-20`.

| unit | ruling | files (by symbol) | builder, order |
|---|---|---|---|
| U1 THE LAW | CS10 | new `src/domain/seat/seatLaw.js` (versions, `NEW_SETTLEMENT_SEAT_LAW_VERSION` dial, `SEAT_LAW_CONFIG_KEY`, `newSettlementSeatLaw`, `seatLawOf(settlementOrConfig)`); `density/densityCreateBoundary.js :: GENERATION_LAWS` row + `birthConfig` spread; `tests/lint/densityCreateBoundary.walker.test.js :: MINT_SYMBOLS / MINT_HOMES`; new `tests/domain/seatLawWiring.test.js` | B1, first, alone |
| U2 THE TABLE AND THE KIND | CS6, CS4 | new `src/domain/seat/seatTable.js` (`SEAT_TABLE`, `formKindOf`, `contestKindOf`, `pairLicense`); `rulingPower.js :: governmentLabelFor` / `GOVERNMENT_PREFERENCES` / `ALT_GOVERNMENT_LABELS` read from it; `worldPulse/factionCompetition.js :: GOVERNMENT_BY_ARCHETYPE` read from it under the law | B2, after U1 |
| U3 THE HOLDER | CS2, CS11 | new `src/domain/seat/holderOfSeat.js :: holderOf(settlement, { audience })` (pure; R1 to R5; audience `'owner' \| 'reader'`) | B3, after U2 (it imports U2's kind and form readers) |
| U4 THE CONTEST | CS3, CS4, CS5 | `rulingPowerCoup.js :: coupContenders` (branches on the law; drops the holder; CS4 kind and CS5 factor under the one dial, dark); new `src/domain/seat/seatCircumstances.js` (the closed list + the registered factor table, inert); every caller passes the config: `factionStanding.js :: annotateFactionStanding` (the partial caller), `castPowers.js` contender read, and the ten others | B4, after U2 + U3 |
| U5 THE TRANSFER | CS7 | `rulingPower.js :: transferRulingPower` (under the law: the form kept where `pairLicense` allows the winner's kind, else the winner's own form; the old holder's "power behind" edge retired to a competitive edge so R1 reads one; no key added) | B5, after U4 |
| U6 THE PROSE | CS12 | `factionDynamics.js` relation lines, `factionStanding.js` (`SEAT_CONTESTED_STANDING`, `contestedBy`), `castPowers.js` contender lines; names through `governanceAccount.js :: powerNameInProse` | B6, after U4, beside B5 (file-disjoint: the transfer's own `recentConflict` line for a kept form is U5's) |
| U7 THE PAGE | CS13 | `dossier/powerStrata.js :: rulingChainOf` (form, holder, person), `derivePowerStrata`, `outrankingRivalOf` / `deciderOf`; `PowerStrata.jsx`; `powerDeskRead.js`; `printProse.js` / `powerStateProse.js`; `EngineSections.jsx` | B7, last |
| U8 THE LIGHT | CS10 | the dial to v2 (`birthConfig` mints `_seatLawVersion: 2`); the wiring test's two-key and `writerReach` pins re-recorded; the born pins that move named (item 7) | B1 again, last, only on the OWNER's word (the living-content dial was lit on the owner's word of 2026-09-08; `livingContentLaw.js`'s header) |

The law lands DARK (the dial at its default, so `birthConfig` mints nothing, exactly the living-content law's shape: `newSettlementLivingContentLaw` returns `{}` at its default). Every unit's behaviour is proven on its own fixture arm that sets `_seatLawVersion: 2` explicitly. **Nothing a stored town, a golden row or a born test fixture reads moves until U8.**

## (7) What moves, and whose it is

- **Goldens: none** (the 525 configurations carry no law key; the census found no golden, dormancy golden or pdf golden view model that births through `birthConfig`).
- **U1 (dark):** `tests/domain/livingContentLawWiring.test.js` asserts `birthConfig` adds exactly two keys and `birthConfig(null)`'s exact output, and `tests/lint/writerReach.walker.test.js` + `scripts/lib/writer-reach-lit-corpus.mjs` pin `dialConfigKeys` to exactly the two keys: both stay green while the dial is dark (no key minted). The walker's `MINT_SYMBOLS` / `MINT_HOMES` and its earned-ness arm (every `newSettlement*` / `NEW_SETTLEMENT_*` export) take the new law's row. Mine.
- **U8 (the light) moves born fixtures, not goldens.** 463 test files birth through `birthConfig` (110 through `soak-review/corpus.mjs`). The ones that pin a contender, a standing line, a ruling chain or the desk: `powerTabSupport.test.jsx`, `powerSeatRender.test.jsx`, `seatKeeperContender.test.js`, `castPowers.test.js`, `seatNamedAsItSits`, `standingAgainstFigure`, `standingReadsTheNamedPower`, `stewardNoteReadsWhole`, `powerCardOrderReads`, `bar6PowersCards`, `tailDisplayCivic3V1`, `publicProseEquality.jsx`, `publicProseVeilInvariance`, `publicProseVeilOnce`, the seat-holder suites (`seatHolderOnThePage.jsx`, `seatWordsOnce.jsx`, `dossier/seatHolder`, `people/dualHatReaders`, `people/seatKeeper`, `castDerived`, `nobleFaces`, `seatHolderCard`, `successionClaimants`), `settlementSlice.test.js`, plus the wiring and writer-reach pins. Each moved figure is NAMED with its before and after, never signed. Lighting is the owner's word, by the living-content precedent; I would ask the chair to put it to the owner at the train's end, with this list re-measured.
- **Hand-built fixtures that do not move** (no law key): `rulingPower.test.js`, `powerStateProseDesk.test.js`, `engineSections.test.jsx`, `irregularForce`, `convergence`, `foreignSeatCoupAdj`, `warDisposition.p2`, `irregularForceDormancy.byteIdentity`, the `transferRulingPower` door tests.
- **Registers keyed on files the train edits** (each re-records its own row; none is a signature): `tests/lint/.tuning-inventory.json` (bareDecimals `rulingPowerCoup.js` 18, `rulingPower.js` 15, `factionCompetition.js` 76, `factionDynamics.js` 36: the new circumstance table must be a REGISTERED tuning table in `.tuning-register.json`, not bare decimals, and its figures are the owner's tuning signature); `presumedThings.widened.register.json` (rulingPower 4 rows incl. `GOVERNMENT_DESCS`, factionStanding 15, factionDynamics 5, EngineSections 7); `presumptionClasses.register.json`; `factLayers.register.json` (factionDynamics, factionStanding); `.style-law-baseline.json` (PowerStrata.jsx, powerStateProse.js, printProse.js, powerStrata.js); `.prose-numerics-baseline.json` (EngineSections 3, PowerStrata 4, keyed by line); `scripts/.observed-shape-readers-baseline.json` (it holds a sha256 manifest of its target files: ANY edit to rulingPower, factionCompetition, factionDynamics or EngineSections moves it); `scripts/.domain-strict-baseline.json` (rulingPower 3); `tests/lint/chooserTotality.walker.test.js` (`resolveCoupVerdict` exactly 2 bare draw sites: untouched); `scripts/mutation-coverage-manifest.json` (a row for any new walker). Census walkers that name the files: `proseWiringCensus` (factionStanding), `proseEntryContradiction` + `vocabularyTotality` (factionDynamics), `newsHeadlineContract` + `strategyMoveVocabulary` (factionCompetition), `factionNamePrecedenceScan` (rulingPower), `composeStateProseFence` + `dossierMountRegistry` (powerStateProse).
- **The first-paint byte ceiling** (zero slack): `rulingPower.js` is in the entry's static closure; U2 moves its table into `seat/seatTable.js` and grows it (birth forms, weights, licenses, families). The build's `verify:dist` is run at U2 and any rise is bought back inside the closure in the same unit (rule 33) or named as bytes owed. U3/U4 stay off first paint (the contest is lazy).
- **The competition fixtures' preference strings** (`worldPulseRulebook`, `factionWriteBack`, `warPoliticalLoop`, `warMachineObeysPolitics`, `captureTransitionNews`, `espionagePresence`, `espionageAbsenceDormancy`, `worldPulseTranslation`) carry no law key: they stay.
- **Owner's**: the tuning signature on CS5's figures; the light (U8) if the chair puts it to the owner; C1/C2 (stored holder); every merge, deploy and migration.

## (8) What a security reader should attack

1. **`holderOf(s, { audience: 'reader' })` on a served document**: does any rule name a criminal, hidden or absent power? R1 reads a relationship narrative: after a DM's `CHANGE_RULING_POWER` installs a criminal power, the transfer's own edge names it ("X is the power behind the …") in a string the projection may serve; the reader branch must refuse a veiled or unserved row whatever the edge says. R2 reads `memberships`, which the projection keeps per row by the veil bit.
2. **The kind reader reading craft off a name** (`backingArchetypeOf` does): an "Artisans' Syndicate" would enter the contest as craft. The draft reads criminal and veiled FIRST; attack the build's for the same.
3. **The contest as a side channel**: the public page's coup panel recomputes the field from the served document; a circumstance read from a hidden fact would leak it through a weight. Verify no circumstance reads `infiltrated`, a hidden row, a capture state or a DM-only key.
4. **Save-time prose** (`publicProseCompose.js` writes the desk read into `publicProse` at save): it must compose with the reader audience, never the owner's.
5. **Moved prose**: every line that names a holder must name it by its own name in the same string (that lane withholds a string by finding a hidden name in it). A "its own council" or a pronoun as the only reference must not survive.
6. **The law key** `_seatLawVersion` rides `config` into the public projection like the two before it (allowlisted, `_` keys kept): confirm that is all it reveals.
7. **No file of the security lane is touched**: nothing under `supabase/`, `src/domain/veil/`, `tests/security/`, `src/domain/display/gallery*.js`, `publicSafe.js`.

## (9) What I would rule differently, and why

1. **CS10: land the law dark, light it last (U8), on the owner's word.** The census shows 463 test files birth through `birthConfig`; a lit dial at U1 would move every born pin of every later unit at once and convict nobody. Dark-first is the living-content law's own shape; every unit proves itself on its own `_seatLawVersion: 2` arm; the light moves the born pins once, named.
2. **CS7: retire the old holder's "power behind" edge at a transfer under the law.** When the form is kept, the new winner's edge and the old holder's edge both read "… is the power behind the <same form>"; R1 must find one. Retyping the old one (to a competitive "held the seat until …" edge) writes only existing keys. And the PERSON: today a transfer leaves the old seat-holder in place (READ: I found no writer of `ousted` on the coup path), so R1 would name the new holder beside the old holder's man. I would rule that the train names this, not cures it (the person after a coup is a cast change, CS8's neighbour), and that the page says the seat's person "held it before" where the person heads another power than the holder.
3. **CS3's incumbent weight**: keep it unchanged, as ruled. The measured alternative (holder's power on the incumbent's side) steadies about one Contested seat in six; it belongs to the owner's tuning sitting with CS5.
4. **CS4 and the coup variant**: `stressorDynamics.js :: COUP_VARIANT_BY_ARCHETYPE` has no craft row, so a craft-led plot that reads craft falls to `palace_coup` (today, read as merchant, it is a `merchant_cabal`). I would map craft to `merchant_cabal` under the law (the guild cabal it narrates today) until an authored row exists, rather than call a guild plot a palace coup.
5. **"Unless appointed" (item 1's ⚠)**: 77 of 103 appointed-form seats have an appointee who heads a local noble house. The holder read follows the record; whether an appointed seat's person should head a house at all is a birth question for train 2 (CS8), and I would put it to the owner with that count.
6. **CS5's reach is small by design**, and I would say so to the owner plainly: at bounded factors it adds two or three contenders per kind, only in towns whose record holds the circumstance. "Every power can compete" is delivered mostly by CS3 (craft 2 → 37 at default), and for labourers and outsiders only by train 2's births.
