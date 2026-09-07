# FINDER NOTES — ai / angle: decoding literature behind the metronome and the loop
Opus finder, 2026-09-06. Method: OPUS-FINDER-METHOD.md.

## ROSTER (named by the angle)
1. Holtzman, Buys, Du, Forbes, Choi — Curious Case of Neural Text Degeneration (ICLR 2020) — arXiv 1904.09751 — FETCHED (arXiv PDF -> pdftotext, full text 8102 words)
2. Meister, Pimentel, Wiher, Cotterell — Locally Typical Sampling (TACL 2023) — arXiv 2202.00666 — PDF downloaded
3. Nguyen et al. — Turning Up the Heat: Min-p Sampling (ICLR 2025) — arXiv 2407.01082 — PDF downloaded
4. Mirostat — Basu et al. (ICLR 2021) — arXiv 2007.14966 — PDF downloaded
5. Contrastive search — Su et al. (NeurIPS 2022) — arXiv 2202.06417 — PDF downloaded
6. Sam Paech — slop-forensics / antislop sampler — TODO

## 1. HOLTZMAN et al. 1904.09751 v2 (14 Feb 2020), ICLR 2020. Model: GPT-2 Large, paper says 762M params (Fig 1 caption says 774M). Corpus/register: WebText held-out (web-scraped documents).
- Fig 2 caption: "Note the increased variance that characterizes human text, in contrast with the endless repetition of text decoded by Beam Search."
- 4.3: "Natural language rarely remains in a high probability zone for multiple consecutive time steps, instead veering into lower-probability but more informative tokens."
- 4.3 conjecture: Grice's Maxims (Grice 1975) "show that people optimize against stating the obvious" -> "making every word as predictable as possible will be disfavored"; and this makes solving by bigger models "unlikely: such models are forced to favor the lowest common denominator, rather than informative language."
- Fig 4 caption: "The probability of a repeated phrase increases with each repetition, creating a positive feedback loop." Held "for the vast majority of phrases we tested, regardless of phrase length".
- Table 1 (5000 passages, max 200 tokens): Perplexity Human 12.38 / Greedy 1.50 / Beam b=16 1.48 / Pure Sampling 22.73 / Nucleus p=0.95 13.13 / Top-k=40 6.88 / Top-k=40 t=0.7 3.48. Repetition% Human 0.28 / Greedy 73.66 / Beam b=16 28.94 / Nucleus 0.36 / Top-k=40 0.78 / Top-k40 t=0.7 8.86. Self-BLEU4 Human 0.31 / Nucleus 0.32 / Top-k=40 0.39. Zipf Human 0.93.
- Fig 9 caption: "Sampling with temperatures lower than 0.9 severely increase repetition." Repetition defined: phrase (min length 2) repeating at least three times at the end of generation, within first 200 tokens.
- 3.3: "recent analysis has shown that, while lowering the temperature improves generation quality, it comes at the cost of decreasing diversity" (cites Caccia et al 2018; Hashimoto et al 2019) — Holtzman REPORTING others.
- 6.1 HUSE: 200 generations per method, 20 annotations each = 4000 annotations per decoding scheme; KNN k=13. Text: "Nucleus Sampling obtains the highest HUSE score, with Top-k sampling performing second best."
- 5.1 Zipf: "pure sampling slightly overestimates the use of rare words".
- Abstract framing: maximization -> "output text that is bland, incoherent, or gets stuck in repetitive loops".

## 2. MEISTER, PIMENTEL, WIHER, COTTERELL — Locally Typical Sampling. arXiv 2202.00666v6 (5 Jun 2025), TACL 2023. Models: GPT-2 medium+large finetuned on WRITINGPROMPTS (story generation); GPT-2 medium finetuned on WikiText-103 for Fig 1; BART finetuned on CNN/DailyMail (summarization).
- Abstract: typical sampling "consistently reducing degenerate repetitions" vs nucleus and top-k.
- MECHANISM FOR THE LOOP (their own explanation of Holtzman's feedback loop), §5.1: "the substring conveys less and less information after each occurrence."
- MECHANISM FOR DULLNESS: "its low information content likely makes for boring, i.e., uninformative, text."
- Fig 1 discussion: "human language indeed tends to have per-word information content quite close a specific value" [sic, missing 'to']; distributions centred ~0 deviation from conditional entropy. NOTE THE TENSION WITH HOLTZMAN: the deviation from the *conditional entropy* is small; the raw surprisal still varies. Machine text per Meister et al. (2022) instead has "much higher probability, i.e., with lower information content."
- Footnote 1: "Both types of strategies tend to eventually fall into repetitive loops."
- Table 1 (WRITINGPROMPTS, finetuned GPT-2 large), columns PPL(g) PPL(i) MAUVE REP Zipf D Human:
  Reference 16.33 / 26.71 / — / 0.28 / 1.09 / 0.85 / 4.12(±0.02)
  Temperature τ=0.5 25.34 / 18.78 / 0.95 / 0.25 / 1.07 / 0.87 / 4.13
  Nucleus η=0.9 7.75 / 10.25 / 0.95 / 0.35 / 1.29 / 0.79 / 4.09
  Top-k k=30 7.07 / 18.78 / 0.88 / 0.35 / 1.41 / 0.80 / 4.13
  Mirostat τ=3 8.14 / 23.53 / 0.93 / 0.34 / 1.30 / 0.83 / 4.12
  Typical τ=0.2 14.25 / 23.51 / 0.78 / 0.30 / 1.27 / 0.84 / 4.15
  Typical τ=0.95 11.59 / 11.77 / 0.96 / 0.31 / 1.21 / 0.84 / 4.13
- ROBUSTNESS: "REP appears to be far less sensitive to τ than to k and η."
- HONEST LIMIT: "all the strategies we explore are quite close to human-level performance—in some cases even surpassing human references in terms of ratings."

## 3. NGUYEN, BAKER, NEO, ROUSH, KIRSCH, SHWARTZ-ZIV — Turning Up the Heat: Min-p Sampling. arXiv 2407.01082v8 (20 Nov 2025), ICLR 2025. Models: Mistral 7B, Mistral Large (123B), Llama 3 70B, openchat-3.5-0106. Registers: GPQA/GSM8K (reasoning), AlpacaEval Creative Writing (stories).
- Abstract: top-p "often struggle to balance quality and diversity, especially at higher temperatures which lead to incoherent or repetitive outputs."
- Related work: "higher temperatures often give incoherent outputs, limiting applicability."
- Guideline: "higher temperatures (e.g., τ = 2 or τ = 3) enhancing diversity with much lower loss of coherence."
- Table 3b AlpacaEval Creative Writing (% win), openchat-3.5-0106, GPT-4 Turbo judge: Temperature Only 49.97 (τ=1.0) / 53.18 (τ=1.5); Mirostat 16.69 / 14.23; ϵ Sampling 43.50 / 45.51; Top-p 50.43 / –; Min-p 52.01 / 56.54.
- Table 3a GPQA Main (Mistral Large) accuracy %: at τ=3.0 Temp only 2.90, Top-p0.90 2.01, Min-p 22.77; at τ=4.0 Min-p 13.84 vs Top-p0.90 0.89.
- Table 4 HUMAN EVAL (Llama 3 70B, "Write me a creative story?", Prolific raters, 1–10): T=3 lower-diversity Quality: standard 6.75±0.3509, top-p=0.1 5.75±0.3201, min-p=0.2 7.74±0.2418. T=3 higher-diversity Quality: standard 6.83±0.2895, top-p=0.9 7.11±0.2869, min-p=0.05 7.57±0.2303.
- RELAY TO PAECH: "min-p (τ = 1.5, pbase = 0.1) scoring 62 versus the baseline's 51.5 at τ = 1.0" on EQ-Bench Creative Writing, attributed to Paech (2024) benchmark, results by Gusev (2024) [reddit].
- Honest limit on human eval: "this represents a limited sample size, it provides valuable directional insights"; triplet diversity is "a point estimate".

## 4. BASU, RAMACHANDRAN, KESKAR, VARSHNEY — Mirostat. arXiv 2007.14966v2 (14 Jan 2021), ICLR 2021. Models: GPT-2 117M (default), also GPT-2 Medium/Large/XL 1558M; CTRL in appendix. Register: open-ended continuation from a fixed context.
- Abstract: "cross-entropy (log of perplexity) has a near-linear relation with repetition"; small k/p -> "the boredom trap"; large k/p -> "confusion trap".
- §5.2: "percentage repetition decreases with increase in cross-entropy and more importantly, for a fixed GPT-2 model, this relation is independent of the sampling method." (=> the SAMPLER is not the variable; the ENTROPY OF SAMPLED TEXT is.)
- §5.2 Fig 3b: repetitions for different temperature values and k "follow the same curve as in Fig. 3a".
- §5.2: sentence-level repetitions disappear "beyond a threshold of cross-entropy, which seems to be around 2.5 for GPT-2." Word-level 1-gram repetition persists; they say a good sampler should NOT have zero 1-gram repetition because human text repeats pronouns and conjunctions.
- §5.2 Fig 3d: "Larger LMs such as GPT-2-XL with 1558M parameters have slightly less repetitions for a fixed value of cross-entropy than smaller LMs such as GPT-2 with 117M parameters." (model-era drift, holding entropy fixed)
- §5.3 (10 samples of 900-token texts): "Human-generated text converges to some limiting value of cross-entropy when the generated text is long enough and does not fall into either boredom or confusion." <- HUMAN CONTROL MEASUREMENT.
- §5.4 human eval: 300 tokens, τ ∈ {2.5,3,4,5}, 43 participants (UIUC + IIT Kanpur), 1–7 Likert on fluency/coherence/quality; τ=3 best; "for τ = 3, more than half of raters mistakenly guessed the AI-generated text to be human generated."

## 5. SU, LAN, WANG, YOGATAMA, KONG, COLLIER — A Contrastive Framework for Neural Text Generation (SimCTG + contrastive search). arXiv 2202.06417v3 (26 Sep 2022), NeurIPS 2022. ⭐ MEASURED ON WIKITEXT-103 — THE ENCYCLOPEDIC REGISTER (the gap the program says nobody filled).
- Abstract/§1 mechanism: "the degeneration of neural language models stems from the anisotropic distribution of token representations".
- §1: in GPT-2, "the cosine similarities between tokens within a sentence are over 0.95".
- Table 1 (Wikitext-103 test set), columns rep-2 rep-3 rep-4 diversity MAUVE coherence gen-ppl:
  Human 3.92 / 0.88 / 0.28 / 0.95 / 1.00 / 0.644 / 24.01
  MLE greedy 69.21 / 65.18 / 62.05 / 0.04 / 0.03 / 0.587 / 7.32
  MLE beam 71.94 / 68.97 / 66.62 / 0.03 / 0.03 / 0.585 / 6.42
  MLE nucleus 4.45 / 0.81 / 0.43 / 0.94 / 0.90 / 0.577 / 49.71
  SimCTG nucleus 4.05 / 0.79 / 0.37 / 0.94 / 0.92 / 0.584 / 47.19
  SimCTG contrastive 3.93 / 0.78 / 0.31 / 0.95 / 0.94 / 0.610 / 18.26
  (NUCLEUS gen-ppl ~47–50 vs HUMAN 24.01 on Wikipedia text: nucleus prose is about twice as surprising as the human encyclopedic reference.)
- §4.3 human eval: 200 prefixes of length 32 from Wikitext-103 test set, continuations of length 128, five graders, 9,000 annotated samples, 5-point Likert on coherence/fluency/informativeness. SimCTG+contrastive beats nucleus on coherence and fluency, Sign Test p<0.05.
- §6.1 self-similarity defined per Ethayarajh; at output layer (layer 12) SimCTG self-similarity "notably lower than other baselines".
