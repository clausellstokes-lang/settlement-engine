import { getInstFlags, getPriorities, priorityToMultiplier } from '../helpers.js';

// getServiceTierInfo(serviceName, institutionName, settlement, institutions)
// -> demand/availability multiplier for a service, keyed to the settlement's
// dominant institutional domain (military / religion / magic / criminal /
// economy). Used to probabilistically thin low-demand services.
export const getServiceTierInfo = (serviceName, institutionName, settlement = {}, institutions = []) => {
  getPriorities(settlement);
  const svc = (serviceName || '').toLowerCase(),
    inst = (institutionName || '').toLowerCase(),
    flags = getInstFlags(settlement, institutions);
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
    ? priorityToMultiplier(flags.militaryEffective)
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
      ? priorityToMultiplier(flags.religionInfluence)
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
        ? priorityToMultiplier(flags.magicInfluence)
        : svc.includes('gambling') ||
            svc.includes('fence') ||
            svc.includes('unofficial') ||
            svc.includes('black market') ||
            svc.includes('smuggl') ||
            inst.includes('thieves') ||
            inst.includes('criminal') ||
            inst.includes('underground')
          ? priorityToMultiplier(flags.criminalEffective)
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
            ? priorityToMultiplier(flags.economyOutput)
            : 1;
  };
