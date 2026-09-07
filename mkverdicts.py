import json, os

src = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/tolkien-09.json"
out = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-tolkien-i763-777.json"

chunk = json.load(open(src, encoding="utf-8"))

verdicts = [
 {"index":763,"verdict":"VERIFIED_SUBSTANCE",
  "trueWording":"\"sound like a traditional Chinese wuxia [martial arts fiction] story\"",
  "note":"Raw wikitext of en.wikipedia Translating_The_Lord_of_the_Rings, Chinese section, reached via action=raw. Page: \"Li states that Ding et al's version may be more literary, at the cost of making it 'sound like a traditional Chinese wuxia [martial arts fiction] story'. In contrast, Chu, more familiar with Western fantasy, has written a far more popular version.\" Both limbs supported. Not VERBATIM: the supplied quote 'sounds like traditional Chinese wuxia' differs from the page ('sound like a traditional Chinese wuxia'), and the page hedges the judgement as Li Hong-man's ('may be')."},

 {"index":764,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"\"fer que els orcs tinguessin un parlar com mes desballestat millor\"",
  "note":"PDF fetched from ddd.uab.cat and text-extracted with pdfminer (17pp). Quote present verbatim. Limb 1: \"Sabia, aixo si, que el llibre es publicaria en una col.leccio escolar... Per aixo, prou curiosament, El hobbit es mes farcit de cultismes o formes potser un xic arcaiques o desuetes que no pas d'altres traduccions.\" Limb 2: \"els unics detalls linguistics... van ser alguns trets peculiars emprats pels homes del sud (Boromir, Faramir...): aqueix, son/seua, naltros, mos/vos...\" Limb 3 is the quoted orc clause. All three limbs supported."},

 {"index":765,"verdict":"VERIFIED_SUBSTANCE",
  "trueWording":"\"el cas de les dues traduccions alemanyes existents es invers\"",
  "note":"Same PDF. Page: \"Segons que sembla, el cas de les dues traduccions alemanyes existents es invers: la primera, de Margaret Carroux, publicada entre 1969 i 1970, gaudeix de mes 'prestigi' que no pas la segona, de l'any 2000...\" The immediately preceding section is the Swedish case (Ohlmarks 1959-61 superseded by the orthodox Andersson/Olsson 2005), so 'invers' does refer to the Swedish. No quote was supplied, hence SUBSTANCE not VERBATIM; the page hedges with 'Segons que sembla' (apparently)."},

 {"index":766,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"\"adding words and indulging in lengthy paraphrases... more complicated and high-faluting\"",
  "note":"Raw wikitext of en.wikipedia Translation_of_The_Lord_of_the_Rings_into_Swedish. 'high-faluting' appears verbatim in the Stroembom footnote translation: \"by embroidering Tolkien's text, adding words and indulging in lengthy paraphrases, by frankly stubbornly turning the simple language into a more complicated and high-faluting one\". The 'hyperbolic' limb is supported separately on the same page: \"Andreas Brunner commented... that Ohlmarks' prose is hyperbolic in style, where the original uses simple or even laconic language.\" All limbs supported."},

 {"index":767,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"\"he had intentionally created an interpretation of Tolkien, not a straight translation\"",
  "note":"Same page. Lead: \"Ohlmarks rejected all criticism, stating that he had intentionally created an interpretation of Tolkien, not a straight translation.\" Quote is an exact substring. Refusal-of-revision limb: \"He ignored complaints and calls for revision from readers\" and \"Ohlmarks remained impervious to the numerous complaints and calls for revision\"."},

 {"index":768,"verdict":"VERIFIED_SUBSTANCE",
  "trueWording":"Sample table: Ohlmarks 42 words, Andersson and Olsson 24 words",
  "note":"Same page, 'Prose' section. Stroembom's comparison table gives Tolkien 20 words, Ohlmarks 1959-1961 42 words, Andersson and Olsson 2005 24 words for 'Indeed, few Hobbits had ever seen or sailed upon the Sea...'. The laconic limb is supported: \"Commentators including Petter Lindgren in Aftonbladet have remarked on Ohlmarks's wordy text compared to Andersson's more laconic version\", and the page calls Tolkien's own language 'simple or even laconic'. No quote supplied, so SUBSTANCE; 'matched Tolkien's laconic tone' is the claim's phrasing, the page says only 'more laconic' than Ohlmarks."},

 {"index":769,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"\"a readable, even and in large part correct translation\"",
  "note":"Same page. Henrik Williams in Dagens Nyheter: \"Let me say that Andersson & Olsson have prepared a readable, even and in large part correct translation...\" - quote is an exact substring. Second limb, Malte Persson in Goeteborgsposten: \"the new translation follows the original's fluent prose very closely, and only a linguistic pedant could find anything to object to\". Both reviews are dated 27 September 2004 on the page although the article labels the version 2005."},

 {"index":770,"verdict":"PARTIAL",
  "unsupportedLimb":"Lavskaegge (reading 'beam' as light)",
  "trueWording":"Lavskaegge = 'Lichenbeard'; beam-as-light is Quickbeam -> Snabba solstralen",
  "note":"Same page. Two of three examples are supported: \"Ohlmarks used Vattnadal ('Water-dale') for Rivendell, apparently, Tolkien commented, by way of taking riven for river\"; and the names table gives Ford of Bruinen -> Bjoernavad ('Bear Ford'), \"A guess, using English 'Bruin', a brown bear\". The third is a conflation: the page glosses Lavskaegge as 'Lichenbeard', Ohlmarks's rendering of Treebeard, while the beam-as-light misreading belongs to a different name entirely - \"The Ent Quickbeam becomes Snabba solstralen ('Swift Sunbeam'), apparently taking beam in the sense of 'beam of light' instead of 'tree'\"."},

 {"index":771,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"\"Dr. Ohlmarks is a conceited person, less competent than charming Max Schuchart\"",
  "note":"Same page. Letter 263 blockquote: \"The enclosure that you brought from Almqvist &c. was both puzzling and irritating. A letter in Swedish from fil. dr. Ake Ohlmarks, and a huge list (9 pages foolscap) of names in the L.R. which he had altered... the impression remains, nonetheless, that Dr. Ohlmarks is a conceited person...\" - covers the nine-page altered-name list and 'both puzzling and irritating'. The Dutch limb is supported by the running text: \"He thought Ohlmarks's version was even worse than Schuchart's 1956-57 Dutch translation\". All limbs supported."},

 {"index":772,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"his Vidstige \"even outdoes the original's Strider\"",
  "note":"Same page: \"Stefan Spjut, reviewing the new translation in Svenska Dagbladet, commented that Ohlmarks's version had its merits, and that his Vidstige 'even outdoes the original's Strider', but that people would probably get used to the new version.\" Word for word; the page uses a curly apostrophe in original's where the supplied quote uses an ASCII one - a typographic difference only. 'One reviewer conceded' matches Spjut allowing merits to a version he is otherwise superseding."},

 {"index":773,"verdict":"VERIFIED_SUBSTANCE",
  "trueWording":"\"prompting him to compile his Guide to the Names\"; 1982 book, hostility from late 1970s",
  "note":"Raw wikitext of en.wikipedia Ake_Ohlmarks. \"Ohlmarks translation of Tolkien's The Lord of the Rings was strongly disliked by the author, prompting him to compile his 'Guide to the Names in The Lord of the Rings'.\" And: \"As a result of the severe criticism... Ohlmarks in the late 1970s began to display hostility towards the 'Tolkien phenomenon', and in 1982 published a book titled Tolkien and Black Magic\" (Tolkien och den svarta magin, 1982). Both limbs supported; no quote was supplied, hence SUBSTANCE."},

 {"index":774,"verdict":"VERIFIED_SUBSTANCE",
  "trueWording":"\"lade till adjektiv och piffade upp dialogen... en helt annan bok\"",
  "note":"Raw wikitext of sv.wikipedia Oeversaettning_av_Sagan_om_ringen_till_svenska. \"I Sydsvenska Dagbladet (2004) ger Andreas Brunner foersiktig beroem: 'Tolkien ville faa fram en aalderdomlig kaensla med ett avskalat spraak. Ohlmarks gjorde precis tvaertom, lade till adjektiv och piffade upp dialogen. Resultatet blev en foertjusande bok, men ocksaa en helt annan bok aen den Tolkien hade skrivit'.\" Added adjectives, spruced-up dialogue, delightful but quite different book - all three limbs supported; no quote supplied, so SUBSTANCE."},

 {"index":775,"verdict":"VERIFIED_VERBATIM",
  "trueWording":"\"six meals a day\" blev \"sex vaellagade maaltider om dagen\"",
  "note":"Same sv.wikipedia page. \"Leif Jacobsen har granskat Ohlmarks oeversaettning... Dessutom menar han att oeversaettaren genomgaaende broderar ut texten och laegger till information som inte finns i originalet. Exempel som han lyfter fram aer 'six meals a day' som i Ohlmarks oeversaettning blev 'sex vaellagade maaltider om dagen'.\" Quote present verbatim; the padding limb and the attribution to Jacobsen are both supported."},

 {"index":776,"verdict":"PARTIAL",
  "unsupportedLimb":"to make the world feel ancient",
  "trueWording":"\"en levande sagovaerld\" with as little to do with England as possible",
  "note":"Same sv.wikipedia page. Supported: \"I Ohlmarks bok Tolkiens arv uppger denne att den egna uppgiften varit att goera en tolkning av Tolkien\" (Tolkiens arv is 1978 in the page's source list), and the block quote \"Jag gjorde foerst en noggrann slaetoeversaettning av hela boken och skrev sedan radikalt om den, hela tiden ledd av en straevan att soeka skildra en levande sagovaerld som hade precis saa lite att goera med England och engelskan som Tolkien tydligen avsett.\" The plain-draft-then-rewrite limb and the distance-from-England limb are exact. The 'feel ancient' limb is not in Ohlmarks's stated aim - he says a LIVING saga-world ('levande sagovaerld'); the only 'aalderdomlig kaensla' (archaic feeling) on the page is Brunner's description of what TOLKIEN wanted, of which he says Ohlmarks did the opposite."},

 {"index":777,"verdict":"PARTIAL",
  "unsupportedLimb":"attributing the Merry death-blow and the two Prancing Pony names to Malte Persson",
  "trueWording":"Persson: \"missfoerstaand, felsyftningar, inkonsekvenser och godtyckliga tillaegg\"",
  "note":"Same sv.wikipedia page. The first half is verbatim from Persson (Goeteborgs-Posten, 2004): \"Den aer saa spaeckad med missfoerstaand, felsyftningar, inkonsekvenser och godtyckliga tillaegg...\" Both examples exist on the page but neither is credited to Persson: the Witch-king error is unattributed article text in its own section ('Haexmaestarens doed' - \"I de flesta upplagor... aer det felaktigt hoben Meriadoc som ger Haexmaestaren av Angmar det doedande hugget, medan det i sjaelva verket aer Eowyn\"), and the inn's two names ('Den dansande ponnyn' in the prologue vs 'Den stegrande ponnyn' in the text) is sourced to Jacobsen and to the book itself. The 'including' limb therefore misattributes."},
]

assert len(verdicts) == 15
assert [v["index"] for v in verdicts] == chunk["indices"], "index mismatch"

payload = {"name": "tolkien", "chunk": 9, "claims": chunk["claims"], "verdicts": verdicts}
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False, indent=1)
print("WROTE", out, os.path.getsize(out), "bytes")
