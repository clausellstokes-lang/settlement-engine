# FRAME-2 · brief B7 — CF10, counterparts for every crisis kind: MEASURE AND PROPOSE (no source change)

Written by FRAME-2 (the integrating seat) on `lane/frame-2-2026-11-20`. You are a builder of FRAME-2. You MEASURE and DRAFT A PROPOSAL; you change no file under `src/` or `tests/`.

Read whole before you start: `CLAUDE.md`; `docs/DESIGN_CRISIS_TAB.md`; `src/domain/crisis/crisisCast.js` (the roles, `CRISIS_CAST_TUNING`, the fixed rules that give a role to an existing person, the absent reasons, the stand-ins); `src/domain/crisis/crisisHooks.js`; `src/domain/tension/sideArchetypes.js` (the standing trouble's ladder: office, tie, trade, outsider, criminal) for the idiom of a ladder of kinds of face.

## The owner's words (2026-11-20, verbatim)

"make sure there is variability of who is relevant to a crisis where appropriate. Like the lords appointee is not always the one, it could be some other foreigner. As just one example, same with the guild leader and the garrison commander. Maybe the creditor is the criminal faction is some parts?" — and: "And appropriate counterparts for other appropriate crises".

## The ruling (the chair's CF10)

"The thirteen archetypes cover the tension types; for the CRISIS kinds whose cast is thin, PROPOSE counterparts (who stands where a lord's appointee, a guild's head or a garrison's commander stands today: another outsider, a trade's master, the criminal power where the record makes it the creditor), each from the record; build on the chair's word."

## What to measure

A pool of born towns IN CRISIS: at least 20 of each crisis kind that the generator births (find the kinds and how to birth a town in each: the stress types the pipeline accepts; prefer the generator's own option for a forced stress if one exists, else seeds until the kind occurs; say which). For each crisis kind:
1. Each cast role: how often it is filled, by WHOM (classify the person: the seat-holder, the lord's appointee or the office's stand-in, a power's head, the garrison's or watch's commander, a guild's head, a trade's master, a person by a tie, the criminal power or its head, an outsider), and how often it is ABSENT and why (the stored absent reason).
2. THE OWNER'S "USUAL THREE": the share of each kind's named roles held by the lord's appointee / stand-in, a guild's head, the garrison commander. A kind is THIN where the cast is mostly absent, or mostly the usual three, or the same office in nearly every town: state the threshold you use and show each kind against it.
3. For `indebted` (the outside creditor) specifically: who the creditor is on the record today (the creditor power `stressFactions.js` pushes; its face in `src/data/stressPowerFaces.js`), and how often the town holds a criminal power strong enough (the standing trouble's `FRAME_TUNING.criminalMinPower`) that the record could make it the lender.

## What to propose (a proposal, for the chair; nothing built)

For each THIN kind: which counterpart could stand where the usual face stands, each FROM THE RECORD by a fixed rule (an outsider reached through a person who would know them, never named; a trade's master the crisis touches; a person by a tie that speaks of the matter; the criminal power where the record holds one strong enough), with the rule's facts, the rate you would start at (a dial, one frozen table), what it would read on three towns of the kind (plain text, before and after, by hand from the record: say it is drafted, not executed), and what it costs: does it change what generation STORES (the crisis cast is stored on the crisis record: a change there moves stored towns and goldens; say which and how many) or can it be derived at render like the standing trouble's cast. Rank the proposals by the owner's example first.

## Output and commit

ONE file, `docs/chair/2026-11-20/content/frame2/B7-CF10-PROPOSAL-RESULTS.md`: the tables, the thin kinds, the proposals, the measure script whole (it lives in `/tmp/claude-0/-home-user-settlement-engine/a24e1eb5-d90d-5963-a121-dbebc78118f8/scratchpad/b7/` while it runs). Hours from `date -u`. Commit that one path with `git commit -o <path>` (hooks on, never `--no-verify`), message `docs(FRAME-2 · B7): CF10, the crisis casts measured and counterparts proposed`, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_019yED1SkacgZyeUgMMGhdL4`. No push; no reset, stash or checkout; no other path. No GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any command's environment. Other builders are editing source files in this checkout: read only.

Final message: at most 250 words: the thin kinds with their figures, the proposals ranked, which would move stored towns, the sha.
