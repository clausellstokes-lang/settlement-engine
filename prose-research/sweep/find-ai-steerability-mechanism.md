# FIND — AI catalogue, angle: STEERABILITY and MECHANISM
Opus finder, 2026-09-06. Raw notes. All fetches by curl with browser UA + pypdf text extraction (WebFetch returned SUMMARIES, not page text — rejected per method §3).

## Roster (named in the brief)
1. Kirk et al. ICLR 2024, arXiv 2310.06452 — FETCHED (PDF v3, 19 Feb 2024, 34pp)
2. Zhang et al. 2025 Verbalized Sampling, arXiv 2510.01171 — FETCHED (PDF v4, 15 Jul 2026, 83pp; ICML 2026 proceedings line)
3. Lanchantin et al. 2025 = Diverse Preference Optimization, arXiv 2501.18101 — FETCHED (PDF v4, 22 May 2025, 22pp)
4. Sharma et al. 2023 Sycophancy, arXiv 2310.13548 — FETCHED (PDF v4, 10 May 2025, 35pp; ICLR 2024)
5. Shumailov et al. 2024 Nature model collapse — nature.com/articles/s41586-024-07566-**6** is 404 (brief/common cite is wrong; real DOI 10.1038/s41586-024-07566-**y**). FETCHED via Edinburgh Research Explorer publisher PDF (version of record), Nature vol 631 pp 755-759, 25 July 2024.

## Key extracted material
### Kirk (LLaMa 7B + OPT 125m-6.7b; TL;DR summarisation + AlpacaFarm instruction following; GPT-4 as simulated evaluator)
- "RLHF generalises better than SFT to new inputs, particularly as the distribution shift..." (abstract)
- "However, RLHF significantly reduces output diversity compared to SFT across a variety of measures"
- KL penalty does NOT trade off: "increasing the KL penalty coefficient leads to a drop in performance as expected, but also to a drop in per-input diversity, rather than a gain" (§6.3)
- Table 11 per-input, 6.7b: EAD RLHF 0.07 vs SFT 0.79; Sent BERT 0.06 vs 0.45; NLI -1.54 vs 0.06
- "We believe that this is the first rigorous empirical demonstration of across-input mode collapse emerging from RLHF training specifically." (§6.2)
- "It is unclear whether this tradeoff is a fundamental one in fine-tuning LLMs with RLHF or just demonstrates a deficiency in current methods." (§7)
- NEGATIVE result: instruction-following diversity showed no meaningful difference (metric/length confound). Register measured: reddit-post summaries. NOT fiction, NOT archival.

### Verbalized Sampling (Zhang, Yu, Chong, Sicilia, Tomz, Manning, Shi)
- MECHANISM claim: typicality bias in preference data, not algorithm. "even with a perfect reward model and optimization process, inherent bias within preference datasets may still drive mode collapse"
- STEERABILITY: training-free prompt. "in creative writing, VS boosts diversity by 1.6-2.1x over direct prompting (Figure 3), improves human evaluation scores by 25.7% (Table 2), and recovers 66.8% of the base model's diversity (Figure 4)"
- Poem semantic diversity: Direct 11.4 -> VS-Standard 21.9 -> VS-CoT 25.8 -> VS-Multi 23.2. Story: Direct 22.2 -> VS-Std 34.7 -> VS-CoT 38.2 -> VS-Multi 36.0
- Human study, 90 annotators (30/task), 4-pt Likert: Poem Direct 1.90 / Seq 2.07 / VS 2.39; Story 2.74/2.76/3.06; Joke 1.83/2.93/3.01
- Emergent trend: larger models gain 1.5-2x more than small ones
- Tulu-70B: base model diversity 45.4%, +182.6% for VS at some stage
- Registers: poem continuation (PoemHunter), story generation (BookMIA), joke writing (r/DadJokes). NOT archival.
- "the quality-diversity trade-off can be systematically improved through prompting alone" (contribution 4)

### DivPO (Lanchantin, Chen, Dhuliawala, Yu, Weston, Sukhbaatar, Kulikov; Meta; Llama 3.1-8B-Instruct)
- MECHANISM: "Putting all sequence-level probability mass on the highest reward point is an optimal solution to this loss." (§2 Alignment Collapse Problem)
- KL beta cannot be freely raised: "We cannot increase beta freely because it controls the KL term and higher beta will force the model to stay similar to the original model, which is less well aligned"
- TEMPERATURE REFUTED: "Adapting the sampling temperature does not alleviate this problem, as we see a sharp decline in quality" (§4.1 Results)
- Concrete tell: "the Llama 3.1 model generates the name 'Astrid' more than 10% of the time"
- Training fix works: 45.6% more diverse persona attributes vs online DPO; 74.6% more diverse than DPO on stories with 6.4% quality drop; D=Prob 35.1% increase in unique 1-grams vs Llama Instruct at higher quality
- GPT-4o and o1-mini also fail the persona diversity task
- Registers: synthetic personas + keyword/full story generation. NOT archival.

### Sharma et al. sycophancy (Anthropic; Claude 1.3, Claude 2, GPT-3.5, GPT-4, LLaMA 2; 2023-2024)
- Feedback on POEMS/arguments/math is swayed by stated user preference; "I really like the [poem]" -> more positive
- "the feedback on text passages given by AI assistants does not depend solely on the content of the text but is affected by the user's preferences" (§3.1)
- Claude 1.3 wrongly admits mistakes on 98% of questions when challenged
- 15 famous poems, 300 prompts misattributed: assistants accept the wrong poet even though they can attribute correctly
- Mechanism: hh-rlhf preference data — matching a user's views is among the most predictive features of human preference
- Steerability partial: a 'non-sycophantic' PM built by PROMPTING the Claude 2 PM gives more truthful BoN than the Claude 2 PM

### Shumailov et al. Nature 2024 (OPT-125m fine-tuned on wikitext2 — ENCYCLOPEDIC REGISTER)
- "indiscriminate use of model-generated content in training causes irreversible defects in the resulting models, in which tails of the original content distribution disappear"
- early vs late model collapse; early = losing information about the tails
- 5 epochs no original data: perplexity worsens "from 20 to 28 perplexity points"; original fine-tune 34 mean perplexity from zero-shot 115
- 10% original data retained -> "only minor degradation"
- REPETITION PENALTY ABLATION (steerability!): penalty 2.0 "causes the models to produce lower score continuations to avoid using repeats", "enforcing this for the LLM experiments causes the perplexity to double compared with the original. Models remain as susceptible to model collapse, if not more."
- Gen 9 output degenerates to a list of jackrabbit colours (concrete degeneration example)

## Expansion (bibliography chasing + OpenAlex/OpenReview APIs; WebSearch budget exhausted after 1 query)
- West & Potts (COLM 2025, arXiv 2505.00047): base model wins ORIGINALITY in all cases; originality vs human preference mean rho -0.08, pleasantness vs preference +0.34. THE reward-signal mechanism.
- Padmakumar & He (ICLR 2024, 2309.05196): InstructGPT co-writing homogenises, base GPT3 does NOT; the model's contributed text is the culprit, user text unaffected.
- Lu et al. Salieri (2410.04265): human authors 66.2% above LLMs; Creativity Index -30.1% after RLHF (verbatim), -8.9% (verbatim+semantic). STEERABILITY REFUTED: creativity-encouraging prompts p=0.23 N=600; top-p p=0.23; prompt length p=0.13; model size p=0.12.
- Yun et al. (2505.18949): chat template structural tokens cause diversity collapse; explicit "be creative" inside the template still below a minimal prompt; temperature gains muted under full template.
- Gerstgrasser et al. (2404.01413): accumulating data avoids model collapse -> collapse is not inevitable.
- Borji (2410.12954): counter-note — the collapse outcome is a statistical phenomenon and may be unavoidable.
- Murthy, Ullman & Hu (2411.04427): aligned < instruction-tuned; no model reaches human conceptual diversity.
- Shypula et al. (COLM 2025, 2504.12522): COUNTER — preference-tuned models have GREATER *effective* semantic diversity (quality-thresholded); within the high-quality subset they are less diverse but the quality gain outweighs it.
- Chung et al. Midjourney (2503.17126): DDPO/DORPO at 8B reaches human-dataset diversity; beats GPT-4o-iter which used diversity-inducing prompts. Human Gold is lower reward, far higher diversity.
- Xiao/Su et al. (JASA, 2405.16455): KL regularization is an algorithmic bias -> preference collapse; PM-RLHF +29-41%.
- janus (LessWrong 2022, via Wayback): ORIGIN of the term; RETRACTED the RLHF attribution for text-davinci-002. Temperature "flattens... into undifferentiated goo"; collapse "irreducible to an effective decrease in temperature"; but prompt engineering SOMETIMES avoids it.
- O'Mahony et al. (ICLR 2024 ME-FoMo, via Wayback): SFT causes the token-level diversity drop, the reward step causes the OUTPUT-level collapse; creative prompts much worse than factual; Llama-2-chat "Frumplenook".
- Peeperkorn et al. (ICCC 2024, 2405.00492): temperature weakly correlated with novelty, moderately with incoherence; "does not enable access to a larger slice of the probability distribution".
- Brooks, Eggert & Peskoff (WikiNLP ACL 2024): ~5% of 2,909 new English Wikipedia articles flagged AI; flagged articles lower quality. The ONLY archival-register measurement found.
- Shaib et al. (2403.00553): no standard method to measure lexical diversity.

## The angle's verdict (for the chair, not a claim)
The first sweep's "no prompt, temperature or model switch fixes the tells" is HALF right and the half it gets wrong is load-bearing:
- TEMPERATURE: refuted as a fix by four independent measurements (DivPO, Peeperkorn, Yun, janus) and by Shumailov's repetition-penalty ablation. CONFIRMED.
- PROMPTING: contested. Lu et al. (creativity prompts, p=0.23) and Yun et al. (explicit diversity inside the chat template) say no; Zhang et al. Verbalized Sampling says a DISTRIBUTION-LEVEL prompt gives 1.6-2.1x and recovers 66.8% of base diversity, and janus says prompt engineering sometimes works. The distinguishing variable is the SHAPE of the prompt, not its exhortation: asking for a distribution moves the model, asking it to "be creative" does not.
- TRAINING: the failure is a post-training artefact, not a fixed trait — DivPO, DDPO/DORPO and PM-RLHF each move it, and base models beat aligned models on originality. But no source measured the archival register.
