#!/usr/bin/env python3
"""Resolve a dossierMounts.js merge conflict from the registry's OWN LAW, not from merge
mechanics. Exit code is the gate: the caller MUST chain add+commit off it.

Two sections, two different merge semantics:
  DOSSIER_MOUNTS   is ADDITIVE    — each lane adds rows; keep both sides.
  UNMOUNTED_BLOCKS is SUBTRACTIVE — each lane deletes its own; keeping both sides
                                    RESURRECTS a sibling's deletions.
The law that settles it: the two halves are COMPLEMENTS. So after keeping both sides,
drop from UNMOUNTED_BLOCKS every block that is now mounted. Derived, not hand-guessed.

Verified afterwards, and only NEW breakage convicts (pre-existing measured at BASE):
  * no surviving conflict markers
  * no NEW duplicate SENTENCE-rung mount (the file's stated law; two `glance` tiles for
    one block are LEGAL and the base does exactly that)
  * no NEW duplicate mount POSITION
  * no block in BOTH lists
"""
import io, re, subprocess, sys

path, base, tree = sys.argv[1], sys.argv[2], sys.argv[3]
SEC = r'export const %s = Object\.freeze\(\[(.*?)^\]\);'

def rows_of(txt):
    m = re.search(SEC % 'DOSSIER_MOUNTS', txt, re.S | re.M)
    return re.findall(r"mount:\s*'([^']+)'[^}]*?blockId:\s*'([A-Z0-9-]+)',\s*rung:\s*'(\w+)'", m.group(1)) if m else []

def dark_of(txt):
    m = re.search(SEC % 'UNMOUNTED_BLOCKS', txt, re.S | re.M)
    return re.findall(r"'(DS-[A-Z]+-\d+)'", m.group(1)) if m else []

s = io.open(path, encoding='utf-8').read()
if '<<<<<<< ' not in s:
    print('  no conflict markers'); sys.exit(0)
hunks = len(re.findall(r'^<<<<<<< ', s, re.M))
out = re.sub(r'^<<<<<<< [^\n]*\n(.*?)^=======\n(.*?)^>>>>>>> [^\n]*\n',
             lambda m: m.group(1) + m.group(2), s, flags=re.S | re.M)
if re.search(r'^(<<<<<<< |=======$|>>>>>>> )', out, re.M):
    print('  ⛔ REFUSED: conflict markers survived'); sys.exit(1)

mounted = {b for _, b, _ in rows_of(out)}
m = re.search(SEC % 'UNMOUNTED_BLOCKS', out, re.S | re.M)
pruned = []
if m:
    body = m.group(1)
    # ⚠ UNMOUNTED_BLOCKS packs SEVERAL ids per line ("'DS-ECO-11', 'DS-ECO-12', 'DS-SUP-3',").
    # A line-based prune both MISSES an id that is not first on its line and DELETES the
    # innocent siblings sharing it. So prune TOKENS, never lines.
    for bid in sorted(set(re.findall(r"'(DS-[A-Z]+-\d+)'", body)) & mounted):
        body, n = re.subn(r"'%s',\s*" % re.escape(bid), '', body)
        if n:
            pruned.append(bid)
    # ⚠ keep-both also DUPLICATES dark entries both sides retained. The walker pins the
    # dark list as ordered AND duplicate-free, so dedupe preserving FIRST occurrence,
    # which is the declared canonical order.
    seen = set()
    def _dedupe(mo):
        bid = mo.group(1)
        if bid in seen:
            return ''
        seen.add(bid)
        return mo.group(0)
    body = re.sub(r"'(DS-[A-Z]+-\d+)',\s*", _dedupe, body)
    body = re.sub(r'[ \t]+\n', '\n', body)
    body = re.sub(r'\n{3,}', '\n\n', body)
    out = out[:m.start(1)] + body + out[m.end(1):]
if pruned:
    print('  pruned from UNMOUNTED (mounted by a sibling lane): %s' % pruned)

b_txt = subprocess.run(['git', 'show', '%s:%s' % (base, path)], cwd=tree, capture_output=True, text=True).stdout
b_rows, n_rows = rows_of(b_txt), rows_of(out)
b_dark, n_dark = dark_of(b_txt), dark_of(out)

def sentence_dupes(rows):
    ids = [b for _, b, r in rows if r == 'sentence']
    return {i for i in ids if ids.count(i) > 1}
def pos_dupes(rows):
    ps = [p for p, _, _ in rows]
    return {p for p in ps if ps.count(p) > 1}

print('  hunks resolved: %d   mounts %d -> %d   dark %d -> %d'
      % (hunks, len(b_rows), len(n_rows), len(b_dark), len(n_dark)))
fail = False
for label, bad in (
    ('NEW duplicate SENTENCE-rung mount', sentence_dupes(n_rows) - sentence_dupes(b_rows)),
    ('NEW duplicate mount POSITION',      pos_dupes(n_rows) - pos_dupes(b_rows)),
    ('block in BOTH lists',               (set(b for _, b, _ in n_rows) & set(n_dark))
                                          - (set(b for _, b, _ in b_rows) & set(b_dark))),
):
    if bad:
        print('  ⛔ %s: %s' % (label, sorted(bad))); fail = True
if fail:
    print('  REFUSED — nothing written'); sys.exit(1)
io.open(path, 'w', encoding='utf-8').write(out)
print('  ✅ law holds; written')
