import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  fetchPublicDossier,
  fetchPublicGallery,
  reportGalleryDossier,
  toggleGalleryVote,
} from '../lib/gallery.js';
import { navigate } from './useRoute.js';
import { useStore } from '../store/index.js';

export const EMPTY_GALLERY_FILTERS = Object.freeze({
  tier: [],
  terrain: [],
  governmentType: [],
  magicLevel: [],
  stability: [],
  hasImage: false,
  hasComments: false,
  curatedOnly: false,
});

const PAGE_SIZE = 24;

export function useGalleryPageState(routeSlug = null) {
  const auth = useStore(s => s.auth);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [sort, setSort] = useState('relevant');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(() => ({ ...EMPTY_GALLERY_FILTERS }));
  const [activeSlug, setActiveSlug] = useState(routeSlug || null);
  const [dossier, setDossier] = useState(null);
  const [dossierLoading, setDossierLoading] = useState(false);
  const [dossierError, setDossierError] = useState(null);
  const [voteBusyId, setVoteBusyId] = useState(null);
  const [reportBusyId, setReportBusyId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const galleryQuery = useMemo(() => ({ sort, search, filters }), [sort, search, filters]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicGallery({ page: 0, pageSize: PAGE_SIZE, excludeCurated: false, ...galleryQuery })
      .then(res => {
        if (cancelled) return;
        setItems(res.items);
        setTotal(res.total ?? res.items.length);
        setHasMore(res.hasMore);
        setPage(0);
        setListError(null);
      })
      .catch(err => {
        if (!cancelled) setListError(err?.message || String(err));
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => { cancelled = true; };
  }, [galleryQuery]);

  const openDossier = useCallback(async (slug, options = {}) => {
    if (!slug) return;
    setActiveSlug(slug);
    setDossierLoading(true);
    setDossierError(null);
    setActionError(null);
    setActionNotice(null);
    if (!options.replace) navigate('gallery', { params: { slug } });
    try {
      const next = await fetchPublicDossier(slug);
      setDossier(next);
      if (!next) setDossierError('This settlement is not available.');
    } catch (err) {
      setDossierError(err?.message || 'This settlement could not be opened.');
      setDossier(null);
    } finally {
      setDossierLoading(false);
    }
  }, []);

  useEffect(() => {
    if (routeSlug) {
      void Promise.resolve().then(() => openDossier(routeSlug, { replace: true }));
      return;
    }
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (slug) void Promise.resolve().then(() => openDossier(slug, { replace: true }));
  }, [routeSlug, openDossier]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setListLoading(true);
    try {
      const res = await fetchPublicGallery({ page: nextPage, pageSize: PAGE_SIZE, excludeCurated: false, ...galleryQuery });
      setItems(prev => [...prev, ...res.items]);
      setTotal(res.total ?? total);
      setHasMore(res.hasMore);
      setPage(nextPage);
    } catch (err) {
      setListError(err?.message || String(err));
    } finally {
      setListLoading(false);
    }
  }, [galleryQuery, page, total]);

  const backToList = useCallback(() => {
    setActiveSlug(null);
    setDossier(null);
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
    dossierLoading,
    dossierError,
    voteBusyId,
    reportBusyId,
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
    setDossierCommentCount,
  };
}
