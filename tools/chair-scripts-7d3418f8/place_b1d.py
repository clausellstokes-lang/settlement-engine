# -*- coding: utf-8 -*-
"""(1) Withdraw the STALE EM-P2 v2 from the tree to the kit; (2) stamp EM-B1d v4 READY into a staging dir
for the kit's packet-merge tool; (3) write both index rows. Run from the consist worktree."""
import json, os, re, shutil, sys

src_dir, stage_dir, kit_superseded, base_full, preamble_sha = sys.argv[1:6]
base_short = base_full[:9]
MAN = "docs/implementation/PACKET_MANIFEST.json"
IDX = "docs/implementation/INDEX.md"
P2 = "docs/implementation/packets/settlement-editor/EM-P2.md"

# ---- (1) withdraw EM-P2 v2 (STALE) — a STALE packet still reserves its change paths
os.makedirs(kit_superseded, exist_ok=True)
shutil.copyfile(P2, os.path.join(kit_superseded, "EM-P2.v2-stale.md"))
t = open(MAN, encoding="utf-8").read()
i = t.index('"id": "EM-P2"'); start = t.rfind("{", 0, i)
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
assert end
entry = json.loads(t[start:end]); assert entry["id"] == "EM-P2" and entry["status"] == "STALE"
json.dump(entry, open(os.path.join(kit_superseded, "EM-P2.v2-stale.manifest.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)
line_start = t.rfind("\n", 0, start) + 1
after = t[end:]
if after.startswith(","):                       # a middle entry: drop the entry and its trailing comma + newline
    cut_end = end + 1
    if t[cut_end:cut_end + 1] == "\n": cut_end += 1
    t = t[:line_start] + t[cut_end:]
else:                                           # the last entry: drop it and the comma before it
    before = t[:line_start].rstrip()
    assert before.endswith(","), before[-20:]
    t = before[:-1] + "\n" + t[end:].lstrip("\n")
obj = json.loads(t); assert all(p["id"] != "EM-P2" for p in obj["packets"])
open(MAN, "w", encoding="utf-8").write(t)
u = open(IDX, encoding="utf-8").read()
rows = [ln for ln in u.split("\n") if ln.startswith("| EM-P2 |")]
assert len(rows) == 2, len(rows)
for r in rows: u = u.replace(r + "\n", "", 1)
os.remove(P2)

# ---- (2) stamp EM-B1d v4 into the staging dir
os.makedirs(stage_dir, exist_ok=True)
s = open(os.path.join(src_dir, "EM-B1d.md"), encoding="utf-8").read()
assert len(re.findall(r"^- \*\*Status:\*\* DRAFT\s*$", s, flags=re.M)) == 1
s = re.sub(r"^- \*\*Status:\*\* DRAFT\s*$", "- **Status:** READY", s, count=1, flags=re.M)
a = s.index("- **Verified base:**"); b = s.index("- **Last revalidated:**", a)
s = s[:a] + "- **Verified base:** `fixes-2026-09-18-consist` at `%s`\n" % base_full + s[b:]
m = re.search(r"^- \*\*Last revalidated:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), ("- **Last revalidated:** 2026-09-19 at `%s` — stamped by the chair at promotion, the window re-run in the same command as the stamp: since the pre-proof lane's tip the branch gained EM-B3a (`668d87512`), EM-P3 (`f4e5b64c5`), their LANDED flips, the preamble's §P2 rows 10–11 and three docs folds — NONE touches a declared path of this packet except that the STALE EM-P2 version 2, which still reserved `scripts/mutation-coverage-manifest.json`, was WITHDRAWN to the chair kit in this same commit (its version 3 is compiled and waits its turn). THE LIGHTING ABSOLUTE: the walker is already red at this tip by two un-refrozen landings — live `2648 · 383 · 2265 · 25015 · 6675` against the frozen `2646 · 383 · 2263 · 25005 · 6671`; this packet's own delta is `+1 / +0 / +1 / +4 / +1`, so the whole tuple should read `2649 · 383 · 2266 · 25019 · 6676` (measure it in an out-of-tree `git archive` probe; the refreeze is the train's terminal act and the chair's — this packet is the train's LAST member). The pre-proof lane's measured sentence follows.") % base_full, 1)
old = "(SHA-256: TO BE STAMPED BY THE CHAIR)"
assert s.count(old) == 1
s = s.replace(old, "(SHA-256: %s — stamped by the chair at promotion)" % preamble_sha)
s = s.replace("`__BASE__`", "`%s`" % base_short).replace("__BASE__", base_short)
open(os.path.join(stage_dir, "EM-B1d.md"), "w", encoding="utf-8").write(s)
e = json.load(open(os.path.join(src_dir, "EM-B1d.manifest.json"), encoding="utf-8"))
assert e["id"] == "EM-B1d"
e["status"] = "READY"; e["verifiedBase"] = base_full
json.dump(e, open(os.path.join(stage_dir, "EM-B1d.manifest.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

# ---- (3) the index rows (ONE status word per row)
r1_anchor = [ln for ln in u.split("\n") if ln.startswith("| EM-B3 | [`EM-B3`]")]; assert len(r1_anchor) == 1
row1 = ("| EM-B1d | [`EM-B1d`](./packets/settlement-editor/EM-B1d.md) | **READY** at %s (promoted 2026-09-19 from an Opus pre-proof; version 4; train EM-T3, its last member) — wave 1: `jailed` joins `NpcStatus` with every enumerating consumer named (five files at three effective lines or fewer each), a union-totality walker whose trigger is the union's DISCRIMINATING subset `{dead, exiled, retired}` (the homonyms `active`, `removed`, `missing`, `jailed` excluded from the trigger, never from the totality demand; eight files, zero exemptions, three consumers the compile had missed), its mutation-coverage row, and the edge-shared rebuild a touched bundle INPUT owes (two bundles, four generated artifacts). Status-based absence at the participation chokepoint is EM-B1f, not this packet. |" % base_short)
u = u.replace(r1_anchor[0] + "\n", r1_anchor[0] + "\n" + row1 + "\n", 1)
r2_anchor = [ln for ln in u.split("\n") if ln.startswith("| EM-B3b | LANDED | [`EM-B3b`]")]
assert len(r2_anchor) == 1, len(r2_anchor)
row2 = "| EM-B1d | READY | [`EM-B1d`](./packets/settlement-editor/EM-B1d.md) | `jailed` joins `NpcStatus`; the union-totality walker; T3's last member |"
u = u.replace(r2_anchor[0] + "\n", r2_anchor[0] + "\n" + row2 + "\n", 1)
open(IDX, "w", encoding="utf-8").write(u)
print("EM-P2 v2 withdrawn to the kit; EM-B1d v4 staged READY; index rows written")
