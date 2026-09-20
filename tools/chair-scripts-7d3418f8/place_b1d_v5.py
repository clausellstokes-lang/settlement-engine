# -*- coding: utf-8 -*-
"""Place EM-B1d VERSION 5 over version 4 (packet md replaced; the manifest entry replaced SURGICALLY; both index rows re-worded).
Run from the consist worktree ON the branch, tree clean.
argv: <v5 dir> <base full sha> <preamble sha> <window-from sha> <live lighting tuple, e.g. "2649 · 383 · 2266 · 25022 · 6676">"""
import io, json, os, re, subprocess, sys

v5, base_full, preamble_sha, window_from, live_tuple = sys.argv[1:6]
base_short = base_full[:9]
MAN = "docs/implementation/PACKET_MANIFEST.json"
IDX = "docs/implementation/INDEX.md"
PKT = "docs/implementation/packets/settlement-editor/EM-B1d.md"

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True)

e = json.load(io.open(os.path.join(v5, "EM-B1d.manifest.json"), encoding="utf-8"))
assert e["id"] == "EM-B1d" and e["status"] == "READY"

# ---- THE CHAIR'S CUT: a symbol the packet itself re-spells cannot be a requiredSymbols row (asserted verbatim at EVERY status,
# so `check:packet`'s first step would red after the one-token fixture cure); and a READY retirement must still be PRESENT, so it
# cannot be a retiredSymbols row either. The change-manifest TEST row and section 7's one-token instruction carry it.
before = len(e["requiredSymbols"])
e["requiredSymbols"] = [r for r in e["requiredSymbols"] if not (r["path"] == "tests/domain/espionageMission.test.js" and r["symbol"] == "status: 'imprisoned'")]
assert len(e["requiredSymbols"]) == before - 1 == 16, (before, len(e["requiredSymbols"]))

# ---- the six checks of the packet's own revalidation sentence, EXECUTED
assert run("git", "merge-base", "--is-ancestor", window_from, "HEAD").returncode == 0                      # (a)
paths = sorted({r["path"] for r in e["changeManifest"]} | {r["path"] for r in e["requiredSymbols"]})
out = run("git", "diff", "--stat", window_from, "HEAD", "--", *paths).stdout                                # (b)
assert out.strip() == "", "THE WINDOW IS NOT EMPTY:\n" + out
for r in e["requiredSymbols"]:                                                                              # (c)
    assert r["symbol"] in io.open(r["path"], encoding="utf-8").read(), "missing: %s :: %s" % (r["path"], r["symbol"])
for r in e["changeManifest"]:                                                                               # (d)
    if r["action"] == "CREATE":
        assert not os.path.exists(r["path"]), "CREATE target present: " + r["path"]
        assert run("git", "ls-files", "--error-unmatch", r["path"]).returncode != 0
mc = io.open("scripts/mutation-coverage-manifest.json", encoding="utf-8").read()                           # (e)
i = mc.index('"tests/lint/dossierMountRegistry.walker.test.js"'); j = mc.index('"tests/lint/stepPresentationEngineFence.walker.test.js"')
assert i < j and mc[i:j].count('"tests/') == 1, "the mutation-coverage anchors are no longer file-adjacent in that order"
print("checks (a)-(e): ancestor; window %s..HEAD EMPTY over %d paths; 16 required symbols resolve; CREATE absent+untracked; anchors adjacent" % (window_from[:9], len(paths)))

# ---- the packet
s = io.open(os.path.join(v5, "EM-B1d.md"), encoding="utf-8").read()
assert len(re.findall(r"^- \*\*Status:\*\* READY\s*$", s, flags=re.M)) == 1
a = s.index("- **Verified base:**"); c = s.index("- **Depends on:**", a)
new_rows = (
    "- **Verified base:** `fixes-2026-09-18-consist` at `%s`\n"
    "- **Last revalidated:** 2026-09-19 at `%s` — stamped by the chair at the placement of version 5, the packet's own six checks EXECUTED in the same command as the stamp: "
    "(a) `%s` is an ancestor of HEAD; (b) over every change-manifest and `requiredSymbols` path `git diff --stat %s HEAD` printed NOTHING — since the build lane's tree the branch "
    "gained only the EM preamble's §P2 row 12 (`e68d913e6`), the fourth docs fold (`fa931e508`), EM-B1e's placement, its landing (`src/domain/worldPulse/calamityKernel.js` and a new "
    "`tests/domain/ruinInstitution.test.js` — neither is a path of this packet) and its LANDED flip; (c) all SIXTEEN `requiredSymbols` rows resolve verbatim; (d) the CREATE target is "
    "absent and untracked; (e) the two mutation-coverage anchors are file-adjacent in order; (f) THE LIGHTING TUPLE: live `%s` after EM-B1e's landing (un-refrozen; the frozen baseline "
    "still reads `2646 · 383 · 2263 · 25005 · 6671`), and this packet's delta is `+1 / +0 / +1 / +5 / +1` — measure the whole tuple once in an out-of-tree probe; any other delta is a STOP. "
    "⛔ THE CHAIR'S ONE CUT AT PLACEMENT: the draft's seventeenth `requiredSymbols` row named the fixture token `status: 'imprisoned'` in `tests/domain/espionageMission.test.js`, which "
    "THIS PACKET RE-SPELLS — `requiredSymbols` is asserted verbatim at every status, so `check:packet`'s first step would have red the moment the cure was made (the EM-P3 lesson, "
    "pre-proof step 10), and a READY retirement must still be present, so it cannot be a `retiredSymbols` row either. The row is dropped; §7's TEST row carries the one-token instruction, "
    "and the token not being found EXACTLY ONCE is a STOP. "
    "ⓘ The version-4 base `32f1ba048…` and every figure stamped against it are superseded: the build lane executed version 4 at `58fcfe614` and its measurements, quoted throughout "
    "below, are that tree's.\n"
) % (base_full, base_full, window_from[:9], window_from[:9], live_tuple)
s = s[:a] + new_rows + s[c:]
old_p = "(SHA-256: 1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6 — re-verified by execution at `58fcfe614`)"
assert s.count(old_p) == 1
s = s.replace(old_p, "(SHA-256: %s — stamped by the chair at placement; the preamble gained §P2 row 12 at `e68d913e6`, which is this packet's own STOP-1 written as law)" % preamble_sha)
s = s.replace("`__BASE__`", "`%s`" % base_short).replace("__BASE__", base_short)  # the dispatch dry-read table in section 4 names it once more
assert "__BASE__" not in s, "an unstamped __BASE__ survives"
io.open(PKT, "w", encoding="utf-8").write(s)

# ---- the manifest entry, replaced SURGICALLY at the existing indentation
e["verifiedBase"] = base_full
e.pop("_verifiedBaseNote", None)
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
old_entry = json.loads(t[start:end]); assert old_entry["id"] == "EM-B1d" and old_entry["status"] == "READY"
line_start = t.rfind("\n", 0, start) + 1
indent = " " * (start - line_start)
body = json.dumps(e, indent=2, ensure_ascii=False).split("\n")
new_text = "\n".join([body[0]] + [(indent + ln) if ln else ln for ln in body[1:]])
t = t[:start] + new_text + t[end:]
obj = json.loads(t); assert sum(1 for p in obj["packets"] if p["id"] == "EM-B1d") == 1
io.open(MAN, "w", encoding="utf-8").write(t)

# ---- the index rows (ONE status word per row)
u = io.open(IDX, encoding="utf-8").read()
r1 = [ln for ln in u.split("\n") if ln.startswith("| EM-B1d | [`EM-B1d`]")]; assert len(r1) == 1, len(r1)
row1 = ("| EM-B1d | [`EM-B1d`](./packets/settlement-editor/EM-B1d.md) | **READY** at %s (VERSION 5, placed 2026-09-19 — the version-4 build stopped uncommitted, correctly, and convicted the "
        "packet; train EM-T3, its last member) — wave 1: `jailed` joins `NpcStatus`; AVAILABILITY splits from the HOUSE ROSTER — a new exported `NPC_UNAVAILABLE_STATUSES` "
        "(`dead · exiled · jailed · removed`) is what the successor and envoy readers use, while `ROSTER_ABSENT_STATUSES` stays exactly `dead · exiled · removed` because a verdict ends and "
        "a reversible status must never dissolve a house (R18), pinned by a new test; a union-totality walker on the discriminating subset `{dead, exiled, retired}` whose roster rows "
        "carry a checked `spelling`; sixteen change paths — nine handwritten and the SEVEN generated artifacts one edge-shared rebuild writes. |" % base_short)
u = u.replace(r1[0], row1, 1)
r2 = [ln for ln in u.split("\n") if ln.startswith("| EM-B1d | READY | [`EM-B1d`]")]; assert len(r2) == 1, len(r2)
row2 = "| EM-B1d | READY | [`EM-B1d`](./packets/settlement-editor/EM-B1d.md) | version 5: `jailed` joins `NpcStatus`; availability splits from the house roster; the union-totality walker; T3's last member |"
u = u.replace(r2[0], row2, 1)
io.open(IDX, "w", encoding="utf-8").write(u)
print("EM-B1d VERSION 5 placed at %s (16 required symbols; 16 change rows)" % base_short)
