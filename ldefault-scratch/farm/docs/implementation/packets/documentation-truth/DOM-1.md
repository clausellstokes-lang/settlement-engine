# DOM / DOM-1 — the hand-typed machine figures, derived or deleted

- **Status:** LANDED
- **Landed at:** `77111b58`
- **Verified base:** `claude/composite-r4` at `30638bb77f188a6bc4a8017bc53c74b63a05cb71`
- **Train:** `dom`, family **DOM**, member **1**. Change paths disjoint from DOM-2
  (`docs/DEPLOY.md` + its freshness walker) and from DOM-4 (`src/copy/en.js` +
  `tests/docs/docCounts.test.js`).
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§87.1** (the ruling) · **§115.1** (J-TC22-1
  and J-TC22-2 signed).
- **Compile of record:** `laneTC22-DOM-PLAN.md` §3.1, annex rows DOM.M2..M13, DOM.M30.

---

## §1 · THE DEFECT — SEVEN DOCUMENTED FIGURES, EVERY ONE OF THEM STALE

| site | the doc said | the tree says |
|---|---|---|
| `README.md` "The gate" | the chain runs **fourteen** stages | the `check` chain has **17** |
| `ARCHITECTURE.md` test:ratchet | a census of **49** failures across **34** files | the census file holds **11** across **6** |
| `CONTRIBUTING.md` test ratchet | **35** known failures | the same **11** |
| `ARCHITECTURE.md` test step | **~20,100** tests / **~1988** files | **2438** test files on disk |
| `ARCHITECTURE.md` routing | NAV lists **seven** labels, including Welcome | `lib/routes.js` derives **six** |
| `ARCHITECTURE.md` worldPulse | **~378** modules | **410** |
| `docs/CURRENT_STATE.md` | head **192**, **71** ahead of production | head **195**, **74** ahead |
| `check-full-typecheck.mjs` + its pin | typecheck is step **9** of a **14**-step chain | the ratchet is step **12** of **17** |

Plus one pointer that resolves and points at the wrong enforcer: `ARCHITECTURE.md`'s
`aiGroundingBundle` sentence carried `@enforced-by ...analyticsEventsBundle.freshness...`.
Because the target RESOLVES, `enforcedByExists` passes — a citation can be wrong and green.

## §2 · THE RULE THIS MEMBER LANDS BY

⭐⭐ **EVERY FIGURE IS DERIVED BY A PIN OR DELETED AND REPLACED BY A POINTER. IT HAND-TYPES
NOTHING IT CAN AVOID.** The compile's own recommendation — replace the census figure with a
fresh one — died inside the compile window: the baseline moved twice (16 entries, then 12,
then 11) while the plan was being written. Re-typing is not a smaller version of the bug; it
IS the bug, one iteration later.

Where a figure survives, it survives because a pin derives it: the worldPulse count sits
inside an existing ±20% band, and the two migration figures gain a new exact pin.

## §3 · THE FOUR NEW PIN ARMS, AND THE ONE THAT WAS REWRITTEN

- **README states no gate-stage count** (`architectureFreshness.test.js`). The reader accepts
  numerals and spelled-out words, and any count it finds must equal the derived chain length.
  A CONTROL feeds it the exact prose that was wrong, so its silence means something.
- **The NAV list is derived from `lib/routes.js`** and compared label-for-label, in `nav.order`.
  ⛔ This is the class that rotted UNDER AN EXPLICIT OWNER DIRECTIVE: home lost its `nav` block
  on 2026-08-03 (THE FLETCHED RIBBON) and the doc kept listing Welcome for twelve days.
- **CURRENT_STATE's two migration figures** are derived from `supabase/migrations/` and
  `applied-head.json`. ⚠ `applied-head.json`'s dated `verification` prose is NOT touched: it is
  an evidence record of a 2026-07-28 observation, not a claim about today.
- **Both typecheck headers state the ratchet's real position**, derived from the chain.
- ⚠ **THE SUITE-SIZE ARM WAS REWRITTEN, NOT EXTENDED.** It REQUIRED a `~N tests / ~N files`
  pair and checked only the FILES half inside a ±25% band. That is why a ~7,800-test
  understatement survived: the tests half was never read, and the files half had 159 files of
  margin to rot into. A band wide enough to tolerate drift cannot see drift. The figure is
  deleted and the arm now enforces its ABSENCE, with a positive control that the gate bullet
  still points at `npm run test` and the baseline file.

## §4 · SAME-SEED POSTURE

**NEUTRAL, architecturally.** The member touches four markdown files, one script's header
comment and two test files. No generator, no corpus, no persisted shape, and no AI-bundle
input (all five bundle manifests were checked: zero hits).

## §5 · STOP CONDITIONS

1. A cured figure is re-typed rather than derived or deleted (J-TC22-2).
2. `applied-head.json` is edited, or its dated verification prose is rewritten.
3. `docs/DEPLOY.md` is opened — it belongs to DOM-2 alone (J-TC22-1).
4. `src/copy/en.js` or `ASSESSMENT.md` is touched: those carry the GENERATION-pipeline figure,
   a different referent, and belong to DOM-4 (J-TC22-8).
5. A pin band is widened to fit whatever the tree happens to read (fork DOM.U3).
