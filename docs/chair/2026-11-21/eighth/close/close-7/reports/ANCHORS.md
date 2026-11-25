# ANCHORS (CLOSE-7): PAUSED by R24n (GUARD-2 first). No commit made; the worktree is untouched.

- Tree: `/home/user/wt/anchors`, branch `lane/close-7-2026-11-24-anchors-wip`, cut at 97c6bfc7a. No file has been changed.
- Probes: `scratchpad/ANCH/probe.census.jsx`. It runs on the pre-BATCH tree `ANCH/pre` (0ec96f13d) and on the anchors tip,
  writing to `ANCH/out-{pre,tip}/` with logs `probe-{pre,tip}.log`. The tip run also searches for replacement seeds:
  - B7: the first `r2s-religious_conversion-metropolis-N` whose kilns' dominant pool is reached.
  - 11c: the first `bar0-town-calm-rand-N` whose lens good is clay and is not brought in.
  Both runs were in flight when ANCHORS was paused.

## (a) THE FIVE, read so far (by read; no cure made)
1. **dossierPhoneFloorAllViews, MOBILE_BASELINE:** World/Daily Life prose 9 → 8 on the town born at seed
   `phone-floor-all-views` (city, grassland, road). This is a BASELINE that moved, not a stale anchor, so it is not cured.
   The cause is not yet traced (the probe records phone.json on both trees).
2. **dossierPhoneFloorAllViews, DESKTOP_BASELINE:** World/Daily Life measured 9 → 8 and sub14 9 → 8. It is the same walk
   and the same cause as 1, and is not cured.
3. **traditionsSameWindowChain soak1k-5255:** "Kept in the same week as The Contest of the Standing Stones." now prints 0
   times instead of 1.
   - The test has no finder; it names soak1k seeds and their tradition names.
   - Re-picking the seed would change the asserted sentences, so it cannot be cured word for word. Report pending the probe
     (soak5255.json on both trees).
4. **bar6ScenesGoods B7:** `kilns.dominant` is undefined on r2s-religious_conversion-metropolis-0, so the kilns' dominant
   pool is no longer reached.
   - Candidate cure: re-pick within the same census family (the probe's finder). PENDING.
5. **bar8DesksEco 11c:** bar0-town-calm-rand-46's lens good is now grain, where the anchor says clay.
   - Candidate cure: re-pick in `bar0-town-calm-rand-N` (the seventh read's family). PENDING.

## (b) THE THREE FIGURES (NOT TOUCHED)
Each is an exact pin in its test file: both directions red. No door; re-keyed by identity at a close with the owner's word.
Each moved at the B1(i) merge: red at 9d8c944a3, green at the cut 0ec96f13d (CONFIRMED by run on archives, BATCH report).
- **editCorpusRatchet A4** (line 448), declared-only rows: {E7: 32, E8: 10} → {E7: 29, E8: 9}. FELL.
- **editCorpusRatchet A5** (line 493), non-commuting seat pairs: E1|E6, E2|E6, E6|E1 and E6|E2 each 6 → 7. ROSE.
- **mergeLadderHeldKeys A2** (line 312), config-channel escalations: E7 terrain to desert 22 → 23 (ROSE); E8 culture to
  norse 5 → 4 (FELL).
