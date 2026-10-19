# D-FOLD-r1 token census (read-only, pure Python) over the master worktree's src/:
# word files (\bw\b as a whole word) and quoted-literal files ('w' or "w" or `w`).
import os, re, sys, datetime
root = sys.argv[1]
words = sys.argv[2:]
files = []
for d, _, fs in os.walk(os.path.join(root, 'src')):
    if 'node_modules' in d:
        continue
    for f in fs:
        if f.endswith(('.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json')):
            files.append(os.path.join(d, f))
texts = {}
for p in files:
    try:
        texts[p] = open(p, encoding='utf-8', errors='replace').read()
    except OSError:
        pass
print('# D-FOLD-r1 token census on master 81f1cd963 (' + datetime.datetime.now().strftime('%Y-%m-%d %H:%M') + ' local), ' + str(len(texts)) + ' src files: word files · quoted-literal files')
for w in words:
    wre = re.compile(r'(?<![A-Za-z0-9_$])' + re.escape(w) + r'(?![A-Za-z0-9_$])')
    qre = re.compile(r"['\"`]" + re.escape(w) + r"['\"`]")
    a = [p for p, t in texts.items() if wre.search(t)]
    b = [p for p, t in texts.items() if qre.search(t)]
    ex = (' e.g. ' + os.path.relpath(b[0], root)) if b else ''
    print(f'{w}: {len(a)} · {len(b)}{ex}')
