# How generated prose fails in fiction — public source dossier

Compiled 2026-09-05 for the Fable 5.1 chair. Scope deliberately excludes the academic-abstract
vocabulary studies the chair already holds (Kobak et al. excess vocabulary; Jakesch et al. human
heuristics).

**Method receipt.** 14 web searches issued, including four disconfirming/negation queries
("case for the defense" against AI-tell lists, em-dash reliability, "AI writing patterns are just
rhetoric", editors who *use* AI). 24 URLs fetched; 20 tabled below. Four fetches were refused by
the host (PNAS 403 — read the arXiv version of the same paper instead; Nature/HSSC paywall
redirect — read the UCC repository record instead; ScienceDirect 403; New Yorker blocked).

**Caveat that matters for anything you publish.** Fetches are rendered through a summarising
model, so the quoted fragments below are *reported* verbatim rather than *observed* verbatim by me.
Treat every quotation as PLAUSIBLE-at-the-wording-level and re-verify any fragment before it goes
into a shipped artefact. The failure-mode claims themselves are CONFIRMED against the fetched text.

---

## Source table

| # | Title | URL | Type | Concrete failure modes it names | Quotation (<12 words) | Confidence |
|---|---|---|---|---|---|---|
| 1 | Wikipedia: Signs of AI writing (WikiProject AI Cleanup) | https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing | industry/community reference | Negative parallelism ("not just X, but Y"; "not X, but Y"); avoidance of plain copulatives, replaced by "serves as / stands as / marks"; undue emphasis on significance, legacy and broader trends; superficial "-ing" participle analyses ("highlighting its enduring significance"); promotional/travel-brochure adjectives ("vibrant", "nestled", "rich cultural heritage"); formulaic "Despite its X, it faces challenges…" closers; em-dash overuse; AI vocabulary cluster (delve, tapestry, pivotal, intricate, underscore) | Section heading: "Undue emphasis on significance, legacy, and broader trends" | high — derived from thousands of flagged real examples; **but encyclopedic, not fiction-specific** |
| 2 | Steph Zinn, "The habits of AI writing — and what to do about them" (a16z crypto, 2026-08-22) | https://a16zcrypto.com/posts/article/ai-writing-hallmarks-for-founders/ | essay (editor/ghostwriter) | "Insight-shaped writing" that carries no proposition ("Something real is happening"; "The stakes couldn't be higher"); empty contrast "It's not just about X — it's about Y"; reflexive hedges ("In many ways", "Arguably"); "Alexa voice" generic warmth; a working vocabulary of ~400 words out of a million; "a testament to", "stands as a beacon of"; triadic scaffolding ("There are three key reasons"); colon-heavy phrasing; em-dash clustering | "Most writing isn't some artful monomyth." | high — best single craft-side taxonomy I found |
| 3 | Colin Gorrie, "Why ChatGPT writes like that" (The Dead Language Society) | https://www.deadlanguagesociety.com/p/rhetorical-analysis-ai | essay (linguist) | Compulsive parallelism; antithesis ("it's not X, it's Y") as tic rather than choice; tricolon/rule-of-three, often imperfectly climaxed; em-dashes; "delve". Central diagnosis: the devices are legitimate; the failure is deploying them without knowing *when* | "What the LLM lacks is not technical ability, but taste." | high — names the mechanism, not just the symptom |
| 4 | Chakrabarty, Laban & Wu, "Can AI writing be salvaged?" (CHI 2025; arXiv 2409.14509) | https://arxiv.org/html/2409.14509 | study | Seven-category taxonomy built from professional writers' edits to 1,057 LLM paragraphs (LAMP corpus): awkward word choice & phrasing (28% of edits), poor sentence structure (20%), unnecessary/redundant exposition (18%), cliché (17%), purple prose, **lack of specificity and detail**, tense inconsistency. Domain is literary fiction and creative non-fiction | Flagged example: "Every so often, a stone house crumbled to modernism" | high — the single most directly usable taxonomy; professional-writer ground truth |
| 5 | Chakrabarty et al., "Art or Artifice? LLMs and the False Promise of Creativity" (CHI 2024; arXiv 2309.14556) | https://arxiv.org/html/2309.14556v3 | study | 14-test Torrance Test for Creative Writing, 10 expert writers, 48 stories. LLM pass rates: GPT-3.5 8.7%, GPT-4 27.9%, Claude 30.0% vs New Yorker authors 84.7%. Worst dimensions: originality in form (0–8.3%), literary devices (5.6–13.9%), character development (≤16.7% vs 61.1%). Qualitative: clichéd pet words ("inky sky", "tendrils", "etched"); endings that inflate in scope and abandon the characters; dialogue that is "directly expositional" with no subtext; over-modified description; characters introduced then dropped | Expert panel on the recurring imagery: "pet words that repeat" | high — the strongest expert-judged fiction result |
| 6 | Russell, Rajendhran, Pham, Iyyer & Wieting, "StoryScope: Investigating idiosyncrasies in AI fiction" (arXiv 2604.03136, 2026) | https://arxiv.org/abs/2604.03136 | study | 61,608 stories, 304 discourse-level narrative features across 10 dimensions. AI stories over-explain their themes and favour tidy single-track plots; human stories frame protagonists' choices as more morally ambiguous and carry greater temporal complexity. Per-model fingerprints: Claude flat event escalation, GPT dream sequences, Gemini external character description. 93.2% macro-F1 human/AI separation from **narrative** features alone (97% of the performance that adding stylistic cues buys) | AI stories "over-explain themes and favor tidy, single-track plots" | high — the key finding is that the tell is structural, not lexical |
| 7 | Xu, Jojic, Rao, Brockett & Dolan, "Echoes in AI: Quantifying lack of plot diversity in LLM outputs" (PNAS 2025; arXiv 2501.00273) | https://arxiv.org/html/2501.00273 | study | "Sui Generis" score measures how often a plot element recurs across alternative generations from the same prefix. LLM stories repeat idiosyncratic plot elements across generations *and across model families*; human plots are rarely re-created even in pieces. One Kafka prefix produced the same plot turn in 68+ of 100 GPT-4 continuations. Drop ratios 7–9× higher than human narratives (abrupt narrative collapse). Low-scoring segments "extend previous plots without advancing narrative tension" | Recurring generated turn: "Take the second left and cross the square" | high — PNAS page 403'd; read the arXiv version of the same work |
| 8 | Ismayilzada, Stevenson & van der Plas, "Evaluating Creative Short Story Generation in Humans and LLMs" (arXiv 2411.02316, 2025-05-10) | https://arxiv.org/html/2411.02316v5 | study | 60 humans vs 60 LLMs, five-sentence stories from three cue words. LLMs significantly under-perform on novelty, surprise and diversity while producing *longer and more syntactically complex* stories built from repetitive templates. **Expert judges rate human stories +1.25; non-experts and LLM judges rate the AI stories 1.19–1.85 higher** — the taste inversion. Surprise varies sentence-to-sentence in human stories; model stories hold a flat profile | "model stories keep a largely monotonous profile" | high — the judge-inversion result is the one to keep |
| 9 | James O'Sullivan, "Stylometric comparisons of human versus AI-generated creative writing" (Humanities & Social Sciences Communications, 2025) | https://www.nature.com/articles/s41599-025-05986-3 | study | Burrows' Delta over most-frequent-word distributions plus hierarchical clustering / MDS on prompt-matched short stories. LLM texts cluster tightly; human texts spread widely. GPT-4 shows *greater* internal consistency than GPT-3.5 — i.e. the newer model is the more uniform one. Overlaps with human texts are rare | "LLMs … remain distinguishable as machine-generated texts" | medium-high — abstract and repository record read; **full PDF blocked, so the per-feature detail is unverified** |
| 10 | Doshi & Hauser, "Generative AI enhances individual creativity but reduces the collective diversity of novel content" (Science Advances, 2024-07-12) | https://www.science.org/doi/10.1126/sciadv.adn5290 | study | 293 writers, eight-sentence stories, three conditions (no AI / one AI idea / five AI ideas), 600 evaluators. AI-assisted stories score 5.4–8.1% higher on novelty individually but are 8.9–10.7% more similar *to each other*; the gain concentrates in the least creative writers. Framed as a social dilemma | "writers are individually better off, but collectively a narrower scope" | high — read via PMC full text |
| 11 | Neil Clarke, "Editor's Desk: The Future of Dealing with AI Submissions" (Clarkesworld, 2025-08) | https://clarkesworldmagazine.com/clarke_08_25/ | industry | Submissions more than doubled at peak. Two distinct populations: crude scam submissions with predictable patterns, and sophisticated "co-written" work that mimics genuine authorial patterns and is much harder to detect. Quality of the machine-written tranche described as among the worst he has read. Advocates detection tools as a spam-filter-like *filter*, never a verdict | "Technology should never have the last word" | high — primary industry account from the editor at the centre of it |
| 12 | Jonathan Vatner, "Managing Submissions in the Age of AI" (Poets & Writers, May/June 2024) | https://www.pw.org/content/managing_submissions_in_the_age_of_ai | industry | Editors' account of the slush problem. The load-bearing craft claim is Clarke's: an AI story lacks the multi-level operation of a good story. Editors' responses are policy (disclosure, Copyleaks, outright bans) rather than craft heuristics — itself a finding: the trade has no shared prose-level test | Neil Clarke: "A good story works on multiple levels, and an AI story doesn't." | medium-high — thin on craft detail, strong on industry posture |
| 13 | Mary Kole, "After Editing Two AI-Assisted Manuscripts, I Rewrote My Client Agreement" (Jane Friedman, 2026-08-13) | https://janefriedman.com/after-editing-two-ai-assisted-manuscripts-i-rewrote-my-client-agreement/ | industry (developmental editor) | No subtext and no psychological reasoning behind the sentences; absent authorial voice ("soulless", statistically probable); emotional flatness — scenes unearned, reconciliations unconvincing; shallow characterisation needing interiority rebuilt from scratch; thematic overstatement where nuance belongs. Notes that the *editor's* job becomes impossible when there is no intention to serve | "There is no author's voice." | high — a working fiction editor on actual manuscripts |
| 14 | Charlie Guo, "The Field Guide to AI Slop" (Ignorance.ai, 2025-10-22) | https://www.ignorance.ai/p/the-field-guide-to-ai-slop | essay | Four-part taxonomy: red herrings (unreliable tells), stylistic tics, structural patterns, uncanny content. Named: indiscriminate em-dashes; uniform sentence length and monotonous paragraph rhythm; unearned "It's not X, it's Y"; generic plausible metaphors with no cultural resonance or specificity; vapid transitions ("As technology continues to evolve"); filler paragraphs spending four sentences on one idea; mid-sentence questions with no narrative purpose | "Surface polish with nothing underneath" | medium-high — usefully separates real tells from red herrings |
| 15 | Ossama Chaib, tropes.fyi — AI Writing Pattern Directory (from 2026-02) | https://tropes.fyi/ | industry reference | 32+ tells in six categories. Sentence structure: negative parallelism, em-dash addiction, rule of three, comma-clipped trailing phrase, "Not X. Not Y. Just Z", "The X? A Y", anaphora abuse, false ranges. Paragraph: short punchy fragments, excessive enumeration. Word choice: magic adverbs ("quietly", "fundamentally") bolted on to manufacture depth, synonym cycling, tapestry/landscape, delve, the "serves as" dodge. Tone: grandiose stakes inflation, compulsive counting | "It's not bold. It's backwards." | medium-high — comprehensive and directly reusable; curated opinion, not measurement |
| 16 | Kaj Sotala, "Creative writing with LLMs, part 1: Prompting for fiction" (LessWrong, 2025-07-21) | https://www.lesswrong.com/posts/D9MHrR8GrgSbXMqtB/creative-writing-with-llms-part-1-prompting-for-fiction | essay (practitioner) | Defaults to popular stereotypes rather than observed behaviour (a "math genius" who quantifies eggs); illogical or wrong-role details (a character sketching solar-panel layouts a professional would produce); one-dimensional single-trait characters absent explicit guidance; falls back on cached stereotype psychology precisely where training data lacks realistic depictions (e.g. small children's interiority) | Hollow specificity: "Temperature decreased at approximately 1.2 degrees Celsius per minute" | medium-high — strongest account of *why* the concrete detail is wrong rather than merely absent |
| 17 | Richard Lowe, "The Real Reason Not to Use AI to Write Your Novel" (Association of Ghostwriters, 2026-04-29) | https://associationofghostwriters.org/the-real-reason-not-to-use-ai-to-write-your-novel/ | industry (ghostwriter, 113+ books) | Tension rises and releases at predictable intervals; transitions land in formulaic places; generic description in place of observed detail; **risk aversion** — violence softens, cruelty gets explained away, the system retreats from discomfort; subplots resolve with artificial tidiness; a technically correct spine that is lifeless | "The transitions land in predictable places." | medium — practitioner essay, no measurement, but the risk-aversion observation is rare and load-bearing |
| 18 | Carrie Jones, "What Makes a Story 'Look' Like AI Wrote It?" (Living Happy, 2026-03-21) | https://livinghappy.substack.com/p/what-makes-a-story-look-like-ai-wrote | essay (developmental editor) | Em-dash in every paragraph, used for continuation rather than a break in thought; sentence fragments given their own line, especially before scene hooks; self-declaratory sentences with weak verbs, artificial even in first person; repetitive "comma + like / as if" simile constructions; shallow POV with no deep interiority; broken motivation-reaction units (cause-and-effect chains that do not close) | "Ambiguity was not weakness. It was survival." (offered as the tell) | medium-high — the most fiction-mechanics-specific tell list I found |
| 19 | Mia Kiraki, "The internet made a ban list for AI writing. I'm making a case for the defense" (2026-03-25) | https://robotsatemyhomework.substack.com/p/ai-writing-patterns | essay — **counter-evidence** | Argues eight of the banned patterns are legitimate devices with long human precedent; the discriminator is intentionality, not the pattern. Concedes the real defects: AI defaults to three because three is the statistical average, and uniform paragraph lengths produce metronomic, flat prose | "hear the metronome in any prose" | medium — the disconfirming case, and it concedes the rhythm finding |
| 20 | Andi Zeisler, "AI can't have my em dash" (Salon, 2025-06-11) | https://www.salon.com/2025/06/11/ai-cant-have-my-em-dash/ | essay — **counter-evidence** | The em dash is not a reliable AI tell: models over-use it because they were trained on human authors who used it abundantly. The tell-hunt is now distorting human writing, pushing writers to abandon a device to avoid suspicion | "trained on books … whose authors embraced them first" | medium-high — the necessary corrective to any punctuation-based detector |

Also read and deliberately not tabled: aismells.com's "It's Not X — It's Y" entry (aggregator; its RLHF
mechanism is covered better by Gorrie, and its frequency figures are all second-hand); Ugo Bardi,
"The AI Novels are Coming!" (Chimeras — good on triple negation and on setups that are never paid
off, but a general-interest blog with no craft credential I could verify); Lincoln Michel, "Criticism
in the Age of AI" (Counter Craft — novelist and critic, sharp on "the generic averaging of terabytes
of training data", but it is a criticism essay rather than a prose-failure taxonomy).

---

## Master list of failure modes, ranked by number of tabled sources naming it

Counts are over the 20 tabled sources. A source is counted only where it names the mode explicitly.

| Rank | Failure mode | n | Sources |
|---|---|---|---|
| 1 | **Em-dash overuse and punctuation tics** | 7 | 1, 2, 3, 14, 15, 18 name it; **20 disputes its reliability** |
| 1= | **Abstraction where a concrete fact belongs; generic rather than observed detail** | 7 | 2, 4, 5, 13, 14, 16, 17 |
| 3 | **Reflexive antithesis — "not X but Y", "not just X but Y", triple negation** | 6 | 1, 2, 3, 14, 15; **19 concedes while defending it** |
| 3= | **Uniform sentence and paragraph rhythm; low burstiness; metronomic prose** | 6 | 8, 9, 14, 17, 18, 19 |
| 3= | **No subtext; tell-don't-show; characters and narration over-explain** | 6 | 5, 6, 12, 13, 16, 18 |
| 6 | **Lexical tells — delve, tapestry, landscape, vibrant, testament, beacon, quietly, "serves as"** | 5 | 1, 2, 3, 14, 15 |
| 6= | **Portentous vagueness; inflated significance; summarising closers ("a reminder that", "a testament to")** | 5 | 1, 2, 3, 14, 15 |
| 6= | **Homogenisation — outputs converge on each other; collective diversity collapses** | 5 | 6, 7, 8, 9, 10 |
| 9 | **Tidy resolution; hasty pacing; every thread closed; endings that inflate scope and abandon the characters** | 4 | 5, 6, 7, 17 |
| 9= | **Cliché and stock imagery; "pet words" repeating across otherwise unrelated outputs** | 4 | 4, 5, 14, 16 |
| 9= | **Lists of three / tricolon / triadic scaffolding** | 4 | 2, 3, 15, 19 |
| 9= | **Flat or absent authorial voice; prose as the average of its training data** | 4 | 2, 8, 9, 13 |
| 9= | **Local coherence with global incoherence — setups never spent, characters who vanish, broken motivation-reaction units** | 4 | 5, 7, 18 (+6 on single-track plots) |
| 9= | **Over-structuring — headings, bullets, enumerations bleeding into prose** | 4 | 1, 2, 14, 15 |
| 15 | **Risk aversion — discomfort softened, cruelty explained away, judgment never withheld, nothing at stake** | 3 | 2 (hedging), 13 (unearned emotion), 17 (explicit) |
| 15= | **Copulative avoidance — "serves as", "stands as", "marks" in place of "is"** | 3 | 1, 2, 15 |
| 17 | **Purple prose — ornament exceeding the load it carries** | 2 | 4 (named category), 5 (over-modified description) |
| 17= | **The taste inversion — non-expert and LLM judges *prefer* the machine prose** | 2 | 8 (+1.19 to +1.85 for AI among non-experts and LLM judges), 5 (expert-only panel by design) |

### The three findings I would carry forward above the rest

1. **The strongest tell is structural, not lexical.** StoryScope (6) separates human from AI fiction at
   93.2% macro-F1 using discourse-level narrative features *alone* — 97% of the performance that
   adding stylistic cues buys. A de-slopping pass that only strips "tapestry" and em-dashes leaves
   the discriminating signal untouched.
2. **The taste inversion is the operational hazard.** Ismayilzada et al. (8) found non-experts and
   LLM judges rating the AI stories 1.19–1.85 points *higher* while experts rated them 1.25 points
   lower. An LLM asked to grade its own prose for these failure modes will systematically grade
   in the wrong direction. Any gate built on model self-assessment inherits that inversion.
3. **Better models are more uniform, not less.** O'Sullivan (9) reports GPT-4 clustering *more*
   tightly than GPT-3.5; Echoes in AI (7) finds the idiosyncratic plot echoes crossing model
   families. Homogenisation is not a defect that scale is fixing.

---

## Open-questions ledger

- **Unverified:** O'Sullivan (9) full text — the Nature and ScienceDirect hosts refused the fetch, so
  the per-feature stylometric detail (which function words, what punctuation) is not confirmed;
  only the clustering result is.
- **Unverified:** every quotation's exact wording, per the method caveat above.
- **Single-sourced:** the risk-aversion finding (mode 15) rests substantially on Lowe (17), a
  practitioner essay with no measurement behind it. It is the mode most worth a second source and
  the one I most expect the chair to want.
- **Deliberately not covered:** detection *tooling* efficacy (GPTZero, Copyleaks, Originality.ai
  accuracy claims) — vendor-interested and outside the craft question as framed.
- **Would most change these conclusions:** a study that measures human *reader* discrimination on
  literary prose specifically, rather than expert-panel scoring. I did not find one.
- **Weakest link:** the counts in the ranked table conflate a peer-reviewed measurement with a blog
  observation. Sources 4, 5, 6, 7, 8, 10 carry evidential weight the essays do not; the rank order
  reflects breadth of mention, not strength of evidence.
- **Disconfirming search result, reported as required:** I searched specifically for the case
  *against* these tells and found it (19, 20). It is real and partial — the em dash in particular
  fails as a discriminator, and the rhetorical figures are legitimate devices. Neither source
  disputes the rhythm-uniformity, homogenisation, or subtext findings; both concede them.
