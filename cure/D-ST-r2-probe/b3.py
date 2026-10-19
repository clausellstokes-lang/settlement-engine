from edit_lib import apply
C = '[CURED 2026-10-18 (fp-final r2) — '
pairs = [
(r"""  fundingSet?,          // a DM-set FUNDING_BAND; absent = derived each read (ST6)
""",
r"""  fundingSet?,          // a DM-set FUNDING_BAND — a CEILING: the effective band is min(fundingSet, derived) (ST6)
  wantSince?,           // the tick the EFFECTIVE band of a tied holder first read `unfunded`; dropped when it reads above (§6.1 step 3)
"""),
(r"""  hidden?: true,        // unknown to the world's courts until revealed or until its holder acts (J384 (10): holy and cult sites DM-only by default)
""",
r"""  keptSecret?: true,    // in no court's belief until `made_known` or until its holder acts where it is felt — COURT knowledge only; the party's view is the map's reveal list (J384 (10)'s "DM-only by default" is AUDIENCE: the hard-deny + the reveal list)
"""),
(r"""  offerRef?,            // an adopted site: the map's offer id (provenance; ENC-HP-01)
""",
r"""  offerRef?,            // an adopted site: the map's offer id (provenance; ENC-HP-01)
  mapSiteRef?,          // the map's own site id — the JOIN KEY carried both ways (adoption, retirement at a founding, re-emission at a death)
"""),
(r"""  events: [{ word, tick, causedBy, by? }],                              // SITE_EVENTS, newest last, bounded ring of 8 (DRAFT, UNMEASURED); the map's dated statuses (ENC-HL-02)
  sinceTick, lastTick,
}
```
""",
r"""  events: [{ word, tick, causedBy, by?, from? }],                       // SITE_EVENTS, newest last, bounded ring of 8 (DRAFT, UNMEASURED); the map's dated statuses (ENC-HL-02); `from` = the prior kind on `rekinded` only
  sinceTick, lastTick,
}
```

""" + C + r"""ST-r2-16 (`wantSince`) · HOST-r2-8 (`mapSiteRef`, `from`) · HOST-r2-19 (`keptSecret` replaces the compile's `hidden`, whose word was the map's PARTY secrecy state) · ST-r2-1 (`fundingSet` a ceiling): each round-2 field drop-when-absent, declared under OD-ST-1's taking (OD-ST-34).]
"""),
(r"""[REFINED 2026-10-18 (fp-final) — `band` and `cult` are holder REF kinds on this record only, never actor kinds of the convention; the convention widens by `site` alone (§7.3).]""",
r"""[REFINED 2026-10-18 (fp-final) — `band` and `cult` are holder REF kinds on this record only, never actor kinds of the convention; the convention widens by `site` alone (§7.3).] [STOP ST-r2-14: whether the convention widens by `site` at all is the chair's (§7.3); `band` and `cult` stay holder refs either way, and a band or a cult on a hearing card rides the `subject` dial as its holder ref (SEAMS-r2-15).]"""),
(r"""aspatially graph hop 1 `nearby`, hop 2 `distant`. Nothing beyond `distant` is attached.""",
r"""aspatially graph hop 1 `nearby`, hop 2 `distant` — a PROXY: the relationship graph links courts that deal with each other (trade partners may lie a realm apart), so aspatially "attached" means near in the world's dealings, not on the ground; the canonized arm is the geographic one (PLAUSIBLE: the graph's density is not measured here) """ + C + r"""ST-r2-32 (2)]. Nothing beyond `distant` is attached."""),
(r"""| `crossing` | bridge, ford, pass (always on a road) | the canon's crossings (H16) name the GATE; a crossing site is a held structure there |""",
r"""| `crossing` | bridge, ford, pass (always on a road) | the canon's crossings are H5/H22's travel slot; the GATE is the digest's and its keeper the territory's holder (J385; PS2); a crossing site is a held structure at that gate, never its keeper """ + C + r"""ST-r2-2 · HOST-r2-3] |"""),
(r"""| "camp" when it is a working camp |""",
r"""| "camp" is the host document's word with no defined meaning (host law 10): its mapping is the map program's (RULINGS-ROUND2 D Q1; the fold's map INBOX (i)) """ + C + r"""ST-r2-30 (2)] |"""),
(r"""| `harbour_works` | lighthouse, mole, naval station (on a port node) | — |""",
r"""| `harbour_works` | lighthouse, mole, quay — only on an ELIGIBLE PORT (`distanceRead.js :: isPort`, M8's geography ∧ institutions); the works never confer eligibility, and a navy is W-NAVY's (an institution IN the town), never a site """ + C + r"""ST-r2-3 · HOST-r2-20] | — |"""),
(r"""(quality fixed `ruined`; re-kinding is `END_SITE` then `PLACE_SITE`)""",
r"""(quality fixed `ruined`; re-kinding is ONE `SITE_KIND` act that keeps the id — `rekinded`, §6.2 """ + C + r"""HOST-r2-8 (3)])"""),
(r"""the full alignment is OPEN QUESTION Q1 to the chair (one vocabulary where they meet; a map kind with no row here maps to the nearest kind or is refused as an invented fact, the host's law 10).""",
r"""the full alignment is OPEN QUESTION Q1 to the chair (one vocabulary where they meet; a map kind with no row here maps to the nearest kind or is refused as an invented fact, the host's law 10) — RULED (RULINGS-ROUND2 D Q1): ST maps the host document's words now (fort · watchpost · ruin · crypt · camp · holy place); V14's full list is asked of the map program."""),
(r"""| what the holder can spend on it (ST6).""", r"""| what the holder can spend on it — the EFFECTIVE band `min(fundingSet, derived)` (ST6)."""),
(r"""| `placed · adopted · garrisoned · held · abandoned · taken · cleared · reclaimed · breached · worn · destroyed · restored · conveyed · ceded · granted · seized · consecrated · sold · besieged · relieved · ended` | each a DATED event on the record (ENC-HL-02's five — `garrisoned · abandoned · destroyed · cleared · restored` — are among them); `breached` and `worn` step quality down by one band (siege · neglect), `destroyed` sets it to `ruined`, `restored` steps it up by one |""",
r"""| `placed · adopted · garrisoned · held · abandoned · taken · cleared · reclaimed · breached · worn · destroyed · restored · conveyed · ceded · granted · seized · consecrated · sold · besieged · relieved · ended · made_known · kept_secret · rekinded` | each a DATED event on the record (ENC-HL-02's five — `garrisoned · abandoned · destroyed · cleared · restored` — are among them); `breached` and `worn` step quality down by one band (siege · neglect), `destroyed` sets it to `ruined`, `restored` steps it up by one; `made_known` / `kept_secret` clear and set the court veil (`keptSecret`); `rekinded` changes the kind (and name) keeping the id; a DM's direct quality set writes one `worn` or `restored` per band moved (or `destroyed` to `ruined`) """ + C + r"""ST-r2-23 · HOST-r2-19 · HOST-r2-8] |"""),
(r"""- `fundingBandOf(worldState, siteId, snapshot) → FUNDING_BAND` — `fundingSet` if present; else by holder: a settlement's `prosperityRank01` (`< 0.2` unfunded · `< 0.45` meagre · `< 0.8` funded · else lavish, DRAFT);""",
r"""- `settlementFundingBand(worldState, settlementId, snapshot) → FUNDING_BAND` — THE ONE settlement band: its `prosperityRank01` (`< 0.2` unfunded · `< 0.45` meagre · `< 0.8` funded · else lavish, DRAFT), exported for THE PATROLS' pay gate (PR §3.1) """ + C + r"""SEAMS-r2-12: PR needs a settlement-keyed band; the site read was keyed by site].
- `fundingBandOf(worldState, siteId, snapshot) → FUNDING_BAND` — the EFFECTIVE band `min(fundingSet, derived)` """ + C + r"""ST-r2-1]; derived by holder: a settlement by `settlementFundingBand`;"""),
(r"""- `siteWitnesses(worldState, place) → [settlementId]` — the attached towns that see a place through a held watchtower (ST17).
- `siteDefenseOf(worldState, settlementId, snapshot) → number` — the keep's `homeDefense` term (§4.1).""",
r"""- `siteWitnesses(worldState, place) → [settlementId]` — the holders whose held watchtower (or held harbour works, at its port) watches a place: a REGISTERED INPUT of THE PATROLS' `witnessedCrossing` (PR §6.5 already reads it), never a witness set of its own and never a `partyIds` write (ST17) """ + C + r"""ST-r2-11].
- `siteDefenseOf(worldState, settlementId, snapshot, deployments) → number` — the keep's `homeDefense` term with its attacker-free holder rule (§4.1).
- `garrisonBandOf(worldState, siteId, snapshot) → might key` — a held `fortification`'s or `watchtower`'s garrison band: `100 × F × Q` on `display/armyStrength.js :: STRENGTH_BANDS`' floors (78/60/42/26/0) in MN's keys (`thin · modest · capable · strong · formidable`); the map's H13 `PolitySite` ("held sites (forts, watchposts) with holder and garrison band") and the patrol round trip ("measured from the nearest garrisoned seat or site") read it """ + C + r"""HOST-r2-9].
- `believedDenOf(worldState, courtId, siteId, snapshot) → { known, holderRef?, mightBand?, sinceTick? }` — what a COURT believes of an untied-held site: in the omniscient arm the truth, except that a `keptSecret` site is never known and an arrival is known from the tick after it; in the belief presets the court's picture from the tellings of the site's `site_taken` news it holds (the anchor as the involved settlement; the might through MN17's might↔magnitude map); unheard ⇒ not known """ + C + r"""ST-r2-15]."""),
(r"""| `untied` | 0 src (1 test, 4 docs prose) | the holder CLASS value; FREE |""",
r"""| `untied` | 0 src (1 test, 4 docs prose) | the holder CLASS value; FREE |
| `settlementFundingBand` · `garrisonBandOf` · `believedDenOf` · `mapSiteRef` · `wantSince` · `keptSecret` · `kept_secret` · `made_known` · `rekinded` · `SITE_KIND` · `KEEP_CLOCK_WEEKS_MAX` | 0 src · 0 tests · 0 ledger docs (`cure/D-ST-r2-probe/tokens-r2.out`) | FREE — minted in round 2. `concealed` REFUSED (16 src files: the siege visibility a GM conceals from the public — an AUDIENCE word) and the compile's `hidden`/`revealed` WITHDRAWN (the map's PARTY secrecy states, ENC-MS-02: "DM only · revealed · discovered"): the court veil takes `keptSecret` / `kept_secret` / `made_known`, a registered pair with the map's words in the fold §5 MAP REGISTER (the chair's P4 row) """ + C + r"""HOST-r2-19] |"""),
]
apply(pairs, 'b3')
