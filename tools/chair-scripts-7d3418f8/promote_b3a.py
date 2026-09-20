# -*- coding: utf-8 -*-
"""Promote EM-B3a (version 3, pre-proved by the Opus lane) to READY at the branch tip. Run from the consist worktree."""
import json, re, sys

src_md, src_manifest, base_full, preamble_sha, tuple_now, tuple_after = sys.argv[1:7]
base_short = base_full[:9]
PKT = "docs/implementation/packets/settlement-editor/EM-B3a.md"
MAN = "docs/implementation/PACKET_MANIFEST.json"
IDX = "docs/implementation/INDEX.md"

# ---- the packet
s = open(src_md, encoding="utf-8").read()
assert s.count("- **Status:** `DRAFT`") == 1
s = s.replace("- **Status:** `DRAFT`", "- **Status:** `READY`")
m = re.search(r"^- \*\*Verified base:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Verified base:** `fixes-2026-09-18-consist` at `%s`" % base_full)
m = re.search(r"^- \*\*Last revalidated:\*\* .*$", s, flags=re.M); assert m
reval = ("- **Last revalidated:** 2026-09-19 at `%s` — measured by the Opus PRE-PROOF lane at `a41a0e109` (chair session 7d3418f8) and stamped by the chair at promotion. "
  "Re-measured from `d31af2ceebf643818201b2e2ab4a556765d2fc7c` under **J-T1**: `git diff --stat <old base> <tip>` over all twenty declared substrate paths and all five change paths printed NOTHING — zero paths moved — "
  "both CREATE targets are absent and untracked, and all 26 original `requiredSymbols` rows re-resolved verbatim. One row was ADDED and none removed: `supabase/migrations/202_edit_registry_public_denylist.sql`, because EM-B3b landed at `ac46d2daf` and made 202 — not 136 — the net-current gallery scanner "
  "(`sqlDenies('decrees')` false to true; the SQL alternation 33 to 34). Because 202 was created inside the old window, adding that row REQUIRED this base stamp; the two are one act. "
  "The chair re-ran the window to the promotion tip: the commit after the lane's tip (`4da740b52`, the preamble's two new registration costs) touches no declared path. "
  "The four budgeted bundle closures were priced and this packet reaches none of them, so it carries no ceiling TEST row. "
  "THE LIGHTING ABSOLUTE, stamped from the live baseline at the promotion tip: `%s` now; after THIS packet alone (`files +2 · parked +0 · credited +2 · titles +8 · suiteTitles +4`) the walker reads `%s` — the refreeze is the train's terminal act and the chair's, never this packet's. "
  "Version 3 carries the chair's three rulings on version 2 (the veil precedes the writer; the two keys' inner shapes are opaque here; EM-B3c chartered). No gate was run by the pre-proof lane and none is claimed.") % (base_full, tuple_now, tuple_after)
s = s.replace(m.group(0), reval)
m = re.search(r"^- \*\*Preamble:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: %s — stamped by the chair at promotion; the pre-proof lane verified `95e9a5f4…afaa` at `a41a0e109`, and the chair amended §P2 with rows 10–11 at `4da740b52`, which this packet already satisfies: it reaches no edge-shared input and no byte budget, E25)" % preamble_sha)
# the scaffolding section is deleted once executed (its own instruction)
k = s.index("## 13. The revalidation sentence")
s = s[:k].rstrip("\n") + "\n"
s = s.replace("`__BASE__`", "`%s`" % base_short)
assert "__BASE__" not in s
open(PKT, "w", encoding="utf-8").write(s)

# ---- the manifest entry, spliced surgically at the existing entry's span and indentation
new = json.load(open(src_manifest, encoding="utf-8"))
assert new["id"] == "EM-B3a"
new["status"] = "READY"; new["verifiedBase"] = base_full
t = open(MAN, encoding="utf-8").read()
i = t.index('"id": "EM-B3a"')
start = t.rfind("{", 0, i)
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
line_start = t.rfind("\n", 0, start) + 1
indent = t[line_start:start]
assert indent.strip() == "", repr(indent)
old_obj = json.loads(t[start:end]); assert old_obj["id"] == "EM-B3a"
body = json.dumps(new, indent=2, ensure_ascii=False)
body = "\n".join((indent + ln if n else ln) for n, ln in enumerate(body.split("\n")))
t = t[:start] + body + t[end:]
json.loads(t)  # the whole manifest still parses
open(MAN, "w", encoding="utf-8").write(t)

# ---- the index rows (ONE status word per row; the validator reads the first status word anywhere in the cell)
u = open(IDX, encoding="utf-8").read()
a = "| EM-B3a | [`EM-B3a`](./packets/settlement-editor/EM-B3a.md) | **DRAFT** — "
assert u.count(a) == 1
u = u.replace(a, "| EM-B3a | [`EM-B3a`](./packets/settlement-editor/EM-B3a.md) | **READY** at %s (promoted 2026-09-19 from an Opus pre-proof at the tip; version 3; train EM-T3; THE VEIL PRECEDES THE WRITER — EM-B2a and EM-C1 depend on this packet) — " % base_short)
b = "| EM-B3a | DRAFT | [`EM-B3a`](./packets/settlement-editor/EM-B3a.md) |"
assert u.count(b) == 1
u = u.replace(b, "| EM-B3a | READY | [`EM-B3a`](./packets/settlement-editor/EM-B3a.md) |")
open(IDX, "w", encoding="utf-8").write(u)
print("EM-B3a promoted in the packet, the manifest and both index rows")
