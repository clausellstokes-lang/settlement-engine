---
name: ip-exposure-measured-2026-08-07
description: "⭐⭐ MEASURED IP exposure: minification CANNOT protect tuning (90.2% of constants ship verbatim as object keys); the corpus is the only asset with strong legal protection; TWO docs must leave the repo (pricing margins + an open security register)."
metadata:
  node_type: memory
  type: project
  created: 2026-08-07
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T07:54:09.346Z
---

# What actually ships, and what it lets an engineer rebuild

Read-only audit 2026-08-07 against `dist/` built 2026-08-06 09:28. ⚠ HEAD has moved 43
commits since (23 touching `src/`), but **`vite.config.js` has ZERO commits in that window**,
so every configuration-level finding holds for a fresh build; only byte counts and chunk
hashes would shift. No rebuild was run (two lanes were landing; disk at 96%).

## ⚠⚠ MINIFICATION IS STRUCTURALLY INCAPABLE OF PROTECTING THE TUNING

**No JavaScript minifier mangles object keys** — they are observable program semantics. The
tuning lives as keys bound to numeric literals, so **2,320 of 2,573 distinct tuning constant
names (90.2%) come out of the shipped bundle with values attached** (CONFIRMED). The 253
"misses" were format normalization, not absence (`0.5`→`.5`, `3.0`→`3`).
`STRESS_SEVERITY_WEIGHT` and `INST_WEIGHTS` read out intact, minus comments.

⛔ **DO NOT "FIX" THIS.** Obfuscation taxes first paint forever and buys weeks. Moving tuning
or generation server-side destroys instant local generation and the determinism promise —
the experience itself. Encrypting the corpus ships the key. All three are the wrong trade.

## The separation line: THERE ISN'T ONE

The simulation is client-side end to end. **Zero of 33 edge functions and zero of 6 Vercel
handlers contain generation code.** The server owns money, keys, credits, identity, telemetry.
The AI layer is clean (provider keys server-only, enforced by a contract test).

⚠ **PAYWALLS ON AI CALLS ARE ENFORCED; PAYWALLS ON LOCAL COMPUTE ARE ADVISORY** — architecturally
forced. Three carry a price tag and a server ledger, which *reads* as enforcement but is a
client boolean: the $2.99 PDF export right (`dossierEntitlements.js`), the Faith & War premium
chapter (`pdf/variants.js`), the Instant World gate (`InstantWorldEntry.jsx`).

## ⭐ The moat is the corpus, not the code

**9,428 authored sentences are copyrightable EXPRESSION; game mechanics and numeric weights
are not.** Technical protection there is nil, legal protection unusually strong — the inverse
of everything else. ⭐ **WATERMARK: salt distinctive phrasings into the corpus and set 2–3
constants to values correct-but-arbitrarily-precise.** Converts a hard case into an easy one
at zero product cost.

⚠ **A PRIOR CLAIM OF MINE WAS OVERSTATED:** I had said the docs outrank the code because the
code is "a compilable consequence of the volumes." Tested and **REFUTED in mechanism** — the
volumes name the big tuning tables without transcribing them, much of the corpus ships dark,
and the goldens aren't in the docs. Correct conclusion: **docs eliminate the SEARCH, the
bundle supplies the VALUES, and the two together are far worse than either alone.**

⭐ Six files in `src/data/` open with `// extracted from bundle`. **This project's own history
contains a completed bundle-to-source reconstruction of this codebase** — feasibility is
settled empirically by the owner's own commits.

## Already correct (add a guard, don't change behaviour)

- **No source maps emitted** — zero `.map` in `dist/assets`, no first-party `sourceMappingURL`.
  ⚠ Correct BY DEFAULT, so one config line silently undoes it — owed: a CI assertion.
- No secrets in the bundle. Golden masters are **sha256 only**, no settlement content.

## ⛔ TWO DOCS THAT ARE NOT IP AND MUST LEAVE THE REPO (owner-gated, security posture)

1. `docs/PRICING_MARGIN_SHEET.md` — margin policy, per-action credit prices, provider rate
   cards, blended cost-per-credit. Competitive harm day one.
2. `docs/REVIEW_FINDINGS.md` — 133-finding security register with **9 OPEN markers**, incl. a
   PostgREST `.or()` filter-injection seam in `admin-actions` and a user-callable
   `refund_credits` path. An exploit roadmap against the RUNNING service.
   ⚠ The audit read the DOCUMENT; whether each finding is still open IN CODE is UNVERIFIED.

**Why:** the owner sells the experience to TTRPG enthusiasts and is protecting against
engineers who could clone it — so the question is empirical, not legal, and effort spent on
secrecy comes straight out of the experience.

**How to apply:** protect the corpus by copyright and watermark; guard the source-map default;
never trade determinism or instant generation for obfuscation. Related:
[[owner-marketing-doctrine]] · [[the-promise-ratified]] · [[public-payload-veil-seam]].
