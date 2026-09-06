import json, os
OUT = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-wolfe-monographs.json"

G   = "https://gwern.net/doc/fiction/gene-wolfe/1986-gordon-genewolfe.pdf"
AT  = "https://ia800901.us.archive.org/6/items/strategies-of-fantasy/strategies-of-fantasy_djvu.txt"
ULX = "https://ultan.org.uk/tell-me-about-the-lexicon-urthus-an-interview-with-michael-andre-driussi/"
UGM = "https://ultan.org.uk/micro-wolfenomics-joan-gordon-reviews-gene-wolfes-first-four-novels-a-chapter-guide-by-michael-andre-driussi/"

GORDON_SRC = "Joan Gordon, Gene Wolfe (Starmont Reader's Guide 29, Starmont House, 1986)"
ATT_SRC = "Brian Attebery, Strategies of Fantasy (Indiana University Press, 1992), ch. 7 'Science Fantasy'"

sources = []
claims = []

def S(title, url, kind, substantive, date=None, route=None):
    d = {"title": title, "url": url, "kind": kind, "substantive": substantive}
    if date: d["date"] = date
    if route: d["route"] = route
    sources.append(d)

def C(**kw):
    claims.append(kw)


# ---------------- SOURCES ----------------
S(GORDON_SRC + " -- full monograph, read from the scanned PDF's text layer", G, "analysis", True, "1986", "gwern.net PDF -> pdftotext (md5 cadb2f6dcc3e736e18390d372573a27d; identical to the local scan)")
S(ATT_SRC, AT, "analysis", True, "1992", "archive.org opensource item strategies-of-fantasy, _djvu.txt fetched raw with a browser user agent")
S("'Tell me about the Lexicon Urthus': an interview with Michael Andre-Driussi, Ultan's Library, 25 September 2008 (on the second edition of Lexicon Urthus)", ULX, "own-words", True, "2008-09-25", "live site, raw HTML")
S("Joan Gordon, 'Micro-Wolfenomics': review of Michael Andre-Driussi, Gene Wolfe's First Four Novels: A Chapter Guide, Ultan's Library, 23 November 2020", UGM, "reception", True, "2020-11-23", "live site, raw HTML")

# ---------------- CLAIMS: GORDON 1986 ----------------
C(feature="plainness and economy", claim="Gordon opens her study by asserting that Wolfe writes elegant and evocative prose.",
  source=GORDON_SRC, url=G, quote="elegant and evocative prose", page="ch. II Introduction, p. 3", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

C(feature="withheld information and inference", claim="Gordon says Wolfe's stories differ from most other science fiction in their emphasis on ambiguity.",
  source=GORDON_SRC, url=G, quote="their emphasis on ambiguity", page="ch. II Introduction, p. 3", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

C(feature="point of view and distance", claim="Gordon writes that Wolfe seldom stresses action in his fiction.",
  source=GORDON_SRC, url=G, quote="Wolfe seldom stresses action or", page="ch. II Introduction, p. 3", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

C(feature="civic record register", claim="Gordon says Wolfe typically relates his sociological stories in a flat, business-like tone that mimics the callous language of bureaucratic management.",
  source=GORDON_SRC, url=G, quote="business-like tone that mimics the callous", page="ch. II Introduction, p. 6", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="dossier-archivist", confidence="high")

C(feature="point of view and distance", claim="Gordon says that in his most characteristic fiction Wolfe adopts a cool tone.",
  source=GORDON_SRC, url=G, quote="Wolfe adopts a cool tone", page="ch. II Introduction, p. 7", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="dossier-archivist", confidence="high")

C(feature="parataxis vs hypotaxis", claim="Gordon says the sentence structure of The Book of the New Sun works not to obfuscate but to illustrate.",
  source=GORDON_SRC, url=G, quote="its language does, not to obfuscate but to", page="ch. VIII, p. 76", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

C(feature="sentence length variation", claim="Gordon measures the opening paragraph of The Shadow of the Torturer and reports that its first sentence is eleven words long.",
  source=GORDON_SRC, url=G, quote="the first sentence is fairly short (eleven words)", page="ch. VIII, p. 76", kind="measurement",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

C(feature="sentence length variation", claim="Gordon reports the two remaining sentences of that opening paragraph as thirty-two words and twenty-seven words.",
  source=GORDON_SRC, url=G, quote="(thirty—two words and twenty—seven words)", page="ch. VIII, p. 76", kind="measurement",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext; em-dashes are the scan's OCR of the hyphens", registerHint="none", confidence="high")

C(feature="archaism", claim="Gordon quotes Wolfe's appendix to The Shadow of the Torturer saying his substituted words are intended to be suggestive rather than definitive.",
  source="Gene Wolfe, appendix to The Shadow of the Torturer, quoted in " + GORDON_SRC, url=G,
  quote="suggestive rather than definitive", page="ch. VIII, p. 75, quoting ST Appendix p. 302", kind="own-words",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

C(feature="place and institution description", claim="Gordon quotes Wolfe saying he found a writer's assumption of a single uniform culture covering a whole world both incredible and boring.",
  source="Gene Wolfe, 'Helioscope' in The Castle of the Otter, quoted in " + GORDON_SRC, url=G,
  quote="both incredible and boring", page="ch. VIII, p. 80, quoting CO pp. 8-9", kind="own-words",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="dossier-archivist", confidence="high")

C(feature="place and institution description", claim="Gordon says the Commonwealth of The Book of the New Sun has a caste system in which each caste has its own culture.",
  source=GORDON_SRC, url=G, quote="each caste with its own culture", page="ch. VIII, p. 80", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="dossier-archivist", confidence="high")

C(feature="place and institution description", claim="Gordon argues that setting in the tetralogy confirms style and directs the reader to theme.",
  source=GORDON_SRC, url=G, quote="setting confirms style and directs us to", page="ch. VIII, pp. 80-81", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="dossier-archivist", confidence="high")

C(feature="withheld information and inference", claim="Gordon calls Wolfe's tendency to raise rather than answer questions one source of his evocative power.",
  source=GORDON_SRC, url=G, quote="tendency to raise rather than answer", page="ch. IV, p. 24", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

C(feature="omission as information", claim="Gordon describes the myth John Marsch constructs in the second novella of The Fifth Head of Cerberus as the simulated artifact of a culture whose existence has left little trace.",
  source=GORDON_SRC, url=G, quote="The myth is the simulated artifact of a culture", page="ch. IV, p. 23", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="dossier-archivist", confidence="high")

C(feature="point of view and distance", claim="Gordon says the memoir-with-embedded-stories form of Peace distances the narrator from his material.",
  source=GORDON_SRC, url=G, quote="distances the narrator from his material", page="ch. V, p. 34", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

C(feature="other: didactic register suppresses the device", claim="Gordon says that in Operation ARES the didactic purpose is so clear that ambiguity and an invitation to interpret have no place.",
  source=GORDON_SRC, url=G, quote="an invitation to interpret have no place", page="ch. III, p. 14", kind="analysis",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

C(feature="other: scale of the work", claim="Gordon gives the length of the four volumes of The Book of the New Sun as 1222 pages in the first editions.",
  source=GORDON_SRC, url=G, quote="1222 pages in the first editions", page="ch. VIII, p. 78", kind="measurement",
  polarity="asserts", date="1986", routeHint="gwern.net PDF -> pdftotext", registerHint="none", confidence="high")

# ---------------- CLAIMS: ATTEBERY 1992 ----------------
C(feature="withheld information and inference", claim="Attebery calls Wolfe a writer with a love of indirection and ambiguity equal to Henry James's.",
  source=ATT_SRC, url=AT, quote="an equal love of indirection and ambiguity", page="Introduction, p. vii", kind="analysis",
  polarity="asserts", date="1992", routeHint="archive.org _djvu.txt", registerHint="none", confidence="high")

C(feature="archaism", claim="Attebery says Wolfe introduces the new and strange by using words that are old and strange.",
  source=ATT_SRC, url=AT, quote="He introduces the new and strange by", page="ch. 7 'Science Fantasy', p. 124", kind="analysis",
  polarity="asserts", date="1992", routeHint="archive.org _djvu.txt", registerHint="none", confidence="high")

C(feature="diction (native vs latinate)", claim="Attebery describes Wolfe's archaic half-familiar words - fuligin, lazaret, hierodule, pelerine - as mostly Latinate.",
  source=ATT_SRC, url=AT, quote="fuligin, lazaret, hierodule, and pelerine", page="ch. 7 'Science Fantasy', p. 124", kind="analysis",
  polarity="asserts", date="1992", routeHint="archive.org _djvu.txt", registerHint="none", confidence="high")

C(feature="compounds and coinages", claim="Attebery says Wolfe generally invents by reusing what is forgotten rather than by coining.",
  source=ATT_SRC, url=AT, quote="Wolfe generally invents by reusing", page="ch. 7 'Science Fantasy', p. 124", kind="analysis",
  polarity="asserts", date="1992", routeHint="archive.org _djvu.txt", registerHint="none", confidence="high")

# ---------------- CLAIMS: ANDRE-DRIUSSI ----------------
C(feature="archaism", claim="Andre-Driussi reports Wolfe denying that the Lexicon's entries were guesses, saying instead that Andre-Driussi looks things up.",
  source="Gene Wolfe, reported in 'Tell me about the Lexicon Urthus': an interview with Michael Andre-Driussi, Ultan's Library, 2008",
  url=ULX, quote="No, not at all – he looks things up!", page="interview, reply on the 1991 World Fantasy Convention", kind="own-words",
  polarity="asserts", date="2008-09-25", routeHint="live ultan.org.uk HTML", registerHint="none", confidence="high")

C(feature="naming and forms of address", claim="The Ultan's Library interviewer describes one of Wolfe's naming schemes in the Urth Cycle as naming people in the Commonwealth after Catholic saints.",
  source="Ultan's Library (interviewer), interview with Michael Andre-Driussi, 2008", url=ULX,
  quote="naming people in the Commonwealth after Catholic saints", page="interview question", kind="analysis",
  polarity="asserts", date="2008-09-25", routeHint="live ultan.org.uk HTML", registerHint="dossier-archivist", confidence="high")

C(feature="annalist voice and deep time", claim="Andre-Driussi says one of the Lexicon's special articles is a history that puts all the posthistorical bits of the Urth Cycle into one place.",
  source="Michael Andre-Driussi, interview in Ultan's Library, 2008", url=ULX,
  quote="putting together all the posthistorical bits into one place", page="interview, on 'special articles and tables'", kind="own-words",
  polarity="asserts", date="2008-09-25", routeHint="live ultan.org.uk HTML", registerHint="dossier-archivist", confidence="high")

C(feature="other: reception scale", claim="Andre-Driussi says it took him eight years to sell all 1,000 copies of the first edition of Lexicon Urthus.",
  source="Michael Andre-Driussi, interview in Ultan's Library, 2008", url=ULX,
  quote="it took me eight years to sell all 1,000 copies!", page="interview, on reception", kind="own-words",
  polarity="asserts", date="2008-09-25", routeHint="live ultan.org.uk HTML", registerHint="none", confidence="high")

C(feature="other: critical method", claim="Joan Gordon divides Wolfe criticism into macro and micro kinds and places her own work on the macro side.",
  source="Joan Gordon, 'Micro-Wolfenomics', Ultan's Library, 2020", url=UGM,
  quote="There are two kinds of Wolfeian criticism: macro and micro", page="opening paragraph", kind="reception",
  polarity="asserts", date="2020-11-23", routeHint="live ultan.org.uk HTML", registerHint="none", confidence="high")

C(feature="point of view and distance", claim="Joan Gordon confirms in 2020 that her 1986 Starmont Reader's Guide proposed that the whole of Peace unspools from Weer taking the Thematic Apperception Test.",
  source="Joan Gordon, 'Micro-Wolfenomics', Ultan's Library, 2020", url=UGM,
  quote="the whole novel unspools from Weer", page="paragraph on the Peace chapter", kind="reception",
  polarity="asserts", date="2020-11-23", routeHint="live ultan.org.uk HTML", registerHint="none", confidence="high")
