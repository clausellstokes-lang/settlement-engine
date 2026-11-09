# STYLE-2-CRISIS-SURFACES (SW-6, with W4-3-R2's rows) — the lane record (2026-11-09)

**Tip:** see §3's full run and the hand-back. **Seat:** SW-6 CRISIS-SURFACES, Opus 5.5, session `session_01FbPLbezSPiihKVj4W3x369`, child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`). **Lane:** `lane/style-2-crisis-surfaces-2026-11-09`, cut from MERGE-TRAIN's final tip `bd07005b9` (verified). **Law:** WIRING-RULINGS §5–§8 (the owner's style law), STYLE-RULINGS-2 A1, B3, B10(b), the brief's §0 and its SW-6 / W4-3-R2 rows. Every line below is a PROPOSAL for the owner's veto. Nothing here is signed: every golden delta is UNSIGNED, for STYLE-2-MERGE.

## 1. The causes (one per commit, in order)

| # | commit | cause | file(s) | red-first |
|---|---|---|---|---|
| 1 | `91622ea6f` | B3 defect: a tension type the label map lacks is titled in words, never its raw key (`corruption_scandal`) | `src/domain/dossier/plotHooks.js` | `tests/domain/plotHooks.test.js` "a tension type missing from the label map…" |
| 2 | `350c556b9` | A1 R1–R3: the three cast fragments in the cast's own voice | `src/domain/crisis/crisisCast.js` | (wording; pin re-keyed) |
| 3 | `d29133d09` | W4 row 262 · B3: the occupier's face in a plain clause; no cast hook echoes its own clause | `src/domain/crisis/crisisHooks.js` | `crisisHooks.test.js` "a cast hook never echoes its own clause" (2) |
| 4 | `4b1827494` | W4 rows 266/267 · B3: the lever hook's verb agrees with its noun; the house prints as prose | `crisisHooks.js` | `crisisHooks.test.js` "the lever hook in plain grammar" (2) |
| 5 | `5c5ad7ca8` | B3: the legitimacy brunt's reason names the house, never "it" for a person | `crisisCast.js` | `crisisHooks.test.js` "a person is never \"it\"" |
| 6 | `00bab68d8` | B3 · A·C4: the losing house and the outranking rival in plain words | `crisisCast.js` | `crisisCast.test.js` "STAKE_REASONS in plain words (SW-6)" |
| 7 | `f6269360c` | B3 · A·C4: an untouched power prints "no stake yet", never "split. not touched yet" | `crisisPage.js`, `crisisCast.js` | `crisisPage.test.js` "an untouched power is never \"split\"" |
| 8 | `b9480eb8f` | B3 · C·P1: "the split", not "the factional split" | `crisisHooks.js` | `crisisHooks.test.js` "CRISIS_NOUN: no retired word" |
| 9 | `12525a5a4` | A1 R4 · W4 row 271: the Tonight crisis head says who the crisis lands on, never the role tag | `src/domain/summary/tonightSheet.js` | `tests/domain/tonightCastTail.test.js` (new, 3) |
| 10 | `dab2d5580` | the train's hand-back: "demonstiting" → "demonstrating" | `src/generators/npcStructure.js` | (typo) |
| 11 | `165049330` | B10(b) F1/F2: the seat-holders' position and constraint in plain words, the coda struck | `npcStructure.js` | `tests/generators/npcStructureSeatPlain.test.js` (new, 6) |
| 12 | `a872f18ed` | A1 R6 · WAVE-RULINGS item 13: the landing narration's aphorism struck, re-emitted through its door | `scripts/generate-landing-fixture.mjs` → `src/components/home/landingFixture.js` (`--emit`, `--check` OK) | (fixture) |
| 13 | `27c9aed19` | SW-10's referral (the chair, 12:59): a plural losing power agrees in the lever hook — "lose", "their" | `crisisHooks.js` (`loserClause`, reads `governanceAccount.js :: pluralPowerName`) | `crisisHooks.test.js` "a plural power agrees" |
| 14 | `1adaba964` | W4 #40 · B3 A·T3: the cast wants read the crisis's scarce good and the person's house | `tonightSheet.js` + **`src/domain/coherence/crisisFactFindings.js`, the ONE file outside the manifest** (granted by the chair, STOP 2, 12:5x: `want_not_role` re-derives through `castWantOf` by exact equality) | `tests/domain/crisisFactFindings.wants.test.js` (new, 2) |
| 15 | (this commit) | the record and the roster (`dated` 189 → 190) | this file, `tests/lint/.source-citation-baseline.json`, the walker's header | — |

Every red-first was planted by swapping in the parent's file, run red (the assertion quoted in the commit), restored, run green.

## 2. Every line, old → new (for the owner's veto)

**`src/domain/crisis/crisisCast.js :: CAST_REASONS` / `STAKE_REASONS`** (printed after the hook's clause and as the crisis page's reasons):

| key | OLD | NEW |
|---|---|---|
| `bruntLeast` (R1) | the least powerful of the house the crisis hits | the one with the least say in the house the crisis hits |
| `leverRuns` (R2) | holds the office the crisis turns on | runs the office that decides how the crisis goes |
| `instigatorRival` (R3) | outranks the seat while it weakens | already carries more weight than whoever holds the seat, and gains as the seat weakens |
| `bruntBase.public_legitimacy` | it takes the blame, and its good name pays for the crisis | the blame falls on the house, and its good name pays for the crisis |
| `STAKE_REASONS.loses` | the crisis hits its base | its own people feel the crisis first |
| `STAKE_REASONS.gainsRival` | outranks the seat while it weakens | already carries more weight than whoever holds the seat |
| `STAKE_REASONS.untouched` | not touched yet; it could side with either camp | it could side with either camp (the page's new label `CRISIS_PAGE_COPY.stake.untouched`: "no stake yet") |

Struck under the census law: R1's proposed "hits **hardest**" (the rule takes the first base the crisis hits, not the hardest); R1/R3's "him"/"he" and "the council" (no gender, no council read) — as the audit's re-reading already struck.

**`src/domain/crisis/crisisHooks.js`** (Tonight hooks, Plot Hooks, PDF, Foundry):

| what | OLD (as printed in the twelve) | NEW |
|---|---|---|
| `LINE_ROLE_CLAUSE.face` (W4 262) | In the occupation, Occupation Authority speaks for the occupier here: leads the occupying power. | In the occupation, the occupier's orders come through Occupation Authority. |
| `castSentence`, a reason that echoes its clause | In the war, Tukaram Chatterjee of Military/Guard leads the defence: leads the military. | In the war, Tukaram Chatterjee of Military/Guard leads the defence. |
| `leverSentence`, plural noun (W4 267) | The raids turns on the Professional city watch, run by Macrina Denter: whoever wins it over decides how the raids goes. | The raids turn on the professional city watch, run by Macrina Denter: whoever wins it over decides how the raids go. |
| `leverSentence`, the house (W4 266) | The war turns on the Blacksmiths (3-10), run by Indumati Upadhyay: if it gives way, Military/Guard loses most, because the crisis hits its base. | The war turns on the blacksmiths, run by Indumati Upadhyay: if it gives way, Military/Guard loses most, because its own people feel the crisis first. |
| ditto | The migration turns on the Inns and taverns (district), run by … | The migration turns on the inns and taverns, run by … |
| `CRISIS_NOUN.politically_fractured` | In the factional split, … | In the split, … |
| W4 265 (`castSentence` + `bruntLeast`) | In the migration, Paullus Severus of Elder Council takes the worst of it: the least powerful of the house the crisis hits. | In the migration, Paullus Severus of Elder Council takes the worst of it: the one with the least say in the house the crisis hits. |

`houseInProse` (new, exported): the one label seam (`institutionDisplayName`), the roster's count or "(district)" tag dropped, lower-led only where the catalogue's sentence case would put a capital mid-sentence (a name with a capital past its first letter keeps its case). The record, the links and every matcher keep the raw key (the seam's own rule).

**`src/domain/crisis/crisisPage.js`**: `CRISIS_PAGE_COPY.stake.untouched` "no stake yet" (new label) and `stakeShown`: a stake the record keeps as `split` with the untouched reason prints as `untouched`. The row now reads "Noble Families: no stake yet. it could side with either camp." The record's stake is unchanged (the waverer's rule and `crisisCastFindings` read it).

**`src/domain/summary/tonightSheet.js :: castTail`** (R4, W4 271): OLD "… Macrina Denter (bears the brunt); Hortensia Denter (bears the brunt)." → NEW "The worst of it falls on Macrina Denter in the raids and on Hortensia Denter in the migration." (one crisis: "The worst of it falls on Macrina Denter."; any other role speaks the hooks' clause: "Chae Liu is stirring it."). Each person is read off that crisis's own cast, so the per-crisis attribution is read (A1's condition).

**`tonightSheet.js :: CAST_WANTS`** (#40 / T3; filled by `castWantOf` with {scarce} = famine food · plague medicine · migration shelter · raids guards · siege food · war arms, else "help"; {noun} = `CRISIS_NOUN`; {people} "the people of {the house}" / "their own people"; {house} "{the house}" / "their house"). Instigator unchanged.

| role | OLD | NEW (template) |
|---|---|---|
| brunt | get their own people through this with what little they have left. | get {people} a fair share of {scarce} before it runs out. |
| brunt | be heard by someone with power before the crisis takes the rest. | be heard by the seat before the {noun} takes what {people} have left. |
| brunt | hold on until the worst has passed, and remember who helped. | hold {people} together through the {noun}, and remember who helped. |
| lever | decide who gets what the crisis has made scarce, and be thanked rather than blamed for it. | decide who gets the {scarce}, and not be blamed by those who go without. |
| lever | keep their house working through this, whatever it costs them. | keep {house} working through the {noun}, whatever it costs them. |
| lever | hold the one thing everyone now needs without being crushed between those who want it. | share out the {scarce} without being crushed between those who want it. |
| exploiter | sell what the crisis has made scarce for as long as the crisis lasts. | sell {scarce} dear while others go without. |
| exploiter | come out of this richer than they went in, without anyone tracing how. | come out of the {noun} richer than they went in, without anyone tracing how. |
| defender | hold the line until the crisis breaks, with fewer hands than the line needs. | hold the line through the {noun} with fewer hands than the line needs. |
| defender | keep the defence standing long enough for someone else to end this. | keep {house} standing long enough for someone else to end the {noun}. |

Printed (soak1k-0): "Wants to get the people of the Elder Council a fair share of shelter before it runs out."

**`crisisHooks.js :: loserClause`** (SW-10's referral): "Religious Authorities loses most, because its own people…" → "Religious Authorities lose most, because their own people feel the crisis first."

**`src/domain/dossier/plotHooks.js`**: `corruption_scandal` → "Corruption Scandal" (`titleOfToken`, through `humanizeToken`); the ten mapped labels unchanged.

**`src/generators/npcStructure.js`, the GOVERNMENT pool** (the card's italic position line and its Constraint; dominant / subordinate):

| condition · rank | OLD position → NEW | OLD constraint → NEW |
|---|---|---|
| fractured · dom | Holds nominal governing authority where the legitimacy of that position is in active question. Formal title and real decision-making power are not the same thing. → Holds the seat in name, but fewer people come when called, and some orders go unanswered. | Cannot take the action most likely to restore legitimacy without exposing the informal arrangements that currently keep governance functional. → Cannot mend what is broken without bringing to light the quiet deals that keep the place running now. |
| fractured · sub | Occupies a civic position whose authority depends on a governing structure that is itself under question. Institutional standing is borrowed from above. → Holds an office under a seat that fewer people now obey; the office is only as strong as the seat. | Acting to protect the position looks like opportunism; doing nothing risks being caught in the collapse of the structure this position depends on. → Moving to protect the office looks like a grab; standing still means falling with the seat. |
| corruption · dom | Governs within or alongside informal arrangements with criminal interests. Official and actual authority are partially different systems. → Holds the seat while criminals pay for favours close to it; some orders that matter are settled elsewhere. | Cannot act decisively against criminal interests without dismantling arrangements the governance structure currently relies on. → Cannot move against the criminals without cutting off the payments the seat now runs on. |
| corruption · sub | Holds a civic position inside a governance structure with compromised elements, not the source of the corruption, but operating within it. → Holds an office among officials who take bribes; not one of the takers, but working beside them. | Any investigation or challenge to the corrupt arrangements requires the cooperation of institutions that are themselves compromised. → Any honest inquiry needs the help of officials who are themselves on the take. |
| food · dom | Holds governing authority during supply failure. Civic order and governing legitimacy are both contingent on how this crisis resolves. → Holds the seat while the food runs short; how the hunger ends will decide whether the seat is kept. | Cannot distribute what does not exist, and cannot admit the full scale of shortage without accelerating the loss of confidence this role depends on. → Cannot hand out food that is not there, and cannot say how short it is without frightening people further. |
| food · sub | Occupies a civic position with limited direct control over supply. Accountable for crisis conditions without the authority to address them. → Holds an office that is blamed for the shortage but has little say over the food. | Visible effort without visible results extends accountability rather than resolving it. → Being seen to work hard while the food stays short only spreads the blame. |
| economic · dom | Governs a settlement under persistent economic pressure. The faction's legitimacy depends partly on economic performance it cannot currently deliver. → Holds the seat while money is short, and people judge the seat by what it can no longer pay for. | Cannot make the structural investments that would address the economic situation without resources the settlement does not have. → Cannot pay for the repairs and relief people want without coin the place does not have. |
| economic · sub | Holds a civic position in an economically pressured settlement where governance capacity is reduced along with fiscal capacity. → Holds an office whose purse shrinks with everyone else's. | Indispensability in a resource-constrained environment means competing with other civic positions for the same shrinking share. → Every office is after the same few coins; making this one needed means taking from the others. |
| contested · dom | Holds governing authority that is contested. The position is held but not secured. → Holds the seat, but a rival claims it, and the matter is not settled. | Every move to consolidate the position risks galvanizing opposition; every inaction gives the opposition time to consolidate instead. → Every hard move wins the rival new supporters; every delay gives the rival time. |
| contested · sub | Occupies a civic position whose institutional standing depends on a governing authority that is itself under challenge. → Holds an office that hangs on a seat someone else is trying to take. | Delayed commitment reduces the value of the eventual alignment without reducing the cost of having waited. → Waiting to see who wins keeps the office safe today and earns no thanks from the winner. |
| stable · dom | Holds governing authority in a settlement with functional legitimacy. The position is secure enough to act from rather than defend. → Holds the seat, and people accept it; there is room to act, not just to hold on. | Stability reduces the sense of urgency that would justify the resources and disruption required to address those vulnerabilities. → With nothing pressing, it is hard to win support for mending the weak spots before they break. |
| stable · sub | Holds a civic position in a well-functioning settlement. The role is defined by administration rather than crisis. → Holds an office that runs from day to day, with no crisis to answer. | Credible administration is expected, not rewarded. The upside is limited and the downside of failure is disproportionate. → Good work is expected and goes unnoticed; a mistake is remembered. |

Census law: the pool is static and reads only the category, the condition and the rank; no line names a place noun (no tier-noun exposure), a gender, a building or a number. The seat-GOAL rows are untouched (retired by car 4's A9). Typo (criminal · fractured · sub constraint): "demonstiting" → "demonstrating".

**`scripts/generate-landing-fixture.mjs :: STOCK_NARRATION`** (R6, item 13; re-emitted): "Hector Gallagher and Inghean MacCarthy are bound by something neither speaks of, and they are about to stand on opposite sides of a decision that matters." → "Hector Gallagher and Inghean MacCarthy are about to stand on opposite sides of an important decision." (the aphorism no field holds, struck).

## 3. The figures

**The base** (bd07005b9, before the first edit): the 1,000 (`soak-review --count 1000 --workers 4`) — story 0.035 / 0.084 (all / same tier), hooks 0.299 / 0.355, exact 0.048 / 0.095, skeleton 0.108 / 0.192; findings `info:battery-would-not-vouch` 653, `reader:tension-memory` 61, `A-09` 4, `reader:hook-pools` 3; `coh:tier-noun` 0, `coh:crisis-cast-sense` 0. The six golden suites 55/55 green. `tsc --noEmit` 167 errors (full and domain configs).

**The referee at the tip** (the 1,000 at `a872f18ed`, cause 12; causes 13–14 are composed at read on Tonight and the hooks and were not in that run): every figure IDENTICAL — story 0.035 / 0.084, hooks 0.299 / 0.355 (B3's re-measure: the overlap did not move; the crisis-casting hooks are not where the 0.299 lives, which is SW-10's to bisect), the TOP FORTY frames identical line for line (none from these writers; none raised, no new frame), findings identical, `coh:tier-noun` 0.

**The twelve** (`--count 12`, base vs the final tip `1adaba964`): the lines this lane cures ("(bears the brunt)", "split. not touched", "factional split", "(3-10)", "raids turns", "corruption_scandal", ": it takes the blame", "thanked rather than", "leads the defence: leads", "speaks for the occupier") 98 → 9; the nine left are renderer labels outside the manifest: the institution chip "Blacksmiths (3-10) · member of Craft Guilds" (5) and the Foundry People-to-voice label "(the household elder · bears the brunt)" (4) — both on the SW-9b list below.

**Golden deltas, UNSIGNED** (each cause's commit checked out in a clean worktree; the six suites gm /525 `generatorGoldenMaster`, fence /360 `espionageDormancyFence`, herald `heraldKnowledgeDeskGolden`, prose /1,050 `dossierProseManifest`, witness `presetLightingWitness`, pdf `goldenViewModel`). Counts are configs off the recorded master, cumulative; the fence is its corpus digest (recorded `8c92b87d59ac…`):

| cause | gm configs moved | fence digest | herald · prose · witness · pdf |
|---|---|---|---|
| 1 | 0 | unmoved | unmoved |
| 2 (R1–R3) | 24 | `bd85da7a41e1…` | unmoved |
| 3, 4 | 0 more (same 24) | `bd85da7a41e1…` | unmoved |
| 5 | 36 | `b70e734a96de…` | unmoved |
| 6 | 516 | `2d403ee2cf62…` | unmoved |
| 7 | 516 | `6b336fefa617…` | unmoved |
| 8, 9 | 516 | `6b336fefa617…` (no move) | unmoved |
| 10 | 516 | `a25d6a397db3…` | unmoved |
| 11 | 516 | `36104855d591…` | unmoved |
| 12 | not run (no generator path; `--check` OK) | — | — |
| 13, 14 | 516 | `36104855d591…` (no move) | unmoved |

Every move is text in `stress[].cast.roles[].reason`, `stress[].cast.stakes[].reason` (and the `stressors` alias) and, for 10–11, `npcs[].activeConstraint` / `.structuralPosition` — PLAUSIBLE by construction (each cause changes only string constants those fields copy); a field-level diff of the 525 was not taken.

**`tsc --noEmit -p tsconfig.full.json`** at the final tip `1adaba964`: 167 errors = the base's 167 (none added; none in a touched file). **eslint** clean on every touched file, per cause. **The three record walkers** (sourceCitationIntegrity, ledgerCitationIntegrity with the ref fetched, testRatchet) green before the push. **The full vitest** was started in a clean worktree at cause 10 (`dab2d5580`) and was still running at the push; its result is appended below in the record's next commit.

## 4. STOPs sent to the chair

- **STOP 1 (fence, renderer shapes).** C4's ONE sentence for all untouched powers, C3's one person per line (a person named in two roles), and T6's Tonight "title + Plot Hooks number" are the RENDERERS' shapes (`"{label}: {name}. {reason}."` in `CrisisTab.jsx`, `pdf/sections/CrisisSections.jsx`, `foundry/journalPages.js`; the Tonight hooks in `TonightSheet.jsx`, `pdf/sections/TonightAtTheTable.jsx`, `journalPages.js`). Default sent: `crisisPage.js` / `tonightSheet.js` compose the lines; the renderer edits go to whoever holds those files after SW-B4. In-manifest, the contradiction ("split. not touched yet") is cured (cause 7).
- **STOP 1 RULED (12:4x):** the default, the renderer shapes to **SW-9b** (cut from STYLE-2-MERGE's tip after SW-B4 and this lane) — the list is in §5.
- **STOP 2 (fence, #40 / T3 `CAST_WANTS`).** A house-filled want failed `crisisFactFindings.js`'s `want_not_role` (pool membership). **RULED 12:5x: GRANTED** — one line, re-derived through `castWantOf`, exact equality; landed as cause 14.
- **SW-10's referral (12:59):** the plural grammar of the lever loser — landed as cause 13.

## 5. What stays (BY FILE, for a second seat)

- **For SW-9b (STOP 1 as ruled; `path :: symbol` · the shape today · the shape under the law):**
  - `src/components/new/tabs/CrisisTab.jsx :: CrisisSection` (the cast rows and the stakes map) · one row per cast role, "{roleLabel}: {door} · {reason}", the same person on two rows (Macrina Denter brunt + lever, soak1k-4), one row per untouched power · one line per PERSON with their roles joined ("Macrina Denter, the watch commander, takes the worst of it and holds the answer: …"), and ONE sentence for every `untouched` stake ("The Noble Families, Military/Guard and the Merchant Guilds have no stake in it yet and could go either way.").
  - `src/pdf/sections/CrisisSections.jsx :: CrisisSections` · `` `${r.roleLabel}: ${r.name}. ${r.reason}.` `` and `` `${k.factionId}: ${stake}. ${k.reason}.` `` (the lower-case fragment after a full stop) · the same two compositions as the tab.
  - `src/foundry/journalPages.js :: crisisJournalPage` · `- **{roleLabel}**: {name}. {reason}.` and `- **{power}** {stake}: {reason}.` (plus the double escaping, A·C8) · the same.
  - `src/components/TonightSheet.jsx`, `src/pdf/sections/TonightAtTheTable.jsx`, `src/foundry/journalPages.js` (the Tonight hooks) · each hook's source title AND its full text, which Plot Hooks prints again word for word (12 of 12) · STYLE-0 §3: Tonight keeps the TITLE and its Plot Hooks number; Plot Hooks keeps the list.
  - `src/foundry/journalPages.js` (People to voice) · "(the household elder · bears the brunt)" — the cast role label as prose · the role in the hooks' words, or the label dropped.
  - the institution chip "Blacksmiths (3-10) · member of Craft Guilds" (the NPC card's house line) · the roster's count tag printed · the house in prose (`crisisHooks.js :: houseInProse` is the reader to share).
- Measured: `tonightSheet.js` carried ONE "rather than" at the base (`CAST_WANTS.lever[0]`), not three; it is gone (cause 14).
- `src/domain/dossier/faithReading.js :: FAITH_YOURS_LINE` — R5, the layout hint. Traced: `faithLinesOf` → `components/settlement/faithPanelModel.js :: faithPanelModel` (`line`) → `components/settlement/FaithSection.jsx :: FaithTeaser` (the Faith tab) and `domain/display/stateProse/printProse.js` (the PDF and Foundry print path joins `line` into prose). The cure: `faithLinesOf` stops pushing the line, the model carries it as `hint`, the two readers print it under the paragraph. Four files beyond the manifest's one and a prose-manifest move; not started.
- `src/generators/npcStructure.js` — B10(b)'s position and constraint pools for MILITARY, ECONOMY/CRAFTS, RELIGIOUS (F2's "Pastoral relevance … governance reconsolidates" is `religious · fractured · sub`), CRIMINAL, MAGIC and OTHER: the same law, the same pin (`npcStructureSeatPlain.test.js` widened per category).
- `src/domain/crisis/crisisCast.js` — the remaining selector-rule reasons: `targetSeatContested` ("holds the seat, with legitimacy already contested", printed in the twelve on Tonight and Plot Hooks), `scapegoatSeat` / `scapegoatLever`, `treaterMerchant`; the retired word in `instigatorGains`, `exploiterTrait`, `exploiterPower`, `collaboratorAmbition`, `waverer`, `CAST_ABSENCES` is SW-8's tokens.
- `docs/census/declarations/npcStructure.T.json` — the CENSUS-4 ledger still spells the old government rows and the typo (its goal rows were already stale at the base); its door is the CENSUS-4 extract, not a hand edit; `census4Ledger.walker` is green with it.
- The hooks' overlap re-measure (B3's last clause) is in §3; the attribution to the crisis-casting hooks is SW-10's to bisect.
