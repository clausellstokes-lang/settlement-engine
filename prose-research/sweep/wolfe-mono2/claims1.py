# -*- coding: utf-8 -*-
AD='https://www.cambridge.org/core/books/attending-daedalus/'
SNS='https://www.cambridge.org/core/books/shadows-of-the-new-sun/'
U={
 'pref':AD+'preface/E534225E10471DD899126B4501FD52B3',
 'cues':AD+'cues-the-function-of-unfamiliar-diction/3EBA78727C037096F69FE025BCB2F3AD',
 'sol':AD+'solar-labyrinth-metafictional-devices-and-textual-complexity/49656CDCE0E04E7F80E4E4FE4FFC069C',
 'whip':AD+'how-the-whip-came-back-directing-reader-response/2A2AC1DCBED89BCD79CD247018F62257',
 'ging':AD+'in-the-house-of-gingerbread-interpretative-games-and-the-psychology-of-reader-response/8A7999ECDD3CAC9AECF22E6C964FA277',
 'toy':AD+'toy-theatre-uncovering-the-story-of-the-urth-cycle/8A95293F693266D39C225BE509844A1E',
 'map':AD+'map-the-multivolume-novels-and-metafictional-cartography/EDEF37F8E56A9DF1C559ABDD4BC47EDE',
 'god':AD+'god-and-his-man-critical-responses-to-the-urth-cycle/888E54B4D73F5B5D8F93C390C49F8907',
 'last':AD+'last-thrilling-wonder-story-intergeneric-operations/3CC9BC9E09B6B06DA7BE6219A48DC01E',
 'doors':AD+'there-are-doors-memory-and-textual-structure/B89AE6555E9DC5DCAA0121AF21F943AA',
 'trip':AD+'trip-trap-psychology-and-thematic-coherence/27964C258DD3B2CD02436C50D4281A52',
 'sil':AD+'silhouette-an-introduction-to-gene-wolfe/37824B6A185F41E81960E1767DC05A74',
 'sintro':'https://www.cambridge.org/core/books/abs/shadows-of-the-new-sun/introduction/C861D0D3B8C29D7A4CD8C40CAA72A62E',
 'sbooks':SNS+'books-in-the-book-of-the-new-sun/71A41863E43DFE9FA893C93786F3C386',
 'snor':SNS+'nor-the-summers-as-golden-writing-multivolume-works/1BF1BCBAAE4043F14CCEB7395D5D5462',
 'srules':SNS+'wolfes-rules-what-you-must-do-to-be-a-writer/ECF686D05E84F792839933A2B8AAC3D8',
 'strue':SNS+'wolfes-irreproducible-truths-about-novels/F48E0E8BE64E63202B4447A593A3A97B',
 'sbald':SNS+'balding-avuncular-genes-quick-and-dirty-guide-to-creating-memorable-characters/18069AE78DC641BA399808B91630AD05',
 'ssf':SNS+'what-do-they-mean-sf/6A99D5B3356F6986A06685A3A351637D',
 'smcc':SNS+'on-encompassing-the-entire-universe-an-interview-with-gene-wolfe/6FC2C27FE38F3F536A7544E24CB733F1',
 'sfraz':SNS+'interview-gene-wolfe-the-legerdemain-of-the-wolfe/A83A9DB72207ED572A26AF366E561645',
 'manl':'http://web.archive.org/web/20180618115401id_/https://link.springer.com/chapter/10.1007%2F978-1-349-07259-0_11',
}
LOC={'pref':'wright-preface.txt','sintro':'shadows-intro.txt','manl':'manlove-wb.txt'}
for k in ['cues','sol','whip','ging','toy','map','god','last','doors','trip','sil']:
    LOC[k]='ad/'+U[k].split('/attending-daedalus/')[1].split('/')[0]+'.txt'
for k in ['sbooks','snor','srules','strue','sbald','ssf','smcc','sfraz']:
    LOC[k]='sns/'+U[k].split('/shadows-of-the-new-sun/')[1].split('/')[0]+'.txt'

W_AD="Peter Wright, Attending Daedalus: Gene Wolfe, Artifice and the Reader (Liverpool University Press, 2003)"
W_SNS="Peter Wright (ed.), Shadows of the New Sun: Wolfe on Writing/Writers on Wolfe (Liverpool University Press, 2007)"
RH="Cambridge Core chapter page (Liverpool UP title), fetched live with a browser user agent"

C=[]
def c(k,feature,claim,source,quote,page,kind,polarity,date,reg='none',conf='high',route=RH):
    C.append(dict(feature=feature,claim=claim,source=source,url=U[k],quote=quote,page=page,kind=kind,
                  polarity=polarity,date=date,routeHint=route,registerHint=reg,confidence=conf))

# ---- Wright, preface
c('pref','withheld information and inference',
  "Wright asserts that Wolfe's fiction actively encourages misreadings by the reader.",
  W_AD+", Preface, p. xi","it encourages misreadings, demands thoughtful reflection","Preface, pp. xi-xii","analysis","asserts","2003")
c('pref','plainness and economy',
  "Wright characterises Wolfe's fiction as densely allusive and conceptually elusive rather than plain.",
  W_AD+", Preface, p. xi","intricately wrought, densely allusive, and conceptually elusive","Preface, pp. xi-xii","analysis","asserts","2003")
c('pref','point of view and distance',
  "Wright reports that the majority of critics who have approached Wolfe's work would call him ambiguous, subtle and playful.",
  W_AD+", Preface, p. xi","complex and wily writer, ambiguous, subtle and playful","Preface, pp. xi-xii","analysis","asserts","2003")
c('pref','other: critical neglect',
  "Wright names Attending Daedalus as only the second book-length study of Wolfe's fiction.",
  W_AD+", Preface, p. xi","only the second book-length study of his fiction","Preface, pp. xi-xii","analysis","asserts","2003")

# ---- Wright, Shadows introduction
c('sintro','register modulation',
  "Wright characterises the prose of The Wizard Knight (2004) as spare.",
  W_SNS+", Introduction, pp. 1-8","the spare prose of The Wizard Knight","Introduction, pp. 1-8","analysis","asserts","2007",'none','high')
c('sintro','register modulation',
  "Wright characterises the prose of The Book of the New Sun (1980-83) as baroque in its richness.",
  W_SNS+", Introduction, pp. 1-8","the baroque richness of The Book of the New Sun","Introduction, pp. 1-8","analysis","asserts","2007")
c('sintro','per-speaker register',
  "Wright asserts Wolfe's narrative versatility extends to narrating as a phantom haunting his own memories in Peace (1975).",
  W_SNS+", Introduction, pp. 1-8","a phantom haunting his own memories in Peace","Introduction, pp. 1-8","analysis","asserts","2007",'chronicle-line')
c('sintro','other: stylistic distinctness',
  "Wright calls Wolfe's fiction among the most stylistically distinct imaginative fiction of recent years.",
  W_SNS+", Introduction, pp. 1-8","most stylistically distinct, structurally complex and intellectually invigorating","Introduction, pp. 1-8","analysis","asserts","2007")

# ---- Cues: the function of unfamiliar diction
c('cues','archaism',
  "Wright asserts that Wolfe's archaisms work as agents of estrangement that render Urth alien to the reader.",
  W_AD+", 'Cues: the function of unfamiliar diction', pp. 126-144","agents of estrangement to render the fictional Urth alien","pp. 126-144","analysis","asserts","2003",'dossier-archivist')
c('cues','compounds and coinages',
  "Wright reports that Wolfe disavows any fondness for coined 'gibberish', meaning neologisms.",
  W_AD+", 'Cues', p. 126, reporting The Castle of the Otter","Wolfe admits that he has no fondness for","pp. 126-144","analysis","asserts","2003")
c('cues','archaism',
  "Wolfe's own stated reason for archaic vocabulary is to convey the flavour of an odd place at an odd time.",
  "Gene Wolfe, The Castle of the Otter (1982), quoted in "+W_AD+", 'Cues'","odd words to convey the flavour of an odd place","pp. 126-144","own-words","asserts","1982",'dossier-archivist','high')
c('cues','withheld information and inference',
  "Wolfe told Larry McCaffery that a great deal of knowledge can be intuited from the words people use.",
  "Gene Wolfe, interview with Larry McCaffery for Science-Fiction Studies, quoted in "+W_AD+", 'Cues'","a great deal of knowledge can be intuited","pp. 126-144","own-words","asserts","1988",'dossier-archivist')
c('cues','archaism',
  "Wright asserts Wolfe's archaic reappropriations convey social, linguistic and creative exhaustion.",
  W_AD+", 'Cues', pp. 126-144","the notion of recycling, of social, linguistic and creative exhaustion","pp. 126-144","analysis","asserts","2003",'dossier-archivist')
c('cues','archaism',
  "Wright asserts Wolfe's Classico-medieval references operate both deflectively and candidly at once.",
  W_AD+", 'Cues', pp. 126-144","references function both deflectively and candidly","pp. 126-144","analysis","asserts","2003")

# ---- Solar labyrinth
c('sol','withheld information and inference',
  "Wright asserts Wolfe organises the Urth Cycle so that it rewards only readers willing to pause, reflect and reread.",
  W_AD+", 'Solar Labyrinth', pp. 166-182","pause, reflect and reread","pp. 166-182","analysis","asserts","2003")
c('sol','point of view and distance',
  "Wright describes Severian as unreliable, intensely subjective and seemingly incapable of analysing his experiences.",
  W_AD+", 'Solar Labyrinth', pp. 166-182","unreliable, intensely subjective and seemingly incapable of analysing his experiences","pp. 166-182","analysis","asserts","2003")
c('sol','omission as information',
  "Wright applies Borges's figure of a narrator who omits or corrupts events to Wolfe's method.",
  "Jorge Luis Borges, quoted in "+W_AD+", 'Solar Labyrinth'","a narrator who omitted or corrupted what happened","pp. 166-182","relay","applies","2003",'none','high')

# ---- How the whip came back
c('whip','point of view and distance',
  "Wright asserts Wolfe's first-person form expedites the reader's trust in the veracity of the document.",
  W_AD+", 'How the Whip Came Back', pp. 104-125","trust in the veracity of the document","pp. 104-125","analysis","asserts","2003",'chronicle-line')
c('whip','withheld information and inference',
  "Wolfe conveys the executioner's guild training as plain practical instruction to the condemned man.",
  "Gene Wolfe, The Shadow of the Torturer, quoted in "+W_AD+", 'How the Whip Came Back'","cautioned him to empty his bladder, which relaxes at","pp. 104-125","own-words","applies","1980",'dossier-archivist')

# ---- Gingerbread
c('ging','omission as information',
  "Wright names the introduction of ambiguity and ellipsis as one of four strategies by which Wolfe controls the reader.",
  W_AD+", 'In the House of Gingerbread', pp. 37-48","the introduction of ambiguity and ellipsis","pp. 37-48","analysis","asserts","2003")
c('ging','withheld information and inference',
  "Wright asserts Wolfe discloses a narrator's unreliability by juxtaposing conflicting viewpoints.",
  W_AD+", 'In the House of Gingerbread', pp. 37-48","either by juxtaposing conflicting viewpoints","pp. 37-48","analysis","asserts","2003")

# ---- Toy theatre
c('toy','withheld information and inference',
  "Wright asserts the theatrical motif marks a disjunction between what a Wolfe plot shows and what its story is.",
  W_AD+", 'Toy Theatre', pp. 69-85","the presence of a disjunction between what is apparent","pp. 69-85","analysis","asserts","2003")
c('toy','omission as information',
  "Wright asserts the narrator of 'The Toy Theatre' sustains his illusion by not seeing his operator.",
  W_AD+", 'Toy Theatre', pp. 69-85","in order to sustain the illusion under which he lives","pp. 69-85","analysis","asserts","2003")

# ---- Map (Clute relay)
c('map','other: intratextual repetition',
  "John Clute observed in Strokes that Wolfe's stories and novels reflect one another.",
  "John Clute, Strokes (1988), p. 160, quoted in "+W_AD+", 'Map'","stories and novels reflect one another","Strokes p. 160, quoted at AD pp. 185-206","relay","asserts","1988",'none','medium')
c('map','other: thematic pattern',
  "Clute read the repetitions across Wolfe's oeuvre as responses to the chance of escaping the prison of the self.",
  "John Clute, Strokes (1988), p. 161, quoted in "+W_AD+", 'Map'","the prison of the self","Strokes p. 161, quoted at AD pp. 185-206","relay","asserts","1988",'none','medium')

# ---- God and his man
c('god','place and institution description',
  "Wright describes Urth's mines as yielding ruins, bones and relics whose purposes are forgotten.",
  W_AD+", 'God and His Man', pp. 49-66","ruins, bones, obscure relics with forgotten purposes","pp. 49-66","analysis","applies","2003",'dossier-archivist')
c('god','place and institution description',
  "Wright describes Urth's geology as buried under layer after layer of archaeological remains.",
  W_AD+", 'God and His Man', pp. 49-66","layer after layer of archaeological remains","pp. 49-66","analysis","applies","2003",'dossier-archivist')
c('god','point of view and distance',
  "Wright states The Book of the New Sun is Severian's memoir written 10 years after he becomes Autarch.",
  W_AD+", 'God and His Man', pp. 49-66","written 10 years after he becomes Autarch","pp. 49-66","analysis","asserts","2003",'chronicle-line')

# ---- Last thrilling wonder story
c('last','other: genre definition',
  "Wolfe defined science fantasy as a science fiction story told with the flavour of fantasy.",
  "Gene Wolfe, quoted in "+W_AD+", 'Last Thrilling Wonder Story', pp. 86-103","a science fiction story told with the outlook, the flavour of fantasy","pp. 86-103","own-words","asserts","2003",'none','high')
c('last','withheld information and inference',
  "Wright argues Severian's transformation is chemical assimilation rather than mystical union.",
  W_AD+", 'Last Thrilling Wonder Story', pp. 86-103","not the result of a series of mystical unions","pp. 86-103","analysis","asserts","2003",'dossier-archivist')
c('last','withheld information and inference',
  "Brian Attebery's account of rationalised fantasy has the apparent magic explained away by the story's end.",
  "Brian Attebery, quoted in "+W_AD+", 'Last Thrilling Wonder Story'","the apparent magic is explained away by the end","pp. 86-103","relay","applies","2003",'none','medium')

# ---- There are doors
c('doors','place and institution description',
  "Wright asserts Wolfe arranges the Urth Cycle's events into the architecture of a written memory system.",
  W_AD+", 'There Are Doors', pp. 145-165","the architecture of a written memory system","pp. 145-165","analysis","asserts","2003",'dossier-archivist')
c('doors','place and institution description',
  "Frances Yates's account of the classical memory art has the orator remember a spacious and varied building.",
  "Frances Yates, The Art of Memory (1966), quoted in "+W_AD+", 'There Are Doors'","a building is to be remembered, as spacious and varied","pp. 145-165","relay","applies","1966",'dossier-archivist','medium')

# ---- Trip trap
c('trip','other: layered writing',
  "Wolfe held that good writing is multileveled, comparing it to a club sandwich.",
  "Gene Wolfe, quoted in "+W_AD+", 'Trip, Trap', pp. 23-36","multileveled, like a club sandwich","pp. 23-36","own-words","asserts","2003",'none','high')
c('trip','withheld information and inference',
  "Wolfe held that a good writer is often saying two things at once.",
  "Gene Wolfe, quoted in "+W_AD+", 'Trip, Trap', pp. 23-36","a good writer is often saying two things at once","pp. 23-36","own-words","asserts","2003",'dossier-archivist')
c('trip','other: characterisation',
  "Michael Bishop observed that Wolfe's characters are neither wholly heroic nor unremittingly villainous.",
  "Michael Bishop, quoted in "+W_AD+", 'Trip, Trap'","neither wholly heroic nor unremittingly villainous","pp. 23-36","relay","asserts","2003",'none','medium')

# ---- Silhouette
c('sil','other: reputation',
  "John Clute called Wolfe quite possibly the most important writer in the science fiction field.",
  "John Clute, The Encyclopedia of Science Fiction (revised edition), quoted in "+W_AD+", 'Silhouette'","quite possibly the most important writer","pp. 3-22","relay","asserts","1993",'none','medium')
c('sil','other: critical neglect',
  "Wright asserts Wolfe's work has provoked little academic interest.",
  W_AD+", 'Silhouette', pp. 3-22","provoked little academic interest","pp. 3-22","analysis","asserts","2003")

# ---- Books in The Book of the New Sun (Wolfe's own essay)
c('sbooks','place and institution description',
  "Wolfe's catalogue of Ultan's library lists bindings by material without figurative comparison.",
  "Gene Wolfe, 'Books in The Book of the New Sun', in "+W_SNS+", pp. 193-202","We have books bound wholly in metals of unknown alloy","pp. 193-202","own-words","applies","2007",'dossier-archivist')
c('sbooks','omission as information',
  "Wolfe's library catalogue names books precious precisely because nobody on Urth can read them.",
  "Gene Wolfe, 'Books in The Book of the New Sun', in "+W_SNS+", pp. 193-202","books doubly precious because no one on Urth can read them","pp. 193-202","own-words","applies","2007",'dossier-archivist')
c('sbooks','place and institution description',
  "Wolfe describes the library as folded in upon itself and larger than the world containing it.",
  "Gene Wolfe, 'Books in The Book of the New Sun', in "+W_SNS+", pp. 193-202","the library is larger than the world that contains it","pp. 193-202","own-words","asserts","2007",'dossier-archivist')
c('sbooks','annalist voice and deep time',
  "Wolfe attaches an ancient flavour to the library through books unread since before they were written.",
  "Gene Wolfe, 'Books in The Book of the New Sun', in "+W_SNS+", pp. 193-202","of books that have not been read since before they were written","pp. 193-202","own-words","applies","2007",'dossier-archivist')

# ---- Nor the summers as golden
c('snor','other: long-form construction',
  "Wolfe held that a multivolume work is made by writing something more like life itself than shorter forms are.",
  "Gene Wolfe, 'Nor the Summers as Golden', in "+W_SNS+", pp. 208-213","more like life itself than the other forms are","pp. 208-213","own-words","asserts","2007")
c('snor','other: short-story scope',
  "Wolfe held that a short story typically separates a few hours from the characters' years.",
  "Gene Wolfe, 'Nor the Summers as Golden', in "+W_SNS+", pp. 208-213","In short stories we typically separate a few hours","pp. 208-213","own-words","asserts","2007")
c('snor','other: series decline',
  "Wolfe called a series a succession of novels that are all too often progressively weaker.",
  "Gene Wolfe, 'Nor the Summers as Golden', in "+W_SNS+", pp. 208-213","a succession of novels that are all too often progressively weaker","pp. 208-213","own-words","asserts","2007")

# ---- Wolfe's rules
c('srules','other: revision discipline',
  "Wolfe's stated revision rule is to leave a story alone when nothing is wrong with it.",
  "Gene Wolfe, 'Wolfe's Rules', in "+W_SNS+", p. 203","If nothing is wrong, leave it alone","p. 203","own-words","asserts","2007")

# ---- Irreproducible truths
c('strue','other: plot discipline',
  "Wolfe held that no plot is better than too much plot.",
  "Gene Wolfe, 'Wolfe's Irreproducible Truths About Novels', in "+W_SNS+", pp. 206-207","no plot is better than too much plot","pp. 206-207","own-words","asserts","2007")
c('strue','other: subject matter',
  "Wolfe held that great novels are concerned with love and death and lesser ones with sex and violence.",
  "Gene Wolfe, 'Wolfe's Irreproducible Truths About Novels', in "+W_SNS+", pp. 206-207","Great novels are concerned with love and death, lesser novels","pp. 206-207","own-words","asserts","2007")

# ---- Balding avuncular Gene
c('sbald','per-speaker register',
  "Wolfe held that characterisation distinguishes one character from another particularly in dialogue.",
  "Gene Wolfe, 'Balding, Avuncular Gene's Quick and Dirty Guide to Creating Memorable Characters', in "+W_SNS+", pp. 204-205","distinguishes one character from another, particularly in dialogue","pp. 204-205","own-words","asserts","2007",'herald-pools')
c('sbald','other: craft hierarchy',
  "Wolfe held that the hard things about writing are telling a good story and writing skilful prose.",
  "Gene Wolfe, 'Balding, Avuncular Gene's Quick and Dirty Guide', in "+W_SNS+", pp. 204-205","The hard things about writing are telling a good story","pp. 204-205","own-words","asserts","2007")
c('sbald','concrete sensory noun',
  "Wolfe's own demonstration passage prices a rope against a copper in the market.",
  "Gene Wolfe, 'Balding, Avuncular Gene's Quick and Dirty Guide', in "+W_SNS+", pp. 204-205","It wouldn't fetch a copper in the market, but it","pp. 204-205","own-words","applies","2007",'dossier-archivist')
c('sbald','dialogue register',
  "Wolfe's demonstration of interior register is a four-word thought about another mouth to feed.",
  "Gene Wolfe, 'Balding, Avuncular Gene's Quick and Dirty Guide', in "+W_SNS+", pp. 204-205","Another mouth to feed. Well, hell.","pp. 204-205","own-words","applies","2007",'none','medium')

# ---- McCaffery interview
c('smcc','other: writing motive',
  "Wolfe told McCaffery that the only way he knows to write is to write what he would like to read.",
  "Gene Wolfe, interview with Larry McCaffery (Science Fiction Studies, 1988), reprinted in "+W_SNS+", pp. 79-100","The only way I know to write is to write","pp. 79-100","own-words","asserts","1988")
c('smcc','other: scope',
  "Wolfe framed the choice for a writer as everyday events versus encompassing the entire universe.",
  "Gene Wolfe, interview with Larry McCaffery (1988), reprinted in "+W_SNS+", pp. 79-100","content to focus on everyday events","pp. 79-100","own-words","asserts","1988")

# ---- Frazier interview
c('sfraz','plainness and economy',
  "Robert Frazier described Wolfe in conversation as apt to answer a query with a terse and precise reply.",
  "Robert Frazier, interview introduction, Thrust: Science Fiction in Review (Winter-Spring 1983), reprinted in "+W_SNS+", pp. 44-55","apt to answer a query with a terse and precise","pp. 44-55","reception","asserts","1983",'none','medium')

# ---- Manlove
MAN="C. N. Manlove, 'Gene Wolfe, The Book of the New Sun (1980-83)', in Science Fiction: Ten Explorations (Palgrave Macmillan, 1986), pp. 198-216"
RM="SpringerLink chapter page via Wayback raw capture (20180618115401id_); the live page returns a Client Challenge"
def m(feature,claim,quote,polarity='asserts',reg='none',conf='high'):
    C.append(dict(feature=feature,claim=claim,source=MAN,url=U['manl'],quote=quote,page='chapter opening, p. 198',
                  kind='analysis',polarity=polarity,date='1986',routeHint=RM,registerHint=reg,confidence=conf))
m('other: evaluation',"Manlove calls The Book of the New Sun a highly-wrought, intelligent, perceptive work.","it is a highly-wrought, intelligent, perceptive work")
m('other: literary affinity',"Manlove finds the tetralogy reminiscent of Peake and Borges in its richness of creation.","reminiscent of Peake and Borges in its richness of creation")
m('point of view and distance',"Manlove attributes to Severian a coolness of intellect recalling Borges's methodically rational narrators.","with his coolness of intellect",'asserts','chronicle-line')
m('place and institution description',"Manlove describes the society of Urth as largely antique or medieval, with rituals, guilds, myths and religions and few machines.","with rituals, guilds, myths and religions, and few machines",'asserts','dossier-archivist')
m('place and institution description',"Manlove records that reference is made only occasionally to a previous technological age of interplanetary travel.","Reference is made occasionally to a previous, aeons-past technological age",'asserts','dossier-archivist')
m('withheld information and inference',"Manlove names Philip K. Dick as the writer nearest Wolfe in breaking boundaries between fiction and reality.","breaking of boundaries between fiction and reality",'asserts','none','medium')

import json
print(json.dumps({'U':U,'LOC':LOC,'claims':C},ensure_ascii=False))
