import json, io

AML_ACTUSF="https://www.actusf.com/detail-d-un-article/Interview-de-Arnaud-Mousnier"
AML_ELB="https://www.elbakin.net/interview/exclusive/Interview-de-Arnaud-Mousnier-Lompre"
AML_FAN="https://www.fantastinet.com/interview-arnaud-mousnier-lompre/"
DUITS="https://studenttheses.uu.nl/handle/20.500.12932/11119"
UNIGE="https://archive-ouverte.unige.ch/unige:18417"
TKACH="https://vestnik-philology.mgu.od.ua/archive/v52/part_2/43.pdf"

sourcesRead=[
 {"title":"Interview de Arnaud Mousnier-Lompré (ActuSF, by Jérôme Vincent)","url":AML_ACTUSF,"kind":"own-words","substantive":True,"date":"2017-10-31","route":"direct curl with browser UA"},
 {"title":"Interview de Arnaud Mousnier-Lompré (Elbakin.net exclusive, by dwalan)","url":AML_ELB,"kind":"own-words","substantive":True,"date":"2010-02-02","route":"live URL 404; Wayback raw web/20250324130413id_/"},
 {"title":"Interview : Arnaud Mousnier-Lompre (Fantastinet, by Allan)","url":AML_FAN,"kind":"own-words","substantive":True,"date":"2006-03-28","route":"direct curl with browser UA"},
 {"title":"Iris Duits, 'Translating Robin Hobb's Assassin's Apprentice', BA thesis, Utrecht University","url":DUITS,"kind":"analysis","substantive":True,"date":"2012-04","route":"bitstream URL is a DSpace SPA shell; PDF via DSpace REST /server/api/core/bitstreams/f473796a-a2a2-4791-95bd-f039a6c27af8/content, text extracted with pypdf"},
 {"title":"Ткач П. Б., 'Стратегії перекладу поетонімів фентезійного циклу Робін Хобб «Світ Елдерлінгів»', Науковий вісник МГУ, Сер. Філологія, 2021 № 52 том 2, с. 182–185","url":TKACH,"kind":"analysis","substantive":True,"date":"2021","route":"live PDF Cloudflare-blocked; Wayback raw web/20231020191431id_/, pypdf"},
 {"title":"Sarah Jeanneret, 'La traduction des noms propres dans les romans de fantasy sur la base du roman Assassin's Apprentice de Robin Hobb', Master, ETI, Université de Genève","url":UNIGE,"kind":"analysis","substantive":True,"date":"2011-08","route":"PDF from access.archive-ouverte.unige.ch/access/metadata/6864df9c-3410-40b9-b86e-bd84aea32320/download, pypdf"},
]

C=[]
def c(**kw): C.append(kw)

# --- ActuSF, AML own words, 2017
c(feature="plainness and economy",
  claim="Arnaud Mousnier-Lompré, Hobb's French translator, says her style is very fluid, very clear and very vivid beneath simple appearances.",
  source="Arnaud Mousnier-Lompré, interviewed by Jérôme Vincent, ActuSF, 31 October 2017", url=AML_ACTUSF,
  quote="Robin a un style très fluide, très clair et très imagé", page="answer to 'Comment définiriez-vous son style ?'",
  kind="own-words", polarity="asserts", date="2017-10-31", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="point of view and distance",
  claim="Mousnier-Lompré says there is no judgment in Hobb's writing, only a setting-out of the facts.",
  source="Arnaud Mousnier-Lompré, interviewed by Jérôme Vincent, ActuSF, 31 October 2017", url=AML_ACTUSF,
  quote="pas de jugement chez elle, uniquement un exposé des faits", page="answer to 'Qu'est-ce qui vous plaît dans son univers ?'",
  kind="own-words", polarity="asserts", date="2017-10-31", routeHint="direct curl with browser user agent",
  registerHint="dossier-archivist", confidence="high")
c(feature="archaism",
  claim="Mousnier-Lompré describes Hobb's style as clear and almost nineteenth-century, though lighter.",
  source="Arnaud Mousnier-Lompré, interviewed by Jérôme Vincent, ActuSF, 31 October 2017", url=AML_ACTUSF,
  quote="elle a un style clair, presque 19ème siècle", page="answer to 'Parlons un peu de style'",
  kind="own-words", polarity="asserts", date="2017-10-31", routeHint="direct curl with browser user agent",
  registerHint="chronicle-line", confidence="high")
c(feature="other: comparison to a literary model",
  claim="Mousnier-Lompré says he often compares Hobb to Marguerite Yourcenar for her writing and for the depth of her analysis.",
  source="Arnaud Mousnier-Lompré, interviewed by Jérôme Vincent, ActuSF, 31 October 2017", url=AML_ACTUSF,
  quote="à Marguerite Yourcenar pour son écriture et pour la profondeur", page="answer to 'Comment définiriez-vous son style ?'",
  kind="own-words", polarity="asserts", date="2017-10-31", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="concrete sensory noun",
  claim="Mousnier-Lompré says that with Hobb he often has to research plant names, and asks her directly for the Latin name.",
  source="Arnaud Mousnier-Lompré, interviewed by Jérôme Vincent, ActuSF, 31 October 2017", url=AML_ACTUSF,
  quote="j'ai souvent à rechercher des noms de plantes", page="answer to 'Avez-vous besoin de beaucoup de documentation ?'",
  kind="own-words", polarity="asserts", date="2017-10-31", routeHint="direct curl with browser user agent",
  registerHint="dossier-archivist", confidence="high")

# --- Elbakin, AML own words, 2010
c(feature="translation and register",
  claim="Mousnier-Lompré says he makes a point of Frenchifying the names Hobb invents, whether proper nouns or common nouns.",
  source="Arnaud Mousnier-Lompré, interviewed by dwalan, Elbakin.net exclusive interview, 2 February 2010", url=AML_ELB,
  quote="je m'efforce de franciser les noms que Robin invente", page="answer on the word 'marguet'",
  kind="own-words", polarity="asserts", date="2010-02-02", routeHint="live URL now 404; Wayback raw capture 20250324130413id_",
  registerHint="none", confidence="high")
c(feature="other: invented-world naming premise",
  claim="Mousnier-Lompré grounds his naming policy on the premise that the world Hobb describes does not exist.",
  source="Arnaud Mousnier-Lompré, interviewed by dwalan, Elbakin.net exclusive interview, 2 February 2010", url=AML_ELB,
  quote="le monde qu'elle décrit n'existe pas", page="answer on the word 'marguet'",
  kind="own-words", polarity="asserts", date="2010-02-02", routeHint="Wayback raw capture 20250324130413id_",
  registerHint="none", confidence="high")
c(feature="compounds and coinages",
  claim="Mousnier-Lompré judged the literal French rendering of Hobb's 'hunting cat' as 'chat de chasse' not pretty, and coined 'marguet' instead.",
  source="Arnaud Mousnier-Lompré, interviewed by dwalan, Elbakin.net exclusive interview, 2 February 2010", url=AML_ELB,
  quote="en français, pas très joli", page="answer on the word 'marguet'",
  kind="own-words", polarity="asserts", date="2010-02-02", routeHint="Wayback raw capture 20250324130413id_",
  registerHint="none", confidence="high")
c(feature="concrete sensory noun",
  claim="Before naming Hobb's 'hunting cat' Mousnier-Lompré first asked Hobb how she pictured the animal.",
  source="Arnaud Mousnier-Lompré, interviewed by dwalan, Elbakin.net exclusive interview, 2 February 2010", url=AML_ELB,
  quote="j'ai demandé d'abord à Robin comment elle imaginait le bestiau", page="answer on the word 'marguet'",
  kind="own-words", polarity="asserts", date="2010-02-02", routeHint="Wayback raw capture 20250324130413id_",
  registerHint="none", confidence="high")
c(feature="naming and forms of address",
  claim="Mousnier-Lompré says he tries to render in French the overtones a Hobb name evokes for an English-speaking reader, turning 'colonel Haren' into 'Lièvrin'.",
  source="Arnaud Mousnier-Lompré, interviewed by dwalan, Elbakin.net exclusive interview, 2 February 2010", url=AML_ELB,
  quote="je tâche de rendre en français les harmoniques que ce nom évoque", page="answer on the word 'marguet'",
  kind="own-words", polarity="asserts", date="2010-02-02", routeHint="Wayback raw capture 20250324130413id_",
  registerHint="none", confidence="high")
c(feature="cadence and rhythm",
  claim="Mousnier-Lompré says Hobb writes very well and very clearly, in a settled, considered style.",
  source="Arnaud Mousnier-Lompré, interviewed by dwalan, Elbakin.net exclusive interview, 2 February 2010", url=AML_ELB,
  quote="très bien, très clairement, avec un style posé, réfléchi", page="answer on whether her writing has changed",
  kind="own-words", polarity="asserts", date="2010-02-02", routeHint="Wayback raw capture 20250324130413id_",
  registerHint="none", confidence="high")

# --- Fantastinet 2006
c(feature="translation and register",
  claim="Mousnier-Lompré says translating is not knowing the source language by heart but knowing the target language intimately.",
  source="Arnaud Mousnier-Lompré, interviewed by Allan, Fantastinet, 28 March 2006", url=AML_FAN,
  quote="Traduire, ce n’est pas connaître la langue d’origine par coeur", page="answer on becoming a translator",
  kind="own-words", polarity="asserts", date="2006-03-28", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="other: authorial consultation",
  claim="Mousnier-Lompré says that where the sense matters crucially, as with Hobb, he contacts the author to discuss a particular turn of phrase.",
  source="Arnaud Mousnier-Lompré, interviewed by Allan, Fantastinet, 28 March 2006", url=AML_FAN,
  quote="le sens a une importance cruciale, comme avec Robin", page="answer on contacting authors",
  kind="own-words", polarity="asserts", date="2006-03-28", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")
c(feature="other: translation method",
  claim="Mousnier-Lompré describes his method as a complete reading, then the translation, then one re-reading to polish.",
  source="Arnaud Mousnier-Lompré, interviewed by Allan, Fantastinet, 28 March 2006", url=AML_FAN,
  quote="Lecture intégrale, traduction au petit poil et une relecture", page="answer on how he proceeds",
  kind="own-words", polarity="asserts", date="2006-03-28", routeHint="direct curl with browser user agent",
  registerHint="none", confidence="high")

# --- Duits 2012
c(feature="civic record register",
  claim="Iris Duits says the introduction to the first chapter of Assassin's Apprentice almost reads like an encyclopaedia offering factual information on the Six Duchies.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="almost reads like an encyclopaedia, offering factual information on the Six Duchies", page="section 6, Translation criticism - Translation strategies, p.15",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="dossier-archivist", confidence="high")
c(feature="register modulation",
  claim="Duits observes that the start of every chapter of Assassin's Apprentice is in italics and offers encyclopaedic information on the Six Duchies.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="The start of every chapter is in italics and offers encyclopaedic information", page="section 6, p.17",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="dossier-archivist", confidence="high")
c(feature="archaism",
  claim="Duits says that even in English the language of that encyclopaedic chapter opening seems a bit archaic.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="Even in English, the language seems a bit archaic", page="section 6, p.15",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="chronicle-line", confidence="high")
c(feature="register modulation",
  claim="Duits's central criticism of the Dutch translators is that they do not change their style in the rest of the translation after the encyclopaedic opening.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="Feberwee and Cuijpers do not change their style in the rest", page="section 6, p.15",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="dossier-archivist", confidence="high")
c(feature="plainness and economy",
  claim="Duits judges Hobb's sentence 'I have spoiled another leaf of the fine stuff...' clear and to the point against its formal, wordy Dutch rendering.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="The English sentence is clear and to the point", page="section 6, p.16",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="none", confidence="high")
c(feature="consequence on a household",
  claim="Duits reports that the Dutch translators cut Hobb's clause about the narrator's wet shoes being a misery.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="The entire bit about the wet shoes is left out", page="section 6, p.16",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="none", confidence="high")
c(feature="place and institution description",
  claim="Duits reports that Stableford calls Hobb's novels elaborately detailed, and illustrates it with her description of the Chyurda mountain people.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012, citing Stableford p.200", url=DUITS,
  quote="elaborately detailed", page="section 2, p.6",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="dossier-archivist", confidence="high")
c(feature="concrete sensory noun",
  claim="Hobb's description of the Chyurda ends on the humblest of them wearing fine furs as if they were homespun.",
  source="Robin Hobb, Assassin's Apprentice p.383, quoted in Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="even the humblest wore fine furs as if they were", page="section 2, p.6",
  kind="relay", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="dossier-archivist", confidence="high")
c(feature="translation and register",
  claim="Duits says the Dutch translation Leerling en Meester is written in quite archaic language.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="written in quite archaic language", page="section 1, Introduction, p.3",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="none", confidence="high")
c(feature="other: word order",
  claim="Duits says the word order of the Dutch translation seems unnatural.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="The word order seems unnatural as well", page="section 1, Introduction, p.3",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="none", confidence="high")
c(feature="naming and forms of address",
  claim="Duits says that by preserving Lady Patience's name the Dutch translators made the virtue unrecognisable for most Dutch readers.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="the virtue becomes unrecognisable for most Dutch readers", page="section 5, p.11",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="none", confidence="high")
c(feature="naming and forms of address",
  claim="Duits reports the Dutch translators added information to King Shrewd's name, most likely to clarify the virtue associated with him.",
  source="Iris Duits, BA thesis, Utrecht University, April 2012", url=DUITS,
  quote="most likely to clarify the virtue associated with King Shrewd", page="section 6, p.13",
  kind="analysis", polarity="asserts", date="2012-04", routeHint="DSpace REST bitstream content endpoint, pypdf text",
  registerHint="none", confidence="high")

# --- Jeanneret 2011
c(feature="naming and forms of address",
  claim="Sarah Jeanneret says Hobb chose to give virtue names to the characters of the royal family.",
  source="Sarah Jeanneret, Master thesis, ETI, Université de Genève, August 2011", url=UNIGE,
  quote="a choisi de donner des noms de vertus aux personnages", page="section 3.7, Considérations dans une perspective macrotextuelle, p.65",
  kind="analysis", polarity="asserts", date="2011-08", routeHint="PDF from archive-ouverte.unige.ch access/metadata download endpoint, pypdf",
  registerHint="none", confidence="high")
c(feature="terminology consistency",
  claim="Jeanneret says the French translator kept Hobb's semantic coherence by translating nouns with nouns and adjectives with adjectives.",
  source="Sarah Jeanneret, Master thesis, ETI, Université de Genève, August 2011", url=UNIGE,
  quote="Il a traduit les substantifs par des substantifs", page="section 3.7, p.65",
  kind="analysis", polarity="asserts", date="2011-08", routeHint="PDF from archive-ouverte.unige.ch access/metadata download endpoint, pypdf",
  registerHint="none", confidence="high")
c(feature="naming and forms of address",
  claim="Jeanneret says the names of Hobb's noble characters generally carry a sense while those of the lower classes do not.",
  source="Sarah Jeanneret, Master thesis, ETI, Université de Genève, August 2011", url=UNIGE,
  quote="Les noms des gens de la noblesse", page="section 3.7, p.67",
  kind="analysis", polarity="asserts", date="2011-08", routeHint="PDF from archive-ouverte.unige.ch access/metadata download endpoint, pypdf",
  registerHint="none", confidence="high")
c(feature="per-speaker register",
  claim="Jeanneret says Hobb gives the mountain people names of a different sonority, which lets her distinguish them from characters of the citadel.",
  source="Sarah Jeanneret, Master thesis, ETI, Université de Genève, August 2011", url=UNIGE,
  quote="ont des noms aux sonorités différentes", page="section 3.7, p.67",
  kind="analysis", polarity="asserts", date="2011-08", routeHint="PDF from archive-ouverte.unige.ch access/metadata download endpoint, pypdf",
  registerHint="none", confidence="high")
c(feature="naming and forms of address",
  claim="Jeanneret says most of Hobb's main characters have names that carry a sense while the secondary characters' names do not.",
  source="Sarah Jeanneret, Master thesis, ETI, Université de Genève, August 2011", url=UNIGE,
  quote="la plupart des personnages principaux ont des noms qui possèdent un sens", page="section 3.7, p.66",
  kind="analysis", polarity="asserts", date="2011-08", routeHint="PDF from archive-ouverte.unige.ch access/metadata download endpoint, pypdf",
  registerHint="none", confidence="high")
c(feature="place and institution description",
  claim="The Italian translator Paola Cartoceti says most of the person and place names in Robin Hobb mean something.",
  source="Paola Cartoceti's blog sbcreations.blogspot.com, quoted in Sarah Jeanneret, Master thesis, Université de Genève, August 2011", url=UNIGE,
  quote="nomi di persona o di luogo in Robin Hobb significa qualcosa", page="section 3.1, Introduction to the analysis, p.34",
  kind="relay", polarity="asserts", date="2011-08", routeHint="PDF from archive-ouverte.unige.ch access/metadata download endpoint, pypdf",
  registerHint="dossier-archivist", confidence="high")
c(feature="translation and register",
  claim="Jeanneret says the French and Italian translators generally made the same choice, to privilege sense over form in Hobb's names.",
  source="Sarah Jeanneret, Master thesis, ETI, Université de Genève, August 2011", url=UNIGE,
  quote="les deux traducteurs ont généralement opéré le même choix", page="section 3.7, p.64",
  kind="analysis", polarity="asserts", date="2011-08", routeHint="PDF from archive-ouverte.unige.ch access/metadata download endpoint, pypdf",
  registerHint="none", confidence="high")

# --- Tkach 2021
c(feature="civic record register",
  claim="Tkach quotes a chapter epigraph in which Hobb warns that to speak of the Mountain Kingdom as a kingdom is to start from a basic misunderstanding of the area and its folk.",
  source="Robin Hobb, chapter epigraph, quoted in Ткач П. Б., Науковий вісник МГУ, Сер. Філологія, 2021 № 52 том 2, с. 184", url=TKACH,
  quote="To speak of the Mountain Kingdom as a kingdom is to start out", page="p.184, section on калькування",
  kind="relay", polarity="asserts", date="2021", routeHint="Wayback raw capture 20231020191431id_ of the journal PDF, pypdf",
  registerHint="dossier-archivist", confidence="high")
c(feature="annalist voice and deep time",
  claim="Tkach quotes a Hobb epigraph attributing the Farseer naming custom to accident according to a more ancient tradition.",
  source="Robin Hobb, chapter epigraph, quoted in Ткач П. Б., Науковий вісник МГУ, 2021 № 52 том 2, с. 183", url=TKACH,
  quote="A more ancient tradition attributes such names to accident", page="p.183, section on семантична експлікація",
  kind="relay", polarity="asserts", date="2021", routeHint="Wayback raw capture 20231020191431id_ of the journal PDF, pypdf",
  registerHint="chronicle-line", confidence="high")
c(feature="naming and forms of address",
  claim="Tkach concludes that the Ukrainian translators' predominant foreignization destroys the author's onymic models in the translated text.",
  source="Ткач П. Б., Науковий вісник МГУ, Сер. Філологія, 2021 № 52 том 2, с. 185", url=TKACH,
  quote="призводить до руйнування авторських онімічних моделей", page="Висновки, p.185",
  kind="analysis", polarity="asserts", date="2021", routeHint="Wayback raw capture 20231020191431id_ of the journal PDF, pypdf",
  registerHint="none", confidence="high")
c(feature="naming and forms of address",
  claim="Tkach says the Ukrainian translator indicates the meaning of the prefix Fitz only in the endnotes.",
  source="Ткач П. Б., Науковий вісник МГУ, Сер. Філологія, 2021 № 52 том 2, с. 183", url=TKACH,
  quote="Перекладач лише в прикінцевих примітках указує на значення", page="p.183",
  kind="analysis", polarity="asserts", date="2021", routeHint="Wayback raw capture 20231020191431id_ of the journal PDF, pypdf",
  registerHint="none", confidence="high")
c(feature="naming and forms of address",
  claim="Tkach says the Ukrainian translator supplemented King Shrewd's name with an epithet of the kind real historical kings carried.",
  source="Ткач П. Б., Науковий вісник МГУ, Сер. Філологія, 2021 № 52 том 2, с. 183", url=TKACH,
  quote="перекладач доповнив ім’я короля прізвиськом", page="p.183, section on семантична експлікація",
  kind="analysis", polarity="asserts", date="2021", routeHint="Wayback raw capture 20231020191431id_ of the journal PDF, pypdf",
  registerHint="chronicle-line", confidence="high")

out={"complete":False,
 "coverage":"IN PROGRESS after 6 sources. Roster: ActuSF FETCHED, Elbakin.net FETCHED via Wayback (live 404), Fantastinet FETCHED, Duits thesis (Feberwee/Cuijpers) FETCHED via DSpace REST, Tkach 2021 FETCHED via Wayback (live Cloudflare-blocked), UNIGE Jeanneret FETCHED. Chandarana & Choudhary still outstanding; lateral expansion not yet begun.",
 "sourcesRead":sourcesRead, "claims":C}
json.dump(out, open('found-hobb-translators.json','w'), ensure_ascii=False, indent=1)
print(len(C), 'claims', len(sourcesRead),'sources')
