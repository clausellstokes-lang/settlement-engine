# -*- coding: utf-8 -*-
"""Promote EM-B1e (version 2, from an Opus pre-proof) to READY into a staging dir for the kit's packet-merge tool,
and write both index rows. Run from the consist worktree ON the branch.
argv: <pre-proof scratch dir> <stage dir> <base full sha> <preamble sha> <window-from short sha>"""
import io, json, os, re, subprocess, sys

src_dir, stage_dir, base_full, preamble_sha, window_from = sys.argv[1:6]
base_short = base_full[:9]
IDX = "docs/implementation/INDEX.md"

e = json.load(io.open(os.path.join(src_dir, "EM-B1e.manifest.json"), encoding="utf-8"))
assert e["id"] == "EM-B1e" and e["status"] == "DRAFT"

# ---- the window, re-run in the same command as the stamp
paths = sorted({r["path"] for r in e["changeManifest"]} | {r["path"] for r in e["requiredSymbols"]})
out = subprocess.run(["git", "diff", "--stat", window_from, "HEAD", "--"] + paths, capture_output=True, text=True, check=True).stdout
assert out.strip() == "", "THE WINDOW IS NOT EMPTY:\n" + out
for r in e["changeManifest"]:
    if r["action"] == "CREATE":
        assert not os.path.exists(r["path"]), "CREATE target present: " + r["path"]
for r in e["requiredSymbols"]:
    body = io.open(r["path"], encoding="utf-8").read()
    assert r["symbol"] in body, "required symbol missing: %s in %s" % (r["symbol"], r["path"])
print("window %s..HEAD over %d paths: EMPTY; CREATE targets absent; %d required symbols present" % (window_from, len(paths), len(e["requiredSymbols"])))

# ---- the packet
s = io.open(os.path.join(src_dir, "EM-B1e.md"), encoding="utf-8").read()
assert len(re.findall(r"^- \*\*Status:\*\* DRAFT\s*$", s, flags=re.M)) == 1
s = re.sub(r"^- \*\*Status:\*\* DRAFT\s*$", "- **Status:** READY", s, count=1, flags=re.M)

a = s.index("- **Verified base:**"); b = s.index("- **Last revalidated:**", a)
quoted = s[a:b]
m = re.search(r"\*Re-measured at(.*?)Evidence §1–§23\.\*", quoted, flags=re.S)
assert m, "the lane's revalidation sentence was not found"
lane_sentence = "Re-measured at" + re.sub(r"\n\s*>\s?", " ", m.group(1)) + "Evidence §1–§23."
lane_sentence = re.sub(r"\s+", " ", lane_sentence).strip()
c = s.index("- **Depends on:**", b)
new_rows = (
    "- **Verified base:** `fixes-2026-09-18-consist` at `%s`\n"
    "- **Last revalidated:** 2026-09-19 at `%s` — stamped by the chair at promotion, the window re-run in the same command as the stamp: "
    "since the pre-proof lane's tip `%s` the branch gained the EM preamble's §P2 row 12 (`e68d913e6` — this packet's own pre-proof already "
    "carried its two laws as brief steps 11 and 12) and the fourth docs fold (`fa931e508`); over every change-manifest and `requiredSymbols` "
    "path `git diff --stat %s HEAD` printed NOTHING, the CREATE target is absent and all five required symbols resolve verbatim. "
    "THE ORDER (R8), RULED BY THE CHAIR: this packet is built NOW, in the slot's idle window while EM-B1d version 5 is being drafted, and "
    "lands FIRST; EM-B1d version 5's base is stamped after this landing, so nothing can move under this packet's seal. The pre-proof lane's "
    "measured sentence: *%s*\n"
) % (base_full, base_full, window_from, window_from, lane_sentence)
s = s[:a] + new_rows + s[c:]

old = "(SHA-256: TO BE STAMPED BY THE CHAIR)"
assert s.count(old) == 1
s = s.replace(old, "(SHA-256: %s — stamped by the chair at promotion; the preamble gained §P2 row 12 at `e68d913e6` after the pre-proof lane verified `1cf54427…faf6`)" % preamble_sha)

old_r8 = "The cure is ORDER, not a\n  workaround — **EM-B1d lands first; EM-B1e is placed after** (R8)."
assert s.count(old_r8) == 1, "R8 sentence not found verbatim"
s = s.replace(old_r8, "The cure is ORDER, not a\n  workaround — and the chair ruled the order at promotion (R8): **EM-B1e lands FIRST**, in the slot's idle window; EM-B1d version 5 is placed after it.")

# the deferred census row leaves the TABLE (the validator's coming arm: no row for a path the packet does not change); the blockquote under the ledger already says it
rows = [ln for ln in s.split("\n") if ln.startswith("| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js`")]
assert len(rows) == 1, len(rows)
s = s.replace(rows[0] + "\n", "", 1)

answers = (
    "\n\n### THE CHAIR'S ANSWERS AT PROMOTION (2026-09-19; ODQ §934.47 addendum 24)\n\n"
    "**R1** confirmed — this packet adds the writer with `fate` a REQUIRED argument; it mints no spelling. **R2** DOCKETED as **EM-B1h** (the fate vocabulary closed: one frozen "
    "`WORLD_PULSE_FATES` and a totality walker over its writers), chartered to land BEFORE EM-B1a makes `ruined_by_decree` producible — FINITE-SEMANTICS is the estate's law and an "
    "open vocabulary is where a ninth spelling lands unnoticed. **R4** goes to EM-B1a's pre-proof (the fourth institution vocabulary in `institutionStatusModel.js`). **R5** the "
    "charter's stale EM-T3 row is corrected in the same ledger commit. **R6** is moot twice over: this packet lands first, and TOOL-3's ceilings carry a declared headroom ratcheted "
    "per train. **R7** DOCKETED as a test-side parallel lane (FIX-T1: route the 28 hand-built ruin replicas through the writer). **R8** REVERSED — this packet lands first (header). "
    "**R9** DOCKETED onto EM-B1a's compile as a binding measurement: a decree-ruin joins an authored act to an irreversible consequence (criminal leashes sever), so the op's undo "
    "and the tick's event semantics must each say what becomes of the leashes.\n"
)
s = s.rstrip("\n") + answers
s = s.replace("`__BASE__`", "`%s`" % base_short).replace("__BASE__", base_short)
os.makedirs(stage_dir, exist_ok=True)
io.open(os.path.join(stage_dir, "EM-B1e.md"), "w", encoding="utf-8").write(s)

# ---- the manifest entry
e["status"] = "READY"; e["verifiedBase"] = base_full
for k in [k for k in e if k.startswith("_")]:
    del e[k]
json.dump(e, io.open(os.path.join(stage_dir, "EM-B1e.manifest.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

# ---- the index rows (ONE status word per row)
u = io.open(IDX, encoding="utf-8").read()
r1 = [ln for ln in u.split("\n") if ln.startswith("| EM-B1d | [`EM-B1d`]")]; assert len(r1) == 1, len(r1)
row1 = ("| EM-B1e | [`EM-B1e`](./packets/settlement-editor/EM-B1e.md) | **READY** at %s (promoted 2026-09-19 from an Opus pre-proof; version 2; FLOATING — built in the slot's idle "
        "window) — wave 1: the pulse's ruin shape gets ONE exported writer, `ruinInstitution(inst, { reason, fate })`, both arguments required, the five keys in their existing order, "
        "so the disaster and the DM's later decree leave the same record; byte-identical pulse output is the packet's central claim (the preset witness); no budgeted chunk, no "
        "edge-shared closure, no mutation-coverage row. |" % base_short)
u = u.replace(r1[0] + "\n", r1[0] + "\n" + row1 + "\n", 1)
r2 = [ln for ln in u.split("\n") if ln.startswith("| EM-B1d | READY | [`EM-B1d`]")]; assert len(r2) == 1, len(r2)
row2 = "| EM-B1e | READY | [`EM-B1e`](./packets/settlement-editor/EM-B1e.md) | the pulse's one ruin writer; floats; EM-B1a depends on it |"
u = u.replace(r2[0] + "\n", r2[0] + "\n" + row2 + "\n", 1)
io.open(IDX, "w", encoding="utf-8").write(u)
print("EM-B1e v2 staged READY at %s; index rows written" % base_short)
