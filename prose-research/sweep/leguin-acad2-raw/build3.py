# -*- coding: utf-8 -*-
import json, urllib.parse
OUT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-academic-2.json'
d=json.load(open(OUT))
SI='https://openlibrary.org/search/inside.json?q='
def u(i,p): return SI+urllib.parse.quote('identifier:%s AND "%s"'%(i,p))
ROUTE='archive.org search-inside via openlibrary.org/search/inside.json, scoped with identifier:<ia-id>; the url returns the snippet verbatim in hits.hits[].highlight.text (OCR layer has doubled spaces: normalise whitespace)'
SNIP='archive.org search-inside snippet (page_num not resolvable per-highlight)'
C=[]
C.append({'feature':'plainness and economy',
 'claim':'A review of Tehanu reprinted in Children’s Literature Review says Le Guin’s style is as pellucid as ever.',
 'source':'An unsigned review of Tehanu, reprinted in Children’s Literature Review vol. 28 (Gale, 1992)',
 'url':u('childrensliterat28gera',"Le Guin's style is as pellucid as ever"),
 'quote':"Le Guin's style is as pellucid as ever",'page':SNIP,'kind':'reception','polarity':'asserts','date':'1992 (reprint volume)',
 'routeHint':ROUTE,'registerHint':'none',
 'confidence':'medium (snippet-only; the reviewer is not named inside the retrieved window)'})
C.append({'feature':'register modulation',
 'claim':'Cogell’s bibliography records a review calling Le Guin’s style in one book different from her preceding works and "crisp, light".',
 'source':'Elizabeth Cummins Cogell, Ursula K. Le Guin: A Primary and Secondary Bibliography (G. K. Hall, 1983)',
 'url':u('ursulakleguinpri0000coge',"Le Guin's style is different from her preceding works"),
 'quote':"Le Guin's style is different from her preceding works",'page':SNIP,'kind':'reception','polarity':'asserts','date':'1983',
 'routeHint':ROUTE,'registerHint':'none',
 'confidence':'medium (snippet-only; the annotation is Cogell’s digest of a review, and the book under review is outside the window)'})
CR='https://api.crossref.org/works/10.33274/2079-4835-2020-21-2-27-37'
KA='Crossref REST record; the JATS abstract is the publisher’s own, not a summariser’s'
S='M. O. Kuts and M. I. Uholkova, “Language means of expression while emotional implied sense creation in the works of the ‘Hainish cycle’ by Ursula K. Le Guin”, Intelligence. Personality. Civilization 21:2 (30 Dec 2020), 27-37'
for feat,claim,q in [
 ('metaphor discipline','Kuts and Uholkova say The Left Hand of Darkness is extremely rich in means of artistic expression, among which metaphors stand out.','extremely rich in means of artistic expression'),
 ('metaphor discipline','Kuts and Uholkova say conceptual metaphors play an important role in the novel.','Conceptual metaphors play an important role in the work'),
 ('other: polarity of imagery','Kuts and Uholkova say Le Guin does not set out to show the image of darkness as negative.','does not set goals to show the image of darkness as negative'),
]:
    C.append({'feature':feat,'claim':claim,'source':S,'url':CR,'quote':q,'page':'publisher abstract (Crossref JATS)',
     'kind':'analysis','polarity':'asserts','date':'2020-12-30','routeHint':KA,'registerHint':'none',
     'confidence':'low (abstract-only; the article text was not reached)'})
C.append({'feature':'other: research-coverage gap',
 'claim':'Paradoxa number 21 on Ursula K. Le Guin, edited by Sylvia Kelso, is dated 2009 and includes Richard D. Erlich on Always Coming Home as ethnography and Warren G. Rochelle on A Wave in My Mind.',
 'source':'Paradoxa, volume 21 table of contents, paradoxa.com',
 'url':'https://paradoxa.com/volume-21-ursula-k-le-guin/',
 'quote':'Always Coming Home: “Ethnography, unBible, and Utopian Satire”','page':'volume 21 contents listing',
 'kind':'relay','polarity':'mentions','date':'2009','routeHint':'live fetch with a browser user agent; the individual articles are sold per-PDF and were not fetched',
 'registerHint':'dossier-archivist',
 'confidence':'medium (the contents listing is verbatim; no article body was read, and the angle brief dated the issue 2008 where the publisher dates it 2009)'})
SR=[
 {'title':'Children’s Literature Review vol. 28 (Gale, 1992) — reprinted review of Tehanu','url':'https://openlibrary.org/search/inside.json?q=identifier%3Achildrensliterat28gera','kind':'reception','substantive':True,'date':'1992','route':'archive.org search-inside via Open Library (lateral)'},
 {'title':'Elizabeth Cummins Cogell, Ursula K. Le Guin: A Primary and Secondary Bibliography (1983)','url':'https://openlibrary.org/search/inside.json?q=identifier%3Aursulakleguinpri0000coge','kind':'reception','substantive':True,'date':'1983','route':'archive.org search-inside via Open Library (lateral)'},
 {'title':'Kuts & Uholkova, “Language means of expression … Hainish cycle” (2020) — abstract only','url':CR,'kind':'analysis','substantive':False,'date':'2020-12-30','route':'Crossref REST (publisher JATS abstract); no full text reached'},
 {'title':'Paradoxa no. 21, Ursula K. Le Guin, ed. Sylvia Kelso (2009) — table of contents only','url':'https://paradoxa.com/volume-21-ursula-k-le-guin/','kind':'relay','substantive':False,'date':'2009','route':'live fetch; articles sold per-PDF and blocked'},
 {'title':'Victoria Myers, “Conversational Technique in Ursula Le Guin: A Speech-Act Analysis”, SFS 10.3 (1983) — BLOCKED','url':'https://doi.org/10.1525/sfs.10.3.0306','kind':'analysis','substantive':False,'date':'1983','route':'Crossref confirms the DOI; online.ucpress.edu returns HTTP 403 and JSTOR does not render; DePauw never posted issue 31'},
 {'title':'T. A. Shippey, “The Magic Art and the Evolution of Words: Ursula Le Guin’s Earthsea Trilogy”, Mosaic 10.2 (1977) — NOT FOUND','url':'https://openlibrary.org/search/inside.json?q=%22The+Magic+Art+and+the+Evolution+of+Words%22','kind':'analysis','substantive':False,'date':'1977','route':'found only as a bibliography entry in four Le Guin volumes; Mosaic is not open and Shippey’s Hard Reading (2016) is not scanned on archive.org'},
]
d['claims']+=C; d['sourcesRead']+=SR
d['complete']=True
d['coverage']=('Named roster: FETCHED and mined for the first time — Cummins, Bittner, Slusser, Bloom (Modern Critical Views 1986), Bloom (Left Hand of Darkness 1987), '
 'Cadden, Olander & Greenberg, Spivack, Bucknall, Attebery — all ten previously logged BLOCKED, opened by scoped archive.org search-inside through '
 'openlibrary.org/search/inside.json (snippet-only, sentences reconstructed by walking the snippet window). NOT FOUND: Donna R. White, Dancing with Dragons (no scan on any route); '
 'T. A. Shippey, "The Magic Art and the Evolution of Words" (bibliography entries only). BLOCKED: Victoria Myers, SFS 10.3 (UC Press 403, JSTOR unrenderable); Paradoxa 21 articles '
 '(per-PDF paywall; ToC fetched, and the issue is dated 2009 not 2008); OpenAlex (HTTP 429 all session) and Semantic Scholar (429); Google Books, HathiTrust and archive.org djvu/lending endpoints '
 '(as the predecessor recorded); Wayback CDX went offline mid-session, closing the SFS route the predecessor used. Abstract-only: Trimarco 1999 (Crossref), Kuts & Uholkova 2020 (Crossref JATS). '
 'Substantive sources per route: 14 monographs and reference volumes via archive.org search-inside (10 roster + De Bolt, Dirda, Petty, Children’s Literature Review, Cogell as lateral finds), '
 '2 via live web fetch (Burt in Strange Horizons; the Public Books transcript of Plotz’s 2015 Le Guin interview), 2 via Crossref metadata, 1 ToC. '
 'Every archive.org quotation was re-queried against its own url before writing and all 62 passed; the ten web quotations were grepped against the stripped HTML. '
 'Coverage gap worth reporting: across the whole reachable scanned corpus, Cadden is the ONLY critic who discusses "A Description of Earthsea", the gazetteer appendix nearest to a settlement dossier.')
json.dump(d,open(OUT,'w'),indent=1,ensure_ascii=False)
print('claims',len(d['claims']),'sources',len(d['sourcesRead']))
