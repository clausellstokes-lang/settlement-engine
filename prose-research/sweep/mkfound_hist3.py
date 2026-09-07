import json,subprocess
subprocess.run(['python3','mkfound_hist2.py'],check=True)
d=json.load(open('found-ai-arch-historical-fact-measured.json'))
MAG="https://arxiv.org/pdf/2405.20362"
TOW="https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php"
H26="https://arxiv.org/pdf/2604.24690"
S_MAG="Varun Magesh, Faiz Surani, Matthew Dahl, Mirac Suzgun, Christopher D. Manning and Daniel E. Ho, 'Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools', arXiv 2405.20362 (2024)"
S_TOW="Klaudia Jazwinska and Aisvarya Chandrasekar, Tow Center for Digital Journalism, Columbia Journalism Review, 6 March 2025"
S_H26="Lirong Gao, Zeqing Wang, Yuyan Cai, Jiayi Deng, Yanmei Gu, Yiming Zhang, Jia Zhou, Yanfei Zhang and Junbo Zhao (Zhejiang University and Ant Group), 'Can LLMs Act as Historians? ProHist-Bench', arXiv 2604.24690v1, 27 April 2026"
R_PDF="PDF binary fetched with browser user agent, text extracted with pypdf"
R_CURL="live URL with browser user agent, HTML stripped to text"
new=[
 dict(feature="other: measured accuracy on archival summarisation",
  claim="Retrieval-grounded legal research tools from LexisNexis and Thomson Reuters hallucinated between 17 percent and 33 percent of the time.",
  source=S_MAG, url=MAG, quote="each hallucinate between 17% and 33% of the time", page="Abstract", kind="measurement", polarity="asserts",
  date="2024", routeHint=R_PDF, registerHint="dossier-archivist", confidence="high",
  modelEra="Lexis+ AI, Westlaw AI-Assisted Research, Ask Practical Law AI, compared with GPT-4; observed 2024; register measured: archival legal record with citations"),
 dict(feature="counter-evidence",
  claim="LexisNexis marketed Lexis+ AI as delivering 100 percent hallucination-free linked legal citations.",
  source="LexisNexis marketing statement (Wellen, 2024a) as quoted in Magesh et al., arXiv 2405.20362", url=MAG, quote="Lexis+ AI delivers 100% hallucination-free linked legal citations", page="footnote 2, p.3", kind="vendor", polarity="asserts",
  date="2024", routeHint=R_PDF, registerHint="none", confidence="high",
  modelEra="Lexis+ AI as marketed in 2024; register measured: archival legal record with citations"),
 dict(feature="counter-evidence",
  claim="The authors conclude that the legal AI providers' claims about hallucination elimination are overstated.",
  source=S_MAG, url=MAG, quote="the providers' claims are overstated", page="Abstract", kind="measurement", polarity="rejects",
  date="2024", routeHint=R_PDF, registerHint="none", confidence="high",
  modelEra="Lexis+ AI, Westlaw AI-Assisted Research, Ask Practical Law AI; observed 2024; register measured: archival legal record"),
 dict(feature="other: measured accuracy on archival summarisation",
  claim="Lexis+ AI, the highest performing system tested, answered 65 percent of the queries accurately.",
  source=S_MAG, url=MAG, quote="answering 65% of our queries accurately", page="Section 1, p.4", kind="measurement", polarity="asserts",
  date="2024", routeHint=R_PDF, registerHint="dossier-archivist", confidence="high",
  modelEra="Lexis+ AI, observed 2024; register measured: archival legal record with citations"),
 dict(feature="other: measured accuracy on archival summarisation",
  claim="Westlaw's AI-Assisted Research was accurate 42 percent of the time in the same evaluation.",
  source=S_MAG, url=MAG, quote="Westlaw's AI-Assisted Research is accurate 42% of the time", page="Section 1, p.4", kind="measurement", polarity="asserts",
  date="2024", routeHint=R_PDF, registerHint="dossier-archivist", confidence="high",
  modelEra="Westlaw AI-Assisted Research, observed 2024; register measured: archival legal record with citations"),
 dict(feature="other: measured factual accuracy on dated historical facts",
  claim="Asked to identify a source article's headline, publisher, publication date and URL from an excerpt, the eight tools answered more than 60 percent of queries incorrectly.",
  source=S_TOW, url=TOW, quote="they provided incorrect answers to more than 60 percent of queries", page="section 'Chatbots' responses to our queries were often confidently wrong'", kind="measurement", polarity="asserts",
  date="2025-03-06", routeHint=R_CURL, registerHint="dossier-archivist", confidence="high",
  modelEra="ChatGPT Search, Perplexity, Perplexity Pro, DeepSeek Search, Copilot, Grok-2, Grok-3 beta, Gemini; tested early 2025; register measured: news-archive retrieval and citation"),
 dict(feature="other: measured factual accuracy on dated historical facts",
  claim="Error rates in the Tow Center test ranged from 37 percent of queries answered incorrectly by Perplexity to 94 percent by Grok 3.",
  source=S_TOW, url=TOW, quote="with Perplexity answering 37 percent of the queries incorrectly", page="section 'Chatbots' responses to our queries were often confidently wrong'", kind="measurement", polarity="asserts",
  date="2025-03-06", routeHint=R_CURL, registerHint="dossier-archivist", confidence="high",
  modelEra="Perplexity and Grok 3, tested early 2025; register measured: news-archive retrieval and citation"),
 dict(feature="detection and its failures",
  claim="The Tow Center researchers found the tools presented inaccurate answers with alarming confidence, rarely using qualifying phrases or acknowledging gaps.",
  source=S_TOW, url=TOW, quote="presented inaccurate answers with alarming confidence", page="section 'Chatbots' responses to our queries were often confidently wrong'", kind="measurement", polarity="asserts",
  date="2025-03-06", routeHint=R_CURL, registerHint="dossier-archivist", confidence="high",
  modelEra="eight generative search tools, tested early 2025; register measured: news-archive retrieval and citation"),
 dict(feature="counter-evidence",
  claim="The Tow Center found that premium chatbots gave more confidently incorrect answers than their free counterparts.",
  source=S_TOW, url=TOW, quote="Premium chatbots provided more confidently incorrect answers than their free counterparts", page="'We found that...' summary list", kind="measurement", polarity="asserts",
  date="2025-03-06", routeHint=R_CURL, registerHint="none", confidence="high",
  modelEra="Perplexity Pro and Grok-3 beta versus free tiers, tested early 2025; register measured: news-archive retrieval and citation"),
 dict(feature="other: fabricated content in an archival summary",
  claim="More than half of the Gemini and Grok 3 responses cited fabricated or broken URLs that led to error pages.",
  source=S_TOW, url=TOW, quote="cited fabricated or broken URLs that led to error pages", page="section on fabricated URLs", kind="measurement", polarity="asserts",
  date="2025-03-06", routeHint=R_CURL, registerHint="dossier-archivist", confidence="high",
  modelEra="Gemini and Grok 3, tested early 2025; register measured: news-archive retrieval and citation"),
 dict(feature="register measured",
  claim="The Tow Center's task was explicitly archival: the tools were asked for an article's headline, original publisher, publication date and URL.",
  source=S_TOW, url=TOW, quote="headline, original publisher, publication date, and URL", page="Methodology", kind="measurement", polarity="applies",
  date="2025-03-06", routeHint=R_CURL, registerHint="dossier-archivist", confidence="high",
  modelEra="eight generative search tools, 1,600 queries, tested early 2025; register measured: news-archive retrieval and citation"),
 dict(feature="model era drift",
  claim="On the 2026 ProHist-Bench of professional historical research tasks the authors report that the tasks remain extremely difficult for all current models.",
  source=S_H26, url=H26, quote="remain extremely difficult for all current LLMs", page="Section 5.2 Main results", kind="measurement", polarity="asserts",
  date="2026-04-27", routeHint=R_PDF, registerHint="dossier-archivist", confidence="high",
  modelEra="18 models including Claude-Sonnet-4.5-Thinking, GPT-5.2, GPT-o3, Gemini-3-Pro-Preview, Qwen3-Max; observed 2026; register measured: professional historical research on the Chinese Imperial Examination"),
 dict(feature="other: measured factual accuracy on dated historical facts",
  claim="Top-performing models on ProHist-Bench reached Rubric Scores barely approaching 30 while most models scored below 15.",
  source=S_H26, url=H26, quote="RS scores barely approaching 30, while most LLMs score below 15", page="Section 5.2 Main results", kind="measurement", polarity="asserts",
  date="2026-04-27", routeHint=R_PDF, registerHint="dossier-archivist", confidence="high",
  modelEra="Gemini-3-Pro and Qwen3-235B named as top performers; 18 models evaluated 2026; register measured: professional historical research"),
 dict(feature="other: measured factual accuracy on dated historical facts",
  claim="Gemini-3-Pro-Preview recorded a Rubric Score of 26.71 on ProHist-Bench, the highest of the closed-source models listed.",
  source=S_H26, url=H26, quote="Gemini-3-Pro-Preview 1.94 6.27 73.97 26.71", page="Table 4, p.6", kind="measurement", polarity="asserts",
  date="2026-04-27", routeHint=R_PDF, registerHint="dossier-archivist", confidence="high",
  modelEra="Gemini-3-Pro-Preview, observed 2026; register measured: professional historical research"),
 dict(feature="model era drift",
  claim="GPT-5.2 recorded a Rubric Score of 11.07 on ProHist-Bench, below several smaller and open models on the same table.",
  source=S_H26, url=H26, quote="GPT-5.2 3.50 3.46 71.48 11.07", page="Table 4, p.6", kind="measurement", polarity="asserts",
  date="2026-04-27", routeHint=R_PDF, registerHint="dossier-archivist", confidence="high",
  modelEra="GPT-5.2, observed 2026; register measured: professional historical research"),
 dict(feature="register measured",
  claim="ProHist-Bench scores 400 expert-curated questions spanning eight dynasties against 10,891 fine-grained rubrics.",
  source=S_H26, url=H26, quote="10,891 fine-grained evaluation rubrics", page="Abstract", kind="measurement", polarity="applies",
  date="2026-04-27", routeHint=R_PDF, registerHint="dossier-archivist", confidence="high",
  modelEra="benchmark construction 2026, 18 models evaluated; register measured: professional historical research"),
 dict(feature="counter-evidence",
  claim="Qwen3-Max achieved the strongest overall Bonus Score performance on ProHist-Bench, ahead of the Western frontier models tested.",
  source=S_H26, url=H26, quote="Qwen3-Max achieves the strongest overall performance", page="Section 5.2 Main results", kind="measurement", polarity="asserts",
  date="2026-04-27", routeHint=R_PDF, registerHint="none", confidence="medium",
  modelEra="Qwen3-Max versus GPT-5.2, Gemini-3-Pro, Claude-Sonnet-4.5; observed 2026; register measured: professional historical research on a Chinese-history corpus, which plausibly favours Chinese-trained models. Medium: the paper reports the figure, the corpus-advantage reading is the finder's caveat"),
]
d['claims']+=new
d['sourcesRead']+=[
 dict(title="Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools", url=MAG, kind="measurement", substantive=True, date="2024", route="arXiv PDF binary, pypdf"),
 dict(title="AI Search Has a Citation Problem (Tow Center, Columbia Journalism Review)", url=TOW, kind="measurement", substantive=True, date="2025-03-06", route="live URL, browser user agent"),
 dict(title="Can LLMs Act as Historians? Evaluating Historical Research Capabilities of LLMs via the Chinese Imperial Examination (ProHist-Bench)", url=H26, kind="measurement", substantive=True, date="2026-04-27", route="arXiv PDF binary, pypdf"),
 dict(title="OpenReview forum for HiST-LLM (peer reviews) - BLOCKED", url="https://openreview.net/forum?id=xlKeMuyoZ5", kind="analysis", substantive=False, date="2024", route="api2.openreview.net and api.openreview.net both returned 403 ChallengeRequiredError; no claim drawn"),
 dict(title="ABC News article on the ASIC AI trial - NOT FOUND", url="https://www.abc.net.au/news/", kind="reception", substantive=False, date="", route="Wayback CDX wildcard over abc.net.au for Aug-Dec 2024 filtered on asic/summaris returned no rows; site-restricted search surfaced no such article; the story appears to have been broken by Crikey, not the ABC"),
]
d['complete']=True
d['coverage']=("Named roster: HiST-LLM NeurIPS 2024 primary FETCHED (proceedings PDF, pypdf); the ASIC PRIMARY FETCHED as instructed rather than the paywalled Crikey headline "
 "(aph.gov.au DocumentStore PDF, 40pp, carrying the Hansard extract and the full AWS draft report); the January 2025 reporting FETCHED twice (CSH release and TechCrunch, both curled raw after WebFetch returned a summary); "
 "the ABC article NOT FOUND (Wayback CDX wildcard over abc.net.au for Aug-Dec 2024 and a site-restricted search both returned nothing - the story appears to have been broken by Crikey, not the ABC). "
 "OpenReview peer reviews BLOCKED (403 challenge on both API hosts). Substantive sources by route: 2 from the named roster primaries, 3 from named-roster reporting, "
 "6 from lateral search filling the angle's archival/encyclopedic-register gap (BBC Feb 2025, BBC-EBU Oct 2025, Dahl et al. legal hallucinations, OpenAI SimpleQA, Magesh et al. legal RAG tools, Tow Center AI search citation) "
 "and 1 from a 2026 follow-up search (ProHist-Bench, frontier 2026 models). Cited-by route was DRY: OpenAlex records zero citations for HiST-LLM. 12 substantive sources; two consecutive final searches surfaced only ProHist-Bench, then nothing new.")
json.dump(d, open('found-ai-arch-historical-fact-measured.json','w'), indent=1)
print("claims",len(d['claims']),"sources",len(d['sourcesRead']),"substantive",sum(1 for s in d['sourcesRead'] if s['substantive']))
