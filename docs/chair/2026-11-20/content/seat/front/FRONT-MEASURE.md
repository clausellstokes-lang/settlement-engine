# FRONT-MEASURE — the principal front, measured (SEAT-1's measuring seat, 2026-11-20)

Measures only. Nothing under `src/` or `tests/` changed. Executed: `measure-front.mjs --arm default` (900 towns, 0 errors) and
`--arm presets` (960 towns, 0 errors), the same seeds and configs as `../measure-holder.mjs`; `analyse-front.mjs` over both
(`front-default.json`, `front-presets.json` → `front-figures.json`). **CONFIRMED** = executed here; **READ** = by `path :: symbol`.

Brief correction: `hallCapture.js` is `src/domain/people/hallCapture.js`, not `src/generators/people/`.

## 1. Today's hidden allegiances at birth (CONFIRMED)

| pool | towns with one | cards | via office / front / retainer | vector greed / status / fear / patron | handler set | on a front-class house's face | of those rank 1 in a power | of those willing vector |
|---|---|---|---|---|---|---|---|---|
| default 900 | 303 | 925 | 217 / 468 / 240 | 425 / 66 / 219 / 215 | 925 (100%) | 468 | 16 | 242 |
| presets 960 | 230 | 807 | 167 / 413 / 227 | 378 / 59 / 177 / 193 | 807 (100%) | 413 | 32 | 219 |
| both 1,860 | 533 | 1,732 | 384 / 881 / 467 | 803 / 125 / 396 / 408 | 1,732 (100%) | 881 | 48 | 461 |

The face of a front-class house holding an allegiance is exactly the `via: 'front'` count (881 = 881). No born allegiance lacks a
handler (0 of 1,732), and no front-class house is a criminal institution or on an office shelf (0 of 25,923 front-class faces).
So `handler: null` together with `house` = the card's own house never occurs today.

## 2. Who is eligible (CONFIRMED)

Crime on record: a criminal power stands in 26 of 900 (default) and 90 of 960 (presets) towns. Every default one is
independent; in presets, 84 are independent and 22 rulers are themselves criminal. The black market share
(`economicState.safetyProfile.blackMarketCapture`, percent) has a median of 2, p90 14, p99 31 and a maximum of 45 across
both pools. It is above 10 in 266 towns, above 20 in 85 and above 30 in 22.

Eligible head = the face of a front-class legitimate house, passing `corruption.js :: npcCorruptibleFlaw`, not
`allegiance.js :: isCriminalFace`. The rate pool also requires a willing vector (greed or hunger_for_status) and the card
not already being an agent, so today's deal is not moved.

| criterion (both pools) | towns on record | gate heads | willing | pool (willing, not agent) | towns with a pool |
|---|---|---|---|---|---|
| criminal power | 116 | 1,102 | 582 | 407 | 107 |
| black market > 10 | 266 | 2,077 | 1,107 | 864 | 217 |
| black market > 20 | 85 | 771 | 397 | 277 | 74 |
| black market > 30 | 22 | 216 | 109 | 71 | 19 |
| **power or black market > 20** | **139** | **1,302** | **681** | **492** | **125** |

By tier, under power or black market > 20: thorp 1, hamlet 1, village 3, town 30, city 46, metropolis 58 towns on record.
The small tiers have a pool of 0, so a principal front is a town-and-above thing.

## 3. The seat (CONFIRMED)

The seat's person (`powerStrata.js :: liveSeatCandidatesOf(s)[0]`) is an eligible head, gated only, in 15 of 1,860 towns
under power or black market > 20. In 7 he is in the pool (willing and not an agent), and in 2 he is willing but already an
agent. Each time he is also the face of `representatives.js :: dualHatHouseOf`'s house (hat-face pool 7 = seat pool 7).
Across every town, whatever its record, 146 seat persons pass the gate and 76 are willing.

## 4. The rate (expectation CONFIRMED; executed draw is a documented hash stand-in)

Draw stand-in: `u = sha256("people-allegiance::principal-front::<seed>::<card id>")`, first 32 bits / 2^32. The build would
draw on the card's own keyed fork `people-allegiance::<card id>`, child `principal-front`. Under power or black market > 20:

| rate per eligible head | pool | towns holding one: expected / drawn | towns born with him in the seat: expected / drawn |
|---|---|---|---|
| 0.0897 (≈1 in 50) | both 1,860 | 37.2 / 39 | 0.63 / 1 |
| **0.02 (≈1 in 200)** | both 1,860 | **9.46 / 13** | **0.14 / 0** |
| 0.02 | default 900 | 3.07 / 3 | 0.02 / 0 |
| 0.02 | presets 960 | 6.39 / 10 | 0.12 / 0 |

For other criteria, the rate for 1 in 50 / 1 in 200 on both pools is: power alone 0.112 / 0.024; black market > 10 0.048 /
0.011; black market > 20 0.186 / 0.036; black market > 30 cannot reach 1 in 50, and gives 0.171 for 1 in 200. Fixed rates
0.01 to 0.1 for every criterion are in `front-figures.json` (`fixed`).

**Recommended: rate 0.02, criterion "a criminal power stands, or black market share > 20".** That is 1 town in about 200
holding a principal front, and about 1 birth in 13,000 with him already in the seat. That matches the owner's "rare chance"
and "if they rose to power": the seat is mostly reached in play, not at birth. Floor 10 is the top 14% of towns, too common
to count as crime on record. Floor 30 is 22 towns and cannot reach 1 in 50. At 0.02 the stand-in draw picks 14 heads in 13
towns. All are in town, city or metropolis; 8 are in criminal_haven presets; none is in the seat. They can be reproduced from
the `front-*.json` rows (`heads[].u < 0.02`, willing and not an agent).

## 5. The shape on the existing field, and its one read (proposal; readers READ)

`allegiance: { power: null, house: <his own house's roster name>, vector: 'greed' | 'hunger_for_status', via: 'front', handler: null, share: ALLEGIANCE_TUNING.share, veiled: true, covert: true }`

- `handler: null` is absent and reads as "answers to no one". `house` names his own legitimate house: the front is the
  enterprise. `power: null` means no power's man. This is an exception to J-1, which sets `power` whenever a criminal power
  stands; the chair should rule on it. Without it, `patronage.js :: patronageOf` (through `hiddenMembershipOf`) lends his
  share to the guild.
- **The one read, beside `allegianceOf`:** `isPrincipalFront(card)`. It holds when `allegianceOf(card)` is set, its
  `handler === null`, its `via === 'front'`, `card.institution.kind === 'house'`, and `a.house === card.institution.key`.
  This is unambiguous on today's births (§1).
- **When to draw it:** after A3/A4 (`castPowers.js :: rankPowers`, `allegiance.js :: assignHandlers`), before
  `narrativeGenerator.js :: withHallCapture`, and on clean cards only. Ranks, handlers and the agents' draws then stay
  unmoved. Behind U1's seat-law gate (COMMON law 1). Dials: two keys on `ALLEGIANCE_TUNING` (`principalRate` 0.02
  probability, `principalMarketFloor` 20 percent). Its register row is DRAFT with unit null, so the keys need no new row,
  only the row's note. A NEW table would need a row with a unit: the unitless count is 220 against
  `UNITLESS_TABLE_CEILING` 220 (CONFIRMED count).
- The rejected alternative is `handler` set to his own id. `assignHandlers` re-deals it anyway, and the card and DM view
  would print "through <himself>".

**Readers that would misread the shape:**

| reader (READ) | what it does to a principal |
|---|---|
| `allegiance.js :: assignHandlers` | treats a null handler as unhandled and deals him one; must skip `isPrincipalFront` |
| `settlementMigrations.js` (its `assignHandlers` call over every card) | same re-deal on a migrated save |
| `mutateEntities.js` (its `assignHandlers(dealt, next)` call) | same re-deal at IMPOSE_CORRUPTION |
| `hallCapture.js :: hallCaptureOf` | counts him as an agent lord, reads `corrupted` not `capture`, and sets `guild` to his own house |
| `patronage.js :: dmPowerViewOf` / `hallOf` | `answersTo.guild` is his own house; groups him under his own house with an empty handler row; `fronts` says "fronts for <his own house>" |
| `npcComponents.jsx` (allegiance line) | "answers to <his own house>" |
| `officialsInPay.js :: officialsInCriminalPayOf` | in the seat, counts him as an official "in criminal pay" |
| `corruptionLeash.js` (`corruptMarkOf`, the leash ties) | names his legitimate house as `criminalInstitution` |
| `mutateEntities.js :: exposeCorruptNpc` | same naming when exposed |
| `npcInteriorityRead.js` | labels him 'compromised' |
| `npcProfile.js` (`corrupt`, `corruptionVector`) / `worldPulse/npcAgency.js` | the simulation treats him as a turned agent |
| `goals.js` (ALLEGIANCE family) | gated on `handler != null`, so he gets no allegiance or front goal (an under-read) |
| `allegiance.js :: leaveAllegianceReceipts` | receipt says "a criminal house with a face on the roster (<his own house>)" and "gains a hidden ally" |
| `crisisCast.js :: holdsTheSeat` | at `capture`, every criminal power "holds the seat", including one the principal is not part of |

Readers that are harmless with the shape: `ties.js` (a null handler gives an ordinary tie), `handlerPoolOf` (excludes him),
`castPowers.js :: guildPushOf` (moot if drawn after A3), and the `crisisCast` / `affordanceManifest` / `tableLedger` counts.
`structuralFingerprint.js` changes `allegiance_count`.

## 6. The capture branch

Probe (CONFIRMED): the shape put on the seat's eligible willing head, read by today's `hallCaptureOf`, gives `corrupted` in
75 of 76 towns and `capture` in 1, where rank 2 is also an agent and an underworld stands. In 68 of 76 no independent
criminal power stands, so `capture` would be refused by cure (a). Receipt: "Corrupted: The head of Free Elder Council
answers to Charcoal burner." (seat-measure-hamlet-34). **Today's rule does not read him as capture.**

Proposed branch in `hallCaptureOf`: if the rank-1 agent `isPrincipalFront`, then `agentRung = 'capture'` (CAPTURE_LADDER
index 4). This ignores `captureScore` and does not need the underworld. That amends I-1 ("capture always has an agent lord
and a criminal power standing") and cure (a) for the principal case, which is the chair's ruling to make. The receipt needs a
principal line in `dmPowerLines.js :: CAPTURE_LINES.capture`, because `answerClause` and `criminalsOf` would name his own
house as "the criminals". `writeHallCapture` then writes `criminalCaptureState: 'capture'` and stamps the governing row's
`captureState: 'capture'`.

**What lights (READ):**
- `narrativeGenerator.js :: withHallCapture`: `withCaptureRelations` (relation rows).
- `npcStructure.js :: getPrimaryCondition`: 'corruption', already at `corrupted`.
- `governingModifierWords.js :: modifierBorneOut('crime')`: already at `corrupted`.
- `powerStateProse.js :: capturePoolKey`: 'capture reached a LEADER'.
- `defenseStateProse.js :: defenseCriminalProse`.
- `crimeLineDisqualifiers.js :: crimeLineFactsOf`: DM.
- `patronage.js :: hallOf`.
- **`capture` only:** `crisisCast.js :: holdsTheSeat`, `crisisFactFindings.js :: crisisCastSenseFindings`, and
  `migrationKernel.js :: originCriminalGrip01` (0.85 against 0.6).
- Play time: `factionCapture.js :: advanceFactionCapture` (from the seed), `pulseKernel.js :: simulateCampaignWorldPulse`,
  `causeVocabulary.js :: readCauseContext`.
- PDF: `viewModel.js :: powerSlice`, `viewModelBodySlices.js :: defenseSlice`. Also `PowerTab.jsx` and
  `holderTable.js` (watch).
- Public: `publicSafe.js` and `galleryVeil.js` delete `criminalCaptureState` and the capture rows.

## 7. CS18 extended: figures a visitor receives that the tag could feed (READ)

| figure | producer | does today's allegiance draw feed it? |
|---|---|---|
| black market share | `safetyProfile.js :: generateSafetyProfile` (economy, before `assembleSettlement`'s `generateCoherence`) | No. The criterion only reads it. |
| safety (`safetyRatio`, label, `criminalEffective`) | same producer | No at birth. At play, `corruptionLeash.js` drags onset security only for a security house's face, which a front-class face never is. |
| prosperity | economy step | No at birth. At play, `migrationKernel.js :: originCriminalGrip01` reads the rung, so yes through capture. |
| legitimacy | power step, before the seam | No. |
| the powers' shares (`faction.power`) | power step / `conserveSeatPower` | No at birth. `patronageOf`'s effective share is DM-only (through `hiddenMembershipOf`; nothing if `power` is null). At play, yes through `advanceFactionCapture`'s seed. |
| the cast's ranks | `castPowers.js :: rankPowers` (`guildPushOf`, A3 after A2) | **Yes, today.** A principal drawn after A3 does not feed them. |
| the cast's condition text | `npcStructure.js :: getPrimaryCondition` | Yes, through the rung. |
| the governing modifier words | `governingModifierWords.js :: modifierBorneOut` | Yes, through the rung. |
| capture state and relation rows | `writeHallCapture` / `withCaptureRelations` | Yes, but DM-only (the public projection strips them). |
| the structural fingerprint | `structuralFingerprint.js` (`allegiance_count`) | Yes. |
