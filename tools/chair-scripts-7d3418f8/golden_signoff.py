# -*- coding: utf-8 -*-
"""The owner's sign-off on the golden re-record — recorded verbatim with its exact scope. ODQ §934.58 + a charter line."""
import io, sys

c, f, stamp = sys.argv[1:4]

CHARTER = """## Amendments of __STAMP__ — THE OWNER SIGNED THE GOLDEN DOOR (ODQ §934.58)

The owner, in chat: *"I give my sign off to the golden"*. SCOPE, as it was put to the owner (ODQ §934.57 and the chair's report of the same hour): ONE signed act at train EM-T4 carrying TWO attributed causes — (1) **FIX-G1**: exactly ONE row of `tests/fixtures/generator-golden-master.json` (`town · germanic · mountain · mountain_pass · civilized`), the viability summary's "…has 6 operational dependencies…" becoming "…has 5 operational dependencies…", and ZERO prose-manifest rows; (2) **EM-P1**, stable identity: the re-record of the goldens its permanent ids move — over the MEASURED movers only. HOW IT IS EXECUTED: by the CHAIR, never a lane, through the repo's own door (`tests/helpers/goldenRecordDoor.js`): `GOLDEN_SHIFT_SIGNED` names a signed-record FILE carrying the owner's words verbatim, the action `re-record`, the surface, the proof form and `predictedRows` stated BEFORE the write — a re-record that moves a different number of rows than predicted writes nothing. BOUNDS THE CHAIR HOLDS ITSELF TO: EM-P1's exact price (files and row counts) comes from its pre-proof and is REPORTED TO THE OWNER before the door is opened; any mover the two causes do not explain — a prose row, a non-id key, a second FIX-G1 row — is a STOP and returns to the owner; this signature covers these two re-records and nothing else (a later golden shift is a new signature).

"""

ODQ = """- **§934.58 THE OWNER SIGNED THE GOLDEN DOOR (__STAMP__): "I give my sign off to the golden".** RECORDED VERBATIM, WITH ITS SCOPE AS IT WAS PUT TO THE OWNER the same hour (§934.57 and the chair's report): ONE signed re-record at train EM-T4 carrying two attributed causes. (1) FIX-G1 — exactly ONE row of the generator golden master (`town · germanic · mountain · mountain_pass`): "…has 6 operational dependencies…" becomes "…has 5 operational dependencies…"; zero prose-manifest rows; saved worlds keep their stored sentence. (2) EM-P1, stable identity — the goldens its permanent NPC, institution and faction ids move, over the MEASURED movers only. EXECUTED BY THE CHAIR through the repo's own door: the signed-record file carries these words verbatim, the action `re-record` (an owner-only verb), the surface, the proof form, and the predicted row count stated BEFORE the write — a re-record that moves a different number of rows than predicted writes nothing. THE CHAIR'S BOUNDS: EM-P1's exact price (which files, how many rows, which keys) comes from its pre-proof, now running, and is REPORTED TO THE OWNER before the door is opened; a mover neither cause explains (a prose row, a non-id key, a second FIX-G1 row) is a STOP that returns to the owner; the signature covers these two re-records and nothing else — a recorded approval is a fact about this day, never a standing grant.
"""

t = io.open(c, encoding="utf-8").read()
anchor = "## Pre-proof tasks (Opus, read-only, before each packet is READY)"
assert t.count(anchor) == 1
io.open(c, "w", encoding="utf-8").write(t.replace(anchor, CHARTER.replace("__STAMP__", stamp) + anchor))
o = io.open(f, encoding="utf-8").read().rstrip("\n")
io.open(f, "w", encoding="utf-8").write(o + "\n" + ODQ.replace("__STAMP__", stamp))
print("charter + ODQ 934.58: the owner's golden sign-off recorded")
