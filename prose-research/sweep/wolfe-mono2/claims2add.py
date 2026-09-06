# -*- coding: utf-8 -*-
import json
d=json.load(open('claims1.json')); U=d['U']; LOC=d['LOC']; C=d['claims']
SNS='https://www.cambridge.org/core/books/shadows-of-the-new-sun/'
U['sspec']=SNS+'special-problems-of-science-fiction/FAFB20D199B4188847C6F7D75F21F872'; LOC['sspec']='sns/special.txt'
U['jcw']='https://scifiwright.com/2021/03/and-a-sword-in-the-last/'; LOC['jcw']='jcw-sword.txt'
U['wowra']='https://ultan.org.uk/place-names-in-gene-wolfes-soldier-of-the-mist/'; LOC['wowra']='u/place-names-in-gene-wolfes-soldier-of-the-mist.txt'
U['aram']='https://ultan.org.uk/aramini-on-a-solar-labyrinth/'; LOC['aram']='u/aramini-on-a-solar-labyrinth.txt'
U['shoul']='https://ultan.org.uk/standing-on-the-shoulders-of-giants-a-review-of-michael-andre-driussis-the-book-of-the-new-sun-a-chapter-guide/'; LOC['shoul']='u/standing-on-the-shoulders-of-giants-a-review-of-michael-andre-driussis-the-book-of-the-new-sun-a-chapter-guide.txt'
U['lex2']='https://ultan.org.uk/lexicon-urthus-second-edition/'; LOC['lex2']='u/lexicon-urthus-second-edition.txt'
U['augur']='https://ultan.org.uk/the-reader-as-augur/'; LOC['augur']='u/the-reader-as-augur.txt'
U['mapw']='https://ultan.org.uk/review-botns/'; LOC['mapw']='u/review-botns.txt'
U['eyrie']='https://www.eyrie.org/~eagle/reviews/books/0-595-31729-4.html'; LOC['eyrie']='x/eyrie-borski.txt'
U['sauve']='https://www.christian-sauve.com/2004/09/strokes-john-clute/'; LOC['sauve']='x/sauve-strokes.txt'
U['wag']='https://www.waggish.org/2007/gene-wolfe-the-book-of-the-new-sun/'; LOC['wag']='x/waggish.txt'

RHc="Cambridge Core chapter page (Liverpool UP title), fetched live with a browser user agent"
RHl="live page fetched with a browser user agent"
def c(k,feature,claim,source,quote,page,kind,polarity,date,reg='none',conf='high',route=RHl):
    C.append(dict(feature=feature,claim=claim,source=source,url=U[k],quote=quote,page=page,kind=kind,
                  polarity=polarity,date=date,routeHint=route,registerHint=reg,confidence=conf))

W_SNS="Peter Wright (ed.), Shadows of the New Sun: Wolfe on Writing/Writers on Wolfe (Liverpool University Press, 2007)"
# Wolfe, Special Problems of Science Fiction
c('sspec','other: craft components',"Wolfe held that science fiction rests on theme, character, style and plot.",
  "Gene Wolfe, 'Special Problems of Science Fiction', in "+W_SNS+", pp. 219-226","the four sturdy legs of theme, character, style, and plot","opening","own-words","asserts","2007",'none','high',RHc)
c('sspec','withheld information and inference',"Wolfe's own example of a theme has a death established only by a cigar that will not draw.",
  "Gene Wolfe, 'Special Problems of Science Fiction', in "+W_SNS,"proven dead only by the fact that he could not get his cigar to draw","opening","own-words","applies","2007",'dossier-archivist','high',RHc)
c('sspec','other: subject definition',"Wolfe defined science fiction practically as all stories in which the strange is dominant.",
  "Gene Wolfe, 'Special Problems of Science Fiction', in "+W_SNS,"in which 'the strange' is the dominant characteristic","opening","own-words","asserts","2007",'none','high',RHc)
c('sspec','other: theme',"Wolfe held that theme is what the story is about and has nothing to do with what happens to the character.",
  "Gene Wolfe, 'Special Problems of Science Fiction', in "+W_SNS,"the theme has nothing to do with what happens to the character","opening","own-words","asserts","2007",'none','high',RHc)
# What do they mean SF
c('ssf','naming and forms of address',"Wolfe reminded writers that the name is not the thing named.",
  "Gene Wolfe, 'What Do They Mean, SF?', in "+W_SNS+", pp. 214-218","the name is not the thing named","opening","own-words","asserts","2007",'none','high',RHc)

# John C. Wright's introduction to Aramini, Between Light and Shadow (2015)
JCW="John C. Wright, 'And a Sword in the Last', his introduction to Marc Aramini, Between Light and Shadow: An Exploration of the Fiction of Gene Wolfe 1951-1986 (Castalia House, 2015), reprinted on the author's own site 14 March 2021"
c('jcw','omission as information',"Wright records that the battle the story is ostensibly about never appears on stage.",
  JCW,"but the actual battle is not on stage","introduction","analysis","asserts","2021",'chronicle-line')
c('jcw','omission as information',"Wright records that the soldiers' act of cannibalism is likewise never shown.",
  JCW,"Neither is shown the act of cannibalism which the starving soldiers performed","introduction","analysis","asserts","2021",'chronicle-line')
c('jcw','withheld information and inference',"Wright describes the story as ending with an omen the narrator fails to understand.",
  JCW,"ending with an omen the narrator fails to understand","introduction","analysis","asserts","2021",'chronicle-line')
c('jcw','omission as information',"Wright says the traumatic core event is left for the reader's imagination to surmise.",
  JCW,"the core itself is left for the imagination of the reader","introduction","analysis","asserts","2021",'dossier-archivist')
c('jcw','withheld information and inference',"Wright reports that on first reading he did not notice the narrator of The Fifth Head of Cerberus was morally bankrupt.",
  JCW,"I did not notice how utterly morally bankrupt the viewpoint narrator","introduction","analysis","asserts","2021",'dossier-archivist')
c('jcw','place and institution description',"Wright argues the institutions of St Croix had robbed the narrator of his ability to see right and wrong.",
  JCW,"had robbed the narrator of his ability to see right","introduction","analysis","asserts","2021",'dossier-archivist')
c('jcw','omission as information',"Wright argues that what surrounds an unspeakable event is all that can be mentioned of it.",
  JCW,"the omens and rites that surround its coming","introduction","analysis","asserts","2021",'dossier-archivist')
c('jcw','dialogue register',"Wright praises Wolfe for capturing nuances of dialogue among his named strengths.",
  JCW,"in capturing nuances of dialog","introduction","analysis","asserts","2021",'herald-pools','medium')

# Wowra, place names
WOW="Scott Wowra, 'Place Names in Gene Wolfe's Soldier of the Mist', Ultan's Library, 7 September 2016"
c('wowra','place and institution description',"Wolfe's foreword says the recorder wrote place names as heard but more often translated them.",
  "Gene Wolfe, Foreword to Soldier of the Mist (Tor hardback, 1986), p. xii, quoted in "+WOW,"sometimes wrote them as he heard them but more often translated","quoted at the essay's Introduction","own-words","asserts","1986",'dossier-archivist')
c('wowra','naming and forms of address',"Wowra finds folk etymology the predominant category of Latro's place names.",
  WOW,"The predominant category is folk etymology","Toponymy section","analysis","asserts","2016",'dossier-archivist')
c('wowra','place and institution description',"Wowra applies George Stewart's taxonomy of 10 categories of place names to Wolfe's toponyms.",
  WOW,"there are 10 categories of place names","Toponymy section","analysis","applies","2016",'dossier-archivist')
c('wowra','annalist voice and deep time',"George Stewart observed that place names outlive the displacement of one language by another.",
  "George Stewart (1975), quoted in "+WOW,"Place-names possess a marked capacity to outlive the displacement of","Introduction","relay","asserts","1975",'dossier-archivist','medium')
c('wowra','withheld information and inference',"Wolfe told Darrell Schweitzer that Latro's derivation of Athens as Thought is incorrect though the meaning is right.",
  "Gene Wolfe, interview with Darrell Schweitzer, Weird Tales (Spring 1988), quoted in "+WOW,"although his derivation of it is incorrect","quoted mid-essay","own-words","asserts","1988",'chronicle-line')
c('wowra','naming and forms of address',"Wolfe's own introduction explains Latro took Laconia to mean Silent Country from hearing of Laconic manners.",
  "Gene Wolfe, Soldier of the Mist (1986), p. xii, quoted in "+WOW,"some taciturn person referred to as having Laconic manners","quoted mid-essay","own-words","asserts","1986",'dossier-archivist')
c('wowra','annalist voice and deep time',"Wolfe's Severian likens the alzabo's absorption to a material world carrying forward human works.",
  "Gene Wolfe, Sword and Citadel (1994), p. 147, quoted in "+WOW,"whether buildings, songs, battles, or explorations","quoted mid-essay","own-words","applies","1994",'dossier-archivist')
c('wowra','point of view and distance',"Wowra says Latro depends on his scroll to maintain a sense of personal continuity and identity.",
  WOW,"dependent on the scroll to maintain a sense of personal continuity","mid-essay","analysis","asserts","2016",'chronicle-line')

# Aramini on A Solar Labyrinth (an entry from Between Light and Shadow)
ARA="Marc Aramini, 'A Solar Labyrinth' entry from Between Light and Shadow (Castalia House, 2015), republished on Ultan's Library, 3 February 2016"
c('aram','withheld information and inference',"Wolfe said he tried to keep the sinister element of 'A Solar Labyrinth' well in the background.",
  "Gene Wolfe, introduction to Storeys from the Old Hotel, quoted in "+ARA,"I tried to keep the sinister element well in the background","Commentary section","own-words","asserts","1988",'dossier-archivist')
c('aram','omission as information',"Wolfe said he kept the sinister element so far back that few readers notice it at all.",
  "Gene Wolfe, introduction to Storeys from the Old Hotel, quoted in "+ARA,"it seems I kept it so far back that few readers notice","Commentary section","own-words","asserts","1988",'dossier-archivist')
c('aram','withheld information and inference',"Aramini observes that the maze's barriers are illusory but cast by real objects.",
  ARA,"Its barriers are illusory, but they are cast by real objects","Commentary section","analysis","asserts","2016",'dossier-archivist')
c('aram','metaphor discipline',"Aramini notes Wolfe calls the shadows the faded black ink of God.",
  ARA,"the shadows are called 'the faded black ink of God.'","Representation section","analysis","asserts","2016",'none','medium')
c('aram','withheld information and inference',"Aramini argues that when the shadows go at noon only the objects themselves remain.",
  ARA,"We are left with the things themselves","Representation section","analysis","asserts","2016",'dossier-archivist')

# Aramini reviewing Andre-Driussi's Chapter Guide
SHO="Marc Aramini, 'Standing on the Shoulders of Giants: a review of Michael Andre-Driussi's The Book of the New Sun: A Chapter Guide', Ultan's Library, 20 July 2020"
c('shoul','other: reference-guide register',"Aramini praises Andre-Driussi's guide for simple declarative statements and brief objective summaries.",
  SHO,"simple declarative statements and brief, objective summaries clearly delineated","body of review","analysis","asserts","2020",'dossier-archivist')
c('shoul','sentence length variation',"Aramini faults his own Between Light and Shadow for twisty sentences that lose the reader.",
  SHO,"twisty and confounding sentences that sometimes lose themselves","body of review","analysis","disputes","2020",'dossier-archivist')
c('shoul','other: chapter-guide summary register',"Andre-Driussi's whole entry for one chapter is a single present-tense sentence of plot.",
  "Michael Andre-Driussi, The Book of the New Sun: A Chapter Guide, quoted in "+SHO,"At the duel Severian is treacherously struck dead, but he rises","quoted in review","relay","applies","2020",'dossier-archivist','medium')
c('shoul','withheld information and inference',"Aramini observes that critics of Wolfe infrequently agree with one another.",
  SHO,"how infrequently any two people will agree with each other","opening of review","analysis","asserts","2020")

# Lexicon Urthus second edition
LEX="'Lexicon Urthus, second edition', Ultan's Library news item, 20 September 2008 (on Michael Andre-Driussi's Lexicon Urthus, 2nd edn, Sirius Fiction)"
c('lex2','place and institution description',"The Lexicon Urthus records and illuminates the place names of Wolfe's Urth alongside its characters.",
  LEX,"Place names are similarly recorded and illuminated","news item","analysis","asserts","2008",'dossier-archivist')
c('lex2','edition and house style',"The Lexicon Urthus grew from 297 pages in its first edition to 439 in its second.",
  LEX,"The first edition came to 297 pages, the second weighs in","news item","measurement","asserts","2008",'none','medium')
c('lex2','other: reference apparatus',"The Lexicon Urthus carries a foreword written by Gene Wolfe himself.",
  LEX,"comes with a foreword written by Gene Wolfe himself","news item","analysis","asserts","2008",'dossier-archivist')

# Gevers, The Reader as Augur
GEV="Nick Gevers, 'The Reader as Augur: Beginnings and Endings in Gene Wolfe's The Book of the Long Sun', Ultan's Library, 5 September 2000"
c('augur','repetition and refrain',"Gevers describes the New Sun conceit that any fragment of the text contains the essence of the whole.",
  GEV,"any fragment contains the essence of the whole","body of essay","analysis","asserts","2000",'dossier-archivist')
c('augur','withheld information and inference',"Gevers asserts that every paragraph of Long Sun, however incidental seeming, reflects the whole.",
  GEV,"every paragraph, however incidental seeming, reflects the whole","body of essay","analysis","asserts","2000",'dossier-archivist')
c('augur','register modulation',"Gevers characterises The Book of the Long Sun as having a more relaxed style than The Book of the New Sun.",
  GEV,"a more relaxed style and fewer gestures towards the narrative sleights","body of essay","analysis","asserts","2000")
c('augur','withheld information and inference',"Gevers describes Long Sun as a long amassing of evidence for the reader.",
  GEV,"Long Sun will be a long amassing of evidence","body of essay","analysis","asserts","2000",'chronicle-line')
c('augur','omission as information',"Gevers asserts that silent implication in Wolfe can convey as much as violent confrontation.",
  GEV,"silent implication can convey as much as any violent confrontation","body of essay","analysis","asserts","2000",'dossier-archivist')
c('augur','naming and forms of address',"Gevers records the naming convention of Viron, where men take animal and women vegetable names.",
  GEV,"men have animal, and women vegetable, names","body of essay","analysis","asserts","2000",'dossier-archivist')
c('augur','withheld information and inference',"Gevers notes that Silk is quick to misunderstand the evidence of his own eyes.",
  GEV,"quick to misunderstand the evidence of his eyes","body of essay","analysis","asserts","2000",'chronicle-line')
c('augur','other: reading instruction',"Gevers argues that augury in Long Sun is a metaphor for and instruction in incisive reading.",
  GEV,"augury is a metaphor for, and instruction in, the demands","body of essay","analysis","asserts","2000",'dossier-archivist')

# Peter Wright, Mapping a Masterwork
MAP="Peter Wright, 'Mapping a Masterwork: A Critical Review of Gene Wolfe's The Book of the New Sun', Ultan's Library, 28 August 2002"
c('mapw','plainness and economy',"Wright reports the tetralogy was acclaimed for its controlled and meticulous style.",
  MAP,"its controlled and meticulous style","opening of review","analysis","asserts","2002")
c('mapw','withheld information and inference',"Algis Budrys wrote that he knew the cards were up the sleeves somewhere in Wolfe's narrative.",
  "Algis Budrys, quoted in "+MAP,"I know the cards are up the sleeves somewhere","quoted in review","relay","asserts","2002",'none','medium')
c('mapw','withheld information and inference',"Colin Greenland concluded that second and third readings of Wolfe are indicated.",
  "Colin Greenland, 'Wolfe in Sheep's Clothing', quoted in "+MAP,"Second and third readings are indicated","quoted in review","relay","asserts","2002",'none','medium')
c('mapw','plainness and economy',"Michael Bishop called The Shadow of the Torturer immediately accessible to any moderately intelligent reader.",
  "Michael Bishop, quoted in "+MAP,"an immediately accessible book for anyone with moderate intelligence","quoted in review","relay","disputes","2002",'none','medium')

# Allbery on Borski
ALL="Russ Allbery, review of Robert Borski, Solar Labyrinth: Exploring Gene Wolfe's Book of the New Sun (iUniverse, 2004, 188 pages), eyrie.org"
c('eyrie','other: monograph form',"Allbery reports Borski sets out each theory in a brief essay, some only a few pages long.",
  ALL,"each basic theory is set forward in a brief essay","review body","reception","asserts","2004",'dm-page')
c('eyrie','other: reference apparatus',"Allbery faults Solar Labyrinth for lacking a plot synopsis or timeline as a memory refresher.",
  ALL,"without a basic plot synopsis or timeline as a memory","review body","reception","disputes","2004",'dossier-archivist')
c('eyrie','other: reference apparatus',"Allbery reports Borski mentions minor characters in passing and expects the reader to remember them.",
  ALL,"expects the reader to remember who he's talking about","review body","reception","disputes","2004",'dossier-archivist')
c('eyrie','withheld information and inference',"Allbery testifies that on reading Borski he felt stupid for having missed obvious clues in Wolfe.",
  ALL,"I felt a bit stupid to have missed obvious clues","review body","reader","asserts","2004",'dossier-archivist')

# Sauve on Clute's Strokes
SAU="Christian Sauve, review of John Clute, Strokes: Essays and Reviews 1966-1986 (Serconia Press, 1988, 178 pages), 12 September 2004"
c('sauve','withheld information and inference',"John Clute wrote in Strokes that making sense of Gene Wolfe is initially a job of decipherment.",
  "John Clute, Strokes (1988), p. 163, quoted in "+SAU,"Making sense of Gene Wolfe, it seems to me, is initially","Strokes p. 163","relay","asserts","1988",'none','medium')
c('sauve','other: collection structure',"Sauve reports that Strokes ends with a substantial series of pieces about Gene Wolfe.",
  SAU,"the book ends with a substantial series of pieces about Gene Wolfe","review body","reception","asserts","2004")

# Auerbach, Waggish
WAG="David Auerbach, 'Gene Wolfe: The Book of the New Sun', Waggish, 2007"
c('wag','archaism',"Auerbach describes Wolfe's vocabulary as words that appear to be neologisms but are archaic.",
  WAG,"words that appear to be neologisms but are anything but","essay body","analysis","asserts","2007",'dossier-archivist')
c('wag','archaism',"Auerbach concedes the archaic style's purpose is to evoke strangeness while preserving depth of meaning.",
  WAG,"to evoke strangeness while preserving a depth of meaning","essay body","analysis","asserts","2007",'dossier-archivist')
c('wag','other: prose beauty',"Auerbach argues the archaic style does not make Wolfe's writing beautiful.",
  WAG,"What it doesn't do is make the writing beautiful","essay body","analysis","disputes","2007")
c('wag','omission as information',"Auerbach reports that central plot points are skipped over and only referred to in retrospect.",
  WAG,"Central plot points are skipped over and only referred to in retrospect","essay body","analysis","asserts","2007",'chronicle-line')
c('wag','civic record register',"Auerbach notes Severian's text is framed as destined for public consumption within his own world.",
  WAG,"destined for public consumption by people in his world","essay body","analysis","asserts","2007",'chronicle-line')
c('wag','withheld information and inference',"Auerbach disputes that the reader can derive meaning from the parts because the whole context is missing.",
  WAG,"we do not have the whole context","essay body","analysis","disputes","2007",'chronicle-line')
c('wag','withheld information and inference',"Auerbach argues the unresolved unreliability reduces the book to decontextualized apocrypha.",
  WAG,"he reduces the book to decontextualized apocrypha","essay body","analysis","disputes","2007",'chronicle-line')
c('wag','withheld information and inference',"A reader replying to Auerbach argues truth can be recovered from what Severian's public could contradict.",
  "Commenter 'MattD', comment of 28 November 2007 on "+WAG,"that Severian is writing for would know and be able","comments","reader","disputes","2007",'chronicle-line','medium')

json.dump({'U':U,'LOC':LOC,'claims':C},open('claims2.json','w'),ensure_ascii=False)
print(len(C))
