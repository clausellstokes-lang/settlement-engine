---
name: banked-failures-lie-twice-identity-and-attribution
description: "⚠⚠ A CENSUSED BANKED FAILURE LIES TWICE — its per-TEST identity ABSORBS new instances silently (a 7th naked claim reds nothing new), and its recorded `introducedAt` can be flatly WRONG. Both bit on 2026-08-12; the cure for arm 1 is a SEPARATE PASSING test, never a stronger assertion inside the banked one."
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-12T08:30:47.106Z
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
---

# A banked failure lies twice: its identity absorbs, and its attribution can be wrong

Both arms measured in LANE AB, landed @ `32f4e520` on `claude/composite-r4`
(base `0e5881b6`). Full gate green at those bytes.

## Arm 1 — THE IDENTITY ABSORBS (the widening class)

`scripts/.test-ratchet-baseline.json` keys every banked row on
`<file> :: <full test name>` and **nothing about what the assertion found**. So a
banked test that fails on N instances fails IDENTICALLY on N+1: same file, same
title, same verdict, **not one bit of the gate moves**. Every later instance is
absorbed into a failure somebody else banked.

Live instance: `tests/docs/enforcement-claims.test.js`'s naked-claim pin sat banked
on 6 untagged completeness claims. A seventh — a lane's own, already written on
2026-08-11 — would have been invisible.

### ⛔ THE CURE IS A SEPARATE **PASSING** TEST — NOT A STRONGER BANKED ASSERTION

Tightening the banked test cannot work: it is *already red*, so nothing new can red.
And **renaming it is forbidden** — the title IS the census key, so a rename trips
check-test-ratchet's `vanished` scope sentinel ("baselined, its file is on disk, but
it did NOT RUN") and reds the gate.

So: add a NEW sibling `it()` that passes at the frozen count. Passing ⇒ it is NOT in
the census ⇒ growth reds a green test, which is a regression the ratchet refuses to
absorb, and its message can NAME the newcomer.

- Key the freeze on **(file :: matched vocabulary) with an exact count**, never
  `file:line` — living docs churn line numbers and a guard that reds on unrelated
  prose gets deleted rather than obeyed.
- Give it a SHRINK arm too; it doubles as the anti-vacuity control (a broken scan
  returning nothing reds every frozen row instead of passing).
- ⚠ COST: one new `it` ⇒ the lighting census `titles` moves ⇒ a whole census fold.

## Arm 2 — THE ATTRIBUTION CAN BE FLATLY WRONG

The banked row for deepCraftKillList's `tintedCallouts` recorded
`introducedAt: 531a8488` ("the Founders' Hall page added one more tinted callout").
**Both halves were false.** The count is 163 at `531a8488` AND at its parent. Walking
the ratchet's own pattern over all 500 commits `531a8488..HEAD` found EXACTLY ONE
transition, 163 → 164, at `b441bca5` (GR-0 THE LIFECYCLE VOICE, 2026-08-04).

**Never inherit a banked row's `introducedAt`. Re-derive it** — for a counting ratchet
the walk is cheap and total:

```
for r in $(git rev-list --reverse BASE..HEAD); do
  git grep -h -E "$PATTERN" $r -- 'src/…/*.js' 'src/…/*.jsx' | wc -l
done   # print only the transitions
```

`git grep` at a rev agrees exactly with the test's own JS walker (both read 164 at
HEAD), so the cheap method is the sound one. A pickaxe (`git log -S`) over a *candidate*
would have confirmed the wrong commit; only the transition walk names the right one.

Record the correction where it OUTLIVES the row — the ratchet's own comment block —
because the census row disappears at the next re-freeze and takes its lie with it.

## How to apply

1. Before trusting any "known failure", ask **which** instances it covers. If the
   assertion is `expect(list).toEqual([])`, the answer is "all of them, forever".
2. Fix growth-blindness with a separate passing pin; never by renaming the banked test.
3. Re-derive `introducedAt` by transition walk before repeating it in prose.
4. A cure that greens a banked row is SAFE for the gate: check-test-ratchet prints
   `RATCHET DOWN … run npm run test:ratchet:update` and **returns 0**. The re-freeze
   is a separate, chair-owned act.
