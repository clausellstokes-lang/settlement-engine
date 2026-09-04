import json
calls = []
OVER = []
def add(row, call, claim, method, evidence, verdict, confidence, note):
    if len(evidence) > 700: OVER.append((call[:40], len(evidence)))
    calls.append(dict(row=row, call=call, claim=claim, method=method, evidence=evidence, verdict=verdict, confidence=confidence, note=note))

# ---------- §885.6 ----------
add("§885.6", "H1 the hold: external load named, casualty foreign to the consist, different test than the last refusal",
    "TRAIN 2's --update refused on simulationRulesDialog at load 94 with nothing of the chair's running; test passes 6/6 standalone; not in blast radius; a different test than the prior writerReach refusal",
    "read SP/update-886-run1-REFUSED-loaded.log; git diff --stat 2d5112851 108a02ef4; SP/briefs/brief-PARSER.md:7; SP/update-885-run1-REFUSED.log",
    "update-886-run1-REFUSED-loaded.log: UPDATE_HEAD=108a02ef4 / UPDATE_LOAD_AT_START=1.70 4.02 28.73 / '--update REFUSED ... tests/components/simulationRulesDialog.test.jsx :: SimulationRulesDialog previews and saves a selected preset' / TRUE_EXIT=1 / UPDATE_LOAD_POST=94.64 88.60 64.79. Consist files (git diff --stat): settlementRumors.js, wizardNews.js, 5 tests/domain files, mutation manifest, lighting baseline, walker — no components test. brief-PARSER.md:7 'Apple Remote Desktop`s build_hd_index (two instances) and a macOS find sweep'. Prior refusal update-885-run1-REFUSED.log named writerReach.walker.",
    "RATIFY", "CONFIRMED",
    "Sub-claims (1) the named ps -r consumers and (2) the '6/6 standalone, exit 0' run have NO retained receipt — only the ledger's word (PLAUSIBLE; settle: none possible now, the window is gone). The refusal itself, its load, the blast radius and the varied-casualty fact are CONFIRMED from logs and git.")

add("§885.6", "H2 the 'DISPROVES' refinement: start-of-run load is a poor proxy for load at test time",
    "§885's 'passed at load 47, failed at load 3.8 DISPROVES the load diagnosis' over-stated; the cure stands on the 21,758 ms > 20,000 ms arithmetic",
    "sed -n 32381p ODQ (DISPROVES sentence); compared UPDATE_LOAD_AT_START vs UPDATE_LOAD_POST across update-886-run1, ratchet-enc, ratchet-enc2 logs",
    "ODQ:32381 '...which **DISPROVES** the earlier lane's load diagnosis rather than inheriting it; the real cause is that it blew the suite-wide testTimeout: 20000 at 21,758 ms.' Three later runs show start-low/end-high: update-886-run1 1.70 -> 94.64; ratchet-enc 3.70 -> 216.82; ratchet-enc2 2.09 -> 276.47. A start reading therefore says nothing about load during a given test.",
    "RATIFY", "CONFIRMED",
    "The refinement is the correct reading and is later strengthened at §887.2 (duration, not start). The §885 cure's warrant (budget arithmetic) is independent, as the row says.")

add("§885.6", "H3 the resume point and the measured resume condition",
    "Dock at 108a02ef4, 4 cars over 2d5112851, census 2504/370/2134/22696/6110; resume when build_hd_index gone and 1-min load < ~5",
    "git log 2d5112851..108a02ef4; git show 108a02ef4; SP/update-886.log",
    "git log: 108a02ef4 <- e2f4993cf <- 6c862159e <- 7d0987ea0 <- 2d5112851 (4 cars). 108a02ef4 diff: files 2503->2504, credited 2133->2134, titles 22676->22696, suiteTitles 6101->6110 (parked untouched). update-886.log: UPDATE_LOAD_PRE=2.29 2.35 3.98 / UPDATE_LOAD_AT_START=1.90 2.13 3.57 / 'baseline updated: 10 failing test(s) remain, 0 removed' / TRUE_EXIT=0.",
    "RATIFY", "CONFIRMED",
    "The load half of the condition is evidenced (1.90). The process half ('build_hd_index gone from ps -r') has no retained ps receipt; §886's 'checked, not assumed' rests on the load figure alone (PLAUSIBLE).")

# ---------- §885.7 PARSER ----------
add("§885.7 PARSER", "P1 the seven leaf byte deltas, -584 total",
    "general -413 -> 182,623; power -83 -> 81,910; defense -51 -> 111,938; warFaith -37 -> 115,928; economy, stressors, causal 0",
    "git cat-file -s <sha>:<leaf> at f60457296 (parent) and c461dc296 for all seven leaves; git show --numstat c461dc296",
    "general 183036->182623 (-413); power 81993->81910 (-83); defense 111989->111938 (-51); warFaith 115965->115928 (-37); economy 90337->90337; stressors 59482->59482; src/data/dossierCausalProse.generated.js 210454->210454. Sum -584. numstat: 4 leaves touched, economy/stressors/causal absent from the diff.",
    "RATIFY", "CONFIRMED", "Every figure exact, recomputed from the objects.")

add("§885.7 PARSER", "P2 the property break declared loudly (leaves no longer byte-identical across cars)",
    "Legitimate, dark, stated rather than discovered",
    "git log -1 --format=%B c461dc296",
    "commit c461dc296: '⛔ THE DECLARED SHIFT: THE LEAVES ARE NO LONGER BYTE-IDENTICAL. The lane before this one found the seven prose leaves byte-identical across its work and treated that as a proven property. This car breaks it, deliberately, on four of the seven. PREDICTED IN WRITING BEFORE THE GENERATOR RAN, then measured'. 'Every changed line in the four leaves is inside a sectionTarget array or its own brackets: no variant text, angle, mark, slot or pool key moves'.",
    "RATIFY", "CONFIRMED", "Declared in the car's own message; no golden owed since no variant text moved (consistent with T6-style byte-identity claims elsewhere).")

add("§885.7 PARSER", "P3 three inherited figures refused: 23/45 -> 26/45 (eight) and 13/45 (ten); design's 25/45 over 14 names; 'sectionTarget has no consumer' refuted in its reason (three live readers + a test arm, all over the causal leaf); after: 43 carry a key over exactly ten strings, 2 none",
    "The brief's and the design's figures do not reproduce; the conclusion survives only because the causal leaf is byte-identical",
    "regex census over the six state leaves at f60457296 (parent) and c461dc296 (tip) written to scratch; git grep sectionTarget c461dc296 -- src tests scripts; brief-PARSER.md:38; DESIGN-dark-reader-recut.md:66,249,492",
    "PARENT census: declaring blocks 45 | >=1 string outside the eight: 26 | outside the ten: 13 | distinct strings: 30. TIP census: 68 state blocks, 43 with sectionTarget, 25 without; distinct strings 10 = defense,economy,faith,history,overview,population,power,relations,tensions,viability; causal 78 arrays over 8. brief-PARSER.md:38 '23 of 45 blocks carry at least one string outside'. recut:66 '25 carry >=1 string outside a 14-name tab vocabulary'; recut:492 'none (sectionTarget has no consumer)'. Readers: causalDossierProse.js:86 '(causalFamily(id)?.sectionTarget || []).includes(section)', :124, :143; tests/domain/causalDossierProse.test.js:83.",
    "RATIFY", "CONFIRMED", "26/13 and 30 distinct strings reproduce exactly from the parent leaves; the three live readers and the test arm all read causalFamily().sectionTarget, i.e. the causal leaf, which measured delta 0.")

add("§885.7 PARSER", "P4 the chair's stale live-load figure in the brief (60-90 vs the lane's 2.91/6.26/20.91)",
    "A brief that carries a live reading must timestamp it or omit it",
    "SP/briefs/brief-PARSER.md:7-8",
    "brief-PARSER.md:7 '⚠⚠ **THE BOX IS UNDER HEAVY EXTERNAL LOAD RIGHT NOW** — Apple Remote Desktop`s build_hd_index (two instances) and a macOS find sweep, load ~60-90 on 8 cores, none of it ours.' The same sentence is in brief-REGISTRY.md:7. The lane's measured 2.91/6.26/20.91 is not retained as a log (chair transcription).",
    "RATIFY", "CONFIRMED", "The brief carried the transient figure untimestamped (CONFIRMED); the lane's counter-reading is PLAUSIBLE only. The chair's self-report is accurate.")

add("§885.7 PARSER", "P5 OSR --write refreeze owed at landing; leaves are 'generated/data inputs, not detector sources'",
    "No governed migration is owed; the landing takes the --write",
    "git show c461dc296:scripts/check-observed-shape-readers.mjs | grep; git show 342cccd90 (the §887 refreeze) and its baseline totals",
    "check-observed-shape-readers.mjs:2700 (at c461dc296) \" These are generated/data inputs, not detector sources, so the shrink-only\". §887 register 2/3 = 342cccd90 'the observed-shape baseline refrozen, exactly as the parser lane predicted'; baseline at 342cccd90: total 1993, identities 1409, inventory 388, schema 15, frozenAtSha 98366ffd5.",
    "RATIFY", "CONFIRMED", "Executed as predicted; figures unchanged, input fingerprint only.")

# ---------- §885.7 REGISTRY ----------
add("§885.7 REGISTRY", "R1 DOSSIER_MOUNTS ships empty; UNMOUNTED_BLOCKS = 68; zero imports; kernel/contract test/generator/annexes untouched",
    "The registry is empty at birth by design; the corpus's darkness is a number",
    "git show f12360185:src/domain/display/stateProse/dossierMounts.js (read in full); scratch node probe importing it; git show --stat 5e749a0b0",
    "dossierMounts.js:102 'export const DOSSIER_MOUNTS = Object.freeze([]);' :116-136 UNMOUNTED_BLOCKS list; probe: 'DOSSIER_MOUNTS length: 0 UNMOUNTED_BLOCKS length: 68 unique: 68'; file has no import statement. 5e749a0b0 --stat: mutation-coverage-manifest.json +4, mutation-sweep.sh +13, dossierMounts.js +181, .dossier-mounts-baseline.json +5, dossierMountRegistry.walker.test.js +600 — 5 files, 803 insertions, 0 deletions.",
    "RATIFY", "CONFIRMED", "")

add("§885.7 REGISTRY", "R2 C3 held in two places that cannot disagree; sentenceMountForBlock fail-closed (null on a contradiction)",
    "rung is a field on every row; the router answers with at most one position or nothing",
    "read dossierMounts.js:161-181; probe call",
    "dossierMounts.js:175-181 'export function sentenceMountForBlock(blockId) { ... const speaking = DOSSIER_MOUNTS.filter((row) => row.blockId === blockId && row.rung === MOUNT_RUNGS.SENTENCE); return speaking.length === 1 ? speaking[0] : null; }' Probe: sentenceMountForBlock('DS-GEN-1') -> null on the empty table.",
    "RATIFY", "CONFIRMED", "length === 1 is the fail-closed shape: two claimants return null, not first-wins.")

add("§885.7 REGISTRY", "R3 the sweep plant is aimed at the totality arm a shrink-only ratchet cannot see",
    "Striking DS-CND-1 from the dark half reds the totality arm alone (15 passed, 1 failed)",
    "git show 5e749a0b0 -- scripts/mutation-sweep.sh; commit message; walker arm count",
    "mutation-sweep.sh (+): '# 48. TRAIN 1 C2 — THE MOUNT REGISTRY'S TOTALITY LAW ... Strike DS-CND-1 from the dark half without mounting it anywhere.' then perl -0pi -e \"s/  'DS-STR-1', 'DS-STR-2', 'DS-CND-1',\\n/  'DS-STR-1', 'DS-STR-2',\\n/\" + check_caught 'dossier-mounts/a corpus block leaves the dark list with no mount'. Message: 'reds the totality arm by name — 15 passed, 1 failed'. Walker test( count at 5e749a0b0 = 16.",
    "RATIFY", "CONFIRMED", "15+1 = 16 arms, matching §887's '16 arms'. The plant's execution result is the lane's word (PLAUSIBLE; settle: sh scripts/mutation-sweep.sh entry 48 on a dock at 0fdbc53a0).")

add("§885.7 REGISTRY", "R4 design corrections: max-lines 600 scoped to src/components/**/*.jsx; the design's eslint command does not run under flat config; 'T5 arm 1 reds today with 68 unmounted' is wrong",
    "The lane refused three design figures",
    "git show 5e749a0b0:eslint.config.js (lines 662-667); package.json eslint version; DESIGN-dark-reader-recut.md:357-361, :434",
    "eslint.config.js:665 files: ['src/components/**/*.jsx'] / :667 'max-lines': ['error', { max: 600, skipBlankLines: true, skipComments: true }]. package.json:109 \"eslint\": \"^10.4.0\" (flat-config era). recut:434 'npx eslint --no-eslintrc --rule ...' (a legacy-config flag). recut:360-361 'totality — every block with >=1 pool is in DOSSIER_MOUNTS or UNMOUNTED_BLOCKS. *Reds today with 68 unmounted*' — by that arm's own definition a block in UNMOUNTED_BLOCKS satisfies it, so with all 68 declared it is green.",
    "RATIFY", "CONFIRMED", "The eslint-command claim is PLAUSIBLE by version (eslint >= 9 rejects --no-eslintrc); settle with `npx eslint --no-eslintrc` in any dock. The T5 arm-1 correction is CONFIRMED by reading the arm's definition.")

add("§885.7 REGISTRY", "R5 check-test-ratchet.mjs:1118-1142 uses totalTests/totalFiles only as a 90% scope floor, so 'a new test file does not red without a refreeze; that figure is hygiene'",
    "A measured correction to the ratchet's reputation",
    "git show 5e749a0b0:scripts/check-test-ratchet.mjs | sed -n 1112,1145p; grep SCOPE_FLOOR_RATIO",
    "check-test-ratchet.mjs:97 'export const SCOPE_FLOOR_RATIO = 0.9;' :1117-1123 '(2) COUNT FLOOR ... if (baseline.totalTests && rows.length < floor)'; :1139-1144 '(2b) FILE FLOOR ... if (baseline.totalFiles && totalFiles < fileFloor)'. No growth ceiling on either figure.",
    "AMEND", "CONFIRMED", "True of the TEST RATCHET's two totals. The sentence 'a new test file does not red without a refreeze' is over-broad as written: the LIGHTING census's `files` arm does red on a new test file (§886 and §887 each refroze files +1 for exactly this walker), and the program's own law says a new test file reds three censuses. Scope the sentence to the ratchet's totals.")

add("§885.7 REGISTRY", "R6 the lane refused the census refreeze on multi-lane grounds ('a number measured from my dock alone would not reproduce at the composed tip')",
    "The multi-lane form of registers-last",
    "git show --stat 5e749a0b0 (no baseline touched); commit message tail; grep SP for the quoted sentence",
    "5e749a0b0 touches no .lighting-census-baseline.json or .test-ratchet-baseline.json. Message tail: 'NOT TAKEN, and owed to the landing: scripts/.test-ratchet-baseline.json moves by one file and sixteen tests. Registers are the landing's act, never a lane's.' The quoted 'would not reproduce at the composed tip' sentence is in no retained file (grep of SP *.md/*.txt: no hits outside the ledger copies).",
    "AMEND", "CONFIRMED", "The refusal is CONFIRMED; the quoted reasoning is chair-transcribed from a lane report that was not retained — mark the quotation as such. Its prediction (+1 file, +16 tests) plus KERNELMARK's +6 sums to the +22 the §887 ratchet measured.")

# ---------- §885.7 ENC-1 ----------
add("§885.7 ENC-1", "E1 'Only ONE of seven cars was buildable, and the design's own §17.4 says so; ruling none of the seventeen owner rows leaves exactly one car'",
    "The lane built ENC-1 and refused the rest rather than absorbing a row",
    "SP2/DESIGN_ENCOUNTERS.md:710-714; git log -1 --format=%B bbe56b957; ODQ:32362 (§882.13, dated 2026-09-02)",
    "DESIGN_ENCOUNTERS.md:714 'The build lane may cut the dock and author ENC-1 immediately; **ENC-2 is blocked until §12 rows 1, 5 and 5b are answered**, and ENC-5 until rows 2 and 3.' bbe56b957 (09-03 00:59): '⛔ NO OWNER ROW ABSORBED ... the seventeen rows of DESIGN_ENCOUNTERS §12 are untouched and unruled.' But ODQ §882.13 (09-02) already carries '**ENCOUNTERS row 1 YES**', '**2 YES**', '**3 YES**', '**5 YES**', '**5b NO — THE THREE FENCES STAND**'.",
    "AMEND", "CONFIRMED", "The lane's conduct (refuse to absorb a row) was right for its brief. The chair's framing 'only one car buildable' was FALSE when written: rows 1/2/3/5/5b were ruled the day before. §887.1 corrects it, but the stratum's §885.7 paragraph carries no superseded mark — add one.")

add("§885.7 ENC-1", "E2 the control that proved its own absence (a Math.random plant not convicted on the first run)",
    "'The arm exists because the plant found its absence'",
    "git show bbe56b957:tests/domain/envoyChanceMeeting.test.js | sed -n 276-292p",
    "test.js:276-281 \"test('P1 GUARD — the CENSUS itself is a function of its inputs, drawn from no ambient source', () => { // ⚠ THIS ARM EXISTS BECAUSE THE PLANT FOUND ITS ABSENCE. A `Math.random()` planted in the resident pick passed the whole suite: the resolution's determinism arm never touches the census, the order arm ran with an empty roster so no pick was drawn, and the two-seed arm is SATISFIED by randomness, which is the trap. Only running the same census twice can convict an ambient draw.\" then 12x expect(censusChanceMeetingCandidates(args())).toEqual(first).",
    "RATIFY", "CONFIRMED", "The arm and its origin are recorded in the shipped test itself; the plant run is the lane's word.")

add("§885.7 ENC-1", "E3 four plane-projection defects the design's arithmetic hid (axis id dropped; planeFromAxes lossy; refused offer overwritten by the mark arm; eighth arm reached no receipt)",
    "The design's 'equivalently npcTraitPlane walked by disclosed axes' was FALSE until planeFromChart existed",
    "git show bbe56b957:src/domain/worldPulse/envoyChanceMeeting.js | sed -n 386-400p, 885-900p",
    "leaf:388-393 planeFromChart docblock: 'Not every legacy personality word has an axis home: `ambitious` carries a real plane lean and lives in no axis, so an axis-only projection silently drops it ... The design's \"equivalently `npcTraitPlane` walked by disclosed axes\" is therefore true only for the axis-homed half'. leaf:891-895 '// ⚠ A REFUSED OFFER KEEPS ITS OWN WORD. The mark arm ... may not overwrite the fact that an offer was turned down, because 'rejected' is a counted outcome ... if (receipt.outcome === 'nothing') receipt.outcome = outcome;'.",
    "RATIFY", "CONFIRMED", "Defects 2 and 3 are CONFIRMED in the shipped source. Defects 1 (axis id dropped) and 4 (eighth arm no receipt) are PLAUSIBLE only — the lane's build receipt is not retained; settle: none cheaply (the pre-cure state was never committed).")

add("§885.7 ENC-1", "E4 the unit-dodge refused: unit:null would have grown UNITLESS_TABLE_CEILING 220->221; provenance split into its own export",
    "Four cures at source, no ceiling raised",
    "git show bbe56b957:tests/lint/tuningRegister.walker.test.js | grep UNITLESS; leaf grep PROVENANCE; test :147-150",
    "tuningRegister.walker.test.js:85 'UNITLESS_TABLE_CEILING: 220,' and :506 computes it as tables with r.unit === null. leaf:142 'export const CHANCE_MEETING_TUNING_PROVENANCE = Object.freeze({'. test:147-150 'the provenance is unsigned and the table is frozen' expects signedBy null / status contains OWNER-UNSIGNED.",
    "RATIFY", "CONFIRMED", "The structure is CONFIRMED; the 220->221 counterfactual is PLAUSIBLE by construction of the ceiling's own formula.")

add("§885.7 ENC-1", "E5 voice debt: three em dashes in src/domain string literals cured; ENC adds zero voice debt",
    "Its list is identical to the control",
    "git show bbe56b957 -- src/domain | grep '^+' | grep '—'",
    "Nine added lines in src/domain carry an em dash; all nine are comment/docblock lines (e.g. '+ * envoyChanceMeeting.js — ENC-1.', '+  // Rule 5 — traveller x traveller', '+  // T1 — how different the target is'); none is inside a string literal.",
    "RATIFY", "CONFIRMED", "The committed state carries 0 string-literal em dashes; the 'three cured' pre-commit state is the lane's word.")

add("§885.7 ENC-1", "E6 the factor-of-two FINDING: exposures 0.6% of stops vs predicted ~4%; 'I moved no rung'",
    "A tuning value; tuning is gated",
    "grep SP, SP2, SP2/receipts for '0.6%' / 'factor of ~7'; grep the test file",
    "No retained receipt outside the ledger copies (queue-*.md) carries '0.6%' or the factor; the test file at bbe56b957 has no such arm. The tuning table ships draft: bbe56b957 message 'Every tuning value lands draft and unsigned, the register row is declared with status draft and signedAt null'.",
    "EVIDENCE-THIN", "PLAUSIBLE", "The figure cannot be re-derived from anything retained. 'Moved no rung' is consistent with the draft/unsigned register (CONFIRMED). Settle: a scratch driver over resolveChanceMeeting at the worst-case corner, if the owner wants the figure.")

add("§885.7 ENC-1", "E7 STATE-NEVER-FATE by construction (widest outcome `compromised`); DARK (goldens 0/525, no flag, no persisted key, no importer)",
    "The leaf is dark and can end no one",
    "git show bbe56b957:src/domain/worldPulse/envoyChanceMeeting.js:84; git grep -l envoyChanceMeeting ea8451bbb -- src",
    "leaf:84 outcome vocabulary \"'nothing', 'bond', 'respect', 'rivalry', 'compromised', 'rejected', 'exposed'\" — no ousting/death/verdict outcome. Importers under src at ea8451bbb: only habitForkRegistry.js, and that hit is the registry's `module: 'src/domain/worldPulse/envoyChanceMeeting'` string, not an import. Message: 'It writes nothing, reads no worldState, names no persisted key and has no importer under src/'.",
    "RATIFY", "CONFIRMED", "The '0/525 goldens' figure has no retained receipt (PLAUSIBLE; it follows from no importer).")

add("§885.7 DEFER_CEILING", "D1 the chair act: DEFER_CEILING 31 -> 35 authorized; HBF-36..41 exist, four carrying closeOwed; red was 'expected 35 to be 31'; 8/8 green after",
    "A chair-authorized registry mint, recorded beside the constant",
    "git show bbe56b957 -- src/domain/worldPulse/habitForkRegistry.js; git show ea8451bbb",
    "habitForkRegistry.js (+): HBF-36 drawMeet STAY; HBF-37 drawPick STAY; HBF-38 drawApproach DEFER + closeOwed; HBF-39 drawMark DEFER + closeOwed; HBF-40 drawCompromise DEFER + closeOwed; HBF-41 drawExposure DEFER + closeOwed. ea8451bbb diff: '-const DEFER_CEILING = 31;' '+const DEFER_CEILING = 35;' and the comment '...30 -> 31 at WF-8a (HBF-34, ODQ §350); 31 -> 35 at ENC-1 (HBF-36..HBF-41, ODQ §885.7) — each move a chair-authorized registry mint'. ENC-1 message: 'requires DEFER_CEILING to move 31 -> 35 for the four DEFER rows this leaf mints'.",
    "RATIFY", "CONFIRMED", "Six rows, four DEFER (31+4=35) and two STAY, exactly as both messages say. The 'expected 35 to be 31' red text and the 8/8 are the chair's word (PLAUSIBLE; settle: npx vitest run tests/lint/chooserTotality.walker.test.js on a dock at bbe56b957).")

add("§885.7", "C1 composition: KERNELMARK 1 car; PARSER and REGISTRY branch from it (2 cars each) => TRAIN 1 = 3 lane cars; ENC 2 cars on the product tip",
    "TRAIN 1 composes to three",
    "git log -1 --format=%P for c461dc296, 5e749a0b0, f60457296, bbe56b957, ea8451bbb; git log d1a6c773e..f12360185",
    "f60457296 parent 2d5112851; c461dc296 parent f60457296; 5e749a0b0 parent f60457296; bbe56b957 parent 2d5112851; ea8451bbb parent bbe56b957. §887 landed 7 cars: 63f706b31 (C1), 8029536bb (C9), 0fdbc53a0 (C2+C3) + 4 chair cars.",
    "RATIFY", "CONFIRMED", "Lane cars were rebased (new shas) onto d1a6c773e for the landing; the composition arithmetic holds.")

# ---------- §885.8 ----------
add("§885.8", "F1 the fold arithmetic: 16,767 B -> first fold +144 -> 16,911 -> real fold 15,623 (-1,288)",
    "A consolidation is not a fold",
    "wc -c MEMORY.md; git -C memory rev-parse (not a repo); ls -la MEMORY.md",
    "MEMORY.md is 16,348 B now (mtime Sep 3 18:51, edited by later sessions); the memory directory is 'fatal: not a git repository', so no earlier byte states survive. The three figures cannot be re-derived from anything retained.",
    "EVIDENCE-THIN", "PLAUSIBLE", "The lesson (consolidate for clarity, fold for size, measure which) stands on its logic regardless. Settle: none available; a future fold should record before/after sizes in the archive header.")

add("§885.8", "F2 the two archives exist verbatim and are roster-registered",
    "archive-2026-09-03-false-report-family.md (three rows + two later faces) and archive-2026-09-03-index-fold-30.md (four settled rows), both in archive-index.md",
    "ls memory/; grep archive-index.md; grep headings/rows of both archives",
    "ls: archive-2026-09-03-false-report-family.md 2676 B; archive-2026-09-03-index-fold-30.md 2137 B. archive-index.md:20 '[FOLD 30 (2026-09-03, at §885.7)](archive-2026-09-03-index-fold-30.md) — four BUILD-ERA rows: the map-module descope, the retrovalidation mark and seat, the 08-21 sitting directives, the walke'; :21 '[THE FALSE-REPORT FAMILY (2026-09-02/03)]'. fold-30 has exactly 4 '- ' rows (map=GPL module §724/§725; retrovalidation mark; 08-21 sitting directives; walker-census law). false-report: '## The three index rows, VERBATIM' (3 rows) + '## The two later faces, added at §885.7' (2).",
    "RATIFY", "CONFIRMED", "")

add("§885.8", "F3/F4 the two owed rows indexed (OSR input-arm hazard; C9 closed vocabulary) and the successor card refreshed to §885.7",
    "Lanes write topic files; the chair indexes",
    "read MEMORY.md (system context); git log -- docs/HANDOFF_CURRENT.md",
    "MEMORY.md carries '⛔ [REGENERATING a dossier-prose leaf REDS the OSR input arm — a landing register act, not a lane's]' and '⭐ [C9: SECTION-TARGET is a CLOSED VOCABULARY of ten, and the shipped comma-split made 26 of 45 blocks unroutable]'. HANDOFF_CURRENT.md history: 4a4fff669 09-03 01:22 '§885.8: the index is folded and the card refreshed — and the fold itself carried an error I caught by measuring'.",
    "RATIFY", "CONFIRMED", "The card's §885.7 content has since been overwritten by later refreshes (0 mentions at HEAD), as the card's design intends.")

# ---------- §886 ----------
add("§886", "G1 the act: 2d5112851 -> d1a6c773e, five cars, 11 paths +987/-95, single-parent, five trailers, sealed; gate green first run 1,138 s, ratchet 10 known of 30,994, STRICT DIST OK 52/440",
    "The eleventh landing",
    "git log/diff --shortstat 2d5112851..d1a6c773e; for-each-ref refs/preserve; SP/gate-886.log; update-886.log",
    "5 cars: 7d0987ea0, 6c862159e, e2f4993cf, 108a02ef4, d1a6c773e, each single-parent with trailer 'Opus 5 — Fable-unvalidated'. diff: 11 files changed, 987 insertions(+), 95 deletions(-). refs/preserve/landing-886-2026-09-03 = d1a6c773e. gate-886.log: GATE_HEAD=d1a6c773e..., GATE_START=05:31:22Z, GATE_END=05:50:20Z (1,138 s), '[test-ratchet] STRICT DIST OK — 52 discovered/reported file(s), 440 test(s), zero failed/non-run', TRUE_EXIT=0. d1a6c773e: totalTests 30973->30994; update-886.log 'MEASURED ... entries=10'.",
    "RATIFY", "CONFIRMED", "typecheck 173/173 and domain-strict 1121/1121 not re-read from the gate log body (PLAUSIBLE).")

add("§886", "G2 the two customer-facing cures: a category noun as subject ('Conflict pressure takes hold in Elmspur') and a raw engine identifier ('settlement terminal death') where the authored 'Thornwall is dying' exists",
    "Only the good sentence ships now",
    "git grep at 2d5112851 and d1a6c773e; car messages 7d0987ea0 / 6c862159e",
    "d1a6c773e wizardNews.js:181 '// frames, so a reader met \"Conflict pressure takes hold in Elmspur\" — a taxonomy'; settlementRumors.js:516 ' * identical event read \"Thornwall is dying\". It is deleted.'; settlementLifecycleFirstClass.js:224 'headline: `${name} is dying`' (the authored line). Car 2 message: 'the de-underscore arm is deleted, twenty-nine live kinds are given words'. WHAT_PHRASES sample: conflict_pressure: 'the drums of war', war_conscription: 'a levy of men called up'.",
    "RATIFY", "CONFIRMED", "Taste view: the phrases are bare lowercase noun phrases in the rumor register (the walker's own arm enforces that shape and that every phrase reads in all six wizardNews frames and four rumor frames), and they reuse the settlement-voice vocabulary rather than inventing a new one.")

add("§886", "G3 the walker convicts an unresolvable mint; 'six mint routes'; eleven sites through module constants with seven invisible tokens; the docblock-convention quote",
    "A naming convention enforced by a comment is not machinery, and now it is",
    "git show d1a6c773e:tests/lint/newsSubjectVocabulary.walker.test.js (docblock, ARM 4, classifier test); git grep 'failed that walker'",
    "walker:18-27 'three routes uncovered: • MODULE CONSTANTS — candidateType: VERDICT_NEWS_TYPE. Eleven live sites, and SEVEN live tokens (npc_verdict, npc_arrival, npc_death, npc_dispersal, npc_pardon, npc_rejection, npc_assignment) that no walker in this tree could see. • TEMPLATE FAMILIES ... • EVERYTHING ELSE — impactKind: receipt.kind. ⭐ AN UNRESOLVABLE MINT IS A FAILURE HERE, NOT A SILENT SKIP.' :389 describe('ARM 4 — an unresolvable mint is CONVICTED, not skipped'); :600 'the classifier returns four distinct verdicts across five mint shapes'. treatySuccessionVoice.js:68 ' * Measured here, not theorised: this file failed that walker until the literals went in.'",
    "AMEND", "CONFIRMED", "Conviction, the seven tokens, the eleven sites and the quote are CONFIRMED. The figure 'six mint routes' appears nowhere in the instrument: it names THREE previously-uncovered routes beyond the literal one, a classifier over five fixture shapes, and one route (old-save/table import) no scan can see. State the enumeration the walker states, or derive six explicitly.")

add("§886", "G4 the census delta is not the arm delta: 19 arms / lighting +20 titles / ratchet +21 tests; files +1, credited +1, parked unmoved predicted exact",
    "Budgeting a refreeze by counting arms is wrong three ways",
    "grep -cE '^\\s*(it|test)\\(' the walker at d1a6c773e; git show 108a02ef4 and d1a6c773e",
    "Walker test( count at d1a6c773e = 20 (twenty plain test( calls, zero .each/.skip). 108a02ef4: files 2503->2504, credited 2133->2134, titles 22676->22696 (+20), suiteTitles 6101->6110 (+9), parked not in diff (unmoved). d1a6c773e: totalTests 30973->30994 (+21), totalFiles 2451->2452.",
    "AMEND", "CONFIRMED", "The walker carries 20 arms, not 19. With 20 arms the lighting figure (+20 titles) EQUALS the arm count on this consist, so the row's 'three figures for one consist' illustration collapses to two (ratchet +21 still differs). The law survives; the figure and the rhetoric need correcting.")

add("§886", "G5 the two refusals before the landing, both foreign-casualty at load 94 with ARD indexers; held on a measured condition; the run that worked started at load 1.90",
    "Holding was correct",
    "SP/update-886-run1-REFUSED-loaded.log; SP/update-885-run1-REFUSED.log; SP/update-886.log",
    "update-886-run1-REFUSED-loaded.log: HEAD 108a02ef4, simulationRulesDialog, LOAD_POST 94.64. update-885-run1-REFUSED.log: UPDATE_HEAD=d4b91b26a (the §885 consist), 'tests/lint/writerReach.walker.test.js :: writer-with-no-reader ratchet', UPDATE_LOAD_AT_START=3.81 14.78 19.93, UPDATE_LOAD_POST=24.26 29.25 30.96. update-886.log: UPDATE_LOAD_AT_START=1.90 2.13 3.57, TRUE_EXIT=0.",
    "AMEND", "CONFIRMED", "Only ONE --update refusal happened on the §886 consist at load 94. The 'other' was §885's writerReach refusal on a different consist at load ~24, which §885 itself cured as a real 21,758 ms > 20,000 ms timeout — not a starvation casualty. 'Refused twice ... both ... at load 94' conflates two consists and misfiles a cured defect as machine noise.")

add("§886", "G6 the two instruments on their first real landing: pre-flight ~2 s 'the census WILL move and is NOT refrozen', files 2503->2504; pre-gate 14 stages in 85.6 s; copy-and-delete note",
    "Both earned their keep",
    "grep SP for the pre-flight lines and pre-gate logs; gate-886.log header",
    "gate-886.log:5 'GATE_PREGATE=ALL 14 cheap stages PASSED in 85.6s at this exact tip' (a chair-authored header line). No pregate-886 log and no pre-flight output containing 'files 2503 -> 2504' or 'NOT refrozen' is retained (only brief-PREGATE.md:51 quoting the expected sentence). Retained pre-gate logs (enc, 889-891, 09-02 rehearsals) show the instrument prints 'ALL 14 CHEAP STAGE(S) PASSED in NN.Ns'.",
    "EVIDENCE-THIN", "PLAUSIBLE", "The claims are consistent with the instruments' shapes but the §886 outputs themselves were not kept. Settle: retain the pre-gate/pre-flight stdout per landing; for §886 nothing remains to re-read.")

add("§886", "G7 owed: the createdAt wall-clock fallthrough and five siblings at wizardNews.js :552 :712 :759 :779 :819 :867; twelve mutilated anchors pinned",
    "Owed before the GOLDEN freeze",
    "git show 2d5112851:src/domain/region/wizardNews.js | grep -n '|| nowIso()'; same at d1a6c773e and f12360185",
    "At 2d5112851 the six sites are at 552, 712, 759, 779, 819, 867. At d1a6c773e (this row's tip) they are at 627, 787, 834, 854, 894, 942 (car 1 added ~75 lines above them); same at f12360185. Six sites in all three trees.",
    "AMEND", "CONFIRMED", "Six siblings confirmed; the cited line numbers are the pre-consist base's and are stale at the tip the row records. §887 repeats the stale numbers. Cite by pattern or by the tip's lines. The anchor pin was not examined (PLAUSIBLE).")

add("§886", "G8 taste: twelve labels, six frames, six summary frames, 29 registered rows mirror the rumor surface's vocabulary",
    "Taste is the one thing no test holds, but the wordings mirror what the product already speaks",
    "car messages; WHAT_PHRASES at d1a6c773e; walker arms 447/459",
    "Car 1: 'twelve database labels become the words the town already used'; car 2: 'twenty-nine live kinds are given words'. Walker: test('every subject phrase is a bare lowercase noun phrase') and test('every subject phrase reads in all SIX wizardNews frames and all FOUR rumor frames'). WHAT_PHRASES: roads 'travellers upon the roads', siege_lifted 'a siege lifted', treaty_breached 'an oath between realms broken', protection_gap 'defences grown thin'.",
    "RATIFY", "PLAUSIBLE", "View: the phrases read in the settlement's own register and the walker gives taste a mechanical floor. 'six summary frames' is not a phrase the walker uses (it says four rumor frames); minor wording check owed by whoever re-reads the frames themselves.")

# ---------- §887 ----------
add("§887", "K1 the act: d1a6c773e -> f12360185, seven cars, 17 paths +1,423/-100, seven trailers, sealed; gate green first run 1,039 s; ratchet 10 known of 31,016",
    "The twelfth landing",
    "git log/diff d1a6c773e..f12360185; refs/preserve; gate-887.log; f12360185 diff",
    "7 cars 63f706b31, 8029536bb, 0fdbc53a0, 0d936b84f, 98366ffd5, 342cccd90, f12360185, all single-parent with the seat trailer. diff: 17 files changed, 1423 insertions(+), 100 deletions(-). refs/preserve/landing-887-2026-09-03 = f12360185. gate-887.log: GATE_START=06:42:18Z, GATE_END=06:59:37Z (1,039 s), STRICT DIST OK 52/440, TRUE_EXIT=0. f12360185: totalTests 30994->31016, totalFiles 2452->2453.",
    "RATIFY", "CONFIRMED", "")

add("§887", "K2 the kernel demotion channel: a minor crime wave can no longer print the catastrophic sentence; the arm was red against a byte-identical copy of the base reader; threshold placement",
    "Law 5, fail-closed, derived per pool on the RAW pool",
    "git show f60457296 (kernel hunk read in full); scratch node probe importing the kernel at f12360185 and at 2d5112851; commit message controls",
    "Probe over a pool [minor-marked, catastrophic-marked, unmarked]: BASE eligible (no dimension answer) = all three incl. 'Catastrophic crime wave'; TIP unanswered = []; TIP severity=minor = ['A minor crime wave...', 'Neutral sentence'] (catastrophic excluded); TIP severity=catastrophic = catastrophic + neutral; poolDimensions=['severity']; base.drawVariant.toString() === tip.drawVariant.toString() -> true. Kernel: STATE_MARK_DIMENSIONS {severity, deficit, anchor}; gate in eligibleVariants on the RAW pool, 'FAIL-CLOSED (law 5) ... return []'. Message: MUTANT A (base body restored VERBATIM) -> exit 1, 2 failed | 17 passed (T2, T3); MUTANT B -> 1 failed (T3); tip 19 passed.",
    "RATIFY", "CONFIRMED", "Mechanism CONFIRMED by execution on the extracted pure leaf; placement is correct (deriving on the raw pool closes the fail-open path where audience/slot filters remove the last marked variant). The mutant-pair exits are the commit's word (PLAUSIBLE; settle: the 4-control battery on a dock at 63f706b31).")

add("§887", "K3 the SECTION-TARGET parser: closed vocabulary, four leaves move 584 bytes",
    "The field's vocabulary is closed at last",
    "see P1/P3; generator at c461dc296 lines 338-341, 538-543",
    "generate-dossier-state-prose.mjs:339 'block.sectionTarget = [...block.sectionTargetRaw.matchAll(/`([a-z][a-z0-9_-]*)`/g)]'; :540-541 'for (const t of b.sectionTarget) { if (!SECTION_TARGETS.includes(t)) strays.push(...)'; :574 emits the key only when non-empty. Tip census: 43 blocks over exactly the 10 strings; 2 without.",
    "RATIFY", "CONFIRMED", "The parser now mirrors the ARMS extractor's backtick-token shape; an unknown token reds the projection.")

add("§887", "K4 the router that can say WHERE; one fact one sentence; 68 dark blocks; registry empty at birth",
    "Dark half a gate can count",
    "see R1/R2; dossierMounts.js at f12360185",
    "Probe: DOSSIER_MOUNTS 0, UNMOUNTED_BLOCKS 68 unique. dossierMounts.js:95-102 'THE REGISTRY. Empty at birth, and that is the honest state rather than a shortfall'. :26-29 'A block's SENTENCE rung renders at exactly ONE position per settlement page-set'.",
    "RATIFY", "CONFIRMED", "")

add("§887", "K5 the collision that existed only at the composed tip: §886's fill-layer guard treats every exported string map in the desk directory as a fill table; MOUNT_RUNGS classified via NOT_A_FILL_TABLE, not exempted",
    "Classified, not exempted",
    "git show f12360185:tests/data/dossierStateProseProjection.contract.test.js (lines 26,129,422-468); git show 98366ffd5; SP/update-887-run1-REFUSED.log",
    "contract test:129 'readdirSync(DESK_DIR).filter((n) => n.endsWith('.js'))'; :427 '// CLASSIFIED, NOT EXEMPTED. Every string map in the desk directory must be one of'; :431 'const NOT_A_FILL_TABLE = Object.freeze({'; :467 'if (isStringMap && !declaredTables.has(value) && !NOT_A_FILL_TABLE[`${file}::${name}`])'. 98366ffd5 adds \"'dossierMounts.js::MOUNT_RUNGS': 'the two legibility depths a mount may draw at, consumed only by dossierMounts.js as the router's rung vocabulary; no value of it ever reaches a {slot}'\". update-887-run1-REFUSED.log names 'the slot SHAPE contract — a fill obeys the grammar its seam assumes' and 'observedShapeReaders.walker ... THE LIVE ESTATE INSTANCE'.",
    "RATIFY", "CONFIRMED", "The refusal log independently shows both failures the row describes (the collision and the forgotten OSR register act).")

add("§887", "K6 census delta != arm delta, fourth time: 16 arms / +20 titles / +22 tests; lighting 2504/370/2134/22696/6110 -> 2505/370/2135/22716/6114; ratchet 30,994/2,452 -> 31,016/2,453; OSR 1,993 / 1,409 / 388 unchanged",
    "Predict the derivable, leave the underivable unnamed",
    "walker test( count at 5e749a0b0; git show 0d936b84f, f12360185, 342cccd90 baseline",
    "dossierMountRegistry.walker.test.js test( count = 16. 0d936b84f: files 2504->2505, credited 2134->2135, titles 22696->22716 (+20), suiteTitles 6110->6114 (+4). f12360185: totalTests 30994->31016 (+22), totalFiles 2452->2453. OSR baseline at 342cccd90: total 1993, identities 1409, inventory 388, frozenAtSha 98366ffd5. Lane predictions: KERNELMARK '+6 runtime arms', REGISTRY 'one file and sixteen tests', PARSER 'totalTests and totalFiles untouched' — 6+16+0 = 22.",
    "RATIFY", "CONFIRMED", "All figures exact. Beyond the row: the ratchet delta WAS derivable here as the sum of the three lane predictions (6+16+0=22), so 'tests refused in advance' was more cautious than necessary on this consist.")

add("§887", "K7 chair error: the cures-first-registers-last law inverted at §885 and again here (a register committed while a cure was still owed), harmless only by luck",
    "A law the chair keeps breaking is a hope",
    "git log d1a6c773e..f12360185 order",
    "Order: 0fdbc53a0 (lane C2+C3) -> 0d936b84f '§887 register 1/2: the lighting census refrozen at the COMPOSED tip' -> 98366ffd5 '§887 cure 1/1' -> 342cccd90 register 2/3 -> f12360185 register 3/3. The lighting register was committed before the cure; the cure added no test title (0d936b84f's titles were not re-refrozen after it).",
    "RATIFY", "CONFIRMED", "The §887 instance is CONFIRMED from the commit order; the §885 instance is outside this slice (PLAUSIBLE). The named mechanization (pre-flight refusing a register act with cures ahead) is recorded as owed, not built — correct labelling.")

add("§887", "K8 the instruments on their second landing: pre-gate 81.9 s; the ratchet's refusal named two real failures (the collision and a forgotten register act), neither banked, census 10/10",
    "Not the machine this time",
    "gate-887.log:5; update-887-run1-REFUSED.log",
    "gate-887.log:5 'GATE_PREGATE=ALL 14 cheap stages PASSED in 81.9s at this exact tip' (chair header; no pregate-887 log retained). update-887-run1-REFUSED.log: UPDATE_HEAD=0d936b84f, LOAD_AT_START=1.91, two named failures (dossierStateProseProjection.contract :: the slot SHAPE contract; observedShapeReaders.walker :: THE LIVE ESTATE INSTANCE), TRUE_EXIT=1, UPDATE_LOAD_POST=17.31, PORCELAIN_POST=[].",
    "RATIFY", "CONFIRMED", "The refusal diagnosis is CONFIRMED; the 81.9 s figure is EVIDENCE-THIN (header line only).")

add("§887", "K9 owed: createdAt siblings named in GATE_KNOWN_RED; twelve anchors owner-gated; 68 unmounted blocks a backlog not a defect",
    "Owed before the GOLDEN freeze",
    "gate-887.log:9; wizardNews line census at f12360185",
    "gate-887.log:9 'GATE_KNOWN_RED=one signature only - wizardNews createdAt clock-tick, 0.392 pct measured, pre-existing and foreign, owed before the GOLDEN freeze.' Sites at f12360185: 627, 787, 834, 854, 894, 942 (the row cites :552 :712 :759 :779 :819 :867, the 2d5112851 numbers).",
    "AMEND", "CONFIRMED", "Same stale line-number defect as G7, repeated one landing later.")

add("§887", "K10 taste: the mount rung vocabulary (SENTENCE / GLANCE, DETAIL = rows not a draw) and the one-fact-one-sentence rule",
    "A taste judgment no test holds",
    "read dossierMounts.js at f12360185 in full; MEMORY.md legibility law",
    "dossierMounts.js:66-75 'The two depths a mount may draw at. The third rung of the legibility ladder (DETAIL) is not a mount choice: a detail is rows, not a draw' — SENTENCE 'The position that speaks. At most one per block per page-set'; GLANCE 'Every other position the same record appears at. Band word and rows, no sentence.' :31-37 grounds the rule in R-DST-A ('A composed page draws at most one of each and never both about the same fact') and the observed history.currentTensions triple-render. :47-51 writes the DS-GEN-6 overlay exception down. :85-91 `dimensions` is a declaration of intent the walker cross-checks, 'NOT the guard'.",
    "RATIFY", "CONFIRMED", "View: the two-rung enum is the right size — it names exactly the choice a mount makes and pushes the third depth to rows, which mirrors the program's glance -> sentence -> table ladder; the rule extends an existing in-tab law across the page-set rather than minting a new one, needs no draw-key mechanism, and its one exception is written where a repairer would look. Reservation: the same docblock (:11) carries the design's refuted '25 of the 45' figure — see beyond.")

# ---------- §887.1 ----------
add("§887.1", "B1 the §882.13 rulings for rows 1, 5, 5b exist, and the design's §12/§17 names 1, 5, 5b as the build's gates",
    "The build was unblocked the same day it was declared blocked",
    "ODQ:32362 (§882.13); SP2/DESIGN_ENCOUNTERS.md:3,710,714",
    "ODQ §882.13 (2026-09-02): '**ENCOUNTERS row 1 YES** — the train mints spatialLedgers.meetingMarkEvents ... and spatialLedgers.meetingLeanChannels'; '**5 YES** — the corruption web's creation seam takes the WILLED pin'; '**5b NO — THE THREE FENCES STAND.** A meeting-born WILLED compromise **NEVER** enters the ... ousting → roster-replacement → verdict chain'. DESIGN_ENCOUNTERS.md:710 'Seventeen rows in §12 ... **Three are gates the build cannot pass without an answer**: row 1 ..., row 5 + **row 5b** ..., and rows 2 + 3 (the words — ENC-5 does not board without them).' :714 'ENC-2 is blocked until §12 rows 1, 5 and 5b are answered, and ENC-5 until rows 2 and 3.'",
    "RATIFY", "CONFIRMED", "The phantom is real: ENC-1's message (09-03) still said 'seventeen rows ... untouched and unruled' a day after the rulings.")

add("§887.1", "B2 ENC-2/3/4/6 buildable now; ENC-5 (the words) genuinely owner-gated by row 6's pool-sentence reservation; ENC-7 deferred by row 8; only ENCOUNTERS 7 (tuning values) held",
    "It changes what is buildable right now",
    "ODQ §882.13 rows 2, 3, 6, 8 and the held list; DESIGN_ENCOUNTERS.md:494,496,710; git log --all --grep ENC; laneENC-tree porcelain",
    "§882.13: '**2 YES** — respect joins BOND_KINDS'; '**3 YES** — rivalry joins GRUDGE_KINDS'; '**6 YES at lighting** — ...; ⚠ the POOL SENTENCES remain the pen's to amend at the voice sitting (owner)'; '**8 LEAVE TO THE WAVE**'; held: '**ENCOUNTERS 7** the tuning register's values ... signed LAST'. Design:494 '**ENC-5 THE WORDS** (OWNER-GATED: §12 rows 2, 3; built dark behind the rows)'; :496 'ENC-7 ... (optional; §12 row 8; may re-home to the lighting wave)'. Built since: ENC-2 87e0044ea and ENC-6 f3523cb2d are ancestors of ca651d54b; ENC-3 = 13 uncommitted paths in laneENC-tree; ENC-4 has no commit in any ref.",
    "AMEND", "CONFIRMED", "The design's own gate for ENC-5 is rows 2+3, BOTH ruled YES at §882.13 — so by the design's letter ENC-5 was unblocked too, and the design says it is 'built dark behind the rows'. The chair's 'ENC-5 genuinely owner-gated' stands only on row 6's narrower reservation of the POOL SENTENCES: ENC-5's mechanics are buildable dark; only its words are the pen's. Say that. Also: 'buildable now' converted to two of four cars by §891 (ENC-2, ENC-6 landed; ENC-3 uncommitted; ENC-4 unstarted).")

add("§887.1", "B3 the law: a blocker is a claim, and a claim decays",
    "A stale blocker is obeyed in silence",
    "dates of §882.13 vs bbe56b957 and the four landings §884-§887",
    "§882.13 ruled on 2026-09-02; bbe56b957 (09-03 00:59) 'the seventeen rows of DESIGN_ENCOUNTERS §12 are untouched and unruled'; §885.7's stratum text 'Only ONE of seven cars was buildable'; §887.1 (09-03) corrects it.",
    "RATIFY", "CONFIRMED", "Non-executable law; the instance that earned it is confirmed by dates.")

# ---------- §887.2 ----------
add("§887.2", "T1 five lanes home, nine cars sealed: enc2-enc6 f052d1e77, emdash 4da38b8d3, emdash-annex e46d4c3f1, horizondark-cars12 43e063a70, determinism-wip 55d77a8d2, atop enc1-registers f4cc5cb7d",
    "The §882.14 survival law paid out five times",
    "git for-each-ref refs/preserve | grep 2026-09-03; git log -1 each; merge-base --is-ancestor vs ca651d54b",
    "refs/preserve: enc2-enc6-2026-09-03 f052d1e77; emdash-2026-09-03 4da38b8d3; emdash-annex-2026-09-03 e46d4c3f1; horizondark-cars12-2026-09-03 43e063a70; determinism-wip-2026-09-03 55d77a8d2; enc1-registers-2026-09-03 f4cc5cb7d. f052d1e77's chain: ENC-6 f052d1e77 <- ENC-2 76aeaf9aa <- ENC-1 cure 394d758ee <- chair act 36aafe57d <- ENC-1 895b328a9 <- f12360185. Only f4cc5cb7d is an ancestor of ca651d54b; the five sealed tips were re-cut for later trains (ENC-2/ENC-6 landed as 87e0044ea/f3523cb2d).",
    "RATIFY", "CONFIRMED", "'Nine cars' not recounted per seal (PLAUSIBLE). The 'enc2-enc6' seal holds ENC-2 and ENC-6 only — the name is a range label, not a claim that ENC-3/4/5 are inside.")

add("§887.2", "T2 the ENC-1 ratchet refused twice naming centuryLegSoak at 0 ms against a 900,000 ms budget with ten skips; load 216.82 then 276.47; launched at 3.70 then 2.09",
    "Both were contention the chair created by reading load at launch",
    "SP/ratchet-enc.log; SP/ratchet-enc2.log; SP/HOLD-enc1-ratchet.md",
    "ratchet-enc.log: RATCHET_LOAD_AT_START=3.70 8.99 14.79 / 'tests/simulation/centuryLegSoak.test.js UNCLASSIFIED · ran 0ms against a 900000ms budget ... no timeout signal and no assertion signal ... msg: (the report carried no failure message)' / 'skipped tests grew: 10 > ceiling 1' / TRUE_EXIT=1 / RATCHET_LOAD_POST=216.82 249.10 212.90. ratchet-enc2.log: LOAD_AT_START=2.09 32.90 96.11, identical refusal text, RATCHET_LOAD_POST=276.47 223.08 184.54. Both PORCELAIN_POST=[0], MEASURED totalTests=31016 totalFiles=2453 (nothing written).",
    "RATIFY", "CONFIRMED", "Verbatim. Nothing banked, census at 10.")

add("§887.2", "T3 the diagnosis: the same test fell twice, so §886's 'varied casualties' letter would call it a defect; it is not — the signature is a resource failure (0 ms, no assertion, no message) on a test foreign to the consist",
    "centuryLegSoak is the most expensive test, so it is the first casualty every time",
    "the two refusal logs; SP/ratchet-enc4.log (the quiet re-run)",
    "Both refusals: 'ran 0ms against a 900000ms budget — no timeout signal and no assertion signal — ... (the report carried no failure message)'. ratchet-enc4.log at a streak-confirmed quiet box (load 3.13/3.08/1.99, workers=0): centuryLegSoak is ABSENT from the refusal; instead six real assertion failures foreign to ENC (fieldBattleRegion dormancy; characterDrift x3; paradigmAxisCatalog x2), later cured at 5d34dfce5/b6822dcae and green at ratchet-enc5 (TRUE_EXIT=0, totalTests=31048 totalFiles=2454).",
    "RATIFY", "CONFIRMED", "The quiet run is the decisive control: the soak's failure vanished with the contention, which proves it was starvation, while real reds surfaced that contention had been MASKING — the §888 story. The row's refined signature (resource failure, not varied casualty) is the right one.")

add("§887.2", "T4 the self-matching predicate: grep -c 'vitest/dist/workers' matched its own grep, so the streak could never reach 3; the '[v]itest' bracket form is the cure and was proved to reach zero",
    "A predicate that can match its own command line is not a gate",
    "SP/ratchet-enc3.log; SP/run-ratchet-quiet.sh; SP/ratchet-enc4.log",
    "ratchet-enc3.log (2 lines, then abandoned): '  probe: load=4.34 workers=1 streak=0 waited=0s' / '  probe: load=3.89 workers=1 streak=0 waited=60s'. run-ratchet-quiet.sh:11 now reads \"V=$(ps -ax -o command | grep -c '[v]itest/dist/workers')\". ratchet-enc4.log: 'probe: load=3.13 workers=0 streak=1' ... 'streak=3 waited=120s' / 'QUIET CONFIRMED after 120s: three consecutive readings under 4.0, zero vitest workers.' All later gate/ratchet scripts (888-891) carry the bracket form.",
    "RATIFY", "CONFIRMED", "The uncured script text was edited in place and is not retained; the stuck-at-workers=1/streak=0 log at load 3.89 is the receipt, and enc4 proves the cured predicate reaches zero.")

beyond = [
 "REGISTRY vs PARSER disagree inside ONE train, uncarried: dossierMounts.js:11 says '25 of the 45 carry a string outside the tab vocabulary' (the design's refuted figure) while sibling car C9 measured 26/45 (eight) and 13/45 (ten) and the stratum credits the correction. The stale sentence is still at ca651d54b and 4233031ba. A one-line docblock cure is owed.",
 "§885.7's 'Only ONE of seven cars was buildable' was false when written (rows 1/2/3/5/5b ruled at §882.13 on 09-02) and §887.1 corrects it, but the stratum leaves §885.7 unmarked as superseded.",
 "§887.1's warrant for 'ENC-5 alone is owner-gated' is not the design's: the design gates ENC-5 on rows 2+3 (both YES at §882.13) and calls it 'built dark behind the rows'; only row 6's pool-sentence reservation keeps the WORDS the pen's. Also the design says rows 4 and 9 'stay the owner's by nature and are never chair-ruled (§882.1)', yet §882.13 rules '4 YES' and '9 YES to BOTH grains' under the restated delegation — a design/ruling contradiction no row carries.",
 "'Buildable now' converted to 2 of 4 by §891: ENC-2 (87e0044ea) and ENC-6 (f3523cb2d) are ancestors of ca651d54b; ENC-3 exists only as 13 uncommitted paths in laneENC-tree; ENC-4 has no commit in any ref.",
 "§886's 'refused twice ... both at load 94' conflates consists: update-885-run1-REFUSED.log (HEAD d4b91b26a, writerReach, load 3.81 -> 24.26) was §885's and was cured there as a real 21,758 ms timeout; only update-886-run1 (simulationRulesDialog, 1.70 -> 94.64) was the starved one.",
 "The §886 walker has 20 test( arms at d1a6c773e, not 19; with 20 the lighting +20 equals the arm count on that consist, so the 'three figures for one consist' rhetoric is two figures there (ratchet +21 still differs). The law stands; the figure does not.",
 "'Six mint routes' (§886) is stated nowhere in the walker: it names three uncovered routes beyond the literal one, five classifier shapes, and one save-data route no scan can see.",
 "wizardNews.js line numbers :552 :712 :759 :779 :819 :867 are the 2d5112851 numbers; at d1a6c773e/f12360185 the six sites are 627/787/834/854/894/942. Both §886 and §887 cite the stale set.",
 "The §886/§887 pre-gate and pre-flight outputs were not retained; the 85.6 s / 81.9 s / 'files 2503 -> 2504' figures survive only as chair-authored header lines in gate-886.log and gate-887.log.",
 "§887's ratchet +22 was derivable: KERNELMARK predicted +6, REGISTRY +16, PARSER 0 in their own messages (6+16+0 = 22). 'Tests refused in advance' was correct caution in general but on this consist the lane predictions summed exactly.",
 "§887.2's contention diagnosis is proven by a control the row does not cite: the quiet re-run (ratchet-enc4.log) dropped the soak failure and surfaced six real foreign reds (fieldBattleRegion, characterDrift, paradigmAxisCatalog) that contention had masked — the §888 story begins there.",
 "Brief drift for future verifiers: laneKERNELMARK-tree is at 15c6368a6 (train891-reg7), not 4233031ba, and its porcelain is 0 — the dirty writer-reach baseline the brief warned about has been committed by someone.",
 "The lane-authored 'multi-lane' refusal quote (R6) and the ENC-1 build lane's figures (0.6% vs ~4%, goldens 0/525, the axis-id and eighth-arm defects) exist only as ledger transcriptions; no lane receipt file survives for the ENC-1 build or the REGISTRY report.",
 "MEMORY.md's fold arithmetic (16,767 / 16,911 / 15,623) is unrecoverable: the memory directory is not a git repository and the file has since been edited (16,348 B now). Future folds should record before/after sizes in the archive header.",
]
chair_errors = [
 "Self-reported and CONFIRMED: the PARSER/REGISTRY briefs carried an untimestamped live load reading ('load ~60-90 on 8 cores') — brief-PARSER.md:7, brief-REGISTRY.md:7.",
 "Self-reported and CONFIRMED: the quiet-window waiter's predicate matched its own grep (ratchet-enc3.log: workers=1 streak=0 at load 3.89 and 4.34).",
 "Self-reported and CONFIRMED: registers-before-cures at §887 (0d936b84f lighting register committed before 98366ffd5 cure).",
 "Self-reported and CONFIRMED: the encounters blocker was a phantom from 09-02 (§882.13) through §887.",
 "NOT self-reported: the §886 walker's arm count is 20, not 19 (grep -cE '^\\s*(it|test)\\(' at d1a6c773e).",
 "NOT self-reported: 'six mint routes' has no source in the instrument's text.",
 "NOT self-reported: stale wizardNews.js line numbers cited at §886 and repeated at §887.",
 "NOT self-reported: §886 counts §885's cured writerReach refusal (load ~24, real timeout) as a second starvation refusal at load 94.",
 "NOT self-reported: §887.1 re-gates ENC-5 on row 6 while the design gates it on rows 2+3 (ruled YES) and permits building it dark; the chair also ruled design rows 4 and 9 that the design says are never chair-ruled (within the restated delegation, but uncarried).",
 "NOT self-reported: the REGISTRY car shipped the design's refuted '25 of the 45' figure in its docblock while its sibling car corrected it — a within-train contradiction the landing did not catch (still live at 4233031ba).",
]
commands = [
 "mkdir -p .../walk/S15 && printf '{...PARTIAL...}' > .../walk/S15.json",
 "sed -n '731,914p' .../stratum/full.md",
 "for n in 32362 32387 32388 32389 32390 32393 32395 32397; do sed -n \"${n}p\" docs/OWNER_DECISION_QUEUE.md > walk/S15/ledger-$n.txt; done",
 "git log -1 --format='%H%n%P%n%an %ad%n%s' + git show --stat --format= for f60457296 c461dc296 5e749a0b0 bbe56b957 ea8451bbb d1a6c773e f12360185 108a02ef4",
 "git log -1 --format=%B for f60457296 c461dc296 5e749a0b0 bbe56b957 ea8451bbb (saved to walk/S15/msg-*.txt); git show f60457296 / 5e749a0b0 / ea8451bbb (saved diffs); git show f12360185:src/domain/display/stateProse/dossierMounts.js",
 "git show --numstat --format= c461dc296; git cat-file -s {f60457296,c461dc296}:src/data/dossierStateProse/{general,power,defense,warFaith,economy,stressors}.generated.js and src/data/dossierCausalProse.generated.js; git ls-tree c461dc296 src/data/dossierStateProse/",
 "git log --format='%h %P %s' 2d5112851..d1a6c773e and d1a6c773e..f12360185; git diff --shortstat/--stat for both; git log --format='%(trailers:key=Seat,valueonly)'; git for-each-ref --format='%(refname) %(objectname:short)' refs/preserve | grep 2026-09-0",
 "git grep -n sectionTarget c461dc296 -- src tests scripts | grep -v .generated.js",
 "ls -la SP; ls -la SP/logs; wc -c SP/receipt-enc1-census.md SP/receipt-enc1cure.md SP/HOLD-enc1-ratchet.md SP/PREDICT-enc1-registers.md; cat of each",
 "grep -rn (SP, excluding trees/kits) for 276.47 / 216.82 / [v]itest / vitest/dist/workers / build_hd_index / UPDATE_LOAD_POST / ALL 14 CHEAP STAGES / WILL move / LOAD_AT_START / 2503 -> 2504 / NOT refrozen / 3.89 / streak / workers=[1-9] / Math.random / planeFromChart / 0.6% / 0/525 / would not reproduce at the composed tip",
 "cat SP/ratchet-enc.log SP/ratchet-enc2.log SP/ratchet-enc3.log SP/ratchet-enc4.log SP/ratchet-enc5.log SP/run-ratchet-quiet.sh SP/update-886-run1-REFUSED-loaded.log SP/update-886.log SP/update-887-run1-REFUSED.log SP/update-885-run1-REFUSED.log; head -14 + grep GATE_START/GATE_END/STRICT DIST/TRUE_EXIT of SP/gate-886.log and SP/gate-887.log",
 "git show bbe56b957:tests/domain/envoyChanceMeeting.test.js | sed -n 270,300p and greps; git show bbe56b957:src/domain/worldPulse/envoyChanceMeeting.js | sed -n 370,400p / 885,900p / greps; git show bbe56b957 -- src/domain | grep '^+' | grep '—'; git show bbe56b957:tests/lint/tuningRegister.walker.test.js | grep UNITLESS; git show bbe56b957 -- src/domain/worldPulse/habitForkRegistry.js | grep HBF-3[6-9]|HBF-4[01]|closeOwed|disposition; git grep -l envoyChanceMeeting ea8451bbb -- src",
 "wc -c memory/MEMORY.md; ls -la memory/archive-2026-09-03-*.md; grep archive-index.md; git -C memory rev-parse --is-inside-work-tree; grep -c '^- ' fold-30; grep headings of false-report-family",
 "git -C <dock> rev-parse --short HEAD && git -C <dock> status --porcelain | wc -l for laneKERNELMARK-tree, laneENC-tree, lanePARSER-tree, laneREGISTRY-tree, laneNEWSTRAIN-tree, lanePREGATE-tree, SP2/laneINSTRLAND-tree — captured BEFORE and AFTER (no dock was used for any run)",
 "python3 extraction of §882.13 (ledger line 32362) around 'ENCOUNTERS row 1', '5 YES', '5b', '6 YES at lighting', 'HELD', '**2 ', '**3 ', '**4 ', '**1b'; grep SP2/DESIGN_ENCOUNTERS.md for BLOCKING / owner rows 17 / 17.4 / ENC-5 / ENC-7; sed -n 710,716p",
 "git show 5e749a0b0:scripts/check-test-ratchet.mjs | sed -n 1112,1145p; grep SCOPE_FLOOR_RATIO; git show 98366ffd5 --stat + diff lines; git show f12360185:tests/data/dossierStateProseProjection.contract.test.js | grep NOT_A_FILL_TABLE|readdirSync|every exported|string map",
 "git show d1a6c773e:tests/lint/newsSubjectVocabulary.walker.test.js | grep -cE '^\\s*(it|test)\\(' ; sed -n 8,56p; grep -n six|route|seven|eleven|failed that walker|CONVICT; sed -n 600,625p; git grep -n 'failed that walker' d1a6c773e -- src",
 "git show {2d5112851,d1a6c773e,f12360185}:src/domain/region/wizardNews.js | grep -n '|| nowIso()'; sed -n for lines 552 712 759 779 819 867 at d1a6c773e",
 "git show --format= 108a02ef4 / d1a6c773e / 0d936b84f / f12360185 | grep '^[+-] '; git show 342cccd90:scripts/.observed-shape-readers-baseline.json | python3 top-level counts",
 "sed -n 32381p docs/OWNER_DECISION_QUEUE.md | grep -o DISPROVES sentence; grep -o 6/6 / 108a02ef4 sentences in ledger-32387.txt; grep -ln simulationRulesDialog SP/*.log",
 "node walk/S15/probe/probe.mjs (imports kernel-tip.js = git show f12360185:.../stateProseKernel.js, kernel-base.js = git show 2d5112851:..., dossierMounts.js = f12360185 copy) — scratch only",
 "python3 regex census over walk/S15/probe/leaves/*.generated.js (c461dc296) and walk/S15/probe/parent/*.generated.js (f60457296) — scratch only",
 "grep SP/DESIGN-dark-reader-recut.md for T5|max-lines|eslint|no consumer|25 of 45|14-name; sed -n 357,372p; grep SP/briefs/brief-PARSER.md '23 of 45'; sed -n 5,9p brief-PARSER.md; git show 5e749a0b0:eslint.config.js | grep -B12 max-lines; git show 5e749a0b0:package.json | grep '\"eslint\"'; git show 5e749a0b0 -- scripts/mutation-sweep.sh; git show 5e749a0b0:tests/lint/dossierMountRegistry.walker.test.js | grep -cE '^\\s*(it|test)\\('",
 "git show {ca651d54b,4233031ba}:src/domain/display/stateProse/dossierMounts.js | grep -n '25 of the 45'",
 "git grep -n 'Conflict pressure takes hold'|'settlement terminal death'|'is dying' {2d5112851,d1a6c773e} -- src; git show d1a6c773e:src/domain/display/settlementRumors.js | grep -A14 'WHAT_PHRASES = '",
 "git log --format='%h %s' f052d1e77 -7; git log -1 --format=%s for 4da38b8d3 e46d4c3f1 43e063a70 55d77a8d2 f4cc5cb7d; git merge-base --is-ancestor <each> ca651d54b; git log --all --grep='^ENC-[2-7]'; git log ca651d54b --grep='^ENC-'; git log ca651d54b..4233031ba --grep=ENC",
 "git show c461dc296:scripts/check-observed-shape-readers.mjs | grep -n 'not detector sources'; grep -c 885.7 docs/HANDOFF_CURRENT.md; git log --format='%h %ad %s' -- docs/HANDOFF_CURRENT.md | grep 885|886",
]
summary = ("S15 walked all seven rows (§885.6, §885.7, §885.8, §886, §887, §887.1, §887.2): 51 calls — 39 RATIFY, 9 AMEND, 0 REVERSE, 3 EVIDENCE-THIN, 0 OUT-OF-SCOPE. "
 "HIGH items: (1) the kernel demotion channel is CONFIRMED by an executed scratch probe on the extracted pure leaf (base reader returns the catastrophic variant for an unanswered pool; tip returns [] unanswered and excludes it under severity=minor; drawVariant byte-identical) — the mutant-pair exits remain the commit's word; "
 "(2) the mount rung vocabulary and one-fact-one-sentence rule are ratified as taste, with the docblock's stale '25 of the 45' figure flagged; "
 "(3) PARSER C9's seven deltas recomputed exact (-413/-83/-51/-37/0/0/0 = -584) and the 26/13/30 pre-cure census and 43-over-10/2-none post-cure census REPRODUCED from the leaves; the three live readers + test arm all read the causal leaf; "
 "(4) DEFER_CEILING 31->35 confirmed (HBF-36/37 STAY, HBF-38..41 DEFER with closeOwed); "
 "(5) ENC-1's plant-found-its-absence arm and two of the four plane defects are in the shipped source; the 0.6%/0-525 figures are EVIDENCE-THIN; "
 "(6) §887.1's rows 1/5/5b rulings confirmed, but AMEND: the design gates ENC-5 on rows 2+3 (both ruled YES) and allows building it dark, so only its WORDS are the pen's; ENC-2/ENC-6 landed, ENC-3 uncommitted, ENC-4 unstarted; "
 "(7) both ENC-1 ratchet refusals quoted verbatim (0 ms vs 900,000 ms, 10 skips, 3.70->216.82 and 2.09->276.47) and the quiet re-run that dropped the soak failure and exposed six real reds is the decisive control; the self-matching predicate log (workers=1 streak=0 at 3.89) and the bracket cure confirmed; "
 "(8) §886's walker convicts unresolvable mints and names the seven tokens, but 'six mint routes' is unsupported and the arm count is 20 not 19; 'refused twice at load 94' conflates §885's cured writerReach timeout with §886's one starved refusal; "
 "(9) §885.8's fold arithmetic is unrecoverable (memory dir is not a repo), archives and index rows confirmed. "
 "Every dock's porcelain is unchanged (0/13/4/2/0/0/0); no dock was used for any run; the two probes wrote only under walk/S15/probe.")
print('OVER:', OVER)
out = dict(slice="S15", status="COMPLETE", calls=calls, beyond=beyond, chair_errors=chair_errors, commands=commands, porcelain_unchanged=True, summary=summary)
p='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/walk/S15.json'
json.dump(out, open(p,'w'), indent=1, ensure_ascii=False)
from collections import Counter
print(len(calls), Counter(c['verdict'] for c in calls), Counter(c['confidence'] for c in calls))
print('written', p)
