# STYLE-2-PULSE-CARD — THE NEWS CARD STATES THE EVENT, NAMES ITS PEOPLE, AND DROPS THE PIPELINE'S WORDS (SW-11, 2026-11-09)

**The ruling:** STYLE-RULINGS-2 Part C, **C1** — the card body is a DEFECT CLASS — with C2's fold of the cross-partition duplicates (A1·94 = A2·P1; D·1; C1c·61). **The worklist:** ledger A1 of `STYLE-AUDIT-2-PULSE-2026-11-09.md` (`lane/style-2-pulse-r2-2026-11-09` @ `b5d578e3a`), its 70 REWRITE rows as drafts under the census law and the refusal line. **The law:** WIRING-RULINGS §5–§8; BRIEF-STYLE-2-WAVE §0.

**Seat:** SW-11 PULSE-CARD, Opus 5.5, a child of the chair (`session_01FbPLbejcfwX5nii12VM673`), session `session_01FbPLbezC1HmA5D3AoLCRY2`. **Base:** `2053a809c` (verified with `git rev-parse`). The lane was cut as a separate `git worktree` at that sha. An in-place `git checkout -b` in the shared checkout was refused by the session's auto-mode classifier, and the worktree is the non-destructive equivalent. **Every line below is vetoable by the owner by a word.**

## §0 The answer

- **Before:** every one of the 4,496 measured card bodies was a lifecycle line with no event in it. The pill printed the pipeline's state ("applied / queued / ready / expired").
- **Now:** the body is the filed event — its people, what happened and what it means — in at most two sentences. Where the filed sentence names no place, the body leads with the place, as a dispatch does. The pill says "coming", "in effect" or "past" for an effect still travelling between towns, and nothing for any other entry.
- **The pin:** on a planted run, no body is without an event and a named party, and no face word is a state token. It was red at the base (335 of 335) and is green at the tip.
- **The three refusal-line frames:** all fell to 0 on the re-run.

## §1 The commits (one cause each, in order)

| sha | cause | surfaces moved |
|---|---|---|
| `62cfc827e` | **the pin, red** — `tests/domain/newsCardFace.pin.test.js` | none (test) |
| `fe87c9cad` | **the body composer** — `newsBodyText` is the filed reader summary (≤ 2 sentences) through `newsReaderSummary`; `newsCardTooltip` (no title that repeats the body); `newsCardReasons` (no pill that repeats the body; the reach and lifecycle receipts off a filed event's face); NewsEntry renders them | display only |
| `a5918dc0a` | **the pill** — `newsStatusWord` ("coming · in effect · past" for a travelling effect, else nothing); `newsCardFace` bundles the face | display only |
| `a9bf31e9b` | A1 rows, `wizardNews.js` (regional headlines, summaries, roads, goods, reasons; A1·38's id-as-name) + `newsBody.js` A1·13 and the reason twins | stored news (herald, witness) |
| `765c7d602` | fix: no new named tuning constant (the tuning register's P2 counted `BODY_SENTENCES`) | none |
| `306a8dce4` | **the dateline** — `newsBodyText(entry, { nameById })` leads a body that names none of its places with the place it is about; the pin made exact before its first green (§3) | display only |
| `860a5bc98` | A1 rows, `relationshipRulesCore.js` / `relationshipRulesAdversarial.js` (the rule notes become named sentences) | stored news + pulse records (herald, witness) |
| `d08e96488` | A1 rows, `heraldDeeds`, `deityStanceLane`, `religiousContest`, `warHomeCosts`, `mobilizationEffects`, `stressorAftermath` | stored news + pulse records (herald, witness) |
| `77ada4f08` | fix: the destination lower-case mid-sentence ("…before it reached a far settlement", 285 bodies on the re-run) | stored news |
| `6b3a5121d` | the walker's last two phrases in these files (dark): "resistance factions", "rather than risk war" | none lit |
| `3d5b5d16b` | **the chair's added row, C2·26 — the pin, red**: the succession question prints its ids | none (test) |
| `ba6bc107e` | fix: the registers this lane's causes moved — the any-cast ratchet (relationshipRulesCore 8 → 6), two anchor markers, the WY-1 pulse hash re-keyed (TEXT ONLY) | `modeSpeedsWy1` hash (unsigned) |
| `969077590` | **the succession question's print sites**: `readerHeadline` / `readerSummary` put the towns' names in; WorldPulsePanel's four card kinds and NewsEntry print through them; newsBody's card readers typed (any-casts 2 → 0) | display only |

## §2 Every line, old → new (for the owner's veto)

### §2.1 The card face (display; nothing stored)

| row | OLD | NEW |
|---|---|---|
| A1·1–7, A1·8 (the body) | a lifecycle pool line ("It is being felt {scope} now.", "Word of it is only now reaching the roads.", …; 4,496 of 4,496) with the event in a hover title | the entry's filed summary, at most two sentences, read through `newsReaderSummary`; the title is empty unless the body was cut. The pools stay only as the fallback for a legacy entry with no summary. They are **not** reworded (SW-3 rewrote `appliedLight[3]` on its lane; leaving the pools keeps the merge clean, and no entry of the run reaches them). |
| the dateline (C1) | — | a body naming none of the entry's places becomes "{place} — {sentence}": the destination of a travelling effect, the first settlement of any other entry |
| D·79 / C1 (the pill) | `humanizeToken(entry.kind)`: "applied", "queued", "ready", "expired", "pantheon", "realm" | "coming" (queued, ready) · "in effect" (applied) · "past" (resolved, ignored, expired) on a travelling regional effect; no pill on any other entry |
| A1·13 | an unregistered snake token printed de-underscored ("unmapped reason") | no pill |
| A1·29/30 + the lifecycle receipts (face only) | "spreading from town to town", "reaching across the country", "the effect has taken hold", the ready / resolved / expired receipts as pills on a filed event | not on the face (the body names the source and the road; the pill carries the lifecycle). They stay on the entry as score evidence and still print where `reasonOf` reads them (the Herald's "Casus / Driver" slot). |
| rule g | a reason pill identical to the body (the rule note filed as `summary \|\| reasons[0]`, 384 cards) | dropped from the face |

### §2.2 `src/domain/region/wizardNews.js` (stored; the herald and witness move)

| row | OLD | NEW |
|---|---|---|
| A1·14 (1,292) | `${town} feels the trouble spreading from town to town` | the standard frames: `${town} has word of ${phrase}` (queued), `${town} braces for ${phrase}` (ready). **Seat-corrected under the refusal line:** the audit's draft "…moving through the towns nearby" would have been a new fixed tail at the old rate. The metronome key is unaffected, because its predicate needs a prior `applied` entry with the same reasons. |
| A1·19 (117) | `Relief reaches ${target}` (every non-applied transition, 28 of them expired) | queued/ready `Help is on its way to ${target}`; expired/ignored `The help meant for ${target} never came`; applied/resolved unchanged |
| A1·20 (795) | `${town} braces for ${phrase}, come from ${source} ${road}${goodsPart}.` | `${What} is close to reaching ${target}, coming from ${source} ${road}${atStake}.` |
| A1·21 (934) | `${town} has word of ${phrase}, on the way from ${source} ${road}${goodsPart}.` | `Word has come to ${target} of ${phrase} in ${source}, travelling ${road}${atStake}.` |
| A1·22 (488) | `${town} is spared ${phrase}, which ${source} sent ${road}${goodsPart}.` | `${What} from ${source} died out before it reached ${target}.` |
| A1·23 (dark) | wakes to / has seen the last of / pays no heed to …, "come from" | applied `${What} has reached ${target} from ${source} ${road}${atStake}.`; resolved `${Town} is through ${phrase} that came from ${source}.`; ignored `${Town} paid no heed to ${phrase} from ${source}.` |
| A1·24 (117) | `${town} has word of relief on the road from ${source} …` / `${town} feels the pressure easing, with help come from …` | queued/ready `${Source} is sending help to ${target} ${road}, bringing ${goods}.`; expired `${Source} sent help ${road}, but it never reached ${target}.`; applied/resolved `Help from ${source} has reached ${target} ${road}, bringing ${goods}.` |
| A1·25 (2,126) | through the trade that binds the two towns · under the shield that joins them · through their struggle over scarce goods · through the temples that bind them · along the hidden roads of the underworld | along the trade road between them · through the defence pact between them · through their quarrel over scarce goods · through their temples · along the smugglers' roads (the other eight unchanged) |
| A1·28 (994) | `, with ${goods} caught in the balance` (title-cased labels mid-sentence) | `; ${goods} is/are at stake` (sentence case, "a, b and c") |
| A1·31 (835) | carried along a vital road | carried by a tie the town depends on (and its `newsBody` twin) |
| A1·34 (441) | the long wait is over | close at hand (twin) |
| A1·35 (288) | the danger has passed | it never arrived (twin) |
| A1·37 (dark) | a great pressure lifted | a great weight lifted (twin) |
| A1·38 (1,686) | a stored source name that is an id printed ("come from b") | `readerName`: a name equal to one of the impact's own ids, or one character long, falls to the stand-in |

### §2.3 The relationship rules (stored as reasons; the first reason is the summary by `relationshipRuleHelpers`' fallback)

New readers: `relationshipRulesCore.js :: townName` and `:: pairNames`. These make the snapshot read the headline already makes. The pair is in save-id order, so the reasons are orientation-invariant, and a town the snapshot cannot name takes "a neighbouring town".

| row | OLD | NEW |
|---|---|---|
| A1·40 (218 + 218) | An ally faces a gated obligation to mirror the hostility or cold-war pressure bearing on its partner. | `${obligated} is bound by its alliance to stand with ${pressured}, which is under threat, and must decide how far to go.` |
| A1·41 (38) | The ally supports cold-war pressure with sanctions, intelligence, or proxy aid. (and the hesitant twin) | `${supporter} is backing its ally ${supported} in its cold war with ${third}.` / `… against ${third}, but warily, because it has ties to ${third} itself.` (census: the audit's "closing its markets … passing on what its people hear" struck — the rule does not choose an act) |
| A1·42 (38) + vassal twin (dark) | Cold-war third party: ${thirdPartyId}. ("j.") | struck (the third party is named in the reason above); the vassal twin `${vassal} is expected to help ${overlord} in its cold war with ${third}.` |
| A1·43 (15) | Local pressure creates a minor incident between neutral settlements. | `There has been trouble on the border between ${a} and ${b}, and bad blood between them is growing.` ("neither town has forgotten it" struck: not read) |
| A1·44 (1) | Trade pressure disrupts routes and introduces resentment or leverage. | `Trade on the road between ${a} and ${b} is being disrupted, and bad feeling is growing on both sides.` |
| A1·47 (2) | The strain of vassalage is X; the resentment under it, Y. | `${vassal} pays tribute to ${overlord}, and the anger over it is Y.` ("for years" struck: not read) |
| A1·48 (1) | A rebellion can end vassalage if it succeeds, but it does not erase prior structural changes. | `If ${vassal} wins, it is free of ${overlord}, but what the tribute years took from it stays taken.` |
| A1·51 (dark) | Weakness memory re-notes at most once per 3 ticks; streak now N. | `${vassal} has watched ${overlord} look weak for N season(s) now.` |
| A1·52 (dark) | The rebellion has a plausible path… / Prior economic, factional, and power changes remain as scars rather than reverting. | `The rebellion in ${vassal} has a real chance of breaking free of ${overlord}.` / `Winning will not undo what ${overlord}'s rule changed in ${vassal}'s markets and among its powers.` |
| A1·53 (dark) | Tribute, levies, or legal concessions are draining local capacity. / A vassal relationship transfers value upward. | The tribute and levies owed to the overlord are taking food, coin and labour the town needs. / What the vassal makes goes up to its overlord. |
| A1·50 :539 (dark) | … autonomy movements or resistance factions. | … autonomy movements or resistance among its powers. (the retired word only; the row's other 30 notes stay) |
| A1·94 = A2·P1 (34 + 34) | Weak legitimacy gives cold-war rivals a proxy faction opening. | `${destabilized}'s rulers are losing their people's trust, and ${exploiter} sees a chance to back a power inside the town against them.` |
| A1·95 (56 + 56) | Cold-war pressure follows exposed trade and supply channels through inspections, sanctions, and informal embargoes. | `${imposer}'s inspectors are holding up ${sanctioned}'s carts at the border, and some goods no longer cross at all.` |
| A1·97 (56) | The supply exposure is confirmed, and it is X. / Nothing is confirmed; the trade strain alone is X. | `${sanctioned} depends on that trade, and the dependence is X.` / `No one has proved ${sanctioned} depends on that trade, but its markets are already hurting.` |
| A1·98 (21 + 21) | Economic competition and resentment create sabotage, undercutting, or prestige attacks. | `${a} and ${b} are working against each other in trade, and the resentment between them is growing.` (census: "undercutting … each blames the other" chose an act) |
| A1·99 :651 (dark) | … extracts concessions or preferential terms rather than risk war over the relationship. | … presses for concessions or better terms and stops short of war over it. (the struck balance only; the row's other 19 notes stay) |

### §2.4 The faith, war and aftermath writers (stored)

| row | OLD | NEW |
|---|---|---|
| A1·58 (1) | is breaking with their faction / breaks with their faction | is breaking with the power they served / breaks with the power they served |
| A1·61 = C1c·61 (219) | Relations between {a} and {b} are changing / change | … are being tested / are put to the test (the count is the deed table's, one authored form per deed — below) |
| A1·63 (439) | {npc}, a minister of {town}, leans toward {rival} and away from {patron}, opening a foothold for the rival creed. | `${npc} sits among ${town}'s ministers, so the faith of ${rival} now has a voice in the town's government.` (the audit's "a friend among the clergy" misread the seat) |
| A1·64 (33) | Deep local devotion makes the schism louder than the numbers alone would. | `${town}'s people hold hard to their faith, so the quarrel is loud in the streets.` |
| A1·67 (31) | {new} overtook the former patron to become {town}'s patron creed. | `${prev} has lost its hold on ${town}, and ${new} now has the most followers there.` (the former patron read at the flip; "feast days" struck) |
| A1·68 (21) | Deep local devotion sharpened the upheaval beyond what the numbers alone would. | `${town} is a devout town, so the change of creed cuts deep.` ("split families" struck: not read) |
| A1·69 (dark) | `${sourceEventTargetId} converted ${targetSaveId}.` (raw ids) | the outcome's own summary |
| A1·71 (439) | {npc}, whose temper leans to {rival} and away from {patron}, has become the creed's foothold within {city}. | `${npc} of ${city} now speaks for ${rival}, though the town keeps ${patron} as its patron.` |
| A1·73 (32) | The faith of {deity} broke its pact with {target}, a betrayal its patron's nature made only a matter of time. | `${source}, a town of ${deity}, has broken its faith pact with ${target}.` |
| A1·74 (32) | {a} broke its pact with {b}: its patron {d} (evil/neutral) carries a standing betrayal hazard toward {e} (…). | `${a} worships ${d}, a creed that does not keep faith with the followers of ${e}.` |
| A1·75 (4) | Local devotion sharpened the treachery; the faithful took it personally. | `${a} is a devout town, and its faithful pushed for the break.` |
| A1·77 (7) | The kindred creeds of {d} and {e} drew {a} and {b} into a pact of shared purpose. ("Vael and Vael") | same creed `${a} and ${b}, both towns of ${d}, have sworn to stand together in their faith.`; else `${a} (${d}) and ${b} (${e}) have sworn …` |
| A1·78 (7) | {a} and {b} were drawn together: the kindred creeds {d} (good/neutral) and {e} (…) share common ground. | `${a} and ${b} hold to faiths that sit easily together.` ("already deal with each other" struck: not read) |
| A1·79 (3) | Local devotion deepened the bond; the faithful took it personally. | `${a} is a devout town, and its faithful welcomed the pact.` |
| A1·82 (22) | {name}'s war chest bleeds | `${name}'s war is emptying its treasury` |
| A1·83 (22) | Sustaining the campaign against {t} drains the home economy. | `${name} is paying for its campaign against ${t}, and the bill falls on the people at home.` |
| A1·84 = D·1 (22) | 1 active war front from {name}, 8 ticks deployed. | `${name} has had its army in the field for eight weeks, on one front.` (no age: `${name} has its army in the field on one front.`) |
| A1·87 (13) | {name} bleeds to keep its army fed | `${name} keeps feeding its army at the front` |
| A1·89 (29) | The weariness of this war has set into the place and will not simply lift; it is a wound now, not a mood. | `The war against ${t} has gone on so long that ${name} will feel it long after the peace.` ("for years" struck) |
| A1·93 (dark) | {name} is reinforcing its army besieging {t} (N ticks deployed). | `${name} is sending fresh men to its army outside ${t}.` |
| A1·104 (dark) | {name} is gearing for war ({posture token}). / … visibly mobilizing for war ({token}). | `${name} is gearing for war.` / `${name} is openly arming for war.` |
| A1·106 (73) | {label} is over, but it leaves {residual}. It will be remembered for a while yet. | `${label} is over, but it leaves ${residual} behind.` |
| A1·107 (110) | The crisis ran its course. | It ended on its own. ("no one put a stop to it" struck: not read) |
| A1·108 (73) | Echo begins: still in living memory until it fades. | People still talk about it. |
| A1·110 (47) | No one speaks of {label} in the present tense anymore; it belongs to the settlement's story now. | `${label} now belongs to the settlement's past.` |
| A1·111 (47) | The echo faded below living memory and was recorded as history. | Those who lived through it no longer speak of it as news. |
| A1·112 (dark) | {label} gripped the settlement during the campaign … | … gripped the settlement not long ago … |

### §2.5 The chair's added row: the succession question (C2·26, from FIX-PULSE-DEFECTS' STOP 2)

The outcome stays as filed: it is persisted, and `treatySuccessionDecision.js :: successionQuestionPayloadTuple` pins both strings from the question's ids. Every page reads them through `newsBody.js :: readerHeadline` / `readerSummary`. The pin is `tests/domain/successionQuestionPrint.pin.test.js`: red at `3d5b5d16b`, green at `969077590`.

| site | OLD (printed) | NEW (printed) |
|---|---|---|
| WorldPulsePanel proposal / major / outcome / digest cards; the news card (the queued copy of `worldPulseFeedCuration :: newsEntryForOutcome`) — headline | Succession oath decision for {settlementId} | `{Town}'s new ruler must decide whether to keep the oath to {Other}` |
| the same — summary / card body | Apply to disavow the oath to {otherId}; dismissing or leaving it unanswered honors the oath. | `Apply to break {Town}'s oath to {Other}; dismiss it, or leave it unanswered, and the oath holds.` |

`worldPulseFeedCuration.js` is unchanged. Its copy keeps the id it was given, and no page prints it. The Herald's own headline slots (`heraldGrammar.js :: headlineSlotsOf`, "byte-verbatim glance") still print a stored headline as filed. They are outside this row's two named sites and are listed in §7.

## §3 The pin (red-first, then exact before its first green)

`tests/domain/newsCardFace.pin.test.js` runs a planted realm for 16 weeks: eight generated towns with named graph nodes, two hostile pairs, a cold war, alliances, faith centres and the war, faith and relationship layers on. It reads every filed entry through `newsCardFace` with the panel's save-name map.
- **At `62cfc827e` (the base's face):** RED, "335 of 335 card faces fail" (a lifecycle-only body, no party named, the pill "queued"/"applied").
- **After the body and the pill:** 52 of 335 still failed. Some bodies were truly unnamed, from writers outside this manifest (stressorsCore's residual line, the relationship rule notes). Two of the pin's own readings were too blunt: its name list missed the people and powers the world held mid-run, and its token test caught the English verb "resolved" inside a sentence.
- **Made exact at `306a8dce4`, before it was ever green.** The face is read with the panel's name map (the dateline is part of the face). A party is any town, person, power or god the world held during the run. "No state-machine token" means the status pill and any pill that IS a token.
- **GREEN at the tip:** 335 of 335, in about 7 seconds.
- **Named for the verifier:** these refinements were made on a red pin and loosen no passing assertion. The dateline is what makes the pin hold for writers outside this lane.

## §4 The measure: the audit's 4,496-entry run, before and after

The run reproduces the audit's §0: a scratch copy of `scripts/audit/simulate-world.mjs` with the imports made absolute and one line added to dump the feed. It was run with `WAR_ECON_ALL=1 --ticks 52 --reps 2 --scales 0`, 14 towns, and exited 0 with `HEALTH: OK`. Every entry was rendered through NewsEntry's own functions with the saves' name map. **The run's structure is byte-identical before and after:** the same 2,018 + 2,478 entry ids, kinds, ticks and settlement ids, and an identical soak summary. Only words moved.

| measure (card face) | base `2053a809c` | tip |
|---|---|---|
| bodies with no event (lifecycle pool line) | 4,496 | 0 |
| bodies naming a town (the dateline included) | 0 | 4,489 (the other 7 name a god: the pantheon's rise and fall) |
| distinct bodies | 24 | 1,921 |
| state-token pills ("applied / queued / ready / expired") | 4,477 (+19 "pantheon/realm") | 0 ("coming" 1,701 · "past" 516 · none 2,279) |
| "spreading from town to town" — headline · pill | 1,292 · 1,686 | 0 · 0 |
| "reaching across the country" — pill | 1,180 | 0 |
| "A far settlement feels the trouble spreading…" — headline | 1,292 | 0 |
| "faction" — face · tooltip | 56 · 34 | 21 · 0 |
| body printed again as the hover title | — (the title held the facts) | 0 (no title on 4,496: no filed summary runs past two sentences) |
| the top headline frame | 1,292 ("A far settlement feels the trouble spreading from town to town") | 275 ("Korl finds an ear in {N}", A1·70, PASS; per god) |
| the top body frame | 431 ("The mark of it is on things in the town now.") | 218 (A1·40's "{N} is bound by its alliance to stand with {N}…", one rule, two named towns) |

**One frame rose, and why:** the face shows at most three reason pills. With the reach receipts off the face, the next receipt fills the slot: "touching goods that matter" 505 → 655, while "a matter that cuts deep" 718 and the A1·31 pill 835 hold. The pills printed fell overall, 9,300 → 5,468. This is a pulse pill; the soak referee's twenty frames are dossier frames and do not read it.

**The harness caveat, as the audit stated it:** the run's regional graph has no named nodes. So the regional effects say "a far settlement" and "a neighbouring town" where the app, whose graph is derived from the saves, prints the towns' names. The dateline names the destination on those cards. The remaining "faction" tokens on the face are the crier quote (SW-3's, cured on its lane) and `factionCompetition.js`'s reasons (A2, SW-12's).

## §5 The deltas over the parent, for STYLE-2-MERGE's signing (UNSIGNED)

Measured with each surface's own door: `scripts/audit/herald-stage.mjs`, `witness-stage.mjs`, `golden-master-stage.mjs`, `refence.mjs` and `scripts/prose-manifest-cells.mjs`. The parent is a clean `git worktree` at `2053a809c`; the tip is this lane's committed tree at `6b3a5121d` (no uncommitted bytes). Nothing was re-recorded and nothing was signed.

| surface | moved | cells | cause |
|---|---|---|---|
| **herald knowledge desk** | **1 / 475** | `rr-fresh-full\|1\|contentSha256` only; every section and item count unchanged | the stored headlines, summaries and reasons of `a9bf31e9b`, `860a5bc98`, `d08e96488`, `77ada4f08` |
| **witness** | **6 / 8** | `__birth_default__` (worldState, wizardNews, settlementUpdates), `quiet_local` (wizardNews, settlementUpdates), `realistic_regional` (all three), `dramatic_campaign` (wizardNews, settlementUpdates), `living_realm` (wizardNews, settlementUpdates), `full_simulation` (all three); `static_campaign` and `narrative_campaign` unchanged | the same writers: the news text; the pulse records' reasons and the condition descriptions and causes (the vassal extraction description, the conversion and mobilization causes) inside worldState and the settlement updates. Text only: §4's structure check. |
| **generator golden master** | **0 / 525** | sha `5f77f02f…` both sides | generation does not run the pulse |
| **espionage dormancy fence** | **0 / 360** | corpus `5bc02d54…` both sides | generation does not run the pulse |
| **prose manifest** | **0 / 74,482 cells (525 towns)** | `prose-manifest-diff.mjs`: REPLACED 0 · RE-INDEXED 0 · ADDITIVE 0 · WORDING-ONLY 0 | — |
| **WY-1 pulse-record hash** (`tests/domain/modeSpeedsWy1.test.js`) | **1 hash** | `5b6a1e51…` → `d8118b6a…`, re-keyed in `ba6bc107e`. TEXT ONLY: leaf-diffed against `2053a809c`, 28,711 leaves on both sides, the same paths, 252 string leaves moved (summary 79, reasons 75, gates 61, reason 26, headline 7, postureReasons 4), no id, tick or number. | the A1 rows' named sentences |
| **PDF snapshot** | 0 | `tests/pdf/__snapshots__/goldenViewModel.test.js.snap` holds none of the old lines (grepped by each changed literal's longest fixed fragment) | — |

**The reds these moves raise, left UNSIGNED for the merge:**
- `tests/property/heraldKnowledgeDeskGolden.test.js` › "THE REFILE MOVES NO CONTENT BYTE…" (the content hash);
- `tests/simulation/presetLightingWitness.test.js` › "every witnessed row matches the recorded witness…" (the six presets above).

Both were run at the tip and are red exactly there.

## §6 The referee (the walker's phrases, SW-0's scanner)

`scripts/lib/style-law-scan.mjs` (`lane/style-2-walker-2026-11-09` @ `ba99f9124`, not committed here) was run over this lane's eleven files at the parent and at the tip:
- **faction:** 5 → 0
- **rather-than:** 2 → 0
- **every other phrase:** 0 → 0

The 1,000-dossier soak referee (BRIEF §0.4) does not read the news card: the dossier's generation does not run the pulse, and the golden master is unchanged above. So its twenty frames cannot be raised by these lines, and it was not run.

## §7 What stays (by file, for PULSE-DARK or SW-12)

- `relationshipRulesCore.js` — **A1·50:** the 30 other dark rule notes (two of them are the level-word gauges). They print as a body if the rule lights. The pattern is §2.3's: name the towns with `townName` / `pairNames` and state the act.
- `relationshipRulesAdversarial.js` — **A1·99:** 19 dark notes. **A1·100:** the hostile-occupation proposal summary, which prints the relationship-type tokens and `change.reason`.
- `wizardNews.js` — **A1·27:** `information_shock` → "unsettling news". No slot-true wording exists until the writer reads `impact.explanation`, and the phrase is pinned equal to `settlementRumors.js :: WHAT_PHRASES` by `newsSubjectVocabulary.walker`. Not taken (census law).
- `stressorAftermath.js` + `relationshipRulesCore.js` — **A1·105 / A1·109 / A1·49:** the stressor LABEL as the subject ("Religious conversion fracture has passed") and the residual tokens. These need the reader vocabulary per `stressor.type` at its owner (`stressorsCore.js`, A2, SW-12's file).
- `religiousContest.js :: :613` — the channel explanation "projects religious authority" (A1·69's second half; its consumers are unverified, and it is dark).
- `stressorAftermath.js` — **A1·113:** the close-of-crisis entries keep `kind: 'applied'`. The face contradiction it caused is gone: the body is the filed sentence, and an untravelling entry prints no status pill. The stored kind is unchanged because it would move curation.
- `src/components/map/heraldGrammar.js :: headlineSlotsOf` — the Herald prints a stored headline "byte-verbatim". It would print the succession question's id if the Herald files that question. It should read `readerHeadline` too; the file is not one of C2·26's two named sites, so this is a one-line follow-up.
- `src/components/home/landingFixture.js:189` — holds the old A1·73 line ("…only a matter of time"). This is a recorded fixture, not this lane's file; it is re-recorded through PEOPLE-LAND-2's door (A1 R6's precedent).
- **The merge seat's two one-line conflicts with SW-3 (`d96ae7a41`):**
  - `tests/components/wizardNewsChronicle.test.jsx`: take this lane's lines. They are keyed by `newsReaderSummary`, not its words, so SW-3's new wording passes.
  - `src/domain/display/newsBody.js`: there is no overlap. SW-3's pool line and climb-down summary sit in lines this lane did not touch.

**The sweep at the tip:** every test file that imports a changed module was run: 451 files, 4,835 tests. Before the register fixes, 8 failed. Five of them were this lane's and were cured in `ba6bc107e` (the any-cast ratchet ×4, the anchor walker ×1). One (`modeSpeedsWy1`) was re-keyed as TEXT ONLY. The two left fail at the base too (§8). Separately, the three record walkers (`sourceCitationIntegrity`, `ledgerCitationIntegrity`, `testRatchet`) are green.

## §8 Reds that are not this lane's (named by cause)

- `tests/domain/deityStanceLane.test.js` › "a corrupt influential minister is recruited by the plane-matching rival…" fails at `2053a809c` too.
- `tests/architecture/layerBoundaries.test.js` › "dependency-cycle set equals the checked-in baseline" (the `foodGenerator ↔ isolationSupport` cycle) is red at `2053a809c`.
- `typecheck:domain:strict` is red at the base on `src/domain/dossier/powerSupport.js` (+4), `factionRename.js` (+2) and `npcProfile.js` (+1), all untouched here.

## §9 CONFIRMED against PLAUSIBLE

**CONFIRMED** (executed here):
- the base sha;
- the pin red at the base and green at the tip;
- the 4,496-entry re-run, its counts, and the structural identity of the run before and after;
- the herald, witness and golden-master deltas;
- the walker phrase counts;
- every test named in the commits.

**PLAUSIBLE:**
- each new line's reading against the law and the census (one reader, the seat);
- the dark rows' behaviour when they light;
- that the app's named graph prints the towns where the harness prints "a far settlement" (read from `nodeNameMap`, not rendered here).
