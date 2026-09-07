# -*- coding: utf-8 -*-
import json, io, os
OUT = "found-ai-arch-decoding-literature.json"

H  = "https://arxiv.org/abs/1904.09751"
M  = "https://arxiv.org/abs/2202.00666"
NP = "https://arxiv.org/abs/2407.01082"
MI = "https://arxiv.org/abs/2007.14966"
CS = "https://arxiv.org/abs/2202.06417"

R = "arXiv PDF binary (https://arxiv.org/pdf/<id>) -> pdftotext"

SRC_H  = "Ari Holtzman, Jan Buys, Li Du, Maxwell Forbes and Yejin Choi, 'The Curious Case of Neural Text Degeneration', ICLR 2020 (arXiv v2, 14 Feb 2020)"
SRC_M  = "Clara Meister, Tiago Pimentel, Gian Wiher and Ryan Cotterell, 'Locally Typical Sampling', TACL 2023 (arXiv v6, 5 Jun 2025)"
SRC_NP = "Nguyen Nhat Minh, Andrew Baker, Clement Neo, Allen Roush, Andreas Kirsch and Ravid Shwartz-Ziv, 'Turning Up the Heat: Min-p Sampling for Creative and Coherent LLM Outputs', ICLR 2025 (arXiv v8, 20 Nov 2025)"
SRC_MI = "Sourya Basu, Govardana Sachitanandam Ramachandran, Nitish Shirish Keskar and Lav R. Varshney, 'Mirostat: A Neural Text Decoding Algorithm that Directly Controls Perplexity', ICLR 2021 (arXiv v2, 14 Jan 2021)"
SRC_CS = "Yixuan Su, Tian Lan, Yan Wang, Dani Yogatama, Lingpeng Kong and Nigel Collier, 'A Contrastive Framework for Neural Text Generation', NeurIPS 2022 (arXiv v3, 26 Sep 2022)"

claims = [
# ---------------- HOLTZMAN ----------------
dict(feature="uniform rhythm (low burstiness)",
 claim="Holtzman and colleagues report that the per-token probabilities the model assigns to human-written continuations vary far more from step to step than those of beam-search text given the same context.",
 source=SRC_H, url=H, quote="increased variance that characterizes human text", page="Figure 2 caption",
 kind="measurement", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 Large (762M) generating continuations of held-out WebText documents; measurement published February 2020; register measured: web-scraped documents (news/review prose), not fiction or archival record."),

dict(feature="uniform rhythm (low burstiness)",
 claim="Holtzman and colleagues assert that human language does not stay in a high-probability zone across consecutive tokens but veers into lower-probability, more informative ones.",
 source=SRC_H, url=H, quote="Natural language rarely remains in a high probability zone", page="section 4.3, 'Natural Language Does Not Maximize Probability'",
 kind="measurement", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 Large (762M) scoring held-out WebText, February 2020; register measured: web-scraped documents."),

dict(feature="other: repetition loop mechanism",
 claim="Holtzman and colleagues report that a language model raises the probability of a phrase each time that phrase repeats, so repetition is self-reinforcing.",
 source=SRC_H, url=H, quote="The probability of a repeated phrase increases with each repetition", page="Figure 4 caption",
 kind="measurement", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 Large (762M), February 2020; the effect held 'for the vast majority of phrases we tested, regardless of phrase length'; register measured: WebText continuations."),

dict(feature="other: mechanism of blandness",
 claim="Holtzman and colleagues conjecture that models trained on a per-word likelihood objective are pushed toward the lowest common denominator rather than toward informative language, so larger models alone will not cure blandness.",
 source=SRC_H, url=H, quote="forced to favor the lowest common denominator, rather than informative language", page="section 4.3",
 kind="analysis", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="argued about likelihood-trained language models generally, from GPT-2 Large observations, February 2020."),

dict(feature="other: mechanism of blandness",
 claim="Holtzman and colleagues ground their conjecture in Grice's maxims, saying that people avoid stating the obvious and therefore disfavour maximally predictable wording.",
 source=SRC_H, url=H, quote="people optimize against stating the obvious", page="section 4.3",
 kind="analysis", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="theoretical claim about human language, offered February 2020 alongside GPT-2 Large measurements."),

dict(feature="steerability",
 claim="Holtzman and colleagues measured that sampling temperatures below 0.9 sharply increase repetition in GPT-2 Large generations.",
 source=SRC_H, url=H, quote="Sampling with temperatures lower than 0.9 severely increase repetition", page="Figure 9 caption",
 kind="measurement", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 Large (762M), February 2020; repetition scored as a phrase of at least two tokens repeating three or more times at the end of a 200-token generation; register measured: WebText continuations."),

dict(feature="homogenisation",
 claim="In Holtzman and colleagues' Table 1, greedy decoding from GPT-2 Large produced a repetition rate of 73.66 percent against 0.28 percent for the human reference text.",
 source=SRC_H, url=H, quote="", page="Table 1 (columns Repetition %, rows Human and Greedy)",
 kind="measurement", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 Large (762M), 5,000 generated passages of up to 200 tokens, February 2020; register measured: WebText continuations."),

dict(feature="homogenisation",
 claim="In Holtzman and colleagues' Table 1, beam search with width 16 gave generated text a perplexity of 1.48 against 12.38 for human text under the same model.",
 source=SRC_H, url=H, quote="", page="Table 1 (columns Perplexity, rows Human and Beam b=16)",
 kind="measurement", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 Large (762M), February 2020; register measured: WebText continuations."),

dict(feature="counter-evidence",
 claim="Holtzman and colleagues report that pure sampling produced text of higher perplexity than the human reference, which they read as the model confusing itself by sampling too many unlikely tokens.",
 source=SRC_H, url=H, quote="the model is confusing itself: sampling too many unlikely tokens", page="section 4.2, Perplexity",
 kind="measurement", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 Large (762M), February 2020; pure sampling perplexity 22.73 against human 12.38; register measured: WebText continuations."),

dict(feature="model era drift",
 claim="Holtzman and colleagues' degeneration findings were measured on a single model, GPT-2 Large at 762 million parameters.",
 source=SRC_H, url=H, quote="We perform experiments using the Large model (762M parameters)", page="section 4.1, Experimental Setup",
 kind="measurement", polarity="asserts", date="2020-02-14", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 Large, 762M parameters, experiments run 2019, published February 2020; register measured: WebText continuations. No instruction-tuned or RLHF model was in scope."),

# ---------------- MEISTER ----------------
dict(feature="other: repetition loop mechanism",
 claim="Meister and colleagues explain the rising probability of a repeated substring by saying the substring carries less information with each further occurrence.",
 source=SRC_M, url=M, quote="the substring conveys less and less information after each occurrence", page="section 5.1, Shortcomings of Existing Algorithms",
 kind="analysis", polarity="asserts", date="2023 (TACL); arXiv v6 5 Jun 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="information-theoretic explanation offered for the effect Holtzman and colleagues measured on GPT-2; the paper's own experiments used GPT-2 medium and large and BART, 2022-2023."),

dict(feature="other: mechanism of blandness",
 claim="Meister and colleagues argue that high-probability text reads as dull because low probability is low information content, so probable text is literally uninformative.",
 source=SRC_M, url=M, quote="its low information content likely makes for boring", page="section 5.1",
 kind="analysis", polarity="asserts", date="2023 (TACL); arXiv v6 5 Jun 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="information-theoretic argument about probabilistic language generators generally, 2022-2023."),

dict(feature="uniform rhythm (low burstiness)",
 claim="Meister and colleagues measured that in human reference text each word's information content sits close to the model's conditional entropy at that step, a per-token deviation distribution peaked near zero.",
 source=SRC_M, url=M, quote="human language indeed tends to have per-word information content quite close", page="section 4.1, discussion of Figure 1",
 kind="measurement", polarity="asserts", date="2023 (TACL); arXiv v6 5 Jun 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="probabilities and entropies from GPT-2 medium finetuned on WikiText-103, plus WritingPrompts and CNN/DailyMail models, 2022; registers measured: encyclopedic (WikiText-103), story (WritingPrompts) and news (CNN/DailyMail). NOTE: this is deviation from the step-wise conditional entropy, not raw surprisal, so it qualifies rather than contradicts Holtzman's burstiness finding."),

dict(feature="steerability",
 claim="Meister and colleagues found that their repetition metric was much less sensitive to the typical-sampling parameter tau than to top-k's k or nucleus's eta.",
 source=SRC_M, url=M, quote="REP appears to be far less sensitive to", page="section 6.2, discussion of Figure 2",
 kind="measurement", polarity="asserts", date="2023 (TACL); arXiv v6 5 Jun 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 large finetuned on WritingPrompts, 2022; register measured: short prompted stories."),

dict(feature="homogenisation",
 claim="In Meister and colleagues' Table 1 for story generation, human reference text scored a REP of 0.28 while nucleus sampling at eta 0.9 and top-k at k 30 both scored 0.35.",
 source=SRC_M, url=M, quote="", page="Table 1 (WritingPrompts, column REP, rows Reference, Nucleus eta=0.9, Top-k k=30)",
 kind="measurement", polarity="asserts", date="2023 (TACL); arXiv v6 5 Jun 2025", routeHint=R, registerHint="chronicle-line",
 confidence="high",
 modelEra="finetuned GPT-2 large on the WritingPrompts test set, 2022; register measured: prompted short fiction."),

dict(feature="counter-evidence",
 claim="Meister and colleagues concede that every decoding strategy they tested scored close to the human reference in their human ratings, in some cases above it.",
 source=SRC_M, url=M, quote="all the strategies we explore are quite close to human-level performance", page="section 6.2, Results discussion",
 kind="measurement", polarity="disputes", date="2023 (TACL); arXiv v6 5 Jun 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="Amazon Mechanical Turk raters on GPT-2 large WritingPrompts stories and BART CNN/DailyMail summaries, 2022; human reference scored 4.12 and several decoders scored 4.13 to 4.15 on the averaged five-point scale."),

dict(feature="other: repetition loop mechanism",
 claim="Meister and colleagues state that both maximisation-based and stochastic decoding strategies eventually fall into repetitive loops.",
 source=SRC_M, url=M, quote="Both types of strategies tend to eventually fall into repetitive loops", page="section 1, footnote 1",
 kind="analysis", polarity="asserts", date="2023 (TACL); arXiv v6 5 Jun 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="claim about probabilistic language generators as of 2022; their own experiments used GPT-2 medium and large and BART."),

# ---------------- MIN-P ----------------
dict(feature="steerability",
 claim="Nguyen and colleagues claim that under min-p sampling temperatures of 2 or 3 increase diversity with much less loss of coherence than existing methods suffer.",
 source=SRC_NP, url=NP, quote="enhancing diversity with much lower loss of coherence", page="section 4, Parameter Selection Guidelines, Temperature Settings",
 kind="measurement", polarity="asserts", date="2025-11-20 (v8); ICLR 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="Mistral 7B, Mistral Large, Llama 3 70B and openchat-3.5-0106, benchmarks run 2024-2025; registers measured: reasoning benchmarks (GPQA, GSM8K) and prompted creative writing (AlpacaEval Creative Writing)."),

dict(feature="steerability",
 claim="Nguyen and colleagues assert that top-p sampling struggles at higher temperatures, where it produces incoherent or repetitive output.",
 source=SRC_NP, url=NP, quote="especially at higher temperatures which lead to incoherent or repetitive outputs", page="Abstract",
 kind="analysis", polarity="asserts", date="2025-11-20 (v8); ICLR 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="claim about top-p on Mistral and Llama 3 family models, 2024-2025."),

dict(feature="reader and expert judgment",
 claim="In Nguyen and colleagues' human evaluation at temperature 3 with the lower-diversity setting, min-p stories scored 7.74 out of 10 for quality against 5.75 for top-p and 6.75 for standard sampling.",
 source=SRC_NP, url=NP, quote="", page="Table 4 (row T=3, Quality, Lower Diversity Settings)",
 kind="measurement", polarity="asserts", date="2025-11-20 (v8); ICLR 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="Llama 3 70B answering the prompt 'Write me a creative story?', rated 1-10 by Prolific participants screened as regular LLM users, 2024-2025; register measured: prompted short fiction."),

dict(feature="reader and expert judgment",
 claim="Nguyen and colleagues report min-p winning 56.54 percent on the AlpacaEval Creative Writing benchmark at temperature 1.5, against 53.18 percent for temperature-only sampling.",
 source=SRC_NP, url=NP, quote="", page="Table 3b (AlpacaEval Creative Writing % win, column tau=1.5)",
 kind="measurement", polarity="asserts", date="2025-11-20 (v8); ICLR 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="openchat-3.5-0106 generating, GPT-4 Turbo as judge, 2024; register measured: prompted creative writing. This is an LLM-as-judge score, not a human one."),

dict(feature="counter-evidence",
 claim="Nguyen and colleagues concede that their human evaluation rests on a limited sample size and gives directional insight rather than a settled result.",
 source=SRC_NP, url=NP, quote="this represents a limited sample size, it provides valuable directional insights", page="section 6, Experimental Setup",
 kind="measurement", polarity="disputes", date="2025-11-20 (v8); ICLR 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="their own Llama 3 70B human study, 2024-2025; each configuration was three samples rated as a triplet, a point estimate of diversity."),

dict(feature="detection and its failures",
 claim="Nguyen and colleagues relay, from Ilya Gusev's run of Sam Paech's EQ-Bench Creative Writing benchmark, a min-p score of 62 at temperature 1.5 against the baseline's 51.5 at temperature 1.0.",
 source=SRC_NP, url=NP, quote="", page="section 5.2.3, Creative Writing, Results",
 kind="relay", polarity="asserts", date="2025-11-20 (v8); ICLR 2025", routeHint=R, registerHint="none",
 confidence="medium",
 modelEra="a third-party benchmark run reported inside the min-p paper, dated 2024; benchmark authored by Sam Paech, run by Ilya Gusev on Reddit. RELAY: the primary was not fetched here."),

# ---------------- MIROSTAT ----------------
dict(feature="other: repetition loop mechanism",
 claim="Basu and colleagues measured that the percentage of repeated tokens falls as the observed cross-entropy of the generated text rises.",
 source=SRC_MI, url=MI, quote="percentage repetition decreases with increase in cross-entropy", page="section 5.2, discussion of Figure 3a",
 kind="measurement", polarity="asserts", date="2021-01-14 (v2); ICLR 2021", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 117M generating 200-token continuations from a fixed context, published January 2021; register measured: open-ended continuation of a web-text context."),

dict(feature="other: repetition loop mechanism",
 claim="Basu and colleagues found that for a fixed GPT-2 model the relation between repetition and observed cross-entropy does not depend on which sampling method produced the text.",
 source=SRC_MI, url=MI, quote="this relation is independent of the sampling method", page="section 5.2, discussion of Figure 3a",
 kind="measurement", polarity="asserts", date="2021-01-14 (v2); ICLR 2021", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 117M with top-k, top-p, temperature and mirostat sampling, January 2021; register measured: open-ended continuation. This is the strongest mechanism claim in the roster: the sampler is not the variable, the entropy of the sampled text is."),

dict(feature="steerability",
 claim="Basu and colleagues measured that sentence-level repetition in GPT-2 output effectively disappears above an observed cross-entropy of about 2.5.",
 source=SRC_MI, url=MI, quote="beyond a threshold of cross-entropy, which seems to be around 2.5", page="section 5.2, discussion of Figure 3c",
 kind="measurement", polarity="asserts", date="2021-01-14 (v2); ICLR 2021", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 117M, January 2021; measured as n-gram repetition for larger n; the paper notes word-level (1-gram) repetition persists above that threshold and should, because human text repeats pronouns and conjunctions."),

dict(feature="uniform rhythm (low burstiness)",
 claim="Basu and colleagues measured that human-written continuation settles at a limiting cross-entropy rate as it lengthens, falling into neither the boredom nor the confusion trap.",
 source=SRC_MI, url=MI, quote="Human-generated text converges to some limiting value of cross-", page="section 5.3, Boredom and Confusion Traps, discussion of Figure 5c",
 kind="measurement", polarity="asserts", date="2021-01-14 (v2); ICLR 2021", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="single-sample human continuation scored against GPT-2 117M over 900 tokens, January 2021; register measured: the human corpus text following a fixed web context. The quotation breaks at a line-wrapped hyphen in the fetched PDF text; the word completed is 'cross-entropy'."),

dict(feature="detection and its failures",
 claim="Basu and colleagues report that at a target cross-entropy of 3 more than half their raters guessed the AI-generated text was human-written.",
 source=SRC_MI, url=MI, quote="more than half of raters mistakenly guessed the AI-generated text", page="section 5.4, Human Evaluations",
 kind="measurement", polarity="asserts", date="2021-01-14 (v2); ICLR 2021", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 (117M) 300-token generations rated by 43 participants from the University of Illinois at Urbana-Champaign and IIT Kanpur, on 1-7 Likert scales, January 2021; register measured: open-ended continuation."),

dict(feature="model era drift",
 claim="Basu and colleagues measured that GPT-2-XL at 1558 million parameters repeats slightly less than GPT-2 at 117 million parameters at the same observed cross-entropy.",
 source=SRC_MI, url=MI, quote="have slightly less repetitions for a fixed value of cross-entropy", page="section 5.2, discussion of Figure 3d",
 kind="measurement", polarity="asserts", date="2021-01-14 (v2); ICLR 2021", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 117M through GPT-2-XL 1558M under top-p sampling, January 2021; register measured: open-ended continuation. Scale reduces the tell only slightly once entropy is held fixed."),

dict(feature="other: repetition loop mechanism",
 claim="Basu and colleagues name the low-cross-entropy failure of small k and p values the boredom trap, in which repetition grows as the generated text lengthens.",
 source=SRC_MI, url=MI, quote="leads to excessive repetitions", page="Abstract",
 kind="analysis", polarity="asserts", date="2021-01-14 (v2); ICLR 2021", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 117M over 900-token generations, January 2021; register measured: open-ended continuation."),

# ---------------- CONTRASTIVE SEARCH ----------------
dict(feature="other: mechanism of blandness",
 claim="Su and colleagues argue that degeneration originates in the anisotropic distribution of a language model's token representations rather than in the decoding rule alone.",
 source=SRC_CS, url=CS, quote="stems from the anisotropic distribution of token representations", page="section 1, Introduction",
 kind="analysis", polarity="asserts", date="2022-09-26 (v3); NeurIPS 2022", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 and finetuned GPT-2 large, 2022; register measured: Wikitext-103 (encyclopedic prose)."),

dict(feature="homogenisation",
 claim="Su and colleagues measured cosine similarities above 0.95 between the representations of different tokens within a single sentence in GPT-2.",
 source=SRC_CS, url=CS, quote="the cosine similarities between tokens within a sentence are over 0.95", page="section 1, Introduction, discussion of Figure 1(a)",
 kind="measurement", polarity="asserts", date="2022-09-26 (v3); NeurIPS 2022", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 output layer representations, 2022; register measured: Wikitext-103 sentences."),

dict(feature="register measured",
 claim="Su and colleagues ran their whole degeneration evaluation on the Wikitext-103 test set, that is on encyclopedic prose.",
 source=SRC_CS, url=CS, quote="", page="Table 1 caption: 'Evaluation results on Wikitext-103 test set'",
 kind="measurement", polarity="asserts", date="2022-09-26 (v3); NeurIPS 2022", registerHint="dossier-archivist", routeHint=R,
 confidence="high",
 modelEra="MLE, unlikelihood-trained and SimCTG GPT-2 models, 2022; register measured: Wikipedia article prose, the closest register in this roster to an archival or gazetteer record."),

dict(feature="homogenisation",
 claim="In Su and colleagues' Wikitext-103 table, greedy decoding from the MLE model scored a rep-2 of 69.21 against 3.92 for the human reference.",
 source=SRC_CS, url=CS, quote="", page="Table 1 (column rep-2, rows MLE greedy and Human)",
 kind="measurement", polarity="asserts", date="2022-09-26 (v3); NeurIPS 2022", routeHint=R, registerHint="dossier-archivist",
 confidence="high",
 modelEra="GPT-2 finetuned with MLE on Wikitext-103, 2022; register measured: encyclopedic prose."),

dict(feature="counter-evidence",
 claim="In Su and colleagues' Wikitext-103 table, nucleus sampling produced text with a generation perplexity of 47.19 against 24.01 for the human reference, so the sampled text was less predictable than the human original rather than flatter.",
 source=SRC_CS, url=CS, quote="", page="Table 1 (column gen-ppl, rows SimCTG nucleus and Human)",
 kind="measurement", polarity="disputes", date="2022-09-26 (v3); NeurIPS 2022", routeHint=R, registerHint="dossier-archivist",
 confidence="high",
 modelEra="SimCTG-finetuned GPT-2 on Wikitext-103 with nucleus p=0.95, 2022; register measured: encyclopedic prose. This cuts against a blanket claim that machine text is always the low-entropy side of the comparison."),

dict(feature="reader and expert judgment",
 claim="Su and colleagues' human evaluation covered 200 Wikitext-103 prefixes scored by five graders, producing 9,000 annotated samples.",
 source=SRC_CS, url=CS, quote="results in 9,000 annotated samples in total", page="section 4.3, Human Evaluation",
 kind="measurement", polarity="asserts", date="2022-09-26 (v3); NeurIPS 2022", routeHint=R, registerHint="dossier-archivist",
 confidence="high",
 modelEra="MLE, unlikelihood and SimCTG GPT-2 models plus SimCTG-large, continuations of length 128 from 32-token prefixes, five-point Likert on coherence, fluency and informativeness, 2022; register measured: encyclopedic prose."),
]

sources = [
 dict(title="The Curious Case of Neural Text Degeneration (Holtzman, Buys, Du, Forbes, Choi; ICLR 2020)", url=H, kind="measurement", substantive=True, date="2020-02-14 (v2)", route="arXiv PDF binary -> pdftotext"),
 dict(title="Locally Typical Sampling (Meister, Pimentel, Wiher, Cotterell; TACL 2023)", url=M, kind="measurement", substantive=True, date="arXiv v6 2025-06-05; TACL 2023", route="arXiv PDF binary -> pdftotext"),
 dict(title="Turning Up the Heat: Min-p Sampling for Creative and Coherent LLM Outputs (Nguyen, Baker, Neo, Roush, Kirsch, Shwartz-Ziv; ICLR 2025)", url=NP, kind="measurement", substantive=True, date="arXiv v8 2025-11-20; ICLR 2025", route="arXiv PDF binary -> pdftotext -layout"),
 dict(title="Mirostat: A Neural Text Decoding Algorithm that Directly Controls Perplexity (Basu, Ramachandran, Keskar, Varshney; ICLR 2021)", url=MI, kind="measurement", substantive=True, date="2021-01-14 (v2)", route="arXiv PDF binary -> pdftotext -layout"),
 dict(title="A Contrastive Framework for Neural Text Generation (Su, Lan, Wang, Yogatama, Kong, Collier; NeurIPS 2022)", url=CS, kind="measurement", substantive=True, date="2022-09-26 (v3)", route="arXiv PDF binary -> pdftotext -layout"),
]

coverage = ("CHECKPOINT: five of the six named roster items fetched raw (Holtzman, Meister, min-p, Mirostat, contrastive search), all via the arXiv PDF binary plus pdftotext; "
            "Sam Paech's slop-forensics and antislop sampler not yet fetched; expansion routes not yet run.")

def write(extra_claims=None, extra_sources=None, cov=None, complete=False):
    cl = claims + (extra_claims or [])
    sr = sources + (extra_sources or [])
    json.dump({"complete": complete, "coverage": cov or coverage, "sourcesRead": sr, "claims": cl},
              io.open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("claims", len(cl), "sources", len(sr))

if __name__ == "__main__":
    write()
