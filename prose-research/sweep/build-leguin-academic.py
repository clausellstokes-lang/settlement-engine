import json
ELF="https://digginganddeepening.com/texts/ESSAYS/U%20K%20LeGuin/1973_FromElflandtoPoughkeepsie_1.pdf"
WELF="https://en.wikipedia.org/wiki/From_Elfland_to_Poughkeepsie"
WWIZ="https://en.wikipedia.org/wiki/A_Wizard_of_Earthsea"
WUKL="https://en.wikipedia.org/wiki/Ursula_K._Le_Guin"
WLHD="https://en.wikipedia.org/wiki/The_Left_Hand_of_Darkness"
WTOA="https://en.wikipedia.org/wiki/The_Tombs_of_Atuan"
WTEH="https://en.wikipedia.org/wiki/Tehanu"
NEAPDF="https://www.arts.gov/sites/default/files/Readers-Guide-WizardofEarthsea.pdf"
NEAPG="https://www.arts.gov/initiatives/nea-big-read/wizard-earthsea"
SFE="https://sf-encyclopedia.com/entry/le_guin_ursula_k"
SHIP="https://academic.oup.com/liverpool-scholarship-online/book/43316/chapter/363083559"
KELSO="https://paradoxa.com/wp-content/uploads/2020/07/1-Boldly-to-Re-Venture-New-Writing-on-the-Works-of-Ursula-K.-Le-Guin-Kelso-pp-7-22.pdf"
GARTH="https://johngarth.wordpress.com/2021/01/22/ursula-le-guin-the-language-of-earthsea-and-tolkien/"
CAREY="https://stancarey.wordpress.com/2024/10/16/how-to-see-ones-own-world-ursula-k-le-guin-on-writing-style/"
MAHY="https://www.ursulakleguin.com/on-earthsea-mahy"
WALT="https://reactormag.com/qbright-the-hawks-flight-in-the-empty-skyq-ursula-le-guins-lemga-wizard-of-earthsealemg/"
BURT="https://strangehorizons.com/wordpress/non-fiction/ursula-le-guins-earthsea-by-john-plotz/"
TEARLE="https://interestingliterature.com/2023/10/john-plotz-ursula-le-guin-earthsea-review/"
NEPVEU="https://kate-nepveu.livejournal.com/180011.html"
VERMONT="https://vermontsoftworks.com/post/2023/leguin-rhythmic-pattern-in-lotr/"
LITHUB="https://lithub.com/a-writing-lesson-from-ursula-k-leguin/"
BMC="https://serendipstudio.org/sci_cult/leguin/"
NEWELL="https://digitalcommons.liberty.edu/masters/133/"
CR1="https://api.crossref.org/works?query.bibliographic=How+They+Do+Things+with+Words+Language+Power+Gender+Priestly+Wizards+Le+Guin+Earthsea&rows=3"
CR2="https://api.crossref.org/works?query.bibliographic=Beyond+Words+Impact+of+Rhythm+as+Narrative+Technique+Left+Hand+of+Darkness+Extrapolation+1992&rows=3"
WEY="https://curtisweyant.com/scholarship/le-guin/secondary-bibliography-the-left-hand-of-darkness/"
UKLBOE="https://www.ursulakleguin.com/the-books-of-earthsea"
UKLSTC="https://www.ursulakleguin.com/steering-the-craft"
UKLRTS="https://www.ursulakleguin.com/return-to-source"

C=[]
def c(feature,claim,source,url,quote="",page=""):
    C.append({"feature":feature,"claim":claim,"source":source,"url":url,"quote":quote,"page":page})

S_ELF="Le Guin, 'From Elfland to Poughkeepsie' (1973), full essay text (PDF)"
c("style is the book","Le Guin holds that style is not an ingredient added to a fantasy but the book itself; strip it and only a plot synopsis remains, a claim she calls 'absolutely true of fantasy'.",S_ELF,ELF,"The style, of course, is the book.","p. 9")
c("plain noble style","She argues most epics, the Mabinogion and the sagas use straightforward language that keeps oral directness, and that plainness is the noblest and hardest register for heroic fantasy.",S_ELF,ELF,"A plain language is the noblest of all.","p. 8")
c("fake plainness (journalistic prose)","She separates true plainness from the flat, inexact 'Poughkeepsie' prose of commercial fantasy, which is journalism's deliberate suppression of sensibility applied to the remote and elemental.",S_ELF,ELF,"It is not really simple, but flat.","p. 8")
c("sensory specificity","Sensory cues are 'extremely important in imaginative writing'; when rocks, wind and trees are vague and generalized the scene is not felt.",S_ELF,ELF,"the scenery is cardboard, or plastic","p. 8")
c("archaism as high wire","The archaic manner is a perfect distancer only when done perfectly; botched thee/thou verbs, subjunctives, 'mayhap' and 'ichor' are the touchstones of failure.",S_ELF,ELF,"It's a high wire: one slip spoils all.","p. 6")
c("distance without archaism","Archaisms are inessential to distancing from the ordinary: Jack Vance's aloof, restrained, consistent narrative and dialogue prose is an achieved style with none.",S_ELF,ELF,"And it contains no archaisms at all.","p. 7")
c("register consistency","Alternating colloquial American for humour with formal usage for earnest moments (Leiber, Zelazny) jerks the reader between Elfland and Poughkeepsie and dissolves the characters' coherence.",S_ELF,ELF,"the characters lose coherence in my mind","p. 7")
c("dialogue diction as the test","Speech reveals character whether the author knows it or not; a lord who says 'I could have told you that' can never be a hero, and genuine Elfland dialogue cannot be relocated to Capitol Hill by changing four words.",S_ELF,ELF,"Speech expresses character.","p. 4")
c("flexible plain range (Tolkien model)","Tolkien's plain clear English is praised for flexibility and variety, moving from commonplace to stately and sliding into metre unnoticed, with an unremarkable vocabulary and everything direct, concrete and simple.",S_ELF,ELF,"Its outstanding virtue is its flexibility, its variety.","p. 8")
c("musical test: sound, syntax, rhythm","Good prose, even archaic (Eddison), is judged visually for precision and musically for the sound of words, the movement of syntax and the rhythm of sentences, with nothing faked or blurred.",S_ELF,ELF,"the movement of the syntax, and the rhythm of the sentences","p. 6")
c("every word counts (exposed construct)","In fantasy there is no borrowed reality to hide flaws, only a construct built in a void with every seam exposed, so every word counts and the only voice is the creator's.",S_ELF,ELF,"And every word counts.","p. 10")
c("polysyndeton as costume","Imitation Dunsany is diagnosed as elaborate made-up names, vague gorgeous cities and many sentences beginning with 'And' — biblical cadence worn as costume.",S_ELF,ELF,"a great many sentences beginning with \"And.\"","p. 5")
c("passion invests trivial acts","The Eddison and Morris dialogue passages show nothing happening (reading a book, dividing a rabbit) yet invest trivial acts with importance, emotion and vitality — the elevation lies in the speech, not the event.",S_ELF,ELF,"with what importance they invest these trivial acts","p. 4")
c("simple timelessness (Tolkien dialogue)","Tolkien's speakers use 'an English extraordinary for its simple timelessness' with sobriety, wit and force — the language of men of character rather than mannered archaism.",S_ELF,ELF,"an English extraordinary for its simple timelessness","p. 4")

c("style as fantasy's authenticity test","The Wikipedia synthesis reads the essay as claiming fantastic creation must reach into words and grammar, and cites Peter S. Beagle calling it the definitive piece on why sprinkling thees and thous fails.","Wikipedia: From Elfland to Poughkeepsie",WELF,"reach to the very words and grammar")
c("praised stylists","The article lists Dunsany, Eddison, Kenneth Morris, Tolkien, Cabell, Evangeline Walton and Jack Vance as the essay's models of style that fits its world.","Wikipedia: From Elfland to Poughkeepsie",WELF,"")

c("clarity and directness","Le Guin said fantasy must be clear and direct with language because the reader has no known framework to rest on.","Wikipedia: A Wizard of Earthsea (citing Le Guin)",WWIZ,"there is no known framework for the reader's mind")
c("free indirect discourse","Mike Cadden characterizes the Earthsea narration as free indirect discourse in which the protagonist's feelings blend with the narrator's, creating sympathy while keeping narrative flexibility.","Wikipedia: A Wizard of Earthsea (citing Cadden, Beyond Genre)",WWIZ,"free indirect discourse")
c("assumed familiarity, no exposition","The narration assumes the reader already knows Earthsea's geography and history, avoiding heavy exposition, and moves between looking ahead into Ged's future and back into Earthsea's past.","Wikipedia: A Wizard of Earthsea",WWIZ,"switches from looking ahead into Ged's future")
c("depth without backstory","A reviewer credits this method with giving the world Tolkien's mysterious depths 'without his tiresome back-stories'.","Wikipedia: A Wizard of Earthsea (citing Amanda Craig)",WWIZ,"without his tiresome back-stories")
c("dreamlike mood","George Slusser described the book's mood as strange and dreamlike, fluctuating between objective reality and Ged's inner thoughts.","Wikipedia: A Wizard of Earthsea (citing Slusser 1976)",WWIZ,"strange and dreamlike")
c("taut clean prose","Amanda Craig (Guardian) praised prose 'as taut and clean as a ship's sail'.","Wikipedia: A Wizard of Earthsea (citing Craig)",WWIZ,"prose as taut and clean as a ship's sail")
c("high style, epic vision","Slusser (1976) called the Earthsea cycle a work of high style and imagination with genuine epic vision.","Wikipedia: A Wizard of Earthsea (citing Slusser)",WWIZ,"work of high style and imagination")

c("exact word placement, resonance","Harold Bloom called Le Guin an exquisite stylist with every word exactly in place and every sentence resonant.","Wikipedia: Ursula K. Le Guin (citing Bloom)",WUKL,"Every word was exactly in place")
c("lean but lyrical","The New York Times characterized her prose as a lean but lyrical style used to explore moral issues.","Wikipedia: Ursula K. Le Guin (citing NYT)",WUKL,"lean but lyrical style")
c("elegance","Zadie Smith called her prose as elegant and beautiful as any written in the twentieth century.","Wikipedia: Ursula K. Le Guin (citing Zadie Smith)",WUKL,"as elegant and beautiful as any written")
c("collage narrative structure","The Left Hand of Darkness is assembled from ethnological reports, myths, diary entries and personal narration, a structure called distinctly post-modern.","Wikipedia: Ursula K. Le Guin",WUKL,"distinctly post-modern")

c("restrained pathos","Bloom described the Left Hand prose as precise, dialectical and always evocative in its restrained pathos.","Wikipedia: The Left Hand of Darkness (citing Bloom)",WLHD,"precise, dialectical—always evocative in its restrained pathos")
c("myth-chapter interleaving","Gethenian myths and legends are placed before chapters in which Genly Ai meets similar situations, so the embedded texts explain both cultural detail and philosophy.","Wikipedia: The Left Hand of Darkness",WLHD,"")
c("naive first-person that learns","Ai's first-person report reflects a gradually evolving worldview so the reader's understanding develops with his; the structure was initially found confusing by reviewers (Donna White).","Wikipedia: The Left Hand of Darkness (citing White)",WLHD,"")

c("limited third person","Much of Tombs unfolds from Tenar's perspective, the reader feeling the undertomb's fear through her eyes; Cadden's free indirect discourse makes the narrator seem sympathetic to the characters.","Wikipedia: The Tombs of Atuan (citing Cadden)",WTOA,"the narrator seem sympathetic to the characters")
c("grounding coda","Jo Walton credits the final travel section with grounding the narrative after the earthquake, 'solid and well rooted as ever'.","Wikipedia: The Tombs of Atuan (citing Walton)",WTOA,"solid and well rooted as ever")

c("flawless poetic prose with metaphor","Kirkus praised Tehanu's flawless, poetic prose and its thoughtful, potent metaphor.","Wikipedia: Tehanu (citing Kirkus)",WTEH,"flawless, poetic prose")
c("darker realistic edge","Michael Dirda found Tehanu less sheerly exciting but perhaps the most moving, with a darker, more realistic edge and a woman's point of view.","Wikipedia: Tehanu (citing Dirda)",WTEH,"a darker, more realistic edge")
c("strange pacing","Jo Walton calls Tehanu a restless book with very strange pacing, torn between plot and women's domestic lives.","Wikipedia: Tehanu (citing Walton)",WTEH,"a restless book with very strange pacing")

S_NEA="NEA Big Read Reader's Guide: A Wizard of Earthsea (PDF)"
c("plain strong exact diction; grave formal tone","The guide characterizes the language as plain, strong and exact, the tone grave and slightly formal.",S_NEA,NEAPDF,"plain, strong, and exact","p. 4")
c("balanced musical sentence rhythm","The rhythm of her sentences is described as carefully balanced and musical.",S_NEA,NEAPDF,"carefully balanced and musical","p. 4")
c("Old English alliteration and assonance","It notes occasional alliteration and assonance reminiscent of Old English verse, citing 'Forest rises ridge behind ridge to the stone and snow of the heights'.",S_NEA,NEAPDF,"reminiscent of Old English verse","p. 4")
c("wizard as writer","Le Guin (2008 interview): what a wizard does is like what a writer does — making things out of words and making things happen with words.",S_NEA,NEAPDF,"He or she is making things out of words","p. 5")
c("gravely austere tone","The guide says The Left Hand of Darkness is written in a tone even more gravely austere than A Wizard of Earthsea.",S_NEA,NEAPDF,"a tone even more gravely austere","p. 9")
c("quietly poetic language","A discussion question calls the novel's language 'often quietly poetic'.",S_NEA,NEAPDF,"often quietly poetic","p. 10")
c("elegant diction","The introduction credits the book's elegant diction, geographical sweep and mounting suspense.",S_NEA,NEAPDF,"elegant diction, geographical sweep, and mounting suspense","p. 3")
c("plain strong exact (web page)","The NEA Big Read web page repeats the guide's 'plain, strong, and exact' characterization and pairs it with Craig's 'taut and clean as a ship's sail'.","NEA Big Read: A Wizard of Earthsea (web page)",NEAPG,"plain, strong, and exact")

S_SFE="Encyclopedia of Science Fiction (SFE), entry 'Le Guin, Ursula K'"
c("austere but vivid","The SFE calls the initial Earthsea trilogy austere but vivid, a major work reaching beyond its Young Adult audience.",S_SFE,SFE,"austere but vivid")
c("grave joyfulness","The SFE says a grave joyfulness pervades the trilogy, more maturely thoughtful than Narnia while remaining exciting.",S_SFE,SFE,"A grave joyfulness pervades the trilogy")
c("clarity and evocative precision","The Left Hand of Darkness is told in a prose notable for its clarity and evocative precision.",S_SFE,SFE,"a prose notable for its clarity and evocative precision")
c("motifs as story","Archetypal motif pairs (darkness/light, root/branch, language/silence) are woven until the motifs are the story, treated as balanced twins rather than polarities.",S_SFE,SFE,"the motifs are the story")
c("restrained immanence","Searoad's nonfantastic stories convey 'the same capably restrained immanence' — restraint named as a constant of her manner.",S_SFE,SFE,"capably restrained immanence")
c("sad, powerful, quiet (Tehanu)","Tehanu is described as a sad, powerful, quiet book about the strength of women.",S_SFE,SFE,"a sad, powerful, quiet book")

S_SHIP="Tom Shippey, 'The Magic Art and the Evolution of Words' (Hard Reading, Liverpool UP 2016; orig. Mosaic 1977) — chapter abstract"
c("magus-root neologisms","Le Guin avoids 'magician' (tainted by stage illusion) and coins Archmage, magelight, magewind and magery from Latin magus — none in the OED — so that the vocabulary itself resets the reader's assumptions about magic.",S_SHIP,SHIP,"based on a semantic point")
c("true-name semantics","The magic system rests on a 'Rumpelstiltskin theory' in which every thing has a true name distinct from ordinary language, and knowing it gives power — a linguistic premise that carries plot and theme.",S_SHIP,SHIP,"Rumpelstiltskin theory")

S_KELSO="Sylvia A. Kelso, 'Boldly to Re-Venture: New Writing on the Works of Ursula K. Le Guin', Paradoxa 21 (2008), pp. 7–22 (PDF)"
c("sentence rhythm foreshadows the whole","Kelso reads the Lathe of Heaven jellyfish sentence's four opposing blocks (two compound adjectives, two clauses) as an ocean-on-beach here-and-back rhythm that foreshadows the novel's yin/yang structure of recurrence.",S_KELSO,KELSO,"rhythm at sentence level foreshadows the tenor","pp. 14–15")
c("move toward austerity","Like Yeats, Le Guin moves toward simplicity or austerity in both rhythm and content of later work; Tehanu begins in farm life and ends among a few goats and bean vines.",S_KELSO,KELSO,"move toward simplicity, or at least austerity","p. 16")
c("stage business as rhythmic punctuation","In the Tenar–Moss rush-splitting scene the 'business' works as a suite of variations for pause and emphasis: the leisurely 'They split rushes for a while in silence' quickens to the snaps of 'neatly, quickly, with her nail' and is cut by the bare 'They split rushes.'",S_KELSO,KELSO,"a suite of variations to indicate pause and emphasis","pp. 16–17")
c("long smooth sentence, triple repetition, assonance","Kalessin's arrival pairs an extraordinarily long comma-weighted sentence (weighting 'sinuous', 'claws', 'fire') with a classic triple repetition whose final word links by assonance to the previous paragraph, approaching actual poetry.",S_KELSO,KELSO,"almost somnambulistically smooth","p. 17")
c("rhythm as enabler (dragon wingbeats)","Kelso quotes Le Guin ('Collectors, Rhymesters and Drummers'): holding to the rhythm of the dragon's flight let Tehanu tell itself, and when she lost the beat she fell off and had to wait.",S_KELSO,KELSO,"the very large, long wingbeats","pp. 17–18")
c("vocabulary as rhythm's twin","Rhythm analysis slides into vocabulary, 'rhythm's Siamese twin': Lathe's 'tugged hugely' and 'tidal abyss' lean embroidered, while elsewhere the same book reaches a homely simile of love made like bread.",S_KELSO,KELSO,"rhythm's Siamese twin","p. 14")
c("less doing more","Tehanu shows 'the skill of experience making less do more, rather than more do more' — the late style compresses.",S_KELSO,KELSO,"making less do more","p. 16")
c("lyrical unruly critical voice","The Language of the Night established Le Guin's lyrical, unruly and individual critical voice with 'From Elfland to Poughkeepsie' among its essays.",S_KELSO,KELSO,"lyrical, unruly, and individual critical voice","p. 8")
c("paragraph shaping by clause length","In the Always Coming Home vision paragraph, a long opening clause checks into shortening phrases, brakes at a colon, then returns through a triple of lengthening units to a singing polysyllable ('over the Obsidian').",S_KELSO,KELSO,"Here there are no rhythmic superfluities.","p. 15")

c("deliberately limited invented lexicon","Le Guin (quoted by Garth) said there was no use trying to make a lexicon of Earthsea's languages, unlike Tolkien who in one sense wrote LOTR to give his languages speakers.","John Garth, 'Ursula Le Guin, the language of Earthsea, and Tolkien' (blog)",GARTH,"No use trying to make a lexicon")
c("absorbed Tolkien, own direction","Attebery (quoted by Garth) distinguishes her from Tolkien copyists as one who absorbed Tolkien, comprehended him and went her own direction.","John Garth blog (citing Attebery)",GARTH,"absorbed Tolkien, comprehended him, and gone on in her own direction")
c("Secret Vice acknowledged","Garth notes Le Guin called language invention 'the Secret Vice' after Tolkien's essay and counted LOTR among the three books she had re-read past counting.","John Garth blog",GARTH,"")

c("minimal reference tools","In 'Dreams Must Explain Themselves' Le Guin named only the Shorter Oxford Dictionary and Follett's and Fowler's usage manuals as her tools (later Strunk & White).","Stan Carey, 'How to see one's own world': Le Guin on writing style (Sentence first blog)",CAREY,"Follett's and Fowler's manuals")
c("style as vision","Carey foregrounds the essay's claim that style is the writer's way of seeing and speaking, and that the artist's hardest lesson is to see his own world and speak in his own words.","Stan Carey blog (quoting Elfland)",CAREY,"")

c("language as subject","Margaret Mahy: in Earthsea language is not only the vehicle of the story but at times what the story is about, and Le Guin must find the right name before she can go on.","Margaret Mahy, 'Speculations on the Earthsea Stories' (ursulakleguin.com)",MAHY,"what the story is about")
c("names with conviction","The invented names carry conviction and inevitability, so the reader feels reminded of a land already known.","Margaret Mahy (ursulakleguin.com)",MAHY,"conviction and inevitability")
c("spoken voice in the reader's head","Mahy describes the reading experience as words on the page becoming a spoken voice in the reader's head — the storyteller addressing a reader-listener.","Margaret Mahy (ursulakleguin.com)",MAHY,"a spoken voice in the reader's head")

S_WALT="Jo Walton, '\"Bright the hawk's flight in the empty sky\": Ursula Le Guin's A Wizard of Earthsea' (Reactor, 2010)"
c("legend feel","Walton calls it one of the very few fantasy novels that succeeds in feeling like a legend.",S_WALT,WALT,"succeeds in feeling like a legend")
c("modulated narrative distance","The narration passes easily from what people say and what isn't spoken of, from the distance of the fairy-tale teller to the very close, always sure where the teller stands.",S_WALT,WALT,"the distance of the teller of fairy-tales to the very close")
c("told within the world, after the story","The story is told entirely within the world but after it, so the implied reader is assumed to know the great deeds referenced.",S_WALT,WALT,"told entirely within the world, but after the story")
c("no wasted word; read-aloud","There is never a wasted word and all the words are right; it is like poetry and among the best books for reading aloud.",S_WALT,WALT,"There's never a wasted word, and all the words are right.")
c("evocative naming","The names (Selidor, Iffish, Havnor, Osskil, Gont, Pendor) make the map memorable; the world is 'named and called up' from the first word.",S_WALT,WALT,"Le Guin is so wonderful with names")
c("bounded world","A world with much more in it than appears on the page — history, other countries — yet with a clear line drawn round it: 'only in silence the word'.",S_WALT,WALT,"a clear line drawn around it")

c("blank spaces for the reader","Plotz (per Burt) calls the prose the antithesis of high-end video-game verisimilitude: it leaves blanks the reader fills, showing how often we fill things in.","Stephanie Burt, review of John Plotz, Ursula Le Guin's Earthsea (OUP 2023), Strange Horizons",BURT,"the antithesis of the well-rendered verisimilitude")
c("Cather-like spareness","Plotz compares Le Guin's clear, spare prose to Willa Cather's.","Stephanie Burt on Plotz (Strange Horizons)",BURT,"")
c("oral-tale co-creation","Burt: the narration invites readers in and holds them back, reminding them they are hearing a story and making them co-creators, collaborators, listeners as if to an oral tale.","Stephanie Burt (Strange Horizons)",BURT,"co-creators, collaborators, listeners, as if to an oral tale")
c("clear, patient prose; open space","Burt names the clear, patient prose and its love for calm, open space, sky and sea, and likens the listening-and-waiting mode to Paradise Regained.","Stephanie Burt (Strange Horizons)",BURT,"clear, patient")

c("the right word","Tearle credits Le Guin with picking up the right word on the end of her pen; Plotz devotes a chapter to her use of language and naming and to the careful, deliberate nature of her prose.","Oliver Tearle, review of Plotz (Interesting Literature)",TEARLE,"the careful and deliberate nature of her prose")

S_NEP="Kate Nepveu, LotR re-read: Le Guin, 'Rhythmic Pattern in The Lord of the Rings' (summary of the 2001 essay)"
c("two-beat trochaic pulse","Le Guin reads the fundamental rhythm of LOTR as two beats — stress and release, inbreath and outbreath, a heartbeat — irreducibly simple yet capable of endless variation.",S_NEP,NEPVEU,"Stress, release. Inbreath, outbreath. A heartbeat.")
c("reversal pairs, not binary flips","She lists pulsing pairs (darkness/daylight, confusion/clarity, trap/freedom) and insists they are not simple binary flips; each yang contains its yin.",S_NEP,NEPVEU,"are not simple binary flips")
c("walking gait as rhythm","The narrative follows a physical gait — one, two, left, right, on foot from the Shire to the Mountain and back.",S_NEP,NEPVEU,"")
c("reading aloud as method","She scans a chapter closely, hears its close 'like drumbeats', and recommends reading passages aloud.",S_NEP,NEPVEU,"like drumbeats")

c("sentence follows the breath","Le Guin (quoted) on Tolkien: even long sentences flow clearly and follow the breath, punctuation comes where you need to pause, cadences are graceful and inevitable.","Vermont Softworks blog on 'Rhythmic Pattern in The Lord of the Rings'",VERMONT,"their flow is perfectly clear, and follows the breath")
c("the writer must hear the prose","Le Guin infers from read-aloud ease that Tolkien must have heard what he wrote.","Vermont Softworks blog (quoting Le Guin)",VERMONT,"Tolkien must have heard what he wrote")

S_LH="Literary Hub, 'A Writing Lesson from Ursula K. Le Guin' (excerpt from Steering the Craft)"
c("sound first","The sound of the language is where it all begins; the test of a sentence is whether it sounds right.",S_LH,LITHUB,"The sound of the language is where it all begins.")
c("narrative sentence leads onward","The chief duty of a narrative sentence is to lead to the next; pace and movement depend on rhythm you can only control by hearing it.",S_LH,LITHUB,"duty of a narrative sentence is to lead to the next")
c("mind's ear and sound faults","Writers need a mind's ear; dull, choppy, droning, jerky, feeble are faults of sound, lively, flowing, strong, beautiful its virtues.",S_LH,LITHUB,"a mind's ear")
c("prose sound effects irregular","Prose's sound effects are subtle and always irregular (unlike verse); onomatopoeia, alliteration, repetition and dialect cadences are the tools, and changing sentence rhythms can express emotion.",S_LH,LITHUB,"")

S_BMC="Le Guin, Bryn Mawr Commencement Address (1986), text at Serendip"
c("father tongue distancing","The father tongue's essential gesture is not reasoning but distancing — one-way speech that expects no answer and 'only lectures'.",S_BMC,BMC,"not reasoning but distancing")
c("mother tongue expects an answer","The mother tongue is conversation, language as relation whose power is in binding not dividing.",S_BMC,BMC,"Expects an answer. It is conversation")
c("verge of silence and song","The mother tongue is always on the verge of silence and often on the verge of song.",S_BMC,BMC,"on the verge of silence and often on the verge of song")
c("native tongue as wedding","The third, native tongue of art welds the public father tongue and private mother tongue back together.",S_BMC,BMC,"wedding and welding back together")

c("structuralist view of language","Newell's MA thesis argues that the structuralist view of language revealed in the Earthsea Cycle underlies its depiction of power and balance.","Daniel Newell, 'The Mother Tongue in a World of Sons: Language and Power in The Earthsea Cycle' (MA thesis, Liberty University 2010) — abstract",NEWELL,"The structuralist view of language")

c("speech-act power of wizards (title-level)","A peer-reviewed article frames Earthsea's wizards' language as 'doing things with words' — speech-act power crossed with gender.","Crossref record: Comoletti & Drout, 'How They Do Things with Words…', Children's Literature 29 (2001): 113–141, DOI 10.1353/chl.0.0786",CR1,"")
c("rhythm as narrative technique (title-level)","A 1992 Extrapolation article treats rhythm as a narrative technique operating 'beyond words' in The Left Hand of Darkness.","Crossref record: Nora Barry & Mary Prescott, 'Beyond Words: The Impact of Rhythm as Narrative Technique in The Left Hand of Darkness', Extrapolation 33.2 (1992): 154–165, DOI 10.3828/extr.1992.33.2.154",CR2,"")

c("scholarly focus: voice and rhythm, not lexis","Weyant's secondary bibliography shows the style-adjacent scholarship clusters on narrative voice and structure (Adams 1991; Jose 1991; Castleman 2020), rhythm (Barry & Prescott 1992), and the 'language of realism' in terrain (Pegg 1995) — no stylometric or corpus study is listed.","Curtis Weyant, The Left Hand of Darkness: Secondary Bibliography",WEY,"")

c("retold-legend voice","David Mitchell (quoted on the official site) says the book reads like the retelling of a tale first told centuries ago.","ursulakleguin.com, The Books of Earthsea page (quoting Mitchell)",UKLBOE,"reads like the retelling of a tale first told centuries ago")
c("grammar vocabulary as craft tool","Steering the Craft insists the writer needs grammatical terms to say what is wrong or right in a sentence, likening the untooled writer to a carpenter who cannot tell a hammer from a screwdriver.","ursulakleguin.com, Steering the Craft page",UKLSTC,"like a carpenter who doesn't know a hammer from a screwdriver")
c("re-vision without retraction","The second trilogy 'sees exactly the same world with different eyes', expanding rather than retracting the earlier books.","Sharada Bhanu, 'Tehanu: A Return to the Source' (ursulakleguin.com)",UKLRTS,"sees exactly the same world with different eyes")

S=[]
def s(title,url,kind,sub): S.append({"title":title,"url":url,"kind":kind,"substantive":sub})
s("Le Guin, 'From Elfland to Poughkeepsie' (1973) — full essay",ELF,"primary essay (PDF, read in full)",True)
s("Wikipedia: From Elfland to Poughkeepsie",WELF,"Wikipedia synthesis",True)
s("Wikipedia: A Wizard of Earthsea",WWIZ,"Wikipedia synthesis (cites Cadden, Slusser, Attebery, Shippey, SFE, Craig)",True)
s("Wikipedia: Ursula K. Le Guin",WUKL,"Wikipedia synthesis (Bloom, NYT, Smith, Cadden)",True)
s("Wikipedia: The Left Hand of Darkness",WLHD,"Wikipedia synthesis",True)
s("Wikipedia: The Tombs of Atuan",WTOA,"Wikipedia synthesis",True)
s("Wikipedia: Tehanu",WTEH,"Wikipedia synthesis",True)
s("Wikipedia: The Language of the Night","https://en.wikipedia.org/wiki/The_Language_of_the_Night","Wikipedia synthesis",False)
s("Wikipedia: The Farthest Shore","https://en.wikipedia.org/wiki/The_Farthest_Shore","Wikipedia synthesis",False)
s("Wikipedia: Tales from Earthsea","https://en.wikipedia.org/wiki/Tales_from_Earthsea","Wikipedia synthesis",False)
s("Wikipedia: The Other Wind","https://en.wikipedia.org/wiki/The_Other_Wind","Wikipedia synthesis",False)
s("Wikipedia: Earthsea (universe)","https://en.wikipedia.org/wiki/Earthsea_(universe)","Wikipedia synthesis",False)
s("Wikipedia: Earthsea","https://en.wikipedia.org/wiki/Earthsea","Wikipedia synthesis",False)
s("Wikipedia: The Books of Earthsea","https://en.wikipedia.org/wiki/The_Books_of_Earthsea","Wikipedia synthesis",False)
s("Wikipedia: Steering the Craft","https://en.wikipedia.org/wiki/Steering_the_Craft","Wikipedia stub",False)
s("Wikipedia: Dancing at the Edge of the World","https://en.wikipedia.org/wiki/Dancing_at_the_Edge_of_the_World","Wikipedia synthesis",False)
s("NEA Big Read Reader's Guide: A Wizard of Earthsea (PDF)",NEAPDF,"teaching guide with Le Guin interview (PDF, text extracted)",True)
s("NEA Big Read: A Wizard of Earthsea (web page)",NEAPG,"teaching guide page",True)
s("SFE: Le Guin, Ursula K (Encyclopedia of Science Fiction)",SFE,"reference encyclopedia entry",True)
s("Shippey, 'The Magic Art and the Evolution of Words' (Hard Reading, LUP 2016) — chapter abstract",SHIP,"monograph chapter abstract (Liverpool Scholarship Online)",True)
s("Kelso, 'Boldly to Re-Venture', Paradoxa 21 (2008) pp. 7–22",KELSO,"journal introduction (PDF, read in full)",True)
s("John Garth, 'Ursula Le Guin, the language of Earthsea, and Tolkien'",GARTH,"scholar's blog essay",True)
s("Stan Carey, 'How to see one's own world': Le Guin on writing style",CAREY,"editor's blog essay",True)
s("Margaret Mahy, 'Speculations on the Earthsea Stories' (ursulakleguin.com)",MAHY,"critic essay on official site",True)
s("Jo Walton, 'Bright the hawk's flight in the empty sky' (Reactor, 2010)",WALT,"novelist-critic essay (fetched via curl)",True)
s("Stephanie Burt, review of Plotz, Ursula Le Guin's Earthsea (Strange Horizons)",BURT,"review of scholarly monograph",True)
s("Oliver Tearle, review of Plotz (Interesting Literature)",TEARLE,"review of scholarly monograph",True)
s("Kate Nepveu, LotR re-read: Le Guin 'Rhythmic Pattern in The Lord of the Rings'",NEPVEU,"reader summary of primary essay",True)
s("Vermont Softworks: Le Guin 'Rhythmic Pattern in The Lord of the Rings'",VERMONT,"reader summary of primary essay",True)
s("Literary Hub, 'A Writing Lesson from Ursula K. Le Guin' (Steering the Craft excerpt)",LITHUB,"primary excerpt",True)
s("Le Guin, Bryn Mawr Commencement Address 1986 (Serendip text)",BMC,"primary speech text",True)
s("Newell, 'The Mother Tongue in a World of Sons' (MA thesis, Liberty 2010) — landing page/abstract",NEWELL,"thesis abstract",True)
s("Crossref record: Comoletti & Drout, Children's Literature 29 (2001)",CR1,"bibliographic record (citation only)",False)
s("Crossref record: Barry & Prescott, Extrapolation 33.2 (1992)",CR2,"bibliographic record (citation only)",False)
s("Curtis Weyant, The Left Hand of Darkness: Secondary Bibliography",WEY,"scholar-maintained bibliography (fetched via curl)",True)
s("ursulakleguin.com: The Books of Earthsea",UKLBOE,"official site page",True)
s("ursulakleguin.com: Steering the Craft",UKLSTC,"official site page",True)
s("ursulakleguin.com: From Elfland to Poughkeepsie (publication note)","https://www.ursulakleguin.com/from-elfland-to-poughkeepsie","official site publication note",False)
s("Sharada Bhanu, 'Tehanu: A Return to the Source' (ursulakleguin.com)",UKLRTS,"critic essay on official site",True)
s("Rochelle, Communities of the Heart — LSO abstract","https://academic.oup.com/liverpool-scholarship-online/book/43267","monograph abstract",False)
s("FAU news: Timothy S. Miller, A Wizard of Earthsea: A Critical Companion (Palgrave 2023)","https://www.fau.edu/artsandletters/english/news/timothy-miller-publishes-ursula-k-leguin-a-wizard-of-earthsea-critical-companion/index.php","publication announcement",False)
for t,u in [
 ("Comoletti & Drout on Project MUSE","https://muse.jhu.edu/article/251728/summary"),
 ("'Draconic Diction: Truth and Lies in Le Guin's Old Speech' (academia.edu)","https://www.academia.edu/50882793/Draconic_Diction_Truth_and_Lies_in_Le_Guins_Old_Speech"),
 ("Oxford Bibliographies: Ursula K. Le Guin","https://oxfordbibliographies.com/display/document/obo-9780199827251/obo-9780199827251-0210.xml"),
 ("Slusser, 'Le Guin and the Future of SF Criticism' (SFS review essay)","https://www.depauw.edu/sfs/review_essays/sluss53.htm"),
 ("Paris Review, Art of Fiction No. 221: Le Guin","https://www.theparisreview.org/interviews/6253/the-art-of-fiction-no-221-ursula-k-le-guin"),
 ("Mythlore: 'Magic, Witchcraft, and Faërie' (SWOSU PDF)","https://dc.swosu.edu/cgi/viewcontent.cgi?article=3006&context=mythlore"),
 ("Newell thesis full PDF","https://digitalcommons.liberty.edu/cgi/viewcontent.cgi?article=1134&context=masters"),
 ("Springer: Miller, A Wizard of Earthsea: A Critical Companion","https://link.springer.com/book/10.1007/978-3-031-24640-1"),
 ("Poetry Foundation, 'Always Beginning'","https://www.poetryfoundation.org/articles/148040/always-beginning"),
 ("Barry & Prescott at Liverpool UP Online","https://online.liverpooluniversitypress.co.uk/doi/10.3828/extr.1992.33.2.154"),
 ("Google Books API snippets (Cadden / Cummins)","https://www.googleapis.com/books/v1/volumes?q=%22free+indirect+discourse%22+Earthsea+Cadden"),
]:
    s(t,u,"attempted — blocked/404/429, NOT read",False)

out={"claims":C,"sourcesRead":S}
json.dump(out,open("found-leguin-academic.json","w"),indent=1,ensure_ascii=False)
bad=[(x["quote"],len(x["quote"].split())) for x in C if x["quote"] and len(x["quote"].split())>=12]
print("claims",len(C),"sources",len(S),"substantive",sum(1 for x in S if x["substantive"]),"quote-overlong",bad)
urls={x["url"] for x in S}; missing=[x["source"] for x in C if x["url"] not in urls]; print("claims whose url not in sourcesRead:",missing)
