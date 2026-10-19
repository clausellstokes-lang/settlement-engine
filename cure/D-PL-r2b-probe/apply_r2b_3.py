import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
R = [
("and no second `service_refused` row prices the same men in the same war. A summons row is PL's OWN. PL mints it, with `episodeId` the call-in request's `warAnchorKey` (WC §1.9.1), so there is one row per member per war;",
 "and no second `service_refused` row prices the same men for the same call. A summons row is PL's OWN. PL mints it, with `episodeId` the call-in request's own key (its `warAnchorKey` and `askedTick`, WC §1.9.1 — the request record carries no id field of its own), so there is one row per member per call;"),
("each with `episodeId` the call-in's `warAnchorKey`;",
 "each with `episodeId` the call-in request's key (`warAnchorKey` · `askedTick`);"),
("no second row for the same men in the same war; the row is PL's own (episode the call-in's `warAnchorKey`);",
 "no second row for the same men for the same call; the row is PL's own (episode the call-in request's key, `warAnchorKey` · `askedTick`);"),
("one hearing and one row per member per war (episode the call-in's `warAnchorKey`);",
 "one hearing and one row per member per call (episode the call-in request's key, `warAnchorKey` · `askedTick`);"),
("the `army:` / `column:` episode is PS's STABLE unit key, whose kind prefix is the registered occasion.",
 "the `army:` / `column:` episode is PS's STABLE unit key, whose kind prefix is the registered occasion (PS's key carries its kind as its prefix today — `'army:' + …`, `'column:' + columnKey(…)` — and that prefix is the contract PL registers)."),
]
for old, new in R:
    n = s.count(old)
    if n != 1:
        print("MISMATCH count=%d for: %s" % (n, old[:90])); sys.exit(2)
for old, new in R:
    s = s.replace(old, new, 1)
open(path, 'w', encoding='utf-8').write(s)
print('ok', len(R))
