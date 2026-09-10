# BRIEF — PRIMARY-SAMPLES (Opus lane, read-only research; Seat: Opus 5 — Fable-unvalidated; Lane: PRIMARY-SAMPLES)
Chair: Fable 5.1, 2026-09-05 (owner clarification the same evening: "you can still read them to directly derive as well as use critics … we're reconciling several authors into our own unique voice"). No repo writes, no vitest, no commits.

## The task
Fingerprint the exemplars' PROSE from legitimately accessible primary text, with the SAME tool the estate's own corpus was fingerprinted with, so exemplar and base sit in one table. Derived numbers only. Store raw text ONLY under `$SC/prose-research/primary/raw/` (NEVER in the kit, never in a git ref; the chair excludes that directory from every seal). Quotations in your report: under twelve words each, at most one per source.

## Sources (legitimate only — publisher/author/official pages, open licences, Google Books preview text if it fetches; NEVER a piracy or "read online" host; if only a login-gated copy exists, say so and stop)
1. George R. R. Martin — publisher excerpts (Penguin Random House / Bantam excerpt pages, georgerrmartin.com, Tor.com/Reactor excerpts of A Song of Ice and Fire chapters; the prologue and first chapters are commonly posted); aim for ≥ 3 chapters of running prose if reachable.
2. J. R. R. Tolkien — HarperCollins / Tolkien Estate / publisher sample pages, Google Books preview text; the "Concerning Hobbits" prologue, a Shire chapter, and a Rohan or Gondor chapter would give the register span (plain → elevated); take what is legitimately reachable.
3. D&D official — the SRD 5.2 (CC-BY-4.0, wizards.com/dndbeyond download) and the 2014 Basic Rules PDF (free official download): fingerprint the RULES register and the monster/spell FLAVOR register separately; plus any official free adventure text WotC hosts openly (report if none).
4. Control: the estate's own state corpus is already fingerprinted at `$SC/prose-research/estate-state.fingerprint.json`; also fingerprint the estate's Herald/news pools if `$SC/prose-research/PROSE_INVENTORY.md` (lane PROSE-INVENTORY) has landed with extraction globs — otherwise leave that to the chair.

## Method
- Fetch → convert to plain text (pdftotext/strip HTML) → cut to RUNNING PROSE only (drop tables, stat blocks, headings, front matter; for Martin/Tolkien drop chapter titles; keep dialogue but report its share) → `node $SC/prose-research/fingerprint.mjs <label> <files…>` with `FP_OUT=$SC/prose-research/primary/<label>.fingerprint.json`.
- For Tolkien, ALSO split by register if the text allows (narration vs dialogue; hobbit chapters vs Rohan/Gondor) and fingerprint each split.
- For D&D, split rules text vs read-aloud/flavor text.
- Record the provenance of every text file (url, licence/terms as stated on the page, word count) in `$SC/prose-research/primary/PROVENANCE.md`.

## Deliverable (`$SC/receipt-primary-samples.md`)
1. A provenance table. 2. ONE comparison table: rows = measures (words/sentence mean, sd, p10/p50/p90, neighbour variation, semicolon/colon/em-dash/question rates, antithesis rate, triad rate, participial openers, which-tails, adverbs/sentence, "there is" openers, abstract-noun closers, pronoun closers, runs of three same-length sentences, dialogue share); columns = estate-state · Martin · Tolkien-narration · Tolkien-elevated · D&D-rules · D&D-flavor. 3. Five sentences of reading per exemplar: what the numbers say the prose DOES that ours does not, and vice versa — no passage reproduced. 4. What you could not reach and why. 5. Retrovalidation row: what you judged (the cuts, the splits) and how the chair re-derives it.
