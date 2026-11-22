#!/usr/bin/env python3
"""File a reviewer's dated review on the chair lane, byte for byte, and raise the dated roster by one.

usage: filereview.py <origin-branch> <path> <key-suffix> <header-what> <note-description>

  origin-branch     e.g. lane/review-r2-stages-2026-11-13 (must be fetched: origin/<branch>)
  path              the file's path, the same on the reviewer's branch and on the chair lane
  key-suffix        the growth note's key becomes _rosterGrowth2026-11-13-<key-suffix>
  header-what       the clause for the walker's header, e.g. "the read of three round-two stages"
  note-description  the clause after the path in the growth note

Run from the chair lane's checkout. Prints the three paths it changed; commits nothing.
"""
import subprocess, sys, re, json, os

ROOT = '/home/user/settlement-engine'
BASELINE = 'tests/lint/.source-citation-baseline.json'
WALKER = 'tests/lint/sourceCitationIntegrity.walker.test.js'
SESSION = 'session_01FE9mEws7PXYRYdjQPbSX15'

def git(*a, binary=False):
    out = subprocess.run(['git', '-C', ROOT, *a], check=True, capture_output=True).stdout
    return out if binary else out.decode().strip()

def main(branch, path, suffix, what, desc):
    ref = f'origin/{branch}'
    tip = git('rev-parse', '--short=9', ref)
    blob = git('rev-parse', f'{ref}:{path}')
    data = git('show', f'{ref}:{path}', binary=True)
    dest = os.path.join(ROOT, path)
    if os.path.exists(dest):
        sys.exit(f'EXISTS: {path}')
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, 'wb') as fh:
        fh.write(data)
    mine = git('hash-object', path)
    assert mine == blob, (mine, blob)

    base = open(os.path.join(ROOT, BASELINE)).read()
    m = re.search(r'^(\s*)"dated": (\d+),$', base, re.M)
    old = int(m.group(2)); new = old + 1
    base = base[:m.start()] + f'{m.group(1)}"dated": {new},' + base[m.end():]
    newest = re.search(r'^(\s*)"_rosterGrowth2026-11-13-review-veil-211": ', base, re.M)
    key = f'_rosterGrowth2026-11-13-{suffix}'
    assert key not in base, 'key exists'
    note = (f'{newest.group(1)}"{key}": "ONE document JOINED the roster by being BORN into it (the chair, session {SESSION}, '
            f'on lane/chair-2026-11-08): `dated` {old} -> {new}: {path}, {desc}, copied byte for byte from {branch} at {tip}. '
            f'No other document moved.",\n')
    assert '"' not in desc and '"' not in what
    base = base[:newest.start()] + note + base[newest.start():]
    json.loads(base)
    open(os.path.join(ROOT, BASELINE), 'w').write(base)

    w = open(os.path.join(ROOT, WALKER)).read()
    head = f' *   dated ({old})  an ISO date in the filename ('
    assert w.count(head) == 1, 'walker header not found once'
    w = w.replace(head, f' *   dated ({new})  an ISO date in the filename (2026-11-13, the chair, {what} born dated, {old} -> {new}: {path}; ')
    open(os.path.join(ROOT, WALKER), 'w').write(w)
    print(f'filed {path} (blob {blob[:12]} equal) from {branch} at {tip}; dated {old} -> {new}; key {key}')
    print(path); print(BASELINE); print(WALKER)

if __name__ == '__main__':
    main(*sys.argv[1:6])
