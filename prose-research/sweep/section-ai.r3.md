# Section: ai. Where generated prose fails against skilled human fiction and game writing

Built from `sweep/kept-ai.json` (177123 bytes, 2026-09-06 00:28:06, md5 f627993b2a4c3362aeb6ed18b6c0f1c6), `sweep/partial-ai.json` (85864 bytes, 2026-09-06 00:28:06, md5 8e3c8d6da8c1b3563fb42e8217f7816a) and `sweep/state-ai.json` (279026 bytes, 2026-09-06 00:28:06, md5 8268986b1f7f0d0338756f982105af93), which `node sweep-state.mjs merge ai --update-state` wrote at 00:21:42 in this run (output line: claims 254, verdicts 254, kept 173, partial 65, chunkFiles 13, verdictsFromFiles 247) and which a second merge rewrote at 00:28:06 with the same byte counts and the same 173 kept and 65 partial indices (the thirteen verdict inputs did not change between the two merges); the verdict inputs are `verdicts-ai-chunk-00.json` (15530 bytes, 2026-09-05 19:47:26), `verdicts-ai-chunk-01.json` (16516, 19:51:51), `verdicts-ai-i105-119.json` (13789, 20:45:33), `verdicts-ai-i120-134.json` (13235, 20:49:08), `verdicts-ai-i135-149.json` (14661, 20:53:57), `verdicts-ai-i150-164.json` (13469, 20:58:17), `verdicts-ai-i165-179.json` (12659, 21:02:58), `verdicts-ai-i180-194.json` (14609, 21:08:18), `verdicts-ai-i195-209.json` (14642, 21:14:39), `verdicts-ai-i210-224.json` (18812, 21:21:22), `verdicts-ai-i225-239.json` (17808, 21:27:31), `verdicts-ai-i240-253.json` (16546, 21:31:38) and `verdicts-ai-regrade-r1.json` (87896, 2026-09-06 00:21:16); 57 of the 254 verdicts carry no `fromFile` and come from the journal rebuild recorded in `state-ai.json` (`rebuiltFrom: journal+transcripts (rebuild-state.py, 2026-09-05 evening)`).

Citation convention: `[n]` is the claim index in `kept-ai.json` (or, in the partial table only, in `partial-ai.json`). Every quotation is the verifier's `trueWording`, trimmed to under twelve words; where the trimmed form is a substring the verifier confirmed contiguous, it is given without further mark. The sweep ran four angles: `peer-reviewed and arXiv studies` (indices 0 to 84), `novelists, fiction editors and developmental editors` (85 to 144), `publishing and games industry` (145 to 220) and `the case AGAINST the common tells` (221 to 253). Only VERIFIED_VERBATIM and VERIFIED_SUBSTANCE rows support a feature. PARTIAL rows appear only for their verbatim quotation, marked "(partial, quote only)", and never for the limb the verifier rejected; they are tabulated at the end. The 16 rows graded NOT_FOUND, CONTRADICTED or BLOCKED are cited nowhere as support, though three CONTRADICTED rows are named where they bear on a disagreement ([25], [97] and [142], [223], [238]). A feature resting on one source document is flagged SINGLE SOURCE; a "source" is a document or paper, not a row, so the nine StoryScope rows count once.

What the corpus says in one sentence: the surface tells (a word list, a punctuation mark, a triad) are contested and drifting, while the structural failures (meaning stated instead of implied, closure forced, pressure flattened, particulars missing, one voice for everyone, the same story told again) are confirmed from every angle, survive polishing, and are what a skilled reader actually detects. The reconstruction rules below therefore weight structure over lexicon.

## Part A. Story-level failures

### 1. The gloss: meaning is stated, not implied

Supported by nine source documents, twelve rows: StoryScope [0], [117], [145]; Ahuja, Li and Lampinen [58]; Dramatron [79], [80]; Chakrabarty, Laban and Wu 2025 [152]; sudo (LessWrong) [90]; Vollmer [120]; Kole [121]; The Literary Quant [119]; Dramatica [108] (commentary on StoryScope, not independent of it).

- [0] StoryScope: "AI stories over-explain themes and favor tidy, single-track plots"; narrators explicitly explain the theme 77% of the time against 52% for humans. [117] restates it as "AI over-explains its themes". [145] is the same abstract cited from the industry angle.
- [58] Ahuja et al.: "strong bias towards overly literal, explicit communication"; the 60% literal-clue figure is specific to one environment (Visual Allusions).
- [80] Dramatron, theatre professionals on LLM dialogue: "Show, not tell: here we are just telling". [79]: a noble endeavour "will be stated in the dialogue"; names are "on the nose, pun names".
- [152] Chakrabarty et al.: 18% of professional edits removed exposition restating what was already implied; the paper's own label is "show, don't tell".
- [90] sudo on a Claude passage: "Claude does not use its preceding sentences to justify the claim". Weight is asserted, not built.
- [120] Vollmer: "There is no connective tissue, only epigrams stacked."
- [121] Kole, after editing two AI-assisted manuscripts: "stripping back thematic overstatements".
- [119] The Literary Quant on verse: "a refusal to state itself too plainly, but a tendency" to re-restate its load-bearing moments.
- [108] Dramatica: "The machine wants to make the answer legible". It resolves because it does not know which tension should remain active.
- (partial, quote only) [118] "AI explains. Humans imply." The line is Mohammad Siam's on X, quoted by Dramatica.

No disagreement among sources. This is the best-supported feature in the corpus and the one the owner's own corpus measurement named first (the gloss tail).

Reconstruction rule: the dossier never names what a fact means. An entry states the fact (the toll, the grain count in words, the feud between the two mills) and stops. No sentence opens with what this shows or what this means; no entry closes on a moral, a summary, or an aphorism. Where a reader would want the meaning, the archivist supplies a second fact instead: the toll rose in the same year the bridge fell.

### 2. Closure is forced: every thread tied, no ambiguity held, no ending deferred

Supported by seven source documents, eleven rows: StoryScope [1], [4], [5], [107]; Sui et al., Spoiler Alert [43]; Witte, reported by Rettberg [84] (a preprint, not peer-reviewed; the verifier flagged it so); Beguš [48]; Lowe [106]; Vollmer [109], [189]; Dramatica [147] (derivative of StoryScope).

- [1] StoryScope: "far fewer subplots" (79% of AI stories have none, against 57%). [4]: "more protagonist-driven resolutions" (69% against 46%); humans are more comfortable with ambiguous endings. [5]: humans "frame protagonist' choices as more morally ambiguous" (59% against 38%; the apostrophe typo is the paper's). [107] bundles the same figures.
- [43] Sui et al.: "a fundamental inability to defer closure". Professional New Yorker fiction stays unpredictable near the close (late no-rate 0.607) while top LLM stories collapse to 0.215 and retain 23% of tension peaks against 52%.
- [84] Witte via Rettberg: "the story seems to end, then it ends again". Human sentiment spikes in the last tenth; AI stories climb from the 70% mark and resolve repeatedly.
- [48] Beguš: GPT is "prone to wrapping up each story with a moral lesson", in stock phrases.
- [106] Lowe: "Every scene ends properly. Every arc gets closed. Everything tied up". Real novels leave things hanging.
- [109] Vollmer: "The model does not trust the reader with ambiguity". [189] repeats it as resolution bias (the verifier notes these bullets are Vollmer's own, not Neil Clarke's as the row's source line suggests).
- [147] Dramatica: AI stories show "cleaner internal acceptance".
- (partial, quote only) [148] "tighter causal chains, more protagonist-driven resolutions"; [110] Elkins: "fiction repeatedly requires the significance of earlier details to be reinterpreted"; [111] verse "loves contrived mic-drops like the last sentence"; [42] Tian et al.: human stories show "higher levels of suspense".

No disagreement on direction. Note that [4] and [43] are measured on short fiction; the dossier is not fiction, but the same reflex (resolve, then resolve again) is what produces a dossier that reads as finished when a settlement is not.

Reconstruction rule: every dossier entry leaves at least one civic matter standing open, and says so plainly: the boundary is unsettled, the debt is unpaid, the petition has no answer yet, the well is dry this season. A paragraph closes on the standing condition, not on a resolution. Nothing in the record gets a second ending; a matter that closed in one year is not re-closed in the next.

### 3. The world tilts toward comfort: conflict sanitised, stability over change, positive arcs, flinching from harm

Supported by four source documents, five rows: Rettberg and Wigers [28], [29]; Tian et al. [41]; Li et al., Narrative Flattening [46]; Lowe [133].

- [28] Rettberg and Wigers, 11,800 stories for 236 countries: one plot template (a return to a small town, a minor conflict resolved by tradition and a community event); "Real-world conflicts are sanitised, romance is almost absent".
- [29] The same paper: AI narrative "prioritises stability above change and tradition above growth", a narrative standardisation distinct from representational bias.
- [41] Tian et al.: GPT-4 arcs are "strongly favoring positive outcomes"; Riches-to-Rags falls from 14.6% of human stories to 1.3%, Oedipus from 9.3% to 1.7%, Rags-to-Riches rises from 4.4% to 13.0%.
- [46] Narrative Flattening: across base, SFT, DPO and RLVR checkpoints "high-intensity emotions give way to neutrality"; professional literary fiction is compressed most.
- [133] Lowe: "AI flinches every time". Violence softens, sex goes vague, cruelty gets explained so the reader understands rather than feels it.
- (partial, quote only) [47] Nonaka and Perry: LLM character networks show "less conflict-driven social dynamics"; [83] and [210] Valdivia and Burelli, citing prior studies: "trends toward overly positive or uninspired endings".

No disagreement. [46] adds the mechanism: post-training does the flattening, so a prompt cannot undo it; the pools must be authored against it.

Reconstruction rule: the dossier records harm plainly and does not reconcile it. The hanging, the levy, the burned mill, the expelled family are written as they stand in the record, with who ordered it and what it cost. A feud entry names who holds the grudge and what it costs the town this year; it never reports that the parties learn to live together. A settlement's arc across the chronicle is allowed to fall and stay fallen.

### 4. One track: no subplot, no time jump, no fourth wall, no reference outward

Supported by two source documents, five rows, and effectively SINGLE SOURCE for the figures: StoryScope [1], [6], [96], [132]; Dramatica [151] restates StoryScope.

- [6] StoryScope: humans break the fourth wall 67% against 39%, address the reader 28% against 7%, name specific texts and authors 47% against 24%; humans use more time jumps, flashbacks and nonlinear structure.
- [132] "AI writes as though no one is watching."
- [96] Human stories span more locations, carry more dialogue relative to narration, and draw on a broader repertoire.
- [151] Dramatica: "the five AI models cluster together in narrative space"; narrative features alone reach 93.2% macro-F1 in detection.
- (partial, quote only) [149] humans use "more temporal discontinuity".

No disagreement, but the numbers rest on one paper. The fourth-wall and reader-address figures are fiction measures; the dossier's analogue is cross-reference and outward reference.

Reconstruction rule: the dossier cross-references. The entry on the mill points to the entry on the millers' guild; a chronicle year refers back to an earlier year by name; a later record is allowed to re-value an earlier one (the grant of the year of the flood is revoked in the year of the new reeve). A settlement is allowed a second thread, a sideline that never resolves into the main one. The archivist may cite a document outside the settlement: the charter, the bishop's letter, the ferry contract with the town across the river.

### 5. Flat pressure: no escalation, no suspense, no trajectory, sentences that can be swapped

Supported by eight source documents, ten rows: StoryScope [9], [146]; Sui et al. [43] (see 2); Xie and Riedl [54]; Matlin et al. [55]; Wang et al. [49]; Church [134]; Michel [158]; Schifano [161], [162].

- [9] StoryScope: "Claude produces notably flat event escalation"; GPT over-indexes on gossip and dream sequences, Gemini writes the tidiest endings. [146] is the same line from the industry angle.
- [54] Xie and Riedl: baseline ChatGPT shows "poor understanding of story suspense"; it loses to psychologically planned stories 84.9% of the time.
- [55] Matlin et al.: LMs "do not process suspense in the same way as human readers"; they can tell a text is meant to be suspenseful but cannot track its rise and fall.
- [49] Wang et al.: LLM fiction is "high-starting, low-ending".
- [134] Church: "Good writing must be surprising." A model's objective is least surprise; its output drifts rather than evolves.
- [158] Michel on the OpenAI story: it "doesn't really go anywhere. It's flat." The central idea is repeated with new metaphors.
- [162] Schifano: "there's no trajectory in these sentences"; sentence one and sentence two can be flipped and nothing changes. [161]: "the sentences don't originate from anywhere".
- (partial, quote only) [42] human stories show "higher levels of suspense" with the gap widening from midpoint to end.

No disagreement. [55] is the reason an LLM judge cannot grade this feature (see 23).

Reconstruction rule: order the dossier so that later entries depend on earlier ones: the levy follows the bad harvest, the riot follows the levy, the new reeve follows the riot. No two sentences in an entry may be swapped without loss; each names something the one before it set up. Pressure in a dossier is a count that moves: the garrison shrinks, the granary empties, the tithe doubles. The reader is told the count now and the count then, never told that tension rises.

### 6. Sameness: a narrow narrative space, echoed plots, default names, one template for every culture

Supported by seventeen source documents, twenty rows: StoryScope [7], [96]; DK and Hatzel [50]; O'Sullivan [27]; Xu et al., Echoes in AI [39]; Hamilton and Mimno [56]; Brzozowski and Chung [57]; Thousand Roads forum [195]; Wenger and Kenett [76]; Rettberg and Wigers [28]; Sui [45]; Lu et al. [31]; Marco, Rello and Gonzalo [62]; Chakrabarty, Laban and Wu 2025 [38]; Del Arroz [217]; Naomi and James Jones [198]; Clarke via Salon [170]; Narrative Flattening [46]; Dramatica [151].

- [7] StoryScope: human stories "occupy a rarer, more dispersed region of narrative space"; the human-to-AI centroid distance is 1.6 times the AI-to-AI distance; 24.7% of human stories fall in the rarest decile against 7.1% of AI stories.
- [50] DK and Hatzel, ten models: narratives are consistently more similar to each other than human stories are; negative prompting and temperature scaling "fail to meaningfully address this homogeneity".
- [27] O'Sullivan, Burrows' Delta: LLM stories "display a higher degree of stylistic uniformity, clustering tightly by model"; GPT-4 is tighter than GPT-3.5.
- [39] Xu et al.: "plot elements that are echoed across a number of generations"; 50 of 100 continuations have the policeman say to take the second left, 16 of 100 mention a bakery; human plot elements sit in the tail or outside the distribution.
- [56] Hamilton and Mimno, 20,000 stories: Elias in 26.5%, a lighthouse in 51.2%; Elias is "900 times more frequent in our corpus" than in published fiction.
- [57] Brzozowski and Chung: name pairs whose "co-occurrence rates far exceed chance" (Claude: Elena Vasquez with Marcus Chen; Gemini: Aris Thorne with Lena Petrova; GPT: Elara Voss).
- [195] Thousand Roads authors' note: "Marcus Webb, Sarah Chen" recur, as does the number 47.
- [76] Wenger and Kenett, 22 models against 102 humans: LLM responses are "much more similar to other LLM responses"; switching models does not restore diversity.
- [45] Sui: human continuations are two to four times more surprising; instruction tuning widens the gap, and the gap is 25 to 30% larger in fiction than in essays or news. The introduction's own words for the output: "trite, repetitive, overly verbose, and cliché-ridden".
- [31] Lu et al.: professional authors' Creativity Index "is on average 66.2% higher than that of LLMs"; alignment lowers the LLM index by 30.1%.
- [62] GPT-4o synopses: "more predictable and formulaic narratives"; surprising associations in 1.6% against 15% for a small fine-tuned model.
- [38] Writers "perceived no significant qualitative differences" among GPT-4o, Claude 3.5 Sonnet and Llama 3.1 70B; fiction scored lower than creative nonfiction.
- [217] Del Arroz, drafting sequels from the same source documents: "producing repetitive story beats".
- [198] Literary agents receive "almost identical query letters that used the same voice".
- [170] Clarke: "There's a difference in rhythm", and batches of submissions arrive with the same generated title.
- [28], [46], [151] as above.

No disagreement on direction. [9] (model fingerprints exist) and [38] (no model is better) both hold: within-model sameness with between-model signatures. The practical consequence is in [50] and [76]: no prompt, temperature or model switch fixes it; only authored pools do.

Reconstruction rule: names, numbers and openings are drawn from the engine's pools, and the pools are measured for dispersion, not just size (a pool's length is a seed input). No personal name recurs across two settlements in one world; no settlement has a lighthouse by default; no two entries in one dossier open on the same noun. A descriptive phrase that has fired for one settlement is retired for that settlement. The reconstruction wave measures its own output the way [7] does: where do our dossiers sit in the space of possible dossiers, and how many fall in the rare decile.

### 7. No grain: missing particulars, regression to the generic, advert tone, vague authority

Supported by eleven source documents, fourteen rows: Vollmer [91], [186]; Lowe [92]; Jones [93]; Chakrabarty, Laban and Wu 2025 [155]; Wikipedia, Signs of AI writing [173], [175], [176]; Beguš [48]; Williams [164]; Cobey [212]; Randall [209]; PC Gamer on Seed [202], [204]; Reinhart et al. [34].

- [91] Vollmer: "No grain: no proper nouns, no specific months, no brand names" (the source continues: no dialect, no idiosyncratic rhythm). [186]: "No Tuesday. No laundromat." No grandmother with a specific brand of cough drop.
- [92] Lowe: "Observations don't accumulate meaning across a manuscript"; AI describes grief where a human shows a man who cannot stop moving.
- [93] Jones: cause and effect arrive, but "it will fail to have the emotion linked to it"; shallow point of view.
- [155] The professional taxonomy names purple prose ("abstract words, and excessive adjectives, adverbs, and metaphors"), lack of specific detail, poor sentence structure (20%) and tense slips.
- [173] Wikipedia: the model "tends to omit specific, unusual, nuanced facts" and replaces them with generic positive description, drifting toward the statistically likely text. [175]: "their output will often tend toward advertisement-like writing" (vibrant, nestled, rich heritage). [176]: it will "attribute opinions or claims to some vague authority" (experts argue, some critics argue).
- [48] Beguš: GPT stories are set in a faraway made-up place bare of cultural aspects.
- [164] Williams, Asimov's, after hundreds of submissions: no sign the writer "ever read a story, heard some folklore" or watched a TV show.
- [212] Cobey on ChatGPT adventures: "the most ordinary, middle-of-the-road adventure text"; the quality floor comes with an equal ceiling.
- [209] Randall: generic NPCs with "disconnected, jilted, random stories to tell you" make the whole world shallower; barks and journals are the backbone of place.
- [202] Seed's NPCs are "filling up space with completely unnecessary words"; [204] "a full conversation that contains no actual meaning".
- [34] Reinhart et al.: words that connote complex relations (tapestry, intricate, camaraderie) produce "grandiose, if hollow, summative sentences".
- (partial, quote only) [94] Ted Chiang via LitReactor: "that average is equivalent to the least interesting choices possible"; [95] Chiang via Michel: "art is something that results from making a lot of choices"; [160] Michel: the hardest work is "shaping, honing, and refining".

No disagreement. This is the second pillar with the gloss: what the reader misses is the thing that could only be true of this place.

Reconstruction rule: every dossier sentence carries at least one particular the engine actually holds: a named ward, a named holder, a specific trade, a count in words, a month of the local calendar, a named neighbouring town. The archivist attributes to a named record, never to a vague authority: the reeve's roll records, the guild book lists, the tithe return shows; never it is said, never experts hold. No evaluative adjective attaches to the place (no vibrant market, no rich heritage, no nestled hamlet); what a market is, is what it sells and on which day.

### 8. Feeling by formula: bodies, smells, weather that mirrors grief, a mood vocabulary

Supported by three source documents, five rows: StoryScope [2], [3]; Vollmer [122], [127]; Jones [93].

- [2] StoryScope: AI "conveys emotion through physical sensations and bodily metaphors" in 81% of stories against 38%; humans use explicit emotion labels 29% of the time against 8%.
- [3] AI "deploys more smell-based imagery" (82% against 57%).
- [127] Vollmer on AI metaphor: "Right ballpark, wrong physics." Rain pattering against the window, mirroring her unspoken grief, filed under mood-saturated weather and rooms.
- [122] A recycled mood vocabulary: "ache, hollow, tether, linger, fragile, fractured, ember, bloom" (the list continues: cradle, ruin, veil, threadbare), collapsing many tones into one register.
- [93] Jones: the emotion arrives disconnected from its trigger.
- (partial, quote only) [131] "AI overwhelmingly conveys emotion through physical sensations and bodily metaphors"; [52] Rohrbacher et al.: LLM perceived space (mood-laden atmosphere) runs at "roughly twice the human baseline".

DISAGREEMENT, marked: StoryScope [2] finds AI names emotions less often than humans (8% against 29%) and somatises more; Lowe [92] (feature 7) says AI "would have described grief" where a human shows it. Both are verified; they measure different things. The peer-reviewed measure counts explicit emotion labels; the ghostwriter's complaint is about description standing in for enacted behaviour. Read together: the model neither names the feeling plainly nor earns it through action; it reaches for the body and the weather.

Reconstruction rule: the archivist renders no feeling at all, in any of the three ways. No body tightens, no breath catches, no chest is heavy. Weather is recorded only when it has a civic consequence (the flood that took the bridge, the drought that emptied the well), and never as a mirror of anyone's state. The mood vocabulary is banned outright: ache, hollow, tether, linger, fragile, fractured, ember, bloom, cradle, ruin, veil, threadbare. Smell appears only as a trade fact (the tannery, the fish market).

### 9. Dialogue: one voice for everyone, on the nose, curt blocks that end on a hook, no motivation; NPC lines that forget the world

Supported by nine source documents, fourteen rows: Vollmer [189]; Dramatron [79], [80], [81]; Makin [183]; Akoury, Yang and Iyyer [77]; PC Gamer on Seed [203], [205]; PC Gamer on Larian [200], [201]; Gameindustry.com [208]; PC Gamer on Where Winds Meet [206]; Thousand Roads forum [194], [196].

- [189] Vollmer: "Dialogue flattening: characters sound alike; no distinct idiolect." No verbal tics, dialect or pattern of evasion; mysteries are resolved by as-you-know-Bob speech rather than action. (The verifier records these as Vollmer's own bullets, listed after Clarke's quote, not Clarke's words.)
- [81] Dramatron professionals: "Where is the emotional motivation". The stories do not finish; character journeys are not complete; logic gaps and generation loops.
- [183] Makin: "Extremely curt dialogue that ends in a “cliffhanger”." Writing goes blocky, with rigidly separated zones of dialogue, exposition and repetitive narration.
- [77] Disco Elysium players preferred designer dialogue to GPT-4 infills 64% to 23%; "702 (61%) state a preference for human-written dialogue" on logical consistency, 67% to 21% on flow.
- [203] Seed: "How many years have you lived?" is an AI trying too hard; plain questions are rephrased to sound alive. [205] the concession: personality types chosen at creation do come through ("Some speak very curtly").
- [200] Larian's writing director: "the results hit a 3/10 at best", below his own worst drafts; placeholder AI text does not help development. [201] Litchfield: "a by turns smarmy and sycophantic tone" across Grok, Claude and ChatGPT that editing cannot cheaply remove.
- [208] An NPC that can "forget their faction or personal backstory", leak modern facts into a fantasy setting, or spill quest secrets under manipulation is useless to a designer.
- [206] Where Winds Meet, a Song-dynasty NPC: "ketchup wasn't available during the Song dynasty"; players break canon at will.
- [196] Characterisation whiplash: "startling gentleness" ninety seconds after a heated argument about tea. [194] Four contingency plans built off one assumption the story then contradicts: "Perfectly confident, convincing-sounding writing that just makes no sense at all."
- (partial, quote only) [150] "AI dialogue more often turns into philosophical debate."; [78] Akoury et al.: 32% of generations "illogical in hindsight" once the next line appears; [207] Nvidia demo lines are "they're undeniably robotic".

DISAGREEMENT, marked, and a thin spot: the claim that generated casts sound like one person rests on Vollmer [189] and, for scripts, on Dramatron's tight and prescriptive relationships [79]. The vendor source that was sampled for it, Summer Engine, was graded CONTRADICTED twice ([97], [142]): its "whole cast that sounds like one person" line describes hand-written dialogue that AI is sold to fix. And [205] is a verified counter-instance: a role-keyed personality survives generation. So: sameness of voice is a practitioner observation, not a measured result, and role-keyed pools demonstrably restore some difference.

Reconstruction rule (Herald pools and DM page): each speaking role owns a pool with one verbal habit that no other role shares (the ferryman counts, the priest hedges, the reeve names the statute), and a line never states what the speaker wants. A question is asked plainly. No line ends on a hook. No line explains the world to a listener who already lives in it. An NPC line may only assert what the settlement record holds; anachronism is impossible by construction because the pool is drawn from typed buckets, not generated.

### 10. No one behind the sentence: no point of view, no intent, no origin

Supported by seven source documents, eight rows: Bernoff [86]; Clarke via Vollmer [87]; Michel [159]; Schifano [161], [162]; Williams [163]; Playle [136]; sudo [90].

- [86] Bernoff: "there's no human on the other end", which makes editing harder, not easier; there is no intent to serve.
- [87] Clarke, quoted by Vollmer (secondhand; Clarke's own post was not readable): "They are boring. They are flat".
- [159] Michel: "They don't have a point of view" or the ability to think about how parts work together.
- [161] Schifano: "the sentences don't originate from anywhere"; there is no position for the reader to stand. [162] as in 5.
- [163] Williams: "no sense of narrative, no character development", plotting practically nonexistent, no sign of originality.
- [136] Playle: AI editing tools "They flatten voice and eradicate creative risk-taking." Blanket rules with no understanding of purpose.
- [90] as in 1.
- (partial, quote only) [99] Bernoff: text that "lacks emotional valence and could lull the reader to sleep".

No disagreement. This is the feature that explains the others: a gloss appears because nothing is being withheld; closure is forced because nothing is at stake for the writer.

Reconstruction rule: the archivist has a position and a stake. The dossier is written from the record room of that settlement, by an office that exists to settle something (the tithe, the boundary, the ferry right), and its sentences can be ordered only one way because they follow the order of the record. The pools are authored per office, not per mood: what a reeve's clerk would enter, what a parish clerk would enter, what a guild warden would enter. Where two offices would record the same event differently, the dossier says which record it follows.

## Part B. Sentence-level failures

### 11. The metronome: uniform sentence length, constant pacing, essay shape; and the two-mode alternation

Supported by five source documents, eight rows: Vollmer [98], [141], [188]; Makin [100], [101]; Labbé, Labbé and Savoy [71]; Clarke via Salon [170]; Bakhshi [73].

- [98] Vollmer: "Pacing flatness: scenes unfold at a constant rate". No elision, no selective summary; sentence length sits at a metronomic 14 to 22 word median with small variance. [141] adds POV lock (attributed by Vollmer to Charlie Guo). [188]: "high school essay vibes"; intro, three body sections and recap even for a hundred-word answer; paragraphs end on aphoristic pull-quotes.
- [100] Makin: "A novice author wouldn't repeatedly go for these sentence patterns".
- [71] Labbé et al. on generated presidential addresses: "too standardized sentences"; nouns, possessives and numbers overused, verbs, pronouns and adverbs underused.
- [170] Clarke: "There's a difference in rhythm".
- [73] Bakhshi: rhetorical devices are distributed with template-like uniformity, "deployed independently of argumentative occasion".
- (partial, quote only) [68] Muñoz-Ortiz et al.: LLM sentences show "less variation when compared to human-generated sentences" and cluster in a 10 to 30 token band; [70] Rodrigues et al.: human lengths show "a broader and flatter distribution"; [104] a vendor: "AI rhythm is the mechanical, metronomic quality of text" (unreplicated figures); [102] Jones: "the rhythm is becoming recognizable as an AI pattern" (said of the comma plus like or as if construction); [105] verse: "The constant objective correlatives and choppy cadence".

DISAGREEMENT, marked: Vollmer [98], [188] and Labbé [71] describe uniform length; Makin [101] describes the opposite surface, "Alternating loquacious ponderous similes and tiny sentences made out of cliches" (and [180], partial, the same line). Both are verified. The resolution is that a two-mode alternation is itself a rota: a long comparison, then a short stock line, then a long comparison. Uniformity and strict alternation are the same failure, a rhythm set by rule rather than by content.

Reconstruction rule: sentence length follows the load. A single fact takes a short sentence; a list of holdings takes a long one; a year with nothing to record takes one line. Never alternate by rota, never run three sentences of the same length in a row unless they list three like things. Summarise the quiet years; give the year of the fire its full paragraph. No entry has an introduction or a recap; it begins on the first fact and ends on the last.

### 12. Manufactured emphasis: fragments as sentences, one-line paragraphs, stacked negations, cliffhanger ends

Supported by three source documents, three rows: tropes.fyi [103]; Makin [183]; Vollmer [188].

- [103] tropes.fyi: "He published this. Openly. In a book. As a priest." Short standalone fragments for manufactured emphasis, which no human writes in a first draft. (Undated, self-published; the verifier says treat as illustrative.)
- [183] Makin, as in 9: curt dialogue that ends on a cliffhanger.
- [188] Vollmer: paragraphs end on a pseudo-profound kicker designed to feel like a pull-quote.
- (partial, quote only) [193] Negrek's note that a structure 'starting a sentence with "not"' is common with LLMs; [102] Jones on the one-fragment paragraph before a hook, whose quotation the verifier found attached to a different tell.

No disagreement among these; the thin sourcing (one directory, one blog, one guide) is noted. The stacked-negation pattern in particular rests on a forum note whose supplied example was a composite (see the partial table).

Reconstruction rule: no fragment stands as a sentence in the dossier. No paragraph is one line unless it is a single-fact year. No run of sentences opens on Not. No entry or paragraph ends on a hook, a kicker or a line meant to be quoted.

### 13. Reflexive antithesis: not X but Y

Supported by seven source documents, eight rows: Wikipedia, Signs of AI writing [112], [178], [233]; Gonzales [113]; Stockton [115]; Makin [184]; Del Arroz [217]; Sandhu [232].

- [112] Wikipedia catalogues negative parallelism in two shapes, "Not just X, but also Y" and "Not X, but Y"; the example: "not a mirror but a portal: not a representation of self". [178]: "Not only ... but ..." and "It is not just ..., it's ..." recur; the guide is "this list is descriptive, not prescriptive; observations, not rules".
- [113] Gonzales: "your brain doesn't skip to the alternative"; readers process and retain the negated concept, so the reframe lands weaker and the cost compounds with repetition.
- [115] Stockton: "It tries to sound sophisticated without being sophisticated".
- [184] Makin: surface tells drift ("Emdashes are less common than they were months ago.") while the not X; Y construction persists as universal.
- [217] Del Arroz's AI-drafted sequels carry the occasional not X but Y.
- (partial, quote only) [116] Ayres on machine prose generally: "it says absolutely nothing at all".

DISAGREEMENT, marked: Sandhu [232] ("contrastive antithesis is part of ChatGPT's lexicon for a reason.") and Wikipedia [233] ("Not all text featuring these indicators is AI-generated"; the construction is common among human writers, especially myth-busting listicles) hold that the device is legitimate and concise, and that it is failing as a fashion cycle, not as a device. Gonzales [113] disagrees on the cognition: the construction underperforms regardless of who writes it. The corpus therefore supports a ban on effect grounds (the negated idea is what the reader keeps) as well as on saturation grounds.

Reconstruction rule: the construction is banned in the dossier without exception. An archivist has no misconception to correct, because the reader has not yet been told anything; the record states what is, never what it is not. The same ban binds the Herald and the chronicle line. On the DM page a designer's note may use one antithesis per page at most.

### 14. The rule of three: tricolons, stacked triplets, three abstractions

Supported by nine source documents, nine rows, in two camps. For the tell: Bakhshi [73]; Makin [181]; Negrek (Thousand Roads) [192]; Wikipedia [178]; Vollmer [188]. Against it as a tell: Wikipedia, Rule of three (writing) [229]; Jericho Writers [230]; GPTZero [231]; Goehrke [228].

- [73] Bakhshi: LLM argumentative prose uses tricolon 7.13 per document against 3.73 for human experts, suppresses rhetorical questions (2.28 against 5.55), doubles performed hesitancy, and deploys devices "deployed independently of argumentative occasion".
- [181] Makin's own example of the list of three: "a geometry of madness, a wound in the fabric" of what is, older than law and time.
- [192] Negrek: "a voice like a waiting room"; rule of three plus a bizarre simile is a screaming red flag.
- [178] Wikipedia: LLMs overuse the rule of three. [188]: the three-body-section default.
- [229] The tricolon "combines both brevity and rhythm" with the least information needed to make a pattern; Caesar, Lincoln, Churchill, King, the fairy tale, Aristotle's beginning, middle and end.
- [230] Craft guidance teaches triads deliberately; the only caution is "Tip: Don't overdo it."
- [231] A detector vendor's blog: LLM triads are "a reflection of effective communication strategies embedded within their training data".
- [228] Goehrke: em dashes, serial commas and the rule of three are 'touted as being “clear indicators of AI usage”' yet all three sit in one sentence she wrote herself.
- (partial, quote only) [138] tropes.fyi: "Products impress people; platforms empower them."

DISAGREEMENT, marked and resolved by the sources themselves: three is a human device; the tell is a triad that appears regardless of occasion [73], a triad of abstractions [181], a triad welded to a simile [192], or triads stacked back to back ([138], quote only). The count of a list is the give-away when it is always three.

Reconstruction rule: a list in the dossier runs to the true count of the things listed: two guilds, five wards, one ferry, four gates of which one is walled up. Never pad or trim to three. Never three abstractions in a row, and no abstraction in a list at all: the items are things the settlement holds. A triad is permitted only when the record has exactly three of something.

### 15. AI vocabulary: grandeur nouns, avoided copulas, significance adverbs, participial openers, noun-heavy sentences

Supported by eight source documents, thirteen rows: Reinhart et al. [32], [34], [35]; Wikipedia, Signs of AI writing [126], [174], [175], [177]; Ayres [124]; tropes.fyi [125]; Vollmer [122]; Russell, Karpinska and Iyyer [64]; Chakrabarty, Laban and Wu 2025 [36], [154]; Labbé et al. [71].

- [34] Reinhart et al.: GPT-4o uses camaraderie 162 times, tapestry 155, intricate 119, underscore 107, amidst 100 times the human rate; GPT-4o-mini palpable 145 times; the result is "grandiose, if hollow, summative sentences". [35]: models "do not vary their linguistic output in response to contextual factors", so fiction-appropriate words become conspicuous elsewhere. [32] SINGLE SOURCE for the syntax: instruction-tuned models use "present participial clauses at 2 to 5 times the rate" of humans (GPT-4o 5.3 times; Bryan, leaning on his agility, dances around the ring).
- [177] Wikipedia: "Many studies have demonstrated that LLMs overuse specific words" (delve, tapestry, testament, pivotal, intricate) and replace is and are with serves as, stands as, boasts. [126] SINGLE SOURCE for copula avoidance: "Harian Metro holds the distinction of being the first". [174]: undue significance, "is a testament/reminder", stands as. [175]: advert-like register, as in 7.
- [124] Ayres: 'Metaphors involving symphonies, tapestries, or "complex dances"', plus delve, navigate, enhance, elevate.
- [125] tropes.fyi: "quietly orchestrating workflows, decisions, and interactions"; the adverbs quietly, deeply, fundamentally, remarkably make the mundane feel significant.
- [122] the mood list, as in 8.
- [64] Five heavy ChatGPT users' majority vote "misclassifies only 1 of 300 articles", citing AI vocabulary plus formality, originality and clarity, robust to paraphrase and humanisation.
- [154] The largest professional edit category (28%) is awkward word choice, e.g. the recurring seem to plus verb: "This is not technically wrong it's just inelegant". [36] the full taxonomy: 28% word choice, 20% sentence structure, 18% redundant exposition, 17% clichés; the ordering "Writer-edited>LLM-edited>LLM-generated".
- [71] SINGLE SOURCE for noun density in the kept set: nouns, possessives and numbers overused; verbs, pronouns and adverbs underused (French presidential addresses).
- (partial, quote only) [11] Juzek and Ward: "lexical overrepresentation remains a feature of current iterations of ChatGPT"; [12] readers became 'wary of the word "delve"'; [123] Wikipedia's example "enduring testament to the influence of Italian colonial"; [33] Reinhart et al.: an "informationally dense, noun-heavy style".

DISAGREEMENT, marked, on one word: [235] (partial) Nigerian speakers, "no one used basic words like 'delve'", against [236] (partial) Juzek and Ward, "probably not overrepresented in the training data" and not especially prevalent in any variety of English. Both quotations verified; both rows partial; the corpus settles nothing about dialect here except that a single-word tell convicts real writers. Separately, Makin [184] records that lexical tells drift within months while structural tells persist, which is the reason this whole feature is weighted below Part A.

Reconstruction rule: the dossier's lexicon is civic and plain. Its verbs are is, has, holds, keeps, owes, pays, sends, builds, burns. Banned outright: testament, tapestry, delve, intricate, pivotal, vibrant, nestled, realm, camaraderie, palpable, amidst, underscore, showcase, elevate, navigate, and every copula dodge (serves as, stands as, boasts, holds the distinction of being, functions as). Banned adverbs: quietly, deeply, fundamentally, remarkably, arguably. No sentence opens on a participle. Nouns are welcome when they are things (the mill, the tithe barn, the ferry) and banned when they are nominalised acts (the levying, the establishment, the reinvention): the guild levies, the town establishes, the reeve reinvents nothing.

### 16. Metaphor: off-target, piled up, stacked at the sentence end, scenery given intent, lyrical nonsense

Supported by eight source documents, ten rows: Vollmer [127]; sudo [128]; tropes.fyi [130]; Michel [137], [156], [157]; Makin [182]; Negrek [192]; Hess [185]; Chakrabarty, Laban and Wu 2025 [155].

- [127] "Right ballpark, wrong physics."
- [128] sudo: what AIs fail to grasp includes "Logically coherent metaphors" and comparisons analogous on more than one dimension; the comparison breaks when followed across a second dimension.
- [130] Forced figurative language is used because it "sounds clever rather than because it clarifies anything".
- [156] Michel on the OpenAI story: "Grief, as I've learned, is a delta", a metaphor no reader can cash out. [157] "protagonists cut from whole cloth, emotions dyed and draped over sentences": construction, tailoring and magic metaphors in one passage, the five-car pile-up. [137] The Granta AI story: "man, it does not have a story. There's no narrative."; lyrical nonsense praised by judges for lyrical precision.
- [182] Makin: similes and metaphors "spammed in the final sentence to describe a single concept".
- [192] "a voice like a waiting room", as in 14.
- [185] Hess: models "overassign active verbs, and by extension intent" to inanimate things (dawn unfurled); also just bad writing.
- [155] purple prose, as in 7.
- (partial, quote only) [190] the thread's own label, "a jaw that was, objectively, a jaw" (Negrek's, not Goolix's as the row's source line said).

No disagreement.

Reconstruction rule: the archivist uses no figurative language. A comparison, where one is needed, is a measurement in words: the wall is the height of two men; the bell is heard at the far ferry. Inanimate things do not act with intent: dawn does not unfurl, the river floods, the roof falls. No sentence ends on a comparison. The pools carry no simile slot.

### 17. Repetition without relief: the same word, the same shape, the same cliché well

Supported by three source documents, five rows: Makin [101], [139], [179]; Del Arroz [217]; Xu et al. [39].

- [139] Makin: a human writer might reuse words, but "even bad ones will 'give it a rest' when they notice"; the model's instinct is to keep obeying the instruction and fit the previous paragraph. [179]: "it won't stop going to the same well" once the story reaches a local minimum of samey clichés. [101]: the cliché well, as in 11.
- [217] repeated story beats across sequels.
- [39] echoed plot elements across generations, as in 6.
- (partial, quote only) [153] "unnecessary filler" (a writer's gloss inside the 18% exposition category).

No disagreement. Note that repetition of a civic noun is not the failure: the mill is the mill. The failure is a descriptive word or a sentence shape reused because nothing stopped it.

Reconstruction rule: a thing keeps its one name throughout the dossier (the mill, never the grain works, never the old structure), and every descriptive word is used once per entry. Each pool draw is logged per settlement and a drawn phrase is retired for that settlement. The reconstruction wave measures shape repetition (the same clause pattern in consecutive sentences) as a ratchet, the way the corpus measurement measures gloss tails.

### 18. The em dash, contested

Supported by seven source documents, seven rows, in two camps. As a tell: Jones [140]; Makin [184]. Against it as a tell: Phillips [221]; Kavanaugh [222]; Britt [224]; Kreuz [226]; Goehrke [228].

- [140] Jones: "AI does this on a sentence level often with those em-dashes"; the verifier found the per-paragraph claim confirmed elsewhere on the page (one in every paragraph; a continuation of thought, not a break).
- [184] Makin: "Emdashes are less common than they were months ago."; newer models use the same sentence structures with semicolons or commas in their place.
- [221] Phillips: "no hard evidence chatbots use more em dashes than anyone else"; if they do, it is because the human writers they were trained on do.
- [222] Kavanaugh: Dickinson's publishers scrubbed her dashes and "Later editors put the dashes back" because they were architecture.
- [224] An AP Stylebook editor: em dashes are "so ubiquitous in AP lingo, we just call them dashes"; avoiding them to dodge suspicion lets the machine dictate human style.
- [226] Kreuz: readers who leaned on em dashes to spot ChatGPT text did "only marginally better than chance"; no single feature is definitive.
- [228] Goehrke, as in 14.
- (partial, quote only) [225] Freeburg: em dash rate is "a diagnostic signature of how a model was fine-tuned" (human mean 3.23 per thousand words; twelve models span 0.0 to 10.62; Llama's RLHF suppresses it to zero); [227] Anne R. Allen: the Shy Girl tells could "also be attributed to amateurish or unedited writing".
- Not citable: [223] (CONTRADICTED) on the Google Books Ngram history.

DISAGREEMENT, marked: two practitioner rows say the dash is a tell in current fiction; five rows say it is a human mark and a poor detector, and [184] says the tell has already drifted. The corpus does not support treating the dash as evidence of anything.

Reconstruction rule: the dossier's no-em-dash rule stands as house style, justified by the register and not by detection: an archivist's record is punctuated with the full stop, the colon and the semicolon, and a continuation of thought is a new sentence. The rule is recorded as a style choice so that no one later mistakes it for a finding.

### 19. The evaluative register: vibes, praise, sycophancy, positive emotion

Supported by five source documents, seven rows: Wikipedia [174], [175]; Litchfield [201]; PC Gamer on Seed [202], [204]; Tian et al. [41]; Rettberg and Wigers [28].

- [204] In Seed, heavy, beautiful, iconic and vibes attach to an age, a name and the colour of someone's shoes alike.
- [201] the smarmy, sycophantic tone, as in 9.
- [175] advertisement-like writing; [174] undue significance and legacy framing.
- [41] positive outcomes; [28] sanitised conflict.
- (partial, quote only) none with a usable quotation; [69] and [70] (Muñoz-Ortiz; Rodrigues) carry the positive-emotion figures but [69] has no quotation and [70]'s quotation is about sentence length.

No disagreement.

Reconstruction rule: the archivist rates nothing and praises nothing. No adjective of quality attaches to a place, a person or a year; the record says what is there, what it yields, what it costs. The words heavy, beautiful, iconic, vibrant, remarkable, legacy, pivotal do not appear. A settlement that is doing well is shown by its counts.

### 20. Length and consistency: strong openings that decay, errors in the middle, tells that scale with length, openings by formula

Supported by eight source documents, nine rows: Wang et al. [49]; Li et al., Lost in Stories [53]; Church [135]; Clarke [169]; Hockaday [165]; Beguš [48]; Vollmer [188]; Dramatron [81].

- [49] "high-starting, low-ending".
- [53] In long LLM stories, consistency errors are "most common in factual and temporal dimensions", cluster around the middle and in high-entropy segments (no human baseline).
- [135] Church: coherence starts to fall apart at about 250 words; asked for a style, "it will often overdo the style you ask for".
- [169] Clarke: "the tells are more obvious on longer works" than in flash or poetry.
- [165] Hockaday: "usually you can tell the first couple of sentences".
- [48] "Once upon a time", a vague futuristic place; human stories open on the tension at stake.
- [188] intro, three body, recap.
- [81] the stories do not finish; generation loops.

DISAGREEMENT, marked as a tension rather than a contradiction: [165] says the tell shows in the first sentences; [169] says tells grow with length. Both hold: the opening is generic by formula, and length accrues error.

Reconstruction rule: the dossier is built from short entries, each a self-contained record of one matter, so length never accrues within a generated span; consistency across entries is the engine's (typed buckets, one writer per fact), never the prose's. An entry opens on its first fact, never on a setting introduction, never on a formula. No entry has an introduction or a recap.

### 21. Canon and premise breaks: facts the world does not hold

Supported by six source documents, eight rows: Thousand Roads forum [194], [195], [196]; Gameindustry.com [208]; PC Gamer on Where Winds Meet [206]; Li et al. [53]; Clarke [168]; Book Riot [218].

- [194], [195], [196], [206], [208], [53] as above: contingencies built on a premise the text then contradicts; canon names confused; a faction forgotten; ketchup in the Song dynasty; factual and temporal errors mid-narrative.
- [168] Clarke: polished or co-written submissions still show the hallmarks, and "they even leave a prompt or ChatGPT response in the text".
- [218] A published romance shipped with "an AI prompt asking for a rewrite in another author's voice" left in; Amazon's AI disclosure is not shown to readers.
- (partial, quote only) [78] Akoury et al.: lines "illogical in hindsight".

No disagreement.

Reconstruction rule: a dossier sentence may assert only what the world state holds (the finite-semantics law: the AI is a clerk, never a writer). The build gate scans every rendered dossier for instruction residue (a prompt, a reply, a bracketed note) and fails closed on any hit. No pool sentence carries a proper noun the engine did not supply.

### 22. Register invariance: style over story, the same style everywhere, humour as a coin flip

Supported by five source documents, six rows: Reinhart et al. [35]; Jung et al. [51]; Labbé et al. [71]; Church [135]; Chakrabarty, Laban and Wu 2025 [38]; Gómez-Rodríguez and Williams [66].

- [35] as in 15: no variation by context.
- [51] Under constraint selection six models "consistently prioritize Style over narrative content elements" (event, character, setting).
- [71] a political register that reads as standardised.
- [135] a requested style is overdone.
- [38] no model is better at fiction than another; fiction scores below creative nonfiction.
- [66] SINGLE SOURCE: "humor shows a binary divide between LLMs" that manage it comparably to humans and those that fail outright (GPT-3.5 3.3 of 10 against humans 6.4).

No disagreement.

Reconstruction rule: the four registers (the archivist, the Herald's short pools, the chronicle line, the DM page) each own their own pools and their own bans, and a sentence written for one must not be usable in another: a Herald line has a speaker and a day; a chronicle line has a year and an event; a dossier sentence has a record and a count; a DM note has a table reference. The archivist attempts no humour; if humour lives anywhere it is a typed bucket in the Herald with its own pool and its own ratchet.

## Part C. Who can see it: evaluation and detection, and what they mean for the program

### 23. The reader split: lay readers prefer the predictable; experts and LLM judges do not agree with each other or with lay readers

Supported by twelve source documents, fourteen rows: Marco, Gonzalo and Fresno [61]; Porter and Machery [63]; Stone (The Conversation) [250]; The Luddite [251]; Sui et al. [44]; Chakrabarty et al., Art or Artifice [13], [14], [21]; Shaib et al. [67]; Jakesch, Hancock and Naaman [26], [246]; Clark et al. [247]; Milička et al. [248]; Scarfe et al. [245]; Russell, Karpinska and Iyyer [64].

- [61] Surface-focused readers (mainly non-experts) reward readability and richness; holistic readers (mainly experts) value "thematic development, rhetorical variety, and sentiment dynamics"; this explains contradictory evaluations.
- [63] 1,634 non-experts identified AI poems at 46.6%, judged them more human, and rated them higher on rhythm and beauty; "experience with poetry did not improve discrimination performance" unless it let them recognise the specific poems. [250] 696 readers ended "slightly preferring the imitation to the real thing", because the imitation strips the ambiguity that inexperienced readers read as not making sense. [251] The Luddite: the AI poems separate at 87.8% on formal metrics alone, and "human poets are expected to innovate on style", which imitation cannot test.
- [44] EQ-Bench rubric scores rank LLM stories (81 to 84) above New Yorker stories (78.71) that are far less predictable.
- [13] Art or Artifice: LLM stories "pass 3-10X less TTCW tests than stories written by professionals" (84.7% of tests passed by professionals; 9% to 30% by models). [14] Originality in form 0 to 8.3% against 63.9%; originality in theme 0 to 19.4% against 75%. [21] "none of the LLMs positively correlate with the expert assessments".
- [67] Slop is "generic, overly verbose, inaccurate, irrelevant to its intended purpose"; frontier LLM judges agree with human slop annotators at kappa about zero.
- [26], [246] People use "intuitive but flawed heuristics" (first person, contractions, family topics) that let AI read as "more human than human". [247] Untrained evaluators sit at chance; training lifts them to 55%; note "the often contradictory reasons evaluators gave for their judgments". [248] Czech readers "made the most errors precisely when feeling most confident". [245] "we found that 94% of our AI submissions were undetected" in real university marking, half a grade boundary above real students.
- [64] the trained expert result, as in 15.
- (partial, quote only) [144] Sears and Weisberg: "Perhaps people generally prefer predictability"; [143] Chakrabarty, Ginsburg and Dhillon: after fine-tuning on an author's corpus, "Fine-tuned outputs were rarely flagged as AI-generated"; [65] Gómez-Rodríguez and Williams: "Humans retain an edge in creativity" though GPT-4 outscored five human writers overall on an epic-comedy task; [22] Ismayilzada et al.: LLM stories "tend to fall short in terms of novelty, surprise and diversity"; [59] six literary experts: "GPT-4 receives predominantly scores of 0/1, while Pron receives mostly 2/3"; [253] "pass 3-10X less TTCW tests".

DISAGREEMENT, marked, and the most important one in the corpus for how the program grades itself: lay panels prefer generated text ([63], [250], [144] quote only), rubric judges prefer it ([44]), LLM judges are uncorrelated with experts ([21], [67]), and experts reject it ([13], [61], [251], [59] quote only). The counter-evidence rows ([65] and [143], quote only) show the gap can close on a narrow task or after fine-tuning on one author; neither is the prompted default register the dossier program is replacing.

Reconstruction rule (program, not prose): the owner's eye is the metric. No LLM judge grades the reconstruction; no lay panel scores it; a rubric score is reported but never used as a gate. Where a human panel is used it is an expert panel reading for structure (the gloss, the closure, the trajectory), not for readability. The taste sample goes to the owner, as the program already plans.

### 24. Detectors are not a gate

Supported by eight source documents, eight rows: Liang et al. [237]; The Markup [239]; Originality.AI [240]; Search Engine Land [241]; Sensei Enterprises [242]; Vanderbilt [243]; Wikipedia [234]; Kreuz [226].

- [237] Seven detectors flagged 91 human TOEFL essays at an "average false positive rate: 61.22%" (19.78% unanimously, 97.80% by at least one) while scoring near-perfectly on US eighth-grade essays, because they punish low perplexity.
- [239] Detector design "inherently discriminates against non-native authors"; predictable word choice and simple sentences read as machine.
- [240] The vendor rebuttal still reports "a False Positive Value of 5.04%" on 1,500 IELTS essays, about one wrongful accusation in twenty (vendor with a stake).
- [241] OpenAI withdrew its own classifier within six months; at launch it said it was "impossible to reliably detect all AI-written text".
- [242] "Selections from The Bible also show up as AI-generated." and so does the Constitution, because heavily trained-on text is what models reproduce.
- [243] Vanderbilt disabled Turnitin's detector: a claimed 1% false-positive rate means about 750 wrongly flagged papers in 75,000, "if it is even possible" at all.
- [234] Wikipedia: detectors have non-trivial error rates; "Human speech and writing is being influenced by LLMs", so the two are converging.
- [226] as in 18.
- (partial, quote only) [244] Sadasivan et al.: "our recursive paraphrasing method can significantly reduce detection rates"; [249] the expert panel "misclassifies only 1 of 300 articles".
- Not citable: [238] (CONTRADICTED) on a single literary-language prompt evading detection.

DISAGREEMENT, marked: [240] (5.04%) against [237] (61.22%) on different samples and detector versions; both verified; both are unacceptable rates for a gate. [249] and [64] show that trained human readers using vocabulary plus holistic judgment do far better than any machine detector.

Reconstruction rule (program): the program's instruments measure structure (gloss tails, forced closure, swappable sentences, uniform pools, shape repetition), never perplexity; a detector score is never a verdict on a dossier, and a low-perplexity plain sentence is what the archivist register is supposed to produce.

### 25. Assistance homogenises even human work

Supported by four source documents, four rows: Padmakumar and He [74]; Anderson, Shah and Kreminski [75]; Wenger and Kenett [76]; Doshi and Hauser via ScienceDaily [252].

- [74] Essays written with InstructGPT "repeat higher-order n-grams more frequently"; corpus homogenisation rose from 0.1536 to 0.1660, traced to model-contributed text rather than changed writer behaviour.
- [75] Brainstormers produced "less semantically distinct ideas with ChatGPT" and felt less responsible for them.
- [76] as in 6.
- [252] AI ideas made weaker writers' stories "up to 26.6% better written" and up to 22.6% more enjoyable, yet made stories more similar to each other; the failure is collective and invisible in any single text.

DISAGREEMENT, marked, on one figure: the ScienceDaily row [252] reports "a 10.7% increase in similarity", while the primary-paper row [25] was graded CONTRADICTED because the paper says the increase "represents 10.7% and 8.9% of the total range" of similarity scores. Cite the direction, not the 10.7% as a similarity gain.

Reconstruction rule (program): the reconstruction wave does not route every pool through one model's rewrite, and the pools are not drafted by asking a model for a list and taking it. Pools are authored per register, per office, and measured for dispersion before wiring, because the pool-key window closes at wiring.

### 26. The industry verdicts: barks are load-bearing, placeholder text does not help, publishers pledge, prompts ship in the text

Supported by fourteen source documents, sixteen rows: Randall [209]; PC Gamer on Larian [200]; Kobold Press [214]; OneBookShelf via EN World [213]; Cobey [212]; Game Developer [211]; Goodreads [219]; Book Riot [218]; Clarke [168], [171]; Williams [163], [164]; Hockaday [165]; Naomi and James Jones [198]; Nash [199]; Akoury, Yang and Iyyer [77].

- [209] Combat barks characterise a faction and journal entries flesh out a culture; they are the backbone the rest of the script rests on; generic filler made Starfield feel shallower.
- [200] as in 9: a three out of ten at best; stub text serves development better than generated placeholder.
- [214] Kobold Press: "we don't use AI to generate text for our game design"; LLM text works for chatbots, but people play to play with friends.
- [213] DMs Guild and DriveThruRPG: content "made of 'primarily' of AI-generated writing will not be allowed" from 2023-07-31; tagged AI art permitted.
- [212] as in 7. [211] 63% of game design and narrative workers say generative AI harms the industry; a respondent's phrase: "a regurgitated amalgamation of everything that's come before".
- [219] Goodreads readers flag about 296 books for AI cover art plus "stereotypical patterns at a frequency usually only seen in AI slop".
- [218], [168] prompts left in the text, as in 21. [171] Clarke: the output is "nowhere near the standards we expect"; the detection patterns are deliberately not published; generated-submission statistics are noise.
- [163], [164], [165] the Asimov's editors, as above. [198] identical query voices. [199] an AI query with no hook and a fabricated comp: "it appears real but it isn't".
- [77] players prefer designers, as in 9.
- (partial, quote only) [215] Monte Cook Games: algorithmic generation is the "exact opposite of inspiration"; [216] a crowdfunding backer: "it's been at the same level for three years"; [220] a human-written RPG review-bombed because "the story felt artificial" (the tells fire on human work too); [172] Uncanny's editor: "it creates a terrible, soulless product"; [167] Clarke in 2023: "sometimes bad in entirely new ways"; [166] a pastiche poem "overly narrative in places" (not a submission).

DISAGREEMENT, marked: [220] (quote only) is the counter-case for the whole catalogue; a human-written game was accused on vibe alone. This is why the rules above are written as construction rules for the pools and never as a detector run against the finished dossier.

Reconstruction rule (DM page): the DM page treats every short line (bark, rumour, notice) as load-bearing and draws it from the same typed pools as the dossier, keyed to role and to the settlement's record. A bare stub (a bracketed slot name) is preferred to a generated placeholder at every stage of the build, because a stub is honest about what is not yet written.

## Second verdicts, source concentration, and the register map

No row in `kept-ai.json`, `partial-ai.json`, `state-ai.json`, `merged-ai.json` or any verdict file carries an `alt` field (grep count 0 in each). The second-verifier evidence exists in a different shape: `verdicts-ai-regrade-r1.json` re-graded 68 rows (8, 10, 11, 12, 22, 23, 25, 33, 37, 40, 42, 47, 52, 59, 65, 68, 69, 70, 78, 82, 83, 85, 88, 89, 94, 95, 99, 102, 104, 105, 110, 111, 114, 116, 118, 123, 129, 131, 138, 143, 144, 148, 149, 150, 153, 160, 166, 167, 172, 180, 190, 191, 193, 197, 207, 210, 215, 216, 220, 223, 225, 227, 235, 236, 238, 244, 249, 253). Every one of the 68 had a first-pass VERIFIED verdict (50 in the chunk files, 18 only in the journal-rebuilt `state-ai.v1-misaligned.json`), and every one of the 68 disagrees with its first pass: 65 went to PARTIAL and 3 to CONTRADICTED ([25], [223], [238]). So 68 rows carry a second verdict and all 68 disagree, by construction, because the regrade was an adversarial pass aimed at rows with a suspected loose limb; the 173 kept rows each stand on one verifier's verdict and none carries a second. Aggregate source concentration among the 173 kept rows: arxiv.org 60, matthewvollmer.substack.com 11, en.wikipedia.org 11, for 82 of 173 (47.4%) from the top three hosts; the next two are recordcrash.substack.com (8) and pcgamer.com (8); 39 kept rows are Substack-hosted; 57 distinct hosts and 100 distinct URLs (98 once arXiv abs and html pages of the same paper are merged) across 133 distinct source strings. Two individual documents (Vollmer's field guide, at 11 rows across two angles, and the Wikipedia signs page, at 11 rows across three angles) carry more of Part B than any peer-reviewed paper; StoryScope, at 13 rows across three angles, carries more of Part A than any other single source.

REGISTER MAP.
- The settlement dossier's archivist is bound by every rule in Part A (1 to 10) and Part B (11 to 22), with the sharpest weight on 1 (no gloss), 2 (open matters), 5 (dependency order), 7 (a particular in every sentence), 8 (no feeling, no weather as mirror), 15 (the plain lexicon), 16 (no figure of speech), 17 (one name per thing, one use per descriptor) and 18 (the no-em-dash house rule, recorded as style).
- The Herald's short pools are bound by 9 (one verbal habit per role, no line states what the speaker wants, no hook), 3 (the Herald reports the levy and the hanging as they stand), 6 and 17 (pool dispersion and retirement, hardest here because the pools are short), 12 (no fragments, no stacked Not), 13 (no antithesis), 14 (true counts), 19 (no vibes), 22 (humour only as a typed bucket), and by 15's ban list.
- The chronicle line is bound by 5 (each year depends on the one before), 4 (a later year may re-value an earlier one, and refers back by name), 2 (a matter closes once, never again; no moral at year's end), 20 (each line self-contained, opening on the event), 6 (no default names, no default disasters), and 3 (a settlement may fall and stay fallen).
- The DM page alone carries 9's NPC rules (role-keyed pools, faction memory, no anachronism), 21's build-gate scan for instruction residue, 26 (stubs over placeholders; barks are load-bearing), and the three program rules from 23, 24 and 25 (no LLM judge, no detector gate, no single-model rewrite of the pools). A DM note may use one antithesis per page (13) and is the only register allowed a designer's aside.

## PARTIAL rows: verbatim quotation only, and the limb that is not supported

These 65 rows may be cited for the quotation in the second column and for nothing else. Where the supplied quotation was not on the page, the true wording is given and the fact noted; where no quotation was supplied, the row cannot be cited at all.

| index | quotation (true wording, under twelve words) | the unsupported limb |
|---|---|---|
| 8 | far harder to "humanize" | "professional-style rewriting": the edit was Gemini's own span-level artifact removal, not rewriting by professionals |
| 10 | (none supplied) | the 66% verbs and 16% adjectives split holds only of the 319 excess style words; pivotal, realm and meticulously are not in Kobak's own list |
| 11 | lexical overrepresentation remains a feature of current iterations of ChatGPT | "consistent with RLHF as the source": the paper reports mixed evidence, only that testing is consistent with RLHF playing a role |
| 12 | wary of the word "delve" | "readers may judge a text on those words": said of rushed RLHF evaluators, not of readers generally |
| 22 | tend to fall short in terms of novelty, surprise and diversity | the p-value range and the lexical against semantic split of diversity are nowhere on the cited page |
| 23 | (supplied quotation absent) LLMs generate stylistically complex stories, but tend to fall short | the verbosity evidence (unique words, dependency paths, nouns and adjectives) is absent from the page |
| 33 | informationally dense, noun-heavy style | the 2.6 times and 1.9 times rates are GPT-4o-specific, not all instruction-tuned models; "academic" is not the paper's word |
| 37 | (none supplied) | "templates": the paper files sense of, weight of, mix of under awkward phrases, reserving syntactic templates for its POS n-gram analysis |
| 40 | (none supplied) | "resolved immediately after it peaks": the drop measures an element dropped or hastily closed off, sometimes unresolved |
| 42 | higher levels of suspense | "about ten to fifteen percent earlier": no such figures in the paper; the advancement is reported qualitatively and in a violin plot |
| 47 | less conflict-driven social dynamics | the LLM edge-weight floor is 0.235 not 0.236; "far less variability" is not borne out per metric (human density SD is the lowest) |
| 52 | roughly twice the human baseline | the action-space deficit is not universal; GPT 4.1 stays close to or above the human baseline |
| 59 | GPT-4 receives predominantly scores of 0/1, while Pron receives mostly 2/3 | the GPT-4 creativity figures 0.97 and 0.88 sit inside a non-machine-readable figure, not in the text |
| 65 | Humans retain an edge in creativity | "humans led only on originality": humans also edged GPT-4 on humour, 6.4 against 6.0 |
| 68 | less variation when compared to human-generated sentences | STTR 0.424 is Falcon-7B alone, the lowest model; the model range is 0.424 to 0.466 |
| 69 | (none supplied) | "magnify male-pronoun bias" elides Falcon 7B, the one model that reduces it |
| 70 | a broader and flatter distribution | the percentage ranges hold only in the factual-news columns; the fake-news columns are materially lower |
| 78 | illogical in hindsight | "32% of GPT-4 game lines" drops the paper's "rated by at least one player" qualifier |
| 82 | lack of thematic focus, out-of-character dialogue, and insufficient character development | misattributed: the defect list is the authors' own preliminary experiments, not the blind screenwriter evaluation |
| 83 | trends toward overly positive or uninspired endings | misattributed: the authors citing prior literature, not the expert panel; only the genre item is a panel finding |
| 85 | (none supplied) | "soulless" is Josh Bernoff quoted inside the post; "no subtext, no psychological reasoning" is a reader's comment |
| 88 | (none supplied) | "everyone says what they mean" is the claimant's gloss and is not on the page |
| 89 | (none supplied) | "expository" is the claim's gloss; the paper's feature is philosophical debate as a dialogue function |
| 94 | that average is equivalent to the least interesting choices possible | attribution: the wording is Ted Chiang's, quoted by LitReactor from The New Yorker, not Nick Bailey's |
| 95 | art is something that results from making a lot of choices | attribution: the line and the one-choice-per-word arithmetic are Ted Chiang's, quoted inside Michel's essay |
| 99 | lacks emotional valence and could lull the reader to sleep | "even rhythm": Bernoff writes a boring, even tone, not even rhythm |
| 102 | the rhythm is becoming recognizable as an AI pattern | the quotation closes the comma plus like or as if section and does not attach to the fragment-paragraph or em-dash tells |
| 104 | AI rhythm is the mechanical, metronomic quality of text | "Gemini paragraphs nearly identical in length": the page gives a sentence count of four to five per paragraph; unreplicated vendor figures |
| 105 | The constant objective correlatives and choppy cadence | the causal framing (cadence "built from" correlatives and enjambment) is the summariser's; the page lists co-occurring tells |
| 110 | fiction repeatedly requires the significance of earlier details to be reinterpreted | "coordinates neither well" overstates; the abstract pins autoregression to the surprise-and-inevitability challenge only |
| 111 | it loves contrived mic-drops like the last sentence | "force closure" and "final lines" gloss a parenthetical self-referential joke |
| 114 | (none supplied) | "feels obligatory rather than natural" is the summariser's; the page says only that the construction is universal |
| 116 | it says absolutely nothing at all | the line is the article's opener about machine prose generally, not about the antithesis plus metaphor plus tricolon template |
| 118 | AI explains. Humans imply. | attribution: quoted from a Mohammad Siam reply on X, not the Dramatica post's own formulation |
| 123 | enduring testament to the influence of Italian colonial | "realm" occurs zero times on the page; "delve" is listed only for 2023 to mid-2024 and as dropping off in 2025 |
| 129 | (none supplied) | the sensory-overload ("eyeball kicks") half rests on a citation of Nostalgebraist, and the author notes newer models improved |
| 131 | AI overwhelmingly conveys emotion through physical sensations and bodily metaphors | "an inversion of the usual AI-tells-emotions assumption" is the claim author's gloss, not the paper's framing |
| 138 | Products impress people; platforms empower them. | "triplets of descriptors": the source describes stacked tricolons; the supplied quotation had dropped two words |
| 143 | Fine-tuned outputs were rarely flagged as AI-generated | "the tells above characterise prompted default-register output" is the analyst's inference, not in the paper |
| 144 | Perhaps people generally prefer predictability | "identified authorship at chance": experiment 2 was 39.93%, below chance; the supplied quotation dropped the hedge Perhaps |
| 148 | tighter causal chains, more protagonist-driven resolutions | "far fewer subplots": the source says fewer, with no magnitude |
| 149 | more temporal discontinuity | "AI stories stay chronological": the source is strictly comparative and never asserts the absolute |
| 150 | AI dialogue more often turns into philosophical debate. | "rather than character-driven exchange" is the analyst's gloss |
| 153 | unnecessary filler | "clichés and filler at 17%" conflates two categories; 17% is clichés alone and filler sits under the 18% exposition row |
| 160 | shaping, honing, and refining | the ten-thousand-choices arithmetic is Ted Chiang's, block-quoted; the page says a hundred choices, not almost none |
| 166 | overly narrative in places | scope: the poem was a generator's pastiche of a friend's style posted for a laugh, not a slush submission |
| 167 | sometimes bad in entirely new ways | "the worst ever received" overstates Clarke's among the worst submissions we've ever received |
| 172 | it creates a terrible, soulless product | "drove submissions to 2,800 in two weeks": AI is called a big reason, not the sole cause, and the period ran fifteen days |
| 180 | Alternating loquacious ponderous similes and tiny sentences | "without a governing restraint" is the researcher's gloss |
| 190 | a jaw that was, objectively, a jaw | attribution: the phrase is Negrek's (thread starter, post 1), not Goolix's |
| 191 | Something he didn't have a good word for | "declining to examine emotion with specificity": the source frames it as generic vagueness |
| 193 | (supplied three-fragment string is a composite) starting a sentence with "not" | the string appears nowhere contiguously, and both passages are Negrek's, not Goolix's |
| 197 | heart pounding chest | fluorescent, humming and particular appear zero times on the repo page; the quotation only illustrates what a trigram is |
| 207 | they're undeniably robotic | the page never uses the brand name ACE; it is the Nvidia and Convai demo |
| 210 | trends toward overly positive or uninspired endings | only the genre item comes from the ten-expert Delphi panel; the rest is cited literature and intro framing |
| 215 | exact opposite of inspiration | "on ethics and livelihood grounds" is explicit for only two publishers; Free League's stated policy is against AI art |
| 216 | it's been at the same level for three years | "human creators now fear tripping the same alarm": the voiced fear is about art styles, not prose |
| 220 | the story felt artificial | "because": the ChatGPT accusation was one belligerent review; the felt-artificial vibe came from other reviews |
| 225 | a diagnostic signature of how a model was fine-tuned | "envelops": the human range 0.33 to 17.12 does not reach the LLM floor of 0.0 |
| 227 | also be attributed to amateurish or unedited writing | "flat voice" paraphrases the reported tell, the narrative voice was all over the place |
| 235 | no one used basic words like 'delve' | "from school onward" is the claim's gloss; the article never says school |
| 236 | probably not overrepresented in the training data | "likely post-training" overstates the paper's hedge, consistent with RLHF playing a role |
| 244 | our recursive paraphrasing method can significantly reduce detection rates | "degrades toward random as LLM distributions approach human ones" is not spelled out in the abstract on the page |
| 249 | misclassifies only 1 of 300 articles | "not punctuation counts" is the researcher's own contrast; the paper never mentions punctuation |
| 253 | pass 3-10X less TTCW tests | the dimensional gloss is half supported; the paper does not single out elaboration and frames the gap as broad |

## Coverage table

Sources per angle. "Source strings" counts the `source` field as written (the same paper appears under several strings); "URLs" and "hosts" are deduplicated on the `url` field; "kept" columns count only VERIFIED rows.

| angle | claims | source strings | URLs | hosts | kept rows | kept URLs | kept hosts |
|---|---|---|---|---|---|---|---|
| peer-reviewed and arXiv studies (0 to 84) | 85 | 65 | 50 | 6 | 54 | 37 | 5 |
| novelists, fiction editors and developmental editors (85 to 144) | 60 | 35 | 25 | 23 | 38 | 18 | 18 |
| publishing and games industry (145 to 220) | 76 | 57 | 38 | 30 | 57 | 29 | 25 |
| the case AGAINST the common tells (221 to 253) | 33 | 32 | 31 | 21 | 24 | 23 | 18 |
| total | 254 | 133 distinct among kept | 100 distinct among kept | 57 distinct among kept | 173 | 100 | 57 |

Verdict counts per angle (from `state-ai.json`, 254 verdicts over 254 claims).

| angle | verified verbatim | verified substance | partial | not found | contradicted | blocked |
|---|---|---|---|---|---|---|
| peer-reviewed and arXiv studies | 43 | 11 | 20 | 8 | 2 | 1 |
| novelists, fiction editors and developmental editors | 23 | 15 | 20 | 0 | 2 | 0 |
| publishing and games industry | 46 | 11 | 18 | 1 | 0 | 0 |
| the case AGAINST the common tells | 21 | 3 | 7 | 0 | 2 | 0 |
| total | 133 | 40 | 65 | 9 | 6 | 1 |

The 16 rows outside kept and partial, for the record: NOT_FOUND [15], [16], [17], [18], [19], [20] (six Art or Artifice sub-claims whose figures live in the full paper but not at the cited abs URL), [24] (Ismayilzada expert deltas), [60] (Pron vs Prompt composite), [187] (Vollmer "what machine prose never does"); CONTRADICTED [25] (Doshi and Hauser 10.7%), [30] (van Nuenen, emotion words wrong in sign), [97] and [142] (Summer Engine, voice sameness misattributed to AI), [223] (SALT em dash Ngram), [238] (Liang self-edit prompt); BLOCKED [72] (Mikros, OUP 403 with no archive). Eight of the nine NOT_FOUND rows are URL-precision failures rather than false claims, and the peer-reviewed angle holds all of them; the counter angle has the highest verbatim share (21 of 33) and the novelist angle the lowest (23 of 60), which is where the regrade found the most loose limbs.
