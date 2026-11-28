# (B) DEPTH: lines per key (RANGE-MEASURE, 2026-11-28)

Tree b693c4605; C and V as rendered (see `A-variants.md` for what a key is and how a print is counted). Every non-chrome key
that prints on C or V: 2,198 keys. A key whose lines print TOGETHER (a list: no choice) counts each of its lines as a key of
one line. All counts CONFIRMED (`tools/depth.mjs`).

| lines in the key | keys | lines | prints C (share) | prints V (share) | keys by lines actually SEEN on C+V |
|---|---|---|---|---|---|
| 1 (no choice at all) | 1,008 | 1,008 | 79,391 (26.3%) | 77,332 (26.4%) | 1,186 |
| 2 | 272 | 544 | 14,115 (4.7%) | 13,768 (4.7%) | 262 |
| 3 to 5 | 684 | 2,321 | 76,050 (25.2%) | 73,991 (25.3%) | 596 |
| 6 to 10 | 198 | 1,432 | 91,243 (30.2%) | 88,525 (30.3%) | 127 |
| 11 or more | 36 | 581 | 40,845 (13.5%) | 38,887 (13.3%) | 27 |
| all | 2,198 | 5,886 | 301,644 | 292,503 | 2,198 |

**WEIGHTED BY PRINTS: 31.0% of a page's pool sentences on C (31.1% on V) come from a key with one or two lines.** Of the keys
of one line, 72% of the prints are the service lines (`institutionServices.js`: "Grind grain into flour for bread and other
foods." on every mill).

## Depth as a reader meets it
- **SOURCE DEPTH IS NOT PRINTED DEPTH.** 178 keys of 2+ lines showed ONE line in all 1,800 towns (9,914 prints): a rule
  upstream picks the same one. Example: the town ropemaker's three descriptions; two name ships, `shipFreeDesc` drops them
  inland, and the third ("Rope and cordage twisted from hemp, flax, or whatever plant fibre comes to hand. Nothing sails,
  rises, or is harvested without it.") prints on all 292 towns that hold one, coast or not.
- **A KEY IS DRAWN MORE OFTEN THAN IT IS DEEP.** 20.7% of pool prints come from keys of which a single page shows half its
  lines or more; 6.0% from keys a page draws as often as they have lines or more (a repeat on that page is then forced).
  These are the tie lines and the house descriptions in cities: an 8-line tie key under twenty pairs of people.
- **THE MIDDLE IS SHALLOW TOO.** 684 keys hold 3 to 5 lines (a quarter of prints). With three lines and 150 towns of a size,
  each line prints in about fifty of them.

## So
Pools are shallow where they are commonest: a third of pool prints have one or two lines to draw from, and another quarter
have three to five. The deep keys (6+) carry 44% of prints, and those are mostly DISTINCT (secrets, goals, ties; see A).
Their sameness comes from use, not from depth.
