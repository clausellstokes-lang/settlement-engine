import json

claims = json.loads(open('claims_in.json', encoding='utf-8').read())

verdicts = [
{"index":491,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"also written in the first person that bounces back and forth",
 "note":"Raw page fetched by curl with a browser UA, HTTP 200. Quote appears word for word in the body paragraph introducing the second point of view. The page continues with 'without obvious delineation', so the alternation limb is on the page too; the novel is Fool's Assassin. Byline 'By Justin Landon', 'Published on August 12, 2014' - the reactormag canonical, as the routeHint said."},
{"index":492,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"journal entries that he writes of days long past",
 "note":"Verbatim. The very next sentence says these entries open every chapter, so both limbs are on the page. 'He' is Fitz, established two sentences earlier as the head the novel returns inside of and whose every thought the reader is privy to, so 'the narrator' is correct."},
{"index":493,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"reliably unreliably interpreting the actions of those around him",
 "note":"Verbatim, opening the same paragraph. The page uses the adverb 'unreliably' where the claim says 'unreliable'; the sense is identical and the quoted string is exact. Subject is Fitz, the first-person narrator."},
{"index":494,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"I reveled in the small domestic details and patient growth",
 "note":"Verbatim in a reader comment signed Billcap, below the review, dated '12 years ago' - a reader comment, not the reviewer's text, exactly as the routeHint states. Two things worth recording for the merger: the page credits patient growth 'in the characters and their relationships to one another', so the claim's narrowing to relationships drops the characters half; and the page nowhere states Billcap's gender, so the claim's 'he' is the claim's own supposition, not the page's."},
{"index":495,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"stripping a lot of traditional plot out of her books",
 "note":"Verbatim, opening the same Billcap comment. The 'in favour of character and relationships' limb is supported by the same sentence, which says she instead focuses more on character/interpersonal relationships; the page adds cultural clash as a third focus, which the claim omits without distorting it."},
{"index":496,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"the pacing of the series seems to be the most frequent complaint",
 "note":"Raw page fetched by curl, HTTP 200 on the strangehorizons.com/wordpress/ path. Verbatim, late in the review as the claim's page field says, closing the paragraph on the conclusion. Byline 'By: Stephanie Dray', Issue '5 November 2001'. The page hedges with 'seems to be'; the claim's quote carries that hedge, so nothing is overstated."},
{"index":497,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"This grim devotion to realistic consequences ensures that the reader",
 "note":"Verbatim. The sentence completes with the reader being unable to predict what happens next and feeling no security in the outcome, so the second limb is on the page. It sits in the paragraph on Hobb's general bravery as an author, matching the claim's page field."},
{"index":498,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"she isn't afraid to maim, disfigure, or transform",
 "note":"Verbatim, immediately after the page's shorter sentence that Hobb is not afraid to kill - so the claim's 'not only to kill but' limb is supported. Confirmed the routeHint: this section of the raw HTML uses a straight ASCII apostrophe in 'isn't' (the whole document contains only one curly apostrophe, elsewhere)."},
{"index":499,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"Their changing fortunes reflect those of all the other old trader families",
 "note":"Verbatim in the third body paragraph, as the claim's page field says. 'Their' refers to the Vestrit family, named in the preceding sentence, and the page's phrase ends 'in Bingtown', supporting that limb."},
{"index":500,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"engage in slave trading in order to pay off the family debts",
 "note":"Verbatim, closing the third body paragraph. The page attributes the decision to the family ('the family decides that it will use the liveship to...'), and the next paragraph opens on the decision to trade in slaves catapulting the Vestrit family onward, so the decision limb is supported."},
{"index":501,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"they were awarded grants and trade monopolies that helped them",
 "note":"Verbatim in the second body paragraph, as the claim's page field says. The page completes the sentence with rising into the merchant nobility class, and the preceding sentence describes the pioneers who settled the coast of Trader Bay to found the colony - so both the founding-settlers limb and the merchant-nobility limb are on the page."},
{"index":502,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"the outcome of the civil insurrection is summarized briefly",
 "note":"Verbatim, and clearly framed as a fault: the same sentence follows the page's judgement that the last book may have been too condensed and too neat, and that characters are saved or killed efficiently. Two locator notes for the merger: the quote sits in the later paragraph on the end of the series, not in the earlier paragraph that introduces Ship of Destiny as the finale, so the claim's page field is a shade off; and 'rather than dramatising it' is the claim's own contrast - the page criticises the condensation without using a summarise/dramatise opposition, though the surrounding critique about no time to explore the psychological ramifications supports the sense."},
{"index":503,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"I slow down and put in the small details",
 "note":"Live tor.com is not needed: fetched the Wayback raw capture 20201111180135id_ by curl, HTTP 200, and it is the genuine article page (title, 'Peter Orullian', 'Tue Feb 7, 2012 6:00pm'). Verbatim in Hobb's answer to the question on how her own writing has evolved since her first published work, and the page completes the sentence with details that all add up to that moment of exhilaration or panic."},
{"index":504,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"introduces setting, culture, conflict, government, economy",
 "note":"Verbatim in the worldbuilding answer, matching the claim's page field. The clause opens with the page saying all her stories start with a character and that that character is the one introducing these, so the 'every one of her stories' limb is supported; the page adds that it comes through his or her eyes."},
{"index":505,"verdict":"VERIFIED_VERBATIM",
 "trueWording":"great events that also impact the little lives very strongly",
 "note":"Verbatim in the answer on what makes a fantasy epic, matching the claim's page field. The page frames it as her favourite books being the ones in which the protagonist may participate in such events - the modal 'may' is slightly softer than the claim's 'takes part in', but the favourite-books and little-lives limbs are both exact."},
]

assert len(claims) == 15 and len(verdicts) == 15
assert [c["index"] for c in claims] == [v["index"] for v in verdicts]

out = {"name": "hobb", "chunk": 7, "claims": claims, "verdicts": verdicts}
p = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-hobb-i491-505.json"
open(p, "w", encoding="utf-8").write(json.dumps(out, ensure_ascii=False, indent=2))

# copyright cap self-check
for v in verdicts:
    n = len(v["trueWording"].split())
    assert n <= 12, (v["index"], n)
print("WROTE", p)
print("max trueWording words:", max(len(v["trueWording"].split()) for v in verdicts))
