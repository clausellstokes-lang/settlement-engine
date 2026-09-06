# Completeness critic: sweep "ai"

Read: `section-ai.md` (554 lines), `kept-ai.json` (173 rows, every note), `partial-ai.json` (65 rows, every note), the 16 excluded rows from `state-ai.json`/`merged-ai.json`. No `find-ai-*.md` notes exist in the sweep directory (the glob matches nothing), so the search notes could not be reviewed; the recommendations below assume the four angles named in the section header are the only ones run.

## 1. Angles not run

- **The register the rules govern is unmeasured.** Every source that measures LLM failure measures fiction, verse, essays, news or speeches. Not one row observes LLM output in the archival, chronicle or encyclopedic register that Parts A and B legislate for (the dossier, the chronicle line). The section concedes it once ("[4] and [43] are measured on short fiction; the dossier is not fiction") and then extrapolates 22 rules from fiction. Run an angle on LLM prose in record-like registers: Wikipedia's own WikiProject AI Cleanup reports and the "Signs" page's revision history, Brooks et al. 2024 on AI-generated Wikipedia articles (arXiv 2410.08044), Liang et al. 2024 on LLM-modified scientific text (arXiv 2404.01268), Geng and Trotta 2024 on academic writing style, and any study of LLM-written local history, genealogy or gazetteer prose.
- **Model-era dating.** Makin [184] and Wikipedia [123] both say tells drift within months, yet no row carries the model generation it observed. Schifano (Oct 2023), Dramatron (2022, Chinchilla), Akoury (GPT-4, 2023), Church's "coherence falls apart at 250 words" (2025, and plainly false of 2026 models), the Nvidia demo (May 2023), Cobey (ChatGPT-3.5, July 2023), Williams (Jan 2024) and Hockaday (Oct 2023) are cited beside StoryScope, Sui, Hamilton and Narrative Flattening (all 2026) without a date column. Add one and re-weight: a 2023 observation that a 2026 source contradicts should not carry a rule.
- **Steerability, the case against the program's own premise.** The section's practical conclusion ("no prompt, temperature or model switch fixes it; only authored pools do", features 6 and 25) rests on DK and Hatzel [50], who tested exactly two mitigations (negative prompting, temperature), and Wenger and Kenett [76] on model switching. The literature that contests it is absent: Kirk et al., ICLR 2024 (RLHF reduces output diversity; base models do not), Zhang et al. 2025, "Verbalized Sampling" (arXiv 2510.01171; prompting for a distribution reportedly recovers 1.6 to 2.1x diversity), Lanchantin et al. 2025 on diversity-preserving preference optimisation, and the fine-tune counter-case already in the corpus as partial [143]. The finite-semantics law makes the product decision moot, but the research claim is overstated and should be cut to what [50] measured.
- **Games research and practice beyond PC Gamer.** The games angle is eight PC Gamer rows, one op-ed, one trade site and one forum. Absent: CALYPSO (Zhu, Callison-Burch et al., AIIDE 2023, the D&D DM-assistant study), Kreminski's work on generative narrative, Emily Short's posts on LLM NPCs in interactive fiction, Ubisoft's Neo NPC demo and its GDC 2024 reception, Square Enix's Portopia (April 2023, Steam "Mostly Negative"), AI Dungeon's coherence history, Keywords Studios' abandoned all-AI game experiment (2024), and for the DM page specifically the adventure reviewers who have read AI-written modules: tenfootpole.org (Bryce Lynch), The Alexandrian (Justin Alexander), Sly Flourish (Mike Shea). Feature 26's "barks are load-bearing" rests on one op-ed [209].
- **Humour, subtext and cultural homogenisation each have a well-known primary that is missing** (named in section 2). Feature 22 is flagged SINGLE SOURCE for humour when the standard study exists.
- **The counter-case for the whole catalogue** (angle 4 argues that tells are human devices; it never argues that generated fiction can be good). Absent: Jeanette Winterson's Guardian defence of the OpenAI metafiction story (12 March 2025; the same story Michel [156] to [158] attacks), Rie Kudan's Akutagawa Prize novel with ChatGPT passages (January 2024), Mark Lawrence's 2023 blind reader test of AI versus human flash fiction, Vauhini Vara's "Ghosts" (2021). [143] and [144] (both partial) are the only counter-cases and neither is a critic saying the prose is good.
- **Publishing primaries.** Jane Friedman's 2023 account of AI books published under her name, the Authors Guild 2023 survey, OneBookShelf's own policy text (the section quotes EN World's paraphrase, [213]), Clarkesworld's "A Concerning Trend" (15 February 2023) and NPR's 2023 Clarke interview, which Vollmer [87] cites secondhand.

## 2. Well-known critics and studies absent, by name

Peer-reviewed:
- Mirowski, Mathewson, Branch et al., "A Robot Walks into a Bar" (FAccT 2024, arXiv 2405.20956): twenty professional comedians on LLM comedy writing. The direct fix for feature 22's SINGLE SOURCE flag.
- Subbiah et al., "Reading Subtext" (TACL 2024, arXiv 2403.01061): LLMs miss subtext in short stories, judged by the stories' own writers. Feature 1's peer-reviewed leg is StoryScope plus Ahuja; this is the third.
- Agarwal, Naaman and Vashistha, "AI Suggestions Homogenize Writing Toward Western Styles" (CHI 2025, arXiv 2409.11360). Feature 6's "one template for every culture" has Rettberg and Wigers alone on the culture axis.
- Köbis and Mossink 2021, "Artificial intelligence versus Maya Angelou" (Computers in Human Behavior 114:106553), the pre-ChatGPT poetry-detection study; and Walsh, Preus and Gronski, "Does ChatGPT Have a Poetic Style?" (CHR 2024, arXiv 2410.15299) plus Walsh, Preus and Antoniak, "Sonnet or Not, Bot?" (2024). Verse appears only via The Literary Quant and Porter and Machery.
- Ippolito, Yuan, Coenen and Burnam 2022, "Creative Writing with an AI-Powered Writing Assistant: Perspectives from Professional Writers" (arXiv 2211.05030), and Chakrabarty, Padmakumar, Brahman and Muresan 2023, "Creativity Support in the Age of LLMs" (arXiv 2309.12570): professional and emerging writers on why the suggestions are generic. The novelist angle has zero peer-reviewed rows of this kind.
- Kirk et al. 2024 (arXiv 2310.06452) and Zhang et al. 2025 "Verbalized Sampling" (see section 1); Sharma et al. 2023, "Towards Understanding Sycophancy in Language Models" (arXiv 2310.13548) for feature 19's mechanism, which currently rests on a PC Gamer aside [201].
- Weber-Wulff et al. 2023, "Testing of detection tools for AI-generated text" (Int. J. Educational Integrity 19:26), the standard multi-detector evaluation; Dugan et al. 2023 "Real or Fake Text?" (AAAI, arXiv 2212.12672) and Ippolito et al. 2020 (ACL) on human boundary detection. Feature 24 has no detector study later than 2023 except a vendor rebuttal.
- Bender and Koller 2020 and Bender et al. 2021 for feature 10 ("no one behind the sentence"), which is currently seven practitioners and no theory.
- Doshi and Hauser's primary paper is in the corpus but CONTRADICTED on one figure [25]; feature 25 cites the ScienceDaily press release [252] for the same figure instead. Re-cut [25] and retire [252].

Critics and editors:
- Ted Chiang, "Why A.I. Isn't Going to Make Art" (New Yorker, 31 August 2024) is the most-cited critic in the section and appears only secondhand, three times ([94] via LitReactor, [95] and [160] via Michel), all three graded PARTIAL for attribution. Fetch the primary (newyorker.com or archive.ph) and promote.
- Neil Clarke's own blog is fetchable ([168], [171] prove it) yet [87] cites him through Vollmer citing Post Alley and NPR.
- Laura Preston (n+1) via Vollmer [186]; Charlie Guo via Vollmer [141]; Mohammad Siam via Dramatica [118]; Ethan Mollick's thread via Dramatica [108]; Elizabeth Goodspeed via Ayres [116]; Nostalgebraist via Makin [129]; Mark Williams (TNPS) via Anne R. Allen [227]; Weixin Liang via The Markup [239]. Eight secondhand primaries, each one fetch away.
- Alex Hern's Guardian TechScape (May 2024) on outsourced RLHF labour and African English is the well-known source for the "delve" dialect dispute; the section has a Nigerian newspaper's tweet roundup [235].
- Robin Sloan, John Scalzi, Chuck Wendig and Cory Doctorow have all written craft-level critiques of generated prose; none appears. Tiffany Yates Martin and Victoria Strauss (Writer Beware) are the missing editor voices.

## 3. Claims resting on one source (beyond the five the section flags)

- Feature 12 as a whole: each sub-tell rests on one document (fragments: tropes.fyi, undated; stacked negation: one forum note, partial; cliffhanger: Makin; kicker: Vollmer). The section calls the sourcing thin but still writes four bans from it.
- Feature 2's "ends, then ends again": one preprint reported on one blog [84].
- Feature 5's swappable sentences: Schifano alone, on 2023 text.
- Feature 8's body and smell figures: StoryScope alone; the rest is Vollmer's commentary.
- Feature 13's cognition claim (the negated idea is what the reader keeps): Gonzales alone, citing one 2003 study.
- Feature 16's "scenery given intent": Hess alone.
- Feature 17's mechanism (the model keeps obeying the instruction): Makin alone.
- Feature 19 in fiction: one game review [202], [204]; the fiction evidence is borrowed from features 3 and 7.
- Feature 20's "250 words": Church alone, and stale.
- Feature 3's mechanism sentence "post-training does the flattening, so a prompt cannot undo it": [46] shows post-training flattens across four checkpoints of one model family (OLMo 32B); it does not test prompts. The second clause is the section's inference, not the paper's.
- Feature 26's "barks are load-bearing": [209] alone.

## 4. Copyright: quotations over twelve words

- Every span inside quotation marks in the section is twelve words or fewer (scripted check; the one 13-word hit is the coverage-table prose, not a quotation). The rule is met inside the marks and evaded outside them: in at least five bullets the quotation stops at twelve words and the sentence continues with the source's next words unquoted. Feature 1 [108]: eight quoted words plus "It resolves because it does not know which tension should remain active" (verbatim per the note; 21 words reproduced). Feature 3 [133]: four quoted words plus "Violence softens, sex goes vague, cruelty gets explained so the reader understands rather than feels it" (near-verbatim; about 21). Feature 7 [186]: "No Tuesday. No laundromat." plus the cough-drop sentence (about 14). Feature 9 [189]: eight quoted words plus "No verbal tics, dialect or pattern of evasion" (about 16). Feature 14 [181]: nine quoted words plus "of what is, older than law and time" (17, the exact continuation). Either paraphrase the tails or count them.
- `kept-ai.json` itself carries trueWordings over twelve words in six rows ([170] 25 words, [179] 19, [203] 18, [196] 16, [198] 16, [208] 16) and `partial-ai.json` in [143], [148], [160], [166], [167] and [85]. If the JSON travels with the dossier, trim there too.

## 5. Verdicts that look wrong on their face

Graded VERIFIED where the sweep's own rules make it PARTIAL or lower:
- [77], [79], [80], [81], [117], [132]: VERIFIED_VERBATIM, but the note says the quote was found in the PDF, the ar5iv render, or the full-text HTML, not at the cited URL (an abstract-only landing page). [13] was explicitly held to VERIFIED_SUBSTANCE for exactly this ("Not marked VERBATIM because the quote is absent from the URL actually cited"), and [15] to [20] were graded NOT_FOUND for it. Three standards for one situation. Fix: re-point the six URLs to the full-text page and keep VERBATIM; then regrade [15] to [20] and [24] against the same full texts.
- [140] VERIFIED_VERBATIM: the note says the quote sits in the deep-POV section "and is not the source's support for the claim". [102], same page, same shape, was regraded PARTIAL as a "QUOTE SPLICE". [140] should follow.
- [100] and [101] VERIFIED_SUBSTANCE: the trueWording the section quotes ("A novice author wouldn't repeatedly go for these sentence patterns"; "Alternating loquacious ponderous similes and tiny sentences...") comes from Makin's parody passage written in the AI voice to demonstrate the tells, per the notes. The section presents parody as Makin's observation. Cite his own-voice tell list instead, or mark the lines as demonstration text.
- [93] VERIFIED_VERBATIM with "the sensory-detail element is supported only indirectly ... rather than a stated rule". That is an unsupported limb; PARTIAL by the rule applied to [88] and [114].
- [141] VERIFIED_SUBSTANCE with the POV limb "which Vollmer attributes to Charlie Guo rather than observing himself". [94] and [95] went PARTIAL for the same attribution defect.
- [188]: "high school essay vibes" is Vollmer quoting a third party (AI for Lifelong Learners); the section attributes it to Vollmer. [231]: GPTZero's page attributes the quoted concession to "AI writing tools", so the section's "a detector vendor's blog: LLM triads are..." misframes an LLM self-description reported by the vendor. [196]: the "startling gentleness" line is machine-generated sample text credited to a forum user.

NOT_FOUND, CONTRADICTED or BLOCKED where a second route or a re-cut would land:
- [15] to [20] (Art or Artifice per-test rates and expert quotes): `arxiv.org/html/2309.14556v3`, Table 5 and the expert-explanation section; or the ACM DL CHI 2024 version via Crossref (doi 10.1145/3613904.3642731). The verifier already used the html route for [13] and [14].
- [24] (Ismayilzada deltas): the arXiv HTML full text of 2411.02316 or the ICCC 2025 proceedings PDF via OpenAlex.
- [72] (Mikros, Digital Scholarship in the Humanities, OUP 403): OpenAlex or Crossref on the DOI to find an OA location (Unpaywall), the author's institutional repository or Semantic Scholar PDF, archive.ph of the OUP page, or simply open the OUP page in the browser pane (Cloudflare blocks curl, not a real browser session).
- [187] (Vollmer "what machine prose never does"): the claim describes a text that is not this post. Search Vollmer's Substack archive for "falling flat" / "walks it back", and Laura Preston's n+1 essay, which Vollmer's note names; archive.ph for the Substack listing.
- [87] (Clarke via Vollmer): neil-clarke.com "A Concerning Trend" (2023-02-15) or its Wayback copy.
- [25] (Doshi and Hauser): re-cut the claim as "10.7% and 8.9% of the total range of similarity scores" and it verifies; then feature 25 stops resting on a press release.
- [30] (van Nuenen): only the emotion-word sign is wrong; every other limb verified. Re-cut without that limb and it supports features 10 and 19 (embedded to distanced narration under AI revision).
- [223] (SALT Ngram): the Ngram substance is on the page; the supplied quote belongs to a different point. Re-cut with a quote from the Ngram passage.
- [238] (Liang self-edit): the 68% to 28% figures are right; the prompt attribution is wrong. Re-cut naming the "advanced technical language" prompt.
- [60] (Pron vs Prompt): the clichés and learn-with-exposure limbs are verified; "moralising", "hollow endings" and "indistinguishable" are not. Re-cut to the two supported limbs or drop.
- [97] and [142] (Summer Engine): drop; the vendor's line is about hand-written dialogue.

Second verifier: the section states that no kept row carries a second verdict, and that the regrade flipped 68 of 68 rows it touched (all pre-selected for a suspected loose limb). That is a 100% hit rate on suspected rows and an unknown rate on the 173 unsuspected ones; the rows above ([93], [100], [101], [140], [141], [188], [231], plus the six URL-precision rows) were found by reading notes, not pages. A random 10% second pass over kept rows (17 rows, adversarial brief) is owed before the section is cited as verified.

## 6. Where the section contradicts itself

- Header: "three CONTRADICTED rows are named ... ([25], [97] and [142], [223], [238])" lists five indices.
- StoryScope's row count is given as "nine" (header, source-counting rule) and "13 rows across three angles" (source concentration); `kept-ai.json` holds 15 rows with the arXiv URL plus two Dramatica-hosted glosses whose source string says StoryScope ([147], [151]), so 15 or 17.
- The "Supported by N source documents, M rows" headers are miscounted by one in nine features (scripted recount against the citation list and deduplicated URLs): F6 says 17 docs / 20 rows, lists 19 rows over 18 documents; F7 says 14 rows, lists 15; F13 says 7 docs, has 6 (three Wikipedia rows are one page); F15 says 13 rows, lists 14; F16 says 8 docs, has 9 (Michel's Substack note and Counter Craft essay are different documents); F20 says 9 rows, lists 8; F22 says 5 docs, has 6; F23 says 14 rows, lists 15; F26 says 14 docs, has 15. Generate these headers from the JSON.
- The citation convention ("PARTIAL rows appear only for their verbatim quotation ... never for the limb the verifier rejected") is broken in feature 9, which cites [78]'s "32% of generations" (the rejected limb was that figure's missing qualifier), and stretched in feature 18 ([225]'s three figures), feature 23 ([65]'s task and scores), and feature 11 ([68]'s token band, [104]'s figures).
- Feature 12 bans fragments and one-line paragraphs on tropes.fyi, Jones and Negrek; Vollmer's tell #12 on the same page the section cites eleven times is "Hypotactic smoothness, no fragments" ("Their sentences resolve. Real prose misbehaves.", surfaced only in the [187] note). The corpus holds both "AI never writes fragments" and "AI writes fragments for manufactured emphasis" and the section marks neither; feature 11's metronome and feature 12's fragments are the same unmarked tension at a higher level.
- Feature 18 puts Makin [184] in the "it is a tell" camp and then says [184] reports the tell has drifted; [184]'s content ("less common than they were months ago") belongs in the against camp or in neither.
- Feature 2 (AI over-resolves: "the story seems to end, then it ends again") and feature 20 (Dramatron [81]: "The stories do not finish", generation loops) are both cited as support without marking that they point opposite ways; the likely resolution is model era (2022 versus 2026), which the section cannot state because it has no date column.
- Feature 15 flags [71] as "SINGLE SOURCE for noun density in the kept set" in the same paragraph that cites Reinhart [33] (partial, quote only) for "an informationally dense, noun-heavy style". Two sources, one partial, is the honest count.
- "Eight of the nine NOT_FOUND rows are URL-precision failures": [15] to [20] and [24] are seven; [60] and [187] are genuine misses.

## 7. Recommended next round

Round A, fix the record (no new sources):
1. Re-point [77], [79], [80], [81], [117], [132] to their full-text URLs; regrade [15] to [20] and [24] against `arxiv.org/html/2309.14556v3` and the 2411.02316 full text.
2. Re-cut and re-verify [25], [30], [223], [238] as above; re-cut [60] to its two supported limbs; drop [97], [142].
3. Regrade [93], [100], [101], [140], [141] with the rules already applied to [88], [94], [102], [114]; fix the attributions in [188], [196], [231].
4. Fetch the eleven secondhand primaries (Chiang x3, Clarke, Preston, Guo, Siam, Mollick, Goodspeed, Nostalgebraist, Williams/TNPS, Liang) and re-issue those claims against them.
5. Unblock [72] via OpenAlex/Unpaywall or the browser pane; find [187]'s true source or drop it.
6. Second-verify a random 17 of the 173 kept rows with an adversarial brief; report the flip rate.
7. Script the three checks that failed by hand: the "Supported by" headers from the JSON; a twelve-word check that fuzzy-matches each quotation's unquoted continuation against the source trueWording; a check that no PARTIAL index shares a sentence with a digit or percent sign.
8. Add a model-generation column to every row (model and date observed) and re-weight rules that rest only on pre-2024 observations.

Round B, new searches by angle:
1. Record register: Wikipedia AI Cleanup reports and the "Signs" page history; Brooks et al. 2024; Liang et al. 2024; Geng and Trotta 2024; any LLM-written gazetteer, local history or genealogy criticism.
2. Humour: Mirowski et al. 2024. Subtext: Subbiah et al. 2024; Ippolito et al. 2022; Chakrabarty et al. 2023 (emerging writers). Culture: Agarwal, Naaman and Vashistha 2025; Moon, Green and Kushlev 2024 (homogenisation perspective).
3. Steerability and mechanism: Kirk et al. 2024; Zhang et al. 2025 "Verbalized Sampling"; Lanchantin et al. 2025; Sharma et al. 2023 (sycophancy); Shumailov et al. 2024 (Nature, model collapse) as the sameness mechanism.
4. Games: CALYPSO (AIIDE 2023); Kreminski; Emily Short; Ubisoft Neo NPC at GDC 2024; Square Enix Portopia reception; Keywords Studios' 2024 AI game; tenfootpole, The Alexandrian and Sly Flourish on AI-written adventures; Xalavier Nelson Jr.
5. Verse: Köbis and Mossink 2021; Walsh, Preus and Gronski 2024; Walsh, Preus and Antoniak 2024.
6. Detection: Weber-Wulff et al. 2023; Dugan et al. 2023; Ippolito et al. 2020; the neurodivergent-writer false-positive reporting (2023 to 2024) that Anne R. Allen [227] gestures at.
7. Counter-cases: Winterson (Guardian, March 2025); Kudan (January 2024); Mark Lawrence's blind test (2023); Vara's "Ghosts" (2021); Sudowrite's Muse claims as the vendor pole.
8. Publishing primaries: Jane Friedman (August 2023); Authors Guild survey (2023); OneBookShelf's policy page; Clarkesworld "A Concerning Trend"; NPR 2023 Clarke interview; Hern's Guardian TechScape (May 2024).
9. Critics not yet sampled: Robin Sloan, John Scalzi, Chuck Wendig, Cory Doctorow, Tiffany Yates Martin, Victoria Strauss.
