# DA / DA-B2 — the eight bare-locale sites, then the guard that could not be widened

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `1596b16590216e8a4f5330696689b0f7d595ef38`
- **Train:** `da-b`, family **DA**, member **3**. Change paths disjoint from DA-A3 and DA-A4.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§69.4** (fix-then-guard) · **§113.2**
  (J-TC21-2 SIGNED: da-2 re-keyed by NATURE, all eight cured before the guard extends, and
  the extension CORRECTED to ban the BARE FORM rather than the method).
- **Compile of record:** `laneTC21-DA-PLAN.md` §4.6, annex rows DA.M5, DA.M6.

---

## §1 · THE DEFECT — TWO OF THEM, WITH ONE CAUSE

A bare `.toLocaleString()` reads the **host** locale, so one seeded world renders differently
to different readers: a de-DE reader saw `8.000` where an en-US reader saw `8,000`. Eight
display sites did this, and §69.2 called them "the eight `formatCount` sites" — but **three
of them are DATES, not counts** (DA.M5), which is why J-TC21-2 re-keyed the member by NATURE:

| site | nature | cure |
|---|---|---|
| `pdf/sections/Cover.jsx:150` | count | `formatCount` |
| `settlement/WhatChangedPanel.jsx:136,138` (×3) | count | `formatCount` |
| `screen/DmScreen.jsx:52` | count | `formatCount` |
| `compendium/CatalogTabs.jsx:59` (×2) | count | `formatCount` |
| `map/RealmForecast.jsx:162` (×2) | count | `formatCount` |
| `account/AccountAiKeysSection.jsx:46` | date | explicit `'en-US'` |
| `admin/AiPricingResyncPanel.jsx:35` | date | explicit `'en-US'` |
| `account/AccountSecuritySection.jsx:42` | date | explicit `'en-US'` |

⭐ **`Cover.jsx` was not even a locale bug — it was a document contradicting itself.**
`num()` returns an UNGROUPED `String(Math.round(n))`, so the PDF cover read `8000` while
`Overview.jsx:39` **in the same document** read `8,000` through `formatCount`.

⚠ **`RealmForecast.jsx:162` is cured HERE, not in DA-B3.** The compile parked it with DA-B3
purely because that member owns the file for the worker seam — a file-ownership convenience,
not a dependency. But §113.2 requires **all eight** to cure before the guard extends, and
leaving this one would have made the guard red on arrival. DA-B3 takes the file in `da-c`,
where this member's landing has already released the reservation.

## §2 · THEN THE GUARD — AND THE OBVIOUS EXTENSION IS THE WRONG ONE

⛔ **Adding `src/components` and `src/pdf` to `localeFormatGuard`'s `TREES` reds 33 files, 26
of them carrying only the explicit `'en-US'` renders the Wave-4h ruling expressly sanctions.**
That is exactly the red-a-green-tree failure §69.4 exists to prevent. The display layer is
where locale formatting LEGITIMATELY enters — the temporal audit's own boundary table says so
— so the sim-path ban cannot simply be widened onto it.

The display-tree arm bans the **BARE FORM** only: no locale argument, or `undefined` as the
first argument, which is the same host-locale read in a costume. The explicit form stays
sanctioned, which is what makes this a *different* detector rather than a stricter one.

**Three arms, because a source-scan negative alone proves nothing:**

1. a **positive control** — the detector catches `toLocaleString()`, `toLocaleDateString( )`
   and `toLocaleString(undefined, …)`, and ADMITS `toLocaleString('en-US', …)`;
2. the ban itself, over both display trees;
3. an **anti-vacuity** arm — the sanctioned explicit form must still be PRESENT in those
   trees. Without it, "zero bare calls" would keep passing after somebody deleted the entire
   class, for a reason having nothing to do with this ban.

## §3 · SAME-SEED POSTURE

**NEUTRAL.** `formatCount` is documented byte-identical to `toLocaleString('en-US')` over the
integer domain, so grouped output does not change on an en-US host. What changes is that a
de-DE host stops rendering `8.000` — that is the cure. Nothing persisted or hashed is
touched; these are all display call sites.

⭐ One output DOES move and it is the point: `Cover.jsx` now groups, so the PDF cover agrees
with its own Overview page.

## §4 · SIZE

Largest file touched is `AiPricingResyncPanel.jsx` at **324/600**; `Cover.jsx` sits at
303/800. Nothing is near a ceiling and no file carries a `scripts/.size-baseline.json` entry.

## §5 · STOP CONDITIONS

1. The guard is extended by adding the display trees to `TREES` — the refused shape.
2. Any of the 26 sanctioned explicit `'en-US'` renders is touched.
3. The guard lands before the eighth site cures.
4. `formatCount` gains an import, or starts formatting through the host locale.
