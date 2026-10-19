from edit_lib import apply
C = '[CURED 2026-10-18 (fp-final r2) — '
pairs = [
(r"""| `worldSitesEnabled` | the record, the DM's four verbs,""", r"""| `worldSitesEnabled` | the record, the DM's five verbs,"""),
(r"""route cost (`scoreRoute`), and what a town has heard (the witness set).""", r"""route cost (`scoreRoute`), and what a town notices (THE PATROLS' `witnessedCrossing`, through ST's registered input)."""),
(r"""the presence feeder and suppressor, the witness set, the `scoreRoute` term)""", r"""the presence feeder and suppressor, the watch inputs of `witnessedCrossing`, the `scoreRoute` term)"""),
(r"""the danger feeder/suppressor, the den's threat input |""", r"""the danger feeder/suppressor, the den's `raidHot` membership |"""),
(r"""**ST1 — A SITE IS ON THE LAND; AN INSTITUTION IS IN THE TOWN.** A site is a""",
r"""**ST1 — A SITE IS ON THE LAND; AN INSTITUTION IS IN THE TOWN.** """ + C + r"""HOST-r2-9: ST owns SITE garrisons only — a held site's garrison band is `garrisonBandOf` (§2.4); a SEAT's force band and garrison presence (H13's `PolitySeat.military.forceBand` and `.garrisonPresent`: "no garrison or standing band exists today, so it must be created") are not sites, and their owner is a slot for the war volume's capacity facets (J384 (4)'s measure) — the fold §3.1.29's "garrisons and held sites are THE SITES'" is routed to narrow to SITE garrisons.] A site is a"""),
(r"""| TR/EC (trade, economy) | BY THE ONE READS — `scoreRoute`'s site term; EC-6's toll arm is the slot for a site's tolls;""",
r"""| TR/EC (trade, economy) | BY THE ONE READS — `scoreRoute`'s site term; EC-6's toll arm is the slot for a site's tolls (a crossing's holder takes a SHARE of the gate's toll, never the gate);"""),
]
apply(pairs, 'b10')
