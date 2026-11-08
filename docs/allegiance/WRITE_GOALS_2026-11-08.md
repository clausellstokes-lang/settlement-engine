# WRITE-GOALS: the goal families written as data (2026-11-08)

Seat: WRITE-GOALS, the allegiance train's writing seat A (Opus 5.5, effort high), a child of the cloud chair (session `01FbPLbejcfwX5nii12VM673`) under the owner's full delegation (2026-11-06/07, renewed 2026-11-08). Brief: `docs/allegiance/BRIEF-WRITE-GOALS-2026-11-08.md`, with the chair's binding deviations (hand-back to the chair named above; this seat's own trailers; the roster read at this base; the report diet). Branch `lane/write-goals-2026-11-08`, cut from `origin/lane/integration-2026-11-07` at `e376ee6a3` with `origin/lane/allegiance-design-2026-11-08` (`52d48d753`) merged. Code is cited as `path :: symbol`.

**Every line is listed in `src/data/people/goalFamilies.js :: GOAL_FAMILY_LINES`, FOR THE OWNER'S VETO.** Every judgment call below is listed with the default this seat took, also for the veto. Figures are **CONFIRMED** (measured by the instrument in §1) unless marked **PLAUSIBLE**.

## 0. What was made

| path | what |
|---|---|
| `src/data/people/goalFamilies.js` | `GOAL_FAMILY_LINES[family][subKind][vantage]`, 464 lines; `GOAL_FAMILIES`; `GOAL_SLOTS`; `GOAL_SLOTS_STRUCK` (each struck slot with its reason); `GOAL_SUBKIND_SLOTS` (the slots each sub-kind may need: what car 4 fills); `PERSONALITY_CLUSTERS`; `PERSONALITY_CLUSTER_OF`. Plain data: no import, no closure. |
| `tests/data/goalFamilies.test.js` | the shape law, 15 tests, with anchored controls |
| this record | |
| `tests/lint/.source-citation-baseline.json`, `tests/lint/sourceCitationIntegrity.walker.test.js` | the roster's two lines: `dated` 153 → 154 |

Nothing imports the data file (car 4 wires it). No edit to `npcData.js`, `npcGenerator.js`, `narrativeGenerator.js`, `npcFacetContract.js`, `poolMap.js`, a golden or a register. No goal by title (J-16).

**The count by cell (design §6.6):**

| family | sub-kinds × vantages × variants | lines |
|---|---|---|
| RANK | climb · defend · enter × short, long × 6 | 36 |
| POWER | tense · competitive · corrupted · conflict × 2 × 6 | 48 |
| INSTITUTION | solvency · rebuilding · charter · takeover × 2 × 6 | 48 |
| SUPPLY | impaired · dependency · isolation · expansion × 2 × 6 | 48 |
| TIES | rival_enemy · debtor · creditor · ally · family · mentor_student × 2 × 5 | 60 |
| PERSONALITY | 12 clusters × 2 × 4 | 96 |
| ALLEGIANCE | serve × 4 vectors × 2 × 5 (40) · escape × 4 × short × 5 (20) · keep × 4 tie kinds × short × 5 (20) · front_keep, front_out × 2 × 6 (24) · warrant × 2 × 6 (12) · suspicion × 2 × 6 (12) | 128 |
| **total** | | **464** |

## 1. The fill measurement (measured first)

**Instrument.** A scratch script (kept in this seat's scratchpad, not committed) births the soak 1,000 through `scripts/audit/soak-review/corpus.mjs :: birth` (seeds `soak1k-0` … `soak1k-999`, every tier) at this branch's base, and writes per town: the powers (name, category), `powerStructure.factionRelationships` (pair, type), `powerStructure.conflicts` (parties, issue, stakes), `economicState.activeChains` (label, status, processing houses, resource and its condition, dependency), `economicState.tradeDependencies`, `necessityImports`, `isolationSupport` (applicable, status, paths), the ties (type, label, archetype), and every card (name, title, house key and `institutionDisplayName`, shelf, criminal house or not, memberships with the card one rank above, personality, corruption vector). A second scratch script renders every line with three real fills drawn from those pools; this seat read all 464 × 3 before taking them. **0 errors in 1,000 towns; 29,043 cards; 28,622 house faces.**

**The real forms, slot by slot.**

| slot | the record's real form | what the lines do with it |
|---|---|---|
| `{power}` `{rival}` | 103 distinct names. "Religious Authorities" 446 towns, "Military/Guard" 351, "Merchant Guilds" 292, "Elder Council" 176, "Thieves' Guild" 175. **592 of 3,632 begin "The"** ("The Independent Bloc"); **1,174 end in a plural noun** ("Merchant Guilds", "Grain Holders", "Noble Houses"). The estate prints them bare ("Thieves' Guild has systematic arrangements with key figures in Guild Council", `factionRelationships[].narrative`). | Written bare, as the estate prints them; never "the {power}" (it would read "the The Independent Bloc"); never "{power}'s"; never the subject of a present-tense verb that must agree in number. |
| `{above}` `{below}` | names; 179 distinct titles above ("the dean", "the senior guild master"). **139 of 29,043 card names carry a parenthesis** ("Milko Solovyov (the lanista)"). | By name only. Car 4 should strip the parenthesis before filling (see §5). |
| `{issue}` | 23 issues, e.g. "Control of a key trade route checkpoint" (147), "Succession to a council seat" (147), "Whether to open back-channel negotiations with the insurgency" (7). Present wherever a `conflicts` entry is. | First letter lower-cased; used after "over" and as the object of "settle". Every issue reads in both positions. |
| `{house}` `{otherHouse}` `{front}` `{targetHouse}` | **242 catalogue nouns, not proper names**: "Mills (2-5)" 499, "Blacksmiths (3-10)" 386, "Fish market" 378, "Weavers/Textile workers" 371, "Potter" 359, "Front businesses" 264. **5,659 keys hold a parenthetical; 3,718 still do after `institutionDisplayName`** ("Craft guilds (5-15)", "Inns and taverns (district)"). **4,642 house faces sit in a house whose noun is a PERSON** (potter 359, brickmaker 345, cooper 333, smelter 331, midwife 305, ropemaker 302, dyer 293, fuller 291, chandler 285, vintner 244, charcoal burner 242, tanner 229, woodcarver 227, pawnbroker 188, contract killer 67, fence 27 …). **1,358 sit in a "Multiple …" or "Massive …" key** ("multiple adventurers' guilds" 304, "multiple criminal factions" 130, "massive prison" 162). | The contract (in the data file's header): the slot fills as "the" + the display noun, lower-cased, parenthetical stripped. The lines never put an article before the slot, never "{house}'s", never a house as the subject of an agreeing verb (half the nouns are plural); they prefer "at {house}", "the work at {house}", "the accounts of {house}". The person nouns and the "Multiple" keys still need car 4's noun table (§5). |
| `{chain}` | 77 labels, Title Case: "Faith & Worship" 956, "Taverns & Social Life" 578, "Law & Governance" 499, "Standing Garrison" 372, "Black market" 332, "Grain & Bread" 203. Statuses: vulnerable 3,761 · operational 3,332 · running 2,382 · impaired 1,930 · entrepot 796 · magically_sustained 52. | The label as printed, like a name; treated as singular. |
| `{resource}` | the house's trade dependency: "Grain" 1,145, "Iron + fuel" 499, "Timber" 461, "Grain + water power" 423, "Trade access + commodities" 268, "Magical ley lines" 180, "Fishing + timber" 89, "Timber/rags (paper)" 70. | Goods with NO article, lower-cased, "+" read as "and" ("iron and fuel"). The chain's own `resource` is a SITE ("Grain fields", "Iron ore deposits", "Strategic Crossroads", null on 6,981 of 12,253 chains), not a good: it is not used. |
| `{import}` | `necessityImports`: Salt 436, Grain 173, Iron (weapons) 72, Medicinal herbs 65, Iron 12, Timber 9. | As goods ("salt"), parenthetical stripped; one isolation line. |
| `{other}` | the tie's other end, by name. Types: political 5,061 · debtor_creditor 5,079 · rival 4,578 · ally 4,195 · mentor_student 3,943 · respect 2,993 · enemy 1,594 · family 1,328 · patron_client 145. | By name. Debt ties run FROM the debtor (the `old_debt` prose, six read: "X owes Y", "X has been servicing it ever since"), mentor ties FROM the mentor (five read). **PLAUSIBLE** from those reads; car 4 confirms in `ties.js`. |
| `{guild}` | `allegiance.power` when the town holds a criminal power (Thieves' Guild 175, The Black Circle 18, Corrupt Council 23 …), else the criminal house (22 keys: Front businesses 264, Smuggling network 210, Whisper market 152, Multiple criminal factions 130 …). | A power bare, a house as a house; never possessive, never an agreeing subject. |
| `{handler}` `{agent}` `{target}` | names | By name; may take "'s". |
| `{season}` | **no field at birth.** The only key in the record matching /season\|month\|assize/ is `economicState.foodSecurity.storageMonths`; the fact vocabulary has no season atom (`src/domain/facts/factVocabulary.js`, its header: "Climate and season have no record field and so no atom at all (the chair's ruling 8)"). | **Struck.** Design §6.4's WARRANT line ("before the {season} assize") is written without it ("before the season is out" — the vantage's own time, not a fact). |
| `{route}` | the isolation receipt's `paths[].type`: local_foodshed 166, seasonal_access 166, reserves 85, patronage 58, hinterland 29, magical_transit 12 — machinery keys. | **Struck.** |
| `{status}` | the chain status words above | **Struck** (the sub-kind says which). |
| `{condition}` | no single field: an impairment is a chain status, a dependency a "Grain + water power" key with a machinery `impact` sentence | **Struck** (the sub-kind says which). |
| `{kind}` | the tie type; its label ("Mutual Leverage", "Outstanding Debt") is a card label | **Struck** (the sub-kind is the kind). |
| `{rank}` | 1, 2, 3 (null 21,963 · 1: 3,522 · 2: 2,899 · 3: 2,456) | **Struck** (a number; climb, defend and enter say the rank). |
| `{flaw}` `{dominant}` `{modifier}` | the trait words | Allowed; no line uses them (an adjective in an imperative goal reads as a label). |

**What "impaired" means at birth** (300 towns, 580 impaired chains): the chain's resource is depleted (451, of which 189 also have a dependency) or a dependency fails (129). Nothing is burnt or broken. So the INSTITUTION `rebuilding` and SUPPLY `impaired` lines speak of the work falling short and the supply running thin, never of damage or repair. 701 of 8,654 house faces in those 300 towns face a house that processes an impaired chain; 1,739 a house with a trade dependency.

## 2. The cells: what each sub-kind presumes

Every line is an imperative with no subject (as today's goals read: "Take over whatever the seat has stopped watching…"), names only what its sub-kind's gate guarantees, and is SHORT (this season, a thing that can be done or fail) or LONG (the life). Lines whose slots cannot fill are not drawn (the slot is its own gate). One line declares a town fact its gate does not guarantee, in the vocabulary's atoms: SUPPLY `dependency` short, "Buy {resource} at the market in bulk this season, while the price is still fair." → `needs: ['market']`.

- **POWER `corrupted`** and **TIES `mentor_student`** are written so both ends read true (measured: the corrupted pair's first member is criminal in 17 of 27 pairs, but criminal–criminal pairs exist, 8): learn, hide, profit, expose, hold together.
- **TIES `family`** names no kin (the record holds blood, in-laws, a godparent: five read).
- **ALLEGIANCE** is DM-only by construction (design §6.4). Serve and escape name `{guild}` and `{handler}`; the handler's lines name `{agent}` (and `{guild}`) by the tie kind; the front's face keeps `{front}`'s books clean or gets `{front}` out; WARRANT names `{target}` and `{targetHouse}`; SUSPICION names `{target}` only — the test holds each sub-kind to its slots through `GOAL_SUBKIND_SLOTS`.
- **FRAMES.** PERSONALITY (96) and SUPPLY `isolation` (11 of 12) carry no slot: the first is the floor every card supports, the second has no town noun the receipt names. They are frames by necessity, so they carry the cell's full variants and no ornament (STYLE-RULINGS §2 law 2). Every other line is SLOTTED.

## 3. The cluster map (`PERSONALITY_CLUSTER_OF`)

104 distinct words (positive 45, negative 30, neutral 30; "methodical" is in two lists). A cluster names what such a person WANTS, so its lines can say it plainly.

| cluster | words |
|---|---|
| greed | greedy, corrupt, self-serving, ruthless, callous, cold-blooded |
| hunger_for_status | ambitious, calculating, opportunistic, vain |
| fear | cowardly, suspicious, paranoid |
| forbidden_patron | deceitful, manipulative, mendacious, cynical |
| duty (keep faith with people and promises) | honest, brave, loyal, principled, protective, steadfast, incorruptible, forthright, candid, stalwart, dependable, conscientious, plain-dealing, fair-minded, equitable, tenacious |
| kindness (the good of others) | compassionate, generous, humble, optimistic, merciful, magnanimous, warm-hearted, gracious, courteous, good-humoured, hospitable, patient |
| mastery (do the work well, understand) | wise, diligent, clever, resourceful, scholarly, methodical, intuitive, perceptive, discerning, astute, perfectionist, obsessive |
| caution (safety, privacy) | cautious, reserved, secretive, detached, inscrutable, stoic, melancholic, brooding, prudent, temperate, level-headed, unflappable, pragmatic |
| conviction (what they believe kept, or won) | pious, zealous, idealistic, traditionalist, iconoclast, superstitious, fatalistic, nostalgic |
| sway (be followed, deferred to, seen right) | arrogant, domineering, overbearing, imperious, proud, dismissive, charismatic, diplomatic, theatrical, stubborn, contrarian, hypocritical |
| grudge (settle scores, have what others have) | cruel, wrathful, vengeful, vindictive, bitter, envious, petty |
| impulse (pleasure, change, freedom from the work) | reckless, lazy, volatile, hedonistic, restless, mercurial, eccentric |

The four vector clusters are exactly `domain/corruption.js :: FLAW_VECTOR` (the test reads `CORRUPTIBLE_FLAWS` and `corruptionVectorForFlaw`, never a copy). The PERSONALITY vector lines describe the TRAIT (a deceitful person learns secrets, tells the right story); they never presume a patron or a guild — that is ALLEGIANCE's.

## 4. Judgment calls (the default taken; each FOR THE OWNER'S VETO)

1. **The slot contract** (§1): every slot fills as a complete noun phrase that reads mid-sentence; no line begins with a slot or writes an article before one; possessive "'s" only on a person; no agreeing present-tense verb after a power, house, guild or goods slot. Enforced by the test (`shapeViolations`). Default: as stated. The alternative (lines writing "the {house}") breaks on every power name with "The" and every "Multiple …" key.
2. **Struck slots** `{season}`, `{route}`, `{status}`, `{condition}`, `{kind}`, `{rank}` (§1), recorded in `GOAL_SLOTS_STRUCK` with reasons.
3. **SUPPLY gains `{house}`** (design §6.1 lists `{chain}`, `{resource}`, `{status}`, `{import}`, `{route}`): the supply sub-kinds other than isolation are gated on the card's own house, so the house is in the record at birth. `isolation` does not use it.
4. **`{resource}` reads the house's trade dependency (goods), not the chain's resource (a site).** A dependency on "Trade access" alone, "Magical ley lines", "Capital", or a "Fishing + timber" key does not fill as goods; car 4 refuses those `{resource}` lines (default) or maps them.
5. **WARRANT and SUSPICION have a LONG vantage** (2 × 6 each, not 1 × 12): §6.6 sets six variants as the ceiling per cell, so 12 lines are two cells. The LONG lines are the enforcer's life's direction ("Rid this place of {targetHouse} for good"); car 4 draws them when the law face's LONG draw lands on ALLEGIANCE. The same reading gives serve its LONG vantage (when the SHORT draw went to another family; design §6 says the two draws come from different families).
6. **The cluster map** (§3) and the cluster KEYS: the four vectors keep the corruption vocabulary's own names; the eight others are this seat's. Car 4 chooses which trait keys the cluster (default proposed: the flaw, else the temperament, else the modifier, which every card has).
7. **The handler's lines for `keep_cause`** are written (§6.6 counts them) though fanaticism is unreachable at birth (J-6).
8. **The tic list** in the test is STYLE-RULINGS §2 law 3 verbatim, plus WIRING-RULINGS §7's named "which makes it worse".
9. **POWER `corrupted` and TIES `mentor_student` are direction-neutral** (both ends read true), so car 4 needs no direction to draw them.

## 5. What in the design did not survive contact with the record

1. **`{season}` does not exist at birth** (design §6.4's WARRANT line). Struck; the WARRANT lines carry no season. Evidence: §1.
2. **`{house}` has no reader-safe form at birth.** The design's `{house}` assumes a name; the record holds catalogue nouns, 13% still parenthesised through the display seam, 4,642 faces in a person-noun house ("the cooper", "the midwife", "the contract killer"), 1,358 in a "Multiple …"/"Massive …" key. The lines are written to tolerate the stripped lower-cased noun, but "Buy a share in the cooper" and "Watch who goes in and out of the contract killer" still read wrong. **Car 4 owes a house-noun fill**: the person nouns → "the cooper's workshop"-style forms, "Multiple X" → "the X". Evidence: §1.
3. **The `{route}`, `{status}`, `{condition}` and `{kind}` slots have no player-word form** (§1): their sub-kinds carry them instead.
4. **The TIES sub-kinds miss 28% of the ties.** Political (5,061) and respect (2,993) ties, 8,054 of 28,916 (27.9%), and patron_client (145) have no cell in §6.6 (§6.1's `{kind}` list names "political / respect", §6.6 does not); and **no `lover` type exists at birth** (§6.6's "family/lover" is family only). Default: written as §6.6 counts; car 4 maps political/respect to no TIES cell (they fall to other families). The chair may add a cell.
5. **Only 13 of the 17 corruptible flaws can corrupt at birth.** ambitious, calculating, opportunistic and cynical are in the NEUTRAL list, drawn as the `modifier`, never the `flaw` (`npcGenerator.js :: generateReligionType`), and `corruption.js :: npcCorruptibleFlaw` reads the flaw. So `hunger_for_status` reaches only through "vain" (89 corrupt cards, all vain), `forbidden_patron` only through deceitful, manipulative and mendacious. The cluster map keeps all 17 in their vectors (it is a trait map, not a reach map).
6. **INSTITUTION and SUPPLY presume nothing about the shelf, but some sub-kinds are trade-shaped.** Every house face supports INSTITUTION, including a prison or a garrison; `takeover` ("Buy a share in {otherHouse}") and SUPPLY `expansion` ("Train an apprentice at {house}") read best on the Crafts, Economy and Entertainment shelves. The lines were written shelf-neutral where possible (the charter lines were rewritten to drop "market days" and "a rival opening beside"); **PLAUSIBLE** that car 4's fit should gate `takeover` and `expansion` to the trading shelves.
7. **139 card names carry a parenthetical nickname** ("Vasileia Xiphilinos (the crier)"): a person slot filled with it prints "Milko Solovyov (the lanista)'s place". Car 4 strips it, or the person slots fill with the name before the parenthesis.

## 6. The gates (each read with `sh scripts/gate-tail.sh`)

| gate | result |
|---|---|
| `npx vitest run tests/data/goalFamilies.test.js` | 15 of 15, exit 0 |
| `npx eslint src/data/people/goalFamilies.js tests/data/goalFamilies.test.js` | exit 0 |
| `npx vitest run tests/lint/sourceCitationIntegrity.walker.test.js` | 18 of 18, exit 0: `dated` 154 (this record, 153 → 154), `tree` 112 (the base's red, 109 against 112, was already cured on the integration branch at 2a95b5917; this seat touched no `tree` row) |

The controls: a planted `{season}` and a planted `{rival}` in TIES each red the slot law; a planted "rather than" reds the tic law; a planted duplicate, "the {house}", "{rival}'s", "{rival} needs" and `needs: ['bazaar']` each red their rule. The checker first caught this seat's own slips (a sparse array slot; six agreeing verbs), all cured before the commit.
