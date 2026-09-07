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
