# LLM prose in record-like registers — raw sweep notes

Angle: where generated prose fails in ENCYCLOPEDIC / ARCHIVAL / GAZETTEER / GENEALOGICAL / CITATION registers, as distinct from fiction. Compiled 2026-09-06 (fetch date for every row below) by the ai-record-register finder lane.

## Method receipt (only what actually ran)

- 13 WebSearch queries issued before the session-wide search budget (200/200, shared with sibling lanes) ran out. Queries: Geng/Trotta; WikiProject AI Cleanup fabricated citations local history; 404 Media Amberlihisar; AI local-history books; genealogy ChatGPT fabricated ancestors; archivists LLM finding aids; Signpost "Signs of AI writing" history; LLM fabricated-citation rates; "Wikipedia in the Era of LLMs"; FActScore biographies; STORM failure modes; Princeton WikiNLP 4.36%; fake villages / hallucinated geography; AI travel guidebooks.
- FOUR planned queries did NOT run (budget exhausted): ASIC summarisation trial; AI-generated obituaries; historians' tests of ChatGPT on dates; an explicit NEGATION query on false positives of the "signs of AI writing" list. Disconfirmation was instead taken from within the fetched corpus (Signpost's detector critique; the talk page's rejected signs; WP:AISIGNS's own caveat that indicators are not proof) — see rows S2, S9.
- 31 URLs fetched. 27 substantive. Non-substantive: 404 Media librarians piece (paywalled, one usable line); ABC ASIC URL (training-memory URL landed on a weather story — dropped, NOT cited); Geng & Trotta PDF (binary; superseded by the HTML v2 fetch); NeurIPS taxonomy PDF (binary; superseded by HTML).
- Stopping rule: not reached by convergence — the last two searches (fake villages; travel guides) still surfaced new sources. Ceiling was the search budget, not dryness.
- Fetches run through a summarising model: quotations are REPORTED verbatim, not observed by me. Failure-mode claims are CONFIRMED against the fetched text; quote wording is PLAUSIBLE-at-the-character-level until re-verified.

## Source table

| # | Source | URL | Kind | Substantive |
|---|---|---|---|---|
| S1 | Wikipedia:Signs of AI writing | https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing | community reference (WikiProject AI Cleanup) | yes |
| S2 | Wikipedia talk:Signs of AI writing | https://en.wikipedia.org/wiki/Wikipedia_talk:Signs_of_AI_writing | editor discussion | yes |
| S3 | Signs of AI writing — revision history (last 100 edits, 2026-08-12 → 2026-09-06) | https://en.wikipedia.org/w/index.php?title=Wikipedia:Signs_of_AI_writing&action=history&limit=100 | revision log | yes |
| S4 | Wikipedia:WikiProject AI Cleanup | https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup | project page | yes |
| S5 | WikiProject AI Cleanup/Guide and resources | https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup/Guide | project guide | yes |
| S6 | Wikipedia:Large language models | https://en.wikipedia.org/wiki/Wikipedia:Large_language_models | policy essay | yes |
| S7 | Wikipedia:Case against LLM-generated articles | https://en.wikipedia.org/wiki/Wikipedia:Case_against_LLM-generated_articles | essay | yes |
| S8 | Brooks, Eggert & Peskoff 2024, "The Rise of AI-Generated Content in Wikipedia" (WikiNLP/EMNLP 2024) | https://arxiv.org/html/2410.08044 | study | yes |
| S9 | Wikipedia Signpost 2024-10-19 "Recent research" (review of S8) | https://en.wikipedia.org/wiki/Wikipedia:Wikipedia_Signpost/2024-10-19/Recent_research | research review / critique | yes |
| S10 | Liang et al. 2024, "Mapping the Increasing Use of LLMs in Scientific Papers" | https://arxiv.org/html/2404.01268v1 | study | yes |
| S11 | Geng & Trotta 2024, "Is ChatGPT Transforming Academics' Writing Style?" | https://arxiv.org/html/2404.08627v2 | study | yes |
| S12 | Kobak et al. 2024, "Delving into ChatGPT usage in academic writing through excess vocabulary" (Sci. Adv. 2025) | https://arxiv.org/html/2406.07016v1 | study | yes (chair already holds this one per failure-modes-sources.md) |
| S13 | Huang, Xu, Geng, Wan & Chen 2025, "Wikipedia in the Era of LLMs: Evolution and Risks" (TMLR) | https://arxiv.org/html/2503.02879v1 | study | yes |
| S14 | Min et al. 2023, "FActScore" (EMNLP 2023) | https://arxiv.org/html/2305.14251 | study | yes |
| S15 | Shao et al. 2024, "Assisting in Writing Wikipedia-like Articles From Scratch" (STORM, NAACL 2024) | https://arxiv.org/html/2402.14207 | study | yes |
| S16 | WETBench 2025 (Wikipedia task-specific MGT benchmark) | https://arxiv.org/html/2507.03373v1 | study | yes (modest) |
| S17 | 404 Media 2024-10, "The Editors Protecting Wikipedia from AI Hoaxes" | https://www.404media.co/email/d516cf7f-3b5f-4bf4-93da-325d9522dd79/ | journalism | yes |
| S18 | 404 Media 2025, "Librarians Are Being Asked to Find AI-Hallucinated Books" | https://www.404media.co/librarians-are-being-asked-to-find-ai-hallucinated-books/ | journalism | NO (paywall; one line) |
| S19 | Index on Censorship 2025-11, "History is being written by the AI victors" | https://www.indexoncensorship.org/2025/11/history-is-being-written-by-the-ai-victors/ | journalism/essay | yes |
| S20 | Historica.org, "AI Hallucinations and the Risks to Historical Research Integrity" | https://www.historica.org/blog/ai-fictions-historiography-misinformation | blog (historiography) | yes (moderate) |
| S21 | Denyse Allen, "AI safety for family historians" | https://denyseallen.substack.com/p/ai-safety-family-historians-genealogy | practitioner essay (genealogy) | yes |
| S22 | Amy Johnson Crow, "Using ChatGPT for Genealogy — Accurately" | https://www.amyjohnsoncrow.com/using-chatgpt-for-genealogy-accurately/ | practitioner test (genealogy) | yes |
| S23 | "Automated Archival Descriptions with Federated Intelligence of LLMs" 2025 | https://arxiv.org/html/2504.05711 | study (ISAD(G) archival description) | yes |
| S24 | Walters & Wilder 2023, "Fabrication and errors in the bibliographic citations generated by ChatGPT" (Sci Rep) | https://pmc.ncbi.nlm.nih.gov/articles/PMC10484980/ | study | yes |
| S25 | "Influence of Topic Familiarity and Prompt Specificity on Citation Fabrication in Mental Health Research" (JMIR 2025) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12658395/ | study | yes |
| S26 | Ansari 2026, "Compound Deception in Elite Peer Review: A Failure Mode Taxonomy of 100 Fabricated Citations at NeurIPS 2025" | https://arxiv.org/html/2602.05930 | study | yes |
| S27 | Euronews Travel 2026-01-30, AI travel site sent tourists to a non-existent hot spring | https://euronews.com/travel/2026/01/30/how-an-ai-generated-travel-website-sent-tourists-to-a-non-existent-hot-spring-attraction | journalism | yes |
| S28 | Vice, "An AI-Generated NWS Map Hallucinated Fake Towns in Idaho" | https://www.vice.com/en/article/an-ai-generated-nws-map-hallucinated-fake-towns-in-idaho/ | journalism | yes (modest) |
| S29 | arXiv abs pages for S8, S10, S11, S12, S23 (abstract-only fetches, superseded by the HTML full texts above) | — | — | superseded |
| S30 | ABC News URL for the ASIC summarisation trial (training-memory URL) | https://www.abc.net.au/news/2024-09-03/ai-worse-than-humans-in-every-way-at-summarising-information/104295016 | — | NO — landed on an unrelated weather story; NOT cited |

## Findings by failure family (record register)

### A. Fabrication that wears the record's clothes
- Amberlihisar (S4, S17, S7): ~2,000-word article on an Ottoman fortress "built in 1466 by Mehmed the Conqueror", real ruler + plausible structural detail + well-formatted citations to nonexistent works; created 2023-01, passed Articles for Creation, exposed 2023-12. The register was flawless; the referent did not exist.
- Fictitious species with plausible detail: "greater-toothed pademelons" (S6); "completely fictitious animal" (S7).
- Fake sources in low-checkability languages: Leninist historiography cited "completely fake sources in Russian and Hungarian" (S4).
- Real-but-off-topic citation: Estola albosignata beetle paragraph cited a French crab paper (S4, S17, S7).
- Citation fabrication rates: GPT-3.5 55% / GPT-4 18% fabricated; of REAL citations 43% / 24% carry substantive errors; numeric elements (volume/pages, year) worst; book chapters 70% fabricated (S24). GPT-4o: 19.9% fabricated, 45.4% of real ones erroneous, DOIs 37.8% (S25).
- Taxonomy of fabricated citations (S26): Total Fabrication 66%, Partial Attribute Corruption 27% (real authors on papers they did not write), Identifier Hijacking 4%, Placeholder Hallucination 2% ("Firstname Lastname"), Semantic Hallucination 1%; 100% compound — 76% of total fabrications "layered semantic plausibility" over invention.
- Genealogy: "They invent record collections."; "fictional ancestors with total confidence"; gap-filling agents produce fake marriage/census entries (S21). Biography of an obscure man: "There's nothing in this biography that's correct." (S22).
- Gazetteer: Weldborough Hot Springs listed among real Tasmanian springs on an AI travel site (2025-07), tourists detoured to a village with no springs; "Sacred Canyon of Humantay" in Peru; wrong ropeway hours in Japan (S27). NWS map with toponyms "Orangeotild" and "Whata Bod" (S28). Library patrons asking for books that "don't exist" after an AI-generated newspaper reading list paired real authors with fabricated titles (S18, partial).

### B. Obscurity multiplies invention (the long-tail cliff)
- FActScore (S14): ChatGPT atomic-fact precision 58.3% on biographies overall; ~80% for frequent entities → ~16% for rare ones; "error rates are higher for facts mentioned later"; citations present in 36% of both supported and unsupported sentences.
- Mental-health reviews (S25): fabrication 6% (major depression) → 28% (binge eating) → 29% (body dysmorphic disorder).
- WP:Case against (S7): "invented details when faced with a prompt on an obscure topic".
- Implication for a settlement engine: every generated town is a rare entity; the model's prior fills the gap with the genre's average.

### C. Sourcing that does not bind the claim
- "virtually always fail to properly source claims" (S4); "will likely not verify the content" — real sources cited without checking they support the sentence (S4).
- STORM editors (S15): citation errors are mostly "improper inferential linking", then inaccurate paraphrase, then irrelevant source; "surpassing basic fact-checking".
- Synthesis not in any source: conclusions "not present in any single reliable source" (S6).
- Verification is the only reliable detector: "check whether the sources support the text" (S5).

### D. Over-association and bias transfer
- STORM (S15): 7/10 editors said generated articles sound "emotional" or "unneutral" (source bias transfer); "introduce unverifiable connections between different pieces of information" (over-association / red herring).
- Frequency-as-truth (S19): "if it finds a particular version cited more often" it treats that as mainstream; dominant narratives amplified, minority perspectives marginalised (S19, S20).
- Neutral-seeming tone, non-neutral substance (S6); flagged new articles "partial towards a specific viewpoint" — Albanian-history sockpuppet changed battle outcomes "Mixed Results" → "Victory" then generated related articles (S8).

### E. Register leaks (the encyclopedic-voice tells, from WP:AISIGNS S1 + talk S2)
- Undue significance/legacy: "marking a pivotal moment in the evolution of regional statistics".
- Promotional/travel-brochure: "Nestled within the breathtaking region of Gonder in Ethiopia".
- Participial gloss tails: "further enhancing its significance as a dynamic hub".
- Vague attribution: "Industry reports suggest"; "Some critics contend".
- Canned notability (characterising coverage instead of stating facts).
- Outline-like closers: "Despite its success, the Panama Canal faces challenges".
- AI vocabulary density: "enduring testament to the influence".
- Copula avoidance: "serves as LAAA's exhibition space for contemporary art".
- Vague connection: "being associated with leadership"; periphrastic "in connection with", "involvement in" (720 Draft-space hits, S2).
- Negative parallelism: "not only a work of self-representation, but a visual document".
- Agentless action — inanimate subjects promoted to agents: "Rooms tighten", "maps publish" (S2).
- Title-as-proper-noun leads: "EuroGames editions is the chronological list".
- Ubiquitous "Awards and recognition" section; rule of three; em-dash overuse; section-summary recaps (2022–24 marker); reader address "As you can see from the evidence presented above".
- Knowledge-cutoff leak in a live article: "As of my last knowledge update in January 2022" (Chester Mental Health Center, S17).
- Markup artefacts: oaicite, contentReference, turn0search0; Markdown in wikitext (downgraded 2026-08-27: "LLMs aren't bad at wikitext to this extent anymore", S3); a recurring broken wikitable across musician discographies (S2).

### F. Corpus-scale drift measured in record-adjacent registers
- Liang (S10): realm / intricate / showcasing / pivotal — "sudden surge in usage starting in 2023"; LLM-modified sentences 17.7% in <5,000-word papers vs 13.6% longer; 22.2% in crowded fields vs 14.7%.
- Geng & Trotta (S11): "significant" +99% (CS) to +308% (math); "is"/"are" down 10–17% in 2023; ~35% of CS abstracts LLM-style by 2024-01.
- Kobak (S12): 2024 excess vocabulary "consisted almost entirely of style words"; delves 25.2×, showcasing 9.2×, underscores 9.1×; ≥10% of 2024 PubMed abstracts; "all LLM-generated introductions on a certain topic might sound the same".
- Huang (S13): LLM revision of Wikipedia — longer words, fewer to-be/auxiliary verbs, fewer pronouns, longer sentences, "tend to be less readable" (Flesch-Kincaid, Dale-Chall, Coleman-Liau all rise); RAG "clear drop in accuracy" on revised text via keyword replacement/omission; ~1–2% of articles in some categories.
- Brooks (S8): >5% of new EN articles flagged at 1% FPR; flagged articles 0.667 vs 0.972 footnotes/sentence, 0.383 vs 1.77 links/word — "less integrated into the Wikipedia nexus"; self-promotion 8/45, polarisation 8/45; "Reference links are all dead apart from one".

### G. Archival description specifically (S23)
- ISAD(G) nine elements, four LLMs (Grok 3, GPT-4-turbo, DeepSeek-V3, Gemini 2.0 Flash) vs archivist ground truth, LLM-as-judge scoring.
- Failure modes named: tag/format inconsistency across models AND across runs of the same model ("even the same LLM might use various tags"); "do not always strictly follow" the standard; scores decline with document size; over-completeness — Extent rendered "3 pages, digital document (PDF)" against ground truth "3 pages" (adds unasked-for detail).
- NOT found in this paper: verbatim hallucination examples, invented provenance. Gap.

### H. Disconfirmation / limits of the tells (must travel with the rules)
- Signpost (S9): GPTZero is a black box; detectors disagree across languages; concept drift unaddressed; human editing reportedly RAISES AI scores.
- Talk page (S2): end-of-paragraph citation placement REJECTED as a sign — humans have done it "for two decades"; editors keep a 106-item spreadsheet, most rows variants of a core set.
- Revision history (S3): the list is non-stationary — Markdown sign downgraded 2026-08-27; "vague expression of connection" added 2026-08-19; "pro-authoritarian bias" added 2026-08-20. A tell list is a dated snapshot.
- WETBench (S16): task-specific generations (paragraph writing, lead summarisation, neutralisation) sit closer to human text; detectors 58–78%; "detectors struggle with MGT in realistic generation scenarios".
- AISIGNS itself: indicators are not proof — LLMs are trained on Wikipedia.

## Leads NOT verified (do not cite)
- "delve" frequency fell after being publicised in early 2024 while "significant" kept rising — appeared in a search summary attributed to Geng & Trotta / their 2025 coevolution paper (arXiv 2502.09606); the coevolution paper was not fetched.
- ASIC 2024 Llama2-70B summarisation trial (AI summaries scored below human on every criterion; missed nuance; irrelevant content) — training memory only; two URL attempts, first landed on the wrong page.
- Slate 2025-11 on Arcadia Publishing local-history books (training-data angle, not failure modes) — not fetched.
- Halupedia (Vice/Futurism) — a deliberate hallucination wiki; not fetched, low value.

## Addendum (after the notes above were written)
| S31 | Crikey 2024-09-03, "AI worse than humans in every way at summarising information, government trial finds" | https://www.crikey.com.au/2024/09/03/ai-worse-summarising-information-humans-government-trial/ | journalism | PARTIAL (paywall) — confirms Amazon ran the ASIC trial on five parliamentary-inquiry submissions and that AI summaries were judged worse on every criterion and "might actually create additional work for people"; the named failure modes (missed nuance, irrelevant content) are behind the paywall / in the Senate answer to questions on notice, NOT read. Cite only the headline-level claim. |
