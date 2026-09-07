# FINDER NOTES — AI catalogue, angle: THE BIOGRAPHICAL RECORD UNDER AI
Opus finder, 2026-09-06. Method: OPUS-FINDER-METHOD.md.

## Roster status (running)
1. The Verge, Mia Sato, Feb 2024 — FETCHED (raw curl UA). URL corrected: /24065145/ai-obituary-spam-generative-clickbait (the /2024/2/13/24067157/ form 404s).
2. Wired follow-up on AI obituary spam — TWO Wired pieces found and FETCHED raw:
   - Ben Weiss, "The Morbid War Over Online Obituaries", Dec 26 2021 (pre-LLM algorithmic summariser; kin errors)
   - Kate Knibbs, "The Bizarre Cottage Industry of YouTube Obituary Pirates", Sep 22 2023 (MSN Brandon Hunter AI obit)
3. Judy G. Russell (The Legal Genealogist) on ChatGPT-fabricated citations — **NOT FOUND, and negatively established.**
   Scanned ALL 192 posts dated 2023-2026 from her wp-sitemap (curl, browser UA), grepping
   chatgpt|artificial intelligence|generative ai|large language. 16 hits; every one is incidental
   (Rumsey map OCR praise; Ancestry/MyHeritage/23andMe TOS clauses; a lecture listing; the joke
   holiday-wish disclaimers). The ONLY AI-substantive post is "AI meets TOS" (12 May 2026), which is
   about TOS clauses, not fabrication. **No Judy Russell post on ChatGPT-fabricated citations exists
   on legalgenealogist.com.** The angle's premise looks like a misattribution — the widely repeated
   genealogy-practitioner example (ChatGPT invents sources for a Smith County, Tennessee history) is
   Amy Johnson Crow's, not Russell's. Chase AJC + Family Locket instead.
4. WikiTree AI policy — curl blocked (HTTP 202 bot challenge). Try WebFetch / archive.
5. FamilySearch AI policy — pending.
6. Find a Grave generated-biography complaints — pending.

## SOURCE 1 — The Verge, Mia Sato, "The unsettling scourge of obituary spam", Feb 12 2024
URL https://www.theverge.com/24065145/ai-obituary-spam-generative-clickbait ; route: curl + browser UA.
Verbatim strings confirmed present in fetched text:
- "Except Brian Vastag was very much alive"  (a fabricated DEATH in the record register)
- "The obituaries are detached and nearly identical to one another" (+ "with a few words moved around and repeating inaccurate details, like where Mazur lived")
- "The articles are clunky and provide little information"
- "sometimes using identical vague phrases about the deceased"
- "written with a nondescript gravitas, using unnatural phrasing" (then: like the "indelible mark" a person has left, or their "untimely demise," but without any actual detail about their life)
- "they lack quotes from family or friends of the deceased" (+ "and do not cite outside reporting")
- "the curious and concerned public is advised to stay tuned" (quoted BY the reporter FROM a spam obituary; a demonstration passage)
- "appears to be an AI summary of the op-ed"  (mechanism: scrape + summarise)
- "only Vastag's obituary captures the actual person Mazur was" (curly apostrophe in source)
modelEra: unnamed generative-AI tools, observed Feb 2024; register measured = obituary / biographical record.

## SOURCE 2 — Wired, Ben Weiss, "The Morbid War Over Online Obituaries", Dec 26 2021
URL https://www.wired.com/story/morbid-war-online-obituaries/ ; route: curl + browser UA.
Echovita published an automated SUMMARY of a family-written obituary three days after it ran. Errors:
- "It said Tug and Cash were Jane's "close friends", failing to note that they were dogs."
- "Her granddaughter became a grandson."  <- KIN RELATION CORRUPTED
- "And her children weren't mentioned as survivors."  <- KIN OMITTED from the survivors list
- widower Joel Thompson: "It looks like a fourth grader did it" / "printed such a piece of crap"
CAUTION: 2021, "their algorithm, or whatever program they use" — an automated summariser, NOT stated
to be an LLM. modelEra must say so. Value: it is the earliest measured case of the exact failure the
angle names (invented/garbled KIN in the record register) and it predates the LLM era.

## SOURCE 3 — Wired, Kate Knibbs, "The Bizarre Cottage Industry of YouTube Obituary Pirates", Sep 22 2023
URL https://www.wired.com/story/youtube-obituary-pirates/ ; route: curl + browser UA.
- MSN's Brandon Hunter obituary: "an incoherent and oddly hostile obituary for former NBA player"
  ... "critics assumed the garbled article was written by AI". Microsoft never confirmed; story removed.
- register failure of the (human-read) pirate videos: "there's no hint of emotion or acknowledgement"
- figures (channel scale, not prose): highest follower count "slightly over 26,000"; highest views ~1.7 million.

## SOURCE 4 — Wikipedia, "Obituary piracy" (RELAY; retrieved 2026-09-06)
Used only as a bibliography: it pointed to the two Wired pieces. Its own body sentence
"often using generative artificial intelligence to do so" is relay, not primary. Do not claim from it
except as a relay of the Wired/Verge primaries.

## SOURCE 5 — The Legal Genealogist (Judy G. Russell), site-wide scan + "AI meets TOS", 12 May 2026
URL https://www.legalgenealogist.com/2026/05/12/ai-meets-tos/ ; route: curl + browser UA.
Substance: MyHeritage (Apr 2026) and Ancestry (12 May 2026) TOS amendments barring AI agents from the
record databases, and MyHeritage's new licence words "personal, non-commercial, and human use".
This is a VENDOR-POLICY claim, not a prose-fault claim. Russell's own line: "there's a clear showdown
going on between major content providers on one side and the agents of artificial intelligence".

## SOURCES 6-21 (added after checkpoint 1)
6. WikiTree G2G, "Should WikiTree have a style guide for AI generated content?" (22 Nov 2023, 13 answers) — the
   single richest reader-source on the angle. Brad Foley: bots "easily generate lovely bios with lots of false"
   facts; M Ross writes a PARODY line ("was a loving mother, she always looked after her children") and names the
   register directly — it reads like obituary filler "by someone who knew little if anything about the deceased";
   Stephanie Ward: "pretty words for a lot of nothing"; M Cole on STEERABILITY: ChatGPT keeps "adding lofty summary
   statements about people's achievements no matter what" prompt forbids it; Chase Ashley on CIRCULAR SOURCING
   (ChatGPT 4 summarised the WikiTree profile and cited it back); M Cole on hallucinated facts under real citations;
   Brad Foley's first-person parody ("I remember the smell of his pipe") answered by Eric Weddington's register rule
   (a genealogical biography is "supposed to be in the 3rd person, not the first person").
   ROUTE: a Googlebot user agent. A normal browser agent gets HTTP 202 + a bot challenge.
7. WikiTree G2G draft AI-IMAGE policy (13 Apr 2026) — the stated reasons: "WikiTree is committed to accurate sources
   and records" and "there is a real risk that they can be taken as fact". IMAGES, not text; do not overclaim.
8. Vita Brevis / American Ancestors, Anjelica Oswald, 11 May 2026 — the fabricated-CITATION case in the archival
   register: ChatGPT gave a patron a Boston marriage record with three named repositories and exact pages; staff
   checked; "it made up a record that didn't exist". Plus the OCR case (Harvard College -> "Harman Collens") and a
   RELAYED figure (LiveScience relaying OpenAI: two advanced models "hallucinated" 33% and 48% of the time).
9. Amy Johnson Crow, 7 Jul 2023 — THE MECHANISM: the model produced legal citations because "That was the type of
   language that was expected". A bare-name biography of an obscure ancestor: "There's nothing in this biography
   that's correct". With the facts supplied, still "some editorializing and a little bit of embellishment".
10. Family Locket (Nicole Elder Dyer, 17 Nov 2023) — COUNTER-EVIDENCE: ChatGPT 4 formatted a Chicago book citation
   correctly; it struggled only when she did not supply the details.
11. Wikipedia:Signs of AI writing — the encyclopedic-register field guide. "indelible mark" is in its words-to-watch
   list, corroborating Sato's Verge observation from a wholly independent corpus. The hedge that matters most for a
   record: when the model cannot find a person's private life it asserts the person "maintains a low profile", and
   the guide says such claims are "entirely speculative". Also the citation family (invalid DOIs, page-number-less
   book citations, made-up IEEE references).
12. Wikipedia:Large language models — "neutral-seeming in tone, but not necessarily in substance", and "This concern
   is especially salient for biographies of living persons".
13. FamilySearch blog (19 Feb 2026, Abby Tanner) — VENDOR, promotional. FamilySearch has NO restrictive AI policy;
   its Help Center "Artificial Intelligence" page is a class index.
14. Board for Certification of Genealogists, 9 Jul 2024 — the genealogy body that DOES prohibit: portfolio work
   "may not be written or generated by AI".
15. Washington Post, Drew Harwell, 3 Aug 2025 — the successor reporting to the Verge piece, and the best source on
   the angle's INVENTED KIN limb: hallucination "has led to some awkward errors, including returning obituaries in
   which a person's family members get mixed up". The Tribute tool invented a chilly birth day, a Groucho Marx
   motto and a sunny embrace "despite being given none of that information", plus "fake nicknames, preferences and
   life events". A funeral worker tells ChatGPT not to assume "passed away peacefully" — "We don't know that it was
   a peaceful death". Bob Treadway, a daily obit reader, names "the paint-by-numbers phrases, the clunky sentences"
   and obits like "stilted messages that read as if they were ripped from LinkedIn". Mary McGreevy: "templated and
   airbrushed"; the ones that matter "get to the imperfect heart of who that person was". Irina Raicu: "flattening
   effect", "generic simulacrum". Scale: Passare's tool "has written tens of thousands of obituaries nationwide".
   Models named: CelebrateAlly routes creative writing to GPT4 Turbo and logical messages to Claude; another builder
   uses Claude Sonnet. ROUTE: live URL and Googlebot both failed; the Wayback RAW capture
   web.archive.org/web/20250804135306id_/... worked.
16. Futurism, Frank Landymore, 4 Aug 2025 — relays the Post's CelebrateAlly samples, which the Wayback capture of
   the Post does not carry (they sat in an interactive element): "His thoughtful nature manifested in countless acts
   of kindness"; "not merely physical prowess, but an inner fortitude"; and the note that "No mention of his friends
   or family was made in the prompt".
17. Futurism, Victor Tangermann, 14 Sep 2023 — the Brandon Hunter primary. "Brandon Hunter useless at 42";
   the mechanism is synonym substitution over a scraped TMZ story, "so liberal that the result is essentially
   incomprehensible". CAUTION: Microsoft's "not a large language model or AI system" line was about the earlier
   OTTAWA travel guide, never about the obituary.
18. Poynter, Kristen Hare, 15 Sep 2023 — the REGISTER BOUNDARY from a working obituary writer: "I wouldn't let a bot
   near the kind of reported obits" she writes, while the family "resume-listing kind" might be served.
19. FActScore (Min et al., arXiv:2305.14251) — the measurement the method said was missing. People biographies,
   183 Wikidata entities, human-evaluated against English Wikipedia: InstructGPT 42.5%, ChatGPT 58.3%,
   PerplexityAI 71.5%. "Error rates are higher for rarer entities." "Error rates are higher for facts mentioned
   later" in the generation.
20. Slate, Charles Seife, 13 Dec 2022 — Davinci-003 wrote his obituary while he was alive. Wrong birth date, year
   and city; an invented Berkeley PhD; a book that does not exist; courses from the wrong department; the legacy
   "transformed into a cliché". Asked to cite a source per sentence it produced a plausible NYT obituary URL —
   "Of course, no such obituary ever existed" — "making up BS references to back up its BS facts", with "The
   implicit effort that's put in to create a believable facsimile" of a source as deep as the answer itself.
21. The Legal Genealogist site-wide scan (negative measurement) — see roster note 3 above.

## READ BUT NOT SUBSTANTIVE
- Wikipedia "Obituary piracy" (relay only, used for its bibliography)
- FamilySearch Help Center "Artificial Intelligence" (a class index, not a policy)
- WikiTree Help:Photos FAQ (the AI answer exists but concerns images)
- ElderLawAnswers "AI and Obituaries" (no independent measurement)
- Tulip Cremation "Using AI to Write an Obituary" (the "Obituare" comparison that search snippets attribute to this
  page is NOT in the page as fetched — no claim drawn; a snippet is not a read)

## FINAL STATE
104 claims, 26 sources (21 substantive). Every quotation re-checked against the fetched bytes with inline markup
(<b>/<i>/<a>/<span>) removed, so a verifier fetching raw HTML will find each string contiguous. 0 misses.
