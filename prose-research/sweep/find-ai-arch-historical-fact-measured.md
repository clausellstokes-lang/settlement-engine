# find-ai-arch-historical-fact-measured — raw notes
Started 2026-09-06. Angle: HISTORICAL FACT UNDER MEASUREMENT.
Roster: (1) HiST-LLM/Seshat NeurIPS 2024 D&B paper; (2) Jan 2025 reporting GPT-4 Turbo ~46%; (3) ASIC summarisation trial PRIMARY = Senate QoN answer on aph.gov.au; (4) ABC article via Wayback id_ capture.


## ROSTER STATUS
1. HiST-LLM NeurIPS 2024 D&B — FETCHED RAW (PDF binary -> pypdf text). proceedings.neurips.cc .../38cc5cba8e513547b96bc326e25610dc-Paper-Datasets_and_Benchmarks_Track.pdf
   - Table 1: 4-choice balanced acc: Gemini-1.5-flash 39.0; GPT-3.5-turbo 35.6; GPT-4-turbo 46.0 [45.5,46.5]; GPT-4o 44.7; Llama-3-70B 39.5; Llama-3.1-70B 40.8; Llama-3.1-8B 33.6. 2-choice: GPT-4o best 63.2.
   - Random = 25% (4-choice). Adjusted balanced acc GPT-4-turbo 28.0 (4-choice).
   - Table 2 TIME: GPT-4-turbo 55.3 at 8k-6k BCE -> 38.7 at 1.5k-2k CE. Llama-3-70B 55.8 -> 35.0 (in text).
   - Table 3 REGION: worst Oceania (GPT-4-turbo 38.0), Sub-Sah Africa 42.6; best Latin America 49.2 (GPT-4-turbo), GPT-4o 49.4 LatAm.
   - Table 4 CATEGORY: GPT-4-turbo Legal System 50.1, Institutions 47.6, Economy 39.4 (worst).
   - Dataset: 383 variables, 36,000 data points, >600 polities, >2,700 references. "evidenced" vs "inferred" is TESTED explicitly.
   - "lower bound on historical knowledge performance".
2. ASIC Senate QoN — FETCHED RAW PRIMARY. aph.gov.au/DocumentStore.ashx?id=b4fd6043-6626-4cbe-b8ee-a5c7319e94a0 (40pp PDF, includes full AWS draft report 21 May 2024).
   - Human 61/75 = 81%; Gen AI 35/75 = 47%. Llama2-70B. PoC 15 Jan - 16 Feb 2024.
   - Criteria table: Coherency/Consistency AI 10 vs human 12; References to ASIC 5 v 15; conflicts-of-interest recs 5 v 8; more-regulation refs 6 v 11; Length 9 v 15.
   - By submission: IPA 6v15, KPMG 8v9, ATO 8v15, Dr Kelli Larson 5v10, Australia Institute 8v12.
   - Hansard: Longo "bland summary" ... "It wasn't misleading but it was bland."; Jefferson "summaries were quite generic".
   - Themes: nuance/context missed; incorrect info added; missed central point; "Made strange choices about what to highlight."; minor recommendation given opening prominence; waffly/wordy; repetitive; lacked formatting; assessors had to refer back to source.
   - Discussion: "read between the lines"; low repeatability of outputs; hallucinations "grammatically correct, but on occasion factually inaccurate".

## EXPANSION (lateral, filling the archival/encyclopedic-register gap)
- BBC 'Representation of BBC News content in AI Assistants' (Feb 2025, tested 5-6 Dec 2024, ChatGPT Enterprise GPT-4o/Copilot Pro/Gemini/Perplexity Pro; 45 journalists, 362 responses): 51% significant issues, 91% some issues, 19% factual errors where BBC cited, 13% of quotes altered/absent.
- BBC-EBU 'News Integrity in AI Assistants' (Oct 2025, responses May/June 2025, free tiers): 45% significant, sourcing 31%, accuracy 20%, context 14%; Gemini 76% significant / 72% sourcing; BBC-to-BBC 51% -> 37%.
- Dahl et al. 'Large Legal Fictions' (JLA, arXiv v2 21 Jun 2024): 58% (ChatGPT 4) to 88% (Llama 2) hallucination on federal cases; NON-LINEAR by case year (worst oldest AND newest, best Warren Court 1953-69); better on NEWER cases -- OPPOSITE temporal direction to HiST-LLM (which is better on EARLIER periods). Recorded as a juxtaposition, confidence medium.
- OpenAI SimpleQA (arXiv 2411.04368, 7 Nov 2024): GPT-4o 38.2% correct, o1-preview 42.7%; History n=173 of 4,326; models "consistently overstate their confidence".
- Magesh et al. 'Hallucination-Free?' (arXiv 2405.20362): RAG legal tools 17-33% hallucination; Lexis+ AI 65% accurate, Westlaw 42%; VENDOR claim "100% hallucination-free" vs measurement.
- Tow Center / CJR (6 Mar 2025): 1,600 queries, 8 tools, asked for headline/publisher/PUBLICATION DATE/URL; >60% incorrect; Perplexity 37%, Grok 3 94%; "presented inaccurate answers with alarming confidence"; premium worse than free; Gemini/Grok 3 >half fabricated or broken URLs.
- ProHist-Bench (arXiv 2604.24690v1, 27 Apr 2026, 18 models incl. GPT-5.2, Gemini-3-Pro-Preview, Claude-Sonnet-4.5-Thinking, Qwen3-Max): RS barely approaching 30 for the best, most below 15; Gemini-3-Pro-Preview RS 26.71, GPT-5.2 RS 11.07. FRONTIER 2026 EVIDENCE.

## NOT FOUND / BLOCKED
- ABC article: NOT FOUND. Wayback CDX wildcard over abc.net.au (Aug-Dec 2024) filtered on asic/summaris = no rows; site-restricted search = nothing. Story appears to have been broken by Crikey, not the ABC.
- OpenReview peer reviews for HiST-LLM: BLOCKED, 403 ChallengeRequiredError on both api.openreview.net and api2.openreview.net.
- Cited-by route DRY: OpenAlex records 0 citations for HiST-LLM (two records, W7113284946 and W4415798354).

## FINAL: 69 claims, 12 substantive sources. 68 quotes verified verbatim against fetched text, 1 deliberately blank, 0 overlong.
