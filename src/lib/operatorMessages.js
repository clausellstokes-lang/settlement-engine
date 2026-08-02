/**
 * operatorMessages.js — caller-scoped Operator Messages service.
 *
 * The database owns audience expansion, receipt visibility, and read authority.
 * This client only calls the two own-data RPCs and normalizes their rows into a
 * small camel-case contract for the shared provider. An unconfigured backend is
 * an unavailable inbox, never an empty one.
 */
import { isConfigured, supabase } from './supabase.js';

const MESSAGE_KINDS = new Set(['broadcast', 'direct']);
const MESSAGE_CLASSES = new Set(['service', 'announcement']);
const SENDER_ROLES = new Set(['admin', 'developer', 'system']);
export const OPERATOR_MESSAGE_PAGE_SIZE = 100;

function text(value) {
  return typeof value === 'string' ? value : '';
}

function nullableText(value) {
  return typeof value === 'string' && value ? value : null;
}

function messageRows(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.messages)) return data.messages;
  return data && typeof data === 'object' ? [data] : [];
}

/** Normalize one RPC row; invalid closed-vocabulary rows fail closed. */
export function normalizeOperatorMessage(row) {
  if (!row || typeof row !== 'object') return null;
  const id = text(row.id || row.message_id || row.messageId).trim();
  const kind = text(row.kind).trim();
  const messageClass = text(row.class || row.message_class || row.messageClass).trim();
  const senderRole = text(row.sender_role || row.senderRole).trim();
  const subject = text(row.subject).trim();
  const body = text(row.body);

  if (!id || !subject || !body.trim() || !MESSAGE_KINDS.has(kind)
    || !MESSAGE_CLASSES.has(messageClass) || !SENDER_ROLES.has(senderRole)) {
    return null;
  }

  return Object.freeze({
    id,
    kind,
    messageClass,
    senderRole,
    subject,
    body,
    createdAt: nullableText(row.created_at || row.createdAt),
    deliveredAt: nullableText(row.delivered_at || row.deliveredAt),
    readAt: nullableText(row.read_at || row.readAt),
    dismissedAt: nullableText(row.dismissed_at || row.dismissedAt),
  });
}

function newestFirst(a, b) {
  const aTime = Date.parse(a.createdAt || a.deliveredAt || '') || 0;
  const bTime = Date.parse(b.createdAt || b.deliveredAt || '') || 0;
  return bTime - aTime || b.id.localeCompare(a.id);
}

function requireClient() {
  if (!isConfigured || !supabase) {
    throw new Error('Messages are unavailable in this environment.');
  }
  return supabase;
}

/**
 * Read one keyset-paginated page of the caller's visible messages, newest first.
 * The timestamp and id cursor are one indivisible tuple so equal timestamps can
 * neither skip nor repeat a row.
 */
export async function listMyOperatorMessages({
  limit = OPERATOR_MESSAGE_PAGE_SIZE,
  beforeCreatedAt = null,
  beforeId = null,
} = {}) {
  const pageLimit = Number(limit);
  if (!Number.isInteger(pageLimit) || pageLimit < 1 || pageLimit > 200) {
    throw new Error('Messages require a page limit from 1 to 200.');
  }
  const hasCreatedAt = typeof beforeCreatedAt === 'string' && beforeCreatedAt.trim();
  const hasId = typeof beforeId === 'string' && beforeId.trim();
  if (Boolean(hasCreatedAt) !== Boolean(hasId)) {
    throw new Error('Messages require a complete pagination cursor.');
  }
  const client = requireClient();
  const { data, error } = await client.rpc('list_my_operator_messages', {
    p_limit: pageLimit,
    p_before_created_at: hasCreatedAt ? beforeCreatedAt.trim() : null,
    p_before_id: hasId ? beforeId.trim() : null,
  });
  if (error) throw error;
  return messageRows(data).map(normalizeOperatorMessage).filter(Boolean).sort(newestFirst);
}

/** Read the authoritative unread receipt count (not merely the loaded page). */
export async function getMyOperatorUnreadCount() {
  const client = requireClient();
  const { data, error } = await client.rpc('get_my_operator_unread_count');
  if (error) throw error;
  const value = Number(Array.isArray(data) ? data[0] : data);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('Messages returned an invalid unread count.');
  }
  return value;
}

/** Mark one visible message read for the signed-in caller. */
export async function markOperatorMessageRead(messageId) {
  const id = text(messageId).trim();
  if (!id) throw new Error('A message id is required.');
  const client = requireClient();
  const { data, error } = await client.rpc('mark_operator_message_read', { p_message_id: id });
  if (error) throw error;
  const row = messageRows(data).map(normalizeOperatorMessage).find(Boolean);
  return row?.readAt || nullableText(data?.read_at || data?.readAt) || new Date().toISOString();
}
