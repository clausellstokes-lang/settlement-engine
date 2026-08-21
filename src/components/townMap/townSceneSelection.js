/**
 * Bridge a TownScene semantic selection to the established 2D inspector cards.
 *
 * The scene owns no parallel entity registry. Canvas picks and accessible-list
 * picks carry the manifest semantic record; this adapter resolves that stable
 * address against the already-authorized TownMapModel. Scene-only furniture is
 * intentionally ignored here and remains described by the Portrait inspector.
 */

import { buildingHoverModel } from './hoverModel.js';

function cardAnchor(wrapper) {
  const rect = wrapper?.getBoundingClientRect?.();
  return {
    x: rect ? rect.left + rect.width / 2 : 0,
    y: rect ? rect.top + rect.height / 2 : 0,
  };
}

/**
 * @param {{
 *   sceneIdOrSemantic: string|Record<string, any>,
 *   explicitSemantic?: Record<string, any>|null,
 *   model: any,
 *   settlement: any,
 *   wrapper: HTMLElement|null,
 *   districtPayload: (district:any) => any,
 *   setPinned: (selection:any) => void,
 * }} input
 */
export function mirrorTownSceneSelection({
  sceneIdOrSemantic,
  explicitSemantic,
  model,
  settlement,
  wrapper,
  districtPayload,
  setPinned,
}) {
  const semantic = explicitSemantic
    || sceneIdOrSemantic?.semantic
    || (typeof sceneIdOrSemantic === 'object' ? sceneIdOrSemantic : null);
  if (!semantic) {
    if (sceneIdOrSemantic == null) setPinned(null);
    return;
  }

  const sceneId = semantic.sceneId
    || (typeof sceneIdOrSemantic === 'string' ? sceneIdOrSemantic : null);
  const canonicalId = semantic.canonicalRef?.id;
  const anchor = cardAnchor(wrapper);

  if (semantic.entityKind === 'building') {
    const building = model.buildings.find((entry) => (
      entry.anchorKey === semantic.anchorKey
      || entry.anchorKey === canonicalId
    ));
    if (!building) {
      setPinned({ kind: 'scene', sceneId, payload: semantic, anchor });
      return;
    }
    const profile = buildingHoverModel(building, settlement);
    if (profile.show) {
      setPinned({
        kind: 'building',
        sceneId,
        payload: { building, ...profile },
        anchor,
      });
    } else {
      setPinned({ kind: 'scene', sceneId, payload: semantic, anchor });
    }
    return;
  }

  if (semantic.entityKind === 'district') {
    const district = model.districts.find((entry) => (
      entry.id === semantic.districtId
      || entry.id === canonicalId
      || entry.anchorKey === semantic.anchorKey
    ));
    if (district) {
      setPinned({
        kind: 'district',
        sceneId,
        payload: districtPayload(district),
        anchor,
      });
    } else {
      setPinned({ kind: 'scene', sceneId, payload: semantic, anchor });
    }
    return;
  }

  const overlayKind = semantic.entityKind === 'condition'
    ? 'condition'
    : semantic.entityKind === 'hazard'
      ? 'hazard'
      : null;
  if (!overlayKind) {
    setPinned({ kind: 'scene', sceneId, payload: semantic, anchor });
    return;
  }
  const collection = overlayKind === 'condition'
    ? model.overlays.conditions
    : model.overlays.hazards;
  const overlay = collection.find((entry) => (
    entry.id === canonicalId
    || entry.id === semantic.anchorKey
  ));
  if (overlay) {
    setPinned({ kind: overlayKind, sceneId, payload: overlay, anchor });
  } else {
    setPinned({ kind: 'scene', sceneId, payload: semantic, anchor });
  }
}
