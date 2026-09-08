# -*- coding: utf-8 -*-
import json, os
PR="https://web.archive.org/web/20140118190325id_/http://www.theparisreview.org/interviews/6253/the-art-of-fiction-no-221-ursula-k-le-guin"
ORW="https://www.ursulakleguin.com/on-rules-of-writing"
S1="https://www.ursulakleguin.com/bvc-navigating-the-ocean-of-story-session-1"
S1C="https://www.ursulakleguin.com/bvc-navigating-the-ocean-of-story-session-1-continued"
S13="https://www.ursulakleguin.com/bvc-navigating-the-ocean-of-story-session-1-part-3"
S15="https://www.ursulakleguin.com/bvc-navigating-the-ocean-of-story-session-1-part-5"
WMS="https://www.ursulakleguin.com/what-makes-a-story"
FEW="https://www.ursulakleguin.com/a-few-words-to-a-young-writer"
STC="https://www.ursulakleguin.com/steering-the-craft"
VQR="https://www.vqronline.org/summer-2018/interviews-columns/imaginative-reality-ursula-k-le-guin"

WB="Wayback raw capture (web/<ts>id_/) via curl with a browser user agent; WebFetch is blocked for web.archive.org"
DIRECT="direct fetch (curl, browser user agent), HTML stripped to text"

sources=[]
claims=[]
def S(title,url,kind,sub,date=None,route=None):
    sources.append({"title":title,"url":url,"kind":kind,"substantive":sub,**({"date":date} if date else {}),**({"route":route} if route else {})})
def C(**kw): claims.append(kw)

S("Ursula K. Le Guin, The Art of Fiction No. 221 (interviewed by John Wray), The Paris Review no. 206",PR,"own-words",True,"2013 (issue 206, Fall 2013); capture 2014-01-18",WB)
S("Ursula K. Le Guin, 'On Rules of Writing, or, Riffing on Rechy' (first published as 'When to Bend, When to Break', Los Angeles Times, 5 Jan 2003), ursulakleguin.com",ORW,"own-words",True,"2003",DIRECT)
S("Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1' (Book View Cafe, 10 Aug 2015), ursulakleguin.com",S1,"own-words",True,"2015-08-10",DIRECT)
S("Ursula K. Le Guin, 'Navigating the Ocean of Story: Session 1, Continued' (Book View Cafe, 24 Aug 2015), ursulakleguin.com",S1C,"own-words",True,"2015-08-24",DIRECT)
S("Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1, Part 3' (Book View Cafe, 2015), ursulakleguin.com",S13,"own-words",True,"2015",DIRECT)
S("Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1, Part 5' (Book View Cafe, 2015), ursulakleguin.com",S15,"own-words",True,"2015",DIRECT)
S("Ursula K. Le Guin, 'What Makes a Story' (c. 2007), ursulakleguin.com",WMS,"own-words",True,"c. 2007",DIRECT)
S("Ursula K. Le Guin, 'A Few Words to a Young Writer' (undated), ursulakleguin.com",FEW,"own-words",True,"undated",DIRECT)
S("Steering the Craft book page, quoting Le Guin's introduction to the 2015 revision, ursulakleguin.com",STC,"own-words",True,"2015 revision",DIRECT)
S("David Naimon, 'The Imaginative Reality of Ursula K. Le Guin', Virginia Quarterly Review 94/2",VQR,"own-words",False,"2018-03-28","BLOCKED: subscription wall on the live page and in every Wayback capture tried (20180401, 20190101, 20260114 id_ raw)")

# --- Paris Review
C(feature="cadence and rhythm",
  claim="Le Guin says the rhythm of a story, however complicated and subtle, is what carries the reader.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="that’s what’s going to carry the reader", page="final section, on economy and rhythm",
  kind="own-words", polarity="asserts", date="2013", routeHint=WB, registerHint="none", confidence="high")
C(feature="plainness and economy",
  claim="Le Guin praises old painters for getting simple in their means because they know they have not got time.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="Just so plain and simple. Because they know they haven’t got time.", page="closing answer",
  kind="own-words", polarity="asserts", date="2013", routeHint=WB, registerHint="dossier-archivist", confidence="high")
C(feature="plainness and economy",
  claim="Le Guin distinguishes the economy she means from minimalism, which she calls a self-conscious mannerist style she cannot write.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="I’m not talking minimalism", page="closing answer",
  kind="own-words", polarity="rejects", date="2013", routeHint=WB, registerHint="dossier-archivist", confidence="high")
C(feature="diction (native vs latinate)",
  claim="Le Guin says that in departing from the heroic fantasy tradition she found a less formal vocabulary and a cadence better suited to what she had to say.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="I found a less formal vocabulary and a cadence better suited", page="answer on the shift toward economy",
  kind="own-words", polarity="asserts", date="2013", routeHint=WB, registerHint="chronicle-line", confidence="high")
C(feature="register modulation",
  claim="Le Guin describes her own career-long change as easing up on the formality of her prose.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="I’ve eased up on the formality of the prose", page="answer on the shift toward economy",
  kind="own-words", polarity="asserts", date="2013", routeHint=WB, registerHint="none", confidence="high")
C(feature="archaism",
  claim="Le Guin names Tolkien, Dunsany, Eddison, MacDonald and Malory as the earlier-generation styles that the language of serious fantasy still rested on in the sixties and seventies.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="", page="answer on the shift toward economy",
  kind="own-words", polarity="mentions", date="2013", routeHint=WB, registerHint="none", confidence="high")
C(feature="plainness and economy",
  claim="Le Guin compares an aging writer's language to old shoes or kitchen gear that no longer needs fancy stuff.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="your language gets like your shoes or your kitchen gear", page="answer on the shift toward economy",
  kind="own-words", polarity="asserts", date="2013", routeHint=WB, registerHint="dossier-archivist", confidence="high")
C(feature="other: style as substance",
  claim="Le Guin says that to her the style is the book, to a large extent.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="To me the style is the book, to a large extent", page="answer on genre prose and Borges",
  kind="own-words", polarity="asserts", date="2013", routeHint=WB, registerHint="none", confidence="high")
C(feature="plainness and economy",
  claim="Le Guin characterises genre writers of her early period as deliberately cultivating an attempt to be styleless, which she treats as a fault rather than a model.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="genre writers deliberately cultivated an attempt to be styleless", page="answer on The Wave in the Mind sentence",
  kind="own-words", polarity="rejects", date="2013", routeHint=WB, registerHint="none", confidence="high")
C(feature="place and institution description",
  claim="Le Guin says that when she creates another world with a society on it she tries to hint at the complexity of that society instead of just referring to an empire.",
  source="Ursula K. Le Guin, interviewed by John Wray, The Paris Review, Art of Fiction No. 221 (2013)",
  url=PR, quote="I try to hint at the complexity of the society I’m creating", page="opening answers, on the social sciences",
  kind="own-words", polarity="asserts", date="2013", routeHint=WB, registerHint="dossier-archivist", confidence="high")

# --- On Rules of Writing
C(feature="place and institution description",
  claim="Le Guin complains that writers taught 'show don't tell' are afraid to describe the world they have invented.",
  source="Ursula K. Le Guin, 'On Rules of Writing, or, Riffing on Rechy' (Los Angeles Times, 2003), ursulakleguin.com",
  url=ORW, quote="They’re afraid to describe the world they’ve invented.", page="third paragraph",
  kind="own-words", polarity="rejects", date="2003", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")
C(feature="point of view and distance",
  claim="Le Guin argues the narrator's voice, often called omniscient, is the most intimate voice of all rather than a distancing one.",
  source="Ursula K. Le Guin, 'On Rules of Writing, or, Riffing on Rechy' (Los Angeles Times, 2003), ursulakleguin.com",
  url=ORW, quote="it’s the most intimate voice of all", page="fourth paragraph",
  kind="own-words", polarity="asserts", date="2003", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")
C(feature="point of view and distance",
  claim="Le Guin defends narrative distance with the phrase that distance lends enchantment.",
  source="Ursula K. Le Guin, 'On Rules of Writing, or, Riffing on Rechy' (Los Angeles Times, 2003), ursulakleguin.com",
  url=ORW, quote="But distance lends enchantment", page="fourth paragraph",
  kind="own-words", polarity="asserts", date="2003", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")
C(feature="point of view and distance",
  claim="Le Guin criticises writers for abandoning the narrative past tense for what she calls the tight-focused, inflexible present tense.",
  source="Ursula K. Le Guin, 'On Rules of Writing, or, Riffing on Rechy' (Los Angeles Times, 2003), ursulakleguin.com",
  url=ORW, quote="", page="fourth paragraph",
  kind="own-words", polarity="rejects", date="2003", routeHint=DIRECT, registerHint="chronicle-line",
  confidence="medium: the quotation is blank because the sentence exceeds twelve words; the limb is a paraphrase of one sentence")

# --- Session 1
C(feature="omission as information",
  claim="Le Guin states flatly that stories are not shown but told.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1' (Book View Cafe, 2015)",
  url=S1, quote="stories are not shown, but told", page="answer to Paige",
  kind="own-words", polarity="asserts", date="2015-08-10", routeHint=DIRECT, registerHint="chronicle-line", confidence="high")
C(feature="other: showing versus telling",
  claim="Le Guin says showing can be quite static while telling always involves moving on.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1' (Book View Cafe, 2015)",
  url=S1, quote="Showing can be quite static, after all", page="answer to Paige",
  kind="own-words", polarity="asserts", date="2015-08-10", routeHint=DIRECT, registerHint="chronicle-line", confidence="high")
C(feature="sentence length variation",
  claim="Le Guin's remedy for over-relied-on sentence structures is to vary the pattern and read the sentences aloud.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1' (Book View Cafe, 2015)",
  url=S1, quote="play around with the order of words, the connections of sentences", page="answer to Kristen",
  kind="own-words", polarity="asserts", date="2015-08-10", routeHint=DIRECT, registerHint="none", confidence="high")
C(feature="point of view and distance",
  claim="Le Guin tells writers to distrust anybody who says fiction must use only limited third person.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1' (Book View Cafe, 2015)",
  url=S1, quote="Distrust anybody", page="answer to Patricia",
  kind="own-words", polarity="rejects", date="2015-08-10", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")
C(feature="point of view and distance",
  claim="Le Guin says the currently practiced limited third person gives a brilliant, narrow, simplifying intensity of vision, like a flashlight beam.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1' (Book View Cafe, 2015)",
  url=S1, quote="a brilliant, narrow, simplifying intensity of vision", page="answer to Patricia",
  kind="own-words", polarity="asserts", date="2015-08-10", routeHint=DIRECT, registerHint="none", confidence="high")

# --- Session 1 continued
C(feature="place and institution description",
  claim="Le Guin tells a world-building questioner that event requires location and that where we are affects who we are.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story: Session 1, Continued' (Book View Cafe, 2015)",
  url=S1C, quote="Event requires location. Where we are affects who we are", page="answer to Marion, on world building",
  kind="own-words", polarity="asserts", date="2015-08-24", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")
C(feature="withheld information and inference",
  claim="Le Guin recommends giving secondary-world information indirectly, by hint and suggestion, rather than as an expository lump.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story: Session 1, Continued' (Book View Cafe, 2015)",
  url=S1C, quote="Giving information indirectly, by hint and suggestion, can be fun to write.", page="answer to Benjamin, on infodumps in secondary worlds",
  kind="own-words", polarity="asserts", date="2015-08-24", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")
C(feature="other: false dichotomies of craft advice",
  claim="Le Guin denies that reflection and action, or character and action, are opposites.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story: Session 1, Continued' (Book View Cafe, 2015)",
  url=S1C, quote="reflection and action, character and action, are not opposites", page="section 'SOME FALSE DICHOTOMIES'",
  kind="own-words", polarity="rejects", date="2015-08-24", routeHint=DIRECT, registerHint="none", confidence="high")
C(feature="other: conflict is not obligatory",
  claim="Le Guin says conflict is one possible element of a story and is not an obligatory ingredient of narrative.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story: Session 1, Continued' (Book View Cafe, 2015)",
  url=S1C, quote="neither is an obligatory ingredient of narrative", page="section 'SOME FALSE DICHOTOMIES'",
  kind="own-words", polarity="rejects", date="2015-08-24", routeHint=DIRECT, registerHint="chronicle-line", confidence="high")

# --- Session 1 part 3
C(feature="sentence length variation",
  claim="Le Guin coins the term Macho Staccato for the contemporary avoidance of complex sentences.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1, Part 3' (Book View Cafe, 2015)",
  url=S13, quote="avoid complex sentences and write what I call Macho Staccato", page="answer on regaining complex sentences",
  kind="own-words", polarity="rejects", date="2015", routeHint=DIRECT, registerHint="none", confidence="high")
C(feature="sentence length variation",
  claim="Le Guin says the ideal is flexibility, a balance of different sentence lengths depending on what each sentence does.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1, Part 3' (Book View Cafe, 2015)",
  url=S13, quote="The ideal is flexibility, a balance of different sentence lengths", page="answer to Michael, on style",
  kind="own-words", polarity="asserts", date="2015", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")
C(feature="other: passive voice",
  claim="Le Guin, quoting her own Steering the Craft, says writers who want to take responsibility are wary of the passive voice.",
  source="Ursula K. Le Guin quoting Steering the Craft pp. 56-57, in 'Navigating the Ocean of Story - Session 1, Part 3' (2015)",
  url=S13, quote="Writers who want to take responsibility are wary of it.", page="answer to Christy; she cites Steering the Craft pp. 56-57",
  kind="own-words", polarity="asserts", date="2015", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")
C(feature="other: passive voice",
  claim="Le Guin says the passive voice ought to be used freely where it belongs and calls it one of the lovely versatilities of the verb.",
  source="Ursula K. Le Guin quoting Steering the Craft pp. 56-57, in 'Navigating the Ocean of Story - Session 1, Part 3' (2015)",
  url=S13, quote="It is one of the lovely versatilities of the verb.", page="answer to Christy; she cites Steering the Craft pp. 56-57",
  kind="own-words", polarity="asserts", date="2015", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")

# --- Session 1 part 5
C(feature="sentence length variation",
  claim="Le Guin states there are no rules concerning sentence length.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1, Part 5' (Book View Cafe, 2015)",
  url=S15, quote="There are no rules concerning sentence length.", page="answer to Linda, on pacing",
  kind="own-words", polarity="rejects", date="2015", routeHint=DIRECT, registerHint="none", confidence="high")
C(feature="sentence length variation",
  claim="Le Guin's replacement for a sentence-length rule is variety and appropriateness, each sentence's length suited to what it has to say.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1, Part 5' (Book View Cafe, 2015)",
  url=S15, quote="I suggest that you try for both variety and appropriateness", page="answer to Linda, on pacing",
  kind="own-words", polarity="asserts", date="2015", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")
C(feature="concrete sensory noun",
  claim="Le Guin prescribes passages that describe what the world looks like, smells like and sounds like as the relief that paces an idea-crammed story.",
  source="Ursula K. Le Guin, 'Navigating the Ocean of Story - Session 1, Part 5' (Book View Cafe, 2015)",
  url=S15, quote="describe what the world looks like, smells like, sounds like", page="answer on stories too crammed with ideas",
  kind="own-words", polarity="asserts", date="2015", routeHint=DIRECT, registerHint="dossier-archivist", confidence="high")

# --- What Makes a Story
C(feature="cadence and rhythm",
  claim="Le Guin grounds prose rhythm in the body, saying art depends on rhythms and body rhythms are what writers use.",
  source="Ursula K. Le Guin, 'What Makes a Story' (c. 2007), ursulakleguin.com",
  url=WMS, quote="art depends on rhythms, and body rhythms are what writers use", page="paragraph on bodily similes",
  kind="own-words", polarity="asserts", date="c. 2007", routeHint=DIRECT, registerHint="none", confidence="high")
C(feature="cadence and rhythm",
  claim="Le Guin says words are bodily, made with the body and the breath, so the rhythms of words are bodily rhythms.",
  source="Ursula K. Le Guin, 'What Makes a Story' (c. 2007), ursulakleguin.com",
  url=WMS, quote="the rhythms of words are bodily rhythms", page="paragraph on bodily similes",
  kind="own-words", polarity="asserts", date="c. 2007", routeHint=DIRECT, registerHint="none", confidence="high")
C(feature="other: story shape",
  claim="Le Guin offers the walking story, in which you cover ground while seeing everything around you, as an alternative to the fast-paced suspenseful one.",
  source="Ursula K. Le Guin, 'What Makes a Story' (c. 2007), ursulakleguin.com",
  url=WMS, quote="steady, and you fall into the flow of the gait", page="paragraph on walking",
  kind="own-words", polarity="asserts", date="c. 2007", routeHint=DIRECT, registerHint="chronicle-line", confidence="high")

# --- A Few Words / Steering the Craft
C(feature="other: responsibility for words",
  claim="Le Guin defines a writer as a person who cares what words mean.",
  source="Ursula K. Le Guin, 'A Few Words to a Young Writer' (undated), ursulakleguin.com",
  url=FEW, quote="A writer is a person who cares what words mean", page="second paragraph",
  kind="own-words", polarity="asserts", date="undated", routeHint=DIRECT, registerHint="none", confidence="high")
C(feature="terminology consistency",
  claim="Le Guin says the grammar words subject, predicate, object, adjective, adverb and the tenses are the names of the writer's tools.",
  source="Ursula K. Le Guin, introduction to the 2015 revision of Steering the Craft, quoted on ursulakleguin.com",
  url=STC, quote="these are the names of the writer’s tools", page="'From the Introduction' section",
  kind="own-words", polarity="asserts", date="2015", routeHint=DIRECT, registerHint="none", confidence="high")

out={"complete":False,"coverage":"in progress","sourcesRead":sources,"claims":claims}
json.dump(out,open("found-leguin-voice-2.json","w"),indent=1,ensure_ascii=False)
print("claims",len(claims),"sources",len(sources))
