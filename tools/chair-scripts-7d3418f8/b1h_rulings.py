# -*- coding: utf-8 -*-
"""EM-B1h's compile ruled; a live pulse defect slotted (EM-B1i); design §15's stale sentence corrected. Design + charter + ODQ §934.47 addendum 28."""
import io, sys

d, c, f, stamp = sys.argv[1:5]

DESIGN_OLD = "- **Institution state** ∈ { active, impaired, ruined, destroyed, vacant, removed } — the tree's `EntityStatus` typedef (five values) plus `ruined`, the owner's word, added by EM-B1a (§934.47 addendum 3): \"abandoned\" is `vacant`."
DESIGN_NEW = ("- **Institution state** ∈ { active, impaired, ruined, destroyed, vacant, removed } — ⚠ CORRECTED __STAMP__ (ODQ §934.47 addenda 7 and 28): `EntityStatus` is NOT widened; `ruined` is the "
              "PULSE's own literal, written through the one exported writer EM-B1e landed (`ruinInstitution`), and the institution-state pool of the DM's op is EM-B1a's: \"abandoned\" is `vacant`.")

CHARTER = """## Amendments of __STAMP__ — EM-B1h's compile ruled; a live pulse defect found and slotted as EM-B1i (ODQ §934.47 addendum 28)

**EM-B1h compiled READY-able, with the charter's figures corrected by execution:** `worldPulseFate` has THIRTEEN write sites in SIX files (five literal, four computed through three derivers, four writing `null` to CLEAR) and SEVENTEEN live values — `ruined_by_decree` is the eighteenth, not the ninth. A literal-only scan would have minted a five-word vocabulary and refused twelve live values (`disbanded` is produced in a file that never writes the field). Two readers, neither a display surface, neither branching on a value. RULED for its second version (a resume of the same lane): (1) the HOME is a zero-import leaf, `src/domain/worldPulse/worldPulseFates.js` (the kernel's own static closure is 327 modules against one — the placement before the ceiling; `envoyErrandVocabulary.js` is the precedent); (2) `null` is the CLEAR sentinel, never a member, and the four clear sites are declared `clear` roster rows; (3) the eighteen are ONE vocabulary carrying a declared KIND per member — `closure` (the fate ends or diminishes the institution) or `rise` (`founded_by_flourishing`, `upgraded_by_reconstruction`) — declared as DATA in this packet and read by nobody yet, so the packet stays golden-neutral (it freezes, it does not cure); (4) it measures the SECOND vocabulary that shares this alphabet — `institutionHistory[].fate`, written from the same variable, with `LIFECYCLE_CLOSE_FATES` feeding a damping counter — and derives it from the closure kind if that is byte-identical, or declares the relationship if not.
- **A LIVE DEFECT THE COMPILE FOUND (pre-existing; inert in no way):** both upswing fates are stamped on STANDING institutions, and `causeLifecycle.institutionDestroyed` tests the fate's TRUTHINESS — so a flourishing academy reads as DESTROYED and its criminal leash severs. FATE: **EM-B1i** (NEW; train EM-T6, right after EM-B1h, before EM-B1a): that reader tests the `closure` KIND EM-B1h declares; measured first over the pulse goldens and the preset witness — if a golden moves, it is a lived-behaviour change and goes through the OWNER's signed door with the before/after in plain words.
- Fates of its other noticed items: `institutionLifecycle.js` stands at 798 of its 800-line ceiling and is missing from the standing hot-file list — SLOT: the chair adds the row at its next sitting on the branch, and EM-B1a's pre-proof (the next packet likely to reach into it) prices the extraction; the compile brief contradicts the preamble on the census — CORRECTED in the kit the same turn (the preamble is right); design §15's stale sentence about `EntityStatus` — CORRECTED in this commit; production saves cannot be measured from the repo — CLOSED: the guard validates a WRITE, never a read, so an old save's value is never refused; the soak script's replicated fate — CLOSED: it is a member; TOOL-3's first per-train attribution names EM-B1e's +437 B and this packet's bound of 739 B.

"""

ODQ = """- **§934.47 addendum 28 — THE PULSE'S FATE VOCABULARY: THIRTEEN WRITERS AND SEVENTEEN LIVE VALUES, NOT EIGHT AND EIGHT — AND A LIVE DEFECT: A FLOURISHING ACADEMY READS AS DESTROYED (__STAMP__; the successor chair; vetoable).** The compile of EM-B1h (close the open `worldPulseFate` vocabulary before the DM's decree adds to it) confirmed the premise and corrected its figures by execution: thirteen write sites in six files, four of them computing the word through derivers, seventeen values alive today. A scan of literals alone would have minted five words and refused twelve live ones. RULED: the vocabulary lives in a zero-import leaf (the calamity kernel drags a 327-module closure); `null` clears and is never a member; each member carries a declared KIND, `closure` or `rise`, as data the packet adds and nobody yet reads — so EM-B1h stays golden-neutral. THE DEFECT, pre-existing and live: the two upswing fates (`founded_by_flourishing`, `upgraded_by_reconstruction`) are stamped on STANDING institutions, and the one reader that matters tests the fate's truthiness — so the simulation treats a flourishing academy as destroyed and severs its criminal leash. Slotted as EM-B1i right after EM-B1h: that reader tests the closure kind; measured first against the pulse goldens and the preset witness; if lived behaviour moves, it comes to the owner's signed door with the before/after in plain words. Also corrected: design §15's stale sentence that `EntityStatus` gains `ruined`.
"""

s = io.open(d, encoding="utf-8").read()
assert s.count(DESIGN_OLD) == 1, s.count(DESIGN_OLD)
io.open(d, "w", encoding="utf-8").write(s.replace(DESIGN_OLD, DESIGN_NEW.replace("__STAMP__", stamp), 1))
t = io.open(c, encoding="utf-8").read()
anchor = "## Pre-proof tasks (Opus, read-only, before each packet is READY)"
assert t.count(anchor) == 1
io.open(c, "w", encoding="utf-8").write(t.replace(anchor, CHARTER.replace("__STAMP__", stamp) + anchor))
o = io.open(f, encoding="utf-8").read().rstrip("\n")
io.open(f, "w", encoding="utf-8").write(o + "\n" + ODQ.replace("__STAMP__", stamp))
print("design 15 corrected; charter: B1h ruled + EM-B1i; ODQ add. 28")
