# BRIEF: COVERT-UNREAD (VEIL-52's builder; the chair's RULING V28 (1), Q1, FAIL CLOSED; relayed by VEIL-55 08:11 UTC 2026-11-25)

YOU WORK IN `/home/user/wt/unread`, branch `lane/veil-52-2026-11-24-unread-wip`, a CHILD of 2f849aa53 (unit 3's tip: do NOT change any
commit below it). ONE code commit (plus a hand-back commit). Commit by explicit paths with the hooks as configured (never `--no-verify`,
never `-c core.hooksPath=...`, never HUSKY=0); NEVER push; no pull request; no hosted database; never the `supabase` command. A refusal by
your permission check stands: stop and report it. READ NO WIDER than the files named here and the test files you copy patterns from.

THE RULE. On a PUBLIC read (share-level Reveal DM off; the party link always; the map member always), `unread` is ALSO true where the
full town `dm_full` IS an object that carries `prominentRelationship` or `pressureSentence` and has NO `relationships` key. `unread`
closes the read: both the covert copy (`prominentRelationship`) and the sentence (`pressureSentence`) are withheld (the existing
`closed` path). Nothing else changes.
  SQL: `supabase/migrations/212_share_veil_later_cures.sql :: _gallery_apply_member_overrides`, the lateral `cw` (the expression `as
  unread`, about line 3205): add `or (jsonb_typeof(dm_full) = 'object' and not (dm_full ? 'relationships') and (dm_full ?
  'prominentRelationship' or dm_full ? 'pressureSentence'))`. Update the comment above it (`unread`: ...) to say so, citing V28 (1).
  TWIN, rule for rule: `src/domain/display/gallerySecondHomes.js :: withholdCovertCopies`: `unread` gains `|| (isRec(full) &&
  !hasOwn(full, 'relationships') && (hasOwn(full, 'prominentRelationship') || hasOwn(full, 'pressureSentence')))` (use the file's own
  own-property idiom); its JSDoc's "WHERE UNSURE" list gains the case.
  HEADER: 212's header gains its item for this rule: write it as `(40)` (VEIL-55 renumbers at the lane's merge), one short paragraph
  in the style of the items above it (what, why: fail closed where the ties cannot be checked; V28 (1)). No function added, removed or
  re-signed.
  ROLLBACK: read `supabase/rollback/212_share_veil_later_cures.down.sql`: it already restores 211's `_gallery_apply_member_overrides`
  (around line 160). Say whether that suffices (expected: yes, nothing to add); prove it by the rehearsal below.

RED FIRST, A NEW TEST FILE `tests/security/galleryCovertUnread.pglite.test.js` (copy the harness of `tests/security/galleryMapCovert.pglite.test.js`:
its pglite chain loading, its plant style, its four server reads; read that file whole first). THE PLANT: a stored town that carries
a covert tie's copy (`prominentRelationship`, an object with npc1/npc2/type/full) and a `pressureSentence`, and NO `relationships`
key, saved two ways: PLAIN (`data`) and NARRATED (`ai_data.aiSettlement` with `gallery_share_narrated` true). Shared at Reveal off.
Read at ALL FOUR DOORS: `get_gallery_dossier` (data), `get_unlisted_dossier` (-> 'dossier'), `import_gallery_dossier` (data, as a
signed-in premium reader), and the map member (`get_gallery_map` -> members[0].settlement) AND `import_gallery_map`'s member; and the
TWIN (`galleryPayloadFor` / `withholdCovertCopies` over the same document, shareDm false). Assert: neither the copy nor the sentence is
served at any door or by the twin. A CONTROL: the same document WITH `relationships: []` (an array, no covert tie): both strings ARE
served at every door (proves the plant is not withheld for another reason). RED: run the new file on 2f849aa53's SQL and twin FIRST
(expected: the plant's doors serve both strings; quote the failing lines), THEN make the change, GREEN.

PROOF (each through the mutex, from `/home/user/settlement-engine`: `GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh -c
"cd /home/user/wt/unread && sh scripts/gate-tail.sh npx vitest run <files>"`, logs under /var/tmp/v52/builder3/, never through a pipe):
(i) the new file RED before the change; (ii) GREEN after; (iii) the files that pin the rule: `tests/security/gallerySecondHomes.pglite.test.js`,
`tests/security/galleryVeilHandRows.pglite.test.js`, `tests/security/galleryMapCovert.pglite.test.js`, `tests/security/galleryVeilCures.pglite.test.js`
(its rollback pins): green, or each red named with its cause; (iv) THE ROLLBACK REHEARSAL on the local PostgreSQL 16 (socket /var/tmp/rv7,
user postgres, trust): `createdb -T v27x211 <scratch>`, apply the branch's 212, then its down file; compare to v27x211 every public function's
identity, md5(pg_get_functiondef), volatility, security definer and ACL: EQUAL (say the count); drop the scratch db; (v) `tests/lint` WHOLE
after the commit (fetch the ledger ref first: `git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD`
in /home/user/settlement-engine): its count beside the base, which is 16 files | 27 tests at 2f849aa53 (titles in
`docs/chair/2026-11-24/tenth/veil/v52/out/U3-LINT-PAIR.txt` on lane/veil-52-2026-11-24): name any title not in that list.

REPORT: `docs/chair/2026-11-24/tenth/veil/v52/builder/COVERT-UNREAD-HANDBACK.md` on the -wip (committed): STOPS first; the commit; the SQL
and twin hunks quoted; red and green PER DOOR and for the twin; the control; the rollback rehearsal's result; the lint comparison;
CONFIRMED vs PLAUSIBLE. Final message: at most 200 words.
