# -*- coding: utf-8 -*-
"""Place a pre-proofed packet READY as a NEW entry (no packet file, manifest entry or index row exists — asserted), with the
chair's cuts applied to BOTH the §7 markdown table and the JSON change manifest, then stage for the kit's packet-merge.mjs.
Generalises place_b1k2.py / place_p2_v4.py. Run from the worktree ON the branch, tree clean, HEAD == <base>.

argv: <ID> <kit packets-waiting dir> <stage dir> <base full sha> <preamble sha> <window-from sha> [--moved-ok p1,p2,…]
      [--extra-row ACTION|path|symbol-or-region|coding-instruction]* [--index-after SIBLING] [--row1 "<text after '— '>"] [--row2 "<text>"]
      [--history-cut "<exact paragraph to replace>|<replacement>"]*

Cuts applied automatically: the anti-vacuity walker joins `checks` when any CREATE is a `*.contract.test.js` or lives under
tests/lint; and when any CREATE is a `.js` under src/domain/** or src/generators/**, a MODIFY row for
docs/content/wiring-census.json is added (the producer-file count moves — ODQ §934.47 addendum 78) unless the packet already
carries that path. The Status line keeps its value ALONE (the parser anchors it at end-of-line); the stamp goes on the
continuation lines. The commit is the caller's, GATED on `validate:packets` printing `valid:` in the same command."""
import io, json, os, re, subprocess, sys

args = sys.argv[1:]
pid, src_dir, stage_dir, base_full, preamble_sha, window_from = args[:6]
rest = args[6:]
moved_ok, extra_rows, history_cuts, extra_checks = set(), [], [], []
index_after, row1_text, row2_text = None, None, None
i = 0
while i < len(rest):
    a = rest[i]
    if a == "--moved-ok": moved_ok |= set(rest[i + 1].split(",")); i += 2
    elif a == "--extra-row": extra_rows.append(rest[i + 1].split("|", 3)); i += 2
    elif a == "--index-after": index_after = rest[i + 1]; i += 2
    elif a == "--row1": row1_text = rest[i + 1]; i += 2
    elif a == "--row2": row2_text = rest[i + 1]; i += 2
    elif a == "--history-cut": history_cuts.append(rest[i + 1].split("|", 1)); i += 2
    elif a == "--extra-check": extra_checks.append(rest[i + 1].split(" ")); i += 2
    else: raise SystemExit("unknown arg " + a)
base_short = base_full[:9]
IDX = "docs/implementation/INDEX.md"; MAN = "docs/implementation/PACKET_MANIFEST.json"
PKT_DIR = "docs/implementation/packets/settlement-editor"; CENSUS = "docs/content/wiring-census.json"
AV = ["npx", "vitest", "run", "--pool=threads", "--maxWorkers=2", "tests/lint/contractTestAntiVacuity.walker.test.js"]

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True)

assert run("git", "status", "--short").stdout.strip() == "", "the tree is not clean"
assert run("git", "rev-parse", "HEAD").stdout.strip() == base_full, "HEAD is not the base you named"
assert run("git", "merge-base", "--is-ancestor", window_from, "HEAD").returncode == 0, "window-from is not an ancestor"
e = json.load(io.open(os.path.join(src_dir, pid + ".manifest.json"), encoding="utf-8"))
assert e["id"] == pid and e["status"] in ("DRAFT", "READY"), e["status"]
man = json.load(io.open(MAN, encoding="utf-8"))
assert not any(p["id"] == pid for p in man["packets"]), pid + " already has a manifest entry"
assert not os.path.exists(os.path.join(PKT_DIR, pid + ".md")), pid + ".md already exists in the tree"

# ---- the chair's automatic cuts on the JSON rows
cm = e["changeManifest"]
creates = [r["path"] for r in cm if r["action"] == "CREATE"]
if any(re.match(r"^src/(domain|generators)/.*\.js$", p) for p in creates) and not any(r["path"] == CENSUS for r in cm):
    cm.append({"action": "MODIFY", "path": CENSUS, "_note": "the chair's placement cut (ODQ §934.47 addendum 78): scripts/wiring-census.mjs stamps a producer-file COUNT over src/generators + src/domain, so this packet's new leaf moves producerIndexFiles; the build lane runs `node scripts/wiring-census.mjs` in its last gated batch and commits the regenerated file; a regenerated artifact is MODIFY"})
    extra_rows.append(["MODIFY", CENSUS, "`producerIndexFiles` (a file count)", "the chair's placement cut (addendum 78): `node scripts/wiring-census.mjs` in the last gated batch, the regenerated file committed with the packet — the count moves by the packet's new `src/domain`/`src/generators` leaves; never edited by hand"])
    print("cut: the wiring-census MODIFY row added")
for act, path, sym, instr in extra_rows:
    if not any(r["path"] == path and r["action"] == act for r in cm):
        cm.append({"action": act, "path": path, "_note": "the chair's placement cut: " + instr[:160]})
if any(p.endswith(".contract.test.js") or p.startswith("tests/lint/") for p in creates) and AV not in e["checks"]:
    idx = next((k for k, c in enumerate(e["checks"]) if c[:3] == ["node", "scripts/implementation-packets.mjs", "validate"]), len(e["checks"]))
    e["checks"].insert(idx, AV); print("cut: the anti-vacuity walker added to checks")
for chk in extra_checks:  # the chair's sealed-check cuts (e.g. the third amendment's tests/lint step) — before the validate step, never last
    if chk not in e["checks"]:
        idx = next((k for k, c in enumerate(e["checks"]) if c[:3] == ["node", "scripts/implementation-packets.mjs", "validate"]), len(e["checks"]))
        e["checks"].insert(idx, chk); print("cut: extra check added before the validate step:", " ".join(chk)[:120])

# ---- the window
paths = sorted({r["path"] for r in cm} | {r["path"] for r in e["requiredSymbols"]})
others = [p for p in paths if p not in moved_ok and p != CENSUS]
out = run("git", "diff", "--stat", window_from, "HEAD", "--", *others).stdout
assert out.strip() == "", "THE WINDOW IS NOT EMPTY over the packet's unexpected paths:\n" + out
moved = run("git", "diff", "--stat", window_from, "HEAD", "--", *[p for p in paths if p in moved_ok]).stdout.strip() if moved_ok else ""  # an EMPTY pathspec list is the WHOLE diff (bit at EM-B1f's placement)
for r in cm:
    if r["action"] == "CREATE":
        assert not os.path.exists(r["path"]), "CREATE target present: " + r["path"]
        assert run("git", "ls-files", "--error-unmatch", r["path"]).returncode != 0
missing = [(r["path"], r["symbol"][:60]) for r in e["requiredSymbols"] if not os.path.exists(r["path"]) or r["symbol"] not in io.open(r["path"], encoding="utf-8").read()]
assert not missing, "required symbols missing at the tip: %r" % missing
cp = {r["path"] for r in cm}
for p in man["packets"]:
    if p["status"] in ("LANDED", "SUPERSEDED", "WITHDRAWN", "CLOSED"): continue
    held = {r["path"] for r in p.get("changeManifest", [])}
    assert not (held & cp), "a non-terminal packet reserves a change path: %s %s" % (p["id"], held & cp)
print("window %s..HEAD EMPTY over %d unexpected paths; moved-as-expected: %s; %d symbols resolve; CREATE targets absent; no non-terminal reserver" % (window_from[:9], len(others), moved.replace("\n", " | ") or "none", len(e["requiredSymbols"])))

# ---- the packet markdown
s = io.open(os.path.join(src_dir, pid + ".md"), encoding="utf-8").read()
m = re.search(r"^- \*\*Status:\*\* `?(DRAFT|READY)`?[^\n]*$", s, flags=re.M); assert m, "status row"
s = s.replace(m.group(0), "- **Status:** `READY`", 1)
m = re.search(r"^- \*\*Verified base:\*\* .*$", s, flags=re.M); assert m
s = s.replace(m.group(0), "- **Verified base:** `fixes-2026-09-18-consist` at `%s`" % base_full, 1)
m = re.search(r"^- \*\*Last revalidated:\*\* .*$", s, flags=re.M); assert m
cuts_txt = "; ".join("%s row for `%s` (%s)" % (a, p, ins[:90]) for a, p, _, ins in extra_rows) or "none beyond the stamp"
s = s.replace(m.group(0), (
    "- **Last revalidated:** 2026-09-20 at `%s` — stamped by the chair (session a9df403c) at placement, the window re-run in the same command as the stamp: over every "
    "path of this packet except the expected movers (%s) `git diff --stat %s..HEAD` printed NOTHING; every `requiredSymbols` row resolves; the CREATE targets are absent and "
    "untracked; no non-terminal packet reserves a change path. THE CHAIR'S CUTS AT PLACEMENT: %s%s. The Status value stands alone on its line (the parser's law). Its gated batches PAUSE-AND-RESUME."
) % (base_full, ", ".join(sorted(moved_ok)) or "none", window_from[:9], cuts_txt, "; the anti-vacuity walker in `checks`" if AV in e["checks"] else ""), 1)
if "TO BE STAMPED BY THE CHAIR" in s: s = s.replace("TO BE STAMPED BY THE CHAIR", "%s — stamped by the chair at placement" % preamble_sha, 1)
s = s.replace("`__BASE__`", "`%s`" % base_short).replace("__BASE__", base_short)
for old, new in history_cuts:
    assert s.count(old) == 1, "history cut anchor not unique: " + old[:60]
    s = s.replace(old, new, 1)
assert "__BASE__" not in s and "TO BE STAMPED" not in s
# the §7 table: append the extra rows with the table's own column count
if extra_rows:
    lines = s.split("\n")
    h = next((k for k, ln in enumerate(lines) if re.match(r"^\|\s*Action\s*\|", ln)), None); assert h is not None, "§7 table header not found"
    ncols = len([c for c in lines[h].strip().strip("|").split("|")])
    end = h + 2
    while end < len(lines) and lines[end].startswith("|"): end += 1
    for a, p, sym, ins in extra_rows:
        cells = ["`%s`" % a, "`%s`" % p, sym, "`n/a`", ins][:ncols]
        while len(cells) < ncols: cells.append("")
        lines.insert(end, "| " + " | ".join(cells) + " |"); end += 1
    s = "\n".join(lines); print("§7 table gained %d row(s)" % len(extra_rows))
os.makedirs(stage_dir, exist_ok=True)
io.open(os.path.join(stage_dir, pid + ".md"), "w", encoding="utf-8").write(s)
assert all(isinstance(c, dict) and "id" in c and "case" in c for c in e["acceptanceCases"])
e["status"] = "READY"; e["verifiedBase"] = base_full
for k in [k for k in list(e) if k.startswith("_")]: del e[k]
rs = e.get("retiredSymbols")
if rs is None or rs == {} or rs == "" or (isinstance(rs, str) and rs.strip().lower() in ("none", "n/a", "-")): e["retiredSymbols"] = []  # the validator wants an array when present (EM-R0a's placement, 09-20)
assert isinstance(e["retiredSymbols"], list), "retiredSymbols is neither a list nor an empty marker: %r" % (rs,)
json.dump(e, io.open(os.path.join(stage_dir, pid + ".manifest.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

# ---- the index rows
u = io.open(IDX, encoding="utf-8").read()
sib = index_after or "EM-P3"
r1 = [ln for ln in u.split("\n") if ln.startswith("| %s | [`%s`]" % (sib, sib))]; assert len(r1) == 1, "index row 1 of the sibling %s: %d" % (sib, len(r1))
row1 = "| %s | [`%s`](./packets/settlement-editor/%s.md) | **READY** at %s (placed 2026-09-20) — %s |" % (pid, pid, pid, base_short, row1_text or ("pre-proofed at %s; see the packet" % window_from[:9]))
for tok in ("LANDED", "DRAFT", "SUPERSEDED", "WITHDRAWN", "CLOSED", "BLOCKED"):
    assert not re.search(r"(?:^|[^A-Z])" + tok + r"(?:$|[^A-Z])", row1.split("|")[3].upper()), "row 1 carries a second status word: " + tok
u = u.replace(r1[0] + "\n", r1[0] + "\n" + row1 + "\n", 1)
r2 = [ln for ln in u.split("\n") if ln.startswith("| %s | LANDED | [`%s`]" % (sib, sib)) or ln.startswith("| %s | READY | [`%s`]" % (sib, sib))]; assert len(r2) == 1, "index row 2 of the sibling"
row2 = "| %s | READY | [`%s`](./packets/settlement-editor/%s.md) | %s |" % (pid, pid, pid, row2_text or "see the packet")
u = u.replace(r2[0] + "\n", r2[0] + "\n" + row2 + "\n", 1)
io.open(IDX, "w", encoding="utf-8").write(u)
print(pid, "staged READY at", base_short, "| index rows written after", sib, "| next: node <kit>/tools/packet-merge.mjs <root> settlement-editor <stage>/%s.manifest.json ; validate must print valid:" % pid)
