# -*- coding: utf-8 -*-
"""Re-pin EM-B3c's verified base to the current tip before its sealed dispatch (the substrate arm refuses when a declared
path moved since the verified base; the shared mutation register moved by CURE-G's row). The window over every OTHER declared
path must be EMPTY; the register may have moved only if this packet's two insertion anchors are still adjacent in order.
Run from the worktree ON the branch, tree clean. argv: <old verified base full sha> <preamble sha>"""
import io, json, os, re, subprocess, sys

old_base, preamble_sha = sys.argv[1:3]
MAN = "docs/implementation/PACKET_MANIFEST.json"
IDX = "docs/implementation/INDEX.md"
PKT = "docs/implementation/packets/settlement-editor/EM-B3c.md"
REG = "scripts/mutation-coverage-manifest.json"

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True)

new_full = run("git", "rev-parse", "HEAD").stdout.strip(); new_short = new_full[:9]
assert run("git", "status", "--short").stdout.strip() == "", "the tree is not clean"
assert run("git", "merge-base", "--is-ancestor", old_base, "HEAD").returncode == 0

t = io.open(MAN, encoding="utf-8").read()
k = t.index('"id": "EM-B3c"'); start = t.rfind("{", 0, k)
depth = 0; end = None; in_str = False; esc = False
for pos in range(start, len(t)):
    ch = t[pos]
    if in_str:
        if esc: esc = False
        elif ch == "\\": esc = True
        elif ch == '"': in_str = False
        continue
    if ch == '"': in_str = True
    elif ch == "{": depth += 1
    elif ch == "}":
        depth -= 1
        if depth == 0: end = pos + 1; break
e = json.loads(t[start:end]); assert e["id"] == "EM-B3c" and e["status"] == "READY", e.get("status")
assert e["verifiedBase"] == old_base, (e["verifiedBase"], old_base)

paths = sorted({r["path"] for r in e["changeManifest"]} | {r["path"] for r in e["requiredSymbols"]})
others = [p for p in paths if p != REG]
out = run("git", "diff", "--stat", old_base, "HEAD", "--", *others).stdout
assert out.strip() == "", "THE WINDOW IS NOT EMPTY over the packet's non-register paths:\n" + out
reg_moved = run("git", "diff", "--numstat", old_base, "HEAD", "--", REG).stdout.strip()
mc = io.open(REG, encoding="utf-8").read()
A, B = '"tests/security/gallerySanitizer.pglite.test.js"', '"tests/security/gallerySeedLeak.pglite.test.js"'
i, j = mc.index(A), mc.index(B)
assert i < j and mc[i:j].count('"tests/') == 1, "EM-B3c's two mutation-register anchors are no longer adjacent in order"
for r in e["changeManifest"]:
    if r["action"] == "CREATE":
        assert not os.path.exists(r["path"]), "CREATE target present: " + r["path"]
assert not [f for f in os.listdir("supabase/migrations") if f.startswith("203")], "a migration 203 already exists"
for r in e["requiredSymbols"]:
    assert r["symbol"] in io.open(r["path"], encoding="utf-8").read(), "missing: %s :: %s" % (r["path"], r["symbol"])
print("window %s..%s EMPTY over %d non-register paths; the register moved (%s) with the anchors still adjacent; CREATE targets absent; 203 free; %d symbols resolve"
      % (old_base[:9], new_short, len(others), reg_moved.replace("\t", " ") or "no", len(e["requiredSymbols"])))

# the packet header
s = io.open(PKT, encoding="utf-8").read()
m = re.search(r"^- \*\*Verified base:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Verified base:** `fixes-2026-09-18-consist` at `%s`" % new_full, 1)
m = re.search(r"^- \*\*Last revalidated:\*\* .*$", s, flags=re.M); assert m
prev = m.group(0)
s = s.replace(prev, (
    "- **Last revalidated:** 2026-09-20 at `%s` — RE-PINNED by the chair (session a9df403c) before dispatch, the window re-run in the same command as the stamp: since `%s` "
    "the branch gained CURE-A/A2/B/C/D, EM-B1k (placed, LANDED `19c4cb853`, flipped), the lighting refreeze, CURE-E/F/G and the chair's docs — over every change-manifest and "
    "`requiredSymbols` path `git diff --stat` printed NOTHING except the shared `scripts/mutation-coverage-manifest.json` (`%s`: CURE-G's row for EM-B1k's renamed suite, inserted "
    "elsewhere in the file) — this packet's two insertion anchors (`gallerySanitizer.pglite` → `gallerySeedLeak.pglite`) are still adjacent in that order; both CREATE targets absent; "
    "migration number 203 still FREE; all %d required symbols resolve verbatim. The sealed dispatch's substrate arm reads the window from THIS base. ⛔ APPLYING 201–203 stays the OWNER's hand. "
    "The previous stamp, kept as history: %s"
) % (new_full, old_base[:9], reg_moved.replace("\t", " ") or "unmoved", len(e["requiredSymbols"]), prev.split("**", 2)[2].strip() if prev.count("**") >= 2 else prev), 1)
s = s.replace(old_base[:9], new_short)  # any short-sha mention of the old base in the header's dispatch dry-read
io.open(PKT, "w", encoding="utf-8").write(s)

# the manifest entry, surgically
e["verifiedBase"] = new_full
line_start = t.rfind("\n", 0, start) + 1
indent = " " * (start - line_start)
body = json.dumps(e, indent=2, ensure_ascii=False).split("\n")
new_text = "\n".join([body[0]] + [(indent + ln) if ln else ln for ln in body[1:]])
t = t[:start] + new_text + t[end:]
json.loads(t); io.open(MAN, "w", encoding="utf-8").write(t)

# the index row: the READY base
u = io.open(IDX, encoding="utf-8").read()
r1 = [ln for ln in u.split("\n") if ln.startswith("| EM-B3c | [`EM-B3c`]")]; assert len(r1) == 1, len(r1)
row1 = r1[0].replace("**READY** at 63de6da75", "**READY** at %s (re-pinned before dispatch; first READY at 63de6da75)" % new_short, 1)
assert row1 != r1[0], "the index row did not carry the old base"
u = u.replace(r1[0], row1, 1)
io.open(IDX, "w", encoding="utf-8").write(u)
print("EM-B3c re-pinned to %s (packet, manifest, index)" % new_short)
