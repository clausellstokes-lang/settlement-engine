# -*- coding: utf-8 -*-
import json, urllib.parse, os
OUT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-academic-2.json'
PRIOR=json.load(open(OUT)) if os.path.exists(OUT) else {'sourcesRead':[],'claims':[]}
SI='https://openlibrary.org/search/inside.json?q='
def u(ident, phrase):
    return SI+urllib.parse.quote('identifier:%s AND "%s"'%(ident,phrase))
ROUTE='archive.org search-inside via openlibrary.org/search/inside.json, scoped with identifier:<ia-id>; the url returns the snippet verbatim in hits.hits[].highlight.text (OCR layer has doubled spaces: normalise whitespace)'
SNIP='archive.org search-inside snippet (page_num not resolvable per-highlight)'
C=[]
def add(feature, claim, source, ident, phrase, quote=None, page=SNIP, kind='analysis', polarity='asserts',
        date=None, registerHint='none', confidence='medium', url=None, routeHint=ROUTE):
    C.append({'feature':feature,'claim':claim,'source':source,'url':url or u(ident,phrase),
              'quote':quote if quote is not None else phrase,'page':page,'kind':kind,'polarity':polarity,
              'date':date,'routeHint':routeHint,'registerHint':registerHint,'confidence':confidence})

# ---------- Cummins 1990 ----------
S='Elizabeth Cummins, Understanding Ursula K. Le Guin (Univ. of South Carolina Press, 1990)'
add('cadence and rhythm',"Cummins attributes Le Guin's style to her sensitivity to sound and syntax.",S,
    'understandingurs0000cumm','results from her sensitivity to sound and syntax',date='1990',
    confidence='medium (snippet-only; the sentence was reconstructed by four search-inside hops)')
add('civic record register',"Cummins says Always Coming Home lacks the objective tone of most anthropological writing.",S,
    'understandingurs0000cumm','it lacks the objective tone of most anthropological writing',date='1990',
    registerHint='dossier-archivist',
    confidence='medium (snippet-only; the subject Always Coming Home stands two sentences earlier in the same window)')
add('civic record register',"Cummins says Le Guin's way of presenting a culture is to use the textual model of the ethnograph.",S,
    'understandingurs0000cumm','use the textual model of the ethnograph',date='1990',registerHint='dossier-archivist',
    confidence='medium (snippet-only)')
add('civic record register',"Cummins says the ethnograph model admits both the voices of the anthropologist and of the people being studied.",S,
    'understandingurs0000cumm','both the voices of the anthropologist',date='1990',registerHint='dossier-archivist',
    confidence='medium (snippet-only; the second half of the pair is in the same window)')
add('point of view and distance',"Cummins says Le Guin uses an omniscient point of view for the section covering ages seven to nineteen.",S,
    'understandingurs0000cumm','Le Guin uses an omniscient point of view',date='1990',
    confidence='medium (snippet-only; the work is outside the retrieved window)')
add('per-speaker register',"Cummins characterises a character by his diction, saying his nouns, adjectives and metaphors leave no room for ambivalence.",S,
    'understandingurs0000cumm','His nouns, adjectives, and metaphors leave no room',date='1990',
    confidence='medium (snippet-only; the character is named outside the retrieved window)')

# ---------- Bittner 1984 ----------
S='James W. Bittner, Approaches to the Fiction of Ursula K. Le Guin (UMI Research Press, 1984)'
add('archaism',"Bittner says the word 'tale' carries an archaic, distant tone that the word 'story' lacks.",S,
    'approachestofict0000bitt','The very word tale has an archaic, distant tone',date='1984',
    registerHint='chronicle-line',confidence='high (snippet verbatim; the contrast with story is inside the same window)')
add('civic record register',"Bittner says fantastic narratives include 'documents' to create an air of factuality.",S,
    'approachestofict0000bitt','to create an air of factuality',date='1984',registerHint='dossier-archivist',
    confidence='medium (snippet-only)')
add('annalist voice and deep time',"Bittner describes the narrator of 'Winter's King' as a historian telling a familiar story.",S,
    'approachestofict0000bitt','The narrator is a historian, telling a familiar story',date='1984',
    registerHint='chronicle-line',
    confidence='medium (snippet-only; the work is cited as the abbreviation WK inside the same window)')
add('civic record register',"Bittner reports that the documents following Estraven's death include a hearth-tale from the archives of the College of Historians in Erhenrang.",S,
    'approachestofict0000bitt','archives of the College of Historians in Erhenrang',date='1984',
    registerHint='dossier-archivist',confidence='medium (snippet-only)')
add('place and institution description',"Bittner says the novel interleaves extracts from Estraven's journal with an anthropological report and Gethenian legends.",S,
    'approachestofict0000bitt','an anthropological report, and Gethenian legends',date='1984',
    registerHint='dossier-archivist',confidence='medium (snippet-only)')
add('adjective and adverb discipline',"Bittner treats a guidebook title carrying many telling adjectives as a reason not to trust its user.",S,
    'approachestofict0000bitt','a guidebook with so many telling adjectives in its title',date='1984',
    polarity='applies',registerHint='dm-page',confidence='medium (snippet-only)')

# ---------- Slusser 1976 ----------
S='George Edgar Slusser, The Farthest Shores of Ursula K. Le Guin (Borgo Press, 1976)'
add('place and institution description',"Slusser says the landscape of one of Le Guin's worlds is quite ordinary by earth standards.",S,
    'farthestshoresof0000slus','The landscape is quite ordinary by earth standards',date='1976',
    confidence='medium (snippet-only; the world is not named inside the retrieved window)')
add('civic record register',"Slusser describes a narrative framework intermingled with interpolated tales, documents and diaries.",S,
    'farthestshoresof0000slus','intermingled with interpolated tales, documents, diaries',date='1976',
    registerHint='dossier-archivist',confidence='medium (snippet-only)')

# ---------- Bloom ed. 1986 ----------
S='An essay in Harold Bloom, ed., Ursula K. Le Guin: Modern Critical Views (Chelsea House, 1986) — contributor not resolvable from the snippet window'
add('plainness and economy',"The essay says Le Guin's style has evolved towards simplicity.",S,
    'ursulakleguin00bloo',"Le Guin's style has evolved towards simplicity",date='1986',
    confidence='medium (snippet-only; the essay is one of the reprinted contributions and its author is outside the window)')
add('cadence and rhythm',"The essay credits Le Guin with a skillful use of cadence and sound patterns.",S,
    'ursulakleguin00bloo','a skillful use of cadence and sound patterns',date='1986',
    confidence='medium (snippet-only; contributor unresolved)')
add('parataxis vs hypotaxis',"The essay credits Le Guin with a flexible use of compound and complex sentences.",S,
    'ursulakleguin00bloo','a flexible use of compound and complex sentences',date='1986',
    confidence='medium (snippet-only; contributor unresolved)')
S2="Harold Bloom, introduction to Ursula K. Le Guin: Modern Critical Views (Chelsea House, 1986)"
add('civic record register',"Bloom says the narrator of that chapter is a field investigator of the Ekumen wryly cataloging a weird matter.",S2,
    'ursulakleguin00bloo','wryly cataloging a weird matter',date='1986',registerHint='dossier-archivist',
    confidence="medium (snippet-only; attributed to Bloom's own introduction because the identical sentence recurs in his single-author Novelists and Novels)")
add('omission as information',"An essay in Bloom's volume says three chapters and the Appendix are documents separate from the actual narrative.",
    'An essay in Harold Bloom, ed., Ursula K. Le Guin: Modern Critical Views (1986)',
    'ursulakleguin00bloo','are documents separate from the actual narrative',date='1986',
    registerHint='dossier-archivist',confidence='medium (snippet-only; contributor unresolved)')

# ---------- Bloom ed. LHD 1987 ----------
S='Harold Bloom, introduction to Ursula K. Le Guin’s The Left Hand of Darkness (Chelsea House, 1987)'
add('civic record register',"Bloom says the investigator's field notes add a number of sharper observations.",S,
    'ursulakleguinsle0000unse','Her field notes add a number of sharper observations',date='1987',
    registerHint='dossier-archivist',confidence='medium (snippet-only)')

# ---------- Cadden 2005 ----------
S='Mike Cadden, Ursula K. Le Guin Beyond Genre: Fiction for Children and Adults (Routledge, 2005)'
add('point of view and distance',"Cadden says much of Le Guin's short fiction shows a steady use of free indirect discourse.",S,
    'ursulakleguinbey0000cadd','a steady use of free indirect discourse',date='2005',
    confidence='medium (snippet-only)')
add('dialogue register',"Cadden says Le Guin uses free indirect discourse to put speakers on a more equal ideological footing with other characters.",S,
    'ursulakleguinbey0000cadd','put speakers on a more equal ideological footing',date='2005',
    confidence='medium (snippet-only)')
add('civic record register',"Cadden calls 'A Description of Earthsea' a text that is neither story nor afterword.",S,
    'ursulakleguinbey0000cadd','a text that is neither story nor afterword',date='2005',
    registerHint='dossier-archivist',confidence='high (snippet verbatim; the title stands inside the same window)')
add('place and institution description',"Cadden says 'A Description of Earthsea' runs to almost thirty pages of Earthsea lore and history.",S,
    'ursulakleguinbey0000cadd','almost thirty pages of Earthsea lore and history',date='2005',
    registerHint='dossier-archivist',confidence='high (snippet verbatim; the title stands inside the same window)')
add('point of view and distance',"Cadden says 'A Description of Earthsea' is told from outside the world of Earthsea.",S,
    'ursulakleguinbey0000cadd','is told from outside the world of Earthsea',date='2005',
    registerHint='dossier-archivist',confidence='high (snippet verbatim; the title stands inside the same window)')
add('annalist voice and deep time',"Cadden says the book is true to the voice of the anthropologist examining the ways of the Kesh.",S,
    'ursulakleguinbey0000cadd','the voice of the anthropologist examining the ways',date='2005',
    registerHint='dossier-archivist',confidence='medium (snippet-only; the book Always Coming Home is named at the head of the same window)')
add('point of view and distance',"Cadden says the book does not rely on any one narrating voice in the presentation of this anthropological text.",S,
    'ursulakleguinbey0000cadd','in the presentation of this anthropological text',date='2005',
    registerHint='dossier-archivist',confidence='medium (snippet-only)')
add('plainness and economy',"Cadden puts it to Le Guin that Leese Webster is very spare.",S,
    'ursulakleguinbey0000cadd','Leese Webster is very spare',date='2005',
    confidence='medium (snippet-only; interviewer initials MC precede the sentence)')
add('plainness and economy',"Le Guin replies that Leese Webster is austere and that this fit the illustrator's talent.",
    'Ursula K. Le Guin, in interview with Mike Cadden, printed in Ursula K. Le Guin Beyond Genre (Routledge, 2005)',
    'ursulakleguinbey0000cadd','It’s austere, and that fit Jim’s talent',date='2005',kind='own-words',
    confidence='medium (snippet-only; speaker tag UKL precedes the sentence in the same window)')

# ---------- Olander & Greenberg 1979 ----------
S='An essay in Joseph D. Olander and Martin Harry Greenberg, eds., Ursula K. Le Guin (Taplinger, 1979) — contributor not resolvable from the snippet window'
add('plainness and economy',"The essay says Le Guin's straightforward stories deal in strong colors and plain fabrics.",S,
    'ursulakleguin00olan','strong colors and plain fabrics',date='1979',confidence='medium (snippet-only; contributor unresolved)')
add('concrete sensory noun',"The essay notes that Ai sees each keystone in the city of Erhenrang joined by red cement.",S,
    'ursulakleguin00olan','each keystone he sees in the city of Erhenrang',date='1979',
    registerHint='dossier-archivist',confidence='medium (snippet-only; contributor unresolved)')

# ---------- Spivack 1984 ----------
S='Charlotte Spivack, Ursula K. Le Guin (Twayne, 1984)'
add('register modulation',"Spivack says the style of A Wizard of Earthsea is suitable to its subject.",S,
    'ursulakleguin0453spiv','The style of A Wizard of Earthsea is suitable',date='1984',
    confidence='medium (snippet-only)')
add('diction (native vs latinate)',"Spivack says the language of A Wizard of Earthsea is largely Anglo-Saxon in diction.",S,
    'ursulakleguin0453spiv','Saxon in diction, strongly alliterative',
    quote='Saxon in diction, strongly alliterative',date='1984',
    confidence='medium (snippet-only; the OCR breaks Anglo-Saxon across a hyphen and space, so the quote starts mid-compound)')
add('cadence and rhythm',"Spivack says the alliteration in A Wizard of Earthsea is pervasive, recalling the oral tradition.",S,
    'ursulakleguin0453spiv','The alliteration is pervasive, recalling the oral tradition',date='1984',
    confidence='medium (snippet-only)')
add('place and institution description',"Spivack says Le Guin draws on her anthropological background to create cultural concepts for her imaginary worlds.",S,
    'ursulakleguin0453spiv','Drawing on her anthropological background, Le Guin is able',date='1984',
    registerHint='dossier-archivist',confidence='medium (snippet-only)')

# ---------- Bucknall 1981 ----------
S='Barbara J. Bucknall, Ursula K. Le Guin (Frederick Ungar, 1981)'
add('plainness and economy',"Bucknall says what Le Guin says of Tolkien's style is to a certain extent true of the way she writes herself.",S,
    'ursulakleguin00buck','is to a certain extent true of the way she',date='1981',
    confidence='medium (snippet-only; the phrase completes as “the way she writes herself” in the same window)')
add('register modulation',"Bucknall says Le Guin's style varies from book to book and from character to character.",S,
    'ursulakleguin00buck','which varies from book to book and from character',date='1981',
    confidence='medium (snippet-only)')
add('adjective and adverb discipline',"Bucknall praises Le Guin for writing poetically while resisting the temptation to overwrite.",S,
    'ursulakleguin00buck','while resisting the temptation to overwrite',date='1981',
    confidence='medium (snippet-only)')
add('register modulation',"Bucknall says Le Guin's style does not have the stately and heroic tone of The Lord of the Rings.",S,
    'ursulakleguin00buck','does not have the stately and heroic tone',date='1981',polarity='rejects',
    confidence='medium (snippet-only; The Lord of the Rings is named in the same window)')
S3='Ursula K. Le Guin, "From Elfland to Poughkeepsie" (1973), quoted in Barbara J. Bucknall, Ursula K. Le Guin (1981)'
add('plainness and economy',"Le Guin writes that a plain language is the noblest of all.",S3,
    'ursulakleguin00buck','A plain language is the noblest of all',date='1973 (essay); 1981 (the volume quoting it)',
    kind='own-words',registerHint='dossier-archivist',
    confidence='medium (snippet-only; Bucknall quotes the essay, the essay itself was not fetched on this route)')
add('plainness and economy',"Le Guin adds that plain language is also the most difficult.",S3,
    'ursulakleguin00buck','It is also the most difficult',date='1973 (essay); 1981 (the volume quoting it)',
    kind='own-words',confidence='medium (snippet-only)')
add('plainness and economy',"Le Guin writes that clarity and simplicity are permanent virtues in a narrative.",S3,
    'ursulakleguin00buck','Clarity and simplicity are permanent virtues in a narrative',
    date='1973 (essay); 1981 (the volume quoting it)',kind='own-words',registerHint='dossier-archivist',
    confidence='medium (snippet-only)')
add('diction (native vs latinate)',"Le Guin writes that Tolkien writes a plain, clear English.",S3,
    'ursulakleguin00buck','Tolkien writes a plain, clear English',date='1973 (essay); 1981 (the volume quoting it)',
    kind='own-words',confidence='medium (snippet-only)')

# ---------- Attebery 1980 ----------
S='Brian Attebery, The Fantasy Tradition in American Literature: From Irving to Le Guin (Indiana Univ. Press, 1980)'
add('other: authorial self-account',"Attebery says Le Guin has given us a convenient guide to her career.",S,
    'fantasytradition0000atte','Ursula Le Guin has given us a convenient guide',date='1980',
    confidence='medium (snippet-only)')

# ---------- De Bolt ed. 1979 ----------
S='George Woodcock, quoted by John R. Pfeiffer in Joe De Bolt, ed., Ursula K. Le Guin: Voyager to Inner Lands and to Outer Space (Kennikat Press, 1979)'
add('plainness and economy',"Woodcock calls Le Guin's a style of crystalline clarity and functional flexibility.",S,
    'ursulakleguinvoy0000unse','a style of crystalline clarity and functional flexibility',date='1979',
    kind='reception',confidence='medium (snippet-only; Woodcock is named as the source of the quotation in the same window)')
add('cadence and rhythm',"Pfeiffer calls the oral elements of the style of A Wizard of Earthsea a superb vehicle.",
    'John R. Pfeiffer, in Joe De Bolt, ed., Ursula K. Le Guin: Voyager to Inner Lands and to Outer Space (1979)',
    'ursulakleguinvoy0000unse','The oral elements of the style of WOE',date='1979',
    confidence='medium (snippet-only; the book uses the abbreviation WOE for A Wizard of Earthsea)')

# ---------- Burt / Plotz ----------
BURT='https://strangehorizons.com/wordpress/non-fiction/ursula-le-guins-earthsea-by-john-plotz/'
BR='live fetch with a browser user agent; quotations grepped against the stripped HTML'
def addw(feature,claim,source,url,quote,page,kind='analysis',polarity='asserts',date=None,registerHint='none',confidence='high',routeHint=BR):
    C.append({'feature':feature,'claim':claim,'source':source,'url':url,'quote':quote,'page':page,'kind':kind,
              'polarity':polarity,'date':date,'routeHint':routeHint,'registerHint':registerHint,'confidence':confidence})
addw('plainness and economy',"Burt calls the prose of Earthsea clear and patient.",
     'Stephanie Burt, review of John Plotz’s Ursula Le Guin’s Earthsea, Strange Horizons, 6 November 2023',
     BURT,'its clear, patient prose','review body, paragraph on rereading',kind='reception',date='2023-11-06')
addw('omission as information',"Plotz calls Le Guin's prose the antithesis of the well-rendered verisimilitude of a high-end video game.",
     'John Plotz, Ursula Le Guin’s Earthsea (Oxford Univ. Press, 2023), p. 48, quoted in Stephanie Burt, Strange Horizons, 6 November 2023',
     BURT,'the antithesis of the well-rendered verisimilitude','p. 48, as quoted in the review',date='2023',registerHint='dossier-archivist')
addw('plainness and economy',"Burt reports that Le Guin's clear, spare prose reminds Plotz of Willa Cather's.",
     'Stephanie Burt, review of Plotz, Strange Horizons, 6 November 2023',
     BURT,'Her clear, spare prose reminds Plotz','review body, paragraph on Plotz’s comparisons',kind='reception',date='2023-11-06')
addw('omission as information',"Burt says Le Guin works at the level of the sentence, letting readers fill in the details of her strongly outlined world.",
     'Stephanie Burt, review of Plotz, Strange Horizons, 6 November 2023',
     BURT,'letting us fill in the details of her strongly outlined world','review body, paragraph on the first trilogy',date='2023-11-06',registerHint='dossier-archivist')
addw('place and institution description',"Plotz says Le Guin trains a spotlight on all the things that we make up and then treat as real.",
     'John Plotz, Ursula Le Guin’s Earthsea (2023), p. 34, quoted in Stephanie Burt, Strange Horizons, 6 November 2023',
     BURT,'trains a spotlight on all the things that we make up','p. 34, as quoted in the review',date='2023',registerHint='dossier-archivist')
addw('point of view and distance',"Burt says Le Guin invites the reader in and holds the reader back.",
     'Stephanie Burt, review of Plotz, Strange Horizons, 6 November 2023',
     BURT,'invites us in and holds us back','review body, paragraph on subcreation',date='2023-11-06')
PB='https://www.publicbooks.org/john-plotz-on-earthsea-anarchism-and-ursula-k-le-guin/'
addw('naming and forms of address',"Le Guin says names come first with her.",
     'Ursula K. Le Guin, 2015 interview with John Plotz, transcribed in Public Books, 21 February 2024',
     PB,'Names come first with me','interview transcript, on drawing the Earthsea map',kind='own-words',date='2015 (interview); 2024-02-21 (transcript)')
addw('naming and forms of address',"Le Guin says she drew a map of islands she knew nothing about and named them happily.",
     'Ursula K. Le Guin, 2015 interview with John Plotz, transcribed in Public Books, 21 February 2024',
     PB,'But I named them happily','interview transcript, on drawing the Earthsea map',kind='own-words',date='2015 (interview); 2024-02-21 (transcript)',registerHint='dossier-archivist')
addw('omission as information',"Plotz quotes Le Guin's essay as saying fantasy offers only a construct built in a void with every joint and seam and nail exposed.",
     'Ursula K. Le Guin, “From Elfland to Poughkeepsie” (1973), quoted by John Plotz in Public Books, 21 February 2024',
     PB,'a construct built in a void','interview transcript, on Le Guin versus Tolkien',kind='own-words',date='1973 (essay); 2024-02-21 (transcript)')

# ---------- Trimarco 1999 (record only) ----------
C.append({'feature':'stylometry','claim':"Trimarco's 1999 Journal of Literary Studies article applies a taxonomy of lexical opposition to Le Guin's 'The Ones Who Walk Away from Omelas'.",
 'source':'Paola Trimarco, “An analysis of lexical opposition: Le Guin’s ‘the ones who walk away from Omelas’”, Journal of Literary Studies 15:3-4 (Dec 1999), 407-424',
 'url':'https://api.crossref.org/works/10.1080/02564719908530238','quote':'','page':'Crossref metadata record',
 'kind':'measurement','polarity':'applies','date':'1999-12','routeHint':'Crossref REST record (OpenAlex was HTTP 429 for this session); full text not reached',
 'registerHint':'none','confidence':'low (metadata and abstract only; the article text was not fetched, so no limb beyond title, venue, date and subject is asserted)'})

SR=[
 {'title':'Elizabeth Cummins, Understanding Ursula K. Le Guin (1990)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Aunderstandingurs0000cumm','kind':'analysis','substantive':True,'date':'1990','route':'archive.org search-inside via Open Library (lending item; djvu.txt and fulltext/inside.php both refuse)'},
 {'title':'James W. Bittner, Approaches to the Fiction of Ursula K. Le Guin (1984)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Aapproachestofict0000bitt','kind':'analysis','substantive':True,'date':'1984','route':'archive.org search-inside via Open Library'},
 {'title':'George Edgar Slusser, The Farthest Shores of Ursula K. Le Guin (1976)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Afarthestshoresof0000slus','kind':'analysis','substantive':True,'date':'1976','route':'archive.org search-inside via Open Library'},
 {'title':'Harold Bloom ed., Ursula K. Le Guin: Modern Critical Views (1986)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Aursulakleguin00bloo','kind':'analysis','substantive':True,'date':'1986','route':'archive.org search-inside via Open Library'},
 {'title':"Harold Bloom ed., Ursula K. Le Guin's The Left Hand of Darkness (1987)",'url':'https://openlibrary.org/search/inside.json?q=identifier%3Aursulakleguinsle0000unse','kind':'analysis','substantive':True,'date':'1987','route':'archive.org search-inside via Open Library'},
 {'title':'Mike Cadden, Ursula K. Le Guin Beyond Genre (2005)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Aursulakleguinbey0000cadd','kind':'analysis','substantive':True,'date':'2005','route':'archive.org search-inside via Open Library'},
 {'title':'Joseph D. Olander & Martin Harry Greenberg eds., Ursula K. Le Guin (1979)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Aursulakleguin00olan','kind':'analysis','substantive':True,'date':'1979','route':'archive.org search-inside via Open Library'},
 {'title':'Charlotte Spivack, Ursula K. Le Guin (Twayne, 1984)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Aursulakleguin0453spiv','kind':'analysis','substantive':True,'date':'1984','route':'archive.org search-inside via Open Library'},
 {'title':'Barbara J. Bucknall, Ursula K. Le Guin (1981)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Aursulakleguin00buck','kind':'analysis','substantive':True,'date':'1981','route':'archive.org search-inside via Open Library'},
 {'title':'Brian Attebery, The Fantasy Tradition in American Literature (1980)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Afantasytradition0000atte','kind':'analysis','substantive':True,'date':'1980','route':'archive.org search-inside via Open Library'},
 {'title':'Joe De Bolt ed., Ursula K. Le Guin: Voyager to Inner Lands and to Outer Space (1979)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Aursulakleguinvoy0000unse','kind':'analysis','substantive':True,'date':'1979','route':'archive.org search-inside via Open Library (found laterally, not on the named roster)'},
 {'title':'Harold Bloom, Novelists and Novels (used only to attribute the introduction)','url':'https://openlibrary.org/search/inside.json?q=%22wryly+cataloging+a+weird+matter%22','kind':'analysis','substantive':False,'date':'2005','route':'archive.org search-inside; corroborates that the sentence is Bloom’s own'},
 {'title':'Stephanie Burt, review of John Plotz, Ursula Le Guin’s Earthsea, Strange Horizons','url':BURT,'kind':'reception','substantive':True,'date':'2023-11-06','route':'live fetch, browser user agent'},
 {'title':'John Plotz on Earthsea, Anarchism, and Ursula K. Le Guin (Public Books; carries a 2015 Le Guin interview)','url':PB,'kind':'own-words','substantive':True,'date':'2024-02-21','route':'live fetch, browser user agent'},
 {'title':'Paola Trimarco, “An analysis of lexical opposition…”, Journal of Literary Studies 15:3-4 (1999) — metadata only','url':'https://api.crossref.org/works/10.1080/02564719908530238','kind':'measurement','substantive':False,'date':'1999-12','route':'Crossref REST (OpenAlex 429 this session; no full text reached)'},
]
prior_urls={c['url'] for c in PRIOR.get('claims',[])}
out={'complete':False,
 'coverage':'IN PROGRESS (session 2).',
 'sourcesRead':PRIOR.get('sourcesRead',[])+SR,
 'claims':PRIOR.get('claims',[])+C}
json.dump(out,open(OUT,'w'),indent=1,ensure_ascii=False)
print('claims total',len(out['claims']),'new',len(C),'sources total',len(out['sourcesRead']))
