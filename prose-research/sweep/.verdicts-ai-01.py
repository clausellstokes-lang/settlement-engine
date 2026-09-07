import json, io

src = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/ai-01.json"
out = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-ai-chunk-01.json"

with io.open(src, encoding="utf-8") as f:
    chunk = json.load(f)

verdicts = [
 {"index":90,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"Claude does not use its preceding sentences to justify the claim",
  "note":"Fetched LessWrong post (sudo, 12 Apr 2026). Quote appears word for word inside: 'However, Claude does not use its preceding sentences to justify the claim by either evidence or analogy.' Claim's substance is reinforced by the adjacent sentence 'Claude's output is seven sentences, none of which justify any other.'"},
 {"index":91,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"No grain: no proper nouns, no specific months, no brand names",
  "note":"Quote is verbatim but TRUNCATED: the source sentence continues '...no dialect, no idiosyncratic rhythm.' The claim's 'regional dialect markers' element rests on that cut tail, so quote and claim should be re-joined if cited. Page also carries 'The missing concrete particular: No Tuesday. No laundromat.'"},
 {"index":92,"verdict":"VERIFIED_SUBSTANCE",
  "trueWording":"Observations don't accumulate meaning across a manuscript",
  "note":"Claim carried no quote field, so verified on substance only. Both halves land: (a) 'The observations don't accumulate meaning across a manuscript the way they do when a human being has been sitting with the material for months'; (b) 'AI would have described grief. Buttercup shows a man who cannot stop moving...' — describing versus showing, exactly as claimed."},
 {"index":93,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"it will fail to have the emotion linked to it",
  "note":"Quote is word for word (source lowercases 'it' mid-sentence): 'AI can often get cause and effect, but it will repeat the same cause and effect over and over again OR it will fail to have the emotion linked to it.' Shallow POV element is supported by 'it tends to avoid deep point of view'; the sensory-detail element is supported only indirectly, via the worked deep-POV rewrite ('broken asphalt', 'flat wall') rather than a stated rule."},
 {"index":94,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"that average is equivalent to the least interesting choices possible",
  "note":"ATTRIBUTION DEFECT. Quote is word for word on the LitReactor page, but the page presents it as Ted Chiang's, quoted from The New Yorker — not Nick Bailey's own wording: 'As Ted Chiang from The New Yorker puts it: \"AI has to fill in the choices you are not making... that average is equivalent to the least interesting choices possible.\"' Cite Chiang (via LitReactor), not Bailey."},
 {"index":95,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"art is something that results from making a lot of choices",
  "note":"ATTRIBUTION DEFECT, same shape as index 94. Quote is word for word (source lowercases 'art') but it is Ted Chiang's line quoted inside Lincoln Michel's essay, not Michel's. The one-choice-per-word figure is also Chiang's: 'a ten-thousand-word short story requires something on the order of ten thousand choices... a hundred-word prompt, you have made on the order of a hundred choices.' Michel's own supporting wording is 'It produces automatically, without intention.'"},
 {"index":96,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"AI-generated stories cluster in a shared region of narrative space",
  "note":"Quote is verbatim in the arXiv abstract (Russell, Rajendhran, Pham, Iyyer, Wieting; submitted 3 Apr 2026, v6 10 Aug 2026). The numeric tail is NOT in the abstract, so I fetched the full HTML, where it is confirmed: 'Humans reference specific texts and authors at nearly double the AI rate (47% vs. 24%)' and 'Human stories draw from a broader narrative repertoire: they span more locations, carry more dialogue relative to narration...'. Every element of the claim stands. Note the corpus is five LLMs over 10,272 prompts, 61,608 stories."},
 {"index":97,"verdict":"CONTRADICTED",
  "trueWording":"a generator with a detailed brief produces a consistent voice",
  "note":"MIXED, and the middle element is reversed. Verbatim support for two parts: 'AI is excellent at volume and consistency and weak at the specific, surprising sentence that makes a moment land' and 'It will happily generate a competent, forgettable version of every conversation if that is all you ask for.' But the whole-cast-sounds-like-one-person element is a misread: the source names it a HUMAN failure that AI is meant to fix — 'A whole cast that sounds like one person because one person wrote all of it at midnight. AI dialogue generators promise to fix the speed problem.' A targeted re-fetch found no sentence anywhere on the page attributing voice sameness to AI; the page says the opposite, that a well-briefed generator 'produces a consistent voice.' Drop the cast element or re-source it; the other two survive."},
 {"index":98,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"Pacing flatness: scenes unfold at a constant rate",
  "note":"Quote word for word: 'Pacing flatness: scenes unfold at a constant rate. No elision, no selective summary.' The sentence-length half is separately supported and is sharper than the claim states: 'Uniform sentence length (low burstiness)... LLM prose tends toward a metronomic 14-22-word median with small variance.'"},
 {"index":99,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"lacks emotional valence and could lull the reader to sleep",
  "note":"Quote word for word: 'This AI \"accent\" creates text that lacks emotional valence and could lull the reader to sleep.' One wording drift in the claim: Bernoff writes 'A boring, even tone' and 'AI text tends to be predictable' — he says even TONE, not even rhythm. Say tone if quoting him on this."},
 {"index":100,"verdict":"VERIFIED_SUBSTANCE",
  "trueWording":"A novice author wouldn't repeatedly go for these sentence patterns",
  "note":"NOT verbatim. The page's nearest wording is 'A new writer usually doesn't repeat the same sentence shapes again and again, or lean on the same kind of clunky repetition' — and that line sits inside an italicised block Makin presents as MODEL OUTPUT imitating the tell, not as his own assertion. His own-voice equivalent is the trueWording given, from the parody passage above it. Substance holds either way; the supplied quote does not."},
 {"index":101,"verdict":"VERIFIED_SUBSTANCE",
  "trueWording":"Alternating loquacious ponderous similes and tiny sentences made out of cliches",
  "note":"NOT verbatim. Page reads 'The writing kept swinging between two modes: long, heavy comparisons, then short lines that sounded like stock phrases' (again inside the model-output demo block); Makin's own-voice line is the trueWording given. The cliche-well half IS nearly verbatim and is his own voice: 'Once your story has reached a local minimum of samey cliches, it won't stop going to the same well,' against 'even bad ones will \"give it a rest\" when they notice.'"},
 {"index":102,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"the rhythm is becoming recognizable as an AI pattern",
  "note":"QUOTE SPLICE. The quotation is word for word, but it belongs to a DIFFERENT tell: it closes the 'COMMA + LIKE or + AS IF' section and describes that construction's rhythm, not fragments or em-dashes. The claim's two structural elements are nonetheless supported elsewhere on the page: 'each sentence fragment is its own paragraph... Often these come at an end of a scene, right before a \"hook\" to read more' and, for em-dashes, 'There's one in every paragraph.' Do not attach this quote to the fragment/em-dash sentence."},
 {"index":103,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"He published this. Openly. In a book. As a priest.",
  "note":"Quote is verbatim but truncated — the directory's example runs on to 'As a priest.' Claim itself is squarely supported by the entry: 'Excessive use of very short sentences or sentence fragments as standalone paragraphs for MANUFACTURED EMPHASIS... It's an inhuman style and no real person writes first drafts this way because it doesn't match how humans think or speak.' Source is undated and self-published; treat as illustrative, not evidentiary."},
 {"index":104,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"AI rhythm is the mechanical, metronomic quality of text",
  "note":"Quote verbatim but truncated ('...of text generated by language models'). Figures confirmed on the page: 'GPT-4o generates approximately 85% of its sentences in the 15-28 word range' and 'Human prose, by contrast, typically spans from 4 to 55+ words without clustering around a central point.' The Gemini element is looser than the claim states: the page says 'Gemini Pro demonstrates paragraph-level rhythm... maintaining 4-5 sentences per paragraph consistently' — a sentence COUNT, not 'nearly identical length.' Vendor blog (TextSight, by its own founder/CEO), no method or sample disclosed; the unreplicated-vendor caveat in the claim is warranted and must survive."}
]

assert [v["index"] for v in verdicts] == chunk["indices"], "index mismatch"

payload = {"name": "ai", "chunk": 1, "claims": chunk["claims"], "verdicts": verdicts}
with io.open(out, "w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False, indent=1)
    f.write("\n")

print("wrote", out)
print("claims:", len(payload["claims"]), "verdicts:", len(payload["verdicts"]))
from collections import Counter
print(Counter(v["verdict"] for v in verdicts))
