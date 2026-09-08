# LANE: PROSE-REBASE — rebase the sealed src/ prose car (1,001 cured reader sentences across 200 paths) onto the landed tip
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · POSITION 0 of the lighting wave per LIGHT-PLAN · a DECLARED same-seed text shift⟧

## READ FIRST
1. `$SC/briefs/_PREAMBLE.md`.
2. `git show refs/preserve/light-plan-2026-09-05:PLAN.md` — §3 (THE 13TH DECAY: the rebase has quadrupled, 2 → 8 overlapping
   paths, the table with per-side line counts) and §6 POSITION 0 (why PROSE lands first: it is the only cost in the arc
   that is measurably growing; the voice baseline is shrink-only and already refuses a raise; and 113 of its 200 paths
   are engine-side `src/domain` modules that emit text — prose → probe, never probe → prose).
3. The sealed prose car: `refs/preserve/srcprose-2026-09-03` = `8f4d5c648`; merge-base with the tip = `30c1667bc`
   (fixed). Run `git log --oneline 30c1667bc..8f4d5c648` FIRST to learn how many commits the seal holds (the record says
   ONE car; verify) and read every commit body — the receipts of what was cured are there.

## YOUR DOCK
`$SC/lanePROSE`, detached at the landed product tip **`df7cdd37e`**. Porcelain 0 at start. The ANCHORS consist (4 cars,
none in the overlap set) lands next; the chair replays your cars onto that tip. Do not rebase onto anything else.

## THE ACT
1. **Cherry-pick the prose car(s) in order onto `df7cdd37e`.** Expect conflicts on exactly these 8 paths (re-derive the
   set with `git diff --name-only 30c1667bc 8f4d5c648 | sort` ∩ `git diff --name-only 30c1667bc df7cdd37e | sort`):
   `docs/content/RECEIPT_POOLS_LEGACY.md` · `src/domain/display/defenseDisplay.js` · `src/domain/display/dossierViewModel.js`
   · `src/domain/display/settlementRumors.js` · `src/domain/region/propagation.js` · `src/domain/rulingPowerCoup.js` ·
   `src/domain/worldPulse/npcLadderKernel.js` · `src/domain/worldPulse/warReceiptPools.js`.
   Resolve each by KEEPING the mainline's structural change AND applying the prose cure to the sentence. Never drop a
   cure silently; never revert a mainline change. If a cured sentence no longer exists on the mainline, mark it RETIRED
   with the reason. Table every resolution: path · prose side · mainline side · what you kept · the resulting line(s).
   ⛔ A resolved file is proven by MODULE EVALUATION (`node -e "import('./path')"`), not by the absence of `<<<<` markers —
   a textual merge once fused two frozen rows and vanished an id with no marker left behind.
2. **The car's own owed re-records** — the driven-corpus constants (8 files / 11 assertions per LIGHT-PLAN; prose-numerics
   rows are path-and-line addressed, so a cure MOVES them). Re-record ONLY where the delta is the cured text or pure line
   drift; anything else is a finding — STOP on it and report.
3. **Measure the shift.** Of the 200 paths, 113 are `src/domain` outside `display/`. Enumerate the engine-side paths whose
   EMITTED strings change (not merely docblocks/comments): that is the N in the declaration the chair owes LGT-REG-DECL —
   *"1,001 reader sentences across 200 paths were cured; emitted text moves on N engine-side paths; no rules value, no
   preset and no flag moved."* Prove the last clause: `git diff` of the rebased span against `simulationRules.js`, every
   preset table and every `FLAG_DEFAULTS` site must be EMPTY.
4. **Proof.** Every test touching the 8 files · `npx vitest run tests/lint/` WHOLE (exit + failing-arm list; only
   `clampPrimitiveBaseline` may be red) · `tests/copy/voiceMechanics.test.js` and `tests/copy/proseLeak.test.js` — EXPECT
   reds where the shrink-only voice baseline must FALL; report the exact before/after magnitudes and DO NOT set
   `UPDATE_VOICE_BASELINE` (the chair banks the fall at the landing) · `npm run typecheck:domain:strict` exit 0 ·
   `npx eslint` on every touched file · one fixed-seed run of a consumer reaching an engine-side cured path, before and
   after, diffed, as the shift's receipt. Quiet-window law + mutex before ANY vitest (a chair gate is running now).
5. Receipt `$SC/receipt-prose-rebase.md`: PARTIAL header first; the 8-row resolution table; RETIRED cures; the re-record
   table; N with the path list; the register deltas predicted (voice baseline FALL magnitudes · writer-reach · ratchet
   totals · prose-numerics relocations); every exit quoted; a RETROVALIDATION ROW.

## ⛔ FENCES
No register acts (voice baseline, writer-reach, ratchet, prose-numerics freeze are the chair's). No new test file. No
`--amend`; commit per act (the rebased car(s) keep their original authorship; your re-record is its own car). Trailers
`Seat: Opus 5 — Fable-unvalidated` and `Lane: PROSE-REBASE` on YOUR cars; a cherry-picked car keeps its own trailer. No
`npm run build`, no `npm install`, never touch `node_modules`, no `git stash`, no `git add -A`. zsh: `${sha}:path`.
