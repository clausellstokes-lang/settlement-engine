**NO VERDICT YET: PHASE 1 (THE COLD PASS) DONE AT THE JOINED TIP ad093c92c; PHASE 2 WAITS FOR THE CHAIR'S "FINAL".** REVIEW-VEIL-9, the fresh security
reader of migration 212 (the owner's rule: 212 is not applied until a fresh reader clears its final text). Three findings
HIGH by the law (V9-1, V9-2, V9-3) and one LOW (V9-4), all executed, each reported to the chair. 212 at this tip is
`46389052…bce0b` (NOT final: the builder works on). Until section 7 of this file says CLEAR at a named checksum:
**do not apply 212.**

# REVIEW-VEIL-9

Nothing outside this branch is changed by this seat. Every database is a scratch PostgreSQL 16.15 cluster in this
container (unix socket only, `listen_addresses = ''`, trust auth). No hosted database, no production credential.
Worktrees, all detached: ad093c92c (the joined tip, `lane/veil-17-2026-11-19`), db832c892 (origin/master, for its
generator and stored shape), 4fa35f294 (the veil lane before the join, the baseline). One `HUSKY=0 npm ci`
(the shared git config was not written: diffed before and after). Probes: `probes/REVIEW-VEIL-9/`.

Checksums at ad093c92c, read by me: 211 `eface6d0…be0b01`, its rollback `ce8474ff…49712f` (the frozen pair);
212 `46389052…bce0b`, its rollback `5b3eb697…6d3f694f`.

THE COLD PASS'S RULE FOR ITSELF: the builder's hand-back (PART 18) and the commit bodies of the join were not opened
before this section was written and pushed.

## 0. Findings (EXECUTED unless a cell says PLAUSIBLE or READ)

| Id | Rank | What | The read, the town, the bytes that arrive | 211 alone? |
|---|---|---|---|---|
| **V9-1** | **HIGH** by the law (a boolean derived from a hidden house, written as a sentence) | **PR #75's twin `gatesSmugglersLine` / `GATES_KEPT_SMUGGLERS_BENEATH` (`src/generators/safetyLineTruth.js`, fa5c964b5 and 7a4b48a84, 2026-11-15) chooses its sentence AT BIRTH by whether a house named smuggling network/operation or underground network/city stands; when the share hides that house whole, the twin chosen by it still ships.** Not in master db832c892 nor in the veil lane 4fa35f294: the join brings it. Never names the house, so no name rule reaches it. | Born Mayanek (tp0x33; stored roster "Smuggling operation", Criminal; served roster: none), every eye shut, reveal off: `economicState.safetyProfile.guardEffectivenessDesc` = "…The town watch keeps the gates, but smugglers have ways in beneath the walls."; the same in `publicProse.blocks.defense:posture.{posture,terrain}.field`; drawn on the Defense tab. **5 of 24 born new-shape towns, every read (gallery, link, import), reveal off and on, live and frozen, and under the DEFAULT veil** (`out/out-v91-census.txt`). Counterfactual by the generator's own function (`v91-counterfactual.mjs`): over the stored roster it writes the sent sentence; over the SERVED roster, "Everyone comes and goes by the gates, so smugglers have to get past the town watch." In the size-conditioned corpus (`assoc2-kept.txt`, 612 births) the sentence occurs in 28 cities and 43 metropolises that hold a hideable house and in none that hold none. | YES, the same bytes (a clone of 001..211 holding the same rows) |
| **V9-2** | **HIGH** by the law (a label derived from the hidden house), FOR THE CHAIR'S RULING ON SCOPE (the default veil) | **Under the DEFAULT veil (a share marked by the tree's own `writeShareVeil({}, [])`, no hand hide) every criminal house is withheld whole, and the people who hold them are sent with roles that name each house's kind.** Master's stored shape: the criminal person's `role` itself ("Thieves' Guild Master", "Smuggler Chief", "Assassin Guildmaster", "Black Market Fence", "Underground Broker", "Crime Lord"), gallery and PARTY LINK, reveal OFF and on. New shape: the server strips `npc.institution` = `{key: <house>, title: <holder title>}` and sends `role` and `title` equal to that stripped title verbatim (Reveal DM on). The name sweep misses both ("Assassin Guildmaster" is not "assassins' guild" on a boundary; "Thieves' Guild" is excepted as an open power's name). A hand hide of every eye withholds the roles; the default does not. | Master's shape (`dvm212`: the 24 master-shape births of the cold run, each stored with the default veil; 203+211+212): in towns whose every criminal house is withheld, 19 criminal people arrive on the gallery and the link, reveal off and on. Vatanhiid ("Assassins' guild" hidden whole, no criminal power shown): the link sends Mönkhtsetseg Borjigin = "Assassin Guildmaster", drawn on the NPCs and Relationships tabs (`out/page-vatanhiid.txt`). New shape (`dv212`, 001..212): 32 people in 12 of 24 towns, e.g. Mayanek (only hidden house "Smuggling operation"): Akna Ku `role`/`title` = "the smuggler"; Fionnford "the black marketeer"; Fonteporta "the guildmaster of thieves" (`out/out-v92-holder.txt`, `holder-census.sql`) | YES (`dv211`, `dvm211`: 34 and 19) |

| **V9-3** | **HIGH** by the law, V9-1's class, OLDER (in master db832c892 too) | **`spatialGenerator.js:228` adds the quarter "Shadows District" ("Narrow alleys, hidden markets, criminal activity"; landmarks The Rat's Nest, Blind Alley, The Warren) at birth if and only if a house whose name holds "Thieves", "criminal" or "Black market" stands; hiding those houses whole leaves the quarter.** | 7 of 24 born towns in EACH stored shape, every read (gallery, link, import), reveal off and on, live and frozen, **every eye shut by hand** and the default veil. Khutulunkum (tp0x17), every eye shut, link, reveal off: criminal houses stored six, sent none; `spatialLayout.quarters[5]` = Shadows District / "…criminal activity" (`out/out-v93-shadows.txt`). Corpus: 51 of 53 cities with a hideable house, 0 of 15 without | YES |
| V9-4 | LOW (V9-1's class; narrow: the one town also shows a criminal POWER) | **The stress flag `merchantCriminalBlur` (`priorityHelpers.js:626`: `inst.hasMerchantGuild && inst.hasCriminalInst`, the criminal-house flag) chooses `economicState.situationDesc` ("Trade is brisk, and it is hard to say where honest business ends and crime begins…") and the power desk's structure-flag sentence ("…the money behind the rackets is the same money").** `religiousFraud` reads the same flag (not met in these births). | Mayanek (only hidden house "Smuggling operation"; the shown power "Thieves' Guild"), every read and share kind (`out/out-blur.txt`) | YES (birth-time) |
| NOTE | for the chair | The crime_wave tension is drawn `if (hasCriminal)` (`historyGenerator.js:469`); it is a card with its own eyes (shut by hand, withheld). Handler ties ("The Patron No One Names") and the trace's "The allegiance runs to the town's criminal power" ride Reveal-DM reads; the trace is the builder's item B (a07). | corpus only (`assoc2-kept.txt`) | — |

**The class, said once for the owner:** a name search can never see a sentence that was CHOSEN by a hidden house and does
not name it. V9-1, V9-3 and V9-4 are three members found by association over 612 births (`assoc.probe.jsx`,
`assoc-merge.mjs`: a sentence form sent where every hideable house was withheld, occurring in towns that hold one and in
none that hold none, conditioned on size). The list is not proved complete: the corpus's rarer forms (1,222 kept, most
of them big-town noise or the shown criminal POWER's own text, which the floors keep by ruling) were read only by
their head.

### What the cold pass found held (each executed)

- **The earlier readers' library** at ad093c92c (`out/run-all-at-ad093c92c.txt`): 37 checks, 35 pass; the two known open (a07, d06), as at the baseline 4fa35f294; server against twin 15 of 15 equal; V7-10 and V7-6 rows pass.
- **Names in scripts with no Latin letter, on BORN towns** (no earlier reader planted them on born towns): 11 born towns (village to metropolis; calm, infiltrated, insurgency, occupied, indebted) whose every hideable house was renamed into Han, Hangul, kana, Cyrillic, Thai, Greek, Hebrew, Arabic, Armenian or Georgian, every occurrence of the birth name in any case replaced in every string and key, the public prose composed again (`script.probe.jsx`). On 001..212: **no such name in any of 308 reads** (44 shares, every eye shut, reveal off and on, live and frozen: gallery, link, map, map link, card, import, map import; `out/names-s9.txt`) **nor on any of 88 drawn pages** (1,664 views, 5 MB of text; `out/page-s9.txt`). NEGATIVE CONTROL: the same rows on 001..211 send them in 16 paths (`out/names-s9b.txt`).
- **The drawn public page on the born towns** (`page.probe.jsx`: the joined client's own `fetchPublicDossier` and `PublicDossierView`, every group, sub-tab and disclosure): 192 shares, 384 pages, no page model missing, no render threw; no form of a hidden house's name on any page (`out/page-ct-*.txt`); the planted markers on pages with every eye shut are only the earlier readers' named classes (the receipt's copies, an impression that repeats ANOTHER person's appearance).
- **The stored public prose by counterfactual** (`prose.probe.jsx`): 88 served reads; no sentence sent that the composer writes only with the hidden houses. CONTROL: 36 sentences the composer writes only with them (the power desk's "There is money at … that does not come from the market…") are all withheld.

- **The earlier readers' born run** (`REVIEW-VEIL-7/born/run-born.sh`, both shapes: 001..212 with the joined
  generator, 203+211+212 with master's): births and reads raised 0, threw 0; the planted-marker table holds only the
  named classes (the notes on Reveal DM; the generation receipt's copies; an impression repeating ANOTHER person's
  stock phrase, as ruled; master's V6-5 dependency row); `names-anyform` only the schema keys; `text-anyform` only the
  person-id joins; flags and roles censuses clean; the sweep takes nothing from a born town; stub census 0; the edited
  sources leave the second homes as stored (one generic legacy annotation with no effect clause, Kitaji, sent alike:
  built from the event's type and the present state, not from a hidden source). My Unicode fold over the same
  databases (`names-unicode.mjs`): only a schema key whose value is false.
- **Need lists**: no chain whose need is the criminal economy survives where every criminal house is withheld.

### What the cold pass did not do
- The 720-town census corpus was not rendered; my association corpus is 612 births, the page probe 24 towns a shape.
- The twin (client) was compared with the server only through the library's 15 shares and by using it for the corpus.
- Snapshot shares built by master's client (V6-3's frozen copy) were not re-planted; the map reads were searched by
  name only.

## 9. Instruments (made before the cold pass)
- The cluster, `pg@8.13.1`, the earlier readers' library from 72a3bb24f (outside every tree), a detached worktree of
  origin/master (db832c892; `HUSKY=0 npm ci`, so the shared git config was not written: diffed before and after).
- Baseline, the library at the veil lane's pre-join tip 4fa35f294 (212 `46389052…bce0b`): 37 checks, 35 pass, the
  two known open (a07, d06); server against twin 15 of 15 equal; V7-10 and V7-6 rows pass.
- My own probes (`probes/REVIEW-VEIL-9/`): a fold for every script, the rendered public page, the stored public prose
  by counterfactual. The blind spots of the earlier cold passes they answer: a case-sensitive search (REVIEW-VEIL-6),
  a name with no Latin letter (REVIEW-VEIL-7's V7-1; the library's searches still folded with `[^a-z0-9]`), a hidden
  effect inside a composed note (V6-10); and one of my own: no earlier reader read the PAGE drawn at the joined tree,
  whose new display builders (PR #75 points 33 to 73) compose sentences on the reader's side; nor a sentence CHOSEN by
  a hidden house without naming it (V9-1's class), which a name search cannot see by construction.
- Hooks: `core.hooksPath` is unset in this clone and `.git/hooks` holds no hook, so a plain push runs none; I did not
  install husky's (that writes the shared config). No push used `--no-verify`.
