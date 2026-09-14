import json, sys
S = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/sweep"

U = {
 "jordan": "https://gwern.net/doc/fiction/gene-wolfe/1992-jordan.pdf",
 "jordan_orig": "https://web.archive.org/web/20140725102806/http://mysite.verizon.net/~vze2tmhh/wolfejbj.html",
 "person": "https://gwern.net/doc/fiction/gene-wolfe/2007-person.pdf",
 "person_repost": "http://losarciniegas.blogspot.com/2021/04/suns-new-long-and-short-interview-with.html",
 "cw2008": "https://clarkesworldmagazine.com/wolfe_interview/",
 "cw2015": "https://clarkesworldmagazine.com/wolfe_interview_2015/",
 "blackgate": "https://www.blackgate.com/2010/11/23/and-it-goes-on-from-there-an-interview-with-gene-wolfe/",
 "wotf": "https://writersofthefuture.com/forum/interviews-entrants-judges-past-winners/writing-advice-from-gene-wolfe/",
 "mit": "https://www.technologyreview.com/2014/07/25/12916/a-qa-with-gene-wolfe/",
 "locus2002": "https://www.locusmag.com/2002/Issue09/GaimanWolfe.html",
 "locus2011": "https://locusmag.com/2011/03/gene-wolfe-engineering-the-future/",
 "sfsite2002": "https://web.archive.org/web/20020703232613/http://www.sfsite.com/03b/gw124.htm",
 "infinityplus": "https://www.infinityplus.co.uk/nonfiction/intgw.htm",
 "baber": "https://web.archive.org/web/20060208231553/http://mysite.verizon.net/~vze2tmhh/wolfeint.html",
 "cc77": "https://ansible.uk/cc/cc77.html",
 "mountains": "https://web.archive.org/web/2004/http://home.clara.net/andywrobertson/wolfemountains.html",
 "mountains_repost": "https://scifiwright.com/2011/05/gene-wolfe-on-jrr-tolkien-the-best-introduction-to-the-mountains/",
 "gaiman": "https://web.archive.org/web/2008/http://www.sfsite.com/fsf/2007/gwng0704.htm",
 "gaiman_journal": "https://journal.neilgaiman.com/2007/03/gene-wolves.html",
 "barach": "https://barach.us/2007/03/03/how-to-read-gene-wolfe/",
 "sfe": "https://sf-encyclopedia.com/entry/wolfe_gene",
 "evenson": "https://reactormag.com/what-makes-an-unreliable-narrator-severians-voice-in-gene-wolfes-the-book-of-the-new-sun/",
 "gerwel": "https://aidanmoher.com/blog/featured-article/2014/07/gene-wolfe-reliably-unreliable-author-chris-gerwel/",
 "ewing": "https://www.murrayewing.co.uk/mewsings/2010/09/11/the-secret-to-reading-gene-wolfe/",
 "larb": "https://lareviewofbooks.org/article/we-read-things-differently/",
 "jacobs": "https://blog.ayjay.org/peace-peace/",
 "solute": "https://www.the-solute.com/blind-reads-peace-by-gene-wolfe/",
 "fernandes": "https://reactormag.com/peace-wolfes-masterful-rumination-on-nostalgia-memory-and-uncertainty/",
 "knode": "https://reactormag.com/gene-wolfe-peace-review/",
 "michel": "https://countercraft.substack.com/p/why-you-should-read-gene-wolfe-and",
 "khanna": "https://litreactor.com/columns/primer-gene-wolfe-the-subtle-master/",
 "crossley": "https://www.full-stop.net/2012/12/12/blog/james-crossley/gene-wolfe/",
 "locus2009": "https://locusmag.com/2009/04/reading-gene-wolfe/",
 "waggish": "https://www.waggish.org/2007/gene-wolfe-the-book-of-the-new-sun/",
 "aramini2020": "https://ultan.org.uk/everything-has-to-be-true-somehow/",
 "aramini2013": "https://ultan.org.uk/shadows-of-the-new-sun-an-interview-with-marc-aramini/",
 "dmr": "https://dmrbooks.com/test-blog/2019/5/10/books-of-gold-reading-gene-wolfe",
 "person_rip": "https://www.lawrenceperson.com/?p=18206",
 "ww_otter": "https://www.wolfewiki.com/pmwiki/pmwiki.php?n=WolfeWiki.TheCastleOfTheOtter",
 "ww_shadows": "https://www.wolfewiki.com/pmwiki/pmwiki.php?n=BooksAbout.ShadowsOfTheNewSun",
 "ww_interviews": "https://www.wolfewiki.com/pmwiki/pmwiki.php?n=WolfeWiki.Interviews",
 "ww_gaiman": "https://www.wolfewiki.com/pmwiki/pmwiki.php?n=OnlineArticles.HowToReadGeneWolfe",
 "ww_jordan": "https://www.wolfewiki.com/pmwiki/pmwiki.php?n=Interviews.Jordan",
 "ww_nova": "https://www.wolfewiki.com/pmwiki/pmwiki.php?n=Interviews.NovaExpress",
 "ww_thrust": "https://www.wolfewiki.com/pmwiki/pmwiki.php?n=Interviews.Thrust19",
 "ww_mountains": "https://www.wolfewiki.com/pmwiki/pmwiki.php?n=OnlineNonfiction.TheBestIntroductionToTheMountains",
}

sources = [
 ("Gene Wolfe Interview (James B. Jordan, World Fantasy Convention, 30 Oct 1992; Shadows of the New Sun ch. 9, 2007)", U["jordan"], "interview (author's own words), PDF", True),
 ("James B. Jordan 1992 interview, original Lupine Nuncio text (same interview, pre-2007 edit)", U["jordan_orig"], "interview (author's own words), archived duplicate", True),
 ("Suns New, Long, and Short: An Interview with Gene Wolfe (Lawrence Person, Nova Express Fall/Winter 1998; Shadows of the New Sun ch. 12)", U["person"], "interview (author's own words), PDF", True),
 ("Repost of the Person 1998 interview (losarciniegas blog)", U["person_repost"], "repost of interview", False),
 ("An Interview with Gene Wolfe by Jeremy L. C. Jones (Clarkesworld 23, Aug 2008)", U["cw2008"], "interview (author's own words)", True),
 ("The Humble Swashbuckling Grandmaster: A Conversation with Gene Wolfe (Kate Baker, Clarkesworld 111, Dec 2015)", U["cw2015"], "interview (author's own words)", True),
 ("'And It Goes On From There...' An Interview with Gene Wolfe (C.S.E. Cooney, Black Gate, 23 Nov 2010)", U["blackgate"], "interview (author's own words)", True),
 ("Writing advice from Gene Wolfe (Writers of the Future forum repost of the Black Gate top five)", U["wotf"], "forum repost", False),
 ("A Q&A with Gene Wolfe (MIT Technology Review, 25 Jul 2014)", U["mit"], "interview (author's own words)", True),
 ("The Wolfe & Gaiman Show: Locus interview excerpts (Sept 2002)", U["locus2002"], "interview excerpts (author's own words)", True),
 ("Gene Wolfe: Engineering the Future (Locus, March 2011, excerpts)", U["locus2011"], "interview excerpts (author's own words)", True),
 ("A Magus of Many Suns: An Interview with Gene Wolfe (Nick Gevers, SF Site, Jan 2002)", U["sfsite2002"], "interview (author's own words), Wayback copy", True),
 ("Some Moments with the Magus: An Interview with Gene Wolfe (Gevers, Andre-Driussi, Jordan; Infinity Plus, Dec 2003)", U["infinityplus"], "interview (author's own words)", True),
 ("Gene Wolfe Interview conducted 20 Mar 1994 by Brendan Baber (Lupine Nuncio)", U["baber"], "interview (author's own words), Wayback copy", True),
 ("Cloud Chamber 77: 'The Wolfean Oracle Speaks' — Wolfe answers Whorl-list questions, mediated by Michael Andre-Driussi, annotated by David Langford (Sept 1997)", U["cc77"], "Q&A (author's own words)", True),
 ("The Best Introduction to the Mountains, by Gene Wolfe (Interzone 174, Dec 2001; Andy Robertson's site)", U["mountains"], "essay (author's own words), Wayback copy", True),
 ("Gene Wolfe on JRR Tolkien: The Best Introduction to the Mountains (John C. Wright's Journal repost of the opening, 2011)", U["mountains_repost"], "partial repost of essay", False),
 ("How to Read Gene Wolfe, by Neil Gaiman (WHC 2002 program book; F&SF April 2007 web page)", U["gaiman"], "critical essay (Gaiman)", True),
 ("Neil Gaiman's Journal: Gene wolves (2 Mar 2007)", U["gaiman_journal"], "blog post (Gaiman)", False),
 ("Kata Iwannhn: How to Read Gene Wolfe (John Barach, 3 Mar 2007)", U["barach"], "blog post", False),
 ("SFE: Wolfe, Gene (John Clute; entry updated 13 Jul 2026)", U["sfe"], "encyclopedia entry (Clute)", True),
 ("What Makes an Unreliable Narrator: 'Severian's' Voice in Gene Wolfe's The Book of the New Sun (Brian Evenson, Reactor, 8 Dec 2021)", U["evenson"], "critical essay", True),
 ("Gene Wolfe: The Reliably Unreliable Author (Chris Gerwel, A Dribble of Ink, 28 Jul 2014)", U["gerwel"], "critical essay", True),
 ("The Secret to Reading Gene Wolfe (Murray Ewing, Mewsings, 11 Sep 2010)", U["ewing"], "blog essay", True),
 ("We Read Things Differently (Los Angeles Review of Books, 30 Apr 2013; review of Peace by the author of the 1986 Starmont Reader's Guide, i.e. Joan Gordon)", U["larb"], "review essay; quotes Wright (Attending Daedalus) and Borski", True),
 ("Peace, Peace (Alan Jacobs, The Homebound Symphony, 20 Apr 2024)", U["jacobs"], "blog essay", True),
 ("Blind Reads: Peace by Gene Wolfe (Avathoir and Grant Nebel, The Solute, 28 Nov 2017)", U["solute"], "close-reading dialogue", True),
 ("Peace: Wolfe's Masterful Rumination on Nostalgia, Memory, and Uncertainty (Fabio Fernandes, Reactor, 11 Jul 2019)", U["fernandes"], "reread essay", True),
 ("Gene Wolfe's Peace Will Leave You Anything But Peaceful (Mordicai Knode, Reactor, 26 Oct 2012)", U["knode"], "review essay", True),
 ("Why You Should Read Gene Wolfe (and Where to Start) (Lincoln Michel, Counter Craft, 8 Jan 2026)", U["michel"], "blog essay", True),
 ("Primer: Gene Wolfe - The Subtle Master (Rajan Khanna, LitReactor, 10 Oct 2012)", U["khanna"], "primer essay", True),
 ("Gene Wolfe (James Crossley, Full Stop, 12 Dec 2012)", U["crossley"], "blog essay", False),
 ("Reading Gene Wolfe: 'The Toy Theater' (Locus Online blog, 13 Apr 2009, with reader comments)", U["locus2009"], "close reading with comments", True),
 ("Gene Wolfe: The Book of the New Sun (David Auerbach, Waggish, 23 Nov 2007) — dissenting reading", U["waggish"], "critical blog essay (dissent)", True),
 ("Everything has to be true somehow — Marc Aramini interviewed by Nigel Price (Ultan's Library, 8 Jun 2020)", U["aramini2020"], "critic interview (Aramini)", True),
 ("Shadows of the New Sun: Marc Aramini (Ultan's Library, 29 May 2013)", U["aramini2013"], "critic interview (Aramini)", True),
 ("Books of Gold: Reading Gene Wolfe (DMR Books blog, 10 May 2019)", U["dmr"], "blog essay", True),
 ("Gene Wolfe, RIP (Lawrence Person's Futuramen, 16 Apr 2019)", U["person_rip"], "obituary blog post", True),
 ("WolfeWiki: The Castle of the Otter (1982) — contents and SFBC jacket blurb", U["ww_otter"], "reference page", True),
 ("WolfeWiki: Shadows of the New Sun (ed. Peter Wright, 2007) — table of contents incl. Wolfe's essays on craft", U["ww_shadows"], "reference page", False),
 ("WolfeWiki: Interviews with Wolfe (index of ~80 interviews, 1973-2015)", U["ww_interviews"], "reference index", False),
 ("WolfeWiki: How to Read Gene Wolfe (pointer page)", U["ww_gaiman"], "reference page", False),
 ("WolfeWiki: James B. Jordan 1992 Interview (pointer page)", U["ww_jordan"], "reference page", False),
 ("WolfeWiki: 'Suns New, Long, and Short', Nova Express 1998 (pointer page)", U["ww_nova"], "reference page", False),
 ("WolfeWiki: Interview: Gene Wolfe -- 'The Legerdemain of the Wolfe' (Thrust 19, 1983; pointer page, text not online)", U["ww_thrust"], "reference page", False),
 ("WolfeWiki: The Best Introduction to the Mountains (pointer page)", U["ww_mountains"], "reference page", False),
]

# (feature, claim, source label, url key, page/section, quote)
C = [
 # ---- Wolfe's own words: Jordan 1992
 ("single-placement of clues", "Wolfe plants each clue exactly once and refuses to repeat it, on the principle that a clue told five times is written for someone dumber than the reader.", "Jordan 1992 interview (Shadows of the New Sun)", "jordan", "p. 121 (Soldier of Arete / Card's complaint)", "I try not to leave a clue more than once"),
 ("surplus of clues, solvability", "He says he leaves all the clues a reader will need and often more, because in real detection the work is finding more clues, not reasoning harder from a few.", "Jordan 1992 interview", "jordan", "p. 121", "very little of it consists of reasoning from clues"),
 ("confusion as surface, pattern beneath", "Wolfe denies writing perspectival novels where confusion is the point: the clues are there, the puzzles are meant to be solved, and superficial confusion is simply how life looks before you think about it.", "Jordan 1992 interview", "jordan", "p. 127 (Castleview)", "Life seen superficially has very little pattern to it."),
 ("style suited to the story; journalistic third person", "He writes each book in the style its story calls for; the third-person Long Sun therefore came out as plain, journalistic prose rather than the stylized first-person of the Severian books.", "Jordan 1992 interview", "jordan", "p. 103", "pretty much straightforward journalistic prose"),
 ("divergent-witness perception", "In Castleview different characters see the same unexplained thing as cowboys, Arthurian knights or a spaceship, modelled on anomaly reports where two witnesses describe a third thing differently.", "Jordan 1992 interview", "jordan", "p. 126", "two witnesses who have very different stories"),
 ("supernatural premise to license memory's vividness", "Wolfe made Weer a dead man rather than a reminiscing old man so the remembered rooms could be re-created with a strength ordinary reminiscence could not justify.", "Jordan 1992 interview", "jordan", "p. 115 (Peace)", "lend to the memories certain supernatural strengths"),
 ("ghost making sense of his life", "He conceived Peace not as purgatory but as a ghost trying to make sense of his own life, and accepts purgatory as another way of saying the same thing.", "Jordan 1992 interview", "jordan", "p. 116", "a ghost trying to make sense of his own life"),
 ("amnesiac narrator as social allegory", "The Soldier books are built to show the problems of a genuinely good man who cannot remember, which Wolfe maps onto a decent society that has no awareness of its history.", "Jordan 1992 interview", "jordan", "p. 118", "a genuinely good man who can't remember"),
 ("writing the pagan world from inside its belief", "For the Soldier books he wrote the ancient world as the pagans wrote about it rather than through the rationalist modern historian, so gods appear as the characters expected them to.", "Jordan 1992 interview", "jordan", "p. 117", "as the pagans themselves wrote about it"),
 ("memory palace as structural device", "Wolfe says he used the memory-palace system of Simonides in the Soldier books.", "Jordan 1992 interview", "jordan", "p. 107", "made use of the memory palace system"),
 ("local symbolic touches, no allegory", "He says symbolic details arrive as local impulses ('that's neat; I'll do that') and denies the books are allegories.", "Jordan 1992 interview", "jordan", "p. 118", "The book isn't intended as an allegory."),
 ("voice imitation and style-spotting", "Wolfe claims he can identify a writer from a paragraph or two and could write imitation Shakespeare or Lewis that passes, a self-described knack for voice.", "Jordan 1992 interview", "jordan", "p. 103", "I am a good imitator."),
 ("Vance-derived rewrite", "He describes the Severian books as in part his decision to rewrite The Dying Earth from his own standpoint, openly acknowledging Vance and Clark Ashton Smith.", "Jordan 1992 interview", "jordan", "p. 103", "rewrite The Dying Earth from my own standpoint"),
 ("typos as false clues", "Asked whether he invented any words, Wolfe answers that some odd words in the New Sun are typos, warning readers against treating every oddity as a clue.", "Jordan 1992 interview", "jordan", "p. 128", "some of them are typos"),
 ("picturesque language for unstatable actualities", "He reads scriptural images (the apple, the sky rolled up) as figurative language giving a general idea to an audience unable to grasp the actuality, a model for conveying meaning in pictures.", "Jordan 1992 interview", "jordan", "p. 129", "figurative language to try to give a general idea"),
 # ---- Person 1998
 ("first person implies unreliability", "Any narrator who is a person inside the story is going to be unreliable; five or six honest courtroom witnesses to one event all report different things.", "Person 1998 (Nova Express) interview", "person", "pp. 168-169 (Fifth Head)", "the narrator is damn well going to be unreliable"),
 ("unattributed dialogue by idiolect and content", "Speakers in crowded Long Sun scenes are identified without tags by characteristic phrases or mistakes and by each saying only what that character would say in that circumstance.", "Person 1998 interview", "person", "p. 168", "saying something that only Maytera Marble would say"),
 ("clear structure for complex story", "The more complex the story, the clearer its narrative structure must be; shaken up, a ten-thousand-part machine is just a box of junk.", "Person 1998 interview", "person", "p. 169", "it isn't complex, it's simply confused"),
 ("archaic real words, not coinages", "For the New Sun he refused Tars-Tarkas-style invented names and used archaic names and terms in contexts where the reader can work out what is meant.", "Person 1998 interview", "person", "p. 173", "not coining Tars Tarkas type names"),
 ("dictionary method for anglicised terms", "He finds the Latin or Greek word for the thing he needs, then searches unabridged dictionaries on the assumption that someone once anglicised it, often finding an 18th-century citation.", "Person 1998 interview", "person", "p. 173", "someone will have anglicised this term"),
 ("false-author framing", "In Fifth Head the story attributed to John V. Marsch is actually written by the shadowchild who replaced him, a trick Wolfe concedes is New Wave.", "Person 1998 interview", "person", "p. 169", "not actually written by John V. Marsch"),
 ("diversity of registers within one world", "Wolfe rejects monocultured SF worlds as mental sloth, noting that in one big city people at different social levels already speak almost different languages.", "Person 1998 interview", "person", "pp. 172-173", "Mental sloth more than anything else."),
 # ---- Clarkesworld 2008
 ("revision turns synopsis into hard facts", "Wolfe often first writes synopsis and in revision lengthens it, turning generalities into hard facts and making each speaker talk as she talks.", "Clarkesworld 2008 (Jones)", "cw2008", "", "I turned generalities into hard facts."),
 ("show cruelty, never state it", "He forbids himself sentences like 'Nick was a bad man and a cruel man' and must instead show Nick being bad within the story.", "Clarkesworld 2008 (Jones)", "cw2008", "", "Easy writing makes damned hard reading."),
 ("four-draft ceiling", "He stops when he can no longer tell whether changes improve the piece, usually after four drafts; a fifth that reverts to the second is a bad sign.", "Clarkesworld 2008 (Jones)", "cw2008", "", "A fifth draft may find me reverting"),
 ("dialogue as triple-duty action", "Dialogue must entertain, forward the plot and characterize the speaker at once, and sound like what that speaker would say to that person then.", "Clarkesworld 2008 (Jones)", "cw2008", "", "Dialogue is action."),
 ("distinct idiolect for minor characters", "Even unimportant characters must speak differently from one another; students reject this because everybody sounds alike to them.", "Clarkesworld 2008 (Jones)", "cw2008", "", "The butler mustn't sound like the footman"),
 ("concrete over abstract", "Like poetry and song, fiction demands the concrete; he contrasts an abstract shipwreck summary with a ballad naming the ship, the cargo and the shoal.", "Clarkesworld 2008 (Jones)", "cw2008", "", "fiction demands the concrete"),
 ("expectation and satisfaction as story engine", "A short story works by engendering expectations and satisfying them; he told a student to post a sign reading 'I AM GOING TO TELL YOU SOMETHING COOL'.", "Clarkesworld 2008 (Jones)", "cw2008", "", "engendering expectations and satisfying them"),
 ("fantasy as the truer register", "Realistic fiction leaves out far too much of human experience; fantasy is nearer the truth.", "Clarkesworld 2008 (Jones)", "cw2008", "", "Realistic fiction leaves out far, far too much."),
 ("style as suitability, not ornament", "Style should suit the story; a wrong style is comic for ten pages, and the narrator's voice is inseparable from style.", "Clarkesworld 2008 (Jones)", "cw2008", "", "the style should suit the story"),
 # ---- Clarkesworld 2015
 ("narrator may comment; author may not", "First person puts the reader inside the story and lets the narrator comment on actions, whereas authorial comment is usually ruinously bad.", "Clarkesworld 2015 (Baker)", "cw2015", "", "it's usually ruinously bad"),
 ("two kinds of unreliable narrator", "Narrators are either openly unreliable or pretend to be totally reliable, but all are unreliable because people write books and people cannot be trusted.", "Clarkesworld 2015 (Baker)", "cw2015", "", "narrators that pretend to be totally reliable"),
 ("reader sees self in the text", "Off-the-wall interpretations no longer surprise him because readers look into the story and see themselves.", "Clarkesworld 2015 (Baker)", "cw2015", "", "what they are seeing is themselves"),
 ("villain never self-identifies", "Fictional villains have narrow viewpoints; a real villain never thinks he is a villain, which shapes how bad men narrate themselves.", "Clarkesworld 2015 (Baker)", "cw2015", "", "a real villain never thinks he's a villain"),
 # ---- Black Gate 2010
 ("show it and shut up", "Characterization is done only by showing the character thinking, speaking and acting characteristically, never by telling the reader about him.", "Black Gate 2010 (Cooney)", "blackgate", "Top five advice", "You simply show it and shut up."),
 ("destination before departure", "Do not start a story without an ending in mind; the ending may change but there must always be a destination.", "Black Gate 2010 (Cooney)", "blackgate", "Top five advice", "you should always have a destination"),
 ("details decided in the writing", "He does almost no research before writing and fills in world details as he reaches them, researching as he goes (what Greeks ate for breakfast: nothing).", "Black Gate 2010 (Cooney)", "blackgate", "", "I do research while I'm writing the book."),
 ("withheld name learned by deduction", "In 'The Tree Is My Hat' the ex-wife's name Mary Christmas is never stated; the reader finds it out by deduction.", "Black Gate 2010 (Cooney)", "blackgate", "", "you find out by deduction"),
 ("concrete image before concept", "Severian began as a costume (boots, trousers, no shirt, cloak, mask, sword) from which Wolfe deduced the man, an executioner.", "Black Gate 2010 (Cooney)", "blackgate", "", "He's an executioner."),
 ("padding admitted", "Wolfe says the storytelling contest in the third New Sun volume is strictly padding added when the publisher split the book.", "Black Gate 2010 (Cooney)", "blackgate", "", "a storytelling contest that's strictly padding"),
 # ---- MIT Technology Review 2014
 ("later style loosened under criticism", "Wolfe attributes the shorter paragraphs and looser tone of his later books to criticism for being unreadable and overcomplex, after which he decided to loosen up.", "MIT Technology Review 2014", "mit", "Editing and writing", "criticism for being unreadable and overcomplex"),
 ("difficulty as duty to the reader", "He sets himself hard technical challenges with narrators because an author who makes everything easy for himself bores the reader.", "MIT Technology Review 2014", "mit", "Unreliable narrators and craft", "you bore the reader"),
 ("ghost who does not know he is dead", "Weer's unreliability is that he is a ghost, and ghosts often do not realize they are dead.", "MIT Technology Review 2014", "mit", "Unreliable narrators and craft", "Ghosts often don't realize they're dead."),
 ("narrator talking himself into a false identity", "Marsch in Fifth Head knows he is not a real Earthman but is trying to talk himself into believing he is.", "MIT Technology Review 2014", "mit", "Unreliable narrators and craft", "trying to talk himself into believing that he is"),
 ("naive observer reports without interpreting", "A naive observer is more interesting because he gives only what he has seen, whereas adult witnesses cannot separate what they saw from what it means.", "MIT Technology Review 2014", "mit", "Unreliable narrators and craft", "he's just giving you what he has seen"),
 ("perfect memory and daily amnesia as inverse designs", "Having built Severian to forget nothing, Wolfe built Latro from a real brain injury to forget everything.", "MIT Technology Review 2014", "mit", "Unreliable narrators and craft", "let's do one of these guys who forgets everything"),
 ("all narrators unreliable because subjective", "Every narrator is unreliable because each sees from his own standpoint and not another's.", "MIT Technology Review 2014", "mit", "Unreliable narrators and craft", "They're all unreliable. Well, we all are, aren't we?"),
 ("epistolary entry with per-writer style shifts", "He recommends The Sorcerer's House as an entry point because the epistolary form helps readers, provided they accept the style changing with each letter writer.", "MIT Technology Review 2014", "mit", "Editing and writing", "the style changes from one letter writer to another"),
 ("war as perceptual register", "Military service teaches you to look at scenery as defensive positions, the perception behind Severian's line that war is a new geography.", "MIT Technology Review 2014", "mit", "War and religion", "look at scenery from a standpoint of defensive positions"),
 # ---- Locus 2002
 ("cut every unneeded word", "Wolfe learned prose from a college editor who blue-pencilled every word a sentence did not require, and he wrote the next story so it could not be cut.", "Locus Sept 2002 (Gaiman/Wolfe)", "locus2002", "", "taking out every word the sentence"),
 ("rereadable with increased pleasure", "His definition of good literature is what an educated reader can read and reread with increased pleasure, and he refuses to write fiction that gives everything up on first reading.", "Locus Sept 2002 (Gaiman/Wolfe)", "locus2002", "", "reread with increased pleasure"),
 ("refusal to settle readers' arguments", "He will not adjudicate readers' theories about the text because he argues from presumed expertise on an unlevel field, and there is no sacredness to the text.", "Locus Sept 2002 (Gaiman/Wolfe)", "locus2002", "", "no sacredness to the text"),
 ("unconscious content acknowledged", "Wolfe says readers will see things in the books he does not see consciously, and that he likes those things.", "Locus Sept 2002 (Gaiman/Wolfe)", "locus2002", "", "I like those things."),
 ("Peace built on lies (Gaiman) vs. 'I never lie'", "Gaiman calls Wolfe the master of lying in fiction and says Peace is built on lies decipherable after three or four readings; Wolfe replies that he never lies.", "Locus Sept 2002 (Gaiman/Wolfe)", "locus2002", "", "I never lie."),
 ("fiction as assurance that things need not be as they are", "The most important thing fiction does is assure the reader that things need not be as they are now, which Wolfe names hope.", "Locus Sept 2002 (Gaiman/Wolfe)", "locus2002", "", "the most important thing is hope"),
 # ---- Locus 2011
 ("every line does several jobs", "Anything in a book must do several things at once (tone, plot, character); a 'pass the salt' line is waste unless said in a particular way or for a purpose.", "Locus March 2011 excerpts", "locus2011", "", "you really have to be doing several things at once"),
 # ---- SF Site 2002
 ("voice appropriate to the story", "Wolfe denies his style has changed at all: he writes in a voice appropriate to the story he has to tell.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "I write in a voice appropriate to the story"),
 ("difficulty equals unsuited style", "A style becomes difficult only when it is not suited to what is being said; if it is the right style he likes it, if not he changes it.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "A style becomes difficult when it is not suited"),
 ("speech modes from listening", "Character speech comes from listening to what people actually say as well as what they mean; Remora and Incus are slight exaggerations of real people, and Oreb manages only two syllables.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "what they actually say as well as what they mean"),
 ("narrator discovered mid-draft", "For about half the first draft of Long Sun Wolfe did not know who was writing it, considered Maytera Marble, settled on Horn and rewrote accordingly.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "I didn't know who was writing"),
 ("third person would be dead on the page", "He chose Short Sun's interwoven narrators because telling it in third person would have been dead on the page; the difficulty was balancing storylines.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "it would have been dead there on the page"),
 ("secondary narrators reconstruct honestly but fallibly", "Daisy, principal writer of the Whorl chapters, strings others' accounts into plausible incidents and has deliberately falsified nothing, leaving errors to ignorance not intent.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "She has deliberately falsified nothing."),
 ("telltale signs answer the riddle", "Asked directly whether Pig is a godling, Wolfe says certainly, since there are telltale signs all through the book.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "There are telltale signs all through the book."),
 ("the reader is expected to get it", "He is surprised readers missed the inhumi secret (they prey on us because we prey on each other), which he thought everyone would get.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "I thought that everyone would get it"),
 ("Chekhov's gun, 'only when it's funny'", "Wolfe cites Roger Rabbit slipping the handcuffs 'only when it's funny' as the law binding writers: a gun on the wall in Act I must be fired.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "No, only when it's funny."),
 ("story built backward from an ending image", "He constructs a clued short story from one or more ideas and an ending image, answering the questions that image raises before writing.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "I have one or more ideas, and an ending"),
 ("limpid simplicity and baroque density (Gevers)", "Gevers characterizes Wolfe's range as writing alternately with limpid simplicity and formidable baroque density of diction, in the service of oblique many-layered fictions.", "SF Site Jan 2002 (Gevers, introduction)", "sfsite2002", "", "a formidable baroque density of diction"),
 # ---- Infinity Plus 2003
 ("selective ambiguity", "Ambiguity is necessary in some of his stories and not in others; where present it contributes richness, but he doubts thematic closure is never attainable.", "Infinity Plus 2003", "infinityplus", "", "Ambiguity is necessary in some of my stories, not in all."),
 ("outsider narrator licenses explanation", "The Knight's narrator is a contemporary American because Wolfe needed someone from outside who would not have grown up hearing of the Aelf and Angrborn.", "Infinity Plus 2003", "infinityplus", "", "who would not have heard about the Aelf"),
 ("refusal to explicate origins", "Asked how he came to write dimly-seen higher powers behind human events, Wolfe answers only 'No comment', leaving discovery to the reader.", "Infinity Plus 2003", "infinityplus", "", "No comment."),
 # ---- Baber 1994
 ("do not dumb down pivotal events", "Wolfe holds that people's pivotal life events as they actually occurred would not be believed, and that literature should not dumb reality down but smart it up.", "Baber 1994 interview", "baber", "", "we don't dumb it down"),
 ("selective rottenness as character model", "Real complex character comes from people who are rotten only selectively, nice to their drinking buddies, unlike utopian or dystopian casts.", "Baber 1994 interview", "baber", "", "most rotten people are only rotten selectively"),
 ("paper is paper: the concrete credo", "Against a materialist correspondent Wolfe insists a piece of paper is a piece of paper and cheese is cheese, the animal-level knowing that living and, by implication, fiction require.", "Baber 1994 interview", "baber", "", "It is paper. It is cheese."),
 ("write a book, not a genre", "He defends mixing private eyes and witches in one SF novel because such people exist; he is not trying to write genres.", "Baber 1994 interview", "baber", "", "I'm not trying to write genres"),
 # ---- Cloud Chamber 1997
 ("pretences that turn out true", "Asked why he is drawn to deceptions that turn out to be true, Wolfe says it must be the unconscious hope that some of his will.", "Cloud Chamber 77 (1997)", "cc77", "Q2", "the unconscious hope that some of mine will"),
 ("reconstructed scenes attributed to informants", "Scenes Horn could not have witnessed are sourced within the fiction (an unnamed kite builder; prayers written by Horn and Nettle who heard Silk pray), and Wolfe points to a page in Exodus.", "Cloud Chamber 77 (1997)", "cc77", "Q21", "Please reread Exodus, p. 371."),
 ("happened / probably happened / must have happened", "Horn and Nettle tell what happened, what probably happened and what must have happened, in dramatic form; their account is necessarily subjective and they make mistakes.", "Cloud Chamber 77 (1997)", "cc77", "Q21a", "what probably happened, and what must have happened"),
 ("errors are errors, not clues", "Wolfe concedes the Mint/Marble location swap in Exodus is his mistake; Langford notes readers had been reading subtleties into his least typos.", "Cloud Chamber 77 (1997)", "cc77", "Q28", "they are my mistakes"),
 ("literal answer to a symbolic question", "Asked who or what Oreb is, Wolfe answers only that Oreb is a night chough, declining the symbolic reading the questioner wanted.", "Cloud Chamber 77 (1997)", "cc77", "Q1", "Oreb is a night chough."),
 ("answers deferred to the next book", "Some questions (Quetzal's motive) are answered only by telling the reader to read the next series, keeping the withholding in force.", "Cloud Chamber 77 (1997)", "cc77", "Q23", "You will have to read The Book"),
 # ---- Tolkien essay 2001
 ("a society displayed, not argued", "Wolfe reads Tolkien as having uncovered a forgotten Folk Law and built Middle-earth as a means of displaying it in the clearest light, planting the truth that society need not be as we see it.", "The Best Introduction to the Mountains (2001)", "mountains", "", "society need not be as we see it around us"),
 ("rereading as reading discipline", "He describes rationing The Fellowship to one chapter an evening while permitting himself to reread earlier chapters endlessly, the habit of the rereader he later writes for.", "The Best Introduction to the Mountains (2001)", "mountains", "", "no more than a single chapter each evening"),
 ("etymology inside and outside the story", "Tolkien's reply to Wolfe's fan letter distinguishes a word's etymology within the story from the author's source for it, a distinction Wolfe's own Latinate diction depends on.", "The Best Introduction to the Mountains (2001)", "mountains", "Tolkien letter, 7 Nov 1966", "two sides"),
 # ---- Gaiman
 ("trust the text / do not trust the text", "Gaiman's first two rules: trust the text implicitly because the answers are in there, and do not trust it farther than you can throw it because it may go off in your hand.", "Gaiman, How to Read Gene Wolfe", "gaiman", "rules 1-2", "Trust the text implicitly. The answers are in there."),
 ("text reshapes on rereading", "The books subtly reshape themselves while you are away; Peace was a gentle Midwestern memoir on first reading and a horror novel on the second or third.", "Gaiman, How to Read Gene Wolfe", "gaiman", "rule 3", "It only became a horror novel on the second"),
 ("clever without pointing it out", "Wolfe is the kind of clever writer who sees no need to point out his cleverness; the intelligence serves the tale and makes the reader smart too.", "Gaiman, How to Read Gene Wolfe", "gaiman", "rule 7", "He is smart to make you smart as well."),
 ("narrator withholds what he witnessed", "Rule 8 asserts the author was there and knows whose reflection they saw in the mirror, i.e. the withheld fact is known and recoverable.", "Gaiman, How to Read Gene Wolfe", "gaiman", "rule 8", "He knows whose reflection they saw in the mirror"),
 ("engineer's mind, clue-reading", "Gaiman reports Wolfe solving a ninety-year-old murder from a press clipping (the matches by the railway tracks), evidence of the engineer's mind behind the clue-planting.", "Gaiman, How to Read Gene Wolfe / journal", "gaiman_journal", "", "He has an engineer's mind"),
 # ---- Clute SFE
 ("story knows more than it says", "Clute's summary law: a Wolfe story always knows more than it says and can almost never be fully grasped on a first reading.", "Clute, SFE entry", "sfe", "", "A Wolfe story always knows more than it says"),
 ("indirection deciphered by the reader", "The true story is conveyed by indirection and reveals itself through the reader's ultimate decipherment.", "Clute, SFE entry", "sfe", "", "conveyed by indirection"),
 ("subliminal clues lucid in retrospect", "Fifth Head's clues are almost subliminal on first pass but in retrospect or after rereading lucid and inevitable, and the key twists are extractable from the manuscript that tells the story.", "Clute, SFE entry", "sfe", "", "in retrospect or after rereading almost invariably lucid"),
 ("recursive retrospect", "Clute names the structure shared by the major works 'recursive retrospect': a narrator looking back on events whose meaning loops back on the telling.", "Clute, SFE entry", "sfe", "", "recursive retrospect"),
 ("taxing reticences of presentation", "Wolfe's reticences of presentation make the work very nearly opaque, combining the utterly present and the implacably remote.", "Clute, SFE entry", "sfe", "", "taxing reticences of presentation"),
 ("confessional mode under question", "Peace is a childhood narrated all unknowingly from beyond the grave, its truth value unrelentingly put under the question.", "Clute, SFE entry", "sfe", "", "unrelentingly put under the question"),
 # ---- Evenson
 ("sins of omission with visible gaps", "Severian's unreliability is mostly omission; the gaps are not hidden but catch gently on first reading and insistently on rereading.", "Evenson, Reactor 2021", "evenson", "", "more sins of omission than outright deception"),
 ("telling order differs from event order", "The rearranged order of recounting, combined with gaps, leaves it uncertain whether Severian hides things or merely tells what he wants in the order he wants, making the unreliability feel human rather than literary.", "Evenson, Reactor 2021", "evenson", "", "less literarily motivated, more informal and human"),
 ("hint placed before its explanation", "Severian's obscure wish to carry the moon-landing picture to a forest reads as random until pages later we learn the moon is now forested; Wolfe often passes such moments in silence.", "Evenson, Reactor 2021", "evenson", "", "we later discover that it's exactly right"),
 ("overlapping selves narrate as one", "After absorbing Thecla and the Autarch the narrator is a multiplicity speaking as a oneness; a parenthetical memory of torturing for fun turns out to be Thecla's.", "Evenson, Reactor 2021", "evenson", "", "a multiplicity trying to speak as if it were a oneness"),
 ("chapter ends in muddle explained next chapter (reader comment)", "A commenter observes that chapters tend to end in an incoherent hugger-mugger that the next chapter's opening explains.", "Evenson, Reactor 2021 (comment by NancyLebovitz)", "evenson", "comments", "explained at the beginning of the next chapter"),
 ("miracle never acknowledged by the narrator (reader comment)", "Commenters note Severian resurrects Dorcas with the Claw and never states that he did so, even after he learns the Claw's power.", "Evenson, Reactor 2021 (comments by AndyLove, pfsmith)", "evenson", "comments", ""),
 # ---- Gerwel
 ("three-level diction", "Wolfe eschews neologism; his obscure real words work at a surface level, a mystery-clue level and an allusive level, which drives close reading and rereading.", "Gerwel 2014", "gerwel", "", "Wolfe eschews the use of neologism"),
 ("unstated premise solved from clues (Peace)", "Peace never states that its narrator is dead, in a memory-palace purgatory, and probably a multiple murderer; the reader must identify and solve the puzzle from clues.", "Gerwel 2014", "gerwel", "", "a puzzle which must be identified and then solved"),
 ("first sentence paid off by one later line", "The opening sentence about the fallen elm becomes clear only when connected to a single, seemingly unrelated line of dialogue in the novel's final third.", "Gerwel 2014", "gerwel", "", "a different, single, and seemingly unrelated line"),
 ("forgetting-yet-consistent vs remembering-yet-lying", "Severian cannot forget yet lies and is inconsistent; Latro cannot remember yet his narrative is consistent, an inversion that asks which narrator is trustworthy.", "Gerwel 2014", "gerwel", "", "his narrative is consistent throughout"),
 ("found-manuscript translator apparatus", "The Latro books frame the scrolls through a translator who notes the narrator's limited ability to write and the haste of composition, layering unreliability.", "Gerwel 2014", "gerwel", "", "limited ability to write"),
 # ---- Ewing
 ("depth by omission", "Wolfe's density comes from what he leaves out rather than elaborate description; suggestion through omission gives the prose its depth.", "Ewing 2010", "ewing", "", "what Wolfe's leaves out that gives it its depth"),
 ("cut-back prose with exotic nouns", "The sentences are clear, cut back and almost Hemingwayesque, while exotic nouns like 'burginot' estrange without obscuring.", "Ewing 2010", "ewing", "", "cut back and simplified, almost Hemmingwayesque"),
 ("narrator who knows nothing", "Wolfe's narrators often know little, placing them in the reader's position; 'Tracking Song' opens by telling its narrator he knows nothing.", "Ewing 2010", "ewing", "", "You know nothing."),
 ("unexplained detail implies a larger world", "Wolfe takes Heinlein's 'the door dilated' further, using unexplained background details to imply worlds, and leaves questions half-answered as a feature.", "Ewing 2010", "ewing", "", "takes this to the next level"),
 # ---- LARB / Gordon
 ("encoder and decoder (Wright)", "Peter Wright's Attending Daedalus casts Wolfe as encoder and the reader as decoder of labyrinthine conundrums, with the element of choice as his principal device for confounding the reader.", "LARB 2013 (quoting Wright)", "larb", "", "Wolfe's principal device for confounding the reader"),
 ("first misinterpreted narrative", "Wright records that no reviewer recognised Weer's deathly state, making Peace Wolfe's first misinterpreted narrative.", "LARB 2013 (quoting Wright)", "larb", "", "Wolfe's first misinterpreted narrative"),
 ("as many readings as readers", "The reviewer maintains the novel contains as many readings as readers and resists the reading that Wolfe aims to confound.", "LARB 2013", "larb", "", "as many readings perhaps as there are readers"),
 ("cascading metaphor in the cosmic register", "Peace's first section collapses SF's cosmic perspective into religious ecstasy and cascades from metaphor to metaphor; no one else writes like that.", "LARB 2013", "larb", "", "cascading from metaphor to metaphor"),
 ("author claims kinship with his ghost", "Wolfe is quoted as saying of Weer that they have similar souls, against readings of Weer as the devil.", "LARB 2013 (Wolfe quoted)", "larb", "", "we have similar souls"),
 # ---- Jacobs
 ("unfinished stories as evasions", "Weer leaves stories unfinished and declines to narrate the visit to Gold's farm, later revealing he murdered the librarian; the reader must sift the evidence.", "Jacobs 2024", "jacobs", "", "the reader has to sift the evidence"),
 ("interpolated tales comment on the frame", "The embedded tales comment in various ways on the events Weer narrates, and the reader must decide which ones do.", "Jacobs 2024", "jacobs", "", "comment in various ways on the events"),
 ("memory palace with lost rooms", "Weer lives in a rambling memory palace of his own making whose rooms he can temporarily or permanently lose access to.", "Jacobs 2024", "jacobs", "", "a rambling memory palace of his own making"),
 # ---- The Solute
 ("lie in dialogue, not in narration", "Wolfe's characters will lie in dialogue but not in narration, so narrative statements can be trusted while speech cannot.", "The Solute 2017", "solute", "", "characters will lie in dialogue but not in narration"),
 ("narration stops just before a death", "Weer's narration stops just before a character dies and resumes later, so murders are inferred from absence, a 'shadow narrative'.", "The Solute 2017", "solute", "", "stops just before a character dies"),
 ("lost object as buried guilt", "The Boy Scout knife that Weer can never locate, and the pun in 'my den, where I now never go', carry double meanings the narrator does not acknowledge.", "The Solute 2017", "solute", "", "my den, where I now never go"),
 ("digression as postponement", "The layered tales let Weer escape: as long as he keeps telling stories he need not face what comes next.", "The Solute 2017", "solute", "", "as long as Weer keeps telling stories"),
 ("scrupulously honest up to a point", "Gaiman's remark, quoted here, that Wolfe's narrators are scrupulously honest but only up to a point.", "The Solute 2017 (quoting Gaiman)", "solute", "", "scrupulously honest, but only up to a point"),
 # ---- Fernandes
 ("perfect-memory claim contradicted", "Weer prides himself on remembering everything yet cannot remember the librarian's name, a self-contradiction the text leaves standing.", "Fernandes, Reactor 2019", "fernandes", "", "I who pride myself upon remembering everything"),
 ("house as mnemonic haunting device", "The house functions as a point in space for a dead person to revisit his life, a motif Wolfe reused in 'Checking Out'.", "Fernandes, Reactor 2019", "fernandes", "", "a point in space for a dead person"),
 # ---- Knode
 ("first line resolved through a married name", "The elm of the first sentence is planted on Weer's grave: Eleanor Bold became Mrs Porter, who much later says she wants to plant a tree on his grave.", "Knode, Reactor 2012", "knode", "", "The evidence for it is buried, but convincing."),
 ("no breadcrumb trail, clues present", "Wolfe never talks down to the reader and lays out no breadcrumb trail, but the clues are there.", "Knode, Reactor 2012", "knode", "", "doesn't lay out breadcrumbs in a trail"),
 # ---- Michel
 ("blink-and-you-miss revelations", "Wolfe's mysteries are revealed in blink-and-you-miss moments among endless allusions.", "Michel 2026", "michel", "", "mysteries that are revealed in blink-and-you-miss moments"),
 # ---- Khanna
 ("context over exposition", "Where other books spend time on exposition, Wolfe largely depends on context to bring the reader through.", "Khanna, LitReactor 2012", "khanna", "", "largely depends on context to bring the reader through"),
 ("chapter gaps skip the set piece", "A chapter may end with Able heading to a battle and the next pick up afterwards; questions posed in one chapter are answered several later.", "Khanna, LitReactor 2012", "khanna", "", "In the following chapter, we pick up afterwards"),
 ("stated chastity contradicted later", "Severian describes a chaste relationship and later mentions kissing the woman's breasts, an inconsistency read as intentional or unintentional prevarication.", "Khanna, LitReactor 2012", "khanna", "", "intentional or unintentional prevarication"),
 ("repurposed old words as new language", "Wolfe repurposes old words to create an almost new language for the world.", "Khanna, LitReactor 2012", "khanna", "", "repurposes old words to create an almost new language"),
 # ---- Locus 2009 Toy Theater
 ("narrator gives few clues to his own feelings", "The Toy Theater's narrator, like other Wolfe protagonists, gives very few clues about what he himself is feeling.", "Locus 2009, 'The Toy Theater'", "locus2009", "", "so few clues about what he himself is feeling"),
 ("final line dizzying by omission", "The story's last reported speech ends on 'know' with nothing after it, leaving two readings open, which the critic finds especially hard to parse.", "Locus 2009, 'The Toy Theater'", "locus2009", "", "especially hard to parse"),
 ("single chosen word as keynote", "The word 'craquelure' for the cracks under a puppet's cosmetics becomes the keynote suggesting how fake everything may be.", "Locus 2009, 'The Toy Theater'", "locus2009", "", "That wonderfully well-chosen word craquelure"),
 ("reading standard: account for every detail", "The critic's test for a Wolfe reading is a consistent account of why everything in the text is there, in a story of under 3,000 words.", "Locus 2009, 'The Toy Theater'", "locus2009", "", "why everything that's in the text is there"),
 ("names carry meaning (Stromboli, Sarg)", "Names are always important in Wolfe stories; Stromboli evokes Pinocchio and the planet Sarg the marionettist Tony Sarg.", "Locus 2009, 'The Toy Theater' (with comments)", "locus2009", "", "Names are always important in Wolfe stories."),
 # ---- Auerbach (dissent)
 ("elision of central plot points", "Central plot points are skipped over and referred to only in retrospect, others presented misdirectingly, others never cleared up.", "Auerbach, Waggish 2007 (dissent)", "waggish", "", "Central plot points are skipped over"),
 ("liar plus translator frame leaves motive underdetermined", "Because Severian is known to lie and Wolfe poses as translator of a manuscript for an unknown audience, the text's purpose and the narrator's motives are underdetermined.", "Auerbach, Waggish 2007 (dissent)", "waggish", "", "underdetermined with regard to Severian's motives"),
 ("archaic Latinate words that look like neologisms", "The style uses words that appear to be neologisms but are archaic, often Latin-derived usages, evoking strangeness while preserving meaning.", "Auerbach, Waggish 2007 (dissent)", "waggish", "", "words that appear to be neologisms but are anything but"),
 ("Clute's put-on theory", "Auerbach reports Clute's argument that the whole narrative is a put-on to justify Severian's taking power.", "Auerbach, Waggish 2007 (reporting Clute)", "waggish", "comments", "a put-on to justify Severian taking power"),
 # ---- Aramini 2020
 ("post-New Sun minimalism", "After The Book of the New Sun Wolfe abandoned baroque long sentences and strove for a more minimalistic surface text.", "Aramini interview, Ultan's Library 2020", "aramini2020", "", "abandons the baroque and long sentences"),
 ("subtext replaces text in late work", "In the post-Wizard Knight novels the subtext tends to replace the text, and Wolfe plays less fair by withholding metatextual repetitions.", "Aramini interview, Ultan's Library 2020", "aramini2020", "", "The subtext tends to replace the text."),
 ("every detail true somehow", "Aramini's reading principle: something is true about almost every detail, literally or figuratively, so he reads without suspicion and makes everything true somehow.", "Aramini interview, Ultan's Library 2020", "aramini2020", "", "everything has to be true somehow, literally or figuratively"),
 ("two mysteries that explain each other", "Wolfe sometimes plants two confusing things that explain each other, as with the context-free gunfight and the off-screen death in Home Fires.", "Aramini interview, Ultan's Library 2020", "aramini2020", "", "the two mysteries explain each other"),
 ("literalized metaphor and repeated unrelated fact", "Wolfe controls meaning through logic, small details, literalized metaphors and juxtaposing unrelated things; tunnel dogs called gods signal that gods are stored in the tunnels.", "Aramini interview, Ultan's Library 2020", "aramini2020", "", "the literalization of metaphors"),
 ("mise en abyme embedded tales", "Embedded tales map allegorically onto the larger story, and symbols are built to yield concrete plot conclusions.", "Aramini interview, Ultan's Library 2020", "aramini2020", "", "embeds tales which map allegorically to the larger story"),
 ("simplification after 'difficult writer' label", "Wolfe told Nigel Price that, having so often been called a difficult writer, he strove in later works to make his style simpler and more accessible.", "Aramini interview, Ultan's Library 2020 (Price reporting Wolfe)", "aramini2020", "", "make his style simpler and more accessible"),
 ("classic detective stories as stylistic model", "Price suggests Wolfe's late reading of Rex Stout and Sayers supplied the stylistic model for his late books, e.g. Wizard Knight as heroic fantasy channelling Stout.", "Aramini interview, Ultan's Library 2020 (Price)", "aramini2020", "", "they provided the stylistic model for his writing"),
 # ---- Aramini 2013
 ("elided structures point to one solution", "Aramini holds Wolfe is a modernist who merely pretends to inconclusive subjectivity; his elided structures point at implied correct conclusions.", "Aramini interview, Ultan's Library 2013", "aramini2013", "", "merely pretends to create inconclusive subjectivity"),
 ("reliable judgment, unreliable perception (Latro)", "Latro's judgments are sound; it is his perceptions and memory that cannot be trusted, unlike Severian who may claim sudden fear or Weer who may not bury the thief.", "Aramini interview, Ultan's Library 2013", "aramini2013", "", "It is not Latro who can't be trusted"),
 ("melancholy, inconclusive endings", "Wolfe's endings are often melancholy and inconclusive; Soldier of the Mist ends with the amnesiac finding a man who knows him only as he dies.", "Aramini interview, Ultan's Library 2013", "aramini2013", "", "his endings are often melancholy"),
 # ---- DMR
 ("engineered inconsequential details", "The stories are engineered so that seemingly inconsequential details have consequences later; every tale should be read as a mystery.", "DMR Books 2019", "dmr", "", "seemingly inconsequential details will have consequences later on"),
 # ---- Person RIP
 ("two-word line carrying the tragedy", "Return to the Whorl delivers its central tragedy in a two-word sentence, 'Silk nodded.', which Person calls heartbreaking.", "Person, Gene Wolfe RIP 2019", "person_rip", "", "Silk nodded."),
 # ---- Castle of the Otter reference
 ("onomastics and lexicon as companion apparatus", "The Castle of the Otter includes Wolfe's explanation of his characters' names and a lexicon for the series' obscure words, with essays 'Words Weird and Wonderful' and 'Onomastics'.", "WolfeWiki, Castle of the Otter (SFBC blurb)", "ww_otter", "", "a helpful lexicon for the obscure words"),
 # ---- Baber / Gevers about parody
 ("parody and homage depth", "Wolfe acknowledges homages (Borges, M. R. James, Crowley) and jokes that his parodic streak is about five and a half feet deep.", "SF Site Jan 2002 (Gevers)", "sfsite2002", "", "about five and half feet"),
]

claims = []
for feat, claim, src, key, page, quote in C:
    q = quote.strip()
    assert len(q.split()) <= 11, (feat, q, len(q.split()))
    d = {"feature": feat, "claim": claim, "source": src, "url": U[key], "quote": q}
    if page: d["page"] = page
    claims.append(d)

sourcesRead = [{"title": t, "url": u, "kind": k, "substantive": s} for (t,u,k,s) in sources]
out = {"claims": claims, "sourcesRead": sourcesRead}
json.dump(out, open(f"{S}/found-wolfe-voice.json","w"), indent=1, ensure_ascii=False)

# notes markdown
L = []
L.append("# find-wolfe-voice — raw notes (angle: the author's OWN words; plus Gaiman/Clute/Aramini/Wright-via-Gordon and close readers)\n")
L.append("Method: WebSearch (8+8+8 queries until the session budget of 200 searches was exhausted by parallel lanes), then WebFetch; hosts returning 403 to WebFetch (wolfewiki, locusmag, reactormag, aidanmoher, lareviewofbooks, sfsite via Wayback) were curled with a browser UA and converted to text; the two gwern PDFs were text-extracted with pypdf. Every cited page was read in full text. Raw captures live in ./raw/.\n")
L.append("Not reachable: Castle of the Otter essays (Sun of Helioscope, Words Weird and Wonderful, Onomastics) are not online; Thrust 19 (1983) and the McCaffery interviews are print/audio only; the Locus 2011 and Locus 2002 pieces are excerpts.\n")
L.append("## Sources read\n")
for t,u,k,s in sources:
    L.append(f"- [{'SUBSTANTIVE' if s else 'light/duplicate'}] {t} — {k} — {u}")
L.append("\n## Claims (feature — claim — source — quote)\n")
for d in claims:
    L.append(f"- **{d['feature']}** — {d['claim']} — {d['source']}{(' ('+d['page']+')') if d.get('page') else ''} — {d['url']} — " + (f"\"{d['quote']}\"" if d['quote'] else "(no quote)"))
L.append("\n## Cross-source synthesis for the program's target device (public belief vs institutional record vs physical evidence, unannounced)\n")
L.append("- Wolfe's own formulation of the mechanism is judicial: five or six honest witnesses to one event report different things (Person 1998); witnesses cannot separate what they saw from what it means, so a naive observer who reports only what he saw is more interesting (MIT 2014); accounts are 'what happened, what probably happened, and what must have happened' (Cloud Chamber 1997).")
L.append("- The withholding is engineered as clue placement: one placement per clue, never repeated, with more clues than strictly needed (Jordan 1992); telltale signs 'all through the book' (SF Site 2002); names and single chosen words as keynotes (Locus 2009); typos and errors are NOT clues (Jordan 1992; Cloud Chamber 1997).")
L.append("- Sentence-level: cut every unrequired word (Locus 2002); concrete over abstract (Clarkesworld 2008); show and shut up (Black Gate 2010); every line does several jobs (Locus 2011); dialogue is action and each speaker has an idiolect so tags can be dropped (Person 1998, Clarkesworld 2008).")
L.append("- Diction: archaic real words (Latin/Greek anglicised via unabridged dictionaries), no coinages, placed so context yields the meaning (Person 1998); readers and critics agree this reads as clear, cut-back prose estranged by nouns (Ewing 2010; Auerbach 2007).")
L.append("- Narration: first person permits narrator comment, authorial comment is 'ruinously bad' (Clarkesworld 2015); the narrator may lie in dialogue but not in narration (Solute 2017); narration stops just before deaths and resumes after (Solute 2017; Khanna 2012); hints precede their explanations and are passed over in silence (Evenson 2021).")
L.append("- Reader contract: good literature is reread with increased pleasure (Locus 2002); the author will not settle arguments and there is no sacredness to the text (Locus 2002); trust the text / do not trust the text (Gaiman); a Wolfe story always knows more than it says (Clute).")
L.append("- Trajectory: post-New Sun minimalism (Aramini 2020) and Wolfe's own admission that he 'loosened up' after being called unreadable (MIT 2014), while insisting the style never changed, only the voice suited to each story (SF Site 2002).")
open(f"{S}/find-wolfe-voice.md","w").write("\n".join(L)+"\n")
print("claims:", len(claims), "sources:", len(sourcesRead), "substantive:", sum(1 for s in sourcesRead if s["substantive"]))
print("json bytes:", len(open(f"{S}/found-wolfe-voice.json").read()), "md bytes:", len(open(f"{S}/find-wolfe-voice.md").read()))
