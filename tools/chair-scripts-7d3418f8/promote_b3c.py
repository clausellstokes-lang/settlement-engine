# -*- coding: utf-8 -*-
"""Promote EM-B3c VERSION 2 (the hard-deny subset walker + MIGRATION 203) to READY into a staging dir for packet-merge, and write both index rows.
Run from the consist worktree ON the branch, tree clean. argv: <kit packets-waiting dir> <stage dir> <base full sha> <preamble sha> <window-from sha>"""
import io, json, os, re, subprocess, sys

src_dir, stage_dir, base_full, preamble_sha, window_from = sys.argv[1:6]
base_short = base_full[:9]
IDX = "docs/implementation/INDEX.md"

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True)

e = json.load(io.open(os.path.join(src_dir, "EM-B3c.manifest.json"), encoding="utf-8"))
assert e["id"] == "EM-B3c" and e["status"] == "DRAFT"

# ---- the window, re-run in the same command as the stamp. ONE path is ALLOWED to have moved: the shared mutation register (EM-B1d's landed +4 insert),
# provided this packet's own insertion anchors are still adjacent in the order it names.
paths = sorted({r["path"] for r in e["changeManifest"]} | {r["path"] for r in e["requiredSymbols"]})
REG = "scripts/mutation-coverage-manifest.json"
out = run("git", "diff", "--stat", window_from, "HEAD", "--", *[p for p in paths if p != REG]).stdout
assert out.strip() == "", "THE WINDOW IS NOT EMPTY:\n" + out
reg_moved = run("git", "diff", "--numstat", window_from, "HEAD", "--", REG).stdout.strip()
mc = io.open(REG, encoding="utf-8").read()
A, B = '"tests/security/gallerySanitizer.pglite.test.js"', '"tests/security/gallerySeedLeak.pglite.test.js"'
i, j = mc.index(A), mc.index(B)
assert i < j and mc[i:j].count('"tests/') == 1, "the two mutation-register anchors are no longer adjacent in that order"
for r in e["changeManifest"]:
    if r["action"] == "CREATE":
        assert not os.path.exists(r["path"]), "CREATE target present: " + r["path"]
        assert run("git", "ls-files", "--error-unmatch", r["path"]).returncode != 0
assert not [f for f in os.listdir("supabase/migrations") if f.startswith("203")], "a migration 203 already exists"
for r in e["requiredSymbols"]:
    assert r["symbol"] in io.open(r["path"], encoding="utf-8").read(), "missing: %s :: %s" % (r["path"], r["symbol"])
print("window %s..HEAD EMPTY over %d paths (the register moved: %s — anchors still adjacent); CREATE targets absent; 203 free; %d required symbols resolve"
      % (window_from[:9], len(paths) - 1, reg_moved.replace("\t", " "), len(e["requiredSymbols"])))

# ---- the packet
s = io.open(os.path.join(src_dir, "EM-B3c.md"), encoding="utf-8").read()
m = re.search(r"^- \*\*Status:\*\* `DRAFT`.*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Status:** `READY`", 1)
m = re.search(r"^- \*\*Verified base:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Verified base:** `fixes-2026-09-18-consist` at `%s`" % base_full, 1)
m = re.search(r"^- \*\*Last revalidated:\*\* .*$", s, flags=re.M); assert m
lane = m.group(0).split("—", 1)[1].strip() if "—" in m.group(0) else ""
s = s.replace(m.group(0), (
    "- **Last revalidated:** 2026-09-19 at `%s` — stamped by the chair at promotion, the window re-run in the same command as the stamp: since the compile tip `%s` the branch gained the EM "
    "preamble's §P2 row 12, two docs folds, EM-B1e (placed, LANDED) and EM-B1d version 5 (placed, LANDED `95e494bdb`); over every change-manifest and `requiredSymbols` path `git diff --stat` "
    "printed NOTHING except the shared `scripts/mutation-coverage-manifest.json` (`%s`: EM-B1d's landed row, inserted elsewhere in the file) — this packet's two insertion anchors "
    "(`gallerySanitizer.pglite` → `gallerySeedLeak.pglite`) are still adjacent in that order; both CREATE targets are absent and untracked; migration number 203 is FREE; all required symbols "
    "resolve verbatim. ⛔ APPLYING migrations 201–203 (`supabase db push` + the applied-head bump) is the OWNER's hand; until then production's scanner is the pre-202 definition and the gap "
    "this packet closes is OPEN IN PRODUCTION (ODQ §934.55). The compile lane's sentence: %s"
) % (base_full, window_from[:9], reg_moved.replace("\t", " "), lane.replace("__BASE__", base_short)), 1)
old = "TO BE STAMPED BY THE CHAIR"
assert s.count(old) >= 1
s = s.replace(old, "%s — stamped by the chair at promotion (the preamble gained §P2 row 12 at `e68d913e6`)" % preamble_sha, 1)
s = s.replace("`__BASE__`", "`%s`" % base_short).replace("__BASE__", base_short)
assert "__BASE__" not in s
os.makedirs(stage_dir, exist_ok=True)
io.open(os.path.join(stage_dir, "EM-B3c.md"), "w", encoding="utf-8").write(s)

# the compile lane wrote bare-string acceptance cases; the validator wants {id, case} objects (the same defect EM-P2's pre-proof lane found in its own manifest)
cases = []
for cse in e["acceptanceCases"]:
    if isinstance(cse, str):
        mm = re.match(r"^(A\d+[a-z]?)\s+(.*)$", cse, flags=re.S); assert mm, cse[:40]
        cases.append({"id": mm.group(1), "case": mm.group(2)})
    else:
        cases.append(cse)
e["acceptanceCases"] = cases
assert [c["id"] for c in cases] == ["A%d" % n for n in range(1, len(cases) + 1)], [c["id"] for c in cases]
e["status"] = "READY"; e["verifiedBase"] = base_full
for k in [k for k in list(e) if k.startswith("_")]:
    del e[k]
json.dump(e, io.open(os.path.join(stage_dir, "EM-B3c.manifest.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

u = io.open(IDX, encoding="utf-8").read()
r1 = [ln for ln in u.split("\n") if ln.startswith("| EM-B3b | [`EM-B3b`]")]; assert len(r1) == 1, len(r1)
row1 = ("| EM-B3c | [`EM-B3c`](./packets/settlement-editor/EM-B3c.md) | **READY** at %s (promoted 2026-09-19; version 2; FLOATS WITH PRIORITY — built right after train EM-T3's terminal) — "
        "⛔ CLOSES A LIVE DEFENSE-IN-DEPTH GAP (ODQ §934.55): three private ledgers the client refuses (`factionPairStates`, `envoyErrands`, `concludedWars`) are refused by NO SQL "
        "migration. A hard-deny SUBSET walker is written first and is RED for exactly those three; **migration 203** re-creates the gallery scanner with the array gaining them and every "
        "other byte of the body identical to 202 (a contracted mechanical diff), with the rehearsal-train registration and the scanner-owner pin re-pointed; then the walker is green — no "
        "exemption list is built. Applying 201–203 is the owner's hand. |" % base_short)
u = u.replace(r1[0] + "\n", r1[0] + "\n" + row1 + "\n", 1)
r2 = [ln for ln in u.split("\n") if ln.startswith("| EM-B3b | LANDED | [`EM-B3b`]")]; assert len(r2) == 1, len(r2)
row2 = "| EM-B3c | READY | [`EM-B3c`](./packets/settlement-editor/EM-B3c.md) | the hard-deny subset walker + migration 203 (three private ledgers the SQL scanner never refused); floats with priority |"
u = u.replace(r2[0] + "\n", r2[0] + "\n" + row2 + "\n", 1)
io.open(IDX, "w", encoding="utf-8").write(u)
print("EM-B3c v2 staged READY at %s; index rows written" % base_short)
