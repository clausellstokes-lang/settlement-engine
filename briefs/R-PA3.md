# R-PA3 — THE RELATIONSHIP WRITERS: what PA may write as the realm's past, through whose writers, and what it must never touch (for the PA compile)

Read first: `briefs/PA-BRIEF.md` (the owner's words and laws, the proposals, the hazards, the paths), then `briefs/RESEARCH-COMMON.md`. Ignore README; your output follows RESEARCH-COMMON's eight-part order. The code of record is READ-ONLY; cite by `path :: symbol` and quote the line. The docs are the consolidated FP texts in `/home/user/fp-p8/docs`.

## The questions
1. **The landed relationship state and its one writer each.** Cover:
   - pacts: `src/domain/worldPulse/pactFormation.js`, `pactRenewal.js`, the pact record and its `complianceState`;
   - alliances and `allianceCalls`;
   - war records and war termination;
   - the rumor ledgers (`src/domain/spatial/rumorNetwork.js`);
   - the Herald's chronicle: `wizardNews.js :: normalizeEntry`, `src/domain/realm/heraldRouting.js`, the Herald kinds registry, its immutability, the Evidence Law;
   - traditions' relations (`src/domain/traditions/relations.js`, `genesis.js`);
   - `src/generators/crossSettlementConflicts.js`;
   - migration rumors and `bandedStock.js`.

   For each, give its persisted shape and its writer. Say whether a PAST entry could be written WITHOUT touching any settlement's dossier state, and how a pre-birth entry would be marked (a negative tick? a flag?) without breaking a reader that assumes tick ≥ 0.
2. **The FP volumes that would own a past relationship.** These are designed and DARK. For each, say:
   - which of its facts a PA replay could PRODUCE as past, and through which of its writers or derivations;
   - which it must NOT produce (a change to a dossier);
   - whether its formation rules can run in a relationship-only mode on a coarse step.

   Read each volume's §1 laws and token register and cite sections. The volumes:
   - RN: `spatialLedgers.regard`, the deed record and its peak reach, the half-life, the `heardAt` telling idiom;
   - PL: polities, vassal chains, `polityOf`, fealty, and how a chain forms;
   - MN: a raid by a menace rather than a town;
   - PG: plague travel; POP: migration origin; `DESIGN_FP_FAITH.md`: faith spread; `DESIGN_FP_TRADE.md`;
   - WC, WY and ES: wars and their ends; GR: pact drafting;
   - CH and PT, briefly: persons, probably not at birth; say so.
3. **The fold.** Answer:
   - §3.4: does PA mint any engagement kind? The proposal is no; test it.
   - §5: the words PA needs, and the homonyms it must avoid: "seal", "DRAFT", "pin", "lens", "chronicle".
   - §6: where PA sits among THE INSTRUMENTS BEFORE C0 and the chains C0..C21, and THE ORDER NOTE.
   - §7: which OD-FC rows touch birth, history, presets, undo and stasis (e.g. OD-FC-32, 51, 62, 77, 78), and what each implies for PA.
4. **Belief and truth.** Using the FP's information model (`DESIGN_FP_INFORMATION.md`; "a court knows itself"; belief reads), say how PA's past would be held as truth and as each court's belief: memory that decays, distorts with distance and time, or is never heard.
5. **The felt surface.** What does a DM read at birth (the realm briefing) under the Evidence Law (felt sentences: who, which power, what effect) and the voice rules? Draft three example sentences from real fields.

## The chair's proposals to grade
- (a) The past's layer is the same ledgers the FP uses, with entries marked as past; never a second store.
- (b) LINKING writes a record that points at the dossier's event by reference (never copying or editing it).
- (c) GROWING uses each owning program's own formation rules in a relationship-only mode, for lit programs only; dark ones skip until their wave.
- (d) The present-day ties derived from the past (pacts in force, vassal chains, grudges after decay) must agree with the dossier's present facts.
- (e) PA mints no engagement kind.
- (f) PA sits after THE INSTRUMENTS BEFORE C0 and before the release's world-birth changes.

## Output
Write `KIT/findings/R-PA3.md` in RESEARCH-COMMON's order, saving as you go. Final message per RESEARCH-COMMON's report diet: at most 350 words plus ONE table (relationship fact · owning program · writer or derivation · lit at master? · may PA produce it? · receipt).
