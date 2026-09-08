import json,os
D=os.path.dirname(os.path.abspath(__file__))
prev=json.load(open(os.path.join(D,'found-dnd-usability-school.json')))
S=prev['sourcesRead']; C=prev['claims']
def src(t,u,k,sub,d,r): S.append(dict(title=t,url=u,kind=k,substantive=sub,date=d,route=r))
DIR="direct curl, browser UA"
src("The Book Introduction (tenfootpole.org)","https://tenfootpole.org/ironspike/?page_id=9593","craft-criticism",True,"undated page (book in progress)",DIR)
src("My Favorite of the new old school adventurers (tenfootpole.org)","https://tenfootpole.org/ironspike/?page_id=844","list",False,"undated","direct curl; recommendation list only, no prose doctrine")
src("Hack & Slash: On Set Design","http://hackslashmaster.blogspot.com/2012/06/on-set-design.html","craft-criticism",True,"2012-06",DIR)
src("Beyond Fomalhaut: OSR Module O1: Against the Ultra-Minimalism","http://beyondfomalhaut.blogspot.com/2017/01/blog-osr-module-o1-against-ultra.html","craft-criticism",True,"2017-01-12",DIR)
src("Beyond Fomalhaut: Aid, Not Replacement","http://beyondfomalhaut.blogspot.com/2018/03/blog-aid-not-replacement.html","craft-criticism",True,"2018-03-09",DIR)
src("On Useful Dungeon Key Entries (ars phantasia)","https://arsphantasia.wordpress.com/2013/12/05/on-useful-dungeon-key-entries/","craft-criticism",True,"2013-12-05",DIR)
src("Rewriting Dungeon Keys (The Lady and Tiger)","https://theladyandtiger.com/2023/11/30/rewriting-dungeon-keys/","craft-criticism",True,"2023-11-30",DIR)
src("The Alexandrian: Are We Really This Stupid?","https://thealexandrian.net/wordpress/1217/roleplaying-games/are-we-really-this-stupid","craft-criticism",True,"2011-01-10",DIR)
src("Improved area keys (Necropraxis)","http://www.necropraxis.com/2013/12/07/improved-area-keys/","craft-criticism",True,"2013-12-07",DIR)
src("Beyond Fomalhaut: [REVIEW] Halls of the Minotaur","http://beyondfomalhaut.blogspot.com/2018/03/review-halls-of-minotaur.html","review",True,"2018-03",DIR)
src("The Swan Hollow Intrigue (tenfootpole.org review)","https://tenfootpole.org/ironspike/?p=10575","review",True,"2026-09-05",DIR)
src("The Alexandrian: Ptolus - Running the Campaign: From Table to Page","https://thealexandrian.net/wordpress/39322/roleplaying-games/ptolus-running-the-campaign-from-table-to-page","craft-criticism",True,"2018-01-05",DIR)
src("All Dead Generations: Maxims of the OSR","https://alldeadgenerations.blogspot.com/2023/08/maxims-of-osr.html","analysis",True,"2023-08",DIR)
def c(feature,claim,source,url,quote,page="",kind="analysis",polarity="asserts",date="",routeHint="direct curl (browser UA)",registerHint="dm-page",confidence="high"):
    C.append(dict(feature=feature,claim=claim,source=source,url=url,quote=quote,page=page,kind=kind,polarity=polarity,date=date,routeHint=routeHint,registerHint=registerHint,confidence=confidence))
BI="https://tenfootpole.org/ironspike/?page_id=9593"
HS="http://hackslashmaster.blogspot.com/2012/06/on-set-design.html"
ML="http://beyondfomalhaut.blogspot.com/2017/01/blog-osr-module-o1-against-ultra.html"
MA="http://beyondfomalhaut.blogspot.com/2018/03/blog-aid-not-replacement.html"
AP="https://arsphantasia.wordpress.com/2013/12/05/on-useful-dungeon-key-entries/"
LT="https://theladyandtiger.com/2023/11/30/rewriting-dungeon-keys/"
AS="https://thealexandrian.net/wordpress/1217/roleplaying-games/are-we-really-this-stupid"
NP="http://www.necropraxis.com/2013/12/07/improved-area-keys/"
MR="http://beyondfomalhaut.blogspot.com/2018/03/review-halls-of-minotaur.html"
SW="https://tenfootpole.org/ironspike/?p=10575"
PT="https://thealexandrian.net/wordpress/39322/roleplaying-games/ptolus-running-the-campaign-from-table-to-page"
GM="https://alldeadgenerations.blogspot.com/2023/08/maxims-of-osr.html"
BL="Bryce Lynch, 'The Book Introduction', tenfootpole.org"
c("other: key format","Bryce Lynch says the number one complaint about published adventures is that they are hard to run.",BL,BI,"The number one complaint about published adventures","The Book Introduction, opening"),
c("dm-facing sentence","Bryce Lynch distinguishes writing for oneself, where the words are only a memory cue, from writing for a stranger.",BL,BI,"The words on the page are only a memory cue","The Book Introduction, third paragraph"),
c("place and institution description","Bryce Lynch attributes dry and tedious encounters to the failed transfer of the writer's imagined scene into the reader's head.",BL,BI,"leading to dry and tedious encounters","The Book Introduction, fourth paragraph",registerHint="dossier-archivist"),
c("other: audience","Bryce Lynch frames his book as advice on writing an adventure for publication rather than for one's own table.",BL,BI,"This book is advice on how to write an adventure for publication.","The Book Introduction, second paragraph"),
CC="Courtney Campbell, 'On Set Design', Hack & Slash, 2012"
c("plainness and economy","Courtney Campbell's key format admits no word that is not important.",CC,HS,"Any word that is not important, is not used.","On Set Design, explanation",date="2012-06"),
c("dm-facing sentence","Courtney Campbell's key replaces prose with bolded nouns, and he says he describes a room using only the bolded words.",CC,HS,"When describing things, I only use the bolded words!","On Set Design, explanation",date="2012-06"),
c("plainness and economy","Courtney Campbell reports that his key gives him everything needed to run the tick encounter in seven words.",CC,HS,"everything I need to run the encounter successfully in seven words","On Set Design, explanation",kind="measurement",date="2012-06"),
c("other: seen in a glance","In Courtney Campbell's format the items placed after the bar are the ones immediately visible on entering.",CC,HS,"After the bar are the immediately visible items!","On Set Design, explanation",date="2012-06"),
GL="Gabor Lux (Melan), 'OSR Module O1: Against the Ultra-Minimalism', Beyond Fomalhaut, 2017"
c("plainness and economy","Gabor Lux credits the classic modules with terse simplicity and language that is expressive but functional.",GL,ML,"terse simplicity, expressive but functional language, play-oriented presentation","Against the Ultra-Minimalism, 'Know your enemy'",date="2017-01-12"),
c("other: authorial voice in rulebooks","Gabor Lux argues that how an adventure is told matters as well as what is told.",GL,ML,"it also matters how it gets told","Against the Ultra-Minimalism, 'The Keep on the Borderlands without...'",date="2017-01-12",polarity="disputes"),
c("plainness and economy","Gabor Lux argues that ultra-minimalism strips flavour, depth and inner complexity out of game texts.",GL,ML,"Ultra-Minimalism is stripping games of their flavour, depth and inner complexity","Against the Ultra-Minimalism, opening",date="2017-01-12",polarity="rejects"),
c("other: authorial voice in rulebooks","Gabor Lux says stylistic elements technically superfluous to an encounter give a game text a voice that sticks in the imagination.",GL,ML,"a voice that speaks to us and sticks","Against the Ultra-Minimalism, 'The Keep on the Borderlands without...'",date="2017-01-12"),
c("place and institution description","Gabor Lux says The Village of Hommlet paints an idyllic rural community by dwelling on random details that do not matter in an adventure.",GL,ML,"spending much of its time talking about random details","Against the Ultra-Minimalism, 'Know your enemy'",date="2017-01-12",polarity="disputes",registerHint="dossier-archivist",confidence="high"),
c("edition and house style","Gabor Lux says layout and graphic design can improve accessibility but do not replace style.",GL,ML,"it doesn’t replace style","Against the Ultra-Minimalism, 'The Keep on the Borderlands without...'",date="2017-01-12"),
GA="Gabor Lux (Melan), 'Aid, Not Replacement', Beyond Fomalhaut, 2018"
c("other: read-play gap","Gabor Lux says the large Pathfinder and 5e publishers produce encounters that read well and play terribly.",GA,MA,"encounters which read well but play terribly","Aid, Not Replacement","analysis","rejects","2018-03-09"),
c("other: aid not replacement","Gabor Lux revives T. Foster's slogan that a published game text is a creativity aid, not a creativity replacement.",GA,MA,"Creativity aid, not creativity replacement","Aid, Not Replacement",kind="relay",date="2018-03-09",confidence="medium: Lux attributes the slogan to T. Foster; the original Foster posting was not reached"),
TD="Tad Davis, 'On Useful Dungeon Key Entries', ars phantasia, 2013"
c("plainness and economy","Tad Davis proposes a middle way between maximalist and minimalist keys resting on a skillful application of economy.",TD,AP,"a skillful application of the principle of economy","On Useful Dungeon Key Entries, 'A Via Media'",date="2013-12-05"),
c("boxed text form","Tad Davis reports the minimalist camp's argument that read-aloud descriptions take too much time and bore players.",TD,AP,"take up too much time and bore players to tears","On Useful Dungeon Key Entries, 'Assessing the Two Approaches'",kind="relay",polarity="mentions",date="2013-12-05"),
c("boxed text form","Tad Davis declines to eliminate boxed text, valuing it as a way of partitioning the information meant for players.",TD,AP,"not convinced that we should completely eliminate the boxed text","On Useful Dungeon Key Entries, 'Assessing the Two Approaches'",polarity="disputes",date="2013-12-05"),
c("other: key format","Tad Davis says that navigating walls of text costs time even when the page is well laid out.",TD,AP,"navigating the walls of text takes time","On Useful Dungeon Key Entries, 'Assessing the Two Approaches'",date="2013-12-05"),
CY="cygnus, 'Rewriting Dungeon Keys', The Lady and Tiger, 2023"
c("concrete sensory noun","cygnus rewrites each key with a one to two sentence description touching the five senses.",CY,LT,"Short description (one to two sentences), highlighting the 5 senses.","Rewriting Dungeon Keys, 'The Key'",date="2023-11-30"),
c("other: seen in a glance","cygnus says focusing on what the characters can immediately perceive is what keeps the description from rambling.",CY,LT,"focusing on what the characters can immediately perceive","Rewriting Dungeon Keys",date="2023-11-30"),
c("edition and house style","cygnus names the Old-School Essentials house style for adventure writing as one of the two models for his rewritten keys.",CY,LT,"the Old-School Essentials house style for adventure writing","Rewriting Dungeon Keys",date="2023-11-30",polarity="mentions"),
JA="Justin Alexander, 'Are We Really This Stupid?', The Alexandrian, 2011"
c("other: reference layout","Justin Alexander says the one thing he loves about the delve format is putting everything needed to run an area in that area's description.",JA,AS,"Putting everything you need to run an encounter area in the description","Are We Really This Stupid?, 'Isolated Encounters'",date="2011-01-10",polarity="applies"),
c("edition and house style","Justin Alexander says the delve format artificially isolates the encounter from its context and so defeats its own purpose.",JA,AS,"it artificially isolates the “encounter”","Are We Really This Stupid?, 'Isolated Encounters'",date="2011-01-10",polarity="rejects"),
c("dm-facing sentence","Justin Alexander asks publishers to trust DMs rather than pre-programming every monster's behaviour in the text.",JA,AS,"publishers can put a little more trust in DMs","Are We Really This Stupid?, 'Encounters on the Fly'",date="2011-01-10"),
BR="Brendan (Necropraxis), 'Improved area keys', 2013"
c("other: key format","Brendan of Necropraxis describes the dominant published format as areas written out in lengthy proper English prose.",BR,NP,"Areas are described in lengthy, proper english prose.","Improved area keys",date="2013-12-07"),
c("other: read-play gap","Brendan of Necropraxis grants that well-written prose modules are pleasurable to read.",BR,NP,"pleasurable to read (if well-written)","Improved area keys",date="2013-12-07",polarity="asserts"),
c("other: read-play gap","Brendan of Necropraxis says the same prose modules are cumbersome to use in play.",BR,NP,"quite cumbersome to use in play","Improved area keys",date="2013-12-07",polarity="rejects"),
c("plainness and economy","Brendan of Necropraxis objects that Courtney Campbell's outline key, though usable, lacks poetry.",BR,NP,"it lacks poetry","Improved area keys",date="2013-12-07",polarity="disputes",confidence="high"),
c("dm-facing sentence","Brendan of Necropraxis keeps running prose but bolds the features the referee needs immediately.",BR,NP,"I bold the immediately relevant features.","Improved area keys",date="2013-12-07"),
c("boxed text form","Brendan of Necropraxis faults boxed text for separating a thing's first impression from its elaboration further down the page.",BR,NP,"separated the initial impression (“treasure chest”) from elaboration","Improved area keys",date="2013-12-07",polarity="rejects"),
c("other: seen in a glance","Brendan of Necropraxis says the aim of bolding is that the referee can take in the area with a glance.",BR,NP,"take in the area with a glance","Improved area keys",date="2013-12-07"),
c("plainness and economy","On his worked example Brendan of Necropraxis reports the text that must be read is cut by more than half without degrading the prose.",BR,NP,"cut down by more than half","Improved area keys",kind="measurement",date="2013-12-07",confidence="medium: an author's estimate on a single short example"),
GX="Gabor Lux (Melan), '[REVIEW] Halls of the Minotaur', Beyond Fomalhaut, 2018"
c("boxed text form","Reviewing a 2006 DCC module, Gabor Lux says much boxed text and follow-up writing are expended to say relatively little.",GX,MR,"much boxed text and followup writing are expended to say relatively little","Halls of the Minotaur review",kind="reception",polarity="rejects",date="2018-03"),
c("other: read-play gap","Gabor Lux reports that the same module played better at the table than it read on the page.",GX,MR,"It really did play better than it reads","Halls of the Minotaur review",kind="reception",date="2018-03"),
BS="Bryce Lynch, review of 'The Swan Hollow Intrigue', tenfootpole.org, 2026"
c("boxed text form","Bryce Lynch's rule in a 2026 review is that read-aloud should never be long.",BS,SW,"Read-aloud should never be long","Swan Hollow Intrigue review",polarity="rejects",date="2026-09-05"),
c("other: read-aloud delivery","Bryce Lynch says long read-aloud makes players lose focus and reach for their phones.",BS,SW,"Long read-aloud causes players to loose focus","Swan Hollow Intrigue review",date="2026-09-05"),
c("edition and house style","Bryce Lynch says long passages set in italics are cognitively hard to read.",BS,SW,"Long italics is hard to read, cognitively.","Swan Hollow Intrigue review",date="2026-09-05",polarity="rejects"),
c("other: detail versus specificity","Bryce Lynch distinguishes detail, which he calls trivia, from specificity, and says detail is bad.",BS,SW,"In this context detail is bad. It is trivia.","Swan Hollow Intrigue review",date="2026-09-05",polarity="rejects"),
c("plainness and economy","Bryce Lynch says one well written specific sentence is worth more than a page of details.",BS,SW,"one well written specific sentence is worth more","Swan Hollow Intrigue review",date="2026-09-05",registerHint="dossier-archivist"),
c("plainness and economy","Bryce Lynch defines specificity as terse, so that it does not interrupt the DM scanning the page.",BS,SW,"It is terse, meaning it doesn’t get in the way","Swan Hollow Intrigue review",date="2026-09-05"),
c("dm-facing sentence","Bryce Lynch says the specific sentence communicates to the DM exactly the vibe to aim for.",BS,SW,"It communicates exactly the vibe the DM should be going for.","Swan Hollow Intrigue review",date="2026-09-05"),
c("adjective and adverb discipline","Bryce Lynch says a single parenthetical adjective on a random-encounter entry tells the DM a great deal.",BS,SW,"That (dubious) in parens tells us a lot.","Swan Hollow Intrigue review",date="2026-09-05"),
c("adjective and adverb discipline","Bryce Lynch says quick adjectives and adverbs describing an NPC work where a paragraph of italic read-aloud for the same NPC fails.",BS,SW,"quick adjectives/adverbs used to describe NPCs hit so well","Swan Hollow Intrigue review",date="2026-09-05"),
c("plainness and economy","Bryce Lynch's verdict on exposition in an adventure text is that more is not better.",BS,SW,"More is not better.","Swan Hollow Intrigue review",date="2026-09-05",polarity="rejects"),
JP="Justin Alexander, 'Ptolus: Running the Campaign - From Table to Page', The Alexandrian, 2018"
c("place and institution description","Justin Alexander rejects replacing borrowed material with generic versions, saying generic lacks identity.",JP,PT,"“Generic” isn’t good. Generic lacks identity.","From Table to Page",date="2018-01-05",polarity="rejects",registerHint="dossier-archivist"),
c("other: audience","Justin Alexander warns a writer adapting a home campaign against trying to recapture the campaign instead of the scenario.",JP,PT,"trying to recapture the campaign instead of the scenario","From Table to Page",date="2018-01-05"),
GU="Gus L, 'Maxims of the OSR', All Dead Generations, 2023"
c("civic record register","Gus L says a game text made entirely of fruitful voids becomes at best a prose poem shaped like an instruction manual or gazetteer.",GU,GM,"a mediocre at best prose poem in the form of an instruction manual","Maxims of the OSR, 'Roleplaying not Roll Playing'",date="2023-08",polarity="rejects",registerHint="dossier-archivist"),
out=dict(complete=False,coverage="in progress (checkpoint 2)",sourcesRead=S,claims=C)
json.dump(out,open(os.path.join(D,'found-dnd-usability-school.json'),'w'),indent=1,ensure_ascii=False)
print(len(C),"claims",len(S),"sources")
