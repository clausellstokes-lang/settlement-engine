# LANE 36 → whoever owns `src/pdf/sections/EconomicsTrade.jsx` (lane 35 this wave)

Car 2 (browser pass 3) routed every PDF site that prints a catalogue institution name through
`institutionDisplayName`. One site was left untouched because the file is lane 35's: the
CUSTOM supply-chain flow at EconomicsTrade.jsx:270. It spreads `processingInstitutions` into a
flow string and prints it through `label()`, so a user chain whose processing step is a
catalogue institution prints the raw key ('Parish church') where the sibling PROC row at line
235 — in the same file, already seamed — prints 'House of worship'.

The import is already at line 32. The change is the map:

```diff
             const flow = [c.resource, ...(c.processingInstitutions || []), ...(c.outputs || [])]
               .filter(Boolean)
-              .map((n) => label(n) || String(n))
+              .map((n) => label(institutionDisplayName(n) || n) || String(n))
               .join(' » ');
```

`institutionDisplayName` passes anything the map does not name through unchanged, so a user's
own authored processing step keeps its words (the seam's own law: custom content is never
reworded). Proof to run with it: `tests/pdf/sections.smoke.test.js`, whose
`institution label — screen↔print parity` describe now carries the chain-flow arms.

Severity: low — it only fires on a CUSTOM chain that names a catalogue institution.
