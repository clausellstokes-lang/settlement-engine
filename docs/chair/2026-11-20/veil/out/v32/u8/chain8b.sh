#!/bin/sh
# VEIL-32: after chain8: the tip (the lane's checkout, src = b6b6b723e) built and VERIFY_DIST read; signalCopies at the tip;
# then the eight first-paint chunks compared tip vs cure, the lazy chunks' content hashes normalised (the chair's E69 condition).
C=/home/user/settlement-engine; W=/home/user/wt/r3tell8b; O=/var/tmp/v18/out/v32/u8
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
while ! grep -q '^END' $O/done.txt; do sleep 30; done
: > $O/done-b.txt; echo "start $(date -u +%H:%M:%S) lane $(git -C $C rev-parse --short HEAD); src diff vs b6b6b723e: $(git -C $C diff --name-only b6b6b723e HEAD -- src supabase tests | wc -l) files" >> $O/done-b.txt
cd $C && $E npm run build > $O/tip-build.txt 2>&1; echo "tip build rc=$?" >> $O/done-b.txt
$E VERIFY_DIST=1 sh scripts/gate-tail.sh npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js > $O/tip-verify-dist.txt 2>&1; echo "tip verify-dist rc=$?" >> $O/done-b.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilSignalCopies.pglite.test.js --maxWorkers=1 > $O/tip-signalcopies.txt 2>&1; echo "tip signalCopies rc=$?" >> $O/done-b.txt
python3 - $C/dist $W/dist > $O/firstpaint-compare.txt 2>&1 <<'PY'
import sys, os, re, hashlib, gzip
a, b = sys.argv[1], sys.argv[2]
def assets(d):
    p = os.path.join(d, 'assets'); return {f: open(os.path.join(p, f), 'rb').read() for f in os.listdir(p) if f.endswith('.js')}
A, B = assets(a), assets(b)
stem = lambda f: re.sub(r'-[A-Za-z0-9_-]{8}\.js$', '', f)
SA = {stem(f): f for f in A}; SB = {stem(f): f for f in B}
html = open(os.path.join(a, 'index.html')).read(); htmlb = open(os.path.join(b, 'index.html')).read()
fp = sorted(set(stem(x) for x in re.findall(r'assets/([^"\']+\.js)', html)))
norm = lambda s: re.sub(rb'-[A-Za-z0-9_-]{8}\.js', b'-HASH.js', s)
print('first-paint chunks named by index.html (tip):', len(fp))
for k in fp:
    x, y = A.get(SA.get(k, ''), b''), B.get(SB.get(k, ''), b'')
    print(f"{k:22s} raw {len(x):8d} {len(y):8d}  byte-equal {x == y}  equal-hash-normalised {norm(x) == norm(y)}  gz {len(gzip.compress(x,9))} {len(gzip.compress(y,9))}")
PY
echo "compare rc=$?" >> $O/done-b.txt
echo "END $(date -u +%H:%M:%S)" >> $O/done-b.txt
