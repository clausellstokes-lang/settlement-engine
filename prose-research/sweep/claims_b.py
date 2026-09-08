# -*- coding: utf-8 -*-
from build import *
RAW="raw curl with browser user agent"
WB="Wayback raw capture (web.archive.org /<ts>id_/)"

# --- 8. New Statesman interview
u="https://www.newstatesman.com/long-reads/2018/07/robin-hobb-changing-cultures-writing-about-violence-and-anonymity-living-farm"
S("Robin Hobb on changing cultures, writing about violence, and the anonymity of living on a farm, by Pauline Bock (New Statesman)",u,"own-words",True,"2018-07-27",WB)
C("other: violence and its consequence",
  "Hobb, quoted by the reporter, says she tries to express how horrifying and ugly violence is, and says depictions that make violence beautiful or satisfying make her uncomfortable as a reader.",
  "Robin Hobb, quoted by Pauline Bock, New Statesman, 27 July 2018 (interviewed at Imaginales, May 2018)",u,
  "I try to express how horrifying and ugly violence is",
  page="paragraph beginning 'Like Game of Thrones'",kind="own-words",polarity="asserts",date="2018-07-27",
  routeHint=WB,registerHint="chronicle-line",confidence="high")
C("naming and forms of address",
  "The reporter observes that in Hobb's world names can embody a character's virtues, listing the brothers Chivalry, Nimble, Swift, Steady, Just and Hearth.",
  "Pauline Bock (reporter's paraphrase), New Statesman, 27 July 2018",u,
  "names can embody a character’s virtues",
  page="paragraph beginning 'In Hobb’s Elderlings universe, names matter'",kind="analysis",polarity="asserts",date="2018-07-27",
  routeHint=WB,registerHint="dossier-archivist",confidence="high")
C("consequence on a household",
  "The reporter describes the captain Kyle Haven as a name that reflects poorly on its bearer, whose greed creates endless trouble for his ship and his family's business.",
  "Pauline Bock (reporter's paraphrase), New Statesman, 27 July 2018",u,
  "whose greediness creates endless troubles for his ship and family’s business",
  page="paragraph beginning 'In Hobb’s Elderlings universe, names matter'",kind="analysis",polarity="asserts",date="2018-07-27",
  routeHint=WB,registerHint="dossier-archivist",confidence="high")
C("place and institution description",
  "The reporter characterises the Elderlings societies by their institutions in a single clause each, calling Bingtown matriarchal and business-oriented against the macho warring state of Chalced.",
  "Pauline Bock (reporter's paraphrase), New Statesman, 27 July 2018",u,
  "the matriarchal, business-oriented Bingtown",
  page="paragraph beginning 'Her books tell tales of dragons and pirates'",kind="analysis",polarity="asserts",date="2018-07-27",
  routeHint=WB,registerHint="dossier-archivist",confidence="high")
C("consequence on a household",
  "Hobb, quoted by the reporter, reads Keffria Vestrit's ceding of decisions to her husband as a rule about power: power not exercised is lost.",
  "Robin Hobb, quoted by Pauline Bock, New Statesman, 27 July 2018",u,
  "if you do not exercise your power, it goes away",
  page="paragraph beginning 'The Elderlings books never ignore women’s stories'",kind="own-words",polarity="asserts",date="2018-07-27",
  routeHint=WB,registerHint="dossier-archivist",confidence="high")

# --- 9. The Arched Doorway interview (transcript)
u="https://archeddoorway.com/2014/11/24/robin-hobb-interview/"
S("My interview with Robin Hobb, by Rebecca Lovatt (The Arched Doorway), transcript of an SFContario interview",u,"own-words",True,"2014-11-24",WB)
C("place and institution description",
  "Hobb says setting is a third element the fantasy writer must supply that mainstream writers need not, contrasting a 1970s Chevrolet, which arrives with its own impact, against a horse and cart whose condition she must establish with detail.",
  "Robin Hobb, interviewed by Rebecca Lovatt, The Arched Doorway, 24 November 2014 (transcript)",u,
  "I need to put in enough detail that the reader picks that up",
  page="answer to the question on the fantasy genre expanding",kind="own-words",polarity="asserts",date="2014-11-24",
  routeHint=WB,registerHint="dossier-archivist",confidence="high")
C("plainness and economy",
  "Hobb says she admires the fantasy writers of the earlier paperback generation because every sentence in their work carries character development, setting and plot at once.",
  "Robin Hobb, interviewed by Rebecca Lovatt, The Arched Doorway, 24 November 2014 (transcript)",u,
  "every sentence is freighted with character development, and setting, and plot",
  page="answer to the question on the fantasy genre expanding",kind="own-words",polarity="asserts",date="2014-11-24",
  routeHint=WB,registerHint="dossier-archivist",confidence="high")
C("edition and house style",
  "Hobb reports the physical constraint she wrote under early on: she was told a paperback binding would not hold more than 250 pages, and had to tell her story within that number of words and pages.",
  "Robin Hobb, interviewed by Rebecca Lovatt, The Arched Doorway, 24 November 2014 (transcript)",u,
  "a paperback binding would not hold more than 250 pages",
  page="answer to the question on the fantasy genre expanding",kind="own-words",polarity="asserts",date="2014-11-24",
  routeHint=WB,registerHint="none",confidence="high")
C("withheld information and inference",
  "Hobb states the limit of her preferred first person as a rule of disclosure: the narration can tell the reader exactly what the hero knows and no more.",
  "Robin Hobb, interviewed by Rebecca Lovatt, The Arched Doorway, 24 November 2014 (transcript)",u,
  "you can only tell the reader exactly what the hero knows",
  page="answer to 'how do you decide whether a story should be told in first or third-person?'",kind="own-words",polarity="asserts",date="2014-11-24",
  routeHint=WB,registerHint="dossier-archivist",confidence="high")
C("point of view and distance",
  "Hobb describes her third-person practice as a very tight point of view in which any given scene stays inside one character only, never switching mid-conversation.",
  "Robin Hobb, interviewed by Rebecca Lovatt, The Arched Doorway, 24 November 2014 (transcript)",u,
  "in any given scene, you will only be with one character",
  page="answer to 'how do you decide whether a story should be told in first or third-person?'",kind="own-words",polarity="asserts",date="2014-11-24",
  routeHint=WB,registerHint="dossier-archivist",confidence="high")
C("point of view and distance",
  "Hobb calls first person the most intimate voice and likens it to the voice a family uses in the evening or a mother recounting her childhood.",
  "Robin Hobb, interviewed by Rebecca Lovatt, The Arched Doorway, 24 November 2014 (transcript)",u,
  "It is the most intimate voice",
  page="answer to 'how do you decide whether a story should be told in first or third-person?'",kind="own-words",polarity="asserts",date="2014-11-24",
  routeHint=WB,registerHint="dossier-archivist",confidence="high")
C("humour",
  "Hobb says that fantasy full of pratfalls and silliness is fun but lessens the impact felt when a character is hurt or disappointed.",
  "Robin Hobb, interviewed by Rebecca Lovatt, The Arched Doorway, 24 November 2014 (transcript)",u,
  "it lessens the impact that you feel if the character is hurt",
  page="answer on her influences",kind="own-words",polarity="asserts",date="2014-11-24",
  routeHint=WB,registerHint="none",confidence="high")
C("withheld information and inference",
  "Hobb says she planted clues at the end of the Tawny Man trilogy that only readers attending to every detail of the book would have picked up as signalling more story to come.",
  "Robin Hobb, interviewed by Rebecca Lovatt, The Arched Doorway, 24 November 2014 (transcript)",u,
  "readers who were really reading every detail of the book",
  page="answer to 'Did you know you’d be coming back all these years later'",kind="own-words",polarity="asserts",date="2014-11-24",
  routeHint=WB,registerHint="none",confidence="high")

# --- 10. Fantasy-Faction Liveship
u="https://fantasy-faction.com/2014/the-liveship-traders-series-by-robin-hobb-no-spoilers"
S("The Liveship Traders Series by Robin Hobb (no spoilers), by Lew Kelly (Fantasy-Faction)",u,"analysis",True,"2014-08-19",RAW)
C("adjective and adverb discipline",
  "Reviewer Lew Kelly charges Hobb with an overreliance on adverbs in Ship of Magic, saying it stunts the novel's flow.",
  "Lew Kelly, Fantasy-Faction, 19 August 2014",u,
  "Her overreliance on adverbs often stunts the novel’s flow",
  page="paragraph beginning 'The opening of the novel'",kind="analysis",polarity="disputes",date="2014-08-19",
  routeHint=RAW,registerHint="none",confidence="high")
C("consequence on a household",
  "Kelly describes The Mad Ship as tracking a household and a city together: as the Vestrits' domestic situation worsens, so does the political situation in Bingtown.",
  "Lew Kelly, Fantasy-Faction, 19 August 2014",u,
  "As their domestic situation worsens, so does the political situation",
  page="paragraph on The Mad Ship",kind="analysis",polarity="asserts",date="2014-08-19",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("consequence on a household",
  "Kelly names morality as the trilogy's major theme and states its recurring form as a household choice between the morally correct action and the profitable one.",
  "Lew Kelly, Fantasy-Faction, 19 August 2014",u,
  "a choice between a morally correct action or a profitable one",
  page="paragraph beginning 'Hobb’s major theme in the trilogy is morality'",kind="analysis",polarity="asserts",date="2014-08-19",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("point of view and distance",
  "Kelly argues Hobb's prose is at its best inside a single character's head, and that the many shifting Liveship viewpoints leave the characters feeling distanced and harder to empathise with.",
  "Lew Kelly, Fantasy-Faction, 19 August 2014",u,
  "her talent truly shines when she’s deep inside a characters head",
  page="paragraph beginning 'The opening of the novel'",kind="analysis",polarity="asserts",date="2014-08-19",
  routeHint=RAW,registerHint="none",confidence="high")

# --- 11. HearWriteNow
u="https://hearwritenow.com/reviews/fantasy/liveship/"
S("The Liveship Traders Trilogy – Robin Hobb – Review (HearWriteNow)",u,"analysis",True,None,RAW)
C("other: exposition without explanation",
  "The reviewer credits Hobb with conveying a great deal of historical, societal and environmental information through characters who each know different aspects of the same events, without it sounding explanatory.",
  "HearWriteNow blog review of The Liveship Traders",u,
  "without it sounding explanatory",
  page="section 'The Liveship Traders', third paragraph",kind="analysis",polarity="asserts",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("point of view and distance",
  "The reviewer notes that the Liveship Traders trilogy keeps its multiple viewpoints professionally contained to one viewpoint per scene.",
  "HearWriteNow blog review of The Liveship Traders",u,
  "professionally contained to one viewpoint per scene",
  page="section 'The Liveship Traders', first paragraph",kind="analysis",polarity="asserts",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("point of view and distance",
  "The reviewer counts the cost of the multiple viewpoints: the reader does not stay in one character's head long enough to form a bond, so the intensity of the first-person Farseer books is lost.",
  "HearWriteNow blog review of The Liveship Traders",u,
  "The reader doesn’t get to stay in one character’s head long enough",
  page="section 'The Liveship Traders', fourth paragraph",kind="analysis",polarity="asserts",
  routeHint=RAW,registerHint="none",confidence="high")

# --- 12. Dragonsteel Books
u="https://www.dragonsteelbooks.com/blogs/the-cognitive-realm/robin-hobb-writing-villians"
S("Robin Hobb's Writing Advice: 3 Tips for Crafting Your Villain, by Tayan Hatch (Dragonsteel Books, The Cognitive Realm)",u,"own-words",True,"2024-12-19",RAW)
C("per-speaker register",
  "Hobb, quoted at Dragonsteel Nexus, describes writing an antagonist as putting on a coat and adopting the character's whole belief system.",
  "Robin Hobb, quoted by Tayan Hatch, Dragonsteel Books, 19 December 2024",u,
  "You have to put it on like a coat",
  page="section 'Now I Believe Everything You Believe'",kind="own-words",polarity="asserts",date="2024-12-19",
  routeHint=RAW,registerHint="none",confidence="high")
C("other: antagonist motivation",
  "Hobb, quoted at Dragonsteel Nexus, says an antagonist simply has something they want done that matters more to them than what the protagonist wants.",
  "Robin Hobb, quoted by Tayan Hatch, Dragonsteel Books, 19 December 2024",u,
  "They simply have something they want to get done",
  page="section 'Now I Believe Everything You Believe'",kind="own-words",polarity="asserts",date="2024-12-19",
  routeHint=RAW,registerHint="none",confidence="high")

# --- 13. lexlingua LiveJournal
u="https://lexlingua.livejournal.com/33522.html"
S("Book Review: The Liveship Traders by Robin Hobb (lexlingua, LiveJournal)",u,"reader",True,"2012-06-13",RAW)
C("consequence on a household",
  "The reviewer lists among the trilogy's plot lines a family's debt being repaid by marrying a daughter to a Rain Wilds suitor.",
  "lexlingua, LiveJournal review, 13 June 2012",u,
  "Malta is to be married off to a Rain Wilds fellow as debt repayment",
  page="paragraph beginning 'There are numerous plotlines'",kind="reader",polarity="mentions",date="2012-06-13",
  routeHint=RAW,registerHint="dossier-archivist",confidence="medium")
