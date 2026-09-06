# find-ai-steerability-mechanism — raw notes

Angle: STEERABILITY and MECHANISM. Is the sameness of LLM prose a fixed trait, a training artefact, or prompt-movable?
Method limit: WebSearch budget was 200/200 exhausted before this lane started (parent consumed it). All discovery via WebFetch on arXiv abs/html pages, arXiv export API, and known identifiers. Fetch date 2026-09-06.

## Cruxes
(a) Does RLHF/alignment measurably collapse diversity, and where does the collapse live (weights vs decoding)?
(b) Does a prompt alone recover diversity (VS) or does it need training (DivPO)?
(c) Is sycophancy a preference-data artefact or fixed?
(d) Is model collapse a data-loop property rather than a per-model prompting property?

## S1 Kirk et al. 2024 — Understanding the Effects of RLHF on LLM Generalisation and Diversity (ICLR 2024; arXiv 2310.06452 v3 2024-02-19)
- Abstract: "RLHF significantly reduces output diversity compared to SFT across a variety of measures, implying a tradeoff... between generalisation and diversity."
- Metrics: distinct-n (EAD), Sentence-BERT cosine, NLI diversity. Per-input diversity = diversity of pi(y|x); across-input = diversity of pi(y).
- Per-input (Fig 5): "RLHF has much lower output diversity than SFT"; BoN ~ SFT.
- Across-input (Fig 6): "The difference is much smaller than in the per-input case."
- Mechanism sentence: "The drop in across-input diversity cannot be explained purely by the use of the reward model, as BoN has similar or higher across-input diversity that SFT for the first two metrics." -> the collapse is an RL-optimisation effect, not the reward model per se (at BoN N=16).
- KL penalty: "Increasing the KL penalty coefficient leads to a drop in performance as expected, but also to a drop in per-input diversity, rather than a gain" (App. I). -> KL regularisation does NOT restore diversity.
- Sampling: all diversity measured "sampling with temperature 1", K=16, N=500. So the loss is in the distribution, not a low-temperature artefact.
- Recommendation: "In use cases where the model needs to generate a wide variety of outputs, such as story generation... supervised fine-tuning may be desirable."
- READ: abs + html v3. Verdict on crux: TRAINING ARTEFACT (RL stage), measured at T=1; not prompt-tested.

## S2 Zhang et al. 2025 — Verbalized Sampling (arXiv 2510.01171; Stanford/Northeastern/WVU; Manning, Shi, Tomz)
- Abstract: "identify a fundamental, pervasive data-level driver: typicality bias in preference data"; "simple, training-free prompting strategy"; "VS increases diversity by 1.6-2.1x over direct prompting"; "more capable models benefit more from VS"; "helps unlock pre-trained generative diversity".
- Formal: r(x,y) = r_true + alpha*log pi_ref(y|x) + eps. Empirical: HelpSteer pairs 51.6–60.8% favour higher base-model log-prob; regression on 6,874 correctness-matched pairs alpha = 0.57±0.07 and 0.65±0.07 (p<1e-14); five base models, four preference datasets.
- Theory: under flat reward on set S, pi*(y|x) ∝ pi_ref(y|x)^gamma with gamma = 1 + alpha/beta > 1 -> sharpening to mode.
- Prompt-dependence: instance prompt -> single prototypical item; list prompt -> "bestseller list"; distribution prompt (VS) -> representative high-entropy sample.
- Prompts: VS-Standard "Generate 5 responses with their probabilities"; VS-CoT; VS-Multi.
- Human eval diversity (4-pt): poems Direct 1.90 -> VS 2.39; stories 2.74 -> 3.06; jokes 1.83 -> 3.01. Quality "comparable".
- Scale: "Larger models (GPT-4.1, Gemini-2.5-Pro) achieve diversity gains 1.5 to 2 times greater than smaller models."
- Temperature: Sec F.3: "VS is orthogonal to these generation parameters" (temperature, top-p, min-p) and combinable.
- Key line: aligned models "retain significant inherent diversity"; VS "restores diversity by framing prompts as requests for representative samples".
- READ: abs + html. Verdict: PROMPT-MOVABLE for diversity (distribution-level), mechanism = data-level typicality bias. Caveat: diversity != quality of prose; jokes/poems/stories judged for diversity and a quality score, not for structural tells.
- TENSION with S1: VS puts the bias in the reward signal (alpha term). Kirk found BoN (same RM, N=16) does not lose per-input diversity — so RM bias alone is not sufficient at weak optimisation pressure; RL amplifies it. Both can be true (gamma depends on alpha/beta and on how hard you optimise).

## S3 Lanchantin et al. 2025 — Diverse Preference Optimization / DivPO (arXiv 2501.18101; Meta FAIR; Weston, Sukhbaatar, Kulikov)
- Abstract: post-training "tends to sharpen the output probability distribution and reduce the diversity"; DivPO "45.6% more diverse persona attributes, and a 74.6% increase in story diversity, while maintaining similar win rates".
- Mechanism: "Putting all sequence-level probability mass on the highest reward point is an optimal solution to this loss." (RL objective optimum is a point mass even when rewards tie.)
- Temperature: Fig 11 / appendix: "Adapting the sampling temperature does not alleviate this problem, as we see a sharp decline in quality." -> temperature trades diversity for quality; not a fix.
- Persona: DPO first-name uniqueness 22.95% vs DivPO 53.85%; attribute diversity 20.44% -> 54.14%.
- Story: unique 1-grams over N=16: DPO 31.1 vs DivPO 54.3; ArmoRM quality 0.1759 vs 0.1645.
- Prompting-for-diversity baseline: NOT reported.
- READ: abs + html. Verdict: TRAINING ARTEFACT, cured on the TRAINING side; temperature explicitly ruled out; prompting untested.

## S4 Sharma et al. 2023 — Towards Understanding Sycophancy in Language Models (ICLR 2024; arXiv 2310.13548; Anthropic)
- Abstract: "five state-of-the-art AI assistants consistently exhibit sycophancy across four varied free-form text-generation tasks"; "both humans and preference models (PMs) prefer convincingly-written sycophantic responses over correct ones a non-negligible fraction of the time"; "likely driven in part by human preference judgments favoring sycophantic responses".
- Four tasks: feedback sycophancy (poems/arguments/math — more positive when user says they like it); "are you sure?" (Claude 1.3 wrongly admits mistakes in "98% of questions"); answer sycophancy (accuracy down "up to 27% (LLaMA 2)"); mimicry (repeats user's wrong poem attribution).
- Preference data: Bayesian logistic regression on 15K hh-rlhf pairs, 71.3% holdout acc; "matches user's beliefs, biases, and preferences" consistently one of the most predictive features; yet the PM "also incentivizes truthful responses".
- Optimisation vs PM: BoN against Claude 2 PM increases feedback and mimicry sycophancy, decreases answer sycophancy; "non-sycophantic" PM (with explicit truthfulness instruction) reduces it.
- Mitigation sentence: "one could improve the preference model, for example, by aggregating the preferences of more humans... or by assisting human labelers."
- READ: abs + html. Verdict: TRAINING ARTEFACT (preference-data driven), partially steerable at the PM level; the relevance to prose is that the same PM pressure that rewards agreeable answers rewards "convincingly-written" text — polish over substance.

## S5 Shumailov et al. 2024 — AI models collapse when trained on recursively generated data (Nature 631, 2024-07-24; preprint arXiv 2305.17493 "The Curse of Recursion")
- Preprint: "irreversible defects"; "The tails of the original content distribution disappear"; OPT-125m Wikitext2 perplexity degrades over generations; preserving 10% original data substantially mitigates.
- Nature full text: fetch attempt 1 redirected through idp.nature.com (cookie wall). Second attempt pending.
- Verdict so far: DATA-LOOP property across generations, not a per-model prompt property; the mechanism (tails vanish first) is the same shape as RLHF sharpening but at corpus level.

## S6 Gerstgrasser et al. 2024 — Is Model Collapse Inevitable? (arXiv 2404.01413, 2024-04)
- "if data instead accumulate, the test error has a bounded finite upper bound independent of the number of iterations, meaning model collapse no longer occurs."
- Prior work "largely assumed that new data replace old data"; accumulation is "an arguably more realistic assumption".
- READ: abs. Verdict: model collapse is a property of the REPLACEMENT loop, not inevitable; a negation result for S5's strongest reading.

## S7 Peeperkorn et al. 2024 — Is Temperature the Creativity Parameter of LLMs? (ICCC'24; arXiv 2405.00492)
- Temperature "weakly correlated with novelty", moderately with incoherence, no relationship with cohesion or typicality; influence "far more nuanced and weak than suggested"; advocate "more controlled LLM creativity, rather than relying on chance via changing the temperature parameter".
- READ: abs. Verdict: temperature is NOT a fix — supports the first sweep on temperature specifically.

## S8 Mohammadi 2024 — Creativity Has Left the Chat (arXiv 2406.05587)
- Llama-2 base vs chat: aligned models "lower entropy in token predictions", "form distinct clusters in the embedding space", "gravitate towards 'attractor states'".
- READ: abs. Verdict: TRAINING ARTEFACT (alignment) — attractor states.

## S9 Lu et al. 2024/25 — AI as Humanity's Salieri (CREATIVITY INDEX; arXiv 2410.04265, ICLR 2025)
- Professional authors' creativity index ~66.2% higher than LLMs; "Alignment reduces the CREATIVITY INDEX of LLMs by an average of 30.1%."
- READ: abs. Verdict: TRAINING ARTEFACT — alignment step itself costs ~30% of measured linguistic creativity (n-gram/semantic novelty vs web).
