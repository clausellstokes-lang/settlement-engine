# CAR 8b-W-18i — THE ARCHIVER'S WEIGHING ROW + THE COMPOUND PAIR'S JOINT (rulings 22 and 23, brief ADDENDUM 18)

Dock: `$SC/kit/laneRW-DEF2` (a git worktree of the product; HEAD must be clean before you start — `git status --short` empty; if a workflow gate is mid-commit, WAIT). Seat: Opus implementer. The chair is Fable. Write files EARLY and rewrite as you go (the checkpoint law: three implementers died on a session limit with nothing on disk).

## What the law says (read `docs/rewrite-retro-2026-09-12/THE-LAW-CONSOLIDATED-2026-09-13.md` §6 first)
- Ruling 22: after a `disagree` or `reinforce` pair, ONE sentence in the archiver's own hand may close the unit (a conjecture, a plain 'a matter of debate', or a reasoned confidence; never a restatement of the survey; opening never closing). Face syntax: `- \`[face]\` \`[archiver · pair <N> · weigh]\` <one sentence>`.
- Ruling 23: a pair whose two faces are ONE sentence each may render as ONE COMPOUND SENTENCE: the joint is chosen at render, seeded, by the pair's kind — disagree: `, though ` · `, but ` · `, while ` · `, and yet `; reinforce: `, and ` · `, as `; or the full stop (`. `). Never a semicolon. The second face's opening character is lowercased only when it is a common word (never a `{slot}`, never a capitalised name). A two-sentence face joins by the full stop.

## The mechanism
1. `src/domain/display/stateProse/stateProseKernel.js`: `FACE_SOURCES` gains `'archiver'` — a token that NEVER draws alone (eligibleFaces excludes it unless its pair is drawn); `PAIR_KINDS` gains `'weigh'` as the archiver's attachment kind (or a separate WEIGH token — your call, recorded); `drawFace` renders `[spine] [pair a] [joint] [pair b] [weigh?]`; a `pairJoint(kind, seed)` table; the joint applies only where both pair faces contain exactly one sentence (count sentence-final `.`, `?` — a `…` does not end a sentence).
2. `scripts/lib/dossier-annex-grammar.mjs`: parse the `archiver · pair N · weigh` tag; refuse a weigh row whose pair is `aside` or `view`, a second weigh on one pair, a weigh with no pair, a weigh row longer than one sentence; the E2 ratchet applies to it as to any face; `{settlement}` refused in it.
3. `scripts/generate-dossier-state-prose.mjs` + `src/domain/prose/composedWalker.js`: the leaf carries `weigh` beside `sources?/pairs?`; the walker's face-count register counts the weigh row as a face of its variant (the pin is a CEILING).
4. `src/domain/display/stateProse/faceSources.js`: unchanged (the archiver is not a town source).
5. Tests: a pin per joint kind (disagree ×4, reinforce ×2, full stop), the lowercase rule (common word · slot · name), the one-sentence guard, the weigh-only-with-its-pair draw, the grammar refusals (aside/view, double weigh, orphan weigh), the zero-text-shift proof on the shipped annex (no pool carries a weigh row yet: the generated files are byte-identical before/after — prove it with `--check` and a `git diff --stat` of `src/data/dossierStateProse/`).
6. Census sequence after composer edits: census → generator → census → `--check` (the sha interlock).

## Return exactly
COMMIT (sha in the dock) · FILES (path: what changed) · PINS (+N, file names) · SHIFT (the generated files byte-identical: yes/no with the diff stat) · GATE (the exact command lines you ran and their totals) · HAZARDS (anything a successor must know) · OPEN (what you left undone and why).

---

# RIDING WITH 18i, AS SEPARATE COMMITS IN THIS ORDER: 18j THEN 18i THEN 18k

## CAR 8b-W-18j — FACE_PIN IS A CEILING THAT BINDS (ruling 21 reconciliation 2; measured on the first pool)
`scripts/generate-dossier-state-prose.mjs` holds `const FACE_PIN = 4` (a spine + three faces per variant). Under ruling 15 (one face per SEATED SOURCE) the card seated TEN sources on the walls-with-no-force preimage and the Fable selector could slot nine; the register and the market were excluded by the pin, not on quality. Raise the pin to `1 + FACE_SOURCES.length` (import the kernel's vocabulary; today 12 → 13; 18i's `archiver` token joins the vocabulary, so after 18i the pin follows automatically) so one face per seated source always fits. Every pool today is at or under 4, so the generated files are byte-identical (prove it: `--check` and `git diff --stat src/data/dossierStateProse/`). If the face-count register (`docs/content/prose-shift-register.json` or wherever `pinnedFaceCount` is frozen) pins the OLD ceiling, re-freeze it as a GROW with plain `--write`, declared in the commit body as a one-time deliberate shift. Pin: a test that the pin equals the vocabulary size plus one, so the two can never drift apart.

## CAR 8b-W-18k — THE CARD PRINTS WHAT A FACE MAY NOT DENY OF A REQUIRED ROW (the first pool's shared writer error)
Both writer seats denied arms of the persons on gate duty ("Nobody who asked him was under arms") where a `required: true` `Town watch` row seats Gate duty (p 0.8) and `deriveArmedForces` files the watch under `standing`; and both placed the burial ground outside the wall where the card says "most towns, not all". `scripts/prose-mark-card.mjs` (the marker's mechanical instrument, sections 1–6): add a section — "WHAT A FACE MAY NOT DENY OF THE REQUIRED ROWS" — that, for each `required: true` row on every tier of the preimage, prints the row's services with p ≥ 0.8 (from `src/data/institutionServices.js`) and the derivation that files the row (standing force / court / record filing …), in the form: `<row> (required at <tiers>) — a face may not deny: <service> (p) · filed under <bucket>`; and, for any placement the card states with a hedge ("most towns"), print it under "PLACEMENTS A FACE MAY NOT ASSERT". Keep the section mechanical (no prose judgment); the marker's sections 7–9 stay the reader's. Prove it on `node scripts/prose-mark-card.mjs DS-DEF-2 'Invasion & War: walls with NO force'` — the Town watch → Gate duty line must appear. Pin: a test on that output.

## Return, per car
COMMIT · FILES · PINS · SHIFT · GATE · HAZARDS · OPEN — three blocks, one per car, in the order landed. If the session limit cuts you, the files on disk and the commits made so far are the state; say so in the last line you can write.
