# First paint +58 raw: what the bytes are (KINDS-1, 22:18 UTC 2026-11-20)

Two fresh builds (git archive of 062504aa8, the line, and 4b6fada00, the lane at K1), the vendorPdfLazy closure walk.
```
index-H.js raw 488958 -> 489016 d 58 normalisedEqual false
closure raw 1177668 -> 1177726
trouble-law occurrences in lane entry: 1  in line entry: 0
after removing the name: bytes line 485997 lane 486022
equal with indices normalised: false
mapDeps calls 91 91 changed 75 extra bytes in index arrays 25
equal with mapDeps arrays normalised: true
calls whose array gained an element: 8
```

The only file of the entry closure that changed is the entry (index), +58 raw: 33 bytes are the string `"assets/trouble-law-<hash>.js",` added to Vite's preload dependency list (`__vite__mapDeps`), and 25 bytes are the index arrays of the lazy imports that list it (8 calls gain the chunk's index; later indices shift). With the name removed and the mapDeps arrays normalised, the entry equals the line's byte for byte: no code entered first paint. The same cost is paid by every lazy chunk the generation path preloads (the fortune lane's fortune-law pays it too).
