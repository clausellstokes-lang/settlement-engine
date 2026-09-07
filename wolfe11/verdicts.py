import json, os
src="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/wolfe-11.json"
out="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-wolfe-i165-179.json"
chunk=json.load(open(src))
V=[
 {"index":165,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"The novels are too dense with the details of history",
  "note":"Raw PDF fetched from gwern.net and text-extracted (pypdf). Printed p. 29: 'His hopelessness and death wish could be interpreted as the state of mankind before the Incarnation... But Wolfe cannot be accused of such straightforward allegory. The novels are too dense with the details of history.' Quote verbatim; the allegory limb and the Soldier/Latro referent are both explicit in the surrounding sentences."},
 {"index":166,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"lacks the unifying force of a first-person narrator",
  "note":"Raw PDF, printed p. 30: 'Another, Castleview (1990), projects the legendary figures of the Grail saga into a Chicago suburb with more success, although it, too, lacks the unifying force of a first-person narrator and threatens to collapse under the weight of its too-large cast.' Quote verbatim; 'weakened' is carried by 'threatens to collapse'. Farrell does grant Castleview 'more success' than There Are Doors, which the claim does not mention but does not deny."},
 {"index":167,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"without coherent geography, population or time scale",
  "note":"Raw PDF (ProQuest scan of Foundation, Fall 1989), printed p. 78: 'The parallel world that he visits is not only curiously deficient in infrastructure... Incoherent adventures are sketched on a recalcitrantly blurred, unseizable dream landscape, without coherent geography, population or time scale.' Quote verbatim; the alternate-world referent is the 'parallel world' of There Are Doors named two sentences earlier."},
 {"index":168,"verdict":"PARTIAL",
  "unsupportedLimb":"that the groping is caused by Wolfe's *withholding*, and that it displaces inference — Jones attributes it to an incoherent, blurred dream landscape and 'oneiric confusion', and never contrasts it with reader inference",
  "trueWording":"The reader is left groping without guidance",
  "note":"Quote verbatim on printed p. 78: 'The reader is left groping without guidance in an oneiric confusion that's often barely distinguishable from malice at the printers.' But the page's diagnosis is incoherence/blur (deficient infrastructure, no coherent geography), not deliberate withholding, and Jones offers no inference-versus-groping contrast. She also writes 'The reader', not a first-person report of her own groping."},
 {"index":169,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"a man has died and he is haunting his own mind",
  "note":"Raw PDF of the Liverpool UP chapter (Shadows of the New Sun ch. 3, pp. 36-43), printed p. 41: 'The basic idea is that a man has died and he is haunting his own mind, his own past.' plus 'In Peace that ghost prowls through his memories throughout the book.' Quote verbatim and premise limb exact. Wolfe says 'a man' rather than naming him the narrator; Peace's first-person narration makes that identification, not the page's wording."},
 {"index":170,"verdict":"PARTIAL",
  "unsupportedLimb":"'signals it only through its opening sentence' — Wolfe cites the opening line AND the closing chapters (Eleanor Bold asking to plant an elm on his grave, plus the tree-on-a-grave legend) as the signals",
  "trueWording":"This is something very few people seem to understand about Peace",
  "note":"Quote verbatim on printed p. 41. The 'very few readers grasp it' limb is exact. The exclusivity limb fails: immediately after the quoted sentence Wolfe adduces both the opening line ('The elm tree planted by Eleanor Bold, the judge's daughter, fell last night.') and the closing chapters, so the novel signals the fact in at least two places, not only the opening sentence."},
 {"index":171,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"I had all four volumes in second draft",
  "note":"Raw PDF, printed p. 43: 'You see, before I marketed The Shadow of the Torturer, I had all four volumes in second draft because I didn't want to get in a situation where the first volume was set and then I couldn't make changes...' Quote verbatim; 'before he offered the first for sale' = 'before I marketed The Shadow of the Torturer' (volume one)."},
 {"index":172,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"I've been tending to be too verbal, too cerebral",
  "note":"Quote verbatim, inside Wolfe's answer to 'how the Torturer series came into being': 'At the other end of the scale, at that time I was beginning to be worried about the idea that my work was insufficiently visual ... I've been tending to be too verbal, too cerebral ...' All limbs supported (worry, Torturer books' genesis, both adjectives). Citation nit only: by the OUP page markers in this PDF the passage sits on printed p. 39, not the claim's p. 40."},
 {"index":173,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"an organising principle of form, a means of confounding interpretation",
  "note":"Live page fetched raw (HTTP 200, browser UA) and de-tagged. Opening paragraph: 'ambiguity is the watchword to the text. More significantly, it is also an organising principle of form, a means of confounding interpretation, and a fundamental theme...'. Quote verbatim; 'not decoration but' is the claim's own rendering of Wright's 'More significantly, it is also', which the page supports rather than states."},
 {"index":174,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"the puzzle is where the political arguments can be found",
  "note":"Verbatim: 'even at this stage it is important to understand that the existence of the puzzle is more significant that its solution, since the puzzle is where the political arguments of the novel can be found.' Both limbs supported. 'Unsolved' is the claim's gloss on 'existence... more significant than its solution' — Wright does later resolve one part of the puzzle (he names Marsch-Trenchard as the author of the embedded story)."},
 {"index":175,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"authenticity can be validated from the clues Wolfe weaves",
  "note":"Verbatim: 'this narrative is the contextualising document of the collection, whose authenticity can be validated from the clues Wolfe weaves into the text.' The authorship limb is carried by the next sentence: 'the reader can determine that the author of the story is Marsch-Trenchard (if s/he has noted Marsch-Trenchard's contempt for secondhand information... and his resolution to produce a novel [which] would only confuse his case)' — clues drawn from 'V.R.T.', i.e. elsewhere in the collection, against the document's own title-page attribution to John V. Marsch. Note the quoted sentence's word is 'authenticity'; 'authorship' rests on the adjoining sentence."},
 {"index":176,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"clues lead the cautious and reflective reader",
  "note":"Verbatim: 'Although subtle, Wolfe's clues lead the cautious and reflective reader to that inevitable conclusion.' 'Though subtle' = 'Although subtle'; 'determinate conclusion' = 'that inevitable conclusion' (that the apparent humans are amnesiac aborigines). 'Resolvable rather than open' is the claim's inference from 'inevitable', consistent with the page at this point, though Wright's larger thesis still calls ambiguity 'a means of confounding interpretation'."},
 {"index":177,"verdict":"PARTIAL",
  "unsupportedLimb":"'so that the building carries the book's political argument' — Wright locates the political arguments in the puzzle, not the house, and reads 666 Saltimbanque as a metaphor for cultural isolationism *and imperialism*, the second half of which the claim drops",
  "trueWording":"is a rambling metaphor for cultural isolationism",
  "note":"Quote verbatim: 'In many ways Maison du Chien, 666 Saltimbanque, is a rambling metaphor for cultural isolationism, on the one hand, and imperialism on the other since the act of cloning and the process of hypnopaedia are symbolic representations of colonial occupation and re-education.' The isolationism limb is exact. The consequence limb is the claim's own: the page's statement about where the political argument lives is the earlier 'the puzzle is where the political arguments of the novel can be found'."},
 {"index":178,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"exist in a colonial system lacking a colonial discourse",
  "note":"Verbatim section opener: 'The two worlds exist in a colonial system lacking a colonial discourse.' The 'who is human' limb is supported by 'there is a more essential question underpinning the narratives: who is human?' and by 'the difficulty of apprehending the authentically human is compounded further by the absence of a coherent discourse that constitutes a reality for both Sainte Anne and Sainte Croix.' Wright adds that no one 'except perhaps the reader' can be certain whether the Annese are extinct — the reader's route is Wolfe's planted clues, not any official account, so the claim is not contradicted."},
 {"index":179,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"little pieces of the jigsaw and one is never quite sure",
  "note":"Verbatim in the opening paragraph: \"'Hints, hints, damnable hints and clues! That's all there is in Gene Wolfe's stories: little pieces of the jigsaw and one is never quite sure that there is a pattern to the jigsaw', declares Bruce Gillespie, making no attempt to disguise his exasperation.\" Note 1 gives the source exactly as the claim does: Bruce Gillespie, 'Gene Wolfe's Sleight of Hand', Australian Science Fiction Review, March 1986, p. 15."},
]
assert [v["index"] for v in V]==chunk["indices"], "index mismatch"
doc={"name":"wolfe","chunk":11,"claims":chunk["claims"],"verdicts":V}
os.makedirs(os.path.dirname(out),exist_ok=True)
json.dump(doc,open(out,"w"),indent=1,ensure_ascii=False)
print("wrote",out,os.path.getsize(out),"bytes; verdicts:",len(V))
