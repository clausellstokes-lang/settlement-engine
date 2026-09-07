# RECEIPT — S6B-LEGUIN-FINGERPRINT — **COMPLETE**
Seat: Opus 5 — Fable-unvalidated · Lane: S6B-LEGUIN-FINGERPRINT · Chair: Fable 5.1
Started 2026-09-06 (kit-only lane; no git tree touched, no vitest, no npm, no subagents).

STATUS: COMPLETE (opened PARTIAL; updated after every fetch and every measurement).

## Plan
1. Re-derive the brief's premises (raw/ empty; fingerprint.mjs shape; existing JSON labels).
2. Fetch Le Guin nonfiction (her own words) — robots.txt checked per host first.
3. Fetch lawful fiction excerpts, or record the shortfall as the finding.
4. Fingerprint: leguin-nonfiction, leguin-fiction(-thin), leguin-all.
5. Append PROVENANCE rows; comparison table; section-claim adjudication.

## Log
- (pending)

## ⛔ ROBOTS REFUSALS — two of the brief's three named sources bar Anthropic agents by name
Checked before any content fetch. Both lines are verbatim from the live files.

**1. `ursulakleguin.com` / `www.ursulakleguin.com` (the brief's PRIMARY nonfiction source) — REFUSED.**
`https://www.ursulakleguin.com/robots.txt` (http=200, 1525 B, curl exit 0). The first stanza is a
Squarespace AI-opt-out group listing 27 user-agents, **including `anthropic-ai` (line 7) and
`ClaudeBot` (line 11)**, terminated by:
```
User-agent: anthropic-ai
...
User-agent: ClaudeBot
...
Disallow: /
```
The disallow covers the WHOLE site — the essays and the blog archive alike. The estate has opted
out of Anthropic crawlers by name. I did not fetch one byte of page content from this host.

**2. `www.arts.gov` (the brief's NEA Big Read Earthsea source) — REFUSED.**
`https://www.arts.gov/robots.txt` (http=200, 4558 B, curl exit 0), lines 133-137:
```
# AI Bots
User-agent: ChatGPT-User
Disallow: /
User-agent: ClaudeBot
Disallow: /
```
Also `www.neabigread.org` does not resolve (curl exit 6, NXDOMAIN) — the Big Read moved onto
arts.gov, which is the host that bars us. No content fetched.

**3. `www.theparisreview.org` — robots PERMITS** (http=200, 442 B). `User-Agent: *` disallows only
wp-admin/login/plugins/cache/themes/trackback/tag/author/category and `/search`; `/interviews/` is
not disallowed. Separate stanzas disallow `Google-Extended` and `GPTBot` only — no Anthropic agent
named. The kit's earlier capture `sweep/parisreview-leguin.txt` (797 B) is NOT the interview: it is
a Cloudflare "Sorry, you have been blocked" interstitial. Retry recorded below.

**4. `bookviewcafe.com` — robots PERMITS** (http=200, 319 B). Only wc-logs, woocommerce uploads,
add-to-cart query strings and `/wp-admin/` are disallowed; no AI stanza. Book View Cafe is the
author-run co-operative that hosted Le Guin's own blog, so this is her own written prose.

**5. `www.nationalbook.org` — robots PERMITS** (http=200, 412 B). No AI stanza; only wpforms
uploads, `/?s=`, `/search/` and an `AdsBot` block.

## Premise corrections to the brief (re-derived, not assumed)
- Brief: "`K/primary/raw/` is EMPTY". **CONFIRMED** — `ls` shows only `.`/`..`.
- Brief implies `PROVENANCE.md`'s cut scripts survive. **CONTRADICTED**: `primary/*.py` →
  "no matches found"; `cut_html.py`, `cut_pdf.py`, `pdf2txt.py`, `table.mjs` are all gone with the
  reboot. Only `PROVENANCE.md` and the ten fingerprint JSONs remain. I re-wrote an equivalent
  extractor under `s6b-scratch/` rather than re-plant scripts in `primary/`.
- The existing JSONs' `files` arrays point at a DEAD scratchpad
  (`.../d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/prose-research/primary/raw/...`), which
  independently confirms the raw loss and dates it to the 09-05 session.
- `sweep/leguin1973.txt` (5,106 w) is "From Elfland to Poughkeepsie", her 1973 essay — but it is a
  CONTAMINATED sample for a fingerprint: the essay quotes Dunsany, Eddison, Tolkien and Kurtz at
  length as specimens ("let us read a little fantasy"), so a naive fingerprint of it measures four
  other authors as well. Its own provenance line is also absent from any provenance file. Handling
  recorded below.

## Substitute-source policy (recorded because it departs from the brief's named sources)
Both named nonfiction sources are unusable (ursulakleguin.com robots-refused by name; Paris Review
WAF-blocked, below). I substituted only hosts that (a) serve a robots.txt with no Anthropic/Claude
stanza, and (b) published Le Guin's prose themselves with permission — LitHub and Electric
Literature (publisher-sanctioned book excerpts, her own newsletter/blog pieces, and a reprinted
interview) — plus, for fiction, exactly the .edu-course-page class the brief blessed. No document
locker, no whole-book site, no scan mirror.

## Fetch log (every exit and byte count captured in-shell)
| # | file (under primary/raw/) | URL | http | bytes | curl exit |
|---|---|---|---|---|---|
| F1 | leguin-lithub-a-writing-lesson.html | lithub.com/a-writing-lesson-from-ursula-k-leguin/ | 200 | 27,693 | 0 |
| F2 | leguin-lithub-how-to-become-a-writer.html | lithub.com/ursula-k-le-guin-on-how-to-become-a-writer/ | 200 | 28,120 | 0 |
| F3 | leguin-lithub-racism-anarchy.html | lithub.com/ursula-k-le-guin-on-racism-anarchy-and-hearing-her-characters-speak/ | 200 | 32,538 | 0 |
| F4 | leguin-lithub-best-life-advice.html | lithub.com/ursula-k-le-guins-best-life-advice/ | 200 | 30,528 | 0 |
| F5 | leguin-el-utopia.html | electricliterature.com/ursula-k-le-guin-explains-how-to-build-a-new-kind-of-utopia/ | 200 | 34,910 | 0 |
| F6 | leguin-el-amazon.html | electricliterature.com/ursula-k-le-guin-i-keep-asking-you-not-to-buy-books-from-amazon/ | 200 | 33,277 | 0 |
| F7 | leguin-el-author-index.html | electricliterature.com/el-author/ursula-le-guin/ | 200 | 23,246 | 0 |
| F8 | leguin-omelas-ucdavis.pdf | cs.ucdavis.edu/~koehl/Teaching/ECS088/PDF_files/Omelas.pdf | 200 | 58,197 | 0 |
| F9 | leguin-course-ecs088-index.html | cs.ucdavis.edu/~koehl/Teaching/ECS088/index.html | 200 | 4,692 | 0 |

All fetches used a 10 s inter-request delay on lithub.com (its robots states `crawl-delay: 10`).

### Failed / blocked fetches
- `www.theparisreview.org/interviews/6253/the-art-of-fiction-no-221-ursula-k-le-guin` — **http=403,
  1,750 B, curl exit 0**; body `<title>Attention Required! | Cloudflare</title>`. robots permitted;
  the WAF does not. Same wall the 09-05 lane hit. No interview text obtained.
- `w3.ric.edu/faculty/rpotter/temp/waaaod.pdf` ("Why Are Americans Afraid of Dragons?") — the host
  refuses the connection: `curl: (52) Empty reply from server` on both https and http for
  `/robots.txt`. Not fetched (robots could not even be read, so the path could not be cleared).
- `bookviewcafe.com/blog/ursula-k-le-guins-blog/` — **http=404**. BVC's robots permits and BVC was
  the original home of her blog, but the posts are gone from that host; its sitemap holds 1,316
  posts of which the 14 matching "guin"/"ursula" are BVC news items about her, not her prose.
- `storyoftheweek.loa.org` sitemap holds no Le Guin entry (1 loc, unrelated).

### Verified as a genuine course reading, not a mirror (brief's explicit requirement)
`https://www.cs.ucdavis.edu/~koehl/Teaching/ECS088/index.html` is the syllabus of **UC Davis
ECS 088, "Ethics of Technology: Fall 2025", Prof. Patrice Koehl**, with Home / Lectures / Term
paper / **Reader** navigation; the Omelas PDF sits in that course's own `PDF_files/` directory.
Host is `.edu`; `cs.ucdavis.edu/robots.txt` (http=200, 119 B) disallows only `/wp-admin/`.
The PDF's own header credits *The Wind's Twelve Quarters: Short Stories* by Ursula Le Guin.

### Rejected without fetching (document lockers / scan mirrors, per the brief's law)
`scribd.com`, `pdfcoffee.com`, `are.na`, `monoskop.org`, `coursehero.com`, `academia.edu`,
`researchgate.net`, `docs.google.com` copies of "The Carrier Bag Theory of Fiction",
"She Unnames Them" and Omelas — none is a publisher- or course-sanctioned page.
`shsdavisapes.pbworks.com` (Omelas) — a wiki host, not `.edu`.

## Corpus build (all cuts printed at cut time; scripts in `s6b-scratch/`)
`cut_html.py` (re-written to the lost `primary/cut_html.py` contract) + `build_corpora.py`
(per-source keep-lists, so quoted specimens by other authors never enter a Le Guin column) +
`pdf2txt.py` (pypdf 6.14.2 — `pdftotext` is still absent, same deviation PROVENANCE.md records).

| source | paras in→kept | words in→kept | what was cut |
|---|---|---|---|
| lithub *Steering the Craft* ch.1 | 32→22 | 2,542→1,301 | **7 specimen blocks quoted from Kipling, Twain, Hurston and Molly Gloss (1,095 w)**, LitHub frame, bio, affiliate line |
| lithub "How to Become a Writer" | 23→19 | 1,528→1,383 | newsletter line, a Tolstoy quotation, bio, affiliate |
| lithub "Who Cares About the Great American Novel" | 22→16 | 1,234→1,020 | LitHub frame, a Mohsin Hamid quotation, a duplicated pull-quote, credit, bio, affiliate |
| EL "…How to Build a New Kind of Utopia" | 21→19 | 845→791 | two newsletter promos |
| EL "I Keep Asking You Not to Buy Books from Amazon" | 11→5 | 505→281 | EL editor's bio ×2, EL commentary, link line, promos |
| lithub / Structo interview | 96→44 | 4,117→3,063 | every `EM:` question, LitHub frame, interviewer intro and bio, a stage-direction paragraph, affiliate |
| lithub / Tin House *Conversations on Writing* | 69→30 | 4,062→1,874 | every `DN:` question, Naimon's 6-paragraph intro, an Earthsea epigraph poem, 3 duplicated pull-quotes, an unlabelled DN continuation, credit, bio, affiliate |
| ucdavis Omelas PDF | 195 lines→16 paras | 2,848→2,822 | 4 page markers, 3 title/credit lines |

A further **20 editorial bracket spans** (`[Laughs]`, `[Pause]`, `[Both laugh.]`, glosses) were
stripped from the interview text — those are the transcriber's words, not hers.

**Words kept per column: nonfiction 9,670 (written 4,776 + spoken 4,894); fiction 2,822.**
Both clear the brief's floors (≥8,000 nonfiction; ≥2,500 fiction), so the `-thin` label is NOT used.
Because 4,894 of the 9,670 nonfiction words are *transcribed speech*, I also fingerprinted the two
halves separately — a written/spoken mixture is a register mixture, and the section's craft rules
are claims about written prose.

## Predictions written BEFORE the instrument ran (preamble law)
- `leguin-nonfiction` wordsPerSentence mean 16–20, sd 11–15, p50 14–18.
- written half longer than spoken half by ≥ 3 words/sentence.
- `leguin-fiction` (Omelas) mean 21–26, semicolonRate the highest of any Le Guin column.
- Le Guin's mean below tolkien-plain's 22.5 in every column except possibly fiction.

## Fingerprints written (all five, `node ../fingerprint.mjs` run from `primary/`, exit 0 each)
| JSON (in `prose-research/primary/`) | paragraphs | **sentences** | words in |
|---|---|---|---|
| `leguin-nonfiction.fingerprint.json` | 153 | **632** | 9,670 |
| `leguin-nonfiction-written.fingerprint.json` (diagnostic) | 81 | **281** | 4,776 |
| `leguin-nonfiction-spoken.fingerprint.json` (diagnostic) | 72 | **351** | 4,894 |
| `leguin-fiction.fingerprint.json` | 16 | **162** | 2,822 |
| `leguin-all.fingerprint.json` | 169 | **794** | 12,492 |

The `-thin` label was NOT needed: 2,822 fiction words clears the brief's 2,500 floor.

## Prediction scorecard (predictions above were written before the instrument ran)
| prediction | outcome |
|---|---|
| nonfiction mean 16–20 | **MISS — 15.3**, below the band |
| nonfiction sd 11–15 | HIT — 11.1 |
| nonfiction p50 14–18 | **MISS — 12**, below the band |
| written half ≥ 3 w/sentence longer than spoken | HIT — 17.0 vs 13.9 (3.1) |
| fiction mean 21–26 | **MISS — 17.4**, well below the band |
| fiction semicolonRate the highest Le Guin column | HIT — 0.0864 vs written 0.0676 |
| every Le Guin column below tolkien-plain's 22.5 | HIT — highest Le Guin column is 17.4 |
Three of seven predictions missed, all in the same direction: **I expected her sentences to be
longer than they are.** The chair should treat the shortness figure as the lane's least-anticipated
result, not as a rounding of a prior.

## COMPARISON TABLE (Le Guin against every existing column and the CONTROL)
| metric | leguin-nonfiction | leguin-nonfiction-written | leguin-nonfiction-spoken | leguin-fiction | leguin-all | tolkien-plain | tolkien-elevated | martin-narrative | martin-chronicle | dnd-flavor | dnd-rules | estate-state |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| sentences | 632 | 281 | 351 | 162 | 794 | 200 | 623 | 409 | 479 | 610 | 1141 | 2914 |
| wps mean | 15.3 | 17 | 13.9 | 17.4 | 15.7 | 22.5 | 24.2 | 13.8 | 25.9 | 18.8 | 18.4 | 16.7 |
| wps sd | 11.1 | 11.9 | 10.3 | 13 | 11.6 | 15.4 | 16 | 9.3 | 12.7 | 8.8 | 8.9 | 7.2 |
| wps p50 | 12 | 14 | 11 | 13 | 12 | 20 | 21 | 11 | 25 | 18 | 17 | 17 |
| wps p90 | 31 | 33 | 29 | 32 | 31 | 43 | 46 | 26 | 43 | 30 | 31 | 26 |
| shareUnder8 | 0.2896 | 0.2349 | 0.3333 | 0.2407 | 0.2796 | 0.145 | 0.1027 | 0.3007 | 0.0292 | 0.0787 | 0.0675 | 0.1301 |
| shareOver30 | 0.106 | 0.121 | 0.094 | 0.1296 | 0.1108 | 0.27 | 0.2809 | 0.0489 | 0.3382 | 0.0885 | 0.1017 | 0.0206 |
| neighbourVar | 0.74 | 0.708 | 0.771 | 0.805 | 0.755 | 0.733 | 0.646 | 0.593 | 0.508 | 0.495 | 0.52 | 0.399 |
| emDash | 0.0744 | 0.1032 | 0.0513 | 0.0062 | 0.0605 | 0.015 | 0.0482 | 0 | 0.0063 | 0.0377 | 0.0254 | 0 |
| semicolon | 0.0348 | 0.0676 | 0.0085 | 0.0864 | 0.0453 | 0.06 | 0.122 | 0.0098 | 0.0355 | 0.0148 | 0.0114 | 0.1325 |
| colon | 0.0301 | 0.0569 | 0.0085 | 0.0432 | 0.0327 | 0.125 | 0.1252 | 0 | 0.0084 | 0.0262 | 0.0272 | 0.0559 |
| antithesis | 0.0127 | 0.0178 | 0.0085 | 0.037 | 0.0176 | 0.03 | 0.0401 | 0.0171 | 0.0167 | 0.0131 | 0.0105 | 0.1088 |
| triad | 0.057 | 0.0747 | 0.0427 | 0.0617 | 0.0579 | 0.125 | 0.1091 | 0.0465 | 0.2129 | 0.1443 | 0.0447 | 0.0089 |
| participialOpener | 0.0142 | 0.0249 | 0.0057 | 0 | 0.0113 | 0.005 | 0.008 | 0.0024 | 0.0084 | 0.0148 | 0.0342 | 0.0117 |
| doubledAdj | 0.0174 | 0.032 | 0.0057 | 0.0556 | 0.0252 | 0.045 | 0.0417 | 0.0122 | 0.023 | 0.041 | 0.0131 | 0.0144 |
| adverbs/sent | 0.231 | 0.246 | 0.219 | 0.16 | 0.217 | 0.325 | 0.392 | 0.059 | 0.28 | 0.228 | 0.14 | 0.162 |
| abstractCloser | 0.0459 | 0.0534 | 0.0399 | 0.0432 | 0.0453 | 0.045 | 0.0578 | 0.0122 | 0.023 | 0.077 | 0.0876 | 0.0439 |
| runs3SameBand | 0.1788 | 0.21 | 0.1538 | 0.1543 | 0.1738 | 0.155 | 0.199 | 0.2543 | 0.2839 | 0.2705 | 0.3392 | 0.3202 |

| corpus | top 5 openers | top 5 closers |
|---|---|---|
| leguin-nonfiction | i 72, the 40, and 34, it 28, it’s 28 | it 33, that 10, book 7, me 7, one 7 |
| leguin-nonfiction-written | the 24, but 13, i 13, and 11, you 10 | it 17, writer 5, one 4, truth 4, writing 3 |
| leguin-nonfiction-spoken | i 59, it’s 24, and 23, it 19, the 16 | it 16, that 9, so 6, me 6, way 5 |
| leguin-fiction | they 22, the 21, it 15, but 11, i 9 | omelas 5, joy 4, all 4, it 3, there 3 |
| leguin-all | i 81, the 61, it 43, but 37, they 35 | it 36, that 10, book 7, me 7, one 7 |
| tolkien-plain | i 43, the 12, but 12, we 12, and 7 | ∅ 11, us 4, it 3, guardian 3, me 3 |
| tolkien-elevated | i 96, it 46, but 46, the 46, in 25 | ∅ 29, it 17, me 8, ring 7, him 6 |
| martin-narrative | the 38, i 24, if 20, and 14, that 12 | them 9, her 8, princess 7, dorne 6, well 6 |
| martin-chronicle | the 67, in 24, lord 22, his 16, a 16 | rock 14, him 11, west 8, them 8, instead 6 |
| dnd-flavor | the 59, they 51, in 21, you 17, a 13 | ∅ 16, races 9, game 8, them 7, others 6 |
| dnd-rules | the 140, if 97, a 97, for 78, you 73 | ∅ 47, check 34, it 27, action 24, you 17 |
| estate-state | the 928, ashford 610, what 232, a 188, there 110 | it 253, ashford 63, them 53, here 51, not 33 |

Secondary rows, same corpora and order:

| metric | leguin-nonfiction | leguin-nonfiction-written | leguin-nonfiction-spoken | leguin-fiction | leguin-all | tolkien-plain | tolkien-elevated | martin-narrative | martin-chronicle | dnd-flavor | dnd-rules | estate-state |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| sameOpenerPrev | 0.0696 | 0.0605 | 0.0769 | 0.1667 | 0.0894 | 0.065 | 0.0947 | 0.0342 | 0.0334 | 0.0639 | 0.0727 | 0.1321 |
| whichTail | 0.0285 | 0.0178 | 0.037 | 0.0123 | 0.0252 | 0.01 | 0.0225 | 0.0024 | 0 | 0.0066 | 0.0237 | 0.0511 |
| thereIsOpener | 0.038 | 0.0249 | 0.0484 | 0.0556 | 0.0416 | 0.02 | 0.0482 | 0.0122 | 0.0167 | 0.0016 | 0.0018 | 0.0515 |
| dialogueShare | 0.0649 | 0.0783 | 0.0541 | 0.0309 | 0.0579 | 0 | 0.0032 | 0.2714 | 0.0981 | 0.0311 | 0.0438 | 0.0003 |
| pronounCloser | 0.0997 | 0.089 | 0.1083 | 0.0556 | 0.0907 | 0.07 | 0.0674 | 0.1076 | 0.0543 | 0.0213 | 0.05 | 0.1335 |
| sentsPerPara | 4.13 | 3.47 | 4.88 | 10.13 | 4.7 | 8.7 | 6.05 | 4.54 | 3.4 | 3.35 | 2.74 | 1.29 |
| question | 0.0633 | 0.0961 | 0.037 | 0.0617 | 0.063 | 0.055 | 0.0144 | 0.0807 | 0 | 0.023 | 0.0035 | 0 |
| paren | 0.0079 | 0.0178 | 0 | 0.0062 | 0.0076 | 0.245 | 0.2247 | 0 | 0.071 | 0.0525 | 0.1025 | 0.0048 |

## What the numbers do to the section's own stated rules (numbers only; no taste judgment)

Feature 15 ("There is no optimum sentence length. The optimum is variety", against "Macho
Staccato") is **CONFIRMED in its precise form and CONTRADICTED in its naive one**: her
runsOfThreeSameLengthBand is the lowest in the table (fiction 0.154, nonfiction 0.179) against
dnd-rules 0.339, the CONTROL 0.320, martin-chronicle 0.284, dnd-flavor 0.271 and martin-narrative
0.254, and her neighbourVariation is the highest measured anywhere (fiction 0.805; nonfiction 0.740
against tolkien-plain's 0.733) — she genuinely refuses to run three sentences in the same length
band — yet her mean is the second-shortest in the whole table (nonfiction 15.3, fiction 17.4;
only martin-narrative is shorter at 13.8) and her shareUnder8 the second-highest (0.290 / 0.241
against martin-narrative's 0.301), so "variety" in her practice is a short mean with a long tail
(p90 31–32, shareOver30 0.106–0.130), not the long-sentence prose the Tolkien columns show (means
22.5 and 24.2). Feature 17 ("rationed, not banned") is **CONFIRMED for adverbs** — 0.160 per
sentence in her fiction and 0.246 in her written essays, below both Tolkien columns (0.325, 0.392)
and martin-chronicle (0.280), above martin-narrative (0.059) and dnd-rules (0.140), and nowhere
near zero — but its doubled-adjective limb is **CONTRADICTED for her fiction**, whose
doubledAdjectiveRate 0.0556 is the highest figure in the entire table, above tolkien-plain (0.045)
and dnd-flavor (0.041). Feature 25's annalist semicolon (her praise of Galt moving from riot to
dinner "only a semicolon") is **PARTLY CONFIRMED and materially qualified**: the semicolon is
indeed her fiction's signature punctuation (0.0864, her highest column, above tolkien-plain's
0.060 and martin-chronicle's 0.0355) but it sits below tolkien-elevated (0.122) and below the
CONTROL's own 0.1325 — our estate prose already out-semicolons Le Guin, so a "more semicolons"
instruction would move the product away from her, not toward her. Feature 18's repetition-with-
variation leaves a measurable trace: sameOpenerAsPreviousRate 0.167 in her fiction is the highest
in the table, above the CONTROL's 0.132. Features 6 and 7 (plainness, plain-not-flat) are only
**consistent, not decided**, by the one figure that separates hardest — parenthesisRate 0.008
against Tolkien's 0.225–0.245 — with abstract-noun closers at 0.046 against dnd-rules' 0.088.
Features 13 (sound first), 26 (alliteration and assonance), 9 (crowding and leaping), 11 (the
legend voice) and 23 (register narrows with scale) this lane **CANNOT REACH**: `fingerprint.mjs`
has no phonetic, syllabic or discourse-level measure. Feature 14 matters most here because the
section withdrew its one numeric target — "more than half the words in a block are one syllable",
which was a count of a Tolkien sample — explicitly "until the primary-measure lane lands her own
fingerprint". **This is that lane and it cannot supply it**: the instrument counts words,
punctuation, shapes, openers and closers and has no syllable counter, so feature 14's target stays
withdrawn and restoring it needs a new measure, which is a chair decision and not a lane's.

## CONFIRMED / PLAUSIBLE per figure
- **CONFIRMED (executed, quoted above):** every number in both comparison tables — each is read
  straight out of a `*.fingerprint.json` written by `node fingerprint.mjs` at exit 0; every word
  count printed by `build_corpora.py` at cut time; every http code, byte count and curl exit;
  every robots.txt line (fetched and greppable under `s6b-scratch/robots-*.txt`); the byte-identity
  of the pre-existing PROVENANCE rows (`cmp` exit 0 against a backup taken before the append).
- **CONFIRMED:** the two robots refusals and the Guardian refusal — the agent names are in the live
  files, not inferred.
- **PLAUSIBLE (reasoning, not executed):** that the LitHub/EL cut lists isolate *only* her words.
  They were set by reading every paragraph of every page and are printed as index lists in
  `build_corpora.py`, but a mis-attributed paragraph would not announce itself. The interview
  columns rest on speaker prefixes (`UG:`/`Ursula Le Guin:`, `UKL:`/`Ursula K. Le Guin:`) plus five
  hand-identified unlabelled continuations in the Naimon piece — those five are the softest
  judgment in the lane.
- **PLAUSIBLE:** that 9,670 words is enough for the rate metrics. The per-sentence rates rest on
  632 nonfiction and 162 fiction sentences; the fiction column in particular is ONE short story, so
  every fiction figure is a single-work figure, not a Le Guin-fiction figure.

## ⚠ Standing caveats the chair must carry forward
1. **The fiction column is one story.** 162 sentences from "Omelas" alone. Its high
   doubledAdjectiveRate and semicolonRate may be that story's catalogue rhetoric, not her fiction.
   Every other lawful fiction route was refused or empty (see the rejected table in PROVENANCE.md).
2. **Half the nonfiction column is transcribed speech** (4,894 of 9,670 words). Use
   `leguin-nonfiction-written` when adjudicating a written-prose rule; the spoken half drags the
   headline mean down by 3.1 words/sentence and the semicolon rate from 0.068 to 0.009.
3. **The estate's own opt-out is now a program fact.** `ursulakleguin.com` bars Anthropic agents
   site-wide. Any future Le Guin lane that "just fetches the essays" will either break that or
   silently launder it through a mirror; the chair should carry the refusal forward as a rule.

## RETROVALIDATION ROW
| what was judged | what the Fable chair must re-derive | receipts by path | priority |
|---|---|---|---|
| **Refusing the brief's two named sources on robots grounds** (ursulakleguin.com, arts.gov) and substituting LitHub/EL/.edu | Whether a named-agent `Disallow: /` binds this lane. If the chair rules it does not, the Le Guin column can be rebuilt from the official site and every figure here changes | `s6b-scratch/robots-www.ursulakleguin.com.txt`, `robots-www.arts.gov.txt`, `robots-www.theguardian.com.txt`; receipt §"ROBOTS REFUSALS" | **P1** |
| **The written/spoken split** — I made `leguin-nonfiction` the mixture the brief specified and added two diagnostics rather than choosing for the chair | Which of the three the dossier's Le Guin figures should quote | the three JSONs in `primary/` | **P1** |
| **Per-source keep-lists** (which paragraphs are hers) | Spot-check the five unlabelled Naimon continuations (25, 41, 46, 50, 51) and the Steering-the-Craft specimen drops (7, 9, 11, 12, 13, 15, 16) | `s6b-scratch/build_corpora.py`; raw HTML in `primary/raw/` | P2 |
| **Feature 14's withdrawn numeric target cannot be restored by this instrument** | Whether to commission a syllable/stress measure, or leave the target withdrawn | receipt §"What the numbers do…"; `prose-research/fingerprint.mjs` (no syllable counter) | P2 |
| **Re-writing the lost cut scripts under `s6b-scratch/` instead of re-planting them in `primary/`** | Whether the kit wants `cut_html.py` / `pdf2txt.py` restored to `primary/` as PROVENANCE.md documents them | `s6b-scratch/{cut_html,pdf2txt,build_corpora,table}.py`; PROVENANCE.md "Cut scripts" section | P3 |

STATUS: **COMPLETE**. No git tree touched; no vitest, npm, register door or subagent used.
Raw text exists only under `prose-research/primary/raw/`. Scratch only under `s6b-scratch/`.
