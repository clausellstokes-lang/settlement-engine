import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  fetchGalleryMap,
  fetchPublicDossier,
  fetchPublicGallery,
  fetchMyGallery,
  reportGalleryDossier,
  toggleGalleryVote,
} from '../lib/gallery.js';
import { navigate } from './useRoute.js';
import { useStore } from '../store/index.js';
import { saves as savesService } from '../lib/saves.js';

export const EMPTY_GALLERY_FILTERS = Object.freeze({
  tier: [],
  terrain: [],
  magicLevel: [],
  // Migration 063: bounded-vocab IN-list facets sourced from real attributes.
  // governmentType + stability were retired (free-text values with no stable
  // vocabulary to match).
  culture: [],
  prosperity: [],
  hasImage: false,
  hasComments: false,
  curatedOnly: false,
  // Boolean facets: a patron deity is present.
  hasDeity: false,
  // Owner import opt-in (gallery_importable, migration 047): narrows to dossiers
  // their owner allowed others to clone.
  importable: false,
  // §5 — "My Settlements": client-only filter that swaps the feed for the
  // owner-scoped list_my_gallery_dossiers RPC (ignored by the public feed's
  // server-side filter normalizer, which allowlists keys).
  mine: false,
});

const PAGE_SIZE = 24;

export function useGalleryPageState(routeSlug = null) {
  const auth = useStore(s => s.auth);
  const savedSettlementsLoaded = useStore(s => s.savedSettlementsLoaded);
  const setSavedSettlements = useStore(s => s.setSavedSettlements);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [sort, setSort] = useState('relevant');
  const [search, setSearch] = useState('');
  // `search` mirrors the input for immediate display; `debouncedSearch` is what
  // the fetch query keys on, so typing a word fires one request rather than one
  // per character. Clearing to empty propagates immediately (see effect below).
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(() => ({ ...EMPTY_GALLERY_FILTERS }));
  const [activeSlug, setActiveSlug] = useState(routeSlug || null);
  const [dossier, setDossier] = useState(null);
  // A ?slug that resolves to a shared MAP rather than a settlement dossier.
  // Map "Copy link" emits /gallery?slug=<mapSlug>, but that slug only resolves
  // through the settlement dossier fetch, which returns null for a map. The
  // openDossier resolver falls back to fetchGalleryMap so the link surfaces the
  // map detail instead of a dead-end. Held separately from `dossier` so the page
  // can route to MapGalleryDetail; settlement slugs leave this null.
  const [mapDetail, setMapDetail] = useState(null);
  const [dossierLoading, setDossierLoading] = useState(false);
  const [dossierError, setDossierError] = useState(null);
  const [voteBusyId, setVoteBusyId] = useState(null);
  const [reportBusyId, setReportBusyId] = useState(null);
  const [importBusyId, setImportBusyId] = useState(null);
  const [importedSlugs, setImportedSlugs] = useState(() => new Set());
  const [actionError, setActionError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Debounce search → query propagation so a fetch fires once typing settles,
  // not on every keystroke. An empty search (clear / backspace-to-empty) skips
  // the delay so resetting the feed feels instant.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- debounce: empty search resets instantly
    if (search === '') { setDebouncedSearch(''); return undefined; }
    const id = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(id);
  }, [search]);

  const galleryQuery = useMemo(
    () => ({ sort, search: debouncedSearch, filters }),
    [sort, debouncedSearch, filters],
  );

  // Generation token: bumped on every query change so an in-flight loadMore
  // (which isn't bound to this effect's lifecycle) can detect a stale query and
  // bail instead of appending stale-query pages onto a fresh result set.
  const queryGenRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const gen = ++queryGenRef.current;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- spinner on query change
    setListLoading(true); // show the spinner immediately on a query change
    const mine = !!galleryQuery.filters?.mine;
    const run = mine
      ? fetchMyGallery()
      : fetchPublicGallery({ page: 0, pageSize: PAGE_SIZE, excludeCurated: false, ...galleryQuery });
    run
      .then(res => {
        if (cancelled || queryGenRef.current !== gen) return;
        setItems(res.items);
        setTotal(res.total ?? res.items.length);
        setHasMore(mine ? false : res.hasMore);
        setPage(0);
        setListError(null);
      })
      .catch(err => {
        if (!cancelled && queryGenRef.current === gen) setListError(err?.message || String(err));
      })
      .finally(() => {
        if (!cancelled && queryGenRef.current === gen) setListLoading(false);
      });
    return () => { cancelled = true; };
  }, [galleryQuery]);

  // Hydrate the viewer's own saved settlements so the gallery owner card can
  // resolve ownership (GalleryDetail matches a save's public_slug to the open
  // dossier). Otherwise only WorldMap / SettlementsPanel hydrate them, so a
  // deep-link, refresh, or post-save reload that lands straight on a gallery URL
  // would leave savedSettlements empty and hide the "Your gallery listing" card
  // until the user bounced through another page. Idempotent — gated on the
  // savedSettlementsLoaded flag (same source savesService the other pages use).
  useEffect(() => {
    if (savedSettlementsLoaded) return;
    let cancelled = false;
    savesService.list()
      .then(loaded => { if (!cancelled) setSavedSettlements(loaded); })
      .catch(err => console.error('[gallery] Failed to hydrate saves:', err));
    return () => { cancelled = true; };
  }, [savedSettlementsLoaded, setSavedSettlements]);

  // The slug whose dossier is currently open or in-flight. The route-sync
  // effect reads this to avoid re-fetching a dossier openDossier just opened:
  // a card click calls openDossier (one fetch) AND navigate(), and that
  // navigate bumps routeSlug → re-runs the effect, which would otherwise fire a
  // second identical fetch. Kept in a ref so it's current synchronously,
  // without re-triggering the effect.
  const openSlugRef = useRef(routeSlug || null);

  const openDossier = useCallback(async (slug, options = {}) => {
    if (!slug) return;
    openSlugRef.current = slug;
    setActiveSlug(slug);
    setDossierLoading(true);
    setDossierError(null);
    setActionError(null);
    setActionNotice(null);
    if (!options.replace) navigate('gallery', { params: { slug } });
    try {
      const next = await fetchPublicDossier(slug);
      if (next) {
        setDossier(next);
        setMapDetail(null);
        return;
      }
      // Kind-aware fallback: the slug isn't a settlement dossier. A published map's
      // "Copy link" emits the same /gallery?slug=<slug> shape, so try the map
      // projection before declaring the link dead. A hit routes the page to
      // MapGalleryDetail (see GalleryPage); a miss keeps the settlement message.
      const map = await fetchGalleryMap(slug);
      if (map) {
        setMapDetail(map);
        setDossier(null);
        return;
      }
      setDossier(null);
      setMapDetail(null);
      setDossierError('This settlement is not available.');
    } catch (err) {
      setDossierError(err?.message || 'This settlement could not be opened.');
      setDossier(null);
      setMapDetail(null);
    } finally {
      setDossierLoading(false);
    }
  }, []);

  useEffect(() => {
    if (routeSlug) {
      // Already open (or loading) for this slug — e.g. openDossier just
      // navigate()'d here. Don't fire a duplicate fetch for what's on screen.
      if (openSlugRef.current === routeSlug) return;
      void Promise.resolve().then(() => openDossier(routeSlug, { replace: true }));
      return;
    }
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (slug) {
      if (openSlugRef.current === slug) return;
      void Promise.resolve().then(() => openDossier(slug, { replace: true }));
      return;
    }
    // No slug in the route (e.g. browser Back from /gallery/:slug → /gallery):
    // close the open dossier so the view matches the URL.
    openSlugRef.current = null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route-sync: close dossier to match URL
    setActiveSlug(null);
    setDossier(null);
    setMapDetail(null);
    setDossierError(null);
  }, [routeSlug, openDossier]);

  const loadMore = useCallback(async () => {
    if (galleryQuery.filters?.mine) return; // My Settlements returns all at once
    const nextPage = page + 1;
    const gen = queryGenRef.current; // snapshot the query generation
    setListLoading(true);
    try {
      const res = await fetchPublicGallery({ page: nextPage, pageSize: PAGE_SIZE, excludeCurated: false, ...galleryQuery });
      // The query changed mid-flight — discard this page rather than appending
      // it onto a now-unrelated result set.
      if (queryGenRef.current !== gen) return;
      setItems(prev => [...prev, ...res.items]);
      setTotal(res.total ?? total);
      setHasMore(res.hasMore);
      setPage(nextPage);
    } catch (err) {
      if (queryGenRef.current === gen) setListError(err?.message || String(err));
    } finally {
      if (queryGenRef.current === gen) setListLoading(false);
    }
  }, [galleryQuery, page, total]);

  const backToList = useCallback(() => {
    openSlugRef.current = null;
    setActiveSlug(null);
    setDossier(null);
    setMapDetail(null);
    setDossierError(null);
    setActionError(null);
    setActionNotice(null);
    navigate('gallery');
  }, []);

  const toggleArrayFilter = useCallback((key, option) => {
    setFilters(current => {
      const set = new Set(current[key] || []);
      if (set.has(option)) set.delete(option);
      else set.add(option);
      return { ...current, [key]: [...set] };
    });
  }, []);

  const toggleBoolFilter = useCallback((key, value) => {
    setFilters(current => ({ ...current, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...EMPTY_GALLERY_FILTERS });
  }, []);

  const voteOn = useCallback(async (item) => {
    if (!auth?.user) {
      setActionError('Sign in to vote on public settlements.');
      setActionNotice(null);
      return;
    }
    if (!item?.id || voteBusyId) return;
    setVoteBusyId(item.id);
    setActionError(null);
    setActionNotice(null);
    try {
      const result = await toggleGalleryVote(item.id);
      setItems(current => current.map(row => row.id === item.id ? { ...row, netVotes: result.netVotes, voted: result.voted } : row));
      setDossier(current => current?.id === item.id
        ? { ...current, netVotes: result.netVotes, voteState: { netVotes: result.netVotes, voted: result.voted } }
        : current);
    } catch (err) {
      setActionError(err?.message || 'Vote could not be saved.');
    } finally {
      setVoteBusyId(null);
    }
  }, [auth?.user, voteBusyId]);

  const reportOn = useCallback(async (item, reason = 'other', body = '') => {
    if (!auth?.user) {
      setActionError('Sign in to report public settlements.');
      setActionNotice(null);
      return false;
    }
    if (!item?.id || reportBusyId) return false;
    setReportBusyId(item.id);
    setActionError(null);
    setActionNotice(null);
    try {
      await reportGalleryDossier(item.id, reason, body);
      setActionNotice('Report sent to the moderation queue.');
      return true;
    } catch (err) {
      setActionError(err?.message || 'Report could not be sent.');
      return false;
    } finally {
      setReportBusyId(null);
    }
  }, [auth?.user, reportBusyId]);

  const importDossier = useCallback(async (item) => {
    if (!auth?.user) {
      setActionError('Sign in to import settlements into your library.');
      setActionNotice(null);
      return;
    }
    const slug = item?.slug;
    if (!slug || importBusyId) return;
    setImportBusyId(slug);
    setActionError(null);
    setActionNotice(null);
    try {
      await useStore.getState().importGallerySettlement(slug);
      setImportedSlugs(prev => new Set(prev).add(slug));
      setActionNotice('Imported to your library.');
    } catch (err) {
      setActionError(err?.message || 'Import could not be completed.');
    } finally {
      setImportBusyId(null);
    }
  }, [auth?.user, importBusyId]);

  const setDossierCommentCount = useCallback((count) => {
    const nextCount = Math.max(0, Number(count) || 0);
    setDossier(current => current ? { ...current, commentCount: nextCount } : current);
    setItems(current => current.map(row => row.id === dossier?.id ? { ...row, commentCount: nextCount } : row));
  }, [dossier?.id]);

  return {
    auth,
    items,
    total,
    hasMore,
    listLoading,
    listError,
    sort,
    setSort,
    search,
    setSearch,
    filters,
    activeSlug,
    dossier,
    mapDetail,
    dossierLoading,
    dossierError,
    voteBusyId,
    reportBusyId,
    importBusyId,
    importedSlugs,
    actionError,
    actionNotice,
    loadMore,
    openDossier,
    backToList,
    toggleArrayFilter,
    toggleBoolFilter,
    clearFilters,
    voteOn,
    reportOn,
    importDossier,
    setDossierCommentCount,
  };
}
