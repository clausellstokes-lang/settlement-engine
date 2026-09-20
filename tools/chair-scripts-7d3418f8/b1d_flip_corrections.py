# -*- coding: utf-8 -*-
"""After flip_landed.py: EM-B1d version 5's two ruled corrections — the lighting delta's title figure and the order of `checks`
(the generator goes LAST). Run from the consist worktree ON the branch."""
import io, json, re

MAN = "docs/implementation/PACKET_MANIFEST.json"
PKT = "docs/implementation/packets/settlement-editor/EM-B1d.md"

# ---- (1) the manifest: move every `build:edge-shared` check to the END of `checks`
t = io.open(MAN, encoding="utf-8").read()
k = t.index('"id": "EM-B1d"'); start = t.rfind("{", 0, k)
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
e = json.loads(t[start:end]); assert e["id"] == "EM-B1d" and e["status"] == "LANDED"
gen = [c for c in e["checks"] if any("build:edge-shared" in str(a) for a in c)]
rest = [c for c in e["checks"] if c not in gen]
assert len(gen) == 1, len(gen)
before = [" ".join(map(str, c)) for c in e["checks"]]
e["checks"] = rest + gen
line_start = t.rfind("\n", 0, start) + 1
indent = " " * (start - line_start)
body = json.dumps(e, indent=2, ensure_ascii=False).split("\n")
t = t[:start] + "\n".join([body[0]] + [(indent + ln) if ln else ln for ln in body[1:]]) + t[end:]
json.loads(t)
io.open(MAN, "w", encoding="utf-8").write(t)
print("checks: the generator moved from position %d of %d to LAST" % (before.index(" ".join(map(str, gen[0]))) + 1, len(before)))

# ---- (2) the packet: the title figure, and a dated note under the header's Landed-at row
s = io.open(PKT, encoding="utf-8").read()
n5 = s.count("+5 titles")
s = s.replace("`+1 files / +0 parked / +1 credited / +5 titles / +1 suiteTitles`", "`+1 files / +0 parked / +1 credited / +4 titles / +1 suiteTitles`")
s = s.replace("`2649 · 383 · 2266 · 25020 · 6676`", "`2650 · 384 · 2266 · 25019 · 6676`")
m = re.search(r"^- \*\*Landed at:\*\* .*$", s, flags=re.M); assert m
note = ("\n  ⚠ **TWO FIGURES OF THIS PACKET WERE WRONG AND WERE CORRECTED AT THE LANDED FLIP (ODQ §934.47 addendum 30), under the chair's ruled exceptions:** (1) the lighting delta is "
        "`+1 / +0 / +1 / +4 / +1` — the draft priced a fifth title for the new `it` in `tests/generators/densityLaw.test.js`, a file that uses vitest GLOBALS and is therefore PARKED by the "
        "census (`OPENER_UNRESOLVED`): its titles count nowhere (measured live `2649 · 384 · 2265 · 25015 · 6675` → `2650 · 384 · 2266 · 25019 · 6676`); (2) the manifest's `checks` ran "
        "`npm run build:edge-shared` MID-CHAIN, which re-stamps declared paths so the packet gate invalidated every step after it — `focused-9..13` were executed BY HAND at the landing "
        "tree, all green, quoted in the landing commit; the generator is now LAST in `checks`. Wherever the text below still says `+5 titles` or lists the generator mid-order, this note governs.")
s = s.replace(m.group(0), m.group(0) + note, 1)
io.open(PKT, "w", encoding="utf-8").write(s)
print("packet: %d '+5 titles' spelling(s) seen; the ledgered figure corrected; the note added under the Landed-at row" % n5)
