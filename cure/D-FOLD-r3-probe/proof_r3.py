# D-FOLD-r3 insertions-only proof: snapshot (before r2b) vs the file now.
# Removing every line the diff marks as inserted must restore the snapshot byte for byte,
# and the diff must mark zero lines deleted or replaced.
import difflib, sys, os, hashlib
docs, probe = sys.argv[1], sys.argv[2]
pairs = [('FOLD.before-r3.md', 'DESIGN_FP_COHERENCE_FOLD.md'), ('SPINE.before-r3.md', 'DESIGN_FP_SPINE.md'), ('CN.before-r3.md', 'DESIGN_FP_ARCH_CN.md')]
ok = True
for snap, cur in pairs:
    a = open(os.path.join(probe, snap), encoding='utf-8').read()
    b = open(os.path.join(docs, cur), encoding='utf-8').read()
    al, bl = a.split('\n'), b.split('\n')
    ops = difflib.SequenceMatcher(a=al, b=bl, autojunk=False).get_opcodes()
    dels = sum(i2 - i1 for t, i1, i2, j1, j2 in ops if t in ('delete', 'replace'))
    ins = sum(j2 - j1 for t, i1, i2, j1, j2 in ops if t in ('insert', 'replace'))
    keep = [l for t, i1, i2, j1, j2 in ops if t == 'equal' for l in bl[j1:j2]]
    restored = '\n'.join(keep)
    same = restored == a
    ok = ok and same and dels == 0
    print(f"{cur}: +{ins} / -{dels} lines; restore-by-removal == snapshot: {same}; sha256 now {hashlib.sha256(b.encode()).hexdigest()[:12]}")
print('INSERTIONS-ONLY PROOF:', 'PASS' if ok else 'FAIL')
sys.exit(0 if ok else 1)
