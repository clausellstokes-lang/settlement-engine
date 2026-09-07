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
