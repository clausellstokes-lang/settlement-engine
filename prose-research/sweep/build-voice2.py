# -*- coding: utf-8 -*-
import json, os, sys
RAW='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/sweep/leguin-voice2-raw'
OUT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/sweep/found-leguin-voice-2.json'

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


# ==== ROUND 2 BATCH B ====
U_PB='https://www.publicbooks.org/the-storys-where-i-go-an-interview-with-ursula-k-le-guin/'
U_L01='https://www.locusmag.com/2001/Issue09/LeGuin.html'
U_L08='http://www.locusmag.com/2008/Issue10_LeGuin.html'
U_G04='http://books.guardian.co.uk/departments/sciencefiction/story/0,6000,1144428,00.html'
U_VSW='https://vermontsoftworks.com/post/2023/leguin-rhythmic-pattern-in-lotr/'
U_LARB='https://lareviewofbooks.org/article/writing-nameless-things-an-interview-with-ursula-k-le-guin/'
reg(U_PB,'iv-publicbooks.txt'); reg(U_L01,'iv-locus2001.txt'); reg(U_L08,'iv-locus2008.txt')
reg(U_G04,'iv-guardian2004.txt'); reg(U_VSW,'vsw.html'); reg(U_LARB,'iv-larb2017.txt')
TEXT.update({u:open(FILES[u],encoding='utf-8',errors='replace').read() for u in [U_PB,U_L01,U_L08,U_G04,U_VSW,U_LARB]})

PB_SRC='Ursula K. Le Guin interviewed by John Plotz, "The Story\u2019s Where I Go", Public Books, 15 June 2015'
PB_RT='live URL, curl with browser UA, tags stripped locally'
add('concrete sensory noun','Le Guin says of her own practice that she is very strong on accuracy and exactitude.',PB_SRC,U_PB,'I\u2019m very strong on accuracy and exactitude.','answer on describing an invented world','own-words','asserts','2015',PB_RT,'dossier-archivist','high')
add('place and institution description','Le Guin says that with an invented world you have to describe more than a realist does.',PB_SRC,U_PB,'you have to describe more than a realist does','answer on describing an invented world','own-words','asserts','2015',PB_RT,'dossier-archivist','high')
add('omission as information','Le Guin says that in describing an invented world the leaving-out is half the art, and the reader fills the white spaces.',PB_SRC,U_PB,'the leaving-out is half the art','answer on describing an invented world','own-words','asserts','2015',PB_RT,'dossier-archivist','high')
add('plainness and economy','Le Guin says you cannot describe everything because that would be very boring.',PB_SRC,U_PB,'You can\u2019t describe everything','answer on describing an invented world','own-words','asserts','2015',PB_RT,'dossier-archivist','high')

L01_SRC='Ursula K. Le Guin, interview excerpts, "A Return to Earthsea", Locus Magazine, September 2001 (Locus Online excerpts page)'
add('plainness and economy','Le Guin says she has learned to stop fiddling and twiddling because fiction needs a certain roughness.',L01_SRC,U_L01,'Fiction needs a certain roughness.','excerpt on composition and revision','own-words','asserts','2001',PB_RT+'; cp1252 decoding','none','high')
add('plainness and economy','Le Guin says she has read overpolished fiction and found it kind of a bore.',L01_SRC,U_L01,'I\u2019ve read overpolished fiction, and it\u2019s kind of a bore.','excerpt on composition and revision','own-words','asserts','2001',PB_RT+'; cp1252 decoding','none','high')
add('other: plot versus situation','Le Guin says her books are character-driven and that she does not have plots but situations and stories.',L01_SRC,U_L01,'I don\u2019t have plots; I have situations, I have stories.','excerpt on plotting','own-words','asserts','2001',PB_RT+'; cp1252 decoding','none','high')
add('annalist voice and deep time','Le Guin describes researching the history of Earthsea as going into the archives, which are all in her head.',L01_SRC,U_L01,'I went into the archives','excerpt on returning to Earthsea','own-words','asserts','2001',PB_RT+'; cp1252 decoding','chronicle-line','high')

L08_SRC='Ursula K. Le Guin, interview excerpts, "The Age of Saturn", Locus Magazine, October 2008 (Locus Online excerpts page)'
add('other: research and factual accuracy','Le Guin says that in a historical novel, as in science fiction, there are some facts you want to get right before you cut loose.',L08_SRC,U_L08,"There are some facts, and you want to get 'em right",'excerpt on Lavinia','own-words','asserts','2008',PB_RT+'; cp1252 decoding','dossier-archivist','high')
add('other: research and factual accuracy','Le Guin quotes Samuel Delany\u2019s rule that you use what is known to be known.',L08_SRC,U_L08,'You use what is known to be known.','excerpt on Lavinia','own-words','asserts','2008',PB_RT+'; cp1252 decoding','dossier-archivist','high')

G04_SRC='Ursula K. Le Guin, "Chronicles of Earthsea" reader Q&A, The Guardian, 9 February 2004'
add('point of view and distance','Le Guin says that to write Tehanu all she had to do was describe Earthsea from the point of view of the powerless and disempowered.',G04_SRC,U_G04,'describe it from the point of view of the powerless','answer on the gap between The Farthest Shore and Tehanu','own-words','asserts','2004',PB_RT,'dossier-archivist','high')
add('other: style as substance','Le Guin refuses to paraphrase her own book, saying what the book says it says best in its own words.',G04_SRC,U_G04,'What the book says, the book says best in its own words.','final answer','own-words','asserts','2004',PB_RT,'none','high')
add('other: judgement of another style','Le Guin judges the first Harry Potter book stylistically ordinary, imaginatively derivative and ethically rather mean-spirited.',G04_SRC,U_G04,'stylistically ordinary, imaginatively derivative, and ethically rather mean-spirited','answer on J.K. Rowling','own-words','rejects','2004',PB_RT,'none','high')

VSW_SRC='Erik D. Mueller-Harder, Vermont Softworks blog, 28 September 2023, quoting Le Guin, "Rhythmic Pattern in The Lord of the Rings" (Meditations on Middle-earth, 2001)'
VSW_RT='live URL, curl with browser UA; a blog quoting the essay \u2014 relay, the primary essay text was not reached'
add('cadence and rhythm','Le Guin, quoted by a blogger, says that even when Tolkien\u2019s sentences are long their flow is clear and punctuation comes just where you need to pause.',VSW_SRC,U_VSW,'punctuation comes just where you need to pause','blog post body, block quotation from the essay','relay','asserts','2023 (essay 2001)',VSW_RT,'chronicle-line','medium')
add('cadence and rhythm','Le Guin, quoted by a blogger, calls the cadences of Tolkien\u2019s prose graceful and inevitable.',VSW_SRC,U_VSW,'the cadences are graceful and inevitable','blog post body, block quotation from the essay','relay','asserts','2023 (essay 2001)',VSW_RT,'chronicle-line','medium')
add('cadence and rhythm','Le Guin, quoted by a blogger, concludes that Tolkien must have heard what he wrote.',VSW_SRC,U_VSW,'Tolkien must have heard what he wrote','blog post body, quotation from the essay','relay','asserts','2023 (essay 2001)',VSW_RT,'chronicle-line','medium')

EXTRA_SOURCES = [
 dict(title='The Story\u2019s Where I Go: An Interview With Ursula K. Le Guin (John Plotz)',url=U_PB,kind='own-words',substantive=True,date='15 June 2015',route='live URL + browser UA'),
 dict(title='Ursula K. Le Guin: A Return to Earthsea \u2014 Locus interview excerpts',url=U_L01,kind='own-words',substantive=True,date='September 2001',route='live URL + browser UA, cp1252 decoding'),
 dict(title='Ursula K. Le Guin: The Age of Saturn \u2014 Locus interview excerpts',url=U_L08,kind='own-words',substantive=True,date='October 2008',route='live URL + browser UA, cp1252 decoding'),
 dict(title='Chronicles of Earthsea \u2014 reader Q&A, The Guardian',url=U_G04,kind='own-words',substantive=True,date='9 February 2004',route='live URL + browser UA'),
 dict(title='Vermont Softworks blog quoting "Rhythmic Pattern in The Lord of the Rings"',url=U_VSW,kind='relay',substantive=True,date='28 September 2023 (essay 2001)',route='live URL + browser UA'),
 dict(title='Writing Nameless Things: An Interview with Ursula K. Le Guin (David Streitfeld), LARB',url=U_LARB,kind='own-words',substantive=False,date='17 November 2017',route='live URL + browser UA \u2014 read in full; little on prose style'),
 dict(title='Ursula K. Le Guin \u2014 Interviews with Ursula (index of interviews)',url='https://www.ursulakleguin.com/interviews-ursula',kind='relay',substantive=False,date='site index',route='live URL + browser UA'),
 dict(title='Ursula at Book View Caf\u00e9: Navigating the Ocean of Story (index)',url='https://www.ursulakleguin.com/book-view-cafe-posts',kind='relay',substantive=False,date='site index',route='live URL + browser UA'),
]


# ==== ROUND 2 BATCH C: Dancing at the Edge of the World (1989), full text ====
U_DANCE='https://ebin.pub/dancing-at-the-edge-of-the-world-thoughts-on-words-women-places-9780802135292.html'
reg(U_DANCE,'ebin-dancing.txt'); TEXT[U_DANCE]=open(FILES[U_DANCE],encoding='utf-8',errors='replace').read()
D_RT='live URL, curl with browser UA; a full-text scan of the Grove Press edition hosted at ebin.pub, tags stripped locally (OCR artefacts present)'

STN='Ursula K. Le Guin, "Some Thoughts on Narrative" (1980), in Dancing at the Edge of the World (1989)'
add('other: tense and register','Le Guin observes that anthropological reports about people who died decades ago and about societies that no longer exist are written in the present tense.',STN,U_DANCE,'whose societies no longer exist, are written in the present tense','"Some Thoughts on Narrative", p.38','own-words','asserts','1980',D_RT,'dossier-archivist','high')
add('other: tense and register','Le Guin says the present tense takes the story out of time.',STN,U_DANCE,'The present tense takes the story out of time.','"Some Thoughts on Narrative", p.38','own-words','asserts','1980',D_RT,'dossier-archivist','high')
add('point of view and distance','Le Guin says the present tense, used by some writers to make the telling more actual, actually distances the story.',STN,U_DANCE,'actually distances the story','"Some Thoughts on Narrative", p.38','own-words','asserts','1980',D_RT,'dossier-archivist','high')
add('other: tense and register','Le Guin says narrative does not normally use the present tense except for special effect or out of affectation.',STN,U_DANCE,'narrative does not normally use the present tense except for special effect','"Some Thoughts on Narrative", p.38','own-words','asserts','1980',D_RT,'chronicle-line','high')
add('point of view and distance','Le Guin says narrative locates itself in the past in order to allow itself forward movement.',STN,U_DANCE,'It locates itself in the past','"Some Thoughts on Narrative", p.38','own-words','asserts','1980',D_RT,'chronicle-line','high')
add('other: definition of narrative','Le Guin defines narrative as language used to connect events in time.',STN,U_DANCE,'narrative is language used to connect events in time','"Some Thoughts on Narrative", p.38','own-words','asserts','1980',D_RT,'chronicle-line','high')
add('other: definition of narrative','Le Guin calls narrative a stratagem of mortality.',STN,U_DANCE,'Narrative is a stratagem of mortality.','"Some Thoughts on Narrative", p.39','own-words','asserts','1980',D_RT,'none','high')

DSN='Ursula K. Le Guin, "It Was a Dark and Stormy Night; or, Why Are We Huddling about the Campfire?" (1979), in Dancing at the Edge of the World (1989)'
add('civic record register','Le Guin presents a single line of runes carved in Carlisle Cathedral, reading that Tolfink carved these runes in this stone, as a whole story.',DSN,U_DANCE,'Tolfink carved these runes in this stone.','"It Was a Dark and Stormy Night", p.29','own-words','asserts','1979',D_RT,'chronicle-line','high')
add('annalist voice and deep time','Le Guin says that runic inscription is pretty close to Barbara Herrnstein Smith\u2019s earliest form of historiography, notch-cutting.',DSN,U_DANCE,'Barbara Herrnstein Smith\u2019s earliest form of historiography','"It Was a Dark and Stormy Night", p.29','own-words','asserts','1979',D_RT,'chronicle-line','high')
add('civic record register','Le Guin says the inscription does not really meet the requirement of Minimal Connexity and has little beginning or end.',DSN,U_DANCE,'it does not really meet the requirement of Minimal Connexity','"It Was a Dark and Stormy Night", p.29','own-words','asserts','1979',D_RT,'chronicle-line','high')
add('civic record register','Le Guin nonetheless judges the carver of that inscription a reliable narrator who bore witness to his own existence.',DSN,U_DANCE,'Tolfink was a reliable narrator','"It Was a Dark and Stormy Night", p.29','own-words','asserts','1979',D_RT,'chronicle-line','high')
add('omission as information','Le Guin explains the extreme brevity of the runic record by saying the material was obdurate and life is short.',DSN,U_DANCE,'The material was obdurate, and life is short.','"It Was a Dark and Stormy Night", p.29','own-words','asserts','1979',D_RT,'chronicle-line','high')

WM='Ursula K. Le Guin, "World-Making" (1981), in Dancing at the Edge of the World (1989)'
add('place and institution description','Le Guin says what artists do is make a particularly skillful selection of fragments of cosmos, chosen and arranged to give an illusion of coherence and duration.',WM,U_DANCE,'a particularly skillful selection of fragments of cosmos','"World-Making", p.46','own-words','asserts','1981',D_RT,'dossier-archivist','high')
add('place and institution description','Le Guin says that all a work of art is, is an explorer\u2019s sketch-map.',WM,U_DANCE,'all it is is an explorer\u2019s sketch-map','"World-Making", p.47','own-words','asserts','1981',D_RT,'dossier-archivist','high')
add('civic record register','Le Guin reproduces a sentence from her father\u2019s Handbook of the Indians of California declaring a people extinct so far as all practical purposes are concerned.',WM+' (quoting A. L. Kroeber, Handbook of the Indians of California, 1918)',U_DANCE,'so far as all practical purposes are concerned','"World-Making", p.47-48, block quotation from her father','own-words','applies','1981',D_RT,'dossier-archivist','medium')

PN='Ursula K. Le Guin, "Places Names" (1981), in Dancing at the Edge of the World (1989)'
add('place and institution description','Le Guin\u2019s own travel piece renders a stretch of country as bare noun phrases with a repeated frame, writing that sagebrush is at its intervals and power poles at their intervals.',PN,U_DANCE,'Sagebrush at its intervals. Power poles at their intervals.','"Places Names", section I, To the Little Bighorn, p.52','own-words','applies','1981',D_RT,'dossier-archivist','high')

RC='Ursula K. Le Guin, "Reciprocity of Prose and Poetry" (1983), in Dancing at the Edge of the World (1989)'
add('other: style as substance','Le Guin says she believes that a novel, just as much as a poem, is its words.',RC,U_DANCE,'a novel, just as much as a poem, is its words','"Reciprocity of Prose and Poetry", p.112','own-words','asserts','1983',D_RT,'none','high')
add('cadence and rhythm','Le Guin says the job of composition is getting the right words in the right order and getting the measure right.',RC,U_DANCE,'the right order, getting the measure right, is the same','"Reciprocity of Prose and Poetry", p.112-113','own-words','asserts','1983',D_RT,'none','high')
add('cadence and rhythm','Le Guin says prose could have its own proper, looser rhythms and measures, distinct from metre.',RC,U_DANCE,'prose could have its own proper, looser rhythms and measures','"Reciprocity of Prose and Poetry", p.111','own-words','asserts','1983',D_RT,'none','high')
add('cadence and rhythm','Le Guin says a novel gains its power less from the sound of any single sentence than from the pacing and rhythm of paragraphs and chapters.',RC,U_DANCE,'the pacing and rhythm of paragraphs and chapters','"Reciprocity of Prose and Poetry", p.109','own-words','asserts','1983',D_RT,'chronicle-line','high')
add('dialogue register','Le Guin points to the broken monosyllables of Silas Marner\u2019s speech in George Eliot as an inseparable part of the passage\u2019s meaning.',RC,U_DANCE,'all broken monosyllables','"Reciprocity of Prose and Poetry", p.109','own-words','asserts','1983',D_RT,'none','high')

EXTRA_SOURCES2 = [
 dict(title='Dancing at the Edge of the World: Thoughts on Words, Women, Places (Grove Press) \u2014 full text scan',url=U_DANCE,kind='own-words',substantive=True,date='1989 (essays 1976-1988)',route='live URL + browser UA; ebin.pub full-text scan'),
]


# ==== ROUND 2 BATCH D ====
U_MIL='https://themillions.com/2013/01/getting-away-with-murder-the-millions-interviews-ursula-k-le-guin.html'
U_UOU='https://www.ursulakleguin.com/ursula-on-ursula'
U_B51='https://www.ursulakleguin.com/blog/51-the-narrative-gift-as-a-moral-conundrum'
U_B36='https://www.ursulakleguin.com/blog/36-readers-questions'
U_LH16='https://lithub.com/ursula-k-le-guin-on-racism-anarchy-and-hearing-her-characters-speak/'
reg(U_MIL,'x-millions2013.txt'); reg(U_UOU,'ukl-ursula-on-ursula.txt'); reg(U_B51,'ukl-blog_51-the-narrative-gift-as-a-moral-conundrum.txt')
reg(U_B36,'ukl-blog_36-readers-questions.txt'); reg(U_LH16,'x-lithub2016.txt')
for u in [U_MIL,U_UOU,U_B51,U_B36,U_LH16]: TEXT[u]=open(FILES[u],encoding='utf-8',errors='replace').read()
RT='live URL, curl with browser UA, tags stripped locally'

MIL='Ursula K. Le Guin interviewed by Paul Morton, "Getting Away with Murder: The Millions Interviews Ursula K. Le Guin", The Millions, 31 January 2013'
add('plainness and economy','Le Guin says what she has learned as a writer, as she has gone on, is that you do as little as possible.',MIL,U_MIL,'you do as little as possible','answer near the end of the interview','own-words','asserts','2013',RT,'dossier-archivist','high')
add('withheld information and inference','Le Guin says part of doing as little as possible is leaving a lot of it up to the reader.',MIL,U_MIL,'leaving a lot of it up to the reader','answer near the end of the interview','own-words','asserts','2013',RT,'dossier-archivist','high')
add('plainness and economy','Le Guin says her writing has tended to become shorter and more allusive than it used to be.',MIL,U_MIL,'shorter and more allusive than it used to be','answer near the end of the interview','own-words','asserts','2013',RT,'dossier-archivist','high')
add('gloss and over-explaining','Le Guin says of her own earlier novel The Lathe of Heaven that the characters talk too much and explain things too much.',MIL,U_MIL,'They talk too much. They explain things too much.','answer near the end of the interview','own-words','rejects','2013',RT,'dossier-archivist','high')
add('cadence and rhythm','Le Guin says she loves the sound of language and plays with word sounds in her head.',MIL,U_MIL,'I love language, I love the sound of language.','answer on invented languages','own-words','asserts','2013',RT,'none','high')

UOU='Ursula K. Le Guin, "Ursula on Ursula" (pronunciation guide and reader notes), ursulakleguin.com'
add('naming and forms of address','Le Guin gives pronunciation guidelines for her invented names because how a name is said affects the sound and rhythm of a sentence.',UOU,U_UOU,'this does affect the sound and rhythm of a sentence','pronunciation section','own-words','asserts','undated site page','live URL, curl with browser UA','dossier-archivist','high')

B51='Ursula K. Le Guin, blog 51, "The Narrative Gift as a Moral Conundrum", 2011 (text at ursulakleguin.com)'
add('other: counter-evidence on style','Le Guin says an irresistibly readable story can be told in the most conventional, banal prose if the writer has the narrative gift.',B51,U_B51,'An irresistibly readable story can be told in the most conventional, banal prose','blog post body','own-words','disputes','2011',RT,'none','high')
add('plainness and economy','Le Guin praises a book she admires by calling its prose of unobtrusive excellence.',B51,U_B51,'The prose is of unobtrusive excellence.','blog post body','own-words','asserts','2011',RT,'dossier-archivist','high')

B36='Ursula K. Le Guin, blog 36, "Readers\u2019 Questions", 2011 (text at ursulakleguin.com)'
add('other: style as substance','Le Guin says art is not explanation but what an artist does.',B36,U_B36,'Art isn\u2019t explanation.','blog post body','own-words','asserts','2011',RT,'none','high')

LH16='Ursula K. Le Guin interviewed by Euan Monaghan, Literary Hub, 1 April 2016'
add('other: composition process','Le Guin says that in writing Lavinia she was not choosing the way as an author but taking dictation.',LH16,U_LH16,'I wasn\u2019t choosing the way as an author, I was taking dictation','answer on the origin of Lavinia','own-words','asserts','2016',RT,'none','high')

EXTRA_SOURCES3 = [
 dict(title='Getting Away with Murder: The Millions Interviews Ursula K. Le Guin (Paul Morton)',url=U_MIL,kind='own-words',substantive=True,date='31 January 2013',route='live URL + browser UA'),
 dict(title='Ursula on Ursula \u2014 pronunciation guide and reader notes',url=U_UOU,kind='own-words',substantive=True,date='undated site page',route='live URL + browser UA'),
 dict(title='Blog 51: The Narrative Gift as a Moral Conundrum',url=U_B51,kind='own-words',substantive=True,date='2011',route='live URL + browser UA'),
 dict(title='Blog 36: Readers\u2019 Questions',url=U_B36,kind='own-words',substantive=True,date='2011',route='live URL + browser UA'),
 dict(title='Ursula K. Le Guin on Racism, Anarchy, and Hearing Her Characters Speak (Euan Monaghan), Literary Hub',url=U_LH16,kind='own-words',substantive=True,date='1 April 2016',route='live URL + browser UA'),
 dict(title='Ursula K. Le Guin talks to Michael Cunningham (Electric Literature)',url='https://electricliterature.com/ursula-k-le-guin-talks-to-michael-cunningham-about-genres-gender-and-broadening-fiction/',kind='own-words',substantive=False,date='1 April 2016',route='live URL + browser UA \u2014 read in full; on genre politics, not prose style'),
 dict(title='Blog 95: Are They Going to Say This is Fantasy? / Blog 27: Exercises / interview-karabatak / author-hour transcript',url='https://www.ursulakleguin.com/blog/95-are-they-going-to-say-this-is-fantasy',kind='own-words',substantive=False,date='2011-2015',route='live URL + browser UA \u2014 read; nothing on prose register'),
 dict(title='Afterword to A Wizard of Earthsea (2012) quoted on Tumblr \u2014 quotation is an image, text unreachable',url='https://elodieunderglass.tumblr.com/post/652816227234971648/perkwunos-ursula-k-le-guin-afterword-to-a',kind='relay',substantive=False,date='2012 afterword',route='live URL + browser UA \u2014 BLOCKED (image, no text)'),
 dict(title='SF Site: Driven By A Different Chauffeur (Nick Gevers interview, 2001)',url='http://www.sfsite.com/03a/ul123.htm',kind='own-words',substantive=False,date='November/December 2001',route='NOT FOUND \u2014 domain suspended; Wayback CDX temporarily offline, latest snapshot is the suspension page'),
]


# ==== ROUND 2 BATCH E: the Naimon poetry conversation (LitHub excerpt of Conversations on Writing) ====
U_LHD='https://lithub.com/ursula-k-le-guin-dictators-are-always-afraid-of-poets/'
U_MAS='https://theanarchistlibrary.org/library/rob-maslen-towards-an-archaeology-of-the-future-theodora-kroeber-and-ursula-k-le-guin'
reg(U_LHD,'y-lh-dictators.txt'); reg(U_MAS,'y-maslen.txt')
for u in [U_LHD,U_MAS]: TEXT[u]=open(FILES[u],encoding='utf-8',errors='replace').read()
NRT='live URL, curl with browser UA; the page carries letter-spacing artefacts, so quotations are taken from clean contiguous stretches'

NSRC='Ursula K. Le Guin in conversation with David Naimon, excerpted from Ursula K. Le Guin: Conversations on Writing (Tin House, 2018), published at Literary Hub'
add('cadence and rhythm','Le Guin says the sound and rhythm of prose is so different from poetry, being in a way much coarser.',NSRC,U_LHD,'the sound in the rhythm of prose, it is so different from poetry','the poetry conversation, answer on Woolf and sound','own-words','asserts','2018',NRT,'chronicle-line','high')
add('cadence and rhythm','Le Guin says the rhythms of a prose work are a very long beat.',NSRC,U_LHD,'long beat, the rhythms of a prose work','the poetry conversation, answer on Woolf and sound','own-words','asserts','2018',NRT,'chronicle-line','high')
add('cadence and rhythm','Le Guin says that, besides the long beat of the whole work, the sentence has its rhythms too.',NSRC,U_LHD,'Of course, the sentence has its rhythms too.','the poetry conversation, answer on Woolf and sound','own-words','asserts','2018',NRT,'dossier-archivist','high')
add('cadence and rhythm','Le Guin says the deeper meaning that poetry shares with music is carried by the rhythm and the beat, the music of the sound.',NSRC,U_LHD,'it is the rhythm and the beat, the music of the sound that carries it','the poetry conversation, answer on Macaulay and Swinburne','own-words','asserts','2018',NRT,'herald-pools','high')
add('cadence and rhythm','Le Guin says she does not think syllabically but rhythmically.',NSRC,U_LHD,'I don\u2019t think syllabically, I think rhythmically.','the poetry conversation, answer on haiku','own-words','asserts','2018',NRT,'none','high')

MAS_SRC='Rob Maslen, "Towards an Archaeology of the Future: Theodora Kroeber and Ursula K Le Guin", Foundation: The Review of Science Fiction No. 67 (Summer 1996), text at The Anarchist Library'
add('register modulation','Maslen argues that recording a diversity of understandings and ways of speaking inside a text written in a single language is the principal problem confronting Le Guin as a writer.',MAS_SRC,U_MAS,'recording a diversity of different understandings and ways of speaking','essay body, section on Semley\u2019s necklace','analysis','asserts','1996 (text posted at theanarchistlibrary.org)','live URL, curl with browser UA','dossier-archivist','high')

EXTRA_SOURCES4 = [
 dict(title='Ursula K. Le Guin: Dictators are Always Afraid of Poets \u2014 excerpt from Conversations on Writing (Naimon)',url=U_LHD,kind='own-words',substantive=True,date='2018',route='live URL + browser UA'),
 dict(title='Ursula K. Le Guin, Editing to the End (David Naimon\u2019s memoir of the collaboration), Literary Hub',url='https://lithub.com/ursula-k-le-guin-editing-to-the-end/',kind='reception',substantive=False,date='2018',route='live URL + browser UA'),
 dict(title='Rob Maslen, Towards an Archaeology of the Future: Theodora Kroeber and Ursula K Le Guin',url=U_MAS,kind='analysis',substantive=True,date='Summer 1996',route='live URL + browser UA'),
]


# ==== ROUND 2 BATCH F: the annalist source ====
U_GALT='https://www.publicbooks.org/b-sides-john-galts-annals-parish/'
U_W11='https://www.theguardian.com/books/2011/may/14/science-fiction-authors-choice'
U_FRK='http://locusmag.com/2005/Issues/01LeGuin.html'
U_SLATE='https://slate.com/culture/2004/12/ursula-k-le-guin-on-the-tv-earthsea.html'
reg(U_GALT,'w-galt.txt'); reg(U_W11,'w-woolf2011.txt'); reg(U_FRK,'w-frankenstein.txt'); reg(U_SLATE,'w-whitewashed.txt')
for u in [U_GALT,U_W11,U_FRK,U_SLATE]: TEXT[u]=open(FILES[u],encoding='utf-8',errors='replace').read()
RT2='live URL, curl with browser UA, tags stripped locally'

GSRC='Ursula K. Le Guin, "B-Sides: John Galt\u2019s Annals of the Parish", Public Books, 23 January 2017'
add('civic record register','Le Guin describes Annals of the Parish as the annual records of a parish minister, kept and dated year by year for 50 years, from 1760 to 1810.',GSRC,U_GALT,'kept and dated year by year for 50 years','essay body, paragraph on the book\u2019s form','own-words','asserts','2017',RT2,'chronicle-line','high')
add('point of view and distance','Le Guin calls the annalist narrator of that book a very old-fashioned narrator, and therefore reliable.',GSRC,U_GALT,'a very old-fashioned narrator, and therefore reliable','essay body, paragraph on Mr. Balwhidder','own-words','asserts','2017',RT2,'dossier-archivist','high')
add('other: showing versus telling','Le Guin praises Galt for telling without showing, in defiance of what she calls the decree of the Iowa Writing School.',GSRC,U_GALT,'Galt tells without showing','essay body, pull quote and following paragraph','own-words','asserts','2017',RT2,'dossier-archivist','high')
add('omission as information','Le Guin says that in these annals violence is witnessed without participation.',GSRC,U_GALT,'Violence is witnessed without participation','essay body, paragraph on the riot at the kirk','own-words','asserts','2017',RT2,'chronicle-line','high')
add('withheld information and inference','Le Guin says the annalist leaves it up to the reader to hear what is being told, to imagine it and to feel it.',GSRC,U_GALT,'It\u2019s left up to us to hear what\u2019s being told','essay body, paragraph on the riot at the kirk','own-words','asserts','2017',RT2,'dossier-archivist','high')
add('plainness and economy','Le Guin says all the material the reader needs to hear, imagine and feel the scene is in those few words, in their choice and in their cadence.',GSRC,U_GALT,'in those few words, in their choice and in their cadence','essay body, paragraph on the riot at the kirk','own-words','asserts','2017',RT2,'dossier-archivist','high')
add('plainness and economy','Le Guin says Galt\u2019s prose works like poetry because every word tells.',GSRC,U_GALT,'Galt\u2019s prose works like poetry: every word tells','essay body, paragraph on the riot at the kirk','own-words','asserts','2017',RT2,'dossier-archivist','high')
add('consequence on a household','Le Guin quotes the minister\u2019s entire account of the riot at his installation, which reads that he thought he would have a hard and sore time of it with such an outstrapolous people.',GSRC+' (quoting John Galt, Annals of the Parish, 1821)',U_GALT,'a hard and sore time of it with such an outstrapolous people','essay body, block quotation from Galt','own-words','applies','2017',RT2,'chronicle-line','high')
add('parataxis vs hypotaxis','Le Guin notes that the annalist moves from the riot to the dinner without even a period, only a semicolon.',GSRC,U_GALT,'without even a period, only a semicolon','essay body, paragraph following the block quotation','own-words','asserts','2017',RT2,'chronicle-line','high')
add('place and institution description','Le Guin says intimate knowledge of one small community may yield psychological and anthropological insights of universal value.',GSRC,U_GALT,'may yield psychological and anthropological insights of universal value','essay body, paragraph on small-town novels','own-words','asserts','2017',RT2,'dossier-archivist','high')
add('humour','Le Guin describes Galt\u2019s humour as dry, subtle, morally loaded, and really funny.',GSRC,U_GALT,'dry, subtle, morally loaded, and really funny','essay body, paragraph comparing Galt to Austen','own-words','asserts','2017',RT2,'chronicle-line','high')
add('place and institution description','Le Guin says small-town novels are intensely grounded and rich in satire, humour and character.',GSRC,U_GALT,'small-town novels are intensely grounded','essay body, paragraph on small-town novels','own-words','asserts','2017',RT2,'dossier-archivist','high')
add('point of view and distance','Le Guin says of the annalist narrator that he will not and cannot mislead the reader, and that he is transparent.',GSRC,U_GALT,'He will not, he cannot, mislead you. He is transparent.','essay body, paragraph on Mr. Balwhidder','own-words','asserts','2017',RT2,'dossier-archivist','high')

W11='Ursula K. Le Guin, contribution on Virginia Woolf to "The stars of modern SF pick the best science fiction", The Guardian, 14 May 2011'
add('other: genre as dialect','Le Guin says genre is a rich dialect that becomes a jargon meaningful only to an ingroup if it gives up connection with the general literary language.',W11,U_W11,'it becomes a jargon, meaningful only to an ingroup','her contribution, first paragraph','own-words','asserts','2011',RT2,'none','high')
add('place and institution description','Le Guin says Woolf\u2019s Orlando gave her the authentic thrill of being taken absolutely elsewhere.',W11,U_W11,'the authentic thrill of being taken absolutely elsewhere','her contribution, second paragraph','own-words','asserts','2011',RT2,'dossier-archivist','high')
add('plainness and economy','Kim Stanley Robinson says Le Guin\u2019s language is clear and clean.','Kim Stanley Robinson, contribution on The Left Hand of Darkness to "The stars of modern SF pick the best science fiction", The Guardian, 14 May 2011',U_W11,"Le Guin's language is clear and clean",'Kim Stanley Robinson\u2019s contribution','reception','asserts','2011',RT2,'dossier-archivist','high')

FRK='Ursula K. Le Guin, "Frankenstein\u2019s Earthsea", Locus, January 2005'
add('terminology consistency','Le Guin says the way magic works in the Earthsea books is a matter of language and names and has rules.',FRK,U_FRK,'a matter of language and names; it has rules','essay body, on the film\u2019s changes','own-words','asserts','2005',RT2,'dossier-archivist','high')
add('other: coherence','Le Guin says the rules of Earthsea magic give it a necessary limitation.',FRK,U_FRK,'which give it a necessary limitation','essay body, on the film\u2019s changes','own-words','asserts','2005',RT2,'dossier-archivist','high')

EXTRA_SOURCES5 = [
 dict(title='National Book Foundation Medal acceptance speech (transcript)',url='https://www.ursulakleguin.com/nbf-medal',kind='own-words',substantive=False,date='19 November 2014',route='live URL + browser UA \u2014 read; on publishing economics, not prose register'),
 dict(title='B-Sides: John Galt\u2019s "Annals of the Parish" \u2014 Le Guin on a novel written as parish annals',url=U_GALT,kind='own-words',substantive=True,date='23 January 2017',route='live URL + browser UA'),
 dict(title='The stars of modern SF pick the best science fiction (Le Guin on Woolf; Robinson on Le Guin), The Guardian',url=U_W11,kind='own-words',substantive=True,date='14 May 2011',route='live URL + browser UA'),
 dict(title='Frankenstein\u2019s Earthsea, Locus',url=U_FRK,kind='own-words',substantive=True,date='January 2005',route='live URL + browser UA'),
 dict(title='Whitewashed Earthsea: How the Sci Fi Channel wrecked my books, Slate',url=U_SLATE,kind='own-words',substantive=False,date='16 December 2004',route='live URL + browser UA \u2014 read; on casting, not prose register'),
 dict(title='Ursula K. Le Guin \u2014 Selected Speeches index / Essays and Criticism index',url='https://www.ursulakleguin.com/essays-and-criticism',kind='relay',substantive=False,date='site index',route='live URL + browser UA \u2014 the route by which the Galt essay was found'),
]

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

sources += EXTRA_SOURCES + EXTRA_SOURCES2 + EXTRA_SOURCES3 + EXTRA_SOURCES4 + EXTRA_SOURCES5
json.dump(dict(complete=True,coverage="ROSTER: fetched — Paris Review 221, Dreams Must Explain Themselves/Algol 21, Conversations with UKL (Freedman djvu), Is Gender Necessary? Redux, the Lao Tzu introduction and VQR 2018 were all read by the predecessor finder; this round added the Naimon Conversations on Writing poetry conversation (LitHub excerpt) and Dancing at the Edge of the World in full text, which yielded 'Some Thoughts on Narrative' and 'It Was a Dark and Stormy Night' plus 'World-Making', 'Places Names' and 'Reciprocity of Prose and Poetry'. NOT FOUND / BLOCKED: 'Earthsea Revisioned' (1993), no text online, print booklet only; 'A Description of Earthsea' and the Foreword to Tales from Earthsea — archive.org items talesfromearthse0000legu and booksofearthsea0000legu are access-restricted, their djvu.txt returns 'Item not available' and the search-inside APIs returned nothing usable; the 2012 Earthsea afterwords — the only online copy found is a Tumblr image with no text; Naimon's book beyond the two LitHub excerpts — ursulakleguincon0000legu is access-restricted; 'The Last Interview' (2019) — the book is unreachable, so its component Streitfeld interview was read at the primary (LARB 2017) and proved thin on prose style; SF Site 2001 — domain suspended and the Wayback CDX endpoint was offline. NEW FINDS the roster did not name: Le Guin's 2017 Public Books essay on John Galt's 'Annals of the Parish', a novel written as fifty years of parish annals — the single most on-target source of the whole angle — reached through her site's Essays and Criticism index; and 'From Elfland to Poughkeepsie' in full, which no previous round had read at the primary. SUBSTANTIVE SOURCES PER ROUTE: named roster 3; her own site (sitemap plus the Book View Café, Speeches and Essays indexes) 13; interview-index chasing 7; open web and PDF transcription 3; bibliography chasing inside the essay collections 1. 132 claims, every quotation grepped against the fetched text before writing.",sourcesRead=sources,claims=claims),
          open(OUT,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('claims',len(claims),'sources',len(sources),'bad',len(bad))
