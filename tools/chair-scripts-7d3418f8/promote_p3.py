# -*- coding: utf-8 -*-
"""Promote EM-P3 (version 2, pre-proved + amended under the chair's rulings) to READY at the branch tip."""
import json, re, sys

src_md, src_manifest, base_full, preamble_sha = sys.argv[1:5]
base_short = base_full[:9]
PKT = "docs/implementation/packets/settlement-editor/EM-P3.md"
MAN = "docs/implementation/PACKET_MANIFEST.json"
IDX = "docs/implementation/INDEX.md"

s = open(src_md, encoding="utf-8").read()
old = "(SHA-256: TO BE STAMPED BY THE CHAIR)"
assert s.count(old) == 1
s = s.replace(old, "(SHA-256: %s — stamped by the chair at promotion; §P2 rows 10–11, which this packet is the first to carry, landed at `4da740b52`)" % preamble_sha)
assert len(re.findall(r"^- \*\*Status:\*\* DRAFT\s*$", s, flags=re.M)) == 1
s = re.sub(r"^- \*\*Status:\*\* DRAFT\s*$", "- **Status:** READY", s, count=1, flags=re.M)
m = re.search(r"^- \*\*Verified base:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Verified base:** `fixes-2026-09-18-consist` at `%s`" % base_full)
i = s.index("- **Last revalidated:**"); j = s.index("- **Depends on:**", i)
reval = ("- **Last revalidated:** 2026-09-19 at `%s` — measured by an Opus pre-proof lane at `a41a0e109` (evidence P-15…P-28) and stamped by the chair at promotion. "
  "The J-T1 window `d31af2cee..<tip>` over every change-manifest and every requiredSymbols path holds ONE moved path, and it is the reason the base is the tip: `tests/build/generationWorkerLazy.test.js`, re-minted at `91d5f155b` (ODQ §934.19 addendum 2) — the ceiling row this packet now carries puts that file in the dispatch's substrate, so the row and this stamp are one act. "
  "Both CREATE targets are absent and Git-clean; all 12 requiredSymbols rows resolve verbatim (the chair re-ran both at the promotion tip, after EM-B3a's landing `668d87512`, which touches none of this packet's paths). "
  "THE BUDGETS, PRICED UNDER THE CHAIR'S PLACEMENT CURE (the citation map lives in the domain leaf, out of `resolveConfig`'s import closure): the generation worker +206 B by per-module estimate against a ZERO-slack ceiling of 1,401,128 B — a certain red, carried by this packet's own ceiling TEST row and bounded at 412 B; the lazy engine −143 B (READ and quoted at the build, never edited); the eager first-paint set byte-identical at 268 modules; data-lazy +349 B. The rise rides the standing conditional ruling and the chair records the measured figures in the ODQ at the landing. "
  "THE LIGHTING WALKER IS ALREADY RED AT THIS TIP by EM-B3a's un-refrozen landing (its build lane measured `2648 · 383 · 2265 · 25013 · 6675` against the frozen `2646 · 383 · 2263 · 25005 · 6671`); this packet's own delta is `titles +2`, so the whole tuple should read `2648 · 383 · 2265 · 25015 · 6675` — measure it in a throwaway `git archive` probe outside the worktree (the walker's equality is a sequential chain and shows only `files` in place); the refreeze is the train's terminal act and the chair's.\n") % base_full
s = s[:i] + reval + s[j:]
m = re.search(r"^- Base SHA: `__BASE__`.*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- Base SHA: `%s` (stamped by the chair at promotion)." % base_full)
s = s.replace("`__BASE__`", "`%s`" % base_short)
assert "__BASE__" not in s, [ln for ln in s.split("\n") if "__BASE__" in ln][:3]
open(PKT, "w", encoding="utf-8").write(s)

new = json.load(open(src_manifest, encoding="utf-8"))
assert new["id"] == "EM-P3"
new["status"] = "READY"; new["verifiedBase"] = base_full
t = open(MAN, encoding="utf-8").read()
i = t.index('"id": "EM-P3"'); start = t.rfind("{", 0, i)
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
indent = t[t.rfind("\n", 0, start) + 1:start]; assert indent.strip() == ""
assert json.loads(t[start:end])["id"] == "EM-P3"
body = json.dumps(new, indent=2, ensure_ascii=False)
body = "\n".join((indent + ln if n else ln) for n, ln in enumerate(body.split("\n")))
t = t[:start] + body + t[end:]
json.loads(t)
open(MAN, "w", encoding="utf-8").write(t)

u = open(IDX, encoding="utf-8").read()
a = "| EM-P3 | [`EM-P3`](./packets/settlement-editor/EM-P3.md) | **DRAFT** — "
assert u.count(a) == 1
u = u.replace(a, "| EM-P3 | [`EM-P3`](./packets/settlement-editor/EM-P3.md) | **READY** at %s (promoted 2026-09-19 from an Opus pre-proof at the tip; version 2; train EM-T3; the first packet to carry its own byte budget — the generation worker's ceiling row, bounded at 412 B, after the placement cure took the citation map out of the worker's closure) — " % base_short)
b = "| EM-P3 | DRAFT | [`EM-P3`](./packets/settlement-editor/EM-P3.md) |"
assert u.count(b) == 1
u = u.replace(b, "| EM-P3 | READY | [`EM-P3`](./packets/settlement-editor/EM-P3.md) |")
open(IDX, "w", encoding="utf-8").write(u)
print("EM-P3 promoted in the packet, the manifest and both index rows")
