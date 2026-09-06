# -*- coding: utf-8 -*-
import json, os, sys
RAW='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/leguin-voice2-raw'
OUT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-voice-2.json'

# url -> local text file used to verify quotations
FILES = {}
def reg(url, fn):
    FILES[url]=os.path.join(RAW,fn)

U_ELF='https://digginganddeepening.com/texts/ESSAYS/U%20K%20LeGuin/1973_FromElflandtoPoughkeepsie_1.pdf'
U_PLAUS='https://www.ursulakleguin.com/plausibility-in-fantasy-an-open-letter'
U_PREV='https://www.ursulakleguin.com/plausibility-revisited'
U_ASSUM='https://www.ursulakleguin.com/some-assumptions-about-fantasy'
U_MSG='https://www.ursulakleguin.com/message-about-messages'
U_Q1='https://www.ursulakleguin.com/bvc-navigation-q1'
U_R1='https://www.ursulakleguin.com/bvc-navigating-the-ocean-of-story-session-2-round-1'
U_3Q='https://www.ursulakleguin.com/bvc-navigating-the-ocean-of-story-session-2-three-new-questions'
U_S1P4='https://www.ursulakleguin.com/bvc-navigating-the-ocean-of-story-session-1-part-4'
reg(U_ELF,'elfland.txt')
reg(U_PLAUS,'ukl-plausibility-in-fantasy-an-open-letter.txt')
reg(U_PREV,'ukl-plausibility-revisited.txt')
reg(U_ASSUM,'ukl-some-assumptions-about-fantasy.txt')
reg(U_MSG,'ukl-message-about-messages.txt')
reg(U_Q1,'ukl-bvc-navigation-q1.txt')
reg(U_R1,'ukl-bvc-navigating-the-ocean-of-story-session-2-round-1.txt')
reg(U_3Q,'ukl-bvc-navigating-the-ocean-of-story-session-2-three-new-questions.txt')
reg(U_S1P4,'ukl-bvc-navigating-the-ocean-of-story-session-1-part-4.txt')

TEXT={u:open(p,encoding='utf-8',errors='replace').read() for u,p in FILES.items() if os.path.exists(p)}

def C(feature,claim,source,url,quote,page,kind,polarity,date,routeHint,registerHint,confidence):
    return dict(feature=feature,claim=claim,source=source,url=url,quote=quote,page=page,kind=kind,
                polarity=polarity,date=date,routeHint=routeHint,registerHint=registerHint,confidence=confidence)

claims=[]
def add(*a): claims.append(C(*a))

ELF_SRC='Ursula K. Le Guin, "From Elfland to Poughkeepsie" (speech 1972; Pendragon Press booklet 1973; in The Language of the Night, 1979)'
ELF_RT='live URL, browser UA; third-party PDF transcription (digginganddeepening.com), text extracted with pypdf'
ELF_PG='essay text, section 8 (the plain-style passage) unless noted'

add('plainness and economy','Le Guin states that a plain language is the noblest of all.',ELF_SRC,U_ELF,'A plain language is the noblest of all.','p.8 of the PDF, after the epic examples','own-words','asserts','1973',ELF_RT,'dossier-archivist','high')
add('plainness and economy','Le Guin calls clarity and simplicity permanent virtues in a narrative.',ELF_SRC,U_ELF,'Clarity and simplicity are permanent virtues in a narrative.','p.8 of the PDF','own-words','asserts','1973',ELF_RT,'dossier-archivist','high')
add('plainness and economy','Le Guin says that plain language is also the most difficult kind to write.',ELF_SRC,U_ELF,'It is also the most difficult.','p.8 of the PDF, the sentence after "A plain language is the noblest of all."','own-words','asserts','1973',ELF_RT,'dossier-archivist','high')
add('diction (native vs latinate)','Le Guin describes Tolkien’s vocabulary as unstriking and everything in it as direct, concrete and simple.',ELF_SRC,U_ELF,'everything is direct, concrete, and simple','p.8 of the PDF','own-words','asserts','1973',ELF_RT,'dossier-archivist','high')
add('register modulation','Le Guin says the outstanding virtue of Tolkien’s plain English is its flexibility, ranging easily from the commonplace to the stately.',ELF_SRC,U_ELF,'It ranges easily from the commonplace to the stately','p.8 of the PDF','own-words','asserts','1973',ELF_RT,'chronicle-line','high')
add('plainness and economy','Le Guin distinguishes a fake plainness that is not really simple but flat from genuine plain style.',ELF_SRC,U_ELF,'It is not really simple, but flat.','p.8 of the PDF, on the "Poughkeepsie style"','own-words','rejects','1973',ELF_RT,'dossier-archivist','high')
add('concrete sensory noun','Le Guin faults the flat fantasy style because its rocks, wind and trees are not there and not felt.',ELF_SRC,U_ELF,'the rocks, the wind, the trees are not there','p.8 of the PDF','own-words','rejects','1973',ELF_RT,'dossier-archivist','high')
add('other: journalistic register','Le Guin identifies the flat fantasy prose she is attacking as journalistic prose.',ELF_SRC,U_ELF,'It is journalistic prose.','p.8 of the PDF','own-words','rejects','1973',ELF_RT,'dossier-archivist','high')
add('other: journalistic register','Le Guin says journalism deliberately suppresses the author’s personality and sensibility to give an impression of objectivity.',ELF_SRC,U_ELF,"the suppression of the author's personality and sensibility is deliberate",'p.8 of the PDF','own-words','asserts','1973',ELF_RT,'dossier-archivist','high')
add('other: journalistic register','Le Guin says the journalistic technique is right for a newspaper but wrong for a novel and dead wrong for a fantasy.',ELF_SRC,U_ELF,'This technique is right, for a newspaper.','p.8 of the PDF','own-words','rejects','1973',ELF_RT,'dossier-archivist','high')
add('archaism','Le Guin calls the archaic manner a trap into which almost all very young fantasy writers walk, and says she did herself.',ELF_SRC,U_ELF,'a trap into which almost all very young fantasy writers walk','p.5 of the PDF','own-words','rejects','1973',ELF_RT,'none','high')
add('archaism','Le Guin grants that the archaic manner is a perfect distancer but says it must be done perfectly.',ELF_SRC,U_ELF,'The archaic manner is indeed a perfect distancer','p.6 of the PDF','own-words','asserts','1973',ELF_RT,'none','high')
add('archaism','Le Guin names ichor as the infallible touchstone of the seventh-rate among fantasy’s fancy words.',ELF_SRC,U_ELF,'the infallible touchstone of the seventh-rate: Ichor','p.6 of the PDF','own-words','rejects','1973',ELF_RT,'none','high')
add('archaism','Le Guin concludes that archaisms are not essential to fantasy.',ELF_SRC,U_ELF,'After all, archaisms are not essential.','p.8 of the PDF','own-words','rejects','1973',ELF_RT,'none','high')
add('dialogue register','Le Guin states flatly that speech expresses character, whether or not the speaker or author knows it.',ELF_SRC,U_ELF,'Speech expresses character.','p.4 of the PDF','own-words','asserts','1973',ELF_RT,'none','high')
add('parataxis vs hypotaxis','Le Guin says most epics are in straightforward language, whether prose or verse, retaining the directness of their oral forebears.',ELF_SRC,U_ELF,'Most epics are in straightforward language, whether prose or verse.','p.8 of the PDF','own-words','asserts','1973',ELF_RT,'chronicle-line','high')
add('metaphor discipline','Le Guin reports that The Song of Roland has four thousand lines containing one simile and no metaphors.',ELF_SRC,U_ELF,'The Song of Roland has four thousand lines, containing one simile and no metaphors.','p.8 of the PDF','own-words','asserts','1973',ELF_RT,'chronicle-line','high')
add('metaphor discipline','Le Guin says Homer’s metaphors may be extended but are neither static nor ornate.',ELF_SRC,U_ELF,'they are neither static nor ornate','p.8 of the PDF','own-words','asserts','1973',ELF_RT,'chronicle-line','high')
add('other: style as substance','Le Guin says the style, of course, is the book, and that this is absolutely true of fantasy.',ELF_SRC,U_ELF,'The style, of course, is the book.','p.9 of the PDF','own-words','asserts','1973',ELF_RT,'none','high')
add('other: style as substance','Le Guin says that if you remove the style all you have left is a synopsis of the plot.',ELF_SRC,U_ELF,'all you have left is a synopsis of the plot','p.9 of the PDF','own-words','asserts','1973',ELF_RT,'none','high')
add('other: style as substance','Le Guin says that from the writer’s point of view the style is the writer.',ELF_SRC,U_ELF,'the style is the writer','p.9 of the PDF','own-words','asserts','1973',ELF_RT,'none','high')
add('place and institution description','Le Guin says a secondary world is a construct built in a void with every joint and seam and nail exposed, because there is no borrowed reality to hide behind.',ELF_SRC,U_ELF,'with every joint and seam and nail exposed','p.9-10 of the PDF','own-words','asserts','1973',ELF_RT,'dossier-archivist','high')
add('plainness and economy','Le Guin ends her account of the secondary world with the sentence that every word counts.',ELF_SRC,U_ELF,'And every word counts.','p.10 of the PDF','own-words','asserts','1973',ELF_RT,'dossier-archivist','high')
add('cadence and rhythm','Le Guin defines the musical dimension of prose as the sound of the words, the movement of the syntax and the rhythm of the sentences.',ELF_SRC,U_ELF,'the movement of the syntax, and the rhythm of the sentences','p.6 of the PDF, on Eddison','own-words','asserts','1973',ELF_RT,'none','high')
add('archaism','Le Guin praises Eddison’s archaic prose as exact, clear and powerful despite or because of its archaisms.',ELF_SRC,U_ELF,'exact, clear, powerful','p.6 of the PDF','own-words','asserts','1973',ELF_RT,'none','high')
add('register modulation','Le Guin criticises Leiber and Zelazny for alternating a colloquial American style with old formal usages within one work.',ELF_SRC,U_ELF,'they alternate the two styles','p.7 of the PDF','own-words','rejects','1973',ELF_RT,'none','high')
add('dialogue register','Le Guin observes that give-and-take conversations in Dunsany tend to be very brief, as they do in the Bible.',ELF_SRC,U_ELF,'tend to be very brief, as they do in the Bible','p.5 of the PDF','own-words','asserts','1973',ELF_RT,'herald-pools','high')
add('archaism','Le Guin says Jack Vance’s achieved style contains no archaisms at all.',ELF_SRC,U_ELF,'it contains no archaisms at all','p.7 of the PDF','own-words','asserts','1973',ELF_RT,'dossier-archivist','high')

PL_SRC='Ursula K. Le Guin, "Plausibility in Fantasy: an open letter to Alexei Mutovkin" (2005), ursulakleguin.com'
PL_RT='live URL, curl with browser UA, tags stripped locally'
add('place and institution description','Le Guin says Tolkien’s references to places, people and events outside the immediate story give the reader a conviction of the reality of the immediate scene.',PL_SRC,U_PLAUS,'a conviction of the reality of the immediate scene','open letter, paragraph on Tolkien','own-words','asserts','2005',PL_RT,'dossier-archivist','high')
add('concrete sensory noun','Le Guin says exact and vivid words make an exact and vivid world.',PL_SRC,U_PLAUS,'Exact and vivid words make an exact and vivid world.','open letter, paragraph on detail','own-words','asserts','2005',PL_RT,'dossier-archivist','high')
add('other: coherence','Le Guin says the touchstone of plausibility in imaginative fiction is probably coherence.',PL_SRC,U_PLAUS,'The touchstone to plausibility in imaginative fiction is probably coherence.','open letter, penultimate section','own-words','asserts','2005',PL_RT,'none','high')
add('terminology consistency','Le Guin says the rules governing how things work in an imagined world cannot be changed during the story.',PL_SRC,U_PLAUS,'cannot be changed during the story','open letter, penultimate section','own-words','asserts','2005',PL_RT,'dossier-archivist','high')
add('withheld information and inference','Le Guin says she has often mentioned events and places in her fantasies that she did not yet know anything about, which were merely words when she wrote them.',PL_SRC,U_PLAUS,'These were, when I wrote them, merely words','open letter, paragraph on Earthsea','own-words','asserts','2005',PL_RT,'dossier-archivist','high')

PR_SRC='Ursula K. Le Guin, "Plausibility Revisited: Wha Hoppen and What Didn’t" (2005), ursulakleguin.com'
add('other: coherence','Le Guin says fiction validates itself through accurate, honest observation of the world it creates.',PR_SRC,U_PREV,'accurate, honest observation of the world it creates','second paragraph','own-words','asserts','2005',PL_RT,'dossier-archivist','high')
add('other: coherence','Le Guin says what constitutes plausibility in fantasy is the coherence of the story and its consistent self-reference.',PR_SRC,U_PREV,'the coherence of the story, its consistent self-reference','paragraph on fantasy','own-words','asserts','2005',PL_RT,'dossier-archivist','high')
add('concrete sensory noun','Le Guin says realistic detail is used in fantasy only in lesser matters, to ground the story and prevent an overload of the improbable.',PR_SRC,U_PREV,'Only in lesser matters is realistic detail used to ground the story','paragraph on fantasy','own-words','asserts','2005',PL_RT,'dossier-archivist','high')

AS_SRC='Ursula K. Le Guin, "Some Assumptions about Fantasy", speech at the Children’s Literature Breakfast, BookExpo America, Chicago, 4 June 2004'
add('place and institution description','Le Guin says that a fantasy world resembling preindustrial mediaeval Europe is not thereby justified in having no economics and no social justice.',AS_SRC,U_ASSUM,'no economics and no social justice','Assumption 2','own-words','asserts','2004',PL_RT,'dossier-archivist','high')
add('place and institution description','Le Guin says she feels like setting off fireworks whenever she finds a fantasy set in a genuinely imagined society and culture.',AS_SRC,U_ASSUM,'set in a genuinely imagined society and culture','Assumption 2','own-words','asserts','2004',PL_RT,'dossier-archivist','high')
add('other: material consequence','Le Guin names the unfed, unwatered horses of lazy fantasy as a symptom of a world that has not been imagined.',AS_SRC,U_ASSUM,'nobody there ever feeds or waters their horses','Assumption 2','own-words','rejects','2004',PL_RT,'dossier-archivist','high')

MSG_SRC='Ursula K. Le Guin, "A Message About Messages", CBC Magazine, 2005 (text at ursulakleguin.com)'
add('other: style as substance','Le Guin asks whether reviewers ever consider that the meaning of a story might lie in the language itself rather than in a tidy bit of advice.',MSG_SRC,U_MSG,'the meaning of the story might lie in the language itself','third paragraph','own-words','asserts','2005',PL_RT,'none','high')

Q1_SRC='Ursula K. Le Guin, "Navigation Q1: How do you make something good?", Book View Café, 27 July 2015 (text at ursulakleguin.com)'
add('plainness and economy','Le Guin says that with the most ordinary ingredients, naming everyday language among them, and care and skill in using them, a writer can make something extremely good.',Q1_SRC,U_Q1,'potatoes, everyday language, commonplace characters','third paragraph','own-words','asserts','2015',PL_RT,'dossier-archivist','high')
add('other: rules of writing','Le Guin says most rules of what is currently trendy or supposedly salable are hogwash.',Q1_SRC,U_Q1,'Most such rules are hogwash','paragraph on the pressure of opinion','own-words','rejects','2015',PL_RT,'none','high')

R1_SRC='Ursula K. Le Guin, "Navigating the Ocean of Story: Session 2, Round 1", Book View Café, 2016 (text at ursulakleguin.com)'
add('cadence and rhythm','Le Guin says prose rhythms are regular, if at all, only on a very much larger and longer scale than metrical feet.',R1_SRC,U_R1,'only on a very much larger, longer scale','answer to Alex, question 1','own-words','asserts','2016',PL_RT,'none','high')
add('cadence and rhythm','Le Guin says prose rhythms are hard to talk about because we have no vocabulary for them.',R1_SRC,U_R1,'we have no vocabulary for them','answer to Alex, question 1','own-words','asserts','2016',PL_RT,'none','high')
add('cadence and rhythm','Le Guin says that whether composing or rewriting she does not think consciously about the rhythmic factors in a story.',R1_SRC,U_R1,'I don’t think consciously about the rhythmic factors in a story','answer to Alex, question 1','own-words','asserts','2016',PL_RT,'none','high')
add('cadence and rhythm','Le Guin says reading aloud makes you aware of a word or phrase that tangles up the pace and needs to be moved or removed.',R1_SRC,U_R1,'a word or a phrase that tangles up the pace','answer to Alex, question 1','own-words','asserts','2016',PL_RT,'none','high')
add('cadence and rhythm','Le Guin says a hesitation while reading your own prose aloud may reveal a fault in the rhythm.',R1_SRC,U_R1,'Wherever you hesitate in your reading aloud may reveal a fault','answer to Alex, question 1','own-words','asserts','2016',PL_RT,'none','high')
add('omission as information','Le Guin says pity and terror are achieved more often through brevity, a few telling details and a great deal left unsaid than through wallowing in a bloodbath.',R1_SRC,U_R1,'brevity, a few telling details, a great left unsaid','answer to Lauren, question 5 (the page as fetched reads "a great left unsaid")','own-words','asserts','2016',PL_RT,'chronicle-line','high')
add('omission as information','Le Guin praises a Patrick O’Brian scene of a ship going down with five hundred men aboard as one that could not be shorter, more silent, or more shocking.',R1_SRC,U_R1,'could not be shorter, more silent, or more shocking','answer to Lauren, question 5','own-words','asserts','2016',PL_RT,'chronicle-line','high')
add('other: scale and emotional effect','Le Guin says magnitude dilutes the emotional effect of a literary massacre, a mutilated corpse or two making us flinch where a thousand orcs in agony leave us unmoved.',R1_SRC,U_R1,'a thousand orcs in agony leave us unmoved','answer to Lauren, question 5','own-words','asserts','2016',PL_RT,'chronicle-line','high')
add('closing sentence','Le Guin recommends thinking of a story as an organic whole in which the beginning will imply the end and the end will fulfill the beginning.',R1_SRC,U_R1,'the beginning will imply the end','answer to Isaac, question 2','own-words','asserts','2016',PL_RT,'none','high')
add('other: conflict is not obligatory','Le Guin, quoting page 123 of her own Steering the Craft, lists relating, finding, losing, bearing, discovering, parting and changing as behaviours equally important to conflict.',R1_SRC,U_R1,'relating, finding, losing, bearing, discovering, parting, changing','answer to Anthony, question 3, quoting Steering the Craft p.123','own-words','asserts','2016',PL_RT,'none','high')
add('concrete sensory noun','Le Guin advises describing just enough of a character’s appearance to give the noticing reader a clear clue, saying one physical detail will often do it.',R1_SRC,U_R1,'Often one physical detail will do it','answer to Beth, question 4','own-words','asserts','2016',PL_RT,'dossier-archivist','high')

TQ_SRC='Ursula K. Le Guin, "Navigating the Ocean of Story: Session 2 — Three New Questions", Book View Café, 21 March 2016 (text at ursulakleguin.com)'
add('place and institution description','Le Guin says her own specimen general description of an invented town, placing Horb on the coast of the southernmost of nine continents, implies very little.',TQ_SRC,U_3Q,'This general description implies very little','answer to Nicole and Bayla, world-building demonstration','own-words','asserts','2016',PL_RT,'dossier-archivist','high')
add('place and institution description','Le Guin says her second specimen sentence about Horb lets the reader learn that the place has a long-established trading economy without stating it.',TQ_SRC,U_3Q,'it has a long-established trading economy','answer to Nicole and Bayla, world-building demonstration','own-words','asserts','2016',PL_RT,'dossier-archivist','high')
add('concrete sensory noun','Le Guin says the difference between her two specimen descriptions is specificity, and prescribes packing sentences with specifics, not with generalities.',TQ_SRC,U_3Q,'packing your sentences with specifics, not with generalities','answer to Nicole and Bayla','own-words','asserts','2016',PL_RT,'dossier-archivist','high')
add('other: default medievalism','Le Guin says a specimen sentence putting a rider and a palace gate into Horb lands the reader in the European Middle Ages so that nobody has to do any thinking about it at all.',TQ_SRC,U_3Q,'Nobody has to do any thinking about it at all','answer to Nicole and Bayla','own-words','rejects','2016',PL_RT,'dossier-archivist','high')
add('withheld information and inference','Le Guin says a reader will learn what an unexplained invented term means but may have to wait a while, and that lazy readers find waiting uncomfortable.',TQ_SRC,U_3Q,'The reader will learn what it is','answer to Nicole and Bayla','own-words','asserts','2016',PL_RT,'dossier-archivist','high')
add('omission as information','Le Guin says a writer can fake quite a lot or leave it unsaid so long as the invented world looks and smells and tastes real.',TQ_SRC,U_3Q,'so long as your world looks and smells and tastes real','final answer to Nicole and Bayla','own-words','asserts','2016',PL_RT,'dossier-archivist','high')
add('other: worldbuilding before writing','Le Guin answers that yes, she does spend a lot of time building the world before writing the story set in it.',TQ_SRC,U_3Q,'Yes. I do.','answer to Nicole and Bayla, "Do you spend a lot of time building the world"','own-words','asserts','2016',PL_RT,'dossier-archivist','high')

S1P4_SRC='Ursula K. Le Guin, "Navigating the Ocean of Story: Session 1, Part 4", Book View Café, 21 September 2015 (text at ursulakleguin.com)'
add('other: the writer’s aim','Le Guin says she did not set out to write successful books but tried to write good ones.',S1P4_SRC,U_S1P4,'I tried to write good ones','answer to Esme','own-words','asserts','2015',PL_RT,'none','high')

# ---- verification ----
bad=[]
for i,c in enumerate(claims):
    q=c['quote']
    if not q: continue
    t=TEXT.get(c['url'])
    if t is None:
        bad.append((i,'NO LOCAL TEXT',c['url'])); continue
    if q not in t:
        bad.append((i,'QUOTE MISS',q))
for b in bad: print('BAD',b, file=sys.stderr)

sources=[
 dict(title='From Elfland to Poughkeepsie (1973) — full essay text, PDF transcription',url=U_ELF,kind='own-words',substantive=True,date='1973 (speech 1972)',route='live URL + browser UA; pypdf text extraction'),
 dict(title='Plausibility in Fantasy: an open letter to Alexei Mutovkin',url=U_PLAUS,kind='own-words',substantive=True,date='2005',route='live URL + browser UA'),
 dict(title='Plausibility Revisited: Wha Hoppen and What Didn’t',url=U_PREV,kind='own-words',substantive=True,date='2005',route='live URL + browser UA'),
 dict(title='Some Assumptions about Fantasy (BookExpo America speech)',url=U_ASSUM,kind='own-words',substantive=True,date='4 June 2004',route='live URL + browser UA'),
 dict(title='A Message About Messages (CBC Magazine)',url=U_MSG,kind='own-words',substantive=True,date='2005',route='live URL + browser UA'),
 dict(title='Navigation Q1: How do you make something good?',url=U_Q1,kind='own-words',substantive=True,date='27 July 2015',route='live URL + browser UA'),
 dict(title='Navigating the Ocean of Story: Session 2, Round 1',url=U_R1,kind='own-words',substantive=True,date='2016',route='live URL + browser UA'),
 dict(title='Navigating the Ocean of Story: Session 2 — Three New Questions',url=U_3Q,kind='own-words',substantive=True,date='21 March 2016',route='live URL + browser UA'),
 dict(title='Navigating the Ocean of Story: Session 1, Part 4',url=U_S1P4,kind='own-words',substantive=True,date='21 September 2015',route='live URL + browser UA'),
 dict(title='Navigating the Ocean of Story: Session 2 (criticism of strangers)',url='https://www.ursulakleguin.com/bvc-navigating-the-ocean-of-story-session-2',kind='own-words',substantive=False,date='15 February 2016',route='live URL + browser UA'),
 dict(title='On Serious Literature (Ansible parody)',url='https://www.ursulakleguin.com/on-serious-literature',kind='own-words',substantive=False,date='2007',route='live URL + browser UA'),
 dict(title='Tales from Earthsea — publisher/bibliography page',url='https://www.ursulakleguin.com/tales-from-earthsea',kind='relay',substantive=False,date='2001 book',route='live URL + browser UA'),
 dict(title='The Books of Earthsea — page with "A Note from Ursula"',url='https://www.ursulakleguin.com/the-books-of-earthsea',kind='own-words',substantive=False,date='2018 book',route='live URL + browser UA'),
 dict(title='archive.org item metadata: Tales from Earthsea (talesfromearthse0000legu)',url='https://archive.org/metadata/talesfromearthse0000legu',kind='relay',substantive=False,date='2001 edition',route='archive.org metadata API; full text access-restricted'),
 dict(title='archive.org item metadata: The Books of Earthsea (booksofearthsea0000legu)',url='https://archive.org/metadata/booksofearthsea0000legu',kind='relay',substantive=False,date='2018 edition',route='archive.org metadata API; full text access-restricted'),
 dict(title='archive.org item metadata: Conversations on Writing (ursulakleguincon0000legu)',url='https://archive.org/metadata/ursulakleguincon0000legu',kind='relay',substantive=False,date='2018 edition',route='archive.org metadata API; full text access-restricted'),
]

json.dump(dict(complete=False,coverage='in progress — round 2 of the voice angle',sourcesRead=sources,claims=claims),
          open(OUT,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('claims',len(claims),'sources',len(sources),'bad',len(bad))
