#!/usr/bin/env python3
import sys
from pypdf import PdfReader
r = PdfReader(sys.argv[1])
out = []
for i, p in enumerate(r.pages, 1):
    out.append(f"<<<PAGE {i}>>>")
    out.append(p.extract_text() or "")
open(sys.argv[2], "w", encoding="utf-8").write("\n".join(out))
print(f"pages={len(r.pages)} chars={sum(len(x) for x in out)}")
