# -*- coding: utf-8 -*-
import json, os
SW = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
src = os.path.join(SW, "chunks", "ai-03.json")
chunk = json.load(open(src, encoding="utf-8"))
claims = chunk["claims"]
assert [c["index"] for c in claims] == list(range(240, 254)), [c["index"] for c in claims]

V = [
 (240, "VERIFIED_SUBSTANCE",
  "a False Positive Value of 5.04%",
  "Quote field is empty, so no verbatim string to match. Page confirms every figure: '91 TOEFL essays that were taken from a student forum'; 'The second flaw is the comparison against 8th-grade US essays'; 'The Stanford case study was based on version 1.1 of Originality.AI'; 'over 1,500 essay samples collected from Kaggle and other sources' (IELTS-Writing-Scored-Essays-Dataset plus IELTS PDFs); '1,526 as human-written and incorrectly labeled only 81 as AI-generated. This shows a True Negative Value of 94.96% and a False Positive Value of 5.04%'. Vendor stake is self-evident (Originality.AI's own blog)."),
 (241, "VERIFIED_SUBSTANCE",
  "it was 'impossible to reliably detect all AI-written text'",
  "Near-verbatim but not word for word: the claim's quote reads 'It is impossible...', the page reads 'At launch, OpenAI warned that it was \"impossible to reliably detect all AI-written text\"'. Substance fully supported: announced 2023-01-31, discontinued 2023-07-20 ('no longer available due to its low rate of accuracy'), under six months."),
 (242, "VERIFIED_VERBATIM",
  "Selections from The Bible also show up as AI-generated.",
  "Quote appears word for word. Constitution half also confirmed, with Edward Tian's training-data explanation: 'The US Constitution is a text fed repeatedly into the training data of many large language models.'"),
 (243, "VERIFIED_VERBATIM",
  "AI detection is already a very difficult task ... (if it is even possible)",
  "Quote 'if it is even possible' appears word for word. Supporting figures verbatim on page: '1% false positive rate'; 'Vanderbilt submitted 75,000 papers to Turnitin in 2022. If this AI detection tool was available then, around 750 student papers could have been incorrectly labeled'; plus 'more likely to label text written by non-native English speakers as AI-written'."),
 (244, "VERIFIED_VERBATIM",
  "our recursive paraphrasing method can significantly reduce detection rates",
  "Quote appears word for word in the abstract, as do watermarking, neural network-based detectors, zero shot classifiers, retrieval-based detectors, and spoofing 'aimed at misclassifying human-written text as AI-generated'. Caveat: the current abstract states the theory only as 'a theoretical framework connecting the AUROC of the best possible detector to the Total Variation distance between human and AI text distributions' — the claim's gloss 'degrades toward random as distributions approach human ones' is the paper's result but is not spelled out in the abstract text now on the page."),
 (245, "VERIFIED_VERBATIM",
  "we found that 94% of our AI submissions were undetected",
  "Quote appears word for word. Grade claim also confirmed verbatim: 'grades awarded to our AI submissions were on average half a grade boundary higher than that achieved by real students'. Design matches: GPT-4 answers submitted unmodified into five real undergraduate psychology modules, markers blind."),
 (246, "VERIFIED_VERBATIM",
  "text perceived as \"more human than human\"",
  "Quote appears word for word in the abstract, together with 'In six experiments, participants (N = 4,600) were unable to detect self-presentations', the flawed heuristics 'associating first-person pronouns, use of contractions, or family topics with human-written language', and their being 'predictable and manipulable'."),
 (247, "VERIFIED_VERBATIM",
  "the often contradictory reasons evaluators gave for their judgments",
  "Quote appears word for word. Abstract also gives 'three domains (stories, news articles, and recipes)', 'without training, evaluators distinguished between GPT3- and human-authored text at random chance level', and 'evaluators' accuracy improved up to 55%'."),
 (248, "VERIFIED_SUBSTANCE",
  "made the most errors precisely when feeling most confident",
  "Not word for word: the claim quotes 'make the most errors precisely when they feel most confident'; the page reads 'participants made the most errors precisely when feeling most confident', and section 3.2.2 reads 'made the most errors precisely when they were most certain (even below the chance level of 0.5)'. Substance fully supported, including the below-chance-at-peak-confidence parenthetical, 254 Czech native speakers, 55.4% no-feedback accuracy, and the expectations that AI text is 'static, cohesive, and prepared' like 'administrative or scientific texts' while 'more readable texts are typically human-authored'."),
 (249, "VERIFIED_VERBATIM",
  "misclassifies only 1 of 300 articles",
  "Quote appears word for word: 'the majority vote among five such \"expert\" annotators misclassifies only 1 of 300 articles'. Also confirmed: robustness 'even in the presence of evasion tactics like paraphrasing and humanization', and reliance on 'specific lexical clues (\"AI vocabulary\")' plus 'formality, originality, clarity'. The claim's 'not punctuation counts' is the researcher's own contrast, not a source statement; the paper simply never cites punctuation."),
 (250, "VERIFIED_VERBATIM",
  "most of the 696 participants slightly preferring the imitation to the real thing",
  "Quote appears word for word. Ten poets (Chaucer to Dorothea Lasky) and the explanation confirmed: AI 'sand[ed] off the more challenging elements - ambiguity, wordplay, linguistic complexity', with inexperienced readers complaining human poems \"don't make sense\"."),
 (251, "VERIFIED_VERBATIM",
  "human poets are expected to innovate on style",
  "Quote appears word for word. The 87.8% figure is confirmed as a formal-features rule: 'a poem was written by ChatGPT if it is either a Shakesperian sonnet, a single couplet, or consists of four-stanza verses and follows an AABB or ABAB rhyme scheme will have an accuracy of 87.8%'. Comprehensibility-scoring point supported by the 144-vs-29 'doesn't make sense' explanation count."),
 (252, "VERIFIED_VERBATIM",
  "judged to be up to 26.6% better written, up to 22.6%, more enjoyable",
  "Quote 'up to 26.6% better written' appears word for word, in the sentence about less creative writers ('Less creative writers conversely saw a greater increase in creativity'). Homogenization figure confirmed: 'a 10.7% increase in similarity between writers whose stories used one generative AI-idea'."),
 (253, "VERIFIED_VERBATIM",
  "LLM-generated stories pass 3-10X less TTCW tests than stories written by professionals",
  "Quote appears word for word. Abstract confirms 'TTCW consists of 14 binary tests', 'We recruit 10 creative writers', and 'none of the LLMs positively correlate with the expert assessments'. Caveat: the dimensional gloss is only half supported - the paper states 'all models achieve their highest pass rate on the Fluency dimension' and Table 5 puts Originality lowest, but it does not single out Elaboration as a deficit (Elaboration tracks Flexibility), and it frames the gap as broad rather than concentrated."),
]

assert len(V) == 14
verdicts = [{"index": i, "verdict": v, "trueWording": t, "note": n} for (i, v, t, n) in V]
assert [x["index"] for x in verdicts] == [c["index"] for c in claims]

out = {
  "name": "ai",
  "chunk": 9,
  "sourceChunkFile": src,
  "sourceChunkNote": "Task named chunks/ai-09.json, which does not exist (chunks/ dir holds ai-00..ai-03 only). chunk-manifests.json places indices 240-253 in ai-03.json (chunk 3), and 14 claims matches this checkpoint's i240-253 filename. Claims below are copied verbatim from that file.",
  "claims": claims,
  "verdicts": verdicts,
}
dst = os.path.join(SW, "verdicts-ai-i240-253.json")
json.dump(out, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("WROTE", dst, os.path.getsize(dst), "bytes")
chk = json.load(open(dst, encoding="utf-8"))
print("claims", len(chk["claims"]), "verdicts", len(chk["verdicts"]))
from collections import Counter
print(Counter(v["verdict"] for v in chk["verdicts"]))
