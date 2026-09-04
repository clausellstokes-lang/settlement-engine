#!/usr/bin/env python3
"""build-payload-893.py — emits payload-893.json from FACTS supplied on the command line.

No placeholders anywhere: every variable field is a required argument, so the failure mode is a
missing-argument error BEFORE anything is written, never an unfilled token discovered by a
downstream refusal (which is what stopped the §892 collection once).

Usage:
  build-payload-893.py GATE_EXIT GATE_SECONDS PRODUCT_TIP_BEFORE PRODUCT_TIP_AFTER TRAIN_TIP CARS
"""
import io, json, sys

if len(sys.argv) != 7:
    print(__doc__); sys.exit(2)
gate_exit, gate_secs, prod_before, prod_after, train_tip, cars = sys.argv[1:7]
if gate_exit != '0':
    print('REFUSED: this payload describes a GREEN landing; gate exit was %r. '
          'Do not collect a landing that did not land.' % gate_exit); sys.exit(1)

SC = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/'
frq_tail = io.open(SC + 'frq-893.md', encoding='utf-8').read()
if not frq_tail.endswith('\n'):
    frq_tail += '\n'

odq_row = (
 "\n§893 · **THE OWNER AMENDS THE CARVE-OUT LINE ITSELF, THE CHAIR RE-CUTS IT ON REVERSIBILITY, AND THE "
 "§891 LANDING GOES DOWN AT %s CARS.** The owner, in chat 2026-09-04, verbatim: *\"regarding this, i give you "
 "permission to follow ammend or modify: 'anything irreversible, externally visible, or constitutional in nature "
 "stays owner-gated even under this grant' / do not worry, make sure that you mark all fo this for fable "
 "retrovalidation which we can ammend any mistkaes then.\"* **THE CHAIR'S AMENDMENT (vetoable, and the largest "
 "judgment of the span):** the old line sorted by CLASS; the new line asks ONE question — *can a later "
 "retrovalidation actually undo this?* Retrovalidation remedies a JUDGMENT recorded in a versioned repository; it "
 "cannot un-send a push, and it cannot give the owner back an experience a machine already had on their behalf. "
 "**⛔ STILL GATED, exactly two:** every `git push`/deploy (the one act that leaves the building, and the backstop "
 "that makes the rest safe) and **the owner's WALK** (an experience, not a permission; also NOT READY — the review "
 "corpus is deity-free, 0 of 44 settlements carry a patron). **✅ TAKEN**, each marked ⟦OPUS-AUTHORED — Fable "
 "retrovalidation OWED⟧: the CULL · paid-surface behaviour, including CHARSET Car 3 ruled a REPAIR because the "
 "sanitiser erases codepoints the renderer can draw and real names ship mangled · ceiling raises by exactly the "
 "measured residual · ENC-4/ENC-5's WORDS, drafted by the chair and marked the pen's to overwrite · the twelve "
 "mutilated anchors, whose gate the §892 walk proved was a LANE note and never the owner's · persisted/exported "
 "shapes. **◐ DECLINED BY THE CHAIR, not gated: the tuning SIGNATURE and every tuning VALUE** — THE PROMISE is made "
 "to PLAYERS in the owner's own words, a third-party promise is not the owner's to hand over in passing nor the "
 "chair's to accept, and it blocks nothing since the signature follows the soak; the chair will instead put a "
 "PROPOSED value and its evidence beside every unsigned row so the sitting is a reading rather than a derivation. "
 "**FOUR UNBLOCKING RULINGS:** CS-9 an account import of a user's OWN export is a RESTORE path not an authoring "
 "wall · THE DRIFT DOOR chartered in three parts (ENCOUNTERS mints its own family leaf; `positionValue` gains a "
 "legal named export; TE-VIRT-1's actual reservation untouched) · O-5/RR-2 FUND the Remembrance reader · O-11 SIGN "
 "the MAT dial's three persistence paths. **ONE OF THE CHAIR'S OWN RULINGS WITHDRAWN WITHIN THE HOUR:** ruling 5 "
 "preferred the cheaper ENC-4 road because the owner's words were the scarcest resource; the second grant made that "
 "premise false, so the road is now chosen on PRODUCT QUALITY with no thumb on the scale. **THE INSTRUMENT EARNED "
 "ITS KEEP:** `--update` REFUSED at exit 1 rather than bank an eleventh identity into a census full at 10/10 — the "
 "paid-surface car's own proof used two bare negative assertions that would pass just as happily against a public "
 "render that produced nothing; cured at `62afd84d3` in the anchored form, with the before-text captured before the "
 "unmount that would have emptied it, and with ONE pre-existing frozen site deliberately left uncured because "
 "curing it too forces a census-row deletion on the eve of a gate. **FIVE ROWS THE LEDGER RULED AND THE CODE NEVER "
 "HEARD**, all re-measured by executed grep at the train tip: `BOND_KINDS` lacks `respect`; `GRUDGE_KINDS` lacks "
 "`rivalry`; `PREVIEW_OVERLAY` lacks `errandSpineEnabled`; and ENC-4's HOLE 0, called *\"TWO NAMING RULINGS, AND "
 "BOTH ARE BLOCKING\"*, had been cured for a day by a banner at the top of the same file that nobody carried down — "
 "both amended tokens measure ZERO occurrences in src and tests. ⚠ **A collateral finding the walk depends on:** "
 "`PREVIEW_OVERLAY` sets `warMemoryEnabled: true`, so the corpus the owner walks turns ON a flag whose records "
 "nothing reads, which raises O-5/RR-2 from optional to walk-degrading. **THE LANDING.** Registers 8/10 lighting "
 "`412a096f3` (five figures predicted, five exact), 9/10 dossier-mounts `e49353a33` (a shrink-only ratchet found "
 "SLACK by four), 10/10 the census `1223489c9` (totalFiles 2458→2462 predicted CERTAIN and EXACT; totalTests "
 "REFUSED in advance and measured 31223; zero entries added, removed or changed; two voiceMechanics magnitude "
 "ceilings HELD and never raised). The voice refreeze was REFUSED as predicted and cannot be honest until the "
 "unlanded src-prose car lands. Pre-gate: 14 of 14 cheap stages, 0 errors, 87.1s. Gate `npm run check`: **exit 0** "
 "in %ss at train tip `%s`. CAS `%s` → `%s`; sealed `landing-891-2026-09-04`. **ENROLLED HERE, having been named at "
 "§891 and never enrolled:** lane O2GATE and the four §891 lanes CAPACITY, CHARSET Car 1, DESKWIRING, READERREVIEW "
 "Car 2. **Nothing pushed, deployed or migrated; no tuning value signed; no golden re-recorded; the queue does not "
 "report itself empty.** (2026-09-04; SEAT: Opus 5 — Fable-unvalidated)\n"
) % (cars, gate_secs, train_tip, prod_before, prod_after)

card_demote_from = io.open(SC + 'card-line11.txt', encoding='utf-8').read().rstrip('\n')
card_demote_to = ("## (superseded) PICKUP AT §892.1 — the seat is OPUS 5 and the Fable retrovalidation is HELD; "
                  "the §893 card above supersedes, and its LIVE-FAULT pointer still holds.")

card_new_block = (
 "## ⭐⭐⭐⭐⭐ PICKUP AT §893 — ⚠⚠ **THE §891 TRAIN IS LANDED, AND THE CARVE-OUT LINE HAS MOVED.** THE SEAT IS "
 "OPUS 5. READ THIS BLOCK, THEN `$SC/RULINGS-893.md`; it supersedes every card below.\n\n"
 "`$SC` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad` · "
 "`$SP` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad`. "
 "⛔ OWNER CAP FOUR agents of any kind — **but a GATE IS NOT AN AGENT: dispatch four lanes alongside it** (owner, "
 "09-04). ⛔ **NO vitest in any lane while a gate runs** — the mutex plus DOOR 3's under-load timeout manufacture a "
 "FALSE RED; a during-gate lane MEASURES, DESIGNS and AUTHORS, then verifies when the gate clears.\n\n"
 "### ⭐⭐ THE TWO GRANTS, AND WHAT IS LEFT OF THE OWNER'S DESK\n"
 "The owner gave ALL decisions and approvals, *\"now or any that will be emergent\"*, and then gave the "
 "**carve-out sentence itself**. The chair re-cut it on ONE test — *can a later retrovalidation actually undo "
 "this?* **⛔ ONLY TWO THINGS ARE STILL GATED: every `git push`/deploy, and the owner's WALK.** The tuning "
 "SIGNATURE is DECLINED by the chair rather than gated (a promise made to players) and blocks nothing. Everything "
 "else — the cull, paid surfaces, ceiling raises, the encounters words, the twelve anchors, persisted shapes — is "
 "the chair's, marked ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧ and enrolled at §893.\n\n"
 "### ⭐ THE STATE, BY GIT\n"
 "Product `claude/composite-r4` = **`%s`** (§891 LANDED, %s cars, gate exit 0, sealed "
 "`landing-891-2026-09-04`). Train `%s`. The §892 retrovalidation is PARTIAL and HELD at the owner's trigger: "
 "eleven rows plus §892.1's four lanes plus the critic are OWED to a FABLE seat, and **an Opus chair writes no "
 "`*RULED (§892…)*` line.** Every ledger act carries `Seat: Opus 5 — Fable-unvalidated` AND a queue row in the "
 "same commit; build the queue from `git show HEAD:…`, never the worktree copy.\n\n"
 "### ⛔ THE LIVE-FAULT LIST IS NOT OPTIONAL READING\n"
 "`$SC/RESUME-NOTE.md` CUTOFF #3 holds fourteen confirmed faults still in the tree. §893 re-measured three of them "
 "and they are STILL UNEXECUTED: `respect` missing from `BOND_KINDS`, `rivalry` missing from `GRUDGE_KINDS`, "
 "`errandSpineEnabled` missing from `PREVIEW_OVERLAY`. Building on a fault costs the next pass two unpickings.\n\n"
 "### THE ROAD FROM HERE\n"
 "Six briefs are written at `$SC/briefs/` (CHARSET2, ENC3, CULL, ANCHORS, CHARSET3, REMEMBRANCE), all inheriting "
 "`_PREAMBLE.md`. Then: WORKER Cars 1/2/3 + TUNEREG Car 4 → the desk remainder (**six corpus leaves at 8–13 cars**, "
 "not \"17 desks\") → the LIGHTING WAVE, with the src-prose car only AFTER its owed rebase → GOLDEN (⚠ **land its "
 "seven cars first**; they are UNLANDED and 197+ commits behind with `commitTrailerRefusal` unwired) → W-ARMS → ⛔ "
 "the owner's WALK → the exhaustive review → ⛔ FULL STOP before the soak."
) % (prod_after, cars, train_tip)

payload = {
    "odq_marker": "\n§893 ",
    "odq_rows": [odq_row],
    "card_top_heading_prefix": "## ⭐⭐⭐⭐⭐ PICKUP AT §892.1 ",
    "card_demote_from": card_demote_from,
    "card_demote_to": card_demote_to,
    "card_new_block": card_new_block,
    "frq_in": SC + "frq.head.893",
    "frq_tail": frq_tail,
    "frq_out": SC + "queue-893.md",
}
out = SC + 'payload-893.json'
io.open(out, 'w', encoding='utf-8').write(json.dumps(payload, ensure_ascii=False, indent=1) + '\n')
# post-condition: no template token may survive into the payload
blob = json.dumps(payload, ensure_ascii=False)
for tok in ('__', '%s', 'PLACEHOLDER', 'TODO', 'XXX'):
    if tok in blob:
        print('REFUSED: unfilled token %r survived into the payload' % tok); sys.exit(1)
print('payload-893.json written, %d bytes, %d odq row(s), frq tail %d B'
      % (len(io.open(out, encoding='utf-8').read().encode()), len(payload['odq_rows']), len(frq_tail.encode())))
