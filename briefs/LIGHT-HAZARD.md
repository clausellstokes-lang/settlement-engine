---
name: lighting-the-living-content-dial-takes-generation-down-the-loader-has-no-caller
description: "⛔ LIGHTING THE LIVING-CONTENT DIAL TAKES GENERATION DOWN (found by the L-MAT skeptic fold, 09-07 12:08, executed twice): `loadLivingContentRoster` has NO caller in src/ (its definition at livingContentSeam.js:92 and a comment at :64), so `generateSettlementPipeline` on a LIT config throws '[livingContentSeam] v2 world, roster payload not loaded'. This outage — not the dial — is the TRUE ground of every 'inert while dark' claim: the gate is materializesLivingContent(settlement.config), the WORLD'S config, and importers/the Library Load are ungated writers of that config (the underscore family is admitted by prefix in configSlice)."
metadata:
  type: project
  originSessionId: 8de5f153-f375-48fb-803c-ec578a273a4a
  modified: 2026-09-07 12:17
---

**Why it matters:** three security holes were LIVE at dial 1 through import boundaries (gallery import ingest, the reconciliation path, undo/versionHistory) and a shipped dark build could MINT a roster from user-supplied config (SettlementsPanel Load → configSlice admits `_` keys → birthConfig spreads a dormant `{}` that deletes nothing). The lane's receipt called all of it inert "because the dial is at 1" — false mechanism, true conclusion (the loader outage). Cured by L-MAT-FIX (cars 7–9): DEF-2's one-line clamp in `birthConfig` (destructure the marker off the incoming config before spreading the mint) makes "a birth's law is the dial's law" true on every path.

**How to apply:** (1) the lighting day's FIRST car is the loader's caller (the seam), before any dial flip — and the DM-full arm's failure message now says so; (2) never accept "the dial is dark" as an inertness ground for anything keyed on `settlement.config` — ask which WRITER of that config is gated; (3) a walker (`writerReach`) probes only `read(row.writer)` — a second assignment site of a registered key (accountImportBody.js:474) is invisible to it (X8). See [[charter-the-permission-measure-the-mechanism]], [[receipt-cap-horizon-909-skeptic-corrections-2026-09-07]], [[owner-decision-2026-09-07-delegated-rows-chair-rulings]].
