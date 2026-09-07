# Completeness critic: sweep "ai" (round 2, against the 940-claim section)

Read: `section-ai.md` (955 lines, built 15:34 from the 14:54 merge), `kept-ai.json` (769 rows, every note; its md5 `fb106c70…` still matches the section header, so the section is current), `partial-ai.json` (144 rows), the 27 excluded rows in `state-ai.json` (state's md5 has moved since the build but its verdict tally is unchanged: 660 / 109 / 144 / 9 / 7 / 1 / 10), the six `find-ai-*.md` notes, and the round-1 `critic-ai.md` (00:55) so that the delta could be checked. Every count below is scripted against the JSON unless marked "by reading".

## 0. What round 1 asked for and what landed

- Landed: the record-register, steerability, games, peer-reviewed-absentee, counter-case and critics-direct angles; the eleven secondhand primaries; MODEL ERA lines; scripted "Supported by" headers (they now recount correctly, derivative glosses included); the in-quote twelve-word rule (0 violations in 889 quoted spans); the re-cuts of [25], [30], [223], [238]; [97]/[142] dropped; [93], [100], [101], [140], [141], [188], [196], [231] regraded PARTIAL; the five paraphrase tails paraphrased.
- Not landed: [15]–[20] and [24] are still NOT_FOUND on the abs URL although [13] and [14] were verified at the same paper's full text (see §5.A); the 42 URL-precision rows were downgraded to VERIFIED_SUBSTANCE rather than re-pointed; [72] is still BLOCKED after one Wayback attempt; [187] is still NOT_FOUND with no archive search; the random second pass over unsuspected kept rows was not run (the section confirms no `alt` field exists and that all 126 regrade pairs were pre-selected); the JSON's over-twelve-word trueWordings grew from 12 to 277.

## 1. Angles not run

- **The dossier's own register in the wild: worldbuilding communities and TTRPG setting/gazetteer prose.** Zero rows mention r/worldbuilding (its 2022–23 generated-content rules), World Anvil, Kanka, LegendKeeper, Obsidian Portal, a setting book, a sourcebook or a gazetteer entry. The nearest evidence is tenfootpole's module read-alouds and two Wikipedia settlement entries ([877], [879]). Run: r/worldbuilding and r/DnDBehindTheScreen AI rules and mod posts; World Anvil / Kanka / LegendKeeper blog and policy pages; DMs Guild and DriveThruRPG AI-written setting supplements and their one-star reviews; Rascal News, Polygon and Dicebreaker coverage of AI text in TTRPG publishing (2023–2026); reviewers who have read a generated setting book, not only a generated module.
- **Gazetteer, travel and local-history prose, measured or reviewed.** Only Euronews [331] and Vice [332] touch place prose, both as incidents. Missing: the NYT investigation of AI-written travel guidebooks on Amazon (Kugel and Hiltner, August 2023, with Originality.ai testing and a sample guidebook's prose); Wikivoyage's AI-content policy and cleanup discussions; Slate on Arcadia local-history books (the record-register finder noted it and did not fetch); Lonely Planet or TripAdvisor generated-summary reception.
- **Biographical record in the wild.** Two genealogy practitioners ([273], [274], [333]–[335]) carry the whole biographical register. Missing: AI obituary spam (The Verge, Mia Sato, February 2024; Wired's follow-up); Judy G. Russell (The Legal Genealogist) on ChatGPT citations; WikiTree's and FamilySearch's AI policies; Find a Grave generated-biography complaints.
- **Historical fact under measurement.** No row tests a model on dates or events. Missing: the HiST-LLM / Seshat Global History Databank benchmark (del Rio-Chanona, Turchin et al., NeurIPS 2024 Datasets and Benchmarks; reported January 2025 with GPT-4 Turbo near 46%); the ASIC summarisation trial's primary (the Senate answer to questions on notice on aph.gov.au) instead of the paywalled Crikey headline [336]; the ABC article via Wayback (the finder's URL landed on a weather story).
- **The decoding literature behind the metronome and the loop.** Holtzman et al. 2020 ("The Curious Case of Neural Text Degeneration") is cited inside two verifier notes ([343], [512]) and never as a row, yet it is the canonical measurement that human text is bursty in surprisal and machine text flat, the theoretical floor of features 5, 11 and 17. Also absent: Meister, Pimentel, Wiher and Cotterell, "Locally Typical Sampling" (TACL 2023); Nguyen et al., "Turning Up the Heat: Min-p Sampling" (ICLR 2025), a peer-reviewed claim that high temperature can be made coherent, which feature 31's temperature verdict must answer; Sam Paech's slop-forensics / antislop sampler, present only as a forum relay in partial row [197]; Mirostat; contrastive search.
- **A second, independent record-register tell catalogue.** Feature 29 and every [R] tag in Parts A and B that cites only the guide rest on one Wikipedia page family (Signs of AI writing, its talk page, the Cleanup guide: 43 + rows). Missing: Pangram Labs' 2025 Wikipedia analysis; the CSD G15 speedy-deletion criterion and its August 2025 RfC (the community's operative tell list, written to be enforced); the French Wikipedia Observatoire des IA and the German counterpart project pages; the Cornell Tech source-quality analysis of Grokipedia (Triedman et al., November 2025) as a second Grokipedia source beside Yasseri.
- **Industry primaries still absent.** NaNoWriMo's September 2024 AI statement and March 2025 shutdown; the WGGB games-writers AI survey (2024); Inkle's Jon Ingold on LLMs and narrative design; Brandon Sanderson's statements; IFComp's AI policy.
- **Emily Short.** Her LLM views exist in audio only (Game Design Roundtable #308). Route: the episode's RSS mp3 through a local whisper transcript; nothing else will recover it.

## 2. Well-known critics and studies absent, by name

Peer-reviewed or measured:
- Holtzman, Buys, Du, Forbes, Choi 2020 (ICLR), as above.
- Meister et al. 2023 (TACL), Nguyen et al. 2025 (ICLR), as above.
- Herbold, Hautli-Janisz, Heuer, Kikteva, Trautsch 2023, "A large-scale comparison of human-written versus ChatGPT-generated essays" (Scientific Reports): teachers rated ChatGPT essays higher than students', and the paper measures nominal density and sentence complexity, so it is both a lay-preference result in an expository register (feature 23) and a measurement for features 11 and 15.
- Guo et al. 2023, "How Close is ChatGPT to Human Experts?" (HC3): the first published tell list (less emotion, fewer colloquialisms, more formal and objective, fewer typos, "logical structure"), the measured basis feature 19 lacks.
- Jentzsch and Kersting 2023, "ChatGPT is fun, but it is not funny!": 90% of 1,008 requested jokes were 25 jokes, the sharpest sameness measurement in the literature, absent from features 6, 17 and 22.
- Naous, Ryan, Ritter, Xu 2024, "Having Beer after Prayer? Measuring Cultural Bias in LLMs" (ACL): Western defaults measured in generated stories with Arabic names; feature 6's culture axis rests on Agarwal and Rettberg alone.
- Mohammadi 2024, "Creativity Has Left the Chat: The Price of Debiasing Language Models": entropy and diversity loss under RLHF, complementary to Kirk in feature 33.
- Yakura et al. 2024, "Empirical evidence of Large Language Model's influence on human spoken communication": the Max Planck YouTube study, present only as Kriss's relay [916].
- Chambers and Kelley 2025 (autistic writing misclassified as AI): named by a verifier inside the CONTRADICTED verdict on [550], fetched by no finder, and now asserted as fact in feature 24. Verify by Crossref on DOI 10.1007/978-3-031-98420-4_7 and fetch it, or cut the sentence.
- Geng and Trotta 2025 (arXiv 2502.09606), the "delve fell after publicity" primary the record-register finder listed as not fetched.

Critics and editors:
- Gwern Branwen: "GPT-3 Creative Fiction" (2020) and his later commentary on RLHF degrading poetry and on benchmarking LLM diversity; the most-cited practitioner on base-versus-aligned creative writing and absent from Part E entirely.
- Ted Underwood's essays on LLMs and narrative (2023–2025).
- Stephen Marche, "Death of an Author" (2023): a critic who shipped an AI-written novella and argued method; the strongest counter-case not in the corpus (the present counter-cases are Winterson, Qudan, Lawrence, Vara).
- Max Read, "Drowning in Slop" (New York, September 2024); Erik Hoel's 2024 New York Times op-ed on generated garbage; Ian Bogost in The Atlantic (2022–2023).
- Henry Farrell and Cosma Shalizi, and Alison Gopnik, on LLMs as cultural technology: the mechanism feature 10 currently takes from Bender alone.
- Jon Ingold (Inkle); Sean Michaels (a co-written novel, counter-case); Salman Rushdie's 2023 remark on his own style (minor).

## 3. Claims resting on one source (beyond those the section already flags)

- Feature 8's banned mood list (ache, hollow, tether, linger, fragile, fractured, ember, bloom, cradle, ruin, veil, threadbare) is Vollmer [122] alone; the spectral set is Kriss alone ([898], [899]); only echo and whisper have a measurement ([496]). The rule bans twenty-odd words on two essays and one poetry study.
- Feature 13's cognition claim (the negated concept is retained) is Gonzales [113] citing one 2003 study; not flagged this draft.
- Feature 14's tricolon rate (7.13 vs 3.73) is Bakhshi [73], an arXiv preprint whose id (2604.19768) and stamp (27 Mar 2026) disagree; check.
- Feature 15's participial-clause rate is Reinhart [32] alone (flagged); the copula-avoidance measurement is [888], the guide relaying Geng and Trotta, whose partial [309] shows the 10–17% figures are simulation results and only the ">10%" drop is measured.
- Feature 23's "heavy users detect" is one paper counted twice ([64] and the guide's relay [895]).
- Feature 26: barks [209]/[863]–[866] one document (flagged); "two narrative designers, three months" Thompson [420] alone; Keywords' 400 tools / seven studios one corporate report echoed by every outlet.
- Feature 27: the NeurIPS citation taxonomy is Ansari [326]–[329], a single-author 2026 preprint.
- Feature 28: the "vague connection" sign is the guide at two revisions ([292], [889]) counted as two rows; no second document.
- Feature 29: 44 rows, one page family.
- Feature 30: Grokipedia is Yasseri alone; archival description is one paper; ASIC is one paywalled headline.
- Feature 2's double ending: Witte's preprint via Rettberg [84], not peer-reviewed, and the preprint itself was never fetched (flagged single-source, not flagged unfetched).
- Feature 20's opening-formula limb: Hockaday [165], one Lawrence commenter [561], Beguš [48].

## 4. Copyright

- Inside quotation marks the twelve-word rule holds everywhere (scripted; 0 of 889 spans). CONFIRMED.
- Outside the marks it does not: 30 kept rows and 16 partial rows have their trueWording reproduced in the section as runs of 13 to 18 consecutive words, quoted or unquoted, in defiance of the header's own rule that a `fullSentence` row "never has its trueWording copied". Longest: [882] 18 words, [712] 17, [808] 16, [658] 15, [767] 15, partial [10] 16, partial [358] 15, partial [489] 15; also [147], [474], [516], [557], [583], [590], [598], [611], [618], [623], [628], [629], [683], [711], [742], [807], [837], [858], [884], and partial [40], [59], [140], [143], [148], [160], [253], [297], [309], [843], [885], [690]. Several are strings of figures where the exposure is nil ([712], [611], [618]); [583], [658], [690], [882], [884], [767] are authorial prose. Add a fuzzy 13-gram check to `build-section.mjs` (round 1 asked for it; the in-quote check landed, the continuation check did not).
- `kept-ai.json` now carries 258 trueWordings over twelve words (all flagged `fullSentence`) and `partial-ai.json` 19; if either JSON travels with the dossier, trim there.
- The PARTIAL table marks every long quotation "(trimmed)". CONFIRMED.

## 5. Verdicts that look wrong on their face

- **A. Three standards for one URL, still.** [13] and [14] are VERIFIED_SUBSTANCE because the verifier fetched `arxiv.org/html/2309.14556v3`; [15]–[20] are NOT_FOUND on the identical abs URL because theirs did not. [14]'s note says so in terms: "Judged against the abs page alone this would be NOT_FOUND". Regrade [15]–[20] at the full text (Table 5 and the expert-explanation section) and [24] at the 2411.02316 HTML, or downgrade [13] and [14]. Separately, 42 rows ([79], [80], [81], [117], [132], [237], [504], [521]–[537], [543], [545], [546] among them) hold VERIFIED_SUBSTANCE for no reason but URL precision; round 1 asked that the URL field be re-pointed and VERBATIM restored, and the section instead built a paragraph explaining the downgrade.
- **B. Relays graded VERIFIED_VERBATIM and counted as support** where the primary is one fetch away or already in the corpus: [815], [816] (X posts, reachable via xcancel or archive.ph); [913] (Porter and Machery, already [596]–[606]); [916] (Yakura 2024); [906] (Kobak, already [311]); [888] (Geng and Trotta, already [310]); [895] (Russell, Karpinska and Iyyer, already [64]); [594], [595] (Gizmodo via EN World; the OneBookShelf July 2023 policy is on Wayback under help.drivethrurpg.com or in the publisher newsletter); [870], [871]. Cite the primaries and retire the relays from the headers.
- **C. Non-LLM rows counted in "verified rows supporting"**: Preston's keyword chatbot Brenda [641]–[646] (five of feature 19's 27 rows; [645] in feature 7), Starfield's procedural cities [865] (feature 26), BioWare's pre-LLM procedural quests [870] (feature 10). The text labels them; the counts do not.
- **D. Reader comments counted as support**: [561], [562], [683], [684], [687]; feature 23's header carries seven relay or reader rows of 83. **E. Vendor copy as evidence of the default's defects**: [569], [572]–[575] and partial [570]; feature 11's "[572] … the vendor conceding the default lacks it" is an inference from a feature list.
- **F. [936]** Williams' "fifteen to twenty-five words" is cited as support for feature 11 in the same breath as "a journalist's figure with no cited measurement"; move it to quote-only.
- **G. MODEL ERA dated by fetch date.** Feature 11's "Sudowrite page September 2026" comes from a `date` field reading "page fetched 2026-09-06"; the counter-cases finder calls it a January 2025 page. [895] likewise. This is the exact error class the MODEL ERA column exists to prevent.
- **H. [550]** (Chambers and Kelley) as above: a verifier's discovery, unfetched, asserted as fact.
- **I. [84]** Witte: relay, not peer-reviewed, single-source, and the preprint was never opened although Rettberg links it.
- **J. NOT_FOUND / BLOCKED with a second route untried.** [72] Mikros: OpenAlex or Crossref on the DOI for an Unpaywall OA location, Semantic Scholar's PDF, the author's repository, or the browser pane (Cloudflare blocks curl, not a session); one Wayback attempt is not a second route. [187] Vollmer: archive.ph and the Substack archive; the claimed text ("digresses, walks it back, risks a joke") may belong to Preston's n+1 essay already fetched at [641]–[646], so check there first. Sam Liberty (Medium, BLOCKED in the critics-direct note): freedium.cfd, archive.ph, a Wayback `id_` raw capture. 404 Media librarians [267] (member-gated): archive.ph. Crikey [336]: archive.ph or the aph.gov.au primary. PC Gamer's NEO NPC hands-on: Wayback CDX on pcgamer.com for March 2024.
- **K. SKIPPED_TRIAGE misfires.** Ten rows were skipped because their feature "already had three sources", keyed on count rather than on what the rule depends on: [881] (the Challenges-section sign) is the only support for feature 29's ban on a Challenges paragraph besides [289]; [890] and [891] would make feature 13's Grok note citable; [591] (Hern's both-sides tell) is a distinct tell no verified row carries. Verify those four. This is the same failure the leguin and hobb critics named: triage keyed on labels, not on the section's dependence.
- **L. [60]** is listed in the header among "five excluded rows cited on the supported limb" and in the coverage note as "cited nowhere above". Re-cut it to its two supported limbs and cite it, or strike it from the header.
- Spot check, by reading: every quotation the section prints beside a VERIFIED_SUBSTANCE row whose supplied quote was not on the page ([48], [106], [112], [119], [125], [128], [130], [139], [173], [176], [184], [186], [213], [248], [279]) is the verifier's corrected trueWording, not the rejected wording. CONFIRMED.

## 6. Where the section contradicts itself

- Headline: "Every source in Parts A to C … not one of them measured the archival, chronicle or encyclopedic register", followed by thirteen Part A–C features marked [R] on record-register rows ([878], [286], [173], [896], [802], [340]…). The intended sentence is "no fiction source".
- Feature 1: "the only Part A feature with a direct record-register counterpart"; feature 7 is [R] on five guide rows and feature 4 points to [292]/[889].
- Feature 15: "[126] SINGLE SOURCE among fiction critics for copula avoidance"; [126] is a Wikipedia-guide row (the Harian Metro example), not a fiction critic.
- Feature 20 withdraws the 2019–2022 memory-collapse rows ("windows that no longer exist") and cites [81], [437], [441], [471] as live support in the same feature; feature 2 resolves the same rows by era.
- Feature 11 borrows its [R] from [313] Huang and [920] Yasseri, which measure sentence length and reading grade, not length variance; the metronome is a variance claim and has no record-register measurement.
- Feature 23 counts [64] (1 of 300) and [895] (about ninety per cent) as two sources; they are one paper with two figures that do not agree as stated.
- Feature 29's "44 verified rows across 4 source documents" and the register map's "Part D … the only measured evidence in its own register": the guide is a descriptive catalogue by its own words ([178], [233]); the measurements in Part D are Huang, Brooks, Yasseri, STORM, FActScore and the archival paper, and none of those measures the guide's tells.
- Feature 28 presents [292] and [889] as two rows of support; they are one page at two revisions.

## 7. Recommended next round

Round A, fix the record (no new sources):
1. Regrade [15]–[20] and [24] at the full texts; re-point the 42 URL-precision rows and restore VERBATIM.
2. Replace relays with primaries: fetch Yakura 2024, the Siam and Mollick posts, the OneBookShelf 2023 policy; link [888]→[310], [895]→[64], [913]→[596], [906]→[311]; drop relays, readers, vendors and non-LLM rows from the header counts or print the split.
3. Verify Chambers and Kelley by DOI; open Witte's preprint; verify [881], [890], [891], [591].
4. Fix the headline, feature 1, [126], [60] and feature 20 contradictions; date vendor pages by page date; check Bakhshi's id against its stamp.
5. Add the 13-gram continuation check to the build script; trim the 46 runs; decide whether the JSON's 277 long strings travel.
6. Unblock [72], [187], Liberty, the 404 Media, Crikey and ABC pages by the routes in §5.J.
7. Run the owed random second pass: 17 or more unsuspected kept rows, adversarial brief, flip rate reported. Until it runs, the 100% flip rate on suspected rows says nothing about the other 643.

Round B, new searches by angle (named targets first, routes in brackets):
1. Worldbuilding and TTRPG gazetteer register: r/worldbuilding rules and mod posts [old.reddit, archive.ph]; World Anvil, Kanka, LegendKeeper blogs and policies; DMs Guild / DriveThruRPG AI setting supplements and reviews; Rascal News, Polygon, Dicebreaker 2023–2026; a reviewer of a generated setting book.
2. Gazetteer and biography in the wild: NYT AI guidebooks (August 2023) [archive.ph]; Wikivoyage AI policy; The Verge and Wired on obituary spam (2024); Judy G. Russell; WikiTree and FamilySearch policies; Slate on Arcadia.
3. Historical accuracy: HiST-LLM (NeurIPS 2024 D&B, arXiv) ; ASIC primary [aph.gov.au]; ABC article [Wayback].
4. Decoding and mechanism: Holtzman 2020; Meister 2023; Nguyen 2025 min-p; Paech's slop-forensics and antislop primaries [GitHub, EQ-Bench]; Gwern.
5. Record-register catalogues: Pangram's Wikipedia report; the CSD G15 RfC; fr and de Wikipedia project pages; Cornell Tech on Grokipedia; Geng and Trotta 2502.09606 [arXiv HTML].
6. Peer-reviewed absentees: Herbold 2023; HC3 2023; Jentzsch and Kersting 2023; Naous 2024; Mohammadi 2024; Yakura 2024 [arXiv HTML; OpenAlex for DOIs].
7. Critics and counter-cases: Gwern; Underwood; Marche; Max Read; Hoel; Bogost; Farrell and Shalizi; Ingold; Sanderson; NaNoWriMo; WGGB.
8. Emily Short by transcript [RSS mp3, local whisper].

Stopping-rule note: angles 1 and 2 are the register the dossier writes and have never been searched at all, so they cannot be "dry" yet; angles 4 to 7 are named-target fetches that either land or do not in one pass.
