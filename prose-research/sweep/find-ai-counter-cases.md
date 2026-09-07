# FIND — AI catalogue, angle: COUNTER-CASE + publishing primaries
Opus finder, 2026-09-06. Raw notes. All fetches by curl + browser UA unless noted.

## Roster status
1. Winterson, Guardian 2025-03-12 — FETCHED (curl, live). raw/winterson.txt
2. Rie Kudan/Qudan, Akutagawa Jan 2024 — FETCHED Japan Times 2024-01-19 (curl). raw/jtimes.txt
3. Mark Lawrence blind test 2023 — FETCHED both posts (setup 13 Sep 2023, results 14 Sep 2023). raw/lawrence-setup.txt, raw/lawrence-results.txt
4. Vauhini Vara, "Ghosts", Believer 2021-08-09 — live blocked by Cloudflare; FETCHED via Wayback raw capture 20220512115630. raw/ghosts-wb.txt
5. Sudowrite Muse — FETCHED (curl, live). raw/muse.txt
6. Jane Friedman, Aug 2023 — FETCHED (curl, live). raw/friedman.txt
7. Authors Guild 2023 survey — first URL 404; FETCHED the 2023-05-15 survey release. raw/ag90.txt
8. OneBookShelf / DriveThruRPG policy — help.drivethrurpg.com live = Cloudflare "Just a moment"; Wayback has only the Oct 2024 customer-experience page (raw/dtrpg-wb.txt). The July 2023 written-content ban text reached only via EN World quoting Gizmodo (raw/enworld.txt) → treat as relay.
9. Clarkesworld "A Concerning Trend" 2023-02-15 — FETCHED (curl, live). raw/clarke.html/.txt
10. NPR Clarke interview 2023-02-24 — FETCHED (curl, live). raw/npr.txt
11. Alex Hern TechScape — actual date 2024-04-16 (not May); FETCHED (curl, live). raw/techscape.txt
Lateral: Simon Willison link blog 2024-04-18 (raw/swillison.txt) — used only to recover the Guardian URL.

## Key extracts
### Winterson (own words, critic-as-novelist, asserts counter-case)
- "I think of AI as alternative intelligence."
- "What is beautiful and moving about this story is its understanding of its lack of understanding. Its reflection on its limits."
- She quotes the model's own line: "I curled my non-fingers around the idea of mourning..."
- "AI reads us. Now it's time for us to read AI."
- Note: her praise is for the SELF-REFLEXIVE metafictional stance, not for scene, character or concreteness. Register measured: literary metafiction, March 2025, OpenAI's unreleased creative-writing model.

### Kudan (Japan Times, reporter quoting acceptance speech)
- "This is a novel written by making full use of a generative AI like ChatGPT, and probably about 5% of the whole text is written directly from the generative AI."
- Novel: "Tokyo-to Dojo-to" / "Sympathy Tower Tokyo"; about an architect. Prize: Akutagawa, awarded Wed evening (17 Jan 2024).
- Reception split on X.

### Mark Lawrence (measurement, reader test)
- Setup: 8 pieces of flash fiction, all ~350 words, prompt "write a piece of fiction based on 'meeting a dragon'"; human pieces by experienced published authors; AI pieces by ChatGPT 4 (paid). Two polls per piece: enjoyment + human/AI guess.
- Results (14 Sep 2023): min 374 votes, max 911.
- "After a minimum of 100 votes per poll the voters were only able to come to a statistically significant opinion on 4 of original 8 posts."
- "after a mimimum 100 votes 5 of the 8 cases were undecided or incorrectly decided. After a minimum 370 votes 3 of the 8 cases were undecided or incorrecly decided."
- "The 2nd and 3rd highest rated pieces were AI-written."
- "In 5 of the 7 cases in which there was a statistically significant opinion it was the correct opinion."
- Caveat in his own words: "The people voting on this included MANY writers".
- Piece 8 = AI with "19th century language" prompt: "clearly unpopular choice!" — ARCHAISM steerability datum.
- Reader comments (kind=reader) on the winning AI piece #2: "Definitely felt like an AI trying to write something profound, but failing miserably." / "concerning that others were enticed by the AI's simplistic nonsense prose. ... the AI pieces all introduced the dragon in the opening statement, and did so in a similar manner."
- The AI piece #2 text is ON the page: abstractions ("Myths are but forgotten truths"), no proper nouns, tidy uplift ending.

### Vara, "Ghosts" (own words + demonstration)
- GPT-3, 2020-21. "In the nine stories below, I authored the sentences in bold and GPT-3 filled in the rest."
- Editing disclosure: "My and my editor's sole alterations to the AI-generated text were adding paragraph breaks in some instances and shortening the length of a few of the stories".
- "The AI matched my canned language; clichés abounded. But as I tried to write more honestly, the AI seemed to be doing the same." → STEERABILITY claim: candor begat candor.
- She praises the NYT fake Modern Love GPT-3 line for repetition: "I had never read such an accurate Modern Love in my life."
- Story 9 (all hers) is where the concrete detail lands: the cemetery breath-holding game, the numbed voice on the tape, "Once upon a time, she taught me to exist." Contrast: GPT-3's stories drift into invented biography (ran across America in 1978).

### Sudowrite Muse (vendor pole, Jan 2025-era page)
- Header: "The first AI made for fiction, designed for authors."
- "Basic AI writes boring emails." / "Basic AI spews clichés." / "Basic AI loves happy endings."
- "Muse writes unique prose every single time"
- "Muse will write anything – no filters"
- Feature list: "Show, Don't Tell", "More Specific Descriptions", "Start Late, End Early", "Cliffhanger Endings", "Hook-y Openings", "Accurate POV & Tense", "Dynamic Pacing", "Varied Sentence Length", "Matches Your Style", "Adheres to Story Bible".
- "Peerless prose. Muse has a deep understanding of writing craft and avoids the pitfalls of other models."
- The vendor's own ChatGPT foil sample: "In the year 2150, Earth had undergone a remarkable transformation..." annotated "too much exposition! way too telly"; second foil sample annotated "so many cliches / where is the tension? / flowery language, nothing is happening".
- Samples labelled "(yep, Muse helped write these!)".
- NOTE the vendor names as the fixable defects exactly the catalogue's features: cliché, uniform tidy endings, abstraction over concrete, exposition, uniform sentence length. Vendor = interested party; polarity = asserts steerability.

### Friedman (own words; reception/industry)
- Fake books under her name on Amazon/Goodreads Aug 2023. "As soon as I read the first pages of these fake books, it was like reading ChatGPT responses I had generated myself."
- Amazon reply: "Please provide us with any trademark registration numbers that relate to your claim." Case closed, books not removed (Aug 7); removed by Aug 8.
- Another author reported 29 illegitimate books in a week.

### Authors Guild survey (2023-05-15, >1,700 authors)
- 23% of writers reported using generative AI as part of their writing process; of those 54% ChatGPT, 13% GPT-4, 8% Bard.
- Of AI users: 47% grammar, 29% brainstorming plot ideas and characters, 14% structure/organize drafts, 26% marketing.
- "Only around 7 percent of writers who employ generative AI said they use it to generate the text of their work."
- Of those: 1.4% said AI text ≥50% of their work; 89% said <10%.
- 90% say they should be compensated; 65% support collective licensing; 91% say readers should know when AI created all or part; 69% think careers threatened.

### Clarkesworld / Clarke
- 2023-02-15: "the number of spam submissions resulting in bans has hit 38% this month."
- "I'm not going to detail how I know these stories are 'AI' spam... There are some very obvious patterns and I have no intention of helping those people become less likely to be caught."
- On detectors: "Yes, there are tools out there for detecting plagiarized and machine-written text, but they are prone to false negatives and positives."
- 2/20 edit: "Submissions spiked this morning–over 50 before noon–so I've temporarily closed submissions."
- NPR 2023-02-24, Clarke's spoken words: "By the time we closed on the 20th, around noon, we had received 700 legitimate submissions and 500 machine-written ones."

### Hern, Guardian TechScape 2024-04-16 (dated April, not May)
- "We're witnessing the birth of AI-ese, and it's not what anyone could have guessed."
- "the text they spit out is, while grammatically and semantically sound, ineffably generated" — and crucially "Without a concerted effort to break the systems out of their default register" → STEERABILITY: the tells are a DEFAULT REGISTER, not a ceiling.
- Named tells: "The fawning obsequiousness"; "A tendency to offer both sides of an argument in a single response, an aversion to single-sentence replies, even the generally flawless spelling and grammar".
- "delve": "When half a percent of all articles on research site PubMed contain the word 'delve' – 10 to 100 times more than did a few years ago".
- Other words: "Explore", "tapestry", "testament" and "leverage".
- Mechanism: RLHF annotation outsourced to the global south; "In Nigeria, 'delve' is much more frequently used in business English than it is in England or the US."
- "If AI-ese sounds like African English, then African English sounds like AI-ese." → the lexical-tell catalogue is partly a DIALECT PREJUDICE, the strongest counter-case against lexical tells as quality evidence.

### DriveThruRPG / OneBookShelf (RELAY — policy text not reachable at primary)
- Via EN World quoting Gizmodo (Jul 2023): marketplaces "will not accept standalone artwork products that utilize AI-generated art"; from July 31 content "primarily" of AI-generated writing not allowed; "We acknowledge enforcement challenges ... and trust in the goodwill of our partners to offer customers unique works based primarily on human creativity".
- Primary reached: DriveThruRPG help page "Customer Experience with AI-Generated Content Within Titles", dated October 28, 2024 (Wayback 20251005160536): three filter values "Handcrafted", "Contains AI-Generated Content", "Creation Method Not Chosen by Publisher"; note the definitions are about ART only ("Artwork was made by an artist practicing their craft"). The 2024 storefront filter therefore does NOT label AI-written TEXT. Useful register/industry datum.

## Expansion round (bibliography chasing + arXiv/OpenAlex/EuropePMC APIs; WebSearch budget exhausted)
- Porter & Machery, Sci Rep 14:26133, 14 Nov 2024 — ChatGPT 3.5, human-out-of-the-loop, 10 poets x 5 poems; 1,634 participants (study 1), 696 (study 2); 46.6% accuracy on N=16,340; all 5 AI poems out-rated all 5 human poems; largest effect on RHYTHM; mechanism = accessibility ("doesn't make sense" 144 vs 29).
- Chakrabarty & Dhillon, CHI 2026 (arXiv 2601.18353) — THE pivotal steerability result. 28 MFA writers vs GPT-4o/Claude 3.5 Sonnet/Gemini 1.5 Pro emulating 50 authors; expert preference for human 82.7% (in-context) reverses to 62% for AI after per-author fine-tuning of GPT-4o; stylistic fidelity 81.1%/80.0% for AI post-fine-tune; fine-tuning costs 583x the tokens; excerpts <=450 words.
- Chakrabarty, Ginsburg & Dhillon, arXiv 2510.13939v4 — detectors flag 3% of fine-tuned vs 97% of prompted; median fine-tune cost $81/author.
- Farrell, arXiv 2601.17363v3 — Italian, ChatGPT-4o vs Moravia, n=20, AI slightly preferred (modest).
- Chakrabarty et al., Art or Artifice (CHI 2024) — the negative pole: LLM stories pass 3-10X fewer TTCW tests.
- Chakrabarty, Laban & Wu, CHI 2025 — seven-category idiosyncrasy taxonomy; LAMP corpus 1,057 paragraphs; no model family better than another.
- Doshi & Hauser, Sci Adv, 12 Jul 2024 — GPT-4 IDEAS only (not prose); novelty +8.1%; low-DAT writers "how well written" +26.6%; high-DAT writers unaffected; stories more similar to one another.

## The gap this angle did NOT close
No source read measures the archival / encyclopedic / civic-record register. Every measurement is lyric poetry, flash fiction, <=450-word literary excerpts, short stories, or PubMed article vocabulary. The nearest adjacent evidence is Hern's PubMed lexical measurement (an impersonal expository register) and Vara's "inconsistencies and untruths" warning about a first-person factual register.
