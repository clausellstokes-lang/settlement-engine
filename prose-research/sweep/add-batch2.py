# -*- coding: utf-8 -*-
CR = "https://arxiv.org/abs/2506.13681"
AP = "https://arxiv.org/abs/2510.15061"
AS = "https://github.com/sam-paech/antislop-sampler"
SF = "https://github.com/sam-paech/slop-forensics"
SS = "https://eqbench.com/slop-score.html"

SRC_CR = "Rylan Schaeffer, Joshua Kazdan and Yegor Denisov-Blanch (Stanford University), 'Min-p, Max Exaggeration: A Critical Analysis of Min-p Sampling in Language Models', arXiv preprint v2, 19 Jun 2025"
SRC_AP = "Samuel J Paech, Allen G Roush, Judah Goldfeder and Ravid Shwartz-Ziv, 'Antislop: A Comprehensive Framework for Identifying and Eliminating Repetitive Patterns in Language Models', arXiv preprint v2, 21 Oct 2025"
SRC_AS = "Sam Paech, antislop-sampler README (GitHub), updated 13 Oct 2024"
SRC_SF = "Sam Paech, slop-forensics README (GitHub), 2025"
SRC_SS = "Sam Paech, 'Slop Score' explainer page, EQ-Bench (eqbench.com), read 6 Sep 2026"

R_PDF = "arXiv PDF binary -> pdftotext -layout"
R_RAW = "raw.githubusercontent.com README, browser user agent"
R_WEB = "live URL with browser user agent, HTML stripped locally"

batch2 = [
# ---- min-p critique (COUNTER-EVIDENCE to the roster's own high-temperature claim) ----
dict(feature="counter-evidence",
 claim="Schaeffer, Kazdan and Denisov-Blanch re-analysed the min-p paper's own human-evaluation data and concluded min-p did not outperform baseline samplers on quality.",
 source=SRC_CR, url=CR, quote="our reanalysis demonstrates min-p did not out", page="Abstract (the quotation breaks at a line-wrapped hyphen; the word completed is 'outperform')",
 kind="measurement", polarity="rejects", date="2025-06-19", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="re-analysis of Nguyen and colleagues' 2024 Llama 3 70B creative-story human study, published June 2025; register measured: prompted short fiction."),

dict(feature="counter-evidence",
 claim="Schaeffer and colleagues report that in the min-p paper's own human-evaluation data the three samplers scored similarly on both quality and diversity, with 95 percent confidence intervals frequently overlapping.",
 source=SRC_CR, url=CR, quote="the three samplers provide similar quality and similar diversity", page="section 2.2, discussion of Figure 1",
 kind="measurement", polarity="rejects", date="2025-06-19", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="Nguyen and colleagues' 2024 Llama 3 70B Prolific study, re-plotted June 2025; register measured: prompted short fiction."),

dict(feature="counter-evidence",
 claim="Schaeffer and colleagues' twelve one-sided paired t-tests on the min-p paper's data supported min-p's superiority in one of twelve comparisons after Bonferroni correction at alpha 0.05.",
 source=SRC_CR, url=CR, quote="", page="Table 1 caption",
 kind="measurement", polarity="rejects", date="2025-06-19", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="re-analysis of the 2024 min-p human study, June 2025; paired t-tests with 52 degrees of freedom; without correction 5 of 12 reached alpha 0.05."),

dict(feature="reader and expert judgment",
 claim="Schaeffer and colleagues, annotating the min-p study's free-text responses, found that more human evaluators explicitly preferred plain temperature sampling than preferred min-p.",
 source=SRC_CR, url=CR, quote="more human evaluators explicitly preferred basic sampling than preferred min-p", page="section 2.3",
 kind="measurement", polarity="rejects", date="2025-06-19", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="qualitative responses from Nguyen and colleagues' 2024 Prolific study, re-annotated June 2025; register measured: prompted short fiction."),

dict(feature="detection and its failures",
 claim="Schaeffer and colleagues report that the min-p paper's creative-writing table gave the higher of two available scores for min-p and the lower of two for top-p.",
 source=SRC_CR, url=CR, quote="the higher of two scores was reported for min-p", page="section 4.3",
 kind="measurement", polarity="rejects", date="2025-06-19", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="audit of the min-p paper's AlpacaEval Creative Writing table, June 2025; the reported min-p win rate of 52.01 corresponds to p=0.05 while p=0.01 yields 50.14."),

dict(feature="steerability",
 claim="Schaeffer and colleagues conclude that all the samplers they swept perform roughly the same once each is given the same amount of hyperparameter tuning.",
 source=SRC_CR, url=CR, quote="all samplers perform roughly the same once given the same", page="section 6, Discussion and Limitations, Scientific Conclusions",
 kind="measurement", polarity="rejects", date="2025-06-19", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="9 models (Qwen 2.5 0.5B-7B, Mistral 7B v0.1, Llama 3.1 8B and 3.2 3B, Gemma 2 2B and 9B), base and instruct, 4 samplers, 31 temperatures from 0.0 to 3.0, swept June 2025; register measured: GSM8K chain-of-thought, a reasoning task, not prose."),

dict(feature="counter-evidence",
 claim="Schaeffer and colleagues allow that min-p may sometimes help at higher temperatures, with the caveat that absolute performance in that regime is meaningfully worse than at standard temperatures.",
 source=SRC_CR, url=CR, quote="min-p sampling can sometimes provide a benefit at higher temperatures", page="section 6, Discussion and Limitations",
 kind="analysis", polarity="disputes", date="2025-06-19", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="June 2025 assessment of the min-p evidence base across Qwen, Mistral, Llama and Gemma models. THIS IS THE ANSWER TO THE ROSTER'S HIGH-TEMPERATURE CLAIM: the peer-reviewed 'high temperature can be made coherent' result survives only as a weak effect inside a regime that is worse overall."),

# ---- Antislop paper (Paech as PRIMARY, with measurements) ----
dict(feature="lexical tells",
 claim="Paech and colleagues measured that some over-used patterns appear over one thousand times more often in language-model output than in human text.",
 source=SRC_AP, url=AP, quote="slop patterns appear over 1,000× more frequently in LLM output", page="Abstract",
 kind="measurement", polarity="asserts", date="2025-10-21", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="Gemma-3-12B, Mistral-Small-3.2 and Llama-3.3-70B, 2,000 generations per model from Reddit creative-writing prompts, October 2025; human baseline: wordfreq plus a curated corpus of Reddit creative writing and Project Gutenberg; register measured: prompted short fiction, not archival or encyclopedic."),

dict(feature="lexical tells",
 claim="Paech and colleagues measured that the name Elara appears 85,513 times more often in gemma-3-12b's creative writing than in their human baseline.",
 source=SRC_AP, url=AP, quote="appears 85,513 times more frequently", page="section 3.2, Empirical Findings, discussion of Table 1",
 kind="measurement", polarity="asserts", date="2025-10-21", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="gemma-3-12b, 2,000 creative-writing samples, October 2025; human baseline wordfreq plus Reddit and Project Gutenberg; register measured: prompted short fiction."),

dict(feature="homogenisation",
 claim="Paech and colleagues found the trigram 'voice barely whisper' among the top forty over-represented trigrams of 68.7 percent of the sixty-seven models they profiled.",
 source=SRC_AP, url=AP, quote="", page="Table 5 (Top overlapping trigrams across 67 AI models)",
 kind="measurement", polarity="asserts", date="2025-10-21", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="67 AI models profiled against a human baseline, October 2025; register measured: creative writing prompts. This is cross-model homogenisation measured directly rather than inferred."),

dict(feature="steerability",
 claim="Paech and colleagues state that stochastic decoding strategies such as top-k, top-p and min-p do not address a model's repetitive tendencies in outputs that are already coherent.",
 source=SRC_AP, url=AP, quote="these strategies do not address repetitive tendencies in coherent outputs", page="section 2, Related Work",
 kind="analysis", polarity="rejects", date="2025-10-21", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="assessment as of October 2025 across Gemma 3, Mistral Small 3.2 and Llama 3.3. THE BRIDGE CLAIM: the decoding literature's cures address degeneration, not the lexical and phrasal tells of modern instruction-tuned prose."),

dict(feature="steerability",
 claim="Paech and colleagues measured that their backtracking Antislop sampler suppressed banned patterns completely while scoring above the baseline model on their writing-quality rubric.",
 source=SRC_AP, url=AP, quote="The Antislop Sampler achieves perfect suppression (100%)", page="section 6.2, Main Results",
 kind="measurement", polarity="asserts", date="2025-10-21", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="gemma-3-12b with banlists of 2k, 4k and 8k patterns, 1,000 evaluation prompts from the Reddit writing dataset, GPT-5-judged rubric, October 2025; register measured: prompted short fiction."),

dict(feature="counter-evidence",
 claim="Paech and colleagues measured that plain token banning at eight thousand patterns dropped writing quality to 28 out of 100 on their rubric.",
 source=SRC_AP, url=AP, quote="quality falling to 28 (out of 100) at 8k patterns", page="section 6.2, Main Results",
 kind="measurement", polarity="asserts", date="2025-10-21", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="gemma-3-12b with logit-bias token banning at -100, October 2025; the degradation showed as 'severe repetition, spelling and grammar artifacting, and incoherence'; register measured: prompted short fiction."),

dict(feature="steerability",
 claim="Paech and colleagues measured that DPO fine-tuning on their slop preference pairs collapsed lexical diversity to between 74 and 92 percent of the baseline model's.",
 source=SRC_AP, url=AP, quote="FTPO maintains or enhances diversity", page="section 6.3, Lexical diversity",
 kind="measurement", polarity="asserts", date="2025-10-21", routeHint=R_PDF, registerHint="none",
 confidence="high",
 modelEra="gemma-3-12b, banlists 1k to 8k, October 2025; diversity is a length-controlled composite of MATTR-500, Root-TTR, HD-D and Distinct-1/2/3 normalised to the baseline at 100; register measured: prompted short fiction. The quotation is the contrasting clause; the 74-92 percent figures are in the same paragraph."),

dict(feature="other: mechanism of blandness",
 claim="Paech and colleagues cite Kirk and colleagues for the finding that RLHF significantly reduces output diversity relative to a supervised baseline.",
 source=SRC_AP, url=AP, quote="RLHF has been shown to significantly reduce output diversity", page="section 2, Related Work",
 kind="relay", polarity="asserts", date="2025-10-21", routeHint=R_PDF, registerHint="none",
 confidence="medium",
 modelEra="a citation to Kirk et al. 2024 inside an October 2025 paper; the primary was not fetched here, so this is a relay, not the measurement itself."),

# ---- Paech READMEs and Slop Score page: own words on mechanism ----
dict(feature="steerability",
 claim="Paech explains that per-token logit biasing cannot suppress most over-used phrases because they span more than one token, which is why his sampler waits for the whole phrase and backtracks.",
 source=SRC_AS, url=AS, quote="most slop words & phrases are more than one token", page="section 'What this does'",
 kind="own-words", polarity="asserts", date="2024-10-13", routeHint=R_RAW, registerHint="none",
 confidence="high",
 modelEra="written October 2024 about Llama-3.2-3B-Instruct-class open models in the Transformers stack; register measured: general chat and story generation. Mechanism claim about why decoding-level cures for lexical tells are hard."),

dict(feature="lexical tells",
 claim="Paech states that his default slop list was computed as words over-represented in language-model output relative to normal human writing.",
 source=SRC_AS, url=AS, quote="over-represented in LLM output compared to normal human writing", page="section 'What this does'",
 kind="own-words", polarity="asserts", date="2024-10-13", routeHint=R_RAW, registerHint="none",
 confidence="high",
 modelEra="October 2024; the list was auto-generated from a large LLM-generated story dataset, which Paech himself calls 'not well optimised or curated'; register measured: stories."),

dict(feature="detection and its failures",
 claim="Paech states that his Slop Score looks for glaringly over-used patterns rather than classifying a text as machine or human, and will not reliably help a writer evade AI detectors.",
 source=SRC_SS, url=SS, quote="It looks for glaringly over-used patterns, rather than trying to classify", page="'How does this work?' panel, 'Not an AI Detector!'",
 kind="own-words", polarity="asserts", date="read 2026-09-06", routeHint=R_WEB, registerHint="none",
 confidence="high",
 modelEra="EQ-Bench Slop Score as served September 2026; lists computed from outputs of 10 language models on essay and creative-writing prompts against human-authored text."),

dict(feature="register measured",
 claim="Paech warns that his Slop Score analysis is optimised for creative writing and essays and will likely under-report slop in other domains.",
 source=SRC_SS, url=SS, quote="will likely under-report slop", page="'How does this work?' panel, 'Tips for the Analysis Tool'",
 kind="own-words", polarity="asserts", date="read 2026-09-06", routeHint=R_WEB, registerHint="dossier-archivist",
 confidence="high",
 modelEra="EQ-Bench Slop Score as served September 2026. DIRECTLY ON THE PROGRAM'S GAP: the standing lexical instrument is calibrated on fiction and essays and is expected to under-read on an archival or gazetteer register."),

dict(feature="punctuation tics",
 claim="Paech weights contrast patterns of the 'not just X, but Y' shape at 25 percent of his composite Slop Score.",
 source=SRC_SS, url=SS, quote="25% - Not-x-but-y Patterns", page="'Slop Score Calculation'",
 kind="own-words", polarity="asserts", date="read 2026-09-06", routeHint=R_WEB, registerHint="none",
 confidence="high",
 modelEra="EQ-Bench Slop Score as served September 2026; the remaining weights are 60 percent single slop words and 15 percent slop trigrams; register measured: creative writing and essays."),

dict(feature="stylometry",
 claim="Paech's slop-forensics toolkit clusters models into a lineage tree by treating each over-used slop term as a present-or-absent trait and running the bioinformatics program PHYLIP over the resulting binary vectors.",
 source=SRC_SF, url=SF, quote="over-represented lexical patterns", page="README, 'How the Analysis Works', section 3",
 kind="own-words", polarity="asserts", date="2025", routeHint=R_RAW, registerHint="none",
 confidence="high",
 modelEra="slop-forensics as published 2025; the profile is built from single words, bigrams and trigrams with stop-words removed; register measured: whatever prompt set is generated, by default creative writing."),
]

sources2 = [
 dict(title="Min-p, Max Exaggeration: A Critical Analysis of Min-p Sampling in Language Models (Schaeffer, Kazdan, Denisov-Blanch)", url=CR, kind="measurement", substantive=True, date="2025-06-19 (v2)", route=R_PDF),
 dict(title="Antislop: A Comprehensive Framework for Identifying and Eliminating Repetitive Patterns in Language Models (Paech, Roush, Goldfeder, Shwartz-Ziv)", url=AP, kind="measurement", substantive=True, date="2025-10-21 (v2)", route=R_PDF),
 dict(title="antislop-sampler README (Sam Paech)", url=AS, kind="own-words", substantive=True, date="2024-10-13 last dated update", route=R_RAW),
 dict(title="slop-forensics README (Sam Paech)", url=SF, kind="own-words", substantive=True, date="2025", route=R_RAW),
 dict(title="Slop Score explainer, EQ-Bench (Sam Paech)", url=SS, kind="own-words", substantive=True, date="read 2026-09-06", route=R_WEB),
 dict(title="auto-antislop README (Sam Paech)", url="https://github.com/sam-paech/auto-antislop", kind="own-words", substantive=False, date="2025", route=R_RAW),
]
