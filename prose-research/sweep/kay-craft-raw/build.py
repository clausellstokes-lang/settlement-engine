# -*- coding: utf-8 -*-
import json, os, re, sys
D = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
R = os.path.join(D, "kay-craft-raw")

def txt(name):
    p = os.path.join(R, name + ".txt")
    if not os.path.exists(p): return ""
    return open(p, encoding="utf-8", errors="replace").read()

def norm(s):
    return re.sub(r"\s+", " ", s)

def check(claims):
    bad = []
    for c in claims:
        q = c.get("quote", "")
        f = c.pop("_file", None)
        if not q: continue
        body = norm(txt(f))
        if norm(q) not in body:
            bad.append((c["source"][:40], q))
            c["quote"] = ""
    return bad
