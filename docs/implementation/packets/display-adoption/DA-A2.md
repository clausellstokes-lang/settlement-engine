# DA / DA-A2 — the recorded DM-tool tick allowance (member 1 of `da-a` as landed)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `bd0439d19ec2b3d080b38c083785b103b6e0d545`
- **Train:** `da-a`, family **DA** (un-stamped, cap 4), landed **first** of four. Its change
  paths are disjoint from DA-A1, DA-A3 and DA-A4.
- **Preamble:** none — DA is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§69.3** (the tier split: a raw `Tick N` is
  ALLOWED on a DM-tool surface *with the allowance recorded in-file*, and FORBIDDEN on
  player, public and PDF surfaces) · **§113.3** (the de-vacuification ratified; the 29
  newly-visible hits are cured sites in this train, not baseline entries).
- **Compile of record:** `laneTC21-DA-PLAN.md` §4.2.

---

## §1 · WHAT THIS MEMBER IS

Eight DM-facing instruments render a raw engine tick counter. §69.3 sanctions exactly that
on exactly those surfaces, on one condition: **the allowance must be recorded in the file**.
It never was. This member records it — and does nothing else.

| file | class | count | the site |
|---|---|---:|---|
| `src/components/UndoHistoryPanel.jsx` | tick | 1 | the point label's pre-calendar fallback |
| `src/components/auspice/AuspicePanel.jsx` | tick | 1 | the omen beat's gutter stamp |
| `src/components/map/ChroniclersLetterPanel.jsx` | tick | 1 | the letter's composed-window header |
| `src/components/map/LiveWarStatus.jsx` | tick | 1 | the deployment row's departure tick |
| `src/components/map/TimelapsePanel.jsx` | tick | 1 | the scrubber's frame readout |
| `src/components/map/WorldPulsePanel.jsx` | tick | 2 | the header clock chip; the latest-pulse card |
| `src/components/region/RegionalGraphSummary.jsx` | tick | 2 | "matures in N tick(s)", twice |
| `src/components/region/RegionalImpactInbox.jsx` | tick | 2 | "matures in N tick(s)", twice |

**11 sanctioned counters across 8 files.** Every block names the tier decision, cites §69.3,
says why *this* surface is DM-tier, and carries one machine-readable line:
`prose-leak-allowance: tick <n>`.

## §2 · WHY IT LANDS FIRST, AND WHY IT IS NOT DECORATION

⛔ **THE ORDER IS THE FIX-THEN-GUARD LAW, NOT A PREFERENCE.** DA-A1 de-vacuifies
`proseLeak`'s tick detector, and the widened detector reads these very comments to know
which counters are sanctioned. §69.4's shape — the sites settle first, then the detector
widens, so the widened budget never reds a green tree — therefore makes the recorded
allowance a **precondition** of the widening, not a follow-up to it. Landing DA-A1 first
would have forced these 11 counters into `.prose-leak-jsx-baseline.json` as debt, which is
exactly what §113.3 refuses.

For one commit these blocks are inert comments. From DA-A1 onward they are the thing the
ratchet enforces: delete one and the suite reds; grow a file past its recorded count and the
suite reds; cure a site without striking its allowance and the suite reds too, so a grant
cannot outlive the leak it was written for. There is no allowlist inside the test to drift
out of step with the source — **the comment a reviewer reads in the component IS the rule**.

## §3 · SIZE

`max-lines` runs with `skipComments: true`, so a comment cannot move a ceiling. Measured
with eslint's own `Linter` under the enforcer's exact rule, before and after, all eight:

| file | effective | ceiling |
|---|---:|---:|
| `map/WorldPulsePanel.jsx` | 555 → **555** | 600 |
| `region/RegionalGraphSummary.jsx` | 245 → **245** | 600 |
| `UndoHistoryPanel.jsx` | 187 → **187** | 600 |
| `map/LiveWarStatus.jsx` | 177 → **177** | 600 |
| `region/RegionalImpactInbox.jsx` | 162 → **162** | 600 |
| `map/TimelapsePanel.jsx` | 112 → **112** | 600 |
| `auspice/AuspicePanel.jsx` | 106 → **106** | 600 |
| `map/ChroniclersLetterPanel.jsx` | 105 → **105** | 600 |

Exactly line-neutral, eight for eight. No file in this member carries a
`scripts/.size-baseline.json` entry; the layer ceiling binds.

## §4 · MANIFEST

| # | action | path |
|---|---|---|
| 1..8 | MODIFY | the eight files in §1 |

Handwritten files: **8**. New leaves: **0**. Test files touched: **0** — the census does not
move for this member. `retiredSymbols`: **NONE**.

## §5 · STOP CONDITIONS

1. Any behaviour changes. This member is comment-only; a single moved character of rendered
   prose means it exceeded its scope.
2. Any effective line moves.
3. An allowance is recorded on a surface that is not a DM instrument. The player, public and
   PDF surfaces cure in DA-A1; recording an allowance there would launder the leak §69.3
   forbids.
