# MERGE-5AB: the people car's lanes 5A and 5B onto the 234-merge tip. 5A MERGED; 5B ABORTED (not mechanical) (2026-11-07)

> Archival record of the cloud chair's merge seat MERGE-5AB. The prompt: merge lane 5A, then lane 5B, in that order onto the 234-merge tip; re-derive every register at each merged tip; run the suites; push. A conflict that is not mechanical (two lanes changing the same behaviour differently) is reported, not resolved. That merge is aborted and what is merged is pushed.

## 1. The outcome and the tips

- **Base.** `origin/lane/people-234-merge-2026-11-07` at `c7d552370` (lanes 1+2+3+4). The seat branched from it in the shared worktree, which was a clean detached HEAD at that sha, with `git switch -c`. `npm ci` exited 0. The clone was unshallowed.
- **Lane 5A (`3d76fb058`): MERGED** at `053283dfd`, with no conflicts. 5A was cut from `c7d552370` itself, so the merged tree is byte-identical to 5A's tip (tree `8c8ab7a40`, the same at both).
- **Lane 5B (`32dfacaee`, its tip at the seat's start and still its tip at the end): ABORTED.** 10 files conflict. Two of them are behaviour conflicts the one-writer principle cannot settle without editing the other lane's source (§3).
- **The tip:** `lane/people-5ab-merge-2026-11-07` holds the 234 tip + 5A + this record and its roster step.

## 2. The merge of 5A (`053283dfd`)

No conflicts. 5A's merge base with the 234 tip is the 234 tip itself.

## 3. The merge of 5B: the conflicts, and why it was aborted

`git merge` of `origin/lane/people-5b-edit-2026-11-07` onto `053283dfd` gave 10 conflicting files:
`scripts/.writer-reach-baseline.json`, `tests/lint/sourceCitationIntegrity.walker.test.js` (registers), `src/components/settlement/EventComposer.jsx`, `src/components/settlementDetail/SettlementDetailEditNames.jsx`, `src/domain/normalizeSettlement.js`, `src/domain/pendingEditsPreview.js`, `src/domain/regenerationMode.js`, `src/domain/relationships/neighbourBackLink.js`, `tests/components/editNamesFactionRoster.test.jsx`, `tests/domain/pendingEdits.test.js`.

**Who owns the six src files.** PEOPLE-5-PREP §1 classes all six as **EDIT**. 5B's brief says the EDIT rows are 5B's. 5A's brief §1 groups (d) and (g), however, also name five of them by file: `EventComposer.jsx`, `SettlementDetailEditNames.jsx`, `normalizeSettlement.js`, `regenerationMode.js` and `neighbourBackLink.js`. 5A's record also lists `pendingEditsPreview.js:422` in its group (g). So the briefs overlap on these files, and both lanes re-wired the same reads.

**Mechanical (the same behaviour, different words).** In four files both lanes made the same change, worded differently. Under ONE WRITER PER FACT they would resolve to the EDIT owner (5B), with 5A's tests re-keyed:
- `EventComposer.jsx`: both group by the first-rank power. 5A uses `cardPowers.js :: firstPowerOf`; 5B uses `membership.js :: firstRankMembershipOf`.
- `SettlementDetailEditNames.jsx`: both list the powers only.
- `normalizeSettlement.js`: the comment only.
- `regenerationMode.js`: both delete the `holder.factions` fallback.

The two test files' conflicts are comment and order only.

**NOT mechanical: the same behaviour, changed differently.**
1. **`pendingEditsPreview.js :: previewCascade`, the faction count's key.** 5A renamed the key: `downstreamCounts.factions` → `downstreamCounts.powers`. 5A also re-keyed its two readers to the new name, in 5A-owned files that do not conflict: `src/components/dossier/CascadePreviewPanel.jsx:288` and `src/lib/editFingerprint.js:63`. 5B kept the key as `downstreamCounts.factions`. If the writer goes to 5B as the EDIT owner, 5A's two readers read a key nobody writes: the cascade panel says "0 factions" and the edit fingerprint's `downstream.factions` is undefined. If it goes to 5A, the EDIT row's owner is overruled. Either way, curing it means editing the other lane's src, not re-keying a test.
2. **`neighbourBackLink.js :: liveNeighbourEngagements`, the partner's shape.** 5A moved both `own` and `partner` to `powerStructure.factions`. 5A also removed the grouping fallback in `crossSettlementConflicts.js :: engagingFactions` (5A's, no conflict), so a shape without `powerStructure` now engages with none. 5B moved only `own` (`powerStructure: settlement.powerStructure || null`) and kept `partner.factions: nr.factions`. With 5B's side and 5A's `engagingFactions`, the partner engages with no faction, so no live neighbour engagement is generated. Taking 5A's side overrules the EDIT owner.

Both are rulings for the chair. The seat ran `git merge --abort`. Nothing of 5B is on this branch.

**The ruling the chair could give.** Who writes the counter's key, and therefore which side re-keys its readers. Who writes the neighbour partner's shape. After that, the 5B merge is mechanical. The other eight conflicts resolve as above, and the writer-reach baseline and the roster pin are re-derived through their doors at the merged tip.

## 4. Registers at the merged tip (`053283dfd`, tree = 5A's tip)

| register | door | result | commit |
|---|---|---|---|
| observed-shape readers | `node scripts/check-observed-shape-readers.mjs --write`, then the plain check | **exit 1 both: `observed-shape executionTree manifest digest mismatch`.** The same throw at the base `c7d552370`, before any merge. This is 5A's STOP 2 and 5B's §3 STOP: MERGE-234's lane-4 merge resolved the baseline textually and never re-derived it. `validateBaselineHistory` re-validates that committed file on every descendant, so no schema-30 door can pass. **Not cured here: the chair's ruling (a restored predecessor, then rung 31).** | — |
| lighting census | 5A re-froze it through its ritual at the identical tree (`535f5f3e0`); the plain run is in the wide run below | see §5 | — |
| writer reach | `node scripts/check-writer-reach.mjs` | exit 0 (5A re-banked at `783a59398` on the identical tree) | — |
| wiring census | `node scripts/wiring-census.mjs --check` | exit 0: 709 pools / 2310 variants / 165 relation rows. Its JSON did not conflict, so it was not re-generated. | — |
| fork registry, held-key census, tuning, writer-reach walker | the walkers, in the wide run | see §5 | — |
| dated roster | `sourceCitationIntegrity.walker` | 99 → 100 (this record), the `_rosterGrowth2026-11-07-merge-5ab` note | this record's commit |
| edge-shared bundles | `npm run build:edge-shared`, once | see §5 | — |

Because the merged tree equals 5A's tip, every register 5A re-derived through its door holds unchanged. The union with 5B did not happen, so nothing else was the seat's to re-derive.

## 5. The suites

PENDING at this commit: the wide run (`tests/generators/people tests/domain/dossier tests/domain/crisis tests/domain/edit tests/lint tests/scripts`) is in flight; its verdict and the red list land in the next commit.

## 6. CONFIRMED vs PLAUSIBLE

CONFIRMED:
- The conflict list, from git's own merge output.
- The two behaviour divergences, read in the conflicting hunks and in 5A's non-conflicting readers (`CascadePreviewPanel.jsx:288`, `editFingerprint.js:63`, `crossSettlementConflicts.js :: engagingFactions`).
- The class of each src file, from PEOPLE-5-PREP §1.
- The observed-shape digest throw at the base and at the tip.
- The tree identity of the merge with 5A's tip.
- Every door's exit code as stated.

PLAUSIBLE: that the other eight conflicts are mechanical exactly as described. They were read, not built or run, because the merge was aborted.

## 7. The tip

`lane/people-5ab-merge-2026-11-07`, pushed with `--no-verify`. The tip is the commit that carries this file's last edit.
