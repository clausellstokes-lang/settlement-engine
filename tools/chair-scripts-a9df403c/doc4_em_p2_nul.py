# -*- coding: utf-8 -*-
"""DOC-4 (ODQ §934.47 addenda 104, 106): docs/implementation/packets/settlement-editor/EM-P2.md carries ONE raw NUL byte at line 333,
inside a fenced listing that quotes a hash-census probe line (`seed === undefined ? '<NUL>undefined' : String(seed)`). A landed record is
annotated, never rewritten: the byte is replaced by the two-character JavaScript escape (backslash, zero) so the listing reads as the
source it quotes, and a one-line annotation follows the fence. No other byte moves. Run in the worktree ON the branch; argv: none.
NOTE: the escape is built from byte values on purpose — a literal escape in a tool parameter becomes the byte itself."""
import io
P = "docs/implementation/packets/settlement-editor/EM-P2.md"
NUL = bytes([0]); ESC = bytes([92, 48])  # backslash, '0'
b = io.open(P, "rb").read()
assert b.count(NUL) == 1, ("expected exactly one NUL byte, found", b.count(NUL))
lines = b.split(b"\n")
idx = next(i for i, l in enumerate(lines) if NUL in l)
assert idx + 1 == 333, ("the NUL is not on line 333 but", idx + 1)
lines[idx] = lines[idx].replace(NUL, ESC)
# find the closing fence after the listing and annotate after it
j = idx + 1
while j < len(lines) and not lines[j].startswith(b"```"):
    j += 1
assert j < len(lines), "no closing fence after line 333"
note = ("> *(ANNOTATED AT DOC-4, the chair, 2026-09-20 — ODQ §934.47 addendum 106: the listing above carried the census probe's NUL "
        "separator as the RAW BYTE (the only one under docs/, which made git classify this landed record as binary); it is now spelled "
        "as the two-character JavaScript escape the source uses. Nothing else in this landed packet changed. The class: a control-character "
        "escape passed through a JSON-encoded tool parameter arrives as the byte — TOOL-25's walker guards docs/ for it.)*").encode("utf-8")
lines.insert(j + 1, b""); lines.insert(j + 2, note)
out = b"\n".join(lines)
assert NUL not in out and out.count(ESC + b"undefined") == 1
io.open(P, "wb").write(out)
print("EM-P2.md: NUL replaced on line 333; annotation after the fence at line", j + 3, "; bytes", len(b), "->", len(out))
