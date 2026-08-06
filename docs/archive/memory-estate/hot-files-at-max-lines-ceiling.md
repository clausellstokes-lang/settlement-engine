---
name: hot-files-at-max-lines-ceiling
description: "⚠️ HAZARD: five hot engine files sit AT their unraisable max-lines ceilings (pulseKernel, npcAgency, warDeployment +2) — new engine logic goes in NEW LAZY LEAVES reached via re-exports, never direct additions; corruption.js is EAGER (dark-path params cost first-paint bytes)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
  modified: 2026-07-26T19:14:37.687Z
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
