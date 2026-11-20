# COHERENCE-POWERS-2 — the second seat's probes (re-runnable)

Every probe takes the tree to measure as its first argument (`node <probe> <tree> …`) and imports from it, so the same
script reads a base worktree and the tip. Births go through `birthConfig` with the browser's dials.

THE CORPUS (L2), 2,460 births, seeds fixed in the scripts:
- random dials: `critique-<tier>-<i>`, thorp 150, hamlet 150, village 60, town 160, city 100, metropolis 40;
- every one of the 15 stresses forced (`selectedStresses: [stress], selectedStressesRandom: false`) × six tiers × 20:
  `l2-<stress>-<tier>-<i>`.

| probe | what it reads |
|---|---|
| `l2.mjs <tree> <out.json> [rand\|forced]` (env `ALLSTRESS=1` for all 15 stresses) | per birth: the dual-hat guard's rows, councils of a kind with no house, powers with no member and houseless contenders by cause, the capture state, the leader |
| `t2.mjs <a.json> <b.json>` · `table.mjs <out.json>` | item 0's tables from l2's output |
| `exempt.mjs <tree> <l2 out.json>` | the office-led small places: exempt (no open faced house but the government's) or a faced house standing |
| `item3.mjs <tree>` | item 3's guard arm: powers with neither a member nor a declared line (BLANK, must be 0), and how each stress power is faced |
| `ladder.mjs <tree>` | item 4: the governing power's rank-1 card against the ladder's first-lit top rung (`eligibleMembersOf(...)[0]`) |
| `labels.mjs <tree> <out.json>` + `labdiff.mjs <a> <b>` | L3 for labels: every label, band, state, stability, legitimacy and power figure, base against tip |
| `hash.mjs <tree> <out.json>` + `leafdiff.mjs` | L3 field diff: sha256 per birth over the golden's 525 configurations and the corpus; full leaf diff for the keys that differ |
| `print.mjs <tree> <seeds…>` | how the two hats and the stress powers print, power by power (`five-towns.txt` at the tip) |
| `bank.mjs <tree>` | item 2: where the counting-house line printed with no bank |
| `look.mjs`, `thieves.mjs` | one town's roster, houses and cards; the houseless Thieves' Guild's cause |
