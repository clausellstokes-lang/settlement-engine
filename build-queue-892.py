#!/usr/bin/env python3
"""build-queue-892.py <out.md> [--dry]

Builds the §892 version of docs/FABLE_RETROVALIDATION_QUEUE.md from the LEDGER HEAD BLOB (never the
worktree copy — three-copies hazard), in memory, with every anchor asserted exactly once:
  1. base = git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md   (md5 recorded)
  2. the §3 clause amendment (s3-amendment.json), exact-once
  3. every ruling in rulings-part*.json, via apply-rulings.py's logic (imported), anchored by line+id
  4. the §892 sitting section appended (frq-tail-892.md, with placeholders filled from tally.json)
Post-conditions: the result contains the base with EXACTLY the enumerated deletions (the two old §3
lines) and only insertions elsewhere; the tail is a suffix; every ruling appears exactly once.
"""
import glob, hashlib, io, json, os, subprocess, sys

SC = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad'
REPO = '/Users/cstokes/Desktop/settlement-engine'
out_path = sys.argv[1]
dry = '--dry' in sys.argv

base = subprocess.run(['git', '-C', REPO, 'show', 'HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md'], capture_output=True, text=True, check=True).stdout
base_md5 = hashlib.md5(base.encode('utf-8')).hexdigest()
assert base.endswith('\n')
print('base HEAD blob md5', base_md5, 'lines', base.count('\n'), 'bytes', len(base.encode('utf-8')))

# --- 2. the §3 amendment, exact-once, BEFORE line-anchored rulings so their line numbers are re-resolved below ---
s3 = json.load(io.open(f'{SC}/s3-amendment.json', encoding='utf-8'))
assert base.count(s3['old']) == 1, base.count(s3['old'])
assert s3['new'] not in base
old_lines = s3['old'].count('\n') + 1
new_lines = s3['new'].count('\n') + 1
text = base.replace(s3['old'], s3['new'])
shift = new_lines - old_lines  # every line number after the §3 clause moves by this much
print('§3 clause amended: %d -> %d lines (shift %+d)' % (old_lines, new_lines, shift))

# --- 3. rulings: merge parts, re-base their HEAD line numbers by the §3 shift, apply with the applier's rules ---
rulings = []
for p in sorted(glob.glob(f'{SC}/rulings-part*.json')):
    part = json.load(io.open(p, encoding='utf-8'))
    for r in part:
        assert 'line' in r and 'id' in r and r['ruling'].strip()
        r = dict(r)
        r['line'] = r['line'] + shift if r['line'] > 46 else r['line']
        rulings.append(r)
# the queue carries DUPLICATE identifiers (§883.5/§883.6/§883.7 exist as lane rows AND chair rows — S19 A3), so
# uniqueness is on the anchor LINE, not the id
lns = [r['line'] for r in rulings]
assert len(lns) == len(set(lns)), 'two rulings anchored to one line'
print('rulings loaded', len(rulings))

lines = text.split('\n')
positions = []
for r in rulings:
    i = r['line'] - 1
    l = lines[i]
    assert l.startswith('## ') or l.startswith('**§'), f"line {r['line']} is not a row heading: {l[:80]!r}"
    assert (r['id'] + ' ') in l or (r['id'] + ' ·') in l, f"line {r['line']} does not carry {r['id']}: {l[:80]!r}"
    assert text.count(r['ruling']) == 0
    positions.append((i, r))
positions.sort(key=lambda p: p[0])

def block_end(start):
    starter = lines[start]
    sub = starter.startswith('**§')
    for j in range(start + 1, len(lines)):
        if lines[j].startswith('## '):
            return j
        if sub and lines[j].startswith('**§'):
            return j
    return len(lines)

outl = list(lines)
for start, r in reversed(positions):
    end = block_end(start)
    k = end
    while k - 1 > start and outl[k - 1] == '':
        k -= 1
    ins = ['', r['ruling'].rstrip('\n')]
    if end < len(outl):
        ins.append('')
    outl[k:end] = ins
text2 = '\n'.join(outl)
if not text2.endswith('\n'):
    text2 += '\n'
for r in rulings:
    assert text2.count(r['ruling']) == 1, r['id']

# --- 4. the sitting section, appended ---
tail = io.open(f'{SC}/frq-tail-892.md', encoding='utf-8').read()
fills = json.load(io.open(f'{SC}/tally.json', encoding='utf-8')) if os.path.exists(f'{SC}/tally.json') else {}
for k, v in fills.items():
    tail = tail.replace('__' + k + '__', v)
left = [t for t in ['__TALLY__', '__S20__', '__P0__', '__INPLACE__', '__DOCKET__', '__CRITIC__'] if t in tail]
if left and not dry:
    print('REFUSED: unfilled tail placeholders', left); sys.exit(1)
if not tail.endswith('\n'):
    tail += '\n'
head_line = tail.split('\n')[0]
assert head_line not in text2
final = text2 + '\n' + tail if not text2.endswith('\n\n') else text2 + tail
assert final.count(head_line) == 1
assert final.endswith('\n')

# --- post-conditions: deletions are exactly the two old §3 lines ---
import difflib
base_lines = base.split('\n'); final_lines = final.split('\n')
sm = difflib.SequenceMatcher(a=base_lines, b=final_lines, autojunk=False)
deleted = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag in ('delete', 'replace'):
        deleted.extend(base_lines[i1:i2])
assert deleted == s3['old'].split('\n'), ('unexpected deletions', deleted[:5])
io.open(out_path, 'w', encoding='utf-8').write(final)
print('WROTE', out_path, 'bytes', len(final.encode('utf-8')), 'lines', final.count('\n'), '| deletions exactly the §3 clause (%d lines); rulings %d; tail %d lines%s' % (len(deleted), len(rulings), tail.count('\n'), ' [DRY]' if dry else ''))
