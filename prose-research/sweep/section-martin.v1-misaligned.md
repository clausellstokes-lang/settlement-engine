# Dossier section: George R. R. Martin

Sweep `martin`, run `wf_e25da3f7-7fb`, merged 2026-09-05. Built from the VERIFIED_VERBATIM and VERIFIED_SUBSTANCE claims only. Claims are cited by index (`#n`). Digits appear in this section only in indices, counts and dates; every reconstruction rule below is written in the target register (present tense, concrete civic nouns, no digits, no em dash).

## Alignment correction, read first

`kept-martin.json` reports 327 kept claims. That figure is wrong on its face. The state file's verdict map is keyed by position, and for keys 150 to 299 the positions no longer match the claims:

| verdict stored under key | actually verifies claim | offset |
|---|---|---|
| 0 to 149 | 0 to 149 | none |
| 150 to 236 | 243 to 329 | plus 93 |
| 237 to 299 | 150 to 212 | minus 87 |
| 300 to 329 (from `verdicts-martin-chunk-00/01.json`) | 300 to 329 | none |

Consequences, CONFIRMED by re-pairing every verdict with its claim and checking that the claim's `quote` field is contained in the re-paired verdict (209 of 214 quoted claims match exactly; the 5 remaining are the inflection and word-order differences the verifiers themselves flagged, e.g. `coins` versus `coin` at #3):

- 297 claims carry a genuine verdict (210 verbatim, 87 substance).
- 30 claims, #213 to #242, carry NO verdict on record. Their slots in `kept-martin.json` hold verdicts that belong to other claims. They are excluded from every feature below and listed at the end.
- 30 claims, #300 to #329, carry two verdicts (the displaced copy under keys 207 to 236 and the correct chunk-file copy); the chunk-file copy is used.
- Probable cause: `export-sweep-state.mjs` rebuilds `claims` by concatenating every finder result in journal order, while the verifiers were indexed against the workflow's deduplicated `freshClaims` list. Once the two orderings diverge, position-keyed verdicts land on the wrong claims. The cure is to key verdicts by content (source, feature, claim prefix), or to re-verify #213 to #242.

The corrected pairing is written to `kept-martin-realigned.json` (297 claims, each verdict annotated with `storedUnderKey`) and the 30 unverified claims to `unverified-martin-displaced.json`, both beside this file. `kept-martin.json` is left untouched.

## How to read a feature

Each feature gives: the supporting documents (distinct URLs, counted) with the claim indices; the true wording of any quotation, always under twelve words; the verifier's load-bearing caveats; and the reconstruction rule for a settlement dossier written by a calm archivist. A feature that rests on one document, or on one critic across several posts, is flagged **SINGLE SOURCE**. Disagreements are marked **DISAGREEMENT**. Martin's own testimony is marked as such; it is evidence of intent, not of effect.

---

## A. Word stock and register

### 1. A native English word stock; Latin, Greek and French borrowings kept out

Support: 2 documents, 1 critic (Simon, Books & Boots, 2013 and 2014): #0, #7, #77, #150, #308, #312; the cumulative-antiquity mechanism at #6. **SINGLE SOURCE** (one critic, two posts). Adjacent, not etymological: Koeksal #149, Zhang #148.

True wording: "high frequency of words of Anglo-Saxon origin" (#0); "consistently chooses words of Anglo-Saxon origin" (#7, #308); "systematic exclusion of almost all words derived from Latin, Greek, French" (#77). The 2014 post ties the effect to accumulation: the prose gains "a cumulative feeling of woodiness, antiquity, pithiness" (#308 note).

Caveats: a personal blog; the verifier notes the author's own count is internally inconsistent (#77 note).

Rule: The archivist names the common thing by its short native word: hall, ward, road, mill, tithe, watch, oath, hearth, kin. Age is felt through the stock of words, never through old syntax. A borrowed word is a choice, not a habit.

### 2. Native prefixes and suffixes carry the age

Support: 1 document: Books & Boots 2013, #1, #2, #79, #151, #312. **SINGLE SOURCE.**

True wording: "Almost none of these are found in Martin's work" (#1, of Latin and Greek prefixes); "convey a deep sense of their Anglo-Saxon provenance" (#2); "the archaic prefix 'a-' to denote position" (#151: atop, abed, ahorse). Suffixes named: -craft, -dom, -hood, -ness, -less, -ling, -ship, -some, -ward.

Rule: New words in the dossier are built with native parts: unfenced, bewildered, aground; wardship, kinship, seaward, hearthless, roadcraft, tollhood. The dossier never builds with sub-, super-, -ation or -ity.

### 3. Two-root compounds, and coinages cast in the same mould; the effect comes from density

Support: 4 documents, 3 critics: Books & Boots 2013 (#3, #78, #152, #153, #313); Books & Boots 2014 (#10, #88, #158); Bednarska 2015 (#54, #55); Zhang 2025 (#148).

True wording: "coin scores of wonderful and evocative neologisms" (#3); "the greater the sense of moving into his otherworld" (#313); "derives not from a handful of obvious stock phrases" (#153, against 'prithee'); "completely new, medieval-sounding words" (#10: septon, maester, warg); "most neologisms have the lexical character" (#54, compounding and affixation, mostly toponyms and proper names); "on the basis of the phrase 'dire wolf'" (#55). Exemplars verified on the page: longsword, godswood, oathbreaker, weirwood, sellsword, dragonglass, greenseer, smallfolk, skinchanger, ironborn, shadowcat, greensight (#78 lists fourteen).

Caveats: the 2013 post's coinage list includes 'pyromancer', a pre-existing Greek-derived word (#88 note); 'two-root' is the post's definition of English compounds generally, not a statement about Martin (#78 note).

Rule: The town's own things are named by two short native roots: millrace, tollgate, saltpan, watchbell, gravehill, marketcross, sheepwalk. A coinage follows the same mould and is used often once made. The sense of elsewhere comes from how many such words a page carries, not from any one of them. The coinage load sits mostly in place names and family names.

### 4. Latinate words reserved for the learned, the legal and the priestly

Support: 1 document: Books & Boots 2013, #4, #80, #312. **SINGLE SOURCE.**

True wording: "technocratic and legalistic mindset of medieval religious inquisitors" (#4, of 'fornication'); Latinate forms are "only deployed for effect" in legal, religious or courtly matters (#80); "the rare use of technocratic neoclassical combining words is very conspicuous" (#80 note). 'Intercession' is a maester's word and in character (#80 note).

Rule: The clerk's entry, the priest's entry and the court's entry may carry one Latin word of office (intercession, sentence, ordinance). The herald and the ledger keep the native word. When the learned voice speaks, the reader hears the change.

### 5. Familiar words bent by a letter; archaisms with real dates; remade coinages

Support: 2 documents: Books & Boots 2014 (#89, #158); OUPblog, Pulford 2012 (#321).

True wording: "slight deformation of existing standard words into something rich and strange" (#89: Ser for Sir, 'flowered' for a first bleeding, natural "by sheer repetition"); ser, southron and craven are dated by the Oxford English Dictionary to the fifteenth century and the year fourteen hundred, and turncloak is Martin's remake of turncoat (#321).

Caveats: Pulford works in marketing for Oxford Dictionaries, not as a lexicographer; craven's date is the turn of the century, not the fifteenth (#321 note).

Rule: The dossier bends one or two common words of office or rite (a title, a rite of age) and uses them until they seem native. A word with a real old date is safer than an invented one. A coinage remade from a living word (turncloak) reads older than a genuine archaism.

### 6. Modern prose with a pinch of archaism; the failure mode is register instability

Support: 6 documents: Books & Boots 2014 as criticism (#5, #13, #81, #83, #84, #154, #159, #310); Gelzer-Govatos 2012 (#90, #92, #316); Germani, 'Linguistic Anachronism' (#170, #171); Wenyip, Overthinking It comments (#319); So Spake Martin, Nottingham 2005, Martin's own rule (#255, #256, #257); Zhang 2025 (#148).

True wording, the rule as Martin gives it: "modern prose, but omitting all pop culture references" with occasional archaic words, likened to salt in soup (#255); after his editor "feared a 'forsooth' would follow shortly", 'mayhaps' stays with old speakers such as Aemon and younger ones say perhaps and maybe (#256); for a period novel he read Twain "to understand the syntax and words", a different strategy from this one (#257).

True wording, the criticism: "prose larded with fake medievalisms" (#5); the style "veers from purely functional modern thriller prose" (#154); "would-be medievalisms which become annoying mannerisms" (#159); "The most persistent one is removing the -ly suffix from adverbs" (#83: he is like to be angry; oft; elsewise; much and more); fifteenth-century forms beside 'divvied up' "as if in modern New York" on one page (#84); "Jape, aside from its pretentiousness, is a singularly displeasing word" (#90); "faux-medieval flourishes go a bridge too far" (#92); "words and phrases he rides like a hobbyhorse" (#316); "a few linguistic relics to give a historical veneer" (#170: must needs, soon or late, near as); "Martin shows you the seams of his work" (#171: pug-nosed, longshoreman, condone, yen, burp, snark); "I think GRRM has a penchant for pseudo-archaic language" (#319: much and more, little and less).

**DISAGREEMENT.** Martin frames the archaisms as seasoning (#255) and the repeated sayings as deliberate (#195). Simon and Gelzer-Govatos read the same tics as mannerism and pretension (#159, #90). Germani reads the relics as a veneer standing in for consistent period language, and finds the modern words leaking through (#170, #171). All three critics agree on the mechanism and differ on whether it works; Zhang alone is neutral ("combines archaic expressions with modern language", #148).

Rule: The dossier is written in modern syntax with no word that names a thing the town cannot have (no longshoreman where there is no long shore, no word younger than the town). A period relic appears at most once in an entry (must needs, soon or late, oft) and never as a habit. The adverb keeps its ending. No jape, no mummer's farce, no much and more. Where a voice is quoted, the old speak older than the young. A fifteenth-century word and a modern colloquialism never share a page.

### 7. Rank is marked in the form of address and in who speaks in proverbs

Support: 2 documents: Rivera 2023 (#66); Tosina Fernández 2022 (#52).

True wording: the low-born use the contracted form and the high-born the two words, "a sort of dialect ruled by rank rather than region" (#66 note); proverbs are "used chiefly by 'upper-class' characters", against the usual view of proverbs as the knowledge of the uncultured (#52).

Rule: The record notes how the low-born address the high-born by the shortened form, and how the high-born address each other by the full form. A proverb may sit in the mouth of the hall as readily as in the mouth of the market.

### 8. Proverbs of three kinds, anchored in the town's beasts, trades and faith, and passed from mouth to mouth

Support: 2 documents: Tosina Fernández 2022 (#50, #51, #53); OUPblog 2012 (#322). Adjacent: Hurley 2019 (#71) on reminders carried by dialogue.

True wording: real proverbs, real proverbs adapted, and proverbs invented ad hoc, the author "creates his own, ad hoc" (#50); idiom is anchored to things that exist only in that world, "to be stubborn as an auroch", 'to take the black', 'seven hells' (#51); characters reuse items heard from others, "improving their paremiological competence" (#53); "Dark wings, dark words" spoken at almost every raven (#322).

Rule: The dossier's sayings are of three kinds: the saying the reader knows, the saying the reader knows with the town's beast or trade swapped in, and the saying the town alone has. Each is anchored to a thing the town possesses: its ox, its ferry, its saint, its bell. A saying entered in one party's mouth is later repeated by another.

### 9. Foreign tongues are English with the rhythm changed; only the needed words are invented

Support: 3 documents: Not a Blog 2010 (#200); IGN via Winter Is Coming 2019 (#258); OUPblog 2012 (#322). Two are Martin's own words.

True wording: Dothraki rendered by "playing with the syntax and sentence rhythms a bit" (#200); "He invented entire languages, I just fake it" (#258, with "I invented like eight words"); the tongue "is noted but rendered in English" (#322 note).

Rule: The dossier invents no language. A foreign speaker is marked by a named tongue, a changed word order and a changed rhythm, and by a handful of loanwords at most.

### 10. Names: real names slightly bent, chosen for sound; bynames that do the work of exposition

Support: 7 documents: BuzzFeed 2014 (#139); So Spake Martin, naming correspondence 2003 (#259, #260); Infinity Plus 2001 (#261); nekoplz interview (#262); Books & Boots 2014 (#11); Oliver, Fiction Advocate 2015 (#128); Germani, 'Making a Memorable Character' (#185).

True wording: "I took actual names we still use today, like 'Robert'" and he cannot proceed until the right name is found (#139); "variants of real names -- Eddard for Edward", which must have the right sound (#259); "He's marvelous with names" (#260, of Vance; Tolkien named next); "Vance has his voice and I have mine" (#261); names are "nearly recognisable but bent or distorted", in Similar, Alien and Exotic classes (#11); "his extreme (over)use of meaningful nicknames" does exposition across a large cast (#128); Walder Frey has a nickname and a catchphrase, Hodor is memorable by repetition, and Gregor is built in seventeen lines of page time (#185).

Caveat: the 'a name evokes more than a page' formulation at #259 is the fan's, and Martin answers "I agree" (#259 note).

Rule: The people of the settlement bear names that are living names bent by a letter or a doubled consonant, never names that cannot be said aloud. Family names and place names carry the strangeness; given names stay close to home. A byname does a job (the Late Lord, the Iron Captain, the Reeve's Widow) and the archivist uses it to remind the reader who this is, never to decorate.

### 11. Headings shaped like kennings: two content words, an action and a relation

Support: 1 document: Neubauer 2022 (#56, #57, #58). **SINGLE SOURCE.**

True wording: "kenning-like phrases for the titles of his novels" (#56: game, clash, storm, feast, dance; of thrones, of kings, of swords, for crows, with dragons); "four (and two) use alliteration" (#57, of nine titles and four subtitles); the imagery draws on "the rather conventional stock of themes and tropes" of Germanic war verse (#58).

Rule: An entry heading pairs a concrete noun of action with a relation: the Weighing of Grain, a Feast for Ravens, the Closing of the Ford. Alliteration is welcome and never required.

---

## B. Sentence, paragraph, page

### 12. The default sentence is lucid, functional and readable by a child, whatever the plot carries

Support: 10 documents: Books & Boots 2014 (#6, #82, #155, #309); Rivera 2023 (#68); Spathis via Winter Is Coming 2015 (#69); Koeksal 2013 (#149); Hartinger 2014 (#328); literaryanalysis.net 2012 (#72); Wasson via Wikipedia (#37); Grossman via Slate (#45) and Time 2011 (#120); Germani, 'American Homer' (#314).

True wording: "The default setting of Martin's style is lucid and functional" (#309); "powerfully simple beauty" when the characters are "not swearing or chopping off each others' heads" (#8, #85, Arya's Braavos chapters); "ARI score for A Game of Thrones is sixth-grade" with lexical density between four and four and a half (#68); readable by a ten-year-old where Harry Potter needs fifteen (#69); "An author doesn't need big, fancy words to make his/her point" (#149); "about as good as structure gets", with prose "tight and clear and evocative" (#328); "Martin's prose is concise but pithy" (#37); "Martin's deft prose" (#45, #120); "ASOIAF has an almost hypnotic readability" (#314).

Rule: The archivist's sentence is plain, short in its words, readable at a glance and never read twice. Age and place come from the words chosen, not from the sentence's shape. The plot may be tangled; the sentence is not.

### 13. Low-density sentences that work by accumulation; rhythm over polish; no sentence is memorable

Support: 1 document, Germani, 'George R.R. Martin, The American Homer' (#97, #100, #161, #314, #315). **SINGLE SOURCE**, and a hostile one.

True wording: "no single sentence is that effective" but a full cartridge lands, which he calls shotgun writing (#161); "The sentences aren't beautiful" (#315); "The flow is important, it's gotta come out right for him" (#100, the essayist's characterisation, not Martin's words; the verifier notes Martin elsewhere describes exactly the line-by-line trimming this denies, as a final pass).

**DISAGREEMENT** on the sentence itself. Against Germani and Brown ("too much repetition, unexceptional prose", #36, #326) and Orr ("Such length isn't necessary, and it hurts Martin's prose", #327) stand Grossman ("deft", #45, #120), Hartinger ("tight and clear and evocative", #328) and Wasson ("concise but pithy", #37). Maenpaa says outright that no one has ever accused him of being concise (#116). The critics who like the sentences are reviewing pace; the critics who dislike them are reading line by line.

Rule: No single sentence is asked to carry the entry. The entry carries by accumulation, sentence after plain sentence. The archivist does not reach for the memorable line; when a line is memorable it is because the fact in it is.

### 14. Modular sentences and short paragraphs, some of one line

Support: 1 document: Germani, 'Compressible Paragraphs' (#172, #173). **SINGLE SOURCE**, and speculative by the essay's own framing.

True wording: "modular sentences that can snap together like LEGO" (#172: seven paragraphs of four hundred and twenty-seven words assembled from the first sentences of twenty-six paragraphs totalling nearly nineteen hundred); "Martin has a fair number of one-lines" (#173, offered as one possible driver of propulsion among several). Adjacent, at chapter scale: Whitehead finds the lesser vantages get "little to no time for filler" and a concise, focused feel (#109).

Rule: Every paragraph opens with the sentence that could stand for it. Paragraphs are short and some are one line. A reader who keeps only first sentences still has the entry.

### 15. Few adverbs; adjectives struck out

Support: 2 documents: Spathis via Winter Is Coming 2015 (#69); TIFF master class transcript 2012, Martin's own words (#263).

True wording: "George R.R. Martin hates adverbs" (#69, fewest -ly adverbs of four series compared); his early style held that "if one adjective was good, three were better" until journalism school "cured me of that" (#263).

Rule: No adverb of manner in the archivist's voice. One adjective where one is needed; the second and third are struck. The record trusts its nouns.

### 16. Draft for flow, then cut line by line: the fat and the muscle

Support: 4 documents: Wikipedia citing Martin's blog (#25); Hidden Gems 2022 (#203); Beatrice 2000 (#296); So Spake Martin, Outland 2000 (#295).

True wording: "cutting out the fat and leaving the muscle", the final stage, nearly eighty pages out of one volume (#25); "trimming and tightening line by line and word by word", done with every book since Los Angeles (#203); ten years of "cutting and trimming and making scripts into a very tight fit" before something deliberately expansive (#296); after decades of forty-six-minute scripts he wanted "something that was big and rich and grand in scale" (#295).

Caveat: this is intent. Orr and Brown (#327, #326) judge that the cut was not deep enough.

Rule: The entry is drafted for its flow and then cut in a last pass, line by line and word by word. The dossier that is long is long by design, and every page has been through the cut.

### 17. Punctuation and speech tags used for timing

Support: 2 documents, one essayist: Germani, 'Punctuation' (#178) and 'Line Reading' (#177). **SINGLE SOURCE.**

True wording: in the first volume semicolons and colons are used interchangeably, three on one page, and "Seems like he's gotten the semicolon figured out by now" (#178, hedged); "These tags, when strategically placed, can serve as extra punctuation" and the ideal exchange is untagged (#177).

Rule: The semicolon joins two full clauses or it is not used; the colon introduces. Quoted speech in the record names its speaker once, then runs untagged; a mid-sentence tag is a pause placed on purpose.

---

## C. Repetition, formula, motif

### 18. A plain word repeated within a passage fixes a condition

Support: 2 documents: Books & Boots 2014 (#9, #86, #156); Rivera 2023 (#67).

True wording: repetitions of 'cool' and 'still' read as "haste, or careful repetitions designed to evoke the lazy, torpid atmosphere" (#9; the critic cannot decide which); "the insult is repeated five times for emphasis" (#67, 'bastard' across a few paragraphs, as lexical cohesion).

Caveat: the purposive reading at #156 is the claim-writer's; the source leaves haste and design open (#156 note).

Rule: The archivist may repeat one plain word across a few sentences to fix a condition on the page: still, cold, empty, dry. The repetition that fixes is deliberate and rare; the repetition that is haste is cut in the last pass.

### 19. Recurring sayings as motifs, planted in many mouths, and reminders carried by dialogue

Support: 5 documents for the device: Grossman, Time 2011 (#118); Overthinking It 2011 and its comment thread, one page (#318, #320); Adria's News 2012, Martin's own words (#195, #291); Hurley, Writer's Digest 2019 (#71); Winter Is Coming 2017 (#137). 5 documents for the excess: Wertzone 2011 (#107); Atlantic 2011 (#36, #326); Orr via Wikipedia (#35, #327); Gelzer-Govatos (#91); Hughes satire (#209).

True wording, the device: "Like Wagner, he gives each of his characters leitmotifs that recur", kept close like dragons' eggs (#118: You know nothing, Jon Snow; If I look back I am lost); "no writer uses a phrase thirteen times by accident" (#318, 'words are wind' in the North, the South and across the sea); "I do it intentionally" though some readers are annoyed, and "I have learned this technique from Stephen King" (#195, #291); reminders are choreographed by dialogue because "authors do not want to insult the reader's intelligence" (#71: the Spider, the eunuch); "he does do leitmotifs extremely well" (#320, Reek's rhyme); "warm bread, fresh from the kitchens" recurs (#137).

True wording, the excess: 'words are wind' "is oft-repeated, probably a little bit too much" (#107); "too much repetition, unexceptional prose" and characters who use the same idioms whatever their class or continent (#326); Tyrion waddles at least a dozen times in one book (#35); 'mummer's farce' "comes up at least ten times in every book" (#91; the claim's 'dozens' is inflated, per the verifier); the satirist has someone in every chapter say a thing "isn't worth a mummer's fart" (#209).

**DISAGREEMENT.** Martin, Grossman, Perich, Hurley and Wenyip read the recurrence as motif; Whitehead, Brown, Orr, Gelzer-Govatos and Hughes read it as tic. The line between them is count and spread: a saying that returns in many mouths across many entries is a motif; a descriptor that returns in the narrator's own voice is a tic.

Rule: The town keeps a few sayings that return across entries as its mottoes, always in a party's mouth and never in the archivist's, and never more than a few times a volume. A fact the reader must hold (who is the eunuch, who is the Spider) is re-planted in someone's speech, not restated by the archivist. A physical descriptor for a named person returns at most a few times in the whole dossier; the waddle and the bread from the kitchens earn each return or they do not return.

### 20. Fixed epithets and stock similes as shorthand for pace, at the cost of the picture

Support: 1 document: Germani, 'The American Homer' (#95, #96, #98, #160, #162, #164, #314). **SINGLE SOURCE.**

True wording: "the real Martinian stock phrases are those faces still as masks" (#95), "those faces still as masks, and the faces dark with anger" (#164), men "corded or thick with muscle"; "stock phrases are thermals" (#160), a minstrel's filler giving the audience time (#96); 'black as night' four times, "almost a shorthand for description" (#98) because "we are cognitively lazy with the familiar" (#162).

Rule: A recurring civic thing may carry a fixed epithet (the old mill, the black gate, the low bridge) so the reader passes it at speed. A stock simile is shorthand, not a picture; the archivist uses shorthand where the page must move and a fresh image where the thing must be seen, and knows which is which.

### 21. One verbal mark for a minor figure

Support: 3 documents: Gelzer-Govatos (#93); Germani, 'Making a Memorable Character' (#185); Wenyip comment (#320).

True wording: Hodor "can only say his own name", Reek's rhyme swaps its last word (#93, under the heading Annoying Speech Mannerisms); Walder Frey's heh and Gregor's seventeen lines (#185); "he does do leitmotifs extremely well" (#320).

**DISAGREEMENT.** Gelzer-Govatos files the same device under annoyance that Germani and Wenyip file under memorability.

Rule: A minor named person may carry one verbal mark in quoted speech, a word or a rhyme, and carries it every time. The mark never enters the archivist's own voice.

---

## D. Figures and imagery

### 22. Simile is the dominant figure; nature is given intent

Support: 2 documents: Ehiosun, Book Analysis (#144); Germani, 'Purple Prose in Green and Red' (#180). **SINGLE SOURCE** for the dominance claim.

True wording: "simile was the most predominant figurative language used", with personification (winter as a beast that devours) and frequent tonal shifts (#144); "time slept when swords woke", the sword alive in the hand (#180). Adjacent: LitCharts' prologue summary gives the sensory cues, "Suddenly, it becomes cold; swords clash, a sound like a scream" (#145; the reading of them as signals of the supernatural is the claimant's).

Rule: The dossier's figure of choice is the plain simile drawn from the town's own stock: like a ferryman's rope, as a mill in flood. Winter, river and fire may be given a verb of intent, sparingly. A tool may wake; a man does not become a metaphor.

### 23. Imprecise figures: a simile whose vehicle misbehaves, paired near-synonyms, one sense hammered, hot and cold for the same feeling

Support: 1 document: Germani, 'Imprecise Sentences' (#102, #103, #104, #105, #174, #175). **SINGLE SOURCE.**

True wording: raiders melting away like snow, but "Snows melt slowly, over weeks and months. Mist evaporates quickly" (#102); glowering through a beard implies the beard covers the face (#174); "Jon told his uncle in a low, quiet voice" as redundancy (#174; also a careful, measuring look; low, hushed voices); "I need about 50% less about the cold here" (#175, said of a Jon chapter at Castle Black, not the prologue as #104 claims); "Anger is sometimes cold too. Except when it is flaring hot" (#105).

Rule: A simile's vehicle must behave as the tenor does: snow for what goes slowly, mist for what goes fast. No paired near-synonyms. Each sense is named once per paragraph and the cold is stated, not restated. A feeling is hot or it is cold; it is not both in one entry.

### 24. The two-limb weather sentence, and its cousin for the body

Support: 1 document: Germani, 'Zeugma and Literary DNA' (#176). **SINGLE SOURCE.**

True wording: "The day was warm and cloudless, the sky a deep blue" (#176); about two hundred and fifty such sentences in some hundred and forty-eight thousand, the body the commonest subject, sky and weather next.

Rule: The archivist's compression for weather and for the body is the two-limb sentence with the second verb dropped: the day warm, the sky a deep blue; the road dry, the ruts hard as bone.

### 25. The moving sentence; a slip into a party's own idiom; a word made to carry two senses

Support: 2 documents: Germani, 'Nice Moves' (#186, #187, #188); Refined Robot 2011 (#70).

True wording: "They passed beneath the gatehouse, over the drawbridge", the moving sentence (#186); "A little free indirect!" (#187); "cruel iron rams lapping at the water" (#188); "third person narration with a large amount of focalization" and free indirect discourse (#70).

Rule: A route through the town is one sentence of prepositions: under the gate, over the bridge, through the wall, up the street to the cross. A parenthetical slip into a party's own idiom is allowed once, inside a quoted complaint. A word that carries two senses (a ram that laps) is used when both senses are true.

### 26. The register rises only for the wild and the wound

Support: 2 documents: Germani, 'Purple Prose in Green and Red' (#179, #180); TIFF transcript, Martin's own words (#263).

True wording: "the tone can be very casual and very purple", the purple reserved for nature (green) and violence (red), with antiquated diction in the wilderness passage (#179); the sword alive and time asleep in combat (#180); his own early purple cured by professors drawing lines through adjectives (#263).

Rule: The civic ledger stays casual and plain. The register rises only for the flood, the fire, the wood in winter, and the raid; there the archivist may let the diction go old and the sentence go long, and comes back down at the next entry.

---

## E. Narration and vantage

### 27. One vantage per entry, named in the heading; no omniscience

Support: 12 documents: Austin Chronicle 2013, Martin (#14, #15, #192, #243); Adria's News 2012, Martin (#197, #244); TIFF 2012, Martin (#250); Wikipedia ASOIAF (#26); Sladiková 2015 (#75); Lennox 2026 (#143); Shmoop (#142); Rieken 2019 (#46); Błaszkiewicz 2014 (#61); Refined Robot (#70); Wertzone 2011 (#108); Hughes satire (#207).

True wording: "I've always written from a tight third-person point of view" because "None of us are omniscient" (#14, #15); "see the events around us from our own eyes" (#192); "a limited but very tight third person point of view" and "I actually hate the omniscient viewpoint" (#244, #197); "seeing everything through the eyes only of the viewpoint characters" (#250); nine viewpoints growing to thirty-one across five books (#26); chapters told from "the character after whom they are named" (#75); "Each chapter is named after its POV character" and the rule is never broken within a chapter (#143); a "heterodiegetic figural narrator", one focaliser per episode, unlike medieval romance (#46); "the titles of the chapters which designate them as focalisers" change when an identity is unmade (#61); from the fourth volume some chapters carry "such descriptive names as 'The Iron Captain'" (#207); schemers such as Varys and Petyr Baelish are denied a vantage to keep the mystery, and the prologue's vantage is disposable (#142).

Caveats: the television link at #250 comes from a separate passage; #108's 'fairly strict' is about which characters get chapters, not about narrative technique (#108 note).

Rule: Every entry has one vantage, and the heading names it: the Reeve's Return, the Miller's Complaint, the Widow's Petition. The entry knows only what that vantage can know at that hour. An entry headed by an office rather than a name marks a person whose name has been taken. The schemer's ledger is never opened. A stranger's account may open a volume and is never heard again.

### 28. The vantage is unreliable, sometimes on purpose; contradictions between entries stand

Support: 6 documents: Wikipedia Themes (#29); Wikipedia AGOT (#31, #32); Rieken (#47); Atlantic 2011, Martin (#249); Wikipedia ASOIAF (#205); Shmoop (#142).

True wording: what readers believe "may therefore not necessarily be true" (#29); "Martin's viewpoint characters often provide unreliable accounts" (#31); some "actively suppress their thoughts to conceal information" (#32: Ned on Jon's mother); being so focalised, "the implied author becomes unreliable" (#47: Sansa's remembered kiss); so-called mistakes are deliberate, "the point of view structure and the unreliable narrator" (#249).

Rule: The record carries each party's account as that party's account, with its errors of memory left in. Two entries may disagree about one event and the archivist does not reconcile them; the reader weighs. A party may withhold what it knows, and the record withholds with it.

### 29. Each vantage has its own voice and word stock; entries are drafted in runs of one voice and rearranged

Support: 9 documents: Austin Chronicle, Martin (#16, #18, #193, #246); Adria's News, Martin (#196, #247); Entertainment Weekly via Winter Is Coming, Martin (#245, #303); Grossman NPR 2011 (#41); Grossman Time 2011 (#119); literaryanalysis.net (#73); Maenpaa 2011 (#115); Wikipedia ASOIAF (#24); BuzzFeed 2014, Martin (#140).

True wording: "struggle for a few days trying to get back the voice" after a switch (#16); "I don't write the chapters in the order" you read them and stays in one voice for three or four (#18); "write consecutively two, three or four chapters" (#247); each vantage has "its own voice and vocabulary" and the switch "is very exhausting" (#196); "I switch voices every time I switch chapters", whereas the history book has "one voice to do" (#245, #303); "Each story has its own rhythm" and plays off the others (#41, #119); "give each character their own unique voice" (#73); "each point-of-view having a distinct palette and purpose" (#115); chapters rearranged later for "character intercutting, chronology, and suspense" (#24); when one voice stalls, "I can write with Arya" (#140).

Rule: Each register of the dossier keeps its own word stock and rhythm: the herald's, the ledger's, the chronicle's, the complaint's. The archivist's chronicle voice is one voice throughout, as a history book is one voice. Entries in one register are drafted together and then interleaved with the others for pace.

### 30. Distance is held at the shoulder and stepped back only in memory; one name form per person

Support: 2 documents, one essayist: Germani, 'Psychic Distance' (#165, #166, #167, #168, #169) and 'The Short-Hop Flashback' (#184). **SINGLE SOURCE**, and the essayist finds the control imperfect.

True wording: he hovers at the shoulder "only to take a big step backwards at odd times" (#165: Tyrion's 'pups' beside the narrator's 'Jaime Lannister'); "Stupidly, Jon argued" (#166, posed as an open question: who thinks Jon stupid?); italicised thought grew by some six percent across the series and is "Martin at his kludgiest" when it jogs memory or states the obvious (#167); "Martin cycles through every possible nomination for Ned" in one scene (#168: her father, Ned Stark, Father, Eddard Stark); "Even is being used as an intensifier", a subjective marker without a thought tag (#169, called a convention, not a rule); "Only with temporal distance will he permit himself some narrative distance" (#184).

Rule: The archivist's distance is fixed and far, and does not wander. A person is one thing in one entry, the miller throughout, never the miller and then Tom and then Thomas Reed. No italic thought. Judgment is not smuggled in by an adverb; where the record judges, it says who judges.

### 31. Every side at once; grey through many vantages; two wants in one paragraph

Support: 8 documents: Grossman NPR (#44); Locus 2005, Martin (#248); Adria's News, Martin (#294); Austin Chronicle 2013, Martin (#293); Germani, 'Inside the House of Black and White' (#191); Refined Robot (#70); VanderMeer via Wikipedia (#28); Grossman Time 2005 (#324).

True wording: "from all sides at once" so every fight is triumph and tragedy (#44); "Having multiple viewpoints is crucial to the grayness of the characters" and nobody outside a cartoon calls himself the Dark Lord (#248); from the Iliad, "The hero of one side is the villain of the other" (#294); his credo from Faulkner, "the human heart in conflict with itself" (#293; the link to viewpoint technique is the claimant's, since on that page Martin uses Faulkner to argue that magic must never solve the problem); "part of him wanted to call out" and he held his silence (#191); villains "can begin to be much more sympathetic" in their own vantage (#70); fully inhabiting his characters "creates the unstoppable momentum in his novels" (#28); "Martin shoots the action from many angles, with a dozen narrators" (#324).

Rule: A dispute in the town is entered from each side in turn, each with its own justification. The record names no villain. A party may be shown wanting two things at once in one paragraph, and choosing one.

### 32. Each sentence checked against what the vantage can know; the young or the newly arrived carry the explaining

Support: 4 documents: Austin Chronicle, Martin (#17); Auerbach 2017 (#125); The Fantasy Review 2023 (#146); Rolling Stone 2014, Martin (#251).

True wording: "does he understand what's happening?" asked of every sentence (#17; said of Bran, the youngest); "a seven-year old boy going to his first beheading" (#125; the craft rationale is the claim's inference, not the source's); the child vantage "allows George R.R. Martin the space to explain a few things" (#146 note); "Bran is the first viewpoint character" so readers take him for the hero before the fall (#251).

Rule: Each sentence is checked against what its vantage could know at that hour and in those words. Where the town must be explained, the record made by the young, the apprentice or the newcomer explains what the old would not trouble to say. The first entry's vantage is not promised to be the important one.

### 33. A battle from the ranks and from the hill

Support: 1 document: bernardcornwell.net interview, Martin's own words (#19, #252). **SINGLE SOURCE.**

True wording: "Sometimes I employ the private's viewpoint" up close in the carnage, and sometimes the general's, "looking down from on high, seeing lines and flanks" (#19 note).

Rule: A raid or a siege is entered twice: once from the wall or the ward where the blows land, once from the hill where the lines and the reserves can be seen.

---

## F. Entry and volume structure

### 34. Every entry ends on a turn: a tense or revelational moment, a twist, a cliffhanger

Support: 4 documents: Wikipedia citing Time 2011 (#23, #204); TIFF, Martin (#267); Wertzone 2011 (#111); Sheehan via Wikipedia (#38).

True wording: "a tense or revelational moment, a twist or a cliffhanger", like a television act break (#23); "just a twist point or a new revelation" or a piece of information (#267, offered as options, not a requirement); the volume "breaks off the book on a series of titanic cliffhangers" (#111); "vividly rendered set pieces", unexpected turnings and assorted cliffhangers (#38).

Rule: Each entry closes on the thing that changed or the thing still unknown. The ledger ends on the debt not yet paid; the chronicle ends on the gate not yet opened.

### 35. Open on the small crisis of the day, step back for the cause, return

Support: 2 documents: Germani, 'The Short-Hop Flashback' (#183); Hughes satire (#208).

True wording: in medias res on a small crisis, then "past perfect melds into the simple past tense" for a compressed memory, then the present resumes (#183); "Start In The Middle of the Action", eating, fighting or mid-conversation (#208, scoped by the source to a character's first appearance within two pages).

Rule: An entry opens on the small trouble of its day, already under way. It steps back once, briefly, for the cause, in a past that slides from had done to did, and returns to the trouble to resolve it.

### 36. No scene exists only to inform; the information rides on the scene

Support: 4 documents: Germani, 'Scene Types' (#182) and 'Now, As We All Know' (#181); Oliver 2015 (#127, #128); Hurley 2019 (#71).

True wording: "The narrative cycles between these types of scene" (#182: coercion, bargaining, action, travel, an enigma or a promise, a predicament, a disclosure), and every chapter shoehorns in other information; backstory arrives as "a flashback dressed up as a monologue", assigned to a talkative character as a trait, lampshaded, or reported in summary rather than quoted (#181); "pairing the exposition with the dramatic" so the reader is not lost (#127); reminders choreographed by dialogue (#71).

Rule: No entry exists to inform. The tithe dispute carries the history of the tithe; the ferry toll carries the history of the ferry. Where a party must tell what is already known, the telling is that party's habit and the record says so. Old history is reported in summary in the archivist's voice, not quoted at length.

### 37. A person or a house is talked about in others' entries before it is seen

Support: 2 documents, one essayist: Germani, 'Your Reputation Precedes You' (#189) and 'Making a Memorable Character' (#185). **SINGLE SOURCE.**

True wording: Stannis is mentioned ninety-eight times before he appears, in the second book (#189); status by repetition alone; Gregor built on a physical note, being talked about, and a nickname (#185).

Rule: A house, an office-holder or a stranger is spoken of in other parties' entries, by byname, several times before its own entry appears. When it appears, the reader already knows what to fear.

### 38. Interlaced strands and a diptych; the prologue tells what no townsman can; weeks pass between entries

Support: 6 documents: Błaszkiewicz 2014 (#59, #60); Rieken 2019 (#49); nekoplz, Martin (#253); Atlantic 2011, Martin (#254); Wertzone 2009 (#112, #113); Gessey-Jones et al., PNAS 2020 (#62, #63, #64).

True wording: the series is organised by "interlacement and the diptych, or bipartite, division" (#59); a prologue gives what is "beyond the grasp of a focalising character", placing the reader a step ahead (#60); readers "jump in between interlacing storylines", anticipation built and then broken (#49); a mosaic "sort of like a Robert Altman film in prose", from the Wild Cards books (#253); "Tolkien begins very small, in the Shire", the characters accumulate and then scatter (#254); "The rotating-POV structure can lead to frustration" (#112), and "sometimes weeks passing between chapters, armies covering hundreds of miles" (#113, filed by the reviewer as a flaw); each major vantage keeps about a hundred and fifty stable relationships, "the average number of stable relationships usually maintained" (#62); significant deaths are "well described by a geometric distribution" in chapter order but by a power law in story time (#63), the decoupling being "a device for engaging the reader in the story" (#64).

**DISAGREEMENT.** Rieken and the PNAS authors treat the interleaving and the time jumps as the engine of engagement; Whitehead files the same features under flaws (#112, #113). Verhoeve calls the later volumes "sprawling and incoherent" (#39; the claim's 'chapters like separate stories' clause is unsupported and dropped).

Rule: The dossier braids several strands and lets weeks pass between entries in any one of them; armies move offstage. A stranger's account may open a volume with what no townsman can know. Each entry's cast stays within the number of people a reader can hold, about the size of a parish. The volume falls in two halves that answer each other.

### 39. The season and the year sit inside the first sentences; a named object is entered with its make because it returns; the omen is plain

Support: 2 documents: Auerbach 2017 (#124, #126, #210, #211, #212); Oliver 2015 (#129).

True wording: "The morning had dawned clear and cold", against the advice never to open on weather (#210; Auerbach then cuts the line and calls the result better, so this is not an endorsement, per #124 note); "the ninth year of summer, and the seventh of Bran's life" (#211); "amazing how many hints G.R.R.M. dropped in one paragraph" (#126); "Valyrian steel, spell-forged and dark as smoke", a detail that matters later (#212); "obvious foreshadowing with a direwolf who's been killed by a stag", and later events "contextualize miniscule asides" (#129).

Rule: The year and the season are stated inside the first sentences of an entry, not in a heading, in the town's own reckoning. A named object (the bell, the blade, the charter) is entered with its make and colour because it will return. The omen is set down plainly; the reader may see it coming and the record does not mind.

### 40. Each volume closes a movement; a death is felt and not foreseen; sudden reversals

Support: 4 documents: Locus 2005, Martin (#268); CBS 60 Minutes 2019, Martin (#301); PNAS 2020 (#63); Grossman Time 2005 (#323).

True wording: "a movement of the symphony has wrapped up" though nothing resolves (#268); "So I try to make you feel the deaths" and make them unexpected, against the death that is a statistic (#301); deaths memoryless chapter by chapter (#63); "George R.R. Martin is fond of sudden reversals" (#323).

Rule: Each volume of the dossier closes a movement while the town goes on. A death is entered so that it is felt, in the entry of someone who knew the dead, and it is not foreseen by the shape of the record.

---

## G. Description, setting, sensory doctrine

### 41. Nothing is gratuitous: feasts, clothes and arms are the experience, and the reader is to live there

Support: 9 documents (two carry the same primary text): the cookbook foreword via ComicBook.com (#20, #133, #134, #274, #275) and via Winter Is Coming (#21, #135); Atlantic 2011, Martin (#272, #273); Azevedo's compilation (#201); New Jersey Monthly, Martin (#132, character-scene half only); Rieken 2019 (#48); Underwood 2013 (#117); Wertzone 2011 (#110); Maenpaa 2011 (#116).

True wording: "I want them to taste the food" (#20, #274); "Nothing is gratuitous, as I see it" and gratuitous "usually translates to 'more than I wanted'" (#21); "Fiction is about emotion. The heart, not the head" (#275); "It's not the destination that matters to me, it's the journey" (#134); "I want them to live my story, not just read it" (#135); "detail is necessary, showing not telling is necessary" (#272); "gratuitous feasting, and gratuitous description of clothes", and heraldry, since plot advancement is not why one reads novels (#273); books "richly textured and full of sensory detail" (#201); "the little character parts" are what gets cut (#132); "descriptions of smells, textures, sensations, and emotions" heighten immersion (#48); "incredible sensory feasts" distract from the slaughter (#117); "Martin seems to relish some descriptive passages" (#110); "more about response, reaction and decision" than action (#116).

Caveats: the hearing element claimed at #20 is not on the ComicBook page; the 'loves describing food' half of #132 is the interviewer's premise, not Martin's.

Rule: The dossier gives the town's table, cloth, tools and arms in full, because the reader is to live there and not to be told about it. Nothing that furnishes the town is gratuitous. The record spends its length on how a party takes a thing, not only on what was done.

### 42. A meal is a character: its dishes, its sharing, its insults

Support: 4 documents: Wikipedia Themes citing Bruski and Rosenberg (#30); Winter Is Coming 2017 (#136, #137); Mikanowski, Slate 2017 (#329); Underwood 2013 (#117).

True wording: more than a hundred and sixty named dishes across four books, and food "almost appear as a supporting character", foreshadowing and matching the diner's temperament (#30); meals "more often than not, they serve a narrative purpose" (#136: Walder Frey's dull dinner as discourtesy; food flavoured with fear); capon, trencher, lamprey pie stretch the vocabulary (#137); "Honorable men share their soup. Bad ones bogart it" (#329, soup as a marker of region and a test of character).

Rule: A meal is entered by its dishes, in the town's own words for them. What is served and how it is shared marks region, rank and honour. A dull dinner is an insult and the record says so; a shared pot is a character reference.

### 43. Arms at blazon level, for their own sake

Support: 3 documents, all Martin's own words: the cookbook foreword via Winter Is Coming (#135); So Spake Martin, Outland 2000 (#276); Infinity Plus 2001 (#277).

True wording: the knight who bore seven golden hedgehogs on a field of dark green (#135); "I enjoy the heraldry just for its own sake", playing fast and loose with real conventions (#276); "Besides, I like the heraldry" (#277).

Rule: Every house, guild and ward of the town bears a blazon, entered in full: seven golden hedgehogs on a field of dark green. The archivist takes liberties with the real rules of arms and none with his own.

### 44. The language of dreams: colour by its stone and cloth, taste by its spice

Support: 1 primary text (Martin, 'On Fantasy', 1996) via 2 hosts: georgerrmartin.com (#198, #199, #289, #290); Wikiquote (#141). **SINGLE SOURCE** (one text). Adjacent: the sensory doctrine at feature 41.

True wording: "The best fantasy is written in the language of dreams" (#141, #289); "We read fantasy to find the colors again" (#199); "silver and scarlet, indigo and azure", obsidian veined with gold, against a reality of plywood and plastic (#290); the essay tastes of habaneros and honey.

Caveat: 'texture' and the application to heraldry are the analyst's, not the essay's (#198, #199 notes).

Rule: Colour is named by its stone, its dye or its cloth: scarlet, indigo, azure, obsidian veined with gold. Taste is named by its spice. The dossier's palette is richer than the plywood real, and it is never named by number.

### 45. Each named place comes alive from its own gate; a garment gets a paragraph when the garment is the point; description without tedium

Support: 5 documents: Wertzone 2009 (#114); literaryanalysis.net (#72); Koeksal 2013 (#149); Wertzone 2011 (#110); Sheehan via Wikipedia (#38).

True wording: the Red Keep, Winterfell and the Wall "come to life quite nicely" (#114, a concession inside a complaint that the wider worldbuilding is sketchy); "without ever lapsing into Tolkienesque descriptive tedium" (#72); "a whole paragraph to explain the intricate clothing" of a lord or lady (#149); the account of the Doom of Valyria relished (#110).

Rule: Each named place of the town has its own entry of what is seen from its gate, its bridge or its threshold, and nothing more than is seen. A whole paragraph goes to a garment, a hall or a ruin when that thing is the entry's point, and the paragraph ends when the thing has been seen.

### 46. Plagues and pageantry both, heightened; the marvel is rare and its consequences are traced

Support: 10 documents: So Spake Martin, Outland 2000, Martin (#278, #280); Infinity Plus 2001, Martin (#279); Grossman Time 2005 (#121, #123); Austin Chronicle, Martin (#292); Carroll 2018 (#74); New Jersey Monthly, Martin (#130); Tolkien Society report 2014, Martin (#281, #282); Not a Blog 2024, Martin (#283); SLF Dublin 2019, Martin (#284, #285, #286, #287); Bullseye 2011, Martin (#288).

True wording: "room for both plagues and pageantry", both heightened, against a Disney Middle Ages and against thousands of pages of mud and lice (#278); "a brown and grey world of dung, dirt, and plague" from which the tournament's colour rises, chivalry beside brutality, castles over hovels (#279); "men and women slugging it out in the muck" (#121); "The supernatural plays a role, but only rarely" (#123; the historical-fiction link is not in that source); magic "like a little salt in a stew" (#292); "virile, brute force", Eco's phrase, for a Barbaric Age medievalism (#74; the 'rather than prose technique' clause is unsupported); "combines some of the best traits of contemporary fantasy" with the historical novel (#130); "the wonder and image of Tolkien fantasy" with the gloom of historical fiction (#281); imitators take the castles and princesses but write from a twentieth-century point of view (#282); "blend the wonder of epic fantasy with the grittiness" of historical fiction, with much less magic (#283); historical fiction is "grittier, harder-edged, more realistic" (#284); "fantasy always has to be a little bigger and brighter", Hadrian's Wall turned to seven hundred feet of ice (#285); "it's gonna change the pork industry" if pigs fly, so get the armour, the armies and the horses right (#286); Dunsany's once-upon-a-time against Tolkien's "who was the king before him?" (#287; the placing of Martin's own work is the interviewer's sentence); "you have to root it in reality" first (#288); the Night's Watch dressed in black "to undermine that annoying convention" (#280).

Rule: The town has both its fair and its fever, its pageant and its plague, and the record enters both. The wonder is heightened a little past life; the muck is real. A marvel is entered rarely, as salt, and when it is entered its consequences run through the trades: who feeds it, who pays, who is put out of work. Every departure from the real is thought through, and the armour, the harvest and the horses are right. A convention may be dressed against itself.

### 47. Frank about the body, the wound and the bed, in one plain register

Support: 4 documents: CNN via Wikipedia (#27); The Mary Sue quoting Martin (#302); Gelzer-Govatos (#94, #317); Atlantic 2011, Brown (#326).

True wording: mature descriptions "far more frank than those found" in other fantasy (#27); "I can describe an axe entering a human skull" in detail and no one blinks, but the same detail of the bed draws letters (#302); the sex scenes are "clunky to the extreme", "drunk with desire", where the rest of the prose reaches adequacy (#94, #317); characters have sex in exactly the same manner whatever their class or continent (#326).

**DISAGREEMENT.** Martin claims one register for the axe and the bed; Gelzer-Govatos and Brown find the bed's register drops into cliché and sameness.

Rule: The record is frank about the body, the wound and the bed in the same plain register it uses for the harvest. No register drops into cliché for one subject and not another. What differs by rank and region in the town differs in the bed too.

---

## H. Dialogue

### 48. Terse, charged exchanges; the implication lands unglossed; rank is heard in who answers whom

Support: 7 documents: Books & Boots 2014 (#12, #87, #157, #311); TIFF 2012, Martin (#264); January Magazine 2001, Martin (#265); Rolling Stone 2014, Martin (#266); Woodward's digest of Rolling Stone, Martin (#138); Germani, 'The American Homer' (#99, #163); Germani, 'Pfister's Characterization' (#190).

True wording: "Confrontations between opposing characters are done though terse, charged dialogue" (#311, the page's own typo), and the reader feels "a real dramatic shock" at the implication (#87); hearing actors taught him "much shorter back and forth" instead of page-long speeches (#264); "I think working in Hollywood sharpened my dialog" (#265); "It's all structure, structure and dialogue" (#266); "Being there improved my sense of structure and dialogue" (#138); "it's no surprise that dialogue would shine brightest" while the other sixty percent is forgettable (#163, #99); "Martin's dialogue does a great job of revealing social dynamics" (#190).

Rule: Quoted speech in the record is short, back and forth, and never a speech. The archivist lets the implication of a line land without gloss; the reader is trusted to be shocked. Who speaks first, who is answered and who is left unanswered marks rank on the page.

---

## I. Composition and stance, in Martin's own words

### 49. The gardener: no blueprint, the world grown beside the story, the first entry arrived whole, the hard scene written last

Support: 11 documents: SLF Dublin 2019 (#22); Beatrice 2000 (#298); Rolling Stone 2014 (#271, #299, #304); Woodward's digest (#138); CBS 60 Minutes 2019, two segments (#270, #300); Longreads excerpt (#206); January Magazine 2001 (#269); NYT ArtsBeat 2011 (#297); Austin Chronicle 2013 (#194); Azevedo's compilation (#202).

True wording: "I'm very much a gardener, as Tolkien was" (#22); no detailed outline, "every word comes with a few drops of blood" (#298); "I don't build the world first, then write in it", the map took half an hour (#271); "They find the direwolf pups in the summer snows", and the world grew parallel to that sentence (#270); the first chapter came "almost in the form you've read" in three days (#299, #206); "that was the hardest scene I ever had to write", skipped and written after the rest of the book (#300); "if it's hard to write, it'll be hard to read, too" (#194); "it's the execution that is all-important", ideas being cheap (#304); "much as a director would see a shot" (#269); in prose "You're the director, you're the special effects coordinator" (#297); "'Yes you can trust me,' he lied", the interiority prose can do and film cannot (#202).

Rule: The dossier's world is built as its entries are written, not before; the map comes after the first entry. The archivist sees each entry as a shot, where the light falls and where the parties stand. The entry that is hardest to write is written last and kept. The record may say in four words that a party lied.

### 50. Characters first; style not discounted; genre is furniture; Tolkien the chief influence; his own voice, not Vance's

Support: 5 documents: SFFWorld 2006 (#307); Locus 2005 (#305); Popverse 2025 (#306); Infinity Plus 2001 (#261); nekoplz (#262).

True wording: his strength is characters, "I don't discount the importance of style and plot" (#307); "Sometimes the difference is just the furniture" (#305); "Tolkien is the most influential writer in my life" (#306); "Vance has his voice and I have mine" (#261); Vance's "ear for names, for language" is what he admires (#262).

Rule: The people of the town come first in every entry; the style serves them and is not neglected for them. The furniture of the setting may change; the craft of the record does not.

---

## J. Corpus figures on record

### 51. The measurable shape

Support: 14 documents: WordsRated (#147); PNAS 2020 (#62, #63); Germani, 'Zeugma' (#176), 'Psychic Distance' (#167), 'Your Reputation Precedes You' (#189), 'Making a Memorable Character' (#185), 'Compressible Paragraphs' (#172); Overthinking It (#318); Orr via Wikipedia (#35); Gelzer-Govatos (#91); Rivera (#68); Spathis via Winter Is Coming (#69); Voice 2014 (#65); McFarland 2015 (#76).

Figures verified on their pages: five volumes of more than one million seven hundred thousand words in three hundred and forty-four chapters, about five thousand words a chapter (#147, the average is the claimant's arithmetic, checked); about a hundred and fifty stable relationships per major vantage (#62); about two hundred and fifty two-limb sentences in some hundred and forty-eight thousand (#176); italicised thought up about six percent across the series (#167); Stannis named ninety-eight times before appearing (#189); Gregor in seventeen lines (#185); 'words are wind' thirteen times in one volume (#318); 'waddles' at least a dozen times in one volume (#35); 'mummer's farce' at least ten times a book (#91); sixth-grade reading index and lexical density between four and four and a half (#68); readable at ten (#69); a searchable corpus of the first four books exists for collocation study (#65); a scholarly volume groups essays on languages, story and discourse, and narrating knowing (#76).

Rule: An entry runs to the length of one of his chapters, a few thousand words, and the whole dossier is long. Its readability is a child's; its cast per entry is a parish's.

---

## K. Critical verdicts, for and against, on record

Praise, 9 documents: "aspires to be a page-turner" (Padol, #33); "widescreen epic fantasy, well delivered and competently told" (Jeffery, #34); "Martin's deft prose" (Grossman, #45, #120); "orchestrator of narrative" beyond almost any literary novelist, though never a prize-winner (#42); an epic for a "more profane, more sardonic, more ambivalent age" (#43); "epic sweep and tiny, touching human drama" (#122, #325); "Martin's prose is concise but pithy" (Wasson, #37); "about as good as structure gets" at chapter level (Hartinger, #328); "ASOIAF has an almost hypnotic readability" (Germani, #314); momentum from inhabiting characters (VanderMeer, #28).

Criticism, 5 documents: "sprawling and incoherent" later volumes (Verhoeve, #39); "bleak and plodding" (Brown, #40); "Such length isn't necessary, and it hurts Martin's prose" (Orr, #327); "too much repetition, unexceptional prose" (Brown, #36, #326); prose that "borders on the servicable" (Gelzer-Govatos, #92, #316); "The sentences aren't beautiful" (Germani, #315).

**DISAGREEMENT** stands unresolved in the record and is carried into the rules above at features 13, 19 and 47: the pace is praised by nearly everyone; the sentence is praised by some and faulted by others; the repetition is motif to some and tic to others.

Rule: The dossier aims at the page-turner's pull with the archivist's calm. It keeps the pace and the plain sentence, and it takes the critics' side on the tics.

---

## Disagreements register

| subject | one side | other side | carried in |
|---|---|---|---|
| archaisms (oft, elsewise, mayhaps, much and more) | Martin: seasoning, salt in soup (#255); scaled by speaker age (#256) | Simon: annoying mannerisms (#159); Gelzer-Govatos: pretension (#90); Germani: veneer with seams showing (#170, #171) | feature 6 |
| repeated sayings and descriptors | Martin, Grossman, Perich, Hurley, Wenyip: deliberate motif (#195, #118, #318, #71, #320) | Whitehead, Brown, Orr, Gelzer-Govatos, Hughes: excess (#107, #326, #35, #91, #209) | feature 19 |
| the sentence | Grossman, Hartinger, Wasson: deft, tight, pithy (#45, #328, #37) | Germani, Brown, Orr, Gelzer-Govatos: not beautiful, unexceptional, hurt by length, serviceable (#315, #326, #327, #316); Maenpaa: never concise (#116) | feature 13 |
| speech tics for minor figures | Germani, Wenyip: memorable (#185, #320) | Gelzer-Govatos: annoying (#93) | feature 21 |
| interleaving and time jumps | Rieken, PNAS: the engine of engagement (#49, #64) | Whitehead: frustration, moves too fast (#112, #113); Verhoeve: sprawling (#39) | feature 38 |
| the weather opening | Auerbach quotes it (#210) | Auerbach cuts it and prefers the result (#124 note) | feature 39 |
| sex and violence in one register | Martin: same detail for the axe and the bed (#302) | Gelzer-Govatos, Brown: the bed drops into cliché and sameness (#94, #317, #326) | feature 47 |
| drafting for flow versus machining sentences | Germani: flow first, no machining (#100, the essayist's characterisation) | Martin: line-by-line trimming as the last pass (#203, #25) | feature 16 |
| in-passage repetition | purposeful atmosphere (claim #156) | Simon himself cannot decide haste from design (#9, #86) | feature 18 |

## Verifier corrections carried into this section

- #20: the hearing element is not on the cited page; dropped.
- #39: 'chapters reading like separate stories' is not on the page; dropped.
- #74: 'rather than subtle prose technique' is unsupported; 'virile, brute force' is Eco's phrase, quoted by Carroll.
- #91: 'dozens of times' is inflated; the page says at least ten a book.
- #100: the flow-first framing is the essayist's, not Martin's quoted words.
- #104: the cold-hammering passage is a Jon chapter at Castle Black, not the prologue.
- #108: 'fairly strict' concerns which characters get chapters, not narrative technique.
- #113: the reviewer files rapid time jumps under flaws, not praise.
- #123: the historical-fiction link is not in Grossman; Fiction Advocate carries it.
- #124 and #125: Auerbach cuts the weather line and never states the child-vantage rationale.
- #132: 'loves describing food' is the interviewer's premise; only the character-scene half is Martin's.
- #156: the purposive reading of cool and still is the claimant's; the source is undecided.
- #166 and #169: posed as an open question, and as a convention rather than a rule.
- #172: the four hundred and twenty-seven words were assembled, not compressed from a continuous passage.
- #178: the semicolon verdict for the fifth volume is one reader's absence of noticed instances.
- #208: scoped by the satire to a character's first appearance, not every opening.
- #287: the placing of Martin's work beside Tolkien is the interviewer's sentence.
- #292: the 'explicit magic ceases to be magical' clause rests on no source on record.
- #321: Pulford is not a lexicographer; craven's date is the year fourteen hundred.

---

## Coverage table

Sources per angle, counted as distinct documents (URLs) among the 297 genuinely verified claims. A critic with several posts counts once per post. Martin's own testimony is counted as a document like any other.

| angle | verified claims | distinct documents | notes |
|---|---|---|---|
| Diction and register (word stock, archaism, anachronism) | 49 | 12 | the etymological core rests on one critic (Books & Boots, two posts); the archaism criticism has three independent critics plus Martin's own rule |
| Proverbs, idiom, foreign tongues | 6 | 3 | Tosina Fernández (peer-reviewed), OUPblog, Not a Blog |
| Names and titles | 10 | 7 | the kenning-title analysis is one source (Neubauer) |
| Sentence, paragraph, readability, cutting | 25 | 17 | the strongest disagreement in the sweep sits here |
| Repetition, formula, epithet, leitmotif | 22 | 12 | the Homeric-epithet reading is one essay |
| Figures and imagery (simile, zeugma, purple) | 13 | 5 | four of the five are Germani essays; Ehiosun is the only other |
| Narration and point of view | 50 | 26 | the best-covered angle; Martin's own words in seven documents, scholarship in four |
| Chapter and book structure | 39 | 24 | includes the only quantitative study (PNAS) |
| Description, setting, sensory doctrine | 47 | 28 | heavily Martin's own testimony (foreword, interviews, blog); critics on effect are fewer |
| Dialogue | 12 | 8 | one critic on form (Books & Boots), Martin on origin, Germani on effect |
| Composition process and stance (own words) | 21 | 17 | intent only; no critic tests it |
| Corpus measurement | 3 | 3 | WordsRated, Voice, McFarland; other figures are inside essays counted elsewhere |
| **total** | **297** | **103** | distinct documents across all angles; 38 of them carry Martin's own words (82 claims) |

Angles with NO genuinely verified source after the alignment correction, because every claim for them sits in #213 to #242: measured sentence-length and dialogue-tag statistics (AutoCrit, #236); the OED-dated 'butt' and 'ass' jar (#231); reader-community readings of name-form agency and silenced italics (#222, #223); the late-series archaic turn (nuncle, pease, neeps, #224); cross-chapter refrains ('Only the cold', #225); the Kay comparison (#226); the editor's first-fifty review (#228); Sanderson's tone-promise lecture (#230); the Saskatchewan register note (#233); Tim Weed's four page-turner devices (#213 to #216); Attewell's chapter analyses (#219 to #221); the sex-scene and food pieces from Portland Mercury, Gizmodo and Cultura Colectiva (#239 to #241); Martin on rewriting a loved chapter (#242).

## Verdict counts

| verdict | count | of which |
|---|---|---|
| verified, verbatim | 210 | correctly paired after realignment |
| verified, substance | 87 | correctly paired after realignment |
| **verified, total** | **297** | 103 distinct documents |
| not found | 3 | #101 (loose participles: not in the essay), #106 (redundant time markers: the essay argues the reverse), #131 (misattribution: the interviewer's premise, not Martin) |
| contradicted | 0 | |
| blocked | 0 | no page unreachable by every route |
| no verdict on record (slot displaced) | 30 | #213 to #242; excluded from every feature above; listed below |
| **total claims** | **330** | |

Face value of `kept-martin.json` before correction: 327 kept (239 verbatim, 88 substance). Those figures count 30 displaced verdicts as if they belonged to #213 to #242, and are not to be quoted.

## Excluded: the 30 claims with no verdict on record

| index | feature | source |
|---|---|---|
| #213 | visceral metaphor | Tim Weed, 'Recipe for a Page-Turner' |
| #214 | defamiliarised combat sound | Tim Weed |
| #215 | contrastive character introduction | Tim Weed |
| #216 | crowding key moments | Tim Weed |
| #217 | exposition by prompted memory | Dark Jackel's Howl, 2015 |
| #218 | menace by absence | The Fantasy Review, prologue, 2023 |
| #219 | lyrical-to-gore shift | Attewell, Tyrion VIII, 2014 |
| #220 | callback imagery | Attewell, Bran VII, 2016 |
| #221 | ironic refrain | Attewell, ASOS prologue, 2016 |
| #222 | full-name narration and epithet counts | ASOIAF University (tumblr) |
| #223 | silenced inner voice | ASOIAF University (tumblr) |
| #224 | archaic-ing from AFFC | nobodysuspectsthebutterfly (tumblr) |
| #225 | cross-chapter refrain | asoiafanalysis, 2015 |
| #226 | HD clarity versus lyricism | Goodreads Sword & Laser thread |
| #227 | limited knowledge per chapter | M.L. Katz, Goodreads blog, 2015 |
| #228 | titled POV chapters | The Editorial Department, 2016 |
| #229 | fluid lyricism without tedium | Literary Analysis, 2012 (the same page is verified at #72, #73) |
| #230 | name as tone promise | Humanities Notebook, 2026 |
| #231 | OED-dated archaisms | OUPblog, 2012 (the same page is verified at #321, #322) |
| #232 | regional idiom and proverb | OUPblog, 2012 |
| #233 | sparing 1400s diction, modern syntax | U of Saskatchewan HEL blog, 2018 |
| #234 | lexical cohesion and register by class | Rivera, 2023 (the same page is verified at #66 to #68) |
| #235 | adverb avoidance | Winter Is Coming on Spathis, 2015 (the same page is verified at #69) |
| #236 | measured readability and sentence length | AutoCrit |
| #237 | overused archaisms (criticism) | Erstwhile Philistine, 2012 (the same page is verified at #90 to #94, #316, #317) |
| #238 | formulaic tic speech (criticism) | Erstwhile Philistine, 2012 |
| #239 | sex-scene prose (criticism) | Portland Mercury, 2014 |
| #240 | food catalogues | Gizmodo, 2017 |
| #241 | food as belonging and class | Cultura Colectiva, 2019 |
| #242 | chapter rewriting (Martin's words) | Narrative Looking Glass, 2026 |

Of the 24 documents behind these 30 claims, 19 have no verified claim anywhere in the sweep and 5 are verified through other claims on the same page. Re-verifying #213 to #242 is one Opus chunk of 15 twice.

## Files

- This section: `sweep/section-martin.md`
- Corrected pairing: `sweep/kept-martin-realigned.json` (297 claims; each `verdict` carries `storedUnderKey` and `duplicateKeys`)
- Excluded claims: `sweep/unverified-martin-displaced.json` (30 claims)
- Untouched inputs: `sweep/kept-martin.json`, `sweep/state-martin.json`, `sweep/merged-martin.json`, `sweep/verdicts-martin-chunk-00.json`, `sweep/verdicts-martin-chunk-01.json`
- Working copy used for reading: `sweep/kept-martin-condensed.txt`
