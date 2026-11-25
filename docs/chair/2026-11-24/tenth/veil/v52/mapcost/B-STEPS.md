# MAP-COST (b): get_gallery_map by step (VEIL-52; V28 (3)), run 08:3x UTC 2026-11-25, CONFIRMED (executed)

Local PostgreSQL 16; db v52mc = v27x211 + unit 3's 212 (2f849aa53); the today-born stored 140 as the owner's public rows, one map_with_campaign of all 140, UNMARKED ({}) and MARKED (the hand marker); one read each with track_functions = 'all' (pg_stat_user_functions; script b-steps.mjs). CAVEAT: tracking every call inflates the wall time (68.0 s and 62.6 s here against VEIL-55's untracked 50.3 s and 49.5 s), most where calls are many (the sanitiser's 1,069,366 recursive calls): read the split as shares, not as absolute seconds.

```
unmarked wall ms 68041 members 140
   _gallery_veil_roster_choices 140 total 31139.5 self 17421.8
   _gallery_sanitize_public_json 1069366 total 15718.5 self 15718.5
   _gallery_veil_name_hit 316505 total 9011.1 self 9011.1
   _gallery_veil_copy_names 143515 total 13388.2 self 4808.4
   _gallery_veil_second_homes 140 total 10332.0 self 2537.7
   _gallery_veil_withhold_always 140 total 2399.7 self 1711.7
   _gallery_veil_hidden_name 17216 total 1541.4 self 1541.4
   _gallery_veil_name_ready 12780 total 2640.5 self 1441.1
   get_gallery_map 1 total 68027.2 self 1231.4
   _gallery_veil_name_prep 15636 total 1217.0 self 1217.0
   _gallery_veil_name_sweep 87 total 1721.4 self 1193.2
   _gallery_veil_name_hits 123 total 3764.2 self 1157.3
marked wall ms 62630 members 140
   _gallery_veil_roster_choices 140 total 28639.1 self 16175.8
   _gallery_sanitize_public_json 1069366 total 14904.7 self 14904.7
   _gallery_veil_name_hit 316505 total 8179.1 self 8179.1
   _gallery_veil_copy_names 143515 total 12155.8 self 4380.9
   _gallery_veil_second_homes 140 total 9735.2 self 2369.6
   _gallery_veil_withhold_always 140 total 2288.7 self 1632.4
   _gallery_veil_hidden_name 17216 total 1437.1 self 1437.1
   _gallery_veil_name_ready 12780 total 2541.2 self 1398.1
   _gallery_veil_name_prep 15636 total 1159.4 self 1159.4
   get_gallery_map 1 total 62624.8 self 1143.1
   _gallery_veil_name_sweep 87 total 1590.4 self 1107.3
   _gallery_veil_name_hits 123 total 3601.0 self 1089.8
```

PER MEMBER: ~486 ms unmarked, ~447 ms marked (tracked). SHARES (unmarked, total time, nested): _gallery_veil_roster_choices 46% (self 26%); _gallery_sanitize_public_json 23% self (1.07 M recursive calls: ~7,600 a member); the name search (_name_hit 316,505 calls, 13% self; _copy_names 20% total); _second_homes 15% total; _withhold_always 3.5%. The map member's cost is the veil's own per-town work, run once per member, not the tile join.
