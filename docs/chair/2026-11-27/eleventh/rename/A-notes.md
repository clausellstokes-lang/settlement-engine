# (A) notes: the census of view-time picks (a read-only census by a delegated reader at cccda7569; checked against the executed pick log of (B)/(D) by this seat: every name-keyed site the log saw is in A-keys.tsv)

# A-keys census: notes (draft)

Tree: /home/user/settlement-engine at cccda7569. Static read only: nothing run, nothing changed.
Rows: /tmp/rename/A-keys.draft.tsv (33 sites, A1 to A33).

## Conventions
- POWER_NAME = a faction's or an institution's name (as the brief defines it). HOUSE_NAME: no key holds one.
  The code's "house" is either an institution row (dailyLife `{house}`) or a person's first-rank power
  (tonightSheet `{house}`). Both fill the TEXT only, never a key.
- "Fallback" means the `??` / `||` chain as written. `_seed ?? id` falls through only on null/undefined.
  `c.id || c.name` also falls through on ''.
- Shared page: `_seed` and `_config` are stripped from every shared projection (publicSafe.js:48-91). The
  seeded desk prose, the governance paragraph, the ring note, the identity line, viability (flag
  canonicalViewModel) and the tradition rows are composed at SAVE on the owner's record
  (publicProseCompose.js; shownTraditions.js :: sharedTraditionRowsOf). They therefore carry the owner's key as
  of the last save. Daily Life is the exception: DailyLifeTab derives it on the shared document at view, keyed
  on the name, which the shared document keeps.

## Counts
- 33 sites. 30 print on a surface today. A32 and A33 (tensionCause) have no importer in src outside tests.
  A14 (connective) is very likely dormant, and A24 is a seeded PRNG rather than a keyed hash.
- By method: rendezvous-by-id 19 (A1-A12, A17, A19, A20, A26-A29; A8 uses the branch name as its id). Ranked
  door or ranked walk 3 (A22, A23, A25). Index-modulo 9 (A14, A15, A16, A18, A21, A30, A31, A32, A33).
  Other 2 (A13 is a hash ORDER; A24 is a PRNG).
- Keys holding TOWN_NAME, PERSON_NAME, HOUSE_NAME or POWER_NAME: 24 sites (22 print today; A32 and A33 are
  unwired): A1-A11, A15, A16, A17, A18, A19, A20, A21, A26, A28, A30, A31, A32, A33.
  - TOWN_NAME as the primary part: A1-A10 (every Daily Life slot, `${name}::dailyLife.<slot>::<branch>`),
    A16 foodGap, A18 crisis summary column, A19 fortune merit, A20 fortune lasting, A26 PDF overview headline
    (falls back to the tier word), A32 and A33 tensionCause (unwired).
  - TOWN_NAME as the last fallback only: A11 viability (`_seed ?? id ?? name`) and A21 arrangementOf (same chain).
  - PERSON_NAME: A28 npcs headline (primary). A17 castWantOf, A30 and A31 honorifics (each a fallback behind
    PERSON_ID).
  - POWER_NAME: A15 conflict hook (both parties' stored names) and A30 honorific (the institution's name).
  - HOUSE_NAME: none.
- A22 and A23 fall back to the tradition's NAME when the record has no id (OTHER, not one of the four classes).

## Changed since the earlier census (TAIL-SITES.tsv, tree 1f946c43f1)
- Now pickRendezvous or the ranked door: withRingVantage (rankRendezvous, rows RING-1 to RING-4); cultureScopeLine
  (SCOPE_LINE_FRAMES ids); castWantOf (rendezvous over the admitted lines); the PDF headlines (module-level
  rows, seedPick = pickRendezvous; an empty key now takes the FIRST row); fortune merit and lasting (rendezvous
  on A/B/C as drawDeclared's `draw`); traditionDescription draw/drawTurn (drawDeclared `rankKey`, a
  rankRendezvous walk); Daily Life and viability (point 120).
- Still index-modulo: hookLines conflict and foodGap (fnv1a32 % n), tensionCause (pickVariant, still unwired),
  arrangementOf.
- New to this census: A18 crisisSummaryVantage :: summaryColumnOf (`${name}::${kind}` % 4; Defense tab, Tonight,
  PDF cover/overview/defence). The earlier census missed it because it matches `% SUMMARY_COLUMNS`. Also new:
  the honorific picks (A30, A31), the salience order (A13), the genesis preview (A24), and A21 written out per slot.

## Fallback hazards worth noting
- A16 foodGap: a nameless town keys `::<band>::food-gap`. A27 economics headline: the key holds no town.
  A21: an empty seed keys `::<slot>`. In each case every such town prints the same line.
- A15 conflict hook: the 2nd and later conflicts of a family take (base + used) % n. Base is the FIRST conflict's
  key, so the order of conflicts on the page and the first conflict's party names set the later lines.
- A25 needs `_seed` itself (no id fallback). A29 is the same.
- A11 viability, A21 arrangementOf and the desk seed differ: viability and arrangementOf fall to the NAME, while
  the desks (A12) fall to '' (canonical-at-zero).

## OUT (looked like prose picks; excluded)
- causeConjunctionContent.js / causeLifecycleVocabulary.js (People tab card): needs npc.compromiseLifecycle,
  written only by worldPulse (earlier census, CONFIRMED there; importer still npcComponents.jsx).
- heraldCausalGrammar, heraldCausalVoice, discourseKernel, cascadeBraid, newsBody, newsVoice, chronicleReadModel,
  chroniclersLetter: every importer is under src/components/map (git grep, this tree).
- marketPrices.js :: crierLineFor: keyed on the good's id only, `${goodId}::${tag}`. Prints only for a
  shortage/surplus band, which comes from a campaign ledger (marketPrices.js:248-257).
- settlementRumors.js :: widenedPhrase / frameHeadline: reads worldState.rumorLedgers (settlementRumors.js:966).
- warAndRoadNames.js :: pickLine: keyed on worldState.deployments (earlier census).
- traditions/prose.js :: pickLine (traditionHook): needs suppressedBy/restoration/lastOutcome, which a world tick sets.
- traditions/politics.js :: assignOwnership (PRNG `<seed>::tradition:owner`): reached only from worldPulse.
- powerDeskRead.js :: powerLadderRead (DS-POW-3, seed `${_seed ?? id}::${factionName}`, a POWER_NAME): dark at
  birth. npcLadder is written only by worldPulse/npcLadderKernel.js, and PowerTab hides the section without it
  (powerStateProse.js:613-617). It would be a POWER_NAME key after an advance.
- stateProse/decreeProse.js (`${seed}::${entryId}`) and causalDossierProse.js: an advance path, or no importer
  (earlier census).
- stateProseKernel.js :: drawFace: no variant in src/data/dossierStateProse carries `wordings` (grep count 0), so
  it is always face 0. A vid-less fallback in drawVariant: every shipped variant carries a vid.
- prose/passageShapes.js :: drawPassageShape: no importer in src (reports/tests only).
- foodways.js: composeFoodwaysLine (fnv `foodways|<identity>`) runs at generation only (foodGenerator.js).
  foodwaysLineOf re-voices the STORED line, with no hash (fedLineOf reuses the stored frame index); its
  sibling resolve keys on the poolId (a constant).
- generators/history/troubleHooksOf.js: run at birth by historyGenerator.js:593 and stored on the tension.
- data/npcData.js :: pairProse (tie prose, pair-hash fallback `${r.name}>${s.name}::salt`): written by
  generateSettlementPipeline.js :: refreshRelationshipProjections and stored. Generation, so OUT, but it holds two
  PERSON_NAMEs if it ever runs at view.
- data/historyData.js :: tensionWording / historyDescription (pickVariant `${_seed}::tension::${type}`):
  historyGenerator only.
- npcStructure / factionDynamics seat-holder / safetyProfile / institutionDescDraw / assembleInstitutions /
  settlementOriginProse / narrativeGenerator pickVariant(Mixed): no importer outside src/generators.
- facts/supplyStory.js :: seedPicks (venture abandoned/failing): "the birth only". The view reads BIRTH_PICKS
  or the record.
- roles/roleClass.js :: resolveTieKey: generators/npc/tieKind.js only. crisisCast.js :: castHash: cast derived
  at generation (resolveCrisisCast) and stored as entry.cast.
- data/cultureProfiles.js :: resolveKnown: an rng-based pick at generation.
- governsLine (settlementQuickGuide.js:573): no hash pick; it prints the governing power and stability.
- guidanceNotes.js :: noteKeyFor: the library dashboard (SampleDashboard.jsx), not a town page.
- resourceSites.js (bearing/band by mixedHash32): reached only from undercity. tableEvents/entityLinks/plantLedger/
  Editable/worldCode/economyFingerprint/captureSidecar/activeConditions/threatProfile shortHash: ids or checksums,
  not prose. FACTION_COLORS[i % n], AccountMenu, aiSlice rotation: not keyed picks.
- Map, cartography, scene, undercity, realm map, admin, anon salt, ornament fnv and tab strips: out of scope by
  the brief.

## Could not class / open
- A13 salience order: whether a different order ever changes which modifier prints (under the fact budget and the
  seats) is not established by reading. The sort and its key are certain. PLAUSIBLE.
- A14 connective: whether any reachable (relation, seat) list holds more than one phrase today was not
  re-measured. The earlier census's G79 (5) found 0 of 2,160 joints drawn.
- A24 genesis preview: whether a fresh record's `traditions` mirror is empty (so the preview prints) depends on
  generation output I did not trace. A22 and A23's rec ids come from this preview (slug of the seed).
- A30 and A31 pick a title WORD (an honorific form), not a sentence. I listed them because they are view-time and
  person/institution-keyed. Drop them if "flavour line" means sentences only.
- A15 `rawIssue` is a stored label that may itself carry a power's name. I did not trace what the conflict
  generator writes there, so it is classed OTHER.
- A19 `event` is the stored event name. Whether event names embed the town's name was not traced, so it is classed OTHER.
- Share-page currency: sites composed at save keep the old key's line until the next save after a rename. This
  was not measured.
