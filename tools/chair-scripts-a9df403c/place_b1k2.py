# -*- coding: utf-8 -*-
"""Place EM-B1k2 (pre-proofed version 2) READY into a staging dir for packet-merge.mjs, with the chair's cuts, and write both
index rows. Run from the worktree ON the branch, tree clean. argv: <pre-proof scratch dir> <stage dir> <base full sha>
<preamble sha> <window-from sha>"""
import io, json, os, re, subprocess, sys

src_dir, stage_dir, base_full, preamble_sha, window_from = sys.argv[1:6]
base_short = base_full[:9]
IDX = "docs/implementation/INDEX.md"
REG = "scripts/mutation-coverage-manifest.json"

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True)

e = json.load(io.open(os.path.join(src_dir, "EM-B1k2.manifest.json"), encoding="utf-8"))
assert e["id"] == "EM-B1k2" and e["status"] in ("DRAFT", "READY"), e["status"]
assert run("git", "merge-base", "--is-ancestor", window_from, "HEAD").returncode == 0
paths = sorted({r["path"] for r in e["changeManifest"]} | {r["path"] for r in e["requiredSymbols"]})
moved_ok = {REG, "tests/domain/roadsParticipation.test.js", "src/domain/worldPulse/pulseKernel.js", "scripts/mutation-sweep.sh"}
others = [p for p in paths if p not in moved_ok]
out = run("git", "diff", "--stat", window_from, "HEAD", "--", *others).stdout
assert out.strip() == "", "THE WINDOW IS NOT EMPTY over the packet's unexpected paths:\n" + out
moved = run("git", "diff", "--stat", window_from, "HEAD", "--", *[p for p in paths if p in moved_ok]).stdout.strip()
for r in e["changeManifest"]:
    if r["action"] == "CREATE":
        assert not os.path.exists(r["path"]), "CREATE target present: " + r["path"]
        assert run("git", "ls-files", "--error-unmatch", r["path"]).returncode != 0
missing = []
for r in e["requiredSymbols"]:
    t = io.open(r["path"], encoding="utf-8").read()
    if r["symbol"] not in t: missing.append((r["path"], r["symbol"]))
assert not missing, "required symbols missing at the tip: %r" % missing
man = json.load(io.open("docs/implementation/PACKET_MANIFEST.json", encoding="utf-8"))
cp = {r["path"] for r in e["changeManifest"]}
for p in man["packets"]:
    if p["status"] in ("LANDED", "SUPERSEDED", "WITHDRAWN", "CLOSED"): continue
    held = {r["path"] for r in p.get("changeManifest", [])}
    assert not (held & cp), "a non-terminal packet reserves a change path: %s %s" % (p["id"], held & cp)
assert not any(p["id"] == "EM-B1k2" for p in man["packets"])
print("window %s..HEAD EMPTY over %d unexpected paths; moved-as-expected: %s; %d required symbols resolve; CREATE targets absent; no non-terminal reserver"
      % (window_from[:9], len(others), moved.replace("\n", " | ") or "none", len(e["requiredSymbols"])))

s = io.open(os.path.join(src_dir, "EM-B1k2.md"), encoding="utf-8").read()
m = re.search(r"^- \*\*Status:\*\* `?(DRAFT|READY)`?.*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Status:** `READY`", 1)
m = re.search(r"^- \*\*Verified base:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Verified base:** `fixes-2026-09-18-consist` at `%s`" % base_full, 1)
m = re.search(r"^- \*\*Last revalidated:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), (
    "- **Last revalidated:** 2026-09-20 at `%s` — stamped by the chair (session a9df403c) at placement, the window re-run in the same command as the stamp: since the pre-proof's "
    "tip `%s` the branch gained CURE-E, CURE-F (the `:579` comparand this packet quotes — re-read), CURE-G (a row in the shared mutation register; EM-B1k's suite renamed "
    "`participationWriteBase.contract.test.js`), the second lighting refreeze, EM-B3c's re-pin and its LANDING (a second register row; migration 203); over every path of this packet "
    "outside the expected movers (%s) `git diff --stat` printed NOTHING; every `requiredSymbols` row resolves; both CREATE targets absent and untracked; no non-terminal packet reserves a "
    "change path (EM-B3c is LANDED). ⛔ THE CHAIR'S CUTS AT PLACEMENT: (1) `checks` gains `tests/lint/contractTestAntiVacuity.walker.test.js` — the `contract` token this packet's "
    "test file carries is consumed by that walker too (run 18 red on EM-B1k's renamed suite for exactly this; ODQ §934.47 addendum 49): every 'every…' claim in the new suite derives "
    "its population from the producer, never a literal; (2) the build lane runs that walker in its instruments and treats its red as a STOP of its own. Its gated batches wait for "
    "run 19 to release the gate — PAUSE-AND-RESUME."
) % (base_full, window_from[:9], ", ".join(sorted(p for p in paths if p in moved_ok))), 1)
old = "TO BE STAMPED BY THE CHAIR"
if s.count(old) >= 1:
    s = s.replace(old, "%s — stamped by the chair at placement" % preamble_sha, 1)
s = s.replace("`__BASE__`", "`%s`" % base_short).replace("__BASE__", base_short)
assert "__BASE__" not in s and "TO BE STAMPED" not in s
os.makedirs(stage_dir, exist_ok=True)
io.open(os.path.join(stage_dir, "EM-B1k2.md"), "w", encoding="utf-8").write(s)

cases = e["acceptanceCases"]
assert all(isinstance(c, dict) and "id" in c and "case" in c for c in cases)
e["status"] = "READY"; e["verifiedBase"] = base_full
av = ["npx", "vitest", "run", "--pool=threads", "--maxWorkers=2", "tests/lint/contractTestAntiVacuity.walker.test.js"]
if not any(c == av for c in e["checks"]):
    # insert before the validate step if present, else append
    idx = next((i for i, c in enumerate(e["checks"]) if c[:3] == ["node", "scripts/implementation-packets.mjs", "validate"]), len(e["checks"]))
    e["checks"].insert(idx, av)
for k in [k for k in list(e) if k.startswith("_")]:
    del e[k]
e.setdefault("retiredSymbols", [])
json.dump(e, io.open(os.path.join(stage_dir, "EM-B1k2.manifest.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

u = io.open(IDX, encoding="utf-8").read()
r1 = [ln for ln in u.split("\n") if ln.startswith("| EM-B1k | [`EM-B1k`]")]; assert len(r1) == 1, len(r1)
row1 = ("| EM-B1k2 | [`EM-B1k2`](./packets/settlement-editor/EM-B1k2.md) | **READY** at %s (placed 2026-09-20; version 2, pre-proofed at 63e40fe57; train EM-T6's opener, "
        "behind EM-B1k) — THE HABITAT REMOVED: the faction-density kernel's irreversible read and its confirmation read the RAW roster explicitly (measured: the dissolution "
        "reaction produced 7 of 7 from the filtered `tickStart`, 0 of 7 from the raw one, the chain's output identical both ways); the two permanent roster writers carry the "
        "contract in comment, census disposition and pin (neither can read raw itself — EM-B1k made their callers raw); the participation ratchet widens to `src/domain/density` and "
        "`src/generators/density` with a reader token (`factionRosterOf`), 41 → 44 conviction rows, all dispositioned; one logic-bearing line, three comment-only rows, one CREATE "
        "suite under the `contract` token with its `mutation` row and sweep plant, one TEST row. |" % base_short)
u = u.replace(r1[0] + "\n", r1[0] + "\n" + row1 + "\n", 1)
r2 = [ln for ln in u.split("\n") if ln.startswith("| EM-B1k | LANDED | [`EM-B1k`]")]; assert len(r2) == 1, len(r2)
row2 = ("| EM-B1k2 | READY | [`EM-B1k2`](./packets/settlement-editor/EM-B1k2.md) | the irreversible consumers read the raw roster explicitly; the participation ratchet widens to "
        "the density directories with the reader token; defence in depth behind EM-B1k |")
u = u.replace(r2[0] + "\n", r2[0] + "\n" + row2 + "\n", 1)
io.open(IDX, "w", encoding="utf-8").write(u)
print("EM-B1k2 staged READY at %s (the anti-vacuity walker added to checks); index rows written" % base_short)
