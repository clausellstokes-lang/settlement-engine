# V33-JOINPROBE-2: THE JOIN PROBE, PASS 2 (LIT). INTERIM: stopped at step 4 (the run was ended before steps 4-6 returned)
Builder V33-JOINPROBE-2 for VEIL-33, 2026-11-22. Worktree `/home/user/wt/jp`, branch `lane/veil-33-2026-11-22-joinprobe-wip`; never pushed.
The lit ref is THE COMMIT THE CHAIR NAMED, `lane/close-1-lit-scratch-2026-11-22` AT 5c4419815, NOT its tip e987c3e36.
All databases are local (PGHOST=/var/tmp/rv7). Nothing in supabase/, the twin, the registry or any test was changed. Every heavy run
went inside `scripts/gate-mutex.sh --run`, one at a time. pool-jp1 and pool-t2sig-2 were not touched.

## STOP
THE HARNESS ENDED THE RUN while steps 4 to 6 ran in the background (`measure/run-pass2.sh`: birthdiff, hookgap, litsurf, chain,
in that order, exits to `run-pass2.log`). Their outputs will land under `lit/` but are NOT read here and NOT committed. No measure STOP:
every pool and gate shard returned rc=0, 212's sha256 is 8688ddb6...5a3a, and no refusal occurred. JOINPROBE.md (the product) is NOT written.

## 1. The merge, proved lit
- **a7e7932ee** (parents 44c2007ab, 5c4419815): `git merge --no-ff --no-edit 5c4419815` with the hooks, inside the mutex. No conflict.
  `git diff 44c2007ab HEAD` is exactly the three dials (`seatLaw.js`, `seatCircumstances.js`, `fortuneLaw.js`, 1 line each), and 4bba8781d..5c4419815 touch no other file.
- RECEIPT (`lit-receipt.txt`, `measure/lit-receipt.mjs`): NEW_SETTLEMENT_SEAT_LAW_VERSION 2 (= HOLDER), SEAT_CONTEST_LIT true,
  NEW_SETTLEMENT_FORTUNE_LAW_VERSION 2 (= SIZE_RELATIVE). `birthConfig({_seatLawVersion:1,_fortuneLawVersion:1})` mints `_seatLawVersion 2`,
  `_fortuneLawVersion 2` (the clamp drops the incoming keys). A born record of this tree (litsurf smoke, jp6-city-0) carries `config` [2, 2],
  served as [2, 2] by both engines.

## 2. The pool `pool-jp2` (template jp2tpl = v27x211 + this tree's 212, sha256 8688ddb6...5a3a)
Part A ran fresh in 19.1 min and part B in 10.3 min (pass 1: 16.5 / 9.8). All eight shards returned rc=0.
- **Seeds, tries and rejections: UNCHANGED** against pool-jp1 (1,200 + 608; e.g. metropolis A 11054 tried, 10754 rejected at assembleInstitutions).
- **Part B hideable houses held MOVED**: city 559 → 565, metropolis 759 → 763, town 282 → 282 (Rookery −1, Smuggling operation +1),
  village 163 → 163 (`pool/pool-compare.txt`; read "lane -> join" there as dark -> lit).
- **The served criminal surface MOVED**: per-seed signatures differ on A village 91/300, town 36, city 130, metropolis 118; B village 53/152,
  town 24, city 63, metropolis 69 (`pool/pool-sigs.txt`). Example: part B city births whose criminal powers served (rows/governing) go 1/0 → 2/0,
  2/0 → 1/0 or 1/1 → 3/1 (t2b-city-none-36, -wartime-68, -occupied-94, ...).
- The breakdown by powers, holder, contest and `breakdown.merits`, per law alone, is `measure/birthdiff.*`, and it was **not returned**.

## 3. The two gates (`TELL_DB=jp2`, `lit/gates/`; analyzer exit 1, the measure's own red)
| | lane (3cca025b8) | pass 1 dark (27c7e79dd) | **pass 2 lit (a7e7932ee)** |
|---|---|---|---|
| GATE-1 | 4/92 (off 4, dm 4) | 4/92 (off 4, dm 4) | **6/92 (off 6, dm 3)**, at every gated setting, twin = server |
| LOWER BY RULE | 7 | 7 | **7**, the same towns, with MORE parts (below) |
| GATE-2 | 20/40 | 20/40 | **20/40**, the same five settings red (g:101, g:100, g:001, g:000, off), both reads |
| non-governing against the rule | 0 | 0 | **0** |
- GATE-1 failing towns, lit: r3m-city-none-1-113 and r3m-metropolis-infiltrated-0-62 (`safetyDesc="a"`, as dark); r3m-town-none-0-23
  (`currentTensions="e"`, as dark); **NEW, Reveal off only:** r3m-city-none-1-117, r3m-city-politically_fractured-1-120 and r3m-city-under_siege-1-108
  (`r.powers.relations="1"`). **GONE:** r3m-town-insurgency-0-14 (`r.imports.criminal="n"`).
- CAUSE (CONFIRMED by reading the shards): **the three new cities did not move.** Their signature is byte-equal dark and lit. The CONTROLS
  moved: in part B, the city births showing `r.powers.relations="1"` (off|own) fell from 2 to 1 (`pool/pool-part.txt`), below the two that
  GATE-1 asks for. **The town that left moved itself**: its own `imports.criminal` went from "n" to "1".
- LOWER BY RULE: the same seven towns, but lit adds by-rule parts `k.powers.isGoverning="p"`, `modifier`, `modifiers`, `crisisNote` and
  **`k.powers.captureState="p"`** (the governing criminal row served with its capture key on the DM read). The cause is the same: part B city
  births serving a governing criminal row with those keys fell from 2 to 1 (`pool/pool-part-dm.txt`).
- GATE-2's failing pages moved in their families: indebted-1-106 and insurgency-1-104 gain DM-read pages separated by `r.powers.{capture,conflicts,criminal,relations}`.
  town-infiltrated-0-12, town-insurgency-0-14 (imports, ops) and town-none-0-21 (`r.tensions.crime`) are on the list (`gates/table-vs-dark.diff`, 150 lines).
- ATTRIBUTION: the lit laws alone (the dials are the only change). Which law (seat or fortune) is birthdiff's, **not returned**. PLAUSIBLE: the
  fortune law, by legitimacy bands (W1 re-runs the capture rows' direction, `withCaptureRelations`) and the size-relative crime/defence words.

## 4-6. NOT RETURNED (running at the stop)
- Step 4: `measure/chain-jp2.sh` (pass 1's chain re-pointed: lit/chain, jp2tpl, TELL_DB=jp2m, pool-jp2) plus three lit lists. **lit-seat**: gallerySanitizer,
  tests/domain/seat, seatHolderCard, dualHatReaders, powerTabSupport, seatLawWiring. **lit-fortune**: fortuneLawMerits, fortuneMeritSentence,
  fortuneMeritsPredicates. **lit-flip**: the 33 files of SEAT-6-TO-LIGHT section 2 and FORTUNE LIGHTING-WORKLIST B1, `measure/flip-tests.txt`.
  NAMED AS ABSENT FROM THE TREE: the `gallerySanitizer.pglite` arm with a hidden taker and a hidden retired holder (ruling 67 (3); the
  sanitizer test has no arm for the transfer wordings). Ruling 65's red is re-run on a served document by SERVER and twin (fortuneLawMerits (5)/(S) read
  `toPublicSafe` + `applyVeil` only, never `get_gallery_dossier`).
- The chair's 11:29 item: `measure/litsurf.probe.jsx` (server and twin, reads off and dm, surfaces a-g by name, the DM's act T, R and K, fortune's
  merits and the capture counterfactual). SMOKE ONLY (jp6-city-0, one city):
  T (hidden taker): read off. recentConflict is served masked ("an unseen interest overthrew the city council..."). No served string names the hidden power,
  on either engine. The reader's holder answers R3 "The Order of the Watch" where the owner's is R1 "Military/Guard". That is a different
  power, not the hidden one. R (hidden retired holder): read off. The retired edge is not served, and no string names the hidden power. Read
  `dm` (the DM door) SERVES a DM-hidden row whole, so it is not a hiding read for a `hidden: true` power. The probe was corrected to count such a power hidden only where the read withholds it.
  Fortune: score 58 and merits none, equal on owner, server and twin; the captured counterfactual is the same. **Not run at N=10.**
- Step 5 (hook gap lit, pass 1's probe unchanged, the same seeds) and step 6 (every red by its lane, the proposed units): **not returned**.

## CONFIRMED vs PLAUSIBLE
CONFIRMED: the merge and its three-line diff; lit on a birth; pool-jp2's shards rc=0 with seeds and rejections unchanged; the part B houses and
signatures moved; GATE-1 6/92 (off 6, dm 3), LOWER 7 with more parts, GATE-2 20/40, against the rule 0, twin = server; the new GATE-1 reds are the
controls moving (2 → 1), the town that left moved itself.
PLAUSIBLE: which lit law moves the pool (fortune suspected); everything in steps 4-6.
