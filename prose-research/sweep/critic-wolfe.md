# critic-wolfe — completeness critique of the round-3 wolfe section

Read: section-wolfe.md (65,152 B, 38 features, 441 indices cited, every kept row cited at least once, no cited index outside kept+partial), kept-wolfe.json (402 rows: 400 VERIFIED_VERBATIM, 2 VERIFIED_SUBSTANCE), partial-wolfe.json (66), find-wolfe-{academic,close,craft,voice}.md, verdicts-wolfe-regrade-r4.json (21 downgrades, all PARTIAL), the four found-*.json sourcesRead lists, and the raw capture directories (wolfe/, wolfe-raw/, wolfe-close-raw/, wolfe-craft-raw/). Counts below are from the files, not from the section's own summary.

## 1. Angles not run

- **studies / measurement** — never run for wolfe (the workflow's `studies` key is AI-only). Every sentence-level rule (feature 3 "short declarative sentences", feature 32 "level cadence", feature 36 "the later plain surface") rests on critics' impressions that contradict each other (Ewing #107 "almost Hemmingwayesque" vs Holland #273 "parentheticals and complicating clauses" vs Gevers #67 "baroque density" vs Tree Slices #412). Not one row carries a number: no mean sentence length, no clause depth, no dialogue-tag rate, no period comparison. The academic finder's "no stylometric study exists" is a search-failure report, not a finding; it was one targeted query.
- **counter** — no dedicated dissent sweep. The section admits it ("no studies, industry or counter angle exists for wolfe"). The dissenters it has arrived by accident inside the four angles: Gillespie only as a Wright relay (#179), Jones once (#167, #168), Auerbach, Lackey. No Budrys direct (5 mentions, all via Wright), no Adam Roberts (fetched, blocked by a Google sign-in wall: wolfe-craft-raw/roberts-botns.txt is 1,634 B of login page), no Thomas Disch, no M. John Harrison, no "overrated" case at all.
- **industry / editors** — none. Wolfe was edited by Damon Knight (Orbit) and David Hartwell (Timescape/Tor) and was himself a trade-magazine editor for a dozen years (Plant Engineering, 1972-84); nothing from any of them or about that. Feature 3's "cut every unneeded word" (#50) is the only editing-side row and it is Wolfe on a college editor.
- **primary text** — no row quotes a Wolfe sentence and analyses it at sentence level except through a critic's paraphrase (the Alex Substack on the 5HC opening paragraph is the nearest). The section's rules are reconstructed entirely from testimony about the prose, never from the prose.
- **video / podcast / reading group** — the close finder's "Still to do" was never done: YouTube captions for 7zvBdTEaJ1M and T4GYEQynCv0 are 0-byte files (signed caption URLs expired), Alzabo Soup was fetched as an index page only (alzabo.txt 4,395 B, no episode), r/genewolfe search JSON was saved and never read, the Urth-list close reading was claimed for chapters I and II only although the October and November 2006 thread indexes (t-2006-October.html, t-2006-November.html) are on disk.

## 2. Well-known critics, studies and primaries absent (named)

Roster misses (the subject brief names "critics (Clute, Wright, Aramini, Le Guin, Gaiman, Borski)"):
- **Ursula K. Le Guin** — zero rows, zero mentions in kept or partial. The brief's roster names her. Her Melville comparison and her remarks on Wolfe's sentences are the most-quoted critic line on him and are absent.
- **Peter Wright, Attending Daedalus (2003)** — only through Aramini's quotations (#196, #197) and Gordon's LARB relay (#110, #111, #450). Wright's two Ultan essays are direct; the monograph is not.
- **Joan Gordon, Gene Wolfe (Starmont 1986)** — fetched (498,620 B of two-column OCR interleave in wolfe-raw/gw-gordon-1986.txt), zero claims; reaches the section only as Kelly's summary (#364).

Fetched, on disk, substantive, and never claimed (these cost nothing to claim next round):
- **Gene Wolfe, "Nor the Summers as Golden: Writing Multivolume Works"** (gwern mirror, wolfe-raw/gw-culture-2007.txt, 17,782 B) — Wolfe's own craft essay on multivolume structure; not in any sourcesRead list.
- **Gene Wolfe, 1987 essay on Elfland / the geography of fantasy** (wolfe-raw/gw-wolfe-1987.txt, 11,784 B, a mock travelogue "Fantasy borders Horror") — own words, unclaimed, not logged.
- **Gene Wolfe live chat transcript, 2015** (wolfe-raw/gw-chat-2015.txt, 22,992 B) — own words in Q&A, unclaimed, not logged.
- **David Wilbanks, Hellnotes interview with Wolfe, 2005** (wolfe/davoortwilbo.txt, 8,436 B) — own words, unclaimed, not logged.
- **Kim Stanley Robinson, NYRSF on "A Story"** (wolfe-raw/nyrsf-ksr.txt, 41,612 B) — a novelist's close reading of the 5HC middle novella; unclaimed, not logged; Robinson appears only inside a Gevers citation.
- **LARB, "The Haunted Library of Gene Wolfe"** (wolfe-raw/larb-haunted-library.txt, 11,856 B) — unclaimed, not logged.
- **Marc Aramini, Science Fiction Book Club interview, Sept 2020** (wolfe/middletown-aramini.txt, 32,747 B) — a third Aramini interview, unclaimed.
- **Tyler Garvey, Bridgewater State honors thesis on BotNS, 2016** (wolfe-raw/icdst-thesis.txt, 72,478 B) — the only academic full text on disk besides Aramini's dissertation; unclaimed.
- **Ultan's Library: "Some Greek Themes in Gene Wolfe's Latro novels"** (62,732 B), **"The Death of Catherine the Weal"** (33,829 B), **"Lions and Tigers and Bears"** (32,509 B) — logged as substantive in found-wolfe-close.json sourcesRead, zero claims from any of them.
- **Black Gate, "I, Severian"** (wolfe-raw/blackgate-severian.txt, 10,670 B); **Lorehaven / Mikalatos introduction** (42,610 B); **Guardian, Gaiman "My hero: Gene Wolfe"** (3,453 B); **noisms 2019 on Wolfe and Le Guin's friendship** (46,522 B, the one Le Guin-adjacent capture) — all unclaimed.
- **Peter Bebergal, "Sci-Fi's Difficult Genius", The New Yorker 2015** — recorded as BLOCKED 403 in the craft notes, but a 2,280 B Wayback fragment sits in wolfe/newyorker-wb.txt and Black Gate's summary of it (wolfe/blackgate2015.txt) is on disk. Second route: archive.ph, or the Wayback `id_` raw capture of the full article.

Not fetched at all:
- **Colin Manlove, Science Fiction: Ten Explorations (1986)**, the BotNS chapter — the earliest sustained close reading of Wolfe's prose in a monograph.
- **Brian Attebery, Strategies of Fantasy (1992)** on BotNS as science fantasy.
- **John Clute, Strokes (1988)** — the collected BotNS reviews that the SFE entry compresses.
- **Algis Budrys, F&SF review columns 1981-83** on each BotNS volume — cited only through Wright (#221 partial).
- **Bruce Gillespie, "Gene Wolfe's Sleight of Hand", ASFR March 1986** — only Wright's quotation (#179); efanzines.com hosts Gillespie's fanzine scans, check it for the ASFR second series.
- **Jo Walton's Tor.com/Reactor rereads** (Peace, 5HC, Soldier of the Mist; collected in What Makes This Book So Great, 2014) — the site is the sweep's third-largest host and Walton is absent.
- **Michael Dirda (Washington Post)** and **Gary K. Wolfe (Locus)** reviews — absent.
- **Robert Borski, Solar Labyrinth (2004)** and **The Long and the Short of It (2006)**; **Andre-Driussi, Lexicon Urthus** (named 5 times, never read); **Aramini, Between Light and Shadow (2015)** — all print, all reachable by Internet Archive borrow or Google Books snippet.
- **Wolfe's Castle of the Otter essays** ("Words Weird and Wonderful", "Onomastics", "Sun of Helioscope") — the primaries behind feature 1 and feature 31, reached only through Wikipedia, Keeley, Wright, WolfeWiki and Andre-Driussi. Castle of Days is on the Internet Archive with full-text search.
- **Thrust 19 (1983) "The Legerdemain of the Wolfe"** — fanac.org / Internet Archive fanzine scans.

## 3. Claims that rest on one source (beyond the four the section flags: 2, 18, 33, 35)

- **Feature 10** ("a clue is given once; important information is never repeated") — three "sources" are all Wolfe: WolfeWiki relaying Wolfe (#287), Barach relaying Wolfe (#312), Wolfe himself (#0, partial). One speaker. And see §6: it collides with Aramini.
- **Feature 16** (place names as believed translations) — four "sources" are Wolfe's foreword, Wolfe's Weird Tales interview, and Wowra quoting both; one essay (Wowra) carries the whole feature. Also the rule generalises an amnesiac foreigner's folk etymology of Greek names to a settlement naming its own land, a step no source takes.
- **Feature 4** (show, never state) — Wolfe's Clarkesworld line, Wolfe's Black Gate list, Stewart re-relaying the Black Gate list, Clute partial. One speaker.
- **Feature 14** (belief from inside) — Wolfe once (#8), Gerlach once, two blog readers.
- **"Everything means something, but not everything means very much." (#380)** — a MetaFilter commenter's attribution to Wolfe, no primary located; the section cites it as "Wolfe's own" in features 11 and 30 and in the register map. Needs the primary or the label "attributed".
- **#419 (Lee "relaying unspecified comments by Gene Wolfe")** — carries the feature 9 hazard ("concerned that he'd done too good of a job"); no primary.
- **#243 Wikipedia "unattributed editorial synthesis"** — counted as a distinct source in feature 8's "24 distinct sources".
- **#147 (Price reporting what Wolfe "told me once")** — private conversation, sole basis with #41 for feature 36's "simpler and more accessible".
- **#364** — the section attributes it as "Gordon relaying Joan Gordon's Starmont study" (feature 9) and "Gordon via Joan Gordon's study" (feature 11). The relayer is Mark R. Kelly, not Gordon. Misattribution in two places.

## 4. Copyright (quotations over twelve words)

- **#174** partial table: "the puzzle is where the political arguments of the novel can be found" — 13 words, printed in the section. Trim.
- **#326** kept row quote — 13 words in the JSON ("the meaning is concealed and has to be teased out by the reader"); the section prints 8 of them, fine, but the row itself is over.
- **#332** — 12 words exactly, at the limit.
- The `trueWording` fields carry multi-sentence verbatim passages (e.g. #45, #56, #65, #10, #224, #309); they never reach the section, but any downstream tool that lifts trueWording will breach. Not a section defect; a hazard for the assembler.
- Wolfe's own fiction is quoted at 7-9 words (#198, #200, #123, #239-241, #297, #454): under the limit.

## 5. Verdicts that look wrong on their face

The r4 regrade downgraded 21 rows for shades of this kind: a hedge the claim hardened (#0 "I try not to" → "refuses"), a singular the claim pluralised (#7 "The book" → "The Soldier books"), a dropped qualifier (#285 "always", #387 "usually"), the interviewer's words attributed to the subject (#331), a gloss on the page's vantage (#31). The same standard, applied to the kept set, catches at least these:
- **#2** — VERIFIED_VERBATIM, but the note says the "puzzles are meant to be solved / not that type of novel" formulation "is Jordan's question ... Attribution by assent, not by his own sentence." That is #331's defect. And feature 9's disagreement paragraph cites it as "Wolfe's own 'the puzzles are meant to be solved' position (#2)", which the page does not have Wolfe saying. PARTIAL.
- **#4** — the cowboys/knights/spaceship enumeration "is Jordan's question", adopted by "So I tried to show it like that". Same class as #2.
- **#10** — note: "The denial is singular ('The book') where the claim generalises to 'the books'". That is #7's defect exactly. PARTIAL.
- **#17 / #228** — note: Wolfe says "It's almost that it has to be", "slightly softer than the claim's flat 'must be'". That is #0's defect. Either #0 comes back up or these go down.
- **#358** — note: "The page hedges with 'perhaps', which the claim drops." That is #285/#387's defect.
- **#45** — note: the page says "people giving testimony at a trial", not "adult witnesses"; "the child/adult contrast is the question's frame". That is #31's defect.
- **#211** — the section prints "a prison, a 'pleasure garden,' and a tomb" against #211, but #211's quote field is "the home of the narrator of a typical Wolfe tale" (a different clause) and trueWording is empty; the printed words exist only in the verifier's note. Either re-point the row's quote or cite the note explicitly.
- **#462** — the section prints "words like 'perhaps' and 'seem' are treacherous"; the row's quote field ends at "are". The extra word is in trueWording, so this is a citation-hygiene nit, not a verdict error.
- **#380** — VERIFIED_VERBATIM as "a MetaFilter reader attributes to Wolfe ..." is correct for the row; the section then drops the attribution frame and uses it as Wolfe's. The row is right, the use is wrong.
- **#130** VERIFIED_SUBSTANCE with a quote the verifier says is "NOT word for word" — handled correctly by the section (never quoted). No action.
- **No NOT_FOUND / BLOCKED rows at all** is not a clean bill: the finders recorded roughly a dozen blocked or 404 sources in their notes (SFS #95 and SFS 14.1 reviews, Logos 2015, Critical Quarterly 2020, Cambridge Core intro, 2005-green.pdf image-only, Medium/Roberts, New Yorker, cwhowell.com, donbeck substack, lists.urth.net live, scatterings blog, fabulist-5hc "Access Denied", sffrd "Just a moment", lofkin "Just a moment", gale-wright-review 0 bytes) and none of them appear in the section's coverage table because they never became claims. The blocked roster needs to be carried into the section so round 4 sees it. Second routes, per item:
  - SFS reviews (DOI 10.1525/sfs.32.1.0212 and the 1987 review of Gordon): JSTOR (SFS is fully on JSTOR), scholar.archive.org, or the Wayback `id_` capture of the old depauw.edu/sfs paths from 2019-2023 (the wolfe46 interview was recovered exactly that way).
  - Logos 2015 "Art and Allegory", Critical Quarterly 2020 "Time After Time", the Liverpool UP Shadows of the New Sun chapters: OpenAlex / Crossref for DOIs → Unpaywall for an OA copy → scholar.archive.org → author's repository.
  - Adam Roberts on BotNS (Medium): scribe.rip, or archive.ph.
  - New Yorker (Bebergal 2015): archive.ph, or the Wayback raw capture.
  - cwhowell.com "Dark Souls of Books", donbeck1.substack "Structure of the New Sun", scatterings1976, lofkin: Wayback CDX (`web.archive.org/cdx/search/cdx?url=cwhowell.com/*&filter=statuscode:200`) to recover the real slug, then the `id_` capture.
  - Gordon 1986 and 2005-green.pdf: the Internet Archive's own OCR (archive.org full-text search on the Starmont guide) or tesseract on the gwern scans with a two-column split.
  - Attending Daedalus, Solar Labyrinth, Lexicon Urthus, Castle of Days, Between Light and Shadow: Internet Archive borrow + "search inside"; Google Books snippet search for the specific phrases already relayed (e.g. "narratological sleight of hand", "suggestive rather than definitive").
  - Thrust 19: fanac.org or Internet Archive fanzine scans.
  - YouTube captions: `yt-dlp --write-auto-sub --skip-download` regenerates the signed URL; the saved caption URLs expired.

## 6. Features the section contradicts itself on

- **Feature 10 vs #142 and #145.** Feature 10's rule: "no trace is repeated". Aramini #145 (feature 11): the gods in the tunnels are established "as repeating an unrelated fact in the text will objectively state" — repetition is the signalling mechanism. Aramini #142 (feature 36): late Wolfe "plays less fair" because "he doesn't provide as many metatextual repetitions" — the fair-play Wolfe repeated. The section cites both under other features and never notices. Wolfe's "once" doctrine (#0, #287, #312) is about clues to the puzzle; Aramini's repetition is about world-facts. The rule needs the distinction or it forbids what the sources say Wolfe did.
- **Feature 1 vs feature 36.** Feature 1 (real old words, none coined) is, by the section's own admission, "a New Sun rule that the later books relax" (Gerlach #159: Long Sun coins). Feature 36 tells the generator to imitate the later Wolfe, not the New Sun. So the diction rule comes from the Wolfe the register rule rejects. Which Wolfe's diction?
- **Feature 5 vs #37.** Rule: "before an entry needs a building, its plan exists" (from the Free Live Free floor plan, #262-263). The register map also cites #37, Wolfe doing "almost none" research before writing and researching "while I'm writing the book". Both are Wolfe; the section takes the floor plan as law and the improvisation as method without reconciling them (the floor plan was drawn mid-draft when he "found myself getting tangled up", which is #37's method, not a pre-planning rule).
- **Feature 13 vs #31.** Rule: "the archivist's own feelings do not appear in the record". Wolfe (#31, partial): "the first person narrator can comment from his viewpoint on actions"; only the author's comment is "ruinously bad". The naive-observer rows (#45) are about a child witness, not about first person generally. The section forbids what Wolfe permits and cites the wrong Wolfe for it.
- **Feature 12's rule sides with the minority.** "It omits, misreads and misjudges, but it does not invent an event that did not happen." The section's own tally: Keeley and Evenson say omission; Gerwel, Auerbach, Gladstone and Gaiman say lies ("straight-up lie" #269, "We know that Severian is a liar" #138). Wolfe's "I never lie" (#54) is about Wolfe, not about his narrators, and the same Wolfe says "the narrator is damn well going to be unreliable" and that Marsch is "trying to talk himself into believing" a falsehood (#44). Either the rule is a design choice (say so on the DM page) or the evidence does not support it.
- **Feature 3 vs feature 32 vs the dissent.** "Short declarative sentences" (3) and "level and unhurried cadence" (32) against Holland's parentheticals (#273), Gevers's baroque (#67), Kelly's "precise and poetic" (#365), Tree Slices (#412). The section resolves by date via Aramini (#141) — a single source for the resolution, and no measurement (see §1).
- **Feature 24 duplicates feature 8** (entry stops before the death / entry ends before the set piece); the same rows (#119, #298) support both. Merge or distinguish.
- **Feature 9 hazard rests on #419 and #111/#450**, a relay of unspecified comments and a relay of Wright; the section's strongest warning to the generator ("a dossier that hides its central fact from every reader has failed") has no primary behind it.
- **Feature 2 (dictionary method)** is scoped "DM page, word-pool construction" but feature 1's rule says the dossier "never glosses" its words while feature 34 says the record "assumes a reader who will look" — consistent, but feature 7's exception (an outsider narrator licenses explanation, #69) is stated and then ruled out by fiat ("a settlement dossier has no outsider hand") although feature 15 makes the dossier "a translation ... by a later hand", which is exactly an outsider hand. Decide whether the later translating hand may gloss.

## 7. Recommended next round

Custom angles (each one finder; the named roster first, then open search):

1. **measure** — "Take four 2,000-word samples of Wolfe's prose from legally hosted excerpts (Reactor/Tor.com excerpts of Shadow of the Torturer ch. 1, The Land Across, A Borrowed Man; Google Books preview of The Fifth Head of Cerberus and Peace p. 15 as quoted by Tree Slices) and report mean and SD sentence length, subordinate-clause depth, share of sentences with parentheticals, dialogue-tag rate, and rare-word rate per period (1972 / 1980 / 2004 / 2015). Also search OpenAlex, Google Scholar and the MLA bibliography for 'Gene Wolfe' with stylometr*, corpus, 'sentence length', 'computational', and read the Garvey 2016 Bridgewater thesis already on disk."
2. **counter** — "The case that Wolfe's withholding fails or is overrated: Gillespie's 'Sleight of Hand' (ASFR 1986, efanzines.com), Budrys's F&SF columns 1981-83 (Internet Archive F&SF scans), Adam Roberts on BotNS (scribe.rip), Bebergal's New Yorker piece (archive.ph), M. John Harrison and Christopher Priest on Wolfe if they wrote (check), Goodreads/Reddit 'unreadable' threads, the Gwyneth Jones Foundation review in full, and any reviewer who calls the prose baroque, dense or overwritten."
3. **editors** — "Damon Knight on editing Wolfe's Orbit stories (Knight's Orbit letters, In Search of Wonder later editions, Wolfe's own accounts of Knight in interviews already in state: grep the raw captures for 'Knight'); David Hartwell on editing BotNS (Locus 2019 tributes, Hartwell interviews, Age of Wonders); Wolfe's Plant Engineering editing; Teresa Nielsen Hayden / Patrick O'Leary / Tor copyediting anecdotes; C. S. E. Cooney's full account (already partial)."
4. **le-guin** — "Ursula K. Le Guin on Gene Wolfe: the Melville blurb and its source, her Guardian/obituary remarks, her Steering the Craft or Language of the Night mentions, the Wolfe-Le Guin correspondence if any is public, noisms 2019 (on disk) as the pointer."
5. **primary** — "Wolfe's own craft essays not yet claimed: 'Nor the Summers as Golden' (on disk), the 1987 Elfland essay (on disk), the 2015 chat (on disk), Wilbanks 2005 (on disk), 'What I Know About Writing' in full (Swanwick quotes it), Castle of Days via Internet Archive search-inside ('Words Weird and Wonderful', 'Onomastics', 'Sun of Helioscope', 'The Feast of Saint Catherine'), Thrust 19 via fanac.org, the Locus 2011 and 2002 interviews in full via Internet Archive Locus scans."
6. **monographs** — "Manlove 1986 ch. on BotNS; Attebery 1992; Clute, Strokes 1988; Wright, Attending Daedalus 2003 (IA borrow, search-inside for 'suggestive rather than definitive', 'narratological sleight of hand', 'first misinterpreted narrative'); Borski 2004/2006; Andre-Driussi, Lexicon Urthus introduction; Aramini 2015 introduction; the SFS reviews via JSTOR."
7. **close (continuation)** — "Urth list close reading chapters III onward (October and November 2006 indexes already on disk); Jo Walton's Reactor rereads; KSR's NYRSF 'A Story' (on disk); Alzabo Soup and ReReading Wolfe episode transcripts via yt-dlp auto-subs; the three unclaimed Ultan essays on disk (Greek Themes, Catherine the Weal, Lions and Tigers); r/genewolfe top threads from the saved search JSON."

Verifier instructions for the round: re-grade #2, #4, #10, #17, #228, #358, #45 against the r4 standard; re-point #211's quote; trim #174 and #326 under twelve words; carry every finder-level BLOCKED / 404 into the coverage table as its own column so the zeroes stop reading as clean; and record on the DM page which of feature 12's two positions (omission only, or lies too) is a design choice rather than a finding.
