#!/usr/bin/env python3
"""D-BD-r6's in-place editor: each edit is an exact substring that must occur EXACTLY ONCE
(or `count` times) in the volume; a miss or an ambiguity aborts the whole chunk before writing."""
import sys, json
DOC = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_BD.md'

def apply(pairs, label):
    with open(DOC, encoding='utf-8') as f:
        text = f.read()
    for i, item in enumerate(pairs):
        old, new = item[0], item[1]
        count = item[2] if len(item) > 2 else 1
        n = text.count(old)
        if n != count:
            print(f'[{label}] edit {i}: expected {count} occurrence(s), found {n}: {old[:120]!r}')
            sys.exit(1)
        text = text.replace(old, new)
    with open(DOC, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'[{label}] applied {len(pairs)} edits')
