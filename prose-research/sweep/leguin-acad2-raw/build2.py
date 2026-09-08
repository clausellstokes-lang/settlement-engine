# -*- coding: utf-8 -*-
import json, urllib.parse
OUT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-academic-2.json'
d=json.load(open(OUT))
SI='https://openlibrary.org/search/inside.json?q='
def u(i,p): return SI+urllib.parse.quote('identifier:%s AND "%s"'%(i,p))
ROUTE='archive.org search-inside via openlibrary.org/search/inside.json, scoped with identifier:<ia-id>; the url returns the snippet verbatim in hits.hits[].highlight.text (OCR layer has doubled spaces: normalise whitespace)'
SNIP='archive.org search-inside snippet (page_num not resolvable per-highlight)'
C=[]
def add(feature,claim,source,ident,phrase,quote=None,kind='analysis',polarity='asserts',date=None,
        registerHint='none',confidence='medium (snippet-only)'):
    C.append({'feature':feature,'claim':claim,'source':source,'url':u(ident,phrase),
              'quote':quote if quote is not None else phrase,'page':SNIP,'kind':kind,'polarity':polarity,
              'date':date,'routeHint':ROUTE,'registerHint':registerHint,'confidence':confidence})

# --- Dirda, NEA Big Read teacher's guide 2008 (lateral find) ---
D="Michael Dirda, Ursula K. Le Guin's A Wizard of Earthsea teacher's guide, NEA Big Read (National Endowment for the Arts, 2008)"
add('sentence length variation',"Dirda says the sentences of A Wizard of Earthsea are formal, clear, and exact.",D,
    'ursulakleguinswi00dird','The sentences are formal, clear, and exact',date='2008',registerHint='chronicle-line',
    confidence='high (snippet verbatim; the subject stands in the same window)')
add('cadence and rhythm',"Dirda says those sentences carry the musical cadence of an oral storyteller.",D,
    'ursulakleguinswi00dird','with the musical cadence of an oral storyteller',date='2008',registerHint='chronicle-line')
add('cadence and rhythm',"Dirda says Le Guin gives music and richness to her prose through the rhythm of her sentences.",D,
    'ursulakleguinswi00dird','music and richness to her prose through the rhythm',date='2008')
add('cadence and rhythm',"Dirda says Le Guin gives her prose music occasionally through the use of alliteration and assonance.",D,
    'ursulakleguinswi00dird','through the use of alliteration and assonance',date='2008')
add('register modulation',"Dirda says heroic or high fantasy demands a slightly formal, elevated style.",D,
    'ursulakleguinswi00dird','a slightly formal, elevated style',date='2008',registerHint='chronicle-line',
    confidence='medium (snippet-only; Dirda states it as the genre’s demand, not as a description of Le Guin’s practice)')
add('point of view and distance',"Dirda says the omniscient narrator confides in the reader like a friend.",D,
    'ursulakleguinswi00dird','The omniscient narrator confides in the reader like a friend',date='2008')
add('annalist voice and deep time',"Dirda says the narrator conveys the real story behind the legends of the Archmage Ged.",D,
    'ursulakleguinswi00dird','the real story behind the legends of the Archmage Ged',date='2008',registerHint='chronicle-line')

# --- Spivack on the POETRY (scope matters) ---
S='Charlotte Spivack, Ursula K. Le Guin (Twayne, 1984)'
add('diction (native vs latinate)',"Spivack says the vocabulary of Le Guin's poems is straightforward, with a diction austerely avoiding the Latinate or the ornate.",S,
    'ursulakleguin0453spiv','a diction austerely avoiding the Latinate or the ornate',date='1984',
    registerHint='dossier-archivist',
    confidence='medium (snippet-only; the window says this is “quite different from Le Guin’s fictional style”, so the limb is scoped to the verse)')
add('diction (native vs latinate)',"Spivack calls the diction of those poems homely and reminiscent of Robert Frost.",S,
    'ursulakleguin0453spiv','The homely diction is reminiscent of Robert Frost',date='1984',
    confidence='medium (snippet-only; scoped to the poems, not the fiction)')
add('omission as information',"Spivack calls the monologues richly suggestive, leaving much unsaid.",S,
    'ursulakleguin0453spiv','richly suggestive, leaving much unsaid',date='1984',
    confidence='medium (snippet-only; scoped to the poems)')

# --- Cummins: per-speaker register, now pinned ---
S='Elizabeth Cummins, Understanding Ursula K. Le Guin (1990)'
add('per-speaker register',"Cummins says Le Guin distinguishes the Davidson chapters by his vocabulary, particularly animal metaphors.",S,
    'understandingurs0000cumm','distinguishes the Davidson chapters by his vocabulary',date='1990',
    confidence='high (snippet verbatim; “particularly animal metaphors” stands in the same window)')

# --- Bloom's phrase, and Cadden disputing it ---
add('other: dialectical style',"Bloom's volume describes Le Guin leading the reader through her alternate realities with a precise, dialectical style.",
    'Harold Bloom, Ursula K. Le Guin: Modern Critical Views (Chelsea House, 1986)',
    'ursulakleguin00bloo','her alternate realities with a precise, dialectical style',date='1986')
add('other: dialectical style',"Cadden reports that Harold Bloom compliments Le Guin as a writer of precise, dialectical style.",
    'Mike Cadden, Ursula K. Le Guin Beyond Genre (Routledge, 2005)',
    'ursulakleguinbey0000cadd','Harold Bloom compliments Le Guin as a writer of',date='2005',kind='reception')
add('other: dialectical style',"Cadden disputes Bloom's description, saying Le Guin does not seem to value dialectic.",
    'Mike Cadden, Ursula K. Le Guin Beyond Genre (Routledge, 2005)',
    'ursulakleguinbey0000cadd','Le Guin does not seem to value dialectic',date='2005',polarity='disputes',
    confidence='high (snippet verbatim; the disputed phrase stands in the same window)')

# --- Bucknall quoting Le Guin on Tolkien's vocabulary ---
add('diction (native vs latinate)',"Le Guin writes that Tolkien's vocabulary is not striking.",
    'Ursula K. Le Guin, "From Elfland to Poughkeepsie" (1973), quoted in Barbara J. Bucknall, Ursula K. Le Guin (1981)',
    'ursulakleguin00buck','Tolkien’s vocabulary is not striking',date='1973 (essay); 1981 (the volume quoting it)',
    kind='own-words',
    confidence='medium (snippet-only; the sentence sits in the run of Elfland-to-Poughkeepsie quotation Bucknall is transcribing)')

# --- Petty (lateral) ---
add('metaphor discipline',"Petty says one scene is rendered in some of Le Guin's most graphic and moving prose.",
    'Anne C. Petty, Dragons of Fantasy (Cold Spring Press, 2004)',
    'dragonsoffantasy0000pett',"some of Le Guin’s most graphic and moving prose",date='2004',kind='reception')

SR=[
 {'title':"Michael Dirda, A Wizard of Earthsea teacher's guide, NEA Big Read (2008)",'url':'https://openlibrary.org/search/inside.json?q=identifier%3Aursulakleguinswi00dird','kind':'analysis','substantive':True,'date':'2008','route':'archive.org search-inside via Open Library (lateral find, not on the named roster)'},
 {'title':'Anne C. Petty, Dragons of Fantasy (2004)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Adragonsoffantasy0000pett','kind':'reception','substantive':True,'date':'2004','route':'archive.org search-inside via Open Library (lateral find)'},
 {'title':'Donna R. White, Dancing with Dragons: Ursula K. Le Guin and the Critics (1999) — NOT FOUND on any reachable route','url':'https://openlibrary.org/search.json?q=Dancing+with+dragons+Le+Guin+critics','kind':'analysis','substantive':False,'date':'1999','route':'Open Library holds the edition record but no scan; archive.org search-inside returns only bibliography entries citing it in other books'},
]
d['claims']+=C; d['sourcesRead']+=SR
json.dump(d,open(OUT,'w'),indent=1,ensure_ascii=False)
print('claims',len(d['claims']),'new',len(C),'sources',len(d['sourcesRead']))
