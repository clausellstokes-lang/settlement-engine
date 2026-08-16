# DOM / DOM-4 — the onboarding coach counts steps it cannot count

- **Status:** LANDED
- **Landed at:** `612d4b10`
- **Verified base:** `claude/composite-r4` at `30638bb77f188a6bc4a8017bc53c74b63a05cb71`
- **Train:** `dom`, family **DOM**, member **4** in landing order, third to land. It opens
  `src/copy/en.js`, which DOM-3 also opens, so it lands and flips FIRST and DOM-3 is promoted
  only after this packet is terminal — the split promotion the change-path reservation forces.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§115.3** (dom-4 minted).
- **Compile of record:** `laneTC22-DOM-PLAN.md` §9 Q3, annex row DOM.M14.

---

## §1 · THE DEFECT, AND THE MEASUREMENT THAT REFRAMES IT

`src/copy/en.js` told every new user: *the rail on the right shows the **fourteen** steps the
engine took*. That is RENDERED PRODUCT COPY on the first screen after a generation.

§115.3 minted this member to change fourteen to **the measured 22**. ⛔ **MEASUREMENT REFUTES
THAT CURE, AND THE REFUTATION IS THE MEMBER.** The sentence does not describe the PIPELINE. It
describes THE RAIL. `PipelineReveal.jsx` renders the run's history filtered to entries that
have a user-facing label:

| population | count | who defines it |
|---|---:|---|
| steps REGISTERED | 22 | `src/generators/steps/index.js` |
| steps with a user-facing LABEL | 15 | `src/copy/en.js` `pipelineSteps` |
| steps the reader can COUNT on screen | at most 15, and run-dependent | the intersection with that run's history |

Writing 22 would make the copy MORE wrong from the reader's seat: they would count the rail
and find no more than 15. "Fourteen" was most likely true once, when fourteen steps had labels.

## §2 · THE CURE — SAY NO NUMBER, WHICH IS WHAT THE FILE ALREADY DOES ELSEWHERE

The same copy module, one screen later, already reads *"The rail shows the steps the engine
took."* That sentence has never been wrong for any reader on any run. The coach adopts it.

This is J-TC22-2's derive-or-DELETE rule applied to a figure that cannot be derived at all,
because it is not one number: it depends on the settlement the reader just generated.

## §3 · THE PIN

In `tests/docs/docCounts.test.js`, beside the existing product-copy-versus-implementation pins:

1. **The three populations really do disagree** — every labelled step is a registered one, and
   the label map is a STRICT subset. This is the evidence for saying no number, asserted rather
   than described, so a future lane cannot re-add a count believing it safe.
2. **The coach counts no steps** — numerals and spelled-out words, in the coach block only.
3. **A CONTROL** feeds the counter the exact prose that was wrong.
4. **The rail promise survives** — both sentences must still be present, so the absence arm
   cannot green on a deleted section.

⚠ `tests/docs/docCounts.test.js` is PARKED in the lighting census (it registers two tests from
a `for…of` over a file list), so these four pins move that census by zero while genuinely
executing. Recorded so nobody reads the zero as "no tests were added".

## §4 · SAME-SEED POSTURE

**NEUTRAL.** One rendered string and one test file. No generator, no persisted shape.

## §5 · STOP CONDITIONS

1. A number goes back into the coach sentence, in any spelling.
2. The `pipelineSteps` label map is widened to 22 to make an old sentence true — the labels are
   a curation decision, not a mirror of the registry.
3. `ASSESSMENT.md` or `journeyProgress.js` is swept here: same class, not this member's scope,
   and both are recorded as open findings rather than silently dropped.
