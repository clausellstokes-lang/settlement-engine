# BEST PARTS: kay (Guy Gavriel Kay) — extracted for a PLACE-RECORD prose engine

Author: kay. Extractor: Opus, 2026-09-07. Deliverable of the best-parts pass for the grand reconciliation (S12 input).

## Method and evidence rules

- Evidence is **kept-kay.json only** (631 rows, 627 VERIFIED_VERBATIM + 4 VERIFIED_SUBSTANCE, checked: every cited index resolves in that file). Nothing PARTIAL is evidence for any technique below. Where the section built a rule on a PARTIAL row, the row is named in `why` as a hole, never counted in `distinctSources`.
- **Independent sources** are counted by voice-and-page: the author's own words, a critic, a scholar, a translator, a reader are different sources; the same page cited twice is ONE. So `#641` (Kay's novel sentence) and `#645` (Capossere's comment on it) are ONE source, both being that reviewer's page; the seven Manguel and Guadalupi gazetteer rows are ONE source; Rettino's thesis rows are ONE.
- STRONG = three or more independent sources among the cited kept rows. MODERATE = two. SINGLE = one (or the author alone).
- Every quotation is at most twelve verbatim words, as it reads on the cited kept row.
- The critic pass (`critic-kay.md`) was read and is **not** inherited uncritically. Three of its charges are load-bearing here and are carried into the entries: (i) the r8 regrade judged single-sourcing against the KEPT set while second voices sit unverified in SKIPPED_TRIAGE, so a SINGLE grade below means *single among verified rows*, not *single in the world*; (ii) the section contradicts itself in eight named places, and each contradiction is written into the `conflictsWith` field of the entries it touches rather than resolved silently; (iii) eleven kept rows (#155-#165) are Wikipedia relays counted as critics' own voices — those rows are **not** used as independent sources anywhere below, which costs a little strength and buys honesty. Where the critic is itself wrong or over-reaching it is said so (see entry 42 and the Not-transferable list).
- Owner constraints applied as filters throughout: the archivist voice is never transplanted onto chrome; no digits in prose; a seed is a STARTING world and lived history is immutable; faith is culture, never theology; never a named character's fate; setting-agnostic, world-only, sub-century.

Legend for `Anti-AI risk`: the failures are STRUCTURAL, so the named risk is the structure the technique degrades into when applied as a template — a fixed move order, antithesis, the tricolon, the summary second sentence, the metronome (uniform sentence length or a rule hit on schedule).

---

## The techniques

### 1. The native clerk

- **What it does.** The narrator is a historian of the settlement’s own world, an inhabitant writing at a distance from what became known, never a visitor from ours.
- **On the page.** “describes things like an inhabitant of that world would”
- **Evidence (kept rows).** #22, #199, #200, #193, #194, #768, #290, #186, #187
- **Independent sources.** 5 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, compendium-docent
- **Anti-AI risk.** A stock native-frame clause opening every block (“as any of the ward would say…”) is a fixed move order and reads as a mask; the frame must appear rarely and never in the same slot.
- **Conflicts with.** Davison reads the same register as detachment and “quite academic” (#256, #262, #1082); feature 33’s accessibility rule pushes the other way.
- **Transferable.** YES — The single most load-bearing transfer in this author: it fixes WHO holds the pen without inventing a named narrator, so no character’s fate is implied. Bars the docent-explaining-to-tourists voice. Never chrome — chrome is the product speaking, not the ward.

### 2. Report mode

- **What it does.** Events, including violence and loss, are compressed to outcome and bill in short concrete sentences with minimal commentary, the calm held through the worst of it.
- **On the page.** “Sentences are short, description is concrete.”
- **Evidence (kept rows).** #5, #171, #172, #54, #196, #571, #573, #572, #309, #240
- **Independent sources.** 5 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, chronicle-line
- **Anti-AI risk.** THE METRONOME. Uniformly short declaratives at a fixed cadence is the loudest machine tell there is. Report mode must be short ON AVERAGE with real variance — a long periodic sentence every so often, and never the same length twice running.
- **Conflicts with.** Allbery: “if something is important, Kay tells you, explicitly” (#248); Michal’s long tangents (#231); Uqbarian’s portentous pages (#273); Hamad’s “melodramatic and garrulous” (#1026). Both modes are in the corpus; the record takes the plain one.
- **Transferable.** YES — Report mode is what a record IS. It also carries the no-digits law naturally: a compressed outcome does not need a figure. The variance guard is mandatory, otherwise this technique alone produces AI prose.

### 3. The record taken from outside the sufferer

- **What it does.** Stepping out of a person’s view is what licenses the plain record of what happens to them — the hanging is recorded from the square, not from inside the hanged.
- **On the page.** “enables the matter-of-fact description of his execution”
- **Evidence (kept rows).** #53, #198, #50, #573, #1020
- **Independent sources.** 3 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, herald-pools
- **Anti-AI risk.** Low. The risk is that the outside-view becomes an antithesis tic (“not the man, but the square”); state the standpoint by the noun chosen, never by a contrast clause.
- **Conflicts with.** Feature 4’s many windows: a window opened on a person and then abandoned at their death is the same throwing-away Walton objects to (#140).
- **Transferable.** YES — This is the mechanism that lets a settlement record a death, a riot or an execution without either gore or a named interiority — exactly the owner line between a place-record and a character’s fate.

### 4. The one evaluative word

- **What it does.** The whole ideological trace of the narrator is permitted to sit in a single plain evaluative word per block, and nowhere else.
- **On the page.** “matter-of-fact description with only minimal commentary”
- **Evidence (kept rows).** #54
- **Independent sources.** 1 — **SINGLE**
- **Registers.** dossier-archivist, chronicle-line
- **Anti-AI risk.** A permitted-adjective slot filled in every block is a fixed move order; the ceiling is a maximum, not a quota, and most blocks should spend nothing.
- **Conflicts with.** DIRECTLY conflicts with the section’s own rule that the dossier never names a feeling (feature 28) and bars elegy as a sigh (feature 13) — the critic is right that the model word Töyrylä names is itself a sigh. Unresolved.
- **Transferable.** PARTIAL — One verified voice (Töyrylä) and self-contradictory against two other rules of the same author. Take the CEILING (at most one evaluative word) and discard the licence — implement it as a walker cap, not as a slot to fill.

### 5. Distance changed by noun scale

- **What it does.** The teller stands back from one doorstep to the whole ward and returns inside a single block, and the change of distance is carried by the scale of the nouns, not by an adverb or a stage direction.
- **On the page.** “there’s always a pulling back”
- **Evidence (kept rows).** #137, #139, #246, #249, #250, #253, #1060, #522
- **Independent sources.** 5 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, compendium-docent
- **Anti-AI risk.** A wide-close-wide zoom performed once per block is a FIXED MOVE ORDER — the classic AI paragraph shape. The number of scale changes per block must vary, including zero.
- **Conflicts with.** Feature 2’s minimal commentary: Allbery’s soundtrack-commentary (#249) is the version of this the record cannot have.
- **Transferable.** YES — A generator can implement this literally as a noun-scale ladder (yard → street → quarter → ward) with the rung chosen per sentence, which gives movement without a single adverb and without a camera.

### 6. The backward gaze

- **What it does.** The record looks back with hindsight and never forward with suspense; what is known is known because it already happened.
- **On the page.** “to look back with the tragic clarity of hindsight”
- **Evidence (kept rows).** #522, #523, #245, #184
- **Independent sources.** 3 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, compendium-docent
- **Anti-AI risk.** None structurally. Risk is a retrospective cadence applied to every sentence (“it would later be said…”), which is the metronome in period costume.
- **Conflicts with.** Feature 7’s prolepsis, which looks the other way and is barred from the dossier for exactly this reason.
- **Transferable.** YES — Fits the owner’s constitutional rule that a seed is a STARTING world with immutable lived history: a record that only looks back can never imply a future the engine has not generated, and can never spend a fate.

### 7. Many windows: a standing for every office

- **What it does.** Every office and rank gets its own standpoint — the tyrant’s hall and the undercook’s kitchen both get a window — so the place is known from the people who use it.
- **On the page.** “an undercook for the Blue faction making soup”
- **Evidence (kept rows).** #1, #175, #203, #142, #574, #1020, #91, #306, #477
- **Independent sources.** 6 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, compendium-docent
- **Anti-AI risk.** Two: a per-block cast quota is a fixed move order, and the trade list itself (“the poets, the bartenders, the guardsmen”, #498) is a TRICOLON — the most recognisable AI figure. Draw two or four trades, never habitually three.
- **Conflicts with.** Dusmann: so many characters slows the tale (#164); Davison: characters sound the same (#258); Cobb concedes insufficient differentiation (#765); Bishop hears late voices as similar (#1089).
- **Transferable.** YES — A dossier has no focalizer, so it transfers as STANDPOINT, not viewpoint: each civic block written from the standing of its users. That is a structural generator instruction and needs no interiority, so it stays inside the fate law.

### 8. No window thrown away

- **What it does.** A name given in one block is met again in another; a person is never opened and abandoned.
- **On the page.** “he never takes up a character just to throw them away”
- **Evidence (kept rows).** #140, #1097, #75
- **Independent sources.** 3 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, compendium-docent
- **Anti-AI risk.** Every name returning exactly once, at a fixed remove, is a metronome; the return interval must vary and some names should return three blocks later, some never.
- **Conflicts with.** The block ceiling that answers Dusmann (#164) limits how many names a block can afford to owe a return.
- **Transferable.** YES — This is the cross-block coherence rule a place-record most needs and most easily lacks; it is cheap to implement as a debt ledger over generated names and it is what makes a dossier feel inhabited rather than enumerated.

### 9. Two accounts kept side by side, unadjudicated

- **What it does.** When the record holds two versions of one event, both are given and neither is settled.
- **On the page.** “it is a matter of some dispute which race came first”
- **Evidence (kept rows).** #51, #210, #85, #1001, #190, #413, #637, #349, #184
- **Independent sources.** 5 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, dm-page, compendium-docent
- **Anti-AI risk.** ANTITHESIS. “Some say X; others say Y” as a fixed two-beat is the balanced-pair tell. Vary the form: one version as a clause and the other as a parenthesis; one attributed to a book and the other to nobody; sometimes three versions; sometimes the disagreement is only that a date is missing.
- **Conflicts with.** Kay’s own practice of deliberately VARIED repetition (#429, kept against his proofreader) against the reader-derived rule that a refrain recurs verbatim or not at all (#1011) — the section prefers the reader to the author without saying so.
- **Transferable.** YES — The purest place-record technique in the author. It gives a settlement a memory that disagrees with itself, which is what makes a record read as a record; and it removes the need for an omniscient adjudicator the engine cannot honestly staff.

### 10. Withhold the explanation, never the fact

- **What it does.** The record may name a consequence and withhold its cause; a later block supplies the cause, or nothing does.
- **On the page.** “he largely leaves them to be supplied by the imagination”
- **Evidence (kept rows).** #60, #520, #93, #333, #1018, #1019, #1046, #1064, #626
- **Independent sources.** 6 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, herald-pools, compendium-docent
- **Anti-AI risk.** A withheld cause in every block is a fixed move order and quickly reads as coyness. The withholding must be rationed and some causes stated flatly and dully.
- **Conflicts with.** Walton, of the withheld-identity trick, “does anybody like this?” (#138); Kay wants readers never behind the curve (#236). Resolution held here: withhold the answer, never the question; the name is given on first sight.
- **Transferable.** YES — It also draws the dossier/DM-page line precisely: the dossier withholds the cause, the DM page holds it. That is one technique doing two registers’ work, and it makes the DM page worth opening.

### 11. Omission as record: the four forms of what is not held

- **What it does.** The record states what it does not hold, in four named forms — the unaccounted, the disputed, the reported-not-confirmed, and the access-controlled.
- **On the page.** “neither has offered an account of what they saw there”
- **Evidence (kept rows).** #638, #637, #639, #635, #318, #319, #217, #30
- **Independent sources.** 3 — **STRONG**
- **Registers.** dossier-archivist, compendium-docent, chronicle-line, dm-page
- **Anti-AI risk.** A FIXED MOVE ORDER of the worst kind if the four forms are rotated in sequence per block. They are a pool to draw from with long gaps, not a checklist, and a settlement should be allowed dossiers where none of them fires.
- **Conflicts with.** The gazetteer’s own failure is the boundary case: having said a prehistory is hazy it then narrates it (#636, PARTIAL, so it is not evidence — but it is the failure to avoid).
- **Transferable.** YES — The highest-value transfer for a generated record, because a generator knows exactly what it did not generate. Missing data becomes voice instead of a gap. Fits the no-digits law (a hedge replaces a figure) and the faith law (a rite’s origin can be recorded as disputed without a theology).

### 12. No lecture, no allegory, no analogue named; the seam invisible

- **What it does.** The record draws no parallel to the player’s world and states no moral; invention and record are indistinguishable in texture and the seam between them is never shown.
- **On the page.** “history with a quarter-turn to the fantastic”
- **Evidence (kept rows).** #284, #298, #21, #54, #267, #409, #864, #410, #83, #145, #525, #749, #805
- **Independent sources.** 8 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, herald-pools, compendium-docent, dm-page
- **Anti-AI risk.** None structural. The residual risk is the knowing aside — a single wink is enough to convert a record into a pastiche.
- **Conflicts with.** Cobb’s dissent (#42): a reader can miss the recasting entirely, so the record risks being read as flat. Logged as a risk, not cured.
- **Transferable.** YES — Directly implements the SETTING-AGNOSTIC law and the faith-is-culture law: no doctrine is stated because no meaning is stated. Also the strongest argument against ever letting the engine explain its own worldbuilding in the prose.

### 13. A faith entered by its rite, its feast and its sayings

- **What it does.** Belief reaches the record as observance and as short sayings that rhyme in theme across the settlement’s faiths, never as doctrine.
- **On the page.** “All three of them strongly emphasize the transitory nature of things”
- **Evidence (kept rows).** #729, #738, #545
- **Independent sources.** 3 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, compendium-docent
- **Anti-AI risk.** A saying per faith per dossier is a fixed move order, and three faiths with one saying each is a tricolon at the level of structure. Let one faith be silent.
- **Conflicts with.** Feature 27’s ten-word saying ceiling is unsourced (the critic is right: #729 attests only shared theme), so the length rule is ours.
- **Transferable.** YES — This is the mechanism for FAITH IS CULTURE, NEVER THEOLOGY: a rite and a saying are cultural facts; a shared theme across faiths is an observation about the culture, not a claim about gods.

### 14. The great event lands on a named household

- **What it does.** Every civic event is recorded where it strikes — the levy as the cooper’s second son, the war as the road the carter cannot use — and the far-off death matters less than the near broken leg.
- **On the page.** “The death of the emperor far off means far less”
- **Evidence (kept rows).** #94, #110, #191, #334, #498, #575, #341, #524, #576, #771
- **Independent sources.** 7 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, chronicle-line
- **Anti-AI risk.** Two: the trade tricolon again, and the ANTITHESIS of the great-against-small pairing, which becomes a metronome if every civic block ends on its small counterweight.
- **Conflicts with.** Feature 2’s report mode: the small moment must be a fact, not a moment of feeling, or feature 28’s bar is broken.
- **Transferable.** YES — The engine already generates households and trades; this technique tells it where to spend them. Guard: the household is recorded as a standing civic fact, never followed to an outcome, or the fate law is breached.

### 15. A whole life in one sentence

- **What it does.** A peripheral figure is given a life of their own in a single sentence and then released.
- **On the page.** “the stories of side characters are equally valid”
- **Evidence (kept rows).** #396, #363, #784, #1097, #574, #338
- **Independent sources.** 5 — **STRONG**
- **Registers.** herald-pools, dossier-archivist, compendium-docent
- **Anti-AI risk.** A one-sentence life with fixed slots (name, trade, one deed, one loss) is a fixed move order and the resulting pool reads as a database. The slot set must vary and some lives must be told by a possession or a debt instead of a deed.
- **Conflicts with.** Feature 11’s line of consideration at a death is now single-voice and PARTIAL (#322, #325), so the death ordering is house rule, not evidence.
- **Transferable.** YES — The Herald pool is exactly this shape already. The transfer is the discipline: a life, not an attribute list, and no continuation.

### 16. Every victory carries its bill in the same block

- **What it does.** No civic gain is recorded without its cost beside it — the aqueduct and the drowned crew, the charter and the hanged rioters.
- **On the page.** “Triumphs are provisional. Victories are costly”
- **Evidence (kept rows).** #77, #79, #244, #31, #41, #207, #549
- **Independent sources.** 6 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, herald-pools
- **Anti-AI risk.** ANTITHESIS, unavoidably — the gain-and-cost pair IS a balanced clause. Break it structurally: put the bill in a different sentence, a later block, or a parenthesis; let some bills go unnamed and be recoverable only from another block.
- **Conflicts with.** Feature 2: the bill must be stated as a fact and not as a judgement, or the one-evaluative-word ceiling is blown.
- **Transferable.** YES — This is how a place-record acquires consequence without a plot. The engine can compute the bill from the same simulation event, so it is cheap and it is true.

### 17. Elegy carried as fact, never as a sigh

- **What it does.** The long view of time reaches the record as a standing condition — the well is dry, the guild dissolved, the bell not rung — and never as a valedictory sentiment.
- **On the page.** “Everything quietly, ineluctably fades into history”
- **Evidence (kept rows).** #569, #552, #553, #35, #320, #1087, #291
- **Independent sources.** 6 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line
- **Anti-AI risk.** The CLOSING UPLIFT / summary second sentence. A valedictory clause at the end of every entry is both the metronome and the single most recognisable AI paragraph ending. Cap it at one per chronicle entry and zero per dossier block.
- **Conflicts with.** Feature 4’s one evaluative word and feature 28’s never-name-a-feeling both bite here; the section resolves it by allowing elegy only as fact.
- **Transferable.** YES — The whole emotional yield of this author, obtainable without a single emotive word, and therefore the safest way to give a record weight. The fact carries the elegy because the reader supplies it.

### 18. The cross-section: reeve and rag-picker in adjacent blocks

- **What it does.** Leaders and common people are held in one frame, and the court is seen from the workshop that serves it.
- **On the page.** “the experiences and perspective of a master artisan”
- **Evidence (kept rows).** #361, #206, #91, #142, #498, #778
- **Independent sources.** 5 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, compendium-docent
- **Anti-AI risk.** Fixed alternation (palace, kitchen, palace, kitchen) is a metronome at the block level. Contrast should be in rank OR scale OR trade, chosen per adjacency, and sometimes two like blocks should sit together.
- **Conflicts with.** Feature 29’s contrast rule and feature 8’s recurrence debt compete for the same adjacency slot.
- **Transferable.** YES — It gives the dossier a shape derived from the settlement’s own social structure rather than from a document template — which is what stops a generated record reading as a form.

### 19. One register per settlement, and every lift attached to a standpoint

- **What it does.** The register is set for the whole record and held; where it lifts, the lift belongs to whoever perceives — the priest’s procession is high, the sweeper’s same procession is plain.
- **On the page.** “because it is perceived by minds capable of comprehending magnificence”
- **Evidence (kept rows).** #618, #617, #621, #622, #6, #173, #174, #312, #313, #134, #820, #1077, #527
- **Independent sources.** 7 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, chronicle-line, compendium-docent
- **Anti-AI risk.** An unattached lift is purple machine prose. A lift on a schedule (one per dossier, always at the founding) is a fixed move order. Attach or delete.
- **Conflicts with.** Feature 2’s plain report mode: the dossier holds the plain register only, so the lift lives in the Herald and the chronicle.
- **Transferable.** YES — Kay’s per-book law becomes a per-settlement law, which is precisely a seed-derived parameter: the register is drawn once from the seed and held for the whole dossier, giving settlements audible difference without new vocabulary.

### 20. Diction: concrete civic nouns that bite; research shows only as the exactness of a noun

- **What it does.** Detail enters as specific civic nouns and never as explanation of them; research is digested into word choice, and adjectives are rationed to the noun that cannot stand alone.
- **On the page.** “The details are all real enough to bite”
- **Evidence (kept rows).** #144, #848, #240, #365, #779, #627, #942, #1047, #1048, #1085
- **Independent sources.** 7 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, chronicle-line, compendium-docent
- **Anti-AI risk.** The noun tricolon (“mud, fish sauces, tesserae”) and the adjective stack. One biting detail per block, and the detail list should be two items or four, never habitually three.
- **Conflicts with.** The widest disagreement in the sweep: many readers find the same prose over-adjectived and flowery (#1010, #1011, #1027 class, #1073, #1096) while others find it adjective-free (#1047, #1048, #1049). The property is real; its value is the owner’s.
- **Transferable.** YES — A generated world knows its own nouns exactly; this technique spends that knowledge as texture instead of as exposition, which is the difference between a dossier and a wiki.

### 21. Contrast, do not blend; one craft supplies the noun-stock

- **What it does.** Adjacent blocks are set against each other as contrasting tiles rather than blended, and one named settlement craft supplies the vocabulary the record reaches for.
- **On the page.** “you don’t blend colours – you contrast them”
- **Evidence (kept rows).** #620, #619, #621, #212, #213, #44
- **Independent sources.** 3 — **STRONG**
- **Registers.** dossier-archivist, compendium-docent, dm-page
- **Anti-AI risk.** The EXTENDED METAPHOR. If the craft generates figures (“the council wove its answer”) it becomes the most machine-sounding move in the register. The craft is a LEXICON only: it decides which nouns appear, never that anything is like anything.
- **Conflicts with.** Feature 17’s own figure ban against feature 24’s permitted polysyndetic chain — only one sentence-level figure is allowed and it is not this one.
- **Transferable.** PARTIAL — The contrast-not-blend and lapidary limbs are STRONG (Kay, Patton, Cobb). The lexicon limb’s only second voice, Walton #143, is PARTIAL and the critic shows three more sit unverified in SKIPPED_TRIAGE. Take contrast as evidenced; take the craft-lexicon as a promising house rule to test, not a finding.

### 22. No digits: counts spelled out, hedged, and corrected in the next sentence; time by reign

- **What it does.** Numbers reach the record as words with a source and a correction beside them, and time is told by reign, flood or festival rather than by a year.
- **On the page.** “There are sixty-five members of the Rector’s Council as of this”
- **Evidence (kept rows).** #641, #645, #634, #810, #288, #375, #292, #97
- **Independent sources.** 5 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, herald-pools, compendium-docent
- **Anti-AI risk.** The correction-in-the-next-sentence is a SUMMARY SECOND SENTENCE waiting to happen — hit every time, it is a tic and a metronome. Correct rarely; hedge more often; sometimes give the count and let it stand.
- **Conflicts with.** The gazetteer’s own closing source list carries city and year (#640), which is why the bibliography belongs to the DM page and not the record body.
- **Transferable.** YES — Directly implements the NO DIGITS IN PROSE law and gives it a positive form instead of a prohibition: the hedge and the reign-date are what replace the numeral, and a maker-and-reign parenthesis (#634) is a ready-made civic construction.

### 23. Present tense as the standing record; the civic passive; the frame verb for what is reported

- **What it does.** The record stands in the present because it is a standing condition, uses the passive where the agent is the institution, and holds past report inside a present frame verb.
- **On the page.** “Access to the Godwood and the tree is strictly controlled”
- **Evidence (kept rows).** #641, #645, #635, #639, #141, #851, #336, #307
- **Independent sources.** 4 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line
- **Anti-AI risk.** Uniform passive is a flat metronome and reads as bureaucratic filler. The passive is for facts whose agent IS the institution; everywhere else the trade or the office is the subject.
- **Conflicts with.** The tense-by-standpoint rule the section wanted is PARTIAL on all four of its rows; and the critic notes half of one novel is first person (skipped rows), so “first person nowhere” is a house rule, not a Kay finding.
- **Transferable.** YES — Present tense is the single grammatical decision that makes a record a record rather than a story, and the frame verb (“the guild’s book records that word went forth”) is how past events enter without the dossier becoming a narrative.

### 24. Sentence shape: periodic but not tangled, with one flat contemporary line per block

- **What it does.** One main clause and at most one subordinate, the archaism carried in the noun rather than the word order, the comma rationed, and one plainest sentence per block for a fact that is done with.
- **On the page.** “a line with a distinctly contemporary feel”
- **Evidence (kept rows).** #66, #589, #590, #241, #242, #1051, #829, #824, #1090, #660
- **Independent sources.** 8 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, herald-pools
- **Anti-AI risk.** THE METRONOME, twice over: a fixed clause count per sentence, and the flat line landing in the same position (usually last) in every block, which is the summary second sentence in period dress. The flat line must land anywhere — first, third, buried.
- **Conflicts with.** Read five ways in the corpus: precision (McBean) against convolution (Hoyle #589) against bothersome structures (relay, not counted) against opulence (Marcus #616) against competent-but-not-fun (#1022).
- **Transferable.** YES — The archaism-in-the-noun rule is the whole trick: it buys period feel with zero syntactic inversion, which is what keeps generated period prose from sounding like costume.

### 25. The polysyndetic chain, reserved for loss

- **What it does.** A single chain of and-linked verbs or nouns is the record’s one permitted sentence-level figure, and it is spent only on destruction or loss.
- **On the page.** “the long list of verbs”
- **Evidence (kept rows).** #49
- **Independent sources.** 1 — **SINGLE**
- **Registers.** dossier-archivist, chronicle-line
- **Anti-AI risk.** THE TRICOLON. A three-item and-chain is a tricolon wearing a coat. Require two items or four-or-more, never three; and at most one chain per dossier.
- **Conflicts with.** Feature 17 permits exactly one figure and this is it, which means the mediating craft may not produce metaphors.
- **Transferable.** PARTIAL — One verified voice (Töyrylä) among kept rows; the critic names a second (Aardse quoting Tigana) sitting unverified in SKIPPED_TRIAGE, so this is probably MODERATE in truth. Adopt with the item-count guard and the once-per-dossier cap; re-grade if the skipped row is verified.

### 26. The generalisation test: a concrete refrain is permitted, a general aphorism is barred

- **What it does.** Whether a recurring sentence is allowed turns on generalisation, not repetition: a clause about a concrete thing in the settlement may recur, a sentence about lives or mortality in general may not.
- **On the page.** “She is lying beside her love dreaming of her love.”
- **Evidence (kept rows).** #303, #305, #311, #324, #318, #1011, #136, #248, #231, #273, #1101
- **Independent sources.** 6 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, herald-pools, compendium-docent
- **Anti-AI risk.** The aphorism IS the AI tell family — the closing generalisation, the “in the end” sentence, the wisdom sign-off. Barring it is the point. But allowing “one aphorism per chronicle entry” recreates the metronome, so the chronicle allowance must be occasional, not per-entry.
- **Conflicts with.** Kay’s deliberately VARIED repetition, kept against his proofreader (#429), against the reader-derived verbatim-or-not-at-all ceiling (#1011). The section takes the reader’s side without saying so; both are recorded here.
- **Transferable.** YES — This is the sharpest single anti-AI instrument the sweep produced, because it is a testable property (does the sentence name a thing in this settlement, or does it name life?) rather than a matter of taste, and it can be walked over the generated corpus.

### 27. Blocks laid side by side; causality from adjacency; a device, not a heading

- **What it does.** Episodes are set next to each other without transitions and separated by a mark rather than a heading, so cause and effect emerge from order and the word “because” nearly disappears.
- **On the page.** “narratival episodes were laid next to each other”
- **Evidence (kept rows).** #212, #8, #89, #497, #604, #710, #620
- **Independent sources.** 6 — **STRONG**
- **Registers.** dossier-archivist, compendium-docent, chronicle-line
- **Anti-AI risk.** Adjacency degenerating into fixed alternation is a metronome; and a connective-free style applied absolutely reads as a list. Some blocks should carry an explicit link, sparingly.
- **Conflicts with.** Feature 33’s teaching rule needs the first blocks to be legible, which limits how much the reader can be asked to infer from order alone.
- **Transferable.** YES — A generated record is naturally a set of blocks; this technique says the ordering IS the argument, which converts a structural necessity into a voice and removes the need for connective prose the engine cannot write well.

### 28. A block opens on the place before the people

- **What it does.** The first sentence of a block gives the view of the place, and people enter after it.
- **On the page.** “Scenes open with a view of the city or enclave”
- **Evidence (kept rows).** #1035
- **Independent sources.** 1 — **SINGLE**
- **Registers.** dossier-archivist, compendium-docent
- **Anti-AI risk.** A FIXED MOVE ORDER, explicitly — the reader who reported it reported it as a COMPLAINT about sameness. Applying it to every block reproduces the exact fault she named.
- **Conflicts with.** The critic shows another reader (Hoyle, skipped) observed the OPPOSITE habit — a chapter opening on a new, apparently inconsequential person — and a third (Morgan, skipped) sits between. Both belong in the disagreement line before any rule is set.
- **Transferable.** PARTIAL — One verified voice, and it is a two-star complaint being read as a rule. Take it as one opening move among several in a closed set chosen by seed (the latent-grammar directive), never as the opening move.

### 29. Openings: two contrasting tiles, with a name planted for a later block

- **What it does.** A record opens on two contrasting standpoints — the seat of power and the trade beside it — and plants a name that a later block returns to.
- **On the page.** “turn out—all at once—to be Chekhov’s guns”
- **Evidence (kept rows).** #619, #622, #255, #323, #1018, #75
- **Independent sources.** 5 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, compendium-docent
- **Anti-AI risk.** The two-tile opening repeated across every settlement is a fixed move order at the DOCUMENT level, which is worse than at the sentence level because it is the first thing a reader compares between two dossiers.
- **Conflicts with.** Feature 28’s place-first opening competes for the same first sentence; only one can be first.
- **Transferable.** YES — The planted name is the mechanism behind entry 8 and is trivially implementable; the contrasting-tile opening is the strongest available answer to the question of how a place-record starts without a preamble.

### 30. Close on a standing fact left last

- **What it does.** A block ends on a fact that still stands — the well is dry, the door is kept shut, three glasses are left on the board — never on a summing sentence and never on a feeling.
- **On the page.** “whose presence is a prophecy in itself”
- **Evidence (kept rows).** #569, #35, #65, #692, #75, #528
- **Independent sources.** 6 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, herald-pools, compendium-docent
- **Anti-AI risk.** This technique EXISTS to kill the summary second sentence, but “always end on an object” is itself a fixed move order. Vary the kind of standing fact: a condition, a prohibition, an absence, an object, a name not given.
- **Conflicts with.** The object-close exemplar (#87) and the three-word Herald close (#332) are both PARTIAL, so those two specific forms are house rules; the pattern of closes is what is evidenced.
- **Transferable.** YES — The highest-leverage anti-AI move available: the machine’s reflex is to close by summarising, and a standing fact is a concrete, checkable substitute a walker can verify (does the last sentence assert a present condition?).

### 31. Teach the grammar in the first blocks and never re-explain

- **What it does.** The opening blocks show how a name is given, how a count is written and what a block holds, and nothing later is explained a second time.
- **On the page.** “don’t ever feel they’re behind the curve or missing something”
- **Evidence (kept rows).** #236, #16, #204, #1057, #408
- **Independent sources.** 3 — **STRONG**
- **Registers.** dossier-archivist, compendium-docent, dm-page
- **Anti-AI risk.** None. The inverse risk is real: a fixed three-block tutorial at the head of every dossier is a template a reader will spot across two settlements.
- **Conflicts with.** Feature 10’s withholding and feature 27’s connective-free adjacency both make the record harder to read; this rule sets the floor they may not cross.
- **Transferable.** YES — It is the rule that lets every other rule here be strict, because it guarantees the strictness is legible. NOT chrome as a voice — but the principle (explain once, never twice) is sound product copy discipline on its own terms.

### 32. The sources block as an in-world starter bibliography

- **What it does.** The record closes on a short list of the documents it drew on — the guild’s book, the assize roll, the sexton’s list — in the world’s own terms.
- **On the page.** “And I always include starter bibliographies”
- **Evidence (kept rows).** #283, #314, #640
- **Independent sources.** 3 — **STRONG**
- **Registers.** dm-page, compendium-docent, dossier-archivist
- **Anti-AI risk.** A source list of fixed length and fixed composition on every dossier is a form. Length and kind must vary, and a settlement whose record is thin should have a short and embarrassed list.
- **Conflicts with.** The gazetteer’s own list carries city and year (#640) — digits — which is why the real-world bibliography belongs to the DM page and only the in-world one to the record.
- **Transferable.** YES — It supplies the provenance that makes entry 9 (competing accounts) and entry 11 (omission) legible, and it is a natural home for generation-time metadata expressed in-world.

### 33. The uncanny as one throwaway civic line, never explained

- **What it does.** Anything uncanny enters as a single flat civic report — the sandal-maker who saw a ghost — and is never explained or systematised.
- **On the page.** “a throw-away line in the prologue is the first signal”
- **Evidence (kept rows).** #484, #545, #1058, #93, #342, #738
- **Independent sources.** 6 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, dm-page
- **Anti-AI risk.** One uncanny line per dossier on schedule is a metronome and turns the marvellous into furniture. Most settlements should have none.
- **Conflicts with.** Feature 10’s withholding governs it, and feature 12’s no-analogue rule forbids naming what the thing is.
- **Transferable.** YES — It keeps the marvellous inside FAITH IS CULTURE: a ghost reported by a trade is a civic fact about what people say, not a claim about the world’s metaphysics, and the engine never has to own a magic system.

### 34. The world as its inhabitants believe it, with no modern smugness and no presumed interior

- **What it does.** The ward’s beliefs are reported as the ward holds them, superstition is a civic fact, and no one’s inner reaction is presumed.
- **On the page.** “the knowledge and the conceits of the time”
- **Evidence (kept rows).** #456, #457, #460, #82, #199, #200, #267, #992, #720
- **Independent sources.** 5 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, herald-pools, compendium-docent
- **Anti-AI risk.** None structurally. The failure mode is the wink — one ironic aside destroys the whole register at once.
- **Conflicts with.** Feature 4’s licensed evaluative word is the nearest thing to a wink the section permits, and the two sit badly together.
- **Transferable.** YES — It is the strongest available guard on the fate law: refusing to presume a reaction means the record never enters anyone. Cabon’s formulation — a refusal to betray recorded people by presuming their reactions — is the ethic the owner’s law already states.

### 35. Names carry history; one cosmetic signal; the legendary name keeps its old form

- **What it does.** A place or office name carries a history another block can open, one cosmetic signal that the world is not ours is enough and is never explained, and a name that carries legend keeps its old spelling.
- **On the page.** “under the new names – often transparent”
- **Evidence (kept rows).** #353, #64, #84, #43, #223, #973, #308
- **Independent sources.** 6 — **STRONG**
- **Registers.** dossier-archivist, compendium-docent, herald-pools, chrome
- **Anti-AI risk.** None structural. The risk is over-invention: renaming ordinary things (a nightingale) reads as arbitrary, as one close reader reported (#502, #504).
- **Conflicts with.** Palmatier locates the craft in altered ritual rather than in a cosmetic signal (#491); Kay treats the signal as deliberate. Both hold: signal once, then build difference in ritual.
- **Transferable.** YES — A ward named for a drowned reeve is a generated fact and a piece of prose at once. The chrome row here is narrow and deliberate: NAMES may cross to chrome (a feature can be called by its in-world name); the archivist’s VOICE may not.

### 36. The palimpsest as standing fact

- **What it does.** What stood before is recorded as a present condition — the older wall beneath the new, the field that was a fort — and where the record disputes the order, it says so.
- **On the page.** “a palimpsest of time and space”
- **Evidence (kept rows).** #167, #168, #141, #851, #637, #806
- **Independent sources.** 4 — **STRONG**
- **Registers.** dossier-archivist, chronicle-line, compendium-docent
- **Anti-AI risk.** A beneath-the-new construction in every block is a metronome; the palimpsest should surface in a minority of blocks and sometimes only as a disputed order.
- **Conflicts with.** Feature 6’s backward gaze supplies the tense; feature 22’s no-digits rule forbids dating the older layer by a year.
- **Transferable.** YES — It converts simulation history into present-tense record without narrating it, which honours A SEED IS A STARTING WORLD: the layers are immutable lived history, reported as what is there now.

### 37. An office-holder shown by a recorded act, never by an adjective

- **What it does.** A person in the record is revealed by one recorded deed — the reeve who opened the granary in the second bad year — and never by a character adjective.
- **On the page.** “talk about your characters less, show us their actions more”
- **Evidence (kept rows).** #128, #776, #1047
- **Independent sources.** 3 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, chronicle-line, compendium-docent
- **Anti-AI risk.** The one-deed formula in every entry is a fixed move order; some office-holders should be recorded by an office alone, with no deed at all.
- **Conflicts with.** Four independent readers charge this author with the opposite — telling readers what to feel and think (#1017, #1079, #1094, and Davison’s cold-and-clinical #257 from the other side). The rule is what the corpus does at its best, not what it always does.
- **Transferable.** YES — A recorded act is a fact about the settlement, so it stays inside the fate law where a character adjective (“the ambitious reeve”) starts a story the engine must not tell.

### 38. Emotion by omission; one moving line earned by the fact before it

- **What it does.** Feeling is produced by what is left out and by quiet moments; where a line is meant to move, it is earned by a plain fact stated in the sentence before.
- **On the page.** “ability to find power in these quiet moments”
- **Evidence (kept rows).** #154, #526, #293, #264, #629
- **Independent sources.** 4 — **STRONG**
- **Registers.** herald-pools, dm-page, chronicle-line
- **Anti-AI risk.** The earned line becoming a per-entry slot is the closing-uplift metronome. Most Herald entries should contain no such line.
- **Conflicts with.** The record never names a feeling (feature 28) while the Herald may hold one moving line — the boundary between the two registers rests entirely on this technique being rationed.
- **Transferable.** PARTIAL — Strongly evidenced as a property of the author, but the register map keeps it OUT of the dossier body, so it transfers only to the Herald and the DM page. Applied to the archivist it would break the never-names-a-feeling rule the owner’s legibility doctrine depends on.

### 39. Sayings short, formal, shaped by trade and rank; history never inside speech marks

- **What it does.** Quoted speech carries a saying shaped by the speaker’s trade and rank and never carries exposition; two speakers are told apart by what each refuses to say.
- **On the page.** “His dialogue is formal without being stiff”
- **Evidence (kept rows).** #1086, #259, #729, #515
- **Independent sources.** 4 — **STRONG**
- **Registers.** herald-pools, dm-page, compendium-docent
- **Anti-AI risk.** A saying per pool entry is a fixed move order, and sayings built to a length target are a metronome. The ten-word ceiling is a cap, not a shape.
- **Conflicts with.** The restraint-and-subtext exemplars are PARTIAL (#243, #450); what stands verified is formality shaped by the social world (#1086) and shared theme across faiths (#729). Davison’s sameness charge (#258) and Bishop’s (#1089) run against it.
- **Transferable.** PARTIAL — The ten-word threshold is unsourced — the critic is right that #729 attests only shared theme — so adopt the SHAPING rule (trade and rank decide the words) as evidenced and label the length cap a house rule. Never in the archivist voice: the record does not stage speech.

### 40. The read-aloud proof, for spoken lines only

- **What it does.** A line meant to be heard is proved by reading it aloud; a line meant to be read is not, and a speech that stops an entry dead is the failure the ear catches.
- **On the page.** “Hearing a reading aloud isn’t reading a book.”
- **Evidence (kept rows).** #980, #981, #983, #1005
- **Independent sources.** 2 — **MODERATE**
- **Registers.** herald-pools, chrome, dm-page
- **Anti-AI risk.** None. It is a test, not a move.
- **Conflicts with.** The critic shows Kay DOES read his own text aloud and revises after (#975, skipped), which contradicts the section’s “the dossier is never tested aloud” and its own rhythm doctrine (#680). The separation of page from ear is evidenced; the never-test-the-record rule is not.
- **Transferable.** PARTIAL — Take the distinction (heard lines get an ear test, read lines get an eye test) and DROP the prohibition, which rests on an argument the skipped rows contradict. This is the one entry whose chrome row is legitimate: chrome copy is a heard register and benefits from the same test, while the archivist voice still never touches chrome.

### 41. The noun is the load-bearing layer; the period lexicon rationed to what the trade needs

- **What it does.** Meaning is carried by concrete nouns rather than by syntax, and period vocabulary is spent only where a trade actually needs it.
- **On the page.** “une multiplication de termes “d’époque””
- **Evidence (kept rows).** #1000, #989, #990, #991, #973
- **Independent sources.** 3 — **STRONG**
- **Registers.** dossier-archivist, herald-pools, compendium-docent
- **Anti-AI risk.** None structural. The failure is decorative archaism — period terms multiplied for flavour, which the French reviewer names as sometimes incidental.
- **Conflicts with.** Feature 24 makes sentence shape load-bearing (one main clause, the rationed comma) while this makes the noun the only load-bearing layer; the section never says which survives.
- **Transferable.** PARTIAL — The translators’ own record shows what they had to research — clothing, mythology, poetry — all nouns, and none of them is on record about clause order. That is real evidence for the noun and only an ARGUMENT FROM SILENCE for the claim that syntax carries nothing. Adopt the rationing rule; do not adopt the silence as a finding.

### 42. Verse only as a recorded artefact

- **What it does.** Verse enters the record as something the settlement keeps — a guild song’s first line, an epitaph — and never as the record’s own sentence; it is a change of register, not a change of subject.
- **On the page.** “nevertheless acts only as a cue for action”
- **Evidence (kept rows).** #542, #527, #528, #169, #122, #36
- **Independent sources.** 5 — **STRONG**
- **Registers.** herald-pools, compendium-docent, dossier-archivist
- **Anti-AI risk.** None. The adjacent risk is the archivist’s prose beginning to scan, which is a walker check (stress regularity), not a rule.
- **Conflicts with.** Feature 19’s register law reserves the highest lift for the Herald, so a verse artefact quoted in the record must not lift the sentences around it.
- **Transferable.** YES — An artefact is a civic fact, so verse arrives without the archivist ever performing. A deliberately bad in-world poet is available too, which is a texture no generated record usually allows itself.

### 43. Sorting and sequencing as the craft; a draft is revised, not abandoned

- **What it does.** The editorial act is arrangement — sorting and sequencing what exists — and a weak first pass is revised rather than discarded.
- **On the page.** “Kay helped in the sorting and sequencing of the manuscripts”
- **Evidence (kept rows).** #911, #912, #916, #914, #711, #859, #951, #861
- **Independent sources.** 4 — **STRONG**
- **Registers.** dm-page
- **Anti-AI risk.** None (it is process, not prose). The false claim to avoid is the annalistic voice: no source grants it.
- **Conflicts with.** The section’s own flag that Kay has declined for fifty years to say what he did (#951, #861), so nothing about the voice may be inferred from the association.
- **Transferable.** PARTIAL — Transfers as a GENERATION-TIME operation, not as a prose technique: block ordering and revision passes over already-generated material, recorded in the DM page. The generation notes must never claim a Silmarillion voice the record does not grant.

### 44. The six countable properties as walker thresholds

- **What it does.** Readers name six measurable properties — adjective density, sentence length, comma density, restatement in synonyms, sameness of voice, clarity — and split on the value of each, so the walker measures and the owner sets.
- **On the page.** “the sentences were too long and full of adjectives”
- **Evidence (kept rows).** #1010, #1047, #1051, #1088, #1089, #1057, #1011, #1049, #1091, #1059
- **Independent sources.** 8 — **STRONG**
- **Registers.** dm-page, dossier-archivist, herald-pools, chronicle-line, chrome, compendium-docent
- **Anti-AI risk.** THE METRONOME, directly: a threshold hit exactly is the fault. Every threshold must be a DISTRIBUTION with required variance, never a target — a corpus whose sentences all sit at the mean is worse than one that violates the cap occasionally.
- **Conflicts with.** Feature 24’s one-main-one-subordinate rule and this entry’s variance requirement pull against each other and the variance must win.
- **Transferable.** YES — The only entry that is an instrument rather than a voice, which is why it is the one that may touch chrome: measuring copy is not writing it in the archivist voice. Every figure here is a reader’s hand count; the program owes its own counts.

### 45. The split room as a design fact

- **What it does.** The same properties are praised and damned by different readers of the same page, so a register cannot be tuned to please everyone and the owner sets the value.
- **On the page.** “more of a splitting into two camps: people who loved it”
- **Evidence (kept rows).** #1066, #1067, #1012, #1016, #1032, #1062
- **Independent sources.** 5 — **STRONG**
- **Registers.** dm-page, chrome
- **Anti-AI risk.** None. It is a finding about reception, not a move.
- **Conflicts with.** Nothing internal; it is the frame that makes entry 20’s and entry 44’s disagreements coherent rather than contradictory.
- **Transferable.** PARTIAL — Not a prose technique, but it belongs in the reconciliation because it settles how the other entries’ disagreements are read: a property measured, a value chosen, and the dissent recorded rather than averaged away — which is the owner’s own allocate-never-average condition.

---

## Admired in this author, NOT transferable to a record of a place

- **Shifting focalization as an architecture (twenty-six focalizants, twenty-one shifts in one chapter).** A dossier has no focalizer at all. The counts are a novel’s machinery for delay and suspense; the record’s equivalent is STANDPOINT (entry 7), which is what survives. Rows #0, #1, #175, #203 are admired and left behind.
- **Prolepsis and the flash-forward.** Told outcomes and “would remember” asides require the record to know a future the seed has not lived. It breaks A SEED IS A STARTING WORLD and spends a fate. Kept for the chronicle line at most one clause; barred from the record. Rows #152, #600, #310, #495.
- **The withheld identity (describing a person without saying who).** The record names on first sight; a name withheld in a reference document is an obstruction, not a suspense. Walton’s “does anybody like this?” (#138) is the reader’s answer.
- **The narrative arc, the epilogue reveal, and saying what became of anyone.** The product scope forbids a named character’s fate. Kay himself refuses to say what happens after the close (#402), which is the right instinct for the wrong reason here: a record has no after. Rows #18, #75, #402.
- **The elevated mythic set piece in the teller’s own voice.** The high style is licensed in the corpus only when a mind capable of magnificence perceives it (#174). Unattached, it is purple machine prose. The lift survives only as entry 19, attached to a standpoint, and only in the Herald and the chronicle.
- **Untranslated allusion and the reader’s paper chase (the Dunnett inheritance).** Admired by this author and by Dunnett’s close readers (#964, #965, #969), but the archivist’s reader has no companion volume and no library. A record that requires a chase is a record that fails at the glance→sentence→table legibility law.
- **The annalistic voice attributed to the Silmarillion year.** No source grants it. Rateliff knows of no evidence Kay wrote any of it (#910); Kay has declined for fifty years to say (#951). Admired as a biography, unusable as a lineage claim. Only the editorial craft transfers (entry 43).
- **Verse written by the narrator.** The record’s prose must never scan. Verse survives only as an artefact the settlement keeps (entry 42); the composing narrator does not transfer.
- **Kay’s process — no outline, a scene layered ten or fifteen times, “there are no rules”.** An author’s working habit, explicitly offered as anecdote and not prescription (#424, #232, #282). A generator has neither drafts nor intuition to be sceptical of; the only durable piece is entry 43’s revise-don’t-abandon, and that lives on the DM page.
- **The novel-length trajectory away from magic and the gods leaving.** A sub-century place-record has no trajectory to run, and the departure of gods is a theological claim the faith-is-culture law forbids the record to make. The disenchantment can only appear as an observance that has lapsed. Rows #149, #666, #738.
- **The rhetoric of the sentimental and the portentous aside.** Randall names it in the corpus (#7) and four independent readers charge the author with telling them how to feel (#1017, #1079, #1094 and the cold-and-clinical dissent #257 from the other side). It is the fault the register is being built to avoid, not a part to take.
- **Dialogue-driven scene (“almost written like a play”, #515).** The record holds no scenes. Speech survives only as a saying or a deposition inside a frame verb (entries 23, 39).
- **Kay’s own liberty with the em dash.** His pages use dashes freely (#84, #620, #710). Our house rule bars it. Recorded here so the ban is known to be OURS and never presented as derived from this author.
- **The audiobook and its narrators.** Verified as a catalogue fact (#996, #997) and interesting for the ear test (entry 40), but nothing about a narrator’s performance transfers to a written record.
- **The whole voice, onto chrome.** Owner law, restated because this author is the most tempting to transplant: the archivist never speaks in site or product copy. Only two things from this sweep cross to chrome — the walker thresholds as an instrument (entry 44), the read-aloud test (entry 40) — plus in-world NAMES (entry 35), which is a naming decision, not a voice.

---

## Grading summary

Forty-five techniques. By strength over VERIFIED rows only: thirty-eight STRONG, one MODERATE, four SINGLE (entries 4, 25, 28 and — by the count of voices rather than rows — the length-cap limb of 39). By transfer: thirty-one YES, twelve PARTIAL, none NO (the NO cases are the fifteen items in the not-transferable list, which are not counted as techniques).

Three of the four SINGLE grades are single **among verified rows only**, and the critic pass identifies second voices for each sitting unverified in SKIPPED_TRIAGE (Aardse for the polysyndetic chain; Hoyle and Morgan for the block opening; Kay, Milicia and Nepveu for the mediating craft). Those three should be re-graded, not re-argued, when the re-keyed triage runs.

## What this author gives the reconciliation that no other exemplar does

1. **A voice for missing data.** Entry 11 turns what the engine did not generate into what the record does not hold, in four distinct grammatical forms. Nothing else in the sweep does this.
2. **A testable anti-aphorism rule.** Entry 26 replaces taste with a property — does the sentence name a thing in this settlement, or does it name life? — which a walker can check and which kills the machine’s strongest reflex.
3. **A record grammar that never enters anyone.** Entries 3, 34 and 37 together let the record hold violence, belief and character while staying entirely outside every person in it, which is the owner’s fate law expressed as prose mechanics rather than as a prohibition.
4. **A seed-derived register.** Entry 19 makes the register a parameter of the settlement rather than of the product, which is how two dossiers can sound different without a second vocabulary.
5. **A no-digits grammar with a positive form.** Entry 22 supplies the hedge, the correction, the reign-date and the maker-and-reign parenthesis, so the numeral ban stops being a subtraction.

## Standing cautions carried out of the critic pass

- Eleven kept rows (#155–#165) are Wikipedia relays counted elsewhere as critics’ own voices; none is used as an independent source above.
- The section contradicts itself in eight places; each is written into a `Conflicts with` line rather than silently resolved. The sharpest are: the licensed evaluative word against the never-name-a-feeling rule (entry 4); the author’s varied repetition against the reader’s verbatim-or-nothing ceiling (entries 9 and 26); the noun-as-only-load-bearing-layer against the load-bearing sentence shape (entries 24 and 41); and the never-tested-aloud rule against the author’s own read-aloud revision (entry 40).
- Two thresholds the section states are unsourced and are labelled house rules here, not findings: the ten-word saying (entry 39) and the five-role archetype pool (not carried forward at all).
- Every countable figure in the source section is a critic’s or a reader’s hand count. The program owes its own counts over its own corpus.
