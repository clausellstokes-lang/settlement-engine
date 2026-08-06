---
name: oracle-removal-both-surfaces
description: "The Oracle removed completely @ 00a689a6 (owner 2026-07-22) — it had TWO mount points (RealmInspector tab + DmScreen card), both rendering the same OraclePanel; role now the Surveyor's"
metadata: 
  node_type: memory
  type: project
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T16:44:18.689Z
---

**THE ORACLE REMOVED COMPLETELY — 2026-07-22 @ `00a689a6` on `claude/remove-oracle`** (off composite-r4 tip `1265a83d`). Owner order: "remove it completely — that role is already taken by the AI we already built" (the Surveyor AI Workshop). A pure deletion: 9 files, 70 ins / 553 del.

## THE DURABLE FACT — The Oracle had TWO surfaces, not one

The dispatch brief scoped only the **Realm Inspector's "The Oracle" section** (`REALM_INSPECTOR_SECTIONS` in `src/components/map/RealmInspector.jsx`). A consumer census on `OraclePanel` found a SECOND live surface the brief never mentioned: **`src/components/screen/DmScreen.jsx`** renders a DM-only `<Card title="The Oracle">` mounting the **same** `OraclePanel` (a fold-pass-2 mount), and DmScreen is live-routed via `AppViews.jsx` (`view === 'screen'`). Manager ruled remove BOTH ("a component cannot survive for one surface while dying for the other"). Removing only the inspector would have left the feature alive+advertised on the DM Screen and broken the build on delete.

**LESSON (hazard for any "remove feature X" task):** a shared *panel component* can be mounted on multiple screens. Do NOT trust a brief's surface count — grep the component's importers across `src/` first (`grep -rn ComponentName src`), and treat every mount as in-scope for a "remove it completely" order. Deletion is blocked until the LAST importer is gone.

## Supporting facts (verified at code, this removal)

- **Self-contained trio:** `OraclePanel.jsx` + `src/domain/oracle.js` (`askOracle`, READS-ONLY, no generation coupling) + `src/data/oracleCorpus.js` (`ORACLE_LIKELIHOODS`) + `tests/domain/oracle.test.js`. No consumer outside the two surfaces. All deleted.
- **Analytics had NO dedicated event.** The Oracle only fired the SHARED `track(EVENTS.SURVEYOR_ADOPTION, { surface: 'oracle' })`. `surface ∈ {interview, oracle, corpus}` is a prop discrimination, not a registry entry — nothing to remove in the EVENTS registry. The descriptive comment (`analyticsEvents.js`) + its edge-bundle mirror (`analyticsEventsBundle.js`) were deliberately LEFT untouched: editing the bundle mirror trips the aiGroundingBundle freshness hash for a cosmetic comment.
- **No user-facing oracle copy lived in `src/copy/`.** All was inline in the deleted files or the two host components. `en.js` `openInterview: 'Ask the world'` and `InterviewPanel` "Ask the world" belong to the **Interview** feature — LEAVE them. `npcAgency.js` clergy label `'oracle'` is a religion role word — LEAVE it. The `tests/helpers/dormancyOracle.js` "dormancy oracle" is the byte-identity *test-oracle* term (unrelated) — every `*DormancyGolden`/`*byteIdentity` test uses it.
- **Voice baseline:** deleting `src/domain/oracle.js` required removing its entry from `tests/copy/.voice-mechanics-baseline.json` (else the scanner references a deleted file).
- **sizeBaseline:** neither `RealmInspector.jsx` nor `DmScreen.jsx` is in `scripts/.size-baseline.json` — their shrink is free, no ratchet-down needed.
- **Closure:** the Oracle rode the LAZY inspector chunk, so the eager first-paint closure is untouched — `1,039,816 B` (budget 1,040,000; Δ −52 vs the 1,039,868 reference).
- **Pin:** `tests/ui/oracleRemoved.test.jsx` asserts no oracle door (`REALM_INSPECTOR_SECTIONS`) and no oracle card (DmScreen render).
- **Owner veto still open:** the manager surfaced the at-the-table-DM vs solo-prep nuance to the owner as a one-file-revert veto (the DmScreen card was framed as the GM's *private* reads). If vetoed, only the DmScreen slot is restored.
