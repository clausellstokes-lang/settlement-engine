/**
 * OperatorMessagesProvider.jsx — one caller-scoped message truth for chrome and
 * the Account page. Owner changes clear the published snapshot immediately;
 * request generations prevent a late response for account A reaching account B.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../store/index.js';
import { authSessionIdentity } from '../../lib/authSessionFence.js';
import * as operatorMessagesService from '../../lib/operatorMessages.js';

const PAGE_SIZE = operatorMessagesService.OPERATOR_MESSAGE_PAGE_SIZE || 100;

const EMPTY_VALUE = Object.freeze({
  messages: Object.freeze([]),
  unreadCount: 0,
  loading: false,
  loadingMore: false,
  hasMore: false,
  error: null,
  refresh: async () => [],
  loadMore: async () => [],
  markRead: async () => false,
});

const OperatorMessagesContext = createContext(EMPTY_VALUE);

export function useOperatorMessages() {
  return useContext(OperatorMessagesContext);
}

function currentAuthKey() {
  const auth = useStore.getState().auth;
  const ownerId = auth?.user?.id || null;
  return { ownerId, sessionKey: authSessionIdentity(auth) || ownerId };
}

export default function OperatorMessagesProvider({ children, service = operatorMessagesService }) {
  const auth = useStore(state => state.auth);
  const ownerId = auth?.user?.id || null;
  const authLoading = auth?.loading === true;
  const sessionKey = authSessionIdentity(auth) || ownerId;
  const requestRef = useRef(0);
  const refreshFlightRef = useRef(null);
  const moreFlightRef = useRef(null);
  const markFlightRef = useRef(new Map());
  const authBoundaryRef = useRef({ ownerId, sessionKey, authLoading });
  const priorBoundary = authBoundaryRef.current;
  if (priorBoundary.ownerId !== ownerId || priorBoundary.sessionKey !== sessionKey
    || priorBoundary.authLoading !== authLoading) {
    // Ref-only invalidation is safe during render and must precede child effects:
    // a Messages-section refresh for the new owner may run before this provider's
    // effect. Clearing here lets that request become the one deduplicated flight.
    requestRef.current += 1;
    refreshFlightRef.current = null;
    moreFlightRef.current = null;
    markFlightRef.current.clear();
    authBoundaryRef.current = { ownerId, sessionKey, authLoading };
  }
  const [snapshot, setSnapshot] = useState({
    ownerId: null,
    sessionKey: null,
    messages: [],
    unreadCount: 0,
    loading: false,
    loadingMore: false,
    hasMore: false,
    error: null,
  });
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  const refresh = useCallback(async () => {
    const requestOwner = ownerId;
    const requestSessionKey = sessionKey;
    if (!requestOwner || authLoading) {
      return [];
    }
    const existing = refreshFlightRef.current;
    if (existing?.ownerId === requestOwner && existing?.sessionKey === requestSessionKey) {
      return existing.promise;
    }

    const requestId = ++requestRef.current;
    const flight = { ownerId: requestOwner, sessionKey: requestSessionKey, promise: null };
    refreshFlightRef.current = flight;

    setSnapshot(current => ({
      ownerId: requestOwner,
      sessionKey: requestSessionKey,
      messages: current.ownerId === requestOwner && current.sessionKey === requestSessionKey
        ? current.messages : [],
      unreadCount: current.ownerId === requestOwner && current.sessionKey === requestSessionKey
        ? current.unreadCount : 0,
      loading: true,
      loadingMore: false,
      hasMore: current.ownerId === requestOwner && current.sessionKey === requestSessionKey
        ? current.hasMore : false,
      error: null,
    }));
    flight.promise = (async () => {
      try {
        const [messages, unreadCount] = await Promise.all([
          service.listMyOperatorMessages({ limit: PAGE_SIZE }),
          service.getMyOperatorUnreadCount(),
        ]);
        const current = currentAuthKey();
        if (requestRef.current !== requestId || current.ownerId !== requestOwner
          || current.sessionKey !== requestSessionKey) return [];
        const next = Array.isArray(messages) ? messages : [];
        setSnapshot({
          ownerId: requestOwner,
          sessionKey: requestSessionKey,
          messages: next,
          unreadCount: Number.isInteger(unreadCount) && unreadCount >= 0 ? unreadCount : 0,
          loading: false,
          loadingMore: false,
          hasMore: next.length === PAGE_SIZE,
          error: null,
        });
        return next;
      } catch (caught) {
        const current = currentAuthKey();
        if (requestRef.current === requestId && current.ownerId === requestOwner
          && current.sessionKey === requestSessionKey) {
          setSnapshot(previous => previous.ownerId === requestOwner
            && previous.sessionKey === requestSessionKey
            ? {
                ...previous,
                loading: false,
                loadingMore: false,
                error: caught?.message || 'Messages could not be loaded.',
              }
            : {
                ownerId: requestOwner,
                sessionKey: requestSessionKey,
                messages: [],
                unreadCount: 0,
                loading: false,
                loadingMore: false,
                hasMore: false,
                error: caught?.message || 'Messages could not be loaded.',
              });
        }
        return [];
      } finally {
        if (refreshFlightRef.current === flight) refreshFlightRef.current = null;
      }
    })();
    return flight.promise;
  }, [authLoading, ownerId, service, sessionKey]);

  useEffect(() => {
    // Invalidate first so a previous owner's response and rendered rows cannot
    // survive even one completed effect cycle after a sign-out/account switch.
    if (!ownerId || authLoading) {
      setSnapshot({
        ownerId: null,
        sessionKey: null,
        messages: [],
        unreadCount: 0,
        loading: false,
        loadingMore: false,
        hasMore: false,
        error: null,
      });
      return undefined;
    }
    refresh();
    return undefined;
  }, [authLoading, ownerId, refresh, sessionKey]);

  useEffect(() => () => {
      requestRef.current += 1;
      refreshFlightRef.current = null;
      moreFlightRef.current = null;
      markFlightRef.current.clear();
  }, []);

  useEffect(() => {
    if (!ownerId || authLoading || typeof window === 'undefined') return undefined;
    const onFocus = () => { refresh(); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [authLoading, ownerId, refresh]);

  const snapshotMatches = snapshot.ownerId === ownerId && snapshot.sessionKey === sessionKey;
  const visibleMessages = useMemo(
    () => snapshotMatches ? snapshot.messages : [],
    [snapshot.messages, snapshotMatches],
  );
  const visibleLoading = Boolean(authLoading || (ownerId && (!snapshotMatches || snapshot.loading)));
  const visibleError = snapshotMatches ? snapshot.error : null;
  const visibleUnreadCount = snapshotMatches ? snapshot.unreadCount : 0;
  const visibleLoadingMore = snapshotMatches ? snapshot.loadingMore : false;
  const visibleHasMore = snapshotMatches ? snapshot.hasMore : false;

  const loadMore = useCallback(async () => {
    const requestOwner = ownerId;
    const requestSessionKey = sessionKey;
    const currentSnapshot = snapshotRef.current;
    if (!requestOwner || authLoading || currentSnapshot.loading
      || refreshFlightRef.current || currentSnapshot.ownerId !== requestOwner
      || currentSnapshot.sessionKey !== requestSessionKey || !currentSnapshot.hasMore) return [];

    const existing = moreFlightRef.current;
    if (existing?.ownerId === requestOwner && existing?.sessionKey === requestSessionKey) {
      return existing.promise;
    }
    const last = currentSnapshot.messages[currentSnapshot.messages.length - 1];
    if (!last?.createdAt || !last?.id) {
      setSnapshot(previous => previous.ownerId === requestOwner
        && previous.sessionKey === requestSessionKey
        ? { ...previous, hasMore: false, error: 'Messages returned an invalid pagination cursor.' }
        : previous);
      return [];
    }

    const requestId = requestRef.current;
    const flight = { ownerId: requestOwner, sessionKey: requestSessionKey, promise: null };
    moreFlightRef.current = flight;
    setSnapshot(previous => previous.ownerId === requestOwner
      && previous.sessionKey === requestSessionKey
      ? { ...previous, loadingMore: true, error: null }
      : previous);
    flight.promise = (async () => {
      try {
        const page = await service.listMyOperatorMessages({
          limit: PAGE_SIZE,
          beforeCreatedAt: last.createdAt,
          beforeId: last.id,
        });
        const current = currentAuthKey();
        if (requestRef.current !== requestId || current.ownerId !== requestOwner
          || current.sessionKey !== requestSessionKey) return [];
        const next = Array.isArray(page) ? page : [];
        setSnapshot(previous => {
          if (previous.ownerId !== requestOwner || previous.sessionKey !== requestSessionKey) return previous;
          const knownIds = new Set(previous.messages.map(message => message.id));
          const appended = next.filter(message => !knownIds.has(message.id));
          return {
            ...previous,
            messages: [...previous.messages, ...appended],
            loadingMore: false,
            hasMore: next.length === PAGE_SIZE,
            error: null,
          };
        });
        return next;
      } catch (caught) {
        const current = currentAuthKey();
        if (requestRef.current === requestId && current.ownerId === requestOwner
          && current.sessionKey === requestSessionKey) {
          setSnapshot(previous => previous.ownerId === requestOwner
            && previous.sessionKey === requestSessionKey
            ? { ...previous, loadingMore: false, error: caught?.message || 'More messages could not be loaded.' }
            : previous);
        }
        return [];
      } finally {
        if (moreFlightRef.current === flight) moreFlightRef.current = null;
      }
    })();
    return flight.promise;
  }, [authLoading, ownerId, service, sessionKey]);

  const markRead = useCallback((messageId) => {
    const requestOwner = ownerId;
    const requestSessionKey = sessionKey;
    const target = visibleMessages.find(message => message.id === messageId);
    if (!requestOwner || !target || target.readAt) return Promise.resolve(false);

    const existing = markFlightRef.current.get(messageId);
    if (existing?.ownerId === requestOwner && existing?.sessionKey === requestSessionKey) {
      return existing.promise;
    }
    const flight = { ownerId: requestOwner, sessionKey: requestSessionKey, promise: null };
    flight.promise = (async () => {
      try {
        const readAt = await service.markOperatorMessageRead(messageId);
        const currentAuth = currentAuthKey();
        if (currentAuth.ownerId !== requestOwner || currentAuth.sessionKey !== requestSessionKey) return false;

        // A read mutation outranks any older list/count snapshot. Invalidate
        // refresh/load-more continuations before publishing the transition so a
        // delayed response cannot resurrect the unread row or count.
        requestRef.current += 1;
        refreshFlightRef.current = null;
        moreFlightRef.current = null;
        setSnapshot(current => {
          if (current.ownerId !== requestOwner || current.sessionKey !== requestSessionKey) return current;
          const currentMessage = current.messages.find(message => message.id === messageId);
          const unreadTransition = Boolean(currentMessage && !currentMessage.readAt);
          return {
            ...current,
            messages: current.messages.map(message => message.id === messageId
              ? Object.freeze({ ...message, readAt: readAt || new Date().toISOString() })
              : message),
            unreadCount: unreadTransition ? Math.max(0, current.unreadCount - 1) : current.unreadCount,
            loading: false,
            loadingMore: false,
            error: null,
          };
        });
        return true;
      } catch (caught) {
        const currentAuth = currentAuthKey();
        if (currentAuth.ownerId === requestOwner && currentAuth.sessionKey === requestSessionKey) {
          setSnapshot(current => current.ownerId !== requestOwner || current.sessionKey !== requestSessionKey
            ? current
            : ({ ...current, error: caught?.message || 'This message could not be marked read.' }));
        }
        throw caught;
      } finally {
        if (markFlightRef.current.get(messageId) === flight) markFlightRef.current.delete(messageId);
      }
    })();
    markFlightRef.current.set(messageId, flight);
    return flight.promise;
  }, [ownerId, service, sessionKey, visibleMessages]);

  const value = useMemo(() => ({
    messages: visibleMessages,
    unreadCount: visibleUnreadCount,
    loading: visibleLoading,
    loadingMore: visibleLoadingMore,
    hasMore: visibleHasMore,
    error: visibleError,
    refresh,
    loadMore,
    markRead,
  }), [loadMore, markRead, refresh, visibleError, visibleHasMore, visibleLoading,
    visibleLoadingMore, visibleMessages, visibleUnreadCount]);

  return <OperatorMessagesContext.Provider value={value}>{children}</OperatorMessagesContext.Provider>;
}
