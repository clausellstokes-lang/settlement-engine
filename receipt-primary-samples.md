# RECEIPT — lane PRIMARY-SAMPLES

Seat: Opus 5 — Fable-unvalidated. Lane: PRIMARY-SAMPLES. Chair: Fable 5.1, 2026-09-05.
Read-only with respect to every git repo and lane dock. No repo writes, no commits, no vitest,
no npm install. All writes under `$SC/prose-research/primary/` and this file.

**70,223 words** of exemplar prose fetched from publisher/author/official sources, cut to running
prose, and fingerprinted with the same `fingerprint.mjs` that produced the estate control.
Derived numbers only; raw text is confined to `primary/raw/`, which must never enter a git ref.

---

## 1. Provenance

Full table with terms, robots checks, rejected sources and drop counts:
`$SC/prose-research/primary/PROVENANCE.md`. Summary:

| column | source (all fetched 2026-09-05) | stated terms | words |
|---|---|---|---|
| **estate-state** | control: `$SC/prose-research/estate-state.txt` (prior lane) | internal | 48,798 |
| **martin-narrative** | *The Winds of Winter* "Arianne" sample chapter, georgerrmartin.com/excerpt-from-the-winds-of-winter/ | author's own site, no licence line | 5,664 |
| **martin-chronicle** | unabridged westerlands history, georgerrmartin.com/world-of-ice-and-fire-sample/ | "Copyright c 2015 by George R.R. Martin." on the page | 12,422 |
| **martin** (combined) | the two above | — | 18,086 |
| **tolkien-elevated** | six Tolkien letters on the legendarium (Waldman '51, Auden '55, Beare '58, Elgar '63, Bretherton '64, Batten-Phelps '71), tolkienestate.com/letters/ | "© THE TOLKIEN ESTATE LIMITED 2025" | 15,093 |
| **tolkien-plain** | six domestic/business Tolkien letters (Michael '41, Christopher '44 & '45, Priscilla '63, Michael '67-68, Unwin '37), same host | as above | 4,503 |
| **dnd-rules** | SRD 5.2.1 pp. 5–18 + Basic Rules 2018 pp. 60–81 | SRD: **CC-BY-4.0**, per file p. 1. Basic Rules: free official download, "permission granted to print and photocopy … for personal use only" | 21,058 |
| **dnd-flavor** | Basic Rules 2018 pp. 3–7, 13–21, 172–176 | as above | 11,483 |

Attribution required by CC-BY-4.0 for source #5: *This work includes material from the System
Reference Document 5.2.1 ("SRD 5.2.1") by Wizards of the Coast LLC, available at
https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution
4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.*

`pdftotext` is not installed on this machine, and neither is `mutool`, `qpdf`, `gs` or `pdftk`.
I took the equivalent Python route — `pypdf 6.14.2`, already in system `python3` — rather than the
node one; `primary/pdf2txt.py` writes a `<<<PAGE n>>>`-marked dump so every page cut is
re-derivable.

---

## 2. The comparison table

Rates are per sentence unless the row says otherwise. `martin` is the two Martin registers pooled;
the two split columns follow it. **There is no Tolkien-narration column** — see §4.

| measure | estate-state | martin | martin-narrative | martin-chronicle | tolkien-elevated | tolkien-plain | dnd-rules | dnd-flavor |
|---|---|---|---|---|---|---|---|---|
| sentences | 2914 | 888 | 409 | 479 | 623 | 200 | 1141 | 610 |
| paragraphs | 2264 | 231 | 90 | 141 | 103 | 23 | 416 | 182 |
| sentences/paragraph | 1.29 | 3.84 | 4.54 | 3.40 | 6.05 | 8.70 | 2.74 | 3.35 |
| words/sentence mean | **16.7** | 20.4 | 13.8 | 25.9 | 24.2 | 22.5 | 18.4 | 18.8 |
| words/sentence sd | **7.2** | 12.8 | 9.3 | 12.7 | 16.0 | 15.4 | 8.9 | 8.8 |
| p10 | 7 | 6 | 4 | 11 | 7 | 6 | 9 | 8 |
| p50 | 17 | 18 | 11 | 25 | 21 | 20 | 17 | 18 |
| p90 | **26** | 38 | 26 | 43 | 46 | 43 | 31 | 30 |
| share < 8 words | 0.130 | 0.154 | 0.301 | 0.029 | 0.103 | 0.145 | 0.068 | 0.079 |
| share > 30 words | **0.021** | 0.205 | 0.049 | 0.338 | 0.281 | 0.270 | 0.102 | 0.089 |
| neighbour variation | **0.399** | 0.537 | 0.593 | 0.508 | 0.646 | 0.733 | 0.520 | 0.495 |
| semicolon | **0.133** | 0.024 | 0.010 | 0.036 | 0.122 | 0.060 | 0.011 | 0.015 |
| colon | 0.056 | 0.005 | 0.000 | 0.008 | 0.125 | 0.125 | 0.027 | 0.026 |
| em-dash | **0.000** | 0.003 | 0.000 | 0.006 | 0.048 | 0.015 | 0.025 | 0.038 |
| question | **0.000** | 0.037 | 0.081 | 0.000 | 0.014 | 0.055 | 0.004 | 0.023 |
| exclamation | 0.000 | 0.000 | 0.000 | 0.000 | 0.027 | 0.065 | 0.000 | 0.008 |
| parenthesis | **0.005** | 0.038 | 0.000 | 0.071 | 0.225 | 0.245 | 0.103 | 0.053 |
| antithesis | **0.109** | 0.017 | 0.017 | 0.017 | 0.040 | 0.030 | 0.011 | 0.013 |
| triad | **0.009** | 0.136 | 0.047 | 0.213 | 0.109 | 0.125 | 0.045 | 0.144 |
| participial opener | 0.012 | 0.006 | 0.002 | 0.008 | 0.008 | 0.005 | 0.034 | 0.015 |
| which-tail | **0.051** | 0.001 | 0.002 | 0.000 | 0.023 | 0.010 | 0.024 | 0.007 |
| doubled adjective | 0.014 | 0.018 | 0.012 | 0.023 | 0.042 | 0.045 | 0.013 | 0.041 |
| adverbs/sentence | 0.162 | 0.178 | 0.059 | 0.280 | 0.392 | 0.325 | 0.140 | 0.228 |
| "There is/It was" opener | **0.052** | 0.015 | 0.012 | 0.017 | 0.048 | 0.020 | 0.002 | 0.002 |
| abstract-noun closer | 0.044 | 0.018 | 0.012 | 0.023 | 0.058 | 0.045 | 0.088 | 0.077 |
| pronoun closer | **0.134** | 0.079 | 0.108 | 0.054 | 0.067 | 0.070 | 0.050 | 0.021 |
| same opener as previous | **0.132** | 0.034 | 0.034 | 0.033 | 0.095 | 0.065 | 0.073 | 0.064 |
| runs of 3 same length-band | 0.320 | 0.270 | 0.254 | 0.284 | 0.199 | 0.155 | 0.339 | 0.271 |
| dialogue share | **0.000** | 0.178 | 0.271 | 0.098 | 0.003 | 0.000 | 0.044 | 0.031 |
| — *added measures* — | | | | | | | | |
| "rather than" per 1k words | **5.33** | 0.28 | 0.18 | 0.32 | 0.07 | 0.00 | 0.24 | 0.17 |
| ", which" per 1k words | **3.05** | 0.06 | 0.18 | 0.00 | 0.93 | 0.44 | 1.28 | 0.35 |
| type-token ratio @ first 4k tokens | **0.211** | 0.296 | 0.296 | 0.305 | 0.301 | 0.348 | 0.242 | 0.295 |

(The last three rows are extra measures I added because two fingerprint rows — antithesis and
which-tail — turned out to be carried by single lexical items. Bold marks the column that is the
extreme of its row. **The TTR window is fixed at 4,000 tokens for every column** because the
smallest corpus, tolkien-plain, is 4,503 words and type-token ratio falls with corpus length; an
uncontrolled 20k window made the estate gap look roughly twice as large as it is, and I corrected
it before filing. The honest reading is that our lexical variety is the lowest in the table but by
13% against the next lowest, not by a factor.)

Raw fingerprints: `primary/{martin,martin-narrative,martin-chronicle,tolkien-all,tolkien-elevated,tolkien-plain,dnd-rules,dnd-rules-srd52,dnd-flavor}.fingerprint.json`.
Rendered table: `primary/TABLE.txt`.

---

## 3. Five sentences of reading per exemplar

### Martin

Martin's two registers are further apart from each other than either is from us, and the split is
the finding: the chapter runs at 13.8 words a sentence with 30% of its sentences under eight words,
while the world-history runs at 25.9 with 34% over thirty — one voice, two gears, and he changes
gear by *purpose*, not by mood. His chronicle triad rate is 0.213, twenty-four times ours (0.009);
where we say a thing once, he says it as a list of three concrete nouns and lets the rhythm do the
arguing — "a place of blue lakes and sparkling rivers" is the shape, repeated for pages. His
which-tail rate in the chronicle is exactly **zero** across 12,422 words against our 0.051, and his
"rather than" rate is 0.32 per thousand against our 5.33: he never subordinates a qualification, he
starts a new sentence for it, which is why his long sentences read as accumulation and ours read as
hedging. Against that, we do one thing he does not: our semicolon rate is 0.133 to his 0.036, and
his pronoun-closer rate in the chronicle (0.054) is well under ours (0.134) — he lands sentences on
nouns and names, we land 253 of ours on the word "it." The single number the chair should carry
from this column is the neighbour-variation gap, 0.508 against our 0.399 in the same descriptive
register: even when Martin is writing a gazetteer, consecutive sentences differ in length by half
their own mean, and ours differ by two-fifths.

### Tolkien

The Tolkien columns measure his letters, not his narration (§4), so read them as the ceiling of his
*discursive* voice rather than the Shire-to-Gondor register span the brief wanted. What they show is
punctuation as a thinking instrument: parenthesis 0.225, colon 0.125, semicolon 0.122, em-dash 0.048
— against our 0.005 / 0.056 / 0.133 / **0.000** — so a Tolkien sentence carries its own qualifications
inside itself and still lands, where ours either drops the qualification or spends a whole extra
sentence on it. His neighbour variation is the highest in the table (0.646 elevated, 0.733 plain)
and his sd is 16.0 against our 7.2, so the length of his next sentence is genuinely unpredictable;
"Linguistic taste changes like everything else" sits beside a 531-word paragraph without either
looking wrong. His adverbs-per-sentence is 0.392, more than double ours (0.162), and his
same-opener-as-previous is 0.095 against our 0.132 — he varies the head of the sentence and loads
the middle; we do the reverse. The one measure where we beat him is the semicolon (0.133 to 0.122),
and that is not a win: his semicolons join two live clauses, ours are overwhelmingly the joint in a
fixed two-part template. If the chair wants one Tolkien lever, it is the **em-dash**: he uses it in
one sentence in twenty, we use it in none of 2,914, and it is the cheapest way to get a qualification
inside a sentence without the "which" that is currently doing that job 149 times.

### D&D

The rules register is the closest thing in the table to what we already sound like, and that should
worry the chair rather than reassure them: dnd-rules sits at 18.4 words a sentence with sd 8.9 and
runs-of-three-same-band 0.339 — the only column *more* metronomic than ours (0.320). It reaches that
flatness deliberately, because a rule must be scannable, and it pays for it in exactly the way we do:
abstract-noun closers 0.088 (the highest in the table) and 47 sentences ending on a bare numeral.
Where it beats us outright is the sentence *opener* — participial openers 0.034 against our 0.012 and
"There is" openers 0.002 against our **0.052** — so rules prose almost never begins a sentence by
announcing that something exists, and we begin one sentence in twenty that way. The flavor column is
the genuinely instructive one: same book, same house style, and it moves triad to 0.144, doubled
adjectives to 0.041, adverbs to 0.228 and pronoun closers down to 0.021, proving that the swing from
procedural to evocative is achievable *inside a single voice* by changing four levers, not by writing
differently — "stone gargoyles stare at you from hollow sockets" is the same sentence engine as the
combat chapter with the triad and adjective dials turned up. The lever set the flavor column
demonstrates — triad up, doubled-adjective up, pronoun-closer down, abstract-closer down — is the
one I would hand the chair as the cheapest route from our current numbers to something a reader
would call written.

### And what ours does that none of theirs does

Three of our numbers are off the exemplar scale in the *wrong* direction and are not defensible as
voice. Antithesis 0.109 against a 0.011–0.040 band, and 259 of the 323 hits are the literal phrase
"rather than" — 5.33 per thousand words against a maximum of 0.32 anywhere else, which is a tic, not
a rhetorical figure. Which-tails 0.051 against Martin's 0.001, carried by 149 instances of ", which";
"There is/It was" openers 0.052 against the D&D rules' 0.002; same-opener-as-previous 0.132, the
highest in the table; and 253 sentences ending on the word "it" out of 2,914. Type-token ratio at a
length-controlled 4,000-token window is **0.211**, the lowest of all eight columns, though only 13%
below the next lowest (the D&D rules chapters at 0.242) rather than the factor my first,
uncontrolled measurement suggested. That last figure carries a caveat I want on the record: the
estate corpus is many generated facets of *one* town, so some repetition is corpus construction
rather than voice — but a reader of one dossier sees precisely this corpus, so the number is the
reader's experience even if it is not purely the generator's fault.

---

## 4. What I could not reach, and why

- **Tolkien narration — not reached.** There is no legitimate free full text of *The Hobbit* or
  *The Lord of the Rings*: Tolkien died in 1973, so the work is in copyright in every jurisdiction I
  can source from (UK/EU/US to 2043-44; Canada's 2022 term extension caught him before his life+50
  would have expired). The publisher route is closed too — `tolkien.co.uk` serves its previews
  through a JS preview-config client with no extract in the HTML, and HarperCollins' UK product URL
  404s. The Tolkien Estate's own pages quote narration, but **523 words in total** across every
  `/writing/` page, which is far too few sentences to fingerprint. I substituted twelve letters the
  Estate publishes in full and split them by subject, and I have labelled the columns
  `tolkien-elevated` / `tolkien-plain` rather than `Tolkien-narration` so no one reads them as the
  narrative voice. **The Shire-vs-Rohan register span the brief asked for is not in this table.**
- **A second and third Martin fiction chapter — not reached.** Penguin Random House's "Read an
  Excerpt" module is JS-loaded; neither the `/excerpt` path nor an API route returns text. Reactor's
  "Read a Chapter From The Winds of Winter" page carries no chapter body. His site's other excerpt
  posts are either another author's prose (Wild Cards) or a dead randomhouse.com reader widget
  (*The Armageddon Rag*). So `martin-narrative` rests on **one** chapter, 409 sentences — enough for
  the aggregate rates but thin for the tails; `martin-chronicle` at 479 sentences is the sturdier of
  the two.
- **Official free WotC adventure text — none found openly hosted.** The brief asked me to report if
  there is none. There is none I could reach; `dnd-flavor` therefore rests on the Basic Rules'
  descriptive chapters and its one boxed read-aloud passage, not on published adventure boxed text.
- **The Herald/news pools — not fingerprinted.** `$SC/prose-research/PROSE_INVENTORY.md` does not
  exist, so lane PROSE-INVENTORY has not landed its extraction globs. Per the brief, I left that to
  the chair.
- **pdftotext — absent.** Recorded above; substituted `pypdf`.

---

## 5. Retrovalidation row

Everything below is a judgment I made inside the brief's latitude. Each line says how the chair
re-derives or overturns it.

| # | what I judged | how the chair re-derives it |
|---|---|---|
| 1 | **PDF text route.** Used `pypdf 6.14.2` instead of the brief's `pdftotext`/node routes, because none of `pdftotext`/`mutool`/`qpdf`/`gs`/`pdftk` is installed. | `python3 $SC/prose-research/primary/pdf2txt.py <pdf> <out>`; compare against any other extractor on SRD p. 5. Extraction artefacts I know of: soft hyphens arrive as `word -\nrest` (de-hyphenated by `cut_pdf.py`) and small-caps headings arrive mangled (`ExcEptions supErsEdE`). |
| 2 | **D&D page cuts.** rules = SRD 5.2.1 pp. 5–18 + Basic pp. 60–81; flavor = Basic pp. 3–7, 13–21, 172–176. Chosen so "rules" is purely procedural second-person and "flavor" purely descriptive, with no page appearing in both. | Re-run `cut_pdf.py` with different ranges. The claim to test is that the split is a *register* split, not a *book* split: `dnd-rules-srd52.fingerprint.json` isolates the SRD half and can be compared against the Basic half. |
| 3 | **Prose filter thresholds.** `minWords 25` for PDFs, `12` for HTML; heading = ≤48 chars with no terminal sentence punctuation and ≥50% capitalised words; drop on >3% digit density, >1 dice expression, bullets, dot-leaders, no terminal full stop. | Every drop count is printed at cut time and copied into `PROVENANCE.md`. Re-run with `minWords 15` / `40` and see whether any bolded cell moves. The known cost of the heading rule: it swallowed the first eleven words of the Basic Rules read-aloud passage. |
| 4 | **The Tolkien substitution and its split.** Letters instead of narration; elevated = the six letters *about the legendarium* (Waldman, Auden, Beare, Elgar, Bretherton, Batten-Phelps), plain = the six *domestic/business* letters (Michael ×2, Christopher ×2, Priscilla, Unwin). Split by addressee-and-subject, not by measured register. | The file lists are in `PROVENANCE.md`; re-cut with any other partition and re-run `fingerprint.mjs`. This is the weakest judgment in the lane — the 1944–45 Christopher letters are arguably elevated, and moving them would pull `tolkien-plain` up. |
| 5 | **The Martin split.** Treated `world-of-ice-and-fire-sample` as solo-Martin prose on the strength of the page's own line, "Copyright c 2015 by George R.R. Martin," even though the *published* World of Ice & Fire is co-authored with García and Antonsson. | The copyright line and the "abridged version appeared in" note are both in the raw HTML. If the chair judges the attribution unsafe, drop `martin-chronicle` and the `martin` pooled column; `martin-narrative` is unambiguously his. |
| 6 | **Three added measures**, because two fingerprint rows proved to be carried by single lexical items — 259 of the estate's 323 antithesis hits are the literal phrase "rather than", and 149 of its which-tails are ", which". | `cd $SC/prose-research && python3 primary/extras.py` reproduces the three rows exactly (output banked at `primary/EXTRAS.txt`). **I got the TTR row wrong on the first pass and corrected it before filing**: an uncontrolled 20k-token window gave estate 0.103 against dnd-basic 0.146, but no corpus except the estate's actually reaches 20k tokens, so the window silently penalised the long corpus. At a fixed 4k window the figures are 0.211 vs 0.242, still lowest but by 13%, not by a factor. Anyone re-deriving should change `W` in `extras.py` and confirm the ordering is stable, not the magnitude. |
| 7 | **Pull-quote de-duplication.** Dropped paragraph 0 of each Tolkien Estate page when it begins with `‘`, because the estate's pull-quote is a verbatim duplicate of a body paragraph and would double-count. | 6 drops per corpus, printed. Verify on `te_letters_letter-to-the-poet-w-h-auden-7-jun-1955.html`: para 0 duplicates para 15. |
| 8 | **Comparability caveat.** `sentences/paragraph` is not comparable across columns — the estate corpus is one generated string per paragraph (1.29), which is an artefact of how the prior lane assembled it, not a property of the voice. Every other row is sentence-level and is comparable. | `wc -l $SC/prose-research/estate-state.txt` = 4,526 lines, 2,263 blank; i.e. 2,264 one-to-three-sentence paragraphs. |
