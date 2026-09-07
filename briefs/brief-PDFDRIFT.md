# LANE: PDFDRIFT — the same settlement must export the same arms from every button (a DECLARED paid-surface repair)
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · repair class under the 09-04 carve-out (only the push and the walk stay gated) · the change is DECLARED, never absorbed⟧

## THE FINDING (WARMS-CAR0 `SKEPTIC.md` C5, sealed `refs/preserve/warms-car0-2026-09-05`; re-derive every line)
Four PDF export entry points exist and every export is premium (`authSlice.js:48-50`). Two thread the owning `campaign`
through `resolveExportSeam(liveStore, saveId)` (`src/components/settlementDetail/resolveExportSeam.js` — a plain-cloneable
`{ campaign: { …, nameById }, faithUnlocked }`); **two thread NO campaign at all**:
- `src/components/settlements/SettlementCard.jsx:115` — `generateSettlementPDF(s.settlement, { phase: canonPhaseOf(s) })`
- `src/components/SingleDossierSuccessPage.jsx:183` — `generateSettlementPDF(settlement, { isAnonymous: false })` (post-purchase)
(`ExportDraftButton.jsx:64` passes `campaign: null` deliberately and correctly — a draft has no campaign.)
So a settlement that belongs to a campaign exports **different artefacts depending on which button was pressed** —
campaign-resolved from the dossier, campaign-less from the Library card and the purchase page — silently, on paid surfaces.

## THE RULING (Fable 5.1): option (a) — route both entry points through `resolveExportSeam`, so every export of a
settlement resolves the same campaign (or `null` when it has none). Consistency is the repair; the visible change is that
the Library card's and the purchase page's PDFs now carry whatever the seam resolves (today: the campaign payload the
dossier export already carries; after W-ARMS: the quartered arms). This is a DECLARED paid-surface behaviour change; the
chair records it on the ledger; you measure and state exactly what differs per surface, before and after.

## YOUR DOCK
`$SC/lanePDF` at **`df7cdd37e`**. Read the two sites and their callers WHOLE, `resolveExportSeam.js` WHOLE, the dossier's
own export path (the entry point that already threads the seam) as the pattern, and `liveWorld.js:130-135` (`nameById`).

## THE ACT
1. Re-derive the four entry points (grep `generateSettlementPDF(`), which thread `campaign`, and the seam's contract
   (what `liveStore` and `saveId` are at each site — the card has `s.id`; the purchase page must have a save id or the
   seam returns `campaign: null`, which is then CORRECT and must be pinned as such, not papered over).
2. Route both sites through the seam. No new capability; no arms; no change to `ExportDraftButton`.
3. Pins: for each repaired site, a test that renders/calls the export path with (i) a settlement in a campaign and asserts
   the seam's payload reaches `generateSettlementPDF`, (ii) a settlement in no campaign and asserts `campaign: null`;
   and one cross-surface pin: the SAME settlement exported from the dossier path and the card path receives the SAME
   `campaign` payload (deep-equal). Plant the repair back out and prove (i) and the cross-surface pin RED.
4. Proof: the touched files' tests; `npx vitest run tests/lint/` WHOLE (exit + failing-arm list; the size-baseline arm is
   EXACT — if a lazy chunk's bytes move, report the delta and STOP rather than re-freeze); `npm run typecheck:domain:strict`;
   eslint. Quiet-window law + mutex before any vitest. No build (the chair builds and reads the chunk listing).
5. Receipt `$SC/receipt-pdfdrift.md`: the four-site table before/after; the per-surface behaviour statement for the
   declaration; register deltas; a RETROVALIDATION ROW.

## ⛔ FENCES
No W-ARMS code. No `--amend`. One car (two if a test file must be new — name it). Trailers `Seat: Opus 5 — Fable-unvalidated`
and `Lane: PDFDRIFT`. No `npm run build`, no `npm install`, never touch `node_modules`, no `git stash`, no `git add -A`.
