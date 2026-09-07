# -*- coding: utf-8 -*-
import json, re, os

B='hobb-raw/'
U={
 '5000':'https://web.archive.org/web/20050724083052id_/http://www.robinhobb.com/5000words.html',
 'g17':'https://www.theguardian.com/books/2017/jul/28/robin-hobb-books-interview-assassins-fate',
 'g14':'https://www.theguardian.com/books/2014/sep/10/fools-assassin-robin-hobb-review-fantasy-novel',
 'ind':'https://www.independent.co.uk/arts-entertainment/books/reviews/fool-s-quest-by-robin-hobb-book-review-more-swords-and-sorcery-from-a-dame-of-thrones-10456044.html',
 'tor':'https://reactormag.com/book-review-the-fools-assassin-robin-hobb/',
 'sh':'https://strangehorizons.com/wordpress/non-fiction/reviews/revolutionary-nautical-fantasy-robin-hobbs-liveship-traders-series/',
 'oru':'https://web.archive.org/web/20201111180135id_/https://www.tor.com/2012/02/07/youve-never-read-anything-like-sff-before-robin-hobb-talks-with-peter-orullian/',
 'iz':'https://archive.org/download/interzone-098-1995-08-bogof-39/Interzone%20098%201995-08%20%28Bogof39%29_djvu.txt',
 'asi':'https://archive.org/download/asimovsv21n02199702_201908/Asimovs_v21n02_1997-02_djvu.txt',
 'hod':'https://doi.org/10.12958/2227-2844-2024-2(361)-148-156',
}
FILE={'5000':B+'5000words.txt','g17':B+'guardian2017.txt','g14':B+'guardian2014.txt',
 'ind':B+'independent2015.txt','tor':B+'tor2014review.txt','sh':B+'sh-liveship.txt',
 'oru':B+'orullian.txt','iz':B+'interzone98.txt','asi':B+'asimovs9702.txt',
 'hod':'hobb-acad/assistant.txt'}
SRC={
 '5000':"Robin Hobb, '5000 Words About Myself', written for Alienisti (Finncon), robinhobb.com, 2004",
 'g17':"Alison Flood interviewing Robin Hobb, The Guardian, 28 July 2017",
 'g14':"Alison Flood, review of Fool's Assassin, The Guardian, 10 September 2014",
 'ind':"Amanda Craig, review of Fool's Quest, The Independent, 2015",
 'tor':"Justin Landon, review of Fool's Assassin, Tor.com (now Reactor), 12 August 2014",
 'sh':"Stephanie Dray, review of the Liveship Traders, Strange Horizons, 5 November 2001",
 'oru':"Robin Hobb interviewed by Peter Orullian, Tor.com, 7 February 2012",
 'iz':"Chris Morgan, 'First Fantasies' review column, Interzone 98, August 1995",
 'asi':"Peter Heck, 'On Books', Asimov's Science Fiction, February 1997, pp. 157-158",
 'hod':"Zoriana Hodunok, Visnyk LNU imeni Tarasa Shevchenka, Filolohichni nauky 2(361), 2024, pp. 148-156",
}
DATE={'5000':'2004','g17':'2017-07-28','g14':'2014-09-10','ind':'2015','tor':'2014-08-12',
 'sh':'2001-11-05','oru':'2012-02-07','iz':'1995-08','asi':'1997-02','hod':'2024'}
RH={
 '5000':'wayback raw id_ capture; original URL recovered via the archive.org CDX API (robinhobb.com*, 2005). Text has apostrophes stripped, so quotes avoid them.',
 'g17':'live page fetched with a browser user agent; canonical is 2017/jul/28',
 'g14':'live page, browser user agent',
 'ind':'live page, browser user agent',
 'tor':'live page; the 2014 tor.com URL now redirects to reactormag.com — this canonical',
 'sh':'live page, strangehorizons.com/wordpress/ path',
 'oru':'live tor.com URL returns Cloudflare 403; text is the Wayback raw capture 20201111180135id_',
 'iz':'archive.org djvu OCR full text; item byte-verified at 441642 bytes. OCR uses DOUBLE spaces between words and a "¬" soft hyphen at line breaks — quote verified against a whitespace-normalised copy and chosen to contain no line break.',
 'asi':'archive.org djvu OCR full text; item byte-verified at 406311 bytes. Same double-space/"¬" hazard as Interzone — quote chosen to contain no ¬ break.',
 'hod':'PDF fetched and text extracted; the claim rests on the article\'s own English abstract',
}
KIND={'5000':'own-words','g17':'own-words','g14':'analysis','ind':'analysis','tor':'analysis',
 'sh':'analysis','oru':'own-words','iz':'reception','asi':'reception','hod':'analysis'}

C=[]
def c(k,feature,claim,quote,page,polarity,registerHint='none',confidence='high',kind=None):
    C.append(dict(feature=feature,claim=claim,source=SRC[k],url=U[k],quote=quote,page=page,
        kind=kind or KIND[k],polarity=polarity,date=DATE[k],routeHint=RH[k],
        registerHint=registerHint,confidence=confidence))

# ---------- 1. 5000 Words About Myself (Hobb's own words, 2004) ----------
c('5000','other: style resists the short form',
  "Hobb says her Robin Hobb style itself, not her choice of subject, is what prevents her writing anything shorter than a novella.",
  "Something about the style does not lend itself to shorter tales","opening paragraph","asserts",'none')
c('5000','register modulation',
  "Hobb refuses to substitute a Megan Lindholm story for a Robin Hobb one because the style and the topic choice of the two by-lines differ enough that one cannot stand in for the other.",
  "differ enough that I do not like to offer one","opening paragraph","asserts",'none')
c('5000','concrete sensory noun',
  "Hobb says the way to convince a reader she knows dragons is to know the physical detail of raising chickens or roofing a house.",
  "the details of raising chickens or putting a roof on a house","section on the move to Alaska","asserts",'dossier-archivist')
c('5000','concrete sensory noun',
  "Hobb states she believes not only in research but in trying to experience a thing before writing it, so as to include its physical details.",
  "not just in research, but in attempting to experience the things","section on the move to Alaska","asserts",'dossier-archivist')
c('5000','point of view and distance',
  "Hobb says she decided to write the first Farseer book in the first person and to attempt a completely different sort of voice and telling.",
  "to attempt a completely different sort of voice and telling","section on writing Chivalry's Bastard","asserts",'none')
c('5000','other: pseudonym as a licence to change style',
  "Hobb describes the Robin Hobb by-line as a way to escape limits she had placed on herself rather than limits an editor imposed.",
  "escape the limits that I had placed on myself","section on choosing the name Robin Hobb","asserts",'none')
c('5000','place and institution description',
  "Describing her own Tacoma neighbourhood in her own non-fiction, Hobb enumerates the civic institutions reachable on foot as a bare list.",
  "a theatre, a grocery store, a library, the post office","section on living in Tacoma","applies",'dossier-archivist')
c('5000','other: figures in a place description',
  "Hobb gives her city's population as about 193,000 and its median age as 33 when introducing Tacoma to a foreign readership.",
  "Our population is about 193,000 people, median age 33","section on living in Tacoma","applies",'dossier-archivist')
c('5000','consequence on a household',
  "Hobb reports that during her midlist years her household kept poultry and a garden and raised a couple of pigs for slaughter each year.",
  "each year we raised a couple of pigs for slaughter","section on the midlist years near Roy, Washington","asserts",'none')
c('5000','other: composition method',
  "Hobb's stated writing advice is to aim at a scene rather than a book on any given day.",
  "think that today you will write a scene","closing advice","asserts",'none')
c('5000','other: character over plot',
  "Hobb says the piece that won her an A in her only creative-writing class was long on character and short on plot, and that she knew it was not a story.",
  "long on character and short on plot","section on Denver University","asserts",'none')

# ---------- 2. Guardian 2017 interview ----------
c('g17','per-speaker register',
  "Hobb characterises the Megan Lindholm voice, against the Robin Hobb one, as more snarky, more sarcastic and less optimistic.",
  "little more snarky, a little more sarcastic, a little less optimistic",
  "section on choosing the pen name","asserts",'none')
c('g17','withheld information and inference',
  "Hobb describes her narrator Fitz as cagey, a man who does not always admit the full truth about anything.",
  "Fitz is cagey, he doesn’t always admit the full truth","section on choosing the pen name","asserts",'chronicle-line')
c('g17','other: discovery over outline',
  "Hobb says the Fool had exactly one sentence in the outline of the first book before becoming a major character.",
  "the Fool had exactly one sentence in the outline","section on the Fool","asserts",'none')
c('g17','other: plausibility over spectacle',
  "Hobb defines good fantasy as lowering the reader's threshold of disbelief so nothing blocks the reader out.",
  "lowering the threshold of disbelief so the reader can step right","early in the interview","asserts",'dossier-archivist')
c('g17','other: plausibility over spectacle',
  "Hobb says silly is a more dangerous fault in fantasy than impossible.",
  "And I think silly is more dangerous than impossible","early in the interview","asserts",'dossier-archivist')
c('g17','place and institution description',
  "Alison Flood reports that Hobb drew the geography of the Six Duchies from Alaska and the Pacific Northwest, where she had lived.",
  "drew the geography of the Six Duchies from Alaska","section after the pen-name discussion","asserts",'none',kind='analysis')
c('g17','edition and house style',
  "Hobb reports being told early in her career not to write anything more than 250 pages long, 275 at the most, because of paperback binding.",
  "anything more than 250 pages long, 275 tops","section on the state of fantasy","asserts",'none')
c('g17','consequence on a household',
  "Hobb likens writing in a big world to clockwork: you set off events and then watch what they are triggering come into view.",
  "You set off events, and then you see coming into","section on returning to Fitz","asserts",'none')

# ---------- 3. Guardian 2014 review ----------
c('g14','concrete sensory noun',
  "Flood's review quotes Fitz stating his changed station as a list of farm produce and tools rather than as a rank.",
  "a respectable land-holder, a man of grapes and sheep now","fourth paragraph","applies",'dossier-archivist')
c('g14','other: pacing and slow consequence',
  "Flood writes that Hobb gives the reader months and years of not much happening before events begin to spiral.",
  "Hobb gives us months","paragraph on the novel's opening","asserts",'none')
c('g14','other: pacing and slow consequence',
  "Flood describes the novel's disasters as seeds Hobb sowed near the start that only later sprout.",
  "the seeds of doom Hobb sowed so near the start","penultimate section","asserts",'none')
c('g14','metaphor discipline',
  "Flood's review quotes Fitz rendering grief as a stone dropping into a well rather than as an abstraction.",
  "that stone-dropping-into-a-well plunge of my heart","paragraph on the carving and the Fool","applies",'none')

# ---------- 4. Independent 2015 (Amanda Craig) ----------
c('ind','place and institution description',
  "Amanda Craig identifies the detail with which Hobb depicts the Six Duchies as one of two things that account for her appeal.",
  "the detail with which she depicts the Six Duchies world","middle of the review","asserts",'dossier-archivist')
c('ind','point of view and distance',
  "Craig names Hobb's emphasis on internal drama as the second half of what accounts for her appeal.",
  "but her emphasis on internal drama","middle of the review","asserts",'none')
c('ind','consequence on a household',
  "Craig writes that healing, clothing and kindness are given as much weight in Hobb's world as combat, drinking and wealth.",
  "healing, clothing, kindness and the terror of rape are given","fourth paragraph","asserts",'dossier-archivist')
c('ind','place and institution description',
  "Craig characterises the majority of the Six Duchies' citizens as people who would rather trade and raise families than fight.",
  "citizens are people who would rather trade and raise families","fifth paragraph","asserts",'dossier-archivist')
c('ind','other: pacing and slow consequence',
  "Craig registers a pacing complaint, saying that by the time violence erupts the reader wishes for more action and less introspection.",
  "you wish for more action and less introspection","fourth paragraph","disputes",'none')
c('ind','other: register compared to literary domestic fiction',
  "Craig says the feelings in Hobb are as familiar as those in a novel by Jonathan Franzen.",
  "as familiar as those in a novel by Jonathan Franzen","third paragraph","asserts",'none')

# ---------- 5. Landon 2014 ----------
c('tor','other: pacing and slow consequence',
  "Justin Landon calls Fool's Assassin, without qualification, a slow novel.",
  "It is, without question, a slow novel","review body","asserts",'none')
c('tor','other: register compared to literary domestic fiction',
  "Landon says the novel is better compared to pastoral family dramas than to the action-packed epic fantasies of the earlier Farseer books.",
  "Comparing it to more pastoral family dramas would be more appropriate","review body","asserts",'none')
c('tor','point of view and distance',
  "Landon reports that a second point of view in the same novel is also written in the first person and alternates without obvious delineation.",
  "also written in the first person that bounces back and forth","review body","asserts",'none')
c('tor','civic record register',
  "Landon describes journal entries written by the narrator about days long past as opening every chapter of the novel.",
  "journal entries that he writes of days long past","review body","asserts",'chronicle-line')
c('tor','withheld information and inference',
  "Landon characterises the narrator as reliably unreliable in interpreting the actions of those around him.",
  "reliably unreliably interpreting the actions of those around him","review body","asserts",'chronicle-line')
c('tor','consequence on a household',
  "A reader commenting on Landon's review says he revelled in the novel's small domestic details and the patient growth of the relationships.",
  "I reveled in the small domestic details and patient growth","comment by Billcap","asserts",'none',kind='reader')
c('tor','omission as information',
  "A reader commenting on Landon's review says Hobb has been stripping traditional plot out of her books in favour of character and relationships.",
  "stripping a lot of traditional plot out of her books","comment by Billcap","asserts",'none',kind='reader')

# ---------- 6. Dray 2001 ----------
c('sh','other: pacing and slow consequence',
  "Stephanie Dray reports that pacing is the most frequent complaint made against the Liveship Traders series.",
  "the pacing of the series seems to be the most frequent complaint","late in the review","asserts",'none',kind='reception')
c('sh','consequence on a household',
  "Dray attributes to Hobb a grim devotion to realistic consequences that leaves the reader unable to predict the outcome.",
  "This grim devotion to realistic consequences ensures that the reader","paragraph on Hobb's bravery","asserts",'none')
c('sh','consequence on a household',
  "Dray notes that Hobb is willing not only to kill characters but to maim, disfigure or transform them.",
  "she isn't afraid to maim, disfigure, or transform","paragraph on Hobb's bravery","asserts",'none')
c('sh','consequence on a household',
  "Dray says the changing fortunes of the single Vestrit family stand for those of all the old trader families of Bingtown.",
  "Their changing fortunes reflect those of all the other old trader families","third paragraph","asserts",'dossier-archivist')
c('sh','consequence on a household',
  "Dray reports that the family's decision to enter the slave trade is taken in order to pay off the family debts.",
  "engage in slave trading in order to pay off the family debts","third paragraph","asserts",'dossier-archivist')
c('sh','place and institution description',
  "Dray's account of Bingtown's founding describes settlers awarded grants and trade monopolies that raised them into a merchant nobility.",
  "they were awarded grants and trade monopolies that helped them","second paragraph","asserts",'dossier-archivist')
c('sh','omission as information',
  "Dray faults the final volume for summarising the outcome of the civil insurrection briefly rather than dramatising it.",
  "the outcome of the civil insurrection is summarized briefly","paragraph on Ship of Destiny","disputes",'chronicle-line')

# ---------- 7. Orullian 2012 (the richest) ----------
c('oru','concrete sensory noun',
  "Hobb says her writing has evolved by slowing down and putting in the small details that add up to a moment of exhilaration or panic.",
  "I slow down and put in the small details","answer on how her writing has evolved","asserts",'dossier-archivist')
c('oru','place and institution description',
  "Hobb says every one of her stories starts with a character, and that the character is what introduces setting, culture, conflict, government and economy.",
  "introduces setting, culture, conflict, government, economy","answer on worldbuilding","asserts",'dossier-archivist')
c('oru','consequence on a household',
  "Hobb names as her favourite books the ones in which a protagonist takes part in great events that also strongly affect the little lives.",
  "great events that also impact the little lives very strongly","answer on what makes a fantasy epic","asserts",'dossier-archivist')
c('oru','consequence on a household',
  "Hobb says the closing chapters of The Lord of the Rings are as significant as the moment the Ring is destroyed.",
  "The chapters at the end are just as significant as","answer on what makes a fantasy epic","asserts",'none')
c('oru','concrete sensory noun',
  "Hobb says that when the strange is blended into a story it is the familiar that invites the reader in and makes it real.",
  "the familiar is what invites the reader in and makes","answer on the strange and the familiar","asserts",'dossier-archivist')
c('oru','concrete sensory noun',
  "Illustrating what makes a story real, Hobb lists ordinary domestic objects: the car, the cereal on the table, the cartoon on the television.",
  "You know the car, the cereal on the table","answer on the strange and the familiar","applies",'dossier-archivist')
c('oru','point of view and distance',
  "Hobb says that when writing from a character's point of view the author has to stop making judgments and let the character talk.",
  "the author has to stop making judgments and let the","answer on how her writing has evolved","asserts",'none')
c('oru','other: worldbuilding word budget',
  "Hobb says that setting up a fantasy world costs a writer plot and character words that a writer in the real world does not have to spend.",
  "sacrificing a lot of plot and character words to world-building","answer on how the genre has changed","asserts",'none')
c('oru','other: no thematic planning',
  "Hobb states she does not think about foreshadowing or symbolism or themes while writing.",
  "I don’t think about foreshadowing or symbolism or themes","answer on thematic underpinning","asserts",'none')
c('oru','other: social class of characters',
  "Hobb attributes the origins of many of her characters to her living in a mostly blue-collar world.",
  "So I live in a mostly blue-collar world","answer on quirks","asserts",'none')

# ---------- 8. Morgan 1995 (Interzone 98) — the contemporary dissent ----------
c('iz','plainness and economy',
  "The only contemporary review of Assassin's Apprentice in Interzone calls the novel stylistically patchy.",
  "Stylistically, the novel is patchy","'First Fantasies' column, review of The Assassin's Apprentice","disputes",'none')
c('iz','plainness and economy',
  "Chris Morgan attributes the patchiness to Hobb attempting a deliberately literary manner, and names repetitions, awkwardnesses and bad habits as the result.",
  "repetitions, awkwardnesses and bad habits creep in","'First Fantasies' column","disputes",'none')
c('iz','metaphor discipline',
  "Even while faulting the style, Morgan credits Hobb with producing an exquisitely poetical phrase that says much of human nature in a few words.",
  "an exquisitely poetical phrase which says much of human nature","'First Fantasies' column","asserts",'none')
c('iz','other: pacing and slow consequence',
  "Morgan describes the first novel as entertaining after a slow start, sporadically surprising and sometimes subtle.",
  "entertaining after a slow start, sporadically surprising, sometimes subtle","'First Fantasies' column","asserts",'none')
c('iz','other: register read as historical fiction',
  "Morgan classes Assassin's Apprentice as historically-based fiction carrying relatively small amounts of fantasy.",
  "It is historically-based fiction with relatively small amounts of fantasy","'First Fantasies' column","asserts",'dossier-archivist')
c('iz','other: register read as historical fiction',
  "Reading the prose in 1995, Morgan inferred the author was an experienced writer from another genre, presumably historical fiction.",
  "of an experienced author from another genre (presumably historical fiction)","'First Fantasies' column, opening of the Hobb review","asserts",'none')
c('iz','closing sentence',
  "Morgan faults the end of the novel for a sudden descent into melodrama of an almost farcical nature.",
  "a sudden descent into melodrama of an almost farcical nature","'First Fantasies' column","disputes",'none')

# ---------- 9. Heck 1997 (Asimov's) — the record-register find ----------
c('asi','civic record register',
  "Peter Heck identifies the passage that delivers the Six Duchies' dynastic history as a brief historical memoir written by the first-person narrator.",
  "We learn this in a brief historical memoir written by","'On Books', review of Assassin's Apprentice and Royal Assassin","asserts",'dossier-archivist')
c('asi','annalist voice and deep time',
  "Summarising that memoir, Heck reports the founding of the realm as raiders from the Outislands settling the temperate mainland.",
  "to settle the more temperate mainland","'On Books', p. 157","asserts",'dossier-archivist')
c('asi','naming and forms of address',
  "Heck reports that the first king established both the royal line and a tradition of allegorical names in the family.",
  "of allegorical names in the","'On Books', p. 157","asserts",'dossier-archivist')
c('asi','naming and forms of address',
  "Heck notes that the narrator carries two names by social station: the formal one, and the one he is known by in the kitchens.",
  "but known in the kitchens as","'On Books', p. 157","asserts",'dossier-archivist')
c('asi','naming and forms of address',
  "Heck renders a household office as a compound title, naming Burrich the royal master of hounds, hawks and horses.",
  "Burrich, the royal master of hounds, hawks, and horses","'On Books', p. 157","applies",'dossier-archivist')
c('asi','plainness and economy',
  "Reviewing the first two Farseer novels in 1997, Heck says the prose reads like the work of a seasoned professional rather than a newcomer.",
  "certainly this reads like the work of a seasoned professional","'On Books', p. 157","asserts",'none')

# ---------- 10. Hodunok 2024 ----------
c('hod','point of view and distance',
  "Hodunok argues that Hobb made the monomyth's assistant figure the protagonist, so the narrator is realised mainly in service of others.",
  "is realized mainly in the service of the others","English abstract","asserts",'none','medium')
c('hod','other: the power plot demoted',
  "Hodunok finds that in the Farseer trilogy the importance of the struggle for power to the characters is significantly reduced.",
  "the importance of the power struggle for the characters is significantly reduced","English abstract","asserts",'none','medium')

# verify
def norm(s): return re.sub(r'\s+',' ',s)
texts={k:norm(open(v,encoding='utf-8',errors='replace').read()) for k,v in FILE.items()}
inv={v:k for k,v in U.items()}
bad=0
for cl in C:
    k=inv[cl['url']]; q=cl['quote']
    if q and q not in texts[k]:
        if q.replace("'","’") in texts[k]:
            cl['quote']=q.replace("'","’")
        else:
            print("BLANKED:",k,repr(q)); cl['quote']=''; bad+=1
print("claims:",len(C),"blanked:",bad)
json.dump(C,open('.dr-claims-1.json','w'),ensure_ascii=False,indent=1)
