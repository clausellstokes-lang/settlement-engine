import json
d=json.load(open('found-hobb-translators.json'))
S=d['sourcesRead']; C=d['claims']
def s(**kw): S.append(kw)
def c(**kw): C.append(kw)

PCEN="https://www.phantastik-couch.de/magazin/interview/10-2017-robin-hobb-engl-ov/"
PCDE="https://www.phantastik-couch.de/magazin/interview/10-2017-robin-hobb/"
VW="https://verlorene-werke.blogspot.com/2017/07/neuauflage-robin-hobb-weitseher-mit.html"
OLIVER="https://dc.swosu.edu/mythlore/vol41/iss1/4/"
KOK="https://studenttheses.uu.nl/handle/20.500.12932/10046"
FED="https://elliottrwi.com/research/hobb-bibliography/"

s(title="Robin Hobb interview, English original version, Phantastik-Couch.de", url=PCEN, kind="own-words", substantive=True, date="2017-10", route="direct curl with browser UA; linked from the German version as 'Das Interview im englischen Original'")
s(title="Robin Hobb interview, German version, Phantastik-Couch.de", url=PCDE, kind="own-words", substantive=True, date="2017-10", route="direct curl with browser UA")
s(title="Penhaligon Verlag editorial office (Lektorat) interviewed on the 2017 Weitseher reissue, Verlorene-Werke blog", url=VW, kind="vendor", substantive=True, date="2017-07-15", route="direct curl with browser UA")
s(title="Matthew Oliver, 'History in the Margins: Epigraphs and Negative Space in Robin Hobb's Assassin's Apprentice', Mythlore 41.1 (Fall/Winter 2022) 45-66", url=OLIVER, kind="analysis", substantive=True, date="2022-10", route="dc.swosu.edu returned a 403 page; PDF via Wayback raw web/20240707045408id_/ of the viewcontent.cgi URL, pypdf")
s(title="Marlies Kok, 'The Boundaries of Imagination, important aspects of fantasy translation', MA thesis, Utrecht University", url=KOK, kind="analysis", substantive=True, date="2012", route="DSpace REST bitstream 232bf1b5-ecab-49c6-9f70-39f67fb9c119/content, pypdf")
s(title="Geoffrey B. Elliott, 'The Fedwren Project: A Robin Hobb Annotated Bibliography'", url=FED, kind="analysis", substantive=True, date="accessed 2026-09-06", route="direct curl with browser UA; used as the bibliography-chasing spine")

# ---- Hobb's own words, English original
c(feature="sentence length variation",
  claim="Robin Hobb says she learned from her French translator that sentence length is very different from language to language.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, English original version, October 2017", url=PCEN,
  quote="sentence length is very different from language to language", page="answer on the new German translation",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="sentence length variation",
  claim="Hobb says her French translator Arnaud often has to join several of her English sentences together to make one French sentence.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, English original version, October 2017", url=PCEN,
  quote="Often Arnaud has to join several English sentences together", page="answer on the new German translation",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="parataxis vs hypotaxis",
  claim="Hobb says a direct sentence-for-sentence translation of her prose would be choppy, dreadful French.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, English original version, October 2017", url=PCEN,
  quote="A direct translation would be choppy, dreadful French", page="answer on the new German translation",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="cadence and rhythm",
  claim="Hobb says a translator's task is not just to translate word for word but to convey the feeling of the words and the pace of the scene.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, English original version, October 2017", url=PCEN,
  quote="the translators task is not just to translate word for word", page="answer on the new German translation",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="place and institution description",
  claim="Hobb says that under the Hobb name the world is as much a part of the story as the characters are.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, English original version, October 2017", url=PCEN,
  quote="the world is as much a part of the story as the characters", page="answer on the Hobb versus Lindholm names",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent",
  registerHint="dossier-archivist", confidence="high")
c(feature="plainness and economy",
  claim="Hobb says she does not want to dazzle the reader with her style of writing.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, English original version, October 2017", url=PCEN,
  quote="I don’t want to dazzle the reader with my style of writing", page="answer on the goal she starts with",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="point of view and distance",
  claim="Hobb says the books she enjoys most are the ones where the story telling is transparent.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, English original version, October 2017", url=PCEN,
  quote="the ones where the story telling is transparent", page="answer on the goal she starts with",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="register modulation",
  claim="Hobb says she moved to the Hobb name as a conscious choice because the voice and story telling style was so different from the Lindholm books.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, English original version, October 2017", url=PCEN,
  quote="the voice and story telling style was so different", page="answer on the two pen names",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="other: credit to translators",
  claim="Hobb says she has been blessed with excellent translators and at least half the credit for a work in translation should go to the translator.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, English original version, October 2017", url=PCEN,
  quote="I have been blessed with excellent translators", page="answer on the new German translation",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="sentence length variation",
  claim="In the published German rendering of the same interview Hobb's statement is that Arnaud must often condense several of her English sentences into one.",
  source="Robin Hobb, interviewed by Phantastik-Couch.de, German version, October 2017", url=PCDE,
  quote="muss oft einige meiner englischen Sätze zusammenfassen", page="answer on the new German translation",
  kind="own-words", polarity="asserts", date="2017-10", routeHint="direct curl with browser user agent; the German page is the interviewer's rendering, the English original is at /10-2017-robin-hobb-engl-ov/",
  registerHint="none", confidence="medium", )

# ---- Penhaligon Lektorat, vendor
c(feature="edition and house style",
  claim="The Penhaligon editorial office says the 2017 Weitseher reissue heavily revised the existing German translation rather than commissioning a new one.",
  source="Penhaligon Verlag Lektorat, interviewed on the Verlorene-Werke blog, 15 July 2017", url=VW,
  quote="Wir haben die vorhandene Übersetzung stark überarbeitet", page="answer to 'Handelt es sich um eine Neuübersetzung?'",
  kind="vendor", polarity="asserts", date="2017-07-15", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="edition and house style",
  claim="The Penhaligon editorial office says older translations simply show their age, and that today one would partly use different words.",
  source="Penhaligon Verlag Lektorat, interviewed on the Verlorene-Werke blog, 15 July 2017", url=VW,
  quote="Man merkt älteren Übersetzungen ihr Alter einfach an", page="answer to 'Handelt es sich um eine Neuübersetzung?'",
  kind="vendor", polarity="asserts", date="2017-07-15", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="point of view and distance",
  claim="The Penhaligon editorial office says the narrative voice of the Farseer chronicles is absolutely meant for adults, though Fitz begins the story very young.",
  source="Penhaligon Verlag Lektorat, interviewed on the Verlorene-Werke blog, 15 July 2017", url=VW,
  quote="die Erzählstimme ist absolut für Erwachsene gedacht", page="answer on who to recommend the books to",
  kind="vendor", polarity="asserts", date="2017-07-15", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")

# ---- Oliver 2022
c(feature="civic record register",
  claim="Matthew Oliver says the chapter epigraphs of Assassin's Apprentice are excerpts from a public document, largely a formal history.",
  source="Matthew Oliver, Mythlore 41.1 (Fall/Winter 2022), p.45", url=OLIVER,
  quote="excerpts from a public document, largely a formal history", page="p.45",
  kind="analysis", polarity="asserts", date="2022-10", routeHint="Wayback raw capture 20240707045408id_ of dc.swosu.edu viewcontent.cgi?article=3044, pypdf",
  registerHint="dossier-archivist", confidence="high")
c(feature="civic record register",
  claim="Oliver characterises the voice of Hobb's chapter epigraphs as distant and scholarly.",
  source="Matthew Oliver, Mythlore 41.1 (Fall/Winter 2022), p.45", url=OLIVER,
  quote="written in a distant, scholarly voice", page="p.45",
  kind="analysis", polarity="asserts", date="2022-10", routeHint="Wayback raw capture 20240707045408id_, pypdf",
  registerHint="dossier-archivist", confidence="high")
c(feature="civic record register",
  claim="Oliver calls the official history that opens each chapter dry and impersonal, and says the personal main text feels more authoritative and satisfying than it.",
  source="Matthew Oliver, Mythlore 41.1 (Fall/Winter 2022), p.57", url=OLIVER,
  quote="the dry, impersonal, but objective history beginning the chapter", page="p.57",
  kind="analysis", polarity="disputes the authority of the record register", date="2022-10", routeHint="Wayback raw capture 20240707045408id_, pypdf",
  registerHint="dossier-archivist", confidence="high")
c(feature="register modulation",
  claim="Oliver says that in the earlier epigraphs Hobb's narrator keeps the style of the epigraphs and of the main text separate, and marks chapter 15 as the point where a poetic lyricism breaches that separation.",
  source="Matthew Oliver, Mythlore 41.1 (Fall/Winter 2022)", url=OLIVER,
  quote="Fitz has largely kept the style of the epigraphs and the main text separate", page="section on the 'misted' chapter 15",
  kind="analysis", polarity="asserts", date="2022-10", routeHint="Wayback raw capture 20240707045408id_, pypdf",
  registerHint="dossier-archivist", confidence="high")
c(feature="omission as information",
  claim="Oliver says Assassin's Apprentice repeatedly uses sentences that start by telling what a character is not doing or feeling.",
  source="Matthew Oliver, Mythlore 41.1 (Fall/Winter 2022), section 'Negative Narration'", url=OLIVER,
  quote="sentences that start by telling what a character is not doing", page="section 'Negative Narration'",
  kind="analysis", polarity="asserts", date="2022-10", routeHint="Wayback raw capture 20240707045408id_, pypdf",
  registerHint="none", confidence="high")
c(feature="omission as information",
  claim="Oliver says that in the early chapters scarcely a page goes by without an obvious example of that negative construction.",
  source="Matthew Oliver, Mythlore 41.1 (Fall/Winter 2022), section 'Negative Narration'", url=OLIVER,
  quote="scarcely a page goes by without obvious examples", page="section 'Negative Narration'",
  kind="measurement", polarity="asserts", date="2022-10", routeHint="Wayback raw capture 20240707045408id_, pypdf",
  registerHint="none", confidence="high")

# ---- Kok 2012
c(feature="naming and forms of address",
  claim="Marlies Kok describes the Six Duchies nobles' custom of naming their children after virtues or traits as a translation problem for the Dutch translator.",
  source="Marlies Kok, MA thesis, Utrecht University, 2012", url=KOK,
  quote="have the custom to name their children after virtues or traits", page="Chapter 2, on proper names",
  kind="analysis", polarity="asserts", date="2012", routeHint="DSpace REST bitstream 232bf1b5-ecab-49c6-9f70-39f67fb9c119/content, pypdf",
  registerHint="none", confidence="high")
c(feature="edition and house style",
  claim="Kok's bibliography dates the Dutch Leerling en Meester to Meulenhoff Boekerij, 1998, translated by Erica Feberwee and Peter Cuijpers.",
  source="Marlies Kok, MA thesis, Utrecht University, 2012, Bibliography", url=KOK,
  quote="Trans. Erica Feberwee, Peter Cuijpers", page="Bibliography, p.110",
  kind="analysis", polarity="mentions", date="2012", routeHint="DSpace REST bitstream content endpoint, pypdf",
  registerHint="none", confidence="high")

# ---- Fedwren
c(feature="place and institution description",
  claim="Geoffrey B. Elliott's annotated bibliography says Hobb appears repeatedly in Kok's fantasy-translation thesis as an illustrative example of fantasy world construction.",
  source="Geoffrey B. Elliott, The Fedwren Project: A Robin Hobb Annotated Bibliography, entry on Kok", url=FED,
  quote="Hobb appears repeatedly in Kok’s thesis as an illustrative example", page="entry: Kok, Marlies",
  kind="analysis", polarity="asserts", date="accessed 2026-09-06", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")

d['sourcesRead']=S; d['claims']=C
d['coverage']="IN PROGRESS after 12 sources. Named roster: ActuSF FETCHED; Elbakin.net FETCHED via Wayback (live 404); Fantastinet FETCHED; Duits thesis on Feberwee/Cuijpers FETCHED via DSpace REST; Tkach 2021 FETCHED via Wayback (live Cloudflare-blocked); UNIGE Jeanneret FETCHED. Chandarana & Choudhary still outstanding. Lateral expansion so far: the Fedwren Project bibliography, Kok's MA thesis, Oliver's Mythlore article, and Hobb's own 2017 Phantastik-Couch interview in both its English original and German rendering, plus the Penhaligon Lektorat interview."
json.dump(d, open('found-hobb-translators.json','w'), ensure_ascii=False, indent=1)
print(len(C),'claims',len(S),'sources')
