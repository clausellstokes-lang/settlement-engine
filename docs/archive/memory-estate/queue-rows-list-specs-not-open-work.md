---
name: queue-rows-list-specs-not-open-work
description: "⚠️ SOL_QUEUE dictation-corpus rows name SPECS, not open work — check git before building, and beware specs that predate a landed surface (the LD-5/Messages hazard)"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T13:26:18.127Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

Two coupled hazards, both CONFIRMED on 2026-08-03 while a lane was dispatched to
"implement operator messages end to end". It was already fully implemented.

## 1. A queue row is not a work item

`docs/SOL_QUEUE.md` item 21 ("the 2026-08-02 dictation corpus") lists surfaces by
name: Founders' Hall · profile identity + civility guard · operator messages ·
LD-1..LD-11 · the About split · DESIGN_GALLERY_SHOWCASE · DESIGN_AI_CHAT_SURFACE ·
the Bound Book register. **Several of these had already LANDED when the row was
written, and the row carried no build markers.** Operator Messages was complete at
`59d298d3` + `3b0ba465` — both ancestors of HEAD — yet was dispatched as greenfield.

**How to apply:** before building anything named in a queue block, run
`git log --oneline -- docs/<ITS_DESIGN_DOC>.md` and read that doc's trailing
PROGRESS blockquote. Two commands settle build state. Re-implementing a landed
surface destroys working code, so this check is mandatory, not optional. Item 21
now carries a ⚠️ note saying exactly this; the remaining rows' build state is still
unverified.

## 2. A spec written before a surface landed will delete that surface

`docs/FIRST_CONTACT_BACKLOG.md` LD-5 (ribbon dropdowns + Account IA, written
2026-08-01) specifies Account ▾ as exactly six items and six deep links. The whole
file contained **zero** occurrences of "message" (`grep -ci message` → 0). Messages
shipped 2026-08-02. **Building LD-5 verbatim would delete the landed Messages row
and the unread badge's second render point — the hover swap the owner ordered by
name.**

The subtle part, and the reason this is worth remembering: **the code was already
guarded.** `tests/components/accountMenuMessages.test.jsx` reds if the row or
either badge arm is removed. But the red would arrive looking like *stale test
debt*, because the spec is the authority and the spec says six. A guard only stops
a regression when the document that authorizes the regression also carries the
warning.

**How to apply:** when a surface lands ahead of a spec that touches the same
control, amend BOTH documents — the spec (so a builder following it cannot be led
into the deletion) and the design doc (so the seam is discoverable from its own
side). Name the guarding test in the spec and say explicitly that its red is a
real regression, never a re-baseline target. Done here at `03d8ebee`.

Two further LD-5 corrections landed with it, both CONFIRMED against the tree:
- The deep-link param is **`?section=`**, not LD-5's `?tab=` (never built).
  Writing `?tab=` breaks the reply deep link `?section=support&message=<id>`.
- LD-5's "NEW WORK: AccountPage's section is local `useState('profile')` with no
  route read/write" is stale — the props + URL sync landed at `59d298d3`. The
  section allowlist is DERIVED from `ACCOUNT_SECTIONS`; keep it derived, or
  `messages` silently drops out of the deep-link grammar.

## Operator Messages, for the record

Complete and pinned. Re-verified live 2026-08-03: 11 vitest files / 88 tests green;
Deno groups (worker + operatorMessageEmail + twoKey) 25/25. Spec §1–§8 audited, no
gaps. It adds **no store actions**, so the operationRegistry + gen:compendium-data
obligation does not fire; and the VH-1 payload veil does not apply, because its two
payloads (caller-scoped RPC rows, own-data export) are operator-authored or
self-owned, never a public payload carrying another user's authored name.
