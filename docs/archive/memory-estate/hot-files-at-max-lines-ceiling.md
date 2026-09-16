---
name: hot-files-at-max-lines-ceiling
description: "⚠️ HAZARD: five hot engine files sit AT their unraisable max-lines ceilings (pulseKernel, npcAgency, warDeployment +2) — new engine logic goes in NEW LAZY LEAVES reached via re-exports, never direct additions; corruption.js is EAGER (dark-path params cost first-paint bytes)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
  modified: 2026-08-12T20:34:45.607Z
---

Discovered by W-R2-DEPTH (2026-07-16): **five hot engine files are AT their max-lines
baselines** in scripts/.size-baseline.json — `pulseKernel.js`, `npcAgency.js`,
`warDeployment.js` among them — and the baseline is shrink-only (raising is owner-gated
and against the ratchet doctrine). Also: `settlementSlice.js` AT 1345 (NPC wave 2026-07-17 — new store actions go through delegated (get,set) helpers from commitPendingEdits, never inline) and `viewModel.js` (PDF) AT its 1043 ceiling
(SM-4 hit it the same day — new PDF derivations go in SettlementPDF.jsx or another home).

This forced two D6 deferral-seams (naval-interdiction leg, exposure-discount leg) and
cost DEPTH-1 real iteration.

**Why:** any wave that adds even an import line to a capped file fails the pre-commit
lint; agents burn cycles discovering this mid-build.

**How to apply:** engine-wave briefs must state it up front. The working patterns:
(1) NEW LAZY LEAF + re-export through a file the capped file already imports (DEPTH-1's
`realmScaling` symbols reach `pulseKernel` via a `narrativeTempo` re-export — zero new
import lines); (2) move logic OUT of capped files into leaves when touching them anyway.
Additional trap: `corruption.js` is in the EAGER first-paint closure — a parameter added
there for a dark path measured **+23 eager bytes** and was reverted; never grow eager
files for dormant features. Related: [[comprehensive-review-fix-program]].

**2026-07-19 additions (C4 Panel D):** `App.jsx` sits at its EXACT 732 ceiling — every
App.jsx edit must land net-zero on code lines (Panel D offset a lazy() decl by deleting
a dead import). Second trap: a JSX `{/* … */}` comment COUNTS as a code line under
max-lines (the braces are code tokens), unlike a `//` line — this silently pushes files
over. Also `pulseKernel.js` confirmed at 1387/1387 by T-4: mover ordering cannot be
changed by edits there (drove T-4's in-transit-column read divergence).

**2026-07-26 additions (history-reroll fix).** Two corrections and a technique:

- `settlementSlice.js` is now baselined at **1265**, not the 1345 above (it shrank; the
  ratchet locked the win). Still tolerance-0 both directions.
- **The capped set is bigger than scripts/.size-baseline.json.** A file can sit at its
  LAYER ceiling with no baseline entry at all: `src/generators/narrativeGenerator.js`
  measured **799 effective lines against the 800 generator ceiling** — one line of
  headroom, and invisible in the baseline JSON because only files ABOVE their layer
  ceiling get an entry. Check the layer ceilings in eslint.config.js too (generators 800,
  domain 800, components/**.jsx 600), not just the baseline file.
- **How to measure exact effective lines** (skipBlankLines + skipComments, no guessing):
  `npx eslint --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}' <files>`
  — the error text reports the true count per file. Do this BEFORE designing where new
  code lands; it turns "will this fit" from a rebuild-and-see into one cheap command.
- The cure that worked at 799/800: **move the shared function OUT into a new leaf and
  import it back.** Extracting `buildStressProfile` + the siege string-filter into
  `src/generators/narrative/historyCoherence.js` dropped narrativeGenerator to 759 (+40
  headroom) AND gave the reroll path one source to share — the same move the file's own
  `STRESS_DESCS → src/data/narrativeData.js` comment records. Verify such a move is
  behavior-neutral with a same-seed before/after fingerprint, never by inspection.

## ⛔⛔ 2026-08-12 (Lane AL, the IN-1b promotion): `OutputContainer.jsx` = **599 of 600**, and a DELEGATED figure claimed 582

**MEASURED at `claude/composite-r4` @ `b17d32d2`, two independent ways** (a standalone
eslint `Linter` flat-config run, and `npx eslint --rule` through the repo's OWN config with
`max` forced to 1 so the message reports the true count): **`src/components/OutputContainer.jsx`
is 1,054 raw / 599 EFFECTIVE against the hard 600** `src/components/**/*.jsx` layer ceiling,
with **NO** `scripts/.size-baseline.json` entry (10 entries, none of them it) and no
`max-lines` disable. ⇒ **ONE effective line of headroom.** Same class as narrativeGenerator
at 799/800 above: at its LAYER ceiling, invisible in the baseline JSON.

⚠⚠ **THE TRANSFERABLE LAW — A DELEGATED EFFECTIVE-LINE FIGURE IS NOT A MEASUREMENT.**
The IN-1b packet draft carried "**~582 effective, ≈18 lines of headroom**" as a *delegated*
census-agent figure and budgeted a **six-line** edit against it. The real figure is **599**
— **wrong by 17 lines, and in the dangerous direction.** The draft's own §15 flagged it as
"the single most load-bearing unverified figure", and the chair converted it into an
EXECUTE-AT-PROMOTION gate; that gate is the only reason a six-line edit did not get
authorized into one line of room. **Never inherit an effective-line count from a subagent,
a prior packet, or a prior session — re-run the Linter yourself, in the tree, at the sha.**

⭐ **AND MEASURE THE EDIT, NOT JUST THE FILE** — the two are different questions, and the
budgeted number is usually not the spent number. Simulating the edit in scratchpad (read the
file, string-replace, re-measure; never write the worktree) showed the drafted change costs
**+1 effective line, not six**: its two `case` returns are single lines that absorb new props
inline at **zero** effective cost, and only the one new `const` adds a line — landing the file
at **exactly 600**, which PASSES (`max-lines` reports only when count **>** max) at zero
remaining headroom. A props-only variant stays at **599**.

⚠ Related trap found in the same pass: the draft sited that new `const` "beside
`viewerIsPremium` at :262", but **`publicDossier` is not declared until :448** — a const at
:262 reading it is a temporal-dead-zone `ReferenceError`. **Check declaration ORDER when a
packet names an insertion line by number.**

**How to apply:** before designing where code lands in any `src/components/**/*.jsx`, run the
`npx eslint --rule` command above. Treat 595+ as no-room. `OutputContainer.jsx` is a
god-component the eslint config's own comment records as decomposed from 1019 → under 600; it
has since crept back to 599 and **rejects essentially any added effective line**.

⭐ **OUTCOME — the chair RULED and it is now packet law (CR-IN1B-7, landed `6ad9f8dd`).** The
props-only shape was ADOPTED and spending the last line was **declined**: passing at exactly 600
is not a margin, and the next packet to touch the file would inherit an impossible position. The
container passes raw viewer facts (`viewerIsPremium` / `playerView` / `publicDossier`) down
inline on the existing single-line switch cases and the child tab composes the gate — **the
landed `'rumors'` case shape**, which is the reusable answer whenever a container must hand
authority to a tab at zero line cost.

⭐⭐ **A STANDING HOT-FILE RULE NOW EXISTS**, at `docs/implementation/packets/foreign-policy/IN-1B.md`
§3.11 (the chair propagates it to `PACKET_STANDARD.md` at the next prose batch):
**`src/components/OutputContainer.jsx` (599/600) and `src/domain/worldPulse/peaceTerms.js`
(797/800) are the HOT-FILE LIST.** Any packet naming either one **opens with an executed
headroom measurement** and **shapes its edit to net ZERO effective lines** (props inline,
one-line-for-one-line replacement, or an offsetting combine) — or it STOPS and returns to the
chair. Never baseline the file, never raise the ceiling, never decompose a god-component to fit
a feature in.

⚠ **Also found in the same pass, and it generalizes:** a packet that names an insertion site by
LINE NUMBER can be proposing a temporal-dead-zone bug. The draft sited a new `const` beside
`viewerIsPremium` (`:262`) that read `publicDossier`, which is not declared until `:448` — a
`ReferenceError`. **Check declaration ORDER, not just that the identifiers exist.**
