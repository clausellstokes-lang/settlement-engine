# READ-COST (VEIL-52; the chair 22:48), n115.sh with N115_LISTS=1, run -00:34 UTC 2026-11-25, CONFIRMED (executed)

Tip chain v28tpl vs master's own chain (db832c892, 001..203); today-born stored 140 as public rows (840 = 140 x 3 markers x 2 Reveals; 1 = one document). The gallery's LIST reads the page calls first: list_gallery_dossiers(0, 24, 'relevant', '', '{}', true) (fetchPublicGalleryViaRpc's defaults), list_featured_dossiers(), list_curated_dossiers(); 20 reads each; median ms.

```
tip 840 rc=0
tip 1 rc=0
master 840 rc=0
master 1 rc=0
door | tip 1 row | tip 840 | master 1 row | master 840 | tip/master at 840 | tip 840/1 | master 840/1   (median ms)
list_gallery | 5.58 | 4759.09 | 5.74 | 4694.46 | 1.01 | 852.9 | 817.9
list_featured | 0.25 | 0.56 | 0.32 | 0.56 | 1.00 | 2.2 | 1.8
list_curated | 0.16 | 0.23 | 0.17 | 0.23 | 1.00 | 1.4 | 1.4
tip 1 public rows 1 missing [] empty {}
tip 840 public rows 840 missing [] empty {}
master 1 public rows 1 missing [] empty {}
master 840 public rows 840 missing [] empty {}
```
