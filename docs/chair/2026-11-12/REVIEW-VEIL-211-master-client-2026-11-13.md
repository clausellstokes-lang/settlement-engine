NOT SAFE — unless the count in section 4 reads 0, in which case 211 ALONE is safe now

# REVIEW-VEIL-3, third file — can the owner apply 204..211 now, ahead of the new client?

**The chair's question.** Production's database stands at ledger 203 and serves master's client (db832c892).
Does master's client still work over 211, and does its page still hide what its owner hid? What changes, what
breaks, and is there a smaller set?

**How it was answered: by execution.**
- A scratch native PostgreSQL 16.15 cluster, torn down at the end. No hosted database was touched.
- Three chains, each built from the lane's files at 5a2399cf9. Migrations 001..203 are byte-identical on master
  and the lane.
  - `203`: production today.
  - `203 + 204..211`: the planned deploy.
  - `203 + 211`: 211 alone, which applies cleanly on 203.
- Master's own code: its generator, its share writer (`writeShareVeil`, `galleryPayloadFor`), and its four
  read paths:
  - `fetchPublicDossier`: the gallery page, and the party link through its fallback;
  - `fetchGalleryMap`: the map draws `members[].settlement` as served;
  - `fetchDossierForImport`.
- These ran inside a master worktree (`npm ci`), over a fake supabase whose `rpc` runs the real SQL.
- 12 towns: 6 sizes, calm and infiltrated. 8 shares each: unmarked; the default veil; every eye shut; every
  default opened; Reveal DM; frozen with the default veil; frozen with every eye shut; frozen with Reveal DM.
  The frozen shares had their live row edited after the freeze.
- Totals: 96 shares, 1,152 reads.

## 1. What a visitor, an importer and a sharer get

| | 203 today | 203 + 204..211 | 203 + 211 alone |
|---|---|---|---|
| reads that broke (an error, a throw or no page) | 0 | **0** | **0** |
| strings in the gallery response that master's own page does not show (the live leak) | **17,806** on 82 shares | 1,202 | 1,205 |
| … of which, outside the "every default opened" shares | — | **only the served marker** (`$veil.groupings`, `mode`, `at`) | the same |
| post-freeze text in a frozen share's gallery / map / import response | 36 / 36 / 36 | **0 / 0 / 0** | **0 / 0 / 0** |
| post-freeze text on its party link | 36 | 24 | 24 |

The last row is 208's design: the link draws the live town. The other 12 frozen shares had Reveal DM on, and
the link never reveals.

The leak closes in both shapes. Nothing a master user does breaks. What changes on master's pages:

- **Gallery page, frozen shares:** the "frozen on <date>" label disappears; the page still shows the frozen copy
  (36 shares: `snapshot/2026-11-01 → snapshot/null`). Master dates a page only when the stored copy arrives,
  and 211 no longer sends the copy. Cosmetic.
- **Gallery page, shares whose DM opened a default** (criminal services, a hidden house, and so on): master's
  page hides them again. Master re-imposes its default veil, because the served marker carries no deltas. It
  hides more than the sharer chose: 10 shares at 211 alone, 40 with 204..210 (whose sanitiser changes, such as
  206's face veil, hide more).
- **Party link, map and import:** the share's veil now reaches them. Master applied none on these three; 74–82
  shares hide more, as intended. A frozen share's map member and import are now the frozen copy. Every string new
  on the map is on master's own 203 gallery page for that share (0 exceptions across 36 frozen shares).
- **Show-more on the gallery page — the one regression: `relationships[].description` only.** 500 strings, 18
  shares, in both shapes; classified by path, nothing else.

## 2. The regression: relationship descriptions a DM hid by hand

**Cause.** Master's panel addresses a relationship as `relationship.<npc1Id>-<npc2Id>-<type>`
(`galleryVeil.js:221` at db832c892). The integration changed the rule to `<from>-<to>-<type>` (141383cd4, people
step 1). 211 twins the new rule. Example: master wrote `field:relationship:relationship.npc-1-npc-3-rival:description`;
211 computes `relationship.peiyun-huang-jiahao-luo-rival`, so it never applies that eye.

At 203, master's page applied the stored delta itself. At 211 the served marker sends no deltas, so the
description master hid is drawn.

**Not affected:** the class switch `class:relationship:tension`. Master offers no class switch for relationship
descriptions, so only hand-shut eyes are hit.

**Who can read what.** Any visitor, on the gallery page, reads the descriptions of the relationships a DM hid one
by one. These strings are already in today's response (part of the 17,806), so a reader of the raw response gains
nothing. A reader of the page does.

**It is not only an "apply now" problem.** The new client uses the same new rule, so the same stored master-era
deltas fall away when the release ships, with or without 211. It belongs to the lane or the release either way.

**Cure** (not built): the veil reads a relationship's eyes under both ids, the old `npc1Id/npc2Id` spelling as an
alias, in 211 and in the new client. Or a one-time rewrite of stored relationship addresses.

## 3. The smaller set: 211 alone, not 204..210

- **211 needs none of 204..210 to apply or to run.** 001..203 then 211: exit 0; all 1,152 reads work. Its party
  link read is keyed on `unlisted_slug` alone. At 203 every path that sets a slug also sets
  `visibility = 'unlisted'`, and revoking clears both, so this matches 203's read.
- **208 should NOT go ahead of the new client.** Master's panel says sharing a party link removes the town from
  the gallery (`ShareToGallery.jsx:385`, `setIsPublic(false)`), and at 203 `share_settlement_unlisted` does that.
  208's version leaves `is_public` alone. Under master, a DM who switches a listed town to a party link is told it
  left the gallery while it stays listed.
- **204 and 209** are unrelated product changes (generation reports, surveyor premium-only). **205–207 and 210**
  are sanitiser tightenings, reviewed with the new client; master's page stays at or below today with them
  (section 1).
- **If 211 goes first, it must be applied again after 204..210 land:** 208 restates `get_unlisted_dossier`.
  Executed: 203 + 211, then 204..210 → the link read no longer calls the veil; it differs from the in-order chain
  in that one function. The CLI will also see 204..210 as older than the remote head.
- **The rollback for 211 alone** is the down file plus 203's `get_unlisted_dossier`. The down file restores 208's
  body. Executed: down file + the 203 body (`pg_get_functiondef` of a 001..203 chain, with its grants unchanged) →
  0 lines differ from 203. The statement is the 203 body as `CREATE OR REPLACE FUNCTION public.get_unlisted_dossier(p_slug text) … where s.unlisted_slug = p_slug and s.visibility = 'unlisted' limit 1`
  (the lane can paste it from a 203 chain).

## 4. What decides it: one read-only count

Run before anything, in the SQL editor:
```sql
begin transaction read only;
select count(distinct s.id) as shares_hiding_a_relationship_by_hand, count(*) as hand_hides
  from public.settlements s,
       jsonb_array_elements(case when jsonb_typeof(s.gallery_member_overrides #> '{$veil,deltas}') = 'array'
                                 then s.gallery_member_overrides #> '{$veil,deltas}' else '[]' end) e
 where (s.is_public or s.unlisted_slug is not null)
   and e -> 'hidden' = 'true'::jsonb
   and (e ->> 'address' like 'field:relationship:%' or e ->> 'address' like 'card:relationship:%');
select count(*) as links_that_would_revive from public.settlements where unlisted_slug is not null and visibility <> 'unlisted';
rollback;
```
On the probe database the first count found exactly the 22 affected shares (every eye shut, with relationships),
and the second found 0.

**Reading it:**
- **Both 0:** apply **211 alone now** (SAFE). It closes the live leak for every share, with no regression a
  visitor can see beyond the date label and opened defaults hidden again. Then run the read-only block's
  section (2), whose refused copies go dark at 211. Afterwards, apply 211 again once 204..210 land.
- **The first above 0:** those shares' hand-hidden relationship descriptions become visible on their gallery
  pages. Either cure section 2 first, or accept it knowingly: those strings are in today's response already,
  while 211 stops every other veiled string. That is the owner's call, and the count is its size.
- **The second above 0:** those party links come back to life at 211 (and at 208). Revoke them first.

**Not 204..211 together ahead of the client,** because of 208 (section 3).
