# RECEIPT — S6B-LEGUIN-FINGERPRINT — **PARTIAL**
Seat: Opus 5 — Fable-unvalidated · Lane: S6B-LEGUIN-FINGERPRINT · Chair: Fable 5.1
Started 2026-09-06 (kit-only lane; no git tree touched, no vitest, no npm, no subagents).

STATUS: PARTIAL — header written before any fetch. Updated after every fetch and every measurement.

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
