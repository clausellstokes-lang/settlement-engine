from edit_lib import apply, F
C = '[CURED 2026-10-18 (fp-final r2) — '
s = open(F, encoding='utf-8').read()
lines = s.split('\n')
def row(prefix):
    idx = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    assert len(idx) == 1, (prefix, idx)
    return idx[0]
i = row('| `site_taken` | ST (ST-2) |')
lines[i] = r"""| `site_taken` | ST (ST-2) | `site` | the week an untied force arrives at an UNHELD site | `held_by_them · driven_off` | CLIMAX | `held_by_them` — unless an attached tied court that BELIEVES it can contest the arrival (`believedDenOf`) sorties that week (§6.1 step 6): that sortie IS this hearing's contest (the clearer's force against the arriver's might on `SIEGE_VERDICT_BANDS`, one keyed draw, stream `site_taken:<siteId>:<tick>`), and no `site_cleared` is minted for the same arrival """ + C + r"""ST-r2-17] | the arriver `{ kind: 'menace', id }` — or, for a band, its holder ref on the `subject` dial with the anchor settlement as the card's anchor (SEAMS-r2-15) — the site as the card's WHERE [STOP ST-r2-14] | a draw bias on the contest, ±0.05 / ±0.15 (DRAFT; MN's idiom) |"""
i = row('| `site_cleared` | ST (ST-2) |')
lines[i] = r"""| `site_cleared` | ST (ST-2) | `site` | the week a tied force moves on a site an untied force ALREADY held before this week (a sortie; a reclaim's `moves`, at the week AFTER the reclaim; a grouped patrol; an army through ST-2b) """ + C + r"""ST-r2-17] | `cleared · repelled` | CLIMAX | the contest: the force's strength (its `offensive`, or the patrol's band) against the holder's might on `SIEGE_VERDICT_BANDS`, one keyed draw (stream `site_cleared:<siteId>:<tick>`) | the clearer `{ kind: 'settlement', id }` upon the holder (a menace actor, or a band's holder ref on the `subject` dial) | the same draw bias |"""
i = row('| `site_reclaim` | ST (ST-2) |')
assert lines[i].endswith('| the DM may decide either way; no tilt (a choice, not a contest) |'), lines[i][-120:]
lines[i] = lines[i][:-len('| the DM may decide either way; no tilt (a choice, not a contest) |')] + r"""| a bounded term on the fork's `reclaimScore` (§6.4): ±1 slight · ±2 heavy — the decider draws no randomness (requirement 24(b)) """ + C + r"""ST-r2-18] |"""
i = row('| `site_siege` | ST (ST-2b for armies; ST-2 for menaces) |')
old = lines[i]
a1 = "`holds · falls · relieved · lifted` — the siege kind's ONE vocabulary (`relieved` = ended by relief, the fold's R-10 meaning)"
assert old.count(a1) == 1
old = old.replace(a1, a1[:-1] + r"""; its producer is PL's ONE `relief_answer` (`sent`) for every siege's relief, RULINGS-ROUND2 A.7, or an army's victory over the besieger) """ + C + r"""ST-r2-29]""")
a2 = "with MN-r1-1's seasonal wear and the age ceiling (a siege that neither falls nor lifts for DRAFT 13 weeks lifts by exhaustion), so no endless `holds`"
assert old.count(a2) == 1
old = old.replace(a2, r"""one keyed draw (stream `site_siege:<siteId>:<tick>`); its CEILING by attacker — a menace's site siege: MN-r1-1's seasonal wear and the age ceiling (DRAFT 13 weeks, then it lifts by exhaustion); an army whose TARGET is the site (ST-2b): the war layer's own clock (`deploymentAge` against `SIEGE_MAX_AGE`); an APPROACH fort on a march: the REMAINING PS9 hold cap (§4.3) — so no endless `holds` """ + C + r"""ST-r2-10]. A menace MAY take a keep on the default where it may never take a town: a site holds no people, so its fall changes only its holder (a lair in prose) and the DM's hand undoes it, while a town's fall is a SACK of living people — "`falls` = a SACK, the DM's verdict only (the default is never `falls`)" (fold §3.4 `menace_siege`) """ + C + r"""ST-r2-29]""")
lines[i] = old
s = '\n'.join(lines)
open(F, 'w', encoding='utf-8').write(s)
print('§8 rows replaced')
pairs = [
(r"""| dark: `warDeployment.js` drops a site target exactly as today |""",
r"""| dark: a deployment carrying `siteTargetId` WITHDRAWS through the landed withdrawal path (one dark-after-lit path, §11 B), never `continue`; a world with none is byte-identical """ + C + r"""ST-r2-27] |"""),
(r"""HBF rows minted, each in its wave's commit (L10(a)): `siteClearedContest`, `siteSiegeVerdict` (each one keyed draw).""",
r"""HBF rows minted, each in its wave's commit (L10(a)): `siteTakenContest`, `siteClearedContest`, `siteSiegeVerdict` (each one keyed draw; `siteTakenContest` added in round 2 with `site_taken`'s folded sortie, ST-r2-17)."""),
(r"""measure `realmManifest.js` (474) and `realmVerbExecution.js` (663) for four entries""", r"""measure `realmManifest.js` (474) and `realmVerbExecution.js` (663) for five entries"""),
(r"""the four verbs' predicates""", r"""the five verbs' predicates"""),
(r"""measure the war layer's patch window (§4.2's STOP condition, then the fallback);""",
r"""measure the war layer's patch window (§4.2's STOP condition, then the fallback); measure `warSiegeVerdict.js` (180) for the keep clock and `relief01`'s denominator (+2) and run S19's grid against the built leaf; run the holder rule's car-0 pin (§4.1);"""),
(r"""`warDeployment.js` (+3: the breach); `display/warResolve.js` (+1);""",
r"""`warSiegeVerdict.js` (+2: the keep clock, `relief01`'s denominator); `warDeployment.js` (+2: the wrapped verdict); `display/warResolve.js` (+1);"""),
(r"""`martialReadiness.js` (+≤2: the untied threat input).""",
r"""`martialReadiness.js` (+≤2: the untied towns' `raidHot` membership); `pestilenceKernel.js` (+1: the care factor, canonized)."""),
(r"""FUNDING rides `treasuryEnabled` for coin (dark everywhere: the band is derived from prosperity or DM-set, so "the crown let its forts rot" reads prosperity, not a treasury)""",
r"""FUNDING is the EFFECTIVE band everywhere (the DM's band a ceiling over prosperity's), so "the crown let its forts rot" reads prosperity on every world; coin waits on the W-COIN car (ST6)"""),
(r"""(a) forks — `siteClearedContest` and `siteSiegeVerdict`, each `rng.fork('site:<kind>:<siteId>:<tick>')`;""",
r"""(a) forks — `siteTakenContest`, `siteClearedContest` and `siteSiegeVerdict`, each `rng.fork('<hearing kind>:<siteId>:<tick>')` — `site_taken:<siteId>:<tick>`, `site_cleared:<siteId>:<tick>`, `site_siege:<siteId>:<tick>`, the same key §8 names """ + C + r"""ST-r2-31];"""),
(r"""`hospice` (`care01Of`; the plague front), `watchtower` (the witness set — car-0 names the rumor road's witness seam; C1), `waystation`/`crossing` (`scoreRoute`'s per-hop term; C7/C14), `harbour_works` (the sea arms — car-0 names W10/W11's seams; C7).""",
r"""`hospice` (the front's care product, canonized; the outbreak's counterforce slot, aspatial), `watchtower` (an input of PR's `witnessedCrossing`; C16), `waystation`/`crossing` (`scoreRoute`'s per-hop term after the seasonal law; C7/C14), `harbour_works` (on M8's ports, D-6's S3 where `seaRoadsEnabled` lights, and W-NAVY's blockade — all landed; the canon with `navalEnabled`) """ + C + r"""ST-r2-3 · ST-r2-12 · ST-r2-11]."""),
(r"""**ST-4 — THE MAP'S WINDOW AND THE PARTY'S REACH.** The window rows (H17/H23) carrying `worldSites` to the map as the host record (one name chosen with the map — OPEN Q2); H13's `PolitySite` and the patrol round trip read it;""",
r"""**ST-4 — THE MAP'S CHANNELS AND THE PARTY'S REACH.** THE CHANNELS """ + C + r"""HOST-r2-7 · HOST-r2-9 · HOST-r2-10]: the record through DR-V14-1 (V08's host client; read as `WorldSite.host`, fact tier `dossier`; its name is the map's — RULINGS-ROUND2 D Q2); held sites through H13's `PolitySite` with `garrisonBandOf`; every dated status through H9's events window; `where.position` from the map's placement at adoption (ST20); the map keeps its site document, joined by `mapSiteRef`; AUDIENCE: DM-only by `WORLD_SNAPSHOT_HARD_DENY` (`'spatialLedgers'`), the party's view only through the map's reveal list (ENC-HS-01; the host's `MapRecord.party` when the bridge client lands), never a new allowlist; H28's holy-site adoption command is ST's adopt arm (one writer); the patrol round trip reads `garrisonBandOf`;"""),
(r"""| `warCapacityReads` 143 (+3) · `warDeployment` 685 (+3) · `warResolve` (+1) · `embattlement` 172 (+≤3) · `stressorGates` 609 (+≤6) · `stressorDynamics` 759 (+≤2) · `martialReadiness` 264 (+≤2) |""",
r"""| `warCapacityReads` 143 (+3) · `warSiegeVerdict` 180 (+2) · `warDeployment` 685 (+2) · `warResolve` (+1) · `embattlement` 172 (+≤3) · `stressorGates` 609 (+≤6) · `stressorDynamics` 759 (+≤2) · `martialReadiness` 264 (+≤2) · `pestilenceKernel` 169 (+1) |"""),
(r"""| the map's window, H13's held sites, the party's reach and reveal, the call board's den row |""",
r"""| DR-V14-1, H13's held sites (`garrisonBandOf`), H9's dated statuses, the party's reach and reveal, the call board's den row |"""),
]
apply(pairs, 'b8')
