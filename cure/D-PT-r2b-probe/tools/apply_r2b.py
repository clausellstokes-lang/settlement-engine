#!/usr/bin/env python3
"""D-PT-r2b edit record: every replacement is anchored and asserted unique; all-or-nothing write."""
import sys, hashlib
import os
VOL = os.environ.get('PT_VOL', '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PT.md')
text = open(VOL, encoding='utf-8').read()
orig = text
log = []

def rep(old, new, tag):
    global text
    n = text.count(old)
    assert n == 1, f'{tag}: expected 1 occurrence, found {n}: {old[:90]!r}'
    text = text.replace(old, new)
    log.append(tag)

def rep_region(start, end, new, tag):
    global text
    n = text.count(start)
    assert n == 1, f'{tag}: start marker count {n}: {start[:90]!r}'
    s = text.index(start)
    e = text.find(end, s)
    assert e >= 0, f'{tag}: end marker not found after start: {end[:90]!r}'
    e += len(end)
    text = text[:s] + new + text[e:]
    log.append(tag)

def ins_after(anchor, add, tag):
    global text
    n = text.count(anchor)
    assert n == 1, f'{tag}: anchor count {n}: {anchor[:90]!r}'
    text = text.replace(anchor, anchor + add)
    log.append(tag)

def glob(old, new, expect, tag):
    global text
    n = text.count(old)
    assert n == expect, f'{tag}: expected {expect}, found {n}: {old!r}'
    text = text.replace(old, new)
    log.append(f'{tag} x{n}')

exec(open(sys.argv[1], encoding='utf-8').read())

open(VOL, 'w', encoding='utf-8').write(text)
print('applied', len(log), 'edits;', len(orig), '->', len(text), 'chars;', 'sha1', hashlib.sha1(text.encode()).hexdigest()[:12])
for t in log: print(' -', t)
