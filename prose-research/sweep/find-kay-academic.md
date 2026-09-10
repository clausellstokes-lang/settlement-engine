# find-kay-academic — raw notes (Opus finder, 2026-09-06)

Subject: Guy Gavriel Kay's prose. Angle: academic and scholarly criticism.
Output of record: sweep/found-kay-academic.json (complete:true, 29 sources, 52 claims).
Local raw text of every fetched page: sweep/kay/*.txt (get.py = curl + html-to-text + pdfminer/pypdf).

## Roster construction
The angle named no individual titles. Roster built from:
- BrightWeavings "Professional Scholarship" index (20 items) + "Student Papers" index (17 items). BrightWeavings is the authorized site and hosts full authorized reprints of otherwise hard-to-reach journal pieces (Canadian Literature 129, Foundation Summer 2005, Anabases 5, The Ringbearer, NYRSF).
- OpenAlex search "Guy Gavriel Kay" (80 works, two pages walked) + per-novel searches.
- Crossref bibliographic queries.
- Wikipedia (Kay, Tigana) as relay — thin, biographical only, nothing on register.

## What the literature actually contains
The Kay scholarship is overwhelmingly THEMATIC (history/memory/nation, religion, gender, Arthurian
inversion, genre hybridity). The prose-register evidence is concentrated in the NARRATOLOGICAL strand:
Randall 1991 -> Toyryla 2017 -> Kleander 2008 -> Rettino 2012. That strand is where the useful claims are.

## The three findings the synthesis should notice
1. PLAINNESS IS A FUNCTION OF DISTANCE, NOT OF SUBJECT. Randall: at Darien's death "Sentences are short,
   description is concrete", tone "matter-of-fact" — and the *high style* passage a few pages later is
   magnificent only "because it is perceived by minds capable of comprehending magnificence". Toyryla
   independently: a window shift out of Ettocio's consciousness "enables the matter-of-fact description of
   his execution". Same mechanism, two critics, twenty-six years apart.
2. THE NARRATOR IS A CIVIC INSIDER, NOT AN OUTSIDE SURVEYOR. Toyryla: "the narrator describes things like
   an inhabitant of that world would"; the phrase "as everyone knows" makes the narrator's perspective
   "concur with that of an average citizen of the Palm" (she reaches for Palmer's "Middlemarch mind" and
   proposes "the Peninsula of the Palm mind"). Rettino: the narrator "resembles that of a historian in its
   distanced relation of events" and in Under Heaven "presents himself as one Kitan historian among many".
3. PLACE IS NAMED, NOT EXPLAINED. Pugar: the narrator "often refers to places without explaining where they
   are located", which "creates a feeling of reading a historical text with geographical references".
   That is the settlement-gazetteer effect, stated by a critic, not inferred.

Adjacent and useful: Toyryla on "according to most reports later" — the narrator restricting omniscience to
"what people hear about the incident afterwards", with an APPROXIMATE casualty figure; Malosse (Anabases)
choosing, as his single sample of Kay's style, a scene framed as a senator's memory; Kay's own LARB answer
that a conversation described by a second participant "isn't the same"; Kay in Locus 2025 on "the people at
the margins of history" and on loving "the chronicles of the dukes and the popes" too.

Counter-voice worth keeping: Campbell (Wollongong PhD 2013) argues the mythic ambience and literary
resonance OBSCURE the ethnic and gender imbalances of an episode — register as concealment.

## Hazards recorded for the verifier
- Several BrightWeavings pages are STUBS with an excerpt + a link (Cawsey -> PDF, Borowska-Szerszun ->
  academia.edu). Read the linked file, not the stub.
- pugar.txt, uow.txt and urfu.txt come from PDF extraction with DOUBLED inter-word spaces. Every quotation
  taken from them was chosen from a line that survives single-spaced; where no such line existed the quote
  field was left empty rather than risk a spacing mismatch (Campbell "ambience obscures", Doshlova).
- The Locus page contains SOFT HYPHENS (U+00AD) inside words ("unwrit­ten"). Quotes were chosen to avoid them.
- Patton's "We See by Jad's Light Alone" is written INSIDE AN IN-WORLD CONCEIT (a Sarantine scholar reviewing
  Kay's book as a history). His sentence-level observations are real, the persona is not. Flagged at medium.
- ro.uow.edu.au returns an empty body for its own thesis PDF; the Figshare mirror
  (ndownloader.figshare.com/files/50372574) works.

## Blocked, with the ladder walked
- Gary K. Wolfe, "Guy Gavriel Kay: An Introduction", JFA 20.2 (2009). JSTOR issue page fails to render;
  OpenAlex's only landing page is Questia (defunct, no Wayback capture). NOT READ. This is the single
  largest gap: JFA 20.2 is a Kay special issue and its other articles were never enumerated.
- Toswell, "Guy Gavriel Kay: Historical Fantasy" (Amsterdam UP/De Gruyter 2025) and Borowska-Szerszun,
  "Remembering the Romance" (Boydell 2020): publisher pages return empty bodies; not in OAPEN or DOAB;
  Google Books API quota exhausted. NOT READ.
- Borowska-Szerszun, "When Gods are Absent" (2017): repository PDF is a 4.7 MB image-only scan (18 chars
  extracted). NOT READ.
- journals.openedition.org/anabases/3215: Anubis bot filter, no Wayback capture. Cured by the authorized
  English reprint on BrightWeavings.
- Johnston (Palgrave 2019) and Borowska-Szerszun (Orbis Litterarum 2026): ABSTRACT ONLY, marked as such.

## Negative finding
No stylometric, corpus-stylistic or computational study of Kay exists that OpenAlex, Crossref or open web
search surfaced. Every number in this angle is a hand count by a narratologist. Randall (1991): 26
focalizants in the Tapestry; 21 shifts in one 24-page chapter; 87 shifts across Darien's search with Darien
focalizant 9 times. Kleander (2008): 21 focalizants and more than 150 focalizations in Tigana.

## Next round should
- Get JFA 20.2 (2009) through a library proxy and enumerate the whole special issue.
- Get the Toswell 2025 chapter and the two Boydell chapters (Borowska-Szerszun on romance, and
  "Medievalisms and Romance Traditions in Ysabel").
- Chase Helen Siourbas, "More Than Just Survival: The Successful Quest for Voice in Kay's Tigana", in
  Worlds of Wonder (U Ottawa Press, 2004) — found in Johnston's bibliography, never fetched; the title
  promises a voice-and-register argument.
- OCR the Bialystok scan.
