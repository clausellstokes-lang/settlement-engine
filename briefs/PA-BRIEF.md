# THE REALM'S PAST (PA) — the program brief (the cloud chair, session 01QuxWCMgVdyKhCNZL3c98y5, 2026-10-23)

## The owner's words (2026-10-23), verbatim, in order
They came on an assessment pasted from the map program's session. That assessment pairs the map with the FP and proposes "A realm pre-history at birth. Run the FP for a chosen span of years before the DM's first week, then hand over, the way our settlement generator replays a dossier's history before drawing the town" and "Named polities from day one. The sway already finds realms from vassal chains, and the world's naming stage can name them."
1. "Thoughts on this?"
2. "I would say that rather than run the FP a few years into the future, make it additive to each’s past history and run it some time from the past, nothing that changes the current history but something that builds their relationship starting with the oldest and second oldest’s history."
3. "Nothing that changes the current dossier as if intended by the user"
4. "Abd these facts can be vetoed or changed by user before first advance"
5. "Please integrate it into the architecture"

## What it is (the chair's reading, vetoable)
A born world's relationships start blank (to be confirmed by measurement). Every settlement arrives with its own dated history from `src/generators/historyGenerator.js :: generateHistory`:
- `history.founding`: age, reason, foundedBy;
- `history.historicalEvents[]`: name, type, yearsAgo, severity, lastingEffects;
- `history.currentTensions[]`, some of them made from an abstract `config.neighborRelationship`.

No town's past touches another town's. THE REALM'S PAST gives the realm a shared past by replaying it over those histories, oldest first. The clock starts when the second-oldest settlement is founded, the first moment two towns can know each other, and each later town joins at its own founding. The map session's alternative, running the FP forward for some years before the first week, is declined by the owner: it would change the generated present.

## The owner's laws (THE OWNER'S rows ⭐ — never delegated; wording vetoable)
- **PA-L1 THE DOSSIER IS CANON.** Every settlement's current dossier, generated or edited, is what the user intended. The past is built around it, never into it:
  - it lives in its own layer and points at a dossier's events by reference;
  - it adds only what the dossier allows: it may explain a raid the dossier records, but never invents a conquest, a change of rulers, a lost population or a faith the dossier does not show;
  - the present-day ties it creates agree with the dossier's present;
  - a user's later edit to a dossier wins, and the past re-reads it.
- **PA-L2 THE PAST IS THE USER'S UNTIL THE FIRST ADVANCE.** Every fact of the past is the user's to veto or change before the world's first advance:
  - each fact is shown with its cause and the dossier event it explains;
  - it can be struck, changed, kept or re-rolled, for one town's ties or the whole realm, with the knock-on shown first;
  - a user's choice is intent, and the rest is re-derived around it deterministically;
  - a contradiction with a dossier is flagged, never silently applied;
  - at the first advance the past becomes history like any recorded event.
- **PA-L3 FROM THE PAST, NEVER FORWARD.** The past is replayed over the dossiers' own histories. No forward run before the first week changes the generated present.

## The chair's proposals to grade
- (a) **One realm timeline** from the dossiers' dated events and founding ages, oldest first.
- (b) **LINKING:** a recorded event (a raid, a siege, a plague, refugees, a schism, a founding by settlers) gets a counterpart that existed then and was within reach. If none fits, it stays local; a link is never forced.
- (c) **GROWING:** between events, each owning program's own relationship rules run on a coarse step (a year, or event-driven) in a relationship-only mode: contact, regard (THE RENOWN's half-life), pacts, vassal ties (whence named polities), trade, faith contact. Only lit programs grow; dark ones skip.
- (d) **The past's layer:** the same ledgers the FP already uses, with entries marked as past, never a second store. A pin holds every dossier byte-identical before and after.
- (e) **A short REALM BRIEFING at handover**, not the whole chronicle: who founded whom, the grudges still alive, the last war. Each court remembers its own version (belief vs truth).
- (f) **After the first advance**, a dossier edit drops only the link to a removed event, and the history stands.
- (g) **PA mints no engagement kind** (the proposed past is not a hearing).
- (h) **Where it sits:** after THE INSTRUMENTS BEFORE C0 and before the release's world-birth changes. A first version uses what has landed (pact formation, the dossiers' histories).

## Known hazards (read before you write)
- **Vocabulary.** These words are TAKEN (the fold §5): "seal" (Edit Mode's one-week directive), "DRAFT" (the unmeasured-constant mark the ratchet counts), "pin" (a test), "lens" (a map layer). PA's states need their own words through the §5 homonym check. "chronicle" is LANDED (the Herald's).
- **Independent generation.** The dossiers were generated one at a time, so a dossier's abstract hostile neighbour or trade partner may match no town in the realm.
- **DARK volumes.** The FP volumes are designed and DARK: growing through an unbuilt program waits on its wave.
- **Instruments.** Determinism, per-tick cost and the birth door (+30 keys, OD-FC-62) are THE INSTRUMENTS BEFORE C0 (fold §6).

## Paths (this cloud session)
- KIT = /tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit
- THE DOCS = /home/user/fp-p8/docs: master's consolidated FP texts, equal to master after PR #64.
- THE CODE OF RECORD = /home/user/master-code-of-record: master's code at 81f1cd963, which is unchanged in `src/` on master today. READ-ONLY; cite by `path :: symbol`.
