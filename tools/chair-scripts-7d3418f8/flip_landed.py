# -*- coding: utf-8 -*-
"""Flip a READY packet to LANDED (header status alone on its line; manifest status + landedAt; both index rows).
usage: flip_landed.py <ID> <landing full sha> <index clause>"""
import json, re, sys

pid, landed, clause = sys.argv[1:4]
PKT = "docs/implementation/packets/settlement-editor/%s.md" % pid
MAN = "docs/implementation/PACKET_MANIFEST.json"
IDX = "docs/implementation/INDEX.md"

s = open(PKT, encoding="utf-8").read()
m = re.search(r"^- \*\*Status:\*\* `?READY`?\s*$", s, flags=re.M); assert m, "status row"
s = s.replace(m.group(0), "- **Status:** `LANDED`", 1)
m = re.search(r"^- \*\*Packet version:\*\* (.*)$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Landed at:** `%s` — %s\n" % (landed, clause) + m.group(0), 1)  # BEFORE the version row, so the row's own blockquote stays attached to it
open(PKT, "w", encoding="utf-8").write(s)

t = open(MAN, encoding="utf-8").read()
i = t.index('"id": "%s"' % pid)
j = t.index('"status": "READY"', i); assert j - i < 400
t = t[:j] + '"status": "LANDED"' + t[j + len('"status": "READY"'):]
k = t.index('"verifiedBase": "', i); e = t.index("\n", k)
line = t[k:e]; assert line.rstrip().endswith('",'), line
indent = t[t.rfind("\n", 0, k) + 1:k]
t = t[:e] + "\n" + indent + '"landedAt": "%s",' % landed + t[e:]
obj = json.loads(t); ent = [p for p in obj["packets"] if p["id"] == pid][0]
assert ent["status"] == "LANDED" and ent["landedAt"] == landed
open(MAN, "w", encoding="utf-8").write(t)

u = open(IDX, encoding="utf-8").read()
m = re.search(r"^\| %s \| \[`%s`\]\(([^)]*)\) \| \*\*READY\*\* at [0-9a-f]+ \(([^)]*)\) — " % (re.escape(pid), re.escape(pid)), u, flags=re.M); assert m, "index row 1"
u = u.replace(m.group(0), "| %s | [`%s`](%s) | **LANDED** at `%s` (%s) — " % (pid, pid, m.group(1), landed[:9], clause), 1)
b = "| %s | READY | [`%s`]" % (pid, pid); assert u.count(b) == 1
u = u.replace(b, "| %s | LANDED | [`%s`]" % (pid, pid))
open(IDX, "w", encoding="utf-8").write(u)
print(pid, "flipped LANDED at", landed[:9])
