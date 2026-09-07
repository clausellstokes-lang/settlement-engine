# Where LLM prose fails — GAMES research and practice (raw sweep notes)

Angle: games research and practice beyond trade press — CALYPSO (AIIDE 2023), Kreminski's LLM story-generation papers, Emily Short, Ubisoft NEO NPC (GDC 2024), Square Enix Portopia (April 2023), AI Dungeon, Keywords' Project Ava (2024), Xalavier Nelson Jr., and the module reviewers (tenfootpole, The Alexandrian, Sly Flourish). Compiled 2026-09-06 (fetch date for every row) by the ai-games-practice finder lane. Checkpoint JSON: `found-ai-games-practice.json` (same directory). Raw HTML/PDF/text for every verified page: `games-raw/`.

## Method receipt (only what actually ran)

- **WebSearch: 11 queries issued**, then the session-wide budget (200/200, shared with sibling lanes) was exhausted on the 12th. Queries: CALYPSO AIIDE 2023; Kreminski homogenization; Emily Short LLM NPCs; Ubisoft Neo NPC GDC 2024 hands-on; Portopia AI April 2023 reception; Keywords Project Ava; tenfootpole AI module review; Sly Flourish AI read-aloud; The Alexandrian AI; Xalavier Nelson Jr. generative AI; AI Dungeon writing quality. Three further queries (emshort.blog LLM posts; slyflourish AI; Neo NPC criticism) were refused by the budget.
- **WebFetch: ~69 calls** across five batches. Substantive returns: 38. Failures: NPR (2× timeout, recovered via text.npr.org), Yahoo/Engadget NPC piece (403), gameshub (403), Stuff.tv (403 — recovered via curl), Digital Trends and PC Gamer (empty bodies — recovered via curl), Dearth PDF (binary — extracted locally with pypdf), emshort.com (self-signed cert), slyflourish articles.html (404), aiandgames /p/neo-npc guess (404), emshort.blog 2024 and 2025 archives (404 — i.e. no posts).
- **Verification pass:** 35 URLs re-fetched with curl into `games-raw/`, HTML stripped, and every quotation in the JSON grepped against the raw text. Quotations that the summarising model reported but that I could NOT find in raw text were dropped from the `quote` field (left empty) — the claim stands, the wording does not. Examples dropped: CALYPSO "refusing to suggest fantasy races"; Tell-Don't-Show "about half"; StoryScope "time jumps"; 148Apps "someone else entirely"; Temple of the Serpent Queen "EVERYTHING gets a backstory".
- **Stopping rule:** hit the budget ceiling, not convergence, for WebSearch. For WebFetch, the last two probes on Emily Short (2024/2025 archives) and Xalavier Nelson Jr. (author page, podcast page) were dry, so those two threads were closed as "could not find" (see Gaps).
- **Grades:** primary papers and first-person hands-ons > expert analysis (AI and Games, The Alexandrian, tenfootpole) > journalism (NPR, PC Gamer, Digital Trends, Time Extension, Game Developer) > corporate (Ubisoft News, Keywords AVA page — both interested parties, both candid) > aggregators (Wikipedia, used only as maps).

## Premise audits

- **"Keywords Studios' abandoned all-AI game."** Not quite. Keywords' own AVA page (2024-05-24) says the six-month project (April 2023 →) *completed* a 2D game only after pulling domain experts from eight studios; the game will not be released; AVA "evolved" into Project KARA. The Game Developer story (2024-03-13, quoting the FY2023 report) is the "unable to replace talent" source. So: the *all-AI* goal was abandoned; the *game* was finished by humans.
- **"Emily Short on LLM NPCs."** Her blog has no LLM-era posts: searches for LLM, "large language model", ChatGPT, "AI Dungeon", generative, plus the 2023 archive, found nothing later than her 2021-07-18 GPT-2 essay; the 2024 and 2025 archives 404. The Game Design Roundtable #308 page has an outline (9:38 "Emily and AI"; 31:27 "AI Text Replacement") but no transcript. Her LLM views exist in audio only — **not recovered**.
- **"Xalavier Nelson Jr. on generated prose."** Found only labour-pipeline (NPR 2024-03-14), stock-image provenance (GamesRadar 2024-01), and studio-stance (TheGamer 2025-11-12) statements. No statement from him about prose failure modes was found; his Game Developer author page lists one 2022 column. **Could not find** — reported as such.
- **"Portopia reception."** Confirmed by three independent lines (PC Gamer hands-on, Digital Trends hands-on, Steam aggregate) — but note the *generation* feature was cut before release ("risk of the AI generating unethical replies"), so Portopia is evidence about NLU parsing, not about generated prose. Its relevance to this sweep is the deflection-line pattern ("Maybe we should focus on the task at hand?") — canned fallback lines are what players actually meet.
- **"AI Dungeon."** The three review primaries (148Apps 2019-12-30; TapSmart 2020-02-28; Stuff c. 2020) are GPT-2-era. Their failure modes (no memory, dead-end loops, abrupt shifts, no resolution, player does the heavy lifting) are corroborated at GPT-4 scale by the 2025 ChatRPG study and by Gallotta et al.'s survey — different instruments, same shape. The 2026 arcanumrpgs / cuckoo pages surfaced by search are affiliate content and were NOT fetched or cited.

## Source table (S# → JSON sourcesRead order)

| # | Source | Kind | Substantive |
|---|---|---|---|
| S1 | CALYPSO (Zhu et al., AIIDE 2023) — ar5iv | games-research paper | yes |
| S2 | Homogenization Effects… (Anderson, Shah, Kreminski, C&C 2024) | paper | yes |
| S3 | Kreminski publications index | index | no |
| S4 | Dearth of the Author (Kreminski, In2Writing 2024) — PDF extracted | position paper | yes |
| S5 | Endless Forms Most Similar (Kreminski, AI&S 2025) — grep only | paper | no |
| S6 | Guiding and Diversifying… ASP (Wang & Kreminski, 2024) | paper | yes |
| S7 | Modifying LLM Post-Training for Diverse Creative Writing (COLM 2025) | paper | yes |
| S8 | Can LLMs Generate Good Stories? (CoG 2025) | games-research paper | yes |
| S9 | Are LLMs Capable of Generating Human-Level Narratives? (Tian et al., EMNLP 2024) | paper | yes |
| S10 | StoryScope (Russell et al., 2026) | paper | yes |
| S11 | LLMs and Games: Survey and Roadmap (Gallotta et al., v5 2024-12) | survey | yes |
| S12 | Static vs Agentic Game Master AI (ChatRPG, 2025-03) | games-research paper | yes |
| S13 | Evaluating Quality of Gaming Narratives Co-created with AI (Valdivia & Burelli, 2025-09) | Delphi study | yes |
| S14 | The Alexandrian — GenAI and RPGs (2025-12-28) | practitioner essay | yes |
| S15 | The Alexandrian tag/ai | index | no |
| S16–S19 | tenfootpole reviews: Curse of the Swamp (2024-06-01), A Strange House (2024-11-25), A Plague of Rats (2024-06-08), Temple of the Serpent Queen (2024-08-07) | module reviews | yes ×4 |
| S20–S21 | tenfootpole forum "Making a Module using ChatGPT" p4, p1 (Dec 2022) | forum | yes ×2 |
| S22 | tenfootpole site search "chatgpt" | dry | no |
| S23 | Sly Flourish — The Best LLM… Your Brain (2024-09-30) | practitioner essay | yes |
| S24–S25 | Sly Flourish — Writing Awesome Read-Aloud Text (2010); Tell, Don't Show (2024-02-12) | craft benchmarks | yes ×2 |
| S26 | Sly Flourish archive | index | no |
| S27 | Emily Short — The Uncanny Deck: Co-authoring with GPT-2 (2021-07-18) | practitioner essay | yes |
| S28 | Emily Short blog searches + 2023 archive | dry | no |
| S29 | Game Design Roundtable #308 page | podcast page, no transcript | no |
| S30 | Ubisoft News — NEO NPC team interview (2024-03-19) | corporate primary | yes |
| S31 | Game Developer — Higham NEO NPC hands-on (2024-03-19) | trade journalism | yes |
| S32 | AI and Games — Teammates + NEO NPC recap (Thompson, 2025-11-26) | expert analysis | yes |
| S33 | mattfife.com NEO NPC note | blog | no (thin) |
| S34 | Time Extension — Portopia flooded with negative reviews (2023-04) | journalism | yes |
| S35 | PC Gamer — Portopia deserves its rating (Macgregor, 2023-04-24) | journalism, hands-on | yes |
| S36 | Digital Trends — Portopia isn't selling me (Colantonio, 2023-04-25) | journalism, hands-on | yes |
| S37 | Steam store page — Portopia (fetched 2026-09-06: 15% of 476) | primary | yes |
| S38 | Wikipedia — Portopia | aggregator | no |
| S39 | Game Developer — Keywords unable to replace talent (2024-03-13) | trade journalism | yes |
| S40 | Keywords — Project AVA page (2024-05-24) | corporate primary | yes |
| S41 | PC Games Insider — Keywords (2024-03-15) | echo | no |
| S42 | NPR — Can AI create compelling video game stories? (2024-03-14, text-only) | journalism transcript | yes |
| S43 | GamesRadar — Nelson Jr. couldn't make Airport for Aliens today (2024-01) | journalism, off-angle | no |
| S44 | TheGamer — devs vs Nexon AI claim (2025-11-12) | journalism, stance only | no |
| S45 | Game Developer — Nelson Jr. author/podcast pages | index | no |
| S46 | Wikipedia — AI Dungeon | aggregator (map) | no |
| S47–S49 | AI Dungeon reviews: TapSmart (Mundy 2020-02-28), 148Apps (Bird 2019-12-30), Stuff (Grannell c. 2020) | app reviews | yes ×3 |
| S50–S51 | Kreminski PWIM FDG 2024; Unmet Needs 2022 — grep only | papers | no |

## Failure-mode synthesis (what each community says fails)

**Games-research papers (measured):**
- Positivity bias and flat tension: LLM arcs are homogeneously positive, negative arcs nearly vanish (Riches-to-Rags 1.3% vs 14.6%), turning points come early, late-story arousal is flat (Tian, EMNLP 2024). Acceptance endings 47% vs 27% (StoryScope).
- Over-determination: the narrator explains the theme (77% vs 52%); emotion rendered as bodily sensation (81% vs 38%); smell imagery over-used; no subplots (79% vs 57%); vague allusion instead of named specifics; protagonists morally unambiguous (StoryScope 2026, 61,608 stories).
- Homogeneity: group-level convergence across users (Anderson/Shah/Kreminski 2024, p=.038); semantic AND syntactic unoriginality, openings converge hardest (Wang & Kreminski 2024); post-training itself collapses diversity (Chung et al. COLM 2025).
- Planning: steps skipped at scale, actions without valid intention, conflict "shortcuts" (snakebite loops), collapse past ~10–12 characters (CoG 2025).
- Running a game: hallucinated creature facts (spiders with telepathy), paraphrase instead of synthesis, prompt-phrase echo, combat without state (CALYPSO 2023); detail drift (enemy counts change), inventory amnesia, stumbling/self-injury outcomes, over-compliance derailing the narrative (ChatRPG 2025; Gallotta survey).
- Designers' quality bar: "voice" had to be added as a dimension because naturalness didn't capture tone; genre misalignment is a must-be failure (Valdivia & Burelli 2025).

**Module reviewers (read-aloud and room text):**
- Padding that says nothing ("Arriving at the house, the PCs see a strange sight: the structure appears to be…") — Bryce Lynch; a commenter names it ChatGPT's default room style, cured by "be brief".
- Telling instead of showing: read-aloud that announces "the desperate cry of a woman in distress" and objects that "emanate a palpable malevolence".
- Second-person narration of the players' own actions ("YOU step off the boat"), attributed to ChatGPT's default unless told not to describe the player's actions.
- Determinism: the same prompt returns the same "stench of decay… dripping water" corridor a year apart; three dock encounters share one read-aloud.
- Fluff without mechanics ("burst of flame" with no damage), spatial nonsense (ceiling trap doors you fall through), source confabulation (Fiend Folio monsters not in the Fiend Folio), self-similar "unique" rooms (tenfootpole forum, Dec 2022).
- Backstory for everything and read-aloud that reveals all, removing the table's back-and-forth (Serpent Queen).
- The Alexandrian: continuity collapses because there is no held model — pirates become lost travellers mid-scene; "hallucination" is a misnomer for word-guessing. (Contested in his comments: several readers argue LLMs form *unreliable* models rather than none, and that agent tooling patches continuity — recorded as contested.)
- Sly Flourish: one article only — LLMs are "the illusion of help", produce "slop"; his craft benchmarks (cut 25%, short and powerful; tell players the facts plainly) are the bar generated boxed text misses.

**Studio practice:**
- Ubisoft: a raw model gives "boring, robotic answers"; the writer conditions it with backstory and colloquialisms; the team polices "Would Lisa say this?"; an attractive female character drifted flirtatious; the 20-minute demo took two narrative designers three months (Ubisoft News; Higham; Thompson). Thompson: chatbot demos are "bland"; he felt no need to talk to the NPCs.
- Keywords: the tech "couldn't write all the code or create great narrative"; useful for first drafts of dialogue; "unable to replace talent" after 400+ tools and seven studios.
- Square Enix Portopia: generation cut for safety; the NLU deflects with "Maybe we should focus on the task at hand?"; exact-wording demands reproduce the 1983 problem; 15% positive of 476 (Steam, 2026-09-06).
- Writers (NPR): Sawyer — "impressive for a chat bot", but the appeal is specificity, not "generic dialogue"; Park — believable micro-moments, not fun stories; Nelson Jr. — the pipeline of future voices; Barone — "soulless machines".
- AI Dungeon (GPT-2 era): no memory of premise, dead-end loops, abrupt shifts, "no recognizable thread or resolution", the player does "all the heavy lifting".

## Gaps / open questions

- **Unverified / not recovered:** Emily Short's spoken LLM views (podcast audio only); any Xalavier Nelson Jr. statement about prose quality (none found); PC Gamer's own NEO NPC hands-on (URL unknown, search budget gone); Stuff review date (page undated); the CoG 2025 paper's author list (cited by title; Kreminski co-authorship taken from his publications page).
- **Single-sourced:** the "two narrative designers, three months" figure (Thompson); the 400-tools / seven-studios figures (Keywords' own report, echoed by every outlet — ONE source).
- **Deliberately not fetched:** arcanumrpgs / cuckoo / toolify AI Dungeon pages (affiliate content farms); the Ubisoft GDC press-release PDF (marketing).
- **Contested:** The Alexandrian's "no mental model" claim is disputed in his own comment thread by ML practitioners; the measured papers (Tian, CoG) support the weaker form — models hold state badly and lose it with scale.
- **Weakest link:** CALYPSO and the AI Dungeon reviews describe 2019–2023 models; the tenfootpole review evidence is about modules whose AI authorship is inferred by readers, not admitted by publishers (except the "Curse of the Swamp" reply, which was itself written in ChatGPT style).
