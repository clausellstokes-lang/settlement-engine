# REVIEW-VEIL-9 — the reader's probes

Behind `../../REVIEW-VEIL-9.md`. Scratch tools, not pins. Every database is a LOCAL scratch PostgreSQL 16 cluster in the
reader's container (unix socket only, `listen_addresses = ''`, trust auth). Built on the earlier readers' library
(commit 72a3bb24f, `docs/chair/2026-11-13/probes/REVIEW-VEIL-6`, `-7`, `docs/chair/2026-11-14/probes/REVIEW-VEIL-8`),
extracted outside every tree to `/var/tmp/v16/lib`; these files expect themselves at `/var/tmp/v16/rv9/`.

- `fold.mjs`: ONE FOLD FOR EVERY SCRIPT (NFKD, marks out, full Unicode lower case, ß→ss, ς→σ, every run that is not a
  letter or number one space) and the FORMS of a hidden house (its name, the name without a bracketed qualifier, the
  tail of its id, its catalogue id, its label; squeezed where nine letters or more). The earlier readers' searches
  folded with `[^a-z0-9]`: a name with no Latin letter folded to nothing and was never looked for.
- `names-unicode.mjs <pgmod> <db>…`: REVIEW-VEIL-6's `names-anyform.mjs` with that fold and those forms (every read:
  gallery, link, map, map link, card, import, map import; every string and key; an `is…`/`has…` key only when true).
  NEGATIVE CONTROL: REVIEW-VEIL-7's `town-b` (a Cyrillic name) stored on 001..211 is found in four paths.
- `page.probe.jsx`: THE PUBLIC PAGE: the tree's own `fetchPublicDossier` (anon, the local chain behind its supabase
  client) by gallery slug and party link, rendered by the tree's own `PublicDossierView`, walked by the repo's
  `walkDossier` (every group, sub-tab and disclosure; vendored from `tests/components/pageCensusWalk.shared.mjs` of
  8f3b8bf4b); the markers and every form of a hidden house searched in the page's text and in the raw response.
- `prose.probe.jsx`: THE STORED PUBLIC PROSE BY COUNTERFACTUAL: a sentence the server sends in `publicProse` that the
  tree's own composer writes for the stored town and does not write with the hidden houses taken out.
- `vitest.config.mjs`: `RV6_SRC=<worktree> RV9_PROBE=<absolute probe path> npx vitest run --config <this file>`.
