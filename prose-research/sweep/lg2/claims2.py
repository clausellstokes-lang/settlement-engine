# -*- coding: utf-8 -*-
U_BP = "https://web.archive.org/web/20250524152425id_/https://www.enotes.com/topics/ursula-k-le-guin/criticism/criticism/nora-barry-and-mary-prescott-essay-date-summer"
S_BP = "Nora Barry and Mary Prescott, 'Beyond Words: The Impact of Rhythm as Narrative Technique in The Left Hand of Darkness', Extrapolation 33.2 (Summer 1992), 154-65, read in the eNotes reprint"
R_BP = "Wayback raw capture of the eNotes criticism page (live eNotes returns HTTP 403; Project MUSE and Google Books both blocked)"

U_SH = "https://umontreal.scholaris.ca/bitstreams/10650907-762f-43fa-942e-b550e1b0b78a/download"
S_SH = "Catherine A. Sheckler, 'Dancing on the Edge of the Word: Ursula K. Le Guin and Metaphor', PhD thesis, Universite de Montreal, 31 August 2018"
R_SH = "OpenAlex best_oa_location PDF, fetched and text-extracted"

U_KU = "http://intelektn.donnuet.edu.ua/index.php/intelekt/article/download/29/29"
S_KU = "M. O. Kuts and M. I. Uholkova, 'Language means of expression while emotional implied sense creation in the works of the Hainish cycle by Ursula K. Le Guin', Intelekt XXI 2(21) 2020, DOI 10.33274/2079-4835-2020-21-2-27-37"
R_KU = "OpenAlex OA PDF; body is in Ukrainian, the English-language abstract was read"

CLAIMS2 = [
 dict(_file="enotes-bp.txt", feature="civic record register",
  claim="Barry and Prescott describe the field notes that make up chapter seven of The Left Hand of Darkness as impersonal, anthropological, clinical and quite explicit.",
  source=S_BP, url=U_BP, quote="impersonal, anthropological, clinical, and quite explicit", page="section on 'The Question of Sex'",
  kind="analysis", polarity="asserts", date="1992-06", routeHint=R_BP,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="enotes-bp.txt", feature="register modulation",
  claim="Barry and Prescott say the report chapter is conventionally organized, moving from facts to possible conclusions, and stands in stark contrast to the personal narratives around it.",
  source=S_BP, url=U_BP, quote="moving as it does from facts to possible conclusions", page="section on 'The Question of Sex'",
  kind="analysis", polarity="asserts", date="1992-06", routeHint=R_BP,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="enotes-bp.txt", feature="register modulation",
  claim="Barry and Prescott argue that the single sentence in which the report writer names her own gender is not in keeping with the objective tone of the rest of the report.",
  source=S_BP, url=U_BP, quote="not in keeping with the objective tone of the rest", page="section on 'The Question of Sex'",
  kind="analysis", polarity="asserts", date="1992-06", routeHint=R_BP,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="enotes-bp.txt", feature="repetition and refrain",
  claim="Barry and Prescott define narrative rhythm as repetition with enough variation to preclude a hardening into symbolism.",
  source=S_BP, url=U_BP, quote="repetition with enough variation to preclude a hardening into symbolism", page="section defining rhythm after the Forster quotation",
  kind="analysis", polarity="asserts", date="1992-06", routeHint=R_BP,
  registerHint="chronicle-line", confidence="high"),

 dict(_file="enotes-bp.txt", feature="place and institution description",
  claim="Barry and Prescott say the novel's opening pages describe a public ceremony and introduce a counterpoint between fact and personal response.",
  source=S_BP, url=U_BP, quote="the counterpoint between fact and personal response", page="section on the contrapuntal technique",
  kind="analysis", polarity="asserts", date="1992-06", routeHint=R_BP,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="enotes-bp.txt", feature="point of view and distance",
  claim="Barry and Prescott read Genly Ai's self-interruption over the word man as demonstrating his struggle as reporter to work within dichotomous ways of thinking.",
  source=S_BP, url=U_BP, quote="his struggle as reporter to work within logical, dichotomous ways", page="section on the contrapuntal technique",
  kind="analysis", polarity="asserts", date="1992-06", routeHint=R_BP,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="enotes-bp.txt", feature="repetition and refrain",
  claim="Barry and Prescott credit Le Guin's rhythmic reuse of the keystone image with establishing Estraven's personal, political and mythic power.",
  source=S_BP, url=U_BP, quote="rhythmic use of the keystone image establishes without question", page="section on the keystone",
  kind="analysis", polarity="asserts", date="1992-06", routeHint=R_BP,
  registerHint="chronicle-line", confidence="high"),

 dict(_file="enotes-bp.txt", feature="concrete sensory noun",
  claim="Barry and Prescott quote Estraven answering the question of loving a country with a list of concrete particulars rather than an abstraction.",
  source="Nora Barry and Mary Prescott quoting The Left Hand of Darkness (p. 211), Extrapolation 33.2 (Summer 1992), read in the eNotes reprint",
  url=U_BP, quote="I know people, I know towns, farms, hills and rivers", page="block quotation in the section on shadow",
  kind="analysis", polarity="applies", date="1992-06", routeHint=R_BP,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="enotes-bp.txt", feature="terminology consistency",
  claim="Barry and Prescott quote Genly Ai defining shifgrethor as the untranslatable and all-important principle of social authority in Karhide.",
  source="Nora Barry and Mary Prescott quoting The Left Hand of Darkness (p. 14), Extrapolation 33.2 (Summer 1992), read in the eNotes reprint",
  url=U_BP, quote="the untranslatable and all-important principle of social authority", page="section on shifgrethor",
  kind="analysis", polarity="applies", date="1992-06", routeHint=R_BP,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="metaphor.txt", feature="civic record register",
  claim="Catherine Sheckler describes the Telling in Le Guin's The Telling as an oral and written collection of knowledge acting as library, archive and instructional guide.",
  source=S_SH, url=U_SH, quote="acts as library, archive, and instructional guide", page="chapter 4, 'What There Is To Know', p. 180",
  kind="analysis", polarity="asserts", date="2018-08-31", routeHint=R_SH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="metaphor.txt", feature="other: non-linear record structure",
  claim="Sheckler says the interior stories forming the core knowledge-bank of Aka are non-Aristotelian in their structure.",
  source=S_SH, url=U_SH, quote="non-Aristotelian in their structure", page="chapter 4, p. 180",
  kind="analysis", polarity="asserts", date="2018-08-31", routeHint=R_SH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="metaphor.txt", feature="other: narrative structure",
  claim="Sheckler holds that Le Guin's novels, stories and essays are in general usually recognizably Aristotelian in their scaffolding.",
  source=S_SH, url=U_SH, quote="usually recognizably Aristotelian, with the familiar", page="chapter 4, p. 180",
  kind="analysis", polarity="asserts", date="2018-08-31", routeHint=R_SH,
  registerHint="none", confidence="high"),

 dict(_file="metaphor.txt", feature="register modulation",
  claim="Sheckler describes Always Coming Home as a culture safeguarded and expanded by multiple views and multiple tellers.",
  source=S_SH, url=U_SH, quote="safeguarded in and expanded by multiple views, multiple tellers", page="chapter 4, footnote 93",
  kind="analysis", polarity="asserts", date="2018-08-31", routeHint=R_SH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="metaphor.txt", feature="adjective and adverb discipline",
  claim="Sheckler quotes The Telling reporting that on Aka good was always an adjective attached to ordinary things and never a capitalised entity.",
  source="Catherine A. Sheckler quoting Le Guin's The Telling (p. 105), PhD thesis, Universite de Montreal, 2018",
  url=U_SH, quote="good was always an adjective, always: good food, good health", page="chapter 3, footnote on p. 127",
  kind="analysis", polarity="applies", date="2018-08-31", routeHint=R_SH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="hainish.txt", feature="metaphor discipline",
  claim="Kuts and Uholkova judge The Left Hand of Darkness extremely rich in means of artistic expression, among which metaphors stand out.",
  source=S_KU, url=U_KU, quote="rich in means of artistic expression, among which", page="English abstract, p. 37",
  kind="analysis", polarity="asserts", date="2020", routeHint=R_KU,
  registerHint="none", confidence="medium"),

 dict(_file="hainish.txt", feature="other: frame semantics method",
  claim="Kuts and Uholkova analyse Le Guin's linguistic and stylistic features using Charles Fillmore's frame semantics.",
  source=S_KU, url=U_KU, quote="the idea of   frame semantics, developed by Charles Fillmore", page="English abstract, p. 37",
  kind="measurement", polarity="applies", date="2020", routeHint=R_KU,
  registerHint="none", confidence="medium"),
]
