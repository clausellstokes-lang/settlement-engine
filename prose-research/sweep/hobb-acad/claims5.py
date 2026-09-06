# -*- coding: utf-8 -*-
GA_URL="https://revistas.ucm.es/index.php/ESTR/article/download/53002/48655"
GA_SRC="Inmaculada Garnes, 'Analisis pragmatico contrastivo ingles/espanol de la intensificacion verbal en textos literarios', Estudios de Traduccion 6 (2016) 39-53"
FR_URL="https://opus.lib.uts.edu.au/bitstream/10453/20138/2/02whole.pdf"
FR_SRC="Pamela Freeman, Blood Ties and \"'Kings. What a good idea': Monarchy in Epic Fantasy Fiction\", Doctor of Creative Arts thesis, University of Technology Sydney, 2006"
OLIVER_URL="https://dc.swosu.edu/mythlore/vol41/iss1/4/"
OLIVER_SRC="Matthew Oliver, 'History in the Margins', Mythlore 41.1 (2022) 45-66"
O_ROUTE="SWOSU Digital Commons PDF"
ET_URL="https://www.diva-portal.org/smash/get/diva2:1659740/FULLTEXT01.pdf"
ET_SRC="Stefan Ekman and Audrey Isabel Taylor, 'Between World and Narrative: Fictional Epigraphs and Critical World-Building', JFA 32.2 (2021) 244-265"

CLAIMS=[
 dict(feature='compounds and coinages',
   claim="Garnes takes Hobb's coinage 'nitterdy-natterdy' as an English lexical resource for intensification in her contrastive corpus.",
   source=GA_SRC,url=GA_URL,quote="expresión nitterdy-natterdy",
   page="section 5.3 Otros recursos lexicos, p. 47",kind='analysis',polarity='applies',date='2016',
   routeHint="open-access PDF at revistas.ucm.es (found via OpenAlex); article is in Spanish",
   registerHint='herald-pools',confidence='high',_file='intensif.txt'),
 dict(feature='dialogue register',
   claim="Garnes reads the Hobb passage as conveying two things at once: insistence on the action and the speaker's weariness.",
   source=GA_SRC,url=GA_URL,quote="en la acción y el hastío del hablante",
   page="section 5.3, p. 47",kind='analysis',polarity='asserts',date='2016',
   routeHint="open-access PDF at revistas.ucm.es; article is in Spanish",
   registerHint='none',confidence='high',_file='intensif.txt'),
 dict(feature='place and institution description',
   claim="Freeman groups Hobb with Le Guin as women writers who in later work began to question the inherited male monarchy of epic fantasy, citing the shift in attitudes to monarchy between the Farseer and Liveship books.",
   source=FR_SRC,url=FR_URL,quote="have in their later works begun to question this",
   page="ch. 'Kings. What a good idea', p. 42",kind='analysis',polarity='asserts',date='2006',
   routeHint="UTS OPUS bitstream 02whole.pdf (the handle page lists the file)",
   registerHint='dossier-archivist',confidence='high',_file='freeman.txt'),
 dict(feature='civic record register',
   claim="Oliver notes that chapter two opens its main text with the conjunction 'But', which violates the conventional separation of epigraph from text.",
   source=OLIVER_SRC,url=OLIVER_URL,quote="violates the conventional separation of epigraph from text",
   page="p. 55",kind='analysis',polarity='asserts',date='2022-10',routeHint=O_ROUTE,
   registerHint='chronicle-line',confidence='high',_file='oliver-mythlore.txt'),
 dict(feature='register modulation',
   claim="Oliver records two late breaches of the epigraph convention: a chapter-20 epigraph voiced from another culture's subjective perspective, and a chapter-22 narrative intrusion into the epigraph.",
   source=OLIVER_SRC,url=OLIVER_URL,quote="an inexplicable narrative intrusion into the epigraphs",
   page="p. 62",kind='analysis',polarity='asserts',date='2022-10',routeHint=O_ROUTE,
   registerHint='chronicle-line',confidence='high',_file='oliver-mythlore.txt'),
 dict(feature='civic record register',
   claim="Ekman and Taylor say fictional epigraphs work by mimicking non-fiction text genres such as the research paper, the parliamentary debate and the historical treatise.",
   source=ET_SRC,url=ET_URL,quote="such as the research paper, the parliamentary debate, the historical",
   page="Function Three, p. 258",kind='analysis',polarity='asserts',date='2021',
   routeHint="Wayback raw capture of the DiVA PDF",registerHint='dossier-archivist',confidence='high',_file='ekman-taylor.txt'),
]
