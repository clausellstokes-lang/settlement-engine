CL=[]
def C(**k):
    k.setdefault('confidence','high'); k.setdefault('registerHint','none'); CL.append(k)
WB='wayback raw capture https://web.archive.org/web/<ts>id_/<url>'
D89='https://www.washingtonpost.com/archive/entertainment/books/1989/04/30/gene-wolfes-tales-of-the-alien-and-the-alienated/50d2c807-c56a-4ba3-a317-4540d8786a8c/'
S89="Michael Dirda, 'GENE WOLFE'S TALES OF THE ALIEN AND THE ALIENATED', The Washington Post, 1989-04-30"
for f,q,cl,pol,rh in [
 ('withheld information and inference',"an art of indirection, a matter of tangents, silences and obliquities",
  "Dirda names indirection as the governing principle of Wolfe's prose, working by tangents, silences and obliquities.",'asserts','dossier-archivist'),
 ('omission as information',"nothing is said straightforwardly",
  "Dirda states that nothing in this prose is said straightforwardly, so the reader must read between the lines.",'asserts','dossier-archivist'),
 ('withheld information and inference',"he gives you the names of things, but not what they are",
  "Dirda describes the method as supplying the names of things while withholding what the things are.",'asserts','dossier-archivist'),
 ('withheld information and inference',"what a character does, but not what that action means",
  "Dirda describes the same method applied to action: the deed is reported, its meaning is not.",'asserts','dossier-archivist'),
 ('other: difficulty as design',"to make the reader work to figure out just what is really",
  "Dirda states that making the reader work out what is really going on is one of Wolfe's deliberate artistic aims.",'asserts','none'),
 ('plainness and economy',"rarely swept away by either the storytelling",
  "Dirda reports being rarely swept away by the storytelling in the 1989 collection, judging most of its stories contraptions.",'disputes','none'),
]:
    C(feature=f,url=D89,source=S89,claim=cl,quote=q,polarity=pol,kind='analysis',date='1989-04-30',
      page='review body',routeHint=WB+' (ts 20230205094304)',registerHint=rh)
C(feature='other: difficulty as design',url=D89,source="Gene Wolfe, remark recalled by Michael Dirda, The Washington Post, 1989-04-30",
  claim="Wolfe is quoted as having remarked that a writer is obliged to be interesting but not obliged to be easy.",
  quote="obliged to be interesting but he doesn", polarity='asserts', kind='relay', date='1989-04-30',
  page='review body, parenthesis', routeHint=WB+' (ts 20230205094304)', confidence='medium')

D23='https://www.washingtonpost.com/books/2023/11/22/gene-wolfe-terry-pratchett-review/'
C(feature='register modulation',url=D23,source="Michael Dirda, 'Three new ways to cherish Kij Johnson, Gene Wolfe and Terry Pratchett', The Washington Post, 2023-11-22",
  claim="Dirda characterises the stories in the posthumous collection as subtle, allusive, tricksy, beautifully written and sometimes strangely inconclusive.",
  quote="subtle, allusive, tricksy, beautifully written and sometimes strangely inconclusive", polarity='asserts',
  kind='analysis', date='2023-11-22', page='review, Wolfe section', routeHint=WB+' (ts 20250607234048)', registerHint='dossier-archivist')
C(feature='withheld information and inference',url=D23,source="Michael Dirda, The Washington Post, 2023-11-22",
  claim="Dirda reports that when an ending in Wolfe seems untrue to its protagonist the likelier explanation is that the reader has missed something.",
  quote="With Wolfe one usually has", polarity='asserts', kind='reception', date='2023-11-22',
  page="review, on the novella 'Memorare'", routeHint=WB+' (ts 20250607234048)')
D19='https://www.washingtonpost.com/entertainment/books/beyond-george-rr-martin-a-critics-pick-of-science-fiction-and-fantasy/2019/04/30/8fcc7d60-6aa2-11e9-be3a-33217240a539_story.html'
C(feature='register modulation',url=D19,source="Michael Dirda, 'Beyond George R.R. Martin: A critic's pick of science fiction and fantasy', The Washington Post, 2019-04-30",
  claim="Dirda groups Wolfe with Le Guin as writers whose work typically exhibits a cool, almost classical perfection.",
  quote="cool, almost classical perfection", polarity='asserts', kind='analysis', date='2019-04-30',
  page='column, second paragraph', routeHint=WB+' (ts 20231225230809)', registerHint='dossier-archivist')

M='https://www.technologyreview.com/2014/07/25/12916/a-qa-with-gene-wolfe/'
SW="Gene Wolfe, interviewed by Jason Pontin, MIT Technology Review, 2014-07-25"
C(feature='point of view and distance',url=M,source=SW,kind='own-words',date='2014-07-25',page="section 'Unreliable narrators and craft'",
  claim="Asked about the unreliability of his narrators, Wolfe answered that they are all unreliable.",
  quote="unreliable. Well, we all are", polarity='asserts', routeHint='live fetch with a browser user agent')
C(feature='other: difficulty as design',url=M,source=SW,kind='own-words',date='2014-07-25',page="section 'Unreliable narrators and craft'",
  claim="Wolfe stated that an author who makes everything easy for himself bores the reader.",
  quote="make everything easy for yourself as an author, you bore", polarity='asserts', routeHint='live fetch with a browser user agent')
C(feature='per-speaker register',url=M,source=SW,kind='own-words',date='2014-07-25',page='answer recommending The Sorcerer\'s House',
  claim="Wolfe described his epistolary novel as one whose style changes from one letter writer to another.",
  quote="the style changes from one letter writer to another", polarity='asserts', registerHint='herald-pools',
  routeHint='live fetch with a browser user agent')
C(feature='register modulation',url=M,source=SW,kind='own-words',date='2014-07-25',page='answer on his prose becoming looser',
  claim="Wolfe attributed the loosening of his later prose to criticism that he was unreadable and overcomplex.",
  quote="gotten so much criticism for being unreadable and overcomplex", polarity='asserts',
  routeHint='live fetch with a browser user agent')
C(feature='register modulation',url=M,source="Jason Pontin, interviewer, MIT Technology Review, 2014-07-25",kind='analysis',date='2014-07-25',
  page='question on his prose becoming looser',
  claim="Pontin characterises the later prose as looser, with shorter paragraphs and more reliance on dialogue.",
  quote="the paragraphs are shorter, you rely more on dialogue", polarity='asserts',
  routeHint='live fetch with a browser user agent')
C(feature='omission as information',url=M,source=SW,kind='own-words',date='2014-07-25',page='answer on rereading The Island of Doctor Moreau',
  claim="Wolfe singled out for praise a detail Wells mentions only in passing, that the narrator never learned the name of the sailor in the boat.",
  quote="he never learned the name of the sailor", polarity='asserts', registerHint='dossier-archivist',
  routeHint='live fetch with a browser user agent')

LD='https://locusmag.com/review/gary-k-wolfe-reviews-the-dead-man-and-other-horror-stories-by-gene-wolfe/'
SL="Gary K. Wolfe, review of 'The Dead Man and Other Horror Stories', Locus"
C(feature='plainness and economy',url=LD,source=SL,kind='analysis',page='closing paragraph',
  claim="Gary K. Wolfe describes the prose as precise and evocative.", quote="prose that is precise and evocative",
  polarity='asserts', routeHint='live fetch with a browser user agent', registerHint='dossier-archivist')
C(feature='per-speaker register',url=LD,source=SL,kind='analysis',page='closing paragraph',
  claim="Gary K. Wolfe describes a range of narrating voices running from vernacular rhythms to measured cadences.",
  quote="the vernacular rhythms of good old boys to the measured cadences", polarity='asserts',
  routeHint='live fetch with a browser user agent', registerHint='herald-pools')
C(feature='point of view and distance',url=LD,source=SL,kind='analysis',page='paragraph on framing devices',
  claim="Gary K. Wolfe says the framing devices remind the reader these are told tales and introduce layers of narrative slippage.",
  quote="remind us that these are told tales, but also introduce layers", polarity='asserts',
  routeHint='live fetch with a browser user agent', registerHint='chronicle-line')
C(feature='civic record register',url=LD,source=SL,kind='analysis',page='paragraph on framing devices',
  claim="Gary K. Wolfe lists the document types Wolfe uses as frames, among them a mysterious pamphlet found in a library.",
  quote="a mysterious pamphlet found in a library", polarity='asserts',
  routeHint='live fetch with a browser user agent', registerHint='dossier-archivist')
LI='https://locusmag.com/review/gary-k-wolfe-reviews-interlibrary-loan-by-gene-wolfe/'
SI="Gary K. Wolfe, review of 'Interlibrary Loan', Locus"
C(feature='per-speaker register',url=LI,source=SI,kind='analysis',page='third paragraph',
  claim="Gary K. Wolfe calls the narrator's own voice almost pointedly flat and restricted.",
  quote="own voice is almost pointedly flat and restricted", polarity='asserts',
  routeHint='live fetch with a browser user agent', registerHint='dossier-archivist')
C(feature='per-speaker register',url=LI,source=SI,kind='analysis',page='third paragraph',
  claim="Gary K. Wolfe reports that the reclone characters are prohibited in the story from developing their own voices.",
  quote="prohibited from developing their own voices", polarity='asserts',
  routeHint='live fetch with a browser user agent', registerHint='herald-pools')
C(feature='register modulation',url=LI,source=SI,kind='analysis',page='final sentence',
  claim="Gary K. Wolfe judges the late novels more intimate in scope and more restrained in style than the celebrated masterpieces.",
  quote="more intimate in scope and restrained in style than his celebrated masterpieces", polarity='asserts',
  routeHint='live fetch with a browser user agent')
C(feature='withheld information and inference',url=LI,source=SI,kind='analysis',page='third paragraph',
  claim="Gary K. Wolfe notes that parts of the story are recounted by characters whose veracity the reader has reason to question.",
  quote="characters whose veracity we have plenty of reason to question", polarity='asserts',
  routeHint='live fetch with a browser user agent')

DB='https://donbeck1.substack.com/p/structure-of-the-new-sun'
SD="Don Beck, 'Structure of the New Sun', The Reading Room (Substack), 2025-06-03"
C(feature='point of view and distance',url=DB,source=SD,kind='reader',date='2025-06-03',page='section Three Techniques, second technique',
  claim="Beck reports the narrator reads as emotionally flat, detached, clinical and morally inconsistent, and argues that this fits his training.",
  quote="detached, clinical, and morally inconsistent", polarity='asserts', registerHint='dossier-archivist',
  routeHint='live fetch with a browser user agent')
C(feature='withheld information and inference',url=DB,source=SD,kind='reader',date='2025-06-03',page='section Three Techniques, second technique',
  claim="Beck states that Wolfe does not foreground the protagonist's transformation as most novelists do, leaving only signposts.",
  quote="foreground this transformation as most novelists do, but the signposts are there", polarity='asserts',
  registerHint='dossier-archivist', routeHint='live fetch with a browser user agent')
C(feature='repetition and refrain',url=DB,source=SD,kind='reader',date='2025-06-03',page='section Three Techniques, third technique',
  claim="Beck identifies recursion as a structural device: names, objects and moments are revisited repeatedly and deepen each time.",
  quote="Names, objects, and moments are revisited, over and over", polarity='asserts',
  routeHint='live fetch with a browser user agent')
C(feature='opening sentence',url=DB,source=SD,kind='reader',date='2025-06-03',page='section Three Techniques, first technique',
  claim="Beck argues that disclosing the ending early is a source of tension rather than a spoiler.",
  quote="Telling us the end, giving readers crucial information about the conclusion", polarity='asserts',
  registerHint='chronicle-line', routeHint='live fetch with a browser user agent')
C(feature='point of view and distance',url=DB,source="'Truman Angell', comment on Don Beck's 'Structure of the New Sun', 2025-06-03",
  kind='reader',date='2025-06-03',page='comments',
  claim="A commenter argues Wolfe is careful about how he reveals the narrator's perfect memory, so the reader will trust his recollections.",
  quote="Wolfe is careful revealing this power", polarity='asserts', routeHint='live fetch with a browser user agent')

# Reactor reread (Fabio Fernandes, 2019)
RR='https://reactormag.com/rereading-gene-wolfe-the-fifth-head-of-cerberus-wolfes-holy-trinity/'
SR="Fabio Fernandes, 'The Fifth Head of Cerberus: Wolfe's Holy Trinity', Reactor (Tor.com), 2019-06-27"
C(feature='withheld information and inference',url=RR,source=SR,kind='analysis',date='2019-06-27',page='body, paragraph on the first novella',
  claim="Fernandes states that in the first novella things are never made clear either to the narrator or to the reader.",
  quote="But things are never made clear to him, or to the reader", polarity='asserts', registerHint='dossier-archivist',
  routeHint=WB+' (ts 20260123212504)')
C(feature='naming and forms of address',url=RR,source=SR,kind='analysis',date='2019-06-27',page='body, parenthetical on the narrator name',
  claim="Fernandes reports that the narrator's real name is never given but is recoverable from clues scattered in the text.",
  quote="there are plenty of clues that give away", polarity='asserts', registerHint='dossier-archivist',
  routeHint=WB+' (ts 20260123212504)')
C(feature='other: reading protocol',url=RR,source=SR,kind='analysis',date='2019-06-27',page='body, second paragraph',
  claim="Fernandes warns that with this author the reader who tries to understand things too clearly gets lost.",
  quote="one tends to get lost in trying to understand things too clearly", polarity='asserts',
  routeHint=WB+' (ts 20260123212504)')
RP='https://reactormag.com/peace-wolfes-masterful-rumination-on-nostalgia-memory-and-uncertainty/'
SP="Fabio Fernandes, 'Peace: Wolfe's Masterful Rumination on Nostalgia, Memory, and Uncertainty', Reactor (Tor.com), 2019-07-11"
C(feature='place and institution description',url=RP,source=SP,kind='analysis',date='2019-07-11',page='body, on the first half of Peace',
  claim="Fernandes says the novel's early section works through the description of a house, a garden and small details that carry the narrator back to childhood.",
  quote="The description of the house, the garden, and all the small details", polarity='asserts',
  registerHint='dossier-archivist', routeHint=WB+' (ts 20250325033937)')
C(feature='point of view and distance',url=RP,source="Fabio Fernandes relaying Gene Wolfe's 2014 MIT Technology Review interview, Reactor, 2019-07-11",
  kind='relay',date='2019-07-11',page='body, final section',
  claim="Fernandes relays Wolfe's statement that all his narrators are unreliable.",
  quote="his narrators are unreliable. And that is always significant", polarity='asserts', confidence='medium',
  routeHint=WB+' (ts 20250325033937)')
RC='https://reactormag.com/the-claw-of-the-conciliator-part-1-holding-the-power-of-life-and-death/'
C(feature='place and institution description',url=RC,source="Fabio Fernandes, 'The Claw of the Conciliator, Part 1', Reactor (Tor.com), 2019",
  kind='analysis',date='2019',page='body, on the execution at Saltus',
  claim="Fernandes observes that Wolfe takes his time describing the office of the executioner in full detail, and that it matches what is known of medieval European practice.",
  quote="describing in full detail the role of the carnifex", polarity='asserts', registerHint='dossier-archivist',
  routeHint=WB+' (ts 20251102163722)')
RCI='https://reactormag.com/rereading-gene-wolfe-the-citadel-of-the-autarch-part-1-a-festival-of-stories/'
C(feature='other: governing subject matter',url=RCI,source="Fabio Fernandes, 'The Citadel of the Autarch, Part 1: A Festival of Stories', Reactor (Tor.com), 2019",
  kind='analysis',date='2019',page='body, mid-article',
  claim="Fernandes names time and memory as the mainstays of Wolfe's prose.",
  quote="Time and memory are the mainstays of Gene", polarity='asserts',
  routeHint=WB+' (ts 20260124005729)')
