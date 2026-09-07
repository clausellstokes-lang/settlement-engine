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

# ============================================================
# ROUND 2 — successor Opus finder, 2026-09-06/07 night
# The predecessor's ROSTER was complete (all six named items fetched). This round
# opened at the EXPANSION phase and read only sources ABSENT from its 30-url list.
# 21 new substantive sources, 92 new claims. Raw text under sweep/dec2/*.txt.
# ============================================================

## ⭐ THE HEADLINE FINDING FOR THE SYNTHESIS: the register gap is NOT where the program thinks it is.
The method file says of the AI catalogue: "a source that measured the archival or encyclopedic
register (none has, so far)". For the CRAFT/INDUSTRY/VOICE angles that is right. For THE DECODING
LITERATURE IT IS FALSE, and by a wide margin: this literature is disproportionately measured on
Wikipedia. Sources read this round that measured the encyclopedic register directly:
  - Xu et al. (DITTO, NeurIPS 2022) — Wikitext-103, human 0.01% vs MLE 14.50% sentence repetition
  - Welleck et al. 2020 — Wikitext-103; GPT2-117M greedy non-termination ratio 37.91%
  - Meister & Cotterell (ACL 2021) — models TRAINED ON WIKIPEDIA DUMPS; Zipf, Heaps, length,
    stopword and symbol distributions of generated vs human encyclopedic text
  - Ravfogel et al. (Conformal Nucleus Sampling) — 10,000 English Wikipedia items; OPT overconfident
  - Li et al. (Contrastive Decoding) — human eval on wikipedia + wikinews + story
  - Ji et al. (ICLR 2024) — Wikipedia and News domains, GPT-2 XL and OPT-6.7B
  - Zhou et al. (Balancing Diversity and Risk) — Wikipedia-English prefix tree
  - Liu et al. (FACE-2, Findings of EMNLP 2025) — Wikipedia-English + BBC-News + WritingPrompts
  - Garces Arias et al. (Decoding Decoded) — book, wikinews, wikitext
  - Su et al. (contrastive search) — Wikitext-103 (predecessor already banked this one)
WHAT IS STILL MISSING: nobody measures the register the dossier actually wants — a civic record, a
gazetteer, an annal. Two dedicated searches for that returned nothing; that absence is the finding.

## 1. FINLAYSON, HEWITT, KOLLER, SWAYAMDIPTA, SABHARWAL — Closing the Curious Case (2310.01693, ICLR 2024)
The direct answer to the angle's anchor paper. Truncation works because it PROVABLY keeps you inside
the true support (Corollary 1) — but a threshold "is an inherently limited approach": if the model
ranks a bad token above a good one, NO threshold separates them. Source of the error named: the
SOFTMAX BOTTLENECK (low-rank output matrix). MAUVE, lower-entropy OWT: eta 85.0/90.4/86.0/87.1 vs
BA-eta 87.8/92.2/88.4/89.6 (Small/Medium/Large/XL). Honest: no method best at every size.
Human raters preferred LOWER-ENTROPY generations — the paper's own explanation is that a rater
seeing one sample per method cannot assess diversity. ⭐ THAT IS A CAUTION FOR OUR OWN TASTE PANELS.

## 2. XU, LIU, YAN, CAI, LI, LI — Learning to Break the Loop (2206.02369, NeurIPS 2022)
THE MECHANISM OF THE LOOP, measured. Self-reinforcement: IP1 > 90% — a SINGLE sentence-level context
repetition already raises the repeat probability, before any token has repeated. Higher initial
probability ⇒ stronger self-reinforcement ⇒ a model's OWN maximisation output is the text most at
risk. Human Wikitext-103: 0.02% (abstract) / 0.01% (Table 1) consecutive sentence repetition.
Refutes Fu et al.'s first-order-Markov account: "language models do look at the long-distance context".

## 3. WELLECK, KULIKOV, KIM, PANG, CHO (2002.02492) — greedy, beam, top-k AND nucleus are all
INCONSISTENT: each can return an infinite-length sequence of ZERO probability under the model itself.
GPT2-117M greedy on Wikitext-103: rL = 37.91% (L=1500). Nucleus is NOT immune: 0.06% / 0.13%.

## 4. FU, LAM, SO, SHI (2012.14660, AAAI 2021) — DISPUTES architecture and sampler as the cause;
locates it in "the traits of our language" — the HIGH INFLOW problem (too many words predict the
same next word). Round-2 note: Xu et al. above refute the Markov assumption this rests on.

## 5. MEISTER, VIEIRA, COTTERELL (2010.02650, EMNLP 2020) — ⚠⚠ THE TENSION THE SYNTHESIS MUST HOLD.
Beam search works because it enforces UNIFORM INFORMATION DENSITY; LOWER surprisal standard
deviation correlated with HIGHER BLEU. That is the OPPOSITE polarity to Holtzman's burstiness
figure. RESOLUTION: the domain differs — this is NMT (IWSLT'14, WMT'14), a constrained task with a
reference, not open-ended generation. Do not cite either for the other's domain.

## 6. PILLUTLA et al. — MAUVE (2102.01454). Greedy .016, ancestral .882, nucleus .940 (GPT-2 XL, web).
⭐ "nucleus sampling does not effectively cover the human text distribution" (Type II error) and
"some pieces of plausible human text cannot be generated by truncation-based decoding algorithms".
That is the metronome stated as a theorem of coverage. Spearman with human human-likeness: MAUVE .952.

## 7. ZHANG, DUCKWORTH, IPPOLITO, NEELAKANTAN (2004.10450) — THE LIKELIHOOD TRAP (146 crowdworkers,
100 sentences): human quality ratings turn NEGATIVE against model log-likelihood past an inflection
point. 38,000+ ratings on ~10,000 samples. ⭐ AND: "when aligned on entropy, sample quality between
all autoregressive decoding algorithms is comparable" — samplers only diverge at LOW entropy.

## 8. NADEEM, HE, CHO, GLASS (2009.07243, AACL 2020) — top-k, nucleus and tempered sampling are ON A
PAR under human eval (602 crowdworkers; GPT2-small fine-tuned on Gigaword and Wikitext-103). The
three shared properties: entropy reduction, order preservation, slope preservation.

## 9. IPPOLITO, DUCKWORTH, CALLISON-BURCH, ECK (1911.00650, ACL 2020) — ⭐ "improvements in decoding
methods have primarily optimized for fooling humans." MEASURED LEXICAL MECHANISM: top-k puts up to
80% of its mass in the 500 most common token types; nucleus, pure sampling AND human text need
≥1,100 types for the same share. Human raters: 71.4% accuracy on 192-token excerpts.

## 10. PEEPERKORN, KOUWENHOVEN, BROWN, JORDANOUS (2405.00492, ICCC 2024) — THE TEMPERATURE VERDICT.
Llama 2-Chat 70B, t ∈ {.001,.334,.667,1.0,1.334,1.667,2.0}, 36 participants, 31 stories.
Weak positive novelty correlation, negative coherence correlation; "far more nuanced and weak than
suggested by the creativity parameter claim"; t>1.0 did NOT reliably add diversity.

## 11. MEISTER & COTTERELL (2106.00085, ACL 2021) — trained on WIKIPEDIA DUMPS. Nucleus aligns closest
to natural-language distributions; BEAM sampling diverges strongly across length/stopword/symbol.
Warns that Zipf adherence is a bad gauge. Gives quantitative backing to "babble repetitively".

## 12. TANG, LIU, XU, HUANG — top-nSigma (2411.07641). At T=3.0, GSM8K: sample 0.00, top-p 0.00,
top-k 2.34, min-p 14.84, top-nSigma 74.61 (LLaMA-3-8B-Instruct). ⚠ REGISTER: REASONING, NOT PROSE.
Claims top-p and min-p admit MORE noise as temperature rises. Best temperature ≈1.5.

## 13. LI, HOLTZMAN et al. — Contrastive Decoding (2210.15097, ACL 2023). Human eval on wikipedia,
wikinews, story: CD preferred 2.6x over nucleus on coherence, 1.4x on fluency. ⭐ THE QUALITATIVE
NUCLEUS FAILURE IS A REGISTER FAILURE: "a style shift from third person narrative style to first
person conversational style" mid-continuation, plus a drift into email format.

## 14. ZHOU, KEUPER, FRITZ (2408.13586) — reported sampler gains are "highly dependent on the curated
parameters"; "There exists no universal optimal paramters" [sic]. Wikipedia-English prefix tree:
the truncation point that exactly covers the real continuations varies drastically per prefix.
Mirostat performed poorly on all three downstream tasks.

## 15. MEISTER, PIMENTEL, MALAGUTTI, WILCOX, COTTERELL — On the Efficacy of Sampling Adapters
(2307.03749, ACL 2023). ⭐⭐ THE THEORETICAL STATEMENT OF THE METRONOME: every adapter is a
PRECISION-FOR-RECALL TRADE — "a model loses its ability to produce certain strings", precision on
desirable text rises. Not visible in perplexity. AND the honest nuance: the BEST quality scores come
from an INTERMEDIATE point, not from maximum precision.

## 16. JI, KE, WANG, HUANG (2310.01041, ICLR 2024) — Wikipedia + News, GPT-2 XL and OPT-6.7B.
Sampling gives less repetition but "disjunctive in discourse"; search keeps coherence and repeats.
Nucleus reaches human-level diversity "at the cost of low coherence"; typical decoding gives the
highest diversity AND the lowest coherence (severe topic shift).

## 17. AHMED & SINGH — Entropy-Aligned Decoding, EPIC (2601.01714, Jan 2026 preprint). top-p, top-k
AND min-p all "exhibit systematic bias away from the target entropy" even tuned. WritingPrompts
win rate vs min-p (ChatGPT-5 judge, 10 seeds): top-k 54%, top-p 51%, typical 43%, TEMPERATURE
tau=1.5 **0%**, EPIC 58%. ⚠ LM-as-judge, not human raters; base model not named in the text read.

## 18. CHANG et al. — REAL Sampling (2406.07735). The trade stated plainly: a higher p raises
diversity and lowers factuality.

## 19. RENZE & GUVEN (2402.05201) — NULL RESULT: temperature 0.0-1.0 has no statistically significant
effect on problem-solving accuracy (nine LLMs x five prompting techniques). ⚠ MCQA, not prose.

## 20. ILINYKH & DOBNIK (2511.04754) — ⚠⚠ THE METHODOLOGICAL LANDMINE UNDER FEATURES 5/11/17.
Humans show ~2x the surprisal variance of models under a caption-trained n-gram scorer — but
rescoring the SAME texts with a general LM REVERSES the finding. "relying on a single scorer can
completely invert conclusions." Any burstiness measurement we build must report several scorers.

## 21. XU, ZHOU, CELIKYILMAZ, MA — Look-back (2305.13477). The minimum KL between the current step's
distribution and earlier steps' distributions falls toward 0 as a loop sets in; human continuations
keep it away from 0. Also: the coherence hypothesis fails — greedy confidence-following can be
INCOHERENT. Relays the induction-head ("analogical sequence copying") account.

## 22. RAVFOGEL, GOLDBERG, GOLDBERGER — Conformal Nucleus Sampling (2305.02633). ⭐ OPT models are
OVERCONFIDENT: the true next word falls inside the top-p set LESS than p of the time, on 10,000
English Wikipedia items. Worst in the LOWEST-ENTROPY contexts — exactly where truncation bites
hardest. Calibration shows moderate INVERSE scaling with model size.

## 23. BOREC, SADLER, SCHLANGEN (2408.16345) — widening the nucleus reduces memorisation only
modestly; "soft memorization" (echoing training data without verbatim resemblance) survives it.

## 24. LIU, LI, XU, WANG, YUAN, YANG — FACE-2 (Findings of EMNLP 2025, pages 2444-2463). ⭐⭐ THE
MODERN METRONOME INSTRUMENT: the SPECTRUM of surprisal over position, on Wikipedia-English, BBC-News
and WritingPrompts, models to 70-72B. Larger models produce a spectrum closer to human. ⚠ MODEL-ERA
DRIFT stated explicitly: FACE-1's GPT-2-era conclusions on scaling and sampling "does not
necessarily apply to current LLMs."

## 25. GARCES ARIAS, LI, HEUMANN, ASSENMACHER — Decoding Decoded (2410.06097). 2.2 million
continuations across book/wikinews/wikitext. Optimal configurations vary by model AND task.
"Larger models do not show a clear advantage" — GPT2-XL (1.5B) sometimes beats Llama3 (8B).
Beam search fails against human references everywhere.

## 26. MAHAUT & FRANZON (2504.01100, Nov 2025) — REPETITIONS ARE NOT ALL ALIKE. Pythia 1.4B across
checkpoints: an ICL copying loop with a dedicated attention circuit, versus a natural loop that
appears early, has NO identifiable circuit, and attends disproportionately to LOW-INFORMATION
tokens (punctuation, newlines) — a fallback when context cannot be retrieved. Both uncertainty AND
over-reliance on context drive repetition; they are concurrent, not rival, mechanisms.

## SOURCES DELIBERATELY NOT CLAIMED (off this angle, belong to another finder)
- StoryScope (2604.03136, COLM 2026) — superb on AI fiction, but ZERO mentions of surprisal,
  temperature or decoding. Discourse-level narrative features. Hand to the craft/close angle.
- AI as Humanity's Salieri / Creativity Index (2410.04265) — n-gram overlap, not decoding.
- Narrative Flattening (2605.27878), Readers Prefer AI Trained on Copyrighted Books (2510.13939) —
  surfaced in search, off-angle here, worth flagging to the craft and reception angles.

## STOPPING RULE
Roster exhausted by the predecessor. Six lateral searches run this round; the last two surfaced
nothing new on-angle (the Mirostat query returned only Mirostat itself; the fiction-sampler query
returned fiction-evaluation papers with no decoding content). Two dedicated searches for a decoding
study in the gazetteer/annals/civic-record register returned nothing — recorded above as a finding.
