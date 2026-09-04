"""G0-FOLD edit library: exact-anchor replacements over $SP/DESIGN_HORIZON.md, each asserting its anchor
occurs exactly once; the header checkpoint; fold.json bookkeeping. A batch writes NOTHING until every
replacement in it has matched (atomic per batch)."""
import json, pathlib, re, sys

SP = pathlib.Path('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/walk/S03/replay')
ME = pathlib.Path('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/walk/S03/replay')
VOL = SP / 'DESIGN_HORIZON.md'
FOLD = ME / 'fold.json'
HEADER_RE = re.compile(r'⟦G0 (?:PARTIAL|FOLDED)[^⟧]*⟧')


class Folder:
    def __init__(self):
        self.txt = VOL.read_text(encoding='utf-8')
        self.before = len(self.txt.encode('utf-8'))
        self.reps = 0

    def rep(self, old, new, count=1):
        n = self.txt.count(old)
        if n != count:
            raise AssertionError(f'anchor count {n} != {count}: {old[:110]!r}')
        self.txt = self.txt.replace(old, new)
        self.reps += 1

    def insert_before(self, anchor, block):
        self.rep(anchor, block + anchor)

    def checkpoint(self, done, total, flip=None):
        if flip:
            new = flip
        else:
            new = f'⟦G0 PARTIAL: {done} of {total}⟧'
        n = len(HEADER_RE.findall(self.txt.split('\n', 4)[2]))
        assert n == 1, f'header checkpoint mark count {n}'
        lines = self.txt.split('\n')
        lines[2] = HEADER_RE.sub(new, lines[2], count=1)
        self.txt = '\n'.join(lines)

    def save(self, label):
        VOL.write_text(self.txt, encoding='utf-8')
        after = len(self.txt.encode('utf-8'))
        marks = sorted(set(re.findall(r'⟦G0-(\d+)⟧', self.txt)), key=int)
        print(f'[{label}] {self.reps} replacements; bytes {self.before} -> {after}; G0 marks present: {len(marks)} (max {marks[-1] if marks else 0})')
        print('HEADER:', self.txt.split('\n')[2][:200])


def fold_json(folded=(), refused=(), chair=(), settled14=(), verdict=None):
    d = json.loads(FOLD.read_text())
    for k, v in (('folded', folded), ('refused', refused), ('chairRows', chair), ('settled14', settled14)):
        for item in v:
            if item not in d[k]:
                d[k].append(item)
    if verdict:
        d['verdict'] = verdict
    FOLD.write_text(json.dumps(d, indent=1, ensure_ascii=False))
    print('fold.json:', {k: len(d[k]) for k in ('folded', 'refused', 'chairRows', 'settled14')}, d['verdict'])
