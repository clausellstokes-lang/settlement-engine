#!/usr/bin/env python3
"""Build find-kay-craft.md + found-kay-craft.json for the Kay craft-essay angle.
Every non-empty quote must be (a) <= 11 words and (b) verbatim (after quote/whitespace
normalisation) in the locally fetched text of its source. Aborts without writing on any miss."""
import json, os, re, sys, datetime, unicodedata
OUT = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/sweep"
R1, R2 = f"{OUT}/kay-raw", f"{OUT}/kay-raw2"

# ---------------------------------------------------------------- prior source roster (67), imported verbatim
prior = open(f"{OUT}/build-kay-craft.py").read()
seg = prior[prior.index("SOURCES = ["): prior.index("# ---------------------------------------------------------------- claims")]
exec(seg)
SOURCES = list(SOURCES)
SOURCES += [
 ("A Quarter Turn: On Guy Gavriel Kay and the Space Between History and Fantasy (Scott Oden, novelist, Substack, 2026-02-23)", "https://soden.substack.com/p/a-quarter-turn", "craft essay by a novelist (Substack)", True),
 ("Book Review: Tigana by Guy Gavriel Kay (The Speculative Scotsman, 2010-01-05)", "http://scotspec.blogspot.com/2010/01/book-review-tigana-by-guy-gavriel-kay.html", "blog review", True),
 ("Guy Gavriel Kay – Tigana (1990). Metaphor versus Realism (Jeroen Admiraal, 2025-04-11)", "https://jeroenthoughts.wordpress.com/2025/04/11/guy-gavriel-kay-tigana-1990-metaphor-versus-realism/", "blog review (critical)", True),
 ("The Lions of Al-Rassan — an infinity plus review (Simeon Shoul, 2001-08-04)", "http://www.infinityplus.co.uk/nonfiction/alrassan.htm", "critic review (critical)", True),
 ("'We must learn to bend, or we break': The Art of Living in Guy Gavriel Kay's Sarantine Mosaic (Christopher Cobb & Mary Anne Mohanraj, Strange Horizons, 2000-11-13)", "https://strangehorizons.com/wordpress/non-fiction/reviews/we-must-learn-to-bend-or-we-break-the-art-of-living-in-guy-gavriel-kays-sarantine-mosaic/", "critic dialogue-review", True),
 ("A quarter turn to the Fantastic: Guy Gavriel Kay on historical fantasy (Beamer Books, 2016-04-30)", "https://beamerbooks.wordpress.com/2016/04/30/a-quarter-turn-to-the-fantastic-guy-gavriel-kay-on-historical-fantasy/", "blog post summarising an io9 interview", False),
 ("From Tolkien to Kay — What Writers Can Learn About Epic Fantasy Storytelling (Vered Neta)", "https://veredneta.com/blog/bfrom-tolkien-to-kay-what-writers-can-learn-about-epic-fantasy-storytelling-b/", "writing-advice blog (generic on Kay)", False),
 ("Interview with Guy Gavriel Kay (Dag R., SFFWorld, 2007-01-15)", "https://www.sffworld.com/2007/01/interview-guy-gavriel-kay/", "interview", True),
 ("Magic and Realism: An Interview with Guy Gavriel Kay (Kathy Cawsey, Dalhousie Review, 2021)", "https://ojs.library.dal.ca/dalhousiereview/article/view/11332/10100", "academic-journal interview (PDF)", True),
 ("Under Heaven (Niall Harrison, Vector, 2010-08-18)", "https://vector-bsfa.com/2010/08/18/under-heaven/", "critic review (BSFA)", True),
 ("Guy Gavriel Kay: Lord of Fantasy — Locus interview excerpts (May 2000)", "https://www.locusmag.com/2000/Issues/05/Kay.html", "interview excerpts (Locus)", True),
]

# ---------------------------------------------------------------- local text mapping for verification
LOCAL = {}
for line in open(f"{R2}/urls.txt"):
    if "|" in line:
        k,u = line.strip().split("|",1); LOCAL[u] = f"{R2}/{k}.txt"
LOCAL["https://reactormag.com/2016/07/06/altering-the-familiar-tigana-by-guy-gavriel-kay/"] = f"{R1}/reactor-tigana-arch.txt"
LOCAL["https://fantasyliterature.com/reviews/written-on-the-dark/"] = f"{R1}/fantlit-arch.txt"
LOCAL["https://ojs.library.dal.ca/dalhousiereview/article/view/11332/10100"] = f"{R1}/clean/dalhousie.txt"
LOCAL["https://vector-bsfa.com/2010/08/18/under-heaven/"] = f"{R1}/vector-uh.txt"

def norm(s):
    s = unicodedata.normalize("NFKC", s).replace("­","")
    s = s.replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"').replace("—","-").replace("–","-")
    s = re.sub(r"[^a-z0-9]+"," ",s.lower())
    return re.sub(r"\s+"," ",s).strip()

# ---------------------------------------------------------------- claims
C = []
def add(feature, claim, source, url, quote=""):
    C.append({"feature": feature, "claim": claim, "source": source, "url": url, "quote": quote})

LARB = ("Christine Fischer Guy, LARB interview, 2016-08-14", "https://lareviewofbooks.org/article/fantastic-worlds-guy-gavriel-kay/")
add("competing accounts of one conversation", "Kay stages the same conversation from more than one participant's point of view and the second telling differs from the first, so the reader receives competing memories of one event.", *LARB, "It bears a resemblance, but it's not the same.")
add("matter-of-fact supernatural (worldview rendered as fact)", "Kay uses the fantastic so that what characters believe (ghosts above a battlefield) is simply true in the narration, removing the modern reader's smugness toward the past.", *LARB, "make the world be as my characters believe it to be")
add("two-moons signal / quarter-turn contract", "Cosmetic markers such as two moons tell the reader up front that the setting is not the real place, establishing the rules of engagement.", *LARB, "The two moons say, We're not here.")
add("renamed analogues instead of real figures", "By renaming Justinian and Theodora as Valerius and Alixana, writer and reader share the sense that they are speculating about the past rather than co-opting real lives.", *LARB, "we're speculating about the past")
add("invisible research seams", "Kay holds that if a reader can tell what is invented from what is real, the storytelling has failed; research must be absorbed, not visible.", *LARB, "you've botched your storytelling!")
add("alienness of the past over relatability", "Kay resists relatability-driven historical fiction and tries to capture how different past minds were.", *LARB, "it's also, for me, staggeringly alien")
add("craft as reader-shared strength", "Kay frames every formal or technical strength as something handed to the reader, since writer and reader are in the book together.", *LARB, "Anything that's given to me is given to the reader.")
add("multiple POV per scene", "Kay's novels are told from multiple points of view, sometimes replaying one scene through several characters in turn.", *LARB, "")
add("poet first; reverence for language", "The interviewer notes Kay was a poet before a novelist, speaks in paragraphs, and that a reverence for language runs through everything he writes.", *LARB, "A reverence for language runs through everything he writes.")

CW = ("Chris Urie, Clarkesworld interview, 2016", "https://clarkesworldmagazine.com/kay_interview/")
add("quarter turn as admission of inaccuracy", "The quarter turn to the fantastic acknowledges from the outset that no one renders history exactly right, and Kay likes that reader and writer share that awareness.", *CW, "we can't get it exactly right")
add("epic backdrop, ordinary foreground", "Kay wants a book that feels epic against a great war but is really about non-powerful people getting on with their lives on borderlands.", *CW, "non-powerful men and women trying to get on with their lives")
add("competing self-images as source material", "The gap between how the Uskoks were seen by Venice and how they saw themselves is the novelist's fertile ground — history as contested memory.", *CW, "That kind of gap is very fertile ground for a novelist.")
add("rotating protagonists to the centre", "Kay balances five protagonists who each move to the centre of the narrative in different parts of the book.", *CW, "all move to the center in different parts of the narrative")
add("know the theme before the variation", "Kay says he has no system for building interconnected societies; he learns the real theme before doing variations on it.", *CW, "you should at least try to know the theme")

AMA = ("Kay r/fantasy AMA highlights via Reactor, 2016", "https://reactormag.com/guy-gavriel-kay-reddit-ama-highlights-children-of-earth-and-sky/")
add("detached-historian register", "For River of Stars Kay took tone from translated Song-era histories, adopting a detached-historian voice for some parts that contrasts with the intense scenes.", *AMA, "a little of that ‘detached historian’ voice for some parts")
add("unexplained magic (no light upon magic)", "Kay keeps the fantastic unspelled-out in the manner of Borges and Garcia Marquez, and contrasts this with gaming-inspired fantasy's rules and clarity.", *AMA, "this idea of not spelling everything out")
add("slow build / rhythm and shape", "Kay rejects the page-one hook: the late emotional payoff comes because writer and reader gave the characters room and time, which gives a book rhythm and shape.", *AMA, "It certainly takes away rhythm and shape from a book")
add("secondary characters as alternative novels", "Secondary characters are written so the reader feels the novel could have been about them, a motif Kay took explicitly from the Sagas in Last Light of the Sun.", *AMA, "could have been a story about some others")
add("withheld outcome so grief runs both ways", "The Lions duel is handled so the reader lives with both results and the grief is equal whichever way it went.", *AMA, "the grief is as strong whichever way that duel went")
add("earned emotion vs sentimental manipulation", "Kay distinguishes true emotional response, a product of imaginative empathy, from sentiment produced by manipulation.", *AMA, "not created by sentimental manipulation")

HA = ("Kay, 'Home and Away' essay (BrightWeavings; Globe and Mail 1999)", "https://brightweavings.com/globe/")
add("universalizing through the fantastic", "Detaching a tale from its narrow historical context strips away or erodes the reader's prejudices and assumptions.", *HA, "eroding of prejudices and assumptions")
add("paradoxical applicability", "Because the story is a fantasy it may apply more, not less, to the reader's own life and world.", *HA, "apply more to a reader's own life")
add("declared ignorance of real minds", "Inventing a character inspired by a historical figure lets the writer declare openly that he does not know the real person's thoughts.", *HA, "declaring, without pretense, that I did not know")
add("all history is guesswork", "Kay holds that with distant history novelist and historian alike are guessing, and fantasy admits it.", *HA, "we are all guessing")
add("honesty about limitations", "Treating the past as fantasy acknowledges the Jamesian impossibility of reaching past world-views while still probing them.", *HA, "a way of being honest about limitations")
add("escape that brings you home", "Kay adopts Douglas Barbour's phrase for what fantasy can be — an escape that returns the reader to their own world.", *HA, "The kind of escape that brings you home")

HNR = ("Teresa Basinski Eckford, Historical Novels Review interview, Nov 2004", "https://brightweavings.com/hsparalleluniverses/")
add("register modulation by period form", "Kay shapes the language and the form of the telling to the period's own literary forms, e.g. saga elements for the Viking-era Last Light of the Sun.", *HNR, "shape language and a form of telling the tale")
add("faiths without tenets", "Kay's invented religions keep the interplay of faiths but drop the doctrines, so readers' real-world prejudices cannot attach.", *HNR, "the interplay of faiths, without the tenets")
add("variations on historical themes", "Kay describes his settings as variations on historical themes rather than create-from-scratch worlds.", *HNR, "variations on historical themes, not create-from-scratch worlds")

LM = ("Locus, 'Margins of History', May 2025", "https://locusmag.com/feature/guy-gavriel-kay-margins-of-history/")
add("Dunnett method for conveying intelligence", "To make a character read as genuinely smart, Kay has them make references the reader does not yet get, as Dunnett did with Lymond.", *LM, "say things the reader doesn't understand")
add("elements deployed only on need", "Supernatural, erotic, intrigue, suspense and lyric language are each used only when the particular book needs them, never to please a market.", *LM, "What does this book need from me")
add("lyric language as one deployable element", "Kay lists lyric language alongside the supernatural and the erotic as elements a book may or may not require.", *LM, "another might be lyric language")
add("teaching the reader to read you", "Every serious writer teaches readers how to read them, so an unfamiliar register startles like tea poured when coffee was expected.", *LM, "every serious writer is teaching a reader how to read them")
add("deliberately bad verse as register contrast", "Kay writes hack poets' hack work (a bad troubadour in Arbonne) as a foil to the good poets.", *LM, "ridiculously enjoyable to hack around with a hack’s work")
add("no direct mapping of figures or events", "Kay never wants a character or event to map one-to-one onto a real person or event; history rhymes rather than repeats.", *LM, "where a character maps onto a real person")
add("banter as demonstrated wit", "Kay values dialogue in which a character actually skewers another with a line, rather than being told the character is witty.", *LM, "skewers another with a line of banter")
add("margins of history", "Kay's stated lifelong subject is the unwritten histories — women and the poor at the margins — alongside the chronicles of dukes and popes.", *LM, "the people at the margins of history")
add("writing as gap-reduction", "Kay describes writing as labour to shrink the gap between what he wants to produce and what emerges — not fun, except for funny scenes and banter.", *LM, "working as hard as I can to reduce the gap")

L07 = ("Locus interview excerpts, Sept 2007", "https://www.locusmag.com/2007/Issue09_Kay.html")
add("interesting things to interesting people", "Kay's working definition of good fiction demands both engaging events and fully realized characters, refusing the either/or of bestseller and literary fiction.", *L07, "good fiction is interesting things happening to interesting people")
add("universalized Tigana", "Tigana was written as fantasy precisely so Croatians, Poles, Quebecois and Koreans could each read it as about themselves.", *L07, "so it could be seen as universalized")

L00 = ("Locus interview excerpts, May 2000", "https://www.locusmag.com/2000/Issues/05/Kay.html")
add("telescoping history", "Fantasy lets Kay compress a 400-year reconquest into two generations while keeping its underlying themes.", *L00, "You can telescope events.")
add("useful doubt about outcome", "Because the setting is 'a fantasy on themes of Byzantium', even a reader who knows Justinian cannot know where the story goes.", *L00, "open up a useful doubt in a reader's mind")
add("sharpened, not softened", "Treating historical moments through fantasy intensifies them rather than fudging them.", *L00, "Not softened, not fudged, but sharpened.")
add("against magic-system minutiae", "Kay sees the genre's significance being lost in the minutiae of magic systems.", *L00, "the minutiae of figuring out magic systems")

WOLFE = ("Gary K. Wolfe, Locus review of Children of Earth and Sky, June 2016", "https://locusmag.com/2016/06/gary-k-wolfe-reviews-guy-gavriel-kay/")
add("harmonic rather than melodic constraint", "Kay improvises freely on history up to a self-set point; his research constrains him harmonically rather than melodically.", *WOLFE, "the constraints are perhaps more harmonic than melodic")
add("tactically restrained supernatural", "Supernatural elements are deliberately, tactically restrained, and ghosts serve mostly as conduits of otherwise unavailable information, as in Shakespeare.", *WOLFE, "ghosts were essentially the mobile phones of Renaissance drama")
add("depth for walk-on figures", "Kay lends surprising depth to even walk-on characters while the young protagonists carry the narrative.", *WOLFE, "lending surprising depth to even walk-on figures")
add("threads merge just short of contrivance", "Storylines converge ingeniously but always just short of seeming too ingenious.", *WOLFE, "always just a bit short of seeming too ingenious")
add("chronology opening at the end", "The novel's poignance comes when the chronology opens up toward the end, telescoping years after the main action.", *WOLFE, "when the chronology opens up a bit toward the end")

CAM = ("Raymond H. Thompson, Camelot Project interview, 1989", "https://d.lib.rochester.edu/camelot/text/interview-with-guy-gavriel-kay.html")
add("latent foreshadowing", "Kay plants hints intended to prepare the reader at a latent, subconscious level before major revelations.", *CAM, "meant to prepare the reader at a latent level")
add("the 'what the hell — of course' twist", "Kay aims for the double effect of a twist that surprises for a moment and then feels inevitable.", *CAM, "I love that double effect when you catch the reader")
add("restraint as formal constraint", "Kay likens his restraint with mythic material to the restraint a sonnet imposes on a poet — a chosen form, not a limitation.", *CAM, "restraint that a sonnet imposes upon a writer")
add("mythic passages most revised", "Sections incorporating Arthurian figures were the most carefully thought out before writing and the most reworked after.", *CAM, "the most carefully thought out prior to writing")

IP = ("Sandy Auden, infinity plus interview, 2005", "https://www.infinityplus.co.uk/nonfiction/intggk.htm")
add("no information dumps", "Kay deliberately avoids what he calls the James Michener effect of raw information dumps.", *IP, "the James Michener Effect")
add("fantasy as declared guesswork", "Fantasy offers an up-front acknowledgement of the guesswork and imagination that all historical fiction involves.", *IP, "Fantasy offers an up-front acknowledgement of the guesswork and imagination involved.")
add("no blocking out", "Kay does not block out the process of a novel, or even the moment he will start writing, ahead of time.", *IP, "I don't block out the process")

PSY = ("Alaya Dawn Johnson, Fantasy Magazine interview, 2008-12-09", "https://psychopomp.com/fantasy/miscellaneous/a-conversation-with-guy-gavriel-kay/")
add("character through action", "Kay reveals character through action rather than stopping the narrative for exposition.", *PSY, "revelation of character through action, as opposed to stopping a narrative")
add("setting, theme, character, then narrative", "Kay does not outline; period and place come first, then theme, then characters, and the arc emerges from these.", *PSY, "Period and place, and theme, then characters.")

GC = ("Greg Cook, Wonderland interview, 2019-04-28", "https://gregcookland.com/wonderland/2019/04/28/guy-gavriel-kay/")
add("stiletto not bludgeon", "Kay prefers to deliver theme by stiletto rather than bludgeon — implication over hammering.", *GC, "I prefer the stiletto to the bludgeon")
add("plot, character and language all three", "Kay considers it his job to deliver plot, character and language equally rather than trade one for another.", *GC, "my job to try to deliver all three")
add("eroding distance from the past", "The fantastic is used to erode or erase the reader's sense of superior distance from past people.", *GC, "erode (or even erase?) that sense of distance")

FBR13 = ("Far Beyond Reality interview, 2013-03-19", "https://farbeyondreality.com/2013/03/19/author-interview-guy-gavriel-kay/")
add("organic emergence of period detail", "Kay wants details of time and place to emerge organically rather than be showcased, knowing far more than reaches the page.", *FBR13, "to emerge, as much as possible, organically")
add("author withholds interpretation", "Kay prefers to leave interpretation of his novels to readers rather than direct it.", *FBR13, "I always prefer to leave it to readers")

FC = ("Fantasy Cafe interview, 2013-03-21", "https://www.fantasybookcafe.com/2013/03/interview-with-guy-gavriel-kay/")
add("epic scale pressures language", "Kay warns that 'epic' expectations of scale put negative pressure on character, language and theme.", *FC, "puts a negative pressure on character, language, and theme")
add("nuance over cut-to-story", "Kay rejects the Hollywood injunction to cut to story because it kills nuance.", *FC, "Cutting to the story kills nuance.")
add("tonal modulation within a book", "Kay names T.H. White's switching of tone within one book, from whimsy to deep sorrow, as a model, because lives switch tone.", *FC, "switching tone within a book, from whimsy to deep sorrow")
add("language as mood engine", "Eddison showed Kay that language itself can be central to shaping mood and a sense of strangeness.", *FC, "language could be so utterly central to shaping mood")
add("subtleties for rereaders", "Kay expects subtleties of language and character to emerge far more on a second or third reading.", *FC, "subtleties in language or character emerge far more a second")
add("worldview elements shown as real", "If ghosts, fox-women or faeries are part of the characters' worldview, Kay shows them in the book rather than explaining them away.", *FC, "I will show that in the books")
add("them and not-them", "Characters inspired by real people are made 'them and not-them' — owned, not transcribed.", *FC, "them and not-them")
add("past working on the present", "Kay's stated fascination is how the past works on the present, personally and collectively.", *FC, "the way the past works on the present")

PFH = ("Pat's Fantasy Hotlist interview, 2019-05-08", "http://fantasyhotlist.blogspot.com/2019/05/new-guy-gavriel-kay-interview.html")
add("architect: shape of the novel", "Kay calls himself an architect because the shape of a novel matters greatly to him, which is one reason he does not write multi-volume series.", *PFH, "the shape of a novel matters a lot to me")
add("foregrounded teller", "Kay is preoccupied with the fact that a novel is a story being told to you by someone, and with how we shape narratives from the past.", *PFH, "a story being told to you by someone")

CBC = ("Ryan B. Patrick, CBC Books interview, 2019", "https://www.cbc.ca/books/guy-gavriel-kay-on-why-writing-fantasy-fiction-about-destiny-dominion-and-deceit-will-never-go-out-of-style-1.5206593")
add("no one-to-one allegory", "Kay refuses one-to-one allegories of the present; the past is not meant to map exactly onto now.", *CBC, "I don't write any 'one to one' allegories.")

SFW07 = ("Dag R., SFFWorld interview, 2007-01-15", "https://www.sffworld.com/2007/01/interview-guy-gavriel-kay/")
add("research as part of craft", "Kay treats research as part of craft, not a stage before it.", *SFW07, "research is a part of craft, for me")
add("writer's journey of discovery", "The writer must have a journey of discovering what the book wants to be, and that discovery is part of what the reader finds compelling.", *SFW07, "there must BE a journey, for the writer")
add("ambition over trend-following", "Kay cautions an ambitious writer against a too-narrow focus on genre trends and tastes.", *SFW07, "caution against a too-narrow focus on trends and tastes")

DAL = ("Kathy Cawsey, 'Magic and Realism', Dalhousie Review, 2021", "https://ojs.library.dal.ca/dalhousiereview/article/view/11332/10100")
add("magic scaled to period belief", "The amount and kind of magic in each novel depends entirely on what the source society believed, so levels vary book to book.", *DAL, "entirely dependent upon the historical beliefs and myths")
add("diminishing smugness toward the past", "Rendering period beliefs as true diminishes the smugness modern readers bring to the past; nothing is marked quaint or folkloric.", *DAL, "diminishing the smugness we so often bring")
add("no daylight upon magic", "Kay adapts Bagehot's line to explain leaving the workings of magic unexplained; characters would not analyse their beliefs, so neither do readers.", *DAL, "we must not let daylight in upon magic")
add("setting renders beliefs true", "Kay says the setting renders the characters' beliefs as true, and Cawsey adds the characters reinforce that truth.", *DAL, "renders these beliefs as true")
add("great events at the personal level", "Kay is profoundly interested in bringing great events down to the personal level — a farmer cares more for a hired hand's broken leg than an emperor's death.", *DAL, "means far less to a farmer than the broken leg")
add("value to unrecorded lives", "In recent books Kay is even more engaged by giving value to lives that go unrecorded, drawing on a generation of social historians.", *DAL, "giving value to lives that often go unrecorded")
add("invented setting untethers theme", "It is the very fact of an invented setting that lets a reader see a story as not tied to one time and place.", *DAL, "the absence of a specific time and place")
add("characters draw the reader into worldview", "Readers believe in ghosts and faeries because the characters do; the characters draw the reader into their worldview.", *DAL, "the characters draw you into their worldview")

TFT = ("Joel Miller, Transmissions from Tomorrow, 2026-05-03", "https://transmissionsfromtomorrow.substack.com/p/meeting-guy-gavriel-kay-what-he-told")
add("image-first composition", "Tigana began from an image (a cabin in the woods, people gathered, someone approaching) before Kay knew who anyone was.", *TFT, "It started with an image of a cabin in the woods")
add("no template or system", "Across sixteen books Kay has no pattern, template or system; each book is found anew.", *TFT, "I don't have a pattern, a template, or a system")
add("accessibility without prior knowledge", "Readers who know nothing of the underlying history should never feel behind the curve.", *TFT, "don't ever feel they're behind the curve")
add("the past isn't even past", "Kay's rationale is philosophical: characters are written as still shaped by events centuries earlier.", *TFT, "isn't even past. We're still affected by, still shaped by")

BI = ("Kay, The Big Idea (Whatever), 2025-05-28", "https://whatever.scalzi.com/2025/05/28/the-big-idea-guy-gavriel-kay-4/")
add("story, not lecture", "Kay insists resonance with the present must come through story, not through lecturing.", *BI, "I'm offering a story not giving a lecture")
add("yesterday's snows", "Writing about the past lets Kay say things that resonate when readers look up at their own time.", *BI, "say things that might resonate for readers")
add("quarter-turn phrase (Kay's own use)", "Kay adopts a reviewer's phrase for his mode: history with a quarter-turn to the fantastic, under two moons, in a not-quite past.", *BI, "history with a quarter-turn to the fantastic")
add("history rhymes", "Kay's governing idea for relevance is Reik's line that history may not repeat but rhymes.", *BI, "history may not repeat, but it rhymes")

LR = ("Kay, LoveReading guest editor essay, 2021-03-31", "https://www.lovereading.co.uk/blog/guest-editor-spring-2021-guy-gavriel-kay-8615")
add("deliberate quietness", "Kay describes wanting one of his own works to be very quiet in register.", *LR, "I wanted it to be very quiet.")
add("strangeness of the past as goal", "Kay prizes historical fiction (Renault) that conveys the sheer strangeness of the past and wraps the reader in wonder.", *LR, "The sheer strangeness of the past")

add("memory as subject", "Kay's tenth-anniversary afterword says Tigana is in good part a novel about memory — its cultural necessity and the danger of its excess.", "Kay, Tigana tenth-anniversary afterword (excerpt on BrightWeavings)", "https://brightweavings.com/books/books/tigana/", "Tigana is in good part a novel about memory")
add("balancing character and theme", "Kay's stated aim is pages turned until three in the morning and themes that stick afterwards — character and theme in balance.", "Kay, Goodreads author blog, 2018-11-07", "https://www.goodreads.com/author_blog_posts/17550151-balancing-characters-and-themes?tab=book", "trying to find a way to balance characters and theme")

JW = ("Jo Walton, 'Mosaics and charioteers' (orig. tor.com), 2016", "https://brightweavings.com/mosaics-and-charioteers-guy-gavriel-kays-sarantine-mosaic/")
add("veiled omniscient narrator", "The Sarantine narrator is a veiled omniscient who knows everything and everyone's thoughts but will not approach too closely, drawing and lifting veils.", *JW, "He draws and lifts veils.")
add("wrong end of the telescope", "The elegiac distance makes the reader feel the people are far away, with a constant pulling back even from blood, sex and death.", *JW, "looking through the wrong end of the telescope")
add("consciousness of artifice", "Violence, love and death are interpreted through a consciousness of artifice — the mosaicist's frame.", *JW, "interpreted through the consciousness of artifice")
add("pluperfect tense", "Walton notes heavier use of the pluperfect than in anything else she can think of, layering past moments under the present scene.", *JW, "more use of the pluperfect tense in these than anything else")
add("withheld identity (dissent)", "Kay describes a character for two pages without saying who it is, a Dunnett trick Walton dislikes.", *JW, "guessing who it is for two pages")
add("compressed days with flashbacks", "The books concentrate on single days in which many things happen, told through many viewpoints and flashbacks.", *JW, "concentrate on single days in which many things happen")
add("no throwaway viewpoints", "There are many points of view but Kay never takes up a character just to throw them away.", *JW, "he never takes up a character just to throw them away")
add("ironic omniscient linking", "The omniscient voice links everything together ironically, connecting and underlining.", *JW, "The ironic linking of everything together in omniscient")
add("details real enough to bite", "World is evoked by concrete details — tesserae quality, mud, fish sauce, the arrow-drawing tool.", *JW, "The details are all real enough to bite")
add("glinting magic", "There is little magic but it runs glinting through everything else.", *JW, "it runs glinting through everything else")
add("crowd viewpoints", "Even a chariot race is seen from a driver and from someone in the crowd, giving peripheral figures a viewpoint.", *JW, "the point of view of a driver, someone in the crowd")
add("fantasy reopens historical suspense", "Renaming lets a story known from history stay open: a historical novel is inevitably a tragedy, a historical fantasy is open.", *JW, "a historical fantasy is open")

TOY = ("Roosa Toyryla, BA thesis on focalization in Tigana, 2017", "https://brightweavings.com/ambiguities-and-divided-loyalties-focalization-in-guy-gavriel-kays-tigana/")
add("scene narrated twice or thrice", "The Ring Dive scene where storylines converge is narrated two or three times through different focalizers.", *TOY, "narrated twice or even thrice")
add("quantified focalization", "About sixty per cent of Tigana is focalized through Devin or Dianora; the rest cycles through many others.", *TOY, "About sixty per cent of the text has either Devin or Dianora")
add("free indirect discourse", "Character-owned metaphors enter the narrator's sentences, so the figure of twin snakes is clearly the character's, not the narrator's.", *TOY, "The metaphor of twin snakes is clearly hers, not the narrator's")
add("sentence fragments for emotion", "Incomplete sentences in narrated monologue push the register toward the character and heighten emotional intensity.", *TOY, "enhances the emotionality")
add("matter-of-fact violence", "A dramatic, violent event is narrated in a flat, matter-of-fact style that heightens the shock.", *TOY, "matter-of-fact style is used to describe a dramatic and violent event")
add("flat report of an atrocity", "The innkeeper's execution is reported in one clinical sentence right after the reader has been inside his head.", *TOY, "They arrested Ettocio and executed him on a wheel")
add("narrator as inhabitant", "The omniscient narrator describes the world the way an inhabitant would, without explaining it to outsiders.", *TOY, "the narrator describes things like an inhabitant of that world would")
add("communal (intermental) focalization", "The narrator adopts a whole town's opinion as focalizer, producing sarcastic double vision.", *TOY, "all the taverns and khav rooms agreed")
add("omniscience restricted to later report", "Phrases like 'according to most reports later' restrict the narrator to what will become public knowledge.", *TOY, "according to most reports later")
add("minor focalizer withholds protagonists' identity", "Focalizing through an innkeeper means readers are not told who the protagonists are.", *TOY, "Readers are not directly told who the characters are")
add("withheld focalizer enables the twist", "Rhun is never a focal character until the last pages, which is what makes his revelation possible.", *TOY, "Rhun does not appear as a focal character earlier")

KL = ("Anya Kleander, dissertation 'Present Reality in Historical Fantasy', 2008", "https://brightweavings.com/presentreality/")
add("shifting internal focalization", "Kay primarily uses shifting internal focalization across many focalizants, producing moral complexity.", *KL, "moving between many different focalizants")
add("twenty-one focalizants", "Kleander counts twenty-one separate focalizants and over 150 focalizations in Tigana, Devin 41 times and Dianora 27.", *KL, "there are twenty-one separate focalizants in Tigana")
add("non-focalized omniscient insertions", "A non-focalized omniscient narrator appears both in short passages inside focalized narrative and in separate sections.", *KL, "A further non-focalized omniscient narrator is used")
add("ignorant protagonist as exposition device", "Devin's absence of knowledge lets secondary-world details reach the reader without lecture.", *KL, "is a common device in fantasy")
add("delayed focalization of the antagonist", "Brandin is focalized only at the very end, preserving ambiguity until resolution.", *KL, "Brandin is only focalized through at the very end")
add("echo not copy", "Kay's historical method is an echoing of elements, not a copying.", *KL, "echoing of elements, not a copying")

RET = ("Matthew Rettino, honours thesis 'Fantasies of History', 2012", "https://brightweavings.com/fantasies-of-history-guy-gavriel-kays-synthesis-of-the-historical-fantasy-novel/")
add("exposition disguised as thought", "The narrator slips historical information to the reader disguised as a viewpoint character's thoughts.", *RET, "disguising it as Jehane's thoughts")
add("chronicle-register opening", "Openings read like chronicle entries, lending the novel historical flavour.", *RET, "The opening passage reads like an entry in a chronicle")
add("prophecy exposes structure", "The riselka's prophecies foreshadow and lay bare the structural lines of the novel.", *RET, "The riselka's prophecies foreshadow and expose the structural lines")
add("elegiac close", "Rather than reversing catastrophe, Kay ends Lions with an elegiac tone and ambiguous closure.", *RET, "an elegiac tone to the end of the novel")
add("historiographic narrator persona", "Kay's narrator adopts a historian's persona that must keep its own protocol of caution while still asserting.", "Matthew Rettino, thesis summary blog, 2013-04-29", "https://matthewrettino.com/2013/04/29/history-as-fantasy-my-honours-thesis-on-guy-gavriel-kay-summarized/", "historians do occasionally make arrogant assertions")

WEBB = ("Janeen Webb, 'Myth and the New High Fantasy', 1991", "https://brightweavings.com/webbtigana/")
add("naming as identity", "Naming is crucial in Tigana; names encode identity and destiny (Brandin names his Fool Rhun).", *WEBB, "Naming is crucial to this text")
add("reader sees the tapestry, players do not", "The multi-strand structure lets reader (and gods) see the whole pattern the characters cannot.", *WEBB, "The gods, and the reader, may see the whole tapestry")
add("three plaited strands", "Three major strands of action are plaited and cross toward convergence.", *WEBB, "three major strands of action, plaited into the tale")
add("visual doubling", "The Fool dressed identically to the King acts out the ruler's suppressed feelings — emotion externalized visually.", *WEBB, "the Fool acts out the ruler's feelings")

COBB = ("Christopher Cobb, Foundation essay, 2005", "https://brightweavings.com/hspsychologyhistory/")
add("history as internal residue", "Kay renders history as an internalized weight in characters' consciousness — what is left behind yet stays with you.", *COBB, "things were left behind and yet stayed with you")

ORD = ("Holly E. Ordway, 'The World-Building of Guy Gavriel Kay', 1998", "https://brightweavings.com/worldbuilding/")
add("archaic inversion for sacred register", "Kay marks the numinous with inverted, archaic syntax.", *ORD, "Very dark it was, dark almost to black")
add("names signal affiliation", "Character and people names immediately signal religious and ethnic affiliation.", *ORD, "Jaddites, worshippers of the sun")

HATCH = ("Jillian Hatch, student paper on the Sarantine Mosaic, 2005", "https://brightweavings.com/creative_history/")
add("focalization as tesserae", "Shifting focalization works like mosaic tesserae whose colours play against and with each other.", *HATCH, "against each other and with each other")
add("word as tessera", "Tesserae play the role in a mosaic that words play in a history — signs standing for what cannot otherwise be communicated.", *HATCH, "The pieces of tessera play a very similar role")
add("cyclical, multi-focalized chronology", "Flashbacks and several focalizers per event make the narrative cyclical, producing cause-and-effect rather than a timeline.", *HATCH, "cyclical style of narrative creates a sense of cause and effect")
add("historians prefer drama to truth", "The opening acknowledges that writers of history seek the dramatic over the truth, framing the novel's own historiography.", *HATCH, "writers of history often seek the dramatic over the truth")
add("fictional historian's bias", "Pertennius the chronicler records only his own bitter experience and gossip, dramatizing how record diverges from event.", *HATCH, "he confines himself to his own bitter experiences, and the gossip")

REV = ("Collected press reviews of Lions (Kilheffer F&SF; Sagara Quill & Quire; Barbour Edmonton Journal; Langford SFX)", "https://brightweavings.com/revlions/")
add("contemporary idiom intrusions", "Kilheffer flags lines like 'They had been dealt with' as distinctly contemporary against the period register.", *REV, "a distinctly contemporary feel")
add("withholding past the natural point", "Kilheffer: Kay withholds information longer than seems natural to heighten suspense.", *REV, "withholding information from the reader longer than might seem natural")
add("conspicuous off-stage action", "Leaving key action conspicuously out draws the reader's attention to it all the more strongly.", *REV, "by so conspicuously leaving the action out")
add("verbal duels over swordplay", "Kay is more interested in and comfortable with verbal duels than with swordplay.", *REV, "more interested in and comfortable with verbal duels than swordplay")
add("no wasted word", "Sagara: Kay wastes no word or scene; there is no self-indulgent bloating.", *REV, "Kay doesn't waste a word or a scene")
add("rounding characters by implication", "Barbour: characters are rounded precisely by implying their social and psychological baggage rather than stating it.", *REV, "implying all the social, as well as psychological, baggage")
add("short sharp atrocity over set-piece battle", "Langford: attention stays on individuals; war's horror is shown in short, sharp scenes of atrocity rather than generalized battles.", *REV, "short, sharp scenes of atrocity")
add("suspense prolonged to screaming point", "Langford: the climactic duel's suspense is prolonged almost to screaming point with a last surprise held back.", *REV, "prolongs the suspense almost to screaming point")

RA1 = ("Russ Allbery, review of Children of Earth and Sky, 2022-02-21", "https://www.eyrie.org/~eagle/reviews/books/0-698-18327-4.html")
add("omniscient tight third with commentary", "Kay's signature mode is a tight third that also carries narrative commentary, foreshadowing and emotional emphasis apart from the character's thoughts.", *RA1, "also gets narrative commentary")
add("commentary as soundtrack", "The narrative commentary works like a film soundtrack, telling the reader how to feel about a scene.", *RA1, "The narrative commentary functions like a soundtrack in a movie")
add("portentous foreshadowing", "The foreshadowing is frequently portentous, announcing that a moment matters.", *RA1, "the foreshadowing frequently can be described as portentous")
add("explicit, repeated emphasis", "If something is important, the narrator says so explicitly and sometimes repetitively.", *RA1, "Kay tells you, explicitly and sometimes repetitively")
add("mid-scene viewpoint switch without replay", "Kay switches viewpoint characters mid-scene without replaying events.", *RA1, "switch viewpoint characters in the middle of a scene")
add("braided five-strand structure", "The novel braids five main characters' stories that converge and diverge.", *RA1, "a braided novel following five main characters")
add("sparring dialogue", "Characters spar and thrust with every line and read nuance, so conversation carries plot.", *RA1, "characters spar and thrust with every line and read nuance")

RA2 = ("Russ Allbery, review of Under Heaven, 2010-11-23", "https://www.eyrie.org/~eagle/reviews/books/0-451-46330-7.html")
add("restraint, drama turned up at climax", "Under Heaven is mostly restrained but the dramatic narration is turned up a bit too high around the climax.", *RA2, "Kay does turn up the dramatic narration a bit too high")
add("a book that stays within itself", "The novel, like its protagonist, stays within itself, unlike the constant drumbeat of High Drama in Last Light of the Sun.", *RA2, "constant drumbeat of High Drama")
add("background stays background", "Kay lets research stay in the background rather than hammering the reader with it.", *RA2, "let the background be background")
add("conversation as pacing engine", "Long conversations do pacing, characterization and repeated broadening and revelation at once.", *RA2, "pacing, characterization, and repeated broadening and revelation")

FLW = ("Bill Capossere & Rob Rhodes, FantasyLiterature review of Written on the Dark, 2025", "https://fantasyliterature.com/reviews/written-on-the-dark/")
add("retrospective-historian flash-forward", "The omniscient narrator flashes forward with historian phrasing about how a moment will later be judged.", *FLW, "marked a demarcation, it would afterwards be said")
add("'would remember' flash-forward", "A quick in-and-out flash forward stays tied to the character just focalized: he would remember that afternoon all his life.", *FLW, "Gauvard Colle would remember that afternoon, that room")
add("micro/macro zoom", "Kay shifts between tight third for most of the story and an omniscient narrator far less bound by space or time.", *FLW, "an omniscient narrator far less bound by space or time")
add("no minor characters", "Kay refuses to treat characters as lesser or minor, giving backstories even to a guardsman.", *FLW, "the refusal to denote characters as “lesser” or “minor”")
add("sweet-and-sorrowful register", "Classic Kay is elegant warmth, masterful POV and an admixture of the sweet and the sorrowful.", *FLW, "admixture of the sweet and sorrowful")
add("competence as character keynote", "Nearly every character, side characters included, is presented as supremely capable.", *FLW, "All are presented as supremely capable")
add("sparer late style, opening fragment", "Written on the Dark is shorter and its prose still lyrical but sparer; the novel opens with a sentence fragment.", *FLW, "the novel opens with a sentence fragment")
add("impressionistic vs baroque", "Rhodes contrasts Arbonne's baroque tapestry with Written on the Dark's impressionism — less paint, images no less memorable.", *FLW, "still lyrical but perhaps more spare")
add("structure of situations with time-jumps", "The book pauses on a period, then jumps months or years, so it is a series of situations rather than seamless narrative.", *FLW, "more a series of situations")
add("history flipped rather than massaged", "In Written on the Dark Kay flips historical events upside down rather than massaging them into place.", *FLW, "completely flipping historical events upside down")

VEC = ("Niall Harrison, Vector review of Under Heaven, 2010-08-18", "https://vector-bsfa.com/2010/08/18/under-heaven/")
add("magic but little mystery", "Kay's characters are utterly, transparently themselves; the affect is magic but little mystery, which defuses 'inscrutability'.", *VEC, "magic but little mystery")
add("superlative-rich register / beauty fatigue", "Kay's superlative-rich style risks beauty fatigue; the extravagance might be better as one of the poems he admires.", *VEC, "superlative-rich style risks beauty fatigue")
add("stately narrative", "Absurd-scale gestures (a years-long burial of the dead) become plausible inside Kay's stately narrative.", *VEC, "rendered within Kay's stately narrative")
add("implied narrator becomes real narrator", "In the final third the implied narrator becomes a real one and the focus pulls back from the story's present.", *VEC, "the implied narrator becomes a real narrator")
add("focus pulls back from the present", "The closing movement gradually withdraws from the story's present, reminding us this telling is one interpretation among many.", *VEC, "the focus gradually pulls back from the story's present")
add("set pieces off-stage", "The horses frame keeps expected big set-piece events off-stage; Kay prefers the feel of a moment of historical possibility.", *VEC, "big set-piece events off-stage")
add("threnody", "Under Heaven's last third is a threnody for a culture at the height of its power choosing to diminish.", *VEC, "a threnody for a culture at the height of its power")
add("narrator on who notices coincidence", "Kay's narrator says only a patient historian or someone shaping a story for palace or marketplace would note such conjunctions.", *VEC, "someone shaping a story for palace or marketplace")
add("story foregrounded over history", "Kay is scrupulous about emphasising that Under Heaven is a story, an abstraction and use of history.", *VEC, "Kay is scrupulous about emphasising that Under Heaven is a story")
add("present tense for women's viewpoint sections (author comment)", "Harrison notes in comments that sections with women viewpoint characters are in present tense against past tense for male viewpoints.", *VEC, "are in present tense, compared to sections with male viewpoint characters")
add("elevated register as house style (author comment)", "The elevated register is characteristic of Kay's work generally, not specific to his China.", *VEC, "the elevated register is characteristic of Kay's work")

HP = ("H.P., Every Day Should Be Tuesday review, 2016-05-10", "https://everydayshouldbetuesday.wordpress.com/2016/05/10/review-children-of-earth-and-sky-guy-gavriel-kay/")
add("triple restatement (dissent)", "A hostile reading: Kay never says once what he can say twice or three times.", *HP, "never says once what he can say twice")
add("staccato short sentences (dissent)", "Kay's short sentences produce a staccato beat the reviewer finds awkward.", *HP, "There is a staccato beat to his short sentences")
add("confusing mid-scene POV shifts (dissent)", "Switching back and forth between POVs mid-scene can disorient.", *HP, "switches back and forth between POVs in the middle")
add("omniscient comments on the future", "Kay occasionally shifts to omniscience to comment on the future, a device that can misfire.", *HP, "switches to an omniscient view and comments on the future")

add("thematic reflections by the narrator", "The omniscient narrator intersperses the story with reflections on its themes.", "L.A. Smith review of All the Seas of the World, 2022", "https://lasmithwriter.com/review-all-the-seas-of-the-world-by-guy-gavriel-kay/", "intersperses the story with reflections on the themes")
add("peripheral-figure interludes", "Short interludes about peripheral figures are sprinkled as asides, insisting ordinary lives matter within great events.", "L.A. Smith review of All the Seas of the World, 2022", "https://lasmithwriter.com/review-all-the-seas-of-the-world-by-guy-gavriel-kay/", "short interludes sprinkled as asides throughout the story")

SPEC = ("Jesse, Speculiction review of Lions, 2012-01-26", "http://speculiction.blogspot.com/2012/01/review-of-lions-of-al-rassan-by-guy.html")
add("formal language balanced with brevity", "Lions balances formal diction against a brevity that depends more on action than words.", *SPEC, "the formal use of language and a brevity")
add("subtle tone, delayed reveals", "Reveals are not immediate and the tone is subtle rather than explicit.", *SPEC, "reveals are not immediate and the tone is subtle")
add("tributary structure", "Secondary storylines feed the main plot like tributaries into a river.", *SPEC, "smaller tributaries feeding a larger river")

TV = ("Tar Vol on review of Lions, 2021-02-04", "https://www.tarvolon.com/2021/02/04/fantasy-novel-review-the-lions-of-al-rassan-by-guy-gavriel-kay/")
add("old-school omniscient", "Lions is told in old-school third-person omniscient that mostly follows three leads.", *TV, "old school, third-person omniscient narration")
add("aftermath-first chapter openings", "Chapters open by partially describing the aftermath of a conflict before flashing back to it.", *TV, "partially describing the aftermath of some conflict, before flashing back")
add("revisions of the reader's first reading", "Details are released so as to deepen or correct the reader's initial interpretation.", *TV, "deepen or correct the reader's initial interpretation")
add("summary flashback as sketching", "A flashback covering a year of story time reads like sketching rather than scene.", *TV, "feels a bit like sketching")

NW = ("Nick Wisseman review of Lions, 2022-09-02", "https://www.nickwisseman.com/single-post/book-review-the-lions-of-al-rassan-by-guy-gavriel-kay")
add("foreshadow then cut away", "Kay foreshadows a momentous revelation and then cuts away from the conversation.", *NW, "only to cut away from the conversation")
add("misdirection about who is dead", "Kay tricks the reader into thinking one character is dead or in danger when it is another.", *NW, "one character is in danger or dead when it's actually another")

EBR = ("Vanessa, Elitist Book Reviews on Under Heaven, 2010-08-04", "https://elitistbookreviews.com/2010/08/04/under-heaven/")
add("subtle viewpoint switches", "Switches between viewpoints are subtle and elegant.", *EBR, "his switches between viewpoints is subtle and elegant")
add("magic shown by result only", "Kay hints at magic by showing results without ever giving real information.", *EBR, "showing the results without ever giving any real information")
add("summarized ending", "The ending wraps up in an aloof summary rather than dramatized scene.", *EBR, "an aloof summary")

ANY = ("David, Anywayward review of the Sarantine Mosaic, 2020-10-04", "https://anywayward.com/book-review-the-sarantine-mosaic-by-guy-gavriel-kay/")
add("laconic sentences against lyric passages", "Brief, laconic sentences work when balanced against more lyrical passages.", *ANY, "brief, laconic sentences works nicely when balanced against")
add("oblique violence", "The central act of violence is discussed obliquely and is more powerful for it.", *ANY, "discussed somewhat obliquely and is all the more powerful for it")
add("slow-release prologue", "The prologue's significance rolls out slowly over the whole story.", *ANY, "the significance of the events discussed rolls out slowly")
add("tone tracks the section", "Each section's tone and backdrop differ and the difference reflects the central character.", *ANY, "differs from later stages and that difference reflects the nature")

SH = ("Christopher Cobb & Mary Anne Mohanraj, Strange Horizons, 2000-11-13", "https://strangehorizons.com/wordpress/non-fiction/reviews/we-must-learn-to-bend-or-we-break-the-art-of-living-in-guy-gavriel-kays-sarantine-mosaic/")
add("image repeated and reworked across books", "Kay repeats an image (the golden rose) from book to book and reworks it to vary its meaning — the work built like a mosaic.", *SH, "repeats an image or an idea from one book to the next")
add("trajectory toward historical realism", "The Sarantine Mosaic is less idealized than earlier work, part of Kay's move from high fantasy toward historical realism.", *SH, "trajectory away from high fantasy towards historical realism")
add("diffuse plotting for ordinary lives", "Plotting is not always tightly focused, which lets Kay treat relations between ordinary people and rulers plausibly.", *SH, "the plot isn't always tightly focused")
add("grief permitted, not instrumentalized", "Unlike earlier books, a character is told she must weep and mourn rather than turn grief into purpose.", *SH, "she must weep for it, that she has to mourn")

SCOT = ("The Speculative Scotsman review of Tigana, 2010-01-05", "http://scotspec.blogspot.com/2010/01/book-review-tigana-by-guy-gavriel-kay.html")
add("musical ebb and flow", "Kay is lyrical, even musical, moving from brutality to beauty in the blink of an eye.", *SCOT, "the ebb and flow of the song he sings")
add("poetic, protracted, powerful", "The prose is poetic, protracted and powerful, with a deft touch that never dulls impact.", *SCOT, "deft without dumbfounding or ever dulling the impact")
add("minor-viewpoint chapters as texture", "Dianora's occasional chapters give depth and texture to the tragedy, complicating and alleviating it.", *SCOT, "Dianora's occasional chapters give depth and texture")
add("pervasive tragic sense", "An inescapable sense of tragedy pervades Tigana.", *SCOT, "inescapable sense of tragedy that pervades Tigana")

JER = ("Jeroen Admiraal review of Tigana, 2025-04-11", "https://jeroenthoughts.wordpress.com/2025/04/11/guy-gavriel-kay-tigana-1990-metaphor-versus-realism/")
add("wordiness (dissent)", "A dissenting reader finds Kay immensely wordy, waffling page after page on minor characters' deliberations.", *JER, "Kay's immense wordiness")
add("repetition of abstract motivation (dissent)", "Because the characters' motivation is abstract, Kay has to keep repeating it in the text.", *JER, "Kay has to keep repeating it in the text")
add("metaphor vs realism clash (dissent)", "Kay puts both a Dunsany-like dreamlike metaphor and realist political detail in one novel and the two clash.", *JER, "the metaphor and the reality, and the two clash")
add("eloquence as its own reward", "Even slow scenes can be savoured just for their writing.", *JER, "scenes and dialogues can be savoured just for their writing")

SHOUL = ("Simeon Shoul, infinity plus review of Lions, 2001-08-04", "http://www.infinityplus.co.uk/nonfiction/alrassan.htm")
add("mannered, deliberately styled prose (dissent)", "Shoul calls the prose quite mannered and deliberately styled, tipping into pretentiousness when combined with insisted-on tragedy.", *SHOUL, "quite mannered, quite deliberately styled")
add("narrator asserts brilliance (dissent)", "Characters compliment each other's cleverness and the narrator directly informs us they are brilliant.", *SHOUL, "he, as narrator, will directly inform us that they are brilliant")
add("fever-pitch heightening (dissent)", "Every emotional relationship is heightened to an almost unbearable fever-pitch.", *SHOUL, "an almost unbearable fever-pitch")
add("elegy as mode", "Lions is constructed as a striking tragedy, an elegy, a very poetic novel.", *SHOUL, "a very, very poetic novel")

OLS = ("Michal, 'Flippant Reviews: Guy Gavriel Kay', 2011-12-12", "https://onelastsketch.wordpress.com/2011/12/12/flippant-reviews-guy-gavriel-kay/")
add("lean early prose vs later digression", "Fionavar's often lean prose contrasts with the later tendency toward digression on historical import.", *OLS, "often lean prose")
add("rougher fragmentary register for the north", "In Last Light of the Sun the ornate style is cut down to rougher language rife with sentence fragments and strong images.", *OLS, "rife with sentence fragments and strong images")
add("'this was the moment' tic (dissent)", "Under Heaven repeats the intrusion that a character knew this was the moment that would change his life.", *OLS, "the moment that would change his life forever")
add("overwrought reminiscence (dissent)", "Tigana's reminiscences on the lost province read as overwrought to this reviewer.", *OLS, "overwrought reminisces")
add("verbal trickery hiding results (dissent)", "Lions hides the duel's result through verbal trickery until the last possible moment, which wears thin.", *OLS, "hides the result until the last possible moment")
add("told how to feel (dissent)", "Readers are told how to feel about historical moments rather than experiencing the consequences.", *OLS, "told how to feel")

RW = ("Chris McBean, Rowanwood Chronicles essay, 2025-12-24", "https://therowanwoodchronicles.blog/2025/12/24/fantasy-as-memory-the-historical-imagination-of-guy-gavriel-kay/")
add("cadence over density", "Kay's sentences favour cadence, balance and chosen imagery over density or excess.", *RW, "He favours cadence, balance, and carefully chosen imagery over density")
add("no invented terminology", "Kay does not bury the reader in invented terminology or ornate description.", *RW, "he does not bury the reader in invented terminology")
add("memory, foreknowledge, reflective distance", "Plotting leans on memory, foreknowledge and reflective distance so characters understand events retroactively.", *RW, "frequent use of memory, foreknowledge, and reflective distance")
add("see rather than judge", "The prose is careful to see people rather than judge them.", *RW, "prose is careful to see people rather than judge them")
add("emotion by omission", "Emotion is often conveyed by what is not said.", *RW, "Emotion is often conveyed by what is not said")
add("provisional triumph", "Triumphs are provisional and victories costly; joy is shadowed by loss.", *RW, "Triumphs are provisional. Victories are costly.")

C2C = ("Bob Tarantino, C2C Journal essay, 2016-09-07", "https://c2cjournal.ca/2016/09/the-fantastic-fiction-of-guy-gavriel-kay/")
add("narrator as lens on an existing place", "The narrator's voice feels like a lens on a place that already exists rather than a builder of one.", *C2C, "a lens on an existing place")
add("meditative not bombastic", "The pacing is meditative rather than bombastic.", *C2C, "meditative rather than bombastic")
add("elegiac tone of farewells", "Kay's writing is suffused with an elegiac tone and the gentle melancholy of farewells.", *C2C, "an elegiac tone and the gentle melancholy of farewells")
add("compact stand-alone form", "Kay's compact, spare style finds expression in succinct stand-alone books rather than series.", *C2C, "compact, spare style finds expression in succinct stand-alone books")

PAL = ("Joshua Palmatier, 'Altering the Familiar' (Tor.com Writers on Writing), 2016-07-06", "https://reactormag.com/2016/07/06/altering-the-familiar-tigana-by-guy-gavriel-kay/")
add("ninety-percent-familiar base", "Kay's worlds work because the base is essentially ninety percent familiar; the fantastic is contrast against the recognizable.", *PAL, "essentially 90 percent familiar")
add("alteration down to everyday ritual", "Kay alters the familiar through all aspects of life down to everyday rituals, myths and superstitions (the riselka).", *PAL, "down to arbitrary everyday rituals, including myths and legends and superstitions")
add("impressionistic language", "Kay's writing is evocative, even impressionistic in places, transporting with simple word choices and turns of phrase.", *PAL, "evocative, even impressionistic in places")

SOD = ("Scott Oden (novelist), 'A Quarter Turn', Substack, 2026-02-23", "https://soden.substack.com/p/a-quarter-turn")
add("functional fantasy that creates space", "Kay's fantasy is functional: it exists to create room to combine historical elements without breaking plausibility and to externalize psychology.", *SOD, "Kay's fantasy is functional. It's there to create space")
add("permission to universalize", "The fantasy element gives Kay permission to universalize a specific time and place.", *SOD, "the fantasy element gives him permission to universalize")
add("timeline compression", "Kay compressed four centuries of Iberian conflict into a single generation to heighten stakes.", *SOD, "compressed four centuries of conflict into a single generation")
add("Tolkien-like lyric landscape", "Oden notes the prose can turn lyrical in a Tolkien way — landscape and Deep Thoughts on mortality.", *SOD, "His prose can get lyrical in ways that remind me")

add("first-person retrospective frame", "A Brightness Long Ago opens and closes in an old man's first-person memory and moves through third-person viewpoints between.", "Fantasy Book Review, A Brightness Long Ago, 2019", "https://www.fantasybookreview.co.uk/Guy-Gavriel-Kay/A-Brightness-Long-Ago.html", "some of the same events through several different viewpoints")
add("elegant simplicity", "The language is elegant in its simplicity yet cuts to the core.", "Fantasy Book Review, A Brightness Long Ago, 2019", "https://www.fantasybookreview.co.uk/Guy-Gavriel-Kay/A-Brightness-Long-Ago.html", "language is elegant in its simplicity")
add("outskirts viewpoint", "Most of the narrative is spent with characters who dance along the outskirts of great events.", "Fantasy Book Review, A Brightness Long Ago, 2019", "https://www.fantasybookreview.co.uk/Guy-Gavriel-Kay/A-Brightness-Long-Ago.html", "characters who dance along the outskirts")

GM = ("Domise, Globe and Mail review of A Brightness Long Ago, May 2019", "https://www.theglobeandmail.com/arts/books/reviews/article-guy-kays-a-brightness-long-ago-returns-us-to-the-fictional-world-of/")
add("intrusive selecting narrator", "An almost invisible narrator surfaces to remind the reader that someone is choosing what to tell.", *GM, "Someone is deciding what to tell us.")
add("emotion from sparse description", "Kay wrings emotion from sparse description rather than elaboration.", *GM, "wringing emotion from sparse description")

CB = ("Casey Blair, Fantasy Book Critic review of River of Stars, 2013-03-26", "https://fantasybookcritic.blogspot.com/2013/03/river-of-stars-by-guy-gavriel-kay.html")
add("rhetorical repetition", "Kay uses rhetorical repetition without sounding pretentious.", *CB, "misuse rhetorical repetition and sound pretentious, but never Kay")
add("POV then pull-back to omniscience", "The narration alternates between character POVs and pulling back to a universal omniscient voice, fitting the story-vs-history theme.", *CB, "going between character POVs and pulling back")
add("the spaces between things", "Momentum comes from an understanding of what is not said, the spaces between things.", *CB, "understanding of what isn't said, the spaces between things")
add("one-off viewpoint characters", "Early chapters introduce many viewpoints including characters never seen again.", *CB, "characters we were never going to see again")

ST = ("Stefan, Far Beyond Reality review of River of Stars, 2013-04-02", "https://farbeyondreality.com/2013/04/02/river-of-stars-by-guy-gavriel-kay/")
add("sotto voce narration", "The tone is pensive and contemplative — a sotto voce narration with frequent pauses for reflection.", *ST, "a sotto voce narration with frequent pauses for reflection")
add("omniscient generalization as fatalism", "Occasional general observations inserted by an omniscient narrator give the story an ominous, fatalistic tone.", *ST, "a more ominous, even fatalistic tone")
add("simple imagery planted early", "Imagery is direct and simple, introduced in small ways early and paying off later with surprising force.", *ST, "direct and simple, carefully introduced in small ways early on")

add("coded dialogue", "Conversations consist of hidden meanings and patterned allusion; pages of internal dialogue surround them.", "Little Red Reviewer on Under Heaven, 2012-09-14", "https://littleredreviewer.wordpress.com/2012/09/14/under-heaven-by-guy-gavriel-kay/", "many conversations consist of hidden meanings")
add("lingering conversational pace", "Pace mirrors the culture: conversations linger through meals and music.", "Little Red Reviewer on Under Heaven, 2012-09-14", "https://littleredreviewer.wordpress.com/2012/09/14/under-heaven-by-guy-gavriel-kay/", "conversations that linger through meals")
add("necessary exposition only", "Kay's exposition is always necessary and worked seamlessly into the narrative.", "Floresiensis, Fantasy Book Review on Under Heaven", "https://www.fantasybookreview.co.uk/Guy-Gavriel-Kay/Under-Heaven.html", "his exposition always necessary")
add("lyrical without flowery", "Kay's writing is lyrical without being flowery; readers pause to savour single sentences.", "Ashley Barnard, Fantasy-Faction, 2011-03-16", "https://fantasy-faction.com/2011/the-world-of-guy-gavriel-kay", "lyrical without being flowery")

add("visible withholding", "A critical reader notes Kay's tendency to visibly withhold information, a trick used often.", "Bormgans, 'Weighing a pig' review of Lions, 2022-04-21", "https://schicksalgemeinschaft.wordpress.com/2022/04/21/the-lions-of-al-rassan-guy-gavriel-kay-1995/", "Kay's tendency to visibly withhold information")
add("over-repetition", "Certain things are repeated more often than necessary.", "Bormgans, 'Weighing a pig' review of Lions, 2022-04-21", "https://schicksalgemeinschaft.wordpress.com/2022/04/21/the-lions-of-al-rassan-guy-gavriel-kay-1995/", "certain things are maybe repeated too often")

RPG = ("RPGnet thread 'Talk to me of Guy Gavriel Kay'", "https://forum.rpg.net/index.php?threads/talk-to-me-of-guy-gavriel-kay.898766/")
add("heavy-handed narrator commentary (dissent)", "One gamer-reader finds the narrator commentary and foreshadowing heavy-handed, citing five and a half pages of portentous looks in Lions.", *RPG, "thinking portentous thoughts for five and a half pages")
add("adventure story vs people-in-history story", "Lions moves between an adventure story and a people-living-through-history story.", *RPG, "a people living through history story")
add("stripped-of-context ending", "Sarantium's passions are, over time, stripped of context and rendered into images on a wall — the mosaic as memory.", *RPG, "rendered into images on a wall and ultimately forgiven")

SFW = ("SFFWorld thread, 2011-12-06", "https://www.sffworld.com/forum/threads/question-regarding-guy-gavriel-kays-books.32913/")
add("dialogue-dominant scenes", "Scenes are often one long conversation of pure dialogue after another.", *SFW, "long conversation of pure dialogue after another")
add("orchestrated significance", "Kay writes in a controlled, orchestrated way where everything that happens is somehow important.", *SFW, "everything that happens is somehow important")
add("flashbacks and internal monologue", "Kay tends to use flashbacks and internal monologues a lot.", *SFW, "use flashbacks and internal monologues a lot")
add("tone varies subtly between books", "There are subtle differences in tone and manner between Kay's books.", *SFW, "subtle differences in his tone and manner of writing")

TT = ("Apocryphal, Tabletop Roleplayers' Book Club review, Dec 2018", "https://www.ttrpbc.com/discussion/120/novel-review-the-sarantine-mosaic-by-guy-gavriel-kay")
add("long denouement", "About a third of Sailing to Sarantium happens after the climax — a pacing lesson for GMs.", *TT, "About 1/3 of the book happens after the climax")
add("numinous not apprehended directly", "The divine is framed as not to be directly apprehended; horror is rendered through the mind's refusal.", *TT, "is not to be directly apprehended")
add("fragmentation under the numinous", "The quoted encounter with the god breaks into short, jagged clauses as the character's learning fails him.", *TT, "Terror consumed him, asserting mastery, dominance")
add("bodily detail grounding the uncanny", "The uncanny is grounded in animal and bodily detail — the trembling mule, the whining dogs.", *TT, "The mule trembled in every stiffened limb.")
add("history as verisimilitude well", "For game masters, Kay's lesson is to draw deeply from history for verisimilitude rivalling Tolkien or Martin.", *TT, "")

PP = ("Professor Pope GM blog, 2010-10-28", "https://www.professorpope.com/2010/10/inspiration-lions-of-al-rassan.html")
add("light touch of magic (GM lesson)", "A GM reads Lions as a setting with a light touch of magic where faith-analogues and intrigue supply texture.", *PP, "a light touch of magic")
add("story game not dungeon crawl", "Character-driven Kay material suits a story game like Burning Wheel rather than D&D.", *PP, "a story game a la Burning Wheel rather than D&D")

BAB = ("Ben Babcock, Kara.Reviews on The Fionavar Tapestry, 2010", "https://kara.reviews/the-fionavar-tapestry/")
add("uniform formal diction (early)", "In Fionavar every character speaks in the same formal, poetic diction, so the trilogy reads as one voice through many mouths.", *BAB, "774 pages of the same person talking")
add("diction switch with persona", "When a character inhabits the Guinevere persona her diction suddenly switches gears.", *BAB, "Her diction suddenly switches gears")

add("magic not dwelled on", "Magic is not much dwelled on in Tigana; readers never learn its details.", "Ivana Split, 'A Blue Review of Tigana', 2025-09", "https://modaodaradosti.blogspot.com/2025/09/a-blue-review-of-tigana-fantasy-novel.html", "Magic is not much dwelled on in this novel")
add("sad and serene", "The overall register of Tigana is a sad and serene story.", "Ivana Split, 'A Blue Review of Tigana', 2025-09", "https://modaodaradosti.blogspot.com/2025/09/a-blue-review-of-tigana-fantasy-novel.html", "sad and serene story")
add("beautiful but too much (dissent)", "A dissenting reader: Kay writes beautifully but there is often too much of it.", "Brok3n Engines review of Tigana, 2025-04-16", "https://www.brok3nengines.com/p/ggk-in-transition", "I often wish there was less of it.")
add("poet's asides to the reader", "Thierry's brief asides to the reader add colour and foreshadow what is to come.", "Bend, Goodreads blog on Written on the Dark, 2025-05-20", "https://www.goodreads.com/author_blog_posts/25773345-finding-the-light-in-written-on-the-dark-by-guy-gavriel-kay", "brief asides to the reader, some adding color")
add("story about who tells stories", "Written on the Dark is a story about stories — who tells them and how.", "Bend, Goodreads blog on Written on the Dark, 2025-05-20", "https://www.goodreads.com/author_blog_posts/25773345-finding-the-light-in-written-on-the-dark-by-guy-gavriel-kay", "story about stories – about who tells them")

# ---------------------------------------------------------------- validate
errs = []
urls = {s[1] for s in SOURCES}
cache = {}
for i,c in enumerate(C):
    q = c["quote"]
    if c["url"] not in urls: errs.append((i,"URL NOT IN SOURCES",c["url"]))
    if not q: continue
    if len(q.split()) > 11: errs.append((i,"TOO LONG",len(q.split()),q))
    p = LOCAL.get(c["url"])
    if not p or not os.path.exists(p): errs.append((i,"NO LOCAL TEXT",c["url"])); continue
    if p not in cache: cache[p] = norm(open(p,encoding="utf-8",errors="replace").read())
    if norm(q) not in cache[p]: errs.append((i,"NOT VERBATIM",p.split("/")[-1],q))
if errs:
    for e in errs: print("ERR",e)
    print(f"{len(errs)} errors; nothing written"); sys.exit(1)

sources = [{"title": t, "url": u, "kind": k, "substantive": s} for (t,u,k,s) in SOURCES]
result = {"claims": C, "sourcesRead": sources}
json.dump(result, open(f"{OUT}/found-kay-craft.json","w"), indent=1, ensure_ascii=False)

# ---------------------------------------------------------------- notes
by_url = {}
for c in C: by_url[c["url"]] = by_url.get(c["url"],0)+1
lines = ["# Sweep notes — Guy Gavriel Kay, craft-essay angle (novelists, editors, critics, game designers on HOW the prose works)",
 f"Generated {datetime.date.today().isoformat()}. Session web-search budget hit 200/200 (shared with sibling lanes) after ~35 Kay queries this session; the last two search rounds before the cap returned only already-seen pages, so the two-consecutive-empty stop condition was effectively met.", "",
 "## Method",
 "- Queries (representative): 'Kay prose style analysis sentence rhythm'; 'Home and Away essay quarter turn'; 'interview writing craft historical fantasy'; per-book prose reviews (Tigana, Lions, Under Heaven, Sarantine, River of Stars, Brightness, Written on the Dark); 'foreshadowing narrator would remember flash-forward'; 'brightweavings essays'; 'Jo Walton re-read'; 'game writing narrative designer'; 'Locus interview'; 'what writers can learn craft lessons'.",
 "- Every cited page was read. WebFetch succeeded for most; for pages that 403'd (LARB, Reactor x2, Locus x4, FantasyLiterature, RPGnet, CBC, Hotlist) the page was curl-fetched to kay-raw2/ or read from the earlier session's archived copy in kay-raw/ (Palmatier, FantasyLiterature). The Dalhousie Review PDF was read from its extracted text (kay-raw/clean/dalhousie.txt).",
 "- VERIFICATION: every non-empty quotation in found-kay-craft.json was matched verbatim (after curly-quote/whitespace/punctuation normalisation) against the locally saved raw text of its source by build-kay-craft-v2.py; the script refuses to write on any miss. Eleven quotations inherited from the earlier (never-completed) draft failed that check as paraphrases and were re-cut to verbatim text (HNR 'saga elements', HNR 'tenets', Big Idea 'yesterday's snows', Walton 'two pages', Kleander x2, Hatch 'colours', Allbery x2, Speculiction x3, ttrpbc 'numinous').",
 "- Dissenting critics (One Last Sketch, H.P., Bormgans, Shoul, Admiraal, Walton on withholding, RPGnet poster, Brok3n Engines) are labelled '(dissent)' so the same device appears from both sides.", "",
 "## Coverage by angle",
 "| angle | sources read | substantive |", "|---|---|---|",
 f"| Kay's own essays / interviews / AMA | {sum(1 for s in SOURCES if 'interview' in s[2] or 'author' in s[2] or 'Q&A' in s[2])} | most |",
 "| novelists writing about Kay's craft (Palmatier, Walton, Oden, Blair, Smith, Wisseman) | 6 | 6 |",
 "| critics (Wolfe, Harrison/Vector, Allbery, Cobb & Mohanraj, Shoul, Kilheffer/Sagara/Barbour/Langford, Tarantino, Domise) | 9 | 9 |",
 "| academic close-reading (Toyryla, Kleander, Rettino, Webb, Cobb, Ordway, Hatch, Cawsey) | 8 | 8 |",
 "| blog reviewers (incl. dissent) | ~20 | most |",
 "| game-design / GM sources (ttrpbc, Professor Pope, RPGnet) | 3 | 3 (thin) |", "",
 "## Convergent findings (several independent readers agree)",
 "1. **Veiled / commentating omniscience**: a tight third that also carries authorial commentary, foreshadowing and future-tense asides — Walton 'veiled omniscient', Allbery 'soundtrack', Blair 'pulling back', Stefan 'sotto voce', FantasyLiterature 'micro and macro' + 'it would afterwards be said' + 'would remember that afternoon', Harrison 'the implied narrator becomes a real narrator', Domise 'Someone is deciding what to tell us', Kleander's counted non-focalized insertions. Dissenters call the same device portentous / heavy-handed (Allbery, H.P., One Last Sketch, RPGnet, Shoul).",
 "2. **Withholding**: identity withheld for pages (Walton, Toyryla via minor focalizer, Kilheffer), aftermath-first then flashback (Tar Vol on), foreshadow-then-cut-away and dead-character misdirection (Wisseman), conspicuous off-stage action (Kilheffer, Harrison), the Lions duel engineered so grief runs both ways (Kay AMA; Langford 'screaming point'), the Rhun twist enabled by never focalizing him (Toyryla).",
 "3. **Competing tellings of one event**: same conversation from two participants differs (Kay, LARB); Ring Dive narrated twice or thrice (Toyryla); same events via several viewpoints (FBR); Uskoks seen by Venice vs themselves (Kay, Clarkesworld); Pertennius's biased chronicle and 'writers of history seek the dramatic over the truth' (Hatch); communal 'all the taverns agreed' focalization (Toyryla).",
 "4. **Register**: formal diction balanced by brevity (Speculiction); laconic sentences against lyric (Anywayward); pluperfect-heavy (Walton); cadence over density, no invented terminology (Rowanwood); 'lyrical without flowery' (Barnard); elevated / superlative-rich house register (Harrison); 'stately' (Harrison); detached-historian voice for River of Stars and saga form for Last Light (Kay); rougher fragment-rich register for the north (One Last Sketch); sparer late style opening on a fragment (FantasyLiterature); present tense for women's viewpoint sections in Under Heaven (Harrison); archaic inversion for the numinous (Ordway); contemporary idiom occasionally leaks (Kilheffer); tonal switching within a book as a stated value (Kay, Fantasy Cafe).",
 "5. **Restraint**: stiletto not bludgeon (Kay); emotion by what is not said (Rowanwood, Blair); sparse description (Domise); matter-of-fact atrocity (Toyryla, Langford); oblique violence (Anywayward); glinting / unexplained magic (Walton, Kay AMA, Elitist, Wolfe, Cawsey 'no daylight upon magic'); 'stays within itself' (Allbery). Counter-reading: mannered, fever-pitch, told-how-to-feel (Shoul, One Last Sketch, H.P.).",
 "6. **Ordinary people / no minor characters**: walk-ons given depth (Wolfe); refusal of 'minor' (FantasyLiterature); secondary characters as could-have-been novels, a saga motif (Kay AMA); interludes for peripheral lives (Smith); one-off viewpoints (Blair); crowd viewpoints at the chariot race (Walton); farmer vs emperor (Kay, Cawsey); 'value to lives that go unrecorded' (Kay).",
 "7. **History as residue / melancholy**: 'left behind and yet stayed with you' (Cobb); memory, foreknowledge, reflective distance (Rowanwood); provisional triumphs; elegiac close (Rettino); chronology opening at the end (Wolfe); threnody (Harrison); 'elegiac tone and the gentle melancholy of farewells' (Tarantino); sweet-and-sorrowful (FantasyLiterature); grief permitted rather than instrumentalized (Cobb & Mohanraj).",
 "8. **The quarter turn as craft, not decoration**: it admits inaccuracy (Kay, Clarkesworld), renders period belief as fact and removes smugness (Kay LARB/Cook/Cawsey), universalizes (Home and Away, Locus 2007, Dalhousie, Oden), reopens suspense over known history (Walton, Locus 2000), telescopes centuries (Locus 2000, Oden), and alters the familiar down to everyday ritual (Palmatier).", "",
 "## Game-design angle",
 "- Thin. Found: a tabletop book-club review (ttrpbc: long denouement, the numinous rendered through fragmentation and bodily detail), a GM blog (Professor Pope: light-touch magic, story-game not D&D), an RPGnet thread (a poster's dissent on portentous narration). Kay himself contrasts his unexplained magic with 'gaming-inspired fantasy' that goes into rules and clarity (AMA) and deplores 'the minutiae of figuring out magic systems' (Locus 2000). No professional narrative designer citing Kay was found; the search budget closed before a 'Dragon Age / BioWare writers on Kay' probe could run.", "",
 "## Not found / open",
 "- Kay's Tigana tenth-anniversary afterword full text (only an excerpt on BrightWeavings). Locus 'Journeying' feature and Wolfe's Locus review of A Brightness Long Ago (not archived). The full-length 'Home and Away' exists on the old BrightWeavings site (local copy read) but its live URL is unknown, so all Home and Away quotations cite the Globe and Mail version at brightweavings.com/globe/, which contains every quoted passage. Jo Walton's tor.com pieces on Tigana and Arbonne could not be re-fetched (Reactor 403) and are not cited.", "",
 "## Sources read", ""]
for s in sources:
    lines.append(f"- [{'S' if s['substantive'] else '-'}] {s['title']} — {s['kind']} — {s['url']} ({by_url.get(s['url'],0)} claims)")
lines += ["", "## Claims", ""]
for c in C:
    q = f' — "{c["quote"]}"' if c["quote"] else ""
    lines.append(f"- **{c['feature']}** — {c['claim']} ({c['source']}; {c['url']}){q}")
open(f"{OUT}/find-kay-craft.md","w").write("\n".join(lines)+"\n")
print("claims", len(C), "sources", len(sources), "substantive", sum(1 for s in sources if s["substantive"]), "quoted", sum(1 for c in C if c["quote"]))
