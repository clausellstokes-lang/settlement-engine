# -*- coding: utf-8 -*-
"""The EM preamble's FOURTH amendment (owed at EM-R0a's placement sitting; ODQ §934.47 addenda 83, 87): §P2 row 11 gains the sentence
that the generation worker's byte budget has NO placement cure — `worker.rollupOptions` is unset, so `manualChunks` never runs for a
worker build and a worker byte is bought back inside the worker's own files. Self-verifying: `vite.config.js` carries no
`worker.rollupOptions` (the fact TOOL-12 measured) and the sentence is absent. Run in the worktree ON the branch, tree clean, before
EM-R0a is placed (R0a cites the new hash). Prints the new SHA-256; the commit is the chair's, by pathspec."""
import hashlib, io, re
P = "docs/implementation/preambles/EM-PREAMBLE.md"
vc = io.open("vite.config.js", encoding="utf-8").read()
m = re.search(r"worker\s*:\s*\{(.*?)\n\s*\}", vc, re.S); assert m, "no worker block in vite.config.js"
assert "rollupOptions" not in m.group(1), "worker.rollupOptions IS set now — the law's fact does not hold; STOP"
s = io.open(P, encoding="utf-8").read(); old = hashlib.sha256(s.encode("utf-8")).hexdigest()
anchor = "a pre-proof re-measures membership by importing the set, never by reading a list."
assert s.count(anchor) == 1 and "NO PLACEMENT CURE" not in s
add = (" THE WORKER BUDGET HAS NO PLACEMENT CURE: `worker.rollupOptions` is unset in `vite.config.js`, so `manualChunks` never runs for a worker build and "
       "every worker entry is its own rollup build — a byte a member lands in the generation worker's closure (`WORKER_BUNDLE_CEILING_BYTES`, zero slack) can only be "
       "bought back inside the worker's own files, never moved to a sibling chunk (TOOL-12's measurement of 2026-09-20; ODQ §934.47 addenda 83, 87); a member "
       "that reaches `generationRequest.js`'s graph prices the buy-back at pre-proof.")
s = s.replace(anchor, anchor + add, 1); io.open(P, "w", encoding="utf-8").write(s)
new = hashlib.sha256(s.encode("utf-8")).hexdigest(); print("EM-PREAMBLE amended (row 11: the worker's no-placement-cure sentence); SHA-256", old[:12], "->", new); print("NEW_PREAMBLE_SHA=" + new)
