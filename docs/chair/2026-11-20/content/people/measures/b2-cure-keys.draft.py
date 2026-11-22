import sys
p = sys.argv[1] + '/src/data/powerLineVariants.js'
s = open(p).read()
reps = [
("""/**
 * THE STANDING CODAS (`power/factionStanding.js :: annotateFactionStanding`, re-settled to the final roster by
 * `power/rosterText.js :: settleStandingToRoster`): each matched by its own words where it stands after the text before it;
 * `$1`, `$2` in a wording are the names or the force word the coda already carries (its groups). A pool with no row
 * left is not voiced. `today` marks today's coda where it is not eligible everywhere: `'never'` (closingGap), or
 * `'excludesLevel'` (ineligible where the branch's own computed tie holds).
 * @type {ReadonlyArray<{ id: string, today?: 'never' | 'excludesLevel', re: RegExp, rows: ReadonlyArray<PowerLineRow> }>}
 */""",
"""/**
 * THE STANDING CODAS (`power/factionStanding.js :: annotateFactionStanding`, re-settled to the final roster by
 * `power/rosterText.js :: settleStandingToRoster`): each matched by its own words where it stands after the text before it;
 * `$1`, `$2` in a wording are the names or the force word the coda already carries (its groups). A pool with no row
 * left is not voiced and is no key: it stands in `KEY_EXEMPT` with its reason (worthBuying). `today` marks today's coda
 * where it is not eligible everywhere: `'never'` (closingGap), or `'excludesLevel'` (ineligible where the branch's own
 * computed tie holds, the `level` the pass is handed).
 * @type {ReadonlyArray<{ id: string, today?: 'never' | 'excludesLevel', re: RegExp, rows: ReadonlyArray<PowerLineRow> }>}
 */"""),
("""/**
 * THE RELATION ROWS, by the branch""",
"""/**
 * THE TEXT KEYS NOT VARIED (the chair's ruling of 20:50 UTC: "every opening/coda the unit means to vary has a key, or is
 * in an exempt list with its reason"): a line the writers print in more than 20% of a size's places that no pool here
 * voices, by its key as `tests/generators/power/powerLinesVoiced.test.js` (5b) names it (`CODA_POOLS.<id>` for a keyed
 * pool left with no row; `opening: <sentence>` or `coda: <sentence>`, names masked, for a line with no key), and why.
 * @type {Readonly<Record<string, string>>}
 */
export const KEY_EXEMPT = deepFreeze({
  'CODA_POOLS.worthBuying': 'both of its ruled wordings are LEFT OUT (the B2 brief\\'s test 3 bars "worth having" and "know it" in any new wording) and the chair wrote none in their place; its second tranche is a later unit. The coda prints as written (never on the governing seat: the chair\\'s F2).',
});

/**
 * THE RELATION ROWS, by the branch"""),
("""    for (const coda of CODA_POOLS) {
      if (!coda.rows.length) continue;""",
"""    for (const coda of CODA_POOLS) {
      if (!coda.rows.length) continue; // no wording to give (KEY_EXEMPT)"""),
(""" * THE HIDEABLE RULE (the verdict's item 5)""",
""" * THE TEXT KEYS (the chair's ruling of 20:50 UTC: a key is a second home in principle; for this unit the keys are kept
 * under two tests, `powerLinesVoiced.test.js` (5)): an opening is keyed by today's exact text (`DESC_POOLS`), a coda by a
 * `re:` of today's words (`CODA_POOLS`), a relation by its branch's `re:` (`RELATION_BRANCHES`); every key meets a line the
 * writers print, and every line printed in more than 20% of a size's places has a key or stands in `KEY_EXEMPT` with its
 * reason. After the deploy (a decomposition, not this unit): the openings keyed by the ladders' exported constants.
 *
 * THE HIDEABLE RULE (the verdict's item 5)"""),
]
for a, b in reps:
    assert s.count(a) == 1, a[:70]
    s = s.replace(a, b)
open(p, 'w').write(s)
print('ok')
