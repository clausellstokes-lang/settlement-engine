# -*- coding: utf-8 -*-
VS = "https://arxiv.org/abs/2510.01171"
DE = "https://arxiv.org/abs/2509.18880"
AS = "https://arxiv.org/abs/2506.05387"
R = "arXiv PDF binary -> pdftotext -layout"

S_VS = "Jiayi Zhang, Simon Yu, Derek Chong, Anthony Sicilia, Michael R. Tomz, Christopher D. Manning and Weiyan Shi, 'Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity', arXiv v4, 15 Jul 2026"
S_DE = "Advik Raj Basani and Pin-Yu Chen, 'Diversity Boosts AI-Generated Text Detection' (DivEye), Transactions on Machine Learning Research, February 2026 (arXiv v3, 25 Feb 2026)"

batch4 = [
# ---- Verbalized Sampling ----
dict(feature="other: mechanism of blandness",
 claim="Zhang and colleagues identify typicality bias in human preference data, the annotator's systematic preference for familiar text, as a data-level driver of mode collapse.",
 source=S_VS, url=VS, quote="typicality bias in preference data", page="Abstract",
 kind="analysis", polarity="asserts", date="2026-07-15 (v4); first posted Oct 2025", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-4.1, GPT-4.1-mini, Gemini 2.5 Pro and Flash, DeepSeek-R1, Tulu-70B and Llama-3.1-8B, 2025-2026; registers measured: poems, stories, jokes, dialogue simulation and synthetic data. THE DEEPEST MECHANISM CLAIM IN THIS ROSTER: the flattening is inherited from what human raters preferred, so no sampler can undo it."),

dict(feature="steerability",
 claim="Zhang and colleagues report that their prompting strategy is orthogonal to the decoding strategy and can be layered on top of top-p and min-p.",
 source=S_VS, url=VS, quote="it is orthogonal to the decoding strategy", page="Appendix F.3, Ablation on Decoding Strategies",
 kind="measurement", polarity="asserts", date="2026-07-15 (v4)", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-4.1 and Gemini-2.5 class models with temperature, top-p and min-p ablations, 2025-2026; registers measured: creative writing tasks. The decoding knob and the prompt knob are separate levers, and the prompt one moved diversity further."),

dict(feature="steerability",
 claim="Zhang and colleagues measured a 1.6 to 2.1 times increase in creative-writing diversity from Verbalized Sampling over direct prompting.",
 source=S_VS, url=VS, quote="VS increases diversity by 1.6-2.1", page="Abstract",
 kind="measurement", polarity="asserts", date="2026-07-15 (v4)", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="GPT-4.1, GPT-4.1-mini, Gemini-2.5-Pro and Flash, DeepSeek-R1, 2025-2026; registers measured: poem, story and joke generation, not archival prose."),

dict(feature="reader and expert judgment",
 claim="In Zhang and colleagues' Prolific study of 90 annotators, Verbalized Sampling scored 3.06 for story diversity on a four-point scale against 2.74 for direct prompting.",
 source=S_VS, url=VS, quote="", page="Table 2 (Human-rated diversity, row Story, columns Direct and VS-Standard)",
 kind="measurement", polarity="asserts", date="2026-07-15 (v4)", routeHint=R, registerHint="chronicle-line",
 confidence="high",
 modelEra="90 annotators, 30 per task, 90 output pairs per task, four-point Likert, inter-annotator agreement 0.49 to 0.87, 2025-2026; register measured: prompted short fiction, poems and jokes."),

dict(feature="model era drift",
 claim="Zhang and colleagues confirmed that post-training reduces output diversity at every stage they tested, supervised fine-tuning, RLHF and RLVR.",
 source=S_VS, url=VS, quote="post-training reduces output di", page="section 5.1, Ablation on Training Stages (the quotation breaks at a line-wrapped hyphen; the word completed is 'diversity')",
 kind="measurement", polarity="asserts", date="2026-07-15 (v4)", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="Tulu-70B across its post-training stages, base-model diversity 45.4 percent, 2025-2026; register measured: creative writing prompts."),

# ---- DivEye: the modern burstiness measurement ----
dict(feature="uniform rhythm (low burstiness)",
 claim="Basani and Chen state that human-authored text shows richer variability in lexical and structural unpredictability than language-model output.",
 source=S_DE, url=DE, quote="human-authored text exhibits richer variability in lexical", page="Abstract",
 kind="measurement", polarity="asserts", date="2026-02-25 (v3); TMLR Feb 2026", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="detection across the RAID and MAGE benchmarks, 8 domains and 12 generator models including GPT-J-6B, surprisal scored with GPT-2 as evaluator, February 2026; registers measured: reviews, news, essays, stories and more across the benchmark testbeds."),

dict(feature="uniform rhythm (low burstiness)",
 claim="Basani and Chen argue that likelihood-maximising models approximate the uniform information density optimum too strictly and so produce unnaturally flat probability curves.",
 source=S_DE, url=DE, quote="resulting in unnaturally flat probability curves devoid of these organic", page="section 3.1",
 kind="analysis", polarity="asserts", date="2026-02-25 (v3); TMLR Feb 2026", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="argument offered February 2026 about likelihood-trained models generally, crediting Holtzman and colleagues 2020 for the observation and Altmann and colleagues 2009 for human burstiness."),

dict(feature="uniform rhythm (low burstiness)",
 claim="Basani and Chen measured that second-order surprisal features contributed 39.4 percent of their detector's feature importance, more than the distributional moments or the first-order differences.",
 source=S_DE, url=DE, quote="second-order features contribute the most (39.4%)", page="section 5, Relevance of DivEye's Features",
 kind="measurement", polarity="asserts", date="2026-02-25 (v3); TMLR Feb 2026", routeHint=R, registerHint="none",
 confidence="high",
 modelEra="XGBoost feature importances over RAID and MAGE, February 2026; distributional features 34.2 percent, first-order differences 23.7 percent. THE SHARPEST FORM OF THE METRONOME CLAIM: it is not the average surprisal that separates human from machine but how the surprisal accelerates and decelerates."),

dict(feature="detection and its failures",
 claim="Basani and Chen report that DivEye outperformed existing zero-shot detectors by up to 33.2 percent.",
 source=S_DE, url=DE, quote="pointing to rhythmic unpredictability as a powerful and", page="Abstract",
 kind="measurement", polarity="asserts", date="2026-02-25 (v3); TMLR Feb 2026", routeHint=R, registerHint="none",
 confidence="medium",
 modelEra="RAID and MAGE benchmarks aggregated over 8 domains, 12 models, 4 decoding strategies, February 2026. Confidence medium because the quoted fragment carries the framing rather than the 33.2 percent figure, which is stated in the preceding sentence of the same abstract."),
]

sources4 = [
 dict(title="Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity (Zhang, Yu, Chong, Sicilia, Tomz, Manning, Shi)", url=VS, kind="measurement", substantive=True, date="2026-07-15 (v4)", route=R),
 dict(title="Diversity Boosts AI-Generated Text Detection / DivEye (Basani, Chen; TMLR 2026)", url=DE, kind="measurement", substantive=True, date="2026-02-25 (v3)", route=R),
 dict(title="Advancing Decoding Strategies: Enhancements in Locally Typical Sampling for LLMs (Sen, Sengupta, Dasgupta)", url=AS, kind="analysis", substantive=False, date="2025-06-05", route=R),
]
