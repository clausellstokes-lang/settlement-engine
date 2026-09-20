# -*- coding: utf-8 -*-
"""Flip a READY packet to LANDED — the prior chair's flip_landed.py with a ROBUST index-row parse (the old regex `\\(([^)]*)\\) — `
fails when the READY row's first parenthetical is followed by anything but ` — `, or when the row carries a second parenthetical it
did not expect). Same output shape: header status alone on its line + a `- **Landed at:**` row before the version row; manifest
status + landedAt after verifiedBase; index row 1 `**LANDED** at `<short>` (<clause>) — <the rest unchanged>`; index row 2 status word.
usage: flip_landed_v2.py <ID> <landing full sha> <index clause> [--dry-run]   (run from the worktree ON the branch, tree clean)"""
import io, json, re, subprocess, sys

pid, landed, clause = sys.argv[1:4]
dry = "--dry-run" in sys.argv[4:]
assert re.fullmatch(r"[0-9a-f]{40}", landed), "the landing sha must be the FULL 40-hex sha"
PKT = "docs/implementation/packets/settlement-editor/%s.md" % pid
MAN = "docs/implementation/PACKET_MANIFEST.json"
IDX = "docs/implementation/INDEX.md"
if not dry:
    st = subprocess.run(["git", "status", "--short"], capture_output=True, text=True).stdout.strip()
    assert st == "", "the tree is not clean:\n" + st
    assert subprocess.run(["git", "cat-file", "-e", landed + "^{commit}"]).returncode == 0, "the landing sha is not a commit here"

s = io.open(PKT, encoding="utf-8").read()
m = re.search(r"^- \*\*Status:\*\* `?READY`?\s*$", s, flags=re.M); assert m, "status row not READY"
s = s.replace(m.group(0), "- **Status:** `LANDED`", 1)
assert "- **Landed at:**" not in s
m = re.search(r"^- \*\*Packet version:\*\* (.*)$", s, flags=re.M); assert m, "version row"
s = s.replace(m.group(0), "- **Landed at:** `%s` — %s\n" % (landed, clause) + m.group(0), 1)

t = io.open(MAN, encoding="utf-8").read()
i = t.index('"id": "%s"' % pid)
j = t.index('"status": "READY"', i); assert j - i < 400, "the READY status is not this entry's"
t = t[:j] + '"status": "LANDED"' + t[j + len('"status": "READY"'):]
k = t.index('"verifiedBase": "', i); e = t.index("\n", k)
line = t[k:e]; assert line.rstrip().endswith('",'), line
indent = t[t.rfind("\n", 0, k) + 1:k]
t = t[:e] + "\n" + indent + '"landedAt": "%s",' % landed + t[e:]
obj = json.loads(t); ent = [p for p in obj["packets"] if p["id"] == pid][0]
assert ent["status"] == "LANDED" and ent["landedAt"] == landed

u = io.open(IDX, encoding="utf-8").read()
prefix = "| %s | [`%s`](./packets/settlement-editor/%s.md) | **READY** at " % (pid, pid, pid)
rows = [ln for ln in u.split("\n") if ln.startswith(prefix)]; assert len(rows) == 1, "index row 1: %d matches" % len(rows)
row = rows[0]
rest = row[len(prefix):]                       # "<short> (<first parenthetical>) — <the rest>"
mm = re.match(r"([0-9a-f]{7,40}) \(", rest); assert mm, "row 1 does not read '<sha> (' after READY at"
p0 = rest.index("(", mm.end() - 1)
# the first parenthetical, balanced
depth, p1 = 0, None
for pos in range(p0, len(rest)):
    if rest[pos] == "(": depth += 1
    elif rest[pos] == ")":
        depth -= 1
        if depth == 0: p1 = pos; break
assert p1 is not None, "unbalanced parenthetical in row 1"
after = rest[p1 + 1:]
assert after.startswith(" — "), "row 1: expected ' — ' after the first parenthetical, got %r" % after[:20]
new_row = ("| %s | [`%s`](./packets/settlement-editor/%s.md) | **LANDED** at `%s` (%s)" % (pid, pid, pid, landed[:9], clause)) + after
u = u.replace(row, new_row, 1)
b = "| %s | READY | [`%s`]" % (pid, pid); assert u.count(b) == 1, "index row 2"
u = u.replace(b, "| %s | LANDED | [`%s`]" % (pid, pid), 1)

if dry:
    print("DRY RUN — nothing written. Row 1 becomes:\n  " + new_row[:300] + "\n  …")
    print("Header gains: - **Landed at:** `%s` — %s" % (landed, clause[:80]))
else:
    io.open(PKT, "w", encoding="utf-8").write(s); io.open(MAN, "w", encoding="utf-8").write(t); io.open(IDX, "w", encoding="utf-8").write(u)
    print(pid, "flipped LANDED at", landed[:9], "(header, manifest, both index rows)")
