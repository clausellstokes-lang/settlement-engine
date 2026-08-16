# MB / MB-4 — the two riders (member 3 of `mb`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `752b1bbc36672bc54e6bbed67284f8a0ba5e0a32`
  (the `gvf` terminal; the micro-batch's fourth train base)
- **Train:** `mb`, family **MB**, member **3** of 3.
- **Preamble:** none — MB is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§94.2iv** · **§137** · **§142**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.4, annex rows `MB.M12`, `MB.M13`.

---

## §1 · RIDER A — THE THREE DEAD PURCHASE-KIND READS (`MB.M12`)

DOM-3 abolished the Founder purchase path: a chair is given, never sold, and `PricingPage.jsx:214`
now carries `⛔ NEVER kind:'purchase'` in its own words. `FounderCharterBand` still read
`cta.kind === 'purchase'` in **three** places — the `disabled` condition, the `isConfigured`
import that only fed it, and the `variant` ternary. TE24 deliberately deferred the first two and
named it a two-liner; the third is the compile's addition.

⚠ **THE VARIANT ARM IS REMOVED AS A WHOLE DEAD CONDITIONAL, NOT BY DELETING THE NAMED ARM.**
`isPrimaryCta && cta.kind === 'purchase'` is always false, so the rendered variant is always
`'secondary'`. Deleting only the purchase arm would leave `isPrimaryCta ? 'primary' : 'secondary'`
and let the prop newly elect a band the file's own comment says it can no longer elect — a
BEHAVIOUR CHANGE wearing a cleanup's name, and precisely the hazard the compile flagged. The prop
is still accepted by callers and is now explicitly unread.

## §2 · RIDER B — THE XLS-4 QUALIFIER (`MB.M13`)

`activeConditions.js` claims condition archetypes map **1:1** to delta templates. §94.2iv closed
the 13-row gap BY MEASUREMENT — the silence is deliberate and machine-pinned with an anti-drift
arm — but the header still reads bare, inviting a reader to assume every archetype carries a
delta. The qualifier records that the 1:1 describes the KEYING, not the coverage, and points at
the ruling. **Comment-only.**

## §3 · SCOPE AND BOUNDARY

Two files, no behaviour intended to change. It does not touch the seat meter, the copy, the
`isPrimaryCta` prop contract, the delta table, or the anti-drift pin.

## §4 · ACCEPTANCE

| id | case |
|---|---|
| A1 | all three purchase-kind reads are gone, including the import |
| A2 | the rendered variant is unchanged (`secondary`), not newly electable by `isPrimaryCta` |
| A3 | the band's existing pins pass untouched |
| A4 | the 1:1 header carries its measured qualifier and its authority |

## §5 · CHECKS

```
npx vitest run tests/ui/pricingPageBands.test.jsx tests/domain/activeConditions.test.js
```

## §6 · MUTANTS AND HAZARDS

- ⚠ The compile warned that removing the `variant` arm can change a rendered variant. It was
  removed in the direction that CANNOT: the whole conditional collapses to its constant value.
  No band pin asserted the dead branch, so no test needed curing — checked rather than assumed.
- ⚠ **Same-seed: NEUTRAL.** Presentation plus a comment.
- ⚠ **Census:** no test FILE is created or deleted, and this member adds no title.
