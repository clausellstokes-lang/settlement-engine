# -*- coding: utf-8 -*-
"""Place EM-P2 (version 4, pre-proofed at ad7ddf2c9) READY into a staging dir for packet-merge.mjs, with the chair's cuts, and write
both index rows beside EM-P3's. EM-P2 is a NEW entry (no packet file, manifest entry or index row exists — asserted). Run from the
worktree ON the branch, tree clean, AFTER EM-B1k2's flip (the shared mutation register's non-terminal holders must be none).
argv: <kit packets-waiting dir> <stage dir> <base full sha> <preamble sha> <window-from sha = ad7ddf2c9...>"""
import io, json, os, re, subprocess, sys

src_dir, stage_dir, base_full, preamble_sha, window_from = sys.argv[1:6]
base_short = base_full[:9]
IDX = "docs/implementation/INDEX.md"
REG = "scripts/mutation-coverage-manifest.json"
PKT_DIR = "docs/implementation/packets/settlement-editor"

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True)

assert run("git", "status", "--short").stdout.strip() == "", "the tree is not clean"
assert run("git", "rev-parse", "HEAD").stdout.strip() == base_full, "HEAD is not the base you named"
e = json.load(io.open(os.path.join(src_dir, "EM-P2.manifest.json"), encoding="utf-8"))
assert e["id"] == "EM-P2" and e["status"] in ("DRAFT", "READY"), e["status"]
assert run("git", "merge-base", "--is-ancestor", window_from, "HEAD").returncode == 0
paths = sorted({r["path"] for r in e["changeManifest"]} | {r["path"] for r in e["requiredSymbols"]})
others = [p for p in paths if p != REG]
out = run("git", "diff", "--stat", window_from, "HEAD", "--", *others).stdout
assert out.strip() == "", "THE WINDOW IS NOT EMPTY over the packet's non-register paths:\n" + out
reg_moved = run("git", "diff", "--numstat", window_from, "HEAD", "--", REG).stdout.strip().replace("\t", " ")
reg_rows_added = [ln[1:].strip() for ln in run("git", "diff", "-U0", window_from, "HEAD", "--", REG).stdout.split("\n")
                  if ln.startswith("+") and not ln.startswith("+++") and re.match(r'^\+\s*"(tests|scripts|src)/', ln)]
for r in e["changeManifest"]:
    if r["action"] == "CREATE":
        assert not os.path.exists(r["path"]), "CREATE target present: " + r["path"]
        assert run("git", "ls-files", "--error-unmatch", r["path"]).returncode != 0
assert not os.path.exists("src/domain/generation"), "src/domain/generation exists at the base (the packet's §5 VF-14 says it must not)"
missing = [(r["path"], r["symbol"]) for r in e["requiredSymbols"] if r["symbol"] not in io.open(r["path"], encoding="utf-8").read()]
assert not missing, "required symbols missing at the tip: %r" % missing
man = json.load(io.open("docs/implementation/PACKET_MANIFEST.json", encoding="utf-8"))
cp = {r["path"] for r in e["changeManifest"]}
holders = []
for p in man["packets"]:
    if p["status"] in ("LANDED", "SUPERSEDED", "WITHDRAWN", "CLOSED"): continue
    held = {r["path"] for r in p.get("changeManifest", [])}
    if held & cp: holders.append((p["id"], p["status"], sorted(held & cp)))
assert not holders, "a non-terminal packet reserves a change path: %r" % holders
assert not any(p["id"] == "EM-P2" for p in man["packets"]), "EM-P2 already has a manifest entry"
assert not os.path.exists(os.path.join(PKT_DIR, "EM-P2.md")), "EM-P2.md already exists in the tree"
print("window %s..HEAD EMPTY over %d non-register paths; the register moved (%s) by rows inserted elsewhere: %s; %d required symbols resolve; "
      "4 CREATE targets absent; src/domain/generation absent; no non-terminal reserver; no prior EM-P2 entry"
      % (window_from[:9], len(others), reg_moved or "no", ", ".join(reg_rows_added) or "none", len(e["requiredSymbols"])))

s = io.open(os.path.join(src_dir, "EM-P2.md"), encoding="utf-8").read()
m = re.search(r"^- \*\*Status:\*\* `?(DRAFT|READY)`?.*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Status:** `READY`", 1)
m = re.search(r"^- \*\*Verified base:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Verified base:** `fixes-2026-09-18-consist` at `%s`" % base_full, 1)
m = re.search(r"^- \*\*Last revalidated:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), (
    "- **Last revalidated:** 2026-09-20 at `%s` — stamped by the chair (session a9df403c) at placement, the window re-run in the same command as the stamp: "
    "since the pre-proof's tip `%s` the branch gained EM-B1d v5, EM-B3c (migration 203), EM-B1k, EM-B1k2, CURE-A…H and three lighting refreezes; over every "
    "path of this packet except the shared `scripts/mutation-coverage-manifest.json` `git diff --stat` printed NOTHING; the register moved only by rows other "
    "packets inserted elsewhere in the file (%s); all %d `requiredSymbols` rows resolve verbatim; the four CREATE targets are absent and untracked; "
    "`src/domain/generation/` does not exist (§5 VF-14 holds); no non-terminal packet reserves a change path (EM-B1d, EM-B3c and EM-B1k2 are LANDED). "
    "⛔ THE CHAIR'S CUTS AT PLACEMENT: (1) the header's 'WHAT STILL MOVES' paragraph is history now and is replaced by the note below it; (2) the build lane "
    "re-measures the lighting tuple against the register at its base and never refreezes; (3) the build lane runs `tests/lint/contractTestAntiVacuity.walker.test.js` "
    "in its instruments — the new `*.contract.test.js` file opts into that walker's five rules (EM-B1k's lesson, CURE-H) — and every 'every …' population in the new "
    "suites is read from the producer, never a literal; a red there is a STOP. Its gated batches PAUSE-AND-RESUME."
) % (base_full, window_from[:9], ", ".join(reg_rows_added) or "none", len(e["requiredSymbols"])), 1)
old = "TO BE STAMPED BY THE CHAIR"
assert s.count(old) >= 1
s = s.replace(old, "%s — stamped by the chair at placement" % preamble_sha, 1)
s = s.replace("`__BASE__`", "`%s`" % base_short).replace("__BASE__", base_short)
# the chair's cut (1): the stale 'what still moves' paragraph → a history note
m = re.search(r"^⛔ \*\*WHAT STILL MOVES UNDER THIS PACKET:.*$", s, flags=re.M); assert m, "the 'WHAT STILL MOVES' paragraph was not found"
s = s.replace(m.group(0), ("> HISTORY (the chair, at placement 2026-09-20): the paragraph that stood here said EM-B1d version 5 was building in the slot and held "
    "the shared mutation register. EM-B1d LANDED 2026-09-19; EM-B3c and EM-B1k2 have since landed their own register rows; at this placement no non-terminal "
    "packet reserves any path of this packet (asserted by the placement script)."), 1)
assert "__BASE__" not in s and "TO BE STAMPED" not in s
os.makedirs(stage_dir, exist_ok=True)
io.open(os.path.join(stage_dir, "EM-P2.md"), "w", encoding="utf-8").write(s)

cases = e["acceptanceCases"]
assert all(isinstance(c, dict) and "id" in c and "case" in c for c in cases) and len(cases) == 8, len(cases)
e["status"] = "READY"; e["verifiedBase"] = base_full
av = ["npx", "vitest", "run", "--pool=threads", "--maxWorkers=2", "tests/lint/contractTestAntiVacuity.walker.test.js"]
if not any(c == av for c in e["checks"]):
    idx = next((i for i, c in enumerate(e["checks"]) if c[:3] == ["node", "scripts/implementation-packets.mjs", "validate"]), len(e["checks"]))
    e["checks"].insert(idx, av)
for k in [k for k in list(e) if k.startswith("_")]:
    del e[k]
e.setdefault("retiredSymbols", [])
json.dump(e, io.open(os.path.join(stage_dir, "EM-P2.manifest.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

u = io.open(IDX, encoding="utf-8").read()
r1 = [ln for ln in u.split("\n") if ln.startswith("| EM-P3 | [`EM-P3`]")]; assert len(r1) == 1, len(r1)
row1 = ("| EM-P2 | [`EM-P2`](./packets/settlement-editor/EM-P2.md) | **READY** at %s (placed 2026-09-20; version 4, pre-proofed at ad7ddf2c9; the composition "
        "train's slot car after EM-B1k2) — GENERATION'S HELD AND CHOSEN FACTS, REGISTERED AND MEASURED BY EXECUTION: a `generationForkRegistry` of 75 rows "
        "(re-run at the pre-proof's tip, zero moved; the literal byte-identical to the compile's), its contract walker, the census suite and its helper; the "
        "consumers are EM-A1 (Tier 2 on `(cardShape, outputKey)`) and the EM-R re-entry family (Tier 1 per writer); depends on EM-P0 (LANDED); four CREATE "
        "rows, one REGISTER row; eight acceptance cases. |" % base_short)
u = u.replace(r1[0] + "\n", r1[0] + "\n" + row1 + "\n", 1)
r2 = [ln for ln in u.split("\n") if ln.startswith("| EM-P3 | LANDED | [`EM-P3`]")]; assert len(r2) == 1, len(r2)
row2 = ("| EM-P2 | READY | [`EM-P2`](./packets/settlement-editor/EM-P2.md) | wave 0: the generation fork registry — the held and chosen facts, measured by "
        "execution; EM-A1 and the EM-R family read it |")
u = u.replace(r2[0] + "\n", r2[0] + "\n" + row2 + "\n", 1)
io.open(IDX, "w", encoding="utf-8").write(u)
print("EM-P2 v4 staged READY at %s (the anti-vacuity walker added to checks; the stale header paragraph replaced); index rows written beside EM-P3's" % base_short)
