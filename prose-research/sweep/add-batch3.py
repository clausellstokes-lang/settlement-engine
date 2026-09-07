# -*- coding: utf-8 -*-
WI = "https://arxiv.org/abs/2203.15721"
HE = "https://arxiv.org/abs/2210.15191"
PQ = "https://arxiv.org/abs/2203.17217"
WE = "https://arxiv.org/abs/1908.04319"
SH = "https://arxiv.org/abs/2402.06925"
KI = "https://arxiv.org/abs/2310.06452"
R = "arXiv PDF binary -> pdftotext -layout"

S_WI = "Gian Wiher, Clara Meister and Ryan Cotterell, 'On Decoding Strategies for Neural Text Generators', TACL 2022 (arXiv v1, 29 Mar 2022)"
S_HE = "John Hewitt, Christopher D. Manning and Percy Liang, 'Truncation Sampling as Language Model Desmoothing', Findings of EMNLP 2022 (arXiv v1, 27 Oct 2022)"
S_PQ = "Clara Meister, Gian Wiher, Tiago Pimentel and Ryan Cotterell, 'On the probability-quality paradox in language generation', ACL 2022 (arXiv v1, 31 Mar 2022)"
S_WE = "Sean Welleck, Ilia Kulikov, Stephen Roller, Emily Dinan, Kyunghyun Cho and Jason Weston, 'Neural Text Generation with Unlikelihood Training', ICLR 2020 (arXiv v2, 26 Sep 2019)"
S_SH = "Chufan Shi, Haoran Yang, Deng Cai, Zhisong Zhang, Yifan Wang, Yujiu Yang and Wai Lam, 'A Thorough Examination of Decoding Methods in the Era of LLMs', EMNLP 2024 (arXiv v3, 8 Oct 2024)"
S_KI = "Robert Kirk, Ishita Mediratta, Christoforos Nalmpantis, Jelena Luketina, Eric Hambro, Edward Grefenstette and Roberta Raileanu, 'Understanding the Effects of RLHF on LLM Generalisation and Diversity', ICLR 2024 (arXiv v3, 19 Feb 2024)"

batch3 = [
# ---- Wiher: REGISTER MEASURED ----
dict(feature="register measured",
 claim="Wiher, Meister and Cotterell found the diversity-quality trade-off in language generation to be strongly task-specific rather than a single property of a decoding rule.",
 source=S_WI, url=WI, quote="generation is very task-specific", page="Abstract",
 kind="measurement", polarity="asserts", date="2022-03-29", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 small and medium plus task-specific models across story generation, unconditional generation, abstractive summarization, dialogue and machine translation, March 2022; registers measured: five distinct generation tasks. The load-bearing implication for an archival register is that a decoding rule tuned on fiction is not known to transfer."),

dict(feature="register measured",
 claim="Wiher and colleagues measured degenerate repetition in under one percent of generations for every task they tested except story generation.",
 source=S_WI, url=WI, quote="for all tasks besides SG, we see repet", page="section 5, Repetitions (the quotation breaks at a line-wrapped hyphen; the sentence continues 'itive behaviour in less than 1% of generations')",
 kind="measurement", polarity="asserts", date="2022-03-29", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 small and medium and task models, March 2022; registers measured: story generation, unconditional generation, summarization, dialogue, machine translation. The repetition tell is register-bound, not universal."),

dict(feature="homogenisation",
 claim="In Wiher and colleagues' story-generation table, greedy decoding degenerated into repetition in 95.67 percent of generations from the small model against 0 percent for the human reference.",
 source=S_WI, url=WI, quote="", page="Table 5 (Story Gen. (small), % repetition, rows Greedy and Reference)",
 kind="measurement", polarity="asserts", date="2022-03-29", routeHint=R, registerHint="chronicle-line",
 confidence="high",
 modelEra="GPT-2 small finetuned for story generation, March 2022; top-p degenerated in 15.87 percent of small-model generations and 5.65 percent of medium-model ones; register measured: prompted short fiction."),

dict(feature="counter-evidence",
 claim="Wiher and colleagues report that string diversity across a set of generations shows little consistency from one task to another.",
 source=S_WI, url=WI, quote="little consistency across tasks in terms of", page="section 5, Diversity",
 kind="measurement", polarity="asserts", date="2022-03-29", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2-based generators across five tasks, March 2022; registers measured: story generation, unconditional generation, summarization, dialogue, machine translation."),

# ---- Hewitt: MECHANISM ----
dict(feature="other: repetition loop mechanism",
 claim="Hewitt, Manning and Liang hypothesise that top-p sampling produces repetitive text because it truncates low-entropy distributions so hard that only the repetition-continuing word survives.",
 source=S_HE, url=HE, quote="to heavily truncate low-entropy distributions causes", page="section 5.4, Repetition analysis",
 kind="analysis", polarity="asserts", date="2022-10-27", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 small through XL, October 2022; register measured: WebText continuations and Wikipedia biography prompts."),

dict(feature="steerability",
 claim="In Hewitt and colleagues' adversarial repetition test on GPT-2 large, top-p continued an injected repetition in 47 percent of completions against 26 percent for their eta-sampling.",
 source=S_HE, url=HE, quote="", page="Table 4 (Repetition Percent, column lg, rows top-p and eta-sampling)",
 kind="measurement", polarity="asserts", date="2022-10-27", routeHint=R, registerHint="dossier-archivist",
 confidence="high",
 modelEra="GPT-2 small, medium, large and XL at MAUVE-maximising hyperparameters, October 2022; prompts were the first 35 words of Wikipedia biographies of the 101 most-read people, corrupted by repeating the last three subword tokens five extra times; register measured: encyclopedic biography. Typical sampling scored 56 percent, higher than top-p."),

dict(feature="register measured",
 claim="Hewitt and colleagues built their repetition stress test from the opening words of the Wikipedia biographies of the 101 most-read people.",
 source=S_HE, url=HE, quote="Wikipedia biographies of the 101", page="section 5.4, Setting",
 kind="measurement", polarity="asserts", date="2022-10-27", routeHint=R, registerHint="dossier-archivist",
 confidence="high",
 modelEra="GPT-2 family, October 2022; register measured: encyclopedic biography, one of the few places in this literature where the archival register is the test material."),

dict(feature="other: mechanism of blandness",
 claim="Hewitt and colleagues frame a neural language model's distribution as a mixture of the true distribution and a uniform-like smoothing distribution, so that truncation sampling is an attempt at desmoothing.",
 source=S_HE, url=HE, quote="we show that top-p unnec", page="Abstract (the quotation breaks at a line-wrapped hyphen; the sentence continues 'essarily truncates high-probability words')",
 kind="analysis", polarity="asserts", date="2022-10-27", routeHint=R, registerHint="none",
 confidence="medium",
 modelEra="theoretical framing offered October 2022 for GPT-2-class models; confidence medium because the quotation carries the truncation half of the claim while the mixture framing is stated in the neighbouring sentences of the same abstract."),

dict(feature="reader and expert judgment",
 claim="Hewitt and colleagues' human raters preferred eta-sampling continuations over top-p continuations by 53 percent to 40 percent.",
 source=S_HE, url=HE, quote="ferred over top-p (53% to 40%)", page="section 5.2, Results (the quotation begins mid-word from a line-wrapped hyphen in 'preferred')",
 kind="measurement", polarity="asserts", date="2022-10-27", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 large at MAUVE-maximising hyperparameters, 35-token WebText prefixes, October 2022; register measured: web documents. Human-written continuations were preferred over both machine methods at roughly the same rate."),

# ---- Meister probability-quality paradox ----
dict(feature="other: mechanism of blandness",
 claim="Meister, Wiher, Pimentel and Cotterell propose that text perceived as human-like carries an information content within a small interval around the entropy of natural language.",
 source=S_PQ, url=PQ, quote="high-quality text usually has information content close to", page="section 4.2, Results",
 kind="analysis", polarity="asserts", date="2022-03-31", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 finetuned on WritingPrompts and BART on CNN/DailyMail, March 2022; registers measured: prompted short fiction and news summarization."),

dict(feature="other: mechanism of blandness",
 claim="Meister and colleagues state that low-information strings may be seen as boring and uninformative, giving the low-probability end of the paradox a communicative rather than statistical reading.",
 source=S_PQ, url=PQ, quote="be seen as boring and uninformative", page="section 1, Introduction",
 kind="analysis", polarity="asserts", date="2022-03-31", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="theoretical claim, March 2022, offered alongside GPT-2 and BART measurements."),

dict(feature="reader and expert judgment",
 claim="In Meister and colleagues' human evaluation the human reference string was ranked first in 47 percent of cases and tied for first in a further 16 percent.",
 source=S_PQ, url=PQ, quote="was ranked first in 47% of cases", page="section 4.2, Results",
 kind="measurement", polarity="asserts", date="2022-03-31", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-2 finetuned on WritingPrompts and BART on CNN/DailyMail, seven decoding strategies, human raters on fluency and naturalness, March 2022; registers measured: prompted short fiction and news summarization."),

# ---- Welleck ----
dict(feature="other: mechanism of blandness",
 claim="Welleck and colleagues argue that the maximum-likelihood objective itself is at fault for degeneration, not merely the decoding rule laid over it.",
 source=S_WE, url=WE, quote="the likelihood objective itself is at fault", page="Abstract",
 kind="analysis", polarity="asserts", date="2019-09-26; ICLR 2020", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="a Transformer language model trained on Wikitext-103, September 2019; register measured: Wikipedia article prose."),

dict(feature="steerability",
 claim="Welleck and colleagues state that top-k and nucleus sampling do not address the underlying problem that the model's token-level probabilities are poor.",
 source=S_WE, url=WE, quote="they do not address the fact that the token-level probabilities predicted", page="Abstract",
 kind="analysis", polarity="rejects", date="2019-09-26; ICLR 2020", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="September 2019, about GPT-2-era likelihood-trained models; register measured: Wikitext-103. The earliest statement in this roster that a sampler cannot fix a training-objective defect."),

dict(feature="homogenisation",
 claim="Welleck and colleagues measured that greedy decoding from their Transformer language model produced 43 percent repeated n-grams against 0.5 percent for human text on the same prefixes.",
 source=S_WE, url=WE, quote="greedy decoding (43%) far exceeds that of humans", page="section 3, Repetition",
 kind="measurement", polarity="asserts", date="2019-09-26; ICLR 2020", routeHint=R, registerHint="dossier-archivist",
 confidence="high",
 modelEra="Transformer language model trained on Wikitext-103, prefixes drawn from a validation corpus, September 2019; register measured: Wikipedia article prose."),

dict(feature="homogenisation",
 claim="Welleck and colleagues measured that greedy next-token predictions on held-out Wikitext-103 used roughly 40 percent fewer unique tokens than the ground truth, 11.6 thousand against 18.9 thousand.",
 source=S_WE, url=WE, quote="roughly 40% fewer unique tokens than the ground-truth tokens", page="section 3, Token Distribution Mismatch",
 kind="measurement", polarity="asserts", date="2019-09-26; ICLR 2020", routeHint=R, registerHint="dossier-archivist",
 confidence="high",
 modelEra="Transformer language model on Wikitext-103, September 2019; register measured: Wikipedia article prose, the encyclopedic register."),

dict(feature="abstraction over the concrete",
 claim="Welleck and colleagues connect the model's under-use of rare words to human judgments of dullness, on the ground that rare words add engaging specificity.",
 source=S_WE, url=WE, quote="rare words can add engaging specificity", page="section 3, Token Distribution Mismatch",
 kind="relay", polarity="asserts", date="2019-09-26; ICLR 2020", routeHint=R, registerHint="none",
 confidence="medium",
 modelEra="September 2019; Welleck and colleagues attribute this reading to Weston et al. 2018 and See et al. 2019, so it is a relay of those primaries, not their own measurement."),

# ---- Shi: MODEL ERA DRIFT ----
dict(feature="model era drift",
 claim="Shi and colleagues found that the choice of decoding method matters less once a model has been alignment-tuned, the spread between best and worst decoders narrowing sharply.",
 source=S_SH, url=SH, quote="less critical after the model is aligned", page="section 4.1, 'Aligned models are less dependent on decoding methods than unaligned models'",
 kind="measurement", polarity="asserts", date="2024-10-08; EMNLP 2024", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="Llama2-7B against Llama2-7B-Chat across 11 datasets and about a dozen decoders, October 2024; on MBPP the unaligned spread ran 21.20 to 7.80 percent and the aligned spread 21.60 to 16.00 percent; registers measured: reasoning, code, summarization and instruction following."),

dict(feature="model era drift",
 claim="Shi and colleagues measured the average next-token entropy of Llama2-7B-Chat on Wikinews at 0.52 against 2.37 for the unaligned Llama2-7B.",
 source=S_SH, url=SH, quote="", page="Table 2 (column Wikinews, rows Llama2-7B and Llama2-7B-Chat)",
 kind="measurement", polarity="asserts", date="2024-10-08; EMNLP 2024", routeHint=R, registerHint="chronicle-line",
 confidence="high",
 modelEra="Llama2-7B and Llama2-7B-Chat under top-p sampling with p=1.0, October 2024; register measured: Wikinews news articles, the nearest thing here to a record register. THE MECHANISM BEHIND THE METRONOME IN ONE FIGURE: alignment flattens what the sampler has to work with before any decoding rule is chosen."),

dict(feature="model era drift",
 claim="Shi and colleagues explain the narrowed decoder gap partly by the aligned model producing far fewer repetitions even under deterministic decoding such as greedy search.",
 source=S_SH, url=SH, quote="the aligned model produces much fewer repetitions", page="section 4.1, Phenomenon Analysis",
 kind="measurement", polarity="asserts", date="2024-10-08; EMNLP 2024", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="Llama2-7B-Chat, October 2024; registers measured: 11 task datasets including summarization and instruction following. The degeneration the 2019-2022 literature measured has largely been trained out of aligned models."),

# ---- Kirk: RLHF diversity ----
dict(feature="homogenisation",
 claim="Kirk and colleagues measured that RLHF significantly reduces output diversity relative to supervised fine-tuning across a range of diversity measures.",
 source=S_KI, url=KI, quote="RLHF significantly reduces output diversity compared to", page="Abstract",
 kind="measurement", polarity="asserts", date="2024-02-19; ICLR 2024", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="two base models fine-tuned through SFT, best-of-N and RLHF on summarisation and instruction following, GPT-4 as simulated evaluator, February 2024; registers measured: news summarisation and instruction following, not fiction or archival."),

dict(feature="homogenisation",
 claim="Kirk and colleagues found that RLHF-tuned models produce less diverse text even across different inputs, so they tend to write similarly whatever they are asked.",
 source=S_KI, url=KI, quote="tend to produce more similar text regardless of the input", page="section 1, summary of findings",
 kind="measurement", polarity="asserts", date="2024-02-19; ICLR 2024", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="two base models across SFT, BoN and RLHF, February 2024; diversity measured syntactically (expectation-adjusted distinct n-grams), semantically (Sentence-BERT cosine similarity) and logically (NLI diversity); registers measured: summarisation and instruction following. This is the across-input homogenisation the program calls the metronome, measured at the fine-tuning stage rather than the sampler."),
]

sources3 = [
 dict(title="On Decoding Strategies for Neural Text Generators (Wiher, Meister, Cotterell; TACL 2022)", url=WI, kind="measurement", substantive=True, date="2022-03-29", route=R),
 dict(title="Truncation Sampling as Language Model Desmoothing (Hewitt, Manning, Liang; Findings of EMNLP 2022)", url=HE, kind="measurement", substantive=True, date="2022-10-27", route=R),
 dict(title="On the probability-quality paradox in language generation (Meister, Wiher, Pimentel, Cotterell; ACL 2022)", url=PQ, kind="measurement", substantive=True, date="2022-03-31", route=R),
 dict(title="Neural Text Generation with Unlikelihood Training (Welleck, Kulikov, Roller, Dinan, Cho, Weston; ICLR 2020)", url=WE, kind="measurement", substantive=True, date="2019-09-26 (v2)", route=R),
 dict(title="A Thorough Examination of Decoding Methods in the Era of LLMs (Shi, Yang, Cai, Zhang, Wang, Yang, Lam; EMNLP 2024)", url=SH, kind="measurement", substantive=True, date="2024-10-08 (v3)", route=R),
 dict(title="Understanding the Effects of RLHF on LLM Generalisation and Diversity (Kirk et al.; ICLR 2024)", url=KI, kind="measurement", substantive=True, date="2024-02-19 (v3)", route=R),
]
