# COHERENCE-UPKEEP-4: the measurement harness (2026-11-13)

Writes nothing in either tree. `<tree>` is a checkout with `node_modules`.

```sh
node dump.mjs <tree> 660 <out>/<name>      # the lane's 660: summary + whole records (about 4 minutes)
node dump.mjs <tree> golden <out>/<name>   # the golden master's 525
node dump.mjs <tree> fence <out>/<name>    # the espionage fence's driven 360
node measures.mjs <out>/base <out>/tip measures.json   # every bound of the lane, base against tip
python3 fielddiff.py <out>/base <out>/tip <660|golden|fence> fd.json [UPKEEP-FIELD-DIFF.json <wide|golden|fence>]
```

Base at the fourth seat: AGREE's final tip faa20bc6c. Tip: 6f95af557.

`P5-built.patch` is P5 as built and NOT committed (parked: see the hand-back).
