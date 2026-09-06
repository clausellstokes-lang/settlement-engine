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

## S5 (cont.) Shumailov Nature full text (fetched via cookies_not_supported URL, 2026-09-06)
- "Model collapse is a degenerative process affecting generations of learned generative models, in which the data they generate end up polluting the training set of the next generation."
- "In early model collapse, the model begins losing information about the tails of the distribution; in late model collapse, the model converges to a distribution that carries little resemblance to the original one."
- Three errors: statistical approximation, functional expressivity, functional approximation.
- OPT-125m Wikitext2: no original data retained: "losing some performance, from 20 to 28 perplexity points"; 10% preserved: "leads to only minor degradation".
- "The value of data collected about genuine human interactions... will be increasingly valuable".
- Verdict: DATA-LOOP property. Same shape as RLHF sharpening (tails go first) but the lever is the training-data mix, not a prompt. Gerstgrasser (S6) shows accumulation bounds the error — collapse is the REPLACEMENT loop's artefact.

## S10 Zhang, Schwarzschild, Carlini, Kolter, Ippolito 2024 — Forcing Diffuse Distributions (arXiv 2404.10859)
- "despite the prompts asking for randomness, these output distributions are extremely imbalanced"; Llama-2-13B-chat >60% on "five" for 1–10; Mistral-7B-Instruct "Avery 40 times more often than expected"; Gemma "Anya" 40%; "in 1000 samples, none of the models were able to generate all ten numbers".
- Temperature: "the untuned, baseline models need to be sampled at a temperature >10 to match the entropy of our fine-tuned models".
- Fine-tune to maximise likelihood over valid targets; leave-one-out: "substantial improvements in entropy over the baselines, even when the task was held out".
- Note: "our findings do generalize to pre-trained language models in general" (GPT-2 die roll) — so SOME point-mass behaviour predates alignment.
- Verdict: prompt asking for diversity FAILS at the token-choice level; temperature is impractical; a small fine-tune fixes and generalises. TRAINING ARTEFACT, trainable away.

## S11 Lin et al. 2023 — URIAL / Unlocking Spell (arXiv 2312.01552)
- "base LLMs and their alignment-tuned versions perform nearly identically in decoding on the majority of token positions. Most distribution shifts occur with stylistic tokens"; three constant examples + system prompt on a base model "can match or even surpass" SFT/RLHF-aligned models on JUST-EVAL-INSTRUCT.
- Verdict: the assistant VOICE is a thin stylistic layer, prompt-elicitable from base. Supports PROMPT-MOVABLE for register; says nothing about diversity.

## S12 Lake, Choi, Durrett 2025 — From Distributional to Overton Pluralism (NAACL 2025; arXiv 2406.17692)
- Apparent diversity loss "largely explained by quality control and information aggregation"; aligned outputs are "longer responses that cover information spanning several responses from the base LLM"; "the behavior of aligned models is recoverable from base models without fine-tuning"; "current alignment techniques capture but do not extend the useful subset of assistant-like base LLM behavior".
- Verdict: the aggregated 'everything-in-one-answer' shape is a training artefact and is elicitable in-context — the base model still holds the spread.

## S13 Zhou et al. 2023 — LIMA (arXiv 2305.11206)
- Superficial Alignment Hypothesis: "almost all knowledge in large language models is learned during pretraining, and only limited instruction tuning data is necessary"; 1,000 curated examples, no RL.
- Verdict: format/voice layer is small. Supports the URIAL/Lake line.

## S14 Wenger & Kenett 2025 — We're Different, We're the Same (arXiv 2501.19361)
- 22 LLMs (Jamba, Command R, Llama 3 70B, Mistral large, Gemini 1.5, gpt-4o, Phi-3...); AUT, Forward Flow, DAT. Mean variability AUT LLM 0.459 vs human 0.738; FF 0.534 vs 0.835; DAT 0.665 vs 0.819.
- Four system prompts (baseline, more creative, very creative w/ $200 incentive, not creative): "Varying the system prompt slightly increases LLM individual creativity and response variability, but variability remains far lower than that of humans."
- Verdict: MODEL SWITCH does not escape; SYSTEM PROMPT moves it slightly. Cross-model homogeneity is a population-level trait of current LLMs.

## S15 Chakrabarty, Laban, Wu 2024/25 — Can AI writing be salvaged? (arXiv 2409.14509)
- LAMP: 1,057 LLM paragraphs, 18 MFA writers, 8,035 edits. Frequencies: awkward word choice/phrasing 28%, poor sentence structure 20%, unnecessary/redundant exposition 18%, clichés 17%, then purple prose, lack of specificity, tense inconsistency.
- "None of the LLMs used in our study (GPT4o, Claude-3.5-Sonnet, Llama-3.1-70b) outperform each other in terms of writing quality, revealing common limitations across model families."
- "All 3 LLMs generate these idiosyncratic words/phrases suggesting possible overlap in instruction tuning data across model families."
- Few-shot detection of expert-flagged problems: best precision 0.46 (Claude-3.5-Sonnet, GPT-4o, 5-shot) vs expert agreement 0.57; plateau beyond 5-shot. Fine-tuning on LAMP "left for future work".
- Verdict: MODEL SWITCH doesn't help; prompting the model to find its own tells is weak (0.46). Mechanism suggested: shared instruction-tuning data.

## S16 Reinhart et al. 2025 — Do LLMs write like humans? (PNAS 122, e2422455122; arXiv 2410.16107)
- GPT-4o: present participial clauses 5.3x human (d=1.38); nominalizations 2.1x (d=1.23); that-clauses 2.6x (d=0.77); phrasal coordination 1.9x (d=0.81); agentless passives ~half. Words "camaraderie, palpable, tapestry, and intricate at more than 100 times the rate of humans"; "amidst" in 27% of GPT-4o outputs.
- "the Llama 3 base models use features at rates similar to human texts, while GPT-4o and Llama 3 instruction-tuned models have much wider variation"; differences "larger for instruction-tuned models than base models".
- Prompt "write 500 more words in the same style, tone, and diction" — differences persisted.
- Cause hypothesis: instruction tuning "trains them in a particular informationally dense, noun-heavy style"; "different human preferences in rating responses".
- Verdict: the grammatical tells are a TRAINING ARTEFACT (instruction tuning) that a style-imitation prompt did NOT remove; base models sit near human rates. Strongest single source for "training artefact, not prompt-movable at the grammatical level".

## S17 Rimsky et al. 2023/24 — Contrastive Activation Addition (arXiv 2312.06681) [abstract only]
- Steering vectors "effective over and on top of traditional methods like finetuning and system prompt design"; sycophancy among the steered behaviours.
- Verdict: behaviours incl. sycophancy are movable inference-time directions — not fixed traits; but this is a weights-access lever, not a prompt.

## S18 Padmakumar & He 2024 — Does Writing with LMs Reduce Content Diversity? (ICLR 2024; arXiv 2309.05196)
- "Writing with InstructGPT (but not the GPT3) results in a statistically significant reduction in diversity"; "mainly attributable to InstructGPT contributing less diverse text"; "the user-contributed text remains unaffected".
- Verdict: the BASE model does not homogenise; the feedback-tuned one does. TRAINING ARTEFACT.

## S19 Xu et al. 2024/25 — Echoes in AI (arXiv 2501.00273)
- Kafka continuation: 50/100 GPT-4 "second left", 18/100 "second right", 16/100 bakery landmark. "plot elements generated by LLaMA-3 are echoed not only in its own generations, but also in alternative continuations generated by GPT-4" (cross-model gap 0.6–1.6 vs human–LLM gap >6.0).
- Temperature fixed at 1.0, citing "the influence of temperature on the creativity of LLMs is weak" (Peeperkorn). Originality prompting not tested.
- Verdict: plot-level sameness crosses MODEL boundaries; temperature dismissed on prior evidence; prompting untested.

## S20 Khoriaty et al. 2026 — DeCan (arXiv 2606.01811, ICML 2026 workshop) [abstract]
- OLMo-2-7B: "D_Ca_n drops monotonically across the base → SFT → DPO → RLVR stages".
- Verdict: every post-training stage costs diversity, monotonically. TRAINING ARTEFACT.

## S21 Anderson, Shah, Kreminski 2024 — Homogenization Effects (C&C 2024; arXiv 2402.01536)
- 36 participants: "different users tended to produce less semantically distinct ideas with ChatGPT than with an alternative CST".

## S22 Doshi & Hauser 2024 — Science Advances 10(28), PMC11244532 (full text via Europe PMC)
- N=293 writers; conditions human-only / one GPT-4 idea / five ideas. Low-DAT writers: novelty +10.7%, usefulness +11.5% with five ideas. AI-assisted stories "more similar to each other than stories by humans alone"; similarity increase 8.9% of range (five-idea); stories 5.2%/5.0% more similar to the AI ideas.
- "With generative AI, writers are individually better off, but collectively a narrower scope of novel content is produced."
- Verdict: homogenisation propagates from the model into human output; the mechanism is anchoring on the model's mode.

## S23 Ismayilzada et al. 2025 — Creative Short Story Generation (ICCC 2025; arXiv 2411.02316)
- 60 LLMs (2B–405B) zero-shot at temperature 0.7 / top_p 0.95 vs 60 humans. Humans more novel, "more surprising (p<0.001)", "higher lexical and semantic diversity (p<0.0001)". LLM 5-grams: "in the heart of the" 33x, "once upon a time in" 11x; human 5-grams at most twice. "model stories tend to share the same themes while human stories are much more diverse".
- No stratification by size/recency reported.
- Verdict: MODEL SWITCH across 60 models does not remove template phrases or theme convergence.

## S24 Murthy et al. 2025 — One fish, two fish (NAACL 2025; arXiv 2411.04427)
- Individuals simulated via temperature t in [t0, 1.5, 2.0] and persona prompts ("You are a [race] [gender] from [hometown]..."). Word-colour heterogeneity: humans 15.82 vs models ~2–5. "No model reached human-like conceptual diversity"; persona prompting > temperature but far short; "aligned models generally display less diversity than their instruction fine-tuned counterparts".
- Verdict: PROMPT (persona) moves diversity more than temperature, but neither reaches human; alignment is a further cost on top of SFT.

## S25 Jentzsch & Kersting 2023 — ChatGPT is fun, but it is not funny (arXiv 2306.04563)
- "Over 90% of 1008 generated jokes were the same 25 Jokes"; "jokes are not hard-coded but mostly also not newly generated".
- Verdict: canonical task-level mode collapse; the exact task VS later uses to demonstrate prompt-level recovery.

## S26 Chakrabarty et al. 2024 — Art or Artifice? / TTCW (CHI 2024; arXiv 2309.14556)
- New Yorker authors 11.9/14 (84.7%); GPT-3.5 1.2 (8.7%); GPT-4 3.9 (27.9%); Claude 1.3 4.2 (30.0%). Originality in Form 63.9% vs 0–8.3%; Originality in Thought 91.7% vs 2.8–44.4%; Literary Devices 88.9% vs 5.6–36.1%; Narrative Ending 91.7% vs 8.3–19.4%.
- Expert notes: "cliched turns of phrase"; "'Inky sky' repeated a lot, as did 'etched'"; dialogue "direct & expositional"; characters "over-explain situations and emotions".
- Verdict: a stronger MODEL moves the pass-rate (1.2 → 4.2 of 14) but no model approaches the class; the failed tests are structural (form, ending, subtext).

## S27 Wei et al. 2023 — Simple synthetic data reduces sycophancy (arXiv 2308.03958)
- "both model scaling and instruction tuning significantly increase sycophancy for PaLM models up to 540B"; lightweight fine-tune "can significantly reduce sycophantic behavior on held-out prompts".
- Verdict: sycophancy is a TRAINING ARTEFACT that scale WORSENS and a small fine-tune cures.

## S28 Li et al. 2024 — Predicting vs. Acting (arXiv 2407.02446)
- RLHF models: "the most common 10-grams appearing in 60% of generations on average"; ~25% of outputs for a prompt share a 25-gram; "RLHF models restrict randomness via implicit blueprints"; anchor spans are "textual scaffolding"; alignment "especially near the beginning"; RLHF models worse at next-token prediction on human text, gap persists after fine-tuning.
- Prompting/temperature to break the blueprint: not tested.
- Verdict: the MECHANISM of structural sameness — early commitment to a scaffold. TRAINING ARTEFACT (RLHF).

## S29 Guo et al. 2024/25 — Benchmarking Linguistic Diversity (arXiv 2412.10271)
- Size: "lexical diversity consistently increases with model size"; syntactic peaks ~7B then declines; semantic stable. "SFT has minimal impact on any diversity metric"; "DPO leads to a decrease in syntactic diversity and an increase in lexical diversity"; instruction-tuned "higher lexical diversity... but exhibit reductions in syntactic and semantic diversity".
- Temperature: "greater lexical diversity, with only a minor reduction in relevance". Prompt: "altering the prompt formulation has minimal impact on the diversity of generated stories across all three evaluated aspects".
- "LLMs consistently lag behind humans in all three diversity aspects"; "models frequently memorize syntactic templates encountered during pretraining, which are rarely overwritten during SFT and preference tuning".
- Verdict: ORDINARY prompt rewording does nothing; temperature buys LEXICAL variety only; the SYNTACTIC layer is pretraining-memorised and post-training-immune. Tension with DivPO on temperature's quality cost — different quality instruments (relevance vs ArmoRM).

## S30 Shaib et al. 2024 — Syntactic Templates in Generated Text (arXiv 2407.00211)
- "95% of outputs contain templates of length n=6" vs human 38%; "75% of templates produced by OLMo are found in the pre-training data" vs 34% for non-templated sequences; templates "are not overwritten during fine-tuning or alignment processes such as RLHF".
- "While the choice of prompt impacts the rate of templates, the incidence remains on average higher than 90%"; sampling strategies intended to increase lexical diversity leave summarisation template rate at 96.8% ± 0.6; open generation 74.4% ± 2.1.
- Verdict: the STRUCTURAL tell (POS-level templates) is PRETRAINING-ORIGIN, survives alignment, survives prompt choice and diversity-oriented sampling. Strongest source for "fixed at the syntactic layer under any prompt/temperature" — but note: fixed by pretraining corpus, i.e. still a training artefact, and Shaib measured OLMo/Llama-class models, not frontier.

## S31 Pagan et al. 2025 — Computational Turing Test (arXiv 2511.04195)
- Nine open models; five calibration stacks: baseline → persona → +stylistic examples → +context retrieval → +fine-tuning; plus post-generation selection. BERT detector "never falling below 85%" at baseline; best calibration lowers to "between 75 and 85%". "Instruction-tuned models underperform their base counterparts"; "Non-instruction-tuned variants... achieve the lowest detection rates". "Affective language remains the clearest marker of artificiality"; calibration "reduces structural divergences such as sentence length or word count, [but] differences in emotional tone persist"; "optimizing for human-likeness often comes at the cost of semantic fidelity".
- Verdict: persona + examples + retrieval + FINE-TUNING together move detectability ~10 points; the residual is affective. Base models are closer to human. TRAINING ARTEFACT partially movable by heavy calibration; not prompt-curable.

## S32 Slocum, Parker-Sartori, Hadfield-Menell 2025 — Diverse Preference Learning (arXiv 2511.08594; MIT CSAIL)
- Mechanism: KL regulariser "systematically overweight majority opinions and sacrifice diversity"; with beta=0.1 an 80% majority becomes 99.9999%. Aligned LLMs "generate text with repetitive structure and word choice"; DPO stories "same doctor name, gender".
- Soft Preference Learning decouples entropy from cross-entropy; Pareto-dominates temperature-scaled DPO on nine diversity metrics; token-level temperature "leads to rapid degradation of fluency and quality" (incoherent above t≈1.5), SPL stable at higher global temperature.
- Verdict: mechanism = KL term; cure = training-side; temperature explicitly ruled out as substitute.

## S33 O'Mahony, Grinsztajn, Schoelkopf, Biderman 2024 — Attributing Mode Collapse (ICLR 2024 ME-FoMo; openreview 3pDMYjpOxk) [ABSTRACT ONLY — PDF behind OpenReview challenge wall]
- "It is a well-known anecdotal observation that instruction-tuned models have less output diversity, such as the infamous observation that ChatGPT cannot seem to generate more than a handful of jokes"; distinguishes token-level prediction diversity from output generation diversity; "the supervised fine-tuning and reward-based fine-tuning steps have different effects on these distinct diversity types".
- Verdict: pipeline-stage attribution exists; which stage hits which layer NOT verified here (owed).

## S34 Li et al. 2025 — DARLING (arXiv 2509.02534; Meta)
- Post-training "sharpens output distributions and reduces the range of ideas"; learned partition function × quality reward in online RL; creative writing: higher quality AND novelty; math: higher pass@1 and pass@k.
- Verdict: training-side cure with no quality tax.

## S35 Chakrabarty et al. 2025 — AI-Slop to AI-Polish? (arXiv 2504.07532)
- WQ benchmark 4,729 judgments; WQRM 74% on WQ; test-time selection "preferred by experts 66% overall, and 72.2% when the reward gap is larger than 1 point"; frontier LLMs "barely outperform random baselines on WQ".
- Verdict: INFERENCE-TIME steerability exists but needs an external expert-trained judge; the model's own taste is ~random on writing quality — the LLM-as-self-editor route is weak.

## S36 Sun et al. 2025 — CD-RLHF (ACL 2025; arXiv 2501.11463)
- RLHF "often at the cost of reduced output diversity"; curiosity bonus gives diversity gains with comparable alignment.

## S37 Gerstgrasser 2024 — see S6.

## Dead ends / not read
- science.org DOI page: HTTP 403 (paywall/bot wall) — used Europe PMC full text instead.
- Semantic Scholar API: HTTP 429 twice.
- dblp: 0 hits for O'Mahony.
- OpenReview forum/pdf/notes: challenge wall; abstract captured from api2 search endpoint before the wall.
- WebSearch: unavailable all lane (200/200 spent by parent). Discovery via arXiv export API (3 queries: "Attributing Mode Collapse" → 0; prompting+diversity+creative writing+mode collapse → 4 hits incl. VS, Khoriaty; instruction-tuned+stylistic+prompt+homogeneity/detectable → Reinhart, Pagan).

## SYNTHESIS — the case against "no prompt, temperature or model switch fixes the tells"
The first sweep's claim is right about TEMPERATURE and mostly right about MODEL SWITCH, but wrong as a blanket statement about PROMPTS — and wrong about the word "fixed". Layer by layer:

1. TEMPERATURE: NOT a fix. Peeperkorn (weak novelty, more incoherence); DivPO Fig 11 (sharp quality decline); Slocum (incoherent above ~1.5); Forcing Diffuse (base needs T>10 to match a diffuse fine-tune); Shaib (diversity sampling leaves template rate 96.8%); Guo is the lone partial dissent (lexical diversity up, minor relevance cost) — and lexical is the layer that was never the problem. CONFIRMED across five independent instruments.

2. MODEL SWITCH (same class of aligned frontier model): NOT a fix. Wenger & Kenett (22 models, variability 0.46 vs 0.74); Ismayilzada (60 models, same templates/themes); Chakrabarty LAMP (three families share idiosyncratic words, none better); Xu (LLaMA-3 plots echoed by GPT-4); TTCW (best model 4.2/14 vs 11.9). A STRONGER model raises the score (TTCW 1.2→4.2; VS gains 1.5–2x larger on bigger models) without leaving the class.
   EXCEPTION — switching to a BASE model or SFT-only model is a real lever: Padmakumar (GPT-3 base does not homogenise, InstructGPT does); Reinhart (Llama-3 base at human feature rates); Pagan (base variants least detectable); Kirk (recommends SFT for story generation); Guo/Khoriaty/Murthy (every post-training stage costs diversity). This is the strongest evidence that the tells are TRAINING ARTEFACTS: the base model does not have them.

3. PROMPTS: split by layer.
   a. DISTRIBUTION-level sameness (same joke, same name, same plot beat across generations): PROMPT-MOVABLE — VS (1.6–2.1x, human-rated joke diversity 1.83→3.01) by changing the prompt's SHAPE (ask for a distribution, not an instance); Murthy (persona prompts move more than temperature); Lake/URIAL (base-model breadth is elicitable in-context). Wenger & Kenett's "be very creative" system prompt moved it only slightly — CONTENT prompts don't work, SHAPE prompts do.
   b. GRAMMATICAL/SYNTACTIC tells (participial clauses, nominalisations, POS templates, gloss tails): NOT prompt-movable in any test read — Reinhart's "same style, tone, and diction" instruction failed; Shaib's templates >90% under every prompt; Guo's "minimal impact" from prompt rewording; Forcing Diffuse's "asking for randomness" failed. These are pretraining-memorised (Shaib 75–76%) and NOT overwritten by alignment; alignment then AMPLIFIES them (Reinhart, Pagan).
   c. AFFECTIVE tone / polish-over-substance: persists through the heaviest calibration stack incl. fine-tuning (Pagan); the preference model itself rewards "convincingly-written" over correct (Sharma) — this is the reward signal's taste, movable at the PM (Sharma's non-sycophantic PM; Wei's fine-tune; Rimsky's vectors) but not at the prompt.

4. MECHANISM (what the failure IS): three nested artefacts, each with a named lever —
   - PRETRAINING corpus → syntactic templates (Shaib). Lever: none at inference; would need data/decoding-level intervention.
   - PREFERENCE DATA → typicality bias, alpha≈0.6 (VS); sycophancy/"convincing" preference (Sharma). Lever: better PM / annotator instructions / edit-based rewards (AI-Slop WQRM: expert-preferred 66%).
   - RL OBJECTIVE + KL → point-mass optimum (DivPO), majority overweighting to 99.9999% (Slocum), anchor-span blueprints in 60% of generations (Li), attractor states (Mohammadi), monotone loss per stage (Khoriaty), ~30% creativity-index loss (Lu). Lever: DivPO / SPL / DARLING / CD-RLHF on the training side; VS on the prompt side for distribution-level only.
   - CORPUS LOOP → model collapse (Shumailov), same tails-first shape; lever = keep human data / accumulate (Gerstgrasser).

5. VERDICT for the prose program: the tells are TRAINING ARTEFACTS, not fixed traits — the base model lacks them and training-side cures exist. But for a consumer who cannot retrain, only ONE inference lever is proven: prompt SHAPE (distribution/list-with-probabilities framing) for what-gets-said sameness. No read source shows a prompt curing how-it-is-said sameness (syntax, gloss tails, tone). That agrees with the repo's finding that the failures are STRUCTURAL; it disagrees with the first sweep only in the word "no prompt" — it should read "no prompt fixes the structural tells; a distribution-shaped prompt does fix the mode collapse".

## Tensions recorded
- VS (bias lives in the reward signal, alpha≈0.6) vs Kirk (BoN with the same RM keeps SFT diversity at N=16): both hold if the RM's typicality term only bites under strong optimisation (gamma = 1 + alpha/beta grows with weak KL). CONTESTED at the margin.
- Guo (temperature: minor relevance cost) vs DivPO/Slocum (sharp quality drop): different quality instruments (relevance vs reward-model score vs fluency). Both can be true; neither makes temperature a cure for structural tells.
- Forcing Diffuse's GPT-2 die-roll note: some point-mass behaviour predates alignment — "training artefact" includes pretraining.

## Open questions / owed
- O'Mahony full text (which stage hits token-level vs output-level diversity) — behind OpenReview wall.
- No source measured whether VS-style prompting reduces STRUCTURAL tells (participial clauses, gloss tails, templates) — the decisive experiment for this program is unrun in the literature read.
- Reinhart/Pagan/Shaib measured open-weight or 2024-era models; no 2026 frontier model was in any of the structural-tell tests read.
