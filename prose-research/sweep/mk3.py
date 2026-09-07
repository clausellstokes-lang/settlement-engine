import json
d=json.load(open('found-hobb-translators.json'))
S=d['sourcesRead']; C=d['claims']
def s(**kw): S.append(kw)
def c(**kw): C.append(kw)

CART="https://sbcreations.blogspot.com/p/traduzione-robin-hobb.html"
ES="https://caballerodelarbolsonriente.blogspot.com/2024/12/robin-hobb-volvera-publicarse-en.html"
MDLR1="https://www.elrastreadordeletras.com/2018/07/entrevista-manuel-de-los-reyes-traductor.html"
MDLRR="http://www.manueldelosreyes.com/p/resenas.html"
TE="https://hrdc.gujaratuniversity.ac.in/Publication/article?id=10089"
FAB="https://carlabatallerestruch.com/2016/05/27/la-trilogia-del-vatidico-de-robin-hobb/"
DUITS="https://studenttheses.uu.nl/handle/20.500.12932/11119"
EKMAN="https://digitalcollections.sulross.edu/digital/collection/facultypubs/id/4/"
MDLR2="https://athnecdotario.wordpress.com/2016/11/14/entrevista-a-manuel-de-los-reyes-traductor/"
ELBRH="https://www.elbakin.net/interview/traduction/Interview-de-Robin-Hobb-pour-Dragon-Keeper"

s(title="Paola Cartoceti, 'TRADUZIONE ROBIN HOBB' (the Italian translator's own page on her Hobb translations), Sane Inside Insanity", url=CART, kind="own-words", substantive=True, date="last updated March 2011", route="direct curl with browser UA")
s(title="Daniel Garrido, 'Robin Hobb volverá a publicarse en español gracias a Nocturna', El Caballero del Árbol Sonriente", url=ES, kind="reception", substantive=True, date="2024-12-13", route="direct curl with browser UA")
s(title="Interview with Manuel de los Reyes, Spanish translator of Hobb, El Rastreador de Letras", url=MDLR1, kind="own-words", substantive=True, date="2018-07", route="direct curl with browser UA")
s(title="Manuel de los Reyes, 'Reseñas de mi trabajo' (collected reviews of his translations)", url=MDLRR, kind="reception", substantive=True, date="accessed 2026-09-06", route="direct curl with browser UA")
s(title="Twinkle Chandarana and Madhurita Choudhary, 'Employment of the Tolkienian Tools in the Nuanced Study of Robin Hobb's The Farseer Trilogy', Towards Excellence vol.14 issue 2, June 2022 — ABSTRACT ONLY", url=TE, kind="analysis", substantive=False, date="2022-06", route="landing page and abstract read raw; the PDF Downloader endpoint returns the site shell under direct, Referer and cookie-jar routes, and the Internet Archive holds no capture — full text BLOCKED")
s(title="Carla Bataller Estruch, 'La trilogía del Vatídico, de Robin Hobb', Fábulas estelares", url=FAB, kind="reader", substantive=True, date="2016-05-27", route="direct curl with browser UA")
s(title="Stefan Ekman and Audrey I. Taylor, 'Between World and Narrative: Fictional Epigraphs and Critical World-Building', Journal of the Fantastic in the Arts (2021)", url=EKMAN, kind="analysis", substantive=False, date="2021", route="diva-portal PDF timed out; fetched via digitalcollections.sulross.edu api/collection/facultypubs/id/4/download, pypdf — read in full and it does NOT discuss Hobb (the only 'Hobb' string is inside 'Hobbits'), so it yields nothing for this subject")
s(title="Interview with Manuel de los Reyes, Athnecdotario Incoherente", url=MDLR2, kind="own-words", substantive=False, date="2016-11-14", route="direct curl with browser UA — read in full, Hobb appears only in the biography and tag list, no substantive statement about her prose")
s(title="Interview de Robin Hobb pour 'La Cité des Anciens', Elbakin.net (French rendering of an English interview)", url=ELBRH, kind="own-words", substantive=False, date="Wayback capture 2025-04-25", route="live URL 404; Wayback raw web/20250425063956id_ — read, but it carries no discussion of translation or sentence style beyond the translation credit")

# --- Cartoceti, the Italian translator's own page
c(feature="naming and forms of address",
  claim="Paola Cartoceti, Hobb's Italian translator, says the main problem of the job was the names.",
  source="Paola Cartoceti, 'TRADUZIONE ROBIN HOBB', Sane Inside Insanity, last updated March 2011", url=CART,
  quote="Il problema principale sono stati i nomi", page="opening paragraphs",
  kind="own-words", polarity="asserts", date="2011-03", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="place and institution description",
  claim="Cartoceti says most of the person or place names in Robin Hobb mean something, and that there is a very good probability the meaning is the object of a pun.",
  source="Paola Cartoceti, 'TRADUZIONE ROBIN HOBB', Sane Inside Insanity, last updated March 2011", url=CART,
  quote="La maggior parte dei nomi di persona o di luogo in Robin Hobb significa qualcosa", page="opening paragraphs",
  kind="own-words", polarity="asserts", date="2011-03", routeHint="direct curl with browser user agent",
  registerHint="dossier-archivist", confidence="high")
c(feature="naming and forms of address",
  claim="Cartoceti's system was to leave the plainly popular names untranslated and to work on those meant to carry a meaning.",
  source="Paola Cartoceti, 'TRADUZIONE ROBIN HOBB', Sane Inside Insanity, last updated March 2011", url=CART,
  quote="non tradurre i nomi palesemente \"popolari\"", page="opening paragraphs",
  kind="own-words", polarity="asserts", date="2011-03", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="diction (native vs latinate)",
  claim="Cartoceti says she drew her Italian names from different languages, not only English but Latin and French, because the original already has different shades in the possible origins of its names.",
  source="Paola Cartoceti, 'TRADUZIONE ROBIN HOBB', Sane Inside Insanity, last updated March 2011", url=CART,
  quote="ho usato nomi tratti da lingue diverse, non soltanto l'inglese ma anche il latino", page="opening paragraphs",
  kind="own-words", polarity="asserts", date="2011-03", routeHint="direct curl with browser user agent",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="Cartoceti says she translated the names of all Six Duchies, often not literally but by assonance, giving Shoaks as Costabassa after 'shoals'.",
  source="Paola Cartoceti, 'TRADUZIONE ROBIN HOBB', Sane Inside Insanity, last updated March 2011", url=CART,
  quote="Ho tradotto i nomi di tutti i Sei Ducati, spesso non letteralmente ma per assonanza", page="entry on Chalced",
  kind="own-words", polarity="asserts", date="2011-03", routeHint="direct curl with browser user agent",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="Cartoceti left the place name Chalced untranslated on the reasoning that a less familiar name would help the impression of a bordering country always regarded as foreign and often hostile.",
  source="Paola Cartoceti, 'TRADUZIONE ROBIN HOBB', Sane Inside Insanity, last updated March 2011", url=CART,
  quote="lasciare un nome meno familiare avrebbe aiutato questa impressione", page="entry on Chalced",
  kind="own-words", polarity="asserts", date="2011-03", routeHint="direct curl with browser user agent",
  registerHint="dossier-archivist", confidence="high")
c(feature="naming and forms of address",
  claim="Cartoceti reports that Hobb told her at Parma Fantasy 2010 that she likes leaving readers free to interpret and even to pronounce the names as they wish.",
  source="Robin Hobb in conversation at Parma Fantasy 2010, reported by Paola Cartoceti, 'TRADUZIONE ROBIN HOBB'", url=CART,
  quote="lei ama lasciare ai lettori la libertà di interpretare", page="UPDATE at the end of the Fallstar entry",
  kind="relay", polarity="asserts", date="2011-03", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="medium", )

# --- Spanish edition and translator
c(feature="edition and house style",
  claim="The Spanish Nocturna edition of the Farseer trilogy announced for May 2025 carries Manuel de los Reyes's revised translation rather than a new one.",
  source="Daniel Garrido, El Caballero del Árbol Sonriente, 13 December 2024", url=ES,
  quote="con la traducción revisada de Manuel de los Reyes", page="announcement paragraph",
  kind="reception", polarity="asserts", date="2024-12-13", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="translation and register",
  claim="Manuel de los Reyes says the first Robin Hobb titles he translated set him challenges without which he is sure he would not now practise his craft as he does.",
  source="Manuel de los Reyes, interviewed by El Rastreador de Letras, July 2018", url=MDLR1,
  quote="los primeros títulos de Robin Hobb y Jonathan Carroll que pasaron por mis manos", page="answer 14, on the book he most enjoyed translating",
  kind="own-words", polarity="asserts", date="2018-07", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="translation and register",
  claim="De los Reyes calls the works of Hobb and Jonathan Carroll equally demanding, each in its own way.",
  source="Manuel de los Reyes, interviewed by El Rastreador de Letras, July 2018", url=MDLR1,
  quote="tan distintas entre sí pero igual de exigentes cada una a su propia manera", page="answer 14",
  kind="own-words", polarity="asserts", date="2018-07", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="terminology consistency",
  claim="A Spanish review of Fool's Fate collected on the translator's own site credits keeping one translation team across the trilogy with holding the terms, the names and the narrative voice steady.",
  source="Review of 'La suerte del bufón' in Sagacomic, quoted on Manuel de los Reyes's 'Reseñas de mi trabajo' page", url=MDLRR,
  quote="mantener el criterio de la traducción, los términos y nombres, y la voz narrativa", page="collected review quotations",
  kind="reception", polarity="asserts", date="accessed 2026-09-06", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")

# --- Duits' own epigraph translation
c(feature="civic record register",
  claim="Duits's own Dutch rendering of the first epigraph opens by asserting that a history of the Six Duchies is necessarily a history of its rulers.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012, section 7 'Translation - Passage one'", url=DUITS,
  quote="Een geschiedenis van de Zes Hertogdommen is noodzakelijkerwijs een geschiedenis", page="section 7, p.19",
  kind="analysis", polarity="applies", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf",
  registerHint="dossier-archivist", confidence="high")

# --- Chandarana abstract only
c(feature="other: genre convention",
  claim="Chandarana and Choudhary's abstract says the Farseer trilogy tries to follow the traditional approach while also making a deliberate effort to establish integral modernistic features.",
  source="Twinkle Chandarana and Madhurita Choudhary, Towards Excellence 14.2 (June 2022), abstract", url=TE,
  quote="there is also a deliberate effort to establish integral modernistic features", page="abstract",
  kind="analysis", polarity="asserts", date="2022-06", routeHint="landing page read raw; the full PDF is blocked, so this claim rests on the abstract only",
  registerHint="none", confidence="low", )

# --- reader
c(feature="point of view and distance",
  claim="A Spanish reader-critic calls the Farseer trilogy the chronicle of a life, narrated in the first person by an adult Fitz so the reader knows only what he knows.",
  source="Carla Bataller Estruch, 'La trilogía del Vatídico, de Robin Hobb', Fábulas estelares, 27 May 2016", url=FAB,
  quote="la crónica de una vida", page="section 'El tipo de historia y de narración'",
  kind="reader", polarity="asserts", date="2016-05-27", routeHint="direct curl with browser user agent",
  registerHint="chronicle-line", confidence="high")

d['sourcesRead']=S; d['claims']=C
d['complete']=True
d['coverage']=("Named roster all fetched but one: Mousnier-Lompré at ActuSF (direct), at Elbakin.net (live 404, recovered via Wayback raw) and at Fantastinet (direct); the Duits thesis naming Feberwee and Cuijpers (bitstream URL is a DSpace SPA shell, recovered through the DSpace REST bitstream endpoint); Tkach 2021 NV MHU 52(2) 182-185 (live PDF Cloudflare-blocked, recovered via Wayback raw); the UNIGE Jeanneret thesis (PDF from the access.archive-ouverte download endpoint). "
 "BLOCKED: Chandarana and Choudhary, Towards Excellence 14.2 - the landing page and abstract read raw, but the Downloader endpoint returns the site shell under direct, Referer and cookie-jar routes and the Internet Archive holds no capture, so only the abstract is behind its one low-confidence claim. "
 "21 sources read, 17 substantive. By route: named roster 6 substantive; bibliography chasing from the Fedwren Project 3 (Kok, Oliver, and the Fedwren Project itself); lateral searches 8 (Hobb's own 2017 Phantastik-Couch interview in English original and German, the Penhaligon Lektorat interview, Paola Cartoceti's own translator page, the Spanish Nocturna announcement, the Manuel de los Reyes interview and his collected-reviews page, and one reader review); 4 fetched and found non-substantive (Ekman and Taylor, the second de los Reyes interview, the Elbakin Hobb interview, and Chandarana at abstract level). "
 "Stopped when the roster was exhausted and the last two searches surfaced one usable source and none; the web-search budget then ran out. The single richest find is Hobb's own account of what her French translator does to her sentences.")
json.dump(d, open('found-hobb-translators.json','w'), ensure_ascii=False, indent=1)
print(len(C),'claims',len(S),'sources', sum(1 for x in S if x['substantive']),'substantive')
