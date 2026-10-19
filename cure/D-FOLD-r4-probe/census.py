# token census: for each token, files in master src/ and tests/ with a QUOTED literal ('t' / "t" / `t`) and with a word hit; ledger docs/ word-hit files.
import os, re, sys
M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963'
L = '/Users/cstokes/Desktop/settlement-engine/docs'
def files(root, exts):
    for d, _, fs in os.walk(root):
        if 'node_modules' in d: continue
        for f in fs:
            if f.endswith(exts): yield os.path.join(d, f)
SRC = [(p, open(p, encoding='utf-8', errors='ignore').read()) for p in files(M + '/src', ('.js', '.jsx', '.mjs', '.ts', '.tsx', '.json'))]
TST = [(p, open(p, encoding='utf-8', errors='ignore').read()) for p in files(M + '/tests', ('.js', '.jsx', '.mjs', '.ts', '.tsx', '.json'))]
DOC = [(p, open(p, encoding='utf-8', errors='ignore').read()) for p in files(L, ('.md',))]
toks = [t for t in sys.argv[1:]]
for t in toks:
    e = re.escape(t)
    q = re.compile(r"""['"`]""" + e + r"""['"`:]""")
    w = re.compile(r'(?<![\w])' + e + r'(?![\w])')
    def cnt(rx, corpus): 
        hits = [p for p, s in corpus if rx.search(s)]
        return len(hits), hits[:3]
    qs, qsx = cnt(q, SRC); qt, qtx = cnt(q, TST); ws, wsx = cnt(w, SRC); wt, _ = cnt(w, TST); wd, wdx = cnt(w, DOC)
    ex = ', '.join(os.path.relpath(p, M) for p in (qsx or wsx)[:3])
    print(f"{t}\tquoted src {qs} · tests {qt}\tword src {ws} · tests {wt}\tledger docs {wd}\t{ex}")
