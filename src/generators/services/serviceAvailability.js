import { getInstFlags, getPriorities, priorityToMultiplier } from '../helpers.js';

// serviceDomainOf(serviceName, institutionName)
// -> the institutional domain a service's demand is keyed to: 'military',
// 'religion', 'magic', 'criminal', 'commercial', or 'other'.
//
// getServiceTierInfo(serviceName, institutionName, settlement, institutions)
// -> demand/availability multiplier for a service, keyed to that domain.
// Used to probabilistically thin low-demand services.
//
// COHERENCE-UPKEEP (the chair's ruling of 2026-11-12 on the services STOP, (A)): the COMMERCIAL
// services' demand roll still reads the economy's output, for its threshold and for whether it
// draws, exactly as before this lane: moving it moves the services step's seeded stream (44
// standing institutions emptied on the lane's corpus). It is held as one row of the upkeep-reader
// walker. What a place can pay for is the one home's share, the prosperity label
// (`domain/facts/keep.js`), applied AFTER this roll by the draw-free upkeep roll
// (`serviceRollMaterialization.js`), so the rule only ever takes rows away.
export const serviceDomainOf = (serviceName, institutionName) => {
  const svc = (serviceName || '').toLowerCase(),
    inst = (institutionName || '').toLowerCase();
  return svc.includes('patrol') ||
    svc.includes('escort') ||
    svc.includes('garrison') ||
    svc.includes('military') ||
    svc.includes('guard') ||
    svc.includes('training yard') ||
    svc.includes('company contract') ||
    svc.includes('specialist warrior') ||
    svc.includes('hired muscle') ||
    svc.includes('siege') ||
    svc.includes('scouting') ||
    inst.includes('garrison') ||
    inst.includes('mercenary')
    ? 'military'
    : svc.includes('religious') ||
        svc.includes('sanctuary') ||
        svc.includes('poor relief') ||
        svc.includes('prayer') ||
        svc.includes('ritual') ||
        svc.includes('spiritual') ||
        svc.includes('hospitality (pilgrim') ||
        svc.includes('safe passage letters') ||
        inst.includes('church') ||
        inst.includes('temple') ||
        inst.includes('cathedral') ||
        inst.includes('monastery') ||
        inst.includes('parish')
      ? 'religion'
      : svc.includes('spell') ||
          svc.includes('magic') ||
          svc.includes('scroll') ||
          svc.includes('enchant') ||
          svc.includes('arcane') ||
          svc.includes('planar') ||
          svc.includes('identification') ||
          svc.includes('curse') ||
          svc.includes('divination') ||
          svc.includes('magical') ||
          svc.includes('cantrip') ||
          svc.includes('prophetic') ||
          svc.includes('dream') ||
          svc.includes('memory retrieval') ||
          inst.includes('wizard') ||
          inst.includes('mage') ||
          inst.includes('alchemist') ||
          inst.includes('enchant') ||
          inst.includes('hedge')
        ? 'magic'
        : svc.includes('gambling') ||
            svc.includes('fence') ||
            svc.includes('unofficial') ||
            svc.includes('black market') ||
            svc.includes('smuggl') ||
            inst.includes('thieves') ||
            inst.includes('criminal') ||
            inst.includes('underground')
          ? 'criminal'
          : svc.includes('price') ||
              svc.includes('trade') ||
              svc.includes('market') ||
              svc.includes('guild') ||
              svc.includes('money') ||
              svc.includes('loan') ||
              svc.includes('deposit') ||
              svc.includes('credit') ||
              svc.includes('insurance') ||
              svc.includes('wealth') ||
              svc.includes('financing') ||
              svc.includes('banking') ||
              svc.includes('currency') ||
              svc.includes('apprenticeship') ||
              svc.includes('certification') ||
              svc.includes('arbitration') ||
              svc.includes('quality control') ||
              svc.includes('regulation') ||
              inst.includes('bank') ||
              inst.includes('guild') ||
              inst.includes('market') ||
              inst.includes('merchant')
            ? 'commercial'
            : 'other';
};

export const getServiceTierInfo = (serviceName, institutionName, settlement = {}, institutions = []) => {
  getPriorities(settlement);
  const flags = getInstFlags(settlement, institutions);
  const domain = serviceDomainOf(serviceName, institutionName);
  return domain === 'military' ? priorityToMultiplier(flags.militaryEffective)
    : domain === 'religion' ? priorityToMultiplier(flags.religionInfluence)
    : domain === 'magic' ? priorityToMultiplier(flags.magicInfluence)
    : domain === 'criminal' ? priorityToMultiplier(flags.criminalEffective)
    : domain === 'commercial'
      ? priorityToMultiplier(flags.economyOutput)
      : 1;
};
