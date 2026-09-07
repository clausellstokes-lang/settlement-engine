import json
src="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/leguin-09.json"
out="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-leguin-i843-885.json"
d=json.load(open(src))
V=[
 (843,"VERIFIED_VERBATIM","relating, finding, losing, bearing, discovering, parting, changing",
  "Raw page fetched (curl, browser UA, HTTP 200). Answer to Anthony, question 3, quotes Steering the Craft p.123 exactly as cited; the block names conflict as one kind of behavior and the listed seven as others equally important in any human life. Every limb supported."),
 (848,"VERIFIED_VERBATIM","Nobody has to do any thinking about it at all",
  "Raw page fetched (HTTP 200). In the Nicole/Bayla answer, under 'How much to rely on the way cultures in our world work?', the specimen sentence has Vig spurring his horse through Horb's streets and drawing rein at the Palace gate; Le Guin then places the reader in Horb in the European Middle Ages, cozy and feudal, followed by the quoted sentence verbatim. Post date on page: March 21, 2016."),
 (851,"VERIFIED_VERBATIM","Yes. I do.",
  "Raw page fetched (HTTP 200). The sub-heading in the Nicole/Bayla answer reads 'Do you spend a lot of time building the world before writing the story?' and the whole answer beneath it opens with the quoted three words, then explains that differences from the world-as-we-know-it must be thought through beforehand. Verbatim."),
 (852,"VERIFIED_VERBATIM","I tried to write good ones",
  "Raw page fetched (HTTP 200), Session 1 Part 4, dated September 21, 2015 on the page. In the answer to Esme, Le Guin distinguishes recognition from achievement, disclaims having set out to write successful books in the immediately preceding sentence, and follows with the quoted words verbatim. Both limbs of the claim supported."),
 (859,"VERIFIED_VERBATIM","I don't have plots; I have situations, I have stories",
  "Raw page fetched from locusmag.com (HTTP 200), 'Ursula K. Le Guin: A Return to Earthsea', September 2001 interview excerpts. The second excerpt opens by calling her books character-driven and continues with the quoted sentence verbatim (the page's curly apostrophes render as mojibake in the raw byte stream; the wording is identical). Both limbs supported."),
 (861,"VERIFIED_VERBATIM","There are some facts, and you want to get 'em right",
  "Raw page fetched from locusmag.com (HTTP 200), 'The Age of Saturn', posted 24 October 2008. The second excerpt denies a great difference between her science fiction and Lavinia, gives the quoted clause verbatim followed by the cutting-loose clause, and then states that a historical novel requires getting the facts right the way science fiction does. Every limb supported."),
 (862,"VERIFIED_VERBATIM","You use what is known to be known.",
  "Raw page fetched (same locusmag 2008 page, HTTP 200). The quoted sentence appears word for word inside the Lavinia excerpt, introduced as something Delany said. NOTE ON THE ATTRIBUTION LIMB: the page names him 'Chip Delany', not 'Samuel' - Chip is Samuel R. Delany's long-standing nickname, so the person is the same, but the given name in the claim comes from outside the page."),
 (864,"VERIFIED_VERBATIM","the book says best in its own words",
  "Raw page fetched from books.guardian.co.uk (HTTP 200, redirected to the Guardian's current host; page title 'Chronicles of Earthsea', byline date Mon 9 Feb 2004). The full quoted sentence appears verbatim in her reply to a reader asking whether Tehanu and the last Earthsea books mean women cannot be owned; she says she cannot or will not answer and calls interpreting her own book into generalities and abstractions perverse and foolish. Claim limbs all supported. LOCATOR CORRECTION: this is not the 'final answer' - it sits about two-thirds through, and the transcript's last exchange is about favourite invented worlds."),
 (865,"VERIFIED_VERBATIM","stylistically ordinary, imaginatively derivative, and ethically rather mean-spirited",
  "Raw page fetched (same Guardian Q&A, HTTP 200). Answering a question about J.K. Rowling's style, Le Guin says she read the first Harry Potter book after adult critics praised its originality, and closes with the quoted phrase verbatim. All three judgements and the 'first Harry Potter book' limb supported. Context worth carrying: the same sentence first calls it a lively kid's fantasy crossed with a school novel and good fare for its age group."),
 (869,"VERIFIED_VERBATIM","whose societies no longer exist, are written in the present tense",
  "Raw page fetched from ebin.pub (HTTP 200, 612KB OCR scan of the 1989 Grove edition). In 'Some Thoughts on Narrative' (1980), between the scan's page markers 38 and 39 - so p.38 as cited - the sentence runs: anthropological reports concerning people who died decades ago, whose societies no longer exist, are written in the present tense; this paper is too. Minor drift: the claim splits one class into two ('about people... and about societies'), where the original makes the vanished societies belong to those same people. No limb unsupported."),
 (870,"VERIFIED_VERBATIM","The present tense takes the story out of time.",
  "Raw page fetched (same ebin.pub scan, HTTP 200). Sentence appears word for word on p.38 of 'Some Thoughts on Narrative', immediately after the observation that the present tense, used to make telling 'more actual', actually distances the story."),
 (872,"VERIFIED_VERBATIM","does not normally use the present tense except for special effect",
  "Raw page fetched (same ebin.pub scan, HTTP 200). On p.38 of 'Some Thoughts on Narrative' the full clause - narrative does not normally use the present tense except for special effect or out of affectation - appears verbatim, including the 'or out of affectation' tail the claim asserts. The sentence opens 'This might be why', which hedges the causal explanation (narrative's forward movement through time), not the observation itself, so the claim's limb stands."),
 (874,"VERIFIED_VERBATIM","narrative is language used to connect events in time",
  "Raw page fetched (same ebin.pub scan, HTTP 200). On p.38 of 'Some Thoughts on Narrative', drawn as a conclusion from Aristotle on beginning-middle-end, the sentence appears verbatim (prefixed 'So'). It functions as the essay's working definition, matching the claim's 'defines'."),
 (875,"VERIFIED_VERBATIM","Narrative is a stratagem of mortality.",
  "Raw page fetched (same ebin.pub scan, HTTP 200). Sentence appears word for word between the scan's page markers 39 and 40 - so p.39 as cited - in 'Some Thoughts on Narrative', following the passage on the immortal gene having no story and the once-upon-a-time king who does not live forever."),
 (885,"VERIFIED_VERBATIM","a novel, just as much as a poem, is its words",
  "Raw page fetched (same ebin.pub scan, HTTP 200). In 'Reciprocity of Prose and Poetry' (1983), after the page marker following 111 - consistent with the cited p.112 - Le Guin writes that she believes it while also believing translation to be mysterious; the clause appears verbatim and the claim's 'she believes' limb is explicit in the original."),
]
d["verdicts"]=[{"index":i,"verdict":v,"trueWording":t,"note":n} for (i,v,t,n) in V]
ix=[c["index"] for c in d["claims"]]
assert ix==[i for (i,_,_,_) in V], (ix,[i for (i,_,_,_) in V])
for (i,v,t,n) in V:
    assert len(t.split())<=12, (i,len(t.split()),t)
json.dump({"name":"leguin","chunk":9,"claims":d["claims"],"verdicts":d["verdicts"]},open(out,"w"),indent=1,ensure_ascii=False)
print("wrote",out,"claims",len(d["claims"]),"verdicts",len(d["verdicts"]))
print("max trueWording words:",max(len(t.split()) for (_,_,t,_) in V))
