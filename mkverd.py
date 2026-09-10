import json
src="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/martin-02.json"
out="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-martin-i822-841.json"
d=json.load(open(src))
V=[
 (822,"VERIFIED_VERBATIM","In AGOT, Martin uses semicolons and colons interchangeably.",
  "Raw HTML of atseajournal.com/asoiaf/essays/punctuation.html fetched live (HTTP 200). Opening sentence reads 'In <em>AGOT</em>, Martin uses semicolons and colons interchangeably.' Quote word for word; the AGOT limb is explicit.",None),
 (823,"VERIFIED_VERBATIM","Incredibly, there are three examples of this on one page, 239 in my edition of AGOT.",
  "Same raw page. Quote verbatim. 'this' refers to the immediately preceding paragraph: 'These semicolons are not joining independent clauses, they are “illustrating or amplifying what has preceded the colon”' — i.e. a semicolon where a colon belongs; the page names p.239 of his edition, and three such quoted sentences follow.",None),
 (824,"VERIFIED_VERBATIM","Martin’s paragraphs are like Jenga towers: you can pull out quite a few sentences before they start getting wobbly.",
  "Raw HTML of .../compressibility.html fetched live (HTTP 200). Opening sentence; quote verbatim, and the 'several sentences removed before they wobble' limb is the second half of the same sentence.",None),
 (825,"VERIFIED_VERBATIM","Those seven paragraphs, totalling 427 words, are actually built from the first sentences of 26 different paragraphs, totalling 1,897 words.",
  "Same raw page. Quote verbatim. 427 words, 26 paragraphs and 1,897 words all present in one sentence; 'readable' is carried by the following clause 'But don’t they read smoothly?'; the source text is AGOT (Dany's second chapter).",None),
 (826,"VERIFIED_VERBATIM","Martin is imprecise, not incompetent.",
  "Raw HTML of .../imprecision.html fetched live (HTTP 200). Page reads 'Martin is imprecise, <em>not</em> incompetent.' — word for word as rendered text. The 'as a sentence writer' limb is supported by the next sentence: 'There’s no question that he can string together sentences.'",None),
 (827,"VERIFIED_VERBATIM","Flow between sentences is the litmus test for a successful author – not great individual sentences – and Martin passes.",
  "Same raw page, same paragraph as 826. Quote verbatim; both the 'rather than great individual sentences' limb and the 'Martin passes' limb are in the same sentence.",None),
 (828,"VERIFIED_VERBATIM","Martin shifts into antiquated diction: “tangle of root and thorn and grasping limb”; “Knew not”; “small wonder”.",
  "Raw HTML of .../purple.html fetched live (HTTP 200). Quote verbatim, and it comments directly on the block quotation above it, which ends 'It was small wonder the Night’s Watch named it the haunted forest.'",None),
 (829,"VERIFIED_VERBATIM","Presented with the overpowering and wordless sensations of nature and violence, his writing can leap into a high register.",
  "Same raw page. Quote 'leap into a high register' appears verbatim inside that sentence; nature-and-violence limb explicit ('Here I’d like to point out Martin’s reasons for using it: as an ecstatic response to nature and violence'). Only softening: the page says 'can leap', the claim says 'leaps'.",None),
 (830,"VERIFIED_VERBATIM","For period U2, there are 777 characters in the novels, but only 199 in the TV show.",
  "doi.org resolves to link.springer.com, which serves a JS bot 'Client Challenge' for both the article HTML and the text-mining PDF, and Wayback has no capture. Recovered via the authors' open-access deposit of the same DOI (CC BY-SA): https://hal.science/hal-04722579/document, PDF binary downloaded and text-extracted. Section 2.5 'Character Sets' carries the quote verbatim; Table 2 row 'U2 / All characters' gives Novels 777, TV Show 199; the section frames all counts as 'the annotated data that we use', and uses the phrase 'in the TV show annotations' two sentences later.",None),
 (833,"VERIFIED_VERBATIM","But Martin’s written a lot of sentences for ASOIAF – 148,130 by my count.",
  "Raw HTML of .../proselike.html fetched live (HTTP 200). Quote verbatim; the figure is attached to ASOIAF, not to a single novel.",None),
 (834,"VERIFIED_VERBATIM","when I checked for this structure I found ~250 examples of it",
  "Same raw page. Quote verbatim. 'this structure' is the zeugma the page defines earlier — 'Zeugma is a rhetorical device in which one verb controls multiple phrases' — exemplified by 'His hair was black, his hands rough', i.e. one verb over two comma-separated clauses; the corpus is ASOIAF. (The page adds that the detection net caught 'any sentences with commas whose first word was repeated after the first comma', a proxy, but the ~250 count is presented as examples of the structure.)",None),
 (838,"PARTIAL","Martin’s got an algorithm. He hits on age, hair, eyes, clothes, and physique.",
  "Raw HTML of .../snippets.html fetched live (HTTP 200), section 'Block Characterization'. The quoted list is verbatim and the five features are right, but the page says only that Martin 'has an algorithm' and names the features — it never claims a fixed sequence, and the block characterisations it then reproduces run in different orders (Tywin: age, physique, hair, eyes, no clothes; Ser Waymar: age, eyes, physique, clothes). The ordering limb is the claimant's addition.",
  "that the five features are hit in a fixed order"),
 (839,"VERIFIED_VERBATIM","A block characterization is that block of description characters receive when they first come on stage.",
  "Same raw page, first sentence of the 'Block Characterization' section; quote verbatim.",None),
 (840,"VERIFIED_VERBATIM","When you line them all up, the insistence on eye color is conspicuous, and of dubious value.",
  "Same raw page and section; quote verbatim. 'them' is the block characterisations being gathered up, so the 'in Martin's block characterisations' limb holds; a sidenote concedes eye description can work elsewhere.",None),
 (841,"VERIFIED_VERBATIM","I’m beginning to wish I had never bothered with the color of people’s eyes.",
  "Same raw page and section. Germani writes 'From a 2011 interview with Vulture' (linked to vulture.com/2011/10/george_rr_martin_on_his_favori.html) and block-quotes Martin's answer containing the sentence; the claim's quote fragment appears word for word inside it.",None),
]
verdicts=[]
for idx,v,tw,note,limb in V:
    o={"index":idx,"verdict":v,"trueWording":tw,"note":note}
    if limb: o["unsupportedLimb"]=limb
    verdicts.append(o)
assert [x["index"] for x in verdicts]==d["indices"], "index mismatch"
json.dump({"name":"martin","chunk":2,"claims":d["claims"],"verdicts":verdicts},open(out,"w"),ensure_ascii=False,indent=1)
print("wrote",out)
