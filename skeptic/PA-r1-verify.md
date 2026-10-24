# PA-r1-verify — THE REALM'S PAST (PA), round 1: the refuting verifier V-PA

Read: `briefs/V-PA.md`, `briefs/VERIFY.md`, `briefs/RULINGS-PA.md`, `briefs/PA-BRIEF.md`, `skeptic/S-PA-r1.md`, `skeptic/X-PA-r1.md`, `cure/D-PA-r1.md`, and the volume `pa/DESIGN_FP_ARCH_PA.md` WHOLE (746 lines) beside its before-text `cure/D-PA-probe/DESIGN_FP_ARCH_PA.before.md`.
Code of record: `/home/user/master-code-of-record` @ `81f1cd963` (read only). Probe: `skeptic/V-PA-probe/effLines.mjs` → `effLines.out` (eslint `max-lines`, executed, D-PA's counter copied). No test suite was run. Git was used for reading only.

## COUNTS
**holds 25 · fails 3 · stop 0 · new 1** (28 ids judged: every BLOCKING and MAJOR of S-PA and X-PA. None was REFUTED, and no STOP was raised.)

## THE TWO DEPARTURES FROM THE RULINGS, JUDGED ON THEIR RECEIPTS
- **References keyed on the save id, not `_seed`: HOLDS.**
  - Every import path strips `_seed`:
    - `lib/accountImport.js` l.647–666: "Strip cross-settlement refs + EVERY generation seed …", then "`_seed: undefined`";
    - `store/galleryImportSettlement.js` l.76: "`_seed: undefined`";
    - `lib/importScrub.js` l.41: "`_seed` — dropped so the deterministic engine can never regenerate …".
  - The save id is the one identity an import remaps: `store/accountImportBody.js` l.596–608 (`idMap[oldId] = newId`), and the same pass re-wires `neighbourNetwork` (l.611–633).
  - So a `_seed` key would be destroyed by the very import it was meant to survive, and a gallery member has no `_seed` at all.
  - No other path re-mints a save id after a record can exist. `instantWorldBody.js`'s `idMap` (l.192–245) runs at birth, before the sidecar's first act.
  - The ruling's second clause (remap through `idMap`) is kept as the ROUTE.
- **The tie door is the dossier's link card: HOLDS (the door; but see X-PA-4 for how the volume says it is reached).**
  - `SettlementDetail.jsx` l.645 renders `<EventComposer />` with no props.
  - `EventComposer.jsx` l.66 has `onLink = null`, and l.257 `canLinkNeighbour = !!onLink && …`.
  - The header of `EventComposerLinkNeighbourField.jsx` says "ships dormant-but-complete".
  - The card is live: `SettlementDetail.jsx` l.687–692 has `LinkNeighbourCard … onLink={handleLink}`, and `SettlementsPanel.jsx :: handleLink` l.517–573 writes both dossiers and calls `persistBatch`.
  - The chair's "event composer" is therefore not the live door, and the seat's naming is right.

## THE TABLE (trimmed: every row judged; receipts at `81f1cd963` or volume line)

| Id | Disposition | Verdict | Why (receipt) |
|---|---|---|---|
| S-PA-1 | CURED (ink the sim clone) | holds | Phase 1 `set` ends l.741, and `simCampaign = cloneJson(c)` is at l.733. The compute runs over `simCampaign` (l.780/809). Phase 2 pushes `preSnapshot` (l.897) and commits `campaign.worldState = ensureWorldState(result.worldState, …)` wholesale (`campaignPulseHelpers.js` l.150). `deepCloneConditionalLedger` (l.189–193) carries `spatialLedgers`. Every committing advance enters through the slice (`campaignWorldPulseSlice.js` l.486). Volume l.458–461. |
| S-PA-2 | CURED (import is a fresh world; save-id key) | holds | `campaignImportedCreation.js` l.38 `createNewCampaignWorldState`; `accountImportBody.js` l.759 "becomes a FRESH campaign". The choice of key is upheld above. Volume §18.1 l.576. |
| S-PA-3 | CURED (`rngSeed` address) | holds | `worldState.js` l.315 and l.591. `runInstantWorld` passes no `idFactory` (`instantWorldBody.js` l.158–171), so the bundle's world state is built over `iw::${seed}::n` (`composeInstantWorld.js` l.245, l.435). No writer of `rngSeed` exists outside `worldState.js` (grep). |
| S-PA-4 | CURED (confirm stores the shown value) | holds | `PenAct.values` ("a confirm's value as shown (the pin)", l.187); §2.1 l.213; §9.2 l.427. This matches `chooseOrPin`'s pin-is-value. |
| S-PA-5 | CURED (ordered `penLog`) | holds | l.183–191 (`n`, the undo order); l.216 gives change·change·undo and reroll·confirm·undo. |
| S-PA-6 | CURED (re-check on every read; cross out) | **fails** | The cited site still holds. §11.1 l.489: "from the inking it is read from the inked record, so it never changes again but for a dropped link (PA6)". `realmPastAccountOf` (l.235) is not routed through `inkedPastOf`. So the account page, where §9.2 l.434 says a cross-out hides the fact and PA6 says a contradiction is flagged, is still described as frozen. The cure left the cited sentence and opened a contradiction with §9.2 and PA4/PA6. |
| S-PA-7 | CURED as ruled (GR past-origin arm, ROUTED) | holds | `pactFormation.js` l.642/648/651/659 are as quoted. `PACT_PROVENANCE` (l.81) and `PACT_LINEAGE_ACTS` (l.63) exist, and `provenanceOf` falls to `dictated` (l.116). §7.2 l.391–399. |
| S-PA-8 | CURED (`{ significance }` record) | holds | `rumorNetwork.js` l.133–138 is as quoted; RN §3.2 l.281 gives "`major` when its magnitude band is ≥ 2". Volume l.492. |
| S-PA-9 | CURED (zero-import `inkedPastOf`) | holds | The desk imports only `./humanizeEngineTokens.js` (l.81), and the law is "never imports the worldPulse engine chunk" (l.46–47). `presentTies.js` is a non-engine leaf. |
| S-PA-10 | CURED (history-tab strip) | holds, but see V-PA-1 | The requirement-6 landing exists (§10.3 l.471; row 29). The way the cure mounts it opens V-PA-1. |
| S-PA-11 | CURED, moot | holds | `undying` arm struck; row 16 l.609. |
| S-PA-12 | CURED as ruled | holds | PA14 l.155; §12 l.507–509 (offset zero; no consequence minted). |
| S-PA-13 | CURED (`FOUNDER_MOTHER_EVENTS`) | holds | The four founder strings are verbatim in `narrativeGenerator.js` (l.298/300/301/312). All eleven `templateType`s exist once in `historyData.js`, and `event.templateType = tmpl.type` is set in `historyGenerator.js` l.592. |
| S-PA-14 | CURED (past tense; tie admits payment) | holds | `historyData.js` `outside_debt` lastingEffects "Tribute payments to the external creditor continue on a schedule"; §4.2 l.311; §23 l.732. |
| S-PA-15 | CURED (`pastIsClosed`) | holds | l.217, l.225; row 33. |
| S-PA-16 | CURED (states renamed) | holds | Census, executed: `as_derived`, `user_confirmed`, `user_changed`, `user_crossed_out` each 0 src · 0 tests. `_offer` inside a compound follows the fold's `party_offer`/`retainer_offer`. |
| S-PA-17 | CURED (two founding facts) | holds | l.199, l.226, l.304. |
| S-PA-18 | CURED (pre-drain derive; `changed_at_inking`) | holds | `capturePulseSnapshot` (l.263–287) clones `regionalGraph` and the saves. It is set at l.701, before the drain at l.721 and in the same producer as `simCampaign`, so it is non-null whenever the car runs. |
| X-PA-1 | CURED as re-ruled (arm (c)) | holds | No write path to `relationshipStates` remains (§6.2 l.367–373; grep finds no `PAST_SEED_BANDS`, allowlist or `undying` arm). `vengeanceLicense.js` l.13 is as quoted. |
| X-PA-2 | = S-PA-7 | holds | as S-PA-7 |
| X-PA-3 | CURED as ruled (POP mint struck) | holds | `DESIGN_FP_POPULATIONS.md` l.324; `DESIGN_FP_ARCH_POP.md` l.376; volume §5.4 l.352, §13 l.519. |
| X-PA-4 | CURED (`tie_offer`; the card is the door) | **fails** | The cure cites a shape that does not exist and calls it unamended. §6.1 l.365 says the confirm "opens the dossier's own link card … prefilled with the partner and the type", and §20 l.643 says "(the landed door, unamended)". But `LinkNeighbourCard({currentSave, allSaves, onLink})` (`SettlementDetailLinkNeighbourCard.jsx` l.15) takes no prefill: it keeps `useState(null)` and `useState('neutral')` (l.17–18). Its open toggle is local state in `SettlementsPanel` (`useState(false)`, l.255). The review sits on `WorldPulsePanel.jsx` in the map. Opening the card and prefilling it needs lines in `SettlementsPanel.jsx` (579 eff.), `SettlementDetail.jsx` (585) and the card (56) (`V-PA-probe/effLines.out`), and none is in PA15 or §17. The same unbudgeted "opens it" stands in §8 l.412. |
| X-PA-5 | CURED (record's deed) | holds | `historyData.js` `external_threat` is as quoted. A grep for besieg, raider, the ford or last war finds only the refusal sentence (l.741). |
| X-PA-6 | = S-PA-8 | holds | as S-PA-8 |
| X-PA-7 | = S-PA-6 (one verb: cross out) | **fails** | The verb lands (§9.2 l.425/434), but §11.1 l.489 still says the account page "never changes again but for a dropped link". That contradicts the cross-out's own effect of hiding a fact from "the realm's past page" (l.434). Same residue as S-PA-6. |
| X-PA-8 | = S-PA-2 | holds | as S-PA-2 and the departure |
| X-PA-9 | CURED (the card, not Edit Mode or the composer) | holds | `recordRegister.js` l.35 (`neighbourNetwork: 'HELD'`), l.56; `neighbourSlice.js` l.9–16; the composer is dormant (the departure above). How the card is opened is carried under X-PA-4. |
| X-PA-10 | = S-PA-18 | holds | as S-PA-18 |

## THE OWNER'S LAWS AFTER THE CURES
- **PA-L1 holds in every mechanism.** PA writes no dossier and no plane row. The tie is written only by the DM's Apply (`handleLink`), and the strip has zero dossier bytes.
- **PA-L2 holds.** A failed first advance inks nothing (S-PA-1). Every inked fact was shown (pre-drain). Cross-out remains after the inking.
- **PA-L3 holds.** No forward run exists; the forecast is clone-and-discard.

## THE FORM
- No model name, no bracketed text and no finding id appear in the running text.
- Two slips, MINOR:
  - §22's caption carries a round label and date ("the review round of 2026-10-24", l.681);
  - §0.3, §5.4 and §6.1 cite a skeptic seat's probe path (`skeptic/X-PA-probe/ages.out`).
- One residue, also MINOR: §4.4 l.317 still closes `PAST_LINK_CAUSES` at five members, against §2.3 and §21's seven (`sworn_today`, `oldest_pair`).

## THE NEW FINDINGS

| Id | Sev | Site | Claim | Receipt | Cure (one sentence) |
|---|---|---|---|---|---|
| V-PA-1 | MAJOR | §10.3 l.471 (the strip); §18.1 veil row l.580; PA15 `HistoryTab.jsx` +≈3 | The S-PA-10 cure mounts the DM-only past on a tab the player view also renders. The volume says "no public or player surface reads it". | (1) `HistoryTab({settlement, …, publicDossier = false, playerView = false})` (`HistoryTab.jsx` l.37). `OutputContainer.jsx` l.735 renders it with `playerView`, and l.494 hides only `summary`, `dm_notes` and `ai_notes` from the player view. The strip's renders-nothing list (no campaign, closed, dark) has no `playerView` or `publicDossier` arm. (2) The tab receives no save id, while `OutputContainer` holds `saveId` (l.202). So "car-0 confirms the tab can resolve its save's campaign" in fact needs a line in `OutputContainer.jsx`, which is not in PA15. | Render the strip only when `!playerView && !publicDossier`, thread `saveId` from `OutputContainer.jsx` (budget it in PA15 and §17), and add both arms to row 29. |

## CONFIRMED vs PLAUSIBLE
Every verdict and V-PA-1 is CONFIRMED by reading the cited symbol at `81f1cd963` or the volume line, and the host sizes are EXECUTED (`V-PA-probe/effLines.out`). Nothing here is PLAUSIBLE except V-PA-1's consequence that the player view shows the strip, which follows from the confirmed mount and the missing gate.
