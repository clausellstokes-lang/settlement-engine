import json,sys
sys.path.insert(0,'.')
from importlib.machinery import SourceFileLoader
m=SourceFileLoader('b','lgc-build.py').load_module()

U={
 'rrhorton':'http://rrhorton.blogspot.com/2024/04/review-always-coming-home-by-ursula-k.html',
 'triumph':'https://triumphofthenow.com/2019/07/13/always-coming-home-by-ursula-le-guin/',
 'greenman':'https://agreenmanreview.com/books/ursula-k-le-guins-always-coming-home/',
 'resilience':'https://www.resilience.org/stories/2023-02-16/always-coming-home-review/',
 'omelas-il':'https://interestingliterature.com/2021/02/ursula-le-guin-ones-who-walk-away-from-omelas-summary-analysis/',
 'omelas-llg':'https://www.literaryladiesguide.com/literary-analyses/ones-who-walk-away-from-omelas-ursula-le-guin/',
 'omelas-pb':'https://cwi.pressbooks.pub/beginnings-and-endings-a-critical-edition/chapter/reader-response-9/',
 'sffchron':'https://www.sffchronicles.com/threads/583221/',
 'erinramsay':'https://erinramsay.substack.com/p/earthsea-a-sharpening-of-scale',
 'mattbell-tor1':'https://reactormag.com/my-le-guin-year-craft-lessons-from-a-master/',
}
C=[]
def add(f,feature,claim,source,quote,page,kind,polarity,date,route,reg,conf=None):
    d=dict(feature=feature,claim=claim,source=source,url=U[f],quote=quote,page=page,kind=kind,
           polarity=polarity,date=date,routeHint=route,registerHint=reg)
    if conf: d['confidence']=conf
    d['_file']=f
    C.append(d)

R='curl with browser user agent (live URL)'

# --- Always Coming Home: the archival / ethnographic register
add('rrhorton','civic record register',
 'Rich Horton reports that the ethnographic sections of Always Coming Home, while intellectually interesting, are often a struggle to read.',
 'Rich Horton, "Review: Always Coming Home, by Ursula K. Le Guin", Strange at Ecbatan blog, 24 April 2024',
 'intellectually intriguing, but, really, often a struggle to read','body, final verdict paragraph','reception','asserts (as a limitation)','2024-04-24',R,'dossier-archivist')
add('rrhorton','other: archival register as a whole book',
 'Horton describes Always Coming Home as reading to a great extent like a writer deciding to include all her notes.',
 'Rich Horton, Strange at Ecbatan blog, 24 April 2024',
 'like a writer deciding to include all her notes','body, second half','reception','asserts','2024-04-24',R,'dossier-archivist')
add('rrhorton','other: whole-work judgment',
 'Horton judges Always Coming Home more impressive than involving.',
 'Rich Horton, Strange at Ecbatan blog, 24 April 2024',
 'more impressive than it is involving','final verdict paragraph','reception','asserts','2024-04-24',R,'dossier-archivist')
add('rrhorton','civic record register',
 'Horton records that Le Guin placed a roughly hundred-page appendix called The Back of the Book at the end of the novel.',
 'Rich Horton, Strange at Ecbatan blog, 24 April 2024',
 'in the final section, some 100 pages','body, second paragraph','reception','mentions','2024-04-24',R,'dm-page')
add('rrhorton','point of view and distance',
 'Horton identifies the Pandora sections as the voice of the author or the future anthropologist recording the material.',
 'Rich Horton, Strange at Ecbatan blog, 24 April 2024',
 'a stand in for the author or the future anthropologist','body','reception','asserts','2024-04-24',R,'dossier-archivist')

add('triumph','civic record register',
 'Scott Manley Hadley describes Always Coming Home as a novel that masquerades as anthropology, a study of a people.',
 'Scott Manley Hadley, "Always Coming Home by Ursula Le Guin", Triumph Of The Now, 13 July 2019',
 'a novel that masquerades as anthropology, a study of a people','review body','reception','asserts','2019-07-13',R,'dossier-archivist')
add('triumph','place and institution description',
 'Hadley reports that Le Guin includes third-person essays on Kesh culture covering how they measure time and how they draw maps.',
 'Scott Manley Hadley, Triumph Of The Now, 13 July 2019',
 'how they measure time, how they draw maps','review body','reception','asserts','2019-07-13',R,'dossier-archivist')
add('triumph','other: non-narrative form',
 'Hadley calls Always Coming Home fiction without being storytelling, though it contains many stories.',
 'Scott Manley Hadley, Triumph Of The Now, 13 July 2019',
 'It is fiction without being storytelling, though it contains many','closing paragraphs','reception','asserts','2019-07-13',R,'dossier-archivist')

add('greenman','place and institution description',
 'Cat Eldridge contrasts the two worlds: Tolkien has virtually no ethnographic detail where Le Guin has no history.',
 'Cat Eldridge, review of Always Coming Home, A Green Man Review',
 'Tolkien\u2019s world has virtually no ethnographic detail','review body','reception','asserts','2001',R,'dossier-archivist')
add('greenman','civic record register',
 'Eldridge notes the back of the book gives further information on the Kesh in a traditional ethnographic form.',
 'Cat Eldridge, review of Always Coming Home, A Green Man Review',
 'contains additional information about the Kesh in a traditional ethnographic','review body','reception','asserts','2001',R,'dossier-archivist')
add('greenman','other: reading in fragments',
 'Eldridge advises that Always Coming Home is best read in very small pieces rather than continuously.',
 'Cat Eldridge, review of Always Coming Home, A Green Man Review',
 'read in very small pieces','review body','reception','asserts','2001',R,'dossier-archivist')

add('resilience','civic record register',
 'Nathanael Bonnell describes Always Coming Home as not a single story but a collection of texts.',
 'Nathanael Bonnell, review of Always Coming Home, New Maps (Winter 2021), republished Resilience.org 16 Feb 2023',
 'not a single story but a collection of texts','review body','reception','asserts','2023-02-16',R,'dossier-archivist')
add('resilience','civic record register',
 'Bonnell lists the document types the book collects, including short plays, songs, a chapter of a novel and personal accounts.',
 'Nathanael Bonnell, New Maps / Resilience.org, 16 Feb 2023',
 'short plays, songs, a chapter of a novel, personal accounts','review body','reception','asserts','2023-02-16',R,'dossier-archivist')
add('resilience','annalist voice and deep time',
 'Bonnell notes the present-day culture survives in the Kesh record only in stray fragments of folklore.',
 'Nathanael Bonnell, New Maps / Resilience.org, 16 Feb 2023',
 'remembered only in stray fragments of folklore','review body','reception','asserts','2023-02-16',R,'chronicle-line')
add('resilience','per-speaker register',
 'Bonnell reports Le Guin stages a dialogue between herself as narrator and a Kesh village archivist.',
 'Nathanael Bonnell, New Maps / Resilience.org, 16 Feb 2023',
 'a dialogue between herself-as-narrator and a Kesh village archivist','review body','reception','asserts','2023-02-16',R,'dossier-archivist')
add('resilience','terminology consistency',
 'Bonnell reports Le Guin opens by asking the reader to bear with some unfamiliar terms until they come clear.',
 'Ursula K. Le Guin, quoted by Nathanael Bonnell, New Maps / Resilience.org, 16 Feb 2023',
 'bear with some unfamiliar terms','review body','own-words','asserts','2023-02-16',R,'dossier-archivist')

# --- Omelas: describing a city
add('omelas-il','point of view and distance',
 'Oliver Tearle calls the Omelas narrator an uncertain narrator, as distinct from an unreliable narrator.',
 'Dr Oliver Tearle (Loughborough University), Interesting Literature, February 2021',
 'as distinct from an unreliable narrator','Analysis section','analysis','asserts','2021-02',R,'dossier-archivist')
add('omelas-il','omission as information',
 'Tearle notes the narrator confesses to lacking detailed knowledge of the laws and rules of Omelas.',
 'Dr Oliver Tearle, Interesting Literature, February 2021',
 'lacking detailed knowledge of the laws and rules of Omelas','Plot summary section','analysis','asserts','2021-02',R,'dossier-archivist')
add('omelas-il','place and institution description',
 'Tearle summarises that the city is characterised by the institutions it lacks: no King and no slaves.',
 'Dr Oliver Tearle, Interesting Literature, February 2021',
 'They have no King, and do not keep slaves','Plot summary section','analysis','applies','2021-02',R,'dossier-archivist')
add('omelas-il','place and institution description',
 'Tearle notes the description denies the city a stock exchange and advertisements.',
 'Dr Oliver Tearle, Interesting Literature, February 2021',
 'they have no stock exchange and no advertisements around the city','Plot summary section','analysis','applies','2021-02',R,'dossier-archivist')

add('omelas-llg','cadence and rhythm',
 'Sarah Wyman argues the long lines of the first paragraph mimic the festival parade the words describe.',
 'Sarah Wyman, professor of English at SUNY-New Paltz, analysis at Literary Ladies Guide',
 'long lines of the first paragraph mimic the festival parade','analysis, opening-paragraph discussion','analysis','asserts','2021',R,'herald-pools')
add('omelas-llg','other: sound patterning',
 'Wyman identifies a chiastic sound echo in the opening description of Omelas.',
 'Sarah Wyman, Literary Ladies Guide',
 'echoing the sonic features with a chiastic','analysis, opening-paragraph discussion','analysis','asserts','2021',R,'herald-pools')
add('omelas-llg','place and institution description',
 'Wyman quotes the narrator interrupting the description of the city to ask how one is to tell about joy.',
 'Ursula K. Le Guin, quoted by Sarah Wyman, Literary Ladies Guide',
 'How is one to tell about joy?','analysis, meta-textual turn','own-words','applies','2021',R,'dossier-archivist')
add('omelas-llg','point of view and distance',
 'Wyman reads the narrator as divesting herself of authority and responsibility for defining Omelas.',
 'Sarah Wyman, Literary Ladies Guide',
 'divest herself of authority and responsibility for defining Omelas','analysis, meta-textual turn','analysis','asserts','2021',R,'dossier-archivist')

add('omelas-pb','omission as information',
 'A student reader-response essay observes that Le Guin describes Omelas without giving exact details, leaving the reader to interpret.',
 'Student reader-response essay on Omelas, Beginnings and Endings: A Critical Edition (Pressbooks, College of Western Idaho)',
 'without giving exact details, allows the reader to interpret','Reader Response chapter','reader','asserts','2022-12',R,'dossier-archivist','medium: undergraduate reader response, not a scholarly source')

# --- Earthsea scale and institutions
add('erinramsay','place and institution description',
 'Erin Ramsay notes that in The Tombs of Atuan the conflict is administrative, over the posting of guards and how to punish unbelievers.',
 'Erin Ramsay, "Earthsea: A Sharpening of Scale", The Lighthouse (Substack)',
 'over the posting of guards and how to punish unbelievers','Tombs of Atuan section','analysis','asserts','2024',R,'dossier-archivist')
add('erinramsay','register modulation',
 'Ramsay argues the mythic register of A Wizard of Earthsea gives way to the realistic and mundane in The Tombs of Atuan.',
 'Erin Ramsay, "Earthsea: A Sharpening of Scale", The Lighthouse (Substack)',
 'gives way to the realistic and mundane in this novel','Tombs of Atuan section','analysis','asserts','2024',R,'chronicle-line')
add('erinramsay','other: narrowing of scale',
 'Ramsay reads Tehanu as the final sharpening of scale across the first four Earthsea books.',
 'Erin Ramsay, "Earthsea: A Sharpening of Scale", The Lighthouse (Substack)',
 'This is the final sharpening of scale across the first four','Tehanu section','analysis','asserts','2024',R,'none')
add('erinramsay','concrete sensory noun',
 'Ramsay quotes Le Guin describing the villagers of Lorbanery as sullen and silent in the large, soft rain of April.',
 'Ursula K. Le Guin, quoted by Erin Ramsay, The Lighthouse (Substack)',
 'sullen and silent in the large, soft rain of April','The Farthest Shore section','own-words','applies','2024',R,'dossier-archivist')

# --- Matt Bell sentence-level reading
add('mattbell-tor1','cadence and rhythm',
 'Matt Bell close-reads a Rocannon’s World sentence and points to the parallel construction of its two rhyming sets.',
 'Matt Bell, "My Le Guin Year: Craft Lessons From a Master", Reactor (Tor.com), 24 August 2021',
 'hear the parallel construction of the two rhyming sets','prose paragraph, mid-essay','analysis','asserts','2021-08-24',R,'herald-pools')
add('mattbell-tor1','other: escalation inside one sentence',
 'Bell describes the same sentence as containing two progressions that expand its scale as it goes.',
 'Matt Bell, Reactor (Tor.com), 24 August 2021',
 'See the two progressions expanding its scale as it goes','prose paragraph, mid-essay','analysis','asserts','2021-08-24',R,'chronicle-line')
add('mattbell-tor1','place and institution description',
 'Bell says Le Guin built cultures by working from the big picture down to the minutiae of local life.',
 'Matt Bell, Reactor (Tor.com), 24 August 2021',
 'working from the big picture down to the minutiae of local life','worldbuilding paragraph','analysis','asserts','2021-08-24',R,'dossier-archivist')
add('mattbell-tor1','concrete sensory noun',
 'Bell cites as a pleasurable detail the Gethenian table implement for cracking the ice formed on a drink.',
 'Ursula K. Le Guin (The Left Hand of Darkness), quoted by Matt Bell, Reactor, 24 August 2021',
 'with which you crack the ice that has formed','worldbuilding paragraph','own-words','applies','2021-08-24',R,'dossier-archivist')
add('mattbell-tor1','concrete sensory noun',
 'Bell singles out a Left Hand of Darkness sentence that names the landscape as four bare nouns.',
 'Ursula K. Le Guin (The Left Hand of Darkness), quoted by Matt Bell, Reactor, 24 August 2021',
 'rock, ice, sky, and silence: nothing else, for eighty-one days','opening anecdote','own-words','applies','2021-08-24',R,'dossier-archivist')
add('mattbell-tor1','plainness and economy',
 'A commenter on Bell’s essay says Le Guin can say more in twenty words than almost anyone.',
 'Reader comment on Matt Bell’s essay, Reactor comment thread',
 'She can say more in twenty words than almost anyone','comment thread','reader','asserts','2021-08',R,'none')

# --- forum
add('sffchron','archaism',
 'A forum reader describes the prose of A Wizard of Earthsea as very archaic.',
 'SilentRoamer, thread "Is a Wizard of Earthsea indicative of Le Guins writing style?", SFF Chronicles, 1 Aug 2022',
 'very archaic and flowed in a unique style','post #1','reader','asserts','2022-08-01',R,'none',
 'medium: a reader impression, and it runs against Le Guin’s own stated rejection of costume archaism')
add('sffchron','register modulation',
 'A forum moderator reports The Left Hand of Darkness is very different from the Earthsea books in style and tone.',
 'The Judge, SFF Chronicles thread 583221, 1 Aug 2022',
 'very different from the Earthsea books in style and tone','post #4','reader','asserts','2022-08-01',R,'none')

bad=m.check(C)
print("UNVERIFIED:",len(bad))
for b in bad: print(b)
json.dump(C,open('lgc-claims1.json','w'),indent=1)
print("total",len(C))
