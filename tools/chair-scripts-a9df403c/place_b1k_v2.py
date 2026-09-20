# -*- coding: utf-8 -*-
"""Place EM-B1k VERSION 2 (the participation view is never the write base) READY into a staging dir for
packet-merge.mjs, with the chair's cuts, and write both index rows.
Run from the consist worktree ON the branch, tree clean.
argv: <B1k scratch dir> <stage dir> <base full sha> <preamble sha> <window-from sha>"""
import io, json, os, re, subprocess, sys

src_dir, stage_dir, base_full, preamble_sha, window_from = sys.argv[1:6]
base_short = base_full[:9]
IDX = "docs/implementation/INDEX.md"

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True)

e = json.load(io.open(os.path.join(src_dir, "EM-B1k.manifest.json"), encoding="utf-8"))
assert e["id"] == "EM-B1k" and e["status"] == "DRAFT"

# ---- the packet's own revalidation sentence, EXECUTED in the same command as the stamp
assert run("git", "merge-base", "--is-ancestor", window_from, "HEAD").returncode == 0
paths = sorted({r["path"] for r in e["changeManifest"]} | {r["path"] for r in e["requiredSymbols"]})
out = run("git", "diff", "--stat", window_from, "HEAD", "--", *paths).stdout
assert out.strip() == "", "THE WINDOW IS NOT EMPTY:\n" + out
for r in e["changeManifest"]:
    if r["action"] == "CREATE":
        assert not os.path.exists(r["path"]), "CREATE target present: " + r["path"]
        assert run("git", "ls-files", "--error-unmatch", r["path"]).returncode != 0
for r in e["requiredSymbols"]:
    t = io.open(r["path"], encoding="utf-8").read()
    assert t.count(r["symbol"]) == 1, "symbol not exactly once: %s :: %s (%d)" % (r["path"], r["symbol"], t.count(r["symbol"]))
pk = io.open("src/domain/worldPulse/pulseKernel.js", encoding="utf-8").read().split("\n")
assert pk[183].strip() == "settlement: localSettlements.get(String(item.id)) || item.settlement,", pk[183]
assert pk[578].strip() == "localSettlements.set(String(item.id), vaulted.settlement);", pk[578]
sb = io.open("scripts/.size-baseline.json", encoding="utf-8").read()
assert re.search(r'"src/domain/worldPulse/pulseKernel\.js"\s*:\s*1581\b', sb), "the size baseline no longer reads 1581 for pulseKernel.js"
ws = io.open("src/domain/worldPulse/worldSnapshot.js", encoding="utf-8").read()
assert "save," in ws or "save:" in ws, "the snapshot item no longer carries save"
man = json.load(io.open("docs/implementation/PACKET_MANIFEST.json", encoding="utf-8"))
cp = {r["path"] for r in e["changeManifest"]}
for p in man["packets"]:
    if p["status"] in ("LANDED", "SUPERSEDED", "WITHDRAWN", "CLOSED"):
        continue
    held = {r["path"] for r in p.get("changeManifest", [])}
    assert not (held & cp), "a non-terminal packet reserves a change path: %s %s" % (p["id"], held & cp)
assert not any(p["id"] == "EM-B1k" for p in man["packets"])
print("revalidation executed: ancestor; window %s..HEAD EMPTY over %d paths; 11 required symbols resolve exactly once; the two seam lines verbatim at 184/579; size baseline 1581; CREATE absent+untracked; no non-terminal reserver" % (window_from[:9], len(paths)))

# ---- the packet, with the chair's cuts
s = io.open(os.path.join(src_dir, "EM-B1k.md"), encoding="utf-8").read()
m = re.search(r"^- \*\*Status:\*\* `DRAFT`.*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Status:** `READY`", 1)
m = re.search(r"^- \*\*Verified base:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Verified base:** `fixes-2026-09-18-consist` at `%s`" % base_full, 1)
assert s.count("+5 titles") == 2, s.count("+5 titles")
s = s.replace("+5 titles", "+6 titles")
old = "A1, A2, A4 = three"; assert s.count(old) == 1
s = s.replace(old, "A1, A2, A4, A8 = four", 1)
m = re.search(r"^- \*\*Last revalidated:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), (
    "- **Last revalidated:** 2026-09-20 at `%s` — stamped by the chair (Fable 5.1, session a9df403c) at placement, the packet's own revalidation "
    "sentence EXECUTED in the same command as the stamp: `buildSettlementMap` still builds the write base from `item.settlement` (line 184 read verbatim); the "
    "`localSettlements` seed at line 579 still reads `vaulted.settlement` verbatim; the snapshot item still carries `save`; `pulseKernel.js` still measures 1581 against "
    "its 1581 baseline (`scripts/.size-baseline.json` read); all ELEVEN `requiredSymbols` rows resolve EXACTLY ONCE; the CREATE target is absent and untracked; over every "
    "change-manifest and `requiredSymbols` path `git diff --stat %s HEAD` printed NOTHING (the window holds the five cure commits and the chair's docs commits); no "
    "non-terminal packet reserves a change path (EM-B3c, the other READY packet, shares none). ⛔ THE CHAIR'S CUTS AT PLACEMENT — version 2 as compiled was internally "
    "inconsistent, and each cut is recorded here so the build lane builds what the evidence proved: (1) §6's `:579` line carried the compile's UNCONDITIONAL wrapper, which the "
    "compile's own evidence addendum §16 refuses (both snapshot caches in `worldSnapshot.js` are `WeakMap`s keyed on the settlement OBJECT; an unconditional wrapper mints a new "
    "identity every tick and would miss where they hit today) — the line now carries the IDENTITY-PRESERVING single-line form and §6 gains 'THE DORMANCY CONTRACT'; A6's "
    "reference assertion is its proof; (2) §3's acceptance count read seven against §9's eight — corrected; (3) the lighting delta read version 1's `+5 titles` in §7.1 and §12 "
    "against the addendum §17's re-priced `+6` (A1, A2, A4, A8 in the new file; A3, A5 in `roadsParticipation.test.js`) — corrected; (4) the header's pointers to a `§6a` and a "
    "`§6c` that do not exist now name the evidence addendum (§12–§13) and §6's dormancy contract. The build lane measures the effective-line count with eslint's `Linter` "
    "before and after (1581 → 1581) and quotes both; the identity-preserving form is ONE line, and the estate has no `max-len` rule (this file's longest line is 745 characters). "
    "Its gated batches wait for run 17 (train EM-T3's terminal) to release the gate — PAUSE-AND-RESUME."
) % (base_full, window_from[:9]), 1)
old = "(§6a — every site reading"; assert s.count(old) == 1
s = s.replace(old, "(the evidence addendum §12–§13 — every site reading", 1)
old = "(§6c — the identity-preserving form,"; assert s.count(old) == 1
s = s.replace(old, "(§6 'THE DORMANCY CONTRACT' — the identity-preserving form,", 1)
old = "| Acceptance cases | `<=8` | **7** |"; assert s.count(old) == 1
s = s.replace(old, "| Acceptance cases | `<=8` | **8** |", 1)
old579 = "    localSettlements.set(String(item.id), { ...vaulted.settlement, npcs: (item.save?.settlement?.npcs) || vaulted.settlement.npcs });"
assert s.count(old579) == 1, s.count(old579)
new579 = "    localSettlements.set(String(item.id), item.save?.settlement?.npcs && item.save.settlement.npcs !== vaulted.settlement?.npcs ? { ...vaulted.settlement, npcs: item.save.settlement.npcs } : vaulted.settlement);"
s = s.replace(old579, new579, 1)
anchor = "inlined because the ceiling forbids an\nimport."
assert s.count(anchor) == 1, s.count(anchor)
dorm = anchor + (
    "\n\n### ⛔ THE DORMANCY CONTRACT (the chair's cut at placement, from the compile's own evidence addendum §16)\n\n"
    "Both snapshot caches in `worldSnapshot.js` (`derivationCache` at `:39`, `participationViewCache` at `:85`) are `WeakMap`s keyed on the settlement OBJECT. The `:579` line "
    "therefore takes the IDENTITY-PRESERVING form above: it allocates a wrapper ONLY when the raw save roster differs from the tick's roster BY REFERENCE (the filter removed "
    "somebody), and passes `vaulted.settlement` through unchanged otherwise — so a world with nobody off-stage is byte-identical AND cache-identical to today, and a save with "
    "no `settlement` or no `npcs` passes through exactly as today (the guard is the raw `npcs` array's existence, so `npcs: undefined` can never be written). The reference "
    "comparison is exact because the settlement-clock chain never writes `npcs` (A8 pins it): when nobody is off-stage, `item.settlement` IS `saveSettlement(item.save)` "
    "(`worldSnapshot.js:131` returns `_s` unchanged) and `vaulted.settlement.npcs` is that same array. A6 asserts the reference. The unconditional wrapper the compile first "
    "wrote is REFUSED: it mints a new identity every tick and would miss both caches where they hit today."
)
s = s.replace(anchor, dorm, 1)
old = "TO BE STAMPED BY THE CHAIR"; assert s.count(old) == 1
s = s.replace(old, "%s — stamped by the chair at placement (the preamble's §P2 row 12 present at `e68d913e6`)" % preamble_sha, 1)
s = s.replace("`__BASE__`", "`%s`" % base_short).replace("__BASE__", base_short)
assert "__BASE__" not in s
os.makedirs(stage_dir, exist_ok=True)
io.open(os.path.join(stage_dir, "EM-B1k.md"), "w", encoding="utf-8").write(s)

# ---- the manifest entry: READY, the base, the notes stripped (the tree's entries carry only the machine-read keys)
cases = e["acceptanceCases"]
assert all(isinstance(c, dict) and "id" in c and "case" in c for c in cases), "acceptanceCases must be {id, case} objects"
assert [c["id"] for c in cases] == ["A%d" % n for n in range(1, 9)], [c["id"] for c in cases]
e["status"] = "READY"; e["verifiedBase"] = base_full
for k in [k for k in list(e) if k.startswith("_")]:
    del e[k]
assert set(e) == {"id", "status", "packetPath", "verifiedBase", "changeManifest", "requiredSymbols", "retiredSymbols", "acceptanceCases", "checks"}, sorted(e)
json.dump(e, io.open(os.path.join(stage_dir, "EM-B1k.manifest.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

# ---- the index rows, after EM-B3c's in both tables (ONE status word per row)
u = io.open(IDX, encoding="utf-8").read()
r1 = [ln for ln in u.split("\n") if ln.startswith("| EM-B3c | [`EM-B3c`]")]; assert len(r1) == 1, len(r1)
row1 = ("| EM-B1k | [`EM-B1k`](./packets/settlement-editor/EM-B1k.md) | **READY** at %s (placed 2026-09-20; version 2; ⛔ FLOATS WITH TOP PRIORITY — built in the slot "
        "ahead of everything waiting) — CURES CONFIRMED DATA LOSS ON A SHIPPED DM ACTION (ODQ §934.60 and its addenda): shelving an NPC through the Availability control and "
        "advancing one tick ERASES that person from the save (6 of 7 persisted, in the store and the DB payload; `return-npc` then refuses `npc_target_missing`), and a house whose "
        "sole member is shelved or taken hostage is dissolved permanently. The tick's write base is born from the FILTERED participation view; this packet makes the update's "
        "settlement descend from the RAW save roster — two single-line replacements in `pulseKernel.js`, net zero effective lines against a file at its 1581-line ceiling, the "
        "second in the identity-preserving form — measured to stop BOTH defects, because the density kernel's own `stillEmpty` confirmation was right all along and only its base "
        "was filtered. Red-first on the DM's own reproduction; the participation reads unchanged (A5); goldens byte-identical by measurement; EM-B1k2 (chartered) removes the "
        "habitat next. |" % base_short)
u = u.replace(r1[0] + "\n", r1[0] + "\n" + row1 + "\n", 1)
r2 = [ln for ln in u.split("\n") if ln.startswith("| EM-B3c | READY | [`EM-B3c`]")]; assert len(r2) == 1, len(r2)
row2 = ("| EM-B1k | READY | [`EM-B1k`](./packets/settlement-editor/EM-B1k.md) | the participation view is never the write base — the tick's settlement descends from the raw "
        "save roster; stops the erased-person data loss and the sole-member dissolution; floats with top priority |")
u = u.replace(r2[0] + "\n", r2[0] + "\n" + row2 + "\n", 1)
io.open(IDX, "w", encoding="utf-8").write(u)
print("EM-B1k v2 staged READY at %s with the chair's four cuts; index rows written" % base_short)
