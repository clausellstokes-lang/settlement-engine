/**
 * design/boundBook.js — AE-1 policy substrate for the Bound Book.
 *
 * This file contains declarations only. It deliberately imports no component
 * and changes no rendered surface. Later AE waves consume these closed maps and
 * promote one report category at a time from measured debt to enforcement.
 */

export const SURFACE_REGISTER_IDS = Object.freeze([
  'chrome',
  'parchment',
  'manuscript',
  'ceremonial',
]);

export const VOICE_FLOORS = Object.freeze(['ui', 'plain', 'chronicle', 'covenant']);

export const CHIP_KINDS = Object.freeze([
  'label',
  'date',
  'statusBand',
  'count',
  'operatorScalar',
]);

const register = ({ rank, voiceFloor, typeRoles, visibleChips, titleGlosses = [] }) => Object.freeze({
  rank,
  voiceFloor,
  typeRoles: Object.freeze(typeRoles),
  chips: Object.freeze({
    visible: Object.freeze(visibleChips),
    titleGlossOnly: Object.freeze(titleGlosses),
  }),
});

/**
 * The visual frame sets the minimum sentence register. Type roles are canonical
 * keys from `tokens.js:type`; consumers resolve them there rather than copying
 * values. Exact numbers are named `operatorScalar`/`count` so the manuscript
 * prohibition is structural instead of a prose-regex convention.
 */
export const SURFACE_REGISTERS = Object.freeze({
  chrome: register({
    rank: 0,
    voiceFloor: 'ui',
    typeRoles: ['ui-l', 'ui-m', 'ui-s', 'mono'],
    visibleChips: ['label', 'date', 'statusBand', 'count', 'operatorScalar'],
  }),
  parchment: register({
    rank: 1,
    voiceFloor: 'plain',
    typeRoles: ['display-m', 'prose-m', 'ui-m', 'ui-s'],
    visibleChips: ['label', 'date', 'statusBand', 'count', 'operatorScalar'],
  }),
  manuscript: register({
    rank: 2,
    voiceFloor: 'chronicle',
    typeRoles: ['display-m', 'prose-l', 'prose-m', 'ui-s'],
    visibleChips: ['label', 'date', 'statusBand'],
    titleGlosses: ['count', 'operatorScalar'],
  }),
  ceremonial: register({
    rank: 3,
    voiceFloor: 'covenant',
    typeRoles: ['display-xl', 'display-l', 'prose-l', 'ui-s'],
    visibleChips: ['label', 'date', 'statusBand'],
    titleGlosses: ['count', 'operatorScalar'],
  }),
});

export const SEAM_IDS = Object.freeze(['letterbox', 'feather', 'plate', 'edge']);

export const SEAM_KINDS = Object.freeze({
  letterbox: Object.freeze({ status: 'available', means: 'art held between hard chrome rails' }),
  feather: Object.freeze({ status: 'available', means: 'art resolves into page through a tokenized scrim' }),
  plate: Object.freeze({ status: 'available', means: 'art is hard-framed inside the house border ring' }),
  edge: Object.freeze({ status: 'parked', means: 'reserved deckle transition; no asset or live use' }),
});

const artwork = (
  id,
  ownerPath,
  ownerSelector,
  seam,
  motion = 'none',
  staticComposition = 'present',
) => Object.freeze({
  id, ownerPath, ownerSelector, seam, motion, staticComposition, status: 'declared',
});

/**
 * Inventory SURFACES, never asset URLs. Dynamic user art and registry-backed
 * paintings therefore remain one governed rendering seam instead of producing a
 * row per URL. AE-2 owns conversion and totality enforcement.
 */
export const ARTWORK_SURFACE_MANIFEST = Object.freeze([
  artwork('landing.hero', 'src/components/HomeLanding.jsx', 'HomeLanding', 'letterbox'),
  artwork('landing.journey-film', 'src/components/loadingJourney/JourneyFilm.jsx', 'JourneyFilmView', 'letterbox', 'scrub', 'poster'),
  artwork('loading.progress-film', 'src/components/loadingJourney/ProgressJourneyOverlay.jsx', 'VideoScrubLayer', 'letterbox', 'scrub', 'poster'),
  artwork('page.paintings', 'src/config/pageBackgrounds.js', 'PAGE_BACKGROUNDS', 'feather'),
  artwork('landing.create-scene', 'src/components/home/LandingBelowFold.jsx', 'LandingBelowFold', 'feather'),
  artwork('landing.evolution-backdrop', 'src/components/HomeHero.jsx', 'HomeHero', 'feather', 'settle', 'settled'),
  artwork('loading.realm-unfurl', 'src/components/loadingJourney/RealmUnfurlLoading.jsx', 'RealmUnfurlLoading', 'feather', 'reveal', 'resolved'),
  artwork('dossier.backdrop', 'src/components/settlementDetail/SettlementDossierBackdrop.jsx', 'SettlementDossierBackdrop', 'feather'),
  artwork('generate.mode-cards', 'src/components/generate/ModeSelector.jsx', 'ModeSelector', 'plate'),
  artwork('landing.realm-map-preview', 'src/components/home/LandingArtifacts.jsx', 'RealmMapCard', 'plate'),
  artwork('landing.gallery-covers', 'src/components/home/LandingBelowFold.jsx', 'GalleryCards', 'plate'),
  artwork('landing.map-plate', 'src/components/home/LandingArtifacts.jsx', 'MapPlateCard', 'plate'),
  artwork('about.living-world-progression', 'src/components/howto/LivingWorldTab.jsx', 'LivingWorldTab', 'plate'),
  artwork('locked-destination.preview', 'src/components/primitives/LockedDestination.jsx', 'LockedDestination', 'plate'),
  artwork('gallery.campaign-player', 'src/components/gallery/CampaignPlayerView.jsx', 'CampaignPlayerView', 'plate'),
  artwork('gallery.cover-field', 'src/components/gallery/CoverImageField.jsx', 'CoverImageField', 'plate'),
  artwork('gallery.campaigns', 'src/components/gallery/GalleryCampaigns.jsx', 'GalleryCampaigns', 'plate'),
  artwork('gallery.image', 'src/components/gallery/GalleryImage.jsx', 'GalleryImage', 'plate'),
  artwork('gallery.maps', 'src/components/gallery/GalleryMaps.jsx', 'GalleryMaps', 'plate'),
  artwork('gallery.image-cropper', 'src/components/gallery/ImageCropper.jsx', 'ImageCropper', 'plate'),
  artwork('interior.plan', 'src/components/interior/InteriorView.jsx', 'InteriorView', 'plate'),
  artwork('town-map.card-thumb', 'src/components/townMap/SettlementCardMapThumb.jsx', 'SettlementCardMapThumb', 'plate'),
  artwork('town-map.fog-player', 'src/components/townMap/fog/FogPlayerView.jsx', 'FogPlayerView', 'plate'),
  artwork('town-map.player-subtab', 'src/components/townMap/subtabs/MapPlayerSubTab.jsx', 'MapPlayerSubTab', 'plate'),
]);

const reader = (id, ownerPath, ownerSelector, surfaceRegister, motion = 'none', staticComposition = 'present') => Object.freeze({
  id, ownerPath, ownerSelector, surfaceRegister, motion, staticComposition,
});

/** Initial high-value reader inventory. AE-2/3/4 expand coverage before enforcement. */
export const READER_SURFACE_MANIFEST = Object.freeze([
  reader('realm.wizard-news-entry', 'src/components/map/WizardNewsPanel.jsx', 'NewsEntry', 'manuscript'),
  reader('realm.herald-briefing', 'src/components/map/HeraldCommandBody.jsx', 'BriefingCard', 'parchment'),
  reader('realm.herald-story-shell', 'src/components/map/HeraldCommandBody.jsx', 'StoryCard', 'parchment'),
  reader('realm.herald-headline', 'src/components/map/HeraldHeadline.jsx', 'HeraldHeadline', 'manuscript'),
  reader('realm.herald-forecast', 'src/components/map/HeraldForecast.jsx', 'HeraldForecast', 'manuscript'),
  reader('realm.chronicle-interval', 'src/components/map/ChronicleScrollback.jsx', 'IntervalChronicleSummary', 'manuscript'),
]);
