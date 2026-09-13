# Wolfe: the prose style of Gene Wolfe (round 3 sweep, dossier section)

Built from: state-wolfe.json (705578 bytes, 2026-09-06 14:03:54, rewritten in place by this merge with `--update-state`) merged with 34 verdict files: verdicts-wolfe-i0-14.json (15831, 12:56:35), i15-29 (14065, 12:54:56), i30-44 (13845, 12:55:36), i45-59 (15258, 12:55:41), i60-74 (14934, 12:59:53), i75-89 (15446, 13:01:52), i90-104 (18473, 13:00:34), i105-119 (15529, 13:01:16), i120-134 (12434, 13:05:41), i135-149 (13324, 13:05:29), i150-164 (18541, 13:08:09), i165-179 (17590, 13:06:17), i180-194 (16086, 13:11:53), i195-209 (15513, 13:12:37), i210-224 (15042, 13:11:38), i225-239 (14541, 13:11:43), i240-254 (15149, 13:17:23), i255-269 (14385, 13:15:47), i270-284 (14056, 13:15:43), i285-299 (13184, 13:15:42), i300-314 (14762, 13:21:36), i315-329 (13828, 13:20:38), i330-344 (16012, 13:21:43), i345-359 (15013, 13:21:32), i360-374 (14213, 13:25:47), i375-389 (14851, 13:25:17), i390-404 (15148, 13:26:42), i405-419 (13947, 13:25:34), i420-434 (14006, 13:30:08), i435-449 (14152, 13:31:59), i450-464 (16569, 13:34:43), i465-467 (5154, 13:33:43), verdicts-wolfe-regrade-r1.json (796, 05:51:12, a recorded no-op), verdicts-wolfe-regrade-r4.json (29599, 13:42:44), all dated 2026-09-06 and totalling 501276 bytes; the merge wrote kept-wolfe.json (466681 bytes, 14:03:54, md5 99c9a68e3e7566302d964a4e5e4187a6, 402 rows) and partial-wolfe.json (95212 bytes, 14:03:54, md5 4a425dc65820dd03b7b99ffef61a9ff1, 66 rows); merge summary `{"claims":468,"verdicts":468,"kept":402,"partial":66,"chunkFiles":34,"verdictsFromFiles":489}`.

## How to read this section

The kept set is 402 rows: 400 VERIFIED_VERBATIM and 2 VERIFIED_SUBSTANCE (#100, which carries no quotation, and #130, whose quotation is not word for word; neither is cited below for a quotation). Every feature below rests on kept rows only. A "source" is a distinct document or speaker, not a row: the same Person 1998 interview is in the set twice (gwern.net PDF and the losarciniegas transcript), Gevers's "The Reader as Augur" was found under three angles, Wowra's place-name essay under two, Andre-Driussi's "Posthistory 201" under three, Wright's "Mapping a Masterwork" under two, Keeley's Reactor piece under two, and Wolfe's appendix to The Shadow of the Torturer arrives through Wikipedia, Keeley and Wright. Duplicate rows are listed together so the support count is honest. Twenty-five kept rows (#120 to #134 without #123 and #130, and #210 to #224 without #214, #219 and #221) carry an empty `trueWording`; for those the verifier placed the verbatim wording in the note, and the quotation cited here is taken from the `quote` field the note confirms. Rows that live only in partial-wolfe.json are cited only for their verbatim quotation and are marked "(partial, quotation only)"; the partial table at the end lists each one with its unsupported limb.

The reconstruction rules are written for the register they serve: a settlement dossier kept by a calm archivist, in the present tense, in concrete civic nouns, with no digits and no em dash. The rules themselves obey that constraint; the surrounding apparatus (indices, counts) does not.

## Features

### 1. The strange words are real, old and obscure; nothing is coined, and each is placed so its sense is plain

Support: 15 distinct sources. Wolfe in the Person 1998 interview (#19, #230, #231, #232, #233); Wolfe's appendix to The Shadow of the Torturer, relayed by Wikipedia (#239, #240, #241), Keeley (#297) and Wright (#454); Wolfe in Castle of Days via Wright (#453); Gerwel (#101); Ewing (#107); Auerbach (#139); Khanna (#131); Keeley (#295, #296); Wowra's "Lupine Scholar" introduction (#250, #251, #348, #349, #350); Andre-Driussi (#330); WolfeWiki's Castle of the Otter page (#154); Macdonald (#367, #368, #369); the MetaFilter reader Ipsifendus (#379); the game designer Hunt (#320); the schicksalgemeinschaft reread essay (#340).

Wording: "in no case have I done so" (#239); "intended to be suggestive rather than definitive" (#240, #297, #454); "every word in the book appears in a dictionary" (#295); "Their meaning is fairly obvious in the context" (#368); "it will be clear to the reader what is meant" (#232); "convey the flavour of an odd place at an odd time" (#453).

Disagreement: Macdonald (#367) hears the vocabulary as "new" and formed "by changing a vowel or suffix", against Wolfe's own appendix and Keeley (#295); she also records that Wolfe changes the meaning of real words, "like destrier" (#369), which is consistent with "suggestive rather than definitive". Gerlach's Long Sun article (#159, partial, quotation only: "familiar with are applied in unusual, usually comical ways") shows Wolfe also repurposes ordinary words and, per the verifier's note, coins some in that series; the no-coinage rule is a New Sun rule that the later books relax.

Rule (archivist): the archivist uses real, old and uncommon words for the settlement's offices, tools, garments and beasts, and invents none; each such word stands in a sentence whose other nouns make its sense plain; the word suggests the thing rather than defines it, and the dossier never glosses it.

### 2. The dictionary method: from the Latin or Greek word to an anglicised form with an old citation

Support: 1 source, the Person 1998 interview, found at two hosts (#19, #233). Flagged: single source.

Wording: "someone will have anglicised this term" (#19); "someone will have anglicized this term as a new word" (#233, the transcript's spelling).

Rule (DM page, word-pool construction): to name an office or object, the builder finds the Latin or Greek word for it and then the English form some earlier hand made of it; the pool holds the anglicised form, never the raw Latin.

### 3. The sentence is plain, cut back and controlled; every word is meant

Support: 14 distinct sources. Wolfe on the student editor's blue pencil (#50), on the style suiting the story (#30, #57, #58 partial quotation only), on clear structure for a complex story (#17, #228), and on loosening his later style (#41, #147 via Price); the interviewer Person (#229); Clute 2009 (#204, #209, #210); Ewing (#107); Holland (#274, #275); Aramini (#141, #142); Gevers (#189, #404); Kelly (#365); Gaiman (#86, #448); Bishop via Wright (#220); Price (#148); Wright on the plot, not the prose, being unremarkable (#219, partial, quotation only).

Wording: "every word he wrote was meant" (#204); "taking out every word the sentence" (#50); "cut back and simplified, almost Hemmingwayesque" (#107); "One never feels he let a sentence get away from him" (#274); "fluent, seemingly translucent style" (#209); "abandons the baroque and long sentences" (#141); "narration becomes spare, unexplanatory" (#189).

Disagreement: Holland also calls the prose dense, "interjecting itself with parentheticals and complicating clauses" (#273); Gevers describes a range from "limpid simplicity" to "a formidable baroque density of diction" (#67); a Tree Slices reader quoting one Peace sentence finds "Some of them are a struggle to get through" (#412). Aramini resolves the split by date: the baroque long sentence belongs to The Book of the New Sun and is abandoned afterwards for "a more minimalistic surface text" (#141). Wright (#459) calls the critical habit of praising "fluidity of style" a "conventional, narrow and unimaginative approach"; Ewing (#106, partial, quotation only: "what Wolfe's leaves out that gives it its depth") denies the prose is dense at all.

Rule (archivist): the archivist writes short declarative sentences in which no word can be struck without loss; the sentence is plain so that its one uncommon noun stands out; the surface is clear and the depth is elsewhere.

### 4. Show, never state: a character or an institution is known by what it does

Support: 3 distinct sources. Wolfe in Clarkesworld 2008 (#23); Wolfe's numbered advice in Black Gate 2010 (#35), relayed again by Stewart (#345); Clute on Silk (#203, partial, quotation only: "that goodness is in the details").

Wording: "You simply show it and shut up." (#35); "I know I can't say it at all" (#23, of "Nick was a bad man and a cruel man").

Rule (archivist): the dossier never writes that a family is cruel or a guild is honest; it records what the family does and what the guild's ledgers show, and stops there.

### 5. Fiction demands the concrete: the ship, the cargo and the shoal are named

Support: 9 distinct sources. Wolfe on the ballad against the abstract summary (#27), on turning "generalities into hard facts" (#22), on the floor plan of the house in Free Live Free (#262, #263), and on his worry that his work had become "too verbal, too cerebral" and insufficiently visual (#172); Gerlach on the Long Sun world (#158); Alex on the opening paragraph's spatial grounding (#280); Swanwick on the engineering of the suits and cenotaphs (#308); Gordon on the streets and houses of Peace (#449); Kelly on precision (#365); Farrell on Soldier of Sidon reading "like a fictional travelogue through ancient Egypt" (#164).

Wording: "Like poetry and song, fiction demands the concrete." (#27); "dense and intricate, rich in detail" (#158); "Could you see the street from this window" (#263); "Its individual scenes are sharply evoked" (#449).

Rule (archivist): every entry names the street, the building, the office and the object rather than the category; a wreck is a named ship carrying a named cargo on a named shoal; before an entry needs a building, its plan exists.

### 6. One odd particular is set among plain ones and left unexplained

Support: 8 distinct sources. Alex (#281, #282, #283); Ewing on "the door dilated" (#109); Noel (#341, #342, #343); Elliot, with Palmer's foreword (#313, #314, #315, #317, #318, #319); Gladstone (#270); Khanna (#128); Kelly (#361); Holland (#277, partial, quotation only: "the scene is peppered with clues to the larger story").

Wording: "weird details feel all the weirder when they are grounded" (#281); "These little opacities feel 'realer' than any explanation" (#282); "Wolfe just takes Heinlein's unexplained detail to the next level" (#109, verifier's wording); "the barest of descriptions as to their nature" (#342); "Reading for world-building requires retaining information without context" (#313).

Rule (archivist): an entry admits one strange particular among its ordinary furniture (a crippled monkey in a plain boyhood house, a beast named but not described) and explains nothing; the sentences around it stay level.

### 7. Context over exposition: the world is described as its inhabitants would describe it

Support: 8 distinct sources. Khanna (#128); Noel (#341); Elliot on the three reasons a term goes unexplained (#315, #316, #317, #319); Gerlach (#157, #162); Kelly (#361, #363); Macdonald (#366); Wolfe's letter to Cooney on infodumps (#355); Sini (#286); Gerlach on inhabiting the world "much as the characters do" (#156, partial, quotation only).

Wording: "largely depends on context to bring the reader through" (#128); "lumps of prose like uncooked dumplings" (#355); "the characters may already know about those concepts" (#315); "the mysteries of his trade" (#366); "kept from us due to the narrowness of the narrator's perception" (#286).

Exception the set records: an outsider narrator licenses explanation. Wolfe made the narrator of The Knight a contemporary American because he needed "someone from outside" who "would not have heard about the Aelf" from childhood (#69). A settlement dossier has no outsider hand, so it has no such licence.

Rule (archivist): nothing is explained that the settlement's own clerk would pause to explain; an office is named and its purpose is inferred from what it does in the entry; a rite is recorded, not annotated.

### 8. Omission is information: gaps, lacunae, and the entry that stops before the death

Support: 24 distinct sources. Evenson (#95, #96, #97); the Solute essay (#119, #120, #121); Khanna (#129); Auerbach (#137); Gladstone (#270); Keeley (#298); Swanwick (#305); Macdonald (#372); Horton (#411); Lee (#414, #416, #417); Gevers (#440); Noel (#343); Knode (#420); Alex (#279); the MetaFilter reader straight on the blind man never called blind (#374); Andre-Driussi on the Autarch's name never written (#431); Polansky on the hidden sins identifiable "by the scars they leave in his memory" (#322, #323); Aramini reporting the critical consensus (#195); Wikipedia's synthesis (#243); Jacobs (#115); Gerwel (#102); Wolfe on Mary Christmas (#38); the schicksalgemeinschaft reread, "he doesn't tell certain things to the reader straight away" (#338); Reactor commenters on the unacknowledged resurrection (#100, no quotation).

Wording: "more sins of omission than outright deception" (#95); "stops just before a character dies" (#119); "Central plot points are skipped over" (#137); "There are also a great many lacunae." (#411); "Wolfe never shows you the monster directly." (#414); "encounters a blind man but never mentions he is blind" (#374); "conveyed speedily and with gaping lacunae" (#440).

Counterweight (not a disagreement, a proportion): a sentence of Wolfe's own fiction reproduced by Aramini, "What is not said can be important" and "but what is said is more important" (#198); Swanwick, that it is a mistake to think a story's surface meaning "can be ignored with impunity" (#306); Polansky, that a reader can miss the clues "and to still walk away touched by the book" (#324); Swanwick again, that buried details are "not necessary for your enjoyment of the experience" (#311).

Rule (archivist): a fact the archive lacks is left as a gap and not papered over; an entry may stop before a death and the next resume after it; the murder is inferred from the absence; what the record does say is always the larger part, and the entry makes plain sense without its gaps.

### 9. Every withheld fact is recoverable: the evidence is in the record, placed before it is needed and never labelled

Support: 25 distinct sources. Wolfe on leaving all the clues and on puzzles meant to be solved (#1, #2, #38, #63, #64, #66) and on the unconscious hope that some of his pretences will turn out true (#75); Gaiman's first rule (#84, #446) and the third (#85, #447); Clute (#89, #90, #91); Knode (#125, #126, #420, #421, #422); Gerwel (#102, #103); Keeley (#293, #359, #300); Evenson on the hint before its explanation (#97); Horton (#409, #410); Kelly (#362); Gevers (#186, #192, #405, #402); Gerlach on hypotheses formed "from minimal clues" (#161); Wright (#175, #217, #457); Aramini (#149); the MetaFilter reader RogerB (#375); Gladstone (#268, #271); Sales on the surname on the library shelf (#386); Lee (#415); Borski's barley soup (#194); Andre-Driussi's bear twenty-two chapters early (#432); Gordon relaying Joan Gordon's Starmont study (#364); Palmer on his own Wolfe-influenced novel, where the meaning "has to be teased out by the reader" (#326); Gaiman's rule eight (#87, partial, quotation only: "He knows whose reflection they saw in the mirror").

Hazard the set records: concealment can succeed too well. Wright, relayed by both the LARB review and Gordon, records that "no reviewer recognised Weer's deathly state" when Peace appeared (#111, #450); Lee reports that Wolfe's own comments suggest "he was concerned that he'd done too good of a job" (#419); a forum reader of Peace "failed to catch the significance" on first reading (#389). A dossier that hides its central fact from every reader has failed, not succeeded.

Wording: "Trust the text implicitly. The answers are in there." (#84, #446); "doesn't lay out breadcrumbs in a trail" (#126, #420); "The evidence for it is buried, but convincing." (#125, #422); "we later discover that it's exactly right" (#97); "clues lead the cautious and reflective reader" (#176, partial, quotation only); "building theories by rubbing together two sentences two hundred pages apart" (#268).

Disagreement: Gillespie, quoted by Wright, complains that the stories offer "little pieces of the jigsaw and one is never quite sure" a pattern exists (#179), against Wolfe's own "the puzzles are meant to be solved" position (#2) and Aramini's "elided structures point at 'correct' conclusions" (#149). Jones on There Are Doors, "The reader is left groping without guidance" (#168, partial, quotation only), is the one critic in the set who found no pattern to recover. Swanwick concedes that because Wolfe never explains, "there's no telling at what point interpretation ends and invention begins" (#302). Wright, via Aramini (#196), holds that many primary-narrative details are "actually distractions"; see feature 11.

Rule (archivist): every fact the dossier withholds leaves its evidence in the record, a married name in a later entry, a book shelved under a letter, a coin's image, a tree on a grave; the evidence is entered before the reader needs it, in the plain manner of everything around it, and is never marked as evidence.

### 10. A clue is given once; important information is never repeated

Support: 3 distinct sources, all relaying Wolfe. WolfeWiki's novice guide (#287); Barach (#312); Wolfe himself in the Jordan interview (#0, partial, quotation only: "I try not to leave a clue more than once"). Wolfe's companion statement that he leaves "sometimes more than they require" (#1) is compatible: many distinct clues, each once.

Wording: "he doesn't give the important information twice" (#287); "he gives a clue only once" (#312); "very little of it consists of reasoning from clues" (#1).

Rule (archivist, chronicle line): a load-bearing fact appears once in the dossier and is not restated in a summary; several distinct traces may point at one fact, but no trace is repeated; the reader's work is finding more traces, not reasoning harder from one.

### 11. Small details presage large revelations, and yet not everything means very much

Support: 18 distinct sources. Keeley (#300); Gevers on every paragraph reflecting the whole (#186), the hologram conceit (#329), the hastily erected arch (#406) and the boy's frozen grin as "an ironic tribute" to his concealed function (#403); Macdonald on casual asides cast in the reader's path "just as we expect to be focusing on something else" (#373); Borski (#194); Wolfe via the MetaFilter reader straight (#380); JWillard on trivial trivia and the pebble sentence (#390, #463, #464); Andre-Driussi (#432); Aramini on logic, small details and juxtaposition (#143, #144, #145); Sleight's test of a reading (#135, #136); Michel (#127); Gladstone (#268); Wolfe on the gun on the wall (#65) and on every line doing several things (#56); Gordon via Joan Gordon's study (#364); Wolfe on local symbolic touches (#10); Lackey's cart tracks (#467, partial, quotation only: "had no business being on that beach.").

Wording: "a small detail in one book frequently presages a large revelation" (#300); "Everything means something, but not everything means very much." (#380); "every paragraph, however incidental seeming, reflects the whole" (#186); "Casual comment, or something more?" (#463); "seemingly inconsequential details will have consequences later on" (#152, partial, quotation only).

Disagreement: Wright, via Aramini (#196), insists many details in the primary narrative are "actually distractions"; Gladstone (#272) finds that some planted details are "fingerprints, or the signature, of the author" and not evidence about the story; Wolfe's own "not everything means very much" (#380) and his "Gee, that's neat; I'll do that" account of symbolic touches (#10) sit between those positions.

Rule (archivist): an incidental civic detail is chosen so that a later entry can lean on it, and the dossier plants few such details; but the dossier also carries plain furniture that means nothing beyond itself, so that the reader cannot tell the two apart by weight of description.

### 12. The record is one person's account, and every such account is unreliable; it omits and misreads, and it does not fabricate

Support: 16 distinct sources. Wolfe (#15, #226, #32, #47, #77, #227, #238, #276), on two witnesses who see "some third thing" differently (#4), on Marsch "trying to talk himself into believing that he is" an Earthman (#44), and on Severian and Latro as inverse designs, one who forgets nothing and one who forgets everything (#46); Evenson on the narrator who is "a multiplicity trying to speak as if it were a oneness" (#98); Gaiman via the Solute essay, "scrupulously honest, but only up to a point" (#122); Auerbach reporting Clute's theory that the whole narrative is "a put-on to justify Severian taking power" (#140); Gladstone (#269); Wright on Severian's eidetic memory (#215, #455, #216, #456); Gerwel (#104); Auerbach (#138); WolfeWiki's guide (#288, #290, #291); the MetaFilter readers byanyothername (#377) and Pseudoephedrine (#376); Kelly (#362); Sini (#286); Lee (#413); Keeley (#299); Evenson (#95); Clute's "recursive retrospect" (#92, partial, quotation only); Aramini on Latro (#150, partial, quotation only: "It is not Latro who can't be trusted").

Wording: "the narrator is damn well going to be unreliable" (#15, #226); "Real people really are unreliable narrators all the time" (#238, #276); "sincere recorders of the truth they've experienced" (#377); "what they would say, rather than what he wants to say" (#290); "Who is telling this story, and when?" (#291); "revealing some truths and concealing others" (#413).

Disagreement, on lying: Keeley, "He self-justifies and misinterprets, but rarely lies outright." (#299), and Evenson's "sins of omission" (#95) stand against Gerwel, who has Severian able to "choose to lie" (#104), Auerbach's "We know that Severian is a liar" (#138), Gladstone's narrators who "straight-up lie, or forget things" (#269), and Gaiman's "Peace is built on lies", to which Wolfe replies "I never lie." (#54). The Solute essay's rule that "characters will lie in dialogue but not in narration" (#118, partial, quotation only) and the schicksalgemeinschaft blogger's "he doesn't lie to the reader" (#339, partial, quotation only) belong to the first camp but were not sustained by their own pages.

Rule (archivist): the dossier is an account kept by a named office or hand, never an omniscient view; its errors are the errors of a clerk trying to be accurate; it omits, misreads and misjudges, but it does not invent an event that did not happen, and a reader who asks who keeps the record, when, why and for whom is asking the right question.

### 13. The naive observer reports what was seen and never what it means

Support: 8 distinct sources. Wolfe on the naive observer and on courtroom witnesses (#45, #227); Sleight on the narrator who gives few clues to his feelings (#132); Macdonald on the clinical viewpoint of the torture scenes (#371, #372); Gerlach on Silk's incuriosity (#162); Kelly (#361); Noel (#341); Danehy-Oakes on the chapter-one fight, "delightfully confused, more like a real fight than most in fiction" (#395); Wolfe's "It is paper. It is cheese." (#73, partial, quotation only).

Wording: "he's just giving you what he has seen" (#45); "from a very clinical viewpoint" (#371); "so few clues about what he himself is feeling" (#132); "describes his surroundings at face value" (#361).

Rule (archivist): the archivist enters what was seen and what was entered, never what it means; a hanging is recorded with the rope, the hour and the name, not with the screams; the archivist's own feelings do not appear in the record.

### 14. Belief and custom are written from inside; the viewpoint accepts as ordinary what the reader questions

Support: 4 distinct sources. Wolfe on writing the pagan world "as the pagans themselves wrote about it" (#8); Gerlach on Silk not questioning possession (#162); Elliot's first reason (#315); Noel (#341).

Wording: "as the pagans themselves wrote about it" (#8); "does not question whether the Chenille he knows could be possessed" (#162); "to the best of their knowledge" (#341).

Rule (archivist): the settlement's gods, rites and offices are recorded as the settlement believes them, without a rationalist aside; an omen is entered as an omen.

### 15. The dossier is a document with an origin: a translation, a file, an account reconstructed years afterward

Support: 12 distinct sources. Wolfe on the false-author framing and on Horn and Nettle's sources (#20, #76, #77); Farrell on the Soldier books' translator apparatus (#163); McCaffery on Fifth Head's "prismatic manner of exposition" (#267); Wright via Aramini on the translator's mistranslations (#197) and Wright directly (#175, #178, #218); Borski on the officer's file (#252, #254, #255, #435) and endorsing Wright on "the destabilizing effects such omissions have on reality" (#193); Sales (#384), and on the authorities reading a bullet-drop table as proof that "Marsch is an assassin" (#385); Clute on the memoir "actually been written down" (#213); Macdonald on histories, reports, assessments, commentaries (#370); Gevers on the Long Sun narrator's reconstruction (#438, #439, #440, #441); Auerbach (#138); Lee on the catalogued forgery (#418); Wolfe's Knight on records nobody reads, via Aramini (#200); Gerlach on the self-correcting dramatis personae (#160, partial, quotation only: "subsequent volumes offer a truer picture"); Borski on the extracts (#253, partial, quotation only); Gerwel on the translator's note (#105, partial, quotation only).

Wording: "an introduction by Wolfe posing as translator" (#163); "Little is told chronologically" (#254); "from his own memories and from much oral testimony" (#438); "what probably happened, and what must have happened" (#77); "records nobody reads, and records nobody can read" (#200); "but nevertheless it is catalogued, there it is on the page" (#418); "histories, reports, assessments, commentaries" (#370).

Rule (archivist, chronicle line): the dossier presents itself as a document with a stated origin, a file assembled by an officer, a scroll translated by a later hand, an account reconstructed years afterward from memory and oral testimony; some events are told in great detail, some at second hand, some with gaps that only guesswork could fill; the order is the file's, not the calendar's; mundane matters of the compiler's own present intrude; what the record catalogues thereby exists.

### 16. Place names are translations of a meaning the settlers believed, mostly wrong and plausible

Support: 4 distinct sources, three of them Wolfe's own texts relayed by Wowra. Wolfe's foreword to Soldier of the Mist (#332, #427); Wolfe in the Schweitzer interview (#182, #337, #426); Wowra's toponymy (#181, #185, #333, #334, #335, #336, #423, #424, #425); Wolfe on Davidson's obsolete real place names (#234, #235); the foreword and Wowra again in partial rows (#180, #183, #184, quotations only: "he understood (or believed he understood) their meanings", "awash with charming place names that evoke wonder and puzzlement", "seems to have heard some taciturn person referred to as").

Wording: "more often translated them when he understood" (#332); "Latro relies predominantly on folk etymology" (#185); "although his derivation of it is incorrect" (#182); "Spartans were renowned for brevity in speech" (#336); "Suppose this place survived as an entity with that name" (#235).

Rule (archivist): a place name in the dossier is a translation of the meaning the settlers believed it carried, not a transcription of a sound; most names are plausible wrong readings, fewer are descriptive, associative or commemorative; a name may be right for the wrong reason, and the dossier never says which.

### 17. Each speaker has a register of his own, and the reader knows the hand without a tag

Support: 7 distinct sources. Wolfe (#16, #224, #25, #26, #59, #48); Clute on the dozens of dialects (#201); Gevers on eccentricities of diction (#437); McCaffery's headnote (#266); WolfeWiki (#290); the forum analyst felicibusbrevis on the embedded myth's prose (#388); Wolfe's "knows who said that from what was said" (#225, partial, quotation only).

Wording: "The butler mustn't sound like the footman" (#26); "she is saying something that only Maytera Marble would say" (#16); "Rich eccentricities of diction abound, retarding comprehension." (#437); "the style changes from one letter writer to another" (#48); "Oreb can manage only two syllables" (#59).

Rule (archivist, Herald): a testimony, petition or proclamation embedded in the dossier is written in its speaker's own manner, so that a reader knows the hand without a tag; the butler does not sound like the footman, and an embedded myth is in a different prose from the entry that holds it.

### 18. Dialogue is action; a line is admitted only if it does several jobs at once

Support: 1 author, Wolfe, in two interviews (#25, #56). Flagged: single author.

Wording: "Dialogue is action." (#25); "it's a waste unless it's said in some particular way" (#56).

Rule (Herald): a quoted line in a short pool carries plot, tone and character at once; a line that only passes the salt is cut.

### 19. A settlement is not a monoculture; its wards and ranks speak almost different languages

Support: 3 distinct sources. Wolfe (#21, #236, #237); Gevers (#437); Clute (#201).

Wording: "Mental sloth more than anything else." (#21); "people are talking in ways that are almost different languages" (#237); "diversity among the neighborhoods and social levels" (#236).

Rule (archivist, Herald): quoted speech differs by ward and by rank; the settlement's speech is never one language.

### 20. Deep time is reckoned vaguely; the past survives as fragments the settlement half-understands

Support: 7 distinct sources. Andre-Driussi (#244, #428, #245, #429, #246, #430, #351, #353); Aramini on the Herodotean blend (#199); Wolfe's Knight via Aramini (#200); Elliot (#316, #318); Hunt (#321); Farrell on density of history (#165); Wolfe on memory (#265); Andre-Driussi's earlier figure (#352, partial, quotation only: "This statement strongly implied to me that the autarchs had reigned").

Wording: "post-historic vantage point means that all time is vague" (#244); "goes against the Vancean grain of numbered Aeons" (#245); "blends history, myth, and rumor" (#199); "the melancholic weight of hundreds of extinguished civilisations" (#321); "perhaps the society has forgotten or misinterpreted its own history" (#316); "The novels are too dense with the details of history" (#165).

Rule (archivist, chronicle line): the dossier never numbers its ages; it says many generations, a chiliad, before the founding, in living memory; the older past survives as memories and as records nobody reads; history is entered mixed with rumour and legend, as the settlement itself received it; the density of particular detail is what keeps the record from reading as parable.

### 21. An institution is rendered by its procedure and its silences, and a building's function emerges in the entry

Support: 3 distinct sources. Crampton on the guild and the judiciary (#443, #444, #445); Clute on the narrator's house as prison, pleasure garden, tomb and laboratory (#211, #212); Kelly on the house that develops into a brothel (#363); Wright on the house as metaphor for isolationism (#177, partial, quotation only).

Wording: "the executors of a sentence decided elsewhere" (#443); "his system should approximate so closely that of Europe up to" (#445); "It develops that this large house is a brothel." (#363); "a prison, a 'pleasure garden,' and a tomb" (#211).

Rule (archivist): an institution is described by what it executes, for whom, and in what sequence; the dossier's guilds have offices, oaths and silences; the function of a building is not announced but emerges in the course of the entry that uses it; the juridical machinery resembles an old world's, and the dossier does not remark on the resemblance.

### 22. The opening sentence is a plain civic fact whose grammar is exact and whose payoff comes later

Support: 11 distinct sources. Alex (#278, #279, #280); Keeley (#292, #358, #293, #359, #357); Sales (#382, #383); Borski (#433); Clute (#213); Danehy-Oakes (#393, #394); Horton (#408, #409); Gevers on the four Long Sun openings (#188, #327, #398, #328, #399, #401, #402); Gerwel (#103); Knode (#125); Wolfe on rewriting the opening pages of Fifth Head (#258) and on its purpose (#259, partial, quotation only: "the feeling of stagnation which affects a lot of"); Wolfe on building backward from an ending image (#66) and on a story working "By engendering expectations and satisfying them." (#28).

Wording: "no obvious genre trappings in this opening paragraph" (#278); "We eventually do learn why that comma is missing." (#293); "This first page is full of forward references" (#394); "The novel's somewhat famous opening sentence reads" (#408); "only yield up in oracular or otherwise obscure form" (#188); "silent implication can convey as much as any violent confrontation" (#401); "a different, single, and seemingly unrelated line" (#103).

Rule (archivist, chronicle line): the first sentence of a dossier is a plain civic fact, a tree fell, a gate is locked, a dormitory faces west, that a later entry pays off; it names no genre furniture; its grammar is exact because a reader will lean on it; its information and the shape of its reticence teach the reader how to read the rest.

### 23. The closing sentence is short and carries implication past the entry

Support: 6 distinct sources. Gevers on the slingshot ending and on the narrator's late self-identification (#190, #400, #191, #407); Person on "Silk nodded." (#153); Sleight on the last reported speech ending on "know" (#133); Borski on the chilling last sentence (#434); Keeley on the single first-person sentence near the end (#294, #360); Wolfe on always having a destination (#36); Aramini on melancholy endings (#151, partial, quotation only: "his endings are often melancholy").

Wording: "Silk nodded." (#153); "an ending whose momentum of implication carries well beyond the confines" (#190); "especially hard to parse" (#133); "asks readers to reconsider everything that they've already read" (#294); "you should always have a destination" (#36).

Rule (archivist, chronicle line): the last sentence of an entry is short, may be two words, and carries its implication past the entry; it does not summarise; an entry may end on a fact that makes the reader reread what came before.

### 24. The entry ends before the set piece and the next entry opens after it

Support: 5 distinct sources. Khanna on Able's battle (#129); the Reactor commenter NancyLebovitz (#99); Keeley on the white space between chapters (#298); the Solute essay (#119); the MetaFilter reader straight, for whom "the deliberate frustration of expectations" is more central to Wolfe than unreliable narration (#378).

Wording: "In the following chapter, we pick up afterwards" (#129); "explained at the beginning of the next chapter" (#99); "Pay attention to his sins of omission" (#298).

Rule (archivist, chronicle line): an entry ends before the battle or the death, and the next opens afterward; the event is recovered from testimony and consequence, never narrated; a question raised in one entry is answered several entries later.

### 25. The dossier is written for the second reading

Support: 5 distinct sources. Wolfe's definition of good literature (#51, #242); Gaiman's third rule (#85, #447); Clute (#89, #91); Gerwel (#101, #103); Khanna (#128); Wolfe on rationing Tolkien (#82, partial, quotation only: "no more than a single chapter each evening").

Wording: "reread with increased pleasure" (#51); "A Wolfe story always knows more than it says" (#89); "It only became a horror novel on the second" (#85); "in retrospect or after rereading almost invariably lucid" (#91).

Rule (archivist): sentences that are plain on first pass acquire a second sense once a later entry is known; nothing is lost on a reader who never returns, and something is gained by one who does.

### 26. No figure of speech that is not also literally true; the thing itself, not allegory

Support: 6 distinct sources. Clute 2009 (#205, #206, #207, #208); Wolfe denying allegory and genre (#10, #74); Farrell (#165); Aramini on literalised metaphor and the dogs called gods (#145); Gordon correcting a symbolic reading with the novel's plain words (#452); Wolfe on scripture's "picturesque language" as the exception that proves the rule (#14).

Wording: "Wolfe did not create metaphors in his text" (#205); "he did not write allegory, he wrote the thing itself" (#207); "The book isn't intended as an allegory." (#10); "the literalization of metaphors" (#145); "but the novel merely notes that she has grown" (#452).

Disagreement: Gordon in the same review finds the first section of Peace "cascading from metaphor to metaphor" and says "No one else writes like that" (#113), against Clute's flat denial (#205); Aramini holds that Wolfe "embeds tales which map allegorically to the larger story" (#146), against Wolfe's own denial (#10) and Clute (#207). The set does not resolve this; the safe reading is that the narrating voice uses no figure, while an embedded tale may mirror the frame without the frame saying so.

Rule (archivist): the archivist writes no figure of speech that is not also literally true in the settlement; if the tunnel dogs are called gods, there are gods in the tunnels; a tale told inside the dossier may mirror the settlement, but the entry never says that it does.

### 27. Contradictions and hedges are read as signals, and some are plain errors that stand

Support: 8 distinct sources. WolfeWiki (#288); Khanna on the chaste relationship (#130, substance only); JWillard on "perhaps" and "seem" (#392, #462); Danehy-Oakes on the narrator's own explanation of the coin, which "simply doesn't wash" against a detail the narration itself supplies (#396); Wolfe conceding his mistakes (#78, #381) and checking consistency in revision (#264); Lackey (#397); the Urth reader b sharp (#460); Wolfe on typos as non-clues (#13, partial, quotation only: "some of them are typos"); Fernandes on the perfect-memory contradiction (#123, partial, quotation only: "I who pride myself upon remembering everything").

Wording: "Apparent contradictions are often useful hints" (#288); "words like 'perhaps' and 'seem' are treacherous" (#462); "You're right, and they are my mistakes." (#78); "Typo." (#381); "so the mistake is probably Wolfe's." (#397); "establishing, within the first pages, Severian as an unreliable narrator." (#460).

Disagreement: on the pistol contradiction, Lackey (#397) reads a repeated error as the author's, b sharp (#460) reads it as the narrator's and purposeful; Wolfe himself, asked about two other anomalies, answered "they are my mistakes" (#78) and "Typo." (#381), and Langford records that readers "read subtleties into Wolfe's least typos" (#78).

Rule (archivist, DM page): a contradiction between two entries is either a planted signal or a clerk's error, and the dossier lets it stand either way; a hedge (perhaps, it seems) marks the place where the record is unsure of itself; the generator must never introduce a contradiction it cannot account for on the DM page, because the reader will read every one as a signal.

### 28. The surface stands on its own; the buried links are extra

Support: 5 distinct sources. Swanwick (#306, #308, #311), and on annotation paying off because Wolfe "puts so much more into his works than almost any other writer" (#310); Polansky (#324); Gordon (#452); Wolfe's Sword of the Lictor sentence via Aramini (#198); Sleight's standard of a reading that accounts for everything (#135).

Wording: "not necessary for your enjoyment of the experience" (#311); "Note the careful engineering of the suits and cenotaphs." (#308); "possible to miss the subtle clues" (#324); "why everything that's in the text is there" (#135).

Rule (archivist): every entry makes plain sense on its own and is worth reading for what it plainly says; buried links are additional and never required; and yet a reading that accounts for every detail is possible.

### 29. The author does not explicate; questions put to the record are answered literally or deferred

Support: 7 distinct sources. Wolfe (#52, #53, #63, #64, #68, #79, #80, #261, and #70, partial, quotation only: "No comment."), and, via Swanwick, that "Almost any interesting work of art comes close to saying the opposite" of what it says (#309); Swanwick (#302, #307); Gordon (#112, #451); Aramini (#149); the MetaFilter reader RogerB (#375); Wright via Gordon (#110), dissenting, and directly on the puzzle's existence mattering more than its solution (#347).

Wording: "There's no sacredness to the text." (#52, verifier's wording of the page); "Oreb is a night chough." (#79); "You will have to read The Book" (#80); "is not to mystify my readers" (#261); "Ambiguity is necessary in some of my stories, not in all." (#68); "I thought that everyone would get it" (#64).

Disagreement: Wright, quoted by Gordon, names "the element of choice" as "Wolfe's principal device for confounding the reader" (#110) and elsewhere calls ambiguity "a means of confounding interpretation" (#173, #346); Wolfe's "not to mystify" (#261), Gordon's "I vehemently disagree that Wolfe's goal is to confound" (#451), Aramini's "merely pretends to create inconclusive subjectivity" (#149) and RogerB's "hyperrational puzzle, not epistemic uncertainty" (#375) stand against him. Swanwick holds both: Wolfe "always leaves room for multiple interpretations" (#307). The set leans four to one toward solvability.

Rule (archivist, DM page): the DM page holds the answer and the dossier never confirms a reading; when a question is put to the record it answers literally (the bird is a night chough) or defers to a later entry; ambiguity is admitted only where the settlement's own record is ambiguous, and never as decoration.

### 30. The opening entries teach the reader how to read the rest, without saying so

Support: 8 distinct sources. Gevers on augury as instruction (#187, #192, #405, #402, #328, #399, #442); Gaiman's rules one and seven (#84, #446, #86, #448); Swanwick's three rules (#303, #304); WolfeWiki's four questions (#291); Wolfe via the MetaFilter reader straight (#380); Hayles on Severian stating the rule of symbols while blind to his own tomb (#465); JWillard, "why I walk through Wolfe like a minefield" (#391); the Urth reader b sharp on chapter-by-chapter reading exposing "things previously hidden in the cracks" (#461).

Wording: "instruction in, the demands of incisive reading" (#187); "Look for hidden implications." (#303); "pay serious attention to the obvious" (#304); "signs are presented to those augurs, Silk and the reader" (#402); "He is smart to make you smart as well." (#86).

Rule (archivist): the dossier's first entries contain, in the settlement's own terms, a scene of reading (a rite of augury, a shelf ordered by letter, a clerk checking a ledger) that models the attention the rest requires, and the dossier never says that this is what the scene is for.

### 31. Names carry meaning under a scheme the dossier never announces; some persons are known by title alone

Support: 6 distinct sources. Sleight (#136); Borski on Number Five (#436); Sales on the surname on the shelf (#386); WolfeWiki on the onomastics essay (#154); Wolfe on Mary Christmas (#38); Andre-Driussi on the Autarch's unwritten name (#431), and on the saints scheme (#331, partial, quotation only: "naming people in the Commonwealth after Catholic saints").

Wording: "Names are always important in Wolfe stories." (#136); "the only name he's identified by in the book: Number Five" (#436); "why the Autarch's name is never written in Severian's narrative" (#431); "you find out by deduction" (#38).

Rule (archivist): names in the dossier are drawn from a scheme (saints, metals, stars, trades) and the scheme is never announced; some office-holders appear only by title, and a name withheld can be found by deduction from another entry.

### 32. Cadence is even; one chosen word can be the keynote of an entry; a rhyme in a folk name is kept

Support: 6 distinct sources. Sini (#284, and #285, partial, quotation only: "its contours aren't always clearly defined, but it's also not vague"); Sleight on craquelure (#134); Cooney on the rhythm Wolfe told her to keep (#356); Kelly (#365); Holland (#275); Wolfe on getting the language right mattering most when "trying to capture a specific atmosphere or cultural attitude" (#260).

Wording: "they hit at the level of rhythm and structure" (#284); "That wonderfully well-chosen word craquelure" (#134); "he urged me not to take my knife to it" (#356); "not both precise and poetic" (#365); "made beautiful by careful word choice" (#275).

Rule (archivist, Herald): the archivist's cadence is level and unhurried; one exact, uncommon word may serve as the keynote of an entry; a sing-song or a rhyme in a folk name or a saying is kept, not cut.

### 33. The settlement's bad actor is rotten selectively and never calls himself a villain

Support: 1 kept source, Wolfe in the Baber interview (#72), with Wolfe in Clarkesworld 2015 as a partial row (#34, quotation only: "a real villain never thinks he's a villain"). Flagged: single source.

Wording: "most rotten people are only rotten selectively" (#72).

Rule (archivist): a bad actor is recorded as generous to his drinking companions and rotten only in one quarter; no entry calls him a villain, and any testimony he gives casts him as the wronged party.

### 34. The record does not talk down: it assumes an educated reader and does not explain its jokes

Support: 4 distinct sources. Wolfe (#42, #71, #51, #55, #81), and on realistic fiction leaving out "far, far too much" (#29); Gaiman (#86, #448); Clute on "Wolfe's refusal to unpack in easy terms" a tale hard to tell (#202); Wright on Wolfe "effectively concealing his narratological sleight of hand" rather than displaying it (#458).

Wording: "you bore the reader" (#42); "we don't dumb it down" (#71); "who see no need to point out how clever they are" (#448); "society need not be as we see it around us" (#81); "refusal to unpack in easy terms" (#202).

Rule (archivist): the dossier never explains a reference, a name or a joke; it assumes a reader who will look; and by showing a society whose laws are its own it assures the reader that things need not be as they are.

### 35. Two unexplained entries may be placed so that each resolves the other; an embedded tale mirrors the frame

Support: 1 source, Aramini (#144, #146), with Jacobs as a partial row (#116, quotation only: "comment in various ways on the events"). Flagged: single source, and see the disagreement under feature 26.

Wording: "the two mysteries explain each other" (#144); "embeds tales which map allegorically to the larger story" (#146).

Rule (archivist, DM page): two unexplained entries may be placed far apart so that each is the other's explanation, and the DM page records the pairing; a tale told inside the dossier may mirror the settlement, without the entry saying so.

### 36. Which Wolfe to imitate: the later plain surface, not the New Sun baroque

Support: 5 distinct sources. Wolfe on loosening up under criticism (#41) and, via Price, on making his style simpler (#147); Wolfe on the New Sun as in part a decision to "rewrite The Dying Earth from my own standpoint" (#12) and on his knack for imitating other writers' voices (#11); Aramini on post-New Sun minimalism and subtext replacing text (#141, #142); Price on the detective-story model (#148); Searles via Wright, calling the tetralogy a possible turning point "from matter to manner" (#223), with Wright's report that the predicted academic field day "has gone largely unfulfilled" (#222).

Wording: "criticism for being unreadable and overcomplex" (#41); "make his style simpler and more accessible" (#147); "The subtext tends to replace the text." (#142); "they provided the stylistic model for his writing" (#148); "from content to style, from matter to manner" (#223).

Rule (DM page, governing which register the generator targets): the archivist follows the later Wolfe, a plain and accessible surface with the depth below it, and not the long Vancean sentence of the early tetralogy; but Aramini's warning that the late work started to play less and less fair sets the limit: the dossier's subtext never wholly replaces its text.

### 37. Geography, population and time scale cohere, and one hand holds the account together

Support: 4 distinct sources, two of them negative evidence. Jones faults There Are Doors for a dream landscape "without coherent geography, population or time scale" (#167); Farrell faults Castleview because it "lacks the unifying force of a first-person narrator" and threatens to collapse under its cast (#166); Wolfe on the floor plan drawn because he was otherwise "getting tangled up in such details" (#262, #263) and on a complex story needing a clear structure, "or it isn't complex, it's simply confused" (#17, #228).

Wording: "without coherent geography, population or time scale" (#167); "lacks the unifying force of a first-person narrator" (#166); "it isn't complex, it's simply confused" (#17).

Rule (archivist): the settlement's geography, its population and its time scale are fixed before the first entry and never drift; the account is held together by one keeping hand; a large cast is admitted only under that hand; complexity is permitted, confusion is not.

### 38. The dead narrator's house as memory palace (DM page only)

Support: 5 distinct sources. Wolfe on Weer as a dead man so that the rooms could be re-created (#5), as "a ghost trying to make sense of his own life" (#6), on the Simonides memory-palace system in the Soldier books (#9), on ghosts who do not realise they are dead (#43), and on memory as "all we have" (#265); Jacobs on the palace with lost rooms (#117); Fernandes on the house as haunting place reused in "Checking Out" (#124); Gerwel on the unstated premise (#102); Knode (#421); Gordon quoting Wolfe on Weer, "we have similar souls", against readings of the ghost as the devil (#114).

Wording: "lend to the memories certain supernatural strengths" (#5); "a ghost trying to make sense of his own life" (#6); "Ghosts often don't realize they're dead." (#43); "a rambling memory palace of his own making" (#117); "a point in space for a dead person" (#124).

Rule (DM page): the device belongs to the DM page as a pattern for a hidden premise, a keeper of the record who is not what he appears, a house whose rooms are the seasons of a life, some of them lost; the dossier itself never names the premise, and the archivist's register does not change when the premise is true.

## Second verdicts, concentration, and the register map

No row in state-wolfe.json carries an `alt` field: 0 of 468. The merge tool (sweep-state.mjs) does not write one; it overlays later verdicts on earlier ones, with every `-regrade-` file sorted last. What the set does carry is 21 rows that received a second verdict from a different verifier pass: each was VERIFIED_VERBATIM in its chunk file and PARTIAL in verdicts-wolfe-regrade-r4.json, so all 21 disagree, every one a downgrade, and the regrade won in every case. They are indices 0, 7, 31, 49, 58, 62, 73, 87, 150, 156, 169, 174, 176, 180, 214, 259, 285, 289, 301, 387 and 466; every one of them appears in the partial table below and is cited above only for its quotation. The 45 other PARTIAL rows were graded PARTIAL on first pass. verdicts-wolfe-regrade-r1.json is a recorded no-op from before any wolfe verdict existed. No wolfe row carries a verdict of NOT_FOUND, CONTRADICTED or BLOCKED.

Source concentration: the 402 kept rows come from 88 distinct URLs on 43 hosts. The top three hosts hold 174 rows, or 43.3 percent: ultan.org.uk 100, gwern.net 46, reactormag.com 28 (web.archive.org, a mirror, holds 27 more). Host concentration overstates single-voice concentration in one direction and understates it in another: gwern.net and web.archive.org each host a dozen different authors, while the same document appears under several hosts and angles (the Person 1998 interview at gwern.net, losarciniegas.blogspot.com and en.wikipedia.org). By speaker, Wolfe's own words (interviews, forewords, the appendix, letters, the numbered advice) account for roughly 150 to 160 of the 402 rows by a source-string match, not a hand count; the largest single critical voices are Gevers (about 30 rows across two essays), Wright (about 25 across two essays and relays), Andre-Driussi and Wowra (about 15 each) and Clute (about 15 across three pieces). The academic angle is the narrowest: 18 URLs on 5 hosts, 100 of its 112 rows from ultan.org.uk and gwern.net.

REGISTER MAP. Rules binding a settlement dossier's archivist: 1 (real old words, none coined), 3 (plain controlled sentence), 4 (show, never state), 5 (name the ship, cargo and shoal), 6 (one odd particular among plain ones), 7 (context over exposition), 8 (gaps left standing), 9 (evidence placed and unlabelled), 10 (a fact given once), 11 (few weight-bearing details, some plain furniture), 12 (a named hand's account, which omits but does not fabricate), 13 (seen, not meant), 14 (belief from inside), 15 (a document with an origin), 16 (place names as believed translations), 19 (wards and ranks speak differently), 20 (vague deep time, no numbered ages), 21 (institutions by procedure and silence), 22 (opening as plain civic fact), 23 (short closing with implication), 24 (entry ends before the event), 25 (written for the second reading), 26 (no figure that is not literal), 27 (contradictions and hedges stand), 28 (the surface stands alone), 30 (a scene of reading early), 31 (names under an unannounced scheme), 32 (level cadence, one keynote word), 33 (the selectively rotten bad actor), 34 (never talk down), 37 (geography, population and time scale cohere under one hand). Rules for the Herald's short pools: 3 (short declaratives), 5 (the named particular), 17 (each speaker's register, no tags), 18 (a line does several jobs or is cut), 19 (ward and rank in the speech), 23 (the two-word line), 26 (no metaphor), 32 (a rhyme in a saying is kept), and 1 (a real old word, never a coinage, with the sentence making its sense plain). Rules for the chronicle line: 10 (once only), 15 (the line names its source: a file, a scroll, testimony), 20 (no digits; ages by generation, chiliad and living memory), 22 (a plain civic fact first), 23 (implication past the line), 24 (the line records the aftermath, not the event), and 8 (a gap is a gap). Rules for the DM page only: 2 (the dictionary method for building word pools), 27's accounting (every planted contradiction has a DM-page reason; every unplanned one is a bug), 29 (the answers are held there; the dossier never confirms a reading), 35 (paired mysteries and mirrored tales are recorded as pairs), 36 (which Wolfe the generator targets), 38 (the memory-palace premise as a hidden-premise pattern), and the drafting discipline the set attributes to Wolfe himself (#22 generalities into hard facts, #24 four drafts, #50 cut every unneeded word, #171 all volumes in second draft before selling the first, #256, #257, #258 on rewrites, #37 research while writing, #262, #263 the floor plan, #264 the same person on the last page as the first, #40 padding admitted, #60, #61 on the narrator discovered mid-draft), which governs the generator's own passes and never surfaces in the product. Feature 36 also decides a question that the register map cannot: which of the two Wolfes the archivist voice is modelled on; the set says the later one.

## Partial rows (cited above only for their verbatim quotation)

| index | quotation (verbatim on the page) | the unsupported limb |
|---|---|---|
| 0 | "I try not to leave a clue more than once" | "refuses to repeat it"; Wolfe's word is the hedged "I try not to" |
| 3 | "pretty much straightforward journalistic prose" | the contrast with "the stylized first-person of the Severian books"; the interview never says "first person" |
| 7 | "a genuinely good man who can't remember" | "The Soldier books" (plural); the page says singular "The book" |
| 13 | "some of them are typos" | "warning readers against treating every oddity as a clue"; no warning, no mention of clues |
| 18 | "not coining Tars Tarkas type names" | the attribution to The Book of the New Sun specifically |
| 31 | "it's usually ruinously bad" | "puts the reader inside the story"; the page's vantage is the writer's as much as the reader's |
| 33 | "what they are seeing is themselves" | the causal "because"; the page gives long experience as the reason |
| 34 | "a real villain never thinks he's a villain" | "which shapes how bad men narrate themselves" |
| 39 | "He's an executioner." | the name "Severian"; the page never names the character |
| 49 | "look at scenery from a standpoint of defensive positions" | the link to Severian's "war is a new geography" line; by adjacency only |
| 58 | "A style becomes difficult when it is not suited" | "only when"; the page says "when" |
| 62 | "She has deliberately falsified nothing." | "leaving errors to ignorance not intent"; Wolfe does not concede the alleged error |
| 70 | "No comment." | "leaving discovery to the reader"; the page gives no reason for the refusal |
| 73 | "It is paper. It is cheese." | the application to fiction; never stated outright |
| 82 | "no more than a single chapter each evening" | "the habit of the rereader he later writes for" |
| 83 | "two sides" | "a distinction Wolfe's own Latinate diction depends on" |
| 87 | "He knows whose reflection they saw in the mirror" | "recoverable" as a claim of rule 8; that rests on rule 1 |
| 88 | "He has an engineer's mind" | "evidence of the engineer's mind behind the clue-planting" |
| 92 | "recursive retrospect" | the gloss of what the term means; the page defines nothing, and drops "unreliable" |
| 93 | "taxing reticences of presentation" | "make the work very nearly opaque" unqualified; opaque to one school of criticism |
| 94 | "unrelentingly put under the question" | said of Peace; the phrase sits in the Fifth Head paragraph |
| 105 | "limited ability to write" | the translator, rather than the essayist, noting the haste |
| 106 | "what Wolfe's leaves out that gives it its depth" | that the prose has density; the page denies it is dense |
| 108 | "You know nothing." | that the passage opens "Tracking Song" and addresses its narrator |
| 116 | "comment in various ways on the events" | that the reader must decide which tales comment |
| 118 | "characters will lie in dialogue but not in narration" | that narrative statements can therefore be trusted |
| 123 | "I who pride myself upon remembering everything" | "a self-contradiction the text leaves standing"; the page reconciles it |
| 150 | "It is not Latro who can't be trusted" | "and memory"; Aramini names perceptions only |
| 151 | "his endings are often melancholy" | "and inconclusive" as a general property |
| 152 | "seemingly inconsequential details will have consequences later on" | "every tale should be read as a mystery"; the page says virtually every tale from the seventies on |
| 155 | "about five and half feet" | that Wolfe acknowledges the Borges and Crowley homages; those are the interviewer's |
| 156 | "we begin to inhabit much as the characters do" | "its city"; Gerlach writes "world" and "whorl" |
| 159 | "familiar with are applied in unusual, usually comical ways" | "rather than by coining new ones"; the article cites coinages |
| 160 | "subsequent volumes offer a truer picture" | "with no narrator announcing the correction" |
| 168 | "The reader is left groping without guidance" | that withholding causes the groping and displaces inference |
| 169 | "a man has died and he is haunting his own mind" | "its narrator"; Wolfe says "a man" |
| 170 | "This is something very few people seem to understand about Peace" | "signals it only through its opening sentence"; the closing chapters are cited too |
| 174 | "the puzzle is where the political arguments of the novel can be found" | "unsolved"; Wright later resolves part of it |
| 176 | "clues lead the cautious and reflective reader" | "the ambiguity is resolvable rather than open" |
| 177 | "is a rambling metaphor for cultural isolationism" | "so that the building carries the book's political argument"; and "and imperialism" is dropped |
| 180 | "he understood (or believed he understood) their meanings" | "the record's names are the narrator's guesses"; some were written as heard |
| 183 | "awash with charming place names that evoke wonder and puzzlement" | described as "plain compounded names" |
| 184 | "seems to have heard some taciturn person referred to as" | "mishearing"; the error is inferential, not auditory |
| 203 | "that goodness is in the details" | "rather than in any statement about him" |
| 214 | "academics have notoriously tended to shun him for decades" | the flat causal "because"; Clute hedges and names a second reason |
| 219 | "On a first, superficial reading, there is little to distinguish" | "little in the prose surface"; the style is the stated exception |
| 221 | "I know the cards are up the sleeves somewhere" | "a working novelist"; the page calls Budrys a reviewer |
| 225 | "knows who said that from what was said" | "without a speech tag" |
| 247 | "the poisoning of the water is a direct result of technological decline" | "a single offhand remark by a minor character" |
| 248 | "the city had to move upstream to avoid its own filth" | that the narrative never states this civic history |
| 249 | "how odd language can sound without science fiction authors inventing new words" | real "English" words; the page says only "real" |
| 253 | "Much of what the officer examines takes the form of extracts" | "most"; and "taped interrogation transcripts" for "taped interviews" |
| 259 | "the feeling of stagnation which affects a lot of" | "governs what follows"; the page is weaker |
| 277 | "the scene is peppered with clues to the larger story" | that the scene reads as ordinary recollection |
| 285 | "its contours aren't always clearly defined, but it's also not vague" | the dropped "always" |
| 289 | "The information you need is always there" | "though not where the reader expects it"; the page says "might not be" |
| 301 | "his prose is as good as prose gets" | "Novelist" as the page's descriptor of Swanwick |
| 325 | "only a proportion of the meaning is on the surface" | "names Wolfe as the model"; Palmer denies imitation |
| 331 | "naming people in the Commonwealth after Catholic saints" | that Andre-Driussi speaks the words; they are the interviewer's question |
| 339 | "he doesn't lie to the reader" | that the essay disputes a "common claim" and sustains the position; it later asserts the opposite |
| 344 | "don't tell me histories as if they were written in books" | that the history surfaces from a character's interaction; the page addresses the writer |
| 352 | "This statement strongly implied to me that the autarchs had reigned" | "a single character's offhand remark"; a Wolfe interview was a second basis |
| 354 | "Always tell a story as cleanly and as clearly as possible." | that the advice came in a letter; the setting is unnamed |
| 387 | "at the heart of getting to the bottom of things in Wolfe" | the dropped "usually" |
| 466 | "despite the fact that Severian does not emphasize them whatsoever" | "must derive"; Hayles writes "we can" |
| 467 | "had no business being on that beach." | that the cart tracks are the load-bearing evidence; one detail among several |

## Coverage

| angle | claims | distinct URLs | distinct hosts | verified (verbatim + substance) | partial | not found | contradicted | blocked |
|---|---|---|---|---|---|---|---|---|
| voice | 156 | 33 | 23 | 125 (123 + 2) | 31 | 0 | 0 | 0 |
| academic | 112 | 18 | 5 | 90 (90 + 0) | 22 | 0 | 0 | 0 |
| craft | 89 | 24 | 14 | 79 (79 + 0) | 10 | 0 | 0 | 0 |
| close | 111 | 29 | 12 | 108 (108 + 0) | 3 | 0 | 0 | 0 |
| total | 468 | 91 | 45 | 402 (400 + 2) | 66 | 0 | 0 | 0 |

The three right-hand columns are zero across the board and that is a property of the round, not of the critics: the round-3 wolfe claims were extracted from an already-fetched corpus (found-wolfe-{academic,craft,voice,close}.json), so the verifiers were checking transcription and limb support against pages already in hand, and no claim was ever sent to a page that could not be reached or that said the opposite. Twenty-one of the 66 PARTIAL rows are downgrades from the regrade pass; the rest were PARTIAL on first grading. The sweep ran only the four angles above; no studies, industry or counter angle exists for wolfe, so the dissenting voices in this section (Gillespie, Jones, Wright on confounding, Lackey on error, Macdonald on coinage, Holland and Gevers on density) arrived inside the four angles rather than through a dedicated counter sweep.
