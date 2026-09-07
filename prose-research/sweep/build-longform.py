import json,os,re,sys
R='longform-raw/'
def raw(n):
    p=R+n+'.txt'
    return open(p,encoding='utf-8',errors='ignore').read() if os.path.exists(p) else None

# ---- sources ----
LRB="https://www.lrb.co.uk/the-paper/v35/n07/john-lanchester/when-did-you-get-hooked"
NYRB="https://www.nybooks.com/articles/2013/11/07/women-and-thrones/"
NYER="https://www.newyorker.com/magazine/2011/04/11/just-write-it"
RAD="https://sophistry.medium.com/why-grrms-a-song-of-ice-and-fire-is-bad-literature-3ecbf09423db"
RADFEED="https://medium.com/feed/@sophistry"
OT31="https://ordinary-times.com/2011/08/31/whats-really-wrong-with-a-song-of-ice-and-fire/"
OT08="https://ordinary-times.com/2011/08/08/review-a-dance-with-dragons-by-george-r-r-martin/"
ROS="http://thinkprogress.org/alyssa/2011/07/15/270611/on-a-dance-with-dragons/"
DOY="https://tigerbeatdown.com/2011/08/26/enter-ye-myne-mystic-world-of-gayng-raype-what-the-r-stands-for-in-george-r-r-martin/"
BB14="https://astrofella.wordpress.com/2014/03/31/some-notes-on-george-rr-martins-prose-style/"
BB13="https://astrofella.wordpress.com/2013/03/08/george-rr-martins-prose-style-affixes-compound-and-combination-words/"
ERST="https://theerstwhilephilistine.wordpress.com/2012/03/21/the-literary-crimes-of-george-r-r-martin/"
CAR="https://dadecariaga.blogspot.com/2011/09/george-rr-martin-american-tolkien.html"
T11="https://time.com/archive/6911691/george-r-r-martins-dance-with-dragons-a-masterpiece-worthy-of-tolkien/"
NPR="https://www.npr.org/2011/07/11/137652436/r-r-martins-sardonic-epic-for-an-ambivalent-age"
T05="https://content.time.com/time/subscriber/article/0,33009,1129596,00.html"
KIRK="https://www.kirkusreviews.com/book-reviews/george-rr-martin/dance-dragons/"
WAPO="https://www.washingtonpost.com/entertainment/books/book-review-george-rr-martins-a-dance-with-dragons/2011/06/20/gIQAuJ1z9H_story.html"
LEV="http://paullevinson.blogspot.com/2011/03/game-of-thrones-my-fall-2006-review-of.html"
PW="https://www.publishersweekly.com/978-0-553-10354-0"
HILL="https://matthilliard.wordpress.com/2010/08/14/a-song-of-ice-and-fire-by-george-r-r-martin/"
EDIT="https://www.editorialdepartment.com/a-game-of-thrones/"
SFF="https://sff180.com/reviews/m/martin_george_rr/dance_with_dragons.html"
NR="https://www.nationalreview.com/2021/08/25-years-on-a-mixed-legacy-for-a-game-of-thrones/"
BURT="https://strangehorizons.com/wordpress/non-fiction/fantasy-a-short-history-by-adam-roberts/"
SAL="https://www.salon.com/2011/07/10/a_dance_with_dragons/"
SLATE="https://slate.com/culture/2011/07/first-reviews-of-george-r-r-martin-s-dance-with-dragons.html"
BKM="https://bookmarks.reviews/the-first-reviews-of-george-r-r-martins-a-game-of-thrones/"
BKB="https://www.bookbrowse.com/bb_briefs/detail/index.cfm/ezine_preview_number/6550/a-dance-with-dragons"
CHU="https://antipodes.substack.com/p/the-tragedy-of-george-r-r-martin"
PUNK="https://punkadiddle.blogspot.com/search?q=Martin+Thrones"
BRS="https://brsbkblog.blogspot.com/2014/10/sibilant-fricative-review.html"
FIN="https://journal.finfar.org/articles/book-review-george-r-r-martin-and-the-fantasy-form/"
KSUB="https://diabolical.substack.com/p/review-a-dance-with-dragons-by-george"
OTDAY="https://ordinary-times.com/2011/08/31/"

S=lambda a,b: f"{a}, {b}"
srcLAN="John Lanchester, 'When did you get hooked?', London Review of Books v35 n7, 11 Apr 2013"
srcMEN="Daniel Mendelsohn, 'The Women and the Thrones', New York Review of Books, 7 Nov 2013 issue"
srcMIL="Laura Miller, 'Just Write It!', The New Yorker, 11 Apr 2011"
srcRAD="Jarosława Radowski (@sophistry), 'Why GRRM's A Song of Ice and Fire is Bad Literature', Medium, 6 Mar 2021 (full text read from the Medium RSS feed)"
srcOT31="Ryan B. (guest), 'What's Really Wrong with A Song of Ice and Fire', Ordinary Times, 31 Aug 2011"
srcOT08="Erik Kain, 'Review: A Dance with Dragons', Ordinary Times, 8 Aug 2011"
srcROS="Alyssa Rosenberg, 'On A Dance With Dragons', ThinkProgress, 15 Jul 2011 (read via Wayback)"
srcDOY="Sady Doyle, 'Enter Ye Myne Mystic World of Gayng-Raype', Tiger Beatdown, 26 Aug 2011"
srcBB14="Simon (Books & Boots), 'Some notes on George RR Martin's prose style', 31 Mar 2014"
srcBB13="Simon (Books & Boots), 'George RR Martin's prose style – Affixes, compound and combination words', 8 Mar 2013"
srcERST="Asher Gelzer-Govatos, 'The Literary Crimes of George R.R. Martin', The Erstwhile Philistine, 21 Mar 2012"
srcCAR="Dade Cariaga, 'George RR Martin: American Tolkien?', 19 Sep 2011"
srcT11="Lev Grossman, 'A Dance with Dragons: A Masterpiece Worthy of Tolkien', Time, 7 Jul 2011"
srcNPR="Lev Grossman, 'G.R.R. Martin's Complex Epic for an Ambivalent Age', NPR, 7 Jul 2011"
srcT05="Lev Grossman, 'The American Tolkien', Time, 13 Nov 2005"
srcKIRK="Kirkus Reviews, 'A Dance with Dragons', 26 Sep 2011"
srcWAPO="Bill Sheehan, 'A Dance with Dragons worth the long long wait', Washington Post, 12 Jul 2011 (read via Wayback)"
srcLEV="Paul Levinson, review of A Game of Thrones, Tangent #16, Fall 1996 (author's 2011 repost)"
srcPW="Publishers Weekly, review of A Game of Thrones, 29 Jul 1996"
srcHILL="Matt Hilliard, 'A Song of Ice and Fire 1–4', Yet There Are Statues, 14 Aug 2010"
srcEDIT="Shannon Roberts, 'Reviewing A Game of Thrones: a first-50 review', The Editorial Department (20th-anniversary piece; page stamped 2024-01-07)"
srcSFF="Thomas M. Wagner, SFF180 review of A Dance with Dragons (undated, c. 2011)"
srcNR="Nicholas Pompella, '25 Years On, a Mixed Legacy for A Game of Thrones', National Review, 7 Aug 2021 (read via Wayback)"
srcBURT="Stephanie Burt reviewing Adam Roberts, Fantasy: A Short History, Strange Horizons, 2026 (Roberts's judgments as quoted by Burt)"
srcBKM="Bookmarks Reviews roundup of 1996 reviews of A Game of Thrones (quoting John H. Riskind, Washington Post, 28 Jul 1996)"
srcBKB="BookBrowse review roundup for A Dance with Dragons (quoting Dana Jennings, New York Times, Jul 2011), read via Wayback"
srcCHU="Michael O. Church, 'The Tragedy of George R. R. Martin', Substack, 19 Jun 2025"

# (feature, claim, source, url, quote, rawfile)
C=[
# Lanchester
("point-of-view rotation","The books tell the story by hopping between a large repertory company of viewpoint characters spread across Westeros, most of them afraid for their lives.",srcLAN,LRB,"hopping about from person to person across the wide geography","lrb-lanchester"),
("killing viewpoint characters","Martin kills off central characters who are richly imagined, three-dimensional portraits, which most writers could not bear to lose.",srcLAN,LRB,"richly imagined, textured, three-dimensional portraits of central characters","lrb-lanchester"),
("late-series pacing","Narrative momentum slows in books four and five, which become leisurely and expansive with overlapping, simultaneous storylines.",srcLAN,LRB,"the narrative momentum of the series has slowed","lrb-lanchester"),
("world texture","The appeal rests on the depth, texture and thoroughness of the imagined world and the range of imaginative sympathy across a large cast.",srcLAN,LRB,"depth and texture and profoundly satisfying thoroughness","lrb-lanchester"),
("viewpoint stakes at chapter end","The Bran defenestration lands harder in the book than on screen because Bran has already been established as a viewpoint character.",srcLAN,LRB,"even more of an impact, perhaps","lrb-lanchester"),
("absence of sentence-level judgment","Lanchester's 4,617-word essay contains no verdict on Martin's diction, sentence rhythm or dialogue; its praise is entirely structural (unpredictability, instability, the seasons as economic metaphor), and the LRB now serves the full text without a paywall.",srcLAN,LRB,"","lrb-lanchester"),
# Mendelsohn
("one narrator per chapter (Rashomon effect)","Each chapter is narrated by a different character, so the reader's view of any character is partial, biased or wrong and must be revised as the tale evolves.",srcMEN,NYRB,"each chapter is narrated by a different character","nyrb"),
("fragmentation mirrors theme","The fragmented viewpoint storytelling mirrors the theme of power fragmenting societies and individuals.",srcMEN,NYRB,"This fragmentation in the storytelling nicely mirrors Martin’s larger theme","nyrb"),
("compound coinages","Martin replaces standard English with compound coinages such as 'sellsword' for mercenary and 'holdfast' for fort.",srcMEN,NYRB,"the compound coinages that replace standard English","nyrb"),
("quasi-medieval diction and spellings","The diction and the spellings of names are ingeniously quasi-medieval.",srcMEN,NYRB,"ingeniously quasi-medieval diction and spellings of names","nyrb"),
("period-noun 'perfumed' vocabulary","Period nouns (destriers, palfreys, vair, samite) give a strong sense of the concrete reality of the world and cannot be rendered on screen.",srcMEN,NYRB,"the perfumed language—the horses called destriers and palfreys","nyrb"),
("Anglo-Saxon milieu vs oriental locales","The narrative alternates distinctly Anglo-Saxon milieus with exotic 'oriental' locales, bearing traces of Scott, Conan Doyle and Costain boys' adventure stories.",srcMEN,NYRB,"the distinctly Anglo-Saxon milieus alternating with exotic “oriental” locales","nyrb"),
("high/low register juxtaposition in dialogue","Tyrion's speech sets 'magnificent' destriers beside 'shit', a pointed mock-medieval deflation of romance that asks the reader to see beyond glitter to gore.",srcMEN,NYRB,"The juxtaposition of “magnificent” and “shit” is pointed","nyrb"),
("descriptive set piece as self-reference","The three-walled description of Qarth (animals, war, sex) reads as a sly reference to the series' own layered decor.",srcMEN,NYRB,"a sly reference to the series itself","nyrb"),
("unsentimental tone","The view of court power is grimly unsentimental and Tacitean, with a tart Thucydidean appreciation of political corruption breeding narrative corruption.",srcMEN,NYRB,"grimly unsentimental, rather Tacitean view","nyrb"),
("ethnographic description","Eastern cultures are rendered with Herodotean gusto (horse-worshipping Dothraki, quasi-Assyrian city-states, Venetian Braavos).",srcMEN,NYRB,"renders the Eastern cultures in particular with Herodotean gusto","nyrb"),
("sex-scene register","The fornication is unsentimental but has a certain imaginative élan (the purple-bearded drunk lapping wine off a wench's breasts).",srcMEN,NYRB,"unsentimental fornication that is not without a certain imaginative élan","nyrb"),
("irreversible consequences","Brutal, irreversible consequences for characters' actions are part of the epic's distinctive tone and feel more 'literary' than any television series.",srcMEN,NYRB,"brutal, irreversible real-life consequences","nyrb"),
("A Feast for Crows misstep","Abandoning the core characters for new ones in the fourth book was a serious misstep; the reviewer took a month because he did not care about the strangers.",srcMEN,NYRB,"I simply didn’t care about these strangers","nyrb"),
("thematic monologue","Cersei's sword-versus-moonblood speech is an arresting echo of the Greek notion that childbirth is for women what war is for men; Martin carries argument in character monologue.",srcMEN,NYRB,"an arresting echo of the Greek notion","nyrb"),
("limits of literary reach","The theological preoccupations do not raise the books to Lord of the Rings' level of parable; the appeal is thematic ambition plus richly satisfying details.",srcMEN,NYRB,"richly satisfying details","nyrb"),
# Miller
("third-person single-viewpoint chapters","Each chapter is narrated in the third person from one character's point of view; eight major viewpoint characters in book one grew to seventeen by A Feast for Crows.",srcMIL,NYER,"Each chapter is narrated in the third person","miller"),
("gardener vs architect (Martin's own words)","Martin calls himself a 'gardener' who has a rough destination but improvises, in contrast to Tolkien the 'architect' who built languages and histories first.",srcMIL,NYER,"he has a rough idea where he’s going but improvises","miller"),
("minimal invented language","Martin fleshes out only as much world as the story needs and has invented only seven words of High Valyrian.",srcMIL,NYER,"I’ve invented seven words of High Valyrian","miller"),
("history over myth, little magic","Martin drew on the Wars of the Roses rather than mythology, used relatively little magic, and the result felt dangerous, lusty and real.",srcMIL,NYER,"it felt dangerous, lusty, and real","miller"),
("rewriting and perfectionism (Martin's own words)","Martin suspects he rewrites too much, ripping one Tyrion chapter out and putting it back for ten years, even trying it as a dream sequence.",srcMIL,NYER,"Maybe I’m rewriting too much","miller"),
("multi-viewpoint chronology","Aligning the chronologies of seventeen viewpoint characters' travel times across two books bedevils the writing.",srcMIL,NYER,"The ‘Dance’ timeline alone is a bitch and a half","miller"),
("continuity errors under fan scrutiny","Fans catch small continuity slips (a horse that changes sex, eyes green then blue) because every line is analysed.",srcMIL,NYER,"People are analyzing every goddam line in these books","miller"),
("intricate racy narrative","The narrative is intricate and racy, practically custom-built for HBO ('The Sopranos in Middle-earth').",srcMIL,NYER,"the book’s intricate, racy narrative","miller"),
("pageantry and colour","Martin's taste for pageantry and colour (his medieval miniature dioramas) carries into the fiction.",srcMIL,NYER,"I like the pageantry and the color","miller"),
("scale of cast","More than a thousand named characters exist by a superfan's count; Martin quotes Tolkien that the tale grew in the telling.",srcMIL,NYER,"The tale grew in the telling","miller"),
# Radowski
("prose inconsistency","The prose is shoddy and inconsistent while also being heavily repetitive.",srcRAD,RAD,"His prose is shoddy and inconsistent","sophistry-grrm"),
("recurring stock phrases","Readers themselves mock recurring formulas such as 'as useless as nipples on a breastplate'.",srcRAD,RAD,"as useless as nipples on a breastplate","sophistry-grrm"),
("dialogue as ostentatious fluff","Dialogue is grandiose and swear-ridden but has little substance; the Darkstar 'I am of the night' exchange is cringeworthy and its symbolism incomprehensible.",srcRAD,RAD,"behind the ostentatious fluff, there’s little substance","sophistry-grrm"),
("expendable detail","Martin is obsessed with expendable details (every feast dish, a character's gynecomastia), which bloats the books.",srcRAD,RAD,"completely obsessed with expendable details","sophistry-grrm"),
("fight-scene pacing and devices","The Oberyn–Mountain duel has no symbolism, metaphor or manipulated time and no build-up to catharsis, only the shock of a hero dying; the stableboy's death is sensational violence.",srcRAD,RAD,"No literary devices such as symbolism, metaphors, even the fucking pacing","sophistry-grrm"),
("refrain in dialogue","The duel's repeated 'You raped her. You murdered her. You killed her children' refrain is reproduced at length as evidence of flat, unbuilt violence.",srcRAD,RAD,"","sophistry-grrm"),
("prose not poetic","The summary verdict is that the prose is not poetic, the dialogue can be childish and the story convoluted.",srcRAD,RAD,"His prose is not poetic, his dialogue can be childish","sophistry-grrm"),
("POV status telegraphs doom","Because viewpoint characters must lack foresight of their fate, POV status itself predicts tribulation and makes the 'anyone can die' twists predictable.",srcRAD,RAD,"readers already expect their POV characters to experience tribulation","sophistry-grrm"),
("perception development vs character development","Jaime's 'arc' is perception development: Martin warps the reader's view via backstory rather than changing the character.",srcRAD,RAD,"What passes off as “character development” is actually “perception development.”","sophistry-grrm"),
("one-dimensional characters","Characters are one-dimensional, focused on singular interests, and sortable into a 'Hall of Tropes' (Patriarch, Ideal Hero, Ax-Crazy).",srcRAD,RAD,"one-dimensional and comically focused on singular interests","sophistry-grrm"),
# Ordinary Times 31 Aug
("viewpoint sympathy (Cersei)","Cersei may be the only viewpoint character who is completely unsympathetic; her POV chapters repeatedly tell rather than show that she would fare better as a man.",srcOT31,OT31,"We are told repeatedly in her POV chapters","ot-0831-ryanb"),
("Eastern cultures and Dany","Dany reads as a white saviour whose errors cost her little, and Drogo as a Noble Savage; the essay is about characterization and politics, not sentence craft.",srcOT31,OT31,"a feminist icon she ain’t","ot-0831-ryanb"),
("overall verdict","The books are great and hold a mirror to our world but suffer from the faults they try to expose.",srcOT31,OT31,"These books are great","ot-0831-ryanb"),
# Kain
("pacing","For a thousand pages almost nothing happens and then there are cliffhangers; the book is too long and painfully slow.",srcOT08,OT08,"It’s too long. It’s painfully slow.","ot-0808"),
("editing","The book feels unedited; a bold editor with a red pen could have cut it by nearly half.",srcOT08,OT08,"A good edit would have slashed this book by nearly half","ot-0808"),
("one-off POV chapters","Single-chapter viewpoint characters feel hobbled by their brevity; Kain wants established characters, not new ones.",srcOT08,OT08,"so hobbled by their brevity","ot-0808"),
("uneven chapters","The book oscillates between excellent Northern chapters and the most boring moments in any fantasy series, with Dany's chapters actively hurting the books.",srcOT08,OT08,"It oscillates wildly between excellent chapters in the North","ot-0808"),
("hearsay as alternative to POV","Most of Dany's events could have been reported as hearsay in other viewpoint characters' chapters and been more interesting.",srcOT08,OT08,"could have been written as hearsay in other POV characters’ chapters","ot-0808"),
("cartoon villain, real victims","Ramsay Bolton is a cartoon villain but his victims are very real and the torture is disturbing as it should be.",srcOT08,OT08,"Ramsay Bolton is a cartoon villain","ot-0808"),
("NYT reviewer's phrasing (Dana Jennings)","Kain quotes and ridicules the New York Times review's opening ('flagons 'n' dragons') while noting it calls Martin 'much better' than Tolkien.",srcOT08,OT08,"flagons ’n’ dragons, and swords ’n’ sorcerers","ot-0808"),
# Rosenberg
("POV accretion","Instead of focusing, book five adds points of view and conflicts, which is exhausting.",srcROS,ROS,"Instead of focusing, the story adds points of view and conflicts","rosenberg"),
("descriptive digression","The book gets tangled in a comparative anthropology of sellsword companies.",srcROS,ROS,"a comparative anthropology of sellsword companies. It’s exhausting","rosenberg"),
("name-punning as repetition device","The constant punning on 'Reek' is irritating but illustrates how constant the reinforcement must be to brainwash oneself into a new identity.",srcROS,ROS,"The constant punning on Reek","rosenberg"),
("villain seen from victim's POV","Ramsay is a cartoon psychopath made effective because he is seen from the perspective of the man he has broken.",srcROS,ROS,"a cartoon psychopath, but a genuinely effective one","rosenberg"),
("naming leitmotif across POVs","Theon, Arya and Tyrion all must forget their names and learn new ones, an identity motif binding separate viewpoints.",srcROS,ROS,"have to forget their names and learn new ones","rosenberg"),
# Doyle
("cliffhanger plotting","The plotty, cliffhangery reversals (dead! alive! dying! a zombie! in disguise!) are conceded as the selling point.",srcDOY,DOY,"the plotty, cliffhangery aspects of Martin’s writing","doyle"),
("mock-archaic register","Doyle parodies the faux-archaic register and unpronounceable invented names in her opening ('yon Good Queen Sady').",srcDOY,DOY,"In days of yore, before the Striding Elves sailed West","doyle"),
("repetition of incident","Arya's plot is a loop of kidnapped/escapes/runs away, and A Clash of Kings is 'The One That Was Really Boring'.",srcDOY,DOY,"She gets kidnapped! She escapes! She runs away!","doyle"),
("orientalised naming","Eastern names are othered against plain Westerosi names like 'Ned', 'Catelyn' and 'Jon'.",srcDOY,DOY,"names like “Pyat,” “Xaro Xhoan,” and “Jhogo,”","doyle"),
("frequency of rape scenes","The essay's core objection is the count of gratuitous rape, molestation and domestic-violence scenes, tallied book by book.",srcDOY,DOY,"TWENTY THOUSAND MILLION GRATUITOUS RAPE","doyle"),
# Books & Boots 2014
("register instability","The style is unstable, veering from functional modern thriller prose to prose larded with fake medievalisms and from an Anglo-Saxon to a Latinate lexicon.",srcBB14,BB14,"veers from purely functional modern thriller prose","bb2014"),
("lucid functional default","The default setting of the style is lucid and functional.",srcBB14,BB14,"The default setting of Martin’s style is lucid and functional","bb2014"),
("Anglo-Saxon diction","Martin consistently chooses Anglo-Saxon words over Latinate ones, giving the prose a cumulative woodiness, antiquity and pithiness.",srcBB14,BB14,"a cumulative feeling of woodiness, antiquity, pithiness","bb2014"),
("archaic mannerisms","'Oft', 'elsewise', 'amongst', 'whilst', 'much and more' and dropped -ly adverbs become annoying pseudo-medieval mannerisms.",srcBB14,BB14,"‘Among’ and ‘while’ become the archaic ‘amongst’ and ‘whilst’","bb2014"),
("distortion naturalised by repetition","Distorted words ('Ser', girls who have 'flowered') start silly but by sheer repetition come to seem natural.",srcBB14,BB14,"by sheer repetition, comes to seem the natural term","bb2014"),
("compound neologisms","Compounds like sellsword, smallfolk, ironborn, greenseer and weirwood are a highly creative and enjoyable aspect of the style.",srcBB14,BB14,"a highly creative and enjoyable aspect of his style","bb2014"),
("terse charged dialogue","Confrontations are done through terse, charged dialogue that delivers real dramatic shock.",srcBB14,BB14,"terse, charged dialogue","bb2014"),
("ambiguous repetition","Repeated 'cool' and 'still' in the Water Gardens passage may be haste or deliberate torpor-evoking repetition.",srcBB14,BB14,"signs of haste, or careful repetitions","bb2014"),
("names as verbal alienation","Names in three registers (near-familiar, alien, exotic) work on a purely verbal level to pull the reader into a parallel universe.",srcBB14,BB14,"the text works on a purely verbal level","bb2014"),
("overall verdict","The style is uneven but often wonderfully powerful and evocative.",srcBB14,BB14,"uneven but often wonderfully powerful and evocative","bb2014"),
# Books & Boots 2013
("Latinate exclusion","The archaic feel comes from the systematic exclusion of almost all Latin-, Greek- and French-derived words.",srcBB13,BB13,"a systematic exclusion from his vocabulary of almost all words","bb2013"),
("Anglo-Saxon affixes","Martin uses almost exclusively English prefixes (un-, be-, a-) and native suffixes (-craft, -dom, -ling, -ward).",srcBB13,BB13,"Martin uses almost exclusively English (i.e. Anglo-Saxon) prefixes","bb2013"),
("compounding as neologism engine","Anglo-Saxon compounding lets Martin coin scores of evocative neologisms (archmaester, bannermen, skinchanger, weirwood).",srcBB13,BB13,"scores of wonderful and evocative neologisms","bb2013"),
("archaic effect from vocabulary","The result is prose that feels archaic; the medieval sense comes from filtered vocabulary, not stock phrases.",srcBB13,BB13,"The result is to make his prose feel archaic","bb2013"),
# Erstwhile Philistine
("pretentious archaisms","Martin leans on words he thinks sound archaic and exotic, which in reality sound ridiculous.",srcERST,ERST,"words that I presume he thinks sound archaic and exotic","erstwhile"),
("'jape'","'Jape' for joke is pretentious and a singularly displeasing word.",srcERST,ERST,"Jape, aside from its pretentiousness, is a singularly displeasing word","erstwhile"),
("stock phrase 'mummer's farce'","'Mummer's farce' recurs at least ten times in every book.",srcERST,ERST,"the phrase comes up at least ten times in every book","erstwhile"),
("speech mannerisms","Giving characters speech patterns (Hodor, Reek's rhymes) is admirable but sometimes inexplicable and tedious across chapters.",srcERST,ERST,"sometimes his choices are inexplicable","erstwhile"),
("sex scenes","The sex scenes are particularly dire and obviously extraneous.",srcERST,ERST,"Martin’s scenes are particularly dire","erstwhile"),
("prose as ceiling","The prose is what holds Martin back from being a truly great author despite strong storytelling.",srcERST,ERST,"his prose holds him back from being a truly great author","erstwhile"),
# Cariaga
("sensory description","Martin has a knack for vivid, sometimes hallucinogenic description and builds textured scenes of sounds, smells and tastes.",srcCAR,CAR,"textured scenes full of sounds and smells and tastes","cariaga"),
("pulp","For all its vividness the work is pulp with no moral and no depth beneath the diversion.",srcCAR,CAR,"But he writes pulp","cariaga"),
("improvisation","Each new wonder carries a strong whiff of making-it-up-as-he-goes.",srcCAR,CAR,"a strong whiff of making-it-up-as-he-goes","cariaga"),
# Grossman 2011 Time
("deft prose","Watching the HBO series forgoes the great pleasure of Martin's deft prose.",srcT11,T11,"the great pleasure of Martin's deft prose","time2011wb"),
("character leitmotifs","Like Wagner, Martin gives each character recurring leitmotif phrases in their streams of thought ('You know nothing, Jon Snow', 'If I look back I am lost').",srcT11,T11,"Like Wagner, he gives each of his characters leitmotifs","time2011wb"),
("distinct voice per storyline","Eleven major storylines each have their own rhythm and are written in their own voice, playing off one another.",srcT11,T11,"each with its own rhythm, written in its own voice","time2011wb"),
("narrative craft over literary prestige","Martin will never win a Pulitzer but his skill as a crafter of narrative exceeds almost any literary novelist's.",srcT11,T11,"his skill as a crafter of narrative exceeds","time2011wb"),
("improvement over the series","After five volumes Martin is a better writer than when he started.",srcT11,T11,"a better writer than when he started","time2011wb"),
("no stock characters","There is no stock character or cardboard village; every person, wood and street corner has its own tale.",srcT11,T11,"no such thing as a stock character or a cardboard village","time2011wb"),
# Grossman NPR
("sardonic tone","The series is an epic for a more profane, sardonic, ambivalent age than Tolkien's.",srcNPR,NPR,"a more profane, more sardonic, more ambivalent age","npr"),
("literal dwarf, not Gimli","Tyrion is an actual dwarf, a joke to passers-by, not a hearty axe-wielding fantasy dwarf.",srcNPR,NPR,"Tyrion is an actual dwarf","npr"),
# Grossman 2005
("plotting","Martin is a tense, surging, insomnia-inflicting plotter.",srcT05,T05,"a tense, surging, insomnia-inflicting plotter","time2005"),
("characterization","Martin is a deft and inexhaustible sketcher of personalities.",srcT05,T05,"a deft and inexhaustible sketcher of personalities","time2005"),
("multi-angle narration","Martin shoots the action from many angles with a dozen narrators to reflect its many-sided nature.",srcT05,T05,"shoots the action from many angles, with a dozen narrators","time2005"),
("grit","It is men and women slugging it out in the muck for money, power, lust and love, not elves against orcs.",srcT05,T05,"men and women slugging it out in the muck","time2005"),
("moral complexity vs Tolkien","Tolkien has imaginative force but one must go elsewhere for moral complexity; Martin's wars are multifaceted and ambiguous.",srcT05,T05,"you have to go elsewhere for moral complexity","time2005"),
# Kirkus 2011
("ponderousness and bodily functions","Tolkien was never so ponderous nor so obsessed with bodily functions (the Grand Maester befouling himself).",srcKIRK,KIRK,"Tolkien was never quite so ponderous","kirkus2011"),
("tone","Book five is cynical, dark, with few laughs and not much action, mostly exposition.",srcKIRK,KIRK,"a little cynical, plenty dark, with not many laughs","kirkus2011"),
("introspective viewpoint","Jon Snow's chapters go 'all Hamlety', soliciting input and keeping his own counsel.",srcKIRK,KIRK,"comes over all Hamlety, wondering what to do","kirkus2011"),
("authorial fatigue","On the evidence one wonders whether Martin is getting tired of the series.",srcKIRK,KIRK,"one wonders if Martin isn’t getting a little tired","kirkus2011"),
# Sheehan WaPo
("shifting perspectives","The series is told through an array of constantly shifting perspectives across many locales.",srcWAPO,WAPO,"an array of constantly shifting perspectives","wapo2011"),
("set pieces","Vividly rendered set pieces, cliffhangers and appalling cruelty make it epic fantasy as it should be written.",srcWAPO,WAPO,"passionate, compelling, convincingly detailed and thoroughly imagined","wapo2011"),
("grounded medieval realism","The book feels grounded in brutal medieval reality, closer to the Wars of the Roses than to Lord of the Rings.",srcWAPO,WAPO,"grounded in the brutal reality of medieval times","wapo2011"),
("motto repetition","Characters repeatedly remind the reader that 'Winter is coming'.",srcWAPO,WAPO,"as the characters repeatedly remind us","wapo2011"),
# Levinson 1996
("sensory concreteness","Martin writes as convincingly of tart apple juice as of mountain sleet; the book is an adventure of the senses.",srcLEV,LEV,"tart juices oozing from an apple as of sleet","levinson"),
("descriptive passages","The descriptive passages are marvellous; you can smell the spice and taste every cup of wine.",srcLEV,LEV,"you can smell the spice","levinson"),
# PW 1996
("accomplished prose","The 1996 trade review credits superbly developed characters and accomplished prose.",srcPW,PW,"superbly developed characters, accomplished prose","pw1996"),
# Hilliard
("no progression","Across four books there is no development, progression or climax; the plot is like banging unrelated chords on a piano.",srcHILL,HILL,"banging an endless series of chords","hilliard"),
("social rather than physical landscape","Martin's world is a social landscape built from people rather than physical description.",srcHILL,HILL,"he has constructed a social landscape","hilliard"),
("intrigue over elevated prose","The series' approach emphasised intrigue and realism over magic and elevated prose.",srcHILL,HILL,"intrigue and realism over magic and elevated prose","hilliard"),
# Editorial Department
("titled viewpoint chapters","Naming each chapter for its viewpoint character solves the confusion that shifting POV can cause.",srcEDIT,EDIT,"a clearly titled chapter solves the problem admirably","editdept2"),
("opening pace","A swift pace and plenty of action introduce three conflicts within the first fifty pages.",srcEDIT,EDIT,"a swift pace and plenty of action","editdept2"),
("restrained magic","Keeping magic to small, measured doses maintains suspense.",srcEDIT,EDIT,"keeping the magic to small, measured doses","editdept2"),
# SFF180
("chapters as short stories","Individual chapters are good enough to stand as award-worthy short stories.",srcSFF,SFF,"good enough to function on their own as award-worthy short stories",None),
("out-of-order composition","Martin writes chapters out of order and sequences them later, like a film editor.",srcSFF,SFF,"he writes chapters out of order, and then sequences them later",None),
("craft standard","The writing never falls below the highest standards of literary craft.",srcSFF,SFF,"the highest standards of literary craft",None),
# National Review
("detailed realism of prose","Martin's uncanny prose style contains a detailed realism that brings Tyrion to life on the page.",srcNR,NR,"Martin’s uncanny prose style contains a detailed realism","natrev"),
("politics to the exclusion of all else","The book is coarsely obsessed with politics to the exclusion of almost everything but sex and violence.",srcNR,NR,"coarsely obsessed with politics","natrev"),
("fantasy as window dressing","The fantasy trappings dress a bloated Agatha Christie whodunit plotline that goes nowhere.",srcNR,NR,"a type of bloated Agatha Christie plotline","natrev"),
("predictability via cynicism","The book becomes predictable once the reader reads every event through cynical Machiavellianism.",srcNR,NR,"the book becomes predictable as the reader grows accustomed","natrev"),
# Burt on Roberts
("chivalric cake (Roberts via Burt)","Adam Roberts's Fantasy: A Short History says Martin lets readers have their chivalric cake and eat it too, thrilling at poisonings, rapes and betrayals while enamoured of noble houses and titles; no sentence-level prose judgment is reported.",srcBURT,BURT,"have their chivalric cake and eat it too","burt"),
# Bookmarks quoting Riskind 1996
("1996 Washington Post dissent","The Washington Post's 1996 review faulted one-dimensional characters and less than memorable imagery.",srcBKM,BKM,"one-dimensional characters and less than memorable imagery","bookmarks"),
# BookBrowse quoting Jennings
("serial cliffhanger structure (NYT)","Dana Jennings's Times review says the book, like all proper serials, gives no emotional respite and ends on razor-sharp question marks.",srcBKB,BKB,"ending with several razor-sharp question marks","bookbrowse-wb"),
# Church
("commercial prose grade","Martin's writing is well above average for commercial prose, but he is not a seven-drafts literary reviser.",srcCHU,CHU,"well above average for commercial prose","church"),
]

# ---- verify ----
fail=0
for f,cl,src,url,q,rf in C:
    if q:
        n=len(q.split())
        if n>11: print('TOO LONG',n,q); fail+=1
        if rf:
            t=raw(rf)
            if t is None: print('NO RAW',rf); fail+=1
            elif q not in t: print('NOT FOUND in',rf,':',q); fail+=1
print('claims',len(C),'failures',fail)

sources=[
 ("John Lanchester, 'When did you get hooked?' (LRB v35 n7, 11 Apr 2013)",LRB,"magazine essay (general-interest, long-form)",True),
 ("Daniel Mendelsohn, 'The Women and the Thrones' (NYRB, 7 Nov 2013 issue)",NYRB,"review-essay (general-interest, long-form)",True),
 ("Laura Miller, 'Just Write It!' (New Yorker, 11 Apr 2011; read via Wayback)",NYER,"magazine profile with author interview",True),
 ("Jarosława Radowski, 'Why GRRM's A Song of Ice and Fire is Bad Literature' (Medium, 6 Mar 2021; full text via RSS feed)",RAD,"hostile long-form blog essay",True),
 ("Medium RSS feed for @sophistry (carrier of the Radowski full text)",RADFEED,"RSS feed",False),
 ("Ryan B., 'What's Really Wrong with A Song of Ice and Fire' (Ordinary Times, 31 Aug 2011)",OT31,"blog essay (guest post)",True),
 ("Ordinary Times day archive for 31 Aug 2011 (used to locate the post)",OTDAY,"archive index page",False),
 ("Erik Kain, 'Review: A Dance with Dragons' (Ordinary Times, 8 Aug 2011)",OT08,"blog review",True),
 ("Erik Kain's 2021 Substack repost of the same review (duplicate)",KSUB,"blog repost",False),
 ("Alyssa Rosenberg, 'On A Dance With Dragons' (ThinkProgress, 15 Jul 2011; read via Wayback)",ROS,"blog review",True),
 ("Sady Doyle, 'Enter Ye Myne Mystic World of Gayng-Raype' (Tiger Beatdown, 26 Aug 2011)",DOY,"hostile long-form blog essay",True),
 ("Simon, 'Some notes on George RR Martin's prose style' (Books & Boots, 31 Mar 2014)",BB14,"blog essay, sentence-level stylistics",True),
 ("Simon, 'George RR Martin's prose style – Affixes, compound and combination words' (Books & Boots, 8 Mar 2013)",BB13,"blog essay, sentence-level stylistics",True),
 ("Asher Gelzer-Govatos, 'The Literary Crimes of George R.R. Martin' (The Erstwhile Philistine, 21 Mar 2012)",ERST,"hostile blog essay",True),
 ("Dade Cariaga, 'George RR Martin: American Tolkien?' (blog, 19 Sep 2011)",CAR,"blog essay",True),
 ("Lev Grossman, 'A Masterpiece Worthy of Tolkien' (Time, 7 Jul 2011; verified via Wayback of content.time.com)",T11,"magazine review",True),
 ("Lev Grossman, 'Complex Epic for an Ambivalent Age' (NPR, 7 Jul 2011)",NPR,"radio review transcript",True),
 ("Lev Grossman, 'The American Tolkien' (Time, 13 Nov 2005)",T05,"magazine review",True),
 ("Kirkus Reviews, A Dance with Dragons (26 Sep 2011)",KIRK,"trade review",True),
 ("Bill Sheehan, 'A Dance with Dragons worth the long long wait' (Washington Post, 12 Jul 2011; read via Wayback)",WAPO,"newspaper review",True),
 ("Paul Levinson, review of A Game of Thrones (Tangent #16, Fall 1996; 2011 repost)",LEV,"1996 genre-magazine review",True),
 ("Publishers Weekly, A Game of Thrones (29 Jul 1996)",PW,"trade review",True),
 ("Matt Hilliard, 'A Song of Ice and Fire 1–4' (Yet There Are Statues, 14 Aug 2010)",HILL,"blog review",True),
 ("Shannon Roberts, 'Reviewing A Game of Thrones' (The Editorial Department)",EDIT,"editorial-craft review of the first 50 pages",True),
 ("Thomas M. Wagner, SFF180 review of A Dance with Dragons (WebFetch only; direct curl blocked)",SFF,"genre review site",True),
 ("Nicholas Pompella, '25 Years On, a Mixed Legacy for A Game of Thrones' (National Review, 7 Aug 2021; read via Wayback)",NR,"magazine essay (general-interest)",True),
 ("Stephanie Burt, review of Adam Roberts's Fantasy: A Short History (Strange Horizons, 2026)",BURT,"review of a critical book (secondary for Roberts)",True),
 ("Andrew Leonard, 'Return of the new fantasy king' (Salon, 10 Jul 2011)",SAL,"magazine review — no prose-level claims",False),
 ("Nina Shen Rastogi, 'First Reviews of A Dance with Dragons' (Slate, 7 Jul 2011)",SLATE,"aggregator",False),
 ("Bookmarks Reviews, 'The Original Reviews of A Game of Thrones' (roundup of 1996 reviews)",BKM,"aggregator quoting primaries",True),
 ("BookBrowse review roundup for A Dance with Dragons (read via Wayback)",BKB,"aggregator quoting NYT/Jennings",True),
 ("Michael O. Church, 'The Tragedy of George R. R. Martin' (Substack, 19 Jun 2025)",CHU,"blog essay — about publishing pressure, one prose grade",True),
 ("Punkadiddle (Adam Roberts's blog) search for Martin/Thrones — 'No posts matching'",PUNK,"blog search page",False),
 ("BRSBKBLOG review of Roberts's Sibilant Fricative (contents list; no Martin)",BRS,"book review",False),
 ("C. Palmer-Patel, review of J. R. Young's George R. R. Martin and the Fantasy Form (Fafnir)",FIN,"academic book review — no prose claims",False),
]
out={"claims":[{"feature":f,"claim":cl,"source":src,"url":url,"quote":q} for f,cl,src,url,q,rf in C],
     "sourcesRead":[{"title":a,"url":b,"kind":c,"substantive":d} for a,b,c,d in sources]}
if fail==0:
    json.dump(out,open('found-martin-longform.json','w'),ensure_ascii=False,indent=1)
    print('WROTE found-martin-longform.json', os.path.getsize('found-martin-longform.json'),'bytes; sources',len(sources))
else:
    print('NOT WRITTEN — fix failures')
