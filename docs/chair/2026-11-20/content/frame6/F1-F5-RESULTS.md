# FRAME-6 · F1–F5 — the chair's rulings on the six sheets (results)

Written 2026-11-20T16:15Z, last updated 2026-11-20T16:36Z (`date -u`) by FRAME-6's builder of F1–F5 on `frame6-f` (cut at `038186160`). The brief is `F1-F5-SHEET-RULINGS.md`. Updated at each commit.

**Instruments** (in `frame6/tools/F/`): `measure.mjs <pool.json> <src/> <out.json>` composes the owner's and a stranger's sheet for every town of the 330-town calm pool (born at `4971555c3`'s generator, identical here), digests both (sha256 of the sheet's JSON, 16 hex) and prints the five counts; `cmp.mjs <a.json> <b.json>` compares two runs' digests (stranger, calm owner, framed owner); `faces.mjs <pool.json> <srcA/> <srcB/> <seed…>` prints each moved town's sides and people at two trees. BASE = an archive of `038186160`'s `src/`. Every number below is from these runs; the test (`tests/domain/tension/frameSheetRulings.test.js`) re-establishes each ruling's count on fresh births of the 63 framed towns.

**The base, measured** (owner audience): 330 towns, 267 calm (no frame), 63 framed (W1 19, W2 13, W3 26, W4 5).

| count | base | after F1 | after F2 |
|---|---:|---:|---:|
| F1: sides of a power voiced by a person with no membership and no tie of standing to a member | **9** (of 52 voiced power sides; 166 voiced sides in all) | **0** (of 51) | 0 (of 53) |
| F1: power sides voiced by a person with no membership at all | 11 | 3 (each by a tie of standing) | 3 |
| F2: empty sides whose power holds a live person no side holds | **1** (of 21 empty sides) | 2 (of 22) | **0** (of 20) |
| F3: W3 owner sheets naming the impaired resource (Q4's reading, Facts excluded) | 0 of 26 | 0 | 0 |
| F4: W4 owner sheets printing the capture rung's words | 0 of 5 | 0 | 0 |
| F5: framed owner sheets whose seat-holder is dropped | 33 of 63 (W3 16, W2 12, W4 3, W1 2) | 32 | 32 (W3 16, W2 12, W4 3, W1 1) |

## F1 — the ladder is taken in order on a power's side (commit 1)

**Built.** `troubleCast.js :: castTroubleFrame`: a side the record writes as a power's name (`side.named`, exact name; no side of the pool's 54 power sides matches a power only loosely, measured) no longer runs the archetype's hashed ladder. It takes, IN ORDER: (1) its own free office-holder (today's `listOf('office')` for a named side: the head, `officeSidesMax` and the seat cap held); (2) its own free member who is not its head (new rule `member`, kind `member`); (3) a free person, no member, tied to one of its live members by a tie of standing (`FRAME_STANDING_TIES`, rule `tie`, the existing `FRAME_REASONS.tie` with the member named). The hash (`castHash(seed, type, '<side>:<rung>:who')`, as today) chooses only within rungs 2 and 3; no rate is read on a power's side; no new draw. A person with no membership and no such tie is never on a power's row: the trade and hook rungs and the outsider rung are read only on a side that names no power. A criminal side that IS a power takes the criminal rung only for that same power (15 of 15 on the pool already did).

**The ties of standing, by the record's own `relationships[].type`:** `ally` (Pragmatic Alliance, Corrupt Arrangement), `respect` (Genuine Respect), `mentor_student` (Mentor and Successor), `family` (Family Complication), `patron_client` (Silent Partnership, The Patron No One Names). **Not admitted:** `rival` (Professional Rivalry), `enemy` (Unresolved History, Active Suppression), `political` (Mutual Leverage), `debtor_creditor` (Outstanding Debt, Held Over Them).

**New closed-set words (vetoable):** `FRAME_REASONS.member` = "because {they} [is|are] one of {power}" (a non-head member had no true reason in the set; `head` would be false). `FACE_KINDS` gains `member` (`sideArchetypes.js`; no ladder lists it, no rate reads it).

**Count (the test pins it on fresh births):** 9 -> 0. The nine at the base: village-45, -53, -75, -81 ("The Religious Authorities", each by a matter tie to a non-member); town-20 and metropolis-51 ("The Guard", the innkeeper and the coaching-inn keeper by trade); city-8, city-35, metropolis-64 ("The Guard", by a crooked or rival tie). **Sides that become "(no one named)" by F1: 1** — village-75 "The Religious Authorities" (its head is free but the office cap is spent by the seat; it has no other member and nobody stands with one: F2 then yields its head).

**Proof (a), the digests, base against F1, over the whole pool:** stranger 330/330 equal; calm owner 267/267 equal; framed owner 50/63 equal, **13 moved**: the 9 above, and four whose power side changed rung: village-40, village-49, metropolis-66 (a member who stood by a matter tie or hook now stands as a member: "because he is one of the Religious Authorities"; in metropolis-66 the member rung's hash picks Kunizza Deutsch, where the tie rung had picked Notker Ritter), and city-12 ("The Guard": its commander by office, not the stable master by trade). Knock-on moves inside the 13, by the caps and the "nobody on two sides" rule: town-20's outside hand is now reached through Barlas Arlat (the innkeeper, freed) instead of Hulegu Khwarezm; village-81's office-holder (the seat) now fronts the Elder Council, so Toragana Jalayir moves to "Popular candidate"; city-35's office cap is spent by the Guard's commander, so "Those who would take the law…" goes to a tie (Vilbirg Gärtner) instead of the dean by office; metropolis-64's hook side ("Those who would take the law…") picks from a changed list (the commander now cast, the guild's master freed): Sohee Chen instead of Cheng Yin.

**Proof (b), red first:** `frameSheetRulings.test.js` against the base source (the two `src` files at `038186160`): 4 failed, 1 passed (the pool check) — "the ties of standing…", "frame-calm-town-20…", "over the 63: no side… (9 at the base -> 0)" (the nine listed above, on fresh births), "over the 63: a power's side… by rung" (7 of 63). Green: 5 passed.

**Proof (c), the pins.** Re-recorded by F1 (an owner's framed frame line): `tests/domain/tension/frameWordsLevel.test.jsx` "the tables are pinned entry by entry…" (PINNED_REASONS gains `member`, before: 11 entries, after: 12) and, by the same cause, "14 born towns… the pool exercises every reason" (red before the pin: frame-cast-village-65's "Because he is one of the Religious Authorities." is no closed-set reason; after: green, and `member` fires in its pool). No other pin moved: `troubleWeight.test.js` (calm, in-crisis, WITH_WEIGHT, W4 and city-14's pin), `troubleCast.test.js` (caps, variety: office under half), `frameShareVeil.test.jsx` (all arms), `frame2NamesRule.test.js`, `crisisKeeperBothDoors.test.js` green.

**Gates (F1):** `tests/domain/tension` whole 5 files 40 passed; `tests/domain/summary` whole + frameShareVeil + crisisKeeperBothDoors + frame2NamesRule + noLegacyFactionReaders.walker: 9 files, 47 passed, 1 expected fail; the other owner-sheet tests (tonightSheetOnce, repeatOnceTonightTraditions, crisisDealerReason, crisisOutsideHand, crisisPageAudience, restoredSubsections): 6 files, 54 passed. `typecheck:ratchet` 167/167, `typecheck:domain:strict` 1113/1113, `lint` 0 errors (38 warnings, none in a changed file).

**(d) for the security reader:** nothing new reaches a non-owner: the frame is composed only for `audience: 'owner'` and only from a record carrying its seed (frameShareVeil's arms green). New on the owner's sheet: the `member` reason, naming a power through `powerNameInProse`.

## F2 — an empty side yields before the caps (commit 2)

**Built.** `troubleCast.js :: castTroubleFrame`, after every side is cast: a side that IS a power and stands empty takes that power's first live person by rank (not temporary, not ousted, named; an office stand-in included) whom no side and no crisis holds, even beyond `FRAME_TUNING.officeSidesMax`: its head by office (rule `head`, `commander` for a military power, `seat` for the seat-holder; a criminal power's head by the `criminal` rule), anyone else by membership (`member`). `tonightSheet.js :: frameOf`: a face the record names by role (`isOfficeStandIn`) prints by that name alone (`role` empty), so "The Religious Authorities: The High Priestess", never "The High Priestess · High Priestess". The name keeps the record's own capital ("The High Priestess"); the brief's example wrote "the". She has no `gender` on the record, so her reason reads "because they head the Religious Authorities".

**The cap's meaning (a DRAFT tuning row; no register re-recorded):** `officeSidesMax` (1) was "at most this many sides of one trouble are filled by office alone"; it is now "at most this many sides are filled by office by the ladder; a side that IS a power and would otherwise stand empty yields its own head beyond it". On the 63: 2 sheets carry two office sides (hamlet-17, village-75), pinned.

**Count:** 1 at the base (hamlet-17) and 2 after F1 (village-75) -> **0**. The one empty power side left is hamlet-74 "The Military Party" (its one live member, Albina Brutus, holds another side: not a yield).

**Proof (a), the digests, F1 against F2:** stranger 330/330; calm owner 267/267; framed owner 61/63 equal, **2 moved**: hamlet-17 ("The Religious Authorities: The High Priestess", now among the people to voice) and village-75 ("The Religious Authorities: Bayasgalan Geniges · the priest — because he heads the Religious Authorities"). Base against F2: stranger 330/330, calm owner 267/267, framed owner 49/63 equal, 14 moved (F1's 13 and hamlet-17).

**Proof (b), red first:** the F2 describe against the F1 tree: 4 failed (hamlet-17, village-75, "over the 63… (1 at the base, 2 after F1 -> 0)" listing hamlet-17 and village-75, "the office cap's meaning…"), 5 passed (F1's). Green: 9 passed.

**Proof (c), the pins.** Re-recorded by F2 (an owner's framed cast): `tests/domain/tension/troubleCast.test.js` "50 calm born towns: every face is on the record… the caps hold" — red on F2: "frame-cast-hamlet-42 — 2 sides by office" ("The Military Party" yields its one member, the Veteran Soldier, named by role); the cap check now admits office faces beyond the cap only where each office face stands on its own power's side as its member. Nothing else moved: frameWordsLevel (the stand-in passes the face check by the record's own name), troubleWeight, frameShareVeil, frame2NamesRule all green.

**Gates (F2):** `tests/domain/tension` whole 5 files 44 passed; `tests/domain/summary` whole + every test file importing `tonightSheet.js` (36) + crisisKeeperBothDoors + noLegacyFactionReaders.walker: 44 files, before the troubleCast re-pin 1 failed (that pin) / 281 passed / 1 expected fail, after it the tension directory 44/44 green; `typecheck:ratchet` 167/167, `typecheck:domain:strict` 1113/1113, `lint` 0 errors (38 warnings, none in a changed file).

**(d) for the security reader:** a stand-in ("The High Priestess") can now stand on the OWNER's frame and among the owner's people to voice; a stranger's sheet is today's (330/330). The `role` blanking is inside `frameOf`, which only the owner's composition reaches.

## F3 — STOPPED BEFORE BUILDING: the Economics tab composes the cause inline (commit 3, this report only)

**The brief's condition** ("through the reader the Economics tab already uses for that chain … if the tab composes the words inline with no reader a second surface can call, STOP and report before building") **is met.** Read in `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection`, the impaired chain's card is put together from:
- its NAME through a reader: `domain/display/chainPrintName.js :: chainPrintName(chain, town).label` ("Leather & Hides"), callable;
- its SOURCE through a reader: `chainFlowFacts(chain, instNames, shown, town).resource` (`components/new/SupplyChainsPanel.jsx`, a component file), which is `domain/display/chainHouses.js :: chainSourceOf(chain, printed)` ("Hunting grounds"), callable;
- its CAUSE inline, in the JSX: `` `${facts.resource}${facts.resourceDepleted?' (depleted)':''}` `` (EconomicsTab.jsx line 197), the same clause written again inline in `SupplyChainsPanel.jsx` line 56, `pdf/sections/SupplyChainFlow.jsx` line 133 and `pdf/sections/Services.jsx` line 230;
- its STATE word inline: `FLOW_STATUS.impaired.label` "Impaired" (EconomicsTab.jsx line 85, a component constant).

No reader returns the chain together with its cause, so the sheet's line would be a second wording of the tab's inline "(depleted)". Nothing was built for F3, and by the integrator's rule (a ruling refuted: stop at it, commit what is proven, end) **F4, F5 and the sheets (F6) were not built either.**

**What the record holds (measured at the F2 tip, `tools/F/w3.mjs <pool.json> <src/>`):** the 26 W3 owner sheets carry 101 impaired chains, and every one of the 101 is impaired by a ground worked out: `resourceDepleted: true`, `resourceCondition: 'depleted'` (the record's own word). village-20: `{ label: 'Leather & Hides', resource: 'Hunting grounds', resourceCondition: 'depleted' }`; `chainPrintName` and `chainSourceOf` give "Leather & Hides" and "Hunting grounds" there.

**The count before:** W3 owner sheets naming the impaired resource 0 of 26 (Q4's reading: the chain's id, label and ground words, Facts excluded; at the base and at the F2 tip). Read with Facts included it is 4 of 26, all false: "grain" in the food fact ("about … months of grain") against a `food_processing` chain on "Grain fields".

**A way through, for the chair (not built):** one display leaf beside `chainSourceOf`, e.g. `chainHouses.js :: chainSourceShown(chain, printed)` -> "Hunting grounds (depleted)", called by the tab's card, `SupplyChainsPanel.jsx`, both PDF sections and then the sheet (its one Facts line: `chainPrintName(chain, town).label` + that leaf, e.g. "Leather & Hides: Hunting grounds (depleted)."). That moves four renderers' files (none of them this lane's) and needs a label for the Facts row (TONIGHT_COPY has none for it).

## F4, F5, F6 — not built (stopped at F3); what was read, for the next builder

- **F4.** The Power tab prints the capture rung in two places on this branch: its DM panel (`WhoRunsThisTownPanel.jsx` "The hall": `{label}. {line}`) reads `data/people/dmPowerLines.js :: CAPTURE_RUNG_LABELS` ("Partly in criminal hands", "Run by the criminals") through `domain/people/patronage.js :: hallOf`, from `powerStructure.criminalCaptureState`; the badge (`PowerTab.jsx` line 199) is a component-local map ("Criminal: Corrupted Officials", "Criminal: Governance Captured"). The brief's sentences ("The ruling seat is partly in criminal hands.") exist nowhere on this branch, and `safetyShown.js` is not on it (grep: no file). On the pool the five W4 towns hold `criminalCaptureState: 'corrupted'`, equal to their captured power's `captureState` (5 of 5). Count today: 0 of 5.
- **F5.** Count at the F2 tip: 32 of 63 framed owner sheets drop the seat-holder (W3 16, W2 12, W4 3, W1 1; 33 at the base: F1 put the seat on village-81's power side). The calm sheet's seat row is `tonightSheet.js :: peopleOf`'s `add(seat, 'seat', …)`; `troubleWeight.test.js`'s city-14 arm asserts the people's sides equal the frame's sides, and would move with F5.
- **F6.** Not run.
