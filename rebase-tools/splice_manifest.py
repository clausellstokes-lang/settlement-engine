#!/usr/bin/env python3
"""Splice manifest entries into a section BY TEXT.

Reads the target file as lines, finds the section's closing brace, appends a
comma to the last entry's closing brace and inserts the new entries rendered in
the base file's own formatting (2-space JSON indent, entry keys at 4 spaces).
Never re-serializes the file: every pre-existing byte is carried through.
"""
import json, sys, subprocess

target, section, src_sha, src_repo = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
keys = sys.argv[5:]

src = json.loads(subprocess.run(
    ['git', '-C', src_repo, 'show', f'{src_sha}:scripts/mutation-coverage-manifest.json'],
    capture_output=True, text=True).stdout)

text = open(target, encoding='utf-8').read()
lines = text.split('\n')

# locate the section header line `  "<section>": {` and its matching close `  }` / `  },`
start = None
for i, ln in enumerate(lines):
    if ln == f'  "{section}": {{':
        start = i
        break
if start is None:
    sys.exit(f'section {section} not found')
close = None
for i in range(start + 1, len(lines)):
    if lines[i] in ('  }', '  },'):
        close = i
        break
if close is None:
    sys.exit('section close not found')

# the last entry inside the section ends on the line before `close`
last = close - 1
if lines[last] != '    }':
    sys.exit(f'unexpected last-entry line: {lines[last]!r}')
lines[last] = '    },'

block = []
for n, key in enumerate(keys):
    val = src[section][key]
    body = json.dumps(val, indent=2, ensure_ascii=False).split('\n')
    body = [body[0]] + ['    ' + b for b in body[1:]]
    body[0] = '    ' + json.dumps(key, ensure_ascii=False) + ': ' + body[0]
    if n < len(keys) - 1:
        body[-1] += ','
    block.extend(body)

lines[close:close] = block
open(target, 'w', encoding='utf-8').write('\n'.join(lines))
print(f'spliced {len(keys)} entries into {section} ({len(block)} lines)')
