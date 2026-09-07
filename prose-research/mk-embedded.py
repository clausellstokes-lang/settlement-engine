#!/usr/bin/env python3
"""mk-embedded.py <args-file>... — chair 2026-09-06 17:35. Writes sweep/embedded/research-workflow-v3--<name>-<tag>.js: the v3 script
with `let A = args || {}` replaced by `let A = <the args JSON, verbatim, existingHashes INCLUDED>`. Launch with
Workflow({scriptPath: <that file>}) — the harness reads the file; no agent copies it and no chair transcribes it (the two ways an
args paste has gone wrong: a low-effort agent hallucinated 3,605 hashes from 330; a 50 KB hand paste per burst drifts).
Checks: exactly one A-binding line in the source; the embedded literal parses back EQUAL to the file; `node --check` passes."""
import json, os, re, subprocess, sys, tempfile
K = os.path.dirname(os.path.abspath(__file__)); SRC = f'{K}/research-workflow-v3.js'; OUTD = f'{K}/sweep/embedded'
os.makedirs(OUTD, exist_ok=True)
src = open(SRC, encoding='utf-8').read()
BIND = 'let A = args || {}'
assert src.count(BIND) == 1, f'expected exactly one {BIND!r} line in {SRC}, found {src.count(BIND)}'
for af in sys.argv[1:]:
    a = json.load(open(af, encoding='utf-8'))
    name = a['name']; tag = re.search(r'-(r\d+[a-z]?)\.json$', af).group(1)
    lit = json.dumps(a, ensure_ascii=True, separators=(',', ':'))   # ASCII-only: no raw unicode in the JS source, no U+2028/2029 hazards
    out = f'{OUTD}/research-workflow-v3--{name}-{tag}.js'
    body = src.replace(BIND, f'// EMBEDDED ARGS from {os.path.basename(af)} (mk-embedded.py; existingHashes {len(a.get("existingHashes") or [])})\nlet A = {lit}', 1)
    open(out, 'w', encoding='utf-8').write(body)
    # parse-back: the literal must equal the file
    m = re.search(r'^let A = (\{.*\})$', body, re.M); back = json.loads(m.group(1))
    assert back == a, f'{name}: embedded literal != {af}'
    # syntax: node --check needs a module extension
    # the harness runs the body inside an async function (top-level `return`/`await` are legal there); check it in that shape
    chk = 'async function __wf(args, agent, parallel, pipeline, phase, log, budget, workflow) {\n' + body.replace('export const meta', 'const meta', 1) + '\n}\n'
    with tempfile.NamedTemporaryFile('w', suffix='.mjs', delete=False, encoding='utf-8') as t: t.write(chk); tp = t.name
    r = subprocess.run(['node', '--check', tp], capture_output=True, text=True); os.unlink(tp)
    assert r.returncode == 0, f'{name}: node --check failed: {r.stderr[:400]}'
    print(f'{name} {tag}: {out} ({os.path.getsize(out)} bytes; chunks {len(a.get("chunks") or [])}; extra {[e["key"] for e in (a.get("extraAngles") or [])]}; regrade {a.get("regrade")}; skipSynth {a.get("skipSynth")}; hashes {len(a.get("existingHashes") or [])}) — literal==file, node --check OK')
