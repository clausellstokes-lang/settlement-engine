# BRIEF — WRITE-PEOPLE: the handler ties, the DM's power sentences, and item 15's secrets and presentations by title (2026-11-08)

**Seat:** WRITE-PEOPLE (the allegiance train's writing seat B). **Chair:** session `01FE9mEvGxnFx6WTBkEC6ie9` (Opus 5.5), under the owner's full delegation — never ask the owner anything; the chair rules. **Effort:** high. **Context:** 1M — plan to finish the whole manifest; do not stop short of it.

## 0. Read first (in this order)

1. `docs/OPERATING_STANDARD.md` and `CLAUDE.md`.
2. `docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md` — §1.5 (the handler tie: one handler, FROM the agent TO the handler, the four kinds and their labels), §3.4 and §9 (the capture rungs and the DM view's patronage and capture sentences), §6.5 and §6.6 (item 15 and the writing size).
3. `docs/allegiance/ALLEGIANCE_RULINGS_2026-11-08.md` (J-6, J-10, J-16 bind you).
4. THE OWNER'S STYLE LAW: `docs/chair/2026-11-07/WIRING-RULINGS-2026-11-07.md` §5–§8, `docs/chair/2026-11-07/STYLE-RULINGS-2026-11-07.md` §2, `docs/chair/2026-11-07/WAVE-RULINGS-2026-11-07.md` item 16 and §3, `docs/chair/2026-11-07/BRIEF-WIRING-COMMON-2026-11-07.md`. The governing principle (the owner, 2026-11-08): **plausibility with confidence, not predictability.**
5. Item 15 itself: `origin/lane/w4-people-2026-11-07:docs/WIRING_W4_2026-11-07.md` §S12, and `docs/PEOPLE_1_CAST_2026-11-07.md` §1 ("The pool map's fallbacks"). The voice reference: W4's pushed lines on that branch, and the tie lines of `origin/lane/w5-his-2026-11-07:src/data/npcData.js` (the W5 rewrite; its orientation note above `endsOf`: `r` is the tie's `from` card, `s` its `to` card).

## 1. The branch

Cut `lane/write-people-2026-11-08` from `origin/lane/integration-2026-11-07`, then merge `origin/lane/allegiance-design-2026-11-08`. Push form, three plain separate Bash calls: `git add -A`; `git commit -q -F <msgfile>`; `git push --no-verify -u origin lane/write-people-2026-11-08`. **Push at most about once an hour and at the hand-back** (Vercel's 100-a-day cap) — EXCEPT the first push below, which car 1 is waiting on.

## 2. The manifest (CREATE only; touch nothing else but the roster's two lines), IN THIS ORDER

1. **FIRST, pushed alone as soon as it is green (CAR 1 IS WAITING ON IT): `src/data/people/handlerTieLines.js` + `tests/data/handlerTieLines.test.js`.** The handler tie's description and tension lines as DATA for car 1 to wrap in `npcData.js :: pairProse` (car 1 composes the archetypes; you write only the line arrays): `HANDLER_TIE_LINES = { handler_partnership: { label: 'Silent Partnership', type: 'patron_client', desc: [6], tension: [6] }, handler_patron: { label: 'The Patron No One Names', type: 'patron_client', desc: [6], tension: [6] }, handler_cause: { label: 'Sworn to the Cause', type: 'ally', desc: [6], tension: [6] }, handler_leverage_debt / _secret / _crime / _loved: { label: 'Held Over Them', type: 'debtor_creditor', desc: [4], tension: [4] } }` — the chair's ruling on design §1.5's four leverage sub-kinds: each is its own archetype key (so the estate's one-index-picks-desc-and-tension machinery holds unchanged; car 1 draws the sub-kind on the agent's tie fork), 68 lines in all. Each entry is a closure `(r, s) => \`…\`` or `{ line: (r, s) => …, colour?, needs? }`, exactly the estate's shape; `r` is the AGENT (the tie's `from`), `s` the HANDLER (its `to`). The handler is a criminal face; the agent may be anyone (an office, a front's face, a retainer). Lines are DM-only by construction (the tie is covert), so they may say plainly what the arrangement is. The test: the counts, every closure returns a non-empty string for two stand-in cards, both names appear in every tension line that the estate's `tensionNamesBoth` would require (read `relationshipArchetypes.js`), no struck tic, no duplicate; a planted control reds it.
2. **`src/data/people/dmPowerLines.js`** (+ its test): the DM layer's patronage sentences (2 kinds × 3) and the capture-state sentences (5 rungs × 3) of design §9 / §3.4 — 21 lines, slotted from the record facts §9 names.
3. **`src/data/people/titleSecretsPresentations.js`** (+ its test): item 15 — secrets and presentations BY TITLE for the titles that fire on the 1,000 (design §6.5 counts 76; re-derive the exact list at your base from the soak — measure first — and record it), 3 secrets and 3 presentations each (≈456 lines). Mirror EXACTLY the record shapes today's draw sites produce (find them: the card's secret and presentation draws in `src/generators/npcGenerator.js` and `src/generators/people/`; `NPC_CRIMINAL_SECRETS_BY_HOLDER` carries `{ secret, stakes }`; `NPC_PRESENTATION_MODES` carries `{ impression, disposition, behaviour }` keyed by MODE). If a title-keyed presentation cannot coexist with the mode keying without a wiring decision, write the lines in the shape that keeps both (the mode stays the outer key or the title lines carry the mode) and put the question in your record with the default you took — car 4 wires it.
4. `docs/allegiance/WRITE_PEOPLE_2026-11-08.md` — the record (the title list and its measurement, every judgment call with your default, the statement that every line is listed in the data files FOR THE OWNER'S VETO).
5. The dated roster: `tests/lint/.source-citation-baseline.json` `dated` +1 with a `_rosterGrowth…` note and the walker header's dated line, as the chair's own commits do.

## 3. The work

Measure first: a soak at your base for the real fills (names, titles, houses, the criminal houses and powers that hold handlers, the vectors on today's corrupt cards). Every line: a plain statement of the people, what binds them and what it costs, in a player's words; no ornament; no tic; read against the record. Gates: eslint on your code files, your tests green, the roster walker's dated count green (its `tree` count reads 109 against 112 at the base — MERGE-CAR's line; do not touch it); every gate read with `sh scripts/gate-tail.sh`.

## 4. What you must not do

No wiring (car 1 wires the tie lines; cars 2 and 3 the DM lines; car 4 item 15). No edit to `npcData.js`, `relationshipArchetypes.js`, `ties.js`, `poolMap.js`, `npcGenerator.js`, any golden fixture or register. No goal lines (WRITE-GOALS holds them).

## 5. Hand-back

Report: the branch tip and the commit of the FIRST push (the handler tie lines); the counts by file and cell; the title list; the judgment calls with your defaults; the gates' exit codes. Commit trailers:
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FE9mEvGxnFx6WTBkEC6ie9
```
