/**
 * serviceClassifier.js — classify a service into one of the eleven service
 * categories (lodging/food/equipment/magic/information/healing/transport/
 * legal/employment/entertainment/criminal).
 *
 * Split out of servicesGenerator.js (F31). Pure function: the explicit
 * SERVICE_CATEGORY_MAP wins; otherwise a keyword heuristic over the
 * lowercased service name (`y`) and institution name (`v`) decides, with
 * INSTITUTION_DEFAULT_CATEGORY as the final fallback.
 */
import { SERVICE_CATEGORY_MAP, INSTITUTION_DEFAULT_CATEGORY } from './serviceCategoryTables.js';

// classifyService(serviceName, instName) → category string.
//   y = lowercased service name, v = lowercased institution name (retained
//   as terse locals; the heuristic references them ~160 times).
export const classifyService = (serviceName, instName) => {
  const y = serviceName.toLowerCase(),
    v = instName.toLowerCase();
  // Explicit lookup first — covers all 260 known services unambiguously
  const _mapped = SERVICE_CATEGORY_MAP[serviceName];
  if (_mapped) return _mapped;
  return y === 'lodging' ||
    y.includes('lodging') ||
    y.includes('accommodation') ||
    y.includes('all grades') ||
    y.includes('rooms for') ||
    y.includes('common room') ||
    y.includes('private suite')
    ? 'lodging'
    : (v.includes('inn') || v.includes('tavern')) &&
        (y.includes('meals') || y.includes('drink') || y.includes('ale') || y.includes('food and'))
      ? 'food'
      : v.includes('inn') || v.includes('tavern') || v.includes('hospitality')
        ? y.includes('entertainment') ||
          y.includes('performance') ||
          y.includes('games') ||
          y.includes('companionship') ||
          y.includes('music')
          ? 'entertainment'
          : y.includes('hiring hall')
            ? 'employment'
            : 'lodging'
        : y.includes('grain mill') ||
            y.includes('milling') ||
            y.includes('flour') ||
            y.includes('bread') ||
            y.includes('meals') ||
            y.includes('food') ||
            y.includes('drink') ||
            y.includes(' ale') ||
            y === 'ale' ||
            y.includes('ale and') ||
            y.includes('dining')
          ? 'food'
          : y.includes('fence') ||
              y.includes('contraband') ||
              y.includes('stolen') ||
              y.includes('smuggl') ||
              y.includes('forgery') ||
              y.includes('black market') ||
              y.includes('protection racket') ||
              y.includes('safe house') ||
              y.includes('burglary') ||
              y.includes('contract killing') ||
              y.includes('intimidation') ||
              y.includes('money launder') ||
              y.includes('hidden market') ||
              y.includes('unregistered lodging') ||
              y.includes('discretion') ||
              y.includes('guild membership') ||
              y.includes('untaxed') ||
              y.includes('restricted goods') ||
              y.includes('arcane underground') ||
              y.includes('competitive pricing') ||
              y.includes('mercenary alignment') ||
              y.includes('unlicensed tables') ||
              y.includes('loans (at interest)') ||
              v.includes('thieves') ||
              v.includes('assassin') ||
              v.includes('black market') ||
              v.includes('smuggling') ||
              v.includes('criminal') ||
              v.includes('underground city') ||
              v.includes('front business')
            ? 'criminal'
            : (y.includes('weapon') && !y.includes('weapon enchant')) ||
                y.includes('armour') ||
                y.includes('armor') ||
                y.includes('horseshoe') ||
                y.includes('tool repair') ||
                y.includes('equipment') ||
                (y.includes('siege') && !y.includes('siege specialist')) ||
                y.includes('engraving') ||
                y.includes('inscription') ||
                y.includes('jewellery') ||
                y.includes('jewelry') ||
                y.includes('precious metal') ||
                y.includes('repair and') ||
                y.includes('commissions') ||
                y.includes('craftsmen') ||
                y.includes('bespoke') ||
                y.includes('quality goods') ||
                y.includes('master-quality') ||
                y.includes('processed textile') ||
                y.includes('dyed cloth') ||
                y.includes('woven cloth') ||
                y.includes('finished fabric')
              ? 'equipment'
              : y.includes('spell') ||
                  y.includes('magic') ||
                  y.includes('potion') ||
                  y.includes('enchant') ||
                  y.includes('scroll') ||
                  y.includes('alch') ||
                  y.includes('planar') ||
                  y.includes('arcane') ||
                  y.includes('weapon enchant') ||
                  y.includes('identification') ||
                  y.includes('teleport') ||
                  y.includes('dispel') ||
                  y.includes('remove curse') ||
                  y.includes('curse removal') ||
                  y.includes('ward') ||
                  y.includes('warding')
                ? 'magic'
                : y.includes('medical') ||
                    y.includes('healing') ||
                    y === 'cure' ||
                    y.startsWith('cure ') ||
                    y.includes(' cure') ||
                    y.includes('cured') ||
                    y.includes('curing') ||
                    y.includes('antitoxin') ||
                    y.includes('antidote') ||
                    (y.includes('tonic') && !y.includes('tectonic')) ||
                    y.includes('salve') ||
                    y.includes('surgery') ||
                    y.includes('quarantine') ||
                    y.includes('restoration') ||
                    y.includes('physician') ||
                    y.includes('sick') ||
                    y.includes('wounded') ||
                    y.includes('religious service') ||
                    y.includes('last rites') ||
                    y.includes('medical care') ||
                    y.includes('treatment') ||
                    y.includes('child placement') ||
                    y.includes('foundling') ||
                    y === 'sanctuary' ||
                    y.includes('last rites')
                  ? 'healing'
                  : y.includes('performance') ||
                      y.includes('entertainment') ||
                      y.includes('gladiatorial') ||
                      y.includes('games of chance') ||
                      y.includes('licensed tables') ||
                      y.includes('unlicensed tables') ||
                      y.includes('companionship') ||
                      y.includes('theatrical') ||
                      y.includes('music') ||
                      y.includes('bard') ||
                      y.includes('enter as combatant') ||
                      y.includes('private performance') ||
                      y.includes('public performance') ||
                      y.includes('high-stakes gambling') ||
                      y.includes('high stakes gambling') ||
                      y.includes('public games')
                    ? 'entertainment'
                    : [
                          'horse rental',
                          'cart rental',
                          'ship passage',
                          'passage (',
                          'teleportation to',
                          'coach',
                          'ferry',
                          'mounted',
                          'carriage',
                          'short passage',
                          'deep-water passage',
                          'convoy authorization',
                          'cargo shipping',
                          'naval escort',
                          'scheduled freight',
                          'freight run',
                          'freight haulage',
                          'freight contract',
                          'convoy assembly',
                          'convoy escort',
                          'armed escort contracting',
                          'route intelligence',
                          'route information',
                          'road intelligence',
                          'bonded freight',
                          'cargo staging',
                          'pack animal rental',
                          'carter hire',
                          'passenger river passage',
                          'river pilot',
                          'charter barge',
                          'towpath',
                          'upriver',
                          'downriver',
                          'river crossing',
                          'river craft',
                          'scheduled coach',
                          'coach departure',
                          'coach hire',
                          'private coach',
                          'passenger lodging',
                          'stabling',
                          'navigation consultation',
                          'coastal chart',
                          'sea route',
                          'commercial dispute resolution',
                        ].some((j) => y.includes(j)) ||
                        v.includes('carrier') ||
                        v.includes('caravan') ||
                        v.includes('barge') ||
                        v.includes('coaching') ||
                        v.includes('ferry') ||
                        v.includes('boatyard') ||
                        v.includes('transport')
                      ? 'transport'
                      : y.includes('cargo handling') ||
                          y.includes('cargo loading') ||
                          y.includes('bonded storage') ||
                          y.includes('staging and distribution') ||
                          y.includes('goods storage') ||
                          y.includes('warehouse') ||
                          y.includes('vault') ||
                          y.includes('secure storage') ||
                          y.includes('deposit') ||
                          y.includes('letters of credit') ||
                          y.includes('insurance') ||
                          y.includes('wealth management') ||
                          y.includes('trade financing') ||
                          y.includes('currency exchange') ||
                          y.includes('money changing')
                        ? 'legal'
                        : y.includes('planar') || y.includes('extraplanar') || y.includes('draconic')
                          ? 'magic'
                          : y.includes('monster component') ||
                              y.includes('monster intelligence') ||
                              y.includes('commission hunting') ||
                              y.includes('processing and preserv') ||
                              y.includes('guard animals') ||
                              y.includes('companion training') ||
                              y.includes('messenger beast') ||
                              y.includes('reagent sourcing') ||
                              y.includes('labour hire') ||
                              y.includes('golem') ||
                              y.includes('undead') ||
                              y.includes('night watch') ||
                              y.includes('corpse processing') ||
                              y.includes('precision fabrication') ||
                              y.includes('guard deployment') ||
                              y.includes('apprenticeship program') ||
                              y.includes('metalworking training') ||
                              y.includes('hiring hall') ||
                              (y.includes('hire') &&
                                (y.includes('guard') ||
                                  y.includes('muscle') ||
                                  y.includes('worker') ||
                                  y.includes('servant')))
                            ? 'employment'
                            : y.includes('healing (1st') ||
                                y.includes('utility magic') ||
                                y.includes('greater restoration') ||
                                y.includes('true resurrection') ||
                                y.includes('restoration')
                              ? 'healing'
                              : y.includes('contract board') ||
                                  y.includes('rumour board') ||
                                  y.includes('rumor board') ||
                                  y.includes('monster intelligence') ||
                                  y.includes('emergency muster') ||
                                  y.includes('bounty board') ||
                                  y.includes('delve contract')
                                ? 'employment'
                                : y.includes('legal') ||
                                    y.includes('civil dispute') ||
                                    y.includes('notary') ||
                                    y.includes('contract') ||
                                    y.includes('trial') ||
                                    y.includes('property') ||
                                    y.includes('wealth management') ||
                                    y.includes('trade financ') ||
                                    y.includes('insurance') ||
                                    y.includes('vaulting') ||
                                    y.includes('letters of credit') ||
                                    y.includes('currency exchange') ||
                                    y.includes('money changing') ||
                                    y.includes('loans') ||
                                    y.includes('deposit') ||
                                    y.includes('arbitration') ||
                                    y.includes('certification') ||
                                    y.includes('genealog') ||
                                    y.includes('degree') ||
                                    y.includes('credential')
                                  ? 'legal'
                                  : y.includes('quest') ||
                                      y.includes('bounty') ||
                                      y.includes('hired muscle') ||
                                      y.includes('company contract') ||
                                      y.includes('mercenary') ||
                                      y.includes('guard for hire') ||
                                      y.includes('hiring hall') ||
                                      y.includes('party match') ||
                                      y.includes('siege specialist') ||
                                      y.includes('employment') ||
                                      y.includes('specialist warrior') ||
                                      y.includes('training service') ||
                                      y.includes('party registration') ||
                                      y.includes('patrol and escort') ||
                                      y.includes('escort') ||
                                      y.includes('threat reporting') ||
                                      y.includes('training yard') ||
                                      y.includes('military intelligence') ||
                                      y.includes('guard deployment') ||
                                      y.includes('guard animal') ||
                                      y.includes('guard hire') ||
                                      y.includes('convoy escort') ||
                                      y.includes('naval escort') ||
                                      y.includes('commission hunting') ||
                                      y.includes('labour hire') ||
                                      y.includes('companion training') ||
                                      y.includes('messenger beast') ||
                                      y.includes('contract board') ||
                                      y.includes('emergency muster') ||
                                      y.includes('monster bounty') ||
                                      y.includes('monster contract') ||
                                      y.includes('hired swords') ||
                                      y.includes('party registration') ||
                                      y.includes('rumour board') ||
                                      y.includes('rumor board') ||
                                      y.includes('monster intelligence') ||
                                      y.includes('bounty board') ||
                                      y.includes('delve contract') ||
                                      y.includes('charter contract')
                                    ? 'employment'
                                    : y.includes('research') ||
                                        y.includes('information') ||
                                        y.includes('rumour') ||
                                        y.includes('gossip') ||
                                        y.includes('record') ||
                                        y.includes('news') ||
                                        y.includes('history') ||
                                        y.includes('lore') ||
                                        y.includes('consultation') ||
                                        y.includes('intelligence') ||
                                        y.includes('monster') ||
                                        y.includes('library') ||
                                        (y.includes('text') && !y.includes('textile')) ||
                                        y.includes('scribal') ||
                                        y.includes('copying') ||
                                        y.includes('translation') ||
                                        y.includes('authentication') ||
                                        y.includes('rare text') ||
                                        y.includes('poor relief') ||
                                        y.includes('charity') ||
                                        y.includes('education') ||
                                        y.includes('news and') ||
                                        y.includes('price') ||
                                        (y.includes('apprenticeship') &&
                                          !y.includes('apprenticeship and training'))
                                      ? 'information'
                                      : y.includes('apprenticeship and training')
                                        ? 'employment'
                                        : y.includes('sanctuary') || y.includes('pilgrim') || y.includes('alms')
                                          ? 'healing'
                                          : y.includes('patrol and watch') ||
                                              y.includes('vagrancy') ||
                                              y.includes('textile labour') ||
                                              y.includes('member support')
                                            ? 'employment'
                                            : y.includes('trade regulation') ||
                                                y.includes('quality control') ||
                                                y.includes('quality standard') ||
                                                y.includes('trade facilit') ||
                                                y.includes('guild certif') ||
                                                y.includes('prisoner hold') ||
                                                y.includes('auction service')
                                              ? 'legal'
                                              : y.includes('discreet meeting')
                                                ? 'criminal'
                                                : v.includes('bank') || v.includes('banking')
                                                  ? 'legal'
                                                  : v.includes('church') ||
                                                      v.includes('temple') ||
                                                      v.includes('parish') ||
                                                      v.includes('cathedral') ||
                                                      v.includes('monastery') ||
                                                      v.includes('healer')
                                                    ? 'healing'
                                                    : v.includes('court')
                                                      ? 'legal'
                                                      : v.includes('university') ||
                                                          v.includes('academy') ||
                                                          v.includes('library')
                                                        ? 'information'
                                                        : (v.includes('inn') ||
                                                              v.includes('tavern') ||
                                                              v.includes('hospitality')) &&
                                                            !y.includes('hiring hall')
                                                          ? 'lodging'
                                                          : y.includes('hiring hall')
                                                            ? 'employment'
                                                            : v.includes('smith') ||
                                                                v.includes('craft') ||
                                                                v.includes('guild')
                                                              ? 'equipment'
                                                              : y.includes('estate sale')
                                                                ? 'legal'
                                                                : y.includes('bookmaking') ||
                                                                    y.includes('public game')
                                                                  ? 'entertainment'
                                                                  : y.includes('investigation service') ||
                                                                      y.includes('message relay')
                                                                    ? 'information'
                                                                    : y.includes('textile labour') ||
                                                                        y.includes(
                                                                          'apprenticeship and training'
                                                                        ) ||
                                                                        y.includes('siege specialist')
                                                                      ? 'employment'
                                                                      : y.includes('processed textile') ||
                                                                          y.includes('trade goods for export')
                                                                        ? 'equipment'
                                                                        : y.includes('party match') ||
                                                                            y.includes('referral')
                                                                          ? 'employment'
                                                                          : y.includes('textile') ||
                                                                              y.includes('fabric') ||
                                                                              y.includes('cloth') ||
                                                                              y.includes('garment') ||
                                                                              y.includes('fur ') ||
                                                                              y.includes('hide') ||
                                                                              y.includes('leather') ||
                                                                              y.includes('tanning') ||
                                                                              y.includes('metalwork') ||
                                                                              y.includes('pottery') ||
                                                                              y.includes('ceramic') ||
                                                                              y.includes('glasswork') ||
                                                                              y.includes('woodwork') ||
                                                                              y.includes('carpentry') ||
                                                                              y.includes('furniture') ||
                                                                              y.includes('chandler') ||
                                                                              y.includes('candle') ||
                                                                              y.includes('ropemaking') ||
                                                                              y.includes('cooperage') ||
                                                                              y.includes('barrel') ||
                                                                              y.includes('processed') ||
                                                                              y.includes('manufactured') ||
                                                                              y.includes('crafted') ||
                                                                              y.includes('forged') ||
                                                                              y.includes('commissioned') ||
                                                                              y.includes('bespoke') ||
                                                                              y.includes('powder') ||
                                                                              y.includes('flash') ||
                                                                              y.includes('smoke')
                                                                            ? 'equipment'
                                                                            : y.includes(
                                                                                  'high-stakes gambling'
                                                                                ) ||
                                                                                y.includes('high stakes gambling')
                                                                              ? 'entertainment'
                                                                              : y.includes('weapon enchant') ||
                                                                                  y.includes('magical weapon')
                                                                                ? 'magic'
                                                                                : INSTITUTION_DEFAULT_CATEGORY[instName] || 'equipment';
};
