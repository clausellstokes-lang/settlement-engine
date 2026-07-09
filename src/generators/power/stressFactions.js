/**
 * power/stressFactions.js — mutate the faction roster in place for each active
 * stress type (siege, occupation, famine, insurgency, wartime, …): reweighting
 * existing factions and injecting the crisis-specific ones.
 */
import { random as _rng } from '../rngContext.js';
import { getInstFlags } from '../helpers.js';

// applyStressEventFactions — apply every active stress type's power reweighting
// and faction injection to `factions` (mutates in place).
export const applyStressEventFactions = (factions, ke, P, S, config, institutions) => {
  (ke('under_siege') &&
    (factions.forEach((N) => {
      ((N.faction.toLowerCase().includes('military') || N.faction.toLowerCase().includes('guard')) &&
        (N.power = Math.round(N.power * 2)),
        N.isGoverning && (N.power = Math.round(N.power * 1.5)),
        (N.faction.toLowerCase().includes('merchant') || N.faction.toLowerCase().includes('guild')) &&
          (N.power = Math.round(N.power * 0.5)));
    }),
    factions.push({
      faction: 'War Council',
      power: 25,
      desc: 'Emergency committee with authority over rationing, conscription, and defence spending; not accountable to normal governance.',
    })),
    ke('occupied') &&
      (factions.forEach((N) => {
        (N.isGoverning && ((N.modifiers = [...(N.modifiers || []), 'occupied']), (N.power = Math.round(N.power * 0.6))),
          (N.faction.toLowerCase().includes('military') || N.faction.toLowerCase().includes('guard')) &&
            (N.power = Math.round(N.power * 0.3)),
          !N.isGoverning &&
            N.faction !== 'Occupation Authority' &&
            N.faction !== 'Resistance Network' &&
            !N.faction.toLowerCase().includes('military') &&
            !N.faction.toLowerCase().includes('guard') &&
            (N.power = Math.round(N.power * 0.82)),
          (N.faction === 'Noble Families' || N.faction === 'Noble Houses' || N.faction === 'Landed Gentry') &&
            ((N.power = Math.round(N.power * 0.7)),
            (N.desc =
              (N.desc || '') +
              ' Under occupation, several noble families have made private accommodations with the new authority. Others have not, and are watched.')));
      }),
      factions.push({
        faction: 'Occupation Authority',
        power: 20,
        desc: 'External administrative body; all significant decisions require approval or reversal. Locally hated. Their actual power depends on how many soldiers they have here, which varies.',
      }),
      factions.push({
        faction: 'Resistance Network',
        power: 8,
        desc: 'Distributed cells operating through existing social structures; no formal hierarchy. Currently cautious.',
      })),
    ke('politically_fractured') &&
      (factions.forEach((N) => {
        (N.isGoverning &&
          ((N.power = Math.round(N.power * 0.4)), (N.modifiers = [...(N.modifiers || []), 'contested'])),
          (N.faction === 'Noble Families' || N.faction === 'Noble Houses' || N.faction === 'Landed Gentry') &&
            (N.power = Math.round(N.power * 1.4)));
      }),
      factions.push({
        faction: P && P.includes('Royal Authority') ? 'Loyalist Noble Bloc' : 'Rival Faction B',
        power: 20,
        desc:
          P && P.includes('Royal Authority')
            ? 'Noble houses backing the current crown line; their support is conditional on continued royal favour and land grants.'
            : 'Claims legitimate authority through different means; controls a distinct district or institution.',
      }),
      factions.push({
        faction: P && P.includes('Royal Authority') ? 'Reform Noble Bloc' : 'Third Bloc (Neutrals)',
        power: 15,
        desc:
          P && P.includes('Royal Authority')
            ? 'Noble houses that want a renegotiation of feudal obligations; not openly rebellious, but not cooperative.'
            : 'Would support stability — if a price can be agreed. Currently being courted by both sides.',
      })),
    ke('indebted') &&
      (factions.push({
        faction:
          P && P.includes('Royal Authority') && S ? 'Crown Creditors (Noble Coalition)' : "Creditor's Representative",
        power: P && P.includes('Royal Authority') && S ? 22 : 18,
        desc:
          P && P.includes('Royal Authority') && S
            ? "A coalition of noble houses that hold the crown's debt. They are owed money, military obligations, and political appointments. They are in no hurry to be repaid."
            : 'Resident agent of the external creditor; formally an observer, in practice a veto on fiscal decisions.',
      }),
      factions.forEach((N) => {
        ((N.faction.toLowerCase().includes('merchant') || N.faction.toLowerCase().includes('guild')) &&
          (N.power = Math.round(N.power * 1.3)),
          P &&
            P.includes('Royal Authority') &&
            (N.faction === 'Noble Families' || N.faction === 'Noble Houses') &&
            ((N.power = Math.round(N.power * 1.5)),
            (N.desc = (N.desc || '') + ' Several of these houses hold crown debt and are positioning accordingly.')));
      })),
    ke('recently_betrayed') &&
      (factions.push({
        faction: 'Investigation Faction',
        power: 12,
        desc: 'Informal coalition demanding answers; politically inconvenient to governance; growing.',
      }),
      factions.forEach((N) => {
        N.isGoverning && (N.power = Math.round(N.power * 0.7));
      })),
    ke('infiltrated') &&
      factions.push({
        faction: 'Unknown Faction (hidden)',
        power: 15,
        desc: 'An external interest with embedded assets in at least two factions. Its presence is not known to the settlement.',
      }),
    ke('succession_void') &&
      (factions.forEach((N) => {
        (N.isGoverning && ((N.power = Math.round(N.power * 0.5)), (N.modifiers = [...(N.modifiers || []), 'vacant'])),
          (N.faction === 'Noble Families' ||
            N.faction === 'Noble Houses' ||
            N.faction === 'Landed Gentry' ||
            N.faction === 'Manor Household') &&
            ((N.power = Math.round(N.power * 1.8)),
            (N.desc =
              (N.desc || '') +
              ' The succession crisis has transformed latent noble power into active leverage — every claimant needs their backing.')));
      }),
      factions.push({
        faction: P && P.includes('Royal Authority') ? 'Noble Claimant (Senior Line)' : 'Claimant Bloc A',
        power: P && P.includes('Royal Authority') ? 22 : 18,
        desc:
          P && P.includes('Royal Authority')
            ? 'A noble house with a plausible hereditary claim; controls several key military levies. Legally strongest. Not universally liked.'
            : 'Hereditary or institutional claim; has legal arguments; lacks popular support.',
      }),
      factions.push({
        faction: P && P.includes('Royal Authority') ? 'Noble Claimant (Reform Faction)' : 'Claimant Bloc B',
        power: P && P.includes('Royal Authority') ? 17 : 15,
        desc:
          P && P.includes('Royal Authority')
            ? 'A rival noble house backed by popular sentiment and merchant capital; weaker bloodline claim but stronger coalition. Moving fast.'
            : 'Popular support; questionable legitimacy; moving fast.',
      })),
    ke('famine') &&
      (factions.push({
        faction: 'Grain Holders',
        power: 20,
        desc: 'Whoever controls the remaining food reserves holds more real power than any formal authority.',
      }),
      factions.forEach((N) => {
        N.faction.toLowerCase().includes('religious') && (N.power = Math.round(N.power * 1.4));
      })),
    ke('plague_onset') &&
      (factions.push({
        faction: 'Quarantine Council',
        power: 15,
        desc: 'Healers, clerics, and pragmatists with emergency health powers. Unpopular. Probably right.',
      }),
      factions.forEach((N) => {
        (N.faction.toLowerCase().includes('religious') && (N.power = Math.round(N.power * 1.5)),
          (N.faction.toLowerCase().includes('merchant') || N.faction.toLowerCase().includes('trade')) &&
            (N.power = Math.round(N.power * 0.7)));
      })),
    ke('monster_pressure') &&
      (factions.forEach((N) => {
        (N.faction.toLowerCase().includes('military') || N.faction.toLowerCase().includes('guard')) &&
          (N.power = Math.round(N.power * 1.6));
      }),
      factions.push({
        faction: 'Monster Hunters / Adventurers',
        power: 10,
        desc: 'Outside professionals brought in or passing through; temporarily powerful because they are useful.',
      })),
    ke('insurgency') &&
      (function () {
        const N = typeof getInstFlags == 'function' ? getInstFlags(config || {}, institutions || []) : {},
          ye = (N.criminalEffective || 0) > (N.militaryEffective || 0) && (N.economyOutput || 50) < 48;
        ((
          factions.find(function (De) {
            return De.isGoverning;
          }) || {}
        ).faction,
          factions.forEach(function (De) {
            (De.isGoverning &&
              ((De.power = Math.round(De.power * 0.72)),
              (De.modifiers = [...(De.modifiers || []), 'contested legitimacy'])),
              (De.faction.toLowerCase().includes('thieves') || De.faction.toLowerCase().includes('criminal')) &&
                (De.power = Math.round(De.power * 1.3)),
              (De.faction.toLowerCase().includes('religious') || De.faction.toLowerCase().includes('church')) &&
                ((De.power = Math.round(De.power * 1.15)),
                (De.desc =
                  (De.desc || '') +
                  ' Currently under pressure from both sides to publicly endorse the legitimate authority.')));
          }));
        const he = ye
          ? P && P.includes('Royal Authority')
            ? "Commons' Reform Assembly"
            : P && P.includes('Merchant')
              ? "Journeymen's League"
              : "People's Council"
          : P && P.includes('Royal Authority')
            ? 'Loyalist Noble Opposition'
            : P && P.includes('Feudal')
              ? "Reform Stewards' Coalition"
              : 'Reformist Faction';
        factions.push({
          faction: he,
          power: ye ? 18 : 22,
          desc: ye
            ? "Organised common-population movement challenging the governing authority's legitimacy. Growing quickly. No unified leadership yet — which makes negotiation impossible."
            : 'Elite faction that has concluded the current governing arrangement is no longer viable. Pursuing institutional change through strategic non-cooperation, coalition-building, and selective pressure.',
        });
      })(),
    ke('mass_migration') &&
      (function () {
        ((typeof getInstFlags == 'function' ? getInstFlags(config || {}, institutions || []) : {}).economyOutput ||
          50) >= 50
          ? (factions.push({
              faction: "Newcomers' Settlement",
              power: 12,
              desc: 'The incoming population has begun self-organising — informal leadership, mutual aid networks, collective negotiation with landlords and employers. Not yet a formal political force, but cohesive enough to matter.',
            }),
            factions.forEach(function (he) {
              ((he.faction.toLowerCase().includes('religious') ||
                he.faction.toLowerCase().includes('church') ||
                he.faction.toLowerCase().includes('monastery')) &&
                ((he.power = Math.round(he.power * 1.3)),
                (he.desc =
                  (he.desc || '') +
                  " The institution's charitable work among new arrivals has dramatically expanded its community standing.")),
                (he.faction.toLowerCase().includes('craft') || he.faction.toLowerCase().includes('guild')) &&
                  ((he.power = Math.round(he.power * 0.85)),
                  (he.desc =
                    (he.desc || '') +
                    ' The arrival of skilled workers outside guild structures is an existential concern being discussed at every chapter meeting.')));
            }))
          : (factions.push({
              faction: 'Departure Committee',
              power: 8,
              desc: "Informal group coordinating group departures, selling assets, and managing the logistics of relocation. Their existence is a public statement about the settlement's prospects.",
            }),
            factions.forEach(function (he) {
              he.isGoverning &&
                ((he.power = Math.round(he.power * 0.85)),
                (he.desc =
                  (he.desc || '') +
                  ' Managing the emigration crisis while maintaining the appearance that it is not a crisis.'));
            }));
      })(),
    ke('wartime') &&
      (function () {
        (
          factions.find(function (he) {
            return he.isGoverning;
          }) || {}
        ).faction;
        const N = typeof getInstFlags == 'function' ? getInstFlags(config || {}, institutions || []) : {},
          ye = (N.militaryEffective || 50) >= 55 && (N.economyOutput || 50) >= 45;
        (factions.forEach(function (he) {
          ((he.faction.toLowerCase().includes('military') ||
            he.faction.toLowerCase().includes('guard') ||
            he.faction.toLowerCase().includes('garrison')) &&
            ((he.power = Math.round(he.power * 1.5)),
            (he.desc =
              (he.desc || '') +
              ' Wartime has transformed this faction from a civic institution into a primary power centre — crown authority flows through military channels now.')),
            (he.faction.toLowerCase().includes('merchant') || he.faction.toLowerCase().includes('guild')) &&
              (ye
                ? ((he.power = Math.round(he.power * 1.2)),
                  (he.desc =
                    (he.desc || '') +
                    ' War contracts have made the well-connected wealthy. The faction is divided between those profiting and those whose trade routes are severed.'))
                : ((he.power = Math.round(he.power * 0.8)),
                  (he.desc =
                    (he.desc || '') +
                    ' Trade disruption and requisition are hurting the bottom line. The faction is lobbying for compensation and receiving promises.'))),
            (he.faction.toLowerCase().includes('religious') || he.faction.toLowerCase().includes('church')) &&
              ((he.power = Math.round(he.power * 1.2)),
              (he.desc =
                (he.desc || '') +
                " The pastoral burden of wartime — soldiers praying before departure, families grieving — has made the institution indispensable in a way it wasn't before.")));
        }),
          factions.push({
            faction: 'War Council',
            power: ye ? 20 : 25,
            desc: ye
              ? "Crown-appointed emergency body coordinating supply, conscription, and military contracting. Currently functioning smoothly — the war is going well enough that its authority isn't contested."
              : 'Crown-appointed emergency body with powers over requisition, conscription, and price controls. Unpopular. Accused of favouritism in contract awards. Probably correct on the military decisions.',
          }),
          ye ||
            factions.push({
              faction: 'Peace Faction',
              power: 10,
              desc: 'Merchants, clergy, and common voices arguing that the cost of continued war exceeds any achievable gain. Not traitors — pragmatists. Growing.',
            }));
      })(),
    ke('religious_conversion') &&
      (function () {
        const N =
            (
              factions.find(function (he) {
                return he.isGoverning;
              }) || {}
            ).faction || null,
          ye = N ? N.length % 3 : Math.floor(_rng() * 3);
        (factions.forEach(function (he) {
          ((he.faction.toLowerCase().includes('religious') ||
            he.faction.toLowerCase().includes('church') ||
            he.faction.toLowerCase().includes('clergy') ||
            he.faction.toLowerCase().includes('temple')) &&
            ((he.power = Math.round(he.power * (ye === 2 ? 0.5 : 0.7))),
            (he.modifiers = [...(he.modifiers || []), 'contested legitimacy']),
            (he.desc =
              (he.desc || '') +
              (ye === 0
                ? ' Losing congregation to the new faith faster than leadership acknowledges publicly.'
                : ye === 1
                  ? ' One of two competing factions claiming the legitimate succession — legal standing of their records is contested.'
                  : ' Formally compliant with the conversion order. Actual compliance among the congregation is harder to assess.'))),
            he.isGoverning &&
              ((he.power = Math.round(he.power * 0.88)),
              (he.desc =
                (he.desc || '') +
                ' Under pressure from both religious factions to make a formal declaration of support. Has so far avoided doing so.')),
            (he.faction.toLowerCase().includes('thieves') || he.faction.toLowerCase().includes('criminal')) &&
              (he.power = Math.round(he.power * 1.25)));
        }),
          ye === 0
            ? factions.push({
                faction: 'New Faith Community',
                power: 14,
                desc: 'Growing movement without formal institutions — meeting in homes, sharing resources, organising mutual aid. Politically naive but numerically significant and increasingly confident.',
              })
            : ye === 1
              ? factions.push({
                  faction: 'Reform Congregation',
                  power: 16,
                  desc: 'The breakaway faction in the religious schism. Claims doctrinal legitimacy and holds parallel services. Legal standing of its records and sacraments is disputed by the established institution.',
                })
              : (factions.push({
                  faction: 'Conversion Enforcement Office',
                  power: 18,
                  desc: 'External or crown-appointed body with authority to verify compliance with the conversion order. Uses informants. Its definition of compliance is stricter than the governing faction anticipated.',
                }),
                factions.push({
                  faction: 'Underground Old Faith',
                  power: 7,
                  desc: "Not officially a faction — officially it doesn't exist. In practice it is the most cohesive social network in the settlement. Its membership overlaps with several other factions in ways nobody discusses.",
                })));
      })(),
    ke('slave_revolt') &&
      (function () {
        ((
          factions.find(function (N) {
            return N.isGoverning;
          }) || {}
        ).faction,
          factions.forEach(function (N) {
            (N.isGoverning &&
              ((N.power = Math.round(N.power * 0.65)),
              (N.modifiers = [...(N.modifiers || []), 'authority contested']),
              (N.desc =
                (N.desc || '') +
                ' Managing an active slave revolt — the public posture is control, the private reality is containment at best.')),
              (N.faction.toLowerCase().includes('military') ||
                N.faction.toLowerCase().includes('guard') ||
                N.faction.toLowerCase().includes('garrison')) &&
                ((N.power = Math.round(N.power * 1.5)),
                (N.desc =
                  (N.desc || '') +
                  ' Fully deployed for containment. Soldiers are being asked to do things that will complicate their relationship with the civilian population.')),
              (N.faction.toLowerCase().includes('merchant') || N.faction.toLowerCase().includes('guild')) &&
                ((N.power = Math.round(N.power * 0.85)),
                (N.desc =
                  (N.desc || '') +
                  ' The revolt has disrupted labour supply and market operations. The faction is divided between those demanding immediate suppression and those quietly calculating whether a negotiated settlement might be cheaper.')),
              (N.faction.toLowerCase().includes('religious') || N.faction.toLowerCase().includes('church')) &&
                ((N.power = Math.round(N.power * 1.2)),
                (N.desc =
                  (N.desc || '') +
                  ' Under pressure from both sides to publicly declare the revolt either just or sacrilegious. Has so far avoided a direct statement.')));
          }),
          factions.push({
            faction: 'Revolt Leadership',
            power: 18,
            desc: 'Organised leadership of the enslaved population — distributed, resilient, and holding territory. Has demands. Has not yet committed to whether those demands are negotiable.',
          }),
          factions.push({
            faction: 'Abolitionist Network',
            power: 7,
            desc: 'Free citizens, clergy, and outside agitators who have been supporting the revolt covertly — shelter, information, supplies. Their involvement is not yet public.',
          }));
      })());
};
