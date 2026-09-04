# OPUS-AUTHORED
import json
items=[
{"id":"FD-01","name":"O2GATE paid-surface gate — LANDED, not pending",
 "what":"Stops the economy desk's two generated state-prose sentences (the DS-ECO-1 prosperity header and the DS-ECO-9 food line) from rendering on the free PUBLIC dossier, which is a paid-tier surface leak.",
 "klass":"chair-class","blocked_by":"nothing — done","size":"0 cars remaining (was 1 car / 3 files, +98/-8)",
 "evidence":"$SC/o2gate/receipt-o2gate.md:3 STATUS COMPLETE, sha 450f7dbb7 parent 15c6368a6, porcelain 0; $SC/o2gate/commit.log '3 files changed, 98 insertions(+), 8 deletions(-)'; git for-each-ref -> refs/preserve/train891-o2gate-2026-09-04 = 450f7dbb7; $SC/RESUME-NOTE.md:157 CHECKPOINT 00:3x 'O2GATE LANDED AND SEALED'",
 "landed":"YES","confidence":"CONFIRMED"},

{"id":"FD-02","name":"O2GATE R3 — make the public gate structurally fail-CLOSED",
 "what":"Today the tab prop defaults publicDossier=false, so any future public mount that forgets to thread the flag leaks the desk prose again. Gating where publicDossier is COMPUTED (OutputContainer.jsx:446) instead of where it is consumed removes the habitat.",
 "klass":"chair-class","blocked_by":"nothing; a paid-surface-adjacent call the lane already recorded as vetoable, so it wants a chair ruling before it rides",
 "size":"1 car / 1-2 files (src/components/OutputContainer.jsx, src/components/new/tabs/EconomicsTab.jsx); STRICT physical-line-neutrality applies (OutputContainer.jsx sits at exactly 600/600)",
 "evidence":"$SC/o2gate/receipt-o2gate.md R3 row 'HIGHEST — this is the one real vetoable call in the car ... the follow-on is to gate where publicDossier is COMPUTED'; $SC/RESUME-NOTE.md:156 'Its second owed item (R3 ...) is a real vetoable call'; OutputContainer.jsx:446 'const publicDossier = readOnly && !saveId;'",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-03","name":"RR-10 — errandSpineEnabled into PREVIEW_OVERLAY (a RULED act the tree refuses)",
 "what":"The lit-preview review corpus cannot light OPERATIONS because the espionage gate is a three-part conjunction and one key is missing from the overlay, so the corpus's espionage member is dead on arrival and Q-OPS-1/Q-OPS-2 score dark_by_flag on both postures.",
 "klass":"owner-gated","blocked_by":"A CONFLICT OF RECORD, and it must be reconciled before any car rides: the chair RULED RR-10 at §882.13 (add the key), while the built artifact at the train tip states the OPPOSITE in its own docblock — 'That is an OPEN OWNER ROW, not a lane's to decide: adding errandSpineEnabled here would answer the owner's question by editing a literal.' Nothing after §882.13 mentions it.",
 "size":"1 car / 1 file (scripts/review/readerCorpus.mjs) — one key added to a frozen literal plus the 15-line docblock rewritten; PLAUSIBLE second file if the reader-corpus posture scores are frozen anywhere",
 "evidence":"CONFIRMED at 15c6368a6: scripts/review/readerCorpus.mjs:101-115 docblock, :116-121 PREVIEW_OVERLAY is the FOUR-key form {warMemoryEnabled, espionageEnabled, demographicsEnabled, neutralNeighborsEnabled} with NO errandSpineEnabled; walk slice S13 beyond[] 'RULING INVERTED IN THE BUILT ARTIFACT ... unexecuted at 4233031ba'; RESUME-NOTE.md:137 fault 2",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-04","name":"ENC row 2 — 'respect' is not a bond kind, it silently becomes 'friendship'",
 "what":"A chance meeting that should deposit respect between two named NPCs deposits friendship instead, so the encounter's meaning is lost at the write and no reader can tell the two apart.",
 "klass":"chair-class","blocked_by":"the same conflict-of-record as FD-03 — ruled YES 2026-09-02 at §882.13 row 2, unexecuted at 30c1667bc, 4233031ba and 15c6368a6; §889's ledger prose ('a bond, a respect or a rivalry') already OVERSTATES the tree",
 "size":"1 car / 2-4 files: src/domain/worldPulse/npcLadderState.js (BOND_KINDS :407, mintBond :450) + tests/domain coverage; PLAUSIBLE a phrased-kind pool and one OSR reader row follow",
 "evidence":"CONFIRMED at 15c6368a6: npcLadderState.js:407 'export const BOND_KINDS = Object.freeze(new Set([\\'loyalty\\', \\'gratitude\\', \\'friendship\\']));' and :450 'const k = typeof kind === \\'string\\' && BOND_KINDS.has(kind) ? kind : \\'friendship\\';' — 'respect' is absent, so it coerces. Walk slice S13 beyond[] 'respect folds to friendship at mintBond :450'",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-05","name":"ENC row 3 — the 'rivalry'/grudge grain is shape-ready and refused",
 "what":"Two NPCs who fall out cannot record it: the ledger's grudge grain exists in the frozen shape but the stage refuses to write it, so every encounter reads as positive and the encounters program is half a program.",
 "klass":"owner-gated","blocked_by":"ENC-5 (the WORDS) is the owner's, per the standing encounters directive; the §882.13 row 3 YES ruling and the code's 'until the owner rules the rivalry word' comment contradict each other and the chair must say which stands. The SHAPE is already settled, so lifting the refusal owes no migration.",
 "size":"1 car / 2-3 files once the word exists: src/domain/worldPulse/envoyChanceMeetingLedger.js (docblock :55-57, :67-68) + the stage's refusal + its test",
 "evidence":"CONFIRMED at 15c6368a6: envoyChanceMeetingLedger.js:67-69 'grudge is SHAPE-READY and UNREACHABLE until the owner rules the rivalry word (§12 row 3); ENC-5 lifts the stage's refusal.' MEETING_MARK_GRAINS = ['bond','grudge']. Walk slice S13 beyond[] 'rivalry refused vocabulary_unruled'",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-06","name":"ENC-3 season cap ignores its own nid — one lesson anywhere mutes every NPC",
 "what":"The once-a-season teaching cap scans every subject's drift cells instead of the one NPC it was handed, so a single lesson taught to anybody blocks every other NPC for a whole season, and the skipped subject is dropped silently with no receipt.",
 "klass":"chair-class","blocked_by":"nothing for the CURE (it is a two-line body fix in uncommitted lane WIP); ENC-3 as a whole is blocked on the drift door, which is the owner's decision, not on TE-VIRT-1",
 "size":"under 1 car / 2 files: src/domain/worldPulse/envoyChanceMeetingStage.js (:657-665) + a two-subject test; must be cured BEFORE the ENC-3 lane commits, not after",
 "evidence":"CONFIRMED by direct read of the uncommitted stage in laneENC-tree (base 30c1667bc, 10 files modified): envoyChanceMeetingStage.js:657 'function taughtRecently(driftMap, nid, now, cadence) {' then :658 'for (const axes of Object.values(driftMap))' — nid is named in the signature and the JSDoc and never read in the body. Call site :642. Walk slice S01 beyond[] states the same finding independently.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-07","name":"The src/ prose car needs a rebase before the lighting wave can carry it",
 "what":"The sweep that cured 1,001 em-dashed sentences across the shipped reader prose is built on a base 26 commits stale, so it cannot ride until it is rebased; two of its 200 files are also touched by the live trains.",
 "klass":"machinery-debt","blocked_by":"a rebase onto the §891 tip, and the owner's declared prose window regardless",
 "size":"1 car / 200 files (+1084/-1019); exactly 2 conflict files to resolve by hand",
 "evidence":"CONFIRMED: git log -1 8f4d5c648 parent = 30c1667bc31b9b6f7c64683fddd79a904aad3fee; git show --stat '200 files changed, 1084 insertions(+), 1019 deletions(-)'; git rev-list --count 30c1667bc..15c6368a6 = 26; comm -12 of the two name-only diffs = src/domain/display/settlementRumors.js, src/domain/region/propagation.js (exactly two). Walk slice S13 beyond[] confirms the same base and overlap.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-08","name":"The seven GOLDEN cars are unlanded and 197 commits behind — rebase, re-prove, land",
 "what":"The machinery that freezes the same-seed golden outputs (the register, the roster walker, the record door, the comparator, the shift-record docs) exists on no product tip at all. Until it lands there is no door in front of the goldens, and the GOLDEN freeze act cannot happen.",
 "klass":"chair-class","blocked_by":"nothing but the rebase itself; the FREEZE act that follows is a register act, and it must cut its hashes from POST-landing bytes",
 "size":"7 cars / 49 files; base 8b07ce45f, 197 commits behind ca651d54b (214 behind the train). Named census bills: lighting +84 titles / +12 suites / +1 file, one mutation-manifest entry, test-ratchet +84 / +1. One fixture (tests/fixtures/momentum-dormancy-golden.json) was re-recorded on mainline at 66c9abaac OUTSIDE the door, so the inventory is stale by one.",
 "evidence":"CONFIRMED: git merge-base ba08939d7 ca651d54b = 8b07ce45f; git rev-list --count 8b07ce45f..ba08939d7 = 7; ...ca651d54b = 197; git diff --name-only lists 49 paths incl. tests/fixtures/.golden-freeze-register.json, tests/helpers/goldenRecordDoor.js, tests/lint/goldenFreeze.walker.test.js. Walk slice S15 beyond[] items on UNLANDED AND UNSTATED + the moved fixture. RESUME-NOTE.md:140 fault 5.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-09","name":"commitTrailerRefusal is a library function with no caller",
 "what":"The commit-level backstop that is supposed to refuse a golden re-record whose commit message lacks the owner's signature never runs, because nothing calls it — not the product tree, not any of the eight chair-commit.sh copies on this box.",
 "klass":"machinery-debt","blocked_by":"FD-08 — the function does not exist on any product tip until the GOLDEN cars land",
 "size":"after FD-08, well under 1 car / 1 chair-tool file (~15 lines of shell calling the exported checker)",
 "evidence":"CONFIRMED: git grep commitTrailerRefusal 15c6368a6 returns NOTHING; at ba08939d7 the only hits are its own definition (tests/helpers/goldenRecordDoor.js:210) and its two unit tests (tests/lint/goldenFreeze.walker.test.js:769, :773). grep -n 'Owner-Signed\\|commitTrailerRefusal' over $SC/chair-tools/chair-commit.sh (151 lines) -> no match. Walk slice S15 beyond[] 'THE §4.3 COMMIT-LEVEL BACKSTOP IS UNWIRED EVERYWHERE'.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-10","name":"{complexity} is dark on all eleven values — a blocker on lighting the economy desk",
 "what":"Every generated sentence that names the town's economy by its complexity silently drops, because all eleven generator strings are title-cased and five carry an em-dashed gloss, and the seam refuses both shapes. Four of the five DS-ECO-1 pools lose a variant.",
 "klass":"chair-class","blocked_by":"nothing technical; it is CONTENT — eleven bare-common noun phrases must be authored, and authored prose that ships is annex/byte-twin territory",
 "size":"1 car / 2-4 files: a display->bare-common table beside src/domain/display/stateProse/economyStateProse.js (bareCommonFill :151-159, the slot fill :286), plus the annex row if the table is documented there. Register: the dossier-mounts / lighting variant census moves when four pools regain a variant.",
 "evidence":"CONFIRMED at 15c6368a6: prosperity.js:293-314 returns eleven strings, ALL title-cased, five containing an em dash ('Highly diversified — multiple major revenue streams', 'Diversified — broad institutional economic base', 'Concentrated — fewer revenue streams than scale suggests', 'Limited — narrow economic base for this scale', 'Subsistence — survival economy'). economyStateProse.js:154 'if (/[—–]/.test(value)) return undefined;' and :158 'return /^[a-z]/.test(value) ? value : undefined;' — every one of the eleven fails the lowercase test. Docblock :277-279 says so in words. Walk slice S17 beyond[] '§884.3's {complexity} cost is understated ... four of five DS-ECO-1 pools lose a variant, not only C1'.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-11","name":"The ratchet prints the wrong budget under the right label",
 "what":"When a failing test is judged against its timeout, the gate prints the LARGER of the config budget and the file's own literal, but attributes it to the config every time — so a reader debugging a timeout is told a number and a source that do not go together.",
 "klass":"machinery-debt","blocked_by":"nothing",
 "size":"well under 1 car / 2 files, ~15 lines: scripts/check-test-ratchet.mjs (:815-827) plus the meta-test that drives the exact emitted bytes. No register act — the ratchet BASELINE is untouched; it rides any train.",
 "evidence":"CONFIRMED at 15c6368a6: check-test-ratchet.mjs:817-818 'const { budget: globalBudget, source: budgetSource } = globalBudgetLazy(); const budget = Math.max(globalBudget, ...literals);' then :820 passes {budget, budgetSource} to failureEvidenceOf, whose :372-373 prints 'against a ${budget}ms budget (${budgetSource}${declared})'. Walk slice S18 beyond[] 'B3 ... UNCURED: the script is byte-identical from f5a6c3bbf through 2d5112851 to the §891 train 4233031ba'. Its CE2 refines the character: the declared clause IS printed, so it is right ingredients, wrong pairing.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-12","name":"DOOR 3's parser arm times out under load and the census has no room for it",
 "what":"The strictest arm of the sovereignty lighting walker runs about twice its budget when several agents share the box, so a landing gate can go red for a reason that is not a defect — and the known-failure census is exactly full, so the red cannot be parked.",
 "klass":"machinery-debt","blocked_by":"the census being FULL at 10/10 with zero headroom. TWO roads, and the second is the cheap one: (a) cure the COST — the arm parses a whole forgery battery under one 20s testTimeout; (b) FREE A SLOT — two of the ten banked entries are the voiceMechanics JSX pair, stale only because DESK CAR 1 moved three em dashes between EconomicsTab and EconomicsGlance and the baseline was never refrozen (see FD-13). A shrink-only refreeze may retire them and open the room.",
 "size":"road (a) 1 car / 1 file (tests/lint/sovereigntyLightingContract.walker.test.js:2166 and the loop it sits in); road (b) is a register act, not a car",
 "evidence":"CONFIRMED: the arm is 'DOOR 3 PARSER DOOR: a file this walker cannot parse parks WHOLE' at tests/lint/sovereigntyLightingContract.walker.test.js:2166; the file declares NO real numeric timeout (the only 4+-digit literal, 5000, is inside a forgery FIXTURE string at :2545), so it runs under vite.config.js:904 'testTimeout: 20000'. scripts/.test-ratchet-baseline.json entries is a dict of EXACTLY 10 records and DOOR 3 is not among them. Walk slice S19-band beyond[] 'timed out in both retained observations (PARSER lane 39.9 s; nownull lane's base run lists it among six pre-existing reds) ... a recurring timeout that cannot be banked deserves a row'.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-13","name":"The voiceMechanics baseline is stale in its details — a shrink-only bank-the-win",
 "what":"Three em dashes moved from one component file to another when the economy glance was extracted, and the frozen debt list still points at the old file, so the gate's four red arms describe a tree that no longer exists.",
 "klass":"machinery-debt","blocked_by":"nothing; it is OPTIONAL at the §891 landing and must be shrink-only (UPDATE_VOICE_BASELINE=1), never a widening",
 "size":"0 cars — a register act at the landing, 1 baseline file. Its real value is FD-12 road (b): it may retire two of the ten banked census identities.",
 "evidence":"CONFIRMED: $SC/o2gate/receipt-o2gate.md §8 proves the lane's contribution is ZERO (committed vs working extractor counts byte-identical, em:0 bang:0 n:872 / n:343) and names the mirror pair 'EconomicsTab.jsx: baseline em:3 → current em:0' / 'EconomicsGlance.jsx: baseline em:0 → current em:3'. $SC/RESUME-NOTE.md:155 dispositions it: 'an OPTIONAL shrink-only UPDATE_VOICE_BASELINE=1 bank-the-win at the landing, not a cure car'. Confirmed that EconomicsGlance.jsx exists at 15c6368a6 and NOT at ca651d54b.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-14","name":"The tuning register charges a name-for-bare replacement as new debt",
 "what":"Giving a bare magic number a name is exactly the cure the tuning program wants, but the register counts it as growth in the named population and demands a signed growth citation for it, so the instrument taxes its own cure.",
 "klass":"machinery-debt","blocked_by":"nothing. ⚠ THE RULE is machinery and chair-class; no tuning VALUE and no SIGNATURE moves, and none may.",
 "size":"1 car / 2 files: scripts/lib/tuning-inventory.mjs (:1046-1076) + tests/lint/tuningRegister.walker.test.js. The cure is a NET rule — a file whose unregisteredNamed grows by n while bareDecimals falls by at least n is a REPLACEMENT, not growth.",
 "evidence":"CONFIRMED at 15c6368a6: scripts/lib/tuning-inventory.mjs:1049 'for (const population of previous == null ? [] : [\\'unregisteredNamed\\', \\'bareDecimals\\'])' iterates the two populations INDEPENDENTLY, and :1054-1056 'if (count <= was) continue; const declared = declaredGrowth[population]?.[file]; if (!declared) { grew.push(... no DECLARED_GROWTH row) }' — nothing nets the paired shrink. RESUME-NOTE.md:145 fault 10.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-15","name":"chair-commit.sh — the missing parent-blob prefix gate and the ENROLMENT predicate's blind word",
 "what":"The committer can overwrite a ledger file with a truncated worktree copy without noticing, because it only checks that the blob DIFFERS, never that it still contains what HEAD had; and the gate that forces a lane's rows into the retrovalidation queue does not recognise the word ACCEPTED, so a row using it enrols nothing.",
 "klass":"machinery-debt","blocked_by":"nothing. This is chair TOOLING in a scratchpad, not product — it rides no train and owes no register.",
 "size":"under 1 car / 1 file (~15 lines) in this chair's live copy; 8 copies exist on the box, so decide once whether the others are retired or synced",
 "evidence":"CONFIRMED: $SC/chair-tools/chair-commit.sh is 151 lines; grep -iE 'prefix|append|startswith|parent blob' matches ONE comment line (:54 'The blob must actually DIFFER from the parent's') and no gate. The enrolment predicate at :83 is grep -qiE 'retrovalidation|retro row|RATIFIED|SEAT: Opus 5' — ACCEPTED is absent. Walk slice S15/S16 beyond[] 'the ledger worktree today shows docs/FABLE_RETROVALIDATION_QUEUE.md AND docs/HANDOFF_CURRENT.md as D + ?? (md5 == HEAD) — the exact shape §883.5(c) warned about is the worktree's steady state, and the prefix gate is still not in any copy'. find returned 8 chair-commit.sh copies.",
 "landed":"NO","confidence":"CONFIRMED"},

{"id":"FD-16","name":"The hygiene car — six recorded debts, one commit",
 "what":"Six small places where the code says something that is no longer true, or where one job is done by two copies of the same reader. None changes behaviour; each is a trap for the next reader, and the exhaustive review will find every one of them if they are still there.",
 "klass":"machinery-debt","blocked_by":"nothing. ⚠ HAZARD: (a)-(c) are COMMENT edits inside src files the prose-numerics baseline addresses BY EXACT PATH AND LINE, so the car must be physical-line-neutral or pay a register; (e) ADDS a test title and therefore owes a lighting-census and a test-ratchet movement.",
 "size":"1 car / ~6 files. (a) src/domain/worldPulse/bandedStock.js:46, 1 line. (b) src/kernel/detMathDecay.js:88, 1 line. (c) vite.config.js:609-612, ~4 lines. (d) fold the two parsePorcelainPaths copies into one scripts/lib module + the canned-record battery, 3 files. (e) plant compareDark's PRESENT direction, 1 file +1 title. (f) the stale frozen-dialgated.txt, a scratchpad delete.",
 "evidence":"ALL SIX CONFIRMED. (a) bandedStock.js:46 'Consumed by nothing at land time — dark by construction (the lane-P precedent).' beside twelve live consumers of halfLifeFactor. (b) detMathDecay.js:88 'detPow(0.5, k) route AND makes whole-period decay EXACT' unchanged. (c) vite.config.js:610-611 'the det-math CORE chunk is itself a first-paint closure member (the two eager sites call detExp/detLog10)' — both eager sites were retired at 754856b12. (d) TWO copies live at 15c6368a6: scripts/base-state-capsule.mjs:487 and tests/lint/sovereigntyLightingContract.walker.test.js:668, and base-state-capsule.mjs:481 itself says 'finds every copy the day they fold into one scripts/lib/ module'. (e) check-writer-reach.mjs:190 sets dialRolled but writerReach.walker.test.js:896 asserts only compareDark(...).struck toEqual([]) — the ABSENT direction. (f) $SP2/laneINSTRWRW-probes/frozen-dialgated.txt exists (1039 B, 2026-09-02) holding 34 entries against a committed FROZEN_DIAL_GATED of 31. Walk slice S18 beyond[] carries (a)-(c),(f); S19-band carries (d),(e).",
 "landed":"NO","confidence":"CONFIRMED"}
]
out={"source":"FAULTDEBT","status":"COMPLETE","items":items,
 "not_covered":"see StructuredOutput","notes":[],"commands":[]}
p="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/pending/FAULTDEBT.json"
open(p,"w").write(json.dumps(out,indent=1,ensure_ascii=False))
print("wrote",p,len(items),"items")
